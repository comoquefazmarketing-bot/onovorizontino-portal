'use client';
/**
 * EscalacaoFormacao — Tigre FC PS5/FIFA26 Edition
 * Jornada completa: Formação → Mercado → Campo → Banco → Capitão/Herói → Palpite → Reveal → Share
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

// ─── Assets ──────────────────────────────────────────────────────────────────
const BASE       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const ESCUDO     = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const ESCUDO_ADV = 'https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png';
const PATA       = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const FOTO_ROMULO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ROMULO%20FUNDO%20TRANSPARENTE.png';
const FOTO_CARLAO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/CARLAO%20FUNDO%20TRANSPARENTE.png';

// ─── Types ────────────────────────────────────────────────────────────────────
type Player      = { id: number; name: string; short: string; num: number; pos: string; foto: string };
type Lineup      = Record<string, Player | null>;
type Step        = 'formation' | 'picking' | 'bench' | 'captain_hero' | 'score' | 'reveal' | 'share';
type SpecialMode = 'CAPTAIN' | 'HERO' | null;
type Slot        = { id: string; x: number; y: number; pos: string; label: string };

interface EscalacaoFormacaoProps {
  jogoAtual?: {
    id: number;
    adversario_nome?: string;
    adversario_escudo?: string;
    campeonato?: string;
    data_hora?: string;
  };
}

// ─── Players ─────────────────────────────────────────────────────────────────
const PLAYERS: Player[] = [
  { id:1,  name:'César Augusto',    short:'César',      num:31, pos:'GOL', foto:BASE+'CESAR-AUGUSTO.jpg.webp' },
  { id:2,  name:'Jordi',            short:'Jordi',      num:93, pos:'GOL', foto:BASE+'JORDI.jpg.webp' },
  { id:3,  name:'João Scapin',      short:'Scapin',     num:12, pos:'GOL', foto:BASE+'JOAO-SCAPIN.jpg.webp' },
  { id:4,  name:'Lucas Ribeiro',    short:'Lucas',      num:1,  pos:'GOL', foto:BASE+'LUCAS-RIBEIRO.jpg.webp' },
  { id:5,  name:'Lora',             short:'Lora',       num:2,  pos:'LAT', foto:BASE+'LORA.jpg.webp' },
  { id:6,  name:'Castrillón',       short:'Castrillón', num:6,  pos:'LAT', foto:BASE+'CASTRILLON.jpg.webp' },
  { id:7,  name:'Arthur Barbosa',   short:'A.Barbosa',  num:22, pos:'LAT', foto:BASE+'ARTHUR-BARBOSA.jpg.webp' },
  { id:8,  name:'Sander',           short:'Sander',     num:33, pos:'LAT', foto:BASE+'SANDER.jpg.webp' },
  { id:9,  name:'Maykon Jesus',     short:'Maykon',     num:27, pos:'LAT', foto:BASE+'MAYKON-JESUS.jpg.webp' },
  { id:10, name:'Dantas',           short:'Dantas',     num:3,  pos:'ZAG', foto:BASE+'DANTAAS.jpg.webp' },
  { id:11, name:'Eduardo Brock',    short:'E.Brock',    num:5,  pos:'ZAG', foto:BASE+'EDUARDO-BROCK.jpg.webp' },
  { id:12, name:'Patrick',          short:'Patrick',    num:4,  pos:'ZAG', foto:BASE+'PATRICK.jpg.webp' },
  { id:13, name:'Gabriel Bahia',    short:'G.Bahia',    num:14, pos:'ZAG', foto:BASE+'GABRIEL-BAHIA.jpg.webp' },
  { id:14, name:'Carlinhos',         short:'Carlinhos',  num:25, pos:'ZAG', foto:BASE+'CARLINHOS.jpg.webp' },
  { id:15, name:'Alemão',           short:'Alemão',     num:28, pos:'ZAG', foto:BASE+'ALEMAO.jpg.webp' },
  { id:16, name:'Renato Palm',      short:'R.Palm',     num:24, pos:'ZAG', foto:BASE+'RENATO-PALM.jpg.webp' },
  { id:17, name:'Alvariño',          short:'Alvariño',   num:35, pos:'ZAG', foto:BASE+'IVAN-ALVARINO.jpg.webp' },
  { id:18, name:'Bruno Santana',    short:'B.Santana',  num:33, pos:'ZAG', foto:BASE+'BRUNO-SANTANA.jpg.webp' },
  { id:19, name:'Luís Oyama',       short:'Oyama',      num:8,  pos:'MEI', foto:BASE+'LUIS-OYAMA.jpg.webp' },
  { id:20, name:'Léo Naldi',        short:'L.Naldi',    num:7,  pos:'MEI', foto:BASE+'LEO-NALDI.jpg.webp' },
  { id:21, name:'Rômulo',           short:'Rômulo',     num:10, pos:'MEI', foto:FOTO_ROMULO },
  { id:22, name:'Matheus Bianqui',  short:'Bianqui',    num:11, pos:'MEI', foto:BASE+'MATHEUS-BIANQUI.jpg.webp' },
  { id:23, name:'Juninho',          short:'Juninho',    num:20, pos:'MEI', foto:BASE+'JUNINHO.jpg.webp' },
  { id:24, name:'Tavinho',          short:'Tavinho',    num:17, pos:'MEI', foto:BASE+'TAVINHO.jpg.webp' },
  { id:25, name:'Diego Galo',       short:'D.Galo',     num:29, pos:'MEI', foto:BASE+'DIEGO-GALO.jpg.webp' },
  { id:26, name:'Marlon',           short:'Marlon',     num:30, pos:'MEI', foto:BASE+'MARLON.jpg.webp' },
  { id:27, name:'Hector Bianchi',   short:'Hector',     num:16, pos:'MEI', foto:BASE+'HECTOR-BIACHI.jpg.webp' },
  { id:28, name:'Nogueira',         short:'Nogueira',   num:36, pos:'MEI', foto:BASE+'NOGUEIRA.jpg.webp' },
  { id:29, name:'Luiz Gabriel',     short:'L.Gabriel',  num:37, pos:'MEI', foto:BASE+'LUIZ-GABRIEL.jpg.webp' },
  { id:30, name:'Jhones Kauê',      short:'J.Kauê',     num:50, pos:'MEI', foto:BASE+'JHONES-KAUE.jpg.webp' },
  { id:31, name:'Robson',           short:'Robson',     num:9,  pos:'ATA', foto:BASE+'ROBSON.jpg.webp' },
  { id:32, name:'Vinícius Paiva',   short:'V.Paiva',    num:13, pos:'ATA', foto:BASE+'VINICIUS-PAIVA.jpg.webp' },
  { id:33, name:'Hélio Borges',     short:'H.Borges',   num:18, pos:'ATA', foto:BASE+'HELIO-BORGES.jpg.webp' },
  { id:34, name:'Jardiel',          short:'Jardiel',    num:19, pos:'ATA', foto:BASE+'JARDIEL.jpg.webp' },
  { id:35, name:'Nicolas Careca',   short:'N.Careca',   num:21, pos:'ATA', foto:BASE+'NICOLAS-CARECA.jpg.webp' },
  { id:36, name:'Titi Ortiz',       short:'T.Ortiz',    num:15, pos:'ATA', foto:BASE+'TITI-ORTIZ.jpg.webp' },
  { id:37, name:'Diego Mathias',    short:'D.Mathias',  num:41, pos:'ATA', foto:BASE+'DIEGO-MATHIAS.jpg.webp' },
  { id:38, name:'Carlão',           short:'Carlão',     num:90, pos:'ATA', foto:FOTO_CARLAO },
  { id:39, name:'Ronald Barcellos', short:'Ronald',     num:23, pos:'ATA', foto:BASE+'RONALD-BARCELLOS.jpg.webp' },
];

const FORMATIONS: Record<string, Slot[]> = {
  '4-2-3-1': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK' },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB' },
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB' },
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB' },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB' },
    { id:'dm1', x:34, y:57, pos:'MEI', label:'DM' },
    { id:'dm2', x:66, y:57, pos:'MEI', label:'DM' },
    { id:'am',  x:50, y:40, pos:'MEI', label:'AM' },
    { id:'rw',  x:85, y:25, pos:'ATA', label:'RW' },
    { id:'lw',  x:15, y:25, pos:'ATA', label:'LW' },
    { id:'st',  x:50, y:11, pos:'ATA', label:'ST' },
  ],
  '4-3-3': [
    { id:'gk',  x:50, y:88, pos:'GOL', label:'GK' },
    { id:'rb',  x:87, y:72, pos:'LAT', label:'RB' },
    { id:'cb1', x:64, y:78, pos:'ZAG', label:'CB' },
    { id:'cb2', x:36, y:78, pos:'ZAG', label:'CB' },
    { id:'lb',  x:13, y:72, pos:'LAT', label:'LB' },
    { id:'cm1', x:50, y:58, pos:'MEI', label:'CM' },
    { id:'cm2', x:25, y:50, pos:'MEI', label:'CM' },
    { id:'cm3', x:75, y:50, pos:'MEI', label:'CM' },
    { id:'rw',  x:80, y:20, pos:'ATA', label:'RW' },
    { id:'lw',  x:20, y:20, pos:'ATA', label:'LW' },
    { id:'st',  x:50, y:11, pos:'ATA', label:'ST' },
  ],
};

const BENCH_SLOTS = [
  { id:'b_gol', pos:'GOL', label:'🧤 Goleiro' },
  { id:'b_zag', pos:'ZAG', label:'🛡️ Zagueiro' },
  { id:'b_lat', pos:'LAT', label:'↔️ Lateral' },
  { id:'b_mei', pos:'MEI', label:'🔮 Meia' },
  { id:'b_ata', pos:'ATA', label:'⚡ Atacante' },
];

const POS_COLORS: Record<string, string> = {
  GOL:'#F5C400', ZAG:'#3B82F6', LAT:'#06B6D4', MEI:'#22C55E', ATA:'#EF4444',
};

// ─── Componentes de UI ───────────────────────────────────────────────────────

function imgStyle(pose: 'static' | 'celebration'): React.CSSProperties {
  const common: React.CSSProperties = {
    position: 'absolute', top: '50%', left: '50%',
    width: '100%', height: '100%', objectFit: 'cover',
    transformOrigin: 'center center',
  };
  return pose === 'static' 
    ? { ...common, objectPosition: '22% center', transform: 'translate(-50%, -50%) scale(1.4)' }
    : { ...common, objectPosition: '78% center', transform: 'translate(-50%, -50%) scale(1.5)' };
}

const StadiumBg = () => (
  <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,#010508 0%,#030e09 55%,#061608 100%)', overflow:'hidden' }}>
    <div style={{ position:'absolute', inset:0, opacity:0.1, backgroundImage:'radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)', backgroundSize:'40px 40px' }} />
    <div style={{ position:'absolute', bottom:0, width:'100%', height:'50%', background:'radial-gradient(50% 100% at 50% 100%, rgba(34,197,94,0.15) 0%, transparent 100%)' }} />
  </div>
);

function FifaCard({ player, isCaptain, isHero, isActive, pulsing, small=false, onClick }: any) {
  const col = isCaptain ? '#F5C400' : isHero ? '#00F3FF' : (POS_COLORS[player.pos] ?? '#888');
  const W = small ? 48 : 64;
  const H = Math.round(W * 1.4);
  
  return (
    <motion.button onClick={onClick} whileTap={{ scale:0.9 }} style={{ background:'none', border:'none', padding:0, position:'relative' }}>
      <div style={{ 
        width:W, height:H, borderRadius:8, overflow:'hidden', border:`2px solid ${col}`, 
        background:'#050505', boxShadow: pulsing ? `0 0 20px ${col}` : `0 0 10px ${col}40` 
      }}>
        <div style={{ width:'100%', height:'75%', position:'relative', overflow:'hidden' }}>
          <img src={player.foto} style={imgStyle('celebration')} alt="" />
        </div>
        <div style={{ height:'25%', background:col, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <span style={{ fontSize:small ? 8 : 10, fontWeight:900, color:'#000', textTransform:'uppercase' }}>{player.short}</span>
        </div>
      </div>
      {(isCaptain || isHero) && (
        <div style={{ position:'absolute', top:-6, right:-6, background:col, color:'#000', borderRadius:'50%', width:20, height:20, fontSize:12, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #000' }}>
          {isCaptain ? 'C' : '★'}
        </div>
      )}
    </motion.button>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function EscalacaoFormacao({ jogoAtual }: EscalacaoFormacaoProps) {
  const [step, setStep] = useState<Step>('formation');
  const [formation, setFormation] = useState('4-2-3-1');
  const [lineup, setLineup] = useState<Lineup>({});
  const [activeSlot, setActiveSlot] = useState<string|null>(null);
  const [captainId, setCaptainId] = useState<number|null>(null);
  const [heroId, setHeroId] = useState<number|null>(null);
  const [specialMode, setSpecialMode] = useState<SpecialMode>(null);
  const [scoreTigre, setScoreTigre] = useState(0);
  const [scoreAdversario, setScoreAdversario] = useState(0);

  const slots = useMemo(() => FORMATIONS[formation] || FORMATIONS['4-2-3-1'], [formation]);

  const handleEscalacao = (slotId: string, player: Player | undefined) => {
    if (specialMode === 'CAPTAIN' && player) { setCaptainId(player.id); setSpecialMode(null); return; }
    if (specialMode === 'HERO' && player) { setHeroId(player.id); setSpecialMode(null); return; }
    if (player) {
      setLineup(prev => ({ ...prev, [slotId]: player }));
      setActiveSlot(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden font-sans">
      <StadiumBg />

      <AnimatePresence mode="wait">
        
        {/* STEP 1: FORMAÇÃO */}
        {step === 'formation' && (
          <motion.div key="f" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="flex-1 z-10 flex flex-col items-center justify-center p-6 text-center">
            <img src={ESCUDO} className="w-24 h-24 mb-6 drop-shadow-[0_0_15px_rgba(245,196,0,0.5)]" alt="Tigre" />
            <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Escolha sua Tática</h1>
            <p className="text-zinc-500 text-sm mb-10 uppercase tracking-widest">A base do seu sucesso começa aqui</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {Object.keys(FORMATIONS).map(f => (
                <button key={f} onClick={() => { setFormation(f); setStep('picking'); }} 
                  className="bg-zinc-900 border-2 border-zinc-800 p-6 rounded-2xl font-black text-xl hover:border-yellow-500 transition-all">
                  {f}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: ESCALAÇÃO (CAMPO) */}
        {step === 'picking' && (
          <motion.div key="p" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex-1 z-10 flex flex-col relative">
            <div className="p-4 flex items-center justify-between bg-black/60 backdrop-blur-md border-b border-white/5">
               <div>
                 <h2 className="text-yellow-500 font-black italic text-lg uppercase leading-none">{jogoAtual?.campeonato || 'LIGA TIGRE'}</h2>
                 <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-tighter">Vs {jogoAtual?.adversario_nome || 'Adversário'}</p>
               </div>
               <img src={jogoAtual?.adversario_escudo || ESCUDO_ADV} className="w-10 h-10 object-contain" alt="Adv" />
            </div>

            <div className="flex-1 relative p-4">
               {slots.map(s => (
                 <div key={s.id} style={{ position:'absolute', left:`${s.x}%`, top:`${s.y}%`, transform:'translate(-50%, -50%)' }}>
                   {lineup[s.id] ? (
                     <FifaCard player={lineup[s.id]} onClick={() => setActiveSlot(s.id)} />
                   ) : (
                     <button onClick={() => setActiveSlot(s.id)} className="w-12 h-16 rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-900/40 flex items-center justify-center text-zinc-600 text-xs font-bold">
                       {s.label}
                     </button>
                   )}
                 </div>
               ))}
            </div>

            <div className="p-6">
              <button onClick={() => setStep('score')} className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black uppercase italic tracking-tighter shadow-lg">
                DEFINIR PALPITE →
              </button>
            </div>

            {/* MODAL MERCADO */}
            <AnimatePresence>
              {activeSlot && (
                <motion.div initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }} className="absolute inset-0 z-50 bg-black/95 p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-black italic uppercase">Selecione o Jogador</h3>
                    <button onClick={() => setActiveSlot(null)} className="text-zinc-500 font-bold">FECHAR</button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-20">
                    {PLAYERS.map(p => (
                      <div key={p.id} onClick={() => handleEscalacao(activeSlot, p)} className="bg-zinc-900 rounded-xl p-2 border border-white/5 flex flex-col items-center">
                        <img src={p.foto} className="w-full aspect-square object-cover rounded-lg mb-2" alt="" />
                        <span className="text-[10px] font-black uppercase truncate w-full text-center">{p.short}</span>
                        <span className="text-[8px] text-zinc-500 font-bold">{p.pos}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 3: PALPITE */}
        {step === 'score' && (
          <motion.div key="s" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="flex-1 z-10 flex flex-col justify-center p-6">
            <div className="bg-zinc-900/90 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 shadow-2xl">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-black italic uppercase italic tracking-tighter">Qual o placar final?</h2>
              </div>
              <div className="flex items-center justify-center gap-8 mb-12">
                <div className="flex flex-col items-center gap-4">
                  <img src={ESCUDO} className="w-16 h-16 drop-shadow-[0_0_10px_rgba(245,196,0,0.4)]" alt="Tigre" />
                  <input type="number" value={scoreTigre} onChange={e => setScoreTigre(Number(e.target.value))} 
                    className="w-20 h-24 bg-black/50 border-2 border-yellow-500 rounded-3xl text-center text-5xl font-black text-yellow-500 focus:outline-none" />
                </div>
                <div className="text-3xl font-black text-zinc-700 italic">VS</div>
                <div className="flex flex-col items-center gap-4">
                  <img src={jogoAtual?.adversario_escudo || ESCUDO_ADV} className="w-16 h-16" alt="Adv" />
                  <input type="number" value={scoreAdversario} onChange={e => setScoreAdversario(Number(e.target.value))} 
                    className="w-20 h-24 bg-black/50 border-2 border-zinc-700 rounded-3xl text-center text-5xl font-black text-white focus:outline-none" />
                </div>
              </div>
              <button onClick={() => alert('Escalação Enviada com Sucesso!')} className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase italic text-lg shadow-xl hover:bg-yellow-500 transition-colors">
                ENVIAR ESCALAÇÃO
              </button>
              <button onClick={() => setStep('picking')} className="w-full mt-6 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
                ← Ajustar Time
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
