// src/app/api/proximo-jogo/route.ts
import { createClient } from '@/utils/supabase/server';
import { NextResponse }  from 'next/server';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();

    // ── 1. Busca o jogo — sem joins, sem colunas opcionais ──
    // Usa só colunas garantidas pelo schema original
    let { data: jogos, error } = await supabase
      .from('jogos')
      .select('id, competicao, rodada, data_hora, local, ativo, finalizado, mandante_slug, visitante_slug, mandante_id, visitante_id, placar_mandante, placar_visitante')
      .eq('ativo', true)
      .eq('finalizado', false)
      .order('data_hora', { ascending: true })
      .limit(1);

    // fallback: próximo por data
    if (!error && (!jogos || jogos.length === 0)) {
      ({ data: jogos, error } = await supabase
        .from('jogos')
        .select('id, competicao, rodada, data_hora, local, ativo, finalizado, mandante_slug, visitante_slug, mandante_id, visitante_id, placar_mandante, placar_visitante')
        .eq('finalizado', false)
        .gte('data_hora', new Date().toISOString())
        .order('data_hora', { ascending: true })
        .limit(1));
    }

    if (error) {
      console.error('[proximo-jogo] query error:', error);
      return NextResponse.json({ jogos: [], error: error.message }, {
        status: 500, headers: { 'Cache-Control': 'no-store' }
      });
    }

    if (!jogos || jogos.length === 0) {
      return NextResponse.json({ jogos: [] }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const jogo = jogos[0];

    // ── 2. Busca os times pelos slugs — query separada e simples ──
    const slugs = [jogo.mandante_slug, jogo.visitante_slug].filter(Boolean);
    const { data: times, error: timesError } = await supabase
      .from('times_serie_b')
      .select('id, nome, escudo_url, cor_primaria, sigla, slug')
      .in('slug', slugs);

    if (timesError) console.error('[proximo-jogo] times error:', timesError);

    const bySlug: Record<string, any> = {};
    (times ?? []).forEach(t => { bySlug[t.slug] = t; });

    // ── 3. Monta o objeto final ───────────────────────────────
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
    console.error('[proximo-jogo] unexpected:', err);
    return NextResponse.json({ jogos: [], error: 'internal_error' }, {
      status: 500, headers: { 'Cache-Control': 'no-store' }
    });
  }
}
