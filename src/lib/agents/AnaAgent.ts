// src/lib/agents/AnaAgent.ts
// Ana — Agente de Escalação Inteligente do ecossistema TigreFC.
// Analisa o elenco, sugere a melhor escalação por formação e avalia lineups existentes.

// ─── Elenco (espelho do EscalacaoFormacao.tsx) ────────────────────────────────

export interface Player {
  id:    number;
  name:  string;
  short: string;
  num:   number;
  pos:   string;
  ovr:   number;
}

const ELENCO: Player[] = [
  // GOLEIROS
  { id: 23,  name: 'Jordi Martins',      short: 'JORDI',       num: 93, pos: 'GOL', ovr: 82 },
  { id: 1,   name: 'César Augusto',      short: 'CÉSAR',       num: 31, pos: 'GOL', ovr: 78 },
  { id: 22,  name: 'João Scapin',        short: 'SCAPIN',      num: 12, pos: 'GOL', ovr: 72 },
  { id: 62,  name: 'Lucas Ribeiro',      short: 'LUCAS',       num: 1,  pos: 'GOL', ovr: 70 },
  { id: 101, name: 'Paulo Henrique',     short: 'P. HENRIQUE', num: 29, pos: 'GOL', ovr: 71 },
  // ZAGUEIROS
  { id: 8,   name: 'Patrick Marcos',     short: 'PATRICK',     num: 4,  pos: 'ZAG', ovr: 84 },
  { id: 38,  name: 'Renato Palm',        short: 'R. PALM',     num: 33, pos: 'ZAG', ovr: 81 },
  { id: 34,  name: 'Eduardo Brock',      short: 'BROCK',       num: 8,  pos: 'ZAG', ovr: 80 },
  { id: 66,  name: 'Alexis Alvariño',    short: 'ALVARÍÑO',    num: 22, pos: 'ZAG', ovr: 79 },
  { id: 6,   name: 'Carlinhos',          short: 'CARLINHOS',   num: 44, pos: 'ZAG', ovr: 76 },
  { id: 3,   name: 'João Vitor Dantas',  short: 'DANTAS',      num: 25, pos: 'ZAG', ovr: 75 },
  { id: 102, name: 'Arthur Barbosa',     short: 'ARTHUR',      num: 3,  pos: 'ZAG', ovr: 73 },
  { id: 103, name: 'Antony Gustavo',     short: 'ANTONY',      num: 38, pos: 'ZAG', ovr: 70 },
  { id: 104, name: 'Kauã Rocha',         short: 'ALEMÃO',      num: 21, pos: 'ZAG', ovr: 72 },
  // LATERAIS
  { id: 9,   name: 'Sander Bortolotto', short: 'SANDER',      num: 36, pos: 'LAT', ovr: 81 },
  { id: 28,  name: 'Maykon Jesus',       short: 'MAYKON',      num: 66, pos: 'LAT', ovr: 78 },
  { id: 27,  name: 'Nilson Castrillón', short: 'CASTRILLÓN',  num: 20, pos: 'LAT', ovr: 77 },
  { id: 75,  name: 'Jhilmar Lora',       short: 'LORA',        num: 2,  pos: 'LAT', ovr: 74 },
  { id: 105, name: 'Carlos Roberto',     short: 'ESQUERDA',    num: 26, pos: 'LAT', ovr: 71 },
  // VOLANTES
  { id: 41,  name: 'Luís Oyama',         short: 'OYAMA',       num: 6,  pos: 'VOL', ovr: 83 },
  { id: 46,  name: 'Marlon Adriano',     short: 'MARLON',      num: 28, pos: 'VOL', ovr: 80 },
  { id: 40,  name: 'Léo Naldi',          short: 'NALDI',       num: 18, pos: 'VOL', ovr: 78 },
  { id: 106, name: 'Gabriel Bahia',      short: 'G. BAHIA',    num: 5,  pos: 'VOL', ovr: 74 },
  // MEIAS
  { id: 47,  name: 'Matheus Bianqui',   short: 'BIANQUI',     num: 17, pos: 'MEI', ovr: 82 },
  { id: 10,  name: 'Rômulo Azevedo',    short: 'RÔMULO',      num: 10, pos: 'MEI', ovr: 86 },
  { id: 12,  name: 'Alexandre Silva',   short: 'JUNINHO',     num: 50, pos: 'MEI', ovr: 79 },
  { id: 17,  name: 'Luiz Otavio',       short: 'TAVINHO',     num: 15, pos: 'MEI', ovr: 78 },
  { id: 86,  name: 'Christian Ortíz',   short: 'TITI ORTÍZ',  num: 77, pos: 'MEI', ovr: 84 },
  { id: 13,  name: 'Diego Galo',        short: 'D. GALO',     num: 19, pos: 'MEI', ovr: 75 },
  { id: 107, name: 'Gabriel Correia',   short: 'G. CORREIA',  num: 14, pos: 'MEI', ovr: 72 },
  { id: 108, name: 'Luiz Gabriel',      short: 'L. GABRIEL',  num: 23, pos: 'MEI', ovr: 70 },
  { id: 109, name: 'Hector Bianchi',    short: 'HECTOR',      num: 32, pos: 'MEI', ovr: 73 },
  { id: 110, name: 'Miguel Contiero',   short: 'CONTIERO',    num: 35, pos: 'MEI', ovr: 69 },
  { id: 111, name: 'Edson Junior',      short: 'NOGUEIRA',    num: 37, pos: 'MEI', ovr: 68 },
  // ATACANTES
  { id: 15,  name: 'Robson Fernandes',  short: 'ROBSON',      num: 11, pos: 'ATA', ovr: 85 },
  { id: 59,  name: 'Vinícius Paiva',    short: 'V. PAIVA',    num: 16, pos: 'ATA', ovr: 79 },
  { id: 57,  name: 'Ronald Barcellos',  short: 'RONALD',      num: 7,  pos: 'ATA', ovr: 82 },
  { id: 55,  name: 'Nicolas Careca',    short: 'CARECA',      num: 16, pos: 'ATA', ovr: 80 },
  { id: 50,  name: 'Carlos Henrique',   short: 'CARLÃO',      num: 9,  pos: 'ATA', ovr: 84 },
  { id: 52,  name: 'Hélio Borges',      short: 'HÉLIO',       num: 41, pos: 'ATA', ovr: 76 },
  { id: 53,  name: 'Jardiel Marciel',   short: 'JARDIEL',     num: 30, pos: 'ATA', ovr: 75 },
  { id: 112, name: 'Diego Mathias',     short: 'D. MATHIAS',  num: 27, pos: 'ATA', ovr: 76 },
  { id: 113, name: 'Jhones Kauê',       short: 'J. KAUÊ',     num: 47, pos: 'ATA', ovr: 71 },
];

