'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

// ── Design Tokens ────────────────
const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red:  '#FF2D55',
  purple:'#BF5FFF',
  darkBg:'#0a0a0a',
  glass: 'rgba(255, 255, 255, 0.03)'
};

// ── Tipos flexíveis ──────────────
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
  [key: string]: any; // aceita campos extras do Supabase
}

interface RankUser {
  apelido?: string | null;
  nome?: string | null;
  pontos: number;
  [key: string]: any;
}

// 🔑 Stats flexível — aceita qualquer prop nova vinda do banco
interface Stats {
  capitao?:        { nome: string; pts: number };
  heroi?:          { nome: string; pts: number };
  mvp?:            { nome: string; media: number };
  ranking?:        RankUser[];
  participantes?:  number;
  posicao?:        number;
  mediaSofa?:      number;
  mediaSofaTime?:  number;
  golsSofridos?:   number;
  [key: string]: any; // ⚠️ chave: deixa o Supabase mandar o que quiser
}

interface Props {
  jogo: Jogo;
  stats?: Stats;
  mercadoFechado?: boolean;
}

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

function Countdown({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h: '00', m: '00', s: '00', crit: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(dataHora).getTime() - 90 * 60_000 - Date.now();
      if (diff <= 0) { setT({ h: '00', m: '00', s: '00', crit: true }); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setT({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
        crit: h === 0 && m < 15
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dataHora]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
      {[ {v: t.h, l: 'HORAS'}, {v: t.m, l: 'MIN'}, {v: t.s, l: 'SEG'} ].map((item, i) => (
        <div key={i} style={{
          background: '#111', padding: '12px 15px', borderRadius: 12,
          border: i === 2 && t.crit ? `1px solid ${C.red}` : '1px solid #222',
          minWidth: 75, textAlign: 'center'
        }}>
          <div style={{ fontSize: 38, fontWeight: 900, color: i === 2 && t.crit ? C.red : '#fff', lineHeight: 1 }}>{item.v}</div>
          <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{item.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setMeuId(session.user.id);
    });
  }, []);

  const ranking       = stats.ranking ?? [];
  const participantes = stats.participantes ?? 0;
  const capitao       = stats.capitao ?? { nome: '---', pts: 0 };
  const heroi         = stats.heroi   ?? { nome: '---', pts: 0 };

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      maxWidth: 460, width: '95%', margin: '0 auto 20px auto',
      background: 'linear-gradient(180deg, #0f0f0f 0%, #000 100%)',
      borderRadius: 32, border: '1px solid #222', padding: 24,
      boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, opacity: 0.4 }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%',
            background: mercadoFechado ? C.red : C.cyan,
            boxShadow: `0 0 10px ${mercadoFechado ? C.red : C.cyan}` }} />
          <span style={{ fontSize: 11, fontWeight: 900,
            color: mercadoFechado ? C.red : C.cyan, letterSpacing: '0.15em' }}>
            {mercadoFechado ? 'MERCADO FECHADO' : 'MERCADO ABERTO'}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
          {jogo.competicao?.toUpperCase()} · RODADA {jogo.rodada}
        </span>
      </div>

      {!mercadoFechado && jogo.data_hora && <Countdown dataHora={jogo.data_hora} />}

      {/* Confronto */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.mandante?.escudo_url || FALLBACK}
            style={{ width: 75, height: 75, objectFit: 'contain', marginBottom: 10 }} alt="Mandante" />
          <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>
            {jogo.mandante?.nome?.toUpperCase()}
          </div>
        </div>

        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.1)', fontStyle: 'italic' }}>VS</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: C.gold, marginTop: 5 }}>
            {jogo.data_hora ? new Date(jogo.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '--/--'}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.visitante?.escudo_url || FALLBACK}
            style={{ width: 75, height: 75, objectFit: 'contain', marginBottom: 10 }} alt="Visitante" />
          <div style={{ fontSize: 14, fontWeight: 900, color: C.gold }}>
            {jogo.visitante?.nome?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Cards Capitão / Herói (FIFA Style) */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 25 }}>
        {[
          { label: 'CAPITÃO', data: capitao, color: C.gold },
          { label: 'HERÓI',   data: heroi,   color: C.red  }
        ].map((item, idx) => (
          <div key={idx} style={{
            flex: 1, background: 'rgba(255,255,255,0.02)', padding: 15, borderRadius: 20,
            border: `1px solid ${item.color}33`, textAlign: 'center', backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: 9, fontWeight: 900, color: item.color, letterSpacing: '0.15em', marginBottom: 6 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.data.nome.toUpperCase()}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginTop: 2 }}>
              {Number(item.data.pts).toFixed(1)}
              <small style={{ fontSize: 10, opacity: 0.5, marginLeft: 4 }}>PTS</small>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ textDecoration: 'none' }}>
        <div style={{
          background: mercadoFechado ? '#1a1a1a' : `linear-gradient(90deg, ${C.gold}, #FFE57E)`,
          padding: 20, borderRadius: 20, textAlign: 'center',
          color: '#000', fontSize: 17, fontWeight: 900, letterSpacing: '0.05em',
          boxShadow: mercadoFechado ? 'none' : `0 15px 30px ${C.gold}33`,
          opacity: mercadoFechado ? 0.5 : 1,
          transition: 'transform 0.2s ease',
          cursor: mercadoFechado ? 'not-allowed' : 'pointer'
        }}>
          {mercadoFechado ? 'MERCADO ENCERRADO' : 'CONVOCAR TITULARES →'}
        </div>
      </Link>

      {/* Ranking */}
      {ranking.length > 0 && (
        <div style={{ marginTop: 25, paddingTop: 20, borderTop: '1px solid #222' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: C.purple, letterSpacing: '0.1em' }}>
              GLOBAL RANKING
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>
              {participantes} JOGANDO
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ranking.slice(0, 5).map((r, i) => (
              <div key={i} onClick={() => setPerfilAberto(r.apelido || r.nome || '')} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer',
                background: i === 0 ? 'rgba(245, 196, 0, 0.05)' : 'transparent',
                padding: i === 0 ? '8px 12px' : '0 12px',
                borderRadius: 10
              }}>
                <span style={{ fontSize: 14, color: i === 0 ? C.gold : '#fff', fontWeight: i === 0 ? 900 : 500 }}>
                  {i + 1}º {r.apelido || r.nome || 'Torcedor'}
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, color: C.purple }}>
                  {r.pontos}
                  <small style={{ fontSize: 10, marginLeft: 3 }}>PTS</small>
                </span>
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
