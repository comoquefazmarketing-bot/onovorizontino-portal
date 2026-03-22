import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import VideoSection from "@/components/sections/VideoSection";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const { data: post } = await supabase.from("postagens").select("*").eq("id", id).single();
  const { data: assets } = await supabase.from("assets_clube").select("*");

  if (!post) return <div className="text-white p-20 text-center uppercase font-black">Matéria não encontrada</div>;

  // ANALISANDO O JSON DA IA
  let dados;
  try {
    dados = typeof post.conteudo === "string" ? JSON.parse(post.conteudo) : post.conteudo;
  } catch (e) {
    dados = { titulo: post.titulo, texto: post.conteudo, categoria: post.categoria };
  }

  // LÓGICA DE IMAGEM TEMÁTICA MELHORADA
  const getCapa = () => {
    const tit = (dados.titulo || "").toLowerCase();
    const find = (t: string) => assets?.find(a => a.tema === t)?.url_imagem;

    if (tit.includes("derrota") || tit.includes("crítico")) return find("estadio_noturno");
    if (tit.includes("reforço") || tit.includes("contrata")) return find("contratacao_novo");
    if (tit.includes("gol") || tit.includes("vitoria")) return find("artilheiro_comemorando");
    if (tit.includes("prepara") || tit.includes("treino")) return find("treino_campo_1");
    
    return find("escudo_oficial") || "https://upload.wikimedia.org/wikipedia/pt/8/89/Gremio_Novorizontino_2010.png";
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Ticker />
      <Header />

      <article className="max-w-4xl mx-auto px-6 py-12 w-full">
        <header className="mb-12">
          <span className="bg-yellow-500 text-black font-black px-3 py-1 italic text-xs uppercase mb-4 inline-block">
            {dados.categoria || "TIGRE DO VALE"}
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter">
            {dados.titulo}
          </h1>
        </header>

        <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <img src={getCapa()} className="w-full h-full object-cover" alt="Capa" />
        </div>

        <div 
          className="prose prose-invert prose-yellow max-w-none text-zinc-300 text-xl leading-relaxed font-medium mb-20"
          dangerouslySetInnerHTML={{ __html: dados.texto }}
        />
        
        <VideoSection />
      </article>

      <Footer />
    </main>
  );
}