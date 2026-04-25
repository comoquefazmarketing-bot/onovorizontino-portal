'use client';

/**
 * ArenaTigreFC — PERSPECTIVE ENGINE v2
 * Correção: profundidade visual real, escala por Y, Z-index hierárquico
 * Cards mais perto (goleiro) = maiores | Cards longe (ataque) = menores
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
interface Slot   { id: string; x: number; y: number; label: string; pos: string; }
interface ArenaProps { jogoId?: number; }

// ── Elenco completo (39 jogadores) ────────────────────────
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

// ── Formações com Y calibrado pra perspectiva cônica ────────
// Ataque y=12-22 (longe, no horizonte) → meio y=40-58 → defesa y=68-78 → goleiro y=86 (perto da câmera)
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
    { id:'rw',  x:80, y:24, pos:'ATA', label:'PD'  },
    { id:'st',  x:50, y:18, pos:'ATA', label:'CA'  },
    { id:'lw',  x:20, y:24, pos:'ATA', label:'PE'  },
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
    { id:'st1', x:40, y:20, pos:'ATA', label:'ATA' },
    { id:'st2', x:60, y:20, pos:'ATA', label:'ATA' },
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
    { id:'rw',  x:80, y:28, pos:'MEI', label:'PD'  },
    { id:'lw',  x:20, y:28, pos:'MEI', label:'PE'  },
    { id:'st',  x:50, y:14, pos:'ATA', label:'ATA' },
  ],
  '3-5-2': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:32, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:68, y:74, pos:'ZAG', label:'ZAG' },
    { id:'rm',  x:86, y:50, pos:'MEI', label:'AD'  },
    { id:'cm1', x:50, y:58, pos:'VOL', label:'VOL' },
    { id:'cm2', x:34, y:50, pos:'MEI', label:'MC'  },
    { id:'cm3', x:66, y:50, pos:'MEI', label:'MC'  },
    { id:'lm',  x:14, y:50, pos:'MEI', label:'AE'  },
    { id:'st1', x:40, y:20, pos:'ATA', label:'ATA' },
    { id:'st2', x:60, y:20, pos:'ATA', label:'ATA' },
  ],
  '3-4-3': [
    { id:'gk',  x:50, y:86, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:32, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:68, y:74, pos:'ZAG', label:'ZAG' },
    { id:'rm',  x:82, y:50, pos:'MEI', label:'MD'  },
    { id:'cm1', x:40, y:54, pos:'VOL', label:'VOL' },
    { id:'cm2', x:60, y:54, pos:'VOL', label:'VOL' },
    { id:'lm',  x:18, y:50, pos:'MEI', label:'ME'  },
    { id:'rw',  x:78, y:22, pos:'ATA', label:'PD'  },
    { id:'st',  x:50, y:16, pos:'ATA', label:'ATA' },
    { id:'lw',  x:22, y:22, pos:'ATA', label:'PE'  },
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
    { id:'st1', x:40, y:20, pos:'ATA', label:'ATA' },
    { id:'st2', x:60, y:20, pos:'ATA', label:'ATA' },
  ],
};

// ── Engine de perspectiva: escala por Y ─────────────────────
// y=14 (ataque, longe) → 0.78 | y=86 (goleiro, perto) → 1.18
function scalePorY(y: number): number {
  const min = 0.78, max = 1.18;
  const norm = Math.max(0, Math.min(1, (y - 14) / (86 - 14)));
  return min + norm * (max - min);
}

// ── Z-index hierárquico: quem está mais perto fica na frente ──
function zIndexPorY(y: number, ativo: boolean): number {
  if (ativo) return 999;
  return Math.round(100 + y);  // y=14 → z=114 | y=86 → z=186
}

// ── Card do mercado (drawer) ────────────────────────────────
function MarketCard({ player, onClick }: { player: Player; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-white/5 hover:border-yellow-500 cursor-pointer group shadow-2xl"
    >
      <img src={player.foto}
        className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition-all duration-500"
        alt={player.short}
        onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/40 to-transparent h-1/2" />
      <div className="absolute bottom-2 inset-x-0 text-center px-1">
        <p className="text-[10px] font-black text-white uppercase tracking-tighter truncate">{player.short}</p>
        <p className="text-yellow-500 text-[8px] font-bold tracking-widest">Nº {player.num}</p>
      </div>
      <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded-md border border-white/10 text-[7px] font-black text-white tracking-widest uppercase">
        {player.pos}
      </div>
    </motion.div>
  );
}

// ── Card do campo com perspectiva ──────────────────────────
function FieldCard({
  player, label, isSelected, onClick, scale, isCapitao, isHeroi,
}: {
  player: Player | null; label: string; isSelected: boolean; onClick: () => void;
  scale: number; isCapitao?: boolean; isHeroi?: boolean;
}) {
  const W = Math.round(64 * scale);
  const H = Math.round(86 * scale);

  return (
    <motion.div
      whileHover={{ scale: scale * 1.08 }}
      whileTap={{ scale: scale * 0.95 }}
      onClick={onClick}
      style={{
        width:  W,
        height: H,
        transform: `scale(1)`,  // o tamanho já vem em W/H
        transition: 'transform 0.3s, box-shadow 0.3s',
      }}
      className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer
        ${isSelected
          ? 'border-yellow-500 shadow-[0_0_30px_#F5C400]'
          : player
            ? 'border-white/30 shadow-2xl'
            : 'border-yellow-500/40 border-dashed bg-black/50 backdrop-blur-md'}`}
    >
      {/* Sombra projetada no chão (efeito mago de oz) */}
      <div style={{
        position: 'absolute',
        bottom: -4,
        left: '50%',
        width: W * 0.7,
        height: 5,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)',
        transform: 'translateX(-50%) translateY(100%)',
        filter: 'blur(2px)',
        pointerEvents: 'none',
      }} />

      {player ? (
        <>
          <img src={player.foto}
            className="absolute inset-0 w-full h-full object-cover object-top"
            alt={player.short}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />

          {isCapitao && (
            <div style={{
              position: 'absolute',
              top: 3 * scale, left: 3 * scale,
              width: 18 * scale, height: 18 * scale,
              fontSize: 10 * scale,
            }}
            className="bg-yellow-500 text-black font-black rounded-full flex items-center justify-center shadow-lg border border-black/20 z-10">
              C
            </div>
          )}

          {isHeroi && (
            <div style={{
              position: 'absolute',
              top: 3 * scale, right: 3 * scale,
              width: 18 * scale, height: 18 * scale,
              fontSize: 10 * scale,
            }}
            className="bg-cyan-500 text-black font-black rounded-full flex items-center justify-center shadow-lg border border-black/20 z-10">
              H
            </div>
          )}

          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            padding: `${3 * scale}px 0`,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(4px)',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}>
            <p style={{
              fontSize: 9 * scale,
              fontWeight: 900,
              color: '#fff',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              padding: `0 ${3 * scale}px`,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontFamily: "'Barlow Condensed',sans-serif",
            }}>
              {player.short}
            </p>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-yellow-500/40">
          <span style={{ fontSize: 28 * scale, fontWeight: 200, lineHeight: 1 }}>+</span>
          <span style={{
            fontSize: 8 * scale,
            fontWeight: 900,
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            marginTop: 2 * scale,
            fontFamily: "'Barlow Condensed',sans-serif",
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

  const filteredPlayers = useMemo(() =>
    filterPos ? PLAYERS.filter(p => p.pos === filterPos) : PLAYERS,
    [filterPos]
  );

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    if (activeSlot.startsWith('r')) {
      setReserves(prev => ({ ...prev, [activeSlot]: player }));
    } else {
      setLineup(prev => ({ ...prev, [activeSlot]: player }));
    }
    setActiveSlot(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans selection:bg-yellow-500">
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

        {/* ═══ STEP 2 — ARENA TIGRE FC ═════════════════════ */}
        {step === 'arena' && (
          <motion.div key="a-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex h-screen relative">

            {/* DRAWER MERCADO LATERAL */}
            <AnimatePresence>
              {activeSlot && (
                <motion.div
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30 }}
                  className="fixed inset-y-0 right-0 w-full lg:w-[450px] bg-black/95 backdrop-blur-3xl border-l border-white/10 z-[1000] flex flex-col">

                  <div className="p-7 bg-zinc-950 border-b border-white/5 flex justify-between items-center">
                    <div>
                      <h3 className="text-yellow-500 font-black italic text-3xl uppercase tracking-tighter">CONVOCAR</h3>
                      <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase mt-1">
                        {activeSlot.startsWith('r') ? `Reserva ${activeSlot.slice(1)}` : `Slot ${activeSlot}`}
                      </p>
                    </div>
                    <button onClick={() => setActiveSlot(null)}
                      className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                      ✕
                    </button>
                  </div>

                  <div className="flex gap-2 p-5 overflow-x-auto no-scrollbar bg-black/40">
                    {['TODOS','GOL','LAT','ZAG','VOL','MEI','ATA'].map(p => (
                      <button key={p}
                        onClick={() => setFilterPos(p === 'TODOS' ? null : p)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black border whitespace-nowrap transition-all ${
                          (filterPos === p) || (p === 'TODOS' && !filterPos)
                            ? 'bg-yellow-500 text-black border-yellow-500'
                            : 'bg-zinc-900/50 text-zinc-500 border-white/5 hover:border-yellow-500/30'
                        }`}>
                        {p}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 grid grid-cols-3 gap-4 pb-40">
                    {filteredPlayers.map(p => (
                      <MarketCard key={p.id} player={p} onClick={() => handleSelectPlayer(p)} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CAMPO PRINCIPAL */}
            <div className="flex-1 relative bg-black flex items-start justify-center overflow-hidden">

              {/* Background do estádio com overlay */}
              <img src={STADIUM_BG}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Arena Tigre FC" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

              {/* Container do campo (proporção e padding pra garantir espaço pro goleiro e ataque) */}
              <div className="relative w-full h-full max-w-[1400px]"
                style={{
                  paddingTop: '4vh',
                  paddingBottom: '20vh',  // espaço pra reservas + barra inferior
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
                          onClick={() => setActiveSlot(s.id)}
                          isCapitao={capitaoId === s.id}
                          isHeroi={heroiId === s.id}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BARRA INFERIOR FLUTUANTE — Reservas + Ações */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[96%] max-w-5xl flex flex-col gap-3"
                style={{ zIndex: 500 }}>

                {/* Reservas (semi-transparentes, não obstruem o goleiro) */}
                <div className="flex justify-center gap-2.5">
                  {Object.keys(reserves).map((rid, idx) => (
                    <motion.div key={rid}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setActiveSlot(rid)}
                      className={`cursor-pointer w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden backdrop-blur-md ${
                        activeSlot === rid
                          ? 'border-yellow-500 scale-110 shadow-[0_0_20px_#F5C400] z-50'
                          : reserves[rid]
                            ? 'border-white/40 bg-black/70'
                            : 'border-white/10 bg-black/50'
                      }`}>
                      {reserves[rid] ? (
                        <img src={reserves[rid]!.foto}
                          className="w-full h-full object-cover object-top"
                          alt={reserves[rid]!.short}
                          onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
                      ) : (
                        <span className="text-white/30 text-[10px] font-black tracking-widest">R{idx + 1}</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Painel de ação */}
                <div className="bg-zinc-900/85 backdrop-blur-2xl border border-white/10 p-4 rounded-3xl flex justify-between items-center shadow-2xl">
                  <div className="flex items-center gap-3">
                    <img src={ESCUDO} className="w-7 h-7" alt="Tigre" />
                    <div className="leading-tight">
                      <p className="text-white text-base font-black italic uppercase tracking-tighter">
                        ARENA TIGRE
                      </p>
                      <p className="text-[9px] font-black text-yellow-500 uppercase tracking-widest">
                        {filledCount}/11 TITULARES · {formation}
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
