'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, type Transition, type TargetAndTransition } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
// ID Sofascore do último jogo realizado — Rodada 3: Novorizontino 1×1 CRB — 05/04/2026
const SOFASCORE_EVENT_ID = 15526006;

const ESCUDOS_SERIE_B: Record<string, string> = {
  'novorizontino': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png',
  'juventude':     'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/juventude.png',
  'crb':           'https://upload.wikimedia.org/wikipedia/commons/7/73/CRB_logo.svg',
  'america-mg':    'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png',
  'athletic-mg':   'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Athletic_Club_%28Minas_Gerais%29.svg/1280px-Athletic_Club_%28Minas_Gerais%29.svg.png',
  'atletico-go':   'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Atl%C3%A9tico_Clube_Goianiense_logo.svg/1280px-Atl%C3%A9tico_Clube_Goianiense_logo.svg.png',
  'avai':          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ava%C3%AD_Futebol_Clube_%28logo%29.svg/200px-Ava%C3%AD_Futebol_Clube_%28logo%29.svg.png',
  'botafogo-sp':   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Botafogo_Futebol_Clube_%28SP%29.svg/200px-Botafogo_Futebol_Clube_%28SP%29.svg.png',
  'ceara':         'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Cear%C3%A1_Sporting_Club.svg/200px-Cear%C3%A1_Sporting_Club.svg.png',
  'criciuma':      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Crici%C3%BAma_Esporte_Clube_logo.svg/200px-Crici%C3%BAma_Esporte_Clube_logo.svg.png',
  'cuiaba':        'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Cuiab%C3%A1_Esporte_Clube.svg/200px-Cuiab%C3%A1_Esporte_Clube.svg.png',
  'fortaleza':     'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Fortaleza_Esporte_Clube_logo.svg/200px-Fortaleza_Esporte_Clube_logo.svg.png',
  'goias':         'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Goi%C3%A1s_Esporte_Clube.svg/200px-Goi%C3%A1s_Esporte_Clube.svg.png',
  'londrina':      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Londrina_Esporte_Clube.svg/200px-Londrina_Esporte_Clube.svg.png',
  'nautico':       'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Clube_Nautico_Capibaribe.svg/200px-Clube_Nautico_Capibaribe.svg.png',
  'operario':      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Oper%C3%A1rio_Ferroviário_Esporte_Clube_logo.svg/200px-Oper%C3%A1rio_Ferroviário_Esporte_Clube_logo.svg.png',
  'ponte-preta':   'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Associa%C3%A7%C3%A3o_Atletica_Ponte_Preta.svg/200px-Associa%C3%A7%C3%A3o_Atletica_Ponte_Preta.svg.png',
  'sao-bernardo':  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/S%C3%A3o_Bernardo_FC.png/200px-S%C3%A3o_Bernardo_FC.png',
  'sport':         'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Sport_Club_do_Recife.svg/200px-Sport_Club_do_Recife.svg.png',
  'vila-nova':     'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Vila_Nova_Futebol_Clube.svg/200px-Vila_Nova_Futebol_Clube.svg.png',
};

function resolveEscudo(slugOrNome?: string, fallback?: string): string {
  if (!slugOrNome) return fallback ?? PATA_LOGO;
  const slug = slugOrNome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  return ESCUDOS_SERIE_B[slug] ?? fallback ?? PATA_LOGO;
}

interface Time { nome: string; escudo_url: string; slug?: string; }
interface Jogo { id: number; data_hora: string; mandante: Time; visitante: Time; competicao?: string; rodada?: string; local?: string; }
interface UsuarioRanking { id: string; nome: string; apelido: string | null; avatar_url: string | null; pontos_total: number; }

const MEDALS = ['🥇','🥈','🥉'];
const RANK_LABELS = ['LÍDER DA ALCATEIA','VICE-CAMPEÃO','BRONZE ELITE','COMPETIDOR','COMPETIDOR','COMPETIDOR','COMPETIDOR','COMPETIDOR','COMPETIDOR','COMPETIDOR'];
const EASE: [number,number,number,number] = [0.16,1,0.3,1];

