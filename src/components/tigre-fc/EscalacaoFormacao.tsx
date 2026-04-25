'use client';

/**
 * ArenaTigreFC — Engine de Renderização 3D de Escalada
 * CORREÇÃO: Variável 'i' adicionada ao map para evitar erro de build.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ASSETS & CONFIGURAÇÕES GLOBAIS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGREFC.png';

// --- DEFINIÇÃO DE INTERFACES ---
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step = 'formation' | 'arena' | 'summary';

interface Slot {
  id: string;
  x: number;
  y: number;
  pos: string;
  label: string;
}

// ==================== LISTA DE JOGADORES (39) ====================
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

const FORMATIONS: Record<string, Slot[]> = {
  '4-3-3': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb',  x: 82, y: 70, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb',  x: 18, y: 70, pos: 'LAT', label: 'LE' },
    { id: 'cm1', x: 30, y: 54, pos: 'MEI', label: 'MC' },
    { id: 'cm2', x: 50, y: 56, pos: 'VOL', label: 'VOL' },
    { id: 'cm3', x: 70, y: 54, pos: 'MEI', label: 'MC' },
    { id: 'rw',  x: 78, y: 22, pos: 'ATA', label: 'PD' },
    { id: 'st',  x: 50, y: 12, pos: 'ATA', label: 'ATA' },
    { id: 'lw',  x: 22, y: 22, pos: 'ATA', label: 'PE' },
  ],
  '4-4-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb',  x: 82, y: 70, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb',  x: 18, y: 70, pos: 'LAT', label: 'LE' },
    { id: 'rm',  x: 75, y: 50, pos: 'MEI', label: 'MD' },
    { id: 'cm1', x: 40, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'cm2', x: 60, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'lm',  x: 25, y: 50, pos: 'MEI', label: 'ME' },
    { id: 'st1', x: 40, y: 15, pos: 'ATA', label: 'ATA' },
    { id: 'st2', x: 60, y: 15, pos: 'ATA', label: 'ATA' },
  ],
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb',  x: 82, y: 70, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb',  x: 18, y: 70, pos: 'LAT', label: 'LE' },
    { id: 'dm1', x: 35, y: 56, pos: 'VOL', label: 'VOL' },
    { id: 'dm2', x: 65, y: 56, pos: 'VOL', label: 'VOL' },
    { id: 'am',  x: 50, y: 38, pos: 'MEI', label: 'MEI' },
    { id: 'rw',  x: 78, y: 22, pos: 'MEI', label: 'PD' },
    { id: 'lw',  x: 22, y: 22, pos: 'MEI', label: 'PE' },
    { id: 'st',  x: 50, y: 10, pos: 'ATA', label: 'ATA' },
  ]
};

const POS_COLORS: Record<string, { bg: string; glow: string }> = {
  GOL: { bg: 'bg-[#F5C400]/20', glow: 'shadow-[#F5C400]/50' },
  ZAG: { bg: 'bg-[#00F3FF]/20', glow: 'shadow-[#00F3FF]/50' },
  LAT: { bg: 'bg-[#00F3FF]/15', glow: 'shadow-[#00F3FF]/30' },
  VOL: { bg: 'bg-[#22C55E]/20', glow: 'shadow-[#22C55E]/50' },
  MEI: { bg: 'bg-[#22C55E]/15', glow: 'shadow-[#22C55E]/30' },
  ATA: { bg: 'bg-[#FF2D55]/20', glow: 'shadow-[#FF2D55]/50' },
};

function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const { bg } = POS_COLORS[player.pos] || { bg: 'bg-zinc-800' };
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative aspect-[3/4] ${bg} rounded-2xl overflow-hidden border border-white/5 hover:border-[#F5C400] cursor-pointer shadow-2xl group transition-all`}
    >
      <img src={player.foto} alt={player.short} className="absolute inset-0 w-full h-full object-cover object-top grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent h-20" />
      <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 backdrop-blur-sm">
         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: POS_COLORS[player.pos]?.glow.split(' ')[1] }} />
         <p className="text-[9px] font-black uppercase text-white tracking-widest">{player.pos}</p>
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-center">
        <p className="font-black text-white text-xs uppercase tracking-tight truncate drop-shadow-lg">{player.short}</p>
        <p className="text-[#F5C400] text-[9px] font-mono">Nº {player.num}</p>
      </div>
    </motion.div>
  );
}

function FieldCard({ player, slotPos, label, isSelected, onClick }: { 
  player: Player | null; 
  slotPos: string;
  label: string;
  isSelected: boolean; 
  onClick: () => void;
}) {
  const { glow } = POS_COLORS[slotPos] || POS_COLORS['ZAG'];
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      style={{ transformStyle: 'preserve-3d' }} 
      className={`relative w-[65px] h-[90px] lg:w-[80px] lg:h-[110px] rounded-3xl overflow-hidden border-4 shadow-2xl transition-all duration-300
        ${isSelected ? 'border-[#F5C400] scale-110 shadow-[0_0_40px_#F5C400] ring-4 ring-[#F5C400]/20' : `border-white/30 hover:border-white/60 shadow-xl ${glow}`}`}
    >
      {player ? (
        <img src={player.foto} alt={player.short} className="absolute inset-0 w-full h-full object-cover object-top scale-125" />
      ) : (
        <div className="h-full flex flex-col items-center justify-center bg-black/70 text-yellow-500/40">
           <span className="text-4xl font-light">+</span>
           <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{label}</span>
        </div>
      )}
      {player && (
        <div className="absolute bottom-1 inset-x-0 bg-black/80 py-1 text-center backdrop-blur-sm border-t border-white/10">
          <p className="text-white text-[9px] font-black uppercase tracking-widest drop-shadow">{player.short}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function EscalacaoFormacao() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);

  const slots = useMemo(() => FORMATIONS[formation], [formation]);
  const filteredPlayers = useMemo(() => filterPos ? PLAYERS.filter(p => p.pos === filterPos) : PLAYERS, [filterPos]);
  const filledSlots = Object.values(lineup).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative">
      <AnimatePresence mode="wait">
        {step === 'formation' && (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center justify-center p-6 bg-black">
            <img src={ESCUDO} className="w-32 mb-12" alt="Tigre" />
            <h1 className="text-5xl font-black italic mb-12 text-center uppercase">Tática do Jogo</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-4xl">
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setStep('arena'); }} className="py-10 rounded-3xl font-black text-4xl border-2 border-zinc-800 bg-zinc-900 hover:border-yellow-500 transition-all">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-h-screen">
            {activeSlot && (
              <motion.div initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} className="fixed lg:relative inset-y-0 right-0 w-full lg:w-[480px] bg-black border-l border-white/5 flex flex-col z-[100]">
                <div className="p-7 border-b border-white/5 bg-zinc-950 flex justify-between items-center">
                  <h3 className="text-[#F5C400] font-black italic text-3xl">MERCADO TIGRE</h3>
                  <button onClick={() => setActiveSlot(null)} className="text-white/40">✕</button>
                </div>
                <div className="flex gap-2 p-4 overflow-x-auto bg-black/50 border-b border-white/10">
                  {['TODOS', 'GOL','LAT','ZAG','VOL','MEI','ATA'].map(pos => (
                    <button key={pos} onClick={() => setFilterPos(pos === 'TODOS' ? null : pos)} className={`px-6 py-2 rounded-xl text-xs font-black ${filterPos === pos ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}>{pos}</button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 gap-5">
                  {filteredPlayers.map(p => (
                    <MarketCard key={p.id} player={p} onClick={() => { setLineup(prev => ({ ...prev, [activeSlot]: p })); setActiveSlot(null); }} />
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
               <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]" alt="Arena" />
               <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[150px] font-black italic text-yellow-500/10 z-0">TIGRE FC</div>
               
               <div className="relative w-full h-full" style={{ perspective: '2500px' }}>
                  <motion.div initial={{ rotateX: 30, y: 150 }} animate={{ rotateX: 22, y: 0 }} className="relative w-full h-full z-10">
                    {slots.map((s, i) => ( // ADICIONADO O 'i' AQUI PARA RESOLVER O ERRO DA VERCEL
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, z: -100 }}
                        animate={{ opacity: 1, z: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="absolute"
                        style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)', transformStyle: 'preserve-3d' }}
                      >
                        <FieldCard player={lineup[s.id] || null} slotPos={s.pos} label={s.label} isSelected={activeSlot === s.id} onClick={() => setActiveSlot(s.id)} />
                      </motion.div>
                    ))}
                  </motion.div>
               </div>

               <div className={`absolute bottom-6 p-4 rounded-3xl bg-black/60 backdrop-blur-xl border-2 ${filledSlots === 11 ? 'right-6 border-yellow-500' : 'left-1/2 -translate-x-1/2 border-white/10'}`}>
                 <div className="flex items-center gap-6">
                   <p className="text-4xl font-black italic text-white uppercase">TIGRE FC</p>
                   {filledSlots === 11 && (
                      <button onClick={() => setStep('summary')} className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black text-xl">FINALIZAR</button>
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
