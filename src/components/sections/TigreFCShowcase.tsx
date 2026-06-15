'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/* ── Jogadores destaque para o showcase ──────────────────────────────────── */
const CARDS = [
  { name: 'ROBSON',  pos: 'ATA', ovr: 85, num: 9,  foto: 'ROBSON.jpg.webp',          stars: [true,true,true,true,true]  },
  { name: 'CARLÃO',  pos: 'ATA', ovr: 84, num: 90, foto: 'CARLAO.jpg.webp',           stars: [true,true,true,true,true]  },
  { name: 'JORDI',   pos: 'GOL', ovr: 82, num: 93, foto: 'JORDI.jpg.webp',            stars: [true,true,true,true,false] },
  { name: 'OYAMA',   pos: 'MEI', ovr: 80, num: 5,  foto: 'LUIS-OYAMA.jpg.webp',       stars: [true,true,true,true,false] },
  { name: 'BROCK',   pos: 'ZAG', ovr: 79, num: 4,  foto: 'EDUARDO-BROCK.jpg.webp',    stars: [true,true,true,false,false] },
];

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const LOGO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

/* ── Posições no campo ───────────────────────────────────────────────────── */
const FORMACAO_POS = [
  { top: '12%', left: '50%' },  // GOL
  { top: '35%', left: '25%' },  // ZAG
  { top: '55%', left: '72%' },  // MEI
  { top: '72%', left: '35%' },  // ATA 1
  { top: '72%', left: '65%' },  // ATA 2
];

