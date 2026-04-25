'use client';



import React, { useState, useMemo, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

import { supabase } from '@/lib/supabase';



// ─── CONFIGURAÇÕES E ASSETS ──────────────────────────────────────────────────

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';



// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────

interface EscalacaoProps {

  jogoId: number; // Resolve o erro de compilação do Vercel

}



type Player = { 

  id: number; 

  name: string; 

  short: string; 

  num: number; 

  pos: string; 

  foto: string 

};



type Lineup = Record<string, Player | null>;

type Step = 'formation' | 'arena' | 'score';



interface Slot { 

  id: string; 

  x: number; 

  y: number; 

  pos: string; 

  label: string 

}



// ─── MOCK DATA (Isolado para performance) ──────────────────────────────────

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

  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto: BASE+'CARLAO.jpg.webp' }, // Corrigido path

  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },

];



const FORMATIONS: Record<string, Slot[]> = {

  '4-2-3-1': [

    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },

    { id: 'rb', x: 82, y: 68, pos: 'LAT', label: 'RB' },

    { id: 'cb1', x: 62, y: 73, pos: 'ZAG', label: 'CB' },

    { id: 'cb2', x: 38, y: 73, pos: 'ZAG', label: 'CB' },

    { id: 'lb', x: 18, y: 68, pos: 'LAT', label: 'LB' },

    { id: 'dm1', x: 35, y: 53, pos: 'VOL', label: 'DM' },

    { id: 'dm2', x: 65, y: 53, pos: 'VOL', label: 'DM' },

    { id: 'am', x: 50, y: 37, pos: 'MEI', label: 'AM' },

    { id: 'rw', x: 78, y: 22, pos: 'MEI', label: 'RW' },

    { id: 'lw', x: 22, y: 22, pos: 'MEI', label: 'LW' },

    { id: 'st', x: 50, y: 10, pos: 'ATA', label: 'ST' },

  ],

  '4-3-3': [

    { id: 'gk', x: 50, y: 88, pos: 'GOL', label: 'GK' },

    { id: 'rb', x: 82, y: 68, pos: 'LAT', label: 'RB' },

    { id: 'cb1', x: 62, y: 73, pos: 'ZAG', label: 'CB' },

    { id: 'cb2', x: 38, y: 73, pos: 'ZAG', label: 'CB' },

    { id: 'lb', x: 18, y: 68, pos: 'LAT', label: 'LB' },

    { id: 'cm1', x: 30, y: 52, pos: 'MEI', label: 'CM' },

    { id: 'cm2', x: 50, y: 52, pos: 'VOL', label: 'CM' },

    { id: 'cm3', x: 70, y: 52, pos: 'MEI', label: 'CM' },

    { id: 'rw', x: 78, y: 22, pos: 'ATA', label: 'RW' },

    { id: 'st', x: 50, y: 12, pos: 'ATA', label: 'ST' },

    { id: 'lw', x: 22, y: 22, pos: 'ATA', label: 'LW' },

  ]

};



const POS_COLORS: Record<string, string> = { GOL: '#F5C400', ZAG: '#00F3FF', LAT: '#4FC3F7', VOL: '#BF5FFF', MEI: '#22C55E', ATA: '#FF2D55' };



// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

