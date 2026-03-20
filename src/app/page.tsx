import Header from '@/components/layout/Header';
import Link from 'next/link';

// Simulação dos dados que o n8n vai injetar via API ou Props
const noticiasN8N = [
  {
    id: "1",
    titulo: "O Acesso é questão de honra: Veja os planos do Tigre para a temporada",
    resumo: "Eduardo Baptista projeta ano de superação e foco total na subida para a Série A.",
    imagem: "https://www.gremionovorizontino.com.br/wp-content/uploads/2024/03/DSC08493-1024x683.jpg",
    categoria: "Bastidores",
    slug: "acesso-questao-de-honra",
    data: "Há 10 min"
  },
  {
    id: "2",
    titulo: "Novorizontino inicia venda de ingressos para o duelo contra o Santos",
    resumo: "Expectativa de Jorjão lotado para o reencontro das equipes após o Paulistão.",
    imagem: "https://www.gremionovorizontino.com.br/wp-content/uploads/2024/02/DSC04107-1024x683.jpg",
    categoria: "Jogos",
    slug: "venda-ingressos-santos",
    data: "Há 1 hora"
  }
];

export default function Home() {
  const principal = noticiasN8N[0];
  const secundarias = noticiasN8N.slice(1);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* COLUNA DE NOTÍCIAS (2/3 da tela) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* DESTAQUE PRINCIPAL - LINKADO */}
            <Link href={`/noticias/${principal.slug}`} className="group block relative overflow-hidden rounded-sm border border-yellow-500/10">
              <div className="aspect-video relative">
                <img src={principal.imagem} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" alt="Capa" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 p-6 md:p-10">
                  <span className="bg-yellow-500 text-black text-[10px] font-black px-3 py-1 uppercase mb-4 inline-block italic">
                    {principal.categoria}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.9] drop-shadow-xl">
                    {principal.titulo}
                  </h2>
                </div>
              </div>
            </Link>

            {/* GRID DE SECUNDÁRIAS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secundarias.map((item) => (
                <Link key={item.id} href={`/noticias/${item.slug}`} className="group bg-zinc-900/50 border border-zinc-800 hover:border-yellow-500/50 transition-all">
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <img src={item.imagem} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" alt="Notícia" />
                  </div>
                  <div className="p-4">
                    <span className="text-yellow-500 text-[9px] font-black uppercase tracking-widest">{item.categoria}</span>
                    <h3 className="font-bold text-lg mt-1 leading-tight group-hover:text-yellow-500 transition-colors italic">
                      {item.titulo}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* BARRA LATERAL (WIDGETS) */}
          <aside className="flex flex-col gap-6">
             <div className="bg-zinc-900 border-t-4 border-yellow-500 p-5">
                <h3 className="font-black italic uppercase text-xl mb-4 text-yellow-500">Plantão do Vale</h3>
                <div className="space-y-4">
                   {noticiasN8N.map(n => (
                     <Link key={n.id} href={`/noticias/${n.slug}`} className="block border-b border-zinc-800 pb-3 hover:pl-2 transition-all group">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">{n.data}</p>
                        <h4 className="text-sm font-bold group-hover:text-yellow-500">{n.titulo}</h4>
                     </Link>
                   ))}
                </div>
             </div>
          </aside>

        </div>
      </section>
    </main>
  );
}
