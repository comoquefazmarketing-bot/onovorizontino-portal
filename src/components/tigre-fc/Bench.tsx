'use client';

import React from 'react';

interface BenchProps {
  players: any[];
  setBench: (val: any[]) => void;
}

export default function Bench({ players, setBench }: BenchProps) {
  return (
    <div className="w-full bg-zinc-900/50 p-4 border-t border-white/5">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3">
        Banco de Reservas
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {players.map((p, i) => (
          <div 
            key={i} 
            className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex-shrink-0 flex items-center justify-center"
          >
            {p ? <img src={p.foto} alt={p.short} className="rounded-full" /> : <span className="text-zinc-700">+</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
