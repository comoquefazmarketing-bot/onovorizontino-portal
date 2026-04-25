'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ASSETS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

// --- TYPES ---
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step = 'tutorial' | 'formation' | 'arena' | 'summary';
interface Slot { id: string; x: number; y: number; pos: string; label: string; }
interface EscalacaoFormacaoProps { jogoId?: number; }

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
  { id:36, name:'Titi Ortiz', short:'T.Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias', short:'D.Mathias', num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb', x: 85, y: 72, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 78, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 78, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb', x: 15, y: 72, pos: 'LAT', label: 'LE' },
    { id: 'dm1', x: 35, y: 58, pos: 'VOL', label: 'VOL' },
    { id: 'dm2', x: 65, y: 58, pos: 'VOL', label: 'VOL' },
    { id: 'am', x: 50, y: 40, pos: 'MEI', label: 'MEI' },
    { id: 'rw', x: 82, y: 20, pos: 'MEI', label: 'PD' },
    { id: 'lw', x: 18, y: 20, pos: 'MEI', label: 'PE' },
    { id: 'st', x: 50, y: 10, pos: 'ATA', label: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GOL' },
    { id: 'rb', x: 85, y: 72, pos: 'LAT', label: 'LD' },
    { id: 'cb1', x: 62, y: 78, pos: 'ZAG', label: 'ZAG' },
    { id: 'cb2', x: 38, y: 78, pos: 'ZAG', label: 'ZAG' },
    { id: 'lb', x: 15, y: 72, pos: 'LAT', label: 'LE' },
    { id: 'cm1', x: 30, y: 55, pos: 'MEI', label: 'MC' },
    { id: 'cm2', x: 50, y: 58, pos: 'VOL', label: 'VOL' },
    { id: 'cm3', x: 70, y: 55, pos: 'MEI', label: 'MC' },
    { id: 'rw', x: 82, y: 20, pos: 'ATA', label: 'PD' },
    { id: 'st', x: 50, y: 12, pos: 'ATA', label: 'ATA' },
    { id: 'lw', x: 18, y: 20, pos: 'ATA', label: 'PE' },
  ],
};

const POS_COLORS: Record<string, string> = { GOL: '#F5C400', ZAG: '#00F3FF', LAT: '#4FC3F7', VOL: '#BF5FFF', MEI: '#22C55E', ATA: '#FF2D55' };

// ==================== MARKET CARD (Zelo e Respiro) ====================
function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const posColor = POS_COLORS[player.pos] || '#fff';
  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -8 }}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className="relative aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 hover:border-[#F5C400]/50 cursor-pointer shadow-2xl group transition-all duration-300"
    >
      <img 
        src={player.foto} 
        alt={player.short}
        className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-500"
        style={{ objectPosition: 'center 15%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      
      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: posColor }} />
        <p className="text-[10px] font-black uppercase text-white tracking-widest">{player.pos}</p>
      </div>

      <div className="absolute bottom-4 left-4 right-4">
        <p className="text-sm font-black text-white uppercase tracking-tight leading-tight truncate">{player.short}</p>
        <p className="text-xs font-bold text-zinc-400 mt-0.5">#{player.num} • {player.name.split(' ').slice(1).join(' ')}</p>
      </div>
    </motion.div>
  );
}

