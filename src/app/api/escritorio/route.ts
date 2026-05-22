// src/app/api/escritorio/route.ts
// Proxy server-side para o /escritorio — valida a sessão Supabase do admin
// e chama os agentes diretamente (sem expor secrets ao browser).

import { NextRequest, NextResponse }                    from 'next/server';
import { createClient }                                 from '@/utils/supabase/server';
import { sugerirEscalacao, rankingElenco }              from '@/lib/agents/AnaAgent';
import { gerarPostagem }                                from '@/lib/agents/GabiAgent';
import { generateHypeScript }                           from '@/lib/agents/MarketAgent';
import { auditoriaCompleta, validarEscalacoes, syncStatusJogadores } from '@/lib/agents/AuditorAgent';
import { rodarCampanha, detectarInativos }              from '@/lib/agents/DealerAgent';
import { coletarMetricas }                              from '@/lib/agents/RafaelAgent';
import { enviarMensagemTelegram }                       from '@/lib/telegram';
import type { GameContext }                              from '@/lib/agents/MarketAgent';
import type { JogoResultado }                           from '@/lib/agents/GabiAgent';

const ADMIN_EMAIL = 'comoquefazmarketing@gmail.com';

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON_KEY      = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ANON_KEY;

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function adminOuNulo() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === ADMIN_EMAIL ? user : null;
}

// ─── Helpers Gabi ─────────────────────────────────────────────────────────────

async function buscarJogo(jogoId: number): Promise<JogoResultado | null> {
  const url = `${SUPABASE_URL}/rest/v1/jogos?id=eq.${jogoId}&select=id,rodada,competicao,mandante_slug,visitante_slug,placar_mandante,placar_visitante,data_hora,local&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  const j = data?.[0];
  if (!j || j.placar_mandante === null || j.placar_visitante === null) return null;
  return j as JogoResultado;
}

async function publicarPostagem(postagem: ReturnType<typeof gerarPostagem>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/postagens`, {
    method:  'POST',
    headers: {
      apikey:         SERVICE_KEY,
      Authorization:  `Bearer ${SERVICE_KEY}`,
      Accept:         'application/json',
      'Content-Type': 'application/json',
      Prefer:         'return=representation',
    },
    body: JSON.stringify(postagem),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) return { data: null, error: body?.message ?? `HTTP ${res.status}` };
  return { data: Array.isArray(body) ? body[0] : body, error: null };
}

// ─── Helpers Rafael ───────────────────────────────────────────────────────────

function inicioDaSemana(offset = 0): Date {
  const d = new Date();
  const dia = d.getUTCDay();
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

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const admin = await adminOuNulo();
  if (!admin) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { agente } = body as { agente?: string };

  try {
    // ── Ana ────────────────────────────────────────────────────────────────
    if (agente === 'ana') {
      if (body.ranking !== undefined) {
        const pos = body.pos ? String(body.pos).toUpperCase() : undefined;
        return NextResponse.json({ agente: 'Ana', posicao: pos ?? 'TODOS', ranking: rankingElenco(pos) });
      }
      const sugestao = sugerirEscalacao(body.formacao ?? '4-3-3');
      return NextResponse.json({ agente: 'Ana', ...sugestao });
    }

    // ── Gabi ───────────────────────────────────────────────────────────────
    if (agente === 'gabi') {
      const jogoId = Number(body.jogo_id);
      if (!jogoId) return NextResponse.json({ erro: 'jogo_id obrigatório.' }, { status: 400 });

      const jogo = await buscarJogo(jogoId);
      if (!jogo) return NextResponse.json({ erro: 'Jogo não encontrado ou sem placar.' }, { status: 404 });

      const status   = (body.status as 'draft' | 'published') ?? 'draft';
      const postagem = gerarPostagem(jogo, status);

      if (body.preview) {
        return NextResponse.json({ agente: 'Gabi', preview: postagem });
      }

      const { data, error } = await publicarPostagem(postagem);
      if (error) return NextResponse.json({ agente: 'Gabi', erro: error }, { status: 500 });
      return NextResponse.json({ agente: 'Gabi', ok: true, postagem: data ?? postagem });
    }

    // ── Léo ────────────────────────────────────────────────────────────────
    if (agente === 'leo') {
      const evento = String(body.evento ?? 'default');
      const ctx: Partial<GameContext> = {
        temperatura:     body.temperatura     != null ? Number(body.temperatura)     : undefined,
        placarMandante:  body.placarMandante  != null ? Number(body.placarMandante)  : undefined,
        placarVisitante: body.placarVisitante != null ? Number(body.placarVisitante) : undefined,
        minuto:          body.minuto          != null ? Number(body.minuto)          : undefined,
        mandante:        body.mandante        ? String(body.mandante)                : undefined,
        visitante:       body.visitante       ? String(body.visitante)               : undefined,
        jogador:         body.jogador         ? String(body.jogador)                 : undefined,
      };
      return NextResponse.json({ agente: 'Léo', script: generateHypeScript(evento, ctx) });
    }

    // ── Carlos ─────────────────────────────────────────────────────────────
    if (agente === 'carlos') {
      if (body.tabela === 'escalacoes') {
        const logs = await validarEscalacoes();
        return NextResponse.json({ agente: 'Carlos', logs, timestamp: new Date().toISOString() });
      }
      if (body.tabela === 'jogadores') {
        const jogadores = await syncStatusJogadores();
        return NextResponse.json({ agente: 'Carlos', jogadores, timestamp: new Date().toISOString() });
      }
      const resultado = await auditoriaCompleta();
      return NextResponse.json({ agente: 'Carlos', ...resultado, timestamp: new Date().toISOString() });
    }

    // ── Bruno ──────────────────────────────────────────────────────────────
    if (agente === 'bruno') {
      const horas = typeof body.horas === 'number' ? body.horas : 48;
      if (body.apenas_contar) {
        const inativos = await detectarInativos(horas);
        return NextResponse.json({ agente: 'Bruno', total_inativos: inativos.length, horas, inativos, timestamp: new Date().toISOString() });
      }
      const resultado = await rodarCampanha(horas, body.temperatura);
      return NextResponse.json({ agente: 'Bruno', ...resultado });
    }

    // ── Rafael ─────────────────────────────────────────────────────────────
    if (agente === 'rafael') {
      const inicioAtual    = inicioDaSemana(0);
      const fimAtual       = fimDaSemana(inicioAtual);
      const inicioAnterior = inicioDaSemana(-1);
      const fimAnterior    = fimDaSemana(inicioDaSemana(-1));

      const relatorio = await coletarMetricas({
        supabaseUrl:    SUPABASE_URL,
        anonKey:        ANON_KEY,
        inicioPeriodo:  inicioAtual.toISOString(),
        fimPeriodo:     fimAtual.toISOString(),
        inicioAnterior: inicioAnterior.toISOString(),
        fimAnterior:    fimAnterior.toISOString(),
      });

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId   = process.env.TELEGRAM_CHAT_ID;
      if (botToken && chatId) {
        enviarMensagemTelegram({ texto: relatorio.resumo, chatId, botToken, parseMode: 'HTML' })
          .catch(e => console.warn('[Rafael/escritorio] Telegram falhou:', e));
      }

      return NextResponse.json({ agente: 'Rafael', ...relatorio });
    }

    return NextResponse.json({ erro: 'Agente desconhecido.' }, { status: 400 });

  } catch (err) {
    console.error('[/api/escritorio]', err);
    return NextResponse.json({ erro: 'Erro interno.' }, { status: 500 });
  }
}
