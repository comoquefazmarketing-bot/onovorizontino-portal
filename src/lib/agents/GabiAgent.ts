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
  'palmeiras': 'Palmeiras', 'corinthians': 'Corinthians', 'sao-paulo': 'São Paulo',
  'flamengo': 'Flamengo', 'fluminense': 'Fluminense', 'botafogo': 'Botafogo',
  'santos-fc': 'Santos', 'gremio': 'Grêmio', 'internacional': 'Internacional',
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

// ─── Logos dos adversários (canvas-safe para imagem_capa) ────────────────────

const SB = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';
const WK = 'https://upload.wikimedia.org/wikipedia/commons';
const ESCUDO_NOVORIZONTINO = `${SB}/Escudo%20Novorizontino.png`;

const LOGOS_CAPA: Record<string, string> = {
  'novorizontino':        ESCUDO_NOVORIZONTINO,
  'gremio-novorizontino': ESCUDO_NOVORIZONTINO,
  'avai':                 `${SB}/Avai_Futebol_Clube_logo.svg.png`,
  'botafogo-sp':          `${SB}/Botafogo_sp.svg`,
  'america-mg':           `${SB}/ESCUDO%20AMERICA%20MINEIRO.png`,
  'criciuma':             `${WK}/2/24/Crici%C3%BAma_EC_logo.svg`,
  'cuiaba':               `${WK}/9/9e/Cuiab%C3%A1_EC.svg`,
  'crb':                  `${WK}/7/73/CRB_logo.svg`,
  'sport':                `${WK}/1/17/Sport_Club_do_Recife.png`,
  'londrina':             `${WK}/a/a2/Londrina_Esporte_Clube.svg`,
  'juventude':            `${WK}/8/8b/Esporte_Clube_Juventude.svg`,
  'ceara':                `${WK}/2/27/Ceara_Sporting_Club_logo.svg`,
  'sao-bernardo':         `${WK}/7/7d/S%C3%A3o_Bernardo_Futebol_Clube.png`,
  'operario-pr':          `${WK}/0/00/Operar%C3%A1rio_Ferroviario_Esporte_Clube.svg`,
  'chapecoense':          `${WK}/0/0f/Chapecoense_crest.svg`,
  'goias':                `${WK}/b/bd/Goias_logo.svg`,
  'vila-nova':            `${WK}/4/48/Vila_Nova_Futebol_Clube.png`,
  'ponte-preta':          `${WK}/2/29/Associacao_Atletica_Ponte_Preta_logo.svg`,
  'athletic':             `${WK}/thumb/f/f8/Athletic_Club_%28Minas_Gerais%29.svg/320px-Athletic_Club_%28Minas_Gerais%29.svg.png`,
  'athletic-mg':          `${WK}/thumb/f/f8/Athletic_Club_%28Minas_Gerais%29.svg/320px-Athletic_Club_%28Minas_Gerais%29.svg.png`,
};

