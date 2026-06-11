// src/app/tigre-fc/perfil/[username]/page.tsx
import PerfilPublicoPage from './PerfilPublicoPage';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `@${username} — Tigre FC Fantasy League`,
    description: `Veja a escalação e pontuação de ${username} no Tigre FC — Fantasy League do Novorizontino.`,
    openGraph: {
      title: `Time de @${username} — Tigre FC`,
      description: 'Desafie esse torcedor! Monte seu time em onovorizontino.com.br/tigre-fc',
    },
  };
}

export default function Page() {
  return <PerfilPublicoPage />;
}
