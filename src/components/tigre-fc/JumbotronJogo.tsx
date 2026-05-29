'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════════
// IDENTIDADE VISUAL
// ════════════════════════════════════════════════════════════════════════════
export const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red: '#FF2244',
  black: '#050505',
  white: '#FFFFFF',
} as const;

const FONT_FAMILY = "'Barlow Condensed', 'Barlow', system-ui, -apple-system, sans-serif";
const STORAGE_BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';
const ESCUDO_NOVORIZONTINO = `${STORAGE_BASE}/Escudo%20Novorizontino.png`;
const ESCUDO_AVAI_OFICIAL = 'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png';

const LOGOS: Record<string, string> = {
  'novorizontino': ESCUDO_NOVORIZONTINO,
  'gremio-novorizontino': ESCUDO_NOVORIZONTINO,
  'avai': ESCUDO_AVAI_OFICIAL,
  'criciuma': 'https://logodownload.org/wp-content/uploads/2018/06/criciuma-logo-escudo-1.png',
  'vila-nova': 'https://logodownload.org/wp-content/uploads/2017/02/vila-nova-logo-escudo.png',
  'ponte-preta': 'https://logodownload.org/wp-content/uploads/2017/02/ponte-preta-logo-escudo.png',
  'athletico-pr': 'https://logodownload.org/wp-content/uploads/2017/02/athletico-pr-logo-escudo.png',
  'goias': 'https://logodownload.org/wp-content/uploads/2017/02/goias-logo-escudo.png',
  'coritiba': 'https://logodownload.org/wp-content/uploads/2017/02/coritiba-logo-escudo.png',
  'cuiaba': 'https://logodownload.org/wp-content/uploads/2017/02/cuiaba-logo-escudo.png',
  'chapecoense': 'https://logodownload.org/wp-content/uploads/2017/02/chapecoense-logo-escudo.png',
  'paysandu': 'https://logodownload.org/wp-content/uploads/2017/02/paysandu-logo-escudo.png',
  'remo': 'https://logodownload.org/wp-content/uploads/2017/02/remo-logo-escudo.png',
  'amazonas': 'https://logodownload.org/wp-content/uploads/2017/02/amazonas-fc-logo-escudo.png',
  'operario-pr': 'https://logodownload.org/wp-content/uploads/2017/02/operario-pr-logo-escudo.png',
  'volta-redonda': 'https://logodownload.org/wp-content/uploads/2017/02/volta-redonda-logo-escudo.png',
  'crb': 'https://logodownload.org/wp-content/uploads/2017/02/crb-logo-escudo.png',
  'america-mg': 'https://logodownload.org/wp-content/uploads/2017/02/america-mg-logo-escudo.png',
  'athletic-mg': 'https://logodownload.org/wp-content/uploads/2017/02/athletic-club-mg-logo-escudo.png',
  'botafogo-sp': 'https://logodownload.org/wp-content/uploads/2017/02/botafogo-sp-logo-escudo.png',
  'sport': 'https://logodownload.org/wp-content/uploads/2017/02/sport-logo-escudo.png',
  'londrina': 'https://logodownload.org/wp-content/uploads/2017/02/londrina-logo-escudo.png',
  'juventude': 'https://logodownload.org/wp-content/uploads/2017/02/juventude-logo-escudo.png',
  'ceara': 'https://logodownload.org/wp-content/uploads/2017/02/ceara-logo-escudo.png',
  'sao-bernardo': 'https://logodownload.org/wp-content/uploads/2017/02/sao-bernardo-logo-escudo.png',
};

const NOMES: Record<string, string> = {
  'novorizontino': 'NOVORIZONTINO',
  'gremio-novorizontino': 'NOVORIZONTINO',
  'avai': 'AVAÍ',
  'criciuma': 'CRICIÚMA',
  'vila-nova': 'VILA NOVA',
  'ponte-preta': 'PONTE PRETA',
  'athletico-pr': 'ATHLETICO',
  'goias': 'GOIÁS',
  'coritiba': 'CORITIBA',
  'cuiaba': 'CUIABÁ',
  'chapecoense': 'CHAPECOENSE',
  'paysandu': 'PAYSANDU',
  'remo': 'REMO',
  'amazonas': 'AMAZONAS',
  'operario-pr': 'OPERÁRIO',
  'volta-redonda': 'VOLTA REDONDA',
  'crb': 'CRB',
  'america-mg': 'AMÉRICA-MG',
  'athletic-mg': 'ATHLETIC',
  'botafogo-sp': 'BOTAFOGO-SP',
  'sport': 'SPORT',
  'londrina': 'LONDRINA',
  'juventude': 'JUVENTUDE',
  'ceara': 'CEARÁ',
  'sao-bernardo': 'SÃO BERNARDO',
};

