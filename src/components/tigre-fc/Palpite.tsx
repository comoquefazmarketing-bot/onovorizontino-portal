'use client';

/**
 * Palpite v3 — Match Predictor
 * Placar estilo marcador eletrônico de estádio.
 * Logo Novorizontino vs Logo adversário, fontes de impacto.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const ESCUDO_ADV   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/adversario-placeholder.png';

interface PalpiteProps {
  scoreTigre: number;
  scoreAdversario: number;
  setScoreTigre: (v: number) => void;
  setScoreAdversario: (v: number) => void;
  isLocked: boolean;
  onLock: () => void;
  nomeAdversario?: string;
  escudoAdversario?: string;
}

function ScoreDigit({ value, color }: { value: number; color: 'gold' | 'gray' }) {
  return (
    <motion.span
      key={value}
      initial={{ y: -20, opacity: 0, scale: 0.8 }}
      animate={{ y: 0,   opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 300 }}
      className="tabular-nums leading-none"
      style={{
        fontSize: 'clamp(52px, 10vw, 76px)',
        fontWeight: 900,
        fontStyle: 'italic',
        color: color === 'gold' ? '#F5C400' : '#ffffff',
        textShadow: color === 'gold'
          ? '0 0 30px rgba(245,196,0,0.5), 0 0 60px rgba(245,196,0,0.2)'
          : '0 0 20px rgba(255,255,255,0.15)',
        letterSpacing: '-0.04em',
        display: 'block',
        minWidth: '60px',
        textAlign: 'center',
      }}
    >
      {value}
    </motion.span>
  );
}

function ScoreBtn({ onMinus, onPlus, disabled }: { onMinus: () => void; onPlus: () => void; disabled: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onPlus}
        disabled={disabled}
        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-lg hover:bg-white/10 hover:border-white/20 transition disabled:opacity-20"
      >
        +
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onMinus}
        disabled={disabled}
        className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-lg hover:bg-white/10 hover:border-white/20 transition disabled:opacity-20"
      >
        −
      </motion.button>
    </div>
  );
}

export default function Palpite({
  scoreTigre, scoreAdversario,
  setScoreTigre, setScoreAdversario,
  isLocked, onLock,
  nomeAdversario = 'Adversário',
  escudoAdversario,
}: PalpiteProps) {

  // Tilt 3D
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-80, 80], [6, -6]);
  const rotY = useTransform(mx, [-150, 150], [-6, 6]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - r.left - r.width  / 2);
    my.set(e.clientY - r.top  - r.height / 2);
  }
  function onMouseLeave() { mx.set(0); my.set(0); }

  const handleLock = () => {
    onLock();
    // Shake rápido + confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.65 },
      colors: ['#F5C400', '#22C55E', '#ffffff', '#00F3FF'],
      startVelocity: 35,
    });
  };

  return (
    <motion.div
      style={{ perspective: 1000, rotateX: rotX, rotateY: rotY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="w-full"
    >
      <div className={`relative rounded-[2rem] overflow-hidden border-2 transition-all duration-700 ${
        isLocked
          ? 'border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]'
          : 'border-zinc-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
      }`}>

        {/* Background */}
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* Scanline sutil */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
          }}
        />

        {/* Barra topo neon */}
        <div className={`h-0.5 w-full transition-all duration-700 ${
          isLocked
            ? 'bg-gradient-to-r from-transparent via-green-500 to-transparent'
            : 'bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent'
        }`} />

        <div className="relative p-6 pb-7">

          {/* Header "Match Predictor" */}
          <div className="text-center mb-5">
            <p className="text-[9px] font-black uppercase tracking-[0.5em] text-zinc-600">
              ⚡ Match Predictor
            </p>
            <div className="flex justify-center items-center gap-2 mt-1">
              <span className="text-[11px] font-black text-yellow-500 uppercase italic tracking-wide">Placar Exato</span>
              <span className="text-[11px] font-black text-green-400 uppercase italic">+15 PTS</span>
            </div>
          </div>

          {/* PLACAR PRINCIPAL */}
          <div className="flex items-center justify-center gap-2">

            {/* Time da Casa — TIGRE */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="relative">
                <img
                  src={ESCUDO_TIGRE}
                  className="w-12 h-12 object-contain drop-shadow-lg"
                  alt="Tigre FC"
                />
                <div className="absolute inset-0 rounded-full"
                  style={{ boxShadow: '0 0 20px rgba(245,196,0,0.3)' }} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-yellow-500">
                Novorizontino
              </span>
            </div>

            {/* Placar */}
            <div className="flex items-center gap-1 px-2">
              {/* Gols Tigre */}
              <div className="flex flex-col items-center">
                <ScoreDigit value={scoreTigre} color="gold" />
                <ScoreBtn
                  onPlus={() => setScoreTigre(scoreTigre + 1)}
                  onMinus={() => setScoreTigre(Math.max(0, scoreTigre - 1))}
                  disabled={isLocked}
                />
              </div>

              {/* Separador */}
              <div className="flex flex-col items-center px-1 mb-12">
                <span className="text-zinc-700 font-black text-3xl italic leading-none">:</span>
              </div>

              {/* Gols Adversário */}
              <div className="flex flex-col items-center">
                <ScoreDigit value={scoreAdversario} color="gray" />
                <ScoreBtn
                  onPlus={() => setScoreAdversario(scoreAdversario + 1)}
                  onMinus={() => setScoreAdversario(Math.max(0, scoreAdversario - 1))}
                  disabled={isLocked}
                />
              </div>
            </div>

            {/* Time Visitante */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="relative">
                <img
                  src={escudoAdversario || ESCUDO_ADV}
                  className="w-12 h-12 object-contain drop-shadow-lg opacity-60"
                  alt={nomeAdversario}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                {!escudoAdversario && (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <span className="text-zinc-500 text-lg">?</span>
                  </div>
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 truncate max-w-[72px] text-center">
                {nomeAdversario}
              </span>
            </div>
          </div>

          {/* Indicador visual de resultado */}
          <div className="flex justify-center my-4">
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
              scoreTigre > scoreAdversario
                ? 'border-green-500/40 bg-green-500/10 text-green-400'
                : scoreTigre < scoreAdversario
                ? 'border-red-500/40 bg-red-500/10 text-red-400'
                : 'border-zinc-700 bg-zinc-900 text-zinc-500'
            }`}>
              {scoreTigre > scoreAdversario ? '🏆 Vitória do Tigre'
               : scoreTigre < scoreAdversario ? '💀 Derrota'
               : '🤝 Empate'}
            </div>
          </div>

          {/* Botão de CRAVAR */}
          <AnimatePresence mode="wait">
            {!isLocked ? (
              <motion.button
                key="lock"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLock}
                className="group relative w-full py-4 rounded-2xl overflow-hidden font-black text-xs uppercase tracking-[0.3em] transition-all"
                style={{ background: 'white', color: 'black' }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent skew-x-12" />
                <span className="relative">CRAVAR PALPITE →</span>
              </motion.button>
            ) : (
              <motion.div
                key="locked"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1,   opacity: 1 }}
                className="w-full py-4 rounded-2xl border-2 border-green-500 bg-green-500/10 text-green-400 font-black text-xs uppercase tracking-[0.3em] text-center"
              >
                ✓ Palpite Registrado
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Barra base neon */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
    </motion.div>
  );
}
