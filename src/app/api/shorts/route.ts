import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('shorts')
      .select('*')
      .eq('ativo', true)
      .order('created_at', { ascending: false })
      .limit(6);

    // Lista dos vídeos que o Felipe enviou (IDs reais)
    const videosFelipe = [
      { youtube_id: "2ds_0uOHlu0", titulo: "Hino e Torcida no Jorjão" },
      { youtube_id: "PLCfkciq3TE", titulo: "Grito de Guerra Tigre" },
      { youtube_id: "yP-BeKxW4wY", titulo: "Bastidores do Acesso" },
      { youtube_id: "j983i0Sww2Y", titulo: "Gol da Vitória" },
      { youtube_id: "y67NY0bJ-Yk", titulo: "Preparação Intensiva" }
    ];

    if (error || !data || data.length === 0) {
      return NextResponse.json(videosFelipe);
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json([]);
  }
}
