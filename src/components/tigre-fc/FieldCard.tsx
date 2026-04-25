'use client';
import { motion } from 'framer-motion';
import { Player } from '@/types/futebol';

interface FieldCardProps {
  player: Player | null;
  label: string;
  scale: number;
  isSelected: boolean;
  isOrigin: boolean;
  fieldRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: (info: any) => void;
}

export function FieldCard({ player, label, scale, isSelected, isOrigin, fieldRef, onClick, onDragStart, onDragEnd }: FieldCardProps) {
  const size = 78 * scale;
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={fieldRef}
      onDragStart={onDragStart}
      onDragEnd={(_, info) => onDragEnd(info.point)}
      onClick={onClick}
      style={{ width: size, height: size * 1.3, zIndex: isSelected || isOrigin ? 100 : 10 }}
      className={`relative rounded-xl overflow-hidden border-2 transition-all flex flex-col items-center justify-center cursor-move ${
        isOrigin ? 'border-cyan-400 shadow-[0_0_20px_cyan]' :
        isSelected ? 'border-yellow-400 shadow-[0_0_20px_yellow]' :
        player ? 'border-white/40 bg-black/40' : 'border-dashed border-white/20 bg-black/20'
      }`}
    >
      {player ? (
        <>
          <img src={player.foto} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: '50% 15%' }} />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-0 w-full p-1 text-center">
            <p className="text-[9px] font-black text-white uppercase truncate">{player.short}</p>
            <p className="text-[7px] text-yellow-500 font-black">{player.pos}</p>
          </div>
        </>
      ) : (
        <span className="text-[10px] font-black text-white/20 uppercase tracking-tighter">{label}</span>
      )}
    </motion.div>
  );
}
