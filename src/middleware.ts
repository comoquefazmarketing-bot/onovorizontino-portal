import { NextRequest, NextResponse } from 'next/server';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Verifica slugs removidos apenas em rotas de notícias
  if (pathname.startsWith('/noticias/')) {
    const slug = decodeURIComponent(pathname.replace('/noticias/', '').split('/')[0]);
    if (!slug) return NextResponse.next();

    try {
      const res = await fetch(
        `${SUPA_URL}/rest/v1/slugs_removidos?slug=eq.${encodeURIComponent(slug)}&select=slug&limit=1`,
        {
          headers: {
            apikey: SUPA_ANON,
            Authorization: `Bearer ${SUPA_ANON}`,
          },
          // Cache de 5 minutos no Edge para não bater o DB em toda requisição
          next: { revalidate: 300 },
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return new NextResponse(
            'Este conteúdo foi removido permanentemente.',
            {
              status: 410,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' },
            },
          );
        }
      }
    } catch {
      // Falha silenciosa — deixa a requisição seguir normalmente
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/noticias/:slug+'],
};
