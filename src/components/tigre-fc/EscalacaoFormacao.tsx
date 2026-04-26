'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketList from './MarketList';
import * as htmlToImage from 'html-to-image';

const BASE_STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO_NOVO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_AVAI = 'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png'; // Troque pelo link real do Supabase quando tiver
const STADIUM_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

interface Player { id: number; name: string; short: string; num: number; pos: string; foto: string; }

type SlotMap = Record<string, { player: Player | null; x: number; y: number }>;

const PLAYERS_DATA: Player[] = [
  // ... Use o array corrigido da versão anterior (com .jpg.webp e IVAN-ALVARINO.jpg.webp etc.)
  { id: 23, name: "Jordi Martins", short: "JORDI", num: 93, pos: "GOL", foto: "JORDI.jpg.webp" },
  // ... (todos os outros jogadores corrigidos)
];

const formationConfigs: Record<string, any> = { /* mantenha os configs da versão anterior */ };

export default function EscalacaoFormacao() {
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

  const fieldRef = useRef<HTMLDivElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);

  const jogoInfo = {
    mandante: "Avaí",
    visitante: "Novorizontino",
    mandanteEscudo: ESCUDO_AVAI,
    visitanteEscudo: ESCUDO_NOVO,
    data: "03/05/2026 - 18h (Horário de Brasília)",
  };

  const getValidPhotoUrl = (fotoPath: string) => {
    if (!fotoPath) return ESCUDO_NOVO;
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

  const handleSelectCaptain = (id: number) => { setCaptainId(id); setStep('hero'); };
  const handleSelectHero = (id: number) => { setHeroId(id); setStep('palpite'); };

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
    } catch (e) {
      alert("Erro ao gerar a imagem épica. Tente novamente!");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!finalImageUri) return;
    const a = document.createElement('a');
    a.download = `minha-escalacao-tigre-fc-${formation}.png`;
    a.href = finalImageUri;
    a.click();
  };

  const shareWhatsApp = () => {
    downloadImage();
    const text = `🐯 DUVIDO VOCÊ ESCALAR MELHOR QUE ISSO!\n\nMinha escalação ${formation} pro jogo AVAÍ x NOVORIZONTINO!\nPalpite: ${palpiteMandante} × ${palpiteVisitante}\nCapitão: ${selectedPlayers.find(p => p.id === captainId)?.short} ⚔️\nHerói: ${selectedPlayers.find(p => p.id === heroId)?.short} 🔥\n\nVem montar a sua e desafiar os amigos no Arena Tigre FC!\nhttps://www.onovorizontino.com.br/tigre-fc/escalar/11`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareInstagram = () => { downloadImage(); alert("📸 Imagem salva! Poste nos Stories com o sticker de Link apontando pro Arena Tigre FC. Vamos viralizar! 🐯"); };
  const shareX = () => {
    const text = `🐯 Minha escalação FC-style pro Avaí x Novorizontino (${formation}) — Palpite ${palpiteMandante}x${palpiteVisitante} 🔥\nDuvido você fazer melhor! Arena Tigre FC`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">
      <AnimatePresence mode="wait">

        {/* Tela Formação + Arena com Drag & Drop - mantenha da versão anterior (com whileDrag, glow amarelo etc.) */}

        {/* === TELA CAPITÃO (Neon Dourado - estilo FC26) === */}
        {step === 'captain' && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">
            <div className="text-center mb-10">
              <div className="inline-block px-6 py-2 bg-yellow-500/10 border border-yellow-400 rounded-full text-yellow-400 text-sm font-black tracking-widest mb-3">CAPITÃO</div>
              <h1 className="text-4xl font-black italic text-yellow-400 tracking-tighter">ESCOLHA O LÍDER DO TIGRE</h1>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {selectedPlayers.map(p => (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectCaptain(p.id)}
                  className={`relative p-3 rounded-3xl border-4 transition-all overflow-hidden ${captainId === p.id ? 'border-yellow-400 shadow-[0_0_40px_#facc15] scale-110' : 'border-white/20 hover:border-white/40'}`}
                >
                  <div className="relative">
                    <img src={getValidPhotoUrl(p.foto)} className="w-28 h-36 object-cover rounded-2xl" alt={p.short} />
                    {captainId === p.id && (
                      <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-2xl shadow-[0_0_20px_#facc15]">C</div>
                    )}
                  </div>
                  <p className="text-center mt-3 font-bold text-lg">{p.short}</p>
                </motion.button>
              ))}
            </div>
            <p className="mt-12 text-yellow-400/70 text-sm">O Capitão ganha braçadeira dourada na imagem final!</p>
          </motion.div>
        )}

        {/* === TELA HERÓI (Neon Ciano) === */}
        {step === 'hero' && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-950 to-black">
            <div className="text-center mb-10">
              <div className="inline-block px-6 py-2 bg-cyan-400/10 border border-cyan-400 rounded-full text-cyan-400 text-sm font-black tracking-widest mb-3">HERÓI DA PARTIDA</div>
              <h1 className="text-4xl font-black italic text-cyan-400 tracking-tighter">QUEM VAI BRILHAR?</h1>
            </div>
            {/* Mesma estrutura do Capitão, só troca cores para cyan-400 */}
            {/* ... (copie e adapte o grid do capitão trocando yellow por cyan) ... */}
          </motion.div>
        )}

        {/* === TELA PALPITE === */}
        {step === 'palpite' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 bg-zinc-950">
            <h1 className="text-3xl font-black mb-2">SEU PALPITE</h1>
            <p className="text-zinc-400 mb-10 text-center">Avaí × Novorizontino • Série B 2026 • Rodada 7</p>

            <div className="flex items-center gap-12 text-7xl font-black">
              <div className="flex flex-col items-center">
                <img src={jogoInfo.mandanteEscudo} className="w-24 h-24 mb-3" />
                <div>{jogoInfo.mandante}</div>
              </div>

              <div className="flex items-center gap-8">
                <input 
                  type="number" 
                  min="0" 
                  value={palpiteMandante} 
                  onChange={e => setPalpiteMandante(Math.max(0, parseInt(e.target.value)||0))} 
                  className="w-24 bg-zinc-900 text-center rounded-2xl border border-yellow-500/50 focus:border-yellow-400 outline-none"
                />
                <span className="text-5xl text-yellow-400">×</span>
                <input 
                  type="number" 
                  min="0" 
                  value={palpiteVisitante} 
                  onChange={e => setPalpiteVisitante(Math.max(0, parseInt(e.target.value)||0))} 
                  className="w-24 bg-zinc-900 text-center rounded-2xl border border-yellow-500/50 focus:border-yellow-400 outline-none"
                />
              </div>

              <div className="flex flex-col items-center">
                <img src={jogoInfo.visitanteEscudo} className="w-24 h-24 mb-3" />
                <div>{jogoInfo.visitante}</div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateFinalImage}
              disabled={isGenerating}
              className="mt-16 px-16 py-6 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-2xl rounded-3xl shadow-[0_0_40px_#fbbf24] hover:shadow-[0_0_60px_#fbbf24] transition-all"
            >
              {isGenerating ? "GERANDO ARTE ÉPICA..." : "GERAR MINHA ARTE FC26"}
            </motion.button>
          </motion.div>
        )}

        {/* === TELA FINAL - CARD VERTICAL ESTILO FC26 === */}
        {step === 'final' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 bg-black overflow-auto">
            <div ref={finalCardRef} className="w-full max-w-[380px] bg-zinc-950 rounded-3xl overflow-hidden border-4 border-yellow-400/30 shadow-2xl relative" style={{ aspectRatio: '9/16' }}>
              {/* Fundo do estádio */}
              <img src={STADIUM_BG} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />

              {/* Overlay escuro */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />

              {/* Jogadores posicionados (simplificado) */}
              <div className="absolute inset-0" ref={fieldRef}>
                {Object.entries(slotMap).map(([id, state]) => state.player && (
                  <motion.div
                    key={id}
                    style={{ left: `${state.x}%`, top: `${state.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)' }}
                    className="w-14 h-20 md:w-16 md:h-24 rounded-xl overflow-hidden border-2 border-white/60 shadow-xl"
                  >
                    <img src={getValidPhotoUrl(state.player.foto)} className="w-full h-full object-cover" />
                    {(state.player.id === captainId || state.player.id === heroId) && (
                      <div className={`absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg ${state.player.id === captainId ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'}`}>
                        {state.player.id === captainId ? 'C' : 'H'}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Cabeçalho */}
              <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                <div>
                  <div className="text-yellow-400 text-xs font-black tracking-[3px]">ARENA TIGRE FC</div>
                  <div className="text-3xl font-black italic tracking-tighter">MINHA ESCALAÇÃO</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{formation}</div>
                  <div className="text-xs text-zinc-400">{jogoInfo.data}</div>
                </div>
              </div>

              {/* Placar do palpite */}
              <div className="absolute top-28 left-1/2 -translate-x-1/2 bg-black/80 px-8 py-2 rounded-2xl border border-yellow-400/50 text-center">
                <div className="text-5xl font-black text-yellow-400">{palpiteMandante} × {palpiteVisitante}</div>
                <div className="text-xs text-zinc-400 -mt-1">SEU PALPITE</div>
              </div>

              {/* CTA grande (estilo FC26) */}
              <div className="absolute bottom-28 left-6 right-6 text-center">
                <div className="text-3xl font-black italic text-white tracking-tighter leading-none drop-shadow-2xl">
                  DUVIDO VOCÊ<br />ESCALAR MELHOR QUE ISSO!
                </div>
                <div className="text-yellow-400 text-2xl mt-2">🐯</div>
              </div>

              {/* Rodapé */}
              <div className="absolute bottom-6 left-6 right-6 text-center text-xs text-zinc-500">
                Capitão: {selectedPlayers.find(p => p.id === captainId)?.short} • Herói: {selectedPlayers.find(p => p.id === heroId)?.short}<br />
                Técnico: Enderson Moreira • Criado por Felipe Makarios • Arena Tigre FC
              </div>
            </div>

            {/* Botões de ação */}
            <div className="mt-8 w-full max-w-[380px] grid grid-cols-2 gap-4 px-4">
              <button onClick={downloadImage} className="py-5 bg-yellow-400 hover:bg-yellow-300 text-black font-black rounded-2xl text-lg">💾 SALVAR IMAGEM</button>
              <button onClick={shareWhatsApp} className="py-5 bg-[#25D366] font-black rounded-2xl text-lg">📲 WHATSAPP</button>
            </div>
            <div className="mt-4 w-full max-w-[380px] grid grid-cols-2 gap-4 px-4">
              <button onClick={shareInstagram} className="py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 font-black rounded-2xl text-lg">📸 INSTAGRAM</button>
              <button onClick={shareX} className="py-5 bg-black border border-white/30 font-black rounded-2xl text-lg">𝕏</button>
            </div>

            <button onClick={() => window.location.reload()} className="mt-10 text-zinc-500 hover:text-white text-sm">REINICIAR ESCALAÇÃO</button>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
