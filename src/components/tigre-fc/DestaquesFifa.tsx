'use client';

// ─── THE BEST TIGRE FC — RODADA 6 (CORRIGIDO) ───────────────────────────────
// Partida: Sport 0x0 Novorizontino
// ─────────────────────────────────────────────────────────────────────────────

export default function DestaquesFifa() {

  const capitao = {
    nome:   'Dantas',
    pontos: 14.2,
    foto:   'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/DANTAS%20FUNDO%20TRANSPARENTE.png',
  };

  const heroi = {
    nome:   'César',
    pontos: 11.9,
    foto:   'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CESAR%20FUNDO%20TRANSPARENTE.png',
  };

  const CardFuturistaUT26 = ({ j, tipo }: { j: { nome: string; pontos: number; foto: string }; tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap      = tipo === 'CAPITÃO';
    const color      = isCap ? '#F5C400' : '#00F3FF';
    const labelBônus = isCap ? 'RATING × 2' : 'RATING + 5';
    
    return (
      <div className="relative group animate-in fade-in zoom-in duration-1000">
        <div className="absolute -inset-4 blur-3xl opacity-30 group-hover:opacity-60 transition duration-1000" style={{ backgroundColor: color }} />
        
        <div className="relative w-[180px] h-[260px] overflow-hidden" style={{ borderRadius: '15px' }}>
          {/* Estrutura Poligonal via CSS Clip-Path para garantir que não haja erro de tag */}
          <div className="absolute inset-0 bg-black border-2" style={{ 
            borderColor: color,
            clipPath: 'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 80% 100%, 20% 100%, 0% 85%)' 
          }}>
            
            {/* Fundo Gold para Capitão */}
            {isCap && (
              <div className="absolute inset-0 opacity-20 bg-gradient-to-b from-yellow-600 to-transparent" />
            )}

            {/* Shimmer */}
            <div className="absolute inset-0 z-10 opacity-10 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_7s_infinite]" />
            
            <div className="relative z-20 p-4 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="flex flex-col leading-none">
                  <span className="text-4xl font-[1000] text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ color: 'white' }}>
                    {j.pontos.toFixed(1)}
                  </span>
                  <span className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color }}>{labelBônus}</span>
                </div>
                <div className="px-2 py-0.5 text-[8px] font-black text-black uppercase italic" style={{ backgroundColor: color, borderRadius: '2px' }}>
                  {tipo}
                </div>
              </div>

              <div className="w-full h-32 flex justify-center items-center mt-[-5px]">
                <img 
                  src={j.foto} 
                  alt={j.nome} 
                  className="h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.9)] scale-[1.3] group-hover:scale-[1.4] transition-all duration-700" 
                />
              </div>

              <div className="w-full text-center pb-4">
                <div className="h-[2px] w-12 mx-auto mb-1.5 rounded-full" style={{ backgroundColor: color }} />
                <p className="text-white font-[1000] text-[12px] uppercase italic tracking-tighter">
                  {j.nome}
                </p>
                <p className="text-[6px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-1">
                  Elite Top Performance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="my-16 flex flex-col items-center">
      <div className="relative inline-block mb-12">
        <div className="absolute -inset-10 bg-yellow-500/10 blur-[60px] rounded-full scale-y-50 animate-pulse" />
        <h2 className="text-sm font-black text-white uppercase tracking-[0.6em] italic text-center relative z-10">
          The Best <span className="text-yellow-500">Tigre FC</span>
        </h2>
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] text-center mt-1 relative z-10">
          Rodada 6 · Sport 0x0 Novorizontino
        </p>
      </div>

      <div className="flex justify-center gap-10 flex-wrap">
        <CardFuturistaUT26 j={capitao} tipo="CAPITÃO" />
        <CardFuturistaUT26 j={heroi}   tipo="HERÓI"   />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
