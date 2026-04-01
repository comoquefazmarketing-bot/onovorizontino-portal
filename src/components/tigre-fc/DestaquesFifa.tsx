'use client';

export default function DestaquesFifa({ capitao, heroi }: { capitao: any, heroi: any }) {
  const CardUT26 = ({ j, tipo }: { j: any, tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap = tipo === 'CAPITÃO';
    const color = isCap ? '#F5C400' : '#00E5FF'; 
    
    // CORREÇÃO: O banco envia 'pontos_ganhos', mas o código esperava 'pontos'
    // CORREÇÃO: O objeto do jogador usa 'foto', mas o código esperava 'foto_url'
    const exibicaoPontos = j.pontos_ganhos || j.pontos || 0;
    const fotoExibicao = j.foto || j.foto_url;

    return (
      <div className="relative group animate-in fade-in zoom-in duration-1000">
        <div className={`absolute -inset-1 blur-xl opacity-30 group-hover:opacity-60 transition duration-1000`} 
             style={{ backgroundColor: color }} />
        
        <div className="relative w-[155px] h-[230px] bg-black overflow-hidden border-2"
             style={{ 
               borderColor: color,
               borderRadius: '12px 12px 45px 12px',
               boxShadow: `inset 0 0 20px ${color}33`
             }}>
          
          <div className="absolute inset-0 z-0 opacity-30 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_4s_infinite]" />

          <div className="relative z-10 p-3">
            <div className="flex flex-col">
              <span className="text-3xl font-[1000] text-white italic leading-none drop-shadow-md">
                {Number(exibicaoPontos).toFixed(1)}
              </span>
              <span className="text-[7px] font-black uppercase tracking-widest" style={{ color }}>RATING</span>
            </div>
            <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded-sm text-[7px] font-black text-black uppercase italic" 
                 style={{ backgroundColor: color }}>
              {tipo}
            </div>
          </div>

          <div className="relative z-10 w-full h-32 flex justify-center mt-[-5px]">
            {/* CORREÇÃO AQUI: j.foto em vez de j.foto_url */}
            <img src={fotoExibicao} alt={j.nome} className="h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)] scale-110 group-hover:scale-125 transition-transform duration-500" />
          </div>

          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pb-4 text-center px-2 z-10">
            <p className="text-white font-[1000] text-[11px] uppercase italic truncate tracking-tight">
              {j.nome || j.short}
            </p>
            <div className="h-[1.5px] w-10 mx-auto my-1.5 rounded-full opacity-60" style={{ backgroundColor: color }} />
            <p className="text-[6px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Tigre FC Special</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-150%) skewX(-20deg); }
            40% { transform: translateX(150%) skewX(-20deg); }
            100% { transform: translateX(150%) skewX(-20deg); }
          }
        `}</style>
      </div>
    );
  };

  if (!capitao && !heroi) return null; // Não mostra nada se não houver dados

  return (
    <section className="my-12 flex flex-col items-center">
      <div className="flex items-center gap-4 mb-8 w-full">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-yellow-500/30" />
        <h2 className="text-[10px] font-black text-white uppercase tracking-[0.5em] italic opacity-80">Destaques da Rodada</h2>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-yellow-500/30" />
      </div>
      <div className="flex justify-center gap-4">
        {capitao && <CardUT26 j={capitao} tipo="CAPITÃO" />}
        {heroi && <CardUT26 j={heroi} tipo="HERÓI" />}
      </div>
    </section>
  );
}
