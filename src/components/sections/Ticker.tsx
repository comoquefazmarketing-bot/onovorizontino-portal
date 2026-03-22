'use client';
import React from 'react';

export default function Ticker() {
  const frases = [
    "O ACESSO É QUESTÃO DE HONRA!",
    "O MAIOR DA 017!",
    "SANGUE AURINEGRO!",
    "DE TORCEDOR PRA TORCEDOR!",
    "RUGIDO QUE ECOA EM TODO O BRASIL!",
    "SUBIR NÃO É OPÇÃO, É REPARAÇÃO!",
    "PORTAL O NOVORIZONTINO: A FORÇA DO INTERIOR!"
  ];
  
  const tickerStyles = `
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-ticker-elite {
      animation: marquee 90s linear infinite;
    }
  `;

  return (
    <div className="relative w-full bg-yellow-500 z-[999] border-b-2 border-black overflow-hidden h-7 flex items-center shadow-2xl">
      <style dangerouslySetInnerHTML={{ __html: tickerStyles }} />
      <div className="flex whitespace-nowrap animate-ticker-elite">
        {[...Array(6)].map((_, i) => (
          <React.Fragment key={i}>
            {frases.map((f, idx) => (
              <span key={idx} className="text-black font-black uppercase italic text-[11px] px-6 flex items-center">
                {f} <span className="ml-6 flex gap-1 text-[10px]">🟡⚫</span>
              </span>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}