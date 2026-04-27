'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

const BASE_STORAGE   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO_DEFAULT = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const AVAI_LOGO      = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png';

const TABLE          = 'tigre_fc_escalacoes';
const PROFILE_TABLE  = 'tigre_fc_usuarios';
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

interface EscalacaoFormacaoProps {
  jogoId?: number | string;
  mandante?: string;
  mandanteLogo?: string;
  rodada?: string | number;
}

type SlotCoord = { x: number; y: number };
type SlotMap   = Record<string, { player: Player | null; x: number; y: number }>;
type Step      = 'loading' | 'formation' | 'arena' | 'captain' | 'hero' | 'palpite' | 'saving' | 'final';

const formationConfigs: Record<string, Record<string, SlotCoord>> = {
  '4-3-3':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:50,y:48}, m2:{x:30,y:42}, m3:{x:70,y:42}, st:{x:50,y:15}, lw:{x:22,y:22}, rw:{x:78,y:22} },
  '4-4-2':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:35,y:45}, m2:{x:65,y:45}, m3:{x:15,y:38}, m4:{x:85,y:38}, st1:{x:40,y:18}, st2:{x:60,y:18} },
  '3-5-2':   { gk:{x:50,y:85}, cb1:{x:30,y:70}, cb2:{x:50,y:73}, cb3:{x:70,y:70}, lm:{x:15,y:45}, rm:{x:85,y:45}, m1:{x:35,y:50}, m2:{x:65,y:50}, am:{x:50,y:32}, st1:{x:40,y:15}, st2:{x:60,y:15} },
  '4-5-1':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:30,y:48}, m2:{x:50,y:48}, m3:{x:70,y:48}, am1:{x:35,y:30}, am2:{x:65,y:30}, st:{x:50,y:15} },
  '4-2-3-1': { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, v1:{x:40,y:52}, v2:{x:60,y:52}, am:{x:50,y:35}, lw:{x:20,y:28}, rw:{x:80,y:28}, st:{x:50,y:12} },
  '5-3-2':   { gk:{x:50,y:85}, lb:{x:12,y:52}, cb1:{x:30,y:70}, cb2:{x:50,y:73}, cb3:{x:70,y:70}, rb:{x:88,y:52}, m1:{x:50,y:48}, m2:{x:30,y:40}, m3:{x:70,y:40}, st1:{x:42,y:18}, st2:{x:58,y:18} },
};

const PLAYERS_DATA: Player[] = [ /* ... mantenha toda a lista de jogadores que você já tinha ... */ ];

const SLOT_W_MOBILE  = 60;
const SLOT_H_MOBILE  = 86;
const SLOT_W_DESKTOP = 80;
const SLOT_H_DESKTOP = 116;

const POSICOES = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'] as const;
type Posicao = typeof POSICOES[number];

// ====================== COMPONENTES AUXILIARES ======================
// (FutCard e DraggableSlot - mantenha iguais ao que você já tinha)
// Cole aqui os componentes FutCard e DraggableSlot do seu arquivo original se quiser manter exatamente igual.

function FutCard({ player, escalado, pending, onClick, getValidPhotoUrl }: any) {
  // ... seu código original do FutCard ...
  return <></>; // substitua pelo seu código real
}

function DraggableSlot({ ...props }: any) {
  // ... seu código original do DraggableSlot ...
  return <></>; // substitua pelo seu código real
}

