'use client';

/**
 * EscalacaoFormacao — Orchestrator (uses external MarketList)
 * Steps: formation → arena → summary
 * Drag & drop + click bidirecional + persistência por slot
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import MarketList from './MarketList';

// ── Assets ────────────────────────────────────────────────
const BASE       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const SUPA_URL   = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Tipos ─────────────────────────────────────────────────
interface Player { id: number; name: string; short: string; num: number; pos: string; foto: string; }
type SlotState = { player: Player | null; x: number; y: number };
type SlotMap = Record<string, SlotState>;
type Lineup = Record<string, Player | null>;
type Step   = 'formation' | 'arena' | 'summary';
interface Slot { id: string; x: number; y: number; label: string; pos: string; }
interface ArenaProps { jogoId?: number; }
interface Jogo {
  id: number; competicao?: string; rodada?: string; data_hora?: string;
  mandante?:  { nome: string; escudo_url: string | null; sigla?: string | null };
  visitante?: { nome: string; escudo_url: string | null; sigla?: string | null };
}

// ── Elenco — mesmo array que vai pro MarketList ────────────
const PLAYERS: Player[] = [
  { id:1,  name:'César Augusto',    short:'CÉSAR',     num:31, pos:'GOL', foto:'CESAR-AUGUSTO.jpg.webp' },
  { id:23, name:'Jordi',            short:'JORDI',     num:93, pos:'GOL', foto:'JORDI.png' },
  { id:36, name:'Mayk',             short:'MAYK',      num:2,  pos:'LAT', foto:'MAYK.jpg.webp' },
  { id:35, name:'Maykon Jesus',     short:'MAYKON',    num:16, pos:'LAT', foto:'MAYKON-JESUS.jpg.webp' },
  { id:9,  name:'Sander',           short:'SANDER',    num:5,  pos:'LAT', foto:'SANDER%20(1).jpg' },
  { id:8,  name:'Patrick',          short:'PATRICK',   num:4,  pos:'ZAG', foto:'PATRICK.jpg.webp' },
  { id:38, name:'Renato Palm',      short:'R. PALM',   num:33, pos:'ZAG', foto:'RENATO-PALM.jpg.webp' },
  { id:41, name:'Luís Oyama',       short:'OYAMA',     num:6,  pos:'VOL', foto:'LUIS-OYAMA.jpg.webp' },
  { id:42, name:'Luiz Gabriel',     short:'L. GABRIEL',num:15, pos:'VOL', foto:'LUIZ-GABRIEL.jpg.webp' },
  { id:12, name:'Marlon',           short:'MARLON',    num:50, pos:'VOL', foto:'MARLON.jpg.webp' },
  { id:47, name:'Matheus Bianqui',  short:'BIANQUI',   num:17, pos:'MEI', foto:'MATHEUS-BIANQUI.jpg.webp' },
  { id:43, name:'Nogueira',         short:'NOGUEIRA',  num:21, pos:'VOL', foto:'NOGUEIRA.jpg.webp' },
  { id:10, name:'Rômulo',           short:'RÔMULO',    num:10, pos:'MEI', foto:'ROMULO.jpg.webp' },
  { id:17, name:'Tavinho',          short:'TAVINHO',   num:15, pos:'MEI', foto:'TAVINHO.jpg.webp' },
  { id:55, name:'Nicolas Careca',   short:'CARECA',    num:30, pos:'ATA', foto:'NICOLAS-CARECA.jpg.webp' },
  { id:15, name:'Robson',           short:'ROBSON',    num:11, pos:'ATA', foto:'ROBSON.jpg.webp' },
  { id:57, name:'Ronald Barcellos', short:'RONALD',    num:7,  pos:'ATA', foto:'RONALD-BARCELLOS.jpg.webp' },
  { id:86, name:'Titi Ortiz',       short:'ORTÍZ',     num:8,  pos:'ATA', foto:'TITI-ORTIZ.jpg.webp' },
  { id:59, name:'Vinícius Paiva',   short:'V. PAIVA',  num:16, pos:'ATA', foto:'VINICIUS-PAIVA.jpg.webp' },
];

// ── 6 Formações ───────────────────────────────────────────
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

// ── Engine de perspectiva ─────────────────────────────────
function scalePorY(y: number): number {
  const min = 0.95, max = 1.45;
  const norm = Math.max(0, Math.min(1, (y - 25) / (82 - 25)));
  return min + norm * (max - min);
}
function zIndexPorY(y: number, ativo: boolean, dragging: boolean): number {
  if (dragging) return 9999;
  if (ativo) return 999;
  return Math.round(100 + y);
}

// ── FieldCard ─────────────────────────────────────────────
function FieldCard({
  player, label, isSelected, isOriginSelected, onClick, onDragStart, onDragEnd, scale,
  isCapitao, isHeroi, draggable,
}: {
  player: Player | null; label: string; isSelected: boolean; isOriginSelected: boolean;
  onClick: () => void;
  onDragStart?: () => void; onDragEnd?: (info: PanInfo) => void;
  scale: number; isCapitao?: boolean; isHeroi?: boolean; draggable: boolean;
}) {
  const W = Math.round(92 * scale);
  const H = Math.round(124 * scale);

  const baseShadow = isOriginSelected
    ? '0 0 36px rgba(0,243,255,0.8)'
    : isSelected
      ? '0 0 36px rgba(245,196,0,0.8)'
      : 'none';

  const borderClass = isOriginSelected
    ? 'border-cyan-400'
    : isSelected
      ? 'border-yellow-500'
      : player
        ? 'border-white/30'
        : 'border-yellow-500/40 border-dashed bg-black/55 backdrop-blur-md';

  return (
    <motion.div
      drag={draggable}
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd?.(info)}
      onClick={onClick}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.96 }}
      whileDrag={{ scale: 1.15, zIndex: 9999 }}
      style={{
        width: W, height: H,
        fontFamily: "'Barlow Condensed',Impact,sans-serif",
        filter: 'drop-shadow(0px 10px 15px rgba(0,0,0,0.6))',
        boxShadow: baseShadow,
        touchAction: draggable ? 'none' : 'auto',
        cursor: draggable ? 'grab' : 'pointer',
      }}
      className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${borderClass}`}
    >
      <div style={{
        position:'absolute', bottom:-8, left:'50%',
        width: W * 0.7, height: 8,
        background:'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)',
        transform:'translateX(-50%) translateY(100%)',
        filter:'blur(3px)', pointerEvents:'none',
      }} />

      {player ? (
        <>
          <img src={`${BASE}${player.foto}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '60% 10%' }}
            alt={player.short}
            onError={e => {
              const t = e.target as HTMLImageElement;
              t.src = ESCUDO; t.style.opacity = '0.3'; t.style.objectFit = 'contain';
            }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />

          {isCapitao && (
            <div style={{
              position:'absolute', top: 5 * scale, left: 5 * scale,
              width: 22 * scale, height: 22 * scale, fontSize: 12 * scale,
            }}
            className="bg-yellow-500 text-black font-black rounded-full flex items-center justify-center shadow-lg border-2 border-black/30 z-10">C</div>
          )}
          {isHeroi && (
            <div style={{
              position:'absolute', top: 5 * scale, right: 5 * scale,
              width: 22 * scale, height: 22 * scale, fontSize: 12 * scale,
            }}
            className="bg-cyan-400 text-black font-black rounded-full flex items-center justify-center shadow-lg border-2 border-black/30 z-10">H</div>
          )}

          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            padding:`${6 * scale}px ${5 * scale}px`,
            background:'rgba(0,0,0,0.88)', backdropFilter:'blur(6px)',
            borderTop:'1px solid rgba(255,255,255,0.15)',
          }}>
            <p style={{
              fontSize: 12 * scale, fontWeight: 900, color: '#fff',
              textTransform:'uppercase', letterSpacing:'-0.01em', textAlign:'center',
              whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight: 1.1,
            }}>{player.short}</p>
            <p style={{
              fontSize: 9 * scale, fontWeight: 700, color: '#F5C400',
              textAlign:'center', letterSpacing:'0.15em', marginTop: 1,
            }}>{player.pos} · {player.num}</p>
          </div>
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-yellow-500/50">
          <span style={{ fontSize: 36 * scale, fontWeight: 200, lineHeight: 1 }}>+</span>
          <span style={{
            fontSize: 10 * scale, fontWeight: 900, color: 'rgba(255,255,255,0.5)',
            textTransform:'uppercase', letterSpacing:'0.15em', marginTop: 4,
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
  const [slotMap,     setSlotMap]     = useState<SlotMap>({});
  const [reserves,    setReserves]    = useState<Lineup>({ r1:null, r2:null, r3:null, r4:null, r5:null });
  const [capitaoId,   setCapitaoId]   = useState<number | null>(null);
  const [heroiId,     setHeroiId]     = useState<number | null>(null);

  const [activeSlot,   setActiveSlot]   = useState<string | null>(null);
  const [originPlayer, setOriginPlayer] = useState<Player | null>(null);
  const [originSlot,   setOriginSlot]   = useState<string | null>(null);

  const [draggingId,  setDraggingId]  = useState<string | null>(null);
  const [scoreTigre,  setScoreTigre]  = useState(0);
  const [scoreAdv,    setScoreAdv]    = useState(0);
  const [jogo,        setJogo]        = useState<Jogo | null>(null);
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);

  const fieldRef = useRef<HTMLDivElement>(null);

  // Init slotMap quando muda formação (preserva player se possível)
  useEffect(() => {
    setSlotMap(prev => {
      const initial: SlotMap = {};
      FORMATIONS[formation].forEach(s => {
        initial[s.id] = {
          player: prev[s.id]?.player ?? null,
          x: s.x, y: s.y,
        };
      });
      return initial;
    });
  }, [formation]);

  // Busca jogo
  useEffect(() => {
    async function fetchJogo() {
      const url = jogoId
        ? `${SUPA_URL}/rest/v1/jogos?id=eq.${jogoId}&select=id,competicao,rodada,data_hora,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&limit=1`
        : `${SUPA_URL}/rest/v1/jogos?ativo=eq.true&finalizado=eq.false&select=id,competicao,rodada,data_hora,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&order=data_hora.asc&limit=1`;
      try {
        const res = await fetch(url, {
          headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` },
        });
        const data = await res.json();
        if (data?.[0]) setJogo(data[0]);
      } catch { /* */ }
    }
    fetchJogo();
  }, [jogoId]);

  const slots       = useMemo(() => FORMATIONS[formation], [formation]);
  const filledCount = Object.values(slotMap).filter(s => s.player).length;
  const titulares   = useMemo(
    () => slots.map(s => slotMap[s.id]?.player).filter(Boolean) as Player[],
    [slots, slotMap]
  );
  const escudoAdv = jogo?.mandante?.escudo_url ?? null;
  const nomeAdv   = jogo?.mandante?.nome ?? 'ADVERSÁRIO';

  // ── Helper: já está escalado? ───────────────────────
  const isEscalado = (id: number): boolean =>
    Object.values(slotMap).some(s => s.player?.id === id) ||
    Object.values(reserves).some(r => r?.id === id);

  // ── Atribuição central ──────────────────────────────
  const assignPlayerToSlot = (player: Player, slotId: string, fromSlot: string | null) => {
    const isReserveTarget = /^r[1-5]$/.test(slotId);

    if (isReserveTarget) {
      const previousReserve = reserves[slotId];
      setReserves(prev => ({ ...prev, [slotId]: player }));
      if (fromSlot && !fromSlot.startsWith('__reserve_')) {
        setSlotMap(prev => ({
          ...prev,
          [fromSlot]: { ...prev[fromSlot], player: previousReserve },
        }));
      } else if (fromSlot?.startsWith('__reserve_')) {
        const fromR = fromSlot.replace('__reserve_', '');
        setReserves(prev => ({ ...prev, [fromR]: previousReserve, [slotId]: player }));
      }
      return;
    }

    const previousAtTarget = slotMap[slotId]?.player ?? null;
    setSlotMap(prev => ({
      ...prev,
      [slotId]: { ...prev[slotId], player },
    }));

    if (fromSlot && !fromSlot.startsWith('__reserve_')) {
      setSlotMap(prev => ({
        ...prev,
        [fromSlot]: { ...prev[fromSlot], player: previousAtTarget },
      }));
    } else if (fromSlot?.startsWith('__reserve_')) {
      const fromR = fromSlot.replace('__reserve_', '');
      setReserves(prev => ({ ...prev, [fromR]: previousAtTarget }));
    }
  };

  // ── Click nos slots ─────────────────────────────────
  const onSlotClick = (slotId: string) => {
    if (originPlayer) {
      assignPlayerToSlot(originPlayer, slotId, originSlot);
      setOriginPlayer(null); setOriginSlot(null); setActiveSlot(null);
      return;
    }
    const slotPlayer = slotMap[slotId]?.player;
    if (slotPlayer) {
      setOriginPlayer(slotPlayer); setOriginSlot(slotId); setActiveSlot(null);
      setMobileMarketOpen(false);
      return;
    }
    setActiveSlot(slotId);
    setMobileMarketOpen(true);
  };

  // ── Click no jogador do mercado ─────────────────────
  const onMarketSelect = (player: Player) => {
    if (activeSlot) {
      assignPlayerToSlot(player, activeSlot, null);
      setActiveSlot(null);
      setMobileMarketOpen(false);
      return;
    }
    setOriginPlayer(player); setOriginSlot(null);
  };

  // ── Reservas ───────────────────────────────────────
  const onReserveClick = (rid: string) => {
    if (originPlayer) {
      const prev = reserves[rid];
      setReserves(p => ({ ...p, [rid]: originPlayer }));
      if (originSlot && !originSlot.startsWith('__reserve_')) {
        setSlotMap(p => ({ ...p, [originSlot]: { ...p[originSlot], player: prev } }));
      }
      setOriginPlayer(null); setOriginSlot(null);
      return;
    }
    if (reserves[rid]) {
      setOriginPlayer(reserves[rid]); setOriginSlot(`__reserve_${rid}`);
      return;
    }
    setActiveSlot(rid); setMobileMarketOpen(true);
  };

  // ── Drag handlers (campo) ──────────────────────────
  const handleSlotDragStart = (slotId: string) => {
    setDraggingId(slotId);
    setOriginPlayer(slotMap[slotId]?.player ?? null);
    setOriginSlot(slotId);
  };
  const handleSlotDragEnd = (slotId: string, info: PanInfo) => {
    setDraggingId(null);
    const player = slotMap[slotId]?.player;
    if (!player) { setOriginPlayer(null); setOriginSlot(null); return; }
    const target = findSlotAtPoint(info.point.x, info.point.y);
    if (target && target !== slotId) {
      assignPlayerToSlot(player, target, slotId);
    } else {
      const rect = fieldRef.current?.getBoundingClientRect();
      if (rect) {
        const newX = ((info.point.x - rect.left) / rect.width)  * 100;
        const newY = ((info.point.y - rect.top)  / rect.height) * 100;
        if (newX > 5 && newX < 95 && newY > 5 && newY < 95) {
          setSlotMap(prev => ({
            ...prev,
            [slotId]: { ...prev[slotId], x: newX, y: newY },
          }));
        }
      }
    }
    setOriginPlayer(null); setOriginSlot(null);
  };

  const findSlotAtPoint = (px: number, py: number): string | null => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (rect) {
      const relX = ((px - rect.left) / rect.width)  * 100;
      const relY = ((py - rect.top)  / rect.height) * 100;
      let closest: { id: string; dist: number } | null = null;
      Object.entries(slotMap).forEach(([id, st]) => {
        const dx = st.x - relX, dy = st.y - relY;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 8 && (!closest || d < closest.dist)) closest = { id, dist: d };
      });
      if (closest) return (closest as any).id;
    }
    const els = document.elementsFromPoint(px, py);
    for (const el of els) {
      const rid = (el as HTMLElement).dataset?.reserveId;
      if (rid) return rid;
    }
    return null;
  };

  // ── Drag do mercado: handlers para passar ao MarketList ─
  const onMarketDragStart = (player: Player) => {
    setOriginPlayer(player); setOriginSlot(null);
    setDraggingId(`market_${player.id}`);
  };
  const onMarketDragEnd = () => {
    // O `MarketList` atual não passa pos do ponto; usamos activeSlot como destino se houver
    setDraggingId(null);
    // Se houve drop sobre um slot ativo, já foi tratado pelo click; senão, limpa
    setOriginPlayer(null);
  };

  return (
    <div
      className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-yellow-500"
      style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif" }}>

      <AnimatePresence mode="wait">

        {/* ═══ STEP 1 ════════════════════════════════════════ */}
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
                <button key={f}
                  onClick={() => { setFormation(f as keyof typeof FORMATIONS); setStep('arena'); }}
                  className="py-10 rounded-3xl font-black text-3xl md:text-4xl border-2 border-white/5 bg-zinc-900/40 hover:border-yellow-500 hover:bg-yellow-500/10 transition-all italic">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 2 — ARENA ═══════════════════════════════ */}
        {step === 'arena' && (
          <motion.div key="a-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex h-screen relative flex-col lg:flex-row">

            {/* MARKET LIST À ESQUERDA (DESKTOP) / DRAWER (MOBILE) */}
            <div className={`
              ${mobileMarketOpen ? 'fixed inset-0 z-[1000] flex' : 'hidden'}
              lg:relative lg:flex lg:z-10
            `}>
              {/* Botão de fechar mobile */}
              {mobileMarketOpen && (
                <button
                  onClick={() => setMobileMarketOpen(false)}
                  className="lg:hidden absolute top-4 right-4 z-[1100] w-10 h-10 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white text-lg">
                  ✕
                </button>
              )}
              <MarketList
                players={PLAYERS}
                isEscalado={isEscalado}
                onSelect={onMarketSelect}
                onDragStart={onMarketDragStart}
                onDragEnd={onMarketDragEnd}
              />
            </div>

            {/* CAMPO PRINCIPAL */}
            <div className="flex-1 relative bg-black flex items-start justify-center overflow-hidden">

              <img src={STADIUM_BG}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Arena Tigre FC" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 pointer-events-none" />

              <div ref={fieldRef} className="relative w-full h-full"
                style={{ paddingTop: '3vh', paddingBottom: '14vh' }}>
                <div className="relative w-full h-full">
                  {slots.map((s) => {
                    const slotState = slotMap[s.id] ?? { player: null, x: s.x, y: s.y };
                    const scale = scalePorY(slotState.y);
                    const drag  = draggingId === s.id;
                    const z     = zIndexPorY(slotState.y, activeSlot === s.id, drag);
                    const player = slotState.player;
                    return (
                      <div key={s.id}
                        className="absolute"
                        style={{
                          left: `${slotState.x}%`,
                          top:  `${slotState.y}%`,
                          transform:'translate(-50%, -50%)',
                          zIndex: z,
                        }}>
                        <FieldCard
                          player={player}
                          label={s.label}
                          isSelected={activeSlot === s.id}
                          isOriginSelected={originSlot === s.id}
                          scale={scale}
                          onClick={() => onSlotClick(s.id)}
                          onDragStart={() => handleSlotDragStart(s.id)}
                          onDragEnd={info => handleSlotDragEnd(s.id, info)}
                          isCapitao={!!player && player.id === capitaoId}
                          isHeroi={!!player && player.id === heroiId}
                          draggable={!!player}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* HINT bidirecional */}
              {(originPlayer || activeSlot) && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md border border-cyan-400/30 rounded-full px-5 py-2 z-[600]">
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {originPlayer
                      ? <span className="text-cyan-400">→ {originPlayer.short.toUpperCase()} SELECIONADO · CLIQUE NO DESTINO</span>
                      : <span className="text-yellow-500">→ ESCOLHA UM JOGADOR PARA O SLOT</span>}
                  </p>
                </div>
              )}

              {/* BARRA INFERIOR */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[96%] flex flex-col gap-2.5"
                style={{ zIndex: 500, maxWidth: 720 }}>

                {/* Reservas */}
                <div className="flex justify-center gap-2">
                  {Object.keys(reserves).map((rid, idx) => (
                    <motion.div key={rid}
                      data-reserve-id={rid}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onReserveClick(rid)}
                      className={`cursor-pointer w-12 h-12 rounded-xl border-2 transition-all flex items-center justify-center overflow-hidden backdrop-blur-md ${
                        activeSlot === rid
                          ? 'border-yellow-500 scale-110 shadow-[0_0_20px_rgba(245,196,0,0.6)] z-50'
                          : originSlot === `__reserve_${rid}`
                            ? 'border-cyan-400 scale-110 shadow-[0_0_20px_rgba(0,243,255,0.5)]'
                            : reserves[rid]
                              ? 'border-white/40 bg-black/70'
                              : 'border-white/10 bg-black/50'
                      }`}>
                      {reserves[rid] ? (
                        <img src={`${BASE}${reserves[rid]!.foto}`}
                          className="w-full h-full object-cover"
                          style={{ objectPosition:'55% 15%' }}
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
          </motion.div>
        )}

        {/* ═══ STEP 3 — RESUMO ═════════════════════════════ */}
        {step === 'summary' && (
          <motion.div key="s-step"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="min-h-screen p-4 lg:p-8 bg-[radial-gradient(ellipse_at_top,_#111_0%,_#000_70%)] overflow-y-auto">

            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.5em]">
                  STEP FINAL · PALPITE & CAPITÃO
                </span>
                <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mt-2">
                  SEU TIME ESTÁ <span className="text-yellow-500">PRONTO</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Coluna 1 */}
                <div className="space-y-5">
                  <div className="bg-zinc-900/40 border border-yellow-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-yellow-500 text-black font-black w-7 h-7 rounded-full flex items-center justify-center text-sm">C</div>
                      <h3 className="text-base font-black italic uppercase tracking-tight">ESCOLHA O CAPITÃO</h3>
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 font-bold">
                      Pontos do capitão dobram se a equipe vencer
                    </p>
                    <select value={capitaoId ?? ''}
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

                  <div className="bg-zinc-900/40 border border-cyan-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-cyan-400 text-black font-black w-7 h-7 rounded-full flex items-center justify-center text-sm">H</div>
                      <h3 className="text-base font-black italic uppercase tracking-tight">ESCOLHA O HERÓI</h3>
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-3 font-bold">
                      Quem você acha que vai decidir o jogo?
                    </p>
                    <select value={heroiId ?? ''}
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

                  <div className="bg-zinc-900/40 border border-white/10 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">🎯</span>
                      <h3 className="text-base font-black italic uppercase tracking-tight">CRAVE O PLACAR</h3>
                    </div>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-widest mb-4 font-bold">
                      Placar exato +15 pts · Vencedor certo +5 pts
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="flex flex-col items-center gap-2">
                        <img src={ESCUDO} alt="Novo" className="w-12 h-12 drop-shadow-[0_0_10px_rgba(245,196,0,0.4)]" />
                        <input type="number" min={0} max={9} value={scoreTigre}
                          onChange={e => setScoreTigre(Math.max(0, Math.min(9, Number(e.target.value))))}
                          className="w-16 h-20 bg-black border-2 border-yellow-500 rounded-xl text-center text-4xl font-black italic text-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/40"
                          style={{ fontFamily:"'Barlow Condensed',sans-serif" }} />
                        <span className="text-yellow-500 text-[9px] font-black tracking-widest">NOVO</span>
                      </div>
                      <span className="text-2xl font-black italic text-zinc-700">×</span>
                      <div className="flex flex-col items-center gap-2">
                        {escudoAdv
                          ? <img src={escudoAdv} alt={nomeAdv} className="w-12 h-12" />
                          : <div className="w-12 h-12 bg-zinc-800 rounded" />}
                        <input type="number" min={0} max={9} value={scoreAdv}
                          onChange={e => setScoreAdv(Math.max(0, Math.min(9, Number(e.target.value))))}
                          className="w-16 h-20 bg-black border-2 border-zinc-700 rounded-xl text-center text-4xl font-black italic text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                          style={{ fontFamily:"'Barlow Condensed',sans-serif" }} />
                        <span className="text-zinc-500 text-[9px] font-black tracking-widest">
                          {nomeAdv.toUpperCase().slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setStep('arena')}
                      className="flex-1 bg-white/5 border border-white/10 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:border-white/30">
                      ← VOLTAR
                    </button>
                    <button disabled={!capitaoId || !heroiId}
                      className="flex-[2] bg-yellow-500 text-black py-3 rounded-xl font-black italic uppercase text-sm tracking-tighter disabled:opacity-40 disabled:cursor-not-allowed">
                      🚀 SALVAR & COMPARTILHAR
                    </button>
                  </div>
                </div>

                {/* Coluna 2 — FIFA Card */}
                <div className="bg-gradient-to-br from-yellow-500/15 to-black border-2 border-yellow-500/40 rounded-3xl p-6 shadow-[0_0_60px_rgba(245,196,0,0.15)] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-yellow-500 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-yellow-500 blur-3xl" />
                  </div>

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
