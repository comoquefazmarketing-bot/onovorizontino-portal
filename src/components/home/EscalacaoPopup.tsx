'use client';
import { useState, useEffect } from 'react';

const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  glowGold: '0 0 20px rgba(245,196,0,0.5)',
  glowAvai: '0 0 25px rgba(0,103,177,0.3)', 
};

export default function PopupDesafioEscalacao() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Chave única para a versão de convocação do desafio
    const storageKey = `v11_desafio_escalacao_tigre`;
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
        
        @keyframes entrance {
          from { transform: translate(-50%, 20%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }

        .jumbo-font { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
        .btn-hover:hover { transform: scale(1.02); filter: brightness(1.1); transition: 0.2s; }
      `}</style>

      {/* Background Blur Overlay */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(15px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.5s'
      }} />

      {/* Popup Container */}
      <div className="jumbo-font" style={{
        position: 'fixed', bottom: '10vh', left: '50%', zIndex: 9999,
        width: '92%', maxWidth: '400px',
        animation: 'entrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transform: 'translateX(-50%)',
        background: '#050505',
        borderRadius: '12px',
        border: `2px solid ${C.gold}`,
        padding: '45px 25px 35px',
        boxShadow: '0 50px 100px rgba(0,0,0,1)',
        textAlign: 'center'
      }}>
        
        {/* Botão Fechar */}
        <button onClick={close} style={{
          position: 'absolute', top: '15px', right: '15px',
          background: 'rgba(255,255,255,0.05)', border: 'none',
          color: '#fff', fontSize: '18px', width: '32px', height: '32px',
          borderRadius: '4px', cursor: 'pointer', zIndex: 10
        }}>✕</button>

        {/* Headline de Convocação */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, fontStyle: 'italic', margin: 0, lineHeight: 0.9 }}>
            DESAFIO <br/>
            <span style={{ color: C.gold, fontSize: '48px', textShadow: C.glowGold }}>TIGRE FC:</span>
          </h2>
          <p style={{ color: C.cyan, fontSize: '16px', fontWeight: 900, marginTop: '8px', letterSpacing: '1px' }}>
            QUAL É A SUA ESTRATÉGIA PARA VENCER?
          </p>
        </div>

        {/* Escudos do Confronto */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          gap: '15px', margin: '20px 0', background: 'rgba(255,255,255,0.03)',
          padding: '25px 15px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Lado Avaí */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '75px', height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              filter: `drop-shadow(${C.glowAvai})` 
            }}>
              <img src="https://upload.wikimedia.org/wikipedia/pt/f/f1/AvaiFC2005.png" 
                   style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '10px' }}>VISITANTE</div>
          </div>

          <div style={{ fontSize: '22px', fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>VS</div>

          {/* Lado Novorizontino */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ 
              width: '75px', height: '75px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              filter: `drop-shadow(${C.glowGold})` 
            }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png" 
                   style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ color: C.gold, fontSize: '10px', marginTop: '10px', fontWeight: 900 }}>MANDANTE</div>
          </div>
        </div>

        {/* Copy de Chamada */}
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', marginBottom: '30px', lineHeight: '1.4' }}>
          O mercado está <strong>ABERTO</strong>. Monte sua equipe, <br/>
          mostre sua tática e domine o ranking.
        </p>

        {/* Link para o Desafio de Escalação */}
        <a href="/escalacao-desafio" className="btn-hover" style={{
          display: 'block',
          background: C.gold,
          color: '#000',
          padding: '22px',
          fontSize: '19px',
          fontWeight: 900,
          textDecoration: 'none',
          fontStyle: 'italic',
          borderRadius: '4px',
          boxShadow: `0 10px 30px rgba(245,196,0,0.3)`
        }}>
          MONTAR MINHA EQUIPE →
        </a>

      </div>
    </>
  );
}
