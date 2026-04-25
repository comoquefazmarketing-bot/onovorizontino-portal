'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

type Player = {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
};

type Lineup = Record<string, Player | null>;
type Step = 'tutorial' | 'formation' | 'arena' | 'summary';

interface Slot {
  id: string;
  x: number;
  y: number;
  pos: string;
  label: string;
}

interface EscalacaoFormacaoProps {
  jogoId?: number;
}

// ==================== 39 JOGADORES ====================
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
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ==================== 6 FORMAÇÕES ====================
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
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT', label: 'RB' },
    { id: 'cb1', x: 62, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'cb2', x: 38, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'lb', x: 18, y: 68, pos: 'LAT', label: 'LB' },
    { id: 'rm', x: 78, y: 50, pos: 'MEI', label: 'RM' },
    { id: 'cm1', x: 62, y: 50, pos: 'VOL', label: 'CM' },
    { id: 'cm2', x: 38, y: 50, pos: 'VOL', label: 'CM' },
    { id: 'lm', x: 22, y: 50, pos: 'MEI', label: 'LM' },
    { id: 'st1', x: 38, y: 15, pos: 'ATA', label: 'ST' },
    { id: 'st2', x: 62, y: 15, pos: 'ATA', label: 'ST' },
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },
    { id: 'cb1', x: 35, y: 72, pos: 'ZAG', label: 'CB' },
    { id: 'cb2', x: 50, y: 75, pos: 'ZAG', label: 'CB' },
    { id: 'cb3', x: 65, y: 72, pos: 'ZAG', label: 'CB' },
    { id: 'lwb', x: 15, y: 52, pos: 'LAT', label: 'LWB' },
    { id: 'cm1', x: 30, y: 48, pos: 'MEI', label: 'CM' },
    { id: 'cm2', x: 50, y: 45, pos: 'VOL', label: 'CM' },
    { id: 'cm3', x: 70, y: 48, pos: 'MEI', label: 'CM' },
    { id: 'rwb', x: 85, y: 52, pos: 'LAT', label: 'RWB' },
    { id: 'st1', x: 38, y: 15, pos: 'ATA', label: 'ST' },
    { id: 'st2', x: 62, y: 15, pos: 'ATA', label: 'ST' },
  ],
  '5-3-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },
    { id: 'lb', x: 15, y: 68, pos: 'LAT', label: 'LB' },
    { id: 'cb1', x: 30, y: 72, pos: 'ZAG', label: 'CB' },
    { id: 'cb2', x: 50, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'cb3', x: 70, y: 72, pos: 'ZAG', label: 'CB' },
    { id: 'rb', x: 85, y: 68, pos: 'LAT', label: 'RB' },
    { id: 'cm1', x: 35, y: 48, pos: 'MEI', label: 'CM' },
    { id: 'cm2', x: 50, y: 45, pos: 'VOL', label: 'CM' },
    { id: 'cm3', x: 65, y: 48, pos: 'MEI', label: 'CM' },
    { id: 'st1', x: 38, y: 15, pos: 'ATA', label: 'ST' },
    { id: 'st2', x: 62, y: 15, pos: 'ATA', label: 'ST' },
  ],
  '4-1-4-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT', label: 'RB' },
    { id: 'cb1', x: 62, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'cb2', x: 38, y: 73, pos: 'ZAG', label: 'CB' },
    { id: 'lb', x: 18, y: 68, pos: 'LAT', label: 'LB' },
    { id: 'dm', x: 50, y: 58, pos: 'VOL', label: 'DM' },
    { id: 'lm', x: 22, y: 42, pos: 'MEI', label: 'LM' },
    { id: 'cm', x: 40, y: 40, pos: 'MEI', label: 'CM' },
    { id: 'am', x: 60, y: 38, pos: 'MEI', label: 'AM' },
    { id: 'rm', x: 78, y: 42, pos: 'MEI', label: 'RM' },
    { id: 'st', x: 50, y: 12, pos: 'ATA', label: 'ST' },
  ],
};

// ==================== CARD MERCADO (Foto Esquerda) ====================
function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -6 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="relative aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-[#F5C400] cursor-pointer shadow-xl group"
    >
      <img 
        src={player.foto} 
        alt={player.short}
        className="w-[200%] h-full object-cover transition-all duration-700 group-hover:scale-110"
        style={{ objectPosition: '22% center' }}
      />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent h-20" />
      <div className="absolute bottom-3 left-3 right-3">
        <p className="font-black text-white text-sm">{player.short}</p>
        <p className="text-[#F5C400] text-xs font-mono">{player.pos} • #{player.num}</p>
      </div>
    </motion.div>
  );
}

