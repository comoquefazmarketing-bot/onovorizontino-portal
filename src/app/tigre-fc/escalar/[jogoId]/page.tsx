// src/app/tigre-fc/escalar/[jogoId]/page.tsx
// Rota de escalação — Next.js 15 (params é Promise)
// Busca jogo + times direto do Supabase. Cadastrou novo jogo no banco? Funciona.
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';
import { supabase } from '@/lib/supabase';

interface Props {
  params: Promise<{ jogoId: string }>;
}

const ESCUDO_NOVORIZONTINO =
  'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

interface TimeRow {
  id: number;
  nome: string;
  escudo_url: string | null;
}

export default async function EscalacaoPage({ params }: Props) {
  const { jogoId } = await params;
  const numericId = Number(jogoId);

  // 1) Busca o jogo
  const { data: jogo, error: errJogo } = await supabase
    .from('jogos')
    .select('id, mandante_id, visitante_id, rodada, competicao')
    .eq('id', numericId)
    .maybeSingle();

  if (errJogo) {
    console.error('[EscalacaoPage] erro ao buscar jogo:', errJogo);
  }

  // 2) Busca os dois times de uma vez
  let mandante: TimeRow | null = null;
  let visitante: TimeRow | null = null;

  if (jogo) {
    const ids = [jogo.mandante_id, jogo.visitante_id].filter(
      (v): v is number => typeof v === 'number'
    );

    if (ids.length > 0) {
      const { data: times, error: errTimes } = await supabase
        .from('times_serie_b')
        .select('id, nome, escudo_url')
        .in('id', ids);

      if (errTimes) {
        console.error('[EscalacaoPage] erro ao buscar times:', errTimes);
      }

      if (times) {
        mandante  = times.find(t => t.id === jogo.mandante_id)  ?? null;
        visitante = times.find(t => t.id === jogo.visitante_id) ?? null;
      }
    }
  }

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <EscalacaoFormacao
        jogoId={jogoId}
        mandante={mandante?.nome ?? 'Mandante'}
        mandanteLogo={mandante?.escudo_url ?? ESCUDO_NOVORIZONTINO}
        visitante={visitante?.nome ?? 'Visitante'}
        visitanteLogo={visitante?.escudo_url ?? ESCUDO_NOVORIZONTINO}
        rodada={jogo?.rodada}
      />
    </main>
  );
}
