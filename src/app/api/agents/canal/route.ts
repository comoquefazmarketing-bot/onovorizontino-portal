// Agente Canal — gera conteúdo e publica diretamente no Canal do WhatsApp
// via Evolution API. Fallback: envia ao admin via Telegram se Evolution falhar.
// Chamado pelo Supervisor: 1× manhã (8–10h BR) e 1× tarde (17–19h BR).
import { NextRequest, NextResponse } from 'next/server';
import { tg, horaBR } from '@/lib/telegram';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE          = 'https://www.onovorizontino.com.br';
const CHANNEL_URL   = 'https://whatsapp.com/channel/0029VbCHacz2P59ioS22VU09';

// Evolution API
const EVO_URL      = (process.env.EVOLUTION_API_URL ?? '').replace(/\/$/, '');
const EVO_KEY      = process.env.EVOLUTION_API_KEY  ?? '';
const EVO_INSTANCE = process.env.EVOLUTION_INSTANCE ?? '';
// JID do canal: número do canal + @newsletter
const CHANNEL_JID  = process.env.WHATSAPP_CHANNEL_JID ?? '0029VbCHacz2P59ioS22VU09@newsletter';

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
      headers: anonH, cache: 'no-store',
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

// ── Envio via Evolution API ───────────────────────────────────────────────────

async function enviarWhatsApp(texto: string): Promise<{ ok: boolean; erro?: string }> {
  if (!EVO_URL || !EVO_KEY || !EVO_INSTANCE) {
    return { ok: false, erro: 'Evolution API não configurada (env vars ausentes)' };
  }

  try {
    const res = await fetch(`${EVO_URL}/message/sendText/${EVO_INSTANCE}`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey':       EVO_KEY,
      },
      body: JSON.stringify({
        number: CHANNEL_JID,
        text:   texto,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, erro: `Evolution API HTTP ${res.status}: ${body}` };
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, erro: String(err) };
  }
}

// ── Geradores de conteúdo ─────────────────────────────────────────────────────

interface DadosCanal {
  ultimoJogo:     any | null;
  proximoJogo:    any | null;
  ultimaMaterias: any[];
}

function gerarConteudoManha({ ultimoJogo, proximoJogo, ultimaMaterias }: DadosCanal): string {
  if (proximoJogo) {
    const dataJogo  = new Date(proximoJogo.data_hora);
    const dia       = dataJogo.toLocaleDateString('pt-BR', { weekday:'long', day:'2-digit', month:'long', timeZone:'America/Sao_Paulo' });
    const hora      = dataJogo.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo' });
    const mandante  = (proximoJogo.mandante_slug  ?? '?').toUpperCase();
    const visitante = (proximoJogo.visitante_slug ?? '?').toUpperCase();

    return (
      `🐯 *BORA, TIGRE!*\n\n` +
      `O Novorizontino joga ${dia} às ${hora}.\n\n` +
      `⚽ *${mandante} × ${visitante}*\n` +
      `🏆 ${proximoJogo.competicao ?? 'Série B'} — Rodada ${proximoJogo.rodada ?? '?'}\n` +
      (proximoJogo.local ? `📍 ${proximoJogo.local}\n` : '') +
      `\n🎯 Monte sua escalação e crave o placar:\n` +
      `👉 ${SITE}/tigre-fc\n\n` +
      `📣 Siga o Canal: ${CHANNEL_URL}`
    );
  }

  if (ultimoJogo) {
    const pm  = ultimoJogo.placar_mandante  ?? 0;
    const pv  = ultimoJogo.placar_visitante ?? 0;
    const mandante  = (ultimoJogo.mandante_slug  ?? '?').toUpperCase();
    const visitante = (ultimoJogo.visitante_slug ?? '?').toUpperCase();
    const resultado = pm > pv ? '✅ VITÓRIA DO TIGRE!' : pm < pv ? '😔 Derrota, mas o Tigre continua de pé.' : '🤝 Empate na batalha.';
    const mat = ultimaMaterias[0] ?? null;

    return (
      `${resultado}\n\n` +
      `⚽ *${mandante} ${pm} × ${pv} ${visitante}*\n` +
      `🏆 ${ultimoJogo.competicao ?? 'Série B'} — Rodada ${ultimoJogo.rodada ?? '?'}\n\n` +
      (mat ? `📰 Leia a análise completa:\n${SITE}/noticias/${mat.slug}\n\n` : '') +
      `📣 Siga o Canal: ${CHANNEL_URL}`
    );
  }

  const mat = ultimaMaterias[0] ?? null;
  if (mat) {
    return (
      `📰 *${mat.titulo ?? 'Novidade no Portal'}*\n\n` +
      `${mat.resumo ?? 'Acompanhe as últimas do Grêmio Novorizontino.'}\n\n` +
      `👉 Leia mais: ${SITE}/noticias/${mat.slug}\n\n` +
      `📣 Siga o Canal: ${CHANNEL_URL}`
    );
  }

  return (
    `🐯 *Portal O Novorizontino*\n\n` +
    `Fique por dentro de tudo sobre o Grêmio Novorizontino.\n` +
    `Notícias, resultados e novidades do Tigre do Vale.\n\n` +
    `👉 ${SITE}\n\n` +
    `📣 Siga o Canal: ${CHANNEL_URL}`
  );
}

