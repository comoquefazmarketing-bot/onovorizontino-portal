'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: true, autoRefreshToken: true } }
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const PLAYERS = [
  { id: 1,  name: 'César Augusto',   short: 'César',      num: 31, pos: 'GOL', foto: BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id: 2,  name: 'Jordi',           short: 'Jordi',      num: 93, pos: 'GOL', foto: BASE+'JORDI.jpg.webp' },
  { id: 3,  name: 'João Scapin',     short: 'Scapin',     num: 12, pos: 'GOL', foto: BASE+'JOAO-SCAPIN.jpg.webp' },
  { id: 4,  name: 'Lucas Ribeiro',   short: 'Lucas',      num: 1,  pos: 'GOL', foto: BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id: 5,  name: 'Lora',            short: 'Lora',       num: 2,  pos: 'LAT', foto: BASE+'LORA.jpg.webp' },
  { id: 6,  name: 'Castrillón',      short: 'Castrillón', num: 6,  pos: 'LAT', foto: BASE+'CASTRILLON.jpg.webp' },
  { id: 7,  name: 'Igor Formiga',    short: 'Formiga',    num: 13, pos: 'LAT', foto: BASE+'IGOR-FORMIGA.jpg.webp' },
  { id: 8,  name: 'Felipe Marques',  short: 'F. Marques', num: 7,  pos: 'LAT', foto: BASE+'FELIPE-MARQUES.jpg.webp' },
  { id: 9,  name: 'Mateus Muller',   short: 'Muller',     num: 16, pos: 'LAT', foto: BASE+'MATEUS-MULLER.jpg.webp' },
  { id: 10, name: 'Dantas',          short: 'Dantas',     num: 3,  pos: 'ZAG', foto: BASE+'DANTAAS.jpg.webp' },
  { id: 11, name: 'Eduardo Brock',   short: 'E.Brock',    num: 5,  pos: 'ZAG', foto: BASE+'EDUARDO-BROCK.jpg.webp' },
  { id: 12, name: 'Rafael Donato',   short: 'Donato',     num: 4,  pos: 'ZAG', foto: BASE+'DONATO.jpg.webp' },
  { id: 13, name: 'Luisão',          short: 'Luisão',     num: 14, pos: 'ZAG', foto: BASE+'LUISAO.jpg.webp' },
  { id: 14, name: 'Renato Silveira', short: 'Renato',     num: 22, pos: 'ZAG', foto: BASE+'RENATO-SILVEIRA.jpg.webp' },
  { id: 15, name: 'Geovane',         short: 'Geovane',    num: 15, pos: 'MEI', foto: BASE+'GEOVANE.jpg.webp' },
  { id: 16, name: 'Willian Farias',  short: 'W. Farias',  num: 17, pos: 'MEI', foto: BASE+'WILLIAN-FARIAS.jpg.webp' },
  { id: 17, name: 'Ricardinho',      short: 'Ricardinho', num: 20, pos: 'MEI', foto: BASE+'RICARDINHO.jpg.webp' },
  { id: 18, name: 'Marlon',          short: 'Marlon',     num: 21, pos: 'MEI', foto: BASE+'MARLON.jpg.webp' },
  { id: 19, name: 'Luís Oyama',      short: 'Oyama',      num: 8,  pos: 'MEI', foto: BASE+'LUIS-OYAMA.jpg.webp' },
  { id: 20, name: 'Neto Moura',      short: 'Neto',       num: 18, pos: 'MEI', foto: BASE+'NETO-MOURA.jpg.webp' },
  { id: 21, name: 'Rômulo',          short: 'Rômulo',     num: 10, pos: 'MEI', foto: BASE+'ROMULO.jpg.webp' },
  { id: 30, name: 'Rodolfo',         short: 'Rodolfo',    num: 11, pos: 'ATA', foto: BASE+'RODOLFO.jpg.webp' },
  { id: 31, name: 'Robson',          short: 'Robson',     num: 9,  pos: 'ATA', foto: BASE+'ROBSON.jpg.webp' },
  { id: 32, name: 'Dellatorre',      short: 'Dellatorre', num: 19, pos: 'ATA', foto: BASE+'DELLATORRE.jpg.webp' },
  { id: 33, name: 'Fabrício Daniel', short: 'Fabrício',   num: 27, pos: 'ATA', foto: BASE+'FABRICIO-DANIEL.jpg.webp' },
  { id: 38, name: 'Carlão',          short: 'Carlão',     num: 90, pos: 'ATA', foto: BASE+'CARLAO.jpg.webp' },
];

