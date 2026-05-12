'use client';
// src/components/videos/MainShortsSection.tsx
// Shorts do canal @ONovorizontino — busca dinâmica via RSS do YouTube

import React, { useState, useEffect } from 'react';

interface Short {
  youtube_id: string;
  titulo: string;
  thumbnail?: string;
}

function ShortCard({ id, titulo }: { id: string; titulo: string }) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

  return (
    <div
      className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-zinc-800 group hover:border-yellow-500 transition-all cursor-pointer bg-zinc-950 shadow-xl"
      onClick={() => setActive(true)}
    >
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          className="absolute inset-0 w-full h-full"
          title={titulo}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          {/* Thumbnail */}
          <img
            src={thumb}
            alt={titulo}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Escurecimento */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/60 transition-all" />

          {/* Botão play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-yellow-500/90 flex items-center justify-center shadow-[0_0_24px_rgba(245,196,0,0.5)] scale-90 group-hover:scale-100 transition-transform">
              <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Título na base */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-[10px] font-black uppercase tracking-wide leading-tight line-clamp-2 drop-shadow-md">
              {titulo}
            </p>
          </div>

          {/* Badge Shorts */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-red-600 text-[8px] font-black tracking-widest text-white">
            SHORTS
          </div>
        </>
      )}
    </div>
  );
}

// Skeleton enquanto carrega
function SkeletonCard() {
  return (
    <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-800 to-zinc-900" />
    </div>
  );
}

export default function MainShortsSection() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/shorts')
      .then(r => r.json())
      .then((data: Short[]) => {
        setShorts(Array.isArray(data) ? data.slice(0, 6) : []);
      })
      .catch(() => setShorts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-yellow-500 rounded-full" />
            <div>
              <h2 className="text-white font-black italic uppercase text-2xl md:text-3xl tracking-tighter leading-none">
                Reels do Futebol
              </h2>
              <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-1">
                Habilidades · Dribles · Bastidores
              </p>
            </div>
          </div>
          <a
            href="https://www.youtube.com/@ONovorizontino/shorts"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Ver todos →
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : shorts.length > 0
              ? shorts.map(s => <ShortCard key={s.youtube_id} id={s.youtube_id} titulo={s.titulo} />)
              : <p className="col-span-full text-center text-zinc-600 text-sm py-8">Nenhum short disponível no momento.</p>
          }
        </div>

      </div>
    </section>
  );
}
