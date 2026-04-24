// src/app/api/escalacao/route.ts
// POST → salva escalação (valida mercado antes)
// GET  → recupera escalação do usuário (com cache)

import { NextRequest, NextResponse } from 'next/server';

const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supaHeaders = {
  'Content-Type':  'application/json',
  'apikey':        SUPA_ANON,
  'Authorization': `Bearer ${SUPA_ANON}`,
};

export const dynamic = 'force-dynamic';

// ── GET: recupera escalação do usuário ─────────────────────
// Cache de 30s no navegador — sem re-fetch desnecessário
export async function GET(req: NextRequest) {
  const googleId = req.nextUrl.searchParams.get('google_id');

  if (!googleId) {
    return NextResponse.json({ error: 'google_id obrigatório' }, { status: 400 });
  }

  const res = await fetch(
    `${SUPA_URL}/rest/v1/rpc/get_escalacao_usuario`,
    {
      method: 'POST',
      headers: supaHeaders,
      body: JSON.stringify({ p_google_id: googleId }),
      cache: 'no-store',
    }
  );

  const data = await res.json();

  if (data?.error) {
    // sem_escalacao não é erro — usuário ainda não escalou
    if (data.error === 'sem_escalacao') {
      return NextResponse.json(
        { escalacao: null },
        {
          headers: {
            // Cache de 10s no browser — evita re-fetch em cada render
            'Cache-Control': 'private, max-age=10',
          }
        }
      );
    }
    return NextResponse.json({ error: data.error }, { status: 400 });
  }

  return NextResponse.json(
    { escalacao: data },
    {
      headers: {
        // Cache de 30s — escalação muda pouco durante o dia
        'Cache-Control': 'private, max-age=30',
      }
    }
  );
}

// ── POST: salva/atualiza escalação ─────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { google_id, formacao, lineup, capitao_id, heroi_id,
            palpite_tigre, palpite_adv, bench } = body;

    // Validações básicas
    if (!google_id || !formacao || !lineup) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: google_id, formacao, lineup' },
        { status: 400 }
      );
    }

    // ── STEP 1: verifica mercado no banco ──────────────────
    // A fn_mercado_aberto já é chamada dentro da upsert_escalacao
    // mas verificamos antes para dar feedback imediato sem gastar writes

    const jogoRes = await fetch(
      `${SUPA_URL}/rest/v1/jogos?ativo=eq.true&finalizado=eq.false&select=id,data_hora&order=data_hora.asc&limit=1`,
      { headers: supaHeaders, cache: 'no-store' }
    );
    const jogos = await jogoRes.json();
    const jogo  = jogos?.[0];

    if (!jogo) {
      return NextResponse.json(
        { error: 'Nenhum jogo ativo', mercado: 'fechado' },
        { status: 422 }
      );
    }

    // Valida janela — 90 min antes do jogo
    const fechamento = new Date(jogo.data_hora).getTime() - 90 * 60_000;
    if (Date.now() >= fechamento) {
      return NextResponse.json(
        {
          error:    'mercado_fechado',
          message:  'O mercado fechou 90 minutos antes do jogo. Sua escalação está salva.',
          mercado:  'fechado',
          fechou_em: new Date(fechamento).toISOString(),
        },
        {
          status: 422,
          headers: { 'Cache-Control': 'no-store' }
        }
      );
    }

    // ── STEP 2: persiste via RPC (tem lock também no banco) ─
    const upsertRes = await fetch(
      `${SUPA_URL}/rest/v1/rpc/upsert_escalacao`,
      {
        method:  'POST',
        headers: supaHeaders,
        body: JSON.stringify({
          p_google_id:     google_id,
          p_formacao:      formacao,
          p_lineup:        lineup,
          p_capitao_id:    capitao_id  ?? null,
          p_heroi_id:      heroi_id    ?? null,
          p_palpite_tigre: palpite_tigre ?? 1,
          p_palpite_adv:   palpite_adv   ?? 0,
          p_bench:         bench ?? {},
        }),
        cache: 'no-store',
      }
    );

    const result = await upsertRes.json();

    if (result?.error) {
      const status = result.error === 'mercado_fechado' ? 422 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(
      { ok: true, jogo_id: result?.jogo_id, mercado: 'aberto' },
      { headers: { 'Cache-Control': 'no-store' } }
    );

  } catch (err) {
    console.error('[/api/escalacao POST]', err);
    return NextResponse.json(
      { error: 'Erro interno' },
      { status: 500 }
    );
  }
}
