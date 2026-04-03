'use client';

/**
 * TigreFCPerfilPublico
 * 
 * Permite que qualquer usuário veja a escalação de outro jogador.
 * Engajamento: botão de "Corneta" para provocação amigável.
 * Visível sem autenticação — dados públicos via RLS policy.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import confetti from 'canvas-confetti';
import { NIVEL_CORES, NIVEL_ICONES } from '@/hooks/useLigas'; // Ajuste o path

// ─── Tipos inline (evita dependência circular) ───────────────────────────────

type Player = {
  id: number; short: string; pos: string; foto: string; num: number;
};

type FormationSlot = { id: string; x: number; y: number; pos: string };

const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const PATA_LOGO    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const FORMATIONS: Record<string, FormationSlot[]> = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 58, pos: 'MEI' }, { id: 'dm2', x: 65, y: 58, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' }, { id: 'rw', x: 82, y: 30, pos: 'ATA' }, { id: 'lw', x: 18, y: 30, pos: 'ATA' },
    { id: 'st', x: 50, y: 15, pos: 'ATA' }
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 85, pos: 'GOL' },
    { id: 'rb', x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb', x: 18, y: 65, pos: 'LAT' },
    { id: 'm1', x: 50, y: 50, pos: 'MEI' }, { id: 'm2', x: 75, y: 42, pos: 'MEI' }, { id: 'm3', x: 25, y: 42, pos: 'MEI' },
    { id: 'st', x: 50, y: 12, pos: 'ATA' }, { id: 'rw', x: 82, y: 20, pos: 'ATA' }, { id: 'lw', x: 18, y: 20, pos: 'ATA' }
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 85, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 15, y: 68, pos: 'LAT' },
    { id: 'm1', x: 20, y: 48, pos: 'MEI' }, { id: 'm2', x: 40, y: 48, pos: 'MEI' }, { id: 'm3', x: 60, y: 48, pos: 'MEI' }, { id: 'm4', x: 80, y: 48, pos: 'MEI' },
    { id: 'st1', x: 35, y: 18, pos: 'ATA' }, { id: 'st2', x: 65, y: 18, pos: 'ATA' }
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 75, y: 72, pos: 'ZAG' }, { id: 'cb3', x: 25, y: 72, pos: 'ZAG' },
    { id: 'm1', x: 50, y: 52, pos: 'MEI' }, { id: 'm2', x: 25, y: 48, pos: 'MEI' }, { id: 'm3', x: 75, y: 48, pos: 'MEI' }, { id: 'm4', x: 10, y: 38, pos: 'MEI' }, { id: 'm5', x: 90, y: 38, pos: 'MEI' },
    { id: 'st1', x: 40, y: 18, pos: 'ATA' }, { id: 'st2', x: 60, y: 18, pos: 'ATA' }
  ],
};

// ─── Corneta Toast ────────────────────────────────────────────────────────────

const CORNETAS = [
  '📯 Essa escalação tá de chorar! 😂',
  '🔥 Caprichoso, hein? Minha avó escala melhor!',
  '⚡ Aposta aí que eu ganho de vocês!',
  '🦁 Isso é time? Parece pelada de domingo!',
  '👑 Copiou a minha esquema e ainda errou!',
  '🏆 Com esse time você não ganha nem no videogame!',
];

// ─── MiniPlayerCard ───────────────────────────────────────────────────────────

function MiniPlayerCard({ player, isCaptain, isHero }: { player: Player; isCaptain: boolean; isHero: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-9 h-12 rounded-md overflow-hidden border-2 ${
        isCaptain ? 'border-yellow-500 shadow-[0_0_8px_#F5C400]' :
        isHero    ? 'border-cyan-400  shadow-[0_0_8px_#00F3FF]'  :
                    'border-zinc-700'
      }`}>
        <img src={player.foto} className="w-full h-full object-cover object-top" alt={player.short} />
        {isCaptain && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[5px] font-black px-0.5 rounded-bl leading-tight">C</div>
        )}
        {isHero && (
          <div className="absolute top-0 right-0 bg-cyan-400 text-black text-[5px] font-black px-0.5 rounded-bl leading-tight">H</div>
        )}
        <div className="absolute bottom-0 w-full bg-black/85 text-center py-[2px]">
          <span className="text-white text-[5px] font-black uppercase truncate block px-0.5">{player.short}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface TigreFCPerfilPublicoProps {
  targetUsuarioId: string;
  viewerUsuarioId?: string | null; // null = visitante não logado
}

export default function TigreFCPerfilPublico({ targetUsuarioId, viewerUsuarioId }: TigreFCPerfilPublicoProps) {
  const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);                                          // ← adicione essa linha

const [dados, setDados] = useState<any>(null);

  const [dados, setDados]         = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [corneta, setCorneta]     = useState<string | null>(null);
  const [cornetaCount, setCornetaCount] = useState(0);

  const isSelfView = viewerUsuarioId === targetUsuarioId;

  useEffect(() => {
    async function load() {
      setIsLoading(true);

      // Busca escalação + perfil em JOIN
      const { data: escData } = await supabase
        .from('tigre_fc_escalacoes')
        .select(`
          formacao, lineup_json, capitan_id, heroi_id,
          score_tigre, score_adv, score_locked, updated_at,
          tigre_fc_usuarios ( display_name, avatar_url, xp, nivel )
        `)
        .eq('usuario_id', targetUsuarioId)
        .maybeSingle();

      setDados(escData ?? null);
      setIsLoading(false);
    }
    load();
  }, [targetUsuarioId, supabase]);

  const dispararCorneta = useCallback(() => {
    const msg = CORNETAS[Math.floor(Math.random() * CORNETAS.length)];
    setCorneta(msg);
    setCornetaCount(c => c + 1);
    setTimeout(() => setCorneta(null), 3500);

    // Confetes de corneta 🎺
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#F5C400', '#EF4444', '#ffffff'],
    });
  }, []);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-black rounded-3xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 text-xs font-black uppercase tracking-widest">Buscando escalação...</p>
        </div>
      </div>
    );
  }

  // ── Sem escalação ─────────────────────────────────────────────────────────
  if (!dados) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-zinc-950 rounded-3xl border border-zinc-900 gap-4">
        <span className="text-5xl">⚽</span>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Este torcedor ainda não escalou o time</p>
      </div>
    );
  }

  const perfil    = dados.tigre_fc_usuarios ?? {};
  const formacao  = dados.formacao ?? '4-2-3-1';
  const slots     = FORMATIONS[formacao] ?? FORMATIONS['4-2-3-1'];
  const lineup    = (dados.lineup_json ?? {}) as Record<string, Player | null>;
  const captainId = dados.capitan_id;
  const heroId    = dados.heroi_id;
  const nivelCor  = NIVEL_CORES[perfil.nivel ?? 'Novato'] ?? '#71717A';
  const nivelIcon = NIVEL_ICONES[perfil.nivel ?? 'Novato'] ?? '🌱';

  const playersInField = slots.filter(s => lineup[s.id]);

  return (
    <div className="relative bg-black rounded-[2rem] border border-zinc-900 overflow-hidden">

      {/* HEADER DO PERFIL */}
      <div className="flex items-center gap-4 p-6 border-b border-zinc-900">
        {perfil.avatar_url ? (
          <img
            src={perfil.avatar_url}
            className="w-14 h-14 rounded-full border-2 object-cover"
            style={{ borderColor: nivelCor }}
            alt={perfil.display_name}
          />
        ) : (
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
            style={{ borderColor: nivelCor, background: `${nivelCor}20` }}
          >
            {nivelIcon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-black text-lg uppercase tracking-tight truncate">
              {perfil.display_name ?? 'Torcedor'}
            </h3>
            {isSelfView && (
              <span className="text-[9px] font-black bg-yellow-500 text-black px-2 py-0.5 rounded-full uppercase">Você</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-black uppercase" style={{ color: nivelCor }}>
              {nivelIcon} {perfil.nivel ?? 'Novato'}
            </span>
            <span className="text-zinc-600 text-[10px]">•</span>
            <span className="text-zinc-500 text-[10px] font-bold">{perfil.xp ?? 0} XP</span>
          </div>
        </div>

        {/* PLACAR DO PALPITE */}
        {dados.score_locked && (
          <div className="flex flex-col items-center">
            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mb-1">Palpite</span>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-2xl font-black italic">{dados.score_tigre}</span>
              <span className="text-zinc-700 font-black text-sm">x</span>
              <span className="text-zinc-400 text-2xl font-black italic">{dados.score_adv}</span>
            </div>
          </div>
        )}
      </div>

      {/* CAMPO COM TIME */}
      <div className="relative p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <img src={ESCUDO_TIGRE} className="w-5 h-5 object-contain" alt="Tigre" />
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{formacao}</span>
          </div>
          <span className="text-[9px] text-zinc-700 font-medium">
            {playersInField.length}/11 escalados
          </span>
        </div>

        {/* CAMPO */}
        <div className="relative w-full aspect-[1/1.2] rounded-2xl overflow-hidden bg-[#1a521a] border border-white/10">
          {/* Textura gramado */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-dotted-2.png')] opacity-15" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`absolute w-full ${i % 2 === 0 ? 'bg-[#216621]' : ''}`}
              style={{ height: '16.66%', top: `${i * 16.66}%` }} />
          ))}
          {/* Linhas */}
          <div className="absolute inset-3 border border-white/20 rounded" />
          <div className="absolute top-1/2 left-3 right-3 h-px bg-white/20" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Jogadores */}
          {slots.map(slot => {
            const player = lineup[slot.id];
            if (!player) return (
              <div key={slot.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-9 rounded border border-dashed border-white/10 flex items-center justify-center"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                <span className="text-[6px] text-zinc-700 font-black">{slot.pos}</span>
              </div>
            );
            return (
              <div key={slot.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                <MiniPlayerCard
                  player={player}
                  isCaptain={player.id === captainId}
                  isHero={player.id === heroId}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* AÇÃO: CORNETA (apenas para outros usuários) */}
      {!isSelfView && (
        <div className="px-4 pb-6 flex flex-col items-center gap-3">
          <button
            onClick={dispararCorneta}
            className="group relative w-full py-4 bg-zinc-950 border-2 border-zinc-800 rounded-2xl font-black text-sm uppercase italic tracking-widest
              hover:border-yellow-500 hover:text-yellow-500 transition-all active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              📯 Corneta!
              {cornetaCount > 0 && (
                <span className="bg-yellow-500 text-black text-[9px] font-black rounded-full px-1.5 py-0.5">
                  {cornetaCount}
                </span>
              )}
            </span>
          </button>

          <AnimatePresence>
            {corneta && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0,  scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center"
              >
                <p className="text-yellow-400 text-xs font-bold">{corneta}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Timestamp discreta */}
      <div className="absolute bottom-3 right-4 flex items-center gap-1 opacity-30">
        <img src={PATA_LOGO} className="w-3 h-3 object-contain" alt="" />
        <span className="text-[8px] text-zinc-600 font-medium">
          {dados.updated_at ? new Date(dados.updated_at).toLocaleDateString('pt-BR') : ''}
        </span>
      </div>
    </div>
  );
}
