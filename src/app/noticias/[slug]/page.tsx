import React from 'react';
import { createClient } from '@supabase/supabase-js';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

const supabase = createClient(
  "https://whoglnpvqjbaczgnebbn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indob2dsbnB2cWpiYWN6Z25lYmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODA2MTksImV4cCI6MjA4OTM1NjYxOX0.4JMjKuE3G5aBIIP-VEa8qc9M6c1NMKiSe0ZfgjIXY_Y"
);

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data: noticia } = await supabase.from('postagens').select('*').eq('slug', slug).single();
  const { data: sugestoes } = await supabase.from('postagens').select('titulo, slug, categoria, imagem_capa').neq('slug', slug).limit(3);

  if (!noticia) return null;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <div className="h-[120px] md:h-[180px] w-full"></div>

      <article className="flex-grow max-w-5xl mx-auto px-4 pb-20 w-full relative">
        
        {/* BOTÃO FANTASMA: Quase invisível (opacity-20), brilha no hover (opacity-100) */}
        <div className="mb-10 sticky top-24 z-[999] transition-all duration-700">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 bg-black/60 backdrop-blur-sm border border-yellow-500/30 text-yellow-500/40 px-5 py-2 rounded-full font-black uppercase italic text-[10px] tracking-[0.2em] transition-all duration-500 opacity-30 hover:opacity-100 hover:text-yellow-500 hover:border-yellow-500 hover:bg-black hover:shadow-[0_0_30px_rgba(234,179,8,0.3)] group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para a Home
          </Link>
        </div>

        <header className="mb-14 border-b border-white/10 pb-12">
          <span className="bg-yellow-500 text-black px-2 py-1 font-black text-[10px] uppercase mb-4 inline-block italic">
            {noticia.categoria}
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter mb-8 text-white">
            {noticia.titulo}
          </h1>
          <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
            POR: FELIPE MAKARIOS • {new Date(noticia.criado_em).toLocaleDateString('pt-BR')}
          </div>
        </header>

        <div 
          className="prose prose-invert prose-yellow max-w-none prose-p:text-2xl prose-p:leading-relaxed mb-32"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }} 
        />

        <section className="pt-16 border-t-4 border-yellow-500 w-full">
          <h2 className="text-2xl font-black uppercase italic mb-10 border-l-4 border-yellow-500 pl-4">Leia Também</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {sugestoes?.map((item) => (
              <Link key={item.slug} href={`/noticias/${item.slug}`} className="group block">
                <div className="relative h-48 w-full overflow-hidden border border-white/10 mb-5 rounded-lg bg-zinc-900">
                  <Image 
                    src={item.imagem_capa} 
                    alt={item.titulo} 
                    fill 
                    unoptimized={true}
                    className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  />
                </div>
                <h3 className="text-lg font-bold uppercase italic leading-tight text-white group-hover:text-yellow-500 transition-colors">
                  {item.titulo}
                </h3>
              </Link>
            ))}
          </div>

          <div className="flex justify-center border-t border-white/10 pt-12">
            <Link 
              href="/" 
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-black uppercase italic text-sm hover:bg-yellow-500 transition-all shadow-[8px_8px_0px_rgba(234,179,8,1)] active:translate-y-1 active:shadow-none"
            >
              <ArrowLeft size={18} />
              Explorar Mais Notícias
            </Link>
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}