const slugToNome = (slug?: string | null) => 
  slug ? NOMES[slug] ?? slug.replace(/-/g, ' ').toUpperCase() : '---';

const slugToLogo = (slug?: string | null) => 
  slug ? LOGOS[slug] ?? ESCUDO_NOVORIZONTINO : ESCUDO_NOVORIZONTINO;

const normalizarCompeticao = (raw?: string | null): string => {
  if (!raw) return 'PRÓXIMA RODADA';
  const s = raw.toString().toUpperCase();
  if (s.includes('SÉRIE B') || s.includes('SERIE B') || s.includes('BRASILEIR')) return 'BRASILEIRÃO SÉRIE B';
  if (s.includes('SUL-SUDESTE') || s.includes('SUL SUDESTE')) return 'COPA SUL-SUDESTE';
  return s;
};

// ════════════════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════════════════
export type Jogo = {
  id?: number | null;
  rodada?: number | string | null;
  competicao?: string | null;
  mandante_slug?: string | null;
  visitante_slug?: string | null;
  placar_mandante?: number | null;
  placar_visitante?: number | null;
  finalizado?: boolean | null;
  data_jogo?: string | null;
  data_hora?: string | null;
  local?: string | null;
  transmissao?: string | null;
};

export type Stats = {
  ranking?: Array<{ nome?: string; apelido?: string; pontos?: number }>;
  capitao?: { nome?: string; pts?: number };
  heroi?: { nome?: string; pts?: number };
  totalEscalacoes?: number;
  [key: string]: unknown;
};

export type JumbotronJogoProps = {
  jogo?: Jogo | null;
  formacao?: string | null;
  capitaoNome?: string | null;
  heroiNome?: string | null;
  palpiteMandante?: number | null;
  palpiteVisitante?: number | null;
  totalEscalacoes?: number;
  onEscalar?: () => void;
  loading?: boolean;
  mercadoFechado?: boolean;
  stats?: Stats;
};

