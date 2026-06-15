'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';
const BASE    = `${STORAGE}/JOGADORES/`;

/* ── FIFA cards: só jogadores com foto fundo transparente ─────────────────── */
const FIFA_CARDS = [
  { name: 'JORDI',  pos: 'GOL', ovr: 92, num: 93, rar: 'toty' as const, foto: `${STORAGE}/JORDI%20FUNDO%20TRANSPARENTE.png` },
  { name: 'RÔMULO', pos: 'MEI', ovr: 85, num: 21, rar: 'gold' as const, foto: `${STORAGE}/ROMULO%20FUNDO%20TRANSPARENTE.png` },
];

/* ── Jogadores no campo: igual à escalação ─────────────────────────────── */
const CAMPO_PLAYERS = [
  { name: 'ROBSON',  short: 'ROBSON', pos: 'ATA', num: 9,  foto: `${BASE}ROBSON.jpg.webp` },
  { name: 'CARLÃO',  short: 'CARLÃO', pos: 'ATA', num: 90, foto: `${BASE}CARLAO.jpg.webp` },
  { name: 'JORDI',   short: 'JORDI',  pos: 'GOL', num: 93, foto: `${STORAGE}/JORDI%20FUNDO%20TRANSPARENTE.png` },
  { name: 'OYAMA',   short: 'OYAMA',  pos: 'MEI', num: 5,  foto: `${BASE}LUIS-OYAMA.jpg.webp` },
  { name: 'BROCK',   short: 'BROCK',  pos: 'ZAG', num: 4,  foto: `${BASE}EDUARDO-BROCK.jpg.webp` },
];
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
  const [activeFifa, setActiveFifa] = useState(0);
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

  // Rotação automática de card FIFA
  useEffect(() => {
    const iv = setInterval(() => setActiveFifa(p => (p + 1) % FIFA_CARDS.length), 2800);
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
                {CAMPO_PLAYERS.map((player, i) => {
                  const pos = FORMACAO_POS[i];
                  return (
                    <div
                      key={i}
                      style={{
                        position: 'absolute',
                        top: pos.top, left: pos.left,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                      }}
                    >
                      <MiniCard player={player} />
                    </div>
                  );
                })}

                {/* Label campo */}
                <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center' }}>
                  <span style={{ fontSize: 8, color: '#1a3a1a', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 3 }}>ARENA TIGRE FC</span>
                </div>
              </div>

              {/* Card FIFA flutuante */}
              <div style={{ position: 'absolute', top: -24, right: -24, zIndex: 10, animation: 'tfc-float 3s ease infinite' }}>
                <FifaCard card={FIFA_CARDS[activeFifa]} />
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

/* ── Mini card no campo — mesmo estilo da escalação ─────────────────────── */
function MiniCard({ player }: { player: typeof CAMPO_PLAYERS[0] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, position: 'relative' }}>
      {/* Círculo igual à escalação */}
      <div style={{
        width: 48, height: 48,
        borderRadius: '50%', overflow: 'hidden',
        border: '2px solid #F5C400',
        boxShadow: '0 0 12px rgba(245,196,0,0.45)',
        background: 'rgba(0,0,0,0.6)',
        position: 'relative', flexShrink: 0,
      }}>
        <img
          src={player.foto}
          alt={player.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 15%' }}
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
        />
        {/* Badge número */}
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: 14, height: 14, borderRadius: '50%',
          background: '#000', border: '1.5px solid #F5C400',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: '#F5C400', fontSize: 7, fontWeight: 900 }}>{player.num}</span>
        </div>
      </div>
      {/* Nome */}
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        color: '#fff', fontSize: 8, fontWeight: 900,
        padding: '2px 6px', borderRadius: 3,
        textTransform: 'uppercase', letterSpacing: 0.5,
        whiteSpace: 'nowrap',
      }}>
        {player.short}
      </div>
      {/* Posição */}
      <div style={{ fontSize: 7, color: '#F5C400', fontWeight: 900, marginTop: -2 }}>{player.pos}</div>
    </div>
  );
}

/* ── Raridades estilo DestaquesFifa ─────────────────────────────────────── */
const FRAME_PATH = `M150 8 C110 8 70 14 40 26 C30 30 22 38 22 50 L22 360 C22 388 60 410 150 424 C240 410 278 388 278 360 L278 50 C278 38 270 30 260 26 C230 14 190 8 150 8 Z`;
const RARITIES = {
  toty:   { bg: 'radial-gradient(120% 85% at 50% 16%, #1f2f66 0%, #0b1430 52%, #04030d 100%)', scrim: '#04030d', txt: '#ffe6a3', accent: '#FFD66B', flare: '#FFC24B', frame: 'frame-sc-toty' },
  gold:   { bg: 'radial-gradient(120% 85% at 50% 20%, #fbe7a0 0%, #d6a52a 46%, #b07d12 100%)', scrim: '#b8841a', txt: '#3a2900', accent: '#7a5800', flare: '#fff3c4', frame: 'frame-sc-gold' },
  purple: { bg: 'radial-gradient(120% 85% at 50% 18%, #6a2fb0 0%, #3b1170 54%, #160427 100%)', scrim: '#160427', txt: '#ffffff', accent: '#E9B6FF', flare: '#C77DFF', frame: 'frame-sc-purple' },
};

