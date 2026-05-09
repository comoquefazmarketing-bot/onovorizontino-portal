'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

const GOLD  = '#F5C400';
const CYAN  = '#00F3FF';
const PATA  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const FONT  = "'Barlow Condensed', system-ui, sans-serif";

type Usuario = {
  id: string;
  nome: string | null;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number | null;
  nivel: string | null;
};

const NIVEL_COLOR: Record<string, string> = {
  Recruta: 'rgba(255,255,255,0.3)',
  Torcedor: GOLD,
  Fanático: CYAN,
  Ultras: '#4FC3F7',
  Fiel: GOLD,
  Comandante: '#BF5FFF',
};

function nivelColor(nivel: string | null) {
  return NIVEL_COLOR[nivel ?? ''] ?? 'rgba(255,255,255,0.3)';
}

// ── Avatar do ranking ───────────────────────────────────────
function RankAvatar({ src, nome, nivel, size = 48 }: { src?: string | null; nome: string; nivel?: string | null; size?: number }) {
  const color = nivelColor(nivel ?? '');
  return (
    <div className="relative flex-shrink-0">
      <div className="rounded-xl overflow-hidden"
        style={{ width:size, height:size, border:`2px solid ${color}44`,
          boxShadow: nivel === 'Comandante' ? `0 0 12px #BF5FFF44` : 'none' }}>
        <img src={src ?? PATA} alt={nome} className="w-full h-full object-cover"
          onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }} />
      </div>
      {nivel && nivel !== 'Recruta' && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-px rounded text-[7px] font-black uppercase whitespace-nowrap leading-none"
          style={{ background: color === GOLD ? GOLD : color, color: color === GOLD || color === CYAN ? '#000' : '#fff',
            fontSize: 7 }}>
          {nivel}
        </div>
      )}
    </div>
  );
}

