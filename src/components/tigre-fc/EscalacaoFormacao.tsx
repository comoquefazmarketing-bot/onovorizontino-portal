'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

// ── Assets ────────────────────────────────────────────────
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

// ── Tipagem ───────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type SlotState = { player: Player | null; x: number; y: number; label: string };
type SlotMap = Record<string, SlotState>;
type Step = 'formation' | 'arena' | 'summary';

interface ArenaTigreFCProps { jogoId?: number; }

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
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'rb', x:82, y:65, label:'LD' },
    { id:'cb1', x:62, y:75, label:'ZAG' }, { id:'cb2', x:38, y:75, label:'ZAG' },
    { id:'lb', x:18, y:65, label:'LE' }, { id:'cm1', x:50, y:58, label:'VOL' },
    { id:'cm2', x:32, y:45, label:'MC' }, { id:'cm3', x:68, y:45, label:'MC' },
    { id:'rw', x:78, y:22, label:'PD' }, { id:'st', x:50, y:15, label:'CA' },
    { id:'lw', x:22, y:22, label:'PE' }
  ],
  '4-4-2': [
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'rb', x:82, y:65, label:'LD' },
    { id:'cb1', x:62, y:75, label:'ZAG' }, { id:'cb2', x:38, y:75, label:'ZAG' },
    { id:'lb', x:18, y:65, label:'LE' }, { id:'cm1', x:40, y:52, label:'MC' },
    { id:'cm2', x:60, y:52, label:'MC' }, { id:'rm', x:80, y:42, label:'MD' },
    { id:'lm', x:20, y:42, label:'ME' }, { id:'st1', x:40, y:20, label:'ATA' },
    { id:'st2', x:60, y:20, label:'ATA' }
  ],
  '3-5-2': [
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'cb1', x:50, y:75, label:'ZAG' },
    { id:'cb2', x:70, y:70, label:'ZAG' }, { id:'cb3', x:30, y:70, label:'ZAG' },
    { id:'rm', x:85, y:45, label:'ALA' }, { id:'lm', x:15, y:45, label:'ALA' },
    { id:'dm', x:50, y:55, label:'VOL' }, { id:'cm1', x:35, y:42, label:'MC' },
    { id:'cm2', x:65, y:42, label:'MC' }, { id:'st1', x:40, y:20, label:'ATA' },
    { id:'st2', x:60, y:20, label:'ATA' }
  ],
  '4-2-3-1': [
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'rb', x:82, y:65, label:'LD' },
    { id:'cb1', x:62, y:75, label:'ZAG' }, { id:'cb2', x:38, y:75, label:'ZAG' },
    { id:'lb', x:18, y:65, label:'LE' }, { id:'dm1', x:40, y:58, label:'VOL' },
    { id:'dm2', x:60, y:58, label:'VOL' }, { id:'am', x:50, y:40, label:'MEI' },
    { id:'rw', x:80, y:30, label:'PD' }, { id:'lw', x:20, y:30, label:'PE' },
    { id:'st', x:50, y:15, label:'CA' }
  ],
  '5-3-2': [
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'rb', x:85, y:60, label:'LD' },
    { id:'lb', x:15, y:60, label:'LE' }, { id:'cb1', x:50, y:75, label:'ZAG' },
    { id:'cb2', x:68, y:72, label:'ZAG' }, { id:'cb3', x:32, y:72, label:'ZAG' },
    { id:'cm1', x:50, y:50, label:'MC' }, { id:'cm2', x:30, y:45, label:'MC' },
    { id:'cm3', x:70, y:45, label:'MC' }, { id:'st1', x:42, y:20, label:'ATA' },
    { id:'st2', x:58, y:20, label:'ATA' }
  ],
  '3-4-3': [
    { id:'gk', x:50, y:85, label:'GOL' }, { id:'cb1', x:50, y:75, label:'ZAG' },
    { id:'cb2', x:70, y:70, label:'ZAG' }, { id:'cb3', x:30, y:70, label:'ZAG' },
    { id:'cm1', x:42, y:50, label:'MC' }, { id:'cm2', x:58, y:50, label:'MC' },
    { id:'rm', x:85, y:45, label:'MD' }, { id:'lm', x:15, y:45, label:'ME' },
    { id:'rw', x:75, y:22, label:'PD' }, { id:'st', x:50, y:15, label:'CA' },
    { id:'lw', x:25, y:22, label:'PE' }
  ]
};

