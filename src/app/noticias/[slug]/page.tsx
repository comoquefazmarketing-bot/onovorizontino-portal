import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  // Puxa tudo da sua tabela 'postagens' pelo slug
  const { data: noticia, error } = await supabase
    .from('postagens')
    .select('*')
    .eq('slug', params.slug)
    .single();

  if (error || !noticia) return notFound();

  return (
    <main className="min-h-screen bg-black text-white pt-10 pb-20 px-4">
      <article className="max-w-4xl mx-auto">
        <header className="mb-12">
          <span className="text-yellow-500 font-black text-xs uppercase tracking-widest border-b-2 border-yellow-500 pb-1">
            {noticia.categoria}
          </span>
          <h1 className="text-4xl md:text-7xl font-black uppercase italic mt-6 leading-[0.9] tracking-tighter">
            {noticia.titulo}
          </h1>
        </header>

        {noticia.imagem_capa && (
          <div className="mb-12 rounded-2xl overflow-hidden border border-white/10">
            <img src={noticia.imagem_capa} className="w-full h-auto object-cover" alt={noticia.titulo} />
          </div>
        )}

        <div 
          className="prose prose-invert prose-yellow max-w-none text-gray-300 text-xl leading-relaxed"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />
      </article>
    </main>
  );
}