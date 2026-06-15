'use client';

import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';
import CompartilharEscalacao from './CompartilharEscalacao';
import WhatsAppCaptureModal from './WhatsAppCaptureModal';

const BASE_STORAGE   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const STADIUM_BG     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const ESCUDO_NOVORIZONTINO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
// Escudo genérico neutro — NÃO usar Novorizontino como fallback de adversário
const ESCUDO_DEFAULT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='8' fill='%231a1a1a'/%3E%3Cpath d='M20 5 L33 10 L33 20 C33 28 27 34 20 36 C13 34 7 28 7 20 L7 10 Z' fill='%23282828' stroke='%23444' stroke-width='1.5'/%3E%3Ctext x='20' y='24' font-size='12' text-anchor='middle' dominant-baseline='middle' fill='%23555' font-family='sans-serif'%3E%3F%3C/text%3E%3C/svg%3E";

// ─── Logos e nomes — mesma fonte do JumbotronJogo ───────────────────────────
const LD = 'https://logodownload.org/wp-content/uploads';
const SB = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';
// Mesma lógica do JumbotronJogo — logodownload.org para todos os times
const LOGOS: Record<string, string> = {
  'novorizontino':        ESCUDO_NOVORIZONTINO,
  'gremio-novorizontino': ESCUDO_NOVORIZONTINO,
  'avai':                 `${LD}/2017/02/avai-fc-logo-escudo.png`,
  'botafogo-sp':          `${LD}/2017/02/botafogo-sp-logo-escudo.png`,
  'america-mg':           `${LD}/2017/02/america-mg-logo-escudo.png`,
  'criciuma':             `${LD}/2018/06/criciuma-logo-escudo-1.png`,
  'cuiaba':               `${LD}/2020/07/cuiaba-logo-escudo.png`,
  'crb':                  `${LD}/2017/02/crb-logo-escudo.png`,
  'athletic-mg':          `${LD}/2017/02/athletic-club-mg-logo-escudo.png`,
  'athletic':             `${LD}/2017/02/athletic-club-mg-logo-escudo.png`,
  'sport':                `${LD}/2017/02/sport-logo-escudo.png`,
  'londrina':             `${LD}/2017/02/londrina-logo-escudo.png`,
  'juventude':            `${LD}/2017/02/juventude-logo-escudo.png`,
  'ceara':                `${LD}/2017/02/ceara-logo-escudo.png`,
  'sao-bernardo':         `${SB}/ESCUDO%20SAO%20BERNARDO.png`,
  'operario-pr':          `${LD}/2017/02/operario-pr-logo-escudo.png`,
  'operario':             `${LD}/2017/02/operario-pr-logo-escudo.png`,
  'goias':                `${LD}/2017/02/goias-logo-escudo.png`,
  'vila-nova':            `${LD}/2017/02/vila-nova-logo-escudo.png`,
  'ponte-preta':          `${LD}/2017/02/ponte-preta-logo-escudo.png`,
  'nautico':              `${SB}/escudo-nautico.png`,
  'atletico-go':          `${LD}/2017/02/atletico-goianiense-logo-escudo.png`,
  'botafogo':             `${LD}/2017/02/botafogo-logo-escudo.png`,
  'fluminense':           `${LD}/2017/02/fluminense-logo-escudo.png`,
  'vasco':                `${LD}/2017/02/vasco-logo-escudo.png`,
  'flamengo':             `${LD}/2017/02/flamengo-logo-escudo.png`,
  'santos':               `${LD}/2017/02/santos-logo-escudo.png`,
  'corinthians':          `${LD}/2017/02/corinthians-logo-escudo.png`,
  'palmeiras':            `${LD}/2017/02/palmeiras-logo-escudo.png`,
  'sao-paulo':            `${LD}/2017/02/sao-paulo-logo-escudo.png`,
  'internacional':        `${LD}/2017/02/internacional-logo-escudo.png`,
  'gremio':               `${LD}/2017/02/gremio-logo-escudo.png`,
  'atletico-mg':          `${LD}/2017/02/atletico-mg-logo-escudo.png`,
  'cruzeiro':             `${LD}/2017/02/cruzeiro-logo-escudo.png`,
  'bahia':                `${LD}/2017/02/bahia-logo-escudo.png`,
  'fortaleza':            `${LD}/2017/02/fortaleza-logo-escudo.png`,
  'athletico-pr':         `${LD}/2017/02/athletico-pr-logo-escudo.png`,
  'coritiba':             `${LD}/2017/02/coritiba-logo-escudo.png`,
  'chapecoense':          `${LD}/2017/02/chapecoense-logo-escudo.png`,
  'paysandu':             `${LD}/2017/02/paysandu-logo-escudo.png`,
  'remo':                 `${LD}/2017/02/remo-logo-escudo.png`,
  'amazonas':             `${LD}/2017/02/amazonas-fc-logo-escudo.png`,
  'volta-redonda':        `${LD}/2017/02/volta-redonda-logo-escudo.png`,
  'guarani':              `${LD}/2017/02/guarani-logo-escudo.png`,
  'ituano':               `${LD}/2021/04/ituano-logo-escudo.png`,
  'mirassol':             `${LD}/2021/04/mirassol-logo-escudo.png`,
  'csa':                  `${LD}/2017/02/csa-logo-escudo.png`,
  'figueirense':          `${LD}/2017/02/figueirense-logo-escudo.png`,
};

const NOMES: Record<string, string> = {
  'novorizontino':        'Novorizontino',
  'gremio-novorizontino': 'Novorizontino',
  'avai':                 'Avaí',
  'criciuma':             'Criciúma',
  'vila-nova':            'Vila Nova',
  'ponte-preta':          'Ponte Preta',
  'athletico-pr':         'Athletico',
  'goias':                'Goiás',
  'coritiba':             'Coritiba',
  'cuiaba':               'Cuiabá',
  'chapecoense':          'Chapecoense',
  'paysandu':             'Paysandu',
  'remo':                 'Remo',
  'amazonas':             'Amazonas',
  'operario-pr':          'Operário',
  'volta-redonda':        'Volta Redonda',
  'nautico':              'Náutico',
  'atletico-go':          'Atlético-GO',
  'botafogo':             'Botafogo',
  'fluminense':           'Fluminense',
  'vasco':                'Vasco',
  'flamengo':             'Flamengo',
  'corinthians':          'Corinthians',
  'palmeiras':            'Palmeiras',
  'sao-paulo':            'São Paulo',
  'internacional':        'Internacional',
  'gremio':               'Grêmio',
  'atletico-mg':          'Atlético-MG',
  'cruzeiro':             'Cruzeiro',
  'bahia':                'Bahia',
  'fortaleza':            'Fortaleza',
  'crb':                  'CRB',
  'america-mg':           'América-MG',
  'athletic-mg':          'Athletic',
  'athletic':             'Athletic',
  'botafogo-sp':          'Botafogo-SP',
  'sport':                'Sport',
  'londrina':             'Londrina',
  'juventude':            'Juventude',
  'ceara':                'Ceará',
  'sao-bernardo':         'São Bernardo',
  'santos':               'Santos',
  'guarani':              'Guarani',
  'ituano':               'Ituano',
  'mirassol':             'Mirassol',
  'csa':                  'CSA',
  'figueirense':          'Figueirense',
};

/** Resolve logo pelo slug — mesma lógica do JumbotronJogo */
const slugToLogo = (slug?: string | null): string => {
  if (!slug) return ESCUDO_DEFAULT;
  const key = slug.toLowerCase().trim();
  if (LOGOS[key]) return LOGOS[key];
  const partial = Object.keys(LOGOS).find(k => key.includes(k) || k.includes(key));
  return partial ? LOGOS[partial] : ESCUDO_DEFAULT;
};

/** Resolve nome de exibição pelo slug */
const slugToNome = (slug?: string | null): string => {
  if (!slug) return '—';
  const key = slug.toLowerCase().trim();
  if (NOMES[key]) return NOMES[key];
  return slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};
// ─────────────────────────────────────────────────────────────────────────────

const TABLE          = 'tigre_fc_escalacoes';
const PROFILE_TABLE  = 'tigre_fc_usuarios';
const SHARE_BASE_URL = 'https://www.onovorizontino.com.br/tigre-fc/escalar';

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
  ovr?: number;
}

type SlotCoord = { x: number; y: number };
type SlotMap   = Record<string, { player: Player | null; x: number; y: number }>;
type Step      = 'loading' | 'formation' | 'arena' | 'captain' | 'hero' | 'palpite' | 'saving' | 'final';

interface EscalacaoFormacaoProps {
  jogoId?: number | string;
  /** Slugs passados via SSR pelo page.tsx para evitar flash no carregamento */
  mandanteSlug?: string;
  visitanteSlug?: string;
}

interface JogoData {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string;
  transmissao: string | null;
  mandanteSlug: string;
  visitanteSlug: string;
}

// IDs obrigatoriamente iguais à tabela tigre_fc_jogadores para o motor de pontuação funcionar
const PLAYERS_DATA: Player[] = [
  // --- GOLEIROS ---
  { id: 2,  name: 'Jordi Martins',      short: 'JORDI',      num: 93, pos: 'GOL', foto: 'JORDI.jpg.webp',            ovr: 82 },
  { id: 1,  name: 'César Augusto',      short: 'CÉSAR',      num: 31, pos: 'GOL', foto: 'CESAR-AUGUSTO.jpg.webp',    ovr: 78 },
  { id: 3,  name: 'João Scapin',        short: 'SCAPIN',     num: 12, pos: 'GOL', foto: 'JOAO-SCAPIN.jpg.webp',      ovr: 72 },
  { id: 4,  name: 'Lucas Ribeiro',      short: 'LUCAS',      num: 1,  pos: 'GOL', foto: 'LUCAS-RIBEIRO.jpg.webp',    ovr: 70 },

  // --- ZAGUEIROS ---
  { id: 12, name: 'Patrick Marcos',     short: 'PATRICK',    num: 4,  pos: 'ZAG', foto: 'PATRICK.jpg.webp',          ovr: 84 },
  { id: 16, name: 'Renato Palm',        short: 'R. PALM',    num: 24, pos: 'ZAG', foto: 'RENATO-PALM.jpg.webp',      ovr: 81 },
  { id: 11, name: 'Eduardo Brock',      short: 'BROCK',      num: 5,  pos: 'ZAG', foto: 'EDUARDO-BROCK.jpg.webp',    ovr: 80 },
  { id: 17, name: 'Alexis Alvariño',    short: 'ALVARÍÑO',   num: 35, pos: 'ZAG', foto: 'IVAN-ALVARINO.jpg.webp',    ovr: 79 },
  { id: 14, name: 'Carlinhos',          short: 'CARLINHOS',  num: 25, pos: 'ZAG', foto: 'CARLINHOS.jpg.webp',        ovr: 76 },
  { id: 10, name: 'João Vitor Dantas',  short: 'DANTAS',     num: 3,  pos: 'ZAG', foto: 'DANTAAS.jpg.webp',          ovr: 75 },
  { id: 7,  name: 'Arthur Barbosa',     short: 'ARTHUR',     num: 22, pos: 'ZAG', foto: 'ARTHUR-BARBOSA.jpg.webp',   ovr: 73 },
  { id: 15, name: 'Alemão',             short: 'ALEMÃO',     num: 28, pos: 'ZAG', foto: 'ALEMAO.jpg.webp',           ovr: 72 },

  // --- LATERAIS ---
  { id: 8,  name: 'Sander Bortolotto',  short: 'SANDER',     num: 33, pos: 'LAT', foto: 'SANDER.jpg.webp',           ovr: 81 },
  { id: 9,  name: 'Maykon Jesus',       short: 'MAYKON',     num: 27, pos: 'LAT', foto: 'MAYKON-JESUS.jpg.webp',     ovr: 78 },
  { id: 6,  name: 'Nilson Castrillón',  short: 'CASTRILLÓN', num: 6,  pos: 'LAT', foto: 'CASTRILLON.jpg.webp',       ovr: 77 },
  { id: 5,  name: 'Jhilmar Lora',       short: 'LORA',       num: 2,  pos: 'LAT', foto: 'LORA.jpg.webp',             ovr: 74 },

  // --- VOLANTES ---
  { id: 19, name: 'Luís Oyama',         short: 'OYAMA',      num: 8,  pos: 'VOL', foto: 'LUIS-OYAMA.jpg.webp',       ovr: 83 },
  { id: 26, name: 'Marlon Adriano',     short: 'MARLON',     num: 30, pos: 'VOL', foto: 'MARLON.jpg.webp',           ovr: 80 },
  { id: 20, name: 'Léo Naldi',          short: 'NALDI',      num: 7,  pos: 'VOL', foto: 'LEO-NALDI.jpg.webp',        ovr: 78 },
  { id: 13, name: 'Gabriel Bahia',      short: 'G. BAHIA',   num: 14, pos: 'VOL', foto: 'GABRIEL-BAHIA.jpg.webp',    ovr: 74 },

  // --- MEIAS ---
  { id: 22, name: 'Matheus Bianqui',    short: 'BIANQUI',    num: 11, pos: 'MEI', foto: 'MATHEUS-BIANQUI.jpg.webp',  ovr: 82 },
  { id: 21, name: 'Rômulo Azevedo',     short: 'RÔMULO',     num: 10, pos: 'MEI', foto: 'ROMULO.jpg.webp',           ovr: 86 },
  { id: 23, name: 'Alexandre Silva',    short: 'JUNINHO',    num: 20, pos: 'MEI', foto: 'JUNINHO.jpg.webp',          ovr: 79 },
  { id: 24, name: 'Luiz Otavio',        short: 'TAVINHO',    num: 17, pos: 'MEI', foto: 'TAVINHO.jpg.webp',          ovr: 78 },
  { id: 36, name: 'Christian Ortíz',    short: 'TITI ORTÍZ', num: 15, pos: 'MEI', foto: 'TITI-ORTIZ.jpg.webp',       ovr: 84 },
  { id: 25, name: 'Diego Galo',         short: 'D. GALO',    num: 29, pos: 'MEI', foto: 'DIEGO-GALO.jpg.webp',       ovr: 75 },
  { id: 27, name: 'Hector Bianchi',     short: 'HECTOR',     num: 16, pos: 'MEI', foto: 'HECTOR-BIACHI.jpg.webp',    ovr: 73 },
  { id: 29, name: 'Luiz Gabriel',       short: 'L. GABRIEL', num: 37, pos: 'MEI', foto: 'LUIZ-GABRIEL.jpg.webp',     ovr: 70 },
  { id: 28, name: 'Nogueira',           short: 'NOGUEIRA',   num: 36, pos: 'MEI', foto: 'NOGUEIRA.jpg.webp',         ovr: 68 },
  { id: 30, name: 'Jhones Kauê',        short: 'J. KAUÊ',    num: 50, pos: 'MEI', foto: 'JHONES-KAUE.jpg.webp',      ovr: 71 },

  // --- ATACANTES ---
  { id: 31, name: 'Robson Fernandes',   short: 'ROBSON',     num: 9,  pos: 'ATA', foto: 'ROBSON.jpg.webp',           ovr: 85 },
  { id: 32, name: 'Vinícius Paiva',     short: 'V. PAIVA',   num: 13, pos: 'ATA', foto: 'VINICIUS-PAIVA.jpg.webp',   ovr: 79 },
  { id: 39, name: 'Ronald Barcellos',   short: 'RONALD',     num: 23, pos: 'ATA', foto: 'RONALD-BARCELLOS.jpg.webp', ovr: 82 },
  { id: 35, name: 'Nicolas Careca',     short: 'CARECA',     num: 21, pos: 'ATA', foto: 'NICOLAS-CARECA.jpg.webp',   ovr: 80 },
  { id: 38, name: 'Carlão',             short: 'CARLÃO',     num: 90, pos: 'ATA', foto: 'CARLAO.jpg.webp',           ovr: 84 },
  { id: 33, name: 'Hélio Borges',       short: 'HÉLIO',      num: 18, pos: 'ATA', foto: 'HELIO-BORGES.jpg.webp',     ovr: 76 },
  { id: 34, name: 'Jardiel Marciel',    short: 'JARDIEL',    num: 19, pos: 'ATA', foto: 'JARDIEL.jpg.webp',          ovr: 75 },
  { id: 37, name: 'Diego Mathias',      short: 'D. MATHIAS', num: 41, pos: 'ATA', foto: 'DIEGO-MATHIAS.jpg.webp',    ovr: 76 },
];

