import TigreFCPage from '@/components/tigre-fc/TigreFCPage';

export const metadata = {
  title: 'Tigre FC | Fantasy League Novorizontino',
  description: 'Monte sua escalação, crave o placar e dispute com os torcedores do Tigre do Vale.',
};

// Interface para o Next.js 15 reconhecer os parâmetros da rota
interface PageProps {
  params: Promise<{ jogoId?: string }>;
}

export default function Page({ params }: PageProps) {
  // Passamos a Promise 'params' para o componente filho, 
  // que usará o hook 'use()' para desempacotá-la.
  return <TigreFCPage params={params} />;
}
