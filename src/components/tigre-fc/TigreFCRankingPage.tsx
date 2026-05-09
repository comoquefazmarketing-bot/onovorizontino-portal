'use client';

/**
 * TigreFCRankingPage — Ranking AAA cinematográfico
 *
 * Efeitos:
 * - Pódio 3D: 1º lugar com foco cinematic, bloom, partículas orbitando
 * - Depth-of-field por posição: filas distantes ficam mais opacas e suaves
 * - Entry animation em cascata (stagger)
 * - Background animado: gradiente radial pulsante + grid
 * - Linha de posição colore por medal (ouro/prata/bronze)
 * - Scan line LED no header
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

const GOLD  = '#F5C400';
const CYAN  = '#00F3FF';
const PATA  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const FONT  = "'Barlow Condensed', system-ui, sans-serif";

type Usuario = {
  id: string;
  nome: string | null;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number | null;
  nivel: string | null;
};

const NIVEL_COLOR: Record<string, string> = {
  Recruta: 'rgba(255,255,255,0.3)', Torcedor: GOLD,
  Fanático: CYAN, Ultras: '#4FC3F7', Fiel: GOLD, Comandante: '#BF5FFF',
};
const nivelColor = (n: string | null) => NIVEL_COLOR[n ?? ''] ?? 'rgba(255,255,255,0.3)';

// ── Avatar ─────────────────────────────────────────────────────────────────
function RankAvatar({ src, nome, nivel, size = 48 }: { src?: string | null; nome: string; nivel?: string | null; size?: number }) {
  const color = nivelColor(nivel ?? '');
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: 12, overflow: 'hidden',
        border: `2px solid ${color}55`,
        boxShadow: nivel === 'Comandante' ? '0 0 14px #BF5FFF55' : `0 0 8px ${color}22`,
      }}>
        <img src={src ?? PATA} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }} />
      </div>
      {nivel && nivel !== 'Recruta' && (
        <div style={{
          position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
          padding: '1px 5px', borderRadius: 4,
          background: color === GOLD ? GOLD : color,
          color: [GOLD, CYAN].includes(color) ? '#000' : '#fff',
          fontSize: 7, fontWeight: 900, letterSpacing: 0.5,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>{nivel}</div>
      )}
    </div>
  );
}

// ── Card do pódio cinematográfico ────────────────────────────────────────────
function PodiumCard({ user, rank, onClick }: { user: Usuario; rank: 1|2|3; onClick: () => void }) {
  const name = user.apelido ?? user.nome ?? 'TORCEDOR';
  const pts  = user.pontos_total ?? 0;

  const cfg = {
    1: { size: 80, pedestalH: 100, color: GOLD,      emoji: '👑', delay: 0.1, scale: 1.08 },
    2: { size: 62, pedestalH: 70,  color: '#C0C0C0', emoji: '🥈', delay: 0.2, scale: 1.0  },
    3: { size: 56, pedestalH: 50,  color: '#CD7F32', emoji: '🥉', delay: 0.3, scale: 1.0  },
  }[rank];

  return (
    <motion.button
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: cfg.scale }}
      transition={{ type: 'spring', stiffness: 280, damping: 22, delay: cfg.delay }}
      whileHover={{ scale: cfg.scale + 0.04, y: -4 }}
      whileTap={{ scale: cfg.scale - 0.03 }}
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 6, cursor: 'pointer', background: 'none', border: 'none',
        fontFamily: FONT, position: 'relative',
      }}
    >
      <span style={{ fontSize: rank === 1 ? 24 : 18 }}>{cfg.emoji}</span>

      {/* Avatar com halo pulsante no 1º */}
      <div style={{ position: 'relative' }}>
        {rank === 1 && (
          <>
            <motion.div
              animate={{ scale: [1, 1.22, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: 'absolute', inset: -12, borderRadius: '50%',
                background: `radial-gradient(circle, ${GOLD}55, transparent 70%)`,
                pointerEvents: 'none',
              }}
            />
            {/* Partículas orbitando 1º lugar */}
            {[0,1,2,3,4].map(i => (
              <motion.div key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
                style={{
                  position: 'absolute', inset: -16,
                  pointerEvents: 'none',
                }}
              >
                <div style={{
                  position: 'absolute',
                  width: i % 2 === 0 ? 4 : 3,
                  height: i % 2 === 0 ? 4 : 3,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? GOLD : CYAN,
                  top: `${50 - 46}%`,
                  left: `${50 + 40 * Math.cos((i / 5) * Math.PI * 2)}%`,
                  boxShadow: `0 0 8px ${i % 2 === 0 ? GOLD : CYAN}`,
                }} />
              </motion.div>
            ))}
          </>
        )}

        <div style={{
          width: cfg.size, height: cfg.size, borderRadius: 18, overflow: 'hidden',
          border: `3px solid ${cfg.color}`,
          boxShadow: rank === 1
            ? `0 0 30px ${GOLD}80, 0 0 60px ${GOLD}30, 0 8px 20px rgba(0,0,0,0.8)`
            : `0 0 12px ${cfg.color}40, 0 4px 12px rgba(0,0,0,0.6)`,
        }}>
          <img src={user.avatar_url ?? PATA} alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }} />
        </div>

        <div style={{
          position: 'absolute', top: -8, right: -8,
          width: 22, height: 22, borderRadius: '50%',
          background: cfg.color, color: '#000',
          fontSize: 11, fontWeight: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 10px ${cfg.color}80`,
        }}>{rank}</div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: rank === 1 ? 26 : 20, fontWeight: 900, fontStyle: 'italic',
          color: cfg.color, lineHeight: 1,
          textShadow: `0 0 16px ${cfg.color}70`,
        }}>{pts}</div>
        <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontWeight: 800, letterSpacing: 2 }}>PTS</div>
        <div style={{
          fontSize: 11, fontWeight: 900, color: '#fff',
          textTransform: 'uppercase', marginTop: 2,
          maxWidth: 76, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{name}</div>
      </div>

      {/* Pedestal */}
      <div style={{
        width: '100%', minWidth: 76, height: cfg.pedestalH, borderRadius: '10px 10px 0 0',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 6,
        background: rank === 1
          ? `linear-gradient(180deg, rgba(245,196,0,0.18) 0%, rgba(245,196,0,0.06) 100%)`
          : `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)`,
        border: `1px solid ${cfg.color}28`,
        borderBottom: 'none',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Shimmer no pedestal */}
        <div style={{
          position: 'absolute', top: 0, left: '-60%', width: '40%', height: '100%',
          background: `linear-gradient(90deg, transparent, ${cfg.color}12, transparent)`,
          animation: `pedestalShimmer ${2 + rank * 0.3}s ease-in-out infinite`,
        }} />
        <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: 3, color: `${cfg.color}45` }}>#{rank}</span>
      </div>
    </motion.button>
  );
}

// ── Linha do ranking com depth-of-field ─────────────────────────────────────
function RankRow({ user, rank, isMe, onView }: { user: Usuario; rank: number; isMe: boolean; onView: () => void }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rowRef, { once: true, margin: '-40px' });
  const name   = user.apelido ?? user.nome ?? 'TORCEDOR';
  const pts    = user.pontos_total ?? 0;

  // Depth-of-field: quanto mais longe do top, mais opaco/suave
  const depthOpacity = Math.max(0.45, 1 - (rank - 4) * 0.012);
  const depthScale   = Math.max(0.96, 1 - (rank - 4) * 0.002);

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, x: -20, scale: 0.97 }}
      animate={inView ? { opacity: depthOpacity, x: 0, scale: depthScale } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 28, delay: Math.min((rank - 4) * 0.035, 0.8) }}
      whileHover={{ opacity: 1, scale: 1, x: 4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onView}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px', borderRadius: 16, cursor: 'pointer',
        background: isMe
          ? `linear-gradient(90deg, rgba(245,196,0,0.12), rgba(245,196,0,0.04))`
          : 'rgba(255,255,255,0.025)',
        border: isMe ? `1px solid rgba(245,196,0,0.35)` : '1px solid rgba(255,255,255,0.04)',
        boxShadow: isMe ? `0 0 20px rgba(245,196,0,0.1)` : 'none',
        fontFamily: FONT,
        transition: 'background 0.2s',
      }}
    >
      {/* Número */}
      <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 900, fontStyle: 'italic', color: '#2a2a2a' }}>#{rank}</span>
      </div>

      <RankAvatar src={user.avatar_url} nome={name} nivel={user.nivel} size={36} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontWeight: 900, fontSize: 13, textTransform: 'uppercase',
          color: isMe ? GOLD : '#fff',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {name}
          {isMe && <span style={{ marginLeft: 6, fontSize: 7, letterSpacing: 1, opacity: 0.5 }}>VOCÊ</span>}
        </div>
        {user.nivel && (
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1.5, color: nivelColor(user.nivel) }}>
            {user.nivel.toUpperCase()}
          </div>
        )}
      </div>

      {/* Pontos */}
      <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 4 }}>
        <div style={{
          fontSize: 18, fontWeight: 900, fontStyle: 'italic', lineHeight: 1,
          color: isMe ? GOLD : '#fff',
          textShadow: isMe ? `0 0 12px ${GOLD}60` : 'none',
        }}>{pts}</div>
        <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', fontWeight: 700, letterSpacing: 1.5 }}>PTS</div>
      </div>

      <div style={{
        flexShrink: 0, width: 28, height: 28, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </motion.div>
  );
}

// ── Página principal ─────────────────────────────────────────────────────────
export default function TigreFCRankingPage() {
  const [usuarios,   setUsuarios]   = useState<Usuario[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [meuTfcId,   setMeuTfcId]   = useState<string | null>(null);
  const [jogoRodada, setJogoRodada] = useState<string | null>(null);
  const [perfil,     setPerfil]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: tfcu } = await supabase
          .from('tigre_fc_usuarios').select('id').eq('google_id', user.id).maybeSingle();
        if (!cancelled && tfcu) setMeuTfcId(tfcu.id);
      }
      const { data: rank } = await supabase
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total, nivel')
        .order('pontos_total', { ascending: false })
        .limit(100);
      if (!cancelled && rank) setUsuarios(rank as Usuario[]);
      fetch('/api/proximo-jogo')
        .then(r => r.json())
        .then(d => { if (!cancelled && d?.jogos?.[0]?.rodada) setJogoRodada(d.jogos[0].rodada); })
        .catch(() => {});
      if (!cancelled) setLoading(false);
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const top3 = usuarios.slice(0, 3);
  const rest = usuarios.slice(3);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 96, background: '#050505', fontFamily: FONT, color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');
        @keyframes pedestalShimmer { 0%{left:-60%} 100%{left:140%} }
        @keyframes rankBgPulse { 0%,100%{opacity:.5} 50%{opacity:.9} }
        @keyframes rankScanH { 0%{transform:translateX(-100%)} 100%{transform:translateX(300%)} }
      `}</style>

      {/* Background animado */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <motion.div
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.06, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{
            position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 400, borderRadius: '50%',
            background: `radial-gradient(ellipse, rgba(245,196,0,0.07) 0%, transparent 70%)`,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          background: `repeating-linear-gradient(0deg, transparent 0px, transparent 32px, rgba(255,255,255,.4) 32px, rgba(255,255,255,.4) 33px)`,
        }} />
      </div>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        padding: '40px 20px 16px',
        background: 'linear-gradient(180deg, #050505 65%, transparent)',
      }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <a href="/tigre-fc" style={{
            display: 'flex', alignItems: 'center', gap: 6,
            color: 'rgba(255,255,255,0.3)', textDecoration: 'none',
            fontSize: 10, fontWeight: 900, letterSpacing: '0.2em',
            marginBottom: 12, width: 'fit-content',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            TIGRE FC
          </a>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.5em', color: GOLD, marginBottom: 4 }}>
                {jogoRodada ? `RODADA ${jogoRodada} ·` : ''} SÉRIE B 2026
              </div>
              <h1 style={{
                fontSize: 'clamp(48px, 12vw, 68px)', fontWeight: 900, fontStyle: 'italic',
                lineHeight: 0.9, margin: 0,
                textShadow: `0 0 40px rgba(245,196,0,0.15)`,
              }}>RANKING</h1>
            </div>
            <div style={{ textAlign: 'right', marginBottom: 4 }}>
              <div style={{ fontSize: 28, fontWeight: 900, fontStyle: 'italic', color: GOLD, lineHeight: 1 }}>
                {usuarios.length}
              </div>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', fontWeight: 800, letterSpacing: '0.3em' }}>
                TORCEDORES
              </div>
            </div>
          </div>

          {/* Linha com scan */}
          <div style={{ marginTop: 12, height: 1, background: `linear-gradient(90deg, ${GOLD}70, transparent)`, position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, height: '100%', width: '30%',
              background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
              animation: 'rankScanH 3s linear infinite',
            }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 16px' }}>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 80 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                border: `2px solid ${GOLD}33`,
                borderTopColor: GOLD,
              }}
            />
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900, letterSpacing: '0.4em' }}>
              CARREGANDO...
            </span>
          </div>
        ) : usuarios.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🐯</div>
            <div style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>Nenhum torcedor escalou ainda.</div>
          </div>
        ) : (
          <>
            {/* ── PÓDIO ── */}
            {top3.length >= 1 && (
              <div style={{ marginBottom: 40 }}>
                <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.15)', textAlign: 'center', marginBottom: 24, textTransform: 'uppercase' }}>
                  Melhores da temporada
                </div>

                {/* Spotlight cinematic no 1º */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: 200, height: 200, borderRadius: '50%',
                    background: `radial-gradient(circle, rgba(245,196,0,0.12) 0%, transparent 70%)`,
                    pointerEvents: 'none',
                    animation: 'rankBgPulse 3s ease-in-out infinite',
                  }} />

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, padding: '0 8px' }}>
                    {top3[1] && <PodiumCard user={top3[1]} rank={2} onClick={() => setPerfil(top3[1].id)} />}
                    <PodiumCard user={top3[0]} rank={1} onClick={() => setPerfil(top3[0].id)} />
                    {top3[2] && <PodiumCard user={top3[2]} rank={3} onClick={() => setPerfil(top3[2].id)} />}
                  </div>
                </div>
              </div>
            )}

            {/* ── LISTA ── */}
            {rest.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.5em', color: 'rgba(255,255,255,0.15)' }}>
                    CLASSIFICAÇÃO GERAL
                  </div>
                  <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {rest.map((u, i) => (
                    <RankRow
                      key={u.id} user={u} rank={i + 4}
                      isMe={u.id === meuTfcId}
                      onView={() => setPerfil(u.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {perfil && (
          <TigreFCPerfilPublico
            targetUsuarioId={perfil}
            viewerUsuarioId={meuTfcId}
            onClose={() => setPerfil(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
