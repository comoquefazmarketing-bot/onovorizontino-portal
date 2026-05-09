import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/tigre-fc/listar-jogadores
// Lista os arquivos reais na pasta JOGADORES/ do Supabase Storage.
// Útil para diagnosticar nomes divergentes entre o código e o bucket.
export async function GET() {
  const { data, error } = await supabase.storage
    .from('imagens-portal')
    .list('JOGADORES', { limit: 200, sortBy: { column: 'name', order: 'asc' } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const files = (data ?? []).map(f => f.name).sort();
  return NextResponse.json({ total: files.length, files });
}