const formationConfigs: Record<string, Record<string, SlotCoord>> = {
  // y: 10 = topo do ataque → 85 = GK — mínimo 15 unidades entre linhas para não aglomerar
  '4-3-3':   { gk:{x:50,y:86}, lb:{x:14,y:67}, cb1:{x:37,y:74}, cb2:{x:63,y:74}, rb:{x:86,y:67}, m1:{x:50,y:50}, m2:{x:28,y:50}, m3:{x:72,y:50}, st:{x:50,y:12}, lw:{x:22,y:20}, rw:{x:78,y:20} },
  '4-4-2':   { gk:{x:50,y:86}, lb:{x:14,y:67}, cb1:{x:37,y:74}, cb2:{x:63,y:74}, rb:{x:86,y:67}, m1:{x:30,y:48}, m2:{x:70,y:48}, m3:{x:14,y:40}, m4:{x:86,y:40}, st1:{x:38,y:14}, st2:{x:62,y:14} },
  '3-5-2':   { gk:{x:50,y:86}, cb1:{x:26,y:72}, cb2:{x:50,y:76}, cb3:{x:74,y:72}, lm:{x:12,y:50}, rm:{x:88,y:50}, m1:{x:32,y:52}, m2:{x:68,y:52}, am:{x:50,y:34}, st1:{x:38,y:14}, st2:{x:62,y:14} },
  '4-5-1':   { gk:{x:50,y:86}, lb:{x:14,y:67}, cb1:{x:37,y:74}, cb2:{x:63,y:74}, rb:{x:86,y:67}, m1:{x:26,y:50}, m2:{x:50,y:50}, m3:{x:74,y:50}, am1:{x:34,y:32}, am2:{x:66,y:32}, st:{x:50,y:12} },
  '4-2-3-1': { gk:{x:50,y:86}, lb:{x:14,y:67}, cb1:{x:37,y:74}, cb2:{x:63,y:74}, rb:{x:86,y:67}, v1:{x:38,y:52}, v2:{x:62,y:52}, lw:{x:18,y:32}, am:{x:50,y:32}, rw:{x:82,y:32}, st:{x:50,y:10} },
  '5-3-2':   { gk:{x:50,y:86}, lb:{x:10,y:56}, cb1:{x:28,y:72}, cb2:{x:50,y:76}, cb3:{x:72,y:72}, rb:{x:90,y:56}, m1:{x:50,y:50}, m2:{x:28,y:42}, m3:{x:72,y:42}, st1:{x:38,y:14}, st2:{x:62,y:14} },
};

const SLOT_W_MOBILE  = 60;
const SLOT_H_MOBILE  = 86;
const SLOT_W_DESKTOP = 80;
const SLOT_H_DESKTOP = 116;

const POSICOES = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'] as const;
type Posicao = typeof POSICOES[number];

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const getRarityColors = (ovr: number) => {
  if (ovr >= 84) return { border: '#fbbf24', glow: 'rgba(251,191,36,0.5)', bar: 'from-amber-400 to-yellow-300' };
  if (ovr >= 78) return { border: '#fde68a', glow: 'rgba(253,230,138,0.4)', bar: 'from-yellow-200 to-amber-200' };
  if (ovr >= 73) return { border: '#d4d4d8', glow: 'rgba(212,212,216,0.3)', bar: 'from-zinc-300 to-zinc-400' };
  return                  { border: '#a16207', glow: 'rgba(161,98,7,0.3)',  bar: 'from-amber-700 to-yellow-800' };
};

// =============================================================================
// FUT CARD — usado no mercado
// =============================================================================
interface FutCardProps {
  player: Player;
  escalado: boolean;
  pending: boolean;
  onClick: () => void;
  getValidPhotoUrl: (foto: string) => string;
}

