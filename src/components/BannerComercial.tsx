'use client';
import Image from 'next/image';

export default function BannerComercial() {
  const whatsappLink = "https://wa.me/5517988031679?text=Olá Felipe, quero anunciar no portal O Novorizontino";
  const imgUrl = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Anuncie%20aqui.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9BbnVuY2llIGFxdWkucG5nIiwiaWF0IjoxNzc0MTMwNDQyLCJleHAiOjE4MDU2NjY0NDJ9.SUdfqRzeLHFu3yEE2YQuYDQnU73P_IpCjkJtVxXBM9M";

  return (
    <section className="w-full bg-black py-16 border-y border-zinc-800 my-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Rótulo fixo do Departamento Comercial */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-4 bg-yellow-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
            Espaço Publicitário • Comercial
          </span>
        </div>

        {/* O Banner 'Quebra-Mar' Estilo GE */}
        <a 
          href={whatsappLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative block w-full aspect-[3/1] md:aspect-[5/1] overflow-hidden rounded-2xl border border-zinc-700 group"
        >
          <Image 
            src={imgUrl} 
            alt="Anuncie Aqui"
            fill
            className="object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          />
          
          {/* Efeito Brilho Tum Dum */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </a>
        
        <p className="text-center text-zinc-600 text-[10px] mt-4 italic">
          Felipe Makarios • Gestão de Parcerias e Publicidade
        </p>
      </div>
    </section>
  );
}
