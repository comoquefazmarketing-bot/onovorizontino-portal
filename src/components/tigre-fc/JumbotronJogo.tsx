'use client';
// src/components/tigre-fc/JumbotronJogo.tsx
// Sistema 4 cores: --gold --cyan --red --purple

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Time   { nome: string; escudo_url: string | null; sigla?: string | null }
interface Jogo   { id: number; competicao: string; rodada: string; data_hora: string; local: string | null; transmissao: string | null; mandante: Time; visitante: Time }
interface RankUser { apelido: string; pontos: number }
interface Stats  { topPontuador?: { nome: string; pts: number }; mediaSofa?: number; maisEscalado?: { nome: string; pct: number }; ranking?: RankUser[]; participantes?: number; posicao?: number; golsSofridos?: number; mediaSofaTime?: number; mvp?: { nome: string; media: number } }
interface Props  { jogo: Jogo; stats?: Stats; mercadoFechado?: boolean }

const C = {
  gold:'#F5C400', cyan:'#00F3FF', red:'#FF2D55', purple:'#BF5FFF',
  glowGold:'0 0 8px rgba(245,196,0,0.6),0 0 20px rgba(245,196,0,0.3)',
  glowCyan:'0 0 8px rgba(0,243,255,0.7),0 0 20px rgba(0,243,255,0.35)',
  glowRed:'0 0 8px rgba(255,45,85,0.7),0 0 20px rgba(255,45,85,0.35)',
  glowPurple:'0 0 8px rgba(191,95,255,0.7),0 0 20px rgba(191,95,255,0.35)',
};

function Countdown({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h:'00', m:'00', s:'00', crit:false });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(dataHora).getTime() - 90*60_000 - Date.now();
      if (diff <= 0) { setT({ h:'00',m:'00',s:'00',crit:true }); return; }
      const h=Math.floor(diff/3_600_000), m=Math.floor((diff%3_600_000)/60_000), s=Math.floor((diff%60_000)/1_000);
      setT({ h:String(h).padStart(2,'0'), m:String(m).padStart(2,'0'), s:String(s).padStart(2,'0'), crit:h===0&&m<5 });
    };
    calc(); const id=setInterval(calc,1000); return ()=>clearInterval(id);
  }, [dataHora]);

  const block = (val:string, lbl:string, red=false) => (
    <div style={{background:'#080808',border:'1px solid rgba(245,196,0,0.18)',borderRadius:6,padding:'5px 8px',textAlign:'center',minWidth:42}}>
      <span style={{fontFamily:"'Barlow Condensed',monospace",fontSize:26,fontWeight:900,lineHeight:1,display:'block',
        color:red?C.red:'#fff',textShadow:red?C.glowRed:'0 0 14px rgba(255,255,255,0.2)',
        animation:red?'red-pulse 1s ease-in-out infinite':'none'}}>{val}</span>
      <span style={{fontSize:6,fontWeight:900,letterSpacing:'0.28em',color:'rgba(255,255,255,0.18)'}}>{lbl}</span>
    </div>
  );
  const sep = <span style={{fontSize:20,fontWeight:900,color:'rgba(245,196,0,0.28)',paddingBottom:10}}>:</span>;
  return (
    <div style={{display:'flex',alignItems:'flex-end',gap:3,justifyContent:'center',marginBottom:12}}>
      {block(t.h,'HORAS')}{sep}{block(t.m,'MIN')}{sep}{block(t.s,'SEG',t.crit)}
    </div>
  );
}

function Bar({pct,color}:{pct:number;color:'gold'|'cyan'|'red'|'purple'}) {
  const grad={gold:`${C.gold},rgba(245,196,0,0.3)`,cyan:`${C.cyan},rgba(0,243,255,0.3)`,red:`${C.red},rgba(255,45,85,0.3)`,purple:`${C.purple},rgba(191,95,255,0.3)`};
  const glow={gold:'rgba(245,196,0,0.5)',cyan:'rgba(0,243,255,0.5)',red:'rgba(255,45,85,0.5)',purple:'rgba(191,95,255,0.5)'};
  return (
    <div style={{height:2,background:'rgba(255,255,255,0.05)',borderRadius:1,marginTop:4}}>
      <div style={{height:2,width:`${pct}%`,background:`linear-gradient(90deg,${grad[color]})`,borderRadius:1,boxShadow:`0 0 6px ${glow[color]}`}}/>
    </div>
  );
}

