'use client';
import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <nav className="absolute top-0 left-0 w-full h-screen pointer-events-none z-[150]">
      {/* Container que ocupa a área do Hero para centralizar o logo no estádio */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* LOGO: Centralização Cirúrgica com Scale para Imponência */}
        <div className="relative w-[900px] h-[400px] pointer-events-auto transform scale-[1.2] -translate-y-24">
          <Image 
            src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
            alt="Logo O Novorizontino" 
            fill 
            className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,1)]" 
            priority 
          />
        </div>

      </div>
    </nav>
  );
}