'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Trophy, Shield, Users } from 'lucide-react';

// ── Design Tokens (Simbiose Visual) ───────────────────────
const C = {
  gold:   '#F5C400',
  cyan:   '#00F3FF',
  red:    '#FF2D55',
  purple: '#BF5FFF',
  gGold:  '0 0 8px rgba(245,196,0,0.6), 0 0 20px rgba(245,196,0,0.3)',
  gCyan:  '0 0 8px rgba(0,243,255,0.7), 0 0 20px rgba(0,243,255,0.35)',
  gRed:   '0 0 8px rgba(255,45,85,0.7), 0 0 20px rgba(255,45,85,0.35)',
};

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

interface Time { nome: string; escudo_url: string | null; }
interface Jogo {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string | null;
  transmissao: string | null;
  mandante: Time;
  visitante: Time;
}
interface Stats {
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: { jogo: Jogo, stats?: Stats, mercadoFechado?: boolean }) {
  const capitaoNome = stats?.capitao?.nome || '---';
  const heroiNome = stats?.heroi?.nome || '---';

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      background: '#000',
      borderRadius: 32,
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid rgba(255,255,255,0.1)',
      maxWidth: 480,
      width: '100%',
      margin: '0 auto',
      padding: '24px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
    }}>
      {/* Scanline Effect */}
      <div style={{ 
        position: 'absolute', inset: 0, pointerEvents: 'none', 
        backgroundImage: 'linear-gradient(rgba(245,196,0,0.03) 1px, transparent 1px)', 
        backgroundSize: '100% 4px' 
      }} />

      {/* Header Estilo Broadcast */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.cyan, boxShadow: C.gCyan, animation: 'pulse 1.5s infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 900, color: C.cyan, letterSpacing: '2px' }}>LIVE BROADCAST</span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '1px' }}>
          {jogo.competicao.toUpperCase()} • RD {jogo.rodada}
        </span>
      </div>

      {/* Confronto Principal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, position: 'relative' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <img src={jogo.mandante.escudo_url || FALLBACK} style={{ width: 75, height: 75, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }} alt="Mandante" />
          {/* CORREÇÃO AQUI: fontStyle em vez de italic */}
          <div style={{ fontSize: 14, fontWeight: 900, marginTop: 10, color: '#fff', fontStyle: 'italic' }}>{jogo.mandante.nome.toUpperCase()}</div>
        </div>
        
        <div style={{ textAlign: 'center', padding: '0 20px' }}>
          <Zap size={24} color={C.gold} fill={C.gold} style={{ filter: `drop-shadow(${C.gGold})` }} />
          <div style={{ fontSize: 14, fontWeight: 900, color: C.gold, marginTop: 4 }}>VS</div>
        </div>

        <div style={{ textAlign: 'center', flex: 1 }}>
          <img src={jogo.visitante.escudo_url || FALLBACK} style={{ width: 75, height: 75, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }} alt="Visitante" />
          <div style={{ fontSize: 14, fontWeight: 900, marginTop: 10, color: C.gold, fontStyle: 'italic' }}>{jogo.visitante.nome.toUpperCase()}</div>
        </div>
      </div>

      {/* Grid de Escalação Atual */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24, position: 'relative' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.gold}30`, borderRadius: 24, padding: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: C.gold, marginBottom: 6, letterSpacing: '1px' }}>
            <Trophy size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> CAPITÃO
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: capitaoNome === '---' ? 'rgba(255,255,255,0.1)' : '#fff', textTransform: 'uppercase', fontStyle: 'italic' }}>
            {capitaoNome}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.red}30`, borderRadius: 24, padding: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: C.red, marginBottom: 6, letterSpacing: '1px' }}>
            <Shield size={12} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} /> HERÓI
          </div>
          <div style={{ fontSize: 18, fontWeight: 900, color: heroiNome === '---' ? 'rgba(255,255,255,0.1)' : '#fff', textTransform: 'uppercase', fontStyle: 'italic' }}>
            {heroiNome}
          </div>
        </div>
      </div>

      {/* Botão de Ação */}
      <Link href="/tigre-fc/escalar" style={{ textDecoration: 'none' }}>
        <div style={{
          background: `linear-gradient(90deg, ${C.gold}, #FFE57E)`,
          padding: 22, borderRadius: 24, textAlign: 'center', color: '#000',
          fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 10px 20px rgba(245,196,0,0.2)'
        }}>
          <Users size={20} />
          {capitaoNome === '---' ? 'CONVOCAR TITULARES →' : 'ALTERAR ESCALAÇÃO →'}
        </div>
      </Link>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
