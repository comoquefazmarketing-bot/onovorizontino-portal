'use client';
/**
 * EscalacaoFormacao — Arena Tigre FC PS5/FIFA Edition
 * Mágico de Oz: imagem do estádio como background, cards FUT por cima
 * Steps: formation → picking (campo+drawer) → bench → score → reveal
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

// ── Assets ────────────────────────────────────────────────
const BASE         = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ARENA_BG     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGREFC.png';
const FOTO_ROMULO  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ROMULO%20FUNDO%20TRANSPARENTE.png';
const FOTO_CARLAO  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CARLAO%20FUNDO%20TRANSPARENTE.png';
const SUPA_URL     = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON    = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Tipos ─────────────────────────────────────────────────
type Player = { id: number; name: string; short: string; num: number | null; pos: string; foto: string; overall: number };
type Lineup = Record<string, Player | null>;
type Step   = 'formation' | 'picking' | 'bench' | 'score' | 'reveal';
type Slot   = { id: string; x: number; y: number; pos: string; label: string };
type ActiveSlot = string | 'captain_pick' | 'hero_pick' | null;

interface Jogo {
  id:           number;
  competicao?:  string;
  rodada?:      string;
  data_hora?:   string;
  local?:       string;
  transmissao?: string;
  mandante?:  { nome: string; escudo_url: string | null; sigla?: string | null };
  visitante?: { nome: string; escudo_url: string | null; sigla?: string | null };
}

interface Props { jogoId?: number }

// ── Estado único do jogo ──────────────────────────────────
interface GameData {
  formation:     string;
  lineup:        Lineup;
  bench:         Lineup;
  captainId:     number | null;
  heroId:        number | null;
  scoreTigre:    number;
  scoreAdv:      number;
}

const initialGameData: GameData = {
  formation:  '4-2-3-1',
  lineup:     {},
  bench:      {},
  captainId:  null,
  heroId:     null,
  scoreTigre: 0,
  scoreAdv:   0,
};

// ── Elenco ────────────────────────────────────────────────
const PLAYERS: Player[] = [
  { id:1,  name:'César Augusto',    short:'César',      num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp',     overall:82 },
  { id:2,  name:'Jordi',            short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp',             overall:79 },
  { id:3,  name:'João Scapin',      short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp',       overall:71 },
  { id:4,  name:'Lucas',            short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp',     overall:69 },
  { id:5,  name:'Jhilmar Lora',     short:'Lora',       num:24, pos:'LAT', foto:BASE+'LORA.jpg.webp',              overall:75 },
  { id:6,  name:'Nilson Castrillón',short:'Castrillón', num:20, pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp',        overall:74 },
  { id:7,  name:'Sander',           short:'Sander',     num:5,  pos:'LAT', foto:BASE+'SANDER.jpg.webp',            overall:73 },
  { id:8,  name:'Maykon Jesus',     short:'Maykon',     num:66, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp',      overall:72 },
  { id:9,  name:'Dantas',           short:'Dantas',     num:25, pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp',           overall:81 },
  { id:10, name:'Eduardo Brock',    short:'E.Brock',    num:14, pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp',     overall:80 },
  { id:11, name:'Patrick',          short:'Patrick',    num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp',           overall:79 },
  { id:12, name:'Gabriel Bahia',    short:'G.Bahia',    num:26, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp',     overall:74 },
  { id:13, name:'Carlinhos',        short:'Carlinhos',  num:3,  pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp',         overall:73 },
  { id:14, name:'Kauan Alemão',     short:'Alemão',     num:21, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp',            overall:72 },
  { id:15, name:'Renato Palm',      short:'R.Palm',     num:33, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp',       overall:71 },
  { id:16, name:'Alexis Alvariño',  short:'Alvariño',   num:22, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp',     overall:75 },
  { id:17, name:'Luís Oyama',       short:'Oyama',      num:6,  pos:'VOL', foto:BASE+'LUIS-OYAMA.jpg.webp',        overall:81 },
  { id:18, name:'Léo Naldi',        short:'L.Naldi',    num:18, pos:'VOL', foto:BASE+'LEO-NALDI.jpg.webp',         overall:77 },
  { id:19, name:'Marlon',           short:'Marlon',     num:28, pos:'VOL', foto:BASE+'MARLON.jpg.webp',            overall:74 },
  { id:20, name:'Luiz Gabriel',     short:'L.Gabriel',  num:23, pos:'VOL', foto:BASE+'LUIZ-GABRIEL.jpg.webp',      overall:72 },
  { id:21, name:'Rômulo',           short:'Rômulo',     num:10, pos:'MEI', foto:FOTO_ROMULO,                       overall:92 },
  { id:22, name:'Matheus Bianqui',  short:'Bianqui',    num:17, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp',   overall:78 },
  { id:23, name:'Juninho',          short:'Juninho',    num:50, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp',           overall:76 },
  { id:24, name:'Tavinho',          short:'Tavinho',    num:15, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp',           overall:79 },
  { id:25, name:'Diego Galo',       short:'D.Galo',     num:19, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp',        overall:76 },
  { id:26, name:'Christian Ortíz',  short:'C.Ortiz',    num:8,  pos:'MEI', foto:BASE+'TITI-ORTIZ.jpg.webp',        overall:77 },
  { id:27, name:'Hector Bianchi',   short:'Hector',     num:35, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp',     overall:73 },
  { id:28, name:'Carlão',           short:'Carlão',     num:9,  pos:'ATA', foto:FOTO_CARLAO,                       overall:87 },
  { id:29, name:'Robson',           short:'Robson',     num:11, pos:'ATA', foto:BASE+'ROBSON.jpg.webp',            overall:84 },
  { id:30, name:'Vinícius Paiva',   short:'V.Paiva',    num:16, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp',    overall:78 },
  { id:31, name:'Hélio Borges',     short:'H.Borges',   num:41, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp',      overall:75 },
  { id:32, name:'Jardiel',          short:'Jardiel',    num:40, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp',           overall:74 },
  { id:33, name:'Nicolas Careca',   short:'N.Careca',   num:30, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp',    overall:72 },
  { id:34, name:'Diego Mathias',    short:'D.Mathias',  num:27, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp',     overall:71 },
  { id:35, name:'Ronald Barcellos', short:'Ronald',     num:7,  pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp',  overall:79 },
];

// ── Formações com coordenadas calibradas para a imagem do estádio ──
// y baixo = ataque (longe na imagem) | y alto = defesa (perto da câmera)
const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GOL' },
    { id:'lb',  x:18, y:72, pos:'LAT', label:'LE'  },
    { id:'cb1', x:38, y:75, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:62, y:75, pos:'ZAG', label:'ZAG' },
    { id:'rb',  x:82, y:72, pos:'LAT', label:'LD'  },
    { id:'dm1', x:35, y:55, pos:'VOL', label:'VOL' },
    { id:'dm2', x:65, y:55, pos:'VOL', label:'VOL' },
    { id:'lw',  x:18, y:32, pos:'MEI', label:'PE'  },
    { id:'am',  x:50, y:36, pos:'MEI', label:'MEI' },
    { id:'rw',  x:82, y:32, pos:'MEI', label:'PD'  },
    { id:'st',  x:50, y:14, pos:'ATA', label:'CA'  },
  ],
  '4-3-3': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GOL' },
    { id:'lb',  x:18, y:72, pos:'LAT', label:'LE'  },
    { id:'cb1', x:38, y:75, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:62, y:75, pos:'ZAG', label:'ZAG' },
    { id:'rb',  x:82, y:72, pos:'LAT', label:'LD'  },
    { id:'cm1', x:30, y:52, pos:'VOL', label:'VOL' },
    { id:'cm2', x:50, y:55, pos:'MEI', label:'MC'  },
    { id:'cm3', x:70, y:52, pos:'MEI', label:'MC'  },
    { id:'lw',  x:18, y:22, pos:'ATA', label:'PE'  },
    { id:'st',  x:50, y:14, pos:'ATA', label:'CA'  },
    { id:'rw',  x:82, y:22, pos:'ATA', label:'PD'  },
  ],
  '4-4-2': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GOL' },
    { id:'lb',  x:18, y:72, pos:'LAT', label:'LE'  },
    { id:'cb1', x:38, y:75, pos:'ZAG', label:'ZAG' },
    { id:'cb2', x:62, y:75, pos:'ZAG', label:'ZAG' },
    { id:'rb',  x:82, y:72, pos:'LAT', label:'LD'  },
    { id:'lm',  x:18, y:50, pos:'MEI', label:'ME'  },
    { id:'cm1', x:38, y:53, pos:'VOL', label:'VOL' },
    { id:'cm2', x:62, y:53, pos:'VOL', label:'VOL' },
    { id:'rm',  x:82, y:50, pos:'MEI', label:'MD'  },
    { id:'st1', x:35, y:18, pos:'ATA', label:'ATA' },
    { id:'st2', x:65, y:18, pos:'ATA', label:'ATA' },
  ],
};

const POS_COLORS: Record<string, string> = {
  GOL:'#F5C400', ZAG:'#22C55E', LAT:'#22C55E',
  VOL:'#00F3FF', MEI:'#00F3FF', ATA:'#FF2D55',
};

// ── Mercado aberto até 90min antes do jogo ───────────────
function mercadoAberto(dataHora?: string): boolean {
  if (!dataHora) return true;
  return new Date(dataHora).getTime() - 90 * 60_000 > Date.now();
}

// ── Card FUT do jogador ──────────────────────────────────
function FifaCard({
  player, isCaptain, isHero, scale = 1, onClick,
}: {
  player: Player; isCaptain?: boolean; isHero?: boolean;
  scale?: number; onClick?: () => void;
}) {
  const cor = isCaptain ? '#F5C400' : isHero ? '#FF2D55' : (POS_COLORS[player.pos] ?? '#888');
  const W  = Math.round(54 * scale);
  const H  = Math.round(W * 1.32);

  return (
    <motion.button onClick={onClick}
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2 }}
      style={{ background:'none', border:'none', padding:0, position:'relative',
        cursor: onClick ? 'pointer' : 'default' }}>
      {/* Sombra projetada no chão */}
      <div style={{
        position:'absolute', bottom:-6, left:'50%',
        width: W * 0.7, height: 6 * scale,
        background:'radial-gradient(ellipse, rgba(0,0,0,0.7), transparent 70%)',
        transform:'translateX(-50%)', filter:'blur(3px)', zIndex:-1,
      }} />

      {/* Frame do card */}
      <div style={{
        width: W, height: H,
        borderRadius: 6 * scale,
        overflow:'hidden',
        border: `${2 * scale}px solid ${cor}`,
        background:'linear-gradient(135deg,#1a1a1a,#000)',
        boxShadow: `0 0 ${10 * scale}px ${cor}66, 0 ${4 * scale}px ${12 * scale}px rgba(0,0,0,0.8)`,
      }}>
        {/* Foto */}
        <div style={{
          width:'100%', height:'72%',
          background:'#0d0d0d', position:'relative', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {/* Overall */}
          <div style={{
            position:'absolute', top: 2 * scale, left: 3 * scale,
            fontSize: 11 * scale, fontWeight:900, color:'#F5C400',
            fontFamily:"'Barlow Condensed',sans-serif",
            textShadow:'0 1px 2px #000, 0 0 4px rgba(0,0,0,0.8)',
            zIndex:5,
          }}>{player.overall}</div>

          {/* Posição */}
          <div style={{
            position:'absolute', top: 2 * scale, right: 3 * scale,
            fontSize: 7 * scale, fontWeight:900, color:'#fff',
            fontFamily:"'Barlow Condensed',sans-serif",
            textShadow:'0 1px 2px #000', zIndex:5,
          }}>{player.pos}</div>

          {/* Foto do jogador */}
          <img src={player.foto} alt={player.short}
            style={{ width:'100%', height:'100%', objectFit:'cover',
              objectPosition:'center top', opacity:0.95 }}
            onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
        </div>

        {/* Nome (barra colorida) */}
        <div style={{
          height:'28%', background: cor,
          display:'flex', alignItems:'center', justifyContent:'center',
          padding: `0 ${4 * scale}px`,
        }}>
          <span style={{
            fontSize: 8 * scale, fontWeight:900,
            color: cor === '#F5C400' ? '#000' : '#fff',
            fontFamily:"'Barlow Condensed',sans-serif",
            letterSpacing:'0.05em', textTransform:'uppercase',
            whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
            maxWidth: W - 8 * scale,
          }}>
            {player.short}
          </span>
        </div>
      </div>

      {/* Badges Capitão/Herói */}
      {(isCaptain || isHero) && (
        <div style={{
          position:'absolute', top: -6 * scale, right: -6 * scale,
          width: 18 * scale, height: 18 * scale, borderRadius:'50%',
          background: isCaptain ? '#F5C400' : '#FF2D55',
          color: isCaptain ? '#000' : '#fff',
          fontSize: 10 * scale, fontWeight:900,
          display:'flex', alignItems:'center', justifyContent:'center',
          border:'2px solid #000', fontFamily:"'Barlow Condensed',sans-serif",
          zIndex:10, boxShadow:`0 0 8px ${isCaptain ? '#F5C400' : '#FF2D55'}`,
        }}>
          {isCaptain ? 'C' : '★'}
        </div>
      )}
    </motion.button>
  );
}

