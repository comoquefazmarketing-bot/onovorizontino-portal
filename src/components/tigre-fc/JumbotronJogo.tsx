'use client';
// src/components/tigre-fc/JumbotronJogo.tsx
// Mobile-first | Auto-fetch última rodada (capitão, herói, ranking)
// Contraste e legibilidade elevados

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ── Design tokens ──────────────────────────────────────────
const C = {
  gold:    '#F5C400', cyan:    '#00F3FF',
  red:     '#FF2D55', purple:  '#BF5FFF',
  gGold:   '0 0 8px rgba(245,196,0,0.7),0 0 20px rgba(245,196,0,0.35)',
  gCyan:   '0 0 8px rgba(0,243,255,0.8),0 0 20px rgba(0,243,255,0.4)',
  gRed:    '0 0 8px rgba(255,45,85,0.8),0 0 20px rgba(255,45,85,0.4)',
  gPurple: '0 0 8px rgba(191,95,255,0.8),0 0 20px rgba(191,95,255,0.4)',
};

// ── Tipos ──────────────────────────────────────────────────
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

// ── Dados da última rodada (auto-fetch) ────────────────────
interface UltimaRodada {
  capitao:      { nome: string; pts: number } | null;
  heroi:        { nome: string; pts: number } | null;
  maisEscalado: { nome: string; pct: number } | null;
  ranking:      RankUser[];
  participantes: number;
}

async function fetchUltimaRodada(): Promise<UltimaRodada> {
  // Último jogo finalizado
  const { data: jogos } = await supabase
    .from('jogos')
    .select('id')
    .eq('finalizado', true)
    .order('data_hora', { ascending: false })
    .limit(1);

  const jogoId = jogos?.[0]?.id;

  if (!jogoId) return { capitao: null, heroi: null, maisEscalado: null, ranking: [], participantes: 0 };

  // Scouts da última rodada
  const { data: scouts } = await supabase
    .from('scouts_reais')
    .select('jogador_id, gols, assistencias, sg, potm, nota_sofascore')
    .eq('jogo_id', jogoId);

  // Pontuações por atleta
  const { data: pontuacoes } = await supabase
    .from('pontuacoes_atletas')
    .select('atleta_id, pontos_ganhos')
    .eq('jogo_id', jogoId)
    .order('pontos_ganhos', { ascending: false });

  // Atletas para resolver nomes
  const atletaIds = pontuacoes?.map(p => p.atleta_id) ?? [];
  const { data: atletas } = atletaIds.length > 0
    ? await supabase.from('tigre_fc_atletas').select('id, nome').in('id', atletaIds)
    : { data: [] };

  const nomeById: Record<number, string> = {};
  (atletas ?? []).forEach(a => { nomeById[a.id] = a.nome; });

  // Capitão = mais pontos
  const topPontuacao = pontuacoes?.[0];
  const capitao = topPontuacao
    ? { nome: nomeById[topPontuacao.atleta_id] ?? 'Desconhecido', pts: Number(topPontuacao.pontos_ganhos) }
    : null;

  // Herói = POTM ou maior nota Sofascore
  const potm = scouts?.find(s => s.potm);
  const heroiScout = potm ?? scouts?.sort((a, b) => (b.nota_sofascore ?? 0) - (a.nota_sofascore ?? 0))[0];
  const heroi = heroiScout
    ? { nome: nomeById[heroiScout.jogador_id] ?? 'Desconhecido', pts: heroiScout.nota_sofascore ?? 0 }
    : null;

  // Ranking geral
  const { data: rankData } = await supabase
    .from('view_ranking_geral')
    .select('apelido, pontos_total')
    .limit(5);

  const ranking: RankUser[] = (rankData ?? []).map(r => ({ apelido: r.apelido, pontos: r.pontos_total }));

  // Participantes = total de escalações para o próximo jogo
  const { count } = await supabase
    .from('tigre_fc_escalacoes')
    .select('*', { count: 'exact', head: true });

  // Mais escalado = jogador que aparece em mais escalações (simplificado)
  const maisEscalado = null; // alimentar via props quando disponível

  return { capitao, heroi, maisEscalado, ranking, participantes: count ?? 0 };
}

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ── Countdown ──────────────────────────────────────────────
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
    <div style={{ background:'#0a0a0a', border:`1px solid ${red ? 'rgba(255,45,85,0.4)' : 'rgba(245,196,0,0.22)'}`, borderRadius:10, padding:'8px 10px', textAlign:'center', minWidth:58, boxShadow: red ? '0 0 12px rgba(255,45,85,0.2)' : 'inset 0 1px 0 rgba(245,196,0,0.08)' }}>
      <span style={{ fontFamily:"'Barlow Condensed',monospace", fontSize:46, fontWeight:900, lineHeight:1, display:'block',
        color: red ? C.red : '#fff',
        textShadow: red ? C.gRed : '0 0 20px rgba(255,255,255,0.2)',
        animation: red ? 'red-pulse 1s ease-in-out infinite' : 'none' }}>
        {val}
      </span>
      <span style={{ fontSize:7, fontWeight:900, letterSpacing:'0.3em', color: red ? 'rgba(255,45,85,0.7)' : 'rgba(255,255,255,0.35)', marginTop:3, display:'block' }}>{lbl}</span>
    </div>
  );

  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'center', gap:4, marginBottom:20 }}>
      {block(t.h,'HORAS')}
      <span style={{ fontSize:32, fontWeight:900, color:'rgba(245,196,0,0.4)', paddingBottom:16 }}>:</span>
      {block(t.m,'MIN')}
      <span style={{ fontSize:32, fontWeight:900, color:'rgba(245,196,0,0.4)', paddingBottom:16 }}>:</span>
      {block(t.s,'SEG', t.crit)}
    </div>
  );
}

