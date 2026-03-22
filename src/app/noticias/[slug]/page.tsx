import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  // Busca a matéria específica no seu banco pelo slug
  const { data: noticia, error } = await supabase
    .from('postagens')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !noticia) return notFound();

  return (
    <main className="min-h-screen bg-black text-white pt-6 pb-20 px-4 md:px-0">
      <article className="max-w-4xl mx-auto">
        {/* Cabeçalho da Matéria */}
        <header className="mb-10">
          <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-black uppercase italic mb-4 inline-block">
            {noticia.categoria}
          </span>
          <h1 className="text-4xl md:text-7xl font-black uppercase italic leading-[0.9] tracking-tighter">
            {noticia.titulo}
          </h1>
        </header>

        {/* Conteúdo HTML vindo direto do Supabase */}
        <div 
          className="prose prose-invert prose-yellow max-w-none text-gray-200 text-xl leading-relaxed article-content"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />
        
        <footer className="mt-16 pt-8 border-t border-white/10 text-gray-500 text-sm italic">
          Autor: {noticia.autor_ia || 'Portal O Novorizontino'} • Publicado em: {new Date(noticia.criado_em).toLocaleDateString('pt-BR')}
        </footer>
      </article>
    </main>
  );
}