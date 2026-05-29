'use client';
import React from 'react';

const STORAGE_PLAYERS = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/';

const destaques = [
  {
    nome: "Matheus Bianqui",
    rating: 7.6,
    role: "MELHOR EM CAMPO",
    foto: "BIANQUI.png",           // ajuste o nome do arquivo se necessário
    cor: "#22C55E"
  },
  {
    nome: "Juninho",
    rating: 7.3,
    role: "DESTAQUE",
    foto: "JUNINHO.png",
    cor: "#F5C400"
  },
  {
    nome: "Ronald Barcellos",
    rating: 6.9,
    role: "DESTAQUE",
    foto: "RONALD.png",
    cor: "#00F3FF"
  },
];

export default function DestaquesFifa() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* SofaScore Embed */}
      <div>
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-black tracking-[3px] text-emerald-400">SOFASCORE LIVE</span>
        </div>

        <div className="rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl">
          <iframe
            id="sofa-lineups-embed-15526098"
            src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526098&widgetTheme=dark"
            className="w-full h-[680px] md:h-[786px]"
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>

      {/* Top Performers */}
      <div>
        <h3 className="text-3xl font-black text-center mb-8 tracking-tighter">
          MELHORES EM CAMPO
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destaques.map((player, i) => (
            <div key={i} className="relative bg-zinc-900 rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all group">
              <div className="h-48 flex items-center justify-center bg-black relative">
                <img
                  src={`${STORAGE_PLAYERS}${player.foto}`}
                  alt={player.nome}
                  className="h-44 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `${STORAGE_PLAYERS}Escudo%20Novorizontino.png`;
                  }}
                />
              </div>

              <div className="p-6 text-center">
                <div className="text-5xl font-black text-white mb-1">{player.rating}</div>
                <div className="text-sm text-zinc-400 mb-3">SOFASCORE</div>
                
                <p className="font-bold text-xl text-white">{player.nome}</p>
                <p className="text-xs uppercase tracking-widest mt-1" style={{ color: player.cor }}>
                  {player.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
