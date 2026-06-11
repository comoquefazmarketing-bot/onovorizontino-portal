// src/app/tigre-fc/escalar/[jogoId]/page.tsx
import { createClient } from '@supabase/supabase-js';
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

interface Props {
  params: Promise<{ jogoId: string }>;
}

export default async function EscalacaoPage({ params }: Props) {
  const { jogoId } = await params;

  // Busca slugs server-side para evitar flash de escudo errado no client
  let mandanteSlug: string | undefined;
  let visitanteSlug: string | undefined;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const client = createClient(supabaseUrl, supabaseKey);
    const { data } = await client
      .from('jogos')
      .select('mandante_slug, visitante_slug')
      .eq('id', Number(jogoId))
      .maybeSingle();
    if (data) {
      mandanteSlug = data.mandante_slug ?? undefined;
      visitanteSlug = data.visitante_slug ?? undefined;
    }
  } catch { /* fallback: component faz o fetch client-side */ }

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <EscalacaoFormacao
        jogoId={jogoId}
        mandanteSlug={mandanteSlug}
        visitanteSlug={visitanteSlug}
      />
    </main>
  );
}
