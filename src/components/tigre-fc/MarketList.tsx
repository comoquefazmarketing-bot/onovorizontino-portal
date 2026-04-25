'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  players: Player[];
  isEscalado: (id: number) => boolean;
  onSelect: (player: Player) => void;
  onDragStart?: (player: Player) => void; // Adicionado para o Build da Vercel
  onDragEnd?: () => void;                 // Adicionado para o Build da Vercel
}

export default function MarketList({ 
  players = [], 
  isEscalado, 
  onSelect,
  onDragStart,
  onDragEnd 
}: MarketListProps) {
  
  const [filter, setFilter] = useState<string>('TODOS');
  const positions = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];

  const getFotoUrl = (player: Player) => {
    // Se no banco já estiver o nome completo (ex: MARLON.jpg.webp), usamos ele
    if (player.foto && player.foto.includes('.')) {
      return `${BASE}${player.foto.replace(/\s/g, '%20')}`;
    }
    // Se não, tentamos o padrão: NOME-CURTO.jpg.webp
    const fileName = player.short.toUpperCase().replace(/\s/g, '-');
    return `${BASE}${fileName}.jpg.webp`;
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
                <div className="relative w-14 h-14 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src={getFotoUrl(player)} 
                    alt={player.short} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ objectPosition: '20% center' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Se falhou o .jpg.webp, tenta o .png (caso do Sander)
                      if (target.src.includes('.jpg.webp')) {
                        target.src = target.src.replace('.jpg.webp', '.png');
                      } else {
                        target.src = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
                        target.style.opacity = '0.3';
                        target.style.padding = '8px';
                        target.style.objectFit = 'contain';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[8px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded uppercase">
                      {player.pos}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-600">#{player.num}</span>
                  </div>
                  <p className="text-sm font-black text-zinc-100 uppercase truncate">
                    {player.short}
                  </p>
                </div>
                <div className="pr-2 text-white/20 font-bold">{escalado ? '✓' : '+'}</div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
