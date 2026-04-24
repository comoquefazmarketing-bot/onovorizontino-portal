import { createClient } from '@/utils/supabase/server';
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ jogoId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { jogoId } = await params;
  const supabase = await createClient();

  // Busca o jogo 11 (ou o ID da URL)
  const { data: jogo, error } = await supabase
    .from('partidas') // <--- SE O ERRO PERSISTIR, VERIFIQUE SE O NOME É 'jogos'
    .select('*')
    .eq('id', jogoId)
    .single();

  if (error || !jogo) {
    console.error("Erro ao buscar jogo:", error);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-black">
      <EscalacaoFormacao jogoAtual={jogo} />
    </main>
  );
}
