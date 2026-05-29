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

// ─── Parágrafos de contexto e análise (para enriquecer o copy) ───────────────

const CONTEXTO_PARAGRAFO: Record<string, string[]> = {
  vitória: [
    'O resultado não veio de graça. Veio de semana de trabalho, de esquema bem montado e de jogadores que entraram em campo sabendo o que precisavam fazer. Três pontos assim pesam mais do que os que aparecem de graça.',
    'Ganhar com mérito tem sabor diferente. O Novorizontino não esperou o adversário errar — foi em cima, pressionou e construiu o resultado. Isso é identidade. Isso é o Tigre do Vale.',
    'Vitória que anima, que dá confiança e que confirma: esse grupo tem qualidade para incomodar qualquer um na competição. A campanha ganha mais um capítulo positivo.',
  ],
  derrota: [
    'Não tem desculpa que explique por completo — às vezes o adversário é melhor no dia e ponto. Mas tem coisas que dependem só do Novorizontino, e é aí que precisa melhorar antes do próximo jogo.',
    'Resultado ruim, semana difícil. Mas é exatamente nessas horas que o caráter de um grupo aparece. O Tigre já saiu do buraco antes — e a torcida sabe disso.',
    'Essa derrota tem que doer. Não para paralisar, mas para acender. Time que não sente a derrota não muda. Time que sente e reage é time de verdade.',
  ],
  empate: [
    'Ponto dividido, sentimento dividido. O Novorizontino teve chances para mais, mas o gol não saiu. Em competição longa, esses pontos que ficam pelo caminho podem fazer diferença lá na frente.',
    'Empate justo? Pode ser. Mas o Tigre criou e podia ter convertido. Eficiência é uma coisa que precisa melhorar — e o grupo sabe disso.',
  ],
  goleada_sofrida: [
    'Quando leva goleada, não tem análise que resolva na hora. Precisa de silêncio, de honestidade e de trabalho. O Novorizontino sabe se levantar — mas primeiro precisa encarar o espelho.',
    'Resultado para não esquecer — não por saudade, mas para não repetir. Tudo o que não pode acontecer, aconteceu neste jogo. Hora de corrigir sem rodeios.',
  ],
  reacao_necessaria: [
    'Perdeu o primeiro jogo, mas o confronto não acabou. Agora é a parte mais difícil: ganhar fora de casa com desvantagem no placar agregado. Impossível? O Tigre já fez coisa mais difícil.',
    'Reverter um placar ruim fora de casa exige mais do que talento — exige mentalidade. O Novorizontino vai precisar das suas melhores qualidades no jogo de volta: garra, coletivo e crença.',
    'Dois gols de desvantagem. Jogo fora de casa. A situação não é boa, mas não é irreversível. Quem apostar contra o Tigre do Vale normalmente se arrepende.',
  ],
};

const CHAMADA_TORCIDA: string[] = [
  'A arquibancada faz parte do jogo. Seja no Jorjão ou viajando 500km, a torcida do Tigre faz diferença — e o time sabe disso.',
  'De torcedor pra torcedor: acredite no processo. Esse grupo tem mais pra dar do que o que se vê em um jogo só.',
  'O Novorizontino é assim — quando a coisa aperta, o Jorjão responde. E quando o time entrega, a festa é do tamanho da cidade.',
  'Torcedor do Tigre não larga o time quando o resultado é ruim. É aí que a torcida mais aparece. E o time sente.',
];

// ─── generateHypeScript ───────────────────────────────────────────────────────

/**
 * Gera um HypeScript completo com no mínimo 1.000 caracteres.
 * Tom: torcedor pra torcedor — celebra vitória com honestidade,
 * critica derrota sem catastrofismo, nunca é só puxação de saco.
 */
export function generateHypeScript(evento: string, ctx: Partial<GameContext> = {}): HypeScript {
  const context: GameContext = { evento, ...ctx };
  const isPoloSul = (context.temperatura ?? 99) < 16;

  let template: string;
  if (isPoloSul && (evento === 'clima' || evento === 'default' || !TEMPLATES[evento])) {
    template = pick(POLO_SUL_TEMPLATES);
  } else {
    const pool = TEMPLATES[evento] ?? TEMPLATES.default;
    template = pick(pool);
  }

  const copyBase    = interpolate(template, context);
  const contextoP   = pick((CONTEXTO_PARAGRAFO[evento] ?? CONTEXTO_PARAGRAFO.derrota));
  const chamadaP    = pick(CHAMADA_TORCIDA);

  // Parágrafo de situação do confronto (quando há placar)
  const placar = buildPlacar(context);
  const situacao = placar
    ? `O placar de ${placar} ${
        evento === 'vitória'  ? 'fica registrado como mais uma vitória do Tigre do Vale nesta temporada.' :
        evento === 'derrota'  ? 'fica marcado como um resultado que exige resposta imediata do grupo.' :
        evento === 'empate'   ? 'divide os pontos e mantém o Novorizontino na corrida.' :
        evento === 'reacao_necessaria' ? 'abre a desvantagem no confronto — mas o jogo de volta ainda está por vir.' :
        'fica registrado na tabela da competição.'
      }`
    : '';

  // Monta o copy com múltiplos parágrafos (~1.000+ chars)
  const partes = [
    copyBase,
    situacao,
    contextoP,
    chamadaP,
    ASSINATURA,
  ].filter(Boolean);

  const hashtags = [
    ...HASHTAGS_BASE,
    ...(HASHTAGS_EVENTO[evento] ?? []),
    ...(isPoloSul ? ['#PoloSulPaulista', '#NevePaulistana'] : []),
  ];

  return {
    titulo:     buildTitulo(context),
    copy:       partes.join('\n\n'),
    hashtags:   [...new Set(hashtags)],
    assinatura: ASSINATURA,
    timestamp:  new Date().toISOString(),
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
