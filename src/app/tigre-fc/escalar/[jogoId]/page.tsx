import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

interface PageProps {
  params: Promise<{ jogoId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { jogoId } = await params;
  // EscalacaoFormacao não precisa de jogoId como prop — 
  // lê via useEscalacao internamente
  return <EscalacaoFormacao />;
}
