'use client';

import Link from 'next/link';

interface VoltarNoticiasProps {
  /** Destino. Default: "/noticias". */
  href?: string;
  /** Texto. Default: "Voltar para Notícias". */
  label?: string;
}

/**
 * Link "← Voltar para Notícias" no topo da página de notícia.
 *
 * Visual alinhado ao padrão "TODAS AS NOTÍCIAS" que já existe no
 * rodapé da matéria — uppercase, tracking widest, font-black,
 * cor zinc-500 → #F5C400 no hover, animação de seta no group-hover.
 *
 * Posicionamento: faixa fina ANTES do hero da notícia, com max-width
 * e padding alinhados ao container do conteúdo (max-w-5xl).
 */
export default function VoltarNoticias({
  href = '/noticias',
  label = 'Voltar para Notícias',
}: VoltarNoticiasProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 md:px-12 pt-6 pb-2">
      <Link
        href={href}
        className="
          group inline-flex h-11 items-center gap-2 rounded
          text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500
          transition-all
          hover:text-[#F5C400]
          focus-visible:text-[#F5C400] focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-[#F5C400] focus-visible:ring-offset-2
          focus-visible:ring-offset-[#050505]
        "
      >
        <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">
          ←
        </span>
        <span>{label}</span>
      </Link>
    </div>
  );
}
