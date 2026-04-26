import EscalacaoFormacao from '../../../../components/EscalacaoFormacao'; 
// ou o caminho relativo correto até o arquivo EscalacaoFormacao.tsx

interface Props {
  params: { jogoId: string };
}

export default function EscalacaoPage({ params }: Props) {
  const jogoId = parseInt(params.jogoId);

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <EscalacaoFormacao jogoId={jogoId} />
    </main>
  );
}
