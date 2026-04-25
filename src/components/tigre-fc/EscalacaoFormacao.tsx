'use client';

/**
 * ArenaTigreFC — Engine de Renderização 3D de Escalada
 * FOCO: Replicar IDENTICAMENTE a perspectiva, ângulos, proporções e atmósfera da imagem de referência.
 * JOGABILIDADE: Intuitiva, viciante e imersiva.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ASSETS & CONFIGURAÇÕES GLOBAIS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGREFC.png';

// --- DEFINIÇÃO DE INTERFACES ---
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step = 'tutorial' | 'formation' | 'arena' | 'summary';

interface Slot {
  id: string;
  x: number; // Porcentagem do campo
  y: number; // Porcentagem do campo
  pos: string; // Posição tática (GK, ZAG, etc)
  label: string; // Exibição amigável
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

// ==================== FORMAÇÕES PRINCIPAIS (6 TÁTICAS) ====================
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
  ],
  '3-5-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'cb1', x: 50, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 32, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb3', x: 68, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'rm',  x: 85, y: 48, pos: 'ALA', label: 'AD' },
    { id: 'lm',  x: 15, y: 48, pos: 'ALA', label: 'AE' },
    { id: 'cm1', x: 50, y: 56, pos: 'VOL', label: 'VOL' },
    { id: 'cm2', x: 35, y: 50, pos: 'MEI', label: 'MC' },
    { id: 'cm3', x: 65, y: 50, pos: 'MEI', label: 'MC' },
    { id: 'st1', x: 40, y: 18, pos: 'ATA', label: 'ATA' },
    { id: 'st2', x: 60, y: 18, pos: 'ATA', label: 'ATA' },
  ],
  '3-4-3': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'cb1', x: 50, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 32, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb3', x: 68, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'rm',  x: 80, y: 50, pos: 'MEI', label: 'MD' },
    { id: 'cm1', x: 40, y: 52, pos: 'VOL', label: 'VOL' },
    { id: 'cm2', x: 60, y: 52, pos: 'VOL', label: 'VOL' },
    { id: 'lm',  x: 20, y: 50, pos: 'MEI', label: 'ME' },
    { id: 'rw',  x: 75, y: 18, pos: 'ATA', label: 'PD' },
    { id: 'st',  x: 50, y: 12, pos: 'ATA', label: 'ATA' },
    { id: 'lw',  x: 25, y: 18, pos: 'ATA', label: 'PE' },
  ],
  '5-3-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'cb1', x: 50, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 31, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb3', x: 69, y: 76, pos: 'ZAG', label: 'ZAG' },
    { id: 'rb',  x: 88, y: 70, pos: 'LAT', label: 'LD' },
    { id: 'lb',  x: 12, y: 70, pos: 'LAT', label: 'LE' },
    { id: 'cm1', x: 35, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'cm2', x: 65, y: 52, pos: 'MEI', label: 'MC' },
    { id: 'cm3', x: 50, y: 56, pos: 'VOL', label: 'VOL' },
    { id: 'st1', x: 40, y: 18, pos: 'ATA', label: 'ATA' },
    { id: 'st2', x: 60, y: 18, pos: 'ATA', label: 'ATA' },
  ]
};

// --- CONFIGURAÇÃO DE CORES POR POSIÇÃO (Identidade Visual da Imagem) ---
const POS_COLORS: Record<string, { bg: string; glow: string }> = {
  GOL: { bg: 'bg-[#F5C400]/20', glow: 'shadow-[#F5C400]/50' }, // Amarelo
  ZAG: { bg: 'bg-[#00F3FF]/20', glow: 'shadow-[#00F3FF]/50' }, // Ciano
  LAT: { bg: 'bg-[#00F3FF]/15', glow: 'shadow-[#00F3FF]/30' },
  VOL: { bg: 'bg-[#22C55E]/20', glow: 'shadow-[#22C55E]/50' }, // Verde
  MEI: { bg: 'bg-[#22C55E]/15', glow: 'shadow-[#22C55E]/30' },
  ATA: { bg: 'bg-[#FF2D55]/20', glow: 'shadow-[#FF2D55]/50' }, // Vermelho
};

// ==================== MARKET CARD (Identidade Visual Ousada, sem amontoado) ====================
function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const { bg } = POS_COLORS[player.pos] || { bg: 'bg-zinc-800' };
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative aspect-[3/4] ${bg} rounded-2xl overflow-hidden border border-white/5 hover:border-[#F5C400] cursor-pointer shadow-2xl group transition-all`}
    >
      <img 
        src={player.foto} 
        alt={player.short}
        className="absolute inset-0 w-full h-full object-cover object-top grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent h-20" />
      
      {/* Etiqueta de Posição (igual à imagem de referência) */}
      <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 backdrop-blur-sm">
         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: POS_COLORS[player.pos]?.glow.split(' ')[1] }} />
         <p className="text-[9px] font-black uppercase text-white tracking-widest">{player.pos}</p>
      </div>

      <div className="absolute bottom-3 left-3 right-3 text-center">
        <p className="font-black text-white text-xs uppercase tracking-tight truncate drop-shadow-lg">{player.short}</p>
        <p className="text-[#F5C400] text-[9px] font-mono">Nº {player.num} • {player.name.split(' ').slice(-1)}</p>
      </div>
    </motion.div>
  );
}

