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
  return { title: `${data.titulo} | O Novorizontino` };
}

export default async function NoticiaPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Buscamos a postagem. Note que o campo no banco é 'conteudo'
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
        {/* Header da Notícia */}
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

        {/* RENDERIZAÇÃO DO CONTEÚDO:
            O segredo aqui é o 'max-w-none'. O seu HTML da tabela já tem estilos próprios.
            Se o conteúdo sumir, remova a classe 'prose' para testar se é conflito de CSS.
        */}
        <div 
          className="content-area text-zinc-200"
          style={{ fontSize: '1.2rem', lineHeight: '1.8' }}
        >
          <div 
            dangerouslySetInnerHTML={{ __html: postagem.conteudo }} 
            className="all-unset" // Evita que estilos globais do site matem o HTML da tabela
          />
        </div>

        {/* Componente de Comentários */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <FalaAiTorcedor postagemId={postagem.id} />
        </div>
      </article>

      {/* Estilos para garantir que o HTML interno apareça */}
      <style jsx global>{`
        .content-area img { max-width: 100%; height: auto; border-radius: 16px; margin: 2rem 0; }
        .content-area p { margin-bottom: 1.5rem; }
        .content-area h2 { color: #fff; font-weight: 900; text-transform: uppercase; margin-top: 3rem; font-style: italic; }
        /* Garante que o fade-in do seu HTML funcione */
        .fade-in { animation: fadeIn 0.8s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </main>
  );
}
