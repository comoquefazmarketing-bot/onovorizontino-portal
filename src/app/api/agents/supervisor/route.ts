// Supervisor — orquestra todos os agentes do escritório virtual.
// Conhece a rotina de cada um, verifica o estado do sistema e aciona
// quem for necessário. Só escala para o usuário (via Telegram) quando algo importa.
import { NextRequest, NextResponse } from 'next/server';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const AGENTS_SECRET = process.env.AGENTS_SECRET ?? '';

const anonH = {
  apikey:        SUPABASE_ANON,
  Authorization: `Bearer ${SUPABASE_ANON}`,
  Accept:        'application/json',
};

function autorizado(req: NextRequest): boolean {
  const secret = process.env.AGENTS_SECRET ?? process.env.WEBHOOK_SECRET;
  if (!secret) return true;
  const bearer  = req.headers.get('authorization')?.replace('Bearer ', '');
  const xSecret = req.headers.get('x-webhook-secret');
  return bearer === secret || xSecret === secret;
}

async function supaFetch(path: string): Promise<any[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: anonH,
      cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function chamarAgente(
  base: string,
  path: string,
  method: 'GET' | 'POST',
  body?: object,
): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        'Content-Type':     'application/json',
        'Authorization':    `Bearer ${AGENTS_SECRET}`,
        'x-webhook-secret': AGENTS_SECRET,
        'x-agents-secret':  AGENTS_SECRET,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return { ok: res.ok, status: res.status, data: await res.json().catch(() => null) };
  } catch (err) {
    return { ok: false, status: 0, data: { erro: String(err) } };
  }
}

async function enviarTelegram(texto: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId   = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: texto, parse_mode: 'HTML' }),
  }).catch(e => console.warn('[Supervisor] Telegram falhou:', e));
}

function formatarHoraBR(d: Date): string {
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day:      '2-digit',
    month:    '2-digit',
    year:     'numeric',
    hour:     '2-digit',
    minute:   '2-digit',
  });
}

interface Decisao {
  agente:     string;
  motivo:     string;
  acao:       string;
  ok:         boolean;
  resultado?: any;
}

