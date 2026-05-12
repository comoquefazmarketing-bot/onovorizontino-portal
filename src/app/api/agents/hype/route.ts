// src/app/api/agents/hype/route.ts
// Léo — rota pública de geração de copy. Usada pelo front, VoxSports e webhooks de jogo.
// POST → body { evento: string; temperatura?: number; placarMandante?: number; ... }
// GET  → ?evento=gol&temperatura=13&placarMandante=2&placarVisitante=0&jogador=Carl%C3%A3o

import { NextRequest, NextResponse } from 'next/server';
import { generateHypeScript, generateBatchHype } from '@/lib/agents/MarketAgent';
import type { GameContext } from '@/lib/agents/MarketAgent';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

function parseCtx(data: Record<string, string | number | undefined>): Partial<GameContext> {
  return {
    temperatura:      data.temperatura      ? Number(data.temperatura)      : undefined,
    placarMandante:   data.placarMandante   ? Number(data.placarMandante)   : undefined,
    placarVisitante:  data.placarVisitante  ? Number(data.placarVisitante)  : undefined,
    minuto:           data.minuto           ? Number(data.minuto)           : undefined,
    mandante:         data.mandante         ? String(data.mandante)         : undefined,
    visitante:        data.visitante        ? String(data.visitante)        : undefined,
    jogador:          data.jogador          ? String(data.jogador)          : undefined,
  };
}

// GET — chamada leve, sem autenticação (conteúdo público)
export async function GET(req: NextRequest) {
  const sp      = req.nextUrl.searchParams;
  const evento  = sp.get('evento') ?? 'default';
  const batch   = sp.get('batch') ? Number(sp.get('batch')) : 1;

  const ctx = parseCtx({
    temperatura:     sp.get('temperatura')     ?? undefined,
    placarMandante:  sp.get('placarMandante')  ?? undefined,
    placarVisitante: sp.get('placarVisitante') ?? undefined,
    minuto:          sp.get('minuto')          ?? undefined,
    mandante:        sp.get('mandante')        ?? undefined,
    visitante:       sp.get('visitante')       ?? undefined,
    jogador:         sp.get('jogador')         ?? undefined,
  });

  if (batch > 1) {
    return NextResponse.json({ agente: 'Léo', scripts: generateBatchHype(evento, ctx, Math.min(batch, 5)) });
  }

  return NextResponse.json({ agente: 'Léo', script: generateHypeScript(evento, ctx) });
}

// POST — chamada completa com body JSON
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const evento = body?.evento ?? 'default';
    const batch  = typeof body?.batch === 'number' ? Math.min(body.batch, 5) : 1;
    const ctx    = parseCtx(body);

    if (batch > 1) {
      return NextResponse.json({ agente: 'Léo', scripts: generateBatchHype(evento, ctx, batch) });
    }

    return NextResponse.json({ agente: 'Léo', script: generateHypeScript(evento, ctx) });
  } catch (err) {
    console.error('[/api/agents/hype POST]', err);
    return NextResponse.json({ erro: 'Payload inválido.' }, { status: 400 });
  }
}
