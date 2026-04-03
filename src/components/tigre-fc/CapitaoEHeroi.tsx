'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Esta interface PRECISA ter este nome para o componente abaixo funcionar
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
        startVelocity: 25,
        ticks: 80,
      });
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center py-4 overflow-hidden">
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-yellow-500/50" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-500">
              Escolha seus Líderes
            </p>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-500/50" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-6 w-full justify-center">
        {/* CAPITÃO */}
        <motion.button
          onClick={() => onSelect('CAPTAIN')}
          initial={{ x: -60, opacity: 0, scale: 0.7 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 160, delay: 0.05 }}
          whileTap={{ scale: 0.93 }}
          className="group relative flex flex-col items-center gap-2 outline-none"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: captainName
                ? 'radial-gradient(circle, rgba(245,196,0,0.35) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(245,196,0,0.15) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          <div className={`relative w-28 h-36 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
            captainName
              ? 'border-yellow-500 shadow-[0_0_25px_rgba(245,196,0,0.6)]'
              : 'border-yellow-500/40 shadow-[0_0_12px_rgba(245,196,0,0.2)]'
          } group-hover:shadow-[0_0_35px_rgba(245,196,0,0.8)] group-hover:border-yellow-400`}>
            {captainFoto ? (
              <>
                <img src={captainFoto} className="w-full h-full object-cover object-top" alt={captainName} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-yellow-500/10 to-black flex items-center justify-center">
                <span className="text-4xl opacity-60">©</span>
              </div>
            )}
            <div className="absolute top-2 right-2 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(245,196,0,0.8)]">
              <span className="text-black text-[9px] font-black">C</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 text-center">
              <span className="text-[9px] font-black uppercase text-yellow-400 block tracking-wider drop-shadow">
                {captainName ?? 'Capitão'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-yellow-500/70">Liderança</span>
          </div>
        </motion.button>

        {/* SEPARADOR */}
        <motion.div className="flex flex-col items-center gap-1">
          <div className="w-px h-8 bg-gradient-to-b from-yellow-500/30 to-transparent" />
          <span className="text-zinc-700 text-xs font-black italic">&</span>
          <div className="w-px h-8 bg-gradient-to-t from-cyan-500/30 to-transparent" />
        </motion.div>

        {/* HERÓI */}
        <motion.button
          onClick={() => onSelect('HERO')}
          initial={{ x: 60, opacity: 0, scale: 0.7 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 14, stiffness: 160, delay: 0.1 }}
          whileTap={{ scale: 0.93 }}
          className="group relative flex flex-col items-center gap-2 outline-none"
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.9 }}
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: heroName
                ? 'radial-gradient(circle, rgba(0,243,255,0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(0,243,255,0.12) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          <div className={`relative w-28 h-36 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
            heroName
              ? 'border-cyan-400 shadow-[0_0_25px_rgba(0,243,255,0.6)]'
              : 'border-cyan-400/40 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
          } group-hover:shadow-[0_0_35px_rgba(0,243,255,0.8)] group-hover:border-cyan-300`}>
            {heroFoto ? (
              <>
                <img src={heroFoto} className="w-full h-full object-cover object-top" alt={heroName} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-b from-cyan-500/10 to-black flex items-center justify-center">
                <span className="text-4xl opacity-60">⭐</span>
              </div>
            )}
            <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,243,255,0.8)]">
              <span className="text-black text-[9px] font-black">H</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 text-center">
              <span className="text-[9px] font-black uppercase text-cyan-300 block tracking-wider drop-shadow">
                {heroName ?? 'Herói'}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-500/70">Poder</span>
          </div>
        </motion.button>
      </div>

      <div className="flex gap-2 mt-5">
        <div className={`h-1 w-16 rounded-full transition-all duration-500 ${captainName ? 'bg-yellow-500' : 'bg-zinc-800'}`} />
        <div className={`h-1 w-16 rounded-full transition-all duration-500 ${heroName ? 'bg-cyan-400' : 'bg-zinc-800'}`} />
      </div>
    </div>
  );
}
