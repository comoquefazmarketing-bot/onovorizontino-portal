// src/lib/agents/MarketAgent.ts
// Léo — Agente de Marketing & Social do ecossistema TigreFC / O Novorizontino.
// Transforma eventos de jogo em copies de alta energia para a VoxSports.
// Regra de ouro: toda saída termina com a assinatura Makarios.

export const ASSINATURA = 'É Nível Makarios! 🐯❄️';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface GameContext {
  evento: string;           // ex: 'gol', 'vitória', 'pênalti', 'intervalo', 'clima'
  temperatura?: number;     // °C — aciona modo "Polo Sul Paulista" se < 16
  placarMandante?: number;
  placarVisitante?: number;
  mandante?: string;        // ex: 'Novorizontino'
  visitante?: string;
  minuto?: number;          // minuto do jogo
  jogador?: string;         // nome do atleta envolvido
}

export interface HypeScript {
  titulo: string;
  copy: string;
  hashtags: string[];
  assinatura: typeof ASSINATURA;
  timestamp: string;
}

// ─── Templates por evento ─────────────────────────────────────────────────────

const POLO_SUL_TEMPLATES = [
  'O Jorjão tá com {temp}°C e o Tigre não abaixa a cabeça pra ninguém. Nem pro frio.',
  '{temp}°C no Polo Sul Paulista. Mas a torcida tá em chamas. É Novorizontino, é assim.',
  'Neve no Jorjão? Que venha. O Tigre joga em qualquer temperatura. {temp}°C de pura raça.',
];

const TEMPLATES: Record<string, string[]> = {
  gol: [
    'AAAHHHH! {jogador} BALANÇOU AS REDES! {placar} — O Tigre tá vivo, tá bravo e tá marcando!',
    'GOL DO TIGRE! {jogador} não perdoou. {placar}. Jorjão em êxtase!',
    'É {jogador}! É o Novorizontino! É {placar} e a festa começa agora no interior paulista!',
  ],
  vitória: [
    'TRÊS PONTOS! {mandante} {placar} {visitante}. Mereceu? Discutível. Mas os pontos são nossos.',
    'VITÓRIA! {placar}. Não foi bonito, não foi fácil, mas no fim o Tigre levou. É assim.',
    '{placar}. Ganhou. E agora? Agora faz de novo. Semana que vem tem mais.',
  ],
  derrota: [
    'Perdemos. {placar}. Não adianta esconder atrás de discurso — a entrega não foi boa o suficiente hoje.',
    '{placar}. Resultado ruim. Jogo ruim. A torcida viu tudo e merece mais do que isso.',
    'Derrota por {placar}. Dói porque a gente ama esse time. E é exatamente por isso que a cobrança vem.',
    '{placar}. Esses pontos fazem falta. O Tigre sabe o que precisa fazer — agora é hora de mostrar dentro de campo.',
  ],
  goleada_sofrida: [
    '{placar}. Não tem como dourar. Foi um dia pra esquecer — mas precisa ficar na memória pra não repetir.',
    'Tomamos {placar}. Isso dói. E tem que doer. Porque quem não sente não muda.',
  ],
  reacao_necessaria: [
    'Perdemos o primeiro jogo. {placar}. Agora é reverter fora de casa. Impossível? O Tigre já fez coisa mais difícil.',
    '{placar} de desvantagem. Complicou, mas não acabou. Esse grupo sabe se levantar — ou vai ter que aprender agora.',
    'Situação difícil. {placar}. Mas enquanto a matemática deixar, o Tigre joga. Sem drama, só trabalho.',
  ],
  pênalti: [
    'PÊNALTI! O árbitro marcou e agora é nervos à flor da pele no Jorjão. Quem bate?',
    'É penalty! {minuto}° minuto. O coração do torcedor do Tigre para por um segundo...',
    'Pênalti assinalado. A torcida prende a respiração. O Novorizontino vai pra cima.',
  ],
  intervalo: [
    'FIM DO PRIMEIRO TEMPO. {placar}. Pode melhorar. Precisa melhorar. Vamos ver o que o técnico vai cobrar.',
    'Intervalo com {placar}. Tá longe do ideal, mas ainda dá tempo de mudar o jogo.',
    '45 minutos se foram. {placar}. Se você tá satisfeito com isso, você e eu assistimos a jogos diferentes.',
  ],
  empate: [
    'Empatou. {placar}. Um ponto. Poderia ser três. Mas poderia ser zero também — e a gente sabe disso.',
    '{placar}. Não perdeu. Mas também não ganhou. A tabela não perdoa quem desperdiça chances.',
    'Um a um. {placar}. Torcedor saiu com gosto de pouco? Sim. Mas seis pontos pra uma derrota seria pior.',
  ],
  clima: [
    '{temp}°C no Jorjão. Mas isso não para o Tigre. Nunca parou.',
    'Temperatura: {temp}°C. A torcida foi mesmo assim. Isso chama como?',
    'Clima de {temp}°C no estádio. O Tigre joga em qualquer condição — a torcida também.',
  ],
  default: [
    'O Novorizontino está em campo. Torça, critique, cobre — é assim que a torcida mostra que ama.',
    'É dia de Tigre. Pode não ser o time perfeito, mas é o nosso time. Vamos junto.',
    'Novorizontino: de Novo Horizonte pro Brasil. Com raça, com identidade, com a torcida por trás.',
  ],
};

