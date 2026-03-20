'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    fetch('/api/noticias')
      .then(res => res.json())
      .then(data => { if(data && data.length > 0) setPost(data[0]); })
      .catch(err => console.error("Erro ao buscar capa:", err));
  }, []);

  if (!post) return <div className="w-full h-[70vh] bg-zinc-900 animate-pulse rounded-3xl" />;

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] overflow-hidden rounded-3xl bg-zinc-900 group shadow-2xl">
      <Image 
        src={post.url_imagem || 'https://placehold.co/1200x800/18181b/eab308?text=O+NOVORIZONTINO'}
        alt={post.titulo}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-60"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-3/4">
        <Link href={`/noticia/${post.slug}`}>
          <span className="inline-block bg-yellow-500 text-black font-black px-4 py-1 mb-4 text-xs uppercase tracking-widest rounded-sm">
            {post.tema || 'DESTAQUE'}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-none tracking-tighter mb-4 group-hover:text-yellow-400 transition-colors">
            {post.titulo}
          </h2>
          <div className="mt-6 flex items-center gap-4">
             <div className="h-[2px] w-12 bg-yellow-500"></div>
             <span className="text-yellow-500 font-bold uppercase text-xs tracking-widest">Ler Reportagem Completa</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
