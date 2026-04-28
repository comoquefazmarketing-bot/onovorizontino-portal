'use client'

import Link from 'next/link'
import { Home } from 'lucide-react'
import { useEffect, useState } from 'react'

interface HomeFABProps {
  /** Destino. Default: "/" (home do portal). */
  href?: string
  /** Distância de scroll (px) pra aparecer. Default: 300. */
  showAfterScroll?: number
}

/**
 * Floating Action Button mobile que leva para a Home.
 *
 * Comportamento:
 * - Visível apenas em viewports < md (md:hidden)
 * - Aparece com fade depois de o usuário rolar `showAfterScroll`px
 *   (default: 300px). Antes disso fica oculto pra não atrapalhar
 *   a primeira dobra.
 * - 56x56px (touch target generoso, fácil pro polegar)
 * - Posição fixa: bottom-5 right-5
 *
 * Importante: o usuário JÁ tem o ícone Home no header sticky
 * (PortalHeader). O FAB é redundância intencional, útil quando o
 * usuário rolou muito numa matéria longa e quer voltar rápido.
 *
 * Acessibilidade:
 * - aria-label descritivo
 * - Foco visível com ring amarelo
 * - `pointer-events-none` quando invisível, evita clicks fantasma
 */
export function HomeFAB({ href = '/', showAfterScroll = 300 }: HomeFABProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfterScroll)
    onScroll() // checa estado inicial
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [showAfterScroll])

  return (
    <Link
      href={href}
      aria-label="Voltar para a Home"
      className={`
        fixed bottom-5 right-5 z-40
        flex h-14 w-14 items-center justify-center
        rounded-full
        bg-black/80 text-yellow-500
        shadow-lg shadow-black/50
        ring-1 ring-yellow-500/30
        backdrop-blur
        transition-all duration-200
        hover:bg-black hover:ring-yellow-500/60
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
        md:hidden
        ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-4 opacity-0'
        }
      `}
    >
      <Home className="h-6 w-6" aria-hidden="true" />
    </Link>
  )
}
