'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

interface Time { nome: string; escudo_url: string; }
interface Jogo {
  id: number; data_hora: string; mandante: Time; visitante: Time;
  competicao?: string; rodada?: string; local?: string;
}
interface UsuarioRanking {
  id: string; nome: string; apelido: string | null;
  avatar_url: string | null; pontos_total: number;
}

// ─── Micro: Digit Flip ────────────────────────────────────────────────────────
function FlipDigit({ value }: { value: string }) {
  return (
    <motion.span
      key={value}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ display: 'inline-block', transformOrigin: '50% 50%' }}
    >
      {value}
    </motion.span>
  );
}

// ─── Timer Block ──────────────────────────────────────────────────────────────
function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative w-[68px] h-[68px] flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, #0f0f0f, #1a1a00)',
          border: '1px solid rgba(245,196,0,0.25)',
          borderRadius: 16,
          boxShadow: '0 0 20px rgba(245,196,0,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* scanline */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
        }} />
        <span style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif", fontSize: 32, fontWeight: 900, color: '#F5C400', letterSpacing: -1, textShadow: '0 0 20px rgba(245,196,0,0.6)' }}>
          <FlipDigit value={value[0]} /><FlipDigit value={value[1]} />
        </span>
      </div>
      <span style={{ fontSize: 8, fontWeight: 900, color: '#444', letterSpacing: 3, textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}

// ─── Rank Medal ───────────────────────────────────────────────────────────────
const MEDALS = ['🥇', '🥈', '🥉'];
const RANK_LABELS = ['LÍDER DA ALCATEIA', 'VICE-CAMPEÃO', 'BRONZE ELITE', 'COMPETIDOR', 'COMPETIDOR', 'COMPETIDOR', 'COMPETIDOR', 'COMPETIDOR', 'COMPETIDOR', 'COMPETIDOR'];

// ─── Particles BG ─────────────────────────────────────────────────────────────
function ParticlesBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            background: '#F5C400',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Live Badge ───────────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)' }}>
      <motion.div
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-red-500"
      />
      <span style={{ fontSize: 8, fontWeight: 900, color: '#EF4444', letterSpacing: 3, textTransform: 'uppercase' }}>AO VIVO</span>
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ sub, title }: { sub: string; title: string }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, rgba(245,196,0,0.4), transparent)' }} />
        <span style={{ fontSize: 9, fontWeight: 900, color: '#F5C400', letterSpacing: 4, textTransform: 'uppercase' }}>{sub}</span>
        <div style={{ height: 1, flex: 1, background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.4))' }} />
      </div>
      <h2 style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif", fontSize: 40, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -1, lineHeight: 1, textAlign: 'center', textShadow: '0 0 40px rgba(245,196,0,0.15)' }}>
        {title}
      </h2>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale   = useTransform(scrollY, [0, 300], [1, 1.08]);

  const [mounted, setMounted]         = useState(false);
  const [jogo, setJogo]               = useState<Jogo | null>(null);
  const [ranking, setRanking]         = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId]             = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft]       = useState({ h: '00', m: '00', s: '00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }
      const resJogo = await fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null);
      if (resJogo?.jogos?.length > 0) {
        setJogo(resJogo.jogos[0]);
      } else {
        setJogo({
          id: 3, data_hora: '2026-04-05T21:00:00Z', competicao: 'Série B', rodada: '3ª Rodada',
          local: 'Jorjão • Novo Horizonte',
          mandante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png' },
          visitante: { nome: 'CRB', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/escudos/crb.png' },
        });
      }
      const { data: resRank } = await sb.from('tigre_fc_usuarios').select('id, nome, apelido, avatar_url, pontos_total').not('pontos_total', 'is', null).order('pontos_total', { ascending: false }).limit(10);
      if (resRank) setRanking(resRank as UsuarioRanking[]);
    }
    init();
  }, [mounted]);

  useEffect(() => {
    if (!jogo?.data_hora) return;
    const tick = () => {
      const gameTime = new Date(jogo.data_hora.includes('T') ? jogo.data_hora : jogo.data_hora.replace(' ', 'T')).getTime();
      const diff = gameTime - (90 * 60 * 1000) - Date.now();
      if (isNaN(diff) || diff <= 0) { setTimeLeft({ h: '00', m: '00', s: '00' }); setMercadoAberto(false); return; }
      setTimeLeft({
        h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      });
    };
    const t = setInterval(tick, 1000); tick();
    return () => clearInterval(t);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  const stagger = (i: number) => ({ initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] } });

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', overflowX: 'hidden', fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>

      {/* ── FONT IMPORT ── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 0px; }
        body { background: #050505; }
        .grain::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          opacity: 0.35;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-sweep::before {
          content: '';
          position: absolute;
          left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(245,196,0,0.08), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .text-shimmer {
          background: linear-gradient(90deg, #F5C400 0%, #fff8d6 40%, #F5C400 60%, #D4A200 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        @keyframes hud-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,196,0,0); }
          50% { box-shadow: 0 0 0 6px rgba(245,196,0,0.08); }
        }
        .hud-pulse { animation: hud-pulse 2.5s ease-in-out infinite; }
      `}</style>
      <div className="grain" />

      {/* ─────────────────────────────────────────────────────────────
          HERO — CINEMATIC HEADER
      ───────────────────────────────────────────────────────────── */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative overflow-hidden scanline-sweep"
      >
        {/* BG gradient layers */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,196,0,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #050505 0%, transparent 30%, transparent 70%, #050505 100%)' }} />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(245,196,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,196,0,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        <ParticlesBg />

        <div style={{ position: 'relative', zIndex: 10, padding: '80px 24px 60px', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <img src={PATA_LOGO} style={{ width: 72, height: 72, objectFit: 'contain', margin: '0 auto 16px', filter: 'drop-shadow(0 0 24px rgba(245,196,0,0.6))' }} alt="" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: 6, color: '#F5C400', textTransform: 'uppercase', marginBottom: 8, opacity: 0.7 }}>
              FANTASY LEAGUE · SÉRIE B 2026
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed', Impact, sans-serif", fontSize: 88, fontWeight: 900, letterSpacing: -4, lineHeight: 0.85, textTransform: 'uppercase', margin: '0 0 16px' }}>
              <span className="text-shimmer">TIGRE</span>
              <br />
              <span style={{ color: '#fff', textShadow: '0 0 60px rgba(245,196,0,0.2)' }}>FC</span>
            </h1>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#444', letterSpacing: 2, textTransform: 'uppercase' }}>
              Monte. Dispute. Domine a torcida.
            </p>
          </motion.div>

          {/* HUD pills */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 24 }}
          >
            <LiveBadge />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <span style={{ fontSize: 8, fontWeight: 900, color: '#22C55E', letterSpacing: 3, textTransform: 'uppercase' }}>
                {mercadoAberto ? '🟢 MERCADO ABERTO' : '🔴 MERCADO FECHADO'}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ─────────────────────────────────────────────────────────────
          MATCH CARD — PS5 GAME CARD
      ───────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 20px' }}>
        <AnimatePresence>
          {jogo && (
            <motion.section
              {...stagger(0)}
              style={{ marginBottom: 16 }}
            >
              {/* Outer glow wrapper */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -1,
                  background: 'linear-gradient(135deg, rgba(245,196,0,0.4) 0%, transparent 50%, rgba(245,196,0,0.2) 100%)',
                  borderRadius: 32, filter: 'blur(1px)',
                }} />

                <div style={{
                  position: 'relative',
                  background: 'linear-gradient(145deg, #0d0d0d 0%, #111108 60%, #0a0a0a 100%)',
                  borderRadius: 30,
                  overflow: 'hidden',
                  border: '1px solid rgba(245,196,0,0.15)',
                }}>

                  {/* Top accent bar */}
                  <div style={{ height: 3, background: 'linear-gradient(90deg, transparent, #F5C400, #D4A200, transparent)' }} />

                  {/* Inner scanlines */}
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.009) 3px, rgba(255,255,255,0.009) 4px)',
                  }} />

                  <div style={{ padding: '28px 24px 32px', position: 'relative', zIndex: 2 }}>

                    {/* Match meta */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5C400', boxShadow: '0 0 8px #F5C400' }} />
                        <span style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', letterSpacing: 2, textTransform: 'uppercase' }}>
                          {jogo.competicao}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#333', letterSpacing: 1, textTransform: 'uppercase' }}>
                        {jogo.rodada}
                      </span>
                    </div>

                    {/* Teams */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>

                      {/* Home team */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 10 }}
                      >
                        <div style={{
                          width: 80, height: 80,
                          background: 'radial-gradient(circle at 40% 40%, rgba(245,196,0,0.15), transparent 70%)',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <img
                            src={jogo.mandante?.escudo_url}
                            onError={(e) => { (e.target as HTMLImageElement).src = PATA_LOGO; }}
                            style={{ width: 64, height: 64, objectFit: 'contain', filter: 'drop-shadow(0 0 16px rgba(245,196,0,0.4))' }}
                            alt={jogo.mandante?.nome}
                          />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.2 }}>
                          {jogo.mandante?.nome}
                        </span>
                        <div style={{ padding: '2px 8px', background: 'rgba(245,196,0,0.12)', border: '1px solid rgba(245,196,0,0.25)', borderRadius: 6 }}>
                          <span style={{ fontSize: 8, fontWeight: 900, color: '#F5C400', letterSpacing: 1 }}>MANDANTE</span>
                        </div>
                      </motion.div>

                      {/* VS + Timer */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '0 8px' }}>
                        <div style={{
                          fontSize: 28, fontWeight: 900, fontStyle: 'italic', color: '#1a1a1a',
                          textShadow: '0 2px 0 #0a0a0a',
                          lineHeight: 1,
                        }}>VS</div>
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <TimerBlock value={timeLeft.h} label="HRS" />
                          <span style={{ fontSize: 20, fontWeight: 900, color: '#F5C400', marginBottom: 14, textShadow: '0 0 8px rgba(245,196,0,0.5)' }}>:</span>
                          <TimerBlock value={timeLeft.m} label="MIN" />
                          <span style={{ fontSize: 20, fontWeight: 900, color: '#F5C400', marginBottom: 14, textShadow: '0 0 8px rgba(245,196,0,0.5)' }}>:</span>
                          <TimerBlock value={timeLeft.s} label="SEG" />
                        </div>
                        <span style={{ fontSize: 8, fontWeight: 900, color: '#2a2a2a', letterSpacing: 1.5, textTransform: 'uppercase' }}>
                          {jogo.local}
                        </span>
                      </div>

                      {/* Away team */}
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 10 }}
                      >
                        <div style={{
                          width: 80, height: 80,
                          background: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05), transparent 70%)',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <img
                            src={jogo.visitante?.escudo_url}
                            onError={(e) => { (e.target as HTMLImageElement).src = PATA_LOGO; }}
                            style={{ width: 64, height: 64, objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
                            alt={jogo.visitante?.nome}
                          />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center', lineHeight: 1.2 }}>
                          {jogo.visitante?.nome}
                        </span>
                        <div style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6 }}>
                          <span style={{ fontSize: 8, fontWeight: 900, color: '#444', letterSpacing: 1 }}>VISITANTE</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                      whileTap={{ scale: 0.97 }}
                      className="hud-pulse"
                      style={{ borderRadius: 18 }}
                    >
                      <Link
                        href={`/tigre-fc/escalar/${jogo.id}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 10,
                          width: '100%',
                          padding: '18px 24px',
                          borderRadius: 18,
                          background: mercadoAberto
                            ? 'linear-gradient(135deg, #F5C400 0%, #D4A200 50%, #F5C400 100%)'
                            : '#1a1a1a',
                          backgroundSize: '200% 100%',
                          color: mercadoAberto ? '#000' : '#333',
                          fontFamily: "'Barlow Condensed', Impact, sans-serif",
                          fontSize: 14,
                          fontWeight: 900,
                          letterSpacing: 3,
                          textTransform: 'uppercase',
                          textDecoration: 'none',
                          border: mercadoAberto ? 'none' : '1px solid #222',
                          boxShadow: mercadoAberto ? '0 8px 32px rgba(245,196,0,0.3), 0 0 0 1px rgba(245,196,0,0.2) inset' : 'none',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Shimmer sweep on hover */}
                        <motion.div
                          style={{
                            position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            skewX: '-20deg',
                          }}
                          animate={{ left: ['−100%', '200%'] }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
                        />
                        <span style={{ fontSize: 18 }}>⚡</span>
                        {mercadoAberto ? 'CONVOCAR TITULARES' : 'MERCADO FECHADO'}
                        {mercadoAberto && <span style={{ opacity: 0.6 }}>→</span>}
                      </Link>
                    </motion.div>

                    {/* Stats bar */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 20 }}>
                      {[['🏆', ranking.length, 'JOGADORES'], ['⚽', '11', 'TITULARES'], ['🎯', '5', 'FORMAÇÕES']].map(([icon, val, label]) => (
                        <div key={label as string} style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 16, marginBottom: 2 }}>{icon}</div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: '#F5C400', lineHeight: 1 }}>{val}</div>
                          <div style={{ fontSize: 7, fontWeight: 900, color: '#2a2a2a', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 1 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── DESTAQUES ─── */}
        <motion.div {...stagger(1)}>
          <DestaquesFifa />
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            RANKING — ELITE LEADERBOARD
        ───────────────────────────────────────────────────────────── */}
        <motion.section {...stagger(2)} style={{ marginTop: 64 }}>
          <SectionLabel sub="LEADERBOARD" title="ELITE RANKING" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranking.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#222', fontSize: 13, fontWeight: 700 }}>
                Nenhum jogador ainda. Seja o primeiro!
              </div>
            ) : ranking.map((u, i) => {
              const isFirst = i === 0;
              const isTop3  = i < 3;

              return (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPerfilAberto(u.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: isFirst ? '20px 20px' : '14px 18px',
                    borderRadius: isFirst ? 24 : 18,
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    background: isFirst
                      ? 'linear-gradient(135deg, #1a1400 0%, #2a1f00 50%, #1a1400 100%)'
                      : 'rgba(255,255,255,0.02)',
                    border: isFirst
                      ? '1px solid rgba(245,196,0,0.4)'
                      : isTop3
                      ? '1px solid rgba(255,255,255,0.06)'
                      : '1px solid rgba(255,255,255,0.03)',
                    boxShadow: isFirst ? '0 0 40px rgba(245,196,0,0.1), inset 0 1px 0 rgba(245,196,0,0.1)' : 'none',
                  }}
                >
                  {isFirst && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.6), transparent)' }} />
                  )}

                  {/* Position */}
                  <div style={{ width: 36, textAlign: 'center', flexShrink: 0 }}>
                    {isTop3 ? (
                      <span style={{ fontSize: 20 }}>{MEDALS[i]}</span>
                    ) : (
                      <span style={{
                        fontFamily: "'Barlow Condensed', Impact, sans-serif",
                        fontSize: 22, fontWeight: 900, fontStyle: 'italic',
                        color: '#2a2a2a',
                      }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div style={{
                    width: isFirst ? 52 : 44,
                    height: isFirst ? 52 : 44,
                    borderRadius: isFirst ? 16 : 14,
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: isFirst ? '2px solid rgba(245,196,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
                    background: '#111',
                    boxShadow: isFirst ? '0 0 16px rgba(245,196,0,0.2)' : 'none',
                  }}>
                    <img
                      src={u.avatar_url || PATA_LOGO}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt={u.nome}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', Impact, sans-serif",
                      fontSize: isFirst ? 22 : 17,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      color: isFirst ? '#F5C400' : '#fff',
                      textTransform: 'uppercase',
                      letterSpacing: -0.5,
                      lineHeight: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {u.apelido || u.nome}
                    </div>
                    <div style={{ fontSize: 8, fontWeight: 900, color: isFirst ? 'rgba(245,196,0,0.5)' : '#2a2a2a', letterSpacing: 2, textTransform: 'uppercase', marginTop: 3 }}>
                      {RANK_LABELS[i]}
                    </div>
                  </div>

                  {/* Points */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', Impact, sans-serif",
                      fontSize: isFirst ? 36 : 28,
                      fontWeight: 900,
                      fontStyle: 'italic',
                      color: isFirst ? '#F5C400' : isTop3 ? '#fff' : '#444',
                      lineHeight: 1,
                      textShadow: isFirst ? '0 0 20px rgba(245,196,0,0.4)' : 'none',
                    }}>
                      {u.pontos_total || 0}
                    </div>
                    <div style={{ fontSize: 7, fontWeight: 900, color: '#2a2a2a', letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>
                      PTS
                    </div>
                  </div>

                  {/* Hover arrow */}
                  <div style={{ fontSize: 10, color: '#222', marginLeft: 4, flexShrink: 0 }}>›</div>
                </motion.div>
              );
            })}
          </div>

          <motion.div whileTap={{ scale: 0.97 }} style={{ marginTop: 16 }}>
            <Link
              href="/tigre-fc/ranking"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px', borderRadius: 16,
                background: 'transparent',
                border: '1px solid rgba(245,196,0,0.15)',
                color: '#F5C400',
                fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              VER RANKING COMPLETO →
            </Link>
          </motion.div>
        </motion.section>

        {/* ─────────────────────────────────────────────────────────────
            VESTIÁRIO — CHAT
        ───────────────────────────────────────────────────────────── */}
        <motion.section {...stagger(3)} style={{ marginTop: 64, marginBottom: 60 }}>
          <SectionLabel sub="LOUNGE" title="VESTIÁRIO" />

          <div style={{
            borderRadius: 30,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.05)',
            background: 'linear-gradient(145deg, #080808, #0d0d00)',
            boxShadow: 'inset 0 1px 0 rgba(245,196,0,0.05)',
            position: 'relative',
          }}>
            {/* Top bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'rgba(245,196,0,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>💬</span>
                <span style={{ fontSize: 11, fontWeight: 900, color: '#333', letterSpacing: 2, textTransform: 'uppercase' }}>
                  Chat da Torcida
                </span>
              </div>
              <LiveBadge />
            </div>

            <div style={{ height: 560 }}>
              <TigreFCChat usuarioId={meuId} />
            </div>
          </div>
        </motion.section>
      </div>

      {/* Perfil Modal */}
      {perfilAberto && (
        <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId} onClose={() => setPerfilAberto(null)} />
      )}
    </main>
  );
}
