'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const C = {
  gold:      '#F5C400', 
  cyan:      '#00F3FF',
  red:       '#FF2D55', 
  green:     '#22C55E',
  purple:    '#BF5FFF',
};

// ── INTERFACE ATUALIZADA (CORRIGE O ERRO DE BUILD) ──────────
interface Stats { 
  capitao?: { nome: string; pts: number }; 
  heroi?: { nome: string; pts: number }; 
  ranking?: Array<{ apelido?: string; nome?: string; pontos: number }>;
  posicao?: number; 
  golsSofridos?: number; 
  mediaSofa?: number;      // Adicionado para o build
  mediaSofaTime?: number; 
  mvp?: { nome: string; media: number }; 
  participantes?: number;  // Adicionado para o build
  topPontuador?: { nome: string; pts: number };
}

interface Jogo { 
  id: number; 
  competicao: string; 
  rodada: string; 
  data_hora: string; 
  mandante: { nome: string; escudo_url: string | null; sigla?: string | null };
  visitante: { nome: string; escudo_url: string | null; sigla?: string | null };
}

function CountdownGigante({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h: '00', m: '00', s: '00' });
  useEffect(() => {
    const calc = () => {
      const diff = new Date(dataHora).getTime() - Date.now();
      if (diff <= 0) return { h: '00', m: '00', s: '00' };
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      return { h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0') };
    };
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [dataHora]);
  
  return (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ fontSize: 10, fontWeight: 900, color: C.gold, letterSpacing: '4px', opacity: 0.8 }}>FECHAMENTO EM</div>
      <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', fontStyle: 'italic', lineHeight: 1, fontVariantNumeric: 'tabular-nums', textShadow: '0 0 30px rgba(245,196,0,0.2)' }}>
        {t.h}<span style={{ color: C.gold }}>:</span>{t.m}<span style={{ color: C.gold }}>:</span>{t.s}
      </div>
    </div>
  );
}

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: { jogo: Jogo; stats?: Stats; mercadoFechado?: boolean }) {
  const [gols, setGols] = useState(0);

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif", background: '#000', borderRadius: 24, 
      border: `1px solid rgba(245,196,0,0.2)`, position: 'relative', overflow: 'hidden', padding: '25px 15px'
    }}>
      <style>{`
        @keyframes scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes pulse-gold { 0%, 100% { transform: scale(1); box-shadow: 0 0 15px rgba(245,196,0,0.3); } 50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(245,196,0,0.6); } }
      `}</style>
      
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10, background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`, animation: 'scan 3s linear infinite' }} />

      {!mercadoFechado && <CountdownGigante dataHora={jogo.data_hora} />}

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.6fr 1.2fr', gap: 12, alignItems: 'center' }}>
        
        {/* LADO ESQUERDO: CAPITÃO E HERÓI */}
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 10px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 8, color: C.gold, fontWeight: 900 }}>CAPITÃO (ÚLT. RD)</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{stats.capitao?.pts?.toFixed(1) || '0.0'}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden' }}>{stats.capitao?.nome || '---'}</div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: C.cyan, fontWeight: 900 }}>HERÓI (ÚLT. RD)</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{stats.heroi?.pts?.toFixed(1) || '0.0'}</div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden' }}>{stats.heroi?.nome || '---'}</div>
          </div>
        </div>

        {/* CENTRO: PLACAR */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 15, marginBottom: 12 }}>
            <img src={jogo.mandante.escudo_url || ''} alt="" style={{ width: 50 }} />
            <div style={{ fontSize: 36, fontWeight: 900, color: '#fff', fontStyle: 'italic' }}>{gols} — 0</div>
            <img src={jogo.visitante.escudo_url || ''} alt="" style={{ width: 50 }} />
          </div>
          <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ 
            display: 'block', background: C.gold, color: '#000', fontSize: 11, fontWeight: 900, 
            padding: '12px', borderRadius: 8, textDecoration: 'none', animation: 'pulse-gold 2s infinite', textAlign: 'center'
          }}>
            CONVOCAR TITULARES →
          </Link>
        </div>

        {/* DIREITA: RANKING (NOMES INTEIROS) */}
        <div style={{ background: 'rgba(191,95,255,0.05)', padding: '12px 10px', borderRadius: 12, border: '1px solid rgba(191,95,255,0.1)' }}>
          <div style={{ fontSize: 8, color: C.purple, fontWeight: 900, marginBottom: 8, borderBottom: '1px solid rgba(191,95,255,0.1)' }}>TOP RANKING</div>
          {stats.ranking?.slice(0, 4).map((r, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 6 }}>
              <span style={{ color: '#fff', fontWeight: 700, whiteSpace: 'nowrap' }}>{r.apelido || r.nome}</span>
              <span style={{ color: C.purple, fontWeight: 900 }}>{r.pontos}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {[
          { val: `${stats.posicao || '-'}º`, lbl: 'SÉRIE B', col: C.gold },
          { val: stats.golsSofridos || 0, lbl: 'GOLS SOF', col: C.red },
          { val: (stats.mediaSofaTime || stats.mediaSofa)?.toFixed(2) || '0.00', lbl: 'MÉDIA TIME', col: C.gold },
          { val: stats.mvp?.media?.toFixed(2) || '0.00', lbl: 'MVP', col: C.cyan },
        ].map((item, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.02)', padding: '8px 2px', borderRadius: 8 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: item.col }}>{item.val}</div>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{item.lbl}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
