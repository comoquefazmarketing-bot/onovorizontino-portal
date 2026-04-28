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
// FUT CARD — usado no mercado
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

  const playerEscalado = (id: number) => selectedPlayers.some(p => p.id === id);

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
      alert('Você precisa estar logado pra salvar sua escalação no ranking. Mas vou gerar a arte do mesmo jeito!');
    } else if (!saveRes.ok) {
      console.warn('Erro salvando:', saveRes.reason);
    }
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 100));
    if (!finalCardRef.current) {
      setStep('final');
      await new Promise(r => setTimeout(r, 250));
    }
    if (!finalCardRef.current) {
      setIsGenerating(false);
      alert('Erro ao gerar imagem. Tenta de novo.');
      return;
    }
    try {
      const dataUrl = await htmlToImage.toPng(finalCardRef.current, {
        cacheBust: true, quality: 0.98, pixelRatio: 3, backgroundColor: '#0a0a0a',
      });
      setFinalImageUri(dataUrl);
      setStep('final');
      setTimeout(() => triggerCelebration(), 200);
    } catch (e) {
      console.error('[EscalacaoFormacao] erro ao gerar imagem:', e);
      alert('Erro ao gerar a imagem. Tente novamente!');
    } finally {
      setIsGenerating(false);
    }
  };

  const verEscalacaoSalva = async () => {
    setStep('saving');
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 250));
    setStep('final');
    await new Promise(r => setTimeout(r, 250));
    if (finalCardRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(finalCardRef.current, {
          cacheBust: true, quality: 0.98, pixelRatio: 3, backgroundColor: '#0a0a0a',
        });
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
    return (
`🐯 ARENA TIGRE FC

Acabei de escalar meu Tigrão pro ${mandante} × Novorizontino!
🛡️ Formação: ${formation}
⭐ OVR do time: ${teamOvr}
👑 Capitão: ${cap}
🔥 Herói: ${hero}
🎯 Palpite: ${palpiteMandante} × ${palpiteVisitante}

DUVIDO VOCÊ ESCALAR MELHOR! 😤

Monta a sua aqui:
${SHARE_BASE_URL}/${jogoId ?? ''}`
    );
  };

  const downloadImage = () => {
    if (!finalImageUri) return;
    const a = document.createElement('a');
    a.download = `escalacao-tigre-fc-${formation}.png`;
    a.href = finalImageUri;
    a.click();
  };

  const shareNative = async () => {
    if (!finalImageUri) return;
    const text = buildShareText();
    try {
      const blob = await (await fetch(finalImageUri)).blob();
      const file = new File([blob], `escalacao-tigre-fc-${formation}.png`, { type: 'image/png' });
      if (typeof navigator !== 'undefined' && (navigator as any).canShare?.({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: 'Minha escalação - Arena Tigre FC', text });
        return;
      }
      downloadImage();
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    } catch (e) {
      const err = e as Error;
      if (err.name !== 'AbortError') {
        console.error('[shareNative] erro:', e);
        downloadImage();
      }
    }
  };

  const shareWhatsApp = async () => {
    if (finalImageUri && typeof navigator !== 'undefined' && (navigator as any).canShare) {
      try {
        const blob = await (await fetch(finalImageUri)).blob();
        const file = new File([blob], `escalacao-tigre-fc-${formation}.png`, { type: 'image/png' });
        if ((navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({ files: [file], text: buildShareText(), title: 'Arena Tigre FC' });
          return;
        }
      } catch (e) {
        const err = e as Error;
        if (err.name === 'AbortError') return;
        console.error(e);
      }
    }
    downloadImage();
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(buildShareText())}`, '_blank');
  };

  const shareInstagram = async () => {
    if (finalImageUri && typeof navigator !== 'undefined' && (navigator as any).canShare) {
      try {
        const blob = await (await fetch(finalImageUri)).blob();
        const file = new File([blob], `escalacao-tigre-fc-${formation}.png`, { type: 'image/png' });
        if ((navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({ files: [file], title: 'Arena Tigre FC', text: 'Duvido você escalar melhor! 🐯' });
          return;
        }
      } catch (e) {
        const err = e as Error;
        if (err.name === 'AbortError') return;
        console.error(e);
      }
    }
    downloadImage();
    alert('📸 Imagem salva! Abre o Instagram, vai em Stories e adiciona a imagem que acabou de baixar. Cola o link nos stickers!');
  };

  const shareX = () => {
    const text = `🐯 Minha escalação pro ${mandante} × Novorizontino (${formation}) — OVR ${teamOvr} — Palpite ${palpiteMandante}×${palpiteVisitante} 🔥\nDuvido você fazer melhor! ${SHARE_BASE_URL}/${jogoId ?? ''}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const finalizarEVoltar = () => router.push('/tigre-fc');

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">

        {step === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"><img src={STADIUM_BG} alt="" className="w-full h-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">🐯</motion.div>
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ARENA TIGRE FC</div>
              <div className="text-white text-2xl font-black italic mb-8">ENTRANDO NO VESTIÁRIO...</div>
              <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-1/2" />
              </div>
            </div>
          </motion.div>
        )}

        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 relative overflow-auto">
            <div className="absolute inset-0 opacity-10"><img src={STADIUM_BG} alt="" className="w-full h-full object-cover" /></div>
            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ETAPA 1 DE 5</div>
              <h1 className="text-4xl font-black italic mb-2 text-yellow-500 uppercase tracking-tighter text-center">
                ESCOLHA A TÁTICA
              </h1>
              <p className="text-zinc-500 text-sm mb-10 text-center">Como o Tigrão vai entrar em campo?</p>
              <div className="grid grid-cols-2 gap-4 w-full">
                {Object.keys(formationConfigs).map(f => (
                  <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleChangeFormation(f)}
                    className={`py-8 border-2 rounded-3xl font-black text-2xl italic transition-all ${
                      formation === f
                        ? 'border-yellow-400 bg-yellow-500/10 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                        : 'bg-zinc-900 border-white/10 hover:border-yellow-500/50 hover:bg-zinc-800'
                    }`}>
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex relative overflow-hidden h-full">

            {/* MERCADO À ESQUERDA */}
            <div className="h-full w-[148px] sm:w-[190px] md:w-[300px] flex-shrink-0 z-[110] bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border-r border-yellow-500/10 flex flex-col">
              <div className="px-2 md:px-3 pt-2 md:pt-3 pb-1 border-b border-white/10 bg-black/95 backdrop-blur-md">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-yellow-400 font-black text-[11px] md:text-base tracking-widest italic">MERCADO</h3>
                  <div className="text-[9px] md:text-xs text-zinc-400 tabular-nums">
                    <span className="text-yellow-400 font-black">{selectedPlayers.length}</span><span className="text-zinc-600">/11</span>
                  </div>
                </div>
                {hadSaved && (
                  <div className="mb-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded text-[8px] md:text-[10px] text-cyan-300 font-bold tracking-wide">
                    ✓ ESCALAÇÃO SALVA
                  </div>
                )}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-0.5 md:gap-1">
                  {POSICOES.map(p => (
                    <button key={p} onClick={() => setPosFiltro(p)}
                      className={`text-[8px] md:text-[10px] font-black py-1 rounded tracking-wide transition-all ${
                        posFiltro === p
                          ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                          : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
                      }`}>
                      {p === 'TODOS' ? 'ALL' : p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-1.5 md:p-2">
                <div className="grid grid-cols-3 gap-1 md:gap-1.5">
                  <AnimatePresence mode="popLayout">
                    {filteredPlayers.map(player => (
                      <FutCard
                        key={player.id}
                        player={player}
                        escalado={playerEscalado(player.id)}
                        pending={pendingPlayer?.id === player.id}
                        onClick={() => handlePlayerSelection(player)}
                        getValidPhotoUrl={getValidPhotoUrl}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                {filteredPlayers.length === 0 && (
                  <div className="text-center text-zinc-500 text-xs mt-8">Nenhum jogador.</div>
                )}
              </div>
            </div>

            {/* CAMPO */}
            <div className="flex-1 relative bg-zinc-900 overflow-hidden" ref={arenaRef}>
              <img src={STADIUM_BG} alt="Estádio" className="absolute inset-0 w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="px-2.5 py-1 bg-black/80 backdrop-blur rounded-md border border-yellow-400/40">
                    <span className="text-yellow-400 text-[9px] md:text-[10px] font-black tracking-widest italic">{formation}</span>
                  </div>
                  {teamOvr > 0 && (
                    <div className="px-2.5 py-1 bg-yellow-400 text-black rounded-md font-black tabular-nums">
                      <span className="text-[9px] md:text-[10px] tracking-widest">OVR </span>
                      <span className="text-[12px] md:text-sm">{teamOvr}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => setStep('formation')}
                  className="px-2.5 py-1 bg-black/80 backdrop-blur rounded-md border border-white/20 text-[9px] md:text-[10px] font-black tracking-wider text-white hover:border-yellow-400/50">
                  TÁTICA
                </button>
              </div>

              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-cyan-500/10 backdrop-blur rounded-full border border-cyan-400/30 hidden sm:block">
                <span className="text-cyan-300 text-[9px] md:text-[10px] font-black tracking-wider">
                  ✋ ARRASTE OS JOGADORES PRA POSIÇÃO IDEAL
                </span>
              </div>

              <div className="absolute inset-0">
                {Object.entries(slotMap).map(([id, state]) => (
                  <DraggableSlot
                    key={id}
                    slotId={id}
                    state={state}
                    arenaRef={arenaRef}
                    isActive={activeSlot === id}
                    hasPending={!!pendingPlayer}
                    isDesktop={isDesktop}
                    isCaptain={state.player?.id === captainId}
                    isHero={state.player?.id === heroId}
                    onDragSettled={handleSlotDragSettled}
                    onClick={handleSlotClick}
                    getValidPhotoUrl={getValidPhotoUrl}
                  />
                ))}
              </div>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-50 px-3">
                <button onClick={finalizarEVoltar}
                  className="px-4 py-3 bg-zinc-900/90 border border-white/20 rounded-2xl text-[10px] md:text-xs font-black tracking-wider">
                  ← SAIR
                </button>
                <button
                  onClick={() => {
                    if (selectedPlayers.length < 11) {
                      alert(`Você precisa escalar 11 jogadores antes de seguir. Faltam ${11 - selectedPlayers.length}.`);
                      return;
                    }
                    setStep('captain');
                  }}
                  disabled={selectedPlayers.length < 11}
                  className={`flex-1 max-w-[280px] py-3 rounded-2xl text-[11px] md:text-sm font-black tracking-wider transition-all ${
                    selectedPlayers.length >= 11
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black shadow-[0_0_30px_rgba(250,204,21,0.5)] active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}>
                  ESCOLHER LÍDERES →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'captain' && (
          <motion.div key="captain" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-b from-zinc-950 to-black overflow-auto">

            <div className="text-center mb-6 mt-4">
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ETAPA 3 DE 5</div>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-500/15 border-2 border-yellow-400 rounded-full text-yellow-400 text-sm font-black tracking-widest mb-3 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
                <span className="text-xl">👑</span> CAPITÃO
              </div>
              <h1 className="text-3xl sm:text-4xl font-black italic text-yellow-400 tracking-tighter">ESCOLHA O LÍDER</h1>
              <div className="mt-3 inline-block px-4 py-1.5 bg-yellow-400 text-black rounded-md text-xs font-black tracking-wider">
                ⚡ PONTUA 2× MAIS QUE OS OUTROS
              </div>
            </div>

            {!captainId ? (
              <>
                <p className="text-zinc-400 text-sm mb-4 text-center max-w-md">
                  Toca no jogador que você acredita que vai brilhar. Os pontos dele valem dobrado no ranking.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl pb-8">
                  {selectedPlayers.map(p => {
                    const colors = getRarityColors(p.ovr ?? 75);
                    return (
                      <motion.button key={p.id} whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setCaptainId(p.id)}
                        className="relative p-2 rounded-2xl border-2 border-white/20 hover:border-yellow-400/60 transition-all overflow-hidden"
                        style={{ background: `linear-gradient(180deg, ${colors.border}33 0%, #0a0a0a 60%)` }}>
                        <div className="flex justify-between mb-1 px-1">
                          <span className="text-base font-black text-white tabular-nums leading-none">{p.ovr}</span>
                          <span className="text-[10px] font-black tracking-wider" style={{ color: colors.border }}>{p.pos}</span>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-full aspect-[3/4] object-cover rounded-xl"
                          style={{ objectPosition: '15% center' }} />
                        <p className="text-center mt-2 font-black text-sm tracking-wide truncate">{p.short}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <button onClick={() => setStep('arena')}
                  className="text-zinc-500 hover:text-white text-xs font-black tracking-widest pb-6">← VOLTAR PARA O CAMPO</button>
              </>
            ) : (
              // PREVIEW: jogador escolhido em destaque
              (() => {
                const p = selectedPlayers.find(pl => pl.id === captainId);
                if (!p) return null;
                const colors = getRarityColors(p.ovr ?? 75);
                return (
                  <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="flex flex-col items-center w-full max-w-sm">
                    <div className="relative">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute -inset-3 rounded-3xl"
                        style={{ background: 'conic-gradient(from 0deg, #fbbf24, transparent, #fbbf24)' }} />
                      <div className="relative p-3 rounded-3xl border-4 border-yellow-400 overflow-hidden shadow-[0_0_60px_#facc15]"
                        style={{ background: `linear-gradient(180deg, ${colors.border}66 0%, #0a0a0a 70%)` }}>
                        <div className="flex justify-between mb-2 px-2">
                          <div>
                            <div className="text-3xl font-black text-white tabular-nums leading-none">{p.ovr}</div>
                            <div className="text-xs font-black tracking-wider mt-0.5" style={{ color: colors.border }}>{p.pos}</div>
                          </div>
                          <div className="text-sm font-black bg-black/60 text-white px-2 py-0.5 rounded h-fit">#{p.num}</div>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-48 h-64 object-cover rounded-xl mx-auto"
                          style={{ objectPosition: '15% center' }} />
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-3 -right-3 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-4xl shadow-[0_0_30px_#facc15] z-20">
                          C
                        </motion.div>
                        <div className="text-center mt-3">
                          <div className="text-yellow-400 text-[10px] font-black tracking-[3px] mb-1">SEU CAPITÃO</div>
                          <div className="text-2xl font-black italic">{p.short}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2 mt-5 mb-5 text-center">
                      <span className="text-yellow-300 text-xs font-black tracking-wider">
                        ⚡ Os pontos de <span className="text-yellow-400">{p.short}</span> valerão <span className="text-yellow-400">2×</span>
                      </span>
                    </div>

                    <div className="flex gap-3 w-full">
                      <button onClick={() => setCaptainId(null)}
                        className="flex-1 py-4 bg-zinc-900 border-2 border-white/15 rounded-2xl text-xs font-black tracking-wider hover:border-white/30">
                        ← TROCAR
                      </button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep('hero')}
                        className="flex-[2] py-4 bg-gradient-to-r from-yellow-400 to-amber-400 text-black rounded-2xl text-sm font-black tracking-wider shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                        CONFIRMAR CAPITÃO →
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })()
            )}
          </motion.div>
        )}

        {step === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-b from-zinc-950 to-black overflow-auto">

            <div className="text-center mb-6 mt-4">
              <div className="text-cyan-400 text-xs font-black tracking-[6px] mb-2">ETAPA 4 DE 5</div>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-400/15 border-2 border-cyan-400 rounded-full text-cyan-400 text-sm font-black tracking-widest mb-3 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                <span className="text-xl">🔥</span> HERÓI DA PARTIDA
              </div>
              <h1 className="text-3xl sm:text-4xl font-black italic text-cyan-400 tracking-tighter">QUEM VAI DECIDIR?</h1>
              <div className="mt-3 inline-block px-4 py-1.5 bg-cyan-400 text-black rounded-md text-xs font-black tracking-wider">
                ⚡ +50% DE BÔNUS SE MARCAR OU DAR ASSISTÊNCIA
              </div>
              {captainId && (
                <div className="mt-3 text-[11px] text-zinc-500">
                  Capitão: <span className="text-yellow-400 font-black">👑 {selectedPlayers.find(p => p.id === captainId)?.short}</span>
                </div>
              )}
            </div>

            {!heroId ? (
              <>
                <p className="text-zinc-400 text-sm mb-4 text-center max-w-md">
                  Aposte no jogador que vai resolver o jogo (não pode ser o capitão).
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl pb-8">
                  {selectedPlayers.filter(p => p.id !== captainId).map(p => {
                    const colors = getRarityColors(p.ovr ?? 75);
                    return (
                      <motion.button key={p.id} whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setHeroId(p.id)}
                        className="relative p-2 rounded-2xl border-2 border-white/20 hover:border-cyan-400/60 transition-all overflow-hidden"
                        style={{ background: `linear-gradient(180deg, ${colors.border}33 0%, #0a0a0a 60%)` }}>
                        <div className="flex justify-between mb-1 px-1">
                          <span className="text-base font-black text-white tabular-nums leading-none">{p.ovr}</span>
                          <span className="text-[10px] font-black tracking-wider" style={{ color: colors.border }}>{p.pos}</span>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-full aspect-[3/4] object-cover rounded-xl"
                          style={{ objectPosition: '15% center' }} />
                        <p className="text-center mt-2 font-black text-sm tracking-wide truncate">{p.short}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <button onClick={() => setStep('captain')}
                  className="text-zinc-500 hover:text-white text-xs font-black tracking-widest pb-6">← TROCAR CAPITÃO</button>
              </>
            ) : (
              (() => {
                const p = selectedPlayers.find(pl => pl.id === heroId);
                if (!p) return null;
                const colors = getRarityColors(p.ovr ?? 75);
                return (
                  <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="flex flex-col items-center w-full max-w-sm">
                    <div className="relative">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute -inset-3 rounded-3xl"
                        style={{ background: 'conic-gradient(from 0deg, #22d3ee, transparent, #22d3ee)' }} />
                      <div className="relative p-3 rounded-3xl border-4 border-cyan-400 overflow-hidden shadow-[0_0_60px_#22d3ee]"
                        style={{ background: `linear-gradient(180deg, ${colors.border}66 0%, #0a0a0a 70%)` }}>
                        <div className="flex justify-between mb-2 px-2">
                          <div>
                            <div className="text-3xl font-black text-white tabular-nums leading-none">{p.ovr}</div>
                            <div className="text-xs font-black tracking-wider mt-0.5" style={{ color: colors.border }}>{p.pos}</div>
                          </div>
                          <div className="text-sm font-black bg-black/60 text-white px-2 py-0.5 rounded h-fit">#{p.num}</div>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-48 h-64 object-cover rounded-xl mx-auto"
                          style={{ objectPosition: '15% center' }} />
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-3 -right-3 w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center font-black text-black text-4xl shadow-[0_0_30px_#22d3ee] z-20">
                          H
                        </motion.div>
                        <div className="text-center mt-3">
                          <div className="text-cyan-400 text-[10px] font-black tracking-[3px] mb-1">SEU HERÓI</div>
                          <div className="text-2xl font-black italic">{p.short}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl px-4 py-2 mt-5 mb-3 text-center">
                      <span className="text-cyan-300 text-xs font-black tracking-wider">
                        ⚡ <span className="text-cyan-400">{p.short}</span> ganha bônus de <span className="text-cyan-400">+50%</span>
                      </span>
                    </div>

                    {/* Recap dos 2 líderes */}
                    <div className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 mb-4 flex items-center justify-around">
                      <div className="text-center">
                        <div className="text-yellow-400 text-[10px] font-black tracking-wider">👑 CAPITÃO</div>
                        <div className="text-sm font-black">{selectedPlayers.find(pl => pl.id === captainId)?.short}</div>
                      </div>
                      <div className="w-px h-8 bg-white/15" />
                      <div className="text-center">
                        <div className="text-cyan-400 text-[10px] font-black tracking-wider">🔥 HERÓI</div>
                        <div className="text-sm font-black">{p.short}</div>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full">
                      <button onClick={() => setHeroId(null)}
                        className="flex-1 py-4 bg-zinc-900 border-2 border-white/15 rounded-2xl text-xs font-black tracking-wider hover:border-white/30">
                        ← TROCAR
                      </button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep('palpite')}
                        className="flex-[2] py-4 bg-gradient-to-r from-cyan-400 to-cyan-300 text-black rounded-2xl text-sm font-black tracking-wider shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                        CONFIRMAR HERÓI →
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })()
            )}
          </motion.div>
        )}

        {step === 'palpite' && (
          <motion.div key="palpite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 overflow-auto">
            <div className="text-cyan-400 text-xs font-black tracking-[6px] mb-2">ETAPA 5 DE 5</div>
            <h1 className="text-4xl font-black mb-3">SEU PALPITE</h1>
            <p className="text-zinc-400 mb-12 text-sm">{mandante} × Novorizontino • Série B 2026</p>
            <div className="flex items-center gap-6 sm:gap-10 flex-wrap justify-center">
              <div className="flex flex-col items-center">
                <img src={mandanteLogo} alt={mandante} className="w-20 h-20 sm:w-24 sm:h-24 mb-3 object-contain" />
                <div className="text-lg sm:text-2xl font-black">{mandante}</div>
              </div>
              <div className="flex gap-4 sm:gap-6 items-center">
                <input type="number" min={0} value={palpiteMandante}
                  onChange={e => setPalpiteMandante(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 sm:w-24 bg-zinc-900 text-center rounded-2xl border-2 border-yellow-500 focus:border-yellow-400 text-5xl sm:text-6xl font-black outline-none py-3" />
                <span className="text-4xl sm:text-6xl text-yellow-400 font-black">×</span>
                <input type="number" min={0} value={palpiteVisitante}
                  onChange={e => setPalpiteVisitante(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 sm:w-24 bg-zinc-900 text-center rounded-2xl border-2 border-yellow-500 focus:border-yellow-400 text-5xl sm:text-6xl font-black outline-none py-3" />
              </div>
              <div className="flex flex-col items-center">
                <img src={ESCUDO_DEFAULT} alt="Novorizontino" className="w-20 h-20 sm:w-24 sm:h-24 mb-3 object-contain" />
                <div className="text-lg sm:text-2xl font-black">Novorizontino</div>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={generateFinalImage} disabled={isGenerating}
              className="mt-12 px-12 sm:px-20 py-6 sm:py-7 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black text-lg sm:text-2xl rounded-3xl shadow-[0_0_50px_#fbbf24] disabled:opacity-60 tracking-wider">
              {isGenerating ? 'GERANDO ARTE ÉPICA...' : 'CONFIRMAR ESCALAÇÃO 🔥'}
            </motion.button>
            <button onClick={() => setStep('hero')}
              className="mt-6 text-zinc-500 hover:text-white text-xs font-black tracking-widest">← TROCAR HERÓI</button>
          </motion.div>
        )}

        {step === 'saving' && (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"><img src={STADIUM_BG} alt="" className="w-full h-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full mb-6" />
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ARENA TIGRE FC</div>
              <div className="text-white text-2xl font-black italic">SALVANDO SUA ESCALAÇÃO...</div>
              <div className="text-zinc-500 text-sm mt-3">Computando no ranking 🏆</div>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start p-4 bg-black overflow-auto">

            <div className="text-yellow-400 text-[10px] font-black tracking-[6px] mt-2 mb-3">
              ✓ ESCALAÇÃO SALVA NO RANKING
            </div>

            {/* ════════════════════════════════════════════════════════════
                CARD 9:16 FIFA 26 — LIMPO, JOGADORES BEM DISTRIBUÍDOS
            ════════════════════════════════════════════════════════════ */}
            <div className="relative w-full max-w-[380px]">
              <div ref={finalCardRef}
                className="relative w-full bg-black rounded-3xl overflow-hidden"
                style={{
                  aspectRatio: '9 / 16',
                  border: '2px solid rgba(245,196,0,0.35)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(245,196,0,0.2)',
                }}>

                {/* BG: campo do estádio em escala vertical */}
                <img src={STADIUM_BG} alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: 'center' }} />

                {/* Vinheta cinematográfica — claro no centro, escuro nas pontas */}
                <div className="absolute inset-0" style={{
                  background: `
                    linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 18%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.95) 100%),
                    radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)
                  `,
                }} />

                {/* Glow lateral dourado discreto */}
                <div className="absolute inset-y-0 left-0 w-12 pointer-events-none" style={{
                  background: 'linear-gradient(90deg, rgba(245,196,0,0.18), transparent)',
                }} />
                <div className="absolute inset-y-0 right-0 w-12 pointer-events-none" style={{
                  background: 'linear-gradient(270deg, rgba(0,243,255,0.15), transparent)',
                }} />

                {/* ═══════════════ HEADER (0-12%) ═══════════════ */}
                <div className="absolute top-0 left-0 right-0 px-5 pt-5 z-20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      {userAvatar && (
                        <img src={userAvatar} alt={userName} crossOrigin="anonymous"
                          className="w-10 h-10 rounded-full object-cover"
                          style={{
                            border: '2px solid #F5C400',
                            boxShadow: '0 0 12px rgba(245,196,0,0.5)',
                          }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <div className="leading-none">
                        <div className="text-[9px] font-black tracking-[3px] text-[#F5C400]">⚡ TIGRE FC</div>
                        <div className="text-[15px] font-black italic mt-1 text-white">@{userName}</div>
                      </div>
                    </div>

                    {/* OVR card FUT — limpo, sem segundo badge */}
                    <div className="relative">
                      <div className="text-center px-3 py-1.5 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, #fde68a 0%, #F5C400 50%, #b45309 100%)',
                          boxShadow: '0 0 20px rgba(245,196,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
                        }}>
                        <div className="text-[8px] font-black tracking-[3px] text-black/70 leading-none">OVR</div>
                        <div className="text-2xl font-black italic tabular-nums leading-none mt-0.5 text-black">
                          {teamOvr}
                        </div>
                      </div>
                      <div className="text-center text-[8px] tracking-[3px] font-black text-white/80 mt-1 italic">
                        {formation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══════════════ CAMPO (12-72%) ═══════════════
                    JOGADORES BEM DISTRIBUÍDOS:
                    Mapeamento: y do campo (0-100%) → faixa do card (12-72%)
                    Fórmula: cardY = 12 + (state.y / 100) * 60
                ═══════════════════════════════════════════════════ */}
                <div className="absolute inset-0 pointer-events-none">
                  {Object.entries(slotMap).map(([id, state]) => state.player && (
                    <div key={id}
                      style={{
                        left: `${state.x}%`,
                        top: `${12 + (state.y / 100) * 60}%`,
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="w-[52px]">

                      {/* Mini card FUT — sombra projetada no gramado */}
                      <div className="relative">
                        {/* Sombra circular embaixo do card pra dar peso */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-2 rounded-full blur-sm"
                          style={{ background: 'rgba(0,0,0,0.6)' }} />

                        <div className="relative h-[68px] rounded-md overflow-hidden"
                          style={{
                            border: state.player.id === captainId
                              ? '2px solid #F5C400'
                              : state.player.id === heroId
                                ? '2px solid #00F3FF'
                                : '1.5px solid rgba(255,255,255,0.85)',
                            boxShadow: state.player.id === captainId
                              ? '0 0 18px rgba(245,196,0,0.85), 0 4px 8px rgba(0,0,0,0.7)'
                              : state.player.id === heroId
                                ? '0 0 18px rgba(0,243,255,0.85), 0 4px 8px rgba(0,0,0,0.7)'
                                : '0 4px 10px rgba(0,0,0,0.7)',
                          }}>
                          <img src={getValidPhotoUrl(state.player.foto)} alt={state.player.short}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: '85% center' }} />

                          {/* Faixa de nome — colorida pra C/H */}
                          <div className="absolute bottom-0 left-0 right-0 py-0.5"
                            style={{
                              background: state.player.id === captainId
                                ? 'linear-gradient(180deg, transparent, #F5C400 60%)'
                                : state.player.id === heroId
                                  ? 'linear-gradient(180deg, transparent, #00F3FF 60%)'
                                  : 'linear-gradient(180deg, transparent, rgba(0,0,0,0.95) 60%)',
                            }}>
                            <span className="text-[8px] font-black block text-center leading-tight"
                              style={{
                                color: (state.player.id === captainId || state.player.id === heroId) ? '#000' : '#fff',
                              }}>
                              {state.player.short}
                            </span>
                          </div>
                        </div>

                        {/* Selo C ou H — flutuando no canto, fora do card */}
                        {(state.player.id === captainId || state.player.id === heroId) && (
                          <div className="absolute -top-2 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black z-30"
                            style={{
                              background: state.player.id === captainId ? '#F5C400' : '#00F3FF',
                              color: '#000',
                              border: '1.5px solid #000',
                              boxShadow: state.player.id === captainId
                                ? '0 0 10px rgba(245,196,0,0.9)'
                                : '0 0 10px rgba(0,243,255,0.9)',
                            }}>
                            {state.player.id === captainId ? 'C' : 'H'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ═══════════════ FAIXA INFERIOR (72-100%) ═══════════════ */}

                {/* Linha divisória dourada */}
                <div className="absolute left-6 right-6 z-10"
                  style={{
                    top: '74%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.4), transparent)',
                  }} />

                {/* Placar — único e dominante */}
                <div className="absolute left-0 right-0 z-20" style={{ top: '77%' }}>
                  <div className="flex items-center justify-center gap-4">
                    <img src={mandanteLogo} alt="" className="w-10 h-10 object-contain"
                      crossOrigin="anonymous"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }} />

                    <div className="text-4xl font-black italic tabular-nums leading-none"
                      style={{
                        color: '#F5C400',
                        textShadow: '0 0 20px rgba(245,196,0,0.6), 0 2px 4px rgba(0,0,0,0.9)',
                      }}>
                      {palpiteMandante}
                      <span className="text-zinc-600 mx-2">×</span>
                      {palpiteVisitante}
                    </div>

                    <img src={ESCUDO_DEFAULT} alt="" className="w-10 h-10 object-contain"
                      crossOrigin="anonymous"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }} />
                  </div>
                  <div className="text-center text-[8px] tracking-[5px] font-black text-white/40 mt-1.5">
                    SEU PALPITE
                  </div>
                </div>

                {/* Capitão & Herói — linha enxuta */}
                <div className="absolute left-6 right-6 z-20 flex justify-between" style={{ top: '90%' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">👑</span>
                    <span className="text-[10px] font-black tracking-wide text-[#F5C400] truncate max-w-[100px]">
                      {selectedPlayers.find(p => p.id === captainId)?.short ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black tracking-wide text-[#00F3FF] truncate max-w-[100px]">
                      {selectedPlayers.find(p => p.id === heroId)?.short ?? '—'}
                    </span>
                    <span className="text-[10px]">🔥</span>
                  </div>
                </div>

                {/* Marca — TIGRE FC italic minimalista */}
                <div className="absolute bottom-3 left-0 right-0 text-center z-20">
                  <div className="text-base font-black italic tracking-tight">
                    TIGRE <span style={{ color: '#F5C400' }}>FC</span>
                  </div>
                  <div className="text-[7px] tracking-[3px] text-white/30 font-bold mt-0.5">
                    onovorizontino.com.br
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  BOTÃO SALVAR — circular, glassmorphism, fora do card
                  Posição: canto inferior direito, OVERLAY do card
              ═══════════════════════════════════════════════════════════ */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={downloadImage}
                disabled={!finalImageUri}
                aria-label="Salvar imagem"
                className="absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-40 z-30"
                style={{
                  background: 'rgba(20,20,20,0.55)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(245,196,0,0.4)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 15px rgba(245,196,0,0.2)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="#F5C400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </motion.button>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                AÇÕES SECUNDÁRIAS — fora do card, visualmente discretas
            ═══════════════════════════════════════════════════════════ */}
            <div className="mt-6 w-full max-w-[380px] space-y-3 px-2">
              {/* Compartilhar nativo — 1 CTA principal */}
              <motion.button whileTap={{ scale: 0.97 }} onClick={shareNative} disabled={!finalImageUri}
                className="w-full py-4 font-black rounded-2xl text-sm tracking-[3px] uppercase disabled:opacity-50"
                style={{
                  background: 'linear-gradient(90deg, #F5C400, #fbbf24)',
                  color: '#000',
                  boxShadow: '0 8px 24px rgba(245,196,0,0.3)',
                }}>
                Compartilhar
              </motion.button>

              {/* Atalhos por rede — minimalistas */}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={shareWhatsApp} disabled={!finalImageUri}
                  className="py-3 rounded-xl text-[10px] font-black tracking-wider uppercase disabled:opacity-50 transition-all hover:scale-105"
                  style={{
                    background: 'rgba(37,211,102,0.12)',
                    border: '1px solid rgba(37,211,102,0.4)',
                    color: '#25D366',
                  }}>
                  WhatsApp
                </button>
                <button onClick={shareInstagram} disabled={!finalImageUri}
                  className="py-3 rounded-xl text-[10px] font-black tracking-wider uppercase disabled:opacity-50 transition-all hover:scale-105"
                  style={{
                    background: 'rgba(225,48,108,0.12)',
                    border: '1px solid rgba(225,48,108,0.4)',
                    color: '#E1306C',
                  }}>
                  Instagram
                </button>
                <button onClick={shareX}
                  className="py-3 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all hover:scale-105"
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
                  className="text-zinc-500 hover:text-white text-[10px] font-black tracking-[2px] uppercase">
                  ← Editar
                </button>
                <button onClick={finalizarEVoltar}
                  className="text-zinc-500 hover:text-[#F5C400] text-[10px] font-black tracking-[2px] uppercase">
                  Arena →
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
          className="fixed top-3 right-3 z-[200] bg-cyan-400 text-black px-3 py-2 rounded-full font-black text-[10px] tracking-widest shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95">
          📸 VER ARTE
        </motion.button>
      )}
    </div>
  );
}
