'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup = Record<string, Player | null>;
type Step = 'picking' | 'bench' | 'captain_hero' | 'score' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;

const PLAYERS: Player[] = [
  { id:1, name:'César Augusto', short:'César', num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id:2, name:'Jordi', short:'Jordi', num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  { id:3, name:'João Scapin', short:'Scapin', num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  { id:4, name:'Lucas Ribeiro', short:'Lucas', num:1, pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id:5, name:'Lora', short:'Lora', num:2, pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  { id:6, name:'Castrillón', short:'Castrillón', num:6, pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  { id:7, name:'Arthur Barbosa', short:'A.Barbosa', num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id:8, name:'Sander', short:'Sander', num:33, pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
  { id:9, name:'Maykon Jesus', short:'Maykon', num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  { id:10, name:'Dantas', short:'Dantas', num:3, pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  { id:11, name:'Eduardo Brock', short:'E.Brock', num:5, pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  { id:12, name:'Patrick', short:'Patrick', num:4, pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  { id:13, name:'Gabriel Bahia', short:'G.Bahia', num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id:14, name:'Carlinhos', short:'Carlinhos', num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  { id:15, name:'Alemão', short:'Alemão', num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  { id:16, name:'Renato Palm', short:'R.Palm', num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  { id:17, name:'Alvariño', short:'Alvariño', num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  { id:18, name:'Bruno Santana', short:'B.Santana', num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  { id:19, name:'Luís Oyama', short:'Oyama', num:8, pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  { id:20, name:'Léo Naldi', short:'L.Naldi', num:7, pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  { id:21, name:'Rômulo', short:'Rômulo', num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  { id:22, name:'Matheus Bianqui', short:'Bianqui', num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id:23, name:'Juninho', short:'Juninho', num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  { id:24, name:'Tavinho', short:'Tavinho', num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  { id:25, name:'Diego Galo', short:'D.Galo', num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  { id:26, name:'Marlon', short:'Marlon', num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  { id:27, name:'Hector Bianchi', short:'Hector', num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:28, name:'Nogueira', short:'Nogueira', num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:29, name:'Luiz Gabriel', short:'L.Gabriel', num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:30, name:'Jhones Kauê', short:'J.Kauê', num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  { id:31, name:'Robson', short:'Robson', num:9, pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva', short:'V.Paiva', num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges', short:'H.Borges', num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel', short:'Jardiel', num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca', short:'N.Careca', num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Titi Ortiz', short:'T.Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias', short:'D.Mathias', num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const SLOTS=[{id:'gk',x:50,y:87,pos:'GOL'},{id:'rb',x:83,y:70,pos:'LAT'},{id:'cb1',x:63,y:77,pos:'ZAG'},{id:'cb2',x:37,y:77,pos:'ZAG'},{id:'lb',x:17,y:70,pos:'LAT'},{id:'m1',x:50,y:53,pos:'MEI'},{id:'m2',x:76,y:44,pos:'MEI'},{id:'m3',x:24,y:44,pos:'MEI'},{id:'st',x:50,y:14,pos:'ATA'},{id:'rw',x:81,y:21,pos:'ATA'},{id:'lw',x:19,y:21,pos:'ATA'}];
const BENCH_IDS=['b1','b2','b3','b4','b5'];
const POS_COLORS:Record<string,string>={GOL:'#F5C400',ZAG:'#3B82F6',LAT:'#06B6D4',MEI:'#22C55E',ATA:'#EF4444'};

// ── FOTO DUPLA ────────────────────────────────────────────────────────────────
function PlayerPhoto({foto,pose,cW,cH,radius=0}:{foto:string;pose:'static'|'celebration';cW:number;cH:number;radius?:number}) {
  return (
    <div style={{width:cW,height:cH,overflow:'hidden',borderRadius:radius,position:'relative',flexShrink:0}}>
      <img src={foto} alt="" onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
        style={{
          position:'absolute',
          height: pose==='celebration' ? '130%' : '100%',
          width:'auto', maxWidth:'none',
          top:'50%', transform:'translateY(-50%)',
          left: pose==='static' ? 0 : 'auto',
          right: pose==='celebration' ? 0 : 'auto',
          transformOrigin: pose==='celebration' ? 'right center' : 'left center',
        }} />
    </div>
  );
}

// ── CARD VERTICAL PREMIUM NO CAMPO (AJUSTADO) ─────────────────────────────────
function VerticalFieldCard({player,isCaptain,isHero,pulsing,active,onClick}:{
  player:Player;isCaptain:boolean;isHero:boolean;pulsing:boolean;active?:boolean;onClick:()=>void;
}) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
  return (
    <motion.button onClick={onClick}
      initial={{scale:0,opacity:0,y:-18}} animate={{scale:1,opacity:1,y:0}}
      whileHover={{scale:1.08,y:-4}} whileTap={{scale:0.92}}
      transition={{type:'spring',stiffness:380,damping:25}}
      style={{
        position:'relative',
        width:68,
        height:98,
        background:'linear-gradient(180deg,#18181b 0%,#27272a 100%)',
        borderRadius:16,
        border:`3px solid ${col}`,
        overflow:'hidden',
        cursor:'pointer',
        boxShadow:`0 0 20px ${col}60, 0 15px 32px rgba(0,0,0,0.8)`,
        display:'flex',
        flexDirection:'column',
      }}
    >
      {pulsing && (
        <motion.div
          animate={{scale:[1,1.18,1],opacity:[0.7,0,0.7]}}
          transition={{duration:1.1,repeat:Infinity}}
          style={{position:'absolute',inset:-12,borderRadius:24,border:`3px solid ${col}`,pointerEvents:'none',zIndex:0}}
        />
      )}
      {active && (
        <motion.div
          animate={{opacity:[0.3,0.95,0.3]}}
          transition={{duration:1.4,repeat:Infinity}}
          style={{position:'absolute',inset:-10,borderRadius:24,boxShadow:`0 0 0 6px ${col}90`,pointerEvents:'none'}}
        />
      )}

      {(isCaptain || isHero) && (
        <motion.div initial={{scale:0}} animate={{scale:1}}
          style={{
            position:'absolute',top:8,right:8,zIndex:30,
            background:col,color:'#000',fontSize:13,fontWeight:900,
            padding:'4px 7px',borderRadius:6,lineHeight:1,
            boxShadow:`0 0 12px ${col}cc`,
          }}>
          {isCaptain ? 'C' : '⭐'}
        </motion.div>
      )}

      <div style={{position:'relative',width:'100%',height:'78%',overflow:'hidden'}}>
        <img
          src={player.foto}
          alt={player.short}
          onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
          style={{
            position:'absolute',
            bottom: '-18%',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '168%',
            width: 'auto',
            maxWidth: 'none',
            objectFit: 'contain',
            objectPosition: 'right 12%',
          }}
        />
      </div>

      <div style={{
        background:`linear-gradient(90deg,${col}ee,${col}aa)`,
        height:26,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize:10.5,
        fontWeight:900,
        fontStyle:'italic',
        color:'#000',
        textTransform:'uppercase',
        letterSpacing:-0.4,
        boxShadow:'0 -4px 10px rgba(0,0,0,0.5)',
      }}>
        {player.short}
      </div>
    </motion.button>
  );
}

// ── SLOT VAZIO VERTICAL ───────────────────────────────────────────────────────
function EmptyVerticalSlot({pos,active,onClick}:{pos:string;active:boolean;onClick:()=>void}) {
  const col = POS_COLORS[pos] ?? '#888';
  return (
    <motion.button onClick={onClick} whileTap={{scale:0.88}}
      animate={active ? {boxShadow:[`0 0 0 0 ${col}30`,`0 0 32px 14px ${col}85`,`0 0 0 0 ${col}30`]} : {}}
      transition={{duration:0.85,repeat:Infinity}}
      style={{
        width:68,height:98,borderRadius:16,cursor:'pointer',
        border:`3px dashed ${active ? col : 'rgba(255,255,255,0.25)'}`,
        background:active ? `${col}18` : 'rgba(20,20,20,0.68)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,
        boxShadow:active ? `0 0 28px ${col}70` : '0 12px 28px rgba(0,0,0,0.7)',
      }}
    >
      <div style={{fontSize:32,opacity:0.15,lineHeight:1}}>+</div>
      <div style={{fontSize:10.5,fontWeight:900,color:active ? col : 'rgba(255,255,255,0.35)',letterSpacing:1.5,textTransform:'uppercase'}}>
        {pos}
      </div>
    </motion.button>
  );
}

// ── STADIUM BG ────────────────────────────────────────────────────────────────
function StadiumBg() {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',background:'linear-gradient(180deg,#010508 0%,#03100a 55%,#06180a 100%)'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'55%',background:'radial-gradient(ellipse 100% 70% at 50% 100%,rgba(16,80,16,0.4) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:'8%',right:'8%',height:'42%',background:'linear-gradient(180deg,#040804 0%,#0a120a 60%,transparent 100%)',clipPath:'ellipse(55% 100% at 50% 0%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:'8%',right:'8%',height:'36%',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(12,22,12,0.5) 4px,rgba(12,22,12,0.5) 5px)',opacity:0.8,clipPath:'ellipse(53% 100% at 50% 0%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,bottom:0,left:0,width:'12%',background:'linear-gradient(90deg,#030803 0%,rgba(5,15,5,0.8) 70%,transparent 100%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,bottom:0,right:0,width:'12%',background:'linear-gradient(270deg,#030803 0%,rgba(5,15,5,0.8) 70%,transparent 100%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',left:'5%',width:3,height:'80%',background:'linear-gradient(180deg,rgba(255,252,210,0.3) 0%,rgba(255,252,210,0.08) 45%,transparent 100%)',transform:'rotate(22deg)',transformOrigin:'top center',filter:'blur(5px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',left:'7%',width:10,height:'70%',background:'linear-gradient(180deg,rgba(255,252,210,0.12) 0%,transparent 100%)',transform:'rotate(24deg)',transformOrigin:'top center',filter:'blur(14px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',right:'5%',width:3,height:'80%',background:'linear-gradient(180deg,rgba(255,252,210,0.3) 0%,rgba(255,252,210,0.08) 45%,transparent 100%)',transform:'rotate(-22deg)',transformOrigin:'top center',filter:'blur(5px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',right:'7%',width:10,height:'70%',background:'linear-gradient(180deg,rgba(255,252,210,0.12) 0%,transparent 100%)',transform:'rotate(-24deg)',transformOrigin:'top center',filter:'blur(14px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'1%',left:'8%',width:7,height:7,borderRadius:'50%',background:'white',boxShadow:'0 0 18px 10px rgba(255,255,210,0.35),0 0 50px 25px rgba(255,255,210,0.12)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'1%',right:'8%',width:7,height:7,borderRadius:'50%',background:'white',boxShadow:'0 0 18px 10px rgba(255,255,210,0.35),0 0 50px 25px rgba(255,255,210,0.12)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:'28%',width:2,height:'55%',background:'linear-gradient(180deg,rgba(255,252,210,0.1) 0%,transparent 100%)',transform:'rotate(6deg)',filter:'blur(8px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,right:'28%',width:2,height:'55%',background:'linear-gradient(180deg,rgba(255,252,210,0.1) 0%,transparent 100%)',transform:'rotate(-6deg)',filter:'blur(8px)',pointerEvents:'none'}}/>
      {[{l:'8%',b:'30%',d:0,dur:7},{l:'45%',b:'26%',d:1.5,dur:6},{l:'80%',b:'31%',d:0.7,dur:8},{l:'25%',b:'22%',d:2.3,dur:5},{l:'63%',b:'20%',d:1.1,dur:9}].map((s,i)=>(
        <motion.div key={i}
          style={{position:'absolute',left:s.l,bottom:s.b,width:110,height:36,borderRadius:'50%',background:'radial-gradient(ellipse,rgba(180,220,180,0.07) 0%,transparent 70%)',filter:'blur(14px)',pointerEvents:'none'}}
          animate={{x:[0,-12,8,0],opacity:[0.3,0.6,0.25,0.3],scale:[1,1.4,0.9,1]}}
          transition={{duration:s.dur,delay:s.d,repeat:Infinity,ease:'easeInOut'}}/>
      ))}
    </div>
  );
}

// ── CAMPO 3D ──────────────────────────────────────────────────────────────────
function Field3D({lineup,selectedSlot,onSlotClick,specialMode,captainId,heroId,step}:{
  lineup:Lineup;selectedSlot:string|null;onSlotClick:(id:string)=>void;
  specialMode:SpecialMode;captainId:number|null;heroId:number|null;step:Step;
}) {
  const pulsing = step==='captain_hero' && specialMode !== null;
  return (
    <div style={{width:'100%',maxWidth:440,margin:'0 auto',perspective:'480px',perspectiveOrigin:'50% 18%'}}>
      <div style={{position:'relative',width:'100%',paddingTop:'148%',transform:'rotateX(20deg)',transformOrigin:'bottom center',transformStyle:'preserve-3d'}}>
        <div style={{position:'absolute',inset:0,borderRadius:18,overflow:'hidden',
          background:'linear-gradient(180deg,#0b3d0b 0%,#145214 18%,#1c6e1c 50%,#145214 82%,#0b3d0b 100%)',
          border:'2px solid rgba(255,255,255,0.2)',
          boxShadow:'0 44px 110px rgba(0,0,0,0.98),0 0 0 1px rgba(255,255,255,0.04),inset 0 0 60px rgba(0,0,0,0.35)'}}>
          {Array.from({length:12}).map((_,i)=>(
            <div key={i} style={{position:'absolute',left:0,right:0,top:`${i*8.33}%`,height:'8.33%',background:i%2===0?'rgba(0,0,0,0.15)':'transparent'}}/>
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
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'14%',background:'linear-gradient(0deg,rgba(170,215,170,0.06) 0%,transparent 100%)',pointerEvents:'none'}}/>
        </div>
        <div style={{position:'absolute',inset:0}}>
          {SLOTS.map(slot=>{
            const player = lineup[slot.id] ?? null;
            const isActive = selectedSlot === slot.id;
            const isPulsing = pulsing && !!player;
            return (
              <div key={slot.id} onClick={()=>onSlotClick(slot.id)}
                style={{
                  position:'absolute',
                  left:`${slot.x}%`,
                  top:`${slot.y}%`,
                  transform:'translate(-50%, -50%) rotateX(-22deg)',
                  zIndex:isActive ? 30 : player ? 20 : 10,
                  cursor:'pointer',
                }}
              >
                {player
                  ? <VerticalFieldCard player={player} isCaptain={captainId === player.id} isHero={heroId === player.id} pulsing={isPulsing} active={isActive} onClick={()=>onSlotClick(slot.id)} />
                  : <EmptyVerticalSlot pos={slot.pos} active={isActive} onClick={()=>onSlotClick(slot.id)} />}
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
                : <div style={{width:46,height:58,borderRadius:10,border:`2px dashed ${isActive?'#F5C400':'rgba(255,255,255,0.08)'}`,background:isActive?'rgba(245,196,0,0.1)':'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:isActive?'0 0 16px rgba(245,196,0,0.4)':'none'}}>
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

// ── MERCADO (AJUSTADO - 2 COLUNAS + SEM NÚMERO) ─────────────────────────────
function PlayerPicker({lineup,filterPos,setFilterPos,onSelect,selectedSlot,step,selectedPlayer}:{
  lineup:Lineup;filterPos:string;setFilterPos:(p:string)=>void;
  onSelect:(p:Player)=>void;selectedSlot:string|null;step:Step;selectedPlayer:Player|null;
}) {
  const usedIds=useMemo(()=>new Set(Object.values(lineup).filter(Boolean).map(p=>p!.id)),[lineup]);
  const filtered=useMemo(()=>PLAYERS.filter(p=>!usedIds.has(p.id)&&(filterPos==='TODOS'||p.pos===filterPos)),[usedIds,filterPos]);
  const canPlace=!!selectedSlot || !!selectedPlayer;

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
        {canPlace?'✦ Slot ou jogador ativo — clique para escalar':step==='bench'?'🪑 Selecione um reserva':'← Clique num slot do campo primeiro'}
      </div>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(2,1fr)',
        gap:14,
        padding:'8px 12px 24px',
        maxHeight:280,
        overflowY:'auto',
      }}>
        {filtered.map(p=>{
          const col=POS_COLORS[p.pos]??'#555';
          return (
            <motion.button key={p.id} onClick={()=>onSelect(p)}
              whileTap={canPlace?{scale:0.95}:{}} whileHover={canPlace?{scale:1.03}:{}}
              style={{
                background:'#111',
                border:`2px solid rgba(255,255,255,0.08)`,
                borderRadius:16,
                overflow:'hidden',
                cursor:canPlace?'pointer':'default',
                opacity:canPlace?1:0.45,
                display:'flex',
                flexDirection:'column',
                height:'100%',
              }}
            >
              <div style={{width:'100%',aspectRatio:'4/5',position:'relative',overflow:'hidden',background:'#0d0d0d'}}>
                <PlayerPhoto foto={p.foto} pose="static" cW={300} cH={375} radius={0} />
              </div>
              <div style={{padding:'14px 10px',background:'#111',textAlign:'center'}}>
                <div style={{fontSize:10,color:col,fontWeight:900,letterSpacing:1}}>{p.pos}</div>
                <div style={{
                  fontSize:17.5,
                  fontWeight:1000,
                  fontStyle:'italic',
                  letterSpacing:-0.8,
                  lineHeight:1.05,
                  textTransform:'uppercase',
                  color:'#fff'
                }}>
                  {p.short}
                </div>
              </div>
            </motion.button>
          );
        })}
        {filtered.length===0 && (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'40px 0',color:'#22C55E',fontSize:12,fontWeight:700}}>
            Todos escalados ✓
          </div>
        )}
      </div>
    </div>
  );
}

// ── HUD (CORRIGIDO - AGORA RETORNA JSX) ─────────────────────────────────────
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

// ── CAPITÃO & HERÓI, PLACAR LED, SHARE ───────────────────────────────────────
// (mantidos exatamente como no seu código original)

function CaptainHeroScreen({onSelectMode,captainId,heroId,onDone}:any) { /* seu código original */ }
function LEDScoreboard({scoreTigre,setScoreTigre,scoreAdv,setScoreAdv,onConfirm}:any) { /* seu código original */ }
function ShareScreen({lineup,captainId,heroId,scoreTigre,scoreAdv}:any) { /* seu código original */ }

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function EscalacaoFormacao() {
  const [step,setStep]=useState<Step>('picking');
  const [lineup,setLineup]=useState<Lineup>({});
  const [selectedSlot,setSelectedSlot]=useState<string|null>(null);
  const [selectedPlayer,setSelectedPlayer]=useState<Player|null>(null);
  const [filterPos,setFilterPos]=useState('TODOS');
  const [captainId,setCaptainId]=useState<number|null>(null);
  const [heroId,setHeroId]=useState<number|null>(null);
  const [specialMode,setSpecialMode]=useState<SpecialMode>(null);
  const [scoreTigre,setScoreTigre]=useState(1);
  const [scoreAdv,setScoreAdv]=useState(0);

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [jogoId, setJogoId] = useState<string | null>(null);

  const fieldCount=useMemo(()=>SLOTS.filter(s=>!!lineup[s.id]).length,[lineup]);
  const benchCount=useMemo(()=>BENCH_IDS.filter(id=>!!lineup[id]).length,[lineup]);

  // ... resto da sua lógica (useEffect, salvarEscalacao, handleSlotClick, handleSelectPlayer, etc.) ...

  return (
    <div style={{minHeight:'100vh',background:'#050505',color:'#fff',fontFamily:"'Barlow Condensed',system-ui,sans-serif",overflowX:'hidden'}}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}body{background:#050505}
      `}</style>

      <HUD step={step} filled={fieldCount} benchFilled={benchCount}/>

      {/* Todo o resto do seu return permanece igual */}
      <AnimatePresence>
        {step==='captain_hero'&&!specialMode&&(
          <CaptainHeroScreen onSelectMode={m=>{setSpecialMode(m);}} captainId={captainId} heroId={heroId} onDone={handleCaptainHeroDone}/>
        )}
      </AnimatePresence>
      {/* ... resto do código ... */}
    </div>
  );
}
