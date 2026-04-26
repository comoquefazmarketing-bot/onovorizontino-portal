'use client';

/**
 * ArenaTigreFC — Orquestrador Tigre FC
 * ═══════════════════════════════════════════════════════════════════════════
 * Fluxo de 5 etapas com estado unificado:
 *   1. formation  → escolha tática
 *   2. arena      → escalação dos 11 (campo + mercado)
 *   3. leaders    → capitão (×2 pts) + herói (+10 pts)
 *   4. prediction → palpite de placar
 *   5. reveal     → card final compartilhável
 *
 * Correções aplicadas:
 *   - Estado global de uma vez só (Felipe pediu)
 *   - URL das fotos sempre encodada (acentos como CARLÃO, ALVARÍÑO)
 *   - object-position: 95% center → foco no rosto da foto dupla
 *   - Fallback automático para o escudo quando a imagem quebra
 *   - Seletor visual de Capitão/Herói com os 11 já escalados
 *   - Reaproveita Palpite e FinalCardReveal existentes
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Palpite from './Palpite';
import FinalCardReveal from './FinalCardReveal';

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
  pos: 'GOL' | 'ZAG' | 'LAT' | 'VOL' | 'MEI' | 'ATA';
  foto: string;
}

interface Slot {
  id: string;
  x: number;          // % horizontal
  y: number;          // % vertical
  posHint: string;    // posição preferida no slot (informativo)
}

type Step = 'formation' | 'arena' | 'leaders' | 'prediction' | 'reveal';
type LeaderRole = 'CAPTAIN' | 'HERO';

// ═════════════════════════════════════════════════════════════════════════════
// PLAYER DATA — elenco atual do Tigre
// ═════════════════════════════════════════════════════════════════════════════

const PLAYERS_DATA: Player[] = [
  // GOLEIROS
  { id: 23, name: 'Jordi Martins',    short: 'JORDI',     num: 93, pos: 'GOL', foto: 'JORDI.png'                   },
  { id: 1,  name: 'César',            short: 'CÉSAR',     num: 31, pos: 'GOL', foto: 'CESAR-AUGUSTO.jpg.webp'      },
  { id: 22, name: 'João Scapin',      short: 'SCAPIN',    num: 12, pos: 'GOL', foto: 'JOAO-SCAPIN.jpg.webp'        },
  { id: 62, name: 'Lucas Ribeiro',    short: 'LUCAS',     num: 1,  pos: 'GOL', foto: 'LUCAS-RIBEIRO.jpg.webp'      },

  // ZAGUEIROS
  { id: 8,  name: 'Patrick',          short: 'PATRICK',   num: 4,  pos: 'ZAG', foto: 'PATRICK.jpg.webp'            },
  { id: 38, name: 'Renato Palm',      short: 'R. PALM',   num: 33, pos: 'ZAG', foto: 'RENATO-PALM.jpg.webp'        },
  { id: 34, name: 'Eduardo Brock',    short: 'BROCK',     num: 14, pos: 'ZAG', foto: 'EDUARDO-BROCK.jpg.webp'      },
  { id: 66, name: 'Alexis Alvariño',  short: 'ALVARÍÑO',  num: 22, pos: 'ZAG', foto: 'ALEXIS-ALVARIÑO.jpg.webp'    },
  { id: 6,  name: 'Carlinhos',        short: 'CARLINHOS', num: 3,  pos: 'ZAG', foto: 'CARLINHOS.jpg.webp'          },
  { id: 3,  name: 'Dantas',           short: 'DANTAS',    num: 25, pos: 'ZAG', foto: 'DANTAS.jpg.webp'             },

  // LATERAIS
  { id: 9,  name: 'Sander',           short: 'SANDER',    num: 5,  pos: 'LAT', foto: 'SANDER (1).jpg'              },
  { id: 28, name: 'Maykon Jesus',     short: 'MAYKON',    num: 66, pos: 'LAT', foto: 'MAYKON-JESUS.jpg.webp'       },
  { id: 27, name: 'Nilson Castrillón',short: 'NILSON',    num: 20, pos: 'LAT', foto: 'NILSON-CASTRILLON.jpg.webp'  },
  { id: 75, name: 'Jhilmar Lora',     short: 'LORA',      num: 24, pos: 'LAT', foto: 'LORA.jpg.webp'               },

  // VOLANTES
  { id: 41, name: 'Luís Oyama',       short: 'OYAMA',     num: 6,  pos: 'VOL', foto: 'LUIS-OYAMA.jpg.webp'         },
  { id: 46, name: 'Marlon',           short: 'MARLON',    num: 28, pos: 'VOL', foto: 'MARLON.jpg.webp'             },
  { id: 40, name: 'Léo Naldi',        short: 'NALDI',     num: 18, pos: 'VOL', foto: 'LÉO-NALDI.jpg.webp'          },

  // MEIAS
  { id: 47, name: 'Matheus Bianqui',  short: 'BIANQUI',   num: 17, pos: 'MEI', foto: 'MATHEUS-BIANQUI.jpg.webp'    },
  { id: 10, name: 'Rômulo',           short: 'RÔMULO',    num: 10, pos: 'MEI', foto: 'ROMULO.jpg.webp'             },
  { id: 12, name: 'Juninho',          short: 'JUNINHO',   num: 50, pos: 'MEI', foto: 'JUNINHO.jpg.webp'            },
  { id: 17, name: 'Tavinho',          short: 'TAVINHO',   num: 15, pos: 'MEI', foto: 'TAVINHO.jpg.webp'            },
  { id: 86, name: 'Christian Ortíz',  short: 'TITI ORTÍZ',num: 8,  pos: 'MEI', foto: 'CHRISTIAN-ORTÍZ.jpg.webp'    },
  { id: 13, name: 'Diego Galo',       short: 'D. GALO',   num: 19, pos: 'MEI', foto: 'DIEGO-GALO.jpg.webp'         },

  // ATACANTES
  { id: 15, name: 'Robson',           short: 'ROBSON',    num: 11, pos: 'ATA', foto: 'ROBSON.jpg.webp'             },
  { id: 59, name: 'Vinícius Paiva',   short: 'V. PAIVA',  num: 16, pos: 'ATA', foto: 'VINICIUS-PAIVA.jpg.webp'     },
  { id: 57, name: 'Ronald Barcellos', short: 'RONALD',    num: 7,  pos: 'ATA', foto: 'RONALD-BARCELLOS.jpg.webp'   },
  { id: 55, name: 'Nicolas Careca',   short: 'CARECA',    num: 30, pos: 'ATA', foto: 'NICOLAS-CARECA.jpg.webp'     },
  { id: 50, name: 'Carlão',           short: 'CARLÃO',    num: 9,  pos: 'ATA', foto: 'CARLÃO.jpg.webp'             },
  { id: 52, name: 'Hélio Borges',     short: 'HÉLIO',     num: 41, pos: 'ATA', foto: 'HÉLIO-BORGES.jpg.webp'       },
  { id: 53, name: 'Jardiel',          short: 'JARDIEL',   num: 40, pos: 'ATA', foto: 'JARDIEL.jpg.webp'            },
  { id: 91, name: 'Hector Bianchi',   short: 'HECTOR',    num: 35, pos: 'ATA', foto: 'HECTOR-BIANCHI.jpg.webp'     },
];

// ═════════════════════════════════════════════════════════════════════════════
// FORMATIONS — coordenadas % no campo (top-down, gol em baixo)
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
// HELPERS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Constrói URL da foto encodando partes do path.
 * Necessário para arquivos com acento (CARLÃO, ALVARÍÑO, HÉLIO)
 * ou espaço (SANDER (1).jpg).
 */
