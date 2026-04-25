'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ── Assets & Config ───────────────────────────────────────
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string; };
type SlotState = { player: Player | null; x: number; y: number; label: string };
type Step = 'formation' | 'starters' | 'reserves' | 'special' | 'prediction' | 'final';

// ── Lista Completa (39 Jogadores) ─────────────────────────
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

const FORMATIONS: Record<string, any[]> = {
  '4-3-3': [{id:'gk',x:50,y:88,label:'GOL'},{id:'rb',x:82,y:68,label:'LD'},{id:'cb1',x:62,y:78,label:'ZAG'},{id:'cb2',x:38,y:78,label:'ZAG'},{id:'lb',x:18,y:68,label:'LE'},{id:'cm1',x:50,y:58,label:'VOL'},{id:'cm2',x:32,y:45,label:'MC'},{id:'cm3',x:68,y:45,label:'MC'},{id:'rw',x:78,y:22,label:'PD'},{id:'st',x:50,y:15,label:'CA'},{id:'lw',x:22,y:22,label:'PE'}],
  '4-4-2': [{id:'gk',x:50,y:88,label:'GOL'},{id:'rb',x:82,y:68,label:'LD'},{id:'cb1',x:62,y:78,label:'ZAG'},{id:'cb2',x:38,y:78,label:'ZAG'},{id:'lb',x:18,y:68,label:'LE'},{id:'cm1',x:40,y:52,label:'MC'},{id:'cm2',x:60,y:52,label:'MC'},{id:'rm',x:80,y:42,label:'MD'},{id:'lm',x:20,y:42,label:'ME'},{id:'st1',x:40,y:20,label:'ATA'},{id:'st2',x:60,y:20,label:'ATA'}],
  '3-5-2': [{id:'gk',x:50,y:88,label:'GOL'},{id:'cb1',x:50,y:78,label:'ZAG'},{id:'cb2',x:70,y:72,label:'ZAG'},{id:'cb3',x:30,y:72,label:'ZAG'},{id:'rm',x:85,y:48,label:'ALA'},{id:'lm',x:15,y:48,label:'ALA'},{id:'dm',x:50,y:58,label:'VOL'},{id:'cm1',x:35,y:42,label:'MC'},{id:'cm2',x:65,y:42,label:'MC'},{id:'st1',x:40,y:20,label:'ATA'},{id:'st2',x:60,y:20,label:'ATA'}],
  '4-2-3-1': [{id:'gk',x:50,y:88,label:'GOL'},{id:'rb',x:82,y:68,label:'LD'},{id:'cb1',x:62,y:78,label:'ZAG'},{id:'cb2',x:38,y:78,label:'ZAG'},{id:'lb',x:18,y:68,label:'LE'},{id:'dm1',x:40,y:60,label:'VOL'},{id:'dm2',x:60,y:60,label:'VOL'},{id:'am',x:50,y:42,label:'MEI'},{id:'rw',x:80,y:28,label:'PD'},{id:'lw',x:20,y:28,label:'PE'},{id:'st',x:50,y:15,label:'CA'}],
  '5-3-2': [{id:'gk',x:50,y:88,label:'GOL'},{id:'rb',x:85,y:62,label:'LD'},{id:'lb',x:15,y:62,label:'LE'},{id:'cb1',x:50,y:78,label:'ZAG'},{id:'cb2',x:68,y:75,label:'ZAG'},{id:'cb3',x:32,y:75,label:'ZAG'},{id:'cm1',x:50,y:52,label:'MC'},{id:'cm2',x:30,y:48,label:'MC'},{id:'cm3',x:70,y:48,label:'MC'},{id:'st1',x:42,y:20,label:'ATA'},{id:'st2',x:58,y:20,label:'ATA'}],
  '3-4-3': [{id:'gk',x:50,y:88,label:'GOL'},{id:'cb1',x:50,y:78,label:'ZAG'},{id:'cb2',x:70,y:72,label:'ZAG'},{id:'cb3',x:30,y:72,label:'ZAG'},{id:'cm1',x:42,y:52,label:'MC'},{id:'cm2',x:58,y:52,label:'MC'},{id:'rm',x:85,y:48,label:'MD'},{id:'lm',x:15,y:48,label:'ME'},{id:'rw',x:75,y:22,label:'PD'},{id:'st',x:50,y:15,label:'CA'},{id:'lw',x:25,y:22,label:'PE'}]
};

