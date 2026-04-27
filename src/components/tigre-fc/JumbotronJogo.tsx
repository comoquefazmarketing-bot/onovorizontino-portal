// src/components/tigre-fc/JumbotronJogo.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════════
// IDENTIDADE VISUAL — BROADCAST STATION
// ════════════════════════════════════════════════════════════════════════════
export const C = {
  gold:  '#F5C400',
  cyan:  '#00F3FF',
  red:   '#FF2244',
  black: '#050505',
  white: '#FFFFFF',
} as const;

const FONT_FAMILY = "'Barlow Condensed', 'Barlow', system-ui, -apple-system, sans-serif";

// ════════════════════════════════════════════════════════════════════════════
// CASOS ESPECIAIS — INJEÇÃO DE SEGURANÇA
// ════════════════════════════════════════════════════════════════════════════
const STORAGE_BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';
const ESCUDO_NOVORIZONTINO = `${STORAGE_BASE}/Escudo%20Novorizontino.png`;
const ESCUDO_AVAI_OFICIAL  = 'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png';

const LOGOS: Record<string, string> = {
  'novorizontino':        ESCUDO_NOVORIZONTINO,
  'gremio-novorizontino': ESCUDO_NOVORIZONTINO,
  'avai':                 ESCUDO_AVAI_OFICIAL,
  'criciuma':             'https://logodownload.org/wp-content/uploads/2018/06/criciuma-logo-escudo-1.png',
  'vila-nova':            'https://logodownload.org/wp-content/uploads/2017/02/vila-nova-logo-escudo.png',
  'ponte-preta':          'https://logodownload.org/wp-content/uploads/2017/02/ponte-preta-logo-escudo.png',
  'athletico-pr':         'https://logodownload.org/wp-content/uploads/2017/02/athletico-pr-logo-escudo.png',
  'goias':                'https://logodownload.org/wp-content/uploads/2017/02/goias-logo-escudo.png',
  'coritiba':             'https://logodownload.org/wp-content/uploads/2017/02/coritiba-logo-escudo.png',
  'cuiaba':               'https://logodownload.org/wp-content/uploads/2017/02/cuiaba-logo-escudo.png',
  'chapecoense':          'https://logodownload.org/wp-content/uploads/2017/02/chapecoense-logo-escudo.png',
  'paysandu':             'https://logodownload.org/wp-content/uploads/2017/02/paysandu-logo-escudo.png',
  'remo':                 'https://logodownload.org/wp-content/uploads/2017/02/remo-logo-escudo.png',
  'amazonas':             'https://logodownload.org/wp-content/uploads/2017/02/amazonas-fc-logo-escudo.png',
  'operario-pr':          'https://logodownload.org/wp-content/uploads/2017/02/operario-pr-logo-escudo.png',
  'volta-redonda':        'https://logodownload.org/wp-content/uploads/2017/02/volta-redonda-logo-escudo.png',
  'crb':                  'https://logodownload.org/wp-content/uploads/2017/02/crb-logo-escudo.png',
  'america-mg':           'https://logodownload.org/wp-content/uploads/2017/02/america-mg-logo-escudo.png',
  'athletic-mg':          'https://logodownload.org/wp-content/uploads/2017/02/athletic-club-mg-logo-escudo.png',
  'botafogo-sp':          'https://logodownload.org/wp-content/uploads/2017/02/botafogo-sp-logo-escudo.png',
};

const NOMES: Record<string, string> = {
  'novorizontino':        'NOVORIZONTINO',
  'gremio-novorizontino': 'NOVORIZONTINO',
  'avai':                 'AVAÍ',
  'criciuma':             'CRICIÚMA',
  'vila-nova':            'VILA NOVA',
  'ponte-preta':          'PONTE PRETA',
  'athletico-pr':         'ATHLETICO',
  'goias':                'GOIÁS',
  'coritiba':             'CORITIBA',
  'cuiaba':               'CUIABÁ',
  'chapecoense':          'CHAPECOENSE',
  'paysandu':             'PAYSANDU',
  'remo':                 'REMO',
  'amazonas':             'AMAZONAS',
  'operario-pr':          'OPERÁRIO',
  'volta-redonda':        'VOLTA REDONDA',
  'crb':                  'CRB',
  'america-mg':           'AMÉRICA-MG',
  'athletic-mg':          'ATHLETIC',
  'botafogo-sp':          'BOTAFOGO-SP',
};

const slugToNome = (slug?: string) => (slug ? NOMES[slug] ?? slug.replace(/-/g, ' ').toUpperCase() : '---');
const slugToLogo = (slug?: string) => (slug ? LOGOS[slug] ?? ESCUDO_AVAI_OFICIAL : ESCUDO_NOVORIZONTINO);

