import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role para bypass RLS
);

const PTS = {
  gol: 8,
  assist: 5,
  titular: 2,
  clean_sheet: 5,
  amarelo: -2,
  vermelho: -5,
  placar_exato: 15,
  resultado_certo: 5,
  heroi: 10,
};

export async function POST(req: NextRequest) {
  // Proteção por secret header
  const secret = req.headers.get('x-admin-secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const body = await req.json();
  const { jogo_id, gols_mandante, gols_visitante, heroi_id, eventos } = body;
  // eventos: [{ player_id, tipo: 'gol'|'assist'|'amarelo'|'vermelho'|'titular'|'clean_sheet' }]

  if (!jogo_id || gols_mandante === undefined || gols_visitante === undefined) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  // 1. Salva resultado
  const { error: errRes } = await supabase.from('tigre_fc_resultados').upsert({
    jogo_id, gols_mandante, gols_visitante, heroi_id, eventos, processado: false
  }, { onConflict: 'jogo_id' });

  if (errRes) return NextResponse.json({ error: errRes.message }, { status: 500 });

  // 2. Busca todas as escalações do jogo
  const { data: escalacoes } = await supabase
    .from('tigre_fc_escalacoes')
    .select('id, usuario_id, lineup, capitao_id, heroi_id')
    .eq('jogo_id', jogo_id);

  // 3. Busca todos os palpites do jogo
  const { data: palpites } = await supabase
    .from('tigre_fc_palpites')
    .select('usuario_id, gols_mandante, gols_visitante')
    .eq('jogo_id', jogo_id);

  if (!escalacoes?.length) {
    return NextResponse.json({ message: 'Nenhuma escalação para processar', processados: 0 });
  }

  // Monta mapa de pontos por player_id a partir dos eventos
  const playerPoints: Record<number, number> = {};
  for (const ev of (eventos || [])) {
    if (!playerPoints[ev.player_id]) playerPoints[ev.player_id] = 0;
    playerPoints[ev.player_id] += PTS[ev.tipo as keyof typeof PTS] ?? 0;
  }

  // Determina resultado real
  const resultadoReal = gols_mandante > gols_visitante ? 'mandante' :
    gols_visitante > gols_mandante ? 'visitante' : 'empate';

  const pontuacoesParaInserir = [];
  const badgesParaInserir: any[] = [];
  const rankingRodada: { usuario_id: string; pts: number }[] = [];

  for (const esc of escalacoes) {
    const lineupObj = esc.lineup as Record<string, { id: number } | null>;
    const jogadoresEscalados = Object.values(lineupObj).filter(Boolean) as { id: number }[];

    // Pontos dos jogadores
    let ptsJogadores = 0;
    for (const j of jogadoresEscalados) {
      const ptsBrutos = playerPoints[j.id] ?? 0;
      const ehCapitao = j.id === esc.capitao_id;
      ptsJogadores += ehCapitao ? ptsBrutos * 2 : ptsBrutos;
    }

    // Pontos do palpite
    const palpiteUser = palpites?.find(p => p.usuario_id === esc.usuario_id);
    let ptsPalpite = 0;
    let acertouPlacar = false;
    let acertouResultado = false;

    if (palpiteUser) {
      const pResultado = palpiteUser.gols_mandante > palpiteUser.gols_visitante ? 'mandante' :
        palpiteUser.gols_visitante > palpiteUser.gols_mandante ? 'visitante' : 'empate';

      if (palpiteUser.gols_mandante === gols_mandante && palpiteUser.gols_visitante === gols_visitante) {
        ptsPalpite += PTS.placar_exato;
        acertouPlacar = true;
        acertouResultado = true;
        badgesParaInserir.push({ usuario_id: esc.usuario_id, tipo: 'cravou_placar', jogo_id });
      } else if (pResultado === resultadoReal) {
        ptsPalpite += PTS.resultado_certo;
        acertouResultado = true;
      }
    }

    // Pontos do herói
    let ptsHeroi = 0;
    let acertouHeroi = false;
    if (heroi_id && esc.heroi_id === heroi_id) {
      ptsHeroi = PTS.heroi;
      acertouHeroi = true;
      badgesParaInserir.push({ usuario_id: esc.usuario_id, tipo: 'heroi_certeiro', jogo_id });
    }

    const ptsTotal = ptsJogadores + ptsPalpite + ptsHeroi;

    pontuacoesParaInserir.push({
      usuario_id: esc.usuario_id,
      jogo_id,
      pts_jogadores: ptsJogadores,
      pts_palpite: ptsPalpite,
      pts_heroi: ptsHeroi,
      pts_total: ptsTotal,
      acertou_resultado: acertouResultado,
      acertou_placar_exato: acertouPlacar,
      acertou_heroi: acertouHeroi,
    });

    rankingRodada.push({ usuario_id: esc.usuario_id, pts: ptsTotal });
  }

  // 4. Insere pontuações
  await supabase.from('tigre_fc_pontuacoes').upsert(pontuacoesParaInserir, { onConflict: 'usuario_id,jogo_id' });

  // 5. Atualiza pontos_total dos usuários
  for (const p of pontuacoesParaInserir) {
    await supabase.rpc('incrementar_pontos_tigre_fc', {
      p_usuario_id: p.usuario_id,
      p_pontos: p.pts_total
    });
  }

  // 6. Craque da rodada (maior pontuação)
  rankingRodada.sort((a, b) => b.pts - a.pts);
  if (rankingRodada[0]) {
    badgesParaInserir.push({ usuario_id: rankingRodada[0].usuario_id, tipo: 'craque_rodada', jogo_id });
  }

  // Pódio top 3
  for (let i = 0; i < Math.min(3, rankingRodada.length); i++) {
    badgesParaInserir.push({ usuario_id: rankingRodada[i].usuario_id, tipo: 'podio_top3', jogo_id });
  }

  // 7. Insere badges
  if (badgesParaInserir.length) {
    await supabase.from('tigre_fc_badges').upsert(badgesParaInserir, { onConflict: 'usuario_id,tipo,jogo_id', ignoreDuplicates: true });
  }

  // 8. Marca resultado como processado
  await supabase.from('tigre_fc_resultados').update({ processado: true }).eq('jogo_id', jogo_id);

  // 9. Atualiza streaks e níveis
  for (const esc of escalacoes) {
    await atualizarNivel(esc.usuario_id);
  }

  return NextResponse.json({
    message: 'Resultado processado com sucesso!',
    processados: pontuacoesParaInserir.length,
    badges_gerados: badgesParaInserir.length,
    craque: rankingRodada[0],
  });
}

async function atualizarNivel(usuario_id: string) {
  const { data: user } = await supabase
    .from('tigre_fc_usuarios')
    .select('pontos_total')
    .eq('id', usuario_id)
    .single();

  if (!user) return;
  const pts = user.pontos_total;
  const nivel = pts >= 600 ? 'Lenda' : pts >= 300 ? 'Garra' : pts >= 100 ? 'Fiel' : 'Novato';

  await supabase.from('tigre_fc_usuarios').update({ nivel }).eq('id', usuario_id);
}
