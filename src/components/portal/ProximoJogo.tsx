'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface JogoData {
  id: number;
  competicao: string | null;
  rodada: string | null;
  data_hora: string | null;
  finalizado: boolean | null;
  placar_mandante: number | null;
  placar_visitante: number | null;
  mandante:  { nome: string; escudo_url: string | null; slug?: string };
  visitante: { nome: string; escudo_url: string | null; slug?: string };
}

function pad(n: number) { return String(n).padStart(2, '0'); }

function useCountdown(target: string | null) {
  const [diff, setDiff] = useState<number>(() =>
    target ? new Date(target).getTime() - Date.now() : -1
  );
  useEffect(() => {
    if (!target) return;
    const id = setInterval(() => setDiff(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);
  if (diff < 0) return null;
  const s = Math.floor(diff / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function Escudo({ url, alt }: { url: string | null; alt: string }) {
  if (!url) return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[9px] font-black text-muted">
      {alt.slice(0, 3).toUpperCase()}
    </span>
  );
  return (
    <span className="relative block h-8 w-8 shrink-0">
      <Image src={url} alt={alt} fill className="object-contain drop-shadow-lg" unoptimized sizes="32px" />
    </span>
  );
}

/* ─── CTA Tigre FC — quando não há jogo ativo ──────────────────────────── */
function TigreFCCta() {
  return (
    <section className="relative w-full overflow-hidden bg-[#070707]">
      {/* Linha decorativa topo */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Glow de fundo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(245,196,0,0.07),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 md:py-14">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-center md:gap-12 md:text-left">

          {/* Ícone / emblema */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-gold/20 bg-gold/5">
              <span className="text-4xl select-none">🐯</span>
            </div>
          </div>

          {/* Texto */}
          <div className="flex-1">
            {/* Etiqueta de categoria */}
            <div className="mb-2 flex items-center justify-center gap-2 md:justify-start">
              <span className="h-px w-6 bg-gold/50" />
              <span className="font-body text-[10px] font-black uppercase tracking-[0.4em] text-gold/70">
                Fantasy Game · Torcida do Novorizontino
              </span>
              <span className="h-px w-6 bg-gold/50" />
            </div>

            <h2 className="font-display text-3xl font-black italic uppercase leading-tight text-ink md:text-4xl lg:text-5xl">
              Você escalaria{' '}
              <span className="text-gold">diferente.</span>
              <br className="hidden md:block" />
              {' '}Prove no campo.
            </h2>

            <p className="mt-3 font-body text-sm leading-relaxed text-muted md:text-base">
              Monte o time ideal, cravo o placar e suba no ranking da torcida.{' '}
              <span className="text-ink/80">Cada rodada é uma nova chance de mostrar que você entende mais do Tigre.</span>
            </p>

            {/* Microdados de social proof */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="font-body text-[11px] text-muted">Gratuito</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="font-body text-[11px] text-muted">Ranking semanal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                <span className="font-body text-[11px] text-muted">Resultado por WhatsApp</span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <Link href="/tigre-fc"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gold px-8 py-4
                font-display text-base font-black italic uppercase tracking-wider text-black
                shadow-[0_0_32px_rgba(245,196,0,0.3)] transition-all duration-200
                hover:shadow-[0_0_48px_rgba(245,196,0,0.5)] hover:brightness-110
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan active:scale-95">
              {/* Shimmer */}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Entrar na arena</span>
              <span className="relative text-lg">⚡</span>
            </Link>
            <p className="mt-2 font-body text-[10px] text-muted text-center">
              Login com Google em 5 seg
            </p>
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}

/* ─── Faixa de jogo (próximo / ao vivo) ────────────────────────────────── */
export default function ProximoJogo({ jogo }: { jogo: JogoData | null }) {
  const countdown = useCountdown(jogo?.data_hora ?? null);
  const kickoffPassed = jogo?.data_hora ? new Date(jogo.data_hora).getTime() < Date.now() : false;
  const isLive = kickoffPassed && !jogo?.finalizado;
  const temPlacar = jogo?.placar_mandante != null && jogo?.placar_visitante != null;

  if (!jogo) return <TigreFCCta />;

  return (
    <div className={`w-full border-b ${isLive ? 'border-live/30 bg-live/5' : 'border-gold/15 bg-panel'}`}>
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4">

        {isLive ? (
          <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-live">
            <span className="dot-live-red" />AO VIVO
          </span>
        ) : (
          <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-muted">
            {jogo.finalizado ? 'Encerrado' : 'Próximo jogo'}
          </span>
        )}

        <span className="h-3 w-px shrink-0 bg-white/10" />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Escudo url={jogo.mandante.escudo_url} alt={jogo.mandante.nome} />
          <span className="truncate text-[12px] font-black uppercase text-ink">{jogo.mandante.nome}</span>

          {(isLive || jogo.finalizado) && temPlacar ? (
            <span className="shrink-0 px-2 text-[13px] font-black tabular-nums text-gold">
              {jogo.placar_mandante} × {jogo.placar_visitante}
            </span>
          ) : (
            <span className="shrink-0 px-1 text-[11px] font-black text-muted">×</span>
          )}

          <span className="truncate text-[12px] font-black uppercase text-ink">{jogo.visitante.nome}</span>
          <Escudo url={jogo.visitante.escudo_url} alt={jogo.visitante.nome} />
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-3 sm:flex">
          {!isLive && !jogo.finalizado && countdown && (
            <span className="tabular-nums text-[11px] font-black text-gold">
              {countdown.d > 0 && `${countdown.d}d `}{pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </span>
          )}
          <Link href="/tigre-fc"
            className="rounded bg-gold/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-gold
              hover:bg-gold/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan">
            Escalar →
          </Link>
        </div>
      </div>
    </div>
  );
}
