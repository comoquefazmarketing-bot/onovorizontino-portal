'use client';

/**
 * HeroParallax3D — Hero section AAA com estádio WebGL + parallax 3D
 *
 * L0  Cena WebGL: partículas 3D, bloom, energy ring, stadium lights  (R3F)
 * L1  Grid de campo — move com mouse (8px)
 * L2  Escudo Novorizontino — pivô, rotação 3D (22px / 9°) + halo pulsante
 * L3a Pata do Tigre — primeiro plano direito (34px) + float
 * L3b Logo Tigre FC — primeiro plano esquerdo (30px)
 * L4  Partículas flutuantes CSS — 14 pontos gold/cyan/white
 * L5  HUD de stats — quasi-fixo (6px) + scan bar LED
 * L6  Vinheta de borda
 * L7  Scan line CRT periódica
 */

import { useRef, useCallback } from 'react';
import StadiumScene from './effects/StadiumScene';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion';

const GOLD     = '#F5C400';
const CYAN     = '#00F3FF';
const LOGO_NOV = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const TIGRE    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const FONT     = "'Barlow Condensed', system-ui, sans-serif";

interface Props {
  rodada?:         number | null;
  totalEscalacoes: number;
  ranking?:        number;
}

export default function HeroParallax3D({ rodada, totalEscalacoes, ranking = 0 }: Props) {
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX  = useMotionValue(0);
  const mouseY  = useMotionValue(0);

  const sp = { stiffness: 80, damping: 18, mass: 1.2 };
  const mx = useSpring(mouseX, sp);
  const my = useSpring(mouseY, sp);

  const l1x    = useTransform(mx, [-1, 1], [-8,   8]);
  const l1y    = useTransform(my, [-1, 1], [-8,   8]);
  const l2x    = useTransform(mx, [-1, 1], [-22, 22]);
  const l2y    = useTransform(my, [-1, 1], [-18, 18]);
  const l2rotY = useTransform(mx, [-1, 1], [-9,   9]);
  const l2rotX = useTransform(my, [-1, 1], [ 7,  -7]);
  const l3ax   = useTransform(mx, [-1, 1], [-34, 34]);
  const l3ay   = useTransform(my, [-1, 1], [-26, 26]);
  const l3arot = useTransform(mx, [-1, 1], [-5,   5]);
  const l3bx   = useTransform(mx, [-1, 1], [ 30,-30]);
  const l3by   = useTransform(my, [-1, 1], [-22, 22]);
  const l3brot = useTransform(mx, [-1, 1], [ 4,  -4]);
  const hudX   = useTransform(mx, [-1, 1], [-6,   6]);
  const hudY   = useTransform(my, [-1, 1], [-4,   4]);

  const { scrollY } = useScroll();
  const heroY       = useTransform(scrollY, [0, 300], [0, -55]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = heroRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width  * 2 - 1);
    mouseY.set((e.clientY - top)  / height * 2 - 1);
  }, [mouseX, mouseY]);

  const onLeave = useCallback(() => { mouseX.set(0); mouseY.set(0); }, [mouseX, mouseY]);

  const stats = [
    { valor: totalEscalacoes,                      label: 'Escalados',  cor: GOLD  },
    { valor: rodada != null ? `R${rodada}` : '—', label: 'Rodada',     cor: CYAN  },
    { valor: ranking,                               label: 'No Ranking', cor: '#fff' },
  ];

  return (
    <motion.div
      ref={heroRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        y: heroY, position: 'relative', overflow: 'hidden',
        userSelect: 'none', height: 220,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* L0 — WebGL: partículas 3D + bloom + stadium lights */}
      <StadiumScene />

      {/* L0b — luz difusa complementar */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 70% 80% at 50% 0%,  rgba(245,196,0,0.09) 0%, transparent 70%),
          radial-gradient(ellipse 40% 60% at 20% 50%, rgba(0,243,255,0.05) 0%, transparent 60%),
          radial-gradient(ellipse 40% 60% at 80% 50%, rgba(245,196,0,0.05) 0%, transparent 60%)`,
      }} />

      {/* L1 — Grid de campo */}
      <motion.div style={{ x: l1x, y: l1y, position: 'absolute', inset: -20, zIndex: 2 }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.04,
          background: `
            repeating-linear-gradient(0deg, transparent 0px, transparent 48px, rgba(255,255,255,.5) 48px, rgba(255,255,255,.5) 49px),
            repeating-linear-gradient(90deg, transparent 0px, transparent 48px, rgba(255,255,255,.25) 48px, rgba(255,255,255,.25) 49px)`,
        }} />
      </motion.div>

      {/* L2 — Escudo com rotação 3D + halo pulsante */}
      <motion.div style={{
        x: l2x, y: l2y, rotateY: l2rotY, rotateX: l2rotX,
        position: 'absolute', left: '50%', top: '50%',
        marginLeft: -60, marginTop: -60,
        zIndex: 5, transformStyle: 'preserve-3d', perspective: 400,
      }}>
        <div style={{
          position: 'absolute', inset: -28, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(245,196,0,0.22) 0%, transparent 70%)`,
          animation: 'heroHaloPulse 2.4s ease-in-out infinite',
        }} />
        <img src={LOGO_NOV} alt="Novorizontino" style={{
          width: 120, height: 120, objectFit: 'contain', opacity: 0.92,
          filter: `drop-shadow(0 0 28px ${GOLD}60) drop-shadow(0 0 56px ${GOLD}22) drop-shadow(0 4px 14px rgba(0,0,0,.9))`,
          animation: 'heroEscudoPulse 3s ease-in-out infinite',
        }} />
      </motion.div>

      {/* L3a — Pata do Tigre */}
      <motion.div style={{ x: l3ax, y: l3ay, rotate: l3arot, position: 'absolute', right: '8%', top: '12%', zIndex: 7 }}>
        <img src={PATA} alt="" style={{
          width: 68, height: 68, objectFit: 'contain', opacity: 0.6,
          filter: `drop-shadow(0 0 20px ${GOLD}70) drop-shadow(0 2px 10px rgba(0,0,0,.9))`,
          animation: 'heroPataFloat 3.2s ease-in-out infinite',
        }} />
      </motion.div>

      {/* L3b — Logo Tigre FC */}
      <motion.div style={{ x: l3bx, y: l3by, rotate: l3brot, position: 'absolute', left: '6%', bottom: '16%', zIndex: 6 }}>
        <img src={TIGRE} alt="" style={{
          width: 52, height: 52, objectFit: 'contain', opacity: 0.45,
          filter: `drop-shadow(0 0 14px ${GOLD}45) drop-shadow(0 2px 6px rgba(0,0,0,.9))`,
        }} />
      </motion.div>

      {/* L4 — Partículas CSS */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(14)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width:  i % 3 === 0 ? 4 : i % 3 === 1 ? 2 : 3,
            height: i % 3 === 0 ? 4 : i % 3 === 1 ? 2 : 3,
            borderRadius: '50%',
            background: i % 3 === 0 ? GOLD : i % 3 === 1 ? CYAN : '#fff',
            left: `${4 + i * 7}%`, top: `${10 + (i % 6) * 14}%`,
            opacity: 0.4,
            animation: `pfloat${i % 3} ${2.2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.22}s`,
            boxShadow: `0 0 ${i % 3 === 0 ? 8 : 5}px currentColor`,
          }} />
        ))}
      </div>

      {/* L5 — HUD de stats */}
      <motion.div style={{
        x: hudX, y: hudY,
        position: 'absolute', bottom: 12, left: 0, right: 0, zIndex: 10,
        display: 'flex', justifyContent: 'center', gap: 28,
      }}>
        {stats.map(({ valor, label, cor }) => (
          <div key={label} style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -4, left: 0, right: 0, height: 1,
              background: `linear-gradient(90deg, transparent, ${cor}60, transparent)`,
              animation: 'hudScan 2s linear infinite',
            }} />
            <div style={{
              fontSize: 20, fontWeight: 900, fontStyle: 'italic', color: cor,
              lineHeight: 1, textShadow: `0 0 18px ${cor}70, 0 0 36px ${cor}30`, fontFamily: FONT,
            }}>{valor}</div>
            <div style={{
              fontSize: 7, color: 'rgba(255,255,255,0.3)', fontWeight: 800,
              letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 2, fontFamily: FONT,
            }}>{label}</div>
          </div>
        ))}
      </motion.div>

      {/* L6 — Vinheta */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 9, pointerEvents: 'none',
        background: `
          linear-gradient(to right,  rgba(3,3,3,.8) 0%, transparent 20%, transparent 80%, rgba(3,3,3,.8) 100%),
          linear-gradient(to bottom, rgba(3,3,3,.4) 0%, transparent 30%, transparent 65%, rgba(3,3,3,.95) 100%)`,
      }} />

      {/* L7 — Scan line CRT */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 11, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: 2, top: '-2px',
          background: `linear-gradient(90deg, transparent, ${GOLD}25, ${CYAN}18, ${GOLD}25, transparent)`,
          animation: 'crtScan 7s linear infinite',
        }} />
      </div>

      <style>{`
        @keyframes pfloat0 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pfloat1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes pfloat2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes heroHaloPulse { 0%,100%{opacity:.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }
        @keyframes heroEscudoPulse {
          0%,100%{filter:drop-shadow(0 0 28px #F5C40060) drop-shadow(0 0 56px #F5C40022) drop-shadow(0 4px 14px rgba(0,0,0,.9))}
          50%{filter:drop-shadow(0 0 44px #F5C40095) drop-shadow(0 0 88px #F5C40045) drop-shadow(0 4px 14px rgba(0,0,0,.9))}
        }
        @keyframes heroPataFloat { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-9px) rotate(5deg)} }
        @keyframes hudScan { 0%{opacity:0;transform:scaleX(0)} 40%{opacity:1;transform:scaleX(1)} 100%{opacity:0;transform:scaleX(0)} }
        @keyframes crtScan { 0%{top:-2px} 100%{top:calc(100% + 2px)} }
      `}</style>
    </motion.div>
  );
}