function imagemCapa(jogo: JogoResultado): string | null {
  const adv = isNovorizontino(jogo.mandante_slug) ? jogo.visitante_slug : jogo.mandante_slug;
  return LOGOS_CAPA[adv] ?? null;
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

// ─── Templates de conteúdo — mínimo 3.000 caracteres, HTML ──────────────────

function gerarConteudo(jogo: JogoResultado): string {
  const res    = resultado(jogo);
  const adv    = adversario(jogo);
  const pl     = placarNovo(jogo);
  const mnd    = mando(jogo);
  const comp   = jogo.competicao;
  const local  = jogo.local ?? (mnd === 'casa' ? 'Estádio Jorge Ismael de Biasi — Novo Horizonte' : 'estádio do adversário');
  const data   = new Date(jogo.data_hora).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const mandanteNome = nome(jogo.mandante_slug);
  const visitanteNome = nome(jogo.visitante_slug);
  const isCopa = comp.toLowerCase().includes('copa');
  const jogoVolta = isCopa ? ` — o Tigre ainda tem o jogo de volta pela frente` : '';

  // ── LEADS (parágrafo de abertura, ~250 chars cada) ─────────────────────────
  const leads = {
    vitória: [
      `<p>O Grêmio Novorizontino não deu chances ao <strong>${adv}</strong> e confirmou os três pontos nesta <strong>${data}</strong>. O placar de <strong>${pl}</strong>, construído com organização e determinação, reforça o projeto do Tigre do Vale na <strong>${comp}</strong>. É a prova de que o trabalho da semana aparece no resultado do fim de semana.</p>`,
      `<p>Missão cumprida. O Novorizontino dominou o <strong>${adv}</strong> nesta <strong>${data}</strong>, venceu por <strong>${pl}</strong> e mostrou por que é levado a sério na <strong>${comp}</strong>. O Jorjão vibrou, a torcida empurrou e o Tigre entregou o que prometeu: entrega total e os três pontos em casa.</p>`,
      `<p>Vitória. Três pontos. Mais um passo dado. O Grêmio Novorizontino superou o <strong>${adv}</strong> pelo placar de <strong>${pl}</strong> na tarde desta <strong>${data}</strong>. O resultado na <strong>${comp}</strong> confirma a evolução do grupo e a consistência que a comissão técnica vem buscando ao longo da temporada.</p>`,
    ],
    derrota: [
      `<p>Não foi o dia do Tigre. O Grêmio Novorizontino saiu derrotado diante do <strong>${adv}</strong> pelo placar de <strong>${pl}</strong>, nesta <strong>${data}</strong>, pela <strong>${comp}</strong>${jogoVolta}. O resultado é ruim, mas o campeonato não acaba aqui — e a torcida sabe disso melhor do que ninguém.</p>`,
      `<p>Derrota doída. O Novorizontino não conseguiu superar o <strong>${adv}</strong> nesta <strong>${data}</strong> e saiu de campo com o placar negativo de <strong>${pl}</strong> na <strong>${comp}</strong>. Há muito a corrigir e pouco tempo para lamentação${jogoVolta}.</p>`,
      `<p>O <strong>${adv}</strong> foi melhor nesta <strong>${data}</strong> e venceu o Novorizontino por <strong>${pl}</strong> pela <strong>${comp}</strong>. Um resultado que dói — mas que precisa ser encarado com honestidade para que a sequência da temporada seja diferente${jogoVolta}.</p>`,
    ],
    empate: [
      `<p>Dividiu os pontos. O Grêmio Novorizontino ficou no empate com o <strong>${adv}</strong> nesta <strong>${data}</strong>, pelo placar de <strong>${pl}</strong>, pela <strong>${comp}</strong>. Um ponto que pode ser visto de diferentes ângulos — mas que, em campo, deixou um gosto amargo para quem foi ao Jorjão esperando a vitória.</p>`,
      `<p>Um ponto cada. O Novorizontino e o <strong>${adv}</strong> não se separaram no placar nesta <strong>${data}</strong>. O <strong>${pl}</strong> final na <strong>${comp}</strong> reflete um jogo de equilíbrio, disputas intensas e poucas definições — o tipo de partida que os números não conseguem contar por inteiro.</p>`,
    ],
  };

  // ── NARRATIVA DO JOGO (~600 chars) ─────────────────────────────────────────
  const narrativa = {
    vitória: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Como Foi o Jogo</h2>
<p>A partida foi disputada ${mnd === 'casa' ? `em <strong>${local}</strong>, diante da sua torcida` : `em <strong>${local}</strong>, fora dos domínios do Jorjão`}. O Novorizontino entrou em campo com o sistema organizado e a intensidade que se tornou marca do grupo nesta temporada. Nos primeiros minutos, o Tigre já demonstrou que viria para cima — pressionando a saída de bola do adversário e criando espaços nas costas da linha defensiva do <strong>${adv}</strong>.</p>
<p>À medida que a partida avançou, o Novorizontino foi impondo seu ritmo. A marcação alta funcionou, o meio-campo deu suporte e os jogadores de frente souberam aproveitar os espaços. O placar de <strong>${pl}</strong> não chegou por acaso — foi construído com coletivo, paciência e a qualidade individual que o grupo demonstrou ter ao longo da <strong>${comp}</strong>.</p>`,
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">90 Minutos de Intensidade</h2>
<p>O jogo aconteceu em <strong>${local}</strong> e o Novorizontino mostrou, já nos primeiros minutos, que a semana de treinos rendeu frutos. Com a posse de bola bem trabalhada e transições rápidas, o Tigre foi construindo o domínio da partida e deixando o <strong>${adv}</strong> sem espaços para criar.</p>
<p>O segundo tempo confirmou o domínio Novorizontino. A equipe de Novo Horizonte soube administrar a vantagem, sem abrir mão de buscar mais gols, e garantiu os três pontos com a seriedade que uma campanha sólida na <strong>${comp}</strong> exige.</p>`,
    ],
    derrota: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">O Que Aconteceu em Campo</h2>
<p>A partida foi realizada em <strong>${local}</strong>. O Novorizontino começou com cautela, tentando encontrar os espaços na estrutura do <strong>${adv}</strong>, mas encontrou dificuldades para criar jogadas com profundidade. A equipe adversária soube explorar os erros do Tigre com eficiência e converteu as oportunidades que teve.</p>
<p>No segundo tempo, o Novorizontino tentou reagir e buscou o jogo com mais intensidade, mas esbarrou na solidez defensiva do <strong>${adv}</strong> e na falta de objetividade nos momentos decisivos. O placar de <strong>${pl}</strong> ficou marcado como um resultado que cobra resposta imediata do grupo.</p>`,
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Um Dia Para Esquecer — Mas Não Ignorar</h2>
<p>Em <strong>${local}</strong>, o Novorizontino viveu um dos seus dias mais difíceis na <strong>${comp}</strong>. O time não conseguiu impor seu estilo, perdeu nas disputas do meio-campo e sofreu com a pressão do <strong>${adv}</strong> em momentos cruciais da partida.</p>
<p>O placar de <strong>${pl}</strong> reflete uma atuação abaixo do esperado. A torcida, que sempre empurra o Tigre, merece ver uma resposta contundente no próximo compromisso — e esse grupo tem capacidade para dar essa resposta.</p>`,
    ],
    empate: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Um Jogo de Equilíbrio</h2>
<p>Em <strong>${local}</strong>, as equipes protagonizaram uma partida de equilíbrio. O Novorizontino buscou o jogo com intensidade, mas encontrou pela frente um <strong>${adv}</strong> bem postado e difícil de ser batido. A primeira etapa terminou sem gols e com a disputa centrada no meio-campo.</p>
<p>No segundo tempo, o ritmo aumentou. O Tigre criou situações e pressionou em busca dos três pontos, mas a bola não entrou. O <strong>${pl}</strong> final é honesto com o que foi a partida — dois times bem estudados mutuamente, sem que nenhum conseguisse o gol da vitória.</p>`,
    ],
  };

  // ── ANÁLISE E IMPACTO (~500 chars) ─────────────────────────────────────────
  const analise = {
    vitória: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">O Que Esta Vitória Representa</h2>
<p>Mais do que três pontos, esta vitória consolida a confiança dentro do grupo. Ganhar é importante para qualquer equipe, mas a forma como o Novorizontino conquistou o resultado — com controle e organização — diz muito sobre o estágio de desenvolvimento do trabalho na <strong>${comp}</strong>. Cada vitória é um tijolo a mais na construção de uma campanha sólida.</p>
<p>Para a torcida, é a confirmação de que o investimento emocional vale a pena. O Tigre do Vale tem uma identidade clara e um grupo que sabe do tamanho da camisa que veste.</p>`,
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Impacto na Tabela e na Confiança</h2>
<p>O resultado na <strong>${comp}</strong> tem peso duplo: pontua e eleva a autoestima do grupo. Em competições de desgaste como esta, saber vencer mesmo quando o adversário dificulta é uma característica de times que chegam ao fim da temporada brigando pelo que importa. O Novorizontino mostrou que tem esse repertório.</p>
<p>A sequência agora é fundamental. Uma vitória puxa outra — e o Tigre sabe como aproveitar o embalo.</p>`,
    ],
    derrota: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">O Que Precisa Mudar</h2>
<p>Derrota cobrada com honestidade é derrota aproveitada. O Novorizontino precisa olhar para o que não funcionou nesta partida — seja na marcação, na criação ou na efetividade — e corrigir antes do próximo jogo. Campeonato é maratona, não sprint, e tropeços fazem parte. O que define os times sérios é a resposta que vem depois.</p>
<p>A <strong>${comp}</strong> ainda tem muito pela frente. O Tigre tem elenco, tem estrutura e tem torcida. O que falta, quando o resultado não vem, é dar a resposta certa dentro de campo.</p>`,
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Análise Sincera</h2>
<p>Não há como defender o resultado. O <strong>${adv}</strong> foi melhor e venceu com mérito. O Novorizontino precisa olhar para esta partida sem filtros, entender onde falhou e não repetir os mesmos erros. A <strong>${comp}</strong> não perdoa quem não aprende com as derrotas.</p>
<p>O grupo tem qualidade para reagir. O torcedor sabe disso. E é exatamente por isso que a cobrança é alta — porque a expectativa também é.</p>`,
    ],
    empate: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Vale o Ponto ou Perdemos Dois?</h2>
<p>Dependendo da rodada e do momento da <strong>${comp}</strong>, um empate pode ser valioso ou desperdiçado. O fato é que o Novorizontino buscou os três pontos, teve situações para isso e não converteu. O ponto fica, mas fica também a sensação de que com um pouco mais de eficiência o resultado poderia ter sido outro.</p>
<p>Em temporada longa, pontos fora de casa costumam fazer diferença. O Tigre seguiu invicto e mantém a sequência — o que é importante —, mas sabe que precisa ser mais contundente quando as oportunidades aparecem.</p>`,
    ],
  };

  // ── PRÓXIMOS PASSOS / OLHAR À FRENTE (~400 chars) ──────────────────────────
  const proximo = {
    vitória: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">O Que Vem Por Aí</h2>
<p>Com a vitória no bolso, o Novorizontino volta às atividades durante a semana com a cabeça focada no próximo compromisso. A rotina de um clube que quer construir algo sólido na <strong>${comp}</strong> passa por saber celebrar — e logo em seguida, colocar o foco no que vem pela frente. O Tigre sabe fazer isso.</p>`,
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Sequência Decisiva</h2>
<p>A vitória dá confiança, mas o trabalho não para. O elenco se reapresenta durante a semana para iniciar a preparação para o próximo jogo da <strong>${comp}</strong>. Cada detalhe conta. Cada treino importa. É assim que se constrói uma campanha à altura do Grêmio Novorizontino.</p>`,
    ],
    derrota: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">A Resposta Tem Que Vir em Campo</h2>
