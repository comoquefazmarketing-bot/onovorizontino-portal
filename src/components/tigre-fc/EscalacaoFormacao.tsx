'use client';

/**
 * ArenaTigreFC v4 — FINAL EDITION
 * - Bloco recuado pro centro do campo
 * - Cards 15% maiores com drop-shadow
 * - Step Resumo com Capitão/Herói/Palpite/Card final FIFA
 * - Mercado fixo desktop, drawer mobile
 * - Créditos: Felipe Makarios
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Assets ────────────────────────────────────────────────
const BASE       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const SUPA_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Tipos ─────────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type Lineup = Record<string, Player | null>;
type Step   = 'formation' | 'arena' | 'summary';
interface Slot { id: string; x: number; y: number; label: string; pos: string; }
interface ArenaProps { jogoId?: number; }
interface Jogo {
  id: number;
  competicao?: string;
  rodada?: string;
  data_hora?: string;
  mandante?:  { nome: string; escudo_url: string | null; sigla?: string | null };
  visitante?: { nome: string; escudo_url: string | null; sigla?: string | null };
}

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

// ── 6 Formações com BLOCO RECUADO ──────────────────────────
// Ataque y mínimo 25-28 (recuado 30%)
// Pontas X centralizado em 20% (era 78/22 → agora 70/30)
// Laterais X reduzidos 10% (era 84/16 → agora 80/20)
// Goleiro y=82
const FORMATIONS: Record<string, Slot[]> = {
  '4-3-3': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'rb',  x:80, y:68, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:72, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:20, y:68, pos:'LAT', label:'LE'  },
    { id:'cm1', x:32, y:50, pos:'MEI', label:'MC'  },
    { id:'cm2', x:50, y:54, pos:'VOL', label:'VOL' },
    { id:'cm3', x:68, y:50, pos:'MEI', label:'MC'  },
    { id:'rw',  x:70, y:30, pos:'ATA', label:'PD'  },
    { id:'st',  x:50, y:25, pos:'ATA', label:'CA'  },
    { id:'lw',  x:30, y:30, pos:'ATA', label:'PE'  },
  ],
  '4-4-2': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'rb',  x:80, y:68, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:72, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:20, y:68, pos:'LAT', label:'LE'  },
    { id:'rm',  x:75, y:48, pos:'MEI', label:'MD'  },
    { id:'cm1', x:40, y:52, pos:'MEI', label:'MC'  },
    { id:'cm2', x:60, y:52, pos:'MEI', label:'MC'  },
    { id:'lm',  x:25, y:48, pos:'MEI', label:'ME'  },
    { id:'st1', x:42, y:28, pos:'ATA', label:'ATA' },
    { id:'st2', x:58, y:28, pos:'ATA', label:'ATA' },
  ],
  '4-2-3-1': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'rb',  x:80, y:68, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:72, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:20, y:68, pos:'LAT', label:'LE'  },
    { id:'dm1', x:38, y:56, pos:'VOL', label:'VOL' },
    { id:'dm2', x:62, y:56, pos:'VOL', label:'VOL' },
    { id:'am',  x:50, y:40, pos:'MEI', label:'MEI' },
    { id:'rw',  x:70, y:32, pos:'MEI', label:'PD'  },
    { id:'lw',  x:30, y:32, pos:'MEI', label:'PE'  },
    { id:'st',  x:50, y:25, pos:'ATA', label:'ATA' },
  ],
  '3-5-2': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:35, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:65, y:72, pos:'ZAG', label:'ZAG' },
    { id:'rm',  x:80, y:50, pos:'MEI', label:'AD'  },
    { id:'cm1', x:50, y:58, pos:'VOL', label:'VOL' },
    { id:'cm2', x:35, y:50, pos:'MEI', label:'MC'  },
    { id:'cm3', x:65, y:50, pos:'MEI', label:'MC'  },
    { id:'lm',  x:20, y:50, pos:'MEI', label:'AE'  },
    { id:'st1', x:42, y:28, pos:'ATA', label:'ATA' },
    { id:'st2', x:58, y:28, pos:'ATA', label:'ATA' },
  ],
  '3-4-3': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:35, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:65, y:72, pos:'ZAG', label:'ZAG' },
    { id:'rm',  x:75, y:50, pos:'MEI', label:'MD'  },
    { id:'cm1', x:42, y:54, pos:'VOL', label:'VOL' },
    { id:'cm2', x:58, y:54, pos:'VOL', label:'VOL' },
    { id:'lm',  x:25, y:50, pos:'MEI', label:'ME'  },
    { id:'rw',  x:70, y:30, pos:'ATA', label:'PD'  },
    { id:'st',  x:50, y:25, pos:'ATA', label:'ATA' },
    { id:'lw',  x:30, y:30, pos:'ATA', label:'PE'  },
  ],
  '5-3-2': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'cb1', x:50, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:35, y:74, pos:'ZAG', label:'ZAG' },
    { id:'cb3', x:65, y:74, pos:'ZAG', label:'ZAG' },
    { id:'rb',  x:82, y:66, pos:'LAT', label:'LD'  },
    { id:'lb',  x:18, y:66, pos:'LAT', label:'LE'  },
    { id:'cm1', x:38, y:52, pos:'MEI', label:'MC'  },
    { id:'cm2', x:62, y:52, pos:'MEI', label:'MC'  },
    { id:'cm3', x:50, y:56, pos:'VOL', label:'VOL' },
    { id:'st1', x:42, y:28, pos:'ATA', label:'ATA' },
    { id:'st2', x:58, y:28, pos:'ATA', label:'ATA' },
  ],
};

// ── Engine de perspectiva PREMIUM ─────────────────────────
// Min 0.95 (ataque visível) | Max 1.45 (goleiro imponente)
function scalePorY(y: number): number {
  const min = 0.95, max = 1.45;
  const norm = Math.max(0, Math.min(1, (y - 25) / (82 - 25)));
  return min + norm * (max - min);
}

function zIndexPorY(y: number, ativo: boolean): number {
  if (ativo) return 999;
  return Math.round(100 + y);
}

// ── MarketCard ────────────────────────────────────────────
function MarketCard({ player, onClick, isEscalado, isHighlighted }: {
  player: Player; onClick: () => void; isEscalado: boolean; isHighlighted?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative h-[88px] rounded-xl overflow-hidden border-2 cursor-pointer transition-all flex items-stretch ${
        isHighlighted
          ? 'border-yellow-500 bg-yellow-500/15 shadow-[0_0_24px_rgba(245,196,0,0.6)]'
          : isEscalado
            ? 'border-yellow-500/60 bg-yellow-500/8'
            : 'border-white/10 bg-zinc-900/60 hover:border-yellow-500/40'
      }`}
    >
      <div className="relative w-[88px] flex-shrink-0 overflow-hidden bg-black">
        <img src={player.foto}
          className="absolute inset-0 w-full h-full object-cover object-top"
          alt={player.short}
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
        <div className="absolute top-1 left-1 bg-black/85 px-1.5 py-0.5 rounded text-[7px] font-black text-white tracking-widest uppercase">
          {player.pos}
        </div>
        {isEscalado && (
          <div className="absolute bottom-1 right-1 bg-yellow-500 text-black w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-black/50">
            ✓
          </div>
        )}
      </div>
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

// ── FieldCard com escala 115 + drop-shadow ───────────────
function FieldCard({
  player, label, isSelected, onClick, scale, isCapitao, isHeroi,
}: {
  player: Player | null; label: string; isSelected: boolean; onClick: () => void;
  scale: number; isCapitao?: boolean; isHeroi?: boolean;
}) {
  // Multiplicador de largura aumentado para 115% do anterior
  const W = Math.round(92 * scale);   // era 80
  const H = Math.round(124 * scale);  // era 108

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        width: W,
        height: H,
        fontFamily: "'Barlow Condensed',Impact,sans-serif",
        filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.6))',
      }}
      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300
        ${isSelected
          ? 'border-yellow-500 shadow-[0_0_36px_rgba(245,196,0,0.8)]'
          : player
            ? 'border-white/30'
            : 'border-yellow-500/40 border-dashed bg-black/55 backdrop-blur-md'}`}
    >
      <div style={{
        position: 'absolute',
        bottom: -8,
        left: '50%',
        width: W * 0.7,
        height: 8,
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)',
        transform: 'translateX(-50%) translateY(100%)',
        filter: 'blur(3px)',
        pointerEvents: 'none',
      }} />

      {player ? (
        <>
          <img src={player.foto}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '55% 12%' }}
            alt={player.short}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />

          {isCapitao && (
            <div style={{
              position:'absolute', top: 5 * scale, left: 5 * scale,
              width: 22 * scale, height: 22 * scale,
              fontSize: 12 * scale,
            }}
            className="bg-yellow-500 text-black font-black rounded-full flex items-center justify-center shadow-lg border-2 border-black/30 z-10">
              C
            </div>
          )}

          {isHeroi && (
            <div style={{
              position:'absolute', top: 5 * scale, right: 5 * scale,
              width: 22 * scale, height: 22 * scale,
              fontSize: 12 * scale,
            }}
            className="bg-cyan-400 text-black font-black rounded-full flex items-center justify-center shadow-lg border-2 border-black/30 z-10">
              H
            </div>
          )}

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: `${6 * scale}px ${5 * scale}px`,
            background: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(6px)',
            borderTop: '1px solid rgba(255,255,255,0.15)',
          }}>
            <p style={{
              fontSize: 12 * scale,
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
              fontSize: 9 * scale,
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
          <span style={{ fontSize: 36 * scale, fontWeight: 200, lineHeight: 1 }}>+</span>
          <span style={{
            fontSize: 10 * scale,
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
  const [capitaoId,   setCapitaoId]   = useState<number | null>(null);
  const [heroiId,     setHeroiId]     = useState<number | null>(null);
  const [activeSlot,  setActiveSlot]  = useState<string | null>(null);
  const [filterPos,   setFilterPos]   = useState<string | null>(null);
  const [scoreTigre,  setScoreTigre]  = useState(0);
  const [scoreAdv,    setScoreAdv]    = useState(0);
  const [jogo,        setJogo]        = useState<Jogo | null>(null);
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);

  const slots       = useMemo(() => FORMATIONS[formation], [formation]);
  const filledCount = Object.values(lineup).filter(Boolean).length;
  const titulares   = useMemo(() => slots.map(s => lineup[s.id]).filter(Boolean) as Player[], [slots, lineup]);

  // ── Busca jogo ────────────────────────────────────────
  useEffect(() => {
    async function fetchJogo() {
      const url = jogoId
        ? `${SUPA_URL}/rest/v1/jogos?id=eq.${jogoId}&select=id,competicao,rodada,data_hora,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&limit=1`
        : `${SUPA_URL}/rest/v1/jogos?ativo=eq.true&finalizado=eq.false&select=id,competicao,rodada,data_hora,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&order=data_hora.asc&limit=1`;
      try {
        const res  = await fetch(url, {
          headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` },
        });
        const data = await res.json();
        if (data?.[0]) setJogo(data[0]);
      } catch { /* ignore */ }
    }
    fetchJogo();
  }, [jogoId]);

  const escudoAdv = jogo?.mandante?.escudo_url ?? null;
  const nomeAdv   = jogo?.mandante?.nome ?? 'ADVERSÁRIO';

  // Filtro automático ao selecionar slot
  const autoFilter = useMemo(() => {
    if (!activeSlot || activeSlot.startsWith('r')) return null;
    return slots.find(s => s.id === activeSlot)?.pos ?? null;
  }, [activeSlot, slots]);

  const filteredPlayers = useMemo(() => {
    const pos = filterPos ?? autoFilter;
    return pos ? PLAYERS.filter(p => p.pos === pos) : PLAYERS;
  }, [filterPos, autoFilter]);

  // Handler de seleção (com fix LD/PD)
  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    const isReserveSlot = /^r[1-5]$/.test(activeSlot);
    if (isReserveSlot) {
      setReserves(prev => ({ ...prev, [activeSlot]: player }));
    } else {
      setLineup(prev => ({ ...prev, [activeSlot]: player }));
    }
    setActiveSlot(null);
    setMobileMarketOpen(false);
  };

  return (
    <div
      className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-yellow-500"
      style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif" }}>

      <AnimatePresence mode="wait">

        {/* ═══ STEP 1 — FORMAÇÃO ════════════════════════════ */}
        {step === 'formation' && (
          <motion.div key="f-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#111_0%,_#000_100%)]">
            <img src={ESCUDO} className="w-24 mb-8" alt="Tigre" />
            <h1 className="text-4xl lg:text-6xl font-black italic tracking-tighter mb-3 text-center uppercase">
              ARENA TIGRE FC
            </h1>
            <p className="text-yellow-500 text-xs font-black uppercase tracking-[0.4em] mb-12">
              ESCOLHA SUA TÁTICA
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-3xl">
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f as keyof typeof FORMATIONS); setStep('arena'); }}
                  className="py-10 rounded-3xl font-black text-3xl md:text-4xl border-2 border-white/5 bg-zinc-900/40 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all italic">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 2 — ARENA com Mercado Fixo/Drawer ═══════ */}
        {step === 'arena' && (
          <motion.div key="a-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex h-screen relative flex-col lg:flex-row">

            {/* CAMPO PRINCIPAL */}
            <div className="flex-1 relative bg-black flex items-start justify-center overflow-hidden">

              <img src={STADIUM_BG}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Arena Tigre FC" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

              <div className="relative w-full h-full"
                style={{ paddingTop: '3vh', paddingBottom: '14vh' }}>
                <div className="relative w-full h-full">
                  {slots.map((s) => {
                    const scale = scalePorY(s.y);
                    const z     = zIndexPorY(s.y, activeSlot === s.id);
                    const player = lineup[s.id];
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
                          player={player || null}
                          label={s.label}
                          isSelected={activeSlot === s.id}
                          scale={scale}
                          onClick={() => {
                            setActiveSlot(s.id);
                            setFilterPos(null);
                            setMobileMarketOpen(true);
                          }}
                          isCapitao={!!player && player.id === capitaoId}
                          isHeroi={!!player && player.id === heroiId}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BARRA INFERIOR */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[96%] flex flex-col gap-2.5"
                style={{ zIndex: 500, maxWidth: 720 }}>
                <div className="flex justify-center gap-2">
                  {Object.keys(reserves).map((rid, idx) => (
                    <motion.div key={rid}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        setActiveSlot(rid); setFilterPos(null); setMobileMarketOpen(true);
                      }}
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
                    {/* BOTÃO MOBILE: abre mercado */}
                    <button
                      onClick={() => setMobileMarketOpen(true)}
                      className="lg:hidden px-4 py-2.5 rounded-xl bg-yellow-500/20 text-yellow-500 text-[10px] font-black border border-yellow-500/40 tracking-widest">
                      MERCADO
                    </button>
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

            {/* MERCADO — DESKTOP (sidebar fixa) | MOBILE (drawer) */}
            <aside className={`
              w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 bg-black border-l border-white/10
              flex flex-col h-screen
              ${mobileMarketOpen ? 'fixed inset-0 z-[1000]' : 'hidden lg:flex'}
            `}>
              <div className="p-4 bg-zinc-950 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-yellow-500 font-black italic text-2xl uppercase tracking-tighter">
                    MERCADO TIGRE
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500/15 text-yellow-500 text-[10px] font-black px-3 py-1 rounded-full tracking-widest">
                      {filteredPlayers.length}
                    </span>
                    <button
                      onClick={() => setMobileMarketOpen(false)}
                      className="lg:hidden w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white">
                      ✕
                    </button>
                  </div>
                </div>

                {activeSlot && (
                  <p className="text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                    → ESCOLHA UM JOGADOR PARA O SLOT {activeSlot.startsWith('r')
                      ? `RESERVA ${activeSlot.slice(1)}`
                      : (slots.find(s => s.id === activeSlot)?.label ?? activeSlot.toUpperCase())}
                  </p>
                )}
              </div>

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

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {filteredPlayers.map(p => {
                  const escalado = Object.values(lineup).some(l => l?.id === p.id)
                                || Object.values(reserves).some(r => r?.id === p.id);
                  const isCurrentSlot = activeSlot
                    && (lineup[activeSlot]?.id === p.id || reserves[activeSlot]?.id === p.id);
                  return (
                    <MarketCard
                      key={p.id}
                      player={p}
                      isEscalado={escalado}
                      isHighlighted={!!isCurrentSlot}
                      onClick={() => activeSlot ? handleSelectPlayer(p) : null}
                    />
                  );
                })}
              </div>

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

        {/* ═══ STEP 3 — RESUMO COMPLETO ════════════════════ */}
        {step === 'summary' && (
          <motion.div key="s-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen p-4 lg:p-8 bg-[radial-gradient(ellipse_at_top,_#111_0%,_#000_70%)] overflow-y-auto">

            <div className="max-w-5xl mx-auto">

              {/* Header */}
              <div className="text-center mb-8">
                <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.5em]">
                  STEP FINAL · PALPITE & CAPITÃO
                </span>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mt-2">
                  SEU TIME ESTÁ <span className="text-yellow-500">PRONTO</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Coluna 1 — Especialistas + Palpite */}
                <div className="space-y-5">

                  {/* Capitão */}
                  <div className="bg-zinc-900/40 border border-yellow-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-yellow-500 text-black font-black w-7 h-7 rounded-full flex items-center justify-center text-sm">C</div>
                      <h3 className="text-base font-black italic uppercase tracking-tight">
                        ESCOLHA O CAPITÃO
                      </h3>
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 font-bold">
                      Pontos do capitão dobram se a equipe vencer
                    </p>
                    <select
                      value={capitaoId ?? ''}
                      onChange={e => setCapitaoId(e.target.value ? Number(e.target.value) : null)}
                      className="w-full bg-black border border-yellow-500/30 rounded-xl px-4 py-3 text-white text-base font-black uppercase tracking-tighter focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 cursor-pointer">
                      <option value="">— Selecione o capitão —</option>
                      {titulares.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.short} · #{p.num} · {p.pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Herói */}
                  <div className="bg-zinc-900/40 border border-cyan-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-cyan-400 text-black font-black w-7 h-7 rounded-full flex items-center justify-center text-sm">H</div>
                      <h3 className="text-base font-black italic uppercase tracking-tight">
                        ESCOLHA O HERÓI
                      </h3>
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 font-bold">
                      Quem você acha que vai decidir o jogo?
                    </p>
                    <select
                      value={heroiId ?? ''}
                      onChange={e => setHeroiId(e.target.value ? Number(e.target.value) : null)}
                      className="w-full bg-black border border-cyan-500/30 rounded-xl px-4 py-3 text-white text-base font-black uppercase tracking-tighter focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer">
                      <option value="">— Selecione o herói —</option>
                      {titulares.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.short} · #{p.num} · {p.pos}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Palpite */}
                  <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🎯</span>
                      <h3 className="text-base font-black italic uppercase tracking-tight">
                        CRAVE O PLACAR
                      </h3>
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4 font-bold">
                      Placar exato +15 pts · Vencedor certo +5 pts
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <img src={ESCUDO} alt="Novo" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(245,196,0,0.4)]" />
                        <input
                          type="number"
                          min={0}
                          max={9}
                          value={scoreTigre}
                          onChange={e => setScoreTigre(Math.max(0, Math.min(9, Number(e.target.value))))}
                          className="w-16 h-20 bg-black border-2 border-yellow-500 rounded-xl text-center text-4xl font-black italic text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
                        />
                        <span className="text-yellow-500 text-[9px] font-black tracking-widest">NOVO</span>
                      </div>

                      <span className="text-2xl font-black italic text-zinc-700">×</span>

                      <div className="flex flex-col items-center gap-2">
                        {escudoAdv
                          ? <img src={escudoAdv} alt={nomeAdv} className="w-12 h-12" />
                          : <div className="w-12 h-12 bg-zinc-800 rounded" />
                        }
                        <input
                          type="number"
                          min={0}
                          max={9}
                          value={scoreAdv}
                          onChange={e => setScoreAdv(Math.max(0, Math.min(9, Number(e.target.value))))}
                          className="w-16 h-20 bg-black border-2 border-zinc-700 rounded-xl text-center text-4xl font-black italic text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                          style={{ fontFamily: "'Barlow Condensed',sans-serif" }}
                        />
                        <span className="text-zinc-500 text-[9px] font-black tracking-widest">
                          {nomeAdv.toUpperCase().slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="flex gap-2">
                    <button onClick={() => setStep('arena')}
                      className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:border-white/30">
                      ← VOLTAR
                    </button>
                    <button
                      disabled={!capitaoId || !heroiId}
                      className="flex-[2] bg-yellow-500 text-black py-3 rounded-xl font-black italic uppercase text-sm tracking-tighter disabled:opacity-40 disabled:cursor-not-allowed">
                      🚀 SALVAR & COMPARTILHAR
                    </button>
                  </div>
                </div>

                {/* Coluna 2 — FIFA Card Final */}
                <div className="bg-gradient-to-br from-yellow-500/15 to-black border-2 border-yellow-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(245,196,0,0.15)] relative overflow-hidden">
                  {/* Pattern decorativo */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-yellow-500 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-yellow-500 blur-3xl" />
                  </div>

                  {/* Header */}
                  <div className="relative flex items-center gap-3 mb-5 pb-4 border-b border-yellow-500/20">
                    <img src={ESCUDO} alt="Tigre" className="w-14 h-14 drop-shadow-[0_0_12px_rgba(245,196,0,0.4)]" />
                    <div className="flex-1">
                      <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em]">
                        TIGRE FC · FANTASY LEAGUE
                      </p>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter">
                        MEU TIME ESTÁ PRONTO!
                      </h3>
                    </div>
                    <span className="bg-black/60 border border-yellow-500/30 text-yellow-500 px-3 py-1 rounded-md text-xs font-black tracking-widest">
                      {formation}
                    </span>
                  </div>

                  {/* Grid dos 11 titulares */}
                  <div className="relative grid grid-cols-3 gap-2 mb-5">
                    {titulares.map(p => {
                      const isC = p.id === capitaoId;
                      const isH = p.id === heroiId;
                      return (
                        <div key={p.id}
                          className={`relative bg-black/60 border rounded-lg p-2 ${
                            isC ? 'border-yellow-500'
                            : isH ? 'border-cyan-400'
                            : 'border-white/10'
                          }`}>
                          {(isC || isH) && (
                            <div className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border border-black ${
                              isC ? 'bg-yellow-500 text-black' : 'bg-cyan-400 text-black'
                            }`}>
                              {isC ? 'C' : 'H'}
                            </div>
                          )}
                          <p className="text-[11px] font-black uppercase truncate leading-tight">
                            {p.short}
                          </p>
                          <p className="text-yellow-500/70 text-[9px] font-bold tracking-widest">
                            #{p.num} · {p.pos}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Palpite */}
                  <div className="relative bg-black/70 border border-white/10 rounded-xl p-4 mb-4 flex items-center justify-around">
                    <div className="text-center">
                      <p className="text-[8px] text-yellow-500 font-black tracking-widest">NOVO</p>
                      <p className="text-3xl font-black italic text-yellow-500">{scoreTigre}</p>
                    </div>
                    <span className="text-zinc-700 text-xl font-black italic">×</span>
                    <div className="text-center">
                      <p className="text-[8px] text-zinc-500 font-black tracking-widest">
                        {nomeAdv.toUpperCase().slice(0, 8)}
                      </p>
                      <p className="text-3xl font-black italic text-zinc-300">{scoreAdv}</p>
                    </div>
                  </div>

                  {/* Técnico + créditos */}
                  <div className="relative space-y-2">
                    <div className="bg-zinc-900/50 border border-white/5 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center">
                        <span className="text-yellow-500 text-xs font-black">EM</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-[9px] text-zinc-500 font-black tracking-widest uppercase">TÉCNICO</p>
                        <p className="text-sm font-black uppercase tracking-tight">Enderson Moreira</p>
                      </div>
                    </div>

                    <div className="text-center pt-2 border-t border-yellow-500/10">
                      <p className="text-[8px] text-zinc-600 font-bold tracking-widest uppercase">
                        Criado por Felipe Makarios
                      </p>
                      <p className="text-[8px] text-yellow-500/60 font-black tracking-[0.3em] mt-0.5">
                        ARENA TIGRE FC
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
