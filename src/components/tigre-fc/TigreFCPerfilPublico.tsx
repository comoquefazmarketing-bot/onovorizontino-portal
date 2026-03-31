'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const NIVEL_ICON: Record<string,string> = { Novato:'🌱', Fiel:'⚡', Garra:'🔥', Lenda:'🐯' };
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

    supabase.from('tigre_fc_resultados').select('jogo_id')
      .eq('processado', true)
      .order('criado_em', { ascending: false })
      .limit(1).single()
      .then(({ data }) => { if (data) setJogoId(data.jogo_id); });
  }, []);

  useEffect(() => {
    setLoading(true);
    if (tab === 'temporada') {
      supabase.rpc('ranking_temporada_tigre_fc', { p_limit: 50 })
        .then(({ data }) => { setRanking(data || []); setLoading(false); });
    } else if (jogoId) {
      supabase.rpc('ranking_rodada_tigre_fc', { p_jogo_id: jogoId })
        .then(({ data }) => {
          setRanking((data || []).map((r: any) => ({
            posicao: r.posicao, id: r.usuario_id,
            apelido: r.apelido || r.nome,
            avatar_url: r.avatar_url, nivel: r.nivel,
            pontos_total: r.pts_total, streak: 0, total_badges: 0,
          })));
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [tab, jogoId]);

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui', paddingBottom:60 }}>

      <div style={{ background:'#F5C400', padding:'16px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <a href="/tigre-fc" style={{ color:'#1a1a1a', textDecoration:'none', fontWeight:900, fontSize:20 }}>←</a>
        <img src={LOGO} style={{ width:32, objectFit:'contain' }} alt="Logo" />
        <div style={{ fontWeight:900, fontSize:18, color:'#1a1a1a', letterSpacing:-0.5 }}>RANKING</div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'20px 16px' }}>

        <div style={{ display:'flex', background:'#111', borderRadius:8, padding:4, marginBottom:20 }}>
          {(['temporada', 'rodada'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'10px', fontSize:12, fontWeight:900, textTransform:'uppercase', letterSpacing:1, border:'none', borderRadius:6, cursor:'pointer', background: tab===t?'#F5C400':'transparent', color: tab===t?'#111':'#555' }}>
              {t === 'temporada' ? '🏆 Temporada' : '⚡ Última Rodada'}
            </button>
          ))}
        </div>

        {!loading && ranking.length >= 3 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:20 }}>
            {[ranking[1], ranking[0], ranking[2]].map((u, i) => {
              if (!u) return <div key={i} />;
              const isCenter = i === 1;
              const medalIdx = isCenter ? 0 : i === 0 ? 1 : 2;
              return (
                <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                  style={{ background: isCenter?'linear-gradient(135deg,#1a1200,#111)':'#0e0e0e', border: isCenter?'1px solid #F5C400':'1px solid #1a1a1a', borderRadius:12, padding:'16px 8px', textAlign:'center', position:'relative', transform: isCenter?'scale(1.05)':'none', cursor:'pointer' }}>
                  {isCenter && <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'#F5C400', borderRadius:'12px 12px 0 0' }} />}
                  <div style={{ fontSize:isCenter?28:22, marginBottom:6 }}>{MEDAL[medalIdx]}</div>
                  {u.avatar_url ? (
                    <img src={u.avatar_url} style={{ width:isCenter?48:40, height:isCenter?48:40, borderRadius:'50%', objectFit:'cover', border:`2px solid ${isCenter?'#F5C400':'#333'}`, margin:'0 auto 8px', display:'block' }} />
                  ) : (
                    <div style={{ width:isCenter?48:40, height:isCenter?48:40, borderRadius:'50%', background:'#F5C400', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px', fontSize:isCenter?18:15, fontWeight:900, color:'#111' }}>
                      {(u.apelido||'?').charAt(0)}
                    </div>
                  )}
                  <div style={{ fontSize:10, fontWeight:900, color: isCenter?'#F5C400':'#fff', textTransform:'uppercase', letterSpacing:0.5, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', padding:'0 4px' }}>{u.apelido}</div>
                  <div style={{ fontSize:14, fontWeight:900, color:'#F5C400' }}>{u.pontos_total}</div>
                  <div style={{ fontSize:9, color:'#555' }}>pts</div>
                </div>
              );
            })}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign:'center', padding:40, color:'#555' }}>Carregando ranking...</div>
        ) : ranking.length === 0 ? (
          <div style={{ textAlign:'center', padding:40 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🐯</div>
            <div style={{ fontSize:14, color:'#555', fontWeight:700 }}>Nenhuma pontuação ainda</div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:1, background:'#111' }}>
            {ranking.slice(3).map((u) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#080808', cursor:'pointer' }}>
                <div style={{ width:32, textAlign:'center', fontSize:13, fontWeight:900, color:'#333' }}>{u.posicao}º</div>
                {u.avatar_url ? (
                  <img src={u.avatar_url} style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', border:'1px solid #1a1a1a' }} />
                ) : (
                  <div style={{ width:36, height:36, borderRadius:'50%', background:'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color:'#F5C400' }}>
                    {(u.apelido||'?').charAt(0)}
                  </div>
                )}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>
                    {NIVEL_ICON[u.nivel]} {u.apelido}
                  </div>
                  <div style={{ fontSize:10, color:'#555', marginTop:1 }}>
                    {u.nivel}{u.streak > 1 ? ` · 🔥 ${u.streak} em sequência` : ''}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:20, fontWeight:900, color:'#F5C400' }}>{u.pontos_total}</div>
                  <div style={{ fontSize:9, color:'#555', textTransform:'uppercase' }}>pts</div>
                </div>
                <div style={{ fontSize:14, color:'#333' }}>›</div>
              </div>
            ))}
          </div>
        )}

        <a href="/tigre-fc" style={{ display:'block', marginTop:24, textAlign:'center', color:'#F5C400', fontSize:13, fontWeight:900, textTransform:'uppercase', letterSpacing:1, textDecoration:'none' }}>
          → Jogar agora
        </a>
      </div>

      {/* MODAL AJUSTADO PARA O BUILD */}
      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUserId={perfilAberto}
          jogoId={jogoId || 0}
          meuId={meuId || ''} 
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </main>
  );
}
