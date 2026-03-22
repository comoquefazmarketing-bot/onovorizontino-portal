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
    <div className="w-full bg-[#0a0a0a] rounded-2xl md:rounded-3xl overflow-hidden border border-white/5 shadow-2xl mt-4 md:mt-0">
      {/* Imagem Principal - Ajustada para manter proporção em telas pequenas */}
      <div className="relative aspect-[4/3] md:aspect-video w-full bg-[#111]">
        <img 
          key={active}
          src={`${localPath}${photos[active].name}`} 
          className="w-full h-full object-cover transition-opacity duration-300"
          alt={photos[active].title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col justify-end p-4 md:p-6">
          <h2 className="text-white text-lg md:text-3xl font-black uppercase italic leading-tight drop-shadow-2xl">
            {photos[active].title}
          </h2>
          <p className="text-gray-400 text-[8px] md:text-[9px] mt-1 md:mt-2 uppercase tracking-[0.2em] font-bold">
            Fotos: @rainiermoura / Novorizontino
          </p>
        </div>
      </div>

      {/* Miniaturas - Scroll horizontal suave para o dedo no celular */}
      <div className="p-2 md:p-3 bg-[#0a0a0a] flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 snap-x snap-mandatory">
        {photos.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`relative flex-shrink-0 w-24 md:w-[90px] h-16 md:h-[60px] rounded-lg md:rounded-xl overflow-hidden border-2 transition-all snap-start ${
              active === i ? 'border-yellow-500 scale-95 z-10' : 'border-transparent opacity-40 hover:opacity-100'
            }`}
          >
            <img src={`${localPath}${img.name}`} className="w-full h-full object-cover" alt="Mini" />
          </button>
        ))}
      </div>
    </div>
  );
}