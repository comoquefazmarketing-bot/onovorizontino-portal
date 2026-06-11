'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/selecao',           label: 'Seleção',     emoji: '🇧🇷', hash: '' },
  { href: '/copa',              label: 'Tabela',      emoji: '📊', hash: '#tabela' },
  { href: '/copa',              label: 'Simulador',   emoji: '⚽', hash: '#simulador' },
  { href: '/copa',              label: 'Calculadora', emoji: '🧮', hash: '#calculadora' },
];

export default function CopaSubnav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Copa 2026 — ferramentas"
      className="sticky top-0 z-30 border-b"
      style={{
        background: 'rgba(5,8,5,0.96)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0,156,59,0.25)',
      }}
    >
      <div className="max-w-6xl mx-auto px-3 flex items-center gap-0 overflow-x-auto scrollbar-none">

        {/* Badge Copa */}
        <div
          className="flex items-center gap-1.5 pr-4 mr-2 border-r flex-shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.08)' }}
        >
          <span className="text-base">🏆</span>
          <span
            className="text-[11px] font-black uppercase tracking-wider hidden sm:block"
            style={{ color: '#F5C400' }}
          >
            Copa 2026
          </span>
        </div>

        {/* Links */}
        {LINKS.map((l, i) => {
          const isActive =
            l.href === '/selecao'
              ? pathname === '/selecao'
              : pathname === '/copa';

          // só mostra "Seleção" se não estiver na /selecao; e os de /copa se não estiver em /copa
          // mas na verdade mostra todos, só marca o ativo
          return (
            <Link
              key={`${l.href}${i}`}
              href={`${l.href}${l.hash}`}
              className="flex items-center gap-1.5 px-3 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap flex-shrink-0"
              style={{
                borderColor: isActive && (
                  (l.href === '/selecao' && pathname === '/selecao') ||
                  (l.href === '/copa' && pathname === '/copa')
                ) ? '#F5C400' : 'transparent',
                color: (
                  (l.href === '/selecao' && pathname === '/selecao') ||
                  (l.href === '/copa' && pathname === '/copa')
                ) ? '#F5C400' : '#71717a',
              }}
              aria-current={
                (l.href === pathname) ? 'page' : undefined
              }
            >
              <span className="text-sm">{l.emoji}</span>
              <span className="hidden xs:block">{l.label}</span>
            </Link>
          );
        })}

        {/* Contador de jogos */}
        <div className="ml-auto flex-shrink-0 pl-4 hidden md:flex items-center gap-1.5"
          style={{ borderLeft: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00c94a] animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
            11 Jun – 19 Jul
          </span>
        </div>
      </div>
    </nav>
  );
}
