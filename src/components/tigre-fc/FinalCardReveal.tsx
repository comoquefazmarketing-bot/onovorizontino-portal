'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import Image from 'next/image';

// --- CONFIGURAÇÕES VISUAIS ---
const TEXTURA_GRAMADO = 'https://www.transparenttextures.com/patterns/dark-dotted-2.png';
const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const GOLD = "#F5C400";
const NEON_CYAN = "#00F3FF";

interface FinalCardProps {
  lineup: Record<string, any>;
  formation: any[];
  captainId: number | null;
  heroId: number | null;
  scoreTigre: number;
  scoreAdversario: number;
  onClose: () => void;
}

export default function FinalCardReveal({ 
  lineup, formation, captainId, heroId, scoreTigre, scoreAdversario, onClose 
}: FinalCardProps) {
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [revealStatus, setRevealStatus] = useState<'idle' | 'opening' | 'opened'>('idle');
  const [isSharing, setIsSharing] = useState(false);

  // --- 3D PERSPECTIVE EFFECT ---
  const x = useMotionValue(200);
  const y = useMotionValue(300);
  const rotateX = useTransform(y, [0, 600], [15, -15]);
  const rotateY = useTransform(x, [0, 400], [-15, 15]);
  const shineX = useTransform(x, [0, 400], ["0%", "100%"]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function handleMouseLeave() {
    x.set(200);
    y.set(300);
  }

  // --- REVELAÇÃO E CONFETI ---
  useEffect(() => {
    setRevealStatus('opening');
    const timer = setTimeout(() => {
      setRevealStatus('opened');
      const end = Date.now() + 1000;
      const colors = [GOLD, NEON_CYAN, '#ffffff'];

      (function frame() {
        confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0 }, colors: colors, zIndex: 200 });
        confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1 }, colors: colors, zIndex: 200 });
        if (Date.now() < end) requestAnimationFrame(frame);
      }());
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // --- COMPARTILHAMENTO NATIVO ---
 const handleShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
 
    try {
      // html-to-image: sem SecurityError, suporte a crossOrigin nativo
      const { toPng } = await import('html-to-image');
 
      // Garante crossOrigin="anonymous" em todas as imagens do card
      cardRef.current.querySelectorAll('img').forEach((img) => {
        (img as HTMLImageElement).crossOrigin = 'anonymous';
      });
      await new Promise(r => setTimeout(r, 80)); // aguarda reload
 
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,          // resolução 2× para redes sociais
        cacheBust: true,        // previne uso de cache sem crossOrigin
        backgroundColor: '#09090b',
        style: { imageRendering: 'auto' },
      });
 
      const blob = await (await fetch(dataUrl)).blob();
      if (!blob) return;
 
      const file = new File([blob], 'meu-time-tigre-fc.png', { type: 'image/png' });
 
      // Mobile → Web Share API (abre WhatsApp, Insta, etc.)
      // Desktop → download direto do .png
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile && navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Meu Time no Tigre FC',
          text: `Olha minha escalação! Tigre ${scoreTigre} x ${scoreAdversario} 🐯`,
        });
      } else {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'meu-time-tigre-fc.png';
        link.click();
      }
    } catch (error) {
      console.error('[FinalCardReveal] share error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/95 z-[999] flex flex-col items-center justify-center backdrop-blur-sm p-4 overflow-y-auto"
      >
        
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-white z-50 text-2xl font-light">✕</button>

        {revealStatus === 'opening' && (
          <motion.div 
            initial={{ scale: 0, rotateY: 0 }}
            animate={{ scale: [0, 1.2, 1], rotateY: 1080 }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className="absolute flex items-center justify-center"
          >
            <div className="w-40 h-40 bg-white rounded-full blur-[100px] opacity-80" />
            <div className="absolute w-60 h-60 bg-yellow-500 rounded-full blur-[150px] opacity-50" />
            <Image src={PATA_LOGO} alt="Luz" width={200} height={200} className="absolute animate-pulse" />
          </motion.div>
        )}

        {revealStatus === 'opened' && (
          <motion.div
            className="w-full flex flex-col items-center justify-center min-h-screen py-10"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          >
            
            <div className="text-center mb-6">
              <h2 className="text-[11px] font-[1000] uppercase italic tracking-[0.5em] text-zinc-400">Sua Convocação</h2>
              <p className="text-4xl font-[1000] uppercase italic tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Ultimate XI</p>
            </div>

            {/* CARD INTERATIVO */}
            <motion.div
              ref={cardRef}
              style={{ rotateX, rotateY, perspective: 2000 }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-[360px] h-[580px] bg-zinc-950 border-[3px] border-white/10 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,1)] overflow-hidden group cursor-grab"
            >
              
              {/* ÁREA DO CAMPO */}
              <div className="absolute inset-0 z-10 p-4">
                <div className="relative w-full h-full bg-[#1e5c1e] rounded-[30px] border-2 border-white/10 overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-dotted-2.png')] opacity-20" />
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={`absolute w-full h-[16.6%] ${i % 2 === 0 ? 'bg-[#246b24]' : ''}`} style={{ top: `${i * 16.6}%`}} />
                  ))}

                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-4 border border-white" />
                    <div className="absolute top-1/2 left-4 right-4 h-[1px] bg-white -translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  {/* MINI JOGADORES */}
                  {formation.map((slot) => {
                    const player = lineup[slot.id];
                    if (!player) return null;
                    const isCaptain = player.id === captainId;
                    const isHero = player.id === heroId;
                    
                    return (
                      <div 
                        key={slot.id} 
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30"
                        style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                      >
                        <div className={`relative w-8 h-10 rounded border ${isCaptain ? 'border-yellow-500 shadow-[0_0_5px_#F5C400]' : isHero ? 'border-cyan-400 shadow-[0_0_5px_#00F3FF]' : 'border-zinc-800'} overflow-hidden bg-black`}>
                          <img src={player.foto} alt={player.short} className="w-full h-full object-cover" />
                          {isCaptain && <div className="absolute top-0 right-0 bg-yellow-500 text-black font-black text-[5px] px-0.5 rounded-bl">C</div>}
                          {isHero && <div className="absolute top-0 right-0 bg-cyan-400 text-black font-black text-[5px] px-0.5 rounded-bl">H</div>}
                        </div>
                        <span className="text-[6px] font-bold text-white uppercase mt-1 bg-black/70 px-1 rounded truncate max-w-[40px]">{player.short}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* OVERLAY DE PLACAR */}
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/90 to-transparent z-20 p-8 flex flex-col justify-end">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Image src={ESCUDO_TIGRE} alt="Tigre" width={40} height={40} className="drop-shadow-lg" />
                    <div className="flex gap-2">
                        <span className="text-5xl font-[1000] italic text-yellow-500 tracking-tighter">{scoreTigre}</span>
                        <span className="text-5xl font-[1000] italic text-zinc-700 tracking-tighter">X</span>
                        <span className="text-5xl font-[1000] italic text-white/20 tracking-tighter">{scoreAdversario}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700">Tigre FC • Palpiteiro Elite</p>
                    <Image src={PATA_LOGO} alt="Pata" width={16} height={16} className="opacity-20" />
                </div>
              </div>

              {/* EFEITOS DE BRILHO */}
              <motion.div 
                style={{ x: shineX }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-40"
              />
              <div className="absolute inset-0 border border-yellow-500/10 rounded-[40px] pointer-events-none animate-pulse" />
            </motion.div>

            {/* BOTÕES DE COMPARTILHAMENTO (FORA DO CARD PARA NÃO SAIR NA FOTO) */}
            <div className="flex flex-col gap-4 mt-10 w-full max-w-[360px]">
              <button 
                onClick={handleShare}
                disabled={isSharing}
                className="w-full px-8 py-5 bg-green-500 text-black rounded-2xl font-[1000] text-sm uppercase italic hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(34,197,94,0.3)] flex items-center justify-center gap-3"
              >
                {isSharing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    PREPARANDO...
                  </span>
                ) : (
                  <>COMPARTILHAR AGORA</>
                )}
              </button>
              
              <button 
                onClick={onClose}
                className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition"
              >
                Voltar para Escalação
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
