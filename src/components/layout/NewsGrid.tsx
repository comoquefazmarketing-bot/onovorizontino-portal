import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function PostagensGrid() {
  const supabase = await createClient();

  // Busca as 6 notícias mais recentes e publicadas
  const { data: noticiasPortal, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error || !noticiasPortal) {
    console.error("Erro ao carregar notícias:", error);
    return (
      <div className="py-12 bg-black text-center text-zinc-500 italic">
        Nenhuma notícia encontrada no momento.
      </div>
    );
  }

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* HEADER DA SEÇÃO */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1.5 bg-yellow-500 rounded-full"></div>
            <h2 className="text-white font-display text-3xl md:text-4xl tracking-tighter italic uppercase font-black">
              Plantão do Tigre
            </h2>
          </div>
          <div className="hidden md:block h-[1px] flex-grow mx-8 bg-zinc-800/50"></div>
        </div>

        {/* GRID DE NOTÍCIAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {noticiasPortal.map((noticia) => (
            <Link 
              href={`/noticia/${noticia.slug}`} 
              key={noticia.id}
              className="group flex flex-col h-full bg-zinc-900/30 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition-all duration-500 shadow-lg hover:shadow-yellow-500/5"
            >
              {/* CONTAINER DA IMAGEM */}
              <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                {noticia.imagem_capa ? (
                  <Image 
                    src={noticia.imagem_capa} 
                    alt={noticia.titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <span className="text-zinc-600 italic text-xs uppercase font-black">O Novorizontino</span>
                  </div>
                )}
                
                {/* OVERLAY GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                {/* TAG DE CATEGORIA */}
                <span className="absolute top-4 left-4 bg-yellow-500 text-black text-[10px] font-black px-2.5 py-1 rounded-md uppercase italic tracking-tighter shadow-xl">
                  {noticia.categoria || 'Notícia'}
                </span>
              </div>

              {/* CONTEÚDO TEXTUAL */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-white font-black text-xl leading-[1.15] group-hover:text-yellow-500 transition-colors line-clamp-3 uppercase italic mb-6 tracking-tight">
                  {noticia.titulo}
                </h3>
                
                <div className="mt-auto pt-6 border-t border-zinc-800/50 flex items-center justify-between text-zinc-500">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Publicado em</span>
                    <span className="text-[11px] font-bold text-zinc-400">
                      {new Date(noticia.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  
                  {/* ÍCONE DE AÇÃO */}
                  <div className="w-9 h-9 rounded-xl bg-zinc-800/50 flex items-center justify-center group-hover:bg-yellow-500 transition-all duration-300">
                    <svg 
                      width="18" height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="3" 
                      className="text-zinc-400 group-hover:text-black transition-colors"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTÃO VER MAIS */}
        <div className="mt-16 text-center">
          <Link 
            href="/noticias" 
            className="group relative inline-flex items-center gap-4 px-12 py-4 bg-transparent border-2 border-zinc-800 rounded-full overflow-hidden transition-all duration-300 hover:border-yellow-500"
          >
            <span className="relative z-10 text-white font-black uppercase italic tracking-[0.15em] text-sm group-hover:text-black transition-colors duration-300">
              Ver Todas as Notícias
            </span>
            <div className="absolute inset-0 bg-yellow-500 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            <span className="relative z-10 text-yellow-500 group-hover:text-black group-hover:translate-x-1 transition-all">→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
