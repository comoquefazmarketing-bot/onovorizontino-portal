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

// --- CONFIGURAÇÕES TÉCNICAS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1, name: "Jordi", short: "JORDI", num: 1, pos: "GOL", foto: BASE + "JORDI.png" },
  { id: 2, name: "Airton", short: "AIRTON", num: 12, pos: "GOL", foto: BASE + "AIRTON.png" },
  { id: 3, name: "Lucas Pereira", short: "L. PEREIRA", num: 26, pos: "GOL", foto: BASE + "LUCAS%20PEREIRA.png" },
  { id: 4, name: "Rodrigo Soares", short: "R. SOARES", num: 2, pos: "LD", foto: BASE + "RODRIGO%20SOARES.png" },
  { id: 5, name: "Raul Prata", short: "R. PRATA", num: 13, pos: "LD", foto: BASE + "RAUL%20PRATA.png" },
  { id: 6, name: "Igor Formiga", short: "I. FORMIGA", num: 22, pos: "LD", foto: BASE + "IGOR%20FORMIGA.png" },
  { id: 7, name: "Rafael Donato", short: "DONATO", num: 3, pos: "ZAG", foto: BASE + "RAFAEL%20DONATO.png" },
  { id: 8, name: "César Martins", short: "C. MARTINS", num: 4, pos: "ZAG", foto: BASE + "CESAR%20MARTINS.png" },
  { id: 9, name: "Luisão", short: "LUISÃO", num: 14, pos: "ZAG", foto: BASE + "LUISÃO.png" },
  { id: 10, name: "Renato Palm", short: "R. PALM", num: 15, pos: "ZAG", foto: BASE + "RENATO%20PALM.png" },
  { id: 11, name: "Guilherme Matos", short: "G. MATOS", num: 21, pos: "ZAG", foto: BASE + "GUILHERME%20MATOS.png" },
  { id: 12, name: "Léo Baiano", short: "LÉO BAIANO", num: 30, pos: "ZAG", foto: BASE + "LEO%20BAIANO.png" },
  { id: 13, name: "Reinaldo", short: "REINALDO", num: 6, pos: "LE", foto: BASE + "REINALDO.png" },
  { id: 14, name: "Danilo Belão", short: "D. BELÃO", num: 16, pos: "LE", foto: BASE + "DANILO%20BELAO.png" },
  { id: 15, name: "Willian Farias", short: "W. FARIAS", num: 5, pos: "VOL", foto: BASE + "WILLIAN%20FARIAS.png" },
  { id: 16, name: "Geovane", short: "GEOVANE", num: 8, pos: "VOL", foto: BASE + "GEOVANE.png" },
  { id: 17, name: "Eduardo", short: "EDUARDO", num: 17, pos: "VOL", foto: BASE + "EDUARDO.png" },
  { id: 18, name: "Dudu", short: "DUDU", num: 25, pos: "VOL", foto: BASE + "DUDU.png" },
  { id: 19, name: "Marlon", short: "MARLON", num: 10, pos: "MC", foto: BASE + "MARLON.png" },
  { id: 20, name: "Rômulo", short: "RÔMULO", num: 20, pos: "MC", foto: BASE + "ROMULO.png" },
  { id: 21, name: "Lucas Cardoso", short: "L. CARDOSO", num: 27, pos: "MC", foto: BASE + "LUCAS%20CARDOSO.png" },
  { id: 22, name: "Chico", short: "CHICO", num: 28, pos: "MC", foto: BASE + "CHICO.png" },
  { id: 23, name: "Diego Torres", short: "D. TORRES", num: 31, pos: "MC", foto: BASE + "DIEGO%20TORRES.png" },
  { id: 24, name: "Waguininho", short: "WAGUININHO", num: 7, pos: "ATA", foto: BASE + "WAGUININHO.png" },
  { id: 25, name: "Neto Pessoa", short: "N. PESSOA", num: 9, pos: "ATA", foto: BASE + "NETO%20PESSOA.png" },
  { id: 26, name: "Fabrício Daniel", short: "F. DANIEL", num: 11, pos: "ATA", foto: BASE + "FABRICIO%20DANIEL.png" },
  { id: 27, name: "Rodolfo", short: "RODOLFO", num: 18, pos: "ATA", foto: BASE + "RODOLFO.png" },
  { id: 28, name: "Paulo Vitor", short: "P. VITOR", num: 19, pos: "ATA", foto: BASE + "PAULO%20VITOR.png" },
  { id: 29, name: "Jenison", short: "JENISON", num: 23, pos: "ATA", foto: BASE + "JENISON.png" },
  { id: 30, name: "Lucca", short: "LUCCA", num: 29, pos: "ATA", foto: BASE + "LUCCA.png" },
  { id: 31, name: "Vitinho", short: "VITINHO", num: 32, pos: "ATA", foto: BASE + "VITINHO.png" },
  { id: 32, name: "Weverton", short: "WEVERTON", num: 33, pos: "ATA", foto: BASE + "WEVERTON.png" },
  { id: 33, name: "Baggio", short: "BAGGIO", num: 34, pos: "ATA", foto: BASE + "BAGGIO.png" },
  { id: 34, name: "Oscar Ruiz", short: "O. RUIZ", num: 35, pos: "ATA", foto: BASE + "OSCAR%20RUIZ.png" },
  { id: 35, name: "Tavares", short: "TAVARES", num: 36, pos: "ATA", foto: BASE + "TAVARES.png" },
  { id: 36, name: "Léo Tocantins", short: "L. TOCANTINS", num: 37, pos: "ATA", foto: BASE + "LEO%20TOCANTINS.png" },
  { id: 37, name: "Cauê", short: "CAUÊ", num: 38, pos: "ATA", foto: BASE + "CAUE.png" },
  { id: 38, name: "Felipe Rodrigues", short: "F. RODRIGUES", num: 39, pos: "ATA", foto: BASE + "FELIPE%20RODRIGUES.png" },
  { id: 39, name: "Adriano", short: "ADRIANO", num: 40, pos: "ATA", foto: BASE + "ADRIANO.png" }
];

