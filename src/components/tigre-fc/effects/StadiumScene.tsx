'use client';

/**
 * StadiumScene — Motor de partículas Canvas 2D puro
 *
 * Zero dependências externas — usa apenas requestAnimationFrame + Canvas 2D API.
 * Compatível com React 19.
 *
 * Efeitos:
 * - 220 partículas gold/cyan/white em órbita elíptica 3D simulada (perspectiva)
 * - Glow por partícula com radialGradient
 * - Anel de energia girando (arco + gradiente)
 * - 2 halos pulsantes de luz de estádio (ouro + cyan)
 * - Fundo: 120 estrelas fixas com cintilação
 */

import { useEffect, useRef } from 'react';

interface Particle {
  theta:   number;   // ângulo orbital atual
  speed:   number;   // velocidade angular
  radius:  number;   // raio horizontal do elipso
  radiusZ: number;   // raio do eixo Z (profundidade)
  y:       number;   // altura fixa na cena
  size:    number;   // tamanho base
  color:   string;   // 'gold' | 'cyan' | 'white'
  opacity: number;
}

interface Star {
  x: number; y: number;
  r: number;
  blink: number; blinkSpeed: number;
}

const GOLD  = '#F5C400';
const CYAN  = '#00F3FF';

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    theta:   Math.random() * Math.PI * 2,
    speed:   (0.008 + Math.random() * 0.014) * (Math.random() > 0.5 ? 1 : -1),
    radius:  60 + Math.random() * 180,
    radiusZ: 0.25 + Math.random() * 0.4,
    y:       (Math.random() - 0.5) * 160,
    size:    1 + Math.random() * 2.5,
    color:   i % 5 === 0 ? 'cyan' : i % 11 === 0 ? 'white' : 'gold',
    opacity: 0.4 + Math.random() * 0.6,
  }));
}

function makeStars(count: number, w: number, h: number): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 0.3 + Math.random() * 0.9,
    blink:      Math.random(),
    blinkSpeed: 0.003 + Math.random() * 0.007,
  }));
}

export default function StadiumScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t   = 0;

    // Ajusta tamanho ao container
    const resize = () => {
      canvas.width  = canvas.offsetWidth  || 400;
      canvas.height = canvas.offsetHeight || 200;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const particles = makeParticles(220);
    const stars     = makeStars(120, canvas.width, canvas.height);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      // Limpar
      ctx.clearRect(0, 0, W, H);

      // ── Estrelas ──────────────────────────────────────────
      stars.forEach(s => {
        s.blink += s.blinkSpeed;
        const alpha = 0.2 + Math.abs(Math.sin(s.blink)) * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      // ── Halo de luz de estádio (ouro + cyan) ─────────────
      const haloA = 0.04 + Math.abs(Math.sin(t * 0.9)) * 0.04;
      const gGold = ctx.createRadialGradient(cx * 0.7, cy * 0.5, 0, cx * 0.7, cy * 0.5, W * 0.55);
      gGold.addColorStop(0, `rgba(245,196,0,${haloA})`);
      gGold.addColorStop(1, 'rgba(245,196,0,0)');
      ctx.fillStyle = gGold;
      ctx.fillRect(0, 0, W, H);

      const haloB = 0.025 + Math.abs(Math.sin(t * 0.7 + Math.PI)) * 0.03;
      const gCyan = ctx.createRadialGradient(cx * 1.3, cy * 0.6, 0, cx * 1.3, cy * 0.6, W * 0.45);
      gCyan.addColorStop(0, `rgba(0,243,255,${haloB})`);
      gCyan.addColorStop(1, 'rgba(0,243,255,0)');
      ctx.fillStyle = gCyan;
      ctx.fillRect(0, 0, W, H);

      // ── Anel de energia (perspectiva oval) ────────────────
      const ringA  = 0.08 + Math.abs(Math.sin(t * 0.8)) * 0.07;
      const ringRX = W * 0.42;
      const ringRY = H * 0.22 + Math.sin(t * 0.4) * H * 0.04;
      const ringOff = (t * 0.18) % (Math.PI * 2);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(t * 0.15) * 0.08);

      // Anel principal dourado
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRX, ringRY, 0, ringOff, ringOff + Math.PI * 1.85);
      ctx.strokeStyle = `rgba(245,196,0,${ringA})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Anel secundário cyan
      const r2A = 0.05 + Math.abs(Math.sin(t * 1.1 + 1)) * 0.05;
      ctx.beginPath();
      ctx.ellipse(0, 0, ringRX * 0.72, ringRY * 0.72, 0.3, -ringOff, -ringOff + Math.PI * 1.6);
      ctx.strokeStyle = `rgba(0,243,255,${r2A})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();

      // ── Partículas em órbita ───────────────────────────────
      // Ordena por profundidade (Z) para pseudo-3D
      const sorted = [...particles].sort((a, b) => {
        const zA = Math.sin(a.theta) * a.radiusZ;
        const zB = Math.sin(b.theta) * b.radiusZ;
        return zA - zB;
      });

      sorted.forEach(p => {
        p.theta += p.speed * (1 + t * 0.0001);

        // Perspectiva: partículas "atrás" ficam menores e mais escuras
        const z        = Math.sin(p.theta) * p.radiusZ;  // -1 a 1
        const scale    = 0.5 + (z + 1) * 0.35;
        const depthAlpha = 0.35 + (z + 1) * 0.325;

        const px = cx + Math.cos(p.theta) * p.radius * (W / 800);
        const py = cy + p.y * (H / 200) + z * 12;
        const ps = p.size * scale * (W / 800);

        if (ps < 0.3) return;

        const color = p.color === 'cyan'  ? CYAN
                    : p.color === 'white' ? '#ffffff'
                    : GOLD;

        const alpha = p.opacity * depthAlpha;

        // Glow suave em torno da partícula
        if (ps > 1) {
          ctx.beginPath();
          ctx.arc(px, py, ps * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color === 'gold'  ? `rgba(245,196,0,${alpha * 0.25})`
                        : p.color === 'cyan'  ? `rgba(0,243,255,${alpha * 0.25})`
                        : `rgba(255,255,255,${alpha * 0.2})`;
          ctx.fill();
        }

        // Core da partícula
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, ps), 0, Math.PI * 2);
        ctx.fillStyle = color === GOLD   ? `rgba(245,196,0,${alpha})`
                      : color === CYAN   ? `rgba(0,243,255,${alpha})`
                      : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    />
  );
}
