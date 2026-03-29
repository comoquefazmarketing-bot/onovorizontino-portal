'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

const BADGE_INFO: Record<string,{emoji:string;label:string}> = {
  craque_rodada:  { emoji:'🏆', label:'Craque da Rodada' },
  cravou_placar:  { emoji:'🎯', label:'Cravou o Placar' },
  podio_top3:     { emoji:'👑', label:'Pódio Top 3' },
  heroi_certeiro: { emoji:'⭐', label:'Herói Certeiro' },
};

export default function TigreFCResultado({ jogoId }: { jogoId: number }) {
  const [loading, setLoading] = useState(true);
  const [pontuacao, setPontuacao] = useState<any>(null);
  const [resultado, setResultado] = useState<any>(null);
  const [jogo, setJogo] = useState<any>(null);
  const [palpite, setPalpite] = useState<any>(null);
  const [badgesGanhos, setBadgesGanhos] = useState<any[]>([]);
  const [rankingRodada, setRankingRodada] = useState<any[]>([]);
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [posicao, setPosicao] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setLoading(false); return; }

      const { data: u } = await supabase
        .from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
      if (!u) { setLoading(false); return; }
      setUsuarioId(u.id);

      // Busca pontuação do usuário nessa rodada
      const { data: pts } = await supabase
        .from('tigre_fc_pontuacoes').select('*')
        .eq('usuario_id', u.id).eq('jogo_id', jogoId).single();
      setPontuacao(pts);

      // Resultado real
      const { data: res } = await supabase
        .from('tigre_fc_resultados').select('*').eq('jogo_id', jogoId).single();
      setResultado(res);

      // Jogo
      const { data: jogoData } = await supabase
        .from('jogos').select('*').eq('id', jogoId).single();
      if (jogoData) {
        const { data: times } = await supabase
          .from('times_serie_b').select('slug,nome,escudo_url')
          .in('slug', [jogoData.mandante_slug, jogoData.visitante_slug]);
        const timesMap = Object.fromEntries((times||[]).map((t:any) => [t.slug, t]));
        setJogo({ ...jogoData, mandante: timesMap[jogoData.mandante_slug], visitante: timesMap[jogoData.visitante_slug] });
      }

      // Palpite do usuário
      const { data: pal } = await supabase
        .from('tigre_fc_palpites').select('*')
        .eq('usuario_id', u.id).eq('jogo_id', jogoId).single();
      setPalpite(pal);

      // Badges ganhos nessa rodada
      const { data: bdg } = await supabase
        .from('tigre_fc_badges').select('tipo,ganho_em')
        .eq('usuario_id', u.id).eq('jogo_id', jogoId);
      setBadgesGanhos(bdg || []);

      // Ranking da rodada
      const { data: rank } = await supabase
        .rpc('ranking_rodada_tigre_fc', { p_jogo_id: jogoId });
      if (rank) {
        setRankingRodada(rank.slice(0, 10));
        const pos = rank.findIndex((r: any) => r.usuario_id === u.id);
        setPosicao(pos >= 0 ? pos + 1 : null);
      }

      setLoading(false);
    });
  }, [jogoId]);

  if (loading) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#555', fontSize:13 }}>Carregando resultado...</div>
    </main>
  );

  if (!resultado) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <div style={{ fontSize:40, marginBottom:16 }}>⏳</div>
      <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:8 }}>Jogo ainda não processado</div>
      <p style={{ fontSize:13, color:'#555' }}>Os pontos serão calculados após o fim da partida.</p>
      <Link href="/tigre-fc" style={{ marginTop:24, color:'#F5C400', fontWeight:900, fontSize:13, textDecoration:'none', textTransform:'uppercase' }}>← Voltar</Link>
    </main>
  );

  const acertouPlacar = pontuacao?.acertou_placar_exato;
  const acertouResultado = pontuacao?.acertou_resultado;
  const acertouHeroi = pontuacao?.acertou_heroi;

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:'#F5C400', padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <Link href="/tigre-fc" style={{ color:'#1a1a1a', textDecoration:'none', fontWeight:900, fontSize:20 }}>←</Link>
        <img src={LOGO} style={{ width:28, objectFit:'contain' }} />
        <div style={{ fontWeight:900, fontSize:16, color:'#1a1a1a' }}>RESULTADO DA RODADA</div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'20px 16px' }}>

        {/* Placar real */}
        {jogo && resultado && (
          <div style={{ background:'linear-gradient(135deg,#111,#1a1200)', border:'1px solid #F5C40030', borderRadius:16, padding:24, marginBottom:16, textAlign:'center' }}>
            <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:3, marginBottom:16 }}>{jogo.competicao}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-around' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <img src={jogo.mandante?.escudo_url} style={{ width:56, height:56, objectFit:'contain' }} />
                <span style={{ fontSize:11, color:'#aaa', fontWeight:900, textTransform:'uppercase' }}>{jogo.mandante?.nome}</span>
              </div>
              <div>
                <div style={{ fontSize:52, fontWeight:900, color:'#fff', letterSpacing:4, lineHeight:1 }}>
                  {resultado.gols_mandante} <span style={{ color:'#F5C400' }}>–</span> {resultado.gols_visitante}
                </div>
                <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:2, textAlign:'center', marginTop:4 }}>Resultado final</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <img src={jogo.visitante?.escudo_url} style={{ width:56, height:56, objectFit:'contain' }} />
                <span style={{ fontSize:11, color:'#F5C400', fontWeight:900, textTransform:'uppercase' }}>{jogo.visitante?.nome}</span>
              </div>
            </div>
          </div>
        )}

        {/* Sua pontuação */}
        {pontuacao && (
          <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:16, padding:20, marginBottom:16 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, fontWeight:900 }}>Sua pontuação</div>
              {posicao && <div style={{ fontSize:12, color:'#555', fontWeight:700 }}>#{posicao}º na rodada</div>}
            </div>

            <div style={{ fontSize:52, fontWeight:900, color:'#F5C400', textAlign:'center', lineHeight:1, marginBottom:8 }}>
              {pontuacao.pts_total}
            </div>
            <div style={{ fontSize:11, color:'#555', textAlign:'center', textTransform:'uppercase', letterSpacing:2, marginBottom:20 }}>pontos</div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              <div style={{ background:'#0a0a0a', borderRadius:8, padding:12, textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:900, color:'#4ade80' }}>{pontuacao.pts_jogadores}</div>
                <div style={{ fontSize:9, color:'#555', textTransform:'uppercase', marginTop:2 }}>Escalação</div>
              </div>
              <div style={{ background:'#0a0a0a', borderRadius:8, padding:12, textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:900, color: acertouPlacar?'#4ade80':acertouResultado?'#60a5fa':'#f87171' }}>{pontuacao.pts_palpite}</div>
                <div style={{ fontSize:9, color:'#555', textTransform:'uppercase', marginTop:2 }}>Palpite</div>
              </div>
              <div style={{ background:'#0a0a0a', borderRadius:8, padding:12, textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:900, color: acertouHeroi?'#4ade80':'#555' }}>{pontuacao.pts_heroi}</div>
                <div style={{ fontSize:9, color:'#555', textTransform:'uppercase', marginTop:2 }}>Herói</div>
              </div>
            </div>

            {/* Palpite comparativo */}
            {palpite && resultado && (
              <div style={{ marginTop:16, padding:12, background:'#0a0a0a', borderRadius:8 }}>
                <div style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:1, marginBottom:8 }}>Seu palpite</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>{palpite.gols_mandante}</div>
                    <div style={{ fontSize:9, color:'#555' }}>Seu</div>
                  </div>
                  <div style={{ fontSize:12, color:'#555' }}>×</div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:28, fontWeight:900, color:'#fff' }}>{palpite.gols_visitante}</div>
                    <div style={{ fontSize:9, color:'#555' }}>Seu</div>
                  </div>
                  <div style={{ width:1, background:'#1a1a1a', height:40 }} />
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:28, fontWeight:900, color:'#F5C400' }}>{resultado.gols_mandante}</div>
                    <div style={{ fontSize:9, color:'#555' }}>Real</div>
                  </div>
                  <div style={{ fontSize:12, color:'#555' }}>×</div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:28, fontWeight:900, color:'#F5C400' }}>{resultado.gols_visitante}</div>
                    <div style={{ fontSize:9, color:'#555' }}>Real</div>
                  </div>
                </div>
                <div style={{ marginTop:10, textAlign:'center', fontSize:12, fontWeight:900, color: acertouPlacar?'#4ade80':acertouResultado?'#60a5fa':'#f87171' }}>
                  {acertouPlacar ? '🎯 Placar exato! +15 pts' : acertouResultado ? '✓ Resultado certo! +5 pts' : '✗ Não acertou o resultado'}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Badges ganhos nessa rodada */}
        {badgesGanhos.length > 0 && (
          <div style={{ background:'linear-gradient(135deg,#1a1200,#111)', border:'1px solid #F5C400', borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, fontWeight:900, marginBottom:12 }}>🏅 Badges conquistados nessa rodada!</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {badgesGanhos.map((b, i) => {
                const info = BADGE_INFO[b.tipo] || { emoji:'🏅', label: b.tipo };
                return (
                  <div key={i} style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(245,196,0,0.1)', border:'1px solid #F5C40050', padding:'6px 12px', borderRadius:20, fontSize:12, fontWeight:700, color:'#F5C400' }}>
                    {info.emoji} {info.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Ranking da rodada */}
        {rankingRodada.length > 0 && (
          <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, overflow:'hidden', marginBottom:16 }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid #1a1a1a', fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, fontWeight:900 }}>
              Ranking da rodada
            </div>
            {rankingRodada.map((r: any, i: number) => {
              const isMe = r.usuario_id === usuarioId;
              return (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #0a0a0a', background: isMe?'#1a1200':'transparent' }}>
                  <div style={{ width:28, textAlign:'center', fontSize: i<3?18:13, fontWeight:900, color: i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#444' }}>
                    {i===0?'🥇':i===1?'🥈':i===2?'🥉':`${i+1}º`}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color: isMe?'#F5C400':'#fff' }}>
                      {r.apelido || r.nome} {isMe && '(você)'}
                    </div>
                  </div>
                  <div style={{ fontSize:18, fontWeight:900, color:'#F5C400' }}>{r.pts_total}</div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display:'flex', gap:8 }}>
          <Link href="/tigre-fc" style={{ flex:1, display:'block', padding:'14px', background:'#F5C400', color:'#111', fontWeight:900, fontSize:13, textTransform:'uppercase', letterSpacing:1, textAlign:'center', borderRadius:12, textDecoration:'none' }}>
            Próxima rodada →
          </Link>
          <Link href="/tigre-fc/ranking" style={{ padding:'14px 16px', background:'#111', border:'1px solid #1a1a1a', color:'#fff', fontWeight:900, fontSize:13, textTransform:'uppercase', borderRadius:12, textDecoration:'none' }}>
            🏆
          </Link>
        </div>
      </div>
    </main>
  );
}
