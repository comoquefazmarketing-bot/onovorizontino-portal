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

// --- DEFINIÇÃO DE TIPOS LOCAL (BLINDAGEM CONTRA ERRO DE BUILD) ---
interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
}

// --- CONFIGURAÇÕES TÉCNICAS ---
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

// LISTA ATUALIZADA COM BASE NO SEU SQL DO SUPABASE (APENAS ATIVOS)
const PLAYERS: Player[] = [
  // GOLEIROS
  { id: 23, name: "Jordi", short: "JORDI", num: 93, pos: "GOL", foto: BASE + "JORDI.png" },
  { id: 22, name: "João Scapin", short: "SCAPIN", num: 12, pos: "GOL", foto: BASE + "AIRTON.png" },
  { id: 62, name: "Lucas", short: "LUCAS", num: 1, pos: "GOL", foto: BASE + "LUCAS%20PEREIRA.png" },
  { id: 1, name: "César", short: "CÉSAR", num: 31, pos: "GOL", foto: BASE + "JORDI.png" },

  // DEFENSORES (ZAG / LAT)
  { id: 34, name: "Eduardo Brock", short: "BROCK", num: 14, pos: "ZAG", foto: BASE + "RENATO%20PALM.png" },
  { id: 38, name: "Renato Palm", short: "R. PALM", num: 33, pos: "ZAG", foto: BASE + "RENATO%20PALM.png" },
  { id: 6, name: "Carlinhos", short: "CARLINHOS", num: 3, pos: "ZAG", foto: BASE + "CESAR%20MARTINS.png" },
  { id: 8, name: "Patrick", short: "PATRICK", num: 4, pos: "ZAG", foto: BASE + "LUISÃO.png" },
  { id: 3, name: "Dantas", short: "DANTAS", num: 25, pos: "ZAG", foto: BASE + "RAFAEL%20DONATO.png" },
  { id: 75, name: "Jhilmar Lora", short: "LORA", num: 24, pos: "LD", foto: BASE + "RODRIGO%20SOARES.png" },
  { id: 27, name: "Nilson Castrillón", short: "CASTRILLÓN", num: 20, pos: "LD", foto: BASE + "RAUL%20PRATA.png" },
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LE", foto: BASE + "REINALDO.png" },
  { id: 28, name: "Maykon Jesus", short: "MAYKON", num: 66, pos: "LE", foto: BASE + "DANILO%20BELAO.png" },

  // MEIO-CAMPISTAS
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MC", foto: BASE + "ROMULO.png" },
  { id: 12, name: "Juninho", short: "JUNINHO", num: 50, pos: "MC", foto: BASE + "MARLON.png" },
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: BASE + "WILLIAN%20FARIAS.png" },
  { id: 40, name: "Léo Naldi", short: "NALDI", num: 18, pos: "VOL", foto: BASE + "GEOVANE.png" },
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MC", foto: BASE + "DIEGO%20TORRES.png" },
  { id: 86, name: "Christian Ortíz", short: "ORTÍZ", num: 8, pos: "MC", foto: BASE + "CHICO.png" },
  { id: 13, name: "Diego Galo", short: "D. GALO", num: 19, pos: "MC", foto: BASE + "LUCAS%20CARDOSO.png" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MC", foto: BASE + "CHICO.png" },

  // ATACANTES
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: BASE + "WAGUININHO.png" },
  { id: 50, name: "Carlão", short: "CARLÃO", num: 9, pos: "ATA", foto: BASE + "NETO%20PESSOA.png" },
  { id: 52, name: "Hélio Borges", short: "H. BORGES", num: 41, pos: "ATA", foto: BASE + "FABRICIO%20DANIEL.png" },
  { id: 53, name: "Jardiel", short: "JARDIEL", num: 40, pos: "ATA", foto: BASE + "RODOLFO.png" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: BASE + "PAULO%20VITOR.png" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: BASE + "JENISON.png" },
  { id: 51, name: "Diego Mathias", short: "D. MATHIAS", num: 27, pos: "ATA", foto: BASE + "LUCCA.png" },
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: BASE + "ADRIANO.png" }
];

interface EscalacaoProps {
  jogoId?: number;
}

export default function EscalacaoFormacao({ jogoId }: EscalacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'special' | 'prediction' | 'reveal'>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [bench, setBench] = useState<(Player | null)[]>(Array(7).fill(null));
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });

  const isEscalado = (id: number) => {
    const noCampo = Object.values(lineup).some((p) => p?.id === id);
    const noBanco = bench.some((p) => p?.id === id);
    return noCampo || noBanco;
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        
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

        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex overflow-hidden">
            <MarketList 
              players={PLAYERS} 
              isEscalado={isEscalado}
              onSelect={(p) => {
                if (!isEscalado(p.id)) {
                  // Lógica simples de preenchimento por posição
                  const posKey = p.pos.toLowerCase();
                  setLineup((prev) => ({ ...prev, [posKey]: p }));
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

        {step === 'special' && (
          <motion.div key="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {React.createElement(CapitaoEHeroi as any, {
              onNext: () => setStep('prediction'),
              onConfirm: () => setStep('prediction'),
              captainName: PLAYERS.find(p => p.id === captainId)?.short || "Selecionar",
              heroName: PLAYERS.find(p => p.id === heroId)?.short || "Selecionar",
              onSelect: (type: 'captain' | 'hero', id: number) => {
                if (type === 'captain') setCaptainId(id);
                if (type === 'hero') setHeroId(id);
              }
            })}
          </motion.div>
        )}

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
