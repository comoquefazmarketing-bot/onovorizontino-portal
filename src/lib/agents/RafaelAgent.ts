// src/lib/agents/RafaelAgent.ts
// Rafael — Agente de Analytics do ecossistema TigreFC / O Novorizontino.
// Lê métricas do Supabase e gera relatório semanal para o Felipe.

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface MetricaBloco {
  label:    string;
  valor:    number;
  variacao?: number;
  variacao_pct?: number;
  detalhe?: string;
}

export interface RelatorioSemanal {
  periodo:      { inicio: string; fim: string };
  escalacoes:   MetricaBloco;
  usuarios:     MetricaBloco;
  copies:       MetricaBloco;
  publicados:   MetricaBloco;
  taxa_publicacao: MetricaBloco;
  noticias_gabi:  MetricaBloco;
  top_eventos:  Array<{ evento: string; total: number }>;
  resumo:       string;
  nota_geral:   'S' | 'A' | 'B' | 'C' | 'D';
  timestamp:    string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function variacaoPct(atual: number, anterior: number): number {
  if (anterior === 0) return atual > 0 ? 100 : 0;
  return Math.round(((atual - anterior) / anterior) * 100);
}

function notaGeral(escalacoes: number, taxa: number, usuarios: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  const score = (escalacoes >= 50 ? 3 : escalacoes >= 20 ? 2 : escalacoes >= 5 ? 1 : 0)
              + (taxa >= 80 ? 3 : taxa >= 50 ? 2 : taxa >= 20 ? 1 : 0)
              + (usuarios >= 20 ? 2 : usuarios >= 5 ? 1 : 0);
  if (score >= 7) return 'S';
  if (score >= 5) return 'A';
  if (score >= 3) return 'B';
  if (score >= 1) return 'C';
  return 'D';
}

function resumoTexto(r: RelatorioSemanal): string {
  const setas = (v?: number) => v === undefined ? '' : v > 0 ? ` ↑${v}%` : v < 0 ? ` ↓${Math.abs(v)}%` : ' →';
  const partes: string[] = [
    `📊 Relatório Rafael — semana de ${new Date(r.periodo.inicio).toLocaleDateString('pt-BR')} a ${new Date(r.periodo.fim).toLocaleDateString('pt-BR')}`,
    `⚽ Escalações: ${r.escalacoes.valor}${setas(r.escalacoes.variacao_pct)}`,
    `👤 Usuários novos: ${r.usuarios.valor}${setas(r.usuarios.variacao_pct)}`,
    `✍️  Copies gerados: ${r.copies.valor} | Publicados: ${r.publicados.valor} (${r.taxa_publicacao.valor}%)`,
    `📰 Notícias da Gabi: ${r.noticias_gabi.valor}`,
    r.top_eventos.length > 0
      ? `🔥 Top evento: ${r.top_eventos[0].evento} (${r.top_eventos[0].total}x)`
      : '',
    `🏅 Nota geral: ${r.nota_geral} — É Nível Makarios! 🐯❄️`,
  ].filter(Boolean);
  return partes.join('\n');
}

// ─── Coleta de dados (server-side, via REST direto) ───────────────────────────

export interface ColetaParams {
  supabaseUrl:  string;
  anonKey:      string;
  inicioPeriodo: string;
  fimPeriodo:    string;
  inicioAnterior: string;
  fimAnterior:    string;
}

async function contarLinhas(
  url: string, key: string,
  tabela: string, filtros: string
): Promise<number> {
  const endpoint = `${url}/rest/v1/${tabela}?${filtros}&select=id`;
  const res = await fetch(endpoint, {
    headers: {
      apikey:        key,
      Authorization: `Bearer ${key}`,
      Accept:        'application/json',
      Prefer:        'count=exact',
    },
    cache: 'no-store',
  });
  const range = res.headers.get('content-range');
  if (range) {
    const total = range.split('/')[1];
    if (total && total !== '*') return Number(total);
  }
  const data = await res.json().catch(() => []);
  return Array.isArray(data) ? data.length : 0;
}

async function buscarEventos(
  url: string, key: string,
  inicio: string, fim: string
): Promise<Array<{ evento: string; total: number }>> {
  const endpoint = `${url}/rest/v1/voxsports_fila?criado_em=gte.${encodeURIComponent(inicio)}&criado_em=lte.${encodeURIComponent(fim)}&select=evento`;
  const res = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data: { evento: string }[] = await res.json().catch(() => []);
  const contagem: Record<string, number> = {};
  data.forEach(r => { contagem[r.evento] = (contagem[r.evento] ?? 0) + 1; });
  return Object.entries(contagem)
    .map(([evento, total]) => ({ evento, total }))
    .sort((a, b) => b.total - a.total);
}

export async function coletarMetricas(p: ColetaParams): Promise<RelatorioSemanal> {
  const { supabaseUrl: u, anonKey: k } = p;

  const [
    escalacoesSemana, escalacoesAnterior,
    usuariosSemana,   usuariosAnterior,
    copiesSemana,     copiesAnterior,
    publicadosSemana,
    noticiasSemana,
    topEventos,
  ] = await Promise.all([
    contarLinhas(u, k, 'tigre_fc_escalacoes', `criado_em=gte.${encodeURIComponent(p.inicioPeriodo)}&criado_em=lte.${encodeURIComponent(p.fimPeriodo)}`),
    contarLinhas(u, k, 'tigre_fc_escalacoes', `criado_em=gte.${encodeURIComponent(p.inicioAnterior)}&criado_em=lte.${encodeURIComponent(p.fimAnterior)}`),
    contarLinhas(u, k, 'tigre_fc_usuarios',   `criado_em=gte.${encodeURIComponent(p.inicioPeriodo)}&criado_em=lte.${encodeURIComponent(p.fimPeriodo)}`),
    contarLinhas(u, k, 'tigre_fc_usuarios',   `criado_em=gte.${encodeURIComponent(p.inicioAnterior)}&criado_em=lte.${encodeURIComponent(p.fimAnterior)}`),
    contarLinhas(u, k, 'voxsports_fila',      `criado_em=gte.${encodeURIComponent(p.inicioPeriodo)}&criado_em=lte.${encodeURIComponent(p.fimPeriodo)}`),
    contarLinhas(u, k, 'voxsports_fila',      `criado_em=gte.${encodeURIComponent(p.inicioAnterior)}&criado_em=lte.${encodeURIComponent(p.fimAnterior)}`),
    contarLinhas(u, k, 'voxsports_fila',      `publicado=eq.true&criado_em=gte.${encodeURIComponent(p.inicioPeriodo)}&criado_em=lte.${encodeURIComponent(p.fimPeriodo)}`),
    contarLinhas(u, k, 'postagens',           `autor_ia=ilike.*Gabi*&criado_em=gte.${encodeURIComponent(p.inicioPeriodo)}&criado_em=lte.${encodeURIComponent(p.fimPeriodo)}`),
    buscarEventos(u, k, p.inicioPeriodo, p.fimPeriodo),
  ]);

  const taxaAtual    = copiesSemana > 0 ? Math.round((publicadosSemana / copiesSemana) * 100) : 0;
  const taxaAnterior = copiesAnterior > 0
    ? Math.round((await contarLinhas(u, k, 'voxsports_fila', `publicado=eq.true&criado_em=gte.${encodeURIComponent(p.inicioAnterior)}&criado_em=lte.${encodeURIComponent(p.fimAnterior)}`) / copiesAnterior) * 100)
    : 0;

  const rel: RelatorioSemanal = {
    periodo: { inicio: p.inicioPeriodo, fim: p.fimPeriodo },
    escalacoes: {
      label: 'Escalações criadas',
      valor: escalacoesSemana,
      variacao: escalacoesSemana - escalacoesAnterior,
      variacao_pct: variacaoPct(escalacoesSemana, escalacoesAnterior),
    },
    usuarios: {
      label: 'Usuários novos',
      valor: usuariosSemana,
      variacao: usuariosSemana - usuariosAnterior,
      variacao_pct: variacaoPct(usuariosSemana, usuariosAnterior),
    },
    copies: {
      label: 'Copies gerados (Redação)',
      valor: copiesSemana,
      variacao: copiesSemana - copiesAnterior,
      variacao_pct: variacaoPct(copiesSemana, copiesAnterior),
    },
    publicados: {
      label: 'Copies publicados',
      valor: publicadosSemana,
    },
    taxa_publicacao: {
      label: 'Taxa de publicação',
      valor: taxaAtual,
      variacao: taxaAtual - taxaAnterior,
    },
    noticias_gabi: {
      label: 'Notícias publicadas pela Gabi',
      valor: noticiasSemana,
    },
    top_eventos: topEventos.slice(0, 5),
    resumo: '',
    nota_geral: notaGeral(escalacoesSemana, taxaAtual, usuariosSemana),
    timestamp: new Date().toISOString(),
  };

  rel.resumo = resumoTexto(rel);
  return rel;
}

// ─── RafaelAgent ─────────────────────────────────────────────────────────────

export const RafaelAgent = {
  name:    'Rafael',
  role:    'Analytics & Relatórios',
  version: '1.0.0',

  coletarMetricas,

  log(msg: string): void {
    console.log(`[Rafael @ ${new Date().toISOString()}] 📈 ${msg}`);
  },
} as const;
