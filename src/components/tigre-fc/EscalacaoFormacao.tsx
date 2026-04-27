'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import { Share2, Download, Zap, Trophy, Shield, Target } from 'lucide-react';

const BASE_STORAGE   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO_DEFAULT = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

const COLORS = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red: '#FF2D55',
  glass: 'rgba(0,0,0,0.7)'
};

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
  ovr?: number;
}

export default function EscalacaoFormacao({ jogoId }: { jogoId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<'arena' | 'capitao' | 'palpite' | 'share'>('arena');
  const [slots, setSlots] = useState<Record<string, Player | null>>({
    gk: null, df_l: null, df_c1: null, df_c2: null, df_r: null,
    mf_l: null, mf_c: null, mf_r: null, fw_l: null, fw_c: null, fw_r: null
  });
  const [capitao, setCapitao] = useState<number | null>(null);
  const [heroi, setHeroi] = useState<number | null>(null);
  const [palpite, setPalpite] = useState({ mandante: 0, visitante: 0 });
  const [finalImageUri, setFinalImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Gerar imagem para compartilhamento
  const generateShareImage = async () => {
    if (!cardRef.current) return;
    setLoading(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { quality: 0.95, backgroundColor: '#000' });
      setFinalImageUri(dataUrl);
      setStep('share');
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: [COLORS.gold, '#fff', COLORS.cyan] });
    } catch (err) {
      console.error("Erro ao gerar imagem", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-black text-white overflow-hidden font-['Barlow_Condensed']">
      
      {/* BACKGROUND ÚNICO PARA TODAS AS TELAS */}
      <div className="absolute inset-0 z-0">
        <img src={STADIUM_BG} className="w-full h-full object-cover opacity-40" alt="Estádio" />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: ARENA (ESCALAÇÃO) - Mantenha sua lógica de slots aqui */}
        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 p-4">
             <div className="text-center mb-6">
                <h1 className="text-4xl font-black italic tracking-tighter text-yellow-400">CONVOCAR TITULARES</h1>
                <p className="text-zinc-400 text-xs tracking-[0.2em]">RODADA 7 • SÉRIE B</p>
             </div>
             {/* Renderize seu campo aqui... simplificado para o exemplo */}
             <div className="flex flex-col gap-4 items-center">
                <button 
                  onClick={() => setStep('capitao')}
                  className="w-full max-w-xs py-4 bg-yellow-400 text-black font-black rounded-2xl shadow-[0_0_20px_rgba(245,196,0,0.4)]"
                >
                  DEFINIR CAPITÃO →
                </button>
             </div>
          </motion.div>
        )}

        {/* STEP 2: CAPITÃO E HERÓI */}
        {step === 'capitao' && (
          <motion.div key="capitao" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} className="relative z-10 p-6 flex flex-col items-center justify-center min-h-screen">
             <div className="bg-black/80 backdrop-blur-xl p-8 rounded-[40px] border border-white/10 w-full max-w-sm text-center">
                <Shield className="mx-auto mb-4 text-cyan-400" size={48} />
                <h2 className="text-3xl font-black italic text-white mb-2">LIDERANÇA</h2>
                <p className="text-zinc-500 text-sm mb-8">Escolha quem comandará o Tigre e quem será o herói do jogo.</p>
                
                {/* Lógica de seleção de capitão aqui... */}
                
                <button 
                  onClick={() => setStep('palpite')}
                  className="w-full py-4 bg-white text-black font-black rounded-2xl"
                >
                  PRÓXIMO: PALPITE →
                </button>
             </div>
          </motion.div>
        )}

        {/* STEP 3: PALPITE TURBINADO (O CHOQUE) */}
        {step === 'palpite' && (
          <motion.div 
            key="palpite" 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="relative z-10 p-4 flex flex-col items-center justify-center min-h-screen"
          >
            <div 
              ref={cardRef}
              className="relative w-full max-w-[400px] aspect-[4/5] bg-black/90 rounded-[48px] border border-white/10 overflow-hidden flex flex-col items-center p-8 shadow-2xl"
            >
              {/* Glow Central de Choque */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400/10 blur-[80px] rounded-full" />

              <div className="relative z-20 text-center mb-8">
                <div className="inline-block px-4 py-1 bg-cyan-400/20 border border-cyan-400/30 rounded-full mb-2">
                   <span className="text-cyan-400 text-[10px] font-black tracking-[0.3em]">CONFRONTO DIRETO</span>
                </div>
                <h3 className="text-white text-xl font-black italic tracking-widest uppercase">Palpite do Torcedor</h3>
              </div>

              {/* Área do Confronto */}
              <div className="relative z-20 flex w-full justify-between items-center px-4">
                <div className="flex flex-col items-center gap-3 flex-1">
                   <motion.img 
                    initial={{ x: -20 }} animate={{ x: 0 }}
                    src={ESCUDO_DEFAULT} className="w-20 h-20 drop-shadow-[0_0_15px_rgba(245,196,0,0.5)]" 
                   />
                   <span className="text-xs font-black text-white">NOVORIZONTINO</span>
                </div>

                <div className="relative flex items-center justify-center">
                   <motion.div 
                    animate={{ scale: [1, 1.2, 1] }} 
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"
                   />
                   <Zap size={44} className="text-yellow-400 relative z-10 drop-shadow-[0_0_10px_#F5C400]" />
                   <span className="absolute -bottom-6 text-3xl font-black italic opacity-20">VS</span>
                </div>

                <div className="flex flex-col items-center gap-3 flex-1">
                   <motion.img 
                    initial={{ x: 20 }} animate={{ x: 0 }}
                    src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/escudo-avai.png" 
                    className="w-20 h-20 drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]" 
                   />
                   <span className="text-xs font-black text-cyan-400">AVAÍ FC</span>
                </div>
              </div>

              {/* Inputs de Palpite */}
              <div className="relative z-20 mt-12 flex items-center gap-6">
                <div className="flex flex-col items-center">
                  <input 
                    type="number"
                    value={palpite.mandante}
                    onChange={(e) => setPalpite({...palpite, mandante: parseInt(e.target.value) || 0})}
                    className="w-20 h-24 bg-white/5 border-2 border-white/10 rounded-3xl text-center text-5xl font-black text-yellow-400 focus:border-yellow-400 focus:outline-none transition-all"
                  />
                </div>
                <div className="text-4xl font-black italic text-zinc-700">X</div>
                <div className="flex flex-col items-center">
                  <input 
                    type="number"
                    value={palpite.visitante}
                    onChange={(e) => setPalpite({...palpite, visitante: parseInt(e.target.value) || 0})}
                    className="w-20 h-24 bg-white/5 border-2 border-white/10 rounded-3xl text-center text-5xl font-black text-white focus:border-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Botão Salvar dentro do Palpite */}
              <div className="mt-auto w-full flex flex-col gap-3">
                <button 
                  onClick={generateShareImage}
                  disabled={loading}
                  className="w-full py-4 bg-yellow-400 text-black font-black rounded-2xl flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? 'GERANDO...' : <><Download size={18}/> FINALIZAR E COMPARTILHAR</>}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SHARE (TELA FINAL) */}
        {step === 'share' && finalImageUri && (
          <motion.div key="share" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-20 p-6 flex flex-col items-center justify-center min-h-screen bg-black">
             <div className="w-full max-w-sm">
                <img src={finalImageUri} className="w-full rounded-[32px] shadow-[0_0_40px_rgba(245,196,0,0.2)] mb-8" alt="Seu Palpite" />
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button onClick={() => {
                    const link = document.createElement('a');
                    link.download = 'palpite-tigre.png';
                    link.href = finalImageUri;
                    link.click();
                  }} className="flex flex-col items-center gap-2 p-4 bg-zinc-900 rounded-2xl border border-white/10">
                    <Download size={24} className="text-yellow-400" />
                    <span className="text-[10px] font-black">SALVAR</span>
                  </button>
                  <button className="flex flex-col items-center gap-2 p-4 bg-zinc-900 rounded-2xl border border-white/10">
                    <Share2 size={24} className="text-cyan-400" />
                    <span className="text-[10px] font-black">INSTAGRAM</span>
                  </button>
                </div>

                <button 
                  onClick={() => setStep('arena')}
                  className="w-full py-4 bg-zinc-800 text-white font-black rounded-2xl text-xs tracking-widest"
                >
                  VOLTAR PARA A ARENA
                </button>
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
