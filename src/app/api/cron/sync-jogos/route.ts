import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ESPN undocumented public API — sem chave necessária
const ESPN_BASE     = 'https://site.api.espn.com/apis/site/v2/sports/soccer/bra.2';
const NOV_TEAM_ID   = '18127';
const COMPETICAO    = 'Série B 2026';

const SLUG_MAP: Record<string, string> = {
  novorizontino: 'novorizontino',
  gremionovorizontino: 'novorizontino',
  crb: 'crb',
  goias: 'goias',
  avai: 'avai',
  nautico: 'nautico',
  saobernardo: 'sao-bernardo',
  botafogosp: 'botafogo-sp',
  botafogospfc: 'botafogo-sp',
  americamineiro: 'america-mg',
  atleticogoianiense: 'atletico-go',
  atleticogo: 'atletico-go',
  ago: 'atletico-go',
  vilanova: 'vila-nova',
  pontepreta: 'ponte-preta',
  criciuma: 'criciuma',
  cuiaba: 'cuiaba',
  operario: 'operario-pr',
  operariopr: 'operario-pr',
  coritiba: 'coritiba',
  chapecoense: 'chapecoense',
  remo: 'remo',
  paysandu: 'paysandu',
  amazonas: 'amazonas',
  sport: 'sport',
  londrina: 'londrina',
  juventude: 'juventude',
  ceara: 'ceara',
  athletic: 'athletic',
  athleticclub: 'athletic',
};

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const toSlug = (name: string) => SLUG_MAP[normalize(name)] ?? normalize(name);

function espnStatusToLocal(state: string, completed: boolean, description: string): string {
  if (completed || state === 'final') return 'encerrado';
  if (state === 'live') return 'ao_vivo';
  if (description?.toLowerCase().includes('postponed') || description?.toLowerCase().includes('adiado')) return 'adiado';
  return 'agendado';
}

// Busca todos os jogos do Novorizontino na temporada via ESPN
async function fetchNovorizontinoFixtures() {
  // ESPN: /teams/{id}/schedule retorna calendário completo do time
  const url = `${ESPN_BASE}/teams/${NOV_TEAM_ID}/schedule`;
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`ESPN schedule error: ${res.status}`);

  const data = await res.json();
  // Estrutura: data.events[] ou data.team.schedule[] dependendo do endpoint
  const events: any[] = data?.events ?? data?.team?.nextEvent ?? [];
  return events;
}

