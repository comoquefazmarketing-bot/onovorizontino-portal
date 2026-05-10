'use client';

import { useParams } from 'next/navigation';
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';

const ESCUDO_NOVORIZONTINO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_BOTAFOGO_SP = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Botafogo_sp.svg';

export default function EscalarJogoPage() {
  const params = useParams();
  const jogoId = params?.jogoId as string;
  
  return (
    <EscalacaoFormacao
      jogoId={13}
      mandante="Novorizontino"
      mandanteLogo={ESCUDO_NOVORIZONTINO}
      visitanteLogo={ESCUDO_BOTAFOGO_SP}
      mandanteNome="Novorizontino"
      rodada={8}
    />
  );
}
