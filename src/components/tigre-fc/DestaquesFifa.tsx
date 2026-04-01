'use client';
import { useState } from 'react';

export default function DestaquesFifa({ capitao, heroi }: { capitao: any, heroi: any }) {
  const [modalAtivo, setModalAtivo] = useState<any>(null);

  const CardFifa = ({ jogador, tipo }: { jogador: any, tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap = tipo === 'CAPITÃO';
    const color = isCap ? '#F5C400' : '#2ecc71';
    const shadowColor = isCap ? 'rgba(245, 196, 0, 0.4)' : 'rgba(46, 204, 113, 0.4)';

    return (
      <div 
        onClick={() => setModalAtivo({ ...jogador, tipo })}
        className="relative cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group"
        style={{
          width: 165,
          height: 235,
          background: '#000',
          borderRadius: '15px 15px 55px 15px',
          border: `2px solid ${color}`,
          boxShadow: `0 0 20px ${shadowColor}, inset 0 0 15px ${shadowColor}`,
          overflow: 'hidden'
        }}
      >
        {/* Background Glow Effect */}
        <div className="absolute top-[-20%] left-[-25%] w-[150%] h-[100%] opacity-30 group-hover:opacity-50 transition-opacity"
             style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }} />

        {/* Header: Score & Badge */}
        <div className="relative z-10 p-3 flex justify-between items-start">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-white italic leading-none drop-shadow-md">
              {jogador.pontos.toFixed(1)}
            </span>
            <span className="text-[7px] font-black tracking-tighter" style={{ color }}>PONTOS</span>
          </div>
          <div className="px-2 py-0.5 rounded-sm text-[8px] font-black text-black italic" style={{ background: color }}>
            {tipo}
          </div>
        </div>

        {/* Player Image */}
        <div className="relative z-10 w-full h-32 flex justify-center mt-[-10px]">
          <img 
            src={jogador.foto_url} 
            className="h-full object-contain drop-shadow-[0_8px_10px_rgba(0,0,0,0.9)]" 
            alt={jogador.nome}
          />
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/95 to-transparent pb-4 text-center px-2 z-10">
          <p className="text-white font-black text-[11px] uppercase italic truncate tracking-tight">
            {jogador.nome}
          </p>
          <div className="h-[1px] w-12 mx-auto my-1" style={{ background: color, opacity: 0.5 }} />
          <p className="text-[7px] text-zinc-400 font-bold uppercase">Ultimate Team 26</p>
        </div>
      </div>
    );
  };

  return (
    <section className="my-12 px-4">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-0.5 w-10 bg-gradient-to-r from-transparent to-yellow-500" />
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic text-center">
          Craques da Rodada
        </h2>
        <div className="h-0.5 w-10 bg-gradient-to-l from-transparent to-yellow-500" />
      </div>

      <div className="flex justify-center gap-6 sm:gap-10">
        {capitao && <CardFifa jogador={capitao} tipo="CAPITÃO" />}
        {heroi && <CardFifa jogador={heroi} tipo="HERÓI" />}
      </div>

      {/* MODAL ANALISE */}
      {modalAtivo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-[#0a0a0a] w-full max-w-sm rounded-[32px] border border-white/10 p-8 relative overflow-hidden shadow-2xl">
            {/* Modal Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 blur-[100px] opacity-20" 
                 style={{ background: modalAtivo.tipo === 'CAPITÃO' ? '#F5C400' : '#2ecc71' }} />
            
            <button onClick={() => setModalAtivo(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white text-xl">✕</button>

            <div className="text-center relative z-10">
              <img src={modalAtivo.foto_url} className="w-32 h-32 mx-auto object-contain drop-shadow-2xl mb-4" />
              <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black mb-2" 
                   style={{ background: modalAtivo.tipo === 'CAPITÃO' ? '#F5C400' : '#2ecc71', color: '#000' }}>
                {modalAtivo.tipo} DA RODADA
              </div>
              <h3 className="text-white font-black text-2xl italic uppercase mb-6">{modalAtivo.nome}</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                  <p className="text-[9px] text-zinc-500 font-black uppercase mb-1">Nota Final</p>
                  <p className="text-3xl font-black italic text-white">{modalAtivo.pontos.toFixed(1)}</p>
                </div>
                <div className="bg-white/5 p-5 rounded-3xl border border-white/5">
                  <p className="text-[9px] text-zinc-500 font-black uppercase mb-1">Status</p>
                  <p className="text-xs font-black italic text-green-500 uppercase mt-2">Mito ✅</p>
                </div>
              </div>

              <button onClick={() => setModalAtivo(null)} className="w-full mt-8 bg-white text-black py-4 rounded-2xl font-black uppercase italic text-sm hover:bg-yellow-500 transition-colors">
                Fechar Análise
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
