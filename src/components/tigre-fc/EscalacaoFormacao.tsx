'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

// --- SUB-COMPONENTE: CAPITAO E HEROI (ANIMADO) ---
function CapitaoEHeroi({ onSelect, captainName, heroName }: { onSelect: (type: 'CAPTAIN' | 'HERO') => void, captainName?: string, heroName?: string }) {
  const [hasClashed, setHasClashed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasClashed(true);
      const duration = 2000;
      const animationEnd = Date.now() + duration;
      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        confetti({ 
          particleCount: 40, spread: 360, origin: { x: 0.5, y: 0.6 }, 
          colors: ['#F5C400', '#00F3FF', '#FFFFFF'], zIndex: 100 
        });
      }, 300);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6 overflow-hidden min-h-[300px]">
      <AnimatePresence>
        {hasClashed && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-20 mb-6 z-20">
            <h3 className="text-yellow-500 font-[1000] italic uppercase tracking-[0.2em] text-xs drop-shadow-[0_0_10px_#F5C400]">Capitão</h3>
            <h3 className="text-cyan-400 font-[1000] italic uppercase tracking-[0.2em] text-xs drop-shadow-[0_0_10px_#00F3FF]">Herói</h3>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex items-center justify-center w-full h-44">
        <motion.button
          onClick={() => onSelect('CAPTAIN')}
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: hasClashed ? -75 : 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className={`group relative w-28 h-40 rounded-xl border-2 transition-all overflow-hidden
            ${captainName ? 'border-yellow-500 bg-yellow-500/20' : 'border-yellow-500/40 bg-zinc-900'}
            hover:scale-110 hover:shadow-[0_0_30px_rgba(245,196,0,0.4)]`}
        >
          <div className="flex flex-col items-center justify-center h-full p-2 text-center">
            <span className="text-3xl mb-1 drop-shadow-lg">©</span>
            <span className="text-[9px] font-black uppercase leading-tight">{captainName || "Selecionar"}</span>
          </div>
          <div className="absolute -inset-1 bg-yellow-500 blur opacity-10 animate-pulse" />
        </motion.button>

        <motion.button
          onClick={() => onSelect('HERO')}
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: hasClashed ? 75 : 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className={`group relative w-28 h-40 rounded-xl border-2 transition-all overflow-hidden
            ${heroName ? 'border-cyan-400 bg-cyan-400/20' : 'border-cyan-400/40 bg-zinc-900'}
            hover:scale-110 hover:shadow-[0_0_30px_rgba(0,243,255,0.4)]`}
        >
          <div className="flex flex-col items-center justify-center h-full p-2 text-center">
            <span className="text-3xl mb-1 drop-shadow-lg">⭐</span>
            <span className="text-[9px] font-black uppercase leading-tight">{heroName || "Selecionar"}</span>
          </div>
          <div className="absolute -inset-1 bg-cyan-400 blur opacity-10 animate-pulse" />
        </motion.button>

        {!hasClashed && (
          <motion.div exit={{ scale: 3, opacity: 0 }} className="absolute w-16 h-16 bg-white rounded-full blur-2xl z-10" />
        )}
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
          <div className="vertical-stripes-container">
            {[...Array(6)].map((_, i) => <div key={i} className="grass-stripe-v" />)}
          </div>
        </div>
        <div className="field-lines">
          <div className="border-lines" />
          <div className="mid-line" />
          <div className="center-circle"><div className="center-point" /></div>
          <div className="penalty-area top"><div className="goal-area" /><div className="penalty-arc" /></div>
          <div className="penalty-area bottom"><div className="goal-area" /><div className="penalty-arc" /></div>
        </div>
        <div className="lighting-fx" />
      </div>
      <style jsx>{`
        .fifa-field-container { perspective: 2000px; width: 100%; height: 100%; position: absolute; }
        .field-tilt { 
          position: absolute; inset: 0; background: #1e5c1e; border-radius: 12px;
          transform: rotateX(40deg); transform-style: preserve-3d;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8); border: 3px solid #fff; overflow: hidden;
        }
        .grass-pattern { position: absolute; inset: 0; display: flex; flex-direction: column; }
        .texture-overlay { position: absolute; inset: 0; background-image: url(${TEXTURA_GRAMADO}); opacity: 0.2; mix-blend-mode: overlay; }
        .grass-stripe-h { flex: 1; width: 100%; }
        .grass-stripe-h:nth-child(even) { background-color: #246b24; }
        .vertical-stripes-container { position: absolute; inset: 0; display: flex; mix-blend-mode: soft-light; opacity: 0.4; }
        .grass-stripe-v { flex: 1; height: 100%; }
        .grass-stripe-v:nth-child(even) { background-color: rgba(0,0,0,0.4); }
        .field-lines { position: absolute; inset: 0; opacity: 0.7; }
        .border-lines { position: absolute; inset: 10px; border: 2px solid #fff; }
        .mid-line { position: absolute; top: 50%; left: 10px; right: 10px; height: 2px; background: #fff; }
        .center-circle { position: absolute; top: 50%; left: 50%; width: 70px; height: 70px; border: 2px solid #fff; border-radius: 50%; transform: translate(-50%, -50%); }
        .penalty-area { position: absolute; left: 20%; right: 20%; height: 20%; border: 2px solid #fff; }
        .penalty-area.top { top: 10px; border-top: none; }
        .penalty-area.bottom { bottom: 10px; border-bottom: none; transform: rotate(180deg); }
        .lighting-fx { position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1), transparent 70%); pointer-events: none; }
      `}</style>
    </div>
  );
}

