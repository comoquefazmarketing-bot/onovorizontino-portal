// src/app/api/shorts/route.ts
// Busca os Shorts mais recentes do canal @ONovorizontino via RSS do YouTube.
// Sem API key necessária — RSS público, revalidado a cada 2h.

import { NextResponse } from 'next/server';

const CHANNEL_ID = 'UCUQG_P8Y_POiYW7LqAldQVg';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Shorts conhecidos do canal como fallback offline
const FALLBACK_SHORTS = [
  { youtube_id: '2ds_0uOHlu0', titulo: 'Hino e Torcida no Jorjão' },
  { youtube_id: 'yP-BeKxW4wY', titulo: 'Bastidores do Acesso' },
  { youtube_id: 'j983i0Sww2Y', titulo: 'Gol da Vitória' },
  { youtube_id: 'y67NY0bJ-Yk', titulo: 'Preparação Intensiva' },
  { youtube_id: 'PLCfkciq3TE', titulo: 'Grito de Guerra Tigre' },
];

export const dynamic = 'force-dynamic';
export const revalidate = 7200; // 2h

export async function GET() {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 7200 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portal/1.0)' },
    });

    if (!res.ok) throw new Error(`RSS status ${res.status}`);

    const xml = await res.text();

    // Extrai entradas do feed
    const entries: { youtube_id: string; titulo: string; thumbnail: string }[] = [];
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let m: RegExpExecArray | null;

    while ((m = entryRegex.exec(xml)) !== null && entries.length < 8) {
      const block = m[1];
      const idM    = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(block);
      const titleM = /<title>([^<]+)<\/title>/.exec(block);
      if (!idM || !titleM) continue;

      const id    = idM[1].trim();
      const title = titleM[1].trim()
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"');

      entries.push({
        youtube_id: id,
        titulo:    title,
        thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
      });
    }

    if (entries.length === 0) {
      return NextResponse.json(FALLBACK_SHORTS, {
        headers: { 'Cache-Control': 'no-store' },
      });
    }

    return NextResponse.json(entries, {
      headers: { 'Cache-Control': 'public, s-maxage=7200, stale-while-revalidate=3600' },
    });
  } catch (err) {
    console.error('[/api/shorts]', err);
    return NextResponse.json(FALLBACK_SHORTS, {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
