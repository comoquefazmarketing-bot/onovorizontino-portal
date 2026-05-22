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

// ─── Mapa de nomes e lógica de contexto ──────────────────────────────────────

const NOMES_EXIB: Record<string, string> = {
  'novorizontino': 'Novorizontino', 'gremio-novorizontino': 'Novorizontino',
  'chapecoense': 'Chapecoense', 'avai': 'Avaí', 'botafogo-sp': 'Botafogo-SP',
  'america-mg': 'América-MG', 'ceara': 'Ceará', 'criciuma': 'Criciúma',
  'cuiaba': 'Cuiabá', 'crb': 'CRB', 'sport': 'Sport', 'londrina': 'Londrina',
  'juventude': 'Juventude', 'ponte-preta': 'Ponte Preta', 'vila-nova': 'Vila Nova',
  'operario-pr': 'Operário', 'goias': 'Goiás', 'sao-bernardo': 'São Bernardo',
  'coritiba': 'Coritiba', 'santos': 'Santos', 'paysandu': 'Paysandu',
  'athletico-pr': 'Athletico', 'guarani': 'Guarani', 'mirassol': 'Mirassol',
  'amazonas': 'Amazonas', 'volta-redonda': 'Volta Redonda',
};

function isNovo(slug: string) {
  return slug === 'novorizontino' || slug === 'gremio-novorizontino';
}

function nomePor(slug: string) {
  return NOMES_EXIB[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function derivarEvento(j: JogoResultado): string {
  const novoM = isNovo(j.mandante_slug);
  const novoG = novoM ? j.placar_mandante : j.placar_visitante;
  const advG  = novoM ? j.placar_visitante : j.placar_mandante;
  if (novoG === advG) return 'empate';
  if (novoG > advG)  return 'vitória';
  const diff = advG - novoG;
  if (diff >= 3) return 'goleada_sofrida';
  if (j.competicao?.toLowerCase().includes('copa') && j.rodada?.toLowerCase().includes('jogo 1'))
    return 'reacao_necessaria';
  return 'derrota';
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

/** Busca o último jogo finalizado com placar (qualquer competição) */
async function buscarUltimoJogo(): Promise<JogoResultado | null> {
  const url = `${SUPABASE_URL}/rest/v1/jogos?placar_mandante=not.is.null&placar_visitante=not.is.null&select=id,rodada,competicao,mandante_slug,visitante_slug,placar_mandante,placar_visitante,data_hora,local&order=data_hora.desc&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.[0] ?? null;
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
    // ── Contexto compartilhado ─────────────────────────────────────────────
    // Retorna o último jogo + evento derivado para pré-preencher todos os agentes
    if (agente === 'contexto') {
      const jogo = await buscarUltimoJogo();
      if (!jogo) return NextResponse.json({ jogo: null });
      const novoM = isNovo(jogo.mandante_slug);
      return NextResponse.json({
        jogo,
        evento:             derivarEvento(jogo),
        nomeNovorizontino:  nomePor(novoM ? jogo.mandante_slug : jogo.visitante_slug),
        nomeAdversario:     nomePor(novoM ? jogo.visitante_slug : jogo.mandante_slug),
        placarNovo:         novoM ? jogo.placar_mandante : jogo.placar_visitante,
        placarAdv:          novoM ? jogo.placar_visitante : jogo.placar_mandante,
        mando:              novoM ? 'casa' : 'fora',
        competicao:         jogo.competicao,
        rodada:             jogo.rodada,
      });
    }

    // ── Workflow: Cobrir Jogo (Gabi + Léo encadeados) ──────────────────────
    // Um clique → artigo publicado + copy social gerado sobre o mesmo jogo
    if (agente === 'cobrir_jogo') {
      const jogo = body.jogo_id
        ? await buscarJogo(Number(body.jogo_id))
        : await buscarUltimoJogo();
      if (!jogo) return NextResponse.json({ erro: 'Nenhum jogo com placar encontrado.' }, { status: 404 });

      const status    = (body.status as 'draft' | 'published') ?? 'published';
      const evento    = derivarEvento(jogo);
      const novoM     = isNovo(jogo.mandante_slug);

      // 1️⃣ Gabi: gera e publica o artigo
      const postagem = gerarPostagem(jogo, status);
      const { data: postagemData, error: gabiError } = await publicarPostagem(postagem);

      // 2️⃣ Léo: gera copy social com o contexto do mesmo jogo
      const hype = generateHypeScript(evento, {
        evento,
        placarMandante:  jogo.placar_mandante,
        placarVisitante: jogo.placar_visitante,
        mandante:        nomePor(jogo.mandante_slug),
        visitante:       nomePor(jogo.visitante_slug),
      });

      return NextResponse.json({
        agente:   'Workflow',
        mando:    novoM ? 'casa' : 'fora',
        jogo:     { id: jogo.id, competicao: jogo.competicao, rodada: jogo.rodada,
                    placar: `${nomePor(jogo.mandante_slug)} ${jogo.placar_mandante}×${jogo.placar_visitante} ${nomePor(jogo.visitante_slug)}` },
        gabi:     { ok: !gabiError, titulo: postagem.titulo, status, erro: gabiError ?? undefined },
        leo:      { ok: true, evento, titulo: hype.titulo, copy: hype.copy, hashtags: hype.hashtags },
      });
    }

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
      // Suporte a "último jogo" automático — não precisa do jogo_id
      let jogo: JogoResultado | null = null;
      if (body.ultimo_jogo) {
        jogo = await buscarUltimoJogo();
        if (!jogo) return NextResponse.json({ erro: 'Nenhum jogo finalizado com placar encontrado.' }, { status: 404 });
      } else {
        const jogoId = Number(body.jogo_id);
        if (!jogoId) return NextResponse.json({ erro: 'jogo_id obrigatório (ou use ultimo_jogo: true).' }, { status: 400 });
        jogo = await buscarJogo(jogoId);
        if (!jogo) return NextResponse.json({ erro: 'Jogo não encontrado ou sem placar.' }, { status: 404 });
      }

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
