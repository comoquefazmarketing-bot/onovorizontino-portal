'use client';
import React, { useState } from 'react';

const vids = [
  '0HZIdQTE8mI',
  'cp-3Q09-XuE',
  'y67NY0bJ-Yk',
  'VSAo_acIKRQ',
  'KGmiSUJhoAU',
];

function ShortCard({ id }: { id: string }) {
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
          title="Tigre TV Short"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={thumb}
            alt="Tigre TV"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}
      <div className="absolute bottom-3 left-3 pointer-events-none">
        <p className="text-yellow-500 text-[8px] font-bold uppercase tracking-widest">Tigre TV</p>
      </div>
    </div>
  );
}

export default function MainShortsSection() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-1.5 h-8 bg-yellow-500" />
          <h2 className="text-white font-black italic uppercase text-3xl tracking-tighter">Shorts do Tigre</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {vids.map((id) => (
            <ShortCard key={id} id={id} />
          ))}
        </div>
      </div>
    </section>
  );
}