// ── Mercado & Cards ───────────────────────────────────────
function MarketCard({ player, isEscalado, isOrigin, onClick, onDragStart, onDragEnd }: any) {
  return (
    <motion.div
      drag dragMomentum={false} onDragStart={onDragStart} onDragEnd={(_, info) => onDragEnd(info)}
      onClick={onClick}
      className={`relative h-20 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing flex items-stretch transition-all ${
        isOrigin ? 'border-cyan-400 shadow-[0_0_15px_cyan]' : 
        isEscalado ? 'border-yellow-500/50 opacity-40' : 'border-white/10 bg-zinc-900/80'
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

function FieldCard({ player, label, isSelected, scale, onClick, onDragStart, onDragEnd, fieldRef }: any) {
  const size = 78 * scale;
  return (
    <motion.div
      drag dragMomentum={false} dragConstraints={fieldRef}
      onDragStart={onDragStart} onDragEnd={(_, info) => onDragEnd(info)}
      onClick={onClick}
      style={{ width: size, height: size * 1.3, zIndex: isSelected ? 100 : 10 }}
      className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center cursor-move ${
        isSelected ? 'border-yellow-400 shadow-[0_0_20px_yellow]' :
        player ? 'border-white/40 bg-black/40' : 'border-dashed border-white/20 bg-black/20'
      }`}
    >
      {player ? (
        <>
          <img src={player.foto} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 w-full p-1 text-center">
            <p className="text-[9px] font-black text-white uppercase truncate">{player.short}</p>
            <p className="text-[7px] text-yellow-500 font-black">{player.pos}</p>
          </div>
        </>
      ) : (
        <span className="text-[10px] font-black text-white/30">{label}</span>
      )}
    </motion.div>
  );
}