// --- SUB-COMPONENTE: PLAYER CARD ---
function PlayerCard({ player, size, isSelected, isCaptain, isHero, isField }: { player: Player, size: number, isSelected?: boolean, isCaptain?: boolean, isHero?: boolean, isField?: boolean }) {
  return (
    <div className={`card-wrapper ${isSelected ? 'selected' : ''}`} style={{ width: size }}>
      <div className={`card-box ${isCaptain ? 'gold-border' : ''} ${isHero ? 'cyan-border' : ''}`} style={{ height: size * 1.3 }}>
        <img src={player.foto} alt={player.short} className="player-img" style={{ objectPosition: isField ? 'right top' : 'left top' }} />
        {isCaptain && <div className="badge cap">C</div>}
        {isHero && <div className="badge star">⭐</div>}
        <div className="card-info">
          <div className="pos">{player.pos}</div>
          <div className="name">{player.short}</div>
        </div>
      </div>
      <style jsx>{`
        .card-wrapper { position: relative; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .selected { transform: scale(1.1) translateY(-5px); z-index: 10; }
        .card-box { background: #111; border-radius: 6px; overflow: hidden; position: relative; width: 100%; border: 1px solid #333; }
        .gold-border { border: 2px solid #F5C400 !important; box-shadow: 0 0 15px rgba(245,196,0,0.5); }
        .cyan-border { border: 2px solid #00F3FF !important; box-shadow: 0 0 15px rgba(0,243,255,0.5); }
        .player-img { width: 100%; height: 100%; object-fit: cover; }
        .badge { position: absolute; top: 3px; right: 3px; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 900; z-index: 20; border: 1.5px solid #000; }
        .cap { background: #F5C400; color: #000; }
        .star { background: #00F3FF; color: #000; }
        .card-info { position: absolute; bottom: 0; width: 100%; background: linear-gradient(to top, #000 40%, transparent); padding: 4px 0; text-align: center; }
        .pos { color: #F5C400; font-size: 7px; font-weight: 900; }
        .name { color: #fff; font-size: 9px; font-weight: 900; text-transform: uppercase; }
      `}</style>
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

  const isFullTeam = useMemo(() => FORMATION_433.every(slot => !!lineup[slot.id]), [lineup]);
  const captainPlayer = useMemo(() => Object.values(lineup).find(p => p?.id === captainId), [lineup, captainId]);
  const heroPlayer = useMemo(() => Object.values(lineup).find(p => p?.id === heroId), [lineup, heroId]);

  const handleSlotClick = (slotId: string) => {
    const playerInSlot = lineup[slotId];
    if (specialMode === 'CAPTAIN' && playerInSlot) {
      setCaptainId(playerInSlot.id);
      setSpecialMode(null);
      return;
    }
    if (specialMode === 'HERO' && playerInSlot) {
      setHeroId(playerInSlot.id);
      setSpecialMode(null);
      return;
    }
    setSelectedSlot(slotId);
  };

  const handleSelectPlayer = (player: Player) => {
    if (!selectedSlot) return;
    setLineup(prev => ({ ...prev, [selectedSlot]: player }));
    setSelectedSlot(null);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#050505] text-white p-4 gap-6 font-sans overflow-x-hidden">
      
      {/* MERCADO */}
      <section className="flex-1 flex flex-col bg-zinc-900/40 rounded-[40px] border border-white/5 p-6 backdrop-blur-xl h-[85vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-[1000] italic uppercase tracking-tighter">Mercado</h2>
          <select onChange={(e) => setFilterPos(e.target.value)} className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs font-bold text-yellow-500">
            <option value="TODOS">TODOS</option>
            <option value="GOL">GOLEIROS</option>
            <option value="ZAG">ZAGUEIROS</option>
            <option value="LAT">LATERAIS</option>
            <option value="MEI">MEIO-CAMPO</option>
            <option value="ATA">ATACANTES</option>
          </select>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 overflow-y-auto custom-scrollbar pr-2">
          {PLAYERS.filter(p => filterPos === 'TODOS' || p.pos === filterPos).map(p => (
            <div key={p.id} onClick={() => handleSelectPlayer(p)} className="cursor-pointer hover:brightness-125 transition active:scale-95">
              <PlayerCard player={p} size={80} />
            </div>
          ))}
        </div>
      </section>

      {/* CAMPO E AÇÕES */}
      <section className="flex-[1.3] flex flex-col items-center">
        <div className={`relative w-full max-w-[550px] aspect-[1/1.3] mb-8 transition-opacity ${specialMode ? 'opacity-80' : 'opacity-100'}`}>
          <CampoFifa />
          <div className="absolute inset-0 z-10 pointer-events-none">
            {FORMATION_433.map((slot) => {
              const player = lineup[slot.id];
              const isChoiceTarget = specialMode && player;
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)}
                  className={`absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all
                    ${isChoiceTarget ? 'animate-pulse-gold scale-125 z-50' : 'hover:scale-110'}`}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                >
                  {player ? (
                    <PlayerCard player={player} size={65} isField isSelected={selectedSlot === slot.id} isCaptain={captainId === player.id} isHero={heroId === player.id} />
                  ) : (
                    <div className={`w-12 h-16 rounded-lg border-2 border-dashed flex flex-col items-center justify-center 
                      ${selectedSlot === slot.id ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 bg-black/40'}`}>
                      <span className="text-[10px] font-black text-zinc-600">{slot.pos}</span>
                      <span className="text-zinc-700">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ⚡ EXPERIÊNCIA EXTRAORDINÁRIA AQUI ⚡ */}
        {isFullTeam && (
          <CapitaoEHeroi 
            onSelect={(mode) => setSpecialMode(mode)}
            captainName={captainPlayer?.short}
            heroName={heroPlayer?.short}
          />
        )}

        {/* RESERVAS */}
        <div className="w-full max-w-[500px] bg-zinc-900/60 rounded-[30px] p-5 border border-white/5 mb-8">
          <div className="flex justify-center gap-3">
            {RESERVA_SLOTS.map(resId => (
              <div key={resId} onClick={() => handleSlotClick(resId)} className="cursor-pointer">
                {lineup[resId] ? (
                  <PlayerCard player={lineup[resId]!} size={50} isField />
                ) : (
                  <div className="w-10 h-14 rounded-lg border-2 border-dashed border-white/5 bg-black/20 flex items-center justify-center">
                    <span className="text-[8px] font-black text-zinc-700">SUB</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button disabled={!isFullTeam || !captainId || !heroId}
          className={`w-full max-w-[350px] font-[1000] italic uppercase py-6 rounded-[2rem] transition-all
            ${(isFullTeam && captainId && heroId) ? 'bg-yellow-500 text-black shadow-[0_20px_50px_rgba(245,196,0,0.4)]' : 'bg-zinc-800 text-zinc-600 opacity-40'}`}
        >
          Confirmar Escalação →
        </button>
      </section>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        @keyframes pulse-gold {
          0%, 100% { filter: brightness(1); transform: translate(-50%, -50%) scale(1); }
          50% { filter: brightness(1.4) drop-shadow(0 0 15px #f5c400); transform: translate(-50%, -50%) scale(1.1); }
        }
        .animate-pulse-gold { animation: pulse-gold 1.2s infinite ease-in-out; }
      `}</style>
    </div>
  );
}
