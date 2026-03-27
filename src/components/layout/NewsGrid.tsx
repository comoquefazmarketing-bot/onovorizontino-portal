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
    .limit(7);

  if (!postagens || postagens.length === 0) return null;

  const [destaque, ...resto] = postagens;
  const medios = resto.slice(0, 2);
  const pequenos = resto.slice(2, 5);

  return (
    <section className="w-full bg-black py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-1 h-8 bg-yellow-500" />
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Postagens</h2>
        </div>

        {/* LINHA 1: Destaque grande + 2 médios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Card Destaque — ocupa 2 colunas */}
          <Link
            href={`/noticias/${destaque.slug}`}
            className="md:col-span-2 group relative overflow-hidden bg-zinc-900 block"
            style={{ minHeight: '420px' }}
          >
            <Image
              src={destaque.imagem_capa || '/jorjao.webp'}
              alt={destaque.titulo}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ opacity: 0.75 }}
              unoptimized
            />
            {/* Gradiente */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            {/* Barra amarela lateral */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
            <div className="absolute bottom-0 left-0 p-6 pr-8">
              <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-0.5 uppercase tracking-widest mb-3 inline-block">
                {destaque.categoria || 'TIGRE'}
              </span>
              <h3 className="text-white text-2xl md:text-4xl font-black uppercase italic leading-none group-hover:text-yellow-400 transition-colors">
                {destaque.titulo}
              </h3>
            </div>
          </Link>

          {/* 2 cards médios empilhados */}
          <div className="flex flex-col gap-4">
            {medios.map((post) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="group relative overflow-hidden bg-zinc-900 flex-1 block"
                style={{ minHeight: '200px' }}
              >
                <Image
                  src={post.imagem_capa || '/jorjao.webp'}
                  alt={post.titulo}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ opacity: 0.7 }}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 uppercase tracking-widest mb-2 inline-block">
                    {post.categoria || 'TIGRE'}
                  </span>
                  <h3 className="text-white text-sm font-black uppercase italic leading-tight group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {post.titulo}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* LINHA 2: 3 cards pequenos iguais */}
        {pequenos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {pequenos.map((post) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="group flex gap-3 bg-zinc-900/50 border border-zinc-800 hover:border-yellow-500/50 p-3 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden">
                  <Image
                    src={post.imagem_capa || '/jorjao.webp'}
                    alt={post.titulo}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                {/* Texto */}
                <div className="flex flex-col justify-center gap-1 min-w-0">
                  <span className="text-yellow-500 text-[8px] font-black uppercase tracking-widest">
                    {post.categoria || 'TIGRE'}
                  </span>
                  <h3 className="text-white text-xs font-black uppercase italic leading-tight group-hover:text-yellow-400 transition-colors line-clamp-3">
                    {post.titulo}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
