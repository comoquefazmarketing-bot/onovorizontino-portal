// src/lib/telegram.ts
// Utilitário de envio de mensagens via Telegram Bot API.

export interface TelegramPayload {
  texto:      string;
  chatId:     string;
  botToken:   string;
  parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
}

/**
 * Envia uma mensagem para um chat do Telegram.
 * Retorna true se o envio foi aceito pela API (HTTP 2xx), false caso contrário.
 * Nunca lança exceção — falhas são logadas e engolidas.
 */
export async function enviarMensagemTelegram(p: TelegramPayload): Promise<boolean> {
  const url  = `https://api.telegram.org/bot${p.botToken}/sendMessage`;
  const body: Record<string, string> = {
    chat_id: p.chatId,
    text:    p.texto,
  };
  if (p.parseMode) body.parse_mode = p.parseMode;

  try {
    const res = await fetch(url, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.warn(`[Telegram] HTTP ${res.status}: ${err}`);
    }
    return res.ok;
  } catch (e) {
    console.warn('[Telegram] Falha ao enviar mensagem:', e);
    return false;
  }
}