function FlipDigit({ value }: { value: string }) {
  return <motion.span key={value} initial={{rotateX:-90,opacity:0}} animate={{rotateX:0,opacity:1}} transition={{duration:0.25,ease:'easeOut' as const}} style={{display:'inline-block',transformOrigin:'50% 50%'}}>{value}</motion.span>;
}

function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
      <div style={{position:'relative',width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',background:'linear-gradient(145deg,#0f0f0f,#1a1a00)',border:'1px solid rgba(245,196,0,0.2)',borderRadius:14,boxShadow:'0 0 16px rgba(245,196,0,0.06)'}}>
        <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)',pointerEvents:'none'}} />
        <span style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:30,fontWeight:900,color:'#F5C400',letterSpacing:-1,textShadow:'0 0 18px rgba(245,196,0,0.5)'}}>
          <FlipDigit value={value[0]} /><FlipDigit value={value[1]} />
        </span>
      </div>
      <span style={{fontSize:7,fontWeight:900,color:'#444',letterSpacing:3,textTransform:'uppercase'}}>{label}</span>
    </div>
  );
}

function LiveBadge() {
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:999,background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.35)'}}>
      <motion.div animate={{opacity:[1,0.2,1]}} transition={{duration:1.2,repeat:Infinity}} style={{width:5,height:5,borderRadius:'50%',background:'#EF4444'}} />
      <span style={{fontSize:7,fontWeight:900,color:'#EF4444',letterSpacing:3,textTransform:'uppercase'}}>AO VIVO</span>
    </div>
  );
}

function ParticlesBg() {
  return (
    <div style={{position:'absolute',inset:0,overflow:'hidden',pointerEvents:'none'}}>
      {Array.from({length:14}).map((_,i) => (
        <motion.div key={i} style={{position:'absolute',width:Math.random()*2+1,height:Math.random()*2+1,background:'#F5C400',borderRadius:'50%',left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,opacity:0}}
          animate={{y:[0,-35,0],opacity:[0,0.35,0]}}
          transition={{duration:Math.random()*4+3,delay:Math.random()*5,repeat:Infinity,ease:'easeInOut'}} />
      ))}
    </div>
  );
}

function SectionLabel({ sub, title }: { sub: string; title: string }) {
  return (
    <div style={{marginBottom:28,textAlign:'center'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:8}}>
        <div style={{height:1,flex:1,background:'linear-gradient(90deg,rgba(245,196,0,0.3),transparent)'}} />
        <span style={{fontSize:8,fontWeight:900,color:'#F5C400',letterSpacing:4,textTransform:'uppercase'}}>{sub}</span>
        <div style={{height:1,flex:1,background:'linear-gradient(90deg,transparent,rgba(245,196,0,0.3))'}} />
      </div>
      <h2 style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:36,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:-1,lineHeight:1,margin:0}}>{title}</h2>
    </div>
  );
}

