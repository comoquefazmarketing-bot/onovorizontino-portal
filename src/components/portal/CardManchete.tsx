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
  criado_em: string;
}

interface Props {
  post: Post;
}

export default function CardManchete({ post }: Props) {
  return (
    <Link href={`/noticias/${post.slug}`}
      className="group flex gap-3 rounded-none border-b border-white/5 bg-panel p-3 transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan last:border-b-0">

      {/* Thumb 16:11 fixa */}
      <div className="relative w-28 shrink-0 overflow-hidden rounded-sm" style={{ aspectRatio: '16/11' }}>
        <Image
          src={post.imagem_capa || FALLBACK}
          alt={post.titulo}
          fill
          sizes="112px"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>

      {/* Texto */}
      <div className="flex min-w-0 flex-col justify-between py-0.5">
        {post.categoria && (
          <span className={`mb-1.5 inline-block self-start rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${catBadgeClass(post.categoria)}`}>
            {post.categoria}
          </span>
        )}
        <h3 className="font-display text-sm font-black italic uppercase leading-tight text-ink line-clamp-3
          group-hover:text-gold transition-colors duration-150 [overflow-wrap:break-word]">
          {post.titulo}
        </h3>
        <span className="mt-1.5 font-body text-[10px] text-muted">
          {timeAgo(post.criado_em)}
        </span>
      </div>
    </Link>
  );
}
