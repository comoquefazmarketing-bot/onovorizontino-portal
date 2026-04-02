'use client';

import { useState, useEffect, use } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

// 1. Definição da Interface para as Props do Componente
interface TigreFCEscalarProps {
  jogoId: number;
}

// 2. O Componente Interno (onde a lógica de escalar acontece)
// IMPORTANTE: Ele precisa receber { jogoId } como argumento
function TigreFCEscalar({ jogoId }: TigreFCEscalarProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <h1 className="text-[#F5C400] text-2xl font-black italic uppercase">
        Escalando Jogo: {jogoId}
      </h1>
      <p className="text-zinc-500 text-sm mt-2">
        Selecione os 11 titulares para este confronto.
      </p>
      
      {/* Aqui entra o restante da sua lógica de PLAYERS, campos e botões */}
      <div className="mt-10 border border-zinc-800 rounded-3xl p-20 text-center">
        O mercado para o jogo {jogoId} está aberto.
      </div>
    </div>
  );
}

// 3. A Página (Next.js Page)
// No Next.js 15, 'params' é uma Promise.
export default function Page({ params }: { params: Promise<{ jogoId: string }> }) {
  // Desempacota o jogoId da URL
  const resolvedParams = use(params);
  const idNumerico = Number(resolvedParams.jogoId);

  // Agora passamos o ID para o componente. 
  // O erro sumirá porque definimos 'TigreFCEscalarProps' acima.
  return <TigreFCEscalar jogoId={idNumerico} />;
}
