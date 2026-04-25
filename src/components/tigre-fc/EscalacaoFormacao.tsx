'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase'; // Ajuste conforme seu caminho de config

// --- COMPONENTES ---
import { MarketList } from './MarketList';
import { SoccerField } from './SoccerField';
import { Bench } from './Bench';
import CapitaoEHeroi from './CapitaoEHeroi'; // Nome limpo para evitar erros de build
import Palpite from './Palpite';
import FinalCardReveal from './FinalCardReveal'; // Nome limpo para evitar erros de build

// --- CONFIGURAÇÕES TÉCNICAS ---
interface EscalacaoFormacaoProps {
  jogoId: number;
}

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

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'special' | 'prediction' | 'reveal'>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<any>({});
  const [bench, setBench] = useState<any[]>(Array(7).fill(null));
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [score, setScore] = useState({ tigre: 0, adv: 0 });
  const [isSaving, setIsSaving] = useState(false);

  // Lógica para salvar no Banco de Dados antes da revelação
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
      // Avança mesmo com erro para não travar o usuário, mas o ideal é tratar o UI
      setStep('reveal');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        
        {/* 1. SELEÇÃO DE FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div 
            key="form" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }} 
            className="flex-1 flex flex-col items-center justify-center p-6"
          >
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

        {/* 2. ARENA DE ESCALAÇÃO */}
        {step === 'arena' && (
          <motion.div 
            key="arena" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex overflow-hidden"
          >
            <MarketList 
              players={PLAYERS} 
              lineup={lineup} 
              bench={bench} 
              onSelect={(p) => {
                // A lógica de inserção no campo/reserva deve ser tratada aqui ou via SoccerField/Bench
              }} 
            />
            <div className="flex-1 flex flex-col relative bg-zinc-950">
              <SoccerField formation={formation} lineup={lineup} setLineup={setLineup} />
              <Bench players={bench} setBench={setBench} />
              <button 
                onClick={() => setStep('special')} 
                className="absolute bottom-10 right-10 px-10 py-4 bg-yellow-500 text-black font-[1000] rounded-full shadow-[0_10px_30px_rgba(245,196,0,0.3)] uppercase italic active:scale-90 transition-transform"
              >
                PRÓXIMO PASSO →
              </button>
            </div>
          </motion.div>
        )}

        {/* 3. CAPITÃO E HERÓI */}
        {step === 'special' && (
          <motion.div key="special" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CapitaoEHeroi 
              onSelect={(type) => {
                // Aqui você pode disparar um modal de seleção filtrando apenas quem está na lineup
              }}
              captainName={PLAYERS.find(p => p.id === captainId)?.short}
              captainFoto={PLAYERS.find(p => p.id === captainId)?.foto}
              heroName={PLAYERS.find(p => p.id === heroId)?.short}
              heroFoto={PLAYERS.find(p => p.id === heroId)?.foto}
              onNext={() => setStep('prediction')}
            />
          </motion.div>
        )}

        {/* 4. PALPITE */}
        {step === 'prediction' && (
          <motion.div key="prediction" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Palpite 
              scoreTigre={score.tigre}
              scoreAdversario={score.adv}
              setScoreTigre={(v) => setScore(prev => ({...prev, tigre: v}))}
              setScoreAdversario={(v) => setScore(prev => ({...prev, adv: v}))}
              isLocked={isSaving}
              onLock={handleLockPalpite}
            />
          </motion.div>
        )}

        {/* 5. REVELAÇÃO FINAL */}
        {step === 'reveal' && (
          <FinalCardReveal 
            lineup={lineup}
            formation={formation}
            captainId={captainId}
            heroId={heroId}
            scoreTigre={score.tigre}
            scoreAdversario={score.adv}
            onClose={() => setStep('formation')}
          />
        )}

      </AnimatePresence>
    </div>
  );
}
