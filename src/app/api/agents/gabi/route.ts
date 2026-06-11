// src/app/api/agents/gabi/route.ts
// Gabi — rota de geração e publicação de notícias de resultado.
//
// POST { jogo: JogoResultado, status?: 'published'|'draft' }
//      → gera e publica a postagem na tabela `postagens`
//
// GET  ?jogo_id=13
//      → busca o jogo no banco e gera a postagem (útil para publicar resultados manualmente)
//
// Protegido por AGENTS_SECRET ou x-webhook-secret.

import { NextRequest, NextResponse } from 'next/server';
import { gerarPostagem }             from '@/lib/agents/GabiAgent';
import type { JogoResultado }        from '@/lib/agents/GabiAgent';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON;

const anonHeaders = {
  apikey:        SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
  Accept:        'application/json',
};

const serviceHeaders = {
  apikey:         SERVICE_ROLE_KEY,
  Authorization:  `Bearer ${SERVICE_ROLE_KEY}`,
  Accept:         'application/json',
  'Content-Type': 'application/json',
  Prefer:         'return=representation',
};

function autorizado(req: NextRequest): boolean {
  const secret = process.env.AGENTS_SECRET ?? process.env.WEBHOOK_SECRET;
  if (!secret) return true;
  const bearer  = req.headers.get('authorization')?.replace('Bearer ', '');
  const xSecret = req.headers.get('x-webhook-secret');
  return bearer === secret || xSecret === secret;
}

async function buscarJogo(jogoId: number): Promise<JogoResultado | null> {
  const url = `${SUPABASE_URL}/rest/v1/jogos?id=eq.${jogoId}&select=id,rodada,competicao,mandante_slug,visitante_slug,placar_mandante,placar_visitante,data_hora,local&limit=1`;
  const res = await fetch(url, { headers: anonHeaders, cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.[0]) return null;
  const j = data[0];
  if (j.placar_mandante === null || j.placar_visitante === null) return null;
  return j as JogoResultado;
}

async function publicarPostagem(postagem: ReturnType<typeof gerarPostagem>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/postagens`, {
    method:  'POST',
    headers: serviceHeaders,
    body:    JSON.stringify(postagem),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { data: null, error: body?.message ?? `HTTP ${res.status}` };
  return { data: Array.isArray(body) ? body[0] : body, error: null };
}

// ─── GET — gera postagem a partir de jogo_id ─────────────────────────────────

export async function GET(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  const jogoId = req.nextUrl.searchParams.get('jogo_id');
  if (!jogoId) {
    return NextResponse.json({ erro: 'Parâmetro jogo_id obrigatório.' }, { status: 400 });
  }

  const jogo = await buscarJogo(Number(jogoId));
  if (!jogo) {
    return NextResponse.json({ erro: 'Jogo não encontrado ou placar não registrado.' }, { status: 404 });
  }

  const postagem = gerarPostagem(jogo, 'draft');
  return NextResponse.json({ agente: 'Gabi', preview: postagem });
}

// ─── POST — gera e publica ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body   = await req.json();
    const status = body?.status ?? 'published';

    let jogo: JogoResultado | null = null;

    if (body?.jogo_id) {
      jogo = await buscarJogo(Number(body.jogo_id));
    } else if (body?.jogo) {
      jogo = body.jogo as JogoResultado;
    }

    if (!jogo) {
      return NextResponse.json({ erro: 'Forneça jogo_id ou o objeto jogo com placar.' }, { status: 400 });
    }

    if (jogo.placar_mandante === null || jogo.placar_visitante === null) {
      return NextResponse.json({ erro: 'Jogo ainda sem placar registrado.' }, { status: 422 });
    }

    const postagem = gerarPostagem(jogo, status);
    const { data, error } = await publicarPostagem(postagem);

    if (error) {
      console.error('[Gabi] Erro ao publicar:', error);
      return NextResponse.json({ agente: 'Gabi', erro: error }, { status: 500 });
    }

    console.log(`[Gabi] Postagem publicada: "${postagem.titulo}"`);

    return NextResponse.json({
      agente:    'Gabi',
      ok:        true,
      postagem:  data ?? postagem,
    });

  } catch (err) {
    console.error('[Gabi]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}
