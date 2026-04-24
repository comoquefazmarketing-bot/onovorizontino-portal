// src/components/layout/HomeButton.tsx
// Botão de voltar para home — use em qualquer página
// Coloque no topo E rodapé das páginas internas

import Link from 'next/link';

interface Props {
  position?: 'top' | 'bottom';
  className?: string;
}

export default function HomeButton({ position = 'top', className = '' }: Props) {
  const isTop = position === 'top';
  return (
    <div className={`w-full ${isTop ? 'border-b border-white/5' : 'border-t border-white/5'} bg-black/60 backdrop-blur-md ${className}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo / identidade */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png"
            alt="Novorizontino"
            width={28}
            height={28}
            className="w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 group-hover:text-[#F5C400] transition-colors">
            Portal O Novorizontino
          </span>
        </Link>

        {/* Botão de volta */}
        <Link href="/"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-[#F5C400] transition-all group">
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          HOME
        </Link>
      </div>
    </div>
  );
}
