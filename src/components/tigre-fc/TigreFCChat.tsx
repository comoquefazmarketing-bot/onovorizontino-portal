'use client';
// src/components/tigre-fc/TigreFCChat.tsx
// Chat do vestiário com sistema de patentes + RLS por nível

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ── Design tokens LED ─────────────────────────────────────
const C = {
  gold:   '#F5C400', cyan: '#00F3FF', red: '#FF2D55', purple: '#BF5FFF',
  glowGold:   '0 0 6px rgba(245,196,0,0.5)',
  glowCyan:   '0 0 6px rgba(0,243,255,0.5)',
  glowPurple: '0 0 6px rgba(191,95,255,0.5)',
};

// ── Patentes ──────────────────────────────────────────────
const PATENTES = [
  { nivel: 'Recruta',    num: 0, cor: 'rgba(255,255,255,0.3)',  bg: 'rgba(255,255,255,0.06)', escreve: false },
  { nivel: 'Torcedor',   num: 1, cor: '#F5C400',               bg: 'rgba(245,196,0,0.12)',   escreve: true },
  { nivel: 'Fanático',   num: 2, cor: '#00F3FF',               bg: 'rgba(0,243,255,0.1)',    escreve: true },
  { nivel: 'Ultras',     num: 3, cor: '#4FC3F7',               bg: 'rgba(79,195,247,0.1)',   escreve: true },
  { nivel: 'Fiel',       num: 4, cor: '#F5C400',               bg: 'rgba(245,196,0,0.15)',   escreve: true },
  { nivel: 'Comandante', num: 5, cor: '#BF5FFF',               bg: 'rgba(191,95,255,0.12)',  escreve: true },
] as const;

function getPatente(nivel: string) {
  return PATENTES.find(p => p.nivel === nivel) ?? PATENTES[0];
}

// ── Badge de patente ──────────────────────────────────────
function PatenteBadge({ nivel, size = 'sm' }: { nivel: string; size?: 'sm' | 'xs' }) {
  const p = getPatente(nivel);
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: size === 'xs' ? 9 : 10,
      fontWeight: 900, letterSpacing: '0.15em',
      padding: size === 'xs' ? '1px 5px' : '2px 7px',
      borderRadius: 4,
      background: p.bg,
      border: `1px solid ${p.cor}22`,
      color: p.cor,
      textShadow: p.num >= 4 ? `0 0 6px ${p.cor}` : 'none',
      fontFamily: "'Barlow Condensed',sans-serif",
    }}>
      {nivel.toUpperCase()}
    </span>
  );
}

// ── Avatar ────────────────────────────────────────────────
function Avatar({ src, nome, nivel, size = 32 }: { src?: string | null; nome: string; nivel: string; size?: number }) {
  const p = getPatente(nivel);
  const initials = nome.slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      border: `1.5px solid ${p.cor}44`,
      boxShadow: p.num >= 5 ? `0 0 8px ${p.cor}55` : 'none',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: src ? 'transparent' : p.bg,
      fontSize: size * 0.38, fontWeight: 900, color: p.cor,
      fontFamily: "'Barlow Condensed',sans-serif",
    }}>
      {src ? <img src={src} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  );
}

// ── Tipos ─────────────────────────────────────────────────
interface MsgRow {
  id: string;
  mensagem: string;
  tipo: string;
  criado_em: string;
  usuario_id: string;
  usuario: {
    id: string;
    apelido: string | null;
    nome: string | null;
    avatar_url: string | null;
    nivel: string;
    nivel_numerico: number;
  };
}

// DEPOIS
interface Props {
  usuarioId?:    string | null;
  usuarioNivel?: string | null; // ← adiciona isso
}

