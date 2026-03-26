import { Metadata } from 'next';
import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

// ─── METATAGS DINÂMICAS ────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: postagem } = await supabase
    .from('postagens')
    .select('titulo, categoria, imagem_capa')
    .eq('slug', slug)
    .single();

  if (!postagem) {
    return { title: 'Notícia não encontrada | Portal O Novorizontino' };
  }

  const title       = `${postagem.titulo} | O Novorizontino`;
  const description = `Confira os detalhes sobre ${postagem.titulo} na categoria ${postagem.categoria} do Tigre do Vale.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [postagem.imagem_capa || '/jorjao.jpg'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [postagem.imagem_capa || '/jorjao.jpg'],
    },
  };
}

// ─── PÁGINA DA NOTÍCIA ─────────────────────────────────────────────────────────
export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const supabase  = await createClient();

  const { data: postagem, error } = await supabase
    .from('postagens')
    .select('titulo, conteudo, categoria, imagem_capa, criado_em, autor_ia, resumo_ia')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !postagem) return notFound();

  return (
    <main className="min-h-screen bg-black text-white pb-24 selection:bg-yellow-500 selection:text-black">
      <article className="max-w-4xl mx-auto px-4 mt-20">

        {/* ── HEADER ─────────────────────────────────────────────────────────── */}
        <header className="mb-16">
          <div className="flex flex-col gap-6">

            <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-yellow-500 pl-4 block">
              {postagem.categoria || 'Tigre do Vale'}
            </span>

            <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
              {postagem.titulo}
            </h1>

            {/* Resumo IA — aparece só se preenchido */}
            {postagem.resumo_ia && (
              <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                {postagem.resumo_ia}
              </p>
            )}

            <div className="flex items-center gap-4 mt-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              {/* ✅ coluna correta: criado_em (não created_at) */}
              <span>
                {new Date(postagem.criado_em).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span>POR {postagem.autor_ia || 'REDAÇÃO'}</span>
            </div>

          </div>
        </header>

        {/* ── CONTEÚDO HTML DO BANCO ─────────────────────────────────────────── */}
        {/*
          O HTML já vem COMPLETO no campo `conteudo`:
          inclui imagem de capa, ficha técnica e análise embutidas.
          Não precisamos de seções separadas.
        */}
        <div
          className="
            prose prose-neutral prose-invert prose-yellow max-w-none
            text-zinc-300 text-xl leading-relaxed
            prose-h2:text-yellow-500 prose-h2:italic prose-h2:uppercase
            prose-h2:font-black prose-h2:text-3xl prose-h2:mt-10
            prose-img:rounded-2xl prose-img:shadow-2xl
            prose-strong:text-white
            prose-table:text-sm prose-th:text-yellow-500
            prose-li:text-zinc-300
            prose-blockquote:border-yellow-500 prose-blockquote:text-zinc-400
          "
          dangerouslySetInnerHTML={{ __html: postagem.conteudo }}
        />

        {/* ── RODAPÉ DO ARTIGO ──────────────────────────────────────────────── */}
        <footer className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 animate-pulse rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Portal O Novorizontino
            </span>
          </div>
          <a
            href="/noticias"
            className="text-zinc-500 hover:text-yellow-500 text-[10px] font-black uppercase transition-colors"
          >
            Voltar para o Radar →
          </a>
        </footer>

      </article>
    </main>
  );
}
