'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';

const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red: '#FF2D55',
  purple: '#BF5FFF',
};

interface RankUser {
  apelido?: string | null;
  nome?: string | null;
  pontos: number;
}

// AJUSTE: Adicionada a assinatura de índice [key: string]: any
// Isso permite que você envie 'posicao', 'mvp', etc., sem erro de build
interface Stats {
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
  ranking?: RankUser[];
  participantes?: number;
  [key: string]: any; 
}

interface Props {
  jogo: any;
  stats?: Stats;
  mercadoFechado?: boolean;
}

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) setMeuId(session.user.id);
    });
  }, []);

  // Pegamos os dados das props. Se o Dantas é o capitão, ele deve vir no objeto 'stats' enviado pela page.tsx
  const capitao = stats.capitao || { nome: '---', pts: 0 };
  const heroi = stats.heroi || { nome: '---', pts: 0 };
  const ranking = stats.ranking || [];

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      maxWidth: 460, width: '95%', margin: '0 auto 20px auto',
      background: 'linear-gradient(180deg, #0f0f0f 0%, #000 100%)',
      borderRadius: 32, border: '1px solid #222', padding: '24px',
      boxShadow: '0 40px 100px rgba(0,0,0,0.8)', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, opacity: 0.4 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: mercadoFechado ? C.red : C.cyan }} />
          <span style={{ fontSize: 11, fontWeight: 900, color: mercadoFechado ? C.red : C.cyan, letterSpacing: '0.15em' }}>
            {mercadoFechado ? 'MERCADO FECHADO' : 'MERCADO ABERTO'}
          </span>
        </div>
        <span style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>
          RODADA {jogo.rodada} • {jogo.competicao?.toUpperCase()}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.mandante?.escudo_url || FALLBACK} style={{ width: 75, height: 75, objectFit: 'contain' }} alt="Mandante" />
          <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginTop: 10 }}>{jogo.mandante?.nome?.toUpperCase()}</div>
        </div>
        
        <div style={{ padding: '0 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'rgba(255,255,255,0.1)', fontStyle: 'italic' }}>VS</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: C.gold, marginTop: 5 }}>
            {jogo.data_hora ? new Date(jogo.data_hora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '--/--'}
          </div>
        </div>

        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={jogo.visitante?.escudo_url || FALLBACK} style={{ width: 75, height: 75, objectFit: 'contain' }} alt="Visitante" />
          <div style={{ fontSize: 14, fontWeight: 900, color: C.gold, marginTop: 10 }}>{jogo.visitante?.nome?.toUpperCase()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 25 }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: 20, border: `1px solid ${C.gold}33`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: C.gold, marginBottom: 6 }}>CAPITÃO</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{capitao.nome.toUpperCase()}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{Number(capitao.pts).toFixed(1)}</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: 20, border: `1px solid ${C.red}33`, textAlign: 'center' }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: C.red, marginBottom: 6 }}>HERÓI</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>{heroi.nome.toUpperCase()}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>{Number(heroi.pts).toFixed(1)}</div>
        </div>
      </div>

      <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ textDecoration: 'none' }}>
        <div style={{ background: C.gold, padding: '20px', borderRadius: 20, textAlign: 'center', color: '#000', fontSize: 17, fontWeight: 900 }}>
          CONVOCAR TITULARES →
        </div>
      </Link>

      {perfilAberto && (
        <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId || undefined} onClose={() => setPerfilAberto(null)} />
      )}
    </div>
  );
}
