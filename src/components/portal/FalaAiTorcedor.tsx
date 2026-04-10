'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

// ─── Tipos ────────────────────────────────────────────────────
type Comentario = {
  id: string;
  postagem_id: string;
  user_id: string;
  apelido: string;
  avatar_url: string | null;
  avatar_emoji: string;
  mensagem: string;
  reacao: string | null;
  moderado: boolean;
  criado_em: string;
};

// ─── Constantes ───────────────────────────────────────────────
const EMOJIS    = ['🐯','⚽','🔥','🏆','💛','🦁','📯','⚡','🎯','👊','🐾','🎽'];
const REACOES   = [
  { emoji: '🔥', label: 'Queimou'  },
  { emoji: '💛', label: 'É o Tigre' },
  { emoji: '📯', label: 'Corneta'  },
  { emoji: '👊', label: 'Concordo' },
];
const MAX       = 280;
const KEY_APEL  = 'torcedor_apelido';
const KEY_EMOJI = 'torcedor_emoji';

// ─── Helpers ──────────────────────────────────────────────────
function ago(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return 'agora';
  if (s < 3600)  return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function Av({ url, emoji, size = 32 }: { url?: string | null; emoji: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (url && !err) return (
    <img src={url} alt="" onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(245,196,0,0.12)', border: '1px solid rgba(245,196,0,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.52,
    }}>{emoji}</div>
  );
}

// ─── Bolha ────────────────────────────────────────────────────
function Bolha({ c, isMeu, onDenunciar }: { c: Comentario; isMeu: boolean; onDenunciar: (id: string) => void }) {
  const [menu, setMenu] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: isMeu ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end', animation: 'fu .22s ease-out' }}>
      <Av url={c.avatar_url} emoji={c.avatar_emoji} size={32} />
      <div style={{ maxWidth: '76%', display: 'flex', flexDirection: 'column', gap: 3, alignItems: isMeu ? 'flex-end' : 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: isMeu ? 'row-reverse' : 'row' }}>
          <span style={{ fontSize: 10, fontWeight: 900, color: isMeu ? '#F5C400' : 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {c.apelido}
          </span>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.18)', fontWeight: 600 }}>{ago(c.criado_em)}</span>
        </div>
        <div
          onDoubleClick={() => !isMeu && setMenu(v => !v)}
          style={{
            background: isMeu ? 'linear-gradient(135deg,rgba(245,196,0,0.16),rgba(245,196,0,0.07))' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${isMeu ? 'rgba(245,196,0,0.25)' : 'rgba(255,255,255,0.07)'}`,
            borderRadius: isMeu ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            padding: '9px 13px', color: isMeu ? '#fff' : 'rgba(255,255,255,0.82)',
            fontSize: 14, lineHeight: 1.5, wordBreak: 'break-word',
          }}
        >{c.mensagem}</div>
        {c.reacao && (
          <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 999, padding: '2px 7px' }}>
            {c.reacao}
          </span>
        )}
        {menu && !isMeu && (
          <button onClick={() => { onDenunciar(c.id); setMenu(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '3px 10px', color: '#EF4444', fontSize: 10, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase' }}>
            🚩 Denunciar
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Modal de apelido ─────────────────────────────────────────
function ModalApelido({ user, onSalvar }: { user: User; onSalvar: (a: string, e: string) => void }) {
  const nome0 = user.user_metadata?.full_name?.split(' ')[0] ?? '';
  const [apelido, setApelido] = useState(nome0);
  const [emoji,   setEmoji]   = useState('🐯');
  const [erro,    setErro]    = useState('');

  const ok = () => {
    const a = apelido.trim();
    if (a.length < 2)  return setErro('Mínimo 2 letras');
    if (a.length > 30) return setErro('Máximo 30 letras');
    onSalvar(a, emoji);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#0a0800', border: '1px solid rgba(245,196,0,0.3)', borderRadius: 22, padding: 28, maxWidth: 320, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 44, marginBottom: 10 }}>{emoji}</div>
        <h4 style={{ color: '#fff', fontSize: 18, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', margin: '0 0 4px' }}>Quase lá!</h4>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, margin: '0 0 18px' }}>Escolha como aparecer no chat</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', marginBottom: 16 }}>
          {EMOJIS.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{ width: 38, height: 38, borderRadius: 9, fontSize: 19, background: emoji === e ? 'rgba(245,196,0,0.2)' : 'rgba(255,255,255,0.04)', border: `2px solid ${emoji === e ? 'rgba(245,196,0,0.6)' : 'rgba(255,255,255,0.05)'}`, cursor: 'pointer' }}>{e}</button>
          ))}
        </div>
        <input value={apelido} onChange={e => { setApelido(e.target.value); setErro(''); }}
          onKeyDown={e => e.key === 'Enter' && ok()} placeholder="Seu apelido" maxLength={30}
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 13px', color: '#fff', fontSize: 14, outline: 'none', marginBottom: erro ? 6 : 14, boxSizing: 'border-box' }}
        />
        {erro && <p style={{ color: '#EF4444', fontSize: 11, fontWeight: 700, margin: '0 0 10px' }}>{erro}</p>}
        <button onClick={ok} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#F5C400,#D4A200)', color: '#000', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', border: 'none', borderRadius: 12, cursor: 'pointer' }}>
          Entrar no Chat 🐯
        </button>
      </div>
    </div>
  );
}

// ─── Tela de Login ────────────────────────────────────────────
function TelaLogin({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ padding: '24px 20px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, margin: '0 0 14px', lineHeight: 1.5 }}>
        Faça login com o Google para comentar.<br />
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>Quem não faz login ainda pode ler tudo 👁️</span>
      </p>
      <button onClick={onLogin}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#fff', color: '#111', fontWeight: 900, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', padding: '11px 22px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
        <svg viewBox="0 0 24 24" style={{ width: 16 }}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Entrar com Google
      </button>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────
export default function FalaAiTorcedor({ postagemId }: { postagemId: string }) {
  const sb = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user,        setUser]        = useState<User | null>(null);
  const [apelido,     setApelido]     = useState<string | null>(null);
  const [emoji,       setEmoji]       = useState('🐯');
  const [showModal,   setShowModal]   = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [msg,         setMsg]         = useState('');
  const [reacao,      setReacao]      = useState<string | null>(null);
  const [enviando,    setEnviando]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [erro,        setErro]        = useState('');
  const [denOk,       setDenOk]       = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  // Sessão
  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      setUser(session.user);
      const a = localStorage.getItem(KEY_APEL);
      const e = localStorage.getItem(KEY_EMOJI) ?? '🐯';
      if (a) { setApelido(a); setEmoji(e); }
      else setShowModal(true);
    });
    const { data: { subscription } } = sb.auth.onAuthStateChange((_, s) => {
      setUser(s?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line

  const login = useCallback(() => {
    sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.href } });
  }, [sb]);

  const salvarPerfil = useCallback((a: string, e: string) => {
    localStorage.setItem(KEY_APEL, a);
    localStorage.setItem(KEY_EMOJI, e);
    setApelido(a); setEmoji(e); setShowModal(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Carrega comentários
  useEffect(() => {
    if (!postagemId) return;
    setLoading(true);
    sb.from('comentarios_postagens').select('*')
      .eq('postagem_id', postagemId).eq('moderado', false)
      .order('criado_em', { ascending: true }).limit(60)
      .then(({ data }) => { if (data) setComentarios(data as Comentario[]); setLoading(false); });
  }, [postagemId]); // eslint-disable-line

  // Realtime
  useEffect(() => {
    if (!postagemId) return;
    const ch = sb.channel(`chat-${postagemId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comentarios_postagens', filter: `postagem_id=eq.${postagemId}` },
        p => {
          const n = p.new as Comentario;
          if (n.moderado) return;
          setComentarios(prev => prev.some(c => c.id === n.id) ? prev : [...prev, n]);
        })
      .subscribe();
    return () => { sb.removeChannel(ch); };
  }, [postagemId]); // eslint-disable-line

  // Scroll
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [comentarios]);

  // Enviar
  const enviar = useCallback(async () => {
    const m = msg.trim();
    if (!m || !user || !apelido || enviando) return;
    setEnviando(true); setErro('');
    const tid = `t-${Date.now()}`;
    const ot: Comentario = { id: tid, postagem_id: postagemId, user_id: user.id, apelido, avatar_url: user.user_metadata?.avatar_url ?? null, avatar_emoji: emoji, mensagem: m, reacao, moderado: false, criado_em: new Date().toISOString() };
    setComentarios(p => [...p, ot]); setMsg(''); setReacao(null);
    const { error } = await sb.from('comentarios_postagens').insert({ postagem_id: postagemId, user_id: user.id, apelido, avatar_url: user.user_metadata?.avatar_url ?? null, avatar_emoji: emoji, mensagem: m, reacao });
    if (error) { setComentarios(p => p.filter(c => c.id !== tid)); setErro('Erro ao enviar. Tente novamente.'); setMsg(m); }
    setEnviando(false);
  }, [msg, user, apelido, emoji, postagemId, enviando, reacao, sb]);

  const denunciar = useCallback(async (cid: string) => {
    if (!user) return;
    await sb.from('chat_denuncias').insert({ comentario_id: cid, denunciante_id: user.id, motivo: 'Denúncia via portal' });
    setDenOk(cid); setTimeout(() => setDenOk(null), 3000);
  }, [user, sb]);

  return (
    <>
      <style>{`
        @keyframes fu { from { opacity:0;transform:translateY(7px) } to { opacity:1;transform:none } }
        .cs::-webkit-scrollbar{width:3px}
        .cs::-webkit-scrollbar-thumb{background:rgba(245,196,0,0.18);border-radius:9px}
      `}</style>

      {showModal && user && <ModalApelido user={user} onSalvar={salvarPerfil} />}

      <section style={{ marginTop: 56, fontFamily: "'Barlow Condensed',system-ui,sans-serif" }}>

        {/* Divisor */}
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(245,196,0,0.4),transparent)', marginBottom: 32 }} />

        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <p style={{ color: '#F5C400', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5em', margin: '0 0 6px' }}>Sua Voz Importa</p>
          <h3 style={{ color: '#fff', fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, margin: '0 0 6px' }}>
            Fala aí, <span style={{ color: '#F5C400' }}>Torcedor!</span>
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, margin: 0 }}>
            {comentarios.length} comentário{comentarios.length !== 1 ? 's' : ''} · Chat em tempo real
          </p>
        </div>

        {/* Box do chat */}
        <div style={{ background: 'linear-gradient(145deg,#0a0800,#050505)', border: '1px solid rgba(245,196,0,0.15)', borderRadius: 22, overflow: 'hidden' }}>
          <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,#F5C400,transparent)' }} />

          {/* Topo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 5px #22C55E' }} />
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                Chat ao vivo · Login Google obrigatório
              </span>
            </div>
            {user && apelido && (
              <button onClick={() => setShowModal(true)}
                style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(245,196,0,0.07)', border: '1px solid rgba(245,196,0,0.2)', borderRadius: 999, padding: '4px 10px', cursor: 'pointer', color: '#F5C400', fontSize: 10, fontWeight: 900 }}>
                <Av url={user.user_metadata?.avatar_url} emoji={emoji} size={18} />
                {apelido} ✏️
              </button>
            )}
          </div>

          {/* Mensagens */}
          <div className="cs" style={{ height: 380, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 13 }}>
            {loading && (
              <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', padding: '40px 0' }}>
                Carregando...
              </p>
            )}
            {!loading && comentarios.length === 0 && (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <p style={{ fontSize: 28, marginBottom: 8 }}>💬</p>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Seja o primeiro a comentar!</p>
              </div>
            )}
            {comentarios.map(c => <Bolha key={c.id} c={c} isMeu={user?.id === c.user_id} onDenunciar={denunciar} />)}
            {denOk && (
              <div style={{ textAlign: 'center', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 10, padding: '7px 12px' }}>
                <span style={{ color: '#EF4444', fontSize: 10, fontWeight: 900, textTransform: 'uppercase' }}>🚩 Denúncia enviada</span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input ou Login */}
          {!user ? (
            <TelaLogin onLogin={login} />
          ) : apelido ? (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.35)' }}>
              {/* Reações */}
              <div style={{ display: 'flex', gap: 5, padding: '8px 12px 0', overflowX: 'auto' }}>
                {REACOES.map(r => (
                  <button key={r.emoji} onClick={() => setReacao(p => p === r.emoji ? null : r.emoji)}
                    style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 9px', borderRadius: 999, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', background: reacao === r.emoji ? 'rgba(245,196,0,0.18)' : 'rgba(255,255,255,0.04)', border: `1px solid ${reacao === r.emoji ? 'rgba(245,196,0,0.45)' : 'rgba(255,255,255,0.06)'}`, color: reacao === r.emoji ? '#F5C400' : 'rgba(255,255,255,0.4)' }}>
                    {r.emoji} <span style={{ fontSize: 9 }}>{r.label}</span>
                  </button>
                ))}
              </div>
              {/* Campo */}
              <div style={{ display: 'flex', gap: 8, padding: '8px 12px 12px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea ref={inputRef} value={msg} onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
                    placeholder={`Fala aí, ${apelido}...`} disabled={enviando} maxLength={MAX} rows={2}
                    style={{ width: '100%', resize: 'none', background: 'rgba(255,255,255,0.04)', border: `1px solid ${MAX - msg.length < 40 ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '9px 12px', color: '#fff', fontSize: 13, lineHeight: 1.45, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                  {msg.length > 0 && (
                    <span style={{ position: 'absolute', bottom: 6, right: 8, fontSize: 9, fontWeight: 700, color: MAX - msg.length < 40 ? '#EF4444' : 'rgba(255,255,255,0.18)' }}>
                      {MAX - msg.length}
                    </span>
                  )}
                </div>
                <button onClick={enviar} disabled={enviando || !msg.trim()}
                  style={{ width: 42, height: 42, flexShrink: 0, background: 'linear-gradient(135deg,#F5C400,#D4A200)', border: 'none', borderRadius: 12, fontSize: 17, cursor: enviando || !msg.trim() ? 'not-allowed' : 'pointer', opacity: !msg.trim() ? 0.3 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(245,196,0,0.2)' }}>
                  {enviando ? '⏳' : '➤'}
                </button>
              </div>
              {erro && <p style={{ color: '#EF4444', fontSize: 11, fontWeight: 700, textAlign: 'center', padding: '0 12px 10px', margin: 0 }}>{erro}</p>}
            </div>
          ) : null}

          {/* WhatsApp CTA */}
          <a href="https://whatsapp.com/channel/0029VbCHacz2P59ioS22VU09" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 16px', background: 'rgba(37,211,102,0.08)', borderTop: '1px solid rgba(37,211,102,0.15)', color: '#22C55E', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>
            <svg viewBox="0 0 24 24" style={{ width: 14, fill: '#22C55E', flexShrink: 0 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Entre na Alcateia · Canal Oficial do WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
