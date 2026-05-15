// src/app/api/agents/campanha/route.ts
// Bruno — rota de campanha de retenção acionada por cron ou webhook.
// GET  → roda campanha completa com defaults (48h, temperatura do env)
// POST → body { horas?: number; temperatura?: number } para configurar a campanha
//
// Proteção: CRON_SECRET (Vercel Cron) ou Authorization: Bearer <AGENTS_SECRET>

import { NextRequest, NextResponse } from 'next/server';
import { rodarCampanha, detectarInativos } from '@/lib/agents/DealerAgent';

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
    const temp = process.env.TEMPERATURA_ATUAL ? Number(process.env.TEMPERATURA_ATUAL) : undefined;
    const resultado = await rodarCampanha(48, temp);

    return NextResponse.json({
      agente: 'Bruno',
      role:   'Growth & Retention',
      ...resultado,
    });
  } catch (err) {
    console.error('[/api/agents/campanha GET]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body        = await req.json().catch(() => ({}));
    const horas       = typeof body?.horas       === 'number' ? body.horas       : 48;
    const temperatura = typeof body?.temperatura === 'number' ? body.temperatura : undefined;
    const apenasContar = body?.apenas_contar === true;

    if (apenasContar) {
      const inativos = await detectarInativos(horas);
      return NextResponse.json({
        agente:         'Bruno',
        total_inativos: inativos.length,
        horas,
        inativos,
        timestamp:      new Date().toISOString(),
      });
    }

    const resultado = await rodarCampanha(horas, temperatura);
    return NextResponse.json({ agente: 'Bruno', ...resultado });

  } catch (err) {
    console.error('[/api/agents/campanha POST]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}
