'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // Ajuste conforme seu path

// ─── ASSETS & CONFIG ────────────────────────────────────────────────────────
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const CAMPO_BG = 'bg-[repeating-linear-gradient(45deg,#0f3a22_0,#0f3a22_20px,#0a2a18_20px,#0a2a18_40px)]';

// ─── TYPES ──────────────────────────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup = Record<string, Player | null>;
type Step = 'formation' | 'arena' | 'summary';

interface Slot { id: string; x: number; y: number; pos: string; label: string }

// ─── DATA (39 JOGADORES) ───────────────────────────────────────────────────
const PLAYERS: Player[] = [
  { id:1, name:'César Augusto', short:'César', num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id:2, name:'Jordi', short:'Jordi', num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  { id:3, name:'João Scapin', short:'Scapin', num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  { id:4, name:'Lucas Ribeiro', short:'Lucas', num:1, pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id:5, name:'Lora', short:'Lora', num:2, pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  { id:6, name:'Castrillón', short:'Castrillón', num:6, pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  { id:7, name:'Arthur Barbosa', short:'A.Barbosa', num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id:8, name:'Sander', short:'Sander', num:33, pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
  { id:9, name:'Maykon Jesus', short:'Maykon', num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  { id:10, name:'Dantas', short:'Dantas', num:3, pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  { id:11, name:'Eduardo Brock', short:'E.Brock', num:5, pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  { id:12, name:'Patrick', short:'Patrick', num:4, pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  { id:13, name:'Gabriel Bahia', short:'G.Bahia', num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id:14, name:'Carlinhos', short:'Carlinhos', num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  { id:15, name:'Alemão', short:'Alemão', num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  { id:16, name:'Renato Palm', short:'R.Palm', num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  { id:17, name:'Alvariño', short:'Alvariño', num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  { id:18, name:'Bruno Santana', short:'B.Santana', num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  { id:19, name:'Luís Oyama', short:'Oyama', num:8, pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  { id:20, name:'Léo Naldi', short:'L.Naldi', num:7, pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  { id:21, name:'Rômulo', short:'Rômulo', num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  { id:22, name:'Matheus Bianqui', short:'Bianqui', num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id:23, name:'Juninho', short:'Juninho', num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  { id:24, name:'Tavinho', short:'Tavinho', num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  { id:25, name:'Diego Galo', short:'D.Galo', num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  { id:26, name:'Marlon', short:'Marlon', num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  { id:27, name:'Hector Bianchi', short:'Hector', num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:28, name:'Nogueira', short:'Nogueira', num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:29, name:'Luiz Gabriel', short:'L.Gabriel', num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:30, name:'Jhones Kauê', short:'J.Kauê', num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  { id:31, name:'Robson', short:'Robson', num:9, pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva', short:'V.Paiva', num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges', short:'H.Borges', num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel', short:'Jardiel', num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca', short:'N.Careca', num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Titi Ortiz', short:'T.Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias', short:'D.Mathias', num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto: BASE+'CARLAO.jpg.webp' }, // Corrigido path
  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT', label: 'RB' },
    { id: 'cb1', x: 62, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'cb2', x: 38, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'lb', x: 18, y: 68, pos: 'LAT', label: 'LB' },
    { id: 'dm1', x: 35, y: 53, pos: 'VOL', label: 'DM' },
    { id: 'dm2', x: 65, y: 53, pos: 'VOL', label: 'DM' },
    { id: 'am', x: 50, y: 37, pos: 'MEI', label: 'AM' },
    { id: 'rw', x: 78, y: 22, pos: 'MEI', label: 'RW' },
    { id: 'lw', x: 22, y: 22, pos: 'MEI', label: 'LW' },
    { id: 'st', x: 50, y: 10, pos: 'ATA', label: 'ST' },
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT', label: 'RB' },
    { id: 'cb1', x: 62, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'cb2', x: 38, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'lb', x: 18, y: 68, pos: 'LAT', label: 'LB' },
    { id: 'cm1', x: 30, y: 52, pos: 'MEI', label: 'CM' },
    { id: 'cm2', x: 50, y: 52, pos: 'VOL', label: 'CM' },
    { id: 'cm3', x: 70, y: 52, pos: 'MEI', label: 'CM' },
    { id: 'rw', x: 78, y: 22, pos: 'ATA', label: 'RW' },
    { id: 'st', x: 50, y: 12, pos: 'ATA', label: 'ST' },
    { id: 'lw', x: 22, y: 22, pos: 'ATA', label: 'LW' },
  ]
};

const POS_COLORS: Record<string, string> = { GOL: '#F5C400', ZAG: '#00F3FF', LAT: '#4FC3F7', VOL: '#BF5FFF', MEI: '#22C55E', ATA: '#FF2D55' };

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function FifaPlayerCard({ player, isSelected, onClick }: { player: Player | null, isSelected: boolean, onClick: () => void }) {
  const color = player ? POS_COLORS[player.pos] : '#ffffff33';
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      onClick={onClick}
      className={`relative w-16 h-20 rounded-xl cursor-pointer border-2 transition-all duration-300 ${isSelected ? 'scale-110 shadow-[0_0_20px_#F5C400]' : 'shadow-xl'}`}
      style={{ borderColor: isSelected ? '#F5C400' : color, backgroundColor: '#00000088' }}
    >
      {player ? (
        <>
          <img src={player.foto} className="w-full h-full object-cover rounded-lg" alt={player.short} />
          <div className="absolute bottom-0 w-full bg-black/80 py-0.5">
            <p className="text-[9px] font-black text-center uppercase tracking-tighter">{player.short}</p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-white/20 text-2xl font-thin">+</div>
      )}
    </motion.div>
  );
}

export default function EscalacaoPremium() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });

  const slots = useMemo(() => FORMATIONS[formation], [formation]);

  const filteredPlayers = useMemo(() => {
    const slot = slots.find(s => s.id === activeSlot);
    const pos = filterPos || slot?.pos;
    return pos ? PLAYERS.filter(p => p.pos === pos) : PLAYERS;
  }, [filterPos, activeSlot, slots]);

  const handleSelect = (p: Player) => {
    if (activeSlot) {
      setLineup(prev => ({ ...prev, [activeSlot]: p }));
      setActiveSlot(null);
      setFilterPos(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col items-center justify-center gap-8">
            <img src={ESCUDO} className="w-24 drop-shadow-[0_0_20px_rgba(245,196,0,0.3)]" alt="Logo" />
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">Escolha a Tática</h1>
            <div className="flex gap-4">
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setStep('arena'); }} 
                  className="px-10 py-6 border-2 border-white/10 rounded-2xl hover:border-yellow-500 font-bold text-2xl transition-all">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: ARENA MODE (O CORAÇÃO DO APP) */}
        {step === 'arena' && (
          <motion.div key="a" initial={{ x: 100 }} animate={{ x: 0 }} className="flex flex-col lg:flex-row h-screen">
            
            {/* CAMPO 3D */}
            <div className="flex-1 relative flex items-center justify-center p-4 bg-gradient-to-b from-emerald-950/20 to-black">
              <div className="relative w-full max-w-md aspect-[10/13] border-[6px] border-white/10 rounded-[40px] overflow-hidden shadow-2xl" 
                   style={{ perspective: '1000px', transform: 'rotateX(10deg)' }}>
                <div className={`absolute inset-0 ${CAMPO_BG}`} />
                <div className="absolute top-1/2 w-full h-px bg-white/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full" />
                
                {slots.map((s) => (
                  <div key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700"
                       style={{ left: `${s.x}%`, top: `${s.y}%` }}>
                    <FifaPlayerCard 
                      player={lineup[s.id] || null} 
                      isSelected={activeSlot === s.id}
                      onClick={() => { setActiveSlot(s.id); setFilterPos(null); }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* MERCADO PERSISTENTE */}
            <div className="w-full lg:w-[420px] bg-zinc-950 border-l border-white/10 flex flex-col">
              <div className="p-6 border-b border-white/5">
                <h2 className="text-yellow-500 font-black text-xl italic uppercase">Mercado Tigre</h2>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                  {['GOL','ZAG','LAT','VOL','MEI','ATA'].map(p => (
                    <button key={p} onClick={() => setFilterPos(p)} 
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${filterPos === p ? 'bg-yellow-500 text-black' : 'bg-white/5 hover:bg-white/10'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-3 content-start">
                <AnimatePresence mode="popLayout">
                  {filteredPlayers.map(p => (
                    <motion.div key={p.id} layout initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} 
                      whileTap={{ scale: 0.9 }} onClick={() => handleSelect(p)}
                      className="relative aspect-[3/4] rounded-lg overflow-hidden border border-white/5 group cursor-pointer">
                      <img src={p.foto} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                      <div className="absolute bottom-0 w-full bg-black/90 p-1">
                        <p className="text-[8px] text-center font-bold truncate">{p.short}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-6 bg-black border-t border-white/10">
                 <button onClick={() => setStep('summary')} className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase italic tracking-tighter hover:bg-yellow-400 transition-colors">
                   Finalizar Escalação
                 </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PLACAR & RESUMO */}
        {step === 'summary' && (
          <motion.div key="s" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="h-screen flex flex-col items-center justify-center p-6 text-center">
            <h2 className="text-5xl font-black mb-8 italic uppercase text-yellow-500">Qual o seu palpite?</h2>
            <div className="flex items-center gap-8 mb-12">
              <div className="flex flex-col items-center">
                <img src={ESCUDO} className="w-20 mb-4" />
                <input type="number" value={score.tigre} onChange={e => setScore({...score, tigre: Number(e.target.value)})} 
                       className="w-24 h-24 bg-white/5 border-2 border-yellow-500 rounded-3xl text-center text-5xl font-black focus:outline-none" />
              </div>
              <span className="text-4xl font-black text-white/20 mt-10">VS</span>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-zinc-800 rounded-full mb-4 flex items-center justify-center text-xs">ADV</div>
                <input type="number" value={score.adv} onChange={e => setScore({...score, adv: Number(e.target.value)})} 
                       className="w-24 h-24 bg-white/5 border-2 border-white/10 rounded-3xl text-center text-5xl font-black focus:outline-none" />
              </div>
            </div>
            <button className="bg-white text-black px-12 py-5 rounded-2xl font-black uppercase italic text-xl hover:scale-105 transition-all">
              Salvar e Compartilhar
            </button>
            <button onClick={() => setStep('arena')} className="mt-6 text-white/40 font-bold hover:text-white transition-colors">Voltar ao campo</button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
