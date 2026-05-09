// src/app/tigre-fc/escalar/[jogoId]/page.tsx
// Rota de escalação — Next.js 15 (params é Promise)
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

interface Props {
  params: Promise<{ jogoId: string }>;
}

// Mapeamento manual dos próximos jogos.
// Quando tiver tabela de jogos no Supabase, troca pela Solução B.
const JOGOS: Record<string, { mandante: string; mandanteLogo: string; rodada?: string }> = {
  '13': {
    mandante: 'Botafogo SP',
    mandanteLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Botafogo-SP.svg/640px-Botafogo-SP.svg.png',
    rodada: '37ª Rodada',
  },
  // adicione os outros jogos aqui:
  // '14': { mandante: 'Coritiba', mandanteLogo: '...', rodada: '38ª Rodada' },
  // '15': { mandante: 'Avaí', mandanteLogo: '...', rodada: '39ª Rodada' },
};

const ESCUDO_GENERICO =
  'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

export default async function EscalacaoPage({ params }: Props) {
  const { jogoId } = await params;
  const jogo = JOGOS[jogoId] ?? {
    mandante: 'Adversário',
    mandanteLogo: ESCUDO_GENERICO,
    rodada: undefined,
  };

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <EscalacaoFormacao
        jogoId={jogoId}
        mandante={jogo.mandante}
        mandanteLogo={jogo.mandanteLogo}
        rodada={jogo.rodada}
      />
    </main>
  );
}
