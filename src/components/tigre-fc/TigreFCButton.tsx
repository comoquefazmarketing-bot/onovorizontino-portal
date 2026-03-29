'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

const COPYS = [
  {
    titulo: 'Você já discutiu a escalação no grupo.',
    texto: 'Agora tem ranking pra provar quem manja mais. É grátis. É do Tigre.',
    cta: 'Entrar no jogo →',
  },
  {
    titulo: 'Todo mundo fala que escalaria diferente.',
    texto: 'Agora a gente vai ver. Monta o time, crava o placar, sobe no ranking.',
    cta: 'Escala aí →',
  },
  {
    titulo: 'Chama a galera do grupo.',
    texto: 'Quem conhece mais o Tigre vai aparecer no ranking. Vai encarar?',
    cta: 'Bora jogar →',
  },
];

export default function TigreFCButton() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copy, setCopy] = useState(COPYS[0]);

  useEffect(() => {
    // Rotaciona a copy a cada visita
    const count = parseInt(sessionStorage.getItem('tigre_fc_visits') || '0');
    const next = count % COPYS.length;
    setCopy(COPYS[next]);
    sessionStorage.setItem('tigre_fc_visits', String(count + 1));

    const timer = setTimeout(() => setVisible(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes tigre-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,196,0,0.4); }
          50% { box-shadow: 0 0 0 12px rgba(245,196,0,0); }
        }
        @keyframes tigre-in {
          from { opacity:0; transform: scale(0.8) translateY(10px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .tigre-btn { animation: tigre-in 0.4s ease forwards, tigre-pulse 2.5s ease-in-out 1s infinite; }
        .tigre-popup { animation: tigre-in 0.3s ease forwards; }
      `}</style>

      {/* Popup expandido */}
      {expanded && (
        <div className="tigre-popup" style={{
          position: 'fixed', bottom: 90, right: 16, zIndex: 9998,
          background: 'linear-gradient(135deg,#111,#1a1200)',
          border: '1px solid #F5C400',
          borderRadius: 16, padding: '16px', width: 240,
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)'
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
            <img src={LOGO} style={{ width:36, height:36, objectFit:'contain' }} />
            <div>
              <div style={{ fontSize:14, fontWeight:900, color:'#F5C400', letterSpacing:-0.5 }}>TIGRE FC</div>
              <div style={{ fontSize:10, color:'#555', letterSpacing:2, textTransform:'uppercase' }}>Fantasy League</div>
            </div>
          </div>
          <p style={{ fontSize:13, color:'#aaa', lineHeight:1.5, marginBottom:6, fontWeight:700 }}>
            {copy.titulo}
          </p>
          <p style={{ fontSize:12, color:'#666', lineHeight:1.5, marginBottom:14 }}>
            {copy.texto}
          </p>
          <Link href="/tigre-fc" onClick={() => setExpanded(false)}
            style={{ display:'block', background:'#F5C400', color:'#1a1a1a', fontWeight:900, fontSize:13, textTransform:'uppercase', letterSpacing:1, textAlign:'center', padding:'10px', borderRadius:10, textDecoration:'none' }}>
            {copy.cta}
          </Link>
          <button onClick={() => setExpanded(false)}
            style={{ display:'block', width:'100%', marginTop:8, background:'none', border:'none', color:'#444', fontSize:11, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
            Agora não
          </button>
        </div>
      )}

      {/* Botão flutuante */}
      <button
        className="tigre-btn"
        onClick={() => setExpanded(e => !e)}
        style={{
          position: 'fixed', bottom: 24, right: 16, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: '#F5C400', border: '2px solid #1a1a1a',
          cursor: 'pointer', padding: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
        <img src={LOGO} style={{ width: 36, height: 36, objectFit: 'contain' }} />
      </button>
    </>
  );
}
