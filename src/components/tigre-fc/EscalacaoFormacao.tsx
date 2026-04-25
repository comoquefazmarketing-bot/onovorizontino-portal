'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGREFC.png';

type Player = {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
};

type Lineup = Record<string, Player | null>;
type Step = 'tutorial' | 'arena' | 'summary';

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
const PLAYERS: Player[] = [ /* ... mesmo array completo de 39 jogadores que eu te mandei antes ... */ 
  // (copie o array completo dos jogadores que enviei na mensagem anterior aqui)
  // Para não ficar gigante, estou resumindo aqui, mas você deve colar o array inteiro
];

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [ /* slots como antes */ ],
  '4-3-3': [ /* ... */ ],
  '4-4-2': [ /* ... */ ],
  // adicione as outras formações se quiser
};

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<Step>('tutorial');
  const [formation, setFormation] = useState<'4-2-3-1' | '4-3-3' | '4-4-2'>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);
  const [score, setScore] = useState({ tigre: 2, adv: 1 });

  const slots = useMemo(() => FORMATIONS[formation] || [], [formation]);

  const filteredPlayers = useMemo(() => {
    const targetPos = filterPos || (activeSlot ? slots.find(s => s.id === activeSlot)?.pos : null);
    return targetPos 
      ? PLAYERS.filter(p => p.pos === targetPos) 
      : PLAYERS;
  }, [filterPos, activeSlot, slots]);

  const filledSlots = Object.values(lineup).filter(Boolean).length;

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
  };

  const triggerExplosion = () => {
    const colors = ['#F5C400', '#00F3FF', '#FF2D55', '#22C55E'];
    for (let i = 0; i < 15; i++) {
      setTimeout(() => {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.inset = '0';
        flash.style.background = colors[Math.floor(Math.random() * colors.length)];
        flash.style.opacity = '0.18';
        flash.style.zIndex = '9999';
        flash.style.pointerEvents = 'none';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 180);
      }, i * 55);
    }
  };

  const handleFinish = () => {
    if (filledSlots < 11) {
      alert(`Complete os 11 titulares! (${filledSlots}/11)`);
      return;
    }
    triggerExplosion();
    setTimeout(() => setStep('summary'), 800);
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <AnimatePresence mode="wait">

        {/* TUTORIAL - TELA INICIAL */}
        {step === 'tutorial' && (
          <motion.div 
            key="tutorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-8 text-center"
          >
            <img src={ESCUDO} className="w-40 mb-10" alt="Escudo" />
            <h1 className="text-7xl font-black italic tracking-tighter text-[#F5C400]">TIGRE FC</h1>
            <p className="text-3xl mt-6 mb-16 max-w-md">Monte sua escalação como um técnico de verdade!</p>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('arena')}
              className="bg-[#F5C400] hover:bg-yellow-400 text-black font-black text-2xl px-16 py-7 rounded-3xl transition-all"
            >
              COMEÇAR A MONTAR O TIME ⚽
            </motion.button>
          </motion.div>
        )}

        {/* ARENA - CAMPO COM ESTÁDIO */}
        {step === 'arena' && (
          <div className="relative h-screen overflow-hidden">
            {/* Background do Estádio */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${STADIUM_BG})` }}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="flex h-full relative z-10">
              {/* CAMPO */}
              <div className="flex-1 flex items-center justify-center p-8" style={{ perspective: '1800px' }}>
                <div className="relative w-full max-w-[680px]">
                  <motion.div
                    initial={{ rotateX: 24 }}
                    animate={{ rotateX: 17 }}
                    className="relative aspect-[10/13] rounded-[70px] overflow-hidden shadow-2xl"
                  >
                    {slots.map((slot) => {
                      const player = lineup[slot.id];
                      const scale = 1 - (slot.y / 100) * 0.4;

                      return (
                        <motion.div
                          key={slot.id}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                          style={{
                            left: `${slot.x}%`,
                            top: `${slot.y}%`,
                            transform: `scale(${scale})`,
                          }}
                          onClick={() => setActiveSlot(slot.id)}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className={`w-[86px] h-[118px] rounded-3xl overflow-hidden border-4 shadow-xl cursor-pointer transition-all
                              ${activeSlot === slot.id ? 'border-[#F5C400] shadow-[#F5C400]/60' : 'border-white/40'}`}
                          >
                            {player ? (
                              <img 
                                src={player.foto} 
                                className="w-[200%] h-full object-cover"
                                style={{ objectPosition: '78% center' }}
                                alt={player.short}
                              />
                            ) : (
                              <div className="h-full flex items-center justify-center bg-black/60 text-6xl text-white/30">+</div>
                            )}
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              </div>

              {/* MERCADO LATERAL */}
              <div className="w-full lg:w-96 bg-zinc-950/95 border-l border-white/10 flex flex-col backdrop-blur">
                <div className="p-6 border-b border-white/10">
                  <h2 className="text-[#F5C400] font-black text-3xl">MERCADO TIGRE</h2>
                </div>

                <div className="p-4 flex gap-2 overflow-x-auto">
                  {['GOL','LAT','ZAG','MEI','ATA'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPos(filterPos === p ? null : p)}
                      className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap ${filterPos === p ? 'bg-[#F5C400] text-black' : 'bg-zinc-800'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6 overflow-y-auto grid grid-cols-2 gap-4">
                  {filteredPlayers.map(player => (
                    <motion.div
                      key={player.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSelectPlayer(player)}
                      className="aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 cursor-pointer"
                    >
                      <img 
                        src={player.foto} 
                        className="w-full h-full object-cover" 
                        style={{ objectPosition: '22% center' }}
                      />
                      <div className="p-3">
                        <p className="font-bold text-sm">{player.short}</p>
                        <p className="text-xs text-[#F5C400]">{player.pos} • #{player.num}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="p-6 border-t border-white/10">
                  <button
                    onClick={handleFinish}
                    className="w-full py-6 bg-[#F5C400] text-black font-black text-xl rounded-2xl hover:bg-yellow-400 transition-all"
                  >
                    FINALIZAR ESCALAÇÃO
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {step === 'summary' && (
          <div className="min-h-screen flex items-center justify-center p-8 bg-black">
            <div className="text-center">
              <h2 className="text-5xl font-black text-[#F5C400]">Seu Time Está Pronto!</h2>
              {/* aqui você pode colocar o card compartilhável depois */}
            </div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
