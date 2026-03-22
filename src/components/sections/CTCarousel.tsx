'use client';
import { useState } from 'react';

export default function CTCarousel() {
  const localPath = "/assets/images/";
  
  const photos = [
    { name: "CT9.jpg", title: "FACHADA" },
    { name: "CT1.jpg", title: "PLACA HOMENAGEM" },
    { name: "CT2.jpg", title: "CAMPOS DE TREINO" },
    { name: "CT3.jpg", title: "PISCINA" },
    { name: "CT4.jpg", title: "ACADEMIA MODERNA" },
    { name: "CT5.jpg", title: "CAMPOS PADRÃO FIFA" },
    { name: "CT6.jpg", title: "VESTIÁRIOS" },
    { name: "CT7.jpg", title: "CENTRO DE EXCELÊNCIA" },
    { name: "CT8.jpg", title: "PORTARIA" }
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="w-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      <div className="relative aspect-video w-full bg-[#111]">
        <img 
          key={active}
          src={`${localPath}${photos[active].name}`} 
          className="w-full h-full object-cover transition-opacity duration-500"
          alt={photos[active].title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
          <h2 className="text-white text-xl md:text-3xl font-black uppercase italic leading-none drop-shadow-xl tracking-tighter">
            {photos[active].title}
          </h2>
          <p className="text-gray-400 text-[9px] mt-2 uppercase tracking-[0.2em] font-bold">
            Fotos: @rainiermoura / Grêmio Novorizontino
          </p>
        </div>
      </div>

      <div className="p-3 bg-[#0a0a0a] flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5">
        {photos.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative min-w-[90px] h-[60px] rounded-xl overflow-hidden border-2 transition-all ${
              active === i ? 'border-yellow-500 scale-105 z-10 shadow-lg shadow-yellow-500/20' : 'border-transparent opacity-30 hover:opacity-100'
            }`}
          >
            <img src={`${localPath}${img.name}`} className="w-full h-full object-cover" alt="Mini" />
          </button>
        ))}
      </div>
    </div>
  );
}