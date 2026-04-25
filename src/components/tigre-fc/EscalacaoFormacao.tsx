'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// --- COMPONENTES (IMPORTS SEM CHAVES ONDE É DEFAULT) ---
import MarketList from './MarketList';
import SoccerField from './SoccerField';
import Bench from './Bench';
import CapitaoEHeroi from './CapitaoEHeroi';
import Palpite from './Palpite';
import FinalCardReveal from './FinalCardReveal';

// --- CONFIGURAÇÕES TÉCNICAS ---
interface EscalacaoFormacaoProps {
  jogoId: number;
}

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1, name: "Jordi", short: "JORDI", num: 1, pos: "GOL", foto: BASE + "JORDI.png" },
  { id: 7, name: "Rafael Donato", short: "DONATO", num: 3, pos: "ZAG", foto: BASE + "RAFAEL%20DONATO.png" },
  { id: 15, name: "Willian Farias", short: "W. FARIAS", num: 5, pos: "VOL", foto: BASE + "WILLIAN%20FARIAS.png" },
  { id: 25, name: "Neto Pessoa", short: "N. PESSOA", num: 9, pos: "ATA", foto: BASE + "NETO%20PESSOA.png" },
  // ... os demais jogadores que você listou
];

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'special' | 'prediction' | 'reveal'>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  const [bench, setBench] = useState<any[]>(Array(7).fill(null));
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });
  const [isSaving, setIsSaving] = useState(false);

  // Verificação exigida pelo MarketList
  const isEscalado = (id: number) => {
    const noCampo = Object.values(lineup).some((p: any) => p?.id === id);
    const noBanco = bench.some((p: any) => p?.id === id);
    return noCampo || noBanco;
  };

  const handleLockPalpite = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('tigre_fc_escalacoes')
        .upsert({
          usuario_id: user?.id,
          jogo_id: jogoId,
          formacao: formation,
          lineup_json: lineup,
          bench_json: bench,
          capitao_id: captainId,
          heroi_id: heroId,
          palpite_tigre: score.tigre,
          palpite_adv: score.adv,
          palpite_locked: true,
          atualizado_em: new Date().toISOString()
        }, { onConflict: 'usuario_id, jogo_id' });

      if (error) throw error;
      setStep('reveal');
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setStep('reveal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        
        {step === 'formation' && (
          <motion.div key="form" exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-black italic text-yellow-500 mb-8 uppercase">Escolha a Tática</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
              {['4-3-3', '4-4-2', '3-5-2', '4-2-3-1'].map(f => (
                <button 
                  key={f} 
                  onClick={() => { setFormation(f); setStep('arena'); }} 
                  className="p-6 bg-zinc-900 border-2 border-white/5 rounded-2xl text-2xl font-black hover:border-yellow-500 transition-all"
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" className="flex-1 flex overflow-hidden">
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
                className="absolute bottom-10 right-10 px-10 py-4 bg-yellow-500 text-black font-black rounded-full uppercase italic"
              >
                PRÓXIMO PASSO →
              </button>
            </div>
          </motion.div>
        )}

        {step === 'special' && (
          <motion.div key="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CapitaoEHeroi 
              onNext={() => setStep('prediction')}
              captainName={PLAYERS.find(p => p.id === captainId)?.short || "Selecionar"}
              heroName={PLAYERS.find(p => p.id === heroId)?.short || "Selecionar"}
              onSelect={() => {}} // Lógica de abrir modal aqui
            />
          </motion.div>
        )}

        {step === 'prediction' && (
          <motion.div key="pred" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Palpite 
              scoreTigre={score.tigre}
              scoreAdversario={score.adv}
              setScoreTigre={(v) => setScore(p => ({...p, tigre: v}))}
              setScoreAdversario={(v) => setScore(p => ({...p, adv: v}))}
              onLock={handleLockPalpite}
              isLocked={isSaving}
            />
          </motion.div>
        )}

        {step === 'reveal' && (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FinalCardReveal 
              lineup={lineup}
              scoreTigre={score.tigre}
              scoreAdversario={score.adv}
              captainId={captainId}
              heroId={heroId}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
