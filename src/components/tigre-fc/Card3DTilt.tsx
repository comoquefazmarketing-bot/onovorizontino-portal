'use client';

/**
 * Card3DTilt — Motor de efeito 3D ultra-premium
 *
 * Efeitos implementados:
 * 1. Tilt 3D com spring physics (rotateX/Y seguem o mouse suavemente)
 * 2. Chrome shine: gradiente radial que segue o cursor (metallic highlight)
 * 3. Holographic scan lines: linhas sutis que dão textura de cartão holográfico
 * 4. Levitação: translateZ + box-shadow dinâmico ao hover
 * 5. Glow: borda luminosa proporcional à inclinação
 * 6. Suporte a touch/gyroscope no mobile
 * 7. Fallback automático para prefers-reduced-motion
 */

import {
  useRef, useCallback, useEffect, ReactNode, CSSProperties,
} from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'framer-motion';

interface Card3DTiltProps {
  children:    ReactNode;
  style?:      CSSProperties;
  className?:  string;
  /** Ângulo máximo de rotação em graus (padrão 14) */
  maxTilt?:    number;
  /** Cor do brilho/glow (padrão ouro do Tigre FC) */
  glowColor?:  string;
  /** Habilita reflexo metálico que segue o cursor */
  chrome?:     boolean;
  /** Habilita scan lines holográficas */
  holographic?: boolean;
  /** Nível de elevação 1–5 (afeta translateZ e shadow) */
  elevation?:  number;
  onClick?:    () => void;
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
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Motion values: posição normalizada do mouse (-1 a 1) ─────────────────
  const rawX = useMotionValue(0);  // mapeia eixo horizontal  → rotateY
  const rawY = useMotionValue(0);  // mapeia eixo vertical    → rotateX

  // Posição do brilho em % (0-100), segue o cursor
  const shineX = useMotionValue(50);
  const shineY = useMotionValue(50);

  // ── Spring physics ────────────────────────────────────────────────────────
  const springTilt  = { stiffness: 320, damping: 32, mass: 0.9 };
  const springScale = { stiffness: 420, damping: 28 };
  const springShine = { stiffness: 200, damping: 22 };

  // Rotação final com spring
  const rotX = useSpring(useTransform(rawY, [-1, 1], [maxTilt, -maxTilt]), springTilt);
  const rotY = useSpring(useTransform(rawX, [-1, 1], [-maxTilt, maxTilt]), springTilt);

  // Escala e elevação ao hover
  const scl = useSpring(1, springScale);
  const tz  = useSpring(0, springScale);      // translateZ (levitação)

  // Brilho com spring próprio (reage mais devagar = efeito premium)
  const sxs = useSpring(shineX, springShine);
  const sys = useSpring(shineY, springShine);

  // ── Gradientes reativos via useMotionTemplate ─────────────────────────────
  // Chrome: spotlight que persegue o cursor
  const shineGrad = useMotionTemplate`radial-gradient(
    circle at ${sxs}% ${sys}%,
    rgba(255,255,255,0.28) 0%,
    rgba(255,255,255,0.08) 28%,
    transparent 58%
  )`;

  // Glow na borda proporcional ao quanto o card inclinou
  const absRotX = useTransform(rotX, v => Math.abs(v));
  const absRotY = useTransform(rotY, v => Math.abs(v));
  const glowOpacity = useTransform([absRotX, absRotY] as any, ([x, y]: number[]) =>
    Math.min(0.9, ((x + y) / (maxTilt * 2)) * 1.2),
  );

  // Shadow dinâmico: cresce com a elevação e segue a rotação
  const elev     = elevation * 6;
  const shadowDX = useTransform(rotY, [-maxTilt, maxTilt], [`${elev}px`, `-${elev}px`]);
  const shadowDY = useTransform(rotX, [-maxTilt, maxTilt], [`-${elev}px`, `${elev}px`]);
  const boxShadow = useMotionTemplate`${shadowDX} ${shadowDY} ${elev * 2}px rgba(0,0,0,0.5), 0 0 ${tz}px rgba(0,0,0,0.4)`;

