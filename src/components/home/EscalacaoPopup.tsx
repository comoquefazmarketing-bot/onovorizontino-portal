'use client';
import { useState, useEffect } from 'react';

// Constantes idênticas ao seu Jumbotron oficial
const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  glowGold: '0 0 15px rgba(245,196,0,0.6), 0 0 30px rgba(245,196,0,0.3)',
  glowCyan: '0 0 10px rgba(0,243,255,0.7)',
};

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // 8 segundos de delay e trava por rodada (ID 5)
    const storageKey = `popup_rodada_5_visto`;
    if (!localStorage.getItem(storageKey)) {
      const timer = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(storageKey, 'true');
      }, 8000);
      return () => clearTimeout(timer);
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
        
        .jumbo-mini-container {
          font-family: 'Barlow Condensed', sans-serif;
          animation: slideUp 0.6s cubic-bezier(0.2, 1, 0.3, 1) forwards;
        }

        @keyframes slideUp {
          from { transform: translate(-50%, 100%) skewX(-6deg); opacity: 0; }
          to { transform: translate(-50%, 0) skewX(-6deg); opacity: 1; }
        }

        .skew-fix { transform: skewX(6deg); }
      `}</style>

      {/* Overlay de fundo */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.4s'
      }} />

      {/* Container Principal Inclinado */}
      <div className="jumbo-mini-container" style={{
        position: 'fixed', bottom: '40px', left: '50%', zIndex: 9999,
        width: '90%', maxWidth: '400px',
        background: '#050505',
        border: `2px solid ${C.gold}`,
        padding: '25px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
        transform: 'translateX(-50%) skewX(-6deg)'
      }}>
        
        {/* Botão Fechar no estilo "X" do Jumbotron */}
        <button onClick={close} style={{
          position: 'absolute', top: '-15px', left: '-10px',
          background: C.gold, border: 'none', color: '#000',
          width: '32px', height: '32px', fontWeight: 900, cursor: 'pointer',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }} className="skew-fix">X</button>

        {/* Rodada Badge */}
        <div style={{ 
          position: 'absolute', top: '15px', right: '15px', 
          background: C.gold, color: '#000', padding: '2px 8px', 
          fontSize: '11px', fontWeight: 900 
        }} className="skew-fix">
          5ª RODADA
        </div>

        {/* Conteúdo Interno com correção de inclinação */}
        <div className="skew-fix" style={{ textAlign: 'center' }}>
          
          {/* Confronto */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '25px', padding: '0 10px' }}>
            <div style={{ width: '80px' }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SPORT%20RECIFE.png" 
                   style={{ width: '100%', height: '60px', objectFit: 'contain' }} 
                   onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/60?text=SPORT'} />
              <div style={{ color: '#666', fontSize: '10px', fontWeight: 900, marginTop: '5px' }}>SPORT RECIFE</div>
            </div>

            <div style={{ fontStyle: 'italic', color: 'rgba(245,196,0,0.15)', fontSize: '24px', fontWeight: 900 }}>VS</div>

            <div style={{ width: '80px' }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png" 
                   style={{ width: '100%', height: '60px', objectFit: 'contain', filter: `drop-shadow(${C.glowGold})` }} />
              <div style={{ color: C.gold, fontSize: '10px', fontWeight: 900, marginTop: '5px', textShadow: C.glowGold }}>NOVORIZONTINO</div>
            </div>
          </div>

          {/* Chamada */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ color: C.cyan, fontSize: '9px', letterSpacing: '3px', fontWeight: 900, textShadow: C.glowCyan, marginBottom: '5px' }}>
              BROADCAST STATION
            </div>
            <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.8, margin: 0 }}>
              MONTE SUA <br/>
              <span style={{ color: C.gold, fontSize: '36px', textShadow: C.glowGold }}>ESCALAÇÃO</span>
            </h2>
            <p style={{ color: '#444', fontSize: '10px', fontWeight: 900, marginTop: '10px' }}>ARENA PERNAMBUCO • PE</p>
          </div>

          {/* Botão de Ação Estilo Jumbotron */}
          <a href="/tigre-fc" style={{
            display: 'block',
            background: `linear-gradient(135deg, ${C.gold}, #D4A200)`,
            color: '#000',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 900,
            textDecoration: 'none',
            fontStyle: 'italic',
            borderRadius: '4px',
            boxShadow: '0 0 20px rgba(245,196,0,0.4)',
            transition: 'transform 0.2s'
          }}>
            ACESSAR VESTIÁRIO →
          </a>
        </div>
      </div>
    </>
  );
}
