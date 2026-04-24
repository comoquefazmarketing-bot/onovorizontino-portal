'use client';
/**
 * JumbotronJogoReativo.tsx
 * Ajustado para Mobile-First e corrigido erros de importação duplicada.
 */
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link'; // Importado apenas uma vez agora
import { useRealtimeScout, ScoutEvent } from '@/hooks/useRealtimeScout';

// Variáveis de Estilo (Mantendo o padrão Visual)
const C = {
  gold:'#F5C400', cyan:'#00F3FF', red:'#FF2D55', green:'#22C55E',
  glowGold:'0 0 8px rgba(245,196,0,0.6),0 0 20px rgba(245,196,0,0.3)',
  glowCyan:'0 0 8px rgba(0,243,255,0.7),0 0 20px rgba(0,243,255,0.35)',
  glowRed:'0 0 8px rgba(255,45,85,0.7),0 0 20px rgba(255,45,85,0.35)',
};

interface Time   { nome: string; escudo_url: string | null; sigla?: string | null }
interface Jogo   { id: number; competicao: string; rodada: string; data_hora: string; local: string | null; transmissao: string | null; mandante: Time; visitante: Time }
interface Props  { jogo: Jogo; mercadoFechado?: boolean }

// ── Overlay de evento (Gol/VAR) ─────────────────────────────
function EventoOverlay({ evento }: { evento: ScoutEvent | null }) {
  const [visible, setVisible] = useState(false);
  const [evt, setEvt] = useState<ScoutEvent | null>(null);

  useEffect(() => {
    if (!evento) return;
    setEvt(evento);
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(t);
  }, [evento]);

  if (!visible || !evt) return null;

  const configs: any = {
    gol:             { text: 'GOOOOOL!',           bg: 'rgba(245,196,0,0.2)', color: C.gold,  glow: C.glowGold },
    cartao_amarelo:  { text: 'CARTÃO AMARELO',     bg: 'rgba(245,196,0,0.1)', color: '#fff',  glow: 'none' },
    cartao_vermelho: { text: 'CARTÃO VERMELHO',    bg: 'rgba(255,45,85,0.25)', color: '#fff', glow: C.glowRed },
    var_inicio:      { text: 'ANÁLISE VAR...',     bg: 'rgba(0,243,255,0.1)', color: C.cyan,  glow: C.glowCyan },
    var_confirmado:  { text: 'VAR: CONFIRMADO!',   bg: 'rgba(34,197,94,0.15)', color:'#22C55E',glow:'none' },
    var_cancelado:   { text: 'VAR: CANCELADO',     bg: 'rgba(255,45,85,0.15)', color: C.red,  glow: C.glowRed },
  };

  const config = configs[evt.tipo] || { text: '', bg: 'transparent', color:'#fff', glow:'none' };

  return (
    <div style={{
      position:'absolute', inset:0, zIndex:20,
      display:'flex', alignItems:'center', justifyContent:'center',
      background:config.bg, borderRadius:16,
      animation:'ov-fade 0.2s ease',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize: 'clamp(24px, 6vw, 32px)', fontWeight:900, fontStyle:'italic',
        color:config.color, textShadow:config.glow,
        textAlign:'center', padding:'0 20px',
      }}>
        {config.text}
      </div>
    </div>
  );
}

// ── Countdown Adaptativo ───────────────────────────────────
function Countdown({ dataHora, paused }: { dataHora: string; paused: boolean }) {
  const [t, setT] = useState({ h:'00', m:'00', s:'00', crit:false });

  useEffect(() => {
    const calc = () => {
      if (paused) return;
      const diff = new Date(dataHora).getTime() - 90*60_000 - Date.now();
      if (diff <= 0) { setT({ h:'00',m:'00',s:'00',crit:true }); return; }
      const h=Math.floor(diff/3_600_000);
      const m=Math.floor((diff%3_600_000)/60_000);
      const s=Math.floor((diff%60_000)/1_000);
      setT({ h:String(h).padStart(2,'0'), m:String(m).padStart(2,'0'), s:String(s).padStart(2,'0'), crit:h===0&&m<5 });
    };
    calc();
    const id=setInterval(calc,1000);
    return ()=>clearInterval(id);
  },[dataHora,paused]);

  const block=(val:string,lbl:string,red=false)=>(
    <div style={{background:'#080808', border:'1px solid rgba(245,196,0,0.18)', borderRadius:6, padding:'4px 6px', textAlign:'center', flex:1, maxWidth: '60px'}}>
      <span style={{
        fontFamily:"'Barlow Condensed',monospace", fontSize:'min(22px, 5vw)', fontWeight:900, lineHeight:1, display:'block',
        color:red?C.red:'#fff', textShadow:red?C.glowRed:'0 0 14px rgba(255,255,255,0.2)',
        animation:red?'red-pulse 1s ease-in-out infinite':'none'
      }}>{val}</span>
      <span style={{fontSize:6, fontWeight:900, letterSpacing:'0.2em', color:'rgba(255,255,255,0.18)'}}>{lbl}</span>
    </div>
  );

  return(
    <div style={{display:'flex', alignItems:'center', gap:4, justifyContent:'center', marginBottom:16}}>
      {block(t.h,'HORAS')}
      <span style={{color:paused?C.cyan:C.gold, fontWeight:900, animation: paused ? 'var-blink 0.5s infinite' : 'none'}}>:</span>
      {block(t.m,'MIN')}
      <span style={{color:paused?C.cyan:C.gold, fontWeight:900, animation: paused ? 'var-blink 0.5s infinite' : 'none'}}>:</span>
      {block(t.s,'SEG',t.crit)}
    </div>
  );
}

