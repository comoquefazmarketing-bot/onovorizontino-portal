'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const DEMO_SLOTS = [
  { x: 50, y: 88 }, { x: 82, y: 70 }, { x: 62, y: 70 },
  { x: 38, y: 70 }, { x: 18, y: 70 }, { x: 72, y: 50 },
  { x: 50, y: 46 }, { x: 28, y: 50 }, { x: 76, y: 24 },
  { x: 50, y: 18 }, { x: 24, y: 24 },
];

type Time = { nome: string; escudo_url: string };
type Jogo = { id: number; competicao: string; data_hora: string; local: string; mandante: Time; visitante: Time };

function formatHorario(iso: string) {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2,'0');
  const m = String(d.getMinutes()).padStart(2,'0');
  return `${h}h${m === '00' ? '' : m}`;
}
function formatData(iso: string) {
  const d = new Date(iso);
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`;
}
function isHoje(iso: string) {
  return new Date().toDateString() === new Date(iso).toDateString();
}

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem('popup_escalacao_closed')) return;
    // Busca próximo jogo da API
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => {
        if (jogos?.[0]) setJogo(jogos[0]);
      })
      .catch(() => {});
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setPulse(p => !p), 900);
    return () => clearInterval(t);
  }, [visible]);

  const close = () => {
    setClosing(true);
    sessionStorage.setItem('popup_escalacao_closed', '1');
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes fadeOut { from{opacity:1} to{opacity:0} }
        @keyframes slideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
        @keyframes slideDown { from{transform:translateY(0)} to{transform:translateY(100%)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
      `}</style>

      {/* Overlay */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', animation: closing ? 'fadeOut 0.35s forwards' : 'fadeIn 0.3s forwards' }} />

      {/* Popup */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, animation: closing ? 'slideDown 0.35s forwards' : 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <div style={{ background: 'linear-gradient(160deg,#0f0f0f,#1a1200 60%,#0f1a0f)', borderRadius: '24px 24px 0 0', borderTop: '3px solid #F5C400', overflow: 'hidden', maxWidth: 540, margin: '0 auto', position: 'relative' }}>

          {/* Shimmer topo */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: 'linear-gradient(90deg,#F5C400,#fff,#F5C400)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite' }} />

          {/* Fechar */}
          <button onClick={close} data-track="popup_fechar_x" style={{ position: 'absolute', top: 16, right: 16, width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#666', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>

          <div style={{ padding: '24px 20px 32px' }}>

            {/* Badge jogo — dinâmico ou fallback */}
            {jogo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                {isHoje(jogo.data_hora) && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: pulse ? '0 0 8px #ef4444' : 'none', transition: 'box-shadow 0.4s' }} />
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Hoje</span>
                  </span>
                )}
                <span style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{formatHorario(jogo.data_hora)}</span>
                <span style={{ fontSize: 10, color: '#555', fontWeight: 700, textTransform: 'uppercase' }}>• {jogo.competicao}</span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F5C400', display: 'inline-block', boxShadow: pulse ? '0 0 8px #F5C400' : 'none', transition: 'box-shadow 0.4s' }} />
                <span style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: '0.2em' }}>Série B 2026</span>
              </div>
            )}

            {/* Confronto */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>

              {/* Mandante */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                {jogo ? (
                  <img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} style={{ width: 56, height: 56, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))' }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
                )}
                <span style={{ fontSize: 10, color: '#aaa', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>
                  {jogo?.mandante.nome ?? '...'}
                </span>
              </div>

              {/* Centro com mini campo */}
              <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 80, height: 52, borderRadius: 6, overflow: 'hidden', background: '#2d8a2d', position: 'relative', border: '1.5px solid rgba(255,255,255,0.15)' }}>
                  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
                    {[0,1,2,3].map(i => <rect key={i} x="0" y={i*26} width="68" height="13" fill={i%2===0?'rgba(255,255,255,0.05)':'transparent'} />)}
                    <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                    <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                    <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
                  </svg>
                  {DEMO_SLOTS.map((s, i) => (
                    <div key={i} style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%,-50%)', width: 7, height: 7, borderRadius: '50%', background: i < 6 ? '#F5C400' : '#fff', border: '1px solid rgba(0,0,0,0.5)', boxShadow: pulse && i%2===0 ? '0 0 5px #F5C400' : 'none', transition: 'box-shadow 0.4s' }} />
                  ))}
                </div>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#F5C400' }}>VS</span>
              </div>

              {/* Visitante */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                {jogo ? (
                  <img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} style={{ width: 56, height: 56, objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(245,196,0,0.3))' }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333' }} />
                )}
                <span style={{ fontSize: 10, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>
                  {jogo?.visitante.nome ?? '...'}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8 }}>
                QUAL É SUA<br />
                <span style={{ color: '#F5C400' }}>ESCALAÇÃO IDEAL?</span>
              </h2>
              <p style={{ fontSize: 13, color: '#777', lineHeight: 1.4 }}>
                Monte os 11, gere o story e desafie seus amigos.<br />
                {jogo ? `${jogo.mandante.nome} x ${jogo.visitante.nome} — ${formatData(jogo.data_hora)}` : 'Quem você coloca pra jogar hoje?'}
              </p>
            </div>

            {/* CTA */}
            <Link href="/escalacao" onClick={close} data-track="popup_cta_montar" data-track-label="Montar Minha Escalação" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '16px', background: '#F5C400', color: '#000', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.06em', borderRadius: 12, textDecoration: 'none', boxShadow: '0 8px 24px rgba(245,196,0,0.35)' }}>
              <span style={{ fontSize: 20 }}>⚽</span>
              MONTAR MINHA ESCALAÇÃO
            </Link>

            <button onClick={close} data-track="popup_agora_nao" style={{ width: '100%', marginTop: 10, padding: '10px', background: 'none', border: 'none', color: '#444', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
              Agora não
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
