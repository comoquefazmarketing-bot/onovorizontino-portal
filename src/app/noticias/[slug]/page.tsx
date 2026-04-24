import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import type { Metadata } from 'next';

// Força a atualização dos dados a cada 30 segundos
export const revalidate = 30;

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

  // Selecionando todos os campos necessários, incluindo imagem_capa e o status correto
  let query = supabase
    .from('postagens')
    .select('id, titulo, slug, categoria, imagem_capa, criado_em, resumo_ia, autor_ia, conteudo')
    .eq('status', 'published')
    .order('criado_em', { ascending: false })
    .limit(40);

  if (categoria && categoria !== 'Todas') {
    query = query.eq('categoria', categoria);
  }

  const { data: postagens } = await query;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24 selection:bg-yellow-500 selection:text-black">

      {/* Header da página */}
      <div className="border-b border-zinc-900/50 py-16 px-4 bg-gradient-to-b from-zinc-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <span className="text-[#F5C400] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">
            Portal O Novorizontino
          </span>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.8] tracking-tighter text-white">
            RADAR <span className="text-[#F5C400]">TIGRE</span>
          </h1>
          <p className="text-zinc-500 mt-6 text-sm font-medium uppercase tracking-widest">
            Cobertura completa do Grêmio Novorizontino — Temporada 2026
          </p>
        </div>
      </div>

      {/* Filtro por categoria */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 py-4 px-4">
        <div className="max-w-7xl mx-auto flex gap-3 overflow-x-auto no-scrollbar">
          {CATEGORIAS.map((cat) => {
            const ativo = (!categoria && cat === 'Todas') || categoria === cat;
            return (
              <Link
                key={cat}
                href={cat === 'Todas' ? '/noticias' : `/noticias?categoria=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-full border ${
                  ativo
                    ? 'bg-[#F5C400] border-[#F5C400] text-black shadow-[0_0_20px_rgba(245,196,0,0.2)]'
                    : 'border-white/10 text-zinc-500 hover:border-[#F5C400]/50 hover:text-[#F5C400]'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid de notícias */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        {!postagens || postagens.length === 0 ? (
          <div className="text-center py-32 border border-white/5 rounded-3xl bg-zinc-900/20">
            <p className="text-zinc-600 text-xl font-black uppercase italic tracking-tighter">
              O Tigre está se preparando... <br/>
              <span className="text-sm font-normal not-italic tracking-normal">Nenhuma matéria encontrada nesta categoria.</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {postagens.map((post, index) => (
              <Link
                key={post.id}
                href={`/noticias/${post.slug}`}
                className="group flex flex-col bg-zinc-900/30 border border-white/5 hover:border-[#F5C400]/30 transition-all duration-500 overflow-hidden rounded-2xl"
              >
                {/* Imagem com Overlay */}
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
                  <Image
                    src={post.imagem_capa || 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png'}
                    alt={post.titulo}
                    fill
                    loading={index < 6 ? 'eager' : 'lazy'}
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-[#F5C400] text-black text-[9px] font-black px-3 py-1 uppercase tracking-tighter italic">
                      {post.categoria || 'TIGRE'}
                    </span>
                  </div>
                </div>

                {/* Conteúdo do Card */}
                <div className="p-6 flex flex-col gap-3 flex-1">
                  <h2 className="text-white font-black uppercase italic text-lg md:text-xl leading-[1.1] group-hover:text-[#F5C400] transition-colors line-clamp-3 tracking-tighter">
                    {post.titulo}
                  </h2>
                  
                  {post.resumo_ia && (
                    <p className="text-zinc-500 text-sm leading-relaxed line-clamp-2 font-medium">
                      {post.resumo_ia}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-auto pt-5 border-t border-white/5">
                    <div className="flex flex-col">
                       <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        {new Date(post.criado_em).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'long',
                        })}
                      </span>
                      <span className="text-zinc-600 text-[9px] font-bold uppercase">
                        POR {post.autor_ia || 'REDAÇÃO'}
                      </span>
                    </div>
                    <div className="ml-auto w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#F5C400] group-hover:border-[#F5C400] transition-all duration-300">
                      <span className="text-white group-hover:text-black text-xs">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer/Navegação */}
      <div className="max-w-7xl mx-auto px-4 mt-20 flex justify-center">
        <Link
          href="/"
          className="group flex items-center gap-3 text-zinc-500 hover:text-[#F5C400] text-[10px] font-black uppercase tracking-[0.3em] transition-all"
        >
          <span className="transition-transform group-hover:-translate-x-2">←</span>
          VOLTAR PARA O INÍCIO
        </Link>
      </div>

    </main>
  );
}
