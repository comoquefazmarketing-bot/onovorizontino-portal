import { MetadataRoute } from 'next';

const BASE = 'https://www.onovorizontino.com.br';
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const revalidate = 3600; // regenera a cada hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Busca postagens via REST (sem cookie/auth — compatível com edge/ISR)
  let postagensUrls: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `${SUPA_URL}/rest/v1/postagens?select=slug,criado_em&status=eq.published&order=criado_em.desc&limit=500`,
      {
        headers: {
          apikey: SUPA_KEY,
          Authorization: `Bearer ${SUPA_KEY}`,
        },
        next: { revalidate: 3600 },
      },
    );
    const data: { slug: string; criado_em: string }[] = await res.json();
    postagensUrls = (data ?? []).map(p => ({
      url: `${BASE}/noticias/${p.slug}`,
      lastModified: new Date(p.criado_em),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch { /* retorna só as estáticas */ }

  const estaticas: MetadataRoute.Sitemap = [
    { url: BASE,                                   lastModified: new Date(), changeFrequency: 'hourly',  priority: 1.0 },
    { url: `${BASE}/noticias`,                     lastModified: new Date(), changeFrequency: 'hourly',  priority: 0.9 },
    { url: `${BASE}/tigre-fc`,                     lastModified: new Date(), changeFrequency: 'daily',   priority: 0.85 },
    { url: `${BASE}/videos`,                       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/tabela`,                       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.7 },
    { url: `${BASE}/sobre`,                        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/politica-de-privacidade`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/termos-de-uso`,                lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/expediente-portal-o-novorizontino`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ];

  return [...estaticas, ...postagensUrls];
}
