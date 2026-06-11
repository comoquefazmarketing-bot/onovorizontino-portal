'use client';

/**
 * CampoFifa v3 — Templo do Tigre
 * Top-down inclinado, listras de gramado, linhas neon, névoa de estádio,
 * logo Pata como marca d'água central, iluminação volumétrica de refletores.
 */

import React from 'react';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// Cores de borda por posição — usadas nos player slots
export const POS_CORES: Record<string, string> = {
  GOL: '#F5C400',   // ouro
  ZAG: '#3B82F6',   // azul
  LAT: '#06B6D4',   // ciano
  MEI: '#22C55E',   // verde
  ATA: '#EF4444',   // vermelho
};

export const POS_GLOW: Record<string, string> = {
  GOL: 'rgba(245,196,0,0.6)',
  ZAG: 'rgba(59,130,246,0.6)',
  LAT: 'rgba(6,182,212,0.6)',
  MEI: 'rgba(34,197,94,0.6)',
  ATA: 'rgba(239,68,68,0.6)',
};

export default function CampoFifa() {
  return (
    <div className="campo-wrapper">

      {/* Sombra projetada no "chão" — efeito 3D flutuante */}
      <div className="campo-ground-shadow" />

      {/* Container 3D */}
      <div className="campo-tilt">

        {/* ── GRAMADO ── */}
        <div className="campo-grass">
          {/* Listras horizontais alternadas — corte profissional */}
          {[...Array(12)].map((_, i) => (
            <div key={i} className="campo-stripe" data-even={i % 2 === 0 ? 'true' : 'false'} />
          ))}

          {/* Textura sutil */}
          <div className="campo-texture" />

          {/* Névoa de borda (refletores) */}
          <div className="campo-vignette" />

          {/* Iluminação volumétrica central */}
          <div className="campo-spotlight" />
        </div>

        {/* ── LINHAS NEON ── */}
        <div className="campo-lines">
          {/* Borda externa */}
          <div className="line-border" />

          {/* Linha do meio */}
          <div className="line-mid" />

          {/* Círculo central */}
          <div className="line-circle">
            <div className="line-dot" />
          </div>

          {/* Área superior */}
          <div className="line-area top">
            <div className="line-small-area" />
            <div className="line-penalty-dot top-dot" />
            <div className="line-arc top-arc" />
          </div>

          {/* Área inferior */}
          <div className="line-area bottom">
            <div className="line-small-area" />
            <div className="line-penalty-dot bot-dot" />
            <div className="line-arc bot-arc" />
          </div>

          {/* Cantos */}
          <div className="corner corner-tl" />
          <div className="corner corner-tr" />
          <div className="corner corner-bl" />
          <div className="corner corner-br" />
        </div>

        {/* ── LOGO MARCA D'ÁGUA ── */}
        <div className="campo-watermark">
          <img src={PATA_LOGO} alt="Tigre FC" className="watermark-img" />
        </div>

      </div>

      <style jsx>{`
        /* ── WRAPPER ── */
        .campo-wrapper {
          position: absolute;
          inset: 0;
          perspective: 1800px;
          perspective-origin: 50% 30%;
          overflow: hidden;
        }

        .campo-ground-shadow {
          position: absolute;
          bottom: -30px;
          left: 10%;
          right: 10%;
          height: 60px;
          background: rgba(0,0,0,0.7);
          border-radius: 50%;
          filter: blur(30px);
          z-index: 0;
        }

        /* ── TILT 3D ── */
        .campo-tilt {
          position: absolute;
          inset: 0;
          transform: rotateX(38deg) rotateY(0deg);
          transform-origin: center 60%;
          transform-style: preserve-3d;
          border-radius: 14px;
          overflow: hidden;
          border: 3px solid rgba(255,255,255,0.12);
          box-shadow:
            0 30px 60px rgba(0,0,0,0.9),
            inset 0 0 80px rgba(0,0,0,0.3);
          z-index: 1;
        }

        /* ── GRAMADO ── */
        .campo-grass {
          position: absolute;
          inset: 0;
          background: #1a5218;
          display: flex;
          flex-direction: column;
        }

        .campo-stripe {
          flex: 1;
        }
        .campo-stripe[data-even="true"] {
          background: #1f6b1d;
        }

        .campo-texture {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.04) 3px,
              rgba(0,0,0,0.04) 6px
            );
          opacity: 0.8;
        }

        /* Névoa de bordas — simula profundidade de noite */
        .campo-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at center,
            transparent 35%,
            rgba(0,0,0,0.55) 100%
          );
          pointer-events: none;
        }

        /* Foco central — refletores apontando ao centro */
        .campo-spotlight {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 50% 50%, rgba(255,255,220,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 10% 5%,  rgba(255,255,200,0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 90% 5%,  rgba(200,240,255,0.12) 0%, transparent 40%);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        /* ── LINHAS ── */
        .campo-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Linha branca neon compartilhada */
        .campo-lines * {
          box-sizing: border-box;
        }

        .line-border {
          position: absolute;
          inset: 14px;
          border: 2px solid rgba(255,255,255,0.75);
          border-radius: 3px;
          box-shadow: 0 0 8px rgba(255,255,255,0.25), inset 0 0 8px rgba(255,255,255,0.05);
        }

        .line-mid {
          position: absolute;
          top: 50%;
          left: 14px;
          right: 14px;
          height: 2px;
          background: rgba(255,255,255,0.75);
          transform: translateY(-50%);
          box-shadow: 0 0 6px rgba(255,255,255,0.3);
        }

        .line-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 90px;
          height: 90px;
          border: 2px solid rgba(255,255,255,0.75);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .line-dot {
          width: 6px;
          height: 6px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }

        /* Áreas de pênalti */
        .line-area {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 58%;
          height: 22%;
          border: 2px solid rgba(255,255,255,0.75);
          box-shadow: 0 0 6px rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .line-area.top    { top: 14px;    border-top: none; }
        .line-area.bottom { bottom: 14px; border-bottom: none; }

        .line-small-area {
          position: absolute;
          width: 50%;
          height: 55%;
          border: 2px solid rgba(255,255,255,0.75);
        }
        .line-area.top    .line-small-area { top: 0;    border-top: none; }
        .line-area.bottom .line-small-area { bottom: 0; border-bottom: none; }

        .line-penalty-dot {
          position: absolute;
          width: 5px;
          height: 5px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 8px rgba(255,255,255,0.8);
        }
        .top-dot { bottom: 28%; }
        .bot-dot { top: 28%; }

        /* Arco da grande área */
        .line-arc {
          position: absolute;
          left: 50%;
          width: 60px;
          height: 30px;
          border: 2px solid rgba(255,255,255,0.6);
          border-radius: 50%;
          transform: translateX(-50%);
          clip-path: inset(50% 0 0 0);
        }
        .top-arc { bottom: -17px; clip-path: inset(50% 0 0 0); }
        .bot-arc { top: -17px;    clip-path: inset(0 0 50% 0); }

        /* Cantos */
        .corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border: 2px solid rgba(255,255,255,0.6);
          border-radius: 50%;
        }
        .corner-tl { top: 12px;    left: 12px;  border-bottom: none; border-right: none; }
        .corner-tr { top: 12px;    right: 12px; border-bottom: none; border-left: none; }
        .corner-bl { bottom: 12px; left: 12px;  border-top: none;    border-right: none; }
        .corner-br { bottom: 12px; right: 12px; border-top: none;    border-left: none; }

        /* ── MARCA D'ÁGUA ── */
        .campo-watermark {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 2;
        }

        .watermark-img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          opacity: 0.07;
          filter: brightness(10) saturate(0);
        }
      `}</style>
    </div>
  );
}
