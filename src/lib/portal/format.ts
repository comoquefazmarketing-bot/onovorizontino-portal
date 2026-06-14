/** Tempo relativo em PT-BR */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'agora';
  if (m < 60) return `${m} min atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  if (d < 7)  return `${d}d atrás`;
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

/** Badge de categoria — dourado/grafite apenas (sem azul/verde/roxo) */
export function catBadgeClass(_cat: string): string {
  return 'bg-gold/10 text-gold border border-gold/20';
}
