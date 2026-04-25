'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketList from './MarketList';

// ── Assets & Config ──────────────────────────────────────
const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

interface Player { id: number; name: string; short: string; num: number; pos: string; foto: string; }
type SlotMap = Record<string, { player: Player | null; x: number; y: number }>;

// ── Elenco Completo (39 Jogadores + Técnico) ──────────────
const PLAYERS_DATA: Player[] = [
  // GOLEIROS
  { id: 23, name: "Jordi Martins", short: "JORDI", num: 93, pos: "GOL", foto: "JORDI.png" },
  { id: 1, name: "César Augusto", short: "CÉSAR", num: 31, pos: "GOL", foto: "CESAR-AUGUSTO.jpg.webp" },
  { id: 101, name: "Airton", short: "AIRTON", num: 1, pos: "GOL", foto: "AIRTON.jpg.webp" },
  { id: 102, name: "Lucas Pereira", short: "L. PEREIRA", num: 12, pos: "GOL", foto: "LUCAS-PEREIRA.jpg.webp" },
  // LATERAIS
  { id: 36, name: "Mayk", short: "MAYK", num: 2, pos: "LAT", foto: "MAYK.jpg.webp" },
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LAT", foto: "SANDER%20(1).jpg" },
  { id: 35, name: "Maykon Jesus", short: "MAYKON", num: 16, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 103, name: "Raul Prata", short: "R. PRATA", num: 13, pos: "LAT", foto: "RAUL-PRATA.jpg.webp" },
  { id: 104, name: "Rodrigo Soares", short: "RODRIGO", num: 22, pos: "LAT", foto: "RODRIGO-SOARES.jpg.webp" },
  // ZAGUEIROS
  { id: 8, name: "Patrick", short: "PATRICK", num: 4, pos: "ZAG", foto: "PATRICK.jpg.webp" },
  { id: 38, name: "Renato Palm", short: "R. PALM", num: 33, pos: "ZAG", foto: "RENATO-PALM.jpg.webp" },
  { id: 105, name: "Rafael Donato", short: "DONATO", num: 3, pos: "ZAG", foto: "RAFAEL-DONATO.jpg.webp" },
  { id: 106, name: "Luisão", short: "LUISÃO", num: 34, pos: "ZAG", foto: "LUISAO.jpg.webp" },
  { id: 107, name: "Guilherme Matos", short: "G. MATOS", num: 14, pos: "ZAG", foto: "GUILHERME-MATOS.jpg.webp" },
  // VOLANTES / MEIAS
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 12, name: "Marlon", short: "MARLON", num: 50, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 42, name: "Luiz Gabriel", short: "L. GABRIEL", num: 15, pos: "VOL", foto: "LUIZ-GABRIEL.jpg.webp" },
  { id: 43, name: "Nogueira", short: "NOGUEIRA", num: 21, pos: "VOL", foto: "NOGUEIRA.jpg.webp" },
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },
  { id: 108, name: "Geovane", short: "GEOVANE", num: 7, pos: "VOL", foto: "GEOVANE.jpg.webp" },
  { id: 109, name: "Eduardo", short: "EDUARDO", num: 20, pos: "VOL", foto: "EDUARDO.jpg.webp" },
  { id: 110, name: "Dudu", short: "DUDU", num: 25, pos: "MEI", foto: "DUDU.jpg.webp" },
  { id: 111, name: "Jean Carlos", short: "JEAN", num: 10, pos: "MEI", foto: "JEAN-CARLOS.jpg.webp" },
  // ATACANTES
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 86, name: "Titi Ortiz", short: "ORTÍZ", num: 8, pos: "ATA", foto: "TITI-ORTIZ.jpg.webp" },
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" },
  { id: 112, name: "Waguininho", short: "WAGUININHO", num: 11, pos: "ATA", foto: "WAGUININHO.jpg.webp" },
  { id: 113, name: "Fabrício Daniel", short: "FABRÍCIO", num: 27, pos: "ATA", foto: "FABRICIO-DANIEL.jpg.webp" },
  { id: 114, name: "Neto Pessoa", short: "NETO", num: 9, pos: "ATA", foto: "NETO-PESSOA.jpg.webp" },
  { id: 115, name: "Rodolfo", short: "RODOLFO", num: 18, pos: "ATA", foto: "RODOLFO.jpg.webp" },
  { id: 116, name: "Léo Tocantins", short: "LÉO", num: 19, pos: "ATA", foto: "LEO-TOCANTINS.jpg.webp" },
  { id: 117, name: "Jenison", short: "JENISON", num: 99, pos: "ATA", foto: "JENISON.jpg.webp" },
  // TÉCNICO
  { id: 999, name: "Enderson Moreira", short: "ENDERSON", num: 0, pos: "TEC", foto: "ENDERSON-MOREIRA.jpg.webp" },
];

