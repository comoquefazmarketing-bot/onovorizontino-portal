'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

// ── Config de Imagens ───────────────────────────────────────────────────────
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const STORAGE_BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';

// caminho da silhueta FUT (viewBox 300x430) — usado na moldura
const FRAME = `M150 8 C110 8 70 14 40 26 C30 30 22 38 22 50 L22 360
  C22 388 60 410 150 424 C240 410 278 388 278 360 L278 50
  C278 38 270 30 260 26 C230 14 190 8 150 8 Z`;

type Rar = 'toty' | 'gold' | 'purple';
const RARITIES: Record<Rar, { bg: string; scrim: string; txt: string; stat: string; accent: string; flare: string; frame: 'gold' | 'silver' }> = {
  toty:   { bg: 'radial-gradient(120% 85% at 50% 16%, #1f2f66 0%, #0b1430 52%, #04030d 100%)', scrim: '#04030d', txt: '#ffe6a3', stat: '#ffe6a3', accent: '#FFD66B', flare: '#FFC24B', frame: 'gold' },
  gold:   { bg: 'radial-gradient(120% 85% at 50% 20%, #fbe7a0 0%, #d6a52a 46%, #b07d12 100%)', scrim: '#b8841a', txt: '#3a2900', stat: '#3a2900', accent: '#7a5800', flare: '#fff3c4', frame: 'gold' },
  purple: { bg: 'radial-gradient(120% 85% at 50% 18%, #6a2fb0 0%, #3b1170 54%, #160427 100%)', scrim: '#160427', txt: '#ffffff', stat: '#ffffff', accent: '#E9B6FF', flare: '#C77DFF', frame: 'silver' },
};

type Player = { nome: string; rating: number; pos: string; role: string; foto: string; rar: Rar };

// ── Jogadores com URLs ATUALIZADAS ──────────────────────────────────────────
const topPlayers: Player[] = [
  { 
    nome: 'Bianqui', 
    rating: 7.6, 
    pos: 'MC', 
    role: 'MELHOR EM CAMPO',  
    foto: `${STORAGE_BASE}/MATHEUS%20BIANQUI%20FUNDO%20TRANSPARENTE.png`, 
    rar: 'toty' 
  },
  { 
    nome: 'Juninho', 
    rating: 7.3, 
    pos: 'MC', 
    role: 'HERÓI DA PARTIDA', 
    foto: `${STORAGE_BASE}/JUNINHO%20FUNDO%20TRANSPARENTE.png`,        
    rar: 'gold' 
  },
];

const STAT_LABELS = ['PAC', 'SHO', 'PAS', 'DRI', 'DEF', 'PHY'];

function deriveStats(rating: number, nome: string) {
  const seed = [...nome].reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = Math.round(rating * 10);
  const offs = [6, 1, 9, 11, -10, 2]; // perfil de meio-campo (PAS/DRI altos)
  return STAT_LABELS.map((l, i) => ({ 
    l, 
    v: Math.max(54, Math.min(99, base + offs[i] + (((seed >> i) & 7) - 3))) 
  }));
}

function useCountUp(target: number, duration = 1000, decimals = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return decimals ? val.toFixed(decimals) : Math.round(val).toString();
}

const StatNum = ({ v, color }: { v: number; color: string }) => (
  <span className="tabular-nums font-black" style={{ color, fontSize: 22, lineHeight: 1 }}>
    {useCountUp(v, 900)}
  </span>
);

