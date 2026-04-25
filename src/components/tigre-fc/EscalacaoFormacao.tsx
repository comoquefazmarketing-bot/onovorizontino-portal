'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketList from './MarketList';

const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

interface Player { id: number; name: string; short: string; num: number; pos: string; foto: string; }
type SlotMap = Record<string, { player: Player | null; x: number; y: number }>;

interface EscalacaoProps { jogoId?: number; }

// ── Elenco Real e Ativo (Baseado no seu SQL e Arquivos) ──
const PLAYERS_DATA: Player[] = [
  // GOLEIROS
  { id: 23, name: "Jordi Martins", short: "JORDI", num: 93, pos: "GOL", foto: "JORDI.png" },
  { id: 1, name: "César", short: "CÉSAR", num: 31, pos: "GOL", foto: "CESAR-AUGUSTO.jpg.webp" },
  { id: 22, name: "João Scapin", short: "SCAPIN", num: 12, pos: "GOL", foto: "JOAO-SCAPIN.jpg.webp" },
  { id: 62, name: "Lucas", short: "LUCAS", num: 1, pos: "GOL", foto: "LUCAS.jpg.webp" },
  // ZAGUEIROS
  { id: 8, name: "Patrick", short: "PATRICK", num: 4, pos: "ZAG", foto: "PATRICK.jpg.webp" },
  { id: 38, name: "Renato Palm", short: "R. PALM", num: 33, pos: "ZAG", foto: "RENATO-PALM.jpg.webp" },
  { id: 34, name: "Eduardo Brock", short: "BROCK", num: 14, pos: "ZAG", foto: "EDUARDO-BROCK.jpg.webp" },
  { id: 66, name: "Alexis Alvariño", short: "ALVARÍÑO", num: 22, pos: "ZAG", foto: "ALEXIS-ALVARIÑO.jpg.webp" },
  { id: 6, name: "Carlinhos", short: "CARLINHOS", num: 3, pos: "ZAG", foto: "CARLINHOS.jpg.webp" },
  { id: 3, name: "Dantas", short: "DANTAS", num: 25, pos: "ZAG", foto: "DANTAS.jpg.webp" },
  // LATERAIS
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LAT", foto: "SANDER (1).jpg" },
  { id: 28, name: "Maykon Jesus", short: "MAYKON", num: 66, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 27, name: "Nilson Castrillón", short: "NILSON", num: 20, pos: "LAT", foto: "NILSON-CASTRILLON.jpg.webp" },
  { id: 75, name: "Jhilmar Lora", short: "LORA", num: 24, pos: "LAT", foto: "LORA.jpg.webp" },
  // MEIAS / VOLANTES
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 46, name: "Marlon", short: "MARLON", num: 28, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 40, name: "Léo Naldi", short: "NALDI", num: 18, pos: "VOL", foto: "LÉO-NALDI.jpg.webp" },
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 12, name: "Juninho", short: "JUNINHO", num: 50, pos: "MEI", foto: "JUNINHO.jpg.webp" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },
  { id: 86, name: "Christian Ortíz", short: "TITI ORTÍZ", num: 8, pos: "MEI", foto: "CHRISTIAN-ORTÍZ.jpg.webp" },
  { id: 13, name: "Diego Galo", short: "D. GALO", num: 19, pos: "MEI", foto: "DIEGO-GALO.jpg.webp" },
  // ATACANTES
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 50, name: "Carlão", short: "CARLÃO", num: 9, pos: "ATA", foto: "CARLÃO.jpg.webp" },
  { id: 52, name: "Hélio Borges", short: "HÉLIO", num: 41, pos: "ATA", foto: "HÉLIO-BORGES.jpg.webp" },
  { id: 53, name: "Jardiel", short: "JARDIEL", num: 40, pos: "ATA", foto: "JARDIEL.jpg.webp" },
  { id: 91, name: "Hector Bianchi", short: "HECTOR", num: 35, pos: "ATA", foto: "HECTOR-BIANCHI.jpg.webp" },
  // TÉCNICO
  { id: 999, name: "Enderson Moreira", short: "ENDERSON", num: 0, pos: "TEC", foto: "ENDERSON-MOREIRA.jpg.webp" },
];

