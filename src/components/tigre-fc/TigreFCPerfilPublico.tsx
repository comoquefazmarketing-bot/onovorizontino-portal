'use client';

/**
 * TigreFCPerfilPublico v5
 * - Query direta ao Supabase como fallback (não depende do RPC get_perfil_publico)
 * - Corneta: 5 mensagens rotativas com animação
 * - Mostra última escalação salva
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

type Player = { id: number; short: string; pos: string; foto: string; num: number };
type Slot   = { id: string; x: number; y: number; pos: string };
type Perfil = {
  id: string; display_name: string; apelido?: string | null;
  avatar_url?: string | null; xp?: number; nivel?: string;
  pontos_total?: number; streak?: number; bio?: string | null;
};
type EscalacaoData = {
  formacao: string; lineup_json: Record<string, Player | null>;
  capitan_id?: number | null; heroi_id?: number | null; updated_at?: string;
};

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 57, pos: 'MEI' }, { id: 'dm2', x: 65, y: 57, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' }, { id: 'rw', x: 80, y: 27, pos: 'ATA' },
    { id: 'lw', x: 20, y: 27, pos: 'ATA' }, { id: 'st', x: 50, y: 13, pos: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 85, pos: 'GOL' },
    { id: 'rb', x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb', x: 18, y: 65, pos: 'LAT' },
    { id: 'm1', x: 50, y: 50, pos: 'MEI' }, { id: 'm2', x: 75, y: 42, pos: 'MEI' },
    { id: 'm3', x: 25, y: 42, pos: 'MEI' }, { id: 'st', x: 50, y: 13, pos: 'ATA' },
    { id: 'rw', x: 80, y: 20, pos: 'ATA' }, { id: 'lw', x: 20, y: 20, pos: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 85, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 15, y: 68, pos: 'LAT' },
    { id: 'm1', x: 20, y: 48, pos: 'MEI' }, { id: 'm2', x: 40, y: 48, pos: 'MEI' },
    { id: 'm3', x: 60, y: 48, pos: 'MEI' }, { id: 'm4', x: 80, y: 48, pos: 'MEI' },
    { id: 'st1', x: 35, y: 18, pos: 'ATA' }, { id: 'st2', x: 65, y: 18, pos: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 75, y: 72, pos: 'ZAG' },
    { id: 'cb3', x: 25, y: 72, pos: 'ZAG' }, { id: 'm1', x: 50, y: 52, pos: 'MEI' },
    { id: 'm2', x: 25, y: 46, pos: 'MEI' }, { id: 'm3', x: 75, y: 46, pos: 'MEI' },
    { id: 'm4', x: 10, y: 38, pos: 'MEI' }, { id: 'm5', x: 90, y: 38, pos: 'MEI' },
    { id: 'st1', x: 38, y: 18, pos: 'ATA' }, { id: 'st2', x: 62, y: 18, pos: 'ATA' },
  ],
  '5-4-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 78, pos: 'ZAG' }, { id: 'cb2', x: 70, y: 75, pos: 'ZAG' },
    { id: 'cb3', x: 30, y: 75, pos: 'ZAG' }, { id: 'rb', x: 88, y: 68, pos: 'LAT' },
    { id: 'lb', x: 12, y: 68, pos: 'LAT' }, { id: 'm1', x: 35, y: 48, pos: 'MEI' },
    { id: 'm2', x: 65, y: 48, pos: 'MEI' }, { id: 'm3', x: 15, y: 40, pos: 'MEI' },
    { id: 'm4', x: 85, y: 40, pos: 'MEI' }, { id: 'st', x: 50, y: 18, pos: 'ATA' },
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
const CORNETAS = [
  { emoji: '🎺', msg: 'Que time é esse, irmão?!' },
  { emoji: '😂', msg: 'Escalou isso sério??' },
  { emoji: '🔥', msg: 'Meu time bate o seu fácil!' },
  { emoji: '🐔', msg: 'Tá com medo da formação?' },
  { emoji: '👀', msg: 'Precisa muito rever esse time...' },
];

function CampoVisual({ formacao, lineup, captainId }: {
  formacao: string; lineup: Record<string, Player | null>; captainId?: number | null;
}) {
  const slots = FORMATIONS[formacao] ?? FORMATIONS['4-2-3-1'];
  const filled = Object.values(lineup).filter(Boolean).length;
  return (
    <div style={{
      position: 'relative', width: '100%', aspectRatio: '7/10', borderRadius: 16,
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0a2e0a 0%, #1a4a1a 40%, #1e5c1e 60%, #0a2e0a 100%)',
      border: '1px solid rgba(245,196,0,0.1)',
    }}>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}
        viewBox="0 0 100 143" preserveAspectRatio="none">
        <rect x="5" y="5" width="90" height="133" rx="2" fill="none" stroke="white" strokeWidth="1" />
        <line x1="5" y1="71.5" x2="95" y2="71.5" stroke="white" strokeWidth="0.8" />
        <circle cx="50" cy="71.5" r="12" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="28" y="5" width="44" height="18" fill="none" stroke="white" strokeWidth="0.8" />
        <rect x="28" y="120" width="44" height="18" fill="none" stroke="white" strokeWidth="0.8" />
      </svg>
      {filled === 0 && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <div style={{ fontSize: 32, opacity: 0.2 }}>⚽</div>
          <div style={{ fontSize: 11, color: '#2a2a2a', fontWeight: 700 }}>Ainda não escalou</div>
        </div>
      )}
      {slots.map(slot => {
        const player = lineup[slot.id] ?? null;
        const isCap = player?.id === captainId;
        return (
          <div key={slot.id} style={{
            position: 'absolute', left: `${slot.x}%`, top: `${slot.y}%`,
            transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, zIndex: 2,
          }}>
            {player ? (
              <>
                <div style={{ position: 'relative' }}>
                  {isCap && (
                    <div style={{ position: 'absolute', top: -5, right: -4, zIndex: 3, background: '#F5C400', color: '#000', fontSize: 7, fontWeight: 900, padding: '1px 3px', borderRadius: 3, lineHeight: 1 }}>C</div>
                  )}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${POS_CORES[player.pos] ?? '#F5C400'}`, background: '#111' }}>
                    <img src={player.foto} alt={player.short} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).src = PATA; }} />
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: 7, fontWeight: 800, padding: '1px 4px', borderRadius: 4, maxWidth: 42, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {player.short}
                </div>
              </>
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px dashed rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.15)', fontWeight: 700 }}>{slot.pos[0]}</span>
              </div>
            )}
          </div>
        );
      })}
      <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.75)', color: '#F5C400', fontSize: 8, fontWeight: 900, padding: '3px 7px', borderRadius: 6, letterSpacing: 1, border: '1px solid rgba(245,196,0,0.15)' }}>
        {formacao.replace(/-/g, '·')}
      </div>
    </div>
  );
}

interface Props {
  usuarioId?: string | null; meuId?: string | null; jogoId?: number | null;
  targetUserId?: string | null; targetUsuarioId?: string | null;
  viewerUsuarioId?: string | null; onClose?: () => void;
}

export default function TigreFCPerfilPublico({ usuarioId, meuId, jogoId, targetUserId, targetUsuarioId, viewerUsuarioId, onClose }: Props) {
  const targetId = targetUsuarioId ?? targetUserId ?? usuarioId ?? null;
  const viewerId = viewerUsuarioId ?? meuId ?? null;
  const isOwn    = !!targetId && targetId === viewerId;

  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  const [perfil,    setPerfil]    = useState<Perfil | null>(null);
  const [escalacao, setEscalacao] = useState<EscalacaoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [cornetaIdx, setCornetaIdx] = useState<number | null>(null);
  const [copied,    setCopied]    = useState(false);

  useEffect(() => {
    if (!targetId) { setIsLoading(false); return; }
    let alive = true;
    async function load() {
      setIsLoading(true); setError(null);
      // 1. Tenta RPC
      try {
        const { data: rpc } = await supabase.rpc('get_perfil_publico', { p_usuario_id: targetId });
        if (alive && rpc && !rpc.error && rpc.usuario) {
          setPerfil(rpc.usuario as Perfil);
          if (rpc.escalacao) {
            const e = rpc.escalacao as EscalacaoData;
            e.lineup_json = Object.fromEntries(Object.entries(e.lineup_json ?? {}).map(([k, v]) => [k, v ?? null]));
            setEscalacao(e);
          }
          setIsLoading(false); return;
        }
      } catch { /* fallback */ }
      // 2. Query direta — não depende de is_public nem da RPC
      try {
        const [{ data: u }, { data: esc }] = await Promise.all([
          supabase.from('tigre_fc_usuarios')
            .select('id, display_name, apelido, avatar_url, xp, nivel, pontos_total, streak, bio')
            .eq('id', targetId).maybeSingle(),
          supabase.from('tigre_fc_escalacoes')
            .select('formacao, lineup_json, capitan_id, heroi_id, updated_at')
            .eq('usuario_id', targetId)
            .order('updated_at', { ascending: false }).limit(1).maybeSingle(),
        ]);
        if (!alive) return;
        if (!u) { setError('Torcedor não encontrado.'); setIsLoading(false); return; }
        setPerfil(u as Perfil);
        if (esc) {
          const safe = Object.fromEntries(Object.entries((esc.lineup_json as object) ?? {}).map(([k, v]) => [k, v ?? null]));
          setEscalacao({ ...esc, lineup_json: safe as Record<string, Player | null> });
        }
      } catch { if (alive) setError('Erro ao carregar perfil.'); }
      finally { if (alive) setIsLoading(false); }
    }
    load();
    return () => { alive = false; };
  }, [targetId, supabase]);

  const handleCorneta = useCallback(() => {
    setCornetaIdx(Math.floor(Math.random() * CORNETAS.length));
    setTimeout(() => setCornetaIdx(null), 3500);
  }, []);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/tigre-fc`;
    if (navigator.share) { await navigator.share({ title: `Time de ${perfil?.display_name} — Tigre FC`, url }); }
    else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2500); }
  }, [perfil]);

  if (!targetId) return null;
  const nivelCor = NIVEL_CORES[perfil?.nivel ?? 'Novato'];

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        onClick={e => { if (e.target === e.currentTarget) onClose?.(); }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{ width: '100%', maxWidth: 480, background: 'linear-gradient(160deg, #090909 0%, #0f0f0a 100%)', borderRadius: '24px 24px 0 0', borderTop: '1px solid rgba(245,196,0,0.2)', maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.5), transparent)' }} />
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
            <div style={{ width: 36, height: 4, background: '#222', borderRadius: 2 }} />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 9, fontWeight: 900, color: '#333', textTransform: 'uppercase', letterSpacing: 2 }}>
                {isOwn ? '⚽ Meu Time' : '🔍 Time do Rival'}
              </span>
              {onClose && (
                <button onClick={onClose} style={{ background: '#1a1a1a', border: '1px solid #222', color: '#555', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>×</button>
              )}
            </div>

            {isLoading && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #1a1a1a', borderTop: '3px solid #F5C400', borderRadius: '50%', margin: '0 auto 12px', animation: 'tigrefc-spin 0.8s linear infinite' }} />
                <style>{`@keyframes tigrefc-spin { to { transform: rotate(360deg) } }`}</style>
                <div style={{ fontSize: 12, color: '#2a2a2a', fontWeight: 700 }}>Carregando perfil...</div>
              </div>
            )}

            {!isLoading && error && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🐯</div>
                <div style={{ fontSize: 14, color: '#333', fontWeight: 700 }}>{error}</div>
              </div>
            )}

            {!isLoading && !error && perfil && (
              <>
                {/* Perfil header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20, padding: '14px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: 18, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 54, height: 54, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${nivelCor}`, background: `${nivelCor}20`, boxShadow: `0 0 16px ${nivelCor}30`, flexShrink: 0 }}>
                    {perfil.avatar_url ? (
                      <img src={perfil.avatar_url} alt={perfil.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                        {NIVEL_ICONES[perfil.nivel ?? 'Novato']}
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.3, lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {perfil.apelido ?? perfil.display_name}
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, color: nivelCor, fontWeight: 800 }}>{NIVEL_ICONES[perfil.nivel ?? 'Novato']} {perfil.nivel ?? 'Novato'}</span>
                      {(perfil.xp ?? 0) > 0 && <span style={{ fontSize: 10, color: '#F5C400', fontWeight: 700 }}>{perfil.xp} XP</span>}
                      {(perfil.pontos_total ?? 0) > 0 && <span style={{ fontSize: 10, color: '#555', fontWeight: 700 }}>{perfil.pontos_total} pts</span>}
                      {(perfil.streak ?? 0) > 1 && <span style={{ fontSize: 10, color: '#F97316', fontWeight: 700 }}>🔥 {perfil.streak}x</span>}
                    </div>
                    {perfil.bio && <div style={{ fontSize: 11, color: '#444', marginTop: 4, lineHeight: 1.4 }}>{perfil.bio}</div>}
                  </div>
                  <img src={ESCUDO} alt="" style={{ width: 26, height: 26, objectFit: 'contain', opacity: 0.3 }} />
                </div>

                {/* Campo */}
                <CampoVisual formacao={escalacao?.formacao ?? '4-2-3-1'} lineup={escalacao?.lineup_json ?? {}} captainId={escalacao?.capitan_id} />

                {escalacao?.updated_at && (
                  <div style={{ textAlign: 'center', marginTop: 8, fontSize: 9, color: '#222', fontWeight: 700 }}>
                    Atualizado {new Date(escalacao.updated_at).toLocaleDateString('pt-BR')}
                  </div>
                )}

                {/* Ações */}
                {!isOwn ? (
                  <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                    <motion.button whileTap={{ scale: 0.93 }} onClick={handleCorneta}
                      style={{ flex: 1, padding: '15px', background: 'linear-gradient(135deg, #EF4444, #B91C1C)', border: 'none', borderRadius: 16, color: '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', boxShadow: '0 4px 16px rgba(239,68,68,0.3)' }}>
                      🎺 Corneta!
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.93 }} onClick={handleShare}
                      style={{ flex: 1, padding: '15px', background: '#111', border: '1px solid #222', borderRadius: 16, color: copied ? '#22C55E' : '#fff', fontSize: 12, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}>
                      {copied ? '✓ Copiado' : '📤 Compartilhar'}
                    </motion.button>
                  </div>
                ) : (
                  <motion.button whileTap={{ scale: 0.95 }} onClick={handleShare}
                    style={{ marginTop: 16, width: '100%', padding: '16px', background: 'linear-gradient(135deg, #F5C400, #D4A200)', border: 'none', borderRadius: 16, color: '#000', fontSize: 12, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {copied ? '✓ Link copiado!' : '🔗 Compartilhar meu time'}
                  </motion.button>
                )}

                {/* Toast corneta */}
                <AnimatePresence>
                  {cornetaIdx !== null && (
                    <motion.div initial={{ opacity: 0, y: 16, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.9 }}
                      style={{ marginTop: 12, padding: '16px', background: 'linear-gradient(135deg, rgba(239,68,68,0.1), #0f0f0f)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 16, textAlign: 'center' }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>{CORNETAS[cornetaIdx].emoji}</div>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#EF4444', textTransform: 'uppercase' }}>{CORNETAS[cornetaIdx].msg}</div>
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
