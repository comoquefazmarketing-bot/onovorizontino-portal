'use client';
import { useState, useEffect } from 'react';

const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  glowGold: '0 0 15px rgba(245,196,0,0.6)',
  glowCyan: '0 0 12px rgba(0,243,255,0.7)',
};

export default function PopupFinalVertical() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const storageKey = `v8_final_vertical`;
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
        
        @keyframes slide-up-clean {
          from { transform: translate(-50%, 20%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        .jumbo-font { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
        .btn-active:hover { transform: scale(1.02); filter: brightness(1.1); transition: 0.2s; }
      `}</style>

      {/* Overlay com Blur */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.5s'
      }} />

      {/* CONTAINER VERTICAL RETANGULAR */}
      <div className="jumbo-font" style={{
        position: 'fixed', bottom: '10vh', left: '50%', zIndex: 9999,
        width: '90%', maxWidth: '400px',
        animation: 'slide-up-clean 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transform: 'translateX(-50%)',
        background: '#080808',
        borderRadius: '16px',
        border: `1px solid ${C.gold}`,
        padding: '40px 24px 30px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
        textAlign: 'center',
        overflow: 'visible' // Para o botão X poder "vazar" se quiser
      }}>
        
        {/* BOTÃO "X" PARA FECHAR */}
        <button onClick={close} style={{
          position: 'absolute', top: '15px', right: '15px',
          background: 'rgba(255,255,255,0.05)', border: 'none',
          color: '#fff', fontSize: '18px', width: '32px', height: '32px',
          borderRadius: '50%', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 10
        }}>✕</button>

        {/* ESTRATÉGIA DE COPY: O DESAFIO AO TÉCNICO */}
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, fontStyle: 'italic', margin: 0, lineHeight: 0.9 }}>
            VOCÊ É O <br/>
            <span style={{ color: C.gold, fontSize: '48px', textShadow: C.glowGold }}>TÉCNICO:</span>
          </h2>
          <p style={{ color: C.cyan, fontSize: '16px', fontWeight: 900, marginTop: '8px', letterSpacing: '1px' }}>
            COMO VOCÊ ESCALARIA O TIGRE HOJE?
          </p>
        </div>

        {/* CONFRONTO VISUAL */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          gap: '20px', margin: '25px 0', background: 'rgba(255,255,255,0.02)',
          padding: '20px 10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ flex: 1 }}>
            <img src="https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png" 
                 style={{ width: '65px', height: '65px', objectFit: 'contain' }} />
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', marginTop: '5px' }}>SPORT</div>
          </div>

          <div style={{ fontSize: '20px', fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>VS</div>

          <div style={{ flex: 1 }}>
            <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png" 
                 style={{ width: '65px', height: '65px', objectFit: 'contain', filter: `drop-shadow(${C.glowGold})` }} />
            <div style={{ color: C.gold, fontSize: '9px', marginTop: '5px', fontWeight: 900 }}>NOVO</div>
          </div>
        </div>

        {/* BENEFÍCIO E CTA */}
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '25px' }}>
          O mercado está <strong>ABERTO</strong>. Mostre sua estratégia <br/> e conquiste o topo do ranking.
        </p>

        <a href="/tigre-fc" className="btn-active" style={{
          display: 'block',
          background: `linear-gradient(135deg, ${C.gold}, #D4A200)`,
          color: '#000',
          padding: '20px',
          fontSize: '18px',
          fontWeight: 900,
          textDecoration: 'none',
          fontStyle: 'italic',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(245,196,0,0.3)',
          transition: '0.2s'
        }}>
          MONTAR MINHA ESCALAÇÃO →
        </a>

      </div>
    </>
  );
}
