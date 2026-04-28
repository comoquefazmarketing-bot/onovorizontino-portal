'use client';

import { usePathname } from 'next/navigation';
import Ticker from '@/components/layout/Ticker';

/**
 * Wrapper que renderiza o <Ticker /> APENAS na home ("/").
 *
 * Justificativa:
 * - O ticker (marquee de slogans) é decoração de branding pesada,
 *   adequada à home como "porta de entrada" do portal.
 * - Em páginas de leitura (notícia, escalação, expediente) ele
 *   compete com o conteúdo, distrai e consome bateria/CPU
 *   desnecessariamente.
 *
 * Por que um Client Component?
 * - usePathname() exige Client Component.
 * - Encapsular essa lógica aqui mantém o layout.tsx limpo e
 *   semântico, sem espalhar verificação de rota.
 *
 * Como funciona:
 * - Se a rota atual for "/", renderiza <Ticker />.
 * - Em qualquer outra rota, retorna null (DOM limpo).
 *
 * Para ajustar quais rotas mostram o ticker, edite a comparação:
 *   if (pathname !== '/' && !pathname.startsWith('/noticias')) return null;
 *   ↑ exemplo: mostrar em / e em /noticias (listagem)
 */
export default function TickerHomeOnly() {
  const pathname = usePathname();
  if (pathname !== '/') return null;
  return <Ticker />;
}
