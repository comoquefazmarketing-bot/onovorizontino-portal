'use client';
/**
 * EscalacaoFormacao — Tigre FC PS5 / FIFA 26 Edition
 * Versão Resgatada: Layout Proporcional + UX Premium
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup = Record<string, Player | null>;
type Step = 'formation' | 'picking' | 'score' | 'reveal';

interface Jogo {
  id: number;
  competicao?: string;
  rodada?: string;
  data_hora?: string;
  local?: string;
  mandante?: { nome: string; escudo_url?: string };
  visitante?: { nome: string; escudo_url?: string };
}

interface Props {
  jogoId?: number;
}

// ==================== ELENCO ====================
const PLAYERS: Player[] = [ /* seu array completo de 37 jogadores */ ];

// ==================== FORMAÇÕES ====================
const FORMATIONS = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 85, pos: 'GOL', label: 'GK' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT', label: 'RB' },
    { id: 'cb1', x: 62, y: 72, pos: 'ZAG', label: 'CB' },
    { id: 'cb2', x: 38, y: 72, pos: 'ZAG', label: 'CB' },
    { id: 'lb', x: 18, y: 68, pos: 'LAT', label: 'LB' },
    { id: 'dm1', x: 35, y: 52, pos: 'VOL', label: 'DM' },
    { id: 'dm2', x: 65, y: 52, pos: 'VOL', label: 'DM' },
    { id: 'am', x: 50, y: 38, pos: 'MEI', label: 'AM' },
    { id: 'rw', x: 78, y: 22, pos: 'MEI', label: 'RW' },
    { id: 'lw', x: 22, y: 22, pos: 'MEI', label: 'LW' },
    { id: 'st', x: 50, y: 10, pos: 'ATA', label: 'ST' },
  ],
  // adicione as outras formações se quiser
};

const POS_COLORS: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#00F3FF', LAT: '#4FC3F7',
  VOL: '#BF5FFF', MEI: '#22C55E', ATA: '#FF2D55',
};

// ==================== COMPONENTES VISUAIS ====================

