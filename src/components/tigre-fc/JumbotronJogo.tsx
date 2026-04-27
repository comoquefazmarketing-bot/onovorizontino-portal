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
const ESCUDO_AVAI_OFICIAL   = `${STORAGE_BASE}/Avai_Futebol_Clube_logo.svg.png`;

const LOGOS: Record<string, string> = {
  'novorizontino':        ESCUDO_NOVORIZONTINO,
  'gremio-novorizontino': ESCUDO_NOVORIZONTINO,
  'avai':                 ESCUDO_AVAI_OFICIAL,
  'criciuma':             'https://logodownload.org/wp-content/uploads/2018/06/criciuma-logo-escudo-1.png',
};

// Função de mapeamento aprimorada para evitar duplicidade
const getLogo = (slug?: string, isMandante?: boolean) => {
  if (!slug) return isMandante ? ESCUDO_AVAI_OFICIAL : ESCUDO_NOVORIZONTINO;
  return LOGOS[slug.toLowerCase()] ?? (isMandante ? ESCUDO_AVAI_OFICIAL : ESCUDO_NOVORIZONTINO);
};

const getNome = (slug?: string, isMandante?: boolean) => {
  if (!slug) return isMandante ? 'AVAÍ' : 'NOVORIZONTINO';
  const nomes: Record<string, string> = { 'avai': 'AVAÍ', 'novorizontino': 'NOVORIZONTINO' };
  return nomes[slug.toLowerCase()] ?? slug.replace(/-/g, ' ').toUpperCase();
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
  data_hora?: string | null; // Sincronizado com seu JSON
  local?: string | null;
  transmissao?: string | null;
};

export type JumbotronJogoProps = {
  jogo?: Jogo | any;
  formacao?: string | null;
  capitaoNome?: string | null;
  heroiNome?: string | null;
  palpiteMandante?: number | null;
  palpiteVisitante?: number | null;
  totalEscalacoes?: number;
  onEscalar?: () => void;
  loading?: boolean;
  stats?: any;
};

// ════════════════════════════════════════════════════════════════════════════
// HOOK COUNTDOWN
// ════════════════════════════════════════════════════════════════════════════
function useCountdown(targetDate: string | null | undefined) {
  const [time, setTime] = useState<any>(null);

  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate.replace(' ', 'T')).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
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

export default function JumbotronJogo({
  jogo,
  formacao,
  capitaoNome,
  heroiNome,
  palpiteMandante,
  palpiteVisitante,
  totalEscalacoes,
  onEscalar,
  loading = false,
  stats,
}: JumbotronJogoProps) {

  // Lógica de Extração de Dados
  const j = jogo || {};
  const mandanteSlug = j.mandante_slug || 'avai';
  const visitanteSlug = j.visitante_slug || 'novorizontino';
  
  const mandanteNome = getNome(mandanteSlug, true);
  const visitanteNome = getNome(visitanteSlug, false);
  const mandanteLogo = getLogo(mandanteSlug, true);
  const visitanteLogo = getLogo(visitanteSlug, false);

  const countdown = useCountdown(j.data_hora);
  const dataFormatada = j.data_hora ? new Date(j.data_hora.replace(' ', 'T')).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '';

  if (loading) return <div className="w-full h-64 bg-zinc-900 animate-pulse rounded-3xl" />;

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.black} 0%, #0a0a0a 50%, #0f0f0f 100%)`,
        border: `2px solid ${C.gold}40`,
        boxShadow: `0 0 40px ${C.gold}20`,
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Pattern de fundo */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${C.gold} 0, ${C.gold} 1px, transparent 1px, transparent 14px)` }} />

      {/* Barra de Status Superior */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_red]" />
          <span className="text-[10px] font-black tracking-[3px] text-red-500">LIVE ENGINE</span>
          <span className="text-zinc-800">|</span>
          <span className="text-[10px] font-black tracking-[3px] text-cyan-400">RÁDIO VOX</span>
        </div>
        <div className="text-[9px] font-black tracking-[3px] text-zinc-500 uppercase">
          R{j.rodada || '7'} • {j.competicao || 'COPA SUL-SUDESTE'}
        </div>
      </div>

      {/* Confronto Principal */}
      <div className="flex items-center justify-around px-4 py-8 relative z-10">
        {/* Mandante */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full blur-2xl bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={mandanteLogo} alt={mandanteNome} className="relative w-20 h-20 object-contain drop-shadow-2xl" />
          </div>
          <div className="text-center mt-3">
            <div className="text-lg font-black uppercase italic tracking-tighter leading-none">{mandanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-1 font-bold">MANDANTE</div>
          </div>
        </div>

        {/* Placar / VS */}
        <div className="flex flex-col items-center px-4">
          {j.finalizado ? (
            <div className="text-4xl font-black italic text-[#F5C400]">
              {j.placar_mandante} <span className="text-zinc-800">-</span> {j.placar_visitante}
            </div>
          ) : (
            <div className="text-5xl font-black italic text-[#F5C400] drop-shadow-[0_0_15px_rgba(245,196,0,0.4)]">VS</div>
          )}
          <div className="text-[8px] font-black tracking-[4px] text-zinc-600 mt-2 uppercase">{j.transmissao?.split('·')[0] || 'AO VIVO'}</div>
        </div>

        {/* Visitante */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative group">
            <div className="absolute inset-0 rounded-full blur-2xl bg-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src={visitanteLogo} alt={visitanteNome} className="relative w-20 h-20 object-contain drop-shadow-2xl" />
          </div>
          <div className="text-center mt-3">
            <div className="text-lg font-black uppercase italic tracking-tighter leading-none">{visitanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-1 font-bold">VISITANTE</div>
          </div>
        </div>
      </div>

      {/* Info do Jogo & Countdown */}
      <div className="px-6 pb-6 space-y-4">
        {countdown && (
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5 flex items-center justify-center gap-4">
            <span className="text-[9px] font-black tracking-[2px] text-cyan-400">KICKOFF EM:</span>
            <div className="flex gap-3 text-lg font-black italic text-zinc-200">
              <span>{String(countdown.days).padStart(2,'0')}d</span>
              <span className="text-zinc-700">:</span>
              <span>{String(countdown.hours).padStart(2,'0')}h</span>
              <span className="text-zinc-700">:</span>
              <span>{String(countdown.minutes).padStart(2,'0')}m</span>
            </div>
          </div>
        )}
        
        <div className="text-center">
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{j.local}</p>
        </div>
      </div>

      {/* Botão de Ação (FIFA Style) */}
      <Link 
        href={`/tigre-fc/escalar/${j.id}`}
        className="block w-full py-5 bg-gradient-to-r from-[#F5C400] to-[#ffaa00] text-black text-center font-black italic tracking-[4px] text-sm hover:brightness-110 transition-all uppercase"
      >
        {stats?.capitao ? '✏️ EDITAR MINHA ESCALAÇÃO' : '⚡ ESCALAR MEU TIME AGORA'}
      </Link>

      <div className="bg-black/80 py-2 text-center border-t border-white/5">
        <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">
          {totalEscalacoes || 0} Torcedores já palpitaram neste jogo
        </span>
      </div>
    </div>
  );
}
