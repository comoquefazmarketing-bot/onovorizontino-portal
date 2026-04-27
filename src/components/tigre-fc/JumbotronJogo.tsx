'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Zap, Trophy, Shield, Users, MapPin, Tv } from 'lucide-react';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

const C = {
  gold: '#F5C400',
  cyan: '#00F3FF', 
  avaiBlue: '#0057A8',
  red: '#FF2D55',
  purple: '#BF5FFF',
  glass: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.1)',
  shock: 'radial-gradient(circle, rgba(0,87,168,0.25) 0%, transparent 70%)'
};

interface Time {
  nome: string;
  escudo_url: string | null;
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

function Countdown({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h: '00', m: '00', s: '00', crit: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(dataHora).getTime() - Date.now();
      if (diff <= 0) { setT({ h: '00', m: '00', s: '00', crit: true }); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setT({ h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0'), crit: h < 24 });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dataHora]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 35 }}>
      {[ {v: t.h, l: 'HORAS'}, {v: t.m, l: 'MIN'}, {v: t.s, l: 'SEG'} ].map((item, i) => (
        <div key={i} style={{
          background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: 20,
          border: i === 2 && t.crit ? `2px solid ${C.red}` : `1px solid ${C.border}`,
          minWidth: 80, textAlign: 'center', backdropFilter: 'blur(20px)'
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, color: i === 2 && t.crit ? C.red : '#fff', lineHeight: 1 }}>{item.v}</div>
          <div style={{ fontSize: 9, fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginTop: 6, letterSpacing: '0.1em' }}>{item.l}</div>
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

  const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";
  const ranking = stats.ranking ?? [];
  const participantes = stats.participantes ?? 0;
  const capitao = stats.capitao ?? { nome: '---', pts: 0 };
  const heroi = stats.heroi ?? { nome: '---', pts: 0 };

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      maxWidth: 480, width: '100%', margin: '0 auto 20px auto',
      background: 'linear-gradient(180deg, #111 0%, #000 100%)',
      borderRadius: 44, border: `1px solid ${C.border}`, padding: '35px 25px',
      boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8)',
      position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', 
        width: 350, height: 350, background: C.shock, filter: 'blur(70px)', zIndex: 0 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, position: 'relative', zIndex: 1 }}>
        <div style={{ background: mercadoFechado ? 'rgba(255,45,85,0.1)' : 'rgba(0,243,255,0.08)', padding: '6px 14px', borderRadius: 100, border: `1px solid ${mercadoFechado ? C.red+'44' : C.cyan+'44'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: mercadoFechado ? C.red : C.cyan, boxShadow: `0 0 10px ${mercadoFechado ? C.red : C.cyan}` }} />
            <span style={{ fontSize: 10, fontWeight: 900, color: mercadoFechado ? C.red : C.cyan, letterSpacing: '0.12em' }}>
              {mercadoFechado ? 'MERCADO FECHADO' : 'LIVE BROADCAST'}
            </span>
          </div>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>{jogo.competicao?.toUpperCase()} • R{jogo.rodada}</span>
      </div>

      {!mercadoFechado && <Countdown dataHora={jogo.data_hora} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={URL_AVAI} style={{ width: 90, height: 90, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(0,87,168,0.5))' }} alt="Avaí" />
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginTop: 12, fontStyle: 'italic' }}>AVAÍ</div>
        </div>
        <div style={{ padding: '0 15px', textAlign: 'center' }}>
          <Zap size={38} color={C.gold} fill={C.gold} style={{ filter: 'drop-shadow(0 0 15px #F5C400)' }} />
          <div style={{ fontSize: 14, fontWeight: 900, color: C.gold, marginTop: 5 }}>VS</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.visitante?.escudo_url || ''} style={{ width: 90, height: 90, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(245,196,0,0.4))' }} alt="Novorizontino" />
          <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginTop: 12, fontStyle: 'italic' }}>NOVORIZONTINO</div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 30, opacity: 0.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#fff' }}>
          <MapPin size={14} /> {jogo.local?.split('—')[0]}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 800, color: '#fff' }}>
          <Tv size={14} /> {jogo.transmissao}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 30 }}>
        {[
          { label: 'CAPITÃO', data: capitao, color: C.gold, icon: <Trophy size={14} /> },
          { label: 'HERÓI', data: heroi, color: C.red, icon: <Shield size={14} /> }
        ].map((item, idx) => (
          <div key={idx} style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '20px 10px', borderRadius: 28, border: `1px solid ${item.color}15`, textAlign: 'center' }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: item.color, letterSpacing: '0.1em', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
              {item.icon} {item.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{item.data.nome.toUpperCase()}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#fff' }}>{Number(item.data.pts).toFixed(1)} <small style={{ fontSize: 12, opacity: 0.3 }}>PTS</small></div>
          </div>
        ))}
      </div>

      <Link href="/tigre-fc/escalar" style={{ textDecoration: 'none' }}>
        <div style={{
          background: mercadoFechado ? 'rgba(255,255,255,0.05)' : `linear-gradient(90deg, ${C.gold}, #FFE57E)`,
          padding: 24, borderRadius: 24, textAlign: 'center', color: mercadoFechado ? 'rgba(255,255,255,0.2)' : '#000', 
          fontSize: 17, fontWeight: 1000, boxShadow: mercadoFechado ? 'none' : `0 20px 40px ${C.gold}30`,
          cursor: mercadoFechado ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
        }}>
          {mercadoFechado ? 'MERCADO ENCERRADO' : <><Users size={22} /> CONVOCAR TITULARES →</>}
        </div>
      </Link>

      {ranking.length > 0 && (
        <div style={{ marginTop: 35, paddingTop: 25, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15 }}>
            <span style={{ fontSize: 12, fontWeight: 900, color: C.purple, letterSpacing: '0.1em' }}>TOP PLAYERS</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 800 }}>{participantes} JOGANDO</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ranking.slice(0, 3).map((r, i) => (
              <div key={i} onClick={() => setPerfilAberto(r.id)} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 18px', borderRadius: 16, background: C.glass, cursor: 'pointer',
                border: i === 0 ? `1px solid ${C.gold}30` : '1px solid transparent'
              }}>
                <span style={{ fontSize: 14, color: i === 0 ? C.gold : '#fff', fontWeight: 800 }}>{i + 1}º {r.apelido || r.nome}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>{r.pontos} <small style={{ fontSize: 10, opacity: 0.5 }}>PTS</small></span>
              </div>
            ))}
          </div>
        </div>
      )}

      {perfilAberto && <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId || undefined} onClose={() => setPerfilAberto(null)} />}
    </div>
  );
}
