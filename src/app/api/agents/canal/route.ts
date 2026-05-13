// Agente Canal — gera conteúdo para o Canal do WhatsApp e envia ao admin via Telegram.
// O admin recebe o texto formatado e cola direto no Canal.
// Chamado pelo Supervisor: 1× manhã (8–10h BR) e 1× tarde (17–19h BR).
import { NextRequest, NextResponse } from 'next/server';
import { tg, horaBR } from '@/lib/telegram';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SITE          = 'https://www.onovorizontino.com.br';
const CHANNEL_URL   = 'https://whatsapp.com/channel/0029VbCHacz2P59ioS22VU09';

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

// ── Geradores de conteúdo ─────────────────────────────────────────────────────

interface DadosCanal {
  ultimoJogo:    any | null;
  proximoJogo:   any | null;
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
      `📣 Canal do Tigre no WhatsApp:\n${CHANNEL_URL}`
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
      `📣 Canal do Tigre no WhatsApp:\n${CHANNEL_URL}`
    );
  }

  const mat = ultimaMaterias[0] ?? null;
  if (mat) {
    return (
      `📰 *${mat.titulo ?? 'Novidade no Portal'}*\n\n` +
      `${mat.resumo ?? 'Acompanhe as últimas do Grêmio Novorizontino.'}\n\n` +
      `👉 Leia mais: ${SITE}/noticias/${mat.slug}\n\n` +
      `📣 Canal do Tigre no WhatsApp:\n${CHANNEL_URL}`
    );
  }

  return (
    `🐯 *Portal O Novorizontino*\n\n` +
    `Fique por dentro de tudo sobre o Grêmio Novorizontino.\n` +
    `Notícias, resultados e novidades do Tigre do Vale.\n\n` +
    `👉 ${SITE}\n\n` +
    `📣 Canal do Tigre no WhatsApp:\n${CHANNEL_URL}`
  );
}

function gerarConteudoTarde({ ultimoJogo, proximoJogo, ultimaMaterias }: DadosCanal): string {
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
      `🎯 Monte seu time e prove que você conhece o Novorizontino:\n` +
      `👉 ${SITE}/tigre-fc\n\n` +
      `📣 Canal do Tigre no WhatsApp:\n${CHANNEL_URL}`
    );
  }

  const mat = ultimaMaterias[0] ?? null;
  if (mat) {
    return (
      `📰 *Você viu?*\n\n` +
      `*${mat.titulo ?? 'Novidade no Portal'}*\n\n` +
      `${mat.resumo ?? 'Acompanhe a cobertura completa do Grêmio Novorizontino.'}\n\n` +
      `👉 Leia mais: ${SITE}/noticias/${mat.slug}\n\n` +
      `📣 Canal do Tigre no WhatsApp:\n${CHANNEL_URL}`
    );
  }

  return (
    `🐯 *O Tigre do Vale está de olho em você!*\n\n` +
    `Acompanhe o Novorizontino de perto — notícias exclusivas, resultados e o Tigre FC, ` +
    `o fantasy game oficial da torcida.\n\n` +
    `👉 ${SITE}\n` +
    `🎮 ${SITE}/tigre-fc\n\n` +
    `📣 Canal do Tigre no WhatsApp:\n${CHANNEL_URL}`
  );
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  const turno = req.nextUrl.searchParams.get('turno') ?? 'manha'; // 'manha' | 'tarde'

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

  // Envia ao admin via Telegram com o texto pronto para colar no Canal
  const textoEscapado = conteudo
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const msgAdmin =
    `📱 <b>CONTEÚDO PARA O CANAL DO WHATSAPP</b>\n` +
    `🕐 ${horaBR()} · ${turno === 'tarde' ? 'Tarde/Noite' : 'Manhã'}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `<pre>${textoEscapado}</pre>\n\n` +
    `<i>Copie e cole no Canal do WhatsApp do Tigre</i>`;

  await tg(msgAdmin);

  return NextResponse.json({
    agente:            'Canal',
    turno,
    conteudo,
    enviado_telegram:  true,
    horario:           horaBR(),
  });
}
