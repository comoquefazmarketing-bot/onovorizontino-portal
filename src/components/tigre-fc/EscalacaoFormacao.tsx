'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  { id: 23, name: 'Jordi Martins',     short: 'JORDI',      num: 93, pos: 'GOL', foto: 'JORDI.jpg.webp' },
  { id: 1,  name: 'César',             short: 'CÉSAR',      num: 31, pos: 'GOL', foto: 'CESAR-AUGUSTO.jpg.webp' },
  { id: 22, name: 'João Scapin',       short: 'SCAPIN',     num: 12, pos: 'GOL', foto: 'JOAO-SCAPIN.jpg.webp' },
  { id: 62, name: 'Lucas Ribeiro',     short: 'LUCAS',      num: 1,  pos: 'GOL', foto: 'LUCAS-RIBEIRO.jpg.webp' },
  { id: 8,  name: 'Patrick',           short: 'PATRICK',    num: 4,  pos: 'ZAG', foto: 'PATRICK.jpg.webp' },
  { id: 38, name: 'Renato Palm',       short: 'R. PALM',    num: 33, pos: 'ZAG', foto: 'RENATO-PALM.jpg.webp' },
  { id: 34, name: 'Eduardo Brock',     short: 'BROCK',      num: 14, pos: 'ZAG', foto: 'EDUARDO-BROCK.jpg.webp' },
  { id: 66, name: 'Alexis Alvariño',   short: 'ALVARÍÑO',   num: 22, pos: 'ZAG', foto: 'IVAN-ALVARINO.jpg.webp' },
  { id: 6,  name: 'Carlinhos',         short: 'CARLINHOS',  num: 3,  pos: 'ZAG', foto: 'CARLINHOS.jpg.webp' },
  { id: 3,  name: 'Dantas',            short: 'DANTAS',     num: 25, pos: 'ZAG', foto: 'DANTAS.jpg.webp' },
  { id: 9,  name: 'Sander',            short: 'SANDER',     num: 5,  pos: 'LAT', foto: 'SANDER (1).jpg' },
  { id: 28, name: 'Maykon Jesus',      short: 'MAYKON',     num: 66, pos: 'LAT', foto: 'MAYKON-JESUS.jpg.webp' },
  { id: 27, name: 'Nilson Castrillón', short: 'NILSON',     num: 20, pos: 'LAT', foto: 'NILSON-CASTRILLON.jpg.webp' },
  { id: 75, name: 'Jhilmar Lora',      short: 'LORA',       num: 24, pos: 'LAT', foto: 'LORA.jpg.webp' },
  { id: 41, name: 'Luís Oyama',        short: 'OYAMA',      num: 6,  pos: 'VOL', foto: 'LUIS-OYAMA.jpg.webp' },
  { id: 46, name: 'Marlon',            short: 'MARLON',     num: 28, pos: 'VOL', foto: 'MARLON.jpg.webp' },
  { id: 40, name: 'Léo Naldi',         short: 'NALDI',      num: 18, pos: 'VOL', foto: 'LEO-NALDI.jpg.webp' },
  { id: 47, name: 'Matheus Bianqui',   short: 'BIANQUI',    num: 17, pos: 'MEI', foto: 'MATHEUS-BIANQUI.jpg.webp' },
  { id: 10, name: 'Rômulo',            short: 'RÔMULO',     num: 10, pos: 'MEI', foto: 'ROMULO.jpg.webp' },
  { id: 12, name: 'Juninho',           short: 'JUNINHO',    num: 50, pos: 'MEI', foto: 'JUNINHO.jpg.webp' },
  { id: 17, name: 'Tavinho',           short: 'TAVINHO',    num: 15, pos: 'MEI', foto: 'TAVINHO.jpg.webp' },
  { id: 86, name: 'Christian Ortíz',   short: 'TITI ORTÍZ', num: 8,  pos: 'MEI', foto: 'TITI-ORTIZ.jpg.webp' },
  { id: 13, name: 'Diego Galo',        short: 'D. GALO',    num: 19, pos: 'MEI', foto: 'DIEGO-GALO.jpg.webp' },
  { id: 15, name: 'Robson',            short: 'ROBSON',     num: 11, pos: 'ATA', foto: 'ROBSON.jpg.webp' },
  { id: 59, name: 'Vinícius Paiva',    short: 'V. PAIVA',   num: 16, pos: 'ATA', foto: 'VINICIUS-PAIVA.jpg.webp' },
  { id: 57, name: 'Ronald Barcellos',  short: 'RONALD',     num: 7,  pos: 'ATA', foto: 'RONALD-BARCELLOS.jpg.webp' },
  { id: 55, name: 'Nicolas Careca',    short: 'CARECA',     num: 30, pos: 'ATA', foto: 'NICOLAS-CARECA.jpg.webp' },
  { id: 50, name: 'Carlão',            short: 'CARLÃO',     num: 9,  pos: 'ATA', foto: 'CARLAO.jpg.webp' },
  { id: 52, name: 'Hélio Borges',      short: 'HÉLIO',      num: 41, pos: 'ATA', foto: 'HELIO-BORGES.jpg.webp' },
  { id: 53, name: 'Jardiel',           short: 'JARDIEL',    num: 40, pos: 'ATA', foto: 'JARDIEL.jpg.webp' },
  { id: 91, name: 'Hector Bianchi',    short: 'HECTOR',     num: 35, pos: 'ATA', foto: 'HECTOR-BIANCHI.jpg.webp' },
];

