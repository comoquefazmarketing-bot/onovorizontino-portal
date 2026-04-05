'use client';
import { useState, useEffect } from 'react';

// ─── Assets ───────────────────────────────────────────────────────────────────
const ESCUDO_NOVO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const ESCUDO_CRB  = 'https://upload.wikimedia.org/wikipedia/commons/7/73/CRB_logo.svg';

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
function isCRB(nome?: string) {
  return nome?.toLowerCase().includes('crb') ?? false;
}

// ─── EscudoImg — crossOrigin + fallback + glow ────────────────────────────────
function EscudoImg({ src, alt, size = 56, glow, fallback }: {
  src: string; alt: string; size?: number; glow?: string; fallback?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);

  // Sincroniza com prop (caso o jogo carregue depois do mount)
  useEffect(() => { setImgSrc(src); }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      crossOrigin="anonymous"
      loading="eager"
      width={size}
      height={size}
      onError={() => setImgSrc(fallback ?? ESCUDO_CRB)}
      style={{
        width: size, height: size,
        objectFit: 'contain',
        filter: glow
          ? `drop-shadow(0 0 10px ${glow})`
          : 'drop-shadow(0 4px 8px rgba(245,196,0,0.3))',
      }}
    />
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
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

  return (
    <>
      <style>{`
        @keyframes fadeIn    { from { opacity: 0 }              to { opacity: 1 } }
        @keyframes fadeOut   { from { opacity: 1 }              to { opacity: 0 } }
        @keyframes slideUp   { from { transform: translateY(100%) } to { transform: translateY(0) } }
        @keyframes slideDown { from { transform: translateY(0) }    to { transform: translateY(100%) } }
        @keyframes shimmer   { 0% { background-position: -200% center } 100% { background-position: 200% center } }
      `}</style>

      {/* Overlay */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
          animation: closing ? 'fadeOut 0.35s forwards' : 'fadeIn 0.3s forwards',
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000,
        animation: closing
          ? 'slideDown 0.35s forwards'
          : 'slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
      }}>
        <div style={{
          background: 'linear-gradient(160deg,#0f0f0f,#1a1200 60%,#0f1a0f)',
          borderRadius: '24px 24px 0 0',
          borderTop: '3px solid #F5C400',
          overflow: 'hidden',
          maxWidth: 540, margin: '0 auto',
          position: 'relative',
        }}>
          {/* Linha shimmer */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: 3,
            background: 'linear-gradient(90deg,#F5C400,#fff,#F5C400)',
            backgroundSize: '200%',
            animation: 'shimmer 2s linear infinite',
          }} />

          {/* Fechar */}
          <button
            onClick={close}
            data-track="popup_fechar_x"
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 30, height: 30, borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: 'none',
              color: '#666', fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 10,
            }}
          >✕</button>

          <div style={{ padding: '24px 20px 32px' }}>

            {/* ── Badge jogo / Série B ── */}
            {jogo ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                {isHoje(jogo.data_hora) && (
                  <>
                    <span style={{
                      width: 8, height: 8, borderRadius: '50%', background: '#ef4444',
                      display: 'inline-block',
                      boxShadow: pulse ? '0 0 8px #ef4444' : 'none', transition: 'box-shadow 0.4s',
                    }} />
                    <span style={{ fontSize: 10, fontWeight: 900, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                      Hoje
                    </span>
                  </>
                )}
                <span style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {formatHorario(jogo.data_hora)}
                </span>
                <span style={{ fontSize: 10, color: '#555', fontWeight: 700, textTransform: 'uppercase' }}>
                  · {jogo.competicao}
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#F5C400',
                  display: 'inline-block',
                  boxShadow: pulse ? '0 0 8px #F5C400' : 'none', transition: 'box-shadow 0.4s',
                }} />
                <span style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  Série B 2026
                </span>
              </div>
            )}

            {/* ── Escudos ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>

              {/* Mandante */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <EscudoImg
                  src={jogo?.mandante.escudo_url ?? ESCUDO_NOVO}
                  alt={jogo?.mandante.nome ?? 'Novorizontino'}
                  fallback={ESCUDO_NOVO}
                  glow={isCRB(jogo?.mandante.nome) ? '#EE2D31' : undefined}
                />
                <span style={{ fontSize: 10, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>
                  {jogo?.mandante.nome ?? 'Novorizontino'}
                </span>
              </div>

              {/* VS */}
              <span style={{ fontSize: 18, fontWeight: 900, color: '#F5C400', padding: '0 8px' }}>VS</span>

              {/* Visitante */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
                <EscudoImg
                  src={jogo?.visitante.escudo_url ?? ESCUDO_CRB}
                  alt={jogo?.visitante.nome ?? 'CRB'}
                  fallback={ESCUDO_CRB}
                  glow={isCRB(jogo?.visitante.nome) ? '#EE2D31' : undefined}
                />
                <span style={{ fontSize: 10, color: '#F5C400', fontWeight: 900, textTransform: 'uppercase', textAlign: 'center' }}>
                  {jogo?.visitante.nome ?? 'CRB'}
                </span>
              </div>

            </div>

            {/* ── Copy ── */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{
                fontSize: 28, fontWeight: 900, color: '#fff',
                fontStyle: 'italic', textTransform: 'uppercase',
                letterSpacing: '-0.02em', lineHeight: 1, marginBottom: 8,
              }}>
                QUAL É SUA<br />
                <span style={{ color: '#F5C400' }}>ESCALAÇÃO IDEAL?</span>
              </h2>
              <p style={{ fontSize: 13, color: '#777', lineHeight: 1.4 }}>
                Monte os 11, crave o placar e dispute o ranking.<br />
                {jogo
                  ? `${jogo.mandante.nome} x ${jogo.visitante.nome} — ${formatData(jogo.data_hora)}`
                  : 'Quem você coloca pra jogar hoje?'}
              </p>
            </div>

            {/* ── CTA Principal → Tigre FC ── */}
            {/* Usando <a> para URL externa — Next.js Link é só para rotas internas */}
            <a
              href="https://www.onovorizontino.com.br/tigre-fc/sobre"
              onClick={close}
              data-track="popup_cta_tigre_fc"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                width: '100%', padding: '16px',
                background: 'linear-gradient(135deg,#F5C400,#D4A200)',
                color: '#000', fontWeight: 900, fontSize: 14,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                borderRadius: 12, textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(245,196,0,0.4)',
              }}
            >
              <span style={{ fontSize: 20 }}>🐯</span>
              ENTRAR NO TIGRE FC
            </a>

            {/* ── CTA Secundário → Escalação simples (sem ranking) ── */}
            <a
              href="/escalacao"
              onClick={close}
              data-track="popup_cta_montar"
              style={{
                display: 'block', width: '100%', marginTop: 8,
                padding: '12px', textAlign: 'center',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#555', fontWeight: 700, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '0.06em',
                borderRadius: 12, textDecoration: 'none',
              }}
            >
              ⚽ Só escalar (sem ranking)
            </a>

            {/* Dispensar */}
            <button
              onClick={close}
              data-track="popup_agora_nao"
              style={{
                width: '100%', marginTop: 8, padding: '10px',
                background: 'none', border: 'none',
                color: '#333', fontSize: 11, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                cursor: 'pointer',
              }}
            >
              Agora não
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
