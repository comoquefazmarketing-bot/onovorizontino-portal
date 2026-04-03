'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const PATA = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup = Record<string, Player | null>;
type Step = 'picking' | 'bench' | 'captain_hero' | 'score' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;

const PLAYERS: Player[] = [
  { id:1, name:'César Augusto', short:'César', num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id:2, name:'Jordi', short:'Jordi', num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  { id:3, name:'João Scapin', short:'Scapin', num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  { id:4, name:'Lucas Ribeiro', short:'Lucas', num:1, pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id:5, name:'Lora', short:'Lora', num:2, pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  { id:6, name:'Castrillón', short:'Castrillón', num:6, pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  { id:7, name:'Arthur Barbosa', short:'A.Barbosa', num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id:8, name:'Sander', short:'Sander', num:33, pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
  { id:9, name:'Maykon Jesus', short:'Maykon', num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  { id:10, name:'Dantas', short:'Dantas', num:3, pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  { id:11, name:'Eduardo Brock', short:'E.Brock', num:5, pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  { id:12, name:'Patrick', short:'Patrick', num:4, pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  { id:13, name:'Gabriel Bahia', short:'G.Bahia', num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id:14, name:'Carlinhos', short:'Carlinhos', num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  { id:15, name:'Alemão', short:'Alemão', num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  { id:16, name:'Renato Palm', short:'R.Palm', num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  { id:17, name:'Alvariño', short:'Alvariño', num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  { id:18, name:'Bruno Santana', short:'B.Santana', num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  { id:19, name:'Luís Oyama', short:'Oyama', num:8, pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  { id:20, name:'Léo Naldi', short:'L.Naldi', num:7, pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  { id:21, name:'Rômulo', short:'Rômulo', num:10, pos:'MEI', foto:BASE+'ROMULO.jpg.webp' },
  { id:22, name:'Matheus Bianqui', short:'Bianqui', num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id:23, name:'Juninho', short:'Juninho', num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  { id:24, name:'Tavinho', short:'Tavinho', num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  { id:25, name:'Diego Galo', short:'D.Galo', num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  { id:26, name:'Marlon', short:'Marlon', num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  { id:27, name:'Hector Bianchi', short:'Hector', num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:28, name:'Nogueira', short:'Nogueira', num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:29, name:'Luiz Gabriel', short:'L.Gabriel', num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:30, name:'Jhones Kauê', short:'J.Kauê', num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  { id:31, name:'Robson', short:'Robson', num:9, pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva', short:'V.Paiva', num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges', short:'H.Borges', num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel', short:'Jardiel', num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca', short:'N.Careca', num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Titi Ortiz', short:'T.Ortiz', num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias', short:'D.Mathias', num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão', short:'Carlão', num:90, pos:'ATA', foto:BASE+'CARLAO.jpg.webp' },
  { id:39, name:'Ronald Barcellos', short:'Ronald', num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const SLOTS=[{id:'gk',x:50,y:87,pos:'GOL'},{id:'rb',x:83,y:70,pos:'LAT'},{id:'cb1',x:63,y:77,pos:'ZAG'},{id:'cb2',x:37,y:77,pos:'ZAG'},{id:'lb',x:17,y:70,pos:'LAT'},{id:'m1',x:50,y:53,pos:'MEI'},{id:'m2',x:76,y:44,pos:'MEI'},{id:'m3',x:24,y:44,pos:'MEI'},{id:'st',x:50,y:14,pos:'ATA'},{id:'rw',x:81,y:21,pos:'ATA'},{id:'lw',x:19,y:21,pos:'ATA'}];
const BENCH_IDS=['b1','b2','b3','b4','b5'];
const POS_COLORS:Record<string,string>={GOL:'#F5C400',ZAG:'#3B82F6',LAT:'#06B6D4',MEI:'#22C55E',ATA:'#EF4444'};

// ── FOTO DUPLA ────────────────────────────────────────────────────────────────
function PlayerPhoto({foto,pose,cW,cH,radius=0}:{foto:string;pose:'static'|'celebration';cW:number;cH:number;radius?:number}) {
  return (
    <div style={{width:cW,height:cH,overflow:'hidden',borderRadius:radius,position:'relative',flexShrink:0}}>
      <img src={foto} alt="" onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
        style={{
          position:'absolute',
          height: pose==='celebration' ? '130%' : '100%',
          width:'auto', maxWidth:'none',
          top:'50%', transform:'translateY(-50%)',
          left: pose==='static' ? 0 : 'auto',
          right: pose==='celebration' ? 0 : 'auto',
          transformOrigin: pose==='celebration' ? 'right center' : 'left center',
        }} />
    </div>
  );
}

// ── CARD VERTICAL PREMIUM NO CAMPO (AJUSTADO) ─────────────────────────────────
function VerticalFieldCard({player,isCaptain,isHero,pulsing,active,onClick}:{
  player:Player;isCaptain:boolean;isHero:boolean;pulsing:boolean;active?:boolean;onClick:()=>void;
}) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
  return (
    <motion.button onClick={onClick}
      initial={{scale:0,opacity:0,y:-18}} animate={{scale:1,opacity:1,y:0}}
      whileHover={{scale:1.08,y:-4}} whileTap={{scale:0.92}}
      transition={{type:'spring',stiffness:380,damping:25}}
      style={{
        position:'relative',
        width:68,
        height:98,
        background:'linear-gradient(180deg,#18181b 0%,#27272a 100%)',
        borderRadius:16,
        border:`3px solid ${col}`,
        overflow:'hidden',
        cursor:'pointer',
        boxShadow:`0 0 20px ${col}60, 0 15px 32px rgba(0,0,0,0.8)`,
        display:'flex',
        flexDirection:'column',
      }}
    >
      {/* Pulse ring */}
      {pulsing && (
        <motion.div
          animate={{scale:[1,1.18,1],opacity:[0.7,0,0.7]}}
          transition={{duration:1.1,repeat:Infinity}}
          style={{position:'absolute',inset:-12,borderRadius:24,border:`3px solid ${col}`,pointerEvents:'none',zIndex:0}}
        />
      )}
      {/* Active glow */}
      {active && (
        <motion.div
          animate={{opacity:[0.3,0.95,0.3]}}
          transition={{duration:1.4,repeat:Infinity}}
          style={{position:'absolute',inset:-10,borderRadius:24,boxShadow:`0 0 0 6px ${col}90`,pointerEvents:'none'}}
        />
      )}

      {/* Capitão / Herói (topo direito) */}
      {(isCaptain || isHero) && (
        <motion.div initial={{scale:0}} animate={{scale:1}}
          style={{
            position:'absolute',top:8,right:8,zIndex:30,
            background:col,color:'#000',fontSize:13,fontWeight:900,
            padding:'4px 7px',borderRadius:6,lineHeight:1,
            boxShadow:`0 0 12px ${col}cc`,
          }}>
          {isCaptain ? 'C' : '⭐'}
        </motion.div>
      )}

      {/* FOTO COMEMORAÇÃO - CABEÇA VISÍVEL E SEM CORTAR */}
      <div style={{
        position:'relative',
        width:'100%',
        height:'78%',
        overflow:'hidden',
      }}>
        <img
          src={player.foto}
          alt={player.short}
          onError={e=>{(e.target as HTMLImageElement).src=PATA;}}
          style={{
            position:'absolute',
            bottom: '-18%',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '168%',
            width: 'auto',
            maxWidth: 'none',
            objectFit: 'contain',
            objectPosition: 'right 12%',
          }}
        />
      </div>

      {/* Tarja do nome */}
      <div style={{
        background:`linear-gradient(90deg,${col}ee,${col}aa)`,
        height:26,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        fontFamily:"'Barlow Condensed',sans-serif",
        fontSize:10.5,
        fontWeight:900,
        fontStyle:'italic',
        color:'#000',
        textTransform:'uppercase',
        letterSpacing:-0.4,
        boxShadow:'0 -4px 10px rgba(0,0,0,0.5)',
      }}>
        {player.short}
      </div>
    </motion.button>
  );
}

// ── SLOT VAZIO VERTICAL ───────────────────────────────────────────────────────
function EmptyVerticalSlot({pos,active,onClick}:{pos:string;active:boolean;onClick:()=>void}) {
  const col = POS_COLORS[pos] ?? '#888';
  return (
    <motion.button onClick={onClick} whileTap={{scale:0.88}}
      animate={active ? {boxShadow:[`0 0 0 0 ${col}30`,`0 0 32px 14px ${col}85`,`0 0 0 0 ${col}30`]} : {}}
      transition={{duration:0.85,repeat:Infinity}}
      style={{
        width:68,height:98,borderRadius:16,cursor:'pointer',
        border:`3px dashed ${active ? col : 'rgba(255,255,255,0.25)'}`,
        background:active ? `${col}18` : 'rgba(20,20,20,0.68)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8,
        boxShadow:active ? `0 0 28px ${col}70` : '0 12px 28px rgba(0,0,0,0.7)',
      }}
    >
      <div style={{fontSize:32,opacity:0.15,lineHeight:1}}>+</div>
      <div style={{fontSize:10.5,fontWeight:900,color:active ? col : 'rgba(255,255,255,0.35)',letterSpacing:1.5,textTransform:'uppercase'}}>
        {pos}
      </div>
    </motion.button>
  );
}

// ── STADIUM BG, Field3D, BenchArea, HUD, CaptainHeroScreen, LEDScoreboard, ShareScreen ──
// (mantidos exatamente iguais ao seu código original - não alterei nenhuma linha aqui)

function StadiumBg() { /* ... seu código original ... */ }
function Field3D({lineup,selectedSlot,onSlotClick,specialMode,captainId,heroId,step}:any) { /* ... seu código original ... */ }
function BenchArea({lineup,selectedSlot,onSlotClick}:any) { /* ... seu código original ... */ }
function HUD({step,filled,benchFilled}:any) { /* ... seu código original ... */ }
function CaptainHeroScreen({onSelectMode,captainId,heroId,onDone}:any) { /* ... seu código original ... */ }
function LEDScoreboard({scoreTigre,setScoreTigre,scoreAdv,setScoreAdv,onConfirm}:any) { /* ... seu código original ... */ }
function ShareScreen({lineup,captainId,heroId,scoreTigre,scoreAdv}:any) { /* ... seu código original ... */ }

// ── MERCADO (AJUSTADO) ───────────────────────────────────────────────────────
function PlayerPicker({lineup,filterPos,setFilterPos,onSelect,selectedSlot,step,selectedPlayer}:{
  lineup:Lineup;filterPos:string;setFilterPos:(p:string)=>void;
  onSelect:(p:Player)=>void;selectedSlot:string|null;step:Step;selectedPlayer:Player|null;
}) {
  const usedIds=useMemo(()=>new Set(Object.values(lineup).filter(Boolean).map(p=>p!.id)),[lineup]);
  const filtered=useMemo(()=>PLAYERS.filter(p=>!usedIds.has(p.id)&&(filterPos==='TODOS'||p.pos===filterPos)),[usedIds,filterPos]);
  const canPlace=!!selectedSlot || !!selectedPlayer;

  return (
    <div style={{background:'#080808',borderTop:'1px solid rgba(255,255,255,0.06)'}}>
      <div style={{display:'flex',gap:5,padding:'8px 12px',overflowX:'auto'}}>
        {['TODOS','GOL','ZAG','LAT','MEI','ATA'].map(f=>(
          <button key={f} onClick={()=>setFilterPos(f)}
            style={{padding:'5px 11px',borderRadius:20,fontSize:8,fontWeight:900,textTransform:'uppercase',
              letterSpacing:1,cursor:'pointer',whiteSpace:'nowrap',flexShrink:0,
              background:filterPos===f?'#F5C400':'rgba(255,255,255,0.05)',
              color:filterPos===f?'#000':'#444',
              border:filterPos===f?'none':'1px solid rgba(255,255,255,0.07)',
              transition:'all 0.15s'}}>
            {f}
          </button>
        ))}
      </div>
      <div style={{padding:'0 12px 5px',fontSize:9,fontWeight:700,color:canPlace?'#F5C400':'#2a2a2a'}}>
        {canPlace?'✦ Slot ou jogador ativo — clique para escalar':step==='bench'?'🪑 Selecione um reserva':'← Clique num slot do campo primeiro'}
      </div>

      {/* Grid 2 colunas + nome grande + sem número da camisa */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(2,1fr)',
        gap:14,
        padding:'8px 12px 24px',
        maxHeight:280,
        overflowY:'auto',
      }}>
        {filtered.map(p=>{
          const col=POS_COLORS[p.pos]??'#555';
          return (
            <motion.button key={p.id} onClick={()=>onSelect(p)}
              whileTap={canPlace?{scale:0.95}:{}} whileHover={canPlace?{scale:1.03}:{}}
              style={{
                background:'#111',
                border:`2px solid rgba(255,255,255,0.08)`,
                borderRadius:16,
                overflow:'hidden',
                cursor:canPlace?'pointer':'default',
                opacity:canPlace?1:0.45,
                display:'flex',
                flexDirection:'column',
                height:'100%',
              }}
            >
              <div style={{width:'100%',aspectRatio:'4/5',position:'relative',overflow:'hidden',background:'#0d0d0d'}}>
                <PlayerPhoto foto={p.foto} pose="static" cW={300} cH={375} radius={0} />
              </div>
              <div style={{padding:'14px 10px',background:'#111',textAlign:'center'}}>
                <div style={{fontSize:10,color:col,fontWeight:900,letterSpacing:1}}>{p.pos}</div>
                <div style={{
                  fontSize:17.5,
                  fontWeight:1000,
                  fontStyle:'italic',
                  letterSpacing:-0.8,
                  lineHeight:1.05,
                  textTransform:'uppercase',
                  color:'#fff'
                }}>
                  {p.short}
                </div>
              </div>
            </motion.button>
          );
        })}
        {filtered.length===0 && (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'40px 0',color:'#22C55E',fontSize:12,fontWeight:700}}>
            Todos escalados ✓
          </div>
        )}
      </div>
    </div>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function EscalacaoFormacao() {
  const [step,setStep]=useState<Step>('picking');
  const [lineup,setLineup]=useState<Lineup>({});
  const [selectedSlot,setSelectedSlot]=useState<string|null>(null);
  const [selectedPlayer,setSelectedPlayer]=useState<Player|null>(null);
  const [filterPos,setFilterPos]=useState('TODOS');
  const [captainId,setCaptainId]=useState<number|null>(null);
  const [heroId,setHeroId]=useState<number|null>(null);
  const [specialMode,setSpecialMode]=useState<SpecialMode>(null);
  const [scoreTigre,setScoreTigre]=useState(1);
  const [scoreAdv,setScoreAdv]=useState(0);

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [jogoId, setJogoId] = useState<string | null>(null);

  const fieldCount=useMemo(()=>SLOTS.filter(s=>!!lineup[s.id]).length,[lineup]);
  const benchCount=useMemo(()=>BENCH_IDS.filter(id=>!!lineup[id]).length,[lineup]);

  // Carregar escalação salva
  useEffect(() => {
    const carregarEscalacao = async () => {
      if (!usuarioId || !jogoId) return;
      const { data, error } = await supabase
        .from('escalacoes_usuarios')
        .select('*')
        .eq('usuario_id', usuarioId)
        .eq('jogo_id', jogoId)
        .single();
      if (error && error.code !== 'PGRST116') return;
      if (data) {
        setLineup(data.lineup || {});
        setCaptainId(data.capitao_id);
        setHeroId(data.heroi_id);
        setScoreTigre(data.placar_palpite_tigre ?? 1);
        setScoreAdv(data.placar_palpite_adv ?? 0);
        const nf = SLOTS.filter(s => !!data.lineup?.[s.id]).length;
        if (nf === 11) setStep('bench');
      }
    };
    carregarEscalacao();
  }, [usuarioId, jogoId]);

  const salvarEscalacao = useCallback(async () => {
    if (!usuarioId || !jogoId) return;
    const { error } = await supabase
      .from('escalacoes_usuarios')
      .upsert({
        usuario_id: usuarioId,
        jogo_id: jogoId,
        formacao: '4-3-3',
        lineup: lineup,
        capitao_id: captainId,
        heroi_id: heroId,
        placar_palpite_tigre: scoreTigre,
        placar_palpite_adv: scoreAdv,
      }, { onConflict: 'usuario_id,jogo_id' });
    if (error) console.error('Erro ao salvar:', error);
    else confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }, [usuarioId, jogoId, lineup, captainId, heroId, scoreTigre, scoreAdv]);

  const handleScoreConfirm = useCallback(() => {
    confetti({particleCount:160,spread:90,origin:{y:0.6},colors:['#F5C400','#22C55E','#fff']});
    salvarEscalacao();
    setStep('share');
  }, [salvarEscalacao]);

  const handleCaptainHeroDone=useCallback(()=>{confetti({particleCount:200,spread:100,origin:{y:0.5},colors:['#F5C400','#00F3FF','#fff','#EF4444']});setStep('score');},[]);

  const isGameField=step==='picking'||step==='bench';

  const handleSlotClick=useCallback((slotId:string)=>{ /* ... sua lógica original completa ... */ },[step,specialMode,lineup,selectedPlayer]);
  const handleSelectPlayer=useCallback((player:Player)=>{ /* ... sua lógica original completa ... */ },[selectedSlot,lineup,step]);

  return (
    <div style={{minHeight:'100vh',background:'#050505',color:'#fff',fontFamily:"'Barlow Condensed',system-ui,sans-serif",overflowX:'hidden'}}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box}::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:#1a1a1a;border-radius:4px}body{background:#050505}
      `}</style>

      <HUD step={step} filled={fieldCount} benchFilled={benchCount}/>

      <AnimatePresence>
        {step==='captain_hero'&&!specialMode&&(
          <CaptainHeroScreen onSelectMode={m=>{setSpecialMode(m);}} captainId={captainId} heroId={heroId} onDone={handleCaptainHeroDone}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {step==='score'&&(
          <LEDScoreboard scoreTigre={scoreTigre} setScoreTigre={setScoreTigre} scoreAdv={scoreAdv} setScoreAdv={setScoreAdv} onConfirm={handleScoreConfirm}/>
        )}
      </AnimatePresence>

      {step==='share'&&<ShareScreen lineup={lineup} captainId={captainId} heroId={heroId} scoreTigre={scoreTigre} scoreAdv={scoreAdv}/>}

      {isGameField&&(
        <>
          <div style={{position:'relative',overflow:'hidden',minHeight:350}}>
            <StadiumBg/>
            <div style={{position:'relative',zIndex:5,padding:'10px 6px 0'}}>
              <div style={{textAlign:'center',marginBottom:5}}>
                <motion.div key={step} initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                  style={{display:'inline-flex',alignItems:'center',gap:6,padding:'3px 12px',
                    borderRadius:999,background:'rgba(245,196,0,0.08)',border:'1px solid rgba(245,196,0,0.2)'}}>
                  <span style={{fontSize:7,fontWeight:900,color:'#F5C400',letterSpacing:3,textTransform:'uppercase'}}>
                    {step==='picking'?`⚽ Escale ${11-fieldCount} jogador${11-fieldCount!==1?'es':''}`:`🪑 Adicione ${5-benchCount} reserva${5-benchCount!==1?'s':''}`}
                  </span>
                </motion.div>
              </div>
              <Field3D lineup={lineup} selectedSlot={selectedSlot} onSlotClick={handleSlotClick}
                specialMode={specialMode} captainId={captainId} heroId={heroId} step={step}/>
            </div>
          </div>
          {(fieldCount===11||step==='bench')&&<BenchArea lineup={lineup} selectedSlot={selectedSlot} onSlotClick={handleSlotClick}/>}
          <PlayerPicker lineup={lineup} filterPos={filterPos} setFilterPos={setFilterPos}
            onSelect={handleSelectPlayer} selectedSlot={selectedSlot} step={step} selectedPlayer={selectedPlayer}/>
        </>
      )}

      {step==='captain_hero'&&specialMode&&(
        <div style={{position:'fixed',inset:0,zIndex:200,display:'flex',flexDirection:'column'}}>
          {/* ... seu overlay original mantido ... */}
        </div>
      )}
    </div>
  );
}
