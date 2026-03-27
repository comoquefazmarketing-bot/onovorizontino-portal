'use client';

export default function GlobalAdBanner() {
  const whatsappLink = "https://wa.me/5517988031679?text=Olá Felipe, quero anunciar no Portal O Novorizontino!";

  return (
    <div className="w-full bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-2">

        {/* Rótulo publicidade — igual ao GE */}
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 text-center mb-2">
          PUBLICIDADE
        </p>

        {/* Banner clicável */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-full overflow-hidden rounded-lg border border-zinc-800 hover:border-yellow-500/50 transition-all duration-500"
        >
          {/* Fundo gradiente com texto — aparece enquanto não há imagem real */}
          <div className="relative w-full h-[80px] md:h-[100px] bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-between px-8 md:px-16">
            
            {/* Lado esquerdo */}
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 bg-yellow-500" />
              <div>
                <p className="text-yellow-500 font-black italic uppercase text-lg md:text-2xl leading-none tracking-tighter">
                  ANUNCIE AQUI
                </p>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Portal O Novorizontino · Sua marca para o Tigre do Vale
                </p>
              </div>
            </div>

            {/* Lado direito */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-white font-black text-sm uppercase tracking-widest">Felipe Makarios</p>
                <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Comercial · (17) 98803-1679</p>
              </div>
              <div className="bg-yellow-500 hover:bg-white transition-colors text-black font-black text-[10px] uppercase tracking-widest px-5 py-3 rounded-full whitespace-nowrap">
                ANUNCIAR →
              </div>
            </div>

            {/* Efeito shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
          </div>
        </a>

      </div>
    </div>
  );
}
