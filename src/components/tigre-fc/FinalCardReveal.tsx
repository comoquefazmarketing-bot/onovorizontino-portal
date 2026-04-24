'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import Image from 'next/image';

const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const ESCUDO_SPORT = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/sport.png';
const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

export default function FinalCardReveal({ 
  lineup, formation, captainId, heroId, scoreTigre, scoreAdversario, onClose 
}: any) {
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealStatus, setRevealStatus] = useState<'opening' | 'opened'>('opening');
  const [isSharing, setIsSharing] = useState(false);

  const x = useMotionValue(180);
  const y = useMotionValue(290);
  const rotateX = useTransform(y, [0, 580], [10, -10]);
  const rotateY = useTransform(x, [0, 360], [-10, 10]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealStatus('opened');
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#F5C400', '#00F3FF', '#ffffff'] });
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3, cacheBust: true, backgroundColor: '#000' });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'meu-time-tigre.png', { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Tigre FC', text: `Minha convocação para Tigre x Sport! 🐯` });
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'meu-time-tigre.png';
        link.click();
      }
    } catch (e) { console.error(e); } finally { setIsSharing(false); }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/98 z-[999] flex flex-col items-center justify-center p-4 overflow-y-auto backdrop-blur-md">
        
        <button onClick={onClose} className="absolute top-6 right-6 text-white/20 hover:text-white z-50">✕ FECHAR</button>

        {revealStatus === 'opening' ? (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1, rotate: 360 }} transition={{ duration: 1 }}>
            <Image src={PATA_LOGO} width={150} height={150} alt="Loading" className="animate-pulse" />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
            
            <div className="text-center mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.8em] text-yellow-500 mb-2">SÉRIE B • RODADA 06</h2>
              <h1 className="text-5xl font-[1000] italic tracking-tighter text-white">ULTIMATE XI</h1>
            </div>

            {/* CARD ESTILO CONSOLE */}
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, perspective: 1000 }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set(e.clientX - rect.left);
                y.set(e.clientY - rect.top);
              }}
              className="relative w-[360px] h-[600px] bg-zinc-900 rounded-[45px] border-[4px] border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)] overflow-hidden"
            >
              {/* CAMPO DE JOGO PREMIUM */}
              <div className="absolute inset-4 z-10 overflow-hidden rounded-[35px] bg-[#0f2d0f] border border-white/5">
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                {/* Linhas do campo */}
                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="h-full w-full border border-white/20 relative">
                    <div className="absolute top-1/2 w-full h-[1px] bg-white/20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white/20 rounded-full" />
                  </div>
                </div>

                {/* JOGADORES (Maiores e com Sombra) */}
                {formation.map((slot: any) => {
                  const p = lineup[slot.id];
                  if (!p) return null;
                  return (
                    <div key={slot.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                      <div className={`relative w-14 h-14 rounded-full border-2 ${p.id === captainId ? 'border-yellow-400' : 'border-white/40'} overflow-hidden shadow-2xl bg-zinc-800`}>
                        <img src={p.foto} className="w-full h-full object-cover" alt={p.short} />
                      </div>
                      <div className="mt-1 bg-black/80 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase border border-white/10">
                        {p.short}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* OVERLAY DE RESULTADO */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent z-20 p-8 flex flex-col justify-end">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={ESCUDO_TIGRE} className="w-12 h-12" alt="Tigre" />
                    <div className="flex items-baseline gap-1">
                      <span className="text-6xl font-[1000] italic text-yellow-500">{scoreTigre}</span>
                      <span className="text-2xl font-black text-zinc-700 mx-1">X</span>
                      <span className="text-4xl font-[1000] italic text-zinc-500">{scoreAdversario}</span>
                    </div>
                  </div>
                  <img src={ESCUDO_SPORT} className="w-10 h-10 grayscale opacity-50" alt="Sport" />
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-white/10 pt-3">
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Tigre FC • Elite Predictor</span>
                  <Image src={PATA_LOGO} width={20} height={20} className="opacity-40" alt="pata" />
                </div>
              </div>
            </motion.div>

            <button
              onClick={handleShare}
              disabled={isSharing}
              className="mt-10 w-[360px] py-5 bg-green-500 text-black rounded-2xl font-[1000] text-sm uppercase italic shadow-[0_20px_40px_rgba(34,197,94,0.3)]"
            >
              {isSharing ? 'GERANDO CARD...' : 'COMPARTILHAR NO INSTA →'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
