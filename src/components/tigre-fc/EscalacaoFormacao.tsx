'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

// --- CONFIGURAÇÕES DE ASSETS ---
const BASE_STORAGE   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO_DEFAULT = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

const FALLBACK_ESCUDO =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#1a1a1a"/><text x="50" y="55" font-family="Arial" font-size="10" fill="#555" text-anchor="middle">LOGO</text></svg>'
  );

// --- TIPAGEM ---
interface Player {
  id: number;
  apelido: string;
  posicao: string;
  foto: string;
}

interface SlotState {
  player: Player | null;
  x: number;
  y: number;
}

type SlotMap = Record<string, SlotState>;

const formationConfigs: Record<string, Record<string, { x: number; y: number }>> = {
  '4-3-3': { 
    gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, 
    m1:{x:50,y:48}, m2:{x:30,y:42}, m3:{x:70,y:42}, 
    st:{x:50,y:15}, lw:{x:22,y:22}, rw:{x:78,y:22} 
  },
  '4-4-2': { 
    gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, 
    m1:{x:35,y:45}, m2:{x:65,y:45}, m3:{x:15,y:38}, m4:{x:85,y:38}, 
    st1:{x:40,y:18}, st2:{x:60,y:18} 
  },
};

// Helper para garantir que as imagens carregaram antes do print
async function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(imgs.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
  }));
}

