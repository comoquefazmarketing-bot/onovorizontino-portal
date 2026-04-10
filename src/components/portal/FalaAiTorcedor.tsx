'use client';

/**
 * FalaAiTorcedor v2 — Chat Público com Login Google
 *
 * - Leitura pública (sem login)
 * - Escrita autenticada (Google obrigatório)
 * - Identificação real via auth.uid() → moderação segura
 * - Denúncia de comentários por usuários logados
 * - Realtime via Supabase postgres_changes
 * - Insert otimista + rollback em erro
 */

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

const EMOJIS_AVATAR = ['🐯','⚽','🔥','🏆','💛','🦁','📯','⚡','🎯','👊','🐾','🎽'];
const REACOES       = [
  { emoji: '🔥', label: 'Queimou'  },
  { emoji: '💛', label: 'É o Tigre' },
  { emoji: '📯', label: 'Corneta'  },
  { emoji: '👊', label: 'Concordo' },
];
const MAX_CHARS     = 280;
const LOAD_LIMIT    = 60;
const STORAGE_EMOJI = 'torcedor_emoji';
const STORAGE_APEL  = 'torcedor_apelido';

// ─── Helpers ──────────────────────────────────────────────────

function tempoRelativo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)    return 'agora';
  if (s < 3600)  return `${Math.floor(s/60)}min`;
  if (s < 86400) return `${Math.floor(s/3600)}h`;
  return new Date(iso).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' });
}

function Avatar({ url, emoji, size = 36 }: { url?: string|null; emoji: string; size?: number }) {
  const [err, setErr] = useState(false);
  if (url && !err) return (
    <img src={url} alt="" onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(245,196,0,0.1)', border: '1px solid rgba(245,196,0,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.5,
    }}>{emoji}</div>
  );
}

// ─── Bolha de Comentário ──────────────────────────────────────

