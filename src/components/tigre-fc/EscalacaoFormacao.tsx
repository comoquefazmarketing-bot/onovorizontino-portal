'use client';

/**
 * EscalacaoFormacao — Orquestrador Tigre FC
 * ═══════════════════════════════════════════════════════════════════════════
 * Substitui em src/components/tigre-fc/EscalacaoFormacao.tsx
 *
 * Fluxo de 5 etapas com estado unificado:
 *   1. formation  → escolha tática
 *   2. arena      → escalação dos 11 (campo + mercado)
 *   3. leaders    → capitão (×2 pts) + herói (+10 pts)
 *   4. prediction → palpite de placar
 *   5. reveal     → card final compartilhável
 *
 * Correções aplicadas:
 *   - Estado unificado, dados não somem entre etapas
 *   - Fallback em CASCATA pra fotos: tenta .jpg.webp → .webp → .jpg → .png → escudo
 *   - object-position 95% center → foco no rosto da foto dupla
 *   - encodeURIComponent em todas as URLs (CARLÃO, ALVARÍÑO, HÉLIO, SANDER (1))
 *   - crossOrigin="anonymous" em todas as <img> (pra html-to-image não dar SecurityError)
 *   - Self-contained: não depende de Palpite.tsx / FinalCardReveal.tsx existirem
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════════════════════

const BASE_STORAGE =
  'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO =
  'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STADIUM_BG =
  'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';

// ═════════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════════

interface Player {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA' | 'TEC';
  foto: string;
}

interface Slot {
  id: string;
  x: number;       // % horizontal
  y: number;       // % vertical
  posHint: string; // posição preferida no slot (informativo)
}

type Step = 'formation' | 'arena' | 'leaders' | 'prediction' | 'reveal';
type LeaderRole = 'CAPTAIN' | 'HERO';

interface EscalacaoProps {
  jogoId?: number | string;
}

// ═════════════════════════════════════════════════════════════════════════════
// PLAYER DATA — elenco atual do Tigre
// ═════════════════════════════════════════════════════════════════════════════

const PLAYERS_DATA: Player[] = [
  // GOLEIROS
  { id: 23, name: 'Jordi Martins',     short: 'JORDI',     num: 93, pos: 'GOL', foto: 'JORDI.png'                  },
  { id: 1,  name: 'César',             short: 'CÉSAR',     num: 31, pos: 'GOL', foto: 'CESAR-AUGUSTO.jpg.webp'     },
  { id: 22, name: 'João Scapin',       short: 'SCAPIN',    num: 12, pos: 'GOL', foto: 'JOAO-SCAPIN.jpg.webp'       },
  { id: 62, name: 'Lucas',             short: 'LUCAS',     num: 1,  pos: 'GOL', foto: 'LUCAS.jpg.webp'             },

  // ZAGUEIROS
  { id: 8,  name: 'Patrick',           short: 'PATRICK',   num: 4,  pos: 'ZAG', foto: 'PATRICK.jpg.webp'           },
  { id: 38, name: 'Renato Palm',       short: 'R. PALM',   num: 33, pos: 'ZAG', foto: 'RENATO-PALM.jpg.webp'       },
  { id: 34, name: 'Eduardo Brock',     short: 'BROCK',     num: 14, pos: 'ZAG', foto: 'EDUARDO-BROCK.jpg.webp'     },
  { id: 66, name: 'Alexis Alvariño',   short: 'ALVARÍÑO',  num: 22, pos: 'ZAG', foto: 'ALEXIS-ALVARIÑO.jpg.webp'   },
  { id: 6,  name: 'Carlinhos',         short: 'CARLINHOS', num: 3,  pos: 'ZAG', foto: 'CARLINHOS.jpg.webp'         },
  { id: 3,  name: 'Dantas',            short: 'DANTAS',    num: 25, pos: 'ZAG', foto: 'DANTAS.jpg.webp'            },

  // LATERAIS
  { id: 9,  name: 'Sander',            short: 'SANDER',    num: 5,  pos: 'LAT', foto: 'SANDER (1).jpg'             },
  { id: 28, name: 'Maykon Jesus',      short: 'MAYKON',    num: 66, pos: 'LAT', foto: 'MAYKON-JESUS.jpg.webp'      },
  { id: 27, name: 'Nilson Castrillón', short: 'NILSON',    num: 20, pos: 'LAT', foto: 'NILSON-CASTRILLON.jpg.webp' },
  { id: 75, name: 'Jhilmar Lora',      short: 'LORA',      num: 24, pos: 'LAT', foto: 'LORA.jpg.webp'              },

  // VOLANTES
  { id: 41, name: 'Luís Oyama',        short: 'OYAMA',     num: 6,  pos: 'VOL', foto: 'LUIS-OYAMA.jpg.webp'        },
  { id: 46, name: 'Marlon',            short: 'MARLON',    num: 28, pos: 'VOL', foto: 'MARLON.jpg.webp'            },
  { id: 40, name: 'Léo Naldi',         short: 'NALDI',     num: 18, pos: 'VOL', foto: 'LÉO-NALDI.jpg.webp'         },

  // MEIAS
  { id: 47, name: 'Matheus Bianqui',   short: 'BIANQUI',   num: 17, pos: 'MEI', foto: 'MATHEUS-BIANQUI.jpg.webp'   },
  { id: 10, name: 'Rômulo',            short: 'RÔMULO',    num: 10, pos: 'MEI', foto: 'ROMULO.jpg.webp'            },
  { id: 12, name: 'Juninho',           short: 'JUNINHO',   num: 50, pos: 'MEI', foto: 'JUNINHO.jpg.webp'           },
  { id: 17, name: 'Tavinho',           short: 'TAVINHO',   num: 15, pos: 'MEI', foto: 'TAVINHO.jpg.webp'           },
  { id: 86, name: 'Christian Ortíz',   short: 'TITI ORTÍZ',num: 8,  pos: 'MEI', foto: 'CHRISTIAN-ORTÍZ.jpg.webp'   },
  { id: 13, name: 'Diego Galo',        short: 'D. GALO',   num: 19, pos: 'MEI', foto: 'DIEGO-GALO.jpg.webp'        },

  // ATACANTES
  { id: 15, name: 'Robson',            short: 'ROBSON',    num: 11, pos: 'ATA', foto: 'ROBSON.jpg.webp'            },
  { id: 59, name: 'Vinícius Paiva',    short: 'V. PAIVA',  num: 16, pos: 'ATA', foto: 'VINICIUS-PAIVA.jpg.webp'    },
  { id: 57, name: 'Ronald Barcellos',  short: 'RONALD',    num: 7,  pos: 'ATA', foto: 'RONALD-BARCELLOS.jpg.webp'  },
  { id: 55, name: 'Nicolas Careca',    short: 'CARECA',    num: 30, pos: 'ATA', foto: 'NICOLAS-CARECA.jpg.webp'    },
  { id: 50, name: 'Carlão',            short: 'CARLÃO',    num: 9,  pos: 'ATA', foto: 'CARLÃO.jpg.webp'            },
  { id: 52, name: 'Hélio Borges',      short: 'HÉLIO',     num: 41, pos: 'ATA', foto: 'HÉLIO-BORGES.jpg.webp'      },
  { id: 53, name: 'Jardiel',           short: 'JARDIEL',   num: 40, pos: 'ATA', foto: 'JARDIEL.jpg.webp'           },
  { id: 91, name: 'Hector Bianchi',    short: 'HECTOR',    num: 35, pos: 'ATA', foto: 'HECTOR-BIANCHI.jpg.webp'    },
];

// ═════════════════════════════════════════════════════════════════════════════
// FORMATIONS
// ═════════════════════════════════════════════════════════════════════════════

const FORMATIONS: Record<string, Slot[]> = {
  '4-3-3': [
    { id: 'gk',  x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb',  x: 15, y: 65, posHint: 'LAT' },
    { id: 'cb1', x: 38, y: 73, posHint: 'ZAG' },
    { id: 'cb2', x: 62, y: 73, posHint: 'ZAG' },
    { id: 'rb',  x: 85, y: 65, posHint: 'LAT' },
    { id: 'm1',  x: 50, y: 50, posHint: 'VOL' },
    { id: 'm2',  x: 28, y: 42, posHint: 'MEI' },
    { id: 'm3',  x: 72, y: 42, posHint: 'MEI' },
    { id: 'lw',  x: 18, y: 20, posHint: 'ATA' },
    { id: 'st',  x: 50, y: 14, posHint: 'ATA' },
    { id: 'rw',  x: 82, y: 20, posHint: 'ATA' },
  ],
  '4-4-2': [
    { id: 'gk',  x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb',  x: 15, y: 65, posHint: 'LAT' },
    { id: 'cb1', x: 38, y: 73, posHint: 'ZAG' },
    { id: 'cb2', x: 62, y: 73, posHint: 'ZAG' },
    { id: 'rb',  x: 85, y: 65, posHint: 'LAT' },
    { id: 'lm',  x: 15, y: 45, posHint: 'MEI' },
    { id: 'cm1', x: 38, y: 50, posHint: 'MEI' },
    { id: 'cm2', x: 62, y: 50, posHint: 'MEI' },
    { id: 'rm',  x: 85, y: 45, posHint: 'MEI' },
    { id: 'st1', x: 38, y: 17, posHint: 'ATA' },
    { id: 'st2', x: 62, y: 17, posHint: 'ATA' },
  ],
  '4-2-3-1': [
    { id: 'gk',  x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb',  x: 15, y: 65, posHint: 'LAT' },
    { id: 'cb1', x: 38, y: 73, posHint: 'ZAG' },
    { id: 'cb2', x: 62, y: 73, posHint: 'ZAG' },
    { id: 'rb',  x: 85, y: 65, posHint: 'LAT' },
    { id: 'v1',  x: 38, y: 53, posHint: 'VOL' },
    { id: 'v2',  x: 62, y: 53, posHint: 'VOL' },
    { id: 'am',  x: 50, y: 35, posHint: 'MEI' },
    { id: 'lw',  x: 18, y: 22, posHint: 'ATA' },
    { id: 'rw',  x: 82, y: 22, posHint: 'ATA' },
    { id: 'st',  x: 50, y: 12, posHint: 'ATA' },
  ],
  '3-5-2': [
    { id: 'gk',  x: 50, y: 88, posHint: 'GOL' },
    { id: 'cb1', x: 28, y: 72, posHint: 'ZAG' },
    { id: 'cb2', x: 50, y: 75, posHint: 'ZAG' },
    { id: 'cb3', x: 72, y: 72, posHint: 'ZAG' },
    { id: 'lwb', x: 10, y: 50, posHint: 'LAT' },
    { id: 'm1',  x: 32, y: 48, posHint: 'MEI' },
    { id: 'm2',  x: 50, y: 50, posHint: 'MEI' },
    { id: 'm3',  x: 68, y: 48, posHint: 'MEI' },
    { id: 'rwb', x: 90, y: 50, posHint: 'LAT' },
    { id: 'st1', x: 38, y: 17, posHint: 'ATA' },
    { id: 'st2', x: 62, y: 17, posHint: 'ATA' },
  ],
  '5-3-2': [
    { id: 'gk',  x: 50, y: 88, posHint: 'GOL' },
    { id: 'lb',  x: 12, y: 55, posHint: 'LAT' },
    { id: 'cb1', x: 30, y: 72, posHint: 'ZAG' },
    { id: 'cb2', x: 50, y: 75, posHint: 'ZAG' },
    { id: 'cb3', x: 70, y: 72, posHint: 'ZAG' },
    { id: 'rb',  x: 88, y: 55, posHint: 'LAT' },
    { id: 'm1',  x: 30, y: 42, posHint: 'MEI' },
    { id: 'm2',  x: 50, y: 48, posHint: 'MEI' },
    { id: 'm3',  x: 70, y: 42, posHint: 'MEI' },
    { id: 'st1', x: 40, y: 17, posHint: 'ATA' },
    { id: 'st2', x: 60, y: 17, posHint: 'ATA' },
  ],
  '3-4-3': [
    { id: 'gk',  x: 50, y: 88, posHint: 'GOL' },
    { id: 'cb1', x: 28, y: 72, posHint: 'ZAG' },
    { id: 'cb2', x: 50, y: 75, posHint: 'ZAG' },
    { id: 'cb3', x: 72, y: 72, posHint: 'ZAG' },
    { id: 'lm',  x: 15, y: 48, posHint: 'MEI' },
    { id: 'cm1', x: 38, y: 50, posHint: 'MEI' },
    { id: 'cm2', x: 62, y: 50, posHint: 'MEI' },
    { id: 'rm',  x: 85, y: 48, posHint: 'MEI' },
    { id: 'lw',  x: 18, y: 20, posHint: 'ATA' },
    { id: 'st',  x: 50, y: 14, posHint: 'ATA' },
    { id: 'rw',  x: 82, y: 20, posHint: 'ATA' },
  ],
};

const FORMATION_NAMES = Object.keys(FORMATIONS);

// ═════════════════════════════════════════════════════════════════════════════
// IMAGE HELPERS — fallback em cascata
// ═════════════════════════════════════════════════════════════════════════════

/** Encoda só o nome do arquivo, mantendo barras intactas. */
function encodeFilename(foto: string): string {
  if (!foto) return '';
  return foto.split('/').map(p => encodeURIComponent(p)).join('/');
}

