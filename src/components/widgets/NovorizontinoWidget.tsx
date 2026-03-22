'use client';
import { useState } from 'react';

export default function NovorizontinoWidget() {
  const [activeTab, setActiveTab] = useState('google');

  const sources = {
    ge: "https://ge.globo.com/sp/tem-esporte/futebol/times/novorizontino/agenda-de-jogos-do-novorizontino/#/proximos-jogos",
    espn: "https://www.espn.com.br/futebol/time/resultados/_/id/18127/novorizontino",
    google: "https://www.google.com/search?igu=1&q=novorizontino+agenda+de+jogos"
  };

  return (
    <section id="agenda" className="w-full bg-[#0a0a0a] rounded-t-3xl border-t border-x border-yellow-500/20 mt-12 overflow-hidden shadow-2xl scroll-mt-24">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row items-center justify-between p-5 bg-[#111] border-b border-yellow-500/10 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-black"></span>
            <span className="w-3 h-3 bg-black rounded-full border-2 border-yellow-500"></span>
          </div>
          <h2 className="text-yellow-500 font-black italic uppercase text-xl tracking-tight">
            Central de Jogos <span className="text-white opacity-50 ml-2">Tempo Real</span>
          </h2>
        </div>

        {/* Seleção de Fonte */}
        <div className="flex bg-black rounded-xl p-1.5 border border-white/5">
          <button 
            onClick={() => setActiveTab('google')}
            className={activeTab === 'google' ? "px-6 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "px-6 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white"}
          >
            GOOGLE
          </button>
          <button 
            onClick={() => setActiveTab('ge')}
            className={activeTab === 'ge' ? "px-6 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "px-6 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white"}
          >
            GE
          </button>
          <button 
            onClick={() => setActiveTab('espn')}
            className={activeTab === 'espn' ? "px-6 py-1.5 rounded-lg text-xs font-bold bg-yellow-500 text-black shadow-lg shadow-yellow-500/20" : "px-6 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-white"}
          >
            ESPN
          </button>
        </div>
      </div>
      
      {/* Iframe */}
      <div className="relative w-full h-[650px] bg-black">
        <iframe 
          src={sources[activeTab]} 
          className="w-full h-full border-none"
          title="Resultados Novorizontino"
          loading="lazy"
        ></iframe>
      </div>

      <div className="p-3 bg-yellow-500 text-center">
        <p className="text-[10px] text-black font-black uppercase tracking-widest">Felipe Makarios - Central de Dados 2026</p>
      </div>
    </section>
  );
}