// ─── Mapeamento slot → posições aceitas ───────────────────────────────────────

const SLOT_POS: Record<string, string[]> = {
  gk:  ['GOL'],
  cb1: ['ZAG'], cb2: ['ZAG'], cb3: ['ZAG'],
  lb:  ['LAT'], rb:  ['LAT'],
  lm:  ['LAT', 'MEI'], rm: ['LAT', 'MEI'],
  v1:  ['VOL'], v2:  ['VOL'],
  m1:  ['VOL', 'MEI'], m2: ['VOL', 'MEI'], m3: ['VOL', 'MEI'], m4: ['VOL', 'MEI'],
  am:  ['MEI'], am1: ['MEI'], am2: ['MEI'],
  lw:  ['ATA', 'MEI'], rw: ['ATA', 'MEI'],
  st:  ['ATA'], st1: ['ATA'], st2: ['ATA'],
};

// ─── Formações ────────────────────────────────────────────────────────────────

const FORMACOES: Record<string, string[]> = {
  '4-3-3':   ['gk','lb','cb1','cb2','rb','m1','m2','m3','st','lw','rw'],
  '4-4-2':   ['gk','lb','cb1','cb2','rb','m1','m2','m3','m4','st1','st2'],
  '3-5-2':   ['gk','cb1','cb2','cb3','lm','rm','m1','m2','am','st1','st2'],
  '4-5-1':   ['gk','lb','cb1','cb2','rb','m1','m2','m3','am1','am2','st'],
  '4-2-3-1': ['gk','lb','cb1','cb2','rb','v1','v2','am','lw','rw','st'],
  '5-3-2':   ['gk','lb','cb1','cb2','cb3','rb','m1','m2','m3','st1','st2'],
};

// ─── Tipos de saída ───────────────────────────────────────────────────────────

export interface SlotSuggestion {
  slot:    string;
  posicao: string[];
  titular: Player;
  reserva: Player | null;
}

export interface SuggestedLineup {
  formacao:   string;
  slots:      SlotSuggestion[];
  ovr_medio:  number;
  capitao:    Player;
  heroi:      Player;
  fraquezas:  string[];     // slots com OVR abaixo de 75
  timestamp:  string;
}

