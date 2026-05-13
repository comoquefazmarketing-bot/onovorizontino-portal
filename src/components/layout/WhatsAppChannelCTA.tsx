'use client';
import { useEffect, useState } from 'react';

const CHANNEL_URL = 'https://whatsapp.com/channel/0029VbCHacz2P59ioS22VU09';
const STORAGE_KEY  = 'wa_channel_dismissed_until';
const DISMISS_DAYS = 3;

export default function WhatsAppChannelCTA() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const until = localStorage.getItem(STORAGE_KEY);
    if (until && Date.now() < Number(until)) return;

    // Aparece após 20s OU após scroll de 400px — sem auto-pop imediato
    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      setVisible(true);
    };

    const onScroll = () => { if (window.scrollY > 400) show(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    const timer = setTimeout(show, 20000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  function dismiss() {
    const until = Date.now() + DISMISS_DAYS * 24 * 3600 * 1000;
    localStorage.setItem(STORAGE_KEY, String(until));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes wa-slide-up { from{opacity:0;transform:translateY(100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes wa-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,0.4)} 60%{box-shadow:0 0 0 10px rgba(37,211,102,0)} }
        .wa-bar { animation: wa-slide-up 0.4s cubic-bezier(.22,1,.36,1) forwards; }
        .wa-icon { animation: wa-pulse 2.5s ease-in-out 1.5s infinite; }
      `}</style>

      {/* ── Bottom bar ── */}
      <div
        className="wa-bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9990,
          background: 'linear-gradient(90deg,#0d1f13 0%,#0a1a10 100%)',
          borderTop: '1px solid rgba(37,211,102,0.25)',
          padding: expanded ? '12px 16px' : '0',
          height: expanded ? 'auto' : 0,
          overflow: 'hidden',
          transition: 'height 0.3s ease, padding 0.3s ease',
        }}
      >
        {expanded && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <p style={{ color:'#25D366', fontWeight:900, fontSize:13, textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:4 }}>
              Canal Oficial no WhatsApp
            </p>
            <p style={{ color:'#a1a1aa', fontSize:12, lineHeight:1.6, marginBottom:12 }}>
              Notícias, resultados e novidades do Novorizontino direto no seu WhatsApp.
              Sem spam — só o que importa para o torcedor do Tigre.
            </p>
            <a
              href={CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#25D366',
                color: '#fff',
                fontWeight: 900,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                padding: '10px 20px',
                borderRadius: 8,
                textDecoration: 'none',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.532 5.857L.057 23.882l6.198-1.467A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 01-5.001-1.374l-.36-.213-3.68.87.937-3.565-.235-.373A9.777 9.777 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
              </svg>
              Seguir o Canal
            </a>
            <button
              onClick={dismiss}
              style={{ marginLeft:12, background:'none', border:'none', color:'#52525b', fontSize:11, cursor:'pointer', textTransform:'uppercase', letterSpacing:'0.1em' }}
            >
              Agora não
            </button>
          </div>
        )}
      </div>

      {/* ── Pill flutuante (sempre visível enquanto não dispensado) ── */}
      <button
        className="wa-icon"
        onClick={() => setExpanded(e => !e)}
        style={{
          position: 'fixed',
          bottom: 92,
          right: 16,
          zIndex: 9991,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#25D366',
          color: '#fff',
          border: 'none',
          borderRadius: 999,
          padding: expanded ? '10px 16px 10px 12px' : '10px 14px',
          cursor: 'pointer',
          fontWeight: 900,
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
          transition: 'all 0.25s ease',
          whiteSpace: 'nowrap',
        }}
        aria-label="Canal do Tigre no WhatsApp"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.532 5.857L.057 23.882l6.198-1.467A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.796 9.796 0 01-5.001-1.374l-.36-.213-3.68.87.937-3.565-.235-.373A9.777 9.777 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
        </svg>
        {expanded ? 'Fechar' : 'Canal do Tigre'}
      </button>

      {/* ── X para dispensar permanentemente ── */}
      {!expanded && (
        <button
          onClick={dismiss}
          style={{
            position: 'fixed',
            bottom: 120,
            right: 14,
            zIndex: 9992,
            background: '#18181b',
            border: '1px solid #27272a',
            color: '#52525b',
            borderRadius: '50%',
            width: 18,
            height: 18,
            fontSize: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
          aria-label="Fechar"
        >
          ✕
        </button>
      )}
    </>
  );
}
