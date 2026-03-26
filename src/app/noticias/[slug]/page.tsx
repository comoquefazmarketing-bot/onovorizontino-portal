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
    .from('postagens')           // ✅ tabela correta
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
    .from('postagens')           // ✅ tabela correta
    .select('*')
    .eq('slug', slug)
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

            <div className="flex items-center gap-4 mt-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
              <span>{new Date(postagem.created_at).toLocaleDateString('pt-BR')}</span>
              <span className="w-1 h-1 bg-zinc-800 rounded-full" />
              <span>POR {postagem.autor_ia || 'FELIPE MAKARIOS'}</span>
            </div>

          </div>
        </header>

        {/* ── IMAGEM DE CAPA (se existir) ────────────────────────────────────── */}
        {postagem.imagem_capa && (
          <div className="mb-16 -mx-4 md:mx-0">
            <img
              src={postagem.imagem_capa}
              alt={postagem.titulo}
              className="w-full rounded-2xl object-cover max-h-[520px] shadow-2xl"
            />
          </div>
        )}

        {/* ── CONTEÚDO HTML PRINCIPAL ────────────────────────────────────────── */}
        <div
          className="
            prose prose-neutral prose-invert prose-yellow max-w-none
            text-zinc-300 text-xl leading-relaxed article-render
            prose-h2:text-yellow-500 prose-h2:italic prose-h2:uppercase
            prose-h2:font-black prose-h2:text-3xl
            prose-img:rounded-2xl prose-img:shadow-2xl
            prose-strong:text-white
          "
          dangerouslySetInnerHTML={{ __html: postagem.conteudo }}
        />

        {/* ── FICHA TÉCNICA (campo separado, se existir) ────────────────────── */}
        {postagem.ficha_tecnica && (
          <section className="mt-16 border border-zinc-800 rounded-2xl p-8 bg-zinc-950">
            <h2 className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-yellow-500 pl-4 mb-6">
              Ficha Técnica
            </h2>
            <div
              className="prose prose-invert prose-sm max-w-none text-zinc-400"
              dangerouslySetInnerHTML={{ __html: postagem.ficha_tecnica }}
            />
          </section>
        )}

        {/* ── ANÁLISE (campo separado, se existir) ─────────────────────────── */}
        {postagem.analise && (
          <section className="mt-8 border border-yellow-500/20 rounded-2xl p-8 bg-yellow-500/5">
            <h2 className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-yellow-500 pl-4 mb-6">
              Análise
            </h2>
            <div
              className="prose prose-invert prose-sm max-w-none text-zinc-300"
              dangerouslySetInnerHTML={{ __html: postagem.analise }}
            />
          </section>
        )}

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
