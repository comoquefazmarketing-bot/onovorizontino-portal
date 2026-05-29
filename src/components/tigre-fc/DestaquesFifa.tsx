'use client';
import React from 'react';
import { motion } from 'framer-motion';

const STORAGE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const topPlayers = [
  {
    nome: "Matheus Bianqui",
    rating: 7.6,
    role: "MELHOR EM CAMPO",
    foto: "MATHEUS-BIANQUI.jpg.webp",
    cor: "#22C55E"
  },
  {
    nome: "Juninho",
    rating: 7.3,
    role: "HERÓI DA PARTIDA",
    foto: "JUNINHO.jpg.webp",
    cor: "#F5C400"
  }
];

export default function DestaquesFifa() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN - SofaScore Compact */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-black tracking-[3px] text-emerald-400">SOFASCORE LIVE</span>
            </div>
            
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/90 shadow-2xl h-[520px] md:h-[620px]">
              <iframe
                src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526098&widgetTheme=dark"
                className="w-full h-full"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Game Style Cards (85% focus) */}
        <div className="lg:col-span-7">
          <div className="text-center mb-8">
            <h3 className="text-4xl font-black tracking-[-1px]">THE BEST TIGRE FC</h3>
            <p className="text-zinc-500 text-sm mt-1">DESTAQUES DA RODADA • SOFASCORE</p>
          </div>

          <div className="space-y-8">
            {topPlayers.map((player, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="relative group"
              >
                {/* Neon Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl opacity-30 group-hover:opacity-60 transition-all"
                     style={{ backgroundColor: player.cor + '15' }} />

                <div className="relative bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden flex h-[260px]">
                  
                  {/* Player Image Area */}
                  <div className="w-5/12 bg-black relative flex items-center justify-center overflow-hidden">
                    <img
                      src={`${STORAGE}${player.foto}`}
                      alt={player.nome}
                      className="h-64 object-contain drop-shadow-2xl transition-transform group-hover:scale-110 duration-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `${STORAGE}Escudo%20Novorizontino.png`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                  </div>

                  {/* Info Area */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <div className="text-6xl font-black text-white tracking-tighter mb-1">
                        {player.rating}
                      </div>
                      <div className="text-xs text-white/50 font-bold">SOFASCORE RATING</div>
                    </div>

                    <div>
                      <p className="text-3xl font-black text-white tracking-tight">{player.nome}</p>
                      <p className="text-sm text-zinc-400 mt-1">{player.role}</p>
                    </div>

                    <div 
                      className="inline-block px-6 py-2 text-xs font-black uppercase tracking-widest rounded-full self-start"
                      style={{ backgroundColor: player.cor + '20', color: player.cor }}
                    >
                      DESTAQUE DA RODADA
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
