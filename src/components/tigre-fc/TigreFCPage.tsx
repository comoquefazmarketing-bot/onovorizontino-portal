'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Jogo = {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string;
  mandante: { nome: string; escudo_url: string };
  visitante: { nome: string; escudo_url: string };
};

type Ranking = {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  nivel: string;
  pontos_total: number;
  streak: number;
};

function formatDataHora(iso: string) {
  const d = new Date(iso);
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  return {
    dia: `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`,
    hora: `${String(d.getHours()).padStart(2,'0')}h${String(d.getMinutes()).padStart(2,'0') === '00' ? '' : String(d.getMinutes()).padStart(2,'0')}`,
  };
}

const NIVEL_ICON: Record<string, string> = {
  Novato: '🌱', Fiel: '⚡', Garra: '🔥', Lenda: '🐯'
};

export default function TigreFCPage() {
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [loadingJogo, setLoadingJogo] = useState(true);
  const [loadingRanking, setLoadingRanking] = useState(true);
  const [tab, setTab] = useState<'rodada' | 'temporada'>('temporada');

  useEffect(() => {
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => { if (jogos?.[0]) setJogo(jogos[0]); })
      .finally(() => setLoadingJogo(false));
  }, []);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/tigre_fc_usuarios?select=id,nome,apelido,avatar_url,nivel,pontos_total,streak&order=pontos_total.desc&limit=10`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRanking(data); })
      .finally(() => setLoadingRanking(false));
  }, []);

  const dt = jogo ? formatDataHora(jogo.data_hora) : null;

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'system-ui, sans-serif', paddingBottom: 80 }}>

      {/* ── HERO ── */}
      <div style={{ background: '#F5C400', padding: '0' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
          <img src={LOGO} alt="Tigre FC" style={{ width: 64, height: 64, objectFit: 'contain' }} />
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#1a1a1a', letterSpacing: -1, lineHeight: 1 }}>TIGRE FC</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a', opacity: 0.6, letterSpacing: 3, textTransform: 'uppercase', marginTop: 2 }}>Fantasy League · Novorizontino</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>

        {/* ── PRÓXIMO JOGO ── */}
        <div style={{ marginTop: 20, background: 'linear-gradient(135deg,#111,#1a1200)', border: '1px solid #F5C40040', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #ffffff0a' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', letterSpacing: 3, textTransform: 'uppercase' }}>Próximo Jogo</span>
          </div>

          {loadingJogo ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#555', fontSize: 13 }}>Carregando...</div>
          ) : jogo ? (
            <div style={{ padding: '20px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {/* Mandante */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} style={{ width: 52, height: 52, objectFit: 'contain' }} />
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#ccc', textTransform: 'uppercase', textAlign: 'center' }}>{jogo.mandante.nome}</span>
                </div>
                {/* Centro */}
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: '#F5C400', letterSpacing: -1 }}>{dt?.hora}</span>
                  <span style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 2 }}>{dt?.dia}</span>
                  <span style={{ fontSize: 9, color: '#444', textTransform: 'uppercase', letterSpacing: 1 }}>{jogo.competicao}</span>
                </div>
                {/* Visitante */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} style={{ width: 52, height: 52, objectFit: 'contain' }} />
                  <span style={{ fontSize: 11, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', textAlign: 'center' }}>{jogo.visitante.nome}</span>
                </div>
              </div>
              <Link href={`/tigre-fc/escalar/${jogo.id}`}
                style={{ display: 'block', marginTop: 20, background: '#F5C400', color: '#1a1a1a', fontWeight: 900, fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', padding: '14px', borderRadius: 12, textDecoration: 'none' }}>
                🐯 Escalar e Cravar
              </Link>
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: 'center', color: '#555', fontSize: 13 }}>Nenhum jogo agendado</div>
          )}
        </div>

        {/* ── RANKING ── */}
        <div style={{ marginTop: 24, background: '#111', border: '1px solid #ffffff0f', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #ffffff0a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', letterSpacing: 3, textTransform: 'uppercase' }}>Ranking</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['rodada','temporada'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', background: tab === t ? '#F5C400' : 'transparent', color: tab === t ? '#1a1a1a' : '#555' }}>
                  {t === 'rodada' ? 'Rodada' : 'Temporada'}
                </button>
              ))}
            </div>
          </div>

          {loadingRanking ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#555', fontSize: 13 }}>Carregando ranking...</div>
          ) : ranking.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🐯</div>
              <div style={{ fontSize: 14, color: '#555', fontWeight: 700 }}>Nenhum torcedor ainda</div>
              <div style={{ fontSize: 12, color: '#333', marginTop: 4 }}>Seja o primeiro a escalar!</div>
            </div>
          ) : (
            <div>
              {ranking.map((user, i) => (
                <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #ffffff06' }}>
                  {/* Posição */}
                  <div style={{ width: 28, textAlign: 'center', fontSize: i < 3 ? 18 : 13, fontWeight: 900, color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#444' }}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}º`}
                  </div>
                  {/* Avatar */}
                  {user.avatar_url ? (
                    <img src={user.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F5C40020', border: '1px solid #F5C40040', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#F5C400' }}>
                      {(user.apelido || user.nome).charAt(0).toUpperCase()}
                    </div>
                  )}
                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>
                      {NIVEL_ICON[user.nivel]} {user.apelido || user.nome}
                    </div>
                    <div style={{ fontSize: 11, color: '#555', marginTop: 1 }}>
                      {user.nivel} {user.streak > 0 && `· 🔥 ${user.streak} seguidos`}
                    </div>
                  </div>
                  {/* Pontos */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#F5C400' }}>{user.pontos_total}</div>
                    <div style={{ fontSize: 10, color: '#555', textTransform: 'uppercase', letterSpacing: 1 }}>pts</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── NÍVEIS ── */}
        <div style={{ marginTop: 24, background: '#111', border: '1px solid #ffffff0f', borderRadius: 16, padding: '16px' }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: '#F5C400', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Níveis do Torcedor</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {[
              { icon: '🌱', nome: 'Novato', pts: '0–99' },
              { icon: '⚡', nome: 'Fiel', pts: '100–299' },
              { icon: '🔥', nome: 'Garra', pts: '300–599' },
              { icon: '🐯', nome: 'Lenda', pts: '600+' },
            ].map(n => (
              <div key={n.nome} style={{ textAlign: 'center', padding: '12px 4px', background: '#0a0a0a', borderRadius: 10, border: n.nome === 'Lenda' ? '1px solid #F5C400' : '1px solid #ffffff08' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{n.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: n.nome === 'Lenda' ? '#F5C400' : '#fff' }}>{n.nome}</div>
                <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>{n.pts} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ESCALAR ── */}
        {jogo && (
          <Link href={`/tigre-fc/escalar/${jogo.id}`}
            style={{ display: 'block', marginTop: 24, background: '#F5C400', color: '#1a1a1a', fontWeight: 900, fontSize: 16, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', padding: '18px', borderRadius: 14, textDecoration: 'none' }}>
            🐯 Montar minha escalação
          </Link>
        )}

      </div>
    </main>
  );
}