/** Constrói a URL completa do Supabase. */
function buildPhotoUrl(foto: string): string {
  if (!foto) return ESCUDO;
  if (foto.startsWith('http')) return foto;
  return `${BASE_STORAGE}${encodeFilename(foto)}`;
}

/**
 * Gera lista de URLs candidatas pra mesma foto.
 * Tenta variações de extensão antes de cair no escudo.
 *
 * Ex.: 'CARLÃO.jpg.webp' →
 *   1. CARLÃO.jpg.webp
 *   2. CARLÃO.webp
 *   3. CARLÃO.jpg
 *   4. CARLÃO.png
 *   5. ESCUDO
 */
function buildPhotoCandidates(foto: string): string[] {
  if (!foto) return [ESCUDO];
  if (foto.startsWith('http')) return [foto, ESCUDO];

  const candidates = new Set<string>();

  // Original primeiro
  candidates.add(buildPhotoUrl(foto));

  // Detecta nome base sem extensão
  // Cobre: .jpg.webp, .png.webp, .jpeg.webp, .webp, .jpg, .png, .jpeg
  const stripped = foto
    .replace(/\.(jpg|jpeg|png)\.webp$/i, '')
    .replace(/\.(webp|jpg|jpeg|png)$/i, '');

  if (stripped !== foto) {
    candidates.add(buildPhotoUrl(`${stripped}.webp`));
    candidates.add(buildPhotoUrl(`${stripped}.jpg`));
    candidates.add(buildPhotoUrl(`${stripped}.png`));
    candidates.add(buildPhotoUrl(`${stripped}.jpeg`));
  }

  // Se acabou sem extensão (caso raro), tenta colocar
  if (!/\.[a-z0-9]+$/i.test(foto)) {
    candidates.add(buildPhotoUrl(`${foto}.webp`));
    candidates.add(buildPhotoUrl(`${foto}.jpg`));
    candidates.add(buildPhotoUrl(`${foto}.png`));
  }

  candidates.add(ESCUDO);
  return Array.from(candidates);
}

