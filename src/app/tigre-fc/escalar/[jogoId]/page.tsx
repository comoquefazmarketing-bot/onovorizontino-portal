import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

interface Props {
  params: { jogoId: string };
}

export default function EscalacaoPage({ params }: Props) {
  const jogoId = params.jogoId;

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <EscalacaoFormacao jogoId={jogoId} />
    </main>
  );
}