const FORMATIONS = {
  '4-2-3-1': [
    { id: 'gk',  label: 'GOL', x: 50, y: 84 },
    { id: 'rb',  label: 'LD',  x: 88, y: 65 }, { id: 'cb1', label: 'ZAG', x: 62, y: 72 }, { id: 'cb2', label: 'ZAG', x: 38, y: 72 }, { id: 'lb',  label: 'LE',  x: 12, y: 65 },
    { id: 'dm1', label: 'VOL', x: 65, y: 52 }, { id: 'dm2', label: 'VOL', x: 35, y: 52 },
    { id: 'am1', label: 'MD',  x: 82, y: 35 }, { id: 'am2', label: 'MEI', x: 50, y: 32 }, { id: 'am3', label: 'ME',  x: 18, y: 35 },
    { id: 'st',  label: 'CA',  x: 50, y: 12 },
  ],
  '4-4-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 84 },
    { id: 'rb',  label: 'LD',  x: 85, y: 65 }, { id: 'cb1', label: 'ZAG', x: 65, y: 70 }, { id: 'cb2', label: 'ZAG', x: 35, y: 70 }, { id: 'lb',  label: 'LE',  x: 15, y: 65 },
    { id: 'rm',  label: 'MD',  x: 82, y: 45 }, { id: 'cm1', label: 'MC',  x: 60, y: 48 }, { id: 'cm2', label: 'MC',  x: 40, y: 48 }, { id: 'lm',  label: 'ME',  x: 18, y: 45 },
    { id: 'st1', label: 'ATA', x: 65, y: 18 }, { id: 'st2', label: 'ATA', x: 35, y: 18 },
  ],
  '4-3-3': [
    { id: 'gk',  label: 'GOL', x: 50, y: 84 },
    { id: 'rb',  label: 'LD',  x: 85, y: 65 }, { id: 'cb1', label: 'ZAG', x: 65, y: 70 }, { id: 'cb2', label: 'ZAG', x: 35, y: 70 }, { id: 'lb',  label: 'LE',  x: 15, y: 65 },
    { id: 'cm1', label: 'MC',  x: 75, y: 45 }, { id: 'cm2', label: 'MC',  x: 50, y: 48 }, { id: 'cm3', label: 'MC',  x: 25, y: 45 },
    { id: 'rw',  label: 'PD',  x: 80, y: 18 }, { id: 'st',  label: 'CA',  x: 50, y: 12 }, { id: 'lw',  label: 'PE',  x: 20, y: 18 },
  ],
  '3-5-2': [
    { id: 'gk',  label: 'GOL', x: 50, y: 84 },
    { id: 'cb1', label: 'ZAG', x: 75, y: 70 }, { id: 'cb2', label: 'ZAG', x: 50, y: 72 }, { id: 'cb3', label: 'ZAG', x: 25, y: 70 },
    { id: 'rwb', label: 'ALA', x: 88, y: 45 }, { id: 'm1',  label: 'MC',  x: 65, y: 48 }, { id: 'm2',  label: 'MC',  x: 50, y: 52 }, { id: 'm3',  label: 'MC',  x: 35, y: 48 }, { id: 'lwb', label: 'ALA', x: 12, y: 45 },
    { id: 'st1', label: 'ATA', x: 60, y: 18 }, { id: 'st2', label: 'ATA', x: 40, y: 18 },
  ],
};

