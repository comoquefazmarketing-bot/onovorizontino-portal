'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  players = [], 
  isEscalado, 
  onSelect 
}: MarketListProps) {
  
  const [filter, setFilter] = useState<string>('TODOS');
  const positions = ['TODOS', 'GOL', 'ZAG', 'LD', 'LE', 'VOL', 'MC', 'ATA'];

  const filteredPlayers = filter === 'TODOS' 
    ? players 
    : players.filter(p => p.pos === filter);

  return (
    <div className="w-80 bg-[#0a0a0a] border-r border-white/10 flex flex-col h-full shrink-0 shadow-2xl">
      {/* HEADER DO MERCADO - UX MELHORADO */}
      <div className="p-5 border-b border-white/5 bg-black/40">
        <h2 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter mb-4 flex items-center gap-2">
          <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
          Mercado
        </h2>
        
        {/* FILTROS COM DESIGN PREMIUM */}
        <div className="flex flex-wrap gap-1.5">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-3 py-1.5 text-[10px] font-black rounded-md transition-all duration-300 ${
                filter === pos 
                  ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                  : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE JOGADORES - UI RECUPERADA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-[#0f0f0f]">
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
                className={`group relative flex items-center p-3 rounded-xl border transition-all duration-300 ${
                  escalado 
                    ? 'bg-zinc-900/50 border-white/5 opacity-40 grayscale pointer-events-none' 
                    : 'bg-zinc-900 border-white/10 hover:border-yellow-500/50 hover:bg-zinc-800 cursor-pointer shadow-lg'
                }`}
              >
                {/* FOTO COM OVERLAY E FALLBACK */}
                <div className="relative w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src={player.foto} 
                    alt={player.name} 
                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/JORDI.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* INFO DO ATLETA */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[9px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded uppercase">
                      {player.pos}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600">#{player.num}</span>
                  </div>
                  <p className="text-sm font-black text-zinc-100 uppercase truncate tracking-tight">
                    {player.short}
                  </p>
                </div>

                {/* INDICADOR DE STATUS */}
                <div className="ml-2">
                  {escalado ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
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
