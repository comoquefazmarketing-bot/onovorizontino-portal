'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EscalacaoFormacao from '@/components/tigre-fc/EscalacaoFormacao';
import { supabase } from '@/lib/supabase';

const ESCUDO_PADRAO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';

export default function EscalarJogoPage() {
  const params = useParams();
  const jogoId = params?.jogoId as string;
  
  const [jogo, setJogo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function buscarJogo() {
      if (!jogoId) {
        setError(true);
        setLoading(false);
        return;
      }
      
      try {
        console.log('Buscando jogo ID:', jogoId);
        
        // Busca o jogo pelo ID da URL
        const { data, error: supabaseError } = await supabase
          .from('jogos')
          .select(`
            id,
            rodada,
            mandante_slug,
            visitante_slug,
            mandante:times_serie_b!mandante_slug(nome, escudo_url),
            visitante:times_serie_b!visitante_slug(nome, escudo_url)
          `)
          .eq('id', Number(jogoId))
          .single();
        
        if (supabaseError) {
          console.error('Erro ao buscar jogo:', supabaseError);
          setError(true);
        } else if (data) {
          console.log('Jogo encontrado:', data);
          setJogo(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erro:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    
    buscarJogo();
  }, [jogoId]);

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-yellow-400 font-black italic">
        CARREGANDO JOGO...
      </div>
    );
  }

  if (error || !jogo) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center p-4">
        <p className="text-red-500 mb-4">Erro ao carregar o jogo {jogoId}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  // Renderiza o componente com os dados do jogo
  return (
    <EscalacaoFormacao
      jogoId={jogo.id}
      mandante={jogo.mandante?.nome || 'Novorizontino'}
      mandanteLogo={jogo.mandante?.escudo_url || ESCUDO_PADRAO}
      visitanteLogo={jogo.visitante?.escudo_url || ESCUDO_PADRAO}
      mandanteNome={jogo.mandante?.nome || 'Novorizontino'}
      rodada={parseInt(jogo.rodada) || 8}
    />
  );
}
