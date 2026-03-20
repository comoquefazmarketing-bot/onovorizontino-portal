'use client';
import { useEffect, useState } from 'react';

export default function ShortsSection() {
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    // Busca os vídeos dinâmicos da sua API
    fetch('/api/shorts')
      .then(res => res.json())
      .then(data => setShorts(data))
      .catch(() => {
        // Fallback caso o banco esteja vazio
        setShorts([
          { youtube_id: "dQw4w9WgXcQ", titulo: "Carregando...", views: "0" }
        ]);
      });
  }, []);

  return (
    <section className="py-12 bg-zinc-950 rounded-3xl border border-yellow-500/10 px-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-yellow-500 rounded-full animate-pulse" />
          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">
            Tigre Shorts <span className="text-yellow-500 text-sm ml-2">● DINÂMICO</span>
          </h2>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar snap-x">
        {shorts.map((short: any) => (
          <div key={short.youtube_id} className="min-w-[180px] md:min-w-[240px] aspect-[9/16] relative rounded-2xl overflow-hidden group snap-start bg-zinc-900 shadow-xl border border-white/5">
            {/* Embed do Shorts (Player Real) */}
            <iframe
              className="absolute inset-0 w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all"
              src={`https://www.youtube.com/embed/${short.youtube_id}?controls=0&modestbranding=1&rel=0`}
              title={short.titulo}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            
            {/* Overlay para Nome (Aparece no topo) */}
            <div className="absolute top-0 left-0 p-4 w-full bg-gradient-to-b from-black/80 to-transparent">
              <p className="text-white font-black text-[10px] uppercase italic leading-tight">
                {short.titulo}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
