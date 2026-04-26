'use client'; // Necessário para Next.js 16+

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, MessageCircle, Instagram, Twitter, RotateCcw, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';

// --- DEFINIÇÃO DE TIPOS (Resolve o erro do build) ---
interface EscalacaoFormacaoProps {
  jogoId?: string | number;
}

// --- CONFIGURAÇÕES E ASSETS ---
const SUPABASE_STORAGE_URL = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal";
const STADIUM_BG = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop";

const PLAYERS_DATA = [
  { id: 1, name: 'Jordi', photo: 'JORDI.jpg.webp', position: 'Goleiro' },
  { id: 2, name: 'Alexis Alvariño', photo: 'IVAN-ALVARINO.jpg.webp', position: 'Zagueiro' }, 
  { id: 3, name: 'Carlão', photo: 'CARLAO.jpg.webp', position: 'Zagueiro' },
  { id: 4, name: 'Dantas', photo: 'DANTAS.jpg.webp', position: 'Zagueiro' },
  { id: 5, name: 'Héctor Biachi', photo: 'HECTOR-BIACHI.jpg.webp', position: 'Lateral' },
  { id: 6, name: 'Leo Naldi', photo: 'LEO-NALDI.jpg.webp', position: 'Volante' },
  { id: 7, name: 'Titi Ortiz', photo: 'TITI-ORTIZ.jpg.webp', position: 'Meia' },
  { id: 8, name: 'Hélio Borges', photo: 'HELIO-BORGES.jpg.webp', position: 'Atacante' },
];

