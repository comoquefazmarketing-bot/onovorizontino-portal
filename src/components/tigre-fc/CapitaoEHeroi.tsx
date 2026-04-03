'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface Props {
  onSelect: (type: 'CAPTAIN' | 'HERO') => void;
  captainName?: string;
  heroName?: string;
}

export default function CapitaoEHeroi({ onSelect, captainName, heroName }: Props) {
  const [hasClashed, setHasClashed] = useState(false);

  // Trigger da explosão quando os cards se encontram
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasClashed(true);
      
      // Explosão de Partículas
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: 0.5, y: 0.5 }, colors: ['#F5C400', '#00F3FF'] });
      }, 250);
    }, 800); // Sincronizado com o tempo da animação de encontro

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-10 overflow-hidden">
      
      {/* TÍTULOS COM GLITCH EFFECT */}
      <AnimatePresence>
        {hasClashed && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-20 mb-8 z-20"
          >
            <h3 className="text-yellow-500 font-[1000] italic uppercase tracking-[0.3em] text-sm drop-shadow-[0_0_10px_#F5C400]">
              Liderança
            </h3>
            <h3 className="text-cyan-400 font-[1000] italic uppercase tracking-[0.3em] text-sm drop-shadow-[0_0_10px_#00F3FF]">
              Poder
            </h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center w-full max-w-2xl h-40">
        
        {/* CARD CAPITÃO (DOURADO) */}
        <motion.button
          onClick={() => onSelect('CAPTAIN')}
          initial={{ x: -500, opacity: 0, rotate: -20 }}
          animate={{ x: hasClashed ? -80 : 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          className={`group relative w-32 h-44 rounded-xl border-2 transition-all
            ${captainName ? 'border-yellow-500 bg-yellow-500/10' : 'border-yellow-500/50 bg-zinc-900'}
            hover:scale-110 hover:shadow-[0_0_30px_rgba(245,196,0,0.5)]
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent" />
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-4xl mb-2">©</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {captainName || "Escolher Capitão"}
            </span>
          </div>
          {/* Brilho Pulsante */}
          <div className="absolute -inset-1 bg-yellow-500 rounded-xl blur opacity-20 group-hover:opacity-60 animate-pulse" />
        </motion.button>

        {/* EFEITO DE IMPACTO NO CENTRO */}
        <AnimatePresence>
          {!hasClashed && (
            <motion.div 
              exit={{ scale: 2, opacity: 0 }}
              className="absolute w-20 h-20 bg-white rounded-full blur-2xl z-10"
            />
          )}
        </AnimatePresence>

        {/* CARD HERÓI (CIAN NEON) */}
        <motion.button
          onClick={() => onSelect('HERO')}
          initial={{ x: 500, opacity: 0, rotate: 20 }}
          animate={{ x: hasClashed ? 80 : 0, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          className={`group relative w-32 h-44 rounded-xl border-2 transition-all
            ${heroName ? 'border-cyan-400 bg-cyan-400/10' : 'border-cyan-400/50 bg-zinc-900'}
            hover:scale-110 hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent" />
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-4xl mb-2">⭐</span>
            <span className="text-[10px] font-black uppercase tracking-tighter">
              {heroName || "Escolher Herói"}
            </span>
          </div>
          {/* Brilho Pulsante Neon */}
          <div className="absolute -inset-1 bg-cyan-400 rounded-xl blur opacity-20 group-hover:opacity-60 animate-pulse" />
        </motion.button>

      </div>

      {/* BACKGROUND FLARE */}
      <div className={`absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-cyan-500/5 pointer-events-none transition-opacity duration-1000 ${hasClashed ? 'opacity-100' : 'opacity-0'}`} />

      <style jsx>{`
        @keyframes shock {
          0% { transform: translate(0,0); }
          25% { transform: translate(5px,-5px); }
          50% { transform: translate(-5px,5px); }
          75% { transform: translate(5px,5px); }
          100% { transform: translate(0,0); }
        }
        .animate-shock {
          animation: shock 0.2s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}
