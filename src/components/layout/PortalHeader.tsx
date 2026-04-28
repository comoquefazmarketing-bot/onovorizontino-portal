'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Links do menu principal do Portal.
 *
 * NOTA: links com `/#secao` funcionam em qualquer página do Next.js —
 * o roteador navega pra home e faz scroll pro ID. Por isso não importa
 * em que página o usuário está, o menu sempre funciona.
 *
 * Para adicionar/reordenar links, edite só este array.
 */
const NAV_LINKS = [
  { label: 'Notícias', href: '/#noticias' },
  { label: 'Tigre TV', href: '/#videos' },
  { label: 'Escalação', href: '/escalacao' },
  { label: 'Tabela', href: '/#agenda' },
  { label: 'Expediente', href: '/expediente-portal-o-novorizontino' },
  { label: 'Tigre FC', href: '/tigre-fc/sobre' },
] as const

/**
 * Header global do Portal O Novorizontino.
 *
 * Este header DEVE ser montado no `app/layout.tsx` (root layout)
 * — não no `app/page.tsx`. Caso contrário, ele só aparece na home
 * e some em todas as páginas internas (que é o bug atual).
 *
 * Comportamento:
 * - Sticky no topo, fundo black/95 com backdrop blur
 * - Desktop (≥md): logo + menu horizontal + ícone Home
 * - Mobile (<md): logo + ícone Home + hamburger que abre drawer
 * - Drawer fecha automaticamente quando o usuário clica em qualquer link
 *   ou quando navega pra outra rota
 *
 * Acessibilidade:
 * - Touch targets ≥ 44x44px (h-11)
 * - aria-label em ícones-only
 * - aria-expanded no botão hamburger
 * - Foco visível com ring amarelo
 * - Navegação por teclado preservada
 */
export function PortalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Fecha o drawer automaticamente ao mudar de rota
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Trava o scroll do body quando o drawer está aberto
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        border-b border-yellow-500/20
        bg-black/95 backdrop-blur
        supports-[backdrop-filter]:bg-black/80
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
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
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

        {/* ─── NAVEGAÇÃO DESKTOP ─── */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Navegação principal"
        >
          <Link
            href="/"
            aria-label="Home"
            className="
              flex h-11 items-center gap-2 rounded-md px-3
              text-sm font-medium text-zinc-300
              transition-colors
              hover:bg-yellow-500/10 hover:text-yellow-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
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
                text-sm font-medium text-zinc-400
                transition-colors
                hover:bg-yellow-500/10 hover:text-yellow-500
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
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
              hover:bg-yellow-500/10 hover:text-yellow-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
            "
          >
            <Home className="h-5 w-5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              flex h-11 w-11 items-center justify-center rounded-md
              text-zinc-300
              transition-colors
              hover:bg-yellow-500/10 hover:text-yellow-500
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
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
          id="mobile-menu"
          aria-label="Navegação móvel"
          className="border-t border-yellow-500/20 bg-black/95 backdrop-blur md:hidden"
        >
          <ul className="mx-auto max-w-7xl divide-y divide-zinc-800 px-4 py-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="
                    flex h-12 items-center px-2
                    text-base font-medium text-zinc-300
                    transition-colors
                    hover:text-yellow-500
                    focus-visible:text-yellow-500 focus-visible:outline-none
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
  )
}
