import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';

// No Next.js 15, params é uma Promise
export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // IMPORTANTE: Usei 'postagens' porque é onde seus dados aparecem no seu print do Supabase
  const { data: noticia, error } = await supabase
    .from('postagens') 
    .select('*')
    .eq('slug', slug)
    .single();

  // Se der erro ou não achar o slug, ele manda para a página 404
  if (error || !noticia) {
    console.error("Erro ao buscar matéria:", error);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24 selection:bg-yellow-500 selection:text-black">
      <article className="max-w-4xl mx-auto px-6 pt-20">
        
        {/* BOTÃO VOLTAR */}
        <a href="/" className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-12 block hover:opacity-70 transition-all">
          ← RADAR DO TIGRE
        </a>

        <header className="mb-16">
          <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.3em] border-l-4 border-yellow-500 pl-4 block mb-6">
            {noticia.categoria || 'DESTAQUE'}
          </span>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.85] tracking-tighter text-white">
            {noticia.titulo}
          </h1>

          <div className="flex items-center gap-4 mt-8 text-zinc-500 text-[10px] font-black uppercase tracking-widest">
             <span>{new Date(noticia.created_at).toLocaleDateString("pt-BR")}</span>
             <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
             <span>POR {noticia.autor_ia || 'FELIPE MAKARIOS'}</span>
          </div>
        </header>

        {/* CONTEÚDO HTML DO SUPABASE */}
        <div 
          className="prose prose-neutral prose-invert prose-yellow max-w-none 
          text-zinc-300 text-xl leading-relaxed article-render
          prose-h2:text-yellow-500 prose-h2:italic prose-h2:uppercase prose-h2:font-black prose-h2:text-3xl prose-h2:mt-12
          prose-strong:text-white prose-img:rounded-2xl prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        {/* ASSINATURA */}
        <footer className="mt-20 pt-10 border-t border-zinc-900 text-center">
           <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
             © 2026 Portal O Novorizontino - Questão de Honra
           </p>
        </footer>
      </article>
    </main>
  );
}