// ====================== COMPONENTE PRINCIPAL ======================
export default function EscalacaoFormacao({
  jogoId,
  mandante = 'Avaí',
  mandanteLogo = AVAI_LOGO,
  rodada,
}: EscalacaoFormacaoProps) {

  const router = useRouter();

  const [step, setStep] = useState<Step>('loading');
  const [formation, setFormation] = useState('4-3-3');
  const [slotMap, setSlotMap] = useState<Record<string, { player: Player | null; x: number; y: number }>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [palpiteMandante, setPalpiteMandante] = useState(1);
  const [palpiteVisitante, setPalpiteVisitante] = useState(2);
  const [finalImageUri, setFinalImageUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('TORCEDOR');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [hadSaved, setHadSaved] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);
  const [posFiltro, setPosFiltro] = useState<Posicao>('TODOS');

  const finalCardRef = useRef<HTMLDivElement>(null);
  const arenaRef = useRef<HTMLDivElement>(null);

  const getValidPhotoUrl = useCallback((fotoPath: string) => {
    if (!fotoPath) return ESCUDO_DEFAULT;
    const filename = fotoPath.split('/').pop() || fotoPath;
    return `${BASE_STORAGE}${encodeURIComponent(filename)}`;
  }, []);

  // ... (mantenha todo o useEffect de loadExisting, handleChangeFormation, etc. igual ao seu código original)

  const handlePalpiteChange = (team: 'mandante' | 'visitante', value: number) => {
    if (team === 'mandante') setPalpiteMandante(Math.max(0, Math.min(9, value)));
    else setPalpiteVisitante(Math.max(0, Math.min(9, value)));
  };

  const generateFinalImage = async () => {
    setStep('saving');
    await saveEscalacao(); // sua função original

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
      });
      setFinalImageUri(dataUrl);
      setStep('final');
      setTimeout(() => {
        confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
      }, 400);
    } catch (e) {
      console.error(e);
      alert('Erro ao gerar a imagem. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // ... (mantenha as funções saveEscalacao, shareNative, downloadImage, etc.)

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">

        {/* ... mantenha loading, formation, arena, captain, hero iguais ao seu código original ... */}

        {/* ====================== PALPITE TURBINADO ====================== */}
        {step === 'palpite' && (
          <motion.div
            key="palpite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 relative overflow-hidden bg-zinc-950"
          >
            <div className="absolute inset-0">
              <img src={STADIUM_BG} alt="" className="w-full h-full object-cover opacity-30" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />

            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
              <div className="text-center mb-12">
                <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-3">ETAPA FINAL</div>
                <h1 className="text-5xl font-black italic tracking-[-2px]">SEU PALPITE</h1>
                <p className="text-zinc-400 mt-2">{mandante} × Novorizontino</p>
              </div>

              <div className="flex items-center gap-10 relative">
                {/* Time Mandante */}
                <motion.div animate={{ x: [-6, 6, -6] }} transition={{ duration: 2.5, repeat: Infinity }} className="flex flex-col items-center">
                  <div className="relative">
                    <img src={mandanteLogo} alt={mandante} className="w-28 h-28 object-contain drop-shadow-[0_0_40px_#fbbf24]" />
                  </div>
                  <div className="mt-4 font-black text-xl text-yellow-400">{mandante}</div>
                </motion.div>

                {/* Placar Gigante */}
                <div className="flex flex-col items-center z-20">
                  <div className="flex items-center gap-8 bg-black/90 border-4 border-yellow-400/80 rounded-3xl px-12 py-8 shadow-[0_0_80px_rgba(250,204,21,0.7)]">
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={palpiteMandante}
                      onChange={(e) => handlePalpiteChange('mandante', parseInt(e.target.value) || 0)}
                      className="w-20 bg-transparent text-7xl font-black text-yellow-400 text-center outline-none tabular-nums"
                    />
                    <div className="text-6xl font-black text-yellow-400/60">×</div>
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={palpiteVisitante}
                      onChange={(e) => handlePalpiteChange('visitante', parseInt(e.target.value) || 0)}
                      className="w-20 bg-transparent text-7xl font-black text-cyan-400 text-center outline-none tabular-nums"
                    />
                  </div>
                </div>

                {/* Novorizontino */}
                <motion.div animate={{ x: [6, -6, 6] }} transition={{ duration: 2.5, repeat: Infinity }} className="flex flex-col items-center">
                  <div className="relative">
                    <img src={ESCUDO_DEFAULT} alt="Novorizontino" className="w-28 h-28 object-contain drop-shadow-[0_0_40px_#22d3ee]" />
                  </div>
                  <div className="mt-4 font-black text-xl text-cyan-400">NOVORIZONTINO</div>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateFinalImage}
                disabled={isGenerating}
                className="mt-16 px-16 py-7 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-black text-2xl rounded-3xl shadow-[0_0_70px_rgba(250,204,21,0.8)] disabled:opacity-70"
              >
                {isGenerating ? 'GERANDO ARTE ÉPICA...' : 'CONFIRMAR PALPITE E GERAR ARTE'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Final Card - mantenha ou melhore conforme sua necessidade */}

      </AnimatePresence>
    </div>
  );
}