// Interface para aceitar o jogoId enviado pela Page [jogoId]/page.tsx
interface EscalacaoProps {
  jogoId?: number;
}

export default function EscalacaoFormacao({ jogoId }: EscalacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'special' | 'prediction' | 'reveal'>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  const [bench, setBench] = useState<any[]>(Array(7).fill(null));
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });

  const isEscalado = (id: number) => {
    const noCampo = Object.values(lineup).some((p: any) => p?.id === id);
    const noBanco = bench.some((p: any) => p?.id === id);
    return noCampo || noBanco;
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* ETAPA 1: SELEÇÃO DE TÁTICA */}
        {step === 'formation' && (
          <motion.div key="form" exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-black italic text-yellow-500 mb-8 uppercase tracking-tighter">Escolha a Tática</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2', '3-4-3'].map(f => (
                <button 
                  key={f} 
                  onClick={() => { setFormation(f); setStep('arena'); }} 
                  className="p-6 bg-zinc-900 border-2 border-white/5 rounded-2xl text-2xl font-black hover:border-yellow-500 transition-all active:scale-95"
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ETAPA 2: CAMPO DE ESCALAÇÃO */}
        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex overflow-hidden">
            <MarketList 
              players={PLAYERS} 
              isEscalado={isEscalado}
              onSelect={(p) => {
                if (!isEscalado(p.id)) {
                  setLineup((prev: any) => ({ ...prev, [p.pos.toLowerCase()]: p }));
                }
              }}
              onDragStart={() => {}}
              onDragEnd={() => {}}
            />
            <div className="flex-1 flex flex-col relative bg-zinc-950">
              <SoccerField formation={formation} lineup={lineup} setLineup={setLineup} />
              <Bench players={bench} setBench={setBench} />
              <button 
                onClick={() => setStep('special')} 
                className="absolute bottom-10 right-10 px-10 py-4 bg-yellow-500 text-black font-black rounded-full shadow-2xl uppercase italic hover:scale-105 active:scale-95 transition-transform"
              >
                PRÓXIMO PASSO →
              </button>
            </div>
          </motion.div>
        )}

        {/* ETAPA 3: CAPITÃO E HERÓI (COM BYPASS DE TIPAGEM) */}
        {step === 'special' && (
          <motion.div key="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {React.createElement(CapitaoEHeroi as any, {
              onNext: () => setStep('prediction'),
              onConfirm: () => setStep('prediction'),
              captainName: PLAYERS.find(p => p.id === captainId)?.short || "Selecionar",
              heroName: PLAYERS.find(p => p.id === heroId)?.short || "Selecionar",
              onSelect: () => {}
            })}
          </motion.div>
        )}

        {/* ETAPA 4: PLACAR / PALPITE */}
        {step === 'prediction' && (
          <motion.div key="pred" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Palpite 
              scoreTigre={score.tigre}
              scoreAdversario={score.adv}
              setScoreTigre={(v) => setScore({...score, tigre: v})}
              setScoreAdversario={(v) => setScore({...score, adv: v})}
              onLock={() => setStep('reveal')}
              isLocked={false}
            />
          </motion.div>
        )}

        {/* ETAPA 5: CARD FINAL (COM BYPASS DE TIPAGEM) */}
        {step === 'reveal' && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {React.createElement(FinalCardReveal as any, {
              lineup: lineup,
              formation: formation,
              scoreTigre: score.tigre,
              scoreAdversario: score.adv,
              captainId: captainId,
              heroId: heroId,
              onClose: () => setStep('formation')
            })}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
