import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('postagens')
      .select('id, titulo, slug, categoria, imagem_capa, criado_em, autor_ia')
      .eq('status', 'published')
      .order('criado_em', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json([]);
  }
}
