'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, Trophy, Shield, Users, MapPin, Tv } from 'lucide-react';

const C = {
  gold: '#F5C400',
  cyan: '#00F3FF', 
  red: '#FF2D55',
  purple: '#BF5FFF',
  glass: 'rgba(255, 255, 255, 0.03)',
  border: 'rgba(255, 255, 255, 0.1)',
  shock: 'radial-gradient(circle, rgba(0,87,168,0.20) 0%, transparent 70%)'
};

const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";

interface Time { nome: string; escudo_url: string | null; }
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
          minWidth: 70, textAlign: 'center', backdropFilter: 'blur(20px)'
        }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: i === 2 && t.crit ? C.red : '#fff', lineHeight: 1 }}>{item.v}</div>
          <div style={{ fontSize: 8, fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginTop: 4, letterSpacing: '0.1em' }}>{item.l}</div>
        </div>
      ))}
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: { jogo: Jogo, stats?: Stats, mercadoFechado?: boolean }) {
  const capitao = stats?.capitao || { nome: '---', pts: 0 };
  const heroi = stats?.heroi || { nome: '---', pts: 0 };

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      maxWidth: 480, width: '100%', margin: '0 auto',
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
          <img src={jogo.mandante.escudo_url || URL_AVAI} style={{ width: 80, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(0,143,255,0.3))' }} alt="Mandante" />
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 12, fontStyle: 'italic' }}>{jogo.mandante.nome.toUpperCase()}</div>
        </div>
        <div style={{ padding: '0 15px', textAlign: 'center' }}>
          <Zap size={32} color={C.gold} fill={C.gold} style={{ filter: 'drop-shadow(0 0 15px #F5C400)' }} />
          <div style={{ fontSize: 12, fontWeight: 900, color: C.gold, marginTop: 5 }}>VS</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.visitante.escudo_url || ''} style={{ width: 80, height: 80, objectFit: 'contain', filter: 'drop-shadow(0 0 20px rgba(245,196,0,0.3))' }} alt="Visitante" />
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 12, fontStyle: 'italic' }}>{jogo.visitante.nome.toUpperCase()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 30, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '18px 10px', borderRadius: 24, border: `1px solid ${C.gold}15`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: C.gold, letterSpacing: '0.1em', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Trophy size={12} /> CAPITÃO
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{capitao.nome.toUpperCase()}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{Number(capitao.pts).toFixed(1)} <small style={{ fontSize: 10, opacity: 0.3 }}>PTS</small></div>
        </div>

        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '18px 10px', borderRadius: 24, border: `1px solid ${C.red}15`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: C.red, letterSpacing: '0.1em', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Shield size={12} /> HERÓI
          </div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 2 }}>{heroi.nome.toUpperCase()}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{Number(heroi.pts).toFixed(1)} <small style={{ fontSize: 10, opacity: 0.3 }}>PTS</small></div>
        </div>
      </div>

      <Link href="/tigre-fc/escalar" style={{ textDecoration: 'none' }}>
        <div style={{
          background: `linear-gradient(90deg, ${C.gold}, #FFE57E)`,
          padding: 20, borderRadius: 20, textAlign: 'center', color: '#000', 
          fontSize: 16, fontWeight: 1000, boxShadow: `0 15px 30px ${C.gold}20`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
        }}>
          <Users size={20} /> CONVOCAR TITULARES →
        </div>
      </Link>
    </div>
  );
}
