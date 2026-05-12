import type { Metadata } from 'next';
import VoxSportsPanel from '@/components/voxsports/VoxSportsPanel';

export const metadata: Metadata = {
  title: 'VoxSports — Fila de Copies | O Novorizontino',
  description: 'Painel interno de copies gerados pelo Léo para o ecossistema TigreFC.',
};

export default function VoxSportsPage() {
  return <VoxSportsPanel />;
}
