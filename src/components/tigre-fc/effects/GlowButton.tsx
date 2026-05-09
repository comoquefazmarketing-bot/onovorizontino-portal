'use client';

/**
 * GlowButton — Botão AAA ultra-premium
 *
 * Efeitos:
 * - Press 3D: translateY + shadow collapse no click
 * - Glow pulsante ao redor do botão
 * - Shine sweep que percorre o botão em loop
 * - Ripple no ponto de click
 * - Variant: gold | cyan | ghost | danger
 */

import { useRef, useCallback, ReactNode } from 'react';
import { motion } from 'framer-motion';

type Variant = 'gold' | 'cyan' | 'ghost' | 'danger';

interface GlowButtonProps {
  children:   ReactNode;
  onClick?:   (e: React.MouseEvent) => void;
  variant?:   Variant;
  size?:      'sm' | 'md' | 'lg';
  disabled?:  boolean;
  fullWidth?: boolean;
  style?:     React.CSSProperties;
  className?: string;
}

const VARIANTS: Record<Variant, { bg: string; color: string; glow: string; border: string }> = {
  gold:   { bg: 'linear-gradient(135deg, #F5C400 0%, #D4A200 60%, #F5C400 100%)', color: '#000', glow: 'rgba(245,196,0,0.65)',  border: '#F5C400' },
  cyan:   { bg: 'linear-gradient(135deg, #00F3FF 0%, #0095FF 60%, #00F3FF 100%)', color: '#000', glow: 'rgba(0,243,255,0.5)',   border: '#00F3FF' },
  ghost:  { bg: 'rgba(255,255,255,0.03)',                                          color: '#fff', glow: 'rgba(255,255,255,0.2)', border: 'rgba(255,255,255,0.15)' },
  danger: { bg: 'linear-gradient(135deg, #FF2244 0%, #CC0022 60%, #FF2244 100%)', color: '#fff', glow: 'rgba(255,34,68,0.6)',   border: '#FF2244' },
};

const SIZES = {
  sm: { padding: '8px 16px',  fontSize: 11, borderRadius: 10 },
  md: { padding: '14px 24px', fontSize: 13, borderRadius: 14 },
  lg: { padding: '18px 32px', fontSize: 15, borderRadius: 16 },
};

export default function GlowButton({
  children, onClick, variant = 'gold', size = 'md',
  disabled = false, fullWidth = false, style, className,
}: GlowButtonProps) {
  const v  = VARIANTS[variant];
  const sz = SIZES[size];
  const btnRef = useRef<HTMLButtonElement>(null!);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (disabled) return;
    // Ripple effect
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const d = Math.max(rect.width, rect.height) * 2;
      Object.assign(ripple.style, {
        position:     'absolute',
        width:        `${d}px`,
        height:       `${d}px`,
        borderRadius: '50%',
        background:   v.color === '#000' ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)',
        left:         `${e.clientX - rect.left - d / 2}px`,
        top:          `${e.clientY - rect.top  - d / 2}px`,
        transform:    'scale(0)',
        animation:    'glowRipple 0.5s ease-out forwards',
        pointerEvents: 'none',
        zIndex:       '10',
      });
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    }
    onClick?.(e);
  }, [disabled, onClick, v.color]);

  return (
    <motion.button
      ref={btnRef}
      whileTap={disabled ? {} : { scale: 0.95, y: 2 }}
      whileHover={disabled ? {} : { scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      onClick={handleClick}
      disabled={disabled}
      className={className}
      style={{
        ...sz,
        background:   disabled ? '#1a1a1a' : v.bg,
        backgroundSize: '200% 100%',
        color:        disabled ? '#333' : v.color,
        border:       `1.5px solid ${disabled ? '#2a2a2a' : v.border}`,
        fontWeight:   900,
        fontFamily:   "'Barlow Condensed', system-ui, sans-serif",
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        cursor:       disabled ? 'not-allowed' : 'pointer',
        width:        fullWidth ? '100%' : undefined,
        position:     'relative',
        overflow:     'hidden',
        boxShadow:    disabled ? 'none' : `0 4px 20px ${v.glow}, 0 0 0 0 ${v.glow}`,
        animation:    disabled ? 'none' : `glowPulseBtn 2.5s ease-in-out infinite`,
        transition:   'background 0.3s',
        ...style,
      }}
    >
      {/* Shine sweep */}
      {!disabled && (
        <span style={{
          position:   'absolute',
          top:        0,
          left:       '-100%',
          width:      '60%',
          height:     '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          animation:  'btnShineSweep 2.8s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
      )}
      <span style={{ position: 'relative', zIndex: 2 }}>{children}</span>
    </motion.button>
  );
}

// CSS injetado globalmente — colocado em globals.css é mais eficiente,
// mas injetamos aqui para encapsulamento total do componente.
if (typeof document !== 'undefined') {
  const id = '__glow-button-styles';
  if (!document.getElementById(id)) {
    const s = document.createElement('style');
    s.id = id;
    s.textContent = `
      @keyframes glowRipple {
        to { transform: scale(1); opacity: 0; }
      }
      @keyframes btnShineSweep {
        0%   { left: -100%; opacity: 0; }
        20%  { opacity: 1; }
        60%  { left: 120%; opacity: 0; }
        100% { left: 120%; opacity: 0; }
      }
      @keyframes glowPulseBtn {
        0%,100% { box-shadow: 0 4px 20px var(--btn-glow), 0 0 0 0 var(--btn-glow); }
        50%     { box-shadow: 0 6px 32px var(--btn-glow), 0 0 12px 4px var(--btn-glow-soft); }
      }
    `;
    document.head.appendChild(s);
  }
}