function FutCard({ player, escalado, pending, onClick, getValidPhotoUrl }: FutCardProps) {
  const ovr = player.ovr ?? 75;
  const colors = getRarityColors(ovr);

  return (
    <motion.button
      layout
      whileHover={{ scale: escalado ? 1 : 1.04, y: escalado ? 0 : -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={escalado}
      className="relative group rounded-lg overflow-hidden text-left"
      style={{
        background: `linear-gradient(180deg, ${colors.border}26 0%, #0a0a0a 60%)`,
        border: `1.5px solid ${pending ? '#22d3ee' : escalado ? '#10b98180' : colors.border + '80'}`,
        boxShadow: pending
          ? '0 0 16px rgba(34,211,238,0.5)'
          : escalado
            ? 'inset 0 0 0 1px #10b98140'
            : `0 0 12px ${colors.glow}`,
      }}
    >
      <div className="flex items-start justify-between px-1.5 pt-1.5 pb-0.5">
        <div className="flex flex-col leading-none">
          <span className="text-[12px] md:text-base font-black text-white tabular-nums leading-none">{ovr}</span>
          <span className="text-[7px] md:text-[8px] font-black tracking-wider mt-0.5" style={{ color: colors.border }}>
            {player.pos}
          </span>
        </div>
        <span className="text-[8px] md:text-[9px] font-black bg-black/60 text-white px-1 rounded tabular-nums">
          #{player.num}
        </span>
      </div>

      <div className="relative aspect-square overflow-hidden bg-black/40">
        <img
          src={getValidPhotoUrl(player.foto)}
          alt={player.short}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${escalado ? 'opacity-30 grayscale' : ''}`}
          style={{ objectPosition: '15% center' }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }}
        />
        {!escalado && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
          />
        )}
        {escalado && (
          <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10">
            <span className="text-emerald-400 text-2xl md:text-3xl font-black drop-shadow-lg">✓</span>
          </div>
        )}
      </div>

      <div className={`px-1 py-0.5 bg-gradient-to-r ${colors.bar} text-black`}>
        <p className="text-[8px] md:text-[10px] text-center font-black truncate uppercase leading-tight">
          {player.short}
        </p>
      </div>
    </motion.button>
  );
}

// =============================================================================
// SLOT NO CAMPO
// =============================================================================
interface DraggableSlotProps {
  slotId: string;
  state: { player: Player | null; x: number; y: number };
  arenaRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  hasPending: boolean;
  isDesktop: boolean;
  isCaptain: boolean;
  isHero: boolean;
  onDragSettled: (slotId: string, newX: number, newY: number) => void;
  onClick: (slotId: string) => void;
  getValidPhotoUrl: (foto: string) => string;
}

function DraggableSlot({
  slotId, state, arenaRef, isActive, hasPending, isDesktop, isCaptain, isHero,
  onDragSettled, onClick, getValidPhotoUrl,
}: DraggableSlotProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const draggedRef = useRef(false);

  const w = isDesktop ? SLOT_W_DESKTOP : SLOT_W_MOBILE;
  const h = isDesktop ? SLOT_H_DESKTOP : SLOT_H_MOBILE;

  // Posicionamento pixel-based via useLayoutEffect.
  // Converte state.x/state.y (%) para pixels ANTES do browser pintar —
  // elimina o flash de "slot voltando para posição antiga" do approach anterior.
  useLayoutEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    x.set((state.x / 100) * rect.width  - w / 2);
    y.set((state.y / 100) * rect.height - h / 2);
  }, [state.x, state.y, w, h]); // eslint-disable-line react-hooks/exhaustive-deps

  // Atualiza posição quando a arena redimensiona (rotação, resize)
  useEffect(() => {
    const arena = arenaRef.current;
    if (!arena) return;
    const obs = new ResizeObserver(() => {
      const rect = arena.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      x.set((state.x / 100) * rect.width  - w / 2);
      y.set((state.y / 100) * rect.height - h / 2);
    });
    obs.observe(arena);
    return () => obs.disconnect();
  }, [state.x, state.y, w, h]); // eslint-disable-line react-hooks/exhaustive-deps

  const ovr = state.player?.ovr ?? 75;
  const colors = state.player ? getRarityColors(ovr) : null;

  const borderColor = isCaptain
    ? '#fbbf24'
    : isHero
      ? '#22d3ee'
      : isActive
        ? '#facc15'
        : hasPending
          ? '#22d3ee99'
          : colors?.border ?? '#ffffff4d';

  const boxShadow = isCaptain
    ? '0 0 25px #fbbf24, inset 0 0 20px rgba(251,191,36,0.3)'
    : isHero
      ? '0 0 25px #22d3ee, inset 0 0 20px rgba(34,211,238,0.3)'
      : isActive
        ? '0 0 30px #facc15'
        : state.player
          ? `0 4px 18px rgba(0,0,0,0.6), 0 0 12px ${colors?.glow ?? 'rgba(0,0,0,0)'}`
          : '0 4px 12px rgba(0,0,0,0.6)';

  return (
    <motion.div
      drag
      dragMomentum={false}
      whileDrag={{ scale: 1.25, zIndex: 200 }}
      animate={isCaptain || isHero ? { scale: [1, 1.03, 1] } : { scale: 1 }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      onDragStart={() => { draggedRef.current = false; }}
      onDrag={(_, info) => {
        if (Math.abs(info.offset.x) > 4 || Math.abs(info.offset.y) > 4) {
          draggedRef.current = true;
        }
      }}
      onDragEnd={() => {
        const arena = arenaRef.current;
        if (!arena) return;
        const rect = arena.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        // x.get()/y.get() = pixels do canto superior-esquerdo do card
        // Convert para % do centro do card na arena
        const newX = clamp(((x.get() + w / 2) / rect.width)  * 100, 5, 95);
        const newY = clamp(((y.get() + h / 2) / rect.height) * 100, 5, 95);
        onDragSettled(slotId, newX, newY);
        // useLayoutEffect re-sincroniza x,y após o React atualizar state
      }}
      onClick={() => {
        if (draggedRef.current) {
          draggedRef.current = false;
          return;
        }
        onClick(slotId);
      }}
      style={{
        x, y,
        position: 'absolute',
        left: 0,
        top: 0,
        width: w,
        height: h,
        border: `2px solid ${borderColor}`,
        boxShadow,
        background: state.player
          ? `linear-gradient(180deg, ${colors?.border ?? '#fff'}33 0%, #000 70%)`
          : 'rgba(0,0,0,0.55)',
        touchAction: 'none',
      }}
      className="rounded-xl flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
    >
      {state.player ? (
        <div className="relative w-full h-full pointer-events-none">
          <div className="absolute top-0.5 left-1 z-10 leading-none">
            <div className="text-[11px] md:text-sm font-black text-white tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
              {ovr}
            </div>
            <div className="text-[7px] md:text-[8px] font-black tracking-wider"
              style={{ color: colors?.border, textShadow: '0 1px 2px rgba(0,0,0,1)' }}>
              {state.player.pos}
            </div>
          </div>
          <div className="absolute top-0.5 right-1 z-10 text-[9px] md:text-[10px] font-black text-white tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            #{state.player.num}
          </div>
          <img src={getValidPhotoUrl(state.player.foto)} alt={state.player.short}
            className="w-full h-full object-cover" style={{ objectPosition: '85% center' }} draggable={false}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${colors?.bar} py-0.5`}>
            <span className="text-[8px] md:text-[9px] font-black text-black block text-center leading-tight">
              {state.player.short}
            </span>
          </div>
          {(isCaptain || isHero) && (
            <div className={`absolute -top-1.5 -right-1.5 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[11px] md:text-xs font-black shadow-xl z-20 ${
              isCaptain ? 'bg-yellow-400 text-black' : 'bg-cyan-400 text-black'
            }`}>
              {isCaptain ? 'C' : 'H'}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center opacity-50 pointer-events-none">
          <span className="text-2xl md:text-3xl font-thin">+</span>
          <div className="text-[8px] md:text-[9px] uppercase mt-0.5 font-bold tracking-wider">{slotId}</div>
        </div>
      )}
    </motion.div>
  );
}

// =============================================================================
// ANA BUTTON — sugere escalação ideal via /api/agents/ana
// =============================================================================

function AnaButton({ formation, onApply }: {
  formation: string;
  onApply: (slots: Record<string, Player>) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [erro, setErro]       = React.useState<string | null>(null);

  const sugerir = async () => {
    setLoading(true);
    setErro(null);
    try {
      const res  = await fetch(`/api/agents/ana?formacao=${encodeURIComponent(formation)}`);
      const data = await res.json();
      if (!data?.slots) throw new Error('Sem sugestão');

      const mapa: Record<string, Player> = {};
      for (const s of data.slots as { slot: string; titular: Player }[]) {
        mapa[s.slot] = s.titular;
      }
      onApply(mapa);
    } catch {
      setErro('Ana não conseguiu sugerir agora. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mb-2">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={sugerir}
        disabled={loading}
        className="w-full py-3 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading
          ? <><span className="animate-spin">⚙</span> Ana pensando...</>
          : <>🧠 Ana sugere a escalação ideal</>
        }
      </motion.button>
      {erro && <p className="text-red-400 text-[10px] text-center mt-1">{erro}</p>}
    </div>
  );
}

// =============================================================================
// COMPONENTE PRINCIPAL
// =============================================================================

export default function EscalacaoFormacao({ jogoId, mandanteSlug: propMandanteSlug, visitanteSlug: propVisitanteSlug }: EscalacaoFormacaoProps) {
  const router = useRouter();

  const [step, setStep]                       = useState<Step>('loading');
  const [formation, setFormation]             = useState('4-3-3');
  const [slotMap, setSlotMap]                 = useState<SlotMap>({});
  const [activeSlot, setActiveSlot]           = useState<string | null>(null);
  const [pendingPlayer, setPendingPlayer]     = useState<Player | null>(null);
  const [captainId, setCaptainId]             = useState<number | null>(null);
  const [heroId, setHeroId]                   = useState<number | null>(null);
  const [palpiteMandante, setPalpiteMandante] = useState(1);
  const [palpiteVisitante, setPalpiteVisitante] = useState(2);
  const [finalImageUri, setFinalImageUri]     = useState<string | null>(null);
  const [isGenerating, setIsGenerating]       = useState(false);
  const [waToast, setWaToast]                 = useState(false);

  const [userId, setUserId]         = useState<string | null>(null); // google_id (auth.uid)
  const [tfcUserId, setTfcUserId]   = useState<string | null>(null); // tigre_fc_usuarios.id
  const [userName, setUserName]     = useState<string>('TORCEDOR');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [hadSaved, setHadSaved]         = useState(false);
  const [saveError, setSaveError]       = useState<string | null>(null);
  const [isSavingDb, setIsSavingDb]     = useState(false);
  const [showWaModal, setShowWaModal]   = useState(false);
  const [waSolicitado, setWaSolicitado] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isDesktop, setIsDesktop] = useState(false);
  const [posFiltro, setPosFiltro] = useState<Posicao>('TODOS');
  const [jogoData, setJogoData] = useState<JogoData | null>(null);

  const finalCardRef = useRef<HTMLDivElement>(null);
  const arenaRef     = useRef<HTMLDivElement>(null);

  // ─── captureCard: captura on-demand (chamado ao clicar em Salvar/Compartilhar) ──
  // Pré-fetcha imagens Supabase como blob: URLs → evita canvas CORS taint.
  // skipFonts: true → sem travamento por fontes externas.
  // Logos de sites externos (logodownload.org) são excluídos do canvas via filter
  // (sem CORS deles), mas aparecem normalmente na tela — comportamento esperado.
  const captureCard = useCallback(async (): Promise<string | null> => {
    const el = finalCardRef.current;
    if (!el) return null;

    const blobUrls: string[] = [];
    const origSrcs = new Map<HTMLImageElement, string>();
    const origCross = new Map<HTMLImageElement, string | null>();
    let captureStyle: HTMLStyleElement | null = null;

    try {
      const imgs = Array.from(el.querySelectorAll<HTMLImageElement>('img'));

      // Aguarda carregamento visual (max 3s)
      await Promise.all(imgs.map(img =>
        img.complete ? Promise.resolve() :
        new Promise<void>(res => {
          const t = setTimeout(res, 3000);
          img.onload = () => { clearTimeout(t); res(); };
          img.onerror = () => { clearTimeout(t); res(); };
        })
      ));

      // Pré-fetch TODAS as imagens → blob: ou ESCUDO_DEFAULT (evita CORS taint no canvas)
      await Promise.allSettled(imgs.map(async (img) => {
        const src = img.getAttribute('src') ?? '';
        if (!src || src.startsWith('data:') || src.startsWith('blob:')) return;
        origSrcs.set(img, img.src);
        origCross.set(img, img.getAttribute('crossOrigin'));
        img.removeAttribute('crossOrigin');
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 5000);
          const res = await fetch(src, { mode: 'cors', credentials: 'omit', signal: ctrl.signal });
          clearTimeout(t);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          blobUrls.push(blobUrl);
          img.src = blobUrl;
        } catch {
          // Fallback: placeholder neutro (data: URI → canvas sempre aceita)
          img.src = ESCUDO_DEFAULT;
        }
      }));

      if (origSrcs.size > 0) await new Promise<void>(r => setTimeout(r, 300));

      // Desabilita CSS filter/backdrop-filter durante a captura:
      // drop-shadow e blur causam falha silenciosa no html-to-image (requerem compositing GPU)
      captureStyle = document.createElement('style');
      captureStyle.textContent = `
        [data-capture-root] *, [data-capture-root] {
          filter: none !important;
          -webkit-filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          animation: none !important;
          transition: none !important;
        }
      `;
      el.setAttribute('data-capture-root', '1');
      document.head.appendChild(captureStyle);

      const withTimeout = <T,>(p: Promise<T>, ms: number, label: string): Promise<T> =>
        Promise.race([p, new Promise<never>((_, rej) =>
          setTimeout(() => rej(new Error(`timeout ${label} ${ms}ms`)), ms)
        )]) as Promise<T>;

      // cacheBust: false → blob URLs ficam intactos (cacheBust appends ?v=X que invalida blob: protocol)
      const opts = { cacheBust: false, quality: 0.95, pixelRatio: 2, backgroundColor: '#0a0a0a', skipFonts: true };

      let dataUrl: string;
      try {
        dataUrl = await withTimeout(htmlToImage.toPng(el, opts), 15000, 'toPng-px2');
      } catch (e1) {
        console.warn('[captureCard] px2 falhou, tentando px1:', e1);
        try {
          dataUrl = await withTimeout(htmlToImage.toPng(el, { ...opts, pixelRatio: 1 }), 15000, 'toPng-px1');
        } catch (e2) {
          console.error('[captureCard] px1 falhou:', e2);
          throw e2;
        }
      }
      return dataUrl;
    } catch (e) {
      console.error('[captureCard] erro final:', e);
      return null;
    } finally {
      origSrcs.forEach((orig, img) => { img.src = orig; });
      origCross.forEach((val, img) => {
        if (val !== null && val !== undefined) img.setAttribute('crossOrigin', val ?? 'anonymous');
        else img.removeAttribute('crossOrigin');
      });
      blobUrls.forEach(u => URL.revokeObjectURL(u));
      // Remove override de CSS e atributo de captura
      el.removeAttribute('data-capture-root');
      if (captureStyle?.parentNode) captureStyle.remove();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getValidPhotoUrl = useCallback((fotoPath: string) => {
    if (!fotoPath) return ESCUDO_DEFAULT;
    const filename = fotoPath.split('/').pop() || fotoPath;
    return `${BASE_STORAGE}${encodeURIComponent(filename)}`;
  }, []);

  useEffect(() => {
    const update = () => setIsDesktop(window.innerWidth >= 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const buildEmptySlots = (formacao: string): SlotMap => {
      const coords = formationConfigs[formacao] ?? formationConfigs['4-3-3'];
      const initial: SlotMap = {};
      Object.entries(coords).forEach(([id, c]) => { initial[id] = { player: null, x: c.x, y: c.y }; });
      return initial;
    };

    const loadExisting = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled && user) {
          setUserId(user.id);
          let profile: { apelido?: string | null; nome?: string | null; avatar_url?: string | null } | null = null;
          const { data: byGoogleId } = await supabase
            .from(PROFILE_TABLE).select('id, apelido, nome, avatar_url, whatsapp_solicitado').eq('google_id', user.id).maybeSingle();
          if (byGoogleId) {
            profile = byGoogleId;
            if (!cancelled) {
              setTfcUserId((byGoogleId as any).id);
              setWaSolicitado(!!(byGoogleId as any).whatsapp_solicitado);
            }
          }
          if (!cancelled) {
            const meta = (user.user_metadata || {}) as Record<string, unknown>;
            const fallbackName =
              (meta.nome as string) || (meta.name as string) || (meta.full_name as string) ||
              user.email?.split('@')[0] || 'TORCEDOR';
            setUserName(
              (profile?.apelido || profile?.nome || fallbackName).toString().toUpperCase().slice(0, 20)
            );
            setUserAvatar(profile?.avatar_url || (meta.avatar_url as string) || null);
          }
        }
        // mandante_slug capturado localmente para uso no mapeamento do palpite
        // (o state jogoData pode não ter propagado ainda quando lemos a escalação)
        let mandanteSlugLocal: string = propMandanteSlug ?? 'novorizontino';

        // Carrega dados completos do jogo do banco
        if (jogoId && !cancelled) {
          try {
            const { data: jogoRaw } = await supabase
              .from('jogos')
              .select('id, competicao, rodada, data_hora, local, transmissao, mandante_slug, visitante_slug')
              .eq('id', Number(jogoId))
              .maybeSingle();
            if (jogoRaw && !cancelled) {
              mandanteSlugLocal = jogoRaw.mandante_slug ?? 'novorizontino';
              setJogoData({
                id: jogoRaw.id,
                competicao: jogoRaw.competicao ?? '',
                rodada: jogoRaw.rodada ?? '',
                data_hora: jogoRaw.data_hora ?? '',
                local: jogoRaw.local ?? '',
                transmissao: jogoRaw.transmissao ?? null,
                mandanteSlug: jogoRaw.mandante_slug ?? 'novorizontino',
                visitanteSlug: jogoRaw.visitante_slug ?? '',
              });
            }
          } catch (e) {
            console.error('[jogoData] erro:', e);
          }
        }

        if (!user || !jogoId) {
          if (!cancelled) {
            setSlotMap(buildEmptySlots('4-3-3'));
            setStep('formation');
          }
          return;
        }

        // Carrega via API route (usa supabaseAdmin — resolve usuario_id correto e bypassa RLS)
        const escalacaoRes = await fetch(`/api/tigre-fc/salvar-escalacao?jogo_id=${jogoId}`);
        if (cancelled) return;
        const escalacaoJson = escalacaoRes.ok ? await escalacaoRes.json().catch(() => ({ data: null })) : { data: null };
        const data = escalacaoJson.data as {
          formacao?: string;
          lineup?: Record<string, unknown>;
          capitao_id?: number;
          heroi_id?: number;
          palpite_tigre?: number;
          palpite_adv?: number;
        } | null;
        const error = !escalacaoRes.ok && escalacaoRes.status !== 401 ? { message: 'fetch error' } : null;
        if (cancelled) return;
        if (error || !data) {
          setSlotMap(buildEmptySlots('4-3-3'));
          setStep('formation');
          return;
        }
        // palpite_tigre = placar do Novorizontino; palpite_adv = adversário
        // independe de quem é mandante/visitante no jogo
        const isNovMand = mandanteSlugLocal === 'novorizontino';
        const formacao = data.formacao || '4-3-3';
        const coords   = formationConfigs[formacao] ?? formationConfigs['4-3-3'];
        const restored: SlotMap = {};
        const slotsJson = (data.lineup ?? {}) as Record<string, number | { id: number; x?: number; y?: number } | null>;
        Object.entries(coords).forEach(([slotId, c]) => {
          const raw = slotsJson[slotId];
          let pid: number | null = null;
          let savedX = c.x;
          let savedY = c.y;
          if (typeof raw === 'number') {
            pid = raw;
          } else if (raw && typeof raw === 'object') {
            pid = raw.id ?? null;
            if (typeof raw.x === 'number') savedX = raw.x;
            if (typeof raw.y === 'number') savedY = raw.y;
          }
          const player = pid != null ? PLAYERS_DATA.find(p => p.id === pid) ?? null : null;
          restored[slotId] = { player, x: savedX, y: savedY };
        });
        setFormation(formacao);
        setSlotMap(restored);
        setCaptainId(data.capitao_id ?? null);
        setHeroId(data.heroi_id ?? null);
        // palpite_tigre = Novorizontino; palpite_adv = adversário — independe de mandante/visitante
        setPalpiteMandante(isNovMand ? (data.palpite_tigre ?? 1) : (data.palpite_adv ?? 0));
        setPalpiteVisitante(isNovMand ? (data.palpite_adv ?? 0) : (data.palpite_tigre ?? 1));
        setHadSaved(true);
        setStep('arena');
      } catch (e) {
        console.error('[EscalacaoFormacao] erro no load:', e);
        if (!cancelled) {
          setSlotMap(buildEmptySlots('4-3-3'));
          setStep('formation');
        }
      }
    };
    loadExisting();
    return () => { cancelled = true; };
  }, [jogoId]);

  const handleChangeFormation = (novaFormacao: string) => {
    const coords = formationConfigs[novaFormacao];
    const playersAtuais = Object.values(slotMap).map(s => s.player).filter((p): p is Player => p !== null);
    const novo: SlotMap = {};
    Object.entries(coords).forEach(([id, c]) => { novo[id] = { player: null, x: c.x, y: c.y }; });
    const queue = [...playersAtuais];
    Object.keys(novo).forEach(slotId => {
      if (queue.length > 0) novo[slotId].player = queue.shift()!;
    });
    setFormation(novaFormacao);
    setSlotMap(novo);
    setStep('arena');
  };

  const handlePlayerSelection = (player: Player) => {
    const slotComEle = Object.entries(slotMap).find(([, s]) => s.player?.id === player.id);
    if (slotComEle) {
      setSlotMap(prev => ({ ...prev, [slotComEle[0]]: { ...prev[slotComEle[0]], player: null } }));
      return;
    }
    if (activeSlot) {
      setSlotMap(prev => ({ ...prev, [activeSlot]: { ...prev[activeSlot], player } }));
      setActiveSlot(null);
    } else {
      setPendingPlayer(player);
    }
  };

  const handleSlotClick = (slotId: string) => {
    if (pendingPlayer) {
      // Coloca o pendingPlayer no slot (substituindo quem estiver lá)
      setSlotMap(prev => ({ ...prev, [slotId]: { ...prev[slotId], player: pendingPlayer } }));
      setPendingPlayer(null);
      setActiveSlot(null);
      return;
    }
    if (activeSlot && activeSlot !== slotId) {
      // Dois slots selecionados → SWAP entre eles (funciona mesmo com um vazio)
      setSlotMap(prev => {
        const pA = prev[activeSlot]?.player ?? null;
        const pB = prev[slotId]?.player ?? null;
        return {
          ...prev,
          [activeSlot]: { ...prev[activeSlot], player: pB },
          [slotId]:     { ...prev[slotId],     player: pA },
        };
      });
      setActiveSlot(null);
      return;
    }
    // Nenhum ativo → ativa este (ou desativa se clicar no mesmo)
    setActiveSlot(slotId === activeSlot ? null : slotId);
  };

  const handleSlotDragSettled = useCallback((slotId: string, newX: number, newY: number) => {
    setSlotMap(prev => {
      if (!prev[slotId]) return prev;
      return { ...prev, [slotId]: { ...prev[slotId], x: newX, y: newY } };
    });
  }, []);

  const selectedPlayers = Object.values(slotMap)
    .map(s => s.player)
    .filter((p): p is Player => p !== null);

  const playerEscalado = (id: number) => selectedPlayers.some(p => p.id === id);

  const teamOvr = useMemo(() => {
    if (selectedPlayers.length === 0) return 0;
    const total = selectedPlayers.reduce((sum, p) => sum + (p.ovr ?? 75), 0);
    return Math.round(total / selectedPlayers.length);
  }, [selectedPlayers]);

  const filteredPlayers = useMemo(() => {
    if (posFiltro === 'TODOS') return PLAYERS_DATA;
    return PLAYERS_DATA.filter(p => p.pos === posFiltro);
  }, [posFiltro]);

  const handleSelectCaptain = (id: number) => { setCaptainId(id); setStep('hero');    };
  const handleSelectHero    = (id: number) => { setHeroId(id);    setStep('palpite'); };

  const triggerCelebration = () => {
    confetti({ particleCount: 250, spread: 100, origin: { y: 0.6 } });
    confetti({ particleCount: 180, angle: 60,  spread: 80, origin: { x: 0.1 } });
    confetti({ particleCount: 180, angle: 120, spread: 80, origin: { x: 0.9 } });
  };

  const saveEscalacao = async (): Promise<{ ok: boolean; reason?: string }> => {
    if (!jogoId) return { ok: false, reason: 'sem-jogo' };
    if (!captainId || !heroId) return { ok: false, reason: 'sem-capitao-ou-heroi' };

    const lineup: Record<string, { id: number; x: number; y: number } | null> = {};
    Object.entries(slotMap).forEach(([slotId, state]) => {
      lineup[slotId] = state.player ? { id: state.player.id, x: state.x, y: state.y } : null;
    });

    const isNovMand = (jogoData?.mandanteSlug ?? 'novorizontino') === 'novorizontino';

    // Usa a API route — ela resolve tigre_fc_usuarios.id a partir do google_id (evita FK violation)
    try {
      const res = await fetch('/api/tigre-fc/salvar-escalacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jogo_id: Number(jogoId),
          formacao: formation,
          lineup,
          capitao_id: captainId,
          heroi_id: heroId,
          palpite_tigre: isNovMand ? palpiteMandante : palpiteVisitante,
          palpite_adv:   isNovMand ? palpiteVisitante : palpiteMandante,
        }),
      });
      if (res.status === 401) return { ok: false, reason: 'sem-login' };
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error('[saveEscalacao] API error:', body);
        return { ok: false, reason: body?.error ?? `HTTP ${res.status}` };
      }
      setHadSaved(true);
      if (!waSolicitado) setTimeout(() => setShowWaModal(true), 800);
      return { ok: true };
    } catch (e) {
      console.error('[saveEscalacao] fetch error:', e);
      return { ok: false, reason: 'Erro de rede' };
    }
  };

  const generateFinalImage = async () => {
    // Bloqueia sem login — exige autenticação antes de gerar/salvar
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    try {
      setSaveError(null);
      setStep('saving');
      const saveRes = await saveEscalacao();
      if (!saveRes.ok && saveRes.reason !== 'sem-capitao-ou-heroi') {
        if (saveRes.reason === 'sem-login') {
          setStep('palpite'); // volta ao passo anterior
          setShowLoginModal(true);
          return;
        }
        setSaveError(`Erro ao salvar no ranking: ${saveRes.reason}`);
      }
      setFinalImageUri(null);
      setStep('final');
      try { triggerCelebration(); } catch {}
    } catch (e) {
      console.error('[generateFinalImage]', e);
      setFinalImageUri(null);
      setStep('final');
    }
  };

  // Botão de salvar no ranking separado (para usar a partir do step final)
  const handleSaveToRanking = async () => {
    setIsSavingDb(true);
    setSaveError(null);
    const res = await saveEscalacao();
    setIsSavingDb(false);
    if (res.ok) {
      setSaveError(null);
      setHadSaved(true);
      if (!waSolicitado) setTimeout(() => setShowWaModal(true), 800);
    } else if (res.reason === 'sem-login') {
      setShowLoginModal(true);
    } else {
      setSaveError(`Erro: ${res.reason}`);
    }
  };

  const verEscalacaoSalva = () => {
    setFinalImageUri(null);
    setStep('final');
  };

  const formatJogoInfo = () => {
    if (!jogoData) return { diaSemana: '', dataFmt: '', horario: '', confronto: '' };
    try {
      const d = new Date(jogoData.data_hora);
      const dias = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
      const meses = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
      const hora = String(d.getHours()).padStart(2,'0');
      const min  = String(d.getMinutes()).padStart(2,'0');
      const confronto = `${slugToNome(jogoData.mandanteSlug)} × ${slugToNome(jogoData.visitanteSlug)}`;
      return {
        diaSemana: dias[d.getDay()],
        dataFmt: `${d.getDate()} de ${meses[d.getMonth()]}`,
        horario: `${hora}h${min === '00' ? '' : min}`,
        confronto,
      };
    } catch {
      return { diaSemana: '', dataFmt: '', horario: '', confronto: '' };
    }
  };

  const buildShareText = () => {
    const cap  = selectedPlayers.find(p => p.id === captainId)?.short ?? '—';
    const hero = selectedPlayers.find(p => p.id === heroId)?.short    ?? '—';
    const { confronto } = formatJogoInfo();
    const placarMand = palpiteMandante;
    const placarVis  = palpiteVisitante;
    const adversario = slugToNome(
      (jogoData?.mandanteSlug ?? propMandanteSlug)?.includes('novorizontino')
        ? jogoData?.visitanteSlug ?? propVisitanteSlug
        : jogoData?.mandanteSlug ?? propMandanteSlug
    );
    return (
`🐯 *ARENA TIGRE FC*

Escalei meu Tigrão pra enfrentar o ${adversario || 'adversário'}!
🛡️ Formação: ${formation} | OVR ${teamOvr}
👑 Capitão: ${cap} | 🔥 Herói: ${hero}
🎯 Meu palpite: ${placarMand} × ${placarVis}

Consegue escalar melhor do que eu? 😤
Desafio você! Monta o seu time agora 👇

🔗 onovorizontino.com.br/tigre-fc/escalar/${jogoId ?? ''}`
    );
  };

  // downloadImage: captura on-demand se ainda não há cache, depois baixa
  const downloadImage = async () => {
    setIsGenerating(true);
    try {
      let uri = finalImageUri ?? await captureCard();
      if (uri) {
        setFinalImageUri(uri);
        const a = document.createElement('a');
        a.download = `tigre-fc-escalacao-${formation}.png`;
        a.href = uri;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert('Não foi possível gerar a imagem. Tente novamente.\n\nDica: tira um screenshot da tela! 📸');
      }
    } catch (e) {
      console.error('[downloadImage] erro:', e);
      const msg = (e as Error)?.message ?? String(e);
      alert(`Erro ao gerar imagem: ${msg}\n\nTira um screenshot da tela! 📸`);
    } finally {
      setIsGenerating(false);
    }
  };

  const canShare = true; // botões sempre ativos — captura on-demand

  // Helper: garante URI capturada antes de compartilhar
  const ensureUri = async (): Promise<string | null> => {
    if (finalImageUri) return finalImageUri;
    setIsGenerating(true);
    const uri = await captureCard();
    setIsGenerating(false);
    if (uri) setFinalImageUri(uri);
    return uri;
  };

  const shareWhatsApp = async () => {
    const text = buildShareText();
    const uri = await ensureUri();

    // Mobile: Web Share API com arquivo (Android Chrome, iOS Safari)
    if (uri && typeof navigator !== 'undefined' && (navigator as any).canShare) {
      try {
        const blob = await fetch(uri).then(r => r.blob());
        const file = new File([blob], 'tigre-fc-escalacao.png', { type: 'image/png' });
        if ((navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({ files: [file], text, title: 'Arena Tigre FC' });
          return;
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }

    // Desktop: baixa a imagem primeiro, depois abre o WhatsApp
    if (uri) {
      const a = document.createElement('a');
      a.href = uri;
      a.download = 'tigre-fc-escalacao.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Aguarda início do download antes de abrir nova aba
      await new Promise(r => setTimeout(r, 700));
    }
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    if (uri) {
      setWaToast(true);
      setTimeout(() => setWaToast(false), 8000);
    }
  };

  const shareInstagram = async () => {
    const uri = await ensureUri();
    if (uri && typeof navigator !== 'undefined' && (navigator as any).canShare) {
      try {
        const blob = await fetch(uri).then(r => r.blob());
        const file = new File([blob], `tigre-fc-escalacao.png`, { type: 'image/png' });
        if ((navigator as any).canShare({ files: [file] })) {
          await (navigator as any).share({ files: [file], title: 'Arena Tigre FC', text: 'Duvido você escalar melhor! 🐯' });
          return;
        }
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
      }
    }
    if (uri) downloadImage();
    else alert('📸 Tira um screenshot da tela e posta no Instagram Stories!');
  };

  const shareTextOnly = () => {
    const text = buildShareText();
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      (navigator as any).share({ text, title: 'Arena Tigre FC' }).catch(() => {});
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const shareX = () => {
    const { confronto } = formatJogoInfo();
    const text = `🐯 Minha escalação pro ${confronto || 'Novorizontino'} (${formation}) — OVR ${teamOvr} — Palpite ${palpiteMandante}×${palpiteVisitante} 🔥\nDuvido você fazer melhor! ${SHARE_BASE_URL}/${jogoId ?? ''}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const finalizarEVoltar = () => router.push('/tigre-fc');

  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden flex flex-col select-none">
      {/* Botão voltar — fixo no topo esquerdo, sempre visível */}
      <button
        onClick={() => router.push('/tigre-fc')}
        className="fixed top-3 left-3 z-[300] flex items-center gap-1.5 rounded-full border border-white/15 bg-black/70 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 backdrop-blur-md transition-colors hover:border-yellow-500/40 hover:text-yellow-400 active:scale-95">
        ← Home
      </button>

      {/* Toast WhatsApp desktop */}
      {waToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl bg-green-500 text-black font-black text-sm shadow-2xl flex items-center gap-2 whitespace-nowrap">
          📎 Imagem salva! Abra o WhatsApp e anexe a foto no chat.
        </div>
      )}
      <AnimatePresence mode="wait">

        {step === 'loading' && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"><img src={STADIUM_BG} alt="" className="w-full h-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">🐯</motion.div>
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ARENA TIGRE FC</div>
              <div className="text-white text-2xl font-black italic mb-8">ENTRANDO NO VESTIÁRIO...</div>
              <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-transparent via-yellow-400 to-transparent w-1/2" />
              </div>
            </div>
          </motion.div>
        )}

        {step === 'formation' && (
          <motion.div key="formation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 bg-zinc-950 relative overflow-auto">
            <div className="absolute inset-0 opacity-10"><img src={STADIUM_BG} alt="" className="w-full h-full object-cover" /></div>
            <div className="relative z-10 w-full max-w-md flex flex-col items-center">
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ETAPA 1 DE 5</div>
              <h1 className="text-4xl font-black italic mb-2 text-yellow-500 uppercase tracking-tighter text-center">
                ESCOLHA A TÁTICA
              </h1>
              <p className="text-zinc-500 text-sm mb-6 text-center">Como o Tigrão vai entrar em campo?</p>

              {/* Botão Ana */}
              <AnaButton formation={formation} onApply={(slots) => {
                setSlotMap(prev => {
                  const next = { ...prev };
                  Object.entries(slots).forEach(([slotId, player]) => {
                    if (next[slotId]) next[slotId] = { ...next[slotId], player };
                  });
                  return next;
                });
                setStep('arena');
              }} />

              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {Object.keys(formationConfigs).map(f => (
                  <motion.button key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => handleChangeFormation(f)}
                    className={`py-8 border-2 rounded-3xl font-black text-2xl italic transition-all ${
                      formation === f
                        ? 'border-yellow-400 bg-yellow-500/10 text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.3)]'
                        : 'bg-zinc-900 border-white/10 hover:border-yellow-500/50 hover:bg-zinc-800'
                    }`}>
                    {f}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'arena' && (
          <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex relative overflow-hidden h-full">

            {/* MERCADO À ESQUERDA */}
            <div className="h-full w-[148px] sm:w-[190px] md:w-[300px] flex-shrink-0 z-[110] bg-gradient-to-b from-zinc-950 via-black to-zinc-950 border-r border-yellow-500/10 flex flex-col">
              <div className="px-2 md:px-3 pt-2 md:pt-3 pb-1 border-b border-white/10 bg-black/95 backdrop-blur-md">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-yellow-400 font-black text-[11px] md:text-base tracking-widest italic">MERCADO</h3>
                  <div className="text-[9px] md:text-xs text-zinc-400 tabular-nums">
                    <span className="text-yellow-400 font-black">{selectedPlayers.length}</span><span className="text-zinc-600">/11</span>
                  </div>
                </div>
                {hadSaved && (
                  <div className="mb-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-400/30 rounded text-[8px] md:text-[10px] text-cyan-300 font-bold tracking-wide">
                    ✓ ESCALAÇÃO SALVA
                  </div>
                )}
                <div className="grid grid-cols-4 md:grid-cols-7 gap-0.5 md:gap-1">
                  {POSICOES.map(p => (
                    <button key={p} onClick={() => setPosFiltro(p)}
                      className={`text-[8px] md:text-[10px] font-black py-1.5 rounded tracking-wide transition-all active:scale-95 ${
                        posFiltro === p
                          ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.5)]'
                          : 'bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800'
                      }`}>
                      {p === 'TODOS' ? 'ALL' : p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-1.5 md:p-2">
                <div className="grid grid-cols-3 gap-1 md:gap-1.5">
                  <AnimatePresence mode="popLayout">
                    {filteredPlayers.map(player => (
                      <FutCard
                        key={player.id}
                        player={player}
                        escalado={playerEscalado(player.id)}
                        pending={pendingPlayer?.id === player.id}
                        onClick={() => handlePlayerSelection(player)}
                        getValidPhotoUrl={getValidPhotoUrl}
                      />
                    ))}
                  </AnimatePresence>
                </div>
                {filteredPlayers.length === 0 && (
                  <div className="text-center text-zinc-500 text-xs mt-8">Nenhum jogador.</div>
                )}
              </div>
            </div>

            {/* CAMPO */}
            <div className="flex-1 relative bg-zinc-900 overflow-hidden" ref={arenaRef} style={{ touchAction: 'none' }}>
              <img src={STADIUM_BG} alt="Estádio" className="absolute inset-0 w-full h-full object-cover opacity-75" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 z-30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="px-2.5 py-1 bg-black/80 backdrop-blur rounded-md border border-yellow-400/40">
                    <span className="text-yellow-400 text-[9px] md:text-[10px] font-black tracking-widest italic">{formation}</span>
                  </div>
                  {teamOvr > 0 && (
                    <div className="px-2.5 py-1 bg-yellow-400 text-black rounded-md font-black tabular-nums">
                      <span className="text-[9px] md:text-[10px] tracking-widest">OVR </span>
                      <span className="text-[12px] md:text-sm">{teamOvr}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => setStep('formation')}
                  className="px-2.5 py-1 bg-black/80 backdrop-blur rounded-md border border-white/20 text-[9px] md:text-[10px] font-black tracking-wider text-white hover:border-yellow-400/50">
                  TÁTICA
                </button>
              </div>

              {/* Dica contextual — muda conforme o estado */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 px-3 py-1 backdrop-blur rounded-full border flex items-center gap-1.5"
                style={{
                  background: activeSlot
                    ? 'rgba(250,204,21,0.12)'
                    : pendingPlayer
                      ? 'rgba(34,211,238,0.10)'
                      : 'rgba(34,211,238,0.08)',
                  borderColor: activeSlot
                    ? 'rgba(250,204,21,0.4)'
                    : 'rgba(34,211,238,0.3)',
                }}>
                <span className="text-[9px] md:text-[10px] font-black tracking-wider"
                  style={{ color: activeSlot ? '#facc15' : '#67e8f9' }}>
                  {activeSlot
                    ? '⇄ TOQUE OUTRO SLOT PARA TROCAR'
                    : pendingPlayer
                      ? '👆 TOQUE UM SLOT PARA ESCALAR'
                      : '✋ ARRASTE • TOQUE PARA TROCAR'}
                </span>
              </div>

              <div className="absolute inset-0">
                {Object.entries(slotMap).map(([id, state]) => (
                  <DraggableSlot
                    key={id}
                    slotId={id}
                    state={state}
                    arenaRef={arenaRef}
                    isActive={activeSlot === id}
                    hasPending={!!pendingPlayer}
                    isDesktop={isDesktop}
                    isCaptain={state.player?.id === captainId}
                    isHero={state.player?.id === heroId}
                    onDragSettled={handleSlotDragSettled}
                    onClick={handleSlotClick}
                    getValidPhotoUrl={getValidPhotoUrl}
                  />
                ))}
              </div>

              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-50 px-3">
                <button onClick={finalizarEVoltar}
                  className="px-4 py-3 bg-zinc-900/90 border border-white/20 rounded-2xl text-[10px] md:text-xs font-black tracking-wider">
                  ← SAIR
                </button>
                <button
                  onClick={() => {
                    if (selectedPlayers.length < 11) {
                      alert(`Você precisa escalar 11 jogadores antes de seguir. Faltam ${11 - selectedPlayers.length}.`);
                      return;
                    }
                    setStep('captain');
                  }}
                  disabled={selectedPlayers.length < 11}
                  className={`flex-1 max-w-[280px] py-3 rounded-2xl text-[11px] md:text-sm font-black tracking-wider transition-all ${
                    selectedPlayers.length >= 11
                      ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-black shadow-[0_0_30px_rgba(250,204,21,0.5)] active:scale-95'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  }`}>
                  ESCOLHER LÍDERES →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'captain' && (
          <motion.div key="captain" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-b from-zinc-950 to-black overflow-auto">

            <div className="text-center mb-6 mt-4">
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ETAPA 3 DE 5</div>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-yellow-500/15 border-2 border-yellow-400 rounded-full text-yellow-400 text-sm font-black tracking-widest mb-3 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
                <span className="text-xl">👑</span> CAPITÃO
              </div>
              <h1 className="text-3xl sm:text-4xl font-black italic text-yellow-400 tracking-tighter">ESCOLHA O LÍDER</h1>
              <div className="mt-3 inline-block px-4 py-1.5 bg-yellow-400 text-black rounded-md text-xs font-black tracking-wider">
                ⚡ PONTUA 2× MAIS QUE OS OUTROS
              </div>
            </div>

            {!captainId ? (
              <>
                <p className="text-zinc-400 text-sm mb-4 text-center max-w-md">
                  Toca no jogador que você acredita que vai brilhar. Os pontos dele valem dobrado no ranking.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl pb-8">
                  {selectedPlayers.map(p => {
                    const colors = getRarityColors(p.ovr ?? 75);
                    return (
                      <motion.button key={p.id} whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setCaptainId(p.id)}
                        className="relative p-2 rounded-2xl border-2 border-white/20 hover:border-yellow-400/60 transition-all overflow-hidden"
                        style={{ background: `linear-gradient(180deg, ${colors.border}33 0%, #0a0a0a 60%)` }}>
                        <div className="flex justify-between mb-1 px-1">
                          <span className="text-base font-black text-white tabular-nums leading-none">{p.ovr}</span>
                          <span className="text-[10px] font-black tracking-wider" style={{ color: colors.border }}>{p.pos}</span>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-full aspect-[3/4] object-cover rounded-xl"
                          style={{ objectPosition: '15% center' }} />
                        <p className="text-center mt-2 font-black text-sm tracking-wide truncate">{p.short}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <button onClick={() => setStep('arena')}
                  className="text-zinc-500 hover:text-white text-xs font-black tracking-widest pb-6">← VOLTAR PARA O CAMPO</button>
              </>
            ) : (
              // PREVIEW: jogador escolhido em destaque
              (() => {
                const p = selectedPlayers.find(pl => pl.id === captainId);
                if (!p) return null;
                const colors = getRarityColors(p.ovr ?? 75);
                return (
                  <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="flex flex-col items-center w-full max-w-sm">
                    <div className="relative">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute -inset-3 rounded-3xl"
                        style={{ background: 'conic-gradient(from 0deg, #fbbf24, transparent, #fbbf24)' }} />
                      <div className="relative p-3 rounded-3xl border-4 border-yellow-400 overflow-hidden shadow-[0_0_60px_#facc15]"
                        style={{ background: `linear-gradient(180deg, ${colors.border}66 0%, #0a0a0a 70%)` }}>
                        <div className="flex justify-between mb-2 px-2">
                          <div>
                            <div className="text-3xl font-black text-white tabular-nums leading-none">{p.ovr}</div>
                            <div className="text-xs font-black tracking-wider mt-0.5" style={{ color: colors.border }}>{p.pos}</div>
                          </div>
                          <div className="text-sm font-black bg-black/60 text-white px-2 py-0.5 rounded h-fit">#{p.num}</div>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-48 h-64 object-cover rounded-xl mx-auto"
                          style={{ objectPosition: '15% center' }} />
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-3 -right-3 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center font-black text-black text-4xl shadow-[0_0_30px_#facc15] z-20">
                          C
                        </motion.div>
                        <div className="text-center mt-3">
                          <div className="text-yellow-400 text-[10px] font-black tracking-[3px] mb-1">SEU CAPITÃO</div>
                          <div className="text-2xl font-black italic">{p.short}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2 mt-5 mb-5 text-center">
                      <span className="text-yellow-300 text-xs font-black tracking-wider">
                        ⚡ Os pontos de <span className="text-yellow-400">{p.short}</span> valerão <span className="text-yellow-400">2×</span>
                      </span>
                    </div>

                    <div className="flex gap-3 w-full">
                      <button onClick={() => setCaptainId(null)}
                        className="flex-1 py-4 bg-zinc-900 border-2 border-white/15 rounded-2xl text-xs font-black tracking-wider hover:border-white/30">
                        ← TROCAR
                      </button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep('hero')}
                        className="flex-[2] py-4 bg-gradient-to-r from-yellow-400 to-amber-400 text-black rounded-2xl text-sm font-black tracking-wider shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                        CONFIRMAR CAPITÃO →
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })()
            )}
          </motion.div>
        )}

        {step === 'hero' && (
          <motion.div key="hero" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-b from-zinc-950 to-black overflow-auto">

            <div className="text-center mb-6 mt-4">
              <div className="text-cyan-400 text-xs font-black tracking-[6px] mb-2">ETAPA 4 DE 5</div>
              <div className="inline-flex items-center gap-2 px-5 py-2 bg-cyan-400/15 border-2 border-cyan-400 rounded-full text-cyan-400 text-sm font-black tracking-widest mb-3 shadow-[0_0_25px_rgba(34,211,238,0.3)]">
                <span className="text-xl">🔥</span> HERÓI DA PARTIDA
              </div>
              <h1 className="text-3xl sm:text-4xl font-black italic text-cyan-400 tracking-tighter">QUEM VAI DECIDIR?</h1>
              <div className="mt-3 inline-block px-4 py-1.5 bg-cyan-400 text-black rounded-md text-xs font-black tracking-wider">
                ⚡ +50% DE BÔNUS SE MARCAR OU DAR ASSISTÊNCIA
              </div>
              {captainId && (
                <div className="mt-3 text-[11px] text-zinc-500">
                  Capitão: <span className="text-yellow-400 font-black">👑 {selectedPlayers.find(p => p.id === captainId)?.short}</span>
                </div>
              )}
            </div>

            {!heroId ? (
              <>
                <p className="text-zinc-400 text-sm mb-4 text-center max-w-md">
                  Aposte no jogador que vai resolver o jogo (não pode ser o capitão).
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl pb-8">
                  {selectedPlayers.filter(p => p.id !== captainId).map(p => {
                    const colors = getRarityColors(p.ovr ?? 75);
                    return (
                      <motion.button key={p.id} whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}
                        onClick={() => setHeroId(p.id)}
                        className="relative p-2 rounded-2xl border-2 border-white/20 hover:border-cyan-400/60 transition-all overflow-hidden"
                        style={{ background: `linear-gradient(180deg, ${colors.border}33 0%, #0a0a0a 60%)` }}>
                        <div className="flex justify-between mb-1 px-1">
                          <span className="text-base font-black text-white tabular-nums leading-none">{p.ovr}</span>
                          <span className="text-[10px] font-black tracking-wider" style={{ color: colors.border }}>{p.pos}</span>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-full aspect-[3/4] object-cover rounded-xl"
                          style={{ objectPosition: '15% center' }} />
                        <p className="text-center mt-2 font-black text-sm tracking-wide truncate">{p.short}</p>
                      </motion.button>
                    );
                  })}
                </div>
                <button onClick={() => setStep('captain')}
                  className="text-zinc-500 hover:text-white text-xs font-black tracking-widest pb-6">← TROCAR CAPITÃO</button>
              </>
            ) : (
              (() => {
                const p = selectedPlayers.find(pl => pl.id === heroId);
                if (!p) return null;
                const colors = getRarityColors(p.ovr ?? 75);
                return (
                  <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                    className="flex flex-col items-center w-full max-w-sm">
                    <div className="relative">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        className="absolute -inset-3 rounded-3xl"
                        style={{ background: 'conic-gradient(from 0deg, #22d3ee, transparent, #22d3ee)' }} />
                      <div className="relative p-3 rounded-3xl border-4 border-cyan-400 overflow-hidden shadow-[0_0_60px_#22d3ee]"
                        style={{ background: `linear-gradient(180deg, ${colors.border}66 0%, #0a0a0a 70%)` }}>
                        <div className="flex justify-between mb-2 px-2">
                          <div>
                            <div className="text-3xl font-black text-white tabular-nums leading-none">{p.ovr}</div>
                            <div className="text-xs font-black tracking-wider mt-0.5" style={{ color: colors.border }}>{p.pos}</div>
                          </div>
                          <div className="text-sm font-black bg-black/60 text-white px-2 py-0.5 rounded h-fit">#{p.num}</div>
                        </div>
                        <img src={getValidPhotoUrl(p.foto)} alt={p.short}
                          className="w-48 h-64 object-cover rounded-xl mx-auto"
                          style={{ objectPosition: '15% center' }} />
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -top-3 -right-3 w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center font-black text-black text-4xl shadow-[0_0_30px_#22d3ee] z-20">
                          H
                        </motion.div>
                        <div className="text-center mt-3">
                          <div className="text-cyan-400 text-[10px] font-black tracking-[3px] mb-1">SEU HERÓI</div>
                          <div className="text-2xl font-black italic">{p.short}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-400/10 border border-cyan-400/30 rounded-xl px-4 py-2 mt-5 mb-3 text-center">
                      <span className="text-cyan-300 text-xs font-black tracking-wider">
                        ⚡ <span className="text-cyan-400">{p.short}</span> ganha bônus de <span className="text-cyan-400">+50%</span>
                      </span>
                    </div>

                    {/* Recap dos 2 líderes */}
                    <div className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 mb-4 flex items-center justify-around">
                      <div className="text-center">
                        <div className="text-yellow-400 text-[10px] font-black tracking-wider">👑 CAPITÃO</div>
                        <div className="text-sm font-black">{selectedPlayers.find(pl => pl.id === captainId)?.short}</div>
                      </div>
                      <div className="w-px h-8 bg-white/15" />
                      <div className="text-center">
                        <div className="text-cyan-400 text-[10px] font-black tracking-wider">🔥 HERÓI</div>
                        <div className="text-sm font-black">{p.short}</div>
                      </div>
                    </div>

                    <div className="flex gap-3 w-full">
                      <button onClick={() => setHeroId(null)}
                        className="flex-1 py-4 bg-zinc-900 border-2 border-white/15 rounded-2xl text-xs font-black tracking-wider hover:border-white/30">
                        ← TROCAR
                      </button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setStep('palpite')}
                        className="flex-[2] py-4 bg-gradient-to-r from-cyan-400 to-cyan-300 text-black rounded-2xl text-sm font-black tracking-wider shadow-[0_0_30px_rgba(34,211,238,0.5)]">
                        CONFIRMAR HERÓI →
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })()
            )}
          </motion.div>
        )}

        {step === 'palpite' && (() => {
          const { diaSemana, dataFmt, horario } = formatJogoInfo();
          const mandSlug      = jogoData?.mandanteSlug  ?? propMandanteSlug;
          const visitSlug     = jogoData?.visitanteSlug ?? propVisitanteSlug;
          const mandanteNome  = slugToNome(mandSlug);
          const visitanteNome = slugToNome(visitSlug);
          const mandanteLogo  = slugToLogo(mandSlug);
          const visitanteLogo = slugToLogo(visitSlug);
          const novoIsMand    = (mandSlug ?? '').includes('novorizontino');

          // Cores LED — espelho do JumbotronJogo
          const CL = { gold: '#F5C400', cyan: '#00F3FF', white: '#FFFFFF', red: '#FF2244', green: '#00FF88' };
          const emissive = (color: string, strong = false): React.CSSProperties => ({
            color,
            textShadow: strong
              ? `0.4px 0 0 ${CL.red}44, -0.4px 0 0 ${CL.cyan}44, 0 0 3px ${color}, 0 0 9px ${color}cc, 0 1px 2px rgba(0,0,0,.55)`
              : `0 0 3px ${color}, 0 0 7px ${color}aa, 0 1px 1px rgba(0,0,0,.45)`,
          });

          const resultado = palpiteMandante > palpiteVisitante
            ? { label: `🏆 VITÓRIA DO ${mandanteNome.split(' ')[0].toUpperCase()}`, color: CL.green }
            : palpiteMandante < palpiteVisitante
            ? { label: `💀 VITÓRIA DO ${visitanteNome.split(' ')[0].toUpperCase()}`, color: CL.red }
            : { label: '🤝 EMPATE', color: '#a1a1aa' };

          const tickerTxt = `${jogoData?.competicao ?? 'SÉRIE B'} · RODADA ${jogoData?.rodada ?? '—'} · ${mandanteNome} × ${visitanteNome} · `;

          const ScoreBtn = ({ onClick, children, color }: { onClick: () => void; children: React.ReactNode; color: string }) => (
            <motion.button whileTap={{ scale: 0.75 }} onClick={onClick}
              style={{ width: 48, height: 48, borderRadius: 12, background: `${color}14`, border: `1.5px solid ${color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 900, fontSize: 24, lineHeight: 1, cursor: 'pointer' }}>
              {children}
            </motion.button>
          );

          return (
            <motion.div key="palpite" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col bg-[#070707] overflow-auto">

              {/* ════ TELÃO LED ════ */}
              <div className="palpite-board" style={{ fontFamily: "'Barlow Condensed','Barlow',system-ui,sans-serif" }}>
                <div className="palpite-screen">

                  {/* bloom emissivo de fundo */}
                  <div className="palpite-bloom" style={{ background:
                    `radial-gradient(60% 70% at 28% 45%, ${novoIsMand ? CL.gold : CL.cyan}1e, transparent 65%),
                     radial-gradient(60% 70% at 72% 45%, ${novoIsMand ? CL.cyan : CL.gold}1e, transparent 65%)` }} />

                  <div className="relative z-20">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid #ffffff14' }}>
                      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.28em', ...emissive(CL.green) }}>
                        ⚡ SEU PALPITE
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.2em', ...emissive(CL.gold) }}>
                        R{jogoData?.rodada ?? '—'} · {jogoData?.competicao ?? 'SÉRIE B'}
                      </span>
                    </div>

                    {/* Confronto — logo | stepper | logo */}
                    <div className="flex items-stretch justify-between px-3 pt-5 pb-3 gap-2">

                      {/* MANDANTE */}
                      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <img src={mandanteLogo} alt={mandanteNome}
                          style={{ width: 80, height: 80, objectFit: 'contain', filter: `brightness(1.15) contrast(1.1) saturate(1.2) drop-shadow(0 0 14px ${novoIsMand ? CL.gold : CL.white}55)` }}
                          onError={e => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />
                        <div className="text-center font-black uppercase leading-none"
                          style={{ fontSize: 'clamp(15px,4vw,22px)', ...emissive(novoIsMand ? CL.gold : CL.white, novoIsMand) }}>
                          {mandanteNome}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#ffffff55' }}>MANDANTE</div>
                      </div>

                      {/* PLACAR EDITÁVEL */}
                      <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-1">
                        {/* Botões + */}
                        <div className="flex items-center gap-3 mb-1">
                          <ScoreBtn onClick={() => setPalpiteMandante(v => v + 1)} color={novoIsMand ? CL.gold : CL.white}>+</ScoreBtn>
                          <div style={{ width: 28 }} />
                          <ScoreBtn onClick={() => setPalpiteVisitante(v => v + 1)} color={novoIsMand ? CL.white : CL.gold}>+</ScoreBtn>
                        </div>

                        {/* Números */}
                        <div className="flex items-center gap-2">
                          <div style={{ width: 56, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                            <AnimatePresence mode="popLayout">
                              <motion.span key={palpiteMandante}
                                initial={{ y: -35, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 35, opacity: 0 }}
                                transition={{ type: 'spring', damping: 14, stiffness: 300 }}
                                className="absolute tabular-nums font-black italic"
                                style={{ fontSize: 'clamp(52px,14vw,80px)', lineHeight: 0.85, ...emissive(novoIsMand ? CL.gold : CL.white, true) }}>
                                {palpiteMandante}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                          <span className="font-black italic" style={{ fontSize: 'clamp(28px,7vw,44px)', color: '#ffffff30', lineHeight: 1 }}>:</span>
                          <div style={{ width: 56, height: 72, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                            <AnimatePresence mode="popLayout">
                              <motion.span key={palpiteVisitante}
                                initial={{ y: -35, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 35, opacity: 0 }}
                                transition={{ type: 'spring', damping: 14, stiffness: 300 }}
                                className="absolute tabular-nums font-black italic"
                                style={{ fontSize: 'clamp(52px,14vw,80px)', lineHeight: 0.85, ...emissive(novoIsMand ? CL.white : CL.gold, true) }}>
                                {palpiteVisitante}
                              </motion.span>
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Botões − */}
                        <div className="flex items-center gap-3 mt-1">
                          <ScoreBtn onClick={() => setPalpiteMandante(v => Math.max(0, v - 1))} color="#52525b">−</ScoreBtn>
                          <div style={{ width: 28 }} />
                          <ScoreBtn onClick={() => setPalpiteVisitante(v => Math.max(0, v - 1))} color="#52525b">−</ScoreBtn>
                        </div>

                        {/* Data / hora */}
                        {diaSemana && (
                          <div className="text-center mt-2">
                            <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.15em', color: '#ffffff60' }}>{diaSemana} · {dataFmt}</div>
                            <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', ...emissive(CL.gold) }}>{horario}</div>
                          </div>
                        )}
                      </div>

                      {/* VISITANTE */}
                      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
                        <img src={visitanteLogo} alt={visitanteNome}
                          style={{ width: 80, height: 80, objectFit: 'contain', filter: `brightness(1.15) contrast(1.1) saturate(1.2) drop-shadow(0 0 14px ${novoIsMand ? CL.white : CL.gold}55)` }}
                          onError={e => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />
                        <div className="text-center font-black uppercase leading-none"
                          style={{ fontSize: 'clamp(15px,4vw,22px)', ...emissive(novoIsMand ? CL.white : CL.gold, !novoIsMand) }}>
                          {visitanteNome}
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.2em', color: '#ffffff55' }}>VISITANTE</div>
                      </div>
                    </div>

                    {/* Resultado badge */}
                    <div className="flex justify-center pb-3">
                      <motion.div key={resultado.label} initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        style={{ padding: '6px 20px', borderRadius: 99, fontSize: 10, fontWeight: 900, letterSpacing: '0.25em', ...emissive(resultado.color), border: `1px solid ${resultado.color}44`, background: `${resultado.color}0d` }}>
                        {resultado.label}
                      </motion.div>
                    </div>

                    {/* Ticker */}
                    <div className="palpite-ticker-wrap">
                      <div className="palpite-ticker" style={{ color: CL.gold }}>
                        <span>{tickerTxt}{tickerTxt}{tickerTxt}</span>
                        <span>{tickerTxt}{tickerTxt}{tickerTxt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Overlays LED */}
                  <div className="palpite-bloom-front" />
                  <div className="palpite-grid" />
                  <div className="palpite-modules" />
                  <div className="palpite-scan" />
                  <div className="palpite-flicker" />
                  <div className="palpite-sweep" />
                  <div className="palpite-vignette" />
                  <div className="palpite-bezel" style={{ boxShadow: `inset 0 0 0 2px ${CL.gold}33, inset 0 0 40px ${CL.gold}1a, 0 0 50px ${CL.gold}26` }} />
                </div>
              </div>

              {/* ════ AÇÕES (fora do telão) ════ */}
              <div className="px-4 pt-4 pb-6 flex flex-col items-center gap-3">

                {/* Bônus */}
                <div className="w-full max-w-sm flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{ background: 'rgba(245,196,0,0.05)', border: '1px solid rgba(245,196,0,0.18)' }}>
                  <span style={{ fontSize: 20 }}>🎯</span>
                  <div>
                    <div className="text-yellow-400 text-[10px] font-black tracking-widest">PLACAR EXATO</div>
                    <div className="text-yellow-400/50 text-[9px] font-bold tracking-wider">+15 PONTOS BÔNUS SE ACERTAR</div>
                  </div>
                </div>

                {/* CTA */}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                  onClick={generateFinalImage} disabled={isGenerating}
                  className="w-full max-w-sm py-5 relative overflow-hidden rounded-2xl font-black text-sm tracking-[0.3em] uppercase disabled:opacity-50"
                  style={{ background: `linear-gradient(90deg, ${CL.gold}, #ffe04d)`, color: '#0a0a0a', boxShadow: `0 8px 30px ${CL.gold}40` }}>
                  <motion.span className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }}
                    animate={{ x: ['-120%', '220%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
                  <span className="relative">{isGenerating ? '⏳ GERANDO...' : '⚡ CONFIRMAR ESCALAÇÃO →'}</span>
                </motion.button>

                <button onClick={() => setStep('hero')}
                  className="text-zinc-700 hover:text-zinc-400 text-[10px] font-black tracking-[3px] uppercase transition-colors">
                  ← TROCAR HERÓI
                </button>
              </div>

              {/* CSS LED — espelho exato do JumbotronJogo */}
              <style jsx>{`
                .palpite-board {
                  position: relative; width: 100%; margin: 0 auto;
                  background: linear-gradient(145deg, #141414, #050505 60%);
                  padding: 10px;
                  box-shadow: 0 24px 60px rgba(0,0,0,.7), inset 0 0 0 1px #ffffff0d;
                }
                .palpite-screen {
                  position: relative; width: 100%; border-radius: 16px; overflow: hidden;
                  background: #04060a; isolation: isolate;
                }
                .palpite-bloom       { position:absolute; inset:0; z-index:5;  pointer-events:none; filter: blur(28px); }
                .palpite-bloom-front { position:absolute; inset:0; z-index:24; pointer-events:none;
                  background: radial-gradient(120% 60% at 50% 40%, transparent 55%, rgba(0,0,0,.35) 100%); }
                .palpite-grid {
                  position:absolute; inset:0; z-index:30; pointer-events:none;
                  background-image: radial-gradient(circle at center, rgba(0,0,0,0) 2.1px, rgba(2,4,8,.24) 2.5px);
                  background-size: 5px 5px; mix-blend-mode: multiply;
                }
                .palpite-modules {
                  position:absolute; inset:0; z-index:31; pointer-events:none;
                  background-image:
                    repeating-linear-gradient(0deg,  transparent 0 47px, rgba(0,0,0,.12) 47px 48px),
                    repeating-linear-gradient(90deg, transparent 0 47px, rgba(0,0,0,.12) 47px 48px);
                }
                .palpite-scan {
                  position:absolute; inset:0; z-index:31; pointer-events:none;
                  background-image: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,.03) 2px 3px);
                }
                .palpite-flicker {
                  position:absolute; inset:0; z-index:32; pointer-events:none; background:#fff;
                  mix-blend-mode: overlay; animation: pFlicker 3.5s steps(2,end) infinite; opacity:.04;
                }
                .palpite-sweep {
                  position:absolute; left:0; right:0; top:0; height:45%; z-index:33; pointer-events:none;
                  background: linear-gradient(180deg, transparent, rgba(255,255,255,.05) 44%, rgba(255,255,255,.11) 50%, rgba(255,255,255,.05) 56%, transparent);
                  mix-blend-mode: screen; animation: pSweep 5.5s linear infinite;
                }
                .palpite-vignette {
                  position:absolute; inset:0; z-index:34; pointer-events:none;
                  background: radial-gradient(ellipse at center, transparent 72%, rgba(0,0,0,.24) 100%);
                }
                .palpite-bezel { position:absolute; inset:0; z-index:35; border-radius:16px; pointer-events:none; }
                .palpite-ticker-wrap {
                  position:relative; overflow:hidden; border-top:1px solid #ffffff14; border-bottom:1px solid #ffffff14;
                  background: rgba(0,0,0,.45); padding: 5px 0;
                }
                .palpite-ticker {
                  display:inline-flex; white-space:nowrap; font-weight:900; letter-spacing:.18em;
                  font-size:11px; animation: pTicker 26s linear infinite;
                  text-shadow: 0 0 6px currentColor, 0 0 14px currentColor;
                }
                @keyframes pSweep   { 0%{transform:translateY(-110%)} 100%{transform:translateY(230%)} }
                @keyframes pTicker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
                @keyframes pFlicker {
                  0%,100%{opacity:.03} 10%{opacity:.07} 11%{opacity:.02} 40%{opacity:.05}
                  41%{opacity:.10} 42%{opacity:.03} 70%{opacity:.06} 71%{opacity:.02}
                }
                @media (prefers-reduced-motion: reduce) {
                  .palpite-sweep, .palpite-flicker, .palpite-ticker { animation: none; }
                }
              `}</style>
            </motion.div>
          );
        })()}

        {step === 'saving' && (
          <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center bg-zinc-950 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"><img src={STADIUM_BG} alt="" className="w-full h-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
            <div className="relative z-10 flex flex-col items-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full mb-6" />
              <div className="text-yellow-400 text-xs font-black tracking-[6px] mb-2">ARENA TIGRE FC</div>
              <div className="text-white text-2xl font-black italic">SALVANDO SUA ESCALAÇÃO...</div>
              <div className="text-zinc-500 text-sm mt-3">Computando no ranking 🏆</div>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-start p-4 bg-black overflow-auto">

            {/* Status de salvamento + erros */}
            <div className="w-full max-w-[380px] mb-3 mt-2">
              {hadSaved && !saveError && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-500/15 border border-green-500/40 rounded-xl">
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="text-green-400 text-[10px] font-black tracking-widest">ESCALAÇÃO SALVA NO RANKING</span>
                </div>
              )}
              {saveError && (
                <div className="px-3 py-2 bg-red-500/15 border border-red-500/40 rounded-xl">
                  <p className="text-red-400 text-[10px] font-bold leading-snug">{saveError}</p>
                </div>
              )}
            </div>

            {/* ════════════════════════════════════════════════════════════
                CARD 9:16 FIFA 26 — LIMPO, JOGADORES BEM DISTRIBUÍDOS
            ════════════════════════════════════════════════════════════ */}
            <div className="relative w-full max-w-[380px]">
              <div ref={finalCardRef}
                className="relative w-full bg-black rounded-3xl overflow-hidden"
                style={{
                  aspectRatio: '9 / 16',
                  border: '2px solid rgba(245,196,0,0.35)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(245,196,0,0.2)',
                }}>

                {/* BG: campo do estádio em escala vertical */}
                <img src={STADIUM_BG} alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: 'center' }} />

                {/* Vinheta cinematográfica — claro no centro, escuro nas pontas */}
                <div className="absolute inset-0" style={{
                  background: `
                    linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 18%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.45) 80%, rgba(0,0,0,0.95) 100%),
                    radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)
                  `,
                }} />

                {/* Glow lateral dourado discreto */}
                <div className="absolute inset-y-0 left-0 w-12 pointer-events-none" style={{
                  background: 'linear-gradient(90deg, rgba(245,196,0,0.18), transparent)',
                }} />
                <div className="absolute inset-y-0 right-0 w-12 pointer-events-none" style={{
                  background: 'linear-gradient(270deg, rgba(0,243,255,0.15), transparent)',
                }} />

                {/* ═══════════════ HEADER (0-12%) ═══════════════ */}
                <div className="absolute top-0 left-0 right-0 px-5 pt-5 z-20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      {userAvatar && (
                        <img src={userAvatar} alt={userName} crossOrigin="anonymous"
                          className="w-10 h-10 rounded-full object-cover"
                          style={{
                            border: '2px solid #F5C400',
                            boxShadow: '0 0 12px rgba(245,196,0,0.5)',
                          }}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                      )}
                      <div className="leading-none">
                        <div className="text-[9px] font-black tracking-[3px] text-[#F5C400]">⚡ TIGRE FC</div>
                        <div className="text-[15px] font-black italic mt-1 text-white">@{userName}</div>
                      </div>
                    </div>

                    {/* OVR card FUT — limpo, sem segundo badge */}
                    <div className="relative">
                      <div className="text-center px-3 py-1.5 rounded-xl"
                        style={{
                          background: 'linear-gradient(135deg, #fde68a 0%, #F5C400 50%, #b45309 100%)',
                          boxShadow: '0 0 20px rgba(245,196,0,0.6), inset 0 1px 0 rgba(255,255,255,0.4)',
                        }}>
                        <div className="text-[8px] font-black tracking-[3px] text-black/70 leading-none">OVR</div>
                        <div className="text-2xl font-black italic tabular-nums leading-none mt-0.5 text-black">
                          {teamOvr}
                        </div>
                      </div>
                      <div className="text-center text-[8px] tracking-[3px] font-black text-white/80 mt-1 italic">
                        {formation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══════════════ CAMPO (12-72%) ═══════════════
                    JOGADORES BEM DISTRIBUÍDOS:
                    Mapeamento: y do campo (0-100%) → faixa do card (12-72%)
                    Fórmula: cardY = 12 + (state.y / 100) * 60
                ═══════════════════════════════════════════════════ */}
                <div className="absolute inset-0 pointer-events-none">
                  {Object.entries(slotMap).map(([id, state]) => state.player && (
                    <div key={id}
                      style={{
                        left: `${state.x}%`,
                        top: `${6 + (state.y / 100) * 66}%`,
                        position: 'absolute',
                        transform: 'translate(-50%, -50%)',
                      }}
                      className="w-[52px]">

                      {/* Mini card FUT — sombra projetada no gramado */}
                      <div className="relative">
                        {/* Sombra circular embaixo do card pra dar peso */}
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-10 h-2 rounded-full blur-sm"
                          style={{ background: 'rgba(0,0,0,0.6)' }} />

                        <div className="relative h-[68px] rounded-md overflow-hidden"
                          style={{
                            border: state.player.id === captainId
                              ? '2px solid #F5C400'
                              : state.player.id === heroId
                                ? '2px solid #00F3FF'
                                : '1.5px solid rgba(255,255,255,0.85)',
                            boxShadow: state.player.id === captainId
                              ? '0 0 18px rgba(245,196,0,0.85), 0 4px 8px rgba(0,0,0,0.7)'
                              : state.player.id === heroId
                                ? '0 0 18px rgba(0,243,255,0.85), 0 4px 8px rgba(0,0,0,0.7)'
                                : '0 4px 10px rgba(0,0,0,0.7)',
                          }}>
                          <img src={getValidPhotoUrl(state.player.foto)} alt={state.player.short}
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: '85% center' }} />

                          {/* Faixa de nome — colorida pra C/H */}
                          <div className="absolute bottom-0 left-0 right-0 py-0.5"
                            style={{
                              background: state.player.id === captainId
                                ? 'linear-gradient(180deg, transparent, #F5C400 60%)'
                                : state.player.id === heroId
                                  ? 'linear-gradient(180deg, transparent, #00F3FF 60%)'
                                  : 'linear-gradient(180deg, transparent, rgba(0,0,0,0.95) 60%)',
                            }}>
                            <span className="text-[8px] font-black block text-center leading-tight"
                              style={{
                                color: (state.player.id === captainId || state.player.id === heroId) ? '#000' : '#fff',
                              }}>
                              {state.player.short}
                            </span>
                          </div>
                        </div>

                        {/* Selo C ou H — flutuando no canto, fora do card */}
                        {(state.player.id === captainId || state.player.id === heroId) && (
                          <div className="absolute -top-2 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black z-30"
                            style={{
                              background: state.player.id === captainId ? '#F5C400' : '#00F3FF',
                              color: '#000',
                              border: '1.5px solid #000',
                              boxShadow: state.player.id === captainId
                                ? '0 0 10px rgba(245,196,0,0.9)'
                                : '0 0 10px rgba(0,243,255,0.9)',
                            }}>
                            {state.player.id === captainId ? 'C' : 'H'}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ═══════════════ FAIXA INFERIOR (72-100%) ═══════════════ */}

                {/* Linha divisória dourada */}
                <div className="absolute left-6 right-6 z-10"
                  style={{
                    top: '74%',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.4), transparent)',
                  }} />

                {/* Placar — único e dominante */}
                <div className="absolute left-0 right-0 z-20" style={{ top: '77%' }}>
                  <div className="flex items-center justify-center gap-4">
                    {/* Logo mandante — fallback para prop SSR quando jogoData ainda é null */}
                    <img src={slugToLogo(jogoData?.mandanteSlug ?? propMandanteSlug)} alt=""
                      className="w-10 h-10 object-contain"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />

                    <div className="text-4xl font-black italic tabular-nums leading-none"
                      style={{
                        color: '#F5C400',
                        textShadow: '0 0 20px rgba(245,196,0,0.6), 0 2px 4px rgba(0,0,0,0.9)',
                      }}>
                      {palpiteMandante}
                      <span className="text-zinc-600 mx-2">×</span>
                      {palpiteVisitante}
                    </div>

                    {/* Logo visitante */}
                    <img src={slugToLogo(jogoData?.visitanteSlug ?? propVisitanteSlug)} alt=""
                      className="w-10 h-10 object-contain"
                      style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = ESCUDO_DEFAULT; }} />
                  </div>
                  <div className="text-center text-[8px] tracking-[5px] font-black text-white/40 mt-1.5">
                    SEU PALPITE
                  </div>
                </div>

                {/* Capitão & Herói — linha enxuta */}
                <div className="absolute left-6 right-6 z-20 flex justify-between" style={{ top: '90%' }}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px]">👑</span>
                    <span className="text-[10px] font-black tracking-wide text-[#F5C400] truncate max-w-[100px]">
                      {selectedPlayers.find(p => p.id === captainId)?.short ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black tracking-wide text-[#00F3FF] truncate max-w-[100px]">
                      {selectedPlayers.find(p => p.id === heroId)?.short ?? '—'}
                    </span>
                    <span className="text-[10px]">🔥</span>
                  </div>
                </div>

                {/* Marca — TIGRE FC italic minimalista */}
                <div className="absolute bottom-3 left-0 right-0 text-center z-20">
                  <div className="text-base font-black italic tracking-tight">
                    TIGRE <span style={{ color: '#F5C400' }}>FC</span>
                  </div>
                  <div className="text-[7px] tracking-[3px] text-white/30 font-bold mt-0.5">
                    onovorizontino.com.br
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  BOTÃO SALVAR — circular, glassmorphism, fora do card
                  Posição: canto inferior direito, OVERLAY do card
              ═══════════════════════════════════════════════════════════ */}
              {/* Botão download flutuante — sempre visível */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={downloadImage}
                disabled={isGenerating}
                aria-label="Salvar imagem"
                className="absolute bottom-3 right-3 w-12 h-12 rounded-full flex items-center justify-center z-30 disabled:opacity-60"
                style={{
                  background: 'rgba(20,20,20,0.7)',
                  backdropFilter: 'blur(20px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                  border: '1px solid rgba(245,196,0,0.5)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 15px rgba(245,196,0,0.3)',
                }}
              >
                {isGenerating
                  ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full" />
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="#F5C400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                }
              </motion.button>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                AÇÕES — salvar imagem + salvar ranking + compartilhar
            ═══════════════════════════════════════════════════════════ */}
            <div className="mt-5 w-full max-w-[380px] space-y-3 px-2">

              {/* 💾 Salvar imagem — sempre ativo, captura on-demand */}
              <motion.button whileTap={{ scale: 0.97 }} onClick={downloadImage}
                disabled={isGenerating}
                className="w-full py-4 font-black rounded-2xl text-sm tracking-[3px] uppercase disabled:opacity-60 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(90deg, #F5C400, #fbbf24)',
                  color: '#000',
                  boxShadow: '0 8px 24px rgba(245,196,0,0.3)',
                }}>
                {isGenerating
                  ? <><motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                    GERANDO...</>
                  : '💾 SALVAR IMAGEM'
                }
              </motion.button>

              {/* Salvar escalação no ranking (explícito) */}
              {!hadSaved && (
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveToRanking} disabled={isSavingDb}
                  className="w-full py-4 font-black rounded-2xl text-sm tracking-[3px] uppercase disabled:opacity-60"
                  style={{
                    background: 'rgba(0,243,255,0.12)',
                    border: '1px solid rgba(0,243,255,0.4)',
                    color: '#00F3FF',
                  }}>
                  {isSavingDb ? 'SALVANDO...' : '🏆 SALVAR NO RANKING'}
                </motion.button>
              )}

              {/* Compartilhar escalação pré-jogo (depois de salvar) */}
              {hadSaved && (
                <CompartilharEscalacao
                  jogadores={selectedPlayers.map(p => ({
                    id: p.id, nome: p.name, apelido: p.short, foto: p.foto ?? '', pos: p.pos,
                  }))}
                  capitaoId={captainId}
                  heroiId={heroId}
                  formacao={formation}
                  adversario={slugToNome(jogoData?.visitanteSlug ?? propVisitanteSlug)}
                  nomeUsuario={userName}
                />
              )}

              {/* Compartilhar */}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={shareWhatsApp}
                  className="min-h-[48px] py-3 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all active:scale-95"
                  style={{
                    background: 'rgba(37,211,102,0.12)',
                    border: '1px solid rgba(37,211,102,0.4)',
                    color: '#25D366',
                  }}>
                  WhatsApp
                </button>
                <button onClick={shareInstagram}
                  className="min-h-[48px] py-3 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all active:scale-95"
                  style={{
                    background: 'rgba(225,48,108,0.12)',
                    border: '1px solid rgba(225,48,108,0.4)',
                    color: '#E1306C',
                  }}>
                  Instagram
                </button>
                <button onClick={shareX}
                  className="min-h-[48px] py-3 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all active:scale-95"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                  }}>
                  𝕏
                </button>
              </div>

              {/* Navegação */}
              <div className="flex items-center justify-between pt-3">
                <button onClick={() => setStep('palpite')}
                  className="text-zinc-500 hover:text-white text-[10px] font-black tracking-[2px] uppercase">
                  ← Editar
                </button>
                <button onClick={finalizarEVoltar}
                  className="text-zinc-500 hover:text-[#F5C400] text-[10px] font-black tracking-[2px] uppercase">
                  Arena →
                </button>
              </div>

              {/* Voltar para home — botão explícito no rodapé do card final */}
              <button onClick={() => router.push('/tigre-fc')}
                className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl border border-white/10 py-3.5 text-[11px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-yellow-500/30 hover:text-yellow-400 active:scale-95">
                ← Voltar para a arena
              </button>
            </div>
            <div className="h-8" />
          </motion.div>
        )}

      </AnimatePresence>

      {/* Modal WhatsApp — aparece após o primeiro save */}
      <AnimatePresence>
        {showWaModal && tfcUserId && (
          <WhatsAppCaptureModal
            usuarioId={tfcUserId}
            onClose={() => { setShowWaModal(false); setWaSolicitado(true); }}
          />
        )}
      </AnimatePresence>

      {/* Modal de login — aparece quando tenta salvar sem estar autenticado */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-[400] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}>
            <motion.div
              className="w-full max-w-sm rounded-3xl overflow-hidden"
              style={{ background: 'linear-gradient(180deg,#141414 0%,#0d0d0d 100%)', border: '1px solid rgba(245,196,0,0.25)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
              initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={e => e.stopPropagation()}>
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#F5C400,#fbbf24,#F5C400)' }} />
              <div className="p-7 text-center">
                <div className="text-5xl mb-4">🐯</div>
                <h3 className="text-white font-black text-xl mb-2">Faça login para salvar</h3>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Entre com o Google para salvar sua escalação no ranking e competir com os outros torcedores.
                </p>
                <button
                  onClick={() => { supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } }); }}
                  className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3"
                  style={{ background: 'linear-gradient(90deg,#F5C400,#f59e0b)', color: '#000' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                  Entrar com Google
                </button>
                <button onClick={() => setShowLoginModal(false)} className="mt-3 w-full py-2.5 text-zinc-600 text-xs font-bold hover:text-zinc-400 transition-colors">
                  Continuar montando
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {hadSaved && step === 'arena' && (
        <motion.button initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={verEscalacaoSalva}
          className="fixed top-3 right-3 z-[200] bg-cyan-400 text-black px-3 py-2 rounded-full font-black text-[10px] tracking-widest shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95">
          📸 VER ARTE
        </motion.button>
      )}
    </div>
  );
}
