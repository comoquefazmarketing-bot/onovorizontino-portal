// Cliente HTTP para a API interna do SofaScore
// NÃO usar no client — apenas em rotas server-side
// Implementa cache, retry com backoff e degradação graciosa

const BASE_URL = process.env.SOFASCORE_BASE_URL ?? 'https://api.sofascore.com/api/v1';
const USER_AGENT =
  process.env.SOFASCORE_USER_AGENT ??
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';
const TIMEOUT_MS = 8000;
const TOURNAMENT_ID = process.env.SOFASCORE_TOURNAMENT_ID ?? '390'; // Série B

// Cache in-memory simples (por processo — suficiente para Vercel serverless por invocação)
const cache = new Map<string, { data: unknown; expires: number }>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expires) return null;
  return entry.data as T;
}

function setCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expires: Date.now() + ttlMs });
}

async function fetchWithRetry(url: string, maxRetries = 3): Promise<unknown> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
          'Accept-Language': 'pt-BR,pt;q=0.9',
          Referer: 'https://www.sofascore.com/',
        },
        next: { revalidate: 0 },
      });

      clearTimeout(timer);

      if (res.status === 429 || res.status === 403) {
        // Rate limit ou bloqueio — backoff exponencial
        const delay = Math.pow(2, attempt) * 2000;
        await new Promise(r => setTimeout(r, delay));
        lastError = new Error(`SofaScore bloqueou: HTTP ${res.status}`);
        continue;
      }

      if (!res.ok) {
        throw new Error(`SofaScore HTTP ${res.status}: ${url}`);
      }

      return await res.json();
    } catch (err) {
      clearTimeout(timer);
      lastError = err as Error;
      if (attempt < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError ?? new Error('Falha ao contatar SofaScore');
}

// ──────────────────────────────────────────────
// Funções públicas
// ──────────────────────────────────────────────

/** Retorna o seasonId da Série B para o ano atual */
export async function getSeasonId(): Promise<number> {
  const year = new Date().getFullYear();
  const cacheKey = `season-${year}`;
  const cached = getCached<number>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry(
    `${BASE_URL}/unique-tournament/${TOURNAMENT_ID}/seasons`
  ) as { seasons: { id: number; year: string }[] };

  const season = data.seasons?.find(s => s.year === String(year));
  if (!season) throw new Error(`Season ${year} não encontrada no SofaScore`);

  setCache(cacheKey, season.id, 24 * 60 * 60 * 1000); // 24h
  return season.id;
}

/** Lista as rodadas disponíveis */
export async function getRodadas(seasonId: number): Promise<{ round: number }[]> {
  const cacheKey = `rounds-${seasonId}`;
  const cached = getCached<{ round: number }[]>(cacheKey);
  if (cached) return cached;

  const data = await fetchWithRetry(
    `${BASE_URL}/unique-tournament/${TOURNAMENT_ID}/season/${seasonId}/rounds`
  ) as { rounds: { round: number }[] };

  const rounds = data.rounds ?? [];
  setCache(cacheKey, rounds, 6 * 60 * 60 * 1000); // 6h
  return rounds;
}

/** Busca os jogos de uma rodada */
export async function getEventsByRound(seasonId: number, round: number): Promise<SofaEvent[]> {
  const data = await fetchWithRetry(
    `${BASE_URL}/unique-tournament/${TOURNAMENT_ID}/season/${seasonId}/events/round/${round}`
  ) as { events: SofaEvent[] };

  return data.events ?? [];
}

/** Detalhe/placar de um evento */
export async function getEventDetail(eventId: number): Promise<SofaEvent> {
  // Cache curto para jogos ao vivo; longo para encerrados
  const cacheKey = `event-${eventId}`;
  const cached = getCached<SofaEvent>(cacheKey);
  if (cached && cached.status?.type === 'finished') return cached;

  const data = await fetchWithRetry(`${BASE_URL}/event/${eventId}`) as { event: SofaEvent };
  const event = data.event;

  const ttl = event.status?.type === 'finished'
    ? 60 * 60 * 1000  // 1h para encerrados
    : 60 * 1000;       // 1min para ao vivo

  setCache(cacheKey, event, ttl);
  return event;
}

/** Escalação e ratings dos jogadores de um evento */
export async function getEventLineups(eventId: number): Promise<SofaLineups | null> {
  try {
    const data = await fetchWithRetry(`${BASE_URL}/event/${eventId}/lineups`) as { confirmed: boolean; home: SofaTeamLineup; away: SofaTeamLineup };
    return data as SofaLineups;
  } catch {
    return null; // opcional — não derrubar o job se falhar
  }
}

// ──────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────

export interface SofaEvent {
  id: number;
  tournament?: { uniqueTournament?: { id: number } };
  roundInfo?: { round: number };
  startTimestamp?: number;
  venue?: { name?: string; city?: { name?: string }; country?: { name?: string } };
  homeTeam?: { id: number; name: string };
  awayTeam?: { id: number; name: string };
  homeScore?: { current?: number; display?: number };
  awayScore?: { current?: number; display?: number };
  status?: {
    type: 'notstarted' | 'inprogress' | 'finished' | 'postponed' | string;
    description?: string;
  };
  changes?: { changeTimestamp?: number };
}

export interface SofaLineups {
  confirmed: boolean;
  home: SofaTeamLineup;
  away: SofaTeamLineup;
}

export interface SofaTeamLineup {
  players?: SofaPlayer[];
}

export interface SofaPlayer {
  player: { id: number; name: string; shortName: string };
  position?: string;
  substitute?: boolean;
  statistics?: {
    goals?: number;
    goalAssist?: number;
    minutesPlayed?: number;
    yellowCard?: number;
    redCard?: number;
    yellowRedCard?: number;
    rating?: number;
  };
}
