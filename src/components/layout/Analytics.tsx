'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Função global para disparar eventos no GA4
export function trackEvent(action: string, params?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;
  const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (!w.gtag) return;
  w.gtag('event', action, params);
}

export default function Analytics() {
  const pathname = usePathname();

  // ── 1. Rastreia troca de página (SPA navigation) ──────────────────────────
  useEffect(() => {
    const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
    if (!w.gtag) return;
    w.gtag('config', 'G-J10P2E3X5X', { page_path: pathname });
  }, [pathname]);

  // ── 2. Rastreia cliques via data-track ────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-track]') as HTMLElement | null;
      if (!target) return;
      const action = target.getAttribute('data-track') || 'click';
      const label = target.getAttribute('data-track-label') || target.innerText?.trim().slice(0, 60) || '';
      trackEvent(action, { event_label: label, page: pathname });
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [pathname]);

  // ── 3. Rastreia scroll depth (25%, 50%, 75%, 100%) ────────────────────────
  useEffect(() => {
    const milestones = new Set<number>();
    const handler = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);
      [25, 50, 75, 100].forEach(m => {
        if (pct >= m && !milestones.has(m)) {
          milestones.add(m);
          trackEvent('scroll_depth', { depth: m, page: pathname });
        }
      });
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [pathname]);

  // ── 4. Rastreia tempo na página (30s, 60s, 120s) ──────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => trackEvent('time_on_page', { seconds: 30, page: pathname }), 30000),
      setTimeout(() => trackEvent('time_on_page', { seconds: 60, page: pathname }), 60000),
      setTimeout(() => trackEvent('time_on_page', { seconds: 120, page: pathname }), 120000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [pathname]);

  return null;
}
