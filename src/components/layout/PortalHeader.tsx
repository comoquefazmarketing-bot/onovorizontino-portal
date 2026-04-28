'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Links do menu principal do Portal.
 *
 * Links com `/#secao` funcionam em qualquer página — Next.js navega
 * para a home e faz scroll para o ID. Por isso o menu não quebra em
 * páginas internas (notícia, escalação, etc.).
 */
const NAV_LINKS = [
  { label: 'Notícias', href: '/#noticias' },
  { label: 'Tigre TV', href: '/#videos' },
  { label: 'Escalação', href: '/escalacao' },
  { label: 'Tabela', href: '/#agenda' },
  { label: 'Expediente', href: '/expediente-portal-o-novorizontino' },
  { label: 'Tigre FC', href: '/tigre-fc/sobre' },
] as const;

/**
 * Header global do Portal O Novorizontino.
 *
 * Montado no `app/layout.tsx` (root layout) — aparece em TODAS as
 * páginas (home, notícias, escalação, expediente, Tigre FC, futuras).
 *
 * Visual alinhado ao branding do portal:
 * - Fundo #050505/95 com backdrop blur
 * - Acento amarelo #F5C400 (não yellow-500 do Tailwind)
 * - Tipografia brutalista: uppercase, font-black, tracking-tighter
 * - Sticky no topo (z-50, acima do Ticker)
 *
 * Acessibilidade:
 * - Touch targets ≥ 44x44px (h-11)
 * - aria-label em ícones-only
 * - aria-expanded / aria-controls no hamburger
 * - Foco visível com ring amarelo
 * - Drawer fecha ao mudar de rota
 * - Scroll do body trava enquanto drawer está aberto
 */
export default function PortalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Fecha drawer ao navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Trava scroll do body com drawer aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b border-[#F5C400]/20
        bg-[#050505]/95 backdrop-blur
        supports-[backdrop-filter]:bg-[#050505]/80
      "
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* ─── LOGO (link para Home) ─── */}
        <Link
          href="/"
          aria-label="Portal O Novorizontino — Home"
          className="
            flex items-center gap-2 rounded
            transition-opacity hover:opacity-80
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400]
          "
        >
          <Image
            src="/assets/logos/LOGO - O NOVORIZONTINO.png"
            alt="Portal O Novorizontino"
            width={140}
            height={40}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        {/* ─── DESKTOP NAV ─── */}
        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Navegação principal"
        >
          <Link
            href="/"
            aria-label="Home"
            className="
              flex h-11 items-center gap-2 rounded-md px-3
              text-[11px] font-black uppercase tracking-widest text-zinc-300
              transition-colors
              hover:bg-[#F5C400]/10 hover:text-[#F5C400]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400]
            "
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Home</span>
          </Link>

          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                flex h-11 items-center rounded-md px-3
                text-[11px] font-black uppercase tracking-widest text-zinc-400
                transition-colors
                hover:bg-[#F5C400]/10 hover:text-[#F5C400]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400]
              "
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ─── MOBILE: HOME + HAMBURGER ─── */}
        <div className="flex items-center gap-1 md:hidden">
          <Link
            href="/"
            aria-label="Home"
            className="
              flex h-11 w-11 items-center justify-center rounded-md
              text-zinc-300
              transition-colors
              hover:bg-[#F5C400]/10 hover:text-[#F5C400]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400]
            "
          >
            <Home className="h-5 w-5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="portal-mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              flex h-11 w-11 items-center justify-center rounded-md
              text-zinc-300
              transition-colors
              hover:bg-[#F5C400]/10 hover:text-[#F5C400]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400]
            "
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* ─── DRAWER MOBILE ─── */}
      {mobileOpen && (
        <nav
          id="portal-mobile-menu"
          aria-label="Navegação móvel"
          className="border-t border-[#F5C400]/20 bg-[#050505]/95 backdrop-blur md:hidden"
        >
          <ul className="mx-auto max-w-7xl divide-y divide-zinc-900 px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="
                    flex h-12 items-center px-2
                    text-sm font-black uppercase tracking-widest text-zinc-300
                    transition-colors
                    hover:text-[#F5C400]
                    focus-visible:text-[#F5C400] focus-visible:outline-none
                  "
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