export default function EscalacaoFormacao({ jogoId }: EscalacaoProps) {

  const [step, setStep] = useState<Step>('formation');

  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-2-3-1');

  const [lineup, setLineup] = useState<Lineup>({});

  const [activeSlot, setActiveSlot] = useState<string | null>(null);

  const [filterPos, setFilterPos] = useState<string | null>(null);

  const [score, setScore] = useState({ tigre: 0, adv: 0 });

  const [loading, setLoading] = useState(false);



  // Lógica de Sincronização com o Backoffice/Supabase

  useEffect(() => {

    console.log(`Carregando dados para o jogo: ${jogoId}`);

    // Aqui você pode buscar dados específicos do jogoId se necessário

  }, [jogoId]);



  const slots = useMemo(() => FORMATIONS[formation], [formation]);



  const filteredPlayers = useMemo(() => {

    const slot = slots.find(s => s.id === activeSlot);

    const targetPos = filterPos || slot?.pos;

    return targetPos ? PLAYERS.filter(p => p.pos === targetPos) : PLAYERS;

  }, [filterPos, activeSlot, slots]);



  const handleSelectPlayer = (player: Player) => {

    if (!activeSlot) return;

    setLineup(prev => ({ ...prev, [activeSlot]: player }));

    setActiveSlot(null);

  };



  const handleFinish = async () => {

    setLoading(true);

    // Simulação de salvamento no Supabase

    setTimeout(() => {

      setLoading(false);

      alert('Escalação salva com sucesso para o jogo ' + jogoId);

    }, 1500);

  };



  return (

    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">

      <AnimatePresence mode="wait">

        

        {/* STEP 1: FORMAÇÃO */}

        {step === 'formation' && (

          <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 

            className="h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">

            <img src={ESCUDO} alt="Tigre" className="w-28 h-28 mb-10 drop-shadow-2xl" />

            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-12">Escolha sua Tática</h1>

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">

              {Object.keys(FORMATIONS).map(f => (

                <button key={f} onClick={() => { setFormation(f); setStep('arena'); }}

                  className="py-6 rounded-2xl border-2 border-white/10 hover:border-yellow-500 font-bold text-2xl transition-all hover:bg-yellow-500/10">

                  {f}

                </button>

              ))}

            </div>

          </motion.div>

        )}



        {/* STEP 2: ARENA 3D + MERCADO */}

        {step === 'arena' && (

          <motion.div key="a" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col lg:flex-row h-screen">

            

            {/* CAMPO VIRTUAL */}

            <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-emerald-950/30 to-black p-4">

              <div className="relative w-full max-w-[440px] aspect-[10/14] border-[8px] border-white/10 rounded-[40px] overflow-hidden shadow-2xl bg-[#0a2a18]"

                   style={{ perspective: '1200px', transform: 'rotateX(10deg)' }}>

                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#0f3a22_0,#0f3a22_20px,#0a2a18_20px,#0a2a18_40px)] opacity-40" />

                <div className="absolute top-1/2 w-full h-px bg-white/20" />

                

                {slots.map(slot => (

                  <div key={slot.id} className="absolute -translate-x-1/2 -translate-y-1/2 z-10" 

                       style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>

                    <div onClick={() => { setActiveSlot(slot.id); setFilterPos(null); }}

                      className={`w-16 h-20 rounded-xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden

                      ${activeSlot === slot.id ? 'border-yellow-500 scale-110 shadow-[0_0_20px_rgba(245,196,0,0.5)]' : 'border-white/20 bg-black/40'}`}>

                      {lineup[slot.id] ? (

                        <img src={lineup[slot.id]?.foto} className="w-full h-full object-cover" alt="p" />

                      ) : (

                        <span className="text-white/20 text-3xl font-light">+</span>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </div>



            {/* MERCADO DE JOGADORES */}

            <div className="w-full lg:w-[420px] bg-zinc-950 border-l border-white/10 flex flex-col">

              <div className="p-6 bg-black">

                <h2 className="text-yellow-500 font-black italic uppercase text-xl">Mercado de Transferência</h2>

                <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">

                  {['GOL','ZAG','LAT','VOL','MEI','ATA'].map(p => (

                    <button key={p} onClick={() => setFilterPos(p)}

                      className={`px-4 py-1.5 rounded-full text-[10px] font-black ${filterPos === p ? 'bg-yellow-500 text-black' : 'bg-white/5'}`}>

                      {p}

                    </button>

                  ))}

                </div>

              </div>



              <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-3">

                {filteredPlayers.map(p => (

                  <motion.div key={p.id} whileTap={{ scale: 0.9 }} onClick={() => handleSelectPlayer(p)}

                    className="aspect-[3/4] rounded-lg overflow-hidden border border-white/5 bg-zinc-900 cursor-pointer">

                    <img src={p.foto} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />

                    <div className="bg-black/80 p-1 text-center"><p className="text-[8px] font-bold truncate">{p.short}</p></div>

                  </motion.div>

                ))}

              </div>



              <div className="p-6">

                <button onClick={() => setStep('score')} className="w-full bg-yellow-500 text-black py-4 rounded-xl font-black uppercase italic tracking-widest hover:bg-yellow-400">

                  Confirmar Time

                </button>

              </div>

            </div>

          </motion.div>

        )}



        {/* STEP 3: PLACAR */}

        {step === 'score' && (

          <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center p-6">

            <h2 className="text-4xl font-black italic uppercase text-yellow-500 mb-12">Seu Palpite</h2>

            <div className="flex items-center gap-6 mb-12">

               <div className="flex flex-col items-center gap-4">

                 <img src={ESCUDO} className="w-20" alt="tigre" />

                 <input type="number" value={score.tigre} onChange={e => setScore({...score, tigre: +e.target.value})}

                   className="w-24 h-24 bg-zinc-900 border-2 border-yellow-500 rounded-3xl text-center text-5xl font-black focus:outline-none" />

               </div>

               <span className="text-3xl font-black text-zinc-700 mt-10">X</span>

               <div className="flex flex-col items-center gap-4">

                 <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-500">ADV</div>

                 <input type="number" value={score.adv} onChange={e => setScore({...score, adv: +e.target.value})}

                   className="w-24 h-24 bg-zinc-900 border-2 border-white/10 rounded-3xl text-center text-5xl font-black focus:outline-none" />

               </div>

            </div>

            <button 

              disabled={loading}

              onClick={handleFinish}

              className={`px-12 py-5 rounded-2xl font-black uppercase italic text-xl transition-all ${loading ? 'bg-zinc-700' : 'bg-white text-black hover:scale-105'}`}>

              {loading ? 'Enviando...' : 'Finalizar e Salvar'}

            </button>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  );

}
