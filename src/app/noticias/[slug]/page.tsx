import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import VoltarNoticias from '@/components/layout/VoltarNoticias'; // ← NOVO

export const revalidate = 60;
export const dynamicParams = true;

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const headers = {
  apikey: SUPA_ANON,
  Authorization: `Bearer ${SUPA_ANON}`,
  Accept: 'application/json',
};

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  const url = `${SUPA_URL}/rest/v1/postagens?slug=eq.${encodeURIComponent(
    slug,
  )}&select=id,titulo,slug,categoria,imagem_capa,criado_em,conteudo,resumo_ia,autor_ia,fonte_nome,fonte_url&limit=1`;
  const res = await fetch(url, { headers, cache: 'no-store' });
  const data = await res.json();
  return data?.[0] ?? null;
}

async function getRelacionadas(slug: string) {
  const url = `${SUPA_URL}/rest/v1/postagens?status=eq.published&slug=neq.${encodeURIComponent(
    slug,
  )}&select=id,titulo,slug,imagem_capa,categoria,criado_em&order=criado_em.desc&limit=3`;
  const res = await fetch(url, { headers, cache: 'no-store' });
  return await res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Notícia não encontrada' };
  return {
    title: `${post.titulo} | Portal O Novorizontino`,
    description: post.resumo_ia ?? 'Cobertura completa do Grêmio Novorizontino.',
    openGraph: {
      title: post.titulo,
      description: post.resumo_ia ?? '',
      images: post.imagem_capa ? [{ url: post.imagem_capa }] : [],
    },
  };
}

export default async function NoticiaSlugPage({ params }: Props) {
  const { slug } = await params;

  const [post, relacionadas] = await Promise.all([getPost(slug), getRelacionadas(slug)]);

  if (!post) notFound();

  const dataFormatada = new Date(post.criado_em).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const FALLBACK =
    'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

  // NOTA: Trocamos <main> por <article>. O layout.tsx já tem <main>,
  // e HTML válido permite apenas um <main> por página. <article> é
  // semanticamente mais correto para uma notícia individual.
  return (
    <article className="min-h-screen bg-[#050505] text-white selection:bg-yellow-500 selection:text-black">
      {/* ─── VOLTAR (acima do hero) ─── */}
      <VoltarNoticias />

      {/* Hero */}
      <div className="relative w-full aspect-[21/9] max-h-[520px] overflow-hidden">
        <Image
          src={post.imagem_capa || FALLBACK}
          alt={post.titulo}
          fill
          priority
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-5xl mx-auto">
          <span className="bg-[#F5C400] text-black text-[9px] font-black px-3 py-1 uppercase tracking-tighter italic mb-4 inline-block">
            {post.categoria || 'TIGRE'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black uppercase italic leading-[1.05] tracking-tighter text-white mt-2">
            {post.titulo}
          </h1>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              {dataFormatada}
            </span>
            {post.autor_ia && (
              <>
                <span className="text-zinc-700">·</span>
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                  Por {post.autor_ia}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {post.resumo_ia && (
          <p className="text-zinc-300 text-lg leading-relaxed border-l-4 border-[#F5C400] pl-5 mb-10 font-medium">
            {post.resumo_ia}
          </p>
        )}

        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
            prose-h2:text-[#F5C400] prose-h2:text-2xl prose-h2:mt-10
            prose-h3:text-white prose-h3:text-xl
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-strong:text-white prose-strong:font-black
            prose-a:text-[#F5C400] prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-[#F5C400] prose-blockquote:text-zinc-300
            prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.conteudo ?? '' }}
        />

        {post.fonte_nome && (
          <div className="mt-10 pt-6 border-t border-white/5 text-xs text-zinc-600 font-bold uppercase tracking-widest">
            Fonte:{' '}
            {post.fonte_url ? (
              <a
                href={post.fonte_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#F5C400] hover:underline"
              >
                {post.fonte_nome}
              </a>
            ) : (
              post.fonte_nome
            )}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/noticias"
            className="flex items-center gap-2 text-zinc-500 hover:text-[#F5C400] text-[10px] font-black uppercase tracking-[0.3em] transition-all group w-fit"
          >
            <span className="transition-transform group-hover:-translate-x-1">←</span>
            TODAS AS NOTÍCIAS
          </Link>
        </div>
      </div>

      {/* Relacionadas */}
      {relacionadas?.length > 0 && (
        <div className="border-t border-white/5 bg-zinc-900/20 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[#F5C400] text-[10px] font-black uppercase tracking-[0.5em] mb-8">
              Leia Também
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relacionadas.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/noticias/${rel.slug}`}
                  className="group flex flex-col bg-zinc-900/50 border border-white/5 hover:border-[#F5C400]/30 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-zinc-800">
                    <Image
                      src={rel.imagem_capa || FALLBACK}
                      alt={rel.titulo}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-500"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-[#F5C400] text-[9px] font-black uppercase tracking-widest">
                      {rel.categoria || 'TIGRE'}
                    </span>
                    <h3 className="text-white font-black uppercase italic text-sm leading-tight mt-1 group-hover:text-[#F5C400] transition-colors line-clamp-2 tracking-tight">
                      {rel.titulo}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
