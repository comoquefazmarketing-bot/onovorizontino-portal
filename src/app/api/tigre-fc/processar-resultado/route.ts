// src/app/api/tigre-fc/processar-resultado/route.ts
//
// GET  → preview do resultado Sofascore (preview apenas, sem persistir)
// POST → processa resultado, salva scouts, chama RPC de pontuação
//
// Protegido por x-admin-secret (admin manual) ou CRON_SECRET (cron automático)

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // service_role: bypass RLS
);

const NOVO_TEAM_ID = 36745;
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Referer': 'https://www.sofascore.com/',
  'Cache-Control': 'no-cache',
};

const PLAYER_MAP: Record<string, number> = {
  'César Augusto': 1, 'Jordi': 2, 'João Scapin': 3, 'Lucas Ribeiro': 4,
  'Lora': 5, 'Castrillón': 6, 'Arthur Barbosa': 7, 'Mayk': 8, 'Maykon Jesus': 9,
  'Dantas': 10, 'Eduardo Brock': 11, 'Patrick': 12, 'Gabriel Bahia': 13,
  'Carlinhos': 14, 'Alemão': 15, 'Renato Palm': 16, 'Alvariño': 17, 'Bruno Santana': 18,
  'Luís Oyama': 19, 'Léo Naldi': 20, 'Rômulo': 21, 'Matheus Bianqui': 22,
  'Juninho': 23, 'Tavinho': 24, 'Diego Galo': 25, 'Marlon': 26,
  'Hector Bianchi': 27, 'Nogueira': 28, 'Luiz Gabriel': 29, 'Jhones Kauê': 30,
  'Robson': 31, 'Vinícius Paiva': 32, 'Hélio Borges': 33, 'Jardiel': 34,
  'Nicolas Careca': 35, 'Titi Ortiz': 36, 'Diego Mathias': 37,
  'Carlão': 38, 'Ronald Barcellos': 39,
};

function findPlayerId(name: string): number | null {
  if (PLAYER_MAP[name]) return PLAYER_MAP[name];
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(PLAYER_MAP)) {
    if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase().split(' ')[0].toLowerCase()))
      return v;
  }
  return null;
}

// ─── Auth dupla: admin manual ou cron ─────────────────────────────────────────
function autorizado(req: NextRequest): boolean {
  const adminSecret = process.env.TIGRE_FC_ADMIN_SECRET ?? process.env.ADMIN_SECRET ?? 'tigre2026';
  const cronSecret  = process.env.CRON_SECRET;
  const xAdmin = req.headers.get('x-admin-secret');
  const bearer  = req.headers.get('authorization')?.replace('Bearer ', '');
  if (xAdmin === adminSecret) return true;
  if (cronSecret && bearer === cronSecret) return true;
  return false;
}

// ─── GET — preview Sofascore (sem persistir) ──────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    const eventsRes = await fetch(
      `https://api.sofascore.com/api/v1/team/${NOVO_TEAM_ID}/events/last/0`,
      { headers: HEADERS, next: { revalidate: 0 } }
    );
    if (!eventsRes.ok) return NextResponse.json({ error: 'Sofascore indisponível' }, { status: 503 });

    const events = ((await eventsRes.json()).events || [])
      .filter((e: any) => e.status?.type === 'finished')
      .sort((a: any, b: any) => b.startTimestamp - a.startTimestamp);

    if (!events.length) return NextResponse.json({ error: 'Nenhum jogo finalizado' }, { status: 404 });

    const sf = events[0];
    const sfEventId = sf.id;
    const isHome = sf.homeTeam?.id === NOVO_TEAM_ID;

    const [incRes, lineupRes] = await Promise.all([
      fetch(`https://api.sofascore.com/api/v1/event/${sfEventId}/incidents`, { headers: HEADERS }),
      fetch(`https://api.sofascore.com/api/v1/event/${sfEventId}/lineups`, { headers: HEADERS }),
    ]);

    const incidents = (await incRes.json()).incidents || [];
    const lineupData = await lineupRes.json();
    const novoLineup = isHome ? lineupData.home : lineupData.away;

    const eventos: { player_id: number; tipo: string; nome: string }[] = [];
    let heroiId: number | null = null; let maxRating = 0;

    for (const inc of incidents) {
      const isNovo = isHome ? inc.isHome === true : inc.isHome === false;
      if (!isNovo) continue;
      const pid = findPlayerId(inc.player?.name || '');
      if (!pid) continue;
      if (inc.incidentType === 'goal' || inc.incidentType === 'penalty')
        eventos.push({ player_id: pid, tipo: 'gol', nome: inc.player?.name });
      if (inc.incidentType === 'card')
        eventos.push({ player_id: pid, tipo: inc.cardType === 'yellow' ? 'amarelo' : 'vermelho', nome: inc.player?.name });
    }

    for (const p of novoLineup?.players || []) {
      if (p.substitute === false) {
        const pid = findPlayerId(p.player?.name || '');
        if (pid) eventos.push({ player_id: pid, tipo: 'titular', nome: p.player?.name });
      }
      const r = p.statistics?.rating || 0;
      if (r > maxRating) { const pid = findPlayerId(p.player?.name || ''); if (pid) { maxRating = r; heroiId = pid; } }
    }

    return NextResponse.json({
      encontrado: true, sofascore_event_id: sfEventId,
      mandante: sf.homeTeam?.name, visitante: sf.awayTeam?.name,
      gols_mandante: sf.homeScore?.current ?? 0, gols_visitante: sf.awayScore?.current ?? 0,
      heroi_id: heroiId, eventos,
      data: new Date(sf.startTimestamp * 1000).toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Erro Sofascore', detalhe: err.message }, { status: 500 });
  }
}

