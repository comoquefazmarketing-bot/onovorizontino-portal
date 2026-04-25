'use client';

/**
 * EscalacaoFormacao — FIFA 26 / PS5 Console Edition
 * - Micro-interactions: spring entry, hover lift, glow pulse, drop confirmation
 * - Tipografia Champions League / FIFA broadcast
 * - 6 formações com perspective scaling
 * - Click bidirecional + drag livre
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketList from './MarketList';

// ── Assets ────────────────────────────────────────────────
const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

// ── Tipos ─────────────────────────────────────────────────
interface Player { id: number; name: string; short: string; num: number; pos: string; foto: string; }
type SlotState = { player: Player | null; x: number; y: number };
type SlotMap = Record<string, SlotState>;
type Step = 'formation' | 'arena' | 'final';

// ── Elenco ativo ──────────────────────────────────────────
const PLAYERS_DATA: Player[] = [
  { id: 23, name: "Jordi Martins",    short: "JORDI",      num: 93, pos: "GOL", foto: "JORDI.png" },
  { id: 1,  name: "César",            short: "CÉSAR",      num: 31, pos: "GOL", foto: "CESAR-AUGUSTO.jpg.webp" },
  { id: 22, name: "João Scapin",      short: "SCAPIN",     num: 12, pos: "GOL", foto: "JOAO-SCAPIN.jpg.webp" },
  { id: 62, name: "Lucas",            short: "LUCAS",      num: 1,  pos: "GOL", foto: "LUCAS.jpg.webp" },
  { id: 8,  name: "Patrick",          short: "PATRICK",    num: 4,  pos: "ZAG", foto: "PATRICK.jpg.webp" },
  { id: 38, name: "Renato Palm",      short: "R. PALM",    num: 33, pos: "ZAG", foto: "RENATO-PALM.jpg.webp" },
  { id: 34, name: "Eduardo Brock",    short: "BROCK",      num: 14, pos: "ZAG", foto: "EDUARDO-BROCK.jpg.webp" },
  { id: 66, name: "Alexis Alvariño",  short: "ALVARÍÑO",   num: 22, pos: "ZAG", foto: "ALEXIS-ALVARIÑO.jpg.webp" },
  { id: 6,  name: "Carlinhos",        short: "CARLINHOS",  num: 3,  pos: "ZAG", foto: "CARLINHOS.jpg.webp" },
  { id: 3,  name: "Dantas",           short: "DANTAS",     num: 25, pos: "ZAG", foto: "DANTAS.jpg.webp" },
  { id: 9,  name: "Sander",           short: "SANDER",     num: 5,  pos: "LAT", foto: "SANDER (1).jpg" },
  { id: 28, name: "Maykon Jesus",     short: "MAYKON",     num: 66, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 27, name: "Nilson Castrillón",short: "NILSON",     num: 20, pos: "LAT", foto: "NILSON-CASTRILLON.jpg.webp" },
  { id: 75, name: "Jhilmar Lora",     short: "LORA",       num: 24, pos: "LAT", foto: "LORA.jpg.webp" },
  { id: 41, name: "Luís Oyama",       short: "OYAMA",      num: 6,  pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 46, name: "Marlon",           short: "MARLON",     num: 28, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 40, name: "Léo Naldi",        short: "NALDI",      num: 18, pos: "VOL", foto: "LÉO-NALDI.jpg.webp" },
  { id: 47, name: "Matheus Bianqui",  short: "BIANQUI",    num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 10, name: "Rômulo",           short: "RÔMULO",     num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 12, name: "Juninho",          short: "JUNINHO",    num: 50, pos: "MEI", foto: "JUNINHO.jpg.webp" },
  { id: 17, name: "Tavinho",          short: "TAVINHO",    num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },
  { id: 86, name: "Christian Ortíz",  short: "ORTÍZ",      num: 8,  pos: "MEI", foto: "CHRISTIAN-ORTÍZ.jpg.webp" },
  { id: 13, name: "Diego Galo",       short: "D. GALO",    num: 19, pos: "MEI", foto: "DIEGO-GALO.jpg.webp" },
  { id: 15, name: "Robson",           short: "ROBSON",     num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 59, name: "Vinícius Paiva",   short: "V. PAIVA",   num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD",     num: 7,  pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 55, name: "Nicolas Careca",   short: "CARECA",     num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 50, name: "Carlão",           short: "CARLÃO",     num: 9,  pos: "ATA", foto: "CARLÃO.jpg.webp" },
  { id: 52, name: "Hélio Borges",     short: "HÉLIO",      num: 41, pos: "ATA", foto: "HÉLIO-BORGES.jpg.webp" },
  { id: 53, name: "Jardiel",          short: "JARDIEL",    num: 40, pos: "ATA", foto: "JARDIEL.jpg.webp" },
  { id: 91, name: "Hector Bianchi",   short: "HECTOR",     num: 35, pos: "ATA", foto: "HECTOR-BIANCHI.jpg.webp" },
];

// ── Formações (memoizadas fora do componente) ─────────────
const FORMATIONS: Record<string, Record<string, { x: number; y: number }>> = {
  '4-3-3':   { gk:{x:50,y:85}, lb:{x:15,y:65}, cb1:{x:38,y:72}, cb2:{x:62,y:72}, rb:{x:85,y:65}, m1:{x:50,y:50}, m2:{x:30,y:45}, m3:{x:70,y:45}, st:{x:50,y:18}, lw:{x:22,y:25}, rw:{x:78,y:25} },
  '4-4-2':   { gk:{x:50,y:85}, lb:{x:15,y:65}, cb1:{x:38,y:72}, cb2:{x:62,y:72}, rb:{x:85,y:65}, m1:{x:35,y:48}, m2:{x:65,y:48}, m3:{x:15,y:40}, m4:{x:85,y:40}, st1:{x:40,y:20}, st2:{x:60,y:20} },
  '3-5-2':   { gk:{x:50,y:85}, cb1:{x:30,y:72}, cb2:{x:50,y:75}, cb3:{x:70,y:72}, lm:{x:15,y:45}, rm:{x:85,y:45}, m1:{x:35,y:50}, m2:{x:65,y:50}, am:{x:50,y:35}, st1:{x:40,y:18}, st2:{x:60,y:18} },
  '4-5-1':   { gk:{x:50,y:85}, lb:{x:15,y:65}, cb1:{x:38,y:72}, cb2:{x:62,y:72}, rb:{x:85,y:65}, m1:{x:30,y:50}, m2:{x:50,y:50}, m3:{x:70,y:50}, am1:{x:35,y:35}, am2:{x:65,y:35}, st:{x:50,y:18} },
  '4-2-3-1': { gk:{x:50,y:85}, lb:{x:15,y:65}, cb1:{x:38,y:72}, cb2:{x:62,y:72}, rb:{x:85,y:65}, v1:{x:40,y:55}, v2:{x:60,y:55}, am:{x:50,y:38}, lw:{x:20,y:30}, rw:{x:80,y:30}, st:{x:50,y:15} },
  '5-3-2':   { gk:{x:50,y:85}, lb:{x:12,y:55}, cb1:{x:30,y:72}, cb2:{x:50,y:75}, cb3:{x:70,y:72}, rb:{x:88,y:55}, m1:{x:50,y:50}, m2:{x:30,y:42}, m3:{x:70,y:42}, st1:{x:42,y:20}, st2:{x:58,y:20} },
};

// ── Engine de perspectiva ─────────────────────────────────
function scalePorY(y: number): number {
  const min = 0.92, max = 1.35;
  const norm = Math.max(0, Math.min(1, (y - 15) / (85 - 15)));
  return min + norm * (max - min);
}

// ══════════════════════════════════════════════════════════
// FieldSlot (componente isolado pra performance)
// ══════════════════════════════════════════════════════════
interface FieldSlotProps {
  slotId: string;
  state: SlotState;
  isActive: boolean;
  isPending: boolean;
  justDropped: boolean;
  index: number;
  onClick: () => void;
}

const FieldSlot = React.memo(function FieldSlot({
  slotId, state, isActive, isPending, justDropped, index, onClick,
}: FieldSlotProps) {
  const scale = scalePorY(state.y);
  const W = Math.round(80 * scale);
  const H = Math.round(112 * scale);
  const filled = !!state.player;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onClick={onClick}
      initial={{ opacity: 0, y: -20, scale: 0.4 }}
      animate={{
        opacity: 1, y: 0, scale: 1,
        rotate: justDropped ? [0, -3, 3, 0] : 0,
      }}
      transition={{
        delay: 0.05 + (index * 0.04),
        type: 'spring', damping: 14, stiffness: 200,
        rotate: { duration: 0.4 },
      }}
      whileHover={{ scale: 1.08, y: -4, transition: { type: 'spring', damping: 12 } }}
      whileTap={{ scale: 0.94 }}
      whileDrag={{ scale: 1.18, zIndex: 9999, cursor: 'grabbing' }}
      style={{
        position: 'absolute',
        left: `${state.x}%`,
        top:  `${state.y}%`,
        width: W,
        height: H,
        x: '-50%',
        y: '-50%',
        zIndex: isActive ? 999 : Math.round(100 + state.y),
        filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.65))',
        cursor: filled ? 'grab' : 'pointer',
        touchAction: 'none',
      }}
      className={`group rounded-xl overflow-hidden border-2 transition-all duration-300
        ${isActive
          ? 'border-yellow-500 shadow-[0_0_36px_rgba(245,196,0,0.85),inset_0_0_24px_rgba(245,196,0,0.18)]'
          : isPending
            ? 'border-yellow-500/60 shadow-[0_0_24px_rgba(245,196,0,0.4)]'
            : filled
              ? 'border-white/30 shadow-[inset_0_-30px_50px_rgba(0,0,0,0.6)]'
              : 'border-yellow-500/30 border-dashed bg-black/55 backdrop-blur-md hover:border-yellow-500'}
      `}
    >
      {/* Glow pulsante quando slot está ativo */}
      {isActive && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            boxShadow: [
              'inset 0 0 12px rgba(245,196,0,0.4)',
              'inset 0 0 28px rgba(245,196,0,0.7)',
              'inset 0 0 12px rgba(245,196,0,0.4)',
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Sombra projetada no chão */}
      <div style={{
        position: 'absolute', bottom: -10, left: '50%',
        width: W * 0.7, height: 8,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)',
        transform: 'translateX(-50%) translateY(100%)',
        filter: 'blur(3px)', pointerEvents: 'none',
      }} />

      {filled && state.player ? (
        <div className="relative w-full h-full pointer-events-none">
          <img
            src={`${BASE_STORAGE}${state.player.foto}`}
            alt={state.player.short}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ objectPosition: '90% 8%' }}
            onError={e => {
              const t = e.target as HTMLImageElement;
              t.src = ESCUDO; t.style.opacity = '0.3'; t.style.objectFit = 'contain';
            }}
          />

          {/* Gradiente bottom para legibilidade */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {/* Tag posição (top-left) */}
          <div className="absolute top-1.5 left-1.5 bg-black/90 backdrop-blur-sm px-1.5 py-0.5 rounded
            text-[7px] font-black text-yellow-500 tracking-widest uppercase border border-yellow-500/30">
            {state.player.pos}
          </div>

          {/* Número (top-right) */}
          <div className="absolute top-1.5 right-1.5 text-yellow-500 text-base font-black italic
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif" }}>
            {state.player.num}
          </div>

          {/* Nome no rodapé (estilo broadcast TV) */}
          <div className="absolute inset-x-0 bottom-0 px-2 py-1.5
            bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent
            border-t border-yellow-500/40">
            <p className="text-[10px] font-black uppercase italic text-white leading-none tracking-tight text-center
              drop-shadow-[0_1px_2px_rgba(0,0,0,1)]"
              style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif" }}>
              {state.player.short}
            </p>
          </div>

          {/* Drop confirmation flash */}
          <AnimatePresence>
            {justDropped && (
              <motion.div
                initial={{ opacity: 0.9, scale: 0.6 }}
                animate={{ opacity: 0, scale: 1.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-yellow-500/40 rounded-xl pointer-events-none"
              />
            )}
          </AnimatePresence>
        </div>
      ) : (
        // Slot vazio — broadcast style
        <div className="h-full flex flex-col items-center justify-center text-yellow-500/40 group-hover:text-yellow-500/80 transition-colors">
          <span className="text-3xl font-thin leading-none">+</span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] mt-1 opacity-70"
            style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif" }}>
            {slotId}
          </span>
        </div>
      )}
    </motion.div>
  );
});