const HASHTAGS_BASE = ['#Novorizontino', '#TigreFC', '#VoxSports', '#PoloSulPaulista'];

const HASHTAGS_EVENTO: Record<string, string[]> = {
  gol:              ['#Gol', '#Tigre', '#SerieB'],
  vitória:          ['#Vitória', '#TrêsPontos', '#Novorizontino'],
  derrota:          ['#Derrota', '#Cobrança', '#Novorizontino', '#TigreFC'],
  goleada_sofrida:  ['#Derrota', '#Precisamos Melhorar', '#Novorizontino'],
  reacao_necessaria:['#CopaSulSudeste', '#NovorizontinoNaCopa', '#ReaçãoNecessária'],
  empate:           ['#Empate', '#UmPonto', '#SerieB'],
  pênalti:          ['#Penalty', '#Emoção', '#Jorjão'],
  intervalo:        ['#Intervalo', '#Análise'],
  clima:            ['#NevePaulistana', '#PoloSulPaulista', '#FrioNãoPara'],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPlacar(ctx: GameContext): string {
  if (ctx.placarMandante === undefined || ctx.placarVisitante === undefined) return '';
  return `${ctx.placarMandante}x${ctx.placarVisitante}`;
}

function interpolate(template: string, ctx: GameContext): string {
  const placar = buildPlacar(ctx);
  return template
    .replace(/{temp}/g,      String(ctx.temperatura ?? '??'))
    .replace(/{placar}/g,    placar)
    .replace(/{mandante}/g,  ctx.mandante  ?? 'Novorizontino')
    .replace(/{visitante}/g, ctx.visitante ?? 'Adversário')
    .replace(/{jogador}/g,   ctx.jogador   ?? 'O camisa 10')
    .replace(/{minuto}/g,    String(ctx.minuto ?? '??'));
}

function buildTitulo(ctx: GameContext): string {
  const prefixes: Record<string, string> = {
    gol:              '⚽ GOL DO TIGRE',
    vitória:          '🏆 VITÓRIA',
    derrota:          '😤 DERROTA',
    goleada_sofrida:  '🔴 DERROTA PESADA',
    reacao_necessaria:'⚠️ MISSÃO: REVERTER',
    empate:           '🤝 EMPATE',
    pênalti:          '🎯 PÊNALTI',
    intervalo:        '🔔 INTERVALO',
    clima:            '❄️ POLO SUL PAULISTA',
    default:          '🐯 NOVORIZONTINO',
  };
  const base = prefixes[ctx.evento] ?? prefixes.default;
  const placar = buildPlacar(ctx);
  return placar ? `${base} — ${placar}` : base;
}

// ─── generateHypeScript ───────────────────────────────────────────────────────

/**
 * Gera um HypeScript completo a partir de um evento de jogo.
 * Se ctx.temperatura < 16, ativa automaticamente o modo "Polo Sul Paulista".
 */
export function generateHypeScript(evento: string, ctx: Partial<GameContext> = {}): HypeScript {
  const context: GameContext = { evento, ...ctx };

  const isPoloSul = (context.temperatura ?? 99) < 16;

  // Seleciona template: Polo Sul tem prioridade se temperatura < 16 e evento for clima/default
  let template: string;
  if (isPoloSul && (evento === 'clima' || evento === 'default' || !TEMPLATES[evento])) {
    template = pick(POLO_SUL_TEMPLATES);
  } else {
    const pool = TEMPLATES[evento] ?? TEMPLATES.default;
    template = pick(pool);
  }

  const copy = interpolate(template, context);
  const hashtags = [
    ...HASHTAGS_BASE,
    ...(HASHTAGS_EVENTO[evento] ?? []),
    ...(isPoloSul ? ['#PoloSulPaulista', '#NevePaulistana'] : []),
  ];

  return {
    titulo:    buildTitulo(context),
    copy:      `${copy}\n\n${ASSINATURA}`,
    hashtags:  [...new Set(hashtags)],
    assinatura: ASSINATURA,
    timestamp: new Date().toISOString(),
  };
}

// ─── generateBatchHype ────────────────────────────────────────────────────────
// Gera múltiplos copies variados para o mesmo evento (útil para A/B em redes sociais).

export function generateBatchHype(evento: string, ctx: Partial<GameContext> = {}, quantidade = 3): HypeScript[] {
  return Array.from({ length: quantidade }, () => generateHypeScript(evento, ctx));
}

// ─── MarketAgent ──────────────────────────────────────────────────────────────
// Interface unificada do agente — futuramente conecta ao Supabase realtime.

export const MarketAgent = {
  name: 'Léo',
  role: 'Marketing & Social',
  version: '1.0.0',

  /** Processa um evento de jogo e retorna o HypeScript pronto para publicação. */
  processar(evento: string, ctx: Partial<GameContext> = {}): HypeScript {
    return generateHypeScript(evento, ctx);
  },

  /** Gera variações para teste A/B em múltiplos canais. */
  batch(evento: string, ctx: Partial<GameContext> = {}, n = 3): HypeScript[] {
    return generateBatchHype(evento, ctx, n);
  },

  /** Log padronizado no estilo Makarios. */
  log(msg: string): void {
    console.log(`[TheHype @ ${new Date().toISOString()}] ${msg} ${ASSINATURA}`);
  },
} as const;
