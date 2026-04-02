'use client';

import { use } from 'react';
// IMPORTANTE: Se o seu componente estiver em outro arquivo, 
// ele precisa ser exportado aceitando a prop jogoId.
// Exemplo de como deve ser a definição dele:
// function TigreFCEscalar({ jogoId }: { jogoId: number }) { ... }

interface TigreFCEscalarProps {
  jogoId: number;
}

// Se o componente estiver NESTE arquivo, use esta estrutura:
function TigreFCEscalar({ jogoId }: TigreFCEscalarProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-10">
      <h1 className="text-[#F5C400] font-black italic uppercase text-2xl">
        CONVOCAÇÃO TIGRE FC - JOGO {jogoId}
      </h1>
      <div className="mt-8 p-10 border border-zinc-800 rounded-3xl text-center text-zinc-500">
        Carregando interface de escalação...
      </div>
    </div>
  );
}

// Esta é a função que o Next.js chama para a rota [jogoId]
export default function Page({ params }: { params: Promise<{ jogoId: string }> }) {
  // No Next.js 15, usamos o hook 'use' para desempacotar params em Client Components
  const resolvedParams = use(params);
  const idNumerico = Number(resolvedParams.jogoId);

  // Agora o TS aceita porque definimos TigreFCEscalarProps acima
  return <TigreFCEscalar jogoId={idNumerico} />;
}
