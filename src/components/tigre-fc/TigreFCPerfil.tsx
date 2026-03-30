'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// Importando o novo componente que o Claude sugeriu (Certifique-se de criar este arquivo)
// Se ainda não criou, o código abaixo mantém a lógica integrada mas organizada
import TigreFCPerfilXP from '@/components/tigre-fc/TigreFCPerfilXP';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

const BADGE_INFO: Record<string,{emoji:string;label:string;desc:string}> = {
  craque_rodada:  { emoji:'🏆', label:'Craque da Rodada',    desc:'Maior pontuação em uma rodada' },
  hat_trick:      { emoji:'🎩', label:'Hat-trick',            desc:'3 acertos seguidos de placar' },
  streak_3:       { emoji:'🔥', label:'Sequência de Fogo',   desc:'Escalou em 3 jogos seguidos' },
  cravou_placar:  { emoji:'🎯', label:'Cravou o Placar',     desc:'Acertou o placar exato' },
  tigre_do_vale:  { emoji:'🐯', label:'Tigre do Vale',        desc:'Atingiu o nível Lenda' },
  podio_top3:     { emoji:'👑', label:'Pódio Top 3',          desc:'Ficou entre os 3 melhores da rodada' },
  heroi_certeiro: { emoji:'⭐', label:'Herói Certeiro',       desc:'Acertou o herói da partida' },
  garra_total:    { emoji:'💪', label:'Garra Total',          desc:'Jogou todas as rodadas da temporada' },
};

type Usuario = {
  id: string; nome: string; apelido: string; avatar_url: string | null;
  nivel: string; pontos_total: number; streak: number; criado_em: string;
};
type Badge = { tipo: string; ganho_em: string; jogo_id: number };
type Pontuacao = {
  jogo_id: number; pts_total: number; pts_jogadores: number; pts_palpite: number;
  pts_heroi: number; acertou_placar_exato: boolean; acertou_resultado: boolean; criado_em: string;
};

