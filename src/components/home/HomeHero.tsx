// Server Component — hero editorial com matéria mais recente
import Image from 'next/image';
import Link from 'next/link';
import { timeAgo, catBadgeClass } from '@/lib/portal/format';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const FALLBACK  = '/jorjao.webp';

interface Post {
  id: string;
  titulo: string;
  slug: string;
  categoria: string | null;
  imagem_capa: string | null;
  resumo_ia: string | null;
  criado_em: string;
}

async function fetchHeroPost(): Promise<Post | null> {
  try {
    const url = `${SUPA_URL}/rest/v1/postagens`
      + `?select=id,titulo,slug,categoria,imagem_capa,resumo_ia,criado_em`
      + `&status=eq.published`
      + `&order=criado_em.desc.nullslast`
      + `&limit=1`;
    const res = await fetch(url, {
      headers: { apikey: SUPA_KEY, Authorization: `Bearer ${SUPA_KEY}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) && data.length ? data[0] : null;
  } catch {
    return null;
  }
}

export default async function HomeHero() {
  const post = await fetchHeroPost();

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(420px, 65vh, 720px)' }}>

      {/* Imagem de fundo */}
      <Image
        src={post?.imagem_capa || FALLBACK}
        alt={post?.titulo ?? 'O Novorizontino'}
        fill
        priority
        sizes="100vw"
        className="object-cover"
        unoptimized={!post?.imagem_capa}
      />

      {/* Gradientes */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />

      {/* Conteúdo */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12">

        {/* Topo: logo-selo + label */}
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Página inicial O Novorizontino">
            <img
              src="/assets/logos/LOGO - O NOVORIZONTINO.png"
              alt="O Novorizontino"
              className="h-10 md:h-14 w-auto object-contain drop-shadow-[0_0_20px_rgba(245,196,0,0.4)] transition-opacity hover:opacity-80"
            />
          </Link>
          <span className="hidden sm:block h-5 w-px bg-white/20" />
          <span className="hidden sm:block font-body text-[10px] font-black uppercase tracking-[0.4em] text-white/50">
            Portal da torcida
          </span>
        </div>

        {/* Rodapé: conteúdo editorial */}
        {post ? (
          <div className="max-w-2xl">
            {post.categoria && (
              <span className={`mb-3 inline-block rounded px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${catBadgeClass(post.categoria)}`}>
                {post.categoria}
              </span>
            )}

            <h2 className="font-display text-3xl font-black italic uppercase leading-tight text-white
              line-clamp-3 [overflow-wrap:break-word]
              md:text-5xl lg:text-6xl">
              {post.titulo}
            </h2>

            {post.resumo_ia && (
              <p className="mt-3 hidden font-body text-sm leading-relaxed text-white/60 line-clamp-2 md:block max-w-xl">
                {post.resumo_ia}
              </p>
            )}

            <div className="mt-5 flex items-center gap-4">
              <Link
                href={`/noticias/${post.slug}`}
                className="inline-flex items-center gap-2 bg-gold px-5 py-2.5 font-body text-[11px] font-black uppercase tracking-widest text-black
                  transition-all duration-200 hover:brightness-110 hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-sm"
              >
                Leia a matéria
                <span aria-hidden="true">→</span>
              </Link>
              <span className="font-body text-[11px] text-white/40">
                {timeAgo(post.criado_em)}
              </span>
            </div>
          </div>
        ) : (
          /* Fallback sem post: mantém brand */
          <div className="max-w-xl">
            <p className="font-display text-[10px] font-black uppercase tracking-[0.5em] text-gold mb-3">
              O Novorizontino
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-black italic uppercase leading-tight text-white">
              A voz da<br />torcida aurinegra
            </h2>
          </div>
        )}
      </div>
    </section>
  );
}
