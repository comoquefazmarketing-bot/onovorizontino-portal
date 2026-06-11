// Módulo de regras de pontuação do Tigre FC
// Testável de forma independente — sem dependências de banco

export interface EstatisticasJogador {
  jogador_id: string;
  gols: number;
  assistencias: number;
  minutos_jogados: number;
  cartao_amarelo: boolean;
  cartao_vermelho: boolean;
  sem_tomar_gol: boolean; // goleiro/zagueiro ficou sem levar gol
}

export interface ResultadoJogo {
  gols_novorizontino: number;
  gols_adversario: number;
}

export interface EscalacaoUsuario {
  lineup: string[];         // array de jogador_ids
  capitao_id: string;
  heroi_id: string;
  palpite_tigre: number;
  palpite_adv: number;
}

export interface PontosJogador {
  jogador_id: string;
  pontos_base: number;
  multiplicador: number;   // 2 se capitão
  bonus_heroi: number;     // +10 se herói
  pontos_total: number;
  detalhes: Record<string, number>;
}

export interface ResultadoPontuacao {
  pontos_total: number;
  pontos_lineup: number;
  bonus_palpite: number;
  jogadores: PontosJogador[];
}

// ──────────────────────────────────────────────
// Regras (confirmar valores com o product owner)
// ──────────────────────────────────────────────
const PONTOS = {
  gol:              8,
  assistencia:      5,
  titular_60min:    2,
  sem_tomar_gol:    5,
  placar_exato:     15,
  resultado_certo:  5,
  heroi_partida:    10,
  cartao_amarelo:  -2,
  cartao_vermelho: -5,
} as const;

const MULTIPLICADOR_CAPITAO = 2;

function pontosJogador(
  stats: EstatisticasJogador,
  isCapitao: boolean,
  isHeroi: boolean
): PontosJogador {
  const detalhes: Record<string, number> = {};

  if (stats.gols > 0)            detalhes.gols           = stats.gols * PONTOS.gol;
  if (stats.assistencias > 0)    detalhes.assistencias    = stats.assistencias * PONTOS.assistencia;
  if (stats.minutos_jogados >= 60) detalhes.titular_60min = PONTOS.titular_60min;
  if (stats.sem_tomar_gol)       detalhes.sem_tomar_gol  = PONTOS.sem_tomar_gol;
  if (stats.cartao_amarelo)      detalhes.cartao_amarelo  = PONTOS.cartao_amarelo;
  if (stats.cartao_vermelho)     detalhes.cartao_vermelho = PONTOS.cartao_vermelho;

  const pontos_base     = Object.values(detalhes).reduce((a, b) => a + b, 0);
  const multiplicador   = isCapitao ? MULTIPLICADOR_CAPITAO : 1;
  const bonus_heroi     = isHeroi ? PONTOS.heroi_partida : 0;
  const pontos_total    = pontos_base * multiplicador + bonus_heroi;

  return { jogador_id: stats.jogador_id, pontos_base, multiplicador, bonus_heroi, pontos_total, detalhes };
}

function bonusPalpite(
  escalacao: EscalacaoUsuario,
  resultado: ResultadoJogo
): number {
  let bonus = 0;
  const acertouExato =
    escalacao.palpite_tigre === resultado.gols_novorizontino &&
    escalacao.palpite_adv   === resultado.gols_adversario;
  const acertouResultado =
    Math.sign(escalacao.palpite_tigre - escalacao.palpite_adv) ===
    Math.sign(resultado.gols_novorizontino - resultado.gols_adversario);

  if (acertouExato)     bonus += PONTOS.placar_exato;
  else if (acertouResultado) bonus += PONTOS.resultado_certo;

  return bonus;
}

export function calcularPontuacao(
  escalacao: EscalacaoUsuario,
  estatisticas: EstatisticasJogador[],
  resultado: ResultadoJogo
): ResultadoPontuacao {
  const statsMap = new Map(estatisticas.map(s => [s.jogador_id, s]));

  const jogadores: PontosJogador[] = escalacao.lineup.map(jid => {
    const stats = statsMap.get(jid) ?? {
      jogador_id:       jid,
      gols:             0,
      assistencias:     0,
      minutos_jogados:  0,
      cartao_amarelo:   false,
      cartao_vermelho:  false,
      sem_tomar_gol:    false,
    };
    return pontosJogador(
      stats,
      jid === escalacao.capitao_id,
      jid === escalacao.heroi_id
    );
  });

  const pontos_lineup = jogadores.reduce((acc, j) => acc + j.pontos_total, 0);
  const bonus_palpite = bonusPalpite(escalacao, resultado);
  const pontos_total  = pontos_lineup + bonus_palpite;

  return { pontos_total, pontos_lineup, bonus_palpite, jogadores };
}
