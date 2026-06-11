'use client';
import Link from 'next/link';

export default function PostagensGrid() {
  const posts = [
    {
      id: 'pre-jogo-novorizontino-x-londrina',
      tag: 'PRÉ-JOGO',
      titulo: 'GUIA DO JOGO: NOVORIZONTINO X LONDRINA',
      imagem: '/jorjao.webp',
      destaque: true
    },
    {
      id: 'era-de-ouro',
      tag: 'GRANDE REPORTAGEM',
      titulo: 'O TIGRE NA ERA DE OURO',
      imagem: '/jorjao.webp',
      destaque: false
    }
  ];

  return (
    <div className="flex flex-col gap-10">
      {posts.map((post) => (
        <Link key={post.id} href={`/noticias/${post.id}`} className="group block">
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-white/10">
            <img src={post.imagem} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 md:p-12">
              <span className="bg-yellow-500 text-black px-3 py-1 text-[9px] font-black uppercase mb-4 inline-block italic">
                {post.tag}
              </span>
              <h3 className="text-4xl md:text-7xl font-black italic uppercase leading-none text-white tracking-tighter">
                {post.titulo}
              </h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}