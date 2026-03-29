import TigreFCEscalar from '@/components/tigre-fc/TigreFCEscalar';

export default async function Page({ params }: { params: Promise<{ jogoId: string }> }) {
  const { jogoId } = await params;
  return <TigreFCEscalar jogoId={Number(jogoId)} />;
}
