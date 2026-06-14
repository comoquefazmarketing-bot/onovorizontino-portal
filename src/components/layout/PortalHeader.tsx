'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Notícias',  href: '/noticias' },
  { label: 'Tigre TV',  href: '/videos' },
  { label: 'Escalação', href: '/escalacao' },
  { label: 'Tabela',    href: '/tabela' },
  { label: 'Tigre FC',  href: '/tigre-fc' },
  { label: 'Expediente', href: '/expediente-portal-o-novorizontino' },
] as const;

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18" />
      <line x1="6"  y1="6"  x2="18" y2="18" />
    </svg>
  );
}

export default function PortalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Fecha drawer ao navegar
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Trava scroll com drawer aberto
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  };

  const linkBase = `
    flex h-11 items-center rounded-md px-3
    text-[11px] font-black uppercase tracking-widest
    transition-colors duration-150
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan
  `;

  const linkIdle   = 'text-ink/70 hover:text-gold hover:bg-gold/10';
  const linkActive = 'text-gold border-b-2 border-gold pb-0';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/15 bg-bg/95 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* LOGO */}
        <Link href="/" aria-label="Portal O Novorizontino — Home"
          className="flex items-center gap-2 rounded transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan">
          <Image src="/assets/logos/LOGO - O NOVORIZONTINO.png"
            alt="Portal O Novorizontino" width={140} height={40}
            className="h-9 w-auto sm:h-10" priority />
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Navegação principal">
          <Link href="/"
            aria-label="Home"
            className={`${linkBase} gap-1.5 ${isActive('/') ? linkActive : linkIdle}`}>
            <IconHome />
            <span>Home</span>
          </Link>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}
              className={`${linkBase} ${isActive(link.href) ? linkActive : linkIdle}`}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* MOBILE: HOME + HAMBURGER */}
        <div className="flex items-center gap-1 md:hidden">
          <Link href="/" aria-label="Home"
            className={`flex h-11 w-11 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan ${isActive('/') ? 'text-gold' : 'text-ink/60 hover:text-gold'}`}>
            <IconHome />
          </Link>
          <button type="button"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="portal-mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-ink/60 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan">
            {mobileOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* DRAWER MOBILE */}
      {mobileOpen && (
        <nav id="portal-mobile-menu" aria-label="Navegação móvel"
          className="border-t border-gold/15 bg-bg/95 backdrop-blur md:hidden">
          <ul className="mx-auto max-w-7xl divide-y divide-white/5 px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}
                  className={`flex h-12 items-center px-2 text-sm font-black uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:text-cyan ${isActive(link.href) ? 'text-gold' : 'text-ink/70 hover:text-gold'}`}>
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
