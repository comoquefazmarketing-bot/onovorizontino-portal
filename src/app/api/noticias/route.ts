import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('noticias')
      .select('*')
      .order('created_at', { ascending: false }) // Verifique se sua coluna chama 'created_at' ou 'criado_em'
      .limit(10);

    if (error) {
      console.error('Erro Supabase:', error);
      return NextResponse.json([]); // Retorna lista vazia em vez de erro 500
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json([]); 
  }
}
