'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO_DEFAULT = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

const TABLE = 'tigre_fc_escalacoes';
const PROFILE_TABLE = 'tigre_fc_usuarios';
const SHARE_BASE_URL = 'https://www.onovorizontino.com.br/tigre-fc/escalar';

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
  ovr?: number;
}

// ... (mantenha todos os outros componentes: FutCard, DraggableSlot, etc. iguais até o final da função principal)

export default function EscalacaoFormacao({
  jogoId,
  mandante = 'Avaí',
  mandanteLogo = 'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png',
  rodada,
}: EscalacaoFormacaoProps) {

  // ... (mantenha todo o estado e lógica anterior igual até o step 'palpite')

  // ====================== NOVA TELA DE PALPITE TURBINADA ======================
  const [palpiteMandante, setPalpiteMandante] = useState(1);
  const [palpiteVisitante, setPalpiteVisitante] = useState(2);

  const handlePalpiteChange = (team: 'mandante' | 'visitante', value: number) => {
    if (team === 'mandante') setPalpiteMandante(Math.max(0, Math.min(9, value)));
    else setPalpiteVisitante(Math.max(0, Math.min(9, value)));
  };

  // ====================== CARD FINAL MELHORADO ======================
  const generateFinalImage = async () => {
    setStep('saving');
    await saveEscalacao();

    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 300));

    if (!finalCardRef.current) {
      setStep('final');
      setIsGenerating(false);
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(finalCardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 3,
        backgroundColor: '#0a0a0a',
        width: finalCardRef.current.offsetWidth * 2,   // Melhor qualidade
        height: finalCardRef.current.offsetHeight * 2,
      });
      setFinalImageUri(dataUrl);
      setStep('final');
      setTimeout(() => triggerCelebration(), 300);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ====================== RENDERIZAÇÃO ======================
  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">

      <AnimatePresence mode="wait">

        {/* ... mantenha loading, formation, arena, captain, hero iguais ... */}

        {/* ====================== PALPITE TURBINADO ====================== */}
        {step === 'palpite' && (
          <motion.div 
            key="palpite" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex-1 relative overflow-hidden bg-zinc-950"
          >
            {/* Background dinâmico com movimento */}
            <div className="absolute inset-0 opacity-30">
              <img src={STADIUM_BG} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 py-8">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-gradient-to-r from-yellow-500/20 to-cyan-500/20 border border-yellow-400/30 rounded-full mb-4">
                  <span className="text-xl">⚔️</span>
                  <span className="font-black text-sm tracking-[4px] text-yellow-400">ÚLTIMA ETAPA</span>
                </div>
                <h1 className="text-5xl font-black italic tracking-tighter mb-2 text-white">SEU PALPITE</h1>
                <p className="text-zinc-400 text-lg">Como termina o jogo?</p>
              </div>

              {/* CHOQUE DOS TIMES */}
              <div className="relative flex items-center justify-center gap-12 mb-12">
                {/* Mandante */}
                <motion.div 
                  animate={{ x: [-8, 8, -8] }} 
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <img src={mandanteLogo} alt={mandante} className="w-24 h-24 object-contain drop-shadow-[0_0_30px_#fbbf24]" />
                    <div className="absolute -inset-6 bg-yellow-400/10 rounded-full blur-xl" />
                  </div>
                  <div className="mt-4 text-xl font-black text-yellow-400 tracking-wider">{mandante}</div>
                </motion.div>

                {/* PLACAR GIGANTE COM GLOW */}
                <div className="flex flex-col items-center relative z-20">
                  <div className="flex items-center gap-6 bg-black/80 backdrop-blur-xl border-4 border-yellow-400/70 rounded-3xl px-10 py-6 shadow-[0_0_60px_rgba(250,204,21,0.6)]">
                    <input 
                      type="number" 
                      min={0} 
                      max={9}
                      value={palpiteMandante}
                      onChange={(e) => handlePalpiteChange('mandante', parseInt(e.target.value) || 0)}
                      className="w-20 bg-transparent text-center text-7xl font-black text-yellow-400 outline-none tabular-nums"
                    />
                    <div className="text-6xl font-black text-yellow-400/70">×</div>
                    <input 
                      type="number" 
                      min={0} 
                      max={9}
                      value={palpiteVisitante}
                      onChange={(e) => handlePalpiteChange('visitante', parseInt(e.target.value) || 0)}
                      className="w-20 bg-transparent text-center text-7xl font-black text-cyan-400 outline-none tabular-nums"
                    />
                  </div>
                  <div className="mt-3 text-xs font-black tracking-[3px] text-yellow-500">SEU PALPITE FINAL</div>
                </div>

                {/* Visitante */}
                <motion.div 
                  animate={{ x: [8, -8, 8] }} 
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <img src={ESCUDO_DEFAULT} alt="Novorizontino" className="w-24 h-24 object-contain drop-shadow-[0_0_30px_#22d3ee]" />
                    <div className="absolute -inset-6 bg-cyan-400/10 rounded-full blur-xl" />
                  </div>
                  <div className="mt-4 text-xl font-black text-cyan-400 tracking-wider">NOVORIZONTINO</div>
                </motion.div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                onClick={generateFinalImage}
                disabled={isGenerating}
                className="mt-8 px-16 py-7 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black text-2xl rounded-3xl shadow-[0_0_60px_rgba(250,204,21,0.7)] disabled:opacity-70 tracking-widest"
              >
                {isGenerating ? 'GERANDO ARTE ÉPICA...' : 'CONFIRMAR ESCALAÇÃO E GERAR ARTE'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ====================== CARD FINAL MELHORADO ====================== */}
        {step === 'final' && finalImageUri && (
          <motion.div key="final" className="flex-1 flex flex-col items-center justify-center p-4 bg-black overflow-auto">
            <div className="text-green-400 text-sm font-black tracking-widest mb-4">✓ ESCALAÇÃO SALVA NO RANKING</div>

            <div 
              ref={finalCardRef}
              className="relative w-full max-w-[420px] aspect-[9/16] bg-zinc-950 rounded-3xl overflow-hidden border-4 border-yellow-400/60 shadow-2xl"
            >
              <img src={STADIUM_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95" />

              {/* Header */}
              <div className="absolute top-0 left-0 right-0 p-6 z-20">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-yellow-400 text-xs tracking-[4px] font-black">ARENA TIGRE FC</div>
                    <div className="text-3xl font-black italic text-white">MINHA ESCALAÇÃO</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-yellow-400 tabular-nums">{teamOvr}</div>
                    <div className="text-xs -mt-1 text-yellow-400/70">OVR</div>
                  </div>
                </div>
              </div>

              {/* Campo com jogadores */}
              <div className="absolute top-[22%] bottom-[38%] left-0 right-0">
                {Object.entries(slotMap).map(([id, state]) => 
                  state.player && (
                    <div
                      key={id}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${state.x}%`, top: `${state.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                      <div className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shadow-xl ${
                        state.player.id === captainId ? 'border-yellow-400' : 
                        state.player.id === heroId ? 'border-cyan-400' : 'border-white/70'
                      }`}>
                        <img 
                          src={getValidPhotoUrl(state.player.foto)} 
                          alt={state.player.short}
                          className="w-full h-full object-cover"
                        />
                        {(state.player.id === captainId || state.player.id === heroId) && (
                          <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-md ${
                            state.player.id === captainId ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'
                          }`}>
                            {state.player.id === captainId ? 'C' : 'H'}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] font-black text-center mt-1 text-white drop-shadow-md">
                        {state.player.short}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Placar */}
              <div className="absolute bottom-[26%] left-6 right-6 bg-black/90 border border-yellow-400/50 rounded-2xl p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <img src={mandanteLogo} className="w-10 h-10" alt="" />
                    <span className="font-black">{mandante}</span>
                  </div>
                  <div className="text-5xl font-black text-yellow-400 tabular-nums">
                    {palpiteMandante} <span className="text-3xl text-white/50">×</span> {palpiteVisitante}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black">NOVORIZONTINO</span>
                    <img src={ESCUDO_DEFAULT} className="w-10 h-10" alt="" />
                  </div>
                </div>
              </div>

              {/* Capitão e Herói */}
              <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                <div className="flex-1 bg-yellow-400/10 border border-yellow-400/40 rounded-xl p-3">
                  <div className="text-yellow-400 text-xs font-black">👑 CAPITÃO</div>
                  <div className="font-black text-lg">{selectedPlayers.find(p => p.id === captainId)?.short}</div>
                </div>
                <div className="flex-1 bg-cyan-400/10 border border-cyan-400/40 rounded-xl p-3">
                  <div className="text-cyan-400 text-xs font-black">🔥 HERÓI</div>
                  <div className="font-black text-lg">{selectedPlayers.find(p => p.id === heroId)?.short}</div>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="mt-8 w-full max-w-[420px] space-y-3 px-4">
              <button 
                onClick={shareNative} 
                className="w-full py-6 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-black text-xl rounded-3xl shadow-xl"
              >
                📤 COMPARTILHAR AGORA
              </button>

              <div className="grid grid-cols-3 gap-3">
                <button onClick={shareWhatsApp} className="py-4 bg-[#25D366] rounded-2xl font-black">Whats</button>
                <button onClick={shareInstagram} className="py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-black">Insta</button>
                <button onClick={shareX} className="py-4 bg-black border border-white/40 rounded-2xl font-black">𝕏</button>
              </div>

              <button onClick={downloadImage} className="w-full py-4 border border-white/30 rounded-2xl font-black">
                💾 BAIXAR IMAGEM
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
