'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const ST = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';

const ESCALACAO_IMG = `${ST}/tigre-fc-escalacao-4-2-3-1.png`;
const LOGO_TIGRE    = `${ST}/tigre-fc-logo.png`;

/* ── Jogadores com fundo transparente confirmados ───────────────────────── */
const PLAYERS = [
  { name: 'JORDI',   short: 'JORDI',  pos: 'GOL', num: 93, ovr: 92, rar: 'toty'   as const, foto: `${ST}/JORDI%20FUNDO%20TRANSPARENTE.png`   },
  { name: 'RÔMULO',  short: 'RÔMULO', pos: 'MEI', num: 21, ovr: 85, rar: 'gold'   as const, foto: `${ST}/ROMULO%20FUNDO%20TRANSPARENTE.png`  },
  { name: 'ROBSON',  short: 'ROBSON', pos: 'ATA', num: 9,  ovr: 85, rar: 'gold'   as const, foto: `${ST}/ROBSON%20FUNDO%20TRANSPARENTE.png`  },
  { name: 'CARLÃO',  short: 'CARLÃO', pos: 'ATA', num: 90, ovr: 84, rar: 'gold'   as const, foto: `${ST}/CARLAO%20FUNDO%20TRANSPARENTE.png`  },
  { name: 'OYAMA',   short: 'OYAMA',  pos: 'MEI', num: 5,  ovr: 80, rar: 'purple' as const, foto: `${ST}/OYAMA%20FUNDO%20TRANSPARENTE.png`   },
  { name: 'DANTAS',  short: 'DANTAS', pos: 'MEI', num: 8,  ovr: 79, rar: 'purple' as const, foto: `${ST}/DANTAS%20FUNDO%20TRANSPARENTE.png`  },
  { name: 'JUNINHO', short: 'JNH',    pos: 'ATA', num: 11, ovr: 78, rar: 'purple' as const, foto: `${ST}/JUNINHO%20FUNDO%20TRANSPARENTE.png` },
];

const RAR = {
  toty:   { bg: 'linear-gradient(160deg,#1f2f66 0%,#0b1430 55%,#04030d 100%)', scrim:'#04030d', txt:'#ffe6a3', accent:'#FFD66B', flare:'#FFC24B', grad:'frame-sc-toty'   },
  gold:   { bg: 'linear-gradient(160deg,#fbe7a0 0%,#d6a52a 50%,#b07d12 100%)', scrim:'#b8841a', txt:'#3a2900', accent:'#7a5800', flare:'#fff3c4', grad:'frame-sc-gold'   },
  purple: { bg: 'linear-gradient(160deg,#6a2fb0 0%,#3b1170 55%,#160427 100%)', scrim:'#160427', txt:'#ffffff', accent:'#E9B6FF', flare:'#C77DFF', grad:'frame-sc-purple' },
};

const FRAME = `M150 8 C110 8 70 14 40 26 C30 30 22 38 22 50 L22 360 C22 388 60 410 150 424 C240 410 278 388 278 360 L278 50 C278 38 270 30 260 26 C230 14 190 8 150 8 Z`;

