'use client';
/**
 * EscalacaoFormacao — Tigre FC PS5/FIFA26 Edition
 * Jornada completa: Formação → Mercado → Campo → Banco → Capitão/Herói → Palpite → Reveal → Share
 */

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

// ─── Assets ──────────────────────────────────────────────────────────────────
const BASE   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── Types ────────────────────────────────────────────────────────────────────
type Player     = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup     = Record<string, Player | null>;
type Step       = 'formation' | 'picking' | 'bench' | 'captain_hero' | 'score' | 'reveal' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;
type Slot       = { id: string; x: number; y: number; pos: string; label: string };

// ─── Players ─────────────────────────────────────────────────────────────────
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

// ─── Formações ────────────────────────────────────────────────────────────────
const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id:'gk',  x:50, y:87, pos:'GOL', label:'GK'  },
    { id:'rb',  x:82, y:70, pos:'LAT', label:'RB'  },
    { id:'cb1', x:62, y:77, pos:'ZAG', label:'CB'  },
    { id:'cb2', x:38, y:77, pos:'ZAG', label:'CB'  },
    { id:'lb',  x:18, y:70, pos:'LAT', label:'LB'  },
    { id:'dm1', x:35, y:55, pos:'MEI', label:'DM'  },
    { id:'dm2', x:65, y:55, pos:'MEI', label:'DM'  },
    { id:'am',  x:50, y:38, pos:'MEI', label:'AM'  },
    { id:'rw',  x:80, y:24, pos:'ATA', label:'RW'  },
    { id:'lw',  x:20, y:24, pos:'ATA', label:'LW'  },
    { id:'st',  x:50, y:12, pos:'ATA', label:'ST'  },
  ],
  '4-3-3': [
    { id:'gk',  x:50, y:87, pos:'GOL', label:'GK' },
    { id:'rb',  x:82, y:70, pos:'LAT', label:'RB' },
    { id:'cb1', x:62, y:77, pos:'ZAG', label:'CB' },
    { id:'cb2', x:38, y:77, pos:'ZAG', label:'CB' },
    { id:'lb',  x:18, y:70, pos:'LAT', label:'LB' },
    { id:'m1',  x:50, y:52, pos:'MEI', label:'CM' },
    { id:'m2',  x:74, y:44, pos:'MEI', label:'CM' },
    { id:'m3',  x:26, y:44, pos:'MEI', label:'CM' },
    { id:'st',  x:50, y:13, pos:'ATA', label:'CF' },
    { id:'rw',  x:80, y:21, pos:'ATA', label:'RW' },
    { id:'lw',  x:20, y:21, pos:'ATA', label:'LW' },
  ],
  '3-5-2': [
    { id:'gk',  x:50, y:87, pos:'GOL', label:'GK' },
    { id:'cb1', x:50, y:77, pos:'ZAG', label:'CB' },
    { id:'cb2', x:72, y:73, pos:'ZAG', label:'CB' },
    { id:'cb3', x:28, y:73, pos:'ZAG', label:'CB' },
    { id:'rm',  x:88, y:55, pos:'LAT', label:'WB' },
    { id:'lm',  x:12, y:55, pos:'LAT', label:'WB' },
    { id:'m1',  x:50, y:52, pos:'MEI', label:'CM' },
    { id:'m2',  x:68, y:42, pos:'MEI', label:'CM' },
    { id:'m3',  x:32, y:42, pos:'MEI', label:'CM' },
    { id:'st1', x:38, y:16, pos:'ATA', label:'ST' },
    { id:'st2', x:62, y:16, pos:'ATA', label:'ST' },
  ],
  '4-4-2': [
    { id:'gk',  x:50, y:87, pos:'GOL', label:'GK' },
    { id:'rb',  x:84, y:70, pos:'LAT', label:'RB' },
    { id:'cb1', x:62, y:77, pos:'ZAG', label:'CB' },
    { id:'cb2', x:38, y:77, pos:'ZAG', label:'CB' },
    { id:'lb',  x:16, y:70, pos:'LAT', label:'LB' },
    { id:'rm',  x:80, y:48, pos:'MEI', label:'RM' },
    { id:'cm1', x:60, y:52, pos:'MEI', label:'CM' },
    { id:'cm2', x:40, y:52, pos:'MEI', label:'CM' },
    { id:'lm',  x:20, y:48, pos:'MEI', label:'LM' },
    { id:'st1', x:38, y:16, pos:'ATA', label:'ST' },
    { id:'st2', x:62, y:16, pos:'ATA', label:'ST' },
  ],
  '5-3-2': [
    { id:'gk',  x:50, y:87, pos:'GOL', label:'GK' },
    { id:'rb',  x:86, y:68, pos:'LAT', label:'WB' },
    { id:'cb1', x:66, y:75, pos:'ZAG', label:'CB' },
    { id:'cb2', x:50, y:79, pos:'ZAG', label:'CB' },
    { id:'cb3', x:34, y:75, pos:'ZAG', label:'CB' },
    { id:'lb',  x:14, y:68, pos:'LAT', label:'WB' },
    { id:'m1',  x:50, y:52, pos:'MEI', label:'CM' },
    { id:'m2',  x:70, y:44, pos:'MEI', label:'CM' },
    { id:'m3',  x:30, y:44, pos:'MEI', label:'CM' },
    { id:'st1', x:38, y:16, pos:'ATA', label:'ST' },
    { id:'st2', x:62, y:16, pos:'ATA', label:'ST' },
  ],
};

// Banco com posições obrigatórias
const BENCH_SLOTS = [
  { id:'b_gol', pos:'GOL', label:'🧤 Goleiro' },
  { id:'b_zag', pos:'ZAG', label:'🛡️ Zagueiro' },
  { id:'b_lat', pos:'LAT', label:'↔️ Lateral' },
  { id:'b_mei', pos:'MEI', label:'🔮 Meia' },
  { id:'b_ata', pos:'ATA', label:'⚡ Atacante' },
];

const POS_COLORS: Record<string, string> = {
  GOL:'#F5C400', ZAG:'#3B82F6', LAT:'#06B6D4', MEI:'#22C55E', ATA:'#EF4444',
};

