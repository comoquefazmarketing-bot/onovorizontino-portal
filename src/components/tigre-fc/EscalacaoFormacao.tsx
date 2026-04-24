'use client';
/**
 * EscalacaoFormacao — Tigre FC PS5/FIFA26 Edition
 * Jornada: Formação → Campo → Palpite → Reveal (Campo PS5)
 * Missão 1: jogo dinâmico via props (sem hardcode)
 * Missão 2: campo tático imersivo no step final
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// ── Assets ────────────────────────────────────────────────
const BASE    = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const FOTO_ROMULO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ROMULO%20FUNDO%20TRANSPARENTE.png';
const FOTO_CARLAO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CARLAO%20FUNDO%20TRANSPARENTE.png';
const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Tipos ─────────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup = Record<string, Player | null>;
type Step   = 'formation' | 'picking' | 'score' | 'reveal';
type Slot   = { id: string; x: number; y: number; pos: string; label: string };

interface Jogo {
  id:             number;
  competicao?:    string;
  rodada?:        string;
  data_hora?:     string;
  local?:         string;
  transmissao?:   string;
  mandante?:  { nome: string; escudo_url: string | null; sigla?: string | null };
  visitante?: { nome: string; escudo_url: string | null; sigla?: string | null };
}

interface Props {
  jogoId?: number;
}

// ── Elenco ────────────────────────────────────────────────
const PLAYERS: Player[] = [
  { id:1,  name:'César Augusto',    short:'César',      num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id:2,  name:'Jordi',            short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  { id:3,  name:'João Scapin',      short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  { id:4,  name:'Lucas',            short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id:5,  name:'Jhilmar Lora',     short:'Lora',       num:24, pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  { id:6,  name:'Nilson Castrillón',short:'Castrillón', num:20, pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  { id:7,  name:'Arthur Barbosa',   short:'A.Barbosa',  num:null,pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id:8,  name:'Sander',           short:'Sander',     num:5,  pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
  { id:9,  name:'Maykon Jesus',     short:'Maykon',     num:66, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  { id:10, name:'Dantas',           short:'Dantas',     num:25, pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  { id:11, name:'Eduardo Brock',    short:'E.Brock',    num:14, pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  { id:12, name:'Patrick',          short:'Patrick',    num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  { id:13, name:'Gabriel Bahia',    short:'G.Bahia',    num:26, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id:14, name:'Carlinhos',        short:'Carlinhos',  num:3,  pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  { id:15, name:'Kauan Alemão',     short:'Alemão',     num:21, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  { id:16, name:'Renato Palm',      short:'R.Palm',     num:33, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  { id:17, name:'Alexis Alvariño',  short:'Alvariño',   num:22, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  { id:18, name:'Luís Oyama',       short:'Oyama',      num:6,  pos:'VOL', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  { id:19, name:'Léo Naldi',        short:'L.Naldi',    num:18, pos:'VOL', foto:BASE+'LEO-NALDI.jpg.webp' },
  { id:20, name:'Marlon',           short:'Marlon',     num:28, pos:'VOL', foto:BASE+'MARLON.jpg.webp' },
  { id:21, name:'Luiz Gabriel',     short:'L.Gabriel',  num:23, pos:'VOL', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:22, name:'Rômulo',           short:'Rômulo',     num:10, pos:'MEI', foto:FOTO_ROMULO },
  { id:23, name:'Matheus Bianqui',  short:'Bianqui',    num:17, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id:24, name:'Juninho',          short:'Juninho',    num:50, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  { id:25, name:'Tavinho',          short:'Tavinho',    num:15, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  { id:26, name:'Diego Galo',       short:'D.Galo',     num:19, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  { id:27, name:'Christian Ortíz',  short:'C.Ortiz',    num:8,  pos:'MEI', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:28, name:'Hector Bianchi',   short:'Hector',     num:35, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:29, name:'Nogueira',         short:'Nogueira',   num:null,pos:'VOL', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:30, name:'Carlão',           short:'Carlão',     num:9,  pos:'ATA', foto:FOTO_CARLAO },
  { id:31, name:'Robson',           short:'Robson',     num:11, pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva',   short:'V.Paiva',    num:16, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges',     short:'H.Borges',   num:41, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel',          short:'Jardiel',    num:40, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca',   short:'N.Careca',   num:30, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Diego Mathias',    short:'D.Mathias',  num:27, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:37, name:'Ronald Barcellos', short:'Ronald',     num:7,  pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

// ── Formações ─────────────────────────────────────────────
const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK'  },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB'  },
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB'  },
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB'  },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB'  },
    { id:'dm1', x:34, y:57, pos:'VOL', label:'DM'  },
    { id:'dm2', x:66, y:57, pos:'VOL', label:'DM'  },
    { id:'am',  x:50, y:40, pos:'MEI', label:'AM'  },
    { id:'rw',  x:85, y:25, pos:'MEI', label:'RW'  },
    { id:'lw',  x:15, y:25, pos:'MEI', label:'LW'  },
    { id:'st',  x:50, y:11, pos:'ATA', label:'ST'  },
  ],
  '4-3-3': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK'  },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB'  },
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB'  },
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB'  },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB'  },
    { id:'cm1', x:50, y:58, pos:'VOL', label:'CM'  },
    { id:'cm2', x:25, y:50, pos:'MEI', label:'CM'  },
    { id:'cm3', x:75, y:50, pos:'MEI', label:'CM'  },
    { id:'rw',  x:80, y:20, pos:'ATA', label:'RW'  },
    { id:'lw',  x:20, y:20, pos:'ATA', label:'LW'  },
    { id:'st',  x:50, y:11, pos:'ATA', label:'ST'  },
  ],
  '4-4-2': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK'  },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB'  },
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB'  },
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB'  },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB'  },
    { id:'rm',  x:85, y:52, pos:'MEI', label:'RM'  },
    { id:'cm1', x:62, y:52, pos:'VOL', label:'CM'  },
    { id:'cm2', x:38, y:52, pos:'VOL', label:'CM'  },
    { id:'lm',  x:15, y:52, pos:'MEI', label:'LM'  },
    { id:'st1', x:33, y:16, pos:'ATA', label:'ST'  },
    { id:'st2', x:67, y:16, pos:'ATA', label:'ST'  },
  ],
};

const POS_COLORS: Record<string, string> = {
  GOL:'#F5C400', ZAG:'#00F3FF', LAT:'#4FC3F7',
  VOL:'#BF5FFF', MEI:'#22C55E', ATA:'#FF2D55',
};

// ── Mercado aberto? ───────────────────────────────────────
function mercadoAberto(dataHora?: string): boolean {
  if (!dataHora) return true;
  return new Date(dataHora).getTime() - 90 * 60_000 > Date.now();
}

// ── Fundo estádio ─────────────────────────────────────────
const StadiumBg = () => (
  <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#010508 0%,#030e09 55%,#061608 100%)', overflow:'hidden' }}>
    <div style={{ position:'absolute', inset:0, opacity:0.08, backgroundImage:'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
    <div style={{ position:'absolute', bottom:0, width:'100%', height:'50%', background:'radial-gradient(50% 100% at 50% 100%, rgba(34,197,94,0.12) 0%, transparent 100%)' }} />
  </div>
);

// ── FifaCard ──────────────────────────────────────────────
function FifaCard({ player, isCaptain, isHero, small=false, onClick }: {
  player: Player; isCaptain?: boolean; isHero?: boolean; small?: boolean; onClick?: () => void;
}) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
  const W = small ? 48 : 60;
  const H = Math.round(W * 1.4);
  return (
    <motion.button onClick={onClick} whileTap={{ scale:0.9 }}
      style={{ background:'none', border:'none', padding:0, position:'relative', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ width:W, height:H, borderRadius:8, overflow:'hidden', border:`2px solid ${col}`,
        background:'#050505', boxShadow:`0 0 10px ${col}40` }}>
        <div style={{ width:'100%', height:'75%', position:'relative', overflow:'hidden' }}>
          <img src={player.foto} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} alt={player.short}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
        </div>
        <div style={{ height:'25%', background:col, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize: small ? 7 : 9, fontWeight:900, color:'#000', textTransform:'uppercase',
            fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.05em',
            whiteSpace:'nowrap', overflow:'hidden', maxWidth: W - 4, textOverflow:'ellipsis' }}>
            {player.short}
          </span>
        </div>
      </div>
      {(isCaptain || isHero) && (
        <div style={{ position:'absolute', top:-6, right:-6, background:col, color:'#000', borderRadius:'50%',
          width:20, height:20, fontSize:11, fontWeight:900, display:'flex', alignItems:'center',
          justifyContent:'center', border:'2px solid #000', fontFamily:"'Barlow Condensed',sans-serif" }}>
          {isCaptain ? 'C' : '★'}
        </div>
      )}
    </motion.button>
  );
}

// ── Campo PS5 (step reveal) ───────────────────────────────
const GRAMADO_VERDE1 = '#1a4a2a';
const GRAMADO_VERDE2 = '#1e5530';
const LINHA = 'rgba(255,255,255,0.18)';

function GramadoSVG() {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
      <defs>
        <radialGradient id="sl" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stopColor="rgba(255,255,255,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x="0" y={i * 10} width="100" height="10"
          fill={i % 2 === 0 ? GRAMADO_VERDE1 : GRAMADO_VERDE2} />
      ))}
      {/* linhas */}
      <line x1="0" y1="0"  x2="100" y2="0"  stroke={LINHA} strokeWidth="0.6" />
      <line x1="0" y1="100" x2="100" y2="100" stroke={LINHA} strokeWidth="0.6" />
      <line x1="0" y1="0"  x2="0"   y2="100" stroke={LINHA} strokeWidth="0.6" />
      <line x1="100" y1="0" x2="100" y2="100" stroke={LINHA} strokeWidth="0.6" />
      <line x1="0" y1="50" x2="100" y2="50" stroke={LINHA} strokeWidth="0.4" />
      <circle cx="50" cy="50" r="12" fill="none" stroke={LINHA} strokeWidth="0.4" />
      <circle cx="50" cy="50" r="0.8" fill={LINHA} />
      <rect x="22" y="0"  width="56" height="18" fill="none" stroke={LINHA} strokeWidth="0.4" />
      <rect x="35" y="0"  width="30" height="7"  fill="none" stroke={LINHA} strokeWidth="0.4" />
      <rect x="22" y="82" width="56" height="18" fill="none" stroke={LINHA} strokeWidth="0.4" />
      <rect x="35" y="93" width="30" height="7"  fill="none" stroke={LINHA} strokeWidth="0.4" />
      <circle cx="50" cy="13" r="1" fill={LINHA} />
      <circle cx="50" cy="87" r="1" fill={LINHA} />
      <rect x="0" y="0" width="100" height="100" fill="url(#sl)" />
    </svg>
  );
}

