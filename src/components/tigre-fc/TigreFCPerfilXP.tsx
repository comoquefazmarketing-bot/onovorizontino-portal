'use client';
import { useEffect, useRef } from 'react';

const NIVEL_CONFIG = {
  Novato: { color: '#6b7280', glow: 'none',           icon: '🌱', next: 'Fiel',  ptsMeta: 100,  ptsMin: 0   },
  Fiel:   { color: '#F5C400', glow: 'none',           icon: '⚡', next: 'Garra', ptsMeta: 300,  ptsMin: 100 },
  Garra:  { color: '#F5C400', glow: '0 0 12px #F5C400', icon: '🔥', next: 'Lenda', ptsMeta: 600, ptsMin: 300 },
  Lenda:  { color: '#F5C400', glow: '0 0 20px #F5C400, 0 0 40px #F5C400', icon: '🐯', next: null, ptsMeta: 600, ptsMin: 600 },
};

type Props = {
  nivel: string;
  pontos: number;
  apelido: string;
  avatarUrl?: string | null;
  posicao?: number | null;
  leveledup?: boolean;
};

export default function TigreFCPerfilXP({ nivel, pontos, apelido, avatarUrl, posicao, leveledup }: Props) {
  const confettiRef = useRef(false);
  const cfg = NIVEL_CONFIG[nivel as keyof typeof NIVEL_CONFIG] || NIVEL_CONFIG.Novato;

  const pct = nivel === 'Lenda' ? 100
    : Math.min(100, Math.round(((pontos - cfg.ptsMin) / (cfg.ptsMeta - cfg.ptsMin)) * 100));

  useEffect(() => {
    if (leveledup && !confettiRef.current) {
      confettiRef.current = true;
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 120, spread: 90, colors: ['#F5C400', '#ffffff', '#1a1a1a'], origin: { y: 0.6 } });
        setTimeout(() => confetti({ particleCount: 60, spread: 60, colors: ['#F5C400', '#fff'], origin: { y: 0.5 } }), 500);
      }).catch(() => {});
    }
  }, [leveledup]);

  return (
    <>
      <style>{`
        @keyframes lenda-fire { 0%,100%{box-shadow:0 0 20px #F5C400,0 0 40px #F5C400} 50%{box-shadow:0 0 30px #F5C400,0 0 60px rgba(245,196,0,.6)} }
        @keyframes garra-glow { 0%,100%{box-shadow:0 0 8px #F5C400} 50%{box-shadow:0 0 16px #F5C400} }
        @keyframes bar-fill { from{width:0} to{width:${pct}%} }
        @keyframes xp-pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        .nivel-lenda { animation: lenda-fire 2s ease-in-out infinite; }
        .nivel-garra { animation: garra-glow 2s ease-in-out infinite; }
        .bar-animated { animation: bar-fill 1.2s cubic-bezier(.16,1,.3,1) forwards; }
      `}</style>

      <div style={{
        background: nivel === 'Lenda' ? 'linear-gradient(135deg,#1a1200,#0a0a0a)' : '#111',
        border: `1px solid ${cfg.color}${nivel === 'Novato' ? '30' : '60'}`,
        borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden',
      }}
        className={nivel === 'Lenda' ? 'nivel-lenda' : nivel === 'Garra' ? 'nivel-garra' : ''}>

        {/* Brilho topo para Lenda */}
        {nivel === 'Lenda' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#F5C400,transparent)' }} />
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          {/* Avatar */}
          {avatarUrl ? (
            <img src={avatarUrl} style={{ width: 52, height: 52, borderRadius: '50%', border: `2px solid ${cfg.color}`, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#111', flexShrink: 0 }}>
              {(apelido || '?').charAt(0)}
            </div>
          )}

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {apelido}
              </span>
              {nivel === 'Lenda' && <span style={{ fontSize: 14 }}>👑</span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 13, color: cfg.color, fontWeight: 900 }}>{cfg.icon} {nivel}</span>
              {posicao && <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>· #{posicao}º geral</span>}
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: cfg.color }}>{pontos}</div>
            <div style={{ fontSize: 9, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>pts</div>
          </div>
        </div>

        {/* Barra de XP */}
        {nivel !== 'Lenda' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>{nivel}</span>
              <span style={{ fontSize: 10, color: cfg.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                {cfg.next} em {cfg.ptsMeta - pontos} pts
              </span>
            </div>
            <div style={{ height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
              <div
                className="bar-animated"
                style={{
                  height: '100%', background: cfg.color, borderRadius: 3,
                  width: `${pct}%`, position: 'relative',
                }}>
                {/* Brilho na ponta da barra */}
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 8, background: 'rgba(255,255,255,.5)', borderRadius: 3 }} />
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#333', marginTop: 4, textAlign: 'right' }}>
              {pontos} / {cfg.ptsMeta} pts · {pct}%
            </div>
          </div>
        )}

        {nivel === 'Lenda' && (
          <div style={{ textAlign: 'center', fontSize: 11, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2 }}>
            🐯 Nível máximo — Lenda do Tigre do Vale
          </div>
        )}

        {leveledup && (
          <div style={{ marginTop: 12, padding: '8px 14px', background: 'rgba(245,196,0,.15)', border: '1px solid #F5C400', borderRadius: 8, textAlign: 'center', fontSize: 13, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: 1 }}>
            🎉 LEVEL UP! Bem-vindo ao nível {nivel}!
          </div>
        )}
      </div>
    </>
  );
}
