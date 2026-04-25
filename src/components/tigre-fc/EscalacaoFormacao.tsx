'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

// ── Assets & Config ───────────────────────────────────────
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type SlotState = { player: Player | null; x: number; y: number; label: string };
type SlotMap = Record<string, SlotState>;
type Step = 'formation' | 'arena' | 'summary';

interface ArenaTigreFCProps {
  jogoId?: number;
}

// ── Lista de Jogadores ────────────────────────────────────
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
  { id:36, name:'Titi Ortiz',       short:'Titi Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão',           short:'Carlão',     num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald',     num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS = {
  '4-3-3': [
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'rb', x:85, y:65, label:'LD' },
    { id:'cb1', x:65, y:75, label:'ZAG' }, { id:'cb2', x:35, y:75, label:'ZAG' },
    { id:'lb', x:15, y:65, label:'LE' }, { id:'cm1', x:50, y:55, label:'VOL' },
    { id:'cm2', x:30, y:45, label:'MC' }, { id:'cm3', x:70, y:45, label:'MC' },
    { id:'rw', x:80, y:25, label:'PD' }, { id:'st', x:50, y:15, label:'CA' },
    { id:'lw', x:20, y:25, label:'PE' }
  ],
  '4-4-2': [
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'rb', x:85, y:65, label:'LD' },
    { id:'cb1', x:65, y:75, label:'ZAG' }, { id:'cb2', x:35, y:75, label:'ZAG' },
    { id:'lb', x:15, y:65, label:'LE' }, { id:'cm1', x:40, y:50, label:'MC' },
    { id:'cm2', x:60, y:50, label:'MC' }, { id:'rm', x:80, y:45, label:'MD' },
    { id:'lm', x:20, y:45, label:'ME' }, { id:'st1', x:40, y:20, label:'ATA' },
    { id:'st2', x:60, y:20, label:'ATA' }
  ]
};

// ── Componentes de UI ─────────────────────────────────────
function MarketCard({ player, isEscalado, isOrigin, onClick, onDragStart, onDragEnd }: any) {
  return (
    <motion.div
      drag dragMomentum={false} onDragStart={onDragStart} onDragEnd={(_, info) => onDragEnd(info)}
      onClick={onClick}
      className={`relative h-20 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing flex items-stretch transition-all ${
        isOrigin ? 'border-cyan-400 shadow-[0_0_15px_cyan]' : 
        isEscalado ? 'border-yellow-500/50 opacity-50' : 'border-white/10 bg-zinc-900/80'
      }`}
    >
      <div className="w-16 bg-black flex-shrink-0">
        <img src={player.foto} className="w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
      </div>
      <div className="flex-1 p-2 flex flex-col justify-center">
        <p className="text-[11px] font-black uppercase truncate">{player.short}</p>
        <p className="text-[9px] text-yellow-500 font-bold">{player.pos} • {player.num}</p>
      </div>
    </motion.div>
  );
}

