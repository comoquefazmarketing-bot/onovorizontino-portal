'use client';

/**
 * ArenaTigreFC v5 — DRAG & DROP + GEOMETRIA AVANÇADA
 * - Drag do mercado → campo, campo → campo (swap), campo → reservas
 * - Click-to-assign bidirecional com glow cyan (origem) / amarelo (destino)
 * - Coordenadas custom persistidas por slot (top%, left%)
 * - Z-index dinâmico durante drag
 * - Geometria de assets: foto à esquerda no mercado, à direita no campo
 * - Criado por Felipe Makarios - Arena Tigre FC
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

// ── Assets ────────────────────────────────────────────────
const BASE       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

// ── Tipos ─────────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type SlotState = { player: Player | null; x: number; y: number };
type SlotMap = Record<string, SlotState>;
type Lineup = Record<string, Player | null>;
type Step   = 'formation' | 'arena' | 'summary';
interface Slot { id: string; x: number; y: number; label: string; pos: string; }

// ── 39 Jogadores ──────────────────────────────────────────
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
  { id:14, name:'Carlinhos',         short:'Carlinhos',  num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
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
  { id:36, name:'Titi Ortiz',       short:'Titi Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão',           short:'Carlão',     num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald',     num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, Slot[]> = {
  '4-3-3': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'rb',  x:80, y:68, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:72, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:20, y:68, pos:'LAT', label:'LE'  },
    { id:'cm1', x:32, y:50, pos:'MEI', label:'MC'  },
    { id:'cm2', x:50, y:54, pos:'VOL', label:'VOL' },
    { id:'cm3', x:68, y:50, pos:'MEI', label:'MC'  },
    { id:'rw',  x:70, y:30, pos:'ATA', label:'PD'  },
    { id:'st',  x:50, y:25, pos:'ATA', label:'CA'  },
    { id:'lw',  x:30, y:30, pos:'ATA', label:'PE'  },
  ],
  '4-4-2': [
    { id:'gk',  x:50, y:82, pos:'GOL', label:'GOL' },
    { id:'rb',  x:80, y:68, pos:'LAT', label:'LD'  },
    { id:'cb1', x:62, y:72, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:38, y:72, pos:'ZAG', label:'ZAG' },
    { id:'lb',  x:20, y:68, pos:'LAT', label:'LE'  },
    { id:'rm',  x:75, y:48, pos:'MEI', label:'MD'  },
    { id:'cm1', x:40, y:52, pos:'MEI', label:'MC'  },
    { id:'cm2', x:60, y:52, pos:'MEI', label:'MC'  },
    { id:'lm',  x:25, y:48, pos:'MEI', label:'ME'  },
    { id:'st1', x:42, y:28, pos:'ATA', label:'ATA' },
    { id:'st2', x:58, y:28, pos:'ATA', label:'ATA' },
  ]
};

function scalePorY(y: number): number {
  const min = 0.95, max = 1.45;
  const norm = Math.max(0, Math.min(1, (y - 25) / (82 - 25)));
  return min + norm * (max - min);
}

// ── Componente MarketCard (Foto à Esquerda) ────────────────
function MarketCard({ player, onClick, onDragStart, onDragEnd, isEscalado, isOriginSelected }: any) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(info)}
      onClick={onClick}
      className={`relative h-[88px] rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing flex items-stretch transition-all ${
        isOriginSelected ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_20px_cyan]' : 
        isEscalado ? 'border-yellow-500/60 bg-yellow-500/10' : 'border-white/10 bg-zinc-900/60'
      }`}
    >
      <div className="relative w-[88px] flex-shrink-0 bg-black">
        <img src={player.foto} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 12%' }} />
      </div>
      <div className="flex-1 px-3 py-2 flex flex-col justify-between">
        <div>
          <p className="text-[12px] font-black text-white uppercase truncate leading-tight">{player.short}</p>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{player.pos}</p>
        </div>
        <span className="text-yellow-500 text-[14px] font-black italic">{player.num}</span>
      </div>
    </motion.div>
  );
}

// ── Componente FieldCard (Foto à Direita) ───────────────────
function FieldCard({ player, label, isSelected, isOriginSelected, onClick, onDragStart, onDragEnd, scale, draggable }: any) {
  const W = Math.round(92 * scale);
  const H = Math.round(124 * scale);

  return (
    <motion.div
      drag={draggable}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(info)}
      onClick={onClick}
      style={{ width: W, height: H, zIndex: isSelected ? 9999 : 'auto' }}
      className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center ${
        isOriginSelected ? 'border-cyan-400 shadow-[0_0_25px_cyan]' :
        isSelected ? 'border-yellow-500 shadow-[0_0_25px_rgba(245,196,0,0.8)]' :
        player ? 'border-white/30' : 'border-yellow-500/40 border-dashed bg-black/50'
      }`}
    >
      {player ? (
        <>
          <img src={player.foto} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '70% 10%' }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
          <div className="absolute bottom-0 w-full p-1 bg-black/90 text-center border-t border-white/10">
            <p className="text-[10px] font-black text-white uppercase">{player.short}</p>
            <p className="text-[8px] text-yellow-500 font-bold">{player.pos} · {player.num}</p>
          </div>
        </>
      ) : (
        <span className="text-yellow-500/50 text-[10px] font-black">{label}</span>
      )}
    </motion.div>
  );
}

export default function ArenaTigreFC() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [originPlayer, setOriginPlayer] = useState<Player | null>(null);
  const [originSlot, setOriginSlot] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial: SlotMap = {};
    FORMATIONS[formation].forEach(s => {
      initial[s.id] = { player: null, x: s.x, y: s.y };
    });
    setSlotMap(initial);
  }, [formation]);

  const assignPlayer = (player: Player, targetId: string, fromId: string | null) => {
    const prevTargetPlayer = slotMap[targetId]?.player;
    setSlotMap(prev => ({
      ...prev,
      [targetId]: { ...prev[targetId], player }
    }));
    if (fromId) {
      setSlotMap(prev => ({
        ...prev,
        [fromId]: { ...prev[fromId], player: prevTargetPlayer }
      }));
    }
  };

  const findSlotAtPoint = (px: number, py: number) => {
    const fieldRect = fieldRef.current?.getBoundingClientRect();
    if (!fieldRect) return null;
    const relX = ((px - fieldRect.left) / fieldRect.width) * 100;
    const relY = ((py - fieldRect.top) / fieldRect.height) * 100;
    
    let closest = null;
    for (const [id, st] of Object.entries(slotMap)) {
      const d = Math.sqrt(Math.pow(st.x - relX, 2) + Math.pow(st.y - relY, 2));
      if (d < 10) closest = id;
    }
    return closest;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      {step === 'formation' ? (
        <div className="h-screen flex flex-col items-center justify-center bg-zinc-950">
          <h1 className="text-5xl font-black italic mb-10 text-yellow-500">ARENA TIGRE FC</h1>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} onClick={() => {setFormation(f); setStep('arena')}} className="p-10 border-2 border-white/10 rounded-2xl text-3xl font-black hover:border-yellow-500">{f}</button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-screen">
          {/* Mercado - Lado Esquerdo */}
          <div className="w-80 h-full overflow-y-auto bg-zinc-900/50 p-4 space-y-2 border-r border-white/10">
            <p className="text-[10px] font-black text-yellow-500 tracking-widest mb-4">MERCADO DE ATLETAS</p>
            {PLAYERS.map(p => (
              <MarketCard 
                key={p.id} 
                player={p} 
                isOriginSelected={originPlayer?.id === p.id && !originSlot}
                isEscalado={Object.values(slotMap).some(s => s.player?.id === p.id)}
                onClick={() => {
                  if(activeSlot) { assignPlayer(p, activeSlot, null); setActiveSlot(null); }
                  else { setOriginPlayer(p); setOriginSlot(null); }
                }}
                onDragStart={() => { setOriginPlayer(p); setOriginSlot(null); }}
                onDragEnd={(info: PanInfo) => {
                  const target = findSlotAtPoint(info.point.x, info.point.y);
                  if(target) assignPlayer(p, target, null);
                  setOriginPlayer(null);
                }}
              />
            ))}
          </div>

          {/* Campo - Central */}
          <div ref={fieldRef} className="flex-1 relative bg-zinc-900 overflow-hidden">
            <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            {Object.entries(slotMap).map(([id, st]) => (
              <div key={id} className="absolute" style={{ left: `${st.x}%`, top: `${st.y}%`, transform: 'translate(-50%, -50%)', zIndex: activeSlot === id ? 50 : 10 }}>
                <FieldCard 
                  player={st.player} 
                  label={id.toUpperCase()} 
                  scale={scalePorY(st.y)}
                  isSelected={activeSlot === id}
                  isOriginSelected={originSlot === id}
                  draggable={!!st.player}
                  onClick={() => {
                    if(originPlayer) { assignPlayer(originPlayer, id, originSlot); setOriginPlayer(null); setOriginSlot(null); }
                    else if(st.player) { setOriginPlayer(st.player); setOriginSlot(id); }
                    else { setActiveSlot(id); }
                  }}
                  onDragStart={() => { if(st.player) { setOriginPlayer(st.player); setOriginSlot(id); } }}
                  onDragEnd={(info: PanInfo) => {
                    const target = findSlotAtPoint(info.point.x, info.point.y);
                    if(target && target !== id && originPlayer) assignPlayer(originPlayer, target, id);
                    else {
                      const rect = fieldRef.current?.getBoundingClientRect();
                      if(rect) {
                        const nx = ((info.point.x - rect.left) / rect.width) * 100;
                        const ny = ((info.point.y - rect.top) / rect.height) * 100;
                        setSlotMap(prev => ({ ...prev, [id]: { ...prev[id], x: nx, y: ny } }));
                      }
                    }
                    setOriginPlayer(null); setOriginSlot(null);
                  }}
                />
              </div>
            ))}
            
            {/* Créditos Rodapé Técnico */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center bg-black/80 p-4 rounded-xl border border-yellow-500/20 backdrop-blur-md">
              <p className="text-yellow-500 text-[10px] font-black tracking-widest uppercase">Técnico: Enderson Moreira</p>
              <p className="text-white text-[8px] font-bold mt-1 opacity-40">ARENA TIGRE FC • Criado por Felipe Makarios</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
