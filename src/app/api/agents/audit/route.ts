// src/app/api/agents/audit/route.ts
// Carlos — rota de auditoria acionada por cron (diária) ou webhook de jogo.
// GET  → auditoria completa (escalações + status de jogadores)
// POST → body { tabela?: 'escalacoes' | 'jogadores' } para auditoria parcial
//
// Proteção: CRON_SECRET no header x-cron-secret (Vercel Cron) ou
//           Authorization: Bearer <AGENTS_SECRET> para chamadas externas.

import { NextRequest, NextResponse } from 'next/server';
import { auditoriaCompleta, validarEscalacoes, syncStatusJogadores } from '@/lib/agents/AuditorAgent';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

function autorizado(req: NextRequest): boolean {
  const cronSecret   = process.env.CRON_SECRET;
  const agentsSecret = process.env.AGENTS_SECRET;

  if (!cronSecret && !agentsSecret) return true;

  const headerCron   = req.headers.get('x-cron-secret');
  const headerBearer = req.headers.get('authorization')?.replace('Bearer ', '');

  if (cronSecret   && headerCron   === cronSecret)   return true;
  if (agentsSecret && headerBearer === agentsSecret) return true;
  return false;
}

export async function GET(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const resultado = await auditoriaCompleta();
    return NextResponse.json({
      agente: 'Carlos',
      role:   'Back-office & Data Integrity',
      ...resultado,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[/api/agents/audit GET]', err);
    return NextResponse.json({ erro: 'Erro interno. Isso não é Nível Makarios.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const tabela = body?.tabela as string | undefined;

    if (tabela === 'escalacoes') {
      const logs = await validarEscalacoes();
      return NextResponse.json({ agente: 'Carlos', logs, timestamp: new Date().toISOString() });
    }

    if (tabela === 'jogadores') {
      const jogadores = await syncStatusJogadores();
      return NextResponse.json({ agente: 'Carlos', jogadores, timestamp: new Date().toISOString() });
    }

    // Sem body específico → auditoria completa
    const resultado = await auditoriaCompleta();
    return NextResponse.json({ agente: 'Carlos', ...resultado, timestamp: new Date().toISOString() });

  } catch (err) {
    console.error('[/api/agents/audit POST]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}
