'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Zap, Trophy, Shield, Users, MapPin, Tv } from 'lucide-react';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

const C = {
  gold: '#F5C400', cyan: '#00F3FF', red: '#FF2D55', purple: '#BF5FFF',
  glass: 'rgba(255, 255, 255, 0.03)', border: 'rgba(255, 255, 255, 0.1)',
  shock: 'radial-gradient(circle, rgba(0,87,168,0.25) 0%, transparent 70%)'
};

const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";

// Interface flexível para não quebrar o build
interface JogoProps {
  id: number;
  competicao: string;
  rodada: string | number;
  data_hora: string;
  local?: string | null;
  transmissao?: string | null;
  mandante: { nome: string; escudo_url: string | null };
  visitante: { nome: string; escudo_url: string | null };
}

interface StatsProps {
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

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: { jogo: JogoProps, stats?: StatsProps, mercadoFechado?: boolean }) {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const capitao = stats.capitao ?? { nome: '---', pts: 0 };
  const heroi = stats.heroi ?? { nome: '---', pts: 0 };

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif", maxWidth: 480, width: '100%', margin: '0 auto 20px auto',
      background: 'linear-gradient(180deg, #111 0%, #000 100%)', borderRadius: 44, border: `1px solid ${C.border}`, 
      padding: '35px 25px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: '15%', left: '50%', transform: 'translate(-50%, -50%)', 
        width: 350, height: 350, background: C.shock, filter: 'blur(70px)', zIndex: 0 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, position: 'relative', zIndex: 1 }}>
        <div style={{ background: mercadoFechado ? 'rgba(255,45,85,0.1)' : 'rgba(0,243,255,0.08)', padding: '6px 14px', borderRadius: 100, border: `1px solid ${mercadoFechado ? C.red+'44' : C.cyan+'44'}` }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: mercadoFechado ? C.red : C.cyan, letterSpacing: '0.12em' }}>
            {mercadoFechado ? 'MERCADO FECHADO' : 'LIVE BROADCAST'}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>{jogo.competicao?.toUpperCase()} • R{jogo.rodada}</span>
      </div>

      {!mercadoFechado && <Countdown dataHora={jogo.data_hora} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40, position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={URL_AVAI} style={{ width: 85, height: 85, objectFit: 'contain' }} alt="Avaí" />
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 10 }}>AVAÍ</div>
        </div>
        <Zap size={30} color={C.gold} fill={C.gold} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.visitante.escudo_url || ''} style={{ width: 85, height: 85, objectFit: 'contain' }} alt="Visitante" />
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff', marginTop: 10 }}>NOVORIZONTINO</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 30 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px 10px', borderRadius: 20, border: `1px solid ${C.gold}15`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: C.gold, marginBottom: 4 }}>CAPITÃO</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{capitao.nome.toUpperCase()}</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px 10px', borderRadius: 20, border: `1px solid ${C.red}15`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: C.red, marginBottom: 4 }}>HERÓI</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{heroi.nome.toUpperCase()}</div>
        </div>
      </div>

      <Link href="/tigre-fc/escalar">
        <div style={{ background: `linear-gradient(90deg, ${C.gold}, #FFE57E)`, padding: 20, borderRadius: 20, textAlign: 'center', color: '#000', fontSize: 16, fontWeight: 900 }}>
          CONVOCAR TITULARES →
        </div>
      </Link>
    </div>
  );
}
