'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Posições simuladas para animar no campo decorativo
const DEMO_SLOTS = [
  { x: 50, y: 88 }, { x: 82, y: 70 }, { x: 62, y: 70 },
  { x: 38, y: 70 }, { x: 18, y: 70 }, { x: 72, y: 50 },
  { x: 50, y: 46 }, { x: 28, y: 50 }, { x: 76, y: 24 },
  { x: 50, y: 18 }, { x: 24, y: 24 },
];

export default function EscalacaoHero() {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ minHeight: 420 }}>

      {/* Fundo campo inclinado — efeito cinemático */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, #F5C400 0%, #F5C400 45%, #000 45%)',
        zIndex: 0,
      }} />

      {/* Campo miniatura decorativo à direita */}
      <div style={{
        position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%) rotate(-8deg)',
        width: 220, height: 340, background: '#2d8a2d', borderRadius: 10, opacity: 0.85,
        border: '2px solid rgba(255,255,255,0.2)', overflow: 'hidden', zIndex: 1,
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
          {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.06)':'transparent'} />)}
          <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
          <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
          <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.6" />
          <rect x="13.84" y="3" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
          <rect x="13.84" y="83.68" width="40.32" height="18.32" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />
        </svg>
        {/* Pontos animados representando jogadores */}
        {DEMO_SLOTS.map((s, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${s.x}%`, top: `${s.y}%`,
            transform: 'translate(-50%,-50%)',
            width: 14, height: 14, borderRadius: '50%',
            background: '#F5C400',
            border: '2px solid #000',
            boxShadow: pulse && i % 3 === 0 ? '0 0 8px #F5C400' : 'none',
            transition: 'box-shadow 0.4s',
          }} />
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 flex flex-col justify-center" style={{ minHeight: 420 }}>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-4 self-start">
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#000', animation: pulse ? 'none' : 'none' }}
            className={pulse ? 'opacity-100' : 'opacity-40'}
          />
          <span style={{ fontSize: 10, fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
            Novo no Portal
          </span>
        </div>

        {/* Headline */}
        <h2 style={{
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 900, fontStyle: 'italic',
          textTransform: 'uppercase',
          letterSpacing: '-0.03em',
          lineHeight: 0.9,
          color: '#000',
          maxWidth: 480,
          marginBottom: 8,
        }}>
          MONTE SUA<br />
          <span style={{ color: '#fff', WebkitTextStroke: '2px #000' }}>ESCALAÇÃO</span><br />
          IDEAL
        </h2>

        <p style={{ fontSize: 14, color: '#000', fontWeight: 700, marginBottom: 28, maxWidth: 340, lineHeight: 1.4, opacity: 0.75 }}>
          Escolha os 11 titulares, defina a formação e gere um story pronto para o Instagram. Desafie seus amigos!
        </p>

        {/* CTA */}
        <div className="flex items-center gap-4 flex-wrap">
          <Link href="/escalacao"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: '#000', color: '#F5C400',
              padding: '14px 28px',
              fontWeight: 900, fontSize: 13,
              textTransform: 'uppercase', letterSpacing: '0.08em',
              borderRadius: 4,
              boxShadow: '4px 4px 0px rgba(0,0,0,0.3)',
              transition: 'transform 0.15s',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 18 }}>⚽</span>
            MONTAR AGORA
          </Link>

          {/* Ícones sociais pequenos */}
          <div className="flex items-center gap-2 opacity-60">
            <span style={{ fontSize: 11, color: '#000', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Compartilhe em</span>
            {/* Instagram */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            {/* WhatsApp */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            {/* X/Twitter */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </div>
        </div>

        {/* Contagem de escalações — social proof */}
        <div className="flex items-center gap-2 mt-5">
          <div className="flex -space-x-2">
            {['#F5C400','#000','#2d8a2d'].map((c, i) => (
              <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: '2px solid #F5C400' }} />
            ))}
          </div>
          <span style={{ fontSize: 11, color: '#000', fontWeight: 700 }}>
            Torcedores já montaram a escalação hoje!
          </span>
        </div>
      </div>
    </section>
  );
}
