import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function NoticiaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // AJUSTE: Mudamos de "postagens" para "noticias" e "criado_em" para "created_at"
  const { data: noticia, error } = await supabase
    .from("noticias") 
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
        <a href="/" className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 block hover:opacity-70 transition-all">
          ← RADAR DO TIGRE
        </a>

        {/* TÍTULO IMPACTANTE */}
        <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-[0.95] mb-8 tracking-tighter text-white">
          {noticia.titulo}
        </h1>

        <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-10">
          {/* AJUSTE: Usando created_at que confirmamos no SQL */}
          <span>{new Date(noticia.created_at).toLocaleDateString("pt-BR")}</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
          <span>POR {noticia.autor_ia || 'FELIPE MAKARIOS'}</span>
        </div>

        {/* IMAGEM COM PROPORÇÃO CINEMATOGRÁFICA */}
        <div className="aspect-video mb-12 rounded-2xl overflow-hidden border border-white/5 shadow-2xl bg-zinc-900">
          <img
            src={noticia.imagem_capa || "/jorjao.jpg"}
            className="w-full h-full object-cover"
            alt={noticia.titulo}
          />
        </div>

        {/* CONTEÚDO FORMATADO */}
        {/* Adicionei 'prose-table:border-zinc-800' para as tabelas de pré-jogo */}
        <article 
          className="text-zinc-300 leading-relaxed text-xl space-y-6 prose prose-invert prose-yellow max-w-none 
          prose-headings:italic prose-headings:uppercase prose-headings:font-black
          prose-img:rounded-xl prose-table:text-sm"
          dangerouslySetInnerHTML={{ __html: noticia.conteudo }}
        />

        {/* ASSINATURA FINAL */}
        <div className="mt-20 pt-8 border-t border-zinc-900">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
            © 2026 Portal O Novorizontino - Questão de Honra
          </p>
        </div>
      </main>
    </div>
  );
}
