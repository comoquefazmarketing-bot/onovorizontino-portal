'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface PalpiteProps {
  scoreTigre: number;
  scoreAdversario: number;
  setScoreTigre: (val: number) => void;
  setScoreAdversario: (val: number) => void;
  logoTigre?: string;
  logoOponente?: string;
}

// Configurações visuais baseadas na identidade que você mandou
const GOLD = "#F5C400";
const NEON_GREEN = "#22C55E"; // Cor da pontuação +15 PTS
const OPPONENT_COLOR = "#71717A"; // Zinc-500

export default function Palpite({ scoreTigre, scoreAdversario, setScoreTigre, setScoreAdversario }: PalpiteProps) {
  const [isLocked, setIsLocked] = useState(false);

  // --- ANIMAÇÃO TILT 3D (MOUSE) ---
  const x = useMotionValue(200);
  const y = useMotionValue(100);
  const rotateX = useTransform(y, [0, 200], [10, -10]); // Inclinação Vertical
  const rotateY = useTransform(x, [0, 400], [-10, 10]); // Inclinação Horizontal

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(200); // Reseta para o centro
    y.set(100);
  }

  // --- GATILHO DE CONFIRMAÇÃO DO PLACAR ---
  const handleLockScore = () => {
    setIsLocked(true);
    
    // Explosão de confetes apenas verde neon (A cor dos +15 PTS)
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: [NEON_GREEN, '#FFFFFF'],
      zIndex: 100
    });
    
    // Feedback sonoro opcional de "lock-in" aqui
  };

  const ScoreControl = ({ score, setScore, color, label }: any) => (
    <div className="flex flex-col items-center gap-2">
      <span className={`text-[10px] font-black uppercase tracking-widest ${color === 'gold' ? 'text-yellow-500' : 'text-zinc-500'}`}>
        {label}
      </span>
      <div className="flex items-center gap-3 relative">
        <button 
          disabled={isLocked || score <= 0}
          onClick={() => setScore(score - 1)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-xl transition-all active:scale-90 disabled:opacity-20
            ${color === 'gold' ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10' : 'border-zinc-500 text-zinc-500 hover:bg-zinc-500/10'}`}
        >
          -
        </button>
        <span className={`text-6xl font-[1000] italic text-white min-w-[70px] text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]
          ${color === 'opponent' ? 'opacity-60' : ''}`}
        >
          {score}
        </span>
        <button 
          disabled={isLocked}
          onClick={() => setScore(score + 1)}
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-black text-xl transition-all active:scale-90 disabled:opacity-20
            ${color === 'gold' ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-500/10' : 'border-zinc-500 text-zinc-500 hover:bg-zinc-500/10'}`}
        >
          +
        </button>
        
        {/* Glow dinâmico atrás do número */}
        <div className={`absolute -inset-4 rounded-full blur-2xl opacity-10 ${color === 'gold' ? 'bg-yellow-500' : 'bg-zinc-700'}`} />
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden z-[99]">
      
      {/* CONTAINER PRINCIPAL COM PERSPECTIVA 3D */}
      <motion.div
        style={{ perspective: 1000, rotateX, rotateY }}
        onMouseMove={handleMouse}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`relative w-full max-w-lg bg-zinc-950 border-2 rounded-[3rem] p-10 shadow-[0_40px_100px_rgba(0,0,0,1)] 
          transition-all duration-700 ${isLocked ? 'border-green-500 bg-zinc-900 shadow-[0_0_50px_rgba(34,197,94,0.4)]' : 'border-zinc-800'}`}
      >
        
        {/* BARRA SUPERIOR ESTILO MENU FIFA */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent pointer-events-none" />

        {/* TÍTULO COM O SISTEMA DE PONTOS */}
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-[11px] font-[1000] uppercase italic tracking-[0.4em] text-white/70 mb-2">Previsão de Placar</h2>
          <div className="flex gap-2 items-center">
            <span className="text-2xl font-[1000] text-yellow-500 italic drop-shadow-[0_0_10px_#F5C400]">PLACAR EXATO</span>
            <span className="text-2xl font-[1000] text-green-400 italic drop-shadow-[0_0_10px_#22C55E]">(+15 PTS)</span>
          </div>
        </div>

        {/* ÁREA DO PLACAR VS */}
        <div className="flex items-center justify-around gap-4 mb-10 relative">
          
          {/* TIGRE (Dourado) */}
          <ScoreControl label="Tigre FC" score={scoreTigre} setScore={setScoreTigre} color="gold" />

          {/* VS CENTRAL (ITÁLICO) */}
          <div className="flex flex-col items-center">
            <div className="text-4xl font-[1000] italic text-zinc-800 tracking-tighter mt-10">VS</div>
            <div className="h-10 w-[2px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
          </div>

          {/* OPONENTE (Cinza/Oponente) */}
          <ScoreControl label="Adversário" score={scoreAdversario} setScore={setScoreAdversario} color="opponent" />
          
        </div>

        {/* BOTÃO DE CONFIRMAÇÃO (O "SHOCK" FINAL) */}
        <AnimatePresence>
          {!isLocked ? (
            <motion.button 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.8 }}
              onClick={handleLockScore}
              className="group w-full py-5 rounded-2xl bg-white text-black font-[1000] italic uppercase text-xs tracking-[0.3em] overflow-hidden relative
                transition-all hover:scale-[1.03] active:scale-95 hover:bg-yellow-500 shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
            >
              CRAVAR PALPITE →
              {/* Efeito de scanline no botão */}
              <div className="absolute inset-0 bg-[url('/scanlines.png')] opacity-10 group-hover:opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
            </motion.button>
          ) : (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-full py-5 rounded-2xl bg-green-500/20 border-2 border-green-500 text-green-400 font-black italic uppercase text-xs tracking-[0.3em] text-center"
            >
              ✓ Placar Confirmado
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Detalhe de mockup na borda inferior */}
        <div className="absolute -bottom-4 left-10 right-10 h-8 bg-zinc-950 border border-zinc-900 rounded-b-2xl -z-10" />

      </motion.div>
    </div>
  );
}
