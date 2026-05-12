// src/lib/agents/GabiAgent.ts
// Gabi — Agente de Notícias do ecossistema TigreFC / O Novorizontino.
// Gera posts completos de resultado assim que o jogo termina e publica
// direto na tabela `postagens` do portal.

export interface JogoResultado {
  id?:              number;
  rodada:           string;
  competicao:       string;
  mandante_slug:    string;
  visitante_slug:   string;
  placar_mandante:  number;
  placar_visitante: number;
  data_hora:        string;
  local?:           string;
}

export interface Postagem {
  titulo:       string;
  slug:         string;
  categoria:    string;
  resumo_ia:    string;
  conteudo:     string;
  autor_ia:     string;
  imagem_capa:  string | null;
  status:       'published' | 'draft';
  fonte_nome:   string;
  fonte_url:    string;
  criado_em:    string;
}

// ─── Mapas de apoio ───────────────────────────────────────────────────────────

const NOMES: Record<string, string> = {
  'novorizontino': 'Novorizontino', 'gremio-novorizontino': 'Novorizontino',
  'avai': 'Avaí', 'criciuma': 'Criciúma', 'botafogo-sp': 'Botafogo-SP',
  'america-mg': 'América-MG', 'goias': 'Goiás', 'sport': 'Sport',
  'cuiaba': 'Cuiabá', 'crb': 'CRB', 'athletic': 'Athletic', 'athletic-mg': 'Athletic',
  'ceara': 'Ceará', 'juventude': 'Juventude', 'ponte-preta': 'Ponte Preta',
  'vila-nova': 'Vila Nova', 'operario-pr': 'Operário', 'londrina': 'Londrina',
  'sao-bernardo': 'São Bernardo', 'coritiba': 'Coritiba', 'santos': 'Santos',
  'paysandu': 'Paysandu', 'remo': 'Remo', 'athletico-pr': 'Athletico',
  'chapecoense': 'Chapecoense', 'guarani': 'Guarani', 'ituano': 'Ituano',
  'mirassol': 'Mirassol', 'volta-redonda': 'Volta Redonda', 'amazonas': 'Amazonas',
};

function nome(slug: string): string {
  return NOMES[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// ─── Lógica de resultado ──────────────────────────────────────────────────────

function isNovorizontino(slug: string): boolean {
  return slug === 'novorizontino' || slug === 'gremio-novorizontino';
}

function resultado(jogo: JogoResultado): 'vitória' | 'derrota' | 'empate' {
  const novoMandante = isNovorizontino(jogo.mandante_slug);
  const pm = jogo.placar_mandante;
  const pv = jogo.placar_visitante;
  if (pm === pv) return 'empate';
  if (novoMandante) return pm > pv ? 'vitória' : 'derrota';
  return pv > pm ? 'vitória' : 'derrota';
}

function placarNovo(jogo: JogoResultado): string {
  return isNovorizontino(jogo.mandante_slug)
    ? `${jogo.placar_mandante}x${jogo.placar_visitante}`
    : `${jogo.placar_visitante}x${jogo.placar_mandante}`;
}

function adversario(jogo: JogoResultado): string {
  return isNovorizontino(jogo.mandante_slug)
    ? nome(jogo.visitante_slug)
    : nome(jogo.mandante_slug);
}

function mando(jogo: JogoResultado): 'casa' | 'fora' {
  return isNovorizontino(jogo.mandante_slug) ? 'casa' : 'fora';
}

// ─── Templates de título ──────────────────────────────────────────────────────

const TITULOS: Record<string, string[]> = {
  vitória: [
    'Tigre vence {adversario} por {placar} e segue em alta na {competicao}',
    'Novorizontino domina {adversario} e vence por {placar} na {competicao}',
    'Vitória do Tigre! Novorizontino supera {adversario} por {placar}',
    '{placar}: Novorizontino bate {adversario} e soma mais três pontos na {competicao}',
  ],
  derrota: [
    'Novorizontino perde para {adversario} por {placar} na {competicao}',
    'Tigre tropeça diante do {adversario}: {placar} na {competicao}',
    'Derrota para {adversario} por {placar} — Novorizontino volta a treinar na semana',
  ],
  empate: [
    'Novorizontino empata com {adversario} em {placar} pela {competicao}',
    'Tigre fica no {placar} com {adversario} na {competicao}',
    'Um a um: Novorizontino divide os pontos com {adversario} pela {competicao}',
  ],
};

// ─── Templates de conteúdo ────────────────────────────────────────────────────

function gerarConteudo(jogo: JogoResultado): string {
  const res   = resultado(jogo);
  const adv   = adversario(jogo);
  const placar = placarNovo(jogo);
  const mnd   = mando(jogo);
  const data  = new Date(jogo.data_hora).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long',
  });
  const local = jogo.local ?? (mnd === 'casa' ? 'Estádio Jorge Ismael de Biasi — Novo Horizonte' : 'jogo fora de casa');

  const intro: Record<typeof res, string> = {
    vitória: `O Grêmio Novorizontino conquistou mais uma vitória importante pela ${jogo.competicao}. Na ${data}, o Tigre ${mnd === 'casa' ? `recebeu o ${adv} no Jorjão` : `enfrentou o ${adv} fora de casa`} e saiu com o placar favorável de **${placar}**, somando mais três pontos na tabela.`,
    derrota: `O Grêmio Novorizontino foi superado pelo ${adv} nesta ${data} pela ${jogo.competicao}. O placar final de **${placar}** marcou uma tarde difícil para o Tigre, que precisará se recuperar rapidamente para os próximos desafios da competição.`,
    empate:  `O Grêmio Novorizontino ficou no empate com o ${adv} nesta ${data} pela ${jogo.competicao}. O placar de **${placar}** refletiu um jogo equilibrado, com o Tigre dividindo os pontos ${mnd === 'casa' ? `diante da sua torcida no Jorjão` : `fora de casa`}.`,
  };

  const meio: Record<typeof res, string> = {
    vitória: `A partida foi realizada em ${local}. O Novorizontino mostrou qualidade e organização ao longo dos 90 minutos, construindo o resultado com eficiência e determinação. A equipe comandada pela comissão técnica teve o controle do jogo nos momentos decisivos.`,
    derrota: `A partida aconteceu em ${local}. Apesar do empenho, o Novorizontino não conseguiu superar o adversário nesta ocasião. A equipe segue trabalhando para corrigir os pontos falhos e voltar a vencer no próximo compromisso.`,
    empate:  `A partida foi disputada em ${local}. O Tigre buscou a vitória até o apito final, mas não foi possível quebrar o equilíbrio imposto pelo adversário. O ponto conquistado mantém o time na briga na tabela da ${jogo.competicao}.`,
  };

  const fechamento: Record<typeof res, string> = {
    vitória: `Com o resultado, o Novorizontino mantém o ritmo positivo e segue em busca dos seus objetivos na ${jogo.competicao}. A torcida do Tigre pode comemorar mais uma conquista importante nessa trajetória.`,
    derrota: `O Novorizontino já pensa na próxima rodada para voltar a pontuar e se manter competitivo na ${jogo.competicao}. A confiança no trabalho segue firme.`,
    empate:  `O Grêmio Novorizontino segue na competição com foco total nos próximos jogos. Cada ponto conquistado é importante na longa jornada da ${jogo.competicao}.`,
  };

  return `${intro[res]}\n\n${meio[res]}\n\n${fechamento[res]}`;
}