// ════════════════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════════════════
export type Jogo = {
  id?: number | null;
  rodada?: number | null;
  competicao?: string | null;
  mandante_slug?: string | null;
  visitante_slug?: string | null;
  placar_mandante?: number | null;
  placar_visitante?: number | null;
  finalizado?: boolean | null;
  data_jogo?: string | null;
};

export type Stats = {
  ranking?: Array<{ nome?: string; apelido?: string; pontos?: number }>;
  capitao?: { nome?: string; pts?: number };
  heroi?:   { nome?: string; pts?: number };
  totalEscalacoes?: number;
  [key: string]: unknown;
};

export type JumbotronJogoProps = {
  jogo?: Jogo | null;

  // API NOVA
  formacao?: string | null;
  capitaoNome?: string | null;
  heroiNome?: string | null;
  palpiteMandante?: number | null;
  palpiteVisitante?: number | null;
  totalEscalacoes?: number;
  onEscalar?: () => void;
  loading?: boolean;

  // API LEGADA — retrocompat com TigreFCPage.tsx
  mercadoFechado?: boolean;
  stats?: Stats;
};

// ════════════════════════════════════════════════════════════════════════════
// HOOK COUNTDOWN
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
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
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
// COMPONENTE
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

  // ─── BLINDAGEM: jogo nunca pode ser null no render ───────────────────
  const safeJogo: Jogo = jogo ?? {};

  const id              = safeJogo.id              ?? 0;
  const rodada          = safeJogo.rodada          ?? '?';
  const competicaoBruta = safeJogo.competicao      ?? 'PRÓXIMA RODADA';
  const mandanteSlug    = safeJogo.mandante_slug   ?? '';
  const visitanteSlug   = safeJogo.visitante_slug  ?? 'novorizontino';
  const placarMandante  = safeJogo.placar_mandante ?? null;
  const placarVisitante = safeJogo.placar_visitante ?? null;
  const finalizado      = safeJogo.finalizado      ?? false;
  const dataJogo        = safeJogo.data_jogo       ?? null;

  // ─── INJEÇÃO DE SEGURANÇA: AVAÍ ──────────────────────────────────────
  const isAvaiMandante = mandanteSlug === 'avai';
  const competicaoDisplay = isAvaiMandante ? 'COPA SUL-SUDESTE' : competicaoBruta.toString().toUpperCase();
  const mandanteLogo  = isAvaiMandante ? ESCUDO_AVAI_OFICIAL : slugToLogo(mandanteSlug);
  const visitanteLogo = slugToLogo(visitanteSlug);
  const mandanteNome  = isAvaiMandante ? 'AVAÍ' : slugToNome(mandanteSlug);
  const visitanteNome = slugToNome(visitanteSlug);

  // ─── MERGE API NOVA + LEGADA ─────────────────────────────────────────
  const effectiveCapitao = capitaoNome ?? stats?.capitao?.nome ?? null;
  const effectiveHeroi   = heroiNome   ?? stats?.heroi?.nome   ?? null;
  const effectiveTotal   = totalEscalacoes ?? stats?.totalEscalacoes ?? (stats?.ranking?.length ?? 0);

  const hasCapitao = !!(effectiveCapitao && effectiveCapitao !== '---');
  const hasHeroi   = !!(effectiveHeroi   && effectiveHeroi   !== '---');
  const hasEscalacao = !!formacao && hasCapitao && hasHeroi;

  const palpiteText = (palpiteMandante !== null && palpiteVisitante !== null)
    ? `${palpiteMandante} × ${palpiteVisitante}`
    : null;

  const dataFormatada = dataJogo
    ? new Date(dataJogo).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  const countdown = useCountdown(dataJogo);

  const ctaDisabled = mercadoFechado;
  const ctaLabel = mercadoFechado
    ? '🔒 MERCADO FECHADO'
    : (hasEscalacao ? '✏ EDITAR ESCALAÇÃO' : '⚡ ESCALAR AGORA');

  // ─── LOADING ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="w-full max-w-2xl mx-auto rounded-3xl p-8 border border-white/10 animate-pulse"
        style={{ background: C.black, fontFamily: FONT_FAMILY }}
      >
        <div className="h-4 w-32 bg-zinc-900 rounded mb-6" />
        <div className="h-24 w-full bg-zinc-900 rounded mb-4" />
        <div className="h-14 w-full bg-zinc-900 rounded" />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════
  // RENDER PRINCIPAL — sempre renderiza, mesmo sem dados reais
  // ════════════════════════════════════════════════════════════════════
  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.black} 0%, #0a0a0a 50%, #0f0f0f 100%)`,
        border: `2px solid ${C.gold}40`,
        boxShadow: `0 0 40px ${C.gold}20, 0 8px 30px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Pattern listrado dourado */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${C.gold} 0, ${C.gold} 1px, transparent 1px, transparent 14px)` }} />

      {/* Linha superior animada */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${C.gold}, ${C.cyan}, ${C.gold}, transparent)` }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* HEADER: AO VIVO + RÁDIO VOX */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: C.red, boxShadow: `0 0 10px ${C.red}, 0 0 20px ${C.red}80` }}
          />
          <span className="text-[10px] font-black tracking-[3px]" style={{ color: C.red }}>AO VIVO</span>
          <span className="text-zinc-700">•</span>
          <span className="text-[10px] font-black tracking-[3px]" style={{ color: C.cyan, textShadow: `0 0 8px ${C.cyan}50` }}>
            RÁDIO VOX
          </span>
        </div>
        <div className="text-[9px] font-black tracking-[3px] text-zinc-500">
          R{rodada} • {competicaoDisplay}
        </div>
      </div>

      {/* TÍTULO */}
      <div className="text-center pt-2 pb-3 relative z-10">
        <div className="text-[10px] font-black tracking-[5px] mb-1" style={{ color: C.gold }}>
          ⚡ JOGO DA RODADA
        </div>
        {dataFormatada && (
          <div className="text-[10px] text-zinc-400 tracking-widest font-bold">{dataFormatada}</div>
        )}
      </div>

      {/* CONFRONTO */}
      <div className="flex items-center justify-around px-4 sm:px-6 pb-4 relative z-10">
        {/* MANDANTE */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl" style={{ background: `${C.gold}40` }} />
            <img src={mandanteLogo} alt={mandanteNome}
              className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_NOVORIZONTINO; }} />
          </div>
          <div className="text-center mt-2">
            <div className="text-sm sm:text-base font-black uppercase tracking-tight leading-none">{mandanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-0.5">CASA</div>
          </div>
        </div>

        {/* CENTRO */}
        <div className="flex flex-col items-center px-2 sm:px-4">
          {finalizado && placarMandante !== null && placarVisitante !== null ? (
            <>
              <div className="text-3xl sm:text-4xl font-black tabular-nums" style={{ color: C.gold }}>
                {placarMandante}<span className="text-zinc-700 mx-2">-</span>{placarVisitante}
              </div>
              <div className="text-[9px] font-black tracking-[3px] text-zinc-400 mt-1">FINAL</div>
            </>
          ) : (
            <>
              <div className="text-4xl sm:text-5xl font-black italic"
                style={{ color: C.gold, textShadow: `0 0 20px ${C.gold}60` }}>
                VS
              </div>
              <div className="text-[8px] font-black tracking-[3px] text-zinc-500 mt-1">PRÓXIMO</div>
            </>
          )}
        </div>

        {/* VISITANTE */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl" style={{ background: `${C.cyan}30` }} />
            <img src={visitanteLogo} alt={visitanteNome}
              className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_NOVORIZONTINO; }} />
          </div>
          <div className="text-center mt-2">
            <div className="text-sm sm:text-base font-black uppercase tracking-tight leading-none">{visitanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-0.5">FORA</div>
          </div>
        </div>
      </div>

      {/* COUNTDOWN — só aparece se houver data e não estiver finalizado */}
      {countdown && !finalizado && (
        <div className="mx-4 mb-4 relative z-10">
          <div className="flex items-center justify-center gap-2 sm:gap-3 bg-black/60 rounded-xl py-2 border"
            style={{ borderColor: `${C.cyan}30` }}>
            <span className="text-[9px] tracking-[3px] font-black mr-2" style={{ color: C.cyan }}>FALTAM</span>
            {[
              { v: countdown.days,    l: 'DIAS' },
              { v: countdown.hours,   l: 'HRS'  },
              { v: countdown.minutes, l: 'MIN'  },
              { v: countdown.seconds, l: 'SEG'  },
            ].map((u, i) => (
              <React.Fragment key={u.l}>
                <div className="flex flex-col items-center min-w-[28px]">
                  <span className="text-base sm:text-lg font-black tabular-nums leading-none" style={{ color: C.gold }}>
                    {u.v.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[7px] tracking-widest text-zinc-500">{u.l}</span>
                </div>
                {i < 3 && <span className="text-zinc-700">:</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* PAINEL ESCALAÇÃO */}
      <div
        className="mx-4 mb-4 rounded-2xl p-3 sm:p-4 relative z-10"
        style={{
          background: 'rgba(0,0,0,0.5)',
          border: hasEscalacao ? `1.5px solid ${C.gold}66` : `1.5px solid ${C.red}80`,
          boxShadow: hasEscalacao ? `0 0 20px ${C.gold}20, inset 0 0 15px rgba(0,0,0,0.4)` : `0 0 20px ${C.red}20`,
        }}
      >
        {hasEscalacao ? (
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">✓</span>
                <div className="text-[10px] font-black tracking-[3px]" style={{ color: C.gold }}>SUA ESCALAÇÃO</div>
              </div>
              <div className="text-xs font-black px-2 py-0.5 rounded tracking-wider"
                style={{ background: C.gold, color: C.black }}>
                {formacao}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-zinc-950/60 rounded-lg px-3 py-2 border"
                style={{ borderColor: `${C.gold}50`, boxShadow: `inset 0 0 10px ${C.gold}10` }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">👑</span>
                  <span className="text-[8px] font-black tracking-[2px]" style={{ color: C.gold }}>CAPITÃO 2×</span>
                </div>
                <div className="text-sm font-black truncate text-white">{effectiveCapitao}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-lg px-3 py-2 border"
                style={{ borderColor: `${C.cyan}50`, boxShadow: `inset 0 0 10px ${C.cyan}10` }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">🔥</span>
                  <span className="text-[8px] font-black tracking-[2px]" style={{ color: C.cyan }}>HERÓI +50%</span>
                </div>
                <div className="text-sm font-black truncate text-white">{effectiveHeroi}</div>
              </div>
            </div>
            {palpiteText && (
              <div className="text-center bg-black/40 rounded-lg py-1.5 border border-white/5">
                <span className="text-[9px] tracking-[3px] text-zinc-500 font-black">SEU PALPITE: </span>
                <span className="text-base font-black tabular-nums ml-1" style={{ color: C.gold }}>{palpiteText}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-2">
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              className="text-3xl mb-2 inline-block">
              🐯
            </motion.div>
            <div className="text-base font-black mb-1" style={{ color: C.red, textShadow: `0 0 10px ${C.red}50` }}>
              VOCÊ AINDA NÃO ESCALOU!
            </div>
            <div className="text-[10px] text-zinc-400 tracking-wider">
              Monte seu time antes do jogo e dispute o ranking 🏆
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      {onEscalar ? (
        <button
          onClick={ctaDisabled ? undefined : onEscalar}
          disabled={ctaDisabled}
          className="block w-full py-4 font-black tracking-[3px] text-sm uppercase active:scale-[0.99] transition-transform relative z-10 disabled:cursor-not-allowed"
          style={{
            background: ctaDisabled
              ? '#2a2a2a'
              : hasEscalacao
                ? `linear-gradient(90deg, ${C.cyan}, ${C.gold})`
                : `linear-gradient(90deg, ${C.gold}, #ffaa00, ${C.gold})`,
            color: ctaDisabled ? '#666' : C.black,
            boxShadow: ctaDisabled ? 'none' : `0 0 25px ${hasEscalacao ? C.cyan : C.gold}50`,
            fontFamily: FONT_FAMILY,
          }}
        >
          {ctaLabel}
        </button>
      ) : ctaDisabled ? (
        <div className="block w-full py-4 font-black tracking-[3px] text-sm uppercase text-center relative z-10"
          style={{ background: '#2a2a2a', color: '#666', fontFamily: FONT_FAMILY }}>
          {ctaLabel}
        </div>
      ) : (
        <Link
          href={id ? `/tigre-fc/escalar/${id}` : '/tigre-fc'}
          className="block w-full py-4 font-black tracking-[3px] text-sm uppercase text-center active:scale-[0.99] transition-transform relative z-10"
          style={{
            background: hasEscalacao
              ? `linear-gradient(90deg, ${C.cyan}, ${C.gold})`
              : `linear-gradient(90deg, ${C.gold}, #ffaa00, ${C.gold})`,
            color: C.black,
            boxShadow: `0 0 25px ${hasEscalacao ? C.cyan : C.gold}50`,
            fontFamily: FONT_FAMILY,
          }}
        >
          {ctaLabel}
        </Link>
      )}

      {/* FOOTER */}
      {effectiveTotal > 0 && (
        <div className="px-4 py-2 text-center relative z-10" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <span className="text-[10px] tracking-[2px] text-zinc-400 font-bold">
            <span className="font-black" style={{ color: C.gold }}>{effectiveTotal.toLocaleString('pt-BR')}</span>
            {' '}torcedores já escalaram
          </span>
        </div>
      )}
    </div>
  );
}
