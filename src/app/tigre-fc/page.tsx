'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, type Transition, type TargetAndTransition } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const SOFASCORE_EVENT_ID = 15526006;

const ESCUDOS_SERIE_B: Record<string, string> = {
  'novorizontino': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png',
  'juventude':     'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/juventude.png',
  'crb':           'https://upload.wikimedia.org/wikipedia/commons/7/73/CRB_logo.svg',
  'america-mg':    'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png',
  'athletic-mg':   'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Athletic_Club_%28Minas_Gerais%29.svg/1280px-Athletic_Club_%28Minas_Gerais%29.svg.png',
  // ... adicione outros se necessário
};

function resolveEscudo(slugOrNome?: string, fallback?: string): string {
  if (!slugOrNome) return fallback ?? PATA_LOGO;
  const slug = slugOrNome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
  return ESCUDOS_SERIE_B[slug] ?? fallback ?? PATA_LOGO;
}

interface Jogo { id: number; data_hora: string; mandante: any; visitante: any; competicao?: string; rodada?: string; local?: string; }

function FlipDigit({ value }: { value: string }) {
  return <motion.span key={value} initial={{rotateX:-90,opacity:0}} animate={{rotateX:0,opacity:1}} transition={{duration:0.25}} style={{display:'inline-block'}}>{value}</motion.span>;
}

function TimerBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:6}}>
      <div style={{position:'relative',width:64,height:64,display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(145deg,#0f0f0f,#1a1a00)',border:'1px solid rgba(245,196,0,0.2)',borderRadius:14}}>
        <span style={{fontFamily:"'Barlow Condensed',Impact,sans-serif",fontSize:30,fontWeight:900,color:'#F5C400'}}>
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

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0,280], [1,0]);
  const heroScale   = useTransform(scrollY, [0,280], [1,1.06]);

  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h:'00', m:'00', s:'00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => { setMounted(true); }, []);

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
        setJogo(resJogo.jogos[0]);
      } else {
        // AJUSTE REALIZADO: Data para 12/04 às 18:00
        setJogo({ 
          id: 4, 
          data_hora: '2026-04-12T18:00:00', 
          competicao: 'Série B', 
          rodada: '4ª Rodada', 
          local: 'Arena da Independência • BH',
          mandante:  { nome: 'América-MG',   slug: 'america-mg',   escudo_url: ESCUDOS_SERIE_B['america-mg'] },
          visitante: { nome: 'Novorizontino', slug: 'novorizontino', escudo_url: ESCUDOS_SERIE_B['novorizontino'] },
        });
      }

      const { data: resRank } = await sb.from('tigre_fc_usuarios').select('id,nome,apelido,avatar_url,pontos_total').order('pontos_total',{ascending:false}).limit(10);
      if (resRank) setRanking(resRank);
    }
    init();
  }, [mounted]);

  useEffect(() => {
    if (!jogo?.data_hora) return;
    const tick = () => {
      const gameTime = new Date(jogo.data_hora).getTime();
      const now = Date.now();
      
      // Regra: Mercado fecha 1h30 (90 min) antes do jogo
      const lockTime = gameTime - (90 * 60 * 1000);
      const diff = lockTime - now;

      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        setMercadoAberto(false);
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      setTimeLeft({
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        s: String(seconds).padStart(2, '0')
      });
    };

    const t = setInterval(tick, 1000);
    tick();
    return () => clearInterval(t);
  }, [jogo]);

  if (!mounted) return <div style={{minHeight:'100vh',background:'#050505'}} />;

  return (
    <main style={{minHeight:'100vh',background:'#050505',color:'#fff',fontFamily:"'Barlow Condensed',sans-serif"}}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&display=swap');
        .text-shimmer {
          background: linear-gradient(90deg, #F5C400, #fff, #F5C400);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        @keyframes shimmer { to { background-position: 200% center; } }
      `}</style>

      {/* HERO */}
      <motion.div style={{ opacity: heroOpacity, scale: heroScale, padding: '60px 24px', textAlign: 'center' }}>
        <img src={PATA_LOGO} style={{ width: 60, marginBottom: 16 }} alt="Logo" />
        <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 0.8 }}>
          <span className="text-shimmer">TIGRE</span><br />FC
        </h1>
      </motion.div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>
        {/* MATCH CARD */}
        {jogo && (
          <section style={{ background: '#0d0d0d', borderRadius: 24, border: '1px solid rgba(245,196,0,0.15)', padding: 24, marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
               <div style={{ textAlign: 'center', flex: 1 }}>
                  <img src={resolveEscudo(jogo.mandante.slug)} style={{ width: 50 }} alt="Mandante" />
                  <div style={{ fontSize: 10, fontWeight: 900, marginTop: 8 }}>{jogo.mandante.nome}</div>
               </div>

               <div style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center' }}>
                    <TimerBlock value={timeLeft.h} label="HRS" />
                    <span style={{ color: '#F5C400', fontWeight: 900, paddingBottom: 15 }}>:</span>
                    <TimerBlock value={timeLeft.m} label="MIN" />
                  </div>
                  <div style={{ fontSize: 8, color: '#444', marginTop: 10 }}>FECHAMENTO DO MERCADO</div>
               </div>

               <div style={{ textAlign: 'center', flex: 1 }}>
                  <img src={resolveEscudo(jogo.visitante.slug)} style={{ width: 50 }} alt="Visitante" />
                  <div style={{ fontSize: 10, fontWeight: 900, marginTop: 8 }}>{jogo.visitante.nome}</div>
               </div>
            </div>

            <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{
              display: 'block',
              textAlign: 'center',
              padding: '16px',
              borderRadius: 12,
              background: mercadoAberto ? '#F5C400' : '#1a1a1a',
              color: mercadoAberto ? '#000' : '#444',
              fontWeight: 900,
              textDecoration: 'none',
              pointerEvents: mercadoAberto ? 'auto' : 'none'
            }}>
              {mercadoAberto ? 'ESCALE SEU TIME' : 'MERCADO FECHADO'}
            </Link>
          </section>
        )}

        <SectionLabel sub="LEADERBOARD" title="ELITE RANKING" />
        {/* Lista de Ranking e Chat permanecem abaixo... */}
        <TigreFCChat usuarioId={meuId} />
      </div>

      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId} onClose={() => setPerfilAberto(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
