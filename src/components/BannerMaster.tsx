'use client';
import React from 'react';
import Image from 'next/image';

export default function BannerMaster() {
  return (
    <section className="w-full bg-black pt-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-[10px] text-zinc-600 uppercase font-black italic mb-4 tracking-[0.3em]">
          PUBLICIDADE MASTER - 17 98803-1679
        </p>
        
        <div className="relative w-full h-[200px] md:h-[300px] border border-white/10 rounded-3xl overflow-hidden group">
          <Image 
            src="/banner_tigre.png" 
            alt="Anuncie"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent flex items-center p-12">
            <h3 className="text-6xl md:text-8xl font-black text-white italic uppercase leading-none">
              ANUNCIE<br/><span className="text-yellow-500">AQUI</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}