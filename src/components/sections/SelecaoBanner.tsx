'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/* ─── partículas de confete ─── */
const CORES = ['#009c3b', '#ffdf00', '#002776', '#ffffff', '#00c94a', '#ffd700'];

interface Particula {
  id: number;
  x: number;
  size: number;
  delay: number;
  dur: number;
  color: string;
  shape: 'square' | 'circle' | 'line';
}

export default function SelecaoBanner() {
  const [particulas, setParticulas] = useState<Particula[]>([]);

  useEffect(() => {
    setParticulas(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 4 + Math.random() * 6,
        delay: Math.random() * 5,
        dur: 5 + Math.random() * 6,
        color: CORES[Math.floor(Math.random() * CORES.length)],
        shape: (['square', 'circle', 'line'] as const)[Math.floor(Math.random() * 3)],
      }))
    );
  }, []);

  return (
    <>
      <style>{`
        @keyframes sb-fall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 0.9; }
          100% { transform: translateY(340px) rotate(600deg); opacity: 0; }
        }
        @keyframes sb-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sb-pulse-btn {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,156,59,0.7), 0 0 40px rgba(255,223,0,0.3); }
          50%       { box-shadow: 0 0 0 18px rgba(0,156,59,0), 0 0 60px rgba(255,223,0,0.5); }
        }
        @keyframes sb-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
        @keyframes sb-stars {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 0.6; }
          100% { transform: translateY(-60px) rotate(360deg); opacity: 0; }
        }
        @keyframes sb-flag-wave {
          0%, 100% { transform: skewX(0deg) scaleY(1); }
          25%       { transform: skewX(1deg) scaleY(1.01); }
          75%       { transform: skewX(-1deg) scaleY(0.99); }
        }
        .sb-btn {
          animation: sb-pulse-btn 2.2s ease-in-out infinite;
          background: linear-gradient(
            90deg,
            #007a2e 0%, #009c3b 20%, #00c94a 40%,
            #ffdf00 55%, #ffd000 70%,
            #009c3b 85%, #007a2e 100%
          );
          background-size: 200% auto;
          animation: sb-pulse-btn 2.2s ease-in-out infinite,
                     sb-shimmer 3s linear infinite;
        }
        .sb-btn:hover {
          filter: brightness(1.15) saturate(1.2);
          transform: scale(1.04) translateY(-2px);
        }
        .sb-title {
          background: linear-gradient(90deg, #009c3b, #ffdf00, #ffffff, #ffdf00, #009c3b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: sb-shimmer 4s linear infinite;
        }
        .sb-flag { animation: sb-flag-wave 3s ease-in-out infinite; }
      `}</style>

      <section
        aria-label="Seção especial Seleção Brasileira — Copa do Mundo 2026"
        className="relative overflow-hidden w-full"
        style={{
          background: 'linear-gradient(160deg, #010e04 0%, #020f06 40%, #010a18 70%, #020810 100%)',
          borderTop: '1px solid rgba(0,156,59,0.2)',
          borderBottom: '1px solid rgba(255,223,0,0.15)',
        }}
      >
        {/* ── fundo diagonal ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(-55deg, transparent, transparent 10px, rgba(255,223,0,0.02) 10px, rgba(255,223,0,0.02) 20px)',
          }}
          aria-hidden="true"
        />

        {/* ── glow verde esq ── */}
        <div
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,156,59,0.18) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        {/* ── glow amarelo dir ── */}
        <div
          className="absolute -right-20 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,223,0,0.12) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        {/* ── glow central azul ── */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[600px] h-32 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,39,118,0.25) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        {/* ── confetes ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {particulas.map(p => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: '-10px',
                width: p.shape === 'line' ? '2px' : `${p.size}px`,
                height: p.shape === 'line' ? `${p.size * 3}px` : `${p.size}px`,
                borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? '1px' : '1px',
                backgroundColor: p.color,
                animationName: 'sb-fall',
                animationDuration: `${p.dur}s`,
                animationDelay: `${p.delay}s`,
                animationIterationCount: 'infinite',
                animationTimingFunction: 'linear',
              }}
            />
          ))}
        </div>

        {/* ── conteúdo ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">

          {/* Bandeira animada + troféu */}
          <div className="flex-shrink-0 flex items-center gap-3 select-none" aria-hidden="true">
            <span className="sb-flag text-6xl md:text-8xl drop-shadow-2xl">🇧🇷</span>
            <div className="flex flex-col gap-1">
              <span style={{ animation: 'sb-glow 2s ease-in-out infinite', display: 'inline-block', fontSize: '2.2rem' }}>🏆</span>
              <span style={{ animation: 'sb-glow 2s ease-in-out 0.7s infinite', display: 'inline-block', fontSize: '1.4rem', textAlign: 'center' }}>⚽</span>
              <span style={{ animation: 'sb-glow 2s ease-in-out 1.4s infinite', display: 'inline-block', fontSize: '1rem', textAlign: 'center' }}>⭐</span>
            </div>
          </div>

          {/* Texto central */}
          <div className="flex-1 text-center md:text-left">

            {/* Badge topo */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4 border"
              style={{ background: 'rgba(0,39,118,0.6)', borderColor: 'rgba(255,223,0,0.35)', backdropFilter: 'blur(8px)' }}>
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: '#ffdf00', boxShadow: '0 0 8px #ffdf00', animation: 'sb-glow 1.2s ease-in-out infinite' }}
              />
              <span style={{ color: '#ffdf00', fontSize: '10px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                Copa do Mundo 2026 · Convocação Ancelotti
              </span>
            </div>

            {/* Título shimmer */}
            <h2
              className="sb-title font-black uppercase leading-none mb-3"
              style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', letterSpacing: '0.04em' }}
            >
              VERDE E AMARELO
            </h2>

            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto 0' }}
              className="md:mx-0">
              Seleção convocada, agenda de jogos, elenco completo e a contagem regressiva para o{' '}
              <strong style={{ color: '#ffdf00' }}>hexacampeonato</strong>.
              Acompanhe tudo no portal.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <Link
              href="/selecao"
              className="sb-btn relative inline-flex items-center gap-3 rounded-full font-black uppercase tracking-wider text-black px-8 py-4 md:px-10 md:py-5 text-sm md:text-base transition-all duration-200 no-underline overflow-hidden"
              style={{ minWidth: '200px', justifyContent: 'center' }}
              aria-label="Ver seção especial Verde e Amarelo — Seleção Brasileira"
            >
              {/* reflexo interno */}
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }}
                aria-hidden="true"
              />
              <span className="text-xl" aria-hidden="true">🇧🇷</span>
              <span className="relative z-10">VER SELEÇÃO</span>
              <span className="relative z-10 text-lg" aria-hidden="true">→</span>
            </Link>

            {/* estrelas Copa */}
            <div className="flex items-center gap-1" aria-label="5 estrelas — pentacampeão mundial">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  style={{
                    color: '#ffdf00',
                    fontSize: '12px',
                    animation: `sb-glow 1.5s ease-in-out ${i * 0.15}s infinite`,
                    display: 'inline-block',
                  }}
                  aria-hidden="true"
                >★</span>
              ))}
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginLeft: '6px' }}>
                Pentacampeão
              </span>
            </div>
          </div>

        </div>

        {/* ── borda brilhante inferior (faixa brasil) ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[3px] pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, #009c3b 20%, #ffdf00 50%, #002776 80%, transparent)' }}
          aria-hidden="true"
        />
      </section>
    </>
  );
}
