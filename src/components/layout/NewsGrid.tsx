// src/components/layout/NewsGrid.tsx
// SERVER COMPONENT — fetch direto à REST API do Supabase
// Não usa createClient (que lê cookies e força dynamic rendering)
// O Next.js cacheia este fetch automaticamente por 5 minutos

import Link from 'next/link';
import Image from 'next/image';

// Revalida o cache a cada 5 minutos no servidor
export const revalidate = 300;

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Postagem = {
  id: string;
  titulo: string;
  slug: string;
  imagem_capa: string | null;
  categoria: string | null;
  criado_em: string;
};

async function getPostagens(): Promise<Postagem[]> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/postagens?select=id,titulo,slug,imagem_capa,categoria,criado_em&status=eq.published&order=criado_em.desc&limit=9`;

    const res = await fetch(url, {
      headers: {
        apikey:        SUPABASE_ANON,
        Authorization: `Bearer ${SUPABASE_ANON}`,
        Accept:        'application/json',
      },
      // Cache ISR: revalida em background a cada 5 min
      next: { revalidate: 300 },
    });

    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// ── Cards ─────────────────────────────────────────────────────
function CardDestaque({ post }: { post: Postagem }) {
  return (
    <Link
      href={`/noticias/${post.slug}`}
      className="group relative block rounded-2xl overflow-hidden aspect-video bg-zinc-900 border border-white/5 hover:border-yellow-500/40 transition-all duration-300"
    >
      {post.imagem_capa && (
        <Image
          src={post.imagem_capa}
          alt={post.titulo}
          fill
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {post.categoria && (
          <span className="bg-yellow-500 text-black text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest mb-3 inline-block">
            {post.categoria}
          </span>
        )}
        <h3 className="text-white text-xl md:text-2xl font-black italic uppercase leading-tight tracking-tighter group-hover:text-yellow-500 transition-colors line-clamp-3">
          {post.titulo}
        </h3>
      </div>
    </Link>
  );
}

function CardLista({ post }: { post: Postagem }) {
  return (
    <Link
      href={`/noticias/${post.slug}`}
      className="group flex gap-3 p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
    >
      {post.imagem_capa && (
        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-800">
          <Image src={post.imagem_capa} alt={post.titulo} fill sizes="80px" className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        {post.categoria && (
          <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest block mb-1">
            {post.categoria}
          </span>
        )}
        <h3 className="text-white text-sm font-black italic uppercase leading-tight line-clamp-3 group-hover:text-yellow-500 transition-colors">
          {post.titulo}
        </h3>
      </div>
    </Link>
  );
}

function CardMedio({ post }: { post: Postagem }) {
  return (
    <Link
      href={`/noticias/${post.slug}`}
      className="group block bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500/40 transition-all duration-300"
    >
      <div className="relative aspect-video bg-zinc-900">
        {post.imagem_capa && (
          <Image
            src={post.imagem_capa}
            alt={post.titulo}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {post.categoria && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-black text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider">
            {post.categoria}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white text-sm font-black italic uppercase leading-tight line-clamp-2 group-hover:text-yellow-500 transition-colors">
          {post.titulo}
        </h3>
      </div>
    </Link>
  );
}

// ── Componente principal ──────────────────────────────────────
export default async function PostagensGrid() {
  const postagens = await getPostagens();

  if (!postagens || postagens.length === 0) return null;

  const [destaque, ...resto] = postagens;
  const sidebar = resto.slice(0, 3);
  const medios  = resto.slice(3, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-1 h-7 bg-yellow-500 rounded-full block" />
          <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">
            Últimas Notícias
          </h2>
        </div>
        <Link href="/noticias" className="text-yellow-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
          Ver todas →
        </Link>
      </div>

      {/* Linha 1: destaque + sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-7">
          <CardDestaque post={destaque} />
        </div>
        <div className="md:col-span-5 flex flex-col gap-1 divide-y divide-white/5">
          {sidebar.map(p => <CardLista key={p.id} post={p} />)}
        </div>
      </div>

      {/* Linha 2: grid médio */}
      {medios.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {medios.map(p => <CardMedio key={p.id} post={p} />)}
        </div>
      )}
    </section>
  );
}
