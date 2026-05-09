'use client';

/**
 * HeroParallax3D — Hero section com parallax 3D multi-layer
 *
 * Camadas de profundidade (trás → frente):
 * L0  Gradiente de fundo — luz difusa de estádio
 * L1  Grid de campo — move suavemente com o mouse (8px)
 * L2  Escudo Novorizontino — pivô, rotação 3D real (20px / 8°)
 * L3a Pata do Tigre — primeiro plano direito (32px)
 * L3b Logo Tigre FC — primeiro plano esquerdo (28px)
 * L4  Partículas flutuantes — CSS animation independente
 * L5  HUD de stats — quasi-fixo (6px)
 * L6  Vinheta de borda — merge suave com o resto da página
 */

import { useRef, useCallback } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion';

const GOLD       = '#F5C400';
const CYAN       = '#00F3FF';
const LOGO_NOV   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const TIGRE_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const FONT       = "'Barlow Condensed', system-ui, sans-serif";

interface Props {
  rodada?:         number | null;
  totalEscalacoes: number;
  ranking?:        number;
}

export default function HeroParallax3D({ rodada, totalEscalacoes, ranking = 0 }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);

  // ── Mouse tracking (valores normalizados -1 a 1) ─────────────────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const spring  = { stiffness: 80, damping: 18, mass: 1.2 };
  const mx      = useSpring(mouseX, spring);
  const my      = useSpring(mouseY, spring);

  // ── Transformações por camada ─────────────────────────────────────────────
  // Quanto maior o coeficiente, mais a camada "anda" com o mouse (efeito de câmera 3D)
  const l1x    = useTransform(mx, [-1, 1], [ -8,  8]);
  const l1y    = useTransform(my, [-1, 1], [ -8,  8]);

  const l2x    = useTransform(mx, [-1, 1], [-20, 20]);
  const l2y    = useTransform(my, [-1, 1], [-16, 16]);
  const l2rotY = useTransform(mx, [-1, 1], [ -8,  8]);
  const l2rotX = useTransform(my, [-1, 1], [  6, -6]);

  const l3ax   = useTransform(mx, [-1, 1], [-32, 32]);
  const l3ay   = useTransform(my, [-1, 1], [-24, 24]);
  const l3arot = useTransform(mx, [-1, 1], [ -4,  4]);

  const l3bx   = useTransform(mx, [-1, 1], [ 28,-28]);
  const l3by   = useTransform(my, [-1, 1], [-20, 20]);
  const l3brot = useTransform(mx, [-1, 1], [  3, -3]);

  const hudX   = useTransform(mx, [-1, 1], [ -6,  6]);
  const hudY   = useTransform(my, [-1, 1], [ -4,  4]);

  // ── Scroll parallax: hero sobe ao rolar (efeito de profundidade) ─────────
  const { scrollY }  = useScroll();
  const heroScrollY  = useTransform(scrollY, [0, 300], [0, -55]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width  * 2 - 1);
    mouseY.set((e.clientY - top)  / height * 2 - 1);
  }, [mouseX, mouseY]);

  const onLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const stats = [
    { valor: totalEscalacoes,             label: 'Escalados', cor: GOLD  },
    { valor: rodada != null ? `R${rodada}` : '—', label: 'Rodada',    cor: CYAN  },
    { valor: ranking,                      label: 'No Ranking', cor: '#fff' },
  ];

  return (
    <motion.div
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        y:              heroScrollY,
        position:       'relative',
        overflow:       'hidden',
        userSelect:     'none',
        height:         200,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
      }}
    >
      {/* L0 — Luz difusa de estádio */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 80% at 50% 0%,  rgba(245,196,0,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 40% 60% at 20% 50%, rgba(0,243,255,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 60% at 80% 50%, rgba(245,196,0,0.04) 0%, transparent 60%)
        `,
      }} />

      {/* L1 — Grid de campo */}
      <motion.div style={{ x: l1x, y: l1y, position: 'absolute', inset: -20, zIndex: 2 }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          background: `
            repeating-linear-gradient(0deg,
              transparent 0px, transparent 48px,
              rgba(255,255,255,0.5) 48px, rgba(255,255,255,0.5) 49px),
            repeating-linear-gradient(90deg,
              transparent 0px, transparent 48px,
              rgba(255,255,255,0.25) 48px, rgba(255,255,255,0.25) 49px)
          `,
        }} />
      </motion.div>

      {/* L2 — Escudo Novorizontino com rotação 3D real */}
      <motion.div
        style={{
          x: l2x, y: l2y, rotateY: l2rotY, rotateX: l2rotX,
          position: 'absolute', left: '50%', top: '50%',
          marginLeft: -56, marginTop: -56,
          zIndex: 5, transformStyle: 'preserve-3d', perspective: 400,
        }}
      >
        <img
          src={LOGO_NOV}
          alt="Novorizontino"
          style={{
            width: 112, height: 112, objectFit: 'contain', opacity: 0.82,
            filter: `
              drop-shadow(0 0 24px ${GOLD}50)
              drop-shadow(0 0 48px ${GOLD}18)
              drop-shadow(0 4px 12px rgba(0,0,0,0.8))
            `,
          }}
        />
      </motion.div>

      {/* L3a — Pata do Tigre (frente-direita) */}
      <motion.div style={{
        x: l3ax, y: l3ay, rotate: l3arot,
        position: 'absolute', right: '8%', top: '15%', zIndex: 7,
      }}>
        <img src={PATA} alt="" style={{
          width: 64, height: 64, objectFit: 'contain', opacity: 0.55,
          filter: `drop-shadow(0 0 16px ${GOLD}60) drop-shadow(0 2px 8px rgba(0,0,0,0.8))`,
        }} />
      </motion.div>

      {/* L3b — Logo Tigre FC (frente-esquerda) */}
      <motion.div style={{
        x: l3bx, y: l3by, rotate: l3brot,
        position: 'absolute', left: '6%', bottom: '18%', zIndex: 6,
      }}>
        <img src={TIGRE_LOGO} alt="" style={{
          width: 48, height: 48, objectFit: 'contain', opacity: 0.42,
          filter: `drop-shadow(0 0 12px ${GOLD}40) drop-shadow(0 2px 6px rgba(0,0,0,0.8))`,
        }} />
      </motion.div>

      {/* L4 — Partículas flutuantes (CSS animation) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{
            position:    'absolute',
            width:        i % 3 === 0 ? 3 : 2,
            height:       i % 3 === 0 ? 3 : 2,
            borderRadius: '50%',
            background:   i % 2 === 0 ? GOLD : CYAN,
            left:         `${8 + i * 9}%`,
            top:          `${15 + (i % 5) * 15}%`,
            opacity:      0.35,
            animation:    `pfloat${i % 3} ${2.4 + i * 0.35}s ease-in-out infinite`,
            animationDelay: `${i * 0.28}s`,
          }} />
        ))}
      </div>

      {/* L5 — HUD de stats */}
      <motion.div
        style={{
          x: hudX, y: hudY,
          position: 'absolute', bottom: 12, left: 0, right: 0, zIndex: 10,
          display: 'flex', justifyContent: 'center', gap: 24,
        }}
      >
        {stats.map(({ valor, label, cor }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 18, fontWeight: 900, fontStyle: 'italic',
              color: cor, lineHeight: 1,
              textShadow: `0 0 16px ${cor}60`,
              fontFamily: FONT,
            }}>
              {valor}
            </div>
            <div style={{
              fontSize: 7, color: 'rgba(255,255,255,0.32)', fontWeight: 800,
              letterSpacing: 2, textTransform: 'uppercase', marginTop: 2, fontFamily: FONT,
            }}>
              {label}
            </div>
          </div>
        ))}
      </motion.div>

      {/* L6 — Vinheta de borda */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none',
        background: `
          linear-gradient(to right,  rgba(3,3,3,0.75) 0%, transparent 18%, transparent 82%, rgba(3,3,3,0.75) 100%),
          linear-gradient(to bottom, rgba(3,3,3,0.35) 0%, transparent 28%, transparent 68%, rgba(3,3,3,0.92) 100%)
        `,
      }} />

      <style>{`
        @keyframes pfloat0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes pfloat1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-13px)} }
        @keyframes pfloat2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
      `}</style>
    </motion.div>
  );
}
