// src/app/api/webhook/jogo/route.ts
// Gateway de eventos de jogo — integra Léo (MarketAgent) automaticamente.
//
// Fontes suportadas:
//   1. Supabase Database Webhook (INSERT/UPDATE na tabela jogos)
//   2. POST manual: { tipo, jogo_id, jogador?, placar_mandante?, placar_visitante?,
//                     mandante?, visitante?, minuto?, temperatura? }
//
// Fluxo: detecta o evento → Léo gera o copy → salva em voxsports_fila → retorna

import { NextRequest, NextResponse } from 'next/server';
import { generateHypeScript }        from '@/lib/agents/MarketAgent';
import type { GameContext }          from '@/lib/agents/MarketAgent';
import { supabase }                  from '@/lib/supabase';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

// ─── Auth ────────────────────────────────────────────────────────────────────

function autorizado(req: NextRequest): boolean {
  const secret  = process.env.WEBHOOK_SECRET ?? process.env.AGENTS_SECRET;
  if (!secret) return true; // sem secret configurado → aberto (não recomendado em prod)
  const bearer = req.headers.get('authorization')?.replace('Bearer ', '');
  const xSecret = req.headers.get('x-webhook-secret');
  return bearer === secret || xSecret === secret;
}

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface JogoRow {
  id: number;
  mandante_slug:   string;
  visitante_slug:  string;
  placar_mandante: number | null;
  placar_visitante: number | null;
  finalizado: boolean;
  ativo: boolean;
  competicao: string;
  rodada: string;
}

interface SupabaseWebhookPayload {
  type:       'INSERT' | 'UPDATE' | 'DELETE';
  table:      string;
  record:     JogoRow;
  old_record: JogoRow | null;
}

interface ManualPayload {
  tipo:             string;            // 'gol' | 'vitória' | 'pênalti' | 'intervalo' | 'clima' | 'pre-jogo'
  jogo_id?:         number;
  jogador?:         string;
  placar_mandante?: number;
  placar_visitante?: number;
  mandante?:        string;
  visitante?:       string;
  minuto?:          number;
  temperatura?:     number;
}

// ─── Detecção de evento a partir de um UPDATE do Supabase ────────────────────

function detectarEvento(
  record: JogoRow,
  oldRecord: JogoRow | null,
): { tipo: string; ctx: Partial<GameContext> } | null {

  const ctx: Partial<GameContext> = {
    mandante:        slugParaNome(record.mandante_slug),
    visitante:       slugParaNome(record.visitante_slug),
    placarMandante:  record.placar_mandante  ?? undefined,
    placarVisitante: record.placar_visitante ?? undefined,
  };

  // Jogo finalizado → vitória / empate / derrota
  if (record.finalizado && !oldRecord?.finalizado) {
    const pm = record.placar_mandante ?? 0;
    const pv = record.placar_visitante ?? 0;
    return { tipo: pm !== pv ? 'vitória' : 'empate', ctx };
  }

  // Placar mudou → gol
  if (
    oldRecord &&
    (record.placar_mandante  !== oldRecord.placar_mandante ||
     record.placar_visitante !== oldRecord.placar_visitante)
  ) {
    return { tipo: 'gol', ctx };
  }

  // Jogo ativado (começou)
  if (record.ativo && !oldRecord?.ativo) {
    return { tipo: 'inicio', ctx };
  }

  return null;
}

// ─── Slug → nome legível (fallback rápido sem banco) ─────────────────────────

