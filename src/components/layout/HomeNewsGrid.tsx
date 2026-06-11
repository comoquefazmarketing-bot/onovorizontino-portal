'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeNewsGrid() {
  const postagens = [
    {
      id: 'tyger-001',
      titulo: 'O VÍCIO DO VICE: APATIA E CASTIGO NO JORJÃO',
      slug: 'estreia-serie-b-novorizontino-x-londrina',
      categoria: 'Crônica',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/vslondrina.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC92c2xvbmRyaW5hLndlYnAiLCJpYXQiOjE3NzQzNzU0MDcsImV4cCI6MTgwNTkxMTQwN30.mAQzfFxhIUfHbW-_RkNrddSovLpysfXeHe3V6x5SZtI'
    },
    {
      id: '9e74dda1',
      titulo: 'O ACESSO É QUESTÃO DE HONRA: REPARAÇÃO HISTÓRICA 2026',
      slug: 'o-acesso-e-questao-de-honra-2026',
      categoria: 'Destaque',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/destaque-honra.webp.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9kZXN0YXF1ZS1ob25yYS53ZWJwLnBuZyIsImlhdCI6MTc3NDExOTg2MywiZXhwIjoxODA1NjU1ODYzfQ.iXbmqbf-CIEqTCQkZh2KoDTWw8QJIT3wKvYJr9aUHyo'
    },
    {
      id: 'd1d0971b',
      titulo: 'GUIA DO JOGO: NOVORIZONTINO X LONDRINA',
      slug: 'pre-jogo-novorizontino-x-londrina-serie-b-2026',
      categoria: 'Pré-Jogo',
      imagem: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Novorizontino%20x%20Londrina.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9Ob3Zvcml6b250aW5vIHggTG9uZHJpbmEucG5nIiwiaWF0IjoxNzc0MTQ2MzgwLCJleHAiOjE4MDU2ODIzODB9.g0fC63gO5E6vJpShAbTgnN_BxqBoGrjPCCks_F6AdNs'
    }
  ];

  return (
    <section className="w-full bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postagens.map((post, index) => (
            <Link 
              key={post.id} 
              href={post.slug === 'estreia-serie-b-novorizontino-x-londrina' 
                ? `/${post.slug}` 
                : `/noticias/${post.slug}`}
              className={`relative group cursor-pointer border border-white/10 bg-zinc-900 overflow-hidden ${index === 0 ? 'md:col-span-2 h-[500px]' : 'h-[350px]'}`}
            >
              <Image 
                src={post.imagem} 
                alt={post.titulo} 
                fill 
                className="object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" 
                unoptimized 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
              <div className="absolute bottom-0 p-8 z-20">
                <span className="bg-yellow-500 text-black px-3 py-1 font-black text-[10px] uppercase mb-3 inline-block italic tracking-widest">
                  {post.categoria}
                </span>
                <h3 className={`${index === 0 ? 'text-4xl md:text-6xl' : 'text-2xl'} font-black uppercase italic leading-[0.9] text-white group-hover:text-yellow-500 transition-colors`}>
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