<p>Após a derrota, o Novorizontino tem pouco tempo para lamentar. A semana começa com análise do que não funcionou e com a preparação já voltada para o próximo jogo da <strong>${comp}</strong>. Discurso não paga ponto — o Tigre precisa mostrar a resposta onde ela tem que aparecer: dentro das quatro linhas.</p>`,
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">Próxima Parada</h2>
<p>A derrota precisa ser digerida, estudada e virada de página com rapidez. O próximo jogo da <strong>${comp}</strong> já está no radar da comissão técnica. O grupo vai se reapresentar, trabalhar os pontos falhos e buscar a reabilitação. Esse é o caminho.</p>`,
    ],
    empate: [
      `<h2 style="color:#F5C400;font-size:1.3rem;font-weight:900;text-transform:uppercase;margin:2rem 0 0.75rem;">A Semana Começa Agora</h2>
<p>O empate fica registrado na tabela. O Novorizontino volta ao trabalho durante a semana com o objetivo de afinar o que não saiu bem e chegar mais forte no próximo jogo da <strong>${comp}</strong>. Um ponto é melhor que zero — mas o Tigre sabe que pode e deve buscar mais.</p>`,
    ],
  };

  // ── FECHAMENTO EMOCIONAL (~300 chars) ──────────────────────────────────────
  const fechamentos = {
    vitória: [
      `<p style="border-left:4px solid #F5C400;padding-left:1rem;font-style:italic;color:#d4d4d4;margin-top:2rem;">O Tigre rugiu. A torcida respondeu. É assim no Jorjão — e é assim que o Novorizontino escreve sua história nesta temporada. <strong>Que venha o próximo.</strong></p>`,
      `<p style="border-left:4px solid #F5C400;padding-left:1rem;font-style:italic;color:#d4d4d4;margin-top:2rem;">Mais três pontos, mais um passo. O Grêmio Novorizontino segue firme na <strong>${comp}</strong> — e a torcida do Tigre do Vale tem motivo para acreditar.</p>`,
    ],
    derrota: [
      `<p style="border-left:4px solid #F5C400;padding-left:1rem;font-style:italic;color:#d4d4d4;margin-top:2rem;">Derrota não define. Reação define. O Novorizontino tem material humano e técnico para dar a volta por cima — e a torcida estará lá quando isso acontecer.</p>`,
      `<p style="border-left:4px solid #F5C400;padding-left:1rem;font-style:italic;color:#d4d4d4;margin-top:2rem;">O resultado dói porque o amor pelo clube é real. Mas o Tigre levanta — sempre levantou. A <strong>${comp}</strong> ainda tem muito pela frente.</p>`,
    ],
    empate: [
      `<p style="border-left:4px solid #F5C400;padding-left:1rem;font-style:italic;color:#d4d4d4;margin-top:2rem;">Um ponto. Não o ideal, mas um ponto. O Novorizontino segue na <strong>${comp}</strong> e a caminhada continua — com a torcida do Tigre do Vale acompanhando cada passo.</p>`,
    ],
  };

  // ── MONTA O ARTIGO COMPLETO ────────────────────────────────────────────────
  const lN = leads[res];
  const nN = narrativa[res];
  const aN = analise[res];
  const pN = proximo[res];
  const fN = fechamentos[res];

  return [
    pick(lN as string[]),
    pick(nN as string[]),
    pick(aN as string[]),
    pick(pN as string[]),
    pick(fN as string[]),
  ].join('\n\n');
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
    imagem_capa: imagemCapa(jogo),
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
