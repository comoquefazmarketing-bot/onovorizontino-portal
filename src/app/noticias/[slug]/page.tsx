import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  // Busca a matéria diretamente na tabela do Supabase pelo slug
  const { data: noticia, error } = await supabase
    .from('postagens')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !noticia) return notFound();

  return (
    <main className="min-h-screen bg-black text-white py-12 px-6">
      <article className="max-w-4xl mx-auto">
        <header className="mb-10">
          <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-black uppercase italic">
            {noticia.categoria}
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic mt-4 leading-none">
            {noticia.titulo}
          </h1>
        </header>

        {noticia.imagem_capa && (
          <img src={noticia.imagem_capa} className="w-full rounded-2xl mb-12 border border-white/10 shadow-2xl" alt={noticia.titulo} />
        )}

        <div 
          className="prose prose-invert prose-yellow max-w-none text-gray-300 text-lg leading-relaxed article-content"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />
      </article>
    </main>
  );
}