function getPhotoUrl(foto: string): string {
  if (!foto)               return ESCUDO;
  if (foto.startsWith('http')) return foto;
  // encodeURIComponent escapa /, mas como o foto é só nome de arquivo, ok
  return `${BASE_STORAGE}${encodeURIComponent(foto)}`;
}

// ═════════════════════════════════════════════════════════════════════════════
// PlayerImage — img com fallback automático para o escudo do clube
// Foco em 95% horizontal porque a foto original é dupla (corpo + rosto)
// ═════════════════════════════════════════════════════════════════════════════

interface PlayerImageProps {
  player: Player;
  /** padrão '95% center' (rosto). Use 'center' para fotos não duplas. */
  focus?: string;
  className?: string;
  style?: React.CSSProperties;
}

function PlayerImage({ player, focus = '95% center', className, style }: PlayerImageProps) {
  const [errored, setErrored] = useState(false);
  const src = errored ? ESCUDO : getPhotoUrl(player.foto);

  return (
    <img
      src={src}
      alt={player.short}
      crossOrigin="anonymous"
      onError={() => setErrored(true)}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit: errored ? 'contain' : 'cover',
        objectPosition: errored ? 'center' : focus,
        background: errored ? '#0a0a0a' : 'transparent',
        padding: errored ? 12 : 0,
        ...style,
      }}
    />
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// FieldSlot — uma posição no campo. Vazia, ocupada, ou em destaque.
// ═════════════════════════════════════════════════════════════════════════════