// ─────────────────────────────────────────────────────────────────────────────
// UTILITÁRIOS DE FOTO DUPLA
// ─────────────────────────────────────────────────────────────────────────────
// pose='static'      → esquerda (perfil, mercado)
// pose='celebration' → direita (comemoração, campo)
function imgStyle(pose: 'static' | 'celebration'): React.CSSProperties {
  if (pose === 'static') return {
    position:'absolute', top:0, left:0,
    height:'100%', width:'200%', maxWidth:'none',
    objectFit:'cover', objectPosition:'left center',
  };
  // Celebration: foca da cintura para cima, centralizado no card
  // width:200% garante foto dupla; object-position 80% 10% enquadra o rosto
  return {
    position:'absolute', top:'50%', left:'50%',
    height:'130%', width:'200%', maxWidth:'none',
    objectFit:'cover', objectPosition:'80% 10%',
    transform:'translate(-50%, -50%) scale(1.3)',
    transformOrigin:'center top',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STADIUM BG
// ─────────────────────────────────────────────────────────────────────────────
function StadiumBg() {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',background:'linear-gradient(180deg,#010508 0%,#030e09 55%,#061608 100%)'}}>
      <div style={{position:'absolute',bottom:0,left:0,right:0,height:'55%',background:'radial-gradient(ellipse 100% 70% at 50% 100%,rgba(16,80,16,0.4) 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:'7%',right:'7%',height:'42%',background:'linear-gradient(180deg,#040804 0%,#0a120a 60%,transparent 100%)',clipPath:'ellipse(55% 100% at 50% 0%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,left:'7%',right:'7%',height:'36%',backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(12,22,12,0.5) 4px,rgba(12,22,12,0.5) 5px)',opacity:0.7,clipPath:'ellipse(53% 100% at 50% 0%)',pointerEvents:'none'}}/>
      {/* Laterais */}
      <div style={{position:'absolute',top:0,bottom:0,left:0,width:'12%',background:'linear-gradient(90deg,#030803,rgba(5,15,5,0.8) 70%,transparent)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:0,bottom:0,right:0,width:'12%',background:'linear-gradient(270deg,#030803,rgba(5,15,5,0.8) 70%,transparent)',pointerEvents:'none'}}/>
      {/* Refletores top-left */}
      <div style={{position:'absolute',top:'-8%',left:'5%',width:3,height:'80%',background:'linear-gradient(180deg,rgba(255,252,210,0.32) 0%,rgba(255,252,210,0.06) 45%,transparent 100%)',transform:'rotate(22deg)',transformOrigin:'top center',filter:'blur(5px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',left:'7%',width:12,height:'70%',background:'linear-gradient(180deg,rgba(255,252,210,0.12) 0%,transparent 100%)',transform:'rotate(24deg)',transformOrigin:'top center',filter:'blur(16px)',pointerEvents:'none'}}/>
      {/* Refletores top-right */}
      <div style={{position:'absolute',top:'-8%',right:'5%',width:3,height:'80%',background:'linear-gradient(180deg,rgba(255,252,210,0.32) 0%,rgba(255,252,210,0.06) 45%,transparent 100%)',transform:'rotate(-22deg)',transformOrigin:'top center',filter:'blur(5px)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'-8%',right:'7%',width:12,height:'70%',background:'linear-gradient(180deg,rgba(255,252,210,0.12) 0%,transparent 100%)',transform:'rotate(-24deg)',transformOrigin:'top center',filter:'blur(16px)',pointerEvents:'none'}}/>
      {/* Lens flare */}
      <div style={{position:'absolute',top:'1%',left:'8%',width:7,height:7,borderRadius:'50%',background:'white',boxShadow:'0 0 18px 10px rgba(255,255,210,0.38),0 0 50px 26px rgba(255,255,210,0.12)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',top:'1%',right:'8%',width:7,height:7,borderRadius:'50%',background:'white',boxShadow:'0 0 18px 10px rgba(255,255,210,0.38),0 0 50px 26px rgba(255,255,210,0.12)',pointerEvents:'none'}}/>
      {/* Feixes diagonais convergindo */}
      <div style={{position:'absolute',top:'-10%',left:'2%',width:'60%',height:'90%',background:'linear-gradient(135deg,rgba(255,252,210,0.07) 0%,transparent 55%)',pointerEvents:'none',filter:'blur(20px)'}}/>
      <div style={{position:'absolute',top:'-10%',right:'2%',width:'60%',height:'90%',background:'linear-gradient(225deg,rgba(255,252,210,0.07) 0%,transparent 55%)',pointerEvents:'none',filter:'blur(20px)'}}/>
      {/* Halo gramado */}
      <div style={{position:'absolute',bottom:'15%',left:'50%',transform:'translateX(-50%)',width:'80%',height:'30%',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(16,80,16,0.35) 0%,transparent 70%)',filter:'blur(12px)',pointerEvents:'none'}}/>
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

// ─────────────────────────────────────────────────────────────────────────────
// CARD FIFA VERTICAL — usado no campo
// ─────────────────────────────────────────────────────────────────────────────
function FifaCard({ player, isCaptain, isHero, isActive, pulsing, small=false, onClick }: {
  player: Player; isCaptain?: boolean; isHero?: boolean;
  isActive?: boolean; pulsing?: boolean; small?: boolean;
  onClick?: () => void;
}) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
  const W = small ? 38 : 48;
  const H = Math.round(W * 1.35);
  const aura = isCaptain ? '0 0 28px rgba(245,196,0,0.9),0 0 60px rgba(245,196,0,0.4)'
    : isHero     ? '0 0 28px rgba(0,243,255,0.8),0 0 60px rgba(0,243,255,0.3)'
    : `0 0 12px ${col}60`;

  return (
    <motion.button onClick={onClick}
      initial={{ scale:0, opacity:0, y:-16 }}
      animate={{ scale:1, opacity:1, y:0 }}
      whileHover={{ scale:1.1, y:-4 }}
      whileTap={{ scale:0.93 }}
      transition={{ type:'spring', stiffness:420, damping:22 }}
      style={{ position:'relative', background:'none', border:'none', padding:0, cursor:'pointer',
        display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
      {/* Pulse ring */}
      {pulsing && (
        <motion.div animate={{ scale:[1,1.9,1], opacity:[0.9,0,0.9] }} transition={{ duration:0.85, repeat:Infinity }}
          style={{ position:'absolute', inset:-5, borderRadius:8, border:`2px solid ${col}`, pointerEvents:'none' }}/>
      )}
      {/* Badge */}
      {(isCaptain || isHero) && (
        <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
          style={{ position:'absolute', top:-8, right:-6, zIndex:10, background:col, color:'#000',
            fontSize:8, fontWeight:900, padding:'2px 5px', borderRadius:4, lineHeight:1,
            boxShadow:`0 0 12px ${col}cc` }}>
          {isCaptain ? 'C' : '⭐'}
        </motion.div>
      )}
      {/* Card body */}
      <div style={{ width:W, height:H, borderRadius:7, overflow:'hidden',
        border:`1.5px solid ${col}`, background:'#050505',
        boxShadow:aura, position:'relative' }}>
        {/* Foto celebração — pose direita */}
        <div style={{ width:'100%', height:'78%', overflow:'hidden', position:'relative', background:'#0a0a0a' }}>
          <img src={player.foto} alt={player.short}
            onError={e => { (e.target as HTMLImageElement).src = PATA; }}
            style={imgStyle('celebration')} />
          {/* Gradient fade bottom */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%',
            background:'linear-gradient(0deg,#050505 0%,transparent 100%)', pointerEvents:'none' }}/>
          {/* Aura overlay */}
          {(isCaptain || isHero) && (
            <div style={{ position:'absolute', inset:0,
              background:`radial-gradient(circle at 50% 30%,${col}25 0%,transparent 70%)`,
              pointerEvents:'none' }}/>
          )}
        </div>
        {/* Footer strip */}
        <div style={{ position:'absolute', bottom:0, width:'100%', height:'22%',
          background:`linear-gradient(135deg,${col}dd,${col}88)`,
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
          padding:'1px 2px' }}>
          <div style={{ fontSize: small ? 5 : 6, fontWeight:900, color:'#00000080',
            letterSpacing:2, textTransform:'uppercase', lineHeight:1 }}>{player.pos}</div>
          <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
            fontSize: small ? 7 : 9, fontWeight:900, color:'#000',
            textTransform:'uppercase', letterSpacing:-0.3, lineHeight:1,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%', padding:'0 2px' }}>
            {player.short}
          </div>
        </div>
      </div>
      {/* Float shadow */}
      <motion.div animate={{ scaleX:[1,0.6,1], opacity:[0.25,0.1,0.25] }} transition={{ duration:2.5, repeat:Infinity }}
        style={{ width:W-8, height:4, borderRadius:'50%', background:'rgba(0,0,0,0.5)', filter:'blur(3px)', marginTop:3 }}/>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY SLOT
// ─────────────────────────────────────────────────────────────────────────────
function EmptySlot({ pos, label, active, onClick }: { pos:string; label:string; active:boolean; onClick:()=>void }) {
  const col = POS_COLORS[pos] ?? '#888';
  return (
    <motion.button onClick={onClick} whileTap={{ scale:0.88 }}
      animate={active ? { boxShadow:[`0 0 0 0 ${col}40`,`0 0 22px 6px ${col}90`,`0 0 0 0 ${col}40`] } : {}}
      transition={{ duration:0.75, repeat:Infinity }}
      style={{ width:44, height:60, borderRadius:7, cursor:'pointer',
        border:`2px dashed ${active ? col : 'rgba(255,255,255,0.18)'}`,
        background: active ? `${col}22` : 'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
        boxShadow: active ? `0 0 24px ${col}90, 0 0 48px ${col}28` : 'none',
        transition:'border-color 0.2s, background 0.2s' }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L4.5 13.5H11L10 22L20 9.5H13.5L13 2Z"
          stroke={active ? col : 'rgba(255,255,255,0.2)'} strokeWidth="1.5"
          fill={active ? `${col}40` : 'transparent'} strokeLinejoin="round"/>
      </svg>
      <span style={{ fontSize:6.5, fontWeight:900, color: active ? col : 'rgba(255,255,255,0.2)',
        letterSpacing:1.5, textTransform:'uppercase', lineHeight:1 }}>{pos}</span>
      <span style={{ fontSize:5, color: active ? `${col}80` : 'rgba(255,255,255,0.1)',
        letterSpacing:0.5, textTransform:'uppercase' }}>{label}</span>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPO 3D
// ─────────────────────────────────────────────────────────────────────────────
function Field3D({ lineup, slots, activeSlot, activePlayer, onSlotClick, specialMode, captainId, heroId }: {
  lineup:Lineup; slots:Slot[]; activeSlot:string|null; activePlayer:Player|null;
  onSlotClick:(id:string)=>void; specialMode:SpecialMode; captainId:number|null; heroId:number|null;
}) {
  const pulsing = !!specialMode;
  return (
    <div style={{ width:'100%', maxWidth:440, margin:'0 auto', perspective:'400px', perspectiveOrigin:'50% 10%' }}>
      <div style={{ position:'relative', width:'100%', paddingTop:'148%',
        transform:'rotateX(26deg)', transformOrigin:'bottom center', transformStyle:'preserve-3d' }}>
        {/* Gramado */}
        <div style={{ position:'absolute', inset:0, borderRadius:18, overflow:'hidden',
          background:'linear-gradient(180deg,#0b3d0b 0%,#145214 18%,#1c6e1c 50%,#145214 82%,#0b3d0b 100%)',
          border:'2px solid rgba(255,255,255,0.2)',
          boxShadow:'0 44px 110px rgba(0,0,0,0.98),inset 0 0 60px rgba(0,0,0,0.35)' }}>
          {Array.from({length:12}).map((_,i)=>(
            <div key={i} style={{position:'absolute',left:0,right:0,top:`${i*8.33}%`,height:'8.33%',
              background:i%2===0?'rgba(0,0,0,0.14)':'transparent'}}/>
          ))}
          <svg viewBox="0 0 100 148" preserveAspectRatio="none" style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.25}}>
            <rect x="5" y="4" width="90" height="140" stroke="white" strokeWidth="0.8" fill="none" rx="1"/>
            <line x1="5" y1="74" x2="95" y2="74" stroke="white" strokeWidth="0.5"/>
            <circle cx="50" cy="74" r="11" stroke="white" strokeWidth="0.5" fill="none"/>
            <circle cx="50" cy="74" r="0.8" fill="white"/>
            <rect x="26" y="4" width="48" height="15" stroke="white" strokeWidth="0.5" fill="none"/>
            <rect x="26" y="129" width="48" height="15" stroke="white" strokeWidth="0.5" fill="none"/>
            <rect x="36" y="4" width="28" height="6" stroke="white" strokeWidth="0.4" fill="none"/>
            <rect x="36" y="138" width="28" height="6" stroke="white" strokeWidth="0.4" fill="none"/>
          </svg>
          <div style={{position:'absolute',bottom:0,left:0,right:0,height:'12%',
            background:'linear-gradient(0deg,rgba(170,215,170,0.06) 0%,transparent 100%)',pointerEvents:'none'}}/>
        </div>
        {/* Slots */}
        <div style={{ position:'absolute', inset:0 }}>
          {slots.map(slot => {
            const player = lineup[slot.id] ?? null;
            const isActive = activeSlot === slot.id;
            const isPulsing = pulsing && !!player;
            return (
              <div key={slot.id}
                style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`,
                  transform:'translate(-50%,-50%)', zIndex: isActive ? 20 : player ? 10 : 5, cursor:'pointer' }}>
                {player
                  ? <FifaCard player={player} isCaptain={captainId===player.id} isHero={heroId===player.id}
                      pulsing={isPulsing} isActive={isActive} onClick={() => onSlotClick(slot.id)} />
                  : <EmptySlot pos={slot.pos} label={slot.label} active={isActive || (!!activePlayer && activePlayer.pos === slot.pos)}
                      onClick={() => onSlotClick(slot.id)} />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BANCO DE RESERVAS (com posições obrigatórias)
// ─────────────────────────────────────────────────────────────────────────────
function BenchArea({ lineup, activeSlot, activePlayer, onSlotClick, fieldFull }: {
  lineup:Lineup; activeSlot:string|null; activePlayer:Player|null;
  onSlotClick:(id:string)=>void; fieldFull:boolean;
}) {
  const benchCount = BENCH_SLOTS.filter(bs => !!lineup[bs.id]).length;
  const needsAlert = fieldFull && benchCount < 5;

  return (
    <motion.div
      animate={needsAlert ? {
        boxShadow: [
          '0 0 0px rgba(245,196,0,0)',
          '0 0 28px rgba(245,196,0,0.7)',
          '0 0 8px rgba(245,196,0,0.3)',
          '0 0 28px rgba(245,196,0,0.7)',
          '0 0 0px rgba(245,196,0,0)',
        ],
        scale: [1, 1.015, 1, 1.015, 1],
      } : {}}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      style={{ padding:'10px 12px 14px', background: needsAlert ? 'rgba(20,14,0,0.92)' : 'rgba(0,0,0,0.75)',
        backdropFilter:'blur(8px)', borderTop: needsAlert ? '1px solid rgba(245,196,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
        position:'relative' }}>

      {/* Banner "PROFESSOR" — visível só quando alerta ativo */}
      {needsAlert && (
        <motion.div
          initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-8 }}
          style={{ textAlign:'center', marginBottom:8 }}>
          <motion.div
            animate={{ opacity:[0.7,1,0.7] }}
            transition={{ duration:1, repeat:Infinity }}
            style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 14px',
              background:'rgba(245,196,0,0.1)', border:'1px solid rgba(245,196,0,0.5)',
              borderRadius:999 }}>
            <motion.span animate={{ rotate:[0,15,-15,0] }} transition={{ duration:0.6, repeat:Infinity, repeatDelay:1.2 }}
              style={{ fontSize:14 }}>🧑‍🏫</motion.span>
            <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
              fontSize:11, fontWeight:900, color:'#F5C400', textTransform:'uppercase',
              fontStyle:'italic', letterSpacing:0.5, lineHeight:1 }}>
              ESCOLHA SEUS RESERVAS PARA AVANÇAR
            </span>
          </motion.div>
          <div style={{ fontSize:7, color:'rgba(245,196,0,0.4)', marginTop:3, fontWeight:700,
            letterSpacing:2, textTransform:'uppercase' }}>
            Faltam {5 - benchCount} posição{5-benchCount !== 1 ? 'ões' : ''}
          </div>
        </motion.div>
      )}

      <div style={{ fontSize:7, fontWeight:900, color: needsAlert ? '#F5C400' : '#333', letterSpacing:4,
        textTransform:'uppercase', textAlign:'center', marginBottom:10 }}>🪑 Banco de Reservas</div>
      <div style={{ display:'flex', gap:7, justifyContent:'center' }}>
        {BENCH_SLOTS.map(bs => {
          const player = lineup[bs.id] ?? null;
          const isActive = activeSlot === bs.id;
          const needsThis = !!activePlayer && activePlayer.pos === bs.pos;
          const col = player ? (POS_COLORS[player.pos] ?? '#555') : isActive ? '#F5C400' : needsThis ? POS_COLORS[bs.pos] : 'rgba(255,255,255,0.08)';
          return (
            <div key={bs.id} onClick={() => onSlotClick(bs.id)}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, cursor:'pointer' }}>
              {/* Assento */}
              <div style={{ width:50, height:10, borderRadius:'5px 5px 0 0',
                background: player ? `${col}30` : needsThis ? `${col}20` : 'rgba(255,255,255,0.03)',
                border:`1px solid ${col}`, transition:'all 0.2s' }}/>
              {player ? (
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:400 }}
                  style={{ width:50, borderRadius:10, overflow:'hidden',
                    border:`1.5px solid ${col}`, boxShadow:`0 4px 14px rgba(0,0,0,0.8)`, background:'#111' }}>
                  <div style={{ width:'100%', height:55, overflow:'hidden', position:'relative', background:'#0a0a0a' }}>
                    <img src={player.foto} alt={player.short} onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                      style={imgStyle('celebration')} />
                  </div>
                  <div style={{ background:col, textAlign:'center', padding:'2px 3px' }}>
                    <div style={{ fontSize:7, fontWeight:900, color:'#000', textTransform:'uppercase',
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{player.short}</div>
                  </div>
                </motion.div>
              ) : (
                <div style={{ width:50, height:68, borderRadius:10,
                  border:`2px dashed ${isActive || needsThis ? col : 'rgba(255,255,255,0.08)'}`,
                  background: isActive ? 'rgba(245,196,0,0.1)' : needsThis ? `${col}12` : 'rgba(0,0,0,0.4)',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2,
                  boxShadow: isActive || needsThis ? `0 0 14px ${col}60` : 'none',
                  transition:'all 0.2s' }}>
                  <span style={{ fontSize:13, opacity:0.3 }}>{bs.label.split(' ')[0]}</span>
                  <span style={{ fontSize:6, color:col, fontWeight:700, textTransform:'uppercase', opacity:0.6 }}>{bs.pos}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Faltam quais posições */}
      {(() => {
        const missing = BENCH_SLOTS.filter(bs => !lineup[bs.id]);
        if (missing.length === 0) return null;
        return (
          <div style={{ textAlign:'center', marginTop:10, fontSize:8, color:'#333', fontWeight:700 }}>
            Faltam: {missing.map(m => (
              <span key={m.id} style={{ color:POS_COLORS[m.pos], marginLeft:4, fontWeight:900 }}>{m.pos}</span>
            ))}
          </div>
        );
      })()}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MERCADO DE JOGADORES — Grid Elite 2 colunas
// ─────────────────────────────────────────────────────────────────────────────
function PlayerPicker({ lineup, filterPos, setFilterPos, onSelect, activeSlot, activePlayer, step, formation }: {
  lineup:Lineup; filterPos:string; setFilterPos:(p:string)=>void;
  onSelect:(p:Player)=>void; activeSlot:string|null; activePlayer:Player|null;
  step:Step; formation:string;
}) {
  const slots = FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'];
  const usedIds = useMemo(() => new Set(Object.values(lineup).filter(Boolean).map(p => p!.id)), [lineup]);
  const filtered = useMemo(() =>
    PLAYERS.filter(p => !usedIds.has(p.id) && (filterPos === 'TODOS' || p.pos === filterPos)),
    [usedIds, filterPos]
  );

  // Hint inteligente baseado no estado atual
  const hint = activeSlot
    ? `✦ Slot ativo — toque no jogador`
    : activePlayer
    ? `🟡 ${activePlayer.short} selecionado — toque no slot`
    : step === 'bench'
    ? '🪑 Escolha os reservas (posição → banco)'
    : '← Slot ou jogador primeiro';

  const hintCol = (activeSlot || activePlayer) ? '#F5C400' : '#2a2a2a';

  return (
    <div style={{ background:'#080808', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      {/* Filtros */}
      <div style={{ display:'flex', gap:5, padding:'8px 12px', overflowX:'auto' }}>
        {['TODOS','GOL','ZAG','LAT','MEI','ATA'].map(f => (
          <button key={f} onClick={() => setFilterPos(f)}
            style={{ padding:'5px 11px', borderRadius:20, fontSize:8, fontWeight:900, textTransform:'uppercase',
              letterSpacing:1, cursor:'pointer', whiteSpace:'nowrap', flexShrink:0, transition:'all 0.15s',
              background: filterPos===f ? '#F5C400' : 'rgba(255,255,255,0.05)',
              color: filterPos===f ? '#000' : '#444',
              border: filterPos===f ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
            {f}
          </button>
        ))}
      </div>
      {/* Hint */}
      <div style={{ padding:'0 12px 6px', fontSize:9, fontWeight:700, color:hintCol }}>{hint}</div>

      {/* Grid de Elite — 2 colunas */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:9,
        padding:'0 10px 20px', maxHeight:310, overflowY:'auto' }}>
        {filtered.map(p => {
          const col = POS_COLORS[p.pos] ?? '#555';
          const isActive = activePlayer?.id === p.id;
          return (
            <motion.button key={p.id} onClick={() => onSelect(p)}
              whileTap={{ scale:0.93 }} whileHover={{ scale:1.02, y:-2 }}
              style={{ position:'relative', overflow:'hidden', cursor:'pointer', padding:0,
                background: isActive ? 'rgba(245,196,0,0.08)' : '#0f0f0f',
                border: isActive ? '2px solid #F5C400' : '1.5px solid rgba(255,255,255,0.07)',
                borderRadius:14,
                boxShadow: isActive
                  ? '0 0 0 1px rgba(245,196,0,0.25),0 0 24px rgba(245,196,0,0.25),0 8px 24px rgba(0,0,0,0.6)'
                  : '0 4px 16px rgba(0,0,0,0.5)',
                transition:'border 0.15s, box-shadow 0.15s' }}>
              {/* Linha cor posição */}
              <div style={{ height:3, background: isActive ? '#F5C400' : col, opacity: isActive ? 1 : 0.7 }}/>
              {/* Foto ESTÁTICA — pose esquerda */}
              <div style={{ width:'100%', aspectRatio:'3/4', overflow:'hidden', position:'relative', background:'#080808' }}>
                <img src={p.foto} alt={p.short} onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                  style={imgStyle('static')} />
                {/* Gradient fade */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%',
                  background:'linear-gradient(0deg,#0f0f0f 0%,transparent 100%)', pointerEvents:'none' }}/>
                {/* Glow selecionado */}
                {isActive && <div style={{ position:'absolute', inset:0,
                  background:'radial-gradient(circle at 50% 80%,rgba(245,196,0,0.15),transparent 70%)',
                  pointerEvents:'none' }}/>}
                {/* Número watermark */}
                <div style={{ position:'absolute', top:6, right:8,
                  fontFamily:"'Barlow Condensed',Impact,sans-serif",
                  fontSize:30, fontWeight:900, fontStyle:'italic',
                  color:'rgba(255,255,255,0.06)', lineHeight:1, userSelect:'none' }}>{p.num}</div>
              </div>
              {/* Info */}
              <div style={{ padding:'7px 10px 9px' }}>
                <div style={{ fontSize:8, fontWeight:900, color: isActive ? '#F5C400' : col,
                  letterSpacing:3, textTransform:'uppercase', marginBottom:2, fontStyle:'italic' }}>
                  {p.pos} · #{p.num}
                </div>
                <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
                  fontSize:20, fontWeight:900, fontStyle:'italic',
                  color: isActive ? '#F5C400' : '#fff',
                  textTransform:'uppercase', letterSpacing:-0.5, lineHeight:1,
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {p.short}
                </div>
                {p.name !== p.short && (
                  <div style={{ fontSize:9, color:'#333', fontWeight:600, marginTop:2,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {p.name}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'30px 0',
            fontFamily:"'Barlow Condensed',Impact,sans-serif",
            fontSize:18, fontWeight:900, fontStyle:'italic', color:'#22C55E' }}>
            ✓ Todos escalados!
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD
// ─────────────────────────────────────────────────────────────────────────────
function HUD({ step, filled, benchFilled, formation }: {
  step:Step; filled:number; benchFilled:number; formation:string;
}) {
  const steps = [
    {id:'formation',label:'Tática',num:1},
    {id:'picking',label:'Time',num:2},
    {id:'bench',label:'Banco',num:3},
    {id:'captain_hero',label:'Líder',num:4},
    {id:'score',label:'Placar',num:5},
    {id:'reveal',label:'Reveal',num:6},
    {id:'share',label:'Share',num:7},
  ];
  const ci = steps.findIndex(s => s.id === step);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 14px',
      background:'rgba(0,0,0,0.9)', backdropFilter:'blur(10px)',
      borderBottom:'1px solid rgba(245,196,0,0.1)', position:'sticky', top:0, zIndex:50 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <img src={PATA} style={{ width:20, height:20, objectFit:'contain', filter:'drop-shadow(0 0 6px rgba(245,196,0,0.5))' }} alt=""/>
        {step !== 'formation' && (
          <div style={{ fontSize:8, fontWeight:900, color:'#F5C400', letterSpacing:1, textTransform:'uppercase',
            background:'rgba(245,196,0,0.1)', padding:'2px 7px', borderRadius:99, border:'1px solid rgba(245,196,0,0.2)' }}>
            {formation}
          </div>
        )}
      </div>
      <div style={{ display:'flex', gap:2, alignItems:'center' }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display:'flex', alignItems:'center', gap:2 }}>
              <div style={{ width:18, height:18, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background: i<ci ? '#22C55E' : i===ci ? '#F5C400' : 'rgba(255,255,255,0.06)',
                fontSize:7, fontWeight:900, color: i<=ci ? '#000' : '#333',
                border: i===ci ? '1.5px solid #F5C400' : 'none',
                boxShadow: i===ci ? '0 0 8px rgba(245,196,0,0.6)' : 'none' }}>
                {i<ci ? '✓' : s.num}
              </div>
              {i===ci && (
                <span style={{ fontSize:7, fontWeight:900, color:'#F5C400', textTransform:'uppercase', letterSpacing:0.5 }}>
                  {s.label}
                </span>
              )}
            </div>
            {i<steps.length-1 && <div style={{ width:8, height:1, background: i<ci?'#22C55E':'rgba(255,255,255,0.07)' }}/>}
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontSize:9, fontWeight:900, color:'#F5C400', minWidth:28, textAlign:'right' }}>
        {step==='picking' ? `${filled}/11` : step==='bench' ? `${benchFilled}/5` : ''}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SELEÇÃO DE FORMAÇÃO
// ─────────────────────────────────────────────────────────────────────────────
function FormationScreen({ onSelect }: { onSelect:(f:string)=>void }) {
  const [hovered, setHovered] = useState<string|null>(null);
  const options = [
    { key:'4-2-3-1', label:'4-2-3-1', sub:'Favorita de Enderson Moreira', icon:'🎯', badge:'RECOMENDADA' },
    { key:'4-3-3',   label:'4-3-3',   sub:'Ofensiva e veloz',             icon:'⚡', badge:null },
    { key:'3-5-2',   label:'3-5-2',   sub:'Pressão e solidez',            icon:'🛡️', badge:null },
    { key:'4-4-2',   label:'4-4-2',   sub:'Clássica e equilibrada',       icon:'⚖️', badge:null },
    { key:'5-3-2',   label:'5-3-2',   sub:'Defensiva + contra-ataque',    icon:'🔒', badge:null },
  ];
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
      style={{ minHeight:'100vh', background:'linear-gradient(160deg,#050505 0%,#0a0800 50%,#050505 100%)',
        display:'flex', flexDirection:'column', padding:'24px 16px 48px' }}>
      {/* Header */}
      <motion.div initial={{ y:-24, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
        style={{ textAlign:'center', marginBottom:36, marginTop:16 }}>
        <motion.img src={PATA} style={{ width:56, height:56, objectFit:'contain', margin:'0 auto 12px', display:'block',
          filter:'drop-shadow(0 0 20px rgba(245,196,0,0.6))' }}
          animate={{ rotate:[0,3,-3,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}/>
        <div style={{ fontSize:8, fontWeight:900, color:'#F5C400', letterSpacing:6, textTransform:'uppercase', marginBottom:8 }}>
          STEP 1 · ESCOLHA SUA TÁTICA
        </div>
        <h1 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:38, fontWeight:900,
          color:'#fff', textTransform:'uppercase', letterSpacing:-1.5, lineHeight:0.9, margin:'0 0 8px' }}>
          QUAL É SUA<br /><span style={{ color:'#F5C400' }}>FORMAÇÃO?</span>
        </h1>
        <p style={{ fontSize:11, color:'#444', fontWeight:600, margin:0 }}>
          A base tática define o time que você vai escalar
        </p>
      </motion.div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:380, margin:'0 auto', width:'100%' }}>
        {options.map((opt, i) => {
          const isHov = hovered === opt.key;
          return (
            <motion.button key={opt.key}
              initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.15 + i * 0.07, type:'spring', stiffness:200 }}
              onMouseEnter={() => setHovered(opt.key)} onMouseLeave={() => setHovered(null)}
              onClick={() => onSelect(opt.key)}
              whileTap={{ scale:0.97 }}
              style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderRadius:18, cursor:'pointer',
                background: i===0 ? 'linear-gradient(135deg,#1a1200,#2a1e00)' : isHov ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                border: i===0 ? '1.5px solid rgba(245,196,0,0.5)' : isHov ? '1.5px solid rgba(255,255,255,0.12)' : '1.5px solid rgba(255,255,255,0.05)',
                boxShadow: i===0 ? '0 0 30px rgba(245,196,0,0.12)' : 'none',
                transition:'all 0.15s' }}>
              <span style={{ fontSize:26 }}>{opt.icon}</span>
              <div style={{ flex:1, textAlign:'left' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                  <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
                    fontSize:22, fontWeight:900, color: i===0 ? '#F5C400' : '#fff',
                    textTransform:'uppercase', letterSpacing:-0.5, lineHeight:1 }}>{opt.label}</span>
                  {opt.badge && (
                    <span style={{ fontSize:6, fontWeight:900, color:'#000', background:'#F5C400',
                      padding:'2px 5px', borderRadius:4, letterSpacing:1, textTransform:'uppercase' }}>
                      {opt.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize:10, color: i===0 ? 'rgba(245,196,0,0.6)' : '#333', fontWeight:600 }}>
                  {opt.sub}
                </div>
              </div>
              <div style={{ fontSize:16, color: i===0 ? '#F5C400' : '#2a2a2a' }}>›</div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAPITÃO & HERÓI
// ─────────────────────────────────────────────────────────────────────────────
function CaptainHeroScreen({ onSelectMode, captainId, heroId, onDone, lineup }: {
  onSelectMode:(m:SpecialMode)=>void; captainId:number|null; heroId:number|null;
  onDone:()=>void; lineup:Lineup;
}) {
  const cap  = captainId ? PLAYERS.find(p=>p.id===captainId) : null;
  const hero = heroId    ? PLAYERS.find(p=>p.id===heroId)    : null;
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:100,
        background:'linear-gradient(180deg,#000 0%,#060200 50%,#000 100%)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:22 }}>
      {/* Stars */}
      <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
        {Array.from({length:55}).map((_,i)=>(
          <motion.div key={i} style={{ position:'absolute', width:1.5, height:1.5, borderRadius:'50%',
            background:'white', left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, opacity:0 }}
            animate={{ opacity:[0,0.9,0], scale:[0,1.2,0] }}
            transition={{ duration:Math.random()*3+1, delay:Math.random()*5, repeat:Infinity }}/>
        ))}
      </div>

      <motion.div initial={{ y:-30, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.2 }}
        style={{ textAlign:'center', marginBottom:28, zIndex:1 }}>
        <div style={{ fontSize:8, fontWeight:900, color:'#F5C400', letterSpacing:6,
          textTransform:'uppercase', marginBottom:8 }}>STEP 4 · GAMIFICAÇÃO</div>
        <h2 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:34, fontWeight:900,
          color:'#fff', textTransform:'uppercase', letterSpacing:-1, lineHeight:1, margin:'0 0 8px' }}>
          CAPITÃO<br /><span style={{ color:'#F5C400' }}>&amp; HERÓI</span>
        </h2>
        <div style={{ fontSize:10, color:'#333', fontWeight:600, display:'flex', gap:16, justifyContent:'center' }}>
          <span>©  Capitão = <strong style={{ color:'#F5C400' }}>×2 pts</strong></span>
          <span>⭐ Herói = <strong style={{ color:'#00F3FF' }}>+10 pts</strong></span>
        </div>
      </motion.div>

      {[
        { label:'CAPITÃO', done:cap, doneLabel:cap?.short, delay:0.3, col:'#F5C400', icon:'©', desc:'Seus pontos são DOBRADOS', mode:'CAPTAIN' as SpecialMode },
        { label:'HERÓI',   done:hero, doneLabel:hero?.short, delay:0.5, col:'#00F3FF', icon:'⭐', desc:'Acerte e ganhe +10 pts extras', mode:'HERO' as SpecialMode },
      ].map((b,i) => (
        <motion.div key={i} initial={{ y:-160, opacity:0 }} animate={{ y:0, opacity:1 }}
          transition={{ type:'spring', stiffness:175, damping:16, delay:b.delay }}
          style={{ position:'relative', zIndex:1, width:'100%', maxWidth:320, marginBottom:12 }}>
          {/* Meteor trail */}
          {!b.done && ['-44px','-30px','-16px'].map((t,j) => (
            <motion.div key={j} animate={{ opacity:[0.7,0], scaleY:[1,0.2] }}
              transition={{ duration:0.9, delay:b.delay+j*0.04, repeat:Infinity, repeatDelay:2.2 }}
              style={{ position:'absolute', top:t, left:'50%', transform:'translateX(-50%)',
                width:3, height:18, borderRadius:2,
                background:`linear-gradient(180deg,transparent,${b.col})` }}/>
          ))}
          <motion.button onClick={() => onSelectMode(b.mode)} whileTap={{ scale:0.95 }}
            animate={!b.done ? { boxShadow:[`0 0 14px ${b.col}40`,`0 0 40px ${b.col}90`,`0 0 14px ${b.col}40`] } : {}}
            transition={{ duration:1.6, repeat:Infinity }}
            style={{ width:'100%', padding:'16px', borderRadius:18,
              background: b.done ? `${b.col}18` : `linear-gradient(135deg,${b.col},${b.col}bb)`,
              border: b.done ? `2px solid ${b.col}` : 'none',
              color: b.done ? b.col : '#000', fontSize:13, fontWeight:900,
              textTransform:'uppercase', letterSpacing:2, cursor:'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
            {/* Mini card do jogador escolhido */}
            {b.done ? (
              <>
                <div style={{ width:28, height:38, borderRadius:5, overflow:'hidden',
                  border:`1.5px solid ${b.col}`, flexShrink:0, position:'relative', background:'#050505' }}>
                  <img src={b.done.foto} alt={b.done.short} onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                    style={imgStyle('celebration')} />
                </div>
                <span>✓ {b.label}: {b.doneLabel}</span>
              </>
            ) : (
              <>
                <span style={{ fontSize:22 }}>{b.icon}</span>
                <span>ESCOLHER {b.label}</span>
              </>
            )}
          </motion.button>
          <div style={{ textAlign:'center', fontSize:8, color:'#333', marginTop:4 }}>{b.desc}</div>
        </motion.div>
      ))}

      <AnimatePresence>
        {captainId && heroId && (
          <motion.div initial={{ opacity:0, scale:0.85, y:16 }} animate={{ opacity:1, scale:1, y:0 }}
            style={{ width:'100%', maxWidth:320, zIndex:1, marginTop:8 }}>
            <button onClick={onDone}
              style={{ width:'100%', padding:'16px', borderRadius:18,
                background:'linear-gradient(135deg,#22C55E,#16A34A)', border:'none',
                color:'#fff', fontSize:13, fontWeight:900, textTransform:'uppercase',
                letterSpacing:2, cursor:'pointer', boxShadow:'0 8px 24px rgba(34,197,94,0.4)' }}>
              PRÓXIMO → CRAVAR PALPITE ⚽
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLACAR LED
// ─────────────────────────────────────────────────────────────────────────────
function LEDScoreboard({ scoreTigre, setScoreTigre, scoreAdv, setScoreAdv, onConfirm }: {
  scoreTigre:number; setScoreTigre:(n:number)=>void;
  scoreAdv:number; setScoreAdv:(n:number)=>void; onConfirm:()=>void;
}) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:100, background:'#000',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%',
        background:'radial-gradient(ellipse at 50% 0%,rgba(245,196,0,0.07) 0%,transparent 70%)', pointerEvents:'none' }}/>

      <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
        style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ fontSize:8, fontWeight:900, color:'#F5C400', letterSpacing:5, textTransform:'uppercase', marginBottom:6 }}>
          STEP 5 · PALPITE
        </div>
        <h2 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:30, fontWeight:900,
          color:'#fff', textTransform:'uppercase', letterSpacing:-1, lineHeight:1, margin:'0 0 6px' }}>
          CRAVE O RESULTADO
        </h2>
        <div style={{ fontSize:10, color:'#444', fontWeight:600 }}>
          Placar exato = <strong style={{ color:'#F5C400' }}>+15 pts</strong> · Vencedor certo = <strong style={{ color:'#22C55E' }}>+5 pts</strong>
        </div>
      </motion.div>

      <motion.div initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.2, type:'spring', stiffness:200 }}
        style={{ width:'100%', maxWidth:360, marginBottom:28 }}>
        <div style={{ background:'linear-gradient(145deg,#150900,#211100)', border:'2px solid rgba(245,196,0,0.3)',
          borderRadius:20, padding:'18px 14px', boxShadow:'0 0 40px rgba(245,196,0,0.12),inset 0 0 20px rgba(0,0,0,0.5)' }}>
          {/* LED bar */}
          <div style={{ display:'flex', justifyContent:'center', gap:3, marginBottom:14 }}>
            {Array.from({length:14}).map((_,i) => (
              <motion.div key={i} animate={{ opacity:[0.25,1,0.25] }} transition={{ duration:0.7, delay:i*0.05, repeat:Infinity }}
                style={{ width:5, height:5, borderRadius:1, background:'#F5C400' }}/>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8 }}>
            {/* Novo */}
            <div style={{ flex:1, textAlign:'center' }}>
              <img src={ESCUDO} style={{ width:44, height:44, objectFit:'contain',
                filter:'drop-shadow(0 0 8px rgba(245,196,0,0.5))', margin:'0 auto 6px', display:'block' }}/>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:10, fontWeight:900, color:'#F5C400', textTransform:'uppercase' }}>NOVO</div>
            </div>
            {/* Score controls */}
            <div style={{ display:'flex', gap:10 }}>
              {[{val:scoreTigre,set:setScoreTigre,col:'#F5C400'},{val:scoreAdv,set:setScoreAdv,col:'#666'}].map((s,i) => (
                <React.Fragment key={i}>
                  {i===1 && <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:18, fontWeight:900, color:'rgba(245,196,0,0.2)', alignSelf:'center', fontStyle:'italic' }}>×</div>}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                    <button onClick={() => s.set(Math.min(9,s.val+1))}
                      style={{ width:32, height:32, borderRadius:8, background:`${s.col}12`, border:`1px solid ${s.col}30`,
                        color:s.col, fontSize:18, fontWeight:900, cursor:'pointer' }}>+</button>
                    <div style={{ fontFamily:"'Courier New',monospace", fontSize:52, fontWeight:900, color:s.col,
                      textShadow:`0 0 28px ${s.col}cc`, lineHeight:1,
                      background:'rgba(0,0,0,0.8)', borderRadius:8, padding:'4px 12px',
                      border:`1px solid ${s.col}18` }}>{s.val}</div>
                    <button onClick={() => s.set(Math.max(0,s.val-1))}
                      style={{ width:32, height:32, borderRadius:8, background:`${s.col}06`, border:`1px solid ${s.col}15`,
                        color:'#333', fontSize:18, fontWeight:900, cursor:'pointer' }}>−</button>
                  </div>
                </React.Fragment>
              ))}
            </div>
            {/* Adversário */}
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ width:44, height:44, margin:'0 auto 6px', background:'rgba(255,255,255,0.04)',
                borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:26 }}>⚽</span>
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:10, fontWeight:900, color:'#444', textTransform:'uppercase' }}>ADV</div>
            </div>
          </div>
          {/* LED bar bottom */}
          <div style={{ display:'flex', justifyContent:'center', gap:3, marginTop:14 }}>
            {Array.from({length:14}).map((_,i) => (
              <motion.div key={i} animate={{ opacity:[0.25,1,0.25] }} transition={{ duration:0.7, delay:(13-i)*0.05, repeat:Infinity }}
                style={{ width:5, height:5, borderRadius:1, background:'#F5C400' }}/>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.button initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.35 }}
        onClick={onConfirm} whileTap={{ scale:0.96 }}
        style={{ width:'100%', maxWidth:360, padding:'16px', borderRadius:18,
          background:'linear-gradient(135deg,#F5C400,#D4A200)', border:'none',
          color:'#000', fontSize:13, fontWeight:900, textTransform:'uppercase', letterSpacing:2, cursor:'pointer',
          boxShadow:'0 8px 28px rgba(245,196,0,0.35)' }}>
        🎯 CRAVAR PALPITE → VER MEU TIME
      </motion.button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PACK OPENING REVEAL
// ─────────────────────────────────────────────────────────────────────────────
function PackReveal({ lineup, formation, captainId, heroId, onContinue }: {
  lineup:Lineup; formation:string; captainId:number|null; heroId:number|null; onContinue:()=>void;
}) {
  const [phase, setPhase] = useState<'flash'|'cards'|'done'>('flash');
  const slots = FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'];
  const players = slots.map(s => lineup[s.id]).filter(Boolean) as Player[];

  React.useEffect(() => {
    // Flash → cards → done
    const t1 = setTimeout(() => setPhase('cards'), 900);
    const t2 = setTimeout(() => setPhase('done'), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:100, background:'#000',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
      {/* Flash */}
      <AnimatePresence>
        {phase === 'flash' && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:[0,1,1,0] }}
            transition={{ duration:0.9, times:[0,0.2,0.8,1] }}
            style={{ position:'absolute', inset:0, background:'radial-gradient(circle,#F5C400,#FF8C00,#000)',
              zIndex:10, pointerEvents:'none' }}/>
        )}
      </AnimatePresence>

      {/* Title */}
      <motion.div initial={{ scale:3, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ delay:0.5, type:'spring', stiffness:200 }}
        style={{ textAlign:'center', marginBottom:28, zIndex:2 }}>
        <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:42, fontWeight:900,
          color:'#F5C400', textTransform:'uppercase', letterSpacing:-2, lineHeight:0.9,
          textShadow:'0 0 40px rgba(245,196,0,0.8)' }}>
          TIME
        </div>
        <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:18, fontWeight:900,
          color:'#fff', textTransform:'uppercase', letterSpacing:4 }}>CONFIRMADO</div>
      </motion.div>

      {/* Cards fan */}
      <div style={{ display:'flex', gap: players.length > 7 ? 4 : 8, justifyContent:'center',
        flexWrap:'wrap', maxWidth:340, marginBottom:24 }}>
        {players.map((p, i) => (
          <motion.div key={p.id}
            initial={{ y:-200, rotate: (i-5)*8, opacity:0 }}
            animate={{ y:0, rotate: phase==='cards' ? (i-5)*3 : 0, opacity:1 }}
            transition={{ delay:0.6 + i * 0.08, type:'spring', stiffness:200, damping:18 }}>
            <FifaCard player={p} isCaptain={captainId===p.id} isHero={heroId===p.id} small />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {phase === 'done' && (
          <motion.button initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            onClick={onContinue} whileTap={{ scale:0.96 }}
            style={{ padding:'16px 36px', borderRadius:18,
              background:'linear-gradient(135deg,#F5C400,#D4A200)', border:'none',
              color:'#000', fontSize:14, fontWeight:900, textTransform:'uppercase', letterSpacing:2, cursor:'pointer',
              boxShadow:'0 8px 28px rgba(245,196,0,0.4)' }}>
            🏆 VER MEU CARD COMPLETO
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARE SCREEN — Story 9:16
// ─────────────────────────────────────────────────────────────────────────────
function ShareScreen({ lineup, formation, captainId, heroId, scoreTigre, scoreAdv, onReset }: {
  lineup:Lineup; formation:string; captainId:number|null; heroId:number|null;
  scoreTigre:number; scoreAdv:number; onReset:()=>void;
}) {
  const [copied, setCopied]     = useState(false);
  const [dl, setDl]             = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const cardRef                 = useRef<HTMLDivElement>(null);

  const cap  = captainId ? PLAYERS.find(p=>p.id===captainId) : null;
  const hero = heroId    ? PLAYERS.find(p=>p.id===heroId)    : null;
  const slots = FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'];

  const rows = [
    slots.filter(s=>s.pos==='ATA').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    slots.filter(s=>s.pos==='MEI').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    slots.filter(s=>s.pos==='ZAG'||s.pos==='LAT').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    slots.filter(s=>s.pos==='GOL').map(s=>lineup[s.id]).filter(Boolean) as Player[],
  ].filter(r=>r.length>0);

  const shareText = encodeURIComponent(`🐯 Escalei meu time no Tigre FC!\nFormação: ${formation}\nPalpite: Novorizontino ${scoreTigre} × ${scoreAdv}\nVocê consegue fazer melhor?\nonovorizontino.com.br/tigre-fc`);

  // Supabase upsert
  const handleSave = useCallback(async () => {
    if (saved) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await supabase.from('tigre_fc_usuarios')
          .select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) {
          await supabase.from('tigre_fc_escalacoes').upsert({
            usuario_id: u.id,
            formacao: formation,
            lineup_json: lineup,
            capitan_id: captainId,
            heroi_id: heroId,
            palpite_tigre: scoreTigre,
            palpite_adv: scoreAdv,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'usuario_id' });
          setSaved(true);
        }
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [lineup, formation, captainId, heroId, scoreTigre, scoreAdv, saved]);

  // Auto-save ao montar
  React.useEffect(() => { handleSave(); }, []);

  const handleDownload = async () => {
    setDl(true);
    try {
      // Garante crossOrigin em todas as imagens do card antes de capturar
      const el = document.getElementById('tfc-story-card');
      if (!el) { setDl(false); return; }
      el.querySelectorAll('img').forEach(img => {
        if (!img.crossOrigin) img.crossOrigin = 'anonymous';
        // Força reload com cache-bust para evitar taint
        if (!img.src.includes('crossorigin') && !img.src.startsWith('data:')) {
          img.src = img.src.includes('?') ? img.src + '&_cb=1' : img.src + '?_cb=1';
        }
      });
      // Aguarda imagens carregarem
      await Promise.allSettled(
        Array.from(el.querySelectorAll('img')).map(img =>
          img.complete ? Promise.resolve() : new Promise(res => { img.onload = img.onerror = res; })
        )
      );

      // Tenta html-to-image primeiro (melhor suporte a CORS)
      let blob: Blob | null = null;
      try {
        const { toPng } = await import('html-to-image');
        const dataUrl = await toPng(el, {
          pixelRatio: 2,
          backgroundColor: '#050505',
          style: { borderRadius:'0' }, // evita corte no Safari
          cacheBust: true,
          skipFonts: false,
          includeQueryParams: true,
        });
        const res = await fetch(dataUrl);
        blob = await res.blob();
      } catch {
        // Fallback: html2canvas
        const { default: h2c } = await import('html2canvas');
        const canvas = await h2c(el, { scale:2, backgroundColor:'#050505', useCORS:true, allowTaint:false });
        blob = await new Promise<Blob|null>(res => canvas.toBlob(res));
      }

      if (!blob) { setDl(false); return; }

      const file = new File([blob], 'tigre-fc-meu-time.png', { type:'image/png' });

      // Web Share API (prioridade mobile)
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files:[file] })) {
        await navigator.share({
          title: 'Meu Time — Tigre FC Fantasy League 🐯',
          text: `🐯 Escalei meu time! Formação ${formation} · Palpite: ${scoreTigre}×${scoreAdv}
onovorizontino.com.br/tigre-fc`,
          files: [file],
        });
      } else {
        // Fallback desktop: download direto
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'tigre-fc-meu-time.png'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      }
    } catch (err) {
      console.warn('[TigreFC] Share error:', err);
      // Último fallback: copia link
      await navigator.clipboard.writeText('https://onovorizontino.com.br/tigre-fc').catch(()=>{});
      setCopied(true); setTimeout(()=>setCopied(false), 2500);
    }
    setDl(false);
  };

  const SHARE_BTNS = [
    { l:'WhatsApp', c:'#25D366', h:`https://wa.me/?text=${shareText}`, i:'💬' },
    { l:'Instagram',c:'#E1306C', h:'https://instagram.com',             i:'📸' },
    { l:'Facebook', c:'#1877F2', h:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://onovorizontino.com.br/tigre-fc')}`, i:'👥' },
    { l:'Twitter',  c:'#1DA1F2', h:`https://twitter.com/intent/tweet?text=${shareText}`, i:'🐦' },
  ];

  return (
    <div style={{ padding:'14px 14px 60px', minHeight:'100vh', background:'#050505' }}>
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} style={{ textAlign:'center', marginBottom:16 }}>
        <div style={{ fontSize:8, fontWeight:900, color:'#22C55E', letterSpacing:5, textTransform:'uppercase', marginBottom:4 }}>
          {saved ? '✓ Time salvo!' : saving ? '⏳ Salvando...' : 'STEP 7 · GLORIFY'}
        </div>
        <h2 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:26, fontWeight:900,
          color:'#fff', textTransform:'uppercase', letterSpacing:-0.5, margin:0 }}>
          SALVE &amp; DESAFIE<br /><span style={{ color:'#F5C400' }}>A GALERA 🐯</span>
        </h2>
      </motion.div>

      {/* Story Card 9:16 */}
      <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}>
        {/* Wrapper de scroll — exibe o card responsivo na tela */}
        <div style={{ width:'100%', maxWidth:360, margin:'0 auto', aspectRatio:'9/16',
          overflow:'hidden', borderRadius:20, boxShadow:'0 0 50px rgba(245,196,0,0.12)' }}>
        {/* Card interno com dimensões FIXAS para html-to-image/html2canvas — 9:16 exacto */}
        <div id="tfc-story-card" ref={cardRef}
          style={{ width:360, height:640, margin:'0 auto',
            background:'linear-gradient(160deg,#080700 0%,#101000 30%,#0a1400 60%,#050505 100%)',
            borderRadius:20, overflow:'hidden', border:'1px solid rgba(245,196,0,0.28)',
            boxShadow:'0 0 50px rgba(245,196,0,0.12)',
            fontFamily:"'Barlow Condensed',Impact,sans-serif",
            display:'flex', flexDirection:'column', position:'relative' }}>
          {/* Noise overlay */}
          <div style={{ position:'absolute', inset:0, opacity:0.03, pointerEvents:'none',
            backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.8'/%3E%3C/svg%3E\")" }}/>
          {/* Gold lines */}
          <div style={{ height:3, background:'linear-gradient(90deg,#B8900A,#F5C400,#B8900A)' }}/>
          <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(245,196,0,0.2),transparent)' }}/>

          {/* Header */}
          <div style={{ padding:'12px 16px 10px', display:'flex', alignItems:'center', gap:10,
            background:'linear-gradient(90deg,rgba(245,196,0,0.08),transparent)',
            borderBottom:'1px solid rgba(245,196,0,0.1)' }}>
            <img src={ESCUDO} style={{ width:40, height:40, objectFit:'contain',
              filter:'drop-shadow(0 0 10px rgba(245,196,0,0.6))' }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:6.5, fontWeight:900, color:'#F5C400', letterSpacing:4, textTransform:'uppercase' }}>
                TIGRE FC · FANTASY LEAGUE
              </div>
              <div style={{ fontSize:18, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:-0.5, lineHeight:1.1 }}>
                MEU TIME<br /><span style={{ color:'#F5C400' }}>ESTÁ PRONTO! 🐯</span>
              </div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:8, color:'rgba(245,196,0,0.4)', fontWeight:700, textTransform:'uppercase' }}>FORMAÇÃO</div>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
                fontSize:20, fontWeight:900, color:'#F5C400', letterSpacing:-0.5 }}>{formation}</div>
            </div>
          </div>

          {/* Formação mini cards */}
          <div style={{ flex:1, padding:'12px 12px 0', background:'rgba(0,0,0,0.1)',
            display:'flex', flexDirection:'column', justifyContent:'center', gap:8 }}>
            {rows.map((row, ri) => (
              <div key={ri} style={{ display:'flex', gap:5, justifyContent:'center' }}>
                {row.map(player => {
                  const isCap = player.id === captainId;
                  const isHero = player.id === heroId;
                  const col = isCap ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#555');
                  return (
                    <div key={player.id} style={{ textAlign:'center', position:'relative' }}>
                      {(isCap||isHero) && (
                        <div style={{ position:'absolute', top:-6, right:-4, background:col, color:'#000',
                          fontSize:6, fontWeight:900, padding:'1px 3px', borderRadius:3, zIndex:2, lineHeight:1 }}>
                          {isCap?'C':'⭐'}
                        </div>
                      )}
                      <div style={{ width:36, height:48, borderRadius:7, overflow:'hidden',
                        border:`1.5px solid ${col}`, boxShadow:`0 0 8px ${col}60`, background:'#050505',
                        position:'relative' }}>
                        {/* Foto celebração no share card */}
                        <div style={{ width:'100%', height:'75%', overflow:'hidden', position:'relative' }}>
                          <img src={player.foto} alt={player.short}
                            onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                            style={imgStyle('celebration')} />
                        </div>
                        <div style={{ background:col, textAlign:'center', padding:'2px 1px',
                          position:'absolute', bottom:0, width:'100%' }}>
                          <div style={{ fontSize:5.5, fontWeight:900, color:'#000',
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', lineHeight:1 }}>
                            {player.short}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Stats strip */}
          <div style={{ display:'flex', borderTop:'1px solid rgba(245,196,0,0.08)',
            borderBottom:'1px solid rgba(245,196,0,0.08)', background:'rgba(0,0,0,0.3)' }}>
            {[
              { label:'Capitão', value:cap?.short??'—', icon:'©', col:'#F5C400' },
              { label:'Herói',   value:hero?.short??'—', icon:'⭐', col:'#00F3FF' },
              { label:'Palpite', value:`${scoreTigre}×${scoreAdv}`, icon:'🎯', col:'#22C55E' },
            ].map(item => (
              <div key={item.label} style={{ flex:1, textAlign:'center', padding:'9px 3px',
                borderRight:'1px solid rgba(245,196,0,0.07)' }}>
                <div style={{ fontSize:14, marginBottom:1 }}>{item.icon}</div>
                <div style={{ fontSize:12, fontWeight:900, color:item.col, lineHeight:1 }}>{item.value}</div>
                <div style={{ fontSize:6, color:'#333', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginTop:1 }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* CTA copy */}
          <div style={{ padding:'12px 16px', textAlign:'center', background:'rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize:14, fontWeight:900, color:'#fff', textTransform:'uppercase', lineHeight:1.2, marginBottom:5 }}>
              VOCÊ CONSEGUE<br /><span style={{ color:'#F5C400' }}>FAZER MELHOR?</span>
            </div>
            <div style={{ fontSize:8.5, color:'#2a2a2a', fontWeight:600 }}>onovorizontino.com.br/tigre-fc</div>
            <div style={{ fontSize:7, color:'#141414', fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginTop:2 }}>
              Série B 2026 · #TigreFC · #NovFC
            </div>
          </div>
          <div style={{ height:3, background:'linear-gradient(90deg,#B8900A,#F5C400,#B8900A)' }}/>
        </div>
        </div>{/* /wrapper */}
      </motion.div>

      {/* Botões */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        style={{ marginTop:14 }}>
        <motion.button onClick={handleDownload} whileTap={{ scale:0.96 }}
          style={{ width:'100%', maxWidth:360, margin:'0 auto 10px', display:'block', padding:'15px',
            borderRadius:16, background:'linear-gradient(135deg,#F5C400,#D4A200)', border:'none',
            color:'#000', fontSize:12, fontWeight:900, textTransform:'uppercase', letterSpacing:1.5,
            cursor:'pointer', boxShadow:'0 8px 24px rgba(245,196,0,0.3)' }}>
          {dl ? '⏳ Gerando...' : '📥 SALVAR STORY (9:16) & COMPARTILHAR'}
        </motion.button>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, maxWidth:360, margin:'0 auto 9px' }}>
          {SHARE_BTNS.map(b => (
            <motion.a key={b.l} href={b.h} target="_blank" rel="noreferrer" whileTap={{ scale:0.91 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'9px 3px',
                borderRadius:12, background:`${b.c}12`, border:`1px solid ${b.c}35`, textDecoration:'none', cursor:'pointer' }}>
              <span style={{ fontSize:17 }}>{b.i}</span>
              <span style={{ fontSize:6.5, fontWeight:900, color:b.c, textTransform:'uppercase', letterSpacing:0.5 }}>{b.l}</span>
            </motion.a>
          ))}
        </div>

        <motion.button onClick={async()=>{ await navigator.clipboard.writeText('https://onovorizontino.com.br/tigre-fc'); setCopied(true); setTimeout(()=>setCopied(false),2500); }}
          whileTap={{ scale:0.96 }}
          style={{ width:'100%', maxWidth:360, margin:'0 auto 10px', display:'block', padding:'11px', borderRadius:12,
            background: copied?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.04)',
            border:`1px solid ${copied?'rgba(34,197,94,0.4)':'rgba(255,255,255,0.07)'}`,
            color:copied?'#22C55E':'#333', fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:1, cursor:'pointer' }}>
          {copied ? '✓ Link copiado!' : '🔗 Copiar link'}
        </motion.button>

        {/* Reset */}
        <motion.button onClick={onReset} whileTap={{ scale:0.96 }}
          style={{ width:'100%', maxWidth:360, margin:'0 auto', display:'block', padding:'14px', borderRadius:16,
            background:'transparent', border:'1px solid rgba(255,255,255,0.08)',
            color:'#333', fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:1.5, cursor:'pointer' }}>
          🔄 ESCALAR NOVO TIME
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function EscalacaoFormacao() {
  const [step,         setStep]         = useState<Step>('formation');
  const [formation,    setFormation]    = useState('4-2-3-1');
  const [lineup,       setLineup]       = useState<Lineup>({});
  const [activeSlot,   setActiveSlot]   = useState<string|null>(null);
  const [activePlayer, setActivePlayer] = useState<Player|null>(null);
  const [filterPos,    setFilterPos]    = useState('TODOS');
  const [captainId,    setCaptainId]    = useState<number|null>(null);
  const [heroId,       setHeroId]       = useState<number|null>(null);
  const [specialMode,  setSpecialMode]  = useState<SpecialMode>(null);
  const [scoreTigre,   setScoreTigre]   = useState(1);
  const [scoreAdv,     setScoreAdv]     = useState(0);

  const slots      = useMemo(() => FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'], [formation]);
  const fieldCount = useMemo(() => slots.filter(s => !!lineup[s.id]).length, [lineup, slots]);
  const benchCount = useMemo(() => BENCH_SLOTS.filter(bs => !!lineup[bs.id]).length, [lineup]);
  const isFieldFull = fieldCount === 11;
  const isBenchFull = benchCount === 5;

  // Reset completo do ciclo
  const handleReset = useCallback(() => {
    setStep('formation'); setFormation('4-2-3-1'); setLineup({});
    setActiveSlot(null); setActivePlayer(null); setFilterPos('TODOS');
    setCaptainId(null); setHeroId(null); setSpecialMode(null);
    setScoreTigre(1); setScoreAdv(0);
  }, []);

  // Escolhe formação
  const handleFormation = useCallback((f: string) => {
    setFormation(f);
    setLineup({});
    setStep('picking');
    confetti({ particleCount:60, spread:50, origin:{y:0.5}, colors:['#F5C400','#fff'] });
  }, []);

  // Executa escalação
  const executarEscalacao = useCallback((slotId: string, player: Player) => {
    setLineup(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { if (next[k]?.id === player.id) next[k] = null; });
      next[slotId] = player;
      return next;
    });
    setActiveSlot(null);
    setActivePlayer(null);
    setTimeout(() => {
      setLineup(current => {
        const sl = FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'];
        const nf = sl.filter(s => !!current[s.id]).length;
        const nb = BENCH_SLOTS.filter(bs => !!current[bs.id]).length;
        if (step === 'picking' && nf === 11) {
          confetti({ particleCount:90, spread:65, origin:{y:0.5}, colors:['#F5C400','#fff','#22C55E'] });
          setStep('bench');
        } else if (step === 'bench' && nb === 5) {
          confetti({ particleCount:130, spread:80, origin:{y:0.4}, colors:['#F5C400','#fff','#EF4444'] });
          setStep('captain_hero');
        }
        return current;
      });
    }, 350);
  }, [step, formation]);

  // Clique bidirecional
  const handleEscalacao = useCallback((slotId?: string, player?: Player) => {
    // Modo capitão/herói
    if (step === 'captain_hero' && specialMode && slotId) {
      const p = lineup[slotId];
      if (!p) return;
      if (specialMode === 'CAPTAIN') { setCaptainId(p.id); setSpecialMode(null); }
      else                           { setHeroId(p.id);    setSpecialMode(null); }
      return;
    }
    if (slotId) {
      if (activePlayer) executarEscalacao(slotId, activePlayer);
      else setActiveSlot(prev => prev === slotId ? null : slotId);
    }
    if (player) {
      if (activeSlot) executarEscalacao(activeSlot, player);
      else setActivePlayer(prev => prev?.id === player.id ? null : player);
    }
  }, [step, specialMode, lineup, activeSlot, activePlayer, executarEscalacao]);

  const handleCaptainHeroDone = useCallback(() => {
    confetti({ particleCount:200, spread:100, origin:{y:0.5}, colors:['#F5C400','#00F3FF','#fff','#EF4444'] });
    setStep('score');
  }, []);

  const handleScoreConfirm = useCallback(() => {
    confetti({ particleCount:160, spread:90, origin:{y:0.6}, colors:['#F5C400','#22C55E','#fff'] });
    setStep('reveal');
  }, []);

  const isGameField = step === 'picking' || step === 'bench';

  return (
    <div style={{ minHeight:'100vh', background:'#050505', color:'#fff',
      fontFamily:"'Barlow Condensed',system-ui,sans-serif", overflowX:'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}body{background:#050505}
      `}</style>

      <HUD step={step} filled={fieldCount} benchFilled={benchCount} formation={formation}/>

      {/* Overlays full-screen */}
      <AnimatePresence mode="wait">
        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-40 }}
            transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
            <FormationScreen onSelect={handleFormation}/>
          </motion.div>
        )}
        {step === 'captain_hero' && !specialMode && (
          <motion.div key="caphero" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <CaptainHeroScreen onSelectMode={m => setSpecialMode(m)} captainId={captainId} heroId={heroId}
              onDone={handleCaptainHeroDone} lineup={lineup}/>
          </motion.div>
        )}
        {step === 'score' && (
          <motion.div key="score" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <LEDScoreboard scoreTigre={scoreTigre} setScoreTigre={setScoreTigre}
              scoreAdv={scoreAdv} setScoreAdv={setScoreAdv} onConfirm={handleScoreConfirm}/>
          </motion.div>
        )}
        {step === 'reveal' && (
          <motion.div key="reveal" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <PackReveal lineup={lineup} formation={formation} captainId={captainId} heroId={heroId}
              onContinue={() => setStep('share')}/>
          </motion.div>
        )}
        {step === 'share' && (
          <motion.div key="share" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
            <ShareScreen lineup={lineup} formation={formation} captainId={captainId} heroId={heroId}
              scoreTigre={scoreTigre} scoreAdv={scoreAdv} onReset={handleReset}/>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Campo principal (picking / bench) */}
      {isGameField && (
        <motion.div key="field" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
          <div style={{ position:'relative', overflow:'hidden', minHeight:360 }}>
            <StadiumBg/>
            <div style={{ position:'relative', zIndex:5, padding:'10px 6px 0' }}>
              <div style={{ textAlign:'center', marginBottom:6 }}>
                <motion.div key={step} initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'3px 12px',
                    borderRadius:999, background:'rgba(245,196,0,0.08)', border:'1px solid rgba(245,196,0,0.2)' }}>
                  <span style={{ fontSize:7, fontWeight:900, color:'#F5C400', letterSpacing:3, textTransform:'uppercase' }}>
                    {step === 'picking'
                      ? `⚽ Escale ${11-fieldCount} jogador${11-fieldCount!==1?'es':''}`
                      : `🪑 Adicione ${5-benchCount} reserva${5-benchCount!==1?'s':''}`}
                  </span>
                </motion.div>
              </div>
              <Field3D lineup={lineup} slots={slots} activeSlot={activeSlot} activePlayer={activePlayer}
                onSlotClick={slotId => handleEscalacao(slotId, undefined)}
                specialMode={specialMode} captainId={captainId} heroId={heroId}/>
            </div>
          </div>

          {(isFieldFull || step === 'bench') && (
            <BenchArea lineup={lineup} activeSlot={activeSlot} activePlayer={activePlayer}
              onSlotClick={slotId => handleEscalacao(slotId, undefined)} fieldFull={isFieldFull}/>
          )}

          <PlayerPicker lineup={lineup} filterPos={filterPos} setFilterPos={setFilterPos}
            onSelect={p => handleEscalacao(undefined, p)}
            activeSlot={activeSlot} activePlayer={activePlayer} step={step} formation={formation}/>
        </motion.div>
      )}

      {/* Seleção capitão/herói no campo */}
      {step === 'captain_hero' && specialMode && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'10px 14px', background:'rgba(0,0,0,0.92)', backdropFilter:'blur(10px)',
            borderBottom:`1px solid ${specialMode==='CAPTAIN'?'rgba(245,196,0,0.3)':'rgba(0,243,255,0.3)'}` }}>
            <div style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:2,
              textAlign:'center', color:specialMode==='CAPTAIN'?'#F5C400':'#00F3FF' }}>
              {specialMode==='CAPTAIN' ? '© TOQUE NO CAPITÃO DO TIME' : '⭐ TOQUE NO HERÓI DO JOGO'}
            </div>
          </div>
          <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
            <StadiumBg/>
            <div style={{ position:'relative', zIndex:5, padding:'8px 6px 0' }}>
              <Field3D lineup={lineup} slots={slots} activeSlot={null} activePlayer={null}
                onSlotClick={slotId => handleEscalacao(slotId, undefined)}
                specialMode={specialMode} captainId={captainId} heroId={heroId}/>
            </div>
          </div>
          <div style={{ padding:'10px 14px', background:'rgba(0,0,0,0.92)', backdropFilter:'blur(10px)' }}>
            <button onClick={() => setSpecialMode(null)}
              style={{ width:'100%', padding:'11px', borderRadius:12, background:'transparent',
                border:'1px solid rgba(255,255,255,0.09)', color:'#444', fontSize:10,
                fontWeight:900, cursor:'pointer', textTransform:'uppercase' }}>
              ← Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
