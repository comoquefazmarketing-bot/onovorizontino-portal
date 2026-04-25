'use client';

import React, { useState, useMemo, useCallback } from 'react';
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
type Step = 'formation' | 'picking' | 'score' | 'reveal';

interface Slot {
  id: string;
  x: number;
  y: number;
  pos: string;
  label: string;
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
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto:FOTO_CARLAO },
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

const POS_COLORS: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#00F3FF', LAT: '#4FC3F7',
  VOL: '#BF5FFF', MEI: '#22C55E', ATA: '#FF2D55',
};

// ==================== CARD DO JOGADOR (FIFA Style) ====================
function FifaPlayerCard({ player, isSelected = false }: { player: Player | null; isSelected?: boolean }) {
  if (!player) {
    return (
      <div className="w-16 h-20 rounded-xl border-2 border-dashed border-white/30 flex items-center justify-center bg-black/40">
        <span className="text-3xl text-white/30">+</span>
      </div>
    );
  }

  const color = POS_COLORS[player.pos] || '#888';

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -6 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 shadow-2xl transition-all duration-300 ${isSelected ? 'border-[#F5C400] scale-110 shadow-[0_0_25px_#F5C400]' : 'border-white/10'}`}
      style={{ borderColor: isSelected ? '#F5C400' : color }}
    >
      <img src={player.foto} alt={player.short} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent h-10" />
      <div className="absolute bottom-1 left-1 right-1 text-center">
        <div className="text-[10px] font-black text-white tracking-widest drop-shadow">{player.short}</div>
      </div>
    </motion.div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================
export default function EscalacaoFormacao() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);

  const slots = useMemo(() => FORMATIONS[formation], [formation]);

  const filteredPlayers = useMemo(() => {
    const targetPos = filterPos || (activeSlot ? slots.find(s => s.id === activeSlot)?.pos : null);
    return targetPos ? PLAYERS.filter(p => p.pos === targetPos) : PLAYERS;
  }, [filterPos, activeSlot, slots]);

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      <AnimatePresence mode="wait">

        {/* STEP 1: SELETOR DE FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div
            key="formation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black"
          >
            <img src={ESCUDO} alt="Tigre" className="w-28 h-28 mb-10 drop-shadow-2xl" />
            <h1 className="text-5xl font-black tracking-[-2px] text-center mb-3">ESCOLHA SUA TÁTICA</h1>
            <p className="text-zinc-400 text-center max-w-xs mb-12">A base do seu sucesso começa aqui</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {Object.keys(FORMATIONS).map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setFormation(f as keyof typeof FORMATIONS);
                    setStep('picking');
                  }}
                  className={`py-8 rounded-2xl font-black text-2xl tracking-tighter border-2 transition-all
                    ${formation === f 
                      ? 'border-[#F5C400] bg-gradient-to-b from-[#1a1200] to-black shadow-[0_0_40px_rgba(245,196,0,0.5)]' 
                      : 'border-white/10 hover:border-white/30 bg-zinc-950/80'}`}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: ARENA MODE - CAMPO + MERCADO */}
        {step === 'picking' && (
          <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
            
            {/* CAMPO 3D (Esquerda) */}
            <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-emerald-950 to-black p-6 lg:p-12">
              <div className="relative w-full max-w-[460px]" style={{ perspective: '1200px' }}>
                <motion.div
                  initial={{ rotateX: 22 }}
                  animate={{ rotateX: 15 }}
                  className="relative w-full aspect-[10/13] bg-[#0a2a18] rounded-[40px] border-[8px] border-white/10 shadow-[0_60px_120px_rgba(0,0,0,0.9)] overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Gramado */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#0f3a22_0,#0f3a22_14px,#0a2a18_14px,#0a2a18_28px)]" />

                  {/* Linhas do campo */}
                  <div className="absolute inset-0 border-2 border-white/20" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30" />

                  {/* Jogadores no campo */}
                  <AnimatePresence mode="popLayout">
                    {slots.map((slot, index) => {
                      const player = lineup[slot.id];
                      return (
                        <motion.div
                          key={`${formation}-${slot.id}`}
                          layoutId={`player-${slot.id}`}
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 25, delay: index * 0.03 }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                          style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                          onClick={() => {
                            setActiveSlot(slot.id);
                            setFilterPos(null);
                          }}
                        >
                          <FifaPlayerCard player={player} isSelected={activeSlot === slot.id} />
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* MERCADO PERSISTENTE (Direita) */}
            <div className="w-full lg:w-[460px] bg-zinc-950 border-l border-white/5 flex flex-col shadow-[-30px_0_60px_rgba(0,0,0,0.8)]">
              <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-black text-[#F5C400]">MERCADO DE JOGADORES</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  {activeSlot 
                    ? `Posição: ${slots.find(s => s.id === activeSlot)?.pos}` 
                    : 'Clique em um slot para filtrar'}
                </p>
              </div>

              {/* Filtros */}
              <div className="flex gap-1 p-3 bg-black border-b border-zinc-800 overflow-x-auto">
                {['GOL','LAT','ZAG','VOL','MEI','ATA'].map(pos => (
                  <button
                    key={pos}
                    onClick={() => setFilterPos(filterPos === pos ? null : pos)}
                    className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      filterPos === pos ? 'bg-[#F5C400] text-black' : 'bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              {/* Grid 4x4 */}
              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredPlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectPlayer(player)}
                      className="relative aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-[#F5C400]/60 cursor-pointer shadow-md"
                    >
                      <img src={player.foto} className="w-full h-full object-cover" alt={player.name} />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent h-12" />
                      <div className="absolute bottom-2 left-2 right-2 text-center">
                        <div className="text-[10px] font-black text-white tracking-widest">{player.short}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