// ─── POST — processa resultado e calcula pontuações ───────────────────────────
export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  let body: any;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Body inválido' }, { status: 400 });
  }

  const { jogo_id, gols_mandante, gols_visitante, heroi_id, eventos = [] } = body;

  if (!jogo_id) {
    return NextResponse.json({ error: 'jogo_id obrigatório' }, { status: 400 });
  }

  // ── Idempotência: checa se já foi processado ─────────────────────────────
  const { data: jaProcessado } = await supabase
    .from('tigre_fc_resultados')
    .select('id, processado')
    .eq('jogo_id', jogo_id)
    .maybeSingle();

  if (jaProcessado?.processado) {
    return NextResponse.json({
      ok: true,
      aviso: `Jogo ${jogo_id} já foi processado — ignorando reprocessamento.`,
      idempotente: true,
    });
  }

  // ── Busca jogo para saber qual time é o Novorizontino ────────────────────
  const { data: jogo, error: jogoError } = await supabase
    .from('jogos')
    .select('mandante_slug, visitante_slug, placar_mandante, placar_visitante')
    .eq('id', jogo_id)
    .single();

  if (jogoError || !jogo) {
    return NextResponse.json({ error: 'Jogo não encontrado' }, { status: 404 });
  }

  const isNovMandante = ['novorizontino', 'gremio-novorizontino'].includes(jogo.mandante_slug ?? '');
  const gm = gols_mandante ?? jogo.placar_mandante ?? 0;
  const gv = gols_visitante ?? jogo.placar_visitante ?? 0;
  const gols_tigre = isNovMandante ? gm : gv;
  const gols_adv   = isNovMandante ? gv : gm;

  // ── Converte eventos → scouts ────────────────────────────────────────────
  // Eventos aceitos: 'gol' | 'assist' | 'titular' | 'clean_sheet' | 'amarelo' | 'vermelho'
  type ScoutAccum = {
    gols: number; assistencias: number; minutos_jogados: number;
    sem_gol_sofrido: boolean; cartao_amarelo: number; cartao_vermelho: number;
  };
  const scoutsMap = new Map<number, ScoutAccum>();

  for (const e of eventos as { player_id: number; tipo: string }[]) {
    if (!e.player_id) continue;
    if (!scoutsMap.has(e.player_id)) {
      scoutsMap.set(e.player_id, {
        gols: 0, assistencias: 0, minutos_jogados: 0,
        sem_gol_sofrido: false, cartao_amarelo: 0, cartao_vermelho: 0,
      });
    }
    const s = scoutsMap.get(e.player_id)!;
    if (e.tipo === 'gol')         s.gols++;
    if (e.tipo === 'assist')      s.assistencias++;
    if (e.tipo === 'titular')     s.minutos_jogados = Math.max(s.minutos_jogados, 90);
    if (e.tipo === 'clean_sheet') s.sem_gol_sofrido = true;
    if (e.tipo === 'amarelo')     s.cartao_amarelo++;
    if (e.tipo === 'vermelho')    s.cartao_vermelho++;
  }

  // Clean sheet automático: se Novorizontino não sofreu gols, titulares ganham o bônus
  if (gols_adv === 0) {
    for (const s of scoutsMap.values()) {
      if (s.minutos_jogados >= 60) s.sem_gol_sofrido = true;
    }
  }

  const scouts = Array.from(scoutsMap.entries()).map(([jogador_id, s]) => ({
    jogo_id, jogador_id, ...s,
  }));

  // ── Upsert scouts ────────────────────────────────────────────────────────
  if (scouts.length > 0) {
    const { error: scoutErr } = await supabase
      .from('tigre_fc_scouts_jogadores')
      .upsert(scouts, { onConflict: 'jogo_id,jogador_id' });
    if (scoutErr) {
      console.error('[processar-resultado] erro scouts:', scoutErr.message);
      // Não interrompe — segue para o cálculo
    }
  }

  // ── Chama RPC de pontuação ────────────────────────────────────────────────
  const { data: rpcData, error: rpcError } = await supabase.rpc('processar_jogo_completo', {
    p_jogo_id:    jogo_id,
    p_gols_tigre: gols_tigre,
    p_gols_adv:   gols_adv,
    p_heroi_id:   heroi_id ?? null,
  });

  if (rpcError) {
    console.error('[processar-resultado] RPC error:', rpcError);
    return NextResponse.json({
      error: 'Falha no cálculo de pontos',
      detail: rpcError.message,
      hint: rpcError.hint,
    }, { status: 500 });
  }

  // ── Marca jogo como processado (idempotente) ──────────────────────────────
  await supabase.from('tigre_fc_resultados').upsert({
    jogo_id,
    gols_mandante: gm,
    gols_visitante: gv,
    processado: true,
    processado_em: new Date().toISOString(),
  }, { onConflict: 'jogo_id' });

  // ── Garante que o jogo fica marcado como finalizado ───────────────────────
  await supabase.from('jogos')
    .update({ finalizado: true, ativo: false,
              placar_mandante: gm, placar_visitante: gv })
    .eq('id', jogo_id);

  return NextResponse.json({
    ok: true,
    processados:     rpcData?.processados     ?? '?',
    badges_gerados:  rpcData?.badges_gerados  ?? 0,
    gols_tigre,
    gols_adv,
    scouts_salvos:   scouts.length,
  });
}
