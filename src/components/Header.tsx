'use client';
import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative w-full z-50">
      {/* Faixa de LED - Estilo Tum Dum */}
      <div className="bg-yellow-500 py-1 overflow-hidden border-b border-black">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="text-black font-black italic uppercase text-[10px] px-4 tracking-widest">
            O ACESSO É QUESTÃO DE HONRA • RUMO À SÉRIE A 2026 • O RUGIDO DO TIGRE • FELIPE MAKARIOS: CRIADOR • 
          </span>
          <span className="text-black font-black italic uppercase text-[10px] px-4 tracking-widest">
            O ACESSO É QUESTÃO DE HONRA • RUMO À SÉRIE A 2026 • O RUGIDO DO TIGRE • FELIPE MAKARIOS: CRIADOR • 
          </span>
        </div>
      </div>

      {/* Header Invisível/Vazado para compor com o fundo da Home */}
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex flex-col">
          <span className="text-white text-3xl font-black italic leading-none tracking-tighter">
            O <span className="text-yellow-500">NOVORIZONTINO</span>
          </span>
        </Link>

        <div className="text-right">
          <p className="text-yellow-500 font-black italic text-sm leading-none uppercase">Felipe Makarios</p>
          <p className="text-zinc-500 font-bold text-[8px] uppercase tracking-widest mt-1">Founder & Developer</p>
        </div>
      </div>
    </header>
  );
}