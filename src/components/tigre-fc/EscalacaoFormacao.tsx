'use client';

/**
 * EscalacaoFormacao — Tigre FC
 * Experiência de escalação estilo PS5 / FIFA26 / EA Sports
 * Campo 3D + estádio + fumaça + cards flutuantes + capitão/herói dramáticos
 * + placar LED + card premium de compartilhamento
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ─── Assets ──────────────────────────────────────────────────────────────────
const BASE    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── Types ────────────────────────────────────────────────────────────────────
type Player  = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup  = Record<string, Player | null>;
type Step    = 'picking' | 'bench' | 'captain_hero' | 'score' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;

// ─── Players ─────────────────────────────────────────────────────────────────
const PLAYERS: Player[] = [
  { id: 1,  name: 'César Augusto',    short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',            short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',      short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',    short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',             short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',       short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Arthur Barbosa',   short: 'A.Barbosa',  num: 22, pos: 'LAT', foto: BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id: 8,  name: 'Sander',           short: 'Sander',     num: 33, pos: 'LAT', foto: BASE+'SANDER.jpg.webp' },
  { id: 9,  name: 'Maykon Jesus',     short: 'Maykon',     num: 27, pos: 'LAT', foto: BASE+'MAYKON-JESUS.jpg.webp' },
  { id: 10, name: 'Dantas',           short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',    short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Patrick',          short: 'Patrick',    num: 4,  pos: 'ZAG', foto: BASE+'PATRICK.jpg.webp' },
  { id: 13, name: 'Gabriel Bahia',    short: 'G.Bahia',    num: 14, pos: 'ZAG', foto: BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id: 14, name: 'Carlinhos',        short: 'Carlinhos',  num: 25, pos: 'ZAG', foto: BASE+'CARLINHOS.jpg.webp' },
  { id: 15, name: 'Alemão',           short: 'Alemão',     num: 28, pos: 'ZAG', foto: BASE+'ALEMAO.jpg.webp' },
  { id: 16, name: 'Renato Palm',      short: 'R.Palm',     num: 24, pos: 'ZAG', foto: BASE+'RENATO-PALM.jpg.webp' },
  { id: 17, name: 'Alvariño',         short: 'Alvariño',   num: 35, pos: 'ZAG', foto: BASE+'IVAN-ALVARINO.jpg.webp' },
  { id: 18, name: 'Bruno Santana',    short: 'B.Santana',  num: 33, pos: 'ZAG', foto: BASE+'BRUNO-SANTANA.jpg.webp' },
  { id: 19, name: 'Luís Oyama',       short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Léo Naldi',        short: 'L.Naldi',    num: 7,  pos: 'MEI', foto: BASE+'LEO-NALDI.jpg.webp' },
  { id: 21, name: 'Rômulo',           short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 22, name: 'Matheus Bianqui',  short: 'Bianqui',    num: 11, pos: 'MEI', foto: BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id: 23, name: 'Juninho',          short: 'Juninho',    num: 20, pos: 'MEI', foto: BASE+'JUNINHO.jpg.webp' },
  { id: 24, name: 'Tavinho',          short: 'Tavinho',    num: 17, pos: 'MEI', foto: BASE+'TAVINHO.jpg.webp' },
  { id: 25, name: 'Diego Galo',       short: 'D.Galo',     num: 29, pos: 'MEI', foto: BASE+'DIEGO-GALO.jpg.webp' },
  { id: 26, name: 'Marlon',           short: 'Marlon',     num: 30, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 27, name: 'Hector Bianchi',   short: 'Hector',     num: 16, pos: 'MEI', foto: BASE+'HECTOR-BIACHI.jpg.webp' },
  { id: 28, name: 'Nogueira',         short: 'Nogueira',   num: 36, pos: 'MEI', foto: BASE+'NOGUEIRA.jpg.webp' },
  { id: 29, name: 'Luiz Gabriel',     short: 'L.Gabriel',  num: 37, pos: 'MEI', foto: BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id: 30, name: 'Jhones Kauê',      short: 'J.Kauê',     num: 50, pos: 'MEI', foto: BASE+'JHONES-KAUE.jpg.webp' },
  { id: 31, name: 'Robson',           short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Vinícius Paiva',   short: 'V.Paiva',    num: 13, pos: 'ATA', foto: BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id: 33, name: 'Hélio Borges',     short: 'H.Borges',   num: 18, pos: 'ATA', foto: BASE+'HELIO-BORGES.jpg.webp' },
  { id: 34, name: 'Jardiel',          short: 'Jardiel',    num: 19, pos: 'ATA', foto: BASE+'JARDIEL.jpg.webp' },
  { id: 35, name: 'Nicolas Careca',   short: 'N.Careca',   num: 21, pos: 'ATA', foto: BASE+'NICOLAS-CARECA.jpg.webp' },
  { id: 36, name: 'Titi Ortiz',       short: 'T.Ortiz',    num: 15, pos: 'ATA', foto: BASE+'TITI-ORTIZ.jpg.webp' },
  { id: 37, name: 'Diego Mathias',    short: 'D.Mathias',  num: 41, pos: 'ATA', foto: BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id: 38, name: 'Carlão',           short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
  { id: 39, name: 'Ronald Barcellos', short: 'Ronald',     num: 23, pos: 'ATA', foto: BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ─── Formation ────────────────────────────────────────────────────────────────
const SLOTS = [
  { id: 'gk',  x: 50, y: 87, pos: 'GOL' },
  { id: 'rb',  x: 82, y: 70, pos: 'LAT' },
  { id: 'cb1', x: 62, y: 76, pos: 'ZAG' },
  { id: 'cb2', x: 38, y: 76, pos: 'ZAG' },
  { id: 'lb',  x: 18, y: 70, pos: 'LAT' },
  { id: 'm1',  x: 50, y: 53, pos: 'MEI' },
  { id: 'm2',  x: 75, y: 45, pos: 'MEI' },
  { id: 'm3',  x: 25, y: 45, pos: 'MEI' },
  { id: 'st',  x: 50, y: 15, pos: 'ATA' },
  { id: 'rw',  x: 80, y: 22, pos: 'ATA' },
  { id: 'lw',  x: 20, y: 22, pos: 'ATA' },
];
const BENCH_IDS = ['b1','b2','b3','b4','b5'];

const POS_COLORS: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#3B82F6', LAT: '#06B6D4', MEI: '#22C55E', ATA: '#EF4444',
};

// ─── Stadium Background ───────────────────────────────────────────────────────
function StadiumBg({ pulse }: { pulse: boolean }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', background:'linear-gradient(180deg,#04080f 0%,#060e18 40%,#071a0a 100%)' }}>
      {/* Stadium lights */}
      {[{x:'8%',y:'5%'},{x:'92%',y:'5%'},{x:'8%',y:'40%'},{x:'92%',y:'40%'}].map((pos,i) => (
        <div key={i} style={{
          position:'absolute', left:pos.x, top:pos.y,
          width:4, height:4, borderRadius:'50%', background:'#fff',
          boxShadow:'0 0 60px 40px rgba(255,255,200,0.12), 0 0 120px 80px rgba(255,255,200,0.06)',
        }} />
      ))}

      {/* Stadium arch silhouette SVG */}
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet"
        style={{ position:'absolute', bottom:0, left:0, right:0, width:'100%', height:'55%', opacity:0.7 }}>
        {/* Left stand */}
        <path d="M0,200 L0,60 Q20,40 60,30 Q100,20 120,40 L120,200 Z" fill="#0a0a0a" />
        <path d="M0,60 Q20,40 60,30 Q100,20 120,40" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
        {/* Right stand */}
        <path d="M400,200 L400,60 Q380,40 340,30 Q300,20 280,40 L280,200 Z" fill="#0a0a0a" />
        <path d="M400,60 Q380,40 340,30 Q300,20 280,40" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
        {/* Back stand */}
        <path d="M120,40 Q200,0 280,40 L280,80 Q200,50 120,80 Z" fill="#080808" />
        <path d="M120,40 Q200,0 280,40" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
        {/* Crowd dots left */}
        {Array.from({length:24}).map((_,i) => (
          <circle key={i} cx={5+(i%6)*18} cy={70+(Math.floor(i/6))*15} r={2.5}
            fill={['#1a3a1a','#243424','#0d2a1a','#1e2e1e'][i%4]} opacity={0.6} />
        ))}
        {/* Crowd dots right */}
        {Array.from({length:24}).map((_,i) => (
          <circle key={i} cx={285+(i%6)*18} cy={70+(Math.floor(i/6))*15} r={2.5}
            fill={['#1a3a1a','#243424','#0d2a1a','#1e2e1e'][i%4]} opacity={0.6} />
        ))}
        {/* Crowd dots back */}
        {Array.from({length:16}).map((_,i) => (
          <circle key={i} cx={125+(i%8)*20} cy={48+(Math.floor(i/8))*16} r={2}
            fill={['#1a3a1a','#243424'][i%2]} opacity={0.5} />
        ))}
      </svg>

      {/* Field fog/smoke */}
      {[
        {left:'10%',bottom:'28%',delay:0},
        {left:'50%',bottom:'25%',delay:1.5},
        {left:'80%',bottom:'30%',delay:0.8},
        {left:'30%',bottom:'22%',delay:2.2},
        {left:'65%',bottom:'20%',delay:1.1},
      ].map((s,i) => (
        <motion.div key={i}
          style={{ position:'absolute', left:s.left, bottom:s.bottom, width:120, height:40, borderRadius:'50%',
            background:'radial-gradient(ellipse,rgba(255,255,255,0.06) 0%,transparent 70%)',
            filter:'blur(16px)', pointerEvents:'none' }}
          animate={{ x:[0,-15,10,0], opacity:[0.4,0.7,0.3,0.4], scale:[1,1.3,0.9,1] }}
          transition={{ duration:6+i, delay:s.delay, repeat:Infinity, ease:'easeInOut' }}
        />
      ))}

      {/* Pulse overlay for captain/hero selection */}
      <AnimatePresence>
        {pulse && (
          <motion.div initial={{opacity:0}} animate={{opacity:[0,0.15,0]}} exit={{opacity:0}}
            transition={{duration:1.5,repeat:Infinity}}
            style={{position:'absolute',inset:0,background:'radial-gradient(circle,rgba(245,196,0,0.2),transparent 70%)',pointerEvents:'none'}} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Empty Slot ───────────────────────────────────────────────────────────────
function EmptySlot({ pos, selected, pulsing, onClick }: {
  pos: string; selected: boolean; pulsing: boolean; onClick: () => void;
}) {
  const col = POS_COLORS[pos] ?? '#555';
  return (
    <motion.button
      onClick={onClick}
      animate={pulsing ? { boxShadow: [`0 0 0 0 ${col}80`, `0 0 0 8px transparent`] } : {}}
      transition={pulsing ? { duration: 0.8, repeat: Infinity } : {}}
      style={{
        width: 42, height: 52, borderRadius: 10,
        border: `2px dashed ${selected ? col : 'rgba(255,255,255,0.2)'}`,
        background: selected ? `${col}20` : 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', gap: 2,
        boxShadow: selected ? `0 0 16px ${col}60` : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, opacity: 0.7 }} />
      <span style={{ fontSize: 7, fontWeight: 900, color: col, letterSpacing: 1.5, textTransform: 'uppercase' }}>{pos}</span>
    </motion.button>
  );
}

// ─── Player Card on Field ─────────────────────────────────────────────────────
function CardOnField({ player, isCaptain, isHero, pulsing, special, onClick }: {
  player: Player; isCaptain: boolean; isHero: boolean;
  pulsing: boolean; special: boolean; onClick: () => void;
}) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : POS_COLORS[player.pos] ?? '#888';
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0, y: -20, opacity: 0 }}
      animate={{
        scale: 1, y: 0, opacity: 1,
        ...(pulsing ? {} : {}),
      }}
      whileHover={{ scale: 1.12, y: -4 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      style={{ position: 'relative', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
    >
      {/* Pulse ring when in captain/hero selection */}
      {pulsing && (
        <motion.div
          animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{
            position: 'absolute', inset: -6, borderRadius: 12,
            border: `2px solid ${col}`,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Special badge (captain C / hero ⭐) */}
      {(isCaptain || isHero) && (
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          style={{
            position: 'absolute', top: -7, right: -5, zIndex: 5,
            background: col, color: '#000', fontSize: 7, fontWeight: 900,
            padding: '2px 4px', borderRadius: 4, lineHeight: 1,
            boxShadow: `0 0 10px ${col}`,
          }}
        >
          {isCaptain ? 'C' : '⭐'}
        </motion.div>
      )}
      {/* Card body */}
      <div style={{
        width: 44, height: 58, borderRadius: 10, overflow: 'hidden',
        border: `2px solid ${col}`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 ${isCaptain || isHero ? '20px' : '6px'} ${col}60`,
        position: 'relative',
      }}>
        <img src={player.foto} alt={player.short}
          style={{ width: '100%', height: '78%', objectFit: 'cover', objectPosition: 'top' }}
          onError={e => { (e.target as HTMLImageElement).src = PATA; }} />
        <div style={{
          position: 'absolute', bottom: 0, width: '100%',
          background: `linear-gradient(135deg,${col}dd,${col}99)`,
          textAlign: 'center', padding: '2px 1px',
        }}>
          <div style={{ fontSize: 6.5, fontWeight: 900, color: '#000', textTransform: 'uppercase', lineHeight: 1.2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', padding: '0 2px' }}>
            {player.short}
          </div>
        </div>
      </div>
      {/* Float shadow */}
      <motion.div
        animate={{ scaleX: [1, 0.7, 1], opacity: [0.4, 0.2, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: 32, height: 6, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)', margin: '2px auto 0',
          filter: 'blur(3px)',
        }}
      />
    </motion.button>
  );
}

// ─── Field 3D ────────────────────────────────────────────────────────────────
function Field3D({ lineup, selectedSlot, onSlotClick, specialMode, captainId, heroId, step }: {
  lineup: Lineup; selectedSlot: string | null;
  onSlotClick: (id: string) => void;
  specialMode: SpecialMode; captainId: number | null; heroId: number | null;
  step: Step;
}) {
  const pulsing = step === 'captain_hero' && specialMode !== null;
  return (
    <div style={{ width: '100%', maxWidth: 440, margin: '0 auto', perspective: '600px', perspectiveOrigin: '50% 20%' }}>
      <div style={{
        position: 'relative', width: '100%', paddingTop: '135%',
        transform: 'rotateX(8deg)', transformOrigin: 'bottom center',
        transformStyle: 'preserve-3d',
      }}>
        {/* Grass */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 16,
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0d3b0d 0%, #145214 25%, #1a6b1a 50%, #145214 75%, #0d3b0d 100%)',
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.3)',
        }}>
          {/* Grass stripes */}
          {Array.from({length:10}).map((_,i) => (
            <div key={i} style={{
              position: 'absolute', left: 0, right: 0,
              top: `${i*10}%`, height: '10%',
              background: i%2===0 ? 'rgba(0,0,0,0.12)' : 'transparent',
            }} />
          ))}
          {/* Field lines */}
          <svg viewBox="0 0 100 135" preserveAspectRatio="none"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.3 }}>
            <rect x="5" y="5" width="90" height="125" stroke="white" strokeWidth="0.8" fill="none" />
            <line x1="5" y1="67.5" x2="95" y2="67.5" stroke="white" strokeWidth="0.6" />
            <circle cx="50" cy="67.5" r="12" stroke="white" strokeWidth="0.6" fill="none" />
            <rect x="25" y="5" width="50" height="16" stroke="white" strokeWidth="0.6" fill="none" />
            <rect x="25" y="114" width="50" height="16" stroke="white" strokeWidth="0.6" fill="none" />
            <rect x="35" y="5" width="30" height="7" stroke="white" strokeWidth="0.5" fill="none" />
            <rect x="35" y="123" width="30" height="7" stroke="white" strokeWidth="0.5" fill="none" />
            <circle cx="50" cy="5" r="1.5" fill="white" />
            <circle cx="50" cy="130" r="1.5" fill="white" />
          </svg>
          {/* Fog at ground level */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0, height:'18%',
            background:'linear-gradient(0deg,rgba(200,230,200,0.08) 0%,transparent 100%)',
            pointerEvents:'none',
          }} />
        </div>

        {/* Slots and players */}
        <div style={{ position:'absolute', inset:0 }}>
          {SLOTS.map(slot => {
            const player = lineup[slot.id] ?? null;
            const isSelected = selectedSlot === slot.id;
            const isPulsing = pulsing && !!player;
            return (
              <div key={slot.id}
                onClick={() => onSlotClick(slot.id)}
                style={{
                  position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`,
                  transform:'translate(-50%,-50%)',
                  zIndex: isSelected ? 20 : player ? 10 : 5,
                  cursor:'pointer',
                }}>
                {player ? (
                  <CardOnField
                    player={player}
                    isCaptain={captainId === player.id}
                    isHero={heroId === player.id}
                    pulsing={isPulsing}
                    special={captainId === player.id || heroId === player.id}
                    onClick={() => onSlotClick(slot.id)}
                  />
                ) : (
                  <EmptySlot pos={slot.pos} selected={isSelected} pulsing={false} onClick={() => onSlotClick(slot.id)} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Bench Seats ─────────────────────────────────────────────────────────────
function BenchArea({ lineup, selectedSlot, onSlotClick }: {
  lineup: Lineup; selectedSlot: string | null; onSlotClick: (id: string) => void;
}) {
  return (
    <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ fontSize: 8, fontWeight: 900, color: '#444', letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>
        🪑 Banco de Reservas
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {BENCH_IDS.map((id, i) => {
          const player = lineup[id] ?? null;
          const isSelected = selectedSlot === id;
          return (
            <div key={id} onClick={() => onSlotClick(id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              {/* Bench seat */}
              <div style={{
                width: 44, height: 12, borderRadius: '6px 6px 0 0',
                background: player ? 'rgba(245,196,0,0.3)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${player ? 'rgba(245,196,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
              }} />
              {/* Player or empty */}
              {player ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  style={{ position: 'relative' }}>
                  <div style={{
                    width: 44, height: 54, borderRadius: 8, overflow: 'hidden',
                    border: `1.5px solid ${POS_COLORS[player.pos] ?? '#444'}`,
                    boxShadow: `0 4px 12px rgba(0,0,0,0.8)`,
                  }}>
                    <img src={player.foto} style={{ width: '100%', height: '75%', objectFit: 'cover', objectPosition: 'top' }}
                      onError={e => { (e.target as HTMLImageElement).src = PATA; }} />
                    <div style={{ background: POS_COLORS[player.pos] ?? '#444', textAlign: 'center', padding: '1px 2px' }}>
                      <div style={{ fontSize: 6, fontWeight: 900, color: '#000', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {player.short}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div style={{
                  width: 44, height: 54, borderRadius: 8,
                  border: `2px dashed ${isSelected ? '#F5C400' : 'rgba(255,255,255,0.1)'}`,
                  background: isSelected ? 'rgba(245,196,0,0.1)' : 'rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 16, opacity: 0.3 }}>+</span>
                </div>
              )}
              <div style={{ fontSize: 7, color: '#333', fontWeight: 700 }}>R{i+1}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Player Picker ────────────────────────────────────────────────────────────
function PlayerPicker({ lineup, filterPos, setFilterPos, onSelect, step }: {
  lineup: Lineup; filterPos: string; setFilterPos: (p: string) => void;
  onSelect: (p: Player) => void; step: Step;
}) {
  const usedIds = useMemo(() => new Set(Object.values(lineup).filter(Boolean).map(p => p!.id)), [lineup]);
  const filtered = useMemo(
    () => PLAYERS.filter(p => !usedIds.has(p.id) && (filterPos === 'TODOS' || p.pos === filterPos)),
    [usedIds, filterPos]
  );
  const FILTERS = ['TODOS','GOL','ZAG','LAT','MEI','ATA'];
  return (
    <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 12px', overflowX: 'auto' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilterPos(f)}
            style={{
              padding: '5px 12px', borderRadius: 20, fontSize: 9, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: 1, cursor: 'pointer', whiteSpace: 'nowrap',
              background: filterPos === f ? '#F5C400' : 'rgba(255,255,255,0.05)',
              color: filterPos === f ? '#000' : '#555',
              border: filterPos === f ? 'none' : '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.2s',
            }}>
            {f}
          </button>
        ))}
      </div>
      {/* Label */}
      <div style={{ padding: '0 12px 6px', fontSize: 9, color: '#333', fontWeight: 700 }}>
        {step === 'bench' ? '🪑 Escolha os reservas' : '⚽ Selecione um jogador'}
        {filtered.length === 0 && <span style={{ color: '#22C55E', marginLeft: 8 }}>Todos escalados! ✓</span>}
      </div>
      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, padding: '0 12px 16px', maxHeight: 200, overflowY: 'auto' }}>
        {filtered.map(p => {
          const col = POS_COLORS[p.pos] ?? '#555';
          return (
            <motion.button key={p.id} onClick={() => onSelect(p)}
              whileTap={{ scale: 0.93 }} whileHover={{ scale: 1.05 }}
              style={{
                background: '#111', border: `1.5px solid rgba(${col === '#F5C400' ? '245,196,0' : '255,255,255'},0.1)`,
                borderRadius: 10, overflow: 'hidden', cursor: 'pointer', padding: 0,
              }}>
              <img src={p.foto} style={{ width: '100%', aspectRatio: '1/1.1', objectFit: 'cover', objectPosition: 'top' }}
                onError={e => { (e.target as HTMLImageElement).src = PATA; }} />
              <div style={{ padding: '3px 2px', background: '#111' }}>
                <div style={{ fontSize: 7, color: col, fontWeight: 900, letterSpacing: 0.5 }}>{p.pos}</div>
                <div style={{ fontSize: 8, color: '#fff', fontWeight: 700, textTransform: 'uppercase',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.short}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Captain/Hero Dramatic Screen ────────────────────────────────────────────
function CaptainHeroScreen({ onSelectMode, captainId, heroId, done }: {
  onSelectMode: (m: SpecialMode) => void;
  captainId: number | null; heroId: number | null;
  done: boolean;
}) {
  const captain = captainId ? PLAYERS.find(p => p.id === captainId) : null;
  const hero    = heroId    ? PLAYERS.find(p => p.id === heroId)    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'linear-gradient(180deg,#000 0%,#0a0400 50%,#000 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24,
      }}>
      {/* Stars BG */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({length:40}).map((_,i) => (
          <motion.div key={i}
            style={{ position:'absolute', width:2, height:2, borderRadius:'50%', background:'white',
              left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, opacity:0 }}
            animate={{ opacity:[0,0.8,0], scale:[0,1,0] }}
            transition={{ duration:Math.random()*3+1, delay:Math.random()*4, repeat:Infinity }}
          />
        ))}
      </div>

      <motion.div initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ textAlign: 'center', marginBottom: 36, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', letterSpacing: 6, textTransform: 'uppercase', marginBottom: 8 }}>
          É HORA DA DECISÃO
        </div>
        <h2 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize: 38, fontWeight: 900,
          color: '#fff', textTransform: 'uppercase', letterSpacing: -1, lineHeight: 1, margin: '0 0 8px' }}>
          ESCOLHA SEU<br /><span style={{ color: '#F5C400' }}>CAPITÃO & HERÓI</span>
        </h2>
        <p style={{ fontSize: 12, color: '#555', fontWeight: 600 }}>Toque no botão, depois no jogador no campo</p>
      </motion.div>

      {/* Captain button — meteor effect */}
      <motion.div
        initial={{ y: -200, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.4 }}
        style={{ position: 'relative', zIndex: 1, marginBottom: 16, width: '100%', maxWidth: 320 }}
      >
        {/* Spark trail */}
        {!captainId && ['-40px','-28px','-16px'].map((t,i) => (
          <motion.div key={i}
            animate={{ opacity:[0.8,0], scaleY:[1,0.3] }}
            transition={{ duration:0.8, delay:0.4+i*0.05, repeat:Infinity, repeatDelay:2 }}
            style={{ position:'absolute', top:t, left:'50%', transform:'translateX(-50%)',
              width:4, height:20, borderRadius:2,
              background:`linear-gradient(180deg,transparent,rgba(245,196,0,${0.8-i*0.2}))`,
            }} />
        ))}
        <motion.button
          onClick={() => onSelectMode('CAPTAIN')}
          whileTap={{ scale: 0.95 }}
          animate={!captainId ? { boxShadow: ['0 0 20px rgba(245,196,0,0.4)', '0 0 40px rgba(245,196,0,0.8)', '0 0 20px rgba(245,196,0,0.4)'] } : {}}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            width: '100%', padding: '18px', borderRadius: 20,
            background: captainId ? 'rgba(245,196,0,0.15)' : 'linear-gradient(135deg,#F5C400,#D4A200)',
            border: captainId ? '2px solid #F5C400' : 'none',
            color: captainId ? '#F5C400' : '#000',
            fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
          <span style={{ fontSize: 22 }}>©</span>
          {captainId ? (
            <span>✓ Capitão: {captain?.short}</span>
          ) : (
            <span>ESCOLHER CAPITÃO</span>
          )}
        </motion.button>
        {captainId && <div style={{ textAlign:'center', fontSize:9, color:'#444', marginTop:4 }}>Pontos do capitão são DOBRADOS</div>}
      </motion.div>

      {/* Hero button — meteor effect */}
      <motion.div
        initial={{ y: -300, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.6 }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 320, marginBottom: 32 }}
      >
        {!heroId && ['-40px','-28px','-16px'].map((t,i) => (
          <motion.div key={i}
            animate={{ opacity:[0.8,0], scaleY:[1,0.3] }}
            transition={{ duration:0.8, delay:0.6+i*0.05, repeat:Infinity, repeatDelay:2 }}
            style={{ position:'absolute', top:t, left:'50%', transform:'translateX(-50%)',
              width:4, height:20, borderRadius:2,
              background:`linear-gradient(180deg,transparent,rgba(0,243,255,${0.8-i*0.2}))`,
            }} />
        ))}
        <motion.button
          onClick={() => onSelectMode('HERO')}
          whileTap={{ scale: 0.95 }}
          animate={!heroId ? { boxShadow: ['0 0 20px rgba(0,243,255,0.4)', '0 0 40px rgba(0,243,255,0.8)', '0 0 20px rgba(0,243,255,0.4)'] } : {}}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}
          style={{
            width: '100%', padding: '18px', borderRadius: 20,
            background: heroId ? 'rgba(0,243,255,0.15)' : 'linear-gradient(135deg,#00F3FF,#0088CC)',
            border: heroId ? '2px solid #00F3FF' : 'none',
            color: heroId ? '#00F3FF' : '#000',
            fontSize: 14, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          }}>
          <span style={{ fontSize: 22 }}>⭐</span>
          {heroId ? (
            <span>✓ Herói: {hero?.short}</span>
          ) : (
            <span>ESCOLHER HERÓI</span>
          )}
        </motion.button>
        {heroId && <div style={{ textAlign:'center', fontSize:9, color:'#444', marginTop:4 }}>Acerte o herói real e ganhe +10 pts!</div>}
      </motion.div>

      {/* CTA quando ambos escolhidos */}
      <AnimatePresence>
        {captainId && heroId && (
          <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} style={{ width:'100%', maxWidth:320, zIndex:1 }}>
            <button onClick={done as any}
              style={{ width:'100%', padding:'18px', borderRadius:20,
                background:'linear-gradient(135deg,#22C55E,#16A34A)',
                border:'none', color:'#fff', fontSize:14, fontWeight:900,
                textTransform:'uppercase', letterSpacing:2, cursor:'pointer',
                boxShadow:'0 8px 24px rgba(34,197,94,0.4)',
              }}>
              PRÓXIMO → CRAVAR PALPITE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── LED Scoreboard ───────────────────────────────────────────────────────────
function LEDScoreboard({ scoreTigre, setScoreTigre, scoreAdv, setScoreAdv, onConfirm }: {
  scoreTigre: number; setScoreTigre: (n: number) => void;
  scoreAdv: number; setScoreAdv: (n: number) => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:100, background:'#000',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>

      {/* Stadium LED glow */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'40%',
        background:'radial-gradient(ellipse at 50% 0%,rgba(245,196,0,0.06) 0%,transparent 70%)',
        pointerEvents:'none' }} />

      <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.1 }}
        style={{ textAlign:'center', marginBottom:32 }}>
        <div style={{ fontSize:9, fontWeight:900, color:'#F5C400', letterSpacing:5, textTransform:'uppercase', marginBottom:8 }}>
          QUAL SERÁ O PLACAR?
        </div>
        <h2 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:34, fontWeight:900, color:'#fff',
          textTransform:'uppercase', letterSpacing:-1, lineHeight:1, margin:0 }}>
          CRAVE O RESULTADO
        </h2>
      </motion.div>

      {/* LED Scoreboard frame */}
      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.2, type:'spring', stiffness:200 }}
        style={{ width:'100%', maxWidth:380, marginBottom:32, position:'relative' }}>
        {/* Frame */}
        <div style={{
          background:'linear-gradient(145deg,#1a0e00,#2a1800,#1a0e00)',
          border:'2px solid rgba(245,196,0,0.3)', borderRadius:20,
          padding:24, boxShadow:'0 0 40px rgba(245,196,0,0.15), inset 0 0 20px rgba(0,0,0,0.5)',
        }}>
          {/* LED top bar */}
          <div style={{ display:'flex', justifyContent:'center', gap:4, marginBottom:16 }}>
            {Array.from({length:12}).map((_,i) => (
              <motion.div key={i}
                animate={{ opacity:[0.3,1,0.3] }}
                transition={{ duration:0.8, delay:i*0.06, repeat:Infinity }}
                style={{ width:6, height:6, borderRadius:1, background:'#F5C400' }} />
            ))}
          </div>

          {/* Score area */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
            {/* Novorizontino */}
            <div style={{ flex:1, textAlign:'center' }}>
              <img src={ESCUDO} style={{ width:48, height:48, objectFit:'contain', filter:'drop-shadow(0 0 8px rgba(245,196,0,0.5))', margin:'0 auto 8px', display:'block' }} />
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:11, fontWeight:900, color:'#F5C400', textTransform:'uppercase', letterSpacing:1 }}>NOVORIZONTINO</div>
            </div>

            {/* Score controls */}
            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
              {/* Tigre score */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <button onClick={() => setScoreTigre(Math.min(9, scoreTigre + 1))}
                  style={{ width:32, height:32, borderRadius:8, background:'rgba(245,196,0,0.1)', border:'1px solid rgba(245,196,0,0.3)', color:'#F5C400', fontSize:18, fontWeight:900, cursor:'pointer' }}>+</button>
                <div style={{
                  fontFamily:"'Courier New',monospace", fontSize:52, fontWeight:900, color:'#F5C400',
                  textShadow:'0 0 30px rgba(245,196,0,0.8)', lineHeight:1,
                  background:'rgba(0,0,0,0.8)', borderRadius:8, padding:'4px 12px',
                  border:'1px solid rgba(245,196,0,0.2)',
                }}>
                  {scoreTigre}
                </div>
                <button onClick={() => setScoreTigre(Math.max(0, scoreTigre - 1))}
                  style={{ width:32, height:32, borderRadius:8, background:'rgba(245,196,0,0.05)', border:'1px solid rgba(245,196,0,0.2)', color:'#555', fontSize:18, fontWeight:900, cursor:'pointer' }}>−</button>
              </div>

              {/* VS */}
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:20, fontWeight:900, color:'rgba(245,196,0,0.3)', fontStyle:'italic' }}>×</div>

              {/* Adversário score */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                <button onClick={() => setScoreAdv(Math.min(9, scoreAdv + 1))}
                  style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#888', fontSize:18, fontWeight:900, cursor:'pointer' }}>+</button>
                <div style={{
                  fontFamily:"'Courier New',monospace", fontSize:52, fontWeight:900, color:'#ccc',
                  textShadow:'0 0 20px rgba(255,255,255,0.3)', lineHeight:1,
                  background:'rgba(0,0,0,0.8)', borderRadius:8, padding:'4px 12px',
                  border:'1px solid rgba(255,255,255,0.1)',
                }}>
                  {scoreAdv}
                </div>
                <button onClick={() => setScoreAdv(Math.max(0, scoreAdv - 1))}
                  style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', color:'#333', fontSize:18, fontWeight:900, cursor:'pointer' }}>−</button>
              </div>
            </div>

            {/* Adversário */}
            <div style={{ flex:1, textAlign:'center' }}>
              <div style={{ width:48, height:48, margin:'0 auto 8px', background:'rgba(255,255,255,0.05)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:28 }}>⚽</span>
              </div>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:11, fontWeight:900, color:'#555', textTransform:'uppercase', letterSpacing:1 }}>ADVERSÁRIO</div>
            </div>
          </div>

          {/* LED bottom bar */}
          <div style={{ display:'flex', justifyContent:'center', gap:4, marginTop:16 }}>
            {Array.from({length:12}).map((_,i) => (
              <motion.div key={i}
                animate={{ opacity:[0.3,1,0.3] }}
                transition={{ duration:0.8, delay:(11-i)*0.06, repeat:Infinity }}
                style={{ width:6, height:6, borderRadius:1, background:'#F5C400' }} />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
        onClick={onConfirm} whileTap={{ scale:0.95 }}
        style={{ width:'100%', maxWidth:380, padding:'18px', borderRadius:20,
          background:'linear-gradient(135deg,#F5C400,#D4A200)',
          border:'none', color:'#000', fontSize:14, fontWeight:900,
          textTransform:'uppercase', letterSpacing:2, cursor:'pointer',
          boxShadow:'0 8px 28px rgba(245,196,0,0.35)',
        }}>
        🎯 CRAVAR PALPITE → VER MEU TIME
      </motion.button>
    </motion.div>
  );
}

// ─── Premium Share Card ───────────────────────────────────────────────────────
function PremiumShareCard({ lineup, captainId, heroId, scoreTigre, scoreAdv, shareCardRef }: {
  lineup: Lineup; captainId: number | null; heroId: number | null;
  scoreTigre: number; scoreAdv: number; shareCardRef: React.RefObject<HTMLDivElement>;
}) {
  const captain = captainId ? PLAYERS.find(p => p.id === captainId) : null;
  const hero    = heroId    ? PLAYERS.find(p => p.id === heroId)    : null;
  const field   = SLOTS.map(s => lineup[s.id]).filter(Boolean) as Player[];

  const rows = [
    field.filter(p => p.pos === 'ATA'),
    field.filter(p => p.pos === 'MEI'),
    field.filter(p => p.pos === 'ZAG' || p.pos === 'LAT'),
    field.filter(p => p.pos === 'GOL'),
  ].filter(r => r.length > 0);

  return (
    <div ref={shareCardRef} style={{
      width: '100%', maxWidth: 360, margin: '0 auto',
      background: 'linear-gradient(160deg,#0a0a00 0%,#141400 40%,#0d1a00 70%,#050505 100%)',
      borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(245,196,0,0.3)',
      boxShadow: '0 0 60px rgba(245,196,0,0.15)',
      fontFamily: "'Barlow Condensed',Impact,sans-serif",
    }}>
      {/* Gold top bar */}
      <div style={{ height: 4, background: 'linear-gradient(90deg,#D4A200,#F5C400,#D4A200)' }} />

      {/* Header */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(245,196,0,0.1)',
        background: 'linear-gradient(90deg,rgba(245,196,0,0.08),transparent)' }}>
        <img src={ESCUDO} style={{ width: 44, height: 44, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(245,196,0,0.5))' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 7, fontWeight: 900, color: '#F5C400', letterSpacing: 4, textTransform: 'uppercase' }}>TIGRE FC · FANTASY LEAGUE</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.5, lineHeight: 1.1 }}>
            MEU TIME ESTÁ<br /><span style={{ color: '#F5C400' }}>ESCALADO! 🐯</span>
          </div>
        </div>
        <img src={PATA} style={{ width: 36, height: 36, objectFit: 'contain', opacity: 0.5 }} />
      </div>

      {/* Mini field formation */}
      <div style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {row.map(player => {
                const isCap = player.id === captainId;
                const isHero = player.id === heroId;
                const col = isCap ? '#F5C400' : isHero ? '#00F3FF' : POS_COLORS[player.pos] ?? '#555';
                return (
                  <div key={player.id} style={{ textAlign: 'center', position: 'relative' }}>
                    {(isCap || isHero) && (
                      <div style={{ position:'absolute', top:-5, right:-4, background:col, color:'#000',
                        fontSize:6, fontWeight:900, padding:'1px 3px', borderRadius:3, zIndex:2, lineHeight:1 }}>
                        {isCap ? 'C' : '⭐'}
                      </div>
                    )}
                    <div style={{ width:36, height:42, borderRadius:7, overflow:'hidden',
                      border:`1.5px solid ${col}`, boxShadow:`0 0 8px ${col}60` }}>
                      <img src={player.foto} style={{ width:'100%', height:'78%', objectFit:'cover', objectPosition:'top' }}
                        onError={e => { (e.target as HTMLImageElement).src = PATA; }} />
                      <div style={{ background:col, textAlign:'center', padding:'1px' }}>
                        <div style={{ fontSize:5.5, fontWeight:900, color:'#000', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', padding:'0 1px' }}>
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
      </div>

      {/* Stats strip */}
      <div style={{ display:'flex', borderTop:'1px solid rgba(245,196,0,0.1)', borderBottom:'1px solid rgba(245,196,0,0.1)' }}>
        {[
          { label:'Capitão', value: captain?.short ?? '—', icon:'©' },
          { label:'Herói',   value: hero?.short    ?? '—', icon:'⭐' },
          { label:'Palpite', value: `${scoreTigre}×${scoreAdv}`, icon:'🎯' },
        ].map(item => (
          <div key={item.label} style={{ flex:1, textAlign:'center', padding:'10px 4px',
            borderRight:'1px solid rgba(245,196,0,0.08)' }}>
            <div style={{ fontSize:14, marginBottom:2 }}>{item.icon}</div>
            <div style={{ fontSize:12, fontWeight:900, color:'#F5C400', lineHeight:1 }}>{item.value}</div>
            <div style={{ fontSize:6, color:'#444', fontWeight:700, textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* CTA copy */}
      <div style={{ padding:'14px 20px', textAlign:'center' }}>
        <div style={{ fontSize:14, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:-0.3, lineHeight:1.2, marginBottom:6 }}>
          VOCÊ CONSEGUE<br /><span style={{ color:'#F5C400' }}>FAZER MELHOR?</span>
        </div>
        <div style={{ fontSize:10, color:'#444', fontWeight:600, marginBottom:2 }}>
          Monte seu time em onovorizontino.com.br/tigre-fc
        </div>
        <div style={{ fontSize:8, color:'#2a2a2a', fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>
          Série B 2026 · #TigreFC
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ height: 3, background: 'linear-gradient(90deg,#D4A200,#F5C400,#D4A200)' }} />
    </div>
  );
}

// ─── Share Buttons ────────────────────────────────────────────────────────────
function ShareButtons({ lineup, captainId, heroId, scoreTigre, scoreAdv }: {
  lineup: Lineup; captainId: number | null; heroId: number | null;
  scoreTigre: number; scoreAdv: number;
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareText = encodeURIComponent(
    `🐯 Escalei meu time no Tigre FC!\n\nPalpite: Novorizontino ${scoreTigre} × ${scoreAdv}\n\nVocê consegue fazer melhor? 👇\nonovorizontino.com.br/tigre-fc`
  );

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { default: html2canvas } = await import('html2canvas');
      const el = document.getElementById('tigre-fc-share-card');
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: null, useCORS: true, allowTaint: true });
      canvas.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], 'tigre-fc-meu-time.png', { type: 'image/png' });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'Meu time no Tigre FC!', text: '🐯 Escalei meu time!', files: [file] });
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = 'tigre-fc-meu-time.png'; a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch { /* silent */ }
    setDownloading(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText('https://onovorizontino.com.br/tigre-fc');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const BTNS = [
    { label:'WhatsApp',  color:'#25D366', icon:'💬', href:`https://wa.me/?text=${shareText}` },
    { label:'Instagram', color:'#E1306C', icon:'📸', href:`https://instagram.com` },
    { label:'Facebook',  color:'#1877F2', icon:'👥', href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://onovorizontino.com.br/tigre-fc')}` },
    { label:'X/Twitter', color:'#1DA1F2', icon:'🐦', href:`https://twitter.com/intent/tweet?text=${shareText}` },
  ];

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {/* Download/Share */}
      <motion.button onClick={handleDownload} whileTap={{ scale: 0.95 }}
        style={{ width:'100%', padding:'16px', borderRadius:16, marginBottom:12,
          background:'linear-gradient(135deg,#F5C400,#D4A200)', border:'none',
          color:'#000', fontSize:13, fontWeight:900, textTransform:'uppercase', letterSpacing:1.5, cursor:'pointer',
          boxShadow:'0 8px 24px rgba(245,196,0,0.3)',
          display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
        <span style={{ fontSize:18 }}>{downloading ? '⏳' : '📥'}</span>
        {downloading ? 'Gerando...' : 'SALVAR & COMPARTILHAR CARD'}
      </motion.button>

      {/* Social buttons */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
        {BTNS.map(b => (
          <motion.a key={b.label} href={b.href} target="_blank" rel="noreferrer"
            whileTap={{ scale:0.93 }}
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              padding:'10px 4px', borderRadius:12, background:`${b.color}15`,
              border:`1px solid ${b.color}40`, textDecoration:'none', cursor:'pointer' }}>
            <span style={{ fontSize:18 }}>{b.icon}</span>
            <span style={{ fontSize:7, fontWeight:900, color:b.color, textTransform:'uppercase', letterSpacing:0.5 }}>{b.label}</span>
          </motion.a>
        ))}
      </div>

      {/* Copy link */}
      <motion.button onClick={handleCopy} whileTap={{ scale:0.95 }}
        style={{ width:'100%', padding:'12px', borderRadius:12,
          background:copied?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.04)',
          border:`1px solid ${copied?'rgba(34,197,94,0.4)':'rgba(255,255,255,0.08)'}`,
          color:copied?'#22C55E':'#555', fontSize:11, fontWeight:900,
          textTransform:'uppercase', letterSpacing:1, cursor:'pointer' }}>
        {copied ? '✓ Link copiado!' : '🔗 Copiar link do jogo'}
      </motion.button>
    </div>
  );
}

// ─── Header HUD ──────────────────────────────────────────────────────────────
function HUD({ step, filled, benchFilled }: { step: Step; filled: number; benchFilled: number }) {
  const steps = [
    { id:'picking',     label:'Time', num:1 },
    { id:'bench',       label:'Banco', num:2 },
    { id:'captain_hero',label:'Líder', num:3 },
    { id:'score',       label:'Placar', num:4 },
    { id:'share',       label:'Share', num:5 },
  ];
  const currentIdx = steps.findIndex(s => s.id === step);
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px',
      background:'rgba(0,0,0,0.8)', backdropFilter:'blur(8px)',
      borderBottom:'1px solid rgba(245,196,0,0.1)', position:'sticky', top:0, zIndex:50 }}>
      <img src={PATA} style={{ width:24, height:24, objectFit:'contain', filter:'drop-shadow(0 0 6px rgba(245,196,0,0.4))' }} />
      <div style={{ display:'flex', gap:4, alignItems:'center' }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div style={{ display:'flex', alignItems:'center', gap:3 }}>
              <div style={{
                width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                background: i < currentIdx ? '#22C55E' : i === currentIdx ? '#F5C400' : 'rgba(255,255,255,0.08)',
                fontSize: 8, fontWeight:900, color: i <= currentIdx ? '#000' : '#333',
                border: i === currentIdx ? '2px solid #F5C400' : 'none',
              }}>{i < currentIdx ? '✓' : s.num}</div>
              <span style={{ fontSize:7, fontWeight:900, color: i === currentIdx ? '#F5C400' : '#2a2a2a',
                textTransform:'uppercase', letterSpacing:0.5, display: i === currentIdx ? 'block' : 'none' }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width:12, height:1, background: i < currentIdx ? '#22C55E' : 'rgba(255,255,255,0.1)' }} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div style={{ fontSize:9, fontWeight:900, color:'#F5C400', minWidth:40, textAlign:'right' }}>
        {step === 'picking' ? `${filled}/11` : step === 'bench' ? `${benchFilled}/5` : ''}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EscalacaoFormacao() {
  const [step,         setStep]         = useState<Step>('picking');
  const [lineup,       setLineup]       = useState<Lineup>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [filterPos,    setFilterPos]    = useState('TODOS');
  const [captainId,    setCaptainId]    = useState<number | null>(null);
  const [heroId,       setHeroId]       = useState<number | null>(null);
  const [specialMode,  setSpecialMode]  = useState<SpecialMode>(null);
  const [scoreTigre,   setScoreTigre]   = useState(1);
  const [scoreAdv,     setScoreAdv]     = useState(0);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const fieldPlayers = useMemo(() => SLOTS.filter(s => !!lineup[s.id]).length, [lineup]);
  const benchPlayers = useMemo(() => BENCH_IDS.filter(id => !!lineup[id]).length, [lineup]);
  const isFieldFull  = fieldPlayers === 11;
  const isBenchFull  = benchPlayers === 5;

  const handleSlotClick = useCallback((slotId: string) => {
    if (step === 'captain_hero' && specialMode) {
      const player = lineup[slotId];
      if (!player) return;
      if (specialMode === 'CAPTAIN') { setCaptainId(player.id); setSpecialMode(null); }
      else { setHeroId(player.id); setSpecialMode(null); }
      return;
    }
    setSelectedSlot(prev => prev === slotId ? null : slotId);
  }, [step, specialMode, lineup]);

  const handleSelectPlayer = useCallback((player: Player) => {
    if (!selectedSlot) return;
    setLineup(prev => ({ ...prev, [selectedSlot]: player }));
    setSelectedSlot(null);

    // Auto-advance
    const newLineup = { ...lineup, [selectedSlot]: player };
    const newField = SLOTS.filter(s => !!newLineup[s.id]).length;
    const newBench = BENCH_IDS.filter(id => !!newLineup[id]).length;

    if (step === 'picking' && newField === 11) {
      setTimeout(() => {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 }, colors: ['#F5C400','#fff','#22C55E'] });
        setStep('bench');
      }, 300);
    } else if (step === 'bench' && newBench === 5) {
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ['#F5C400','#fff','#EF4444'] });
        setStep('captain_hero');
      }, 300);
    }
  }, [selectedSlot, lineup, step]);

  const handleCaptainHeroDone = useCallback(() => {
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#F5C400','#00F3FF','#fff','#EF4444'] });
    setStep('score');
  }, []);

  const handleScoreConfirm = useCallback(() => {
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#F5C400','#22C55E','#fff'] });
    setStep('share');
  }, []);

  const isCaptainHeroMode = step === 'captain_hero' && specialMode !== null;

  return (
    <div style={{ minHeight:'100vh', background:'#050505', color:'#fff', fontFamily:"'Barlow Condensed',system-ui,sans-serif", overflowX:'hidden' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
        body { background: #050505; }
      `}</style>

      {/* HUD */}
      <HUD step={step} filled={fieldPlayers} benchFilled={benchPlayers} />

      {/* Full-screen overlays */}
      <AnimatePresence>
        {step === 'captain_hero' && (
          <CaptainHeroScreen
            onSelectMode={(mode) => {
              setSpecialMode(mode);
              setStep('captain_hero'); // stay on field to pick
            }}
            captainId={captainId}
            heroId={heroId}
            done={handleCaptainHeroDone as any}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step === 'score' && (
          <LEDScoreboard
            scoreTigre={scoreTigre} setScoreTigre={setScoreTigre}
            scoreAdv={scoreAdv} setScoreAdv={setScoreAdv}
            onConfirm={handleScoreConfirm}
          />
        )}
      </AnimatePresence>

      {/* Share Screen */}
      {step === 'share' && (
        <div style={{ padding: '16px 16px 40px', background: '#050505', minHeight: '100vh' }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ fontSize:9, fontWeight:900, color:'#F5C400', letterSpacing:5, textTransform:'uppercase', marginBottom:6 }}>TIME CONFIRMADO!</div>
            <h2 style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:28, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:-0.5, margin:0 }}>
              SALVE & COMPARTILHE<br /><span style={{ color:'#F5C400' }}>SEU TIME 🐯</span>
            </h2>
          </motion.div>

          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.1 }}>
            <div id="tigre-fc-share-card">
              <PremiumShareCard
                lineup={lineup} captainId={captainId} heroId={heroId}
                scoreTigre={scoreTigre} scoreAdv={scoreAdv}
                shareCardRef={shareCardRef}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }} style={{ marginTop:16 }}>
            <ShareButtons lineup={lineup} captainId={captainId} heroId={heroId} scoreTigre={scoreTigre} scoreAdv={scoreAdv} />
          </motion.div>
        </div>
      )}

      {/* Main Game View (picking / bench) */}
      {(step === 'picking' || step === 'bench') && (
        <>
          {/* Stadium + Field */}
          <div style={{ position:'relative', overflow:'hidden', paddingBottom: 8 }}>
            <StadiumBg pulse={isCaptainHeroMode} />
            <div style={{ position:'relative', zIndex:5, padding:'12px 8px 0' }}>
              {/* Step label */}
              <div style={{ textAlign:'center', marginBottom:8 }}>
                <motion.div key={step}
                  initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
                  style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px', borderRadius:999,
                    background:'rgba(245,196,0,0.1)', border:'1px solid rgba(245,196,0,0.25)' }}>
                  <span style={{ fontSize:7, fontWeight:900, color:'#F5C400', letterSpacing:3, textTransform:'uppercase' }}>
                    {step === 'picking' ? `⚽ Escale ${11 - fieldPlayers} jogador${11-fieldPlayers!==1?'es':''}` : `🪑 Adicione ${5 - benchPlayers} reserva${5-benchPlayers!==1?'s':''}`}
                  </span>
                </motion.div>
              </div>
              <Field3D
                lineup={lineup}
                selectedSlot={selectedSlot}
                onSlotClick={handleSlotClick}
                specialMode={specialMode}
                captainId={captainId}
                heroId={heroId}
                step={step}
              />
            </div>
          </div>

          {/* Bench */}
          {(isFieldFull || step === 'bench') && (
            <BenchArea lineup={lineup} selectedSlot={selectedSlot} onSlotClick={handleSlotClick} />
          )}

          {/* Player Picker */}
          <PlayerPicker
            lineup={lineup}
            filterPos={filterPos}
            setFilterPos={setFilterPos}
            onSelect={handleSelectPlayer}
            step={step}
          />
        </>
      )}

      {/* Captain/Hero selection on field overlay */}
      {step === 'captain_hero' && specialMode && (
        <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'12px 16px', background:'rgba(0,0,0,0.9)', backdropFilter:'blur(8px)',
            borderBottom:'1px solid rgba(245,196,0,0.2)' }}>
            <div style={{ fontSize:11, fontWeight:900, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, textAlign:'center' }}>
              {specialMode === 'CAPTAIN' ? '© TOQUE NO CAPITÃO' : '⭐ TOQUE NO HERÓI DO JOGO'}
            </div>
          </div>
          <div style={{ flex:1, position:'relative', background:'rgba(0,0,0,0.7)', backdropFilter:'blur(4px)' }}>
            <StadiumBg pulse={true} />
            <div style={{ position:'relative', zIndex:5, padding:'12px 8px 0' }}>
              <Field3D
                lineup={lineup} selectedSlot={null}
                onSlotClick={handleSlotClick}
                specialMode={specialMode}
                captainId={captainId} heroId={heroId}
                step={step}
              />
            </div>
          </div>
          <div style={{ padding:'12px 16px', background:'rgba(0,0,0,0.9)', backdropFilter:'blur(8px)' }}>
            <button onClick={() => setSpecialMode(null)}
              style={{ width:'100%', padding:'12px', borderRadius:12,
                background:'transparent', border:'1px solid rgba(255,255,255,0.1)',
                color:'#555', fontSize:11, fontWeight:900, cursor:'pointer', textTransform:'uppercase' }}>
              ← Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
