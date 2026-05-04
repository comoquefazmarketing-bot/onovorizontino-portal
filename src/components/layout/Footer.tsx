'use client';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-yellow-500 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-start text-center md:text-left">
        <div>
          <h3 className="text-yellow-500 font-black italic text-3xl uppercase leading-none">O Novorizontino</h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">A Voz do Tigre do Vale</p>
          <p className="text-zinc-700 text-xs mt-4 leading-relaxed">
            Jornalismo digital independente dedicado ao Grêmio Novorizontino. Fundado em 2021.
            <br />CNPJ 43.945.464/0001-83
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mt-5">
            <Link href="/sobre" className="text-zinc-600 hover:text-yellow-500 text-[9px] font-black uppercase tracking-widest transition-colors">
              Sobre
            </Link>
            <Link href="/expediente-portal-o-novorizontino" className="text-zinc-600 hover:text-yellow-500 text-[9px] font-black uppercase tracking-widest transition-colors">
              Expediente
            </Link>
            <Link href="/politica-de-privacidade" className="text-zinc-600 hover:text-yellow-500 text-[9px] font-black uppercase tracking-widest transition-colors">
              Privacidade
            </Link>
            <Link href="/termos-de-uso" className="text-zinc-600 hover:text-yellow-500 text-[9px] font-black uppercase tracking-widest transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-white font-black italic uppercase mb-4">Anuncie no Portal</p>
          <a
            href="https://wa.me/5517988031679"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-black flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg"
          >
            <span>WHATSAPP: (17) 98803-1679</span>
          </a>
          <a href="mailto:comoquefazmarketing@gmail.com" className="text-zinc-600 hover:text-yellow-500 text-[9px] font-black uppercase tracking-widest mt-4 transition-colors">
            comoquefazmarketing@gmail.com
          </a>
        </div>

        <div className="md:text-right">
          <p className="text-yellow-500 font-black italic text-lg uppercase leading-none">Felipe Makarios</p>
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">Founder & Lead Developer</p>
          <p className="text-zinc-600 text-[8px] mt-4 uppercase tracking-tighter">© {new Date().getFullYear()} Portal O Novorizontino</p>
          <p className="text-zinc-700 text-[8px] uppercase tracking-tighter mt-1">Novo Horizonte, SP — Brasil</p>
        </div>
      </div>
    </footer>
  );
}
