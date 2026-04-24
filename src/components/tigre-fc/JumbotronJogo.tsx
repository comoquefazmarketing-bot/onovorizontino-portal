'use client';
// src/components/tigre-fc/JumbotronJogoReativo.tsx
// JumbotronJogo com useRealtimeScout integrado
// Reage a gol, cartão e VAR com animações LED

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRealtimeScout, ScoutEvent } from '@/hooks/useRealtimeScout';
import Link from 'next/link';

const C = {
  gold:'#F5C400', cyan:'#00F3FF', red:'#FF2D55', green:'#22C55E',
  glowGold:'0 0 8px rgba(245,196,0,0.6),0 0 20px rgba(245,196,0,0.3)',
  glowCyan:'0 0 8px rgba(0,243,255,0.7),0 0 20px rgba(0,243,255,0.35)',
  glowRed:'0 0 8px rgba(255,45,85,0.7),0 0 20px rgba(255,45,85,0.35)',
};

interface Time   { nome: string; escudo_url: string | null; sigla?: string | null }
interface Jogo   { id: number; competicao: string; rodada: string; data_hora: string; local: string | null; transmissao: string | null; mandante: Time; visitante: Time }
interface Props  { jogo: Jogo; mercadoFechado?: boolean }

// ── Overlay de evento ──────────────────────────────────────
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

  const config = {
    gol:             { text: 'GOOOOOL!',          bg: 'rgba(245,196,0,0.2)', color: C.gold,  glow: C.glowGold },
    cartao_amarelo:  { text: 'CARTÃO AMARELO',     bg: 'rgba(245,196,0,0.1)', color: '#fff',  glow: 'none' },
    cartao_vermelho: { text: 'CARTÃO VERMELHO',    bg: 'rgba(255,45,85,0.25)', color: '#fff', glow: C.glowRed },
    var_inicio:      { text: 'ANÁLISE VAR...',     bg: 'rgba(0,243,255,0.1)', color: C.cyan,  glow: C.glowCyan },
    var_confirmado:  { text: 'VAR: CONFIRMADO!',   bg: 'rgba(34,197,94,0.15)', color:'#22C55E',glow:'none' },
    var_cancelado:   { text: 'VAR: CANCELADO',     bg: 'rgba(255,45,85,0.15)', color: C.red,  glow: C.glowRed },
    idle:            { text: '',                   bg: 'transparent',          color:'#fff',   glow:'none' },
  }[evt.tipo];

  return (
    <div style={{
      position:'absolute',inset:0,zIndex:20,
      display:'flex',alignItems:'center',justifyContent:'center',
      background:config.bg,borderRadius:16,
      animation:'ov-fade 0.2s ease',
    }}>
      <div style={{
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize:24,fontWeight:900,fontStyle:'italic',
        color:config.color,textShadow:config.glow,
        letterSpacing:'0.04em',textAlign:'center',padding:'0 20px',
      }}>
        {config.text}
      </div>
    </div>
  );
}

