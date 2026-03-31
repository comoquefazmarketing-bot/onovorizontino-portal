'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const NIVEL_ICON: Record<string,string>  = { Novato:'🌱', Fiel:'⚡', Garra:'🔥', Lenda:'🐯' };
const NIVEL_COLOR: Record<string,string> = { Novato:'#6b7280', Fiel:'#F5C400', Garra:'#F5C400', Lenda:'#FFD700' };

type Props = { usuarioId?: string | null; usuarioNivel?: string };

export default function TigreFCChat({ usuarioId, usuarioNivel }: Props) {
  const [msgs, setMsgs]       = useState<any[]>([]);
  const [texto, setTexto]     = useState('');
  const [enviando, setEnv]    = useState(false);
  const [loading, setLoad]    = useState(true);
  const [erro, setErro]       = useState(''); // FIX 4: mostra erro
  const endRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // FIX 4: tratamento de erro explícito
    supabase.from('tigre_fc_chat_geral')
      .select('*, usuario:usuario_id(apelido,nome,avatar_url,nivel)')
      .order('criado_em', { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (error) {
          setErro('Chat temporariamente indisponível.');
          console.error('Chat error:', error.message);
        } else {
          setMsgs((data || []).reverse());
        }
        setLoad(false);
      });

    // Realtime
    const channel = supabase.channel('chat-geral')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'tigre_fc_chat_geral' },
        async (payload) => {
          const { data } = await supabase.from('tigre_fc_chat_geral')
            .select('*, usuario:usuario_id(apelido,nome,avatar_url,nivel)')
            .eq('id', payload.new.id).single();
          if (data) setMsgs(prev => [...prev, data]);
        }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const enviar = async () => {
    if (!texto.trim() || !usuarioId || enviando) return;
    setEnv(true);
    const { error } = await supabase.from('tigre_fc_chat_geral')
      .insert({ usuario_id: usuarioId, mensagem: texto.trim() });
    if (!error) setTexto('');
    setEnv(false);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:'#080808' }}>

      <div style={{ padding:'12px 16px', borderBottom:'1px solid #111', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background: erro?'#ef4444':'#4ade80' }} />
        <div style={{ fontSize:13, fontWeight:900, color:'#fff', textTransform:'uppercase', letterSpacing:1 }}>Chat da Torcida</div>
        <div style={{ marginLeft:'auto', fontSize:10, color:'#555' }}>{msgs.length} msgs</div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'12px 16px', display:'flex', flexDirection:'column', gap:10 }}>
        {loading ? (
          <div style={{ textAlign:'center', color:'#555', fontSize:13, paddingTop:20 }}>Carregando chat...</div>
        ) : erro ? (
          <div style={{ textAlign:'center', color:'#f87171', fontSize:13, paddingTop:20 }}>{erro}</div>
        ) : msgs.length === 0 ? (
          <div style={{ textAlign:'center', color:'#333', fontSize:13, paddingTop:20 }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🐯</div>
            Nenhuma mensagem ainda. Começa a resenha!
          </div>
        ) : msgs.map((msg: any) => {
          const u = msg.usuario;
          const isMe = msg.usuario_id === usuarioId;
          const cor = NIVEL_COLOR[u?.nivel] || '#555';
          const isLenda = u?.nivel === 'Lenda';
          return (
            <div key={msg.id} style={{ display:'flex', gap:8, alignItems:'flex-start', flexDirection: isMe ? 'row-reverse' : 'row' }}>
              {u?.avatar_url ? (
                <img src={u.avatar_url} style={{ width:30, height:30, borderRadius:'50%', border:`1.5px solid ${cor}`, objectFit:'cover', flexShrink:0 }} />
              ) : (
                <div style={{ width:30, height:30, borderRadius:'50%', background: isLenda?'#FFD700':cor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#111', flexShrink:0 }}>
                  {(u?.apelido||u?.nome||'?').charAt(0)}
                </div>
              )}
              <div style={{ maxWidth:'72%', background: isLenda?'linear-gradient(135deg,#1a1200,#111)':isMe?'#1a1a1a':'#111', border: isLenda?'1px solid #FFD70040':isMe?'1px solid #222':'1px solid #1a1a1a', borderRadius: isMe?'12px 2px 12px 12px':'2px 12px 12px 12px', padding:'8px 12px', boxShadow: isLenda?'0 0 8px rgba(255,215,0,0.15)':'none' }}>
                <div style={{ fontSize:10, fontWeight:900, color:cor, marginBottom:3, display:'flex', alignItems:'center', gap:4 }}>
                  {NIVEL_ICON[u?.nivel]} {u?.apelido || u?.nome}
                  {isLenda && <span>👑</span>}
                </div>
                <div style={{ fontSize:13, color:'#ccc', lineHeight:1.5, wordBreak:'break-word' }}>{msg.mensagem}</div>
                <div style={{ fontSize:9, color:'#333', marginTop:4, textAlign: isMe?'left':'right' }}>
                  {new Date(msg.criado_em).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div style={{ padding:'10px 16px 16px', borderTop:'1px solid #111', flexShrink:0, background:'#0a0a0a' }}>
        {usuarioId ? (
          <div style={{ display:'flex', gap:8 }}>
            <input value={texto} onChange={e => setTexto(e.target.value.slice(0,300))}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
              placeholder="Fala, torcedor... 🐯"
              style={{ flex:1, padding:'10px 14px', background:'#111', border:'1px solid #222', borderRadius:20, color:'#fff', fontSize:14, outline:'none' }} />
            <button onClick={enviar} disabled={!texto.trim() || enviando}
              style={{ width:42, height:42, borderRadius:'50%', background: texto.trim()?'#F5C400':'#1a1a1a', color: texto.trim()?'#111':'#444', border:'none', fontWeight:900, fontSize:16, cursor: texto.trim()?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {enviando ? '…' : '↑'}
            </button>
          </div>
        ) : (
          <div style={{ textAlign:'center', fontSize:12, color:'#555', padding:'8px 0' }}>
            Entre para participar da resenha
          </div>
        )}
      </div>
    </div>
  );
}
