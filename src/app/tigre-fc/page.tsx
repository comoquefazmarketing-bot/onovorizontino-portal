'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';

import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const ESCUDOS_SERIE_B: Record<string, string> = {
  'novorizontino': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png',
  'america-mg': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png',
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

interface RankingUser {
  id: string;
  nome: string;
  apelido?: string;
  avatar_url?: string;
  pontos_total: number;
}

function FlipDigit({ value }: { value: string }) {
  return <motion.span key={value} initial={{ rotateX: -90, opacity: 0 }} animate={{ rotateX: 0, opacity: 1 }} transition={{ duration: 0.25 }}>{value}</motion.span>;
}

function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 68, height: 68, background: 'linear-gradient(145deg, #0f0f0f, #1a1a00)', border: '1px solid rgba(245,196,0,0.4)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 34, fontWeight: 900, color: '#F5C400' }}>
          <FlipDigit value={value[0]} /><FlipDigit value={value[1]} />
        </span>
      </div>
      <span style={{ fontSize: 9, fontWeight: 900, color: '#666', letterSpacing: 2 }}>{label}</span>
    </div>
  );
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  use(params);

  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  // Carrega jogo da 4ª rodada
  useEffect(() => {
    if (!mounted) return;

    setJogo({
      id: 4,
      data_hora: '2026-04-12T18:00:00',
      competicao: 'Brasileirão Série B',
      rodada: '4ª Rodada',
      local: 'Arena da Independência • Belo Horizonte',
      mandante: { nome: 'América-MG', slug: 'america-mg' },
      visitante: { nome: 'Novorizontino', slug: 'novorizontino' },
    });
  }, [mounted]);

  // Carrega Ranking Público
  useEffect(() => {
    async function loadRanking() {
      const { data } = await sb
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);

      if (data) setRanking(data);
    }
    loadRanking();
  }, []);

  // Timer
  useEffect(() => {
    if (!jogo?.data_hora) return;

    const tick = () => {
      const gameTime = new Date(jogo.data_hora).getTime();
      const now = Date.now();
      const fechamento = gameTime - 60 * 60 * 1000; // 1h antes

      const diff = fechamento - now;
      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        setMercadoAberto(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ h: String(hours).padStart(2, '0'), m: String(minutes).padStart(2, '0'), s: String(seconds).padStart(2, '0') });
    };

    const interval = setInterval(tick, 1000);
    tick();
    return () => clearInterval(interval);
  }, [jogo]);

  if (!mounted || !jogo) {
    return <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>Carregando Tigre FC...</div>;
  }

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif" }}>

      {/* TIMER */}
      <div style={{ padding: '50px 20px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <TimerBlock value={timeLeft.h} label="HRS" />
          <span style={{ fontSize: 42, color: '#F5C400', marginTop: -10 }}>:</span>
          <TimerBlock value={timeLeft.m} label="MIN" />
          <span style={{ fontSize: 42, color: '#F5C400', marginTop: -10 }}>:</span>
          <TimerBlock value={timeLeft.s} label="SEG" />
        </div>
        <p style={{ marginTop: 12, color: '#888' }}>
          Mercado aberto até 1h antes do jogo
        </p>
      </div>

      {/* BOTÃO CONVOCAR */}
      <div style={{ textAlign: 'center', paddingBottom: 40 }}>
        <Link
          href={`/tigre-fc/escalar/${jogo.id}`}
          style={{
            display: 'inline-block',
            padding: '16px 52px',
            background: mercadoAberto ? '#F5C400' : '#333',
            color: mercadoAberto ? '#000' : '#777',
            fontSize: 18,
            fontWeight: 900,
            textTransform: 'uppercase',
            borderRadius: 12,
            textDecoration: 'none',
          }}
        >
          {mercadoAberto ? 'CONVOCAR TITULARES' : 'MERCADO FECHADO'}
        </Link>
      </div>

      {/* THE BEST TIGRE FC - mantido da sua última versão */}
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p style={{ color: '#F5C400', fontSize: 14, letterSpacing: 4, marginBottom: 8 }}>THE BEST TIGRE FC</p>
        <p style={{ color: '#666', fontSize: 13 }}>RODADA 3 • NOVORIZONTINO 1×1 CRB</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginTop: 30 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#111', padding: 12, borderRadius: 16, border: '2px solid #F5C400' }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ROMULO%20FUNDO%20TRANSPARENTE.png" alt="Rômulo" style={{ width: 140 }} />
              <p style={{ margin: '10px 0 4px', fontSize: 22, fontWeight: 900 }}>15.8</p>
              <p style={{ fontSize: 12, color: '#F5C400' }}>RATING ×2 • CAPITÃO</p>
            </div>
            <p style={{ marginTop: 8 }}>Rômulo</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ background: '#111', padding: 12, borderRadius: 16, border: '2px solid #00F3FF' }}>
              <img src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CARLAO%20FUNDO%20TRANSPARENTE.png" alt="Carlão" style={{ width: 140 }} />
              <p style={{ margin: '10px 0 4px', fontSize: 22, fontWeight: 900 }}>7.5</p>
              <p style={{ fontSize: 12, color: '#00F3FF' }}>HERÓI DA RODADA</p>
            </div>
            <p style={{ marginTop: 8 }}>Carlão</p>
          </div>
        </div>
      </div>

      {/* RANKING PÚBLICO */}
      <div style={{ padding: '40px 20px', background: '#0a0a0a' }}>
        <h2 style={{ textAlign: 'center', color: '#F5C400', marginBottom: 20 }}>🏆 RANKING DA TORCIDA</h2>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          {ranking.map((user, index) => (
            <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #222' }}>
              <span style={{ width: 30, color: '#F5C400', fontWeight: 900 }}>{index + 1}º</span>
              <img src={user.avatar_url || PATA_LOGO} alt={user.nome} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700 }}>{user.apelido || user.nome}</p>
              </div>
              <p style={{ color: '#F5C400', fontWeight: 900 }}>{user.pontos_total} pts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seções que você já tinha */}
      <DestaquesFifa />
      <TigreFCChat />

      {/* Se quiser adicionar o perfil público depois */}
      {/* <TigreFCPerfilPublico /> */}

    </main>
  );
}