// ── Countdown ──────────────────────────────────────────────
function Countdown({ dataHora, paused }: { dataHora: string; paused: boolean }) {
  const [t, setT] = useState({ h:'00', m:'00', s:'00', crit:false });
  const savedRef = useRef<number>(0);

  useEffect(() => {
    const calc = () => {
      if (paused) return; // VAR pausa o countdown
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
    <div style={{background:'#080808',border:'1px solid rgba(245,196,0,0.18)',borderRadius:6,padding:'5px 8px',textAlign:'center',minWidth:42}}>
      <span style={{fontFamily:"'Barlow Condensed',monospace",fontSize:26,fontWeight:900,lineHeight:1,display:'block',
        color:red?C.red:'#fff',textShadow:red?C.glowRed:'0 0 14px rgba(255,255,255,0.2)',
        animation:red?'red-pulse 1s ease-in-out infinite':'none'}}>{val}</span>
      <span style={{fontSize:6,fontWeight:900,letterSpacing:'0.28em',color:'rgba(255,255,255,0.18)'}}>{lbl}</span>
    </div>
  );
  const sep=<span style={{fontSize:20,fontWeight:900,color:paused?C.cyan:'rgba(245,196,0,0.28)',paddingBottom:10,
    animation:paused?'var-blink 0.5s ease-in-out infinite':'none'}}>:</span>;

  return(
    <div style={{display:'flex',alignItems:'flex-end',gap:3,justifyContent:'center',marginBottom:12}}>
      {block(t.h,'HORAS')}{sep}{block(t.m,'MIN')}{sep}{block(t.s,'SEG',t.crit)}
    </div>
  );
}

// ── Scan bar reativa ───────────────────────────────────────
function ScanBar({ evento, varMode }: { evento: ScoutEvent | null; varMode: boolean }) {
  const color = varMode ? C.cyan
    : evento?.tipo === 'gol'             ? `${C.gold},#fff,${C.gold}`
    : evento?.tipo?.includes('cartao')   ? C.red
    : `${C.gold},#fff,${C.cyan}`;

  const speed = evento?.tipo === 'gol' ? '0.5s'
    : varMode ? '4s'
    : '2.5s';

  return(
    <div style={{
      position:'absolute',top:0,left:0,right:0,height:2,zIndex:11,pointerEvents:'none',
      background:`linear-gradient(90deg,transparent,${color},transparent)`,
      backgroundSize:'200%',
      animation:`led-scan ${speed} linear infinite`,
      transition:'background 0.3s',
    }}/>
  );
}

// ── Componente principal ───────────────────────────────────
export default function JumbotronJogoReativo({ jogo, mercadoFechado=false }: Props) {
  const scout = useRealtimeScout(jogo.id);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dispara confete no gol
  useEffect(() => {
    if (scout.evento?.tipo !== 'gol') return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F5C400','#fff','#ffeb85','#D4A200'],
      gravity: 1.2,
      scalar: 0.9,
    });
  }, [scout.evento]);

  // Efeito visual do card baseado no evento
  const cardStyle = (): React.CSSProperties => {
    if (scout.varAndamento) return {
      borderColor: C.cyan,
      boxShadow: `0 0 30px rgba(0,243,255,0.2),inset 0 0 20px rgba(0,243,255,0.05)`,
    };
    if (scout.evento?.tipo === 'gol') return {
      borderColor: C.gold,
      boxShadow: `0 0 40px rgba(245,196,0,0.35),inset 0 0 20px rgba(245,196,0,0.08)`,
    };
    if (scout.evento?.tipo === 'cartao_vermelho') return {
      borderColor: C.red,
      boxShadow: `0 0 30px rgba(255,45,85,0.3),inset 0 0 20px rgba(255,45,85,0.07)`,
    };
    return {
      borderColor: 'rgba(245,196,0,0.22)',
      boxShadow: 'none',
    };
  };

  const statusLabel = scout.varAndamento ? 'VAR'
    : scout.evento?.tipo === 'gol' ? 'GOOOOL!'
    : 'MERCADO ABERTO';
  const statusColor = scout.varAndamento ? C.cyan
    : scout.evento?.tipo === 'gol' ? C.gold
    : C.cyan;

  const dataFmt=new Date(jogo.data_hora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'America/Sao_Paulo'});
  const horaFmt=new Date(jogo.data_hora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'});

  return(
    <div
      ref={cardRef}
      style={{
        fontFamily:"'Barlow Condensed',Impact,sans-serif",
        background:'#000',borderRadius:16,overflow:'hidden',
        position:'relative',padding:2,
        border:`1px solid ${cardStyle().borderColor}`,
        boxShadow:cardStyle().boxShadow,
        transition:'border-color 0.4s,box-shadow 0.4s',
      }}
    >
      <style>{`
        @keyframes led-scan{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes red-pulse{0%,100%{text-shadow:0 0 8px #FF2D55}50%{text-shadow:0 0 16px #FF2D55,0 0 28px rgba(255,45,85,0.5)}}
        @keyframes var-blink{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes ov-fade{from{opacity:0}to{opacity:1}}
        @keyframes pulse-gold-cta{0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.45)}50%{box-shadow:0 0 36px rgba(245,196,0,0.8)}}
        @keyframes blink-dot{0%,100%{opacity:1}50%{opacity:0.2}}
      `}</style>

      {/* LED textures */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:'radial-gradient(circle,rgba(245,196,0,0.04) 1px,transparent 1px)',backgroundSize:'4px 4px'}}/>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(245,196,0,0.016) 12px,rgba(245,196,0,0.016) 14px),repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,196,0,0.012) 18px,rgba(245,196,0,0.012) 20px)`}}/>

      {/* Scan bar reativa */}
      <ScanBar evento={scout.evento} varMode={scout.varAndamento}/>

      {/* Overlay de evento */}
      <EventoOverlay evento={scout.evento}/>

      <div style={{position:'relative',zIndex:1,padding:'18px 14px 22px'}}>

        {/* TOP BAR */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,paddingBottom:10,borderBottom:'1px solid rgba(245,196,0,0.1)'}}>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <span style={{width:6,height:6,borderRadius:'50%',
              background:scout.varAndamento?C.cyan:C.green,
              boxShadow:scout.varAndamento?`0 0 6px ${C.cyan},0 0 14px ${C.cyan}`:`0 0 6px ${C.green}`,
              display:'inline-block',animation:'blink-dot 1s ease-in-out infinite'}}/>
            <span style={{fontSize:9,fontWeight:900,letterSpacing:'0.3em',color:statusColor,textShadow:scout.varAndamento?C.glowCyan:C.glowGold,transition:'color 0.3s'}}>
              {statusLabel}
            </span>
          </div>
          <span style={{fontSize:10,fontWeight:900,letterSpacing:'0.3em',color:C.gold,textShadow:C.glowGold}}>
            {jogo.competicao.toUpperCase()}
          </span>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)'}}>RODADA {jogo.rodada}</span>
        </div>

        {/* Placar ao vivo */}
        <div style={{textAlign:'center',marginBottom:12}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:36,fontWeight:900,fontStyle:'italic',
            color:scout.golsNovo>0?C.gold:'rgba(255,255,255,0.4)',
            textShadow:scout.golsNovo>0?C.glowGold:'none',
            letterSpacing:'-0.02em',lineHeight:1,transition:'color 0.5s'}}>
            {scout.golsNovo > 0 ? `${scout.golsNovo} — 0` : '— — —'}
          </div>
          {scout.cartoes.length > 0 && (
            <div style={{display:'flex',justifyContent:'center',gap:4,marginTop:6}}>
              {scout.cartoes.slice(-4).map((c,i)=>(
                <div key={i} style={{width:8,height:12,background:c.tipo==='amarelo'?C.gold:C.red,borderRadius:1,opacity:0.8,transform:'rotate(-8deg)'}}/>
              ))}
            </div>
          )}
        </div>

        {/* Countdown — pausa no VAR */}
        <Countdown dataHora={jogo.data_hora} paused={scout.varAndamento}/>

        {/* Escudos */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',marginBottom:10}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flex:1}}>
            <div style={{width:42,height:42,background:'#0d0d0d',border:'1px solid rgba(255,255,255,0.08)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
              {jogo.mandante.escudo_url?<img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} style={{width:30,height:30,objectFit:'contain'}}/>:<span style={{fontSize:18}}>⚽</span>}
            </div>
            <span style={{fontSize:7,fontWeight:900,letterSpacing:'0.1em',color:'rgba(255,255,255,0.35)',textAlign:'center'}}>{(jogo.mandante.sigla||jogo.mandante.nome).toUpperCase()}</span>
          </div>
          <div style={{textAlign:'center',padding:'0 4px'}}>
            <div style={{fontSize:12,fontWeight:900,fontStyle:'italic',color:'rgba(245,196,0,0.18)'}}>VS</div>
            <div style={{fontSize:9,fontWeight:900,color:C.gold,marginTop:2,textShadow:C.glowGold}}>{dataFmt} · {horaFmt}</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flex:1}}>
            <div style={{width:42,height:42,background:'#0d0d0d',
              border:`1px solid ${scout.golsNovo>0?'rgba(245,196,0,0.5)':'rgba(245,196,0,0.28)'}`,
              borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',
              boxShadow:scout.golsNovo>0?'0 0 20px rgba(245,196,0,0.3)':'0 0 18px rgba(245,196,0,0.14)',
              transition:'border-color 0.4s,box-shadow 0.4s'}}>
              {jogo.visitante.escudo_url?<img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} style={{width:30,height:30,objectFit:'contain'}}/>:<span style={{fontSize:18}}>🐯</span>}
            </div>
            <span style={{fontSize:7,fontWeight:900,letterSpacing:'0.1em',color:C.gold,textAlign:'center',textShadow:'0 0 6px rgba(245,196,0,0.4)'}}>{(jogo.visitante.sigla||jogo.visitante.nome).toUpperCase()}</span>
          </div>
        </div>

        {jogo.local&&<div style={{fontSize:7,color:'rgba(255,255,255,0.18)',letterSpacing:'0.08em',textAlign:'center',marginBottom:12}}>📍 {jogo.local.toUpperCase()}</div>}

        {/* CTA */}
        {mercadoFechado?(
          <div style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,color:'rgba(255,255,255,0.25)',fontSize:10,fontWeight:900,letterSpacing:'0.22em',padding:'12px',textAlign:'center'}}>MERCADO FECHADO</div>
        ):(
          <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',background:`linear-gradient(135deg,${C.gold},#D4A200)`,borderRadius:8,color:'#000',fontSize:11,fontWeight:900,letterSpacing:'0.22em',padding:'12px',textDecoration:'none',textAlign:'center',animation:'pulse-gold-cta 2s ease-in-out infinite',position:'relative',overflow:'hidden'}}>
            CONVOCAR TITULARES →
          </Link>
        )}

        {jogo.transmissao&&<div style={{fontSize:7,fontWeight:700,letterSpacing:'0.18em',color:'rgba(255,255,255,0.18)',textAlign:'center',marginTop:7}}>📺 {jogo.transmissao}</div>}

      </div>
    </div>
  );
}