/* ── Card FIFA Ultimate Team — estilo DestaquesFifa ─────────────────────── */
function FifaCard({ card }: { card: typeof CARDS[0] }) {
  const r = RARITIES[card.rar];
  return (
    <div className="tfc-fifa-card" style={{ width: 160, position: 'relative', animation: 'tfc-card-in 0.5s ease both' }}>
      {/* SVG defs exclusivos do showcase */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden>
        <defs>
          <clipPath id="sc-futShape" clipPathUnits="objectBoundingBox">
            <path d="M.5 .0186 C.3667 .0186 .2333 .0326 .1333 .0605 C.1 .0698 .0733 .0884 .0733 .1163 L.0733 .8372 C.0733 .9023 .2 .9535 .5 .986 C.8 .9535 .9267 .9023 .9267 .8372 L.9267 .1163 C.9267 .0884 .9 .0698 .8667 .0605 C.7667 .0326 .6333 .0186 .5 .0186 Z" />
          </clipPath>
          <linearGradient id="frame-sc-toty" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff4c2"/><stop offset=".5" stopColor="#d4ab2e"/><stop offset="1" stopColor="#9a7414"/>
          </linearGradient>
          <linearGradient id="frame-sc-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6cf"/><stop offset=".5" stopColor="#e7be4a"/><stop offset="1" stopColor="#a87d18"/>
          </linearGradient>
          <linearGradient id="frame-sc-purple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e8ff"/><stop offset=".5" stopColor="#b89bd6"/><stop offset="1" stopColor="#6c4f8c"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Glow externo */}
      <div style={{ position: 'absolute', inset: -12, borderRadius: 32, filter: 'blur(20px)', background: `radial-gradient(50% 50% at 50% 40%, ${r.flare}88, transparent 70%)`, animation: 'tfc-glow 3s ease infinite' }} />

      {/* Card */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '300/430' }}>
        {/* Conteúdo recortado na silhueta */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', clipPath: 'url(#sc-futShape)' }}>
          <div style={{ position: 'absolute', inset: 0, background: r.bg }} />

          {/* Flares */}
          <div style={{ position: 'absolute', inset: 0, background: `conic-gradient(from 200deg at 62% 30%, transparent, ${r.flare}55, transparent 30%, ${r.flare}33, transparent 55%)`, mixBlendMode: 'screen', opacity: 0.8 }} />

          {/* Foto do jogador — centralizada, fundo transparente */}
          <img
            src={card.foto}
            alt={card.name}
            style={{
              position: 'absolute',
              left: '50%', transform: 'translateX(-50%)',
              top: '4%', height: '66%', width: '78%',
              objectFit: 'contain', objectPosition: 'center top',
              maskImage: 'linear-gradient(#000 75%, transparent)',
              WebkitMaskImage: 'linear-gradient(#000 75%, transparent)',
              filter: 'drop-shadow(0 8px 16px rgba(0,0,0,.6))',
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
          />

          {/* Scrim inferior */}
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 44%, ${r.scrim} 70%)` }} />

          {/* Brilho holográfico */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(115deg, transparent 36%, rgba(255,255,255,.22) 48%, transparent 60%)',
            mixBlendMode: 'overlay',
            animation: 'futShineCard 5s ease-in-out infinite',
          }} />
        </div>

        {/* Moldura SVG */}
        <svg viewBox="0 0 300 430" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          <path d={FRAME_PATH} fill="none" stroke={`url(#${r.frame})`} strokeWidth={5} vectorEffect="non-scaling-stroke" />
          <path d={FRAME_PATH} fill="none" stroke={`url(#${r.frame})`} strokeWidth={2} vectorEffect="non-scaling-stroke" transform="translate(11 15.8) scale(.926)" />
        </svg>

        {/* Overlays de texto */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {/* OVR + POS */}
          <div style={{ position: 'absolute', left: '11%', top: '11%' }}>
            <div style={{ fontSize: 32, fontWeight: 900, fontStyle: 'italic', color: r.txt, lineHeight: 1 }}>{card.ovr}</div>
            <div style={{ fontSize: 13, fontWeight: 900, color: r.txt, letterSpacing: 1 }}>{card.pos}</div>
          </div>

          {/* Nome */}
          <div style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', top: '63%' }}>
            <div style={{ fontSize: 17, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: r.txt }}>{card.name}</div>
          </div>

          {/* Bandeira + liga */}
          <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, top: '74%' }}>
            <span style={{ fontSize: 12 }}>🇧🇷</span>
            <span style={{ fontSize: 7, fontWeight: 900, color: r.txt, opacity: 0.7, letterSpacing: 1 }}>SÉRIE B</span>
            <span style={{ fontSize: 12 }}>🐯</span>
          </div>
        </div>
      </div>

      <style>{`@keyframes futShineCard { 0%,74%{transform:translateX(-130%)} 90%,100%{transform:translateX(130%)} }`}</style>
    </div>
  );
}
