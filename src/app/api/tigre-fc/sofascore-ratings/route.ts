// Busca ratings de jogadores do Novorizontino em uma partida do SofaScore.
// GET ?eventId=15526076
// Retorna: { capitao, heroi, players } — ordenados por rating decrescente
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const NOVO_TEAM_ID = 36745;
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Referer': 'https://www.sofascore.com/',
};

interface SofaPlayer {
  sofaId: number;
  nome: string;
  nomeShort: string;
  posicao: string;
  rating: number | null;
  gols: number;
  assists: number;
  minutosJogados: number;
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('eventId');
  if (!eventId) {
    return NextResponse.json({ erro: 'Parâmetro eventId obrigatório.' }, { status: 400 });
  }

  try {
    const [lineupsRes, statsRes] = await Promise.allSettled([
      fetch(`https://api.sofascore.com/api/v1/event/${eventId}/lineups`, { headers: HEADERS }),
      fetch(`https://api.sofascore.com/api/v1/event/${eventId}/player-statistics/1/used`, { headers: HEADERS }),
    ]);

    if (lineupsRes.status !== 'fulfilled' || !lineupsRes.value.ok) {
      return NextResponse.json({ erro: 'SofaScore indisponível ou jogo sem lineup.' }, { status: 503 });
    }

    const lineupsData = await lineupsRes.value.json();

    // Identifica qual time é o Novorizontino (home ou away)
    const homeId = lineupsData.home?.team?.id;
    const awayId = lineupsData.away?.team?.id;
    const novoSide = homeId === NOVO_TEAM_ID ? 'home' : awayId === NOVO_TEAM_ID ? 'away' : null;

    if (!novoSide) {
      return NextResponse.json({ erro: 'Novorizontino não encontrado neste evento.' }, { status: 404 });
    }

    const rawPlayers: any[] = [
      ...(lineupsData[novoSide]?.players ?? []),
      ...(lineupsData[novoSide]?.missingPlayers ?? []),
    ];

    // Monta mapa de stats se disponível
    let statsMap: Record<number, any> = {};
    if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
      const statsData = await statsRes.value.json();
      const novoStats: any[] = statsData?.playerStats?.[novoSide === 'home' ? 'homeTeam' : 'awayTeam'] ?? [];
      novoStats.forEach((s: any) => {
        if (s?.player?.id) statsMap[s.player.id] = s.statistics;
      });
    }

    const players: SofaPlayer[] = rawPlayers
      .filter((p: any) => p?.player?.id && p?.statistics !== undefined || p?.player?.id)
      .map((p: any) => {
        const s = p.statistics ?? statsMap[p.player.id] ?? {};
        return {
          sofaId:          p.player.id,
          nome:            p.player.name ?? p.player.shortName ?? '',
          nomeShort:       p.player.shortName ?? p.player.name ?? '',
          posicao:         p.position ?? p.positionName ?? '?',
          rating:          s.rating ? parseFloat(s.rating.toFixed(2)) : null,
          gols:            s.goals ?? 0,
          assists:         s.goalAssist ?? 0,
          minutosJogados:  s.minutesPlayed ?? 0,
        };
      })
      .filter(p => p.minutosJogados > 0 || p.rating !== null)
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    const capitao = players[0] ?? null;
    const heroi   = players[1] ?? null;

    return NextResponse.json({
      eventId: Number(eventId),
      novoSide,
      capitao,
      heroi,
      players,
      totalJogadores: players.length,
      jogo: {
        homeName: lineupsData.home?.team?.name ?? '',
        awayName: lineupsData.away?.team?.name ?? '',
      },
    });
  } catch (err) {
    console.error('[sofascore-ratings]', err);
    return NextResponse.json({ erro: 'Erro interno ao buscar ratings.' }, { status: 500 });
  }
}
