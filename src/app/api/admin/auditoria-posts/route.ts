import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const LIMITE_CHARS = 300;

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const adminSecret = process.env.TIGRE_FC_ADMIN_SECRET || process.env.ADMIN_SECRET;
  if (!secret || secret !== adminSecret) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
  }

  // Busca todos os posts publicados com conteúdo e imagem
  const { data, error } = await supabase
    .from('postagens')
    .select('id, titulo, slug, conteudo, imagem_capa, criado_em, status')
    .order('criado_em', { ascending: false });

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 });
  }

  const posts = data || [];

  const rasos = posts.filter((p) => {
    const chars = (p.conteudo ?? '').replace(/<[^>]*>/g, '').trim().length;
    const semImagem = !p.imagem_capa || p.imagem_capa.trim() === '';
    return chars < LIMITE_CHARS || semImagem;
  });

  const resultado = rasos.map((p) => ({
    id: p.id,
    titulo: p.titulo,
    slug: p.slug,
    status: p.status,
    criado_em: p.criado_em,
    chars: (p.conteudo ?? '').replace(/<[^>]*>/g, '').trim().length,
    tem_imagem: !!(p.imagem_capa && p.imagem_capa.trim() !== ''),
    motivo: [
      (p.conteudo ?? '').replace(/<[^>]*>/g, '').trim().length < LIMITE_CHARS && `conteúdo < ${LIMITE_CHARS} chars`,
      (!p.imagem_capa || p.imagem_capa.trim() === '') && 'sem imagem',
    ].filter(Boolean).join(' + '),
  }));

  return NextResponse.json({
    total_posts: posts.length,
    total_rasos: rasos.length,
    limite_chars: LIMITE_CHARS,
    posts_rasos: resultado,
  });
}