export default function JumbotronJogo({jogo,stats={},mercadoFechado=false}:Props) {
  const {topPontuador={nome:'Carlão',pts:36},mediaSofa=7.5,maisEscalado={nome:'Rômulo',pct:87},
    ranking=[],participantes=0,posicao=4,golsSofridos=5,mediaSofaTime=6.88,mvp={nome:'Sander',media:7.60}}=stats;
  const dataFmt=new Date(jogo.data_hora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'America/Sao_Paulo'});
  const horaFmt=new Date(jogo.data_hora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'});

  return (
    <div style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",background:'#000',borderRadius:16,overflow:'hidden',position:'relative',padding:2}}>
      <style>{`
        @keyframes pulse-gold-cta{0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.45),0 0 40px rgba(245,196,0,0.2)}50%{box-shadow:0 0 32px rgba(245,196,0,0.75),0 0 64px rgba(245,196,0,0.38)}}
        @keyframes red-pulse{0%,100%{text-shadow:0 0 8px #FF2D55}50%{text-shadow:0 0 16px #FF2D55,0 0 32px rgba(255,45,85,0.5)}}
        @keyframes blink-cyan{0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes led-scan{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes red-lbl{0%,100%{text-shadow:0 0 8px #FF2D55}50%{text-shadow:0 0 16px #FF2D55,0 0 28px rgba(255,45,85,0.4)}}
      `}</style>

      {/* textures */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:'radial-gradient(circle,rgba(245,196,0,0.04) 1px,transparent 1px)',backgroundSize:'4px 4px'}}/>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(245,196,0,0.016) 12px,rgba(245,196,0,0.016) 14px),repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,196,0,0.012) 18px,rgba(245,196,0,0.012) 20px)`}}/>
      <div style={{position:'absolute',inset:0,borderRadius:16,zIndex:10,pointerEvents:'none',border:'1px solid rgba(245,196,0,0.22)',boxShadow:'inset 0 0 60px rgba(245,196,0,0.03),0 0 40px rgba(245,196,0,0.07)'}}/>
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,zIndex:11,pointerEvents:'none',background:`linear-gradient(90deg,transparent,${C.gold},#fff,${C.cyan},transparent)`,backgroundSize:'200%',animation:'led-scan 2.5s linear infinite'}}/>

      <div style={{position:'relative',zIndex:1,padding:'18px 14px 22px'}}>

        {/* TOP BAR */}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14,paddingBottom:10,borderBottom:'1px solid rgba(245,196,0,0.1)'}}>
          <div style={{display:'flex',alignItems:'center',gap:5}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:C.cyan,boxShadow:`0 0 6px ${C.cyan},0 0 14px ${C.cyan}`,display:'inline-block',animation:'blink-cyan 1s ease-in-out infinite'}}/>
            <span style={{fontSize:9,fontWeight:900,letterSpacing:'0.3em',color:C.cyan,textShadow:C.glowCyan}}>MERCADO ABERTO</span>
          </div>
          <span style={{fontSize:10,fontWeight:900,letterSpacing:'0.3em',color:C.gold,textShadow:C.glowGold}}>{jogo.competicao.toUpperCase()}</span>
          <span style={{fontSize:9,fontWeight:700,letterSpacing:'0.2em',color:'rgba(255,255,255,0.3)'}}>RODADA {jogo.rodada}</span>
        </div>

        {/* 3-COL */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 156px 1fr',gap:10,alignItems:'start'}}>

          {/* LEFT */}
          <div style={{background:'rgba(245,196,0,0.03)',border:'1px solid rgba(245,196,0,0.1)',borderRadius:10,padding:'11px 10px'}}>
            <div style={{fontSize:7,fontWeight:900,letterSpacing:'0.35em',color:'rgba(245,196,0,0.4)',borderBottom:'1px solid rgba(245,196,0,0.08)',paddingBottom:5,marginBottom:9}}>FANTASY · LIVE</div>

            {/* Top pontuador */}
            <div style={{marginBottom:9}}>
              <div style={{fontSize:8,letterSpacing:'0.12em',marginBottom:2,color:'rgba(255,255,255,0.3)'}}>TOP PONTUADOR</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,fontStyle:'italic',lineHeight:1,color:C.gold,textShadow:C.glowGold}}>{topPontuador.pts.toFixed(1)}</div>
              <div style={{fontSize:8,marginTop:1,color:C.cyan,textShadow:C.glowCyan}}>{topPontuador.nome} · Capitão</div>
              <Bar pct={100} color="gold"/>
            </div>

            {/* Média sofa - RED */}
            <div style={{marginBottom:9}}>
              <div style={{fontSize:8,letterSpacing:'0.12em',marginBottom:2,color:C.red,animation:'red-lbl 1.8s ease-in-out infinite'}}>MÉDIA SOFASCORE</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,fontStyle:'italic',lineHeight:1,color:C.red,textShadow:C.glowRed}}>{mediaSofa.toFixed(1)}</div>
              <div style={{fontSize:8,marginTop:1,color:'rgba(255,255,255,0.3)'}}>Herói · Rodada</div>
              <Bar pct={(mediaSofa/10)*100} color="red"/>
            </div>

            {/* Mais escalado - CYAN */}
            <div style={{marginBottom:0}}>
              <div style={{fontSize:8,letterSpacing:'0.12em',marginBottom:2,color:'rgba(255,255,255,0.3)'}}>+ ESCALADO</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:900,fontStyle:'italic',lineHeight:1,color:C.cyan,textShadow:C.glowCyan}}>{maisEscalado.nome}</div>
              <div style={{fontSize:8,marginTop:1,color:C.cyan,opacity:0.6}}>{maisEscalado.pct}% dos times</div>
              <Bar pct={maisEscalado.pct} color="cyan"/>
            </div>
          </div>

          {/* CENTER */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center'}}>
            <Countdown dataHora={jogo.data_hora}/>

            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',marginBottom:8}}>
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
                <div style={{width:42,height:42,background:'#0d0d0d',border:`1px solid rgba(245,196,0,0.28)`,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',boxShadow:'0 0 18px rgba(245,196,0,0.14)'}}>
                  {jogo.visitante.escudo_url?<img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} style={{width:30,height:30,objectFit:'contain'}}/>:<span style={{fontSize:18}}>🐯</span>}
                </div>
                <span style={{fontSize:7,fontWeight:900,letterSpacing:'0.1em',color:C.gold,textAlign:'center',textShadow:`0 0 6px rgba(245,196,0,0.4)`}}>{(jogo.visitante.sigla||jogo.visitante.nome).toUpperCase()}</span>
              </div>
            </div>

            {jogo.local&&<div style={{fontSize:7,color:'rgba(255,255,255,0.18)',letterSpacing:'0.08em',textAlign:'center',marginBottom:10}}>📍 {jogo.local.toUpperCase()}</div>}

            {mercadoFechado?(
              <div style={{width:'100%',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:8,color:'rgba(255,255,255,0.25)',fontSize:10,fontWeight:900,letterSpacing:'0.22em',padding:'12px',textAlign:'center'}}>🔒 MERCADO FECHADO</div>
            ):(
              <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',background:`linear-gradient(135deg,${C.gold},#D4A200)`,borderRadius:8,color:'#000',fontSize:11,fontWeight:900,letterSpacing:'0.22em',padding:'12px',textDecoration:'none',textAlign:'center',animation:'pulse-gold-cta 2s ease-in-out infinite',position:'relative',overflow:'hidden'}}>
                CONVOCAR TITULARES →
              </Link>
            )}

            {jogo.transmissao&&<div style={{fontSize:7,fontWeight:700,letterSpacing:'0.18em',color:'rgba(255,255,255,0.18)',textAlign:'center',marginTop:7}}>📺 {jogo.transmissao}</div>}
          </div>

          {/* RIGHT: PURPLE ranking */}
          <div style={{borderRadius:10,padding:'11px 10px',background:`linear-gradient(160deg,rgba(191,95,255,0.07),transparent 70%),rgba(255,255,255,0.03)`,border:`1px solid rgba(191,95,255,0.2)`}}>
            <div style={{fontSize:7,fontWeight:900,letterSpacing:'0.35em',color:'rgba(191,95,255,0.5)',borderBottom:'1px solid rgba(191,95,255,0.12)',paddingBottom:5,marginBottom:9}}>RANKING · TOP 5</div>
            {ranking.slice(0,5).map((u,i)=>(
              <div key={i} style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                <span style={{fontSize:10,fontWeight:900,minWidth:16,color:C.purple,textShadow:C.glowPurple}}>{String(i+1).padStart(2,'0')}</span>
                <span style={{fontSize:10,fontWeight:700,color:'rgba(255,255,255,0.7)',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.apelido}</span>
                <span style={{fontSize:10,fontWeight:900,color:C.purple,textShadow:C.glowPurple}}>{u.pontos}</span>
              </div>
            ))}
            {participantes>0&&(
              <>
                <div style={{height:1,background:'rgba(191,95,255,0.1)',margin:'6px 0'}}/>
                <div style={{fontSize:7,letterSpacing:'0.12em',marginBottom:2,color:C.cyan,textShadow:C.glowCyan}}>TORCEDORES ESCALANDO</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,fontStyle:'italic',lineHeight:1,color:C.cyan,textShadow:C.glowCyan}}>{participantes}</div>
              </>
            )}
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{display:'flex',gap:5,marginTop:12,paddingTop:10,borderTop:'1px solid rgba(245,196,0,0.07)'}}>
          {[
            {val:`${posicao}°`,         lbl:'POSIÇÃO SÉRIE B',   color:C.gold,   glow:C.glowGold,   bg:'rgba(245,196,0,0.03)',   border:'rgba(245,196,0,0.08)'},
            {val:`${golsSofridos}`,      lbl:'GOLS SOFRIDOS',     color:C.red,    glow:C.glowRed,    bg:'rgba(255,45,85,0.04)',   border:'rgba(255,45,85,0.15)'},
            {val:mediaSofaTime.toFixed(2),lbl:'MÉDIA SOFASCORE',  color:C.gold,   glow:C.glowGold,   bg:'rgba(255,255,255,0.02)', border:'rgba(255,255,255,0.04)'},
            {val:mvp.media.toFixed(2),   lbl:`${mvp.nome} · MVP`, color:C.cyan,   glow:C.glowCyan,   bg:'rgba(0,243,255,0.03)',   border:'rgba(0,243,255,0.12)'},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,textAlign:'center',background:s.bg,border:`1px solid ${s.border}`,borderRadius:6,padding:'7px 3px'}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:900,fontStyle:'italic',lineHeight:1,color:s.color,textShadow:s.glow}}>{s.val}</div>
              <div style={{fontSize:6,fontWeight:700,letterSpacing:'0.16em',color:'rgba(255,255,255,0.2)',marginTop:3}}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
