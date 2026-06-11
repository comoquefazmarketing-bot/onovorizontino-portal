// src/app/api/agents/ana/rodada/route.ts
// Ana — gerencia a troca de rodada automaticamente.
//
// GET  → status da rodada atual (completa ou não) + próxima rodada pendente
// POST { mandante_slug, visitante_slug, rodada, data_hora, competicao?, local?, transmissao? }
//      → insere o próximo jogo no banco (protegido por AGENTS_SECRET)
//
// Acionado automaticamente pelo webhook /api/webhook/jogo quando
// o campo finalizado muda para true.

import { NextRequest, NextResponse } from 'next/server';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON     = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON;

const anonHeaders = {
  apikey:        SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
  Accept:        'application/json',
};

const serviceHeaders = {
  apikey:        SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  Accept:        'application/json',
  'Content-Type': 'application/json',
  Prefer:        'return=representation',
};

function autorizado(req: NextRequest): boolean {
  const secret = process.env.AGENTS_SECRET;
  if (!secret) return true;
  const bearer  = req.headers.get('authorization')?.replace('Bearer ', '');
  const xSecret = req.headers.get('x-webhook-secret');
  return bearer === secret || xSecret === secret;
}

// ─── Helpers Supabase REST ────────────────────────────────────────────────────

async function fetchJogos(filter: string): Promise<any[]> {
  const url = `${SUPABASE_URL}/rest/v1/jogos?${filter}&select=id,competicao,rodada,data_hora,mandante_slug,visitante_slug,finalizado&order=data_hora.asc`;
  const res = await fetch(url, { headers: anonHeaders, cache: 'no-store' });
  return res.ok ? res.json() : [];
}

async function inserirJogo(payload: Record<string, unknown>): Promise<{ data: any; error: string | null }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/jogos`, {
    method:  'POST',
    headers: serviceHeaders,
    body:    JSON.stringify(payload),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) return { data: null, error: body?.message ?? `HTTP ${res.status}` };
  return { data: Array.isArray(body) ? body[0] : body, error: null };
}

// ─── Lógica de rodada ─────────────────────────────────────────────────────────

async function statusRodadaAtual() {
  // Busca todos os jogos da Série B 2026 ordenados
  const todos = await fetchJogos("competicao=eq.Série%20B%202026");

  if (!todos.length) return { rodada_atual: null, completa: false, proximo_numero: '1', jogos: [] };

  // Rodada atual = menor número com finalizado=false; se todas finalizadas, a última
  const pendentes = todos.filter((j: any) => !j.finalizado);
  const rodadaAtual = pendentes.length > 0
    ? pendentes.sort((a: any, b: any) => Number(a.rodada) - Number(b.rodada))[0].rodada
    : todos.sort((a: any, b: any) => Number(b.rodada) - Number(a.rodada))[0].rodada;

  const jogosRodada = todos.filter((j: any) => j.rodada === rodadaAtual);
  const completa    = jogosRodada.every((j: any) => j.finalizado);
  const maxRodada   = Math.max(...todos.map((j: any) => Number(j.rodada)));
  const proximoNum  = String(maxRodada + 1);

  // Verifica se a próxima rodada já existe
  const proximaExiste = todos.some((j: any) => j.rodada === proximoNum);

  return {
    rodada_atual:    rodadaAtual,
    completa,
    jogos_rodada:    jogosRodada,
    proximo_numero:  proximoNum,
    proxima_existe:  proximaExiste,
  };
}

// ─── GET — status ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const status = await statusRodadaAtual();
    return NextResponse.json({ agente: 'Ana', ...status });
  } catch (err) {
    console.error('[Ana/rodada GET]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}

// ─── POST — insere próxima rodada ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { mandante_slug, visitante_slug, rodada, data_hora, competicao, local, transmissao } = body;

    if (!mandante_slug || !visitante_slug || !rodada || !data_hora) {
      return NextResponse.json({
        erro: 'Campos obrigatórios: mandante_slug, visitante_slug, rodada, data_hora.',
      }, { status: 400 });
    }

    // Verifica se rodada já existe para evitar duplicata
    const existentes = await fetchJogos(
      `competicao=eq.${encodeURIComponent(competicao ?? 'Série B 2026')}&rodada=eq.${rodada}`
    );

    if (existentes.length > 0) {
      return NextResponse.json({
        agente:  'Ana',
        aviso:   `Rodada ${rodada} já existe no banco.`,
        jogo:    existentes[0],
      });
    }

    const novoJogo = {
      competicao:      competicao ?? 'Série B 2026',
      rodada:          String(rodada),
      data_hora,
      mandante_slug,
      visitante_slug,
      local:           local ?? null,
      transmissao:     transmissao ?? null,
      ativo:           false,
      finalizado:      false,
      placar_mandante: null,
      placar_visitante: null,
    };

    const { data, error } = await inserirJogo(novoJogo);

    if (error) {
      return NextResponse.json({ agente: 'Ana', erro: error }, { status: 500 });
    }

    console.log(`[Ana] Rodada ${rodada} cadastrada: ${mandante_slug} x ${visitante_slug}`);

    return NextResponse.json({
      agente:  'Ana',
      ok:      true,
      mensagem: `Rodada ${rodada} cadastrada com sucesso.`,
      jogo:    data,
    });

  } catch (err) {
    console.error('[Ana/rodada POST]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}
