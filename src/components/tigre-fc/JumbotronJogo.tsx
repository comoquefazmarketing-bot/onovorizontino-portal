'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Time {
  nome: string;
  escudo_url: string | null;
  sigla: string | null;
}

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
  ranking?: any[];
  participantes?: number;
  posicao?: number;
  golsSofridos?: number;
  mediaSofaTime?: number;
  mvp?: { nome: string; media: number };
}

interface Props {
  jogo: Jogo;
  stats?: Stats;
  mercadoFechado?: boolean;
}

function Countdown({ dataHora }: { dataHora: string }) {
  const [time, setTime] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const calc = () => {
      const target = new Date(dataHora).getTime();
      const lock = target - 90 * 60 * 1000;
      const diff = lock - Date.now();
      if (diff <= 0) { setTime({ h: '00', m: '00', s: '00' }); return; }
      setTime({
        h: String(Math.floor(diff / 3_600_000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60_000) / 1_000)).padStart(2, '0'),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dataHora]);

  return (
    <div className="flex items-end justify-center gap-1 mb-4">
      {(['h', 'm', 's'] as const).map((u, i) => (
        <div key={u} className="flex items-center gap-1">
          <div className="flex flex-col items-center"
            style={{ background: '#0a0a0a', border: '1px solid rgba(245,196,0,0.2)', borderRadius: 6, padding: '6px 10px', minWidth: 46, textAlign: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed',monospace", fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: '0 0 16px rgba(255,255,255,0.25)' }}>
              {time[u]}
            </span>
            <span style={{ fontSize: 6, fontWeight: 900, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>
              {u === 'h' ? 'HORAS' : u === 'm' ? 'MIN' : 'SEG'}
            </span>
          </div>
          {i < 2 && (
            <span style={{ fontSize: 22, fontWeight: 900, color: 'rgba(245,196,0,0.35)', paddingBottom: 14 }}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const {
    ranking = [],
    participantes = 847,
    posicao = 4,
    golsSofridos = 0,
    mediaSofaTime = 7.08,
    mvp = { nome: 'Neto Pessoa', media: 7.90 },
  } = stats;

  const dataFmt = new Date(jogo.data_hora).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo',
  });
  const horaFmt = new Date(jogo.data_hora).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  });

  const LED = {
    bg: '#000',
    gold: '#F5C400',
    goldDim: 'rgba(245,196,0,0.5)',
    white: '#fff',
    dim: 'rgba(255,255,255,0.25)',
  };

  const panelStyle: React.CSSProperties = {
    background: 'rgba(245,196,0,0.04)',
    border: '1px solid rgba(245,196,0,0.12)',
    borderRadius: 10,
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  };

  return (
    <div style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif", background: LED.bg, borderRadius: 16, overflow: 'hidden', position: 'relative', padding: 2 }}>
      
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'radial-gradient(circle,rgba(245,196,0,0.05) 1px,transparent 1px)', backgroundSize: '4px 4px' }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px 24px' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(245,196,0,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E', display: 'inline-block' }} className="animate-pulse" />
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.35em', color: LED.gold }}>{jogo.competicao.toUpperCase()}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: LED.dim }}>
            {jogo.rodada.toUpperCase()} · {mercadoFechado ? 'FECHADO' : 'ABERTO'}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 1fr', gap: 12, alignItems: 'start' }}>

          <div style={panelStyle}>
            <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.35em', color: 'rgba(245,196,0,0.5)', borderBottom: '1px solid rgba(245,196,0,0.1)', paddingBottom: 6 }}>MACHINE · DATA</div>
            <div>
              <div style={{ fontSize: 9, color: LED.dim, marginBottom: 2 }}>MÉDIA SOFASCORE</div>
              <div style={{ fontSize: 24, fontWeight: 900, fontStyle: 'italic', color: LED.gold, textShadow: '0 0 10px rgba(245,196,0,0.6)' }}>{mediaSofaTime.toFixed(2)}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: LED.dim, marginBottom: 2 }}>MVP ÚLTIMO JOGO</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{mvp.nome.toUpperCase()}</div>
              <div style={{ fontSize: 11, fontWeight: 900, color: LED.gold }}>{mvp.media.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Countdown dataHora={jogo.data_hora} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 15 }}>
              <img src={jogo.mandante.escudo_url || ''} style={{ width: 40, height: 40, objectFit: 'contain' }} alt="" />
              <span style={{ fontSize: 14, fontWeight: 900, color: 'rgba(255,255,255,0.2)' }}>VS</span>
              <img src={jogo.visitante.escudo_url || ''} style={{ width: 40, height: 40, objectFit: 'contain' }} alt="" />
            </div>
            <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
              width: '100%', background: LED.gold, borderRadius: 8, color: '#000', fontSize: 10, fontWeight: 900, padding: '10px', textAlign: 'center', textDecoration: 'none'
            }}>CONVOCAR TITULARES</Link>
          </div>

          <div style={panelStyle}>
            <div style={{ fontSize: 8, fontWeight: 900, letterSpacing: '0.35em', color: 'rgba(245,196,0,0.5)', borderBottom: '1px solid rgba(245,196,0,0.1)', paddingBottom: 6 }}>RANKING · TOP 5</div>
            {ranking.slice(0, 5).map((u, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.apelido || u.nome}</span>
                <span style={{ fontSize: 10, fontWeight: 900, color: LED.gold }}>{u.pontos_total || 0}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 4, marginTop: 14 }}>
          {[
            { val: `${posicao}°`, lbl: 'SÉRIE B' },
            { val: `${golsSofridos}`, lbl: 'CLEAN SHEETS' },
            { val: participantes, lbl: 'PLAYERS' }
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 6, padding: '6px 2px' }}>
              <div style={{ fontSize: 16, fontWeight: 900, fontStyle: 'italic', color: LED.gold }}>{s.val}</div>
              <div style={{ fontSize: 6, fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
