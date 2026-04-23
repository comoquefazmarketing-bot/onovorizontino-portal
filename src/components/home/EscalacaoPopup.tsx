'use client';
import { useState, useEffect } from 'react';

// ─── CONFIGURAÇÃO CYBERPUNK ──────────────────────────────────────────────────
const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  bg: '#050505',
  glass: 'rgba(5, 5, 5, 0.95)',
  neonGold: '0 0 15px rgba(245, 196, 0, 0.5), 0 0 30px rgba(245, 196, 0, 0.2)',
  neonCyan: '0 0 15px rgba(0, 243, 255, 0.5), 0 0 30px rgba(0, 243, 255, 0.2)',
};

export default function EscalacaoCyberPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Nova chave de storage para forçar o reset do popup antigo
    const storageKey = `v5_cyber_jumbo_force`;
    if (!localStorage.getItem(storageKey)) {
      const t = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(storageKey, 'true');
      }, 5000); // Aparece em 5 segundos para teste rápido
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 500);
  };

  if (!visible) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        
        @keyframes cyberEntrance {
          0% { transform: translate(-50%, 150%) skewX(-15deg); opacity: 0; }
          70% { transform: translate(-50%, -10%) skewX(-15deg); opacity: 1; }
          100% { transform: translate(-50%, 0) skewX(-15deg); opacity: 1; }
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        .cyber-font { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
        .skew-reverse { transform: skewX(15deg); }
      `}</style>

      {/* Overlay com Blur Intenso */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.5s ease'
      }} />

      {/* NOVO FORMATO: LÂMINA CYBERPUNK */}
      <div className="cyber-font" style={{
        position: 'fixed', bottom: '10vh', left: '50%', zIndex: 9999,
        width: '95%', maxWidth: '450px',
        animation: !closing ? 'cyberEntrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
        transform: 'translateX(-50%) skewX(-15deg)',
        background: C.bg,
        borderLeft: `4px solid ${C.cyan}`,
        borderRight: `4px solid ${C.gold}`,
        boxShadow: `${C.neonGold}, inset 0 0 50px rgba(0, 243, 255, 0.05)`,
        padding: '2px',
        overflow: 'hidden'
      }}>
        
        {/* Efeito de Scanline (Linha de Varredura) */}
        <div style={{
          position: 'absolute', inset: 0, height: '100%', width: '100%',
          background: 'linear-gradient(to bottom, transparent, rgba(0, 243, 255, 0.1), transparent)',
          animation: 'scanline 3s linear infinite', pointerEvents: 'none'
        }} />

        <div style={{ background: C.bg, padding: '30px 20px', position: 'relative' }}>
          
          {/* Botão de Fechar Estilizado */}
          <button onClick={close} style={{
            position: 'absolute', top: '0', right: '0',
            background: C.gold, border: 'none', color: '#000',
            width: '40px', height: '30px', fontWeight: 900, cursor: 'pointer',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 30% 100%)'
          }}><span className="skew-reverse" style={{ display: 'block' }}>X</span></button>

          {/* Cabeçalho de Rodada */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '25px' }} className="skew-reverse">
             <div style={{ 
               background: 'rgba(0, 243, 255, 0.1)', color: C.cyan, 
               border: `1px solid ${C.cyan}`, padding: '4px 15px', 
               fontSize: '12px', letterSpacing: '4px', fontWeight: 900,
               boxShadow: C.neonCyan
             }}>
                5ª RODADA • SÉRIE B
             </div>
          </div>

          {/* Arena de Duelo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }} className="skew-reverse">
            {/* Visitante */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SPORT%20RECIFE.png" 
                   style={{ width: '65px', filter: 'drop-shadow(0 0 5px #fff)' }} />
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 900, marginTop: '8px' }}>SPORT</div>
            </div>

            {/* VS Neon */}
            <div style={{ textAlign: 'center', padding: '0 10px' }}>
               <div style={{ color: C.cyan, fontSize: '32px', fontWeight: 900, fontStyle: 'italic', textShadow: C.neonCyan }}>VS</div>
               <div style={{ height: '2px', width: '40px', background: C.gold, margin: '5px auto', boxShadow: C.neonGold }} />
            </div>

            {/* Mandante (Novorizontino) */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png" 
                   style={{ width: '65px', filter: `drop-shadow(${C.neonGold})` }} />
              <div style={{ color: C.gold, fontSize: '13px', fontWeight: 900, marginTop: '8px', textShadow: C.neonGold }}>NOVO</div>
            </div>
          </div>

          {/* Chamada para Ação */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }} className="skew-reverse">
            <h2 style={{ color: '#fff', fontSize: '32px', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.8, margin: 0 }}>
              CONVOCAR <br/>
              <span style={{ color: C.gold, fontSize: '44px', textShadow: C.neonGold }}>TITULARES</span>
            </h2>
            <div style={{ color: C.cyan, fontSize: '10px', marginTop: '10px', letterSpacing: '2px', fontWeight: 900 }}>
              ARENA PERNAMBUCO • 20:30
            </div>
          </div>

          {/* Botão de Ação Estilo Cyber-Blade */}
          <a href="/tigre-fc" style={{
            display: 'block',
            background: C.gold,
            color: '#000',
            textAlign: 'center',
            padding: '20px',
            fontSize: '18px',
            fontWeight: 900,
            textDecoration: 'none',
            fontStyle: 'italic',
            clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)',
            boxShadow: C.neonGold,
            transition: 'all 0.3s ease'
          }} className="skew-reverse">
            ACESSAR VESTIÁRIO →
          </a>

        </div>
      </div>
    </>
  );
}
