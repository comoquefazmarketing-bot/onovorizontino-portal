'use client';

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
      const h=Math.floor(diff/3_600_000), m=Math.floor((diff%3600000)/60000), s=Math.floor((diff%60000)/1000);
      setT({ h:String(h).padStart(2,'0'), m:String(m).padStart(2,'0'), s:String(s).padStart(2,'0'), crit:h===0&&m<5 });
    };
    calc(); const id=setInterval(calc,1000); return ()=>clearInterval(id);
  }, [dataHora]);

  const block = (val:string, lbl:string, red=false) => (
    <div style={{background:'#080808',border:`1px solid ${red?C.red:'rgba(245,196,0,0.18)'}`,borderRadius:8,padding:'8px 12px',textAlign:'center',minWidth:60}}>
      <span style={{fontFamily:"'Barlow Condensed',monospace",fontSize:38,fontWeight:900,lineHeight:1,display:'block',
        color:red?C.red:'#fff',textShadow:red?C.glowRed:'0 0 14px rgba(255,255,255,0.2)'}}>{val}</span>
      <span style={{fontSize:8,fontWeight:900,letterSpacing:'0.28em',color:'rgba(255,255,255,0.3)'}}>{lbl}</span>
    </div>
  );
  return (
    <div style={{display:'flex',alignItems:'center',gap:6,justifyContent:'center',marginBottom:20, transform:'scale(1.1)'}}>
      {block(t.h,'HORAS')}{block(t.m,'MIN')}{block(t.s,'SEG',t.crit)}
    </div>
  );
}

function Bar({pct,color}:{pct:number;color:'gold'|'cyan'|'red'|'purple'}) {
  const grad={gold:`${C.gold},rgba(245,196,0,0.3)`,cyan:`${C.cyan},rgba(0,243,255,0.3)`,red:`${C.red},rgba(255,45,85,0.3)`,purple:`${C.purple},rgba(191,95,255,0.3)`};
  return (
    <div style={{height:2,background:'rgba(255,255,255,0.05)',borderRadius:1,marginTop:4}}>
      <div style={{height:2,width:`${pct}%`,background:`linear-gradient(90deg,${grad[color]})`,borderRadius:1}}/>
    </div>
  );
}

