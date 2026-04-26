'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
  foto: string;
}

interface Slot {
  id: string;
  x: number;
  y: number;
  posHint: string;
}

type Step = 'formation' | 'arena' | 'leaders' | 'prediction' | 'reveal';
type LeaderRole = 'CAPTAIN' | 'HERO';

// ==================== PLAYERS DATA ====================
const PLAYERS_DATA: Player[] = [
  { id: 23, name: "Jordi Martins", short: "JORDI", num: 93, pos: "GOL", foto: "JORDI.png" },
  { id: 1, name: "César", short: "CÉSAR", num: 31, pos: "GOL", foto: "CESAR-AUGUSTO.jpg.webp" },
  { id: 22, name: "João Scapin", short: "SCAPIN", num: 12, pos: "GOL", foto: "JOAO-SCAPIN.jpg.webp" },
  { id: 62, name: "Lucas Ribeiro", short: "LUCAS", num: 1, pos: "GOL", foto: "LUCAS-RIBEIRO.jpg.webp" },
  { id: 8, name: "Patrick", short: "PATRICK", num: 4, pos: "ZAG", foto: "PATRICK.jpg.webp" },
  { id: 38, name: "Renato Palm", short: "R. PALM", num: 33, pos: "ZAG", foto: "RENATO-PALM.jpg.webp" },
  { id: 34, name: "Eduardo Brock", short: "BROCK", num: 14, pos: "ZAG", foto: "EDUARDO-BROCK.jpg.webp" },
  { id: 66, name: "Alexis Alvariño", short: "ALVARÍÑO", num: 22, pos: "ZAG", foto: "ALEXIS-ALVARIÑO.jpg.webp" },
  { id: 6, name: "Carlinhos", short: "CARLINHOS", num: 3, pos: "ZAG", foto: "CARLINHOS.jpg.webp" },
  { id: 3, name: "Dantas", short: "DANTAS", num: 25, pos: "ZAG", foto: "DANTAS.jpg.webp" },
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LAT", foto: "SANDER (1).jpg" },
  { id: 28, name: "Maykon Jesus", short: "MAYKON", num: 66, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 27, name: "Nilson Castrillón", short: "NILSON", num: 20, pos: "LAT", foto: "NILSON-CASTRILLON.jpg.webp" },
  { id: 75, name: "Jhilmar Lora", short: "LORA", num: 24, pos: "LAT", foto: "LORA.jpg.webp" },
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 46, name: "Marlon", short: "MARLON", num: 28, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 40, name: "Léo Naldi", short: "NALDI", num: 18, pos: "VOL", foto: "LÉO-NALDI.jpg.webp" },
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 12, name: "Juninho", short: "JUNINHO", num: 50, pos: "MEI", foto: "JUNINHO.jpg.webp" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },
  { id: 86, name: "Christian Ortíz", short: "TITI ORTÍZ", num: 8, pos: "MEI", foto: "CHRISTIAN-ORTÍZ.jpg.webp" },
  { id: 13, name: "Diego Galo", short: "D. GALO", num: 19, pos: "MEI", foto: "DIEGO-GALO.jpg.webp" },
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 50, name: "Carlão", short: "CARLÃO", num: 9, pos: "ATA", foto: "CARLÃO.jpg.webp" },
  { id: 52, name: "Hélio Borges", short: "HÉLIO", num: 41, pos: "ATA", foto: "HÉLIO-BORGES.jpg.webp" },
  { id: 53, name: "Jardiel", short: "JARDIEL", num: 40, pos: "ATA", foto: "JARDIEL.jpg.webp" },
  { id: 91, name: "Hector Bianchi", short: "HECTOR", num: 35, pos: "ATA", foto: "HECTOR-BIANCHI.jpg.webp" },
];

