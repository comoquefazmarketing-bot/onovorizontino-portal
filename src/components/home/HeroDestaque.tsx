// src/components/home/HeroDestaque.tsx
// SERVER COMPONENT — exibe a matéria mais recente em destaque máximo,
// acima do grid de notícias. Usa o mesmo endpoint Supabase REST do NewsGrid.

import Link  from 'next/link';
import Image from 'next/image';

export const revalidate = 300; // ISR 5 min

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
    <section
      className="max-w-7xl mx-auto px-4 pt-8 pb-2"
      aria-label="Matéria em destaque"
    >
      {/* Label da seção */}
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1 h-7 bg-yellow-500 rounded-full block flex-shrink-0" />
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">
            Última Hora
          </h2>
        </div>
        <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest ml-1">
          {dataRelativa(post.criado_em)}
        </span>
      </div>

      {/* Card hero */}
      <Link
        href={`/noticias/${post.slug}`}
        className="group relative flex flex-col md:flex-row rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/50 transition-all duration-300 bg-zinc-900"
        aria-label={`Ler: ${post.titulo}`}
      >
        {/* Imagem */}
        <div className="relative w-full md:w-[60%] aspect-video md:aspect-auto md:min-h-[320px] bg-zinc-800 flex-shrink-0 overflow-hidden">
          {post.imagem_capa ? (
            <Image
              src={post.imagem_capa}
              alt={post.titulo}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
          )}
          {/* Overlay gradiente lateral no desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/80" />
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col justify-center p-6 md:p-10 flex-1 bg-[#0a0a0a] md:bg-transparent md:absolute md:right-0 md:top-0 md:bottom-0 md:w-[45%] md:bg-gradient-to-l md:from-black md:via-black/95 md:to-transparent">
          {post.categoria && (
            <span className="bg-yellow-500 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest mb-4 inline-block w-fit">
              {post.categoria}
            </span>
          )}
          <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-black italic uppercase leading-tight tracking-tighter mb-4 group-hover:text-yellow-500 transition-colors">
            {post.titulo}
          </h3>
          {post.resumo_ia && (
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 mb-5 hidden md:block">
              {post.resumo_ia}
            </p>
          )}
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-widest group-hover:gap-2 flex items-center gap-1 transition-all">
            Ler matéria completa <span aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </section>
  );
}
