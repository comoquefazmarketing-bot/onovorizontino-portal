'use client';
/**
 * EscalacaoFormacao — Tigre FC PS5/FIFA26 Edition
 * Jornada completa: Formação → Mercado → Campo → Banco → Capitão/Herói → Palpite → Reveal → Share
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

// ─── Assets ──────────────────────────────────────────────────────────────────
const BASE       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_CRB = 'https://upload.wikimedia.org/wikipedia/commons/7/73/CRB_logo.svg';
const PATA       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
// ─── Assets "The Best" — fotos fundo transparente para destaque visual ───────
const FOTO_ROMULO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ROMULO%20FUNDO%20TRANSPARENTE.png';
const FOTO_CARLAO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CARLAO%20FUNDO%20TRANSPARENTE.png';

// ─── Gatilho de rodada ───────────────────────────────────────────────────────
// false → edição aberta  |  true → rodada encerrada, exibe pontuação real
const RODADA_ENCERRADA = true;

// ═══════════════════════════════════════════════════════════════════════════════
// DADOS OFICIAIS — Novorizontino 1×1 CRB
// Sofascore ID: 15526006 | Série B 2026, Rodada 3 | 05/04/2026
// Estádio Dr. Jorge Ismael de Biasi, Novo Horizonte
// ───────────────────────────────────────────────────────────────────────────────
// GOLS:
//   Carlão 74'      (Novorizontino) — entrou aos 65', substituiu Robson
//   Dadá Belmonte 90'+4' (CRB)
// ───────────────────────────────────────────────────────────────────────────────
// ESCALAÇÃO TITULAR (11 que iniciaram):
//   GK  31 César Augusto    id=1   rating 7.4
//   DEF 20 N. Castrillón    id=6   rating 6.8
//   DEF  5 Sander           id=8   rating 7.4
//   DEF 25 Dantas            id=10  rating 6.2
//   DEF  4 Patrick           id=12  rating 7.4
//   MEI 18 L. Naldi          id=20  rating 6.8
//   MEI 50 Juninho            id=23  rating 6.7
//   MEI 10 Rômulo (POTM)     id=21  rating 7.9 ← Jogador da Partida
//   MEI  8 C. Ortíz           id=36  rating 6.5
//   ATA 16 Vinicius Paiva     id=32  rating 7.1
//   ATA 11 Robson (c)         id=31  rating 6.1
// ───────────────────────────────────────────────────────────────────────────────
// SUBSTITUIÇÕES:
//   46' +Oyama(id=19, 6.6)  +Lora(id=5, 6.4)   / -C.Ortíz  -L.Naldi
//   65' +Carlão(id=38, 7.5) GOL 74'              / -Robson
//   71' +N.Careca(id=35,6.4)                     / -V.Paiva
//   80' +Bianqui(id=22, 6.6)                     / -N.Careca
// ═══════════════════════════════════════════════════════════════════════════════
const RESULTADO_JOGO = {
  sofascore_id: 15526006,
  adversario:   'CRB',
  rodada:       'Série B 2026 · Rodada 3',
  placar_novo:  1,   // Carlão 74'
  placar_crb:   1,   // Dadá Belmonte 90+4'
  data:         '05/04/2026',
  local:        'Estádio Dr. Jorge Ismael de Biasi, Novo Horizonte',

  // IDs dos 11 titulares (mapeados para o PLAYERS array)
  titulares_ids: new Set<number>([1, 6, 8, 10, 12, 20, 21, 23, 31, 32, 36]),

  // Herói fantasy: Carlão (id=38) — único gol do Novorizontino
  heroi_id: 38,

  // Player of the Match Sofascore: Rômulo (id=21) — nota 7.9
  potm_id: 21,

  // Ratings oficiais Sofascore (lidos da tela ID 15526006 em 05/04/2026)
  ratings: {
    // Titulares
     1: 7.4,  // César Augusto (GOL #31)
     6: 6.8,  // N. Castrillón (DEF #20)
     8: 7.4,  // Sander (DEF #5)
    10: 6.2,  // Dantas (ZAG #25)
    12: 7.4,  // Patrick (ZAG #4)
    20: 6.8,  // L. Naldi (MEI #18)
    21: 7.9,  // Rômulo (MEI #10) ← POTM ⭐
    23: 6.7,  // Juninho (MEI #50)
    31: 6.1,  // Robson (ATA #11)
    32: 7.1,  // Vinicius Paiva (ATA #16)
    36: 6.5,  // C. Ortíz (MEI #8)
    // Substitutos
     5: 6.4,  // Jhilmar Lora (entrou 46')
    19: 6.6,  // Luís Oyama (entrou 46')
    38: 7.5,  // Carlão (entrou 65', GOL 74') ← HERÓI ⚽
    35: 6.4,  // Nicolas Careca (71'–80')
    22: 6.6,  // Matheus Bianqui (entrou 80')
  } as Record<number, number>,
};
// ─── Types ────────────────────────────────────────────────────────────────────
type Player      = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup      = Record<string, Player | null>;
type Step        = 'formation' | 'picking' | 'bench' | 'captain_hero' | 'score' | 'reveal' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;
type Slot        = { id: string; x: number; y: number; pos: string; label: string };

// ─── Interfaces de Props (tipagem explícita — elimina any implícito) ──────────
interface Field3DProps {
  lineup: Lineup; slots: Slot[];
  activeSlot: string|null; activePlayer: Player|null;
  onSlotClick: (id:string)=>void;
  specialMode: SpecialMode; captainId: number|null; heroId: number|null;
}
interface BenchAreaProps {
  lineup: Lineup; activeSlot: string|null; activePlayer: Player|null;
  onSlotClick: (id:string)=>void; fieldFull: boolean;
}
interface PlayerPickerProps {
  lineup: Lineup; filterPos: string; setFilterPos: (p:string)=>void;
  onSelect: (p:Player)=>void; activeSlot: string|null; activePlayer: Player|null;
  step: Step; formation: string;
}
interface FifaCardProps {
  player: Player; isCaptain?: boolean; isHero?: boolean;
  isActive?: boolean; pulsing?: boolean; small?: boolean;
  onClick?: ()=>void;
}

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
  { id:21, name:'Rômulo',           short:'Rômulo',     num:10, pos:'MEI', foto:FOTO_ROMULO },
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
  { id:38, name:'Carlão',           short:'Carlão',     num:90, pos:'ATA', foto:FOTO_CARLAO },
  { id:39, name:'Ronald Barcellos', short:'Ronald',     num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ─── Formações ────────────────────────────────────────────────────────────────
// Coordenadas recalculadas para cards 30% maiores — mais respiro, sem encavalamento
const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK' },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB' },  // laterais nas pontas
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB' },  // zagueiros mais separados
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB' },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB' },
    { id:'dm1', x:34, y:57, pos:'MEI', label:'DM' },
    { id:'dm2', x:66, y:57, pos:'MEI', label:'DM' },
    { id:'am',  x:50, y:40, pos:'MEI', label:'AM' },
    { id:'rw',  x:85, y:25, pos:'ATA', label:'RW' },  // pontas abertas
    { id:'lw',  x:15, y:25, pos:'ATA', label:'LW' },
    { id:'st',  x:50, y:11, pos:'ATA', label:'ST' },
  ],
  '4-3-3': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK' },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB' },
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB' },
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB' },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB' },
    { id:'m1',  x:50, y:54, pos:'MEI', label:'CM' },
    { id:'m2',  x:76, y:46, pos:'MEI', label:'CM' },
    { id:'m3',  x:24, y:46, pos:'MEI', label:'CM' },
    { id:'st',  x:50, y:11, pos:'ATA', label:'CF' },
    { id:'rw',  x:83, y:20, pos:'ATA', label:'RW' },
    { id:'lw',  x:17, y:20, pos:'ATA', label:'LW' },
  ],
  '3-5-2': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK' },
    { id:'cb1', x:50, y:78, pos:'ZAG', label:'CB' },
    { id:'cb2', x:74, y:74, pos:'ZAG', label:'CB' },
    { id:'cb3', x:26, y:74, pos:'ZAG', label:'CB' },
    { id:'rm',  x:91, y:56, pos:'LAT', label:'WB' },
    { id:'lm',  x: 9, y:56, pos:'LAT', label:'WB' },
    { id:'m1',  x:50, y:54, pos:'MEI', label:'CM' },
    { id:'m2',  x:70, y:43, pos:'MEI', label:'CM' },
    { id:'m3',  x:30, y:43, pos:'MEI', label:'CM' },
    { id:'st1', x:37, y:15, pos:'ATA', label:'ST' },
    { id:'st2', x:63, y:15, pos:'ATA', label:'ST' },
  ],
  '4-4-2': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK' },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB' },
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB' },
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB' },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB' },
    { id:'rm',  x:83, y:50, pos:'MEI', label:'RM' },
    { id:'cm1', x:60, y:54, pos:'MEI', label:'CM' },
    { id:'cm2', x:40, y:54, pos:'MEI', label:'CM' },
    { id:'lm',  x:17, y:50, pos:'MEI', label:'LM' },
    { id:'st1', x:37, y:15, pos:'ATA', label:'ST' },
    { id:'st2', x:63, y:15, pos:'ATA', label:'ST' },
  ],
  '5-3-2': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK' },
    { id:'rb',  x:89, y:70, pos:'LAT', label:'WB' },
    { id:'cb1', x:67, y:76, pos:'ZAG', label:'CB' },
    { id:'cb2', x:50, y:80, pos:'ZAG', label:'CB' },
    { id:'cb3', x:33, y:76, pos:'ZAG', label:'CB' },
    { id:'lb',  x:11, y:70, pos:'LAT', label:'WB' },
    { id:'m1',  x:50, y:54, pos:'MEI', label:'CM' },
    { id:'m2',  x:72, y:45, pos:'MEI', label:'CM' },
    { id:'m3',  x:28, y:45, pos:'MEI', label:'CM' },
    { id:'st1', x:37, y:15, pos:'ATA', label:'ST' },
    { id:'st2', x:63, y:15, pos:'ATA', label:'ST' },
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
// ── FOTO DUPLA — recorte preciso por pose ─────────────────────────────
// A imagem contém 2 poses lado a lado (mesma largura total).
//
// pose='static'      → Mercado: pose séria/esquerda
//   object-position: 22% center  → mira no jogador esquerdo
//   scale(1.4)                   → zoom para eliminar o jogador direito do frame
//
// pose='celebration' → Campo: pose comemoração/direita
//   object-position: 78% center  → mira no jogador direito
//   scale(1.5)                   → zoom maior para destacar a celebração
//
function imgStyle(pose: 'static' | 'celebration'): React.CSSProperties {
  if (pose === 'static') {
    // Mercado — pose séria (lado esquerdo da imagem dupla)
    return {
      position: 'absolute',
      top: '50%', left: '50%',
      width: '100%', height: '100%',
      objectFit: 'cover',
      objectPosition: '22% center',  // centraliza o jogador da esquerda
      transform: 'translate(-50%, -50%) scale(1.4)', // zoom remove o jogador direito
      transformOrigin: 'center center',
    };
  }
  // Campo — pose celebração (lado direito da imagem dupla)
  return {
    position: 'absolute',
    top: '50%', left: '50%',
    width: '100%', height: '100%',
    objectFit: 'cover',
    objectPosition: '78% center',  // centraliza o jogador da direita
    transform: 'translate(-50%, -50%) scale(1.5)', // zoom elimina o jogador esquerdo
    transformOrigin: 'center center',
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
function FifaCard({ player, isCaptain, isHero, isActive, pulsing, small=false, onClick }: FifaCardProps) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
  const W = small ? 44 : 62;   // +30% vs original (48→62, 38→44)
  const H = Math.round(W * 1.4); // proporção ligeiramente mais alta
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
function Field3D({ lineup, slots, activeSlot, activePlayer, onSlotClick, specialMode, captainId, heroId }: Field3DProps) {
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
function BenchArea({ lineup, activeSlot, activePlayer, onSlotClick, fieldFull }: BenchAreaProps) {
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
function PlayerPicker({ lineup, filterPos, setFilterPos, onSelect, activeSlot, activePlayer, step, formation }: PlayerPickerProps) {
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
                {/* Sem número — rosto limpo no mercado */}
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
            {/* CRB */}
            <div style={{ flex:1, textAlign:'center' }}>
              <img src={ESCUDO_CRB} alt="CRB"
                crossOrigin="anonymous" loading="eager"
                style={{ width:44, height:44, objectFit:'contain', margin:'0 auto 6px', display:'block',
                  filter:'drop-shadow(0 0 10px #EE2D31)' }}/>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:10, fontWeight:900, color:'#EE2D31', textTransform:'uppercase' }}>CRB</div>
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

      {/* Title com escudos Novo × CRB */}
      <motion.div initial={{ scale:3, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ delay:0.5, type:'spring', stiffness:200 }}
        style={{ textAlign:'center', marginBottom:28, zIndex:2 }}>
        {/* Placar dos escudos */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:10 }}>
          <img src={ESCUDO} alt="Novorizontino" crossOrigin="anonymous" loading="eager"
            style={{ width:40, height:40, objectFit:'contain',
              filter:'drop-shadow(0 0 10px rgba(245,196,0,0.7))' }}/>
          <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:20, fontWeight:900,
            color:'rgba(245,196,0,0.4)', fontStyle:'italic' }}>VS</span>
          <img src={ESCUDO_CRB} alt="CRB" crossOrigin="anonymous" loading="eager"
            style={{ width:40, height:40, objectFit:'contain',
              filter:'drop-shadow(0 0 10px #EE2D31)' }}/>
        </div>
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
// SHARE SCREEN — Story 9:16 com html-to-image
// ─────────────────────────────────────────────────────────────────────────────
function ShareScreen({ lineup, formation, captainId, heroId, scoreTigre, scoreAdv, onReset }: {
  lineup:Lineup; formation:string; captainId:number|null; heroId:number|null;
  scoreTigre:number; scoreAdv:number; onReset:()=>void;
}) {
  const [copied,  setCopied]  = useState(false);
  const [dl,      setDl]      = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [dlLabel, setDlLabel] = useState<'idle'|'generating'|'done'>('idle');

  const cap   = captainId ? PLAYERS.find(p=>p.id===captainId) : null;
  const hero  = heroId    ? PLAYERS.find(p=>p.id===heroId)    : null;
  const slots = FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'];

  // Linhas de jogadores: ATA → MEI → DEF → GOL (exibe de cima pra baixo)
  const rows = [
    slots.filter(s=>s.pos==='ATA').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    slots.filter(s=>s.pos==='MEI').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    slots.filter(s=>s.pos==='ZAG'||s.pos==='LAT').map(s=>lineup[s.id]).filter(Boolean) as Player[],
    slots.filter(s=>s.pos==='GOL').map(s=>lineup[s.id]).filter(Boolean) as Player[],
  ].filter(r=>r.length>0);

  const shareText = encodeURIComponent(
    `🐯 Escalei meu time no Tigre FC!\nFormação: ${formation}\nPalpite: Novorizontino ${scoreTigre} × ${scoreAdv} CRB\nVocê consegue fazer melhor? 👇\nonovorizontino.com.br/tigre-fc`
  );

  // ── Supabase upsert ──────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (saved) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await supabase.from('tigre_fc_usuarios')
          .select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) {
          await supabase.rpc('upsert_escalacao', {
            p_google_id:     session.user.id, // RPC resolve uuid internamente
            p_formacao:      formation,
            p_lineup:        lineup,           // coluna real: lineup
            p_capitao_id:    captainId,        // coluna real: capitao_id
            p_heroi_id:      heroId,
            p_palpite_tigre: scoreTigre,       // coluna real: placar_palpite_tigre
            p_palpite_adv:   scoreAdv,         // coluna real: placar_palpite_adv
            p_bench:         {},
          });
          setSaved(true);
        }
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [lineup, formation, captainId, heroId, scoreTigre, scoreAdv, saved]);

  React.useEffect(() => { handleSave(); }, []);

  // ── Captura + Share / Download ──────────────────────────────────────────
  const handleDownload = async () => {
    if (dl) return;
    setDl(true);
    setDlLabel('generating');
    try {
      const el = document.getElementById('tfc-story-card');
      if (!el) { setDl(false); setDlLabel('idle'); return; }

      // Garante crossOrigin="anonymous" em TODAS as imagens do card
      el.querySelectorAll('img').forEach((img) => {
        img.crossOrigin = 'anonymous';
      });

      // Aguarda imagens com crossOrigin recarregarem
      await new Promise(res => setTimeout(res, 120));

      // html-to-image com pixelRatio:2 (alta resolução)
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#050505',
        style: { borderRadius: '0px' }, // evita corte no Safari
      });

      // Converte dataURL → Blob → File
      const res  = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], 'tigre-fc-meu-time.png', { type: 'image/png' });

      setDlLabel('done');

      // Detecta Mobile vs Desktop
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

      if (isMobile && navigator.share && navigator.canShare?.({ files: [file] })) {
        // Mobile: Web Share API nativa (abre WhatsApp, Insta, etc.)
        await navigator.share({
          title: 'Meu Time — Tigre FC 🐯',
          text: `🐯 ${formation} | Palpite ${scoreTigre}×${scoreAdv}\nonovorizontino.com.br/tigre-fc`,
          files: [file],
        });
      } else {
        // Desktop: download direto do .png
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href = url; a.download = 'tigre-fc-meu-time.png'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      }
    } catch (err) {
      console.warn('[TigreFC Share]', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      // Diagnóstico amigável
      if (errMsg.includes('tainted') || errMsg.includes('CORS') || errMsg.includes('SecurityError')) {
        alert('Erro de imagem (CORS). Tente novamente ou use o botão de copiar link.');
      }
      // Fallback: copia link para área de transferência
      navigator.clipboard.writeText('https://onovorizontino.com.br/tigre-fc').catch(()=>{});
      setCopied(true); setTimeout(() => setCopied(false), 2500);
    }
    setDl(false);
    setTimeout(() => setDlLabel('idle'), 3000);
  };

  const SHARE_BTNS = [
    { l:'WhatsApp',  c:'#25D366', h:`https://wa.me/?text=${shareText}`,                                                                               i:'💬' },
    { l:'Instagram', c:'#E1306C', h:'https://instagram.com',                                                                                          i:'📸' },
    { l:'Facebook',  c:'#1877F2', h:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://onovorizontino.com.br/tigre-fc')}`,    i:'👥' },
    { l:'Twitter',   c:'#1DA1F2', h:`https://twitter.com/intent/tweet?text=${shareText}`,                                                              i:'🐦' },
  ];

  const dlText = dlLabel==='generating' ? '⏳ Gerando...' : dlLabel==='done' ? '✓ Pronto!' : '📥 SALVAR STORY & COMPARTILHAR';

  return (
    <div style={{ padding:'12px 12px 60px', minHeight:'100vh', background:'#050505' }}>

      {/* Título */}
      <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
        style={{ textAlign:'center', marginBottom:14 }}>
        <div style={{ fontSize:8, fontWeight:900, letterSpacing:5, textTransform:'uppercase', marginBottom:4,
          color: saved ? '#22C55E' : saving ? '#F5C400' : '#2a2a2a' }}>
          {saved ? '✓ Time salvo no banco!' : saving ? '⏳ Salvando...' : 'STEP 7 · GLORIFY'}
        </div>
        <h2 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:24, fontWeight:900,
          color:'#fff', textTransform:'uppercase', letterSpacing:-0.5, margin:0 }}>
          SALVE &amp; DESAFIE<br /><span style={{ color:'#F5C400' }}>A GALERA 🐯</span>
        </h2>
      </motion.div>

      {/* ── STORY CARD 9:16 ─────────────────────────────────────────────── */}
      {/* Wrapper responsivo na tela */}
      <motion.div initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1, type:'spring', stiffness:200 }}
        style={{ width:'100%', maxWidth:360, margin:'0 auto', aspectRatio:'9/16',
          borderRadius:20, overflow:'hidden', boxShadow:'0 0 60px rgba(245,196,0,0.18)' }}>

        {/* Card fixo 360×640 para captura — html-to-image fotografa exatamente isso */}
        <div id="tfc-story-card"
          style={{ width:360, height:640, position:'relative', overflow:'hidden',
            background:'linear-gradient(160deg,#070600 0%,#0e0c00 25%,#091200 55%,#050505 100%)',
            fontFamily:"'Barlow Condensed',Impact,sans-serif",
            display:'flex', flexDirection:'column' }}>

          {/* Gramado SVG de fundo */}
          <div style={{ position:'absolute', inset:0, overflow:'hidden', pointerEvents:'none' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'55%',
              background:'radial-gradient(ellipse 100% 70% at 50% 100%,rgba(16,80,16,0.45) 0%,transparent 70%)' }}/>
            {/* Linhas de campo sutis */}
            <svg viewBox="0 0 360 640" style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.04 }}>
              <ellipse cx="180" cy="420" rx="160" ry="80" stroke="white" strokeWidth="1" fill="none"/>
              <line x1="0" y1="380" x2="360" y2="380" stroke="white" strokeWidth="0.8"/>
            </svg>
            {/* Refletores cantos */}
            <div style={{ position:'absolute', top:0, left:0, width:'50%', height:'70%',
              background:'linear-gradient(135deg,rgba(255,252,210,0.06) 0%,transparent 55%)', filter:'blur(20px)' }}/>
            <div style={{ position:'absolute', top:0, right:0, width:'50%', height:'70%',
              background:'linear-gradient(225deg,rgba(255,252,210,0.06) 0%,transparent 55%)', filter:'blur(20px)' }}/>
          </div>

          {/* Linha dourada topo */}
          <div style={{ height:4, background:'linear-gradient(90deg,#8B6500,#F5C400,#D4A200,#F5C400,#8B6500)', flexShrink:0 }}/>

          {/* Header */}
          <div style={{ padding:'10px 14px 8px', display:'flex', alignItems:'center', gap:10,
            background:'linear-gradient(90deg,rgba(245,196,0,0.1),transparent)',
            borderBottom:'1px solid rgba(245,196,0,0.12)', flexShrink:0, position:'relative', zIndex:2 }}>
            <img src={ESCUDO} crossOrigin="anonymous" alt="escudo"
              style={{ width:44, height:44, objectFit:'contain',
                filter:'drop-shadow(0 0 12px rgba(245,196,0,0.7))' }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:7, fontWeight:900, color:'#F5C400', letterSpacing:3, textTransform:'uppercase', marginBottom:2 }}>
                TIGRE FC · FANTASY LEAGUE
              </div>
              <div style={{ fontSize:17, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:-0.5, lineHeight:1.1 }}>
                MEU TIME<br /><span style={{ color:'#F5C400' }}>ESTÁ PRONTO! 🐯</span>
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontSize:7, color:'rgba(245,196,0,0.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>FORMAÇÃO</div>
              <div style={{ fontSize:22, fontWeight:900, color:'#F5C400', letterSpacing:-1, lineHeight:1 }}>{formation}</div>
            </div>
          </div>

          {/* ── Jogadores — cards FIFA +40%, overlap efeito baralho ── */}
          <div style={{ flex:1, padding:'8px 6px 0', display:'flex', flexDirection:'column',
            justifyContent:'center', gap:4, position:'relative', zIndex:2 }}>
            {rows.map((row, ri) => {
              // Overlap: cards com margem negativa para efeito de baralho aberto
              const cardW = 58;
              const overlapOffset = row.length > 4 ? -6 : row.length > 3 ? -2 : 0;
              return (
                <div key={ri} style={{ display:'flex', justifyContent:'center', alignItems:'flex-end',
                  // Cada card avança sobre o anterior — efeito 3D de profundidade
                  marginLeft: overlapOffset * (row.length - 1) / 2,
                }}>
                  {row.map((player, pi) => {
                    const isCap  = player.id === captainId;
                    const isHero = player.id === heroId;
                    const col = isCap ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
                    return (
                      <div key={player.id} style={{ position:'relative', flexShrink:0,
                        // Overlap lateral — cada card se sobrepõe ao anterior
                        marginLeft: pi === 0 ? 0 : overlapOffset,
                        zIndex: pi + 1,
                      }}>
                        {/* Badge C / ⭐ */}
                        {(isCap||isHero) && (
                          <div style={{ position:'absolute', top:-8, right:-4, zIndex:10,
                            background:col, color:'#000', fontSize:8, fontWeight:900,
                            padding:'2px 5px', borderRadius:4, lineHeight:1,
                            boxShadow:`0 0 12px ${col}cc` }}>
                            {isCap ? 'C' : '⭐'}
                          </div>
                        )}
                        {/* Card FIFA vertical 58×80 — +40% vs original */}
                        <div style={{ width:cardW, height:80, borderRadius:9, overflow:'hidden',
                          border:`2px solid ${col}`,
                          boxShadow: isCap||isHero
                            ? `0 0 20px ${col}99, 0 6px 16px rgba(0,0,0,0.9), 2px 0 0 rgba(0,0,0,0.5)`
                            : `0 0 10px ${col}60, 0 6px 14px rgba(0,0,0,0.8), 2px 0 0 rgba(0,0,0,0.4)`,
                          background:'#050505', position:'relative' }}>
                          {/* Zona de foto */}
                          <div style={{ width:'100%', height:'74%', overflow:'hidden', position:'relative' }}>
                            <img src={player.foto} alt={player.short} crossOrigin="anonymous"
                              onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                              style={imgStyle('celebration')}/>
                            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'35%',
                              background:'linear-gradient(0deg,#050505 0%,transparent 100%)', pointerEvents:'none' }}/>
                          </div>
                          {/* Tarja nome — tipografia grande e robusta */}
                          <div style={{ position:'absolute', bottom:0, width:'100%', height:'26%',
                            background:`linear-gradient(135deg,${col}f0,${col}cc)`,
                            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                            padding:'1px 3px' }}>
                            <div style={{ fontSize:6, fontWeight:900, color:'rgba(0,0,0,0.6)',
                              letterSpacing:2, textTransform:'uppercase', lineHeight:1 }}>{player.pos}</div>
                            <div style={{
                              fontFamily:"'Barlow Condensed',Impact,sans-serif",
                              fontSize:9, fontWeight:900, fontStyle:'italic', color:'#000',
                              textTransform:'uppercase', letterSpacing:-0.3, lineHeight:1.1,
                              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                              maxWidth:'100%', padding:'0 2px',
                            }}>
                              {player.short}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Stats strip */}
          <div style={{ display:'flex', flexShrink:0,
            borderTop:'1px solid rgba(245,196,0,0.1)', borderBottom:'1px solid rgba(245,196,0,0.1)',
            background:'rgba(0,0,0,0.35)', position:'relative', zIndex:2 }}>
            {[
              { label:'Capitão', value:cap?.short??'—',           icon:'©',  col:'#F5C400' },
              { label:'Herói',   value:hero?.short??'—',           icon:'⭐', col:'#00F3FF' },
              { label:'Novo × CRB', value:`${scoreTigre}×${scoreAdv}`, icon:'🎯', col:'#22C55E' },
            ].map((item, idx) => (
              <div key={item.label} style={{ flex:1, textAlign:'center', padding:'8px 3px',
                borderRight: idx < 2 ? '1px solid rgba(245,196,0,0.08)' : 'none' }}>
                <div style={{ fontSize:15, marginBottom:1 }}>{item.icon}</div>
                <div style={{ fontSize:12, fontWeight:900, color:item.col, lineHeight:1,
                  overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', padding:'0 2px' }}>
                  {item.value}
                </div>
                <div style={{ fontSize:6, color:'#333', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTA footer */}
          <div style={{ padding:'10px 14px', textAlign:'center', background:'rgba(0,0,0,0.25)',
            flexShrink:0, position:'relative', zIndex:2 }}>
            <div style={{ fontSize:13, fontWeight:900, color:'#fff', textTransform:'uppercase',
              lineHeight:1.2, marginBottom:4 }}>
              VOCÊ CONSEGUE<br /><span style={{ color:'#F5C400' }}>FAZER MELHOR?</span>
            </div>
            <div style={{ fontSize:8, color:'#2a2a2a', fontWeight:600 }}>onovorizontino.com.br/tigre-fc</div>
            <div style={{ fontSize:6.5, color:'#141414', fontWeight:700, letterSpacing:2,
              textTransform:'uppercase', marginTop:2 }}>
              Série B 2026 · #TigreFC · #NovFC
            </div>
          </div>

          {/* Linha dourada bottom */}
          <div style={{ height:4, background:'linear-gradient(90deg,#8B6500,#F5C400,#D4A200,#F5C400,#8B6500)', flexShrink:0 }}/>
        </div>
      </motion.div>

      {/* ── Botões de Ação ──────────────────────────────────────────────── */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
        style={{ marginTop:14, maxWidth:360, margin:'14px auto 0' }}>

        {/* Botão principal: Salvar + Compartilhar */}
        <motion.button onClick={handleDownload} whileTap={{ scale:0.96 }}
          disabled={dl}
          style={{ width:'100%', padding:'15px', marginBottom:10, borderRadius:16,
            background: dlLabel==='done'
              ? 'linear-gradient(135deg,#22C55E,#16A34A)'
              : 'linear-gradient(135deg,#F5C400,#D4A200)',
            border:'none', color:'#000', fontSize:12, fontWeight:900,
            textTransform:'uppercase', letterSpacing:1.5, cursor: dl ? 'wait' : 'pointer',
            boxShadow:'0 8px 24px rgba(245,196,0,0.3)',
            opacity: dl ? 0.85 : 1, transition:'background 0.3s' }}>
          {dlText}
        </motion.button>

        {/* Share buttons sociais */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginBottom:9 }}>
          {SHARE_BTNS.map(b => (
            <motion.a key={b.l} href={b.h} target="_blank" rel="noreferrer" whileTap={{ scale:0.9 }}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                padding:'9px 3px', borderRadius:12,
                background:`${b.c}12`, border:`1px solid ${b.c}35`,
                textDecoration:'none', cursor:'pointer' }}>
              <span style={{ fontSize:17 }}>{b.i}</span>
              <span style={{ fontSize:6.5, fontWeight:900, color:b.c, textTransform:'uppercase', letterSpacing:0.5 }}>{b.l}</span>
            </motion.a>
          ))}
        </div>

        {/* Copiar link */}
        <motion.button
          onClick={async () => {
            await navigator.clipboard.writeText('https://onovorizontino.com.br/tigre-fc');
            setCopied(true); setTimeout(() => setCopied(false), 2500);
          }}
          whileTap={{ scale:0.96 }}
          style={{ width:'100%', padding:'11px', borderRadius:12, marginBottom:9,
            background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
            border:`1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.07)'}`,
            color: copied ? '#22C55E' : '#333',
            fontSize:10, fontWeight:900, textTransform:'uppercase', letterSpacing:1, cursor:'pointer' }}>
          {copied ? '✓ Link copiado!' : '🔗 Copiar link'}
        </motion.button>

        {/* Botão Ciclo da Vitória */}
        <motion.button onClick={onReset}
          whileTap={{ scale:0.97 }}
          whileHover={{ backgroundColor:'#F5C400', color:'#000' }}
          style={{ width:'100%', padding:'16px', borderRadius:16,
            background:'transparent',
            border:'2px solid #F5C400',
            color:'#F5C400',
            fontSize:12, fontWeight:900, fontStyle:'italic',
            textTransform:'uppercase', letterSpacing:1.5, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            boxShadow:'0 0 20px rgba(245,196,0,0.15)',
            transition:'background 0.25s, color 0.25s',
          }}>
          <span style={{ fontSize:18 }}>🏠</span>
          IR PARA O TIGRE FC
        </motion.button>
      </motion.div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// MOTOR DE PONTUAÇÃO — calcula pts do torcedor vs resultado real
// ─────────────────────────────────────────────────────────────────────────────
interface PlacarResult {
  pts_escalacao: number;  // +5 por cada titular acertado
  pts_capitao:   number;  // rating do capitão × 2
  pts_heroi:     number;  // +10 se herói certo
  pts_palpite:   number;  // +15 exato | +5 resultado
  total:         number;
  acertou_exato: boolean;
  titulares_certos: number[];
}

function calcularPontuacao(
  lineup: Lineup,
  captainId: number|null,
  heroId: number|null,
  palpiteTigre: number,
  palpiteAdv: number,
): PlacarResult {
  const titulares_certos: number[] = [];
  let pts_escalacao = 0;
  let pts_capitao   = 0;

  Object.values(lineup).forEach(p => {
    if (!p) return;
    if (RESULTADO_JOGO.titulares_ids.has(p.id)) {
      titulares_certos.push(p.id);
      pts_escalacao += 5;
    }
  });

  // Capitão: rating × 2 (bônus = rating extra, base já está no escalação)
  if (captainId && RESULTADO_JOGO.ratings[captainId]) {
    pts_capitao = Math.round(RESULTADO_JOGO.ratings[captainId] * 2);
  }

  // Herói
  const pts_heroi = heroId === RESULTADO_JOGO.heroi_id ? 10 : 0;

  // Palpite
  let pts_palpite = 0;
  let acertou_exato = false;
  const res_real  = RESULTADO_JOGO.placar_novo > RESULTADO_JOGO.placar_crb ? 'V'
    : RESULTADO_JOGO.placar_novo < RESULTADO_JOGO.placar_crb ? 'D' : 'E';
  const res_user  = palpiteTigre > palpiteAdv ? 'V' : palpiteTigre < palpiteAdv ? 'D' : 'E';

  if (palpiteTigre === RESULTADO_JOGO.placar_novo && palpiteAdv === RESULTADO_JOGO.placar_crb) {
    pts_palpite = 15; acertou_exato = true;
  } else if (res_user === res_real) {
    pts_palpite = 5;
  }

  const total = pts_escalacao + pts_capitao + pts_heroi + pts_palpite;
  return { pts_escalacao, pts_capitao, pts_heroi, pts_palpite, total, acertou_exato, titulares_certos };
}


// ─────────────────────────────────────────────────────────────────────────────
// TELA DE RESULTADOS DA RODADA — Novorizontino vs CRB (Série B 2026)
// ─────────────────────────────────────────────────────────────────────────────
function ResultadoScreen({ lineup, formation, captainId, heroId, scoreTigre, scoreAdv, onGoRanking }: {
  lineup: Lineup; formation: string; captainId: number|null; heroId: number|null;
  scoreTigre: number; scoreAdv: number; onGoRanking: ()=>void;
}) {
  const slots  = FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'];
  const result = calcularPontuacao(lineup, captainId, heroId, scoreTigre, scoreAdv);
  const totalColor = result.total >= 50 ? '#22C55E' : result.total >= 30 ? '#F5C400' : '#EF4444';

  return (
    <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      style={{ minHeight:'100vh', background:'#050505', color:'#fff', padding:'0 0 60px',
        fontFamily:"'Barlow Condensed',system-ui,sans-serif" }}>

      {/* Header */}
      <div style={{ padding:'20px 16px 16px',
        background:'linear-gradient(160deg,#0a0800,#141000)', borderBottom:'1px solid rgba(245,196,0,0.12)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
          <div>
            <div style={{ fontSize:7, fontWeight:900, color:'rgba(245,196,0,0.5)', letterSpacing:4, textTransform:'uppercase' }}>
              SÉRIE B 2026 · RODADA
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:22, fontWeight:900,
              color:'#fff', textTransform:'uppercase', letterSpacing:-0.5, lineHeight:1 }}>
              RESULTADO DA RODADA
            </div>
          </div>
          {/* Placar real */}
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:8, color:'rgba(245,196,0,0.4)', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>
              RESULTADO OFICIAL
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <img src={ESCUDO} alt="Novo" crossOrigin="anonymous" loading="eager"
                style={{ width:28, height:28, objectFit:'contain', filter:'drop-shadow(0 0 6px rgba(245,196,0,0.6))' }}/>
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:28, fontWeight:900, color:'#F5C400' }}>
                {RESULTADO_JOGO.placar_novo}
              </span>
              <span style={{ fontSize:16, color:'#333', fontWeight:900 }}>×</span>
              <span style={{ fontFamily:"'Courier New',monospace", fontSize:28, fontWeight:900, color:'#EE2D31' }}>
                {RESULTADO_JOGO.placar_crb}
              </span>
              <img src={ESCUDO_CRB} alt="CRB" crossOrigin="anonymous" loading="eager"
                style={{ width:28, height:28, objectFit:'contain', filter:'drop-shadow(0 0 6px #EE2D31)' }}/>
            </div>
          </div>
        </div>

        {/* Seus pontos */}
        <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
          transition={{ delay:0.2, type:'spring', stiffness:200 }}
          style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
            background:`${totalColor}12`, border:`1.5px solid ${totalColor}40`, borderRadius:16 }}>
          <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
            fontSize:56, fontWeight:900, color:totalColor, lineHeight:1,
            textShadow:`0 0 24px ${totalColor}80` }}>
            {result.total}
          </div>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
              fontSize:22, fontWeight:900, color:'#fff', textTransform:'uppercase', lineHeight:1, letterSpacing:-0.5 }}>
              SEUS PONTOS
            </div>
            <div style={{ fontSize:10, color:'#555', fontWeight:700, textTransform:'uppercase', letterSpacing:2, marginTop:2 }}>
              nesta rodada
            </div>
          </div>
          {result.acertou_exato && (
            <motion.div animate={{ scale:[1,1.1,1] }} transition={{ duration:0.8, repeat:Infinity }}
              style={{ marginLeft:'auto', background:'linear-gradient(135deg,#F5C400,#D4A200)',
                color:'#000', fontSize:9, fontWeight:900, padding:'5px 10px', borderRadius:8,
                textTransform:'uppercase', letterSpacing:1 }}>
              🎯 PLACAR EXATO!
            </motion.div>
          )}
        </motion.div>
      </div>

      <div style={{ padding:'16px 14px 0', maxWidth:460, margin:'0 auto' }}>

        {/* Breakdown */}
        <div style={{ fontSize:8, fontWeight:900, color:'#333', letterSpacing:4, textTransform:'uppercase', marginBottom:10 }}>
          DETALHAMENTO
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:20 }}>
          {[
            { label:`Escalação (${result.titulares_certos.length} titular${result.titulares_certos.length!==1?'es':''} certos)`, pts:result.pts_escalacao, icon:'⚽', col:'#22C55E' },
            { label:'Capitão (rating × 2)',         pts:result.pts_capitao,  icon:'©',  col:'#F5C400' },
            { label:heroId===RESULTADO_JOGO.heroi_id ? 'Herói acertado! 🎉' : 'Herói errado', pts:result.pts_heroi, icon:'⭐', col:'#00F3FF' },
            { label:result.acertou_exato ? 'Placar EXATO 🎯' : scoreTigre > scoreAdv ? 'Resultado correto' : 'Palpite errado', pts:result.pts_palpite, icon:'🎯', col:'#22C55E' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:0.1 + i * 0.07 }}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
                background:'rgba(255,255,255,0.02)', borderRadius:12,
                border:`1px solid ${item.pts > 0 ? item.col + '30' : 'rgba(255,255,255,0.05)'}` }}>
              <span style={{ fontSize:18 }}>{item.icon}</span>
              <div style={{ flex:1, fontSize:12, color: item.pts > 0 ? '#ccc' : '#333', fontWeight:700 }}>
                {item.label}
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
                fontSize:22, fontWeight:900, color: item.pts > 0 ? item.col : '#222', lineHeight:1 }}>
                +{item.pts}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Campo comparativo */}
        <div style={{ fontSize:8, fontWeight:900, color:'#333', letterSpacing:4, textTransform:'uppercase', marginBottom:10 }}>
          SEU TIME vs REAL
        </div>
        <div style={{ position:'relative', width:'100%', maxWidth:400, margin:'0 auto',
          perspective:'380px', perspectiveOrigin:'50% 10%' }}>
          <div style={{ position:'relative', width:'100%', paddingTop:'95%',
            transform:'rotateX(20deg)', transformOrigin:'bottom center', transformStyle:'preserve-3d' }}>
            <div style={{ position:'absolute', inset:0, borderRadius:14, overflow:'hidden',
              background:'linear-gradient(180deg,#0b3d0b 0%,#1c6e1c 50%,#0b3d0b 100%)',
              border:'1.5px solid rgba(255,255,255,0.15)' }}>
              <svg viewBox="0 0 100 95" preserveAspectRatio="none"
                style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.18 }}>
                <rect x="5" y="3" width="90" height="89" stroke="white" strokeWidth="1" fill="none"/>
                <line x1="5" y1="47.5" x2="95" y2="47.5" stroke="white" strokeWidth="0.8"/>
                <circle cx="50" cy="47.5" r="12" stroke="white" strokeWidth="0.8" fill="none"/>
              </svg>
            </div>
            <div style={{ position:'absolute', inset:0 }}>
              {slots.map(slot => {
                const p = lineup[slot.id];
                if (!p) return null;
                const isTitular = RESULTADO_JOGO.titulares_ids.has(p.id);
                const rating    = RESULTADO_JOGO.ratings[p.id];
                const isCap     = captainId === p.id;
                const isHero    = heroId    === p.id;
                const col       = isCap ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[p.pos] ?? '#888');
                return (
                  <div key={slot.id} style={{ position:'absolute',
                    left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%,-50%)', zIndex:5 }}>
                    <div style={{ position:'relative', width:36, height:50, borderRadius:6, overflow:'hidden',
                      border:`2px solid ${isTitular ? col : '#2a2a2a'}`,
                      background:'#050505',
                      filter: isTitular ? 'none' : 'grayscale(100%) brightness(0.4)',
                      boxShadow: isTitular ? `0 0 12px ${col}60` : 'none' }}>
                      <div style={{ width:'100%', height:'76%', overflow:'hidden', position:'relative' }}>
                        <img src={p.foto} alt={p.short} crossOrigin="anonymous"
                          onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
                          style={imgStyle('celebration')} />
                        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'40%',
                          background:'linear-gradient(0deg,#050505,transparent)', pointerEvents:'none' }}/>
                      </div>
                      <div style={{ position:'absolute', bottom:0, width:'100%', height:'24%',
                        background:`linear-gradient(135deg,${isTitular ? col : '#2a2a2a'}dd,${isTitular ? col : '#2a2a2a'}88)`,
                        display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:5.5, fontWeight:900, color: isTitular ? '#000' : '#555',
                          textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', padding:'0 1px' }}>
                          {p.short}
                        </span>
                      </div>
                      {/* Badge nota Sofascore */}
                      {rating && isTitular && (
                        <div style={{ position:'absolute', top:-7, left:-5, zIndex:10,
                          background: rating >= 8 ? '#22C55E' : rating >= 7 ? '#F5C400' : '#666',
                          color:'#000', fontSize:7, fontWeight:900, padding:'1px 3px',
                          borderRadius:4, lineHeight:1, boxShadow:'0 0 6px rgba(0,0,0,0.8)' }}>
                          {rating.toFixed(1)}
                        </div>
                      )}
                      {/* Banco */}
                      {!isTitular && (
                        <div style={{ position:'absolute', top:-7, left:-5, zIndex:10,
                          background:'#1a1a1a', color:'#555', fontSize:7, fontWeight:900,
                          padding:'1px 3px', borderRadius:4, lineHeight:1 }}>🪑</div>
                      )}
                      {/* C / ⭐ */}
                      {(isCap||isHero) && (
                        <div style={{ position:'absolute', top:-7, right:-5, zIndex:10,
                          background:col, color:'#000', fontSize:7, fontWeight:900,
                          padding:'1px 3px', borderRadius:4, lineHeight:1 }}>
                          {isCap ? 'C' : '⭐'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div style={{ display:'flex', gap:16, justifyContent:'center', marginTop:10, flexWrap:'wrap' }}>
          {[
            { label:'Titular real (+5 pts)', color:'#22C55E', icon:null },
            { label:'Ficou no banco', color:'#555', icon:'🪑' },
            { label:'Nota Sofascore', color:'#22C55E', badge:'8.0' },
          ].map((l,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:5, fontSize:9, color:'#555', fontWeight:700 }}>
              {l.icon && <span>{l.icon}</span>}
              {l.badge && <span style={{ background:l.color, color:'#000', fontSize:7, fontWeight:900,
                padding:'0 3px', borderRadius:3 }}>{l.badge}</span>}
              {!l.icon && !l.badge && <span style={{ display:'inline-block', width:10, height:10,
                borderRadius:2, background:l.color }}/>}
              {l.label}
            </div>
          ))}
        </div>

        {/* CTA Ranking */}
        <motion.button onClick={onGoRanking}
          whileTap={{ scale:0.96 }} whileHover={{ scale:1.02 }}
          animate={{ boxShadow:['0 0 0 0 rgba(245,196,0,0)','0 0 28px rgba(245,196,0,0.6)','0 0 0 0 rgba(245,196,0,0)'] }}
          transition={{ duration:2, repeat:Infinity }}
          style={{ width:'100%', maxWidth:400, margin:'24px auto 0', display:'block',
            padding:'18px', borderRadius:18, background:'linear-gradient(135deg,#F5C400,#D4A200)',
            border:'none', color:'#000', fontSize:15, fontWeight:900,
            textTransform:'uppercase', letterSpacing:2, cursor:'pointer' }}>
          🏆 VER RANKING GERAL
        </motion.button>
        <div style={{ textAlign:'center', marginTop:10, fontSize:9, color:'#222',
          fontWeight:700, textTransform:'uppercase', letterSpacing:2 }}>
          onovorizontino.com.br/tigre-fc
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTE PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────
export default function EscalacaoFormacao() {
  const router = useRouter();

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
  const [userId,       setUserId]       = useState<string|null>(null);
  const [hydrated,     setHydrated]     = useState(false);

  const slots      = useMemo(() => FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'], [formation]);
  const fieldCount = useMemo(() => slots.filter(s => !!lineup[s.id]).length, [lineup, slots]);
  const benchCount = useMemo(() => BENCH_SLOTS.filter(bs => !!lineup[bs.id]).length, [lineup]);
  const isFieldFull = fieldCount === 11;
  const isBenchFull = benchCount === 5;

  // ── HIDRATAÇÃO: carrega escalação salva ao montar ──────────────────────────
  useEffect(() => {
    let alive = true;
    async function loadSaved() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        // Regra de Ouro: usa google_id via RPC server-side
        const googleId = session.user.id;

        // Guarda o google_id para o autoSave usar na RPC
        setUserId(googleId);

        // Carrega escalação via RPC (converte google_id internamente)
        const { data: esc, error } = await supabase
          .rpc('get_escalacao_usuario', { p_google_id: googleId });

        if (!alive || error || !esc || esc.error) return;

        // Parse null-safe do lineup — tabela: escalacoes_usuarios, coluna: lineup
        const safeLineup: Lineup = {};
        const rawLineup = esc.lineup ?? {};
        if (rawLineup && typeof rawLineup === 'object') {
          Object.entries(rawLineup as Record<string, unknown>).forEach(([k, v]) => {
            // Valida que o valor tem a forma mínima de um Player antes de atribuir
            if (v && typeof v === 'object' && 'id' in v && 'pos' in v) {
              safeLineup[k] = v as Player;
            } else {
              safeLineup[k] = null;
            }
          });
        }

        setFormation(esc.formacao ?? '4-2-3-1');
        setLineup(safeLineup);
        setCaptainId(esc.capitao_id ?? null);      // coluna real: capitao_id
        setHeroId(esc.heroi_id ?? null);
        setScoreTigre(esc.placar_palpite_tigre ?? 1); // coluna real
        setScoreAdv(esc.placar_palpite_adv ?? 0);     // coluna real

        // Avança a etapa conforme o que já está salvo
        const savedSlots = FORMATIONS[esc.formacao ?? '4-2-3-1'] ?? FORMATIONS['4-2-3-1'];
        const savedField = savedSlots.filter((s: any) => !!safeLineup[s.id]).length;
        const savedBench = BENCH_SLOTS.filter(bs => !!safeLineup[bs.id]).length;

        if (savedField === 11 && savedBench === 5 && esc.capitao_id && esc.heroi_id) {
          setStep('share');
        } else if (savedField === 11 && savedBench === 5) {
          setStep('captain_hero');
        } else if (savedField === 11) {
          setStep('bench');
        } else if (savedField > 0) {
          setStep('picking');
        }
      } catch (e) {
        console.warn('[TigreFC] Hydration error:', e);
      } finally {
        if (alive) setHydrated(true);
      }
    }
    loadSaved();
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── AUTO-SAVE: via RPC upsert_escalacao (Regra de Ouro: google_id server-side)
  const autoSave = useCallback(async (
    currentLineup: Lineup,
    currentFormation: string,
    currentCaptain: number|null,
    currentHero: number|null,
    currentScoreTigre: number,
    currentScoreAdv: number,
  ) => {
    if (!userId || !hydrated) return; // userId aqui é o google_id da sessão
    try {
      // Separa titulares e reservas para salvar nos campos corretos
      const titulares: Lineup = {};
      const reservas:  Lineup = {};
      Object.entries(currentLineup).forEach(([k, v]) => {
        if (k.startsWith('b_')) reservas[k] = v;
        else titulares[k] = v;
      });

      if (process.env.NODE_ENV === 'development') {
        const tCount = Object.values(titulares).filter(Boolean).length;
        const bCount = Object.values(reservas).filter(Boolean).length;
        console.log(`[TigreFC] autoSave → formação:${currentFormation} titulares:${tCount} reservas:${bCount} cap:${currentCaptain} herói:${currentHero}`);
      }

      const { data, error } = await supabase.rpc('upsert_escalacao', {
        p_google_id:     userId,           // RPC converte → uuid internamente
        p_formacao:      currentFormation,
        p_lineup:        titulares,        // coluna: lineup
        p_capitao_id:    currentCaptain,   // coluna: capitao_id
        p_heroi_id:      currentHero,
        p_palpite_tigre: currentScoreTigre, // coluna: placar_palpite_tigre
        p_palpite_adv:   currentScoreAdv,   // coluna: placar_palpite_adv
        p_bench:         reservas,
      });

      if (error) {
        console.error('[TigreFC] upsert_escalacao error:', error.message, error.details);
      } else if (data?.error) {
        console.error('[TigreFC] RPC returned error:', data.error);
      }
    } catch (e) {
      console.warn('[TigreFC] AutoSave unexpected error:', e);
    }
  }, [userId, hydrated]);

  // Reset completo do ciclo
  const handleReset = useCallback(() => {
    setStep('formation'); setFormation('4-2-3-1'); setLineup({});
    setActiveSlot(null); setActivePlayer(null); setFilterPos('TODOS');
    setCaptainId(null); setHeroId(null); setSpecialMode(null);
    setScoreTigre(1); setScoreAdv(0);
    // Não limpa userId/hydrated — mantém sessão
  }, []);

  // Botão final → aguarda save e redireciona para o Hub do Tigre FC
  const handleGoHome = useCallback(async () => {
    // Garante que o upsert foi concluído antes de navegar
    await autoSave(lineup, formation, captainId, heroId, scoreTigre, scoreAdv);
    handleReset();
    router.push('/tigre-fc');
  }, [handleReset, router, autoSave, lineup, formation, captainId, heroId, scoreTigre, scoreAdv]);

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

  // Vai para o ranking (Tigre FC hub)
  const handleGoRanking = useCallback(() => {
    router.push('/tigre-fc');
  }, [router]);

  // Tela de carregamento enquanto busca escalação salva
  if (!hydrated) return (
    <div style={{ minHeight:'100vh', background:'#050505',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
      <motion.img src={PATA} alt="Tigre FC"
        style={{ width:56, height:56, objectFit:'contain', filter:'drop-shadow(0 0 16px rgba(245,196,0,0.6))' }}
        animate={{ opacity:[0.5,1,0.5], scale:[0.95,1.05,0.95] }}
        transition={{ duration:1.8, repeat:Infinity, ease:'easeInOut' }}/>
      <div style={{ fontSize:10, fontWeight:900, color:'#F5C400', letterSpacing:4,
        textTransform:'uppercase', fontFamily:"'Barlow Condensed',system-ui,sans-serif" }}>
        Carregando seu time...
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#050505', color:'#fff',
      fontFamily:"'Barlow Condensed',system-ui,sans-serif", overflowX:'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}body{background:#050505}
      `}</style>

      {/* Rodada encerrada — mostra apuração em vez do campo editável */}
      {RODADA_ENCERRADA && Object.values(lineup).some(Boolean) && (
        <ResultadoScreen
          lineup={lineup} formation={formation}
          captainId={captainId} heroId={heroId}
          scoreTigre={scoreTigre} scoreAdv={scoreAdv}
          onGoRanking={handleGoRanking}
        />
      )}

      {/* HUD só aparece quando não está na tela de resultado */}
      {!(RODADA_ENCERRADA && Object.values(lineup).some(Boolean)) && (
        <HUD step={step} filled={fieldCount} benchFilled={benchCount} formation={formation}/>
      )}

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
              scoreTigre={scoreTigre} scoreAdv={scoreAdv} onReset={handleGoHome}/>
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
