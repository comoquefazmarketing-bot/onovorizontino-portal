'use client';

/**
 * Card3DTilt — Motor de efeito 3D ultra-premium AAA
 *
 * 1. Tilt 3D mola agressiva (stiffness alto, damping baixo = bounce)
 * 2. Chrome shine metallic seguindo cursor
 * 3. Holographic scan lines iridescentes
 * 4. Anel de energia orbital no hover (conic-gradient giratório)
 * 5. Levitação: translateZ + shadow dinâmico
 * 6. Glow border reativo ao ângulo de inclinação
 * 7. Micro-partículas saindo da borda superior no hover
 * 8. Gyroscope mobile
 * 9. Fallback prefers-reduced-motion
 */

import {
  useRef, useCallback, useEffect, useState, ReactNode, CSSProperties,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';

interface Card3DTiltProps {
  children:     ReactNode;
  style?:       CSSProperties;
  className?:   string;
  maxTilt?:     number;
  glowColor?:   string;
  chrome?:      boolean;
  holographic?: boolean;
  elevation?:   number;
  onClick?:     () => void;
}

export default function Card3DTilt({
  children, style, className,
  maxTilt     = 14,
  glowColor   = '#F5C400',
  chrome      = true,
  holographic = false,
  elevation   = 3,
  onClick,
}: Card3DTiltProps) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const rawX   = useMotionValue(0);
  const rawY   = useMotionValue(0);
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);

  const springTilt  = { stiffness: 380, damping: 26, mass: 0.8 };
  const springScale = { stiffness: 460, damping: 26 };
  const springShine = { stiffness: 220, damping: 24 };

  const rotX = useSpring(useTransform(rawY, [-1, 1], [maxTilt, -maxTilt]), springTilt);
  const rotY = useSpring(useTransform(rawX, [-1, 1], [-maxTilt, maxTilt]), springTilt);
  const scl  = useSpring(1, springScale);
  const tz   = useSpring(0, springScale);
  const sxs  = useSpring(shineX, springShine);
  const sys  = useSpring(shineY, springShine);

  const shineGrad = useMotionTemplate`radial-gradient(
    circle at ${sxs}% ${sys}%,
    rgba(255,255,255,0.32) 0%,
    rgba(255,255,255,0.10) 26%,
    transparent 55%
  )`;

  const absRotX     = useTransform(rotX, v => Math.abs(v));
  const absRotY     = useTransform(rotY, v => Math.abs(v));
  const glowOpacity = useTransform(
    [absRotX, absRotY] as any,
    ([x, y]: number[]) => Math.min(1, ((x + y) / (maxTilt * 2)) * 1.4),
  );

  const elev      = elevation * 7;
  const shadowDX  = useTransform(rotY, [-maxTilt, maxTilt], [`${elev}px`, `-${elev}px`]);
  const shadowDY  = useTransform(rotX, [-maxTilt, maxTilt], [`-${elev}px`, `${elev}px`]);
  const boxShadow = useMotionTemplate`${shadowDX} ${shadowDY} ${elev * 2}px rgba(0,0,0,0.55), 0 0 ${tz}px rgba(0,0,0,0.45)`;

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = (e.clientX - left) / width  * 2 - 1;
    const ny = (e.clientY - top)  / height * 2 - 1;
    rawX.set(nx); rawY.set(ny);
    shineX.set((nx + 1) / 2 * 100);
    shineY.set((ny + 1) / 2 * 100);
  }, [rawX, rawY, shineX, shineY]);

  const onEnter = useCallback(() => {
    setHovered(true);
    scl.set(1.03 + elevation * 0.003);
    tz.set(elevation * 9);
  }, [scl, tz, elevation]);

  const onLeave = useCallback(() => {
    setHovered(false);
    rawX.set(0); rawY.set(0);
    shineX.set(50); shineY.set(50);
    scl.set(1); tz.set(0);
  }, [rawX, rawY, shineX, shineY, scl, tz]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handle = (e: DeviceOrientationEvent) => {
      const nx = Math.max(-1, Math.min(1, (e.gamma ?? 0) / 25));
      const ny = Math.max(-1, Math.min(1, ((e.beta ?? 0) - 45) / 25));
      rawX.set(nx); rawY.set(ny);
      shineX.set((nx + 1) / 2 * 100);
      shineY.set((ny + 1) / 2 * 100);
    };
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((r: string) => { if (r === 'granted') window.addEventListener('deviceorientation', handle, { passive: true }); })
        .catch(() => {});
    } else {
      window.addEventListener('deviceorientation', handle, { passive: true });
    }
    return () => window.removeEventListener('deviceorientation', handle);
  }, [rawX, rawY, shineX, shineY]);

  return (
    <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%', position: 'relative' }}>
      {/* Anel de energia orbital no hover */}
      {hovered && (
        <div aria-hidden style={{
          position: 'absolute', inset: -3,
          borderRadius: 'inherit', pointerEvents: 'none', zIndex: -1,
          background: `conic-gradient(from 0deg, ${glowColor}, transparent 60%, ${glowColor})`,
          opacity: 0.55, filter: 'blur(6px)',
          animation: 'orbitRingPulse 1.8s ease-in-out infinite',
        }} />
      )}

      <motion.div
        ref={cardRef}
        className={className}
        style={{
          ...style,
          rotateX: rotX, rotateY: rotY, scale: scl, z: tz,
          transformStyle: 'preserve-3d', willChange: 'transform',
          boxShadow, position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
        }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {/* Glow border reativo ao tilt */}
        <motion.div aria-hidden style={{
          position: 'absolute', inset: -1, borderRadius: 'inherit',
          pointerEvents: 'none', zIndex: 200,
          border: `1.5px solid ${glowColor}`,
          opacity: glowOpacity, mixBlendMode: 'screen',
        }} />

        {/* Chrome spotlight metallic */}
        {chrome && (
          <motion.div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            pointerEvents: 'none', zIndex: 150,
            background: shineGrad, mixBlendMode: 'overlay',
          }} />
        )}

        {/* Scan lines holográficas */}
        {holographic && (
          <div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            pointerEvents: 'none', zIndex: 140,
            background: `repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)`,
            mixBlendMode: 'overlay',
          }} />
        )}

        {/* Iridescent overlay animado */}
        {holographic && (
          <motion.div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 'inherit',
            pointerEvents: 'none', zIndex: 130,
            background: `linear-gradient(135deg, rgba(245,196,0,0.14) 0%, rgba(0,243,255,0.09) 25%, rgba(180,0,255,0.07) 50%, rgba(0,243,255,0.09) 75%, rgba(245,196,0,0.14) 100%)`,
            backgroundSize: '400% 400%',
            animation: 'holoShift 4s ease infinite',
            opacity: glowOpacity as any,
            mixBlendMode: 'color-dodge',
          }} />
        )}

        {/* Micro-partículas de borda no hover */}
        {hovered && [...Array(8)].map((_, i) => (
          <div key={i} aria-hidden style={{
            position: 'absolute',
            width: 3, height: 3, borderRadius: '50%',
            background: i % 2 === 0 ? glowColor : '#00F3FF',
            left: `${8 + i * 12}%`, top: '-4px',
            opacity: 0.85,
            animation: `edgeSpark ${0.55 + i * 0.07}s ease-out infinite`,
            animationDelay: `${i * 0.09}s`,
            pointerEvents: 'none', zIndex: 300,
            boxShadow: `0 0 6px ${i % 2 === 0 ? glowColor : '#00F3FF'}`,
          }} />
        ))}

        <style>{`
          @keyframes holoShift {
            0%   { background-position: 0% 50% }
            50%  { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          @keyframes orbitRingPulse {
            0%,100% { transform: rotate(0deg); opacity: 0.55; }
            50%     { transform: rotate(180deg); opacity: 0.85; }
          }
          @keyframes edgeSpark {
            0%   { transform: translateY(0) scale(1); opacity: 0.85; }
            100% { transform: translateY(-22px) scale(0.1); opacity: 0; }
          }
          @media (prefers-reduced-motion: reduce) {
            * { animation: none !important; transition: none !important; }
          }
        `}</style>

        {children}
      </motion.div>
    </div>
  );
}
