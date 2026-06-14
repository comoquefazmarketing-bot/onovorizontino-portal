import Image from 'next/image';
import Link from 'next/link';
import { timeAgo, catBadgeClass } from '@/lib/portal/format';

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

interface Post {
  id: string;
  titulo: string;
  slug: string;
  categoria: string | null;
  imagem_capa: string | null;
  resumo_ia: string | null;
  criado_em: string;
}

interface Props {
  post: Post;
}

export default function HeroDestaque({ post }: Props) {
  return (
    <Link href={`/noticias/${post.slug}`}
      className="group relative block overflow-hidden bg-panel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
      style={{ aspectRatio: '16/9' }}>

      {/* Imagem — sem unoptimized, sem brightness global: o gradiente protege o texto */}
      <Image
        src={post.imagem_capa || FALLBACK}
        alt={post.titulo}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
      />

      {/* Gradiente lateral: escurece a esquerda onde vai o texto, libera a arte à direita */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/10 pointer-events-none" />
      {/* Gradiente inferior de segurança no mobile (quando empilha em largura total) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none md:opacity-0" />

      {/* Conteúdo — ancorado na metade esquerda */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8 md:max-w-[62%]">
        {post.categoria && (
          <span className={`mb-3 inline-block self-start rounded px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${catBadgeClass(post.categoria)}`}>
            {post.categoria}
          </span>
        )}
        <h2 className="font-display text-2xl font-black italic uppercase leading-tight text-ink
          line-clamp-3 [overflow-wrap:break-word]
          md:text-4xl lg:text-5xl
          group-hover:text-gold transition-colors duration-200">
          {post.titulo}
        </h2>
        {post.resumo_ia && (
          <p className="mt-2 hidden font-body text-sm leading-snug text-ink/70 line-clamp-2 md:block">
            {post.resumo_ia}
          </p>
        )}
        <span className="mt-3 font-body text-[11px] font-semibold text-muted">
          {timeAgo(post.criado_em)}
        </span>
      </div>
    </Link>
  );
}
