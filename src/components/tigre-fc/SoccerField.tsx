'use client';

import React from 'react';

interface SoccerFieldProps {
  formation: string;
  lineup: any;
  setLineup: (val: any) => void;
}

export default function SoccerField({ formation, lineup, setLineup }: SoccerFieldProps) {
  return (
    <div className="flex-1 relative w-full bg-green-900/20 min-h-[400px] rounded-3xl border border-white/5 overflow-hidden">
      {/* Gramado Simbólico */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <div className="w-64 h-64 border-4 border-white rounded-full" />
        <div className="absolute h-full w-px bg-white" />
      </div>
      
      <div className="relative z-10 p-4 text-center">
        <span className="text-xs font-black uppercase tracking-widest text-white/30">
          Campo de Jogo • {formation}
        </span>
        <p className="text-sm text-zinc-500 mt-2">Arraste os jogadores aqui ou selecione na lista.</p>
      </div>
    </div>
  );
}
