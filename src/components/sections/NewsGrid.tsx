import Link from "next/link";

export default function NewsGrid() {
  const news = [
    {
      id: "honra",
      title: "O ACESSO É QUESTÃO DE HONRA: REPARAÇÃO HISTÓRICA 2026",
      category: "DESTAQUE",
      image: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/destaque-honra.webp.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9kZXN0YXF1ZS1ob25yYS53ZWJwLnBuZyIsImlhdCI6MTc3NDExOTg2MywiZXhwIjoxODA1NjU1ODYzfQ.iXbmqbf-CIEqTCQkZh2KoDTWw8QJIT3wKvYJr9aUHyo",
      slug: "/noticias/o-acesso-e-questao-de-honra-2026"
    },
    {
      id: "enderson",
      title: "O TABULEIRO DE ENDERSON MOREIRA: ESQUEMA 2026",
      category: "ANÁLISE TÁTICA",
      image: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Enderson%20Moreira.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9FbmRlcnNvbiBNb3JlaXJhLndlYnAiLCJpYXQiOjE3NzQxMjgxMTEsImV4cCI6MTgwNTY2NDExMX0.-3dIKACCROJPxrgreXyTU8SiaUr5kf2k7gBn-GbkYwc",
      slug: "/noticias/o-tabuleiro-de-enderson-moreira-2026"
    },
    {
      id: "londrina",
      title: "GUIA DO JOGO: NOVORIZONTINO X LONDRINA",
      category: "PRÉ-JOGO",
      image: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Novorizontino%20x%20Londrina.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9Ob3Zvcml6b250aW5vIHggTG9uZHJpbmEucG5nIiwiaWF0IjoxNzc0MTI4ODc2LCJleHAiOjE4MDU2NjQ4NzZ9.zugzXeVF-ggbHl6Ih3Mad5FJ_78ZSzDKhGy83uKBzP4",
      slug: "/noticias/pre-jogo-novorizontino-x-londrina-serie-b-2026"
    },
    {
      id: "reforcos",
      title: "A ARMADURA DE 2026: CONHEÇA OS GUERREIROS",
      category: "ELENCO",
      image: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/reforcos.webp.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9yZWZvcmNvcy53ZWJwLndlYnAiLCJpYXQiOjE3NzQxMjY0NDIsImV4cCI6MTgwNTY2MjQ0Mn0.dUxEHfrMjNJiFvlRdkwi3-8K6NTfwHjP9mqEtGJG-YM",
      slug: "/noticias/os-escolhidos-reforcos-tigre-2026"
    }
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {news.map((item) => (
          <Link 
            key={item.id} 
            href={item.slug} 
            className="group block bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-yellow-500 transition-all"
          >
            <div className="relative aspect-video">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
              <div className="absolute top-4 left-4 bg-yellow-500 text-black text-[10px] font-black px-2 py-1 rounded italic">
                {item.category}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-white text-2xl font-black uppercase italic group-hover:text-yellow-500 leading-tight">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}