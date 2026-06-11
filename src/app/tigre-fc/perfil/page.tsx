"use client"; // Adicione isso no topo

import dynamic from 'next/dynamic';

// Importação dinâmica para evitar erro de hidratação e garantir que o componente carregue no cliente
const TigreFCPerfil = dynamic(() => import('@/components/tigre-fc/TigreFCPerfil'), { 
  ssr: false 
});

export default function Page() { 
  return <TigreFCPerfil />; 
}
