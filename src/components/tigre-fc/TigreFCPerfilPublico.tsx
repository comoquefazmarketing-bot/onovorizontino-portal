'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCPlayerCard from '@/components/tigre-fc/TigreFCPlayerCard';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const PLAYERS: Record<number, any> = {
  1:  { id:1,  name:'César Augusto',  short:'César',     num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  2:  { id:2,  name:'Jordi',          short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  3:  { id:3,  name:'João Scapin',    short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  4:  { id:4,  name:'Lucas Ribeiro',  short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  5:  { id:5,  name:'Lora',           short:'Lora',       num:2,  pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  6:  { id:6,  name:'Castrillón',     short:'Castrillón', num:6,  pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  7:  { id:7,  name:'Arthur Barbosa', short:'A.Barbosa',  num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  8:  { id:8,  name:'Mayk',           short:'Mayk',       num:26, pos:'LAT', foto:BASE+'MAYK.jpg.webp' },
  9:  { id:9,  name:'Maykon Jesus',   short:'Maykon',     num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  10: { id:10, name:'Dantas',          short:'Dantas',      num:3,  pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  11: { id:11, name:'Eduardo Brock',  short:'E.Brock',     num:5,  pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  12: { id:12, name:'Patrick',         short:'Patrick',     num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  13: { id:13, name:'Gabriel Bahia',  short:'G.Bahia',     num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  14: { id:14, name:'Carlinhos',       short:'Carlinhos',   num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  15: { id:15, name:'Alemão',          short:'Alemão',      num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  16: { id:16, name:'Renato Palm',    short:'R.Palm',      num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  17: { id:17, name:'Alvariño',       short:'Alvariño',    num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  18: { id:18, name:'Bruno Santana',  short:'B.Santana',   num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  19: { id:19, name:'Luís Oyama',      short:'Oyama',       num:8,  pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  20: { id:20, name:'Léo Naldi',      short:'L.Naldi',     num:7,  pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  21: { id:21, name:'Rômulo',          short:'Rômulo',      num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  22: { id:22, name:'Matheus Bianqui', short:'Bianqui',     num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  23: { id:23, name:'Juninho',         short:'Juninho',     num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  24: { id:24, name:'Tavinho',         short:'Tavinho',     num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  25: { id:25, name:'Diego Galo',      short:'D.Galo',      num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  26: { id:26, name:'Marlon',          short:'Marlon',      num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  27: { id:27, name:'Hector Bianchi', short:'Hector',      num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  28: { id:28, name:'Nogueira',       short:'Nogueira',    num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  29: { id:29, name:'Luiz Gabriel',   short:'L.Gabriel',   num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  30: { id:30, name:'Jhones Kauê',    short:'J.Kauê',      num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  31: { id:31, name:'Robson',          short:'Robson',      num:9,  pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  32: { id:32, name:'Vinícius Paiva', short:'V.Paiva',     num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  33: { id:33, name:'Hélio Borges',   short:'H.Borges',    num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  34: { id:34, name:'Jardiel',         short:'Jardiel',     num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  35: { id:35, name:'Nicolas Careca', short:'N.Careca',    num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  36: { id:36, name:'Titi Ortiz',     short:'T.Ortiz',     num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  37: { id:37, name:'Diego Mathias',  short:'D.Mathias',   num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  38: { id:38, name:'Carlão',          short:'Carlão',      num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  39: { id:39, name:'Ronald Barcellos', short:'Ronald',      num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
};

const SLOTS: Record<string, { id:string; x:number; y:number }[]> = {
  '4-3-3':   [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'cm1',x:72,y:50},{id:'cm2',x:50,y:46},{id:'cm3',x:28,y:50},{id:'rw',x:76,y:24},{id:'st',x:50,y:18},{id:'lw',x:24,y:24}],
  '4-4-2':   [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'rm',x:80,y:50},{id:'cm1',x:60,y:50},{id:'cm2',x:40,y:50},{id:'lm',x:20,y:50},{id:'st1',x:64,y:22},{id:'st2',x:36,y:22}],
  '3-5-2':   [{id:'gk',x:50,y:88},{id:'cb1',x:70,y:72},{id:'cb2',x:50,y:75},{id:'cb3',x:30,y:72},{id:'rb',x:86,y:52},{id:'cm1',x:68,y:50},{id:'cm2',x:50,y:46},{id:'cm3',x:32,y:50},{id:'lb',x:14,y:52},{id:'st1',x:64,y:22},{id:'st2',x:36,y:22}],
  '4-2-3-1': [{id:'gk',x:50,y:88},{id:'rb',x:82,y:70},{id:'cb1',x:62,y:70},{id:'cb2',x:38,y:70},{id:'lb',x:18,y:70},{id:'dm1',x:64,y:57},{id:'dm2',x:36,y:57},{id:'rm',x:76,y:38},{id:'am',x:50,y:36},{id:'lm',x:24,y:38},{id:'st',x:50,y:18}],
};

export default function TigreFCPerfilPublico({ targetUserId, jogoId, onClose }: any) {
  const [perfil, setPerfil] = useState<any>(null);
  const [escalacao, setEscalacao] = useState<any>(null);
  const [pontuacoes, setPontuacoes] = useState<Record<number, number>>({}); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!targetUserId || !jogoId) return;
      try {
        const { data: uData } = await supabase.from('tigre_fc_usuarios').select('*').eq('id', targetUserId).single();
        setPerfil(uData);

        const { data: escData } = await supabase.from('tigre_fc_escalacoes').select('*').eq('usuario_id', targetUserId).eq('jogo_id', jogoId).maybeSingle();
        setEscalacao(escData);

        const { data: scoutData } = await supabase.from('tigre_fc_scouts_jogadores').select('jogador_id, pontos').eq('jogo_id', jogoId);
        
        const ptsMap: Record<number, number> = {};
        scoutData?.forEach(s => ptsMap[Number(s.jogador_id)] = s.pontos);
        setPontuacoes(ptsMap);

      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    loadData();
  }, [targetUserId, jogoId]);

  if (loading) return null;

  const slots = SLOTS[escalacao?.formacao || '4-3-3'];
  const lineup = escalacao?.lineup || {};
  const capitaoId = Number(escalacao?.capitao_id);

  // Lógica de pontos e herói
  const playerScores = Object.values(lineup).map((val: any) => {
    const id = Number(typeof val === 'object' ? val.id : val);
    return { id, score: pontuacoes[id] || 0 };
  });

  const totalPontosEscalados = playerScores.reduce((acc, p) => {
    const multiplicador = p.id === capitaoId ? 1.5 : 1;
    return acc + (p.score * multiplicador);
  }, 0);

  const heroiId = playerScores.length > 0 
    ? playerScores.reduce((prev, current) => (prev.score > current.score) ? prev : current).id 
    : null;

  const getNotaColor = (n: number) => {
    if (n >= 8) return '#2ecc71';
    if (n >= 5) return '#f1c40f';
    if (n > 0) return '#e67e22';
    return '#95a5a6';
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.95)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(10px)', padding:10 }}>
      <div style={{ width:'100%', maxWidth:450, background:'#0a0a0a', borderRadius:24, border:'1px solid #333', maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        
        {/* Header */}
        <div style={{ background:'#F5C400', padding:'15px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:10, fontWeight:900, color:'rgba(0,0,0,0.5)', textTransform:'uppercase' }}>Review da Rodada</div>
            <div style={{ fontSize:16, fontWeight:900, color:'#000' }}>{perfil?.apelido || perfil?.nome || 'Torcedor'}</div>
          </div>
          <button onClick={onClose} style={{ background:'#000', color:'#F5C400', border:'none', width:30, height:30, borderRadius:'50%', fontWeight:900, cursor:'pointer' }}>×</button>
        </div>

        <div style={{ overflowY:'auto', flex:1, padding:'20px 0' }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:15 }}>
            
            {/* CAMPO DE FUTEBOL */}
            <div style={{ position:'relative', width:320, height:440, background:'#0d2b0d', borderRadius:10, border:'2px solid #1a1a1a', overflow:'hidden', backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
              <div style={{ position:'absolute', inset:10, border:'1px solid rgba(255,255,255,0.2)' }} />
              <div style={{ position:'absolute', top:'50%', width:'100%', height:1, background:'rgba(255,255,255,0.2)' }} />
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:80, height:80, border:'1px solid rgba(255,255,255,0.2)', borderRadius:'50%' }} />
              
              {escalacao && slots.map(slot => {
                const pId = Number(typeof lineup[slot.id] === 'object' ? lineup[slot.id]?.id : lineup[slot.id]);
                const p = PLAYERS[pId];
                if (!p) return null;
                const nota = pontuacoes[pId] || 0;
                const isCap = pId === capitaoId;

                return (
                  <div key={slot.id} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%, -50%)', textAlign:'center', zIndex:10 }}>
                    <div style={{ position:'relative' }}>
                      <TigreFCPlayerCard player={p} size={50} isCapitao={isCap} />
                      <div style={{ 
                        position:'absolute', bottom:-2, right:-5, 
                        background: getNotaColor(nota), color:'#000', 
                        fontSize:9, fontWeight:900, padding:'2px 4px', 
                        borderRadius:4, border:'1px solid #000', zIndex:20
                      }}>
                        {nota.toFixed(1)}
                      </div>
                    </div>
                    <div style={{ fontSize:9, color:'#fff', fontWeight:900, marginTop:4, textShadow:'1px 1px 2px #000', background: 'rgba(0,0,0,0.5)', padding: '1px 4px', borderRadius: 4 }}>
                        {p.short}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAINEL DE PONTUAÇÃO */}
            <div style={{ width:'100%', padding:'0 20px' }}>
              <div style={{ background:'#111', borderRadius:16, border:'1px solid #222', padding:15 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:15, alignItems: 'center' }}>
                    <span style={{ color:'#F5C400', fontSize:12, fontWeight:900, textTransform:'uppercase' }}>Destaques do Jogo</span>
                    <span style={{ color:'#fff', fontSize:14, fontWeight:900 }}>{totalPontosEscalados.toFixed(1)} <small style={{fontSize: 10, color: '#F5C400'}}>PTS</small></span>
                </div>
                
                <div style={{ display:'flex', gap:10, marginBottom: 20 }}>
                  <div style={{ flex:1, background:'#000', padding:10, borderRadius:12, border:'1px solid #333' }}>
                    <div style={{ fontSize:8, color:'#666', fontWeight:900 }}>CAPITÃO (x1.5)</div>
                    <div style={{ fontSize:12, color:'#fff', fontWeight:900 }}>{PLAYERS[capitaoId]?.short || '---'}</div>
                  </div>
                  <div style={{ flex:1, background:'#000', padding:10, borderRadius:12, border:'1px solid #333' }}>
                    <div style={{ fontSize:8, color:'#666', fontWeight:900 }}>O HERÓI</div>
                    <div style={{ fontSize:12, color:'#2ecc71', fontWeight:900 }}>{PLAYERS[heroiId || 0]?.short || '---'}</div>
                  </div>
                </div>

                <div style={{ fontSize:10, color:'#444', fontWeight:900, marginBottom:8 }}>CONFERÊNCIA DE SCOUTS</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  {playerScores.map((item: any) => {
                    const p = PLAYERS[item.id];
                    if(!p) return null;
                    return (
                      <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', padding:'6px 10px', borderRadius:6 }}>
                        <span style={{ fontSize:10, color:'#bbb' }}>{p.short}</span>
                        <span style={{ fontSize:10, fontWeight:900, color: getNotaColor(item.score) }}>
                          {item.score.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ padding:15, textAlign:'center', color:'#444', fontSize:10, fontWeight:700 }}>
          DADOS OFICIAIS TIGRE FC • ATUALIZADO EM TEMPO REAL
        </div>
      </div>
    </div>
  );
}
