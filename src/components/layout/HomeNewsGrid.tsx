// Server Component — fetch com ISR revalidate:60
// Sem 'use client': dados buscados no server, sem CLS de loading
import Link from 'next/link';
import HeroDestaque from '@/components/portal/HeroDestaque';
import CardManchete from '@/components/portal/CardManchete';
import CardNoticia  from '@/components/portal/CardNoticia';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const HEADERS = {
  apikey:        SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  Accept:        'application/json',
};

interface Post {
  id: string;
  titulo: string;
  slug: string;
  categoria: string | null;
  imagem_capa: string | null;
  resumo_ia: string | null;
  criado_em: string;
  autor_ia: string | null;
}

async function fetchPosts(): Promise<Post[]> {
  try {
    const url = `${SUPA_URL}/rest/v1/postagens`
      + `?select=id,titulo,slug,resumo_ia,imagem_capa,categoria,status,criado_em,autor_ia`
      + `&status=eq.published`
      + `&order=criado_em.desc.nullslast`
      + `&limit=10`
      + `&offset=1`;

    const res = await fetch(url, {
      headers: HEADERS,
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function HomeNewsGrid() {
  const posts = await fetchPosts();
  if (!posts.length) return null;

  const [hero, ...rest] = posts;
  const manchetes = rest.slice(0, 3);   // 3 manchetes laterais
  const ultimas   = rest.slice(3, 7);   // até 4 cards no grid inferior

  return (
    <section className="w-full bg-bg" id="noticias">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-2">

        {/* ── BLOCO PRINCIPAL: hero 3/5 + coluna manchetes 2/5 ── */}
        <div className="grid grid-cols-1 gap-0.5 lg:grid-cols-[3fr_2fr]">

          {/* HERO */}
          <HeroDestaque post={hero} />

          {/* COLUNA LATERAL — manchetes */}
          {manchetes.length > 0 && (
            <div className="flex flex-col divide-y divide-white/5 bg-panel">
              {manchetes.map(post => (
                <CardManchete key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* ── SEPARADOR "Últimas notícias" ── */}
        {ultimas.length > 0 && (
          <>
            <div className="flex items-center gap-3 pt-4 pb-2">
              <span className="h-5 w-1 bg-gold rounded-full" />
              <span className="font-body text-[11px] font-black uppercase tracking-[0.3em] text-muted">
                Últimas notícias
              </span>
              <span className="flex-1 h-px bg-white/5" />
            </div>

            {/* GRID INFERIOR */}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {ultimas.map(post => (
                <CardNoticia key={post.id} post={post} />
              ))}
            </div>
          </>
        )}

        {/* VER TODAS */}
        <div className="flex justify-end pt-4">
          <Link href="/noticias"
            className="group flex items-center gap-1.5 font-body text-[11px] font-black uppercase tracking-[0.3em] text-muted
              hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan rounded">
            Ver todas as matérias
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
