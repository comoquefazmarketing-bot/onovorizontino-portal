import TigreFCEscalar from '@/components/tigre-fc/TigreFCEscalar';

interface Props {
  params: Promise<{ jogoId: string }>;
}

export default async function EscalacaoPage({ params }: Props) {
  const { jogoId } = await params;

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <TigreFCEscalar jogoId={jogoId} />
    </main>
  );
}
