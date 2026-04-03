'use client';

import React, { useState, useMemo, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import CampoFifa, { POS_CORES, POS_GLOW } from '@/components/tigre-fc/CampoFifa';
import CapitaoEHeroi from '@/components/tigre-fc/CapitaoEHeroi';
import Palpite from '@/components/tigre-fc/Palpite';
import TigreFCShare from '@/components/tigre-fc/TigreFCShare';
import { useEscalacao, Player } from '@/hooks/useEscalacao';

const BASE      = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const PLAYERS: Player[] = [
  { id: 1,  name: 'César Augusto',    short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',            short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',      short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',    short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',             short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',       short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',   short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',           short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',     short: 'Maykon',     num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',           short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',    short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',          short: 'Patrick',    num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',    short: 'G.Bahia',    num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',        short: 'Carlinhos',  num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',           short: 'Alemão',     num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',      short: 'R.Palm',     num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',         short: 'Alvariño',   num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',    short: 'B.Santana',  num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',       short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',        short: 'L.Naldi',    num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',           short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',    num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',          short: 'Juninho',    num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',          short: 'Tavinho',    num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',       short: 'D.Galo',     num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',           short: 'Marlon',     num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',   short: 'Hector',     num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',         short: 'Nogueira',   num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',     short: 'L.Gabriel',  num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',      short: 'J.Kauê',     num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',           short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',   short: 'V.Paiva',    num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',     short: 'H.Borges',   num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',          short: 'Jardiel',    num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',   short: 'N.Careca',   num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',       short: 'T.Ortiz',    num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',    short: 'D.Mathias',  num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',           short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',     num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, { id: string; x: number; y: number; pos: string }[]> = {
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'rb',  x: 82, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb',  x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 57, pos: 'MEI' }, { id: 'dm2', x: 65, y: 57, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' }, { id: 'rw',  x: 80, y: 28, pos: 'ATA' }, { id: 'lw',  x: 20, y: 28, pos: 'ATA' },
    { id: 'st',  x: 50, y: 13, pos: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk',  x: 50, y: 85, pos: 'GOL' },
    { id: 'rb',  x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb',  x: 18, y: 65, pos: 'LAT' },
    { id: 'm1',  x: 50, y: 50, pos: 'MEI' }, { id: 'm2',  x: 75, y: 42, pos: 'MEI' }, { id: 'm3',  x: 25, y: 42, pos: 'MEI' },
    { id: 'st',  x: 50, y: 13, pos: 'ATA' }, { id: 'rw',  x: 80, y: 20, pos: 'ATA' }, { id: 'lw',  x: 20, y: 20, pos: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'rb',  x: 85, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb',  x: 15, y: 68, pos: 'LAT' },
    { id: 'm1',  x: 20, y: 48, pos: 'MEI' }, { id: 'm2',  x: 40, y: 48, pos: 'MEI' }, { id: 'm3',  x: 60, y: 48, pos: 'MEI' }, { id: 'm4',  x: 80, y: 48, pos: 'MEI' },
    { id: 'st1', x: 35, y: 18, pos: 'ATA' }, { id: 'st2', x: 65, y: 18, pos: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 75, y: 72, pos: 'ZAG' }, { id: 'cb3', x: 25, y: 72, pos: 'ZAG' },
    { id: 'm1',  x: 50, y: 52, pos: 'MEI' }, { id: 'm2',  x: 25, y: 46, pos: 'MEI' }, { id: 'm3',  x: 75, y: 46, pos: 'MEI' }, { id: 'm4',  x: 10, y: 38, pos: 'MEI' }, { id: 'm5', x: 90, y: 38, pos: 'MEI' },
    { id: 'st1', x: 38, y: 18, pos: 'ATA' }, { id: 'st2', x: 62, y: 18, pos: 'ATA' },
  ],
  '5-4-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 78, pos: 'ZAG' }, { id: 'cb2', x: 70, y: 75, pos: 'ZAG' }, { id: 'cb3', x: 30, y: 75, pos: 'ZAG' }, { id: 'rb',  x: 88, y: 68, pos: 'LAT' }, { id: 'lb', x: 12, y: 68, pos: 'LAT' },
    { id: 'm1',  x: 35, y: 48, pos: 'MEI' }, { id: 'm2',  x: 65, y: 48, pos: 'MEI' }, { id: 'm3',  x: 15, y: 40, pos: 'MEI' }, { id: 'm4',  x: 85, y: 40, pos: 'MEI' },
    { id: 'st',  x: 50, y: 18, pos: 'ATA' },
  ],
};

const FORMATION_LABELS: Record<string, string> = {
  '4-2-3-1': '4·2·3·1', '4-3-3': '4·3·3', '4-4-2': '4·4·2', '3-5-2': '3·5·2', '5-4-1': '5·4·1',
};

type Perfil = { display_name?: string; avatar_url?: string; nivel?: string; xp?: number };

// ─── Auth Gate ────────────────────────────────────────────────────────────────

function AuthGate({ onAuthenticated }: { onAuthenticated: (uid: string) => void }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) onAuthenticated(session.user.id);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) onAuthenticated(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line

  const handleGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ✅ CORRIGIDO: sempre redireciona para a HOME do Tigre FC.
        // NUNCA usar window.location.href — se o usuário chegou pelo link
        // /tigre-fc/escalar/123, o href seria esse e cairia direto na escalação
        // sem passar pela home (jogo, sofascore, ranking, chat).
        redirectTo: `${window.location.origin}/tigre-fc`,
      },
    });
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 text-center">
        <img src={PATA_LOGO} className="w-20 h-20 object-contain" alt="Tigre FC" />
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Tigre FC</h1>
          <p className="text-zinc-500 text-sm mt-1 font-medium">Entre no clube. Faça sua escalação.</p>
        </div>
        <button
          onClick={handleGoogle}
          className="flex items-center gap-3 bg-white text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-yellow-400 active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>
        <p className="text-zinc-700 text-[11px] font-medium">
          Você verá o jogo, ranking e chat antes de escalar.
        </p>
      </motion.div>
    </div>
  );
}