// Busca jogos ao_vivo ou recentes pelo scoreboard do dia
async function fetchScoreboardDate(dateStr: string) {
  const res = await fetch(`${ESPN_BASE}/scoreboard?dates=${dateStr}`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.events ?? [];
}

function parseEvent(ev: any) {
  const competition = ev?.competitions?.[0] ?? ev;
  const competitors: any[] = competition?.competitors ?? [];

  // home = homeAway === 'home', away = 'away'
  const home = competitors.find((c: any) => c.homeAway === 'home') ?? competitors[0];
  const away = competitors.find((c: any) => c.homeAway === 'away') ?? competitors[1];

  if (!home || !away) return null;

  const status   = competition?.status ?? ev?.status ?? {};
  const stateStr = status?.type?.state ?? 'pre';
  const completed = status?.type?.completed ?? false;
  const desc     = status?.type?.description ?? '';

  const venue    = competition?.venue;
  const local    = venue
    ? [venue.fullName, venue.address?.city].filter(Boolean).join(' — ')
    : null;

  // Rodada: ESPN inclui em notes ou no nome da competição
  const notes: any[] = competition?.notes ?? [];
  const rodadaNote   = notes.find((n: any) => n.type === 'event' || n.headline?.toLowerCase().includes('rodada'));
  const rodadaMatch  = (rodadaNote?.headline ?? ev?.name ?? '').match(/(\d+)/);
  const rodada       = rodadaMatch?.[1] ?? '';

  const extId        = String(ev?.id ?? '');
  const dataHora     = ev?.date ?? competition?.date ?? '';

  const placarHome   = home?.score != null ? Number(home.score) : null;
  const placarAway   = away?.score != null ? Number(away.score) : null;

  const localStatus  = espnStatusToLocal(stateStr, completed, desc);
  const finalizado   = localStatus === 'encerrado';

  return {
    external_id:         extId,
    competicao:          COMPETICAO,
    rodada,
    mandante_slug:       toSlug(home.team?.displayName ?? home.displayName ?? ''),
    visitante_slug:      toSlug(away.team?.displayName ?? away.displayName ?? ''),
    data_hora:           dataHora,
    local,
    ativo:               !finalizado,
    placar_mandante:     placarHome,
    placar_visitante:    placarAway,
    finalizado,
    status:              localStatus,
    external_updated_at: new Date().toISOString(),
  };
}

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const result = { lidos: 0, inseridos: 0, atualizados: 0, adotados: 0, ignorados: 0, erros: 0 };

  try {
    // 1. Calendário completo do Novorizontino
    const events = await fetchNovorizontinoFixtures();
    result.lidos = events.length;

    // 2. Se houver jogo hoje/ontem, pega scoreboard para ter placar atualizado
    const hoje  = new Date();
    const ontem = new Date(hoje); ontem.setDate(ontem.getDate() - 1);
    const fmt   = (d: Date) => d.toISOString().slice(0,10).replace(/-/g,'');

    const [scoreHoje, scoreOntem] = await Promise.all([
      fetchScoreboardDate(fmt(hoje)),
      fetchScoreboardDate(fmt(ontem)),
    ]);

    // Mapa extId → evento com placar fresco
    const freshMap = new Map<string, any>();
    for (const ev of [...scoreHoje, ...scoreOntem]) {
      const comp = ev?.competitions?.[0];
      const isNov = comp?.competitors?.some((c: any) => c.team?.id === NOV_TEAM_ID || c.id === NOV_TEAM_ID);
      if (isNov) freshMap.set(String(ev.id), ev);
    }

    // Mescla: substitui evento do calendário pelo fresco se disponível
    const toProcess = events.map((ev: any) => freshMap.get(String(ev.id)) ?? ev);

    for (const ev of toProcess) {
      const parsed = parseEvent(ev);
      if (!parsed || !parsed.external_id || !parsed.mandante_slug || !parsed.data_hora) {
        result.ignorados++;
        continue;
      }

      const { data: existing } = await supabase
        .from('jogos').select('id').eq('external_id', parsed.external_id).maybeSingle();

      if (existing) {
        await supabase.from('jogos').update(parsed).eq('id', existing.id);
        result.atualizados++;
        continue;
      }

      // Adota jogo manual sem external_id (cadastrado antes do sync)
      const { data: manual } = await supabase
        .from('jogos').select('id')
        .is('external_id', null)
        .eq('mandante_slug', parsed.mandante_slug)
        .eq('visitante_slug', parsed.visitante_slug)
        .ilike('competicao', '%série b%')
        .maybeSingle();

      if (manual) {
        await supabase.from('jogos').update(parsed).eq('id', manual.id);
        result.adotados++;
        continue;
      }

      const { error } = await supabase.from('jogos').insert(parsed);
      if (!error) result.inseridos++;
      else { result.erros++; console.error('[sync-jogos] insert error:', error.message); }
    }

  } catch (err) {
    const msg = (err as Error).message;
    console.error('[sync-jogos] erro crítico:', msg);
    result.erros++;

    await supabase.from('tigre_fc_jobs_log').insert({
      job: 'sync-jogos', finalizado_em: new Date().toISOString(),
      status: 'erro', erros: 1, detalhes: { erro: msg },
    }).then(null, () => {});

    return NextResponse.json({ ok: false, erro: msg, ...result });
  }

  await supabase.from('tigre_fc_jobs_log').insert({
    job: 'sync-jogos',
    finalizado_em: new Date().toISOString(),
    status: result.erros > 0 ? 'parcial' : 'ok',
    criados: result.inseridos,
    atualizados: result.atualizados + result.adotados,
    detalhes: result,
  }).then(null, () => {});

  return NextResponse.json({ ok: true, ...result });
}
