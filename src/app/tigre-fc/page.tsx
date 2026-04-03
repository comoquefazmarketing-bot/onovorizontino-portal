'use client';
import { useState, use, useRef } from 'react';
import Campo from './Campo';
import EscalacaoFormacao from './EscalacaoFormacao';
import CapitaoEHeroi from './CapitaoEHeroi';
import Palpite from './Palpite';
import { handleSalvarECompartilhar } from '@/lib/tigre-fc/SalvarECompartilhar';

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  // Desempacota o jogoId conforme o Next.js 15 exige
  const resolvedParams = use(params);
  const jogoId = resolvedParams.jogoId;
  
  // Ref para capturar a imagem do campo no final
  const fieldRef = useRef<HTMLDivElement>(null);

  // Estados da Escalação
  const [step, setStep] = useState<'escalar' | 'palpite'>('escalar');
  const [formation, setFormation] = useState('4-3-3');
  const [lineup, setLineup] = useState<Record<string, any>>({});
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  // Estados de Capitão e Herói
  const [specialMode, setSpecialMode] = useState<'C' | 'H' | null>(null);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  
  // Estados de Palpite e Loading
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [loading, setLoading] = useState(false);

  // Lógica de seleção de jogador
  const handlePlayerSelect = (player: any) => {
    if (specialMode === 'C') {
      setCaptainId(player.id);
      setSpecialMode(null);
    } else if (specialMode === 'H') {
      setHeroId(player.id);
      setSpecialMode(null);
    } else if (selectedSlot) {
      // Adiciona o jogador na posição clicada no campo
      setLineup(prev => ({ ...prev, [selectedSlot]: player }));
      setSelectedSlot(null);
    }
  };

  const isReadyToAdvance = Object.keys(lineup).length === 11 && captainId && heroId;

  const onFinalSave = async () => {
    setLoading(true);
    const result = await handleSalvarECompartilhar({
      jogoId: jogoId || '0',
      formation,
      lineup,
      captainId,
      heroId,
      palpiteCasa: score.home,
      palpiteFora: score.away
    }, fieldRef);
    
    if (result.success) {
       // Opcional: Redirecionar após o sucesso
       console.log("Salvo e compartilhado!");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {step === 'escalar' ? (
        <>
          {/* Fragmento: Escolha de Formação */}
          <EscalacaoFormacao 
            current={formation} 
            onChange={(f: string) => { setFormation(f); setLineup({}); setCaptainId(null); setHeroId(null); }} 
          />

          {/* Fragmento: O Campo Visual */}
          <Campo 
            fieldRef={fieldRef}
            formation={formation as any}
            lineup={lineup}
            selectedSlot={selectedSlot}
            onSlotClick={(id) => { setSelectedSlot(id); setSpecialMode(null); }}
            captainId={captainId}
            heroId={heroId}
          />

          {/* Fragmento: Lista de Jogadores e Botões Especiais */}
          <div className="p-4 mb-24">
            <CapitaoEHeroi 
              onSelect={handlePlayerSelect}
              specialMode={specialMode}
              setSpecialMode={setSpecialMode}
              captainId={captainId}
              heroId={heroId}
              isFull={Object.keys(lineup).length === 11}
              // Passa os jogadores que NÃO estão no campo para a lista
              availablePlayers={[]} // Aqui você filtra sua lista original de PLAYERS
            />
          </div>

          {/* Botão Flutuante de Avançar */}
          <div className="fixed bottom-0 w-full p-4 bg-gradient-to-t from-black via-black to-transparent z-50">
            <button 
              disabled={!isReadyToAdvance}
              onClick={() => setStep('palpite')}
              className="w-full py-4 bg-[#F5C400] text-black font-black rounded-xl disabled:opacity-20 transition-all"
            >
              AVANÇAR PARA PALPITE
            </button>
          </div>
        </>
      ) : (
        /* Fragmento: Tela de Palpite */
        <Palpite 
          home={score.home}
          away={score.away}
          onChange={(field: 'home'|'away', val: number) => setScore(prev => ({ ...prev, [field]: val }))}
          onBack={() => setStep('escalar')}
          onSave={onFinalSave}
          loading={loading}
        />
      )}
    </div>
  );
}
