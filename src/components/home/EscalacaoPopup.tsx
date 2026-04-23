'use client';
import { useState, useEffect } from 'react';

const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  glowGold: '0 0 12px rgba(245,196,0,0.6), 0 0 25px rgba(245,196,0,0.3)',
  glowCyan: '0 0 10px rgba(0,243,255,0.7)',
};

export default function MiniJumbotronConversion() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Timer agressivo de 4 segundos para pegar o usuário no auge da atenção
    const storageKey = `v6_conversion_popup`;
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
        
        @keyframes jumbo-entrance {
          0% { transform: translate(-50%, 150%) skewX(-8deg); opacity: 0; }
          100% { transform: translate(-50%, 0) skewX(-8deg); opacity: 1; }
        }

        @keyframes pulse-status {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }

        @keyframes led-scan-mini {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .jumbo-font { font-family: 'Barlow Condensed', sans-serif; text-transform: uppercase; }
        .skew-fix { transform: skewX(8deg); }
        .btn-hover:hover { transform: scale(1.03) skewX(8deg); filter: brightness(1.1); }
      `}</style>

      <div onClick={close} style={{
        position: 'fixed', inset: 0, zIndex: 9998,
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        opacity: closing ? 0 : 1, transition: 'opacity 0.5s'
      }} />

      <div className="jumbo-font" style={{
        position: 'fixed', bottom: '15vh', left: '50%', zIndex: 9999,
        width: '94%', maxWidth: '420px',
        animation: 'jumbo-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        transform: 'translateX(-50%) skewX(-8deg)',
        background: '#050505',
        borderRadius: '12px',
        border: `1.5px solid ${C.gold}`,
        padding: '2px',
        boxShadow: '0 40px 100px rgba(0,0,0,1)',
        overflow: 'hidden'
      }}>
        
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: `linear-gradient(90deg, transparent, ${C.gold}, #fff, ${C.cyan}, transparent)`,
          backgroundSize: '200%', animation: 'led-scan-mini 2.5s linear infinite'
        }} />

        <div style={{ padding: '35px 25px', position: 'relative', textAlign: 'center' }}>
          
          {/* GATILHO: STATUS EM TEMPO REAL */}
          <div className="skew-fix" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div style={{ 
              background: 'rgba(0,243,255,0.1)', border: `1px solid ${C.cyan}`, 
              color: C.cyan, padding: '4px 14px', fontSize: '11px', fontWeight: 900,
              display: 'flex', alignItems: 'center', gap: '8px', boxShadow: C.glowCyan
            }}>
              <span style={{ width: '8px', height: '8px', background: C.cyan, borderRadius: '50%', animation: 'pulse-status 1.5s infinite' }} />
              SISTEMA ONLINE: MERCADO ABERTO
            </div>
          </div>

          {/* HEADLINE: PODER E AUTORIDADE */}
          <div className="skew-fix" style={{ marginBottom: '25px' }}>
            <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.8, margin: 0 }}>
              ASSUMA O <br/>
              <span style={{ color: C.gold, fontSize: '52px', textShadow: C.glowGold }}>COMANDO</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '12px', letterSpacing: '1px' }}>
              ESCALAÇÃO LIBERADA PARA <span style={{color: '#fff'}}>SPORT vs NOVO</span>
            </p>
          </div>

          {/* CHAMADA DE VALOR (Ranking/Prêmios) */}
          <div className="skew-fix" style={{ 
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '8px', padding: '15px', marginBottom: '25px'
          }}>
             <div style={{ fontSize: '10px', color: C.gold, marginBottom: '5px' }}>PREVISÃO DE RECOMPENSA</div>
             <div style={{ color: '#fff', fontSize: '18px', fontWeight: 900 }}>+500 PONTOS NO RANKING</div>
          </div>

          {/* CTA: O BOTÃO QUE VENDE */}
          <a href="/tigre-fc" className="btn-hover" style={{
            display: 'block',
            background: `linear-gradient(135deg, ${C.gold}, #D4A200)`,
            color: '#000',
            padding: '22px',
            fontSize: '20px',
            fontWeight: 900,
            textDecoration: 'none',
            fontStyle: 'italic',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(245,196,0,0.3)',
            transition: '0.3s'
          }}>
            <div className="skew-fix">MONTAR MEU TIME AGORA →</div>
          </a>

          {/* OPÇÃO DE SAÍDA DISCRETA */}
          <button onClick={close} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
            marginTop: '25px', cursor: 'pointer', fontSize: '10px', fontWeight: 900,
            textDecoration: 'underline'
          }} className="skew-fix">CONTINUAR APENAS LENDO</button>

        </div>
      </div>
    </>
  );
}
