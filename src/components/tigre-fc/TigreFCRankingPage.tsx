'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

type Usuario = {
  id: string;
  apelido: string | null;
  nome: string;
  avatar_url: string | null;
  nivel: string | null;
  pontos_total: number;
};

export default function TigreFCRankingPage() {
  const [ranking, setRanking] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    async function load() {
      const [{ data: rankData }, { data: { session } }] = await Promise.all([
        supabase
          .from('tigre_fc_usuarios')
          .select('id, apelido, nome, avatar_url, nivel, pontos_total')
          .order('pontos_total', { ascending: false })
          .limit(50),
        supabase.auth.getSession(),
      ]);

      setRanking(rankData || []);

      if (session?.user) {
        const { data: u } = await supabase
          .from('tigre_fc_usuarios')
          .select('id')
          .eq('google_id', session.user.id)
          .single();
        if (u) setMeuId(u.id);
      }

      setLoading(false);
      setTimeout(() => setVisivel(true), 50);
    }
    load();
  }, []);

  const minhaPosicao = meuId ? ranking.findIndex(u => u.id === meuId) : -1;
  const eu = meuId ? ranking.find(u => u.id === meuId) : null;
  const lider = ranking[0];
  const ptsDiff = eu && lider && eu.id !== lider.id ? lider.pontos_total - eu.pontos_total : 0;
  const proxima = minhaPosicao > 0 ? ranking[minhaPosicao - 1] : null;
  const ptsDiffProxima = eu && proxima ? proxima.pontos_total - eu.pontos_total + 1 : 0;

  if (loading) return <LoadingScreen />;

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,196,0,0); }
          50%       { box-shadow: 0 0 24px 4px rgba(245,196,0,0.25); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes crownPulse {
          0%, 100% { filter: drop-shadow(0 0 6px #F5C400); transform: scale(1) rotate(-5deg); }
          50%       { filter: drop-shadow(0 0 16px #F5C400); transform: scale(1.15) rotate(5deg); }
        }
        @keyframes barGrow {
          from { width: 0%; }
          to   { width: var(--bar-w); }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
        .row-hover:hover {
          background: #1a1200 !important;
          border-color: rgba(245,196,0,0.3) !important;
          transform: translateX(4px);
        }
        .row-hover { transition: all 0.2s ease; }
      `}</style>

      <main style={{ minHeight: '100vh', background: '#060606', color: '#fff', fontFamily: 'system-ui', paddingBottom: 100, overflowX: 'hidden' }}>

        {/* HEADER */}
        <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(6,6,6,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ background: 'linear-gradient(90deg, #F5C400, #ffdd57, #F5C400)', backgroundSize: '200% auto', animation: 'shimmer 3s linear infinite', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/tigre-fc" style={{ color: '#111', textDecoration: 'none', fontWeight: 900, fontSize: 20, lineHeight: 1 }}>←</Link>
            <img src={LOGO} style={{ width: 22, objectFit: 'contain' }} alt="" />
            <span style={{ fontWeight: 900, fontSize: 13, color: '#111', textTransform: 'uppercase', letterSpacing: 2, flex: 1 }}>Arena do Ranking</span>
            <span style={{ background: '#111', color: '#F5C400', borderRadius: 6, padding: '3px 8px', fontSize: 10, fontWeight: 900, letterSpacing: 1 }}>
              🔴 AO VIVO
            </span>
          </div>

          {/* Minha posição — sticky sub-header */}
          {eu && minhaPosicao >= 0 && (
            <div style={{ background: '#0d0d00', borderBottom: '1px solid #2a2000', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, color: '#666', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>SUA POSIÇÃO</span>
              <span style={{ fontWeight: 900, fontSize: 16, color: '#F5C400' }}>#{minhaPosicao + 1}</span>
              <span style={{ flex: 1 }} />
              {ptsDiff > 0 && (
                <span style={{ fontSize: 10, color: '#f87171', fontWeight: 900, background: '#2a0000', padding: '3px 8px', borderRadius: 6 }}>
                  -{ptsDiff} pts para o 🥇
                </span>
              )}
              {ptsDiffProxima > 0 && proxima && (
                <span style={{ fontSize: 10, color: '#fbbf24', fontWeight: 900, background: '#1a1000', padding: '3px 8px', borderRadius: 6, animation: 'blink 2s ease infinite' }}>
                  +{ptsDiffProxima} pts → #{minhaPosicao} 🔥
                </span>
              )}
            </div>
          )}
        </div>

        <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 12px' }}>

          {/* PÓDIO TOP 3 */}
          {ranking.length >= 3 && (
            <div style={{ padding: '28px 0 20px', opacity: visivel ? 1 : 0, animation: visivel ? 'fadeSlideUp 0.6s ease forwards' : 'none' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <span style={{ fontSize: 10, color: '#555', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>⚡ HALL DA FAMA ⚡</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.15fr 1fr', gap: 6, alignItems: 'flex-end' }}>
                <PodioCard u={ranking[1]} pos={2} isMe={ranking[1].id === meuId} onClick={() => setPerfilAberto(ranking[1].id)} delay={200} />
                <PodioCard u={ranking[0]} pos={1} isMe={ranking[0].id === meuId} onClick={() => setPerfilAberto(ranking[0].id)} delay={0} />
                <PodioCard u={ranking[2]} pos={3} isMe={ranking[2].id === meuId} onClick={() => setPerfilAberto(ranking[2].id)} delay={300} />
              </div>
            </div>
          )}

          {/* DIVISOR */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, #222)' }} />
            <span style={{ fontSize: 9, color: '#333', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>Restante do Ranking</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, #222, transparent)' }} />
          </div>

          {/* LISTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {ranking.slice(3).map((u, i) => {
              const pos = i + 4;
              const isMe = u.id === meuId;
              const maxPts = ranking[0]?.pontos_total || 1;
              const barW = Math.max(4, Math.round((u.pontos_total / maxPts) * 100));
              const animDelay = `${i * 60}ms`;

              return (
                <button
                  key={u.id}
                  onClick={() => setPerfilAberto(u.id)}
                  className="row-hover"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 14px',
                    background: isMe ? '#0f0c00' : '#0e0e0e',
                    border: `1px solid ${isMe ? '#3a2800' : '#161616'}`,
                    borderRadius: 14, cursor: 'pointer', textAlign: 'left', width: '100%',
                    position: 'relative', overflow: 'hidden',
                    opacity: visivel ? 1 : 0,
                    animation: visivel ? `fadeSlideUp 0.5s ease ${animDelay} both` : 'none',
                  }}
                >
                  {/* Barra de progresso de fundo */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, height: 2,
                    width: `${barW}%`,
                    background: isMe ? 'linear-gradient(90deg, #F5C400, #ffdd57)' : 'linear-gradient(90deg, #2a2a2a, #333)',
                    transition: 'width 1s ease',
                  }} />

                  <div style={{ width: 24, textAlign: 'center', fontSize: 11, fontWeight: 900, color: isMe ? '#F5C400' : '#333', flexShrink: 0 }}>
                    #{pos}
                  </div>

                  <Avatar url={u.avatar_url} size={38} isMe={isMe} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 900, color: isMe ? '#F5C400' : '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {u.apelido || u.nome}
                      {isMe && <span style={{ fontSize: 8, color: '#F5C400', marginLeft: 6, background: '#2a1800', padding: '1px 5px', borderRadius: 4 }}>VOCÊ</span>}
                    </div>
                    {u.nivel && (
                      <div style={{ fontSize: 9, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>
                        {nivelIcon(u.nivel)} {u.nivel}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: isMe ? '#F5C400' : '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                      {u.pontos_total}
                    </div>
                    <div style={{ fontSize: 8, color: '#333', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>PTS</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA SE NÃO TIVER ESCALADO */}
          {!eu && (
            <div style={{ margin: '32px 0', padding: '24px', background: 'linear-gradient(135deg, #0f0c00, #1a1200)', border: '1px solid #F5C40030', borderRadius: 20, textAlign: 'center', animation: 'pulseGold 2s ease infinite' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginBottom: 8 }}>Você ainda não está na disputa!</div>
              <p style={{ fontSize: 12, color: '#666', marginBottom: 20, lineHeight: 1.6 }}>
                {ranking[0] ? `${ranking[0].apelido || ranking[0].nome} está na liderança com ${ranking[0].pontos_total} pts. Escale seu time e dispute o topo!` : 'Escale seu time e entre no ranking!'}
              </p>
              <Link href="/tigre-fc" style={{ background: '#F5C400', color: '#111', fontWeight: 900, fontSize: 12, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1 }}>
                Escalar Agora →
              </Link>
            </div>
          )}

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <Link href="/tigre-fc" style={{ color: '#333', fontSize: 10, fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 2 }}>
              ← Voltar para a Arena
            </Link>
          </div>
        </div>
      </main>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </>
  );
}

function nivelIcon(nivel: string) {
  const map: Record<string, string> = { Lenda: '👑', Elite: '💜', Pro: '💙', Amador: '💚', Novato: '⚪' };
  return map[nivel] || '⚪';
}

function Avatar({ url, size, isMe }: { url: string | null; size: number; isMe?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
      background: '#1a1a1a',
      boxShadow: isMe ? '0 0 0 2px #F5C400' : 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {url
        ? <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : <span style={{ fontSize: size * 0.45 }}>🐯</span>
      }
    </div>
  );
}

const PODIO_CONFIG = {
  1: { h: 110, bg: 'linear-gradient(180deg, #2a1f00 0%, #1a1200 100%)', border: '#F5C400', glow: 'rgba(245,196,0,0.4)', medal: '👑', pts_color: '#F5C400' },
  2: { h: 80,  bg: 'linear-gradient(180deg, #1a1a2e 0%, #111122 100%)', border: '#a78bfa', glow: 'rgba(167,139,250,0.2)', medal: '🥈', pts_color: '#a78bfa' },
  3: { h: 60,  bg: 'linear-gradient(180deg, #1a1000 0%, #111100 100%)', border: '#f97316', glow: 'rgba(249,115,22,0.2)', medal: '🥉', pts_color: '#f97316' },
};

function PodioCard({ u, pos, isMe, onClick, delay }: { u: Usuario; pos: 1|2|3; isMe: boolean; onClick: () => void; delay: number }) {
  const cfg = PODIO_CONFIG[pos];
  const avatarSize = pos === 1 ? 64 : 48;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        gap: 0,
        animation: `fadeSlideUp 0.6s ease ${delay}ms both`,
      }}
    >
      {/* Coroa / medalha animada */}
      <div style={{
        fontSize: pos === 1 ? 24 : 18,
        animation: pos === 1 ? 'crownPulse 2s ease infinite' : 'floatUp 3s ease infinite',
        marginBottom: 6, display: 'block',
      }}>
        {cfg.medal}
      </div>

      {/* Avatar com glow */}
      <div style={{
        width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden',
        border: `2px solid ${cfg.border}`,
        boxShadow: `0 0 20px ${cfg.glow}, 0 0 40px ${cfg.glow}`,
        marginBottom: 8, flexShrink: 0,
        animation: pos === 1 ? 'pulseGold 2.5s ease infinite' : 'none',
        background: '#1a1a1a',
      }}>
        {u.avatar_url
          ? <img src={u.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: avatarSize * 0.45 }}>🐯</div>
        }
      </div>

      {/* Nome */}
      <div style={{ fontSize: pos === 1 ? 11 : 9, fontWeight: 900, color: isMe ? '#F5C400' : '#fff', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 4px', marginBottom: 4 }}>
        {u.apelido || u.nome}
      </div>

      {/* Pontos */}
      <div style={{ fontSize: pos === 1 ? 18 : 14, fontWeight: 900, color: cfg.pts_color, marginBottom: 6, lineHeight: 1 }}>
        {u.pontos_total}
        <span style={{ fontSize: 8, color: '#555', marginLeft: 3, fontWeight: 700 }}>PTS</span>
      </div>

      {/* Bloco do pódio */}
      <div style={{
        width: '100%', height: cfg.h,
        background: cfg.bg,
        border: `1px solid ${cfg.border}30`,
        borderRadius: '8px 8px 0 0',
        boxShadow: `inset 0 1px 0 ${cfg.border}40`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Scanline decorativo */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 40,
          background: `linear-gradient(180deg, ${cfg.border}10, transparent)`,
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          textAlign: 'center', paddingBottom: 8,
          fontSize: pos === 1 ? 20 : 16, fontWeight: 900, color: `${cfg.border}30`,
        }}>
          #{pos}
        </div>
      </div>
    </button>
  );
}

function LoadingScreen() {
  return (
    <main style={{ minHeight: '100vh', background: '#060606', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <img src={LOGO} style={{ width: 60, animation: 'floatUp 1.5s ease infinite' }} alt="" />
      <div style={{ color: '#F5C400', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3, animation: 'blink 1s ease infinite' }}>
        Carregando Arena...
      </div>
    </main>
  );
}