// ==================== FORMATIONS ====================
const FORMATIONS: Record<string, Slot[]> = {
  '4-3-3': [
    { id: 'gk', x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb', x: 15, y: 65, posHint: 'LAT' },
    { id: 'cb1', x: 38, y: 73, posHint: 'ZAG' },
    { id: 'cb2', x: 62, y: 73, posHint: 'ZAG' },
    { id: 'rb', x: 85, y: 65, posHint: 'LAT' },
    { id: 'm1', x: 32, y: 48, posHint: 'VOL' },
    { id: 'm2', x: 50, y: 45, posHint: 'MEI' },
    { id: 'm3', x: 68, y: 48, posHint: 'MEI' },
    { id: 'lw', x: 22, y: 22, posHint: 'ATA' },
    { id: 'st', x: 50, y: 14, posHint: 'ATA' },
    { id: 'rw', x: 78, y: 22, posHint: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb', x: 15, y: 65, posHint: 'LAT' },
    { id: 'cb1', x: 38, y: 73, posHint: 'ZAG' },
    { id: 'cb2', x: 62, y: 73, posHint: 'ZAG' },
    { id: 'rb', x: 85, y: 65, posHint: 'LAT' },
    { id: 'lm', x: 22, y: 48, posHint: 'MEI' },
    { id: 'cm1', x: 38, y: 50, posHint: 'MEI' },
    { id: 'cm2', x: 62, y: 50, posHint: 'MEI' },
    { id: 'rm', x: 78, y: 48, posHint: 'MEI' },
    { id: 'st1', x: 40, y: 17, posHint: 'ATA' },
    { id: 'st2', x: 60, y: 17, posHint: 'ATA' },
  ],
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb', x: 15, y: 65, posHint: 'LAT' },
    { id: 'cb1', x: 38, y: 73, posHint: 'ZAG' },
    { id: 'cb2', x: 62, y: 73, posHint: 'ZAG' },
    { id: 'rb', x: 85, y: 65, posHint: 'LAT' },
    { id: 'v1', x: 38, y: 53, posHint: 'VOL' },
    { id: 'v2', x: 62, y: 53, posHint: 'VOL' },
    { id: 'am', x: 50, y: 35, posHint: 'MEI' },
    { id: 'lw', x: 22, y: 22, posHint: 'ATA' },
    { id: 'rw', x: 78, y: 22, posHint: 'ATA' },
    { id: 'st', x: 50, y: 12, posHint: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88, posHint: 'GOL' },
    { id: 'cb1', x: 30, y: 72, posHint: 'ZAG' },
    { id: 'cb2', x: 50, y: 75, posHint: 'ZAG' },
    { id: 'cb3', x: 70, y: 72, posHint: 'ZAG' },
    { id: 'lm', x: 15, y: 48, posHint: 'LAT' },
    { id: 'm1', x: 32, y: 48, posHint: 'MEI' },
    { id: 'm2', x: 50, y: 50, posHint: 'MEI' },
    { id: 'm3', x: 68, y: 48, posHint: 'MEI' },
    { id: 'rm', x: 85, y: 48, posHint: 'LAT' },
    { id: 'st1', x: 40, y: 17, posHint: 'ATA' },
    { id: 'st2', x: 60, y: 17, posHint: 'ATA' },
  ],
  '5-3-2': [
    { id: 'gk', x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb', x: 12, y: 55, posHint: 'LAT' },
    { id: 'cb1', x: 30, y: 72, posHint: 'ZAG' },
    { id: 'cb2', x: 50, y: 75, posHint: 'ZAG' },
    { id: 'cb3', x: 70, y: 72, posHint: 'ZAG' },
    { id: 'rb', x: 88, y: 55, posHint: 'LAT' },
    { id: 'm1', x: 35, y: 45, posHint: 'MEI' },
    { id: 'm2', x: 50, y: 48, posHint: 'MEI' },
    { id: 'm3', x: 65, y: 45, posHint: 'MEI' },
    { id: 'st1', x: 40, y: 17, posHint: 'ATA' },
    { id: 'st2', x: 60, y: 17, posHint: 'ATA' },
  ],
  '3-4-3': [
    { id: 'gk', x: 50, y: 88, posHint: 'GOL' },
    { id: 'cb1', x: 28, y: 72, posHint: 'ZAG' },
    { id: 'cb2', x: 50, y: 75, posHint: 'ZAG' },
    { id: 'cb3', x: 72, y: 72, posHint: 'ZAG' },
    { id: 'lm', x: 15, y: 48, posHint: 'MEI' },
    { id: 'cm1', x: 38, y: 50, posHint: 'MEI' },
    { id: 'cm2', x: 62, y: 50, posHint: 'MEI' },
    { id: 'rm', x: 85, y: 48, posHint: 'MEI' },
    { id: 'lw', x: 22, y: 22, posHint: 'ATA' },
    { id: 'st', x: 50, y: 14, posHint: 'ATA' },
    { id: 'rw', x: 78, y: 22, posHint: 'ATA' },
  ],
};

const FORMATION_NAMES = Object.keys(FORMATIONS);

// ==================== HELPERS ====================
function getPhotoUrl(foto: string): string {
  if (!foto) return ESCUDO;
  if (foto.startsWith('http')) return foto;
  return `${BASE_STORAGE}${encodeURIComponent(foto)}`;
}

function PlayerImage({ player, focus = '95% center' }: { player: Player; focus?: string }) {
  const [error, setError] = useState(false);
  const src = error ? ESCUDO : getPhotoUrl(player.foto);

  return (
    <img
      src={src}
      alt={player.short}
      onError={() => setError(true)}
      className="w-full h-full object-cover"
      style={{ objectPosition: focus }}
    />
  );
}

// ==================== FIELD SLOT ====================
interface FieldSlotProps {
  slot: Slot;
  player: Player | null;
  isSelected: boolean;
  isCaptain: boolean;
  isHero: boolean;
  onClick: () => void;
}

function FieldSlot({ slot, player, isSelected, isCaptain, isHero, onClick }: FieldSlotProps) {
  const borderColor = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : isSelected ? '#F5C400' : 'rgba(255,255,255,0.25)';

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      style={{
        position: 'absolute',
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: 'translate(-50%, -50%)',
        width: 78,
        height: 105,
        zIndex: isSelected || isCaptain || isHero ? 40 : 20,
      }}
      className="rounded-2xl overflow-hidden border-4 transition-all shadow-2xl"
      style={{
        borderColor,
        boxShadow: isCaptain 
          ? '0 0 30px rgba(245,196,0,0.7)' 
          : isHero 
          ? '0 0 30px rgba(0,243,255,0.7)' 
          : isSelected 
          ? '0 0 30px rgba(245,196,0,0.5)' 
          : 'none',
      }}
    >
      {player ? (
        <div className="relative w-full h-full">
          <PlayerImage player={player} focus="95% center" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent h-12 flex items-end pb-1.5 justify-center">
            <span className="text-white text-xs font-black tracking-wider drop-shadow-md">
              {player.short}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center bg-black/60 text-4xl text-white/30 font-light">+</div>
      )}
    </motion.button>
  );
}

// ==================== MARKET SIDEBAR ====================
interface MarketSidebarProps {
  isPlayerEscalado: (id: number) => boolean;
  onPick: (player: Player) => void;
}

function MarketSidebar({ isPlayerEscalado, onPick }: MarketSidebarProps) {
  const [filter, setFilter] = useState<'TODOS' | Player['pos']>('TODOS');

  const filtered = useMemo(() => {
    if (filter === 'TODOS') return PLAYERS_DATA;
    return PLAYERS_DATA.filter(p => p.pos === filter);
  }, [filter]);

  return (
    <div className="h-full flex flex-col bg-black/90 backdrop-blur-xl border-l border-white/10">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-[#F5C400] font-black text-3xl tracking-tighter">MERCADO TIGRE</h2>
      </div>

      <div className="flex gap-2 p-4 overflow-x-auto border-b border-white/10">
        {['TODOS', 'GOL', 'LAT', 'ZAG', 'VOL', 'MEI', 'ATA'].map(p => (
          <button
            key={p}
            onClick={() => setFilter(p as any)}
            className={`px-5 py-2 text-xs font-black rounded-full transition-all whitespace-nowrap ${
              filter === p ? 'bg-[#F5C400] text-black' : 'bg-zinc-900 hover:bg-zinc-800'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex-1 p-5 overflow-y-auto grid grid-cols-2 gap-4">
        <AnimatePresence>
          {filtered.map(player => {
            const escalado = isPlayerEscalado(player.id);
            return (
              <motion.div
                key={player.id}
                whileHover={!escalado ? { scale: 1.06 } : {}}
                whileTap={!escalado ? { scale: 0.96 } : {}}
                onClick={() => !escalado && onPick(player)}
                className={`aspect-[3/4] rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                  escalado ? 'opacity-40 grayscale border-zinc-700' : 'border-white/10 hover:border-[#F5C400]'
                }`}
              >
                <PlayerImage player={player} focus="22% center" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 h-16 flex items-end p-3">
                  <div>
                    <p className="font-black text-white text-sm">{player.short}</p>
                    <p className="text-[#F5C400] text-xs">{player.pos} • #{player.num}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function ArenaTigreFC() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [scoreTigre, setScoreTigre] = useState(2);
  const [scoreAdv, setScoreAdv] = useState(1);

  const slots = FORMATIONS[formation] || [];
  const squad = useMemo(() => Object.values(lineup).filter((p): p is Player => !!p), [lineup]);
  const allFilled = squad.length === 11;

  const isPlayerEscalado = useCallback((id: number) => squad.some(p => p.id === id), [squad]);

  const handleMarketPick = (player: Player) => {
    if (activeSlot) {
      setLineup(prev => ({ ...prev, [activeSlot]: player }));
      setActiveSlot(null);
    } else {
      const emptySlot = slots.find(s => !lineup[s.id]);
      if (emptySlot) {
        setLineup(prev => ({ ...prev, [emptySlot.id]: player }));
      }
    }
  };

  const handleSlotClick = (slotId: string) => {
    setActiveSlot(prev => prev === slotId ? null : slotId);
  };

  const removeFromSlot = (slotId: string) => {
    const player = lineup[slotId];
    if (player) {
      if (captainId === player.id) setCaptainId(null);
      if (heroId === player.id) setHeroId(null);
      setLineup(prev => ({ ...prev, [slotId]: null }));
    }
  };

  const goToLeaders = () => allFilled && setStep('leaders');
  const goToPrediction = () => (captainId && heroId && captainId !== heroId) && setStep('prediction');
  const goToReveal = () => setStep('reveal');

  const reset = () => {
    setStep('formation');
    setFormation('4-3-3');
    setLineup({});
    setActiveSlot(null);
    setCaptainId(null);
    setHeroId(null);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">
        {/* 1. Formation Selection */}
        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950">
            <img src={ESCUDO} className="w-36 mb-10" alt="Tigre" />
            <h1 className="text-6xl font-black italic tracking-tighter text-[#F5C400] mb-4">ARENA TIGRE FC</h1>
            <p className="text-xl text-white/70 mb-12">Escolha o esquema tático</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {FORMATION_NAMES.map(f => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    setFormation(f);
                    setLineup({});
                    setStep('arena');
                  }}
                  className="py-8 bg-zinc-900 border border-white/10 hover:border-[#F5C400] rounded-3xl text-2xl font-black italic transition-all"
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* 2. Arena */}
        {step === 'arena' && (
          <div className="h-screen flex flex-col lg:flex-row relative">
            <div className="lg:w-96 bg-black/95 backdrop-blur-xl z-50 border-r border-white/10 flex flex-col">
              <MarketSidebar isPlayerEscalado={isPlayerEscalado} onPick={handleMarketPick} />
            </div>

            <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={{ perspective: '1800px' }}>
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-75" alt="Estádio" />
              <div className="absolute inset-0 bg-black/40" />

              <div className="relative w-full max-w-[720px] aspect-[10/13]">
                {slots.map(slot => {
                  const player = lineup[slot.id];
                  return (
                    <FieldSlot
                      key={slot.id}
                      slot={slot}
                      player={player}
                      isSelected={activeSlot === slot.id}
                      isCaptain={captainId === player?.id}
                      isHero={heroId === player?.id}
                      onClick={() => player ? removeFromSlot(slot.id) : handleSlotClick(slot.id)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50">
              <button onClick={() => setStep('formation')} className="px-8 py-4 bg-zinc-900 border border-white/20 rounded-2xl font-black text-sm tracking-widest hover:border-white/40">← TÁTICA</button>
              <button 
                onClick={goToLeaders}
                disabled={!allFilled}
                className={`px-12 py-4 rounded-2xl font-black tracking-widest transition-all ${allFilled ? 'bg-[#F5C400] text-black hover:bg-yellow-400' : 'bg-zinc-800 text-white/40 cursor-not-allowed'}`}
              >
                ESCOLHER LÍDERES →
              </button>
            </div>
          </div>
        )}

        {/* 3. Leaders */}
        {step === 'leaders' && (
          <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-950">
            {/* Aqui você pode reutilizar o LeaderPanel que estava no outro arquivo ou simplificar */}
            <div className="text-center">
              <h2 className="text-5xl font-black italic mb-8 text-[#F5C400]">Escolha Capitão e Herói</h2>
              <p className="text-white/60 mb-12">Capitão = ×2 pontos | Herói = +10 pontos</p>
              <button onClick={goToPrediction} className="bg-[#F5C400] text-black px-16 py-6 rounded-3xl font-black text-xl">CONTINUAR PARA PALPITE</button>
            </div>
          </div>
        )}

        {/* 4. Prediction */}
        {step === 'prediction' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-zinc-950">
            <h2 className="text-4xl font-black mb-12">Qual o placar?</h2>
            <div className="flex gap-12 items-center">
              <div className="text-center">
                <img src={ESCUDO} className="w-20 mx-auto mb-4" />
                <input type="number" value={scoreTigre} onChange={e => setScoreTigre(Number(e.target.value))} className="w-24 h-24 bg-zinc-900 border-4 border-[#F5C400] rounded-3xl text-center text-6xl font-black" />
              </div>
              <span className="text-6xl text-white/30">×</span>
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">ADV</div>
                <input type="number" value={scoreAdv} onChange={e => setScoreAdv(Number(e.target.value))} className="w-24 h-24 bg-zinc-900 border-4 border-white/30 rounded-3xl text-center text-6xl font-black" />
              </div>
            </div>
            <button onClick={goToReveal} className="mt-16 bg-[#F5C400] text-black px-20 py-7 rounded-3xl font-black text-xl">GERAR CARD FINAL</button>
          </div>
        )}

        {/* 5. Reveal */}
        {step === 'reveal' && (
          <div className="min-h-screen flex items-center justify-center bg-black p-8">
            <div className="text-center max-w-md">
              <h1 className="text-6xl font-black italic text-[#F5C400] mb-8">TIME PRONTO!</h1>
              <p className="text-white/70 mb-12">Compartilhe sua escalação com a torcida.</p>
              <button onClick={reset} className="w-full py-7 bg-[#F5C400] text-black font-black rounded-3xl text-xl">MONTAR NOVO TIME</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
