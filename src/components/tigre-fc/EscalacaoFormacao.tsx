'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

const BASE_STORAGE   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO_DEFAULT = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

const TABLE          = 'tigre_fc_escalacoes';
const PROFILE_TABLE  = 'tigre_fc_usuarios';
const SHARE_BASE_URL = 'https://www.onovorizontino.com.br/tigre-fc/escalar';

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
  ovr?: number;
}

type SlotCoord = { x: number; y: number };
type SlotMap   = Record<string, { player: Player | null; x: number; y: number }>;
type Step      = 'loading' | 'formation' | 'arena' | 'captain' | 'hero' | 'palpite' | 'saving' | 'final';

interface EscalacaoFormacaoProps {
  jogoId?: number | string;
  mandante?: string;
  mandanteLogo?: string;
  rodada?: string | number;
}

const PLAYERS_DATA: Player[] = [
  { id: 23, name: 'Jordi Martins',     short: 'JORDI',      num: 93, pos: 'GOL', foto: 'JORDI.jpg.webp',           ovr: 82 },
  { id: 1,  name: 'César',             short: 'CÉSAR',      num: 31, pos: 'GOL', foto: 'CESAR-AUGUSTO.jpg.webp',   ovr: 78 },
  { id: 22, name: 'João Scapin',       short: 'SCAPIN',     num: 12, pos: 'GOL', foto: 'JOAO-SCAPIN.jpg.webp',     ovr: 72 },
  { id: 62, name: 'Lucas Ribeiro',     short: 'LUCAS',      num: 1,  pos: 'GOL', foto: 'LUCAS-RIBEIRO.jpg.webp',   ovr: 70 },
  { id: 8,  name: 'Patrick',           short: 'PATRICK',    num: 4,  pos: 'ZAG', foto: 'PATRICK.jpg.webp',         ovr: 84 },
  { id: 38, name: 'Renato Palm',       short: 'R. PALM',    num: 33, pos: 'ZAG', foto: 'RENATO-PALM.jpg.webp',     ovr: 81 },
  { id: 34, name: 'Eduardo Brock',     short: 'BROCK',      num: 14, pos: 'ZAG', foto: 'EDUARDO-BROCK.jpg.webp',   ovr: 80 },
  { id: 66, name: 'Alexis Alvariño',   short: 'ALVARÍÑO',   num: 22, pos: 'ZAG', foto: 'IVAN-ALVARINO.jpg.webp',   ovr: 79 },
  { id: 6,  name: 'Carlinhos',         short: 'CARLINHOS',  num: 3,  pos: 'ZAG', foto: 'CARLINHOS.jpg.webp',       ovr: 76 },
  { id: 3,  name: 'Dantas',            short: 'DANTAS',     num: 25, pos: 'ZAG', foto: 'DANTAS.jpg.webp',          ovr: 75 },
  { id: 9,  name: 'Sander',            short: 'SANDER',     num: 5,  pos: 'LAT', foto: 'SANDER (1).jpg',           ovr: 81 },
  { id: 28, name: 'Maykon Jesus',      short: 'MAYKON',     num: 66, pos: 'LAT', foto: 'MAYKON-JESUS.jpg.webp',    ovr: 78 },
  { id: 27, name: 'Nilson Castrillón', short: 'NILSON',     num: 20, pos: 'LAT', foto: 'NILSON-CASTRILLON.jpg.webp', ovr: 77 },
  { id: 75, name: 'Jhilmar Lora',      short: 'LORA',       num: 24, pos: 'LAT', foto: 'LORA.jpg.webp',            ovr: 74 },
  { id: 41, name: 'Luís Oyama',        short: 'OYAMA',      num: 6,  pos: 'VOL', foto: 'LUIS-OYAMA.jpg.webp',      ovr: 83 },
  { id: 46, name: 'Marlon',            short: 'MARLON',     num: 28, pos: 'VOL', foto: 'MARLON.jpg.webp',          ovr: 80 },
  { id: 40, name: 'Léo Naldi',         short: 'NALDI',      num: 18, pos: 'VOL', foto: 'LEO-NALDI.jpg.webp',       ovr: 78 },
  { id: 47, name: 'Matheus Bianqui',   short: 'BIANQUI',    num: 17, pos: 'MEI', foto: 'MATHEUS-BIANQUI.jpg.webp', ovr: 82 },
  { id: 10, name: 'Rômulo',            short: 'RÔMULO',     num: 10, pos: 'MEI', foto: 'ROMULO.jpg.webp',          ovr: 86 },
  { id: 12, name: 'Juninho',           short: 'JUNINHO',    num: 50, pos: 'MEI', foto: 'JUNINHO.jpg.webp',         ovr: 79 },
  { id: 17, name: 'Tavinho',           short: 'TAVINHO',    num: 15, pos: 'MEI', foto: 'TAVINHO.jpg.webp',         ovr: 78 },
  { id: 86, name: 'Christian Ortíz',   short: 'TITI ORTÍZ', num: 8,  pos: 'MEI', foto: 'TITI-ORTIZ.jpg.webp',      ovr: 84 },
  { id: 13, name: 'Diego Galo',        short: 'D. GALO',    num: 19, pos: 'MEI', foto: 'DIEGO-GALO.jpg.webp',      ovr: 75 },
  { id: 15, name: 'Robson',            short: 'ROBSON',     num: 11, pos: 'ATA', foto: 'ROBSON.jpg.webp',          ovr: 85 },
  { id: 59, name: 'Vinícius Paiva',    short: 'V. PAIVA',   num: 16, pos: 'ATA', foto: 'VINICIUS-PAIVA.jpg.webp',  ovr: 79 },
  { id: 57, name: 'Ronald Barcellos',  short: 'RONALD',     num: 7,  pos: 'ATA', foto: 'RONALD-BARCELLOS.jpg.webp', ovr: 82 },
  { id: 55, name: 'Nicolas Careca',    short: 'CARECA',     num: 30, pos: 'ATA', foto: 'NICOLAS-CARECA.jpg.webp',  ovr: 80 },
  { id: 50, name: 'Carlão',            short: 'CARLÃO',     num: 9,  pos: 'ATA', foto: 'CARLAO.jpg.webp',          ovr: 84 },
  { id: 52, name: 'Hélio Borges',      short: 'HÉLIO',      num: 41, pos: 'ATA', foto: 'HELIO-BORGES.jpg.webp',    ovr: 76 },
  { id: 53, name: 'Jardiel',           short: 'JARDIEL',    num: 40, pos: 'ATA', foto: 'JARDIEL.jpg.webp',         ovr: 75 },
  { id: 91, name: 'Hector Bianchi',    short: 'HECTOR',     num: 35, pos: 'ATA', foto: 'HECTOR-BIANCHI.jpg.webp',  ovr: 77 },
];

