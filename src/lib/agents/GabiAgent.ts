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

// ─── Templates de conteúdo ────────────────────────────────────────────────────

function gerarConteudo(jogo: JogoResultado): string {
  const res    = resultado(jogo);
  const adv    = adversario(jogo);
  const placar = placarNovo(jogo);
  const mnd    = mando(jogo);
  const dtObj  = new Date(jogo.data_hora);
  const data   = dtObj.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const hora   = dtObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const local  = jogo.local ?? (mnd === 'casa' ? 'Estádio Jorge Ismael de Biasi, Novo Horizonte (SP)' : 'estádio do adversário');
  const pm     = isNovorizontino(jogo.mandante_slug) ? jogo.placar_mandante : jogo.placar_visitante;
  const pv     = isNovorizontino(jogo.mandante_slug) ? jogo.placar_visitante : jogo.placar_mandante;

  const intros: Record<typeof res, string[]> = {
    vitória: [
      `Em uma tarde de pura garra e determinação, o <strong>Grêmio Novorizontino</strong> saiu com a vitória diante do <strong>${adv}</strong> pelo placar de <strong>${placar}</strong>, na ${data}, às ${hora}. O resultado, válido pela <strong>${jogo.competicao} — Rodada ${jogo.rodada}</strong>, representa mais três pontos preciosos somados pelo Tigre do Vale na tabela de classificação, mantendo a equipe firme na briga pelos seus objetivos na temporada.`,
      `O <strong>Grêmio Novorizontino</strong> entrou em campo nesta ${data} e não decepcionou: resultado positivo de <strong>${placar}</strong> sobre o <strong>${adv}</strong>, em partida válida pela <strong>Rodada ${jogo.rodada} da ${jogo.competicao}</strong>. O Tigre mostrou organização, intensidade e eficiência para garantir os três pontos e seguir na trilha dos seus objetivos na competição.`,
    ],
    derrota: [
      `O <strong>Grêmio Novorizontino</strong> teve uma noite difícil nesta ${data} pela <strong>${jogo.competicao}</strong>. Diante do <strong>${adv}</strong>, o Tigre foi superado pelo placar de <strong>${placar}</strong> na <strong>Rodada ${jogo.rodada}</strong>. O resultado representa um tropeço que exigirá pronta recuperação do grupo para não perder terreno na tabela de classificação.`,
      `A <strong>Rodada ${jogo.rodada} da ${jogo.competicao}</strong> reservou um resultado amargo ao <strong>Grêmio Novorizontino</strong>. Nesta ${data}, o Tigre foi derrotado pelo <strong>${adv}</strong> pelo placar de <strong>${placar}</strong>, evidenciando que há ajustes a fazer antes dos próximos compromissos da competição.`,
    ],
    empate: [
      `O <strong>Grêmio Novorizontino</strong> ficou no empate com o <strong>${adv}</strong> nesta ${data}, pelo placar de <strong>${placar}</strong>, em partida válida pela <strong>Rodada ${jogo.rodada} da ${jogo.competicao}</strong>. O resultado dividido, ainda que não seja o ideal, mantém o Tigre na disputa e representa um ponto conquistado fora de casa${mnd === 'casa' ? ' diante da própria torcida' : ''}.`,
      `Um a um, sem vencedor: nesta ${data}, o <strong>Grêmio Novorizontino</strong> e o <strong>${adv}</strong> protagonizaram um empate por <strong>${placar}</strong>, pela <strong>Rodada ${jogo.rodada} da ${jogo.competicao}</strong>. O ponto conquistado mantém o Tigre vivo na briga pelos objetivos da temporada, mas o grupo sabe que vitórias serão necessárias nas próximas rodadas.`,
    ],
  };

  const intro = pick(intros[res]);

  const oJogo: Record<typeof res, string> = {
    vitória: `<h2>O Jogo</h2>
<p>A partida foi realizada em <strong>${local}</strong>, com o Novorizontino ${mnd === 'casa' ? 'recebendo o ' + adv + ' no Jorjão' : 'viajando até o estádio do ' + adv + ' para disputar os três pontos'}. Desde o início, o Tigre mostrou que entrou em campo determinado a sair com a vitória.</p>
<p>No primeiro tempo, o Novorizontino apresentou uma postura propositiva, ocupando bem os espaços no campo adversário e explorando as transições rápidas. A organização defensiva deu sustentação ao time para apostar nos avanços ofensivos com segurança, construindo o jogo de forma consistente ao longo dos 45 minutos iniciais.</p>
<p>Na segunda etapa, a equipe da comissão técnica manteve o controle das ações e soube administrar a vantagem com inteligência. O Tigre fechou os espaços, trabalhou bem na pressão e não deixou o adversário criar oportunidades claras. Resultado: os três pontos foram garantidos com mérito e dedicação coletiva.</p>
<p>Vale destacar a coesão do grupo como um todo. O placar de <strong>${placar}</strong> não apenas reflete a qualidade técnica dos jogadores, mas também a dedicação de um elenco unido em torno de um mesmo objetivo: conquistar os pontos que farão a diferença ao final da ${jogo.competicao}.</p>`,

    derrota: `<h2>O Jogo</h2>
<p>O confronto foi realizado em <strong>${local}</strong>. O Novorizontino entrou em campo ciente da dificuldade de enfrentar o <strong>${adv}</strong>, mas com a confiança de um grupo que vem trabalhando arduamente nos treinos. Porém, o jogo não correu como o planejado.</p>
<p>No primeiro tempo, a equipe do Tigre teve dificuldades para encaixar seu jogo e dar fluidez às jogadas. O adversário soube explorar os espaços deixados pela defesa novorizontinense e aproveitou as chances criadas com eficiência, aumentando a pressão sobre o time de Novo Horizonte.</p>
<p>Na segunda etapa, o Novorizontino tentou reagir e buscou o gol para diminuir o placar. A equipe teve mais posse de bola e tentou impor seu ritmo, mas esbarrou na boa atuação do adversário e na falta de precisão nas finalizações. O resultado de <strong>${placar}</strong> ficou no placar ao apito final do árbitro.</p>
<p>A derrota dói, mas serve de aprendizado para o grupo. A comissão técnica já trabalha na análise do jogo para corrigir os pontos falhos e preparar a equipe para o próximo compromisso, onde o Tigre precisará somar pontos e mostrar resiliência.</p>`,

    empate: `<h2>O Jogo</h2>
<p>O jogo aconteceu em <strong>${local}</strong>, em um confronto que prometia muito e entregou uma batalha equilibrada do início ao fim. Os dois times se estudaram muito no campo, adotando postura cautelosa e apostando em contra-ataques para encontrar o caminho do gol.</p>
<p>No primeiro tempo, o ritmo foi intenso e as duas equipes criaram situações de perigo. O Novorizontino teve boas oportunidades, mas a eficiência ofensiva foi o fator que faltou para abrir o placar antes do intervalo. O empate sem gols ao fim dos primeiros 45 minutos representou um retrato fiel do equilíbrio visto em campo.</p>
<p>Na segunda etapa, os treinadores realizaram ajustes buscando o gol da vitória. O jogo ficou mais aberto, com as duas equipes arriscando mais e aceitando os riscos de uma derrota em troca da vitória. O Novorizontino pressionou, criou e lutou até o apito final, mas o marcador manteve o empate de <strong>${placar}</strong>.</p>
<p>O ponto conquistado tem seu valor, especialmente dado o contexto da <strong>Rodada ${jogo.rodada}</strong>. O Tigre demonstrou garra e competitividade, mas o grupo sabe que transformar empates em vitórias será fundamental para alcançar os objetivos da temporada.</p>`,
  };

  const analise: Record<typeof res, string> = {
    vitória: `<h2>Análise: Por que o Tigre Venceu</h2>
<p>A vitória do Novorizontino por <strong>${placar}</strong> foi construída sobre três pilares fundamentais: <strong>organização tática, intensidade no duelo e eficiência nas chances criadas</strong>. O Tigre soube quando pressionar e quando recuar, demonstrando maturidade coletiva que é fruto do trabalho da comissão técnica.</p>
<p>Do ponto de vista defensivo, a equipe foi sólida e não permitiu que o adversário criasse oportunidades claras de gol. A linha defensiva trabalhou bem na marcação e nos ajustes posicionais, dando segurança ao time para investir no ataque com mais convicção.</p>
<p>Ofensivamente, o Novorizontino mostrou criatividade nas jogadas e objetividade na finalização. A capacidade de transformar as chances criadas em gols é um dos pontos mais positivos do jogo e algo que a comissão técnica certamente vai destacar na análise pós-partida.</p>
<p>O resultado coloca o Tigre em boa posição na tabela da <strong>${jogo.competicao}</strong> e reforça a confiança do grupo para as próximas semanas. Com esse tipo de apresentação, o Novorizontino se consolida como um time competitivo e difícil de ser batido.</p>`,

    derrota: `<h2>Análise: O Que Faltou</h2>
<p>A derrota por <strong>${placar}</strong> expõe aspectos que precisam ser trabalhados pelo Novorizontino nas próximas semanas. O adversário foi mais eficiente nas finalizações e soube aproveitar as falhas apresentadas pelo Tigre ao longo da partida.</p>
<p>Do ponto de vista defensivo, a equipe sofreu com a pressão aplicada pelo ${adv} e teve dificuldades para cortar as jogadas nas áreas de maior perigo. Os espaços deixados entre as linhas foram explorados pelo adversário com inteligência, resultando nas oportunidades que decidiram o jogo.</p>
<p>No setor ofensivo, o Novorizontino criou poucas chances e não conseguiu converter as oportunidades que apareceram. A falta de precisão nas finalizações foi um fator determinante para o placar negativo. O Tigre precisa de mais eficiência para não desperdiçar as chances que cria.</p>
<p>Apesar da derrota, o grupo mantém a cabeça erguida. O trabalho continua e a comissão técnica terá tempo para fazer os ajustes necessários antes do próximo jogo. A competição ainda tem muitas rodadas pela frente e o Novorizontino tem qualidade para reagir.</p>`,

    empate: `<h2>Análise: Um Ponto que Vale</h2>
<p>O empate por <strong>${placar}</strong> mostrou um Novorizontino capaz de não perder em circunstâncias difíceis, mas também evidenciou limitações ofensivas que precisarão ser trabalhadas. O Tigre teve solidez defensiva, mas faltou precisão no terço final do campo para buscar a vitória que o jogo permitia.</p>
<p>A organização tática do Novorizontino foi positiva. O time manteve a forma defensiva durante toda a partida e não permitiu que o adversário chegasse com frequência à área com perigo real. Essa característica deve ser preservada e potencializada nas próximas semanas.</p>
<p>No ataque, a equipe precisa evoluir na criação e na finalização. As poucas oportunidades claras criadas ao longo dos 90 minutos foram insuficientes para garantir a vitória. A comissão técnica certamente trabalhará esse aspecto nos treinos antes do próximo jogo.</p>
<p>O ponto somado mantém o Novorizontino na briga na tabela da <strong>${jogo.competicao}</strong>. A consistência defensiva é uma base sólida sobre a qual o time pode construir resultados melhores nas próximas rodadas.</p>`,
  };

  const contexto: Record<typeof res, string> = {
    vitória: `<h2>Situação na Tabela</h2>
<p>Com os três pontos conquistados na <strong>Rodada ${jogo.rodada}</strong>, o Novorizontino reforça sua posição na tabela de classificação da <strong>${jogo.competicao}</strong>. O resultado pressiona os concorrentes diretos e aumenta a confiança do grupo para os desafios que ainda estão por vir na competição.</p>
<p>A campanha do Tigre na ${jogo.competicao} segue com resultados que demonstram a consistência do trabalho realizado. Cada vitória somada é um passo a mais rumo ao objetivo final da temporada, e o grupo tem consciência da importância de manter esse nível de desempenho nas próximas rodadas.</p>`,

    derrota: `<h2>Situação na Tabela</h2>
<p>Com a derrota na <strong>Rodada ${jogo.rodada}</strong> da <strong>${jogo.competicao}</strong>, o Novorizontino perde pontos preciosos na tabela de classificação. Os concorrentes diretos podem se aproximar ou ampliar a distância, tornando o próximo jogo ainda mais importante para a equipe de Novo Horizonte.</p>
<p>O Tigre precisa de uma resposta rápida. A sequência de jogos na ${jogo.competicao} não permite luxos, e o grupo sabe que só com vitórias o Novorizontino poderá retomar o caminho dos objetivos traçados para a temporada. O foco já está no próximo desafio.</p>`,

    empate: `<h2>Situação na Tabela</h2>
<p>O empate na <strong>Rodada ${jogo.rodada}</strong> da <strong>${jogo.competicao}</strong> acrescenta um ponto ao saldo do Novorizontino na tabela de classificação. O resultado mantém o Tigre na disputa, mas a equipe sabe que vitórias serão necessárias para avançar no ranking e se aproximar dos objetivos da temporada.</p>
<p>A ${jogo.competicao} ainda tem muitas rodadas pela frente, e o Novorizontino tem tempo para ajustar os ponteiros e buscar os resultados que o grupo e a torcida esperam. O trabalho continua no CT, com foco total no próximo compromisso.</p>`,
  };

  const fichaTecnica = `<h2>Ficha Técnica</h2>
<table>
  <tbody>
    <tr><td><strong>Competição</strong></td><td>${jogo.competicao} — Rodada ${jogo.rodada}</td></tr>
    <tr><td><strong>Data e Hora</strong></td><td>${data}, às ${hora}</td></tr>
    <tr><td><strong>Local</strong></td><td>${local}</td></tr>
    <tr><td><strong>Mandante</strong></td><td>${nome(jogo.mandante_slug)} ${jogo.placar_mandante}</td></tr>
    <tr><td><strong>Visitante</strong></td><td>${nome(jogo.visitante_slug)} ${jogo.placar_visitante}</td></tr>
  </tbody>
</table>`;

  return [
    `<p>${intro}</p>`,
    oJogo[res],
    analise[res],
    contexto[res],
    fichaTecnica,
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
