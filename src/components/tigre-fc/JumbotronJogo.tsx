'use client';
// src/components/tigre-fc/JumbotronJogo.tsx
// Card estilo LED Jumbotron/Broadcast — substitui o card padrão na TigreFCPage

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
  topPontuador?: { nome: string; pts: number; tipo: string };
  mediaSofa?: number;
  maisEscalado?: { nome: string; pct: number };
  ranking?: Array<{ apelido: string; pontos: number }>;
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
      const lock   = target - 90 * 60 * 1000;
      const diff   = lock - Date.now();
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
        <>
          <div key={u} className="flex flex-col items-center"
            style={{ background: '#0a0a0a', border: '1px solid rgba(245,196,0,0.2)', borderRadius: 6, padding: '6px 10px', minWidth: 46, textAlign: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed',monospace", fontSize: 30, fontWeight: 900, color: '#fff', lineHeight: 1, textShadow: '0 0 16px rgba(255,255,255,0.25)' }}>
              {time[u]}
            </span>
            <span style={{ fontSize: 6, fontWeight: 900, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>
              {u === 'h' ? 'HORAS' : u === 'm' ? 'MIN' : 'SEG'}
            </span>
          </div>
          {i < 2 && (
            <span key={`sep${i}`} style={{ fontSize: 22, fontWeight: 900, color: 'rgba(245,196,0,0.35)', paddingBottom: 14 }}>:</span>
          )}
        </>
      ))}
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const {
    topPontuador   = { nome: 'Carlão', pts: 36, tipo: 'Capitão' },
    mediaSofa      = 7.5,
    maisEscalado   = { nome: 'Rômulo', pct: 87 },
    ranking        = [],
    participantes  = 0,
    posicao        = 4,
    golsSofridos   = 5,
    mediaSofaTime  = 6.88,
    mvp            = { nome: 'Sander', media: 7.60 },
  } = stats;

  const dataFmt = new Date(jogo.data_hora).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo',
  });
  const horaFmt = new Date(jogo.data_hora).toLocaleTimeString('pt-BR', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
  });

  const LED = {
    bg:       '#000',
    gold:     '#F5C400',
    goldDim:  'rgba(245,196,0,0.5)',
    goldFaint:'rgba(245,196,0,0.12)',
    white:    '#fff',
    dim:      'rgba(255,255,255,0.25)',
    faint:    'rgba(255,255,255,0.05)',
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

  const statTitleStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed',sans-serif",
    fontSize: 8, fontWeight: 900, letterSpacing: '0.35em',
    color: 'rgba(245,196,0,0.5)',
    borderBottom: '1px solid rgba(245,196,0,0.1)',
    paddingBottom: 6, marginBottom: 4,
  };

  const statValStyle: React.CSSProperties = {
    fontFamily: "'Barlow Condensed',sans-serif",
    fontSize: 24, fontWeight: 900, fontStyle: 'italic',
    color: LED.gold, lineHeight: 1,
    textShadow: '0 0 10px rgba(245,196,0,0.6)',
  };

  return (
    <div style={{ fontFamily: "'Barlow Condensed',Impact,sans-serif", background: LED.bg, borderRadius: 16, overflow: 'hidden', position: 'relative', padding: 2 }}>

      {/* LED pixel texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'radial-gradient(circle,rgba(245,196,0,0.05) 1px,transparent 1px)',
        backgroundSize: '4px 4px',
      }} />

      {/* Tiger watermark */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(245,196,0,0.018) 12px,rgba(245,196,0,0.018) 14px),
          repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,196,0,0.012) 18px,rgba(245,196,0,0.012) 20px)
        `,
      }} />

      {/* Border glow */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: 16, zIndex: 10, pointerEvents: 'none',
        border: '1px solid rgba(245,196,0,0.25)',
        boxShadow: 'inset 0 0 60px rgba(245,196,0,0.04), 0 0 40px rgba(245,196,0,0.08)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px 24px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid rgba(245,196,0,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E, 0 0 12px #22C55E', display: 'inline-block', animation: 'pulse 1s ease-in-out infinite' }} />
            <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.35em', color: LED.gold, textShadow: '0 0 12px rgba(245,196,0,0.8)' }}>
              {jogo.competicao.toUpperCase()}
            </span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: LED.dim }}>
            RODADA {jogo.rodada} · MERCADO {mercadoFechado ? 'FECHADO' : 'ABERTO'}
          </span>
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)' }}>TIGRE FC</span>
        </div>

        {/* Main 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 1fr', gap: 12, alignItems: 'start' }}>

          {/* LEFT: Fantasy stats */}
          <div style={panelStyle}>
            <div style={statTitleStyle}>FANTASY · LIVE</div>

            <div>
              <div style={{ fontSize: 9, color: LED.dim, letterSpacing: '0.1em', marginBottom: 2 }}>TOP PONTUADOR</div>
              <div style={statValStyle}>{topPontuador.pts.toFixed(1)}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{topPontuador.nome} · {topPontuador.tipo}</div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginTop: 4 }}>
                <div style={{ height: 2, width: '100%', background: 'linear-gradient(90deg,#F5C400,#ffeb85)', borderRadius: 1, boxShadow: '0 0 6px rgba(245,196,0,0.6)' }} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 9, color: LED.dim, letterSpacing: '0.1em', marginBottom: 2 }}>MÉDIA SOFASCORE</div>
              <div style={statValStyle}>{mediaSofa.toFixed(1)}</div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginTop: 4 }}>
                <div style={{ height: 2, width: `${(mediaSofa / 10) * 100}%`, background: 'linear-gradient(90deg,#F5C400,#ffeb85)', borderRadius: 1, boxShadow: '0 0 6px rgba(245,196,0,0.6)' }} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 9, color: LED.dim, letterSpacing: '0.1em', marginBottom: 2 }}>+ ESCALADO</div>
              <div style={{ ...statValStyle, fontSize: 16 }}>{maisEscalado.nome}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{maisEscalado.pct}% dos times</div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 1, marginTop: 4 }}>
                <div style={{ height: 2, width: `${maisEscalado.pct}%`, background: 'linear-gradient(90deg,#F5C400,#ffeb85)', borderRadius: 1, boxShadow: '0 0 6px rgba(245,196,0,0.6)' }} />
              </div>
            </div>
          </div>

          {/* CENTER: Jogo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Countdown dataHora={jogo.data_hora} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
              {/* Mandante */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
                <div style={{ width: 44, height: 44, background: '#111', border: '1px solid rgba(245,196,0,0.15)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {jogo.mandante.escudo_url
                    ? <img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                    : <span style={{ fontSize: 20 }}>⚽</span>
                  }
                </div>
                <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: '0.1em', color: LED.dim, textAlign: 'center' }}>
                  {(jogo.mandante.sigla || jogo.mandante.nome).toUpperCase()}
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '0 4px' }}>
                <div style={{ fontSize: 12, fontWeight: 900, fontStyle: 'italic', color: 'rgba(245,196,0,0.2)' }}>VS</div>
                <div style={{ fontSize: 9, fontWeight: 900, color: LED.gold, marginTop: 2, textShadow: '0 0 8px rgba(245,196,0,0.6)' }}>
                  {dataFmt} · {horaFmt}
                </div>
              </div>

              {/* Visitante */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, flex: 1 }}>
                <div style={{ width: 44, height: 44, background: '#111', border: '1px solid rgba(245,196,0,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 0 20px rgba(245,196,0,0.15)' }}>
                  {jogo.visitante.escudo_url
                    ? <img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} style={{ width: 32, height: 32, objectFit: 'contain' }} />
                    : <span style={{ fontSize: 20 }}>🐯</span>
                  }
                </div>
                <span style={{ fontSize: 7, fontWeight: 900, letterSpacing: '0.1em', color: LED.gold, textAlign: 'center', textShadow: '0 0 6px rgba(245,196,0,0.4)' }}>
                  {(jogo.visitante.sigla || jogo.visitante.nome).toUpperCase()}
                </span>
              </div>
            </div>

            {jogo.local && (
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textAlign: 'center', marginBottom: 10 }}>
                📍 {jogo.local.toUpperCase()}
              </div>
            )}

            {/* CTA */}
            {mercadoFechado ? (
              <div style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900, letterSpacing: '0.25em', padding: '11px 16px', textAlign: 'center' }}>
                🔒 MERCADO FECHADO
              </div>
            ) : (
              <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%',
                background: 'linear-gradient(135deg,#F5C400,#D4A200)',
                border: 'none', borderRadius: 8,
                color: '#000', fontSize: 11, fontWeight: 900, letterSpacing: '0.25em',
                padding: '11px 16px', textDecoration: 'none', textAlign: 'center',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}>
                CONVOCAR TITULARES →
              </Link>
            )}

            {jogo.transmissao && (
              <div style={{ fontSize: 7, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginTop: 8 }}>
                📺 {jogo.transmissao}
              </div>
            )}
          </div>

          {/* RIGHT: Ranking */}
          <div style={panelStyle}>
            <div style={statTitleStyle}>RANKING · TOP 5</div>
            {ranking.slice(0, 5).map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, fontWeight: 900, color: 'rgba(245,196,0,0.45)', minWidth: 16 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {u.apelido}
                </span>
                <span style={{ fontSize: 10, fontWeight: 900, color: LED.gold, textShadow: '0 0 6px rgba(245,196,0,0.5)' }}>
                  {u.pontos}
                </span>
              </div>
            ))}
            {participantes > 0 && (
              <div style={{ marginTop: 8, borderTop: '1px solid rgba(245,196,0,0.08)', paddingTop: 8 }}>
                <div style={{ fontSize: 9, color: LED.dim, letterSpacing: '0.1em', marginBottom: 2 }}>PARTICIPANTES</div>
                <div style={statValStyle}>{participantes}</div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(245,196,0,0.08)' }}>
          {[
            { val: `${posicao}°`, lbl: 'POSIÇÃO SÉRIE B' },
            { val: `${golsSofridos}`, lbl: 'GOLS SOFRIDOS' },
            { val: mediaSofaTime.toFixed(2), lbl: 'MÉDIA SOFASCORE' },
            { val: mvp.media.toFixed(2), lbl: `${mvp.nome.toUpperCase()} · MVP` },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 6, padding: '8px 4px' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 18, fontWeight: 900, fontStyle: 'italic', color: LED.gold, textShadow: '0 0 8px rgba(245,196,0,0.5)', lineHeight: 1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.22)', marginTop: 3 }}>
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%,100%{box-shadow:0 0 20px rgba(245,196,0,0.4),0 0 40px rgba(245,196,0,0.2)}
          50%{box-shadow:0 0 30px rgba(245,196,0,0.7),0 0 60px rgba(245,196,0,0.35)}
        }
      `}</style>
    </div>
  );
}
