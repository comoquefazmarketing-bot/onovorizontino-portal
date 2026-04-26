// src/app/tigre-fc/escalar/[jogoId]/page.tsx
import EscalacaoFormacao from '@/components/EscalacaoFormacao'; // ajuste o caminho se necessário

interface Props {
  params: { jogoId: string };
}

export default function EscalacaoPage({ params }: Props) {
  const jogoId = parseInt(params.jogoId);

  if (isNaN(jogoId)) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Jogo inválido</div>;
  }

  return (
    <main className="min-h-screen bg-black">
      <EscalacaoFormacao jogoId={jogoId} />
    </main>
  );
}