export default function TigreFCPerfil() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [historico, setHistorico] = useState<Pontuacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'badges'|'historico'>('badges');
  const [posicao, setPosicao] = useState<number | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setLoading(false); return; }

      const { data: u } = await supabase
        .from('tigre_fc_usuarios').select('*')
        .eq('google_id', session.user.id).single();

      if (!u) { setLoading(false); return; }
      setUsuario(u);

      // Chamadas em paralelo para performance
      const [resBadges, resHistorico, resRank] = await Promise.all([
        supabase.from('tigre_fc_badges').select('*').eq('usuario_id', u.id).order('ganho_em', { ascending: false }),
        supabase.from('tigre_fc_pontuacoes').select('*').eq('usuario_id', u.id).order('criado_em', { ascending: false }).limit(20),
        supabase.from('tigre_fc_usuarios').select('id', { count: 'exact' }).gt('pontos_total', u.pontos_total)
      ]);

      setBadges(resBadges.data || []);
      setHistorico(resHistorico.data || []);
      setPosicao((resRank.count ?? 0) + 1);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div className="animate-pulse" style={{ color:'#F5C400', fontSize:14, fontWeight:900 }}>CARREGANDO PERFIL DO TIGRE...</div>
    </main>
  );

  if (!usuario) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <img src={LOGO} style={{ width:80, marginBottom:24 }} />
      <div style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:8 }}>VOCÊ AINDA NÃO ENTROU NO JOGO</div>
      <p style={{ fontSize:14, color:'#555', marginBottom:32, maxWidth:300 }}>Faça login para salvar sua escalação e subir no ranking!</p>
      <Link href="/tigre-fc" style={{ background:'#F5C400', color:'#111', fontWeight:900, fontSize:14, padding:'16px 32px', borderRadius:12, textDecoration:'none', textTransform:'uppercase', letterSpacing:1, boxShadow:'0 4px 15px rgba(245, 196, 0, 0.3)' }}>
        Entrar no Tigre FC
      </Link>
    </main>
  );

  const totalRodadas = historico.length;
  const mediaRodada = totalRodadas ? Math.round(historico.reduce((s,h) => s + h.pts_total, 0) / totalRodadas) : 0;
  const melhorRodada = historico.length ? Math.max(...historico.map(h => h.pts_total)) : 0;

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui', paddingBottom:100 }}>
      
      {/* Header com botão de voltar dinâmico */}
      <div style={{ background:'#F5C400', padding:'16px 20px', display:'flex', alignItems:'center', gap:12, position:'sticky', top:0, zIndex:10, boxShadow:'0 2px 10px rgba(0,0,0,0.5)' }}>
        <Link href="/tigre-fc" style={{ color:'#111', textDecoration:'none', fontWeight:900, fontSize:22 }}>✕</Link>
        <img src={LOGO} style={{ width:24, objectFit:'contain' }} />
        <div style={{ fontWeight:900, fontSize:14, color:'#111', textTransform:'uppercase', letterSpacing:1 }}>Meu Perfil</div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'20px 16px' }}>

        {/* COMPONENTE DE PERFIL E XP (GAMIFICADO) */}
        <TigreFCPerfilXP 
          nivel={usuario.nivel} 
          pontos={usuario.pontos_total} 
          apelido={usuario.apelido || usuario.nome} 
          avatarUrl={usuario.avatar_url} 
          posicao={posicao || 0} 
        />

        {/* Stats Rápidas */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:20 }}>
          {[
            ['Pontos', usuario.pontos_total],
            ['Rodadas', totalRodadas],
            ['Média', mediaRodada],
            ['Recorde', melhorRodada],
          ].map(([l,v]) => (
            <div key={l as string} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:'12px 4px', textAlign:'center' }}>
              <div style={{ fontSize:18, fontWeight:900, color: l === 'Recorde' ? '#F5C400' : '#fff' }}>{v}</div>
              <div style={{ fontSize:8, color:'#555', textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{l as string}</div>
            </div>
          ))}
        </div>

        {/* Streak / Sequência */}
        {usuario.streak > 0 && (
          <div style={{ background:'linear-gradient(90deg, #111, #1a1200)', border:'1px solid #F5C40030', borderRadius:16, padding:'16px', marginBottom:20, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ fontSize:32, filter: 'drop-shadow(0 0 8px #F5C400)' }}>🔥</div>
            <div>
              <div style={{ fontSize:15, fontWeight:900, color:'#fff' }}>{usuario.streak} jogos seguidos!</div>
              <div style={{ fontSize:11, color:'#F5C400', fontWeight:600 }}>Você está imparável na arquibancada digital.</div>
            </div>
          </div>
        )}

        {/* Abas de Conteúdo */}
        <div style={{ display:'flex', background:'#111', borderRadius:12, padding:6, marginBottom:20, border:'1px solid #1a1a1a' }}>
          {(['badges','historico'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'12px', fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:1, border:'none', borderRadius:8, cursor:'pointer', transition:'all 0.2s', background: tab===t?'#F5C400':'transparent', color: tab===t?'#111':'#555' }}>
              {t === 'badges' ? `🏆 Pins (${badges.length})` : '📜 Histórico'}
            </button>
          ))}
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div style={{ minHeight: 300 }}>
          {tab === 'badges' && (
            badges.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px', background:'#111', borderRadius:20, border:'1px dotted #333' }}>
                <div style={{ fontSize:40, marginBottom:16, opacity:0.3 }}>🏅</div>
                <div style={{ fontSize:14, color:'#fff', fontWeight:900, textTransform:'uppercase' }}>Nenhum Pin conquistado</div>
                <div style={{ fontSize:12, color:'#555', marginTop:8 }}>Escale seu time para desbloquear medalhas exclusivas do Tigre!</div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {badges.map((b, i) => {
                  const info = BADGE_INFO[b.tipo] || { emoji:'🏅', label: b.tipo, desc:'' };
                  return (
                    <div key={i} style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:16, padding:'20px 12px', textAlign:'center', position:'relative' }}>
                      <div style={{ fontSize:32, marginBottom:12 }}>{info.emoji}</div>
                      <div style={{ fontSize:11, fontWeight:900, color:'#fff', textTransform:'uppercase', marginBottom:4 }}>{info.label}</div>
                      <div style={{ fontSize:10, color:'#555', lineHeight:1.4, minHeight:28 }}>{info.desc}</div>
                      <div style={{ fontSize:8, color:'#333', marginTop:12, fontWeight:700 }}>
                        GANHO EM {new Date(b.ganho_em).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {tab === 'historico' && (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {historico.length === 0 ? (
                <div style={{ textAlign:'center', padding:'60px 20px' }}>
                  <div style={{ fontSize:14, color:'#555' }}>Nenhuma rodada registrada.</div>
                </div>
              ) : (
                historico.map((h, i) => (
                  <Link key={i} href={`/tigre-fc/resultado/${h.jogo_id}`}
                    style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px', background:'#111', borderRadius:16, border:'1px solid #1a1a1a', textDecoration:'none', transition:'transform 0.1s' }}>
                    <div>
                      <div style={{ fontSize:14, fontWeight:900, color:'#fff', marginBottom:4 }}>
                        Rodada {historico.length - i}
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {h.acertou_placar_exato && <span style={{ background:'#4ade8020', color:'#4ade80', fontSize:9, padding:'2px 6px', borderRadius:4, fontWeight:900 }}>🎯 CRAVOU</span>}
                        <span style={{ color:'#555', fontSize:10, fontWeight:600 }}>{new Date(h.criado_em).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:24, fontWeight:900, color:'#F5C400', lineHeight:1 }}>{h.pts_total}</div>
                      <div style={{ fontSize:9, color:'#555', fontWeight:700, textTransform:'uppercase' }}>PONTOS</div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        {/* Rodapé de navegação */}
        <div style={{ marginTop:40, textAlign:'center' }}>
          <Link href="/tigre-fc" style={{ color:'#555', fontSize:12, fontWeight:900, textDecoration:'none', textTransform:'uppercase', letterSpacing:1 }}>
            ← Voltar para a Arena
          </Link>
        </div>
      </div>
    </main>
  );
}
