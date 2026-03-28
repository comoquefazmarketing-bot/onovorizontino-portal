import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export default async function PostagensGrid() {
  const supabase = await createClient();

  const { data: postagens } = await supabase
    .from('postagens')
    .select('id, titulo, slug, categoria, imagem_capa')
    .eq('status', 'published')
    .order('criado_em', { ascending: false })
    .limit(6);

  if (!postagens || postagens.length === 0) return null;

  return (
    <section className="relative z-20 w-full bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-10 border-l-8 border-yellow-500 pl-6">
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Postagens</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postagens.map((post, index) => (
            <Link
              key={post.id}
              href={`/noticias/${post.slug}`}
              data-track="noticia_click"
              data-track-label={post.titulo}
              className={`relative group cursor-pointer border border-white/10 bg-zinc-900 overflow-hidden ${index === 0 ? 'md:col-span-2 h-[500px]' : 'h-[350px]'}`}
            >
              <Image
                src={post.imagem_capa || '/jorjao.webp'}
                alt={post.titulo}
                fill
                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
              <div className="absolute bottom-0 p-6 z-20">
                <span className="bg-yellow-500 text-black px-2 py-0.5 font-black text-[10px] uppercase mb-2 inline-block italic">
                  {post.categoria}
                </span>
                <h3 className={`${index === 0 ? 'text-4xl' : 'text-xl'} font-black uppercase italic leading-none text-white group-hover:text-yellow-500 transition-colors`}>
                  {post.titulo}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
