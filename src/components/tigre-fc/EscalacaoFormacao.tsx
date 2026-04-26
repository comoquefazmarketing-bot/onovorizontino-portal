'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketList from './MarketList';
import * as htmlToImage from 'html-to-image';

const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
}

type SlotMap = Record<string, { player: Player | null; x: number; y: number }>;

interface EscalacaoFormacaoProps {
  jogoId?: number | string;
}

const PLAYERS_DATA: Player[] = [
  { id: 23, name: "Jordi Martins", short: "JORDI", num: 93, pos: "GOL", foto: "JORDI.jpg.webp" },
  { id: 1, name: "César", short: "CÉSAR", num: 31, pos: "GOL", foto: "CESAR-AUGUSTO.jpg.webp" },
  { id: 22, name: "João Scapin", short: "SCAPIN", num: 12, pos: "GOL", foto: "JOAO-SCAPIN.jpg.webp" },
  { id: 62, name: "Lucas Ribeiro", short: "LUCAS", num: 1, pos: "GOL", foto: "LUCAS-RIBEIRO.jpg.webp" },
  { id: 8, name: "Patrick", short: "PATRICK", num: 4, pos: "ZAG", foto: "PATRICK.jpg.webp" },
  { id: 38, name: "Renato Palm", short: "R. PALM", num: 33, pos: "ZAG", foto: "RENATO-PALM.jpg.webp" },
  { id: 34, name: "Eduardo Brock", short: "BROCK", num: 14, pos: "ZAG", foto: "EDUARDO-BROCK.jpg.webp" },
  { id: 66, name: "Alexis Alvariño", short: "ALVARÍÑO", num: 22, pos: "ZAG", foto: "IVAN-ALVARINO.jpg.webp" }, // Corrigido
  { id: 6, name: "Carlinhos", short: "CARLINHOS", num: 3, pos: "ZAG", foto: "CARLINHOS.jpg.webp" },
  { id: 3, name: "Dantas", short: "DANTAS", num: 25, pos: "ZAG", foto: "DANTAS.jpg.webp" },
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LAT", foto: "SANDER (1).jpg" },
  { id: 28, name: "Maykon Jesus", short: "MAYKON", num: 66, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 27, name: "Nilson Castrillón", short: "NILSON", num: 20, pos: "LAT", foto: "NILSON-CASTRILLON.jpg.webp" },
  { id: 75, name: "Jhilmar Lora", short: "LORA", num: 24, pos: "LAT", foto: "LORA.jpg.webp" },
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 46, name: "Marlon", short: "MARLON", num: 28, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 40, name: "Léo Naldi", short: "NALDI", num: 18, pos: "VOL", foto: "LEO-NALDI.jpg.webp" }, // Corrigido
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 12, name: "Juninho", short: "JUNINHO", num: 50, pos: "MEI", foto: "JUNINHO.jpg.webp" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },
  { id: 86, name: "Christian Ortíz", short: "TITI ORTÍZ", num: 8, pos: "MEI", foto: "TITI-ORTIZ.jpg.webp" }, // Corrigido
  { id: 13, name: "Diego Galo", short: "D. GALO", num: 19, pos: "MEI", foto: "DIEGO-GALO.jpg.webp" },
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 50, name: "Carlão", short: "CARLÃO", num: 9, pos: "ATA", foto: "CARLAO.jpg.webp" }, // Corrigido
  { id: 52, name: "Hélio Borges", short: "HÉLIO", num: 41, pos: "ATA", foto: "HELIO-BORGES.jpg.webp" }, // Corrigido
  { id: 53, name: "Jardiel", short: "JARDIEL", num: 40, pos: "ATA", foto: "JARDIEL.jpg.webp" },
  { id: 91, name: "Hector Bianchi", short: "HECTOR", num: 35, pos: "ATA", foto: "HECTOR-BIANCHI.jpg.webp" }, // Corrigido
];

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'final'>('formation');
  const [formation, setFormation] = useState('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [finalImageUri, setFinalImageUri] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const fieldRef = useRef<HTMLDivElement>(null);

  const getValidPhotoUrl = (fotoPath: string) => {
    if (!fotoPath) return ESCUDO;
    const filename = fotoPath.split('/').pop() || fotoPath;
    return `${BASE_STORAGE}${encodeURIComponent(filename)}`;
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
    Object.entries(coords).forEach(([id, c]: any) => {
      initial[id] = { player: null, ...c };
    });
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

  // Função principal de captura da escalação
  const captureEscalacao = async () => {
    if (!fieldRef.current) return;

    setIsGeneratingImage(true);

    try {
      const dataUrl = await htmlToImage.toPng(fieldRef.current, {
        cacheBust: true,
        quality: 0.95,
        backgroundColor: '#0a0a0a',
        pixelRatio: 2,
      });

      setFinalImageUri(dataUrl);
      setStep('final');
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar a imagem da escalação. Tente novamente.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const downloadImage = () => {
    if (!finalImageUri) return;
    
    const link = document.createElement('a');
    link.download = `escalacao-arena-tigre-fc-${formation}.png`;
    link.href = finalImageUri;
    link.click();
  };

  const shareToWhatsApp = () => {
    if (!finalImageUri) return;
    
    const text = `🐯 Duvido você montar um time melhor que o meu! Escalei o Tigrão no Arena Tigre FC (${formation})`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToInstagram = () => {
    alert('📸 Copie a imagem e compartilhe no Instagram Stories ou Feed!\n\nDica: Use o sticker "Link" para direcionar para o Arena Tigre FC.');
    downloadImage();
  };

  const shareToX = () => {
    const text = `🐯 Acabei de escalar meu time no Arena Tigre FC! ${formation} 🔥\nDuvido você fazer melhor!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const filledCount = Object.values(slotMap).filter(s => s.player).length;

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden select-none flex flex-col touch-none">
      <AnimatePresence mode="wait">
        
        {/* TELA DE ESCOLHA DE FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div 
            key="f" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950"
          >
            <h1 className="text-3xl font-black italic mb-10 text-yellow-500 uppercase tracking-tighter text-center">
              Escolha a Tática
            </h1>
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {Object.keys(formationConfigs).map(f => (
                <button 
                  key={f} 
                  onClick={() => { setFormation(f); setStep('arena'); }}
                  className="py-6 bg-zinc-900 border-2 border-white/5 rounded-2xl active:scale-95 transition-all font-black text-2xl italic hover:border-yellow-500 hover:bg-zinc-800"
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* TELA PRINCIPAL - ARENA COM DRAG & DROP */}
        {step === 'arena' && (
          <motion.div 
            key="a" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col md:flex-row relative overflow-hidden h-full"
          >
            {/* Mercado de Jogadores */}
            <div className="h-[30%] md:h-full md:w-80 z-[110] bg-black/60 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/10">
              <MarketList 
                players={PLAYERS_DATA} 
                isEscalado={(id) => Object.values(slotMap).some(s => s.player?.id === id)} 
                onSelect={handlePlayerSelection}
              />
            </div>

            {/* Campo com Estádio - Referência para captura */}
            <div className="flex-1 relative bg-zinc-900 overflow-hidden" ref={fieldRef}>
              <img 
                src={STADIUM_BG} 
                className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none scale-105" 
                alt="Estádio" 
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

              <div className="relative w-full h-full">
                {Object.entries(slotMap).map(([id, state]) => (
                  <motion.div 
                    key={id} 
                    drag
                    dragMomentum={false}
                    dragElastic={0.1}
                    dragConstraints={fieldRef}
                    whileDrag={{ scale: 1.25, zIndex: 200 }}
                    onClick={() => handleSlotClick(id)}
                    style={{ 
                      left: `${state.x}%`, 
                      top: `${state.y}%`, 
                      position: 'absolute', 
                      transform: 'translate(-50%, -50%)',
                      filter: 'drop-shadow(15px 15px 12px rgba(0,0,0,0.7))'
                    }}
                    className={`w-16 h-22 md:w-24 md:h-32 border-2 rounded-xl flex items-center justify-center overflow-hidden z-50 cursor-grab active:cursor-grabbing transition-all ${
                      activeSlot === id || pendingPlayer 
                        ? 'border-yellow-500 bg-yellow-500/30 scale-110 shadow-[0_0_40px_rgba(234,179,8,0.7)]' 
                        : 'border-white/30 bg-black/80'
                    }`}
                  >
                    {state.player ? (
                      <div className="relative w-full h-full pointer-events-none bg-zinc-800">
                        <img 
                          src={getValidPhotoUrl(state.player.foto)}
                          className="w-full h-full object-cover"
                          style={{ objectPosition: '95% center' }} 
                          onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            if (target.src !== ESCUDO) target.src = ESCUDO;
                          }}
                        />
                        <div className="absolute bottom-0 w-full bg-yellow-500 py-1 shadow-[0_-5px_15px_rgba(0,0,0,0.7)]">
                          <span className="text-[9px] md:text-[12px] font-black uppercase text-black leading-none block text-center tracking-tighter">
                            {state.player.short}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center opacity-20">
                        <span className="text-2xl font-thin">+</span>
                        <span className="text-[7px] font-bold uppercase">{id.toUpperCase()}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Overlay de instrução */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/70 text-yellow-400 text-xs px-4 py-1.5 rounded-full border border-yellow-500/30 backdrop-blur-md z-[130]">
                Arraste os jogadores para ajustar a posição
              </div>

              {/* Botões inferiores */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-[120] px-6">
                <button 
                  onClick={() => setStep('formation')} 
                  className="flex-1 max-w-[140px] py-4 bg-zinc-900/90 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md hover:bg-zinc-800"
                >
                  TÁTICA
                </button>
                <button 
                  onClick={captureEscalacao}
                  disabled={isGeneratingImage}
                  className="flex-1 max-w-[200px] py-4 bg-yellow-500 text-black rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl hover:brightness-110 disabled:opacity-70"
                >
                  {isGeneratingImage ? 'GERANDO IMAGEM...' : 'FINALIZAR ESCALAÇÃO'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TELA FINAL - COM IMAGEM GERADA */}
        {step === 'final' && finalImageUri && (
          <motion.div 
            key="final" 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 overflow-auto"
          >
            <div className="bg-zinc-900 w-full max-w-md p-8 rounded-[48px] border-2 border-yellow-500/20 shadow-2xl">
              <h2 className="text-3xl font-black italic text-white mb-6 uppercase tracking-tighter text-center">
                TIME <span className="text-yellow-500">ESCALADO</span>
              </h2>

              <div className="relative mb-8 rounded-3xl overflow-hidden border border-yellow-500/30">
                <img 
                  src={finalImageUri} 
                  alt="Escalação Arena Tigre FC" 
                  className="w-full rounded-3xl"
                />
                <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded text-[10px] font-bold text-yellow-400">
                  {formation} • {filledCount}/11
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={downloadImage}
                  className="w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl text-base uppercase shadow-xl transition-all active:scale-[0.98]"
                >
                  💾 SALVAR NA GALERIA
                </button>

                <div className="grid grid-cols-3 gap-3">
                  <button 
                    onClick={shareToWhatsApp}
                    className="py-4 bg-[#25D366] hover:brightness-110 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2"
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={shareToInstagram}
                    className="py-4 bg-gradient-to-r from-[#f56040] via-[#c13584] to-[#405de6] hover:brightness-110 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2"
                  >
                    Instagram
                  </button>
                  <button 
                    onClick={shareToX}
                    className="py-4 bg-black hover:bg-zinc-800 border border-white/30 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2"
                  >
                    𝕏
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-zinc-500 font-bold">Técnico: Enderson Moreira</p>
                <p className="text-[10px] text-zinc-600 mt-1">Criado por Felipe Makarios • Arena Tigre FC 🐯</p>
              </div>

              <button 
                onClick={() => window.location.reload()} 
                className="mt-8 w-full py-4 text-xs text-zinc-400 hover:text-white transition-colors"
              >
                REINICIAR ESCALAÇÃO
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
