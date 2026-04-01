'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const NIVEL_ICON: Record<string, string> = { Novato: '🌱', Fiel: '⚡', Garra: '🔥', Lenda: '🐯' };
const MEDAL = ['🥇', '🥈', '🥉'];

type RankUser = {
  posicao: number; id: string; apelido: string; avatar_url: string | null;
  nivel: string; pontos_total: number; streak: number; total_badges: number;
};

export default function TigreFCRankingPage() {
  const [tab, setTab] = useState<'temporada' | 'rodada'>('temporada');
  const [ranking, setRanking] = useState<RankUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [jogoId, setJogoId] = useState<number | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: u } = await supabase
        .from('tigre_fc_usuarios').select('id')
        .eq('google_id', session.user.id).single();
      if (u) setMeuId(u.id);
    });

    // Busca o último jogo para garantir que o Lobby sempre tenha dados de transparência
    supabase.from('tigre_fc_resultados').select('jogo_id')
      .eq('processado', true)
      .order('criado_em', { ascending: false })
      .limit(1).single()
      .then(({ data }) => { if (data) setJogoId(data.jogo_id); });
  }, []);

  useEffect(() => {
    async function fetchRanking() {
      setLoading(true);
      if (tab === 'temporada') {
        const { data } = await supabase.rpc('ranking_temporada_tigre_fc', { p_limit: 50 });
        setRanking(data || []);
      } else if (jogoId) {
        const { data } = await supabase.rpc('ranking_rodada_tigre_fc', { p_jogo_id: jogoId });
        setRanking((data || []).map((r: any) => ({
          posicao: r.posicao,
          id: r.usuario_id,
          apelido: r.apelido || r.nome || 'Torcedor',
          avatar_url: r.avatar_url,
          nivel: r.nivel || 'Novato',
          pontos_total: r.pts_total,
          streak: 0,
          total_badges: 0,
        })));
      }
      setLoading(false);
    }
    fetchRanking();
  }, [tab, jogoId]);

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: 'system-ui', paddingBottom: 60 }}>
      <div style={{ background: '#F5C400', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="/tigre-fc" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 900, fontSize: 20 }}>←</a>
        <img src={LOGO} style={{ width: 32, objectFit: 'contain' }} alt="Tigre FC Logo" />
        <div style={{ fontWeight: 900, fontSize: 18, color: '#1a1a1a', letterSpacing: -0.5 }}>RANKING</div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'flex', background: '#111', borderRadius: 8, padding: 4, marginBottom: 20 }}>
          {(['temporada', 'rodada'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '10px', fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, border: 'none', borderRadius: 6, cursor: 'pointer', background: tab === t ? '#F5C400' : 'transparent', color: tab === t ? '#111' : '#555' }}>
              {t === 'temporada' ? '🏆 Temporada' : '⚡ Última Rodada'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>Carregando ranking...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, background: '#111', borderRadius: 12, overflow: 'hidden' }}>
            {ranking.map((u) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#080808', borderBottom: '1px solid #111', cursor: 'pointer' }}>
                <div style={{ width: 28, fontSize: 13, fontWeight: 900, color: u.posicao <= 3 ? '#F5C400' : '#444' }}>
                  {u.posicao <= 3 ? MEDAL[u.posicao - 1] : `${u.posicao}º`}
                </div>
                {u.avatar_url ? (
                  <img src={u.avatar_url} alt={u.apelido} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #222' }} />
                ) : (
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#F5C400' }}>
                    {(u.apelido || '?').charAt(0)}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{u.apelido}</div>
                  <div style={{ fontSize: 10, color: '#555' }}>{NIVEL_ICON[u.nivel]} {u.nivel}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#F5C400' }}>{u.pontos_total}</div>
                  <div style={{ fontSize: 8, color: '#555', textTransform: 'uppercase' }}>pontos</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE PERFIL COM TRANSPARÊNCIA FORÇADA */}
      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUserId={perfilAberto}
          jogoId={jogoId} // Passamos o jogoId sempre (independente da tab) para mostrar as notas
          meuId={meuId}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </main>
  );
}
