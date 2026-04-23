'use client';
import { useState, useEffect } from 'react';

// ─── Assets ───────────────────────────────────────────────────────────────────
const LOGO_PORTAL = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const ESCUDO_NOVO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_ADV  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SPORT%20RECIFE.png'; // Atualizado para Sport

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [jogo, setJogo] = useState<any>(null);

  useEffect(() => {
    // Dados da Rodada Atualizada (5ª Rodada)
    const jogoAtual = {
        id: 5,
        competicao: "Série B",
        rodada: "5ª Rodada",
        mandante_slug: "sport",
        visitante_slug: "novorizontino",
        local: "Arena Pernambuco • PE",
        data_hora: "2026-04-25 20:30:00"
    };
    setJogo(jogoAtual);

    const storageKey = `popup_visto_rodada_${jogoAtual.id}`;
    const jaVisto = localStorage.getItem(storageKey);

    if (!jaVisto) {
      // Delay de 8 segundos para não ser intrusivo
      const t = setTimeout(() => {
        setVisible(true);
        localStorage.setItem(storageKey, 'true');
      }, 8000);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 400);
  };

  if (!visible || !jogo) return null;

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes slideUpJumbo { 
          from { transform: translate(-50%, 120%) skewX(-6deg); } 
          to { transform: translate(-50%, 0) skewX(-6deg); } 
        }
        
        .jumbo-font { font-family: 'Barlow Condensed', sans-serif; }
      `}</style>

      {/* Overlay */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', animation: closing ? 'fadeOut 0.4s forwards' : 'fadeIn 0.4s forwards' }} />

      {/* Mini Jumbotron Popup */}
      <div className="jumbo-font" style={{ 
        position: 'fixed', bottom: '30px', left: '50%', zIndex: 9999, 
        width: 'calc(100% - 40px)', maxWidth: '400px',
        animation: !closing ? 'slideUpJumbo 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.1) forwards' : 'none',
        transform: 'translateX(-50%) skewX(-6deg)'
      }}>
        <div style={{ 
          background: '#050505', border: '3px solid #F5C400', padding: '20px', position: 'relative',
          boxShadow: '0 0 40px rgba(245,196,0,0.2)'
        }}>

          {/* Botão Fechar no estilo do Jumbotron */}
          <button onClick={close} style={{
            position: 'absolute', top: '-18px', right: '10px', background: '#F5C400', 
            border: 'none', color: '#000', width: '30px', height: '30px', 
            fontWeight: 900, cursor: 'pointer', transform: 'skewX(6deg)'
          }}>✕</button>

          {/* Top Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', transform: 'skewX(6deg)' }}>
             <img src={LOGO_PORTAL} style={{ height: '20px', filter: 'brightness(10)' }} />
             <div style={{ background: '#F5C400', color: '#000', padding: '2px 10px', fontSize: '11px', fontWeight: 900 }}>
                {jogo.rodada.toUpperCase()}
             </div>
          </div>

          {/* Painel de Confronto */}
          <div style={{ background: '#111', padding: '15px', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center', width: '40%', transform: 'skewX(6deg)' }}>
                <img src={ESCUDO_ADV} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
                <div style={{ color: '#fff', fontSize: '11px', fontWeight: 900, marginTop: '5px' }}>SPORT</div>
            </div>

            <div style={{ textAlign: 'center', transform: 'skewX(6deg)' }}>
                <div style={{ color: '#F5C400', fontSize: '28px', fontWeight: 900, fontStyle: 'italic', lineHeight: 1 }}>VS</div>
            </div>

            <div style={{ textAlign: 'center', width: '40%', transform: 'skewX(6deg)' }}>
                <img src={ESCUDO_NOVO} style={{ width: '50px', height: '50px', objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(245,196,0,0.4))' }} />
                <div style={{ color: '#F5C400', fontSize: '11px', fontWeight: 900, marginTop: '5px' }}>NOVO</div>
            </div>
          </div>

          {/* CTA Central */}
          <div style={{ marginTop: '20px', textAlign: 'center', transform: 'skewX(6deg)' }}>
             <h3 style={{ color: '#fff', fontSize: '24px', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.9 }}>
                MONTE SUA <br/>
                <span style={{ color: '#F5C400', fontSize: '32px' }}>ESCALAÇÃO</span>
             </h3>
             <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px', fontWeight: 900, marginTop: '10px' }}>
                {jogo.local.toUpperCase()}
             </p>
          </div>

          {/* Botão Convite */}
          <a href="/tigre-fc" style={{
             display: 'block', background: '#F5C400', color: '#000', textAlign: 'center', 
             padding: '16px', marginTop: '20px', fontSize: '15px', fontWeight: 900, 
             textDecoration: 'none', fontStyle: 'italic', transform: 'skewX(6deg)',
             boxShadow: '0 5px 15px rgba(245,196,0,0.3)'
          }}>
             ACESSAR VESTIÁRIO 🐯
          </a>
        </div>
      </div>
    </>
  );
}
