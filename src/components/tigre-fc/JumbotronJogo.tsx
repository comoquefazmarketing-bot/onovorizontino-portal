'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Zap, Trophy, Shield, Users, MapPin, Tv } from 'lucide-react';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

// ── Design Tokens ────────────────
const C = {
  gold: '#F5C400',
  cyan: '#0057A8', // Azul oficial do Avaí
  red:  '#FF2D55',
  purple:'#BF5FFF',
  darkBg:'#0a0a0a',
  glass: 'rgba(255, 255, 255, 0.03)',
  shock: 'radial-gradient(circle, rgba(0,87,168,0.15) 0%, transparent 70%)'
};

interface Time {
  nome: string;
  escudo_url: string | null;
  sigla?: string | null;
}

interface Jogo {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local?: string | null;
  transmissao?: string | null;
  mandante: Time;
  visitante: Time;
}

interface Stats {
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
  ranking?: any[];
  participantes?: number;
}

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

function Countdown({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h: '00', m: '00', s: '00', crit: false });

  useEffect(() => {
    const calc = () => {
      // Ajuste para considerar o fuso e o tempo de fechamento (1h antes)
      const diff = new Date(dataHora).getTime() - 60 * 60_000 - Date.now();
      if (diff <= 0) { setT({ h: '00', m: '00', s: '00', crit: true }); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setT({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
        crit: h === 0 && m < 30
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dataHora]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 25 }}>
      {[ {v: t.h, l: 'HORAS'}, {v: t.m, l: 'MIN'}, {v: t.s, l: 'SEG'} ].map((item, i) => (
        <div key={i} style={{
          background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 16,
          border: i === 2 && t.crit ? `1px solid ${C.red}` : '1px solid rgba(255,255,255,0.08)',
          minWidth: 70, textAlign: 'center', backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: 32, fontWeight: 900, color: i === 2 && t.crit ? C.red : '#fff', lineHeight: 1 }}>{item.v}</div>
          <div style={{ fontSize: 8, fontWeight: 900, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{item.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: { jogo: Jogo, stats?: Stats, mercadoFechado?: boolean }) {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setMeuId(session.user.id);
    });
  }, []);

  const ranking = stats.ranking ?? [];
  const participantes = stats.participantes ?? 0;
  const capitao = stats.capitao ?? { nome: '---', pts: 0 };
  const heroi = stats.heroi ?? { nome: '---', pts: 0 };

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      maxWidth: 460, width: '100%', margin: '0 auto 20px auto',
      background: 'linear-gradient(180deg, #111 0%, #000 100%)',
      borderRadius: 40, border: '1px solid rgba(255,255,255,0.1)', padding: '30px 24px',
      boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Background Glow - Agora com tom azulado por causa do Avaí */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', 
        width: 300, height: 300, background: C.shock, filter: 'blur(60px)', zIndex: 0 }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.4)', padding: '4px 12px', borderRadius: 20 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: mercadoFechado ? C.red : '#00F3FF', boxShadow: `0 0 10px ${mercadoFechado ? C.red : '#00F3FF'}` }} />
          <span style={{ fontSize: 10, fontWeight: 900, color: mercadoFechado ? C.red : '#00F3FF', letterSpacing: '0.1em' }}>
            {mercadoFechado ? 'MERCADO FECHADO' : 'MERCADO ABERTO'}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>
          {jogo.competicao?.toUpperCase() || 'SÉRIE B'} · RODADA {jogo.rodada || '7'}
        </span>
      </div>

      {!mercadoFechado && jogo.data_hora && <Countdown dataHora={jogo.data_hora} />}

      {/* CONFRONTO (AVAÍ x NOVORIZONTINO) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 35, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.mandante?.escudo_url || 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AVAI.png'}
            style={{ width: 80, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(0,87,168,0.4))' }} alt="Avaí" />
          <div style={{ fontSize: 15, fontWeight: 900, color: C.cyan, marginTop: 10 }}>
            {jogo.mandante?.nome?.toUpperCase() || 'AVAÍ'}
          </div>
        </div>

        <div style={{ padding: '0 15px', textAlign: 'center' }}>
          <Zap size={32} color={C.gold} style={{ filter: 'drop-shadow(0 0 10px #F5C400)', marginBottom: 5 }} />
          <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', opacity: 0.5 }}>VS</div>
        </div>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.visitante?.escudo_url || 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png'}
            style={{ width: 80, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(245,196,0,0.4))' }} alt="Novorizontino" />
          <div style={{ fontSize: 15, fontWeight: 900, color: C.gold, marginTop: 10 }}>
            {jogo.visitante?.nome?.toUpperCase() || 'NOVORIZONTINO'}
          </div>
        </div>
      </div>

      {/* Info Local/Transmissão */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 25, opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#fff' }}>
            <MapPin size={12} /> {jogo.local?.split('—')[0] || 'ESTÁDIO DA RESSACADA'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#fff' }}>
            <Tv size={12} /> {jogo.transmissao || 'ESPN · DISNEY+'}
          </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 25, position: 'relative', zIndex: 1 }}>
        {[
          { label: 'CAPITÃO', data: capitao, color: C.gold, icon: <Trophy size={12} /> },
          { label: 'HERÓI', data: heroi, color: C.red, icon: <Shield size={12} /> }
        ].map((item, idx) => (
          <div key={idx} style={{
            flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px 10px', borderRadius: 24,
            border: `1px solid ${item.color}20`, textAlign: 'center', backdropFilter: 'blur(5px)'
          }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: item.color, letterSpacing: '0.15em', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              {item.icon} {item.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.data.nome.toUpperCase()}
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>
              {Number(item.data.pts).toFixed(1)}
              <span style={{ fontSize: 10, opacity: 0.4, marginLeft: 4 }}>PTS</span>
            </div>
          </div>
        ))}
      </div>

      {/* Botão de Ação */}
      <Link href={`/tigre-fc/escalar`} style={{ textDecoration: 'none' }}>
        <div style={{
          background: mercadoFechado ? 'rgba(255,255,255,0.05)' : `linear-gradient(90deg, ${C.gold}, #FFE57E)`,
          padding: 22, borderRadius: 24, textAlign: 'center',
          color: mercadoFechado ? 'rgba(255,255,255,0.2)' : '#000', 
          fontSize: 16, fontWeight: 900, letterSpacing: '0.05em',
          boxShadow: mercadoFechado ? 'none' : `0 20px 40px ${C.gold}30`,
          cursor: mercadoFechado ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
        }}>
          {mercadoFechado ? 'MERCADO ENCERRADO' : <><Users size={20} /> CONVOCAR TITULARES →</>}
        </div>
      </Link>

      {/* Ranking */}
      {ranking.length > 0 && (
        <div style={{ marginTop: 30, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
            <span style={{ fontSize: 11, fontWeight: 900, color: C.purple, letterSpacing: '0.1em' }}>GLOBAL RANKING</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 800 }}>{participantes} JOGANDO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranking.slice(0, 3).map((r, i) => (
              <div key={i} onClick={() => setPerfilAberto(r.apelido || r.nome || '')} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 15px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', cursor: 'pointer'
              }}>
                <span style={{ fontSize: 13, color: i === 0 ? C.gold : '#fff', fontWeight: i === 0 ? 900 : 600 }}>
                  {i + 1}º {r.apelido || r.nome || 'Torcedor'}
                </span>
                <span style={{ fontSize: 13, fontWeight: 900, color: C.purple }}>{r.pontos} <small style={{ fontSize: 9 }}>PTS</small></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </div>
  );
}
