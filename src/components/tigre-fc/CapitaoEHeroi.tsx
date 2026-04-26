'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onSelect: (type: 'CAPTAIN' | 'HERO') => void;
  captainName?: string;
  heroName?: string;
  captainFoto?: string;
  heroFoto?: string;
}

export default function CapitaoEHeroi({ onSelect, captainName, heroName, captainFoto, heroFoto }: Props) {
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHasEntered(true);
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.7 },
        colors: ['#F5C400', '#00F3FF', '#ffffff'],
      });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center py-4">
      <div className="flex items-center gap-6 w-full justify-center">
        {/* CAPITÃO */}
        <motion.button
          onClick={() => onSelect('CAPTAIN')}
          className="group relative flex flex-col items-center gap-2 outline-none"
          whileTap={{ scale: 0.93 }}
        >
          <div className={`relative w-28 h-36 rounded-2xl overflow-hidden border-2 transition-all ${
            captainName ? 'border-yellow-500 shadow-[0_0_20px_rgba(245,196,0,0.4)]' : 'border-zinc-800'
          }`}>
            {captainFoto ? <img src={captainFoto} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-900 flex items-center justify-center opacity-20">©</div>}
            <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-black text-[9px] font-black">C</div>
          </div>
          <span className="text-[10px] font-black uppercase text-yellow-500">{captainName || 'Selecionar'}</span>
        </motion.button>

        <div className="text-zinc-800 font-black italic">VS</div>

        {/* HERÓI */}
        <motion.button
          onClick={() => onSelect('HERO')}
          className="group relative flex flex-col items-center gap-2 outline-none"
          whileTap={{ scale: 0.93 }}
        >
          <div className={`relative w-28 h-36 rounded-2xl overflow-hidden border-2 transition-all ${
            heroName ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,243,255,0.4)]' : 'border-zinc-800'
          }`}>
            {heroFoto ? <img src={heroFoto} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-zinc-900 flex items-center justify-center opacity-20">⭐</div>}
            <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-black text-[9px] font-black">H</div>
          </div>
          <span className="text-[10px] font-black uppercase text-cyan-400">{heroName || 'Selecionar'}</span>
        </motion.button>
      </div>
    </div>
  );
}
