'use client';
import { motion } from 'framer-motion';
import { Player } from '@/types/futebol';

interface MarketListProps {
  players: Player[];
  isEscalado: (id: number) => boolean;
  onSelect: (p: Player) => void;
  onDragStart: (p: Player) => void;
  onDragEnd: (point: any) => void;
}

export function MarketList({ players, isEscalado, onSelect, onDragStart, onDragEnd }: MarketListProps) {
  return (
    <div className="w-72 border-r border-white/5 bg-zinc-900/50 p-4 overflow-y-auto space-y-2">
      <p className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mb-4">Elenco</p>
      {players.map(p => (
        <motion.div
          key={p.id}
          drag
          dragMomentum={false}
          onDragStart={() => onDragStart(p)}
          onDragEnd={(_, info) => onDragEnd(info.point)}
          onClick={() => onSelect(p)}
          className={`relative h-16 rounded-lg overflow-hidden border-2 flex items-stretch transition-all cursor-grab active:cursor-grabbing ${
            isEscalado(p.id) ? 'opacity-30 border-yellow-500/50 grayscale' : 'border-white/10 bg-zinc-900/80 hover:border-white/30'
          }`}
        >
          <div className="w-14 bg-black flex-shrink-0">
            <img src={p.foto} className="w-full h-full object-cover" style={{ objectPosition: '50% 10%' }} />
          </div>
          <div className="flex-1 flex flex-col justify-center px-3 min-w-0">
            <p className="text-[10px] font-black text-white uppercase truncate">{p.name}</p>
            <p className="text-[8px] text-yellow-500 font-bold">{p.pos} • {p.num}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
