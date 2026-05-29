import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// ── Configurações ─────────────────────────────────────────────────────
const API_BASE = 'https://v3.football.api-sports.io';
const LEAGUE_SERIE_B = 72;
const COMPETICAO = 'Série B 2026';

const SLUG_MAP: Record<string, string> = {
  novorizontino: 'novorizontino',
  gremionovorizontino: 'novorizontino',
  goias: 'goias',
  nautico: 'nautico',
  saobernardo: 'sao-bernardo',
  avai: 'avai',
  botafogosp: 'botafogo-sp',
  americamineiro: 'america-mg',
  atleticogoianiense: 'atletico-go',
  vilanova: 'vila-nova',
  pontepreta: 'ponte-preta',
  crb: 'crb',
  criciuma: 'criciuma',
  cuiaba: 'cuiaba',
  operario: 'operario-pr',
  coritiba: 'coritiba',
  chapecoense: 'chapecoense',
  remo: 'remo',
  paysandu: 'paysandu',
  amazonas: 'amazonas',
  sport: 'sport',
  londrina: 'londrina',
  juventude: 'juventude',
  ceara: 'ceara',
  fortaleza: 'fortaleza',
  athletic: 'athletic',
};

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const toSlug = (apiName: string) => SLUG_MAP[normalize(apiName)] ?? normalize(apiName);

const isFinished = (short: string) => ['FT', 'AET', 'PEN'].includes(short);

export async function GET(req: Request) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.API_FOOTBALL_KEY;
  const teamId = process.env.API_FOOTBALL_NOVORIZONTINO_ID;

  if (!apiKey || !teamId) {
    return NextResponse.json({ error: 'Faltam variáveis de ambiente da API-Football' }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  const resp = await fetch(`${API_BASE}/fixtures?team=${teamId}&next=25`, {
    headers: { 'x-apisports-key': apiKey },
    cache: 'no-store',
  });

  if (!resp.ok) {
    return NextResponse.json({ error: `API-Football error: ${resp.status}` }, { status: 502 });
  }

  const data = await resp.json();
  const fixtures = data?.response ?? [];

  const result = {
    lidos: fixtures.length,
    inseridos: 0,
    atualizados: 0,
    adotados: 0,
    ignorados: 0,
    slugsFaltando: new Set<string>(),
  };

  for (const fx of fixtures) {
    if (fx?.league?.id !== LEAGUE_SERIE_B) {
      result.ignorados++;
      continue;
    }

    const extId = fx?.fixture?.id;
    const mandante = toSlug(fx?.teams?.home?.name ?? '');
    const visitante = toSlug(fx?.teams?.away?.name ?? '');
    const dataHora = fx?.fixture?.date;
    const local = [fx?.fixture?.venue?.name, fx?.fixture?.venue?.city].filter(Boolean).join(' — ');
    const rodada = String(fx?.league?.round?.match(/(\d+)/)?.[1] ?? '');

    const finalizado = isFinished(fx?.fixture?.status?.short ?? '');

    if (!extId || !mandante || !visitante || !dataHora) {
      result.ignorados++;
      continue;
    }

    const payload = {
      external_id: extId,
      competicao: COMPETICAO,
      rodada,
      mandante_slug: mandante,
      visitante_slug: visitante,
      data_hora: dataHora,
      local: local || null,
      ativo: !finalizado,
      placar_mandante: fx?.goals?.home ?? null,
      placar_visitante: fx?.goals?.away ?? null,
      finalizado,
    };

    // Atualiza se já existe
    const { data: existing } = await supabase
      .from('jogos')
      .select('id')
      .eq('external_id', extId)
      .maybeSingle();

    if (existing) {
      await supabase.from('jogos').update(payload).eq('id', existing.id);
      result.atualizados++;
      continue;
    }

    // Adota jogo manual
    const { data: manual } = await supabase
      .from('jogos')
      .select('id')
      .is('external_id', null)
      .eq('mandante_slug', mandante)
      .eq('visitante_slug', visitante)
      .ilike('competicao', '%série b%')
      .maybeSingle();

    if (manual) {
      await supabase.from('jogos').update(payload).eq('id', manual.id);
      result.adotados++;
      continue;
    }

    // Insere novo
    const { error } = await supabase.from('jogos').insert(payload);
    if (error) {
      result.ignorados++;
      continue;
    }

    result.inseridos++;
  }

  return NextResponse.json({
    ok: true,
    ...result,
    slugsFaltando: Array.from(result.slugsFaltando),
  });
}
