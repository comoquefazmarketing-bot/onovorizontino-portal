// src/app/tigre-fc/escalar/[jogoId]/page.tsx
// Rota de escalação — Next.js 15 (params é Promise)
// IMPORTA O COMPONENTE NOVO (não o ArenaTigreFC velho)

import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

interface Props {
  params: Promise<{ jogoId: string }>;
}

export default async function EscalacaoPage({ params }: Props) {
  const { jogoId } = await params;

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <EscalacaoFormacao jogoId={jogoId} />
    </main>
  );
}
