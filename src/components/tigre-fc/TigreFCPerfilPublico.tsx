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
  2:  { id:2,  name:'Jordi',            short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  3:  { id:3,  name:'João Scapin',      short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  4:  { id:4,  name:'Lucas Ribeiro',    short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  5:  { id:5,  name:'Lora',             short:'Lora',        num:2,  pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  6:  { id:6,  name:'Castrillón',       short:'Castrillón', num:6,  pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  7:  { id:7,  name:'Arthur Barbosa',   short:'A.Barbosa',  num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  8:  { id:8,  name:'Mayk',             short:'Mayk',        num:26, pos:'LAT', foto:BASE+'MAYK.jpg.webp' },
  9:  { id:9,  name:'Maykon Jesus',     short:'Maykon',      num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  10: { id:10, name:'Dantas',           short:'Dantas',      num:3,  pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  11: { id:11, name:'Eduardo Brock',    short:'E.Brock',    num:5,  pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  12: { id:12, name:'Patrick',          short:'Patrick',    num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  13: { id:13, name:'Gabriel Bahia',    short:'G.Bahia',    num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  14: { id:14, name:'Carlinhos',        short:'Carlinhos',  num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  15: { id:15, name:'Alemão',           short:'Alemão',      num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  16: { id:16, name:'Renato Palm',      short:'R.Palm',      num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  17: { id:17, name:'Alvariño',         short:'Alvariño',   num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  18: { id:18, name:'Bruno Santana',    short:'B.Santana',  num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  19: { id:19, name:'Luís Oyama',       short:'Oyama',      num:8,  pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  20: { id:20, name:'Léo Naldi',        short:'L.Naldi',    num:7,  pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  21: { id:21, name:'Rômulo',           short:'Rômulo',      num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  22: { id:22, name:'Matheus Bianqui',  short:'Bianqui',    num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  23: { id:23, name:'Juninho',          short:'Juninho',    num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  24: { id:24, name:'Tavinho',          short:'Tavinho',    num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  25: { id:25, name:'Diego Galo',       short:'D.Galo',      num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  26: { id:26, name:'Marlon',           short:'Marlon',      num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  27: { id:27, name:'Hector Bianchi',   short:'Hector',      num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  28: { id:28, name:'Nogueira',         short:'Nogueira',   num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  29: { id:29, name:'Luiz Gabriel',     short:'L.Gabriel',  num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  30: { id:30, name:'Jhones Kauê',      short:'J.Kauê',      num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  31: { id:31, name:'Robson',           short:'Robson',      num:9,  pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  32: { id:32, name:'Vinícius Paiva',   short:'V.Paiva',    num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  33: { id:33, name:'Hélio Borges',     short:'H.Borges',    num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  34: { id:34, name:'Jardiel',          short:'Jardiel',    num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  35: { id:35, name:'Nicolas Careca',   short:'N.Careca',    num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  36: { id:36, name:'Titi Ortiz',       short:'T.Ortiz',    num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  37: { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  38: { id:38, name:'Carlão',           short:'Carlão',      num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  39: { id:39, name:'Ronald Barcellos', short:'Ronald',      num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
};

const SLOTS: Record<string, { id:string; x:number; y:number }[]> = {
  '4-3-3':    [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'cm1',x:72,y:50},{id:'cm2',x:50,y:46},{id:'cm3',x:28,y:50},{id:'rw',x:76,y:24},{id:'st',x:50,y:18},{id:'lw',x:24,y:24}],
  '4-4-2':    [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'rm',x:80,y:50},{id:'cm1',x:60,y:50},{id:'cm2',x:40,y:50},{id:'lm',x:20,y:50},{id:'st1',x:64,y:22},{id:'st2',x:36,y:22}],
  '3-5-2':    [{id:'gk',x:50,y:88},{id:'cb1',x:70,y:72},{id:'cb2',x:50,y:75},{id:'cb3',x:30,y:72},{id:'rb',x:86,y:52},{id:'cm1',x:68,y:50},{id:'cm2',x:50,y:46},{id:'cm3',x:32,y:50},{id:'lb',x:14,y:52},{id:'st1',x:64,y:22},{id:'st2',x:36,y:22}],
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
  const [perfil, setPerfil]           = useState<any>(null);
  const [escalacao, setEscalacao]     = useState<any>(null);
  const [palpite, setPalpite]         = useState<any>(null);
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [novoComent, setNovoComent]   = useState('');
  const [enviando, setEnviando]       = useState(false);
  const [loading, setLoading]         = useState(true);
  const comentEndRef                  = useRef<HTMLDivElement>(null);
  const CAMPO_W = 280;
  const CAMPO_H = Math.round(CAMPO_W * (105/68));
  const SLOT_SZ = Math.round(CAMPO_W * 0.1);

  const isMe = meuId === targetUserId;

  useEffect(() => {
    const load = async () => {
      // Ajuste de tipagem para 'any[]' para evitar erro de compatibilidade entre Supabase e Promise nativa
      const promises: any[] = [
        supabase.from('tigre_fc_usuarios').select('*').eq('id', targetUserId).single(),
      ];

      if (jogoId) {
        promises.push(
          supabase.from('tigre_fc_escalacoes').select('*').eq('usuario_id', targetUserId).eq('jogo_id', jogoId).single(),
          supabase.from('tigre_fc_palpites').select('*').eq('usuario_id', targetUserId).eq('jogo_id', jogoId).single(),
          supabase.from('tigre_fc_comentarios').select('*, autor:autor_id(apelido,nome,avatar_url,nivel)')
            .eq('escalacao_usuario_id', targetUserId).eq('jogo_id', jogoId)
            .order('criado_em', { ascending: true }),
        );
      }

      const results = await Promise.all(promises);
      setPerfil(results[0]?.data || null);
      if (jogoId) {
        setEscalacao(results[1]?.data || null);
        setPalpite(results[2]?.data || null);
        setComentarios(results[3]?.data || []);
      }
      setLoading(false);
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
    await supabase.from('tigre_fc_comentarios').insert({
      escalacao_usuario_id: targetUserId, jogo_id: jogoId,
      autor_id: meuId, texto: novoComent.trim(),
    });
    if (!isMe) {
      await supabase.from('tigre_fc_notificacoes').insert({
        usuario_id: targetUserId, tipo: 'corneta',
        de_usuario_id: meuId, jogo_id: jogoId,
        mensagem: 'cornetou sua escalação!',
      }).catch(() => {});
    }
    setNovoComent(''); setEnviando(false);
  };

  const slots = SLOTS[escalacao?.formacao || '4-3-3'] || SLOTS['4-3-3'];
  const lineup = escalacao?.lineup || {};

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ width:'100%', maxWidth:480, background:'#0a0a0a', borderRadius:'20px 20px 0 0', border:'1px solid #1a1a1a', maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>

        <div style={{ background:'#F5C400', padding:'14px 16px', display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'#1a1a1a', fontWeight:900, fontSize:20, cursor:'pointer', padding:0 }}>×</button>
          <div style={{ fontWeight:900, fontSize:15, color:'#1a1a1a' }}>
            {isMe ? 'Meu Perfil' : 'Perfil do Torcedor'}
          </div>
        </div>

        <div style={{ overflowY:'auto', flex:1 }}>
          {loading ? (
            <div style={{ padding:40, textAlign:'center', color:'#555', fontSize:13 }}>Carregando...</div>
          ) : !perfil ? (
            <div style={{ padding:40, textAlign:'center', color:'#555' }}>Perfil não encontrado</div>
          ) : (
            <>
              {/* Perfil */}
              <div style={{ padding:'20px 16px', display:'flex', alignItems:'center', gap:14, borderBottom:'1px solid #111' }}>
                {perfil.avatar_url ? (
                  <img src={perfil.avatar_url} style={{ width:56, height:56, borderRadius:'50%', border:`2px solid ${NIVEL_COLOR[perfil.nivel]}`, objectFit:'cover' }} alt="Avatar" />
                ) : (
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'#F5C400', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, color:'#111' }}>
                    {(perfil.apelido||perfil.nome||'?').charAt(0)}
                  </div>
                )}
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:18, fontWeight:900, color:'#fff' }}>
                    {perfil.apelido || perfil.nome}
                    {isMe && <span style={{ fontSize:11, color:'#F5C400', marginLeft:8 }}>(você)</span>}
                  </div>
                  <div style={{ fontSize:13, color: NIVEL_COLOR[perfil.nivel], fontWeight:700, marginTop:2 }}>
                    {NIVEL_ICON[perfil.nivel]} {perfil.nivel}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:22, fontWeight:900, color:'#F5C400' }}>{perfil.pontos_total}</div>
                  <div style={{ fontSize:9, color:'#555', textTransform:'uppercase' }}>pts totais</div>
                </div>
              </div>

              {/* Palpite */}
              {palpite && (
                <div style={{ margin:'16px 16px 0', padding:'12px 16px', background:'#111', border:'1px solid #1a1a1a', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ fontSize:11, color:'#555', textTransform:'uppercase', letterSpacing:1 }}>Palpite</div>
                  <div style={{ fontSize:20, fontWeight:900, color:'#F5C400' }}>
                    {palpite.gols_mandante} × {palpite.gols_visitante}
                  </div>
                </div>
              )}

              {/* Campo */}
              {escalacao ? (
                <div style={{ padding:'16px 0', display:'flex', justifyContent:'center' }}>
                  <div style={{ position:'relative', width:CAMPO_W, height:CAMPO_H, borderRadius:8, overflow:'hidden', background:'#2a7a2a' }}>
                    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} viewBox="0 0 68 105" preserveAspectRatio="none">
                      {[0,1,2,3,4,5,6].map(i => <rect key={i} x="0" y={i*15} width="68" height="7.5" fill={i%2===0?'rgba(255,255,255,0.04)':'transparent'} />)}
                      <rect x="2" y="3" width="64" height="99" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
                      <line x1="2" y1="52.5" x2="66" y2="52.5" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                      <circle cx="34" cy="52.5" r="9.15" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
                    </svg>
                    {slots.map(slot => {
                      const p = lineup[slot.id];
                      const player = p?.id ? PLAYERS[p.id] : null;
                      if (!player) return null;
                      return (
                        <div key={slot.id} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%,-50%)', zIndex:10 }}>
                          <TigreFCPlayerCard player={player} size={SLOT_SZ}
                            isCapitao={escalacao.capitao_id === player.id}
                            isHeroi={escalacao.heroi_id === player.id} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ padding:24, textAlign:'center', color:'#555', fontSize:13 }}>
                  {!jogoId ? 'Nenhuma rodada disponível.' : isMe ? 'Você ainda não escalou nessa rodada.' : 'Escalação não divulgada ainda.'}
                </div>
              )}

              {/* Corneta */}
              <div style={{ padding:'
