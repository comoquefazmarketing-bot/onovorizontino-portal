'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import FinalCardReveal from './FinalCardReveal'; 

// --- CONFIGURAÇÕES DE IMAGENS E DADOS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const TEXTURA_GRAMADO = 'https://www.transparenttextures.com/patterns/dark-dotted-2.png';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',  short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
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
  { id: 'gk', x: 50, y: 88, pos: 'GOL' },
  { id: 'rb', x: 82, y: 72, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 18, y: 72, pos: 'LAT' },
  { id: 'm1', x: 50, y: 55, pos: 'MEI' }, { id: 'm2', x: 75, y: 48, pos: 'MEI' }, { id: 'm3', x: 25, y: 48, pos: 'MEI' },
  { id: 'st', x: 50, y: 18, pos: 'ATA' }, { id: 'rw', x: 82, y: 25, pos: 'ATA' }, { id: 'lw', x: 18, y: 25, pos: 'ATA' }
];

const RESERVES_SLOTS = [
  { id: 'res1', pos: 'RES' }, { id: 'res2', pos: 'RES' }, { id: 'res3', pos: 'RES' }, { id: 'res4', pos: 'RES' }, { id: 'res5', pos: 'RES' }
];

type Player = typeof PLAYERS[0];

// --- SUB-COMPONENTE: PALPITE ---
function PalpiteSection({ 
  scoreTigre, scoreAdversario, setScoreTigre, setScoreAdversario, isLocked, setIsLocked 
}: any) {
  const handleLock = () => {
    setIsLocked(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.8 }, colors: ['#22C55E', '#F5C400'] });
  };

  return (
    <div className={`w-full max-w-[400px] p-4 rounded-3xl border transition-all bg-zinc-950/90 backdrop-blur-md mb-6
        ${isLocked ? 'border-green-500 shadow-lg' : 'border-zinc-800 shadow-2xl'}`}>
      <div className="flex items-center justify-around gap-4 mb-4">
        <div className="text-center">
            <span className="text-[8px] font-black text-yellow-500 uppercase block mb-1">Tigre</span>
            <input type="number" value={scoreTigre} onChange={(e) => setScoreTigre(Number(e.target.value))} disabled={isLocked}
                   className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl text-3xl font-black text-center outline-none focus:border-yellow-500" />
        </div>
        <div className="text-zinc-700 font-black italic">VS</div>
        <div className="text-center">
            <span className="text-[8px] font-black text-zinc-500 uppercase block mb-1">Oponente</span>
            <input type="number" value={scoreAdversario} onChange={(e) => setScoreAdversario(Number(e.target.value))} disabled={isLocked}
                   className="w-16 h-16 bg-black/40 border border-white/10 rounded-2xl text-3xl font-black text-center outline-none focus:border-zinc-500" />
        </div>
      </div>
      {!isLocked && (
        <button onClick={handleLock} className="w-full py-3 bg-yellow-500 text-black font-black italic text-xs uppercase rounded-xl hover:bg-yellow-400 transition-all">
          CRAVAR PALPITE
        </button>
      )}
    </div>
  );
}

// --- SUB-COMPONENTE: CAPITAO E HEROI (MAIS COMPACTO) ---
function CapitaoEHeroi({ onSelect, captainName, heroName }: any) {
  return (
    <div className="flex gap-4 mb-6">
      <button onClick={() => onSelect('CAPTAIN')} className={`flex flex-col items-center justify-center w-24 h-32 rounded-xl border-2 transition-all ${captainName ? 'border-yellow-500 bg-yellow-500/10' : 'border-zinc-800 bg-zinc-900'} hover:scale-105`}>
        <span className="text-2xl mb-1">©</span>
        <span className="text-[8px] font-black uppercase text-center px-1">{captainName || "CAPITÃO"}</span>
      </button>
      <button onClick={() => onSelect('HERO')} className={`flex flex-col items-center justify-center w-24 h-32 rounded-xl border-2 transition-all ${heroName ? 'border-cyan-400 bg-cyan-400/10' : 'border-zinc-800 bg-zinc-900'} hover:scale-105`}>
        <span className="text-2xl mb-1">⭐</span>
        <span className="text-[8px] font-black uppercase text-center px-1">{heroName || "HERÓI"}</span>
      </button>
    </div>
  );
}