const formationConfigs: Record<string, Record<string, SlotCoord>> = {
  '4-3-3':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:50,y:48}, m2:{x:30,y:42}, m3:{x:70,y:42}, st:{x:50,y:15}, lw:{x:22,y:22}, rw:{x:78,y:22} },
  '4-4-2':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:35,y:45}, m2:{x:65,y:45}, m3:{x:15,y:38}, m4:{x:85,y:38}, st1:{x:40,y:18}, st2:{x:60,y:18} },
  '3-5-2':   { gk:{x:50,y:85}, cb1:{x:30,y:70}, cb2:{x:50,y:73}, cb3:{x:70,y:70}, lm:{x:15,y:45}, rm:{x:85,y:45}, m1:{x:35,y:50}, m2:{x:65,y:50}, am:{x:50,y:32}, st1:{x:40,y:15}, st2:{x:60,y:15} },
  '4-5-1':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:30,y:48}, m2:{x:50,y:48}, m3:{x:70,y:48}, am1:{x:35,y:30}, am2:{x:65,y:30}, st:{x:50,y:15} },
  '4-2-3-1': { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, v1:{x:40,y:52}, v2:{x:60,y:52}, am:{x:50,y:35}, lw:{x:20,y:28}, rw:{x:80,y:28}, st:{x:50,y:12} },
  '5-3-2':   { gk:{x:50,y:85}, lb:{x:12,y:52}, cb1:{x:30,y:70}, cb2:{x:50,y:73}, cb3:{x:70,y:70}, rb:{x:88,y:52}, m1:{x:50,y:48}, m2:{x:30,y:40}, m3:{x:70,y:40}, st1:{x:42,y:18}, st2:{x:58,y:18} },
};

const SLOT_W_MOBILE  = 60;
const SLOT_H_MOBILE  = 86;
const SLOT_W_DESKTOP = 80;
const SLOT_H_DESKTOP = 116;

const POSICOES = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'] as const;
type Posicao = typeof POSICOES[number];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const getRarityColors = (ovr: number) => {
  if (ovr >= 84) return { border: '#fbbf24', glow: 'rgba(251,191,36,0.5)', bar: 'from-amber-400 to-yellow-300' };
  if (ovr >= 78) return { border: '#fde68a', glow: 'rgba(253,230,138,0.4)', bar: 'from-yellow-200 to-amber-200' };
  if (ovr >= 73) return { border: '#d4d4d8', glow: 'rgba(212,212,216,0.3)', bar: 'from-zinc-300 to-zinc-400' };
  return                  { border: '#a16207', glow: 'rgba(161,98,7,0.3)',  bar: 'from-amber-700 to-yellow-800' };
};

// =============================================================================
// FUT CARD
// =============================================================================
interface FutCardProps {
  player: Player;
  escalado: boolean;
  pending: boolean;
  onClick: () => void;
  getValidPhotoUrl: (foto: string) => string;
}

