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
    
    const t = setTimeout(() => setVisible(true), 1500); // Exibir mais rápido para teste
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
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideDown { from { transform: translateY(0) } to { transform: translateY(100%) } }
        @keyframes scanline { 0% { bottom: 100% } 100% { bottom: 0% } }
      `}</style>

      {/* Overlay */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', animation: closing ? 'fadeOut 0.35s forwards' : 'fadeIn 0.3s forwards' }} />

      {/* Container Placar LED */}
      <div style={{ 
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, 
        animation: closing ? 'slideDown 0.35s forwards' : 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' 
      }}>
        <div style={{ 
          background: '#050505', 
          borderRadius: '32px 32px 0 0', 
          borderTop: '5px solid #F5C400', 
          maxWidth: 500, margin: '0 auto', 
          padding: '15px 0 35px', // Reduzido o padding top para acomodar o X
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 -15px 50px rgba(245,196,0,0.15)'
        }}>
          
          {/* Botão X para Fechar */}
          <button 
            onClick={close}
            style={{
              position: 'absolute', top: '15px', right: '15px',
              background: 'none', border: 'none',
              color: '#444', fontSize: '18px', fontWeight: 900,
              cursor: 'pointer', zIndex: 10,
              padding: '10px', transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.color = '#444'}
          >
            ✕
          </button>

          {/* Efeito de Scanlines */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%)', backgroundSize: '100% 4px', zIndex: 1 }} />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', background: 'rgba(245,196,0,0.05)', animation: 'scanline 5s linear infinite', zIndex: 1 }} />

          <div style={{ position: 'relative', zIndex: 2, padding: '0 25px' }}>
            
            {/* Header: Logo & Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: 20 }}>
              <img src={LOGO_PORTAL} alt="Portal" style={{ height: 28, filter: 'brightness(0) invert(1)', marginBottom: 12 }} />
              <div style={{ 
                background: '#F5C400', color: '#000', 
                padding: '3px 10px', borderRadius: '4px', 
                fontSize: '9px', fontWeight: 900, 
                letterSpacing: '1.5px', textTransform: 'uppercase' 
              }}>
                GAMEDAY • {jogo.competicao.toUpperCase()}
              </div>
            </div>
