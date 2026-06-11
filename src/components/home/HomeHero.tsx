'use client';
import Link from 'next/link';

export default function HomeHero() {
  return (
    <section className="relative h-[35vh] md:h-[45vh] w-full flex flex-col items-center justify-center bg-black overflow-hidden border-b border-yellow-500/20">
      <div className="absolute inset-0 z-0">
        <img src="/jorjao.webp" className="w-full h-full object-cover opacity-60" alt="Estádio" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_50%,_black_90%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      </div>
      <div className="relative z-20 flex flex-col items-center w-full px-4">
        <Link href="/">
          <img 
            src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
            className="h-64 md:h-[450px] w-auto object-contain drop-shadow-[0_0_80px_rgba(255,215,0,0.5)] transition-transform hover:scale-105 duration-700" 
            alt="Logo"
          />
        </Link>
      </div>
    </section>
  );
}