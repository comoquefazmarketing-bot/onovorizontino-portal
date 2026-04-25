'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- COMPONENTES MODULARES ---
import SoccerField from './SoccerField';
import MarketList from './MarketList';
import Bench from './Bench';

// --- COMPONENTES IMPORTADOS ---
import CapitaoEHeroi from './CapitaoEHeroi';
import Palpite from './Palpite';
import FinalCardReveal from './FinalCardReveal';

// --- DADOS LOCAIS (Para evitar erro de módulo não encontrado) ---
const FORMATIONS = {
  '4-3-3': { name: '4-3-3', positions: ['gk', 'rb', 'cb1', 'cb2', 'lb', 'cm1', 'cm2', 'cm3', 'st1', 'st2', 'st3'] },
  '4-4-2': { name: '4-4-2', positions: ['gk', 'rb', 'cb1', 'cb2', 'lb', 'cm1', 'cm2', 'cm3', 'cm4', 'st1', 'st2'] },
};

const PLAYERS = [
  { id: 1, name: "César Augusto", short: "César", pos: "GOL", foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/CESAR-AUGUSTO.jpg.webp" },
  { id: 10, name: "Dantas", short: "Dantas", pos: "ZAG", foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/DANTAAS.jpg.webp" },
  { id: 8, name: "Sander", short: "Sander", pos: "LAT", foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/SANDER.jpg.webp" },
  { id: 31, name: "Robson", short: "Robson", pos: "ATA", foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/ROBSON.jpg.webp" },
  // ... adicione outros se necessário, ou deixe estes como base para o build passar
];

export default function ArenaTigreFC() {
  // 1. Estados de Fluxo
  const [step, setStep] = useState<'formation' | 'arena' | 'special' | 'prediction' | 'reveal'>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  
  // 2. Estados de Dados (Escalação)
  const [lineup, setLineup] = useState<any>({});
  const [bench, setBench] = useState<any[]>(Array(7).fill(null));
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });

  // 3. Funções de Transição
  const goToSpecial = () => setStep('special');
  const goToPrediction = () => setStep('prediction');
  const finalize = () => setStep('reveal');

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* ETAPA 1: ESCOLHA DE FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div 
            key="form" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
            <h2 className="text-2xl font-black mb-8 text-yellow-500 uppercase tracking-tighter">Escolha sua Tática</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.keys(FORMATIONS).map((f) => (
                <button 
                  key={f}
                  onClick={() => setFormation(f)}
                  className={`px-8 py-4 rounded-xl font-bold border-2 transition-all ${
                    formation === f ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setStep('arena')}
              className="bg-yellow-500 text-black px-12 py-4 rounded-full font-black hover:scale-105 transition-transform"
            >
              COMEÇAR ESCALAÇÃO
            </button>
          </motion.div>
        )}

        {/* ETAPA 2: A ARENA */}
        {step === 'arena' && (
          <motion.div 
            key="arena" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col md:flex-row overflow-hidden"
          >
            <MarketList 
              players={PLAYERS} 
              lineup={lineup}
              bench={bench}
              onSelect={(p) => {
                // Lógica simples de seleção para o build
                setLineup((prev: any) => ({ ...prev, [p.pos.toLowerCase()]: p }));
              }} 
            />
            
            <div className="flex-1 flex flex-col relative bg-zinc-950">
               <SoccerField 
                 formation={formation} 
                 lineup={lineup} 
                 setLineup={setLineup} 
               />
               <Bench players={bench} setBench={setBench} />
               
               <button 
                 onClick={goToSpecial}
                 className="absolute bottom-32 right-8 bg-yellow-500 text-black px-8 py-3 rounded-full font-black shadow-2xl z-50"
               >
                 PRÓXIMO →
               </button>
            </div>
          </motion.div>
        )}

        {/* ETAPA 3: CAPITÃO E HERÓI */}
        {step === 'special' && (
          <motion.div key="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CapitaoEHeroi 
              onSelect={(type) => {}}
              captainName={PLAYERS.find(p => p.id === captainId)?.short || "Selecionar"}
              heroName={PLAYERS.find(p => p.id === heroId)?.short || "Selecionar"}
              onNext={goToPrediction}
            />
          </motion.div>
        )}

        {/* ETAPA 4: PALPITE */}
        {step === 'prediction' && (
          <motion.div key="pred" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Palpite 
              scoreTigre={score.tigre}
              scoreAdv={score.adv}
              setScoreTigre={(v) => setScore({...score, tigre: v})}
              setScoreAdv={(v) => setScore({...score, adv: v})}
              onLock={finalize}
            />
          </motion.div>
        )}

        {/* ETAPA 5: REVELAÇÃO FINAL */}
        {step === 'reveal' && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FinalCardReveal 
              lineup={lineup}
              scoreTigre={score.tigre}
              scoreAdv={score.adv}
              captainId={captainId}
              heroId={heroId}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