export default function EscalacaoFormacao({ jogoId, mandanteLogo, visitanteLogo }: any) {
  const [step, setStep] = useState<'loading' | 'arena' | 'palpite' | 'final'>('loading');
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [palpiteMandante, setPalpiteMandante] = useState(0);
  const [palpiteVisitante, setPalpiteVisitante] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // 1. Carregar Jogadores
  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('jogadores_novorizontino').select('*').order('apelido');
      if (data) setAllPlayers(data);
      
      const initial: SlotMap = {};
      Object.entries(formationConfigs['4-3-3']).forEach(([id, c]) => {
        initial[id] = { player: null, x: c.x, y: c.y };
      });
      setSlotMap(initial);
      setStep('arena');
    }
    load();
  }, []);

  const handleSelect = (p: Player) => {
    if (!activeSlot) return;
    const novo = { ...slotMap };
    // Remove se já estiver em outro lugar
    Object.keys(novo).forEach(k => { if(novo[k].player?.id === p.id) novo[k].player = null; });
    novo[activeSlot].player = p;
    setSlotMap(novo);
    setActiveSlot(null);
  };

  const gerarImagem = async () => {
    if (!cardRef.current) return;
    setIsCapturing(true);
    try {
      await waitForImages(cardRef.current);
      await new Promise(r => setTimeout(r, 400));
      const dataUrl = await htmlToImage.toPng(cardRef.current, { pixelRatio: 2, backgroundColor: '#000' });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'meu-time.png', { type: 'image/png' });
      
      if (navigator.share) {
        await navigator.share({ files: [file], title: 'Tigre FC' });
      } else {
        const a = document.createElement('a'); a.download = 'meu-time.png'; a.href = dataUrl; a.click();
      }
      confetti({ particleCount: 100 });
    } catch (e) {
      alert("Erro ao gerar imagem.");
    } finally {
      setIsCapturing(false);
    }
  };

  if (step === 'loading') return <div className="h-screen bg-black flex items-center justify-center text-[#F5C400] font-black">CARREGANDO...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      
      {step === 'arena' && (
        <div className="pb-32">
          <header className="p-6">
            <h1 className="text-3xl font-black text-[#F5C400] italic">ARENA TIGRE</h1>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Toque nos círculos para escalar</p>
          </header>

          <div className="relative w-full aspect-[3/4] max-w-lg mx-auto bg-zinc-950 overflow-hidden">
            <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-40" />
            {Object.entries(slotMap).map(([id, s]) => (
              <div key={id} onClick={() => setActiveSlot(id)}
                className={`absolute w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer
                  ${activeSlot === id ? 'border-[#F5C400] scale-110 z-50 bg-white/10' : 'border-white/20 bg-black/60'}`}
                style={{ top: `${s.y}%`, left: `${s.x}%`, transform: 'translate(-50%, -50%)' }}>
                {s.player ? (
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src={BASE_STORAGE + s.player.foto} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[7px] text-[#F5C400] font-black text-center">{s.player.apelido}</div>
                  </div>
                ) : <span className="text-[9px] font-bold text-zinc-500">{id}</span>}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {activeSlot && (
              <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
                className="fixed bottom-0 inset-x-0 bg-zinc-900 z-[100] rounded-t-3xl p-6 border-t-2 border-[#F5C400] max-h-[50vh] overflow-y-auto">
                <div className="grid grid-cols-4 gap-4">
                  {allPlayers.map(p => (
                    <button key={p.id} onClick={() => handleSelect(p)} className="flex flex-col items-center">
                      <img src={BASE_STORAGE + p.foto} className="w-12 h-12 rounded-lg object-cover mb-1 border border-zinc-700" />
                      <span className="text-[8px] font-black uppercase text-center">{p.apelido}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black z-40">
            <button onClick={() => setStep('palpite')} className="w-full bg-[#F5C400] text-black h-16 rounded-2xl font-black italic shadow-lg">PRÓXIMO PASSO →</button>
          </div>
        </div>
      )}

      {step === 'palpite' && (
        <div className="p-8 flex flex-col justify-center min-h-screen gap-10">
           <div className="flex items-center justify-around">
              <div className="text-center">
                 <img src={mandanteLogo || ESCUDO_DEFAULT} className="w-20 h-20 mb-4 mx-auto" crossOrigin="anonymous" />
                 <input type="number" value={palpiteMandante} onChange={e=>setPalpiteMandante(Number(e.target.value))} className="w-16 bg-zinc-900 border-2 border-[#F5C400] text-center text-3xl font-black py-2 rounded-xl" />
              </div>
              <span className="text-3xl font-black text-[#F5C400]">X</span>
              <div className="text-center">
                 <img src={visitanteLogo || ESCUDO_DEFAULT} className="w-20 h-20 mb-4 mx-auto" crossOrigin="anonymous" />
                 <input type="number" value={palpiteVisitante} onChange={e=>setPalpiteVisitante(Number(e.target.value))} className="w-16 bg-zinc-900 border-2 border-zinc-700 text-center text-3xl font-black py-2 rounded-xl" />
              </div>
           </div>
           <button onClick={() => setStep('final')} className="bg-[#F5C400] text-black h-20 rounded-3xl font-black text-xl italic shadow-2xl">FINALIZAR E GERAR CARD</button>
        </div>
      )}

      {step === 'final' && (
        <div className="p-6 flex flex-col items-center gap-6">
           <div ref={cardRef} className="bg-zinc-950 p-6 border-4 border-[#F5C400] rounded-[32px] w-full max-w-sm">
              <div className="flex justify-between items-center mb-6">
                 <img src={mandanteLogo || ESCUDO_DEFAULT} className="w-12 h-12" crossOrigin="anonymous" />
                 <div className="text-4xl font-black">{palpiteMandante} - {palpiteVisitante}</div>
                 <img src={visitanteLogo || ESCUDO_DEFAULT} className="w-12 h-12" crossOrigin="anonymous" />
              </div>
              <div className="space-y-1 border-t border-white/10 pt-4">
                 {Object.entries(slotMap).map(([id, s]) => (
                   <div key={id} className="flex justify-between text-[10px] font-bold uppercase italic border-b border-white/5">
                     <span className="text-zinc-500">{id}</span>
                     <span className="text-white">{s.player?.apelido || '---'}</span>
                   </div>
                 ))}
              </div>
           </div>
           <button onClick={gerarImagem} disabled={isCapturing} className="w-full bg-[#F5C400] text-black h-16 rounded-2xl font-black uppercase italic">
             {isCapturing ? 'GERANDO...' : 'PARTILHAR NO WHATSAPP'}
           </button>
           <button onClick={() => setStep('arena')} className="text-zinc-500 font-bold text-xs">← EDITAR ESCALAÇÃO</button>
        </div>
      )}
    </div>
  );
}
