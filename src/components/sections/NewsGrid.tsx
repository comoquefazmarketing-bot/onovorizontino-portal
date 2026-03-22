import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function NewsGrid({ noticias = [] }: { noticias?: any[] }) {
  // Busca os assets para garantir que as thumbnails fiquem bonitas
  const { data: assets } = await supabase.from("assets_clube").select("*");

  const limpar = (texto: string) => {
    if (!texto) return "Notícia do Tigre";
    return texto.replace(/["{}]/g, "").replace(/titulo:|texto:|imagem_capa:/g, "").trim();
  };

  const getThumbnail = (post: any) => {
    // 1. Tenta imagem original
    const rawImg = post.imagem_capa?.match(/https?:\/\/[^"\s{}]+/)?.[0];
    if (rawImg && rawImg !== "NULL") return rawImg;

    // 2. Fallback Temático baseado no título
    const tit = (post.titulo || "").toLowerCase();
    if (tit.includes("treino") || tit.includes("prepara")) return assets?.find(a => a.tema === "treino_campo_1")?.url_imagem;
    if (tit.includes("gol") || tit.includes("vitória")) return assets?.find(a => a.tema === "artilheiro_comemorando")?.url_imagem;
    if (tit.includes("torcida") || tit.includes("jorjão")) return assets?.find(a => a.tema === "torcida_geral")?.url_imagem;
    
    return assets?.find(a => a.tema === "escudo_fundo_preto")?.url_imagem || assets?.find(a => a.tema === "escudo_oficial")?.url_imagem;
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {noticias.map((post: any) => {
        const tituloFinal = limpar(post.titulo);
        const imagemFinal = getThumbnail(post);

        return (
          <Link href={`/post/${post.id}`} key={post.id} className="group flex flex-col">
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 mb-4 transition-all duration-500 group-hover:border-yellow-500/50">
              <img 
                src={imagemFinal} 
                className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" 
                alt="Thumbnail" 
              />
            </div>
            <span className="text-[10px] font-bold text-yellow-500 mb-2 uppercase tracking-widest">
              {post.categoria || "Novorizontino"}
            </span>
            <h3 className="text-white font-black italic uppercase text-lg leading-tight group-hover:text-yellow-500 transition-colors line-clamp-3">
              {tituloFinal}
            </h3>
          </Link>
        );
      })}
    </section>
  );
}