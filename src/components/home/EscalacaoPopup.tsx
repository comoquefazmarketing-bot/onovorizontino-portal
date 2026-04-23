'use client';
import { useState, useEffect } from 'react';

// ─── CONSTANTES EXTRAÍDAS DIRETAMENTE DO SEU JUMBOTRON ──────────────────────
const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red: '#FF2D55',
  glowGold: '0 0 8px rgba(245,196,0,0.6), 0 0 20px rgba(245,196,0,0.3)',
  glowCyan: '0 0 8px rgba(0,243,255,0.7), 0 0 20px rgba(0,243,255,0.35)',
};

export default function MiniJumbotronPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Dados do Jogo (Conforme o objeto Jogo enviado)
  const jogo = {
    rodada: "5ª RODADA",
    local: "ARENA PERNAMBUCO • PE",
    mandante: { nome: "SPORT RECIFE", escudo: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SPORT%20RECIFE.png" },
    visitante: { nome: "NOVORIZONTINO", escudo: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png" }
  };

  useEffect(() => {
    const storageKey = `v5_jumbo_popup`;
    if (!localStorage.getItem(storageKey)) {
      const t = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(storageKey, 'true');
      }, 6000); // Aparece após 6 segundos
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 500);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        
        @keyframes jumbo-slide-up {
          from { transform: translate(-50%, 120%) skewX(-6deg); opacity: 0; }
          to { transform: translate(-50%, 0) skewX(-6deg); opacity: 1; }
        }

        @keyframes led-scan-mini {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .jumbo-font { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
        .skew-fix { transform: skewX(6deg); }
      `}</style>

      {/* Overlay com Blur (DNS do seu site) */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.5s'
      }} />

      {/* MINI JUMBOTRON CONTAINER */}
      <div className="jumbo-font" style={{
        position: 'fixed', bottom: '40px', left: '50%', zIndex: 9999,
        width: '92%', maxWidth: '400px',
        animation: 'jumbo-slide-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transform: 'translateX(-50%) skewX(-6deg)',
        background: '#000',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '2px',
        boxShadow: '0 30px 60px rgba(0,0,0,0.9)',
        overflow: 'hidden'
      }}>
        
        {/* Barra de Scan LED Superior (Idêntica ao Jumbotron) */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: `linear-gradient(90deg, transparent, ${C.gold}, #fff, ${C.cyan}, transparent)`,
          backgroundSize: '200%', animation: 'led-scan-mini 3s linear infinite'
        }} />

        <div style={{ padding: '24px 20px', position: 'relative' }}>
          
          {/* Botão Fechar X */}
          <button onClick={close} style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
            fontSize: '18px', fontWeight: 900, cursor: 'pointer'
          }} className="skew-fix">✕</button>

          {/* Badge da Rodada */}
          <div style={{ 
            position: 'absolute', top: '15px', right: '15px', 
            background: 'rgba(245,196,0,0.1)', border: `1px solid ${C.gold}`, 
            color: C.gold, padding: '2px 8px', fontSize: '10px', fontWeight: 900 
          }} className="skew-fix">
            {jogo.rodada}
          </div>

          {/* Confronto Central (Alinhamento do Centro do Jumbotron) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '20px 0' }} className="skew-fix">
            <div style={{ textAlign: 'center' }}>
              <img src={jogo.mandante.escudo} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 900, marginTop: '5px' }}>SPORT</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, fontStyle: 'italic', color: 'rgba(245,196,0,0.1)' }}>VS</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img src={jogo.visitante.escudo} style={{ 
                width: '60px', height: '60px', objectFit: 'contain', 
                filter: `drop-shadow(0 0 10px ${C.gold}44)` 
              }} />
              <div style={{ color: C.gold, fontSize: '10px', fontWeight: 900, marginTop: '5px', textShadow: C.glowGold }}>NOVO</div>
            </div>
          </div>

          {/* Call to Action (Estilo Fantasy Station) */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }} className="skew-fix">
            <div style={{ fontSize: '9px', letterSpacing: '0.3em', color: C.cyan, marginBottom: '8px' }}>FANTASY STATION</div>
            <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.8, margin: 0 }}>
              CONVOCAR <br/>
              <span style={{ color: C.gold, fontSize: '38px', textShadow: C.glowGold }}>TITULARES</span>
            </h2>
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '10px' }}>{jogo.local}</div>
          </div>

          {/* Botão Principal (Gradiente Idêntico ao Jumbotron) */}
          <a href="/tigre-fc" style={{
            display: 'block',
            background: `linear-gradient(135deg, ${C.gold}, #D4A200)`,
            color: '#000',
            textAlign: 'center',
            padding: '16px',
            fontSize: '15px',
            fontWeight: 900,
            textDecoration: 'none',
            fontStyle: 'italic',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(245,196,0,0.4)',
            letterSpacing: '0.1em'
          }} className="skew-fix">
            ACESSAR VESTIÁRIO →
          </a>

        </div>
      </div>
    </>
  );
}
