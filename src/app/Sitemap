import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: postagens } = await supabase
    .from('postagens')
    .select('slug, criado_em')
    .eq('status', 'published')
    .order('criado_em', { ascending: false });

  const postagens_urls = (postagens || []).map((post) => ({
    url: `https://www.onovorizontino.com.br/noticias/${post.slug}`,
    lastModified: new Date(post.criado_em),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://www.onovorizontino.com.br',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: 'https://www.onovorizontino.com.br/noticias',
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...postagens_urls,
  ];
}
