'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- CONFIGURAÇÕES DE IMAGENS E DADOS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const TEXTURA_GRAMADO = 'https://www.transparenttextures.com/patterns/dark-dotted-2.png';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',  short: 'César',     num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',      short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',        num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',  short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',          short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',    short: 'Maykon',     num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',          short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',   short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',         short: 'Patrick',    num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',   short: 'G.Bahia',    num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',       short: 'Carlinhos',  num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',          short: 'Alemão',     num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',     short: 'R.Palm',     num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',        short: 'Alvariño',   num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',   short: 'B.Santana',  num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',      short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',       short: 'L.Naldi',    num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',          short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui', short: 'Bianqui',    num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',         short: 'Juninho',    num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',         short: 'Tavinho',    num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',      short: 'D.Galo',     num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',          short: 'Marlon',     num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',  short: 'Hector',     num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',        short: 'Nogueira',   num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',    short: 'L.Gabriel',  num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',     short: 'J.Kauê',     num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',          short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',  short: 'V.Paiva',    num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',    short: 'H.Borges',   num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',         short: 'Jardiel',    num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',  short: 'N.Careca',   num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',      short: 'T.Ortiz',    num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',   short: 'D.Mathias',  num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',          short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',     num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATION_433 = [
  { id: 'gk', x: 50, y: 85, pos: 'GOL' },
  { id: 'rb', x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb', x: 18, y: 65, pos: 'LAT' },
  { id: 'm1', x: 50, y: 50, pos: 'MEI' }, { id: 'm2', x: 75, y: 42, pos: 'MEI' }, { id: 'm3', x: 25, y: 42, pos: 'MEI' },
  { id: 'st', x: 50, y: 12, pos: 'ATA' }, { id: 'rw', x: 82, y: 20, pos: 'ATA' }, { id: 'lw', x: 18, y: 20, pos: 'ATA' }
];

const RESERVA_SLOTS = ['res1', 'res2', 'res3', 'res4', 'res5'];

type Player = typeof PLAYERS[0];

// --- SUB-COMPONENTE: PALPITE (VIDEO-GAME STYLE) ---
function PalpiteSection({ 
  scoreTigre, scoreAdversario, setScoreTigre, setScoreAdversario, isLocked, setIsLocked 
}: { 
  scoreTigre: number, scoreAdversario: number, setScoreTigre: (v: number) => void, setScoreAdversario: (v: number) => void, isLocked: boolean, setIsLocked: (b: boolean) => void 
}) {
  const x = useMotionValue(200);
  const y = useMotionValue(100);
  const rotateX = useTransform(y, [0, 200], [10, -10]);
  const rotateY = useTransform(x, [0, 400], [-10, 10]);

  const handleLock = () => {
    setIsLocked(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 }, colors: ['#22C55E', '#F5C400'] });
  };

  const ScoreBtn = ({ label, val, set, color }: any) => (
    <div className="flex flex-col items-center gap-3">
      <span className={`text-[10px] font-black uppercase tracking-widest ${color === 'gold' ? 'text-yellow-500' : 'text-zinc-500'}`}>{label}</span>
      <div className="flex items-center gap-4 bg-black/40 p-2 rounded-full border border-white/5">
        <button onClick={() => set(Math.max(0, val - 1))} disabled={isLocked} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center font-black">-</button>
        <span className="text-5xl font-[1000] italic min-w-[60px] text-center drop-shadow-2xl">{val}</span>
        <button onClick={() => set(val + 1)} disabled={isLocked} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center font-black">+</button>
      </div>
    </div>
  );

  return (
    <motion.div 
      style={{ perspective: 1000, rotateX, rotateY }}
      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top); }}
      onMouseLeave={() => { x.set(200); y.set(100); }}
      className={`w-full max-w-[500px] p-8 rounded-[3rem] border-2 transition-all duration-700 bg-zinc-950/90 backdrop-blur-md mb-10
        ${isLocked ? 'border-green-500 shadow-[0_0_50px_rgba(34,197,94,0.3)]' : 'border-zinc-800 shadow-2xl'}`}
    >
      <div className="text-center mb-8">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mb-2">Sistema de Pontos</h2>
        <div className="flex justify-center gap-2">
          <span className="text-2xl font-[1000] italic text-yellow-500">PLACAR EXATO</span>
          <span className="text-2xl font-[1000] italic text-green-500">+15 PTS</span>
        </div>
      </div>

      <div className="flex items-center justify-around mb-10">
        <ScoreBtn label="Tigre FC" val={scoreTigre} set={setScoreTigre} color="gold" />
        <div className="text-zinc-800 font-black italic text-2xl mt-8">VS</div>
        <ScoreBtn label="Oponente" val={scoreAdversario} set={setScoreAdversario} />
      </div>

      {!isLocked ? (
        <button onClick={handleLock} className="w-full py-5 bg-white text-black font-[1000] italic uppercase tracking-widest rounded-2xl hover:bg-yellow-500 transition-all active:scale-95">
          CRAVAR PALPITE →
        </button>
      ) : (
        <div className="w-full py-5 border-2 border-green-500 text-green-500 font-black italic text-center rounded-2xl bg-green-500/10">
          ✓ PALPITE REGISTRADO
        </div>
      )}
    </motion.div>
  );
}

