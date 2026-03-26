import { Metadata } from 'next';

// Função para gerar as metatags automaticamente para cada notícia
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: noticia } = await supabase
    .from('noticias')
    .select('titulo, categoria, imagem_capa')
    .eq('slug', slug)
    .single();

  if (!noticia) {
    return { title: 'Notícia não encontrada | Portal O Novorizontino' };
  }

  const title = `${noticia.titulo} | O Novorizontino`;
  const description = `Confira os detalhes sobre ${noticia.titulo} na categoria ${noticia.categoria} do Tigre do Vale.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [noticia.imagem_capa || '/jorjao.jpg'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [noticia.imagem_capa || '/jorjao.jpg'],
    },
  };
}

// Seu componente NoticiaPage continua abaixo...
import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';

// No Next.js 15, o params deve ser tipado como Promise
export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Ajustado para a tabela 'noticias' que validamos no SQL
  const { data: noticia, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !noticia) return notFound();

  return (
    <main className="min-h-screen bg-black text-white pb-24 selection:bg-yellow-500 selection:text-black">
      <article className="max-w-4xl mx-auto px-4 mt-20">
        
        {/* HEADER DA NOTÍCIA */}
        <header className="mb-16">
          <div className="flex flex-col gap-6">
            <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-yellow-500 pl-4 block">
              {noticia.categoria || 'Tigre do Vale'}
            </span>
            
            <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
              {noticia.titulo}
            </h1>

            <div className="flex items-center gap-4 mt-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
               <span>{new Date(noticia.created_at).toLocaleDateString("pt-BR")}</span>
               <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
               <span>POR {noticia.autor_ia || 'FELIPE MAKARIOS'}</span>
            </div>
          </div>
        </header>

        {/* RENDERIZAÇÃO DO CONTEÚDO HTML */}
        <div 
          className="prose prose-neutral prose-invert prose-yellow max-w-none 
          text-zinc-300 text-xl leading-relaxed article-render
          prose-h2:text-yellow-500 prose-h2:italic prose-h2:uppercase prose-h2:font-black prose-h2:text-3xl
          prose-img:rounded-2xl prose-img:shadow-2xl
          prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        {/* RODAPÉ DO ARTIGO */}
        <footer className="mt-20 pt-10 border-t border-zinc-900 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 animate-pulse rounded-full"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Portal O Novorizontino
              </span>
           </div>
           <a href="/noticias" className="text-zinc-500 hover:text-yellow-500 text-[10px] font-black uppercase transition-colors">
              Voltar para o Radar →
           </a>
        </footer>
      </article>
    </main>
  );
}
