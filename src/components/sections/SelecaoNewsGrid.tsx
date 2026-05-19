'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

/* ─── Tipo mínimo para o card ─── */
interface PostagemCard {
  id: string;
  titulo: string;
  slug: string;
  resumo_ia: string | null;
  categoria: string | null;
  criado_em: string;
}

/* ─── Paleta rotativa verde · amarelo · azul ─── */
const PALETA = ['#009c3b', '#ffdf00', '#002776'];

/* ─── Tempo relativo ─── */
function tempoRelativo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Agora mesmo';
  if (h < 24) return `Há ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Há 1 dia' : `Há ${d} dias`;
}

/* ─── Skeleton ─── */
function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden border border-white/8 animate-pulse"
      style={{ background: 'rgba(0,15,8,0.9)' }}
    >
      <div className="h-1.5 bg-white/10" />
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-5 w-24 bg-white/10 rounded-full" />
          <div className="h-4 w-14 bg-white/5 rounded" />
        </div>
        <div className="h-4 bg-white/10 rounded w-full" />
        <div className="h-4 bg-white/10 rounded w-4/5" />
        <div className="h-3 bg-white/5 rounded w-full" />
        <div className="h-3 bg-white/5 rounded w-3/4" />
        <div className="h-3 w-16 bg-white/5 rounded mt-2" />
      </div>
    </div>
  );
}

/* ─── Componente principal ─── */
export default function SelecaoNewsGrid() {
  const [posts, setPosts] = useState<PostagemCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('postagens')
      .select('id, titulo, slug, resumo_ia, categoria, criado_em')
      .eq('status', 'published')
      .eq('categoria', 'Seleção Brasileira')
      .order('criado_em', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  /* Skeleton enquanto carrega */
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  /* Empty state */
  if (posts.length === 0) {
    return (
      <p className="text-center text-white/30 ve-subtitulo text-sm uppercase tracking-widest py-12">
        Nenhuma notícia disponível ainda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {posts.map((post, i) => {
        const cor = PALETA[i % PALETA.length];
        return (
          <Link
            key={post.id}
            href={`/noticias/${post.slug}`}
            className="card-jogador rounded-xl overflow-hidden border border-white/8 group block"
            style={{ background: 'rgba(0,15,8,0.9)', textDecoration: 'none' }}
            aria-label={`Ler matéria: ${post.titulo}`}
          >
            {/* Barra colorida topo */}
            <div className="h-1.5" style={{ background: cor }} aria-hidden="true" />

            <div className="p-5">
              {/* Tag + tempo */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="ve-subtitulo text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{
                    background: `${cor}22`,
                    color: cor,
                    border: `1px solid ${cor}44`,
                  }}
                >
                  {post.categoria ?? 'SELEÇÃO'}
                </span>
                <span className="text-white/30 text-[11px] ve-subtitulo">
                  {tempoRelativo(post.criado_em)}
                </span>
              </div>

              {/* Título */}
              <h3 className="ve-subtitulo font-bold text-white text-sm leading-snug mb-2 group-hover:text-[#009c3b] transition-colors line-clamp-3">
                {post.titulo}
              </h3>

              {/* Resumo */}
              {post.resumo_ia && (
                <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
                  {post.resumo_ia}
                </p>
              )}

              {/* CTA */}
              <div className="mt-4 flex items-center gap-1 text-[#009c3b] text-xs font-semibold ve-subtitulo group-hover:gap-2 transition-all">
                Ler mais <span aria-hidden="true">→</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