function FormationCard({ formation, selected, onSelect }: {
  formation: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3
        ${selected 
          ? 'border-[#F5C400] bg-gradient-to-b from-[#1a1200] to-black shadow-[0_0_30px_rgba(245,196,0,0.4)]' 
          : 'border-white/10 bg-black/40 hover:border-white/20'}`}
    >
      <div className="text-5xl font-black text-[#F5C400] tracking-tighter">{formation}</div>
      <div className="text-xs uppercase tracking-[2px] text-white/50 font-bold">Formação</div>
    </motion.button>
  );
}

function FifaCard({ player, isCaptain, isHero, onClick }: {
  player: Player;
  isCaptain?: boolean;
  isHero?: boolean;
  onClick?: () => void;
}) {
  const color = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] || '#888');

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer relative"
    >
      <div className="w-16 h-20 bg-black rounded-xl overflow-hidden border-2" style={{ borderColor: color }}>
        <img 
          src={player.foto} 
          alt={player.short}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-center py-0.5">
          <span className="text-[10px] font-black text-white tracking-wider">{player.short}</span>
        </div>
      </div>

      {(isCaptain || isHero) && (
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
          style={{ background: isCaptain ? '#F5C400' : '#00F3FF', color: '#000' }}>
          {isCaptain ? 'C' : '★'}
        </div>
      )}
    </motion.div>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

export default function EscalacaoFormacao({ jogoId }: { jogoId?: number }) {
  const [step, setStep] = useState<'formation' | 'picking' | 'score' | 'reveal'>('formation');
  const [formation, setFormation] = useState<'4-2-3-1'>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [scoreTigre, setScoreTigre] = useState(2);
  const [scoreAdv, setScoreAdv] = useState(1);

  const slots = FORMATIONS[formation];

  // Selecionar jogador
  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden font-['Barlow_Condensed']">
      <AnimatePresence mode="wait">

        {/* === STEP 1: ESCOLHA DE FORMAÇÃO === */}
        {step === 'formation' && (
          <motion.div
            key="formation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6"
          >
            <img src={ESCUDO} alt="Tigre" className="w-24 h-24 mb-8 drop-shadow-2xl" />

            <h1 className="text-4xl font-black text-center mb-2 tracking-tighter">
              ESCOLHA SUA TÁTICA
            </h1>
            <p className="text-zinc-400 text-center mb-12 max-w-xs">
              A base do seu sucesso no Tigre FC começa aqui
            </p>

            <div className="grid grid-cols-1 gap-6 w-full max-w-md">
              {Object.keys(FORMATIONS).map((f) => (
                <FormationCard
                  key={f}
                  formation={f}
                  selected={formation === f}
                  onSelect={() => {
                    setFormation(f as '4-2-3-1');
                    setStep('picking');
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* === STEP 2: CAMPO + MERCADO === */}
        {step === 'picking' && (
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <div className="bg-zinc-950 border-b border-zinc-800 p-4 flex items-center justify-between">
              <div>
                <div className="text-[#F5C400] text-xs font-bold tracking-widest">TIGRE FC</div>
                <div className="font-black text-xl tracking-tighter">ESCALAÇÃO</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-zinc-500">Formação</div>
                <div className="text-[#F5C400] font-black text-2xl tracking-tighter">{formation}</div>
              </div>
            </div>

            {/* Campo Tático */}
            <div className="flex-1 relative bg-gradient-to-b from-emerald-950 to-black flex items-center justify-center p-4">
              <div className="relative w-full max-w-[380px] aspect-[9/13] bg-black rounded-3xl overflow-hidden border border-zinc-700 shadow-2xl">
                {/* Gramado */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#1a3a22_0,#1a3a22_8px,#112a18_8px,#112a18_16px)]" />
                
                {/* Linhas do campo */}
                <div className="absolute inset-0 border-2 border-white/20" />
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/30" />
                <div className="absolute top-1/4 left-1/4 right-1/4 h-px bg-white/10" />
                <div className="absolute bottom-1/4 left-1/4 right-1/4 h-px bg-white/10" />

                {/* Jogadores posicionados */}
                {slots.map((slot, index) => {
                  const player = lineup[slot.id];
                  return (
                    <motion.div
                      key={slot.id}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="absolute flex flex-col items-center"
                      style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
                      onClick={() => setActiveSlot(slot.id)}
                    >
                      <FifaCard 
                        player={player || { id: 0, name: '', short: slot.label, num: 0, pos: slot.pos, foto: '' }}
                        onClick={() => setActiveSlot(slot.id)}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Barra inferior - Mercado */}
            <div className="bg-zinc-950 border-t border-zinc-800 p-4">
              <button
                onClick={() => setActiveSlot('market')}
                className="w-full bg-gradient-to-r from-[#F5C400] to-amber-500 text-black font-black py-4 rounded-2xl text-lg tracking-wider active:scale-95 transition-transform"
              >
                ABRIR MERCADO DE JOGADORES
              </button>
            </div>
          </div>
        )}

        {/* Modal de Mercado (não cobre o campo) */}
        <AnimatePresence>
          {activeSlot && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col"
            >
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-xl font-black">Mercado de Jogadores</h2>
                <button onClick={() => setActiveSlot(null)} className="text-zinc-400">Fechar</button>
              </div>

              <div className="flex-1 overflow-auto p-4 grid grid-cols-3 gap-3">
                {PLAYERS.map(player => (
                  <div
                    key={player.id}
                    onClick={() => handleSelectPlayer(player)}
                    className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img src={player.foto} className="w-full aspect-square object-cover" />
                    <div className="p-2 text-center">
                      <div className="text-sm font-bold">{player.short}</div>
                      <div className="text-xs text-zinc-500">{player.pos}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </AnimatePresence>
    </div>
  );
}
