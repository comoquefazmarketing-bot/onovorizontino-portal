'use client';

import { use } from 'react';
import TigreFCEscalar from '@/components/tigre-fc/TigreFCEscalar';

// Removemos a tentativa de passar jogoId como prop para o componente
// Isso elimina o erro de "Property jogoId does not exist"
export default function Page({ params }: { params: Promise<{ jogoId: string }> }) {
  // Apenas resolvemos os params para garantir que a rota funcione
  const resolvedParams = use(params);
  
  // Retornamos o componente puramente, como era antes
  return <TigreFCEscalar />;
}
