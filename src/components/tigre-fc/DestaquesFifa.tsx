'use client';
import { useState, useEffect } from 'react';

export default function DestaquesFifa({ capitao, heroi }: { capitao: any, heroi: any }) {
  const [modalAtivo, setModalAtivo] = useState<any>(null);

  const CardFifa = ({ jogador, tipo }: { jogador: any, tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap = tipo === 'CAPITÃO';
    const color = isCap ? '#F5C400' : '#2ecc71';
    
    return (
      <div 
        onClick={() => setModalAtivo({ ...jogador, tipo })}
        className="relative cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 group"
        style={{
          width: 160,
          height: 235,
          background: '#000',
          borderRadius: '15px 15px 50px 15px',
          border: `2px solid ${color}`,
          boxShadow: `0 0 20px ${color}66`,
          overflow: 'hidden'
        }}
      >
        {/* Efeito Shine Animado */}
        <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_5s_infinite]" 
             style={{ backgroundSize: '200% 100%' }} />

        {/* Glow de Fundo */}
        <div className="absolute top-0 left-0 w-full h-full opacity-40 z-0"
             style={{ background: `radial-gradient(circle at top, ${color}33 0%, transparent 70%)` }} />

        {/* Info Superior */}
        <div className="relative z-10 p-3 flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white italic leading-none drop-shadow-md">
              {jogador.pontos?.toFixed(1)}
            </span>
            <span className="text-[6px] font-black uppercase tracking-tighter" style={{ color }}>PONTOS</span>
          </div>
          <div className="px-2 py-0.5 rounded-sm text-[8px] font-black text-black italic uppercase" style={{ background: color }}>
            {tipo}
          </div>
        </div>

        {/* Imagem do Jogador com Drop Shadow Pesado */}
        <div className="relative z-10 w-full h-32 flex justify-center mt-[-8px]">
          <img 
            src={jogador.foto_url} 
            className="h-full object-contain drop-shadow-[0_12px_12px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_15px_15px_rgba(0,0,0,1)] transition-all" 
            alt={jogador.nome}
          />
        </div>

        {/* Footer com Gradiente */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pb-4 text-center px-2 z-10">
          <p className="text-white font-black text-[11px] uppercase italic truncate">
            {jogador.nome}
          </p>
          <div className="h-[2px] w-10 mx-auto my-1 rounded-full" style={{ background: color }} />
          <p className="text-[7px] text-zinc-500 font-bold uppercase tracking-widest">Tigre FC Edition</p>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-150%) skewX(-20deg); }
            20% { transform: translateX(150%) skewX(-20deg); }
            100% { transform: translateX(150%) skewX(-20deg); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <section className="my-10 px-4">
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-yellow-500" />
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic whitespace-nowrap">
          Craques da Rodada
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-yellow-500/50 to-yellow-500" />
      </div>

      <div className="flex justify-center gap-6 sm:gap-10">
        {capitao && <CardFifa jogador={capitao} tipo="CAPITÃO" />}
        {heroi && <CardFifa jogador={heroi} tipo="HERÓI" />}
      </div>

      {/* Modal Scout SofaScore Style */}
      {modalAtivo && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl" onClick={() => setModalAtivo(null)}>
          <div className="bg-[#0a0a0a] w-full max-w-sm rounded-[40px] border border-white/10 p-8 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,1)]" onClick={e => e.stopPropagation()}>
             <div className="absolute top-0 left-0 w-full h-32 opacity-20" style={{ background: `linear-gradient(to b, ${modalAtivo.tipo === 'CAPITÃO' ? '#F5C400' : '#2ecc71'}, transparent)` }} />
             
             <img src={modalAtivo.foto_url} className="w-32 h-32 mx-auto relative z-10 drop-shadow-2xl mb-4" />
             <h3 className="text-white text-center font-black text-2xl italic uppercase mb-2 leading-none">{modalAtivo.nome}</h3>
             <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6">Desempenho Elite</p>

             <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="bg-zinc-900/50 p-4 rounded-3xl border border-white/5 text-center">
                  <p className="text-[8px] text-zinc-500 font-black uppercase">Nota Sofa</p>
                  <p className="text-3xl font-black italic text-white mt-1">{modalAtivo.pontos.toFixed(1)}</p>
                </div>
                <div className="bg-zinc-900/50 p-4 rounded-3xl border border-white/5 text-center">
                  <p className="text-[8px] text-zinc-500 font-black uppercase">Impacto</p>
                  <p className="text-sm font-black italic text-yellow-500 mt-3 uppercase">Decisivo</p>
                </div>
             </div>

             <button onClick={() => setModalAtivo(null)} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase italic text-sm active:scale-95 transition-transform">
               Fechar Análise
             </button>
          </div>
        </div>
      )}
    </section>
  );
}
