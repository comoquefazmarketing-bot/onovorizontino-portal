// src/app/tigre-fc/escalar/[jogoId]/page.tsx
// Rota de escalação — usa ArenaTigreFC (componente premium completo)
// Next.js 15: params é Promise

import ArenaTigreFC from '@/components/tigre-fc/ArenaTigreFC';

interface Props {
  params: Promise<{ jogoId: string }>;
}

export default async function EscalacaoPage({ params }: Props) {
  // jogoId fica disponível pra salvar no Supabase quando o usuário concluir
  const { jogoId } = await params;

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden">
      <ArenaTigreFC />
    </main>
  );
}