// ════════════════════════════════════════════════════════════════════════════
// COUNTDOWN
// ════════════════════════════════════════════════════════════════════════════
function useCountdown(targetDate: string | null | undefined) {
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) {
      setTime(null);
      return;
    }
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) {
      setTime(null);
      return;
    }

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════════════════════════
export default function JumbotronJogo({
  jogo,
  formacao = null,
  capitaoNome = null,
  heroiNome = null,
  palpiteMandante = null,
  palpiteVisitante = null,
  totalEscalacoes,
  onEscalar,
  loading = false,
  mercadoFechado = false,
  stats,
}: JumbotronJogoProps) {
  const safeJogo: Jogo = jogo ?? {};
  const id = safeJogo.id ?? 0;
  const rodada = safeJogo.rodada ?? '?';
  const competicaoBruta = safeJogo.competicao ?? null;
  const mandanteSlug = safeJogo.mandante_slug ?? '';
  const visitanteSlug = safeJogo.visitante_slug ?? 'novorizontino';
  const placarMandante = safeJogo.placar_mandante ?? null;
  const placarVisitante = safeJogo.placar_visitante ?? null;
  const finalizado = safeJogo.finalizado ?? false;
  const dataJogo = safeJogo.data_jogo ?? safeJogo.data_hora ?? null;
  const local = safeJogo.local ?? null;
  const transmissao = safeJogo.transmissao ?? null;

  const competicaoDisplay = normalizarCompeticao(competicaoBruta);

  const mandanteLogo = mandanteSlug === 'avai' ? ESCUDO_AVAI_OFICIAL : slugToLogo(mandanteSlug);
  const visitanteLogo = visitanteSlug === 'avai' ? ESCUDO_AVAI_OFICIAL : slugToLogo(visitanteSlug);

  const mandanteNome = slugToNome(mandanteSlug);
  const visitanteNome = slugToNome(visitanteSlug);

  const effectiveCapitao = capitaoNome ?? stats?.capitao?.nome ?? null;
  const effectiveHeroi = heroiNome ?? stats?.heroi?.nome ?? null;
  const effectiveTotal = totalEscalacoes ?? stats?.totalEscalacoes ?? (stats?.ranking?.length ?? 0);

  const hasCapitao = !!(effectiveCapitao && effectiveCapitao !== '---');
  const hasHeroi = !!(effectiveHeroi && effectiveHeroi !== '---');
  const hasEscalacao = !!formacao && hasCapitao && hasHeroi;

  const palpiteText = (palpiteMandante !== null && palpiteVisitante !== null)
    ? `${palpiteMandante} × ${palpiteVisitante}` : null;

  const dataFormatada = dataJogo
    ? new Date(dataJogo).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  const countdown = useCountdown(dataJogo);

  const ctaDisabled = mercadoFechado;
  const ctaLabel = mercadoFechado
    ? '🔒 MERCADO FECHADO'
    : (hasEscalacao ? '✏ EDITAR ESCALAÇÃO' : '⚡ ESCALAR AGORA');

  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl p-8 border border-white/10 animate-pulse"
        style={{ background: C.black, fontFamily: FONT_FAMILY }}>
        <div className="h-4 w-32 bg-zinc-900 rounded mb-6" />
        <div className="h-24 w-full bg-zinc-900 rounded mb-4" />
        <div className="h-14 w-full bg-zinc-900 rounded" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full mx-auto rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.black} 0%, #0a0a0a 50%, #0f0f0f 100%)`,
        border: `2px solid ${C.gold}40`,
        boxShadow: `0 0 40px ${C.gold}20, 0 8px 30px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: C.red, boxShadow: `0 0 10px ${C.red}, 0 0 20px ${C.red}80` }} />
          <span className="text-[10px] font-black tracking-[3px]" style={{ color: C.red }}>AO VIVO</span>
        </div>
        <div className="text-[9px] font-black tracking-[3px] text-zinc-500">
          R{rodada} • {competicaoDisplay}
        </div>
      </div>

      {/* VS Section */}
      <div className="flex items-center justify-around px-4 sm:px-6 pb-6 relative z-10">
        <div className="flex flex-col items-center flex-1">
          <img src={mandanteLogo} alt={mandanteNome}
            className="w-20 h-20 object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_NOVORIZONTINO; }} />
          <div className="text-center mt-3">
            <div className="text-base font-black uppercase tracking-tight">{mandanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-0.5">CASA</div>
          </div>
        </div>

        <div className="flex flex-col items-center px-4">
          {finalizado && placarMandante !== null && placarVisitante !== null ? (
            <div className="text-4xl font-black tabular-nums" style={{ color: C.gold }}>
              {placarMandante} <span className="text-zinc-700 mx-2">-</span> {placarVisitante}
            </div>
          ) : (
            <div className="text-5xl font-black italic" style={{ color: C.gold }}>VS</div>
          )}
        </div>

        <div className="flex flex-col items-center flex-1">
          <img src={visitanteLogo} alt={visitanteNome}
            className="w-20 h-20 object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_NOVORIZONTINO; }} />
          <div className="text-center mt-3">
            <div className="text-base font-black uppercase tracking-tight">{visitanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-0.5">FORA</div>
          </div>
        </div>
      </div>

      {/* Countdown */}
      {countdown && !finalizado && (
        <div className="mx-4 mb-6 relative z-10">
          <div className="flex items-center justify-center gap-3 bg-black/70 rounded-2xl py-3 px-4">
            {[
              { label: 'DIAS', value: countdown.days },
              { label: 'HRS', value: countdown.hours },
              { label: 'MIN', value: countdown.minutes },
              { label: 'SEG', value: countdown.seconds },
            ].map((item, i) => (
              <div key={i} className="text-center min-w-[50px]">
                <div className="text-2xl font-black text-white tabular-nums">{item.value}</div>
                <div className="text-[10px] text-zinc-500 tracking-widest">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Button */}
      {onEscalar ? (
        <button
          onClick={ctaDisabled ? undefined : onEscalar}
          disabled={ctaDisabled}
          className="block w-full py-5 font-black tracking-[3px] text-base uppercase active:scale-[0.98] transition-transform"
          style={{
            background: ctaDisabled ? '#2a2a2a' : `linear-gradient(90deg, ${C.gold}, #ffdd00)`,
            color: ctaDisabled ? '#888' : '#000',
          }}
        >
          {ctaLabel}
        </button>
      ) : (
        <Link
          href={id ? `/tigre-fc/escalar/${id}` : '/tigre-fc'}
          className="block w-full py-5 font-black tracking-[3px] text-base uppercase text-center active:scale-[0.98] transition-transform"
          style={{
            background: `linear-gradient(90deg, ${C.gold}, #ffdd00)`,
            color: '#000',
          }}
        >
          {ctaLabel}
        </Link>
      )}

    </div>
  );
}
