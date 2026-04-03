'use client';

/**
 * TigreFCPerfilPublico v3 — O Card da Fama
 *
 * - Card de compartilhamento renderizado com html2canvas (obra de arte)
 * - Campo realista com lineup completo no card
 * - Botão de share neon ultra-brilhante
 * - Suporte a Web Share API (mobile) + download (desktop)
 * - Props duais: aceita usuarioId/meuId/onClose E targetUsuarioId/viewerUsuarioId
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import confetti from 'canvas-confetti';

// ─── Assets ──────────────────────────────────────────────────────────────────

const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const PATA_LOGO    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── Níveis ───────────────────────────────────────────────────────────────────

const NIVEL_CORES: Record<string, string> = {
  Bronze: '#CD7F32', Prata: '#C0C0C0', Ouro: '#F5C400', Platina: '#E5E4E2',
  Diamante: '#00F3FF', Mestre: '#9D4EDD', Lenda: '#FF0054',
  Novato: '#71717A', Torcedor: '#3B82F6', Fiel: '#F5C400', Fanático: '#EF4444',
};
const NIVEL_ICONES: Record<string, string> = {
  Bronze: '🥉', Prata: '🥈', Ouro: '🥇', Platina: '💎',
  Diamante: '💠', Mestre: '🔮', Lenda: '👑',
  Novato: '🌱', Torcedor: '👟', Fiel: '🏆', Fanático: '🔥',
};

const POS_CORES: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#3B82F6', LAT: '#06B6D4', MEI: '#22C55E', ATA: '#EF4444',
};

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Player = { id: number; short: string; pos: string; foto: string; num: number };
type Slot   = { id: string; x: number; y: number; pos: string };

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 57, pos: 'MEI' }, { id: 'dm2', x: 65, y: 57, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' }, { id: 'rw', x: 80, y: 27, pos: 'ATA' }, { id: 'lw', x: 20, y: 27, pos: 'ATA' },
    { id: 'st', x: 50, y: 13, pos: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 85, pos: 'GOL' },
    { id: 'rb', x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb', x: 18, y: 65, pos: 'LAT' },
    { id: 'm1', x: 50, y: 50, pos: 'MEI' }, { id: 'm2', x: 75, y: 42, pos: 'MEI' }, { id: 'm3', x: 25, y: 42, pos: 'MEI' },
    { id: 'st', x: 50, y: 13, pos: 'ATA' }, { id: 'rw', x: 80, y: 20, pos: 'ATA' }, { id: 'lw', x: 20, y: 20, pos: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 85, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 15, y: 68, pos: 'LAT' },
    { id: 'm1', x: 20, y: 48, pos: 'MEI' }, { id: 'm2', x: 40, y: 48, pos: 'MEI' }, { id: 'm3', x: 60, y: 48, pos: 'MEI' }, { id: 'm4', x: 80, y: 48, pos: 'MEI' },
    { id: 'st1', x: 35, y: 18, pos: 'ATA' }, { id: 'st2', x: 65, y: 18, pos: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 75, y: 72, pos: 'ZAG' }, { id: 'cb3', x: 25, y: 72, pos: 'ZAG' },
    { id: 'm1', x: 50, y: 52, pos: 'MEI' }, { id: 'm2', x: 25, y: 46, pos: 'MEI' }, { id: 'm3', x: 75, y: 46, pos: 'MEI' }, { id: 'm4', x: 10, y: 38, pos: 'MEI' }, { id: 'm5', x: 90, y: 38, pos: 'MEI' },
    { id: 'st1', x: 38, y: 18, pos: 'ATA' }, { id: 'st2', x: 62, y: 18, pos: 'ATA' },
  ],
  '5-4-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'cb1', x: 50, y: 78, pos: 'ZAG' }, { id: 'cb2', x: 70, y: 75, pos: 'ZAG' }, { id: 'cb3', x: 30, y: 75, pos: 'ZAG' }, { id: 'rb', x: 88, y: 68, pos: 'LAT' }, { id: 'lb', x: 12, y: 68, pos: 'LAT' },
    { id: 'm1', x: 35, y: 48, pos: 'MEI' }, { id: 'm2', x: 65, y: 48, pos: 'MEI' }, { id: 'm3', x: 15, y: 40, pos: 'MEI' }, { id: 'm4', x: 85, y: 40, pos: 'MEI' },
    { id: 'st', x: 50, y: 18, pos: 'ATA' },
  ],
};

const CORNETAS = [
  '📯 Essa escalação tá de chorar! 😂',
  '🔥 Minha avó escala melhor que isso!',
  '⚡ Aposta aí que eu ganho de vocês!',
  '🦁 Pelada de domingo, isso!',
  '👑 Copiou meu esquema e ainda errou!',
  '🏆 Não ganha nem no videogame!',
  '😂 Escalando com os olhos fechados?',
  '🎯 Isso é chute no escuro!',
];

// ─── Mini Campo para o Card de Compartilhamento ───────────────────────────────
// Versão flat (sem perspectiva 3D) para o html2canvas capturar corretamente

function MiniCampoShare({
  slots, lineup, captainId, heroId,
}: { slots: Slot[]; lineup: Record<string, Player>; captainId: number | null; heroId: number | null }) {
  return (
    <div style={{
      position: 'relative', width: '100%', paddingBottom: '120%',
      background: '#1a5218', borderRadius: 12, overflow: 'hidden',
      border: '2px solid rgba(255,255,255,0.15)',
    }}>
      {/* Listras */}
      {[...Array(10)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute', left: 0, right: 0,
          top: `${i * 10}%`, height: '10%',
          background: i % 2 === 0 ? '#1f6b1d' : 'transparent',
        }} />
      ))}
      {/* Linhas */}
      <div style={{ position: 'absolute', inset: 10, border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 4 }} />
      <div style={{ position: 'absolute', top: '50%', left: 10, right: 10, height: 1.5, background: 'rgba(255,255,255,0.5)' }} />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 64, height: 64, border: '1.5px solid rgba(255,255,255,0.5)',
        borderRadius: '50%', transform: 'translate(-50%, -50%)',
      }} />
      {/* Marca d'água */}
      <img src={PATA_LOGO} style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 50, height: 50, objectFit: 'contain', opacity: 0.06,
        filter: 'brightness(10) saturate(0)',
      }} alt="" />
      {/* Iluminação */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,220,0.06) 0%, transparent 60%)',
      }} />

      {/* Jogadores */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {slots.map(slot => {
          const p = lineup[slot.id];
          if (!p) return (
            <div key={slot.id} style={{
              position: 'absolute',
              left: `${slot.x}%`, top: `${slot.y}%`,
              transform: 'translate(-50%, -50%)',
              width: 28, height: 36,
              border: '1px dashed rgba(255,255,255,0.15)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.2)', fontWeight: 900 }}>{slot.pos}</span>
            </div>
          );

          const isCap  = p.id === captainId;
          const isHero = p.id === heroId;
          const posColor = POS_CORES[p.pos] ?? '#888';

          return (
            <div key={slot.id} style={{
              position: 'absolute',
              left: `${slot.x}%`, top: `${slot.y}%`,
              transform: 'translate(-50%, -50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              zIndex: 10,
            }}>
              <div style={{
                position: 'relative',
                width: 32, height: 42,
                borderRadius: 6, overflow: 'hidden',
                border: `2px solid ${isCap ? '#F5C400' : isHero ? '#00F3FF' : posColor}`,
                boxShadow: isCap
                  ? '0 0 8px rgba(245,196,0,0.8)'
                  : isHero
                  ? '0 0 8px rgba(0,243,255,0.8)'
                  : `0 0 4px ${posColor}66`,
                background: '#000',
              }}>
                <img src={p.foto} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} alt={p.short} />
                {/* Badge C ou H */}
                {(isCap || isHero) && (
                  <div style={{
                    position: 'absolute', top: 1, right: 1,
                    width: 10, height: 10, borderRadius: '50%',
                    background: isCap ? '#F5C400' : '#00F3FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 5, fontWeight: 900, color: '#000' }}>{isCap ? 'C' : 'H'}</span>
                  </div>
                )}
                {/* Nome */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'rgba(0,0,0,0.88)', textAlign: 'center', padding: '1px 1px',
                }}>
                  <span style={{ fontSize: 5.5, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {p.short}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card Capturável (O que vira imagem) ─────────────────────────────────────

const ShareCard = React.forwardRef<HTMLDivElement, {
  dados: any; slots: Slot[]; lineup: Record<string, Player>;
}>(({ dados, slots, lineup }, ref) => {
  const perfil   = dados.tigre_fc_usuarios ?? {};
  const nivelCor = NIVEL_CORES[perfil.nivel ?? 'Novato'] ?? '#71717A';

  return (
    <div
      ref={ref}
      style={{
        width: 360,
        background: '#09090b',
        borderRadius: 24,
        overflow: 'hidden',
        border: '2px solid rgba(245,196,0,0.3)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}
    >
      {/* Linha topo dourada */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #F5C400, transparent)' }} />

      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        background: 'linear-gradient(180deg, rgba(245,196,0,0.08) 0%, transparent 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img src={ESCUDO_TIGRE} style={{ width: 36, height: 36, objectFit: 'contain' }} alt="Tigre" />
          <div>
            <div style={{ color: '#F5C400', fontSize: 16, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1 }}>
              Tigre FC
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 2 }}>
              Minha Escalação
            </div>
          </div>
        </div>

        {/* Avatar + Nome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#fff', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              {perfil.display_name ?? 'Torcedor'}
            </div>
            <div style={{ color: nivelCor, fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              {NIVEL_ICONES[perfil.nivel ?? 'Novato']} {perfil.nivel ?? 'Novato'}
            </div>
          </div>
          <img
            src={perfil.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(perfil.display_name ?? 'tigre')}`}
            style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid ${nivelCor}`, objectFit: 'cover' }}
            alt=""
          />
        </div>
      </div>

      {/* Formação badge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{
          background: 'rgba(245,196,0,0.1)', border: '1px solid rgba(245,196,0,0.3)',
          borderRadius: 20, padding: '3px 12px',
          color: '#F5C400', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em',
        }}>
          {dados.formacao ?? '4-2-3-1'}
        </div>
      </div>

      {/* CAMPO */}
      <div style={{ padding: '0 16px 12px' }}>
        <MiniCampoShare
          slots={slots}
          lineup={lineup}
          captainId={dados.capitan_id}
          heroId={dados.heroi_id}
        />
      </div>

      {/* PLACAR */}
      {dados.score_locked && (
        <div style={{
          margin: '0 16px 16px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16, padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ textAlign: 'center' }}>
            <img src={ESCUDO_TIGRE} style={{ width: 28, height: 28, objectFit: 'contain', marginBottom: 4 }} alt="Tigre" />
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Novorizontino</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 42, fontWeight: 900, fontStyle: 'italic', color: '#F5C400', letterSpacing: '-0.04em', textShadow: '0 0 20px rgba(245,196,0,0.5)', lineHeight: 1 }}>
              {dados.score_tigre}
            </span>
            <span style={{ fontSize: 18, fontWeight: 900, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>:</span>
            <span style={{ fontSize: 42, fontWeight: 900, fontStyle: 'italic', color: 'rgba(255,255,255,0.3)', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {dados.score_adv}
            </span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4,
            }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>?</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Adversário</div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <div style={{
        padding: '8px 20px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderTop: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <img src={PATA_LOGO} style={{ width: 14, height: 14, objectFit: 'contain', opacity: 0.4, filter: 'brightness(10) saturate(0)' }} alt="" />
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
            onovorizontino.com.br
          </span>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 7, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          #TigreFC
        </span>
      </div>

      {/* Linha base dourada */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #F5C400, transparent)' }} />
    </div>
  );
});
ShareCard.displayName = 'ShareCard';

// ─── Componente Principal ─────────────────────────────────────────────────────

interface PerfilPublicoProps {
  usuarioId?: string;
  meuId?: string | null;
  jogoId?: number;
  onClose?: () => void;
  targetUsuarioId?: string;
  targetUserId?: string;
  viewerUsuarioId?: string | null;
}

export default function TigreFCPerfilPublico({
  usuarioId, meuId, jogoId, onClose,
  targetUsuarioId, targetUserId, viewerUsuarioId,
}: PerfilPublicoProps) {

  const resolvedTargetId = usuarioId ?? targetUsuarioId ?? targetUserId ?? '';
  const resolvedViewerId = meuId ?? viewerUsuarioId ?? null;
  const isSelfView       = !!resolvedViewerId && resolvedViewerId === resolvedTargetId;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const shareCardRef = useRef<HTMLDivElement>(null);

  const [dados,         setDados]         = useState<any>(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [corneta,       setCorneta]       = useState<string | null>(null);
  const [cornetaCount,  setCornetaCount]  = useState(0);
  const [isSharing,     setIsSharing]     = useState(false);
  const [shareSuccess,  setShareSuccess]  = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);

  useEffect(() => {
    if (!resolvedTargetId) return;
    let mounted = true;

    async function load() {
      setIsLoading(true);
      const { data } = await supabase
        .from('tigre_fc_escalacoes')
        .select(`
          formacao, lineup_json, capitan_id, heroi_id,
          score_tigre, score_adv, score_locked, updated_at,
          tigre_fc_usuarios ( display_name, avatar_url, xp, nivel )
        `)
        .eq('usuario_id', resolvedTargetId)
        .maybeSingle();

      if (mounted) { setDados(data ?? null); setIsLoading(false); }
    }

    load();
    return () => { mounted = false; };
  }, [resolvedTargetId]); // eslint-disable-line

  const dispararCorneta = useCallback(() => {
    setCorneta(CORNETAS[Math.floor(Math.random() * CORNETAS.length)]);
    setCornetaCount(c => c + 1);
    setTimeout(() => setCorneta(null), 3500);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 }, colors: ['#F5C400', '#00F3FF', '#fff'] });
  }, []);

  // Compartilhamento via html2canvas
  const handleShare = useCallback(async () => {
    if (!shareCardRef.current || !dados) return;
    setIsSharing(true);

    try {
      // Import dinâmico para não quebrar SSR
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(shareCardRef.current, {
        useCORS:         true,
        scale:           3,          // 3x para qualidade Instagram
        backgroundColor: '#09090b',
        logging:         false,
        allowTaint:      true,
      });

      const blob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png', 1.0));
      if (!blob) return;

      const perfil = dados.tigre_fc_usuarios ?? {};
      const file   = new File([blob], 'tigre-fc-escalacao.png', { type: 'image/png' });
      const text   = `Minha escalação pro próximo jogo do Tigre FC! 🐯⚽ Palpite: ${dados.score_tigre ?? 0}x${dados.score_adv ?? 0} #TigreFC #Novorizontino`;

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Tigre FC — Minha Escalação', text });
      } else {
        // Fallback: download direto
        const url  = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href     = url;
        link.download = `tigre-fc-escalacao-${perfil.display_name ?? 'meu-time'}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }

      setShareSuccess(true);
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#F5C400', '#22C55E', '#fff', '#00F3FF'] });
      setTimeout(() => setShareSuccess(false), 4000);
    } catch (err) {
      console.error('Erro ao gerar card:', err);
    } finally {
      setIsSharing(false);
    }
  }, [dados]);

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) return (
    <div className="flex items-center justify-center h-80 bg-black rounded-[2rem] border border-zinc-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Buscando escalação...</p>
      </div>
    </div>
  );

  if (!dados) return (
    <div className="flex flex-col items-center justify-center h-64 bg-zinc-950 rounded-[2rem] border border-zinc-900 p-8 text-center gap-3">
      <span className="text-4xl">⚽</span>
      <p className="text-zinc-500 font-black uppercase tracking-tighter italic text-sm">Este torcedor ainda não escalou o Tigre!</p>
      {onClose && (
        <button onClick={onClose} className="text-zinc-600 text-xs hover:text-white transition mt-2 font-bold uppercase tracking-widest">
          Fechar
        </button>
      )}
    </div>
  );

  const perfil    = dados.tigre_fc_usuarios ?? {};
  const nivelCor  = NIVEL_CORES[perfil.nivel ?? 'Novato'] ?? '#71717A';
  const nivelIcon = NIVEL_ICONES[perfil.nivel ?? 'Novato'] ?? '🌱';
  const slots     = FORMATIONS[dados.formacao] ?? FORMATIONS['4-2-3-1'];
  const lineup    = (dados.lineup_json ?? {}) as Record<string, Player>;
  const escalados = slots.filter(s => lineup[s.id]).length;

  return (
    <div className="relative bg-black rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl">

      {/* Linha topo dourada */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

      {/* Fechar */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-white transition text-lg"
        >✕</button>
      )}

      {/* ── HEADER ── */}
      <div className="p-5 border-b border-zinc-900 bg-gradient-to-b from-zinc-900 to-black flex items-center gap-4">
        <div className="relative shrink-0">
          <img
            src={perfil.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(perfil.display_name ?? 'tigre')}`}
            className="w-14 h-14 rounded-full border-2 object-cover"
            style={{ borderColor: nivelCor, boxShadow: `0 0 14px ${nivelCor}44` }}
            alt={perfil.display_name}
          />
          <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-0.5 text-xs border border-white/10">{nivelIcon}</div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-black italic uppercase tracking-tighter text-white truncate">
              {perfil.display_name ?? 'Torcedor'}
            </h2>
            {isSelfView && (
              <span className="text-[8px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black uppercase shrink-0">VOCÊ</span>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: nivelCor }}>
            {perfil.nivel ?? 'Novato'} · {perfil.xp ?? 0} XP
          </p>
          <p className="text-zinc-700 text-[9px] mt-0.5 font-medium">{escalados}/11 · {dados.formacao ?? '4-2-3-1'}</p>
        </div>

        {dados.score_locked && (
          <div className="text-right shrink-0">
            <p className="text-[8px] text-zinc-600 font-black uppercase mb-1">Palpite</p>
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black italic text-yellow-500">{dados.score_tigre}</span>
              <span className="text-zinc-700 font-black text-sm">x</span>
              <span className="text-2xl font-black italic text-zinc-400">{dados.score_adv}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── CAMPO INTERATIVO (visualização) ── */}
      <div className="p-4">
        <div className="relative w-full aspect-[1/1.15] rounded-2xl overflow-hidden bg-[#1a5218] border border-white/5">
          <div className="absolute inset-0 opacity-15 bg-repeat" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-dotted-2.png')` }} />
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`absolute w-full ${i % 2 === 0 ? 'bg-[#1f6b1d]/70' : ''}`} style={{ height: '12.5%', top: `${i * 12.5}%` }} />
          ))}
          <div className="absolute inset-4 border border-white/20 rounded" />
          <div className="absolute top-1/2 left-4 right-4 h-px bg-white/20" />
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <img src={PATA_LOGO} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 object-contain opacity-[0.06]" style={{ filter: 'brightness(10) saturate(0)' }} alt="" />

          {slots.map(slot => {
            const p = lineup[slot.id];
            if (!p) return (
              <div key={slot.id} className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-10 rounded border border-dashed border-white/10 flex items-center justify-center"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
                <span className="text-[5px] font-bold" style={{ color: POS_CORES[slot.pos] ?? '#555' }}>{slot.pos}</span>
              </div>
            );
            const isCap  = p.id === dados.capitan_id;
            const isHero = p.id === dados.heroi_id;
            return (
              <motion.div key={slot.id} whileHover={{ scale: 1.15, zIndex: 50 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              >
                <div className="relative w-9 h-12 rounded-md overflow-hidden border-2"
                  style={{
                    borderColor: isCap ? '#F5C400' : isHero ? '#00F3FF' : POS_CORES[p.pos] ?? '#555',
                    boxShadow: isCap ? '0 0 8px rgba(245,196,0,0.7)' : isHero ? '0 0 8px rgba(0,243,255,0.7)' : undefined,
                  }}
                >
                  <img src={p.foto} className="w-full h-full object-cover object-top" alt={p.short} />
                  {(isCap || isHero) && (
                    <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ background: isCap ? '#F5C400' : '#00F3FF' }}>
                      <span className="text-black text-[6px] font-black">{isCap ? 'C' : 'H'}</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 w-full bg-black/90 text-center py-[1px]">
                    <span className="text-white text-[5.5px] font-black uppercase truncate block px-0.5">{p.short}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── BOTÃO COMPARTILHAR (O MAIS BRILHANTE DA PÁGINA) ── */}
      <div className="px-4 pb-2">
        <motion.button
          onClick={() => { setShowShareCard(true); setTimeout(handleShare, 100); }}
          disabled={isSharing}
          whileTap={{ scale: 0.96 }}
          animate={!isSharing && !shareSuccess ? {
            boxShadow: ['0 0 20px rgba(245,196,0,0.3)', '0 0 40px rgba(245,196,0,0.6)', '0 0 20px rgba(245,196,0,0.3)'],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative w-full py-4 rounded-2xl overflow-hidden font-black text-sm uppercase tracking-widest transition-all"
          style={{
            background: shareSuccess
              ? 'linear-gradient(135deg, #22C55E, #16A34A)'
              : 'linear-gradient(135deg, #F5C400, #D97706)',
            color: '#000',
            boxShadow: shareSuccess
              ? '0 0 30px rgba(34,197,94,0.5)'
              : '0 0 25px rgba(245,196,0,0.4)',
          }}
        >
          {/* Shimmer */}
          {!isSharing && (
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
            />
          )}

          <span className="relative flex items-center justify-center gap-2">
            {isSharing ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Gerando card...
              </>
            ) : shareSuccess ? (
              '✓ Card Compartilhado!'
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartilhar Escalação
              </>
            )}
          </span>
        </motion.button>
      </div>

      {/* ── CORNETA (outros usuários) ── */}
      {!isSelfView && (
        <div className="px-4 pb-5">
          <button
            onClick={dispararCorneta}
            className="w-full py-3 bg-zinc-950 border border-zinc-800 rounded-xl font-black text-xs uppercase italic tracking-widest text-zinc-500 hover:text-yellow-500 hover:border-yellow-500/40 transition-all active:scale-95"
          >
            📯 Cornetar {cornetaCount > 0 && `(${cornetaCount})`}
          </button>
          <AnimatePresence>
            {corneta && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}
                className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center"
              >
                <p className="text-yellow-400 text-xs font-black italic">{corneta}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── CARD OCULTO PARA CAPTURA (fora da viewport mas no DOM) ── */}
      <div className="fixed" style={{ left: '-9999px', top: 0, zIndex: -1 }}>
        <ShareCard ref={shareCardRef} dados={dados} slots={slots} lineup={lineup} />
      </div>

      {/* Branding */}
      <div className="absolute bottom-2 right-4 flex items-center gap-1 opacity-20 pointer-events-none">
        <img src={PATA_LOGO} className="w-3 h-3 grayscale object-contain" alt="" />
        <span className="text-[7px] font-black uppercase tracking-tighter">Tigre FC</span>
      </div>
    </div>
  );
}
