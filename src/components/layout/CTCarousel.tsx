'use client';
import { useState } from 'react';

export default function CTCarousel() {
  const supabaseUrl = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/";
  
  const photos = [
    { url: supabaseUrl + "CT1.jpg", title: "Fachada Principal" },
    { url: supabaseUrl + "CT2.jpg", title: "Campos de Treino" },
    { url: supabaseUrl + "CT3.jpg", title: "Centro de Excelência" },
    { url: supabaseUrl + "CT4.jpg", title: "Academia Moderna" },
    { url: supabaseUrl + "CT5.jpg", title: "Concentração" },
    { url: supabaseUrl + "CT6.jpg", title: "Vestiários" },
    { url: supabaseUrl + "CT7.jpg", title: "Categorias de Base" },
    { url: supabaseUrl + "CT8.jpg", title: "Depto Médico" },
    { url: supabaseUrl + "CT9.jpg", title: "Visão Geral" }
  ];

  const [active, setActive] = useState(0);

  return (
    <div className="w-full bg-[#0a0a0a] rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
      {/* Imagem Principal */}
      <div className="relative h-[300px] md:h-[500px] w-full">
        <img 
          src={photos[active].url} 
          className="w-full h-full object-cover transition-opacity duration-500"
          alt="CT"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
          <h2 className="text-white text-xl md:text-3xl font-black uppercase italic italic">{photos[active].title}</h2>
          <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest">Fotos: @rainiermoura / Novorizontino</p>
        </div>
      </div>

      {/* Miniaturas */}
      <div className="p-2 bg-[#111] flex gap-2 overflow-x-auto no-scrollbar">
        {photos.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={elative min-w-[80px] h-[50px] rounded-lg overflow-hidden border-2 transition-all \}
          >
            <img src={img.url} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}