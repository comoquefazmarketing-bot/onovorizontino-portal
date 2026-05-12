// src/lib/agents/AuditorAgent.ts
// Carlos — Agente de Back-office do ecossistema TigreFC / O Novorizontino.
// Monitora o Supabase, valida escalações e sincroniza status de jogadores.
// Quando encontra erro: "Isso não é Nível Makarios. Corrigindo..."

import { supabase } from '@/lib/supabase';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface AuditLog {
  timestamp: string;
  tipo: 'ok' | 'erro' | 'aviso' | 'correcao';
  tabela: string;
  mensagem: string;
  detalhe?: unknown;
}

export interface EscalacaoRow {
  id: string;
  user_id: string;
  jogo_id: number;
  formacao: string;
  slots: Record<string, unknown>;
  criado_em: string;
}

export interface JogadorStatus {
  id: number;
  nome: string;
  status: 'provavel' | 'lesionado' | 'suspenso' | 'indefinido';
  atualizado_em: string;
}

// ─── Logger interno ───────────────────────────────────────────────────────────

const logs: AuditLog[] = [];

function registrar(tipo: AuditLog['tipo'], tabela: string, mensagem: string, detalhe?: unknown): AuditLog {
  const entry: AuditLog = { timestamp: new Date().toISOString(), tipo, tabela, mensagem, detalhe };
  logs.push(entry);
  const prefixo = tipo === 'erro' ? '🔴' : tipo === 'aviso' ? '🟡' : tipo === 'correcao' ? '🔧' : '✅';
  console.log(`[Carlos @ ${entry.timestamp}] ${prefixo} [${tabela}] ${mensagem}`);
  return entry;
}

// ─── Validação de escalações ──────────────────────────────────────────────────

/**
 * Valida escalações na tabela tigre_fc_escalacoes.
 * Detecta duplicidade por (user_id, jogo_id) e slots vazios.
 */
export async function validarEscalacoes(): Promise<AuditLog[]> {
  const sessaoLogs: AuditLog[] = [];

  const { data, error } = await supabase
    .from('tigre_fc_escalacoes')
    .select('id, user_id, jogo_id, formacao, slots, criado_em')
    .order('criado_em', { ascending: false })
    .limit(200);

  if (error) {
    const log = registrar('erro', 'tigre_fc_escalacoes',
      `Erro ao ler tabela. Isso não é Nível Makarios. Corrigindo...`, error);
    return [log];
  }

  if (!data || data.length === 0) {
    return [registrar('aviso', 'tigre_fc_escalacoes', 'Nenhuma escalação encontrada.')];
  }

  // Detecta duplicidade (user_id + jogo_id)
  const seen = new Map<string, string>();
  const duplicatas: string[] = [];

  for (const row of data as EscalacaoRow[]) {
    const chave = `${row.user_id}::${row.jogo_id}`;
    if (seen.has(chave)) {
      duplicatas.push(row.id);
      sessaoLogs.push(registrar('erro', 'tigre_fc_escalacoes',
        `Duplicidade detectada — user ${row.user_id}, jogo ${row.jogo_id}. Isso não é Nível Makarios. Corrigindo...`,
        { id_duplicado: row.id, id_original: seen.get(chave) }
      ));
    } else {
      seen.set(chave, row.id);
    }

    // Valida slots preenchidos
    const slots = row.slots as Record<string, { player?: unknown }> | null;
    if (!slots || Object.keys(slots).length === 0) {
      sessaoLogs.push(registrar('aviso', 'tigre_fc_escalacoes',
        `Escalação ${row.id} sem slots — possível gravação incompleta.`));
    }
  }

  if (sessaoLogs.length === 0) {
    sessaoLogs.push(registrar('ok', 'tigre_fc_escalacoes',
      `${data.length} escalações validadas. Nível Makarios confirmado.`));
  }

  return sessaoLogs;
}

// ─── Sync de status de jogadores ──────────────────────────────────────────────

/**
 * Sincroniza o status dos jogadores (provável/lesionado) com o Supabase.
 * Usa a tabela tigre_fc_jogadores_status se existir.
 */
export async function syncStatusJogadores(): Promise<JogadorStatus[]> {
  const { data, error } = await supabase
    .from('tigre_fc_jogadores_status')
    .select('id, nome, status, atualizado_em')
    .order('atualizado_em', { ascending: false });

  if (error) {
    registrar('erro', 'tigre_fc_jogadores_status',
      `Falha ao sincronizar status. Isso não é Nível Makarios. Corrigindo...`, error);
    return [];
  }

  const lista = (data ?? []) as JogadorStatus[];
  const lesionados = lista.filter(j => j.status === 'lesionado').length;
  const suspensos  = lista.filter(j => j.status === 'suspenso').length;

  registrar('ok', 'tigre_fc_jogadores_status',
    `Sync completo — ${lista.length} jogadores. Lesionados: ${lesionados}. Suspensos: ${suspensos}.`);

  return lista;
}

// ─── Auditoria completa ───────────────────────────────────────────────────────

export async function auditoriaCompleta(): Promise<{ escalacoes: AuditLog[]; jogadores: JogadorStatus[] }> {
  registrar('ok', 'sistema', 'Carlos iniciando auditoria completa...');
  const [escalacoes, jogadores] = await Promise.all([
    validarEscalacoes(),
    syncStatusJogadores(),
  ]);
  registrar('ok', 'sistema', `Auditoria finalizada. ${escalacoes.length} logs gerados.`);
  return { escalacoes, jogadores };
}

// ─── AuditorAgent ─────────────────────────────────────────────────────────────

export const AuditorAgent = {
  name: 'Carlos',
  role: 'Back-office & Data Integrity',
  version: '1.0.0',

  /** Valida integridade das escalações no banco. */
  validarEscalacoes,

  /** Sincroniza status de jogadores em tempo real. */
  syncStatusJogadores,

  /** Auditoria completa — valida tudo de uma vez. */
  auditoriaCompleta,

  /** Retorna o histórico de logs desta sessão. */
  getLogs: (): AuditLog[] => [...logs],

  /** Log padronizado no estilo Carlos. */
  log(msg: string, tipo: AuditLog['tipo'] = 'ok'): void {
    registrar(tipo, 'manual', msg);
  },
} as const;
