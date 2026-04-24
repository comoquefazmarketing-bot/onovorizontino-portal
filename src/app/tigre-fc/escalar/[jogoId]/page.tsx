// src/app/tigre-fc/escalar/[jogoId]/page.tsx

import { notFound } from 'next/navigation';
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const HEADERS   = { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` };

async function jogoExiste(jogoId: string): Promise<boolean> {
  // Se for "proximo" não precisa validar
  if (jogoId === 'proximo') return true;

  const id = Number(jogoId);
  if (isNaN(id)) return false;

  const res  = await fetch(
    `${SUPA_URL}/rest/v1/jogos?id=eq.${id}&select=id&limit=1`,
    { headers: HEADERS, cache: 'no-store' }
  );
  const data = await res.json();
  return Array.isArray(data) && data.length > 0;
}

export default async function EscalarPage({
  params,
}: {
  params: Promise<{ jogoId: string }>;
}) {
  const { jogoId } = await params;

  const existe = await jogoExiste(jogoId);
  if (!existe) notFound();

  // Passa apenas o jogoId numérico (ou undefined para "proximo")
  const jogoIdNum = jogoId === 'proximo' ? undefined : Number(jogoId);

  return (
    <main className="min-h-screen bg-black">
      <EscalacaoFormacao jogoId={jogoIdNum} />
    </main>
  );
}
