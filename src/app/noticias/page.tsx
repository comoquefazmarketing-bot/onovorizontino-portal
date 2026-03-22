import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://whoglnpvqjbaczgnebbn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indob2dsbnB2cWpiYWN6Z25lYmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3ODA2MTksImV4cCI6MjA4OTM1NjYxOX0.4JMjKuE3G5aBIIP-VEa8qc9M6c1NMKiSe0ZfgjIXY_Y"
);

export default async function NoticiasPage() {
  const { data: noticias } = await supabase.from('postagens').select('*').order('criado_em', { ascending: false });

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="h-[200px] w-full"></div>
      <div className="max-w-7xl mx-auto px-4 py-20 w-full">
        <h1 className="text-6xl font-black uppercase italic mb-12 border-l-8 border-yellow-500 pl-6">NotÃ­cias</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {noticias?.map((post) => (
            <Link key={post.slug} href={`/noticias/${post.slug}`} className="group border border-white/10 p-6 hover:bg-yellow-500 transition-all">
              <span className="text-yellow-500 group-hover:text-black font-bold text-xs uppercase mb-2 block">{post.categoria}</span>
              <h2 className="text-2xl font-black uppercase italic group-hover:text-black">{post.titulo}</h2>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
