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
    cor: "#22C55E",
    posicao: "Meio-campo"
  },
  {
    nome: "Juninho",
    rating: 7.3,
    role: "HERÓI",
    foto: "JUNINHO.jpg.webp",
    cor: "#F5C400",
    posicao: "Atacante"
  }
];

export default function DestaquesFifa() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      {/* SofaScore Compact */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-black tracking-[2px] text-emerald-400">SOFASCORE LIVE</span>
          </div>
          <span className="text-[10px] text-zinc-500">Rodada 11 • Novorizontino</span>
        </div>
        
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/90 shadow-xl h-[420px] md:h-[520px]">
          <iframe
            src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526098&widgetTheme=dark"
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>

      {/* FIFA 26 Style Cards - Capitão & Herói */}
      <div className="text-center mb-8">
        <h3 className="text-4xl font-black tracking-tighter">THE BEST TIGRE FC</h3>
        <p className="text-zinc-500 mt-1">Destaques da Partida • SofaScore</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {topPlayers.map((player, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative group"
          >
            {/* Neon Glow Background */}
            <div className="absolute -inset-6 bg-gradient-to-br from-transparent via-white/5 to-transparent blur-3xl opacity-40 group-hover:opacity-70 transition-all"
                 style={{ backgroundColor: player.cor + '15' }} />

            <div className="relative bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden h-[380px] flex flex-col">
              {/* Rating Top */}
              <div className="absolute top-5 right-5 z-30">
                <div className="bg-black px-4 py-2 rounded-2xl text-center border border-white/20">
                  <div className="text-5xl font-black text-white leading-none">{player.rating}</div>
                  <div className="text-[10px] text-white/50 -mt-1">RATING</div>
                </div>
              </div>

              {/* Player Photo */}
              <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                <img
                  src={`${STORAGE}${player.foto}`}
                  alt={player.nome}
                  className="h-72 object-contain drop-shadow-2xl transition-all group-hover:scale-110 duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `${STORAGE}Escudo%20Novorizontino.png`;
                  }}
                />
                {/* Light Reflection Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>

              {/* Bottom Card Info */}
              <div className="p-6 bg-black/80 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black tracking-tight text-white">{player.nome}</p>
                    <p className="text-xs text-zinc-400">{player.posicao}</p>
                  </div>
                  <div 
                    className="px-5 py-2 text-xs font-black uppercase rounded-full tracking-widest"
                    style={{ backgroundColor: player.cor + '20', color: player.cor }}
                  >
                    {player.role}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
