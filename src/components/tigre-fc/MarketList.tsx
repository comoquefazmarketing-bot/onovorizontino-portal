'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- COMPONENTES MODULARES ---
import SoccerField from './SoccerField';
import { MarketList } from './MarketList';
import Bench from './Bench';

// --- COMPONENTES IMPORTADOS ---
import CapitaoEHeroi from './CapitaoEHeroi';
import Palpite from './Palpite';
import FinalCardReveal from './FinalCardReveal';

// --- DADOS LOCAIS ---
const FORMATIONS = {
  '4-3-3': { name: '4-3-3', positions: ['gk', 'rb', 'cb1', 'cb2', 'lb', 'cm1', 'cm2', 'cm3', 'st1', 'st2', 'st3'] },
  '4-4-2': { name: '4-4-2', positions: ['gk', 'rb', 'cb1', 'cb2', 'lb', 'cm1', 'cm2', 'cm3', 'cm4', 'st1', 'st2'] },
};

const PLAYERS = [
  { id: 1, name: "César Augusto", short: "César", pos: "GOL", num: 1, foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/CESAR-AUGUSTO.jpg.webp" },
  { id: 10, name: "Dantas", short: "Dantas", pos: "ZAG", num: 3, foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/DANTAAS.jpg.webp" },
  { id: 8, name: "Sander", short: "Sander", pos: "LAT", num: 33, foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/SANDER.jpg.webp" },
  { id: 31, name: "Robson", short: "Robson", pos: "ATA", num: 9, foto: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/ROBSON.jpg.webp" },
];

export default function ArenaTigreFC() {
  const [step, setStep] = useState<'formation' | 'arena' | 'special' | 'prediction' | 'reveal'>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  const [bench, setBench] = useState<any[]>(Array(7).fill(null));
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });

  // Funções exigidas pelo MarketList
  const isEscalado = (id: number) => {
    const noCampo = Object.values(lineup).some((p: any) => p?.id === id);
    const noBanco = bench.some((p: any) => p?.id === id);
    return noCampo || noBanco;
  };

  const handleSelect = (p: any) => {
    if (isEscalado(p.id)) return;
    setLineup((prev: any) => ({ ...prev, [p.pos.toLowerCase()]: p }));
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        
        {step === 'formation' && (
          <motion.div key="form" exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-black mb-8 text-yellow-500 uppercase">Escolha sua Tática</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {Object.keys(FORMATIONS).map((f) => (
                <button key={f} onClick={() => setFormation(f)} className={`px-8 py-4 rounded-xl font-bold border-2 ${formation === f ? 'border-yellow-500' : 'border-zinc-800'}`}>{f}</button>
              ))}
            </div>
            <button onClick={() => setStep('arena')} className="bg-yellow-500 text-black px-12 py-4 rounded-full font-black">COMEÇAR</button>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" className="flex-1 flex overflow-hidden">
            <MarketList 
              players={PLAYERS} 
              isEscalado={isEscalado}
              onSelect={handleSelect}
              onDragStart={() => {}} // Placeholder para build
              onDragEnd={() => {}}   // Placeholder para build
            />
            
            <div className="flex-1 flex flex-col relative bg-zinc-950">
               <SoccerField formation={formation} lineup={lineup} setLineup={setLineup} />
               <Bench players={bench} setBench={setBench} />
               <button onClick={() => setStep('special')} className="absolute bottom-32 right-8 bg-yellow-500 text-black px-8 py-3 rounded-full font-black">PRÓXIMO →</button>
            </div>
          </motion.div>
        )}

        {/* ... Outros steps (Special, Prediction, Reveal) mantendo o padrão anterior */}
        {step === 'special' && (
          <motion.div key="special" className="flex-1">
            <CapitaoEHeroi 
              onNext={() => setStep('prediction')}
              captainName={PLAYERS.find(p => p.id === captainId)?.short || "Não selecionado"}
              heroName={PLAYERS.find(p => p.id === heroId)?.short || "Não selecionado"}
              onSelect={() => {}}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
