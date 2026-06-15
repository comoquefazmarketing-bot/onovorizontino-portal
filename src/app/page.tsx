// Server Component — home do portal
import type { Metadata } from 'next';
import PortalHeader  from '@/components/layout/PortalHeader';
import HomeHero      from '@/components/home/HomeHero';
import HomeNewsGrid  from '@/components/layout/HomeNewsGrid';
import ProximoJogo, { type JogoData } from '@/components/portal/ProximoJogo';
import Manifesto        from '@/components/sections/Manifesto';
import CTSection        from '@/components/sections/CTSection';
import TigreFCShowcase  from '@/components/sections/TigreFCShowcase';
import Footer        from '@/components/layout/Footer';

/* ── Metadata estática da home ──────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'O Novorizontino — Portal oficial da torcida',
  description:
    'Notícias, análises, escalações e o Tigre FC — o jogo oficial da torcida do Novorizontino. Acompanhe o Tigrão na Série B do Brasileirão.',
  metadataBase: new URL('https://www.onovorizontino.com.br'),
  alternates: {
    canonical: 'https://www.onovorizontino.com.br',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.onovorizontino.com.br',
    siteName: 'O Novorizontino',
    title: 'O Novorizontino — Portal oficial da torcida',
    description:
      'Notícias, análises, escalações e o Tigre FC — o jogo oficial da torcida do Novorizontino.',
    locale: 'pt_BR',
    images: [
      {
        url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png',
        width: 1200,
        height: 630,
        alt: 'O Novorizontino — Portal oficial da torcida',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'O Novorizontino — Portal oficial da torcida',
    description:
      'Notícias, análises, escalações e o Tigre FC — o jogo oficial da torcida do Novorizontino.',
    images: [
      'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png',
    ],
  },
  keywords: [
    'Novorizontino', 'Grêmio Novorizontino', 'Série B', 'Brasileirão',
    'futebol', 'torcida', 'notícias', 'Tigre FC', 'escalação',
  ],
  robots: { index: true, follow: true },
};

/* ── JSON-LD — Organization + WebSite ──────────────────────────────────── */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.onovorizontino.com.br/#organization',
      name: 'O Novorizontino',
      url: 'https://www.onovorizontino.com.br',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.onovorizontino.com.br/assets/logos/LOGO - O NOVORIZONTINO.png',
      },
      sameAs: ['https://www.instagram.com/onovorizontino'],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'redacao@onovorizontino.com.br',
        contactType: 'editorial',
        availableLanguage: 'Portuguese',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.onovorizontino.com.br/#website',
      url: 'https://www.onovorizontino.com.br',
      name: 'O Novorizontino',
      description: 'Portal oficial da torcida do Novorizontino',
      publisher: { '@id': 'https://www.onovorizontino.com.br/#organization' },
      inLanguage: 'pt-BR',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.onovorizontino.com.br/noticias?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

/* ── Fetch dados ────────────────────────────────────────────────────────── */
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const HEADERS = {
  apikey:        SUPA_KEY,
  Authorization: `Bearer ${SUPA_KEY}`,
  Accept:        'application/json',
};

async function fetchProximoJogo(): Promise<JogoData | null> {
  try {
    const cutoff = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
    const base = `${SUPA_URL}/rest/v1/jogos`
      + `?select=id,competicao,rodada,data_hora,finalizado,mandante_slug,visitante_slug,placar_mandante,placar_visitante`
      + `&finalizado=eq.false`;

    let res = await fetch(
      `${base}&data_hora=gte.${encodeURIComponent(cutoff)}&order=data_hora.asc&limit=1`,
      { headers: HEADERS, next: { revalidate: 60 } },
    );
    let jogos: any[] = await res.json();

    if (!jogos?.length) {
      res = await fetch(`${base}&order=data_hora.asc&limit=1`, {
        headers: HEADERS, next: { revalidate: 60 },
      });
      jogos = await res.json();
    }

    if (!jogos?.length) return null;
    const jogo = jogos[0];

    const slugs = [jogo.mandante_slug, jogo.visitante_slug]
      .filter(Boolean).map((s: string) => `"${s}"`).join(',');
    const timesRes = await fetch(
      `${SUPA_URL}/rest/v1/times_serie_b?select=slug,nome,escudo_url&slug=in.(${slugs})`,
      { headers: HEADERS, next: { revalidate: 3600 } },
    );
    const times: any[] = await timesRes.json();
    const bySlug: Record<string, any> = Object.fromEntries((times ?? []).map(t => [t.slug, t]));

    return {
      id: jogo.id,
      competicao: jogo.competicao,
      rodada: jogo.rodada,
      data_hora: jogo.data_hora,
      finalizado: jogo.finalizado,
      placar_mandante: jogo.placar_mandante,
      placar_visitante: jogo.placar_visitante,
      mandante:  bySlug[jogo.mandante_slug]  ?? { nome: jogo.mandante_slug  ?? '?', escudo_url: null },
      visitante: bySlug[jogo.visitante_slug] ?? { nome: jogo.visitante_slug ?? '?', escudo_url: null },
    };
  } catch {
    return null;
  }
}

/* ── Página ─────────────────────────────────────────────────────────────── */
export default async function Home() {
  const jogo = await fetchProximoJogo();

  return (
    <>
      {/* JSON-LD — injetado no <head> via script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PortalHeader />

      <main className="min-h-screen bg-bg">
        <ProximoJogo jogo={jogo} />
        <HomeHero />
        <HomeNewsGrid />
        <TigreFCShowcase />
        <Manifesto />
        <CTSection />
        <Footer />
      </main>
    </>
  );
}