const formationConfigs: Record<string, Record<string, SlotCoord>> = {
  '4-3-3':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:50,y:48}, m2:{x:30,y:42}, m3:{x:70,y:42}, st:{x:50,y:15}, lw:{x:22,y:22}, rw:{x:78,y:22} },
  '4-4-2':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:35,y:45}, m2:{x:65,y:45}, m3:{x:15,y:38}, m4:{x:85,y:38}, st1:{x:40,y:18}, st2:{x:60,y:18} },
  '3-5-2':   { gk:{x:50,y:85}, cb1:{x:30,y:70}, cb2:{x:50,y:73}, cb3:{x:70,y:70}, lm:{x:15,y:45}, rm:{x:85,y:45}, m1:{x:35,y:50}, m2:{x:65,y:50}, am:{x:50,y:32}, st1:{x:40,y:15}, st2:{x:60,y:15} },
  '4-5-1':   { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, m1:{x:30,y:48}, m2:{x:50,y:48}, m3:{x:70,y:48}, am1:{x:35,y:30}, am2:{x:65,y:30}, st:{x:50,y:15} },
  '4-2-3-1': { gk:{x:50,y:85}, lb:{x:15,y:62}, cb1:{x:38,y:70}, cb2:{x:62,y:70}, rb:{x:85,y:62}, v1:{x:40,y:52}, v2:{x:60,y:52}, am:{x:50,y:35}, lw:{x:20,y:28}, rw:{x:80,y:28}, st:{x:50,y:12} },
  '5-3-2':   { gk:{x:50,y:85}, lb:{x:12,y:52}, cb1:{x:30,y:70}, cb2:{x:50,y:73}, cb3:{x:70,y:70}, rb:{x:88,y:52}, m1:{x:50,y:48}, m2:{x:30,y:40}, m3:{x:70,y:40}, st1:{x:42,y:18}, st2:{x:58,y:18} },
};

const SLOT_W_MOBILE = 56;
const SLOT_H_MOBILE = 80;
const SLOT_W_DESKTOP = 76;
const SLOT_H_DESKTOP = 112;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// =============================================================================
// SUB-COMPONENTE: DraggableSlot
// Cada slot tem seus próprios motion values pra suportar drag livre
// =============================================================================

interface DraggableSlotProps {
  slotId: string;
  state: { player: Player | null; x: number; y: number };
  arenaRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  hasPending: boolean;
  isDesktop: boolean;
  onDragSettled: (slotId: string, newX: number, newY: number) => void;
  onClick: (slotId: string) => void;
  getValidPhotoUrl: (foto: string) => string;
}

