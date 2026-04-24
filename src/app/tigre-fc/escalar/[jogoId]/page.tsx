import { createClient } from '@/utils/supabase/server';
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';
import { notFound } from 'next/navigation';

// Interface rigorosa para garantir que o TypeScript aceite o params como Promise
interface PageProps {
  params: Promise<{ jogoId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page(props: PageProps) {
  // No Next.js 15, precisamos dar await nos params
  const params = await props.params;
  const jogoId = params.jogoId;
  
  const supabase = await createClient();

  // 1. Buscamos os detalhes do jogo
  // Certifique-se de que a tabela no Supabase é 'partidas'
  const { data: jogo, error } = await supabase
    .from('partidas') 
    .select('*')
    .eq('id', jogoId)
    .single();

  // 2. Se houver erro ou não encontrar o jogo, disparar 404
  if (error || !jogo) {
    console.error("Erro ao buscar partida:", error);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      {/* O erro "Property 'jogoAtual' does not exist" deve sumir agora, 
        pois atualizamos a interface dentro do EscalacaoFormacao.tsx anteriormente.
      */}
      <EscalacaoFormacao jogoAtual={jogo} />
    </main>
  );
}
