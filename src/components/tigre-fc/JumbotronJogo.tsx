'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

// ── Cores & Config ──────────────────────────────────────────────────────────
export const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red: '#FF2244',
  green: '#00FF88',
  black: '#050505',
  white: '#FFFFFF',
  ledDark: '#0a0a0f',
  ledGlow: 'rgba(245, 196, 0, 0.6)',
} as const;

const FONT_FAMILY = "'Barlow Condensed', 'Barlow', system-ui, -apple-system, sans-serif";
const STORAGE_BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';
const ESCUDO_NOVORIZONTINO = `${STORAGE_BASE}/Escudo%20Novorizontino.png`;
const ESCUDO_AVAI_OFICIAL = 'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png';

// ── Logos & Nomes ───────────────────────────────────────────────────────────
const LOGOS: Record<string, string> = {
  'novorizontino': ESCUDO_NOVORIZONTINO,
  'gremio-novorizontino': ESCUDO_NOVORIZONTINO,
  'avai': ESCUDO_AVAI_OFICIAL,
  'criciuma': 'https://logodownload.org/wp-content/uploads/2018/06/criciuma-logo-escudo-1.png',
  'vila-nova': 'https://logodownload.org/wp-content/uploads/2017/02/vila-nova-logo-escudo.png',
  'ponte-preta': 'https://logodownload.org/wp-content/uploads/2017/02/ponte-preta-logo-escudo.png',
  'athletico-pr': 'https://logodownload.org/wp-content/uploads/2017/02/athletico-pr-logo-escudo.png',
  'goias': 'https://logodownload.org/wp-content/uploads/2017/02/goias-logo-escudo.png',
  'coritiba': 'https://logodownload.org/wp-content/uploads/2017/02/coritiba-logo-escudo.png',
  'cuiaba': 'https://logodownload.org/wp-content/uploads/2017/02/cuiaba-logo-escudo.png',
  'chapecoense': 'https://logodownload.org/wp-content/uploads/2017/02/chapecoense-logo-escudo.png',
  'paysandu': 'https://logodownload.org/wp-content/uploads/2017/02/paysandu-logo-escudo.png',
  'remo': 'https://logodownload.org/wp-content/uploads/2017/02/remo-logo-escudo.png',
  'amazonas': 'https://logodownload.org/wp-content/uploads/2017/02/amazonas-fc-logo-escudo.png',
  'operario-pr': 'https://logodownload.org/wp-content/uploads/2017/02/operario-pr-logo-escudo.png',
  'volta-redonda': 'https://logodownload.org/wp-content/uploads/2017/02/volta-redonda-logo-escudo.png',
  'crb': 'https://logodownload.org/wp-content/uploads/2017/02/crb-logo-escudo.png',
  'america-mg': 'https://logodownload.org/wp-content/uploads/2017/02/america-mg-logo-escudo.png',
  'athletic-mg': 'https://logodownload.org/wp-content/uploads/2017/02/athletic-club-mg-logo-escudo.png',
  'botafogo-sp': 'https://logodownload.org/wp-content/uploads/2017/02/botafogo-sp-logo-escudo.png',
  'sport': 'https://logodownload.org/wp-content/uploads/2017/02/sport-logo-escudo.png',
  'londrina': 'https://logodownload.org/wp-content/uploads/2017/02/londrina-logo-escudo.png',
  'juventude': 'https://logodownload.org/wp-content/uploads/2017/02/juventude-logo-escudo.png',
  'ceara': 'https://logodownload.org/wp-content/uploads/2017/02/ceara-logo-escudo.png',
  'sao-bernardo': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SAO%20BERNARDO.png',
};

