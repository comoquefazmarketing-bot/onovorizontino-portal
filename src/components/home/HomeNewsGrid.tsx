'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AdBanner from '@/components/ads/AdBanner';

export default function NewsGrid() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetch('/api/noticias')
      .then(res => res.json())
      .then(data => { if(data && data.length > 1) setNews(data.slice(1)); })
      .catch(err => console.error("Erro ao buscar grid:", err));
  }, []);

  return (
    <section className="py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {news.map((item: any) => (
          <Link href={`/noticia/${item.slug}`} key={item.id} className="group flex flex-col gap-3">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-800">
              <Image 
                src={item.url_imagem} 
                alt={item.titulo} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>
            <h3 className="text-sm font-bold text-white leading-tight group-hover:text-yellow-500 transition-colors line-clamp-2 italic uppercase">
              {item.titulo}
            </h3>
          </Link>
        ))}
      </div>
      <AdBanner posicao="horizontal" index={0} />
    </section>
  );
}