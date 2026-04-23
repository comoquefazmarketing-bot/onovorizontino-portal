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
    // Dados da Rodada Atual
    const dadosApi = [{
        id: 4,
        competicao: "Série B",
        rodada: "4ª Rodada",
        mandante_slug: "america-mg",
        visitante_slug: "novorizontino",
        local: "Independência • BH"
    }];
    const jogoAtual = dadosApi[0];
    setJogo(jogoAtual);

    // MECANISMO DE PERSISTÊNCIA: Aparece apenas 1x por rodada
    const storageKey = `popup_visto_rodada_${jogoAtual.id}`;
    const jaVisto = localStorage.getItem(storageKey);

    if (!jaVisto) {
      // Delay de 8 segundos antes de aparecer
      const t = setTimeout(() => {
        setVisible(true);
        // Salva que o usuário já viu esta rodada específica
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

  const isVisitante = jogo.visitante_slug === 'novorizontino';

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes slideUpJumbo { 
          from { transform: translateY(120%) skewX(-4deg); } 
          to { transform: translateY(0) skewX(-4deg); } 
        }
        @keyframes slideDownJumbo { 
          from { transform: translateY(0) skewX(-4deg); } 
          to { transform: translateY(120%) skewX(-4deg); } 
        }
        
        .jumbo-font { font-family: 'Barlow Condensed', sans-serif; }
      `}</style>

      {/* Overlay Escuro */}
      <div 
        onClick={close} 
        style={{ 
            position: 'fixed', inset: 0, zIndex: 9998, 
            background: 'rgba(0,0,0,0.8)', 
            backdropFilter: 'blur(4px)',
            animation: closing ? 'fadeOut 0.4s forwards' : 'fadeIn 0.4s forwards' 
        }} 
      />

      {/* Mini Jumbotron Popup */}
      <div className="jumbo-font" style={{ 
        position: 'fixed', bottom: '20px', left: '10px', right: '10px', zIndex: 9999, 
        display: 'flex', justifyContent: 'center', pointerEvents: 'none'
      }}>
        <div style={{ 
          background: '#080808', 
          width: '100%', maxWidth: '420px',
          border: '2px solid #F5C400',
          padding: '20px',
          position: 'relative',
          pointerEvents: 'auto',
          // Inclinação clássica do Jumbotron
          transform: 'skewX(-4deg)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.8), 0 0 30px rgba(245,196,0,0.1)',
          animation: closing ? 'slideDownJumbo 0.4s ease-in forwards' : 'slideUpJumbo 0.6s cubic-bezier(0.2, 0.8, 0.2, 1.05) forwards'
        }}>

          {/* Botão X Minimalista */}
          <button onClick={close} style={{
            position: 'absolute', top: '-15px', right: '10px', 
            background: '#F5C400', border: 'none', color: '#000', 
            width: '28px', height: '28px', fontWeight: 900, 
            transform: 'skewX(4deg)', cursor: 'pointer', fontSize: '14px'
          }}>✕</button>

          {/* Header do Mini Jumbotron */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
             <img src={LOGO_PORTAL} style={{ height: '22px', filter: 'brightness(100)' }} />
             <div style={{ background: '#F5C400', color: '#000', padding: '2px 8px', fontSize: '10px', fontWeight: 900 }}>
                {jogo.rodada.toUpperCase()}
             </div>
          </div>

          {/* Área de Jogo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: '#111', padding: '15px 10px', border: '1px solid #222' }}>
            
            {/* Time 1 */}
            <div style={{ textAlign: 'center', width: '35%' }}>
                <img src={isVisitante ? ESCUDO_ADV : ESCUDO_NOVO} style={{ width: '45px', marginBottom: '5px' }} />
                <div style={{ fontSize: '10px', color: '#fff', fontWeight: 900, textTransform: 'uppercase' }}>
                    {isVisitante ? 'AME-MG' : 'NOVO'}
                </div>
            </div>

            {/* VS Central */}
            <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#F5C400', fontSize: '24px', fontWeight: 900, fontStyle: 'italic' }}>VS</div>
            </div>

            {/* Time 2 */}
            <div style={{ textAlign: 'center', width: '35%' }}>
                <img src={isVisitante ? ESCUDO_NOVO : ESCUDO_ADV} style={{ width: '45px', marginBottom: '5px' }} />
                <div style={{ fontSize: '10px', color: isVisitante ? '#F5C400' : '#fff', fontWeight: 900, textTransform: 'uppercase' }}>
                    {isVisitante ? 'NOVO' : 'AME-MG'}
                </div>
            </div>
          </div>

          {/* Texto de Chamada Impactante */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
             <h3 style={{ color: '#fff', fontSize: '26px', fontWeight: 900, fontStyle: 'italic', lineHeight: 0.9, letterSpacing: '-1px' }}>
                MONTE SUA <br/>
                <span style={{ color: '#F5C400', fontSize: '32px' }}>ESCALAÇÃO</span>
             </h3>
             <p style={{ color: '#444', fontSize: '9px', fontWeight: 900, marginTop: '8px', letterSpacing: '1px' }}>
                {jogo.local.toUpperCase()}
             </p>
          </div>

          {/* Botão de Ação */}
          <a href="/tigre-fc" style={{
             display: 'block', background: '#F5C400', color: '#000', 
             textAlign: 'center', padding: '14px', marginTop: '20px',
             fontSize: '14px', fontWeight: 900, textDecoration: 'none',
             textTransform: 'uppercase', fontStyle: 'italic'
          }}>
             ACESSAR VESTIÁRIO 🐯
          </a>

        </div>
      </div>
    </>
  );
}
