'use client';
import { useState, useEffect } from 'react';

const LOGO_PORTAL = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const ESCUDO_NOVO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const ESCUDO_ADV  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png';

type Time = { nome: string; escudo_url: string };
type Jogo = { id: number; competicao: string; data_hora: string; local: string; mandante: Time; visitante: Time };

function formatHorario(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}h${String(d.getMinutes()).padStart(2, '0') === '00' ? '' : String(d.getMinutes()).padStart(2, '0')}`;
}
function formatData(iso: string) {
  const d = new Date(iso);
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function isNovo(nome?: string) {
  return nome?.toLowerCase().includes('novorizontino') ?? false;
}

function EscudoImg({ src, alt, size = 64, glow }: { src: string; alt: string; size?: number; glow?: string }) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => { setImgSrc(src); }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={size}
      height={size}
      onError={() => setImgSrc(src.includes('novorizontino') ? ESCUDO_NOVO : ESCUDO_ADV)}
      style={{
        width: size, height: size,
        objectFit: 'contain',
        filter: glow ? `drop-shadow(0 0 12px ${glow})` : 'none',
      }}
    />
  );
}

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);

  useEffect(() => {
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => { if (jogos?.[0]) setJogo(jogos[0]); })
      .catch(() => {});
    setTimeout(() => setVisible(true), 3000);
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  // Lógica de exibição: Se não tiver jogo da API, assume Novo x América
  const mandante = jogo?.mandante ?? { nome: 'Novorizontino', escudo_url: ESCUDO_NOVO };
  const visitante = jogo?.visitante ?? { nome: 'América-MG', escudo_url: ESCUDO_ADV };
  
  const isJogoFora = isNovo(visitante.nome);

  return (
    <>
      <style>{`
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideDown { from { transform: translateY(0) } to { transform: translateY(100%) } }
      `}</style>

      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }} />

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, animation: closing ? 'slideDown 0.35s forwards' : 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <div style={{ background: '#0a0a0a', borderRadius: '32px 32px 0 0', borderTop: '4px solid #F5C400', maxWidth: 500, margin: '0 auto', padding: '30px 20px 40px' }}>
          
          {/* LOGO CORRIGIDA (FILTRO BRANCO) */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <img src={LOGO_PORTAL} alt="Portal" style={{ height: 35, filter: 'brightness(0) invert(1)' }} />
          </div>

          {/* BADGE COMPETIÇÃO */}
          <div style={{ textAlign: 'center', marginBottom: 25 }}>
            <span style={{ background: 'rgba(245,196,0,0.1)', color: '#F5C400', padding: '5px 15px', borderRadius: '50px', fontSize: 11, fontWeight: 900, border: '1px solid rgba(245,196,0,0.3)' }}>
              {jogo?.competicao ?? 'SÉRIE B 2026'}
            </span>
          </div>

          {/* CONFRONTO CORRIGIDO */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
            
            <div style={{ flex: 1, textAlign: 'center' }}>
              <EscudoImg src={mandante.escudo_url} alt={mandante.nome} glow={isNovo(mandante.nome) ? '#F5C400' : undefined} />
              <p style={{ color: isNovo(mandante.nome) ? '#F5C400' : '#fff', fontSize: 11, fontWeight: 900, marginTop: 10, textTransform: 'uppercase' }}>
                {mandante.nome}
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <span style={{ color: '#F5C400', fontSize: 24, fontWeight: 900, fontStyle: 'italic' }}>VS</span>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
              <EscudoImg src={visitante.escudo_url} alt={visitante.nome} glow={isNovo(visitante.nome) ? '#F5C400' : undefined} />
              <p style={{ color: isNovo(visitante.nome) ? '#F5C400' : '#fff', fontSize: 11, fontWeight: 900, marginTop: 10, textTransform: 'uppercase' }}>
                {visitante.nome}
              </p>
            </div>
          </div>

          <h2 style={{ color: '#fff', textAlign: 'center', fontSize: 28, fontWeight: 900, fontStyle: 'italic', lineHeight: 1, marginBottom: 25 }}>
            QUAL É O SEU <span style={{ color: '#F5C400' }}>TIME IDEAL?</span>
          </h2>

          <a href="https://www.onovorizontino.com.br/tigre-fc/sobre" onClick={close} style={{ display: 'block', background: '#F5C400', color: '#000', textAlign: 'center', padding: '18px', borderRadius: '15px', fontWeight: 900, textDecoration: 'none', fontSize: 15, boxShadow: '0 10px 20px rgba(245,196,0,0.2)' }}>
            🐯 MONTAR ESCALAÇÃO NO TIGRE FC
          </a>

          <button onClick={close} style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: '#444', marginTop: 15, fontWeight: 800, fontSize: 10, cursor: 'pointer', textTransform: 'uppercase' }}>
            FECHAR
          </button>
        </div>
      </div>
    </>
  );
}
