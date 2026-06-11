// Cron: sincroniza jogos do SofaScore → tabela jogos
// Schedule: 06h e 14h todo dia (vercel.json)
// Protegido por CRON_SECRET

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { fetchJogosNovorizontino, fetchResultadosRecentes } from '@/lib/tigre-fc/calendario-provider';

function auth(req: NextRequest): boolean {
  const secret = req.headers.get('authorization')?.replace('Bearer ', '');
  return secret === process.env.CRON_SECRET ||
    req.nextUrl.searchParams.get('secret') === process.env.CRON_SECRET;
}

export async function GET(req: NextRequest) {
  if (!auth(req)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  const logId = crypto.randomUUID();
  const inicio = Date.now();
  let criados = 0, atualizados = 0, erros = 0;

  console.log(`[sync-jogos] iniciando job ${logId}`);

  try {
    // 1. Atualiza jogos ao_vivo ou recém-encerrados primeiro (mais urgente)
    const { data: jogosAtivos } = await supabaseAdmin
      .from('jogos')
      .select('external_id')
      .in('status', ['ao_vivo', 'agendado'])
      .not('external_id', 'is', null)
      .gte('data_hora', new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString());

    if (jogosAtivos?.length) {
      const ids = jogosAtivos.map(j => j.external_id as string);
      const atualizacoes = await fetchResultadosRecentes(ids);
      for (const jogo of atualizacoes) {
        const { error } = await supabaseAdmin
          .from('jogos')
          .update({
            placar_mandante: jogo.placar_mandante,
            placar_visitante: jogo.placar_visitante,
            status: jogo.status,
            finalizado: jogo.finalizado,
            external_updated_at: jogo.external_updated_at,
          })
          .eq('external_id', jogo.external_id);
        if (error) { erros++; console.error(error); } else { atualizados++; }
      }
    }

    // 2. Sync completo do calendário
    const jogos = await fetchJogosNovorizontino();

    for (const jogo of jogos) {
      const { error, data } = await supabaseAdmin
        .from('jogos')
        .upsert(
          {
            external_id:       jogo.external_id,
            competicao:        jogo.competicao,
            rodada:            jogo.rodada,
            data_hora:         jogo.data_hora,
            mandante_slug:     jogo.mandante_slug,
            visitante_slug:    jogo.visitante_slug,
            local:             jogo.local,
            placar_mandante:   jogo.placar_mandante,
            placar_visitante:  jogo.placar_visitante,
            status:            jogo.status,
            finalizado:        jogo.finalizado,
            external_updated_at: jogo.external_updated_at,
          },
          { onConflict: 'external_id', ignoreDuplicates: false }
        )
        .select('id');

      if (error) {
        erros++;
        console.error(`[sync-jogos] erro no upsert ${jogo.external_id}:`, error.message);
      } else {
        // Supabase não diferencia insert de update via upsert — conta como atualizado
        atualizados++;
      }
    }

    // 3. Log
    await supabaseAdmin.from('tigre_fc_jobs_log').insert({
      job: 'sync-jogos',
      finalizado_em: new Date().toISOString(),
      status: erros > 0 ? 'parcial' : 'ok',
      criados,
      atualizados,
      erros,
      detalhes: { total_sofascore: jogos.length },
    });

    console.log(`[sync-jogos] concluído — criados:${criados} atualizados:${atualizados} erros:${erros} (${Date.now() - inicio}ms)`);
    return NextResponse.json({ ok: true, criados, atualizados, erros });

  } catch (err) {
    const msg = (err as Error).message;
    console.error('[sync-jogos] falha crítica:', msg);

    await supabaseAdmin.from('tigre_fc_jobs_log').insert({
      job: 'sync-jogos',
      finalizado_em: new Date().toISOString(),
      status: 'erro',
      erros: 1,
      detalhes: { erro: msg },
    }).catch(() => {});

    // Degradação graciosa — retorna 200 para não retentar em loop no Vercel
    return NextResponse.json({ ok: false, erro: 'Fonte indisponível — modo manual ativo', detalhe: msg });
  }
}
