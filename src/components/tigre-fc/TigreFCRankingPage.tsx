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
    async function init() {
      // 1. Busca sessão do usuário
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: u } = await supabase.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      }

      // 2. Busca o último jogo processado (essencial para a transparência)
      const { data: lastJogo } = await supabase.from('tigre_fc_resultados')
        .select('jogo_id').eq('processado', true)
        .order('criado_em', { ascending: false }).limit(1).single();
      
      if (lastJogo) setJogoId(lastJogo.jogo_id);
    }
    init();
  }, []);

  useEffect(() => {
    async function fetchRankingETransparencia() {
      // Só carrega se tivermos o jogoId ou se for temporada
      if (!jogoId && tab === 'rodada') return;
      setLoading(true);

      try {
        // 3. Busca o Ranking Base
        const { data: rankData, error: rankError } = tab === 'temporada' 
          ? await supabase.rpc('ranking_temporada_tigre_fc', { p_limit: 50 })
          : await supabase.rpc('ranking_rodada_tigre_fc', { p_jogo_id: jogoId });

        if (rankError) throw rankError;

        if (rankData && rankData.length > 0) {
          // Normaliza os IDs para garantir que a transparência funcione (alguns RPCs retornam 'id', outros 'usuario_id')
          const normalizedRank = rankData.map((r: any) => ({
            ...r,
            id: r.id || r.usuario_id // Garante que temos um .id consistente
          }));

          const userIds = normalizedRank.map((r: any) => r.id);

          // 4. Busca Escalações e Scouts simultaneamente para a Transparência
          // Usamos o jogoId do último jogo processado para dar contexto à transparência
          const [escRes, scoutRes] = await Promise.all([
            supabase.from('tigre_fc_escalacoes').select('usuario_id, capitao_id, lineup').eq('jogo_id', jogoId).in('usuario_id', userIds),
            supabase.from('tigre_fc_scouts_jogadores').select('jogador_id, pontos').eq('jogo_id', jogoId)
          ]);

          // Mapeia pontos dos jogadores (converte ID para número para comparar fácil)
          const ptsMap: Record<number, number> = {};
          scoutRes.data?.forEach(s => ptsMap[Number(s.jogador_id)] = s.pontos);

          // Processa quem é o Herói e Capitão de cada torcedor
          const infoMap: Record<string, any> = {};
          escRes.data?.forEach(esc => {
            // Extrai os IDs dos jogadores da lineup (que pode ser um JSON de IDs ou Objetos)
            const idsInLineup = Object.values(esc.lineup).map(v => 
              typeof v === 'object' && v !== null ? Number((v as any).id) : Number(v)
            ).filter(id => !isNaN(id));
            
            if (idsInLineup.length > 0) {
              let bestId = idsInLineup[0];
              idsInLineup.forEach(id => {
                if ((ptsMap[id] || 0) > (ptsMap[bestId] || 0)) bestId = id;
              });

              infoMap[esc.usuario_id] = {
                hasCapitao: !!esc.capitao_id,
                heroiNota: ptsMap[bestId] || 0
              };
            }
          });

          setDetalhesTransparencia(infoMap);
          setRanking(normalizedRank);
        } else {
          setRanking([]);
        }
      } catch (err) {
        console.error("Erro no Ranking:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRankingETransparencia();
  }, [tab, jogoId]);

  return (
    <main style={{ minHeight: '100vh', background: '#080808', color: '#fff', paddingBottom: 60, fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#F5C400', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <a href="/tigre-fc" style={{ color: '#1a1a1a', textDecoration: 'none', fontWeight: 900, fontSize: 20 }}>←</a>
        <img src={LOGO} style={{ width: 28, height: 'auto' }} alt="Tigre FC" />
        <div style={{ fontWeight: 900, fontSize: 16, color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: -0.5 }}>Ranking Transparência</div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#111', borderRadius: 12, padding: 4, marginBottom: 20, border: '1px solid #222' }}>
          {(['temporada', 'rodada'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: '12px', fontSize: 11, fontWeight: 900, border: 'none', borderRadius: 10, cursor: 'pointer', transition: '0.2s', background: tab === t ? '#F5C400' : 'transparent', color: tab === t ? '#111' : '#666' }}>
              {t === 'temporada' ? '🏆 TEMPORADA' : '⚡ RODADA'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#F5C400', fontWeight: 700, fontSize: 13 }}>
            SINCRONIZANDO SCOUTS...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranking.map((u) => {
              const trans = detalhesTransparencia[u.id];

              return (
                <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                  style={{ background: '#111', borderRadius: 16, padding: '14px', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #222', cursor: 'pointer', transition: '0.2s' }}>
                  
                  {/* Posição */}
                  <div style={{ width: 30, fontSize: 14, fontWeight: 900, color: u.posicao <= 3 ? '#F5C400' : '#444', textAlign: 'center' }}>
                    {u.posicao <= 3 ? MEDAL[u.posicao - 1] : `${u.posicao}º`}
                  </div>

                  {/* Avatar */}
                  <div style={{ position: 'relative' }}>
                    <img 
                      src={u.avatar_url || 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png'} 
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2px solid #222', background: '#000' }} 
                      alt={u.apelido}
                    />
                    <div style={{ position: 'absolute', bottom: -2, right: -2, fontSize: 12, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>
                      {NIVEL_ICON[u.nivel || 'Novato']}
                    </div>
                  </div>

                  {/* Info e Badges (Transparência) */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{u.apelido}</div>
                    
                    <div style={{ display: 'flex', gap: 5 }}>
                      {trans?.hasCapitao && (
                        <div style={{ background: '#000', color: '#F5C400', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 4, border: '1px solid #333', display: 'flex', alignItems: 'center' }}>
                          ©️ CAP
                        </div>
                      )}
                      {trans?.heroiNota > 0 && (
                        <div style={{ background: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(46, 204, 113, 0.3)', display: 'flex', alignItems: 'center' }}>
                          🌟 HERÓI: {trans.heroiNota.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pontuação */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#F5C400', lineHeight: 1 }}>{u.pontos_total || u.pts_total || 0}</div>
                    <div style={{ fontSize: 8, color: '#555', fontWeight: 800, marginTop: 4 }}>PONTOS</div>
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