// ── Escudo ──────────────────────────────────────────────────
function Escudo({ src, alt, novo }: { src: string | null; alt: string; novo?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);
  useEffect(() => { setImgSrc(src || FALLBACK); }, [src]);
  return (
    <div style={{ width:76, height:76, background:'#0d0d0d', borderRadius:18, flexShrink:0,
      display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
      border: novo ? '2px solid rgba(245,196,0,0.45)' : '1px solid rgba(255,255,255,0.12)',
      boxShadow: novo ? '0 0 24px rgba(245,196,0,0.2),0 0 48px rgba(245,196,0,0.08)' : '0 4px 16px rgba(0,0,0,0.6)',
      animation: novo ? 'shield-glow 2.5s ease-in-out infinite' : 'none' }}>
      <img src={imgSrc} alt={alt} onError={() => setImgSrc(FALLBACK)}
        style={{ width:56, height:56, objectFit:'contain', display:'block',
          filter: novo ? 'drop-shadow(0 0 8px rgba(245,196,0,0.3))' : 'none' }} />
    </div>
  );
}

// ── Stat card ───────────────────────────────────────────────
function StatCard({ lbl, val, sub, color, border, pulse }: {
  lbl: string; val: string; sub?: string; color: string; border: string; pulse?: boolean;
}) {
  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${border}`, borderRadius:10, padding:'10px 10px' }}>
      <div style={{ fontSize:8, fontWeight:900, letterSpacing:'0.15em', color, marginBottom:4,
        animation: pulse ? 'lbl-pulse 1.8s ease-in-out infinite' : 'none' }}>{lbl}</div>
      <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, fontStyle:'italic', lineHeight:1, color, textShadow:`0 0 10px ${color}99` }}>{val}</div>
      {sub && <div style={{ fontSize:9, marginTop:3, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>{sub}</div>}
    </div>
  );
}

// ── Componente principal ────────────────────────────────────
export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const [ultima, setUltima] = useState<UltimaRodada>({
    capitao: null, heroi: null, maisEscalado: null, ranking: [], participantes: 0,
  });
  const [loadingUltima, setLoadingUltima] = useState(true);

  // Auto-fetch dados da última rodada
  useEffect(() => {
    fetchUltimaRodada().then(data => {
      setUltima(data);
      setLoadingUltima(false);
    });
  }, []);

  // Props têm prioridade sobre fetch (para override manual)
  const capitao      = stats.capitao      ?? ultima.capitao;
  const heroi        = stats.heroi        ?? ultima.heroi;
  const maisEscalado = stats.maisEscalado ?? ultima.maisEscalado ?? { nome: '—', pct: 0 };
  const ranking      = (stats.ranking?.length ?? 0) > 0 ? stats.ranking! : ultima.ranking;
  const participantes = stats.participantes ?? ultima.participantes;
  const { posicao, golsSofridos, mvp, meusPontos } = stats;
  const mediaTime = stats.mediaSofaTime ?? stats.mediaSofa;

  return (
    <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", background:'#000',
      borderRadius:20, overflow:'hidden', position:'relative',
      border:'1px solid rgba(245,196,0,0.25)', maxWidth:420, width:'100%', margin:'0 auto',
      boxShadow:'0 0 60px rgba(0,0,0,0.8)' }}>

      <style>{`
        @keyframes scan      { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.15} }
        @keyframes pulse-gold{ 0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.45),0 0 40px rgba(245,196,0,0.2)} 50%{box-shadow:0 0 36px rgba(245,196,0,0.85),0 0 70px rgba(245,196,0,0.45)} }
        @keyframes red-pulse { 0%,100%{text-shadow:0 0 8px #FF2D55} 50%{text-shadow:0 0 22px #FF2D55,0 0 44px rgba(255,45,85,0.5)} }
        @keyframes lbl-pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }
        @keyframes shield-glow{ 0%,100%{box-shadow:0 0 24px rgba(245,196,0,0.2),0 0 48px rgba(245,196,0,0.08)} 50%{box-shadow:0 0 40px rgba(245,196,0,0.4),0 0 80px rgba(245,196,0,0.15)} }
        @keyframes shimmer   { 0%{transform:translateX(-100%) skewX(-12deg)} 100%{transform:translateX(220%) skewX(-12deg)} }
        @keyframes rank-in   { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
      `}</style>

      {/* LED textures */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:'radial-gradient(circle,rgba(245,196,0,0.045) 1px,transparent 1px)',
        backgroundSize:'4px 4px' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none',
        backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(245,196,0,0.018) 12px,rgba(245,196,0,0.018) 14px),repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,196,0,0.013) 18px,rgba(245,196,0,0.013) 20px)` }} />

      {/* Scan bar */}
      <div style={{ height:2, background:`linear-gradient(90deg,transparent,${C.gold},#fff,${C.cyan},transparent)`,
        backgroundSize:'200%', animation:'scan 2.5s linear infinite' }} />

      <div style={{ position:'relative', zIndex:1, padding:'16px 14px 20px' }}>

        {/* TOP BAR */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          marginBottom:14, paddingBottom:10, borderBottom:'1px solid rgba(245,196,0,0.12)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.cyan,
              boxShadow:`0 0 6px ${C.cyan},0 0 16px ${C.cyan}`,
              display:'inline-block', animation:'blink 1s ease-in-out infinite' }} />
            <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.3em', color:C.cyan, textShadow:C.gCyan }}>
              {mercadoFechado ? 'MERCADO FECHADO' : 'MERCADO ABERTO'}
            </span>
          </div>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.25em', color:C.gold, textShadow:C.gGold }}>
            {jogo.competicao.toUpperCase()}
          </span>
          <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.15em', color:'rgba(255,255,255,0.5)' }}>
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
              color:'rgba(255,255,255,0.55)', textAlign:'center', lineHeight:1.2 }}>
              {jogo.mandante.nome.toUpperCase()}
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, flexShrink:0, padding:'0 4px' }}>
            <span style={{ fontSize:20, fontWeight:900, fontStyle:'italic', color:'rgba(245,196,0,0.25)' }}>VS</span>
            <div style={{ width:1, height:28, background:`linear-gradient(180deg,transparent,rgba(245,196,0,0.5),transparent)` }} />
            <span style={{ fontSize:11, fontWeight:900, color:C.gold, textShadow:C.gGold, whiteSpace:'nowrap', textAlign:'center' }}>
              {new Date(jogo.data_hora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'America/Sao_Paulo'})}
              <br/>
              {new Date(jogo.data_hora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'})}
            </span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, flex:1 }}>
            <Escudo src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} novo />
            <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.1em',
              color:C.gold, textShadow:C.gGold, textAlign:'center', lineHeight:1.2 }}>
              {jogo.visitante.nome.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ESTÁDIO + TV */}
        {(jogo.local || jogo.transmissao) && (
          <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
            borderRadius:10, padding:'9px 12px', marginBottom:10 }}>
            {jogo.local && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginBottom: jogo.transmissao ? 5 : 0 }}>
                <span style={{ fontSize:11 }}>📍</span>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.6)', letterSpacing:'0.06em', fontWeight:700 }}>{jogo.local}</span>
              </div>
            )}
            {jogo.transmissao && (
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <span style={{ fontSize:11 }}>📺</span>
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.6)', letterSpacing:'0.06em', fontWeight:700 }}>{jogo.transmissao}</span>
              </div>
            )}
          </div>
        )}

        {/* XP BADGE */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6,
          background:`rgba(191,95,255,0.12)`, border:`1px solid rgba(191,95,255,0.3)`,
          borderRadius:8, padding:'8px 12px', marginBottom:12 }}>
          <span style={{ fontSize:14 }}>🎯</span>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.1em', color:'#D4AAFF', textShadow:C.gPurple }}>
            PLACAR EXATO = +15 XP
          </span>
        </div>

        {/* CTA */}
        {mercadoFechado ? (
          <div style={{ width:'100%', background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)', borderRadius:12,
            color:'rgba(255,255,255,0.4)', fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:12, fontWeight:900, letterSpacing:'0.22em', padding:16, textAlign:'center' }}>
            🔒 MERCADO FECHADO
          </div>
        ) : (
          <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
            display:'flex', alignItems:'center', justifyContent:'center', width:'100%',
            background:`linear-gradient(135deg,${C.gold},#E6B800)`, borderRadius:12,
            color:'#000', fontFamily:"'Barlow Condensed',sans-serif",
            fontSize:14, fontWeight:900, letterSpacing:'0.2em', padding:16,
            textDecoration:'none', textAlign:'center',
            animation:'pulse-gold 2s ease-in-out infinite',
            position:'relative', overflow:'hidden' }}>
            CONVOCAR TITULARES →
            <div style={{ position:'absolute', top:0, bottom:0, width:'40%',
              background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)',
              transform:'translateX(-100%) skewX(-12deg)', animation:'shimmer 2.5s ease-in-out infinite' }} />
          </Link>
        )}

        <div style={{ fontSize:8, fontWeight:700, letterSpacing:'0.15em',
          color:'rgba(255,255,255,0.3)', textAlign:'center', marginTop:8 }}>
          Mercado fecha 90min antes do jogo
        </div>

        {/* STATS 2×2 — dados reais da última rodada */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8,
          marginTop:14, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.07)' }}>

          <StatCard
            lbl="CAPITÃO · ÚLT. RD"
            val={loadingUltima ? '...' : capitao ? capitao.pts.toFixed(1) : '—'}
            sub={capitao ? `${capitao.nome} · 2× pts` : 'Aguardando dados'}
            color={C.gold} border="rgba(245,196,0,0.15)"
          />
          <StatCard
            lbl="HERÓI · ÚLT. RD"
            val={loadingUltima ? '...' : heroi ? heroi.pts.toFixed(1) : '—'}
            sub={heroi ? `${heroi.nome} · POTM` : 'Aguardando dados'}
            color={C.red} border="rgba(255,45,85,0.2)" pulse
          />
          <StatCard
            lbl="+ ESCALADO"
            val={maisEscalado.nome}
            sub={maisEscalado.pct ? `${maisEscalado.pct}% dos times` : undefined}
            color={C.cyan} border="rgba(0,243,255,0.15)"
          />
          <StatCard
            lbl="POSIÇÃO SÉRIE B"
            val={posicao ? `${posicao}°` : '—'}
            color={C.gold} border="rgba(245,196,0,0.1)"
          />
        </div>

        {/* RANKING — contraste elevado */}
        <div style={{ marginTop:10,
          background:`linear-gradient(160deg,rgba(191,95,255,0.1),rgba(191,95,255,0.03) 70%)`,
          border:`1px solid rgba(191,95,255,0.25)`, borderRadius:12, padding:'12px 14px' }}>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, paddingBottom:8, borderBottom:'1px solid rgba(191,95,255,0.15)' }}>
            <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.35em', color:'#C884FF' }}>
              RANKING · TOP 5
            </span>
            {participantes > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:8, color:'rgba(0,243,255,0.7)', letterSpacing:'0.1em', fontWeight:700 }}>
                  {participantes} escalando
                </span>
                <span style={{ width:5, height:5, borderRadius:'50%', background:C.cyan,
                  boxShadow:`0 0 6px ${C.cyan}`, display:'inline-block', animation:'blink 1s ease-in-out infinite' }} />
              </div>
            )}
          </div>

          {loadingUltima ? (
            <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:11, padding:'8px 0' }}>
              Carregando ranking...
            </div>
          ) : ranking.length === 0 ? (
            <div style={{ textAlign:'center', color:'rgba(255,255,255,0.3)', fontSize:11, padding:'8px 0' }}>
              Seja o primeiro a escalar!
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {ranking.slice(0,5).map((r, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8,
                  padding:'6px 8px', borderRadius:8,
                  background: i === 0 ? 'rgba(191,95,255,0.12)' : 'rgba(255,255,255,0.03)',
                  border: i === 0 ? '1px solid rgba(191,95,255,0.25)' : '1px solid transparent',
                  animation:`rank-in 0.3s ease ${i * 0.05}s both` }}>
                  <span style={{ fontSize:11, fontWeight:900, minWidth:20, textAlign:'center',
                    color: i === 0 ? '#D4AAFF' : 'rgba(191,95,255,0.7)',
                    textShadow: i === 0 ? C.gPurple : 'none' }}>
                    {String(i+1).padStart(2,'0')}
                  </span>
                  {i === 0 && <span style={{ fontSize:12 }}>👑</span>}
                  <span style={{ fontSize:11, fontWeight:700,
                    color: i === 0 ? '#fff' : 'rgba(255,255,255,0.8)',
                    flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {r.apelido || r.nome || 'Torcedor'}
                  </span>
                  <span style={{ fontSize:12, fontWeight:900,
                    color: i === 0 ? '#D4AAFF' : 'rgba(191,95,255,0.85)',
                    textShadow: i === 0 ? C.gPurple : 'none',
                    background: i === 0 ? 'rgba(191,95,255,0.15)' : 'transparent',
                    padding: i === 0 ? '2px 8px' : '0',
                    borderRadius:4 }}>
                    {r.pontos}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM BAR */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:5, marginTop:10 }}>
          {[
            { val: golsSofridos != null ? String(golsSofridos) : '—', lbl:'GOLS SOF',  color:C.red,    bg:'rgba(255,45,85,0.06)',   border:'rgba(255,45,85,0.2)' },
            { val: mediaTime    != null ? mediaTime.toFixed(2)   : '—', lbl:'MÉD SOFA', color:C.gold,   bg:'rgba(245,196,0,0.04)',   border:'rgba(245,196,0,0.12)' },
            { val: mvp          ? mvp.media.toFixed(2)           : '—', lbl:'MVP',       color:C.cyan,   bg:'rgba(0,243,255,0.04)',   border:'rgba(0,243,255,0.15)' },
            { val: meusPontos   != null ? String(meusPontos)     : '—', lbl:'MEUS PTS', color:'#D4AAFF', bg:'rgba(191,95,255,0.05)', border:'rgba(191,95,255,0.15)' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign:'center', background:s.bg,
              border:`1px solid ${s.border}`, borderRadius:8, padding:'8px 3px' }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:17,
                fontWeight:900, fontStyle:'italic', lineHeight:1,
                color:s.color, textShadow:`0 0 10px ${s.color}99` }}>{s.val}</div>
              <div style={{ fontSize:6, fontWeight:800, letterSpacing:'0.12em',
                color:'rgba(255,255,255,0.45)', marginTop:4 }}>{s.lbl}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
