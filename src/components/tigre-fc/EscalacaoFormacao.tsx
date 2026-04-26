import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Download, MessageCircle, Instagram, Twitter, ChevronRight, RotateCcw, Camera } from 'lucide-react';
import { toPng } from 'html-to-image';

// --- CONFIGURAÇÕES E ASSETS ---
const SUPABASE_STORAGE_URL = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal";
const STADIUM_BG = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop";

// Mapeamento corrigido conforme arquivos enviados
const PLAYERS_DATA = [
  { id: 1, name: 'Jordi', photo: 'JORDI.jpg.webp', position: 'Goleiro' },
  { id: 2, name: 'Alexis Alvariño', photo: 'IVAN-ALVARINO.jpg.webp', position: 'Zagueiro' }, // Correção Alexis -> Ivan
  { id: 3, name: 'Carlão', photo: 'CARLAO.jpg.webp', position: 'Zagueiro' },
  { id: 4, name: 'Dantas', photo: 'DANTAS.jpg.webp', position: 'Zagueiro' },
  { id: 5, name: 'Héctor Biachi', photo: 'HECTOR-BIACHI.jpg.webp', position: 'Lateral' },
  { id: 6, name: 'Leo Naldi', photo: 'LEO-NALDI.jpg.webp', position: 'Volante' },
  { id: 7, name: 'Titi Ortiz', photo: 'TITI-ORTIZ.jpg.webp', position: 'Meia' },
  { id: 8, name: 'Hélio Borges', photo: 'HELIO-BORGES.jpg.webp', position: 'Atacante' },
];

const EscalacaoFormacao = () => {
  const [step, setStep] = useState<'selecao' | 'campo' | 'final'>('selecao');
  const [selectedPlayers, setSelectedPlayers] = useState<any[]>([]);
  const [finalImageUri, setFinalImageUri] = useState<string | null>(null);
  const campoRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE CAPTURA DE IMAGEM (MARKETING) ---
  const gerarSnapshot = async () => {
    if (campoRef.current === null) return;
    
    try {
      // Pequeno delay para garantir que o DOM está pronto
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
    link.download = `meu-tigre-escalado.png`;
    link.href = finalImageUri;
    link.click();
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent("Duvido você montar um time melhor que o meu! 🐯 Escalei o Tigrão no Arena Tigre FC. Veja minha escalação!");
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // --- COMPONENTES DE UI ---
  const PlayerIcon = ({ player, isInteractive = false }: { player: any, isInteractive?: boolean }) => (
    <motion.div
      drag={isInteractive} // Habilita o movimento livre solicitado
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
      
      {/* HEADER DINÂMICO */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-yellow-500">ARENA TIGRE FC</h1>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">By Felipe Makarios</p>
        </div>
        {step === 'campo' && (
          <button onClick={gerarSnapshot} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-full flex items-center gap-2 font-bold transition-all shadow-lg shadow-green-900/20">
            <Camera size={18} /> FINALIZAR
          </button>
        )}
      </header>

      <AnPresence mode="wait">
        {/* STEP 1: SELEÇÃO DE JOGADORES */}
        {step === 'selecao' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">
            {PLAYERS_DATA.map(player => (
              <button 
                key={player.id}
                onClick={() => setSelectedPlayers(prev => [...prev, player])}
                className={`p-4 rounded-3xl border-2 transition-all ${selectedPlayers.find(p => p.id === player.id) ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-white/5'}`}
              >
                <img src={`${SUPABASE_STORAGE_URL}/${player.photo}`} className="w-20 h-20 mx-auto rounded-full mb-2 object-cover" />
                <p className="font-bold text-sm">{player.name}</p>
              </button>
            ))}
            {selectedPlayers.length > 0 && (
              <button onClick={() => setStep('campo')} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-12 py-4 rounded-full font-black text-xl shadow-2xl">
                IR PARA O CAMPO
              </button>
            )}
          </motion.div>
        )}

        {/* STEP 2: O CAMPO (QUADRO TÁTICO INTERATIVO) */}
        {step === 'campo' && (
          <motion.div 
            ref={campoRef}
            className="relative w-full aspect-[9/14] rounded-[40px] overflow-hidden border-4 border-white/20 bg-cover bg-center"
            style={{ backgroundImage: `url(${STADIUM_BG})` }}
          >
            <div className="absolute inset-0 bg-green-900/40 backdrop-blur-[2px]" />
            <div className="absolute inset-0 border-[2px] border-white/30 m-4 rounded-lg pointer-events-none" />
            
            {/* Logo e Branding na Imagem */}
            <div className="absolute top-10 left-0 right-0 text-center z-10 pointer-events-none">
              <h2 className="text-3xl font-black italic text-white/20">ESCUDO TIGRE</h2>
              <p className="text-white/40 font-bold uppercase tracking-[5px] text-xs">Técnico: Enderson Moreira</p>
            </div>

            {/* Jogadores com Drag & Drop Livre */}
            <div className="absolute inset-0 p-12">
              {selectedPlayers.map((player, idx) => (
                <PlayerIcon key={idx} player={player} isInteractive={true} />
              ))}
            </div>

            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
              <p className="text-[10px] text-white/30 font-bold">WWW.ONOVORIZONTINO.COM.BR • ARENA TIGRE FC</p>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CARD FINAL (MARKETING VIRAL) */}
        {step === 'final' && finalImageUri && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
            <div className="bg-white/5 p-4 rounded-[40px] border border-white/10 mb-8 w-full max-w-sm">
              <img src={finalImageUri} className="w-full rounded-[30px] shadow-2xl mb-6" alt="Seu Time" />
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-black italic mb-1 text-yellow-500 uppercase">Time de Elite Escalado!</h3>
                <p className="text-gray-400 text-sm">Agora desafie seus amigos para ver quem entende mais de tática.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <button onClick={downloadImagem} className="flex items-center justify-center gap-2 bg-white text-black font-bold py-3 rounded-2xl">
                  <Download size={18} /> SALVAR
                </button>
                <button onClick={shareWhatsApp} className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-3 rounded-2xl">
                  <MessageCircle size={18} /> WHATSAPP
                </button>
              </div>

              <div className="flex justify-center gap-4 py-4 border-t border-white/10">
                <Instagram className="text-gray-500 hover:text-pink-500 cursor-pointer" />
                <Twitter className="text-gray-500 hover:text-blue-400 cursor-pointer" />
                <Share2 className="text-gray-500 hover:text-white cursor-pointer" />
              </div>
            </div>

            <button onClick={() => setStep('selecao')} className="flex items-center gap-2 text-gray-500 font-bold uppercase text-xs tracking-widest hover:text-yellow-500 transition-colors">
              <RotateCcw size={14} /> Refazer Escalação
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EscalacaoFormacao;
