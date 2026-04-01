'use client';
import { useState } from 'react';

export default function DestaquesFifa({ capitao, heroi }: { capitao: any, heroi: any }) {
  const [modalAtivo, setModalAtivo] = useState<any>(null);

  const CardFifa = ({ jogador, tipo }: { jogador: any, tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap = tipo === 'CAPITÃO';
    const color = isCap ? '#F5C400' : '#2ecc71';
    const shadowColor = isCap ? 'rgba(245, 196, 0, 0.5)' : 'rgba(46, 204, 113, 0.5)';

    return (
      <div 
        onClick={() => setModalAtivo({ ...jogador, tipo })}
        className="relative cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 group"
        style={{
          width: 160,
          height: 230,
          background: '#000',
          borderRadius: '12px 12px 45px 12px',
          border: `2px solid ${color}`,
          boxShadow: `0 0 25px ${shadowColor}`,
          overflow: 'hidden'
        }}
      >
        {/* Efeito de Brilho de Fundo */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
             style={{ background: `radial-gradient(circle at top, ${color} 0%, transparent 70%)` }} />

        {/* Info Superior */}
        <div className="relative z-10 p-3 flex justify-between items-start">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white italic leading-none">
              {jogador.pontos?.toFixed(1) || '0.0'}
            </span>
            <span className="text-[6px] font-black uppercase" style={{ color }}>PONTOS</span>
          </div>
          <div className="px-2 py-0.5 rounded-sm text-[7px] font-black text-black italic" style={{ background: color }}>
            {tipo}
          </div>
        </div>

        {/* Imagem do Craque */}
        <div className="relative z-10 w-full h-28 flex justify-center mt-[-5px]">
          <img 
            src={jogador.foto_url || 'https://via.placeholder.com/150'} 
            className="h-full object-contain drop-shadow-[0_10px_8px_rgba(0,0,0,0.8)]" 
            alt={jogador.nome}
          />
        </div>

        {/* Nome do Jogador */}
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pb-3 text-center px-1 z-10">
          <p className="text-white font-black text-[10px] uppercase italic truncate">
            {jogador.nome}
          </p>
          <p className="text-[6px] text-zinc-500 font-bold uppercase mt-1 tracking-widest">UT26 SPECIAL</p>
        </div>
      </div>
    );
  };

  return (
    <section className="my-10 px-4">
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20" />
        <h2 className="text-[9px] font-black text-white uppercase tracking-[0.3em] italic opacity-80">
          Destaques da Rodada
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20" />
      </div>

      <div className="flex justify-center gap-4">
        {capitao && <CardFifa jogador={capitao} tipo="CAPITÃO" />}
        {heroi && <CardFifa jogador={heroi} tipo="HERÓI" />}
      </div>

      {/* MODAL SIMPLIFICADO */}
      {modalAtivo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setModalAtivo(null)}>
          <div className="bg-[#111] w-full max-w-xs rounded-3xl border border-white/10 p-6 text-center animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <img src={modalAtivo.foto_url} className="w-24 h-24 mx-auto mb-4" />
            <h3 className="text-white font-black text-xl italic uppercase">{modalAtivo.nome}</h3>
            <p className="text-yellow-500 font-black text-3xl my-2">{modalAtivo.pontos.toFixed(1)}</p>
            <button onClick={() => setModalAtivo(null)} className="w-full mt-4 bg-white/10 text-white py-3 rounded-xl font-bold uppercase text-xs">Fechar</button>
          </div>
        </div>
      )}
    </section>
  );
}
