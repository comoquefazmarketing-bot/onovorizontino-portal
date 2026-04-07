'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const ESCUDOS_SERIE_B: Record<string, string> = {
  'novorizontino': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png',
  'america-mg': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png',
  // adicione os outros escudos aqui se precisar
};

function resolveEscudo(slugOrNome?: string): string {
  if (!slugOrNome) return PATA_LOGO;
  const slug = slugOrNome.toLowerCase().replace(/\s+/g, '-');
  return ESCUDOS_SERIE_B[slug] ?? PATA_LOGO;
}

interface Jogo {
  id: number;
  data_hora: string;
  mandante: any;
  visitante: any;
  competicao?: string;
  rodada?: string;
  local?: string;
}

function FlipDigit({ value }: { value: string }) {
  return (
    <motion.span key={value} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
      {value}
    </motion.span>
  );
}

function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(145deg, #0f0f0f, #1a1a00)', border: '1px solid rgba(245,196,0,0.3)',
        borderRadius: 14
      }}>
        <span style={{ fontSize: 32, fontWeight: 900, color: '#F5C400' }}>
          <FlipDigit value={value[0]} /><FlipDigit value={value[1]} />
        </span>
      </div>
      <span style={{ fontSize: 8, fontWeight: 900, color: '#666', letterSpacing: 2 }}>{label}</span>
    </div>
  );
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  use(params);

  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Inicialização do jogo (4ª rodada)
  useEffect(() => {
    if (!mounted) return;

    // Fallback direto para a 4ª rodada
    setJogo({
      id: 4,
      data_hora: '2026-04-12T18:00:00',   // ← 12/04/2026 18:00
      competicao: 'Brasileirão Série B',
      rodada: '4ª Rodada',
      local: 'Arena da Independência • Belo Horizonte',
      mandante: { nome: 'América-MG', slug: 'america-mg' },
      visitante: { nome: 'Novorizontino', slug: 'novorizontino' },
    });
  }, [mounted]);

  // Timer + Fechamento do mercado (1h antes)
  useEffect(() => {
    if (!jogo?.data_hora) return;

    const tick = () => {
      const gameTime = new Date(jogo.data_hora).getTime();
      const now = Date.now();
      const fechamento = gameTime - 60 * 60 * 1000; // 1 hora antes

      const diff = fechamento - now;

      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        setMercadoAberto(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        s: String(seconds).padStart(2, '0'),
      });
    };

    const interval = setInterval(tick, 1000);
    tick();

    return () => clearInterval(interval);
  }, [jogo]);

  if (!mounted || !jogo) {
    return (
      <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={PATA_LOGO} alt="Tigre FC" style={{ width: 80, opacity: 0.6, marginBottom: 20 }} />
          <p>Carregando próximo jogo...</p>
        </div>
      </div>
    );
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif" }}>
      {/* Timer */}
      <div style={{ padding: '40px 20px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
          <TimerBlock value={timeLeft.h} label="HRS" />
          <span style={{ fontSize: 36, color: '#F5C400', marginTop: -10 }}>:</span>
          <TimerBlock value={timeLeft.m} label="MIN" />
          <span style={{ fontSize: 36, color: '#F5C400', marginTop: -10 }}>:</span>
          <TimerBlock value={timeLeft.s} label="SEG" />
        </div>
        <p style={{ marginTop: 12, color: '#888', fontSize: 14 }}>
          {mercadoAberto ? 'Mercado aberto até 1h antes do jogo' : 'Mercado fechado'}
        </p>
      </div>

      {/* Botão Convocar Titulares */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Link
          href={`/tigre-fc/escalar/${jogo.id}`}
          style={{
            display: 'inline-block',
            padding: '16px 40px',
            background: mercadoAberto ? '#F5C400' : '#333',
            color: mercadoAberto ? '#000' : '#777',
            fontSize: 18,
            fontWeight: 900,
            textTransform: 'uppercase',
            borderRadius: 12,
            textDecoration: 'none',
            pointerEvents: mercadoAberto ? 'auto' : 'none',
            opacity: mercadoAberto ? 1 : 0.6,
          }}
        >
          {mercadoAberto ? 'CONVOCAR TITULARES' : 'MERCADO FECHADO'}
        </Link>
      </div>

      {/* Aqui você pode colocar novamente o resto da sua página (hero, ranking, chat, etc.) */}
      {/* Se quiser, me avise que eu ajudo a trazer o resto de volta de forma limpa */}
    </main>
  );
}
