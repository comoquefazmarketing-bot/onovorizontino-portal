'use client';
import { useState, useEffect } from 'react';

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Delay de 8 segundos e trava de 1x por rodada (ID 5)
    const storageKey = `visto_r5`;
    if (!localStorage.getItem(storageKey)) {
      const t = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(storageKey, 'true');
      }, 8000);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 400);
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        
        .jumbotron-theme {
          font-family: 'Barlow Condensed', sans-serif;
          text-transform: uppercase;
        }

        @keyframes slideJumbo {
          from { transform: translate(-50%, 100%) skewX(-6deg); opacity: 0; }
          to { transform: translate(-50%, 0) skewX(-6deg); opacity: 1; }
        }

        .glow-yellow { text-shadow: 0 0 15px rgba(245, 196, 0, 0.6); }
        .glow-cyan { color: #00F3FF; text-shadow: 0 0 10px rgba(0, 243, 255, 0.5); }
        .btn-glow { box-shadow: 0 0 25px rgba(245, 196, 0, 0.5); }
      `}</style>

      {/* Overlay Escuro com Blur */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.4s'
      }} />

      {/* Mini Jumbotron Fiel ao Design */}
      <div className="jumbotron-theme" style={{
        position: 'fixed', bottom: '40px', left: '50%', zIndex: 9999,
        width: '90%', maxWidth: '420px',
        animation: 'slideJumbo 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transform: 'translateX(-50%) skewX(-6deg)'
      }}>
        
        <div style={{
          background: '#050505',
          border: '2px solid #F5C400',
          padding: '25px',
          position: 'relative',
          boxShadow: '0 30px 60px rgba(0,0,0,0.9)'
        }}>

          {/* Badge da Rodada */}
          <div style={{ 
            position: 'absolute', top: '15px', right: '15px', 
            background: '#F5C400', color: '#000', padding: '2px 10px', 
            fontWeight: 900, fontSize: '12px', transform: 'skewX(6deg)' 
          }}>
            5ª RODADA
          </div>

          {/* Confronto Centralizado */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '20px 0' }}>
            <div style={{ textAlign: 'center', transform: 'skewX(6deg)' }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SPORT%20RECIFE.png" style={{ width: '60px' }} />
              <div style={{ color: '#aaa', fontSize: '12px', fontWeight: 900, marginTop: '8px' }}>SPORT</div>
            </div>

            <div style={{ transform: 'skewX(6deg)', textAlign: 'center' }}>
              <div style={{ color: 'rgba(245,196,0,0.2)', fontSize: '30px', fontWeight: 900, fontStyle: 'italic' }}>VS</div>
            </div>

            <div style={{ textAlign: 'center', transform: 'skewX(6deg)' }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png" 
                style={{ width: '60px', filter: 'drop-shadow(0 0 12px rgba(245,196,0,0.5))' }} 
              />
              <div style={{ color: '#F5C400', fontSize: '12px', fontWeight: 900, marginTop: '8px' }} className="glow-yellow">NOVO</div>
            </div>
          </div>

          {/* Texto de Chamada (Estilo Fantasy Station) */}
          <div style={{ textAlign: 'center', marginBottom: '20px', transform: 'skewX(6deg)' }}>
            <div className="glow-cyan" style={{ fontSize: '10px', letterSpacing: '3px', marginBottom: '5px' }}>
              BROADCAST SYSTEM
            </div>
            <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.8 }}>
              MONTE SUA <br/>
              <span style={{ color: '#F5C400', fontSize: '38px' }} className="glow-yellow">ESCALAÇÃO</span>
            </h2>
          </div>

          {/* Botão idêntico ao "Convocar Titulares" */}
          <a href="/tigre-fc" className="btn-glow" style={{
            display: 'block', background: 'linear-gradient(135deg, #F5C400, #D4A200)',
            color: '#000', textAlign: 'center', padding: '18px',
            fontSize: '16px', fontWeight: 900, textDecoration: 'none',
            fontStyle: 'italic', transform: 'skewX(6deg)', letterSpacing: '1px'
          }}>
            ACESSAR VESTIÁRIO →
          </a>

          {/* Botão Fechar (X) */}
          <button onClick={close} style={{
            position: 'absolute', top: '-15px', left: '-10px',
            background: '#F5C400', border: 'none', color: '#000',
            width: '30px', height: '30px', fontWeight: 900, cursor: 'pointer'
          }}>X</button>

        </div>
      </div>
    </>
  );
}
