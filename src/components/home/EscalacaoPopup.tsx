'use client';
import { useState, useEffect } from 'react';

const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  glowGold: '0 0 15px rgba(245,196,0,0.6), 0 0 30px rgba(245,196,0,0.3)',
  glowCyan: '0 0 12px rgba(0,243,255,0.7)',
};

export default function PopupTecnicoPro() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const storageKey = `v7_final_conversion`;
    if (!localStorage.getItem(storageKey)) {
      const t = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(storageKey, 'true');
      }, 4000);
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
        
        @keyframes entrance-jumbo {
          0% { transform: translate(-50%, 150%) skewX(-6deg); opacity: 0; }
          100% { transform: translate(-50%, 0) skewX(-6deg); opacity: 1; }
        }

        .jumbo-font { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
        .skew-fix { transform: skewX(6deg); }
        .btn-pulse:hover { transform: scale(1.05) skewX(6deg); filter: brightness(1.2); }
      `}</style>

      {/* Overlay de foco total */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.5s'
      }} />

      <div className="jumbo-font" style={{
        position: 'fixed', bottom: '12vh', left: '50%', zIndex: 9999,
        width: '94%', maxWidth: '440px',
        animation: 'entrance-jumbo 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transform: 'translateX(-50%) skewX(-6deg)',
        background: '#020202',
        borderRadius: '24px',
        border: `2px solid ${C.gold}`,
        padding: '30px 20px',
        boxShadow: '0 50px 100px rgba(0,0,0,1)',
        textAlign: 'center'
      }}>
        
        {/* Barra de Scan Neo-Futurista */}
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
          background: `linear-gradient(90deg, transparent, ${C.cyan}, ${C.gold}, transparent)`,
        }} />

        <div className="skew-fix">
          {/* Headline Desafiadora */}
          <h2 style={{ color: '#fff', fontSize: '28px', fontWeight: 900, fontStyle: 'italic', margin: 0 }}>
            VOCÊ É O <span style={{ color: C.gold, textShadow: C.glowGold }}>TÉCNICO:</span>
          </h2>
          <p style={{ color: C.cyan, fontSize: '18px', fontWeight: 900, marginTop: '5px', letterSpacing: '1px' }}>
            COMO VOCÊ ESCALARIA O TIGRE HOJE?
          </p>

          {/* Arena de Escudos - O Coração do Engajamento */}
          <div style={{ 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            gap: '25px', margin: '30px 0', background: 'rgba(255,255,255,0.03)',
            padding: '20px', borderRadius: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <img src="https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png" 
                   style={{ width: '75px', height: '75px', objectFit: 'contain' }} />
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginTop: '8px' }}>VISITANTE</div>
            </div>

            <div style={{ fontSize: '24px', fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>VS</div>

            <div style={{ textAlign: 'center' }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png" 
                   style={{ width: '75px', height: '75px', objectFit: 'contain', filter: `drop-shadow(${C.glowGold})` }} />
              <div style={{ color: C.gold, fontSize: '10px', marginTop: '8px', fontWeight: 900 }}>MANDANTE</div>
            </div>
          </div>

          {/* Copy de fechamento focado em ação */}
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: '25px', lineHeight: '1.4' }}>
            O mercado está <strong>ABERTO</strong>. <br/> Mostre sua estratégia e conquiste o topo do ranking.
          </p>

          {/* CTA Principal */}
          <a href="/tigre-fc" className="btn-pulse" style={{
            display: 'block',
            background: `linear-gradient(135deg, ${C.gold}, #D4A200)`,
            color: '#000',
            padding: '20px',
            fontSize: '22px',
            fontWeight: 900,
            textDecoration: 'none',
            fontStyle: 'italic',
            borderRadius: '12px',
            boxShadow: '0 15px 30px rgba(245,196,0,0.4)',
            transition: '0.3s'
          }}>
            MONTAR MINHA ESCALAÇÃO →
          </a>

          <button onClick={close} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
            marginTop: '25px', cursor: 'pointer', fontSize: '11px', fontWeight: 900
          }}>
            NÃO, PREFIRO SÓ OLHAR
          </button>
        </div>
      </div>
    </>
  );
}
