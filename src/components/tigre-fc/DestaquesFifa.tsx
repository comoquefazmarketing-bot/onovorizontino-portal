'use client';
import { useState } from 'react';

export default function DestaquesFifa({ capitao, heroi }: { capitao: any, heroi: any }) {
  const [modalAtivo, setModalAtivo] = useState<any>(null);

  const CardFifa = ({ jogador, tipo }: { jogador: any, tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap = tipo === 'CAPITÃO';
    return (
      <div 
        onClick={() => setModalAtivo({ ...jogador, tipo })}
        className={`relative w-[160px] h-[220px] bg-gradient-to-br ${isCap ? 'from-yellow-600 via-yellow-400 to-yellow-700' : 'from-green-600 via-green-400 to-green-700'} p-[2px] rounded-t-[2.5rem] rounded-b-lg shadow-2xl cursor-pointer hover:scale-105 transition-transform active:scale-95`}
      >
        <div className="bg-[#0a0a0a] w-full h-full rounded-t-[2.4rem] rounded-b-md overflow-hidden relative">
          <div className="absolute top-4 left-3 flex flex-col items-center">
            <span className="text-2xl font-black text-white italic leading-none">{jogador.pontos.toFixed(1)}</span>
            <span className="text-[7px] font-bold text-yellow-500 uppercase">PONTOS</span>
          </div>
          <div className={`absolute top-4 right-3 px-2 py-0.5 rounded text-[7px] font-black ${isCap ? 'bg-yellow-500' : 'bg-green-500'} text-black`}>
            {tipo}
          </div>
          <img src={jogador.foto_url} className="w-full h-32 object-contain mt-6 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]" />
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pb-3 text-center px-1">
            <p className="text-white font-black text-[10px] uppercase italic truncate leading-none">{jogador.nome}</p>
            <p className="text-[6px] text-zinc-500 font-bold uppercase mt-1">Grêmio Novorizontino</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="my-10 px-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-5 w-1.5 bg-yellow-500 rounded-full animate-pulse" />
        <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] italic">Destaques da Última Rodada</h2>
      </div>

      <div className="flex justify-center gap-4">
        {capitao && <CardFifa jogador={capitao} tipo="CAPITÃO" />}
        {heroi && <CardFifa jogador={heroi} tipo="HERÓI" />}
      </div>

      {/* MODAL DE SCOUT ESTILO SOFASCORE */}
      {modalAtivo && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-[#111] w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img src={modalAtivo.foto_url} className="w-16 h-16 bg-zinc-900 rounded-2xl object-cover border border-white/5" />
                  <span className={`absolute -bottom-2 -right-2 px-2 py-1 rounded text-[8px] font-black ${modalAtivo.tipo === 'CAPITÃO' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}`}>
                    {modalAtivo.tipo}
                  </span>
                </div>
                <div>
                  <h3 className="text-white font-black text-xl italic uppercase leading-none">{modalAtivo.nome}</h3>
                  <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">Status: Concluído</p>
                </div>
              </div>
              <button onClick={() => setModalAtivo(null)} className="text-zinc-500 text-2xl font-light">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Nota Final</p>
                <p className={`text-2xl font-black italic ${modalAtivo.pontos >= 8 ? 'text-green-500' : 'text-white'}`}>{modalAtivo.pontos.toFixed(1)}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
                <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Escalado por</p>
                <p className="text-2xl font-black italic text-yellow-500">1.2k</p>
              </div>
            </div>

            <button onClick={() => setModalAtivo(null)} className="w-full mt-6 bg-yellow-500 py-4 rounded-2xl text-black font-black uppercase italic text-sm tracking-widest active:scale-95 transition-transform">
              Fechar Análise
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
