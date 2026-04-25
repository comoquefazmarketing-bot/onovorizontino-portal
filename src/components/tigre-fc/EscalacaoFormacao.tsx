'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketList from './MarketList';

// ── Assets & Config ──────────────────────────────────────
const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

interface Player { id: number; name: string; short: string; num: number; pos: string; foto: string; }
type SlotMap = Record<string, { player: Player | null; x: number; y: number }>;

interface EscalacaoProps {
  jogoId?: number | string;
}

const PLAYERS_DATA: Player[] = [
  { id: 23, name: "Jordi Martins", short: "JORDI", num: 93, pos: "GOL", foto: "JORDI.png" },
  { id: 1, name: "César", short: "CÉSAR", num: 31, pos: "GOL", foto: "CESAR-AUGUSTO.jpg.webp" },
  { id: 22, name: "João Scapin", short: "SCAPIN", num: 12, pos: "GOL", foto: "JOAO-SCAPIN.jpg.webp" },
  { id: 62, name: "Lucas", short: "LUCAS", num: 1, pos: "GOL", foto: "LUCAS.jpg.webp" },
  { id: 8, name: "Patrick", short: "PATRICK", num: 4, pos: "ZAG", foto: "PATRICK.jpg.webp" },
  { id: 38, name: "Renato Palm", short: "R. PALM", num: 33, pos: "ZAG", foto: "RENATO-PALM.jpg.webp" },
  { id: 34, name: "Eduardo Brock", short: "BROCK", num: 14, pos: "ZAG", foto: "EDUARDO-BROCK.jpg.webp" },
  { id: 66, name: "Alexis Alvariño", short: "ALVARÍÑO", num: 22, pos: "ZAG", foto: "ALEXIS-ALVARIÑO.jpg.webp" },
  { id: 6, name: "Carlinhos", short: "CARLINHOS", num: 3, pos: "ZAG", foto: "CARLINHOS.jpg.webp" },
  { id: 3, name: "Dantas", short: "DANTAS", num: 25, pos: "ZAG", foto: "DANTAS.jpg.webp" },
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LAT", foto: "SANDER (1).jpg" },
  { id: 28, name: "Maykon Jesus", short: "MAYKON", num: 66, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 27, name: "Nilson Castrillón", short: "NILSON", num: 20, pos: "LAT", foto: "NILSON-CASTRILLON.jpg.webp" },
  { id: 75, name: "Jhilmar Lora", short: "LORA", num: 24, pos: "LAT", foto: "LORA.jpg.webp" },
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 46, name: "Marlon", short: "MARLON", num: 28, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 40, name: "Léo Naldi", short: "NALDI", num: 18, pos: "VOL", foto: "LÉO-NALDI.jpg.webp" },
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 12, name: "Juninho", short: "JUNINHO", num: 50, pos: "MEI", foto: "JUNINHO.jpg.webp" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },
  { id: 86, name: "Christian Ortíz", short: "TITI ORTÍZ", num: 8, pos: "MEI", foto: "CHRISTIAN-ORTÍZ.jpg.webp" },
  { id: 13, name: "Diego Galo", short: "D. GALO", num: 19, pos: "MEI", foto: "DIEGO-GALO.jpg.webp" },
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 50, name: "Carlão", short: "CARLÃO", num: 9, pos: "ATA", foto: "CARLÃO.jpg.webp" },
  { id: 52, name: "Hélio Borges", short: "HÉLIO", num: 41, pos: "ATA", foto: "HÉLIO-BORGES.jpg.webp" },
  { id: 53, name: "Jardiel", short: "JARDIEL", num: 40, pos: "ATA", foto: "JARDIEL.jpg.webp" },
  { id: 91, name: "Hector Bianchi", short: "HECTOR", num: 35, pos: "ATA", foto: "HECTOR-BIANCHI.jpg.webp" },
  { id: 999, name: "Enderson Moreira", short: "ENDERSON", num: 0, pos: "TEC", foto: "ENDERSON-MOREIRA.jpg.webp" },
];

