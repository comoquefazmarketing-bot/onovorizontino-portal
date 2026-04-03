'use client';

/**
 * TigreFCPerfilPublico
 * * Permite que qualquer usuário veja a escalação de outro jogador com estética FIFA 26.
 * Engajamento: botão de "Corneta" para provocação amigável.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import confetti from 'canvas-confetti';

// --- CONSTANTES DE NÍVEL (Embutidas para evitar erro de build) ---
const NIVEL_CORES: Record<string, string> = {
  'Bronze': '#CD7F32',
  'Prata': '#C0C0C0',
  'Ouro': '#F5C400',
  'Platina': '#E5E4E2',
  'Diamante': '#00F3FF',
  'Mestre': '#9D4EDD',
  'Lenda': '#FF0054',
  'Novato': '#71717A'
};

const NIVEL_ICONES: Record<string, string> = {
  'Bronze': '🥉', 'Prata': '🥈', 'Ouro': '🥇', 'Platina': '💎', 'Diamante': '💠', 'Mestre': '🔮', 'Lenda': '👑', 'Novato': '🌱'
};

// --- Tipos ---
type Player = {
  id: number; short: string; pos: string; foto: string; num: number;
};

type FormationSlot = { id: string; x: number; y: number; pos: string };

const ESCUDO_TIGRE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDOS/novorizontino.png';
const PATA_LOGO    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const FORMATIONS: Record<string, FormationSlot[]> = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 58, pos: 'MEI' }, { id: 'dm2', x: 65, y: 58, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' }, { id: 'rw', x: 82, y: 30, pos: 'ATA' }, { id: 'lw', x: 18, y: 30, pos: 'ATA' },
    { id: 'st', x: 50, y: 15, pos: 'ATA' }
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 85, pos: 'GOL' },
    { id: 'rb', x: 82, y: 65, pos: 'LAT' }, { id: 'cb1', x: 62, y: 72, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 72, pos: 'ZAG' }, { id: 'lb', x: 18, y: 65, pos: 'LAT' },
    { id: 'm1', x: 50, y: 50, pos: 'MEI' }, { id: 'm2', x: 75, y: 42, pos: 'MEI' }, { id: 'm3', x: 25, y: 42, pos: 'MEI' },
    { id: 'st', x: 50, y: 12, pos: 'ATA' }, { id: 'rw', x: 82, y: 20, pos: 'ATA' }, { id: 'lw', x: 18, y: 20, pos: 'ATA' }
  ],
  '4-4-2': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 85, y: 68, pos: 'LAT' }, { id: 'cb1', x: 62, y: 75, pos: 'ZAG' }, { id: 'cb2', x: 38, y: 75, pos: 'ZAG' }, { id: 'lb', x: 15, y: 68, pos: 'LAT' },
    { id: 'm1', x: 20, y: 48, pos: 'MEI' }, { id: 'm2', x: 40, y: 48, pos: 'MEI' }, { id: 'm3', x: 60, y: 48, pos: 'MEI' }, { id: 'm4', x: 80, y: 48, pos: 'MEI' },
    { id: 'st1', x: 35, y: 18, pos: 'ATA' }, { id: 'st2', x: 65, y: 18, pos: 'ATA' }
  ]
};

const CORNETAS = [
  '📯 Essa escalação tá de chorar! 😂',
  '🔥 Caprichoso, hein? Minha avó escala melhor!',
  '⚡ Aposta aí que eu ganho de vocês!',
  '🦁 Isso é time? Parece pelada de domingo!',
  '👑 Copiou o meu esquema e ainda errou!',
  '🏆 Com esse time você não ganha nem no videogame!',
];

// --- Sub-componente Card do Jogador ---
function MiniPlayerCard({ player, isCaptain, isHero }: { player: Player; isCaptain: boolean; isHero: boolean }) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} className="flex flex-col items-center">
      <div className={`relative w-10 h-14 rounded-md overflow-hidden border-2 shadow-lg ${
        isCaptain ? 'border-yellow-500 shadow-yellow-500/50' :
        isHero    ? 'border-cyan-400  shadow-cyan-400/50'  :
                    'border-zinc-700'
      }`}>
        <img src={player.foto} className="w-full h-full object-cover object-top" alt={player.short} />
        {isCaptain && <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[6px] font-black px-1 rounded-bl leading-tight">C</div>}
        {isHero && <div className="absolute top-0 right-0 bg-cyan-400 text-black text-[6px] font-black px-1 rounded-bl leading-tight">H</div>}
        <div className="absolute bottom-0 w-full bg-black/90 text-center py-[2px]">
          <span className="text-white text-[6px] font-black uppercase truncate block px-0.5">{player.short}</span>
        </div>
      </div>
    </motion.div>
  );
}

// --- Componente Principal ---
interface PerfilPublicoProps {
  targetUsuarioId: string;
  viewerUsuarioId?: string | null;
}

export default function TigreFCPerfilPublico({ targetUsuarioId, viewerUsuarioId }: PerfilPublicoProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [dados, setDados] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [corneta, setCorneta] = useState<string | null>(null);
  const [cornetaCount, setCornetaCount] = useState(0);

  const isSelfView = viewerUsuarioId === targetUsuarioId;

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const { data } = await supabase
        .from('tigre_fc_escalacoes')
        .select(`
          formacao, lineup_json, capitan_id, heroi_id,
          score_tigre, score_adv, score_locked, updated_at,
          tigre_fc_usuarios ( display_name, avatar_url, xp, nivel )
        `)
        .eq('usuario_id', targetUsuarioId)
        .maybeSingle();

      setDados(data);
      setIsLoading(false);
    }
    load();
  }, [targetUsuarioId, supabase]);

  const dispararCorneta = useCallback(() => {
    const msg = CORNETAS[Math.floor(Math.random() * CORNETAS.length)];
    setCorneta(msg);
    setCornetaCount(c => c + 1);
    setTimeout(() => setCorneta(null), 3500);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#F5C400', '#00F3FF', '#ffffff'],
    });
  }, []);

  if (isLoading) return (
    <div className="flex items-center justify-center h-96 bg-black rounded-[2rem] border border-zinc-900">
      <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!dados) return (
    <div className="flex flex-col items-center justify-center h-64 bg-zinc-950 rounded-[2rem] border border-zinc-900 p-8 text-center">
      <p className="text-zinc-500 font-black uppercase tracking-tighter italic">Este torcedor ainda não escalou o Tigre!</p>
    </div>
  );

  const perfil = dados.tigre_fc_usuarios ?? {};
  const nivelCor = NIVEL_CORES[perfil.nivel ?? 'Novato'];
  const nivelIcon = NIVEL_ICONES[perfil.nivel ?? 'Novato'];
  const slots = FORMATIONS[dados.formacao] ?? FORMATIONS['4-2-3-1'];
  const lineup = (dados.lineup_json ?? {}) as Record<string, Player>;

  return (
    <div className="relative bg-black rounded-[2rem] border border-zinc-800 overflow-hidden shadow-2xl">
      
      {/* HEADER FIFA STYLE */}
      <div className="p-6 border-b border-zinc-800 bg-gradient-to-b from-zinc-900 to-black flex items-center gap-4">
        <div className="relative">
          <img 
            src={perfil.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${perfil.display_name}`} 
            className="w-16 h-16 rounded-full border-2 object-cover"
            style={{ borderColor: nivelCor, boxShadow: `0 0 15px ${nivelCor}44` }}
          />
          <div className="absolute -bottom-1 -right-1 bg-zinc-900 rounded-full p-1 text-xs border border-white/10">
            {nivelIcon}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-[1000] italic uppercase tracking-tighter text-white">{perfil.display_name}</h2>
            {isSelfView && <span className="text-[8px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black uppercase">VOCÊ</span>}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: nivelCor }}>{perfil.nivel} • {perfil.xp} XP</p>
        </div>

        {dados.score_locked && (
          <div className="text-right">
            <p className="text-[8px] text-zinc-500 font-black uppercase">Palpite</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black italic text-yellow-500">{dados.score_tigre}</span>
              <span className="text-xs text-zinc-700">X</span>
              <span className="text-2xl font-black italic text-zinc-400">{dados.score_adv}</span>
            </div>
          </div>
        )}
      </div>

      {/* CAMPO VIRTUAL */}
      <div className="p-4 relative">
        <div className="relative w-full aspect-[1/1.2] rounded-3xl overflow-hidden bg-[#1e5c1e] border-2 border-white/5">
          <div className="absolute inset-0 opacity-20 bg-repeat" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/dark-dotted-2.png')` }} />
          {/* Linhas do campo */}
          <div className="absolute inset-4 border border-white/20 rounded-lg" />
          <div className="absolute top-1/2 w-full h-[1px] bg-white/20" />
          <div className="absolute top-1/2 left-1/2 w-20 h-20 border border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2" />

          {/* Jogadores Renderizados */}
          {slots.map(slot => (
            <div key={slot.id} className="absolute -translate-x-1/2 -translate-y-1/2 z-10" style={{ left: `${slot.x}%`, top: `${slot.y}%` }}>
              {lineup[slot.id] ? (
                <MiniPlayerCard 
                  player={lineup[slot.id]} 
                  isCaptain={lineup[slot.id].id === dados.capitan_id} 
                  isHero={lineup[slot.id].id === dados.heroi_id} 
                />
              ) : (
                <div className="w-8 h-10 rounded border border-dashed border-white/10 flex items-center justify-center">
                  <span className="text-[5px] text-white/20 font-bold">{slot.pos}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* BOTÃO CORNETA */}
      {!isSelfView && (
        <div className="p-6 pt-0">
          <button 
            onClick={dispararCorneta}
            className="w-full py-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl font-[1000] uppercase italic tracking-widest text-zinc-400 hover:text-yellow-500 hover:border-yellow-500 transition-all active:scale-95 shadow-xl"
          >
            📯 CORNETAR TIME {cornetaCount > 0 && `(${cornetaCount})`}
          </button>

          <AnimatePresence>
            {corneta && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center"
              >
                <p className="text-yellow-500 text-xs font-black italic">{corneta}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Branding Final */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20 pointer-events-none">
        <img src={PATA_LOGO} className="w-3 h-3 grayscale" />
        <span className="text-[8px] font-black uppercase tracking-tighter">Tigre FC • Felipe Makarios</span>
      </div>
    </div>
  );
}
