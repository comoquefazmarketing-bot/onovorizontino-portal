import { DB_NOTICIAS } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default function NoticiaPage({ params }: { params: { slug: string } }) {
  const noticia = DB_NOTICIAS.find(n => n.slug === params.slug);

  if (!noticia) return notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <nav className="p-6 border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="text-yellow-500 font-black italic uppercase tracking-tighter hover:text-white transition-colors">
          ← PORTAL O NOVORIZONTINO
        </Link>
      </nav>

      <article className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-8">
          <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-black italic uppercase">
            {noticia.categoria}
          </span>
          <h1 className="text-4xl md:text-6xl font-black uppercase italic mt-4 leading-none tracking-tighter">
            {noticia.titulo}
          </h1>
        </div>

        <img src={noticia.imagem} className="w-full rounded-2xl shadow-2xl mb-12 border border-white/10" alt={noticia.titulo} />

        <div 
          className="prose prose-invert prose-yellow max-w-none text-gray-300 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />
      </article>
    </main>
  );
}