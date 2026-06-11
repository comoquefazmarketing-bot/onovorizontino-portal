'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Assets ────────────────────────────────────────────────
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
}

interface MarketListProps {
  players: Player[]; // Recebe do componente pai, mas temos o fallback abaixo
  isEscalado: (id: number) => boolean;
  onSelect: (player: Player) => void;
  onDragStart?: (player: Player) => void;
  onDragEnd?: () => void;
}

// ── Array de Jogadores "No Braço" (Conforme seu Storage) ──
const PLAYERS_DATA: Player[] = [
  // GOLEIROS
  { id: 23, name: "Jordi", short: "JORDI", num: 93, pos: "GOL", foto: "JORDI.png" },
  { id: 1, name: "César Augusto", short: "CÉSAR", num: 31, pos: "GOL", foto: "CESAR-AUGUSTO.jpg.webp" },
  
  // DEFENSORES
  { id: 36, name: "Mayk", short: "MAYK", num: 2, pos: "LAT", foto: "MAYK.jpg.webp" },
  { id: 35, name: "Maykon Jesus", short: "MAYKON", num: 16, pos: "LAT", foto: "MAYKON-JESUS.jpg.webp" },
  { id: 9, name: "Sander", short: "SANDER", num: 5, pos: "LAT", foto: "SANDER%20(1).jpg" },
  { id: 8, name: "Patrick", short: "PATRICK", num: 4, pos: "ZAG", foto: "PATRICK.jpg.webp" },
  { id: 38, name: "Renato Palm", short: "R. PALM", num: 33, pos: "ZAG", foto: "RENATO-PALM.jpg.webp" },
  
  // VOLANTES E MEIAS
  { id: 41, name: "Luís Oyama", short: "OYAMA", num: 6, pos: "VOL", foto: "LUIS-OYAMA.jpg.webp" },
  { id: 42, name: "Luiz Gabriel", short: "L. GABRIEL", num: 15, pos: "VOL", foto: "LUIZ-GABRIEL.jpg.webp" },
  { id: 12, name: "Marlon", short: "MARLON", num: 50, pos: "VOL", foto: "MARLON.jpg.webp" },
  { id: 47, name: "Matheus Bianqui", short: "BIANQUI", num: 17, pos: "MEI", foto: "MATHEUS-BIANQUI.jpg.webp" },
  { id: 43, name: "Nogueira", short: "NOGUEIRA", num: 21, pos: "VOL", foto: "NOGUEIRA.jpg.webp" },
  { id: 10, name: "Rômulo", short: "RÔMULO", num: 10, pos: "MEI", foto: "ROMULO.jpg.webp" },
  { id: 17, name: "Tavinho", short: "TAVINHO", num: 15, pos: "MEI", foto: "TAVINHO.jpg.webp" },

  // ATACANTES
  { id: 55, name: "Nicolas Careca", short: "CARECA", num: 30, pos: "ATA", foto: "NICOLAS-CARECA.jpg.webp" },
  { id: 15, name: "Robson", short: "ROBSON", num: 11, pos: "ATA", foto: "ROBSON.jpg.webp" },
  { id: 57, name: "Ronald Barcellos", short: "RONALD", num: 7, pos: "ATA", foto: "RONALD-BARCELLOS.jpg.webp" },
  { id: 86, name: "Titi Ortiz", short: "ORTÍZ", num: 8, pos: "ATA", foto: "TITI-ORTIZ.jpg.webp" },
  { id: 59, name: "Vinícius Paiva", short: "V. PAIVA", num: 16, pos: "ATA", foto: "VINICIUS-PAIVA.jpg.webp" }
];

export default function MarketList({ 
  players = PLAYERS_DATA, // Usa o array fixo se não vier por props
  isEscalado, 
  onSelect,
  onDragStart,
  onDragEnd 
}: MarketListProps) {
  
  const [filter, setFilter] = useState<string>('TODOS');
  const positions = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];

  const getFotoUrl = (player: Player) => {
    if (!player.foto) return '';
    // Como estamos fazendo no braço, player.foto já é o nome exato do arquivo
    return `${BASE}${player.foto}`;
  };

  const filteredPlayers = filter === 'TODOS' 
    ? players 
    : players.filter(p => p.pos === filter);

  return (
    <div className="w-80 bg-black border-r border-white/10 flex flex-col h-full shrink-0 shadow-2xl z-10">
      <div className="p-5 border-b border-white/5 bg-zinc-950">
        <h2 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter mb-4">
          MERCADO
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-3 py-1.5 text-[10px] font-black rounded-md transition-all ${
                filter === pos 
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' 
                  : 'bg-zinc-800 text-zinc-500 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#050505] custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredPlayers.map((player) => {
            const escalado = isEscalado(player.id);
            
            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => !escalado && onSelect(player)}
                className={`group relative flex items-center p-2 rounded-xl border transition-all duration-300 ${
                  escalado 
                    ? 'bg-zinc-900/30 border-white/5 opacity-40 grayscale pointer-events-none' 
                    : 'bg-zinc-900/60 border-white/10 hover:border-yellow-500/50 hover:bg-zinc-800 cursor-pointer'
                }`}
              >
                {/* CONTAINER DA FOTO - ALINHAMENTO 80% À ESQUERDA */}
                <div className="relative w-14 h-14 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src={getFotoUrl(player)} 
                    alt={player.short} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ objectPosition: '20% center' }} // Foca no rosto (lado esquerdo da imagem)
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
                      target.style.opacity = '0.3';
                      target.style.padding = '8px';
                      target.style.objectFit = 'contain';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>

                {/* INFORMAÇÕES */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[8px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {player.pos}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600">#{player.num}</span>
                  </div>
                  <p className="text-sm font-black text-zinc-100 uppercase truncate tracking-tight">
                    {player.short}
                  </p>
                </div>

                {/* BOTÃO STATUS */}
                <div className="ml-2">
                  {escalado ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                      <span className="text-green-500 text-[10px]">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-yellow-500 flex items-center justify-center transition-all">
                      <span className="text-white/20 group-hover:text-black text-lg font-bold">+</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