function gerarConteudoTarde({ proximoJogo, ultimaMaterias }: DadosCanal): string {
  if (proximoJogo) {
    const mandante  = (proximoJogo.mandante_slug  ?? '?').toUpperCase();
    const visitante = (proximoJogo.visitante_slug ?? '?').toUpperCase();
    const horasAte  = Math.round((new Date(proximoJogo.data_hora).getTime() - Date.now()) / 3_600_000);

    return (
      `💬 *ENQUETE DO TIGRE*\n\n` +
      `${mandante} × ${visitante} em ${horasAte}h — como você espera que o jogo termine?\n\n` +
      `1️⃣ Vitória do Tigre 🏆\n` +
      `2️⃣ Empate ⚖️\n` +
      `3️⃣ Derrota 😤\n\n` +
      `🎯 Monte seu time no Tigre FC:\n` +
      `👉 ${SITE}/tigre-fc\n\n` +
      `📣 Siga o Canal: ${CHANNEL_URL}`
    );
  }

  const mat = ultimaMaterias[0] ?? null;
  if (mat) {
    return (
      `📰 *Você viu?*\n\n` +
      `*${mat.titulo ?? 'Novidade no Portal'}*\n\n` +
      `${mat.resumo ?? 'Acompanhe a cobertura completa do Grêmio Novorizontino.'}\n\n` +
      `👉 Leia mais: ${SITE}/noticias/${mat.slug}\n\n` +
      `📣 Siga o Canal: ${CHANNEL_URL}`
    );
  }

  return (
    `🐯 *O Tigre do Vale está de olho em você!*\n\n` +
    `Acompanhe o Novorizontino de perto — notícias exclusivas, resultados e o Tigre FC, ` +
    `o fantasy game oficial da torcida.\n\n` +
    `👉 ${SITE}\n` +
    `🎮 ${SITE}/tigre-fc\n\n` +
    `📣 Siga o Canal: ${CHANNEL_URL}`
  );
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  const turno = req.nextUrl.searchParams.get('turno') ?? 'manha';

  const [ultimosJogos, proximosJogos, ultimaMaterias] = await Promise.all([
    supaFetch(
      'jogos?finalizado=eq.true&placar_mandante=not.is.null' +
      '&select=id,rodada,competicao,mandante_slug,visitante_slug,placar_mandante,placar_visitante,data_hora,local' +
      '&order=data_hora.desc&limit=1',
    ),
    supaFetch(
      `jogos?finalizado=eq.false&data_hora=gte.${encodeURIComponent(new Date().toISOString())}` +
      '&select=id,rodada,competicao,mandante_slug,visitante_slug,data_hora,local' +
      '&order=data_hora.asc&limit=1',
    ),
    supaFetch(
      'postagens?status=eq.published&select=titulo,slug,resumo,categoria,criado_em' +
      '&order=criado_em.desc&limit=3',
    ),
  ]);

  const ultimoJogo  = ultimosJogos[0]  ?? null;
  const proximoJogo = proximosJogos[0] ?? null;
  const dados: DadosCanal = { ultimoJogo, proximoJogo, ultimaMaterias };

  const conteudo = turno === 'tarde' ? gerarConteudoTarde(dados) : gerarConteudoManha(dados);

  // Tenta enviar direto ao Canal via Evolution API
  const { ok: waOk, erro: waErro } = await enviarWhatsApp(conteudo);

  if (waOk) {
    // Confirma no Telegram sem o conteúdo completo (só aviso de sucesso)
    await tg(
      `✅ <b>Canal do WhatsApp</b> — postagem ${turno} publicada\n` +
      `🕐 ${horaBR()}\n` +
      `<i>Conteúdo enviado diretamente ao Canal do Tigre</i>`
    );
  } else {
    // Fallback: manda o conteúdo completo via Telegram para o admin colar
    console.warn('[Canal] Evolution API falhou, usando fallback Telegram:', waErro);
    const textoEscapado = conteudo
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    await tg(
      `⚠️ <b>Canal WhatsApp — envio automático falhou</b>\n` +
      `🕐 ${horaBR()} · ${turno === 'tarde' ? 'Tarde/Noite' : 'Manhã'}\n` +
      `Erro: <code>${waErro ?? 'desconhecido'}</code>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `<pre>${textoEscapado}</pre>\n\n` +
      `<i>Cole o texto acima no Canal do WhatsApp manualmente</i>`
    );
  }

  return NextResponse.json({
    agente:           'Canal',
    turno,
    whatsapp_direto:  waOk,
    whatsapp_erro:    waErro ?? null,
    horario:          horaBR(),
  });
}
