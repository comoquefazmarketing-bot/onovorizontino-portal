// Recebe Supabase Database Webhooks e envia notificações Telegram.
// Configure no Supabase Dashboard → Database → Webhooks para cada tabela abaixo.
// Authorization header: Bearer {WEBHOOK_SECRET}
import { NextRequest, NextResponse } from 'next/server';
import { tg, horaBR } from '@/lib/telegram';

export const dynamic    = 'force-dynamic';
export const revalidate = 0;

const SITE = 'https://www.onovorizontino.com.br';

function autorizado(req: NextRequest): boolean {
  const secret = process.env.WEBHOOK_SECRET ?? process.env.AGENTS_SECRET;
  if (!secret) return true;
  const bearer  = req.headers.get('authorization')?.replace('Bearer ', '');
  const xSecret = req.headers.get('x-webhook-secret');
  return bearer === secret || xSecret === secret;
}

// ── Formatos de mensagem por tabela/evento ────────────────────────────────────

function msgNovoUsuario(record: any): string {
  const nome    = record.nome    ?? record.apelido ?? 'Usuário';
  const apelido = record.apelido ?? '—';
  const nivel   = record.nivel   ?? '1';
  return (
    `👤 <b>NOVO USUÁRIO — Tigre FC</b>\n` +
    `🕐 ${horaBR()}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📛 Nome: <b>${nome}</b>\n` +
    `🎮 Apelido: @${apelido}\n` +
    `⭐ Nível inicial: ${nivel}\n` +
    `\n<i>onovorizontino.com.br/tigre-fc</i>`
  );
}

function msgNovaMateria(record: any): string {
  const titulo    = record.titulo    ?? 'Sem título';
  const categoria = record.categoria ?? '—';
  const autor     = record.autor_ia  ?? 'Redação';
  const slug      = record.slug      ?? '';
  return (
    `📰 <b>NOVA MATÉRIA PUBLICADA</b>\n` +
    `🕐 ${horaBR()}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `📌 <b>${titulo}</b>\n` +
    `🏷️ Categoria: ${categoria}\n` +
    `✍️ Por: ${autor}\n` +
    (slug ? `🔗 ${SITE}/noticias/${slug}\n` : '') +
    `\n<i>Portal O Novorizontino</i>`
  );
}

function msgNovaEscalacao(record: any): string {
  const usuario = record.usuario_id ?? '—';
  const jogo    = record.jogo_id    ?? '—';
  const formacao= record.formacao   ?? '—';
  return (
    `⚽ <b>ESCALAÇÃO SALVA — Tigre FC</b>\n` +
    `🕐 ${horaBR()}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🎯 Jogo ID: ${jogo} | Formação: ${formacao}\n` +
    `👤 Usuário: ${usuario}\n` +
    `\n<i>onovorizontino.com.br/tigre-fc</i>`
  );
}

function msgNovoPalpite(record: any): string {
  const usuario  = record.usuario_id      ?? '—';
  const jogo     = record.jogo_id         ?? '—';
  const mandante = record.gols_mandante   ?? '?';
  const visitante= record.gols_visitante  ?? '?';
  return (
    `🎯 <b>NOVO PALPITE — Tigre FC</b>\n` +
    `🕐 ${horaBR()}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🏟️ Jogo ID: ${jogo}\n` +
    `📊 Placar apostado: ${mandante} × ${visitante}\n` +
    `👤 Usuário: ${usuario}\n` +
    `\n<i>onovorizontino.com.br/tigre-fc</i>`
  );
}

function msgJogoAtualizado(record: any, oldRecord: any): string {
  const mandante  = record.mandante_slug  ?? '?';
  const visitante = record.visitante_slug ?? '?';
  const pm = record.placar_mandante  ?? '?';
  const pv = record.placar_visitante ?? '?';

  // Detecta o tipo de mudança
  if (record.finalizado && !oldRecord?.finalizado) {
    return (
      `🏁 <b>JOGO FINALIZADO</b>\n` +
      `🕐 ${horaBR()}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `⚽ <b>${mandante} ${pm} × ${pv} ${visitante}</b>\n` +
      `🏆 ${record.competicao ?? ''} — Rodada ${record.rodada ?? '?'}\n` +
      `\n<i>onovorizontino.com.br</i>`
    );
  }

  if (
    oldRecord &&
    (record.placar_mandante !== oldRecord.placar_mandante ||
     record.placar_visitante !== oldRecord.placar_visitante)
  ) {
    return (
      `⚽ <b>GOL MARCADO</b>\n` +
      `🕐 ${horaBR()}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏟️ ${mandante} <b>${pm} × ${pv}</b> ${visitante}\n` +
      `\n<i>Atualização em tempo real</i>`
    );
  }

  if (record.ativo && !oldRecord?.ativo) {
    return (
      `🟢 <b>JOGO INICIADO</b>\n` +
      `🕐 ${horaBR()}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏟️ <b>${mandante} × ${visitante}</b>\n` +
      `🏆 ${record.competicao ?? ''} — Rodada ${record.rodada ?? '?'}\n` +
      `\n<i>onovorizontino.com.br</i>`
    );
  }

  return '';
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  if (!autorizado(req)) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });
  }

  try {
    const payload = await req.json();
    const { type, table, record, old_record } = payload;

    if (!table || !record) {
      return NextResponse.json({ ignorado: true, motivo: 'payload inválido' });
    }

    let msg = '';

    switch (table) {
      case 'tigre_fc_usuarios':
        if (type === 'INSERT') msg = msgNovoUsuario(record);
        break;

      case 'postagens':
        if (type === 'INSERT' && record.status === 'published') msg = msgNovaMateria(record);
        break;

      case 'tigre_fc_escalacoes':
        if (type === 'INSERT') msg = msgNovaEscalacao(record);
        break;

      case 'tigre_fc_palpites':
        if (type === 'INSERT') msg = msgNovoPalpite(record);
        break;

      case 'jogos':
        if (type === 'UPDATE') msg = msgJogoAtualizado(record, old_record);
        break;

      default:
        return NextResponse.json({ ignorado: true, motivo: `tabela '${table}' não monitorada` });
    }

    if (msg) {
      await tg(msg);
      return NextResponse.json({ ok: true, tabela: table, evento: type });
    }

    return NextResponse.json({ ignorado: true, motivo: 'evento sem mensagem configurada' });
  } catch (err) {
    console.error('[supabase-webhook]', err);
    return NextResponse.json({ erro: String(err) }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status:  'online',
    rota:    '/api/notifications/supabase-webhook',
    tabelas: ['tigre_fc_usuarios', 'postagens', 'tigre_fc_escalacoes', 'tigre_fc_palpites', 'jogos'],
  });
}
