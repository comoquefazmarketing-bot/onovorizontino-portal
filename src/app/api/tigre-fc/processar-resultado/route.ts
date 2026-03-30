import { NextRequest, NextResponse } from 'next/server';

// Sofascore team ID do Novorizontino
const NOVO_TEAM_ID = 36745;

// Mapa Sofascore player name → nosso player ID
// Preenchido com os jogadores que temos
const PLAYER_MAP: Record<string, number> = {
  'César Augusto': 1, 'Jordi': 2, 'João Scapin': 3, 'Lucas Ribeiro': 4,
  'Lora': 5, 'Castrillón': 6, 'Arthur Barbosa': 7, 'Mayk': 8, 'Maykon Jesus': 9,
  'Dantas': 10, 'Eduardo Brock': 11, 'Patrick': 12, 'Gabriel Bahia': 13,
  'Carlinhos': 14, 'Alemão': 15, 'Renato Palm': 16, 'Alvariño': 17, 'Bruno Santana': 18,
  'Luís Oyama': 19, 'Léo Naldi': 20, 'Rômulo': 21, 'Matheus Bianqui': 22,
  'Juninho': 23, 'Tavinho': 24, 'Diego Galo': 25, 'Marlon': 26,
  'Hector Bianchi': 27, 'Nogueira': 28, 'Luiz Gabriel': 29, 'Jhones Kauê': 30,
  'Robson': 31, 'Vinícius Paiva': 32, 'Hélio Borges': 33, 'Jardiel': 34,
  'Nicolas Careca': 35, 'Titi Ortiz': 36, 'Diego Mathias': 37,
  'Carlão': 38, 'Ronald Barcellos': 39,
};

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Referer': 'https://www.sofascore.com/',
  'Cache-Control': 'no-cache',
};

function findPlayerId(name: string): number | null {
  // Busca exata
  if (PLAYER_MAP[name]) return PLAYER_MAP[name];
  // Busca parcial por sobrenome
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(PLAYER_MAP)) {
    if (k.toLowerCase().includes(lower) || lower.includes(k.toLowerCase().split(' ')[0].toLowerCase())) {
      return v;
    }
  }
  return null;
}

// GET /api/tigre-fc/buscar-resultado?jogo_id=X
// Busca o resultado mais recente do Novorizontino no Sofascore
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const jogoIdParam = searchParams.get('jogo_id');

  try {
    // 1. Busca os eventos recentes do Novorizontino
    const eventsRes = await fetch(
      `https://api.sofascore.com/api/v1/team/${NOVO_TEAM_ID}/events/last/0`,
      { headers: HEADERS, next: { revalidate: 0 } }
    );

    if (!eventsRes.ok) {
      return NextResponse.json({ error: 'Sofascore indisponível. Tente novamente.' }, { status: 503 });
    }

    const eventsData = await eventsRes.json();
    const events = eventsData.events || [];

    // 2. Pega o jogo mais recente finalizado
    const ultimoJogo = events
      .filter((e: any) => e.status?.type === 'finished')
      .sort((a: any, b: any) => b.startTimestamp - a.startTimestamp)[0];

    if (!ultimoJogo) {
      return NextResponse.json({ error: 'Nenhum jogo finalizado encontrado.' }, { status: 404 });
    }

    const sfEventId = ultimoJogo.id;
    const isHome = ultimoJogo.homeTeam?.id === NOVO_TEAM_ID;

    const gols_mandante = ultimoJogo.homeScore?.current ?? 0;
    const gols_visitante = ultimoJogo.awayScore?.current ?? 0;

    const mandante_nome = ultimoJogo.homeTeam?.name || '';
    const visitante_nome = ultimoJogo.awayTeam?.name || '';
    const data = new Date(ultimoJogo.startTimestamp * 1000).toISOString();

    // 3. Busca incidentes (gols, cartões)
    const incRes = await fetch(
      `https://api.sofascore.com/api/v1/event/${sfEventId}/incidents`,
      { headers: HEADERS, next: { revalidate: 0 } }
    );

    const incData = await incRes.json();
    const incidents = incData.incidents || [];

    const eventos: { player_id: number; tipo: string; nome: string }[] = [];
    let heroiId: number | null = null;
    let heroiNome = '';
    let maxGolsEvento = 0;

    for (const inc of incidents) {
      const isNovoPlayer = isHome
        ? inc.isHome === true
        : inc.isHome === false;

      if (!isNovoPlayer) continue;

      const playerName = inc.player?.name || inc.playerName || '';
      const playerId = findPlayerId(playerName);

      if (inc.incidentType === 'goal' || inc.incidentType === 'penalty') {
        if (playerId) {
          eventos.push({ player_id: playerId, tipo: 'gol', nome: playerName });
          // Herói = jogador com mais gols
          const count = eventos.filter(e => e.player_id === playerId && e.tipo === 'gol').length;
          if (count > maxGolsEvento) { maxGolsEvento = count; heroiId = playerId; heroiNome = playerName; }
        }
      }

      if (inc.incidentType === 'card') {
        if (playerId) {
          const tipo = inc.cardType === 'yellow' ? 'amarelo' : 'vermelho';
          eventos.push({ player_id: playerId, tipo, nome: playerName });
        }
      }
    }

    // 4. Busca lineups (titulares)
    const lineupRes = await fetch(
      `https://api.sofascore.com/api/v1/event/${sfEventId}/lineups`,
      { headers: HEADERS, next: { revalidate: 0 } }
    );

    const lineupData = await lineupRes.json();
    const novoLineup = isHome ? lineupData.home : lineupData.away;

    const titulares: string[] = [];
    if (novoLineup?.players) {
      for (const p of novoLineup.players) {
        if (p.substitute === false) {
          const name = p.player?.name || '';
          const pid = findPlayerId(name);
          if (pid) {
            eventos.push({ player_id: pid, tipo: 'titular', nome: name });
            titulares.push(name);
          }
        }
      }
    }

    // 5. Herói final = jogador com maior avaliação do Sofascore
    if (novoLineup?.players) {
      let maxRating = 0;
      for (const p of novoLineup.players) {
        const rating = p.statistics?.rating || 0;
        if (rating > maxRating) {
          maxRating = rating;
          const name = p.player?.name || '';
          const pid = findPlayerId(name);
          if (pid) { heroiId = pid; heroiNome = name; }
        }
      }
    }

    return NextResponse.json({
      encontrado: true,
      sofascore_event_id: sfEventId,
      mandante: mandante_nome,
      visitante: visitante_nome,
      gols_mandante,
      gols_visitante,
      data,
      heroi_id: heroiId,
      heroi_nome: heroiNome,
      eventos: eventos.map(({ player_id, tipo }) => ({ player_id, tipo })),
      eventos_detalhados: eventos,
      titulares,
      aviso: eventos.filter(e => !e.player_id).length > 0
        ? `${eventos.filter(e => !e.player_id).length} jogador(es) não identificado(s) — verifique manualmente`
        : null,
    });

  } catch (err: any) {
    return NextResponse.json({
      error: 'Erro ao buscar dados do Sofascore',
      detalhe: err?.message || 'Erro desconhecido'
    }, { status: 500 });
  }
}
