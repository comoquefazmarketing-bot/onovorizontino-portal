// src/app/api/proximo-jogo/route.ts
// Sem cache — sempre retorna o jogo ativo mais recente do banco
// Query com JOIN em times_serie_b para escudos e nomes corretos

import { createClient } from '@/utils/supabase/server';
import { NextResponse }  from 'next/server';

export const dynamic    = 'force-dynamic'; // nunca cacheia no servidor
export const revalidate = 0;               // sem ISR

export async function GET() {
  try {
    const supabase = await createClient();

    // Busca o próximo jogo ativo ainda não finalizado
    // JOIN nos times para trazer nome + escudo corretos
    const { data, error } = await supabase
      .from('jogos')
      .select(`
        id,
        competicao,
        rodada,
        data_hora,
        local,
        transmissao,
        placar_mandante,
        placar_visitante,
        finalizado,
        ativo,
        mandante:mandante_id (
          id,
          nome,
          escudo_url,
          cor_primaria,
          sigla
        ),
        visitante:visitante_id (
          id,
          nome,
          escudo_url,
          cor_primaria,
          sigla
        )
      `)
      .eq('ativo', true)
      .eq('finalizado', false)
      .order('data_hora', { ascending: true })
      .limit(1);

    if (error) {
      console.error('[proximo-jogo] Supabase error:', error.message);
      return NextResponse.json(
        { jogos: [], error: error.message },
        {
          status: 500,
          headers: { 'Cache-Control': 'no-store' },
        }
      );
    }

    // Se não há jogo ativo, busca o próximo agendado (não finalizado)
    if (!data || data.length === 0) {
      const { data: proximo } = await supabase
        .from('jogos')
        .select(`
          id, competicao, rodada, data_hora, local, transmissao,
          placar_mandante, placar_visitante, finalizado, ativo,
          mandante:mandante_id ( id, nome, escudo_url, cor_primaria, sigla ),
          visitante:visitante_id ( id, nome, escudo_url, cor_primaria, sigla )
        `)
        .eq('finalizado', false)
        .gte('data_hora', new Date().toISOString())
        .order('data_hora', { ascending: true })
        .limit(1);

      return NextResponse.json(
        { jogos: proximo ?? [] },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    return NextResponse.json(
      { jogos: data },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );

  } catch (err) {
    console.error('[proximo-jogo] Unexpected error:', err);
    return NextResponse.json(
      { jogos: [], error: 'internal_error' },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      }
    );
  }
}
