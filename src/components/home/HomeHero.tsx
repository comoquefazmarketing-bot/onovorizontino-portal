'use client';
import React from 'react';
import Image from 'next/image';

export default function HomeHero() {
  return (
    <section className="relative w-full h-[70vh] overflow-hidden border-b-8 border-yellow-500 bg-black z-0">
      {/* Container da Imagem do Jorjão */}
      <div className="absolute inset-0">
        <Image 
          src="/jorjao.webp" 
          alt="Estádio Jorjão"
          fill
          className="object-cover object-center animate-fade-in"
          style={{ objectPosition: '50% 30%' }}
          priority
        />
        
        {/* --- EFEITO VINHETA PROFISSIONAL --- */}
        {/* Camada 1: Vinheta Radial Pesada (Bordas Escuras, Centro Claro) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_20%,_rgba(0,0,0,0.9)_90%)]"></div>
        
        {/* Camada 2: Gradiente de Fundo (para garantir leitura do rodapé) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
      </div>
    </section>
  );
}