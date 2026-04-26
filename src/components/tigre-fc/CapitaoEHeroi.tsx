'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onSelect: (type: 'CAPTAIN' | 'HERO') => void;
  captainName?: string;
  heroName?: string;
  captainFoto?: string;
  heroFoto?: string;
  captainScore?: number;
  heroScore?: number;
}

export default function CapitaoEHeroi({
  onSelect,
  captainName = "César",
  heroName = "Dantas",
  captainFoto = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CESAR%20FUNDO%20TRANSPARENTE.png",
  heroFoto = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/DANTAS%20FUNDO%20TRANSPARENTE.png",
  captainScore = 6.9,
  heroScore = 7.1,
}: Props) {
  
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHasEntered(true);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#F5C400', '#00F3FF', '#BF5FFF', '#ffffff'],
      });
    }, 400);

    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center py-6">
      <div className="text-center mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-500 mb-1">
          ÚLTIMA RODADA — DESTAQUES
        </p>
        <h2 className="text-2xl font-black italic text-white">Capitão & Herói</h2>
      </div>

      <div className="flex items-center gap-8 w-full justify-center">
        
        {/* ==================== CAPITÃO ==================== */}
        <motion.button
          onClick={() => onSelect('CAPTAIN')}
          className="group relative flex flex-col items-center gap-3 outline-none"
          whileTap={{ scale: 0.92 }}
          whileHover={{ y: -4 }}
        >
          <div className="relative w-32 h-44 rounded-3xl overflow-hidden border-4 border-yellow-500 shadow-[0_0_30px_rgba(245,196,0,0.5)]">
            <img 
              src={captainFoto} 
              className="w-full h-full object-cover" 
              alt={captainName}
            />
            <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-black shadow-md">
              C
            </div>
          </div>

          <div className="text-center">
            <p className="font-black text-lg text-yellow-400 tracking-tight">{captainName}</p>
            <p className="text-xs text-yellow-500/80 font-mono">{captainScore.toFixed(1)} • Capitão</p>
          </div>
        </motion.button>

        <div className="text-4xl font-black text-zinc-700 italic -mt-8">VS</div>

        {/* ==================== HERÓI ==================== */}
        <motion.button
          onClick={() => onSelect('HERO')}
          className="group relative flex flex-col items-center gap-3 outline-none"
          whileTap={{ scale: 0.92 }}
          whileHover={{ y: -4 }}
        >
          <div className="relative w-32 h-44 rounded-3xl overflow-hidden border-4 border-cyan-400 shadow-[0_0_30px_rgba(0,243,255,0.5)]">
            <img 
              src={heroFoto} 
              className="w-full h-full object-cover" 
              alt={heroName}
            />
            <div className="absolute top-3 right-3 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-black text-xs font-black shadow-md">
              H
            </div>
          </div>

          <div className="text-center">
            <p className="font-black text-lg text-cyan-400 tracking-tight">{heroName}</p>
            <p className="text-xs text-cyan-400/80 font-mono">{heroScore.toFixed(1)} • Herói</p>
          </div>
        </motion.button>
      </div>

      <p className="mt-8 text-[10px] text-zinc-500 font-mono tracking-widest">
        CLIQUE PARA TROCAR
      </p>
    </div>
  );
}
