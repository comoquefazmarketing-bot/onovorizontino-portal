import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from "@/utils/supabase/server";

export default async function PostagensGrid() {
  const supabase = await createClient();

  // Busca as notícias reais do seu banco de dados
  const { data: noticiasPortal, error } = await supabase
    .from('noticias')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !noticiasPortal) {
    console.error("Erro ao carregar notícias:", error);
    return null; // Ou um esqueleto de carregamento
  }

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-8 w-1 bg-yellow-500"></div>
          <h2 className="text-white font-display text-3xl tracking-tighter italic uppercase">
            Plantão do Tigre
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticiasPortal.map((noticia) => (
            <Link 
              href={`/noticia/${noticia.slug}`} 
              key={noticia.id}
              className="group bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800">
                {noticia.imagem_capa && (
                  <Image 
                    src={noticia.imagem_capa} 
                    alt={noticia.titulo}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {noticia.categoria || 'Notícia'}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-yellow-500 transition-colors line-clamp-2 uppercase italic">
                  {noticia.titulo}
                </h3>
                <div className="mt-4 flex items-center justify-between text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
                  <div className="flex flex-col">
                    <span>Portal O Novorizontino</span>
                    <span className="text-[8px] opacity-50">
                      {new Date(noticia.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform text-yellow-500/80">Ler +</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
