// src/components/tigre-fc/JumbotronJogo.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// ────────────────────────────────────────────────────────────────────────────
// TOKENS DE IDENTIDADE TIGRE FC
// ────────────────────────────────────────────────────────────────────────────
export const C = {
  gold:  '#F5C400',
  cyan:  '#00F3FF',
  red:   '#FF2244',
  black: '#050505',
  white: '#FFFFFF',
} as const;

// ────────────────────────────────────────────────────────────────────────────
// MAPA DE LOGOS / NOMES POR SLUG (extensível)
// ────────────────────────────────────────────────────────────────────────────
const STORAGE_BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';

const LOGOS: Record<string, string> = {
  'novorizontino':       `${STORAGE_BASE}/Escudo%20Novorizontino.png`,
  'gremio-novorizontino':`${STORAGE_BASE}/Escudo%20Novorizontino.png`,
  'avai':                'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png',
  'criciuma':            'https://logodownload.org/wp-content/uploads/2018/06/criciuma-logo-escudo-1.png',
  'vila-nova':           'https://logodownload.org/wp-content/uploads/2017/02/vila-nova-logo-escudo.png',
  'ponte-preta':         'https://logodownload.org/wp-content/uploads/2017/02/ponte-preta-logo-escudo.png',
  'athletico-pr':        'https://logodownload.org/wp-content/uploads/2017/02/athletico-pr-logo-escudo.png',
  'goias':               'https://logodownload.org/wp-content/uploads/2017/02/goias-logo-escudo.png',
  'coritiba':            'https://logodownload.org/wp-content/uploads/2017/02/coritiba-logo-escudo.png',
  'cuiaba':              'https://logodownload.org/wp-content/uploads/2017/02/cuiaba-logo-escudo.png',
  'chapecoense':         'https://logodownload.org/wp-content/uploads/2017/02/chapecoense-logo-escudo.png',
  'paysandu':            'https://logodownload.org/wp-content/uploads/2017/02/paysandu-logo-escudo.png',
  'remo':                'https://logodownload.org/wp-content/uploads/2017/02/remo-logo-escudo.png',
  'amazonas':            'https://logodownload.org/wp-content/uploads/2017/02/amazonas-fc-logo-escudo.png',
  'operario-pr':         'https://logodownload.org/wp-content/uploads/2017/02/operario-pr-logo-escudo.png',
  'volta-redonda':       'https://logodownload.org/wp-content/uploads/2017/02/volta-redonda-logo-escudo.png',
  'crb':                 'https://logodownload.org/wp-content/uploads/2017/02/crb-logo-escudo.png',
  'america-mg':          'https://logodownload.org/wp-content/uploads/2017/02/america-mg-logo-escudo.png',
  'athletic-mg':         'https://logodownload.org/wp-content/uploads/2017/02/athletic-club-mg-logo-escudo.png',
  'botafogo-sp':         'https://logodownload.org/wp-content/uploads/2017/02/botafogo-sp-logo-escudo.png',
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

const slugToNome  = (slug?: string) => (slug ? NOMES[slug] ?? slug.replace(/-/g, ' ').toUpperCase() : '---');
const slugToLogo  = (slug?: string) => (slug ? LOGOS[slug] ?? `${STORAGE_BASE}/Escudo%20Novorizontino.png` : `${STORAGE_BASE}/Escudo%20Novorizontino.png`);

// ────────────────────────────────────────────────────────────────────────────
// TIPOS
// ────────────────────────────────────────────────────────────────────────────
export interface Jogo {
  id: number;
  rodada: number;
  competicao: string;
  mandante_slug: string;
  visitante_slug: string;
  placar_mandante: number | null;
  placar_visitante: number | null;
  finalizado: boolean;
  data_jogo?: string | null;
}

export interface JumbotronJogoProps {
  jogo: Jogo | null;
  formacao?: string | null;
  capitaoNome?: string | null;
  heroiNome?: string | null;
  palpiteMandante?: number | null;
  palpiteVisitante?: number | null;
  totalEscalacoes?: number;
  onEscalar?: () => void;
  loading?: boolean;
}

// ────────────────────────────────────────────────────────────────────────────
// COMPONENTE
// ────────────────────────────────────────────────────────────────────────────
export default function JumbotronJogo({
  jogo,
  formacao = null,
  capitaoNome = null,
  heroiNome = null,
  palpiteMandante = null,
  palpiteVisitante = null,
  totalEscalacoes = 0,
  onEscalar,
  loading = false,
}: JumbotronJogoProps) {

  // ─── ESTADO DE LOADING ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl p-8 border border-white/10 animate-pulse"
        style={{ background: C.black }}>
        <div className="h-4 w-32 bg-zinc-900 rounded mb-6" />
        <div className="h-24 w-full bg-zinc-900 rounded mb-4" />
        <div className="h-14 w-full bg-zinc-900 rounded" />
      </div>
    );
  }

  // ─── SEM JOGO ATIVO ──────────────────────────────────────────────────
  if (!jogo) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl p-6 border text-center"
        style={{ background: C.black, borderColor: `${C.gold}30` }}>
        <div className="text-3xl mb-2">⏳</div>
        <div className="text-sm font-black tracking-widest" style={{ color: C.gold }}>PRÓXIMO JOGO EM BREVE</div>
        <div className="text-zinc-500 text-xs mt-1">Aguarde a definição da próxima rodada.</div>
      </div>
    );
  }

  // ─── DADOS DERIVADOS ─────────────────────────────────────────────────
  const mandanteLogo  = slugToLogo(jogo.mandante_slug);
  const visitanteLogo = slugToLogo(jogo.visitante_slug);
  const mandanteNome  = slugToNome(jogo.mandante_slug);
  const visitanteNome = slugToNome(jogo.visitante_slug);

  const hasCapitao = !!(capitaoNome && capitaoNome !== '---');
  const hasHeroi   = !!(heroiNome   && heroiNome   !== '---');
  const hasEscalacao = !!formacao && hasCapitao && hasHeroi;

  const palpiteText = (palpiteMandante !== null && palpiteVisitante !== null)
    ? `${palpiteMandante} × ${palpiteVisitante}`
    : null;

  const dataFormatada = jogo.data_jogo
    ? new Date(jogo.data_jogo).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  // ─── RENDER ──────────────────────────────────────────────────────────
  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.black} 0%, #0a0a0a 50%, #0f0f0f 100%)`,
        border: `2px solid ${C.gold}40`,
        boxShadow: `0 0 40px ${C.gold}20, 0 8px 30px rgba(0,0,0,0.6), inset 0 0 30px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Pattern listrado dourado */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `repeating-linear-gradient(45deg, ${C.gold} 0, ${C.gold} 1px, transparent 1px, transparent 14px)` }} />

      {/* Linha superior dourada animada */}
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
          R{jogo.rodada} • {jogo.competicao.toUpperCase()}
        </div>
      </div>

      {/* TÍTULO DA PARTIDA */}
      <div className="text-center pt-2 pb-3 relative z-10">
        <div className="text-[10px] font-black tracking-[5px] mb-1" style={{ color: C.gold }}>
          ⚡ JOGO DA RODADA
        </div>
        {dataFormatada && (
          <div className="text-[10px] text-zinc-400 tracking-widest font-bold">{dataFormatada}</div>
        )}
      </div>

      {/* CONFRONTO */}
      <div className="flex items-center justify-around px-4 sm:px-6 pb-5 relative z-10">
        {/* MANDANTE */}
        <div className="flex flex-col items-center flex-1">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl"
              style={{ background: `${C.gold}40` }} />
            <img src={mandanteLogo} alt={mandanteNome}
              className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = `${STORAGE_BASE}/Escudo%20Novorizontino.png`; }} />
          </div>
          <div className="text-center mt-2">
            <div className="text-sm sm:text-base font-black uppercase tracking-tight leading-none">{mandanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-0.5">CASA</div>
          </div>
        </div>

        {/* CENTRO: VS ou PLACAR */}
        <div className="flex flex-col items-center px-2 sm:px-4">
          {jogo.finalizado && jogo.placar_mandante !== null && jogo.placar_visitante !== null ? (
            <>
              <div className="text-3xl sm:text-4xl font-black tabular-nums" style={{ color: C.gold }}>
                {jogo.placar_mandante}<span className="text-zinc-700 mx-2">-</span>{jogo.placar_visitante}
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
            <div className="absolute inset-0 rounded-full blur-xl"
              style={{ background: `${C.cyan}30` }} />
            <img src={visitanteLogo} alt={visitanteNome}
              className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_4px_15px_rgba(0,0,0,0.8)]"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = `${STORAGE_BASE}/Escudo%20Novorizontino.png`; }} />
          </div>
          <div className="text-center mt-2">
            <div className="text-sm sm:text-base font-black uppercase tracking-tight leading-none">{visitanteNome}</div>
            <div className="text-[8px] text-zinc-500 tracking-[3px] mt-0.5">FORA</div>
          </div>
        </div>
      </div>

      {/* PAINEL: ESCALAÇÃO DO USUÁRIO */}
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
            {/* Header do painel: status + formação */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">✓</span>
                <div className="text-[10px] font-black tracking-[3px]" style={{ color: C.gold }}>
                  SUA ESCALAÇÃO
                </div>
              </div>
              <div className="text-xs font-black px-2 py-0.5 rounded tracking-wider"
                style={{ background: C.gold, color: C.black }}>
                {formacao}
              </div>
            </div>

            {/* Capitão + Herói lado a lado */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-zinc-950/60 rounded-lg px-3 py-2 border"
                style={{ borderColor: `${C.gold}50`, boxShadow: `inset 0 0 10px ${C.gold}10` }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">👑</span>
                  <span className="text-[8px] font-black tracking-[2px]" style={{ color: C.gold }}>CAPITÃO 2×</span>
                </div>
                <div className="text-sm font-black truncate text-white">{capitaoNome}</div>
              </div>
              <div className="bg-zinc-950/60 rounded-lg px-3 py-2 border"
                style={{ borderColor: `${C.cyan}50`, boxShadow: `inset 0 0 10px ${C.cyan}10` }}>
                <div className="flex items-center gap-1 mb-0.5">
                  <span className="text-sm">🔥</span>
                  <span className="text-[8px] font-black tracking-[2px]" style={{ color: C.cyan }}>HERÓI +50%</span>
                </div>
                <div className="text-sm font-black truncate text-white">{heroiNome}</div>
              </div>
            </div>

            {/* Palpite */}
            {palpiteText && (
              <div className="text-center bg-black/40 rounded-lg py-1.5 border border-white/5">
                <span className="text-[9px] tracking-[3px] text-zinc-500 font-black">SEU PALPITE: </span>
                <span className="text-base font-black tabular-nums ml-1" style={{ color: C.gold }}>
                  {palpiteText}
                </span>
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

      {/* CTA PRINCIPAL */}
      {onEscalar ? (
        <button
          onClick={onEscalar}
          className="block w-full py-4 font-black tracking-[3px] text-sm uppercase active:scale-[0.99] transition-transform relative z-10"
          style={{
            background: hasEscalacao
              ? `linear-gradient(90deg, ${C.cyan}, ${C.gold})`
              : `linear-gradient(90deg, ${C.gold}, #ffaa00, ${C.gold})`,
            color: C.black,
            boxShadow: `0 0 25px ${hasEscalacao ? C.cyan : C.gold}50`,
          }}
        >
          {hasEscalacao ? '✏ EDITAR ESCALAÇÃO' : '⚡ ESCALAR AGORA'}
        </button>
      ) : (
        <Link
          href={`/tigre-fc/escalar/${jogo.id}`}
          className="block w-full py-4 font-black tracking-[3px] text-sm uppercase text-center active:scale-[0.99] transition-transform relative z-10"
          style={{
            background: hasEscalacao
              ? `linear-gradient(90deg, ${C.cyan}, ${C.gold})`
              : `linear-gradient(90deg, ${C.gold}, #ffaa00, ${C.gold})`,
            color: C.black,
            boxShadow: `0 0 25px ${hasEscalacao ? C.cyan : C.gold}50`,
          }}
        >
          {hasEscalacao ? '✏ EDITAR ESCALAÇÃO' : '⚡ ESCALAR AGORA'}
        </Link>
      )}

      {/* FOOTER: contador de torcedores */}
      {totalEscalacoes > 0 && (
        <div className="px-4 py-2 text-center relative z-10" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <span className="text-[10px] tracking-[2px] text-zinc-400 font-bold">
            <span className="font-black" style={{ color: C.gold }}>{totalEscalacoes.toLocaleString('pt-BR')}</span>
            {' '}torcedores já escalaram
          </span>
        </div>
      )}
    </div>
  );
}