// ==================== CARD CAMPO (Foto Direita + Campo Realista) ====================
function FieldCard({ player, isSelected, onClick }: { 
  player: Player | null; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.18 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative w-[82px] h-[112px] rounded-3xl overflow-hidden border-4 shadow-2xl cursor-pointer transition-all
        ${isSelected ? 'border-[#F5C400] scale-110 shadow-[0_0_40px_#F5C400]' : 'border-white/30 hover:border-white/60'}`}
    >
      {player ? (
        <img 
          src={player.foto} 
          alt={player.short}
          className="absolute inset-0 w-[190%] h-full object-cover"
          style={{ objectPosition: '78% center' }}
        />
      ) : (
        <div className="h-full flex items-center justify-center bg-black/70 text-5xl text-white/40 font-light">+</div>
      )}
      {player && (
        <div className="absolute bottom-1.5 left-2 right-2 text-center">
          <p className="text-white text-xs font-black drop-shadow">{player.short}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<Step>('tutorial');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [bench, setBench] = useState<Player[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);
  const [score, setScore] = useState({ tigre: 2, adv: 1 });

  const slots = useMemo(() => FORMATIONS[formation], [formation]);

  const filteredPlayers = useMemo(() => {
    const targetPos = filterPos || (activeSlot ? slots.find(s => s.id === activeSlot)?.pos : null);
    return targetPos ? PLAYERS.filter(p => p.pos === targetPos) : PLAYERS;
  }, [filterPos, activeSlot, slots]);

  const filledSlots = Object.values(lineup).filter(Boolean).length;

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    if (lineup[activeSlot] && bench.length < 5) {
      setBench(prev => [...prev, lineup[activeSlot]!]);
    }
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
    setFilterPos(null);
  };

  const triggerExplosion = () => {
    const colors = ['#F5C400', '#00F3FF', '#FF2D55', '#22C55E'];
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.background = colors[Math.floor(Math.random() * colors.length)];
        flash.style.opacity = String(0.12 + Math.random() * 0.15);
        flash.style.pointerEvents = 'none';
        flash.style.zIndex = '9999';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 220);
      }, i * 60);
    }
  };

  const handleFinish = () => {
    if (filledSlots < 11 || bench.length < 5) {
      alert(`Complete os 11 titulares + 5 reservas! (${filledSlots}/11 + ${bench.length}/5)`);
      return;
    }
    triggerExplosion();
    setTimeout(() => setStep('summary'), 900);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      <AnimatePresence mode="wait">

        {/* TUTORIAL */}
        {step === 'tutorial' && (
          <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-black to-zinc-950">
            <img src={ESCUDO} className="w-32 mb-12 drop-shadow-2xl" alt="Tigre" />
            <h1 className="text-6xl font-black italic text-[#F5C400] tracking-tighter">TIGRE FC</h1>
            <p className="text-2xl mt-4 mb-12">Monte seu time como um técnico de verdade!</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('formation')}
              className="bg-[#F5C400] text-black font-black text-xl px-16 py-6 rounded-2xl hover:bg-yellow-400 transition-all active:scale-95"
            >
              COMEÇAR A MONTAR O TIME ⚽
            </motion.button>
          </motion.div>
        )}

        {/* FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">
            <img src={ESCUDO} className="w-28 mb-10" alt="Tigre" />
            <h1 className="text-5xl font-black italic tracking-tighter mb-6">Escolha sua Formação</h1>
            <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
              {Object.keys(FORMATIONS).map(f => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => { setFormation(f as keyof typeof FORMATIONS); setStep('arena'); }}
                  className="py-10 border-2 border-white/10 hover:border-[#F5C400] rounded-3xl font-black text-3xl transition-all hover:bg-white/5"
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ARENA MODE - CAMPO MELHORADO */}
        {step === 'arena' && (
          <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
            {/* CAMPO */}
            <div className="flex-1 flex items-center justify-center bg-[#0a1f14] p-6 relative">
              <div style={{ perspective: '1600px' }} className="relative w-full max-w-[540px]">
                <motion.div 
                  initial={{ rotateX: 22 }}
                  animate={{ rotateX: 14 }}
                  className="relative aspect-[10/13] bg-emerald-950 rounded-[56px] border-[16px] border-white/10 shadow-[0_100px_200px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  {/* Gramado realista */}
                  <div className="absolute inset-0 bg-[radial-gradient(#1f4a32_0.8px,transparent_1px)] bg-[length:28px_28px]" />
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_40%,rgba(255,255,255,0.08)_50%,transparent_60%)]" />

                  {/* Linhas do campo */}
                  <div className="absolute inset-0 border-2 border-white/40" />
                  <div className="absolute top-1/2 left-0 right-0 h-[3px] bg-white/70" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-white/70" />

                  <AnimatePresence mode="popLayout">
                    {slots.map((slot) => (
                      <motion.div
                        key={`${formation}-${slot.id}`}
                        layoutId={`field-${slot.id}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                        onClick={() => setActiveSlot(slot.id)}
                      >
                        <FieldCard 
                          player={lineup[slot.id] || null}
                          isSelected={activeSlot === slot.id}
                          onClick={() => setActiveSlot(slot.id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* MERCADO + BANCO */}
            <div className="w-full lg:w-[480px] bg-zinc-950 border-l border-white/10 flex flex-col">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-[#F5C400] font-black text-2xl">MERCADO TIGRE</h2>
              </div>

              <div className="flex gap-2 p-4 overflow-x-auto bg-black border-b border-white/10">
                {['GOL','LAT','ZAG','VOL','MEI','ATA'].map(pos => (
                  <button
                    key={pos}
                    onClick={() => setFilterPos(filterPos === pos ? null : pos)}
                    className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      filterPos === pos ? 'bg-[#F5C400] text-black' : 'bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              <div className="flex-1 p-5 overflow-y-auto grid grid-cols-3 gap-4">
                <AnimatePresence>
                  {filteredPlayers.map(player => (
                    <MarketCard key={player.id} player={player} onClick={() => handleSelectPlayer(player)} />
                  ))}
                </AnimatePresence>
              </div>

              {/* Banco de Reservas */}
              <div className="p-5 border-t border-white/10 bg-black">
                <p className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Banco de Reservas ({bench.length}/5)</p>
                <div className="flex gap-3 overflow-x-auto pb-4">
                  {bench.map((player, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.1 }} className="w-16 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-white/40">
                      <img src={player.foto} className="w-full h-full object-cover" alt={player.short} />
                    </motion.div>
                  ))}
                  {Array(5 - bench.length).fill(0).map((_, i) => (
                    <div key={i} className="w-16 h-20 flex-shrink-0 rounded-xl border border-dashed border-white/30 flex items-center justify-center text-white/30 text-2xl">
                      +
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-black border-t border-white/10">
                <button
                  onClick={handleFinish}
                  disabled={filledSlots < 11 || bench.length < 5}
                  className={`w-full py-6 rounded-2xl font-black text-xl tracking-widest transition-all ${
                    filledSlots >= 11 && bench.length >= 5 
                      ? 'bg-[#F5C400] text-black hover:bg-yellow-400' 
                      : 'bg-zinc-800 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {filledSlots >= 11 && bench.length >= 5 ? 'FINALIZAR TIME E IR PARA O PALPITE' : `Faltam ${11-filledSlots} titulares + ${5-bench.length} reservas`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY + PALPITE */}
        {step === 'summary' && (
          <motion.div key="summary" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-black to-zinc-950">
            <h2 className="text-5xl font-black italic text-[#F5C400] mb-12">Seu Palpite Final</h2>
            
            <div className="flex items-center gap-16 mb-16">
              <div className="flex flex-col items-center">
                <img src={ESCUDO} className="w-24 mb-6" alt="Tigre" />
                <input
                  type="number"
                  value={score.tigre}
                  onChange={(e) => setScore({ ...score, tigre: Number(e.target.value) })}
                  className="w-32 h-32 bg-zinc-900 border-4 border-[#F5C400] rounded-3xl text-center text-7xl font-black focus:outline-none"
                />
              </div>
              <span className="text-6xl font-light text-white/30">×</span>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-zinc-800 mb-6 flex items-center justify-center text-sm font-bold">ADV</div>
                <input
                  type="number"
                  value={score.adv}
                  onChange={(e) => setScore({ ...score, adv: Number(e.target.value) })}
                  className="w-32 h-32 bg-zinc-900 border-4 border-white/30 rounded-3xl text-center text-7xl font-black focus:outline-none"
                />
              </div>
            </div>

            <button className="bg-white text-black px-20 py-7 rounded-3xl font-black text-2xl hover:bg-yellow-400 transition-all active:scale-95">
              SALVAR E COMPARTILHAR TIME
            </button>

            <button 
              onClick={() => setStep('arena')}
              className="mt-10 text-white/60 hover:text-white transition-colors"
            >
              ← Voltar e editar o time
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
