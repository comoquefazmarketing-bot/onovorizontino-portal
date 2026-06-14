'use client';
import Link from 'next/link';
import CTCarousel from '@/components/sections/CTCarousel';

export default function CTSection() {
  return (
    <section className="w-full bg-[#050505] border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* TEXTO */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-yellow-500" />
              <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">
                Estrutura · Centro de Treinamento
              </span>
            </div>

            <h2
              className="font-black uppercase italic leading-none tracking-tighter text-white mb-6"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)' }}
            >
              O CT QUE<br />
              <span className="text-yellow-500">PREPARA</span><br />
              CAMPEÕES.
            </h2>

            <p className="text-zinc-300 text-base leading-relaxed mb-4 max-w-lg">
              Inaugurado em 2023, o Centro de Treinamento do Novorizontino é um dos mais
              modernos do interior paulista. Campos padrão FIFA, academia de alta performance,
              piscina semiolímpica e vestiários de elite — tudo construído para levar o Tigre à Série A.
            </p>

            <p className="text-zinc-500 text-sm leading-relaxed mb-8 max-w-lg">
              Aqui nasce a disciplina que transforma sonho em resultado. A estrutura já é de primeira divisão.
              O acesso é questão de tempo.
            </p>

            <Link
              href="/noticias/o-acesso-e-questao-de-honra-2026"
              className="group inline-flex items-center gap-3 w-fit"
            >
              <div className="bg-yellow-500 group-hover:bg-white transition-colors px-6 py-3 flex items-center gap-3">
                <span className="text-black text-[11px] font-black uppercase tracking-widest">
                  Ver a estrutura completa
                </span>
                <span className="text-black font-black group-hover:translate-x-1 transition-transform duration-300">→</span>
              </div>
            </Link>
          </div>

          {/* CAROUSEL */}
          <div>
            <CTCarousel />
          </div>

        </div>
      </div>
    </section>
  );
}
