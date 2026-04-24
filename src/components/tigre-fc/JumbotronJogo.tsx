'use client';
// src/components/tigre-fc/JumbotronJogoReativo.tsx
// Versão integral com Realtime internalizado e correções para Build (Tipagem de Stats)

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ── Design tokens ──────────────────────────────────────────
const C = {
  gold:      '#F5C400', cyan:   '#00F3FF',
  red:       '#FF2D55', green:  '#22C55E',
  glowGold:  '0 0 8px rgba(245,196,0,0.6),0 0 20px rgba(245,196,0,0.3)',
  glowCyan:  '0 0 8px rgba(0,243,255,0.7),0 0 20px rgba(0,243,255,0.35)',
  glowRed:   '0 0 8px rgba(255,45,85,0.7),0 0 20px rgba(255,45,85,0.35)',
};

// ── Tipos ──────────────────────────────────────────────────
type EventoTipo =
  | 'gol' | 'cartao_amarelo' | 'cartao_vermelho'
  | 'var_inicio' | 'var_confirmado' | 'var_cancelado' | 'idle';

interface ScoutEvento {
  tipo:        EventoTipo;
  jogador_id?: number;
  ts:          number;
}

interface ScoutState {
  evento:       ScoutEvento | null;
  varAndamento: boolean;
  golsNovo:      number;
  cartoes:      Array<{ tipo: 'amarelo' | 'vermelho' }>;
}

interface Time  { nome: string; escudo_url: string | null; sigla?: string | null }
interface Jogo  {
  id: number; competicao: string; rodada: string;
  data_hora: string; local: string | null; transmissao: string | null;
  mandante: Time; visitante: Time;
}

// Corrigido: Interface Props agora aceita stats enviado pela page.tsx
interface Props { 
  jogo: Jogo; 
  mercadoFechado?: boolean;
  stats?: {
    ranking: { apelido: string; pontos: number; }[];
    participantes: number;
    posicao: number;
    mediaSofa: number;
    golsSofridos: number;
    mvp: { nome: string; media: number; };
  };
}

// ── Confete CSS puro ─────────────────────
function dispararConfete() {
  if (typeof document === 'undefined') return;
  const cores = ['#F5C400', '#fff', '#ffeb85', '#D4A200'];
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const cor = cores[Math.floor(Math.random() * cores.length)];
    const x   = Math.random() * 100;
    const delay = Math.random() * 0.6;
    const dur   = 1.2 + Math.random() * 0.8;
    el.style.cssText = `
      position:fixed;top:-10px;left:${x}%;width:8px;height:8px;
      background:${cor};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      z-index:9999;pointer-events:none;
      animation:confete-fall ${dur}s ease-in ${delay}s forwards;
    `;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), (dur + delay + 0.1) * 1000);
  }
}