export default function JumbotronJogo({jogo,stats={},mercadoFechado=false}:Props) {
  const {topPontuador={nome:'Luís Oyama',pts:7.9},mediaSofa=7.9,maisEscalado={nome:'Robson',pct:92},
    ranking=[],participantes=10,posicao=4,golsSofridos:gols=5,mediaSofaTime=6.88,mvp={nome:'Robson',media:7.9}}=stats;
  
  const dataFmt=new Date(jogo.data_hora).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',timeZone:'America/Sao_Paulo'});
  const horaFmt=new Date(jogo.data_hora).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',timeZone:'America/Sao_Paulo'});

  return (
    <div style={{fontFamily:"'Barlow Condensed',sans-serif",background:'#000',borderRadius:24,overflow:'hidden',position:'relative',padding:2}}>
      <style>{`
        @keyframes pulse-gold-cta{0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.45)}50%{box-shadow:0 0 45px rgba(245,196,0,0.7)}}
        @keyframes led-scan{0%{background-position:-200% center}100%{background-position:200% center}}
      `}</style>

      <div style={{position:'absolute',top:0,left:0,right:0,height:2,zIndex:11,background:`linear-gradient(90deg,transparent,${C.gold},#fff,${C.cyan},transparent)`,backgroundSize:'200%',animation:'led-scan 3s linear infinite'}}/>

      <div style={{position:'relative',zIndex:1,padding:'24px'}}>
        <div style={{display:'grid',gridTemplateColumns:'220px 1fr 220px',gap:20,alignItems:'center'}}>

          {/* LEFT: FANTASY STATS */}
          <div style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:16,padding:16}}>
            <div style={{fontSize:9,fontWeight:900,letterSpacing:'0.3em',color:C.cyan,marginBottom:15,borderBottom:'1px solid rgba(0,243,255,0.1)',paddingBottom:8}}>FANTASY STATION</div>
            <div style={{marginBottom:15}}>
              <div style={{fontSize:8,color:'rgba(255,255,255,0.4)',letterSpacing:'0.1em'}}>CAPITÃO RODADA</div>
              <div style={{fontSize:24,fontWeight:900,color:C.gold,textShadow:C.glowGold}}>{topPontuador.pts.toFixed(1)}</div>
              <div style={{fontSize:10,color:C.cyan}}>{topPontuador.nome}</div>
              <Bar pct={100} color="gold"/>
            </div>
            <div>
              <div style={{fontSize:8,color:C.red,letterSpacing:'0.1em'}}>HERÓI DO CAMPO</div>
              <div style={{fontSize:24,fontWeight:900,color:C.red,textShadow:C.glowRed}}>{mediaSofa.toFixed(1)}</div>
              <div style={{fontSize:10,color:'rgba(255,255,255,0.5)'}}>{maisEscalado.nome}</div>
              <Bar pct={79} color="red"/>
            </div>
          </div>

          {/* CENTER: CONFRONTO ALINHADO */}
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',padding:'0 10px'}}>
            <Countdown dataHora={jogo.data_hora}/>
            <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:'100%',gap:15,marginBottom:20}}>
              {/* Mandante */}
              <div style={{flex:1, textAlign:'right', display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                <img src={jogo.mandante.escudo_url||''} style={{width:80,height:80,objectFit:'contain'}} />
                <div style={{fontSize:12,fontWeight:900,color:'rgba(255,255,255,0.4)',marginTop:8}}>{jogo.mandante.nome.toUpperCase()}</div>
              </div>
              {/* VS */}
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', minWidth:60}}>
                <div style={{fontSize:26,fontWeight:900,fontStyle:'italic',color:'rgba(245,196,0,0.15)'}}>VS</div>
                <div style={{height:30,width:2,background:'linear-gradient(transparent, #F5C400, transparent)',margin:'8px 0'}}/>
                <div style={{fontSize:10,fontWeight:900,color:C.gold}}>{dataFmt} · {horaFmt}</div>
              </div>
              {/* Visitante */}
              <div style={{flex:1, textAlign:'left', display:'flex', flexDirection:'column', alignItems:'flex-start'}}>
                <img src={jogo.visitante.escudo_url||''} style={{width:80,height:80,objectFit:'contain',filter:`drop-shadow(0 0 15px ${C.gold}44)`}} />
                <div style={{fontSize:12,fontWeight:900,color:C.gold,textShadow:C.glowGold,marginTop:8}}>{jogo.visitante.nome.toUpperCase()}</div>
              </div>
            </div>
            <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
              width:'100%',maxWidth:320,padding:'16px',borderRadius:12,background:`linear-gradient(135deg,${C.gold},#D4A200)`,
              color:'#000',fontSize:15,fontWeight:900,textAlign:'center',textDecoration:'none',
              animation:'pulse-gold-cta 2s infinite',letterSpacing:'0.1em'
            }}>
              CONVOCAR TITULARES →
            </Link>
          </div>

          {/* RIGHT: RANKING */}
          <div style={{background:'rgba(191,95,255,0.03)',border:'1px solid rgba(191,95,255,0.15)',borderRadius:16,padding:16}}>
            <div style={{fontSize:9,fontWeight:900,letterSpacing:'0.3em',color:C.purple,marginBottom:15,borderBottom:'1px solid rgba(191,95,255,0.1)',paddingBottom:8}}>ELITE RANKING</div>
            {ranking.slice(0,5).map((u,i)=>(
              <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:12}}>
                <span style={{color:C.purple,fontWeight:900}}>{String(i+1).padStart(2,'0')}</span>
                <span style={{flex:1,marginLeft:8,color:'rgba(255,255,255,0.7)',textTransform:'uppercase'}}>{u.apelido}</span>
                <span style={{fontWeight:900}}>{u.pontos}</span>
              </div>
            ))}
            <div style={{marginTop:15,paddingTop:10,borderTop:'1px solid rgba(255,255,255,0.05)'}}>
              <div style={{fontSize:8,color:C.cyan}}>TORCEDORES ESCALANDO</div>
              <div style={{fontSize:32,fontWeight:900,fontStyle:'italic',color:C.cyan,textShadow:C.glowCyan}}>{participantes}</div>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginTop:25}}>
          {[
            {l:'POSIÇÃO SÉRIE B',v:`${posicao}°`,c:C.gold},
            {l:'GOLS SOFRIDOS',v:gols,c:C.red},
            {l:'MÉDIA SOFASCORE',v:mediaSofaTime.toFixed(2),c:C.gold},
            {l:'MVP ÚLTIMO JOGO',v:mvp.media.toFixed(2),c:C.cyan}
          ].map((s,i)=>(
            <div key={i} style={{textAlign:'center',background:'rgba(255,255,255,0.03)',borderRadius:10,padding:12,border:'1px solid rgba(255,255,255,0.05)'}}>
              <div style={{fontSize:22,fontWeight:900,color:s.c,fontStyle:'italic'}}>{s.v}</div>
              <div style={{fontSize:7,fontWeight:900,color:'rgba(255,255,255,0.3)',marginTop:4,textTransform:'uppercase'}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* RADAR TÁTICO ENQUADRADO */}
        <div style={{marginTop:40}}>
           <div style={{fontSize:10,fontWeight:900,letterSpacing:'0.4em',color:C.cyan,textAlign:'center',marginBottom:15}}>LIVE RADAR SYSTEM</div>
           <div style={{width:'100%',height:550,borderRadius:20,overflow:'hidden',background:'#1a1a1a',border:'8px solid #0d0d0d',position:'relative'}}>
             <iframe src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526026&widgetTheme=dark" style={{width:'100%',height:'880px',border:'none',marginTop:'-180px'}} scrolling="no" />
             <div style={{position:'absolute',inset:0,pointerEvents:'none',background:'radial-gradient(circle at center, transparent, rgba(0,0,0,0.4))'}}/>
           </div>
        </div>
      </div>
    </div>
  );
}
