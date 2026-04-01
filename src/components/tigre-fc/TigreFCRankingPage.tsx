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

export default function TigreFCRankingPage() {
  const [tab, setTab] = useState<'temporada' | 'rodada'>('rodada');
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jogoId, setJogoId] = useState<number | null>(null);
  const [detalhesTransparencia, setDetalhesTransparencia] = useState<Record<string, any>>({});
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Busca Identificação do Usuário e o Último Jogo Processado
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: u } = await supabase.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      }

      const { data: lastJogo } = await supabase.from('tigre_fc_resultados')
        .select('jogo_id').eq('processado', true)
        .order('criado_em', { ascending: false }).limit(1).single();
      
      if (lastJogo) setJogoId(lastJogo.jogo_id);
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchRankingETransparencia() {
      if (!jogoId && tab === 'rodada') return;
      setLoading(true);

      // 2. Busca o Ranking Base
      const { data: rankData } = tab === 'temporada' 
        ? await supabase.rpc('ranking_temporada_tigre_fc', { p_limit: 50 })
        : await supabase.rpc('ranking_rodada_tigre_fc', { p_jogo_id: jogoId });

      if (rankData && jogoId) {
        const userIds = rankData.map((r: any) => r.id || r.usuario_id);

        // 3. Busca Escalações e Scouts simultaneamente para a Transparência
        const [escRes, scoutRes] = await Promise.all([
          supabase.from('tigre_fc_escalacoes').select('usuario_id, capitao_id, lineup').eq('jogo_id', jogoId).in('usuario_id', userIds),
          supabase.from('tigre_fc_scouts_jogadores').select('jogador_id, pontos').eq('jogo_id', jogoId)
        ]);

        // Mapeia pontos dos jogadores
        const ptsMap: Record<number, number> = {};
        scoutRes.data?.forEach(s => ptsMap[s.jogador_id] = s.pontos);

        // Processa quem é o Herói e Capitão de cada torcedor
        const infoMap: Record<string, any> = {};
        escRes.data?.forEach(esc => {
          const idsInLineup = Object.values(esc.lineup).map(v => typeof v === 'object' ? (v as any).id : Number(v));
          
          // Acha o Herói (maior pontuador do time dele)
          let bestId = idsInLineup[0];
          idsInLineup.forEach(id => {
            if ((ptsMap[id] || 0) > (ptsMap[bestId] || 0)) bestId = id;
          });

          infoMap[esc.usuario_id] = {
            capitaoId: esc.capitao_id,
            heroiNota: ptsMap[bestId] || 0,
            heroiId: bestId
          };
        });

        setDetalhesTransparencia(infoMap);
      }
      setRanking(rankData || []);
      setLoading(false);
    }
    fetchRankingETransparencia();
  }, [tab, jogoId]);

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#fff', paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: '#F5C400', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="/tigre-fc" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 900, fontSize: 20 }}>←</a>
        <img src={LOGO} style={{ width: 32 }} alt="Tigre FC" />
        <div style={{ fontWeight: 900, fontSize: 18, color: '#1a1a1a' }}>RANKING DE TRANSPARÊNCIA</div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#111', borderRadius: 8, padding: 4, marginBottom: 20 }}>
          {['temporada', 'rodada'].map((t: any) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '10px', fontSize: 11, fontWeight: 900, border: 'none', borderRadius: 6, cursor: 'pointer', background: tab === t ? '#F5C400' : 'transparent', color: tab === t ? '#111' : '#555' }}>
              {t === 'temporada' ? '🏆 TEMPORADA' : '⚡ RODADA'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>Cruzando dados...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ranking.map((u) => {
              const uid = u.id || u.usuario_id;
              const trans = detalhesTransparencia[uid];

              return (
                <div key={uid} onClick={() => setPerfilAberto(uid)}
                  style={{ background: '#111', borderRadius: 16, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #222', cursor: 'pointer' }}>
                  
                  {/* Posição */}
                  <div style={{ width: 28, fontSize: 14, fontWeight: 900, color: u.posicao <= 3 ? '#F5C400' : '#444' }}>
                    {u.posicao <= 3 ? MEDAL[u.posicao - 1] : `${u.posicao}º`}
                  </div>

                  {/* Avatar */}
                  <div style={{ position: 'relative' }}>
                    <img src={u.avatar_url || 'https://via.placeholder.com/40'} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: '2px solid #222' }} />
                    <div style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 10 }}>{NIVEL_ICON[u.nivel || 'Novato']}</div>
                  </div>

                  {/* Nome e Badges de Transparência (Estilo SofaScore) */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{u.apelido}</div>
                    
                    {trans && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{ background: '#000', color: '#F5C400', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, border: '1px solid #333' }}>
                          ©️ CAPITÃO
                        </div>
                        <div style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#2ecc71', fontSize: 9, fontWeight: 800, padding: '2px 6px', borderRadius: 4, border: '1px solid #2ecc71' }}>
                          🌟 HERÓI: {trans.heroiNota.toFixed(1)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pontuação */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#F5C400' }}>{u.pontos_total || u.pts_total}</div>
                    <div style={{ fontSize: 8, color: '#555', fontWeight: 800 }}>PONTOS</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico targetUserId={perfilAberto} jogoId={jogoId} meuId={meuId} onClose={() => setPerfilAberto(null)} />
      )}
    </main>
  );
}