export default function EscalacaoFormacao({ jogoId }: EscalacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'final'>('formation');
  const [formation, setFormation] = useState('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);

  const formationConfigs: Record<string, Record<string, {x:number, y:number}>> = {
    '4-3-3': { 'gk':{x:50,y:85}, 'lb':{x:15,y:65}, 'cb1':{x:38,y:72}, 'cb2':{x:62,y:72}, 'rb':{x:85,y:65}, 'm1':{x:50,y:50}, 'm2':{x:30,y:45}, 'm3':{x:70,y:45}, 'st':{x:50,y:18}, 'lw':{x:22,y:25}, 'rw':{x:78,y:25} },
    '4-4-2': { 'gk':{x:50,y:85}, 'lb':{x:15,y:65}, 'cb1':{x:38,y:72}, 'cb2':{x:62,y:72}, 'rb':{x:85,y:65}, 'm1':{x:35,y:48}, 'm2':{x:65,y:48}, 'm3':{x:15,y:40}, 'm4':{x:85,y:40}, 'st1':{x:40,y:20}, 'st2':{x:60,y:20} },
    '3-5-2': { 'gk':{x:50,y:85}, 'cb1':{x:50,y:72}, 'cb2':{x:30,y:68}, 'cb3':{x:70,y:68}, 'm1':{x:50,y:52}, 'm2':{x:30,y:45}, 'm3':{x:70,y:45}, 'lm':{x:15,y:40}, 'rm':{x:85,y:40}, 'st1':{x:40,y:20}, 'st2':{x:60,y:20} },
    '4-2-3-1': { 'gk':{x:50,y:85}, 'lb':{x:15,y:65}, 'cb1':{x:38,y:72}, 'cb2':{x:62,y:72}, 'rb':{x:85,y:65}, 'v1':{x:40,y:55}, 'v2':{x:60,y:55}, 'am':{x:50,y:38}, 'lw':{x:20,y:30}, 'rw':{x:80,y:30}, 'st':{x:50,y:15} },
    '3-4-3': { 'gk':{x:50,y:85}, 'cb1':{x:50,y:72}, 'cb2':{x:28,y:68}, 'cb3':{x:72,y:68}, 'm1':{x:40,y:48}, 'm2':{x:60,y:48}, 'lm':{x:15,y:45}, 'rm':{x:85,y:45}, 'st':{x:50,y:18}, 'lw':{x:25,y:25}, 'rw':{x:75,y:25} },
    '5-3-2': { 'gk':{x:50,y:85}, 'lb':{x:15,y:60}, 'cb1':{x:50,y:72}, 'cb2':{x:32,y:72}, 'cb3':{x:68,y:72}, 'rb':{x:85,y:60}, 'm1':{x:50,y:45}, 'm2':{x:30,y:42}, 'm3':{x:70,y:42}, 'st1':{x:40,y:20}, 'st2':{x:60,y:20} }
  };

  useEffect(() => {
    const coords = formationConfigs[formation];
    const initial: SlotMap = {};
    Object.entries(coords).forEach(([id, c]) => initial[id] = { player: null, ...c });
    setSlotMap(initial);
  }, [formation]);

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'formation' && (
          <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col items-center justify-center p-6">
            <img src={ESCUDO} className="w-16 mb-6" alt="Tigre" />
            <h1 className="text-2xl font-black italic mb-8 tracking-tighter text-yellow-500 uppercase">Selecione a Tática</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
              {Object.keys(formationConfigs).map(f => (
                <button key={f} onClick={() => {setFormation(f); setStep('arena');}} className="py-4 bg-zinc-900 border border-white/5 rounded-xl hover:border-yellow-500 transition-all font-black text-lg italic">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen relative">
            <div className={`${mobileMarketOpen ? 'fixed inset-0 z-[200] flex' : 'hidden lg:flex'}`}>
              <MarketList 
                players={PLAYERS_DATA} 
                isEscalado={(id) => Object.values(slotMap).some(s => s.player?.id === id)} 
                onSelect={(p) => {
                  if (activeSlot) {
                    setSlotMap(prev => ({ ...prev, [activeSlot]: { ...prev[activeSlot], player: p } }));
                    setActiveSlot(null);
                    setMobileMarketOpen(false);
                  }
                }}
                onDragStart={() => {}} onDragEnd={() => {}}
              />
            </div>

            <div className="flex-1 relative bg-black flex items-center justify-center">
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-20" />
              <div className="relative w-full h-full max-w-4xl">
                {Object.entries(slotMap).map(([id, state]) => (
                  <motion.div 
                    key={id} 
                    onClick={() => { setActiveSlot(id); setMobileMarketOpen(true); }}
                    style={{ left: `${state.x}%`, top: `${state.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
                    className={`w-20 h-28 border-2 rounded-lg flex items-center justify-center overflow-hidden transition-all ${
                      activeSlot === id ? 'border-yellow-500 bg-yellow-500/20' : 'border-white/10 bg-black/60'
                    }`}
                  >
                    {state.player ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={`${BASE_STORAGE}${state.player.foto}`}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: '80% center' }} 
                          onError={(e) => { (e.target as HTMLImageElement).src = ESCUDO; }}
                        />
                        <div className="absolute bottom-0 w-full bg-zinc-950 py-1 text-center border-t border-yellow-500/40">
                          <span className="text-[10px] font-black uppercase italic text-white block leading-none">
                            {state.player.short}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/10 text-4xl">+</span>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-6 flex gap-4 z-[150]">
                <button onClick={() => setStep('formation')} className="px-5 py-2 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase">TÁTICA</button>
                {Object.values(slotMap).filter(s => s.player).length >= 11 && (
                  <button onClick={() => setStep('final')} className="px-8 py-2 bg-yellow-500 text-black rounded-full text-[10px] font-black uppercase shadow-2xl">
                    SALVAR TIME →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex items-center justify-center bg-black p-6">
            <div className="bg-zinc-900 p-8 rounded-[32px] border border-yellow-500/50 max-w-xs w-full text-center shadow-2xl">
              <img src={ESCUDO} className="w-12 mx-auto mb-4" />
              <h2 className="text-xl font-black italic text-yellow-500 mb-6 uppercase tracking-tighter">Escalação Confirmada!</h2>
              <div className="bg-black/50 p-4 rounded-xl border border-white/5 mb-6">
                <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">Comandante</p>
                <p className="text-lg font-black uppercase italic text-white">Enderson Moreira</p>
              </div>
              <button onClick={() => window.location.reload()} className="w-full py-3 bg-yellow-500 text-black font-black rounded-xl text-[10px] uppercase">
                NOVO TIME
              </button>
              <div className="mt-6">
                <p className="text-[7px] text-zinc-600 font-bold uppercase tracking-widest">Criador: Felipe Makarios</p>
                <p className="text-[9px] text-yellow-500/40 font-black italic mt-1 uppercase">ARENA TIGRE FC (ID: {jogoId})</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
