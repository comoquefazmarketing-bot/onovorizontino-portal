// src/lib/agents/DealerAgent.ts
// Bruno — Agente de Growth & Retention do ecossistema TigreFC / O Novorizontino.
// Identifica torcedores inativos e cria notificações push personalizadas no jargão Makarios.

import { supabase } from '@/lib/supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface UsuarioInativo {
  user_id: string;
  apelido: string | null;
  ultima_escalacao: string | null;   // ISO timestamp
  horas_sem_escalar: number;
}

export interface PushPayload {
  user_id: string;
  titulo: string;
  corpo: string;
  url: string;
  criado_em: string;
}

export interface CampanhaResult {
  total_inativos: number;
  notificacoes: PushPayload[];
  timestamp: string;
}

// ─── Templates de notificação ────────────────────────────────────────────────

const PUSH_TEMPLATES = [
  {
    titulo: '🐯 Vem com o Makarios!',
    corpo:  'Sua escalação está te esperando, {apelido}. O Tigre não espera por ninguém.',
  },
  {
    titulo: '⚽ Cadê sua escalação?',
    corpo:  '{apelido}, o TigreFC sente sua falta. Escala seu time antes do apito inicial!',
  },
  {
    titulo: '❄️ Polo Sul chama, {apelido}!',
    corpo:  'Lá fora tá {temp}°C e você ainda não escalou. Isso não é Nível Makarios.',
  },
  {
    titulo: '🔥 Falta você no campo!',
    corpo:  'Todo mundo já escalou menos você, {apelido}. Não deixa o Tigre na mão.',
  },
  {
    titulo: '⏰ Últimas horas pra escalar!',
    corpo:  '{apelido}, o jogo tá chegando. Entra no TigreFC e monta sua equipe agora.',
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolar(template: string, ctx: { apelido: string; temp?: number }): string {
  return template
    .replace(/{apelido}/g, ctx.apelido || 'Torcedor')
    .replace(/{temp}/g, String(ctx.temp ?? 20));
}

// ─── Detecta usuários inativos ────────────────────────────────────────────────

/**
 * Retorna usuários que não escalaram nas últimas `horas` horas.
 * Cruza tigre_fc_usuarios com tigre_fc_escalacoes para achar os inativos.
 */
export async function detectarInativos(horas = 48): Promise<UsuarioInativo[]> {
  const cutoff = new Date(Date.now() - horas * 60 * 60 * 1000).toISOString();

  // Busca todos os usuários
  const { data: usuarios, error: errU } = await supabase
    .from('tigre_fc_usuarios')
    .select('user_id, apelido');

  if (errU || !usuarios) {
    console.error('[Bruno] Erro ao buscar usuários:', errU);
    return [];
  }

  // Busca última escalação de cada user
  const { data: escalacoes, error: errE } = await supabase
    .from('tigre_fc_escalacoes')
    .select('user_id, criado_em')
    .order('criado_em', { ascending: false });

  if (errE) {
    console.error('[Bruno] Erro ao buscar escalações:', errE);
    return [];
  }

  // Mapeia última escalação por user_id
  const ultimaEscalacao = new Map<string, string>();
  for (const e of (escalacoes ?? []) as { user_id: string; criado_em: string }[]) {
    if (!ultimaEscalacao.has(e.user_id)) {
      ultimaEscalacao.set(e.user_id, e.criado_em);
    }
  }

  const agora = Date.now();
  const inativos: UsuarioInativo[] = [];

  for (const u of usuarios as { user_id: string; apelido: string | null }[]) {
    const ultima = ultimaEscalacao.get(u.user_id) ?? null;
    const horasSem = ultima
      ? (agora - new Date(ultima).getTime()) / 3_600_000
      : Infinity;

    if (horasSem >= horas || ultima === null) {
      inativos.push({
        user_id:          u.user_id,
        apelido:          u.apelido,
        ultima_escalacao: ultima,
        horas_sem_escalar: Math.round(horasSem === Infinity ? 9999 : horasSem),
      });
    }
  }

  console.log(`[Bruno] ${inativos.length} inativos detectados (>${horas}h sem escalar).`);
  return inativos;
}

// ─── Gera notificações ────────────────────────────────────────────────────────

/**
 * Gera payloads de push personalizados para cada usuário inativo.
 * Persiste na tabela tigre_fc_push_queue se existir.
 */
export async function gerarNotificacoes(
  inativos: UsuarioInativo[],
  temperatura?: number,
): Promise<PushPayload[]> {
  if (inativos.length === 0) return [];

  const payloads: PushPayload[] = inativos.map(u => {
    const tpl = pick(PUSH_TEMPLATES);
    const apelido = u.apelido ?? 'Torcedor';
    return {
      user_id:   u.user_id,
      titulo:    interpolar(tpl.titulo, { apelido, temp: temperatura }),
      corpo:     interpolar(tpl.corpo,  { apelido, temp: temperatura }),
      url:       '/tigre-fc/escalar',
      criado_em: new Date().toISOString(),
    };
  });

  // Tenta inserir na fila — falha silenciosa se tabela não existir ainda
  const { error } = await supabase
    .from('tigre_fc_push_queue')
    .insert(payloads);

  if (error) {
    console.warn('[Bruno] tigre_fc_push_queue não encontrada — payloads apenas em memória.', error.message);
  } else {
    console.log(`[Bruno] ${payloads.length} notificações enfileiradas com sucesso.`);
  }

  return payloads;
}

// ─── Campanha completa ────────────────────────────────────────────────────────

export async function rodarCampanha(horas = 48, temperatura?: number): Promise<CampanhaResult> {
  console.log(`[Bruno] Iniciando campanha de retenção — janela: ${horas}h...`);
  const inativos = await detectarInativos(horas);
  const notificacoes = await gerarNotificacoes(inativos, temperatura);
  return {
    total_inativos: inativos.length,
    notificacoes,
    timestamp: new Date().toISOString(),
  };
}

// ─── DealerAgent ─────────────────────────────────────────────────────────────

export const DealerAgent = {
  name: 'Bruno',
  role: 'Growth & Retention',
  version: '1.0.0',

  /** Detecta usuários que não escalaram nos últimos N horas (padrão: 48h). */
  detectarInativos,

  /** Gera payloads de push personalizados e enfileira no Supabase. */
  gerarNotificacoes,

  /** Roda a campanha completa de retenção. */
  rodarCampanha,

  /** Log padronizado no estilo Bruno. */
  log(msg: string): void {
    console.log(`[Bruno @ ${new Date().toISOString()}] 📣 ${msg}`);
  },
} as const;
