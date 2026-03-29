import type { Metadata } from 'next';
import './globals.css';
import Ticker from '@/components/layout/Ticker';
import Script from 'next/script';
import Analytics from '@/components/layout/Analytics';
import LgpdBanner from '@/components/layout/LgpdBanner';
import TigreFCButton from '@/components/tigre-fc/TigreFCButton';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.onovorizontino.com.br'),
  title: {
    default: 'Portal O Novorizontino | Notícias do Grêmio Novorizontino',
    template: '%s | Portal O Novorizontino',
  },
  description: 'O melhor portal de notícias do Grêmio Novorizontino. Acompanhe o Tigre do Vale na Série B 2026, resultados, escalações, transferências e análises táticas.',
  keywords: ['Grêmio Novorizontino','Novorizontino','Tigre do Vale','Novorizontino Série B 2026','Novorizontino notícias','Novo Horizonte futebol','Jorjão','Enderson Moreira','Portal O Novorizontino'],
  authors: [{ name: 'Felipe Makarios', url: 'https://www.onovorizontino.com.br' }],
  creator: 'Felipe Makarios',
  publisher: 'Portal O Novorizontino',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website', locale: 'pt_BR',
    url: 'https://www.onovorizontino.com.br',
    siteName: 'Portal O Novorizontino',
    title: 'Portal O Novorizontino | Notícias do Grêmio Novorizontino',
    description: 'O melhor portal de notícias do Grêmio Novorizontino. Tigre do Vale na Série B 2026.',
    images: [{ url: '/assets/logos/LOGO - O NOVORIZONTINO.png', width: 1200, height: 630, alt: 'Portal O Novorizontino' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portal O Novorizontino | Notícias do Grêmio Novorizontino',
    description: 'O melhor portal de notícias do Grêmio Novorizontino. Tigre do Vale na Série B 2026.',
    images: ['/assets/logos/LOGO - O NOVORIZONTINO.png'],
  },
  alternates: { canonical: 'https://www.onovorizontino.com.br' },
  verification: { google: 'njrcPMAtFlMQ0Hnc7xZbC5QF-3Ru_nvADZINPMTPTCE' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="google-site-verification" content="njrcPMAtFlMQ0Hnc7xZbC5QF-3Ru_nvADZINPMTPTCE" />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'NewsMediaOrganization',
          name: 'Portal O Novorizontino', url: 'https://www.onovorizontino.com.br',
          logo: { '@type': 'ImageObject', url: 'https://www.onovorizontino.com.br/assets/logos/LOGO - O NOVORIZONTINO.png' },
          description: 'Portal de notícias do Grêmio Novorizontino — Tigre do Vale.',
          address: { '@type': 'PostalAddress', addressLocality: 'Novo Horizonte', addressRegion: 'SP', addressCountry: 'BR' },
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'SportsTeam',
          name: 'Grêmio Novorizontino', alternateName: ['Novorizontino', 'Tigre do Vale'],
          sport: 'Futebol', url: 'https://www.gremionovorizontino.com.br',
          location: { '@type': 'Place', name: 'Estádio Doutor Jorge Ismael de Biasi', address: 'Novo Horizonte, SP, Brasil' },
        })}} />
      </head>
      <body className="bg-black antialiased">
        <Ticker />
        {children}
        <Analytics />
        <LgpdBanner />
        <TigreFCButton />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J10P2E3X5X"
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J10P2E3X5X');
        `}</Script>
      </body>
    </html>
  );
}
