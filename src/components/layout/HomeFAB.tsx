'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';

interface HomeFABProps {
  /** Destino. Default: "/". */
  href?: string;
  /** Distância de scroll (px) para aparecer. Default: 300. */
  showAfterScroll?: number;
}

/**
 * Floating Action Button mobile — leva para Home.
 *
 * Posicionado em BOTTOM-LEFT (canto inferior esquerdo) para não
 * colidir com o TigreFCButton e o ModoDesespero, que tipicamente
 * vivem no canto inferior direito. Se preferir trocar de lado,
 * mude `left-5` para `right-5` (e ajuste z-index se necessário).
 *
 * Comportamento:
 * - Visível só em mobile (md:hidden)
 * - Aparece com fade após `showAfterScroll`px de scroll
 * - 56x56px (h-14 w-14) — touch target generoso
 * - Redundante ao ícone Home do header sticky, mas útil em
 *   matérias longas onde a leitura imersiva pode levar o usuário
 *   a esquecer da nav superior.
 *
 * Acessibilidade:
 * - aria-label descritivo
 * - Foco visível com ring amarelo
 * - pointer-events-none quando invisível, evita clicks fantasma
 */
export default function HomeFAB({
  href = '/',
  showAfterScroll = 300,
}: HomeFABProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > showAfterScroll);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [showAfterScroll]);

  return (
    <Link
      href={href}
      aria-label="Voltar para a Home"
      className={`
        fixed bottom-5 left-5 z-40
        flex h-14 w-14 items-center justify-center
        rounded-full
        bg-[#050505]/85 text-[#F5C400]
        shadow-lg shadow-black/50
        ring-1 ring-[#F5C400]/30
        backdrop-blur
        transition-all duration-200
        hover:bg-black hover:ring-[#F5C400]/60
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C400]
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
  );
}