// ==================== FIELD CARD (Perspectiva e Glow) ====================
function FieldCard({ player, isSelected, onClick, label }: { 
  player: Player | null; 
  isSelected: boolean; 
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative w-[70px] h-[95px] rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-xl
        ${isSelected ? 'border-[#F5C400] shadow-[0_0_30px_rgba(245,196,0,0.6)]' : 'border-white/20 bg-black/50 backdrop-blur-sm'}`}
    >
      {player ? (
        <img 
          src={player.foto} 
          alt={player.short}
          className="absolute inset-0 w-full h-full object-cover scale-125"
          style={{ objectPosition: 'center 15%' }}
        />
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-1 text-white/40">
          <span className="text-3xl font-thin">+</span>
          <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
      )}
      {player && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black to-transparent pt-3 pb-1 text-center">
          <p className="text-white text-[9px] font-black uppercase tracking-tighter drop-shadow-md truncate px-1">{player.short}</p>
        </div>
      )}
    </motion.div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================
export default function EscalacaoFormacao() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<string>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [bench, setBench] = useState<Player[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);

  const slots = useMemo(() => FORMATIONS[formation] || FORMATIONS['4-2-3-1'], [formation]);

  const filteredPlayers = useMemo(() => {
    if (filterPos) return PLAYERS.filter(p => p.pos === filterPos);
    return PLAYERS;
  }, [filterPos]);

  const filledSlots = Object.values(lineup).filter(Boolean).length;

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">

        {step === 'tutorial' && (
          <motion.div key="tut" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="h-screen flex flex-col items-center justify-center p-10 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]">
            <img src={ESCUDO} className="w-28 h-28 mb-10 drop-shadow-[0_0_20px_rgba(245,196,0,0.3)]" alt="Tigre" />
            <h1 className="text-5xl font-black italic text-white tracking-tighter mb-4">TIGRE <span className="text-[#F5C400]">FC</span></h1>
            <p className="text-xl text-zinc-400 mb-12 max-w-sm text-center font-bold">Monte sua escalação ideal e defina o placar do próximo jogo.</p>
            <button onClick={() => setStep('formation')} className="bg-[#F5C400] text-black px-16 py-6 rounded-3xl font-black text-xl shadow-[0_10px_40px_rgba(245,196,0,0.4)] active:scale-95 transition-all">
              INICIAR ESCALAÇÃO ⚽
            </button>
          </motion.div>
        )}

        {step === 'formation' && (
          <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} className="h-screen flex flex-col items-center justify-center p-6 bg-black">
            <img src={ESCUDO} className="w-16 h-16 mb-8 opacity-40" alt="Tigre" />
            <h2 className="text-3xl font-black uppercase italic mb-10 text-zinc-500 tracking-tight">Escolha a Tática</h2>
            <div className="grid grid-cols-2 gap-5 w-full max-w-xl">
              {Object.keys(FORMATIONS).map(f => (
                <motion.button key={f} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} onClick={() => {setFormation(f); setStep('arena');}} className="py-10 bg-zinc-950 border-2 border-zinc-800 hover:border-yellow-500 rounded-3xl font-black text-4xl transition-all shadow-xl">
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#020503]">
            
            {/* --- CAMPO 3D REALISTA (Engine de Perspectiva) --- */}
            <div className="flex-1 relative flex items-center justify-center p-6 overflow-hidden">
              {/* Luzes de Fundo (Stadium Glow) */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#144a2c,transparent)] opacity-60" />
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent blur-3xl pointer-events-none" />

              <div style={{ perspective: '2000px' }} className="relative w-full max-w-[540px]">
                <motion.div 
                  initial={{ rotateX: 30, y: 100 }}
                  animate={{ rotateX: 20, y: 0 }} // Ângulo de Perspectiva Realista
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative aspect-[10/14] bg-[#0a2618] rounded-[60px] border-[14px] border-white/5 shadow-[0_100px_180px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  {/* Gramado e Linhas Oficiais */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_50px,rgba(0,0,0,0.1)_50px,rgba(0,0,0,0.1)_100px)]" />
                  <div className="absolute inset-0 border-4 border-white/20 m-6 rounded-[45px]" />
                  <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-white/30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border-2 border-white/30 rounded-full" />
                  
                  {/* Grande Área */}
                  <div className="absolute top-6 left-[20%] right-[20%] h-[18%] border-2 border-white/30 rounded-b-xl" />
                  <div className="absolute bottom-6 left-[20%] right-[20%] h-[18%] border-2 border-white/30 rounded-t-xl" />

                  {/* Pequena Área */}
                  <div className="absolute top-6 left-[35%] right-[35%] h-[8%] border-2 border-white/30 rounded-b-lg" />
                  <div className="absolute bottom-6 left-[35%] right-[35%] h-[8%] border-2 border-white/30 rounded-t-lg" />

                  {/* Escanteios */}
                  <div className="absolute top-7 left-7 w-6 h-6 border-l-2 border-t-2 border-white/30 rounded-tl-full" />
                  <div className="absolute top-7 right-7 w-6 h-6 border-r-2 border-t-2 border-white/30 rounded-tr-full" />
                  <div className="absolute bottom-7 left-7 w-6 h-6 border-l-2 border-b-2 border-white/30 rounded-bl-full" />
                  <div className="absolute bottom-7 right-7 w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-br-full" />

                  {/* Slots de Jogadores flutuando */}
                  {slots.map((s) => (
                    <div key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${s.x}%`, top: `${s.y}%`, transformStyle: 'preserve-3d' }}>
                      <motion.div animate={activeSlot === s.id ? { y: [0, -10, 0] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <FieldCard player={lineup[s.id] || null} label={s.label} isSelected={activeSlot === s.id} onClick={() => setActiveSlot(s.id)} />
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* --- MERCADO LATERAL (Ousado e com Respiro) --- */}
            <div className="w-full lg:w-[460px] bg-black/80 border-l border-white/5 flex flex-col z-20 backdrop-blur-3xl shadow-[-20px_0_60px_rgba(0,0,0,0.6)]">
              <div className="p-7 border-b border-white/5 bg-zinc-950/40">
                <h3 className="text-[#F5C400] font-black italic text-2xl uppercase tracking-tighter leading-none">Convocação</h3>
                <p className="text-[11px] text-zinc-500 font-bold uppercase mt-1.5 tracking-widest">Selecione para o slot {slots.find(s => s.id === activeSlot)?.label}</p>
              </div>

              {/* Filtros */}
              <div className="flex gap-1.5 p-3.5 overflow-x-auto no-scrollbar bg-black border-b border-white/5">
                {['GOL','LAT','ZAG','VOL','MEI','ATA'].map(pos => (
                  <button key={pos} onClick={() => setFilterPos(filterPos === pos ? null : pos)} className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${filterPos === pos ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                    {pos}
                  </button>
                ))}
              </div>

              {/* Grid de Jogadores - 3 Colunas para ter Respiro */}
              <div className="flex-1 overflow-y-auto p-5 grid grid-cols-3 gap-4 pb-28 content-start">
                <AnimatePresence>
                  {filteredPlayers.map(p => (
                    <MarketCard key={p.id} player={p} onClick={() => handleSelectPlayer(p)} />
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-white/5 bg-zinc-950/60 absolute bottom-0 inset-x-0 lg:relative lg:inset-auto">
                <button onClick={() => setStep('summary')} className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase italic tracking-tighter hover:bg-yellow-500 transition-colors shadow-[0_10px_30px_rgba(255,255,255,0.1)] active:scale-95">
                  Confirmar Time →
                </button>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