interface FieldSlotProps {
  slot: Slot;
  player: Player | null;
  isSelected: boolean;
  isCaptain: boolean;
  isHero: boolean;
  onClick: () => void;
  size?: number;
}

function FieldSlot({ slot, player, isSelected, isCaptain, isHero, onClick, size = 64 }: FieldSlotProps) {
  const borderColor = isCaptain
    ? '#F5C400'
    : isHero
    ? '#00F3FF'
    : isSelected
    ? '#F5C400'
    : 'rgba(255,255,255,0.3)';

  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size * 1.35,
        zIndex: isSelected || isCaptain || isHero ? 30 : 10,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.6))',
      }}
    >
      {/* Badge de capitão / herói */}
      {(isCaptain || isHero) && (
        <div
          style={{
            position: 'absolute',
            top: -6,
            right: -2,
            zIndex: 5,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: isCaptain ? '#F5C400' : '#00F3FF',
            color: '#000',
            border: '2px solid #050505',
            fontWeight: 900,
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 14px ${isCaptain ? '#F5C400' : '#00F3FF'}cc`,
          }}
        >
          {isCaptain ? 'C' : '★'}
        </div>
      )}

      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          overflow: 'hidden',
          border: `2px solid ${borderColor}`,
          background: player ? '#0a0a0a' : 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(2px)',
          boxShadow: isSelected
            ? '0 0 24px rgba(245,196,0,0.6)'
            : isCaptain
            ? '0 0 16px rgba(245,196,0,0.4)'
            : isHero
            ? '0 0 16px rgba(0,243,255,0.4)'
            : 'none',
          transition: 'all 0.2s',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {player ? (
          <>
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <PlayerImage player={player} focus="95% center" />
            </div>
            <div
              style={{
                background: '#F5C400',
                padding: '4px 2px',
                textAlign: 'center',
                lineHeight: 1,
              }}
            >
              <span
                style={{
                  fontSize: Math.max(8, size * 0.13),
                  fontWeight: 900,
                  color: '#000',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.02em',
                  display: 'block',
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
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.4,
            }}
          >
            <span style={{ fontSize: 22, color: '#fff', fontWeight: 200 }}>+</span>
            <span
              style={{
                fontSize: 8,
                color: 'rgba(255,255,255,0.6)',
                fontWeight: 900,
                letterSpacing: '0.1em',
                marginTop: 2,
              }}
            >
              {slot.posHint}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MarketSidebar — lista filtrável de jogadores disponíveis
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
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#F5C400',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            margin: 0,
            lineHeight: 1,
          }}
        >
          MERCADO
        </h2>
        <p style={{ fontSize: 9, color: '#666', margin: '4px 0 0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {hint}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 4, padding: '10px 12px', overflowX: 'auto' }}>
        {POS_FILTERS.map(p => (
          <button
            key={p}
            onClick={() => setFilter(p)}
            style={{
              flexShrink: 0,
              padding: '6px 10px',
              fontSize: 10,
              fontWeight: 900,
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              background: filter === p ? '#F5C400' : 'rgba(255,255,255,0.05)',
              color: filter === p ? '#000' : '#777',
              letterSpacing: '0.08em',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '4px 10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {list.map(player => {
          const escalado = isPlayerEscalado(player.id);
          return (
            <motion.button
              key={player.id}
              layout
              whileTap={{ scale: 0.96 }}
              onClick={() => !escalado && onPick(player)}
              disabled={escalado}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: 8,
                borderRadius: 10,
                border: escalado
                  ? '1px solid rgba(255,255,255,0.04)'
                  : '1px solid rgba(255,255,255,0.1)',
                background: escalado
                  ? 'rgba(255,255,255,0.02)'
                  : 'rgba(255,255,255,0.05)',
                cursor: escalado ? 'default' : 'pointer',
                opacity: escalado ? 0.35 : 1,
                filter: escalado ? 'grayscale(0.6)' : 'none',
                transition: 'all 0.15s',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: '#0a0a0a',
                  flexShrink: 0,
                }}
              >
                <PlayerImage player={player} focus="20% center" />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 900,
                      background: '#F5C400',
                      color: '#000',
                      padding: '1px 5px',
                      borderRadius: 3,
                      letterSpacing: '0.05em',
                    }}
                  >
                    {player.pos}
                  </span>
                  <span style={{ fontSize: 10, color: '#666', fontWeight: 700 }}>#{player.num}</span>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 900,
                    color: escalado ? '#444' : '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {player.short}
                </div>
              </div>

              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: escalado ? 'rgba(34,197,94,0.15)' : 'rgba(245,196,0,0.1)',
                  color: escalado ? '#22C55E' : '#F5C400',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: 14,
                  flexShrink: 0,
                }}
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
// LeaderPicker — modal para escolher Capitão ou Herói entre os 11 escalados
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
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'linear-gradient(180deg,#0a0a0a 0%,#080808 100%)',
          borderRadius: '24px 24px 0 0',
          borderTop: `2px solid ${accent}`,
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: `0 -20px 60px ${accent}30`,
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 40, height: 4, background: '#222', borderRadius: 2 }} />
        </div>

        {/* Header */}
        <div style={{ padding: '14px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 900,
                color: accent,
                letterSpacing: '0.4em',
                textTransform: 'uppercase',
                marginBottom: 2,
              }}
            >
              ESCOLHER {title}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, fontStyle: 'italic', color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
              {isCaptain ? 'Capitão da Partida' : 'Herói do Jogo'}
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{subtitle}</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#888',
              width: 34,
              height: 34,
              borderRadius: 10,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            ✕
          </button>
        </div>

        {/* Grid de jogadores */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 16px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
          }}
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
                style={{
                  position: 'relative',
                  background: selected ? `${accent}20` : 'rgba(255,255,255,0.04)',
                  border: `2px solid ${selected ? accent : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 12,
                  padding: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: selected ? `0 0 20px ${accent}50` : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {selected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      background: accent,
                      color: '#000',
                      fontWeight: 900,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #050505',
                    }}
                  >
                    ✓
                  </div>
                )}

                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1 / 1.2',
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: `1px solid ${selected ? accent : 'rgba(255,255,255,0.08)'}`,
                    background: '#0a0a0a',
                  }}
                >
                  <PlayerImage player={player} focus="95% center" />
                </div>

                <div style={{ textAlign: 'center', width: '100%' }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      color: selected ? accent : '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {player.short}
                  </div>
                  <div style={{ fontSize: 8, color: '#555', marginTop: 1, fontWeight: 700, letterSpacing: '0.1em' }}>
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
// LeaderPanel — etapa 3: cards visuais de Capitão e Herói
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

function LeaderPanel({ squad, captainId, heroId, onSetCaptain, onSetHero, onBack, onNext }: LeaderPanelProps) {
  const [picker, setPicker] = useState<LeaderRole | null>(null);
  const captain = squad.find(p => p.id === captainId) ?? null;
  const hero = squad.find(p => p.id === heroId) ?? null;
  const ready = !!captain && !!hero && captain.id !== hero.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        background: 'linear-gradient(180deg,#050505 0%,#0a0a05 100%)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(245,196,0,0.6)', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
          ETAPA 3 DE 5
        </div>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            fontStyle: 'italic',
            color: '#fff',
            textTransform: 'uppercase',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            margin: '8px 0 4px',
          }}
        >
          ESCOLHA SEUS <span style={{ color: '#F5C400' }}>LÍDERES</span>
        </h1>
        <p style={{ fontSize: 12, color: '#555', maxWidth: 320, margin: '0 auto' }}>
          O capitão tem pontos dobrados. O herói te dá +10 pts se acertar.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
        {/* Capitão */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setPicker('CAPTAIN')}
          style={{
            flex: 1,
            maxWidth: 170,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: 14,
              overflow: 'hidden',
              border: `2px solid ${captain ? '#F5C400' : 'rgba(245,196,0,0.3)'}`,
              boxShadow: captain
                ? '0 0 28px rgba(245,196,0,0.5)'
                : '0 0 12px rgba(245,196,0,0.15)',
              background: 'linear-gradient(180deg,rgba(245,196,0,0.08) 0%,#0a0a0a 100%)',
              transition: 'all 0.3s',
            }}
          >
            {/* Badge C */}
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 5,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#F5C400',
                color: '#000',
                fontWeight: 900,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(245,196,0,0.7)',
              }}
            >
              C
            </div>

            {captain ? (
              <PlayerImage player={captain} focus="95% center" />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  opacity: 0.4,
                }}
              >
                ©
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(0deg,#000 0%,transparent 100%)',
                padding: '20px 8px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                {captain ? captain.short : 'CAPITÃO'}
              </div>
              <div style={{ fontSize: 8, color: 'rgba(245,196,0,0.6)', marginTop: 2, letterSpacing: '0.2em', fontWeight: 800 }}>
                ×2 PONTOS
              </div>
            </div>
          </div>
        </motion.button>

        {/* Separador */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <div style={{ width: 1, height: 30, background: 'rgba(245,196,0,0.2)' }} />
          <span style={{ fontSize: 11, fontWeight: 900, color: '#444', fontStyle: 'italic' }}>&</span>
          <div style={{ width: 1, height: 30, background: 'rgba(0,243,255,0.2)' }} />
        </div>

        {/* Herói */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setPicker('HERO')}
          style={{
            flex: 1,
            maxWidth: 170,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '3 / 4',
              borderRadius: 14,
              overflow: 'hidden',
              border: `2px solid ${hero ? '#00F3FF' : 'rgba(0,243,255,0.3)'}`,
              boxShadow: hero
                ? '0 0 28px rgba(0,243,255,0.5)'
                : '0 0 12px rgba(0,243,255,0.15)',
              background: 'linear-gradient(180deg,rgba(0,243,255,0.08) 0%,#0a0a0a 100%)',
              transition: 'all 0.3s',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                zIndex: 5,
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: '#00F3FF',
                color: '#000',
                fontWeight: 900,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(0,243,255,0.7)',
              }}
            >
              ★
            </div>

            {hero ? (
              <PlayerImage player={hero} focus="95% center" />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 36,
                  opacity: 0.4,
                }}
              >
                ⭐
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(0deg,#000 0%,transparent 100%)',
                padding: '20px 8px 8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: '#00F3FF', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
                {hero ? hero.short : 'HERÓI'}
              </div>
              <div style={{ fontSize: 8, color: 'rgba(0,243,255,0.6)', marginTop: 2, letterSpacing: '0.2em', fontWeight: 800 }}>
                +10 PONTOS
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Validação visual */}
      <div style={{ flex: 1 }} />
      {captain && hero && captain.id === hero.id && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: 10,
            padding: '10px 14px',
            color: '#EF4444',
            fontSize: 12,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          ⚠️ Capitão e Herói não podem ser o mesmo jogador.
        </div>
      )}

      {/* Indicador de progresso */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ height: 3, width: 50, borderRadius: 99, background: captain ? '#F5C400' : '#1a1a1a' }} />
        <div style={{ height: 3, width: 50, borderRadius: 99, background: hero ? '#00F3FF' : '#1a1a1a' }} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            flex: 1,
            padding: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            color: '#888',
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          ← Voltar
        </button>
        <button
          onClick={onNext}
          disabled={!ready}
          style={{
            flex: 2,
            padding: 14,
            background: ready ? 'linear-gradient(135deg,#F5C400,#D4A200)' : 'rgba(255,255,255,0.04)',
            border: 'none',
            borderRadius: 12,
            color: ready ? '#000' : '#444',
            fontSize: 12,
            fontWeight: 900,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            cursor: ready ? 'pointer' : 'not-allowed',
            boxShadow: ready ? '0 8px 24px rgba(245,196,0,0.3)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          PRÓXIMO: PALPITE →
        </button>
      </div>

      {/* Modal Picker */}
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
// MAIN — ArenaTigreFC
// ═════════════════════════════════════════════════════════════════════════════

export default function ArenaTigreFC() {
  // ─── Estado unificado ────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState<string>('4-3-3');
  const [lineup, setLineup] = useState<Record<string, Player | null>>({});
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [captainId, setCaptainId] = useState<number | null>(null);
  const [heroId, setHeroId] = useState<number | null>(null);
  const [scoreTigre, setScoreTigre] = useState(0);
  const [scoreAdv, setScoreAdv] = useState(0);
  const [palpiteLocked, setPalpiteLocked] = useState(false);

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
    setActiveSlot(prev => (prev === slotId ? null : slotId));
  };

  const handleMarketPick = (player: Player) => {
    // Se nenhum slot ativo, encaixa no primeiro slot vago de posição compatível
    let targetSlot = activeSlot;
    if (!targetSlot) {
      const compat = slots.find(s => s.posHint === player.pos && !lineup[s.id]);
      const anyEmpty = slots.find(s => !lineup[s.id]);
      targetSlot = compat?.id ?? anyEmpty?.id ?? null;
    }
    if (!targetSlot) return;

    setLineup(prev => ({ ...prev, [targetSlot!]: player }));
    setActiveSlot(null);
  };

  const handleRemoveFromField = (slotId: string) => {
    const p = lineup[slotId];
    if (!p) return;
    // Limpa capitão/herói se estavam nesse jogador
    if (captainId === p.id) setCaptainId(null);
    if (heroId === p.id) setHeroId(null);
    setLineup(prev => ({ ...prev, [slotId]: null }));
  };

  const goToLeaders = () => {
    if (!allFilled) return;
    setStep('leaders');
  };

  const goToPrediction = () => {
    if (!captainId || !heroId || captainId === heroId) return;
    setStep('prediction');
  };

  const goToReveal = () => {
    setPalpiteLocked(true);
    setStep('reveal');
  };

  const reset = () => {
    setStep('formation');
    setFormation('4-3-3');
    setLineup({});
    setActiveSlot(null);
    setCaptainId(null);
    setHeroId(null);
    setScoreTigre(0);
    setScoreAdv(0);
    setPalpiteLocked(false);
  };

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════

  return (
    <div
      style={{
        height: '100svh',
        background: '#050505',
        color: '#fff',
        fontFamily: "'Barlow Condensed', system-ui, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {/* ─────────────────────────────────────────────────────────────────
           ETAPA 1 — FORMAÇÃO
        ─────────────────────────────────────────────────────────────────── */}
        {step === 'formation' && (
          <motion.div
            key="formation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              gap: 24,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(245,196,0,0.6)', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                ETAPA 1 DE 5
              </div>
              <h1
                style={{
                  fontSize: 'clamp(36px, 8vw, 56px)',
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#F5C400',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  margin: '8px 0 4px',
                }}
              >
                ESCOLHA A TÁTICA
              </h1>
              <p style={{ fontSize: 13, color: '#555', maxWidth: 320, margin: '0 auto' }}>
                A formação define como seus 11 vão se posicionar no campo.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 12,
                width: '100%',
                maxWidth: 420,
              }}
            >
              {FORMATION_NAMES.map(f => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => chooseFormation(f)}
                  style={{
                    padding: '24px 12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(245,196,0,0.15)',
                    borderRadius: 16,
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: 22,
                    fontWeight: 900,
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(245,196,0,0.1)';
                    e.currentTarget.style.borderColor = '#F5C400';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.borderColor = 'rgba(245,196,0,0.15)';
                  }}
                >
                  {f}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
           ETAPA 2 — ARENA (Campo + Mercado)
        ─────────────────────────────────────────────────────────────────── */}
        {step === 'arena' && (
          <motion.div
            key="arena"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            {/* Top bar */}
            <div
              style={{
                padding: '10px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0,0,0,0.4)',
                flexShrink: 0,
              }}
            >
              <button
                onClick={() => setStep('formation')}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#888',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  padding: '6px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                }}
              >
                ← {formation}
              </button>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 8, fontWeight: 900, color: 'rgba(245,196,0,0.6)', letterSpacing: '0.3em' }}>
                  ETAPA 2 DE 5
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 900,
                    color: allFilled ? '#22C55E' : '#F5C400',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}
                >
                  {squad.length}/11 ESCALADOS
                </div>
              </div>

              <button
                onClick={goToLeaders}
                disabled={!allFilled}
                style={{
                  background: allFilled ? '#F5C400' : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: allFilled ? '#000' : '#555',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '0.15em',
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: allFilled ? 'pointer' : 'not-allowed',
                }}
              >
                LÍDERES →
              </button>
            </div>

            {/* Layout: campo + mercado */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
              {/* CAMPO */}
              <div
                style={{
                  position: 'relative',
                  flex: '1 1 60%',
                  minHeight: 320,
                  overflow: 'hidden',
                }}
              >
                <img
                  src={STADIUM_BG}
                  alt=""
                  crossOrigin="anonymous"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: 0.85,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg,rgba(0,0,0,0.35) 0%,transparent 30%,transparent 70%,rgba(0,0,0,0.5) 100%)',
                  }}
                />

                {/* Slots */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  {slots.map(slot => {
                    const player = lineup[slot.id];
                    return (
                      <FieldSlot
                        key={slot.id}
                        slot={slot}
                        player={player ?? null}
                        isSelected={activeSlot === slot.id}
                        isCaptain={false}
                        isHero={false}
                        onClick={() =>
                          activeSlot === slot.id && player
                            ? handleRemoveFromField(slot.id)
                            : handleSlotClick(slot.id)
                        }
                        size={64}
                      />
                    );
                  })}
                </div>

                {/* Hint flutuante */}
                {activeSlot && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(245,196,0,0.95)',
                      color: '#000',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 10,
                      fontWeight: 900,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 8px 24px rgba(245,196,0,0.4)',
                    }}
                  >
                    Escolha um jogador no mercado abaixo
                  </div>
                )}
              </div>

              {/* MERCADO */}
              <div
                style={{
                  flex: '1 1 40%',
                  minHeight: 220,
                  borderTop: '2px solid rgba(245,196,0,0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MarketSidebar
                  isPlayerEscalado={isPlayerEscalado}
                  onPick={handleMarketPick}
                  hint={activeSlot ? `Escalando para o slot ${activeSlot.toUpperCase()}` : 'Toque num slot ou escolha direto'}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
           ETAPA 3 — LÍDERES
        ─────────────────────────────────────────────────────────────────── */}
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

        {/* ─────────────────────────────────────────────────────────────────
           ETAPA 4 — PALPITE
        ─────────────────────────────────────────────────────────────────── */}
        {step === 'prediction' && (
          <motion.div
            key="prediction"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px 16px',
              gap: 20,
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(245,196,0,0.6)', letterSpacing: '0.4em', textTransform: 'uppercase' }}>
                ETAPA 4 DE 5
              </div>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  fontStyle: 'italic',
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  margin: '8px 0 0',
                }}
              >
                CRAVA O <span style={{ color: '#F5C400' }}>PLACAR</span>
              </h1>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 460 }}>
                <Palpite
                  scoreTigre={scoreTigre}
                  scoreAdversario={scoreAdv}
                  setScoreTigre={setScoreTigre}
                  setScoreAdversario={setScoreAdv}
                  isLocked={palpiteLocked}
                  onLock={goToReveal}
                />
              </div>
            </div>

            <button
              onClick={() => setStep('leaders')}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                color: '#888',
                padding: 12,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              ← Voltar para os Líderes
            </button>
          </motion.div>
        )}

        {/* ─────────────────────────────────────────────────────────────────
           ETAPA 5 — REVELAÇÃO (CARD COMPARTILHÁVEL)
        ─────────────────────────────────────────────────────────────────── */}
        {step === 'reveal' && (
          <FinalCardReveal
            key="reveal"
            lineup={lineup}
            formation={slots}
            captainId={captainId}
            heroId={heroId}
            scoreTigre={scoreTigre}
            scoreAdversario={scoreAdv}
            onClose={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
