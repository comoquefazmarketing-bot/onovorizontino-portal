'use client';

import React from 'react';

// Fundo de textura de gramado realista para dar profundidade
const TEXTURA_GRAMADO = 'https://www.transparenttextures.com/patterns/dark-dotted-2.png';

export default function CampoFifa() {
  return (
    <div className="perpetive-wrapper">
      <div className="fifa-field">
        {/* Sombra projetada do campo para dar efeito de flutuação 3D */}
        <div className="field-shadow" />
        
        {/* Container principal do campo com perspectiva aplicada */}
        <div className="field-tilt">
          
          {/* O Gramado com Efeito Quadriculado (Padrão FIFA) */}
          <div className="grass-pattern">
            <div className="texture-overlay" />
            
            {/* Faixas Horizontais (Quadriculado Base) */}
            {[...Array(10)].map((_, i) => (
              <div key={`h-${i}`} className="grass-stripe-h" />
            ))}
            
            {/* Faixas Verticais (Completando o Quadriculado) */}
            <div className="vertical-stripes-container">
              {[...Array(6)].map((_, i) => (
                <div key={`v-${i}`} className="grass-stripe-v" />
              ))}
            </div>
          </div>

          {/* Marcações Brancas do Campo (Em Perspectiva) */}
          <div className="field-lines">
            {/* Linhas Periféricas e Linha Central */}
            <div className="border-lines" />
            <div className="mid-line" />
            
            {/* Círculo Central com Ponto de Partida */}
            <div className="center-circle">
              <div className="center-point" />
            </div>
            
            {/* Grande Área Superior (Ataque) */}
            <div className="penalty-area top">
              <div className="goal-area" />
              <div className="penalty-arc" />
              <div className="penalty-point" />
            </div>
            
            {/* Grande Área Inferior (Defesa) */}
            <div className="penalty-area bottom">
              <div className="goal-area" />
              <div className="penalty-arc" />
              <div className="penalty-point" />
            </div>
          </div>

          {/* Efeito de Iluminação Global (Suntlight/Stadium Floodlights) */}
          <div className="lighting-fx" />
        </div>
      </div>

      <style jsx>{`
        /* Container que define a perspectiva 3D do ambiente */
        .perpetive-wrapper {
          perspective: 2000px;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 40px 0;
          overflow: hidden;
        }

        .fifa-field {
          position: relative;
          width: 90%;
          max-width: 400px;
          /* Aspect ratio levemente achatado pela perspectiva */
          aspect-ratio: 1 / 1.2; 
        }

        /* Sombra suave abaixo do campo para efeito de elevação */
        .field-shadow {
          position: absolute;
          bottom: -30px;
          left: 5%;
          width: 90%;
          height: 50px;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          filter: blur(20px);
          transform: rotateX(60deg);
          z-index: 1;
        }

        /* O elemento que sofre a rotação e inclinação 3D */
        .field-tilt {
          position: absolute;
          inset: 0;
          background: #1a4a1a; /* Verde base caso a textura falhe */
          border-radius: 12px;
          /* Rotação no eixo X para deitar o campo e Y para leve ângulo lateral */
          transform: rotateX(40deg) rotateY(-5deg) rotateZ(0deg);
          transform-style: preserve-3d;
          box-shadow: 
            0 5px 0 #111, /* Espessura lateral do mockup */
            0 15px 30px rgba(0,0,0,0.7);
          border: 4px solid #fff; /* Linha lateral branca do mockup */
          overflow: hidden;
          z-index: 2;
        }

        /* --- Estilização do Gramado --- */
        .grass-pattern {
          position: absolute;
          inset: 0;
          background-color: #1e5c1e; /* Verde Escuro */
          display: flex;
          flex-direction: column;
        }

        /* Sobreposição de textura para realismo */
        .texture-overlay {
          position: absolute;
          inset: 0;
          background-image: url(${TEXTURA_GRAMADO});
          opacity: 0.3;
          mix-blend-mode: overlay;
        }

        /* Faixas Horizontais Alternadas */
        .grass-stripe-h {
          flex: 1;
          width: 100%;
        }
        .grass-stripe-h:nth-child(even) {
          background-color: #246b24; /* Verde Claro */
        }

        /* Container de faixas verticais com blend mode para criar o xadrez */
        .vertical-stripes-container {
          position: absolute;
          inset: 0;
          display: flex;
          mix-blend-mode: soft-light;
          opacity: 0.5;
        }

        .grass-stripe-v {
          flex: 1;
          height: 100%;
        }
        .grass-stripe-v:nth-child(even) {
          background-color: rgba(0, 0, 0, 0.3); /* Escurece para criar o xadrez */
        }

        /* --- Estilização das Marcações Brancas --- */
        .field-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        /* Linhas externas com brilho neon suave */
        .border-lines {
          position: absolute;
          inset: 15px;
          border: 2px solid rgba(255,255,255,0.8);
          box-shadow: 0 0 10px rgba(255,255,255,0.3);
        }

        .mid-line {
          position: absolute;
          top: 50%;
          left: 15px;
          right: 15px;
          height: 2px;
          background: rgba(255,255,255,0.8);
          transform: translateY(-50%);
        }

        .center-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 80px;
          height: 80px;
          border: 2px solid rgba(255,255,255,0.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .center-point, .penalty-point {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #fff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        /* Áreas de Pênalti */
        .penalty-area {
          position: absolute;
          left: 15px;
          right: 15px;
          height: 25%;
          display: flex;
          justify-content: center;
        }
        
        .penalty-area.top {
          top: 15px;
        }

        .penalty-area.bottom {
          bottom: 15px;
          transform: rotate(180deg); /* Rotaciona a área inferior */
        }

        /* A "caixa" da grande área */
        .goal-area {
          position: absolute;
          top: 0;
          width: 60%;
          height: 100%;
          border: 2px solid rgba(255,255,255,0.8);
          border-top: none;
        }

        /* O arco da lua da área */
        .penalty-arc {
          position: absolute;
          bottom: -20px;
          width: 50px;
          height: 40px;
          border: 2px solid rgba(255,255,255,0.8);
          border-radius: 50%;
          clip-path: inset(50% 0 0 0); /* Corta metade do círculo */
        }

        .penalty-point {
          top: 70%; /* Posicionamento do ponto do pênalti */
        }

        /* --- Efeito de Iluminação (FIFA Style) --- */
        .lighting-fx {
          position: absolute;
          inset: 0;
          /* Gradiente radial simulando luz de refletores vindo do topo-direita */
          background: radial-gradient(
            circle at 80% 20%, 
            rgba(255, 255, 255, 0.2) 0%, 
            transparent 60%
          );
          mix-blend-mode: screen;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
