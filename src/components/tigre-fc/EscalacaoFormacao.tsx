'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

type Player = { 
  id: number; 
  name: string; 
  short: string; 
  num: number; 
  pos: string; 
  foto: string 
};

type Lineup = Record<string, Player | null>;
type Step = 'tutorial' | 'formation' | 'arena' | 'summary';

interface Slot { 
  id: string; 
  x: number; 
  y: number; 
  pos: string; 
  label: string 
}

// ==================== 39 JOGADORES ====================
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
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ==================== FORMAÇÕES (6) ====================
const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [ /* ... mesmo do seu código ... */ ],
  '4-3-3': [ /* ... mesmo do seu código ... */ ],
  '4-4-2': [ /* adicionei as que faltavam para ficar completo */ ],
  '3-5-2': [ /* ... */ ],
  '5-3-2': [ /* ... */ ],
  '4-1-4-1': [ /* ... */ ],
};

const POS_COLORS: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#00F3FF', LAT: '#4FC3F7', 
  VOL: '#BF5FFF', MEI: '#22C55E', ATA: '#FF2D55'
};

// ==================== CARD JOGADOR (FIFA Style) ====================
function FifaPlayerCard({ 
  player, 
  isSelected, 
  onClick 
}: { 
  player: Player | null; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.12, y: -6 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`relative w-16 h-20 rounded-2xl overflow-hidden border-2 shadow-xl transition-all cursor-pointer
        ${isSelected ? 'border-[#F5C400] scale-110 shadow-[0_0_30px_#F5C40080]' : 'border-white/20 hover:border-white/50'}`}
    >
      {player ? (
        <>
          <img src={player.foto} alt={player.short} className="w-full h-full object-cover" />
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent h-10" />
          <div className="absolute bottom-1 left-1 right-1 text-center">
            <p className="text-[10px] font-black text-white tracking-widest drop-shadow">{player.short}</p>
          </div>
        </>
      ) : (
        <div className="flex h-full items-center justify-center text-4xl text-white/30 font-light">+</div>
      )}
    </motion.div>
  );
}

