'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';

const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO_DEFAULT = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

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
  { id: 66, name: "Alexis Alvariño", short: "ALVARÍÑO", num: 22, pos: "ZAG", foto: "IVAN-ALVARINO.jpg.webp" },
  { id: 6, name: "Carlinhos", short: "CARLINHOS", num: 3, pos: "ZAG", foto: "CARLINHOS.jpg.webp" },
  { id: 3, name: "Dantas", short: "DANTAS", num: 25, pos: "ZAG", foto: "DANTAS.jpg.webp" },
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LAT", foto: "SANDER (1).jpg" },
  { id: 28, name: "Maykon Jesus", short: "MAYKON", num: 66, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 27, name: "Nilson Castrillón", short: "NILSON", num: 20, pos: "LAT", foto: "NILSON-CASTRILLON.jpg.webp" },
  { id: 75, name: "Jhilmar Lora", short: "LORA", num: 24, pos: "LAT", foto: "LORA.jpg.webp" },
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 46, name: "Marlon", short: "MARLON", num: 28, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 40, name: "Léo Naldi", short: "NALDI", num: 18, pos: "VOL", foto: "LEO-NALDI.jpg.webp" },
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 12, name: "Juninho", short: "JUNINHO", num: 50, pos: "MEI", foto: "JUNINHO.jpg.webp" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },
  { id: 86, name: "Christian Ortíz", short: "TITI ORTÍZ", num: 8, pos: "MEI", foto: "TITI-ORTIZ.jpg.webp" },
  { id: 13, name: "Diego Galo", short: "D. GALO", num: 19, pos: "MEI", foto: "DIEGO-GALO.jpg.webp" },
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 50, name: "Carlão", short: "CARLÃO", num: 9, pos: "ATA", foto: "CARLAO.jpg.webp" },
  { id: 52, name: "Hélio Borges", short: "HÉLIO", num: 41, pos: "ATA", foto: "HELIO-BORGES.jpg.webp" },
  { id: 53, name: "Jardiel", short: "JARDIEL", num: 40, pos: "ATA", foto: "JARDIEL.jpg.webp" },
  { id: 91, name: "Hector Bianchi", short: "HECTOR", num: 35, pos: "ATA", foto: "HECTOR-BIANCHI.jpg.webp" },
];

const formationConfigs: Record<string, any> = {
  '4-3-3': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'm1':{x:50,y:48}, 'm2':{x:30,y:42}, 'm3':{x:70,y:42}, 'st':{x:50,y:15}, 'lw':{x:22,y:22}, 'rw':{x:78,y:22} },
  '4-4-2': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'm1':{x:35,y:45}, 'm2':{x:65,y:45}, 'm3':{x:15,y:38}, 'm4':{x:85,y:38}, 'st1':{x:40,y:18}, 'st2':{x:60,y:18} },
  '3-5-2': { 'gk':{x:50,y:85}, 'cb1':{x:30,y:70}, 'cb2':{x:50,y:73}, 'cb3':{x:70,y:70}, 'lm':{x:15,y:45}, 'rm':{x:85,y:45}, 'm1':{x:35,y:50}, 'm2':{x:65,y:50}, 'am':{x:50,y:32}, 'st1':{x:40,y:15}, 'st2':{x:60,y:15} },
  '4-5-1': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'm1':{x:30,y:48}, 'm2':{x:50,y:48}, 'm3':{x:70,y:48}, 'am1':{x:35,y:30}, 'am2':{x:65,y:30}, 'st':{x:50,y:15} },
  '4-2-3-1': { 'gk':{x:50,y:85}, 'lb':{x:15,y:62}, 'cb1':{x:38,y:70}, 'cb2':{x:62,y:70}, 'rb':{x:85,y:62}, 'v1':{x:40,y:52}, 'v2':{x:60,y:52}, 'am':{x:50,y:35}, 'lw':{x:20,y:28}, 'rw':{x:80,y:28}, 'st':{x:50,y:12} },
  '5-3-2': { 'gk':{x:50,y:85}, 'lb':{x:12,y:52}, 'cb1':{x:30,y:70}, 'cb2':{x:50,y:73}, 'cb3':{x:70,y:70}, 'rb':{x:88,y:52}, 'm1':{x:50,y:48}, 'm2':{x:30,y:40}, 'm3':{x:70,y:40}, 'st1':{x:42,y:18}, 'st2':{x:58,y:18} }
};