// --- SUB-COMPONENTE: CAPITAO E HEROI ---
function CapitaoEHeroi({ onSelect, captainName, heroName }: { onSelect: (type: 'CAPTAIN' | 'HERO') => void, captainName?: string, heroName?: string }) {
  const [hasClashed, setHasClashed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasClashed(true);
      confetti({ particleCount: 50, spread: 360, origin: { y: 0.6 }, colors: ['#F5C400', '#00F3FF'] });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 min-h-[300px]">
      <AnimatePresence>
        {hasClashed && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-20 mb-6 z-20">
            <h3 className="text-yellow-500 font-[1000] italic uppercase tracking-[0.2em] text-xs">Capitão</h3>
            <h3 className="text-cyan-400 font-[1000] italic uppercase tracking-[0.2em] text-xs">Herói</h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center w-full h-44">
        <motion.button onClick={() => onSelect('CAPTAIN')} initial={{ x: -400, opacity: 0 }} animate={{ x: hasClashed ? -75 : 0, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}
          className={`relative w-28 h-40 rounded-xl border-2 transition-all ${captainName ? 'border-yellow-500 bg-yellow-500/20' : 'border-zinc-800 bg-zinc-900'} hover:scale-110`}>
          <div className="flex flex-col items-center justify-center h-full p-2 text-center uppercase">
            <span className="text-3xl mb-1">©</span>
            <span className="text-[9px] font-black">{captainName || "Selecionar"}</span>
          </div>
        </motion.button>

        <motion.button onClick={() => onSelect('HERO')} initial={{ x: 400, opacity: 0 }} animate={{ x: hasClashed ? 75 : 0, opacity: 1 }} transition={{ type: 'spring', damping: 15 }}
          className={`relative w-28 h-40 rounded-xl border-2 transition-all ${heroName ? 'border-cyan-400 bg-cyan-400/20' : 'border-zinc-800 bg-zinc-900'} hover:scale-110`}>
          <div className="flex flex-col items-center justify-center h-full p-2 text-center uppercase">
            <span className="text-3xl mb-1">⭐</span>
            <span className="text-[9px] font-black">{heroName || "Selecionar"}</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTE: CAMPO FIFA ---
function CampoFifa() {
  return (
    <div className="fifa-field-container">
      <div className="field-tilt">
        <div className="grass-pattern">
          <div className="texture-overlay" />
          {[...Array(10)].map((_, i) => <div key={i} className="grass-stripe-h" />)}
        </div>
        <div className="field-lines">
          <div className="border-lines" />
          <div className="mid-line" />
          <div className="center-circle"><div className="center-point" /></div>
          <div className="penalty-area top"><div className="goal-area" /></div>
          <div className="penalty-area bottom"><div className="goal-area" /></div>
        </div>
      </div>
      <style jsx>{`
        .fifa-field-container { perspective: 2000px; width: 100%; height: 100%; position: absolute; }
        .field-tilt { position: absolute; inset: 0; background: #1e5c1e; transform: rotateX(40deg); transform-style: preserve-3d; box-shadow: 0 20px 50px rgba(0,0,0,0.8); border: 3px solid #fff; border-radius: 12px; overflow: hidden; }
        .grass-pattern { position: absolute; inset: 0; display: flex; flex-direction: column; }
        .texture-overlay { position: absolute; inset: 0; background-image: url(${TEXTURA_GRAMADO}); opacity: 0.2; }
        .grass-stripe-h:nth-child(even) { background-color: #246b24; flex: 1; }
        .grass-stripe-h:nth-child(odd) { flex: 1; }
        .field-lines { position: absolute; inset: 0; opacity: 0.5; }
        .border-lines { position: absolute; inset: 10px; border: 2px solid #fff; }
        .mid-line { position: absolute; top: 50%; left: 10px; right: 10px; height: 2px; background: #fff; }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 80px; height: 80px; border: 2px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); }
        .penalty-area { position: absolute; left: 20%; right: 20%; height: 15%; border: 2px solid #fff; }
        .penalty-area.top { top: 10px; border-top: none; }
        .penalty-area.bottom { bottom: 10px; border-bottom: none; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTE: PLAYER CARD ---
function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: any) {
  return (
    <div className={`relative transition-all ${isSelected ? 'scale-110 z-10' : ''}`} style={{ width: size }}>
      <div className={`bg-zinc-900 rounded-lg overflow-hidden border ${isCaptain ? 'border-yellow-500 shadow-[0_0_15px_rgba(245,196,0,0.5)]' : isHero ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.5)]' : 'border-zinc-800'}`} style={{ height: size * 1.3 }}>
        <img src={player.foto} className="w-full h-full object-cover" style={{ objectPosition: isField ? 'top' : 'center' }} />
        <div className="absolute bottom-0 w-full bg-black/80 py-1 text-center">
          <div className="text-yellow-500 text-[6px] font-black">{player.pos}</div>
          <div className="text-white text-[8px] font-black uppercase truncate px-1">{player.short}</div>
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function TigreFCEscalar() {
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [specialMode, setSpecialMode] = useState<'CAPTAIN' | 'HERO' | null>(null);
  
  // Estados do Placar
  const [scoreTigre, setScoreTigre] = useState(0);
  const [scoreAdversario, setScoreAdversario] = useState(0);
  const [scoreLocked, setScoreLocked] = useState(false);

  const isFullTeam = useMemo(() => FORMATION_433.every(slot => !!lineup[slot.id]), [lineup]);
  const captainPlayer = useMemo(() => Object.values(lineup).find(p => p?.id === captainId), [lineup, captainId]);
  const heroPlayer = useMemo(() => Object.values(lineup).find(p => p?.id === heroId), [lineup, heroId]);

  const handleSlotClick = (slotId: string) => {
    const playerInSlot = lineup[slotId];
    if (specialMode === 'CAPTAIN' && playerInSlot) { setCaptainId(playerInSlot.id); setSpecialMode(null); return; }
    if (specialMode === 'HERO' && playerInSlot) { setHeroId(playerInSlot.id); setSpecialMode(null); return; }
    setSelectedSlot(slotId);
  };

  const handleSelectPlayer = (player: Player) => {
    if (!selectedSlot) return;
    setLineup(prev => ({ ...prev, [selectedSlot]: player }));
    setSelectedSlot(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white p-4 gap-6 overflow-x-hidden">
      
      {/* MERCADO */}
      <section className="flex-1 bg-zinc-900/30 rounded-[40px] p-6 border border-white/5 h-[85vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter">Mercado</h2>
          <select onChange={(e) => setFilterPos(e.target.value)} className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-yellow-500 outline-none">
            <option value="TODOS">TODOS</option>
            <option value="GOL">GOLEIROS</option>
            <option value="ZAG">ZAGUEIROS</option>
            <option value="LAT">LATERAIS</option>
            <option value="MEI">MEIO-CAMPO</option>
            <option value="ATA">ATACANTES</option>
          </select>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar">
          {PLAYERS.filter(p => filterPos === 'TODOS' || p.pos === filterPos).map(p => (
            <div key={p.id} onClick={() => handleSelectPlayer(p)} className="cursor-pointer hover:brightness-125 transition active:scale-95">
              <PlayerCard player={p} size={80} />
            </div>
          ))}
        </div>
      </section>

      {/* CAMPO E FLUXO FINAL */}
      <section className="flex-[1.4] flex flex-col items-center">
        <div className={`relative w-full max-w-[550px] aspect-[1/1.3] mb-8 transition-opacity ${specialMode ? 'opacity-50' : 'opacity-100'}`}>
          <CampoFifa />
          <div className="absolute inset-0 z-10 pointer-events-none">
            {FORMATION_433.map((slot) => {
              const player = lineup[slot.id];
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  className={`absolute pointer-events-auto cursor-pointer -translate-x-1/2 -translate-y-1/2 transition-all ${specialMode && player ? 'animate-pulse scale-125 z-50' : 'hover:scale-110'}`}>
                  {player ? (
                    <PlayerCard player={player} size={65} isField isCaptain={captainId === player.id} isHero={heroId === player.id} />
                  ) : (
                    <div className={`w-12 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center ${selectedSlot === slot.id ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 bg-black/40'}`}>
                      <span className="text-[10px] font-black text-zinc-600">{slot.pos}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FLUXO: SÓ APARECE QUANDO O TIME ESTÁ COMPLETO */}
        {isFullTeam && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
            
            <CapitaoEHeroi 
              onSelect={(mode) => setSpecialMode(mode)} 
              captainName={captainPlayer?.short} 
              heroName={heroPlayer?.short} 
            />

            {captainId && heroId && (
              <PalpiteSection 
                scoreTigre={scoreTigre} 
                scoreAdversario={scoreAdversario} 
                setScoreTigre={setScoreTigre} 
                setScoreAdversario={setScoreAdversario}
                isLocked={scoreLocked}
                setIsLocked={setScoreLocked}
              />
            )}

            <button disabled={!scoreLocked}
              className={`w-full max-w-[400px] py-6 rounded-[2rem] font-[1000] italic uppercase tracking-widest mb-20 transition-all
                ${scoreLocked ? 'bg-yellow-500 text-black shadow-[0_20px_50px_rgba(245,196,0,0.5)] scale-105' : 'bg-zinc-800 text-zinc-600 opacity-40 cursor-not-allowed'}`}>
              Finalizar Escalação Extraordinária →
            </button>
          </motion.div>
        )}
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
