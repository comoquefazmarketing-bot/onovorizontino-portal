'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdBanner from '@/components/ads/AdBanner';

export default function NewsGrid() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Certifique-se que esta API está a selecionar da tabela 'postagens'
    fetch('/api/noticias')
      .then(res => res.json())
      .then(data => { 
        if(data && Array.isArray(data)) {
          // Mantive o slice(1) partindo do princípio que a primeira 
          // notícia já aparece no destaque principal (Hero) da sua página.
          setNews(data.slice(1)); 
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao buscar grid de postagens:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="py-20 text-center">
      <div className="inline-block animate-pulse text-[#F5C400] font-black italic">
        CARREGANDO CONTEÚDO...
      </div>
    </div>
  );

  return (
    <section className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {news.map((item: any) => (
          /* IMPORTANTE: Verifique se a sua pasta de destino é 
             /src/app/noticias/[slug] (plural). Se for, o link abaixo está correto.
          */
          <Link href={`/noticias/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900 border border-white/5">
              <Image 
                /* CORREÇÃO: Usando 'imagem_url' que é o campo real da sua tabela */
                src={item.imagem_url || 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png'} 
                alt={item.titulo} 
                fill 
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-[#F5C400] transition-colors line-clamp-3 italic uppercase">
              {item.titulo}
            </h3>
          </Link>
        ))}
      </div>
      
      {/* Banner de publicidade abaixo do grid */}
      <AdBanner posicao="horizontal" index={0} />
    </section>
  );
}
