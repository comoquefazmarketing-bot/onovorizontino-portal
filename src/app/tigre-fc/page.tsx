'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const ESCUDOS_SERIE_B: Record<string, string> = {
  'novorizontino': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png',
  'juventude': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/juventude.png',
  'crb': 'https://upload.wikimedia.org/wikipedia/commons/7/73/CRB_logo.svg',
  'america-mg': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png',
  'athletic-mg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Athletic_Club_%28Minas_Gerais%29.svg/1280px-Athletic_Club_%28Minas_Gerais%29.svg.png',
  // ... adicione os demais escudos aqui
};

function resolveEscudo(slugOrNome?: string, fallback?: string): string {
  if (!slugOrNome) return fallback ?? PATA_LOGO;
  const slug = slugOrNome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return ESCUDOS_SERIE_B[slug] ?? fallback ?? PATA_LOGO;
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
    <motion.span
      key={value}
      initial={{ rotateX: -90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 0.25 }}
      style={{ display: 'inline-block' }}
    >
      {value}
    </motion.span>
  );
}

function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          position: 'relative',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0f0f0f, #1a1a00)',
          border: '1px solid rgba(245,196,0,0.2)',
          borderRadius: 14,
        }}
      >
        <span
          style={{
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontSize: 30,
            fontWeight: 900,
            color: '#F5C400',
          }}
        >
          <FlipDigit value={value[0]} />
          <FlipDigit value={value[1]} />
        </span>
      </div>
      <span style={{ fontSize: 7, fontWeight: 900, color: '#444', letterSpacing: 3, textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  );
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  use(params);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 280], [1, 0]);

  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function init() {
      const resJogo = await fetch('/api/proximo-jogo')
        .then((r) => r.json())
        .catch(() => null);

      if (resJogo?.jogos?.length > 0) {
        setJogo(resJogo.jogos[0]);
      } else {
        // ✅ AJUSTADO PARA A 4ª RODADA
        setJogo({
          id: 4,
          data_hora: '2026-04-12T18:00:00', // Domingo, 12/04/2026 às 18:00 (horário de Brasília)
          competicao: 'Brasileirão Série B',
          rodada: '4ª Rodada',
          local: 'Arena da Independência • Belo Horizonte',
          mandante: {
            nome: 'América-MG',
            slug: 'america-mg',
            escudo_url: resolveEscudo('america-mg'),
          },
          visitante: {
            nome: 'Novorizontino',
            slug: 'novorizontino',
            escudo_url: resolveEscudo('novorizontino'),
          },
        });
      }

      // Ranking
      const { data: resRank } = await sb
        .from('tigre_fc_usuarios')
        .select('id,nome,apelido,avatar_url,pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);

      if (resRank) setRanking(resRank);

      // Usuário atual
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb
          .from('tigre_fc_usuarios')
          .select('id')
          .eq('google_id', session.user.id)
          .maybeSingle();
        if (u) setMeuId(u.id);
      }
    }

    init();
  }, [mounted]);

  // Timer + Fechamento do Mercado (1 hora antes do jogo)
  useEffect(() => {
    if (!jogo?.data_hora) return;

    const tick = () => {
      const gameTime = new Date(jogo.data_hora).getTime();
      const now = Date.now();

      // Fechamento do mercado: 1 hora antes (17:00)
      const fechamentoMercado = gameTime - 60 * 60 * 1000;
      const diff = fechamentoMercado - now;

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
      setMercadoAberto(true);
    };

    const t = setInterval(tick, 1000);
    tick();

    return () => clearInterval(t);
  }, [jogo]);

  if (!mounted) return null;

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif" }}>
      {/* Seu hero, match card, ranking etc. permanecem iguais */}

      {/* Timer no Match Card */}
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', margin: '20px 0' }}>
        <TimerBlock value={timeLeft.h} label="HRS" />
        <span style={{ fontSize: 18, color: '#F5C400', marginTop: 15 }}>:</span>
        <TimerBlock value={timeLeft.m} label="MIN" />
        <span style={{ fontSize: 18, color: '#F5C400', marginTop: 15 }}>:</span>
        <TimerBlock value={timeLeft.s} label="SEG" />
      </div>

      {/* Link para escalar */}
      <Link
        href={`/tigre-fc/escalar/${jogo?.id || 4}`}
        style={{
          opacity: mercadoAberto ? 1 : 0.5,
          pointerEvents: mercadoAberto ? 'auto' : 'none',
          display: 'inline-block',
          padding: '14px 32px',
          background: mercadoAberto ? '#F5C400' : '#333',
          color: mercadoAberto ? '#000' : '#888',
          fontWeight: 900,
          textTransform: 'uppercase',
          borderRadius: 12,
          textDecoration: 'none',
        }}
      >
        {mercadoAberto ? 'CONVOCAR TITULARES' : 'MERCADO FECHADO'}
      </Link>

      {/* Restante do seu código (Chat, Perfil, Destaques, etc.) */}
    </main>
  );
}