  // ── Handlers de mouse ────────────────────────────────────────────────────
  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const nx = (e.clientX - left) / width  * 2 - 1;   // -1 a 1
    const ny = (e.clientY - top)  / height * 2 - 1;
    rawX.set(nx);
    rawY.set(ny);
    shineX.set((nx + 1) / 2 * 100);
    shineY.set((ny + 1) / 2 * 100);
  }, [rawX, rawY, shineX, shineY]);

  const onEnter = useCallback(() => {
    scl.set(1.025 + elevation * 0.003);
    tz.set(elevation * 8);
  }, [scl, tz, elevation]);

  const onLeave = useCallback(() => {
    rawX.set(0); rawY.set(0);
    shineX.set(50); shineY.set(50);
    scl.set(1);
    tz.set(0);
  }, [rawX, rawY, shineX, shineY, scl, tz]);

  // ── Gyroscope para mobile ─────────────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let permission: NotificationPermission | string = 'granted';

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const beta  = (e.beta  ?? 0);   // -180 a 180 (frente/trás)
      const gamma = (e.gamma ?? 0);   // -90 a 90 (esquerda/direita)
      // Mapeia para -1 a 1 com clamp
      const nx = Math.max(-1, Math.min(1, gamma / 25));
      const ny = Math.max(-1, Math.min(1, (beta - 45) / 25));
      rawX.set(nx);
      rawY.set(ny);
      shineX.set((nx + 1) / 2 * 100);
      shineY.set((ny + 1) / 2 * 100);
    };

    // iOS 13+ exige permissão
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((res: string) => {
          permission = res;
          if (res === 'granted') window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        })
        .catch(() => {}); // silencioso se usuário recusar
    } else {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [rawX, rawY, shineX, shineY]);

  return (
    // Perspective no wrapper — necessário para o efeito 3D funcionar
    <div style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}>
      <motion.div
        ref={cardRef}
        className={className}
        style={{
          ...style,
          rotateX: rotX,
          rotateY: rotY,
          scale:   scl,
          z:       tz,
          transformStyle: 'preserve-3d',
          willChange:     'transform',
          boxShadow,
          position: 'relative',
          cursor:   onClick ? 'pointer' : 'default',
        }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        {/* ── Glow border (reage ao tilt) ────────────────────────────────── */}
        <motion.div
          aria-hidden
          style={{
            position:     'absolute',
            inset:        -1,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            zIndex:       200,
            border:       `1.5px solid ${glowColor}`,
            opacity:      glowOpacity,
            mixBlendMode: 'screen',
          }}
        />

        {/* ── Chrome shine (spotlight metálico) ─────────────────────────── */}
        {chrome && (
          <motion.div
            aria-hidden
            style={{
              position:     'absolute',
              inset:        0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              zIndex:       150,
              background:   shineGrad,
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {/* ── Holographic scan lines ──────────────────────────────────────── */}
        {holographic && (
          <div
            aria-hidden
            style={{
              position:     'absolute',
              inset:        0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              zIndex:       140,
              // Linhas horizontais sutis
              background: `
                repeating-linear-gradient(
                  0deg,
                  rgba(255,255,255,0.025) 0px,
                  rgba(255,255,255,0.025) 1px,
                  transparent 1px,
                  transparent 4px
                )
              `,
              mixBlendMode: 'overlay',
            }}
          />
        )}

        {/* ── Iridescent overlay ao hover (holographic color shift) ─────── */}
        {holographic && (
          <motion.div
            aria-hidden
            style={{
              position:     'absolute',
              inset:        0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              zIndex:       130,
              background: `linear-gradient(
                135deg,
                rgba(245,196,0,0.12)  0%,
                rgba(0,243,255,0.08)  25%,
                rgba(180,0,255,0.06)  50%,
                rgba(0,243,255,0.08)  75%,
                rgba(245,196,0,0.12)  100%
              )`,
              backgroundSize: '400% 400%',
              animation: 'holoShift 4s ease infinite',
              opacity: glowOpacity as any,
              mixBlendMode: 'color-dodge',
            }}
          />
        )}

        <style>{`
          @keyframes holoShift {
            0%   { background-position: 0% 50% }
            50%  { background-position: 100% 50% }
            100% { background-position: 0% 50% }
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
