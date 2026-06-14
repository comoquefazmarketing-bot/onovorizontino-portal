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

export default function CardNoticia({ post }: Props) {
  return (
    <Link href={`/noticias/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-sm border border-white/5 bg-panel
        transition-all duration-300 hover:-translate-y-1 hover:border-gold/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.6)]
        motion-reduce:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan">

      {/* Thumb 16:9 */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <Image
          src={post.imagem_capa || FALLBACK}
          alt={post.titulo}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
        />
      </div>

      {/* Corpo */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        {post.categoria && (
          <span className={`inline-block self-start rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${catBadgeClass(post.categoria)}`}>
            {post.categoria}
          </span>
        )}
        <h3 className="font-display text-sm font-black italic uppercase leading-tight text-ink line-clamp-3
          group-hover:text-gold transition-colors duration-150 [overflow-wrap:break-word] flex-1">
          {post.titulo}
        </h3>
        <span className="font-body text-[10px] text-muted">
          {timeAgo(post.criado_em)}
        </span>
      </div>
    </Link>
  );
}
