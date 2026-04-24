'use client';
// src/components/tigre-fc/JumbotronJogo.tsx
// Mobile-first — coluna única, centro protagonista
// Design tokens: gold / cyan / red / purple

import { useEffect, useState } from 'react';
import Link from 'next/link';

const C = {
  gold:   '#F5C400', cyan:   '#00F3FF',
  red:    '#FF2D55', purple: '#BF5FFF',
  gGold:  '0 0 8px rgba(245,196,0,0.6),0 0 20px rgba(245,196,0,0.3)',
  gCyan:  '0 0 8px rgba(0,243,255,0.7),0 0 20px rgba(0,243,255,0.35)',
  gRed:   '0 0 8px rgba(255,45,85,0.7),0 0 20px rgba(255,45,85,0.35)',
  gPurple:'0 0 8px rgba(191,95,255,0.7),0 0 20px rgba(191,95,255,0.35)',
};

interface Time  { nome: string; escudo_url: string | null; sigla?: string | null }
interface Jogo  {
  id: number; competicao: string; rodada: string;
  data_hora: string; local: string | null; transmissao: string | null;
  mandante: Time; visitante: Time;
}
interface RankUser { apelido?: string | null; nome?: string | null; pontos: number }
interface Stats {
  capitao?:       { nome: string; pts: number };
  heroi?:         { nome: string; pts: number };
  maisEscalado?:  { nome: string; pct: number };
  ranking?:       RankUser[];
  participantes?: number;
  posicao?:       number;
  golsSofridos?:  number;
  mediaSofaTime?: number;
  mediaSofa?:     number;
  mvp?:           { nome: string; media: number };
  meusPontos?:    number;
}
interface Props {
  jogo:            Jogo;
  stats?:          Stats;
  mercadoFechado?: boolean;
}

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

function Countdown({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h:'00', m:'00', s:'00', crit:false });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(dataHora).getTime() - 90 * 60_000 - Date.now();
      if (diff <= 0) { setT({ h:'00', m:'00', s:'00', crit:true }); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setT({ h:String(h).padStart(2,'0'), m:String(m).padStart(2,'0'), s:String(s).padStart(2,'0'), crit:h===0&&m<5 });
    };
    calc(); const id = setInterval(calc, 1000); return () => clearInterval(id);
  }, [dataHora]);

  const block = (val: string, lbl: string, red = false) => (
    <div style={{ background:'#080808', border:'1px solid rgba(245,196,0,0.18)', borderRadius:10, padding:'8px 10px', textAlign:'center', minWidth:58 }}>
      <span style={{ fontFamily:"'Barlow Condensed',monospace", fontSize:46, fontWeight:900, lineHeight:1, display:'block',
        color: red ? C.red : '#fff',
        textShadow: red ? C.gRed : '0 0 16px rgba(255,255,255,0.15)',
        animation: red ? 'red-pulse 1s ease-in-out infinite' : 'none' }}>
        {val}
      </span>
      <span style={{ fontSize:7, fontWeight:900, letterSpacing:'0.3em', color:'rgba(255,255,255,0.18)', marginTop:3, display:'block' }}>{lbl}</span>
    </div>
  );

  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:4, marginBottom:20 }}>
      {block(t.h,'HORAS')}
      <span style={{ fontSize:32, fontWeight:900, color:'rgba(245,196,0,0.28)', paddingBottom:16 }}>:</span>
      {block(t.m,'MIN')}
      <span style={{ fontSize:32, fontWeight:900, color:'rgba(245,196,0,0.28)', paddingBottom:16 }}>:</span>
      {block(t.s,'SEG', t.crit)}
    </div>
  );
}

