import { createClient } from '@/utils/supabase/server';
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ jogoId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { jogoId } = await params;
  const supabase = await createClient();

  // 1. Buscamos os detalhes do jogo para saber contra quem é (Escudo, Nome, Data)
  const { data: jogo, error } = await supabase
    .from('partidas') // Verifique se o nome da sua tabela é 'partidas' ou 'jogos'
    .select('*')
    .eq('id', jogoId)
    .single();

  if (error || !jogo) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Passamos o jogo encontrado para o componente poder mostrar o escudo do adversário correto */}
      <EscalacaoFormacao jogoAtual={jogo} />
    </div>
  );
}