function slugParaNome(slug: string): string {
  const mapa: Record<string, string> = {
    'novorizontino': 'Novorizontino', 'gremio-novorizontino': 'Novorizontino',
    'avai': 'Avaí', 'criciuma': 'Criciúma', 'botafogo-sp': 'Botafogo-SP',
    'america-mg': 'América-MG', 'atletico-mg': 'Atlético-MG', 'goias': 'Goiás',
    'sport': 'Sport', 'cuiaba': 'Cuiabá', 'crb': 'CRB', 'athletic': 'Athletic',
    'ceara': 'Ceará', 'juventude': 'Juventude', 'ponte-preta': 'Ponte Preta',
    'vila-nova': 'Vila Nova', 'operario-pr': 'Operário', 'londrina': 'Londrina',
    'sao-bernardo': 'São Bernardo', 'coritiba': 'Coritiba', 'santos': 'Santos',
    'paysandu': 'Paysandu', 'remo': 'Remo', 'athletico-pr': 'Athletico',
  };
  return mapa[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// ─── Persiste copy na fila do Supabase ───────────────────────────────────────

async function salvarNaFila(jogoId: number | undefined, tipo: string, copy: string, titulo: string) {
  const { error } = await supabase
    .from('voxsports_fila')
    .insert({ jogo_id: jogoId ?? null, evento: tipo, titulo, copy, criado_em: new Date().toISOString() });

  if (error) {
    // Tabela pode ainda não existir — falha silenciosa, copy retorna na response
    console.warn('[webhook/jogo] voxsports_fila não encontrada:', error.message);
  }
}

// ─── Ana: verifica se a rodada fechou após finalizado=true ───────────────────

async function notificarAnaSeRodadaFechou(record: JogoRow) {
  if (!record.finalizado) return;
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.onovorizontino.com.br';
    const res  = await fetch(`${base}/api/agents/ana/rodada`, { cache: 'no-store' });
    if (!res.ok) return;
    const status = await res.json();
    if (status.completa && !status.proxima_existe) {
      console.log(`[webhook/jogo] Ana: rodada ${status.rodada_atual} completa. Próxima: ${status.proximo_numero} ainda não cadastrada.`);
    }
  } catch (e) {
    console.warn('[webhook/jogo] Ana check failed:', e);
  }
}

// ─── Handler principal ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // ── Detecta origem: Supabase webhook ou chamada manual ──────────────────
    const isSupabase = 'type' in body && 'record' in body;

    let tipo: string;
    let ctx: Partial<GameContext>;
    let jogoId: number | undefined;
    let recordRow: JogoRow | null = null;

    if (isSupabase) {
      const payload = body as SupabaseWebhookPayload;

      if (payload.table !== 'jogos') {
        return NextResponse.json({ ignorado: true, motivo: `tabela '${payload.table}' não monitorada` });
      }

      const evento = detectarEvento(payload.record, payload.old_record);
      if (!evento) {
        // Mesmo sem evento de copy, verifica se Ana precisa agir
        await notificarAnaSeRodadaFechou(payload.record);
        return NextResponse.json({ ignorado: true, motivo: 'nenhum evento relevante detectado' });
      }

      tipo      = evento.tipo;
      ctx       = evento.ctx;
      jogoId    = payload.record.id;
      recordRow = payload.record;
    } else {
      const manual = body as ManualPayload;
      tipo   = manual.tipo ?? 'default';
      jogoId = manual.jogo_id;
      ctx = {
        jogador:         manual.jogador,
        placarMandante:  manual.placar_mandante,
        placarVisitante: manual.placar_visitante,
        mandante:        manual.mandante,
        visitante:       manual.visitante,
        minuto:          manual.minuto,
        temperatura:     manual.temperatura,
      };
    }

    // ── Léo entra em campo ──────────────────────────────────────────────────
    const script = generateHypeScript(tipo, ctx);

    // ── Persiste na fila (falha silenciosa se tabela não existir) ───────────
    await salvarNaFila(jogoId, tipo, script.copy, script.titulo);

    // ── Ana verifica rodada (fire-and-forget) ───────────────────────────────
    if (recordRow) notificarAnaSeRodadaFechou(recordRow);

    return NextResponse.json({
      agente:  'Léo',
      evento:  tipo,
      jogo_id: jogoId ?? null,
      script,
    });

  } catch (err) {
    console.error('[webhook/jogo]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}

// GET de diagnóstico — verifica se a rota está viva
export async function GET() {
  return NextResponse.json({
    agente: 'Léo',
    rota:   '/api/webhook/jogo',
    status: 'online',
    eventos_suportados: ['gol', 'vitória', 'empate', 'pênalti', 'intervalo', 'inicio', 'clima', 'pre-jogo'],
    timestamp: new Date().toISOString(),
  });
}
