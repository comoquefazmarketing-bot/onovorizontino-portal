'use client';

/**
 * ArenaTigreFC — REENGINEERED v3
 * Mercado fixo, perspectiva real, cards maiores, bug LD/PD corrigido
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Assets ────────────────────────────────────────────────
const BASE       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

// ── Tipos ─────────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step   = 'formation' | 'arena' | 'summary';
interface Slot { id: string; x: number; y: number; label: string; pos: string; }
interface ArenaProps { jogoId?: number; }

// ── 39 Jogadores ──────────────────────────────────────────
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
  { id:27, name:'Hector Bianchi',   short:'Hector',     num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:28, name:'Nogueira',         short:'Nogueira',   num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:29, name:'Luiz Gabriel',     short:'L.Gabriel',  num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:30, name:'Jhones Kauê',      short:'J.Kauê',     num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  { id:31, name:'Robson',           short:'Robson',     num:9,  pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva',   short:'V.Paiva',    num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges',     short:'H.Borges',   num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel',          short:'Jardiel',    num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca',   short:'N.Careca',   num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Titi Ortiz',       short:'Titi Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão',           short:'Carlão',     num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald',     num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ── Formações com clamping (ataque y=18 max, goleiro y=86) ──
const FORMATIONS: Record<string, Slot[]> = {
  '4-3-3': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'rb',  x:84, y:70, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:74, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:16, y:70, pos:'LAT', label:'LE'  },
    { id:'cm1', x:30, y:50, pos:'MEI', label:'MC'  },
    { id:'cm2', x:50, y:54, pos:'VOL', label:'VOL' },
    { id:'cm3', x:70, y:50, pos:'MEI', label:'MC'  },
    { id:'rw',  x:78, y:24, pos:'ATA', label:'PD'  },
    { id:'st',  x:50, y:18, pos:'ATA', label:'CA'  },
    { id:'lw',  x:22, y:24, pos:'ATA', label:'PE'  },
  ],
  '4-4-2': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'rb',  x:84, y:70, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:74, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:16, y:70, pos:'LAT', label:'LE'  },
    { id:'rm',  x:80, y:48, pos:'MEI', label:'MD'  },
    { id:'cm1', x:38, y:52, pos:'MEI', label:'MC'  },
    { id:'cm2', x:62, y:52, pos:'MEI', label:'MC'  },
    { id:'lm',  x:20, y:48, pos:'MEI', label:'ME'  },
    { id:'st1', x:40, y:22, pos:'ATA', label:'ATA' },
    { id:'st2', x:60, y:22, pos:'ATA', label:'ATA' },
  ],
  '4-2-3-1': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'rb',  x:84, y:70, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:74, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:16, y:70, pos:'LAT', label:'LE'  },
    { id:'dm1', x:38, y:58, pos:'VOL', label:'VOL' },
    { id:'dm2', x:62, y:58, pos:'VOL', label:'VOL' },
    { id:'am',  x:50, y:40, pos:'MEI', label:'MEI' },
    { id:'rw',  x:78, y:28, pos:'MEI', label:'PD'  },
    { id:'lw',  x:22, y:28, pos:'MEI', label:'PE'  },
    { id:'st',  x:50, y:18, pos:'ATA', label:'ATA' },
  ],
  '3-5-2': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:32, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:68, y:74, pos:'ZAG', label:'ZAG' },
    { id:'rm',  x:84, y:50, pos:'MEI', label:'AD'  },
    { id:'cm1', x:50, y:58, pos:'VOL', label:'VOL' },
    { id:'cm2', x:34, y:50, pos:'MEI', label:'MC'  },
    { id:'cm3', x:66, y:50, pos:'MEI', label:'MC'  },
    { id:'lm',  x:16, y:50, pos:'MEI', label:'AE'  },
    { id:'st1', x:40, y:22, pos:'ATA', label:'ATA' },
    { id:'st2', x:60, y:22, pos:'ATA', label:'ATA' },
  ],
  '3-4-3': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:32, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:68, y:74, pos:'ZAG', label:'ZAG' },
    { id:'rm',  x:80, y:50, pos:'MEI', label:'MD'  },
    { id:'cm1', x:40, y:54, pos:'VOL', label:'VOL' },
    { id:'cm2', x:60, y:54, pos:'VOL', label:'VOL' },
    { id:'lm',  x:20, y:50, pos:'MEI', label:'ME'  },
    { id:'rw',  x:76, y:22, pos:'ATA', label:'PD'  },
    { id:'st',  x:50, y:18, pos:'ATA', label:'ATA' },
    { id:'lw',  x:24, y:22, pos:'ATA', label:'PE'  },
  ],
  '5-3-2': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:76, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:33, y:76, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:67, y:76, pos:'ZAG', label:'ZAG' },
    { id:'rb',  x:88, y:68, pos:'LAT', label:'LD'  },
    { id:'lb',  x:12, y:68, pos:'LAT', label:'LE'  },
    { id:'cm1', x:36, y:52, pos:'MEI', label:'MC'  },
    { id:'cm2', x:64, y:52, pos:'MEI', label:'MC'  },
    { id:'cm3', x:50, y:56, pos:'VOL', label:'VOL' },
    { id:'st1', x:40, y:22, pos:'ATA', label:'ATA' },
    { id:'st2', x:60, y:22, pos:'ATA', label:'ATA' },
  ],
};

// ── Engine de perspectiva ────────────────────────────────
// scale = (y / 100) * 0.4 + 0.8  → y=18 → 0.872 | y=86 → 1.144
// Cards 30% maiores na base que o anterior
function scalePorY(y: number): number {
  return (y / 100) * 0.4 + 0.8;
}

function zIndexPorY(y: number, ativo: boolean): number {
  if (ativo) return 999;
  return Math.round(100 + y);
}

// ── Card do mercado (foto à esquerda, info à direita) ─────
function MarketCard({ player, onClick, isSelected }: { player: Player; onClick: () => void; isSelected: boolean }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative h-[88px] rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex items-stretch ${
        isSelected
          ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_16px_rgba(245,196,0,0.4)]'
          : 'border-white/10 bg-zinc-900/60 hover:border-yellow-500/40'
      }`}
    >
      {/* Foto à esquerda */}
      <div className="relative w-[88px] flex-shrink-0 overflow-hidden bg-black">
        <img src={player.foto}
          className="absolute inset-0 w-full h-full object-cover object-top"
          alt={player.short}
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
        <div className="absolute top-1 left-1 bg-black/85 px-1.5 py-0.5 rounded text-[7px] font-black text-white tracking-widest uppercase">
          {player.pos}
        </div>
      </div>

      {/* Info à direita */}
      <div className="flex-1 px-3 py-2 flex flex-col justify-between min-w-0">
        <div>
          <p className="text-[12px] font-black text-white uppercase tracking-tight truncate leading-tight">
            {player.short}
          </p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider truncate">
            {player.name}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-yellow-500 text-[14px] font-black italic tracking-tighter">
            {player.num}
          </span>
          <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">
            ESCALAR →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── FieldCard com perspectiva e foto centralizada ─────────
