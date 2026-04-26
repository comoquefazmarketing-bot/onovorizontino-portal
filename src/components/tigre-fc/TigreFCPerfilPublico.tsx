'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
// Importação do componente que estava faltando:
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

// ── Design tokens ────────────────────────────────────────────────
const C = {
  gold:    '#F5C400', 
  cyan:    '#00F3FF',
  red:     '#FF2D55', 
  purple:  '#BF5FFF',
};

interface Time { nome: string; escudo_url: string | null; sigla?: string | null }
interface Jogo {
  id: number; competicao: string; rodada: string;
  data_hora: string; local: string | null; transmissao: string | null;
  mandante: Time; visitante: Time;
}
interface RankUser { id?: string; apelido?: string | null; nome?: string | null; pontos: number }
interface Stats {
  capitao?:       { nome: string; pts: number };
  heroi?:         { nome: string; pts: number };
  maisEscalado?:  { nome: string; pct: number };
  ranking?:       RankUser[];
  participantes?: number;
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
    <div style={{ background:'#111', border:`2px solid ${red ? C.red : '#333'}`, borderRadius:12, padding:'10px 12px', textAlign:'center', minWidth:70 }}>
      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:54, fontWeight:900, lineHeight:1, display:'block', color: red ? C.red : '#fff' }}>
        {val}
      </span>
      <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.2em', color: red ? C.red : 'rgba(255,255,255,0.5)', marginTop:4, display:'block' }}>{lbl}</span>
    </div>
  );

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom:24 }}>
      {block(t.h,'HORAS')}
      <span style={{ fontSize:40, fontWeight:900, color:'#333' }}>:</span>
      {block(t.m,'MIN')}
      <span style={{ fontSize:40, fontWeight:900, color:'#333' }}>:</span>
      {block(t.s,'SEG', t.crit)}
    </div>
  );
}

function Escudo({ src, alt, novo }: { src: string | null; alt: string; novo?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  return (
    <div style={{ width:90, height:90, background:'#0d0d0d', borderRadius:22, display:'flex', alignItems:'center', justifyContent:'center', border: novo ? `3px solid ${C.gold}` : '1px solid rgba(255,255,255,0.2)' }}>
      <img src={imgSrc} alt={alt} onError={() => setImgSrc(FALLBACK)} style={{ width:65, height:65, objectFit:'contain' }} />
    </div>
  );
}

function StatCard({ lbl, val, sub, color, border }: { lbl: string; val: string; sub?: string; color: string; border: string; }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.06)', border:`1px solid ${border}`, borderRadius:12, padding:'12px' }}>
      <div style={{ fontSize:10, fontWeight:900, color, marginBottom:6 }}>{lbl}</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:28, fontWeight:900, fontStyle:'italic', color: '#fff' }}>{val}</div>
      {sub && <div style={{ fontSize:11, marginTop:5, color:'rgba(255,255,255,0.7)', fontWeight:700 }}>{sub}</div>}
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: { jogo: Jogo; stats?: Stats; mercadoFechado?: boolean }) {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setMeuId(data.user.id);
    });
  }, []);

  const ranking = stats.ranking || [];

  return (
    <div style={{ fontFamily:"'Barlow Condensed', sans-serif", background:'#000', borderRadius:24, overflow:'hidden', border:'1px solid #333', maxWidth:460, width:'95%', margin:'0 auto', padding:'24px 20px' }}>
      
      {/* HEADER */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <span style={{ fontSize:12, fontWeight:900, color:C.cyan }}>{mercadoFechado ? 'MERCADO FECHADO' : 'MERCADO ABERTO'}</span>
        <span style={{ fontSize:14, fontWeight:900, color:C.gold }}>{jogo.competicao.toUpperCase()}</span>
      </div>

      {!mercadoFechado && <Countdown dataHora={jogo.data_hora} />}

      {/* TIMES */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ flex:1, textAlign:'center' }}>
          <Escudo src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} />
          <p style={{ color:'#fff', fontWeight:900, fontSize:12, marginTop:8 }}>{jogo.mandante.nome}</p>
        </div>
        <div style={{ fontStyle:'italic', fontWeight:900, fontSize:24, color:'rgba(255,255,255,0.2)' }}>VS</div>
        <div style={{ flex:1, textAlign:'center' }}>
          <Escudo src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} novo />
          <p style={{ color:C.gold, fontWeight:900, fontSize:12, marginTop:8 }}>{jogo.visitante.nome}</p>
        </div>
      </div>

      {/* BOTÃO AÇÃO */}
      {!mercadoFechado && (
        <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ display:'block', background:C.gold, color:'#000', textAlign:'center', padding:18, borderRadius:16, fontWeight:900, textDecoration:'none', marginBottom:20 }}>
          CONVOCAR TITULARES →
        </Link>
      )}

      {/* STATS */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:20 }}>
        <StatCard lbl="CAPITÃO" val={stats.capitao?.pts.toFixed(1) || '0.0'} sub={stats.capitao?.nome || '—'} color={C.gold} border="rgba(245,196,0,0.2)" />
        <StatCard lbl="HERÓI" val={stats.heroi?.pts.toFixed(1) || '0.0'} sub={stats.heroi?.nome || '—'} color={C.red} border="rgba(255,45,85,0.2)" />
      </div>

      {/* RANKING COM ACESSO AO PERFIL */}
      <div style={{ background:'#0a0a0a', border:`2px solid ${C.purple}`, borderRadius:16, padding:16 }}>
        <p style={{ fontSize:12, fontWeight:900, color:C.purple, marginBottom:12 }}>RANKING TOP JOGADORES</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {ranking.map((r, i) => (
            <div 
              key={i} 
              onClick={() => r.id && setPerfilAberto(r.id)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:10, background:'#111', borderRadius:10, cursor:'pointer' }}
            >
              <span style={{ fontWeight:900, color:C.gold }}>{i+1}º</span>
              <span style={{ flex:1, color:'#fff', fontWeight:700 }}>{r.apelido || r.nome}</span>
              <span style={{ color:C.purple, fontWeight:900 }}>{r.pontos} pts</span>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE PERFIL PÚBLICO */}
      {perfilAberto && (
        <TigreFCPerfilPublico 
          targetUsuarioId={perfilAberto} 
          viewerUsuarioId={meuId} 
          onClose={() => setPerfilAberto(null)} 
        />
      )}
    </div>
  );
}