// Adicionado { jogoId } como prop para bater com o que a page.tsx envia
const EscalacaoFormacao: React.FC<EscalacaoFormacaoProps> = ({ jogoId }) => {
  const [step, setStep] = useState<'selecao' | 'campo' | 'final'>('selecao');
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
  const [finalImageUri, setFinalImageUri] = useState<string | null>(null);
  const campoRef = useRef<HTMLDivElement>(null);

  const gerarSnapshot = async () => {
    if (campoRef.current === null) return;
    try {
      const dataUrl = await toPng(campoRef.current, { 
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#0a0a0a'
      });
      setFinalImageUri(dataUrl);
      setStep('final');
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
    }
  };

  const downloadImagem = () => {
    if (!finalImageUri) return;
    const link = document.createElement('a');
    link.download = `meu-tigre-escalado-${jogoId || 'novo'}.png`;
    link.href = finalImageUri;
    link.click();
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent("Duvido você montar um time melhor que o meu! 🐯 Escalei o Tigrão no Arena Tigre FC. Veja minha escalação!");
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const PlayerIcon = ({ player, isInteractive = false }: { player: any, isInteractive?: boolean }) => (
    <motion.div
      drag={isInteractive}
      dragConstraints={campoRef}
      dragElastic={0.1}
      whileHover={{ scale: 1.1 }}
      whileDrag={{ scale: 1.2, zIndex: 100 }}
      style={{ position: isInteractive ? 'absolute' : 'relative' }}
      className="flex flex-col items-center cursor-grab active:cursor-grabbing"
    >
      <div className="w-16 h-16 rounded-full border-2 border-yellow-500 overflow-hidden bg-black shadow-lg">
        <img 
          src={`${SUPABASE_STORAGE_URL}/${player.photo}`} 
          alt={player.name}
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/150")}
        />
      </div>
      <div className="mt-1 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-sm uppercase italic">
        {player.name}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden p-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-yellow-500">ARENA TIGRE FC</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest italic">By Felipe Makarios</p>
        </div>
        {step === 'campo' && (
          <button onClick={gerarSnapshot} className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-full flex items-center gap-2 font-bold transition-all shadow-lg shadow-green-900/40">
            <Camera size={18} /> FINALIZAR
          </button>
        )}
      </header>

      <AnimatePresence mode="wait">
        {step === 'selecao' && (
          <motion.div key="selecao" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">
            {PLAYERS_DATA.map(player => (
              <button 
                key={player.id}
                onClick={() => setSelectedPlayers(prev => prev.find(p => p.id === player.id) ? prev.filter(p => p.id !== player.id) : [...prev, player])}
                className={`p-4 rounded-3xl border-2 transition-all ${selectedPlayers.find(p => p.id === player.id) ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-white/5'}`}
              >
                <img src={`${SUPABASE_STORAGE_URL}/${player.photo}`} className="w-20 h-20 mx-auto rounded-full mb-2 object-cover" alt={player.name} />
                <p className="font-bold text-sm uppercase italic">{player.name}</p>
              </button>
            ))}
            {selectedPlayers.length > 0 && (
              <button onClick={() => setStep('campo')} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-12 py-4 rounded-full font-black text-xl shadow-2xl z-50">
                IR PARA O CAMPO
              </button>
            )}
          </motion.div>
        )}

        {step === 'campo' && (
          <motion.div 
            key="campo"
            ref={campoRef}
            className="relative w-full aspect-[9/14] rounded-[40px] overflow-hidden border-4 border-white/20 bg-cover bg-center shadow-2xl"
            style={{ backgroundImage: `url(${STADIUM_BG})` }}
          >
            <div className="absolute inset-0 bg-green-950/60 backdrop-blur-[1px]" />
            <div className="absolute top-10 left-0 right-0 text-center z-10 pointer-events-none">
                <h2 className="text-3xl font-black italic text-white/10 uppercase tracking-tighter">ESCUDO TIGRE</h2>
                <p className="text-white/30 font-bold uppercase tracking-[4px] text-[10px]">Técnico: Enderson Moreira</p>
            </div>

            <div className="absolute inset-0 p-10">
              {selectedPlayers.map((player, idx) => (
                <motion.div
                  key={`${player.id}-${idx}`}
                  drag
                  dragConstraints={campoRef}
                  dragElastic={0.1}
                  className="absolute cursor-grab active:cursor-grabbing flex flex-col items-center"
                  style={{ left: `${20 + (idx * 15)}%`, top: `${20 + (idx * 10)}%` }}
                >
                  <div className="w-16 h-16 rounded-full border-2 border-yellow-500 overflow-hidden bg-black shadow-xl">
                    <img src={`${SUPABASE_STORAGE_URL}/${player.photo}`} className="w-full h-full object-cover" alt={player.name} />
                  </div>
                  <span className="mt-1 bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 rounded-sm uppercase italic shadow-lg">
                    {player.name}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none opacity-40">
              <p className="text-[8px] text-white font-bold tracking-widest uppercase">Arena Tigre FC • Felipe Makarios</p>
            </div>
          </motion.div>
        )}

        {step === 'final' && finalImageUri && (
          <motion.div key="final" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <div className="bg-white/5 p-4 rounded-[40px] border border-white/10 mb-8 w-full max-w-sm">
              <img src={finalImageUri} className="w-full rounded-[30px] shadow-2xl mb-6" alt="Seu Time" />
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button onClick={downloadImagem} className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors uppercase text-xs">
                  <Download size={18} /> Salvar
                </button>
                <button onClick={shareWhatsApp} className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-2xl hover:bg-green-500 transition-colors uppercase text-xs">
                  <MessageCircle size={18} /> WhatsApp
                </button>
              </div>
              <div className="flex justify-center gap-4 py-4 border-t border-white/10">
                <Instagram className="text-gray-500 hover:text-pink-500 cursor-pointer" />
                <Twitter className="text-gray-500 hover:text-blue-400 cursor-pointer" />
                <Share2 className="text-gray-500 hover:text-white cursor-pointer" />
              </div>
            </div>
            <button onClick={() => setStep('selecao')} className="flex items-center gap-2 text-gray-500 font-bold uppercase text-[10px] tracking-widest hover:text-yellow-500">
              <RotateCcw size={14} /> Refazer Escalação
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EscalacaoFormacao;