function FieldCard({ slotId, player, label, isSelected, isOrigin, scale, onClick, onDragStart, onDragEnd, fieldRef }: any) {
  const size = 85 * scale;
  return (
    <motion.div
      drag dragMomentum={false} dragConstraints={fieldRef}
      onDragStart={onDragStart} onDragEnd={(_, info) => onDragEnd(info)}
      onClick={onClick}
      style={{ width: size, height: size * 1.3, zIndex: isSelected ? 100 : 10 }}
      className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center cursor-move ${
        isOrigin ? 'border-cyan-400 shadow-[0_0_20px_cyan]' :
        isSelected ? 'border-yellow-400 shadow-[0_0_20px_yellow]' :
        player ? 'border-white/40 bg-black/40' : 'border-dashed border-white/20 bg-black/20'
      }`}
    >
      {player ? (
        <>
          <img src={player.foto} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-0 w-full p-1 bg-black/60 text-center">
            <p className="text-[9px] font-black text-white uppercase">{player.short}</p>
          </div>
        </>
      ) : (
        <span className="text-[10px] font-black text-white/30">{label}</span>
      )}
    </motion.div>
  );
}

// ── Componente Principal ──────────────────────────────────
export default function ArenaTigreFC({ jogoId }: ArenaTigreFCProps) {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [bench, setBench] = useState<(Player | null)[]>(Array(7).fill(null));
  
  const [origin, setOrigin] = useState<{ type: 'market' | 'field' | 'bench', id: any, player: Player } | null>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  // Iniciar Formação
  useEffect(() => {
    const initial: SlotMap = {};
    FORMATIONS[formation].forEach(s => {
      initial[s.id] = { player: null, x: s.x, y: s.y, label: s.label };
    });
    setSlotMap(initial);
  }, [formation]);

  const updatePos = (id: string, px: number, py: number) => {
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((px - rect.left) / rect.width) * 100;
    const y = ((py - rect.top) / rect.height) * 100;
    setSlotMap(prev => ({ ...prev, [id]: { ...prev[id], x, y } }));
  };

  const handleDrop = (point: { x: number, y: number }) => {
    if (!origin) return;
    
    // 1. Verificar se caiu em um slot pré-existente (Snap)
    const rect = fieldRef.current?.getBoundingClientRect();
    if (!rect) return;
    const rx = ((point.x - rect.left) / rect.width) * 100;
    const ry = ((point.y - rect.top) / rect.height) * 100;

    let targetSlot = Object.keys(slotMap).find(id => {
      const s = slotMap[id];
      return Math.sqrt(Math.pow(s.x - rx, 2) + Math.pow(s.y - ry, 2)) < 8;
    });

    if (targetSlot) {
      const targetPlayer = slotMap[targetSlot].player;
      setSlotMap(prev => ({ ...prev, [targetSlot!]: { ...prev[targetSlot!], player: origin.player } }));
      
      if (origin.type === 'field') {
        setSlotMap(prev => ({ ...prev, [origin.id]: { ...prev[origin.id], player: targetPlayer } }));
      } else if (origin.type === 'bench') {
        const newBench = [...bench];
        newBench[origin.id] = targetPlayer;
        setBench(newBench);
      }
    } else {
      // 2. Movimentação Livre no Campo
      if (origin.type === 'field') {
        updatePos(origin.id, point.x, point.y);
      }
    }
    setOrigin(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans overflow-hidden flex flex-col">
      
      {step === 'formation' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl font-black italic text-yellow-500 mb-2">ARENA TIGRE FC</h1>
          <p className="text-zinc-500 mb-10 font-bold uppercase tracking-widest text-xs">Selecione sua base tática</p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} onClick={() => { setFormation(f as any); setStep('arena'); }}
                className="aspect-square border-2 border-white/5 bg-zinc-900 rounded-3xl flex items-center justify-center text-4xl font-black hover:border-yellow-500 transition-all active:scale-95"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'arena' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Mercado (Esquerda) */}
          <div className="w-72 border-r border-white/5 bg-black/40 p-4 overflow-y-auto space-y-2">
            <p className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mb-4">Elenco Disponível</p>
            {PLAYERS.map(p => {
              const isEscalado = Object.values(slotMap).some(s => s.player?.id === p.id) || bench.some(b => b?.id === p.id);
              return (
                <MarketCard key={p.id} player={p} isEscalado={isEscalado} isOrigin={origin?.player.id === p.id}
                  onClick={() => {
                    if (activeSlot) {
                      setSlotMap(prev => ({ ...prev, [activeSlot]: { ...prev[activeSlot], player: p } }));
                      setActiveSlot(null);
                    } else {
                      setOrigin({ type: 'market', id: p.id, player: p });
                    }
                  }}
                  onDragStart={() => setOrigin({ type: 'market', id: p.id, player: p })}
                  onDragEnd={(pt: any) => handleDrop(pt)}
                />
              );
            })}
          </div>

          {/* Campo Central */}
          <div className="flex-1 relative flex flex-col">
            <div ref={fieldRef} className="flex-1 relative overflow-hidden bg-zinc-900">
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              
              {Object.entries(slotMap).map(([id, s]) => (
                <div key={id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}>
                  <FieldCard slotId={id} player={s.player} label={s.label} scale={0.8 + (s.y/200)}
                    isSelected={activeSlot === id} isOrigin={origin?.type === 'field' && origin.id === id}
                    fieldRef={fieldRef}
                    onClick={() => s.player ? setOrigin({ type: 'field', id, player: s.player }) : setActiveSlot(id)}
                    onDragStart={() => s.player && setOrigin({ type: 'field', id, player: s.player })}
                    onDragEnd={(pt: any) => handleDrop(pt)}
                  />
                </div>
              ))}

              <button onClick={() => setStep('summary')} 
                className="absolute top-6 right-6 px-8 py-3 bg-yellow-500 text-black font-black italic rounded-full shadow-xl hover:scale-105 transition-transform"
              >
                FINALIZAR ESCALAÇÃO →
              </button>
            </div>

            {/* Banco de Reservas (Rodapé do Campo) */}
            <div className="h-40 bg-black/80 border-t border-yellow-500/20 p-4">
              <p className="text-[10px] font-black text-yellow-500 mb-3 tracking-[0.2em] uppercase">Banco de Reservas (7)</p>
              <div className="flex gap-3 h-20">
                {bench.map((p, i) => (
                  <div key={i} className={`flex-1 border-2 border-dashed rounded-lg flex items-center justify-center transition-all ${p ? 'border-white/40' : 'border-white/10 bg-white/5'}`}
                    onClick={() => {
                      if (origin) {
                        const newBench = [...bench];
                        newBench[i] = origin.player;
                        setBench(newBench);
                        if (origin.type === 'field') setSlotMap(prev => ({ ...prev, [origin.id]: { ...prev[origin.id], player: null } }));
                        setOrigin(null);
                      }
                    }}
                  >
                    {p ? (
                      <div className="relative w-full h-full">
                        <img src={p.foto} className="w-full h-full object-cover rounded-lg" style={{ objectPosition: '50% 10%' }} />
                        <div className="absolute bottom-0 w-full text-center bg-black/60 text-[8px] font-bold py-0.5">{p.short}</div>
                      </div>
                    ) : <span className="text-[10px] text-white/20 font-black">R{i+1}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="flex-1 flex flex-col items-center justify-center p-10 bg-zinc-950">
          <div className="bg-zinc-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full text-center space-y-6">
            <h2 className="text-2xl font-black italic text-yellow-500 uppercase">Time Escalado!</h2>
            <div className="space-y-1 text-left bg-black/40 p-4 rounded-xl border border-white/5">
               <p className="text-[10px] text-zinc-500 font-bold uppercase">Titulares</p>
               {Object.values(slotMap).map(s => s.player && <p key={s.player.id} className="text-sm font-bold"> {s.player.num} • {s.player.name}</p>)}
            </div>
            <button onClick={() => setStep('arena')} className="w-full py-4 text-zinc-400 font-bold hover:text-white transition-colors">Voltar e Editar</button>
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-yellow-500 text-black font-black italic rounded-xl">NOVA ESCALAÇÃO</button>
          </div>
          <p className="mt-8 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Criado por Felipe Makarios • Arena Tigre FC</p>
        </div>
      )}
    </div>
  );
}
