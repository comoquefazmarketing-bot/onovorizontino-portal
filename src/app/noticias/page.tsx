// src/app/noticias/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import BuscaNoticia from '@/components/portal/BuscaNoticia';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Notícias do Grêmio Novorizontino | Série B 2026',
  description: 'Todas as notícias do Grêmio Novorizontino. Cobertura completa da Série B 2026.',
};

const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const CATEGORIAS = ['Todas', 'Copa Sul-Sudeste', 'Mercado', 'Crônica', 'Análise Tática', 'Pré-Jogo', 'Destaque', 'Resultados', 'Análises', 'Opinião'];

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>;
}) {
  const { categoria, q } = await searchParams;
  const query = q?.trim() ?? '';

  let url = `${SUPA_URL}/rest/v1/postagens?select=id,titulo,slug,categoria,imagem_capa,criado_em,resumo_ia,autor_ia&order=criado_em.desc&limit=40`;

  if (categoria && categoria !== 'Todas') {
    url += `&categoria=eq.${encodeURIComponent(categoria)}`;
  }

  if (query) {
    url += `&titulo=ilike.${encodeURIComponent(`*${query}*`)}`;
  }

  let postagens: any[] = [];
  try {
    const res = await fetch(url, {
      headers: {
        apikey:        SUPA_ANON,
        Authorization: `Bearer ${SUPA_ANON}`,
      },
      cache: 'no-store',
    });
    const data = await res.json();
    postagens = Array.isArray(data) ? data : [];
  } catch {
    postagens = [];
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24 selection:bg-yellow-500">

      {/* Cabeçalho */}
      <div className="border-b border-zinc-900 py-16 px-4 bg-gradient-to-b from-yellow-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-6 transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Voltar ao início
          </Link>
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Portal O Novorizontino
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter">
            RADAR <span className="text-yellow-500">TIGRE</span>
          </h1>
          <p className="text-zinc-500 mt-4 text-sm font-medium uppercase tracking-widest">
            Temporada 2026 · {postagens.length} matéria{postagens.length !== 1 ? 's' : ''}
            {query && <> · busca: "<span className="text-yellow-500">{query}</span>"</>}
          </p>
        </div>
      </div>

      {/* Filtros + busca */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {/* Categorias — scroll horizontal */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar flex-1 min-w-0">
            {CATEGORIAS.map((cat) => {
              const ativo = (!categoria && cat === 'Todas') || categoria === cat;
              const href = cat === 'Todas'
                ? (query ? `/noticias?q=${encodeURIComponent(query)}` : '/noticias')
                : `/noticias?categoria=${encodeURIComponent(cat)}${query ? `&q=${encodeURIComponent(query)}` : ''}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`flex-shrink-0 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full border ${
                    ativo
                      ? 'bg-yellow-500 border-yellow-500 text-black shadow-[0_0_16px_rgba(245,196,0,0.25)]'
                      : 'border-zinc-800 text-zinc-500 hover:border-yellow-500 hover:text-yellow-500'
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {/* Campo de busca */}
          <div className="flex-shrink-0">
            <Suspense fallback={
              <div className="h-9 w-48 rounded-full border border-white/10 bg-white/5 animate-pulse" />
            }>
              <BuscaNoticia />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        {postagens.length === 0 ? (
          <div className="text-center py-32 opacity-20">
            <p className="text-2xl font-black uppercase italic">
              {query ? `Nenhum resultado para "${query}"` : 'Nenhuma matéria encontrada'}
            </p>
            {query && (
              <Link href="/noticias" className="mt-4 inline-block text-xs text-yellow-500 font-bold uppercase tracking-widest hover:underline">
                Limpar busca
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postagens.map((post, index) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="group flex flex-col bg-zinc-900/20 border border-zinc-800/50 hover:border-yellow-500/50 transition-all duration-500 rounded-2xl overflow-hidden"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={post.imagem_capa || '/jorjao.webp'}
                    alt={post.titulo}
                    fill
                    loading={index < 6 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[50%] group-hover:grayscale-0"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-black text-[9px] font-black px-2 py-1 uppercase italic">
                      {post.categoria || 'TIGRE'}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4 flex-1">
                  <h2 className="text-white font-black uppercase italic text-xl leading-tight group-hover:text-yellow-500 transition-colors line-clamp-3">
                    {post.titulo}
                  </h2>

                  {post.resumo_ia && (
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2">
                      {post.resumo_ia}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-zinc-800/50">
                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                      {new Date(post.criado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo',
                      })}
                    </span>
                    <span className="text-yellow-500/50 group-hover:text-yellow-500 transition-colors text-xs font-black">
                      LEIA MAIS +
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Botão voltar home */}
        <div className="mt-20 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-3 text-zinc-500 hover:text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] transition-all group"
          >
            <span className="transition-transform group-hover:-translate-x-2">←</span>
            VOLTAR PARA O INÍCIO
          </Link>
        </div>
      </div>
    </main>
  );
}
