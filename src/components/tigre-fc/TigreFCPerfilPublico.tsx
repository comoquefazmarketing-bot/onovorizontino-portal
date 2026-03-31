'use client';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCPlayerCard from '@/components/tigre-fc/TigreFCPlayerCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const PLAYERS: Record<number, any> = {
  1:  { id:1,  name:'César Augusto',  short:'César',     num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  2:  { id:2,  name:'Jordi',              short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  3:  { id:3,  name:'João Scapin',      short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  4:  { id:4,  name:'Lucas Ribeiro',    short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  5:  { id:5,  name:'Lora',               short:'Lora',        num:2,  pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  6:  { id:6,  name:'Castrillón',       short:'Castrillón', num:6,  pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  7:  { id:7,  name:'Arthur Barbosa',   short:'A.Barbosa',  num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  8:  { id:8,  name:'Mayk',               short:'Mayk',        num:26, pos:'LAT', foto:BASE+'MAYK.jpg.webp' },
  9:  { id:9,  name:'Maykon Jesus',      short:'Maykon',      num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  10: { id:10, name:'Dantas',           short:'Dantas',      num:3,  pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  11: { id:11, name:'Eduardo Brock',    short:'E.Brock',    num:5,  pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  12: { id:12, name:'Patrick',          short:'Patrick',    num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  13: { id:13, name:'Gabriel Bahia',    short:'G.Bahia',    num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  14: { id:14, name:'Carlinhos',         short:'Carlinhos',  num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  15: { id:15, name:'Alemão',            short:'Alemão',      num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  16: { id:16, name:'Renato Palm',      short:'R.Palm',      num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  17: { id:17, name:'Alvariño',         short:'Alvariño',    num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  18: { id:18, name:'Bruno Santana',    short:'B.Santana',  num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  19: { id:19, name:'Luís Oyama',       short:'Oyama',      num:8,  pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  20: { id:20, name:'Léo Naldi',        short:'L.Naldi',    num:7,  pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  21: { id:21, name:'Rômulo',            short:'Rômulo',      num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  22: { id:22, name:'Matheus Bianqui',  short:'Bianqui',    num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  23: { id:23, name:'Juninho',          short:'Juninho',    num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  24: { id:24, name:'Tavinho',          short:'Tavinho',    num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  25: { id:25, name:'Diego Galo',       short:'D.Galo',      num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  26: { id:26, name:'Marlon',            short:'Marlon',      num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  27: { id:27, name:'Hector Bianchi',   short:'Hector',      num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  28: { id:28, name:'Nogueira',         short:'Nogueira',    num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  29: { id:29, name:'Luiz Gabriel',     short:'L.Gabriel',  num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  30: { id:30, name:'Jhones Kauê',      short:'J.Kauê',      num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  31: { id:31, name:'Robson',            short:'Robson',      num:9,  pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  32: { id:32, name:'Vinícius Paiva',   short:'V.Paiva',    num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  33: { id:33, name:'Hélio Borges',     short:'H.Borges',    num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  34: { id:34, name:'Jardiel',          short:'Jardiel',    num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  35: { id:35, name:'Nicolas Careca',   short:'N.Careca',    num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  36: { id:36, name:'Titi Ortiz',       short:'T.Ortiz',    num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  37: { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  38: { id:38, name:'Carlão',            short:'Carlão',      num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  39: { id:39, name:'Ronald Barcellos', short:'Ronald',      num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
};

const SLOTS: Record<string, { id:string; x:number; y:number }[]> = {
  '4-3-3':   [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'cm1',x:72,y:50},{id:'cm2',x:50,y:46},{id:'cm3',x:28,y:50},{id:'rw',x:76,y:24},{id:'st',x:50,y:18},{id:'lw',x:24,y:24}],
  '4-4-2':   [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'rm',x:80,y:50},{id:'cm1',x:60,y:50},{id:'cm2',x:40,y:50},{id:'lm',x:20,y:50},{id:'st1',x:64,y:22},{id:'st2',x:36,y:22}],
  '3-5-2':   [{id:'gk',x:50,y:88},{id:'cb1',x:70,y:72},{id:'cb2',x:50,y:75},{id:'cb3',x:30,y:72},{id:'rb',x:86,y:52},{id:'cm1',x:68,y:50},{id:'cm2',x:50,y:46},{id:'cm3',x:32,y:50},{id:'lb',x:14,y:52},{id:'st1',x:64,y:22},{id:'st2',x:36,y:22}],
  '4-2-3-1': [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'dm1',x:64,y:57},{id:'dm2',x:36,y:57},{id:'rm',x:76,y:38},{id:'am',x:50,y:36},{id:'lm',x:24,y:38},{id:'st',x:50,y:18}],
};

const NIVEL_ICON: Record<string,string>  = { Novato:'🌱', Fiel:'⚡', Garra:'🔥', Lenda:'🐯' };
const NIVEL_COLOR: Record<string,string> = { Novato:'#6b7280', Fiel:'#F5C400', Garra:'#F5C400', Lenda:'#FFD700' };

type Props = {
  targetUserId: string;
  jogoId: number | null; 
  meuId?: string | null;
  onClose: () => void;
};

export default function TigreFCPerfilPublico({ targetUserId, jogoId, meuId, onClose }: Props) {
  const [perfil, setPerfil] = useState<any>(null);
  const [escalacao, setEscalacao] = useState<any>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComent, setNovoComent] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);
  const comentEndRef = useRef<HTMLDivElement>(null);
  
  const CAMPO_W = 280;
  const CAMPO_H = Math.round(CAMPO_W * (105/68));
  const SLOT_SZ = Math.round(CAMPO_W * 0.18); 
  const isMe = meuId === targetUserId;

  useEffect(() => {
    const load = async () => {
      try {
        const { data: userData } = await supabase.from('tigre_fc_usuarios').select('*').eq('id', targetUserId).single();
        setPerfil(userData);

        if (jogoId) {
          const { data: escData } = await supabase.from('tigre_fc_escalacoes').select('*').eq('usuario_id', targetUserId).eq('jogo_id', jogoId).maybeSingle();
          const { data: comsData } = await supabase.from('tigre_fc_comentarios').select('*, autor:autor_id(apelido,nome,avatar_url,nivel)')
              .eq('escalacao_usuario_id', targetUserId).eq('jogo_id', jogoId)
              .order('criado_em', { ascending: true });
          
          setEscalacao(escData);
          setComentarios(comsData || []);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };
    load();

    if (!jogoId) return;
    const channel = supabase.channel(`coments-${targetUserId}-${jogoId}`)
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'tigre_fc_comentarios',
        filter: `escalacao_usuario_id=eq.${targetUserId}` }, (payload) => {
        supabase.from('tigre_fc_comentarios')
          .select('*, autor:autor_id(apelido,nome,avatar_url,nivel)')
          .eq('id', payload.new.id).single()
          .then(({ data }) => { if (data) setComentarios(prev => [...prev, data]); });
      }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [targetUserId, jogoId]);

  useEffect(() => {
    comentEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comentarios]);

  const enviarComentario = async () => {
    if (!novoComent.trim() || !meuId || !jogoId || enviando) return;
    setEnviando(true);
    try {
      const text = novoComent.trim();
      setNovoComent('');
      await supabase.from('tigre_fc_comentarios').insert({
        escalacao_usuario_id: targetUserId, 
        jogo_id: jogoId,
        autor_id: meuId, 
        texto: text,
      });
      if (!isMe) {
        await supabase.from('tigre_fc_notificacoes').insert({
          usuario_id: targetUserId, 
          tipo: 'corneta',
          de_usuario_id: meuId, 
          jogo_id: jogoId,
          mensagem: 'cornetou sua escalação!',
        });
      }
    } catch (err) {
      console.error("Erro ao comentar:", err);
    } finally {
      setEnviando(false);
    }
  };

  const slots = SLOTS[escalacao?.formacao || '4-3-3'];
  const lineup = escalacao?.lineup || {};
  const capitaoId = escalacao?.capitao_id;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.92)', display:'flex', alignItems:'flex-end', justifyContent:'center', backdropFilter:'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth:480, background:'#0a0a0a', borderRadius:'24px 24px 0 0', border:'1px solid #222', maxHeight:'96vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        
        {/* Header Modal */}
        <div style={{ background:'#F5C400', padding:'16px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
             <span style={{ fontWeight:900, fontSize:14, color:'#111', textTransform:'uppercase' }}>
               {isMe ? 'Minha Escalação' : 'Escalação do Torcedor'}
             </span>
          </div>
          <button onClick={onClose} style={{ background:'#111', border:'none', color:'#F5C400', fontWeight:900, width:28, height:28, borderRadius:'50%', cursor:'pointer' }}>×</button>
        </div>

        <div style={{ overflowY:'auto', flex:1 }}>
          {loading ? (
            <div style={{ padding:60, textAlign:'center', color:'#555', fontSize:14 }}>Carregando Perfil...</div>
          ) : (
            <>
              {/* Profile Info */}
              <div style={{ padding:'20px 16px', display:'flex', alignItems:'center', gap:16, background:'linear-gradient(to bottom, #111, #0a0a0a)' }}>
                <div style={{ position:'relative' }}>
                  {perfil?.avatar_url ? (
                    <img src={perfil.avatar_url} style={{ width:60, height:60, borderRadius:'50%', border:`2px solid ${NIVEL_COLOR[perfil.nivel] || '#F5C400'}`, objectFit:'cover' }} alt="Avatar" />
                  ) : (
                    <div style={{ width:60, height:60, borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#F5C400', border:'2px solid #333' }}>
                      {(perfil?.apelido || perfil?.nome || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'#fff', display:'flex', alignItems:'center', gap:6 }}>
                    {perfil?.apelido || perfil?.nome}
                  </div>
                  <div style={{ fontSize:12, color: NIVEL_COLOR[perfil?.nivel], fontWeight:800, textTransform:'uppercase', letterSpacing:0.5 }}>
                    {NIVEL_ICON[perfil?.nivel]} {perfil?.nivel || 'Novato'}
                  </div>
                </div>
                <div style={{ textAlign:'right', background:'rgba(245,196,0,0.05)', padding:'8px 12px', borderRadius:12, border:'1px solid rgba(245,196,0,0.1)' }}>
                  <div style={{ fontSize:22, fontWeight:900, color:'#F5C400', lineHeight:1 }}>{perfil?.pontos_total || 0}</div>
                  <div style={{ fontSize:8, color:'#555', textTransform:'uppercase', fontWeight:900, marginTop:4 }}>PTS TOTAL</div>
                </div>
              </div>

              {/* Tactical Field - CORREÇÃO DE LÓGICA DE ID */}
              <div style={{ padding:'20px 0', background:'#080808', display:'flex', flexDirection:'column', alignItems:'center', borderBottom:'1px solid #111' }}>
                <div style={{ position:'relative', width:CAMPO_W, height:CAMPO_H, borderRadius:8, overflow:'hidden', background:'#0f2d0f', border:'2px solid #1a1a1a' }}>
                  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
                    {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.02)':'transparent'} />)}
                    <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    <circle cx="34" cy="52.5" r="9" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                  </svg>

                  {escalacao ? slots.map(slot => {
                    const slotData = lineup[slot.id];
                    // Tenta pegar o ID seja ele um número direto ou um objeto {id: X}
                    const pId = typeof slotData === 'object' ? slotData?.id : slotData;
                    const player = pId ? PLAYERS[Number(pId)] : null;

                    if (!player) return null;

                    return (
                      <div key={slot.id} style={{ 
                        position:'absolute', 
                        left:`${slot.x}%`, 
                        top:`${slot.y}%`, 
                        transform:'translate(-50%, -50%)',
                        zIndex: 20,
                        textAlign: 'center'
                      }}>
                        <TigreFCPlayerCard 
                          player={player} 
                          size={SLOT_SZ} 
                          isCapitao={Number(pId) === Number(capitaoId)}
                        />
                        <div style={{ 
                          marginTop: 2, 
                          fontSize: 8, 
                          fontWeight: 900, 
                          color: '#fff', 
                          background: 'rgba(0,0,0,0.7)',
                          padding: '1px 4px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap'
                        }}>
                          {player.short}
                        </div>
                      </div>
                    );
                  }) : (
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#333', fontSize:12, fontWeight:700 }}>
                      AINDA NÃO ESCALOU
                    </div>
                  )}
                </div>
                {escalacao && (
                  <div style={{ marginTop:12, fontSize:10, fontWeight:900, color:'#444', textTransform:'uppercase' }}>
                    Formação: {escalacao.formacao}
                  </div>
                )}
              </div>

              {/* Feed de Cornetas */}
              <div style={{ padding: '20px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                   <div style={{ width:4, height:14, background:'#F5C400', borderRadius:2 }} />
                   <h3 style={{ color: '#fff', fontSize:13, fontWeight:900, textTransform: 'uppercase', margin:0 }}>Área de Corneta</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap:12 }}>
                  {comentarios.length === 0 ? (
                    <div style={{ textAlign:'center', padding:30, color:'#333', fontSize:12, border:'1px dashed #222', borderRadius:16 }}>
                      Ninguém cornetou ainda. Seja o primeiro!
                    </div>
                  ) : comentarios.map((c, idx) => (
                    <div key={idx} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      {c.autor?.avatar_url ? (
                        <img src={c.autor.avatar_url} style={{ width:32, height:32, borderRadius:'50%', border:'1px solid #222' }} alt="" />
                      ) : (
                        <div style={{ width:32, height:32, borderRadius:'50%', background:'#111', border:'1px solid #222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, color:'#555' }}>
                          {(c.autor?.apelido || '?').charAt(0)}
                        </div>
                      )}
                      <div style={{ flex:1, background: '#111', padding: '10px 14px', borderRadius: '0 16px 16px 16px', border: '1px solid #1a1a1a' }}>
                        <div style={{ display: 'flex', justifyContent:'space-between', marginBottom:4 }}>
                          <span style={{ fontSize: 11, fontWeight: 900, color: NIVEL_COLOR[c.autor?.nivel] || '#F5C400' }}>
                            {NIVEL_ICON[c.autor?.nivel]} {c.autor?.apelido || c.autor?.nome}
                          </span>
                          <span style={{ fontSize: 9, color: '#333' }}>{new Date(c.criado_em).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}</span>
                        </div>
                        <p style={{ color: '#bbb', fontSize: 13, margin: 0, lineHeight:1.4 }}>{c.texto}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={comentEndRef} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Input de Corneta */}
        <div style={{ padding: '16px 20px 24px', background: '#0a0a0a', borderTop: '1px solid #1a1a1a', display: 'flex', gap:10, alignItems:'center' }}>
          <input 
            value={novoComent}
            onChange={e => setNovoComent(e.target.value.slice(0, 150))}
            onKeyDown={e => e.key === 'Enter' && enviarComentario()}
            placeholder="Mande sua corneta..."
            style={{ flex: 1, background: '#111', border: '1px solid #222', borderRadius: 24, padding: '12px 18px', color: '#fff', outline: 'none', fontSize:14 }}
          />
          <button 
            onClick={enviarComentario}
            disabled={!novoComent.trim() || enviando}
            style={{ 
              background: novoComent.trim() ? '#F5C400' : '#1a1a1a', 
              color: '#111',
              border: 'none', 
              borderRadius: '50%', 
              width: 44, 
              height: 44, 
              fontWeight: 900, 
              cursor: novoComent.trim() ? 'pointer' : 'default',
              transition: '0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20
            }}
          >
            {enviando ? '...' : '↑'}
          </button>
        </div>
      </div>
    </div>
  );
}
