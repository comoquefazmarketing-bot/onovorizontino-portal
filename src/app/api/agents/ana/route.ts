// src/app/api/agents/ana/route.ts
// Ana — rota de escalação inteligente.
//
// GET  ?formacao=4-3-3            → sugere a melhor escalação para a formação
// GET  ?ranking=ATA               → ranking do elenco por posição
// POST { slots: { gk: 23, cb1: 8, ... } } → analisa escalação existente

import { NextRequest, NextResponse } from 'next/server';
import { sugerirEscalacao, analisarEscalacao, rankingElenco } from '@/lib/agents/AnaAgent';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const sp      = req.nextUrl.searchParams;
  const formacao = sp.get('formacao');
  const ranking  = sp.get('ranking');

  if (ranking !== null) {
    const pos = ranking.toUpperCase() || undefined;
    return NextResponse.json({
      agente:  'Ana',
      posicao: pos ?? 'TODOS',
      ranking: rankingElenco(pos),
    });
  }

  const sugestao = sugerirEscalacao(formacao ?? '4-3-3');
  return NextResponse.json({ agente: 'Ana', ...sugestao });
}

export async function POST(req: NextRequest) {
  try {
    const body  = await req.json();
    const slots = body?.slots as Record<string, number | null> | undefined;

    if (!slots) {
      return NextResponse.json({ erro: 'Campo "slots" obrigatório.' }, { status: 400 });
    }

    const relatorio = analisarEscalacao(slots);
    return NextResponse.json({ agente: 'Ana', ...relatorio });
  } catch {
    return NextResponse.json({ erro: 'Payload inválido.' }, { status: 400 });
  }
}