function DraggableSlot({
  slotId, state, arenaRef, isActive, hasPending, isDesktop, onDragSettled, onClick, getValidPhotoUrl,
}: DraggableSlotProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const draggedRef = useRef(false);

  const w = isDesktop ? SLOT_W_DESKTOP : SLOT_W_MOBILE;
  const h = isDesktop ? SLOT_H_DESKTOP : SLOT_H_MOBILE;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.05}
      dragConstraints={arenaRef}
      whileDrag={{ scale: 1.25, zIndex: 200 }}
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
        // Posição absoluta do centro do slot na arena → percentual
        const newX = ((info.point.x - rect.left) / rect.width) * 100;
        const newY = ((info.point.y - rect.top) / rect.height) * 100;
        // Margem mínima pra não sair da arena
        const xPct = clamp(newX, 5, 95);
        const yPct = clamp(newY, 5, 95);
        // Reseta motion values e atualiza o estado externo
        x.set(0);
        y.set(0);
        onDragSettled(slotId, xPct, yPct);
      }}
      onClick={() => {
        // Se moveu durante o drag, ignora o click
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
      }}
      className={`border-2 rounded-2xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing transition-colors shadow-2xl ${
        isActive
          ? 'border-yellow-400 bg-yellow-500/20 shadow-[0_0_30px_#facc15]'
          : hasPending
            ? 'border-cyan-400/60 bg-cyan-500/10'
            : 'border-white/30 bg-black/70'
      }`}
    >
      {state.player ? (
        <div className="relative w-full h-full pointer-events-none">
          <img
            src={getValidPhotoUrl(state.player.foto)}
            alt={state.player.short}
            className="w-full h-full object-cover"
            draggable={false}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }}
          />
          <div className="absolute top-0.5 left-0.5 bg-yellow-400 text-black text-[8px] font-black px-1 rounded">
            {state.player.num}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black py-1">
            <span className="text-[9px] font-black text-white block text-center leading-tight">
              {state.player.short}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center opacity-40 pointer-events-none">
          <span className="text-2xl">+</span>
          <div className="text-[9px] uppercase mt-0.5">{slotId}</div>
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

  const finalCardRef = useRef<HTMLDivElement>(null);
  const arenaRef     = useRef<HTMLDivElement>(null);

  const getValidPhotoUrl = useCallback((fotoPath: string) => {
    if (!fotoPath) return ESCUDO_DEFAULT;
    const filename = fotoPath.split('/').pop() || fotoPath;
    return `${BASE_STORAGE}${encodeURIComponent(filename)}`;
  }, []);

  // Detecta breakpoint
  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // ---------------------- LOAD INICIAL ----------------------
  useEffect(() => {
    let cancelled = false;

    const buildEmptySlots = (formacao: string): SlotMap => {
      const coords = formationConfigs[formacao] ?? formationConfigs['4-3-3'];
      const initial: SlotMap = {};
      Object.entries(coords).forEach(([id, c]) => {
        initial[id] = { player: null, x: c.x, y: c.y };
      });
      return initial;
    };

    const loadExisting = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!cancelled && user) {
          setUserId(user.id);

          // Tenta buscar o profile na tigre_fc_usuarios
          let profile: { apelido?: string | null; nome?: string | null; avatar_url?: string | null } | null = null;

          const { data: byId } = await supabase
            .from(PROFILE_TABLE)
            .select('apelido, nome, avatar_url')
            .eq('id', user.id)
            .maybeSingle();

          if (byId) {
            profile = byId;
          } else if (user.email) {
            const { data: byEmail } = await supabase
              .from(PROFILE_TABLE)
              .select('apelido, nome, avatar_url')
              .eq('email', user.email)
              .maybeSingle();
            if (byEmail) profile = byEmail;
          }

          if (!cancelled) {
            const meta = (user.user_metadata || {}) as Record<string, unknown>;
            const fallbackName =
              (meta.nome as string) ||
              (meta.name as string) ||
              (meta.full_name as string) ||
              user.email?.split('@')[0] ||
              'TORCEDOR';

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
          .eq('user_id', user.id)
          .eq('jogo_id', Number(jogoId))
          .maybeSingle();

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
    Object.entries(coords).forEach(([id, c]) => {
      novo[id] = { player: null, x: c.x, y: c.y };
    });
    const queue = [...playersAtuais];
    Object.keys(novo).forEach(slotId => {
      if (queue.length > 0) novo[slotId].player = queue.shift()!;
    });
    setFormation(novaFormacao);
    setSlotMap(novo);
    setStep('arena');
  };

  // ---------------------- HANDLERS ----------------------
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

  const handleSelectCaptain = (id: number) => { setCaptainId(id); setStep('hero');    };
  const handleSelectHero    = (id: number) => { setHeroId(id);    setStep('palpite'); };

  const triggerCelebration = () => {
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    confetti({ particleCount: 180, angle: 60,  spread: 80, origin: { x: 0.1 } });
    confetti({ particleCount: 180, angle: 120, spread: 80, origin: { x: 0.9 } });
  };

  // ---------------------- SAVE NO SUPABASE ----------------------
  const saveEscalacao = async (): Promise<{ ok: boolean; reason?: string }> => {
    if (!userId)  return { ok: false, reason: 'sem-login' };
    if (!jogoId)  return { ok: false, reason: 'sem-jogo'  };

    // Salva como objeto { id, x, y } pra preservar a posição customizada do drag
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

    const { error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'user_id,jogo_id' });

    if (error) {
      console.error('[saveEscalacao] erro:', error);
      return { ok: false, reason: error.message };
    }
    setHadSaved(true);
    return { ok: true };
  };

  // ---------------------- GERAR IMAGEM ----------------------
  const generateFinalImage = async () => {
    setStep('saving');

    const saveRes = await saveEscalacao();
    if (!saveRes.ok && saveRes.reason === 'sem-login') {
      alert('Você precisa estar logado pra salvar sua escalação no ranking. Mas vou gerar a arte do mesmo jeito!');
    } else if (!saveRes.ok) {
      console.warn('Erro salvando, continuando mesmo assim:', saveRes.reason);
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
        cacheBust:       true,
        quality:         0.98,
        pixelRatio:      3,
        backgroundColor: '#0a0a0a',
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

  // ---------------------- COMPARTILHAMENTO ----------------------
  const buildShareText = () => {
    const cap  = selectedPlayers.find(p => p.id === captainId)?.short ?? '—';
    const hero = selectedPlayers.find(p => p.id === heroId)?.short    ?? '—';
    return (
`🐯 ARENA TIGRE FC

Acabei de escalar meu Tigrão pro ${mandante} × Novorizontino!
🛡️ Formação: ${formation}
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
        await (navigator as any).share({
          files: [file],
          title: 'Minha escalação - Arena Tigre FC',
          text,
        });
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
    const text = `🐯 Minha escalação pro ${mandante} × Novorizontino (${formation}) — Palpite ${palpiteMandante}×${palpiteVisitante} 🔥\nDuvido você fazer melhor! ${SHARE_BASE_URL}/${jogoId ?? ''}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const finalizarEVoltar = () => router.push('/tigre-fc');

  // ---------------------- RENDER ----------------------
  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">

        {/* TELA DE LOADING */}
        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20">
              <img src={STADIUM_BG} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl mb-6"
              >
                🐯
              </motion.div>
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ARENA TIGRE FC</div>
              <div className="text-white text-2xl font-black italic mb-8">ENTRANDO NO VESTIÁRIO...</div>
              <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-1/2"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* TELA DE FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div
            key="formation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 relative overflow-auto"
          >
            <div className="absolute inset-0 opacity-10">
              <img src={STADIUM_BG} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ETAPA 1 DE 5</div>
              <h1 className="text-4xl font-black italic mb-2 text-yellow-500 uppercase tracking-tighter text-center">
                ESCOLHA A TÁTICA
              </h1>
              <p className="text-zinc-500 text-sm mb-10 text-center">Como o Tigrão vai entrar em campo?</p>
              <div className="grid grid-cols-2 gap-4 w-full">
                {Object.keys(formationConfigs).map(f => (
                  <motion.button
                    key={f}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChangeFormation(f)}
                    className={`py-8 border-2 rounded-3xl active:scale-95 transition-all font-black text-2xl italic ${
                      formation === f
                        ? 'border-yellow-400 bg-yellow-500/10 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                        : 'bg-zinc-900 border-white/10 hover:border-yellow-500/50 hover:bg-zinc-800'
                    }`}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TELA ARENA — Mercado fixo à esquerda + Campo */}
        {step === 'arena' && (
          <motion.div
            key="arena"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex relative overflow-hidden h-full"
          >
            {/* MERCADO — sempre à esquerda em pé, grid 3 colunas */}
            <div className="h-full w-[150px] sm:w-[180px] md:w-[280px] flex-shrink-0 z-[110] bg-black/85 backdrop-blur-xl border-r border-white/10 overflow-y-auto p-2 md:p-3">
              <div className="flex items-center justify-between mb-2 sticky top-0 bg-black/90 backdrop-blur-md z-10 py-1.5 -mx-2 md:-mx-3 px-2 md:px-3 border-b border-white/10">
                <h3 className="text-yellow-400 font-black text-[11px] md:text-sm tracking-wider">ELENCO</h3>
                <div className="text-[10px] md:text-xs text-zinc-400">
                  <span className="text-yellow-400 font-bold">{selectedPlayers.length}</span>/11
                </div>
              </div>

              {hadSaved && (
                <div className="mb-2 px-2 py-1.5 bg-cyan-500/10 border border-cyan-400/40 rounded-lg text-[8px] md:text-[10px] text-cyan-300 font-bold tracking-wide">
                  ✓ ESCALAÇÃO RECUPERADA
                </div>
              )}

              <div className="grid grid-cols-3 gap-1 md:gap-1.5">
                {PLAYERS_DATA.map(player => {
                  const escalado = playerEscalado(player.id);
                  return (
                    <motion.button
                      key={player.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handlePlayerSelection(player)}
                      className={`relative bg-zinc-900 border rounded-md md:rounded-lg p-0.5 md:p-1 transition-all ${
                        escalado
                          ? 'border-yellow-400 ring-1 ring-yellow-400/40'
                          : pendingPlayer?.id === player.id
                            ? 'border-cyan-400 ring-1 ring-cyan-400/40'
                            : 'border-white/15 hover:border-yellow-500'
                      }`}
                    >
                      <img
                        src={getValidPhotoUrl(player.foto)}
                        alt={player.short}
                        className={`w-full aspect-square object-cover rounded ${escalado ? 'opacity-50' : ''}`}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }}
                      />
                      {escalado && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                          <span className="text-yellow-400 text-lg md:text-xl font-black drop-shadow-lg">✓</span>
                        </div>
                      )}
                      <div className="absolute top-0.5 left-0.5 bg-black/70 text-yellow-400 text-[7px] md:text-[8px] font-black px-0.5 md:px-1 rounded">
                        {player.pos}
                      </div>
                      <p className="text-[8px] md:text-[10px] text-center mt-0.5 font-bold text-white truncate leading-tight">
                        {player.short}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* CAMPO */}
            <div className="flex-1 relative bg-zinc-900 overflow-hidden" ref={arenaRef}>
              <img src={STADIUM_BG} alt="Estádio" className="absolute inset-0 w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

              {/* Header */}
              <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between gap-2">
                <div className="px-2.5 py-1 bg-black/70 backdrop-blur rounded-full border border-yellow-400/30">
                  <span className="text-yellow-400 text-[9px] md:text-[10px] font-black tracking-widest">
                    FORMAÇÃO {formation}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setStep('formation')}
                    className="px-2.5 py-1 bg-black/70 backdrop-blur rounded-full border border-white/20 text-[9px] md:text-[10px] font-black tracking-wider text-white hover:border-yellow-400/50"
                  >
                    TROCAR
                  </button>
                  <div className="hidden sm:block px-2.5 py-1 bg-cyan-500/10 backdrop-blur rounded-full border border-cyan-400/30">
                    <span className="text-cyan-300 text-[9px] md:text-[10px] font-black tracking-wider">
                      ✋ ARRASTE OS JOGADORES
                    </span>
                  </div>
                </div>
              </div>

              {/* Slots — drag livre */}
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
                    onDragSettled={handleSlotDragSettled}
                    onClick={handleSlotClick}
                    getValidPhotoUrl={getValidPhotoUrl}
                  />
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-50 px-3">
                <button
                  onClick={finalizarEVoltar}
                  className="px-4 py-3 bg-zinc-900/90 border border-white/20 rounded-2xl text-[10px] md:text-xs font-black tracking-wider"
                >
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
                  className={`flex-1 max-w-[260px] py-3 rounded-2xl text-[11px] md:text-sm font-black tracking-wider transition-all ${
                    selectedPlayers.length >= 11
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-[0_0_30px_rgba(250,204,21,0.5)] active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}
                >
                  ESCOLHER CAPITÃO →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TELA CAPITÃO */}
        {step === 'captain' && (
          <motion.div
            key="captain"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black overflow-auto"
          >
            <div className="text-center mb-8">
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ETAPA 3 DE 5</div>
              <div className="inline-block px-8 py-2 bg-yellow-500/10 border border-yellow-400 rounded-full text-yellow-400 text-sm font-black tracking-widest mb-4">
                CAPITÃO 👑
              </div>
              <h1 className="text-4xl font-black italic text-yellow-400 tracking-tighter">
                ESCOLHA O LÍDER DO TIGRE
              </h1>
              <p className="text-zinc-500 text-sm mt-2">Pontua em dobro se for o melhor em campo</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-3xl">
              {selectedPlayers.map(p => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectCaptain(p.id)}
                  className={`relative p-3 rounded-3xl border-4 transition-all overflow-hidden ${
                    captainId === p.id
                      ? 'border-yellow-400 shadow-[0_0_50px_#facc15] scale-110'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <img src={getValidPhotoUrl(p.foto)} alt={p.short} className="w-full aspect-[3/4] object-cover rounded-2xl" />
                  {captainId === p.id && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-2xl shadow-[0_0_25px_#facc15]">
                      C
                    </div>
                  )}
                  <p className="text-center mt-3 font-bold text-sm tracking-wide">{p.short}</p>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setStep('arena')}
              className="mt-8 text-zinc-500 hover:text-white text-xs font-black tracking-widest"
            >
              ← VOLTAR PARA O CAMPO
            </button>
          </motion.div>
        )}

        {/* TELA HERÓI */}
        {step === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black overflow-auto"
          >
            <div className="text-center mb-8">
              <div className="text-cyan-400 text-xs font-black tracking-[6px] mb-2">ETAPA 4 DE 5</div>
              <div className="inline-block px-8 py-2 bg-cyan-400/10 border border-cyan-400 rounded-full text-cyan-400 text-sm font-black tracking-widest mb-4">
                HERÓI DA PARTIDA 🔥
              </div>
              <h1 className="text-4xl font-black italic text-cyan-400 tracking-tighter">
                QUEM VAI DECIDIR O JOGO?
              </h1>
              <p className="text-zinc-500 text-sm mt-2">Bônus extra se ele for o decisivo</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-w-3xl">
              {selectedPlayers.filter(p => p.id !== captainId).map(p => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectHero(p.id)}
                  className={`relative p-3 rounded-3xl border-4 transition-all overflow-hidden ${
                    heroId === p.id
                      ? 'border-cyan-400 shadow-[0_0_50px_#22d3ee] scale-110'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <img src={getValidPhotoUrl(p.foto)} alt={p.short} className="w-full aspect-[3/4] object-cover rounded-2xl" />
                  {heroId === p.id && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center font-black text-black text-2xl shadow-[0_0_25px_#22d3ee]">
                      H
                    </div>
                  )}
                  <p className="text-center mt-3 font-bold text-sm tracking-wide">{p.short}</p>
                </motion.button>
              ))}
            </div>
            <button
              onClick={() => setStep('captain')}
              className="mt-8 text-zinc-500 hover:text-white text-xs font-black tracking-widest"
            >
              ← TROCAR CAPITÃO
            </button>
          </motion.div>
        )}

        {/* TELA PALPITE */}
        {step === 'palpite' && (
          <motion.div
            key="palpite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 overflow-auto"
          >
            <div className="text-cyan-400 text-xs font-black tracking-[6px] mb-2">ETAPA 5 DE 5</div>
            <h1 className="text-4xl font-black mb-3">SEU PALPITE</h1>
            <p className="text-zinc-400 mb-12 text-sm">{mandante} × Novorizontino • Série B 2026</p>

            <div className="flex items-center gap-6 sm:gap-10 flex-wrap justify-center">
              <div className="flex flex-col items-center">
                <img src={mandanteLogo} alt={mandante} className="w-20 h-20 sm:w-24 sm:h-24 mb-3 object-contain" />
                <div className="text-lg sm:text-2xl font-black">{mandante}</div>
              </div>
              <div className="flex gap-4 sm:gap-6 items-center">
                <input
                  type="number"
                  min={0}
                  value={palpiteMandante}
                  onChange={e => setPalpiteMandante(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 sm:w-24 bg-zinc-900 text-center rounded-2xl border-2 border-yellow-500 focus:border-yellow-400 text-5xl sm:text-6xl font-black outline-none py-3"
                />
                <span className="text-4xl sm:text-6xl text-yellow-400 font-black">×</span>
                <input
                  type="number"
                  min={0}
                  value={palpiteVisitante}
                  onChange={e => setPalpiteVisitante(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-20 sm:w-24 bg-zinc-900 text-center rounded-2xl border-2 border-yellow-500 focus:border-yellow-400 text-5xl sm:text-6xl font-black outline-none py-3"
                />
              </div>
              <div className="flex flex-col items-center">
                <img src={ESCUDO_DEFAULT} alt="Novorizontino" className="w-20 h-20 sm:w-24 sm:h-24 mb-3 object-contain" />
                <div className="text-lg sm:text-2xl font-black">Novorizontino</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateFinalImage}
              disabled={isGenerating}
              className="mt-12 px-12 sm:px-20 py-6 sm:py-7 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black font-black text-lg sm:text-2xl rounded-3xl shadow-[0_0_50px_#fbbf24] disabled:opacity-60 tracking-wider"
            >
              {isGenerating ? 'GERANDO ARTE ÉPICA...' : 'CONFIRMAR ESCALAÇÃO 🔥'}
            </motion.button>

            <button
              onClick={() => setStep('hero')}
              className="mt-6 text-zinc-500 hover:text-white text-xs font-black tracking-widest"
            >
              ← TROCAR HERÓI
            </button>
          </motion.div>
        )}

        {/* TELA SAVING */}
        {step === 'saving' && (
          <motion.div
            key="saving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20">
              <img src={STADIUM_BG} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full mb-6"
              />
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ARENA TIGRE FC</div>
              <div className="text-white text-2xl font-black italic">SALVANDO SUA ESCALAÇÃO...</div>
              <div className="text-zinc-500 text-sm mt-3">Computando no ranking 🏆</div>
            </div>
          </motion.div>
        )}

        {/* TELA FINAL */}
        {step === 'final' && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start p-4 bg-black overflow-auto"
          >
            <div className="text-yellow-400 text-xs font-black tracking-[6px] mt-2 mb-3">
              ✓ ESCALAÇÃO SALVA NO RANKING
            </div>

            {/* CARD 9:16 */}
            <div
              ref={finalCardRef}
              className="relative w-full max-w-[380px] bg-zinc-950 rounded-3xl overflow-hidden border-4 border-yellow-400/40 shadow-[0_0_60px_rgba(250,204,21,0.3)]"
              style={{ aspectRatio: '9/16' }}
            >
              <img src={STADIUM_BG} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'repeating-linear-gradient(45deg, #facc15 0, #facc15 1px, transparent 1px, transparent 12px)',
                }}
              />

              {/* HEADER */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                <div className="flex items-start gap-2">
                  {userAvatar && (
                    <img
                      src={userAvatar}
                      alt={userName}
                      crossOrigin="anonymous"
                      className="w-10 h-10 rounded-full border-2 border-yellow-400 object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  )}
                  <div>
                    <div className="text-yellow-400 tracking-[3px] font-black text-[10px]">ARENA TIGRE FC</div>
                    <div className="text-2xl font-black italic leading-tight">MINHA ESCALAÇÃO</div>
                    <div className="text-cyan-400 font-black text-xs mt-0.5">@{userName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-yellow-400 text-black px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider">
                    {formation}
                  </div>
                  {rodada !== undefined && (
                    <div className="text-[10px] text-zinc-400 mt-1 tracking-widest">RODADA {rodada}</div>
                  )}
                  <div className="text-[10px] text-zinc-500 mt-0.5">
                    {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>

              {/* PLACAR */}
              <div className="absolute top-[120px] left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur px-6 py-2.5 rounded-2xl border border-yellow-400/40 text-center z-10">
                <div className="flex items-center gap-3">
                  <img src={mandanteLogo} alt="" className="w-7 h-7 object-contain" />
                  <div className="text-3xl font-black text-yellow-400 tabular-nums">
                    {palpiteMandante}<span className="text-zinc-600 mx-1.5">×</span>{palpiteVisitante}
                  </div>
                  <img src={ESCUDO_DEFAULT} alt="" className="w-7 h-7 object-contain" />
                </div>
                <div className="text-[9px] text-zinc-400 tracking-widest mt-0.5">SEU PALPITE</div>
              </div>

              {/* JOGADORES — usa as posições customizadas do drag */}
              <div className="absolute inset-0 pointer-events-none">
                {Object.entries(slotMap).map(([id, state]) => state.player && (
                  <div
                    key={id}
                    style={{
                      left: `${state.x}%`,
                      top: `${state.y * 0.78 + 10}%`,
                      position: 'absolute',
                      transform: 'translate(-50%, -50%)',
                    }}
                    className="w-12 h-16 rounded-xl overflow-hidden border-2 border-white/70 shadow-[0_4px_15px_rgba(0,0,0,0.6)]"
                  >
                    <img
                      src={getValidPhotoUrl(state.player.foto)}
                      alt={state.player.short}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 py-0.5">
                      <span className="text-[7px] font-black text-white block text-center leading-none">
                        {state.player.short}
                      </span>
                    </div>
                    {(state.player.id === captainId || state.player.id === heroId) && (
                      <div
                        className={`absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-xl ${
                          state.player.id === captainId ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'
                        }`}
                      >
                        {state.player.id === captainId ? 'C' : 'H'}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="absolute bottom-[88px] left-4 right-4 text-center z-10">
                <div className="text-3xl font-black italic text-white leading-[0.95] drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)]">
                  DUVIDO VOCÊ<br />
                  <span className="text-yellow-400">ESCALAR MELHOR!</span>
                </div>
                <div className="text-3xl mt-2">🐯⚡</div>
              </div>

              {/* FOOTER */}
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <div className="flex items-center justify-between text-[9px] text-zinc-400 mb-1.5">
                  <span>👑 {selectedPlayers.find(p => p.id === captainId)?.short ?? '—'}</span>
                  <span>🔥 {selectedPlayers.find(p => p.id === heroId)?.short ?? '—'}</span>
                </div>
                <div className="bg-yellow-400 text-black text-center text-[9px] font-black tracking-[2px] py-1.5 rounded-md">
                  MONTE A SUA: ONOVORIZONTINO.COM.BR/TIGRE-FC
                </div>
              </div>
            </div>

            {/* AÇÕES */}
            <div className="mt-6 w-full max-w-[380px] space-y-3 px-2">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={shareNative}
                disabled={!finalImageUri}
                className="w-full py-5 bg-gradient-to-r from-yellow-400 to-amber-400 text-black font-black rounded-2xl text-base tracking-wider shadow-[0_0_30px_rgba(250,204,21,0.4)] disabled:opacity-50"
              >
                📤 COMPARTILHAR
              </motion.button>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={shareWhatsApp}
                  disabled={!finalImageUri}
                  className="py-4 bg-[#25D366] font-black rounded-2xl active:scale-95 text-xs tracking-wide disabled:opacity-50"
                >
                  WhatsApp
                </button>
                <button
                  onClick={shareInstagram}
                  disabled={!finalImageUri}
                  className="py-4 bg-gradient-to-br from-purple-600 via-pink-500 to-amber-400 font-black rounded-2xl active:scale-95 text-xs tracking-wide disabled:opacity-50"
                >
                  Instagram
                </button>
                <button
                  onClick={shareX}
                  className="py-4 bg-black border border-white/30 font-black rounded-2xl active:scale-95 text-xs tracking-wide"
                >
                  𝕏
                </button>
              </div>

              <button
                onClick={downloadImage}
                disabled={!finalImageUri}
                className="w-full py-3 bg-zinc-900 border border-white/15 font-black rounded-2xl text-xs tracking-wider disabled:opacity-50"
              >
                💾 SALVAR IMAGEM
              </button>

              <button
                onClick={finalizarEVoltar}
                className="w-full py-4 bg-zinc-950 border-2 border-yellow-400/30 font-black rounded-2xl text-sm tracking-wider mt-2 hover:border-yellow-400/60 transition-all"
              >
                ← VOLTAR PARA A ARENA
              </button>

              <button
                onClick={() => setStep('arena')}
                className="w-full py-2 text-zinc-500 hover:text-white text-[11px] font-black tracking-widest"
              >
                EDITAR ESCALAÇÃO
              </button>
            </div>

            <div className="h-8" />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Atalho fixo: ver arte final quando já tem escalação salva */}
      {hadSaved && step === 'arena' && (
        <motion.button
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={verEscalacaoSalva}
          className="fixed top-3 right-3 z-[200] bg-cyan-400 text-black px-3 py-2 rounded-full font-black text-[10px] tracking-widest shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95"
        >
          📸 VER ARTE
        </motion.button>
      )}
    </div>
  );
}
