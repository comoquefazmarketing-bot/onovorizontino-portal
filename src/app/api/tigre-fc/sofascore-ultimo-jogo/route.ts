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
      `https://api.sofascore.com/api/v1/team/${NOVO_TEAM_ID}/events/last/0`,
      { headers: HEADERS, next: { revalidate: 300 } } // cache 5 min
    );

    if (!res.ok) throw new Error('Sofascore offline');

    const data = await res.json();
    const finished = (data.events || [])
      .filter((e: any) => e.status?.type === 'finished')
      .sort((a: any, b: any) => b.startTimestamp - a.startTimestamp);

    if (!finished.length) {
      return NextResponse.json({ eventId: null });
    }

    const ultimo = finished[0];
    return NextResponse.json({
      eventId: ultimo.id,
      homeTeam: ultimo.homeTeam?.name,
      awayTeam: ultimo.awayTeam?.name,
      homeScore: ultimo.homeScore?.current ?? 0,
      awayScore: ultimo.awayScore?.current ?? 0,
      date: new Date(ultimo.startTimestamp * 1000).toISOString(),
    });
  } catch {
    // Fallback: retorna eventId null, o widget não será exibido
    return NextResponse.json({ eventId: null });
  }
}
