// Provider de calendário — interface desacoplada da fonte de dados
// Trocar de SofaScore para outra fonte = mudar só a implementação aqui

import {
  getSeasonId,
  getRodadas,
  getEventsByRound,
  getEventDetail,
  type SofaEvent,
} from './sofascore-client';

// ID do Novorizontino no SofaScore (estável)
const NOVORIZONTINO_SOFA_ID = 5594;

// Mapa sofascoreTeamId → slug do projeto
const TEAM_SLUG: Record<number, string> = {
  5594:  'novorizontino',
  1954:  'goias',
  6083:  'nautico',
  2040:  'ceara',
  4753:  'sao-bernardo',
  5629:  'chapecoense',
  1636:  'sport',
  1636:  'sport-recife',
  5000:  'coritiba',
  1967:  'avai',
  6225:  'operario',
  1672:  'guarani',
  6310:  'botafogo-sp',
  6284:  'athletic',
  1661:  'paysandu',
  5755:  'sampaio-correa',
  1666:  'ituano',
  5625:  'mirassol',
  1677:  'ponte-preta',
  5594:  'novorizontino',
};

export interface JogoSincronizavel {
  external_id: string;
  competicao: string;
  rodada: string;
  data_hora: string;          // ISO 8601 com timezone
  mandante_slug: string;
  visitante_slug: string;
  local: string | null;
  placar_mandante: number | null;
  placar_visitante: number | null;
  status: 'agendado' | 'ao_vivo' | 'encerrado' | 'adiado';
  finalizado: boolean;
  external_updated_at: string;
}

function mapStatus(type: string): JogoSincronizavel['status'] {
  if (type === 'finished')   return 'encerrado';
  if (type === 'inprogress') return 'ao_vivo';
  if (type === 'postponed')  return 'adiado';
  return 'agendado';
}

function slugFromTeam(id: number, name: string): string {
  if (TEAM_SLUG[id]) return TEAM_SLUG[id];
  // Fallback: normaliza o nome
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function eventToJogo(ev: SofaEvent): JogoSincronizavel | null {
  if (!ev.homeTeam || !ev.awayTeam || !ev.startTimestamp) return null;

  // Filtra apenas jogos do Novorizontino
  const envolveNovorizontino =
    ev.homeTeam.id === NOVORIZONTINO_SOFA_ID ||
    ev.awayTeam.id === NOVORIZONTINO_SOFA_ID;
  if (!envolveNovorizontino) return null;

  const status = mapStatus(ev.status?.type ?? 'notstarted');
  const local = ev.venue
    ? [ev.venue.name, ev.venue.city?.name, ev.venue.country?.name]
        .filter(Boolean)
        .join(' — ')
    : null;

  return {
    external_id: String(ev.id),
    competicao:  'Série B 2026',
    rodada:      String(ev.roundInfo?.round ?? '?'),
    data_hora:   new Date(ev.startTimestamp * 1000).toISOString(),
    mandante_slug: slugFromTeam(ev.homeTeam.id, ev.homeTeam.name),
    visitante_slug: slugFromTeam(ev.awayTeam.id, ev.awayTeam.name),
    local,
    placar_mandante:  ev.homeScore?.current ?? null,
    placar_visitante: ev.awayScore?.current ?? null,
    status,
    finalizado: status === 'encerrado',
    external_updated_at: new Date().toISOString(),
  };
}

/** Busca todos os jogos do Novorizontino na temporada atual */
export async function fetchJogosNovorizontino(): Promise<JogoSincronizavel[]> {
  const seasonId = await getSeasonId();
  const rodadas  = await getRodadas(seasonId);
  const jogos: JogoSincronizavel[] = [];

  for (const { round } of rodadas) {
    try {
      const events = await getEventsByRound(seasonId, round);
      for (const ev of events) {
        const jogo = eventToJogo(ev);
        if (jogo) jogos.push(jogo);
      }
    } catch (err) {
      console.error(`[calendario-provider] Erro na rodada ${round}:`, err);
      // Não aborta — continua as próximas rodadas
    }
  }

  return jogos;
}

/** Atualiza placar de jogos ao_vivo ou recém-encerrados */
export async function fetchResultadosRecentes(externalIds: string[]): Promise<JogoSincronizavel[]> {
  const atualizados: JogoSincronizavel[] = [];

  for (const extId of externalIds) {
    try {
      const ev = await getEventDetail(Number(extId));
      const jogo = eventToJogo(ev);
      if (jogo) atualizados.push(jogo);
    } catch (err) {
      console.error(`[calendario-provider] Erro ao atualizar evento ${extId}:`, err);
    }
  }

  return atualizados;
}