export default function EscalacaoFormacao({ jogoId }: EscalacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'final'>('formation');
  const [formation, setFormation] = useState('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);

  // Função para tratar URLs com caracteres especiais (Ex: Ñ, Í, espaços)
  const getValidPhotoUrl = (fotoPath: string) => {
    if (!fotoPath) return ESCUDO;
    const encodedPath = encodeURIComponent(fotoPath).replace(/%2F/g, '/');
    return `${BASE_STORAGE}${encodedPath}`;
  };

  const formationConfigs: Record<string, any> = {
    '4-3-3': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'm1':{x:50,y:48}, 'm2':{x:30,y:42}, 'm3':{x:70,y:42}, 'st':{x:50,y:15}, 'lw':{x:22,y:22}, 'rw':{x:78,y:22} },
    '4-4-2': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'm1':{x:35,y:45}, 'm2':{x:65,y:45}, 'm3':{x:15,y:38}, 'm4':{x:85,y:38}, 'st1':{x:40,y:18}, 'st2':{x:60,y:18} },
    '3-5-2': { 'gk':{x:50,y:85}, 'cb1':{x:30,y:70}, 'cb2':{x:50,y:73}, 'cb3':{x:70,y:70}, 'lm':{x:15,y:45}, 'rm':{x:85,y:45}, 'm1':{x:35,y:50}, 'm2':{x:65,y:50}, 'am':{x:50,y:32}, 'st1':{x:40,y:15}, 'st2':{x:60,y:15} },
    '4-5-1': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'm1':{x:30,y:48}, 'm2':{x:50,y:48}, 'm3':{x:70,y:48}, 'am1':{x:35,y:30}, 'am2':{x:65,y:30}, 'st':{x:50,y:15} },
    '4-2-3-1': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'v1':{x:40,y:52}, 'v2':{x:60,y:52}, 'am':{x:50,y:35}, 'lw':{x:20,y:28}, 'rw':{x:80,y:28}, 'st':{x:50,y:12} },
    '5-3-2': { 'gk':{x:50,y:85}, 'lb':{x:12,y:52}, 'cb1':{x:30,y:70}, 'cb2':{x:50,y:73}, 'cb3':{x:70,y:70}, 'rb':{x:88,y:52}, 'm1':{x:50,y:48}, 'm2':{x:30,y:40}, 'm3':{x:70,y:40}, 'st1':{x:42,y:18}, 'st2':{x:58,y:18} }
  };

  useEffect(() => {
    const coords = formationConfigs[formation];
    const initial: SlotMap = {};
    Object.entries(coords).forEach(([id, c]: any) => initial[id] = { player: null, ...c });
    setSlotMap(initial);
  }, [formation]);

  const handlePlayerSelection = (player: Player) => {
    if (activeSlot) {
      setSlotMap(prev => ({ ...prev, [activeSlot]: { ...prev[activeSlot], player } }));
      setActiveSlot(null);
    } else {
      setPendingPlayer(player);
    }
  };

  const handleSlotClick = (slotId: string) => {
    if (pendingPlayer) {
      setSlotMap(prev => ({ ...prev, [slotId]: { ...prev[slotId], player: pendingPlayer } }));
      setPendingPlayer(null);
    } else {
      setActiveSlot(slotId === activeSlot ? null : slotId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden select-none flex flex-col touch-none">
      <AnimatePresence mode="wait">
        
        {step === 'formation' && (
          <motion.div key="f" className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950">
            <h1 className="text-3xl font-black italic mb-10 text-yellow-500 uppercase tracking-tighter text-center">Escolha a Tática</h1>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {Object.keys(formationConfigs).map(f => (
                <button key={f} onClick={() => {setFormation(f); setStep('arena');}} className="py-6 bg-zinc-900 border-2 border-white/5 rounded-2xl active:scale-95 transition-all font-black text-2xl italic hover:border-yellow-500">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="a" className="flex-1 flex flex-col md:flex-row relative overflow-hidden h-full">
            <div className="h-[30%] md:h-full md:w-80 z-[110] bg-black/60 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10">
              <MarketList 
                players={PLAYERS_DATA} 
                isEscalado={(id) => Object.values(slotMap).some(s => s.player?.id === id)} 
                onSelect={handlePlayerSelection}
              />
            </div>

            <div className="flex-1 relative bg-zinc-900 overflow-hidden">
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none scale-105" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />
              
              <div className="relative w-full h-full">
                {Object.entries(slotMap).map(([id, state]) => (
                  <motion.div 
                    key={id} 
                    drag 
                    dragMomentum={false}
                    dragElastic={0}
                    onClick={() => handleSlotClick(id)}
                    style={{ 
                      left: `${state.x}%`, 
                      top: `${state.y}%`, 
                      position: 'absolute', 
                      transform: 'translate(-50%, -50%)',
                      filter: 'drop-shadow(15px 15px 12px rgba(0,0,0,0.6)) drop-shadow(-15px 15px 12px rgba(0,0,0,0.4))'
                    }}
                    className={`w-16 h-22 md:w-24 md:h-32 border-2 rounded-xl flex items-center justify-center overflow-hidden z-50 cursor-grab active:cursor-grabbing transition-all ${
                      activeSlot === id || pendingPlayer ? 'border-yellow-500 bg-yellow-500/30 scale-110 shadow-[0_0_40px_rgba(234,179,8,0.7)]' : 'border-white/30 bg-black/80'
                    }`}
                  >
                    {state.player ? (
                      <div className="relative w-full h-full pointer-events-none bg-zinc-800">
                        <img 
                          src={getValidPhotoUrl(state.player.foto)}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: 'center 15%' }} 
                          onError={(e) => { 
                             const target = e.target as HTMLImageElement;
                             if(target.src !== ESCUDO) target.src = ESCUDO;
                          }}
                        />
                        <div className="absolute bottom-0 w-full bg-yellow-500 py-1 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
                          <span className="text-[9px] md:text-[12px] font-black uppercase text-black leading-none block text-center tracking-tighter">
                            {state.player.short}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center opacity-20">
                        <span className="text-2xl font-thin">+</span>
                        <span className="text-[7px] font-bold uppercase tracking-widest">{id}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-[120] px-6">
                <button onClick={() => setStep('formation')} className="flex-1 max-w-[140px] py-4 bg-zinc-900/90 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md active:scale-95 transition-all">ALTERAR TÁTICA</button>
                <button onClick={() => setStep('final')} className="flex-1 max-w-[200px] py-4 bg-yellow-500 text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_15px_40px_rgba(234,179,8,0.4)] active:scale-95 transition-all">FINALIZAR TIME</button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div key="f" className="flex-1 flex items-center justify-center p-6 bg-zinc-950">
             <div className="bg-zinc-900 w-full max-w-sm p-10 rounded-[48px] border-2 border-yellow-500/20 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-yellow-500" />
                <h2 className="text-4xl font-black italic text-white mb-8 uppercase tracking-tighter">
                  TIME <span className="text-yellow-500 font-black">ESCALADO</span>
                </h2>
                <div className="p-6 bg-black/60 rounded-3xl mb-8 border border-white/5">
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-2">COMANDANTE</p>
                  <p className="text-2xl font-black italic text-white uppercase tracking-tight">Enderson Moreira</p>
                  {jogoId && <p className="text-[10px] text-yellow-500/40 mt-3 font-bold uppercase tracking-widest">Partida #{jogoId}</p>}
                </div>
                <button onClick={() => window.location.reload()} className="w-full py-6 bg-yellow-500 text-black font-black rounded-2xl text-base uppercase shadow-xl hover:brightness-110 active:scale-95 transition-all">REINICIAR</button>
                <p className="mt-10 text-[8px] text-zinc-600 font-bold uppercase tracking-[0.4em]">Felipe Makarios • Arena Tigre FC</p>
             </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
