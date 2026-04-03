'use client';

/**
 * TigreFCPerfilPublico v4 — Visualização Cruzada & Card PS5
 *
 * Novidades desta versão:
 * - Props duais: próprio perfil (onClose) OU perfil de outro jogador (targetUsuarioId)
 * - Campo visual completo com lineup do adversário renderizado
 * - UI estilo PS5/EA Sports: glass morphism, neon dourado, animações Framer Motion
 * - Share card via html2canvas + Web Share API
 * - "Cornetagem" integrada — botão de provocação visível no perfil alheio
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

// ─── Assets ──────────────────────────────────────────────────────────────────

const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Player = { id: number; short: string; pos: string; foto: string; num: number };
type Slot   = { id: string; x: number; y: number; pos: string };

type Perfil = {
  id: string;
  display_name: string;
  apelido?: string | null;
  avatar_url?: string | null;
  xp: number;
  nivel: string;
  pontos_total?: number;
  streak?: number;
  bio?: string | null;
};

type EscalacaoData = {
  formacao: string;
  lineup_json: Record<string, Player | null>;
  capitan_id?: number | null;
  heroi_id?: number | null;
};

// ─── Formações ────────────────────────────────────────────────────────────────

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'rb',  x: 82, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb',  x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 57, pos: 'MEI' }, { id: 'dm2', x: 65, y: 57, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' }, { id: 'rw',  x: 80, y: 27, pos: 'ATA' },
    { id: 'lw',  x: 20, y: 27, pos: 'ATA' }, { id: 'st',  x: 50, y: 13, pos: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk',  x: 50, y: 85, pos: 'GOL' },
    { id: 'rb',  x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb',  x: 18, y: 65, pos: 'LAT' },
    { id: 'm1',  x: 50, y: 50, pos: 'MEI' }, { id: 'm2',  x: 75, y: 42, pos: 'MEI' },
    { id: 'm3',  x: 25, y: 42, pos: 'MEI' }, { id: 'st',  x: 50, y: 13, pos: 'ATA' },
    { id: 'rw',  x: 80, y: 20, pos: 'ATA' }, { id: 'lw',  x: 20, y: 20, pos: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'rb',  x: 85, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb',  x: 15, y: 68, pos: 'LAT' },
    { id: 'm1',  x: 20, y: 48, pos: 'MEI' }, { id: 'm2',  x: 40, y: 48, pos: 'MEI' },
    { id: 'm3',  x: 60, y: 48, pos: 'MEI' }, { id: 'm4',  x: 80, y: 48, pos: 'MEI' },
    { id: 'st1', x: 35, y: 18, pos: 'ATA' }, { id: 'st2', x: 65, y: 18, pos: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 75, y: 72, pos: 'ZAG' },
    { id: 'cb3', x: 25, y: 72, pos: 'ZAG' }, { id: 'm1',  x: 50, y: 52, pos: 'MEI' },
    { id: 'm2',  x: 25, y: 46, pos: 'MEI' }, { id: 'm3',  x: 75, y: 46, pos: 'MEI' },
    { id: 'm4',  x: 10, y: 38, pos: 'MEI' }, { id: 'm5',  x: 90, y: 38, pos: 'MEI' },
    { id: 'st1', x: 38, y: 18, pos: 'ATA' }, { id: 'st2', x: 62, y: 18, pos: 'ATA' },
  ],
  '5-4-1': [
    { id: 'gk',  x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 78, pos: 'ZAG' }, { id: 'cb2', x: 70, y: 75, pos: 'ZAG' },
    { id: 'cb3', x: 30, y: 75, pos: 'ZAG' }, { id: 'rb',  x: 88, y: 68, pos: 'LAT' },
    { id: 'lb',  x: 12, y: 68, pos: 'LAT' }, { id: 'm1',  x: 35, y: 48, pos: 'MEI' },
    { id: 'm2',  x: 65, y: 48, pos: 'MEI' }, { id: 'm3',  x: 15, y: 40, pos: 'MEI' },
    { id: 'm4',  x: 85, y: 40, pos: 'MEI' }, { id: 'st',  x: 50, y: 18, pos: 'ATA' },
  ],
};

const NIVEL_CORES: Record<string, string> = {
  Novato: '#71717A', Torcedor: '#3B82F6', Fiel: '#F5C400', Fanático: '#EF4444', Lenda: '#9333EA',
};

const NIVEL_ICONES: Record<string, string> = {
  Novato: '🌱', Torcedor: '👟', Fiel: '🏆', Fanático: '🔥', Lenda: '👑',
};

const POS_CORES: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#3B82F6', LAT: '#06B6D4', MEI: '#22C55E', ATA: '#EF4444',
};

const CORNETAS = ['🎺 Que time é esse?!', '😂 Serio isso?', '🐔 Medo da formação?', '🔥 Tô na frente!', '👀 Precisa rever o time'];

// ─── Subcomponente: Campo Visual ──────────────────────────────────────────────

function CampoVisual({
  formacao,
  lineup,
  captainId,
  isOwn,
}: {
  formacao: string;
  lineup: Record<string, Player | null>;
  captainId?: number | null;
  isOwn: boolean;
}) {
  const slots = FORMATIONS[formacao] ?? FORMATIONS['4-2-3-1'];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '7/10',
        borderRadius: 16,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #0d2b0d 0%, #1a4a1a 35%, #1e5c1e 65%, #0d2b0d 100%)',
        border: '1px solid rgba(245,196,0,0.15)',
      }}
    >
      {/* Linhas do campo */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
        viewBox="0 0 100 143"
        preserveAspectRatio="none"
      >
        <rect x="5" y="5" width="90" height="133" rx="2" fill="none" stroke="white" strokeWidth="1" />
        <line x1="5" y1="71.5" x2="95" y2="71.5" stroke="white" strokeWidth="0.8" />
        <circle cx="50" cy="71.5" r="12" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="28" y="5" width="44" height="18" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="28" y="120" width="44" height="18" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="38" y="5" width="24" height="9" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="38" y="129" width="24" height="9" fill="none" stroke="white" strokeWidth="0.8" />
        <circle cx="50" cy="5" r="1.5" fill="white" />
        <circle cx="50" cy="138" r="1.5" fill="white" />
      </svg>

      {/* Jogadores nos slots */}
      {slots.map((slot) => {
        const player = lineup[slot.id] ?? null;
        const isCap = player?.id === captainId;

        return (
          <div
            key={slot.id}
            style={{
              position: 'absolute',
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              zIndex: 2,
            }}
          >
            {player ? (
              <>
                <div style={{ position: 'relative' }}>
                  {isCap && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -6,
                        right: -4,
                        background: '#F5C400',
                        color: '#000',
                        fontSize: 7,
                        fontWeight: 900,
                        padding: '1px 3px',
                        borderRadius: 3,
                        zIndex: 3,
                        lineHeight: 1,
                      }}
                    >
                      C
                    </div>
                  )}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: `2px solid ${POS_CORES[player.pos] ?? '#F5C400'}`,
                      background: '#111',
                      boxShadow: isCap ? `0 0 10px ${POS_CORES[player.pos]}80` : undefined,
                    }}
                  >
                    <img
                      src={player.foto}
                      alt={player.short}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/placeholder-player.png';
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(4px)',
                    color: '#fff',
                    fontSize: 8,
                    fontWeight: 800,
                    padding: '1px 4px',
                    borderRadius: 4,
                    maxWidth: 44,
                    textAlign: 'center',
                    lineHeight: 1.4,
                    letterSpacing: 0.2,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {player.short}
                </div>
              </>
            ) : (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  border: `1.5px dashed rgba(255,255,255,0.15)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>
                  {slot.pos.slice(0, 1)}
                </span>
              </div>
            )}
          </div>
        );
      })}

      {/* Formação badge */}
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 10,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          color: '#F5C400',
          fontSize: 9,
          fontWeight: 900,
          padding: '3px 7px',
          borderRadius: 6,
          letterSpacing: 1,
          border: '1px solid rgba(245,196,0,0.2)',
        }}
      >
        {formacao.replace(/-/g, '·')}
      </div>
    </div>
  );
}

// ─── Subcomponente: Header do Perfil ─────────────────────────────────────────

function PerfilHeader({ perfil, isOwn }: { perfil: Perfil; isOwn: boolean }) {
  const nivelCor = NIVEL_CORES[perfil.nivel] ?? '#F5C400';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 0 16px' }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${nivelCor}40, ${nivelCor}10)`,
            border: `2px solid ${nivelCor}`,
            overflow: 'hidden',
            boxShadow: `0 0 16px ${nivelCor}40`,
          }}
        >
          {perfil.avatar_url ? (
            <img src={perfil.avatar_url} alt={perfil.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
              {NIVEL_ICONES[perfil.nivel] ?? '🐯'}
            </div>
          )}
        </div>
        {/* Badge de nível */}
        <div
          style={{
            position: 'absolute',
            bottom: -2,
            right: -4,
            background: nivelCor,
            color: '#000',
            fontSize: 7,
            fontWeight: 900,
            padding: '1px 4px',
            borderRadius: 4,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {perfil.nivel}
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: -0.5, lineHeight: 1.1, textTransform: 'uppercase' }}>
          {perfil.apelido ?? perfil.display_name}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <div style={{ fontSize: 10, color: '#F5C400', fontWeight: 700 }}>
            {perfil.xp} XP
          </div>
          {(perfil.pontos_total ?? 0) > 0 && (
            <div style={{ fontSize: 10, color: '#666', fontWeight: 700 }}>
              {perfil.pontos_total} pts
            </div>
          )}
          {(perfil.streak ?? 0) > 1 && (
            <div style={{ fontSize: 10, color: '#F97316', fontWeight: 700 }}>
              🔥 {perfil.streak}x streak
            </div>
          )}
        </div>
        {perfil.bio && (
          <div style={{ fontSize: 11, color: '#555', marginTop: 4, lineHeight: 1.4 }}>
            {perfil.bio}
          </div>
        )}
      </div>

      {!isOwn && (
        <img src={ESCUDO} alt="Tigre" style={{ width: 28, height: 28, objectFit: 'contain', opacity: 0.6 }} />
      )}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface TigreFCPerfilPublicoProps {
  // Modo "meu perfil" (legado)
  usuarioId?: string | null;
  meuId?: string | null;
  jogoId?: number | null;

  // Aliases usados por TigreFCRankingPage e outros
  targetUserId?: string | null;       // alias de targetUsuarioId
  targetUsuarioId?: string | null;
  viewerUsuarioId?: string | null;

  onClose?: () => void;
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function TigreFCPerfilPublico({
  usuarioId,
  meuId,
  onClose,
  targetUserId,
  targetUsuarioId,
  viewerUsuarioId,
}: TigreFCPerfilPublicoProps) {
  // Resolve qual ID carregar e se é visualização própria ou cruzada
  const targetId = targetUsuarioId ?? targetUserId ?? usuarioId ?? null;
  const viewerId = viewerUsuarioId ?? meuId ?? null;
  const isOwn    = targetId !== null && targetId === viewerId;
  const isCross  = !isOwn && targetId !== null;

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [perfil, setPerfil]         = useState<Perfil | null>(null);
  const [escalacao, setEscalacao]   = useState<EscalacaoData | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [corneta, setCorneta]       = useState<string | null>(null);
  const [copied, setCopied]         = useState(false);
  const fieldRef                    = useRef<HTMLDivElement>(null);

  // ── Carrega perfil via RPC get_perfil_publico ──────────────────────────────
  useEffect(() => {
    if (!targetId) { setIsLoading(false); return; }
    let alive = true;

    async function load() {
      setIsLoading(true);

      const { data, error } = await supabase.rpc('get_perfil_publico', {
        p_usuario_id: targetId,
      });

      if (!alive) return;

      if (error || data?.error) {
        console.error('[TigreFCPerfilPublico]', error ?? data?.error);
        setIsLoading(false);
        return;
      }

      const u = data.usuario as Perfil;
      const e = data.escalacao as EscalacaoData | null;

      // Sanitiza lineup_json
      if (e?.lineup_json) {
        e.lineup_json = Object.fromEntries(
          Object.entries(e.lineup_json).map(([k, v]) => [k, v ?? null])
        );
      }

      setPerfil(u);
      setEscalacao(e);
      setIsLoading(false);
    }

    load();
    return () => { alive = false; };
  }, [targetId, supabase]);

  const handleCorneta = useCallback(() => {
    const msg = CORNETAS[Math.floor(Math.random() * CORNETAS.length)];
    setCorneta(msg);
    setTimeout(() => setCorneta(null), 3000);
  }, []);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/tigre-fc/perfil/${targetId}`;
    if (navigator.share) {
      await navigator.share({ title: `Time de ${perfil?.display_name} — Tigre FC`, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [targetId, perfil]);

  if (!targetId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '0 0 env(safe-area-inset-bottom)',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{
            width: '100%',
            maxWidth: 480,
            background: 'linear-gradient(160deg, #0a0a0a 0%, #0f0f0f 40%, #111008 100%)',
            borderRadius: '24px 24px 0 0',
            borderTop: '1px solid rgba(245,196,0,0.25)',
            maxHeight: '92vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Linha de brilho */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.6), transparent)',
          }} />

          {/* Handle */}
          <div style={{ padding: '12px 0 0', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: 36, height: 4, background: '#2a2a2a', borderRadius: 2 }} />
          </div>

          {/* Scroll container */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 32px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 900, color: '#444', textTransform: 'uppercase', letterSpacing: 2 }}>
                {isCross ? '🔍 Time do Rival' : '⚽ Meu Time'}
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #222',
                    color: '#666',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                  }}
                >
                  ×
                </button>
              )}
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#333' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  border: '3px solid #1a1a1a',
                  borderTop: '3px solid #F5C400',
                  borderRadius: '50%',
                  margin: '0 auto 12px',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                <div style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>Carregando perfil...</div>
              </div>
            ) : !perfil ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🐯</div>
                <div style={{ fontSize: 14, color: '#555' }}>Perfil não encontrado</div>
              </div>
            ) : (
              <>
                {/* Perfil header */}
                <PerfilHeader perfil={perfil} isOwn={isOwn} />

                {/* Campo */}
                <div ref={fieldRef}>
                  {escalacao ? (
                    <CampoVisual
                      formacao={escalacao.formacao ?? '4-2-3-1'}
                      lineup={escalacao.lineup_json ?? {}}
                      captainId={escalacao.capitan_id}
                      isOwn={isOwn}
                    />
                  ) : (
                    <div
                      style={{
                        aspectRatio: '7/10',
                        background: 'linear-gradient(180deg, #0d2b0d, #1a4a1a)',
                        borderRadius: 16,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px dashed rgba(255,255,255,0.06)',
                        gap: 8,
                      }}
                    >
                      <div style={{ fontSize: 32, opacity: 0.3 }}>⚽</div>
                      <div style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>
                        {isOwn ? 'Monte seu time acima!' : 'Esse torcedor ainda não escalou.'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Ações — modo cruzado */}
                {isCross && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={handleCorneta}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: 'linear-gradient(135deg, #EF4444, #B91C1C)',
                        border: 'none',
                        borderRadius: 14,
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 900,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      🎺 Corneta!
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.93 }}
                      onClick={handleShare}
                      style={{
                        flex: 1,
                        padding: '14px',
                        background: '#1a1a1a',
                        border: '1px solid #2a2a2a',
                        borderRadius: 14,
                        color: copied ? '#22C55E' : '#fff',
                        fontSize: 12,
                        fontWeight: 900,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {copied ? '✓ Link copiado' : '📤 Compartilhar'}
                    </motion.button>
                  </div>
                )}

                {/* Ações — modo próprio */}
                {isOwn && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleShare}
                    style={{
                      marginTop: 16,
                      width: '100%',
                      padding: '16px',
                      background: 'linear-gradient(135deg, #F5C400, #D4A200)',
                      border: 'none',
                      borderRadius: 16,
                      color: '#000',
                      fontSize: 12,
                      fontWeight: 900,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      boxShadow: '0 8px 24px rgba(245,196,0,0.2)',
                    }}
                  >
                    {copied ? '✓ Link copiado!' : '🔗 Compartilhar meu time'}
                  </motion.button>
                )}

                {/* Toast de corneta */}
                <AnimatePresence>
                  {corneta && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.9 }}
                      style={{
                        marginTop: 12,
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #EF444420, #1a1a1a)',
                        border: '1px solid #EF4444',
                        borderRadius: 12,
                        color: '#EF4444',
                        fontSize: 14,
                        fontWeight: 800,
                        textAlign: 'center',
                      }}
                    >
                      {corneta}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