// ═════════════════════════════════════════════════════════════════════════════
// PlayerImage — img com fallback automático em cascata
// ═════════════════════════════════════════════════════════════════════════════

interface PlayerImageProps {
  player: Player;
  /** padrão '95% center' (rosto da foto dupla). Use 'center' pra fotos solo. */
  focus?: string;
  className?: string;
  style?: React.CSSProperties;
}

function PlayerImage({ player, focus = '95% center', className, style }: PlayerImageProps) {
  const candidates = useMemo(() => buildPhotoCandidates(player.foto), [player.foto]);
  const [idx, setIdx] = useState(0);

  // Reseta o índice se o jogador mudar
  useEffect(() => {
    setIdx(0);
  }, [player.id]);

  const src = candidates[Math.min(idx, candidates.length - 1)];
  const isFallback = src === ESCUDO;

  return (
    <img
      src={src}
      alt={player.short}
      crossOrigin="anonymous"
      onError={() => {
        if (idx < candidates.length - 1) setIdx(i => i + 1);
      }}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: isFallback ? 'contain' : 'cover',
        objectPosition: isFallback ? 'center' : focus,
        background: isFallback ? '#0a0a0a' : 'transparent',
        padding: isFallback ? '12%' : 0,
        ...style,
      }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FieldSlot — uma posição no campo
// ═════════════════════════════════════════════════════════════════════════════

interface FieldSlotProps {
  slot: Slot;
  player: Player | null;
  isSelected: boolean;
  isCaptain?: boolean;
  isHero?: boolean;
  onClick: () => void;
}

function FieldSlot({ slot, player, isSelected, isCaptain, isHero, onClick }: FieldSlotProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute z-10 p-0 cursor-pointer transition-all ${
        isSelected || isCaptain || isHero ? 'z-30' : ''
      }`}
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: 'translate(-50%, -50%)',
        width: 'clamp(56px, 9vw, 90px)',
        height: 'clamp(76px, 12vw, 122px)',
        background: 'transparent',
        border: 'none',
        filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))',
      }}
    >
      {(isCaptain || isHero) && (
        <div
          className="absolute -top-1 -right-1 z-[5] w-5 h-5 rounded-full flex items-center justify-center font-black text-[11px] border-2 border-black"
          style={{
            background: isCaptain ? '#F5C400' : '#00F3FF',
            color: '#000',
            boxShadow: `0 0 14px ${isCaptain ? '#F5C400' : '#00F3FF'}cc`,
          }}
        >
          {isCaptain ? 'C' : '★'}
        </div>
      )}

      <div
        className="w-full h-full rounded-xl overflow-hidden flex flex-col transition-all"
        style={{
          border: `2px solid ${
            isCaptain ? '#F5C400' :
            isHero ? '#00F3FF' :
            isSelected ? '#F5C400' :
            'rgba(255,255,255,0.3)'
          }`,
          background: player ? '#0a0a0a' : 'rgba(0,0,0,0.5)',
          boxShadow: isSelected
            ? '0 0 24px rgba(245,196,0,0.6)'
            : isCaptain
            ? '0 0 16px rgba(245,196,0,0.4)'
            : isHero
            ? '0 0 16px rgba(0,243,255,0.4)'
            : 'none',
        }}
      >
        {player ? (
          <>
            <div className="flex-1 relative overflow-hidden">
              <PlayerImage player={player} focus="95% center" />
            </div>
            <div
              className="text-center leading-none"
              style={{ background: '#F5C400', padding: '3px 2px' }}
            >
              <span
                className="block font-black uppercase text-black"
                style={{
                  fontSize: 'clamp(8px, 1.4vw, 11px)',
                  letterSpacing: '-0.02em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  padding: '0 2px',
                }}
              >
                {player.short}
              </span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
            <span className="text-2xl font-thin text-white">+</span>
            <span className="text-[7px] font-black uppercase tracking-widest text-white/60 mt-1">
              {slot.posHint}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MarketSidebar — lista filtrável de jogadores
// ═════════════════════════════════════════════════════════════════════════════

const POS_FILTERS: Array<Player['pos'] | 'TODOS'> = ['TODOS', 'GOL', 'ZAG', 'LAT', 'VOL', 'MEI', 'ATA'];

interface MarketSidebarProps {
  isPlayerEscalado: (id: number) => boolean;
  onPick: (player: Player) => void;
  hint: string;
}

function MarketSidebar({ isPlayerEscalado, onPick, hint }: MarketSidebarProps) {
  const [filter, setFilter] = useState<typeof POS_FILTERS[number]>('TODOS');

  const list = useMemo(
    () => (filter === 'TODOS' ? PLAYERS_DATA : PLAYERS_DATA.filter(p => p.pos === filter)),
    [filter]
  );

  return (
    <div className="h-full flex flex-col bg-black/85 backdrop-blur-xl">
      <div className="px-4 pt-3 pb-2 border-b border-white/5">
        <h2 className="text-lg font-black italic text-yellow-500 uppercase tracking-tighter leading-none m-0">
          MERCADO
        </h2>
        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
          {hint}
        </p>
      </div>

      <div className="flex gap-1 px-3 py-2 overflow-x-auto flex-shrink-0">
        {POS_FILTERS.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            className={`flex-shrink-0 px-2.5 py-1.5 text-[10px] font-black rounded-md transition-colors ${
              filter === p
                ? 'bg-yellow-500 text-black'
                : 'bg-white/5 text-zinc-500 hover:text-white'
            }`}
            style={{ letterSpacing: '0.08em' }}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-2.5 pb-3 flex flex-col gap-1.5">
        {list.map(player => {
          const escalado = isPlayerEscalado(player.id);
          return (
            <motion.button
              key={player.id}
              layout
              whileTap={{ scale: 0.96 }}
              onClick={() => !escalado && onPick(player)}
              disabled={escalado}
              className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all w-full text-left ${
                escalado
                  ? 'border-white/5 bg-white/[0.02] opacity-40 grayscale cursor-default'
                  : 'border-white/10 bg-white/5 hover:border-yellow-500/40 cursor-pointer'
              }`}
            >
              <div className="w-11 h-11 rounded-lg overflow-hidden border border-white/10 bg-zinc-950 flex-shrink-0">
                <PlayerImage player={player} focus="20% center" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span
                    className="text-[9px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded"
                    style={{ letterSpacing: '0.05em' }}
                  >
                    {player.pos}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-bold">#{player.num}</span>
                </div>
                <div
                  className={`text-xs font-black uppercase truncate ${escalado ? 'text-zinc-600' : 'text-white'}`}
                  style={{ letterSpacing: '-0.01em' }}
                >
                  {player.short}
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  escalado ? 'bg-green-500/15 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                }`}
              >
                {escalado ? '✓' : '+'}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LeaderPicker — modal pra escolher Capitão ou Herói
// ═════════════════════════════════════════════════════════════════════════════

interface LeaderPickerProps {
  role: LeaderRole;
  squad: Player[];
  currentId: number | null;
  onPick: (id: number) => void;
  onClose: () => void;
}

function LeaderPicker({ role, squad, currentId, onPick, onClose }: LeaderPickerProps) {
  const isCaptain = role === 'CAPTAIN';
  const accent = isCaptain ? '#F5C400' : '#00F3FF';
  const title = isCaptain ? 'CAPITÃO' : 'HERÓI';
  const subtitle = isCaptain
    ? 'Pontos dobrados (×2). Escolha o craque do dia.'
    : 'Acertou o herói da partida? +10 pts garantidos.';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[520px] flex flex-col"
        style={{
          background: 'linear-gradient(180deg,#0a0a0a 0%,#080808 100%)',
          borderRadius: '24px 24px 0 0',
          borderTop: `2px solid ${accent}`,
          maxHeight: '85vh',
          boxShadow: `0 -20px 60px ${accent}30`,
        }}
      >
        <div className="flex justify-center pt-2.5">
          <div className="w-10 h-1 rounded bg-zinc-800" />
        </div>

        <div className="px-5 pt-3 pb-4 flex items-center justify-between">
          <div>
            <div className="text-[9px] font-black uppercase mb-0.5" style={{ color: accent, letterSpacing: '0.4em' }}>
              ESCOLHER {title}
            </div>
            <div className="text-2xl font-black italic text-white uppercase" style={{ letterSpacing: '-0.03em' }}>
              {isCaptain ? 'Capitão da Partida' : 'Herói do Jogo'}
            </div>
            <div className="text-[11px] text-zinc-600 mt-1">{subtitle}</div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-zinc-500 hover:text-white text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <div
          className="flex-1 overflow-y-auto px-4 pb-6 grid gap-2.5"
          style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}
        >
          {squad.map(player => {
            const selected = currentId === player.id;
            return (
              <motion.button
                key={player.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  onPick(player.id);
                  onClose();
                }}
                className="relative rounded-xl p-2 cursor-pointer flex flex-col items-center gap-1.5 transition-all"
                style={{
                  background: selected ? `${accent}20` : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${selected ? accent : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: selected ? `0 0 20px ${accent}50` : 'none',
                }}
              >
                {selected && (
                  <div
                    className="absolute -top-2 -right-2 w-[22px] h-[22px] rounded-full flex items-center justify-center font-black text-xs border-2"
                    style={{ background: accent, color: '#000', borderColor: '#050505' }}
                  >
                    ✓
                  </div>
                )}

                <div
                  className="w-full overflow-hidden rounded-lg"
                  style={{
                    aspectRatio: '1 / 1.2',
                    border: `1px solid ${selected ? accent : 'rgba(255,255,255,0.08)'}`,
                    background: '#0a0a0a',
                  }}
                >
                  <PlayerImage player={player} focus="95% center" />
                </div>

                <div className="text-center w-full">
                  <div
                    className="text-[10px] font-black uppercase truncate"
                    style={{ color: selected ? accent : '#fff', letterSpacing: '-0.01em' }}
                  >
                    {player.short}
                  </div>
                  <div className="text-[8px] text-zinc-600 mt-0.5 font-bold tracking-widest">
                    {player.pos} · #{player.num}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LeaderPanel — etapa 3
// ═════════════════════════════════════════════════════════════════════════════

interface LeaderPanelProps {
  squad: Player[];
  captainId: number | null;
  heroId: number | null;
  onSetCaptain: (id: number) => void;
  onSetHero: (id: number) => void;
  onBack: () => void;
  onNext: () => void;
}

function LeaderPanel({
  squad, captainId, heroId, onSetCaptain, onSetHero, onBack, onNext,
}: LeaderPanelProps) {
  const [picker, setPicker] = useState<LeaderRole | null>(null);
  const captain = squad.find(p => p.id === captainId) ?? null;
  const hero = squad.find(p => p.id === heroId) ?? null;
  const ready = !!captain && !!hero && captain.id !== hero.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col p-6"
      style={{ background: 'linear-gradient(180deg,#050505 0%,#0a0a05 100%)' }}
    >
      <div className="text-center mb-6">
        <div className="text-[9px] font-black uppercase text-yellow-500/60" style={{ letterSpacing: '0.4em' }}>
          ETAPA 3 DE 5
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase leading-none mt-2 mb-1" style={{ letterSpacing: '-0.03em' }}>
          ESCOLHA SEUS <span className="text-yellow-500">LÍDERES</span>
        </h1>
        <p className="text-xs text-zinc-600 max-w-xs mx-auto">
          O capitão tem pontos dobrados. O herói te dá +10 pts se acertar.
        </p>
      </div>

      <div className="flex gap-3 justify-center mb-6">
        {/* CAPITÃO */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setPicker('CAPTAIN')}
          className="flex-1 max-w-[170px] p-0 bg-transparent border-none cursor-pointer"
        >
          <div
            className="relative w-full overflow-hidden rounded-2xl transition-all"
            style={{
              aspectRatio: '3 / 4',
              border: `2px solid ${captain ? '#F5C400' : 'rgba(245,196,0,0.3)'}`,
              boxShadow: captain ? '0 0 28px rgba(245,196,0,0.5)' : '0 0 12px rgba(245,196,0,0.15)',
              background: 'linear-gradient(180deg,rgba(245,196,0,0.08) 0%,#0a0a0a 100%)',
            }}
          >
            <div
              className="absolute top-2 right-2 z-[5] w-6 h-6 rounded-full flex items-center justify-center font-black text-xs"
              style={{ background: '#F5C400', color: '#000', boxShadow: '0 0 10px rgba(245,196,0,0.7)' }}
            >
              C
            </div>

            {captain ? (
              <PlayerImage player={captain} focus="95% center" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">©</div>
            )}

            <div
              className="absolute bottom-0 left-0 right-0 px-2 pt-5 pb-2 text-center"
              style={{ background: 'linear-gradient(0deg,#000 0%,transparent 100%)' }}
            >
              <div className="text-[13px] font-black text-yellow-500 uppercase" style={{ letterSpacing: '-0.01em' }}>
                {captain ? captain.short : 'CAPITÃO'}
              </div>
              <div className="text-[8px] text-yellow-500/60 mt-0.5 font-extrabold tracking-widest">
                ×2 PONTOS
              </div>
            </div>
          </div>
        </motion.button>

        <div className="flex flex-col items-center justify-center gap-1">
          <div className="w-px h-8 bg-yellow-500/20" />
          <span className="text-[11px] font-black italic text-zinc-700">&</span>
          <div className="w-px h-8 bg-cyan-400/20" />
        </div>

        {/* HERÓI */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setPicker('HERO')}
          className="flex-1 max-w-[170px] p-0 bg-transparent border-none cursor-pointer"
        >
          <div
            className="relative w-full overflow-hidden rounded-2xl transition-all"
            style={{
              aspectRatio: '3 / 4',
              border: `2px solid ${hero ? '#00F3FF' : 'rgba(0,243,255,0.3)'}`,
              boxShadow: hero ? '0 0 28px rgba(0,243,255,0.5)' : '0 0 12px rgba(0,243,255,0.15)',
              background: 'linear-gradient(180deg,rgba(0,243,255,0.08) 0%,#0a0a0a 100%)',
            }}
          >
            <div
              className="absolute top-2 right-2 z-[5] w-6 h-6 rounded-full flex items-center justify-center font-black text-xs"
              style={{ background: '#00F3FF', color: '#000', boxShadow: '0 0 10px rgba(0,243,255,0.7)' }}
            >
              ★
            </div>

            {hero ? (
              <PlayerImage player={hero} focus="95% center" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl opacity-40">⭐</div>
            )}

            <div
              className="absolute bottom-0 left-0 right-0 px-2 pt-5 pb-2 text-center"
              style={{ background: 'linear-gradient(0deg,#000 0%,transparent 100%)' }}
            >
              <div className="text-[13px] font-black uppercase" style={{ color: '#00F3FF', letterSpacing: '-0.01em' }}>
                {hero ? hero.short : 'HERÓI'}
              </div>
              <div className="text-[8px] mt-0.5 font-extrabold tracking-widest" style={{ color: 'rgba(0,243,255,0.6)' }}>
                +10 PONTOS
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="flex-1" />

      {captain && hero && captain.id === hero.id && (
        <div
          className="rounded-xl p-3 text-center text-xs font-bold mb-3"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            color: '#EF4444',
          }}
        >
          ⚠️ Capitão e Herói não podem ser o mesmo jogador.
        </div>
      )}

      <div className="flex gap-2 justify-center mb-4">
        <div className="h-1 w-12 rounded-full" style={{ background: captain ? '#F5C400' : '#1a1a1a' }} />
        <div className="h-1 w-12 rounded-full" style={{ background: hero ? '#00F3FF' : '#1a1a1a' }} />
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-[11px] font-black uppercase cursor-pointer"
          style={{ letterSpacing: '0.2em' }}
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!ready}
          className="flex-[2] py-3.5 rounded-xl border-none text-xs font-black uppercase transition-all"
          style={{
            background: ready ? 'linear-gradient(135deg,#F5C400,#D4A200)' : 'rgba(255,255,255,0.04)',
            color: ready ? '#000' : '#444',
            cursor: ready ? 'pointer' : 'not-allowed',
            boxShadow: ready ? '0 8px 24px rgba(245,196,0,0.3)' : 'none',
            letterSpacing: '0.2em',
          }}
        >
          PRÓXIMO: PALPITE →
        </button>
      </div>

      <AnimatePresence>
        {picker && (
          <LeaderPicker
            role={picker}
            squad={squad}
            currentId={picker === 'CAPTAIN' ? captainId : heroId}
            onPick={id => (picker === 'CAPTAIN' ? onSetCaptain(id) : onSetHero(id))}
            onClose={() => setPicker(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// PalpitePanel — etapa 4 (palpite de placar)
// ═════════════════════════════════════════════════════════════════════════════

interface PalpitePanelProps {
  scoreTigre: number;
  scoreAdv: number;
  setScoreTigre: (n: number) => void;
  setScoreAdv: (n: number) => void;
  onBack: () => void;
  onNext: () => void;
}

function PalpitePanel({
  scoreTigre, scoreAdv, setScoreTigre, setScoreAdv, onBack, onNext,
}: PalpitePanelProps) {
  const ScoreCounter = ({
    label, value, onInc, onDec, color,
  }: { label: string; value: number; onInc: () => void; onDec: () => void; color: string }) => (
    <div className="flex flex-col items-center gap-3">
      <div className="text-[10px] font-black uppercase tracking-widest" style={{ color }}>
        {label}
      </div>
      <div
        className="rounded-2xl flex flex-col items-center justify-center p-5"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: `2px solid ${color}40`,
          boxShadow: `0 0 24px ${color}20`,
          minWidth: 110,
        }}
      >
        <button
          onClick={onInc}
          className="w-9 h-9 rounded-full text-base font-black border-none cursor-pointer transition-transform active:scale-90"
          style={{ background: color, color: '#000' }}
        >
          ▲
        </button>
        <div
          className="text-7xl font-black italic my-2 leading-none"
          style={{ color, letterSpacing: '-0.05em' }}
        >
          {value}
        </div>
        <button
          onClick={onDec}
          disabled={value <= 0}
          className="w-9 h-9 rounded-full text-base font-black border-none cursor-pointer transition-transform active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
        >
          ▼
        </button>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col p-6"
    >
      <div className="text-center mb-6">
        <div className="text-[9px] font-black uppercase text-yellow-500/60" style={{ letterSpacing: '0.4em' }}>
          ETAPA 4 DE 5
        </div>
        <h1 className="text-3xl font-black italic text-white uppercase leading-none mt-2" style={{ letterSpacing: '-0.03em' }}>
          CRAVA O <span className="text-yellow-500">PLACAR</span>
        </h1>
        <p className="text-xs text-zinc-600 mt-2">
          Acertou em cheio? +25 pts. Errou só por gol? +10 pts.
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-5">
          <ScoreCounter
            label="TIGRE"
            value={scoreTigre}
            onInc={() => setScoreTigre(scoreTigre + 1)}
            onDec={() => setScoreTigre(Math.max(0, scoreTigre - 1))}
            color="#F5C400"
          />
          <div className="text-3xl font-black italic text-zinc-700 self-center">×</div>
          <ScoreCounter
            label="ADVERSÁRIO"
            value={scoreAdv}
            onInc={() => setScoreAdv(scoreAdv + 1)}
            onDec={() => setScoreAdv(Math.max(0, scoreAdv - 1))}
            color="#888"
          />
        </div>
      </div>

      <div className="flex gap-2.5 mt-6">
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-[11px] font-black uppercase cursor-pointer"
          style={{ letterSpacing: '0.2em' }}
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          className="flex-[2] py-3.5 rounded-xl border-none text-xs font-black uppercase cursor-pointer transition-all"
          style={{
            background: 'linear-gradient(135deg,#F5C400,#D4A200)',
            color: '#000',
            boxShadow: '0 8px 24px rgba(245,196,0,0.3)',
            letterSpacing: '0.2em',
          }}
        >
          GERAR CARD →
        </button>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FinalCard — etapa 5 (revelação)
// ═════════════════════════════════════════════════════════════════════════════

interface FinalCardProps {
  formation: string;
  slots: Slot[];
  lineup: Record<string, Player | null>;
  captain: Player | null;
  hero: Player | null;
  scoreTigre: number;
  scoreAdv: number;
  onReset: () => void;
}

function FinalCard({
  formation, slots, lineup, captain, hero, scoreTigre, scoreAdv, onReset,
}: FinalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'done'>('idle');

  const handleShare = async () => {
    setShareStatus('sharing');
    try {
      // Tenta usar Web Share API se disponível
      if (typeof navigator !== 'undefined' && (navigator as any).share) {
        await (navigator as any).share({
          title: 'Meu Time Tigre FC',
          text: `Escalei meu time pro Tigre! Palpite: Novorizontino ${scoreTigre} × ${scoreAdv} adversário. Capitão: ${captain?.short ?? '-'}, Herói: ${hero?.short ?? '-'}.`,
        });
        setShareStatus('done');
      } else {
        // Fallback: copia pra área de transferência
        const txt = `Meu Time Tigre FC (${formation})\nCapitão: ${captain?.short ?? '-'}\nHerói: ${hero?.short ?? '-'}\nPalpite: Novorizontino ${scoreTigre} × ${scoreAdv} adversário`;
        await navigator.clipboard.writeText(txt);
        setShareStatus('done');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    } catch {
      setShareStatus('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center p-4 overflow-y-auto"
      style={{
        background: 'radial-gradient(ellipse at top, #1a1500 0%, #050505 60%)',
      }}
    >
      <div className="text-center mb-3 flex-shrink-0">
        <div className="text-[9px] font-black uppercase text-yellow-500/60" style={{ letterSpacing: '0.4em' }}>
          ETAPA 5 DE 5 · TIME PRONTO
        </div>
      </div>

      {/* Card compartilhável */}
      <div
        ref={cardRef}
        className="relative w-full max-w-sm rounded-3xl overflow-hidden flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg,#0a0a0a 0%,#000 100%)',
          border: '2px solid rgba(245,196,0,0.3)',
          boxShadow: '0 20px 60px rgba(245,196,0,0.2)',
          aspectRatio: '9 / 16',
          maxHeight: '70vh',
        }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 px-4 pt-3 pb-2 flex items-center justify-between"
          style={{ background: 'linear-gradient(180deg,#000 60%,transparent 100%)' }}
        >
          <div>
            <div className="text-[8px] font-black tracking-widest text-yellow-500/70 uppercase">
              ARENA TIGRE FC
            </div>
            <div className="text-base font-black italic text-white uppercase leading-none">
              MEU TIME · {formation}
            </div>
          </div>
          <img src={ESCUDO} alt="" crossOrigin="anonymous" className="w-9 h-9 object-contain" />
        </div>

        {/* Mini campo */}
        <div className="absolute inset-0 z-10">
          <img
            src={STADIUM_BG}
            alt=""
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg,rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.3) 30%,rgba(0,0,0,0.4) 70%,rgba(0,0,0,0.95) 100%)',
            }}
          />

          <div className="absolute inset-0" style={{ paddingTop: '15%', paddingBottom: '38%' }}>
            <div className="relative w-full h-full">
              {slots.map(slot => {
                const player = lineup[slot.id];
                if (!player) return null;
                const isC = captain?.id === player.id;
                const isH = hero?.id === player.id;
                return (
                  <div
                    key={slot.id}
                    className="absolute"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: 42,
                      height: 56,
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.7))',
                    }}
                  >
                    {(isC || isH) && (
                      <div
                        className="absolute -top-1 -right-1 z-[5] w-4 h-4 rounded-full flex items-center justify-center font-black text-[9px] border border-black"
                        style={{
                          background: isC ? '#F5C400' : '#00F3FF',
                          color: '#000',
                        }}
                      >
                        {isC ? 'C' : '★'}
                      </div>
                    )}
                    <div
                      className="w-full h-full rounded overflow-hidden flex flex-col"
                      style={{
                        border: `1.5px solid ${isC ? '#F5C400' : isH ? '#00F3FF' : 'rgba(255,255,255,0.4)'}`,
                        background: '#0a0a0a',
                      }}
                    >
                      <div className="flex-1 relative overflow-hidden">
                        <PlayerImage player={player} focus="95% center" />
                      </div>
                      <div className="bg-yellow-500 text-center" style={{ padding: '1px 0' }}>
                        <span className="block font-black uppercase text-black"
                          style={{ fontSize: 6.5, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', padding: '0 2px' }}
                        >
                          {player.short}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer com placar e líderes */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 pt-6"
          style={{ background: 'linear-gradient(0deg,#000 50%,transparent 100%)' }}
        >
          {/* Placar */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-center">
              <div className="text-[8px] font-black tracking-widest text-yellow-500">NOVO</div>
              <div className="text-3xl font-black italic text-yellow-500 leading-none">{scoreTigre}</div>
            </div>
            <div className="text-zinc-700 font-black italic text-lg">×</div>
            <div className="text-center">
              <div className="text-[8px] font-black tracking-widest text-zinc-500">ADV</div>
              <div className="text-3xl font-black italic text-zinc-400 leading-none">{scoreAdv}</div>
            </div>
          </div>

          {/* Líderes */}
          <div className="flex justify-center gap-3 text-[9px] font-black uppercase">
            {captain && (
              <span className="px-2 py-1 rounded text-black" style={{ background: '#F5C400', letterSpacing: '0.05em' }}>
                C · {captain.short}
              </span>
            )}
            {hero && (
              <span className="px-2 py-1 rounded text-black" style={{ background: '#00F3FF', letterSpacing: '0.05em' }}>
                ★ · {hero.short}
              </span>
            )}
          </div>

          <div className="text-center text-[7px] text-zinc-700 font-bold tracking-[0.4em] uppercase mt-3">
            Felipe Makarios · Arena Tigre FC
          </div>
        </div>
      </div>

      {/* Botões de ação (fora do card) */}
      <div className="flex gap-2 mt-4 w-full max-w-sm flex-shrink-0">
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-[10px] font-black uppercase cursor-pointer"
          style={{ letterSpacing: '0.2em' }}
        >
          REINICIAR
        </button>
        <button
          onClick={handleShare}
          disabled={shareStatus === 'sharing'}
          className="flex-[2] py-3 rounded-xl border-none text-[11px] font-black uppercase cursor-pointer transition-all"
          style={{
            background: shareStatus === 'done'
              ? 'linear-gradient(135deg,#22C55E,#16A34A)'
              : 'linear-gradient(135deg,#F5C400,#D4A200)',
            color: '#000',
            boxShadow: '0 8px 24px rgba(245,196,0,0.3)',
            letterSpacing: '0.2em',
          }}
        >
          {shareStatus === 'sharing' ? 'AGUARDE...' : shareStatus === 'done' ? '✓ COPIADO!' : 'COMPARTILHAR'}
        </button>
      </div>
    </motion.div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN — EscalacaoFormacao
// ═════════════════════════════════════════════════════════════════════════════

export default function EscalacaoFormacao({ jogoId }: EscalacaoProps) {
  // ─── Estado unificado ────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [scoreTigre, setScoreTigre] = useState(0);
  const [scoreAdv, setScoreAdv] = useState(0);

  // ─── Derivados ───────────────────────────────────────────────────────────
  const slots = FORMATIONS[formation];
  const escaladosIds = useMemo(
    () => Object.values(lineup).filter(Boolean).map(p => p!.id),
    [lineup]
  );
  const squad = useMemo(
    () => Object.values(lineup).filter((p): p is Player => p !== null),
    [lineup]
  );
  const captain = squad.find(p => p.id === captainId) ?? null;
  const hero = squad.find(p => p.id === heroId) ?? null;
  const isPlayerEscalado = (id: number) => escaladosIds.includes(id);
  const allFilled = squad.length === 11;

  // ─── Handlers ────────────────────────────────────────────────────────────
  const chooseFormation = (f: string) => {
    setFormation(f);
    setLineup({});
    setActiveSlot(null);
    setCaptainId(null);
    setHeroId(null);
    setStep('arena');
  };

  const handleSlotClick = (slotId: string) => {
    const playerInSlot = lineup[slotId];
    // Se tem jogador no slot e ele já está ativo → remove
    if (playerInSlot && activeSlot === slotId) {
      if (captainId === playerInSlot.id) setCaptainId(null);
      if (heroId === playerInSlot.id) setHeroId(null);
      setLineup(prev => ({ ...prev, [slotId]: null }));
      setActiveSlot(null);
      return;
    }
    setActiveSlot(prev => (prev === slotId ? null : slotId));
  };

  const handleMarketPick = (player: Player) => {
    let targetSlot = activeSlot;
    if (!targetSlot) {
      // Auto-encaixe: primeiro slot vago da posição compatível
      const compat = slots.find(s => s.posHint === player.pos && !lineup[s.id]);
      const anyEmpty = slots.find(s => !lineup[s.id]);
      targetSlot = compat?.id ?? anyEmpty?.id ?? null;
    }
    if (!targetSlot) return;
    setLineup(prev => ({ ...prev, [targetSlot!]: player }));
    setActiveSlot(null);
  };

  const goToLeaders = () => {
    if (!allFilled) return;
    setStep('leaders');
  };

  const goToPrediction = () => {
    if (!captainId || !heroId || captainId === heroId) return;
    setStep('prediction');
  };

  const goToReveal = () => setStep('reveal');

  const reset = () => {
    setStep('formation');
    setFormation('4-3-3');
    setLineup({});
    setActiveSlot(null);
    setCaptainId(null);
    setHeroId(null);
    setScoreTigre(0);
    setScoreAdv(0);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 bg-black text-white font-sans antialiased overflow-hidden select-none flex flex-col">
      <AnimatePresence mode="wait">
        {/* ─── ETAPA 1 — FORMAÇÃO ──────────────────────────────────────── */}
        {step === 'formation' && (
          <motion.div
            key="formation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 gap-6 bg-zinc-950"
          >
            <div className="text-center">
              <div className="text-[9px] font-black uppercase text-yellow-500/60" style={{ letterSpacing: '0.4em' }}>
                ETAPA 1 DE 5
              </div>
              <h1
                className="font-black italic text-yellow-500 uppercase leading-none mt-2"
                style={{ fontSize: 'clamp(36px,8vw,56px)', letterSpacing: '-0.04em' }}
              >
                ESCOLHA A TÁTICA
              </h1>
              <p className="text-sm text-zinc-600 max-w-xs mx-auto mt-3">
                A formação define como seus 11 vão se posicionar no campo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full max-w-md">
              {FORMATION_NAMES.map(f => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => chooseFormation(f)}
                  className="py-6 rounded-2xl text-2xl font-black italic transition-all hover:border-yellow-500 hover:bg-yellow-500/10"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(245,196,0,0.15)',
                    color: '#fff',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── ETAPA 2 — ARENA ──────────────────────────────────────────── */}
        {step === 'arena' && (
          <motion.div
            key="arena"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col md:flex-row relative overflow-hidden h-full"
          >
            {/* MERCADO */}
            <div className="h-[34%] md:h-full md:w-80 z-[110] border-b md:border-b-0 md:border-r border-white/10 flex-shrink-0">
              <MarketSidebar
                isPlayerEscalado={isPlayerEscalado}
                onPick={handleMarketPick}
                hint={activeSlot ? `Para o slot ${activeSlot.toUpperCase()}` : 'Toque num slot ou direto no jogador'}
              />
            </div>

            {/* CAMPO */}
            <div className="flex-1 relative bg-zinc-900 overflow-hidden">
              <img
                src={STADIUM_BG}
                alt=""
                crossOrigin="anonymous"
                className="absolute inset-0 w-full h-full object-cover opacity-90 pointer-events-none scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

              {/* Indicador da etapa */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[120] flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
                <div className="text-[8px] font-black tracking-widest text-yellow-500/80">
                  ETAPA 2/5
                </div>
                <div className="w-1 h-1 rounded-full bg-zinc-700" />
                <div
                  className={`text-[10px] font-black tracking-wider ${allFilled ? 'text-green-500' : 'text-yellow-500'}`}
                >
                  {squad.length}/11
                </div>
              </div>

              {/* Slots */}
              <div className="relative w-full h-full">
                {slots.map(slot => (
                  <FieldSlot
                    key={slot.id}
                    slot={slot}
                    player={lineup[slot.id] ?? null}
                    isSelected={activeSlot === slot.id}
                    isCaptain={false}
                    isHero={false}
                    onClick={() => handleSlotClick(slot.id)}
                  />
                ))}
              </div>

              {/* Hint flutuante */}
              {activeSlot && lineup[activeSlot] && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[120] px-3 py-1.5 rounded-md bg-yellow-500 text-black text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-2xl">
                  Tocar de novo pra remover
                </div>
              )}

              {/* Botões */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 z-[120] px-4">
                <button
                  onClick={() => setStep('formation')}
                  className="flex-1 max-w-[120px] py-3.5 bg-zinc-900/90 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md"
                >
                  ← {formation}
                </button>
                <button
                  onClick={goToLeaders}
                  disabled={!allFilled}
                  className="flex-1 max-w-[200px] py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-2xl transition-all"
                  style={{
                    background: allFilled ? '#F5C400' : 'rgba(255,255,255,0.05)',
                    color: allFilled ? '#000' : '#555',
                    border: 'none',
                    cursor: allFilled ? 'pointer' : 'not-allowed',
                  }}
                >
                  {allFilled ? 'PRÓXIMO →' : `ESCALE ${11 - squad.length}`}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ─── ETAPA 3 — LÍDERES ─────────────────────────────────────────── */}
        {step === 'leaders' && (
          <LeaderPanel
            key="leaders"
            squad={squad}
            captainId={captainId}
            heroId={heroId}
            onSetCaptain={setCaptainId}
            onSetHero={setHeroId}
            onBack={() => setStep('arena')}
            onNext={goToPrediction}
          />
        )}

        {/* ─── ETAPA 4 — PALPITE ─────────────────────────────────────────── */}
        {step === 'prediction' && (
          <PalpitePanel
            key="prediction"
            scoreTigre={scoreTigre}
            scoreAdv={scoreAdv}
            setScoreTigre={setScoreTigre}
            setScoreAdv={setScoreAdv}
            onBack={() => setStep('leaders')}
            onNext={goToReveal}
          />
        )}

        {/* ─── ETAPA 5 — CARD FINAL ─────────────────────────────────────── */}
        {step === 'reveal' && (
          <FinalCard
            key="reveal"
            formation={formation}
            slots={slots}
            lineup={lineup}
            captain={captain}
            hero={hero}
            scoreTigre={scoreTigre}
            scoreAdv={scoreAdv}
            onReset={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
