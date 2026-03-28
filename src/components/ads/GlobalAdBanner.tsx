'use client';
import { useState, useEffect, useRef } from 'react';

const BORALA_MOBILE  = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/BORALA%20MOBILE%20(320%20x%20100%20px).mp4";
const BORALA_MOBILE2 = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/BORALA%20MOBILE%202%20(320%20x%20100%20px).mp4";
const BORALA_DESKTOP = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/BORALA%20DESKTOP%20(1280%20x%20100%20px).mp4";
const BORALA_DESKTOP2= "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/BORALA%20DESKTOP%202%20(1280%20x%20100%20px).mp4";
const JG_MOBILE      = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JG%20MOBILE%20(320%20x%20100%20px)%20(1).mp4";
const JG_DESKTOP     = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JG%20SNEAKERS(1280%20x%20100%20px).mp4";
const JG_WA          = `https://wa.me/5517992659293?text=${encodeURIComponent('Oi! Vi o anúncio da JG Sneakers no Portal O Novorizontino e quero saber mais! 🐯👟')}`;

type Slot = 'borala' | 'borala2' | 'jg' | 'cta';
const SEQUENCE: Slot[] = ['borala', 'borala2', 'jg', 'cta'];
const DURATION = 10000;

export default function GlobalAdBanner() {
  const [slot, setSlot] = useState<Slot>('borala');
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlot(prev => {
        const idx = SEQUENCE.indexOf(prev);
        return SEQUENCE[(idx + 1) % SEQUENCE.length];
      });
    }, DURATION);
    return () => clearInterval(timer);
  }, []);

  // Força play no vídeo ativo
  useEffect(() => {
    const key = `${slot}-${isMobile ? 'mobile' : 'desktop'}`;
    const video = videoRefs.current[key];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [slot, isMobile]);

  const height = isMobile ? 160 : 100;

  const slotData: Record<Slot, { href: string; mobileSrc: string; desktopSrc: string } | null> = {
    borala:  { href: 'https://www.borala.app.br/', mobileSrc: BORALA_MOBILE,  desktopSrc: BORALA_DESKTOP  },
    borala2: { href: 'https://www.borala.app.br/', mobileSrc: BORALA_MOBILE2, desktopSrc: BORALA_DESKTOP2 },
    jg:      { href: JG_WA,                        mobileSrc: JG_MOBILE,      desktopSrc: JG_DESKTOP },
    cta:     null,
  };

  return (
    <div style={{ width: '100%', background: '#000', borderBottom: '1px solid #18181b' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '8px 16px' }}>

        <p style={{ fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#3f3f46', textAlign: 'center', marginBottom: 4 }}>
          PUBLICIDADE
        </p>

        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', borderRadius: 4, height }}>

          {/* ── Slots de vídeo ── */}
          {(Object.keys(slotData) as Slot[]).filter(s => slotData[s] !== null).map(s => {
            const data = slotData[s]!;
            const src = isMobile ? data.mobileSrc : data.desktopSrc;
            const key = `${s}-${isMobile ? 'mobile' : 'desktop'}`;
            return (
              <a
                key={s}
                href={data.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  position: 'absolute', inset: 0,
                  opacity: slot === s ? 1 : 0,
                  pointerEvents: slot === s ? 'auto' : 'none',
                  transition: 'opacity 0.7s ease',
                  display: 'block',
                }}
              >
                <video
                  ref={el => { videoRefs.current[key] = el; }}
                  src={src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </a>
            );
          })}

          {/* ── CTA Anuncie ── */}
          <a
            href="https://wa.me/5517988031679?text=Olá Felipe, vi o Portal O Novorizontino e quero anunciar para os torcedores do Tigre!"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'absolute', inset: 0,
              opacity: slot === 'cta' ? 1 : 0,
              pointerEvents: slot === 'cta' ? 'auto' : 'none',
              transition: 'opacity 0.7s ease',
              background: 'linear-gradient(135deg,#0a0a0a 0%,#111 40%,#1a1400 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 32px',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, opacity: 0.2, background: 'repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(245,196,0,0.15) 40px,rgba(245,196,0,0.15) 41px)' }} />
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span style={{ fontSize: 18 }}>🟡</span>
                <span style={{ fontSize: 18 }}>⚫</span>
              </div>
              <div>
                <p style={{ fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', color: '#fff', fontSize: 'clamp(0.9rem,2.5vw,1.5rem)', letterSpacing: '-0.02em', lineHeight: 1, margin: 0 }}>
                  SUA MARCA NO <span style={{ color: '#F5C400' }}>CORAÇÃO DO TIGRE</span>
                </p>
                <p style={{ color: '#71717a', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: 4 }}>
                  Alcance milhares de torcedores de Novo Horizonte
                </p>
              </div>
            </div>
            {!isMobile && (
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#52525b', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Comercial</p>
                  <p style={{ color: '#fff', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', margin: 0 }}>Felipe Makarios</p>
                  <p style={{ color: '#F5C400', fontSize: 10, fontWeight: 700, margin: 0 }}>(17) 98803-1679</p>
                </div>
                <div style={{ background: '#F5C400', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ color: '#000', fontWeight: 900, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>QUERO ANUNCIAR →</span>
                </div>
              </div>
            )}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#F5C400' }} />
            <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 4, background: '#F5C400' }} />
          </a>

          {/* Indicadores */}
          <div style={{ position: 'absolute', bottom: 6, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6, zIndex: 20, pointerEvents: 'none' }}>
            {SEQUENCE.map(s => (
              <div key={s} style={{ borderRadius: 9999, transition: 'all 0.5s', height: 4, width: slot === s ? 16 : 4, background: slot === s ? '#F5C400' : 'rgba(255,255,255,0.25)' }} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