// --- SUB-COMPONENTE: CAMPO FIFA (MELHORADO) ---
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
        .field-tilt { position: absolute; inset: 0; background: #164216; transform: rotateX(15deg); transform-style: preserve-3d; border: 2px solid rgba(255,255,255,0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.9); }
        .grass-pattern { position: absolute; inset: 0; display: flex; flex-direction: column; }
        .texture-overlay { position: absolute; inset: 0; background-image: url(${TEXTURA_GRAMADO}); opacity: 0.1; }
        .grass-stripe-h:nth-child(even) { background-color: #1a4d1a; flex: 1; }
        .grass-stripe-h:nth-child(odd) { flex: 1; }
        .field-lines { position: absolute; inset: 0; opacity: 0.4; pointer-events: none; }
        .border-lines { position: absolute; inset: 15px; border: 2px solid #fff; }
        .mid-line { position: absolute; top: 50%; left: 15px; right: 15px; height: 2px; background: #fff; }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 100px; height: 100px; border: 2px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); }
        .penalty-area { position: absolute; left: 20%; right: 20%; height: 15%; border: 2px solid #fff; }
        .penalty-area.top { top: 15px; border-top: none; }
        .penalty-area.bottom { bottom: 15px; border-bottom: none; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTE: PLAYER CARD ---
function PlayerCard({ player, size, isSelected, isCaptain, isHero }: any) {
  return (
    <div className={`relative transition-all ${isSelected ? 'scale-110 z-10' : ''}`} style={{ width: size }}>
      <div className={`bg-zinc-900 rounded-lg overflow-hidden border ${isCaptain ? 'border-yellow-500 ring-2 ring-yellow-500/50' : isHero ? 'border-cyan-400 ring-2 ring-cyan-400/50' : 'border-zinc-800'}`} style={{ height: size * 1.3 }}>
        <img src={player.foto} className="w-full h-[75%] object-cover" style={{ objectPosition: 'top' }} />
        <div className="absolute bottom-0 w-full bg-black/90 py-1 text-center border-t border-white/5">
          <div className={`text-[6px] font-black ${isCaptain ? 'text-yellow-500' : isHero ? 'text-cyan-400' : 'text-zinc-500'}`}>{player.pos}</div>
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
  const [scoreTigre, setScoreTigre] = useState(0);
  const [scoreAdversario, setScoreAdversario] = useState(0);
  const [scoreLocked, setScoreLocked] = useState(false);
  const [showFinalCard, setShowFinalCard] = useState(false);

  const isFullTeam = useMemo(() => FORMATION_433.every(slot => !!lineup[slot.id]), [lineup]);
  const isFullReserves = useMemo(() => RESERVES_SLOTS.every(slot => !!lineup[slot.id]), [lineup]);
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
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-black text-white p-2 lg:p-6 overflow-hidden">
      
      {/* BARRA LATERAL: MERCADO (GRID COMPACTO) */}
      <section className="w-full lg:w-[320px] bg-zinc-900/40 rounded-[30px] p-4 border border-white/5 flex flex-col mb-4 lg:mb-0">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-black italic uppercase">Mercado</h2>
          <select onChange={(e) => setFilterPos(e.target.value)} className="bg-black border border-zinc-800 rounded-lg px-2 py-1 text-[10px] font-bold text-yellow-500">
            <option value="TODOS">TODOS</option>
            <option value="GOL">GOL</option>
            <option value="ZAG">ZAG</option>
            <option value="LAT">LAT</option>
            <option value="MEI">MEI</option>
            <option value="ATA">ATA</option>
          </select>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 overflow-y-auto pr-1 custom-scrollbar">
          {PLAYERS.filter(p => filterPos === 'TODOS' || p.pos === filterPos).map(p => (
            <div key={p.id} onClick={() => handleSelectPlayer(p)} className="cursor-pointer hover:brightness-125 transition active:scale-95">
              <PlayerCard player={p} size={70} />
            </div>
          ))}
        </div>
      </section>

      {/* ÁREA CENTRAL: CAMPO (FIXO NO VIEWPORT) */}
      <section className="flex-1 relative flex flex-col items-center justify-start lg:justify-center overflow-y-auto lg:overflow-hidden px-2 custom-scrollbar">
        
        <div className="relative w-full max-w-[500px] aspect-[3/4] lg:h-[75vh] mb-6 flex-shrink-0">
          <CampoFifa />
          <div className="absolute inset-0 z-10">
            {FORMATION_433.map((slot) => {
              const player = lineup[slot.id];
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)} 
                     style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                     className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20">
                  {player ? (
                    <PlayerCard player={player} size={55} isCaptain={captainId === player.id} isHero={heroId === player.id} />
                  ) : (
                    <div className={`w-10 h-14 rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${selectedSlot === slot.id ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 bg-black/40'}`}>
                      <span className="text-[8px] font-black text-zinc-600">{slot.pos}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RESERVAS E BOTÕES (EMBAIXO DO CAMPO) */}
        <div className="w-full max-w-[500px] flex flex-col items-center flex-shrink-0 pb-10">
          <div className="flex justify-center gap-2 mb-6 bg-zinc-900/50 p-3 rounded-2xl border border-white/5">
            {RESERVES_SLOTS.map((slot) => {
              const player = lineup[slot.id];
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)} className="cursor-pointer">
                  {player ? <PlayerCard player={player} size={45} /> : <div className="w-10 h-12 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-zinc-700">+</div>}
                </div>
              );
            })}
          </div>

          {isFullTeam && isFullReserves && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full flex flex-col items-center">
              <CapitaoEHeroi onSelect={setSpecialMode} captainName={captainPlayer?.short} heroName={heroPlayer?.short} />
              {captainId && heroId && <PalpiteSection scoreTigre={scoreTigre} setScoreTigre={setScoreTigre} scoreAdversario={scoreAdversario} setScoreAdversario={setScoreAdversario} isLocked={scoreLocked} setIsLocked={setScoreLocked} />}
              <button disabled={!scoreLocked} onClick={() => setShowFinalCard(true)}
                      className={`w-full py-4 rounded-2xl font-black italic uppercase tracking-widest transition-all ${scoreLocked ? 'bg-yellow-500 text-black shadow-xl hover:scale-105' : 'bg-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed'}`}>
                FINALIZAR TIME EXTRAORDINÁRIO →
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {showFinalCard && (
        <FinalCardReveal lineup={lineup} formation={FORMATION_433} captainId={captainId} heroId={heroId} scoreTigre={scoreTigre} scoreAdversario={scoreAdversario} onClose={() => setShowFinalCard(false)} />
      )}

      <style jsx global>{`
        body { overflow: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