// ── Componente principal ──────────────────────────────────
export default function TigreFCChat({ usuarioId }: Props) {
  const [msgs,      setMsgs]      = useState<MsgRow[]>([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(true);
  const [sending,   setSending]   = useState(false);
  const [erro,      setErro]      = useState('');
  const [online,    setOnline]    = useState(0);
  const [meuNivel,  setMeuNivel]  = useState<typeof PATENTES[number] | null>(null);
  const [meuUser,   setMeuUser]   = useState<{ google_id: string; nivel: string; nivel_numerico: number } | null>(null);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  const scrollBottom = useCallback(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  // ── Carrega sessão e perfil ───────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: u } = await supabase
        .from('tigre_fc_usuarios')
        .select('id, nivel, nivel_numerico, google_id')
        .eq('google_id', session.user.id)
        .maybeSingle();
      if (u) {
        setMeuUser(u);
        setMeuNivel(getPatente(u.nivel));
      }
    });
  }, []);

  // ── Carrega mensagens iniciais ────────────────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('tigre_fc_chat_geral')
        .select(`
          id, mensagem, tipo, criado_em, usuario_id,
          usuario:usuario_id (
            id, apelido, nome, avatar_url, nivel, nivel_numerico
          )
        `)
        .eq('deletado', false)
        .order('criado_em', { ascending: true })
        .limit(60);
      if (data) setMsgs(data as unknown as MsgRow[]);
      setLoading(false);
      scrollBottom();
    }
    load();
  }, [scrollBottom]);

  // ── Realtime: novas mensagens ─────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('chat-vestiario')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tigre_fc_chat_geral' },
        async (payload) => {
          // Busca o usuário da nova mensagem
          const { data: u } = await supabase
            .from('tigre_fc_usuarios')
            .select('id, apelido, nome, avatar_url, nivel, nivel_numerico')
            .eq('id', payload.new.usuario_id)
            .maybeSingle();

          const nova: MsgRow = {
            ...(payload.new as any),
            usuario: u ?? {
              id: payload.new.usuario_id,
              apelido: null, nome: 'Torcedor',
              avatar_url: null, nivel: 'Recruta', nivel_numerico: 0,
            },
          };

          setMsgs(prev => {
            if (prev.find(m => m.id === nova.id)) return prev;
            return [...prev, nova];
          });
          scrollBottom();
        }
      )
      // Presence para contador online
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setOnline(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && usuarioId) {
          await channel.track({ usuario_id: usuarioId, online_at: new Date().toISOString() });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [usuarioId, scrollBottom]);

  // ── Envia mensagem ────────────────────────────────────
  const enviar = async () => {
    const txt = input.trim();
    if (!txt || sending || !meuUser) return;

    setErro('');
    setSending(true);

    const { data, error } = await supabase
      .rpc('fn_enviar_mensagem_chat', {
        p_google_id: meuUser.google_id,
        p_mensagem:  txt,
        p_tipo:      'texto',
      });

    setSending(false);

    if (error || data?.error) {
      const code = data?.error ?? 'erro_desconhecido';
      setErro(
        code === 'nivel_insuficiente' ? `Você precisa ser ${data?.precisa} para escrever.` :
        code === 'rate_limit'         ? 'Devagar aí! Espera uns segundos.' :
        code === 'usuario_banido'     ? 'Você está banido do chat.' :
        'Erro ao enviar. Tente novamente.'
      );
      return;
    }

    setInput('');
    inputRef.current?.focus();
  };

  // ── Formata hora ──────────────────────────────────────
  const hora = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const podeEscrever = meuNivel ? meuNivel.escreve : false;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: '#000', fontFamily: "'Barlow Condensed',Impact,sans-serif",
      position: 'relative',
    }}>

      <style>{`
        @keyframes msg-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes led-scan{0%{background-position:-200% center}100%{background-position:200% center}}
        .msg-row{animation:msg-in 0.25s ease}
        .chat-input::placeholder{color:rgba(255,255,255,0.2)}
        .chat-input:focus{outline:none;border-color:rgba(245,196,0,0.4)!important;background:rgba(245,196,0,0.04)!important}
      `}</style>

      {/* Scan bar topo */}
      <div style={{
        position:'absolute',top:0,left:0,right:0,height:1,zIndex:10,pointerEvents:'none',
        background:`linear-gradient(90deg,transparent,${C.gold},#fff,${C.cyan},transparent)`,
        backgroundSize:'200%', animation:'led-scan 3s linear infinite',
      }} />

      {/* Header */}
      <div style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'10px 14px',
        borderBottom:'1px solid rgba(245,196,0,0.1)',
        background:'rgba(245,196,0,0.03)',
        flexShrink: 0,
      }}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{width:6,height:6,borderRadius:'50%',background:'#22C55E',
            boxShadow:'0 0 6px #22C55E',display:'inline-block',animation:'pulse 1s ease-in-out infinite'}}/>
          <span style={{fontSize:11,fontWeight:900,letterSpacing:'0.3em',color:C.gold,textShadow:C.glowGold}}>
            VESTIÁRIO
          </span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          {online > 0 && (
            <span style={{fontSize:10,color:C.cyan,fontWeight:700,textShadow:C.glowCyan}}>
              {online} online
            </span>
          )}
          {meuNivel && <PatenteBadge nivel={meuNivel.nivel} size="xs" />}
        </div>
      </div>

      {/* Mensagens */}
      <div style={{
        flex:1, overflowY:'auto', padding:'10px 12px',
        display:'flex', flexDirection:'column', gap:10,
        scrollbarWidth:'none',
      }}>
        {loading ? (
          <div style={{textAlign:'center',color:'rgba(255,255,255,0.2)',fontSize:11,paddingTop:40}}>
            Carregando...
          </div>
        ) : msgs.length === 0 ? (
          <div style={{textAlign:'center',color:'rgba(255,255,255,0.2)',fontSize:11,paddingTop:40}}>
            Seja o primeiro a falar no vestiário
          </div>
        ) : (
          msgs.map(msg => {
            const u = msg.usuario;
            const nome = u.apelido ?? u.nome ?? 'Torcedor';
            const isMe = u.id === usuarioId;
            return (
              <div
                key={msg.id}
                className="msg-row"
                style={{
                  display:'flex', gap:8, alignItems:'flex-start',
                  flexDirection: isMe ? 'row-reverse' : 'row',
                }}
              >
                <Avatar src={u.avatar_url} nome={nome} nivel={u.nivel ?? 'Recruta'} />
                <div style={{ maxWidth:'75%', minWidth:0 }}>
                  <div style={{
                    display:'flex', alignItems:'center', gap:6,
                    marginBottom:3, flexWrap:'wrap',
                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                  }}>
                    <span style={{
                      fontSize:11, fontWeight:900,
                      color: isMe ? C.gold : '#fff',
                      textShadow: isMe ? C.glowGold : 'none',
                    }}>
                      {isMe ? 'Você' : nome}
                    </span>
                    <PatenteBadge nivel={u.nivel ?? 'Recruta'} size="xs" />
                    <span style={{fontSize:10,color:'rgba(255,255,255,0.2)'}}>{hora(msg.criado_em)}</span>
                  </div>
                  <div style={{
                    fontSize:13, lineHeight:1.45,
                    background: isMe
                      ? 'rgba(245,196,0,0.08)'
                      : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isMe ? 'rgba(245,196,0,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    borderRadius: isMe ? '10px 2px 10px 10px' : '2px 10px 10px 10px',
                    padding:'8px 10px',
                    color: isMe ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.65)',
                    wordBreak: 'break-word',
                  }}>
                    {msg.mensagem}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        borderTop:'1px solid rgba(245,196,0,0.1)',
        padding:'10px 12px',
        background:'rgba(0,0,0,0.6)',
        flexShrink: 0,
      }}>
        {!meuUser ? (
          <div style={{
            textAlign:'center', fontSize:11, color:'rgba(255,255,255,0.25)',
            padding:'6px', letterSpacing:'0.1em',
          }}>
            <a href="/login" style={{color:C.gold,textDecoration:'none',textShadow:C.glowGold}}>
              Entre com Google
            </a>
            {' '}para participar do vestiário
          </div>
        ) : !podeEscrever ? (
          <div style={{
            display:'flex',alignItems:'center',gap:8,
            fontSize:11,color:'rgba(255,255,255,0.2)',
            justifyContent:'center',padding:'4px',
          }}>
            <span>Acumule 50 pts para escrever no chat</span>
          </div>
        ) : (
          <>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <input
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={e => { setInput(e.target.value); setErro(''); }}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), enviar())}
                placeholder="Manda a sua..."
                maxLength={280}
                disabled={sending}
                style={{
                  flex:1,
                  background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(245,196,0,0.18)',
                  borderRadius:8,
                  color:'#fff',
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:14, fontWeight:600,
                  padding:'9px 12px',
                  transition:'border-color 0.2s,background 0.2s',
                }}
              />
              <button
                onClick={enviar}
                disabled={sending || !input.trim()}
                style={{
                  background: input.trim()
                    ? `linear-gradient(135deg,${C.gold},#D4A200)`
                    : 'rgba(255,255,255,0.06)',
                  border:'none',
                  borderRadius:8,
                  color: input.trim() ? '#000' : 'rgba(255,255,255,0.2)',
                  fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:12, fontWeight:900,
                  letterSpacing:'0.15em',
                  padding:'9px 16px',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition:'all 0.2s',
                  boxShadow: input.trim() ? C.glowGold : 'none',
                  whiteSpace:'nowrap',
                }}
              >
                {sending ? '...' : 'ENVIAR'}
              </button>
            </div>
            <div style={{
              display:'flex', justifyContent:'space-between',
              marginTop:5, paddingLeft:2,
            }}>
              {erro ? (
                <span style={{fontSize:10,color:C.red,letterSpacing:'0.05em'}}>{erro}</span>
              ) : (
                <span style={{fontSize:10,color:'rgba(255,255,255,0.15)'}}>
                  {meuNivel?.nivel === 'Fanático' || (meuNivel?.num ?? 0) >= 2
                    ? 'texto · emotes desbloqueados'
                    : 'texto'}
                </span>
              )}
              <span style={{fontSize:10,color:'rgba(255,255,255,0.12)'}}>{input.length}/280</span>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