// ── Slot vazio ────────────────────────────────────────────
function EmptySlot({
  label, scale = 1, active, onClick,
}: { label: string; scale?: number; active?: boolean; onClick?: () => void }) {
  const W = Math.round(54 * scale);
  const H = Math.round(W * 1.32);
  return (
    <motion.button onClick={onClick}
      whileTap={{ scale: 0.92 }}
      animate={active ? {
        boxShadow: [
          '0 0 0 2px rgba(245,196,0,0.5), 0 0 12px rgba(245,196,0,0.3)',
          '0 0 0 2px rgba(245,196,0,0.9), 0 0 24px rgba(245,196,0,0.6)',
          '0 0 0 2px rgba(245,196,0,0.5), 0 0 12px rgba(245,196,0,0.3)',
        ],
      } : {}}
      transition={active ? { duration: 1.5, repeat: Infinity } : {}}
      style={{
        width: W, height: H,
        borderRadius: 6 * scale,
        border: `${2 * scale}px dashed ${active ? 'rgba(245,196,0,0.7)' : 'rgba(255,255,255,0.25)'}`,
        background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        cursor:'pointer', padding:0,
      }}>
      <span style={{ fontSize: 18 * scale, color:'rgba(245,196,0,0.7)',
        fontWeight:900, lineHeight:1, fontFamily:"'Barlow Condensed',sans-serif" }}>+</span>
      <span style={{ fontSize: 8 * scale, fontWeight:900,
        color: active ? '#F5C400' : 'rgba(255,255,255,0.5)',
        letterSpacing:'0.1em', marginTop: 2 * scale,
        fontFamily:"'Barlow Condensed',sans-serif" }}>{label}</span>
    </motion.button>
  );
}

