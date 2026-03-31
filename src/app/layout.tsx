import type { Metadata } from 'next';
import './globals.css';
import Ticker from '@/components/layout/Ticker';
import Script from 'next/script';
import Analytics from '@/components/layout/Analytics';
import LgpdBanner from '@/components/layout/LgpdBanner';
import TigreFCButton from '@/components/tigre-fc/TigreFCButton';
import ModoDesespero from '@/components/tigre-fc/ModoDesespero';

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
  verification: { 
    google: 'njrcPMAtFlMQ0Hnc7xZbC5QF-3Ru_nvADZINPMTPTCE',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="google-site-verification" content="njrcPMAtFlMQ0Hnc7xZbC5QF-3Ru_nvADZINPMTPTCE" />
        
        {/* Tag Meta do Google AdSense para conexão do site */}
        <meta name="google-adsense-account" content="ca-pub-8594673486819604" />

        {/* Script do Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8594673486819604"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'NewsMediaOrganization',
          name: 'Portal O Novorizontino', url: 'https://www.onovorizontino.com.br',
          logo: { '@type': 'ImageObject', url: 'https://www.onovorizontino.com.br/assets/logos/LOGO - O NOVORIZONTINO.png' },
          description: 'Portal de notícias do Grêmio Novorizontino — Tigre do Vale.',
          address: { '@type': 'PostalAddress', addressLocality: 'Novo Horizonte', addressRegion: 'SP', addressCountry: 'BR' },
        })}} />
      </head>
      <body className="bg-black antialiased flex flex-col min-h-screen">
        <Ticker />
        
        {/* Main wrapper para empurrar o footer para baixo */}
        <main className="flex-grow">
          {children}
        </main>

        <Analytics />
        <LgpdBanner />
        <TigreFCButton />
        <ModoDesespero />

        {/* --- RODAPÉ DE COMPLIANCE (ESSENCIAL PARA ADSENSE E REGULAÇÃO) --- */}
        <footer className="bg-zinc-950 text-zinc-500 py-10 px-6 border-t border-zinc-900 mt-10">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <h3 className="text-zinc-300 font-bold tracking-widest text-xs uppercase">Informativo Tigre FC</h3>
            <p className="text-[11px] leading-relaxed max-w-3xl mx-auto">
              O **Tigre FC** é um Fantasy Game de escalação com fins exclusivamente recreativos e informativos, focado no Grêmio Novorizontino. 
              <span className="text-yellow-600 block mt-1 font-medium"> 
                NÃO somos uma plataforma de apostas (BET). Não há transações financeiras, depósitos ou premiações em dinheiro. 
              </span>
              Este portal é um veículo de notícias independente. O jogo baseia-se puramente em habilidades de análise tática e desempenho esportivo real dos atletas.
            </p>
            <div className="pt-4 border-t border-zinc-900 text-[10px]">
              <p>© 2026 Portal O Novorizontino | Idealizado por <strong>Felipe Makarios</strong></p>
            </div>
          </div>
        </footer>

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