// ── Hook Realtime internalizado ────────────────────────────
function useScoutState(jogoId: number) {
  const [state, setState] = useState<ScoutState>({
    evento: null, varAndamento: false, golsNovo: 0, cartoes: [],
  });
  const prevRef = useRef<Record<number, any>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const clearEvento = useCallback((delay = 3500) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(
      () => setState(p => ({ ...p, evento: null })),
      delay
    );
  }, []);

  useEffect(() => {
    // Carrega estado inicial
    supabase
      .from('scouts_reais')
      .select('jogador_id,gols,cartao_amarelo,cartao_vermelho,sg,var_em_andamento')
      .eq('jogo_id', jogoId)
      .then(({ data }) => {
        if (!data) return;
        let gols = 0;
        const cartoes: ScoutState['cartoes'] = [];
        data.forEach(s => {
          prevRef.current[s.jogador_id] = s;
          gols += s.gols ?? 0;
          if (s.cartao_amarelo) cartoes.push({ tipo: 'amarelo' });
          if (s.cartao_vermelho) cartoes.push({ tipo: 'vermelho' });
        });
        setState(p => ({
          ...p, golsNovo: gols, cartoes,
          varAndamento: data.some(s => s.var_em_andamento),
        }));
      });

    // Realtime
    const channel = supabase
      .channel(`scout-jogo-${jogoId}`)
      .on('postgres_changes', {
        event: '*', schema: 'public',
        table: 'scouts_reais',
        filter: `jogo_id=eq.${jogoId}`,
      }, (payload) => {
        const novo = payload.new as any;
        const prev = prevRef.current[novo?.jogador_id] ?? {};
        const ts   = Date.now();

        if (!novo) return;

        // GOL
        if ((novo.gols ?? 0) > (prev.gols ?? 0)) {
          setState(p => ({
            ...p,
            evento:   { tipo: 'gol', jogador_id: novo.jogador_id, ts },
            golsNovo: p.golsNovo + 1,
          }));
          dispararConfete();
          clearEvento(4000);
        }
        // CARTÃO AMARELO
        else if ((novo.cartao_amarelo ?? 0) > (prev.cartao_amarelo ?? 0)) {
          setState(p => ({
            ...p,
            evento:  { tipo: 'cartao_amarelo', jogador_id: novo.jogador_id, ts },
            cartoes: [...p.cartoes, { tipo: 'amarelo' }],
          }));
          clearEvento(3000);
        }
        // CARTÃO VERMELHO
        else if ((novo.cartao_vermelho ?? 0) > (prev.cartao_vermelho ?? 0)) {
          setState(p => ({
            ...p,
            evento:  { tipo: 'cartao_vermelho', jogador_id: novo.jogador_id, ts },
            cartoes: [...p.cartoes, { tipo: 'vermelho' }],
          }));
          clearEvento(4000);
        }
        // VAR INÍCIO
        else if (novo.var_em_andamento === true && !prev.var_em_andamento) {
          setState(p => ({
            ...p,
            evento:       { tipo: 'var_inicio', ts },
            varAndamento: true,
          }));
        }
        // VAR ENCERRADO
        else if (novo.var_em_andamento === false && prev.var_em_andamento === true) {
          const confirmado = (novo.gols ?? 0) > (prev.gols ?? 0);
          setState(p => ({
            ...p,
            evento:       { tipo: confirmado ? 'var_confirmado' : 'var_cancelado', ts },
            varAndamento: false,
            golsNovo:      confirmado ? p.golsNovo + 1 : p.golsNovo,
          }));
          clearEvento(4000);
        }

        prevRef.current[novo.jogador_id] = novo;
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [jogoId, clearEvento]);

  return state;
}

// ── Overlay de evento ──────────────────────────────────────
function EventoOverlay({ evento }: { evento: ScoutEvento | null }) {
  const [visible, setVisible] = useState(false);
  const [cur, setCur] = useState<ScoutEvento | null>(null);

  useEffect(() => {
    if (!evento) return;
    setCur(evento);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [evento]);

  if (!visible || !cur) return null;

  const map: Record<EventoTipo, { text: string; bg: string; color: string; glow: string }> = {
    gol:             { text:'GOOOOOL!',          bg:'rgba(245,196,0,0.2)',  color:C.gold,    glow:C.glowGold },
    cartao_amarelo:  { text:'CARTÃO AMARELO',    bg:'rgba(245,196,0,0.1)',  color:'#fff',    glow:'none' },
    cartao_vermelho: { text:'CARTÃO VERMELHO',   bg:'rgba(255,45,85,0.25)', color:'#fff',    glow:C.glowRed },
    var_inicio:      { text:'ANÁLISE VAR...',    bg:'rgba(0,243,255,0.1)',   color:C.cyan,    glow:C.glowCyan },
    var_confirmado:  { text:'VAR: CONFIRMADO!',  bg:'rgba(34,197,94,0.15)', color:'#22C55E', glow:'none' },
    var_cancelado:   { text:'VAR: CANCELADO',    bg:'rgba(255,45,85,0.15)', color:C.red,      glow:C.glowRed },
    idle:            { text:'',                  bg:'transparent',           color:'#fff',    glow:'none' },
  };

  const cfg = map[cur.tipo];
  return (
    <div style={{
      position:'absolute', inset:0, zIndex:20, borderRadius:16,
      display:'flex', alignItems:'center', justifyContent:'center',
      background:cfg.bg, animation:'ov-fade 0.2s ease',
    }}>
      <span style={{
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize:24, fontWeight:900, fontStyle:'italic',
        color:cfg.color, textShadow:cfg.glow,
        letterSpacing:'0.04em', textAlign:'center', padding:'0 20px',
      }}>
        {cfg.text}
      </span>
    </div>
  );
}

// ── Countdown ──────────────────────────────────────────────
function Countdown({ dataHora, paused }: { dataHora: string; paused: boolean }) {
  const [t, setT] = useState({ h:'00', m:'00', s:'00', crit:false });

  useEffect(() => {
    const calc = () => {
      if (paused) return;
      const diff = new Date(dataHora).getTime() - Date.now();
      if (diff <= 0) { setT({ h:'00', m:'00', s:'00', crit:true }); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setT({ h:String(h).padStart(2,'0'), m:String(m).padStart(2,'0'), s:String(s).padStart(2,'0'), crit:h===0&&m<5 });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dataHora, paused]);

  const sep = (
    <span style={{
      fontSize:20, fontWeight:900, paddingBottom:10,
      color: paused ? C.cyan : 'rgba(245,196,0,0.28)',
      animation: paused ? 'var-blink 0.5s ease-in-out infinite' : 'none',
    }}>:</span>
  );

  const block = (val: string, lbl: string, red = false) => (
    <div style={{ background:'#080808', border:'1px solid rgba(245,196,0,0.18)', borderRadius:6, padding:'5px 8px', textAlign:'center', minWidth:42 }}>
      <span style={{
        fontFamily:"'Barlow Condensed',monospace", fontSize:26, fontWeight:900,
        lineHeight:1, display:'block',
        color: red ? C.red : '#fff',
        textShadow: red ? C.glowRed : '0 0 14px rgba(255,255,255,0.2)',
        animation: red ? 'red-pulse 1s ease-in-out infinite' : 'none',
      }}>{val}</span>
      <span style={{ fontSize:6, fontWeight:900, letterSpacing:'0.28em', color:'rgba(255,255,255,0.18)' }}>{lbl}</span>
    </div>
  );

  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:3, justifyContent:'center', marginBottom:12 }}>
      {block(t.h,'HORAS')}{sep}{block(t.m,'MIN')}{sep}{block(t.s,'SEG',t.crit)}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────
export default function JumbotronJogoReativo({ jogo, mercadoFechado = false, stats }: Props) {
  const scout = useScoutState(jogo.id);

  const borderColor = scout.varAndamento ? C.cyan
    : scout.evento?.tipo === 'gol' ? C.gold
    : scout.evento?.tipo === 'cartao_vermelho' ? C.red
    : 'rgba(245,196,0,0.22)';

  const boxShadow = scout.varAndamento
    ? '0 0 30px rgba(0,243,255,0.2),inset 0 0 20px rgba(0,243,255,0.05)'
    : scout.evento?.tipo === 'gol'
    ? '0 0 40px rgba(245,196,0,0.35),inset 0 0 20px rgba(245,196,0,0.08)'
    : 'none';

  const scanColor = scout.varAndamento
    ? C.cyan
    : scout.evento?.tipo === 'gol'
    ? `${C.gold},#fff,${C.gold}`
    : scout.evento?.tipo?.includes('cartao')
    ? C.red
    : `${C.gold},#fff,${C.cyan}`;

  const scanSpeed = scout.evento?.tipo === 'gol' ? '0.5s'
    : scout.varAndamento ? '4s' : '2.5s';

  const statusLabel = scout.varAndamento ? 'VAR'
    : scout.evento?.tipo === 'gol' ? 'GOOOOL!'
    : 'MERCADO ABERTO';
  const statusColor = scout.varAndamento ? C.cyan
    : scout.evento?.tipo === 'gol' ? C.gold : C.cyan;

  const dataFmt = new Date(jogo.data_hora).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', timeZone:'America/Sao_Paulo' });
  const horaFmt = new Date(jogo.data_hora).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo' });

  return (
    <div style={{
      fontFamily:"'Barlow Condensed',Impact,sans-serif",
      background:'#000', borderRadius:16, overflow:'hidden',
      position:'relative', padding:2,
      border:`1px solid ${borderColor}`,
      boxShadow,
      transition:'border-color 0.4s,box-shadow 0.4s',
    }}>
      <style>{`
        @keyframes confete-fall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}
        @keyframes led-scan{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes red-pulse{0%,100%{text-shadow:0 0 8px #FF2D55}50%{text-shadow:0 0 16px #FF2D55,0 0 28px rgba(255,45,85,0.5)}}
        @keyframes var-blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes ov-fade{from{opacity:0}to{opacity:1}}
        @keyframes pulse-gold-cta{0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.45)}50%{box-shadow:0 0 36px rgba(245,196,0,0.8)}}
        @keyframes blink-dot{0%,100%{opacity:1}50%{opacity:0.2}}
      `}</style>

      {/* LED textures */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, backgroundImage:'radial-gradient(circle,rgba(245,196,0,0.04) 1px,transparent 1px)', backgroundSize:'4px 4px' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0, backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(245,196,0,0.016) 12px,rgba(245,196,0,0.016) 14px),repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,196,0,0.012) 18px,rgba(245,196,0,0.012) 20px)` }} />

      {/* Scan bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, zIndex:11, pointerEvents:'none', background:`linear-gradient(90deg,transparent,${scanColor},transparent)`, backgroundSize:'200%', animation:`led-scan ${scanSpeed} linear infinite`, transition:'background 0.3s' }} />

      {/* Overlay evento */}
      <EventoOverlay evento={scout.evento} />

      <div style={{ position:'relative', zIndex:1, padding:'18px 14px 22px' }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, paddingBottom:10, borderBottom:'1px solid rgba(245,196,0,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background: scout.varAndamento ? C.cyan : C.green, boxShadow: scout.varAndamento ? `0 0 6px ${C.cyan},0 0 14px ${C.cyan}` : `0 0 6px ${C.green}`, display:'inline-block', animation:'blink-dot 1s ease-in-out infinite' }} />
            <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.3em', color:statusColor, transition:'color 0.3s' }}>
              {statusLabel}
            </span>
          </div>
          <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.3em', color:C.gold, textShadow:C.glowGold }}>
            {jogo.competicao.toUpperCase()}
          </span>
          <span style={{ fontSize:9, fontWeight:700, letterSpacing:'0.2em', color:'rgba(255,255,255,0.3)' }}>
            RODADA {jogo.rodada}
          </span>
        </div>

        {/* Placar ao vivo */}
        <div style={{ textAlign:'center', marginBottom:12 }}>
          <div style={{
            fontFamily:"'Barlow Condensed',sans-serif", fontSize:36, fontWeight:900, fontStyle:'italic',
            color: scout.golsNovo > 0 ? C.gold : 'rgba(255,255,255,0.4)',
            textShadow: scout.golsNovo > 0 ? C.glowGold : 'none',
            letterSpacing:'-0.02em', lineHeight:1, transition:'color 0.5s',
          }}>
            {scout.golsNovo > 0 ? `${scout.golsNovo} — 0` : '— — —'}
          </div>
          {scout.cartoes.length > 0 && (
            <div style={{ display:'flex', justifyContent:'center', gap:4, marginTop:6 }}>
              {scout.cartoes.slice(-4).map((c, i) => (
                <div key={i} style={{ width:8, height:12, background:c.tipo==='amarelo'?C.gold:C.red, borderRadius:1, opacity:0.8, transform:'rotate(-8deg)' }} />
              ))}
            </div>
          )}
        </div>

        {/* Countdown */}
        <Countdown dataHora={jogo.data_hora} paused={scout.varAndamento} />

        {/* Escudos */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', marginBottom:10 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
            <div style={{ width:42, height:42, background:'#0d0d0d', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
              {jogo.mandante.escudo_url
                ? <img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} style={{ width:30, height:30, objectFit:'contain' }} />
                : <span style={{ fontSize:18 }}>⚽</span>}
            </div>
            <span style={{ fontSize:7, fontWeight:900, letterSpacing:'0.1em', color:'rgba(255,255,255,0.35)', textAlign:'center' }}>
              {(jogo.mandante.sigla || jogo.mandante.nome).toUpperCase()}
            </span>
          </div>

          <div style={{ textAlign:'center', padding:'0 4px' }}>
            <div style={{ fontSize:12, fontWeight:900, fontStyle:'italic', color:'rgba(245,196,0,0.18)' }}>VS</div>
            <div style={{ fontSize:9, fontWeight:900, color:C.gold, marginTop:2, textShadow:C.glowGold }}>{dataFmt} · {horaFmt}</div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
            <div style={{
              width:42, height:42, background:'#0d0d0d',
              border:`1px solid ${scout.golsNovo > 0 ? 'rgba(245,196,0,0.5)' : 'rgba(245,196,0,0.28)'}`,
              borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
              boxShadow: scout.golsNovo > 0 ? '0 0 20px rgba(245,196,0,0.3)' : '0 0 18px rgba(245,196,0,0.14)',
              transition:'border-color 0.4s,box-shadow 0.4s',
            }}>
              {jogo.visitante.escudo_url
                ? <img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} style={{ width:30, height:30, objectFit:'contain' }} />
                : <span style={{ fontSize:18 }}>🐯</span>}
            </div>
            <span style={{ fontSize:7, fontWeight:900, letterSpacing:'0.1em', color:C.gold, textAlign:'center', textShadow:'0 0 6px rgba(245,196,0,0.4)' }}>
              {(jogo.visitante.sigla || jogo.visitante.nome).toUpperCase()}
            </span>
          </div>
        </div>

        {/* CTA */}
        {mercadoFechado ? (
          <div style={{ width:'100%', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:8, color:'rgba(255,255,255,0.25)', fontSize:10, fontWeight:900, letterSpacing:'0.22em', padding:'12px', textAlign:'center' }}>
            MERCADO FECHADO
          </div>
        ) : (
          <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
            display:'flex', alignItems:'center', justifyContent:'center',
            width:'100%', background:`linear-gradient(135deg,${C.gold},#D4A200)`,
            borderRadius:8, color:'#000', fontSize:11, fontWeight:900,
            letterSpacing:'0.22em', padding:'12px', textDecoration:'none',
            textAlign:'center', animation:'pulse-gold-cta 2s ease-in-out infinite',
            position:'relative', overflow:'hidden',
          }}>
            CONVOCAR TITULARES →
          </Link>
        )}

        {(jogo.local || jogo.transmissao) && (
          <div style={{ fontSize:7, fontWeight:700, letterSpacing:'0.18em', color:'rgba(255,255,255,0.18)', textAlign:'center', marginTop:10 }}>
            {jogo.local && `📍 ${jogo.local.toUpperCase()}`} {jogo.transmissao && ` | 📺 ${jogo.transmissao}`}
          </div>
        )}
      </div>
    </div>
  );
}
