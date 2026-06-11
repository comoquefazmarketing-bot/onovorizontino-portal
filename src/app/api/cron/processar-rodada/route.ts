// Cron: processa pontuação de jogos encerrados
// Schedule: a cada 15 min (vercel.json)
// Idempotente: pontuado=true e UNIQUE(usuario_id,jogo_id) protegem contra dupla execução

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { calcularPontuacao, type EstatisticasJogador } from '@/lib/tigre-fc/regras-pontuacao';
import { getEventLineups, findSofaEventId } from '@/lib/tigre-fc/sofascore-client';

function auth(req: NextRequest): boolean {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  return secret === process.env.CRON_SECRET ||
    req.nextUrl.searchParams.get('secret') === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const inicio = Date.now();
  let processados = 0, erros = 0;

  // Busca jogos encerrados ainda não pontuados
  const { data: jogos, error: errJogos } = await supabaseAdmin
    .from('jogos')
    .select('id, external_id, sofa_id, data_hora, placar_mandante, placar_visitante, mandante_slug')
    .eq('status', 'encerrado')
    .eq('pontuado', false)
    .not('placar_mandante', 'is', null)
    .not('placar_visitante', 'is', null);

  if (errJogos) return NextResponse.json({ error: errJogos.message }, { status: 500 });
  if (!jogos?.length) return NextResponse.json({ ok: true, processados: 0 });

  for (const jogo of jogos) {
    try {
      // Advisory lock no Postgres para evitar dupla execução simultânea
      await supabaseAdmin.rpc('pg_advisory_xact_lock', { key: jogo.id });

      // Confirma que ainda não foi pontuado (checagem pós-lock)
      const { data: check } = await supabaseAdmin
        .from('jogos')
        .select('pontuado')
        .eq('id', jogo.id)
        .single();
      if (check?.pontuado) continue;

      // Busca escalações deste jogo
      const { data: escalacoes } = await supabaseAdmin
        .from('tigre_fc_escalacoes')
        .select('id, usuario_id, lineup, capitao_id, heroi_id, palpite_tigre, palpite_adv')
        .eq('jogo_id', jogo.id);

      if (!escalacoes?.length) {
        // Sem escalações — marca como pontuado e segue
        await supabaseAdmin.from('jogos').update({ pontuado: true }).eq('id', jogo.id);
        continue;
      }

      // Resolve sofa_id (ESPN external_id ≠ SofaScore id)
      let sofaId: number | null = jogo.sofa_id ? Number(jogo.sofa_id) : null;
      if (!sofaId && jogo.data_hora) {
        sofaId = await findSofaEventId(jogo.data_hora);
        if (sofaId) {
          // Persiste para não precisar buscar na próxima execução
          await supabaseAdmin.from('jogos').update({ sofa_id: String(sofaId) }).eq('id', jogo.id);
        }
      }

      // Busca stats do SofaScore
      const statsMap = new Map<string, EstatisticasJogador>();
      if (sofaId) {
        const lineups = await getEventLineups(sofaId);
        if (lineups) {
          const isNovorizontinoHome = jogo.mandante_slug === 'novorizontino';
          const teamLineup = isNovorizontinoHome ? lineups.home : lineups.away;
          for (const p of teamLineup.players ?? []) {
            const stats = p.statistics ?? {};
            statsMap.set(String(p.player.id), {
              jogador_id:       String(p.player.id),
              gols:             stats.goals ?? 0,
              assistencias:     stats.goalAssist ?? 0,
              minutos_jogados:  stats.minutesPlayed ?? 0,
              cartao_amarelo:   (stats.yellowCard ?? 0) > 0,
              cartao_vermelho:  (stats.redCard ?? 0) > 0 || (stats.yellowRedCard ?? 0) > 0,
              sem_tomar_gol:    false, // cálculo abaixo
            });
          }
          // Sem tomar gol: goleiro/zagueiros que jogaram o game inteiro e o time não levou gol
          const golsAdv = isNovorizontinoHome ? jogo.placar_visitante : jogo.placar_mandante;
          if ((golsAdv ?? 0) === 0) {
            for (const [, s] of statsMap) {
              if (s.minutos_jogados >= 60) s.sem_tomar_gol = true;
            }
          }
        }
      }

      const isNovorizontinoHome = jogo.mandante_slug === 'novorizontino';
      const resultado = {
        gols_novorizontino: isNovorizontinoHome
          ? (jogo.placar_mandante ?? 0)
          : (jogo.placar_visitante ?? 0),
        gols_adversario: isNovorizontinoHome
          ? (jogo.placar_visitante ?? 0)
          : (jogo.placar_mandante ?? 0),
      };

      // Calcula e salva pontuação de cada usuário
      const pontuacoesParaInserir = escalacoes.map(esc => {
        const pontuacao = calcularPontuacao(
          {
            lineup:        esc.lineup ?? [],
            capitao_id:    esc.capitao_id ?? '',
            heroi_id:      esc.heroi_id ?? '',
            palpite_tigre: esc.palpite_tigre ?? 0,
            palpite_adv:   esc.palpite_adv ?? 0,
          },
          Array.from(statsMap.values()),
          resultado
        );
        return {
          usuario_id: esc.usuario_id,
          jogo_id:    jogo.id,
          pontos:     pontuacao.pontos_total,
          detalhes: {
            pontos_lineup:  pontuacao.pontos_lineup,
            bonus_palpite:  pontuacao.bonus_palpite,
            jogadores:      pontuacao.jogadores,
          },
        };
      });

      // Upsert idempotente (UNIQUE usuario_id,jogo_id)
      await supabaseAdmin
        .from('tigre_fc_pontuacoes')
        .upsert(pontuacoesParaInserir, { onConflict: 'usuario_id,jogo_id' });

      // Recalcula pontos_total de cada usuário a partir da fonte (não incrementa cego)
      for (const p of pontuacoesParaInserir) {
        const { data: totalData } = await supabaseAdmin
          .from('tigre_fc_pontuacoes')
          .select('pontos')
          .eq('usuario_id', p.usuario_id);
        const total = totalData?.reduce((acc, r) => acc + (r.pontos ?? 0), 0) ?? 0;
        await supabaseAdmin
          .from('tigre_fc_usuarios')
          .update({ pontos_total: total, updated_at: new Date().toISOString() })
          .eq('id', p.usuario_id);
      }

      // Marca jogo como pontuado
      await supabaseAdmin.from('jogos').update({ pontuado: true }).eq('id', jogo.id);
      processados++;
    } catch (err) {
      erros++;
      console.error(`[processar-rodada] erro no jogo ${jogo.id}:`, (err as Error).message);
    }
  }

  await supabaseAdmin.from('tigre_fc_jobs_log').insert({
    job: 'processar-rodada',
    finalizado_em: new Date().toISOString(),
    status: erros > 0 ? 'parcial' : 'ok',
    atualizados: processados,
    erros,
    detalhes: { duracao_ms: Date.now() - inicio },
  }).then(null, () => {});

  return NextResponse.json({ ok: true, processados, erros });
}