export default function TigreFCShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible]   = useState(false);
  const [active,  setActive]    = useState(0);
  const [count,   setCount]     = useState(0);
  const [paused,  setPaused]    = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    let n = 0;
    const iv = setInterval(() => { n++; setCount(n); if (n >= 10) clearInterval(iv); }, 100);
    return () => clearInterval(iv);
  }, [visible]);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => setActive(p => (p + 1) % PLAYERS.length), 3000);
    return () => clearInterval(iv);
  }, [paused]);

  const p   = PLAYERS[active];
  const r   = RAR[p.rar];
  const prev = () => { setPaused(true); setActive(a => (a - 1 + PLAYERS.length) % PLAYERS.length); };
  const next = () => { setPaused(true); setActive(a => (a + 1) % PLAYERS.length); };

  return (
    <section ref={ref} style={{ position:'relative', overflow:'hidden', background:'#030303' }}>

      <style>{`
        @keyframes sc-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes sc-glow    { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes sc-up      { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sc-card-in { from{opacity:0;transform:scale(.9) rotateY(-12deg)} to{opacity:1;transform:scale(1) rotateY(0)} }
        @keyframes sc-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes sc-dot     { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes sc-shine   { 0%,74%{transform:translateX(-130%)} 90%,100%{transform:translateX(130%)} }
        @keyframes sc-badge   { 0%,100%{box-shadow:0 0 0 0 rgba(245,196,0,0)} 50%{box-shadow:0 0 0 6px rgba(245,196,0,.2)} }
        .sc-step:hover { background:rgba(245,196,0,.08)!important; border-color:rgba(245,196,0,.3)!important; }
        .sc-step { transition:all .2s; }
        .sc-btn:hover { transform:translateY(-2px); box-shadow:0 0 36px rgba(245,196,0,.5)!important; }
        .sc-btn { transition:all .2s; }
        .sc-dot-btn:hover { background:#F5C400!important; transform:scale(1.2); }
        .sc-dot-btn { transition:all .2s; }
        .sc-nav:hover { background:rgba(245,196,0,.15)!important; color:#F5C400!important; }
        .sc-nav { transition:all .2s; }
      `}</style>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <div style={{ position:'relative', minHeight:640 }}>

        {/* Fundo escuro base */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 130% 90% at 60% 55%, #0a1a0a 0%, #040d04 45%, #030303 100%)' }} />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 70% at 50% 50%, transparent 30%, #030303 100%)' }} />

        <div style={{ position:'relative', zIndex:2, maxWidth:1240, margin:'0 auto', padding:'48px 24px 56px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }}>

          {/* ── COLUNA ESQUERDA ─────────────────────────────────────────── */}
          <div style={{ opacity:visible?1:0, animation:visible?'sc-up .7s ease both':'none' }}>

            {/* Badge */}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(245,196,0,.07)', border:'1px solid rgba(245,196,0,.2)', borderRadius:8, padding:'5px 14px', marginBottom:20 }}>
              <img src={LOGO_TIGRE} style={{ width:16, height:16, objectFit:'contain' }} alt="" />
              <span style={{ fontSize:9, fontWeight:900, color:'#F5C400', textTransform:'uppercase', letterSpacing:3 }}>NOVORIZONTINO FC · TEMPORADA 2026</span>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#4ade80', animation:'sc-dot 1.2s ease infinite' }} />
            </div>

            {/* Headline */}
            <h2 style={{ fontSize:'clamp(44px,6.5vw,76px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', lineHeight:.9, margin:'0 0 6px', letterSpacing:-2 }}>
              <span style={{ display:'block', color:'#fff' }}>VOCÊ</span>
              <span style={{ display:'block', color:'#fff' }}>COMANDA</span>
              <span style={{ display:'block', background:'linear-gradient(90deg,#F5C400,#fff8a0,#F5C400)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'sc-shimmer 2.5s linear infinite' }}>O TIGRE</span>
            </h2>

            <p style={{ fontSize:13, color:'#777', lineHeight:1.8, margin:'22px 0 30px', maxWidth:440 }}>
              Torcer não é suficiente. <strong style={{ color:'#fff' }}>Escale seus 11, escolha seu capitão e aposte no herói</strong> — dispute rodada a rodada com a torcida mais apaixonada da Série B.
            </p>

            {/* Steps */}
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:32 }}>
              {[
                { n:'01', l:'MONTE SUA ESCALAÇÃO', s:'Escolha os 11 entre os jogadores do Novorizontino', c:'#F5C400' },
                { n:'02', l:'MARQUE PONTOS',        s:'Gols, assistências, capitão e herói valem pontos',  c:'#60a5fa' },
                { n:'03', l:'SUBA NO RANKING',      s:'Dispute rodada a rodada com os melhores torcedores', c:'#4ade80' },
              ].map((s,i) => (
                <div key={i} className="sc-step" style={{ display:'flex', gap:14, alignItems:'center', padding:'10px 12px', borderRadius:10, border:'1px solid transparent', opacity:visible?1:0, animation:visible?`sc-up .6s ease ${300+i*100}ms both`:'none' }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:`${s.c}12`, border:`1px solid ${s.c}35`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:9, fontWeight:900, color:s.c }}>{s.n}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:1 }}>{s.l}</div>
                    <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{s.s}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:28 }}>
              <Link href="/tigre-fc" className="sc-btn" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#F5C400,#d4a800)', color:'#111', fontWeight:900, fontSize:12, padding:'14px 28px', borderRadius:10, textDecoration:'none', textTransform:'uppercase', letterSpacing:2, boxShadow:'0 0 28px rgba(245,196,0,.3)' }}>
                ⚡ ENTRAR NO JOGO
              </Link>
              <Link href="/tigre-fc/ranking" className="sc-btn" style={{ display:'inline-flex', alignItems:'center', gap:8, background:'transparent', color:'#F5C400', fontWeight:900, fontSize:12, padding:'14px 24px', borderRadius:10, textDecoration:'none', textTransform:'uppercase', letterSpacing:2, border:'1px solid rgba(245,196,0,.25)' }}>
                🏆 RANKING
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ display:'flex' }}>
                {['#F5C400','#60a5fa','#4ade80','#f87171'].map((c,i) => (
                  <div key={i} style={{ width:28, height:28, borderRadius:'50%', background:`${c}25`, border:`2px solid ${c}`, marginLeft:i>0?-8:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>🐯</div>
                ))}
              </div>
              <span style={{ fontSize:12, color:'#555' }}><strong style={{ color:'#fff' }}>{count}</strong> torcedores escalando agora</span>
            </div>
          </div>

          {/* ── COLUNA DIREITA ───────────────────────────────────────────── */}
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:32, opacity:visible?1:0, animation:visible?'sc-up .8s ease .2s both':'none' }}>

            {/* Imagem da escalação */}
            <div style={{ position:'relative', width:'55%', flexShrink:0 }}>
              <img
                src={ESCALACAO_IMG}
                alt="Escalação Tigre FC 4-2-3-1"
                style={{ width:'100%', height:'auto', objectFit:'contain', filter:'drop-shadow(0 0 40px rgba(74,222,128,.15))' }}
              />
              {/* Glow verde sob a imagem */}
              <div style={{ position:'absolute', bottom:-20, left:'10%', right:'10%', height:40, background:'radial-gradient(ellipse, rgba(74,222,128,.2), transparent 70%)', filter:'blur(10px)' }} />
            </div>

            {/* Card FIFA + controles */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, flex:1 }}>

              {/* Card principal */}
              <div key={active} style={{ animation:'sc-card-in .45s ease both', position:'relative' }}>
                <FifaCard player={p} />
              </div>

              {/* Navegação */}
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <button onClick={prev} className="sc-nav" style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'#666', fontSize:14, fontWeight:900, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>

                <div style={{ display:'flex', gap:6 }}>
                  {PLAYERS.map((_,i) => (
                    <button key={i} onClick={() => { setPaused(true); setActive(i); }} className="sc-dot-btn"
                      style={{ width:i===active?20:7, height:7, borderRadius:4, background:i===active?'#F5C400':'#333', border:'none', cursor:'pointer', padding:0 }} />
                  ))}
                </div>

                <button onClick={next} className="sc-nav" style={{ width:32, height:32, borderRadius:'50%', background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.1)', color:'#666', fontSize:14, fontWeight:900, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
              </div>

              {/* Nome + pos do jogador ativo */}
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:14, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:1 }}>{p.name}</div>
                <div style={{ fontSize:10, color:'#555', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginTop:2 }}>{p.pos} · #{p.num}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS BAR ──────────────────────────────────────────────────────── */}
      <div style={{ background:'#070707', borderTop:'1px solid #111', borderBottom:'1px solid #111' }}>
        <div style={{ maxWidth:1240, margin:'0 auto', padding:'18px 24px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:0 }}>
          {[
            { v:'14ª', l:'Rodada Atual',           c:'#F5C400' },
            { v:'10',  l:'Torcedores no Jogo',     c:'#60a5fa' },
            { v:'39',  l:'Jogadores Disponíveis',  c:'#4ade80' },
            { v:'114', l:'Recorde de Pontos',       c:'#f87171' },
          ].map((s,i) => (
            <div key={i} style={{ textAlign:'center', padding:'10px 0', borderRight:i<3?'1px solid #111':'none' }}>
              <div style={{ fontSize:26, fontWeight:900, color:s.c, lineHeight:1, fontStyle:'italic' }}>{s.v}</div>
              <div style={{ fontSize:9, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SVG DEFS globais */}
      <svg style={{ position:'absolute', width:0, height:0 }} aria-hidden>
        <defs>
          <clipPath id="sc-futShape" clipPathUnits="objectBoundingBox">
            <path d="M.5 .0186 C.3667 .0186 .2333 .0326 .1333 .0605 C.1 .0698 .0733 .0884 .0733 .1163 L.0733 .8372 C.0733 .9023 .2 .9535 .5 .986 C.8 .9535 .9267 .9023 .9267 .8372 L.9267 .1163 C.9267 .0884 .9 .0698 .8667 .0605 C.7667 .0326 .6333 .0186 .5 .0186 Z" />
          </clipPath>
          <linearGradient id="frame-sc-toty"   x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff4c2"/><stop offset=".5" stopColor="#d4ab2e"/><stop offset="1" stopColor="#9a7414"/></linearGradient>
          <linearGradient id="frame-sc-gold"   x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff6cf"/><stop offset=".5" stopColor="#e7be4a"/><stop offset="1" stopColor="#a87d18"/></linearGradient>
          <linearGradient id="frame-sc-purple" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f3e8ff"/><stop offset=".5" stopColor="#b89bd6"/><stop offset="1" stopColor="#6c4f8c"/></linearGradient>
        </defs>
      </svg>

      <style>{`
        @media (max-width:768px) {
          .sc-hero-grid { grid-template-columns:1fr!important; }
          .sc-stats      { grid-template-columns:repeat(2,1fr)!important; }
        }
      `}</style>
    </section>
  );
}

/* ── Card FIFA UT completo ───────────────────────────────────────────────── */
function FifaCard({ player }: { player: typeof PLAYERS[0] }) {
  const r = RAR[player.rar];
  return (
    <div style={{ width:170, position:'relative' }}>
      {/* Glow externo */}
      <div style={{ position:'absolute', inset:-16, borderRadius:40, filter:'blur(24px)', background:`radial-gradient(50% 50% at 50% 40%,${r.flare}99,transparent 70%)`, animation:'sc-glow 3s ease infinite' }} />

      <div style={{ position:'relative', width:'100%', aspectRatio:'300/430' }}>
        {/* Interior recortado */}
        <div style={{ position:'absolute', inset:0, overflow:'hidden', clipPath:'url(#sc-futShape)' }}>
          <div style={{ position:'absolute', inset:0, background:r.bg }} />

          {/* Flare */}
          <div style={{ position:'absolute', inset:0, background:`conic-gradient(from 200deg at 62% 30%,transparent,${r.flare}66,transparent 30%,${r.flare}44,transparent 55%)`, mixBlendMode:'screen', opacity:.9 }} />
          {[...Array(5)].map((_,i) => (
            <div key={i} style={{ position:'absolute', left:'58%', top:'22%', width:3, height:140, transformOrigin:'top center', transform:`rotate(${-40+i*22}deg)`, background:`linear-gradient(${r.flare},transparent)`, opacity:.5, filter:'blur(1px)' }} />
          ))}

          {/* Foto jogador */}
          <img
            src={player.foto}
            alt={player.name}
            style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', top:'3%', height:'68%', width:'82%', objectFit:'contain', objectPosition:'center top', maskImage:'linear-gradient(#000 78%,transparent)', WebkitMaskImage:'linear-gradient(#000 78%,transparent)', filter:'drop-shadow(0 8px 20px rgba(0,0,0,.7))' }}
          />

          {/* Scrim */}
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(transparent 44%,${r.scrim} 68%)` }} />

          {/* Brilho holográfico */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(115deg,transparent 36%,rgba(255,255,255,.22) 48%,transparent 60%)', mixBlendMode:'overlay', animation:'sc-shine 5s ease-in-out infinite' }} />
        </div>

        {/* Moldura SVG */}
        <svg viewBox="0 0 300 430" preserveAspectRatio="none" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
          <path d={FRAME} fill="none" stroke={`url(#${r.grad})`} strokeWidth={5} vectorEffect="non-scaling-stroke" />
          <path d={FRAME} fill="none" stroke={`url(#${r.grad})`} strokeWidth={1.5} vectorEffect="non-scaling-stroke" transform="translate(11 15.8) scale(.926)" />
        </svg>

        {/* Textos */}
        <div style={{ position:'absolute', inset:0 }}>
          {/* OVR + POS */}
          <div style={{ position:'absolute', left:'11%', top:'10%' }}>
            <div style={{ fontSize:34, fontWeight:900, fontStyle:'italic', color:r.txt, lineHeight:1, textShadow:'0 2px 8px rgba(0,0,0,.5)' }}>{player.ovr}</div>
            <div style={{ fontSize:14, fontWeight:900, color:r.txt, letterSpacing:1, marginTop:2 }}>{player.pos}</div>
            {/* Ícones playstyle */}
            <div style={{ display:'flex', flexDirection:'column', gap:3, marginTop:8 }}>
              {['⚡','➜','◎'].map((g,i) => (
                <div key={i} style={{ width:18, height:22, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:r.txt, clipPath:'polygon(50% 0,100% 28%,100% 72%,50% 100%,0 72%,0 28%)', background:i===2?r.accent:`${r.accent}33`, border:`1px solid ${r.accent}88` }}>{g}</div>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div style={{ position:'absolute', left:0, right:0, textAlign:'center', top:'62%' }}>
            <div style={{ fontSize:18, fontWeight:900, textTransform:'uppercase', letterSpacing:1, color:r.txt, textShadow:'0 2px 8px rgba(0,0,0,.6)' }}>{player.short}</div>
          </div>

          {/* Bandeira + liga */}
          <div style={{ position:'absolute', left:0, right:0, display:'flex', alignItems:'center', justifyContent:'center', gap:6, top:'73%' }}>
            <span style={{ fontSize:12 }}>🇧🇷</span>
            <span style={{ fontSize:7, fontWeight:900, color:r.txt, opacity:.7, letterSpacing:1 }}>SÉRIE B</span>
            <span style={{ fontSize:12 }}>🐯</span>
          </div>
        </div>
      </div>
    </div>
  );
}