export default function TigreFCEscalar({ jogoId }: { jogoId: number }) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState('login');
  const [usuario, setUsuario] = useState<any>(null);
  const [formation, setFormation] = useState('4-2-3-1');
  const [lineup, setLineup] = useState<Record<string, any>>({});
  const [activePlayer, setActivePlayer] = useState<any>(null); // Jogador vindo do Banco
  const [sourceSlot, setSourceSlot] = useState<string | null>(null); // Slot de origem para Troca Direta
  const [filterPos, setFilterPos] = useState('TODOS');

  useEffect(() => { setMounted(true); checkSession(); }, []);

  async function checkSession() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) { setUsuario(session.user); setStep('escalar'); }
  }

  const handleSlotClick = (slotId: string) => {
    // CASO 1: Inserir jogador vindo do banco (activePlayer selecionado)
    if (activePlayer && !sourceSlot) {
      const existingSlot = Object.keys(lineup).find(key => lineup[key].id === activePlayer.id);
      let newLineup = { ...lineup };
      if (existingSlot) delete newLineup[existingSlot];
      setLineup({ ...newLineup, [slotId]: activePlayer });
      setActivePlayer(null);
      return;
    }

    // CASO 2: Lógica de Troca Direta no Campo
    if (lineup[slotId]) {
      if (!sourceSlot) {
        setSourceSlot(slotId); // Seleciona o primeiro jogador para trocar
      } else if (sourceSlot === slotId) {
        setSourceSlot(null); // Cancela se clicar no mesmo
      } else {
        // EXECUTA A TROCA DE POSIÇÃO
        const newLineup = { ...lineup };
        const temp = newLineup[slotId];
        newLineup[slotId] = newLineup[sourceSlot];
        newLineup[sourceSlot] = temp;
        setLineup(newLineup);
        setSourceSlot(null);
      }
    } else if (sourceSlot) {
      // Se clicar num slot vazio tendo um de origem selecionado, ele move o jogador
      const newLineup = { ...lineup };
      newLineup[slotId] = newLineup[sourceSlot];
      delete newLineup[sourceSlot];
      setLineup(newLineup);
      setSourceSlot(null);
    }
  };

  if (!mounted) return null;
  if (step === 'login') return <TigreFCLogin jogoId={jogoId} onSuccess={(u) => { setUsuario(u); setStep('escalar'); }} />;

  const filledCount = Object.keys(lineup).length;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-40 font-sans">
      <header className="sticky top-0 z-[100] bg-[#F5C400] p-4 flex justify-between items-center shadow-2xl">
        <img src={LOGO} className="w-8 drop-shadow-md" />
        <span className="text-black font-[1000] text-xs tracking-widest italic uppercase">Tigre FC • Arena Nitro</span>
        <div className="bg-black text-[#F5C400] px-3 py-1 rounded-full text-[10px] font-black">{filledCount}/11</div>
      </header>

      <div className="max-w-md mx-auto p-3">
        {/* Seletor de Formação */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {Object.keys(FORMATIONS).map(f => (
            <button key={f} onClick={() => { setFormation(f); setLineup({}); }} 
              className={`min-w-[80px] py-3 rounded-xl font-black text-xs transition-all ${formation === f ? 'bg-[#F5C400] text-black scale-105 shadow-lg' : 'bg-[#111] text-gray-500'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* CAMPO 3D COM TROCA DIRETAMENTE NO CAMPO */}
        <div className="relative w-full h-[580px] bg-[#0d2b0d] rounded-[40px] border-4 border-[#1a1a1a] overflow-hidden shadow-inner" style={{ perspective: '1500px' }}>
          <div className="absolute inset-0 w-full h-[140%] -top-[20%]" 
               style={{ 
                 transform: 'rotateX(35deg)', transformOrigin: 'bottom center',
                 background: 'repeating-linear-gradient(0deg, #1a3d1a, #1a3d1a 45px, #224d22 45px, #224d22 90px)',
                 boxShadow: 'inset 0 0 150px rgba(0,0,0,0.9)'
               }}>
            
            {/* Linhas de Marcação */}
            <div className="absolute inset-x-[5%] inset-y-0 border-2 border-white/10" />
            <div className="absolute top-1/2 w-full h-0.5 bg-white/10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white/10 rounded-full" />

            {/* Slots */}
            {FORMATIONS[formation as keyof typeof FORMATIONS].map(slot => {
              const p = lineup[slot.id];
              const isSource = sourceSlot === slot.id;
              
              return (
                <div key={slot.id} onClick={() => handleSlotClick(slot.id)}
                     className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300"
                     style={{ left: `${slot.x}%`, top: `${slot.y}%`, zIndex: isSource ? 100 : 50 }}>
                  
                  <div style={{ transform: 'rotateX(-35deg)' }} className="flex flex-col items-center">
                    {!p ? (
                      <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${activePlayer || sourceSlot ? 'border-[#F5C400] bg-[#F5C400]/20 animate-pulse' : 'border-dashed border-white/20 bg-black/40'}`}>
                        <span className="text-[9px] font-black opacity-30">{slot.label}</span>
                      </div>
                    ) : (
                      <div className={`relative transition-all duration-300 ${isSource ? 'scale-125 -translate-y-4 shadow-[0_20px_40px_rgba(245,196,0,0.6)]' : ''}`}>
                        <div className={`w-20 h-20 rounded-full border-2 bg-black overflow-hidden shadow-2xl transition-all ${isSource ? 'border-white brightness-125' : 'border-[#F5C400]'}`}>
                          <img src={p.foto} className="w-[200%] h-full object-cover" style={{ objectPosition: '0% center' }} />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#F5C400] text-black text-[8px] font-black px-3 py-1 rounded-lg italic shadow-lg">
                          {p.short.toUpperCase()}
                        </div>
                        {isSource && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[7px] font-black px-2 py-1 rounded animate-bounce shadow-xl">TROCAR?</div>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BANCO DE RESERVAS */}
        <div className="mt-8 bg-[#111] rounded-[30px] p-5 border border-white/5 shadow-2xl">
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
            {['TODOS', 'GOL', 'LAT', 'ZAG', 'MEI', 'ATA'].map(p => (
              <button key={p} onClick={() => setFilterPos(p)} 
                className={`px-5 py-2 rounded-xl text-[10px] font-black transition-all ${filterPos === p ? 'bg-[#F5C400] text-black' : 'bg-[#222] text-gray-500'}`}>
                {p}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-4">
            {PLAYERS.filter(p => filterPos === 'TODOS' || p.pos === filterPos).map(p => {
              const isSelected = Object.values(lineup).some((s: any) => s?.id === p.id);
              const isActive = activePlayer?.id === p.id;
              
              return (
                <div key={p.id} onClick={() => !isSelected && setActivePlayer(isActive ? null : p)}
                     className={`relative flex flex-col items-center transition-all duration-300 ${isSelected ? 'opacity-20 grayscale' : 'cursor-pointer'}`}>
                  
                  <div className={`w-full aspect-square rounded-[20px] overflow-hidden border-2 transition-all duration-500 ${isActive ? 'border-[#F5C400] scale-110 shadow-[0_0_20px_#F5C400] z-10' : 'border-white/5'}`}>
                    <img src={p.foto} className="w-[200%] h-full object-cover transition-all duration-700"
                         style={{ objectPosition: isActive ? '100% center' : '0% center' }} />
                  </div>
                  <span className={`text-[9px] font-black mt-2 text-center truncate w-full ${isActive ? 'text-[#F5C400]' : 'text-gray-400'}`}>
                    {p.short.toUpperCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-[200]">
        <button disabled={filledCount < 11}
          className={`w-full py-5 rounded-[22px] font-black text-sm tracking-[3px] shadow-2xl transition-all uppercase italic ${filledCount === 11 ? 'bg-[#F5C400] text-black shadow-[0_10px_40px_rgba(245,196,0,0.3)]' : 'bg-[#1a1a1a] text-gray-700'}`}>
          {filledCount < 11 ? `FALTAM ${11 - filledCount} JOGADORES` : 'CONFIRMAR TIME 🐯'}
        </button>
      </div>
    </main>
  );
}