const NOMES: Record<string, string> = {
  'novorizontino': 'NOVORIZONTINO',

const NOMES: Record<string, string> = {

const NOMES: Record<string, string> = {
  'novorizontino': 'NOVORIZONTINO',
  'gremio-novorizontino': 'NOVORIZONTINO',
  'avai': 'AVAÍ',
  'criciuma': 'CRICIÚMA',
  'vila-nova': 'VILA NOVA',
  'ponte-preta': 'PONTE PRETA',
  'athletico-pr': 'ATHLETICO',
  'goias': 'GOIÁS',
  'coritiba': 'CORITIBA',
  'cuiaba': 'CUIABÁ',
  'chapecoense': 'CHAPECOENSE',
  'paysandu': 'PAYSANDU',
  'remo': 'REMO',
  'amazonas': 'AMAZONAS',
  'operario-pr': 'OPERÁRIO',
  'volta-redonda': 'VOLTA REDONDA',
  'crb': 'CRB',
  'america-mg': 'AMÉRICA-MG',
  'athletic-mg': 'ATHLETIC',
  'botafogo-sp': 'BOTAFOGO-SP',
  'sport': 'SPORT',
  'londrina': 'LONDRINA',
  'juventude': 'JUVENTUDE',
  'ceara': 'CEARÁ',
  'sao-bernardo': 'SÃO BERNARDO',
};

const slugToNome = (slug?: string | null) => slug ? NOMES[slug] ?? slug.replace(/-/g, ' ').toUpperCase() : '---';
const slugToLogo = (slug?: string | null) => slug ? LOGOS[slug] ?? ESCUDO_NOVORIZONTINO : ESCUDO_NOVORIZONTINO;
const normalizarCompeticao = (raw?: string | null): string => {
  if (!raw) return 'BRASILEIRÃO SÉRIE B';
  const s = raw.toString().toUpperCase();
  if (s.includes('SÉRIE B')) return 'BRASILEIRÃO SÉRIE B';
  if (s.includes('SUL-SUDESTE')) return 'COPA SUL-SUDESTE';
  return s;
};

// ── Hook: Countdown ─────────────────────────────────────────────────────────
function useCountdown(targetDate: string | null | undefined) {
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) { setTime(null); return; }
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) { setTime(null); return; }

    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}

// ── Componente: LED Matrix Background ───────────────────────────────────────
const LEDMatrixBackground: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const dots = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 120; i++) {
      arr.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.8 + Math.random() * 1.2,
      });
    }
    return arr;
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {active && dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            background: `radial-gradient(circle, ${C.gold} 0%, transparent 70%)`,
            boxShadow: `0 0 8px ${C.gold}, 0 0 20px ${C.gold}40`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            delay: dot.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 243, 255, 0.03) 2px,
            rgba(0, 243, 255, 0.03) 4px
          )`,
        }}
      />
      
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, ${C.black} 90%)`,
        }}
      />
    </div>
  );
};

