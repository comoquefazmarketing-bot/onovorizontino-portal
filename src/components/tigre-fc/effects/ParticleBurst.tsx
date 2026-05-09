'use client';

/**
 * ParticleBurst — Explosão de partículas CSS puras (sem WebGL)
 *
 * Disparado on-demand via ref ou por props.
 * Cada "burst" cria 24 partículas gold/cyan que explodem do centro
 * com physics simulada por CSS animation + random angles.
 *
 * Uso:
 *   const burstRef = useRef<ParticleBurstHandle>(null);
 *   <ParticleBurst ref={burstRef} />
 *   onClick={() => burstRef.current?.fire(x, y)}
 */

import {
  forwardRef, useImperativeHandle, useState, useCallback, useRef,
} from 'react';

export interface ParticleBurstHandle {
  fire: (x?: number, y?: number) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  dist: number;
  size: number;
  color: string;
  duration: number;
}

const COLORS = [
  '#F5C400', '#FFD700', '#FFC107',
  '#00F3FF', '#00BFFF', '#FFFFFF',
];

let nextId = 0;

const ParticleBurst = forwardRef<ParticleBurstHandle>(function ParticleBurst(_, ref) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fire = useCallback((x = 0, y = 0) => {
    const count = 28;
    const burst: Particle[] = Array.from({ length: count }, (_, i) => ({
      id:       nextId++,
      x,
      y,
      angle:    (i / count) * 360 + Math.random() * 12,
      dist:     60 + Math.random() * 80,
      size:     3 + Math.random() * 5,
      color:    COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 0.6 + Math.random() * 0.5,
    }));

    setParticles(prev => [...prev, ...burst]);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setParticles(prev => prev.filter(p => !burst.some(b => b.id === p.id)));
    }, 1200);
  }, []);

  useImperativeHandle(ref, () => ({ fire }), [fire]);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map(p => {
        const rad = (p.angle * Math.PI) / 180;
        const dx  = Math.cos(rad) * p.dist;
        const dy  = Math.sin(rad) * p.dist;

        return (
          <div
            key={p.id}
            style={{
              position:  'absolute',
              left:       p.x,
              top:        p.y,
              width:      p.size,
              height:     p.size,
              borderRadius: '50%',
              background:   p.color,
              boxShadow:    `0 0 ${p.size * 2}px ${p.color}`,
              transform:    'translate(-50%, -50%)',
              animation:    `pBurst ${p.duration}s cubic-bezier(.2,.8,.2,1) forwards`,
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
            } as React.CSSProperties}
          />
        );
      })}

      <style>{`
        @keyframes pBurst {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          60%  { opacity: 0.8; }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
});

export default ParticleBurst;
