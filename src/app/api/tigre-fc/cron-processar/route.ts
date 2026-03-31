import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NOVO_TEAM_ID = 36745;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Referer': 'https://www.sofascore.com/',
};

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

function findPlayerId(name: string): number | null {
  if (PLAYER_MAP[name]) return PLAYER_MAP[name];
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(PLAYER_MAP)) {
    const parts = k.toLowerCase().split(' ');
    if (parts.some(p => lower.includes(p) && p.length > 3)) return v;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const log: string[] = [];
  log.push(`🕐 Cron iniciado: ${new Date().toISOString()}`);

  try {
    const { data: jogosAtivos } = await supabase
      .from('jogos')
      .select('id, competicao, data_hora, mandante_slug, visitante_slug')
      .eq('ativo', true)
      .lt('data_hora', new Date().toISOString())
      .order('data_hora', { ascending: false })
      .limit(5);

    if (!jogosAtivos?.length) {
      log.push('ℹ️ Nenhum jogo para processar');
      return NextResponse.json({ log });
    }

    for (const jogo of jogosAtivos) {
      const { count: escalacoes } = await supabase
        .from('tigre_fc_escalacoes')
        .select('id', { count: 'exact', head: true })
        .eq('jogo_id', jogo.id);

      if (!escalacoes || escalacoes === 0) {
        log.push(`⏭️ Jogo ${jogo.id} sem escalações — pulando`);
        continue;
      }

      const { data: jaProcessado } = await supabase
        .from('tigre_fc_resultados')
        .select('id, processado')
        .eq('jogo_id', jogo.id)
        .single();

      if (jaProcessado?.processado) {
        log.push(`✅ Jogo ${jogo.id} já processado — pulando`);
        continue;
      }

      const inicio = new Date(jogo.data_hora);
      const agora = new Date();
      const minutosDecorridos = (agora.getTime() - inicio.getTime()) / 60000;

      if (minutosDecorridos < 90) {
        log.push(`⏳ Jogo ${jogo.id} ainda em andamento (${Math.round(minutosDecorridos)} min) — aguardando`);
        continue;
      }

      log.push(`🔍 Buscando resultado do jogo ${jogo.id} no Sofascore...`);

      const eventsRes = await fetch(
        `https://api.sofascore.com/api/v1/team/${NOVO_TEAM_ID}/events/last/0`,
        { headers: HEADERS }
      );

      if (!eventsRes.ok) {
        log.push(`❌ Sofascore indisponível (${eventsRes.status})`);
        continue;
      }

      const eventsData = await eventsRes.json();
      const sfJogos = (eventsData.events || []).filter((e: any) => e.status?.type === 'finished');

      const jogoData = new Date(jogo.data_hora);
      const sfJogo = sfJogos.find((e: any) => {
        const sfData = new Date(e.startTimestamp * 1000);
        const diffH = Math.abs(sfData.getTime() - jogoData.getTime()) / 3600000;
        return diffH < 4;
      });

      if (!sfJogo) {
        log.push(`❌ Jogo ${jogo.id} não encontrado no Sofascore`);
        continue;
      }

      const sfEventId = sfJogo.id;
      const isHome = sfJogo.homeTeam?.id === NOVO_TEAM_ID;
      const gols_mandante = sfJogo.homeScore?.current ?? 0;
      const gols_visitante = sfJogo.awayScore?.current ?? 0;

      log.push(`⚽ Placar: ${sfJogo.homeTeam?.name} ${gols_mandante} × ${gols_visitante} ${sfJogo.awayTeam?.name}`);

      const incRes = await fetch(
        `https://api.sofascore.com/api/v1/event/${sfEventId}/incidents`,
        { headers: HEADERS }
      );
      const incData = await incRes.json();
      const incidents = incData.incidents || [];
      const eventos: { player_id: number; tipo: string }[] = [];
      let heroiId: number | null = null;
      let maxRating = 0;

      for (const inc of incidents) {
        const isNovo = isHome ? inc.isHome === true : inc.isHome === false;
        if (!isNovo) continue;
        const pid = findPlayerId(inc.player?.name || '');
        if (!pid) continue;

        if (inc.incidentType === 'goal' || inc.incidentType === 'penalty') {
          eventos.push({ player_id: pid, tipo: 'gol' });
        }
        if (inc.incidentType === 'card') {
          eventos.push({ player_id: pid, tipo: inc.cardType === 'yellow' ? 'amarelo' : 'vermelho' });
        }
      }

      const lineupRes = await fetch(
        `https://api.sofascore.com/api/v1/event/${sfEventId}/lineups`,
        { headers: HEADERS }
      );
      const lineupData = await lineupRes.json();
      const novoLineup = isHome ? lineupData.home : lineupData.away;

      if (novoLineup?.players) {
        for (const p of novoLineup.players) {
          if (p.substitute === false) {
            const pid = findPlayerId(p.player?.name || '');
            if (pid) eventos.push({ player_id: pid, tipo: 'titular' });
          }
          const rating = p.statistics?.rating || 0;
          if (rating > maxRating) {
            const pid = findPlayerId(p.player?.name || '');
            if (pid) { maxRating = rating; heroiId = pid; }
          }
        }
      }

      const novoGolsSofridos = isHome ? gols_visitante : gols_mandante;
      if (novoGolsSofridos === 0) {
        const gols = novoLineup?.players?.filter((p: any) => p.substitute === false) || [];
        for (const p of gols.slice(0, 5)) {
          const pid = findPlayerId(p.player?.name || '');
          if (pid) eventos.push({ player_id: pid, tipo: 'clean_sheet' });
        }
      }

      log.push(`📊 ${eventos.length} eventos coletados · Herói ID: ${heroiId}`);

      const processRes = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.onovorizontino.com.br'}/api/tigre-fc/processar-resultado`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-admin-secret': process.env.ADMIN_SECRET || '' },
          body: JSON.stringify({ jogo_id: jogo.id, gols_mandante, gols_visitante, heroi_id: heroiId, eventos }),
        }
      );

      const processData = await processRes.json();

      if (processData.error) {
        log.push(`❌ Erro ao processar: ${processData.error}`);
      } else {
        log.push(`✅ Jogo ${jogo.id} processado! ${processData.processados} usuários pontuados · ${processData.badges_gerados} badges`);
      }
    }

  } catch (err: any) {
    log.push(`❌ Erro geral: ${err?.message}`);
  }

  log.push(`🏁 Cron finalizado: ${new Date().toISOString()}`);

  // CORREÇÃO AQUI: Salvando log sem quebrar o build
  try {
    await supabase.from('tigre_fc_cron_logs').upsert({
      executado_em: new Date().toISOString(),
      log: log.join('\n'),
    });
  } catch (e) {
    console.error("Falha ao salvar log da cron:", e);
  }

  return NextResponse.json({ log, ok: true });
}
