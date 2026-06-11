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

type Liga = {
  liga_id: string; nome: string; codigo: string; descricao: string | null;
  total_membros: number; eh_dono: boolean; minha_posicao: number; criado_em: string;
};

type RankMembro = {
  posicao: number; usuario_id: string; apelido: string; avatar_url: string | null;
  nivel: string; pontos_total: number; streak: number; total_badges: number; eh_dono: boolean;
};

export default function TigreFCLigas() {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [minhasLigas, setMinhasLigas] = useState<Liga[]>([]);
  const [ligaAberta, setLigaAberta] = useState<{ liga: any; ranking: RankMembro[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'lista'|'criar'|'entrar'|'detalhe'>('lista');

  // Criar liga
  const [nomeLiga, setNomeLiga] = useState('');
  const [descLiga, setDescLiga] = useState('');
  // Entrar liga
  const [codigoInput, setCodigoInput] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setLoading(false); return; }
      const { data: u } = await supabase.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
      if (!u) { setLoading(false); return; }
      setUsuarioId(u.id);
      carregarLigas(u.id);
    });
  }, []);

  const carregarLigas = async (uid: string) => {
    setLoading(true);
    const res = await fetch(`/api/tigre-fc/ligas?usuario_id=${uid}`);
    const data = await res.json();
    setMinhasLigas(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const abrirLiga = async (codigo: string) => {
    const res = await fetch(`/api/tigre-fc/ligas?codigo=${codigo}`);
    const data = await res.json();
    if (data.liga) { setLigaAberta(data); setView('detalhe'); }
  };

  const criarLiga = async () => {
    if (!nomeLiga.trim() || !usuarioId) return;
    setErro(''); setSalvando(true);
    const res = await fetch('/api/tigre-fc/ligas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'criar', usuario_id: usuarioId, nome: nomeLiga, descricao: descLiga }),
    });
    const data = await res.json();
    setSalvando(false);
    if (data.error) { setErro(data.error); return; }
    setSucesso(`Liga criada! Código: ${data.codigo}`);
    setNomeLiga(''); setDescLiga('');
    await carregarLigas(usuarioId);
    setTimeout(() => { setSucesso(''); setView('lista'); }, 2500);
  };

  const entrarLiga = async () => {
    if (!codigoInput.trim() || !usuarioId) return;
    setErro(''); setSalvando(true);
    const res = await fetch('/api/tigre-fc/ligas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'entrar', usuario_id: usuarioId, codigo: codigoInput }),
    });
    const data = await res.json();
    setSalvando(false);
    if (data.error) { setErro(data.error); return; }
    setSucesso(`Você entrou em "${data.liga.nome}"!`);
    setCodigoInput('');
    await carregarLigas(usuarioId);
    setTimeout(() => { setSucesso(''); setView('lista'); }, 2000);
  };

  const sairLiga = async (ligaId: string) => {
    if (!usuarioId) return;
    const res = await fetch('/api/tigre-fc/ligas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ acao: 'sair', usuario_id: usuarioId, liga_id: ligaId }),
    });
    const data = await res.json();
    if (data.error) { setErro(data.error); return; }
    await carregarLigas(usuarioId);
    setView('lista');
  };

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 2000); });
  };

  const compartilharWhatsApp = (liga: any) => {
    const texto = encodeURIComponent(`🐯 Entra na minha liga do Tigre FC!\n\nLiga: *${liga.nome}*\nCódigo: *${liga.codigo}*\n\nAcessa: onovorizontino.com.br/tigre-fc/ligas`);
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  };

  if (!usuarioId && !loading) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, textAlign:'center' }}>
      <img src={LOGO} style={{ width:64, marginBottom:16 }} />
      <div style={{ fontSize:18, fontWeight:900, color:'#fff', marginBottom:8 }}>Entre para criar uma liga</div>
      <Link href="/tigre-fc" style={{ background:'#F5C400', color:'#111', fontWeight:900, fontSize:14, padding:'14px 28px', borderRadius:12, textDecoration:'none', textTransform:'uppercase' }}>
        Entrar no Tigre FC
      </Link>
    </main>
  );

  const S: React.CSSProperties = { fontFamily:'system-ui', minHeight:'100vh', background:'#080808', color:'#fff', paddingBottom:80 };

  return (
    <main style={S}>
      {/* Header */}
      <div style={{ background:'#F5C400', padding:'14px 20px', display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={() => view === 'lista' ? window.history.back() : setView('lista')}
          style={{ background:'none', border:'none', color:'#1a1a1a', fontWeight:900, fontSize:20, cursor:'pointer', padding:0 }}>←</button>
        <img src={LOGO} style={{ width:28, objectFit:'contain' }} />
        <div style={{ fontWeight:900, fontSize:16, color:'#1a1a1a' }}>
          {view === 'criar' ? 'CRIAR LIGA' : view === 'entrar' ? 'ENTRAR NA LIGA' : view === 'detalhe' ? ligaAberta?.liga.nome.toUpperCase() : 'MINHAS LIGAS'}
        </div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'20px 16px' }}>

        {/* ── LISTA ── */}
        {view === 'lista' && (
          <>
            {/* CTAs */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:20 }}>
              <button onClick={() => { setView('criar'); setErro(''); setSucesso(''); }}
                style={{ padding:'16px', background:'#F5C400', color:'#111', fontWeight:900, fontSize:13, border:'none', borderRadius:12, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                + Criar Liga
              </button>
              <button onClick={() => { setView('entrar'); setErro(''); setSucesso(''); }}
                style={{ padding:'16px', background:'#111', color:'#fff', fontWeight:900, fontSize:13, border:'1px solid #1a1a1a', borderRadius:12, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                Entrar com Código
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign:'center', padding:40, color:'#555', fontSize:13 }}>Carregando ligas...</div>
            ) : minhasLigas.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px 20px' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>🐯</div>
                <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:8 }}>Você não tem nenhuma liga</div>
                <p style={{ fontSize:13, color:'#555', lineHeight:1.6 }}>Cria uma liga e chama a galera do grupo,<br/>ou entra numa com o código de um amigo!</p>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {minhasLigas.map(liga => (
                  <button key={liga.liga_id} onClick={() => abrirLiga(liga.codigo)}
                    style={{ display:'flex', alignItems:'center', gap:14, padding:'16px', background:'#111', border:'1px solid #1a1a1a', borderRadius:12, cursor:'pointer', textAlign:'left', width:'100%', transition:'border-color .2s' }}>
                    <div style={{ width:44, height:44, borderRadius:'50%', background:'#F5C400', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                      {liga.eh_dono ? '👑' : '🐯'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:15, fontWeight:900, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{liga.nome}</div>
                      <div style={{ fontSize:10, color:'#555', marginTop:2, textTransform:'uppercase', letterSpacing:1 }}>
                        {liga.total_membros} membro{liga.total_membros !== 1 ? 's' : ''} · #{liga.minha_posicao}º · Código: {liga.codigo}
                      </div>
                    </div>
                    <div style={{ fontSize:18, color:'#333', flexShrink:0 }}>›</div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── CRIAR ── */}
        {view === 'criar' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:20 }}>
              <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, fontWeight:900, marginBottom:16 }}>Dados da liga</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div>
                  <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:1, marginBottom:6, fontWeight:700 }}>Nome da liga *</div>
                  <input value={nomeLiga} onChange={e => setNomeLiga(e.target.value)} maxLength={30}
                    placeholder="Ex: Galera do Trabalho"
                    style={{ width:'100%', padding:'12px', background:'#0a0a0a', border:'1px solid #222', borderRadius:8, color:'#fff', fontSize:15, boxSizing:'border-box' }} />
                  <div style={{ fontSize:10, color:'#333', marginTop:4, textAlign:'right' }}>{nomeLiga.length}/30</div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:1, marginBottom:6, fontWeight:700 }}>Descrição (opcional)</div>
                  <input value={descLiga} onChange={e => setDescLiga(e.target.value)} maxLength={60}
                    placeholder="Ex: Liga dos torcedores do setor 4"
                    style={{ width:'100%', padding:'12px', background:'#0a0a0a', border:'1px solid #222', borderRadius:8, color:'#fff', fontSize:14, boxSizing:'border-box' }} />
                </div>
              </div>
            </div>

            <div style={{ background:'#0a0a0a', border:'1px solid #1a1a1a', borderRadius:8, padding:12 }}>
              <div style={{ fontSize:11, color:'#555', lineHeight:1.6 }}>
                🔑 Um código único será gerado automaticamente para você compartilhar com a galera.<br/>
                👑 Você será o dono da liga.<br/>
                📊 Máximo de 50 membros e você pode criar até 3 ligas.
              </div>
            </div>

            {erro && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', borderRadius:8, padding:12, fontSize:13, color:'#f87171', fontWeight:700 }}>{erro}</div>}
            {sucesso && <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid #4ade80', borderRadius:8, padding:12, fontSize:13, color:'#4ade80', fontWeight:700 }}>✅ {sucesso}</div>}

            <button onClick={criarLiga} disabled={!nomeLiga.trim() || salvando}
              style={{ padding:'16px', background: nomeLiga.trim()?'#F5C400':'#1a1a1a', color: nomeLiga.trim()?'#111':'#444', fontWeight:900, fontSize:14, border:'none', borderRadius:12, cursor: nomeLiga.trim()?'pointer':'not-allowed', textTransform:'uppercase', letterSpacing:1 }}>
              {salvando ? 'Criando...' : '🐯 Criar Liga'}
            </button>
          </div>
        )}

        {/* ── ENTRAR ── */}
        {view === 'entrar' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:12, padding:20 }}>
              <div style={{ fontSize:11, color:'#F5C400', textTransform:'uppercase', letterSpacing:2, fontWeight:900, marginBottom:16 }}>Código da liga</div>
              <input value={codigoInput} onChange={e => setCodigoInput(e.target.value.toUpperCase())} maxLength={12}
                placeholder="Ex: TIGRE7X2"
                style={{ width:'100%', padding:'16px', background:'#0a0a0a', border:'2px solid #F5C400', borderRadius:8, color:'#F5C400', fontSize:22, fontWeight:900, letterSpacing:4, textAlign:'center', boxSizing:'border-box', textTransform:'uppercase' }} />
              <p style={{ fontSize:12, color:'#555', marginTop:8, textAlign:'center' }}>Peça o código para quem criou a liga</p>
            </div>

            {erro && <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', borderRadius:8, padding:12, fontSize:13, color:'#f87171', fontWeight:700 }}>{erro}</div>}
            {sucesso && <div style={{ background:'rgba(74,222,128,0.1)', border:'1px solid #4ade80', borderRadius:8, padding:12, fontSize:13, color:'#4ade80', fontWeight:700 }}>✅ {sucesso}</div>}

            <button onClick={entrarLiga} disabled={!codigoInput.trim() || salvando}
              style={{ padding:'16px', background: codigoInput.trim()?'#F5C400':'#1a1a1a', color: codigoInput.trim()?'#111':'#444', fontWeight:900, fontSize:14, border:'none', borderRadius:12, cursor: codigoInput.trim()?'pointer':'not-allowed', textTransform:'uppercase', letterSpacing:1 }}>
              {salvando ? 'Entrando...' : '→ Entrar na Liga'}
            </button>
          </div>
        )}

        {/* ── DETALHE DA LIGA ── */}
        {view === 'detalhe' && ligaAberta && (
          <>
            {/* Info da liga */}
            <div style={{ background:'linear-gradient(135deg,#111,#1a1200)', border:'1px solid #F5C40030', borderRadius:12, padding:16, marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>{ligaAberta.liga.nome}</div>
                  {ligaAberta.liga.descricao && <div style={{ fontSize:12, color:'#555', marginTop:2 }}>{ligaAberta.liga.descricao}</div>}
                  <div style={{ fontSize:10, color:'#555', marginTop:4, textTransform:'uppercase', letterSpacing:1 }}>
                    {ligaAberta.ranking.length} membro{ligaAberta.ranking.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'#F5C400', letterSpacing:2 }}>{ligaAberta.liga.codigo}</div>
                  <div style={{ fontSize:10, color:'#555', textTransform:'uppercase' }}>código</div>
                </div>
              </div>

              {/* Botões de ação */}
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => copiarCodigo(ligaAberta.liga.codigo)}
                  style={{ flex:1, padding:'10px', background:'#0a0a0a', border:'1px solid #222', borderRadius:8, color: copiado?'#4ade80':'#fff', fontWeight:900, fontSize:11, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                  {copiado ? '✓ Copiado!' : '📋 Copiar código'}
                </button>
                <button onClick={() => compartilharWhatsApp(ligaAberta.liga)}
                  style={{ flex:1, padding:'10px', background:'#25D366', border:'none', borderRadius:8, color:'#fff', fontWeight:900, fontSize:11, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
                  📲 WhatsApp
                </button>
              </div>
            </div>

            {/* Ranking dos membros */}
            <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:2, fontWeight:900, marginBottom:8 }}>Ranking da liga</div>
            <div style={{ display:'flex', flexDirection:'column', gap:1, background:'#111', borderRadius:12, overflow:'hidden' }}>
              {ligaAberta.ranking.length === 0 ? (
                <div style={{ padding:32, textAlign:'center', color:'#555' }}>Nenhum membro ainda</div>
              ) : ligaAberta.ranking.map((m: RankMembro, i: number) => {
                const isMe = m.usuario_id === usuarioId;
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}º`;
                return (
                  <div key={m.usuario_id} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background: isMe?'#1a1200':'#080808', borderBottom:'1px solid #0a0a0a' }}>
                    <div style={{ width:32, textAlign:'center', fontSize: i<3?20:13, fontWeight:900, color: i===0?'#FFD700':i===1?'#C0C0C0':i===2?'#CD7F32':'#444' }}>{medal}</div>
                    {m.avatar_url ? (
                      <img src={m.avatar_url} style={{ width:38, height:38, borderRadius:'50%', objectFit:'cover', border:`1.5px solid ${isMe?'#F5C400':'#1a1a1a'}` }} />
                    ) : (
                      <div style={{ width:38, height:38, borderRadius:'50%', background: isMe?'#F5C400':'#1a1a1a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, color: isMe?'#111':'#555' }}>
                        {(m.apelido||'?').charAt(0)}
                      </div>
                    )}
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color: isMe?'#F5C400':'#fff', display:'flex', alignItems:'center', gap:6 }}>
                        {m.apelido}
                        {m.eh_dono && <span style={{ fontSize:10, color:'#F5C400' }}>👑</span>}
                        {isMe && <span style={{ fontSize:10, background:'#F5C40020', color:'#F5C400', padding:'1px 6px', borderRadius:4 }}>você</span>}
                      </div>
                      <div style={{ fontSize:10, color:'#555', marginTop:1 }}>
                        {NIVEL_ICON[m.nivel]} {m.nivel}
                        {m.streak > 1 && ` · 🔥 ${m.streak}`}
                        {m.total_badges > 0 && ` · ${m.total_badges} badge${m.total_badges > 1?'s':''}`}
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:20, fontWeight:900, color:'#F5C400' }}>{m.pontos_total}</div>
                      <div style={{ fontSize:9, color:'#555', textTransform:'uppercase' }}>pts</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sair da liga */}
            {ligaAberta.ranking.find((m: RankMembro) => m.usuario_id === usuarioId) && !ligaAberta.ranking.find((m: RankMembro) => m.usuario_id === usuarioId && m.eh_dono) && (
              <button onClick={() => { if (confirm('Sair da liga?')) sairLiga(ligaAberta.liga.id); }}
                style={{ marginTop:16, width:'100%', padding:'12px', background:'transparent', border:'1px solid #3f3f46', color:'#555', fontWeight:700, fontSize:12, borderRadius:8, cursor:'pointer', textTransform:'uppercase' }}>
                Sair da liga
              </button>
            )}

            {erro && <div style={{ marginTop:8, background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', borderRadius:8, padding:12, fontSize:13, color:'#f87171', fontWeight:700 }}>{erro}</div>}
          </>
        )}
      </div>
    </main>
  );
}
