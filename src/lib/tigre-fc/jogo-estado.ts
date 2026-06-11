// Máquina de estados do jogo do Tigrão
// Toda lógica de "qual jogo escalar" fica aqui — nunca id fixo

import { supabaseAdmin } from '@/lib/supabase-admin';

export type EstadoJogo =
  | 'agendado'           // publicado, escalação ainda não abriu
  | 'escalacao_aberta'   // pode escalar
  | 'escalacao_fechada'  // kickoff passou, aguardando apito
  | 'ao_vivo'            // em andamento
  | 'encerrado'          // apito final, aguardando pontuação
  | 'pontuado';          // cron de pontuação rodou

export interface JogoAtivo {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  mandante_slug: string;
  visitante_slug: string;
  local: string | null;
  transmissao: string | null;
  placar_mandante: number | null;
  placar_visitante: number | null;
  status: string;
  pontuado: boolean;
  estado: EstadoJogo;
  deadline: string;        // ISO — momento em que a escalação fecha
  segundos_para_fechar: number | null;
}

function calcDeadline(dataHora: string): Date {
  const kickoff = new Date(dataHora);
  const minutosAntes = Number(process.env.DEADLINE_MIN_ANTES ?? '0');
  return new Date(kickoff.getTime() - minutosAntes * 60 * 1000);
}

function derivaEstado(jogo: {
  data_hora: string;
  status: string;
  pontuado: boolean;
}): EstadoJogo {
  if (jogo.pontuado) return 'pontuado';
  if (jogo.status === 'encerrado') return 'encerrado';
  if (jogo.status === 'ao_vivo')   return 'ao_vivo';
  if (jogo.status === 'adiado')    return 'agendado'; // trata como agendado

  const now = Date.now();
  const deadline = calcDeadline(jogo.data_hora).getTime();

  if (now >= deadline) return 'escalacao_fechada';
  return 'escalacao_aberta';
}

/** Retorna o próximo jogo escalável (escalacao_aberta) ou null */
export async function getProximoJogoEscalavel(): Promise<JogoAtivo | null> {
  const now = new Date().toISOString();

  // Jogos futuros ou ao_vivo, não pontuados, ordenados por data
  const { data: jogos, error } = await supabaseAdmin
    .from('jogos')
    .select('id,competicao,rodada,data_hora,mandante_slug,visitante_slug,local,transmissao,placar_mandante,placar_visitante,status,pontuado')
    .eq('pontuado', false)
    .eq('status', 'agendado')
    .order('data_hora', { ascending: true })
    .limit(5);

  if (error) throw error;

  for (const jogo of jogos ?? []) {
    const estado = derivaEstado(jogo as { data_hora: string; status: string; pontuado: boolean });
    if (estado === 'escalacao_aberta') {
      const deadline = calcDeadline(jogo.data_hora);
      const segsParaFechar = Math.max(0, Math.floor((deadline.getTime() - Date.now()) / 1000));
      return {
        ...jogo,
        estado,
        deadline: deadline.toISOString(),
        segundos_para_fechar: segsParaFechar,
      } as JogoAtivo;
    }
  }

  return null;
}

/** Retorna o jogo mais recente com estado 'encerrado' ou 'ao_vivo' */
export async function getJogoAtivo(): Promise<JogoAtivo | null> {
  const { data: jogos, error } = await supabaseAdmin
    .from('jogos')
    .select('id,competicao,rodada,data_hora,mandante_slug,visitante_slug,local,transmissao,placar_mandante,placar_visitante,status,pontuado')
    .in('status', ['ao_vivo', 'encerrado'])
    .eq('pontuado', false)
    .order('data_hora', { ascending: false })
    .limit(1);

  if (error) throw error;
  if (!jogos?.length) return null;

  const jogo = jogos[0];
  const estado = derivaEstado(jogo as { data_hora: string; status: string; pontuado: boolean });
  const deadline = calcDeadline(jogo.data_hora);

  return {
    ...jogo,
    estado,
    deadline: deadline.toISOString(),
    segundos_para_fechar: null,
  } as JogoAtivo;
}

/** Verifica se uma escalação pode ser salva agora para este jogo */
export function isEscalacaoAberta(dataHora: string): boolean {
  return Date.now() < calcDeadline(dataHora).getTime();
}
