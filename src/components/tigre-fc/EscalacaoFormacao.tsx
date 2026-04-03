'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const BASE   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup = Record<string, Player | null>;
type Step = 'picking' | 'bench' | 'captain_hero' | 'score' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;

const PLAYERS: Player[] = [
  { id:1,  name:'César Augusto',    short:'César',      num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id:2,  name:'Jordi',            short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  { id:3,  name:'João Scapin',      short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  { id:4,  name:'Lucas Ribeiro',    short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id:5,  name:'Lora',             short:'Lora',       num:2,  pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  { id:6,  name:'Castrillón',       short:'Castrillón', num:6,  pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  { id:7,  name:'Arthur Barbosa',   short:'A.Barbosa',  num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id:8,  name:'Sander',           short:'Sander',     num:33, pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
  { id:9,  name:'Maykon Jesus',     short:'Maykon',     num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  { id:10, name:'Dantas',           short:'Dantas',     num:3,  pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  { id:11, name:'Eduardo Brock',    short:'E.Brock',    num:5,  pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  { id:12, name:'Patrick',          short:'Patrick',    num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  { id:13, name:'Gabriel Bahia',    short:'G.Bahia',    num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id:14, name:'Carlinhos',        short:'Carlinhos',  num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  { id:15, name:'Alemão',           short:'Alemão',     num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  { id:16, name:'Renato Palm',      short:'R.Palm',     num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  { id:17, name:'Alvariño',         short:'Alvariño',   num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  { id:18, name:'Bruno Santana',    short:'B.Santana',  num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  { id:19, name:'Luís Oyama',       short:'Oyama',      num:8,  pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  { id:20, name:'Léo Naldi',        short:'L.Naldi',    num:7,  pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  { id:21, name:'Rômulo',           short:'Rômulo',     num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  { id:22, name:'Matheus Bianqui',  short:'Bianqui',    num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id:23, name:'Juninho',          short:'Juninho',    num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  { id:24, name:'Tavinho',          short:'Tavinho',    num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  { id:25, name:'Diego Galo',       short:'D.Galo',     num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  { id:26, name:'Marlon',           short:'Marlon',     num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  { id:27, name:'Hector Bianchi',   short:'Hector',     num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:28, name:'Nogueira',         short:'Nogueira',   num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:29, name:'Luiz Gabriel',     short:'L.Gabriel',  num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:30, name:'Jhones Kauê',      short:'J.Kauê',     num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  { id:31, name:'Robson',           short:'Robson',     num:9,  pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva',   short:'V.Paiva',    num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges',     short:'H.Borges',   num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel',          short:'Jardiel',    num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca',   short:'N.Careca',   num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Titi Ortiz',       short:'T.Ortiz',    num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão',           short:'Carlão',     num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald',     num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const SLOTS=[{id:'gk',x:50,y:87,pos:'GOL'},{id:'rb',x:83,y:70,pos:'LAT'},{id:'cb1',x:63,y:77,pos:'ZAG'},{id:'cb2',x:37,y:77,pos:'ZAG'},{id:'lb',x:17,y:70,pos:'LAT'},{id:'m1',x:50,y:53,pos:'MEI'},{id:'m2',x:76,y:44,pos:'MEI'},{id:'m3',x:24,y:44,pos:'MEI'},{id:'st',x:50,y:14,pos:'ATA'},{id:'rw',x:81,y:21,pos:'ATA'},{id:'lw',x:19,y:21,pos:'ATA'}];
const BENCH_IDS=['b1','b2','b3','b4','b5'];
const POS_COLORS:Record<string,string>={GOL:'#F5C400',ZAG:'#3B82F6',LAT:'#06B6D4',MEI:'#22C55E',ATA:'#EF4444'};

// ── FOTO DUPLA ────────────────────────────────────────────────────────────────
// A imagem contém 2 poses lado a lado.
// pose='static' → mostra a metade ESQUERDA (perfil)
// pose='celebration' → mostra a metade DIREITA (celebração) com zoom
function PlayerPhoto({foto,pose,cW,cH,radius=0}:{foto:string;pose:'static'|'celebration';cW:number;cH:number;radius?:number}) {
  return (
    <div style={{width:cW,height:cH,overflow:'hidden',borderRadius:radius,position:'relative',flexShrink:0}}>
      <img src={foto} alt="" onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
        style={{
          position:'absolute',
          height: pose==='celebration' ? '130%' : '100%',
          width:'auto', maxWidth:'none',
          top:'50%', transform:'translateY(-50%)',
          // Esquerda = pose estática, Direita = celebração
          left:  pose==='static'      ? 0 : 'auto',
          right: pose==='celebration' ? 0 : 'auto',
          transformOrigin: pose==='celebration' ? 'right center' : 'left center',
        }} />
    </div>
  );
}

// ── STADIUM BG ────────────────────────────────────────────────────────────────
function StadiumBg() {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',background:'linear-gradient(180deg,#010508 0%,#03100a 55%,#06180a 100%)'}}>
      {/* Luz de gramado (verde subindo) */}
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'55%',background:'radial-gradient(ellipse 100% 70% at 50% 100%,rgba(16,80,16,0.4) 0%,transparent 70%)',pointerEvents:'none'}}/>
      {/* Arquibancada fundo */}
      <div style={{position:'absolute',top:0,left:'8%',right:'8%',height:'42%',background:'linear-gradient(180deg,#040804 0%,#0a120a 60%,transparent 100%)',clipPath:'ellipse(55% 100% at 50% 0%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:'8%',right:'8%',height:'36%',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(12,22,12,0.5) 4px,rgba(12,22,12,0.5) 5px)',opacity:0.8,clipPath:'ellipse(53% 100% at 50% 0%)',pointerEvents:'none'}}/>
      {/* Laterais */}
      <div style={{position:'absolute',top:0,bottom:0,left:0,width:'12%',background:'linear-gradient(90deg,#030803 0%,rgba(5,15,5,0.8) 70%,transparent 100%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,bottom:0,right:0,width:'12%',background:'linear-gradient(270deg,#030803 0%,rgba(5,15,5,0.8) 70%,transparent 100%)',pointerEvents:'none'}}/>
      {/* REFLETORES — feixes diagonais top-left */}
      <div style={{position:'absolute',top:'-8%',left:'5%',width:3,height:'80%',background:'linear-gradient(180deg,rgba(255,252,210,0.3) 0%,rgba(255,252,210,0.08) 45%,transparent 100%)',transform:'rotate(22deg)',transformOrigin:'top center',filter:'blur(5px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',left:'7%',width:10,height:'70%',background:'linear-gradient(180deg,rgba(255,252,210,0.12) 0%,transparent 100%)',transform:'rotate(24deg)',transformOrigin:'top center',filter:'blur(14px)',pointerEvents:'none'}}/>
      {/* REFLETORES — feixes diagonais top-right */}
      <div style={{position:'absolute',top:'-8%',right:'5%',width:3,height:'80%',background:'linear-gradient(180deg,rgba(255,252,210,0.3) 0%,rgba(255,252,210,0.08) 45%,transparent 100%)',transform:'rotate(-22deg)',transformOrigin:'top center',filter:'blur(5px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',right:'7%',width:10,height:'70%',background:'linear-gradient(180deg,rgba(255,252,210,0.12) 0%,transparent 100%)',transform:'rotate(-24deg)',transformOrigin:'top center',filter:'blur(14px)',pointerEvents:'none'}}/>
      {/* LENS FLARE — pontos de refletores */}
      <div style={{position:'absolute',top:'1%',left:'8%',width:7,height:7,borderRadius:'50%',background:'white',boxShadow:'0 0 18px 10px rgba(255,255,210,0.35),0 0 50px 25px rgba(255,255,210,0.12)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'1%',right:'8%',width:7,height:7,borderRadius:'50%',background:'white',boxShadow:'0 0 18px 10px rgba(255,255,210,0.35),0 0 50px 25px rgba(255,255,210,0.12)',pointerEvents:'none'}}/>
      {/* Feixes centrais menores */}
      <div style={{position:'absolute',top:0,left:'28%',width:2,height:'55%',background:'linear-gradient(180deg,rgba(255,252,210,0.1) 0%,transparent 100%)',transform:'rotate(6deg)',filter:'blur(8px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,right:'28%',width:2,height:'55%',background:'linear-gradient(180deg,rgba(255,252,210,0.1) 0%,transparent 100%)',transform:'rotate(-6deg)',filter:'blur(8px)',pointerEvents:'none'}}/>
      {/* Fumaça */}
      {[{l:'8%',b:'30%',d:0,dur:7},{l:'45%',b:'26%',d:1.5,dur:6},{l:'80%',b:'31%',d:0.7,dur:8},{l:'25%',b:'22%',d:2.3,dur:5},{l:'63%',b:'20%',d:1.1,dur:9}].map((s,i)=>(
        <motion.div key={i}
          style={{position:'absolute',left:s.l,bottom:s.b,width:110,height:36,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(180,220,180,0.07) 0%,transparent 70%)',filter:'blur(14px)',pointerEvents:'none'}}
          animate={{x:[0,-12,8,0],opacity:[0.3,0.6,0.25,0.3],scale:[1,1.4,0.9,1]}}
          transition={{duration:s.dur,delay:s.d,repeat:Infinity,ease:'easeInOut'}}/>
      ))}
    </div>
  );
}

// ── EMPTY SLOT ────────────────────────────────────────────────────────────────
function EmptySlot({pos,active,onClick}:{pos:string;active:boolean;onClick:()=>void}) {
  const col=POS_COLORS[pos]??'#888';
  return (
    <motion.button onClick={onClick} whileTap={{scale:0.88}}
      animate={active?{boxShadow:[`0 0 0 0 ${col}40`,`0 0 20px 6px ${col}90`,`0 0 0 0 ${col}40`]}:{}}
      transition={{duration:0.75,repeat:Infinity}}
      style={{width:44,height:44,borderRadius:'50%',cursor:'pointer',
        border:`2px dashed ${active?col:'rgba(255,255,255,0.2)'}`,
        background:active?`${col}28`:'rgba(0,0,0,0.55)',backdropFilter:'blur(4px)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:1,
        boxShadow:active?`0 0 22px ${col}90,0 0 44px ${col}30`:'none',
        transition:'border-color 0.2s,background 0.2s'}}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H11L10 22L20 9.5H13.5L13 2Z"
          stroke={active?col:'rgba(255,255,255,0.22)'} strokeWidth="1.5"
          fill={active?`${col}40`:'transparent'} strokeLinejoin="round"/>
      </svg>
      <span style={{fontSize:6,fontWeight:900,color:active?col:'rgba(255,255,255,0.2)',letterSpacing:1,textTransform:'uppercase',lineHeight:1}}>{pos}</span>
    </motion.button>
  );
}

// ── CARD NO CAMPO ─────────────────────────────────────────────────────────────
function CardOnField({player,isCaptain,isHero,pulsing,onClick}:{
  player:Player;isCaptain:boolean;isHero:boolean;pulsing:boolean;onClick:()=>void;
}) {
  const col=isCaptain?'#F5C400':isHero?'#00F3FF':(POS_COLORS[player.pos]??'#888');
  return (
    <motion.button onClick={onClick}
      initial={{scale:0,opacity:0,y:-18}} animate={{scale:1,opacity:1,y:0}}
      whileHover={{scale:1.13,y:-5}} whileTap={{scale:0.92}}
      transition={{type:'spring',stiffness:440,damping:22}}
      style={{position:'relative',cursor:'pointer',background:'none',border:'none',padding:0,display:'flex',flexDirection:'column',alignItems:'center',gap:0}}>
      {/* Pulse ring */}
      {pulsing&&<motion.div animate={{scale:[1,1.9,1],opacity:[0.9,0,0.9]}} transition={{duration:0.85,repeat:Infinity}}
        style={{position:'absolute',inset:-5,borderRadius:'50%',border:`2px solid ${col}`,pointerEvents:'none'}}/>}
      {/* Badge */}
      {(isCaptain||isHero)&&<motion.div initial={{scale:0}} animate={{scale:1}}
        style={{position:'absolute',top:-8,right:-5,zIndex:10,background:col,color:'#000',fontSize:7,fontWeight:900,
          padding:'2px 4px',borderRadius:4,lineHeight:1,boxShadow:`0 0 12px ${col}cc,0 0 24px ${col}60`}}>
        {isCaptain?'C':'⭐'}
      </motion.div>}
      {/* Circular photo — celebração */}
      <div style={{width:48,height:48,borderRadius:'50%',overflow:'hidden',
        border:`2.5px solid ${col}`,
        boxShadow:`0 0 ${isCaptain||isHero?'22px':'8px'} ${col}90,0 6px 20px rgba(0,0,0,0.75)`,
        background:'#111'}}>
        <PlayerPhoto foto={player.foto} pose="celebration" cW={48} cH={48} />
      </div>
      {/* LED name strip */}
      <motion.div animate={{opacity:[0.85,1,0.85]}} transition={{duration:2,repeat:Infinity}}
        style={{marginTop:3,paddingTop:2,paddingBottom:2,paddingLeft:5,paddingRight:5,
          background:`linear-gradient(135deg,${col}ee,${col}99)`,borderRadius:4,maxWidth:56}}>
        <div style={{fontSize:6.5,fontWeight:900,color:'#000',textTransform:'uppercase',lineHeight:1,
          textAlign:'center',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
          {player.short}
        </div>
      </motion.div>
      {/* Float shadow */}
      <motion.div animate={{scaleX:[1,0.65,1],opacity:[0.3,0.12,0.3]}} transition={{duration:2.5,repeat:Infinity,ease:'easeInOut'}}
        style={{width:30,height:5,borderRadius:'50%',background:'rgba(0,0,0,0.5)',filter:'blur(3px)',marginTop:2}}/>
    </motion.button>
  );
}

// ── CAMPO 3D ──────────────────────────────────────────────────────────────────
function Field3D({lineup,selectedSlot,onSlotClick,specialMode,captainId,heroId,step}:{
  lineup:Lineup;selectedSlot:string|null;onSlotClick:(id:string)=>void;
  specialMode:SpecialMode;captainId:number|null;heroId:number|null;step:Step;
}) {
  const pulsing=step==='captain_hero'&&specialMode!==null;
  return (
    <div style={{width:'100%',maxWidth:440,margin:'0 auto',perspective:'480px',perspectiveOrigin:'50% 18%'}}>
      <div style={{position:'relative',width:'100%',paddingTop:'148%',transform:'rotateX(20deg)',transformOrigin:'bottom center',transformStyle:'preserve-3d'}}>
        {/* Gramado */}
        <div style={{position:'absolute',inset:0,borderRadius:18,overflow:'hidden',
          background:'linear-gradient(180deg,#0b3d0b 0%,#145214 18%,#1c6e1c 50%,#145214 82%,#0b3d0b 100%)',
          border:'2px solid rgba(255,255,255,0.2)',
          boxShadow:'0 44px 110px rgba(0,0,0,0.98),0 0 0 1px rgba(255,255,255,0.04),inset 0 0 60px rgba(0,0,0,0.35)'}}>
          {Array.from({length:12}).map((_,i)=>(
            <div key={i} style={{position:'absolute',left:0,right:0,top:`${i*8.33}%`,height:'8.33%',
              background:i%2===0?'rgba(0,0,0,0.15)':'transparent'}}/>
          ))}
          <svg viewBox="0 0 100 148" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.26}}>
            <rect x="5" y="4" width="90" height="140" stroke="white" strokeWidth="0.8" fill="none" rx="1"/>
            <line x1="5" y1="74" x2="95" y2="74" stroke="white" strokeWidth="0.5"/>
            <circle cx="50" cy="74" r="11" stroke="white" strokeWidth="0.5" fill="none"/>
            <circle cx="50" cy="74" r="0.8" fill="white"/>
            <rect x="26" y="4" width="48" height="15" stroke="white" strokeWidth="0.5" fill="none"/>
            <rect x="26" y="129" width="48" height="15" stroke="white" strokeWidth="0.5" fill="none"/>
            <rect x="36" y="4" width="28" height="7" stroke="white" strokeWidth="0.4" fill="none"/>
            <rect x="36" y="137" width="28" height="7" stroke="white" strokeWidth="0.4" fill="none"/>
          </svg>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'14%',
            background:'linear-gradient(0deg,rgba(170,215,170,0.06) 0%,transparent 100%)',pointerEvents:'none'}}/>
        </div>
        {/* Slots */}
        <div style={{position:'absolute',inset:0}}>
          {SLOTS.map(slot=>{
            const player=lineup[slot.id]??null;
            const isActive=selectedSlot===slot.id;
            const isPulsing=pulsing&&!!player;
            return (
              <div key={slot.id} onClick={()=>onSlotClick(slot.id)}
                style={{position:'absolute',left:`${slot.x}%`,top:`${slot.y}%`,transform:'translate(-50%,-50%)',
                  zIndex:isActive?20:player?10:5,cursor:'pointer'}}>
                {player
                  ? <CardOnField player={player} isCaptain={captainId===player.id} isHero={heroId===player.id}
                      pulsing={isPulsing} active={isActive} onClick={()=>onSlotClick(slot.id)}/>
                  : <EmptySlot pos={slot.pos} active={isActive} onClick={()=>onSlotClick(slot.id)}/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── BANCO ─────────────────────────────────────────────────────────────────────
function BenchArea({lineup,selectedSlot,onSlotClick}:{lineup:Lineup;selectedSlot:string|null;onSlotClick:(id:string)=>void}) {
  return (
    <div style={{padding:'10px 12px 12px',background:'rgba(0,0,0,0.72)',backdropFilter:'blur(8px)',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{fontSize:7,fontWeight:900,color:'#2a2a2a',letterSpacing:4,textTransform:'uppercase',textAlign:'center',marginBottom:10}}>🪑 Banco de Reservas</div>
      <div style={{display:'flex',gap:8,justifyContent:'center'}}>
        {BENCH_IDS.map((id,i)=>{
          const player=lineup[id]??null;
          const isActive=selectedSlot===id;
          const col=player?(POS_COLORS[player.pos]??'#555'):isActive?'#F5C400':'rgba(255,255,255,0.1)';
          return (
            <div key={id} onClick={()=>onSlotClick(id)} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer'}}>
              <div style={{width:46,height:10,borderRadius:'5px 5px 0 0',background:player?`${col}30`:'rgba(255,255,255,0.04)',border:`1px solid ${col}`}}/>
              {player
                ? <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:400}}
                    style={{width:46,height:58,borderRadius:10,overflow:'hidden',border:`1.5px solid ${col}`,boxShadow:`0 4px 14px rgba(0,0,0,0.8)`,background:'#111'}}>
                    <PlayerPhoto foto={player.foto} pose="celebration" cW={46} cH={46}/>
                    <div style={{background:col,textAlign:'center',padding:'2px'}}>
                      <div style={{fontSize:6.5,fontWeight:900,color:'#000',textTransform:'uppercase',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',padding:'0 2px'}}>{player.short}</div>
                    </div>
                  </motion.div>
                : <div style={{width:46,height:58,borderRadius:10,
                    border:`2px dashed ${isActive?'#F5C400':'rgba(255,255,255,0.08)'}`,
                    background:isActive?'rgba(245,196,0,0.1)':'rgba(0,0,0,0.4)',
                    display:'flex',alignItems:'center',justifyContent:'center',
                    boxShadow:isActive?'0 0 16px rgba(245,196,0,0.4)':'none'}}>
                    <span style={{fontSize:18,opacity:0.2}}>+</span>
                  </div>}
              <div style={{fontSize:6,color:'#222',fontWeight:700}}>R{i+1}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── MERCADO ───────────────────────────────────────────────────────────────────
function PlayerPicker({lineup,filterPos,setFilterPos,onSelect,selectedSlot,step}:{
  lineup:Lineup;filterPos:string;setFilterPos:(p:string)=>void;
  onSelect:(p:Player)=>void;selectedSlot:string|null;step:Step;
}) {
  const usedIds=useMemo(()=>new Set(Object.values(lineup).filter(Boolean).map(p=>p!.id)),[lineup]);
  const filtered=useMemo(()=>PLAYERS.filter(p=>!usedIds.has(p.id)&&(filterPos==='TODOS'||p.pos===filterPos)),[usedIds,filterPos]);
  const canPlace=!!selectedSlot;
  return (
    <div style={{background:'#080808',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{display:'flex',gap:5,padding:'8px 12px',overflowX:'auto'}}>
        {['TODOS','GOL','ZAG','LAT','MEI','ATA'].map(f=>(
          <button key={f} onClick={()=>setFilterPos(f)}
            style={{padding:'5px 11px',borderRadius:20,fontSize:8,fontWeight:900,textTransform:'uppercase',
              letterSpacing:1,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,
              background:filterPos===f?'#F5C400':'rgba(255,255,255,0.05)',
              color:filterPos===f?'#000':'#444',
              border:filterPos===f?'none':'1px solid rgba(255,255,255,0.07)',
              transition:'all 0.15s'}}>
            {f}
          </button>
        ))}
      </div>
      <div style={{padding:'0 12px 5px',fontSize:9,fontWeight:700,color:canPlace?'#F5C400':'#2a2a2a'}}>
        {canPlace?'✦ Slot ativo — clique no jogador':step==='bench'?'🪑 Selecione um reserva':'← Clique num slot do campo primeiro'}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7,padding:'0 12px 16px',maxHeight:210,overflowY:'auto'}}>
        {filtered.map(p=>{
          const col=POS_COLORS[p.pos]??'#555';
          return (
            <motion.button key={p.id} onClick={()=>canPlace&&onSelect(p)}
              whileTap={canPlace?{scale:0.91}:{}} whileHover={canPlace?{scale:1.04}:{}}
              style={{background:'#111',border:`1.5px solid rgba(255,255,255,0.06)`,
                borderRadius:10,overflow:'hidden',cursor:canPlace?'pointer':'default',
                padding:0,opacity:canPlace?1:0.45,transition:'opacity 0.2s'}}>
              {/* Foto mercado — pose ESTÁTICA (esquerda) */}
              <div style={{width:'100%',aspectRatio:'1/1.1',overflow:'hidden',position:'relative',background:'#0d0d0d'}}>
                <img src={p.foto} alt={p.short}
                  onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                  style={{position:'absolute',height:'100%',width:'auto',
                    left:0,top:0,objectFit:'cover',objectPosition:'left center'}}/>
              </div>
              <div style={{padding:'3px 3px 4px',background:'#0d0d0d'}}>
                <div style={{fontSize:6.5,color:col,fontWeight:900,letterSpacing:0.5}}>{p.pos}</div>
                <div style={{fontSize:8,color:'#fff',fontWeight:700,textTransform:'uppercase',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.short}</div>
              </div>
            </motion.button>
          );
        })}
        {filtered.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:'20px 0',color:'#22C55E',fontSize:11,fontWeight:700}}>Todos escalados ✓</div>}
      </div>
    </div>
  );
}

// ── HUD ───────────────────────────────────────────────────────────────────────
function HUD({step,filled,benchFilled}:{step:Step;filled:number;benchFilled:number}) {
  const steps=[{id:'picking',label:'Time',num:1},{id:'bench',label:'Banco',num:2},{id:'captain_hero',label:'Líder',num:3},{id:'score',label:'Placar',num:4},{id:'share',label:'Share',num:5}];
  const ci=steps.findIndex(s=>s.id===step);
  return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 14px',
      background:'rgba(0,0,0,0.88)',backdropFilter:'blur(10px)',
      borderBottom:'1px solid rgba(245,196,0,0.1)',position:'sticky',top:0,zIndex:50}}>
      <img src={PATA} style={{width:22,height:22,objectFit:'contain',filter:'drop-shadow(0 0 6px rgba(245,196,0,0.5))'}} alt=""/>
      <div style={{display:'flex',gap:3,alignItems:'center'}}>
        {steps.map((s,i)=>(
          <React.Fragment key={s.id}>
            <div style={{display:'flex',alignItems:'center',gap:2}}>
              <div style={{width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                background:i<ci?'#22C55E':i===ci?'#F5C400':'rgba(255,255,255,0.06)',
                fontSize:8,fontWeight:900,color:i<=ci?'#000':'#333',
                border:i===ci?'1.5px solid #F5C400':'none',boxShadow:i===ci?'0 0 8px rgba(245,196,0,0.6)':'none'}}>
                {i<ci?'✓':s.num}
              </div>
              {i===ci&&<span style={{fontSize:7,fontWeight:900,color:'#F5C400',textTransform:'uppercase',letterSpacing:0.5}}>{s.label}</span>}
            </div>
            {i<steps.length-1&&<div style={{width:10,height:1,background:i<ci?'#22C55E':'rgba(255,255,255,0.08)'}}/>}
          </React.Fragment>
        ))}
      </div>
      <div style={{fontSize:9,fontWeight:900,color:'#F5C400',minWidth:32,textAlign:'right'}}>
        {step==='picking'?`${filled}/11`:step==='bench'?`${benchFilled}/5`:''}
      </div>
    </div>
  );
}

// ── CAPITÃO & HERÓI ───────────────────────────────────────────────────────────
function CaptainHeroScreen({onSelectMode,captainId,heroId,onDone}:{
  onSelectMode:(m:SpecialMode)=>void;captainId:number|null;heroId:number|null;onDone:()=>void;
}) {
  const cap=captainId?PLAYERS.find(p=>p.id===captainId):null;
  const hero=heroId?PLAYERS.find(p=>p.id===heroId):null;
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:100,background:'linear-gradient(180deg,#000 0%,#060200 50%,#000 100%)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:22}}>
      <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
        {Array.from({length:50}).map((_,i)=>(
          <motion.div key={i} style={{position:'absolute',width:1.5,height:1.5,borderRadius:'50%',background:'white',
            left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,opacity:0}}
            animate={{opacity:[0,0.9,0],scale:[0,1.2,0]}}
            transition={{duration:Math.random()*3+1,delay:Math.random()*5,repeat:Infinity}}/>
        ))}
      </div>
      <motion.div initial={{y:-28,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.2}}
        style={{textAlign:'center',marginBottom:28,zIndex:1}}>
        <div style={{fontSize:8,fontWeight:900,color:'#F5C400',letterSpacing:6,textTransform:'uppercase',marginBottom:8}}>ESCOLHA OS LÍDERES</div>
        <h2 style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:34,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:-1,lineHeight:1,margin:'0 0 6px'}}>
          CAPITÃO<br/><span style={{color:'#F5C400'}}>&amp; HERÓI</span>
        </h2>
        <p style={{fontSize:11,color:'#444',fontWeight:600,margin:0}}>Toque no botão, depois no jogador no campo</p>
      </motion.div>
      {[{label:'CAPITÃO',done:cap,doneLabel:cap?.short,delay:0.3,col:'#F5C400',icon:'©',desc:'Pontos dobrados',mode:'CAPTAIN' as SpecialMode},
        {label:'HERÓI',done:hero,doneLabel:hero?.short,delay:0.5,col:'#00F3FF',icon:'⭐',desc:'+10 pts se acertar',mode:'HERO' as SpecialMode}
      ].map((b,i)=>(
        <motion.div key={i} initial={{y:-160,opacity:0}} animate={{y:0,opacity:1}}
          transition={{type:'spring',stiffness:175,damping:16,delay:b.delay}}
          style={{position:'relative',zIndex:1,width:'100%',maxWidth:320,marginBottom:14}}>
          {!b.done&&['-44px','-30px','-16px'].map((t,j)=>(
            <motion.div key={j} animate={{opacity:[0.7,0],scaleY:[1,0.2]}}
              transition={{duration:0.9,delay:b.delay+j*0.04,repeat:Infinity,repeatDelay:2.2}}
              style={{position:'absolute',top:t,left:'50%',transform:'translateX(-50%)',width:3,height:18,borderRadius:2,
                background:`linear-gradient(180deg,transparent,${b.col}${Math.round((0.7-j*0.2)*255).toString(16)})`}}/>
          ))}
          <motion.button onClick={()=>onSelectMode(b.mode)} whileTap={{scale:0.95}}
            animate={!b.done?{boxShadow:[`0 0 14px ${b.col}40`,`0 0 38px ${b.col}90`,`0 0 14px ${b.col}40`]}:{}}
            transition={{duration:1.6,repeat:Infinity}}
            style={{width:'100%',padding:'16px',borderRadius:18,
              background:b.done?`${b.col}18`:`linear-gradient(135deg,${b.col},${b.col}cc)`,
              border:b.done?`2px solid ${b.col}`:'none',
              color:b.done?b.col:'#000',fontSize:13,fontWeight:900,
              textTransform:'uppercase',letterSpacing:2,cursor:'pointer',
              display:'flex',alignItems:'center',justifyContent:'center',gap:10}}>
            <span style={{fontSize:20}}>{b.icon}</span>
            {b.done?`✓ ${b.label}: ${b.doneLabel}`:`ESCOLHER ${b.label}`}
          </motion.button>
          <div style={{textAlign:'center',fontSize:8,color:'#333',marginTop:4}}>{b.desc}</div>
        </motion.div>
      ))}
      <AnimatePresence>
        {captainId&&heroId&&(
          <motion.div initial={{opacity:0,scale:0.85}} animate={{opacity:1,scale:1}} style={{width:'100%',maxWidth:320,zIndex:1,marginTop:8}}>
            <button onClick={onDone} style={{width:'100%',padding:'16px',borderRadius:18,
              background:'linear-gradient(135deg,#22C55E,#16A34A)',border:'none',color:'#fff',
              fontSize:13,fontWeight:900,textTransform:'uppercase',letterSpacing:2,cursor:'pointer',
              boxShadow:'0 8px 24px rgba(34,197,94,0.4)'}}>
              PRÓXIMO → CRAVAR PALPITE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── PLACAR LED ────────────────────────────────────────────────────────────────
function LEDScoreboard({scoreTigre,setScoreTigre,scoreAdv,setScoreAdv,onConfirm}:{
  scoreTigre:number;setScoreTigre:(n:number)=>void;scoreAdv:number;setScoreAdv:(n:number)=>void;onConfirm:()=>void;
}) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:'fixed',inset:0,zIndex:100,background:'#000',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:20}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:'45%',background:'radial-gradient(ellipse at 50% 0%,rgba(245,196,0,0.07) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <motion.div initial={{y:-18,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.1}} style={{textAlign:'center',marginBottom:26}}>
        <div style={{fontSize:8,fontWeight:900,color:'#F5C400',letterSpacing:5,textTransform:'uppercase',marginBottom:5}}>QUAL SERÁ O PLACAR?</div>
        <h2 style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:30,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:-1,lineHeight:1,margin:0}}>CRAVE O RESULTADO</h2>
      </motion.div>
      <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:0.2,type:'spring',stiffness:200}}
        style={{width:'100%',maxWidth:360,marginBottom:26}}>
        <div style={{background:'linear-gradient(145deg,#150900,#211100)',border:'2px solid rgba(245,196,0,0.3)',
          borderRadius:20,padding:'18px 14px',boxShadow:'0 0 40px rgba(245,196,0,0.12),inset 0 0 20px rgba(0,0,0,0.5)'}}>
          <div style={{display:'flex',justifyContent:'center',gap:3,marginBottom:14}}>
            {Array.from({length:14}).map((_,i)=>(
              <motion.div key={i} animate={{opacity:[0.25,1,0.25]}} transition={{duration:0.7,delay:i*0.05,repeat:Infinity}}
                style={{width:5,height:5,borderRadius:1,background:'#F5C400'}}/>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
            <div style={{flex:1,textAlign:'center'}}>
              <img src={ESCUDO} style={{width:42,height:42,objectFit:'contain',filter:'drop-shadow(0 0 8px rgba(245,196,0,0.5))',margin:'0 auto 5px',display:'block'}}/>
              <div style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:10,fontWeight:900,color:'#F5C400',textTransform:'uppercase'}}>NOVO</div>
            </div>
            <div style={{display:'flex',gap:10}}>
              {[{val:scoreTigre,set:setScoreTigre,col:'#F5C400'},{val:scoreAdv,set:setScoreAdv,col:'#666'}].map((s,i)=>(
                <React.Fragment key={i}>
                  {i===1&&<div style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:18,fontWeight:900,color:'rgba(245,196,0,0.2)',fontStyle:'italic',alignSelf:'center'}}>×</div>}
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:5}}>
                    <button onClick={()=>s.set(Math.min(9,s.val+1))} style={{width:30,height:30,borderRadius:8,background:`${s.col}12`,border:`1px solid ${s.col}30`,color:s.col,fontSize:16,fontWeight:900,cursor:'pointer'}}>+</button>
                    <div style={{fontFamily:"'Courier New',monospace",fontSize:50,fontWeight:900,color:s.col,textShadow:`0 0 26px ${s.col}cc`,lineHeight:1,background:'rgba(0,0,0,0.8)',borderRadius:8,padding:'3px 10px',border:`1px solid ${s.col}18`}}>{s.val}</div>
                    <button onClick={()=>s.set(Math.max(0,s.val-1))} style={{width:30,height:30,borderRadius:8,background:`${s.col}06`,border:`1px solid ${s.col}15`,color:'#333',fontSize:16,fontWeight:900,cursor:'pointer'}}>−</button>
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div style={{flex:1,textAlign:'center'}}>
              <div style={{width:42,height:42,margin:'0 auto 5px',background:'rgba(255,255,255,0.04)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:24}}>⚽</span></div>
              <div style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:10,fontWeight:900,color:'#333',textTransform:'uppercase'}}>ADV</div>
            </div>
          </div>
          <div style={{display:'flex',justifyContent:'center',gap:3,marginTop:14}}>
            {Array.from({length:14}).map((_,i)=>(
              <motion.div key={i} animate={{opacity:[0.25,1,0.25]}} transition={{duration:0.7,delay:(13-i)*0.05,repeat:Infinity}}
                style={{width:5,height:5,borderRadius:1,background:'#F5C400'}}/>
            ))}
          </div>
        </div>
      </motion.div>
      <motion.button initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.32}} onClick={onConfirm} whileTap={{scale:0.96}}
        style={{width:'100%',maxWidth:360,padding:'15px',borderRadius:18,background:'linear-gradient(135deg,#F5C400,#D4A200)',border:'none',color:'#000',fontSize:13,fontWeight:900,textTransform:'uppercase',letterSpacing:2,cursor:'pointer',boxShadow:'0 8px 28px rgba(245,196,0,0.35)'}}>
        🎯 CRAVAR PALPITE → VER MEU TIME
      </motion.button>
    </motion.div>
  );
}

// ── SHARE ─────────────────────────────────────────────────────────────────────
function ShareScreen({lineup,captainId,heroId,scoreTigre,scoreAdv}:{
  lineup:Lineup;captainId:number|null;heroId:number|null;scoreTigre:number;scoreAdv:number;
}) {
  const [copied,setCopied]=useState(false);
  const [dl,setDl]=useState(false);
  const cap=captainId?PLAYERS.find(p=>p.id===captainId):null;
  const hero=heroId?PLAYERS.find(p=>p.id===heroId):null;
  const rows=[
    SLOTS.filter(s=>s.pos==='ATA').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    SLOTS.filter(s=>s.pos==='MEI').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    SLOTS.filter(s=>s.pos==='ZAG'||s.pos==='LAT').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    SLOTS.filter(s=>s.pos==='GOL').map(s=>lineup[s.id]).filter(Boolean) as Player[],
  ].filter(r=>r.length>0);
  const shareText=encodeURIComponent(`🐯 Escalei meu time no Tigre FC!\n\nPalpite: Novorizontino ${scoreTigre} × ${scoreAdv}\n\nVocê consegue fazer melhor?\nonovorizontino.com.br/tigre-fc`);
  const handleDl=async()=>{
    setDl(true);
    try{
      const {default:h2c}=await import('html2canvas');
      const el=document.getElementById('tfc-share-card');
      if(!el)return;
      const canvas=await h2c(el,{scale:2,backgroundColor:null,useCORS:true,allowTaint:true});
      canvas.toBlob(async blob=>{
        if(!blob)return;
        const file=new File([blob],'tigre-fc-meu-time.png',{type:'image/png'});
        if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:'Meu time!',text:'🐯',files:[file]});}
        else{const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='tigre-fc-meu-time.png';a.click();URL.revokeObjectURL(url);}
      });
    }catch{}
    setDl(false);
  };
  const BTNS=[{l:'WhatsApp',c:'#25D366',h:`https://wa.me/?text=${shareText}`,i:'💬'},{l:'Instagram',c:'#E1306C',h:'https://instagram.com',i:'📸'},{l:'Facebook',c:'#1877F2',h:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://onovorizontino.com.br/tigre-fc')}`,i:'👥'},{l:'Twitter',c:'#1DA1F2',h:`https://twitter.com/intent/tweet?text=${shareText}`,i:'🐦'}];
  return (
    <div style={{padding:'14px 14px 50px',minHeight:'100vh',background:'#050505'}}>
      <motion.div initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} style={{textAlign:'center',marginBottom:14}}>
        <div style={{fontSize:8,fontWeight:900,color:'#F5C400',letterSpacing:5,textTransform:'uppercase',marginBottom:4}}>TIME CONFIRMADO!</div>
        <h2 style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:24,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:-0.5,margin:0}}>
          SALVE &amp; DESAFIE<br/><span style={{color:'#F5C400'}}>A GALERA 🐯</span>
        </h2>
      </motion.div>
      <motion.div initial={{opacity:0,scale:0.94}} animate={{opacity:1,scale:1}} transition={{delay:0.1}}>
        <div id="tfc-share-card" style={{width:'100%',maxWidth:360,margin:'0 auto',
          background:'linear-gradient(160deg,#0a0900 0%,#141200 40%,#0a1200 70%,#050505 100%)',
          borderRadius:22,overflow:'hidden',border:'1px solid rgba(245,196,0,0.28)',
          boxShadow:'0 0 50px rgba(245,196,0,0.12)',fontFamily:"'Barlow Condensed',Impact,sans-serif"}}>
          <div style={{height:3,background:'linear-gradient(90deg,#B8900A,#F5C400,#B8900A)'}}/>
          <div style={{padding:'12px 16px 9px',display:'flex',alignItems:'center',gap:10,
            borderBottom:'1px solid rgba(245,196,0,0.1)',background:'linear-gradient(90deg,rgba(245,196,0,0.07),transparent)'}}>
            <img src={ESCUDO} style={{width:40,height:40,objectFit:'contain',filter:'drop-shadow(0 0 8px rgba(245,196,0,0.5))'}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:6.5,fontWeight:900,color:'#F5C400',letterSpacing:4,textTransform:'uppercase'}}>TIGRE FC · FANTASY LEAGUE</div>
              <div style={{fontSize:18,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:-0.5,lineHeight:1.1}}>
                MEU TIME ESTÁ<br/><span style={{color:'#F5C400'}}>ESCALADO! 🐯</span>
              </div>
            </div>
          </div>
          <div style={{padding:'10px 14px',background:'rgba(0,0,0,0.25)'}}>
            <div style={{display:'flex',flexDirection:'column',gap:7,alignItems:'center'}}>
              {rows.map((row,ri)=>(
                <div key={ri} style={{display:'flex',gap:5,justifyContent:'center'}}>
                  {row.map(player=>{
                    const isCap=player.id===captainId,isHero=player.id===heroId;
                    const col=isCap?'#F5C400':isHero?'#00F3FF':(POS_COLORS[player.pos]??'#555');
                    return (
                      <div key={player.id} style={{textAlign:'center',position:'relative'}}>
                        {(isCap||isHero)&&<div style={{position:'absolute',top:-5,right:-3,background:col,color:'#000',fontSize:5.5,fontWeight:900,padding:'1px 3px',borderRadius:3,zIndex:2,lineHeight:1}}>{isCap?'C':'⭐'}</div>}
                        <div style={{width:34,height:40,borderRadius:7,overflow:'hidden',border:`1.5px solid ${col}`,boxShadow:`0 0 8px ${col}60`}}>
                          <img src={player.foto} alt={player.short} onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                            style={{height:'130%',width:'auto',objectFit:'cover',position:'relative',right:0,top:0,objectPosition:'right center',transformOrigin:'right center'}}/>
                        </div>
                        <div style={{marginTop:1,fontSize:5.5,color:'#666',fontWeight:700,textTransform:'uppercase',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',width:34}}>{player.short}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',borderTop:'1px solid rgba(245,196,0,0.08)',borderBottom:'1px solid rgba(245,196,0,0.08)'}}>
            {[{label:'Capitão',value:cap?.short??'—',icon:'©'},{label:'Herói',value:hero?.short??'—',icon:'⭐'},{label:'Palpite',value:`${scoreTigre}×${scoreAdv}`,icon:'🎯'}].map(item=>(
              <div key={item.label} style={{flex:1,textAlign:'center',padding:'8px 3px',borderRight:'1px solid rgba(245,196,0,0.07)'}}>
                <div style={{fontSize:13,marginBottom:1}}>{item.icon}</div>
                <div style={{fontSize:11,fontWeight:900,color:'#F5C400',lineHeight:1}}>{item.value}</div>
                <div style={{fontSize:5.5,color:'#2a2a2a',fontWeight:700,textTransform:'uppercase',letterSpacing:1,marginTop:1}}>{item.label}</div>
              </div>
            ))}
          </div>
          <div style={{padding:'10px 16px',textAlign:'center'}}>
            <div style={{fontSize:13,fontWeight:900,color:'#fff',textTransform:'uppercase',lineHeight:1.2,marginBottom:4}}>VOCÊ CONSEGUE<br/><span style={{color:'#F5C400'}}>FAZER MELHOR?</span></div>
            <div style={{fontSize:8,color:'#2a2a2a',fontWeight:600}}>onovorizontino.com.br/tigre-fc</div>
            <div style={{fontSize:7,color:'#141414',fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginTop:1}}>Série B 2026 · #TigreFC</div>
          </div>
          <div style={{height:3,background:'linear-gradient(90deg,#B8900A,#F5C400,#B8900A)'}}/>
        </div>
      </motion.div>
      <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.18}} style={{marginTop:12}}>
        <motion.button onClick={handleDl} whileTap={{scale:0.96}}
          style={{width:'100%',maxWidth:360,margin:'0 auto 9px',display:'block',padding:'14px',borderRadius:16,
            background:'linear-gradient(135deg,#F5C400,#D4A200)',border:'none',color:'#000',fontSize:12,fontWeight:900,
            textTransform:'uppercase',letterSpacing:1.5,cursor:'pointer',boxShadow:'0 8px 24px rgba(245,196,0,0.3)'}}>
          {dl?'⏳ Gerando...':'📥 SALVAR & COMPARTILHAR CARD'}
        </motion.button>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:7,maxWidth:360,margin:'0 auto 7px'}}>
          {BTNS.map(b=>(
            <motion.a key={b.l} href={b.h} target="_blank" rel="noreferrer" whileTap={{scale:0.91}}
              style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,padding:'9px 3px',
                borderRadius:12,background:`${b.c}12`,border:`1px solid ${b.c}35`,textDecoration:'none',cursor:'pointer'}}>
              <span style={{fontSize:16}}>{b.i}</span>
              <span style={{fontSize:6.5,fontWeight:900,color:b.c,textTransform:'uppercase',letterSpacing:0.5}}>{b.l}</span>
            </motion.a>
          ))}
        </div>
        <motion.button onClick={async()=>{await navigator.clipboard.writeText('https://onovorizontino.com.br/tigre-fc');setCopied(true);setTimeout(()=>setCopied(false),2500);}}
          whileTap={{scale:0.96}}
          style={{width:'100%',maxWidth:360,margin:'0 auto',display:'block',padding:'10px',borderRadius:12,
            background:copied?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.04)',
            border:`1px solid ${copied?'rgba(34,197,94,0.4)':'rgba(255,255,255,0.07)'}`,
            color:copied?'#22C55E':'#333',fontSize:10,fontWeight:900,textTransform:'uppercase',letterSpacing:1,cursor:'pointer'}}>
          {copied?'✓ Link copiado!':'🔗 Copiar link'}
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function EscalacaoFormacao() {
  const [step,setStep]=useState<Step>('picking');
  const [lineup,setLineup]=useState<Lineup>({});
  const [selectedSlot,setSelectedSlot]=useState<string|null>(null);
  const [filterPos,setFilterPos]=useState('TODOS');
  const [captainId,setCaptainId]=useState<number|null>(null);
  const [heroId,setHeroId]=useState<number|null>(null);
  const [specialMode,setSpecialMode]=useState<SpecialMode>(null);
  const [scoreTigre,setScoreTigre]=useState(1);
  const [scoreAdv,setScoreAdv]=useState(0);

  const fieldCount=useMemo(()=>SLOTS.filter(s=>!!lineup[s.id]).length,[lineup]);
  const benchCount=useMemo(()=>BENCH_IDS.filter(id=>!!lineup[id]).length,[lineup]);

  // Slot click: ativa slot OU resolve capitão/herói
  const handleSlotClick=useCallback((slotId:string)=>{
    if(step==='captain_hero'&&specialMode){
      const player=lineup[slotId];
      if(!player)return;
      if(specialMode==='CAPTAIN'){setCaptainId(player.id);setSpecialMode(null);}
      else{setHeroId(player.id);setSpecialMode(null);}
      return;
    }
    setSelectedSlot(prev=>prev===slotId?null:slotId);
  },[step,specialMode,lineup]);

  // Selecionar jogador no mercado → vai para o slot ativo
  const handleSelectPlayer=useCallback((player:Player)=>{
    if(!selectedSlot)return;
    // Remove da posição anterior
    const newLineup:Lineup={...lineup};
    Object.keys(newLineup).forEach(k=>{if(newLineup[k]?.id===player.id)newLineup[k]=null;});
    newLineup[selectedSlot]=player;
    setLineup(newLineup);
    setSelectedSlot(null);
    // Auto-advance
    const nf=SLOTS.filter(s=>!!newLineup[s.id]).length;
    const nb=BENCH_IDS.filter(id=>!!newLineup[id]).length;
    if(step==='picking'&&nf===11){setTimeout(()=>{confetti({particleCount:80,spread:60,origin:{y:0.5},colors:['#F5C400','#fff','#22C55E']});setStep('bench');},350);}
    else if(step==='bench'&&nb===5){setTimeout(()=>{confetti({particleCount:130,spread:80,origin:{y:0.4},colors:['#F5C400','#fff','#EF4444']});setStep('captain_hero');},350);}
  },[selectedSlot,lineup,step]);

  const handleCaptainHeroDone=useCallback(()=>{confetti({particleCount:200,spread:100,origin:{y:0.5},colors:['#F5C400','#00F3FF','#fff','#EF4444']});setStep('score');},[]);
  const handleScoreConfirm=useCallback(()=>{confetti({particleCount:160,spread:90,origin:{y:0.6},colors:['#F5C400','#22C55E','#fff']});setStep('share');},[]);

  const isGameField=step==='picking'||step==='bench';

  return (
    <div style={{minHeight:'100vh',background:'#050505',color:'#fff',fontFamily:"'Barlow Condensed',system-ui,sans-serif",overflowX:'hidden'}}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}body{background:#050505}
      `}</style>

      <HUD step={step} filled={fieldCount} benchFilled={benchCount}/>

      <AnimatePresence>
        {step==='captain_hero'&&!specialMode&&(
          <CaptainHeroScreen onSelectMode={m=>{setSpecialMode(m);}} captainId={captainId} heroId={heroId} onDone={handleCaptainHeroDone}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step==='score'&&(
          <LEDScoreboard scoreTigre={scoreTigre} setScoreTigre={setScoreTigre} scoreAdv={scoreAdv} setScoreAdv={setScoreAdv} onConfirm={handleScoreConfirm}/>
        )}
      </AnimatePresence>

      {step==='share'&&<ShareScreen lineup={lineup} captainId={captainId} heroId={heroId} scoreTigre={scoreTigre} scoreAdv={scoreAdv}/>}

      {isGameField&&(
        <>
          <div style={{position:'relative',overflow:'hidden',minHeight:350}}>
            <StadiumBg/>
            <div style={{position:'relative',zIndex:5,padding:'10px 6px 0'}}>
              <div style={{textAlign:'center',marginBottom:5}}>
                <motion.div key={step} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                  style={{display:'inline-flex',alignItems:'center',gap:6,padding:'3px 12px',
                    borderRadius:999,background:'rgba(245,196,0,0.08)',border:'1px solid rgba(245,196,0,0.2)'}}>
                  <span style={{fontSize:7,fontWeight:900,color:'#F5C400',letterSpacing:3,textTransform:'uppercase'}}>
                    {step==='picking'?`⚽ Escale ${11-fieldCount} jogador${11-fieldCount!==1?'es':''}`:`🪑 Adicione ${5-benchCount} reserva${5-benchCount!==1?'s':''}`}
                  </span>
                </motion.div>
              </div>
              <Field3D lineup={lineup} selectedSlot={selectedSlot} onSlotClick={handleSlotClick}
                specialMode={specialMode} captainId={captainId} heroId={heroId} step={step}/>
            </div>
          </div>
          {(fieldCount===11||step==='bench')&&<BenchArea lineup={lineup} selectedSlot={selectedSlot} onSlotClick={handleSlotClick}/>}
          <PlayerPicker lineup={lineup} filterPos={filterPos} setFilterPos={setFilterPos}
            onSelect={handleSelectPlayer} selectedSlot={selectedSlot} step={step}/>
        </>
      )}

      {/* Seleção no campo (capitão/herói) */}
      {step==='captain_hero'&&specialMode&&(
        <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',flexDirection:'column'}}>
          <div style={{padding:'10px 14px',background:'rgba(0,0,0,0.92)',backdropFilter:'blur(10px)',
            borderBottom:`1px solid ${specialMode==='CAPTAIN'?'rgba(245,196,0,0.3)':'rgba(0,243,255,0.3)'}`}}>
            <div style={{fontSize:11,fontWeight:900,textTransform:'uppercase',letterSpacing:2,textAlign:'center',
              color:specialMode==='CAPTAIN'?'#F5C400':'#00F3FF'}}>
              {specialMode==='CAPTAIN'?'© TOQUE NO CAPITÃO DO TIME':'⭐ TOQUE NO HERÓI DO JOGO'}
            </div>
          </div>
          <div style={{flex:1,position:'relative',overflow:'hidden'}}>
            <StadiumBg/>
            <div style={{position:'relative',zIndex:5,padding:'8px 6px 0'}}>
              <Field3D lineup={lineup} selectedSlot={null} onSlotClick={handleSlotClick}
                specialMode={specialMode} captainId={captainId} heroId={heroId} step={step}/>
            </div>
          </div>
          <div style={{padding:'10px 14px',background:'rgba(0,0,0,0.92)',backdropFilter:'blur(10px)'}}>
            <button onClick={()=>setSpecialMode(null)}
              style={{width:'100%',padding:'11px',borderRadius:12,background:'transparent',
                border:'1px solid rgba(255,255,255,0.09)',color:'#444',fontSize:10,fontWeight:900,
                cursor:'pointer',textTransform:'uppercase'}}>
              ← Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