export default function EscalacaoFormacao() {
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

  const filledCount = Object.values(slotMap).filter(s => s.player).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden font-sans antialiased">
      <AnimatePresence mode="wait">
        
        {step === 'formation' && (
          <motion.div key="f" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col items-center justify-center p-6 bg-black">
            <img src={ESCUDO} className="w-20 mb-8" alt="Tigre" />
            <h1 className="text-3xl font-black italic mb-10 tracking-tighter text-yellow-500 uppercase">Selecione a Tática</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-xl">
              {Object.keys(formationConfigs).map(f => (
                <button key={f} onClick={() => {setFormation(f); setStep('arena');}} className="py-5 bg-zinc-900 border border-white/5 rounded-xl hover:border-yellow-500 transition-all font-black text-xl italic">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-screen relative isolation-auto">
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

            <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-30" />
              
              <div className="relative w-full h-full max-w-4xl">
                {Object.entries(slotMap).map(([id, state]) => (
                  <motion.div 
                    key={id} 
                    onClick={() => { setActiveSlot(id); setMobileMarketOpen(true); }}
                    style={{ left: `${state.x}%`, top: `${state.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
                    className={`w-20 h-28 border-2 rounded-lg flex items-center justify-center overflow-hidden transition-all cursor-pointer ${
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
                        {/* NOME DO JOGADOR - FIX DE NITIDEZ */}
                        <div className="absolute bottom-0 w-full bg-zinc-950 py-1 text-center border-t border-yellow-500/40">
                          <span className="text-[10px] font-black uppercase italic tracking-tighter text-white block leading-none">
                            {state.player.short}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/10 text-4xl font-light">+</span>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-8 flex gap-4 z-[150]">
                <button onClick={() => setStep('formation')} className="px-6 py-3 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">TÁTICA</button>
                {filledCount >= 11 && (
                  <button onClick={() => setStep('final')} className="px-10 py-3 bg-yellow-500 text-black rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                    SALVAR TIME →
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex items-center justify-center p-6 bg-black">
            <div className="bg-zinc-900 p-10 rounded-[32px] border border-yellow-500/50 max-w-sm w-full text-center shadow-2xl">
              <img src={ESCUDO} className="w-16 mx-auto mb-6" />
              <h2 className="text-2xl font-black italic text-yellow-500 mb-6 uppercase">Time Salvo!</h2>
              
              <div className="bg-black/50 p-5 rounded-2xl border border-white/5 mb-8">
                <p className="text-zinc-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Comandante</p>
                <p className="text-xl font-black uppercase italic text-white">Enderson Moreira</p>
              </div>

              <button onClick={() => window.location.reload()} className="w-full py-4 bg-yellow-500 text-black font-black rounded-xl text-xs uppercase hover:scale-[1.02] transition-transform">
                NOVA ESCALAÇÃO
              </button>
              
              <div className="mt-8 text-zinc-600">
                <p className="text-[8px] font-bold uppercase tracking-widest leading-none">Criador: Felipe Makarios</p>
                <p className="text-[10px] text-yellow-500/60 font-black italic mt-1">ARENA TIGRE FC</p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
