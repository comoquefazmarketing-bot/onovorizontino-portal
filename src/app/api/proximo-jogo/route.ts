// src/app/api/proximo-jogo/route.ts
// Busca o próximo jogo ativo com escudos vindos de times_serie_b
// JOIN por mandante_id/visitante_id — com fallback por slug se ids forem null

import { createClient } from '@/utils/supabase/server';
import { NextResponse }  from 'next/server';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = await createClient();

    // ── Tenta buscar jogo com ativo = true ──────────────────
    let { data, error } = await supabase
      .from('jogos')
      .select(`
        id, competicao, rodada, data_hora, local, transmissao,
        placar_mandante, placar_visitante, finalizado, ativo,
        mandante_slug, visitante_slug,
        mandante:mandante_id ( id, nome, escudo_url, cor_primaria, sigla ),
        visitante:visitante_id ( id, nome, escudo_url, cor_primaria, sigla )
      `)
      .eq('ativo', true)
      .eq('finalizado', false)
      .order('data_hora', { ascending: true })
      .limit(1);

    // ── Fallback: próximo não finalizado por data ───────────
    if (!error && (!data || data.length === 0)) {
      ({ data, error } = await supabase
        .from('jogos')
        .select(`
          id, competicao, rodada, data_hora, local, transmissao,
          placar_mandante, placar_visitante, finalizado, ativo,
          mandante_slug, visitante_slug,
          mandante:mandante_id ( id, nome, escudo_url, cor_primaria, sigla ),
          visitante:visitante_id ( id, nome, escudo_url, cor_primaria, sigla )
        `)
        .eq('finalizado', false)
        .gte('data_hora', new Date().toISOString())
        .order('data_hora', { ascending: true })
        .limit(1));
    }

    if (error || !data || data.length === 0) {
      return NextResponse.json(
        { jogos: [] },
        { headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // ── Se mandante_id/visitante_id eram null, busca por slug ─
    const jogo = data[0] as any;

    if (!jogo.mandante || !jogo.visitante) {
      // Busca os times pelos slugs diretamente
      const slugs = [jogo.mandante_slug, jogo.visitante_slug].filter(Boolean);
      const { data: times } = await supabase
        .from('times_serie_b')
        .select('id, nome, escudo_url, cor_primaria, sigla, slug')
        .in('slug', slugs);

      if (times) {
        const bySlug = Object.fromEntries(times.map(t => [t.slug, t]));
        if (!jogo.mandante)  jogo.mandante  = bySlug[jogo.mandante_slug]  ?? null;
        if (!jogo.visitante) jogo.visitante = bySlug[jogo.visitante_slug] ?? null;

        // Atualiza os ids no banco para corrigir de vez (fire and forget)
        if (jogo.mandante?.id || jogo.visitante?.id) {
          supabase
            .from('jogos')
            .update({
              mandante_id:  jogo.mandante?.id  ?? null,
              visitante_id: jogo.visitante?.id ?? null,
            })
            .eq('id', jogo.id)
            .then(() => {});
        }
      }
    }

    return NextResponse.json(
      { jogos: [jogo] },
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