function FutCard({ player, index }: { player: Player; index: number }) {
  const r = RARITIES[player.rar];
  const stats = deriveStats(player.rating, player.nome);
  const ovr = useCountUp(Math.round(player.rating * 10), 1100);
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [11, -11]), { stiffness: 200, damping: 16 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-13, 13]), { stiffness: 200, damping: 16 });

  const onMove = (e: React.MouseEvent) => {
    const b = ref.current?.getBoundingClientRect(); if (!b) return;
    mx.set((e.clientX - b.left) / b.width - 0.5);
    my.set((e.clientY - b.top) / b.height - 0.5);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateY: -28 }}
      whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, type: 'spring', stiffness: 80, damping: 14 }}
      style={{ perspective: 1300 }}
      className="relative w-full max-w-[300px] mx-auto"
    >
      {/* glow externo */}
      <motion.div className="absolute -inset-4 rounded-[40px] blur-3xl"
        style={{ background: `radial-gradient(50% 50% at 50% 40%, ${r.flare}66, transparent 70%)` }}
        animate={{ opacity: [0.4, 0.75, 0.4] }} transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }} />

      <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative" >

        {/* aspecto FUT */}
        <div className="relative w-full" style={{ aspectRatio: '300 / 430' }}>

          {/* CONTEÚDO RECORTADO NA SILHUETA */}
          <div className="absolute inset-0 overflow-hidden" style={{ clipPath: 'url(#futShape)' }}>
            <div className="absolute inset-0" style={{ background: r.bg }} />

            {/* flares atrás do jogador */}
            <motion.div className="absolute inset-0" style={{
              background: `conic-gradient(from 200deg at 62% 30%, transparent, ${r.flare}55, transparent 30%, ${r.flare}33, transparent 55%)`,
              mixBlendMode: 'screen',
            }} animate={{ rotate: [0, 6, 0], opacity: [0.6, 1, 0.6] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute" style={{
                left: '58%', top: '22%', width: 4, height: 150, transformOrigin: 'top center',
                transform: `rotate(${-40 + i * 22}deg)`,
                background: `linear-gradient(${r.flare}, transparent)`, opacity: 0.5, filter: 'blur(1px)',
              }} />
            ))}

            {/* JOGADOR - IMG COM URL COMPLETA */}
            <img 
              src={player.foto} 
              alt={player.nome}
              className="absolute left-1/2 -translate-x-1/2 object-cover object-top"
              style={{
                top: '4%', height: '66%', width: '78%',
                maskImage: 'linear-gradient(#000 78%, transparent)',
                WebkitMaskImage: 'linear-gradient(#000 78%, transparent)',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,.5))',
              }}
              onError={(e) => { (e.target as HTMLImageElement).src = ESCUDO; }} 
            />

            {/* scrim inferior p/ legibilidade dos atributos */}
            <div className="absolute inset-0" style={{ background: `linear-gradient(transparent 46%, ${r.scrim} 72%)` }} />

            {/* brilho holográfico varrendo */}
            <div className="fut-shine absolute inset-0" />
          </div>

          {/* MOLDURA DOURADA (SVG por cima, fora do clip) */}
          <svg viewBox="0 0 300 430" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
            <path d={FRAME} fill="none" stroke={`url(#frame-${player.rar})`} strokeWidth={5} vectorEffect="non-scaling-stroke" />
            <path d={FRAME} fill="none" stroke="#00000033" strokeWidth={1} vectorEffect="non-scaling-stroke" transform="translate(11 15.8) scale(.926)" />
            <path d={FRAME} fill="none" stroke={`url(#frame-${player.rar})`} strokeWidth={2} vectorEffect="non-scaling-stroke" transform="translate(11 15.8) scale(.926)" />
          </svg>

          {/* ─── OVERLAYS DE TEXTO ─── */}
          <div className="absolute inset-0" style={{ transform: 'translateZ(55px)' }}>

            {/* OVR + posição */}
            <div className="absolute" style={{ left: '11%', top: '11%' }}>
              <div className="font-black italic tabular-nums leading-none" style={{ fontSize: 52, color: r.txt, textShadow: '0 2px 6px rgba(0,0,0,.45)' }}>{ovr}</div>
              <div className="font-black leading-none mt-0.5" style={{ fontSize: 20, color: r.txt, letterSpacing: 1 }}>{player.pos}</div>
              {/* coluna de ícones (playstyles + química) */}
              <div className="flex flex-col gap-1.5 mt-3">
                {['⚡', '➜', '◎', '✦'].map((g, i) => (
                  <div key={i} className="flex items-center justify-center" style={{
                    width: 20, height: 24, color: r.txt, fontSize: 11,
                    clipPath: 'polygon(50% 0, 100% 28%, 100% 72%, 50% 100%, 0 72%, 0 28%)',
                    background: i === 3 ? r.accent : `${r.accent}33`,
                    border: `1px solid ${r.accent}99`,
                  }}>{g}</div>
                ))}
              </div>
            </div>

            {/* nome */}
            <div className="absolute left-0 right-0 text-center" style={{ top: '62%' }}>
              <div className="font-black uppercase tracking-tight" style={{ fontSize: 26, color: r.txt, textShadow: '0 2px 8px rgba(0,0,0,.5)' }}>{player.nome}</div>
              <div className="font-black tracking-[2px] mt-0.5" style={{ fontSize: 9, color: r.accent }}>★ {player.rating.toFixed(1)} SOFASCORE · {player.role}</div>
            </div>

            {/* atributos */}
            <div className="absolute left-0 right-0 px-5" style={{ top: '73%' }}>
              <div className="grid grid-cols-6 text-center" style={{ color: r.txt }}>
                {stats.map(s => <div key={s.l} className="font-black" style={{ fontSize: 10, letterSpacing: .5 }}>{s.l}</div>)}
              </div>
              <div className="grid grid-cols-6 text-center mt-0.5">
                {stats.map(s => <div key={s.l}><StatNum v={s.v} color={r.stat} /></div>)}
              </div>
            </div>

            {/* bandeira · liga · escudo */}
            <div className="absolute left-0 right-0 flex items-center justify-center gap-3" style={{ top: '90%' }}>
              <span style={{ fontSize: 18 }}>🇧🇷</span>
              <span className="font-black tracking-wider" style={{ fontSize: 9, color: r.txt, opacity: .85 }}>SÉRIE B</span>
              <img src={ESCUDO} alt="" className="object-contain" style={{ width: 20, height: 20 }} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DestaquesFifa() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      {/* defs compartilhados: silhueta + gradientes da moldura */}
      <svg className="absolute" width="0" height="0" aria-hidden>
        <defs>
          <clipPath id="futShape" clipPathUnits="objectBoundingBox">
            <path d="M.5 .0186 C.3667 .0186 .2333 .0326 .1333 .0605 C.1 .0698 .0733 .0884 .0733 .1163 L.0733 .8372 C.0733 .9023 .2 .9535 .5 .986 C.8 .9535 .9267 .9023 .9267 .8372 L.9267 .1163 C.9267 .0884 .9 .0698 .8667 .0605 C.7667 .0326 .6333 .0186 .5 .0186 Z" />
          </clipPath>
          <linearGradient id="frame-toty" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff4c2" /><stop offset=".5" stopColor="#d4ab2e" /><stop offset="1" stopColor="#9a7414" />
          </linearGradient>
          <linearGradient id="frame-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff6cf" /><stop offset=".5" stopColor="#e7be4a" /><stop offset="1" stopColor="#a87d18" />
          </linearGradient>
          <linearGradient id="frame-purple" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f3e8ff" /><stop offset=".5" stopColor="#b89bd6" /><stop offset="1" stopColor="#6c4f8c" />
          </linearGradient>
        </defs>
      </svg>

      {/* banner */}
      <div className="relative text-center mb-12">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent" />
        <div className="relative inline-block bg-[#050505] px-6">
          <div className="text-[11px] font-black tracking-[6px] text-yellow-500 mb-1">⚡ EQUIPE DA RODADA</div>
          <h3 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white" style={{ textShadow: '0 0 30px rgba(245,196,0,.35)' }}>
            THE BEST <span className="text-yellow-400">TIGRE FC</span>
          </h3>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start">
        {/* SofaScore */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-black tracking-[3px] text-emerald-400">SOFASCORE LIVE</span>
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/90 shadow-2xl h-[520px] md:h-[640px]">
              <iframe 
                src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526098&widgetTheme=dark" 
                className="w-full h-full" 
                frameBorder="0" 
                scrolling="no" 
                title="SofaScore Lineup"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* cartas FUT */}
        <div className="lg:col-span-7 grid sm:grid-cols-2 gap-8 place-items-center">
          {topPlayers.map((p, i) => <FutCard key={p.nome} player={p} index={i} />)}
        </div>
      </div>

      <style jsx>{`
        .fut-shine {
          background: linear-gradient(115deg, transparent 36%, rgba(255,255,255,.28) 48%, transparent 60%);
          transform: translateX(-130%); mix-blend-mode: overlay;
          animation: futShine 6s ease-in-out infinite;
        }
        @keyframes futShine { 0%,74%{transform:translateX(-130%)} 90%,100%{transform:translateX(130%)} }
        @media (prefers-reduced-motion: reduce) { .fut-shine { animation: none; } }
      `}</style>
    </section>
  );
}
