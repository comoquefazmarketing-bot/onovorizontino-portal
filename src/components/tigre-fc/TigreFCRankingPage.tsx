'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from './TigreFCPerfilPublico';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

const NIVEL_CORES: Record<string, string> = {
  Lenda:     '#F5C400',
  Elite:     '#a78bfa',
  Pro:       '#60a5fa',
  Amador:    '#4ade80',
  Novato:    '#9ca3af',
};

type Usuario = {
  id: string;
  apelido: string | null;
  nome: string;
  avatar_url: string | null;
  nivel: string | null;
  pontos_total: number;
};

const MEDALHAS = ['🥇', '🥈', '🥉'];

export default function TigreFCRankingPage() {
  const [ranking, setRanking] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [{ data: rankData }, { data: { session } }] = await Promise.all([
        supabase
          .from('tigre_fc_usuarios')
          .select('id, apelido, nome, avatar_url, nivel, pontos_total')
          .order('pontos_total', { ascending: false })
          .limit(50),
        supabase.auth.getSession(),
      ]);

      setRanking(rankData || []);

      if (session?.user) {
        const { data: u } = await supabase
          .from('tigre_fc_usuarios')
          .select('id')
          .eq('google_id', session.user.id)
          .single();
        if (u) setMeuId(u.id);
      }

      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <main style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-pulse" style={{ color: '#F5C400', fontSize: 14, fontWeight: 900, letterSpacing: 2 }}>
        CARREGANDO RANKING...
      </div>
    </main>
  );

  const minhaPosicao = meuId ? ranking.findIndex(u => u.id === meuId) : -1;

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'system-ui', paddingBottom: 100 }}>

      {/* Header */}
      <div style={{ background: '#F5C400', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
        <Link href="/tigre-fc" style={{ color: '#111', textDecoration: 'none', fontWeight: 900, fontSize: 22 }}>✕</Link>
        <img src={LOGO} style={{ width: 24, objectFit: 'contain' }} alt="" />
        <div style={{ fontWeight: 900, fontSize: 14, color: '#111', textTransform: 'uppercase', letterSpacing: 1 }}>
          Ranking Geral
        </div>
        {minhaPosicao >= 0 && (
          <div style={{ marginLeft: 'auto', background: '#111', color: '#F5C400', borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 900 }}>
            #{minhaPosicao + 1} VOCÊ
          </div>
        )}
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>

        {/* Top 3 destaque */}
        {ranking.length >= 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr 1fr', gap: 8, marginBottom: 24, alignItems: 'flex-end' }}>
            {/* 2º lugar */}
            <PodioCard u={ranking[1]} pos={2} isMe={ranking[1].id === meuId} onClick={() => setPerfilAberto(ranking[1].id)} />
            {/* 1º lugar */}
            <PodioCard u={ranking[0]} pos={1} isMe={ranking[0].id === meuId} onClick={() => setPerfilAberto(ranking[0].id)} />
            {/* 3º lugar */}
            <PodioCard u={ranking[2]} pos={3} isMe={ranking[2].id === meuId} onClick={() => setPerfilAberto(ranking[2].id)} />
          </div>
        )}

        {/* Lista completa a partir do 4º */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {ranking.slice(3).map((u, i) => {
            const pos = i + 4;
            const isMe = u.id === meuId;
            const cor = NIVEL_CORES[u.nivel || ''] || '#555';
            return (
              <button
                key={u.id}
                onClick={() => setPerfilAberto(u.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  background: isMe ? '#1a1200' : '#111',
                  border: `1px solid ${isMe ? '#F5C40040' : '#1a1a1a'}`,
                  borderRadius: 14, cursor: 'pointer', textAlign: 'left', width: '100%',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ width: 28, textAlign: 'center', fontSize: 13, fontWeight: 900, color: '#444', flexShrink: 0 }}>
                  #{pos}
                </div>
                <Avatar url={u.avatar_url} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 900, color: isMe ? '#F5C400' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {u.apelido || u.nome}
                    {isMe && <span style={{ fontSize: 9, color: '#F5C400', marginLeft: 6, fontWeight: 700 }}>VOCÊ</span>}
                  </div>
                  {u.nivel && (
                    <div style={{ fontSize: 9, color: cor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>
                      {u.nivel}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#F5C400' }}>{u.pontos_total}</div>
                  <div style={{ fontSize: 8, color: '#444', fontWeight: 700, textTransform: 'uppercase' }}>PTS</div>
                </div>
              </button>
            );
          })}
        </div>

        {ranking.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#444' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🏆</div>
            <div style={{ fontWeight: 900, fontSize: 14, textTransform: 'uppercase' }}>Nenhum jogador ainda</div>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <Link href="/tigre-fc" style={{ color: '#444', fontSize: 11, fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: 1 }}>
            ← Voltar para a Arena
          </Link>
        </div>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </main>
  );
}

function Avatar({ url, size }: { url: string | null; size: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: '#1a1a1a', flexShrink: 0, overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {url
        ? <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        : <span style={{ fontSize: size * 0.45 }}>🐯</span>
      }
    </div>
  );
}

function PodioCard({ u, pos, isMe, onClick }: { u: Usuario; pos: number; isMe: boolean; onClick: () => void }) {
  const heights = { 1: 120, 2: 90, 3: 75 };
  const h = heights[pos as keyof typeof heights];
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px' }}>
      <div style={{ fontSize: pos === 1 ? 24 : 20 }}>{MEDALHAS[pos - 1]}</div>
      <Avatar url={u.avatar_url} size={pos === 1 ? 56 : 44} />
      <div style={{ fontSize: pos === 1 ? 12 : 10, fontWeight: 900, color: isMe ? '#F5C400' : '#fff', textAlign: 'center', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {u.apelido || u.nome}
      </div>
      <div style={{ fontSize: pos === 1 ? 16 : 13, fontWeight: 900, color: '#F5C400' }}>{u.pontos_total}</div>
      <div style={{
        width: '100%', height: h,
        background: pos === 1 ? 'linear-gradient(180deg, #F5C400 0%, #a16207 100%)' : pos === 2 ? '#2a2a2a' : '#1a1a1a',
        borderRadius: '8px 8px 0 0',
        border: `1px solid ${pos === 1 ? '#F5C40060' : '#333'}`,
      }} />
    </button>
  );
}