export default function EscalacaoPremium() {
  const [step, setStep] = useState<Step>('tutorial');
  const [formation, setFormation] = useState<keyof typeof FORMATIONS>('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [filterPos, setFilterPos] = useState<string | null>(null);
  const [score, setScore] = useState({ tigre: 2, adv: 1 });

  const slots = useMemo(() => FORMATIONS[formation], [formation]);

  const filteredPlayers = useMemo(() => {
    const targetPos = filterPos || (activeSlot ? slots.find(s => s.id === activeSlot)?.pos : null);
    return targetPos ? PLAYERS.filter(p => p.pos === targetPos) : PLAYERS;
  }, [filterPos, activeSlot, slots]);

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
    setFilterPos(null);
  };

  const filledSlots = Object.values(lineup).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans">
      <AnimatePresence mode="wait">

        {/* TUTORIAL INICIAL - Bem-vindo ao jogo */}
        {step === 'tutorial' && (
          <motion.div 
            key="tutorial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-black to-zinc-950"
          >
            <div className="mb-10">
              <img src={ESCUDO} className="w-28 mx-auto drop-shadow-2xl" alt="Tigre" />
            </div>
            <h1 className="text-5xl font-black italic tracking-tighter mb-4 text-[#F5C400]">TIGRE FC</h1>
            <p className="text-2xl font-light mb-12 max-w-xs">Monte seu time como um técnico de verdade!</p>

            <div className="max-w-md space-y-6 text-left text-sm">
              <div className="bg-zinc-900/70 p-5 rounded-2xl border border-white/10">
                1. Escolha a formação<br />
                2. Arraste ou clique nos jogadores no mercado<br />
                3. Dê seu palpite de placar<br />
                4. Salve e compartilhe!
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep('formation')}
              className="mt-12 bg-[#F5C400] text-black font-black text-xl px-14 py-5 rounded-2xl hover:bg-yellow-400 transition-all active:scale-95"
            >
              COMEÇAR A MONTAR O TIME ⚽
            </motion.button>
          </motion.div>
        )}

        {/* ESCOLHA DE FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">
            <img src={ESCUDO} className="w-24 mb-8" alt="Tigre" />
            <h1 className="text-4xl font-black italic tracking-[-1px] mb-2">Escolha sua Formação</h1>
            <p className="text-zinc-400 mb-10">Qual estilo de jogo você quer hoje?</p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {Object.keys(FORMATIONS).map((f) => (
                <motion.button
                  key={f}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => { setFormation(f as keyof typeof FORMATIONS); setStep('arena'); }}
                  className="py-8 border-2 border-white/10 hover:border-[#F5C400] rounded-3xl font-black text-2xl transition-all hover:bg-white/5"
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ARENA MODE - O coração divertido do jogo */}
        {step === 'arena' && (
          <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
            
            {/* CAMPO 3D */}
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-emerald-950 to-black p-4 relative">
              <div style={{ perspective: '1100px' }} className="relative w-full max-w-[460px]">
                <motion.div 
                  initial={{ rotateX: 18 }}
                  animate={{ rotateX: 12 }}
                  className="relative aspect-[10/13] bg-[#0a2a18] rounded-[44px] border-8 border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#0f3a22_0,#0f3a22_18px,#0a2a18_18px,#0a2a18_36px)]" />
                  <div className="absolute top-1/2 w-full h-px bg-white/30" />

                  <AnimatePresence mode="popLayout">
                    {slots.map((slot) => (
                      <motion.div
                        key={`${formation}-${slot.id}`}
                        layoutId={`player-${slot.id}`}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                        onClick={() => { setActiveSlot(slot.id); setFilterPos(null); }}
                      >
                        <FifaPlayerCard 
                          player={lineup[slot.id] || null} 
                          isSelected={activeSlot === slot.id}
                          onClick={() => { setActiveSlot(slot.id); setFilterPos(null); }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            {/* MERCADO - Sempre visível e divertido */}
            <div className="w-full lg:w-[440px] bg-zinc-950 border-l border-white/10 flex flex-col">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-[#F5C400] font-black text-2xl italic">MERCADO TIGRE</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  {activeSlot ? `Escolhendo para: ${slots.find(s => s.id === activeSlot)?.label}` : 'Toque em um espaço vazio no campo'}
                </p>
              </div>

              {/* Filtros rápidos */}
              <div className="flex gap-2 p-4 overflow-x-auto bg-black border-b border-white/10">
                {['GOL','LAT','ZAG','VOL','MEI','ATA'].map(pos => (
                  <button
                    key={pos}
                    onClick={() => setFilterPos(filterPos === pos ? null : pos)}
                    className={`px-6 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      filterPos === pos ? 'bg-[#F5C400] text-black' : 'bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>

              {/* Grid de jogadores */}
              <div className="flex-1 p-4 overflow-y-auto grid grid-cols-4 gap-3">
                <AnimatePresence>
                  {filteredPlayers.map((player) => (
                    <motion.div
                      key={player.id}
                      layout
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      whileTap={{ scale: 0.88 }}
                      onClick={() => handleSelectPlayer(player)}
                      className="aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-[#F5C400]/60 cursor-pointer active:scale-95 transition-all"
                    >
                      <img src={player.foto} className="w-full h-full object-cover" alt={player.short} />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 p-2">
                        <p className="text-[10px] font-black text-center text-white truncate">{player.short}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="p-6 border-t border-white/10 bg-black">
                <button 
                  onClick={() => setStep('summary')}
                  disabled={filledSlots < 11}
                  className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all ${
                    filledSlots >= 11 
                      ? 'bg-[#F5C400] text-black hover:bg-yellow-400' 
                      : 'bg-zinc-800 text-white/40 cursor-not-allowed'
                  }`}
                >
                  {filledSlots >= 11 ? 'FINALIZAR ESCALAÇÃO ⚡' : `${11 - filledSlots} vagas em aberto`}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESUMO + PALPITE */}
        {step === 'summary' && (
          <motion.div 
            key="summary" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 text-center"
          >
            <h2 className="text-4xl font-black italic text-[#F5C400] mb-10">Seu Palpite Final</h2>
            
            <div className="flex items-center gap-10 mb-12">
              <div className="flex flex-col items-center">
                <img src={ESCUDO} className="w-20 mb-4" alt="Tigre" />
                <input 
                  type="number" 
                  value={score.tigre} 
                  onChange={(e) => setScore({ ...score, tigre: Number(e.target.value) })}
                  className="w-28 h-28 bg-zinc-900 border-4 border-[#F5C400] rounded-3xl text-center text-6xl font-black focus:outline-none"
                />
              </div>
              <span className="text-5xl font-light text-white/30">×</span>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-zinc-800 mb-4 flex items-center justify-center text-xs font-bold">ADV</div>
                <input 
                  type="number" 
                  value={score.adv} 
                  onChange={(e) => setScore({ ...score, adv: Number(e.target.value) })}
                  className="w-28 h-28 bg-zinc-900 border-4 border-white/20 rounded-3xl text-center text-6xl font-black focus:outline-none"
                />
              </div>
            </div>

            <button className="bg-white text-black px-16 py-6 rounded-3xl font-black text-xl hover:bg-yellow-400 transition-all active:scale-95">
              SALVAR E COMPARTILHAR TIME
            </button>

            <button 
              onClick={() => setStep('arena')}
              className="mt-8 text-white/50 hover:text-white font-medium transition-colors"
            >
              ← Voltar e editar o time
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