// ── Componentes de UI ─────────────────────────────────────
function MarketCard({ player, isEscalado, isOrigin, onDragStart }: any) {
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      className={`relative h-16 rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing flex items-stretch transition-all ${
        isOrigin ? 'border-cyan-400 shadow-[0_0_15px_cyan]' : 
        isEscalado ? 'border-white/5 opacity-30 grayscale' : 'border-white/10 bg-zinc-900/80 hover:border-yellow-500/50'
      }`}
    >
      <div className="w-14 bg-black flex-shrink-0">
        <img src={player.foto} className="w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
      </div>
      <div className="flex-1 p-2 flex flex-col justify-center min-w-0">
        <p className="text-[10px] font-black uppercase truncate leading-none mb-1">{player.short}</p>
        <p className="text-[8px] text-yellow-500 font-bold">{player.pos} • {player.num}</p>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────
export default function ArenaTigreFC() {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [slotMap, setSlotMap] = useState<Record<string, SlotState>>({});
  const [bench, setBench] = useState<(Player | null)[]>(Array(7).fill(null));
  const [origin, setOrigin] = useState<any>(null);
  const [hero, setHero] = useState<Player | null>(null);
  const [captain, setCaptain] = useState<Player | null>(null);
  const [prediction, setPrediction] = useState({ home: 2, away: 0 });
  const [tempMsg, setTempMsg] = useState<string | null>(null);
  
  const fieldRef = useRef<HTMLDivElement>(null);

  // Inicializar formação
  useEffect(() => {
    const initial: any = {};
    FORMATIONS[formation].forEach(s => {
      initial[s.id] = { player: null, x: s.x, y: s.y, label: s.label };
    });
    setSlotMap(initial);
  }, [formation]);

  // Boom 1: 11 Titulares Escolhidos
  useEffect(() => {
    const isFull = Object.values(slotMap).every(s => s.player !== null);
    if (isFull && step === 'starters') {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#EAB308', '#FFFFFF', '#000000'] });
      setTempMsg("BOOM! TIME ESCALADO! AGORA O BANCO...");
      setTimeout(() => {
        setStep('reserves');
        setTempMsg(null);
      }, 2500);
    }
  }, [slotMap, step]);

  // Boom 2: Banco Escolhido
  useEffect(() => {
    const isBenchFull = bench.every(p => p !== null);
    if (isBenchFull && step === 'reserves') {
      confetti({ particleCount: 100, gravity: 2, colors: ['#06b6d4'] });
      setTempMsg("BOOM! RESERVAS PRONTOS!");
      setTimeout(() => {
        setStep('special');
        setTempMsg(null);
      }, 2000);
    }
  }, [bench, step]);

  // ── Lógica de Swap (Troca) ───────────────────────────────
  const executeSwap = (targetType: 'field' | 'bench', targetId: string | number) => {
    if (!origin) return;

    setSlotMap(prevSlots => {
      const newSlots = { ...prevSlots };
      const newBench = [...bench];

      let playerToMove = origin.player;
      let playerAtTarget = targetType === 'field' ? prevSlots[targetId as string].player : bench[targetId as number];

      // 1. Limpar origem
      if (origin.type === 'field') newSlots[origin.id].player = null;
      if (origin.type === 'bench') newBench[origin.id] = null;

      // 2. Colocar no destino e tratar a troca (swap)
      if (targetType === 'field') {
        newSlots[targetId as string].player = playerToMove;
        // Se tinha alguém no destino, manda para a origem do arrasto
        if (playerAtTarget) {
          if (origin.type === 'field') newSlots[origin.id].player = playerAtTarget;
          else if (origin.type === 'bench') newBench[origin.id] = playerAtTarget;
        }
      } else {
        newBench[targetId as number] = playerToMove;
        if (playerAtTarget) {
          if (origin.type === 'field') newSlots[origin.id].player = playerAtTarget;
          else if (origin.type === 'bench') newBench[origin.id] = playerAtTarget;
        }
      }

      setBench(newBench);
      return newSlots;
    });
    setOrigin(null);
  };

  return (
    <div className="h-screen bg-black text-white font-sans overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div key="f" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950"
          >
            <motion.img animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} src={ESCUDO} className="w-24 mb-6 drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]" />
            <h1 className="text-4xl font-black italic text-yellow-500 mb-12 tracking-tighter uppercase">Arena Tigre FC</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setStep('starters'); }}
                  className="group relative p-8 bg-zinc-900 rounded-3xl border-2 border-white/5 hover:border-yellow-500 transition-all active:scale-95"
                >
                  <span className="text-3xl font-black italic group-hover:text-yellow-500 transition-colors">{f}</span>
                  <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2 & 3: ESCALAÇÃO (Campo + Banco) */}
        {(step === 'starters' || step === 'reserves') && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex overflow-hidden bg-zinc-950">
            
            {/* Mercado / Elenco */}
            <div className="w-72 border-r border-white/5 bg-black/50 p-4 overflow-y-auto space-y-2 custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">Mercado Tigre</p>
                <div className="px-2 py-0.5 bg-yellow-500 text-black text-[9px] font-black rounded">39 ATLETAS</div>
              </div>
              {PLAYERS.map(p => (
                <MarketCard key={p.id} player={p} 
                  isEscalado={Object.values(slotMap).some(s => s.player?.id === p.id) || bench.some(b => b?.id === p.id)}
                  isOrigin={origin?.player.id === p.id}
                  onDragStart={() => setOrigin({ type: 'market', player: p })}
                />
              ))}
            </div>

            {/* Campo de Jogo */}
            <div className="flex-1 flex flex-col relative p-4">
              <AnimatePresence>
                {tempMsg && (
                  <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }}
                    className="absolute top-10 left-1/2 -translate-x-1/2 z-[200] bg-yellow-500 text-black px-8 py-3 rounded-full font-black italic shadow-[0_0_50px_rgba(234,179,8,0.5)]"
                  >
                    {tempMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={fieldRef} className="flex-1 relative rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-black"
                onDragOver={(e) => e.preventDefault()}
              >
                <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                
                {/* Slots do Campo */}
                {Object.entries(slotMap).map(([id, s]) => (
                  <motion.div key={id} style={{ left: `${s.x}%`, top: `${s.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => executeSwap('field', id)}
                  >
                    <div draggable onDragStart={() => s.player && setOrigin({ type: 'field', id, player: s.player })}
                      className={`w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        s.player ? 'border-white/40 bg-zinc-900 shadow-xl' : 'border-dashed border-white/10 bg-white/5 hover:border-yellow-500/50'
                      }`}
                    >
                      {s.player ? (
                        <>
                          <img src={s.player.foto} className="w-full h-full object-cover rounded-lg" />
                          <div className="absolute bottom-0 w-full bg-black/80 py-1 text-[8px] font-black text-center uppercase border-t border-white/10">{s.player.short}</div>
                        </>
                      ) : <span className="text-[9px] font-black text-white/20">{s.label}</span>}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* BANCO DE RESERVAS (O Pulsar Neon) */}
              <motion.div 
                animate={step === 'reserves' ? { 
                  boxShadow: ['0 0 0px #06b6d4', '0 0 25px #06b6d4', '0 0 0px #06b6d4'],
                  borderColor: ['rgba(255,255,255,0.05)', '#06b6d4', 'rgba(255,255,255,0.05)']
                } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mt-6 h-32 rounded-3xl border-2 border-white/5 bg-zinc-900/50 p-4 flex gap-3 relative overflow-hidden"
              >
                <div className="absolute top-2 left-4 text-[8px] font-black text-cyan-400/50 uppercase tracking-widest">Banco de Reservas</div>
                {bench.map((p, i) => (
                  <div key={i} 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => executeSwap('bench', i)}
                    draggable={!!p}
                    onDragStart={() => p && setOrigin({ type: 'bench', id: i, player: p })}
                    className={`flex-1 mt-2 rounded-2xl border-2 transition-all flex items-center justify-center relative overflow-hidden bg-black/40 ${
                      p ? 'border-white/20' : 'border-dashed border-white/5'
                    } ${step === 'reserves' && !p ? 'animate-pulse bg-cyan-500/5 border-cyan-500/30' : ''}`}
                  >
                    {p ? <img src={p.foto} className="w-full h-full object-cover" /> : <span className="text-[10px] text-white/10 font-black italic">R{i+1}</span>}
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 4: HERO & CAPTAIN */}
        {step === 'special' && (
          <motion.div key="spec" initial={{ x: 500 }} animate={{ x: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
             <h2 className="text-5xl font-black italic text-yellow-500 mb-12 uppercase tracking-tighter text-center">Os Protagonistas</h2>
             <div className="flex gap-12">
                <div className="text-center group">
                  <p className="text-[10px] font-black mb-4 text-cyan-400 tracking-widest uppercase group-hover:scale-110 transition-transform">Herói do Jogo</p>
                  <div className={`w-40 h-56 rounded-[30px] border-4 transition-all overflow-hidden cursor-pointer ${hero ? 'border-cyan-400 shadow-[0_0_50px_rgba(6,182,212,0.4)] scale-105' : 'border-white/10 bg-zinc-900 hover:border-cyan-500/50'}`}>
                    <select onChange={(e) => setHero(PLAYERS.find(p => p.id === Number(e.target.value)) || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10">
                      <option value="">Escolher</option>
                      {PLAYERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    {hero && <img src={hero.foto} className="w-full h-full object-cover" />}
                    {!hero && <div className="h-full flex items-center justify-center text-4xl text-white/10">?</div>}
                  </div>
                </div>

                <div className="text-center group">
                  <p className="text-[10px] font-black mb-4 text-yellow-500 tracking-widest uppercase group-hover:scale-110 transition-transform">Capitão</p>
                  <div className={`w-40 h-56 rounded-[30px] border-4 transition-all overflow-hidden cursor-pointer ${captain ? 'border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.4)] scale-105' : 'border-white/10 bg-zinc-900 hover:border-yellow-500/50'}`}>
                    <select onChange={(e) => setCaptain(PLAYERS.find(p => p.id === Number(e.target.value)) || null)} className="absolute inset-0 opacity-0 cursor-pointer z-10">
                      <option value="">Escolher</option>
                      {PLAYERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    {captain && <img src={captain.foto} className="w-full h-full object-cover" />}
                    {!captain && <div className="h-full flex items-center justify-center text-4xl text-white/10">?</div>}
                  </div>
                </div>
             </div>
             <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
               onClick={() => setStep('prediction')} disabled={!hero || !captain}
               className="mt-16 px-16 py-6 bg-white text-black font-black italic rounded-full disabled:opacity-20 transition-all uppercase text-xl shadow-2xl"
             >
               Confirmar Liderança
             </motion.button>
          </motion.div>
        )}

        {/* STEP 5: PREDICTION (PALPITE) */}
        {step === 'prediction' && (
          <motion.div key="pred" className="flex-1 flex flex-col items-center justify-center p-6 bg-yellow-500 text-black">
            <h2 className="text-6xl font-black italic mb-16 uppercase tracking-tighter text-center leading-none">Qual o seu<br/>Palpite?</h2>
            <div className="flex items-center gap-8 mb-20 bg-black/5 p-12 rounded-[50px] border border-black/10">
               <div className="flex flex-col items-center">
                  <img src={ESCUDO} className="w-32 mb-6 drop-shadow-2xl" />
                  <input type="number" value={prediction.home} onChange={e => setPrediction({...prediction, home: Number(e.target.value)})} 
                    className="w-28 h-28 text-center text-6xl font-black bg-black text-white rounded-3xl shadow-2xl outline-none" />
               </div>
               <span className="text-8xl font-black italic opacity-20">X</span>
               <div className="flex flex-col items-center">
                  <div className="w-32 h-32 bg-black/20 rounded-full mb-6 flex items-center justify-center text-4xl font-black italic opacity-30 tracking-tighter">ADV</div>
                  <input type="number" value={prediction.away} onChange={e => setPrediction({...prediction, away: Number(e.target.value)})} 
                    className="w-28 h-28 text-center text-6xl font-black bg-black text-white rounded-3xl shadow-2xl outline-none" />
               </div>
            </div>
            <button onClick={() => { confetti(); setStep('final'); }} className="px-14 py-8 bg-black text-white font-black italic rounded-full text-3xl hover:scale-110 transition-transform uppercase shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              BOOOOM! Gerar Card
            </button>
          </motion.div>
        )}

        {/* STEP 6: CARD FINAL (ESTILO FIFA) */}
        {step === 'final' && (
          <motion.div key="final" initial={{ y: 800 }} animate={{ y: 0 }} className="flex-1 flex flex-col items-center justify-center bg-zinc-950 p-4">
             {/* FIFA CARD CONTAINER */}
             <div id="capture-card" className="w-[380px] bg-gradient-to-b from-yellow-300 via-yellow-600 to-black p-1 rounded-[45px] shadow-[0_0_100px_rgba(234,179,8,0.2)]">
                <div className="bg-[#0a0a0a] rounded-[42px] overflow-hidden p-8 relative">
                   <div className="absolute -top-20 -right-20 w-64 h-64 bg-yellow-500/10 blur-[80px]" />
                   
                   <div className="relative z-10">
                     <p className="text-[10px] font-black text-yellow-500 tracking-[0.5em] mb-6 uppercase text-center">Convocação Arena Tigre</p>
                     
                     <div className="flex items-center justify-center gap-4 mb-8">
                        <img src={ESCUDO} className="w-16" />
                        <h3 className="text-5xl font-black italic text-white tracking-tighter leading-none">TIGRE<br/><span className="text-yellow-500">FC</span></h3>
                     </div>
                     
                     <div className="flex justify-around mb-8 bg-white/5 py-6 rounded-3xl border border-white/10">
                        <div className="text-center">
                          <img src={hero?.foto} className="w-16 h-16 rounded-full border-2 border-cyan-400 mx-auto mb-2 object-cover" />
                          <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">HERÓI</p>
                          <p className="text-xs font-black uppercase">{hero?.short}</p>
                        </div>
                        <div className="w-[1px] bg-white/10" />
                        <div className="text-center">
                          <img src={captain?.foto} className="w-16 h-16 rounded-full border-2 border-yellow-500 mx-auto mb-2 object-cover" />
                          <p className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">CAPITÃO</p>
                          <p className="text-xs font-black uppercase">{captain?.short}</p>
                        </div>
                     </div>

                     <div className="space-y-1 mb-8">
                        {Object.values(slotMap).map((s, idx) => s.player && (
                          <div key={idx} className="flex justify-between items-center text-[11px] px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                            <span className="font-black text-yellow-500 w-5">{s.player.num}</span>
                            <span className="font-bold uppercase flex-1 ml-4 text-white/90">{s.player.name}</span>
                            <span className="text-zinc-600 font-black text-[9px] uppercase tracking-tighter">{s.label}</span>
                          </div>
                        ))}
                     </div>

                     <div className="bg-yellow-500 p-5 rounded-[25px] text-center shadow-xl">
                        <p className="text-black font-black text-sm uppercase italic tracking-widest">Palpite: Tigre {prediction.home} x {prediction.away} ADV</p>
                     </div>
                   </div>
                </div>
             </div>

             <div className="mt-10 flex gap-4 w-full max-w-sm">
                <button onClick={() => window.print()} className="flex-1 py-6 bg-zinc-900 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border border-white/10 hover:bg-zinc-800 transition-all">Salvar Card</button>
                <button onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'Arena Tigre FC', text: 'Minha escalação oficial!', url: window.location.href });
                  }
                }} className="flex-1 py-6 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl hover:scale-105 transition-transform">Compartilhar</button>
             </div>
             
             <p className="mt-8 text-[9px] text-zinc-600 font-black tracking-[0.5em] uppercase text-center">Felipe Makarios • Arena Tigre FC</p>
             <button onClick={() => window.location.reload()} className="mt-4 text-[9px] text-yellow-500/50 font-black uppercase underline">Refazer Estratégia</button>
          </motion.div>
        )}

      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #EAB308; }
      `}</style>
    </div>
  );
}
