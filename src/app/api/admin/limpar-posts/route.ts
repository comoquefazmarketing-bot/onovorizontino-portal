import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const LIMITE_CHARS = 300;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));

  if (!body.secret || body.secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ erro: 'Não autorizado' }, { status: 401 });
  }

  // 1. Busca todos os candidatos à remoção
  const { data, error: fetchErr } = await supabase
    .from('postagens')
    .select('id, titulo, slug, conteudo, imagem_capa, criado_em')
    .order('criado_em', { ascending: false });

  if (fetchErr) {
    return NextResponse.json({ erro: fetchErr.message }, { status: 500 });
  }

  const posts = data || [];

  // Identifica rasos: pouco conteúdo OU sem imagem de capa
  const rasos = posts.filter((p) => {
    const chars = (p.conteudo ?? '').replace(/<[^>]*>/g, '').trim().length;
    const semImagem = !p.imagem_capa || p.imagem_capa.trim() === '';
    return chars < LIMITE_CHARS || semImagem;
  });

  if (rasos.length === 0) {
    return NextResponse.json({ mensagem: 'Nenhum post raso encontrado. Nada removido.' });
  }

  // 2. Dry run: apenas lista, não deleta
  if (!body.confirmar) {
    return NextResponse.json({
      modo: 'dry-run',
      total_rasos: rasos.length,
      posts: rasos.map((p) => ({
        id: p.id,
        slug: p.slug,
        titulo: p.titulo,
        chars: (p.conteudo ?? '').replace(/<[^>]*>/g, '').trim().length,
        tem_imagem: !!(p.imagem_capa && p.imagem_capa.trim() !== ''),
      })),
    });
  }

  // 3. Hard delete
  const ids = rasos.map((p) => p.id);
  const slugs = rasos.map((p) => p.slug);

  const { error: deleteErr } = await supabase
    .from('postagens')
    .delete()
    .in('id', ids);

  if (deleteErr) {
    return NextResponse.json({ erro: deleteErr.message }, { status: 500 });
  }

  // 4. Registra slugs removidos para retornar 410 Gone
  if (slugs.length > 0) {
    await supabase
      .from('slugs_removidos')
      .upsert(slugs.map((slug) => ({ slug, removido_em: new Date().toISOString() })))
      .throwOnError()
      .catch(() => {
        // Tabela pode não existir ainda — ignorar, não crítico
      });
  }

  return NextResponse.json({
    sucesso: true,
    deletados: ids.length,
    slugs_removidos: slugs,
  });
}
