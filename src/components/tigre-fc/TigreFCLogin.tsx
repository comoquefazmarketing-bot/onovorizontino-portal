'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

type Props = { jogoId: number; onSuccess: (usuario: any) => void };

export default function TigreFCLogin({ jogoId, onSuccess }: Props) {
  const [tab, setTab] = useState<'google' | 'email'>('google');
  const [modo, setModo] = useState<'entrar' | 'cadastrar'>('entrar');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [vinculando, setVinculando] = useState(false); // estado de vinculação Google

  const handleGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/tigre-fc/escalar/${jogoId}` }
    });
    if (error) { setErro('Erro ao conectar com Google. Tente pelo email.'); setLoading(false); }
  };

  const handleVincularGoogle = async () => {
    setLoading(true);
    // Faz login com email primeiro para ter sessão ativa
    const { error: loginErr } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (loginErr) { setErro('Confirme sua senha para vincular ao Google.'); setLoading(false); return; }
    // Vincula o Google à conta existente
    const { error: linkErr } = await supabase.auth.linkIdentity({ provider: 'google' });
    if (linkErr) { setErro('Não foi possível vincular. Tente novamente.'); setLoading(false); return; }
    // linkIdentity redireciona para Google — após retorno, a conta já estará vinculada
  };

  const handleEmail = async () => {
    if (!email.trim() || !senha.trim()) { setErro('Preencha email e senha.'); return; }
    if (modo === 'cadastrar' && !nome.trim()) { setErro('Informe seu nome.'); return; }
    if (senha.length < 6) { setErro('Senha deve ter pelo menos 6 caracteres.'); return; }
    setErro(''); setLoading(true);

    if (modo === 'cadastrar') {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
        options: { data: { full_name: nome.trim() } }
      });
      if (error) {
        if (error.message.includes('already registered')) {
          setErro('Este email já tem conta. Entre com email e senha.');
          setModo('entrar');
        } else {
          setErro(traduzirErro(error.message));
        }
        setLoading(false); return;
      }
      if (data.user) {
        const { data: u } = await supabase.from('tigre_fc_usuarios').insert({
          google_id: data.user.id,
          nome: nome.trim(),
          email: email.trim(),
          avatar_url: null,
        }).select().single();
        onSuccess(u);
      }

    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(), password: senha
      });

      // Conflito de provedor — conta existe mas foi criada com Google
      if (error?.message?.includes('provider_email_conflict') || error?.message?.includes('already registered')) {
        setVinculando(true);
        setLoading(false); return;
      }

      if (error) { setErro(traduzirErro(error.message)); setLoading(false); return; }

      if (data.user) {
        const { data: u } = await supabase
          .from('tigre_fc_usuarios').select('*')
          .eq('google_id', data.user.id).single();

        if (u) {
          onSuccess(u);
        } else {
          // Usuário existe no Auth mas não na tabela — cria
          const nomeUser = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Torcedor';
          const { data: novoU } = await supabase.from('tigre_fc_usuarios').insert({
            google_id: data.user.id,
            nome: nomeUser,
            email: data.user.email,
            avatar_url: null,
          }).select().single();
          onSuccess(novoU);
        }
      }
    }
    setLoading(false);
  };

  const traduzirErro = (msg: string) => {
    if (msg.includes('Invalid login')) return 'Email ou senha incorretos.';
    if (msg.includes('already registered')) return 'Este email já tem conta.';
    if (msg.includes('Password should be')) return 'Senha deve ter pelo menos 6 caracteres.';
    if (msg.includes('Invalid email')) return 'Email inválido.';
    if (msg.includes('Email not confirmed')) return 'Confirme seu email antes de entrar.';
    return 'Algo deu errado. Tente novamente.';
  };

  // ── Tela de vinculação ────────────────────────────────────────────────────
  if (vinculando) return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={LOGO} style={{ width:64, marginBottom:20 }} />
      <div style={{ width:'100%', maxWidth:360, background:'#111', border:'1px solid #F5C400', borderRadius:16, padding:24 }}>
        <div style={{ fontSize:16, fontWeight:900, color:'#fff', marginBottom:8 }}>Conta já existe!</div>
        <p style={{ fontSize:13, color:'#666', lineHeight:1.6, marginBottom:20 }}>
          Este email já tem conta criada com Google.<br/>
          Quer vincular o Google ao seu login por email para entrar dos dois jeitos?
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button onClick={handleVincularGoogle} disabled={loading}
            style={{ width:'100%', padding:'14px', background:'#F5C400', color:'#111', border:'none', borderRadius:12, fontSize:14, fontWeight:900, cursor:'pointer', textTransform:'uppercase', letterSpacing:1 }}>
            {loading ? 'Aguarde...' : '🔗 Sim, vincular ao Google'}
          </button>
          <button onClick={() => { setVinculando(false); setTab('google'); setErro(''); }}
            style={{ width:'100%', padding:'14px', background:'transparent', color:'#555', border:'1px solid #222', borderRadius:12, fontSize:13, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>
            Entrar só com Google
          </button>
          <button onClick={() => { setVinculando(false); setErro(''); }}
            style={{ background:'none', border:'none', color:'#444', fontSize:12, cursor:'pointer', marginTop:4 }}>
            Cancelar
          </button>
        </div>
        {erro && <div style={{ marginTop:12, fontSize:13, color:'#f87171', fontWeight:700 }}>{erro}</div>}
      </div>
    </main>
  );

  // ── Tela principal de login ───────────────────────────────────────────────
  return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24 }}>
      <img src={LOGO} style={{ width:72, marginBottom:16 }} />
      <div style={{ fontSize:28, fontWeight:900, color:'#F5C400', marginBottom:4, letterSpacing:-1 }}>TIGRE FC</div>
      <div style={{ fontSize:11, color:'#555', letterSpacing:3, textTransform:'uppercase', marginBottom:32 }}>Fantasy League · Novorizontino</div>

      <div style={{ width:'100%', maxWidth:360 }}>

        {/* Tabs */}
        <div style={{ display:'flex', background:'#111', borderRadius:10, padding:4, marginBottom:20, border:'1px solid #1a1a1a' }}>
          <button onClick={() => { setTab('google'); setErro(''); }}
            style={{ flex:1, padding:'10px', fontSize:12, fontWeight:900, textTransform:'uppercase', letterSpacing:1, border:'none', borderRadius:7, cursor:'pointer', background: tab==='google'?'#F5C400':'transparent', color: tab==='google'?'#111':'#555' }}>
            Google
          </button>
          <button onClick={() => { setTab('email'); setErro(''); }}
            style={{ flex:1, padding:'10px', fontSize:12, fontWeight:900, textTransform:'uppercase', letterSpacing:1, border:'none', borderRadius:7, cursor:'pointer', background: tab==='email'?'#F5C400':'transparent', color: tab==='email'?'#111':'#555' }}>
            Email
          </button>
        </div>

        <div style={{ background:'#111', border:'1px solid #1a1a1a', borderRadius:16, padding:24 }}>

          {/* GOOGLE */}
          {tab === 'google' && (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <p style={{ fontSize:13, color:'#666', lineHeight:1.6, marginBottom:4, textAlign:'center' }}>
                Entre com sua conta Google em um clique.<br/>Sem senha pra criar.
              </p>
              <button onClick={handleGoogle} disabled={loading}
                style={{ width:'100%', padding:'14px', background:'#fff', color:'#1a1a1a', border:'none', borderRadius:12, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity: loading?0.7:1 }}>
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {loading ? 'Redirecionando...' : 'Entrar com Google'}
              </button>
              <div style={{ textAlign:'center' }}>
                <button onClick={() => { setTab('email'); setErro(''); }}
                  style={{ background:'none', border:'none', color:'#555', fontSize:12, cursor:'pointer', textDecoration:'underline' }}>
                  Prefiro usar email e senha
                </button>
              </div>
            </div>
          )}

          {/* EMAIL */}
          {tab === 'email' && (
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <div style={{ display:'flex', gap:16, marginBottom:4 }}>
                {(['entrar','cadastrar'] as const).map(m => (
                  <button key={m} onClick={() => { setModo(m); setErro(''); }}
                    style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, fontWeight:900, textTransform:'uppercase', color: modo===m?'#F5C400':'#555', borderBottom: modo===m?'2px solid #F5C400':'2px solid transparent', paddingBottom:4, letterSpacing:1 }}>
                    {m === 'entrar' ? 'Entrar' : 'Criar conta'}
                  </button>
                ))}
              </div>

              {modo === 'cadastrar' && (
                <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome"
                  style={{ width:'100%', padding:'12px', background:'#0a0a0a', border:'1px solid #222', borderRadius:10, color:'#fff', fontSize:15, boxSizing:'border-box' as const }} />
              )}

              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu email"
                style={{ width:'100%', padding:'12px', background:'#0a0a0a', border:'1px solid #222', borderRadius:10, color:'#fff', fontSize:15, boxSizing:'border-box' as const }} />

              <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                placeholder={modo === 'cadastrar' ? 'Crie uma senha (mín. 6 caracteres)' : 'Sua senha'}
                onKeyDown={e => e.key === 'Enter' && handleEmail()}
                style={{ width:'100%', padding:'12px', background:'#0a0a0a', border:'1px solid #222', borderRadius:10, color:'#fff', fontSize:15, boxSizing:'border-box' as const }} />

              {erro && (
                <div style={{ background:'rgba(248,113,113,0.1)', border:'1px solid #f87171', borderRadius:8, padding:'10px 12px', fontSize:13, color:'#f87171', fontWeight:700 }}>
                  {erro}
                </div>
              )}

              <button onClick={handleEmail} disabled={loading}
                style={{ width:'100%', padding:'14px', background:'#F5C400', color:'#111', border:'none', borderRadius:12, fontSize:15, fontWeight:900, cursor:'pointer', textTransform:'uppercase' as const, letterSpacing:1, opacity: loading?0.7:1, marginTop:4 }}>
                {loading ? 'Aguarde...' : modo === 'entrar' ? 'Entrar →' : 'Criar conta e jogar →'}
              </button>

              <div style={{ textAlign:'center' }}>
                <button onClick={() => { setTab('google'); setErro(''); }}
                  style={{ background:'none', border:'none', color:'#555', fontSize:12, cursor:'pointer', textDecoration:'underline' }}>
                  Entrar com Google
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ fontSize:11, color:'#333', textAlign:'center', marginTop:16, lineHeight:1.5 }}>
          Seus dados são usados apenas no Portal O Novorizontino.
        </p>
      </div>
    </main>
  );
}