// ── Principal ─────────────────────────────────────────────
export default function JumbotronJogoReativo({ jogo, mercadoFechado=false }: Props) {
  const scout = useRealtimeScout(jogo.id);

  const statusLabel = scout.varAndamento ? 'VAR' : scout.evento?.tipo === 'gol' ? 'GOOOOL!' : 'MERCADO ABERTO';
  const statusColor = scout.varAndamento ? C.cyan : scout.evento?.tipo === 'gol' ? C.gold : C.cyan;

  const dataFmt = new Date(jogo.data_hora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'America/Sao_Paulo'});
  const horaFmt = new Date(jogo.data_hora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'});

  return(
    <div style={{
      fontFamily:"'Barlow Condensed', sans-serif",
      background:'#000', borderRadius:16, position:'relative', padding:'1px',
      border: `1px solid ${scout.varAndamento ? C.cyan : 'rgba(245,196,0,0.22)'}`,
      boxShadow: scout.varAndamento ? `0 0 30px ${C.cyan}33` : 'none',
      width: '100%', maxWidth: '500px', margin: '0 auto' // Centraliza e limita largura no desktop
    }}>
      <style>{`
        @keyframes red-pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes var-blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes ov-fade{from{opacity:0}to{opacity:1}}
        @keyframes blink-dot{0%,100%{opacity:1}50%{opacity:0.4}}
      `}</style>

      {/* Overlay de evento */}
      <EventoOverlay evento={scout.evento}/>

      <div style={{position:'relative', zIndex:1, padding: '16px 12px'}}>

        {/* HEADER */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, paddingBottom:8, borderBottom:'1px solid rgba(255,255,255,0.05)'}}>
          <div style={{display:'flex', alignItems:'center', gap:5}}>
            <span style={{width:6, height:6, borderRadius:'50%', background:statusColor, animation:'blink-dot 1s infinite'}}/>
            <span style={{fontSize:10, fontWeight:900, letterSpacing:'0.2em', color:statusColor}}>{statusLabel}</span>
          </div>
          <span style={{fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.4)'}}>{jogo.rodada}ª RODADA</span>
        </div>

        {/* PLACAR MOBILE-FRIENDLY */}
        <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:20, margin: '20px 0'}}>
            {/* Mandante */}
            <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
                <div style={{width:50, height:50, background:'#111', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <img src={jogo.mandante.escudo_url || ''} style={{width:'70%', height:'70%', objectFit:'contain'}} alt="mandante" />
                </div>
                <span style={{fontSize:10, fontWeight:900, marginTop:6, color:'rgba(255,255,255,0.5)'}}>{jogo.mandante.nome.toUpperCase()}</span>
            </div>

            <div style={{textAlign:'center'}}>
                <div style={{fontSize:38, fontWeight:900, fontStyle:'italic', color:C.gold, lineHeight:1}}>
                    {scout.golsNovo} <span style={{fontSize:20, opacity:0.2, verticalAlign:'middle'}}>X</span> 0
                </div>
                <div style={{fontSize:10, color:C.gold, opacity:0.6, fontWeight:900, marginTop:4}}>{horaFmt}</div>
            </div>

            {/* Visitante (Tigre) */}
            <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center'}}>
                <div style={{width:50, height:50, background:'#111', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', border: `1px solid ${C.gold}44`, boxShadow: `0 0 15px ${C.gold}22`}}>
                    <img src={jogo.visitante.escudo_url || ''} style={{width:'70%', height:'70%', objectFit:'contain'}} alt="visitante" />
                </div>
                <span style={{fontSize:10, fontWeight:900, marginTop:6, color:C.gold}}>{jogo.visitante.nome.toUpperCase()}</span>
            </div>
        </div>

        {/* COUNTDOWN */}
        <Countdown dataHora={jogo.data_hora} paused={scout.varAndamento}/>

        {/* CTA ACTION */}
        {mercadoFechado ? (
          <div style={{width:'100%', background:'rgba(255,255,255,0.05)', borderRadius:8, color:'rgba(255,255,255,0.3)', fontSize:11, fontWeight:900, padding:'14px', textAlign:'center'}}>MERCADO FECHADO</div>
        ) : (
          <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
            display:'block', width:'100%', background:`linear-gradient(135deg,${C.gold},#D4A200)`, borderRadius:8, 
            color:'#000', fontSize:13, fontWeight:900, padding:'14px', textDecoration:'none', textAlign:'center',
            boxShadow: `0 8px 20px ${C.gold}44`
          }}>
            MONTAR MINHA ESCALAÇÃO →
          </Link>
        )}

        <div style={{fontSize:8, color:'rgba(255,255,255,0.2)', textAlign:'center', marginTop:12, letterSpacing:'0.1em'}}>
            📍 {jogo.local?.toUpperCase()} | 📺 {jogo.transmissao}
        </div>

      </div>
    </div>
  );
}