function Escudo({ src, alt, novo }: { src: string | null; alt: string; novo?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  useEffect(() => { setImgSrc(src || FALLBACK); }, [src]);
  return (
    <div style={{ width:76, height:76, background:'#0d0d0d', borderRadius:18,
      display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0,
      border: novo ? '2px solid rgba(245,196,0,0.35)' : '1px solid rgba(255,255,255,0.1)',
      boxShadow: novo ? '0 0 18px rgba(245,196,0,0.15)' : 'none',
      animation: novo ? 'shield-glow 2.5s ease-in-out infinite' : 'none' }}>
      <img src={imgSrc} alt={alt} onError={() => setImgSrc(FALLBACK)}
        style={{ width:56, height:56, objectFit:'contain', display:'block' }} />
    </div>
  );
}

function StatCard({ lbl, val, sub, color, border }: {
  lbl: string; val: string; sub?: string; color: string; border: string;
}) {
  return (
    <div style={{ background:'rgba(255,255,255,0.02)', border:`1px solid ${border}`, borderRadius:8, padding:'9px 10px' }}>
      <div style={{ fontSize:8, fontWeight:900, letterSpacing:'0.15em', color, marginBottom:3 }}>{lbl}</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, fontStyle:'italic', lineHeight:1, color, textShadow:`0 0 8px ${color}88` }}>{val}</div>
      {sub && <div style={{ fontSize:8, marginTop:2, color:'rgba(255,255,255,0.35)' }}>{sub}</div>}
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const {
    capitao, heroi,
    maisEscalado   = { nome: '—', pct: 0 },
    ranking        = [],
    participantes  = 0,
    posicao, golsSofridos, mvp, meusPontos,
  } = stats;

  // aceita mediaSofaTime ou mediaSofa (retrocompatível)
  const mediaTime = stats.mediaSofaTime ?? stats.mediaSofa;

  return (
    <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", background:'#000',
      borderRadius:20, overflow:'hidden', position:'relative',
      border:'1px solid rgba(245,196,0,0.22)', maxWidth:420, width:'100%', margin:'0 auto' }}>

      <style>{`
        @keyframes scan{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes pulse-gold{0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.45),0 0 40px rgba(245,196,0,0.2)}50%{box-shadow:0 0 36px rgba(245,196,0,0.8),0 0 70px rgba(245,196,0,0.4)}}
        @keyframes red-pulse{0%,100%{text-shadow:0 0 8px #FF2D55}50%{text-shadow:0 0 20px #FF2D55,0 0 40px rgba(255,45,85,0.5)}}
        @keyframes shield-glow{0%,100%{box-shadow:0 0 18px rgba(245,196,0,0.15)}50%{box-shadow:0 0 36px rgba(245,196,0,0.4)}}
        @keyframes shimmer{0%{transform:translateX(-100%) skewX(-12deg)}100%{transform:translateX(220%) skewX(-12deg)}}
      `}</style>

      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:'radial-gradient(circle,rgba(245,196,0,0.04) 1px,transparent 1px)',
        backgroundSize:'4px 4px' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(245,196,0,0.016) 12px,rgba(245,196,0,0.016) 14px),repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,196,0,0.012) 18px,rgba(245,196,0,0.012) 20px)` }} />

      <div style={{ height:2, background:`linear-gradient(90deg,transparent,${C.gold},#fff,${C.cyan},transparent)`,
        backgroundSize:'200%', animation:'scan 2.5s linear infinite' }} />

      <div style={{ position:'relative', zIndex:1, padding:'16px 14px 18px' }}>

        {/* TOP BAR */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:14, paddingBottom:10, borderBottom:'1px solid rgba(245,196,0,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.cyan,
              boxShadow:`0 0 6px ${C.cyan},0 0 14px ${C.cyan}`,
              display:'inline-block', animation:'blink 1s ease-in-out infinite' }} />
            <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.3em', color:C.cyan, textShadow:`0 0 10px ${C.cyan}` }}>
              {mercadoFechado ? 'MERCADO FECHADO' : 'MERCADO ABERTO'}
            </span>
          </div>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.25em', color:C.gold, textShadow:C.gGold }}>
            {jogo.competicao.toUpperCase()}
          </span>
          <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.15em', color:'rgba(255,255,255,0.3)' }}>
            RD {jogo.rodada}
          </span>
        </div>

        {/* COUNTDOWN */}
        {!mercadoFechado && <Countdown dataHora={jogo.data_hora} />}

        {/* ESCUDOS */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, gap:6 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, flex:1 }}>
            <Escudo src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} />
            <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.1em',
              color:'rgba(255,255,255,0.4)', textAlign:'center', lineHeight:1.2 }}>
              {jogo.mandante.nome.toUpperCase()}
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, flexShrink:0, padding:'0 4px' }}>
            <span style={{ fontSize:20, fontWeight:900, fontStyle:'italic', color:'rgba(245,196,0,0.2)' }}>VS</span>
            <div style={{ width:1, height:28, background:`linear-gradient(180deg,transparent,rgba(245,196,0,0.4),transparent)` }} />
            <span style={{ fontSize:11, fontWeight:900, color:C.gold, textShadow:C.gGold, whiteSpace:'nowrap', textAlign:'center' }}>
              {new Date(jogo.data_hora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'America/Sao_Paulo'})}
              <br/>
              {new Date(jogo.data_hora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'})}
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, flex:1 }}>
            <Escudo src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} novo />
            <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.1em',
              color:C.gold, textShadow:`0 0 8px rgba(245,196,0,0.4)`, textAlign:'center', lineHeight:1.2 }}>
              {jogo.visitante.nome.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ESTÁDIO + TV */}
        <div style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)',
          borderRadius:10, padding:'9px 12px', marginBottom:10 }}>
          {jogo.local && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom: jogo.transmissao ? 5 : 0 }}>
              <span style={{ fontSize:11 }}>📍</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.06em', fontWeight:700 }}>{jogo.local}</span>
            </div>
          )}
          {jogo.transmissao && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
              <span style={{ fontSize:11 }}>📺</span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.06em', fontWeight:700 }}>{jogo.transmissao}</span>
            </div>
          )}
        </div>

        {/* XP BADGE */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          background:`rgba(191,95,255,0.1)`, border:`1px solid rgba(191,95,255,0.2)`,
          borderRadius:8, padding:'7px 12px', marginBottom:12 }}>
          <span style={{ fontSize:14 }}>🎯</span>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.1em', color:C.purple }}>PLACAR EXATO = +15 XP</span>
        </div>

        {/* CTA */}
        {mercadoFechado ? (
          <div style={{ width:'100%', background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.07)', borderRadius:12,
            color:'rgba(255,255,255,0.25)', fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:11, fontWeight:900, letterSpacing:'0.22em', padding:16, textAlign:'center' }}>
            🔒 MERCADO FECHADO
          </div>
        ) : (
          <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
            display:'flex', alignItems:'center', justifyContent:'center', width:'100%',
            background:`linear-gradient(135deg,${C.gold},#D4A200)`, borderRadius:12,
            color:'#000', fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:14, fontWeight:900, letterSpacing:'0.2em', padding:16,
            textDecoration:'none', textAlign:'center',
            animation:'pulse-gold 2s ease-in-out infinite',
            position:'relative', overflow:'hidden' }}>
            CONVOCAR TITULARES →
          </Link>
        )}

        <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.15em',
          color:'rgba(255,255,255,0.18)', textAlign:'center', marginTop:8 }}>
          Mercado fecha 90min antes do jogo
        </div>

        {/* STATS 2×2 */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8,
          marginTop:14, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
          <StatCard lbl="CAPITÃO · ÚLT. RD"
            val={capitao ? capitao.pts.toFixed(1) : '—'}
            sub={capitao ? `${capitao.nome} · 2× pts` : undefined}
            color={C.gold} border="rgba(245,196,0,0.1)" />
          <StatCard lbl="HERÓI · ÚLT. RD"
            val={heroi ? heroi.pts.toFixed(1) : '—'}
            sub={heroi ? `${heroi.nome} · POTM` : undefined}
            color={C.red} border="rgba(255,45,85,0.15)" />
          <StatCard lbl="+ ESCALADO"
            val={maisEscalado.nome}
            sub={maisEscalado.pct ? `${maisEscalado.pct}% dos times` : undefined}
            color={C.cyan} border="rgba(0,243,255,0.12)" />
          <StatCard lbl="POSIÇÃO SÉRIE B"
            val={posicao ? `${posicao}°` : '—'}
            color={C.gold} border="rgba(255,255,255,0.05)" />
        </div>

        {/* RANKING */}
        {ranking.length > 0 && (
          <div style={{ marginTop:10,
            background:`linear-gradient(160deg,rgba(191,95,255,0.06),transparent 70%)`,
            border:`1px solid rgba(191,95,255,0.15)`, borderRadius:10, padding:'10px 12px' }}>
            <div style={{ fontSize:8, fontWeight:900, letterSpacing:'0.35em',
              color:'rgba(191,95,255,0.5)', marginBottom:8, paddingBottom:5,
              borderBottom:'1px solid rgba(191,95,255,0.1)' }}>
              RANKING · TOP 5
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
              {ranking.slice(0,5).map((r, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:10, fontWeight:900, minWidth:18, color:C.purple, textShadow:C.gPurple }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.65)',
                    flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {r.apelido || r.nome || 'Torcedor'}
                  </span>
                  <span style={{ fontSize:10, fontWeight:900, color:C.purple, textShadow:C.gPurple }}>
                    {r.pontos}
                  </span>
                </div>
              ))}
            </div>
            {participantes > 0 && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                marginTop:7, paddingTop:6, borderTop:'1px solid rgba(191,95,255,0.08)' }}>
                <span style={{ fontSize:8, color:C.cyan, letterSpacing:'0.12em', fontWeight:700 }}>TORCEDORES ESCALANDO</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20,
                  fontWeight:900, color:C.cyan, textShadow:C.gCyan }}>{participantes}</span>
              </div>
            )}
          </div>
        )}

        {/* BOTTOM BAR */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5, marginTop:10 }}>
          {[
            { val: golsSofridos != null ? String(golsSofridos) : '—', lbl:'GOLS SOF',  color:C.red,    bg:'rgba(255,45,85,0.04)',   border:'rgba(255,45,85,0.15)' },
            { val: mediaTime    != null ? mediaTime.toFixed(2)   : '—', lbl:'MÉD SOFA', color:C.gold,   bg:'rgba(245,196,0,0.03)',   border:'rgba(245,196,0,0.08)' },
            { val: mvp          ? mvp.media.toFixed(2)           : '—', lbl:'MVP',       color:C.cyan,   bg:'rgba(0,243,255,0.03)',   border:'rgba(0,243,255,0.1)' },
            { val: meusPontos   != null ? String(meusPontos)     : '—', lbl:'MEUS PTS', color:C.purple, bg:'rgba(191,95,255,0.03)', border:'rgba(191,95,255,0.1)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:'center', background:s.bg,
              border:`1px solid ${s.border}`, borderRadius:6, padding:'7px 3px' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:16,
                fontWeight:900, fontStyle:'italic', lineHeight:1,
                color:s.color, textShadow:`0 0 8px ${s.color}88` }}>{s.val}</div>
              <div style={{ fontSize:6, fontWeight:700, letterSpacing:'0.12em',
                color:'rgba(255,255,255,0.2)', marginTop:3 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
