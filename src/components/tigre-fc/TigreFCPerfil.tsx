'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

const NIVEL_ICON: Record<string,string> = { Novato:'🌱', Fiel:'⚡', Garra:'🔥', Lenda:'🐯' };
const NIVEL_NEXT: Record<string,{nome:string;pts:number}> = {
  Novato: { nome:'Fiel', pts:100 },
  Fiel:   { nome:'Garra', pts:300 },
  Garra:  { nome:'Lenda', pts:600 },
  Lenda:  { nome:'Lenda', pts:600 },
};

const BADGE_INFO: Record<string,{emoji:string;label:string;desc:string}> = {
  craque_rodada:  { emoji:'🏆', label:'Craque da Rodada',    desc:'Maior pontuação em uma rodada' },
  hat_trick:      { emoji:'🎩', label:'Hat-trick',           desc:'3 acertos seguidos de placar' },
  streak_3:       { emoji:'🔥', label:'Sequência de Fogo',   desc:'Escalou em 3 jogos seguidos' },
  cravou_placar:  { emoji:'🎯', label:'Cravou o Placar',     desc:'Acertou o placar exato' },
  tigre_do_vale:  { emoji:'🐯', label:'Tigre do Vale',       desc:'Atingiu o nível Lenda' },
  podio_top3:     { emoji:'👑', label:'Pódio Top 3',         desc:'Ficou entre os 3 melhores da rodada' },
  heroi_certeiro: { emoji:'⭐', label:'Herói Certeiro',      desc:'Acertou o herói da partida' },
  garra_total:    { emoji:'💪', label:'Garra Total',         desc:'Jogou todas as rodadas da temporada' },
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

      // Badges
      const { data: b } = await supabase
        .from('tigre_fc_badges').select('tipo,ganho_em,jogo_id')
        .eq('usuario_id', u.id).order('ganho_em', { ascending: false });
      setBadges(b || []);

      // Histórico de pontuações
      const { data: h } = await supabase
        .from('tigre_fc_pontuacoes').select('*')
        .eq('usuario_id', u.id).order('criado_em', { ascending: false }).limit(20);
      setHistorico(h || []);

      // Posição no ranking geral
      const { data: rank } = await supabase
        .from('tigre_fc_usuarios')
        .select('id', { count: 'exact' })
        .gt('pontos_total', u.pontos_total);
      setPosicao((rank?.length ?? 0) + 1);

      setLoading(false);
    });
  }, []);

  if (loading) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#555', fontSize:13 }}>Carregando perfil...</div>
    </main>
  );

  if (!usuario) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <img src={LOGO} style={{ width:64, marginBottom:16 }} />
      <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:8 }}>Você não está logado</div>
      <p style={{ fontSize:13, color:'#555', marginBottom:24 }}>Entre no Tigre FC para ver seu perfil</p>
      <Link href="/tigre-fc" style={{ background:'#F5C400', color:'#111', fontWeight:900, fontSize:14, padding:'14px 28px', borderRadius:12, textDecoration:'none', textTransform:'uppercase', letterSpacing:1 }}>
        Entrar no Tigre FC
      </Link>
    </main>
  );

  const nivel = usuario.nivel;
  const proximoNivel = NIVEL_NEXT[nivel];
  const progressoPct = nivel === 'Lenda' ? 100 :
    nivel === 'Garra' ? Math.min(100, ((usuario.pontos_total - 300) / 300) * 100) :
    nivel === 'Fiel'  ? Math.min(100, ((usuario.pontos_total - 100) / 200) * 100) :
    Math.min(100, (usuario.pontos_total / 100) * 100);

  const totalRodadas = historico.length;
  const mediaRodada = totalRodadas ? Math.round(historico.reduce((s,h) => s + h.pts_total, 0) / totalRodadas) : 0;
  const melhorRodada = historico.length ? Math.max(...historico.map(h => h.pts_total)) : 0;

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', fontFamily:'system-ui', paddingBottom:80 }}>

      {/* Header */}
      <div style={{ background:'#F5C400', padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <Link href="/tigre-fc" style={{ color:'#1a1a1a', textDecoration:'none', fontWeight:900, fontSize:20 }}>←</Link>
        <img src={LOGO} style={{ width:28, objectFit:'contain' }} />
        <div style={{ fontWeight:900, fontSize:16, color:'#1a1a1a' }}>MEU PERFIL</div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'20px 16px' }}>

        {/* Card do perfil */}
        <div style={{ background:'linear-gradient(135deg,#111,#1a1200)', border:'1px solid #F5C40030', borderRadius:16, padding:24, marginBottom:16, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,#F5C400,transparent)' }} />

          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
            {usuario.avatar_url ? (
              <img src={usuario.avatar_url} style={{ width:64, height:64, borderRadius:'50%', border:'2px solid #F5C400', objectFit:'cover' }} />
            ) : (
              <div style={{ width:64, height:64, borderRadius:'50%', background:'#F5C400', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:900, color:'#111' }}>
                {(usuario.apelido||usuario.nome).charAt(0)}
              </div>
            )}
            <div>
              <div style={{ fontSize:20, fontWeight:900, color:'#fff', letterSpacing:-0.5 }}>{usuario.apelido || usuario.nome}</div>
              <div style={{ fontSize:13, color:'#F5C400', fontWeight:700, marginTop:2 }}>
                {NIVEL_ICON[nivel]} {nivel}
              </div>
              <div style={{ fontSize:10, color:'#555', marginTop:2, textTransform:'uppercase', letterSpacing:1 }}>
                #{posicao}º no ranking geral
              </div>
            </div>
          </div>

          {/* Barra de progresso do nível */}
          {nivel !== 'Lenda' && (
            <div style={{ marginBottom:20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:10, color:'#555', textTransform:'uppercase', letterSpacing:1 }}>{nivel}</span>
                <span style={{ fontSize:10, color:'#F5C400', textTransform:'uppercase', letterSpacing:1 }}>{proximoNivel.nome}</span>
              </div>
              <div style={{ height:4, background:'#1a1a1a', borderRadius:2, overflow:'hidden' }}>
                <div style={{ width:`${progressoPct}%`, height:'100%', background:'#F5C400', borderRadius:2, transition:'width 1s' }} />
              </div>
              <div style={{ fontSize:10, color:'#555', marginTop:4, textAlign:'right' }}>
                {usuario.pontos_total} / {proximoNivel.pts} pts para {proximoNivel.nome}
              </div>
            </div>
          )}

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {[
              ['Pontos', usuario.pontos_total],
              ['Rodadas', totalRodadas],
              ['Média', mediaRodada],
              ['Recorde', melhorRodada],
            ].map(([l,v]) => (
              <div key={l} style={{ background:'rgba(0,0,0,0.3)', borderRadius:8, padding:'10px 6px', textAlign:'center' }}>
                <div style={{ fontSize:18, fontWeight:900, color:'#F5C400' }}>{v}</div>
                <div style={{ fontSize:9, color:'#555', textTransform:'uppercase', letterSpacing:1, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak */}
        {usuario.streak > 0 && (
          <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:'12px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ fontSize:28 }}>🔥</div>
            <div>
              <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>{usuario.streak} jogos seguidos</div>
              <div style={{ fontSize:11, color:'#555' }}>Continue escalando para manter a sequência!</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:'flex', background:'#111', borderRadius:8, padding:4, marginBottom:16 }}>
          {(['badges','historico'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, padding:'10px', fontSize:12, fontWeight:900, textTransform:'uppercase', letterSpacing:1, border:'none', borderRadius:6, cursor:'pointer', background: tab===t?'#F5C400':'transparent', color: tab===t?'#111':'#555' }}>
              {t === 'badges' ? `🏅 Badges (${badges.length})` : '📋 Histórico'}
            </button>
          ))}
        </div>

        {/* BADGES */}
        {tab === 'badges' && (
          badges.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>🎯</div>
              <div style={{ fontSize:14, color:'#555', fontWeight:700 }}>Nenhum badge ainda</div>
              <div style={{ fontSize:12, color:'#333', marginTop:4 }}>Continue jogando para desbloquear conquistas!</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {badges.map((b, i) => {
                const info = BADGE_INFO[b.tipo] || { emoji:'🏅', label: b.tipo, desc:'' };
                return (
                  <div key={i} style={{ background:'linear-gradient(135deg,#111,#1a1200)', border:'1px solid #F5C40030', borderRadius:12, padding:'16px 12px', textAlign:'center' }}>
                    <div style={{ fontSize:32, marginBottom:8 }}>{info.emoji}</div>
                    <div style={{ fontSize:11, fontWeight:900, color:'#F5C400', textTransform:'uppercase', letterSpacing:0.5, marginBottom:4 }}>{info.label}</div>
                    <div style={{ fontSize:10, color:'#555', lineHeight:1.4 }}>{info.desc}</div>
                    <div style={{ fontSize:9, color:'#333', marginTop:8 }}>
                      {new Date(b.ganho_em).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* HISTÓRICO */}
        {tab === 'historico' && (
          historico.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px 20px' }}>
              <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
              <div style={{ fontSize:14, color:'#555', fontWeight:700 }}>Nenhuma rodada ainda</div>
              <Link href="/tigre-fc" style={{ display:'inline-block', marginTop:16, background:'#F5C400', color:'#111', fontWeight:900, fontSize:12, padding:'10px 20px', borderRadius:8, textDecoration:'none', textTransform:'uppercase' }}>
                Escalar agora
              </Link>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:1, background:'#111' }}>
              {historico.map((h, i) => (
                <Link key={i} href={`/tigre-fc/resultado/${h.jogo_id}`}
                  style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:'#080808', textDecoration:'none' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:3 }}>
                      Rodada {i + 1}
                      {h.acertou_placar_exato && <span style={{ marginLeft:8, fontSize:10, color:'#4ade80', fontWeight:900 }}>🎯 Placar exato!</span>}
                      {!h.acertou_placar_exato && h.acertou_resultado && <span style={{ marginLeft:8, fontSize:10, color:'#60a5fa', fontWeight:900 }}>✓ Resultado certo</span>}
                    </div>
                    <div style={{ display:'flex', gap:12, fontSize:10, color:'#555' }}>
                      <span>⚽ {h.pts_jogadores}pts</span>
                      <span>🎯 {h.pts_palpite}pts</span>
                      {h.pts_heroi > 0 && <span>⭐ {h.pts_heroi}pts</span>}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:22, fontWeight:900, color:'#F5C400' }}>{h.pts_total}</div>
                    <div style={{ fontSize:9, color:'#555', textTransform:'uppercase' }}>pts</div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        <Link href="/tigre-fc" style={{ display:'block', marginTop:24, textAlign:'center', color:'#444', fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:2, textDecoration:'none' }}>
          ← Voltar ao jogo
        </Link>
      </div>
    </main>
  );
}
