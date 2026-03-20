import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const { data: post, error } = await supabase
    .from("postagens")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="bg-black min-h-screen text-zinc-100 font-sans">
      <article className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <header className="mb-8 mt-6 border-b border-yellow-600/30 pb-8">
          <div className="flex gap-2 mb-4">
            <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase">
              {post.categoria || "Grêmio Novorizontino"}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight text-white">
            {post.titulo}
          </h1>

          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-200">Por: Felipe Makarios</span>
              <span>Publicado em {new Date(post.criado_em).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>
        </header>

        {/* Imagem de Capa */}
        {post.imagem_capa && (
          <div className="relative w-full h-[300px] md:h-[500px] mb-10 overflow-hidden rounded-2xl border border-zinc-800">
            <img 
              src={post.imagem_capa} 
              alt={post.titulo} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Conteúdo da Notícia */}
        <section className="prose prose-invert prose-yellow max-w-none">
          <div className="text-lg md:text-xl leading-relaxed whitespace-pre-wrap text-zinc-300 mb-12">
            {post.conteudo}
          </div>
        </section>

        {/* BANNER DE PUBLICIDADE (ENTRE NOTÍCIA E VÍDEOS) */}
        <div className="w-full my-12 flex justify-center items-center overflow-hidden">
          <div className="w-full max-w-[728px] h-[90px] bg-zinc-900 flex items-center justify-center border border-dashed border-zinc-700 text-zinc-500 text-xs uppercase tracking-widest rounded-lg">
            Publicidade - Espaço Reservado
          </div>
        </div>

        {/* SEÇÃO DE VÍDEOS SHORTS */}
        {post.video_url && (
          <div className="my-12 p-8 bg-zinc-900/50 rounded-3xl border border-yellow-500/20 text-center">
            <h3 className="text-yellow-500 font-bold text-xl mb-6 flex justify-center items-center gap-2">
              🎥 Radar do Tigre (Vídeo Curto)
            </h3>
            <div className="aspect-[9/16] max-w-[320px] mx-auto shadow-2xl shadow-yellow-500/10">
               <iframe 
                  src={post.video_url.replace("youtube.com/shorts/", "youtube.com/embed/")}
                  className="w-full h-full rounded-2xl border-4 border-zinc-800"
                  allowFullScreen
               />
            </div>
          </div>
        )}

        {/* RODAPÉ COM CONTATO WHATSAPP */}
        <footer className="mt-20 pt-10 border-t border-zinc-900 flex flex-col items-center text-center">
          <p className="text-zinc-500 text-sm mb-4">
            Informações colhidas via: <a href={post.fonte_url} target="_blank" className="text-yellow-600 hover:underline">{post.fonte_nome}</a>
          </p>
          <div className="bg-yellow-500 text-black px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-yellow-400 transition-all cursor-pointer shadow-lg shadow-yellow-500/20">
            <span>Dúvidas ou Sugestões? Fale com Felipe:</span>
            <a href="https://wa.me/5517988031679" target="_blank" className="underline font-black">
              (17) 98803-1679
            </a>
          </div>
          <p className="mt-8 text-zinc-700 text-xs">
            © 2026 O Novorizontino - Criado por Felipe Makarios
          </p>
        </footer>
      </article>
    </div>
  );
}
