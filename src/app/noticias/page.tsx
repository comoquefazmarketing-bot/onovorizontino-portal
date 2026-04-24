import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

export const revalidate = 60; // Cache de 1 minuto para performance

export const metadata: Metadata = {
  title: 'Notícias do Grêmio Novorizontino | Série B 2026',
  description: 'Todas as notícias do Grêmio Novorizontino. Cobertura completa da Série B 2026, mercado da bola e muito mais.',
};

const CATEGORIAS = ['Todas', 'Copa Sul-Sudeste', 'Mercado', 'Crônica', 'Análise Tática', 'Pré-Jogo', 'Destaque'];

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;
  const supabase = await createClient();

  // Query robusta buscando todos os campos necessários
  let query = supabase
    .from('postagens')
    .select('id, titulo, slug, categoria, imagem_capa, criado_em, resumo_ia, autor_ia, conteudo')
    .eq('status', 'published')
    .order('criado_em', { ascending: false })
    .limit(30);

  if (categoria && categoria !== 'Todas') {
    query = query.eq('categoria', categoria);
  }

  const { data: postagens } = await query;

  return (
    <main className="min-h-screen bg-black text-white pb-24 selection:bg-yellow-500">
      
      {/* Cabeçalho */}
      <div className="border-b border-zinc-900 py-16 px-4 bg-gradient-to-b from-yellow-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Portal O Novorizontino
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter">
            RADAR <span className="text-yellow-500">TIGRE</span>
          </h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-zinc-800 py-4 px-4">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
          {CATEGORIAS.map((cat) => {
            const ativo = (!categoria && cat === 'Todas') || categoria === cat;
            return (
              <Link
                key={cat}
                href={cat === 'Todas' ? '/noticias' : `/noticias?categoria=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-full border ${
                  ativo
                    ? 'bg-yellow-500 border-yellow-500 text-black'
                    : 'border-zinc-800 text-zinc-500 hover:border-yellow-500 hover:text-yellow-500'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Listagem */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        {!postagens || postagens.length === 0 ? (
          <div className="text-center py-32 opacity-20">
            <p className="text-2xl font-black uppercase italic">Nenhuma matéria encontrada</p>
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
                      {new Date(post.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-yellow-500/50 group-hover:text-yellow-500 transition-colors text-xs font-black">LEIA MAIS +</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
