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
   {/* --- SEÇÃO THE BEST TIGRE FC (RODADA SPORT) --- */}
<div className="flex flex-col items-center gap-6 py-10">
  <h3 className="text-white font-black italic uppercase tracking-widest text-sm opacity-50">
    The Best <span className="text-yellow-500">Tigre FC</span>
  </h3>
  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] -mt-4">
    Rodada 6 • Sport 0x0 Novorizontino
  </p>

  <div className="flex items-center justify-center gap-6 w-full max-w-2xl">
    
    {/* CAPITÃO - DANTAS */}
    <div className="relative group">
      <div className="absolute -inset-1 bg-yellow-500/20 blur-xl group-hover:bg-yellow-500/40 transition-all" />
      <div className="relative w-32 h-44 rounded-2xl overflow-hidden border-2 border-yellow-500 bg-zinc-950">
        <img 
          src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/DANTAS%20FUNDO%20TRANSPARENTE.png" 
          className="w-full h-full object-cover" 
          alt="Dantas" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
          <span className="bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full mb-1 uppercase">Capitão</span>
          <span className="text-white text-xl font-black italic">14.2</span>
          <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-tighter">Rating x2</span>
        </div>
      </div>
      <p className="text-center mt-2 text-white font-black italic uppercase text-[10px] tracking-widest">Dantas</p>
    </div>

    {/* HERÓI - CÉSAR */}
    <div className="relative group">
      <div className="absolute -inset-1 bg-cyan-400/20 blur-xl group-hover:bg-cyan-400/40 transition-all" />
      <div className="relative w-32 h-44 rounded-2xl overflow-hidden border-2 border-cyan-400 bg-zinc-950">
        <img 
          src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CESAR%20FUNDO%20TRANSPARENTE.png" 
          className="w-full h-full object-cover" 
          alt="César" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
          <span className="bg-cyan-400 text-black text-[8px] font-black px-2 py-0.5 rounded-full mb-1 uppercase">Herói</span>
          <span className="text-white text-xl font-black italic">11.9</span>
          <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-tighter">Rating + 5</span>
        </div>
      </div>
      <p className="text-center mt-2 text-white font-black italic uppercase text-[10px] tracking-widest">César</p>
    </div>

  </div>
</div>
