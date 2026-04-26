import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

interface Props {
  params: { jogoId: string };
}

export default function EscalacaoPage({ params }: Props) {
  const jogoId = parseInt(params.jogoId);

  if (isNaN(jogoId)) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Jogo inválido
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <EscalacaoFormacao jogoId={jogoId} />
    </main>
  );
}
