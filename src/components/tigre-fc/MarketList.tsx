'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Assets (Seguindo exatamente o seu padrão v5) ────────────────
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
  // Mantendo as props para não quebrar o componente pai
  onDragStart?: (player: Player) => void;
  onDragEnd?: () => void;
}

export default function MarketList({ players = [], isEscalado, onSelect }: MarketListProps) {
  const [filter, setFilter] = useState<string>('TODOS');
  // Usando as siglas que batem com o seu banco de dados
  const positions = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];

  const filteredPlayers = filter === 'TODOS' 
    ? players 
    : players.filter(p => p.pos === filter);

  return (
    <div className="w-80 bg-black border-r border-white/10 flex flex-col h-full shrink-0 shadow-2xl">
      {/* HEADER DO MERCADO */}
      <div className="p-5 border-b border-white/5 bg-zinc-950">
        <h2 className="text-2xl font-black italic text-yellow-500 uppercase tracking-tighter mb-4 flex items-center gap-2">
          MERCADO
        </h2>
        
        {/* FILTROS DE POSIÇÃO */}
        <div className="flex flex-wrap gap-1.5">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter(pos)}
              className={`px-3 py-1.5 text-[10px] font-black rounded-md transition-all tracking-widest ${
                filter === pos 
                  ? 'bg-yellow-500 text-black shadow-lg' 
                  : 'bg-zinc-900 text-zinc-500 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE JOGADORES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#050505] custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredPlayers.map((player) => {
            const escalado = isEscalado(player.id);
            
            // LÓGICA DE FOTO: Se a string já tiver BASE, usa ela. Se não, concatena.
            const fotoUrl = player.foto.startsWith('http') ? player.foto : `${BASE}${player.foto}`;

            return (
              <motion.div
                key={player.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => !escalado && onSelect(player)}
                className={`group relative flex items-center p-2.5 rounded-xl border transition-all duration-300 ${
                  escalado 
                    ? 'bg-zinc-900/30 border-white/5 opacity-40 grayscale pointer-events-none' 
                    : 'bg-zinc-900/60 border-white/10 hover:border-yellow-500/50 hover:bg-zinc-800 cursor-pointer'
                }`}
              >
                {/* CONTAINER DA FOTO - Redondo ou Quadrado conforme seu novo estilo */}
                <div className="relative w-12 h-12 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src={fotoUrl} 
                    alt={player.short} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ objectPosition: '50% 15%' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
                      (e.target as HTMLImageElement).style.opacity = '0.5';
                    }}
                  />
                </div>

                {/* INFO DO ATLETA */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[8px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
                      {player.pos}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-500">#{player.num}</span>
                  </div>
                  <p className="text-sm font-black text-zinc-100 uppercase truncate tracking-tight">
                    {player.short}
                  </p>
                </div>

                {/* INDICADOR DE STATUS */}
                <div className="ml-2">
                  {escalado ? (
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center border border-black/20">
                      <span className="text-black text-[10px] font-bold">✓</span>
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
