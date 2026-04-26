'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

const PATA = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

type Player = {
  id: number;
  short: string;
  pos: string;
  foto: string;
  num: number;
};

type Slot = { id: string; x: number; y: number; pos: string };

type Perfil = {
  id: string;
  display_name: string;
  apelido?: string | null;
  avatar_url?: string | null;
  xp?: number;
  nivel?: string;
  pontos_total?: number;
  streak?: number;
  bio?: string | null;
};

type EscalacaoData = {
  formacao: string;
  lineup_json: Record<string, Player | null>;
  capitan_id?: number | null;
  heroi_id?: number | null;
  updated_at?: string;
};

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id: 'gk', x: 50, y: 88, pos: 'GOL' },
    { id: 'rb', x: 82, y: 68, pos: 'LAT' },
    { id: 'cb1', x: 62, y: 75, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 75, pos: 'ZAG' },
    { id: 'lb', x: 18, y: 68, pos: 'LAT' },
    { id: 'dm1', x: 35, y: 57, pos: 'MEI' },
    { id: 'dm2', x: 65, y: 57, pos: 'MEI' },
    { id: 'am1', x: 50, y: 38, pos: 'MEI' },
    { id: 'rw', x: 80, y: 27, pos: 'ATA' },
    { id: 'lw', x: 20, y: 27, pos: 'ATA' },
    { id: 'st', x: 50, y: 13, pos: 'ATA' },
  ],
  '4-3-3': [
    { id: 'gk', x: 50, y: 85, pos: 'GOL' },
    { id: 'rb', x: 82, y: 65, pos: 'LAT' },
    { id: 'cb1', x: 62, y: 72, pos: 'ZAG' },
    { id: 'cb2', x: 38, y: 72, pos: 'ZAG' },
    { id: 'lb', x: 18, y: 65, pos: 'LAT' },
    { id: 'm1', x: 50, y: 50, pos: 'MEI' },
    { id: 'm2', x: 75, y: 42, pos: 'MEI' },
    { id: 'm3', x: 25, y: 42, pos: 'MEI' },
    { id: 'st', x: 50, y: 13, pos: 'ATA' },
    { id: 'rw', x: 80, y: 20, pos: 'ATA' },
    { id: 'lw', x: 20, y: 20, pos: 'ATA' },
  ],
};

const POS_CORES: Record<string, string> = {
  GOL: '#F5C400',
  ZAG: '#3B82F6',
  LAT: '#06B6D4',
  MEI: '#22C55E',
  ATA: '#EF4444',
};

function CampoVisual({
  formacao,
  lineup,
  captainId,
}: {
  formacao: string;
  lineup: Record<string, Player | null>;
  captainId?: number | null;
}) {
  const slots = FORMATIONS[formacao] ?? FORMATIONS['4-2-3-1'];

  return (
    <div className="relative w-full aspect-[7/10] rounded-2xl overflow-hidden border border-yellow-500/10 bg-zinc-950">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/green-dust.png')]" />
      {slots.map((slot) => {
        const player = lineup[slot.id] ?? null;
        const isCap = player?.id === captainId;

        return (
          <div
            key={slot.id}
            className="absolute flex flex-col items-center gap-1"
            style={{ left: `${slot.x}%`, top: `${slot.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {player ? (
              <div className="relative">
                {isCap && (
                  <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-[8px] font-black px-1 rounded-sm z-10">
                    C
                  </span>
                )}
                <div
                  className="w-9 h-9 rounded-full border-2 overflow-hidden bg-black"
                  style={{ borderColor: POS_CORES[player.pos] }}
                >
                  <img src={player.foto} className="w-full h-full object-cover" alt={player.short} />
                </div>
                <div className="bg-black/80 text-[8px] font-bold px-1 rounded mt-0.5 text-center truncate w-10">
                  {player.short}
                </div>
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-[8px] text-white/20">
                {slot.pos[0]}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface TigreFCPerfilPublicoProps {
  targetUsuarioId: string;
  viewerUsuarioId?: string | null;
  onClose: () => void;
}

export default function TigreFCPerfilPublico({
  targetUsuarioId,
  viewerUsuarioId,
  onClose,
}: TigreFCPerfilPublicoProps) {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [escalacao, setEscalacao] = useState<EscalacaoData | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function loadPerfil() {
      setLoading(true);

      const { data: u } = await supabase
        .from('tigre_fc_usuarios')
        .select('*')
        .eq('id', targetUsuarioId)
        .maybeSingle();

      if (u) setPerfil(u);

      const { data: esc } = await supabase
        .from('tigre_fc_escalacoes')
        .select('*')
        .eq('usuario_id', targetUsuarioId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (esc) setEscalacao(esc as EscalacaoData);

      setLoading(false);
    }

    loadPerfil();
  }, [targetUsuarioId]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-zinc-900 w-full max-w-sm rounded-[32px] border border-white/10 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
      >
        {loading ? (
          <p className="text-center italic text-zinc-500 py-12">Carregando Arena...</p>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-yellow-500">
                <img
                  src={perfil?.avatar_url || PATA}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <div>
                <h2 className="text-2xl font-black italic uppercase text-white">
                  {perfil?.apelido || perfil?.display_name || 'Torcedor'}
                </h2>
                <p className="text-yellow-500 font-bold text-xs uppercase tracking-widest">
                  {perfil?.nivel || 'Novato'}
                </p>
              </div>
            </div>

            <CampoVisual
              formacao={escalacao?.formacao || '4-2-3-1'}
              lineup={escalacao?.lineup_json || {}}
              captainId={escalacao?.capitan_id}
            />

            <button
              onClick={onClose}
              className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-colors"
            >
              Fechar Perfil
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
