'use client';
import { useState, useEffect } from 'react';

// ─── Assets ───────────────────────────────────────────────────────────────────
const LOGO_PORTAL = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const ESCUDO_NOVO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const ESCUDO_ADV  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png';

// ─── Types ────────────────────────────────────────────────────────────────────
type Time = { nome: string; escudo_url: string };
type Jogo = { id: number; competicao: string; data_hora: string; local: string; mandante: Time; visitante: Time };

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatHorario(iso: string) {
  const d = new Date(iso);
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${String(d.getHours()).padStart(2, '0')}h${m === '00' ? '' : m}`;
}
function formatData(iso: string) {
  const d    = new Date(iso);
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function isHoje(iso: string) {
  return new Date().toDateString() === new Date(iso).toDateString();
}
function isNovo(nome?: string) {
  return nome?.toLowerCase().includes('novorizontino') ?? false;
}

function EscudoImg({ src, alt, size = 64, glow, fallback }: {
  src: string; alt: string; size?: number; glow?: string; fallback?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  useEffect(() => { setImgSrc(src); }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      crossOrigin="anonymous"
      width={size}
      height={size}
      onError={() => setImgSrc(fallback ?? ESCUDO_ADV)}
      style={{
        width: size, height: size,
        objectFit: 'contain',
        filter: glow ? `drop-shadow(0 0 12px ${glow})` : 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
      }}
    />
  );
}

export default function EscalacaoPopup() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [pulse,   setPulse]   = useState(false);
  const [jogo,    setJogo]    = useState<Jogo | null>(null);

  useEffect(() => {
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => { if (jogos?.[0]) setJogo(jogos[0]); })
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
    setTimeout(() => setVisible(false), 350);
  };

  if (!visible) return null;

  // Determina se o Novorizontino é o visitante (jogo fora)
  const jogoFora = jogo ? isNovo(jogo.visitante.nome) : false;

  return (
    <>
      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOut { from { opacity: 1 } to { opacity: 0 } }
        @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideDown { from { transform: translateY(0) } to { transform: translateY(100%) } }
        @keyframes shimmer { 0% { background-position: -200% center } 100% { background-position: 200% center } }
      `}</style>

      {/* Overlay */}
      <div onClick={close} style={{ position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', animation: closing ? 'fadeOut 0.35s forwards' : 'fadeIn 0.3s forwards' }} />

      {/* Sheet */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000, animation: closing ? 'slideDown 0.35s forwards' : 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <div style={{ background: 'linear-gradient(180deg, #121212 0%, #000 100%)', borderRadius: '32px 32px 0 0', borderTop: '4px solid #F5C400', maxWidth: 500, margin: '0 auto', position: 'relative', boxShadow: '0 -20px 40px rgba(0,0,0,0.5)' }}>
          
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: 'linear-gradient(90deg, transparent, #F5C400, #fff, #F5C400, transparent)', backgroundSize: '200%', animation: 'shimmer 3s linear infinite' }} />

          <div style={{ padding: '32px 24px' }}>
            
            {/* Logo do Portal */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <img src={LOGO_PORTAL} alt="Portal O Novorizontino" style={{ height: 40, width: 'auto', filter: 'brightness(1.2)' }} />
            </div>

            {/* Info do Jogo */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,196,0,0.1)', padding: '6px 16px', borderRadius: '100px', border: '1px solid rgba(245,196,0,0.2)' }}>
                    {jogo && isHoje(jogo.data_hora) && (
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: pulse ? '0 0 10px #ef4444' : 'none' }} />
                    )}
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {jogo ? `${formatData(jogo.data_hora)} — ${formatHorario(jogo.data_hora)}` : 'SÉRIE B 2026'}
                    </span>
                </div>
                <p style={{ fontSize: 10, color: '#555', fontWeight: 700, marginTop: 8, textTransform: 'uppercase' }}>
                    {jogo?.local ?? 'ESTÁDIO JORGE ISMAEL DE BIASI'}
                </p>
            </div>

            {/* Confronto */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', marginBottom: 32 }}>
              
              {/* LADO ESQUERDO */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <EscudoImg 
                    src={jogo?.mandante.escudo_url ?? (jogoFora ? ESCUDO_ADV : ESCUDO_NOVO)} 
                    alt="Mandante" 
                    glow={!jogoFora ? '#F5C400' : undefined}
                />
                <p style={{ fontSize: 11, fontWeight: 900, color: !jogoFora ? '#F5C400' : '#fff', marginTop: 10, textTransform: 'uppercase' }}>
                    {jogo?.mandante.nome ?? (jogoFora ? 'Adversário' : 'Novorizontino')}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: '#F5C400', fontStyle: 'italic' }}>VS</span>
                <span style={{ fontSize: 8, fontWeight: 900, color: '#333', textTransform: 'uppercase' }}>CONFRONTO</span>
              </div>

              {/* LADO DIREITO */}
              <div style={{ textAlign: 'center', flex: 1 }}>
                <EscudoImg 
                    src={jogo?.visitante.escudo_url ?? (jogoFora ? ESCUDO_NOVO : ESCUDO_ADV)} 
                    alt="Visitante" 
                    glow={jogoFora ? '#F5C400' : undefined}
                />
                <p style={{ fontSize: 11, fontWeight: 900, color: jogoFora ? '#F5C400' : '#fff', marginTop: 10, textTransform: 'uppercase' }}>
                    {jogo?.visitante.nome ?? (jogoFora ? 'Novorizontino' : 'Adversário')}
                </p>
              </div>

            </div>

            {/* Chamada */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <h2 style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.9 }}>
                QUAL É O SEU<br />
                <span style={{ color: '#F5C400' }}>TIME IDEAL?</span>
              </h2>
            </div>

            {/* Ação */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <a href="https://www.onovorizontino.com.br/tigre-fc/sobre" onClick={close} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '20px', background: '#F5C400', color: '#000', fontWeight: 900, fontSize: 15, textTransform: 'uppercase', borderRadius: 16, textDecoration: 'none', boxShadow: '0 10px 20px rgba(245,196,0,0.3)' }}>
                    <span style={{ fontSize: 24 }}>🐯</span> MONTAR ESCALAÇÃO NO TIGRE FC
                </a>
                
                <button onClick={close} style={{ background: 'none', border: 'none', color: '#444', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', cursor: 'pointer', padding: '10px' }}>
                    FECHAR
                </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
