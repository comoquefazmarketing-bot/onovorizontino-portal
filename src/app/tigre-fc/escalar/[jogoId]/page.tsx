'use client';

import { useParams } from 'next/navigation';
import EscalacaoFormacao from '@/components/EscalacaoFormacao';

// URLs dos escudos
const ESCUDO_NOVORIZONTINO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_BOTAFOGO_SP = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Botafogo_sp.svg';

export default function EscalarJogoPage() {
  const params = useParams();
  const jogoId = params?.jogoId as string;
  
  // Dados fixos do jogo 13 (Novorizontino vs Botafogo-SP - Rodada 8)
  // Se a URL tiver outro ID, ainda assim usamos os dados do jogo 13
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
