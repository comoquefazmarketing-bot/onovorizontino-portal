import { createClient } from '@/utils/supabase/server';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('postagens')
    .select('titulo, conteudo, categoria, imagem_capa, criado_em, autor_ia')
    .eq('id', id)
    .single();

  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-black text-white pb-24 selection:bg-yellow-500 selection:text-black">

      {/* Botão Voltar */}
      <div className="fixed top-8 left-6 z-50">
        <a
          href="/"
          className="group flex items-center gap-2 bg-black/40 hover:bg-yellow-500 border border-white/20 hover:border-yellow-500 backdrop-blur-md px-4 py-2 rounded-full text-white hover:text-black text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-lg"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Voltar</span>
        </a>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-20 w-full">
        <header className="mb-12">
          <span className="bg-yellow-500 text-black font-black px-3 py-1 italic text-xs uppercase mb-4 inline-block">
            {post.categoria || 'TIGRE DO VALE'}
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter">
            {post.titulo}
          </h1>
          <div className="flex items-center gap-4 mt-6 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
            <span>{new Date(post.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <span className="w-1 h-1 bg-zinc-800 rounded-full" />
            <span>POR {post.autor_ia || 'REDAÇÃO'}</span>
          </div>
        </header>

        {post.imagem_capa && (
          <div className="w-full rounded-3xl overflow-hidden mb-12 border border-zinc-800 shadow-2xl">
            <img src={post.imagem_capa} className="w-full h-auto object-cover" alt={post.titulo} />
          </div>
        )}

        <div
          className="prose prose-invert prose-yellow max-w-none text-zinc-300 text-xl leading-relaxed prose-h2:text-yellow-500 prose-h2:italic prose-h2:uppercase prose-h2:font-black prose-img:rounded-2xl prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />

        <footer className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 animate-pulse rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Portal O Novorizontino</span>
          </div>
          <a href="/" className="group flex items-center gap-2 text-zinc-500 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors">
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Voltar para o Portal
          </a>
        </footer>
      </article>

      <Footer />
    </main>
  );
}
