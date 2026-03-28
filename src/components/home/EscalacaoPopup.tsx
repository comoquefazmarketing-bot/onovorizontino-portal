'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const ESCUDO_NOVO  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_JUVEN = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/juventude.png';

const DEMO_SLOTS = [
  { x: 50, y: 88 }, { x: 82, y: 70 }, { x: 62, y: 70 },
  { x: 38, y: 70 }, { x: 18, y: 70 }, { x: 72, y: 50 },
  { x: 50, y: 46 }, { x: 28, y: 50 }, { x: 76, y: 24 },
  { x: 50, y: 18 }, { x: 24, y: 24 },
];

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    // Não mostra se já foi fechado nesta sessão
    if (sessionStorage.getItem('popup_escalacao_closed')) return;
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setPulse(p => !p), 900);
    return () => clearInterval(t);
  }, [visible]);

  const close = () => {
    setClosing(true);
    sessionStorage.setItem('popup_escalacao_closed', '1');
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          animation: closing ? 'fadeOut 0.35s forwards' : 'fadeIn 0.3s forwards',
        }}
      />

      {/* Popup */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        animation: closing ? 'slideDown 0.35s forwards' : 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}>
        <style>{`
          @keyframes fadeIn { from{opacity:0} to{opacity:1} }
          @keyframes fadeOut { from{opacity:1} to{opacity:0} }
          @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
          @keyframes slideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
          @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
          @keyframes popIn { 0%{transform:scale(0.8);opacity:0} 100%{transform:scale(1);opacity:1} }
        `}</style>

        <div style={{
          background: 'linear-gradient(160deg, #0f0f0f 0%, #1a1200 60%, #0f1a0f 100%)',
          borderRadius: '24px 24px 0 0',
          borderTop: '3px solid #F5C400',
          overflow: 'hidden',
          maxWidth: 540,
          margin: '0 auto',
          position: 'relative',
        }}>

          {/* Barras decorativas */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: 'linear-gradient(90deg, #F5C400, #fff, #F5C400)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite' }} />
          <div style={{ position: 'absolute', top: 0, left: 10, width: 3, height: '100%', background: '#F5C400', opacity: 0.4 }} />
          <div style={{ position: 'absolute', top: 0, right: 10, width: 3, height: '#F5C400', opacity: 0.4 }} />

          {/* Fechar */}
          <button onClick={close} style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#666', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            ✕
          </button>

          <div style={{ padding: '24px 20px 32px' }}>

            {/* Badge HOJE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: pulse ? '0 0 8px #ef4444' : 'none', transition: 'box-shadow 0.4s' }} />
              <span style={{ fontSize: 10, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Hoje • 21h30</span>
              <span style={{ fontSize: 10, color: '#555', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Copa Sul-Sudeste</span>
            </div>

            {/* Confronto */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>

              {/* Juventude */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <img src={ESCUDO_JUVEN} alt="Juventude" style={{ width: 56, height: 56, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }} />
                <span style={{ fontSize: 10, color: '#aaa', fontWeight: 900, textTransform: 'uppercase' }}>Juventude</span>
              </div>

              {/* Meio campo decorativo */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                {/* Mini campo */}
                <div style={{ width: 80, height: 52, borderRadius: 6, overflow: 'hidden', background: '#2d8a2d', position: 'relative', border: '1.5px solid rgba(255,255,255,0.15)', animation: 'popIn 0.5s 0.2s both' }}>
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
                    {[0,1,2,3].map(i => <rect key={i} x="0" y={i*26} width="68" height="13" fill={i%2===0?'rgba(255,255,255,0.05)':'transparent'} />)}
                    <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                    <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                  </svg>
                  {DEMO_SLOTS.map((s, i) => (
                    <div key={i} style={{
                      position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
                      transform: 'translate(-50%,-50%)',
                      width: 7, height: 7, borderRadius: '50%',
                      background: i < 6 ? '#F5C400' : '#fff',
                      border: '1px solid rgba(0,0,0,0.5)',
                      boxShadow: pulse && i % 2 === 0 ? '0 0 5px #F5C400' : 'none',
                      transition: 'box-shadow 0.4s',
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#F5C400' }}>VS</span>
              </div>

              {/* Novorizontino */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <img src={ESCUDO_NOVO} alt="Novorizontino" style={{ width: 56, height: 56, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(245,196,0,0.3))' }} />
                <span style={{ fontSize: 10, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase' }}>Novorizontino</span>
              </div>
            </div>

            {/* Headline */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>
                QUAL É SUA<br />
                <span style={{ color: '#F5C400' }}>ESCALAÇÃO IDEAL?</span>
              </h2>
              <p style={{ fontSize: 13, color: '#777', lineHeight: 1.4 }}>
                Monte os 11, gere o story e desafie seus amigos.<br />Quem você coloca pra jogar hoje?
              </p>
            </div>

            {/* CTA principal */}
            <Link
              href="/escalacao"
              onClick={close}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '16px',
                background: '#F5C400', color: '#000',
                fontWeight: 900, fontSize: 14,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                borderRadius: 12, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(245,196,0,0.35)',
              }}
            >
              <span style={{ fontSize: 20 }}>⚽</span>
              MONTAR MINHA ESCALAÇÃO
            </Link>

            {/* CTA secundário */}
            <button
              onClick={close}
              style={{ width: '100%', marginTop: 10, padding: '10px', background: 'none', border: 'none', color: '#444', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
