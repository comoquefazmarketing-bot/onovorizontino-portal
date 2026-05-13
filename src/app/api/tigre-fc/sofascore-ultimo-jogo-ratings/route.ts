// Busca o último jogo do Novorizontino e retorna os ratings dos jogadores.
// Identifica automaticamente o capitão (maior nota) e herói (segunda maior nota).
// Usado pelo escritório virtual e pelo cron pós-jogo.
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const NOVO_TEAM_ID = 36745;
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Referer': 'https://www.sofascore.com/',
};

export async function GET() {
  try {
    // 1. Busca o último jogo finalizado
    const eventsRes = await fetch(
      `https://api.sofascore.com/api/v1/team/${NOVO_TEAM_ID}/events/last/0`,
      { headers: HEADERS },
    );
    if (!eventsRes.ok) throw new Error('SofaScore offline');

    const eventsData = await eventsRes.json();
    const finished = (eventsData.events ?? [])
      .filter((e: any) => e.status?.type === 'finished')
      .sort((a: any, b: any) => b.startTimestamp - a.startTimestamp);

    if (!finished.length) {
      return NextResponse.json({ capitao: null, heroi: null, players: [], mensagem: 'Nenhum jogo finalizado encontrado.' });
    }

    const ultimo = finished[0];
    const eventId = ultimo.id;
    const homeId  = ultimo.homeTeam?.id;
    const novoSide = homeId === NOVO_TEAM_ID ? 'home' : 'away';

    // 2. Busca lineups (contém ratings por jogador)
    const lineupsRes = await fetch(
      `https://api.sofascore.com/api/v1/event/${eventId}/lineups`,
      { headers: HEADERS },
    );
    if (!lineupsRes.ok) throw new Error('Lineups indisponíveis');

    const lineupsData = await lineupsRes.json();
    const rawPlayers: any[] = lineupsData[novoSide]?.players ?? [];

    const players = rawPlayers
      .map((p: any) => ({
        sofaId:         p.player?.id,
        nome:           p.player?.name ?? '',
        nomeShort:      p.player?.shortName ?? p.player?.name ?? '',
        posicao:        p.position ?? '?',
        rating:         p.statistics?.rating ? parseFloat(p.statistics.rating.toFixed(2)) : null,
        gols:           p.statistics?.goals ?? 0,
        assists:        p.statistics?.goalAssist ?? 0,
        minutosJogados: p.statistics?.minutesPlayed ?? 0,
      }))
      .filter(p => p.sofaId && (p.minutosJogados > 0 || p.rating !== null))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    const capitao = players[0] ?? null;
    const heroi   = players[1] ?? null;

    return NextResponse.json({
      eventId,
      jogo: {
        mandante:    ultimo.homeTeam?.name ?? '',
        visitante:   ultimo.awayTeam?.name ?? '',
        placar:      `${ultimo.homeScore?.current ?? '?'} × ${ultimo.awayScore?.current ?? '?'}`,
        data:        new Date(ultimo.startTimestamp * 1000).toLocaleDateString('pt-BR'),
        novoSide,
      },
      capitao,
      heroi,
      players,
      resumo: capitao
        ? `🏆 Capitão: ${capitao.nomeShort} (${capitao.rating ?? '?'}) | 🔥 Herói: ${heroi?.nomeShort ?? '—'} (${heroi?.rating ?? '?'})`
        : 'Ratings ainda não disponíveis para este jogo.',
    });
  } catch (err) {
    console.error('[sofascore-ultimo-jogo-ratings]', err);
    return NextResponse.json({ erro: String(err), capitao: null, heroi: null, players: [] }, { status: 500 });
  }
}
