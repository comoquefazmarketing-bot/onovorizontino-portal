'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PostagensGrid() {
  const postagens = [
    {
      id: 'd1d0971b',
      titulo: 'GUIA DO JOGO: NOVORIZONTINO X LONDRINA',
      slug: 'pre-jogo-novorizontino-x-londrina-serie-b-2026',
      categoria: 'Pré-Jogo',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Novorizontino%20x%20Londrina.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9Ob3Zvcml6b250aW5vIHggTG9uZHJpbmEucG5nIiwiaWF0IjoxNzc0MTQ2MzgwLCJleHAiOjE4MDU2ODIzODB9.g0fC63gO5E6vJpShAbTgnN_BxqBoGrjPCCks_F6AdNs'
    },
    {
      id: '9e74dda1',
      titulo: 'O ACESSO É QUESTÃO DE HONRA: REPARAÇÃO HISTÓRICA 2026',
      slug: 'o-acesso-e-questao-de-honra-2026',
      categoria: 'Destaque',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/destaque-honra.webp.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9kZXN0YXF1ZS1ob25yYS53ZWJwLnBuZyIsImlhdCI6MTc3NDE0NjM2NCwiZXhwIjoxODA1NjgyMzY0fQ.KuGvgD_8ITeZv4dQniaTO9yRek6WIZXlaPJJaAQmBWk'
    },
    {
      id: 'f6af5f16',
      titulo: 'O Tabuleiro de Enderson Moreira: Esquema 2026',
      slug: 'o-tabuleiro-de-enderson-moreira-2026',
      categoria: 'Análise Tática',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Enderson%20Moreira.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9FbmRlcnNvbiBNb3JlaXJhLndlYnAiLCJpYXQiOjE3NzQxNDYzNzIsImV4cCI6MTgwNTY4MjM3Mn0.lmSr3c20d5ypwtK3a2Tj6WFcrIan0Domoy6JXrMtw6M'
    },
    {
      id: 'c185a57a',
      titulo: 'A ARMADURA DE 2026: CONHEÇA OS GUERREIROS DO TIGRE',
      slug: 'os-escolhidos-reforcos-tigre-2026',
      categoria: 'Elenco',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/reforcos.webp.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9yZWZvcmNvcy53ZWJwLndlYnAiLCJpYXQiOjE3NzQxMjY0NDIsImV4cCI6MTgwNTY2MjQ0Mn0.dUxEHfrMjNJiFvlRdkwi3-8K6NTfwHjP9mqEtGJG-YM'
    }
  ];

  return (
    <section className="relative z-20 w-full bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10 border-l-8 border-yellow-500 pl-6">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Postagens</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postagens.map((post, index) => (
            <Link 
              key={post.id} 
              href={`/noticias/${post.slug}`}
              className={`relative group cursor-pointer border border-white/10 bg-zinc-900 overflow-hidden ${index === 0 ? 'md:col-span-2 h-[500px]' : 'h-[350px]'}`}
            >
              <Image 
                src={post.imagem} 
                alt={post.titulo} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" 
                unoptimized 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <div className="absolute bottom-0 p-6 z-20">
                <span className="bg-yellow-500 text-black px-2 py-0.5 font-black text-[10px] uppercase mb-2 inline-block italic">{post.categoria}</span>
                <h3 className={`${index === 0 ? 'text-4xl' : 'text-xl'} font-black uppercase italic leading-none text-white group-hover:text-yellow-500 transition-colors`}>
                  {post.titulo}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}