export default function TigreFCShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Counter animado 0→10 jogadores
  useEffect(() => {
    if (!visible) return;
    let n = 0;
    const iv = setInterval(() => { n++; setCount(n); if (n >= 10) clearInterval(iv); }, 80);
    return () => clearInterval(iv);
  }, [visible]);

  // Rotação automática de card ativo
  useEffect(() => {
    const iv = setInterval(() => setActiveCard(p => (p + 1) % CARDS.length), 2200);
    return () => clearInterval(iv);
  }, []);

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', background: '#030303', padding: '0 0 0' }}>

      <style>{`
        @keyframes tfc-glow { 0%,100%{text-shadow:0 0 20px #F5C400,0 0 60px #F5C40060} 50%{text-shadow:0 0 40px #F5C400,0 0 100px #F5C400,0 0 160px #F5C40040} }
        @keyframes tfc-scan { 0%{transform:translateY(-100%);opacity:0.6} 100%{transform:translateY(800%);opacity:0} }
        @keyframes tfc-fade-up { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tfc-card-in { from{opacity:0;transform:translateY(40px) scale(0.9) rotateY(-15deg)} to{opacity:1;transform:translateY(0) scale(1) rotateY(0deg)} }
        @keyframes tfc-pulse-border { 0%,100%{border-color:#F5C40060} 50%{border-color:#F5C400} }
        @keyframes tfc-flicker { 0%,98%,100%{opacity:1} 99%{opacity:0.85} }
        @keyframes tfc-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes tfc-float { 0%,100%{transform:translateY(0) rotate(-1deg)} 50%{transform:translateY(-10px) rotate(1deg)} }
        @keyframes tfc-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes tfc-dot { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes tfc-bar { from{width:0} to{width:var(--w)} }
        @keyframes tfc-zoom-bg { from{transform:scale(1.08)} to{transform:scale(1)} }
        .tfc-btn-hover:hover { transform:translateY(-2px) scale(1.03); box-shadow:0 0 40px rgba(245,196,0,0.5)!important; }
        .tfc-btn-hover { transition:all 0.2s ease; }
        .tfc-card-hover:hover { transform:translateY(-8px) scale(1.04) !important; z-index:10; }
        .tfc-card-hover { transition:transform 0.3s ease; }
      `}</style>

      {/* ── TICKER TOPO ────────────────────────────────────────────────────── */}
      <div style={{ background: '#F5C400', overflow: 'hidden', height: 30, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 0, animation: 'tfc-marquee 18s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[...Array(2)].map((_, r) => (
            <span key={r} style={{ display: 'flex', gap: 0 }}>
              {['⚡ TIGRE FC — O JOGO OFICIAL DA TORCIDA', '🐯 ESCALE SEU TIME', '🏆 DISPUTE O RANKING', '⚽ PRÓXIMO JOGO EM BREVE', '🔥 10 TORCEDORES JÁ ESTÃO NO JOGO'].map((t, i) => (
                <span key={i} style={{ fontSize: 10, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 2, padding: '0 32px' }}>{t}</span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO PRINCIPAL ─────────────────────────────────────────────────── */}
      <div style={{ position: 'relative', minHeight: 680, display: 'flex', flexDirection: 'column' }}>

        {/* Campo de fundo */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* Campo verde CSS */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 120% 80% at 50% 60%, #0a1f0a 0%, #040d04 50%, #030303 100%)', animation: visible ? 'tfc-zoom-bg 1.2s ease forwards' : 'none' }} />

          {/* Linhas do campo */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 800 680" preserveAspectRatio="xMidYMid slice">
            {/* Campo principal */}
            <rect x="80" y="60" width="640" height="560" rx="4" fill="none" stroke="#4ade80" strokeWidth="2"/>
            {/* Círculo central */}
            <circle cx="400" cy="340" r="80" fill="none" stroke="#4ade80" strokeWidth="2"/>
            <circle cx="400" cy="340" r="3" fill="#4ade80"/>
            {/* Linha do meio */}
            <line x1="80" y1="340" x2="720" y2="340" stroke="#4ade80" strokeWidth="2"/>
            {/* Grande área topo */}
            <rect x="240" y="60" width="320" height="120" fill="none" stroke="#4ade80" strokeWidth="2"/>
            <rect x="320" y="60" width="160" height="60" fill="none" stroke="#4ade80" strokeWidth="2"/>
            {/* Grande área baixo */}
            <rect x="240" y="500" width="320" height="120" fill="none" stroke="#4ade80" strokeWidth="2"/>
            <rect x="320" y="560" width="160" height="60" fill="none" stroke="#4ade80" strokeWidth="2"/>
            {/* Cantos */}
            <path d="M80,60 Q95,60 95,75" fill="none" stroke="#4ade80" strokeWidth="2"/>
            <path d="M720,60 Q705,60 705,75" fill="none" stroke="#4ade80" strokeWidth="2"/>
            <path d="M80,620 Q95,620 95,605" fill="none" stroke="#4ade80" strokeWidth="2"/>
            <path d="M720,620 Q705,620 705,605" fill="none" stroke="#4ade80" strokeWidth="2"/>
            {/* Listras do gramado */}
            {[...Array(8)].map((_,i) => (
              <rect key={i} x="80" y={60 + i*70} width="640" height="35" fill="#0d260d" opacity="0.5"/>
            ))}
          </svg>

          {/* Vinheta escura nas bordas */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, #030303 100%)' }} />
          {/* Scanline decorativo */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(180deg, #F5C40008, transparent)', animation: 'tfc-scan 4s ease infinite', pointerEvents: 'none' }} />
        </div>

        {/* Conteúdo */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '56px 24px 48px', width: '100%' }}>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

            {/* COLUNA ESQUERDA — copy */}
            <div style={{ opacity: visible ? 1 : 0, animation: visible ? 'tfc-fade-up 0.7s ease forwards' : 'none' }}>

              {/* Badge EA-style */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,196,0,0.08)', border: '1px solid rgba(245,196,0,0.25)', borderRadius: 6, padding: '5px 14px', marginBottom: 24 }}>
                <img src={LOGO_TIGRE} style={{ width: 18, height: 18, objectFit: 'contain' }} alt="" />
                <span style={{ fontSize: 9, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: 3, animation: 'tfc-flicker 8s ease infinite' }}>
                  NOVORIZONTINO FC • TEMPORADA 2026
                </span>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', animation: 'tfc-dot 1.2s ease infinite' }} />
              </div>

              {/* Título bomba */}
              <h2 style={{ fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.9, margin: '0 0 8px', letterSpacing: -2 }}>
                <span style={{ display: 'block', color: '#fff' }}>VOCÊ</span>
                <span style={{ display: 'block', color: '#fff' }}>COMANDA</span>
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(90deg, #F5C400, #fff8a0, #F5C400)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'tfc-shimmer 2.5s linear infinite, tfc-glow 2s ease infinite',
                }}>
                  O TIGRE
                </span>
              </h2>

              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, margin: '20px 0 32px', maxWidth: 420, fontWeight: 500 }}>
                Torcer não é suficiente. <strong style={{ color: '#fff' }}>Escale seu time, escolha seu capitão, aposte no herói da partida</strong> — e dispute o ranking da torcida mais apaixonada da Série B.
              </p>

              {/* Steps estilo HUD */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
                {[
                  { n: '01', label: 'MONTE SUA ESCALAÇÃO', sub: 'Escolha os 11 titulares entre os jogadores do Novorizontino', cor: '#F5C400' },
                  { n: '02', label: 'MARQUE PONTOS', sub: 'Cada gol, assistência e performance conta na sua pontuação', cor: '#60a5fa' },
                  { n: '03', label: 'SUBA NO RANKING', sub: 'Dispute rodada a rodada com os melhores torcedores do Vale', cor: '#4ade80' },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', opacity: visible ? 1 : 0, animation: visible ? `tfc-fade-up 0.6s ease ${300 + i * 120}ms both` : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.cor}15`, border: `1px solid ${s.cor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 9, fontWeight: 900, color: s.cor, letterSpacing: 1 }}>{s.n}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                      <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link
                  href="/tigre-fc"
                  className="tfc-btn-hover"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'linear-gradient(135deg, #F5C400, #d4a800)',
                    color: '#111', fontWeight: 900, fontSize: 13,
                    padding: '14px 28px', borderRadius: 10,
                    textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 2,
                    boxShadow: '0 0 30px rgba(245,196,0,0.35)',
                  }}
                >
                  ⚡ ENTRAR NO JOGO
                </Link>
                <Link
                  href="/tigre-fc/ranking"
                  className="tfc-btn-hover"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'transparent', color: '#F5C400', fontWeight: 900, fontSize: 13,
                    padding: '14px 24px', borderRadius: 10,
                    textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 2,
                    border: '1px solid rgba(245,196,0,0.3)',
                  }}
                >
                  🏆 VER RANKING
                </Link>
              </div>

              {/* Social proof */}
              <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex' }}>
                  {['#F5C400','#60a5fa','#4ade80','#f87171'].map((c, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c + '30', border: `2px solid ${c}`, marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>🐯</div>
                  ))}
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{count}</span>
                  <span style={{ fontSize: 11, color: '#555', marginLeft: 6 }}>torcedores escalando agora</span>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA — campo + cards */}
            <div style={{ position: 'relative', height: 520, opacity: visible ? 1 : 0, animation: visible ? 'tfc-fade-up 0.8s ease 0.2s both' : 'none' }}>

              {/* Campo miniatura */}
              <div style={{
                position: 'absolute', inset: 0,
                borderRadius: 20,
                background: 'linear-gradient(180deg, #0a1f0a 0%, #0d2d0d 100%)',
                border: '1px solid #1a3a1a',
                overflow: 'hidden',
                boxShadow: '0 0 60px rgba(74,222,128,0.08), inset 0 0 60px rgba(0,0,0,0.5)',
              }}>
                {/* Linhas campo mini */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} viewBox="0 0 400 520">
                  <rect x="20" y="20" width="360" height="480" rx="3" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                  <circle cx="200" cy="260" r="50" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                  <circle cx="200" cy="260" r="2" fill="#4ade80"/>
                  <line x1="20" y1="260" x2="380" y2="260" stroke="#4ade80" strokeWidth="1.5"/>
                  <rect x="120" y="20" width="160" height="80" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                  <rect x="160" y="20" width="80" height="35" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                  <rect x="120" y="420" width="160" height="80" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                  <rect x="160" y="465" width="80" height="35" fill="none" stroke="#4ade80" strokeWidth="1.5"/>
                  {[...Array(6)].map((_,i) => (
                    <rect key={i} x="20" y={20+i*80} width="360" height="40" fill="#0d2d0d" opacity="0.4"/>
                  ))}
                </svg>

                {/* Gradiente topo */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, #030303, transparent)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(0deg, #030303, transparent)' }} />

                {/* Cards de jogadores no campo */}
                {CARDS.map((card, i) => {
                  const pos = FORMACAO_POS[i];
                  const isActive = activeCard === i;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveCard(i)}
                      className="tfc-card-hover"
                      style={{
                        position: 'absolute',
                        top: pos.top, left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                        zIndex: isActive ? 5 : 1,
                      }}
                    >
                      <MiniCard card={card} active={isActive} />
                    </button>
                  );
                })}

                {/* Label campo */}
                <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ fontSize: 8, color: '#1a3a1a', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>ARENA TIGRE FC</span>
                </div>
              </div>

              {/* Card destaque flutuante — jogador ativo */}
              <div style={{
                position: 'absolute',
                top: -24, right: -24,
                zIndex: 10,
                animation: 'tfc-float 3s ease infinite',
              }}>
                <FifaCard card={CARDS[activeCard]} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <div style={{ background: '#080808', borderTop: '1px solid #111', borderBottom: '1px solid #111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
          {[
            { v: '13ª',    l: 'Rodada Atual',        c: '#F5C400' },
            { v: '10',     l: 'Torcedores no Jogo',  c: '#60a5fa' },
            { v: '39',     l: 'Jogadores Disponíveis', c: '#4ade80' },
            { v: '107',    l: 'Recorde de Pontos',    c: '#f87171' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '12px 0', borderRight: i < 3 ? '1px solid #111' : 'none' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.c, lineHeight: 1, fontVariantNumeric: 'tabular-nums', fontStyle: 'italic' }}>{s.v}</div>
              <div style={{ fontSize: 9, color: '#444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MOBILE RESPONSIVO ──────────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 768px) {
          .tfc-grid { grid-template-columns: 1fr !important; }
          .tfc-stats { grid-template-columns: repeat(2,1fr) !important; }
          .tfc-field-col { height: 340px !important; margin-top: 32px; }
          .tfc-fifa-card { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Mini card no campo ──────────────────────────────────────────────────── */
function MiniCard({ card, active }: { card: typeof CARDS[0]; active: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      transition: 'all 0.3s ease',
    }}>
      {/* Avatar */}
      <div style={{
        width: active ? 52 : 40, height: active ? 52 : 40,
        borderRadius: '50%', overflow: 'hidden',
        border: `2px solid ${active ? '#F5C400' : '#2a4a2a'}`,
        boxShadow: active ? '0 0 16px rgba(245,196,0,0.6)' : 'none',
        background: '#0a1f0a',
        transition: 'all 0.3s ease',
        flexShrink: 0,
      }}>
        <img
          src={`${BASE}${card.foto}`}
          alt={card.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>
      {/* Nome + pos */}
      <div style={{
        background: active ? '#F5C400' : 'rgba(0,0,0,0.8)',
        color: active ? '#111' : '#fff',
        fontSize: 8, fontWeight: 900,
        padding: '1px 5px', borderRadius: 3,
        textTransform: 'uppercase', letterSpacing: 0.5,
        transition: 'all 0.3s ease',
      }}>
        {card.name}
      </div>
    </div>
  );
}

/* ── Card FIFA Ultimate Team ─────────────────────────────────────────────── */
function FifaCard({ card }: { card: typeof CARDS[0] }) {
  const isGold = card.ovr >= 83;
  const isSilver = card.ovr >= 78 && card.ovr < 83;

  const cardBg = isGold
    ? 'linear-gradient(160deg, #2a1f00 0%, #1a1200 30%, #0f0900 60%, #1a1200 100%)'
    : isSilver
    ? 'linear-gradient(160deg, #1a1a2e 0%, #111128 100%)'
    : 'linear-gradient(160deg, #1a1000 0%, #100a00 100%)';

  const cardBorder = isGold ? '#c9900020' : isSilver ? '#a78bfa20' : '#f9731620';
  const accentColor = isGold ? '#F5C400' : isSilver ? '#a78bfa' : '#f97316';

  return (
    <div className="tfc-fifa-card" style={{
      width: 130, padding: '12px 10px 10px',
      background: cardBg,
      border: `1px solid ${cardBorder}`,
      borderRadius: 12,
      boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 30px ${accentColor}20, inset 0 1px 0 ${accentColor}30`,
      animation: 'tfc-card-in 0.5s ease both',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Brilho canto */}
      <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: `radial-gradient(circle at top right, ${accentColor}25, transparent 70%)` }} />

      {/* OVR + POS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: accentColor, lineHeight: 1, fontStyle: 'italic' }}>{card.ovr}</div>
          <div style={{ fontSize: 8, fontWeight: 900, color: accentColor, textTransform: 'uppercase', letterSpacing: 1 }}>{card.pos}</div>
        </div>
        <div style={{ fontSize: 16, fontWeight: 900, color: accentColor + '60' }}>#{card.num}</div>
      </div>

      {/* Foto — alinhada à direita, vaza para fora do card como FIFA */}
      <div style={{ width: '100%', height: 90, position: 'relative', marginBottom: 6, overflow: 'visible' }}>
        <img
          src={`${BASE}${card.foto}`}
          alt={card.name}
          style={{
            position: 'absolute',
            right: -10, bottom: 0,
            height: 110,
            width: 'auto',
            objectFit: 'contain',
            objectPosition: 'right bottom',
            filter: 'drop-shadow(-4px 0 8px rgba(0,0,0,0.8))',
          }}
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = 'none';
            const fb = document.createElement('div');
            fb.style.cssText = 'width:100%;height:90px;display:flex;align-items:center;justify-content:center;font-size:40px';
            fb.textContent = '🐯';
            el.parentElement!.appendChild(fb);
          }}
        />
        {/* Gradiente esquerda para proteger OVR */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 30%, transparent 70%)', pointerEvents: 'none' }} />
      </div>

      {/* Nome */}
      <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {card.name}
      </div>

      {/* Linha dourada */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${accentColor}60, transparent)`, marginBottom: 8 }} />

      {/* Stars */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {card.stars.map((lit, i) => (
          <span key={i} style={{ fontSize: 9, color: lit ? accentColor : '#333' }}>★</span>
        ))}
      </div>
    </div>
  );
}