// ── Card do pódio (top 3) ───────────────────────────────────
function PodiumCard({ user, rank, onClick }: { user: Usuario; rank: 1 | 2 | 3; onClick: () => void }) {
  const displayNm = user.apelido ?? user.nome ?? 'TORCEDOR';
  const pts       = user.pontos_total ?? 0;

  const config = {
    1: { size: 72, height: 'h-24 sm:h-28', labelColor: GOLD, crown: '👑', z: 'z-10', scale: 'scale-105' },
    2: { size: 56, height: 'h-16 sm:h-20', labelColor: '#C0C0C0', crown: '🥈', z: 'z-0', scale: 'scale-100' },
    3: { size: 52, height: 'h-14 sm:h-16', labelColor: '#CD7F32', crown: '🥉', z: 'z-0', scale: 'scale-100' },
  }[rank];

  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 cursor-pointer ${config.z} ${config.scale}`}
      style={{ fontFamily: FONT }}
    >
      <span className="text-xl">{config.crown}</span>

      {/* Avatar */}
      <div className="relative">
        {rank === 1 && (
          <motion.div className="absolute -inset-2 rounded-2xl opacity-30"
            animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
        )}
        <div className="relative rounded-2xl overflow-hidden"
          style={{
            width: config.size, height: config.size,
            border: `3px solid ${config.labelColor}`,
            boxShadow: rank === 1 ? `0 0 24px rgba(245,196,0,0.5)` : 'none',
          }}>
          <img src={user.avatar_url ?? PATA} alt={displayNm}
            className="w-full h-full object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }} />
        </div>
        <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
          style={{ background: config.labelColor, color: '#000' }}>
          {rank}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-black italic leading-none tabular-nums" style={{ color: config.labelColor }}>{pts}</div>
        <div className="text-[8px] font-black text-zinc-500 tracking-wider">PTS</div>
        <div className="text-xs font-black text-white mt-0.5 max-w-[72px] truncate">{displayNm}</div>
      </div>

      {/* Pedestal */}
      <div className={`w-full ${config.height} rounded-t-xl flex items-end justify-center pb-1`}
        style={{
          background: rank === 1
            ? `linear-gradient(180deg, rgba(245,196,0,0.15) 0%, rgba(245,196,0,0.06) 100%)`
            : `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)`,
          border: `1px solid ${config.labelColor}22`,
          borderBottom: 'none',
          minWidth: 72,
        }}>
        <span className="text-[9px] font-black tracking-[2px] opacity-30" style={{ color: config.labelColor }}>#{rank}</span>
      </div>
    </motion.button>
  );
}

// ── Linha do ranking ────────────────────────────────────────
function RankRow({ user, rank, isMe, onView }: { user: Usuario; rank: number; isMe: boolean; onView: () => void }) {
  const displayNm = user.apelido ?? user.nome ?? 'TORCEDOR';
  const pts       = user.pontos_total ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.04 }}
      className="flex items-center gap-3 px-3 py-2.5 rounded-2xl cursor-pointer transition-all"
      style={{
        background: isMe
          ? `linear-gradient(90deg, rgba(245,196,0,0.1), rgba(245,196,0,0.04))`
          : 'rgba(255,255,255,0.03)',
        border: isMe ? `1px solid rgba(245,196,0,0.3)` : '1px solid rgba(255,255,255,0.05)',
      }}
      onClick={onView}
      whileTap={{ scale: 0.99 }}
    >
      {/* Rank # */}
      <div className="w-7 text-center flex-shrink-0">
        <span className="text-xs font-black italic text-zinc-600">#{rank}</span>
      </div>

      {/* Avatar */}
      <RankAvatar src={user.avatar_url} nome={displayNm} nivel={user.nivel} size={36} />

      {/* Nome */}
      <div className="flex-1 min-w-0">
        <div className="font-black text-sm uppercase truncate" style={{ color: isMe ? GOLD : '#fff' }}>
          {displayNm}
          {isMe && <span className="ml-1.5 text-[8px] tracking-wider opacity-60">VOCÊ</span>}
        </div>
        {user.nivel && (
          <div className="text-[8px] font-bold tracking-wider" style={{ color: nivelColor(user.nivel) }}>
            {user.nivel.toUpperCase()}
          </div>
        )}
      </div>

      {/* Pontos */}
      <div className="text-right flex-shrink-0 mr-1">
        <div className="text-lg font-black italic leading-none tabular-nums" style={{ color: isMe ? GOLD : '#fff' }}>{pts}</div>
        <div className="text-[8px] text-zinc-600 font-bold tracking-wider">PTS</div>
      </div>

      {/* Ver btn */}
      <div className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </div>
    </motion.div>
  );
}

// ── Página principal ────────────────────────────────────────
export default function TigreFCRankingPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [meuTfcId, setMeuTfcId] = useState<string | null>(null);
  const [jogoRodada, setJogoRodada] = useState<string | null>(null);
  const [perfil,   setPerfil]   = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      // Auth
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: tfcu } = await supabase
          .from('tigre_fc_usuarios').select('id').eq('google_id', user.id).maybeSingle();
        if (!cancelled && tfcu) setMeuTfcId(tfcu.id);
      }

      // Ranking completo
      const { data: rank } = await supabase
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total, nivel')
        .order('pontos_total', { ascending: false })
        .limit(100);
      if (!cancelled && rank) setUsuarios(rank as Usuario[]);

      // Rodada atual
      fetch('/api/proximo-jogo')
        .then(r => r.json())
        .then(d => { if (!cancelled && d?.jogos?.[0]?.rodada) setJogoRodada(d.jogos[0].rodada); })
        .catch(() => {});

      if (!cancelled) setLoading(false);
    }
    init();
    return () => { cancelled = true; };
  }, []);

  const top3 = usuarios.slice(0, 3);
  const rest = usuarios.slice(3);

  return (
    <main className="min-h-screen pb-24" style={{ background:'#050505', fontFamily: FONT, color:'#fff' }}>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');`}</style>

      {/* Header */}
      <div className="sticky top-0 z-40 px-4 pt-10 pb-4"
        style={{ background:'linear-gradient(180deg, #050505 70%, transparent)' }}>
        <div className="max-w-lg mx-auto">
          {/* Breadcrumb */}
          <a href="/tigre-fc" className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors mb-3 w-fit"
            style={{ fontSize:11, fontWeight:900, letterSpacing:'0.2em' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            TIGRE FC
          </a>

          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] font-black tracking-[5px] mb-1" style={{ color: GOLD }}>
                {jogoRodada ? `RODADA ${jogoRodada} ·` : ''} BRASILEIRÃO SÉRIE B
              </div>
              <h1 className="text-5xl sm:text-6xl font-black italic uppercase leading-none">
                RANKING
              </h1>
            </div>
            <div className="text-right mb-1">
              <div className="text-2xl font-black italic" style={{ color: GOLD }}>{usuarios.length}</div>
              <div className="text-[9px] text-zinc-500 font-black tracking-widest">TORCEDORES</div>
            </div>
          </div>

          {/* Linha dourada */}
          <div className="mt-3 h-px w-full" style={{ background:`linear-gradient(90deg, ${GOLD}80, transparent)` }} />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4">

        {loading ? (
          <div className="flex flex-col items-center gap-3 pt-20">
            <motion.div animate={{ rotate:360 }} transition={{ duration:1.5, repeat:Infinity, ease:'linear' }}
              className="w-10 h-10 border-2 border-t-transparent rounded-full"
              style={{ borderColor:`${GOLD}44`, borderTopColor:'transparent' }} />
            <span className="text-zinc-500 text-xs font-black tracking-widest">CARREGANDO RANKING...</span>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center pt-20">
            <div className="text-5xl mb-4">🐯</div>
            <div className="text-zinc-500 font-bold">Nenhum torcedor escalou ainda.</div>
          </div>
        ) : (
          <>
            {/* ── PÓDIO TOP 3 ── */}
            {top3.length >= 1 && (
              <div className="mb-8">
                <div className="text-[9px] font-black tracking-[5px] text-zinc-600 mb-5 text-center">MELHORES DO TORNEIO</div>
                <div className="flex items-end justify-center gap-3 sm:gap-5 px-2">
                  {/* 2º */}
                  {top3[1] && (
                    <PodiumCard user={top3[1]} rank={2}
                      onClick={() => setPerfil(top3[1].id)} />
                  )}
                  {/* 1º — centro */}
                  <PodiumCard user={top3[0]} rank={1}
                    onClick={() => setPerfil(top3[0].id)} />
                  {/* 3º */}
                  {top3[2] && (
                    <PodiumCard user={top3[2]} rank={3}
                      onClick={() => setPerfil(top3[2].id)} />
                  )}
                </div>
              </div>
            )}

            {/* ── LISTA ── */}
            {rest.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-[9px] font-black tracking-[5px] text-zinc-600">CLASSIFICAÇÃO GERAL</div>
                  <div className="flex-1 h-px bg-white/5" />
                </div>
                <div className="space-y-1.5">
                  {rest.map((u, i) => (
                    <RankRow
                      key={u.id}
                      user={u}
                      rank={i + 4}
                      isMe={u.id === meuTfcId}
                      onView={() => setPerfil(u.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state se só 3 */}
            {rest.length === 0 && top3.length > 0 && (
              <div className="text-center py-8 text-zinc-600 text-sm font-bold">
                Só os 3 melhores por enquanto — escale e entre no ranking!
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal perfil */}
      <AnimatePresence>
        {perfil && (
          <TigreFCPerfilPublico
            targetUsuarioId={perfil}
            viewerUsuarioId={meuTfcId}
            onClose={() => setPerfil(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
