import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Verde e Amarelo — Seleção Brasileira | Portal O Novorizontino',
  description:
    'Acompanhe a Seleção Brasileira na Copa do Mundo 2026. Convocação de Ancelotti, elenco completo, agenda de jogos, notícias e muito mais.',
  keywords: [
    'Seleção Brasileira',
    'Copa do Mundo 2026',
    'Convocação Ancelotti',
    'Verde e Amarelo',
    'Hexa Brasil',
    'Vini Jr',
    'Endrick',
    'Raphinha',
    'Brasil 2026',
  ],
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Verde e Amarelo — Seleção Brasileira | Portal O Novorizontino',
    description: 'Convocação de Ancelotti, agenda, elenco e notícias da Seleção Brasileira na Copa do Mundo 2026.',
    url: 'https://www.onovorizontino.com.br/selecao',
    siteName: 'Portal O Novorizontino',
    locale: 'pt_BR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.onovorizontino.com.br/selecao',
  },
};
export default function SelecaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
