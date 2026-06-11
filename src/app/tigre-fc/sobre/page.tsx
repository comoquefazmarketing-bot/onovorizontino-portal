import type { Metadata } from 'next';
import TigreFCSobre from '@/components/tigre-fc/TigreFCSobre';

export const metadata: Metadata = {
  title: 'Tigre FC — O Fantasy do Novorizontino',
  description: 'Monta sua escalação, crava o placar e prova pra galera quem manja mais do Tigre do Vale. Grátis, fácil e pra todo torcedor.',
};

export default function Page() {
  return <TigreFCSobre />;
}
