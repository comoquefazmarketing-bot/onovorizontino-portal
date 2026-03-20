import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// No Next.js 15+, params é uma Promise
export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: noticia, error } = await supabase
    .from("postagens")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !noticia) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500 selection:text-black">
      
      <main className="max-w-3xl mx-auto px-6 py-16">
        {/* VOLTAR */}
        <a href="/" className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 block hover:opacity-70">
          ? Radar do Tigre
        </a>

        {/* TÍTULO IMPACTANTE */}
        <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.95] mb-8 tracking-tighter">
          {noticia.titulo}
        </h1>

        <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10">
          <span>{new Date(noticia.criado_em).toLocaleDateString("pt-BR")}</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
          <span>Por {noticia.autor_ia || 'Felipe Makarios'}</span>
        </div>

        {/* IMAGEM COM PROPORÇÃO CINEMATOGRÁFICA */}
        <div className="aspect-video mb-12 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
          <img
            src={noticia.imagem_capa || "/jorjao.jpg"}
            className="w-full h-full object-cover"
            alt={noticia.titulo}
          />
        </div>

        {/* CONTEÚDO COM SUPORTE A HTML (image_6b8304) */}
        <article 
          className="text-zinc-300 leading-relaxed text-xl italic space-y-6 prose prose-invert prose-yellow max-w-none"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />
      </main>

    </div>
  );
}
