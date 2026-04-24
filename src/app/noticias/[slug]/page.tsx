import { Metadata } from 'next';
import { createClient } from "@/utils/supabase/server";
import { notFound } from 'next/navigation';
import FalaAiTorcedor from '@/components/portal/FalaAiTorcedor';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('postagens')
    .select('titulo, categoria, imagem_capa, resumo_ia')
    .eq('slug', slug)
    .maybeSingle();

  if (!data) return { title: 'Notícia não encontrada' };
  return { 
    title: `${data.titulo} | O Novorizontino`,
    description: data.resumo_ia 
  };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: postagem, error } = await supabase
    .from('postagens')
    .select('id, titulo, conteudo, categoria, imagem_capa, criado_em, autor_ia, resumo_ia')
    .eq('slug', slug)
    .single();

  if (error || !postagem) return notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24 selection:bg-yellow-500">
      
      {/* Botão Voltar */}
      <div className="fixed top-8 left-6 z-50">
        <a href="/" className="bg-black/60 hover:bg-[#F5C400] border border-white/10 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
          ← VOLTAR
        </a>
      </div>

      <article className="max-w-4xl mx-auto px-4 mt-24">
        {/* Header */}
        <header className="mb-12">
          <span className="text-[#F5C400] font-black text-xs uppercase tracking-widest border-l-4 border-[#F5C400] pl-4 mb-6 block">
            {postagem.categoria || 'NOTÍCIA'}
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none mb-6">
            {postagem.titulo}
          </h1>
          {postagem.resumo_ia && (
            <p className="text-zinc-400 text-xl font-medium leading-relaxed italic">
              {postagem.resumo_ia}
            </p>
          )}
        </header>

        {/* RENDERIZAÇÃO DO CONTEÚDO
            Removi o 'styled-jsx' para o build passar.
            Usei classes nativas do Tailwind para garantir que o HTML interno apareça.
        */}
        <div className="relative text-zinc-200 text-xl leading-relaxed">
          <div 
            dangerouslySetInnerHTML={{ __html: postagem.conteudo }} 
            className="[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-2xl [&_img]:my-8 [&_p]:mb-6 [&_h2]:text-white [&_h2]:font-black [&_h2]:uppercase [&_h2]:italic [&_h2]:text-3xl [&_h2]:mt-12 [&_h2]:mb-6 [&_strong]:text-white [&_table]:w-full [&_table]:my-8 [&_td]:p-4 [&_td]:border [&_td]:border-white/10"
          />
        </div>

        {/* Comentários */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <FalaAiTorcedor postagemId={postagem.id} />
        </div>
      </article>
    </main>
  );
}