// ══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════
interface EscalacaoFormacaoProps {
  jogoId?: number;
}
export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps = {}) {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [justDroppedSlot, setJustDroppedSlot] = useState<string | null>(null);

  // Inicializa slotMap
  useEffect(() => {
    const coords = FORMATIONS[formation];
    const initial: SlotMap = {};
    Object.entries(coords).forEach(([id, c]) => {
      initial[id] = { player: null, x: c.x, y: c.y };
    });
    setSlotMap(initial);
  }, [formation]);

  // Limpa o flash de drop após 600ms
  useEffect(() => {
    if (!justDroppedSlot) return;
    const t = setTimeout(() => setJustDroppedSlot(null), 600);
    return () => clearTimeout(t);
  }, [justDroppedSlot]);

  // Helper: jogador escalado?
  const isEscalado = useCallback(
    (id: number) => Object.values(slotMap).some(s => s.player?.id === id),
    [slotMap]
  );

  // Click no jogador do mercado
  const handlePlayerSelection = useCallback((player: Player) => {
    if (activeSlot) {
      setSlotMap(prev => ({ ...prev, [activeSlot]: { ...prev[activeSlot], player } }));
      setJustDroppedSlot(activeSlot);
      setActiveSlot(null);
    } else {
      setPendingPlayer(player);
    }
  }, [activeSlot]);

  // Click no slot do campo
  const handleSlotClick = useCallback((slotId: string) => {
    if (pendingPlayer) {
      setSlotMap(prev => ({ ...prev, [slotId]: { ...prev[slotId], player: pendingPlayer } }));
      setJustDroppedSlot(slotId);
      setPendingPlayer(null);
    } else {
      setActiveSlot(prev => prev === slotId ? null : slotId);
    }
  }, [pendingPlayer]);

  const filledCount = useMemo(() =>
    Object.values(slotMap).filter(s => s.player).length,
    [slotMap]
  );

  return (
    <div className="min-h-screen bg-black text-white antialiased overflow-hidden"
      style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif" }}>

      <AnimatePresence mode="wait">

        {/* ═══ STEP 1 — FORMAÇÃO ════════════════════════════ */}
        {step === 'formation' && (
          <motion.div key="f-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="h-screen flex flex-col items-center justify-center p-6
              bg-[radial-gradient(ellipse_at_top,_#1a1a1a_0%,_#000_70%)]">

            <motion.img src={ESCUDO}
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="w-20 mb-6 drop-shadow-[0_0_24px_rgba(245,196,0,0.4)]"
              alt="Tigre" />

            <motion.span
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.5em] mb-3">
              ARENA TIGRE FC · MATCH SETUP
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="text-3xl md:text-5xl font-black italic mb-12 uppercase tracking-tighter text-center">
              ESCOLHA A FORMAÇÃO
            </motion.h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full">
              {Object.keys(FORMATIONS).map((f, i) => (
                <motion.button
                  key={f}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.06, type: 'spring', damping: 14 }}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setFormation(f); setStep('arena'); }}
                  className="relative px-8 py-7 bg-zinc-950/80 border border-white/10 rounded-2xl
                    font-black italic text-2xl tracking-tighter
                    hover:border-yellow-500 hover:bg-yellow-500/8
                    transition-all duration-300 group overflow-hidden">
                  <span className="relative z-10">{f}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 2 — ARENA ═══════════════════════════════ */}
        {step === 'arena' && (
          <motion.div key="a-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex h-screen relative">

            <MarketList
              players={PLAYERS_DATA}
              isEscalado={isEscalado}
              onSelect={handlePlayerSelection}
            />

            {/* CAMPO */}
            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">

              <img src={STADIUM_BG}
                className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
                alt="" />

              {/* Vinheta superior estilo broadcast */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/60 to-transparent pointer-events-none" />

              {/* HUD superior — estilo Champions League */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute top-4 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3">
                <div className="bg-zinc-950/90 backdrop-blur-md border border-yellow-500/30 rounded-full px-5 py-2 flex items-center gap-3
                  shadow-[0_0_20px_rgba(245,196,0,0.15)]">
                  <img src={ESCUDO} className="w-5 h-5" alt="" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500">
                    {formation}
                  </span>
                  <div className="w-px h-3 bg-white/20" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">
                    {filledCount}<span className="text-zinc-600">/11</span>
                  </span>
                </div>

                {/* Hint contextual */}
                {(activeSlot || pendingPlayer) && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-yellow-500/15 border border-yellow-500/40 rounded-full px-4 py-2
                      text-[9px] font-black uppercase tracking-widest text-yellow-500
                      shadow-[0_0_16px_rgba(245,196,0,0.3)]">
                    {pendingPlayer
                      ? `→ ${pendingPlayer.short} · CLIQUE NO SLOT`
                      : '→ ESCOLHA UM JOGADOR'}
                  </motion.div>
                )}
              </motion.div>

              {/* SLOTS */}
              <div className="relative w-full h-full max-w-4xl mx-auto">
                {Object.entries(slotMap).map(([id, state], idx) => (
                  <FieldSlot
                    key={id}
                    slotId={id}
                    state={state}
                    isActive={activeSlot === id}
                    isPending={!!pendingPlayer}
                    justDropped={justDroppedSlot === id}
                    index={idx}
                    onClick={() => handleSlotClick(id)}
                  />
                ))}
              </div>

              {/* Dock inferior estilo console */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100]
                  flex items-center gap-2 bg-zinc-950/90 backdrop-blur-2xl
                  border border-white/10 rounded-full p-1.5
                  shadow-[0_8px_40px_rgba(0,0,0,0.8)]">

                <button
                  onClick={() => setStep('formation')}
                  className="px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest
                    text-zinc-400 hover:text-white hover:bg-white/5 transition-all">
                  ← TÁTICA
                </button>

                <div className="w-px h-5 bg-white/10" />

                <motion.button
                  whileHover={{ scale: filledCount === 11 ? 1.04 : 1 }}
                  whileTap={{ scale: filledCount === 11 ? 0.96 : 1 }}
                  animate={filledCount === 11 ? {
                    boxShadow: [
                      '0 0 20px rgba(245,196,0,0.4)',
                      '0 0 36px rgba(245,196,0,0.8)',
                      '0 0 20px rgba(245,196,0,0.4)',
                    ],
                  } : {}}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  onClick={() => filledCount === 11 && setStep('final')}
                  disabled={filledCount < 11}
                  className={`px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                    ${filledCount === 11
                      ? 'bg-yellow-500 text-black hover:brightness-110'
                      : 'bg-white/5 text-zinc-600 cursor-not-allowed'}`}>
                  {filledCount === 11 ? '🚀 SALVAR TIME' : `${11 - filledCount} RESTANTES`}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 3 — FINAL ═══════════════════════════════ */}
        {step === 'final' && (
          <motion.div key="f-final"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-screen flex items-center justify-center bg-black p-6">

            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: -15 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: 'spring', damping: 16 }}
              className="bg-gradient-to-br from-zinc-900 to-black p-10 md:p-12 rounded-[40px]
                border border-yellow-500/30 text-center max-w-md
                shadow-[0_0_60px_rgba(245,196,0,0.15)]
                relative overflow-hidden">

              {/* Glow background */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-yellow-500 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-yellow-500 blur-3xl" />
              </div>

              <div className="relative">
                <motion.img src={ESCUDO}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                  className="w-16 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(245,196,0,0.5)]"
                  alt="" />

                <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                  ESCALAÇÃO CONFIRMADA
                </p>
                <h2 className="text-3xl md:text-4xl font-black italic text-white mb-8 uppercase tracking-tighter">
                  TIME <span className="text-yellow-500">ESCALADO!</span>
                </h2>

                <div className="p-6 bg-black/60 rounded-3xl mb-8 border border-yellow-500/15">
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em] mb-2">TÉCNICO</p>
                  <p className="text-2xl font-black italic text-white uppercase">Enderson Moreira</p>
                  <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-widest mt-2">
                    {formation} · {filledCount}/11
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => window.location.reload()}
                  className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl text-sm uppercase
                    tracking-widest shadow-lg shadow-yellow-500/20 hover:brightness-110 transition-all">
                  REINICIAR
                </motion.button>

                <p className="mt-6 text-[8px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
                  Criado por Felipe Makarios
                </p>
                <p className="text-[8px] text-yellow-500/40 font-black tracking-[0.4em] mt-1">
                  ARENA TIGRE FC
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
