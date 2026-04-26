'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function CapitaoEHeroi() {
  
  useEffect(() => {
    const t = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F5C400', '#00F3FF', '#ffffff'],
      });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-black/40 rounded-[32px] border border-white/5 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-6 w-full">
        
        {/* CAPITÃO - DANTAS (O maior pontuador com x2) */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-28 h-36 rounded-2xl overflow-hidden border-2 border-yellow-500 shadow-[0_0_20px_rgba(245,196,0,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
            <img 
              src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/DANTAS%20FUNDO%20TRANSPARENTE.png" 
              className="w-full h-full object-cover relative z-0" 
              alt="Dantas" 
            />
            <div className="absolute bottom-2 left-0 right-0 z-20 flex flex-col items-center">
              <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded-full mb-1">
                © CAPITÃO
              </span>
              <span className="text-white text-[12px] font-black italic">14.2 PTS</span>
            </div>
          </div>
          <span className="text-[11px] font-black italic uppercase tracking-widest text-yellow-500">Dantas</span>
        </div>

        <div className="text-zinc-800 font-black italic text-xl">VS</div>

        {/* HERÓI - CÉSAR (Bônus de +5) */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-28 h-36 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
            <img 
              src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CESAR%20FUNDO%20TRANSPARENTE.png" 
              className="w-full h-full object-cover relative z-0" 
              alt="César" 
            />
            <div className="absolute bottom-2 left-0 right-0 z-20 flex flex-col items-center">
              <span className="bg-cyan-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full mb-1">
                ⭐ HERÓI
              </span>
              <span className="text-white text-[12px] font-black italic">11.9 PTS</span>
            </div>
          </div>
          <span className="text-[11px] font-black italic uppercase tracking-widest text-cyan-400">César</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-[10px] text-white font-black uppercase italic tracking-wider">Regra Atualizada</p>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
          Capitão (Rating × 2) | Herói (Rating + 5)
        </p>
      </div>
    </div>
  );
}
