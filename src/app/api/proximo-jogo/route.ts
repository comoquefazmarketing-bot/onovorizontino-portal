// src/app/api/proximo-jogo/route.ts
// Usa fetch direto à REST API do Supabase com a anon key
// Evita problemas com createClient server que precisa de cookies

import { NextResponse } from 'next/server';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  'apikey':        SUPABASE_ANON,
  'Authorization': `Bearer ${SUPABASE_ANON}`,
  'Accept':        'application/json',
};

export async function GET() {
  try {
    // ── 1. Busca jogo ativo ───────────────────────────────────
    const jogoUrl = `${SUPABASE_URL}/rest/v1/jogos?select=id,competicao,rodada,data_hora,local,ativo,finalizado,mandante_slug,visitante_slug,mandante_id,visitante_id,placar_mandante,placar_visitante&ativo=eq.true&finalizado=eq.false&order=data_hora.asc&limit=1`;

    let res = await fetch(jogoUrl, { headers, cache: 'no-store' });
    let jogos: any[] = await res.json();

    // fallback: próximo por data
    if (!jogos || jogos.length === 0) {
      const now = new Date().toISOString();
      const fallbackUrl = `${SUPABASE_URL}/rest/v1/jogos?select=id,competicao,rodada,data_hora,local,ativo,finalizado,mandante_slug,visitante_slug,mandante_id,visitante_id,placar_mandante,placar_visitante&finalizado=eq.false&data_hora=gte.${encodeURIComponent(now)}&order=data_hora.asc&limit=1`;
      res = await fetch(fallbackUrl, { headers, cache: 'no-store' });
      jogos = await res.json();
    }

    if (!jogos || jogos.length === 0) {
      return NextResponse.json(
        { jogos: [] },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const jogo = jogos[0];

    // ── 2. Busca os dois times pelos slugs ────────────────────
    const slugs = [jogo.mandante_slug, jogo.visitante_slug]
      .filter(Boolean)
      .map(s => `"${s}"`)
      .join(',');

    const timesUrl = `${SUPABASE_URL}/rest/v1/times_serie_b?select=id,nome,escudo_url,cor_primaria,sigla,slug&slug=in.(${slugs})`;
    const timesRes = await fetch(timesUrl, { headers, cache: 'no-store' });
    const times: any[] = await timesRes.json();

    const bySlug: Record<string, any> = {};
    (times ?? []).forEach(t => { bySlug[t.slug] = t; });

    // ── 3. Monta resposta ─────────────────────────────────────
    const result = {
      ...jogo,
      mandante:  bySlug[jogo.mandante_slug]  ?? { nome: jogo.mandante_slug,  escudo_url: null },
      visitante: bySlug[jogo.visitante_slug] ?? { nome: jogo.visitante_slug, escudo_url: null },
    };

    return NextResponse.json(
      { jogos: [result] },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );

  } catch (err) {
    console.error('[proximo-jogo]', err);
    return NextResponse.json(
      { jogos: [], error: 'internal_error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