// ─── Player Cards ─────────────────────────────────────────────────────────────

function PlayerCardMercado({ player, onClick }: { player: Player; onClick: () => void }) {
  const cor  = POS_CORES[player.pos] ?? '#71717A';
  const glow = POS_GLOW[player.pos]  ?? 'rgba(113,113,122,0.4)';
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2, boxShadow: `0 0 14px ${glow}` }}
      whileTap={{ scale: 0.96 }}
      initial={{ boxShadow: `0 0 0px ${glow}` }}
      onClick={onClick}
      className="relative flex items-center gap-2 bg-zinc-950 rounded-xl overflow-hidden cursor-pointer border border-zinc-900 hover:border-zinc-700 transition-all"
    >
      <div className="w-1 self-stretch rounded-l-xl" style={{ background: cor }} />
      <div className="relative w-12 h-14 shrink-0 overflow-hidden">
        <img src={player.foto} className="w-full h-full object-cover" style={{ objectPosition: 'left top' }} alt={player.short} />
      </div>
      <div className="flex-1 min-w-0 py-2 pr-2">
        <div className="text-white text-[11px] font-black uppercase truncate">{player.short}</div>
        <div className="text-[9px] font-black uppercase tracking-wider" style={{ color: cor }}>{player.pos}</div>
        <div className="text-zinc-700 text-[9px] font-medium">#{player.num}</div>
      </div>
    </motion.div>
  );
}