// ==================== FIELD CARD (3D IDENTICO À REFERÊNCIA) ====================
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
      // O Card flutua (translateZ) e está deitado (rotateX)
      style={{ transformStyle: 'preserve-3d' }} 
      className={`relative w-[65px] h-[90px] lg:w-[80px] lg:h-[110px] rounded-3xl overflow-hidden border-4 shadow-2xl transition-all duration-300
        ${isSelected ? 'border-[#F5C400] scale-110 shadow-[0_0_40px_#F5C400] ring-4 ring-[#F5C400]/20' : `border-white/30 hover:border-white/60 shadow-xl ${glow}`}
        ${player ? '' : 'cursor-pointer'}`}
    >
      {player ? (
        <img 
          src={player.foto} 
          alt={player.short}
          className="absolute inset-0 w-full h-full object-cover object-top scale-125"
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center bg-black/70 text-yellow-500/40">
           <span className="text-4xl font-light">+</span>
           <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">{label}</span>
        </div>
      )}
      
      {player && (
        <div className="absolute bottom-1inset-x-0 bg-black/80 py-1 text-center backdrop-blur-sm border-t border-white/10">
          <p className="text-white text-[9px] font-black uppercase tracking-widest drop-shadow">{player.short}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function EscalacaoFormacao({ jogoId }: { jogoId?: number }) {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);

  const slots = useMemo(() => FORMATIONS[formation], [formation]);

  const filteredPlayers = useMemo(() => {
    if (filterPos) return PLAYERS.filter(p => p.pos === filterPos);
    return PLAYERS;
  }, [filterPos]);

  const filledSlots = Object.values(lineup).filter(Boolean).length;

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
    setFilterPos(null);
  };

  const finalize = () => {
    if (filledSlots < 11) {
      alert(`Complete sua escalação! (${filledSlots}/11 jogadores)`);
      return;
    }
    // Efeito visual de boom final
    const colors = ['#F5C400', '#00F3FF', '#FF2D55', '#22C55E'];
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.background = colors[Math.floor(Math.random() * colors.length)];
        flash.style.opacity = '0.12';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 250);
      }, i * 60);
    }
    setTimeout(() => setStep('summary'), 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans relative selection:bg-yellow-500">
      <AnimatePresence mode="wait">

        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]">
            <img src={ESCUDO} className="w-32 mb-12 drop-shadow-2xl" alt="Tigre" />
            <h1 className="text-6xl font-black italic tracking-tighter mb-12 text-center uppercase">Selecione sua Tática</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 w-full max-w-4xl">
              {Object.keys(FORMATIONS).map(f => (
                <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFormation(f); setStep('arena'); }}
                  className={`py-10 rounded-3xl font-black text-4xl border-2 transition-all ${formation === f ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_60px_rgba(245,196,0,0.4)]' : 'border-zinc-800 bg-zinc-900 hover:border-white/30'}`}>
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex min-h-screen overflow-hidden">
            
            {/* 🛒 ABA DESLIZANTE DO MERCADO (MOBILE GAVETA, DESKTOP LATERAL) */}
            <AnimatePresence>
              {activeSlot && (
                <motion.div 
                  initial={{ x: 500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 500, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="fixed lg:relative inset-y-0 right-0 w-full lg:w-[480px] bg-black border-l border-white/5 flex flex-col z-[100] backdrop-blur-xl shadow-[-30px_0_70px_rgba(0,0,0,0.8)] overflow-hidden"
                >
                  <div className="p-7 border-b border-white/5 bg-zinc-950 flex justify-between items-center sticky top-0">
                    <div className="leading-tight">
                      <h3 className="text-[#F5C400] font-black italic text-3xl uppercase tracking-tighter">CONVOCAÇÃO TIGRE</h3>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1.5 tracking-widest">Selecione para o slot {slots.find(s => s.id === activeSlot)?.label}</p>
                    </div>
                    <button onClick={() => setActiveSlot(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 text-white/40 hover:text-white transition-colors">✕</button>
                  </div>

                  {/* Filtros de Posição (Visual IDENTICO ao print) */}
                  <div className="flex gap-2 p-4 overflow-x-auto bg-black/50 border-b border-white/10 no-scrollbar">
                    {['TODOS', 'GOL','LAT','ZAG','VOL','MEI','ATA'].map(pos => (
                      <button key={pos} onClick={() => setFilterPos(pos === 'TODOS' ? null : pos)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${filterPos === pos ? 'bg-yellow-500 text-black' : pos === 'TODOS' && !filterPos ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                        {pos}
                      </button>
                    ))}
                  </div>

                  {/* Grid de Jogadores (Sem Amontoado, com Zelo) */}
                  <div className="flex-1 overflow-y-auto p-5 grid grid-cols-2 md:grid-cols-3 gap-5 content-start pb-32">
                    <AnimatePresence>
                      {filteredPlayers.map(p => (
                        <MarketCard key={p.id} player={p} onClick={() => handleSelectPlayer(p)} />
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* --- ESTÁDIO E CAMPO (PERSPECTIVA 3D PROFUNDA IGUAL À REFERÊNCIA) --- */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
               {/* Background Estádio e Neon Campo */}
               <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] scale-105" alt="Arena" />
               <div className="absolute inset-0 bg-black/30" />
               {/* Neon TIGRE FC no gramado (Visual identico à referência) */}
               <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-[180px] font-black italic tracking-tighter uppercase text-yellow-500/10 blur-[2px] z-0 select-none">TIGRE FC</div>
               
               {/* Seletor de Tática (Oculto no print, mas útil aqui) */}
               <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-50 bg-black/70 backdrop-blur-xl p-1.5 rounded-full border border-white/10">
                   {['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3', '5-3-2'].map(f => (
                       <button key={f} onClick={() => setFormation(f)} className={`px-4 py-1.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all ${formation === f ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'text-white/40 hover:text-white'}`}>
                           {f}
                       </button>
                   ))}
               </div>

               {/* CONTAINER DO CAMPO COM PERSPECTIVA ATIVA (O pulo do gato) */}
               <div className="relative w-full h-full" style={{ perspective: '2500px' }}>
                  {/* Inclinação do Gramado (rotateX) */}
                  <motion.div 
                    layout
                    initial={{ rotateX: 30, y: 150 }}
                    animate={{ rotateX: 22, y: 0 }} // Ângulo IDENTICO ao print de referência
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="relative inset-0 w-full h-full z-10"
                    style={{ transformOrigin: 'center center' }}
                  >
                    {/* Efeito Neon Pulsante nas linhas do campo (Central, Grande Área) */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-yellow-500/20 rounded-full blur-[3px]" />
                    </div>

                    {/* Cards posicionados em perspectiva */}
                    <AnimatePresence>
                      {slots.map((s) => {
                        const player = lineup[s.id];
                        // Cálculo de escala baseado na profundidade (Y)
                        // No fundo (perto do gol) são menores (scale: 0.6), na base são maiores (scale: 1.2)
                        const scaleBase = (s.y / 100) * 0.9 + 0.35; 

                        return (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 0, z: -100, rotateX: 90 }} // "Nascendo" da grama
                            animate={{ opacity: 1, z: 0, rotateX: 0 }} // Em pé na grama
                            transition={{ delay: i * 0.05 }}
                            className="absolute z-10"
                            style={{ 
                              left: `${s.x}%`, 
                              top: `${s.y}%`, 
                              transform: 'translate(-50%, -50%)',
                              transformStyle: 'preserve-3d'
                            }}
                          >
                             <motion.div
                                animate={activeSlot === s.id ? { y: [0, -10, 0] } : { y: 0 }} // Efeito visual de glow pulsante
                                transition={{ repeat: Infinity, duration: 2 }}
                             >
                                <FieldCard player={player} slotPos={s.pos} label={s.label} isSelected={activeSlot === s.id} onClick={() => setActiveSlot(s.id)} />
                             </motion.div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </motion.div>
               </div>

               {/* Botão Finalizar (Floating identico à imagem) */}
               <motion.div layout 
                 className={`absolute bottom-6 p-4 rounded-3xl bg-black/60 backdrop-blur-xl border-2 transition-all duration-700 z-40 
                   ${filledSlots === 11 ? 'right-6 border-yellow-500 bg-yellow-500/10' : 'left-1/2 -translate-x-1/2 border-white/10'}`}
               >
                 <div className="flex items-center gap-6">
                   <div className="leading-tight">
                     <p className={`text-4xl font-black italic tracking-tighter uppercase ${filledSlots === 11 ? 'text-white' : 'text-zinc-600'}`}>TIGRE FC</p>
                     <p className={`text-xs font-black uppercase tracking-widest mt-1 ${filledSlots === 11 ? 'text-yellow-500 animate-pulse' : 'text-zinc-700'}`}>Escalados: {filledSlots}/11</p>
                   </div>
                   {filledSlots === 11 && (
                      <button onClick={finalize} className="bg-yellow-500 text-black px-10 py-5 rounded-2xl font-black italic tracking-tighter text-xl hover:scale-105 transition-all shadow-[0_10px_30px_rgba(245,196,0,0.3)]">
                        FINALIZAR ESCALAÇÃO →
                      </button>
                   )}
                 </div>
               </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
