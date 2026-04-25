'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Assets (Seguindo o padrão v5 que você mandou) ────────────────
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
}

export default function MarketList({ players = [], isEscalado, onSelect }: MarketListProps) {
  const [filter, setFilter] = useState<string>('TODOS');
  const positions = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];

  const filteredPlayers = filter === 'TODOS' 
    ? players 
    : players.filter(p => p.pos === filter);

  return (
    <div className="w-80 bg-black border-r border-white/10 flex flex-col h-full shrink-0 shadow-2xl z-10">
      {/* HEADER */}
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
                  ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
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
            
            // Lógica de URL: Garante que concatena com a BASE se não for URL completa
            const fotoUrl = player.foto.startsWith('http') ? player.foto : `${BASE}${player.foto}`;

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
                {/* FOTO COM ALINHAMENTO A 80% À ESQUERDA */}
                <div className="relative w-14 h-14 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src={fotoUrl} 
                    alt={player.short} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    style={{ 
                      // O pulo do gato: alinha o recorte da foto para focar no jogador à esquerda
                      objectPosition: '20% center' 
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // Tenta o .webp se falhar (padrão do seu v5)
                      if (!target.src.endsWith('.webp') && !target.src.includes('.webp')) {
                        target.src = target.src + '.jpg.webp';
                      } else {
                        // Se tudo der errado, mostra o escudo com baixa opacidade
                        target.src = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
                        target.style.opacity = '0.3';
                        target.style.objectFit = 'contain';
                        target.style.padding = '8px';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                </div>

                {/* INFO */}
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

                {/* STATUS */}
                <div className="ml-2">
                  {escalado ? (
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/40">
                      <span className="text-green-500 text-[10px]">✓</span>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-white/5 group-hover:bg-yellow-500 flex items-center justify-center transition-all shadow-sm">
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
