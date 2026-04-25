'use client';

/**
 * ArenaTigreFC — FULL ENGINE 
 * FOCO: 39 Jogadores, 6 Formações, Perspectiva Reta e UX High-End.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIGURAÇÕES DE ASSETS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

// --- TIPAGEM ---
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step = 'formation' | 'arena' | 'summary';

interface Slot { id: string; x: number; y: number; label: string; pos: string; }

// ==================== LISTA COMPLETA: 39 JOGADORES ====================
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
  { id:36, name:'Titi Ortiz', short:'Titi Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias', short:'D.Mathias', num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ==================== AS 6 FORMAÇÕES TÁTICAS ====================
const FORMATIONS: Record<string, Slot[]> = {
  '4-3-3': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb',  x: 82, y: 68, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb',  x: 18, y: 68, pos: 'LAT', label: 'LE' },
    { id: 'cm1', x: 32, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'cm2', x: 50, y: 55, pos: 'VOL', label: 'VOL' },
    { id: 'cm3', x: 68, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'rw',  x: 80, y: 22, pos: 'ATA', label: 'PD' },
    { id: 'st',  x: 50, y: 15, pos: 'ATA', label: 'ATA' },
    { id: 'lw',  x: 20, y: 22, pos: 'ATA', label: 'PE' },
  ],
  '4-4-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb',  x: 82, y: 68, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb',  x: 18, y: 68, pos: 'LAT', label: 'LE' },
    { id: 'rm',  x: 80, y: 48, pos: 'MEI', label: 'MD' },
    { id: 'cm1', x: 40, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'cm2', x: 60, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'lm',  x: 20, y: 48, pos: 'MEI', label: 'ME' },
    { id: 'st1', x: 42, y: 18, pos: 'ATA', label: 'ATA' },
    { id: 'st2', x: 58, y: 18, pos: 'ATA', label: 'ATA' },
  ],
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb',  x: 82, y: 68, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb',  x: 18, y: 68, pos: 'LAT', label: 'LE' },
    { id: 'dm1', x: 38, y: 58, pos: 'VOL', label: 'VOL' },
    { id: 'dm2', x: 62, y: 58, pos: 'VOL', label: 'VOL' },
    { id: 'am',  x: 50, y: 40, pos: 'MEI', label: 'MEI' },
    { id: 'rw',  x: 82, y: 28, pos: 'MEI', label: 'PD' },
    { id: 'lw',  x: 18, y: 28, pos: 'MEI', label: 'PE' },
    { id: 'st',  x: 50, y: 12, pos: 'ATA', label: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'cb1', x: 50, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 34, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb3', x: 66, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'rm',  x: 85, y: 50, pos: 'MEI', label: 'AD' },
    { id: 'lm',  x: 15, y: 50, pos: 'MEI', label: 'AE' },
    { id: 'cm1', x: 50, y: 60, pos: 'VOL', label: 'VOL' },
    { id: 'cm2', x: 38, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'cm3', x: 62, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'st1', x: 42, y: 18, pos: 'ATA', label: 'ATA' },
    { id: 'st2', x: 58, y: 18, pos: 'ATA', label: 'ATA' },
  ],
  '3-4-3': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'cb1', x: 50, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 34, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb3', x: 66, y: 74, pos: 'ZAG', label: 'ZAG' },
    { id: 'rm',  x: 82, y: 50, pos: 'MEI', label: 'MD' },
    { id: 'cm1', x: 42, y: 55, pos: 'VOL', label: 'VOL' },
    { id: 'cm2', x: 58, y: 55, pos: 'VOL', label: 'VOL' },
    { id: 'lm',  x: 18, y: 50, pos: 'MEI', label: 'ME' },
    { id: 'rw',  x: 78, y: 22, pos: 'ATA', label: 'PD' },
    { id: 'st',  x: 50, y: 15, pos: 'ATA', label: 'ATA' },
    { id: 'lw',  x: 22, y: 22, pos: 'ATA', label: 'PE' },
  ],
  '5-3-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'cb1', x: 50, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 35, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb3', x: 65, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'rb',  x: 85, y: 70, pos: 'LAT', label: 'LD' },
    { id: 'lb',  x: 15, y: 70, pos: 'LAT', label: 'LE' },
    { id: 'cm1', x: 38, y: 54, pos: 'MEI', label: 'MC' },
    { id: 'cm2', x: 62, y: 54, pos: 'MEI', label: 'MC' },
    { id: 'cm3', x: 50, y: 58, pos: 'VOL', label: 'VOL' },
    { id: 'st1', x: 42, y: 18, pos: 'ATA', label: 'ATA' },
    { id: 'st2', x: 58, y: 18, pos: 'ATA', label: 'ATA' },
  ]
};

// ==================== COMPONENTES VISUAIS ====================

function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-yellow-500 cursor-pointer group shadow-2xl"
    >
      <img src={player.foto} className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500" alt={player.short} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent h-1/2" />
      <div className="absolute bottom-2 inset-x-0 text-center px-1">
        <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{player.short}</p>
        <p className="text-yellow-500 text-[8px] font-bold tracking-widest">Nº {player.num}</p>
      </div>
      <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded-md border border-white/10 text-[7px] font-black text-white tracking-widest uppercase">
        {player.pos}
      </div>
    </motion.div>
  );
}

function FieldCard({ player, label, isSelected, onClick }: { 
  player: Player | null; label: string; isSelected: boolean; onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative w-[62px] h-[85px] lg:w-[90px] lg:h-[120px] rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-2xl
        ${isSelected ? 'border-yellow-500 shadow-[0_0_40px_#F5C400] z-50 scale-110' : 'border-white/20 bg-black/60 backdrop-blur-md'}`}
    >
      {player ? (
        <>
          <img src={player.foto} className="absolute inset-0 w-full h-full object-cover object-top" alt={player.short} />
          <div className="absolute bottom-0 inset-x-0 bg-black/80 py-1 text-center border-t border-white/10 backdrop-blur-sm">
            <p className="text-white text-[9px] lg:text-[10px] font-black uppercase tracking-tighter truncate px-1">{player.short}</p>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-yellow-500/30">
          <span className="text-4xl font-light">+</span>
          <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">{label}</span>
        </div>
      )}
    </motion.div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function ArenaFullEngine() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);

  const slots = useMemo(() => FORMATIONS[formation], [formation]);
  const filledCount = Object.values(lineup).filter(Boolean).length;

  const filteredPlayers = useMemo(() => 
    filterPos ? PLAYERS.filter(p => p.pos === filterPos) : PLAYERS
  , [filterPos]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-yellow-500">
      <AnimatePresence mode="wait">
        
        {/* PASSO 1: SELEÇÃO DE TÁTICA */}
        {step === 'formation' && (
          <motion.div key="f-step" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
            <img src={ESCUDO} className="w-24 mb-10 drop-shadow-[0_0_30px_rgba(245,196,0,0.3)]" alt="Tigre" />
            <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter mb-12 text-center uppercase">ESCOLHA O ESQUEMA</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setStep('arena'); }}
                  className="py-10 rounded-3xl font-black text-4xl border-2 border-white/5 bg-zinc-900/40 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all hover:scale-105 active:scale-95 italic">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PASSO 2: ARENA TIGRE FC */}
        {step === 'arena' && (
          <motion.div key="a-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen relative">
            
            {/* DRAWER DO MERCADO */}
            <AnimatePresence>
              {activeSlot && (
                <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="fixed inset-y-0 right-0 w-full lg:w-[450px] bg-black/90 backdrop-blur-3xl border-l border-white/10 z-[100] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.8)]">
                  <div className="p-7 bg-zinc-950 border-b border-white/5 flex justify-between items-center">
                    <div className="leading-none">
                      <h3 className="text-yellow-500 font-black italic text-3xl uppercase tracking-tighter">CONVOCAR</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Slot tático: {slots.find(s => s.id === activeSlot)?.label}</p>
                    </div>
                    <button onClick={() => setActiveSlot(null)} className="w-12 h-12 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all flex items-center justify-center">✕</button>
                  </div>
                  
                  {/* FILTROS DINÂMICOS */}
                  <div className="flex gap-2 p-5 overflow-x-auto no-scrollbar bg-black/40 border-b border-white/5">
                    {['TODOS', 'GOL','ZAG','LAT','VOL','MEI','ATA'].map(pos => (
                      <button key={pos} onClick={() => setFilterPos(pos === 'TODOS' ? null : pos)}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black transition-all whitespace-nowrap border ${filterPos === pos || (pos==='TODOS' && !filterPos) ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(245,196,0,0.4)]' : 'bg-zinc-900/50 text-zinc-500 border-white/5'}`}>
                        {pos}
                      </button>
                    ))}
                  </div>

                  {/* GRID DE JOGADORES */}
                  <div className="flex-1 overflow-y-auto p-5 grid grid-cols-3 gap-4 content-start pb-40">
                    {filteredPlayers.map(p => (
                      <MarketCard key={p.id} player={p} onClick={() => { setLineup(prev => ({ ...prev, [activeSlot]: p })); setActiveSlot(null); }} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* O ESTÁDIO EM PERSPECTIVA RETA */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
               <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105" alt="Arena Background" />
               
               {/* CAMPO DE JOGO */}
               <div className="relative w-full h-full max-w-[1400px] aspect-video">
                  {/* TIGRE FC NEON NO FUNDO */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
                     <h2 className="text-[20vw] font-black italic uppercase tracking-tighter">TIGRE</h2>
                  </div>

                  {/* SLOTS DE POSICIONAMENTO */}
                  {slots.map((s) => (
                    <div key={s.id} className="absolute transition-all duration-700" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}>
                      <FieldCard player={lineup[s.id] || null} label={s.label} isSelected={activeSlot === s.id} onClick={() => setActiveSlot(s.id)} />
                    </div>
                  ))}
               </div>

               {/* CONTROLES INFERIORES */}
               <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-zinc-900/70 backdrop-blur-2xl border border-white/10 p-5 rounded-[2.5rem] flex justify-between items-center shadow-2xl">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center border border-white/10">
                      <img src={ESCUDO} className="w-7 h-7" alt="Logo" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-white text-2xl font-black italic uppercase tracking-tighter leading-none">TIGRE FC</p>
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${filledCount === 11 ? 'text-yellow-500' : 'text-zinc-500'}`}>
                        {filledCount === 11 ? 'TIME COMPLETO' : `ESCALE SEU TIME: ${filledCount}/11`}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep('formation')} className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest border border-white/5 transition-all">TÁTICA</button>
                    {filledCount === 11 && (
                      <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black italic uppercase tracking-tighter text-sm hover:shadow-[0_0_30px_rgba(245,196,0,0.5)] transition-all">
                        AVANÇAR →
                      </motion.button>
                    )}
                  </div>
               </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
