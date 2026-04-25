'use client';

/**
 * EscalacaoFormacao — Tigre FC PS5/FIFA26 Edition
 * FOCO: Jogabilidade, Usabilidade e Imersão Visual
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- ASSETS & CONFIGURAÇÕES GLOBAIS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

// --- DEFINIÇÃO DE INTERFACES E TIPOS ---
// Corrige o erro do Vercel: o componente agora sabe o que é jogoIdNum
interface EscalacaoFormacaoProps {
  jogoId?: number; 
}

type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step = 'tutorial' | 'formation' | 'arena' | 'summary';
interface Slot { id: string; x: number; y: number; pos: string; label: string; }

// ==================== LISTA DE JOGADORES (39) ====================
const PLAYERS: Player[] = [
  { id:1,  name:'César Augusto',    short:'César',      num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id:2,  name:'Jordi',            short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  { id:3,  name:'João Scapin',      short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  { id:4,  name:'Lucas Ribeiro',    short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id:5,  name:'Lora',             short:'Lora',       num:2,  pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  { id:6,  name:'Castrillón',       short:'Castrillón', num:6,  pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  { id:7,  name:'Arthur Barbosa',   short:'A.Barbosa',  num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id:8,  name:'Sander',           short:'Sander',     num:33, pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
  { id:9,  name:'Maykon Jesus',     short:'Maykon',     num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  { id:10, name:'Dantas',           short:'Dantas',     num:3,  pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  { id:11, name:'Eduardo Brock',    short:'E.Brock',    num:5,  pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  { id:12, name:'Patrick',          short:'Patrick',    num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  { id:13, name:'Gabriel Bahia',    short:'G.Bahia',    num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id:14, name:'Carlinhos',        short:'Carlinhos',  num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  { id:15, name:'Alemão',           short:'Alemão',     num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  { id:16, name:'Renato Palm',      short:'R.Palm',     num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  { id:17, name:'Alvariño',         short:'Alvariño',   num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  { id:18, name:'Bruno Santana',    short:'B.Santana',  num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  { id:19, name:'Luís Oyama',       short:'Oyama',      num:8,  pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  { id:20, name:'Léo Naldi',        short:'L.Naldi',    num:7,  pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  { id:21, name:'Rômulo',           short:'Rômulo',     num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  { id:22, name:'Matheus Bianqui',  short:'Bianqui',    num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id:23, name:'Juninho',          short:'Juninho',    num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  { id:24, name:'Tavinho',          short:'Tavinho',    num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  { id:25, name:'Diego Galo',       short:'D.Galo',     num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  { id:26, name:'Marlon',           short:'Marlon',     num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  { id:27, name:'Hector Bianchi',  short:'Hector',     num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:28, name:'Nogueira',         short:'Nogueira',   num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:29, name:'Luiz Gabriel',     short:'L.Gabriel',  num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:30, name:'Jhones Kauê',      short:'J.Kauê',     num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  { id:31, name:'Robson',           short:'Robson',     num:9,  pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva',   short:'V.Paiva',    num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges',     short:'H.Borges',   num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel',          short:'Jardiel',    num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca',   short:'N.Careca',   num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Titi Ortiz',       short:'T.Ortiz',    num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão',           short:'Carlão',     num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald',     num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ==================== FORMAÇÕES PRINCIPAIS ====================
const FORMATIONS: Record<string, Slot[]> = {
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
};

const POS_COLORS: Record<string, string> = { GOL: '#F5C400', ZAG: '#00F3FF', LAT: '#4FC3F7', VOL: '#BF5FFF', MEI: '#22C55E', ATA: '#FF2D55' };

// ==================== MARKET CARD (REFORÇADO E COM RESPIRO) ====================
function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
  const posColor = POS_COLORS[player.pos] || '#fff';
  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -8 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="relative aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-white/5 hover:border-[#F5C400] cursor-pointer shadow-xl group transition-all"
    >
      <img 
        src={player.foto} 
        alt={player.short}
        className="absolute inset-0 w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
        style={{ objectPosition: 'center 15%' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent h-20" />
      
      <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1.5 backdrop-blur-sm">
         <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: posColor }} />
         <p className="text-[9px] font-black uppercase text-white tracking-widest">{player.pos}</p>
      </div>

      <div className="absolute bottom-3 left-3 right-3 text-center">
        <p className="font-black text-white text-xs uppercase tracking-tight truncate px-1 drop-shadow-lg">{player.short}</p>
        <p className="text-[#F5C400] text-[9px] font-bold">Nº {player.num} • {player.name.split(' ').slice(-1)}</p>
      </div>
    </motion.div>
  );
}

// ==================== FIELD CARD (FIFA STYLE + GLOW) ====================
function FieldCard({ player, isSelected, onClick }: { 
  player: Player | null; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  const color = player ? POS_COLORS[player.pos] : '#ffffff33';
  return (
    <motion.div
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative w-[70px] h-[95px] rounded-3xl overflow-hidden border-4 shadow-2xl transition-all duration-300
        ${isSelected ? 'border-[#F5C400] scale-110 shadow-[0_0_30px_#F5C400]' : 'border-white/30 hover:border-white/60'}
        ${player ? '' : 'cursor-pointer'}`}
      style={{ borderColor: isSelected ? '#F5C400' : color, backgroundColor: player ? 'transparent' : '#000000cc' }}
    >
      {player ? (
        <img 
          src={player.foto} 
          alt={player.short}
          className="absolute inset-0 w-full h-full object-cover scale-125"
          style={{ objectPosition: 'center 15%' }}
        />
      ) : (
        <div className="h-full flex items-center justify-center bg-black/70 text-4xl text-white/30 font-light">+</div>
      )}
      {player && (
        <div className="absolute bottom-1inset-x-0 bg-black/80 py-1 text-center backdrop-blur-sm">
          <p className="text-white text-[9px] font-black uppercase tracking-widest drop-shadow">{player.short}</p>
        </div>
      )}
    </motion.div>
  );
}

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [bench, setBench] = useState<Player[]>([]);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });

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

  // Feedback do jogoId (para usabilidade futura, já declarado)
  useEffect(() => { if(jogoId) console.log("Carregando para jogo:", jogoId); }, [jogoId]);

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-yellow-500">
      <AnimatePresence mode="wait">

        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">
            <img src={ESCUDO} className="w-28 mb-10 drop-shadow-2xl" alt="Tigre" />
            <h1 className="text-5xl font-black italic tracking-tighter mb-10 text-center uppercase">Escolha sua Tática</h1>
            <div className="grid grid-cols-2 gap-5 w-full max-w-xl">
              {Object.keys(FORMATIONS).map(f => (
                <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setFormation(f); setStep('arena'); }}
                  className={`py-8 rounded-3xl font-black text-3xl border-2 transition-all ${formation === f ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_50px_rgba(245,196,0,0.4)]' : 'border-zinc-800 bg-zinc-900'}`}>
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col lg:flex-row h-screen overflow-hidden bg-black/80">
            
            {/* --- CAMPO 3D REALISTA (Engine de Perspectiva) --- */}
            <div className="flex-1 relative flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_100%)]">
              {/* Iluminação Estádio */}
              <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-yellow-500/10 to-transparent blur-3xl pointer-events-none" />
              
              <div style={{ perspective: '2000px' }} className="relative w-full max-w-[540px]">
                <motion.div 
                  initial={{ rotateX: 30, y: 100 }}
                  animate={{ rotateX: 20, y: 0 }} // Ângulo PS5
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="relative aspect-[10/14] bg-[#0a2618] rounded-[60px] border-[14px] border-white/10 shadow-[0_100px_200px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                  {/* Gramado e Linhas Oficiais */}
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#0f3a22_0,#0f3a22_20px,#0a2a18_20px,#0a2a18_40px)]" />
                  <div className="absolute inset-0 border-4 border-white/20 m-6 rounded-[45px]" />
                  <div className="absolute top-1/2 left-6 right-6 h-[2px] bg-white/20 -translate-y-1/2" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/30 rounded-full" />
                  
                  {/* Grande Área */}
                  <div className="absolute top-6 left-[18%] right-[18%] h-[16%] border-2 border-white/30 rounded-b-xl" />
                  <div className="absolute bottom-6 left-[18%] right-[18%] h-[16%] border-2 border-white/30 rounded-t-xl" />

                  {/* Pequena Área */}
                  <div className="absolute top-6 left-[35%] right-[35%] h-[7%] border-2 border-white/30 rounded-b-lg" />
                  <div className="absolute bottom-6 left-[35%] right-[35%] h-[7%] border-2 border-white/30 rounded-t-lg" />

                  {/* Escanteios */}
                  <div className="absolute top-8 left-8 w-6 h-6 border-l-2 border-t-2 border-white/30 rounded-full blur-[2px]" />
                  <div className="absolute top-8 right-8 w-6 h-6 border-r-2 border-t-2 border-white/30 rounded-full blur-[2px]" />
                  <div className="absolute bottom-8 left-8 w-6 h-6 border-l-2 border-b-2 border-white/30 rounded-full blur-[2px]" />
                  <div className="absolute bottom-8 right-8 w-6 h-6 border-r-2 border-b-2 border-white/30 rounded-full blur-[2px]" />

                  {/* Slots flutuantes com Glow */}
                  {slots.map((s) => (
                    <div key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${s.x}%`, top: `${s.y}%`, transformStyle: 'preserve-3d' }}>
                      <motion.div 
                        animate={activeSlot === s.id ? { y: [0, -10, 0] } : {}} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="relative"
                      >
                         {/* Glow pulsante no slot ativo */}
                         {activeSlot === s.id && (
                           <div className="absolute inset-0 bg-yellow-500 rounded-full blur-2xl opacity-40 scale-125" />
                         )}
                         <FieldCard player={lineup[s.id] || null} isSelected={activeSlot === s.id} onClick={() => setActiveSlot(s.id)} />
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* --- MERCADO LATERAL (3 Colunas, Ousado e Respiro) --- */}
            <div className="w-full lg:w-[450px] bg-black border-l border-white/5 flex flex-col z-20 backdrop-blur-3xl shadow-[-20px_0_60px_rgba(0,0,0,0.6)]">
              <div className="p-7 border-b border-white/5 bg-zinc-950/40 flex justify-between items-center">
                <div className="leading-tight">
                  <h3 className="text-[#F5C400] font-black italic text-3xl uppercase tracking-tighter leading-none">CONVOCAÇÃO</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1.5 tracking-widest">Selecione para o slot {slots.find(s => s.id === activeSlot)?.label}</p>
                </div>
                <button onClick={() => setStep('formation')} className="text-zinc-600 font-black text-xs hover:text-white transition-colors">✕</button>
              </div>

              {/* Filtros de Posição */}
              <div className="flex gap-1.5 p-3.5 overflow-x-auto no-scrollbar bg-black border-b border-white/5">
                {['GOL','LAT','ZAG','VOL','MEI','ATA'].map(pos => (
                  <button key={pos} onClick={() => setFilterPos(filterPos === pos ? null : pos)} className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${filterPos === pos ? 'bg-yellow-500 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                    {pos}
                  </button>
                ))}
              </div>

              {/* Grid de Jogadores - 3 Colunas para ter ZELO */}
              <div className="flex-1 overflow-y-auto p-5 grid grid-cols-3 gap-4 content-start pb-32">
                <AnimatePresence>
                  {filteredPlayers.map(p => (
                    <MarketCard key={p.id} player={p} onClick={() => handleSelectPlayer(p)} />
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-6 bg-black border-t border-white/10 mt-auto">
                 <button onClick={() => setStep('formation')} className="w-full bg-white text-black py-4 rounded-xl font-black uppercase italic tracking-widest hover:bg-yellow-500 transition-colors shadow-lg active:scale-95">
                   CONFIRMAR TIME E PLACAR →
                 </button>
              </div>
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
