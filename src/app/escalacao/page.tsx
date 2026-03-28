import type { Metadata } from 'next';
import EscalacaoIdeal from '@/components/sections/EscalacaoIdeal';

export const metadata: Metadata = {
  title: 'Monte sua Escalação Ideal | Grêmio Novorizontino',
  description: 'Monte a escalação ideal do Grêmio Novorizontino com os jogadores do elenco 2026. Compartilhe no Instagram!',
};

export default function EscalacaoPage() {
  return <EscalacaoIdeal />;
}
