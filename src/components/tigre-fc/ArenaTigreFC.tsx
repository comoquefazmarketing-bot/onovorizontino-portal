'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// --- NOSSOS NOVOS COMPONENTES MODULARES ---
import SoccerField from './SoccerField';
import { MarketList } from './MarketList';
import Bench from './Bench';

// --- SEUS COMPONENTES ANEXADOS (IMPORTADOS) ---
import CapitaoEHeroi from './CapitaoEHeroi';
import Palpite from './Palpite';
import FinalCardReveal from './FinalCardReveal';
import TigreFCShare from './TigreFCShare';

// --- TIPAGEM E DADOS ---
import { PLAYERS } from '@/data/players'; 
import { FORMATIONS } from '@/config/formations';

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
          <motion.div key="form" exit={{ opacity: 0 }}>
             {/* ... seu código de grid de formações ... */}
             <button onClick={() => setStep('arena')}>Começar</button>
          </motion.div>
        )}

        {/* ETAPA 2: A ARENA (CAMPO + MERCADO + BANCO) */}
        {step === 'arena' && (
          <motion.div key="arena" className="flex-1 flex overflow-hidden">
            <MarketList 
              players={PLAYERS} 
              onSelect={(p) => {/* lógica de clique */}} 
            />
            
            <div className="flex-1 flex flex-col relative">
               <SoccerField 
                 formation={formation} 
                 lineup={lineup} 
                 setLineup={setLineup} 
               />
               <Bench bench={bench} setBench={setBench} />
               
               <button 
                 onClick={goToSpecial}
                 className="absolute bottom-40 right-8 bg-yellow-500 text-black px-6 py-2 rounded-full font-black"
               >
                 PRÓXIMO →
               </button>
            </div>
          </motion.div>
        )}

        {/* ETAPA 3: CAPITÃO E HERÓI (SEU ANEXO) */}
        {step === 'special' && (
          <CapitaoEHeroi 
            onSelect={(type) => {/* abrir modal de seleção */}}
            captainName={PLAYERS.find(p => p.id === captainId)?.short}
            heroName={PLAYERS.find(p => p.id === heroId)?.short}
            // ... outras props
          />
        )}

        {/* ETAPA 4: PALPITE (SEU ANEXO) */}
        {step === 'prediction' && (
          <Palpite 
            scoreTigre={score.tigre}
            setScoreTigre={(v) => setScore({...score, tigre: v})}
            onLock={finalize}
            // ... outras props
          />
        )}

        {/* ETAPA 5: REVELAÇÃO FINAL (SEU ANEXO) */}
        {step === 'reveal' && (
          <FinalCardReveal 
            lineup={lineup}
            scoreTigre={score.tigre}
            // ... outras props
          />
        )}

      </AnimatePresence>
    </div>
  );
}
