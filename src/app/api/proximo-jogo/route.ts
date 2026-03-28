import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const agora = new Date().toISOString();

  // Busca os próximos jogos sem FK join
  const { data: jogos, error } = await supabase
    .from('jogos')
    .select('id, competicao, rodada, data_hora, local, mandante_slug, visitante_slug')
    .eq('ativo', true)
    .or('mandante_slug.eq.novorizontino,visitante_slug.eq.novorizontino')
    .gte('data_hora', agora)
    .order('data_hora', { ascending: true })
    .limit(3);

  if (error || !jogos || jogos.length === 0) {
    return NextResponse.json({ jogos: [] });
  }

  // Busca todos os slugs únicos de uma vez
  const slugs = [...new Set(jogos.flatMap(j => [j.mandante_slug, j.visitante_slug]))];
  const { data: times } = await supabase
    .from('times_serie_b')
    .select('slug, nome, escudo_url')
    .in('slug', slugs);

  const timesMap = Object.fromEntries((times || []).map(t => [t.slug, t]));

  // Monta o resultado com os dados dos times
  const result = jogos.map(j => ({
    id: j.id,
    competicao: j.competicao,
    rodada: j.rodada,
    data_hora: j.data_hora,
    local: j.local,
    mandante: timesMap[j.mandante_slug] || { nome: j.mandante_slug, escudo_url: '' },
    visitante: timesMap[j.visitante_slug] || { nome: j.visitante_slug, escudo_url: '' },
  }));

  return NextResponse.json({ jogos: result });
}
