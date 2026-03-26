import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Este é o array com os dados que você enviou (resumido para o componente)
const noticiasPortal = [
  {
    id: "80ea7d24-77df-487c-995a-c0ccef28b5e3",
    titulo: "O Vício do Vice: Novorizontino estreia na Série B com apatia e castigo no Jorjão",
    slug: "estreia-serie-b-novorizontino-x-londrina-2026",
    categoria: "Crônica",
    imagem_capa: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/vslondrina.webp"
  },
  {
    id: "9e74dda1-ec00-4746-9048-4f83cf5bd03c",
    titulo: "O ACESSO É QUESTÃO DE HONRA: REPARAÇÃO HISTÓRICA 2026",
    slug: "o-acesso-e-questao-de-honra-2026",
    categoria: "Destaque",
    imagem_capa: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/destaque-honra.webp.png"
  },
  {
    id: "c185a57a-8714-4660-8890-b67958bdd1a6",
    titulo: "A ARMADURA DE 2026: CONHEÇA OS GUERREIROS DO TIGRE PARA O ACESSO",
    slug: "os-escolhidos-reforcos-tigre-2026",
    categoria: "Notícias",
    imagem_capa: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/reforcos.webp.webp"
  },
  {
    id: "d1d0971b-1ded-48f3-b93c-4f40bbfbe4f4",
    titulo: "GUIA DO JOGO: Novorizontino x Londrina - A Estreia na Série B 2026",
    slug: "pre-jogo-novorizontino-x-londrina-serie-b-2026",
    categoria: "Pré-Jogo",
    imagem_capa: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Novorizontino%20x%20Londrina.png"
  },
  {
    id: "f6af5f16-ab5d-46d6-aeb1-780b0b0fa907",
    titulo: "O Tabuleiro de Enderson Moreira: Como os novos reforços se encaixam no esquema 2026",
    slug: "o-tabuleiro-de-enderson-moreira-2026",
    categoria: "Análise Tática",
    imagem_capa: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Enderson%20Moreira.webp"
  }
];

export default function PostagensGrid() {
  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-8 w-1 bg-yellow-500"></div>
          <h2 className="text-white font-display text-3xl tracking-tighter italic uppercase">
            Plantão do Tigre
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticiasPortal.map((noticia) => (
            <Link 
              href={`/noticia/${noticia.slug}`} 
              key={noticia.id}
              className="group bg-zinc-900/40 border border-zinc-800 rounded-lg overflow-hidden hover:border-yellow-500/50 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image 
                  src={noticia.imagem_capa} 
                  alt={noticia.titulo}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">
                  {noticia.categoria}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-yellow-500 transition-colors line-clamp-2 uppercase italic">
                  {noticia.titulo}
                </h3>
                <div className="mt-4 flex items-center justify-between text-zinc-500 text-[10px] font-bold tracking-widest uppercase">
                  <span>Portal O Novorizontino</span>
                  <span className="group-hover:translate-x-1 transition-transform">Ler +</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
