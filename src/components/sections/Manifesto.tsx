'use client';
import Link from 'next/link';

export default function Manifesto() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '580px' }}>

      {/* Foto do estádio de fundo */}
      <img
        src="/jorjao.webp"
        alt="Jorjão"
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 0.35 }}
      />

      {/* Gradiente cinematográfico */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />

      {/* Linha amarela topo */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-yellow-500" />

      {/* Conteúdo */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col justify-center h-full" style={{ minHeight: '580px' }}>

        {/* Label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-[2px] bg-yellow-500" />
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">
            Manifesto · Portal O Novorizontino
          </span>
        </div>

        {/* Título principal */}
        <h2
          className="font-black uppercase italic leading-none tracking-tighter text-white mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', maxWidth: '800px' }}
        >
          O ACESSO É<br />
          <span className="text-yellow-500">QUESTÃO</span><br />
          DE HONRA.
        </h2>

        {/* Texto do manifesto */}
        <div className="max-w-2xl space-y-4 mb-10">
          <p className="text-zinc-300 text-lg leading-relaxed font-medium">
            Novo Horizonte é uma cidade de 40 mil habitantes que aprendeu a sonhar grande.
            Nas esquinas, nos bares, nas calçadas — o Tigre do Vale não é apenas um clube.
            É o pulsar de uma comunidade inteira.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Três anos consecutivos lutando pelo acesso. Três anos de "quase". 
            A frustração acumulada não é desânimo — é o combustível de uma cidade 
            que não aceita ser pequena. <strong className="text-white">2026 é o ano da reparação histórica.</strong>
          </p>
        </div>

        {/* Frase de impacto */}
        <blockquote className="border-l-4 border-yellow-500 pl-6 mb-10">
          <p className="text-white text-2xl md:text-3xl font-black italic uppercase leading-tight">
            "Subir não é opção.<br />É reparação."
          </p>
        </blockquote>

        {/* CTA */}
        <Link
          href="/noticias/o-acesso-e-questao-de-honra-2026"
          className="group inline-flex items-center gap-3 w-fit"
        >
          <div className="bg-yellow-500 group-hover:bg-white transition-colors px-6 py-3 flex items-center gap-3">
            <span className="text-black text-[11px] font-black uppercase tracking-widest">
              Ler o Manifesto Completo
            </span>
            <span className="text-black font-black transition-transform group-hover:translate-x-1 duration-300">→</span>
          </div>
        </Link>

        {/* Rodapé decorativo */}
        <div className="flex items-center gap-4 mt-12 pt-8 border-t border-white/10">
          <div className="flex gap-1">
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="w-3 h-3 bg-black border border-yellow-500 rounded-full" />
          </div>
          <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">
            Grêmio Novorizontino · Série B 2026 · De torcedor pra torcedor
          </span>
        </div>

      </div>

      {/* Linha amarela base */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-yellow-500" />

    </section>
  );
}