export async function GET(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  const reqUrl = new URL(req.url);
  const BASE   = `${reqUrl.protocol}//${reqUrl.host}`;
  const now    = new Date();
  const nowMs  = now.getTime();

  const decisoes: Decisao[] = [];
  const alertas:  string[]  = [];

  // ── 1. GABI — Jogo finalizado nas últimas 24h sem post de resultado ──────────
  const ultimosJogos = await supaFetch(
    'jogos?finalizado=eq.true&placar_mandante=not.is.null' +
    '&select=id,rodada,competicao,mandante_slug,visitante_slug,placar_mandante,placar_visitante,data_hora,local' +
    '&order=data_hora.desc&limit=1',
  );
  const ultimoJogo = ultimosJogos[0];

  if (ultimoJogo) {
    const jogoMs     = new Date(ultimoJogo.data_hora).getTime();
    const horasSince = (nowMs - jogoMs) / 3_600_000;

    if (horasSince <= 24) {
      const limit = new Date(jogoMs - 30 * 60_000).toISOString();
      const postsExistentes = await supaFetch(
        `postagens?categoria=eq.Resultados&criado_em=gte.${encodeURIComponent(limit)}&select=id&limit=1`,
      );

      if (!postsExistentes.length) {
        const r = await chamarAgente(BASE, '/api/agents/gabi', 'POST', { jogo_id: ultimoJogo.id });
        decisoes.push({
          agente:    'Gabi',
          motivo:    `Jogo da Rodada ${ultimoJogo.rodada} finalizado há ${Math.round(horasSince)}h sem matéria`,
          acao:      'Publicar matéria de resultado',
          ok:        r.ok,
          resultado: r.data,
        });
        alertas.push(
          r.ok
            ? `✅ Gabi publicou matéria — Rodada ${ultimoJogo.rodada}`
            : `⚠️ Gabi falhou ao publicar Rodada ${ultimoJogo.rodada}`,
        );
      } else {
        decisoes.push({
          agente: 'Gabi',
          motivo: `Rodada ${ultimoJogo.rodada} já tem matéria publicada`,
          acao:   'Nenhuma ação',
          ok:     true,
        });
      }
    }
  }

  // ── 2. ANA — Próximo jogo nas próximas 48h ──────────────────────────────────
  const proximosJogos = await supaFetch(
    `jogos?finalizado=eq.false&data_hora=gte.${encodeURIComponent(now.toISOString())}` +
    '&select=id,rodada,competicao,mandante_slug,visitante_slug,data_hora,local' +
    '&order=data_hora.asc&limit=1',
  );
  const proximoJogo = proximosJogos[0];

  if (proximoJogo) {
    const proximoMs    = new Date(proximoJogo.data_hora).getTime();
    const horasAteJogo = (proximoMs - nowMs) / 3_600_000;

    if (horasAteJogo <= 6) {
      alertas.push(`🚨 JOGO EM ${Math.round(horasAteJogo)}h — ${proximoJogo.competicao} Rodada ${proximoJogo.rodada}`);
    } else if (horasAteJogo <= 48) {
      alertas.push(`📅 Próximo jogo em ${Math.round(horasAteJogo)}h — Rodada ${proximoJogo.rodada}`);
    }

    if (horasAteJogo <= 48) {
      const r = await chamarAgente(BASE, '/api/agents/ana/rodada', 'GET');
      decisoes.push({
        agente:    'Ana',
        motivo:    `Jogo em ${Math.round(horasAteJogo)}h — verificação de escalação`,
        acao:      'Status da Rodada',
        ok:        r.ok,
        resultado: r.data,
      });
    }
  }

  // ── 3. RAFAEL — Relatório semanal (segunda-feira, 8h–12h horário BR) ─────────
  const diaSemana = now.getDay();
  const horaUTC   = now.getUTCHours();
  const horaBR    = (horaUTC - 3 + 24) % 24;
  if (diaSemana === 1 && horaBR >= 8 && horaBR <= 12) {
    const r = await chamarAgente(BASE, '/api/agents/rafael', 'GET');
    decisoes.push({
      agente:    'Rafael',
      motivo:    'Segunda-feira (8h–12h) — relatório semanal de métricas',
      acao:      'Gerar relatório',
      ok:        r.ok,
      resultado: r.data,
    });
    if (r.ok) alertas.push('📊 Rafael gerou relatório semanal de métricas');
  }

  // ── 4. BRUNO — Verificação de inativos ──────────────────────────────────────
  const r4 = await chamarAgente(BASE, '/api/agents/campanha', 'POST', {
    apenas_contar: true,
    horas: 48,
  });
  decisoes.push({
    agente:    'Bruno',
    motivo:    'Verificação periódica de fãs inativos (48h)',
    acao:      'Contar inativos',
    ok:        r4.ok,
    resultado: r4.data,
  });
  if (r4.ok && r4.data?.total > 50) {
    alertas.push(`📣 Bruno: ${r4.data.total} fãs inativos há 48h — recomenda campanha`);
  }

  // ── 5. LÉO — Copy contextual ─────────────────────────────────────────────────
  if (ultimoJogo || proximoJogo) {
    const evento = ultimoJogo ? 'vitoria' : 'preview';
    const r5 = await chamarAgente(BASE, `/api/agents/hype?evento=${evento}`, 'GET');
    decisoes.push({
      agente:    'Léo',
      motivo:    ultimoJogo ? 'Jogo recente — copy de resultado' : 'Jogo próximo — copy de prévia',
      acao:      `Copy: ${evento}`,
      ok:        r5.ok,
      resultado: r5.data,
    });
  }

  // ── 6. CANAL — Conteúdo WhatsApp (manhã 8–10h e tarde 17–19h BR) ─────────────
  if ((horaBR >= 8 && horaBR <= 10) || (horaBR >= 17 && horaBR <= 19)) {
    const turno = horaBR <= 10 ? 'manha' : 'tarde';
    const r6 = await chamarAgente(BASE, `/api/agents/canal?turno=${turno}`, 'GET');
    decisoes.push({
      agente:    'Canal',
      motivo:    `Turno ${turno} (${horaBR}h BR) — conteúdo para o Canal do WhatsApp`,
      acao:      `Gerar conteúdo: ${turno}`,
      ok:        r6.ok,
      resultado: r6.data,
    });
    if (r6.ok) alertas.push(`📱 Canal: conteúdo ${turno} enviado ao admin via Telegram`);
  }

  if (decisoes.length === 0) {
    decisoes.push({
      agente: 'Supervisor',
      motivo: 'Nenhuma condição especial detectada',
      acao:   'Aguardando próximo ciclo',
      ok:     true,
    });
  }

  const acoesRealizadas = decisoes.filter(
    d => d.acao !== 'Nenhuma ação' && d.acao !== 'Aguardando próximo ciclo',
  );
  const temErros = decisoes.some(d => !d.ok);
  const resumo   = `Ciclo concluído — ${decisoes.length} verificações, ${alertas.length} alertas`;

  // ── Telegram: notifica quando há alertas, ações ou erros (ciclos ociosos são silenciosos) ──
  if (alertas.length > 0 || acoesRealizadas.length > 0 || temErros) {
    const horario = formatarHoraBR(now);

    let msg = `🧠 <b>SUPERVISOR</b> · Escritório Makarios\n`;
    msg    += `🕐 ${horario}\n`;
    msg    += `━━━━━━━━━━━━━━━━━━━━\n`;

    if (alertas.length > 0) {
      msg += `\n<b>🔔 ALERTAS</b>\n`;
      msg += alertas.map(a => `• ${a}`).join('\n') + '\n';
    }

    if (acoesRealizadas.length > 0) {
      msg += `\n<b>⚡ AÇÕES EXECUTADAS</b>\n`;
      msg += acoesRealizadas
        .map(d => `${d.ok ? '✅' : '❌'} <b>${d.agente}</b> — ${d.acao}`)
        .join('\n') + '\n';
    }

    if (temErros) {
      msg += `\n<b>❌ ERROS</b>\n`;
      msg += decisoes
        .filter(d => !d.ok)
        .map(d => `• ${d.agente}: ${d.acao}`)
        .join('\n') + '\n';
    }

    msg += `\n<i>${decisoes.length} verificações · ${acoesRealizadas.length} ações · onovorizontino.com.br</i>`;

    enviarTelegram(msg);
  }

  return NextResponse.json({
    supervisor: 'Supervisor · Escritório Makarios',
    ciclo_em:   now.toISOString(),
    resumo,
    alertas,
    decisoes,
  });
}
