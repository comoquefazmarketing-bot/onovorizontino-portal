'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EscalacaoFormacao from '@/components/EscalacaoFormacao';
import { supabase } from '@/lib/supabase';

// Constantes de fallback, caso algo falhe
const ESCUDO_NOVORIZONTINO_FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_VISITANTE_FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Botafogo_sp.svg';

// Interfaces baseadas nas suas tabelas
interface Jogo {
  id: number;
  competicao: string;
  rodada: string;
  mandante_slug: string;
  visitante_slug: string;
  // ... outros campos, se precisar
}

interface Time {
  nome: string;
  escudo_url: string;
}

export default function EscalarJogoPage() {
  const params = useParams();
  const jogoId = params?.jogoId as string;

  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [timeMandante, setTimeMandante] = useState<Time | null>(null);
  const [timeVisitante, setTimeVisitante] = useState<Time | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarDados() {
      if (!jogoId) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Buscar os dados do JOGO pela ID
        const { data: jogoData, error: jogoError } = await supabase
          .from('jogos')
          .select('*')
          .eq('id', Number(jogoId))
          .single();

        if (jogoError) throw new Error(`Jogo ID ${jogoId} não encontrado.`);
        setJogo(jogoData);

        // 2. Buscar dados do TIME MANDANTE (usando o mandante_slug do jogo)
        const { data: mandanteData, error: mandanteError } = await supabase
          .from('times_serie_b')
          .select('nome, escudo_url')
          .eq('slug', jogoData.mandante_slug)
          .single();

        if (mandanteError) {
          console.warn(`Mandante "${jogoData.mandante_slug}" não achado no banco. Usando fallback.`);
          setTimeMandante({ nome: jogoData.mandante_slug, escudo_url: ESCUDO_NOVORIZONTINO_FALLBACK });
        } else {
          setTimeMandante(mandanteData);
        }

        // 3. Buscar dados do TIME VISITANTE (usando o visitante_slug do jogo)
        const { data: visitanteData, error: visitanteError } = await supabase
          .from('times_serie_b')
          .select('nome, escudo_url')
          .eq('slug', jogoData.visitante_slug)
          .single();

        if (visitanteError) {
          console.warn(`Visitante "${jogoData.visitante_slug}" não achado no banco. Usando fallback.`);
          setTimeVisitante({ nome: jogoData.visitante_slug, escudo_url: ESCUDO_VISITANTE_FALLBACK });
        } else {
          setTimeVisitante(visitanteData);
        }

      } catch (err) {
        console.error("Falha ao carregar dados:", err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido.');
        
        // Fallback completo em caso de erro crítico (ex: tabela vazia)
        setJogo({
          id: Number(jogoId),
          competicao: 'Série B 2026',
          rodada: '8',
          mandante_slug: 'novorizontino',
          visitante_slug: 'botafogo-sp',
        });
        setTimeMandante({ nome: 'Novorizontino', escudo_url: ESCUDO_NOVORIZONTINO_FALLBACK });
        setTimeVisitante({ nome: 'Botafogo-SP', escudo_url: ESCUDO_VISITANTE_FALLBACK });
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
  }, [jogoId]);

  // --- Estados de Carregamento e Erro ---
  if (loading) {
    return <div className="h-screen bg-black flex items-center justify-center text-yellow-400 font-black italic">CARREGANDO JOGO...</div>;
  }

  if (error || !jogo || !timeMandante || !timeVisitante) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <p className="text-red-500 mb-4 text-center">Erro: {error || 'Dados incompletos'}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold">
          Tentar Novamente
        </button>
      </div>
    );
  }

  // --- Renderização Principal (passando as props corretas para o componente de escalação) ---
  return (
    <EscalacaoFormacao
      jogoId={jogo.id}
      mandante={timeMandante.nome}
      mandanteLogo={timeMandante.escudo_url}
      visitanteLogo={timeVisitante.escudo_url}
      mandanteNome={timeMandante.nome}
      rodada={parseInt(jogo.rodada)}
    />
  );
}
