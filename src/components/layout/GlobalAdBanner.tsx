'use client';
import { useState, useEffect } from 'react';

const VIDEOS = [
  {
    src: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Encontre%20o%20lugar%20ideal%20(1280%20x%20100%20px)%20(1).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9FbmNvbnRyZSBvIGx1Z2FyIGlkZWFsICgxMjgwIHggMTAwIHB4KSAoMSkubXA0IiwiaWF0IjoxNzc0NjM2MzE2LCJleHAiOjE4MDYxNzIzMTZ9.-6sjQURNz8kHVAaFg0CW6Ti0jltdiWF48v4bcVkGOMg",
    href: "https://www.borala.app.br/",
  },
  {
    src: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/sign/imagens-portal/Encontre%20o%20lugar%20ideal%20(1280%20x%20100%20px).mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YWRmNjZiNC02ZTNlLTRmYjQtOTk0ZC05YzFkYjNiYTQ0YzIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZW5zLXBvcnRhbC9FbmNvbnRyZSBvIGx1Z2FyIGlkZWFsICgxMjgwIHggMTAwIHB4KS5tcDQiLCJpYXQiOjE3NzQ2MzYzMjcsImV4cCI6MTgwNjE3MjMyN30.GN2Uyw4zYVzJq0Bd5uNF3X19ljiqp80-WltP-X27q5U",
    href: "https://www.borala.app.br/",
  },
];

// Sequência: video0 → video1 → CTA → video0 → ...
// Cada slot dura 8s, CTA dura 5s
const SEQUENCE = [0, 1, 'cta'] as const;
type Slot = 0 | 1 | 'cta';
const DURATIONS: Record<string, number> = { '0': 8000, '1': 8000, 'cta': 5000 };

export default function GlobalAdBanner() {
  const [slot, setSlot] = useState<Slot>(0);

  useEffect(() => {
    const advance = (current: Slot) => {
      const idx = SEQUENCE.indexOf(current);
      const next = SEQUENCE[(idx + 1) % SEQUENCE.length];
      const timer = setTimeout(() => {
        setSlot(next);
        advance(next);
      }, DURATIONS[String(current)]);
      return timer;
    };
    const timer = advance(slot);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full bg-black border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-2">

        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 text-center mb-1">
          PUBLICIDADE
        </p>

        <div className="relative w-full overflow-hidden rounded-sm" style={{ height: '100px' }}>

          {/* ── VÍDEO 1 — BoraLá ── */}
          {VIDEOS.map((video, i) => (
            <a
              key={i}
              href={video.href}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 group cursor-pointer transition-opacity duration-700"
              style={{
                opacity: slot === i ? 1 : 0,
                pointerEvents: slot === i ? 'auto' : 'none',
              }}
            >
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </a>
          ))}

          {/* ── CTA CRIATIVO ── */}
          <a
            href="https://wa.me/5517988031679?text=Olá Felipe, vi o Portal O Novorizontino e quero anunciar para os torcedores do Tigre!"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 cursor-pointer group transition-opacity duration-700 overflow-hidden"
            style={{
              opacity: slot === 'cta' ? 1 : 0,
              pointerEvents: slot === 'cta' ? 'auto' : 'none',
              background: 'linear-gradient(135deg, #0a0a0a 0%, #111 40%, #1a1400 100%)',
            }}
          >
            {/* Efeito de brilho animado */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(245,196,0,0.15) 40px, rgba(245,196,0,0.15) 41px)',
              }}
            />

            {/* Conteúdo */}
            <div className="relative z-10 flex items-center justify-between h-full px-8 md:px-16">

              {/* Esquerda — texto */}
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-yellow-500 text-2xl">🟡</span>
                  <span className="text-black text-2xl">⚫</span>
                </div>
                <div>
                  <p
                    className="font-black italic uppercase leading-none text-white"
                    style={{ fontSize: 'clamp(1rem, 2.5vw, 1.6rem)', letterSpacing: '-0.02em' }}
                  >
                    SUA MARCA NO{' '}
                    <span className="text-yellow-500">CORAÇÃO DO TIGRE</span>
                  </p>
                  <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.25em] mt-1">
                    Alcance milhares de torcedores apaixonados de Novo Horizonte
                  </p>
                </div>
              </div>

              {/* Direita — CTA */}
              <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <p className="text-zinc-500 text-[9px] uppercase tracking-widest">Departamento Comercial</p>
                  <p className="text-white font-black text-sm uppercase tracking-widest">Felipe Makarios</p>
                  <p className="text-yellow-500 text-[10px] font-bold">(17) 98803-1679</p>
                </div>
                <div className="bg-yellow-500 group-hover:bg-white transition-all duration-300 px-6 py-3 flex items-center gap-2">
                  <span className="text-black font-black text-[10px] uppercase tracking-widest whitespace-nowrap">
                    QUERO ANUNCIAR
                  </span>
                  <span className="text-black font-black transition-transform group-hover:translate-x-1 duration-300">→</span>
                </div>
              </div>

            </div>

            {/* Borda amarela lateral */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500" />
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-yellow-500" />
          </a>

        </div>
      </div>
    </div>
  );
}