function FutCard({ player, escalado, pending, onClick, getValidPhotoUrl }: FutCardProps) {
  const ovr = player.ovr ?? 75;
  const colors = getRarityColors(ovr);

  return (
    <motion.button
      layout
      whileHover={{ scale: escalado ? 1 : 1.04, y: escalado ? 0 : -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={escalado}
      className="relative group rounded-lg overflow-hidden text-left"
      style={{
        background: `linear-gradient(180deg, ${colors.border}26 0%, #0a0a0a 60%)`,
        border: `1.5px solid ${pending ? '#22d3ee' : escalado ? '#10b98180' : colors.border + '80'}`,
        boxShadow: pending
          ? '0 0 16px rgba(34,211,238,0.5)'
          : escalado
            ? 'inset 0 0 0 1px #10b98140'
            : `0 0 12px ${colors.glow}`,
      }}
    >
      <div className="flex items-start justify-between px-1.5 pt-1.5 pb-0.5">
        <div className="flex flex-col leading-none">
          <span className="text-[12px] md:text-base font-black text-white tabular-nums leading-none">{ovr}</span>
          <span className="text-[7px] md:text-[8px] font-black tracking-wider mt-0.5" style={{ color: colors.border }}>
            {player.pos}
          </span>
        </div>
        <span className="text-[8px] md:text-[9px] font-black bg-black/60 text-white px-1 rounded tabular-nums">
          #{player.num}
        </span>
      </div>

      <div className="relative aspect-square overflow-hidden bg-black/40">
        <img
          src={getValidPhotoUrl(player.foto)}
          alt={player.short}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${escalado ? 'opacity-30 grayscale' : ''}`}
          style={{ objectPosition: '15% center' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }}
        />
        {!escalado && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
          />
        )}
        {escalado && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
            <span className="text-emerald-400 text-2xl md:text-3xl font-black drop-shadow-lg">✓</span>
          </div>
        )}
      </div>

      <div className={`px-1 py-0.5 bg-gradient-to-r ${colors.bar} text-black`}>
        <p className="text-[8px] md:text-[10px] text-center font-black truncate uppercase leading-tight">
          {player.short}
        </p>
      </div>
    </motion.button>
  );
}

// =============================================================================
// SLOT NO CAMPO
// =============================================================================
interface DraggableSlotProps {
  slotId: string;
  state: { player: Player | null; x: number; y: number };
  arenaRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  hasPending: boolean;
  isDesktop: boolean;
  isCaptain: boolean;
  isHero: boolean;
  onDragSettled: (slotId: string, newX: number, newY: number) => void;
  onClick: (slotId: string) => void;
  getValidPhotoUrl: (foto: string) => string;
}

function DraggableSlot({
  slotId, state, arenaRef, isActive, hasPending, isDesktop, isCaptain, isHero,
  onDragSettled, onClick, getValidPhotoUrl,
}: DraggableSlotProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const draggedRef = useRef(false);

  const w = isDesktop ? SLOT_W_DESKTOP : SLOT_W_MOBILE;
  const h = isDesktop ? SLOT_H_DESKTOP : SLOT_H_MOBILE;

  const ovr = state.player?.ovr ?? 75;
  const colors = state.player ? getRarityColors(ovr) : null;

  const borderColor = isCaptain
    ? '#fbbf24'
    : isHero
      ? '#22d3ee'
      : isActive
        ? '#facc15'
        : hasPending
          ? '#22d3ee99'
          : colors?.border ?? '#ffffff4d';

  const boxShadow = isCaptain
    ? '0 0 25px #fbbf24, inset 0 0 20px rgba(251,191,36,0.3)'
    : isHero
      ? '0 0 25px #22d3ee, inset 0 0 20px rgba(34,211,238,0.3)'
      : isActive
        ? '0 0 30px #facc15'
        : state.player
          ? `0 4px 18px rgba(0,0,0,0.6), 0 0 12px ${colors?.glow ?? 'rgba(0,0,0,0)'}`
          : '0 4px 12px rgba(0,0,0,0.6)';

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={arenaRef}
      whileDrag={{ scale: 1.25, zIndex: 200 }}
      animate={isCaptain || isHero ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      onDragStart={() => { draggedRef.current = false; }}
      onDrag={(_, info) => {
        if (Math.abs(info.offset.x) > 4 || Math.abs(info.offset.y) > 4) {
          draggedRef.current = true;
        }
      }}
      onDragEnd={(_, info) => {
        const arenaEl = arenaRef.current;
        if (!arenaEl) return;
        const rect = arenaEl.getBoundingClientRect();
        const newX = ((info.point.x - rect.left) / rect.width) * 100;
        const newY = ((info.point.y - rect.top) / rect.height) * 100;
        x.set(0);
        y.set(0);
        onDragSettled(slotId, clamp(newX, 5, 95), clamp(newY, 5, 95));
      }}
      onClick={() => {
        if (draggedRef.current) {
          draggedRef.current = false;
          return;
        }
        onClick(slotId);
      }}
      style={{
        x, y,
        position: 'absolute',
        left: `${state.x}%`,
        top: `${state.y}%`,
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        border: `2px solid ${borderColor}`,
        boxShadow,
        background: state.player
          ? `linear-gradient(180deg, ${colors?.border ?? '#fff'}33 0%, #000 70%)`
          : 'rgba(0,0,0,0.55)',
      }}
      className="rounded-xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {state.player ? (
        <div className="relative w-full h-full pointer-events-none">
          <div className="absolute top-0.5 left-1 z-10 leading-none">
            <div className="text-[11px] md:text-sm font-black text-white tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
              {ovr}
            </div>
            <div className="text-[7px] md:text-[8px] font-black tracking-wider"
              style={{ color: colors?.border, textShadow: '0 1px 2px rgba(0,0,0,1)' }}>
              {state.player.pos}
            </div>
          </div>
          <div className="absolute top-0.5 right-1 z-10 text-[9px] md:text-[10px] font-black text-white tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            #{state.player.num}
          </div>
          <img src={getValidPhotoUrl(state.player.foto)} alt={state.player.short}
            className="w-full h-full object-cover" style={{ objectPosition: '85% center' }} draggable={false}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${colors?.bar} py-0.5`}>
            <span className="text-[8px] md:text-[9px] font-black text-black block text-center leading-tight">
              {state.player.short}
            </span>
          </div>
          {(isCaptain || isHero) && (
            <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[11px] md:text-xs font-black shadow-xl z-20 ${
              isCaptain ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'
            }`}>
              {isCaptain ? 'C' : 'H'}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center opacity-50 pointer-events-none">
          <span className="text-2xl md:text-3xl font-thin">+</span>
          <div className="text-[8px] md:text-[9px] uppercase mt-0.5 font-bold tracking-wider">{slotId}</div>
        </div>
      )}
    </motion.div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function EscalacaoFormacao({
  jogoId,
  mandante = 'Avaí',
  mandanteLogo = 'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png',
  rodada,
}: EscalacaoFormacaoProps) {
  const router = useRouter();

  const [step, setStep]                       = useState<Step>('loading');
  const [formation, setFormation]             = useState('4-3-3');
  const [slotMap, setSlotMap]                 = useState<SlotMap>({});
  const [activeSlot, setActiveSlot]           = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer]     = useState<Player | null>(null);
  const [captainId, setCaptainId]             = useState<number | null>(null);
  const [heroId, setHeroId]                   = useState<number | null>(null);
  const [palpiteMandante, setPalpiteMandante] = useState(1);
  const [palpiteVisitante, setPalpiteVisitante] = useState(2);
  const [finalImageUri, setFinalImageUri]     = useState<string | null>(null);
  const [isGenerating, setIsGenerating]       = useState(false);

  const [userId, setUserId]         = useState<string | null>(null);
  const [userName, setUserName]     = useState<string>('TORCEDOR');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [hadSaved, setHadSaved]     = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);
  const [posFiltro, setPosFiltro] = useState<Posicao>('TODOS');

  const finalCardRef = useRef<HTMLDivElement>(null);
  const arenaRef     = useRef<HTMLDivElement>(null);

  const getValidPhotoUrl = useCallback((fotoPath: string) => {
    if (!fotoPath) return ESCUDO_DEFAULT;
    const filename = fotoPath.split('/').pop() || fotoPath;
    return `${BASE_STORAGE}${encodeURIComponent(filename)}`;
  }, []);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const buildEmptySlots = (formacao: string): SlotMap => {
      const coords = formationConfigs[formacao] ?? formationConfigs['4-3-3'];
      const initial: SlotMap = {};
      Object.entries(coords).forEach(([id, c]) => { initial[id] = { player: null, x: c.x, y: c.y }; });
      return initial;
    };

    const loadExisting = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled && user) {
          setUserId(user.id);
          let profile: { apelido?: string | null; nome?: string | null; avatar_url?: string | null } | null = null;
          const { data: byId } = await supabase
            .from(PROFILE_TABLE).select('apelido, nome, avatar_url').eq('id', user.id).maybeSingle();
          if (byId) {
            profile = byId;
          } else if (user.email) {
            const { data: byEmail } = await supabase
              .from(PROFILE_TABLE).select('apelido, nome, avatar_url').eq('email', user.email).maybeSingle();
            if (byEmail) profile = byEmail;
          }
          if (!cancelled) {
            const meta = (user.user_metadata || {}) as Record<string, unknown>;
            const fallbackName =
              (meta.nome as string) || (meta.name as string) || (meta.full_name as string) ||
              user.email?.split('@')[0] || 'TORCEDOR';
            setUserName(
              (profile?.apelido || profile?.nome || fallbackName).toString().toUpperCase().slice(0, 20)
            );
            setUserAvatar(profile?.avatar_url || (meta.avatar_url as string) || null);
          }
        }
        if (!user || !jogoId) {
          if (!cancelled) {
            setSlotMap(buildEmptySlots('4-3-3'));
            setStep('formation');
          }
          return;
        }
        const { data, error } = await supabase
          .from(TABLE)
          .select('formacao, slots, capitao_id, heroi_id, palpite_mandante, palpite_visitante')
          .eq('user_id', user.id).eq('jogo_id', Number(jogoId)).maybeSingle();
        if (cancelled) return;
        if (error || !data) {
          setSlotMap(buildEmptySlots('4-3-3'));
          setStep('formation');
          return;
        }
        const formacao = data.formacao || '4-3-3';
        const coords   = formationConfigs[formacao] ?? formationConfigs['4-3-3'];
        const restored: SlotMap = {};
        const slotsJson = (data.slots ?? {}) as Record<string, number | { id: number; x?: number; y?: number } | null>;
        Object.entries(coords).forEach(([slotId, c]) => {
          const raw = slotsJson[slotId];
          let pid: number | null = null;
          let savedX = c.x;
          let savedY = c.y;
          if (typeof raw === 'number') {
            pid = raw;
          } else if (raw && typeof raw === 'object') {
            pid = raw.id ?? null;
            if (typeof raw.x === 'number') savedX = raw.x;
            if (typeof raw.y === 'number') savedY = raw.y;
          }
          const player = pid != null ? PLAYERS_DATA.find(p => p.id === pid) ?? null : null;
          restored[slotId] = { player, x: savedX, y: savedY };
        });
        setFormation(formacao);
        setSlotMap(restored);
        setCaptainId(data.capitao_id ?? null);
        setHeroId(data.heroi_id ?? null);
        setPalpiteMandante(data.palpite_mandante ?? 1);
        setPalpiteVisitante(data.palpite_visitante ?? 2);
        setHadSaved(true);
        setStep('arena');
      } catch (e) {
        console.error('[EscalacaoFormacao] erro no load:', e);
        if (!cancelled) {
          setSlotMap(buildEmptySlots('4-3-3'));
          setStep('formation');
        }
      }
    };
    loadExisting();
    return () => { cancelled = true; };
  }, [jogoId]);

  const handleChangeFormation = (novaFormacao: string) => {
    const coords = formationConfigs[novaFormacao];
    const playersAtuais = Object.values(slotMap).map(s => s.player).filter((p): p is Player => p !== null);
    const novo: SlotMap = {};
    Object.entries(coords).forEach(([id, c]) => { novo[id] = { player: null, x: c.x, y: c.y }; });
    const queue = [...playersAtuais];
    Object.keys(novo).forEach(slotId => {
      if (queue.length > 0) novo[slotId].player = queue.shift()!;
    });
    setFormation(novaFormacao);
    setSlotMap(novo);
    setStep('arena');
  };

  const handlePlayerSelection = (player: Player) => {
    const slotComEle = Object.entries(slotMap).find(([, s]) => s.player?.id === player.id);
    if (slotComEle) {
      setSlotMap(prev => ({ ...prev, [slotComEle[0]]: { ...prev[slotComEle[0]], player: null } }));
      return;
    }
    if (activeSlot) {
      setSlotMap(prev => ({ ...prev, [activeSlot]: { ...prev[activeSlot], player } }));
      setActiveSlot(null);
    } else {
      setPendingPlayer(player);
    }
  };

  const handleSlotClick = (slotId: string) => {
    if (pendingPlayer) {
      setSlotMap(prev => ({ ...prev, [slotId]: { ...prev[slotId], player: pendingPlayer } }));
      setPendingPlayer(null);
    } else {
      setActiveSlot(slotId === activeSlot ? null : slotId);
    }
  };

  const handleSlotDragSettled = useCallback((slotId: string, newX: number, newY: number) => {
    setSlotMap(prev => {
      if (!prev[slotId]) return prev;
      return { ...prev, [slotId]: { ...prev[slotId], x: newX, y: newY } };
    });
  }, []);

  const selectedPlayers = Object.values(slotMap)
    .map(s => s.player)
    .filter((p): p is Player => p !== null);

  const teamOvr = useMemo(() => {
    if (selectedPlayers.length === 0) return 0;
    const total = selectedPlayers.reduce((sum, p) => sum + (p.ovr ?? 75), 0);
    return Math.round(total / selectedPlayers.length);
  }, [selectedPlayers]);

  const filteredPlayers = useMemo(() => {
    if (posFiltro === 'TODOS') return PLAYERS_DATA;
    return PLAYERS_DATA.filter(p => p.pos === posFiltro);
  }, [posFiltro]);

  const handleSelectCaptain = (id: number) => { setCaptainId(id); setStep('hero');    };
  const handleSelectHero    = (id: number) => { setHeroId(id);    setStep('palpite'); };

  const triggerCelebration = () => {
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    confetti({ particleCount: 180, angle: 60,  spread: 80, origin: { x: 0.1 } });
    confetti({ particleCount: 180, angle: 120, spread: 80, origin: { x: 0.9 } });
  };

  const saveEscalacao = async (): Promise<{ ok: boolean; reason?: string }> => {
    if (!userId)  return { ok: false, reason: 'sem-login' };
    if (!jogoId)  return { ok: false, reason: 'sem-jogo'  };
    const slots: Record<string, { id: number; x: number; y: number } | null> = {};
    Object.entries(slotMap).forEach(([slotId, state]) => {
      slots[slotId] = state.player ? { id: state.player.id, x: state.x, y: state.y } : null;
    });
    const payload = {
      user_id: userId,
      jogo_id: Number(jogoId),
      formacao: formation,
      slots,
      capitao_id: captainId,
      heroi_id: heroId,
      palpite_mandante: palpiteMandante,
      palpite_visitante: palpiteVisitante,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'user_id,jogo_id' });
    if (error) {
      console.error('[saveEscalacao] erro:', error);
      return { ok: false, reason: error.message };
    }
    setHadSaved(true);
    return { ok: true };
  };

  const generateFinalImage = async () => {
    setStep('saving');
    const saveRes = await saveEscalacao();
    if (!saveRes.ok && saveRes.reason === 'sem-login') {
      alert('Faz login para guardar no ranking. Vou gerar a imagem agora!');
    }
    setIsGenerating(true);
    
    await new Promise(r => setTimeout(r, 400));
    const node = document.getElementById('arena-capture-area') || finalCardRef.current;
    
    if (!node) {
      setIsGenerating(false);
      setStep('arena');
      return;
    }

    try {
      // Ajuste de tipagem para evitar erro no Vercel build
      const options = {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a',
        skipFonts: true,
      } as any;

      const dataUrl = await htmlToImage.toPng(node, options);
      setFinalImageUri(dataUrl);
      setStep('final');
      setTimeout(() => triggerCelebration(), 300);
    } catch (e) {
      console.error('[EscalacaoFormacao] erro ao gerar imagem:', e);
      setStep('arena');
    } finally {
      setIsGenerating(false);
    }
  };

  const verEscalacaoSalva = async () => {
    setStep('saving');
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 300));
    setStep('final');
    await new Promise(r => setTimeout(r, 300));
    
    const node = document.getElementById('arena-capture-area') || finalCardRef.current;
    if (node) {
      try {
        const dataUrl = await htmlToImage.toPng(node, {
          cacheBust: true, quality: 0.95, pixelRatio: 2, backgroundColor: '#0a0a0a',
        } as any);
        setFinalImageUri(dataUrl);
        triggerCelebration();
      } catch (e) {
        console.error(e);
      }
    }
    setIsGenerating(false);
  };

  const buildShareText = () => {
    const cap  = selectedPlayers.find(p => p.id === captainId)?.short ?? '—';
    const hero = selectedPlayers.find(p => p.id === heroId)?.short    ?? '—';
    return `🐯 ARENA TIGRE FC\n\nAcabei de escalar meu Tigrão pro ${mandante} × Novorizontino!\n🛡️ Formação: ${formation}\n⭐ OVR: ${teamOvr}\n👑 Capitão: ${cap}\n🔥 Herói: ${hero}\n🎯 Palpite: ${palpiteMandante} × ${palpiteVisitante}\n\nMonte a sua: ${SHARE_BASE_URL}`;
  };

  const handleDownload = () => {
    if (!finalImageUri) return;
    const a = document.createElement('a');
    a.download = `escalacao-novorizontino-${Date.now()}.png`;
    a.href = finalImageUri;
    a.click();
  };

  const shareWhatsApp = () => {
    const text = buildShareText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareX = () => {
    const text = buildShareText();
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const finalizarEVoltar = () => router.push('/tigre-fc');

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">
        {step === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"><img src={STADIUM_BG} alt="" className="w-full h-full object-cover" /></div>
            <div className="relative z-10 flex flex-col items-center">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">🐯</motion.div>
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2 uppercase">Entrando no Vestiário...</div>
            </div>
          </motion.div>
        )}

        {/* --- PASSO: ESCOLHA DA FORMAÇÃO --- */}
        {step === 'formation' && (
          <motion.div key="form" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex-1 flex flex-col p-6 items-center justify-center space-y-8 bg-zinc-950 relative">
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent" />
             <div className="text-center">
                <div className="text-[#F5C400] font-black text-[10px] tracking-[4px] uppercase mb-2">Tactical Setup</div>
                <h2 className="text-4xl font-black italic tracking-tighter text-white uppercase drop-shadow-lg">Escolha o Esquema</h2>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
                {Object.keys(formationConfigs).map((f) => (
                  <button key={f} onClick={() => handleChangeFormation(f)}
                    className="group relative h-24 bg-zinc-900 border-2 border-zinc-800 rounded-2xl flex items-center justify-center overflow-hidden transition-all hover:border-[#F5C400] hover:scale-105 active:scale-95 shadow-xl">
                    <div className="absolute inset-0 bg-[#F5C400] opacity-0 group-hover:opacity-5 transition-opacity" />
                    <span className="text-2xl font-black italic text-zinc-400 group-hover:text-white transition-colors">{f}</span>
                  </button>
                ))}
             </div>
          </motion.div>
        )}

        {/* --- PASSO: ARENA (ESCALAÇÃO) --- */}
        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col md:flex-row relative bg-[#050505]">
            <div ref={arenaRef} className="relative flex-1 bg-zinc-900 overflow-hidden">
               <img src={STADIUM_BG} alt="Arena" className="w-full h-full object-cover opacity-80" draggable={false} />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
               <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 z-50">
                  <div className="text-center">
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">OVR TIME</div>
                    <div className="text-xl font-black italic text-[#F5C400] leading-none tabular-nums">{teamOvr}</div>
                  </div>
                  <div className="w-[1px] h-6 bg-white/10" />
                  <div className="text-center">
                    <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">ESCALADOS</div>
                    <div className="text-xl font-black italic text-white leading-none tabular-nums">{selectedPlayers.length}/11</div>
                  </div>
               </div>
               {Object.entries(slotMap).map(([id, state]) => (
                 <DraggableSlot key={id} slotId={id} state={state} arenaRef={arenaRef}
                   isActive={activeSlot === id} hasPending={!!pendingPlayer} isDesktop={isDesktop}
                   isCaptain={state.player?.id === captainId} isHero={state.player?.id === heroId}
                   onDragSettled={handleSlotDragSettled} onClick={handleSlotClick} getValidPhotoUrl={getValidPhotoUrl} />
               ))}
            </div>
            <div className="h-[40vh] md:h-full md:w-96 bg-zinc-950 border-t md:border-t-0 md:border-l border-white/10 flex flex-col shadow-2xl z-[100]">
               <div className="p-4 space-y-4">
                 <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                   {POSICOES.map(p => (
                     <button key={p} onClick={() => setPosFiltro(p)}
                       className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                         posFiltro === p ? 'bg-[#F5C400] text-black shadow-[0_0_15px_rgba(245,196,0,0.3)]' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                       }`}>
                       {p}
                     </button>
                   ))}
                 </div>
               </div>
               <div className="flex-1 overflow-y-auto p-4 pt-0 grid grid-cols-3 md:grid-cols-2 gap-3 no-scrollbar">
                 {filteredPlayers.map(p => (
                   <FutCard key={p.id} player={p} escalado={selectedPlayers.some(sp => sp.id === p.id)}
                     pending={pendingPlayer?.id === p.id} onClick={() => handlePlayerSelection(p)} getValidPhotoUrl={getValidPhotoUrl} />
                 ))}
               </div>
               <div className="p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5">
                 <button onClick={() => selectedPlayers.length === 11 ? setStep('captain') : alert('Escale os 11 jogadores!')}
                   className={`w-full h-14 rounded-2xl font-black uppercase italic tracking-tighter text-lg transition-all ${
                     selectedPlayers.length === 11 ? 'bg-[#F5C400] text-black hover:scale-[1.02] active:scale-95 shadow-xl' : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                   }`}>
                   Confirmar Time
                 </button>
               </div>
            </div>
          </motion.div>
        )}

        {/* --- PASSO: CAPITÃO --- */}
        {step === 'captain' && (
          <motion.div key="cap" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col p-6 bg-zinc-950 items-center justify-center">
            <div className="text-center mb-10">
              <div className="text-[#fbbf24] font-black text-xs tracking-[4px] uppercase mb-2">The Leader</div>
              <h2 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-xl">Quem é o Capitão?</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl overflow-y-auto max-h-[60vh] p-4 no-scrollbar">
              {selectedPlayers.map(p => (
                <button key={p.id} onClick={() => handleSelectCaptain(p.id)}
                  className="relative aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border-2 border-zinc-800 transition-all hover:border-[#fbbf24] hover:scale-105 active:scale-95 group shadow-2xl">
                  <img src={getValidPhotoUrl(p.foto)} alt={p.short} className="w-full h-full object-cover transition-transform group-hover:scale-110" onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-0 right-0 text-center px-2">
                    <div className="text-sm font-black italic text-white uppercase truncate">{p.short}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- PASSO: HERÓI --- */}
        {step === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col p-6 bg-zinc-950 items-center justify-center">
            <div className="text-center mb-10">
              <div className="text-cyan-400 font-black text-xs tracking-[4px] uppercase mb-2">Match Winner</div>
              <h2 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-xl">Quem decide o Jogo?</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl overflow-y-auto max-h-[60vh] p-4 no-scrollbar">
              {selectedPlayers.map(p => (
                <button key={p.id} onClick={() => handleSelectHero(p.id)}
                  className="relative aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border-2 border-zinc-800 transition-all hover:border-cyan-400 hover:scale-105 active:scale-95 group shadow-2xl">
                  <img src={getValidPhotoUrl(p.foto)} alt={p.short} className="w-full h-full object-cover transition-transform group-hover:scale-110" onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-0 right-0 text-center px-2">
                    <div className="text-sm font-black italic text-white uppercase truncate">{p.short}</div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* --- PASSO: PALPITE --- */}
        {step === 'palpite' && (
          <motion.div key="palp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col p-6 bg-zinc-950 items-center justify-center">
            <div className="text-center mb-12">
              <div className="text-[#F5C400] font-black text-xs tracking-[4px] uppercase mb-2">Score Prediction</div>
              <h2 className="text-5xl font-black italic tracking-tighter uppercase drop-shadow-xl">Qual o seu Palpite?</h2>
            </div>
            <div className="flex items-center justify-center gap-6 md:gap-12 mb-16 scale-110 md:scale-125">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-zinc-900 rounded-3xl border-2 border-zinc-800 shadow-2xl">
                    <img src={mandanteLogo} alt={mandante} className="w-14 h-14 md:w-20 md:h-20 object-contain" />
                  </div>
                  <input type="number" value={palpiteMandante} onChange={(e) => setPalpiteMandante(Number(e.target.value))}
                    className="w-20 h-24 md:w-24 md:h-28 bg-zinc-900 border-2 border-zinc-800 rounded-3xl text-center text-5xl font-black italic text-white focus:border-[#F5C400] transition-all shadow-2xl outline-none" />
               </div>
               <div className="text-5xl font-black italic text-zinc-800 mt-20">X</div>
               <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 md:w-28 md:h-28 flex items-center justify-center bg-[#F5C400] rounded-3xl border-2 border-yellow-300 shadow-[0_0_40px_rgba(245,196,0,0.2)]">
                    <img src={ESCUDO_DEFAULT} alt="Novorizontino" className="w-14 h-14 md:w-20 md:h-20 object-contain" />
                  </div>
                  <input type="number" value={palpiteVisitante} onChange={(e) => setPalpiteVisitante(Number(e.target.value))}
                    className="w-20 h-24 md:w-24 md:h-28 bg-zinc-900 border-2 border-zinc-800 rounded-3xl text-center text-5xl font-black italic text-[#F5C400] focus:border-[#F5C400] transition-all shadow-2xl outline-none" />
               </div>
            </div>
            <button onClick={generateFinalImage} disabled={isGenerating}
              className="w-full max-w-sm h-16 bg-[#F5C400] text-black rounded-2xl font-black uppercase italic tracking-tighter text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl">
              {isGenerating ? 'Processando Dados...' : 'Gerar Minha Escalada'}
            </button>
          </motion.div>
        )}

        {/* --- PASSO: SALVANDO (INTERMEDIÁRIO) --- */}
        {step === 'saving' && (
          <motion.div key="saving" className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
             <div className="relative mb-8 w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-zinc-800 rounded-full" />
                <motion.div className="absolute inset-0 border-4 border-t-[#F5C400] border-r-transparent border-b-transparent border-l-transparent rounded-full"
                  animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
                <span className="text-4xl">🐯</span>
             </div>
             <h3 className="text-2xl font-black italic uppercase tracking-tight mb-2">Renderizando Campo</h3>
             <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase">Aguarde um instante...</p>
          </motion.div>
        )}

        {/* --- PASSO: FINAL (SUCESSO / COMPARTILHAMENTO) --- */}
        {step === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex-1 flex flex-col bg-zinc-950 overflow-y-auto no-scrollbar relative">
            
            {/* FUNDO DINÂMICO PARA CELEBRAÇÃO */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
               <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F5C400]/10 blur-[120px] rounded-full" />
               <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full" />
            </div>

            {/* CARD PRINCIPAL DE CAPTURA - ESTILO STORY */}
            <div className="flex-1 flex flex-col items-center pt-8 px-4 pb-6">
              <div id="arena-capture-area" ref={finalCardRef}
                className="relative w-full max-w-[360px] aspect-[9/16] rounded-[40px] overflow-hidden border-[1px] border-white/10 bg-[#050505] shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
                
                {/* CAMPO DE FUNDO */}
                <div className="absolute inset-0 scale-[1.02]">
                   <img src={STADIUM_BG} alt="Arena" className="w-full h-full object-cover opacity-90" />
                   <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
                </div>

                {/* INFO DO TOPO - ROUND / COMPETITION */}
                <div className="absolute top-8 left-0 right-0 flex flex-col items-center z-20">
                   <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 mb-2">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-[3px]">Tigre FC • Arena</span>
                   </div>
                   <div className="flex items-center gap-5 mt-1 scale-110">
                      <div className="flex flex-col items-center">
                        <img src={mandanteLogo} alt={mandante} className="w-10 h-10 object-contain drop-shadow-lg" />
                        <span className="text-[8px] font-black text-white/50 uppercase mt-1 tracking-tighter">{mandante}</span>
                      </div>
                      <div className="text-xl font-black italic text-[#F5C400] drop-shadow-lg">X</div>
                      <div className="flex flex-col items-center">
                        <img src={ESCUDO_DEFAULT} alt="Novorizontino" className="w-10 h-10 object-contain drop-shadow-lg" />
                        <span className="text-[8px] font-black text-[#F5C400] uppercase mt-1 tracking-tighter">Novorizontino</span>
                      </div>
                   </div>
                </div>

                {/* ESCALAÇÃO VISUAL - MINI JOGADORES NO CARD FINAL */}
                <div className="absolute inset-0 z-10 p-6 pointer-events-none">
                  {Object.entries(slotMap).map(([id, state]) => {
                    if (!state.player) return null;
                    const c = getRarityColors(state.player.ovr ?? 75);
                    return (
                      <div key={id} style={{ position: 'absolute', left: `${state.x}%`, top: `${state.y}%`, width: 44, height: 60, marginLeft: -22, marginTop: -30 }}
                        className="flex flex-col items-center">
                        <div className="relative w-full aspect-square rounded-full border-[1.5px] overflow-hidden shadow-2xl bg-black" style={{ borderColor: state.player.id === captainId ? '#fbbf24' : state.player.id === heroId ? '#22d3ee' : c.border }}>
                          <img src={getValidPhotoUrl(state.player.foto)} alt="" className="w-full h-full object-cover" />
                          {state.player.id === captainId && <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 text-black text-[6px] font-black flex items-center justify-center rounded-full">C</div>}
                        </div>
                        <div className="mt-1 bg-black/80 backdrop-blur-md border border-white/10 px-1.5 py-0.5 rounded-sm">
                           <span className="text-[6px] font-black text-white uppercase whitespace-nowrap tracking-tighter">{state.player.short}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* INFO RODAPÉ DO STORY - PALPITE E USER */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                   <div className="flex items-end justify-between">
                      <div className="flex flex-col">
                        <div className="text-[9px] font-black text-[#F5C400] uppercase tracking-widest mb-1">Palpite Final</div>
                        <div className="text-4xl font-black italic text-white tabular-nums leading-none tracking-tighter shadow-black">
                          {palpiteMandante}<span className="text-[#F5C400] mx-1">×</span>{palpiteVisitante}
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                           <div className="text-right">
                              <div className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Escalado por</div>
                              <div className="text-[12px] font-black italic text-white uppercase leading-none tracking-tighter truncate max-w-[80px]">{userName}</div>
                           </div>
                           <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-zinc-900">
                              {userAvatar ? <img src={userAvatar} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px]">🐯</div>}
                           </div>
                        </div>
                      </div>
                   </div>
                   <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                      <div className="flex gap-4">
                        <div className="flex flex-col">
                           <span className="text-[7px] font-black text-white/30 uppercase tracking-[2px]">Team OVR</span>
                           <span className="text-sm font-black italic text-[#F5C400] leading-none">{teamOvr}</span>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[7px] font-black text-white/30 uppercase tracking-[2px]">Tática</span>
                           <span className="text-sm font-black italic text-white leading-none">{formation}</span>
                        </div>
                      </div>
                      <div className="text-[7px] font-black text-white/20 uppercase tracking-[4px] rotate-[-90deg] origin-right">#TigreFC</div>
                   </div>
                </div>
              </div>
            </div>

            {/* BARRA DE AÇÕES - FIXA AO FUNDO NO MOBILE */}
            <div className="w-full max-w-md mx-auto px-6 pb-12 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button onClick={handleDownload}
                  className="w-full h-14 bg-[#F5C400] text-black rounded-2xl font-black uppercase italic tracking-tighter text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(245,196,0,0.15)] transition-all active:scale-95">
                  <span className="text-xl">💾</span> Baixar Escalada
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={shareWhatsApp}
                  className="h-14 rounded-2xl flex items-center justify-center gap-2 font-black uppercase italic tracking-tighter transition-all active:scale-95 shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                    color: '#fff',
                  }}>
                  <span className="text-xl">💬</span> WhatsApp
                </button>
                <button onClick={shareX}
                  className="h-14 rounded-2xl flex items-center justify-center font-black text-2xl tracking-wider uppercase transition-all hover:scale-105 active:scale-95 shadow-xl"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                  }}>
                  𝕏
                </button>
              </div>

              {/* Links de navegação — texto puro, sem peso visual */}
              <div className="flex items-center justify-between pt-3">
                <button onClick={() => setStep('arena')}
                  className="text-zinc-500 hover:text-white text-[10px] font-black tracking-[2px] uppercase transition-colors">
                  ← Editar Escalada
                </button>
                <button onClick={finalizarEVoltar}
                  className="text-zinc-500 hover:text-[#F5C400] text-[10px] font-black tracking-[2px] uppercase transition-colors">
                  Painel Arena →
                </button>
              </div>
            </div>
            <div className="h-8" />
          </motion.div>
        )}

      </AnimatePresence>

      {hadSaved && step === 'arena' && (
        <motion.button initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={verEscalacaoSalva}
          className="fixed top-3 right-3 z-[200] bg-cyan-400 text-black px-3 py-2 rounded-full font-black text-[10px] uppercase tracking-wider shadow-lg">
          Ver Salva
        </motion.button>
      )}
    </div>
  );
}
