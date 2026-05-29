'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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

const slugToNome = (slug?: string | null) => slug ? NOMES[slug] ?? slug.replace(/-/g, ' ').toUpperCase() : '---';
const slugToLogo = (slug?: string | null) => slug ? LOGOS[slug] ?? ESCUDO_NOVORIZONTINO : ESCUDO_NOVORIZONTINO;

const normalizarCompeticao = (raw?: string | null): string => {
  if (!raw) return 'BRASILEIRÃO SÉRIE B';
  const s = raw.toString().toUpperCase();
  if (s.includes('SÉRIE B')) return 'BRASILEIRÃO SÉRIE B';
  if (s.includes('SUL-SUDESTE')) return 'COPA SUL-SUDESTE';
  return s;
};

function useCountdown(targetDate: string | null | undefined) {
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) { setTime(null); return; }
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) { setTime(null); return; }

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

export default function JumbotronJogo({
  jogo,
  onEscalar,
  loading = false,
  mercadoFechado = false,
}: any) {
  const safeJogo = jogo ?? {};
  const rodada = safeJogo.rodada ?? '11';
  const competicaoDisplay = normalizarCompeticao(safeJogo.competicao);
  const mandanteSlug = safeJogo.mandante_slug ?? 'sao-bernardo';
  const visitanteSlug = safeJogo.visitante_slug ?? 'novorizontino';
  const dataJogo = safeJogo.data_hora ?? '2026-05-31 14:00:00+00';
  const local = safeJogo.local ?? 'Estádio 1º de Maio — São Bernardo do Campo, SP';

  const mandanteNome = slugToNome(mandanteSlug);
  const visitanteNome = slugToNome(visitanteSlug);
  const mandanteLogo = slugToLogo(mandanteSlug);
  const visitanteLogo = slugToLogo(visitanteSlug);

  const countdown = useCountdown(dataJogo);

  const ctaLabel = mercadoFechado ? '🔒 MERCADO FECHADO' : '⚡ ESCALAR AGORA';

  if (loading) return <div className="h-96 bg-black/50 animate-pulse rounded-3xl" />;

  return (
    <div className="relative w-full mx-auto rounded-3xl overflow-hidden border border-white/10" style={{
      background: `linear-gradient(135deg, ${C.black} 0%, #0a0a0a 50%, #0f0f0f 100%)`,
      boxShadow: `0 0 50px ${C.gold}20`,
    }}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/60">
        <div className="flex items-center gap-3">
          <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs font-black tracking-[3px] text-red-500">AO VIVO</span>
        </div>
        <div className="text-xs font-black tracking-widest text-white/70">RODADA {rodada}</div>
      </div>

      <div className="p-8 pb-6">
        <div className="flex items-center justify-around">
          <div className="text-center flex-1">
            <img src={mandanteLogo} alt={mandanteNome} className="w-24 h-24 mx-auto mb-3 object-contain" />
            <div className="font-black text-2xl uppercase tracking-tight">{mandanteNome}</div>
            <div className="text-xs text-white/50">MANDANTE</div>
          </div>

          <div className="text-6xl font-black italic text-[#F5C400]">VS</div>

          <div className="text-center flex-1">
            <img src={visitanteLogo} alt={visitanteNome} className="w-24 h-24 mx-auto mb-3 object-contain" />
            <div className="font-black text-2xl uppercase tracking-tight">{visitanteNome}</div>
            <div className="text-xs text-white/50">VISITANTE</div>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-white/70">📍 {local}</div>
      </div>

      {countdown && (
        <div className="mx-8 mb-8">
          <div className="bg-black/70 border border-white/10 rounded-2xl py-6 flex justify-center gap-10">
            {[
              { value: countdown.days, label: 'DIAS' },
              { value: countdown.hours, label: 'HRS' },
              { value: countdown.minutes, label: 'MIN' },
              { value: countdown.seconds, label: 'SEG' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-black text-white">{item.value}</div>
                <div className="text-xs tracking-widest text-white/50">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-8 pb-8">
        {onEscalar ? (
          <button onClick={onEscalar} className="w-full py-6 font-black text-xl tracking-widest rounded-2xl" style={{ background: `linear-gradient(90deg, ${C.gold}, #ffea00)`, color: '#000' }}>
            {ctaLabel}
          </button>
        ) : (
          <Link href="/tigre-fc/escalar/16" className="block w-full py-6 font-black text-xl tracking-widest text-center rounded-2xl" style={{ background: `linear-gradient(90deg, ${C.gold}, #ffea00)`, color: '#000' }}>
            {ctaLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
