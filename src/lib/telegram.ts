// Utilitário central de notificações Telegram.
// Todos os agentes e webhooks usam esta função para garantir consistência.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID   ?? '';

export async function tg(texto: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: CHAT_ID, text: texto, parse_mode: 'HTML' }),
  }).catch(e => console.warn('[Telegram]', e));
}

export function horaBR(d = new Date()): string {
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day:      '2-digit',
    month:    '2-digit',
    year:     'numeric',
    hour:     '2-digit',
    minute:   '2-digit',
  });
}