function PlayerCardCampo({ player, isCaptain, isHero, isSpecialTarget, size = 60 }: {
  player: Player; isCaptain: boolean; isHero: boolean; isSpecialTarget?: boolean; size?: number;
}) {
  const cor = POS_CORES[player.pos] ?? '#71717A';
  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
      className="relative"
      style={{ width: size }}
    >
      {isSpecialTarget && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="absolute -inset-2 rounded-xl"
          style={{
            background: isCaptain
              ? 'radial-gradient(circle, rgba(245,196,0,0.5) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(0,243,255,0.5) 0%, transparent 70%)',
          }}
        />
      )}
      <div
        className="relative bg-zinc-900 rounded-lg overflow-hidden border-2"
        style={{
          height: size * 1.35,
          borderColor: isCaptain ? '#F5C400' : isHero ? '#00F3FF' : cor,
          boxShadow: isCaptain
            ? '0 0 16px rgba(245,196,0,0.7)'
            : isHero
            ? '0 0 16px rgba(0,243,255,0.7)'
            : `0 0 8px ${POS_GLOW[player.pos] ?? 'transparent'}`,
        }}
      >
        <img src={player.foto} className="w-full h-full object-cover" style={{ objectPosition: 'right top' }} alt={player.short} />
        <div className="absolute bottom-0 w-full bg-black/85 text-center py-[2px]">
          <div className="text-[6px] font-black" style={{ color: cor }}>{player.pos}</div>
          <div className="text-white text-[7px] font-black uppercase truncate px-0.5">{player.short}</div>
        </div>
        {isCaptain && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(245,196,0,0.8)]">
            <span className="text-black text-[7px] font-black">C</span>
          </div>
        )}
        {isHero && (
          <div className="absolute top-1 right-1 w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(0,243,255,0.8)]">
            <span className="text-black text-[7px] font-black">H</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SaveBadge({ status }: { status: 'idle' | 'saving' | 'saved' | 'error' }) {
  if (status === 'idle') return null;
  const map = {
    saving: { label: 'Salvando...', cls: 'text-zinc-500' },
    saved:  { label: '✓ Salvo',     cls: 'text-green-500' },
    error:  { label: '⚠ Erro',      cls: 'text-red-400'   },
  };
  const c = map[status];
  return (
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className={`text-[9px] font-black uppercase tracking-widest ${c.cls}`}>
      {c.label}
    </motion.span>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const jogoRef        = resolvedParams?.jogoId;

  // ── TODOS os hooks aqui — NUNCA depois de um return condicional ───────────
  const [authed,        setAuthed]        = useState(false);
  const [googleId,      setGoogleId]      = useState<string | null>(null);
  const [perfil,        setPerfil]        = useState<Perfil | null>(null);
  const [selectedSlot,  setSelectedSlot]  = useState<string | null>(null);
  const [filterPos,     setFilterPos]     = useState('TODOS');
  const [specialMode,   setSpecialMode]   = useState<'CAPTAIN' | 'HERO' | null>(null);
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [bench,         setBench]         = useState<(Player | null)[]>([null, null, null, null, null]);

  const esc = useEscalacao(jogoRef);

  const supabase = React.useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  // Busca perfil do usuário logado para passar ao TigreFCShare
  useEffect(() => {
    if (!esc.usuarioId) return;
    supabase
      .from('tigre_fc_usuarios')
      .select('display_name, avatar_url, nivel, xp')
      .eq('id', esc.usuarioId)
      .single()
      .then(({ data }) => { if (data) setPerfil(data as Perfil); });
  }, [esc.usuarioId, supabase]);

  const currentFormation = FORMATIONS[esc.formacao] ?? FORMATIONS['4-2-3-1'];

  const isFullTeam = useMemo(
    () => currentFormation.every(s => !!esc.lineup[s.id]),
    [esc.lineup, currentFormation]
  );

  const usedIds = useMemo(() => {
    const ids = new Set(Object.values(esc.lineup).filter(Boolean).map(p => p!.id));
    bench.filter(Boolean).forEach(p => ids.add(p!.id));
    return ids;
  }, [esc.lineup, bench]);

  const filteredPlayers = useMemo(
    () => PLAYERS.filter(p => !usedIds.has(p.id) && (filterPos === 'TODOS' || p.pos === filterPos)),
    [usedIds, filterPos]
  );

  const captainPlayer = useMemo(
    () => Object.values(esc.lineup).find(p => p?.id === esc.captainId) ?? null,
    [esc.lineup, esc.captainId]
  );
  const heroPlayer = useMemo(
    () => Object.values(esc.lineup).find(p => p?.id === esc.heroId) ?? null,
    [esc.lineup, esc.heroId]
  );

  const handleSlotClick = (slotId: string) => {
    const p = esc.lineup[slotId];
    if (specialMode === 'CAPTAIN' && p) { esc.setCaptainId(p.id); setSpecialMode(null); return; }
    if (specialMode === 'HERO'    && p) { esc.setHeroId(p.id);    setSpecialMode(null); return; }
    setSelectedSlot(slotId);
  };

  const handleSelectPlayer = (player: Player) => {
    if (!selectedSlot) return;
    esc.setPlayerInSlot(selectedSlot, player);
    setSelectedSlot(null);
  };

  const handleBenchDrop = (idx: number, player: Player) => {
    setBench(prev => { const n = [...prev]; n[idx] = player; return n; });
  };

  // ── Returns condicionais DEPOIS de todos os hooks ─────────────────────────

  if (!authed) {
    return <AuthGate onAuthenticated={(uid) => { setGoogleId(uid); setAuthed(true); }} />;
  }

  if (esc.isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Carregando escalação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <img src={PATA_LOGO} className="w-6 h-6 object-contain" alt="" />
          <span className="text-white font-black italic uppercase tracking-tighter text-sm">Tigre FC</span>
        </div>
        <div className="flex items-center gap-3">
          <SaveBadge status={esc.saveStatus} />
          <div className="flex gap-1">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} onClick={() => esc.setFormacao(f)}
                className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all ${
                  esc.formacao === f
                    ? 'bg-yellow-500 text-black shadow-[0_0_8px_rgba(245,196,0,0.5)]'
                    : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800 border border-zinc-800'
                }`}>
                {FORMATION_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* CAMPO */}
      <div className="px-3 pt-4 pb-2">
        <div className="relative w-full max-w-lg mx-auto aspect-[1/1.25] rounded-2xl overflow-visible">
          <CampoFifa />
          <div className="absolute inset-0 z-10">
            {currentFormation.map(slot => {
              const player   = esc.lineup[slot.id];
              const isTarget = !!specialMode && !!player;
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)}
                  style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:z-20 transition-all"
                >
                  {player ? (
                    <PlayerCardCampo
                      player={player}
                      isCaptain={esc.captainId === player.id}
                      isHero={esc.heroId === player.id}
                      isSpecialTarget={isTarget}
                      size={58}
                    />
                  ) : (
                    <motion.div
                      animate={selectedSlot === slot.id ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className={`w-10 h-12 rounded-lg border-2 border-dashed flex items-center justify-center transition-all ${
                        selectedSlot === slot.id
                          ? 'border-yellow-500 bg-yellow-500/20 shadow-[0_0_12px_rgba(245,196,0,0.4)]'
                          : 'border-white/10 bg-black/30 hover:border-white/25'
                      }`}
                    >
                      <span className="text-[8px] font-black" style={{ color: POS_CORES[slot.pos] ?? '#555' }}>
                        {slot.pos}
                      </span>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BANCO DE RESERVAS */}
      <div className="px-3 pb-4">
        <div className="max-w-lg mx-auto">
          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-2 text-center">Banco de Reservas</p>
          <div className="flex gap-2 justify-center">
            {bench.map((player, idx) => (
              <div key={idx}
                onClick={() => { if (!player) setSelectedSlot(`bench-${idx}`); }}
                className={`relative w-12 h-16 rounded-lg border border-dashed cursor-pointer transition-all ${player ? 'border-zinc-700' : 'border-zinc-800 hover:border-zinc-600'}`}
                style={{ opacity: 0.7 }}
              >
                {player ? (
                  <>
                    <img src={player.foto} className="w-full h-full object-cover rounded-lg object-top" alt={player.short} />
                    <div className="absolute bottom-0 w-full bg-black/85 text-center py-[1px] rounded-b-lg">
                      <span className="text-white text-[5px] font-black uppercase truncate block px-0.5">{player.short}</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); setBench(prev => { const n = [...prev]; n[idx] = null; return n; }); }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center leading-none"
                    >×</button>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-zinc-700 text-lg">+</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FLUXO PÓS-TIME-COMPLETO */}
      <AnimatePresence>
        {isFullTeam && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="px-3 pb-4 max-w-lg mx-auto space-y-4">
            <CapitaoEHeroi
              onSelect={mode => setSpecialMode(mode)}
              captainName={captainPlayer?.short}
              heroName={heroPlayer?.short}
              captainFoto={captainPlayer?.foto}
              heroFoto={heroPlayer?.foto}
            />

            {esc.captainId && esc.heroId && (
              <Palpite
                scoreTigre={esc.scoreTigre}
                scoreAdversario={esc.scoreAdv}
                setScoreTigre={v => esc.setScore(v, esc.scoreAdv)}
                setScoreAdversario={v => esc.setScore(esc.scoreTigre, v)}
                isLocked={esc.scoreLocked}
                onLock={esc.lockScore}
              />
            )}

            <motion.button
              disabled={!esc.scoreLocked}
              onClick={() => setShowFinalCard(true)}
              animate={esc.scoreLocked ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-sm transition-all mb-6 ${
                esc.scoreLocked
                  ? 'bg-yellow-500 text-black shadow-[0_8px_30px_rgba(245,196,0,0.4)]'
                  : 'bg-zinc-900 text-zinc-600 opacity-40 cursor-not-allowed border border-zinc-800'
              }`}
            >
              {esc.scoreLocked ? 'Finalizar Escalação →' : 'Registre o palpite primeiro'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MERCADO */}
      <div className="border-t border-white/5 bg-zinc-950/50">
        <div className="px-3 py-4 max-w-lg mx-auto">
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            {['TODOS', 'GOL', 'ZAG', 'LAT', 'MEI', 'ATA'].map(pos => (
              <button key={pos} onClick={() => setFilterPos(pos)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border ${
                  filterPos === pos
                    ? 'text-black border-transparent'
                    : 'bg-transparent border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                }`}
                style={filterPos === pos ? {
                  background: pos === 'TODOS' ? '#F5C400' : (POS_CORES[pos] ?? '#F5C400'),
                  boxShadow: `0 0 10px ${POS_GLOW[pos] ?? 'rgba(245,196,0,0.4)'}`,
                } : {}}
              >
                {pos}
              </button>
            ))}
          </div>

          {selectedSlot && !selectedSlot.startsWith('bench') && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-yellow-500 text-[10px] font-black uppercase tracking-widest text-center mb-3 animate-pulse">
              ▲ Selecione um jogador para o slot destacado
            </motion.p>
          )}

          <div className="grid grid-cols-1 gap-2">
            {filteredPlayers.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <PlayerCardMercado
                  player={p}
                  onClick={() => {
                    if (selectedSlot?.startsWith('bench-')) {
                      handleBenchDrop(parseInt(selectedSlot.replace('bench-', '')), p);
                      setSelectedSlot(null);
                    } else {
                      handleSelectPlayer(p);
                    }
                  }}
                />
              </motion.div>
            ))}
            {filteredPlayers.length === 0 && (
              <p className="text-zinc-700 text-xs font-bold uppercase text-center py-8 tracking-widest">
                Todos escalados nessa posição ✓
              </p>
            )}
          </div>
        </div>
      </div>

      {/* MODAL SHARE */}
      {showFinalCard && (
        <TigreFCShare
          usuario={{
            display_name: perfil?.display_name,
            avatar_url:   perfil?.avatar_url,
            nivel:        perfil?.nivel,
            xp:           perfil?.xp,
          }}
          escalacao={{
            formacao:    esc.formacao,
            lineup_json: esc.lineup,
            capitan_id:  esc.captainId,
            heroi_id:    esc.heroId,
            score_tigre: esc.scoreTigre,
            score_adv:   esc.scoreAdv,
          }}
          onClose={() => setShowFinalCard(false)}
        />
      )}

      <style jsx global>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