export interface AnalysisReport {
  ovr_medio:   number;
  ovr_max:     number;
  ovr_min:     number;
  capitao:     Player | null;
  heroi:       Player | null;
  fraquezas:   Array<{ slot: string; player: Player; motivo: string }>;
  nota:        string;      // 'S', 'A', 'B', 'C', 'D'
  comentario:  string;
  timestamp:   string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function melhorPara(posicoes: string[], usados: Set<number>): { titular: Player; reserva: Player | null } {
  const candidatos = ELENCO
    .filter(p => posicoes.includes(p.pos) && !usados.has(p.id))
    .sort((a, b) => b.ovr - a.ovr);

  if (candidatos.length === 0) {
    const fallback = ELENCO
      .filter(p => !usados.has(p.id))
      .sort((a, b) => b.ovr - a.ovr)[0];
    return { titular: fallback, reserva: null };
  }

  return { titular: candidatos[0], reserva: candidatos[1] ?? null };
}

function nota(ovr: number): string {
  if (ovr >= 83) return 'S';
  if (ovr >= 80) return 'A';
  if (ovr >= 77) return 'B';
  if (ovr >= 74) return 'C';
  return 'D';
}

function comentario(ovr: number, fraquezas: number): string {
  if (ovr >= 83 && fraquezas === 0) return 'Escalação perfeita. É Nível Makarios! 🐯❄️';
  if (ovr >= 80) return `Time forte. ${fraquezas > 0 ? `${fraquezas} posição(ões) podem melhorar.` : 'Bem equilibrado.'}`;
  if (ovr >= 77) return 'Escalação sólida com espaço pra evolução.';
  if (ovr >= 74) return 'Time mediano. Revise as posições fracas antes do jogo.';
  return 'Escalação abaixo do esperado. O Makarios pede revisão urgente.';
}

// ─── Funções principais ───────────────────────────────────────────────────────

/**
 * Sugere a melhor escalação possível para uma formação.
 */
export function sugerirEscalacao(formacao = '4-3-3'): SuggestedLineup {
  const slots = FORMACOES[formacao] ?? FORMACOES['4-3-3'];
  const usados = new Set<number>();
  const resultado: SlotSuggestion[] = [];

  for (const slot of slots) {
    const posicoes = SLOT_POS[slot] ?? ['MEI'];
    const { titular, reserva } = melhorPara(posicoes, usados);
    usados.add(titular.id);
    resultado.push({ slot, posicao: posicoes, titular, reserva });
  }

  const titulares = resultado.map(r => r.titular);
  const ovrMedio  = Math.round(titulares.reduce((s, p) => s + p.ovr, 0) / titulares.length);
  const capitao   = [...titulares].sort((a, b) => b.ovr - a.ovr)[0];
  const heroi     = [...titulares].filter(p => p.pos === 'ATA' || p.pos === 'MEI').sort((a, b) => b.ovr - a.ovr)[0] ?? capitao;
  const fraquezas = resultado.filter(r => r.titular.ovr < 75).map(r => r.slot);

  return {
    formacao, slots: resultado, ovr_medio: ovrMedio,
    capitao, heroi, fraquezas,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analisa uma escalação existente (mapa slot → player_id).
 */
export function analisarEscalacao(slotMap: Record<string, number | null>): AnalysisReport {
  const jogadores: Player[] = [];
  const fraquezas: AnalysisReport['fraquezas'] = [];

  for (const [slot, playerId] of Object.entries(slotMap)) {
    if (!playerId) continue;
    const p = ELENCO.find(e => e.id === playerId);
    if (!p) continue;
    jogadores.push(p);

    const posEsperadas = SLOT_POS[slot] ?? [];
    if (!posEsperadas.includes(p.pos)) {
      fraquezas.push({ slot, player: p, motivo: `${p.short} é ${p.pos}, slot pede ${posEsperadas.join('/')}` });
    } else if (p.ovr < 75) {
      fraquezas.push({ slot, player: p, motivo: `OVR ${p.ovr} — abaixo do ideal para este slot` });
    }
  }

  if (jogadores.length === 0) {
    return {
      ovr_medio: 0, ovr_max: 0, ovr_min: 0,
      capitao: null, heroi: null, fraquezas: [],
      nota: 'D', comentario: 'Escalação vazia.',
      timestamp: new Date().toISOString(),
    };
  }

  const ovrs    = jogadores.map(p => p.ovr);
  const ovrMed  = Math.round(ovrs.reduce((s, v) => s + v, 0) / ovrs.length);
  const capitao = [...jogadores].sort((a, b) => b.ovr - a.ovr)[0];
  const heroi   = [...jogadores].filter(p => p.pos === 'ATA' || p.pos === 'MEI').sort((a, b) => b.ovr - a.ovr)[0] ?? capitao;

  return {
    ovr_medio: ovrMed,
    ovr_max:   Math.max(...ovrs),
    ovr_min:   Math.min(...ovrs),
    capitao, heroi, fraquezas,
    nota:      nota(ovrMed),
    comentario: comentario(ovrMed, fraquezas.length),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Retorna o ranking do elenco por posição.
 */
export function rankingElenco(pos?: string): Player[] {
  return ELENCO
    .filter(p => !pos || p.pos === pos)
    .sort((a, b) => b.ovr - a.ovr);
}

// ─── AnaAgent ─────────────────────────────────────────────────────────────────

export const AnaAgent = {
  name:    'Ana',
  role:    'Escalação Inteligente',
  version: '1.0.0',

  /** Sugere a melhor escalação para uma formação. */
  sugerirEscalacao,

  /** Analisa uma escalação existente e retorna relatório. */
  analisarEscalacao,

  /** Ranking do elenco por OVR, filtrado por posição. */
  rankingElenco,

  /** Log padronizado. */
  log(msg: string): void {
    console.log(`[Ana @ ${new Date().toISOString()}] 🧠 ${msg}`);
  },
} as const;