function gerarResumo(jogo: JogoResultado): string {
  const res    = resultado(jogo);
  const adv    = adversario(jogo);
  const placar = placarNovo(jogo);
  const emojis = { vitória: '🏆', derrota: '😔', empate: '🤝' };
  const verbos = { vitória: 'venceu', derrota: 'perdeu para', empate: 'empatou com' };
  return `${emojis[res]} Novorizontino ${verbos[res]} ${adv} por ${placar} pela ${jogo.competicao} — Rodada ${jogo.rodada}.`;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function interpolar(tpl: string, vars: Record<string, string>): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? k);
}

// ─── gerarPostagem ────────────────────────────────────────────────────────────

export function gerarPostagem(jogo: JogoResultado, status: 'published' | 'draft' = 'published'): Postagem {
  const res    = resultado(jogo);
  const adv    = adversario(jogo);
  const placar = placarNovo(jogo);
  const comp   = jogo.competicao.replace('Série B 2026', 'Série B').replace('Série B 2025', 'Série B');

  const vars = { adversario: adv, placar, competicao: comp, rodada: jogo.rodada };

  const titulo   = interpolar(pick(TITULOS[res]), vars);
  const slug     = `${slugify(titulo)}-rodada-${jogo.rodada}-${Date.now()}`;
  const conteudo = gerarConteudo(jogo);
  const resumo   = gerarResumo(jogo);

  return {
    titulo,
    slug,
    categoria:   'Resultados',
    resumo_ia:   resumo,
    conteudo,
    autor_ia:    'Gabi • IA do Portal',
    imagem_capa: null,
    status,
    fonte_nome:  'O Novorizontino',
    fonte_url:   'https://www.onovorizontino.com.br',
    criado_em:   new Date().toISOString(),
  };
}

// ─── GabiAgent ───────────────────────────────────────────────────────────────

export const GabiAgent = {
  name:    'Gabi',
  role:    'Notícias & Resultados',
  version: '1.0.0',

  /** Gera a postagem a partir de um resultado de jogo. */
  gerarPostagem,

  /** Log padronizado. */
  log(msg: string): void {
    console.log(`[Gabi @ ${new Date().toISOString()}] 📰 ${msg}`);
  },
} as const;
