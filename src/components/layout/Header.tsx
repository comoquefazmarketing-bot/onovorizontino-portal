import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const imgJorjao = "https://www.gremionovorizontino.com.br/wp-content/smush-webp/2025/09/54319013690_0850951213_k.jpg.webp";

  const frases = [
    "🔥 O ACESSO É QUESTÃO DE HONRA!",
    "🐯 PORTAL O NOVORIZONTINO: A FORÇA DO INTERIOR!",
    "🟡⚫ UNIDOS PELO MESMO OBJETIVO: RUMO À SÉRIE A!",
    "🏆 VICE-CAMPEÃO PAULISTA 2026 - UMA CAMPANHA HISTÓRICA!",
    "🏟️ NO JORJÃO, QUEM MANDA É O TIGRE!",
    "📢 ACREDITE, TORCEDOR! O ACESSO É QUESTÃO DE HONRA!",
    "⭐ NOVO HORIZONTE RESPIRA FUTEBOL!"
  ];

  // Separador elegante para dar espaço entre as frases
  const separator = "  |  ★  |  ";
  const fullText = frases.join(separator);

  return (
    <header className="w-full bg-black relative overflow-hidden border-b-2 border-yellow-500">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          /* Aumentado para 60s para leitura confortável */
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* FUNDO JORJÃO */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <img src={imgJorjao} alt="Jorjão" className="w-full h-full object-cover opacity-60 contrast-110" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-transparent to-black/90"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* BARRA TIMES SQUARE - ESPAÇADA E MAIS LENTA */}
        <div className="w-full bg-yellow-500 py-2 overflow-hidden border-b border-black/20 shadow-xl flex items-center">
          <div className="animate-marquee">
            <span className="text-[11px] md:text-sm font-black text-black uppercase italic tracking-widest px-10">
              {fullText} {separator} {fullText} {separator}
            </span>
          </div>
        </div>

        {/* ÁREA DO LOGO E ASSINATURA */}
        <div className="w-full max-w-7xl px-4 md:px-8 flex flex-col md:flex-row items-center justify-between py-6 md:py-8">
          <Link href="/" className="relative w-[380px] h-[160px] md:w-[620px] md:h-[240px]">
            <Image 
              src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
              alt="Logo"
              fill
              className="object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,1)]" 
              priority
            />
          </Link>

          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end text-right">
            <h2 className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              FELIPE <span className="text-yellow-500">MAKARIOS</span>
            </h2>
            <div className="mt-2 flex flex-col items-center md:items-end">
              <span className="text-zinc-400 text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase">
                EDITOR-CHEFE & FUNDADOR
              </span>
              <div className="mt-4 bg-black/40 border border-yellow-500/30 px-4 py-1 rounded-full">
                <span className="text-yellow-500 text-[10px] font-black uppercase italic">📍 Novo Horizonte, SP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
