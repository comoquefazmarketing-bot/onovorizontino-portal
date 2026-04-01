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
  1:  { id:1,  name:'César Augusto',  short:'César',      num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  2:  { id:2,  name:'Jordi',          short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  3:  { id:3,  name:'João Scapin',    short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  4:  { id:4,  name:'Lucas Ribeiro',  short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  5:  { id:5,  name:'Lora',           short:'Lora',       num:2,  pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  6:  { id:6,  name:'Castrillón',     short:'Castrillón', num:6,  pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  7:  { id:7,  name:'Arthur Barbosa', short:'A.Barbosa',  num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  8:  { id:8,  name:'Mayk',           short:'Mayk',       num:26, pos:'LAT', foto:BASE+'MAYK.jpg.webp' },
  9:  { id:9,  name:'Maykon Jesus',   short:'Maykon',     num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  10: { id:10, name:'Dantas',         short:'Dantas',      num:3,  pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
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

  const lineup = escalacao?.lineup || {};
  const slots = SLOTS[escalacao?.formacao || '4-3-3'];
  const capitaoId = Number(escalacao?.capitao_id);

  // EXTRAÇÃO DINÂMICA: Mapeia os IDs vindos do objeto lineup no banco
  const playerScores = Object.keys(lineup).map((key) => {
    const val = lineup[key];
    const id = Number(typeof val === 'object' ? val.id : val);
    return { id, score: (pontuacoes[id] || 0) as number };
  }).filter(p => p.id > 0);

  // Lógica do Herói (Maior pontuação real)
  const heroiId = playerScores.length > 0 
    ? playerScores.reduce((prev, current) => (prev.score > current.score) ? prev : current).id 
    : null;

  const totalPontosEscalados: number = playerScores.reduce((acc, p) => {
    const multiplicador = p.id === capitaoId ? 1.5 : 1;
    return acc + (p.score * multiplicador);
  }, 0);

  const getNotaColor = (n: number) => {
    if (n >= 8) return '#4ade80';
    if (n >= 5) return '#facc15';
    if (n > 0) return '#fb923c';
    return '#94a3b8';
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.95)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(15px)', padding:10 }}>
      <div style={{ width:'100%', maxWidth:440, background:'#050505', borderRadius:32, border:'1px solid #222', maxHeight:'95vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.8)' }}>
        
        {/* Header Estilizado */}
        <div style={{ background:'linear-gradient(135deg, #F5C400 0%, #D4A900 100%)', padding:'20px 25px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'4px solid #000' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:1000, color:'rgba(0,0,0,0.4)', textTransform:'uppercase', letterSpacing:'1px' }}>Time do Rival</div>
            <div style={{ fontSize:22, fontWeight:1000, color:'#000', textTransform:'uppercase', fontStyle:'italic', lineHeight:1 }}>
              {perfil?.apelido || perfil?.nome || 'TREINADOR'}
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background:'#000', color:'#F5C400', border:'none', width:36, height:36, borderRadius:'50%', fontWeight:1000, cursor:'pointer' }}
          >
            ✕
          </button>
        </div>

        <div style={{ overflowY:'auto', flex:1, paddingBottom:30 }}>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            
            {/* Campo de Futebol com Slots Dinâmicos */}
            <div style={{ 
              position:'relative', width:360, height:480, marginTop:20, borderRadius:24, border:'4px solid #1a1a1a', overflow:'hidden',
              background: 'radial-gradient(circle at center, #1a4a1a 0%, #0d2b0d 100%)',
              boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)'
            }}>
              <div style={{ position:'absolute', inset:15, border:'2px solid rgba(255,255,255,0.1)' }} />
              <div style={{ position:'absolute', top:'50%', width:'100%', height:'2px', background:'rgba(255,255,255,0.1)' }} />
              
              {slots.map(slot => {
                const pData = lineup[slot.id];
                const pId = Number(typeof pData === 'object' ? pData?.id : pData);
                const p = PLAYERS[pId];
                if (!p) return null;

                const nota = pontuacoes[pId] || 0;
                const isCap = pId === capitaoId;
                const isHer = pId === heroiId;

                return (
                  <div key={slot.id} style={{ position:'absolute', left:`${slot.x}%`, top:`${slot.y}%`, transform:'translate(-50%, -50%)', zIndex: isCap || isHer ? 50 : 10 }}>
                    <div style={{ position:'relative' }}>
                      <TigreFCPlayerCard 
                        player={p} 
                        size={58} 
                        isCapitao={isCap} 
                        isHeroi={isHer} 
                      />
                      <div style={{ 
                        position:'absolute', top:-5, right:-10, 
                        background: getNotaColor(nota), color:'#000', 
                        fontSize:10, fontWeight:1000, padding:'2px 6px', 
                        borderRadius:6, border:'2px solid #000', zIndex:60,
                        boxShadow:'0 4px 10px rgba(0,0,0,0.5)'
                      }}>
                        {nota.toFixed(1)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Painel de Resultados */}
            <div style={{ width:'100%', padding:'0 20px', marginTop:25 }}>
              <div style={{ background:'linear-gradient(180deg, #111 0%, #0a0a0a 100%)', borderRadius:24, border:'1px solid #222', padding:20 }}>
                
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                    <div style={{ color:'#666', fontSize:12, fontWeight:900, textTransform:'uppercase' }}>Pontuação Final</div>
                    <div style={{ color:'#fff', fontSize:28, fontWeight:1000, fontStyle:'italic' }}>
                      {totalPontosEscalados.toFixed(1)} <span style={{fontSize: 14, color: '#F5C400'}}>PTS</span>
                    </div>
                </div>
                
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:25 }}>
                  <div style={{ background:'rgba(255,215,0,0.05)', padding:12, borderRadius:16, border:'1px solid rgba(255,215,0,0.3)' }}>
                    <div style={{ fontSize:9, color:'#FFD700', fontWeight:900, marginBottom:4 }}>★ CAPITÃO (x1.5)</div>
                    <div style={{ fontSize:14, color:'#fff', fontWeight:800 }}>{PLAYERS[capitaoId]?.short || '---'}</div>
                  </div>
                  <div style={{ background:'rgba(0,255,255,0.05)', padding:12, borderRadius:16, border:'1px solid rgba(0,255,255,0.3)' }}>
                    <div style={{ fontSize:9, color:'#00f0ff', fontWeight:900, marginBottom:4 }}>💎 O HERÓI</div>
                    <div style={{ fontSize:14, color:'#fff', fontWeight:800 }}>{PLAYERS[heroiId || 0]?.short || '---'}</div>
                  </div>
                </div>

                <div style={{ fontSize:11, color:'#F5C400', fontWeight:1000, marginBottom:12, letterSpacing:1 }}>SCOUT DETALHADO</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {playerScores.sort((a,b) => b.score - a.score).map((item) => {
                    const p = PLAYERS[item.id];
                    if(!p) return null;
                    return (
                      <div key={item.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.03)', padding:'8px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.05)' }}>
                        <span style={{ fontSize:11, color:'#999', fontWeight:700 }}>{p.short}</span>
                        <span style={{ fontSize:11, fontWeight:1000, color: getNotaColor(item.score) }}>
                          {item.score.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => alert('Compartilhamento em breve!')}
                  style={{ 
                    width:'100%', marginTop:25, background:'#fff', color:'#000', border:'none', padding:'16px', borderRadius:16, 
                    fontWeight:1000, textTransform:'uppercase', fontSize:13, cursor:'pointer', letterSpacing:1
                  }}
                >
                  Compartilhar Resenha 🐯
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ padding:'15px', textAlign:'center', borderTop:'1px solid #1a1a1a', background:'#050505' }}>
          <span style={{ color:'#444', fontSize:10, fontWeight:1000, letterSpacing:2 }}>
            TIGRE FC • SEASON 2026 • OFFICIAL DATA
          </span>
        </div>
      </div>
    </div>
  );
}
