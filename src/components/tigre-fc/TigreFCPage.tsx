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

const LOGOS: Record<string, string> = { /* ... mantenha todos os logos que você já tem ... */ };
const NOMES: Record<string, string> = { /* ... mantenha todos os nomes que você já tem ... */ };

const slugToNome = (slug?: string | null) => slug ? NOMES[slug] ?? slug.replace(/-/g, ' ').toUpperCase() : '---';
const slugToLogo = (slug?: string | null) => slug ? LOGOS[slug] ?? ESCUDO_NOVORIZONTINO : ESCUDO_NOVORIZONTINO;

const normalizarCompeticao = (raw?: string | null): string => {
  if (!raw) return 'BRASILEIRÃO SÉRIE B';
  const s = raw.toString().toUpperCase();
  if (s.includes('SÉRIE B')) return 'BRASILEIRÃO SÉRIE B';
  if (s.includes('SUL-SUDESTE')) return 'COPA SUL-SUDESTE';
  return s;
};

export type Jogo = { /* seus tipos aqui */ };

export default function JumbotronJogo({
  jogo,
  formacao = null,
  capitaoNome = null,
  heroiNome = null,
  totalEscalacoes,
  onEscalar,
  loading = false,
  mercadoFechado = false,
  stats,
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

  const countdown = useCountdown(dataJogo); // mantenha a função useCountdown

  const ctaLabel = mercadoFechado ? '🔒 MERCADO FECHADO' : '⚡ ESCALAR AGORA';

  if (loading) return <div className="h-96 bg-black/50 animate-pulse rounded-3xl" />;

  return (
    <div className="relative w-full max-w-3xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
         style={{
           background: 'linear-gradient(145deg, #0a0a0a 0%, #050505 100%)',
           boxShadow: '0 0 60px rgba(245, 196, 0, 0.15), inset 0 0 40px rgba(0,0,0,0.8)',
         }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/60">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-black tracking-[3px] text-red-500">AO VIVO • SÉRIE B</span>
        </div>
        <div className="text-xs font-black tracking-widest text-white/70">RODADA {rodada}</div>
      </div>

      {/* Main Broadcast Area */}
      <div className="p-8 pb-6 relative">
        <div className="text-center mb-6">
          <div className="inline-block px-6 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-black tracking-[2px] text-[#F5C400]">
            {competicaoDisplay}
          </div>
        </div>

        {/* VS Section */}
        <div className="flex items-center justify-center gap-8 md:gap-12">
          <div className="text-center flex-1">
            <img src={mandanteLogo} alt={mandanteNome} className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl" />
            <div className="font-black text-2xl tracking-tighter uppercase">{mandanteNome}</div>
            <div className="text-[10px] text-white/50 mt-1">MANDANTE</div>
          </div>

          <div className="text-center">
            <div className="text-7xl font-black italic text-[#F5C400] tracking-[-4px] mb-2">VS</div>
            <div className="text-xs text-white/40 font-mono">31.05.26 • 14h00</div>
          </div>

          <div className="text-center flex-1">
            <img src={visitanteLogo} alt={visitanteNome} className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl" />
            <div className="font-black text-2xl tracking-tighter uppercase">{visitanteNome}</div>
            <div className="text-[10px] text-white/50 mt-1">VISITANTE</div>
          </div>
        </div>

        {/* Local */}
        <div className="text-center mt-6 text-sm text-white/60">
          📍 {local}
        </div>

        {/* Countdown Avançado */}
        {countdown && (
          <div className="mt-8 flex justify-center">
            <div className="bg-black/70 border border-white/10 rounded-2xl px-8 py-5 flex gap-8">
              {[
                { value: countdown.days, label: 'DIAS' },
                { value: countdown.hours, label: 'HORAS' },
                { value: countdown.minutes, label: 'MIN' },
                { value: countdown.seconds, label: 'SEG' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl font-black text-white tabular-nums tracking-tighter">{item.value}</div>
                  <div className="text-[10px] font-bold tracking-widest text-white/50 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA Button */}
      <div className="px-8 pb-8">
        <Link
          href="/tigre-fc/escalar/16"
          className="block w-full py-6 text-center font-black text-xl tracking-[2px] rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(90deg, #F5C400, #FFDD00)',
            color: '#000',
            boxShadow: '0 0 40px rgba(245, 196, 0, 0.5)',
          }}
        >
          ⚡ ESCALAR AGORA
        </Link>
      </div>
    </div>
  );
}
