'use client';

import { use } from 'react';
import TigreFCEscalar from '@/components/tigre-fc/TigreFCEscalar';

export default function Page({ params }: { params: Promise<{ jogoId: string }> }) {
  // Apenas resolvemos a Promise dos parâmetros para manter a rota válida no Next.js 15
  use(params);

  // Chamamos o componente sem NENHUMA propriedade, exatamente como ele espera.
  return <TigreFCEscalar />;
}
