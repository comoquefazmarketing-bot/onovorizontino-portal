import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const { data: noticia, error } = await supabase
    .from('postagens')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !noticia) return notFound();

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <article className="max-w-4xl mx-auto px-4 mt-12">
        <header className="mb-12">
          <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-yellow-500 pl-4 block mb-6">
            {noticia.categoria}
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter">
            {noticia.titulo}
          </h1>
        </header>

        {/* Aqui entra o HTML do Supabase com fotos, h2 e parágrafos */}
        <div 
          className="prose prose-neutral prose-invert prose-yellow max-w-none text-gray-200 text-xl leading-relaxed article-render"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />
      </article>
    </main>
  );
}