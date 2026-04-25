'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Definindo a interface localmente para eliminar a dependência externa que quebra o build
interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
}

interface MarketListProps {
  players: Player[];
  isEscalado: (id: number) => boolean;
  onSelect: (player: Player) => void;
  onDragStart: (player: Player) => void;
  onDragEnd: () => void;
}

export default function MarketList({ 
  players = [], // Default para array vazio caso venha undefined
  isEscalado, 
  onSelect, 
  onDragStart, 
  onDragEnd 
}: MarketListProps) {
  
  const [filter, setFilter] = useState<string>('TODOS');
  
  // Lista de posições baseada no seu banco de dados
  const positions = ['TODOS', 'GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MC', 'ATA'];

  // Filtra os jogadores garantindo que a lista exista
  const filteredPlayers = filter === 'TODOS' 
    ? players 
    : players.filter(p => p.pos === filter);

  return (
    <div className="w-80 bg-zinc-900 border-r border-white/10 flex flex-col h-full shrink-0">
      {/* HEADER DO MERCADO */}
      <div className="p-4 border-b border-white/5 bg-black/20">
        <h2 className="text-xl font-black italic text-yellow-500 uppercase tracking-tighter mb-4">
          Mercado
        </h2>
        
        {/* FILTROS DE POSIÇÃO */}
        <div className="flex flex-wrap gap-1">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-2 py-1 text-[10px] font-bold rounded transition-all ${
                filter === pos 
                  ? 'bg-yellow-500 text-black' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE JOGADORES */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar bg-zinc-900/50">
        <AnimatePresence mode="popLayout">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => {
              const escalado = isEscalado(player.id);
              
              return (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => !escalado && onSelect(player)}
                  className={`group relative flex items-center p-2 rounded-xl border transition-all ${
                    escalado 
                      ? 'bg-zinc-800/50 border-white/5 opacity-50 grayscale cursor-not-allowed' 
                      : 'bg-zinc-800 border-white/10 hover:border-yellow-500/50 hover:bg-zinc-700 cursor-pointer'
                  }`}
                >
                  {/* FOTO COM FALLBACK */}
                  <div className="relative w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/5 shrink-0">
                    <img 
                      src={player.foto} 
                      alt={player.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/JORDI.png';
                      }}
                    />
                  </div>

                  {/* INFO */}
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black bg-yellow-500 text-black px-1.5 rounded shrink-0">
                        {player.pos}
                      </span>
                      <span className="text-[10px] font-bold text-white/40">#{player.num}</span>
                    </div>
                    <p className="text-sm font-black text-white uppercase truncate">
                      {player.short}
                    </p>
                  </div>

                  {/* STATUS */}
                  <div className="ml-2 shrink-0">
                    {escalado ? (
                      <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-white/5 group-hover:bg-yellow-500/20 flex items-center justify-center">
                        <span className="text-white/20 group-hover:text-yellow-500 text-lg font-bold">+</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="p-4 text-center text-white/20 text-xs italic uppercase">
              Nenhum jogador encontrado
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
