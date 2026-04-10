'use client';
import { useState, useEffect } from 'react';

// ─── Assets ───────────────────────────────────────────────────────────────────
const LOGO_PORTAL = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const ESCUDO_NOVO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_ADV  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png';

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [jogo, setJogo] = useState<any>(null);

  useEffect(() => {
    // Dados da API: América-MG (Mandante) x Novorizontino (Visitante)
    const dadosApi = [{"idx":3,"id":4,"competicao":"Série B","rodada":"4ª Rodada","mandante_slug":"america-mg","visitante_slug":"novorizontino","data_hora":"2026-04-12 21:00:00+00","local":"Arena da Independência • BH","ativo":true}];
    if (dadosApi?.[0]) setJogo(dadosApi[0]);
    
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible || !jogo) return null;

  const isVisitante = jogo.visitante_slug === 'novorizontino';

  return (
    <>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideDown { from { transform: translateY(0) } to { transform: translateY(100%) } }
        @keyframes scanline { 0% { bottom: 100% } 100% { bottom: 0% } }
        @keyframes ledPulse { 0% { opacity: 0.8 } 50% { opacity: 1 } 100% { opacity: 0.8 } }
      `}</style>

      {/* Overlay Blur Profundo */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s forwards' }} />

      {/* Container Placar LED */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, 
        animation: closing ? 'slideDown 0.35s forwards' : 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' 
      }}>
        <div style={{ 
          background: '#050505', 
          borderRadius: '30px 30px 0 0', 
          borderTop: '5px solid #F5C400', 
          maxWidth: 500, margin: '0 auto', 
          padding: '20px 0 40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 -15px 50px rgba(245,196,0,0.15)'
        }}>
          
          {/* Efeito de Scanlines de LED */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))', backgroundSize: '100% 4px, 3px 100%', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'rgba(245,196,0,0.1)', animation: 'scanline 4s linear infinite', zIndex: 1 }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '0 25px' }}>
            
            {/* Header: Logo & Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 25 }}>
              <img src={LOGO_PORTAL} alt="Portal" style={{ height: 32, filter: 'brightness(0) invert(1)', marginBottom: 15 }} />
              <div style={{ 
                background: '#F5C400', color: '#000', 
                padding: '4px 12px', borderRadius: '4px', 
                fontSize: '10px', fontWeight: 900, 
                letterSpacing: '2px', textTransform: 'uppercase' 
              }}>
                GAMEDAY • {jogo.competicao.toUpperCase()}
              </div>
            </div>

            {/* O PLACAR (LED STYLE) */}
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
              background: 'rgba(255,255,255,0.03)', borderRadius: '20px', 
              padding: '25px 15px', border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 30
            }}>
              
              {/* MANDANTE */}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <img 
                  src={isVisitante ? ESCUDO_ADV : ESCUDO_NOVO} 
                  style={{ 
                    width: 70, height: 70, objectFit: 'contain',
                    filter: !isVisitante ? 'drop-shadow(0 0 15px #F5C400)' : 'grayscale(0.3)' 
                  }} 
                />
                <p style={{ 
                  color: !isVisitante ? '#F5C400' : '#fff', 
                  fontSize: '11px', fontWeight: 900, marginTop: 12,
                  fontFamily: 'sans-serif'
                }}>
                  {isVisitante ? 'AMÉRICA-MG' : 'NOVORIZONTINO'}
                </p>
              </div>

              {/* VS BOX */}
              <div style={{ textAlign: 'center', padding: '0 10px' }}>
                <div style={{ fontSize: '28px', fontWeight: 900, color: '#F5C400', fontStyle: 'italic', lineHeight: 1 }}>VS</div>
                <div style={{ fontSize: '8px', color: '#555', fontWeight: 900, marginTop: 5 }}>LIVE</div>
              </div>

              {/* VISITANTE */}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <img 
                  src={isVisitante ? ESCUDO_NOVO : ESCUDO_ADV} 
                  style={{ 
                    width: 70, height: 70, objectFit: 'contain',
                    filter: isVisitante ? 'drop-shadow(0 0 15px #F5C400)' : 'grayscale(0.3)' 
                  }} 
                />
                <p style={{ 
                  color: isVisitante ? '#F5C400' : '#fff', 
                  fontSize: '11px', fontWeight: 900, marginTop: 12 
                }}>
                  {isVisitante ? 'NOVORIZONTINO' : 'AMÉRICA-MG'}
                </p>
              </div>
            </div>

            {/* Chamada Principal */}
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2 style={{ 
                color: '#fff', fontSize: '30px', fontWeight: 900, 
                fontStyle: 'italic', textTransform: 'uppercase', 
                lineHeight: 0.85, letterSpacing: '-1px'
              }}>
                MONTE SUA <br/>
                <span style={{ color: '#F5C400', fontSize: '36px' }}>ESCALAÇÃO</span>
              </h2>
              <p style={{ color: '#666', fontSize: '11px', fontWeight: 700, marginTop: 12, letterSpacing: '1px' }}>
                {jogo.local.toUpperCase()}
              </p>
            </div>

            {/* Botão Estilo Ação */}
            <div style={{ padding: '0 10px' }}>
              <a 
                href="https://www.onovorizontino.com.br/tigre-fc/sobre" 
                onClick={close}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px',
                  background: '#F5C400', color: '#000', 
                  textAlign: 'center', padding: '20px', borderRadius: '12px', 
                  fontWeight: 900, textDecoration: 'none', fontSize: '16px',
                  boxShadow: '0 10px 30px rgba(245,196,0,0.3)',
                  transition: 'transform 0.2s'
                }}
              >
                <span style={{ fontSize: '24px' }}>🐯</span> 
                ENTRAR NO TIGRE FC
              </a>
              
              <button 
                onClick={close} 
                style={{ 
                  display: 'block', width: '100%', background: 'none', border: 'none', 
                  color: '#444', marginTop: 20, fontWeight: 800, 
                  fontSize: '11px', cursor: 'pointer', letterSpacing: '2px' 
                }}
              >
                AGORA NÃO
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
