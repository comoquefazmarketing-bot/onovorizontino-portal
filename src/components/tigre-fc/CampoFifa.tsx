'use client';

import React from 'react';

// Texturas realistas e sutis para dar profundidade e brilho ao gramado
const TEXTURA_GRAMADO_HD = 'https://www.transparenttextures.com/patterns/dark-dotted-2.png';
const EFEITO_LUMINOSO_ESTADIO = 'https://www.transparenttextures.com/patterns/white-diamond.png';

export default function CampoFifa() {
  return (
    <div className="perspective-wrapper">
      <div className="fifa-stadium-experience">
        
        {/* Sombra projetada do campo (Ground Shadow) para efeito 3D flutuante */}
        <div className="field-shadow-3d" />
        
        {/* Container principal do campo com inclinação 3D dramática */}
        <div className="field-tilt-cinematic">
          
          {/* --- O GRAMADO REALISTA (PADRÃO FIFA HD) --- */}
          <div className="grass-pattern-hd">
            <div className="texture-overlay-hd" />
            
            {/* Faixas Horizontais Alternadas (Padrão de Corte Profissional) */}
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="grass-stripe-h-hd" />
            ))}
            
            {/* Faixas Verticais (Completando o Xadrez Xtra-Deep) */}
            <div className="vertical-stripes-container-hd">
              {[...Array(6)].map((_, i) => (
                <div key={`v-${i}`} className="grass-stripe-v-hd" />
              ))}
            </div>
            
            {/* Efeito de Reflexão de Luz no Gramado Molhado */}
            <div className="grass-wet-reflection" />
          </div>

          {/* --- MARCAÇÕES BRANCAS CRISTALINAS (EM PERSPECTIVA) --- */}
          <div className="field-lines-crisp">
            <div className="border-lines-crisp" />
            <div className="mid-line-crisp" />
            
            <div className="center-circle-crisp">
              <div className="center-point-crisp" />
            </div>
            
            <div className="penalty-area-crisp top">
              <div className="goal-area-crisp" />
              <div className="penalty-arc-crisp" />
              <div className="penalty-point-crisp" />
            </div>
            
            <div className="penalty-area-crisp bottom">
              <div className="goal-area-crisp" />
              <div className="penalty-arc-crisp" />
              <div className="penalty-point-crisp" />
            </div>
          </div>

          {/* --- ILUMINAÇÃO DRAMÁTICA DE ESTÁDIO (FLOODLIGHTS FX) --- */}
          {/* Gradiente complexo simulando 4 refletores laterais e luz global */}
          <div className="stadium-lighting-fx" />
          
          {/* Brilho neon suave nas linhas do campo (efeito game) */}
          <div className="field-lines-neon-glow" />
          
        </div>
      </div>

      <style jsx>{`
        /* --- AMBIENTE 3D CINEMATOGRÁFICO --- */
        .perspective-wrapper {
          perspective: 2500px; /* Profundidade extrema para sensação de escala */
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 60px 0; /* Mais espaço para o campo "respirar" no 3D */
          overflow: hidden;
          background: radial-gradient(circle at center, #0a0a0a 0%, #000 100%); /* Fundo escuro total */
        }

        .fifa-stadium-experience {
          position: relative;
          width: 95%;
          max-width: 450px;
          aspect-ratio: 1 / 1.3; /* Proporção de game card, achatada pela perspectiva */
        }

        /* --- GROUND SHADOW --- */
        .field-shadow-3d {
          position: absolute;
          bottom: -50px;
          left: 5%;
          width: 90%;
          height: 80px;
          background: rgba(0, 0, 0, 0.85);
          border-radius: 50%;
          filter: blur(35px); /* Desfoque pesado para sombra flutuante realista */
          transform: rotateX(70deg);
          z-index: 1;
        }

        /* --- O MOCKUP DO CAMPO 3D (TILT CINEMÁTICO) --- */
        .field-tilt-cinematic {
          position: absolute;
          inset: 0;
          background: #143d14; /* Verde Escuro Base */
          border-radius: 16px;
          /* Inclinação acentuada no eixo X para deitar o campo e leve ângulo lateral em Y */
          transform: rotateX(45deg) rotateY(-8deg) rotateZ(0deg);
          transform-style: preserve-3d;
          
          /* Efeito de Espessura Lateral (Chassis do Game Card) */
          box-shadow: 
            -1px 1px 0 #111,
            -2px 2px 0 #111,
            -3px 3px 0 #222,
            -4px 4px 0 #222,
            -5px 5px 0 #333, /* Espessura lateral 3D */
            0 25px 50px rgba(0,0,0,0.9); /* Sombra projetada pesada do card */
          
          border: 4px solid rgba(255,255,255,0.05); /* Borda externa quase invisível do mockup */
          overflow: hidden;
          z-index: 2;
          transition: transform 0.5s ease-out; /* Suavidade para interações futuras */
        }

        /* --- ESTILIZAÇÃO DO GRAMADO HD REALISTA --- */
        .grass-pattern-hd {
          position: absolute;
          inset: 0;
          background-color: #1a521a; /* Verde Profundo */
          display: flex;
          flex-direction: column;
        }

        /* Sobreposição de Textura HD (Gramado Real) */
        .texture-overlay-hd {
          position: absolute;
          inset: 0;
          background-image: url(${TEXTURA_GRAMADO_HD});
          opacity: 0.25;
          mix-blend-mode: overlay;
          z-index: 1;
        }

        /* Sobreposição de Micro Textura de Brilho (Estádio) */
        .texture-overlay-stadium-brilliance {
            position: absolute;
            inset: 0;
            background-image: url(${EFEITO_LUMINOSO_ESTADIO});
            opacity: 0.1;
            mix-blend-mode: color-dodge;
            z-index: 2;
        }

        /* Faixas Horizontais (Corte Profissional) */
        .grass-stripe-h-hd {
          flex: 1;
          width: 100%;
          z-index: 0;
        }
        .grass-stripe-h-hd:nth-child(even) {
          background-color: #216621; /* Verde Médio */
        }

        /* Faixas Verticais (Padrão Xadrez Profundo) */
        .vertical-stripes-container-hd {
          position: absolute;
          inset: 0;
          display: flex;
          mix-blend-mode: soft-light; /* Blend sutil para não sobrecarregar */
          opacity: 0.4;
          z-index: 1;
        }

        .grass-stripe-v-hd {
          flex: 1;
          height: 100%;
        }
        .grass-stripe-v-hd:nth-child(even) {
          background-color: rgba(0, 0, 0, 0.4); /* Escurece para o xadrez */
        }

        /* Efeito de Brilho de Água/Suor no Gramado (FIFA Style) */
        .grass-wet-reflection {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%, rgba(255,255,255,0.05) 100%);
          mix-blend-mode: plus-lighter;
          opacity: 0.6;
          z-index: 2;
        }

        /* --- MARCAÇÕES BRANCAS CRISTALINAS (HD) --- */
        .field-lines-crisp {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 3;
        }

        .border-lines-crisp {
          position: absolute;
          inset: 20px; /* Mais margem para as linhas não encostarem na borda */
          border: 3px solid rgba(255,255,255,0.9);
          filter: drop-shadow(0 0 2px rgba(255,255,255,0.5)); /* Leve difusão */
        }

        .mid-line-crisp {
          position: absolute;
          top: 50%;
          left: 20px;
          right: 20px;
          height: 3px;
          background: rgba(255,255,255,0.9);
          transform: translateY(-50%);
        }

        .center-circle-crisp {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px; /* Círculo maior para escala */
          height: 100px;
          border: 3px solid rgba(255,255,255,0.9);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .center-point-crisp, .penalty-point-crisp {
          position: absolute;
          width: 6px;
          height: 6px;
          background: #fff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px #fff;
        }

        /* Áreas de Pênalti HD */
        .penalty-area-crisp {
          position: absolute;
          left: 20px;
          right: 20px;
          height: 28%; /* Áreas maiores para realismo */
          display: flex;
          justify-content: center;
        }
        
        .penalty-area-crisp.top {
          top: 20px;
        }

        .penalty-area-crisp.bottom {
          bottom: 20px;
          transform: rotate(180deg);
        }

        .goal-area-crisp {
          position: absolute;
          top: 0;
          width: 65%;
          height: 100%;
          border: 3px solid rgba(255,255,255,0.9);
          border-top: none;
        }

        .penalty-arc-crisp {
          position: absolute;
          bottom: -30px;
          width: 70px;
          height: 50px;
          border: 3px solid rgba(255,255,255,0.9);
          border-radius: 50%;
          clip-path: inset(50% 0 0 0); /* Corta metade */
        }

        .penalty-point-crisp {
          top: 75%;
        }

        /* --- ILUMINAÇÃO DRAMÁTICA DE ESTÁDIO (FLOODLIGHTS FX) --- */
        .stadium-lighting-fx {
          position: absolute;
          inset: 0;
          /* Gradiente radial complexo simulando luz vindo de múltiplos refletores laterais */
          background: 
            radial-gradient(circle at 10% 10%, rgba(255, 253, 230, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 90% 10%, rgba(230, 253, 255, 0.25) 0%, transparent 50%),
            radial-gradient(circle at 10% 90%, rgba(230, 255, 230, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(255, 230, 253, 0.15) 0%, transparent 50%),
            radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 70%);
          mix-blend-mode: screen; /* Brilho em cima do gramado */
          pointer-events: none;
          z-index: 4;
        }

        /* Brilho Neon suave nas linhas (Estilo Game Card Premium) */
        .field-lines-neon-glow {
            position: absolute;
            inset: 20px;
            border: 2px solid rgba(255,255,255,0.05);
            border-radius: 4px;
            box-shadow: 0 0 25px rgba(255,255,255,0.15); /* Difusão de luz suave no gramado */
            pointer-events: none;
            z-index: 5;
        }
      `}</style>
    </div>
  );
}
