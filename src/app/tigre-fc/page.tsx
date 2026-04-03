'use client';

/**
 * tigre-fc/page.tsx — v2.0
 * 
 * Integração completa com:
 *   - useEscalacao: auto-save + load persistente
 *   - SaveStatusBadge: feedback visual do save em tempo real
 *   - VFX: Shockwave ao encher o time (isFullTeam), partículas de encaixe
 *   - Botões de Capitão/Herói com spring animation e glow neon
 */

import React, { useState, useMemo, useEffect, use } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import FinalCardReveal from '@/components/tigre-fc/FinalCardReveal';
import { useEscalacao, Player } from '@/hooks/useEscalacao'; // Ajuste path

// ─── Dados ────────────────────────────────────────────────────────────────────

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const TEXTURA_GRAMADO = 'https://www.transparenttextures.com/patterns/dark-dotted-2.png';

const PLAYERS: Player[] = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
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
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',    num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, any[]> = {
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'rb',  x: 82, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 58, pos: 'MEI' }, { id: 'dm2', x: 65, y: 58, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' }, { id: 'rw',  x: 82, y: 30, pos: 'ATA' }, { id: 'lw', x: 18, y: 30, pos: 'ATA' },
    { id: 'st',  x: 50, y: 15, pos: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk',  x: 50, y: 85, pos: 'GOL' },
    { id: 'rb',  x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb', x: 18, y: 65, pos: 'LAT' },
    { id: 'm1',  x: 50, y: 50, pos: 'MEI' }, { id: 'm2', x: 75, y: 42, pos: 'MEI' }, { id: 'm3', x: 25, y: 42, pos: 'MEI' },
    { id: 'st',  x: 50, y: 12, pos: 'ATA' }, { id: 'rw', x: 82, y: 20, pos: 'ATA' }, { id: 'lw', x: 18, y: 20, pos: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'rb',  x: 85, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 15, y: 68, pos: 'LAT' },
    { id: 'm1',  x: 20, y: 48, pos: 'MEI' }, { id: 'm2', x: 40, y: 48, pos: 'MEI' }, { id: 'm3', x: 60, y: 48, pos: 'MEI' }, { id: 'm4', x: 80, y: 48, pos: 'MEI' },
    { id: 'st1', x: 35, y: 18, pos: 'ATA' }, { id: 'st2', x: 65, y: 18, pos: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 75, y: 72, pos: 'ZAG' }, { id: 'cb3', x: 25, y: 72, pos: 'ZAG' },
    { id: 'm1',  x: 50, y: 52, pos: 'MEI' }, { id: 'm2', x: 25, y: 48, pos: 'MEI' }, { id: 'm3', x: 75, y: 48, pos: 'MEI' }, { id: 'm4', x: 10, y: 38, pos: 'MEI' }, { id: 'm5', x: 90, y: 38, pos: 'MEI' },
    { id: 'st1', x: 40, y: 18, pos: 'ATA' }, { id: 'st2', x: 60, y: 18, pos: 'ATA' },
  ],
  '5-4-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 78, pos: 'ZAG' }, { id: 'cb2', x: 70, y: 75, pos: 'ZAG' }, { id: 'cb3', x: 30, y: 75, pos: 'ZAG' }, { id: 'rb', x: 88, y: 68, pos: 'LAT' }, { id: 'lb', x: 12, y: 68, pos: 'LAT' },
    { id: 'm1',  x: 35, y: 48, pos: 'MEI' }, { id: 'm2', x: 65, y: 48, pos: 'MEI' }, { id: 'm3', x: 15, y: 42, pos: 'MEI' }, { id: 'm4', x: 85, y: 42, pos: 'MEI' },
    { id: 'st',  x: 50, y: 18, pos: 'ATA' },
  ],
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

// Badge de status de save em tempo real
function SaveStatusBadge({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  const config = {
    saving: { text: 'Salvando...', color: 'text-zinc-500', dot: 'bg-zinc-500 animate-pulse' },
    saved:  { text: 'Salvo ✓',    color: 'text-green-500', dot: 'bg-green-500' },
    error:  { text: 'Erro ao salvar', color: 'text-red-400', dot: 'bg-red-400' },
  };
  const c = config[status];
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center gap-1.5"
      >
        <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
        <span className={`text-[9px] font-black uppercase tracking-widest ${c.color}`}>{c.text}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// Campo de Jogo com efeito 3D e linhas neon
function CampoFifa() {
  return (
    <div className="absolute inset-0" style={{ perspective: '2000px' }}>
      <div className="absolute inset-0 bg-[#1e5c1e] rounded-xl overflow-hidden shadow-2xl border-2 border-white/10"
        style={{ transform: 'rotateX(40deg)', transformStyle: 'preserve-3d' }}>
        
        {/* Sombra projetada do campo (efeito 3D flutuante) */}
        <div className="absolute inset-0 flex flex-col">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-[#246b24]' : ''}`} />
          ))}
        </div>

        {/* Textura */}
        <div className="absolute inset-0 opacity-15 bg-repeat"
          style={{ backgroundImage: `url(${TEXTURA_GRAMADO})` }} />

        {/* Linhas do campo com glow neon dourado */}
        <div className="absolute inset-4 border border-white/30"
          style={{ boxShadow: '0 0 8px rgba(245,196,0,0.15), inset 0 0 8px rgba(245,196,0,0.08)' }} />
        <div className="absolute top-1/2 left-4 right-4 h-px bg-white/30"
          style={{ boxShadow: '0 0 6px rgba(245,196,0,0.2)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border border-white/30 rounded-full"
          style={{ boxShadow: '0 0 10px rgba(245,196,0,0.15)' }} />

        {/* Iluminação de refletores (floodlights) */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 15% 10%, rgba(255,253,200,0.15) 0%, transparent 45%),
              radial-gradient(circle at 85% 10%, rgba(200,240,255,0.15) 0%, transparent 45%),
              radial-gradient(center, rgba(255,255,255,0.05) 0%, transparent 70%)
            `,
            mixBlendMode: 'screen',
          }} />
      </div>
    </div>
  );
}

// Card de jogador — versão campo com fade-in spring ao encaixar
function PlayerCard({ player, size, isCaptain, isHero, isField, isNew }: any) {
  return (
    <motion.div
      initial={isNew ? { scale: 0.2, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className="relative"
      style={{ width: size }}
    >
      <div className={`bg-zinc-900 rounded-lg overflow-hidden border ${
        isCaptain ? 'border-yellow-500 shadow-[0_0_18px_rgba(245,196,0,0.7)]' :
        isHero    ? 'border-cyan-400  shadow-[0_0_18px_rgba(0,243,255,0.7)]'  :
                    'border-zinc-800'
      }`} style={{ height: size * 1.3 }}>
        <img
          src={player.foto}
          className="w-full h-full object-cover"
          style={{ objectPosition: isField ? 'center top' : 'left top' }}
          alt={player.short}
        />
        <div className="absolute bottom-0 w-full bg-black/85 py-1 text-center">
          <div className="text-yellow-500 text-[6px] font-black">{player.pos}</div>
          <div className="text-white text-[8px] font-black uppercase truncate px-1">{player.short}</div>
        </div>
        {isCaptain && (
          <div className="absolute top-1 right-1 bg-yellow-500 text-black text-[7px] font-black rounded px-1 leading-tight">C</div>
        )}
        {isHero && (
          <div className="absolute top-1 right-1 bg-cyan-400 text-black text-[7px] font-black rounded px-1 leading-tight">H</div>
        )}
      </div>
    </motion.div>
  );
}

// Shockwave overlay quando o time está completo
function ShockwaveEffect({ trigger }: { trigger: boolean }) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 4, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none z-50"
          style={{
            background: 'radial-gradient(circle, rgba(245,196,0,0.6) 0%, transparent 70%)',
            boxShadow: '0 0 80px 40px rgba(245,196,0,0.3)',
          }}
        />
      )}
    </AnimatePresence>
  );
}

// Botão de Capitão / Herói com animação de spring e glow pulsante
function CapHeroButton({ type, player, isActive, onSelect }: {
  type: 'CAPTAIN' | 'HERO';
  player?: Player | null;
  isActive: boolean;
  onSelect: () => void;
}) {
  const isGold = type === 'CAPTAIN';
  const borderColor = isGold ? 'rgba(245,196,0,0.8)' : 'rgba(0,243,255,0.8)';
  const glowColor   = isGold ? 'rgba(245,196,0,0.4)' : 'rgba(0,243,255,0.4)';
  const textColor   = isGold ? 'text-yellow-500' : 'text-cyan-400';

  return (
    <motion.button
      initial={{ y: 80, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 150, delay: isGold ? 0 : 0.1 }}
      onClick={onSelect}
      className={`relative flex-1 p-4 rounded-xl border-2 transition-all active:scale-95 overflow-hidden`}
      style={{
        borderColor: isActive ? borderColor : 'rgba(63,63,70,0.8)',
        background: isActive ? `${glowColor.replace('0.4', '0.08')}` : 'rgba(9,9,11,0.9)',
        boxShadow: isActive ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor.replace('0.4', '0.15')}` : 'none',
      }}
    >
      {/* Glow pulsante animado */}
      {isActive && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 rounded-xl"
          style={{ background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)` }}
        />
      )}
      <div className="relative z-10">
        <span className={`block text-[9px] font-black uppercase tracking-widest ${textColor}`}>
          {isGold ? '© Capitão' : '⭐ Herói'}
        </span>
        <span className="text-white text-xs font-bold truncate">
          {player?.short ?? 'Selecionar no campo'}
        </span>
      </div>
    </motion.button>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const jogoRef        = resolvedParams?.jogoId;

  // Hook de persistência — gerencia save/load automaticamente
  const esc = useEscalacao(jogoRef);

  const [selectedSlot,  setSelectedSlot]  = useState<string | null>(null);
  const [filterPos,     setFilterPos]     = useState('TODOS');
  const [specialMode,   setSpecialMode]   = useState<'CAPTAIN' | 'HERO' | null>(null);
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [shockwaveFired, setShockwaveFired] = useState(false);
  const [prevFullTeam,  setPrevFullTeam]  = useState(false);

  const currentFormation = useMemo(() => FORMATIONS[esc.formacao] ?? FORMATIONS['4-2-3-1'], [esc.formacao]);

  const isFullTeam = useMemo(
    () => currentFormation.every(slot => !!esc.lineup[slot.id]),
    [esc.lineup, currentFormation]
  );

  // Dispara shockwave exatamente quando o time fica completo
  useEffect(() => {
    if (isFullTeam && !prevFullTeam) {
      setShockwaveFired(true);
      setTimeout(() => setShockwaveFired(false), 1000);
    }
    setPrevFullTeam(isFullTeam);
  }, [isFullTeam, prevFullTeam]);

  // Jogadores já escalados ficam ocultos no mercado
  const filteredPlayers = useMemo(() => {
    const usedIds = new Set(
      Object.values(esc.lineup).filter(Boolean).map(p => p!.id)
    );
    return PLAYERS.filter(p =>
      !usedIds.has(p.id) &&
      (filterPos === 'TODOS' || p.pos === filterPos)
    );
  }, [esc.lineup, filterPos]);

  const captainPlayer = useMemo(
    () => Object.values(esc.lineup).find(p => p?.id === esc.captainId) ?? null,
    [esc.lineup, esc.captainId]
  );
  const heroPlayer = useMemo(
    () => Object.values(esc.lineup).find(p => p?.id === esc.heroId) ?? null,
    [esc.lineup, esc.heroId]
  );

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSlotClick = (slotId: string) => {
    const playerInSlot = esc.lineup[slotId];
    if (specialMode === 'CAPTAIN' && playerInSlot) {
      esc.setCaptainId(playerInSlot.id); setSpecialMode(null); return;
    }
    if (specialMode === 'HERO' && playerInSlot) {
      esc.setHeroId(playerInSlot.id); setSpecialMode(null); return;
    }
    setSelectedSlot(slotId);
  };

  const handleSelectPlayer = (player: Player) => {
    if (!selectedSlot) return;
    esc.setPlayerInSlot(selectedSlot, player);
    setSelectedSlot(null);
  };

  const handleLockScore = async () => {
    await esc.lockScore();
    confetti({
      particleCount: 120, spread: 70, origin: { y: 0.75 },
      colors: ['#F5C400', '#22C55E', '#ffffff'],
    });
  };

  // ── Loading Skeleton ─────────────────────────────────────────────────────────
  if (esc.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Carregando sua escalação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black text-white p-4 gap-6">

      {/* ── EFEITO SHOCKWAVE GLOBAL ─────────────────────────────────── */}
      <ShockwaveEffect trigger={shockwaveFired} />

      {/* ── MERCADO (Esquerda) ──────────────────────────────────────── */}
      <section className="flex-1 bg-zinc-900/20 rounded-[2.5rem] p-6 border border-white/5 h-[85vh] overflow-hidden flex flex-col">

        {/* Header do Mercado */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Tática</h2>
              <SaveStatusBadge status={esc.saveStatus} />
            </div>
            <select
              value={esc.formacao}
              onChange={e => esc.setFormacao(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs font-black text-white outline-none hover:border-zinc-600 transition"
            >
              {Object.keys(FORMATIONS).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black italic uppercase tracking-tighter text-zinc-500">Mercado</h3>
            <select
              onChange={e => setFilterPos(e.target.value)}
              className="bg-black border border-zinc-800 rounded-xl px-4 py-2 text-xs font-black text-yellow-500 outline-none hover:border-zinc-600 transition"
            >
              <option value="TODOS">TODOS JOGADORES</option>
              <option value="GOL">GOLEIROS</option>
              <option value="ZAG">ZAGUEIROS</option>
              <option value="LAT">LATERAIS</option>
              <option value="MEI">MEIO-CAMPO</option>
              <option value="ATA">ATACANTES</option>
            </select>
          </div>
        </div>

        {/* Grid de jogadores */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 overflow-y-auto pr-1 custom-scrollbar">
          {filteredPlayers.map(p => (
            <motion.div
              key={p.id}
              onClick={() => handleSelectPlayer(p)}
              whileHover={{ scale: 1.08, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <PlayerCard player={p} size={80} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CAMPO E FLUXO (Direita) ─────────────────────────────────── */}
      <section className="flex-[1.4] flex flex-col items-center">

        {/* CAMPO */}
        <div className={`relative w-full max-w-[540px] aspect-[1/1.3] mb-8 transition-opacity duration-300 ${specialMode ? 'opacity-50' : 'opacity-100'}`}>
          <CampoFifa />
          <div className="absolute inset-0 z-10">
            {currentFormation.map(slot => {
              const player = esc.lineup[slot.id];
              return (
                <div
                  key={slot.id}
                  onClick={() => handleSlotClick(slot.id)}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
                >
                  {player ? (
                    <PlayerCard
                      player={player}
                      size={65}
                      isField
                      isCaptain={esc.captainId === player.id}
                      isHero={esc.heroId === player.id}
                    />
                  ) : (
                    <div className={`w-11 h-14 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                      selectedSlot === slot.id
                        ? 'border-yellow-500 bg-yellow-500/25 shadow-[0_0_12px_rgba(245,196,0,0.4)]'
                        : 'border-white/10 bg-black/40 hover:border-white/20'
                    }`}>
                      <span className="text-[9px] font-black text-zinc-600">{slot.pos}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* FLUXO FINAL — aparece ao completar o time */}
        <AnimatePresence>
          {isFullTeam && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-md space-y-5"
            >

              {/* Botões Capitão / Herói com spring */}
              <div className="flex gap-3">
                <CapHeroButton
                  type="CAPTAIN"
                  player={captainPlayer}
                  isActive={!!captainPlayer}
                  onSelect={() => setSpecialMode('CAPTAIN')}
                />
                <CapHeroButton
                  type="HERO"
                  player={heroPlayer}
                  isActive={!!heroPlayer}
                  onSelect={() => setSpecialMode('HERO')}
                />
              </div>

              {/* Instrução contextual */}
              {specialMode && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[10px] font-black uppercase tracking-widest text-yellow-500 animate-pulse"
                >
                  {specialMode === 'CAPTAIN' ? '© Clique no Capitão no campo' : '⭐ Clique no Herói no campo'}
                </motion.p>
              )}

              {/* Placar — só aparece após definir capitão e herói */}
              <AnimatePresence>
                {esc.captainId && esc.heroId && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-zinc-950 rounded-3xl border border-white/5 p-6 space-y-4"
                    style={{
                      boxShadow: esc.scoreLocked
                        ? '0 0 30px rgba(34,197,94,0.15)'
                        : '0 0 20px rgba(0,0,0,0.5)',
                      borderColor: esc.scoreLocked ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <p className="text-center text-[9px] font-black uppercase tracking-[0.4em] text-zinc-600">Palpite do Placar</p>
                    <div className="flex items-center justify-around">
                      <div className="text-center">
                        <span className="text-[9px] font-black text-yellow-500 uppercase block mb-1">Tigre</span>
                        <input
                          type="number"
                          value={esc.scoreTigre}
                          onChange={e => esc.setScore(parseInt(e.target.value) || 0, esc.scoreAdv)}
                          disabled={esc.scoreLocked}
                          className="bg-black/80 w-16 h-16 text-3xl font-black text-center rounded-xl outline-none focus:border-yellow-500 border border-transparent transition disabled:opacity-60"
                        />
                      </div>
                      <span className="text-zinc-800 font-black text-2xl italic mt-6">VS</span>
                      <div className="text-center">
                        <span className="text-[9px] font-black text-zinc-500 uppercase block mb-1">Adv</span>
                        <input
                          type="number"
                          value={esc.scoreAdv}
                          onChange={e => esc.setScore(esc.scoreTigre, parseInt(e.target.value) || 0)}
                          disabled={esc.scoreLocked}
                          className="bg-black/80 w-16 h-16 text-3xl font-black text-center rounded-xl outline-none focus:border-yellow-500 border border-transparent transition disabled:opacity-60"
                        />
                      </div>
                    </div>

                    {!esc.scoreLocked ? (
                      <button
                        onClick={handleLockScore}
                        className="w-full py-3.5 bg-white text-black font-black uppercase text-xs rounded-xl active:scale-95 hover:bg-yellow-500 transition-all"
                      >
                        CRAVAR PALPITE →
                      </button>
                    ) : (
                      <div className="w-full py-3.5 bg-green-500/15 border border-green-500/30 text-green-400 font-black text-xs text-center rounded-xl uppercase tracking-widest">
                        ✓ Palpite Registrado
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FINALIZAR */}
              <motion.button
                disabled={!esc.scoreLocked}
                onClick={() => setShowFinalCard(true)}
                animate={esc.scoreLocked ? { scale: [1, 1.03, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all ${
                  esc.scoreLocked
                    ? 'bg-yellow-500 text-black shadow-[0_10px_40px_rgba(245,196,0,0.4)]'
                    : 'bg-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed'
                }`}
              >
                Finalizar Escalação →
              </motion.button>

            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* MODAL FINAL */}
      {showFinalCard && (
        <FinalCardReveal
          lineup={esc.lineup}
          formation={currentFormation}
          captainId={esc.captainId}
          heroId={esc.heroId}
          scoreTigre={esc.scoreTigre}
          scoreAdversario={esc.scoreAdv}
          onClose={() => setShowFinalCard(false)}
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
}
