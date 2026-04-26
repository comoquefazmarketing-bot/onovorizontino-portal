'use client';

// ─── THE BEST TIGRE FC — RODADA 6 ───────────────────────────────────────────
// Partida: Sport 0x0 Novorizontino
// ✏️ Nova Regra Aplicada: Capitão (Rating × 2) | Herói (Rating + 5)
// ─────────────────────────────────────────────────────────────────────────────

export default function DestaquesFifa() {

  // CAPITÃO — Dantas · Nota 7.1 no SofaScore
  const capitao = {
    nome:   'Dantas',
    pontos: 14.2, // 7.1 x 2
    foto:   'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/DANTAS%20FUNDO%20TRANSPARENTE.png',
  };

  // HERÓI — César · Nota 6.9 no SofaScore
  const heroi = {
    nome:   'César',
    pontos: 11.9, // 6.9 + 5 (Bônus reduzido conforme alinhado)
    foto:   'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CESAR%20FUNDO%20TRANSPARENTE.png',
  };

  const CardFuturistaUT26 = ({ j, tipo }: { j: { nome: string; pontos: number; foto: string }; tipo: 'CAPITÃO' | 'HERÓI' }) => {
    const isCap      = tipo === 'CAPITÃO';
    const color      = isCap ? '#F5C400' : '#00F3FF';
    const labelBônus = isCap ? 'RATING × 2' : 'RATING + 5';
    
    // SVG da estrutura poligonal complexa (inspirada no FIFA26)
    const PolygonStructure = () => (
      <svg viewBox="0 0 170 250" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path 
          d="M0 15 L25 0 L145 0 L170 15 L170 200 L120 250 L50 250 L0 200 Z" 
          fill="black" 
          stroke={color} 
          strokeWidth="2"
        />
        {/* Detalhe de UI na parte inferior */}
        <path d="M50 250 L120 250 L110 240 L60 240 Z" fill={color} opacity="0.8" />
        {/* Linhas de acento nas pontas superiores */}
        <path d="M0 15 L15 6" stroke={color} strokeWidth="1" opacity="0.5" />
        <path d="M170 15 L155 6" stroke={color} strokeWidth="1" opacity="0.5" />
      </svg>
    );

    return (
      <div className="relative group animate-in fade-in zoom-in duration-1000">
        {/* Glow externo intenso */}
        <div 
          className="absolute -inset-4 blur-3xl opacity-30 group-hover:opacity-60 transition duration-1000" 
          style={{ backgroundColor: color }} 
        />
        
        {/* Container Principal com o formato poligonal */}
        <div className="relative w-[170px] h-[250px] overflow-hidden" style={{ borderRadius: '15px' }}>
          <PolygonStructure />

          {/* Fundo Poligonal Gold (Apenas para o Capitão) */}
          {isCap && (
            <div className="absolute inset-[3px] z-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/parian-marble.png')] bg-repeat" style={{ 
              clipPath: 'polygon(0% 6%, 15% 0%, 85% 0%, 100% 6%, 100% 80%, 70% 100%, 30% 100%, 0% 80%)',
              backgroundColor: '#BFA071' // Tom dourado para o mármore
            }} />
          )}

          {/* Shimmer effect */}
          <div className="absolute inset-0 z-10 opacity-10 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full animate-[shimmer_7s_infinite]" />
          
          {/* CONTEÚDO DO CARD */}
          <div className="relative z-20 p-4 h-full flex flex-col justify-between">
            
            {/* Topo: Pontuação e Tipo */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col leading-none">
                <span className="text-4xl font-[1000] text-white italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] led-glow">
                  {j.pontos.toFixed(1)}
                </span>
                <span className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color }}>{labelBônus}</span>
              </div>
              <div className="px-2 py-0.5 text-[8px] font-black text-black uppercase italic" style={{ backgroundColor: color, borderRadius: '2px' }}>
                {tipo}
              </div>
            </div>

            {/* Centro: Foto do Jogador (escalada para sair do card) */}
            <div className="w-full h-32 flex justify-center items-center mt-[-10px]">
              <img 
                src={j.foto} 
                alt={j.nome} 
                className="h-full object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,1)] scale-[1.3] group-hover:scale-[1.4] transition-all duration-700" 
              />
            </div>

            {/* Base: Nome e Info */}
            <div className="w-full text-center pb-2">
              <div className="h-[2px] w-12 mx-auto mb-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
              <p className="text-white font-[1000] text-[12px] uppercase italic tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] led-glow">
                {j.nome}
              </div>
              <p className="text-[6px] text-zinc-500 font-bold uppercase tracking-[0.4em] mt-1">Elite Top Performance</p>
            </div>
          </div>

          {/* Detalhe de UI na "quebra" poligonal de baixo */}
          <div className="absolute bottom-[10px] right-[10px] w-4 h-4 opacity-50" style={{ borderRight: `2px solid ${color}`, borderBottom: `2px solid ${color}` }} />
        </div>
      </div>
    );
  };

  return (
    <section className="my-16 flex flex-col items-center">
      {/* Título com Scanline Glow */}
      <div className="relative inline-block mb-12">
        <div className="absolute -inset-10 bg-yellow-500/10 blur-[60px] rounded-full scale-y-50 animate-pulse" />
        <h2 className="text-sm font-black text-white uppercase tracking-[0.6em] italic text-center relative z-10">
          The Best <span className="text-yellow-500 text-shadow-gold">Tigre FC</span>
        </h2>
        <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.4em] text-center mt-1 relative z-10">
          Rodada 6 · Sport 0x0 Novorizontino
        </p>
      </div>

      <div className="flex justify-center gap-10 flex-wrap">
        <CardFuturistaUT26 j={capitao} tipo="CAPITÃO" />
        <CardFuturistaUT26 j={heroi}   tipo="HERÓI"   />
      </div>

      {/* Forçando os estilos neon/glow se não estiverem no global */}
      <style jsx global>{`
        .led-glow { text-shadow: 0 0 10px currentColor !important; }
        .text-shadow-gold { text-shadow: 0 0 10px rgba(245,196,0,0.7) !important; }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
}
