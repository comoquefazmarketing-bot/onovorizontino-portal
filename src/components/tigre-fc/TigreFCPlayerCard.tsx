'use client';

import React from 'react';

type Player = {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: string;
  foto: string;
};

type Props = {
  player: Player;
  size: number;
  isCapitao?: boolean;
  isHeroi?: boolean;
  isTopGoleador?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

export default function TigreFCPlayerCard({
  player, size, isCapitao, isHeroi, isTopGoleador, selected, onClick
}: Props) {
  const labelSize = Math.max(9, Math.round(size * 0.18));
  const badgeSize = Math.max(16, Math.round(size * 0.25));

  const colors = {
    capitao: '#FFD700',
    heroi: '#60a5fa',
    goleador: '#4ade80',
    default: '#F5C400',
    selected: '#FFFFFF',
    bg: 'rgba(0,0,0,0.6)'
  };

  const borderColor = selected 
    ? colors.selected 
    : isCapitao 
      ? colors.capitao 
      : isHeroi 
        ? colors.heroi 
        : isTopGoleador 
          ? colors.goleador 
          : colors.default;

  return (
    <>
      <style>{`
        @keyframes capitao-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(255,215,0,0.4); border-color: ${colors.capitao}; }
          50% { box-shadow: 0 0 20px rgba(255,215,0,0.8); border-color: #fff; }
        }
        @keyframes heroi-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(96,165,250,0.4); border-color: ${colors.heroi}; }
          50% { box-shadow: 0 0 20px rgba(96,165,250,0.8); border-color: #fff; }
        }
        @keyframes card-shimmer {
          0% { transform: translateX(-150%) skewX(-25deg); }
          100% { transform: translateX(150%) skewX(-25deg); }
        }
        .cap-glow { animation: capitao-pulse 2s ease-in-out infinite; }
        .heroi-glow { animation: heroi-pulse 2s ease-in-out infinite; }
      `}</style>

      <div
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative',
          transition: 'transform 0.2s ease',
          transform: selected ? 'scale(1.05)' : 'scale(1)',
          width: size + 10
        }}
      >
        {/* Badge Status (C ou H) */}
        {(isCapitao || isHeroi) && (
          <div style={{
            position: 'absolute',
            top: -2,
            right: -2,
            zIndex: 30,
            width: badgeSize,
            height: badgeSize,
            borderRadius: '50%',
            background: isCapitao ? colors.capitao : colors.heroi,
            border: '2px solid #111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: Math.max(8, badgeSize * 0.5),
            fontWeight: 900,
            color: isCapitao ? '#111' : '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
          }}>
            {isCapitao ? 'C' : 'H'}
          </div>
        )}

        {/* Container da Foto */}
        <div
          className={isCapitao ? 'cap-glow' : isHeroi ? 'heroi-glow' : ''}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `${selected || isCapitao || isHeroi ? '3px' : '2px'} solid ${borderColor}`,
            position: 'relative',
            background: colors.bg,
            transition: 'all 0.3s ease',
            flexShrink: 0
          }}
        >
          <img 
            src={player.foto} 
            alt={player.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />

          {/* Shimmer Effect para Capitão */}
          {isCapitao && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              animation: 'card-shimmer 2.5s infinite',
              zIndex: 10
            }} />
          )}

          {/* Número do Jogador */}
          <div style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 10,
            background: '#000',
            border: `1.5px solid ${borderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20
          }}>
            <span style={{ color: borderColor, fontSize: 8, fontWeight: 900 }}>
              {player.num}
            </span>
          </div>
        </div>

        {/* Nome/Abrev. */}
        <span style={{
          fontSize: labelSize,
          fontWeight: 800,
          color: isCapitao ? colors.capitao : isHeroi ? colors.heroi : '#fff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          textTransform: 'uppercase',
          textAlign: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          letterSpacing: '0.5px'
        }}>
          {player.short}
        </span>
      </div>
    </>
  );
}
