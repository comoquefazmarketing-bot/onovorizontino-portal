import { NextResponse } from 'next/server';

const NOVO_TEAM_ID = 36745;
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Referer': 'https://www.sofascore.com/',
};

export async function GET() {
  try {
    const res = await fetch(
      `https://api.sofascore.com/api/v1/team/${NOVO_TEAM_ID}/events/next/0`,
      { headers: HEADERS, next: { revalidate: 600 } }
    );

    if (!res.ok) throw new Error('Sofascore offline');

    const data = await res.json();
    const events: any[] = data.events || [];

    if (!events.length) {
      return NextResponse.json({ eventId: null });
    }

    const proximo = events.sort((a: any, b: any) => a.startTimestamp - b.startTimestamp)[0];

    return NextResponse.json({
      eventId: proximo.id,
      homeTeam: proximo.homeTeam?.name,
      awayTeam: proximo.awayTeam?.name,
      date: new Date(proximo.startTimestamp * 1000).toISOString(),
    });
  } catch {
    return NextResponse.json({ eventId: null });
  }
}