function SofascoreWidget() {
  const [tab, setTab] = useState<'lineups'|'ratings'|'stats'>('lineups');
  const TABS = [
    {id:'lineups' as const, label:'Escalação', icon:'⚽'},
    {id:'ratings' as const, label:'Notas',     icon:'⭐'},
    {id:'stats'   as const, label:'Stats',     icon:'📊'},
  ];
  const SRC = {
    lineups: `https://widgets.sofascore.com/pt-BR/embed/lineups?id=${SOFASCORE_EVENT_ID}&widgetTheme=dark`,
    ratings: `https://widgets.sofascore.com/pt-BR/embed/ratings?id=${SOFASCORE_EVENT_ID}&widgetTheme=dark`,
    stats:   `https://widgets.sofascore.com/pt-BR/embed/statistics?id=${SOFASCORE_EVENT_ID}&widgetTheme=dark`,
  };
  return (
    <div style={{borderRadius:24,overflow:'hidden',border:'1px solid rgba(245,196,0,0.12)',background:'#080808',marginBottom:12}}>
      <div style={{height:2,background:'linear-gradient(90deg,transparent,#F5C400,transparent)'}} />
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',borderBottom:'1px solid rgba(255,255,255,0.04)',background:'rgba(245,196,0,0.02)'}}>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <div style={{width:3,height:18,background:'#F5C400',borderRadius:2}} />
          <div>
            <div style={{fontSize:7,fontWeight:900,color:'#444',letterSpacing:3,textTransform:'uppercase'}}>Tactical View</div>
            <div style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:16,fontWeight:900,color:'#fff',textTransform:'uppercase',letterSpacing:-0.5,lineHeight:1}}>Análise do Campo</div>
          </div>
        </div>
        <LiveBadge />
      </div>
      <div style={{padding:'8px 16px 0',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{fontSize:9,fontWeight:700,color:'#333',textTransform:'uppercase',letterSpacing:1}}>Novorizontino × CRB — Rodada 3 · Última partida</span>
        <span style={{fontSize:8,color:'#222',fontWeight:700}}>Use para escalar ↓</span>
      </div>
      <div style={{display:'flex',margin:'8px 0 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{flex:1,padding:'10px 4px',background:'none',cursor:'pointer',borderBottom:tab===t.id?'2px solid #F5C400':'2px solid transparent',color:tab===t.id?'#F5C400':'#333',fontSize:9,fontWeight:900,textTransform:'uppercase',letterSpacing:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,transition:'all 0.2s',border:'none'}}>
            <span style={{fontSize:14}}>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>
      <div style={{position:'relative',height:786,background:'#080808'}}>
        <iframe key={tab} src={SRC[tab]}
          style={{width:'100%',height:'100%',border:'none',display:'block'}}
          scrolling="no" loading="lazy" title={`Sofascore ${tab}`} />
      </div>
    </div>
  );
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0,280], [1,0]);
  const heroScale   = useTransform(scrollY, [0,280], [1,1.06]);

  const [mounted,       setMounted]       = useState(false);
  const [jogo,          setJogo]          = useState<Jogo | null>(null);
  const [ranking,       setRanking]       = useState<UsuarioRanking[]>([]);
  const [meuId,         setMeuId]         = useState<string | null>(null);
  const [perfilAberto,  setPerfilAberto]  = useState<string | null>(null);
  const [timeLeft,      setTimeLeft]      = useState({ h:'00', m:'00', s:'00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => { setMounted(true); if (typeof window !== 'undefined') window.scrollTo({top:0,behavior:'instant'}); }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }
      
      const resJogo = await fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null);
      if (resJogo?.jogos?.length > 0) {
        const j = resJogo.jogos[0];
        if (j.visitante && !j.visitante.escudo_url?.startsWith('http')) j.visitante.escudo_url = resolveEscudo(j.visitante.slug ?? j.visitante.nome);
        if (j.mandante  && !j.mandante.escudo_url?.startsWith('http'))  j.mandante.escudo_url  = resolveEscudo(j.mandante.slug  ?? j.mandante.nome);
        setJogo(j);
      } else {
        // Fallback Local - América-MG (Mandante) x Novorizontino (Visitante)
        setJogo({ 
          id: 4, 
          data_hora: '2026-04-12T21:00:00Z', 
          competicao: 'Série B', 
          rodada: '4ª Rodada', 
          local: 'Arena da Independência • BH',
          mandante:  { nome: 'América-MG',   slug: 'america-mg',   escudo_url: ESCUDOS_SERIE_B['america-mg'] },
          visitante: { nome: 'Novorizontino', slug: 'novorizontino', escudo_url: ESCUDOS_SERIE_B['novorizontino'] },
        });
      }
      
      const { data: resRank } = await sb.from('tigre_fc_usuarios')
        .select('id,nome,apelido,avatar_url,pontos_total')
        .not('pontos_total','is',null)
        .order('pontos_total',{ascending:false})
        .limit(10);
      if (resRank) setRanking(resRank as UsuarioRanking[]);
    }
    init();
  }, [mounted]);

  useEffect(() => {
    if (!jogo?.data_hora) return;
    const tick = () => {
      const gameTime = new Date(jogo.data_hora.includes('T') ? jogo.data_hora : jogo.data_hora.replace(' ','T')).getTime();
      const diff = gameTime - (90*60*1000) - Date.now(); // Mercado fecha 1h30 antes
      if (isNaN(diff) || diff <= 0) { 
        setTimeLeft({h:'00',m:'00',s:'00'}); 
        setMercadoAberto(false); 
        return; 
      }
      setTimeLeft({ 
        h: String(Math.floor(diff/3600000)).padStart(2,'0'), 
        m: String(Math.floor((diff%3600000)/60000)).padStart(2,'0'), 
        s: String(Math.floor((diff%60000)/1000)).padStart(2,'0') 
      });
    };
    const t = setInterval(tick, 1000); tick();
    return () => clearInterval(t);
  }, [jogo]);

  if (!mounted) return <div style={{minHeight:'100vh',background:'#050505'}} />;

  const stagger = (i: number): { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition } => ({
    initial: { opacity:0, y:28 }, 
    animate: { opacity:1, y:0 },
    transition: { delay: 0.1 + i*0.1, duration:0.5, ease:EASE },
  });

  return (
    <main style={{minHeight:'100vh',background:'#050505',color:'#fff',overflowX:'hidden',fontFamily:"'Barlow Condensed',system-ui,sans-serif"}}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
        *{box-sizing:border-box} 
        ::-webkit-scrollbar{width:0} 
        body{background:#050505}
        @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
        .text-shimmer{background:linear-gradient(90deg,#F5C400 0%,#fff8d6 40%,#F5C400 60%,#D4A200 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 3s linear infinite}
        @keyframes hud-pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,196,0,0)}50%{box-shadow:0 0 0 6px rgba(245,196,0,0.06)}}
        .hud-pulse{animation:hud-pulse 2.5s ease-in-out infinite}
      `}</style>

      {/* HERO SECTION */}
      <motion.div style={{opacity:heroOpacity,scale:heroScale,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(245,196,0,0.1) 0%,transparent 70%)'}} />
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(245,196,0,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(245,196,0,0.03) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
        <ParticlesBg />
        <div style={{position:'relative',zIndex:10,padding:'80px 24px 56px',textAlign:'center',maxWidth:480,margin:'0 auto'}}>
          <motion.img src={PATA_LOGO} initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.6,ease:EASE}}
            style={{width:68,height:68,objectFit:'contain',margin:'0 auto 16px',filter:'drop-shadow(0 0 20px rgba(245,196,0,0.5))',display:'block'}} alt="Tigre FC" />
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.5,ease:EASE}}>
            <div style={{fontSize:8,fontWeight:900,letterSpacing:6,color:'#F5C400',textTransform:'uppercase',marginBottom:8,opacity:0.6}}>FANTASY LEAGUE · SÉRIE B 2026</div>
            <h1 style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:84,fontWeight:900,letterSpacing:-4,lineHeight:0.85,textTransform:'uppercase',margin:'0 0 14px'}}>
              <span className="text-shimmer">TIGRE</span><br /><span style={{color:'#fff'}}>FC</span>
            </h1>
            <p style={{fontSize:10,fontWeight:700,color:'#333',letterSpacing:2,textTransform:'uppercase'}}>Monte. Dispute. Domine a torcida.</p>
          </motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
            style={{display:'flex',gap:8,justifyContent:'center',marginTop:20}}>
            <LiveBadge />
            <div style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 10px',borderRadius:999,background:mercadoAberto?'rgba(34,197,94,0.1)':'rgba(239,68,68,0.1)',border:`1px solid ${mercadoAberto?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`}}>
              <span style={{fontSize:7,fontWeight:900,color:mercadoAberto?'#22C55E':'#EF4444',letterSpacing:3,textTransform:'uppercase'}}>{mercadoAberto?'🟢 MERCADO ABERTO':'🔴 MERCADO FECHADO'}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div style={{maxWidth:480,margin:'0 auto',padding:'0 16px 20px'}}>

        {/* MATCH CARD */}
        <AnimatePresence>
          {jogo && (
            <motion.section {...stagger(0)} style={{marginBottom:12}}>
              <div style={{position:'relative'}}>
                <div style={{position:'absolute',inset:-1,background:'linear-gradient(135deg,rgba(245,196,0,0.35) 0%,transparent 50%,rgba(245,196,0,0.15) 100%)',borderRadius:32,filter:'blur(1px)'}} />
                <div style={{position:'relative',background:'linear-gradient(145deg,#0d0d0d 0%,#111108 60%,#0a0a0a 100%)',borderRadius:30,overflow:'hidden',border:'1px solid rgba(245,196,0,0.12)'}}>
                  <div style={{height:3,background:'linear-gradient(90deg,transparent,#F5C400,#D4A200,transparent)'}} />
                  <div style={{position:'absolute',inset:0,background:'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.007) 3px,rgba(255,255,255,0.007) 4px)',pointerEvents:'none'}} />
                  <div style={{padding:'24px 22px 28px',position:'relative',zIndex:2}}>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
                      <div style={{display:'flex',alignItems:'center',gap:6}}>
                        <div style={{width:5,height:5,borderRadius:'50%',background:'#F5C400',boxShadow:'0 0 6px #F5C400'}} />
                        <span style={{fontSize:9,fontWeight:900,color:'#F5C400',letterSpacing:2,textTransform:'uppercase'}}>{jogo.competicao}</span>
                      </div>
                      <span style={{fontSize:9,color:'#2a2a2a',fontWeight:700,letterSpacing:1,textTransform:'uppercase'}}>{jogo.rodada}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1,gap:8}}>
                        <div style={{width:72,height:72,display:'flex',alignItems:'center',justifyContent:'center',background:'radial-gradient(circle,rgba(245,196,0,0.12),transparent 70%)',borderRadius:'50%'}}>
                          <img src={resolveEscudo(jogo.mandante?.slug??jogo.mandante?.nome, jogo.mandante?.escudo_url)} onError={e=>{(e.target as HTMLImageElement).src=PATA_LOGO}} style={{width:58,height:58,objectFit:'contain',filter:'drop-shadow(0 0 12px rgba(245,196,0,0.35))'}} alt={jogo.mandante?.nome} />
                        </div>
                        <span style={{fontSize:10,fontWeight:900,color:'#fff',textTransform:'uppercase',textAlign:'center',lineHeight:1.2}}>{jogo.mandante?.nome}</span>
                        <div style={{padding:'2px 7px',background:'rgba(245,196,0,0.1)',border:'1px solid rgba(245,196,0,0.2)',borderRadius:5}}>
                          <span style={{fontSize:7,fontWeight:900,color:'#F5C400',letterSpacing:1}}>MANDANTE</span>
                        </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:14,padding:'0 6px'}}>
                        <span style={{fontSize:24,fontWeight:900,fontStyle:'italic',color:'#1a1a1a',lineHeight:1}}>VS</span>
                        <div style={{display:'flex',gap:4,alignItems:'center'}}>
                          <TimerBlock value={timeLeft.h} label="HRS" />
                          <span style={{fontSize:18,fontWeight:900,color:'#F5C400',marginBottom:14}}>:</span>
                          <span style={{display:'none'}}>{/* Separador visual apenas */}</span>
                          <TimerBlock value={timeLeft.m} label="MIN" />
                          <span style={{fontSize:18,fontWeight:900,color:'#F5C400',marginBottom:14}}>:</span>
                          <TimerBlock value={timeLeft.s} label="SEG" />
                        </div>
                        <span style={{fontSize:7,fontWeight:700,color:'#222',letterSpacing:1,textTransform:'uppercase',textAlign:'center'}}>{jogo.local}</span>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'center',flex:1,gap:8}}>
                        <div style={{width:72,height:72,display:'flex',alignItems:'center',justifyContent:'center',background:'radial-gradient(circle,rgba(255,255,255,0.04),transparent 70%)',borderRadius:'50%'}}>
                          <img src={resolveEscudo(jogo.visitante?.slug??jogo.visitante?.nome, jogo.visitante?.escudo_url)} onError={e=>{(e.target as HTMLImageElement).src=PATA_LOGO}} style={{width:58,height:58,objectFit:'contain',filter:'drop-shadow(0 4px 10px rgba(0,0,0,0.5))'}} alt={jogo.visitante?.nome} />
                        </div>
                        <span style={{fontSize:10,fontWeight:900,color:'#fff',textTransform:'uppercase',textAlign:'center',lineHeight:1.2}}>{jogo.visitante?.nome}</span>
                        <div style={{padding:'2px 7px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:5}}>
                          <span style={{fontSize:7,fontWeight:900,color:'#333',letterSpacing:1}}>VISITANTE</span>
                        </div>
                      </div>
                    </div>
                    <div className={mercadoAberto ? "hud-pulse" : ""} style={{borderRadius:18}}>
                      <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,padding:'17px 24px',borderRadius:18,background:mercadoAberto?'linear-gradient(135deg,#F5C400 0%,#D4A200 100%)':'#1a1a1a',color:mercadoAberto?'#000':'#333',fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:13,fontWeight:900,letterSpacing:3,textTransform:'uppercase',textDecoration:'none',boxShadow:mercadoAberto?'0 8px 28px rgba(245,196,0,0.25)':'none',border:mercadoAberto?'none':'1px solid #222'}}>
                        <span style={{fontSize:16}}>{mercadoAberto?'⚡':'🔒'}</span>{mercadoAberto?'CONVOCAR TITULARES':'MERCADO FECHADO'}
                      </Link>
                    </div>
                    <div style={{display:'flex',justifyContent:'center',gap:28,marginTop:18}}>
                      {[['🏆',ranking.length||'—','JOGADORES'],['⚽','11','TITULARES'],['🎯','5','FORMAÇÕES']].map(([icon,val,label]) => (
                        <div key={label as string} style={{textAlign:'center'}}>
                          <div style={{fontSize:14,marginBottom:1}}>{icon}</div>
                          <div style={{fontSize:16,fontWeight:900,color:'#F5C400',lineHeight:1}}>{val}</div>
                          <div style={{fontSize:6,fontWeight:900,color:'#222',letterSpacing:1.5,textTransform:'uppercase',marginTop:1}}>{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* SOFASCORE WIDGET */}
        <motion.div {...stagger(1)}>
          <SofascoreWidget />
        </motion.div>

        {/* DESTAQUES FIFA */}
        <motion.div {...stagger(2)}>
          <DestaquesFifa />
        </motion.div>

        {/* RANKING SECTION */}
        <motion.section {...stagger(3)} style={{marginTop:56}}>
          <SectionLabel sub="LEADERBOARD" title="ELITE RANKING" />
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {ranking.length===0 ? (
              <div style={{textAlign:'center',padding:'40px 0',color:'#222',fontSize:13}}>Seja o primeiro a pontuar!</div>
            ) : ranking.map((u,i) => {
              const isFirst=i===0, isTop3=i<3;
              return (
                <motion.div key={u.id}
                  initial={{opacity:0,x:i%2===0?-16:16}} animate={{opacity:1,x:0}}
                  transition={{delay:0.04*i,duration:0.4,ease:EASE}} whileHover={{scale:1.02,x:3}} whileTap={{scale:0.98}}
                  onClick={()=>setPerfilAberto(u.id)}
                  style={{display:'flex',alignItems:'center',gap:12,padding:isFirst?'18px':'13px 16px',borderRadius:isFirst?22:16,cursor:'pointer',position:'relative',overflow:'hidden',background:isFirst?'linear-gradient(135deg,#1a1400,#2a1f00,#1a1400)':'rgba(255,255,255,0.02)',border:isFirst?'1px solid rgba(245,196,0,0.35)':isTop3?'1px solid rgba(255,255,255,0.05)':'1px solid rgba(255,255,255,0.02)',boxShadow:isFirst?'0 0 32px rgba(245,196,0,0.08)':'none'}}>
                  {isFirst && <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(245,196,0,0.5),transparent)'}} />}
                  <div style={{width:32,textAlign:'center',flexShrink:0}}>
                    {isTop3?<span style={{fontSize:18}}>{MEDALS[i]}</span>:<span style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:20,fontWeight:900,fontStyle:'italic',color:'#222'}}>{String(i+1).padStart(2,'0')}</span>}
                  </div>
                  <div style={{width:isFirst?48:40,height:isFirst?48:40,borderRadius:isFirst?14:12,overflow:'hidden',flexShrink:0,border:isFirst?'2px solid rgba(245,196,0,0.35)':'1px solid rgba(255,255,255,0.05)',background:'#111',boxShadow:isFirst?'0 0 12px rgba(245,196,0,0.15)':'none'}}>
                    <img src={u.avatar_url||PATA_LOGO} style={{width:'100%',height:'100%',objectFit:'cover'}} alt={u.nome} />
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:isFirst?20:16,fontWeight:900,fontStyle:'italic',color:isFirst?'#F5C400':'#fff',textTransform:'uppercase',letterSpacing:-0.5,lineHeight:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{u.apelido||u.nome}</div>
                    <div style={{fontSize:7,fontWeight:900,color:isFirst?'rgba(245,196,0,0.4)':'#222',letterSpacing:2,textTransform:'uppercase',marginTop:3}}>{RANK_LABELS[i]||'COMPETIDOR'}</div>
                  </div>
                  <div style={{textAlign:'right',flexShrink:0}}>
                    <div style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:isFirst?34:26,fontWeight:900,fontStyle:'italic',color:isFirst?'#F5C400':isTop3?'#fff':'#333',lineHeight:1,textShadow:isFirst?'0 0 16px rgba(245,196,0,0.35)':'none'}}>{u.pontos_total||0}</div>
                    <div style={{fontSize:6,fontWeight:900,color:'#222',letterSpacing:2,textTransform:'uppercase',marginTop:1}}>PTS</div>
                  </div>
                  <span style={{fontSize:10,color:'#1a1a1a',marginLeft:2,flexShrink:0}}>›</span>
                </motion.div>
              );
            })}
          </div>
          <Link href="/tigre-fc/ranking" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'13px',borderRadius:14,marginTop:12,background:'transparent',border:'1px solid rgba(245,196,0,0.12)',color:'#F5C400',fontSize:10,fontWeight:900,letterSpacing:3,textTransform:'uppercase',textDecoration:'none'}}>
            VER RANKING COMPLETO →
          </Link>
        </motion.section>

        {/* VESTIÁRIO / CHAT */}
        <motion.section {...stagger(4)} style={{marginTop:56,marginBottom:60}}>
          <SectionLabel sub="LOUNGE" title="VESTIÁRIO" />
          <div style={{borderRadius:28,overflow:'hidden',border:'1px solid rgba(255,255,255,0.04)',background:'linear-gradient(145deg,#080808,#0d0d00)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 18px',borderBottom:'1px solid rgba(255,255,255,0.04)',background:'rgba(245,196,0,0.02)'}}>
              <span style={{fontSize:10,fontWeight:900,color:'#2a2a2a',letterSpacing:2,textTransform:'uppercase'}}>💬 Chat da Torcida</span>
              <LiveBadge />
            </div>
            <div style={{height:520}}>
              <TigreFCChat usuarioId={meuId} />
            </div>
          </div>
        </motion.section>
      </div>

      {/* MODAL PERFIL */}
      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico 
            targetUsuarioId={perfilAberto} 
            viewerUsuarioId={meuId} 
            onClose={()=>setPerfilAberto(null)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
