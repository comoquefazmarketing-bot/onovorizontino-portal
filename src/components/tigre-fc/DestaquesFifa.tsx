'use client';

// ─── THE BEST TIGRE FC — VERSÃO EVOLUÍDA FIFA 26 ────────────────────────────
// Rodada 6 · Sport 0x0 Novorizontino
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
    const isCap = tipo === 'CAPITÃO';
    const color = isCap ? '#F5C400' : '#00F3FF';
    const labelBônus = isCap ? 'RATING × 2' : 'RATING + 5';
    
    return (
      <div className="relative group animate-in fade-in zoom-in duration-1000">
        {/* Glow Atmosférico */}
        <div className="absolute -inset-8 blur-[60px] opacity-20 group-hover:opacity-40 transition duration-1000" style={{ backgroundColor: color }} />
        
        <div className="relative w-[190px] h-[270px] overflow-hidden" style={{ borderRadius: '18px' }}>
          
          {/* Estrutura Poligonal de Alta Definição */}
          <div className="absolute inset-0 bg-[#080808] border-[1.5px]" style={{ 
            borderColor: `${color}66`,
            clipPath: 'polygon(0% 15%, 15% 0%, 85% 0%, 100% 15%, 100% 85%, 80% 100%, 20% 100%, 0% 85%)' 
          }}>
            
            {/* Detalhes de Grade Técnica ao Fundo */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            
            {/* Gradiente de Especialidade */}
            <div className="absolute inset-0 opacity-30" style={{ 
              background: `radial-gradient(circle at top right, ${color}33, transparent)` 
            }} />

            {/* Shimmer de Elite */}
            <div className="absolute inset-0 z-10 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_8s_infinite]" />
            
            <div className="relative z-20 p-5 h-full flex flex-col justify-between">
              
              {/* HEADER: Pontuação e Badge */}
              <div className="flex justify-between items-start">
                <div className="flex flex-col leading-none">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-[1000] text-white italic tracking-tighter drop-shadow-md">
                      {j.pontos.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-80" style={{ color }}>
                    {labelBônus}
                  </span>
                </div>
                
                {/* Etiqueta de Função FIFA Style */}
                <div className="flex flex-col items-end">
                  <div className="px-2 py-0.5 text-[8px] font-black text-black uppercase italic skew-x-[-10deg]" style={{ backgroundColor: color }}>
                    {tipo}
                  </div>
                  <div className="w-full h-[1px] mt-1 bg-white/20" />
                </div>
              </div>

              {/* CENTER: Jogador com Fade de Fumaça na Base */}
              <div className="absolute inset-0 flex items-center justify-center pt-6 pointer-events-none">
                <img 
                  src={j.foto} 
                  alt={j.nome} 
                  className="h-48 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] scale-110 group-hover:scale-[1.2] transition-all duration-700 ease-out" 
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 65%, transparent 92%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 92%)'
                  }}
                />
              </div>

              {/* FOOTER: Identificação e UI */}
              <div className="relative z-30 w-full text-center">
                {/* Linha de Separação com Glow */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/20" />
                  <div className="w-1.5 h-1.5 rotate-45 border border-white/40" style={{ backgroundColor: color }} />
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/20" />
                </div>

                <p className="text-white font-[1000] text-[13px] uppercase italic tracking-tighter drop-shadow-sm">
                  {j.nome}
                </p>
                <div className="mt-0.5">
                  <span className="text-[5px] text-zinc-500 font-bold uppercase tracking-[0.5em]">
                    Data Broadcast Protocol
                  </span>
                </div>
              </div>

            </div>
          </div>
          
          {/* Cantoneiras Estilizadas (UI Extra) */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/20" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/20" />
        </div>
      </div>
    );
  };

  return (
    <section className="my-16 flex flex-col items-center">
      {/* Título Estilizado */}
      <div className="relative inline-block mb-14">
        <div className="absolute -inset-x-20 -inset-y-10 bg-yellow-500/5 blur-[80px] rounded-full scale-y-50 animate-pulse" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-yellow-500/50" />
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.8em] italic">
            The Best <span className="text-yellow-500">Tigre FC</span>
          </h2>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-yellow-500/50" />
        </div>
        
        <div className="flex flex-col items-center mt-3">
          <p className="px-3 py-0.5 bg-zinc-900/50 border border-white/5 rounded-full text-[8px] text-zinc-400 font-black uppercase tracking-[0.3em]">
            Rodada 6 · Sport <span className="text-white">0×0</span> Novorizontino
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-12 flex-wrap px-4">
        <CardFuturistaUT26 j={capitao} tipo="CAPITÃO" />
        <CardFuturistaUT26 j={heroi}   tipo="HERÓI"   />
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-20deg); }
          100% { transform: translateX(150%) skewX(-20deg); }
        }
      `}</style>
    </section>
  );
}