// ── Componente: LED Border Glow ─────────────────────────────────────────────
const LEDBorder: React.FC<{ color?: string; intensity?: number }> = ({ 
  color = C.gold, 
  intensity = 1 
}) => {
  return (
    <>
      <motion.div
        className="absolute -inset-0.5 rounded-3xl opacity-75"
        style={{
          background: `linear-gradient(90deg, ${color}, ${C.cyan}, ${color}, ${C.red}, ${color})`,
          filter: `blur(${15 * intensity}px)`,
        }}
        animate={{
          backgroundPosition: ['0% 50%', '200% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      <div 
        className="absolute inset-0 rounded-3xl border-2"
        style={{
          borderColor: color,
          boxShadow: `
            0 0 ${20 * intensity}px ${color}40,
            inset 0 0 ${30 * intensity}px ${color}20
          `,
        }}
      />
      
      {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
        <motion.div
          key={i}
          className={`absolute ${pos} w-4 h-4 m-1 rounded-full`}
          style={{
            background: `radial-gradient(circle, ${C.white} 0%, ${color} 40%, transparent 70%)`,
            boxShadow: `0 0 10px ${color}, 0 0 30px ${color}60`,
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </>
  );
};

// ── Componente: Team Display com Efeitos LED ────────────────────────────────
const TeamDisplay: React.FC<{
  slug: string;
  side: 'home' | 'away';
  score?: number | null;
  isLive?: boolean;
}> = ({ slug, side, score, isLive = false }) => {
  const controls = useAnimation();
  const name = slugToNome(slug);
  const logo = slugToLogo(slug);
  const isNovorizontino = slug.includes('novorizontino');

  useEffect(() => {
    if (isLive && isNovorizontino) {
      controls.start({
        scale: [1, 1.05, 1],
        boxShadow: [
          `0 0 20px ${C.gold}40`,
          `0 0 40px ${C.gold}80`,
          `0 0 20px ${C.gold}40`,
        ],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      });
    }
  }, [isLive, isNovorizontino, controls]);

  return (
    <motion.div 
      className={`flex flex-col items-center ${side === 'home' ? 'text-left' : 'text-right'} flex-1 relative z-10`}
      initial={{ opacity: 0, x: side === 'home' ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <motion.div className="relative mb-3" animate={controls}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${isNovorizontino ? C.gold : C.cyan}40 0%, transparent 70%)`,
            filter: 'blur(10px)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.9, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        <img 
          src={logo} 
          alt={name} 
          className="relative w-24 h-24 mx-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          style={{
            filter: isNovorizontino ? `drop-shadow(0 0 20px ${C.gold})` : undefined,
          }}
        />
        
        {isLive && isNovorizontino && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </motion.div>

      <motion.div 
        className={`font-black text-2xl uppercase tracking-tight ${
          isNovorizontino ? 'text-[#F5C400]' : 'text-white'
        }`}
        style={{
          textShadow: isNovorizontino 
            ? `0 0 10px ${C.gold}, 0 0 20px ${C.gold}60, 0 0 40px ${C.gold}30`
            : '0 0 10px rgba(255,255,255,0.5)',
        }}
        whileHover={{ scale: 1.05 }}
      >
        {name}
      </motion.div>
      
      <div className="text-xs text-white/50 font-bold tracking-wider mt-1">
        {side === 'home' ? '⬅ MANDANTE' : 'VISITANTE ➡'}
      </div>

      {score !== undefined && (
        <motion.div 
          className="mt-3 px-6 py-2 bg-black/60 rounded-xl border border-white/10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="text-4xl font-black" style={{
            color: isNovorizontino ? C.gold : C.white,
            textShadow: `0 0 20px ${isNovorizontino ? C.gold : C.white}60`,
          }}>
            {score}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

// ── Componente: Countdown LED Style ─────────────────────────────────────────
const LEDCountdown: React.FC<{ countdown: ReturnType<typeof useCountdown> }> = ({ countdown }) => {
  if (!countdown) return null;

  const units = [
    { value: countdown.days, label: 'DIAS', color: C.cyan },
    { value: countdown.hours, label: 'HRS', color: C.gold },
    { value: countdown.minutes, label: 'MIN', color: C.green },
    { value: countdown.seconds, label: 'SEG', color: countdown.seconds % 2 === 0 ? C.red : C.white },
  ];

  return (
    <motion.div 
      className="mx-8 mb-8 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="bg-black/80 border border-white/10 rounded-2xl py-4 px-2 backdrop-blur-sm">
        <div className="h-1 w-full mb-3 rounded-full overflow-hidden">
          <motion.div 
            className="h-full"
            style={{ background: `linear-gradient(90deg, ${C.red}, ${C.gold}, ${C.cyan}, ${C.green})` }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="flex justify-center gap-4 md:gap-8">
          {units.map((item, i) => (
            <motion.div 
              key={i} 
              className="text-center relative group"
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-lg opacity-50"
                  style={{
                    background: `radial-gradient(ellipse at center, ${item.color}30 0%, transparent 70%)`,
                    filter: 'blur(8px)',
                  }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                />
                
                <div className="relative text-3xl md:text-4xl font-black text-white tabular-nums"
                  style={{
                    textShadow: `0 0 10px ${item.color}, 0 0 20px ${item.color}40`,
                  }}
                >
                  {String(item.value).padStart(2, '0')}
                </div>
              </div>
              
              <div className="text-[10px] md:text-xs tracking-[3px] text-white/60 font-bold mt-1"
                style={{ color: item.color }}
              >
                {item.label}
              </div>
              
              {i < units.length - 1 && (
                <div className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  {[0, 1].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full bg-white/70"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: dot * 0.5 }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        <div className="h-1 w-full mt-3 rounded-full overflow-hidden">
          <motion.div 
            className="h-full"
            style={{ background: `linear-gradient(90deg, ${C.green}, ${C.cyan}, ${C.gold}, ${C.red})` }}
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// ── Componente Principal: Jumbotron LED ─────────────────────────────────────
export default function JumbotronJogo({
  jogo,
  onEscalar,
  loading = false,
  mercadoFechado = false,
  totalEscalacoes,
}: {
  jogo?: any;
  onEscalar?: () => void;
  loading?: boolean;
  mercadoFechado?: boolean;
  totalEscalacoes?: number;
}) {
  const safeJogo = jogo ?? {};
  const rodada = safeJogo.rodada ?? '11';
  const competicaoDisplay = normalizarCompeticao(safeJogo.competicao);
  const mandanteSlug = safeJogo.mandante_slug ?? 'sao-bernardo';
  const visitanteSlug = safeJogo.visitante_slug ?? 'novorizontino';
  const dataJogo = safeJogo.data_hora ?? '2026-05-31 14:00:00+00';
  const local = safeJogo.local ?? 'Estádio 1º de Maio — São Bernardo do Campo, SP';
  
  const isLive = safeJogo.finalizado === false && new Date(dataJogo).getTime() < Date.now();
  const countdown = useCountdown(isLive ? null : dataJogo);

  const ctaLabel = mercadoFechado ? '🔒 MERCADO FECHADO' : isLive ? '🔴 ASSISTIR AO VIVO' : '⚡ ESCALAR AGORA';
  const ctaGradient = isLive 
    ? `linear-gradient(90deg, ${C.red}, #ff4466)` 
    : `linear-gradient(90deg, ${C.gold}, #ffea00)`;

  if (loading) {
    return (
      <div className="relative w-full mx-auto rounded-3xl overflow-hidden border border-white/10 bg-black/50 animate-pulse">
        <div className="h-96 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full border-4 border-t-transparent"
            style={{ borderColor: C.gold, borderTopColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="relative w-full mx-auto rounded-3xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${C.ledDark} 0%, #0f0f1a 50%, ${C.black} 100%)`,
        fontFamily: FONT_FAMILY,
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* 🌟 LED Background Effects */}
      <LEDMatrixBackground active={true} />
      <LEDBorder color={isLive ? C.red : C.gold} intensity={isLive ? 1.5 : 1} />
      
      {/* 🔥 Sparkle particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`spark-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: `${10 + i * 12}%`,
            top: `${Math.random() * 30 + 10}%`,
            boxShadow: `0 0 10px ${C.cyan}, 0 0 20px ${C.cyan}60`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* 📊 Header: Live Badge + Rodada */}
      <div className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <AnimatePresence mode="wait">
            {isLive ? (
              <motion.div
                key="live"
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <motion.div 
                  className="w-3 h-3 rounded-full bg-red-500"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(255, 34, 68, 0.7)',
                      '0 0 0 10px rgba(255, 34, 68, 0)',
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.span 
                  className="text-xs font-black tracking-[3px] text-red-400"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ● AO VIVO
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="upcoming"
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-black tracking-[3px] text-green-400">PRÓXIMO</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div 
          className="text-xs font-black tracking-widest text-white/70"
          animate={{ textShadow: ['0 0 5px rgba(255,255,255,0.3)', '0 0 15px rgba(245,196,0,0.6)', '0 0 5px rgba(255,255,255,0.3)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {competicaoDisplay} • RODADA {rodada}
        </motion.div>
      </div>

      {/* ⚽ Main Content: Teams + VS */}
      <div className="relative z-20 p-6 md:p-8 pb-4">
        <div className="flex items-center justify-around gap-4">
          <TeamDisplay slug={mandanteSlug} side="home" score={safeJogo.placar_mandante} isLive={isLive} />
          
          <motion.div 
            className="relative"
            animate={{ 
              scale: [1, 1.05, 1],
              textShadow: [
                `0 0 20px ${C.gold}`,
                `0 0 40px ${C.gold}, 0 0 60px ${C.cyan}`,
                `0 0 20px ${C.gold}`,
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-4xl md:text-6xl font-black italic text-[#F5C400] relative">
              VS
              <div 
                className="absolute inset-0 blur-xl opacity-60"
                style={{ background: C.gold }}
              />
            </div>
          </motion.div>
          
          <TeamDisplay slug={visitanteSlug} side="away" score={safeJogo.placar_visitante} isLive={isLive} />
        </div>

        <motion.div 
          className="text-center mt-6 text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 rounded-full border border-white/10">
            📍 <span className="font-medium">{local}</span>
          </span>
        </motion.div>
      </div>

      {/* ⏱️ Countdown LED Display */}
      {!isLive && <LEDCountdown countdown={countdown} />}

      {/* 📊 Stats: Total de Escalações */}
      {totalEscalacoes !== undefined && (
        <motion.div 
          className="relative z-20 mx-8 mb-4 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-black/50 rounded-full border border-white/10 backdrop-blur-sm">
            <motion.div 
              className="w-2 h-2 rounded-full bg-green-400"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-bold text-white/80">
              <span className="text-[#F5C400] font-black">{totalEscalacoes}</span> escalações até agora
            </span>
          </div>
        </motion.div>
      )}

      {/* 🎯 CTA Button com efeito hover LED */}
      <div className="relative z-20 px-6 md:px-8 pb-6 md:pb-8">
        <motion.button
          onClick={onEscalar}
          className="relative w-full py-5 md:py-6 font-black text-lg md:text-xl tracking-widest rounded-2xl overflow-hidden group"
          style={{ background: ctaGradient, color: '#000' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {ctaLabel}
            {!mercadoFechado && (
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            )}
          </span>
          
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
            style={{
              boxShadow: `0 0 30px ${isLive ? C.red : C.gold}, inset 0 0 30px ${isLive ? C.red : C.gold}30`,
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.button>
        
        <div className="text-center mt-4 text-xs text-white/40 font-medium tracking-wide">
          {isLive 
            ? 'Clique para acessar a transmissão oficial' 
            : 'Monte seu time e concorra a prêmios exclusivos 🏆'
          }
        </div>
      </div>

      {/* 🎆 Footer LED strip */}
      <div className="relative z-10 h-1 w-full overflow-hidden">
        <motion.div 
          className="h-full"
          style={{ 
            background: `linear-gradient(90deg, 
              ${C.red}, ${C.gold}, ${C.cyan}, ${C.green}, 
              ${C.green}, ${C.cyan}, ${C.gold}, ${C.red}
            )`,
          }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
