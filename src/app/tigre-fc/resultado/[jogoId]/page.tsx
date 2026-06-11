import TigreFCResultado from '@/components/tigre-fc/TigreFCResultado';
export default async function Page({ params }: { params: Promise<{ jogoId: string }> }) {
  const { jogoId } = await params;
  return <TigreFCResultado jogoId={Number(jogoId)} />;
}