export default function ArenaTigreFC({ jogoId }: ArenaTigreFCProps) {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [bench, setBench] = useState<(Player | null)[]>(Array(7).fill(null));
  const [origin, setOrigin] = useState<any>(null);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initial: SlotMap = {};
    FORMATIONS[formation].forEach(s => {
      initial[s.id] = { player: null, x: s.x, y: s.y, label: s.label };
    });
    setSlotMap(initial);
  }, [formation]);

  const handleResetPos = () => {
    const defaultCoords = FORMATIONS[formation];
    setSlotMap(prev => {
      const newMap = { ...prev };
      defaultCoords.forEach(d => {
        if (newMap[d.id]) {
          newMap[d.id].x = d.x;
          newMap[d.id].y = d.y;
        }
      });
      return newMap;
    });
  };

  const handleDrop = (point: { x: number, y: number }) => {
    if (!origin || !fieldRef.current) return;
    const rect = fieldRef.current.getBoundingClientRect();
    const rx = ((point.x - rect.left) / rect.width) * 100;
    const ry = ((point.y - rect.top) / rect.height) * 100;

    const targetSlot = Object.keys(slotMap).find(id => {
      const s = slotMap[id];
      return Math.sqrt(Math.pow(s.x - rx, 2) + Math.pow(s.y - ry, 2)) < 8;
    });

    if (targetSlot) {
      const targetPlayer = slotMap[targetSlot].player;
      setSlotMap(prev => ({ ...prev, [targetSlot]: { ...prev[targetSlot], player: origin.player } }));
      if (origin.type === 'field') setSlotMap(prev => ({ ...prev, [origin.id]: { ...prev[origin.id], player: targetPlayer } }));
      else if (origin.type === 'bench') { const nb = [...bench]; nb[origin.id] = targetPlayer; setBench(nb); }
    } else if (origin.type === 'field') {
      setSlotMap(prev => ({ ...prev, [origin.id]: { ...prev[origin.id], x: rx, y: ry } }));
    }
    setOrigin(null);
  };

  return (
    <div className="h-screen bg-black text-white font-sans overflow-hidden flex flex-col">
      {step === 'formation' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
          <h1 className="text-4xl font-black italic text-yellow-500 mb-8">ARENA TIGRE FC</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
            {Object.keys(FORMATIONS).map(f => (
              <button key={f} onClick={() => { setFormation(f as any); setStep('arena'); }}
                className="p-6 border-2 border-white/5 bg-zinc-900 rounded-2xl text-2xl font-black hover:border-yellow-500 active:scale-95 transition-all"
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 border-r border-white/5 bg-zinc-900/50 p-4 overflow-y-auto space-y-2">
            <p className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mb-4">Elenco</p>
            {PLAYERS.map(p => (
              <MarketCard key={p.id} player={p} 
                isEscalado={Object.values(slotMap).some(s => s.player?.id === p.id) || bench.some(b => b?.id === p.id)}
                isOrigin={origin?.player.id === p.id}
                onClick={() => activeSlot ? (setSlotMap(prev => ({...prev, [activeSlot]: {...prev[activeSlot], player: p}})), setActiveSlot(null)) : setOrigin({type:'market', player:p})}
                onDragStart={() => setOrigin({type:'market', player:p})}
                onDragEnd={(pt:any) => handleDrop(pt)}
              />
            ))}
          </div>

          <div className="flex-1 flex flex-col relative bg-zinc-950">
            <div ref={fieldRef} className="flex-1 relative m-4 border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-60" />
              
              {/* Botões Flutuantes */}
              <div className="absolute top-4 right-4 flex gap-2 z-[100]">
                <button onClick={handleResetPos} title="Reorganizar Formação" className="p-3 bg-black/60 border border-white/10 rounded-full hover:bg-yellow-500 hover:text-black transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button onClick={() => setStep('summary')} className="px-6 py-2 bg-yellow-500 text-black font-black italic rounded-full shadow-lg">FINALIZAR →</button>
              </div>

              {Object.entries(slotMap).map(([id, s]) => (
                <div key={id} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -50%)' }}>
                  <FieldCard player={s.player} label={s.label} scale={0.75 + (s.y/250)} isSelected={activeSlot === id}
                    fieldRef={fieldRef}
                    onClick={() => s.player ? setOrigin({type:'field', id, player:s.player}) : setActiveSlot(id)}
                    onDragStart={() => s.player && setOrigin({type:'field', id, player:s.player})}
                    onDragEnd={(pt:any) => handleDrop(pt)}
                  />
                </div>
              ))}
            </div>

            {/* Banco de Reservas */}
            <div className="h-32 bg-black/80 p-4 border-t border-white/5">
              <div className="flex gap-2 h-full">
                {bench.map((p, i) => (
                  <div key={i} onClick={() => origin && (setBench(prev => {const nb=[...prev]; nb[i]=origin.player; return nb;}), setOrigin(null))}
                    className="flex-1 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden bg-white/5"
                  >
                    {p ? <img src={p.foto} className="w-full h-full object-cover" style={{objectPosition:'50% 10%'}} /> : <span className="text-[10px] font-black text-white/20">R{i+1}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'summary' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
          <div className="bg-zinc-900 p-8 rounded-3xl border border-white/10 w-full max-w-md text-center">
            <h2 className="text-2xl font-black italic text-yellow-500 mb-6 uppercase">Escalação Pronta</h2>
            <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-left mb-6 space-y-1">
              {Object.values(slotMap).map(s => s.player && <p key={s.player.id} className="text-xs font-bold uppercase"><span className="text-yellow-500">{s.player.num}</span> • {s.player.name}</p>)}
            </div>
            <button onClick={() => setStep('arena')} className="w-full py-4 text-zinc-500 font-bold hover:text-white mb-2">VOLTAR E AJUSTAR</button>
            <button onClick={() => window.location.reload()} className="w-full py-4 bg-yellow-500 text-black font-black italic rounded-xl">RECOMEÇAR</button>
          </div>
          <p className="mt-8 text-[9px] text-zinc-600 font-black tracking-[0.3em] uppercase">Criado por Felipe Makarios • Arena Tigre FC</p>
        </div>
      )}
    </div>
  );
}
