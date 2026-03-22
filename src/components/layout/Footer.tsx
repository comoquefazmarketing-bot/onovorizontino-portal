'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black border-t-4 border-yellow-500 pt-16 pb-8 px-6 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
        <div>
          <h3 className="text-yellow-500 font-black italic text-3xl uppercase leading-none">O Novorizontino</h3>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">A Voz do Tigre do Vale</p>
        </div>
        
        <div className="flex flex-col items-center">
          <p className="text-white font-black italic uppercase mb-4">Anuncie no Portal</p>
          <a 
            href="https://wa.me/5517988031679" 
            target="_blank"
            className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-4 rounded-full font-black flex items-center gap-3 transition-all transform hover:scale-105 shadow-lg"
          >
            <span>WHATSAPP: (17) 98803-1679</span>
          </a>
        </div>

        <div className="md:text-right">
          <p className="text-yellow-500 font-black italic text-lg uppercase leading-none">Felipe Makarios</p>
          <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest mt-1">Founder & Lead Developer</p>
          <p className="text-zinc-600 text-[8px] mt-4 uppercase tracking-tighter">© 2026 - Novo Horizonte, SP</p>
        </div>
      </div>
    </footer>
  );
}