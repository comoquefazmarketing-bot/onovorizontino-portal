'use client';
// src/components/videos/MainShortsSection.tsx
// Shorts neutros — futebol, habilidades, bastidores, jogadas
// Não identifica times adversários nem conteúdo patrocinado
// Atualizar os IDs sempre que quiser trocar os vídeos

import React, { useState } from 'react';

// ── IDs de Shorts neutros ────────────────────────────────────
// Critério: futebol em geral, dribles, habilidades, bastidores
// SEM: jogos de rivais, gols contra o Tigre, conteúdo sensível
const SHORTS: { id: string; label: string }[] = [
  { id: 'M7lc1UVf-VE', label: '⚡ Habilidades'  },
  { id: 'gHHKNaGFE5k', label: '🎯 Finalização'  },
  { id: 'fhN_YJGiEJY', label: '🔥 Dribles'      },
  { id: 'HEfkLMB3mEA', label: '🏃 Velocidade'   },
  { id: 'dBFkmRFGmKY', label: '🧤 Goleiro'       },
];

function ShortCard({ id, label }: { id: string; label: string }) {
  const [active, setActive] = useState(false);
  const thumb = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;

  return (
    <div
      className="relative aspect-[9/16] rounded-xl overflow-hidden border border-zinc-800 group hover:border-yellow-500 transition-all cursor-pointer"
      onClick={() => setActive(true)}
    >
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1`}
          className="absolute inset-0 w-full h-full"
          title={label}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={thumb}
            alt={label}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay + play */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg scale-90 group-hover:scale-100 transition-transform">
              <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {/* Label */}
          <div className="absolute bottom-3 left-3 pointer-events-none">
            <span className="text-yellow-500 text-[8px] font-black uppercase tracking-widest">
              {label}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function MainShortsSection() {
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
            href="https://www.youtube.com/shorts/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            Ver mais →
          </a>
        </div>

        {/* Grid de shorts */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
          {SHORTS.map(s => (
            <ShortCard key={s.id} id={s.id} label={s.label} />
          ))}
        </div>

      </div>
    </section>
  );
}
