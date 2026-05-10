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

// Dados da Rodada 8
const JOGO_ATUAL = {
  id: 13,
  mandante_id: 1,
  visitante_id: 7,
  mandante_nome: "Novorizontino",
  visitante_nome: "Botafogo-SP",
  visitante_logo: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Botafogo_sp.svg"
};

const TABLE          = 'tigre_fc_escalacoes';
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
  visitanteLogo?: string;
  mandanteNome?: string;
  rodada?: string | number;
}

const PLAYERS_DATA: Player[] = [
  { id: 23, name: 'Jordi Martins',       short: 'JORDI',      num: 93, pos: 'GOL', foto: 'JORDI.jpg.webp',           ovr: 82 },
  { id: 1,  name: 'César Augusto',      short: 'CÉSAR',      num: 31, pos: 'GOL', foto: 'CESAR-AUGUSTO.jpg.webp',   ovr: 78 },
  { id: 22, name: 'João Scapin',        short: 'SCAPIN',     num: 12, pos: 'GOL', foto: 'JOAO-SCAPIN.jpg.webp',      ovr: 72 },
  { id: 62, name: 'Lucas Ribeiro',      short: 'LUCAS',      num: 1,  pos: 'GOL', foto: 'LUCAS-RIBEIRO.jpg.webp',    ovr: 70 },
  { id: 101, name: 'Paulo Henrique',    short: 'P. HENRIQUE', num: 29, pos: 'GOL', foto: 'PAULO-HENRIQUE.jpg.webp',  ovr: 71 },
  { id: 8,  name: 'Patrick Marcos',     short: 'PATRICK',    num: 4,  pos: 'ZAG', foto: 'PATRICK.jpg.webp',          ovr: 84 },
  { id: 38, name: 'Renato Palm',        short: 'R. PALM',    num: 33, pos: 'ZAG', foto: 'RENATO-PALM.jpg.webp',      ovr: 81 },
  { id: 34, name: 'Eduardo Brock',      short: 'BROCK',      num: 8,  pos: 'ZAG', foto: 'EDUARDO-BROCK.jpg.webp',    ovr: 80 },
  { id: 66, name: 'Alexis Alvariño',    short: 'ALVARÍÑO',   num: 22, pos: 'ZAG', foto: 'IVAN-ALVARINO.jpg.webp',    ovr: 79 },
  { id: 6,  name: 'Carlinhos',          short: 'CARLINHOS',  num: 44, pos: 'ZAG', foto: 'CARLINHOS.jpg.webp',        ovr: 76 },
  { id: 3,  name: 'João Vitor Dantas',  short: 'DANTAS',     num: 25, pos: 'ZAG', foto: 'DANTAS.jpg.webp',           ovr: 75 },
  { id: 102, name: 'Arthur Barbosa',    short: 'ARTHUR',     num: 3,  pos: 'ZAG', foto: 'ARTHUR-BARBOSA.jpg.webp',   ovr: 73 },
  { id: 103, name: 'Antony Gustavo',    short: 'ANTONY',     num: 38, pos: 'ZAG', foto: 'ANTONY.jpg.webp',          ovr: 70 },
  { id: 104, name: 'Kauã Rocha',        short: 'ALEMÃO',     num: 21, pos: 'ZAG', foto: 'ALEMAO.jpg.webp',           ovr: 72 },
  { id: 9,  name: 'Sander Bortolotto',  short: 'SANDER',     num: 36, pos: 'LAT', foto: 'SANDER.jpg.webp',           ovr: 81 },
  { id: 28, name: 'Maykon Jesus',       short: 'MAYKON',     num: 66, pos: 'LAT', foto: 'MAYKON-JESUS.jpg.webp',     ovr: 78 },
  { id: 27, name: 'Nilson Castrillón',  short: 'CASTRILLÓN', num: 20, pos: 'LAT', foto: 'NILSON-CASTRILLON.jpg.webp', ovr: 77 },
  { id: 75, name: 'Jhilmar Lora',       short: 'LORA',       num: 2,  pos: 'LAT', foto: 'LORA.jpg.webp',             ovr: 74 },
  { id: 105, name: 'Carlos Roberto',    short: 'ESQUERDA',   num: 26, pos: 'LAT', foto: 'CARLOS-ESQUERDA.jpg.webp',  ovr: 71 },
  { id: 41, name: 'Luís Oyama',         short: 'OYAMA',      num: 6,  pos: 'VOL', foto: 'LUIS-OYAMA.jpg.webp',       ovr: 83 },
  { id: 46, name: 'Marlon Adriano',     short: 'MARLON',     num: 28, pos: 'VOL', foto: 'MARLON.jpg.webp',           ovr: 80 },
  { id: 40, name: 'Léo Naldi',          short: 'NALDI',      num: 18, pos: 'VOL', foto: 'LEO-NALDI.jpg.webp',        ovr: 78 },
  { id: 106, name: 'Gabriel Bahia',     short: 'G. BAHIA',   num: 5,  pos: 'VOL', foto: 'GABRIEL-BAHIA.jpg.webp',    ovr: 74 },
  { id: 47, name: 'Matheus Bianqui',    short: 'BIANQUI',    num: 17, pos: 'MEI', foto: 'MATHEUS-BIANQUI.jpg.webp',  ovr: 82 },
  { id: 10, name: 'Rômulo Azevedo',     short: 'RÔMULO',     num: 10, pos: 'MEI', foto: 'ROMULO.jpg.webp',           ovr: 86 },
  { id: 12, name: 'Alexandre Silva',    short: 'JUNINHO',    num: 50, pos: 'MEI', foto: 'JUNINHO.jpg.webp',          ovr: 79 },
  { id: 17, name: 'Luiz Otavio',        short: 'TAVINHO',    num: 15, pos: 'MEI', foto: 'TAVINHO.jpg.webp',          ovr: 78 },
  { id: 86, name: 'Christian Ortíz',    short: 'TITI ORTÍZ', num: 77, pos: 'MEI', foto: 'TITI-ORTIZ.jpg.webp',       ovr: 84 },
  { id: 13, name: 'Diego Galo',         short: 'D. GALO',    num: 19, pos: 'MEI', foto: 'DIEGO-GALO.jpg.webp',       ovr: 75 },
  { id: 107, name: 'Gabriel Correia',   short: 'G. CORREIA', num: 14, pos: 'MEI', foto: 'GABRIEL-CORREIA.jpg.webp',  ovr: 72 },
  { id: 108, name: 'Luiz Gabriel',      short: 'L. GABRIEL', num: 23, pos: 'MEI', foto: 'LUIZ-GABRIEL.jpg.webp',     ovr: 70 },
  { id: 109, name: 'Hector Bianchi',    short: 'HECTOR',     num: 32, pos: 'MEI', foto: 'HECTOR-BIANCHI.jpg.webp',   ovr: 73 },
  { id: 110, name: 'Miguel Contiero',   short: 'CONTIERO',   num: 35, pos: 'MEI', foto: 'MIGUEL-CONTIERO.jpg.webp',  ovr: 69 },
  { id: 111, name: 'Edson Junior',      short: 'NOGUEIRA',   num: 37, pos: 'MEI', foto: 'NOGUEIRA.jpg.webp',         ovr: 68 },
  { id: 15, name: 'Robson Fernandes',   short: 'ROBSON',     num: 11, pos: 'ATA', foto: 'ROBSON.jpg.webp',           ovr: 85 },
  { id: 59, name: 'Vinícius Paiva',     short: 'V. PAIVA',   num: 16, pos: 'ATA', foto: 'VINICIUS-PAIVA.jpg.webp',   ovr: 79 },
  { id: 57, name: 'Ronald Barcellos',   short: 'RONALD',     num: 7,  pos: 'ATA', foto: 'RONALD-BARCELLOS.jpg.webp',  ovr: 82 },
  { id: 55, name: 'Nicolas Careca',     short: 'CARECA',     num: 16, pos: 'ATA', foto: 'NICOLAS-CARECA.jpg.webp',   ovr: 80 },
  { id: 50, name: 'Carlos Henrique',    short: 'CARLÃO',     num: 9,  pos: 'ATA', foto: 'CARLAO.jpg.webp',           ovr: 84 },
  { id: 52, name: 'Hélio Borges',       short: 'HÉLIO',      num: 41, pos: 'ATA', foto: 'HELIO-BORGES.jpg.webp',     ovr: 76 },
  { id: 53, name: 'Jardiel Marciel',    short: 'JARDIEL',    num: 30, pos: 'ATA', foto: 'JARDIEL.jpg.webp',          ovr: 75 },
  { id: 112, name: 'Diego Mathias',     short: 'D. MATHIAS', num: 27, pos: 'ATA', foto: 'DIEGO-MATHIAS.jpg.webp',    ovr: 76 },
  { id: 113, name: 'Jhones Kauê',       short: 'J. KAUÊ',    num: 47, pos: 'ATA', foto: 'JHONES-KAUE.jpg.webp',      ovr: 71 }
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

async function waitForImages(root: HTMLElement, timeoutMs = 6000): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map(img => {
      if (img.complete && img.naturalHeight > 0) return Promise.resolve();
      return new Promise<void>(resolve => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        setTimeout(done, timeoutMs);
      });
    })
  );
}