// ── Calcula escala do card baseado em y (perspectiva) ────
// y=0 (topo/ataque, longe da câmera) → escala 0.78
// y=100 (base/goleiro, perto da câmera) → escala 1.05
function scalePorY(y: number): number {
  return 0.78 + (y / 100) * 0.27;
}

// ── Componente Principal ──────────────────────────────────
export default function EscalacaoFormacao({ jogoId }: Props) {
  const [step,     setStep]     = useState<Step>('formation');
  const [game,     setGame]     = useState<GameData>(initialGameData);
  const [activeSlot, setActiveSlot] = useState<ActiveSlot>(null);
  const [drawerPos,  setDrawerPos]  = useState<string | null>(null);
  const [jogo,     setJogo]     = useState<Jogo | null>(null);
  const [saving,   setSaving]   = useState(false);

  const slots = useMemo(() => FORMATIONS[game.formation] ?? FORMATIONS['4-2-3-1'], [game.formation]);
  const fechado = !mercadoAberto(jogo?.data_hora);

  // ── Busca jogo via REST ───────────────────────────────
  useEffect(() => {
    async function fetchJogo() {
      const url = jogoId
        ? `${SUPA_URL}/rest/v1/jogos?id=eq.${jogoId}&select=id,competicao,rodada,data_hora,local,transmissao,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&limit=1`
        : `${SUPA_URL}/rest/v1/jogos?ativo=eq.true&finalizado=eq.false&select=id,competicao,rodada,data_hora,local,transmissao,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&order=data_hora.asc&limit=1`;
      try {
        const res = await fetch(url, {
          headers: { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` },
          cache: 'no-store',
        });
        const data = await res.json();
        if (data?.[0]) setJogo(data[0]);
      } catch { /* mantém null */ }
    }
    fetchJogo();
  }, [jogoId]);

  // ── Adversário (Novo é visitante) ──────────────────────
  const escudoAdv = jogo?.mandante?.escudo_url ?? null;
  const nomeAdv   = jogo?.mandante?.nome ?? 'Adversário';
  const lineupCount = Object.values(game.lineup).filter(Boolean).length;

  // ── Pick player ───────────────────────────────────────
  const handlePick = useCallback((player: Player) => {
    if (activeSlot === 'captain_pick') {
      setGame(g => ({ ...g, captainId: player.id }));
      setActiveSlot(null); setDrawerPos(null);
      return;
    }
    if (activeSlot === 'hero_pick') {
      setGame(g => ({ ...g, heroId: player.id }));
      setActiveSlot(null); setDrawerPos(null);
      return;
    }
    if (!activeSlot) return;
    setGame(g => ({ ...g, lineup: { ...g.lineup, [activeSlot]: player } }));
    setActiveSlot(null); setDrawerPos(null);
  }, [activeSlot]);

  // ── Salvar escalação ──────────────────────────────────
  const salvarEscalacao = useCallback(async () => {
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetch('/api/escalacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            google_id:     session.user.id,
            jogo_id:       jogo?.id,
            formacao:      game.formation,
            lineup:        game.lineup,
            bench:         game.bench,
            capitao_id:    game.captainId,
            heroi_id:      game.heroId,
            palpite_tigre: game.scoreTigre,
            palpite_adv:   game.scoreAdv,
          }),
        });
      }
    } catch { /* segue para o reveal */ }
    finally { setSaving(false); setStep('reveal'); }
  }, [game, jogo]);

  // ── Players filtrados pra o drawer ─────────────────────
  const playersFiltered = useMemo(() => {
    if (!activeSlot) return PLAYERS;
    if (activeSlot === 'captain_pick' || activeSlot === 'hero_pick') {
      return Object.values(game.lineup).filter(Boolean) as Player[];
    }
    if (drawerPos) return PLAYERS.filter(p => p.pos === drawerPos);
    const slot = slots.find(s => s.id === activeSlot);
    return slot ? PLAYERS.filter(p => p.pos === slot.pos) : PLAYERS;
  }, [activeSlot, drawerPos, slots, game.lineup]);

  return (
    <div style={{
      minHeight: '100svh', background: '#000', color: '#fff',
      fontFamily: "'Barlow Condensed',Impact,sans-serif",
      display: 'flex', flexDirection: 'column', position: 'relative',
    }}>
      <style>{`
        @keyframes scan-led {0%{background-position:-200% center} 100%{background-position:200% center}}
        @keyframes cta-pulse {0%,100%{box-shadow:0 0 16px rgba(245,196,0,0.4),0 0 32px rgba(245,196,0,0.2)} 50%{box-shadow:0 0 28px rgba(245,196,0,0.8),0 0 56px rgba(245,196,0,0.4)}}
        .arena-scan{background:linear-gradient(90deg,transparent,#F5C400,#fff,#00F3FF,transparent);background-size:200%;animation:scan-led 3s linear infinite}
      `}</style>

      <AnimatePresence mode="wait">

        {/* ═══ STEP 1 — FORMAÇÃO ════════════════════════════ */}
        {step === 'formation' && (
          <motion.div key="formation"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.96 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', padding: '24px 20px',
              background: 'radial-gradient(ellipse at top,#0a1929 0%,#000 70%)' }}>

            <img src={ESCUDO} alt="Tigre"
              style={{ width: 80, height: 80, marginBottom: 20,
                filter: 'drop-shadow(0 0 16px rgba(245,196,0,0.5))' }} />

            <div style={{ fontSize: 9, color: 'rgba(245,196,0,0.6)',
              letterSpacing: '0.4em', fontWeight: 900, marginBottom: 6 }}>
              🐯 ARENA TIGRE FC
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, fontStyle: 'italic',
              letterSpacing: '-0.02em', textTransform: 'uppercase',
              marginBottom: 6, textAlign: 'center' }}>Escolha sua Tática</h1>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.3em', fontWeight: 700, marginBottom: 28, textAlign: 'center' }}>
              A base do seu sucesso começa aqui
            </p>

            {jogo && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
                background: 'rgba(245,196,0,0.06)', border: '1px solid rgba(245,196,0,0.15)',
                borderRadius: 12, padding: '10px 16px' }}>
                {escudoAdv && <img src={escudoAdv} alt={nomeAdv} style={{ width: 32, height: 32 }} />}
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 9, color: 'rgba(245,196,0,0.5)',
                    letterSpacing: '0.2em', fontWeight: 900 }}>PRÓXIMO JOGO</div>
                  <div style={{ fontSize: 14, fontWeight: 900 }}>
                    NOVO × {nomeAdv.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>
                    {jogo.rodada} · {jogo.competicao}
                  </div>
                </div>
              </div>
            )}

            {fechado && (
              <div style={{ background: 'rgba(255,45,85,0.1)',
                border: '1px solid rgba(255,45,85,0.3)', borderRadius: 10,
                padding: '10px 16px', marginBottom: 20, fontSize: 12,
                fontWeight: 900, color: '#FF2D55', letterSpacing: '0.1em' }}>
                MERCADO FECHADO
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 10, width: '100%', maxWidth: 320 }}>
              {Object.keys(FORMATIONS).map(f => (
                <button key={f}
                  onClick={() => { setGame(g => ({ ...g, formation: f })); setStep('picking'); }}
                  disabled={fechado}
                  style={{ background: 'rgba(255,255,255,0.04)',
                    border: '2px solid rgba(255,255,255,0.1)', borderRadius: 16,
                    padding: '20px 10px', fontFamily: "'Barlow Condensed',sans-serif",
                    fontSize: 22, fontWeight: 900,
                    color: fechado ? 'rgba(255,255,255,0.2)' : '#fff',
                    cursor: fechado ? 'not-allowed' : 'pointer' }}>
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 2 — PICKING (Mágico de Oz) ═══════════════ */}
        {step === 'picking' && (
          <motion.div key="picking"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column',
              background: '#000' }}>

            {/* HEADER */}
            <div style={{ position: 'relative', padding: '14px 16px 10px',
              background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(245,196,0,0.2)', zIndex: 30 }}>
              <div className="arena-scan" style={{ position: 'absolute',
                top: 0, left: 0, right: 0, height: 2 }} />
              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', marginBottom: 8 }}>
                <button onClick={() => setStep('formation')}
                  style={{ background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
                    padding: '6px 10px', fontSize: 9, fontWeight: 900,
                    color: 'rgba(255,255,255,0.6)', letterSpacing: '0.15em',
                    cursor: 'pointer', fontFamily: "'Barlow Condensed',sans-serif" }}>
                  ← VOLTAR
                </button>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#F5C400',
                  letterSpacing: '0.2em', background: 'rgba(245,196,0,0.1)',
                  border: '1px solid rgba(245,196,0,0.3)', borderRadius: 8,
                  padding: '6px 12px' }}>
                  {game.formation}
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900,
                  letterSpacing: '0.3em', color: '#F5C400',
                  textShadow: '0 0 12px rgba(245,196,0,0.7)' }}>
                  🐯 ARENA TIGRE FC
                </div>
                <div style={{ fontSize: 8, letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginTop: 2 }}>
                  — ESCALAÇÃO TITULAR · {lineupCount}/11 —
                </div>
              </div>
            </div>

            {/* STEPS BAR */}
            <div style={{ display: 'flex', gap: 4, padding: '8px 16px',
              justifyContent: 'center', background: 'rgba(0,0,0,0.8)' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
                  maxWidth: 60,
                  background: i === 1 ? '#22C55E'
                    : i === 2 ? '#F5C400'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: i === 2 ? '0 0 8px rgba(245,196,0,0.5)' : 'none' }} />
              ))}
            </div>

            {/* CAMPO COM IMAGEM DE FUNDO + CARDS POR CIMA */}
            <div style={{ position: 'relative', width: '100%',
              aspectRatio: '1.27', overflow: 'hidden',
              backgroundColor: '#0a1f0e',
              backgroundImage: `url('${ARENA_BG}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center' }}>

              {/* Overlay para escurecer levemente */}
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.05) 40%,rgba(0,0,0,0.3) 100%)',
                pointerEvents: 'none' }} />

              {/* Slots/cards posicionados sobre o campo */}
              {slots.map(s => {
                const scale = scalePorY(s.y);
                const player = game.lineup[s.id];
                return (
                  <div key={s.id} style={{ position: 'absolute',
                    left: `${s.x}%`, top: `${s.y}%`,
                    transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                    {player ? (
                      <FifaCard
                        player={player}
                        scale={scale}
                        isCaptain={player.id === game.captainId}
                        isHero={player.id === game.heroId}
                        onClick={() => { setActiveSlot(s.id); setDrawerPos(s.pos); }}
                      />
                    ) : (
                      <EmptySlot
                        label={s.label}
                        scale={scale}
                        active={activeSlot === s.id}
                        onClick={() => { setActiveSlot(s.id); setDrawerPos(s.pos); }}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* BOTÕES CAPITÃO/HERÓI/AVANÇAR */}
            <div style={{ padding: '12px 14px 14px',
              background: 'rgba(0,0,0,0.95)',
              borderTop: '1px solid rgba(245,196,0,0.15)' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button onClick={() => { setActiveSlot('captain_pick'); setDrawerPos(null); }}
                  disabled={lineupCount === 0}
                  style={{ flex: 1, padding: '10px', borderRadius: 8,
                    border: '1px solid rgba(245,196,0,0.4)',
                    background: game.captainId ? 'rgba(245,196,0,0.15)' : 'transparent',
                    color: '#F5C400', fontFamily: "'Barlow Condensed',sans-serif",
                    fontSize: 11, fontWeight: 900, letterSpacing: '0.15em',
                    cursor: lineupCount === 0 ? 'not-allowed' : 'pointer',
                    opacity: lineupCount === 0 ? 0.5 : 1 }}>
                  C CAPITÃO {game.captainId ? '✓' : ''}
                </button>
                <button onClick={() => { setActiveSlot('hero_pick'); setDrawerPos(null); }}
                  disabled={lineupCount === 0}
                  style={{ flex: 1, padding: '10px', borderRadius: 8,
                    border: '1px solid rgba(255,45,85,0.4)',
                    background: game.heroId ? 'rgba(255,45,85,0.15)' : 'transparent',
                    color: '#FF2D55', fontFamily: "'Barlow Condensed',sans-serif",
                    fontSize: 11, fontWeight: 900, letterSpacing: '0.15em',
                    cursor: lineupCount === 0 ? 'not-allowed' : 'pointer',
                    opacity: lineupCount === 0 ? 0.5 : 1 }}>
                  ★ HERÓI {game.heroId ? '✓' : ''}
                </button>
              </div>
              <button onClick={() => setStep('score')}
                disabled={lineupCount < 11}
                style={{ width: '100%',
                  background: lineupCount < 11 ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#F5C400,#D4A200)',
                  border: 'none', borderRadius: 12,
                  color: lineupCount < 11 ? 'rgba(255,255,255,0.3)' : '#000',
                  fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14, fontWeight: 900,
                  letterSpacing: '0.2em', padding: '14px',
                  cursor: lineupCount < 11 ? 'not-allowed' : 'pointer',
                  animation: lineupCount === 11 ? 'cta-pulse 2s ease-in-out infinite' : 'none' }}>
                {lineupCount < 11
                  ? `ESCALE ${11 - lineupCount} JOGADOR${11 - lineupCount > 1 ? 'ES' : ''}`
                  : 'DEFINIR PALPITE →'}
              </button>
            </div>

            {/* DRAWER MERCADO */}
            <AnimatePresence>
              {activeSlot && (
                <motion.div key="drawer"
                  initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                  transition={{ type: 'spring', damping: 32, stiffness: 320 }}
                  style={{ position: 'fixed', left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(180deg,#0a0a0a 0%,#000 100%)',
                    borderTop: '2px solid #F5C400',
                    borderRadius: '20px 20px 0 0', padding: '14px 14px 18px',
                    zIndex: 100, maxHeight: '78svh',
                    display: 'flex', flexDirection: 'column',
                    boxShadow: '0 -10px 40px rgba(245,196,0,0.15)' }}>

                  {/* Handle */}
                  <div style={{ width: 40, height: 4,
                    background: 'rgba(255,255,255,0.2)', borderRadius: 2,
                    margin: '0 auto 12px' }} />

                  {/* Header drawer */}
                  <div style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', marginBottom: 12,
                    paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#F5C400',
                        letterSpacing: '0.15em',
                        textShadow: '0 0 8px rgba(245,196,0,0.4)' }}>
                        {activeSlot === 'captain_pick' ? '🏆 ESCOLHA O CAPITÃO'
                          : activeSlot === 'hero_pick'  ? '★ ESCOLHA O HERÓI'
                          : `${drawerPos ?? 'MERCADO'} · SELECIONE`}
                      </div>
                      <div style={{ fontSize: 8, fontWeight: 700,
                        color: 'rgba(255,255,255,0.4)',
                        letterSpacing: '0.2em', marginTop: 2 }}>
                        {playersFiltered.length} JOGADORES DISPONÍVEIS
                      </div>
                    </div>
                    <button onClick={() => { setActiveSlot(null); setDrawerPos(null); }}
                      style={{ background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                        width: 32, height: 32, color: 'rgba(255,255,255,0.5)',
                        fontSize: 14, fontWeight: 900, cursor: 'pointer' }}>×</button>
                  </div>

                  {/* Filtros de posição (só pra slot, não pra capitão/herói) */}
                  {!['captain_pick', 'hero_pick'].includes(activeSlot) && (
                    <div style={{ display: 'flex', gap: 4, marginBottom: 10,
                      overflowX: 'auto', paddingBottom: 2 }}>
                      {['GOL','LAT','ZAG','VOL','MEI','ATA'].map(p => (
                        <button key={p}
                          onClick={() => setDrawerPos(p)}
                          style={{ flexShrink: 0, padding: '6px 12px',
                            borderRadius: 6, fontSize: 10, fontWeight: 900,
                            letterSpacing: '0.1em',
                            background: drawerPos === p ? 'rgba(245,196,0,0.18)' : 'rgba(255,255,255,0.04)',
                            border: drawerPos === p ? '1px solid #F5C400' : '1px solid rgba(255,255,255,0.08)',
                            color: drawerPos === p ? '#F5C400' : 'rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            fontFamily: "'Barlow Condensed',sans-serif" }}>
                          {p}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Grid de cards */}
                  <div style={{ flex: 1, overflowY: 'auto',
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
                    paddingRight: 4 }}>
                    {playersFiltered.map(p => (
                      <button key={p.id} onClick={() => handlePick(p)}
                        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.04),rgba(0,0,0,0.6))',
                          border: '1.5px solid rgba(245,196,0,0.15)',
                          borderRadius: 8, padding: 6, cursor: 'pointer',
                          textAlign: 'center', display: 'flex',
                          flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ width: '100%', aspectRatio: '1',
                          background: '#0d0d0d', borderRadius: 6,
                          overflow: 'hidden', position: 'relative',
                          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ position: 'absolute', top: 2, left: 3,
                            fontSize: 10, fontWeight: 900, color: '#F5C400',
                            fontFamily: "'Barlow Condensed',sans-serif",
                            textShadow: '0 1px 2px #000', zIndex: 5 }}>{p.overall}</span>
                          <span style={{ position: 'absolute', top: 2, right: 3,
                            fontSize: 7, fontWeight: 900, color: '#fff',
                            fontFamily: "'Barlow Condensed',sans-serif",
                            textShadow: '0 1px 2px #000', zIndex: 5 }}>{p.pos}</span>
                          <img src={p.foto} alt={p.short}
                            style={{ width: '100%', height: '100%',
                              objectFit: 'cover', objectPosition: 'center top' }}
                            onError={e => { (e.target as HTMLImageElement).style.opacity = '0.2'; }} />
                        </div>
                        <div style={{ fontSize: 9, fontWeight: 900, color: '#fff',
                          fontFamily: "'Barlow Condensed',sans-serif",
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                          whiteSpace: 'nowrap', overflow: 'hidden',
                          textOverflow: 'ellipsis', maxWidth: '100%' }}>
                          {p.short}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ═══ STEP 3 — PALPITE ═════════════════════════════ */}
        {step === 'score' && (
          <motion.div key="score"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column',
              justifyContent: 'center', padding: '24px 20px',
              background: 'radial-gradient(ellipse at center,#0a1929 0%,#000 70%)' }}>

            <div style={{ textAlign: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.35em',
                color: 'rgba(245,196,0,0.6)' }}>STEP 4 · PALPITE</span>
            </div>
            <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 900,
              fontStyle: 'italic', textTransform: 'uppercase',
              letterSpacing: '-0.02em', marginBottom: 4 }}>
              Crave o Resultado
            </h2>
            <p style={{ textAlign: 'center', fontSize: 10,
              color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em',
              marginBottom: 28 }}>
              Placar exato → <span style={{ color: '#F5C400' }}>+15 pts</span> &nbsp;·&nbsp;
              Vencedor certo → <span style={{ color: '#22C55E' }}>+5 pts</span>
            </p>

            <div style={{ background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24,
              padding: '28px 16px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 16 }}>
                {/* Tigre */}
                <div style={{ display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 12 }}>
                  <img src={ESCUDO} alt="Tigre" style={{ width: 56, height: 56,
                    filter: 'drop-shadow(0 0 10px rgba(245,196,0,0.4))' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => setGame(g => ({ ...g, scoreTigre: Math.max(0, g.scoreTigre - 1) }))}
                      style={{ width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(255,255,255,0.08)', border: 'none',
                        color: '#fff', fontSize: 18, cursor: 'pointer' }}>−</button>
                    <div style={{ width: 64, height: 80,
                      background: 'rgba(0,0,0,0.6)', border: '2px solid #F5C400',
                      borderRadius: 16, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 48, fontWeight: 900,
                      color: '#F5C400', fontStyle: 'italic',
                      fontFamily: "'Barlow Condensed',sans-serif",
                      textShadow: '0 0 20px rgba(245,196,0,0.5)' }}>
                      {game.scoreTigre}
                    </div>
                    <button onClick={() => setGame(g => ({ ...g, scoreTigre: g.scoreTigre + 1 }))}
                      style={{ width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(245,196,0,0.15)', border: 'none',
                        color: '#F5C400', fontSize: 18, cursor: 'pointer' }}>+</button>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 900,
                    color: 'rgba(245,196,0,0.6)', letterSpacing: '0.2em' }}>NOVO</span>
                </div>

                <div style={{ fontSize: 24, fontWeight: 900, fontStyle: 'italic',
                  color: 'rgba(255,255,255,0.2)' }}>×</div>

                {/* Adversário */}
                <div style={{ display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 12 }}>
                  {escudoAdv
                    ? <img src={escudoAdv} alt={nomeAdv} style={{ width: 56, height: 56 }} />
                    : <div style={{ width: 56, height: 56,
                        background: 'rgba(255,255,255,0.08)', borderRadius: 10 }} />
                  }
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button onClick={() => setGame(g => ({ ...g, scoreAdv: Math.max(0, g.scoreAdv - 1) }))}
                      style={{ width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(255,255,255,0.08)', border: 'none',
                        color: '#fff', fontSize: 18, cursor: 'pointer' }}>−</button>
                    <div style={{ width: 64, height: 80,
                      background: 'rgba(0,0,0,0.6)',
                      border: '2px solid rgba(255,255,255,0.2)',
                      borderRadius: 16, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 48, fontWeight: 900,
                      color: 'rgba(255,255,255,0.6)', fontStyle: 'italic',
                      fontFamily: "'Barlow Condensed',sans-serif" }}>
                      {game.scoreAdv}
                    </div>
                    <button onClick={() => setGame(g => ({ ...g, scoreAdv: g.scoreAdv + 1 }))}
                      style={{ width: 28, height: 28, borderRadius: 8,
                        background: 'rgba(255,255,255,0.08)', border: 'none',
                        color: '#fff', fontSize: 18, cursor: 'pointer' }}>+</button>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 900,
                    color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em' }}>
                    {nomeAdv.toUpperCase().slice(0, 10)}
                  </span>
                </div>
              </div>
            </div>

            <button onClick={salvarEscalacao} disabled={saving}
              style={{ width: '100%',
                background: 'linear-gradient(135deg,#F5C400,#D4A200)',
                border: 'none', borderRadius: 14, color: '#000',
                fontFamily: "'Barlow Condensed',sans-serif", fontSize: 14,
                fontWeight: 900, letterSpacing: '0.2em', padding: '15px',
                cursor: saving ? 'wait' : 'pointer',
                opacity: saving ? 0.7 : 1,
                animation: saving ? 'none' : 'cta-pulse 2s ease-in-out infinite' }}>
              {saving ? 'SALVANDO...' : 'CRAVAR PALPITE — VER MEU TIME →'}
            </button>
            <button onClick={() => setStep('picking')}
              style={{ width: '100%', marginTop: 10, background: 'none',
                border: 'none', color: 'rgba(255,255,255,0.25)',
                fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10,
                fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer' }}>
              ← Ajustar time
            </button>
          </motion.div>
        )}

        {/* ═══ STEP 4 — REVEAL (CARD COMPARTILHÁVEL) ═════════ */}
        {step === 'reveal' && (
          <motion.div key="reveal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', overflowY: 'auto', padding: '0 0 24px',
              background: 'radial-gradient(ellipse at top,#0a1929 0%,#000 70%)' }}>

            <div style={{ width: '100%', textAlign: 'center',
              padding: '16px 16px 12px', background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(245,196,0,0.12)' }}>
              <div style={{ fontSize: 9, fontWeight: 900, letterSpacing: '0.35em',
                color: '#22C55E', marginBottom: 4 }}>
                ✓ TIME SALVO NO BANCO!
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 900, fontStyle: 'italic',
                textTransform: 'uppercase', letterSpacing: '-0.02em', margin: 0 }}>
                SALVE & DESAFIE
              </h2>
              <p style={{ fontSize: 13, margin: '2px 0 0',
                color: 'rgba(255,255,255,0.5)' }}>
                A GALERA 🐯
              </p>
            </div>

            {/* Card final compartilhável: Arena + jogadores */}
            <div style={{ width: '100%', maxWidth: 380, padding: '12px' }}>
              <div style={{ background: '#0a0a0a',
                border: '2px solid rgba(245,196,0,0.3)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 0 40px rgba(245,196,0,0.15)' }}>

                {/* Header do card */}
                <div style={{ padding: '10px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(0,0,0,0.6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={ESCUDO} alt="Tigre" style={{ width: 28, height: 28 }} />
                    <div>
                      <div style={{ fontSize: 8,
                        color: 'rgba(245,196,0,0.6)',
                        letterSpacing: '0.3em', fontWeight: 900 }}>
                        🐯 ARENA TIGRE FC
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 900,
                        fontStyle: 'italic', color: '#fff', lineHeight: 1 }}>
                        MEU TIME ESTÁ PRONTO!
                      </div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(245,196,0,0.1)',
                    border: '1px solid rgba(245,196,0,0.3)',
                    borderRadius: 6, padding: '4px 10px',
                    fontSize: 11, fontWeight: 900, color: '#F5C400',
                    letterSpacing: '0.15em' }}>
                    {game.formation}
                  </div>
                </div>

                {/* Campo final com a Arena */}
                <div style={{ position: 'relative', width: '100%',
                  aspectRatio: '1.27', overflow: 'hidden',
                  backgroundImage: `url('${ARENA_BG}')`,
                  backgroundSize: 'cover', backgroundPosition: 'center' }}>

                  <div style={{ position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0.05) 40%,rgba(0,0,0,0.3) 100%)',
                    pointerEvents: 'none' }} />

                  {slots.map((s, i) => {
                    const player = game.lineup[s.id];
                    if (!player) return null;
                    const scale = scalePorY(s.y);
                    return (
                      <motion.div key={s.id}
                        initial={{ opacity: 0, y: -20, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: i * 0.08, type: 'spring', damping: 15 }}
                        style={{ position: 'absolute',
                          left: `${s.x}%`, top: `${s.y}%`,
                          transform: 'translate(-50%, -50%)', zIndex: 10 }}>
                        <FifaCard player={player} scale={scale}
                          isCaptain={player.id === game.captainId}
                          isHero={player.id === game.heroId} />
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer do card */}
                <div style={{ background: '#080808', padding: '10px 14px 14px',
                  borderTop: '1px solid rgba(245,196,0,0.15)' }}>
                  <div style={{ display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 7, color: 'rgba(245,196,0,0.5)',
                        letterSpacing: '0.2em', fontWeight: 900 }}>CAPITÃO</div>
                      <div style={{ fontSize: 12, fontWeight: 900,
                        color: '#F5C400', marginTop: 2 }}>
                        {PLAYERS.find(p => p.id === game.captainId)?.short ?? '—'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 7, color: 'rgba(255,45,85,0.5)',
                        letterSpacing: '0.2em', fontWeight: 900 }}>HERÓI</div>
                      <div style={{ fontSize: 12, fontWeight: 900,
                        color: '#FF2D55', marginTop: 2 }}>
                        {PLAYERS.find(p => p.id === game.heroId)?.short ?? '—'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)',
                        letterSpacing: '0.2em', fontWeight: 900 }}>PALPITE</div>
                      <div style={{ fontSize: 12, fontWeight: 900,
                        color: '#fff', marginTop: 2 }}>
                        {game.scoreTigre}×{game.scoreAdv}
                      </div>
                    </div>
                  </div>

                  <button style={{ width: '100%',
                    background: 'linear-gradient(135deg,#F5C400,#D4A200)',
                    border: 'none', borderRadius: 10, color: '#000',
                    fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13,
                    fontWeight: 900, letterSpacing: '0.15em', padding: '14px',
                    cursor: 'pointer',
                    animation: 'cta-pulse 2s ease-in-out infinite' }}>
                    📸 SALVAR STORY & COMPARTILHAR
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 8,
                    color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em',
                    marginTop: 8, fontWeight: 700 }}>
                    onovorizontino.com.br/tigre-fc
                  </div>
                </div>
              </div>

              <button onClick={() => { setStep('picking'); setGame(g => ({ ...g })); }}
                style={{ width: '100%', marginTop: 16, background: 'none',
                  border: 'none', color: 'rgba(255,255,255,0.4)',
                  fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11,
                  fontWeight: 700, letterSpacing: '0.2em', cursor: 'pointer',
                  padding: '8px' }}>
                ← EDITAR ESCALAÇÃO
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
