import TigreFCEscalar from '@/components/tigre-fc/TigreFCEscalar'; // Verifique se o caminho do componente está correto

interface PageProps {
  params: Promise<{ jogoId: string }>;
}

export default async function Page({ params }: PageProps) {
  // No Next.js 15, aguardamos os params
  const resolvedParams = await params;
  
  // Convertemos para número, já que o componente espera um number
  const jogoIdNumeric = parseInt(resolvedParams.jogoId, 10);

  // Agora passamos a propriedade 'jogoId' que o componente exige
  return <TigreFCEscalar jogoId={jogoIdNumeric} />;
}
