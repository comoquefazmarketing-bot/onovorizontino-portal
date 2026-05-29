// src/components/home/HeroDestaque.tsx
// SERVER COMPONENT — exibe a matéria mais recente em destaque máximo.
// Busca limit=1 ordenado por criado_em desc. O NewsGrid usa offset=1
// para não duplicar esta matéria.

import Link  from 'next/link';
import Image from 'next/image';

export const revalidate = 300;

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Postagem = {
  id:          string;
  titulo:      string;
  slug:        string;
  imagem_capa: string | null;
  categoria:   string | null;
  resumo_ia:   string | null;
  criado_em:   string;
};

async function getUltimaPostagem(): Promise<Postagem | null> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/postagens?select=id,titulo,slug,imagem_capa,categoria,resumo_ia,criado_em&status=eq.published&order=criado_em.desc&limit=1`;
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}`, Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.[0] ?? null;
  } catch { return null; }
}

function dataRelativa(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'Agora mesmo';
  if (h < 24) return `Há ${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'Há 1 dia' : `Há ${d} dias`;
}

export default async function HeroDestaque() {
  const post = await getUltimaPostagem();
  if (!post) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 pt-8 pb-2" aria-label="Matéria em destaque">

      {/* Cabeçalho da seção */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1 h-7 bg-yellow-500 rounded-full block flex-shrink-0" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">
            Última Hora
          </h2>
        </div>
        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
          {dataRelativa(post.criado_em)}
        </span>
      </div>

      {/* Hero card — mesma estrutura do CardDestaque, mas maior */}
      <Link
        href={`/noticias/${post.slug}`}
        className="group relative block w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-yellow-500/40 transition-all duration-300"
        style={{ aspectRatio: '21/9', maxHeight: '480px' }}
        aria-label={`Ler: ${post.titulo}`}
      >
        {/* Imagem de fundo */}
        {post.imagem_capa && (
          <Image
            src={post.imagem_capa}
            alt={post.titulo}
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
        )}

        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Conteúdo sobre a imagem */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 md:max-w-3xl">
          {post.categoria && (
            <span className="bg-yellow-500 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest mb-4 inline-block">
              {post.categoria}
            </span>
          )}
          <h3 className="text-white text-2xl md:text-4xl font-black italic uppercase leading-tight tracking-tighter mb-3 group-hover:text-yellow-500 transition-colors line-clamp-3">
            {post.titulo}
          </h3>
          {post.resumo_ia && (
            <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 hidden md:block mb-4">
              {post.resumo_ia}
            </p>
          )}
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all w-fit">
            Ler matéria completa <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>

    </section>
  );
}
