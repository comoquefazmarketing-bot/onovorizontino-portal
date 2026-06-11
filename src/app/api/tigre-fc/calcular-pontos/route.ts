// src/app/api/tigre-fc/calcular-pontos/route.ts
// Motor de pontos server-side — protegido por secret admin
// POST /api/tigre-fc/calcular-pontos

import { NextRequest, NextResponse } from 'next/server';
import { createClient }              from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // service_role: bypass RLS
);

const ADMIN_SECRET = process.env.TIGRE_FC_ADMIN_SECRET ?? 'tigre2026';

// ─── Tabela de pontos (referência canônica) ──────────────────────────────────
export const PONTOS = {
  GOL:             8,
  ASSIST:          5,
  TITULAR_60MIN:   2,
  SEM_GOL_SOFRIDO: 5,   // para DEF/GOL
  PLACAR_EXATO:    15,
  RESULTADO_CERTO: 5,
  HEROI:           10,
  RESERVA_ENTROU:  3,   // "Dedo do Treinador"
  CARTAO_AMARELO: -2,
  CARTAO_VERMELHO:-5,
} as const;

interface ScoutPayload {
  jogador_id:      number;
  gols:            number;
  assistencias:    number;
  minutos_jogados: number;
  sem_gol_sofrido: boolean;
  cartao_amarelo:  number;
  cartao_vermelho: number;
}

interface RequestBody {
  secret:       string;
  jogo_id:      number;
  gols_tigre:   number;
  gols_adv:     number;
  heroi_id:     number;         // jogador eleito herói pelo admin
  scouts:       ScoutPayload[]; // dados de cada jogador da partida
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const body: RequestBody = await req.json();

  // Auth do admin
  if (body.secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const { jogo_id, gols_tigre, gols_adv, heroi_id, scouts } = body;

  if (!jogo_id || scouts?.length === 0) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  // 1. Upsert scouts no banco
  const scoutRows = scouts.map(s => ({
    jogo_id,
    jogador_id:      s.jogador_id,
    gols:            s.gols            ?? 0,
    assistencias:    s.assistencias    ?? 0,
    minutos_jogados: s.minutos_jogados ?? 0,
    sem_gol_sofrido: s.sem_gol_sofrido ?? false,
    cartao_amarelo:  s.cartao_amarelo  ?? 0,
    cartao_vermelho: s.cartao_vermelho ?? 0,
  }));

  const { error: scoutError } = await supabase
    .from('tigre_fc_scouts_jogadores')
    .upsert(scoutRows, { onConflict: 'jogo_id,jogador_id' });

  if (scoutError) {
    return NextResponse.json({ error: 'Falha ao salvar scouts', detail: scoutError }, { status: 500 });
  }

  // 2. Calcula pontos de todos os usuários via RPC blindada
  const { data, error: calcError } = await supabase.rpc('processar_jogo_completo', {
    p_jogo_id:    jogo_id,
    p_gols_tigre: gols_tigre,
    p_gols_adv:   gols_adv,
    p_heroi_id:   heroi_id,
  });

  if (calcError) {
    return NextResponse.json({ error: 'Falha no cálculo', detail: calcError }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    scouts_salvos: scoutRows.length,
    resultado:     data,
    pontos_ref:    PONTOS,
  });
}

// ─── GET — consulta pontuação de um usuário ──────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const usuario_id = searchParams.get('usuario_id');
  const jogo_id    = searchParams.get('jogo_id');

  if (!usuario_id) {
    return NextResponse.json({ error: 'usuario_id obrigatório' }, { status: 400 });
  }

  const query = supabase
    .from('tigre_fc_pontuacoes')
    .select('*')
    .eq('usuario_id', usuario_id)
    .order('calculado_em', { ascending: false });

  if (jogo_id) query.eq('jogo_id', Number(jogo_id));
  else query.limit(10);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error }, { status: 500 });

  return NextResponse.json({ pontuacoes: data });
}
