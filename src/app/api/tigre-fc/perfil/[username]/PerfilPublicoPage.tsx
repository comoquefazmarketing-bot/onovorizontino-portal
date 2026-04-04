'use client';
/**
 * Perfil Público do Torcedor + Área da Corneta
 * Rota: /tigre-fc/perfil/[username]
 *
 * Exibe:
 * - Avatar, nível, XP, posição no ranking
 * - Campo com a escalação atual (cards verticais FIFA com pose de celebração)
 * - Histórico de pontuações (5 rodadas)
 * - Área da Corneta (comentários de zoeira)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence }   from 'framer-motion';
import { createBrowserClient }       from '@supabase/ssr';
import { useParams, useRouter }      from 'next/navigation';

// ─── Assets ──────────────────────────────────────────────────────────────────
const BASE    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── Types ────────────────────────────────────────────────────────────────────
type Player = { id: number; short: string; pos: string; foto: string; num: number };
type Slot   = { id: string; x: number; y: number; pos: string };

const POS_COLORS: Record<string, string> = {
  GOL: '#F5C400', ZAG: '#3B82F6', LAT: '#06B6D4', MEI: '#22C55E', ATA: '#EF4444',
};
const NIVEL_CORES: Record<string, string> = {
  Novato: '#71717A', Torcedor: '#3B82F6', Fiel: '#F5C400', Fanático: '#EF4444', Lenda: '#9333EA',
};
const NIVEL_ICONES: Record<string, string> = {
  Novato: '🌱', Torcedor: '👟', Fiel: '🏆', Fanático: '🔥', Lenda: '👑',
};

const FORMACAO_SLOTS: Record<string, Slot[]> = {
  '4-2-3-1': [
    {id:'gk',x:50,y:88,pos:'GOL'},{id:'rb',x:87,y:72,pos:'LAT'},{id:'cb1',x:64,y:78,pos:'ZAG'},
    {id:'cb2',x:36,y:78,pos:'ZAG'},{id:'lb',x:13,y:72,pos:'LAT'},{id:'dm1',x:34,y:57,pos:'MEI'},
    {id:'dm2',x:66,y:57,pos:'MEI'},{id:'am',x:50,y:40,pos:'MEI'},{id:'rw',x:85,y:25,pos:'ATA'},
    {id:'lw',x:15,y:25,pos:'ATA'},{id:'st',x:50,y:11,pos:'ATA'},
  ],
  '4-3-3': [
    {id:'gk',x:50,y:88,pos:'GOL'},{id:'rb',x:87,y:72,pos:'LAT'},{id:'cb1',x:64,y:78,pos:'ZAG'},
    {id:'cb2',x:36,y:78,pos:'ZAG'},{id:'lb',x:13,y:72,pos:'LAT'},{id:'m1',x:50,y:54,pos:'MEI'},
    {id:'m2',x:76,y:46,pos:'MEI'},{id:'m3',x:24,y:46,pos:'MEI'},{id:'st',x:50,y:11,pos:'ATA'},
    {id:'rw',x:83,y:20,pos:'ATA'},{id:'lw',x:17,y:20,pos:'ATA'},
  ],
  '4-4-2': [
    {id:'gk',x:50,y:88,pos:'GOL'},{id:'rb',x:87,y:72,pos:'LAT'},{id:'cb1',x:64,y:78,pos:'ZAG'},
    {id:'cb2',x:36,y:78,pos:'ZAG'},{id:'lb',x:13,y:72,pos:'LAT'},{id:'rm',x:83,y:50,pos:'MEI'},
    {id:'cm1',x:60,y:54,pos:'MEI'},{id:'cm2',x:40,y:54,pos:'MEI'},{id:'lm',x:17,y:50,pos:'MEI'},
    {id:'st1',x:37,y:15,pos:'ATA'},{id:'st2',x:63,y:15,pos:'ATA'},
  ],
  '3-5-2': [
    {id:'gk',x:50,y:88,pos:'GOL'},{id:'cb1',x:50,y:78,pos:'ZAG'},{id:'cb2',x:74,y:74,pos:'ZAG'},
    {id:'cb3',x:26,y:74,pos:'ZAG'},{id:'rm',x:91,y:56,pos:'LAT'},{id:'lm',x:9,y:56,pos:'LAT'},
    {id:'m1',x:50,y:54,pos:'MEI'},{id:'m2',x:70,y:43,pos:'MEI'},{id:'m3',x:30,y:43,pos:'MEI'},
    {id:'st1',x:37,y:15,pos:'ATA'},{id:'st2',x:63,y:15,pos:'ATA'},
  ],
};

const CORNETA_EMOJIS = ['🎺','😂','🔥','🐔','👀','💀','🤡','😤','🙈','⚽'];
const CORNETA_SUGESTOES = [
  'Que escalação horrível! 😂',
  'Isso vai perder fácil!',
  'Meu time bate esse aí dormindo 😴',
  'Capitão errado!! 🙈',
  'Esse herói vai tomar gol kkkk',
  'Copia minha escalação! 💪',
];

// ─── Foto Dupla: objeto-position preciso ──────────────────────────────────────
function imgCelebrationStyle(): React.CSSProperties {
  return {
    position:'absolute', top:'50%', left:'50%',
    width:'100%', height:'100%',
    objectFit:'cover',
    objectPosition:'78% center',
    transform:'translate(-50%,-50%) scale(1.5)',
    transformOrigin:'center center',
  };
}

// ─── Card FIFA no campo ───────────────────────────────────────────────────────
function CardNoCampo({ player, isCaptain, isHero }: { player: Player; isCaptain?: boolean; isHero?: boolean }) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
  return (
    <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
      transition={{ type:'spring', stiffness:400, damping:22 }}
      style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center' }}>
      {(isCaptain||isHero) && (
        <div style={{ position:'absolute', top:-8, right:-5, zIndex:10, background:col, color:'#000',
          fontSize:8, fontWeight:900, padding:'2px 5px', borderRadius:4, lineHeight:1,
          boxShadow:`0 0 12px ${col}cc` }}>
          {isCaptain ? 'C' : '⭐'}
        </div>
      )}
      <div style={{ width:54, height:74, borderRadius:8, overflow:'hidden', border:`2px solid ${col}`,
        background:'#050505', position:'relative',
        boxShadow:`0 0 ${isCaptain||isHero?'20px':'10px'} ${col}70, 0 6px 18px rgba(0,0,0,0.8)` }}>
        <div style={{ width:'100%', height:'78%', overflow:'hidden', position:'relative' }}>
          <img src={player.foto} alt={player.short} crossOrigin="anonymous"
            onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
            style={imgCelebrationStyle()} />
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'35%',
            background:'linear-gradient(0deg,#050505 0%,transparent 100%)', pointerEvents:'none' }}/>
          {(isCaptain||isHero) && (
            <div style={{ position:'absolute', inset:0,
              background:`radial-gradient(circle at 50% 30%,${col}25 0%,transparent 70%)`, pointerEvents:'none' }}/>
          )}
        </div>
        <div style={{ position:'absolute', bottom:0, width:'100%', height:'22%',
          background:`linear-gradient(135deg,${col}ee,${col}99)`,
          display:'flex', alignItems:'center', justifyContent:'center', padding:'0 2px' }}>
          <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:8, fontWeight:900,
            fontStyle:'italic', color:'#000', textTransform:'uppercase', letterSpacing:-0.3,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {player.short}
          </div>
        </div>
      </div>
      <motion.div animate={{ scaleX:[1,0.6,1], opacity:[0.25,0.1,0.25] }}
        transition={{ duration:2.5, repeat:Infinity }}
        style={{ width:36, height:4, borderRadius:'50%', background:'rgba(0,0,0,0.5)', filter:'blur(3px)', marginTop:2 }}/>
    </motion.div>
  );
}

// ─── Campo 3D do perfil ───────────────────────────────────────────────────────
function CampoPerfil({ lineup, formacao, captainId, heroId }: {
  lineup: Record<string,Player|null>; formacao: string;
  captainId?: number|null; heroId?: number|null;
}) {
  const slots = FORMACAO_SLOTS[formacao] ?? FORMACAO_SLOTS['4-2-3-1'];
  return (
    <div style={{ width:'100%', maxWidth:400, margin:'0 auto', perspective:'400px', perspectiveOrigin:'50% 10%' }}>
      <div style={{ position:'relative', width:'100%', paddingTop:'148%',
        transform:'rotateX(22deg)', transformOrigin:'bottom center', transformStyle:'preserve-3d' }}>
        {/* Gramado */}
        <div style={{ position:'absolute', inset:0, borderRadius:16, overflow:'hidden',
          background:'linear-gradient(180deg,#0b3d0b 0%,#145214 18%,#1c6e1c 50%,#145214 82%,#0b3d0b 100%)',
          border:'2px solid rgba(255,255,255,0.18)',
          boxShadow:'0 40px 100px rgba(0,0,0,0.95), inset 0 0 60px rgba(0,0,0,0.3)' }}>
          {Array.from({length:12}).map((_,i)=>(
            <div key={i} style={{ position:'absolute', left:0, right:0, top:`${i*8.33}%`, height:'8.33%',
              background:i%2===0?'rgba(0,0,0,0.14)':'transparent' }}/>
          ))}
          <svg viewBox="0 0 100 148" preserveAspectRatio="none"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.22 }}>
            <rect x="5" y="4" width="90" height="140" stroke="white" strokeWidth="0.8" fill="none" rx="1"/>
            <line x1="5" y1="74" x2="95" y2="74" stroke="white" strokeWidth="0.5"/>
            <circle cx="50" cy="74" r="11" stroke="white" strokeWidth="0.5" fill="none"/>
            <rect x="26" y="4" width="48" height="15" stroke="white" strokeWidth="0.5" fill="none"/>
            <rect x="26" y="129" width="48" height="15" stroke="white" strokeWidth="0.5" fill="none"/>
          </svg>
        </div>
        {/* Cards dos jogadores */}
        <div style={{ position:'absolute', inset:0 }}>
          {slots.map(slot => {
            const p = lineup[slot.id] ?? null;
            if (!p) return null;
            return (
              <div key={slot.id} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`,
                transform:'translate(-50%,-50%)', zIndex:5 }}>
                <CardNoCampo player={p} isCaptain={captainId===p.id} isHero={heroId===p.id} />
              </div>
            );
          })}
        </div>
        {/* Badge formação */}
        <div style={{ position:'absolute', bottom:8, right:8, zIndex:10,
          background:'rgba(0,0,0,0.75)', color:'#F5C400', fontSize:9, fontWeight:900,
          padding:'3px 8px', borderRadius:6, letterSpacing:1, border:'1px solid rgba(245,196,0,0.2)' }}>
          {formacao}
        </div>
      </div>
    </div>
  );
}

// ─── Área da Corneta ─────────────────────────────────────────────────────────
function AreaCorneta({ alvoId, meuId }: { alvoId: string; meuId: string | null }) {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));
  const [cornetas, setCornetas]   = useState<any[]>([]);
  const [texto,    setTexto]      = useState('');
  const [emoji,    setEmoji]      = useState('🎺');
  const [sending,  setSending]    = useState(false);
  const [loading,  setLoading]    = useState(true);
  const listRef = useRef<HTMLDivElement>(null);

  const carregarCornetas = useCallback(async () => {
    const { data } = await supabase
      .from('tigre_fc_cornetas')
      .select('*, autor:autor_id(display_name, apelido, avatar_url, nivel)')
      .eq('alvo_id', alvoId)
      .order('criado_em', { ascending: false })
      .limit(30);
    setCornetas(data ?? []);
    setLoading(false);
  }, [alvoId, supabase]);

  useEffect(() => {
    carregarCornetas();
    // Realtime
    const ch = supabase.channel(`corneta-${alvoId}`)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'tigre_fc_cornetas',
        filter:`alvo_id=eq.${alvoId}` },
        async payload => {
          const { data } = await supabase.from('tigre_fc_cornetas')
            .select('*, autor:autor_id(display_name, apelido, avatar_url, nivel)')
            .eq('id', payload.new.id).single();
          if (data) setCornetas(prev => [data, ...prev]);
        }
      ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [alvoId, supabase, carregarCornetas]);

  const enviar = async () => {
    if (!texto.trim() || !meuId || sending || meuId === alvoId) return;
    setSending(true);
    await supabase.from('tigre_fc_cornetas').insert({
      alvo_id: alvoId, autor_id: meuId, mensagem: texto.trim(), emoji,
    });
    setTexto('');
    setSending(false);
  };

  const timeAgo = (iso: string) => {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (d < 60)   return `${d}s`;
    if (d < 3600) return `${Math.floor(d/60)}min`;
    if (d < 86400)return `${Math.floor(d/3600)}h`;
    return `${Math.floor(d/86400)}d`;
  };

  return (
    <div style={{ marginTop:32 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
        <div style={{ width:3, height:28, background:'#EF4444', borderRadius:2 }}/>
        <div>
          <div style={{ fontSize:8, fontWeight:900, color:'#EF4444', letterSpacing:4,
            textTransform:'uppercase' }}>TORCIDA FALA</div>
          <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:22, fontWeight:900,
            color:'#fff', textTransform:'uppercase', letterSpacing:-0.5, lineHeight:1 }}>
            ÁREA DA CORNETA 🎺
          </div>
        </div>
        <div style={{ marginLeft:'auto', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
          padding:'4px 10px', borderRadius:99, fontSize:10, color:'#EF4444', fontWeight:900 }}>
          {cornetas.length} corneta{cornetas.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Input */}
      {meuId && meuId !== alvoId ? (
        <div style={{ marginBottom:16, background:'rgba(255,255,255,0.02)', borderRadius:16,
          border:'1px solid rgba(255,255,255,0.07)', padding:12 }}>
          {/* Emoji picker */}
          <div style={{ display:'flex', gap:5, marginBottom:8, flexWrap:'wrap' }}>
            {CORNETA_EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                style={{ fontSize:18, cursor:'pointer', background: emoji===e ? 'rgba(245,196,0,0.2)' : 'transparent',
                  border: emoji===e ? '1px solid rgba(245,196,0,0.4)' : '1px solid transparent',
                  borderRadius:8, padding:'2px 4px', transition:'all 0.15s' }}>
                {e}
              </button>
            ))}
          </div>
          {/* Sugestões rápidas */}
          <div style={{ display:'flex', gap:5, marginBottom:8, overflowX:'auto' }}>
            {CORNETA_SUGESTOES.map(s => (
              <button key={s} onClick={() => setTexto(s)}
                style={{ fontSize:9, fontWeight:700, color:'#444', background:'rgba(255,255,255,0.04)',
                  border:'1px solid rgba(255,255,255,0.07)', padding:'4px 8px', borderRadius:99,
                  cursor:'pointer', whiteSpace:'nowrap', flexShrink:0 }}>
                {s}
              </button>
            ))}
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <input value={texto} onChange={e => setTexto(e.target.value.slice(0,180))}
              onKeyDown={e => e.key === 'Enter' && enviar()}
              placeholder="Manda a corneta aqui... 🎺"
              style={{ flex:1, background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.08)',
                borderRadius:12, padding:'10px 12px', color:'#fff', fontSize:12, outline:'none',
                fontFamily:'system-ui' }}/>
            <motion.button onClick={enviar} disabled={!texto.trim() || sending}
              whileTap={{ scale:0.94 }}
              style={{ padding:'10px 16px', borderRadius:12, background: texto.trim() ? '#EF4444' : '#1a1a1a',
                border:'none', color:'#fff', fontSize:12, fontWeight:900, cursor: texto.trim() ? 'pointer' : 'default',
                transition:'background 0.2s' }}>
              {sending ? '...' : emoji}
            </motion.button>
          </div>
          <div style={{ fontSize:8, color:'#222', marginTop:4, textAlign:'right' }}>
            {180 - texto.length} caracteres
          </div>
        </div>
      ) : meuId === alvoId ? (
        <div style={{ padding:'12px', background:'rgba(245,196,0,0.05)', borderRadius:12,
          border:'1px solid rgba(245,196,0,0.1)', marginBottom:16, textAlign:'center',
          fontSize:10, color:'rgba(245,196,0,0.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>
          Este é seu perfil — veja o que a galera acha! 🎺
        </div>
      ) : (
        <div style={{ padding:'12px', background:'rgba(255,255,255,0.02)', borderRadius:12,
          border:'1px solid rgba(255,255,255,0.06)', marginBottom:16, textAlign:'center',
          fontSize:10, color:'#333', fontWeight:700 }}>
          Faça login para cornetar! 🔐
        </div>
      )}

      {/* Lista de cornetas */}
      <div ref={listRef} style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {loading && (
          <div style={{ textAlign:'center', padding:'24px', color:'#222', fontSize:12 }}>Carregando cornetas...</div>
        )}
        {!loading && cornetas.length === 0 && (
          <div style={{ textAlign:'center', padding:'32px', color:'#1a1a1a' }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🎺</div>
            <div style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:2 }}>
              Seja o primeiro a cornetar!
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {cornetas.map((c, i) => {
            const autor = c.autor ?? {};
            const nCor  = NIVEL_CORES[autor.nivel ?? 'Novato'];
            return (
              <motion.div key={c.id}
                initial={{ opacity:0, y:-12, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, scale:0.9 }}
                style={{ display:'flex', gap:10, padding:'12px 14px',
                  background: i===0 ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.02)',
                  borderRadius:14, border: i===0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.04)' }}>
                {/* Avatar */}
                <div style={{ width:34, height:34, borderRadius:'50%', overflow:'hidden', flexShrink:0,
                  border:`1.5px solid ${nCor}`, background:`${nCor}20` }}>
                  {autor.avatar_url
                    ? <img src={autor.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                    : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                        {NIVEL_ICONES[autor.nivel ?? 'Novato']}
                      </div>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                    <span style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif", fontSize:13,
                      fontWeight:900, color:nCor, textTransform:'uppercase', letterSpacing:-0.3 }}>
                      {autor.apelido ?? autor.display_name ?? 'Torcedor'}
                    </span>
                    <span style={{ fontSize:10, color:'#222', fontWeight:700 }}>·</span>
                    <span style={{ fontSize:9, color:'#2a2a2a', fontWeight:600 }}>{timeAgo(c.criado_em)}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:6 }}>
                    <span style={{ fontSize:18, flexShrink:0 }}>{c.emoji}</span>
                    <span style={{ fontSize:13, color:'#ccc', lineHeight:1.4 }}>{c.mensagem}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Histórico de pontos ──────────────────────────────────────────────────────
function HistoricoPontos({ historico }: { historico: any[] }) {
  if (!historico?.length) return null;
  return (
    <div style={{ marginTop:28 }}>
      <div style={{ fontSize:9, fontWeight:900, color:'#F5C400', letterSpacing:4,
        textTransform:'uppercase', marginBottom:12 }}>📊 Últimas Rodadas</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {historico.map((h, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px',
            background:'rgba(255,255,255,0.02)', borderRadius:12, border:'1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
              fontSize:28, fontWeight:900, color: h.pts_total > 40 ? '#F5C400' : '#fff',
              lineHeight:1, minWidth:48 }}>{h.pts_total ?? 0}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:7, color:'#333', fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>
                PONTOS
              </div>
              <div style={{ display:'flex', gap:8, marginTop:2, flexWrap:'wrap' }}>
                {h.pts_palpite > 0 && (
                  <span style={{ fontSize:8, color:'#22C55E', fontWeight:700 }}>+{h.pts_palpite} palpite</span>
                )}
                {h.pts_heroi > 0 && (
                  <span style={{ fontSize:8, color:'#00F3FF', fontWeight:700 }}>+{h.pts_heroi} herói</span>
                )}
                {h.acertou_placar_exato && (
                  <span style={{ fontSize:8, color:'#F5C400', fontWeight:900 }}>🎯 PLACAR EXATO!</span>
                )}
              </div>
            </div>
            <div style={{ fontSize:8, color:'#222', fontWeight:600 }}>
              {new Date(h.calculado_em).toLocaleDateString('pt-BR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function PerfilPublicoPage() {
  const params   = useParams();
  const router   = useRouter();
  const username = (params?.username as string ?? '').toLowerCase();

  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  const [dados,    setDados]    = useState<any>(null);
  const [meuId,    setMeuId]    = useState<string|null>(null);
  const [isLoading,setIsLoading]= useState(true);
  const [error,    setError]    = useState<string|null>(null);

  // Resolve meu ID
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user?.id) {
        const { data: u } = await supabase.from('tigre_fc_usuarios')
          .select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }
    });
  }, [supabase]);

  // Carrega perfil via RPC
  useEffect(() => {
    if (!username) return;
    let alive = true;

    async function load() {
      setIsLoading(true);
      setError(null);

      // Tenta via RPC
      try {
        const { data: rpc, error: rpcErr } = await supabase.rpc('get_perfil_completo', { p_apelido: username });
        if (alive && rpc && !rpc.erro) {
          setDados(rpc);
          setIsLoading(false);
          return;
        }
      } catch { /* fallback */ }

      // Fallback: query direta
      try {
        const { data: u } = await supabase.from('tigre_fc_usuarios')
          .select('*')
          .or(`lower(apelido).eq.${username},lower(display_name).eq.${username}`)
          .maybeSingle();

        if (!alive) return;
        if (!u) { setError('Perfil não encontrado.'); setIsLoading(false); return; }

        const { data: esc } = await supabase.from('tigre_fc_escalacoes')
          .select('*').eq('usuario_id', u.id)
          .order('updated_at', { ascending: false }).limit(1).maybeSingle();

        const { data: hist } = await supabase.from('tigre_fc_pontuacoes')
          .select('pts_total, pts_palpite, pts_heroi, acertou_placar_exato, calculado_em')
          .eq('usuario_id', u.id).order('calculado_em', { ascending: false }).limit(5);

        const { count: posCount } = await supabase.from('tigre_fc_usuarios')
          .select('id', { count:'exact', head:true }).gt('pontos_total', u.pontos_total ?? 0);

        setDados({
          usuario: u,
          escalacao: esc ?? null,
          posicao_ranking: (posCount ?? 0) + 1,
          historico: hist ?? [],
        });
      } catch { if (alive) setError('Erro ao carregar perfil.'); }
      finally { if (alive) setIsLoading(false); }
    }

    load();
    return () => { alive = false; };
  }, [username, supabase]);

  if (isLoading) return (
    <div style={{ minHeight:'100vh', background:'#050505', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <motion.img src={PATA} style={{ width:56, height:56, objectFit:'contain', margin:'0 auto 16px', display:'block' }}
          animate={{ rotate:[0,10,-10,0] }} transition={{ duration:1.5, repeat:Infinity }}/>
        <div style={{ fontSize:11, color:'#333', fontWeight:700, textTransform:'uppercase', letterSpacing:2 }}>
          Carregando perfil...
        </div>
      </div>
    </div>
  );

  if (error || !dados) return (
    <div style={{ minHeight:'100vh', background:'#050505', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:48 }}>🐯</div>
      <div style={{ fontSize:16, color:'#333', fontWeight:700 }}>{error ?? 'Perfil não encontrado'}</div>
      <button onClick={() => router.push('/tigre-fc')}
        style={{ padding:'12px 24px', borderRadius:12, background:'#F5C400', border:'none',
          color:'#000', fontSize:12, fontWeight:900, cursor:'pointer', textTransform:'uppercase' }}>
        Voltar ao Tigre FC
      </button>
    </div>
  );

  const usuario   = dados.usuario;
  const escalacao = dados.escalacao;
  const historico = dados.historico ?? [];
  const posicao   = dados.posicao_ranking;
  const nivelCor  = NIVEL_CORES[usuario.nivel ?? 'Novato'];

  // Parse lineup seguro
  const lineup: Record<string, Player|null> = {};
  if (escalacao?.lineup_json) {
    Object.entries(escalacao.lineup_json as object).forEach(([k,v]) => {
      lineup[k] = v ? (v as Player) : null;
    });
  }

  const isMyProfile = meuId === usuario.id;

  return (
    <div style={{ minHeight:'100vh', background:'#050505', color:'#fff',
      fontFamily:"'Barlow Condensed',system-ui,sans-serif", paddingBottom:60 }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box}body{background:#050505}::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}
      `}</style>

      {/* Back */}
      <div style={{ padding:'12px 16px 0', display:'flex', alignItems:'center', gap:8 }}>
        <button onClick={() => router.push('/tigre-fc')}
          style={{ background:'none', border:'none', color:'#444', cursor:'pointer', fontSize:20, padding:4 }}>
          ←
        </button>
        <span style={{ fontSize:9, color:'#333', fontWeight:700, textTransform:'uppercase', letterSpacing:3 }}>
          Perfil do Torcedor
        </span>
      </div>

      <div style={{ maxWidth:460, margin:'0 auto', padding:'0 16px' }}>

        {/* Hero do perfil */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          style={{ padding:'20px 16px', background:'rgba(255,255,255,0.02)',
            borderRadius:24, border:'1px solid rgba(255,255,255,0.05)',
            marginTop:12, marginBottom:16, position:'relative', overflow:'hidden' }}>
          {/* Glow de nível */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'60%',
            background:`radial-gradient(ellipse at 30% 0%,${nivelCor}18 0%,transparent 70%)`,
            pointerEvents:'none' }}/>

          <div style={{ display:'flex', gap:14, alignItems:'center', position:'relative', zIndex:2 }}>
            {/* Avatar */}
            <div style={{ width:72, height:72, borderRadius:'50%', overflow:'hidden', flexShrink:0,
              border:`3px solid ${nivelCor}`, boxShadow:`0 0 20px ${nivelCor}50`,
              background:`${nivelCor}20` }}>
              {usuario.avatar_url
                ? <img src={usuario.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
                : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>
                    {NIVEL_ICONES[usuario.nivel ?? 'Novato']}
                  </div>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
                fontSize:26, fontWeight:900, color:'#fff', textTransform:'uppercase',
                letterSpacing:-0.5, lineHeight:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {usuario.apelido ?? usuario.display_name ?? 'Torcedor'}
              </div>
              <div style={{ display:'flex', gap:8, marginTop:4, flexWrap:'wrap' }}>
                <span style={{ fontSize:10, color:nivelCor, fontWeight:900 }}>
                  {NIVEL_ICONES[usuario.nivel ?? 'Novato']} {usuario.nivel ?? 'Novato'}
                </span>
                {usuario.xp > 0 && (
                  <span style={{ fontSize:10, color:'#F5C400', fontWeight:700 }}>{usuario.xp} XP</span>
                )}
                <span style={{ fontSize:10, color:'#333', fontWeight:700 }}>
                  #{posicao} no ranking
                </span>
              </div>
              {usuario.bio && (
                <div style={{ fontSize:11, color:'#333', marginTop:6, lineHeight:1.4 }}>{usuario.bio}</div>
              )}
            </div>
            {/* Pontos total */}
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:"'Barlow Condensed',Impact,sans-serif",
                fontSize:38, fontWeight:900, color:'#F5C400', lineHeight:1,
                textShadow:'0 0 20px rgba(245,196,0,0.4)' }}>
                {usuario.pontos_total ?? 0}
              </div>
              <div style={{ fontSize:7, color:'#333', fontWeight:700, letterSpacing:2, textTransform:'uppercase' }}>PTS</div>
            </div>
          </div>

          {isMyProfile && (
            <button onClick={() => router.push('/tigre-fc')}
              style={{ marginTop:14, width:'100%', padding:'10px', borderRadius:12,
                background:'linear-gradient(135deg,#F5C400,#D4A200)', border:'none',
                color:'#000', fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:1.5, cursor:'pointer' }}>
              ⚡ EDITAR MEU TIME
            </button>
          )}
        </motion.div>

        {/* Campo */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
          <div style={{ fontSize:8, fontWeight:900, color:'#F5C400', letterSpacing:4,
            textTransform:'uppercase', marginBottom:12, textAlign:'center' }}>
            ⚽ ESCALAÇÃO ATUAL · {escalacao?.formacao ?? '4-2-3-1'}
          </div>
          {/* Stadium BG simplificado */}
          <div style={{ position:'relative', background:'linear-gradient(180deg,#010508 0%,#030e09 55%,#061608 100%)',
            borderRadius:20, overflow:'hidden', padding:'8px 6px' }}>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'50%',
              background:'radial-gradient(ellipse 100% 60% at 50% 100%,rgba(16,80,16,0.4) 0%,transparent 70%)',
              pointerEvents:'none' }}/>
            {/* Refletores */}
            <div style={{ position:'absolute', top:'-8%', left:'6%', width:3, height:'70%',
              background:'linear-gradient(180deg,rgba(255,252,210,0.3) 0%,transparent 100%)',
              transform:'rotate(22deg)', filter:'blur(5px)', pointerEvents:'none' }}/>
            <div style={{ position:'absolute', top:'-8%', right:'6%', width:3, height:'70%',
              background:'linear-gradient(180deg,rgba(255,252,210,0.3) 0%,transparent 100%)',
              transform:'rotate(-22deg)', filter:'blur(5px)', pointerEvents:'none' }}/>
            <div style={{ position:'relative', zIndex:5 }}>
              <CampoPerfil lineup={lineup} formacao={escalacao?.formacao ?? '4-2-3-1'}
                captainId={escalacao?.capitan_id} heroId={escalacao?.heroi_id} />
            </div>
          </div>

          {/* Stats capitão/herói */}
          {(escalacao?.capitan_id || escalacao?.heroi_id) && (
            <div style={{ display:'flex', gap:8, marginTop:10 }}>
              {escalacao?.capitan_id && (
                <div style={{ flex:1, padding:'8px 10px', background:'rgba(245,196,0,0.08)',
                  border:'1px solid rgba(245,196,0,0.2)', borderRadius:12, textAlign:'center' }}>
                  <div style={{ fontSize:7, color:'rgba(245,196,0,0.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:2 }}>Capitão</div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#F5C400', marginTop:2 }}>© ×2 pts</div>
                </div>
              )}
              {escalacao?.heroi_id && (
                <div style={{ flex:1, padding:'8px 10px', background:'rgba(0,243,255,0.06)',
                  border:'1px solid rgba(0,243,255,0.2)', borderRadius:12, textAlign:'center' }}>
                  <div style={{ fontSize:7, color:'rgba(0,243,255,0.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:2 }}>Herói</div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#00F3FF', marginTop:2 }}>⭐ +10 pts</div>
                </div>
              )}
              {escalacao?.palpite_tigre !== undefined && (
                <div style={{ flex:1, padding:'8px 10px', background:'rgba(34,197,94,0.06)',
                  border:'1px solid rgba(34,197,94,0.2)', borderRadius:12, textAlign:'center' }}>
                  <div style={{ fontSize:7, color:'rgba(34,197,94,0.5)', fontWeight:700, textTransform:'uppercase', letterSpacing:2 }}>Palpite</div>
                  <div style={{ fontSize:13, fontWeight:900, color:'#22C55E', marginTop:2 }}>
                    {escalacao.palpite_tigre}×{escalacao.palpite_adv}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Histórico */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}>
          <HistoricoPontos historico={historico} />
        </motion.div>

        {/* Corneta */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.3 }}>
          <AreaCorneta alvoId={usuario.id} meuId={meuId} />
        </motion.div>
      </div>
    </div>
  );
}
