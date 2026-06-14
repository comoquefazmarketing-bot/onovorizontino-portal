'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useTransition } from 'react';

export default function BuscaNoticia() {
  const router = useRouter();
  const params = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  const query = params.get('q') ?? '';

  const submit = (value: string) => {
    const trimmed = value.trim();
    startTransition(() => {
      if (!trimmed) {
        router.push('/noticias');
      } else {
        router.push(`/noticias?q=${encodeURIComponent(trimmed)}`);
      }
    });
  };

  return (
    <form
      role="search"
      aria-label="Buscar notícias"
      onSubmit={e => {
        e.preventDefault();
        submit(inputRef.current?.value ?? '');
      }}
      className="relative flex items-center">
      <label htmlFor="busca-noticia" className="sr-only">Buscar notícias</label>
      <input
        id="busca-noticia"
        ref={inputRef}
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Buscar notícias…"
        autoComplete="off"
        className="h-9 w-48 rounded-full border border-white/10 bg-white/5 pl-9 pr-4
          font-body text-[12px] text-ink placeholder:text-muted
          transition-all duration-200
          focus:w-64 focus:border-gold/40 focus:bg-white/8 focus:outline-none focus:ring-1 focus:ring-gold/30
          md:w-56 md:focus:w-72"
      />
      {/* Ícone lupa */}
      <span className="pointer-events-none absolute left-3 text-muted" aria-hidden="true">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      {pending && (
        <span className="absolute right-3 animate-spin text-muted" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </span>
      )}
    </form>
  );
}