function FutCard({ player, escalado, pending, onClick, getValidPhotoUrl }: any) {
  const ovr = player.ovr ?? 75;
  const colors = getRarityColors(ovr);
  return (
    <motion.button layout whileHover={{ scale: escalado ? 1 : 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClick}
      className={`relative flex flex-col items-center p-1.5 md:p-2 rounded-xl border-2 transition-all ${
        pending ? 'border-cyan-400 bg-cyan-400/20 scale-105 z-10' : escalado ? 'border-zinc-800 bg-zinc-900/50 grayscale opacity-40' : 'border-white/10 bg-zinc-900 hover:border-white/30'
      }`}>
      <div className="relative w-full aspect-[3/4] mb-1.5 rounded-lg overflow-hidden bg-black/40">
        <img src={getValidPhotoUrl(player.foto)} alt={player.short} className="w-full h-full object-cover" style={{ objectPosition: '15% center' }} />
        <div className="absolute top-1 left-1 flex flex-col items-start leading-none">
          <span className="text-[10px] md:text-xs font-black text-white tabular-nums">{ovr}</span>
          <span className="text-[7px] md:text-[8px] font-black" style={{ color: colors.border }}>{player.pos}</span>
        </div>
      </div>
      <span className="text-[8px] md:text-[10px] font-black truncate w-full text-center uppercase tracking-tighter">{player.short}</span>
    </motion.button>
  );
}

function DraggableSlot({ slotId, state, arenaRef, isActive, hasPending, isDesktop, isCaptain, isHero, onDragSettled, onClick, getValidPhotoUrl }: any) {
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const w = isDesktop ? SLOT_W_DESKTOP : SLOT_W_MOBILE;
  const h = isDesktop ? SLOT_H_DESKTOP : SLOT_H_MOBILE;
  const colors = state.player ? getRarityColors(state.player.ovr ?? 75) : null;
  return (
    <motion.div drag dragMomentum={false} dragConstraints={arenaRef}
      onDragEnd={(_, info) => {
        if (!arenaRef.current) return;
        const rect = arenaRef.current.getBoundingClientRect();
        const newX = clamp(((info.point.x - rect.left) / rect.width) * 100, 5, 95);
        const newY = clamp(((info.point.y - rect.top) / rect.height) * 100, 5, 95);
        onDragSettled(slotId, newX, newY);
        dragX.set(0); dragY.set(0);
      }}
      style={{ x: dragX, y: dragY, top: `${state.y}%`, left: `${state.x}%`, width: w, height: h, translateX: '-50%', translateY: '-50%' }}
      className="absolute z-20 cursor-grab active:cursor-grabbing flex flex-col items-center group">
      <div onClick={() => onClick(slotId)}
        className={`relative w-full h-full rounded-lg border-2 transition-all flex flex-col items-center justify-center overflow-hidden shadow-2xl ${
          isActive ? 'border-yellow-400 bg-yellow-400/20 scale-110 z-30 shadow-yellow-400/40' : state.player ? 'border-white/40 bg-zinc-900/90' : hasPending ? 'border-cyan-400/60 bg-cyan-400/10 border-dashed animate-pulse' : 'border-white/10 bg-black/40 border-dashed'
        }`}
        style={state.player && colors ? { borderColor: `${colors.border}88`, boxShadow: `0 10px 25px -5px ${colors.glow}` } : {}}>
        {state.player ? (
          <>
            <img src={getValidPhotoUrl(state.player.foto)} alt={state.player.short} className="w-full h-full object-cover" style={{ objectPosition: '15% center' }} />
            <div className="absolute top-1 left-1 flex flex-col items-start leading-none drop-shadow-md">
              <span className="text-[10px] md:text-xs font-black text-white tabular-nums">{state.player.ovr}</span>
              <span className="text-[7px] md:text-[8px] font-black" style={{ color: colors?.border }}>{state.player.pos}</span>
            </div>
            {isCaptain && <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-[10px] border-2 border-black shadow-lg z-30">C</div>}
            {isHero && <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center font-black text-black text-[10px] border-2 border-black shadow-lg z-30">H</div>}
            <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-sm py-0.5 border-t border-white/10">
              <p className="text-[7px] md:text-[9px] font-black text-center text-white truncate px-1 uppercase italic tracking-tighter">{state.player.short}</p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] md:text-xs font-black text-zinc-500 uppercase italic tracking-widest">{slotId}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function EscalacaoFormacao({ jogoId = JOGO_ATUAL.id, mandante = JOGO_ATUAL.mandante_nome, mandanteLogo = ESCUDO_DEFAULT, visitanteLogo = JOGO_ATUAL.visitante_logo, mandanteNome = JOGO_ATUAL.mandante_nome, rodada = 8 }: EscalacaoFormacaoProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('loading');
  const [userId, setUserId] = useState<string | null>(null);
  const [formation, setFormation] = useState('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [posFiltro, setPosFiltro] = useState<Posicao>('TODOS');
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [palpiteMandante, setPalpiteMandante] = useState(0);
  const [palpiteVisitante, setPalpiteVisitante] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hadSaved, setHadSaved] = useState(false);
  const [finalImageUri, setFinalImageUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);

  const getValidPhotoUrl = (foto: string) => (foto ? `${BASE_STORAGE}${foto}` : '/img/player-placeholder.png');

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize(); window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadExisting() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || cancelled) { setStep('formation'); return; }
      setUserId(user.id);
      const { data, error } = await supabase.from(TABLE).select('*').eq('usuario_id', user.id).eq('jogo_id', Number(jogoId)).maybeSingle();
      if (data && !cancelled) {
        setFormation(data.formacao || '4-3-3');
        setCaptainId(data.capitao_id || null);
        setHeroId(data.heroi_id || null);
        setPalpiteMandante(data.palpite_tigre || 0);
        setPalpiteVisitante(data.palpite_adv || 0);
        setHadSaved(true);
        const dbSlots = data.lineup || {};
        const currentCoords = formationConfigs[data.formacao || '4-3-3'];
        const reconstructed: SlotMap = {};
        Object.entries(currentCoords).forEach(([slotId, coord]) => {
          const dbData = dbSlots[slotId];
          const player = dbData ? PLAYERS_DATA.find(p => p.id === dbData.id) || null : null;
          reconstructed[slotId] = { player, x: dbData?.x ?? coord.x, y: dbData?.y ?? coord.y };
        });
        setSlotMap(reconstructed); setStep('arena');
      } else {
        setStep('formation');
      }
    }
    loadExisting(); return () => { cancelled = true; };
  }, [jogoId]);

  const handleChangeFormation = (f: string) => {
    const coords = formationConfigs[f];
    const playersAtuais = Object.values(slotMap).map(s => s.player).filter((p): p is Player => p !== null);
    const novo: SlotMap = {};
    Object.entries(coords).forEach(([id, c]) => { novo[id] = { player: null, x: c.x, y: c.y }; });
    const queue = [...playersAtuais];
    Object.keys(novo).forEach(slotId => { if (queue.length > 0) novo[slotId].player = queue.shift()!; });
    setFormation(f); setSlotMap(novo); setStep('arena');
  };

  const handlePlayerSelection = (player: Player) => {
    const slotComEle = Object.entries(slotMap).find(([, s]) => s.player?.id === player.id);
    if (slotComEle) { setSlotMap(prev => ({ ...prev, [slotComEle[0]]: { ...prev[slotComEle[0]], player: null } })); return; }
    if (activeSlot) { setSlotMap(prev => ({ ...prev, [activeSlot]: { ...prev[activeSlot], player } })); setActiveSlot(null); } else { setPendingPlayer(player); }
  };

  const handleSlotClick = (slotId: string) => {
    if (pendingPlayer) { setSlotMap(prev => ({ ...prev, [slotId]: { ...prev[slotId], player: pendingPlayer } })); setPendingPlayer(null); } else { setActiveSlot(slotId === activeSlot ? null : slotId); }
  };

  const handleSlotDragSettled = useCallback((slotId: string, newX: number, newY: number) => {
    setSlotMap(prev => { if (!prev[slotId]) return prev; return { ...prev, [slotId]: { ...prev[slotId], x: newX, y: newY } }; });
  }, []);

  const selectedPlayers = Object.values(slotMap).map(s => s.player).filter((p): p is Player => p !== null);
  const teamOvr = useMemo(() => {
    if (selectedPlayers.length === 0) return 0;
    const total = selectedPlayers.reduce((sum, p) => sum + (p.ovr ?? 75), 0);
    return Math.round(total / selectedPlayers.length);
  }, [selectedPlayers]);

  const filteredPlayers = useMemo(() => (posFiltro === 'TODOS' ? PLAYERS_DATA : PLAYERS_DATA.filter(p => p.pos === posFiltro)), [posFiltro]);

  const saveEscalacao = async () => {
    if (!userId || !jogoId) return { ok: false };
    const slots: Record<string, any> = {};
    Object.entries(slotMap).forEach(([id, s]) => { slots[id] = s.player ? { id: s.player.id, x: s.x, y: s.y } : null; });
    const eMandante = mandanteNome?.toLowerCase().includes('novorizontino');
    const payload = {
      usuario_id: userId, jogo_id: Number(jogoId), formacao: formation, lineup: slots,
      capitao_id: captainId, heroi_id: heroId,
      palpite_tigre: eMandante ? palpiteMandante : palpiteVisitante,
      palpite_adv: eMandante ? palpiteVisitante : palpiteMandante,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from(TABLE).upsert(payload, { onConflict: 'usuario_id,jogo_id' });
    if (!error) setHadSaved(true);
    return { ok: !error };
  };

  const captureCardAsPng = useCallback(async () => {
    if (!finalCardRef.current) return null;
    try {
      await waitForImages(finalCardRef.current);
      await new Promise(r => setTimeout(r, 150));
      return await htmlToImage.toPng(finalCardRef.current, { cacheBust: true, quality: 0.98, pixelRatio: 3, backgroundColor: '#0a0a0a' });
    } catch { return null; }
  }, []);

  const generateFinalImage = async () => {
    setStep('saving'); await saveEscalacao(); setStep('final'); setIsGenerating(true);
    await new Promise(r => setTimeout(r, 500));
    const uri = await captureCardAsPng();
    setIsGenerating(false); if (uri) setFinalImageUri(uri);
    confetti({ particleCount: 200, spread: 70 });
  };

  const shareWhatsApp = () => {
    const text = `🐯 ARENA TIGRE FC\nEscalei meu time pro jogo ${mandante} × ${visitanteNome}!\nOVR: ${teamOvr}\nPalpite: ${palpiteMandante} × ${palpiteVisitante}\n\nMonte o seu: ${SHARE_BASE_URL}/${jogoId}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (step === 'loading') return <div className="h-screen bg-black flex items-center justify-center text-yellow-400 font-black italic">CARREGANDO...</div>;

  return (
    <div className="fixed inset-0 bg-black text-white overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">
        {step === 'formation' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
            <h1 className="text-3xl font-black italic text-yellow-500 mb-10 uppercase">ESCOLHA A TÁTICA</h1>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {Object.keys(formationConfigs).map(f => (
                <button key={f} onClick={() => handleChangeFormation(f)} className={`py-8 border-2 rounded-3xl font-black text-2xl italic ${formation === f ? 'border-yellow-400 bg-yellow-500/10 text-yellow-400' : 'bg-zinc-900 border-white/10'}`}>{f}</button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <div className="flex-1 flex relative h-full">
            <div className="h-full w-[148px] sm:w-[190px] md:w-[300px] bg-black border-r border-white/10 flex flex-col">
              <div className="p-3 border-b border-white/10">
                <h3 className="text-yellow-400 font-black text-sm italic mb-2">MERCADO</h3>
                <div className="grid grid-cols-4 gap-1">
                  {POSICOES.map(p => <button key={p} onClick={() => setPosFiltro(p)} className={`text-[8px] font-black py-1 rounded ${posFiltro === p ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-zinc-500'}`}>{p === 'TODOS' ? 'ALL' : p}</button>)}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {filteredPlayers.map(p => <FutCard key={p.id} player={p} escalado={selectedPlayers.some(sp => sp.id === p.id)} pending={pendingPlayer?.id === p.id} onClick={() => handlePlayerSelection(p)} getValidPhotoUrl={getValidPhotoUrl} />)}
                </div>
              </div>
            </div>
            <div className="flex-1 relative bg-zinc-900" ref={arenaRef}>
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
              <div className="absolute inset-0">
                {Object.entries(slotMap).map(([id, s]) => <DraggableSlot key={id} slotId={id} state={s} arenaRef={arenaRef} isActive={activeSlot === id} hasPending={!!pendingPlayer} isDesktop={isDesktop} isCaptain={captainId === s.player?.id} isHero={heroId === s.player?.id} onDragSettled={handleSlotDragSettled} onClick={handleSlotClick} getValidPhotoUrl={getValidPhotoUrl} />)}
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                <button onClick={() => selectedPlayers.length === 11 ? setStep('captain') : alert('Escale 11 jogadores')} className={`flex-1 py-4 rounded-2xl font-black italic ${selectedPlayers.length === 11 ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-500'}`}>PRÓXIMO PASSO →</button>
              </div>
            </div>
          </div>
        )}

        {(step === 'captain' || step === 'hero') && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-black">
            <h2 className="text-2xl font-black text-yellow-400 mb-8 uppercase italic">{step === 'captain' ? 'ESCOLHA O CAPITÃO' : 'ESCOLHA O HERÓI'}</h2>
            <div className="grid grid-cols-3 gap-4 max-w-lg">
              {selectedPlayers.filter(p => step === 'hero' ? p.id !== captainId : true).map(p => (
                <button key={p.id} onClick={() => { if (step === 'captain') { setCaptainId(p.id); setStep('hero'); } else { setHeroId(p.id); setStep('palpite'); } }} className="flex flex-col items-center">
                  <img src={getValidPhotoUrl(p.foto)} className="w-20 h-24 object-cover rounded-lg border-2 border-white/20" alt="" />
                  <span className="text-[10px] font-bold mt-2 uppercase">{p.short}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'palpite' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
            <h1 className="text-4xl font-black italic mb-10 text-white uppercase">QUAL O PLACAR?</h1>
            <div className="flex items-center justify-between w-full max-w-md mb-12">
              <div className="flex flex-col items-center gap-4">
                <img src={ESCUDO_DEFAULT} className="w-24 h-24 object-contain" alt="" />
                <input type="number" value={palpiteMandante} onChange={e => setPalpiteMandante(Number(e.target.value))} className="w-20 bg-zinc-900 border-2 border-yellow-400 text-center text-4xl font-black py-4 rounded-2xl" />
              </div>
              <div className="text-4xl font-black text-zinc-700 italic">VS</div>
              <div className="flex flex-col items-center gap-4">
                <img src={visitanteLogo} className="w-24 h-24 object-contain" alt="" />
                <input type="number" value={palpiteVisitante} onChange={e => setPalpiteVisitante(Number(e.target.value))} className="w-20 bg-zinc-900 border-2 border-white/20 text-center text-4xl font-black py-4 rounded-2xl" />
              </div>
            </div>
            <button onClick={generateFinalImage} className="w-full max-w-md py-5 bg-yellow-400 text-black rounded-2xl text-lg font-black italic">FINALIZAR →</button>
          </div>
        )}

        {step === 'saving' && <div className="flex-1 flex items-center justify-center bg-black text-white font-black italic">SALVANDO...</div>}

        {step === 'final' && (
          <div className="flex-1 flex flex-col items-center p-6 bg-zinc-950 overflow-y-auto">
            <div className="w-full max-w-sm aspect-[1/1.4] bg-zinc-950 rounded-[40px] overflow-hidden border-4 border-yellow-400 relative p-6 flex flex-col" ref={finalCardRef}>
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-40" alt="" />
              <div className="relative z-10 flex justify-between items-center mb-6">
                <img src={ESCUDO_DEFAULT} className="w-12 h-12 object-contain" alt="" />
                <div className="text-5xl font-black italic">{palpiteMandante}<span className="text-yellow-400 mx-1">-</span>{palpiteVisitante}</div>
                <img src={visitanteLogo} className="w-12 h-12 object-contain" alt="" />
              </div>
              <div className="relative z-10 flex-1 flex flex-col gap-1 overflow-hidden">
                <div className="flex justify-between px-2 py-1 bg-white/5 rounded text-[10px] font-black text-yellow-400 italic mb-2"><span>RODADA {rodada}</span><span>OVR {teamOvr}</span></div>
                {Object.entries(slotMap).filter(([_, s]) => s.player).map(([id, s]) => (
                  <div key={id} className="flex justify-between items-center px-2 py-0.5 border-b border-white/5">
                    <div className="flex items-center gap-2"><span className="text-[9px] font-black text-zinc-600 w-6">{id}</span><span className="text-[11px] font-black text-white italic">{s.player?.short}</span></div>
                    <div className="flex items-center gap-1.5">{s.player?.id === captainId && <span className="text-[8px] bg-yellow-400 text-black font-black px-1 rounded">C</span>}{s.player?.id === heroId && <span className="text-[8px] bg-cyan-400 text-black font-black px-1 rounded">H</span>}<span className="text-[10px] font-black text-zinc-500">{s.player?.ovr}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full max-w-sm mt-6 flex flex-col gap-3">
              <button onClick={shareWhatsApp} className="py-4 bg-[#25D366] text-white rounded-2xl font-black italic">WHATSAPP</button>
              <button onClick={() => setStep('arena')} className="py-4 text-zinc-500 font-black text-xs tracking-widest uppercase">← EDITAR</button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
