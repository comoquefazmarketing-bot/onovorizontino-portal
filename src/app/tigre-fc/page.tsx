'use client';

import React, { useState, useMemo, useEffect, useRef, use } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import FinalCardReveal from '@/components/tigre-fc/FinalCardReveal'; 

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
  { id: 'gk', x: 50, y: 85, pos: 'GOL' },
  { id: 'rb', x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb', x: 18, y: 65, pos: 'LAT' },
  { id: 'm1', x: 50, y: 50, pos: 'MEI' }, { id: 'm2', x: 75, y: 42, pos: 'MEI' }, { id: 'm3', x: 25, y: 42, pos: 'MEI' },
  { id: 'st', x: 50, y: 12, pos: 'ATA' }, { id: 'rw', x: 82, y: 20, pos: 'ATA' }, { id: 'lw', x: 18, y: 20, pos: 'ATA' }
];

type Player = typeof PLAYERS[0];

// --- SUB-COMPONENTES INTERNOS ---

function CampoFifa() {
  return (
    <div className="absolute inset-0 perspective-[2000px]">
      <div className="absolute inset-0 bg-[#1e5c1e] rotateX-[40deg] border-[3px] border-white/30 rounded-xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#246b24]' : ''}`} />
          ))}
        </div>
        <div className="absolute inset-0 opacity-20 bg-repeat" style={{ backgroundImage: `url(${TEXTURA_GRAMADO})` }} />
        <div className="absolute inset-4 border-2 border-white/40" />
        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-white/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/40 rounded-full" />
      </div>
    </div>
  );
}

function PlayerCard({ player, size, isCaptain, isHero, isField }: any) {
  return (
    <div className="relative transition-all" style={{ width: size }}>
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

// --- PÁGINA PRINCIPAL ---

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState('TODOS');
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [specialMode, setSpecialMode] = useState<'CAPTAIN' | 'HERO' | null>(null);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [scoreLocked, setScoreLocked] = useState(false);
  const [showFinalCard, setShowFinalCard] = useState(false);

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
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white p-4 gap-6">
      
      {/* MERCADO (Esquerda) */}
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

      {/* CAMPO E FLUXO (Direita) */}
      <section className="flex-[1.4] flex flex-col items-center">
        <div className={`relative w-full max-w-[550px] aspect-[1/1.3] mb-8 transition-opacity ${specialMode ? 'opacity-50' : 'opacity-100'}`}>
          <CampoFifa />
          <div className="absolute inset-0 z-10">
            {FORMATION_433.map((slot) => {
              const player = lineup[slot.id];
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)} style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all">
                  {player ? (
                    <PlayerCard player={player} size={65} isField isCaptain={captainId === player.id} isHero={heroId === player.id} />
                  ) : (
                    <div className={`w-12 h-16 rounded-lg border-2 border-dashed flex items-center justify-center ${selectedSlot === slot.id ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 bg-black/40'}`}>
                      <span className="text-[10px] font-black text-zinc-600">{slot.pos}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {isFullTeam && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
            {/* CAPITÃO / HERÓI SELECTION */}
            <div className="flex justify-center gap-4">
              <button onClick={() => setSpecialMode('CAPTAIN')} className={`flex-1 p-4 rounded-xl border-2 transition-all ${captainId ? 'border-yellow-500 bg-yellow-500/10' : 'border-zinc-800'}`}>
                <span className="block text-[10px] font-black text-yellow-500 uppercase">Capitão</span>
                <span className="text-xs">{captainPlayer?.short || 'Selecionar'}</span>
              </button>
              <button onClick={() => setSpecialMode('HERO')} className={`flex-1 p-4 rounded-xl border-2 transition-all ${heroId ? 'border-cyan-400 bg-cyan-400/10' : 'border-zinc-800'}`}>
                <span className="block text-[10px] font-black text-cyan-400 uppercase">Herói</span>
                <span className="text-xs">{heroPlayer?.short || 'Selecionar'}</span>
              </button>
            </div>

            {/* PLACAR */}
            {captainId && heroId && (
              <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-4">
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-zinc-500 block">TIGRE</span>
                    <input type="number" value={score.home} onChange={e => setScore({...score, home: parseInt(e.target.value) || 0})} className="bg-black w-16 h-16 text-3xl font-black text-center rounded-xl" />
                  </div>
                  <span className="text-zinc-700 font-black">VS</span>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-zinc-500 block">ADV</span>
                    <input type="number" value={score.away} onChange={e => setScore({...score, away: parseInt(e.target.value) || 0})} className="bg-black w-16 h-16 text-3xl font-black text-center rounded-xl" />
                  </div>
                </div>
                <button onClick={() => { setScoreLocked(true); confetti(); }} className="w-full py-3 bg-white text-black font-black rounded-xl">CRAVAR PALPITE</button>
              </div>
            )}

            <button 
              disabled={!scoreLocked}
              onClick={() => setShowFinalCard(true)}
              className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-widest transition-all ${scoreLocked ? 'bg-yellow-500 text-black shadow-xl scale-105' : 'bg-zinc-800 text-zinc-600 opacity-40'}`}
            >
              Finalizar Escalação →
            </button>
          </motion.div>
        )}
      </section>

      {showFinalCard && (
        <FinalCardReveal 
          lineup={lineup}
          formation="4-3-3"
          captainId={captainId}
          heroId={heroId}
          scoreTigre={score.home}
          scoreAdversario={score.away}
          onClose={() => setShowFinalCard(false)}
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </div>
  );
}