function FieldCard({
  player, label, isSelected, onClick, scale, isCapitao, isHeroi,
}: {
  player: Player | null; label: string; isSelected: boolean; onClick: () => void;
  scale: number; isCapitao?: boolean; isHeroi?: boolean;
}) {
  // Tamanho base aumentado: 80×108 (era 64×86)
  const W = Math.round(80 * scale);
  const H = Math.round(108 * scale);

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{ width: W, height: H, fontFamily: "'Barlow Condensed',sans-serif" }}
      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300
        ${isSelected
          ? 'border-yellow-500 shadow-[0_0_30px_rgba(245,196,0,0.7)]'
          : player
            ? 'border-white/30 shadow-[0_8px_20px_rgba(0,0,0,0.7)]'
            : 'border-yellow-500/40 border-dashed bg-black/55 backdrop-blur-md'}`}
    >
      {/* Sombra projetada no chão */}
      <div style={{
        position: 'absolute',
        bottom: -6,
        left: '50%',
        width:  W * 0.7,
        height: 6,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)',
        transform: 'translateX(-50%) translateY(100%)',
        filter: 'blur(2.5px)',
        pointerEvents: 'none',
      }} />

      {player ? (
        <>
          {/* Foto centralizada no card vertical, leve ajuste à direita pra rosto em evidência */}
          <img src={player.foto}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '55% 12%' }}
            alt={player.short}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />

          {/* Gradiente bottom pra legibilidade do nome */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />

          {isCapitao && (
            <div style={{
              position:'absolute', top: 4 * scale, left: 4 * scale,
              width: 20 * scale, height: 20 * scale,
              fontSize: 11 * scale,
            }}
            className="bg-yellow-500 text-black font-black rounded-full flex items-center justify-center shadow-lg border-2 border-black/30 z-10">
              C
            </div>
          )}

          {isHeroi && (
            <div style={{
              position:'absolute', top: 4 * scale, right: 4 * scale,
              width: 20 * scale, height: 20 * scale,
              fontSize: 11 * scale,
            }}
            className="bg-cyan-500 text-black font-black rounded-full flex items-center justify-center shadow-lg border-2 border-black/30 z-10">
              H
            </div>
          )}

          {/* Banner do nome — agora maior e centralizado */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: `${5 * scale}px ${4 * scale}px`,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}>
            <p style={{
              fontSize: 11 * scale,
              fontWeight: 900,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              lineHeight: 1.1,
            }}>
              {player.short}
            </p>
            <p style={{
              fontSize: 8 * scale,
              fontWeight: 700,
              color: '#F5C400',
              textAlign: 'center',
              letterSpacing: '0.15em',
              marginTop: 1,
            }}>
              {player.pos} · {player.num}
            </p>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-yellow-500/50">
          <span style={{ fontSize: 32 * scale, fontWeight: 200, lineHeight: 1 }}>+</span>
          <span style={{
            fontSize: 9 * scale,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginTop: 4,
          }}>{label}</span>
        </div>
      )}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ══════════════════════════════════════════════════════════
export default function EscalacaoFormacao({ jogoId }: ArenaProps) {
  const [step,        setStep]        = useState<Step>('formation');
  const [formation,   setFormation]   = useState<keyof typeof FORMATIONS>('4-3-3');
  const [lineup,      setLineup]      = useState<Lineup>({});
  const [reserves,    setReserves]    = useState<Lineup>({ r1:null, r2:null, r3:null, r4:null, r5:null });
  const [capitaoId,   setCapitaoId]   = useState<string | null>(null);
  const [heroiId,     setHeroiId]     = useState<string | null>(null);
  const [activeSlot,  setActiveSlot]  = useState<string | null>(null);
  const [filterPos,   setFilterPos]   = useState<string | null>(null);

  const slots       = useMemo(() => FORMATIONS[formation], [formation]);
  const filledCount = Object.values(lineup).filter(Boolean).length;

  // Filtro automático por posição quando seleciona um slot
  const autoFilter = useMemo(() => {
    if (!activeSlot) return null;
    if (activeSlot.startsWith('r')) return null;
    return slots.find(s => s.id === activeSlot)?.pos ?? null;
  }, [activeSlot, slots]);

  const filteredPlayers = useMemo(() => {
    const pos = filterPos ?? autoFilter;
    return pos ? PLAYERS.filter(p => p.pos === pos) : PLAYERS;
  }, [filterPos, autoFilter]);

  // ══ BUG FIX CRÍTICO ══════════════════════════════════════
  // Identifica corretamente lineup vs reserves olhando o ID do slot
  // r1-r5 = reserves | qualquer outro = lineup
  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;

    const isReserveSlot = /^r[1-5]$/.test(activeSlot);

    if (isReserveSlot) {
      setReserves(prev => ({ ...prev, [activeSlot]: player }));
    } else {
      setLineup(prev => ({ ...prev, [activeSlot]: player }));
    }
    // Não fecha o mercado — mantém para escalação rápida em sequência
    setActiveSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-yellow-500"
      style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif" }}>

      <AnimatePresence mode="wait">

        {/* ═══ STEP 1 — FORMAÇÃO ════════════════════════════ */}
        {step === 'formation' && (
          <motion.div key="f-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
            <img src={ESCUDO} className="w-24 mb-10" alt="Tigre" />
            <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter mb-12 text-center uppercase">
              ESCOLHA A TÁTICA
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-3xl">
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setStep('arena'); }}
                  className="py-10 rounded-3xl font-black text-4xl border-2 border-white/5 bg-zinc-900/40 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all italic">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 2 — ARENA com Mercado FIXO ═════════════ */}
        {step === 'arena' && (
          <motion.div key="a-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex h-screen relative">

            {/* CAMPO PRINCIPAL (esquerda, ocupa o que sobra) */}
            <div className="flex-1 relative bg-black flex items-start justify-center overflow-hidden">

              <img src={STADIUM_BG}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Arena Tigre FC" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

              {/* Container do campo com padding pra ataque/goleiro respirarem */}
              <div className="relative w-full h-full"
                style={{
                  paddingTop:    '3vh',
                  paddingBottom: '14vh',  // espaço pra reservas + barra inferior
                }}>
                <div className="relative w-full h-full">
                  {slots.map((s) => {
                    const scale = scalePorY(s.y);
                    const z     = zIndexPorY(s.y, activeSlot === s.id);
                    return (
                      <div key={s.id}
                        className="absolute"
                        style={{
                          left: `${s.x}%`,
                          top:  `${s.y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: z,
                        }}>
                        <FieldCard
                          player={lineup[s.id] || null}
                          label={s.label}
                          isSelected={activeSlot === s.id}
                          scale={scale}
                          onClick={() => { setActiveSlot(s.id); setFilterPos(null); }}
                          isCapitao={capitaoId === s.id}
                          isHeroi={heroiId === s.id}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BARRA INFERIOR — Reservas + Ações */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[96%] flex flex-col gap-2.5"
                style={{ zIndex: 500, maxWidth: 720 }}>

                {/* Reservas */}
                <div className="flex justify-center gap-2">
                  {Object.keys(reserves).map((rid, idx) => (
                    <motion.div key={rid}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => { setActiveSlot(rid); setFilterPos(null); }}
                      className={`cursor-pointer w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden backdrop-blur-md ${
                        activeSlot === rid
                          ? 'border-yellow-500 scale-110 shadow-[0_0_20px_rgba(245,196,0,0.6)] z-50'
                          : reserves[rid]
                            ? 'border-white/40 bg-black/70'
                            : 'border-white/10 bg-black/50'
                      }`}>
                      {reserves[rid] ? (
                        <img src={reserves[rid]!.foto}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: '55% 15%' }}
                          alt={reserves[rid]!.short}
                          onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
                      ) : (
                        <span className="text-white/30 text-[10px] font-black tracking-widest">R{idx + 1}</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Painel de ação */}
                <div className="bg-zinc-900/85 backdrop-blur-2xl border border-white/10 p-3 rounded-2xl flex justify-between items-center shadow-2xl">
                  <div className="flex items-center gap-3">
                    <img src={ESCUDO} className="w-7 h-7" alt="Tigre" />
                    <div className="leading-tight">
                      <p className="text-white text-base font-black italic uppercase tracking-tighter">
                        ARENA TIGRE
                      </p>
                      <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">
                        {filledCount}/11 · {formation}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setStep('formation')}
                      className="px-4 py-2.5 rounded-xl bg-white/5 text-[10px] font-black border border-white/5 hover:border-white/20 tracking-widest">
                      TÁTICA
                    </button>
                    {filledCount === 11 && (
                      <motion.button
                        animate={{ boxShadow: ['0 0 20px rgba(245,196,0,0.4)','0 0 40px rgba(245,196,0,0.8)','0 0 20px rgba(245,196,0,0.4)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        onClick={() => setStep('summary')}
                        className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-black italic uppercase text-sm tracking-tighter">
                        PRÓXIMO →
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* MERCADO TIGRE — SIDEBAR FIXA À DIREITA */}
            <aside className="w-[340px] xl:w-[380px] flex-shrink-0 bg-black border-l border-white/10 flex flex-col h-screen">

              {/* Header */}
              <div className="p-4 bg-zinc-950 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-yellow-500 font-black italic text-2xl uppercase tracking-tighter">
                    MERCADO TIGRE
                  </h3>
                  <span className="bg-yellow-500/15 text-yellow-500 text-[10px] font-black px-3 py-1 rounded-full tracking-widest">
                    {filteredPlayers.length}
                  </span>
                </div>

                {activeSlot && (
                  <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                    → ESCOLHA UM JOGADOR PARA O SLOT {activeSlot.startsWith('r')
                      ? `RESERVA ${activeSlot.slice(1)}`
                      : (slots.find(s => s.id === activeSlot)?.label ?? activeSlot.toUpperCase())}
                  </p>
                )}
              </div>

              {/* Filtros de posição */}
              <div className="flex gap-1.5 p-3 overflow-x-auto no-scrollbar bg-zinc-950/50 border-b border-white/5">
                {['TODOS','GOL','LAT','ZAG','VOL','MEI','ATA'].map(p => {
                  const ativo = (filterPos === p) || (p === 'TODOS' && !filterPos);
                  return (
                    <button key={p}
                      onClick={() => setFilterPos(p === 'TODOS' ? null : p)}
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-[10px] font-black border whitespace-nowrap transition-all tracking-widest ${
                        ativo
                          ? 'bg-yellow-500 text-black border-yellow-500'
                          : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-yellow-500/30 hover:text-yellow-500'
                      }`}>
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Grid de cards (foto à esquerda, info à direita) */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredPlayers.map(p => {
                  const escalado = Object.values(lineup).some(l => l?.id === p.id)
                    || Object.values(reserves).some(r => r?.id === p.id);
                  return (
                    <MarketCard
                      key={p.id}
                      player={p}
                      isSelected={escalado}
                      onClick={() => activeSlot ? handleSelectPlayer(p) : null}
                    />
                  );
                })}
              </div>

              {/* Hint de uso */}
              {!activeSlot && (
                <div className="p-3 bg-zinc-950 border-t border-white/5 text-center">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                    Clique num slot do campo para escalar
                  </p>
                </div>
              )}
            </aside>
          </motion.div>
        )}

        {/* ═══ STEP 3 — RESUMO ═════════════════════════════ */}
        {step === 'summary' && (
          <motion.div key="s-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6">
            <h2 className="text-3xl font-black italic uppercase mb-6">TIME ESCALADO!</h2>
            <button onClick={() => setStep('arena')}
              className="text-zinc-500 text-xs font-black uppercase tracking-widest hover:text-yellow-500">
              ← Voltar à Arena
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