function Bolha({ c, isMeu, onDenunciar }: {
  c: Comentario; isMeu: boolean; onDenunciar: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div style={{ display:'flex', flexDirection: isMeu?'row-reverse':'row', gap:8, alignItems:'flex-end', animation:'fadeUp 0.22s ease-out' }}>
      <Avatar url={c.avatar_url} emoji={c.avatar_emoji} size={34} />

      <div style={{ maxWidth:'76%', display:'flex', flexDirection:'column', gap:3, alignItems: isMeu?'flex-end':'flex-start' }}>
        {/* Nome + tempo */}
        <div style={{ display:'flex', alignItems:'center', gap:6, flexDirection: isMeu?'row-reverse':'row' }}>
          <span style={{ fontSize:10, fontWeight:900, color: isMeu?'#F5C400':'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.08em' }}>
            {c.apelido}
          </span>
          <span style={{ fontSize:9, color:'rgba(255,255,255,0.18)', fontWeight:600 }}>
            {tempoRelativo(c.criado_em)}
          </span>
        </div>

        {/* Mensagem */}
        <div
          onDoubleClick={() => !isMeu && setShowMenu(v => !v)}
          style={{
            background: isMeu
              ? 'linear-gradient(135deg,rgba(245,196,0,0.18),rgba(245,196,0,0.08))'
              : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isMeu?'rgba(245,196,0,0.28)':'rgba(255,255,255,0.06)'}`,
            borderRadius: isMeu?'18px 18px 4px 18px':'18px 18px 18px 4px',
            padding:'10px 14px', color: isMeu?'#fff':'rgba(255,255,255,0.85)',
            fontSize:14, lineHeight:1.5, wordBreak:'break-word', cursor:'default',
          }}
        >
          {c.mensagem}
        </div>

        {/* Reação */}
        {c.reacao && (
          <div style={{ fontSize:11, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:999, padding:'2px 8px', display:'inline-flex', alignItems:'center', gap:3 }}>
            {c.reacao}
          </div>
        )}

        {/* Menu de denúncia */}
        {showMenu && !isMeu && (
          <button onClick={() => { onDenunciar(c.id); setShowMenu(false); }}
            style={{
              display:'flex', alignItems:'center', gap:5, background:'rgba(239,68,68,0.1)',
              border:'1px solid rgba(239,68,68,0.25)', borderRadius:8, padding:'4px 10px',
              color:'#EF4444', fontSize:10, fontWeight:900, cursor:'pointer',
              textTransform:'uppercase', letterSpacing:'0.1em',
            }}>
            🚩 Denunciar
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Tela de Login ────────────────────────────────────────────

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{
      background:'linear-gradient(145deg,rgba(10,8,0,0.98),rgba(5,5,5,0.98))',
      borderRadius:20, padding:'28px 24px', textAlign:'center',
      border:'1px solid rgba(245,196,0,0.15)',
    }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🐯</div>
      <h4 style={{ color:'#fff', fontSize:18, fontWeight:900, fontStyle:'italic', textTransform:'uppercase', margin:'0 0 6px' }}>
        Entre na Conversa
      </h4>
      <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, margin:'0 0 20px', lineHeight:1.5 }}>
        Para comentar, faça login com o Google.<br/>
        É gratuito, rápido e garante um chat mais seguro para todos.
      </p>
      <button onClick={onLogin}
        style={{
          display:'inline-flex', alignItems:'center', gap:10,
          background:'#fff', color:'#111', fontWeight:900, fontSize:13,
          textTransform:'uppercase', letterSpacing:'0.08em',
          padding:'13px 24px', borderRadius:12, border:'none', cursor:'pointer',
          boxShadow:'0 4px 20px rgba(255,255,255,0.1)',
        }}
      >
        <svg viewBox="0 0 24 24" style={{ width:18 }}>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Entrar com Google
      </button>
      <p style={{ color:'rgba(255,255,255,0.18)', fontSize:10, margin:'14px 0 0', fontWeight:600 }}>
        Quem não faz login ainda pode ler todos os comentários 👁️
      </p>
    </div>
  );
}

// ─── Modal de primeiro acesso — escolhe apelido ───────────────

function ModalApelido({ user, onSalvar }: { user: User; onSalvar: (apelido: string, emoji: string) => void }) {
  const nome  = user.user_metadata?.full_name?.split(' ')[0] ?? '';
  const [apelido, setApelido] = useState(nome);
  const [emoji,   setEmoji]   = useState('🐯');
  const [erro,    setErro]    = useState('');

  const salvar = () => {
    const a = apelido.trim();
    if (a.length < 2)  { setErro('Mínimo 2 caracteres'); return; }
    if (a.length > 30) { setErro('Máximo 30 caracteres'); return; }
    onSalvar(a, emoji);
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'rgba(0,0,0,0.88)', backdropFilter:'blur(10px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:20,
    }}>
      <div style={{ background:'#0a0800', border:'1px solid rgba(245,196,0,0.3)', borderRadius:24, padding:28, maxWidth:340, width:'100%', textAlign:'center' }}>
        <div style={{ fontSize:48, marginBottom:12 }}>{emoji}</div>
        <h4 style={{ color:'#fff', fontSize:20, fontWeight:900, fontStyle:'italic', textTransform:'uppercase', margin:'0 0 4px' }}>
          Quase lá, Torcedor!
        </h4>
        <p style={{ color:'rgba(255,255,255,0.4)', fontSize:12, margin:'0 0 20px' }}>
          Escolha como vai aparecer no chat
        </p>

        {/* Emojis */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center', marginBottom:18 }}>
          {EMOJIS_AVATAR.map(e => (
            <button key={e} onClick={() => setEmoji(e)} style={{
              width:40, height:40, borderRadius:10, fontSize:20,
              background: emoji===e?'rgba(245,196,0,0.2)':'rgba(255,255,255,0.04)',
              border:`2px solid ${emoji===e?'rgba(245,196,0,0.6)':'rgba(255,255,255,0.05)'}`,
              cursor:'pointer',
            }}>{e}</button>
          ))}
        </div>

        {/* Input */}
        <input value={apelido} onChange={e => { setApelido(e.target.value); setErro(''); }}
          onKeyDown={e => e.key==='Enter' && salvar()}
          placeholder="Seu apelido no chat"
          maxLength={30}
          style={{
            width:'100%', background:'rgba(255,255,255,0.05)',
            border:'1px solid rgba(255,255,255,0.1)', borderRadius:10,
            padding:'11px 14px', color:'#fff', fontSize:14, outline:'none',
            marginBottom: erro?6:14, boxSizing:'border-box',
          }}
        />
        {erro && <p style={{ color:'#EF4444', fontSize:11, fontWeight:700, margin:'0 0 10px' }}>{erro}</p>}

        <button onClick={salvar} style={{
          width:'100%', padding:'13px', background:'linear-gradient(135deg,#F5C400,#D4A200)',
          color:'#000', fontWeight:900, fontSize:13, textTransform:'uppercase',
          letterSpacing:'0.1em', border:'none', borderRadius:12, cursor:'pointer',
        }}>
          Entrar no Chat 🐯
        </button>
      </div>
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────

export default function FalaAiTorcedor({ postagemId }: { postagemId: string }) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [user,          setUser]          = useState<User | null>(null);
  const [apelido,       setApelido]        = useState<string | null>(null);
  const [avatarEmoji,   setAvatarEmoji]    = useState('🐯');
  const [showApelido,   setShowApelido]    = useState(false);
  const [comentarios,   setComentarios]   = useState<Comentario[]>([]);
  const [mensagem,      setMensagem]       = useState('');
  const [reacaoAtiva,   setReacaoAtiva]    = useState<string | null>(null);
  const [enviando,      setEnviando]       = useState(false);
  const [erro,          setErro]           = useState('');
  const [isLoading,     setIsLoading]      = useState(true);
  const [denunciaOk,    setDenunciaOk]     = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);
  const charsRestantes = MAX_CHARS - mensagem.length;

  // ── Sessão ────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) return;
      setUser(session.user);
      const a = localStorage.getItem(STORAGE_APEL);
      const e = localStorage.getItem(STORAGE_EMOJI) ?? '🐯';
      if (a) { setApelido(a); setAvatarEmoji(e); }
      else setShowApelido(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line

  // ── Login Google ──────────────────────────────────────────
  const loginGoogle = useCallback(() => {
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.href },
    });
  }, [supabase]);

  // ── Salva apelido ─────────────────────────────────────────
  const salvarApelido = useCallback((a: string, e: string) => {
    localStorage.setItem(STORAGE_APEL, a);
    localStorage.setItem(STORAGE_EMOJI, e);
    setApelido(a); setAvatarEmoji(e);
    setShowApelido(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // ── Carrega comentários ───────────────────────────────────
  useEffect(() => {
    if (!postagemId) return;
    setIsLoading(true);
    supabase
      .from('comentarios_postagens')
      .select('*')
      .eq('postagem_id', postagemId)
      .eq('moderado', false)
      .order('criado_em', { ascending: true })
      .limit(LOAD_LIMIT)
      .then(({ data }) => { if (data) setComentarios(data as Comentario[]); setIsLoading(false); });
  }, [postagemId]); // eslint-disable-line

  // ── Realtime ──────────────────────────────────────────────
  useEffect(() => {
    if (!postagemId) return;
    const ch = supabase
      .channel(`chat-${postagemId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public',
        table: 'comentarios_postagens',
        filter: `postagem_id=eq.${postagemId}`,
      }, payload => {
        const novo = payload.new as Comentario;
        if (novo.moderado) return;
        setComentarios(prev =>
          prev.some(c => c.id === novo.id) ? prev : [...prev, novo]
        );
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [postagemId]); // eslint-disable-line

  // ── Auto-scroll ───────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comentarios]);

  // ── Enviar ────────────────────────────────────────────────
  const enviar = useCallback(async () => {
    const msg = mensagem.trim();
    if (!msg || !user || !apelido || enviando) return;

    setEnviando(true); setErro('');
    const tempId = `temp-${Date.now()}`;
    const otimista: Comentario = {
      id: tempId, postagem_id: postagemId, user_id: user.id,
      apelido, avatar_url: user.user_metadata?.avatar_url ?? null,
      avatar_emoji: avatarEmoji, mensagem: msg,
      reacao: reacaoAtiva, moderado: false,
      criado_em: new Date().toISOString(),
    };
    setComentarios(prev => [...prev, otimista]);
    setMensagem(''); setReacaoAtiva(null);

    const { error } = await supabase.from('comentarios_postagens').insert({
      postagem_id: postagemId, user_id: user.id,
      apelido, avatar_url: user.user_metadata?.avatar_url ?? null,
      avatar_emoji: avatarEmoji, mensagem: msg, reacao: reacaoAtiva,
    });

    if (error) {
      setComentarios(prev => prev.filter(c => c.id !== tempId));
      setErro('Não foi possível enviar. Tente novamente.');
      setMensagem(msg);
    }
    setEnviando(false);
  }, [mensagem, user, apelido, avatarEmoji, postagemId, enviando, reacaoAtiva, supabase]);

  // ── Denunciar ─────────────────────────────────────────────
  const denunciar = useCallback(async (comentarioId: string) => {
    if (!user) return;
    await supabase.from('chat_denuncias').insert({
      comentario_id: comentarioId,
      denunciante_id: user.id,
      motivo: 'Denúncia do usuário via portal',
    });
    setDenunciaOk(comentarioId);
    setTimeout(() => setDenunciaOk(null), 3000);
  }, [user, supabase]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); }
  };

  // ── RENDER ────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .chat-area::-webkit-scrollbar { width:3px; }
        .chat-area::-webkit-scrollbar-thumb { background:rgba(245,196,0,0.2); border-radius:10px; }
      `}</style>

      {showApelido && user && <ModalApelido user={user} onSalvar={salvarApelido} />}

      <section style={{ marginTop:64, fontFamily:"'Barlow Condensed',system-ui,sans-serif" }}>

        {/* Divisor */}
        <div style={{ height:1, background:'linear-gradient(90deg,transparent,rgba(245,196,0,0.4),transparent)', marginBottom:36 }} />

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:20 }}>
          <p style={{ color:'#F5C400', fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.5em', margin:'0 0 6px' }}>
            Chat da Torcida
          </p>
          <h3 style={{ color:'#fff', fontSize:'clamp(24px,5vw,36px)', fontWeight:900, fontStyle:'italic', textTransform:'uppercase', letterSpacing:'-0.03em', lineHeight:1, margin:'0 0 8px' }}>
            Fala aí, <span style={{ color:'#F5C400' }}>Torcedor!</span>
          </h3>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#22C55E', boxShadow:'0 0 6px #22C55E' }} />
            <span style={{ color:'rgba(255,255,255,0.35)', fontSize:11, fontWeight:700 }}>
              {comentarios.length} comentário{comentarios.length !== 1?'s':''} · Identificados pelo Google
            </span>
          </div>
        </div>

        {/* Box do chat */}
        <div style={{
          background:'linear-gradient(145deg,#0a0800,#050505)',
          border:'1px solid rgba(245,196,0,0.15)', borderRadius:24, overflow:'hidden',
        }}>
          <div style={{ height:2, background:'linear-gradient(90deg,transparent,#F5C400,transparent)' }} />

          {/* Header interno */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:'rgba(245,196,0,0.02)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:16 }}>🔒</span>
              <div>
                <p style={{ color:'rgba(255,255,255,0.5)', fontSize:9, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', margin:0 }}>
                  Chat seguro · Login obrigatório para comentar
                </p>
              </div>
            </div>
            {user && apelido && (
              <button onClick={() => setShowApelido(true)} style={{
                display:'flex', alignItems:'center', gap:6,
                background:'rgba(245,196,0,0.08)', border:'1px solid rgba(245,196,0,0.2)',
                borderRadius:999, padding:'4px 12px', cursor:'pointer',
                color:'#F5C400', fontSize:10, fontWeight:900,
              }}>
                <Avatar url={user.user_metadata?.avatar_url} emoji={avatarEmoji} size={20} />
                {apelido} ✏️
              </button>
            )}
          </div>

          {/* Área de mensagens */}
          <div className="chat-area" style={{ height:400, overflowY:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:14 }}>

            {isLoading && (
              <div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.2)' }}>
                <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.2em' }}>Carregando o papo...</p>
              </div>
            )}

            {!isLoading && comentarios.length === 0 && (
              <div style={{ textAlign:'center', padding:'40px 0' }}>
                <p style={{ fontSize:30, marginBottom:10 }}>💬</p>
                <p style={{ color:'rgba(255,255,255,0.25)', fontSize:13, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.15em', margin:0 }}>
                  Seja o primeiro a comentar!
                </p>
              </div>
            )}

            {comentarios.map(c => (
              <Bolha key={c.id} c={c}
                isMeu={user?.id === c.user_id}
                onDenunciar={denunciar}
              />
            ))}

            {denunciaOk && (
              <div style={{ textAlign:'center', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, padding:'8px 14px' }}>
                <span style={{ color:'#EF4444', fontSize:11, fontWeight:900, textTransform:'uppercase' }}>🚩 Denúncia enviada — nossa equipe vai analisar</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── INPUT ou LOGIN ── */}
          {!user ? (
            <div style={{ padding:'16px' }}>
              <LoginPrompt onLogin={loginGoogle} />
            </div>
          ) : !apelido ? null : (
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', background:'rgba(0,0,0,0.4)' }}>
              {/* Reações */}
              <div style={{ display:'flex', gap:5, padding:'8px 14px 0', overflowX:'auto' }}>
                {REACOES.map(r => (
                  <button key={r.emoji} onClick={() => setReacaoAtiva(p => p===r.emoji?null:r.emoji)}
                    style={{
                      display:'flex', alignItems:'center', gap:4, padding:'4px 10px',
                      borderRadius:999, fontSize:12, fontWeight:700, whiteSpace:'nowrap', flexShrink:0, cursor:'pointer',
                      background: reacaoAtiva===r.emoji?'rgba(245,196,0,0.2)':'rgba(255,255,255,0.04)',
                      border:`1px solid ${reacaoAtiva===r.emoji?'rgba(245,196,0,0.5)':'rgba(255,255,255,0.06)'}`,
                      color: reacaoAtiva===r.emoji?'#F5C400':'rgba(255,255,255,0.45)',
                    }}
                  >{r.emoji} <span style={{ fontSize:9 }}>{r.label}</span></button>
                ))}
              </div>

              {/* Campo + enviar */}
              <div style={{ display:'flex', gap:8, padding:'8px 14px 12px', alignItems:'flex-end' }}>
                <div style={{ flex:1, position:'relative' }}>
                  <textarea ref={inputRef} value={mensagem} onChange={e => setMensagem(e.target.value)}
                    onKeyDown={handleKey}
                    placeholder={`Fala aí, ${apelido}... (Enter envia)`}
                    disabled={enviando} maxLength={MAX_CHARS} rows={2}
                    style={{
                      width:'100%', resize:'none', background:'rgba(255,255,255,0.04)',
                      border:`1px solid ${charsRestantes<40?'rgba(239,68,68,0.4)':'rgba(255,255,255,0.08)'}`,
                      borderRadius:12, padding:'9px 12px', color:'#fff', fontSize:13,
                      lineHeight:1.45, outline:'none', boxSizing:'border-box', fontFamily:'inherit',
                    }}
                  />
                  {mensagem.length > 0 && (
                    <span style={{ position:'absolute', bottom:6, right:8, fontSize:9, fontWeight:700, color: charsRestantes<40?'#EF4444':'rgba(255,255,255,0.2)' }}>
                      {charsRestantes}
                    </span>
                  )}
                </div>
                <button onClick={enviar} disabled={enviando||!mensagem.trim()}
                  style={{
                    width:44, height:44, flexShrink:0,
                    background: enviando?'rgba(245,196,0,0.3)':'linear-gradient(135deg,#F5C400,#D4A200)',
                    border:'none', borderRadius:12, fontSize:18, cursor: (enviando||!mensagem.trim())?'not-allowed':'pointer',
                    opacity: !mensagem.trim()?0.35:1, display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:'0 4px 14px rgba(245,196,0,0.2)',
                  }}
                >
                  {enviando ? '⏳' : '➤'}
                </button>
              </div>

              {erro && <p style={{ color:'#EF4444', fontSize:11, fontWeight:700, textAlign:'center', padding:'0 14px 10px', margin:0 }}>{erro}</p>}
            </div>
          )}

          {/* Canal WhatsApp */}
          <div style={{ borderTop:'1px solid rgba(255,255,255,0.04)', padding:'12px 16px', background:'rgba(37,211,102,0.02)' }}>
            <a href="https://whatsapp.com/channel/0029VbCHacz2P59ioS22VU09"
              target="_blank" rel="noopener noreferrer"
              style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                padding:'10px 18px', borderRadius:12,
                background:'rgba(37,211,102,0.1)', border:'1px solid rgba(37,211,102,0.25)',
                color:'#22C55E', fontSize:11, fontWeight:900,
                textTransform:'uppercase', letterSpacing:'0.1em', textDecoration:'none',
              }}
            >
              <svg viewBox="0 0 24 24" style={{ width:13, fill:'#22C55E', flexShrink:0 }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Entre na Alcateia · Canal Oficial
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
