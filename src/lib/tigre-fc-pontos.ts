/**
 * Sistema de Pontos Oficial — Tigre FC Fantasy
 * Fonte única de verdade. Importar em qualquer lugar que precise dos valores.
 */

// ── Pontos por evento de jogador ──────────────────────────────────────────────
export const PONTOS_JOGADOR = {
  GOL:            8,
  ASSISTENCIA:    5,
  TITULAR_60MIN:  2,   // titular por 60+ minutos
  SEM_TOMAR_GOL:  5,   // goleiro/zagueiro: clean sheet
  AMARELO:       -2,
  VERMELHO:      -5,
} as const;

// ── Pontos por palpite ────────────────────────────────────────────────────────
export const PONTOS_PALPITE = {
  PLACAR_EXATO:      15,  // acertou placar exato (ex: 2×1 = 2×1)
  RESULTADO_CERTO:    5,  // acertou vencedor/empate sem placar exato
  HEROI_DA_PARTIDA:   5,  // acertou quem seria o herói
} as const;

// ── Multiplicadores ───────────────────────────────────────────────────────────
export const MULTIPLICADORES = {
  CAPITAO: 2,  // pontos do capitão são dobrados
} as const;

// ── Regras de Liga ────────────────────────────────────────────────────────────
/**
 * Pontuação mínima para criar uma liga particular ou pública.
 * Equivale a: ~25 rodadas escaladas com algum acerto de resultado.
 */
export const LIGA_MIN_PONTOS_CRIAR = 600;

// ── Tabela resumida (para exibir na UI) ──────────────────────────────────────
export const TABELA_PONTOS: { label: string; valor: string; cor: string }[] = [
  { label: 'Gol marcado',       valor: '+8',  cor: '#4ade80' },
  { label: 'Assistência',       valor: '+5',  cor: '#60a5fa' },
  { label: 'Titular 60+ min',   valor: '+2',  cor: '#a78bfa' },
  { label: 'Sem tomar gol',     valor: '+5',  cor: '#34d399' },
  { label: 'Placar exato',      valor: '+15', cor: '#F5C400' },
  { label: 'Resultado certo',   valor: '+5',  cor: '#fbbf24' },
  { label: 'Herói da partida',  valor: '+5',  cor: '#00F3FF' },
  { label: 'Capitão',           valor: '×2',  cor: '#F5C400' },
  { label: 'Cartão amarelo',    valor: '−2',  cor: '#fb923c' },
  { label: 'Cartão vermelho',   valor: '−5',  cor: '#f87171' },
];
