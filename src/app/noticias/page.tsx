import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notícias do Grêmio Novorizontino | Série B 2026',
  description: 'Todas as notícias do Grêmio Novorizontino. Cobertura completa da Série B 2026, mercado da bola, análises táticas e muito mais.',
};

const CATEGORIAS = ['Todas', 'Copa Sul-Sudeste', 'Mercado', 'Crônica', 'Análise Tática', 'Pré-Jogo', 'Destaque'];

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('postagens')
    .select('id, titulo, slug, categoria, imagem_capa, criado_em, resumo_ia, autor_ia')
    .eq('status', 'published')
    .order('criado_em', { ascending: false })
    .limit(30);

  if (categoria && categoria !== 'Todas') {
    query = query.eq('categoria', categoria);
  }

  const { data: postagens } = await query;

  return (
    <main className="min-h-screen bg-black text-white pb-24">

      {/* Header da página */}
      <div className="border-b border-zinc-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
            Portal O Novorizontino
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-tighter text-white">
            RADAR <span className="text-yellow-500">TIGRE</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm">
            Cobertura completa do Grêmio Novorizontino — Série B 2026
          </p>
        </div>
      </div>

      {/* Filtro por categoria */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur border-b border-zinc-900 py-3 px-4">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIAS.map((cat) => {
            const ativo = (!categoria && cat === 'Todas') || categoria === cat;
            return (
              <Link
                key={cat}
                href={cat === 'Todas' ? '/noticias' : `/noticias?categoria=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                  ativo
                    ? 'bg-yellow-500 text-black'
                    : 'border border-zinc-700 text-zinc-400 hover:border-yellow-500 hover:text-yellow-500'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid de notícias */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        {!postagens || postagens.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <p className="text-2xl font-black uppercase italic">Nenhuma matéria encontrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postagens.map((post, index) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="group flex flex-col bg-zinc-900/50 border border-zinc-800 hover:border-yellow-500/50 transition-all overflow-hidden"
              >
                {/* Imagem */}
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.imagem_capa || '/jorjao.webp'}
                    alt={post.titulo}
                    fill
                    loading={index < 6 ? 'eager' : 'lazy'}
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 uppercase tracking-widest">
                      {post.categoria || 'TIGRE'}
                    </span>
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h2 className="text-white font-black uppercase italic text-base leading-tight group-hover:text-yellow-400 transition-colors line-clamp-3">
                    {post.titulo}
                  </h2>
                  {post.resumo_ia && (
                    <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2">
                      {post.resumo_ia}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-zinc-800">
                    <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
                      {new Date(post.criado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    {post.autor_ia && (
                      <>
                        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
                        <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest">
                          {post.autor_ia}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Voltar */}
      <div className="max-w-7xl mx-auto px-4 mt-16 flex justify-center">
        <Link
          href="/"
          className="text-zinc-500 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors"
        >
          ← Voltar para a Home
        </Link>
      </div>

    </main>
  );
}
