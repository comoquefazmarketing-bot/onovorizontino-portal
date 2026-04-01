'use client';

export default function DestaquesFifa() {
  // CONFIGURAÇÃO DIRETA (Mágico de Oz)
  // Aqui você define quem aparece sem depender do Supabase
  const capitao = {
    nome: 'César Augusto',
    pontos: 7.3,
    foto: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/CESAR-AUGUSTO.jpg.webp'
  };

  const heroi = {
    nome: 'Patrick',
    pontos: 7.3,
    foto: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/PATRICK.jpg.webp'
  };

  const CardUT26 = ({ j, tipo }: { j: any, tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap = tipo === 'CAPITÃO';
    const color = isCap ? '#F5C400' : '#00E5FF'; 
    const notaFinal = isCap ? (j.pontos * 2).toFixed(1) : j.pontos.toFixed(1);

    return (
      <div className="relative group animate-in fade-in zoom-in duration-1000">
        {/* Aura de Brilho UEFA */}
        <div className={`absolute -inset-2 blur-2xl opacity-20 group-hover:opacity-50 transition duration-1000`} 
             style={{ backgroundColor: color }} />
        
        <div className="relative w-[165px] h-[240px] bg-black overflow-hidden border-2 shadow-2xl"
             style={{ 
               borderColor: color,
               borderRadius: '12px 12px 50px 12px',
               boxShadow: `inset 0 0 25px ${color}44`
             }}>
          
          {/* Reflexo Dinâmico */}
          <div className="absolute inset-0 z-0 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_5s_infinite]" />

          {/* Badge de Pontos */}
          <div className="relative z-10 p-4">
            <div className="flex flex-col leading-none">
              <span className="text-4xl font-[1000] text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                {notaFinal}
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color }}>
                RATING {isCap && 'x2'}
              </span>
            </div>
            <div className="absolute top-4 right-0 px-2 py-0.5 text-[8px] font-black text-black uppercase italic" 
                 style={{ backgroundColor: color, borderRadius: '2px 0 0 2px' }}>
              {tipo}
            </div>
          </div>

          {/* Jogador */}
          <div className="relative z-10 w-full h-36 flex justify-center mt-[-10px]">
            <img src={j.foto} alt={j.nome} 
                 className="h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.9)] scale-110 group-hover:scale-125 transition-all duration-500" />
          </div>

          {/* Nome e Rodapé UEFA */}
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/95 to-transparent pb-4 text-center px-2 z-10">
            <p className="text-white font-[1000] text-[12px] uppercase italic tracking-tighter">
              {j.nome}
            </p>
            <div className="h-[2px] w-12 mx-auto my-1.5 rounded-full opacity-80" style={{ backgroundColor: color }} />
            <p className="text-[6px] text-zinc-500 font-bold uppercase tracking-[0.4em]">Tigre FC Special</p>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-150%) skewX(-20deg); }
            30% { transform: translateX(150%) skewX(-20deg); }
            100% { transform: translateX(150%) skewX(-20deg); }
          }
        `}</style>
      </div>
    );
  };

  return (
    <section className="my-12 flex flex-col items-center">
      <div className="flex items-center gap-6 mb-10 w-full max-w-xl">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-yellow-500/40" />
        <h2 className="text-[11px] font-black text-white uppercase tracking-[0.6em] italic opacity-90 whitespace-nowrap">
          The Best <span className="text-yellow-500">Tigre FC</span>
        </h2>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-yellow-500/40" />
      </div>
      
      <div className="flex justify-center gap-8">
        <CardUT26 j={capitao} tipo="CAPITÃO" />
        <CardUT26 j={heroi} tipo="HERÓI" />
      </div>
    </section>
  );
}