function PlayerPin({ player, x, y, idx, isCaptain, isHero }: {
  player: Player | null; x: number; y: number; idx: number;
  isCaptain?: boolean; isHero?: boolean;
}) {
  const cor = player ? (POS_COLORS[player.pos] ?? '#F5C400') : 'rgba(255,255,255,0.15)';
  return (
    <div style={{ position:'absolute', left:`${x}%`, top:`${y}%`,
      transform:'translate(-50%, -50%)', display:'flex', flexDirection:'column',
      alignItems:'center', gap:3, zIndex:10,
      animation:`pin-in 0.5s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.07}s both` }}>
      <div style={{ width:44, height:44, borderRadius:'50%', background:'#0d0d0d',
        border:`2px solid ${cor}`, boxShadow: player ? `0 0 10px ${cor}55` : 'none',
        overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center',
        position:'relative', transition:'transform 0.2s, box-shadow 0.2s' }}>
        {player ? (
          <img src={player.foto} alt={player.short}
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }}
            onError={e => { (e.target as HTMLImageElement).style.opacity='0'; }} />
        ) : (
          <span style={{ fontSize:16, color:cor, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif" }}>?</span>
        )}
        {isCaptain && (
          <div style={{ position:'absolute', top:-5, right:-5, width:16, height:16,
            borderRadius:'50%', background:'#F5C400', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:8, fontWeight:900, color:'#000',
            boxShadow:'0 0 6px #F5C400', fontFamily:"'Barlow Condensed',sans-serif" }}>C</div>
        )}
        {isHero && !isCaptain && (
          <div style={{ position:'absolute', top:-5, right:-5, width:16, height:16,
            borderRadius:'50%', background:'#00F3FF', display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:8, fontWeight:900, color:'#000',
            boxShadow:'0 0 6px #00F3FF', fontFamily:"'Barlow Condensed',sans-serif" }}>★</div>
        )}
      </div>
      {player && (
        <div style={{ background:'rgba(0,0,0,0.85)', border:`1px solid ${cor}44`,
          borderRadius:4, padding:'2px 5px', textAlign:'center' }}>
          <div style={{ fontSize:8, fontWeight:900, color:'#fff',
            fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.05em',
            whiteSpace:'nowrap', maxWidth:54, overflow:'hidden', textOverflow:'ellipsis' }}>
            {player.short.toUpperCase()}
          </div>
          <div style={{ fontSize:6.5, color:cor, fontWeight:700, letterSpacing:'0.1em' }}>
            {player.pos}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────
export default function EscalacaoFormacao({ jogoId }: Props) {
  const [step,           setStep]     = useState<Step>('formation');
  const [formation,      setFormation]= useState('4-2-3-1');
  const [lineup,         setLineup]   = useState<Lineup>({});
  const [activeSlot,     setActiveSlot] = useState<string | null>(null);
  const [captainId,      setCaptainId] = useState<number | null>(null);
  const [heroId,         setHeroId]   = useState<number | null>(null);
  const [scoreTigre,     setScoreTigre]     = useState(0);
  const [scoreAdversario,setScoreAdversario] = useState(0);
  const [jogo,           setJogo]     = useState<Jogo | null>(null);
  const [saving,         setSaving]   = useState(false);
  const [campoReady,     setCampoReady] = useState(false);

  const slots = useMemo(() => FORMATIONS[formation] ?? FORMATIONS['4-2-3-1'], [formation]);

  // ── Busca jogo dinâmico ───────────────────────────────
  useEffect(() => {
    async function fetchJogo() {
      const endpoint = jogoId
        ? `${SUPA_URL}/rest/v1/jogos?id=eq.${jogoId}&select=id,competicao,rodada,data_hora,local,transmissao,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&limit=1`
        : `${SUPA_URL}/rest/v1/jogos?ativo=eq.true&finalizado=eq.false&select=id,competicao,rodada,data_hora,local,transmissao,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&order=data_hora.asc&limit=1`;
      try {
        const res  = await fetch(endpoint, {
          headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` },
        });
        const data = await res.json();
        if (data?.[0]) setJogo(data[0]);
      } catch { /* mantém jogo null — UI mostra fallback */ }
    }
    fetchJogo();
  }, [jogoId]);

  // ── Anima o campo no reveal ───────────────────────────
  useEffect(() => {
    if (step === 'reveal') {
      const t = setTimeout(() => setCampoReady(true), 150);
      return () => clearTimeout(t);
    }
    setCampoReady(false);
  }, [step]);

  // ── Seleciona jogador para o slot ────────────────────
  const handlePick = useCallback((player: Player) => {
    if (!activeSlot) return;
    setLineup(prev => ({ ...prev, [activeSlot]: player }));
    setActiveSlot(null);
  }, [activeSlot]);

  // ── Salva escalação no Supabase ──────────────────────
  const salvarEscalacao = useCallback(async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) { setStep('reveal'); return; }

      await fetch('/api/escalacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          google_id:     session.user.id,
          formacao:      formation,
          lineup:        lineup,
          capitao_id:    captainId,
          heroi_id:      heroId,
          palpite_tigre: scoreTigre,
          palpite_adv:   scoreAdversario,
          bench:         {},
        }),
      });
    } catch { /* segue para o reveal mesmo se falhar */ }
    finally { setSaving(false); setStep('reveal'); }
  }, [formation, lineup, captainId, heroId, scoreTigre, scoreAdversario]);

  // ── Escudo do adversário (Novorizontino é visitante) ──
  const escudoAdv = jogo?.mandante?.escudo_url ?? null;
  const nomeAdv   = jogo?.mandante?.nome ?? 'Adversário';
  const fechado   = !mercadoAberto(jogo?.data_hora);

  const lineupOrdenado = slots.map(s => lineup[s.id] ?? null);

  return (
    <div style={{ minHeight:'100svh', background:'#000', color:'#fff',
      display:'flex', flexDirection:'column', position:'relative', overflow:'hidden',
      fontFamily:"'Barlow Condensed',Impact,sans-serif" }}>

      <style>{`
        @keyframes pin-in  { from{opacity:0;transform:translate(-50%,-65%)} to{opacity:1;transform:translate(-50%,-50%)} }
        @keyframes cta-pulse{ 0%,100%{box-shadow:0 0 16px rgba(245,196,0,0.4),0 0 32px rgba(245,196,0,0.2)} 50%{box-shadow:0 0 28px rgba(245,196,0,0.8),0 0 56px rgba(245,196,0,0.4)} }
        @keyframes led-scan { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fade-up  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <StadiumBg />

      <AnimatePresence mode="wait">

        {/* ══ STEP 1 — FORMAÇÃO ══════════════════════════════ */}
        {step === 'formation' && (
          <motion.div key="formation"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, scale:0.95 }}
            style={{ flex:1, zIndex:10, display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center', padding:'24px 20px', textAlign:'center' }}>

            <img src={ESCUDO} alt="Tigre" style={{ width:80, height:80, objectFit:'contain', marginBottom:20,
              filter:'drop-shadow(0 0 16px rgba(245,196,0,0.5))' }} />

            <h1 style={{ fontSize:28, fontWeight:900, fontStyle:'italic', letterSpacing:'-0.02em',
              textTransform:'uppercase', marginBottom:6 }}>Escolha sua Tática</h1>
            <p style={{ fontSize:10, color:'rgba(255,255,255,0.35)', letterSpacing:'0.3em',
              fontWeight:700, marginBottom:32, textTransform:'uppercase' }}>
              A base do seu sucesso começa aqui
            </p>

            {jogo && (
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28,
                background:'rgba(245,196,0,0.06)', border:'1px solid rgba(245,196,0,0.15)',
                borderRadius:12, padding:'10px 16px' }}>
                {escudoAdv && <img src={escudoAdv} alt={nomeAdv} style={{ width:32, height:32, objectFit:'contain' }} />}
                <div style={{ textAlign:'left' }}>
                  <div style={{ fontSize:10, color:'rgba(245,196,0,0.5)', letterSpacing:'0.2em', fontWeight:900 }}>PRÓXIMO JOGO</div>
                  <div style={{ fontSize:14, fontWeight:900, color:'#fff' }}>NOVO × {nomeAdv.toUpperCase()}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,0.3)', fontWeight:700 }}>
                    {jogo.rodada} · {jogo.competicao}
                  </div>
                </div>
              </div>
            )}

            {fechado && (
              <div style={{ background:'rgba(255,45,85,0.1)', border:'1px solid rgba(255,45,85,0.3)',
                borderRadius:10, padding:'10px 16px', marginBottom:20, fontSize:12, fontWeight:900,
                color:'#FF2D55', letterSpacing:'0.1em' }}>
                MERCADO FECHADO — Escalação bloqueada
              </div>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, width:'100%', maxWidth:320 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setStep('picking'); }}
                  disabled={fechado}
                  style={{ background:'rgba(255,255,255,0.04)', border:'2px solid rgba(255,255,255,0.1)',
                    borderRadius:16, padding:'20px 10px', fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:22, fontWeight:900, color: fechado ? 'rgba(255,255,255,0.2)' : '#fff',
                    cursor: fechado ? 'not-allowed' : 'pointer',
                    transition:'border-color 0.2s, background 0.2s' }}>
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══ STEP 2 — CAMPO / PICKING ═══════════════════════ */}
        {step === 'picking' && (
          <motion.div key="picking"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ flex:1, zIndex:10, display:'flex', flexDirection:'column' }}>

            {/* Header */}
            <div style={{ padding:'12px 16px', display:'flex', alignItems:'center',
              justifyContent:'space-between', background:'rgba(0,0,0,0.7)',
              backdropFilter:'blur(12px)', borderBottom:'1px solid rgba(245,196,0,0.12)' }}>
              <div>
                <div style={{ fontSize:9, color:'rgba(245,196,0,0.5)', letterSpacing:'0.3em', fontWeight:900 }}>
                  {jogo?.competicao ?? 'SÉRIE B 2026'}
                </div>
                <div style={{ fontSize:16, fontWeight:900, fontStyle:'italic', color:'#fff', lineHeight:1 }}>
                  NOVO × {nomeAdv.toUpperCase()}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ fontSize:11, fontWeight:900, color:'rgba(245,196,0,0.6)',
                  background:'rgba(245,196,0,0.08)', border:'1px solid rgba(245,196,0,0.2)',
                  borderRadius:6, padding:'3px 8px' }}>{formation}</div>
                {escudoAdv && (
                  <img src={escudoAdv} alt={nomeAdv} style={{ width:32, height:32, objectFit:'contain' }} />
                )}
              </div>
            </div>

            {/* Campo de picking */}
            <div style={{ flex:1, position:'relative', minHeight:440 }}>
              {/* Gramado simplificado */}
              <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
                <GramadoSVG />
              </div>

              {/* Slots dos jogadores */}
              {slots.map((s, idx) => (
                <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`,
                  transform:'translate(-50%, -50%)', zIndex:10 }}>
                  {lineup[s.id] ? (
                    <FifaCard
                      player={lineup[s.id]!}
                      isCaptain={lineup[s.id]?.id === captainId}
                      isHero={lineup[s.id]?.id === heroId}
                      small
                      onClick={() => setActiveSlot(s.id)}
                    />
                  ) : (
                    <button onClick={() => setActiveSlot(s.id)}
                      style={{ width:44, height:60, borderRadius:8, border:'2px dashed rgba(255,255,255,0.2)',
                        background:'rgba(0,0,0,0.5)', display:'flex', flexDirection:'column',
                        alignItems:'center', justifyContent:'center', cursor:'pointer',
                        backdropFilter:'blur(4px)' }}>
                      <span style={{ fontSize:8, color:'rgba(255,255,255,0.5)', fontWeight:900,
                        fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:'0.1em' }}>
                        {s.label}
                      </span>
                      <span style={{ fontSize:16, color: POS_COLORS[s.pos] ?? '#fff', lineHeight:1 }}>+</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Botões capitão / herói / avançar */}
            <div style={{ padding:'12px 16px 20px', background:'rgba(0,0,0,0.8)',
              backdropFilter:'blur(12px)', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                <button onClick={() => setActiveSlot('captain_pick')}
                  style={{ flex:1, padding:'9px', borderRadius:8, border:'1px solid rgba(245,196,0,0.3)',
                    background: captainId ? 'rgba(245,196,0,0.12)' : 'transparent',
                    color:'#F5C400', fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:11, fontWeight:900, letterSpacing:'0.15em', cursor:'pointer' }}>
                  C CAPITÃO
                </button>
                <button onClick={() => setActiveSlot('hero_pick')}
                  style={{ flex:1, padding:'9px', borderRadius:8, border:'1px solid rgba(0,243,255,0.3)',
                    background: heroId ? 'rgba(0,243,255,0.1)' : 'transparent',
                    color:'#00F3FF', fontFamily:"'Barlow Condensed',sans-serif",
                    fontSize:11, fontWeight:900, letterSpacing:'0.15em', cursor:'pointer' }}>
                  ★ HERÓI
                </button>
              </div>
              <button onClick={() => setStep('score')}
                style={{ width:'100%', background:'linear-gradient(135deg,#F5C400,#D4A200)',
                  border:'none', borderRadius:12, color:'#000',
                  fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900,
                  letterSpacing:'0.2em', padding:'14px', cursor:'pointer',
                  animation:'cta-pulse 2s ease-in-out infinite', position:'relative', overflow:'hidden' }}>
                DEFINIR PALPITE →
              </button>
              <button onClick={() => setStep('formation')}
                style={{ width:'100%', marginTop:8, background:'none', border:'none',
                  color:'rgba(255,255,255,0.25)', fontFamily:"'Barlow Condensed',sans-serif",
                  fontSize:10, fontWeight:700, letterSpacing:'0.2em', cursor:'pointer', padding:'6px' }}>
                ← Mudar formação
              </button>
            </div>

            {/* Modal mercado de jogadores */}
            <AnimatePresence>
              {activeSlot && (
                <motion.div key="modal"
                  initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
                  transition={{ type:'spring', damping:30, stiffness:300 }}
                  style={{ position:'absolute', inset:0, zIndex:50,
                    background:'rgba(0,0,0,0.97)', display:'flex', flexDirection:'column' }}>

                  <div style={{ padding:'16px', display:'flex', justifyContent:'space-between',
                    alignItems:'center', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ fontSize:20, fontWeight:900, fontStyle:'italic',
                      textTransform:'uppercase', margin:0 }}>
                      {activeSlot === 'captain_pick' ? 'Escolha o Capitão'
                        : activeSlot === 'hero_pick'  ? 'Escolha o Herói'
                        : 'Selecione o Jogador'}
                    </h3>
                    <button onClick={() => setActiveSlot(null)}
                      style={{ background:'rgba(255,255,255,0.08)', border:'none', borderRadius:8,
                        padding:'6px 12px', color:'rgba(255,255,255,0.5)', cursor:'pointer',
                        fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700 }}>
                      FECHAR
                    </button>
                  </div>

                  <div style={{ flex:1, overflowY:'auto', padding:'12px',
                    display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
                    {PLAYERS
                      .filter(p => {
                        if (activeSlot === 'captain_pick' || activeSlot === 'hero_pick') return true;
                        const s = slots.find(sl => sl.id === activeSlot);
                        return s ? p.pos === s.pos || true : true; // mostra todos, filtra por posição se quiser
                      })
                      .map(p => (
                        <button key={p.id}
                          onClick={() => {
                            if (activeSlot === 'captain_pick') { setCaptainId(p.id); setActiveSlot(null); return; }
                            if (activeSlot === 'hero_pick')    { setHeroId(p.id);    setActiveSlot(null); return; }
                            handlePick(p);
                          }}
                          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                            borderRadius:10, padding:'8px', display:'flex', flexDirection:'column',
                            alignItems:'center', cursor:'pointer', gap:4 }}>
                          <img src={p.foto} alt={p.short}
                            style={{ width:'100%', aspectRatio:'1', objectFit:'cover',
                              objectPosition:'center top', borderRadius:6 }}
                            onError={e => { (e.target as HTMLImageElement).style.opacity='0.2'; }} />
                          <span style={{ fontSize:9, fontWeight:900, textTransform:'uppercase',
                            fontFamily:"'Barlow Condensed',sans-serif", color:'#fff',
                            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', maxWidth:'100%' }}>
                            {p.short}
                          </span>
                          <span style={{ fontSize:8, color: POS_COLORS[p.pos] ?? '#888', fontWeight:700 }}>
                            {p.pos}
                          </span>
                        </button>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ══ STEP 3 — PALPITE ═══════════════════════════════ */}
        {step === 'score' && (
          <motion.div key="score"
            initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
            style={{ flex:1, zIndex:10, display:'flex', flexDirection:'column',
              justifyContent:'center', padding:'24px 20px' }}>

            <div style={{ textAlign:'center', marginBottom:8 }}>
              <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.35em',
                color:'rgba(245,196,0,0.5)' }}>STEP 5 · PALPITE</span>
            </div>
            <h2 style={{ textAlign:'center', fontSize:28, fontWeight:900, fontStyle:'italic',
              textTransform:'uppercase', letterSpacing:'-0.02em', marginBottom:4 }}>
              Crave o Resultado
            </h2>
            <p style={{ textAlign:'center', fontSize:10, color:'rgba(255,255,255,0.3)',
              letterSpacing:'0.15em', marginBottom:28 }}>
              Placar exato → <span style={{ color:'#F5C400' }}>+15 pts</span> &nbsp;·&nbsp;
              Vencedor certo → <span style={{ color:'#22C55E' }}>+5 pts</span>
            </p>

            <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)',
              borderRadius:24, padding:'28px 20px', marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:20 }}>
                {/* Novo */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                  <img src={ESCUDO} alt="Novo" style={{ width:56, height:56, objectFit:'contain',
                    filter:'drop-shadow(0 0 10px rgba(245,196,0,0.4))' }} />
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={() => setScoreTigre(Math.max(0, scoreTigre - 1))}
                      style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.08)',
                        border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex',
                        alignItems:'center', justifyContent:'center' }}>−</button>
                    <div style={{ width:64, height:80, background:'rgba(0,0,0,0.6)',
                      border:'2px solid #F5C400', borderRadius:16, display:'flex',
                      alignItems:'center', justifyContent:'center',
                      fontSize:48, fontWeight:900, color:'#F5C400',
                      fontStyle:'italic', fontFamily:"'Barlow Condensed',sans-serif",
                      textShadow:'0 0 20px rgba(245,196,0,0.5)' }}>{scoreTigre}</div>
                    <button onClick={() => setScoreTigre(scoreTigre + 1)}
                      style={{ width:28, height:28, borderRadius:8, background:'rgba(245,196,0,0.15)',
                        border:'none', color:'#F5C400', fontSize:18, cursor:'pointer', display:'flex',
                        alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                  <span style={{ fontSize:9, fontWeight:900, color:'rgba(245,196,0,0.6)',
                    letterSpacing:'0.2em' }}>NOVO</span>
                </div>

                <div style={{ fontSize:24, fontWeight:900, fontStyle:'italic',
                  color:'rgba(255,255,255,0.2)' }}>×</div>

                {/* Adversário */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
                  {escudoAdv
                    ? <img src={escudoAdv} alt={nomeAdv} style={{ width:56, height:56, objectFit:'contain' }} />
                    : <div style={{ width:56, height:56, background:'rgba(255,255,255,0.08)', borderRadius:10 }} />
                  }
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <button onClick={() => setScoreAdversario(Math.max(0, scoreAdversario - 1))}
                      style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.08)',
                        border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex',
                        alignItems:'center', justifyContent:'center' }}>−</button>
                    <div style={{ width:64, height:80, background:'rgba(0,0,0,0.6)',
                      border:'2px solid rgba(255,255,255,0.2)', borderRadius:16, display:'flex',
                      alignItems:'center', justifyContent:'center',
                      fontSize:48, fontWeight:900, color:'rgba(255,255,255,0.6)',
                      fontStyle:'italic', fontFamily:"'Barlow Condensed',sans-serif" }}>{scoreAdversario}</div>
                    <button onClick={() => setScoreAdversario(scoreAdversario + 1)}
                      style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,0.08)',
                        border:'none', color:'#fff', fontSize:18, cursor:'pointer', display:'flex',
                        alignItems:'center', justifyContent:'center' }}>+</button>
                  </div>
                  <span style={{ fontSize:9, fontWeight:900, color:'rgba(255,255,255,0.4)',
                    letterSpacing:'0.2em' }}>{nomeAdv.toUpperCase().slice(0, 10)}</span>
                </div>
              </div>
            </div>

            <button onClick={salvarEscalacao} disabled={saving}
              style={{ width:'100%', background:'linear-gradient(135deg,#F5C400,#D4A200)',
                border:'none', borderRadius:14, color:'#000',
                fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900,
                letterSpacing:'0.2em', padding:'15px', cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
                animation: saving ? 'none' : 'cta-pulse 2s ease-in-out infinite',
                position:'relative', overflow:'hidden' }}>
              {saving ? 'SALVANDO...' : 'CRAVAR PALPITE — VER MEU TIME →'}
              {!saving && (
                <div style={{ position:'absolute', inset:0,
                  background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)`,
                  backgroundSize:'200%', animation:'led-scan 3s linear infinite' }} />
              )}
            </button>
            <button onClick={() => setStep('picking')}
              style={{ width:'100%', marginTop:10, background:'none', border:'none',
                color:'rgba(255,255,255,0.25)', fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:10, fontWeight:700, letterSpacing:'0.2em', cursor:'pointer', padding:'6px' }}>
              ← Ajustar time
            </button>
          </motion.div>
        )}

        {/* ══ STEP 4 — REVEAL (CAMPO PS5) ════════════════════ */}
        {step === 'reveal' && (
          <motion.div key="reveal"
            initial={{ opacity:0 }} animate={{ opacity:1 }}
            style={{ flex:1, zIndex:10, display:'flex', flexDirection:'column',
              alignItems:'center', overflowY:'auto', padding:'0 0 24px' }}>

            {/* Título */}
            <div style={{ width:'100%', textAlign:'center', padding:'16px 16px 10px',
              background:'rgba(0,0,0,0.7)', backdropFilter:'blur(12px)',
              borderBottom:'1px solid rgba(245,196,0,0.12)' }}>
              <div style={{ fontSize:9, fontWeight:900, letterSpacing:'0.35em',
                color:'rgba(0,243,255,0.6)', marginBottom:4 }}>
                TIME SALVO NO BANCO!
              </div>
              <h2 style={{ fontSize:26, fontWeight:900, fontStyle:'italic',
                textTransform:'uppercase', letterSpacing:'-0.02em', margin:0 }}>
                SALVE & DESAFIE
              </h2>
              <p style={{ fontSize:14, margin:'2px 0 0', color:'rgba(255,255,255,0.5)' }}>
                A GALERA
              </p>
            </div>

            {/* Card do campo */}
            <div style={{ width:'100%', maxWidth:400, padding:'0 12px', marginTop:12 }}>

              {/* Header do card */}
              <div style={{ background:'#0a0a0a', border:'1px solid rgba(245,196,0,0.2)',
                borderBottom:'none', borderRadius:'16px 16px 0 0', padding:'12px 14px 10px',
                display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <img src={ESCUDO} alt="Tigre" style={{ width:28, height:28, objectFit:'contain' }} />
                  <div>
                    <div style={{ fontSize:8, color:'rgba(245,196,0,0.5)', letterSpacing:'0.3em', fontWeight:900 }}>
                      TIGRE FC · FANTASY LEAGUE
                    </div>
                    <div style={{ fontSize:14, fontWeight:900, fontStyle:'italic', color:'#fff', lineHeight:1 }}>
                      MEU TIME ESTÁ PRONTO!
                    </div>
                  </div>
                </div>
                <div style={{ background:'rgba(245,196,0,0.1)', border:'1px solid rgba(245,196,0,0.25)',
                  borderRadius:6, padding:'4px 10px', fontSize:11, fontWeight:900,
                  color:'#F5C400', letterSpacing:'0.15em', fontFamily:"'Barlow Condensed',sans-serif" }}>
                  {formation}
                </div>
              </div>

              {/* Campo PS5 */}
              <div style={{ position:'relative', width:'100%', aspectRatio:'0.72', overflow:'hidden',
                border:'1px solid rgba(245,196,0,0.2)',
                borderTop:'2px solid rgba(245,196,0,0.3)' }}>
                <GramadoSVG />
                {/* label ataque/defesa */}
                <div style={{ position:'absolute', top:6, left:'50%', transform:'translateX(-50%)',
                  fontSize:7, fontWeight:900, letterSpacing:'0.4em', color:'rgba(255,255,255,0.2)',
                  fontFamily:"'Barlow Condensed',sans-serif", zIndex:20 }}>ATAQUE</div>
                <div style={{ position:'absolute', bottom:6, left:'50%', transform:'translateX(-50%)',
                  fontSize:7, fontWeight:900, letterSpacing:'0.4em', color:'rgba(255,255,255,0.2)',
                  fontFamily:"'Barlow Condensed',sans-serif", zIndex:20 }}>DEFESA</div>
                {/* jogadores posicionados */}
                {campoReady && slots.map((s, i) => (
                  <PlayerPin key={s.id} player={lineup[s.id] ?? null}
                    x={s.x} y={s.y} idx={i}
                    isCaptain={lineup[s.id]?.id === captainId}
                    isHero={lineup[s.id]?.id === heroId} />
                ))}
              </div>

              {/* Footer do card */}
              <div style={{ background:'#080808', border:'1px solid rgba(245,196,0,0.2)',
                borderTop:'none', borderRadius:'0 0 12px 12px', padding:'10px 14px 14px' }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:12 }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:7, color:'rgba(245,196,0,0.5)', letterSpacing:'0.2em', fontWeight:900 }}>CAPITÃO</div>
                    <div style={{ fontSize:12, fontWeight:900, color:'#F5C400', marginTop:2 }}>
                      {PLAYERS.find(p => p.id === captainId)?.short ?? '—'}
                    </div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:7, color:'rgba(255,45,85,0.5)', letterSpacing:'0.2em', fontWeight:900 }}>HERÓI</div>
                    <div style={{ fontSize:12, fontWeight:900, color:'#FF2D55', marginTop:2 }}>
                      {PLAYERS.find(p => p.id === heroId)?.short ?? '—'}
                    </div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:7, color:'rgba(255,255,255,0.3)', letterSpacing:'0.2em', fontWeight:900 }}>PALPITE</div>
                    <div style={{ fontSize:12, fontWeight:900, color:'#fff', marginTop:2 }}>
                      {scoreTigre}×{scoreAdversario}
                    </div>
                  </div>
                </div>

                {/* Botão compartilhar */}
                <button
                  style={{ width:'100%', background:'linear-gradient(135deg,#F5C400,#D4A200)',
                    border:'none', borderRadius:10, color:'#000',
                    fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:900,
                    letterSpacing:'0.15em', padding:'14px', cursor:'pointer',
                    position:'relative', overflow:'hidden',
                    animation:'cta-pulse 2s ease-in-out infinite' }}>
                  SALVAR STORY & COMPARTILHAR
                  <div style={{ position:'absolute', inset:0,
                    background:`linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)`,
                    backgroundSize:'200%', animation:'led-scan 3s linear infinite' }} />
                </button>

                <div style={{ textAlign:'center', fontSize:8, color:'rgba(255,255,255,0.2)',
                  letterSpacing:'0.1em', marginTop:8, fontWeight:700 }}>
                  VOCÊ CONSEGUE FAZER MELHOR?
                </div>
              </div>
            </div>

            <button onClick={() => setStep('picking')}
              style={{ marginTop:16, background:'none', border:'none',
                color:'rgba(255,255,255,0.25)', fontFamily:"'Barlow Condensed',sans-serif",
                fontSize:10, fontWeight:700, letterSpacing:'0.2em', cursor:'pointer', padding:'8px' }}>
              ← EDITAR ESCALAÇÃO
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