export default function EscalacaoFormacao({ jogoId }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<'formation' | 'arena' | 'captain' | 'hero' | 'palpite' | 'final'>('formation');
  const [formation, setFormation] = useState('4-3-3');
  const [slotMap, setSlotMap] = useState<SlotMap>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer] = useState<Player | null>(null);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [palpiteMandante, setPalpiteMandante] = useState(1);
  const [palpiteVisitante, setPalpiteVisitante] = useState(2);
  const [finalImageUri, setFinalImageUri] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const finalCardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const crowdCheerUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  const getValidPhotoUrl = (fotoPath: string) => {
    if (!fotoPath) return ESCUDO_DEFAULT;
    const filename = fotoPath.split('/').pop() || fotoPath;
    return `${BASE_STORAGE}${encodeURIComponent(filename)}`;
  };

  // Inicializa slots da formação
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

  const selectedPlayers = Object.values(slotMap).map(s => s.player).filter((p): p is Player => p !== null);

  const handleSelectCaptain = (id: number) => {
    setCaptainId(id);
    setStep('hero');
  };

  const handleSelectHero = (id: number) => {
    setHeroId(id);
    setStep('palpite');
  };

  const triggerCelebration = () => {
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    confetti({ particleCount: 180, angle: 60, spread: 80, origin: { x: 0.1 } });
    confetti({ particleCount: 180, angle: 120, spread: 80, origin: { x: 0.9 } });

    if (!audioRef.current) {
      audioRef.current = new Audio(crowdCheerUrl);
    }
    audioRef.current.volume = 0.65;
    audioRef.current.play().catch(() => {});
  };

  const generateFinalImage = async () => {
    if (!finalCardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(finalCardRef.current, {
        cacheBust: true,
        quality: 0.98,
        pixelRatio: 3,
        backgroundColor: '#0a0a0a',
      });
      setFinalImageUri(dataUrl);
      setStep('final');
      triggerCelebration();
    } catch (e) {
      alert("Erro ao gerar a imagem épica. Tente novamente!");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!finalImageUri) return;
    const a = document.createElement('a');
    a.download = `escalacao-tigre-fc-${formation}.png`;
    a.href = finalImageUri;
    a.click();
  };

  const shareWhatsApp = () => {
    downloadImage();
    const text = `🐯 DUVIDO VOCÊ ESCALAR MELHOR QUE ISSO!\n\nMinha escalação ${formation} pro Avaí x Novorizontino!\nPalpite: ${palpiteMandante} × ${palpiteVisitante}\nCapitão: ${selectedPlayers.find(p => p.id === captainId)?.short} ⚔️\nHerói: ${selectedPlayers.find(p => p.id === heroId)?.short} 🔥\n\nVem montar a sua no Arena Tigre FC!\nhttps://www.onovorizontino.com.br/tigre-fc/escalar/${jogoId || 12}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareInstagram = () => {
    downloadImage();
    alert("📸 Imagem salva! Poste nos Stories com sticker de Link. Vamos viralizar o Tigrão! 🐯🔥");
  };

  const shareX = () => {
    const text = `🐯 Minha escalação pro Avaí x Novorizontino (${formation}) — Palpite ${palpiteMandante}x${palpiteVisitante} 🔥\nDuvido você fazer melhor! Arena Tigre FC`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">

        {/* TELA DE FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950"
          >
            <h1 className="text-4xl font-black italic mb-12 text-yellow-500 uppercase tracking-tighter text-center">
              ESCOLHA A TÁTICA
            </h1>
            <div className="grid grid-cols-2 gap-6 w-full max-w-md">
              {Object.keys(formationConfigs).map(f => (
                <button 
                  key={f} 
                  onClick={() => { setFormation(f); setStep('arena'); }}
                  className="py-8 bg-zinc-900 border-2 border-white/10 rounded-3xl active:scale-95 transition-all font-black text-2xl italic hover:border-yellow-500 hover:bg-zinc-800"
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* TELA ARENA - COM LISTA SIMPLIFICADA DE JOGADORES */}
        {step === 'arena' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col md:flex-row relative overflow-hidden h-full">
            {/* Mercado Simplificado */}
            <div className="h-[35%] md:h-full md:w-80 z-[110] bg-black/80 backdrop-blur-xl border-b md:border-r border-white/10 overflow-auto p-4">
              <h3 className="text-yellow-400 font-black text-lg mb-4">ELENCO DO TIGRE</h3>
              <div className="grid grid-cols-3 gap-3">
                {PLAYERS_DATA.map(player => (
                  <motion.button
                    key={player.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePlayerSelection(player)}
                    className="bg-zinc-900 border border-white/20 rounded-xl p-2 hover:border-yellow-500 transition-all"
                  >
                    <img 
                      src={getValidPhotoUrl(player.foto)} 
                      className="w-full aspect-square object-cover rounded-lg" 
                      onError={(e) => (e.currentTarget.src = ESCUDO_DEFAULT)}
                    />
                    <p className="text-[10px] text-center mt-1 font-bold text-white truncate">{player.short}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Campo com Drag & Drop */}
            <div className="flex-1 relative bg-zinc-900 overflow-hidden" ref={finalCardRef}>
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-75" alt="Estádio" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

              <div className="relative w-full h-full">
                {Object.entries(slotMap).map(([id, state]) => (
                  <motion.div 
                    key={id}
                    drag
                    dragMomentum={false}
                    dragElastic={0.1}
                    dragConstraints={finalCardRef}
                    whileDrag={{ scale: 1.3, zIndex: 200 }}
                    onClick={() => handleSlotClick(id)}
                    style={{ left: `${state.x}%`, top: `${state.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
                    className={`w-16 h-24 md:w-20 md:h-32 border-2 rounded-2xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing transition-all shadow-2xl ${
                      activeSlot === id ? 'border-yellow-400 bg-yellow-500/20 scale-110 shadow-[0_0_30px_#facc15]' : 'border-white/30 bg-black/70'
                    }`}
                  >
                    {state.player ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={getValidPhotoUrl(state.player.foto)} 
                          className="w-full h-full object-cover" 
                          onError={(e) => (e.currentTarget.src = ESCUDO_DEFAULT)}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black py-1.5">
                          <span className="text-[10px] font-black text-white block text-center">{state.player.short}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center opacity-40">
                        <span className="text-3xl">+</span>
                        <div className="text-[10px] uppercase mt-1">{id.toUpperCase()}</div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 z-50 px-6">
                <button onClick={() => setStep('formation')} className="flex-1 max-w-[140px] py-4 bg-zinc-900 border border-white/30 rounded-2xl text-sm font-black">← TÁTICA</button>
                <button onClick={() => setStep('captain')} className="flex-1 max-w-[200px] py-4 bg-yellow-500 text-black font-black rounded-2xl text-sm">ESCOLHER CAPITÃO →</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* As outras telas (Capitão, Herói, Palpite, Final) permanecem iguais à versão anterior */}

        {/* TELA CAPITÃO */}
        {step === 'captain' && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">
            <div className="text-center mb-10">
              <div className="inline-block px-8 py-2 bg-yellow-500/10 border border-yellow-400 rounded-full text-yellow-400 text-sm font-black tracking-widest mb-4">CAPITÃO</div>
              <h1 className="text-4xl font-black italic text-yellow-400 tracking-tighter">ESCOLHA O LÍDER DO TIGRE</h1>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {selectedPlayers.map(p => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectCaptain(p.id)}
                  className={`relative p-4 rounded-3xl border-4 transition-all overflow-hidden ${captainId === p.id ? 'border-yellow-400 shadow-[0_0_50px_#facc15] scale-110' : 'border-white/20 hover:border-white/40'}`}
                >
                  <img src={getValidPhotoUrl(p.foto)} className="w-28 h-36 object-cover rounded-2xl" alt={p.short} />
                  {captainId === p.id && <div className="absolute -top-3 -right-3 w-11 h-11 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-3xl shadow-[0_0_25px_#facc15]">C</div>}
                  <p className="text-center mt-4 font-bold text-lg tracking-wide">{p.short}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* TELA HERÓI */}
        {step === 'hero' && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">
            <div className="text-center mb-10">
              <div className="inline-block px-8 py-2 bg-cyan-400/10 border border-cyan-400 rounded-full text-cyan-400 text-sm font-black tracking-widest mb-4">HERÓI DA PARTIDA</div>
              <h1 className="text-4xl font-black italic text-cyan-400 tracking-tighter">QUEM VAI DECIDIR O JOGO?</h1>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {selectedPlayers.map(p => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectHero(p.id)}
                  className={`relative p-4 rounded-3xl border-4 transition-all overflow-hidden ${heroId === p.id ? 'border-cyan-400 shadow-[0_0_50px_#22d3ee] scale-110' : 'border-white/20 hover:border-white/40'}`}
                >
                  <img src={getValidPhotoUrl(p.foto)} className="w-28 h-36 object-cover rounded-2xl" alt={p.short} />
                  {heroId === p.id && <div className="absolute -top-3 -right-3 w-11 h-11 bg-cyan-400 rounded-full flex items-center justify-center font-black text-black text-3xl shadow-[0_0_25px_#22d3ee]">H</div>}
                  <p className="text-center mt-4 font-bold text-lg tracking-wide">{p.short}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* TELA PALPITE */}
        {step === 'palpite' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950">
            <h1 className="text-4xl font-black mb-3">SEU PALPITE</h1>
            <p className="text-zinc-400 mb-12">Avaí × Novorizontino • Série B 2026</p>

            <div className="flex items-center gap-10 text-7xl font-black">
              <div className="flex flex-col items-center">
                <img src="https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png" className="w-24 h-24 mb-4" alt="Avaí" />
                <div>Avaí</div>
              </div>
              <div className="flex gap-8 items-center">
                <input 
                  type="number" 
                  min="0" 
                  value={palpiteMandante} 
                  onChange={e => setPalpiteMandante(Math.max(0, parseInt(e.target.value) || 0))} 
                  className="w-24 bg-zinc-900 text-center rounded-2xl border-2 border-yellow-500 focus:border-yellow-400 text-6xl" 
                />
                <span className="text-6xl text-yellow-400">×</span>
                <input 
                  type="number" 
                  min="0" 
                  value={palpiteVisitante} 
                  onChange={e => setPalpiteVisitante(Math.max(0, parseInt(e.target.value) || 0))} 
                  className="w-24 bg-zinc-900 text-center rounded-2xl border-2 border-yellow-500 focus:border-yellow-400 text-6xl" 
                />
              </div>
              <div className="flex flex-col items-center">
                <img src={ESCUDO_DEFAULT} className="w-24 h-24 mb-4" alt="Novorizontino" />
                <div>Novorizontino</div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateFinalImage}
              disabled={isGenerating}
              className="mt-16 px-20 py-7 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-2xl rounded-3xl shadow-[0_0_50px_#fbbf24]"
            >
              {isGenerating ? "GERANDO ARTE ÉPICA..." : "GERAR MINHA ARTE FC26"}
            </motion.button>
          </motion.div>
        )}

        {/* TELA FINAL */}
        {step === 'final' && finalImageUri && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black overflow-auto">
            <div ref={finalCardRef} className="w-full max-w-[380px] bg-zinc-950 rounded-3xl overflow-hidden border-4 border-yellow-400/30 shadow-2xl relative" style={{ aspectRatio: '9/16' }}>
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

              <div className="absolute inset-0 pointer-events-none">
                {Object.entries(slotMap).map(([id, state]) => state.player && (
                  <motion.div
                    key={id}
                    style={{ left: `${state.x}%`, top: `${state.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
                    className="w-16 h-24 rounded-2xl overflow-hidden border-2 border-white/70 shadow-2xl"
                  >
                    <img src={getValidPhotoUrl(state.player.foto)} className="w-full h-full object-cover" />
                    {(state.player.id === captainId || state.player.id === heroId) && (
                      <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shadow-xl ${state.player.id === captainId ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'}`}>
                        {state.player.id === captainId ? 'C' : 'H'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="absolute top-6 left-6 right-6 flex justify-between text-sm">
                <div>
                  <div className="text-yellow-400 tracking-[3px] font-black text-xs">ARENA TIGRE FC</div>
                  <div className="text-3xl font-black italic">MINHA ESCALAÇÃO</div>
                </div>
                <div className="text-right">
                  {formation}<br />
                  <span className="text-xs text-zinc-400">03/05/2026</span>
                </div>
              </div>

              <div className="absolute top-[140px] left-1/2 -translate-x-1/2 bg-black/90 px-10 py-4 rounded-3xl border border-yellow-400/50 text-center">
                <div className="text-6xl font-black text-yellow-400">{palpiteMandante} × {palpiteVisitante}</div>
                <div className="text-sm text-zinc-400">SEU PALPITE</div>
              </div>

              <div className="absolute bottom-28 left-6 right-6 text-center">
                <div className="text-4xl font-black italic text-white leading-none drop-shadow-2xl">
                  DUVIDO VOCÊ<br />ESCALAR MELHOR QUE ISSO!
                </div>
                <div className="text-5xl mt-4">🐯</div>
              </div>

              <div className="absolute bottom-8 left-6 right-6 text-center text-xs text-zinc-500">
                Capitão: {selectedPlayers.find(p => p.id === captainId)?.short} • 
                Herói: {selectedPlayers.find(p => p.id === heroId)?.short}<br />
                Técnico: Enderson Moreira • Arena Tigre FC
              </div>
            </div>

            <div className="mt-10 w-full max-w-[380px] space-y-4 px-4">
              <button onClick={downloadImage} className="w-full py-6 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-3xl text-lg active:scale-[0.98]">💾 SALVAR IMAGEM</button>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={shareWhatsApp} className="py-6 bg-[#25D366] font-black rounded-3xl active:scale-[0.98]">WhatsApp</button>
                <button onClick={shareInstagram} className="py-6 bg-gradient-to-r from-pink-500 to-purple-600 font-black rounded-3xl active:scale-[0.98]">Instagram</button>
                <button onClick={shareX} className="py-6 bg-black border border-white/40 font-black rounded-3xl active:scale-[0.98]">𝕏</button>
              </div>
            </div>

            <button onClick={() => window.location.reload()} className="mt-8 text-zinc-500 hover:text-white text-sm">REINICIAR ESCALAÇÃO</button>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
