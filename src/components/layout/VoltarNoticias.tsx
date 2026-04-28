'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface VoltarNoticiasProps {
  /**
   * Destino. Default: "/noticias" (listagem de notícias).
   * Use "/" para voltar para a Home, ou outra rota relevante.
   */
  href?: string
  /**
   * Texto. Default: "Voltar para Notícias".
   */
  label?: string
}

/**
 * Link "← Voltar para Notícias" usado no TOPO de páginas de notícia
 * individuais (`app/noticias/[slug]/page.tsx`).
 *
 * Spec original do produto:
 *   "No topo de cada notícia, logo acima do título, inserir um link:
 *    ← Voltar para Notícias / Home.
 *    Estilo: texto em zinc-400 que muda para yellow-500 no hover."
 *
 * Como usar (ver INTEGRACAO_EXEMPLOS.tsx):
 *
 *   export default function NoticiaPage() {
 *     return (
 *       <>
 *         <VoltarNoticias />     // ← inserir AQUI, antes da imagem/título
 *         <article>...</article>
 *       </>
 *     )
 *   }
 */
export function VoltarNoticias({
  href = '/noticias',
  label = 'Voltar para Notícias',
}: VoltarNoticiasProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-4">
      <Link
        href={href}
        className="
          inline-flex h-11 items-center gap-2
          text-sm font-medium text-zinc-400
          transition-colors
          hover:text-yellow-500
          focus-visible:text-yellow-500 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2
          focus-visible:ring-offset-black rounded
        "
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        <span>{label}</span>
      </Link>
    </div>
  )
}
