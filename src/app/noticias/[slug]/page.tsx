import { Metadata } from 'next';
import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';
import FalaAiTorcedor from '@/components/portal/FalaAiTorcedor';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('postagens')
    .select('titulo, categoria, imagem_capa, resumo_ia')
    .eq('slug', slug)
    .maybeSingle(); // Usar maybeSingle evita erros de exceção se não achar

  if (!data) return { title: 'Notícia não encontrada | Portal O Novorizontino' };

  const title = `${data.titulo} | O Novorizontino`;
  const description = data.resumo_ia || `Confira os detalhes sobre ${data.titulo}`;

  return {
    title,
    description,
    openGraph: { title, description, images: [data.imagem_capa || '/jorjao.webp'], type: 'article' },
    twitter: { card: 'summary_large_image', title, description, images: [data.imagem_capa || '/jorjao.webp'] },
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Removida a restrição de 'status' momentaneamente para garantir que a notícia carregue
  const { data: postagem, error } = await supabase
    .from('postagens')
    .select('id, titulo, conteudo, categoria, imagem_capa, criado_em, autor_ia, resumo_ia, status')
    .eq('slug', slug)
    .single();

  // Se der erro ou não existir, 404
  if (error || !postagem) {
    console.error("Erro Supabase:", error);
    return notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: postagem.titulo,
    description: postagem.resumo_ia || '',
    image: postagem.imagem_capa || 'https://www.onovorizontino.com.br/jorjao.webp',
    datePublished: postagem.criado_em,
    author: { '@type': 'Person', name: postagem.autor_ia || 'Felipe Makarios' },
  };

  return (
    <main className="min-h-screen bg-black text-white pb-24 selection:bg-yellow-500 selection:text-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="fixed top-8 left-6 z-50">
        <a href="/noticias" className="group flex items-center gap-2 bg-black/40 hover:bg-yellow-500 border border-white/20 hover:border-yellow-500 backdrop-blur-md px-4 py-2 rounded-full text-white hover:text-black text-[11px] font-black uppercase tracking-widest transition-all duration-300">
          <span>← Notícias</span>
        </a>
      </div>

      <article className="max-w-4xl mx-auto px-4 mt-20">
        <header className="mb-16">
          <div className="flex flex-col gap-6">
            <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-yellow-500 pl-4 block">
              {postagem.categoria || 'Tigre do Vale'}
            </span>
            <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter">
              {postagem.titulo}
            </h1>
            {postagem.resumo_ia && <p className="text-zinc-400 text-lg leading-relaxed">{postagem.resumo_ia}</p>}
          </div>
        </header>

        {/* Conteúdo Renderizado */}
        <div
          className="prose prose-neutral prose-invert prose-yellow max-w-none text-zinc-300 text-xl leading-relaxed 
          prose-h2:text-yellow-500 prose-h2:italic prose-h2:uppercase prose-h2:font-black 
          prose-img:rounded-2xl prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: postagem.conteudo }}
        />

        <FalaAiTorcedor postagemId={postagem.id} />
      </article>
    </main>
  );
}
