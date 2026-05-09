'use client';

/**
 * PowerSurge — Overlay de vitória/pontuação AAA
 *
 * Ativado quando o usuário tem alta pontuação ou atinge milestone.
 * Efeitos:
 * - Flash dourado que envolve a tela inteira
 * - Ondas de energia irradiando do centro
 * - Texto "POWER SURGE" com chromatic aberration CSS
 * - Screen shake via GSAP
 *
 * Uso: <PowerSurge active={pts > 100} />
 */

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  active:  boolean;
  label?:  string;
  pts?:    number;
}

export default function PowerSurge({ active, label = 'POWER SURGE', pts }: Props) {
  const shakeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !shakeRef.current) return;
    // CSS shake sem GSAP para evitar dependência extra
    shakeRef.current.style.animation = 'none';
    void shakeRef.current.offsetHeight;
    shakeRef.current.style.animation = 'screenShake 0.5s ease-in-out';
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          ref={shakeRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, delay: 0.6 } }}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         9998,
            pointerEvents:  'none',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
          }}
        >
          {/* Vignette flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0], transition: { duration: 0.8, times: [0, 0.2, 1] } }}
            style={{
              position:   'absolute',
              inset:      0,
              background: 'radial-gradient(ellipse at center, rgba(245,196,0,0.35) 0%, transparent 70%)',
            }}
          />

          {/* Energy rings */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: 3 + i * 0.8, opacity: 0, transition: { duration: 0.9 + i * 0.15, delay: i * 0.12 } }}
              style={{
                position:  'absolute',
                width:     160,
                height:    160,
                borderRadius: '50%',
                border:    `2px solid ${i % 2 === 0 ? '#F5C400' : '#00F3FF'}`,
              }}
            />
          ))}

          {/* Text badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 20, delay: 0.1 } }}
            exit={{ scale: 1.2, opacity: 0, y: -30 }}
            style={{
              position:    'relative',
              background:  'linear-gradient(135deg, #1a1200, #0a0800)',
              border:      '2px solid #F5C400',
              borderRadius: 16,
              padding:     '16px 32px',
              textAlign:   'center',
              boxShadow:   '0 0 40px rgba(245,196,0,0.6), 0 0 80px rgba(245,196,0,0.3)',
            }}
          >
            <div style={{
              fontSize:      9,
              fontWeight:    900,
              color:         '#F5C400',
              letterSpacing: 4,
              textTransform: 'uppercase',
              marginBottom:  4,
              fontFamily:    "'Barlow Condensed', sans-serif",
            }}>
              {label}
            </div>
            {pts != null && (
              <div style={{
                fontSize:    44,
                fontWeight:  900,
                fontStyle:   'italic',
                color:       '#fff',
                lineHeight:  1,
                fontFamily:  "'Barlow Condensed', sans-serif",
                textShadow:  '0 0 20px rgba(245,196,0,0.8)',
              }}>
                {pts}
                <span style={{ fontSize: 16, color: '#F5C400', marginLeft: 4 }}>pts</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
