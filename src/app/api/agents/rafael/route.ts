// src/app/api/agents/rafael/route.ts
// Rafael — relatório semanal de métricas do ecossistema.
//
// GET  → relatório da semana atual vs semana anterior
// GET  ?semanas=2 → janela customizada em semanas
//
// Protegido por AGENTS_SECRET. Acionado pelo cron toda segunda-feira às 08h.

import { NextRequest, NextResponse } from 'next/server';
import { coletarMetricas } from '@/lib/agents/RafaelAgent';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

function autorizado(req: NextRequest): boolean {
  const secret = process.env.AGENTS_SECRET ?? process.env.CRON_SECRET;
  if (!secret) return true;
  const bearer  = req.headers.get('authorization')?.replace('Bearer ', '');
  const xCron   = req.headers.get('x-cron-secret');
  return bearer === secret || xCron === secret;
}

function inicioDaSemana(offset = 0): Date {
  const d = new Date();
  const dia = d.getUTCDay(); // 0=dom, 1=seg...
  const diff = (dia === 0 ? -6 : 1 - dia) + offset * 7;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function fimDaSemana(inicio: Date): Date {
  const d = new Date(inicio);
  d.setUTCDate(d.getUTCDate() + 6);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

export async function GET(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  const semanas = Number(req.nextUrl.searchParams.get('semanas') ?? 1);

  const inicioAtual    = inicioDaSemana(0);
  const fimAtual       = fimDaSemana(inicioAtual);
  const inicioAnterior = inicioDaSemana(-semanas);
  const fimAnterior    = fimDaSemana(inicioDaSemana(-1));

  try {
    const relatorio = await coletarMetricas({
      supabaseUrl:    process.env.NEXT_PUBLIC_SUPABASE_URL!,
      anonKey:        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      inicioPeriodo:  inicioAtual.toISOString(),
      fimPeriodo:     fimAtual.toISOString(),
      inicioAnterior: inicioAnterior.toISOString(),
      fimAnterior:    fimAnterior.toISOString(),
    });

    // Envia para Telegram se configurado (fire-and-forget)
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId   = process.env.TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id:    chatId,
          text:       relatorio.resumo,
          parse_mode: 'HTML',
        }),
      }).catch(e => console.warn('[Rafael] Telegram falhou:', e));
    }

    return NextResponse.json({ agente: 'Rafael', ...relatorio });
  } catch (err) {
    console.error('[Rafael]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}
