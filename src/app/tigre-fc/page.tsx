'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase'; 
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// Interfaces
interface Time {
  nome: string;
  escudo_url: string;
}

interface Jogo {
  id: number;
  data_hora: string;
  mandante: Time;
  visitante: Time;
  competicao?: string;
  rodada?: string;
  local?: string;
}

interface UsuarioRanking {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number;
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const topRef = useRef<HTMLDivElement>(null);

  // Controle de montagem e Scroll inicial
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    topRef.current?.focus();
  }, []);

  // Inicialização de Dados
  useEffect(() => {
    if (!mounted) return;

    async function init() {
      setIsLoading(true);
      try {
        // 1. Sessão do Usuário
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user?.id) {
          const { data: u } = await sb.from('tigre_fc_usuarios')
            .select('id')
            .eq('google_id', session.user.id)
            .maybeSingle();
          if (u) setMeuId(u.id);
        }

        // 2. Carregar Jogo (Prioridade para o jogo do CRB ID: 3 se não vier da API)
        const resJogo = await fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null);
        
        if (resJogo?.jogos?.length > 0) {
          setJogo(resJogo.jogos[0]);
        } else {
          // Fallback manual para o jogo do CRB baseado no seu jogos_rows.json
          setJogo({
            id: 3,
            data_hora: "2026-04-05 21:00:00+00",
            competicao: "Série B",
            rodada: "3ª Rodada",
            local: "Jorjão • Novo Horizonte",
            mandante: { 
              nome: "Novorizontino", 
              escudo_url: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/escudos/novorizontino.png" 
            },
            visitante: { 
              nome: "CRB", 
              escudo_url: "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/escudos/crb.png" 
            }
          });
        }

        // 3. Ranking
        const { data: resRank } = await sb.from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .not('pontos_total', 'is', null)
            .order('pontos_total', { ascending: false })
            .limit(10);
        
        if (resRank) setRanking(resRank as UsuarioRanking[]);

      } catch (e) {
        console.error("Erro ao carregar dados do Tigre FC:", e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [mounted]);

  // Timer do Jogo (Lógica de bloqueio 1h30 antes)
  useEffect(() => {
    if (!jogo?.data_hora) return;
    
    const calculateTime = () => {
      const gameTime = new Date(jogo.data_hora.replace(' ', 'T')).getTime();
      const lockTime = gameTime - (90 * 60 * 1000); 
      const now = Date.now();
      const diff = lockTime - now;
      
      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        return;
      }
      
      setTimeLeft({
        h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime(); 
    return () => clearInterval(timer);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-40 font-sans selection:bg-yellow-500 overflow-x-hidden">
      
      {/* 🏆 HEADER PREMIUM */}
      <header 
        ref={topRef} 
        tabIndex={-1} 
        className="bg-[#F5C400] pt-20 pb-32 px-6 border-b-[12px] border-black text-center relative overflow-hidden outline-none"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20" />
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="relative inline-block mb-4 group">
             <div className="absolute inset-0 bg-black blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full scale-150" />
             <img 
                src={PATA_LOGO} 
                className="w-24 h-auto mx-auto relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500" 
                alt="Tigre FC Logo" 
              />
          </div>
          
          <h1 className="text-7xl font-[1000] text-black italic uppercase leading-[0.8] tracking-tighter mb-4">
            TIGRE <span className="block">FC</span>
          </h1>
          
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-black rounded-full shadow-2xl">
             <div className="h-1.5 w-1.5 bg-yellow-500 rounded-full animate-pulse" />
             <p className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em]">ULTIMATE 2026</p>
             <div className="h-1.5 w-1.5 bg-yellow-500 rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-20 relative z-20">
        
        {/* ⚡ WIDGET PRÓXIMA PARTIDA (GLASS CHUMBO) */}
        {jogo && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <div style={{
              position: 'relative',
              padding: '30px',
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.8) 0%, rgba(10, 10, 10, 0.95) 100%)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              borderRadius: '45px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 30px 60px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.05)',
              overflow: 'hidden'
            }}>
              {/* Efeito de Reflexo de Vidro */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

              <div className="relative z-10 text-center">
                <div className="flex justify-center gap-4 mb-8">
                  {(['h', 'm', 's'] as const).map(unit => (
                    <div key={unit} className="flex flex-col items-center">
                      <div className="bg-black/60 w-14 h-14 flex items-center justify-center rounded-2xl border border-white/5 shadow-inner">
                        <span className="text-3xl font-[1000] font-mono text-white leading-none">
                          {timeLeft[unit]}
                        </span>
                      </div>
                      <span className="text-[7px] text-zinc-500 font-black uppercase mt-2 tracking-widest">{unit === 'h' ? 'HRS' : unit === 'm' ? 'MIN' : 'SEG'}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-8 px-2">
                  <div className="flex flex-col items-center flex-1">
                    <motion.img 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      src={jogo.mandante.escudo_url} 
                      className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(245,196,0,0.3)]" 
                    />
                    <span className="text-[9px] font-black text-white uppercase mt-3 tracking-tighter opacity-80">{jogo.mandante.nome}</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-xl font-[1000] italic text-zinc-700">VS</span>
                    <div className="h-8 w-[1px] bg-yellow-500/20 my-1" />
                  </div>

                  <div className="flex flex-col items-center flex-1">
                    <motion.img 
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      src={jogo.visitante.escudo_url} 
                      className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                    />
                    <span className="text-[9px] font-black text-white uppercase mt-3 tracking-tighter opacity-80">{jogo.visitante.nome}</span>
                  </div>
                </div>

                <p className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.3em] mb-8">
                  {jogo.competicao} • {jogo.rodada}
                </p>

                <Link 
                  href={`/tigre-fc/escalar/${jogo.id}`} 
                  className="block w-full py-5 rounded-2xl bg-gradient-to-r from-[#F5C400] to-[#D4A200] text-black font-[1000] text-xs uppercase italic tracking-[0.2em] shadow-[0_15px_30px_rgba(245,196,0,0.2)] hover:brightness-110 active:scale-95 transition-all"
                >
                  ⚡ Escalar meu Time
                </Link>
              </div>
            </div>
          </motion.section>
        )}

        <DestaquesFifa />

        {/* 🔍 RAIO-X TÁTICO */}
        <section className="mt-28">
          <div className="flex flex-col items-center mb-8 px-6 text-center">
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-yellow-500/80 mb-2 italic">Tactical View</h2>
              <p className="text-2xl font-[1000] uppercase italic tracking-tighter text-white">Análise do Campo</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-[50px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border-[8px] border-zinc-900 relative h-[600px]">
            <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-900 flex items-center justify-center gap-2 z-10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Live Radar System</span>
            </div>
            <iframe 
              src={`https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=dark`} 
              className="w-full h-full border-none pt-10"
              scrolling="no"
              loading="lazy"
              title="Tactical Lineups"
            />
          </div>
        </section>

        {/* 🐯 RANKING */}
        <section className="mt-32">
          <div className="flex justify-between items-end mb-10 px-6">
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">Leaderboard</h2>
              <p className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">Elite Ranking</p>
            </div>
            <Link href="/tigre-fc/ranking" className="text-[10px] font-black text-yellow-500 uppercase border-b border-yellow-500/30 pb-1 hover:text-white hover:border-white transition-all">Ver Todos</Link>
          </div>
          
          <div className="space-y-4">
            {ranking.map((u, i) => (
              <div 
                key={u.id} 
                onClick={() => setPerfilAberto(u.id)} 
                className={`
                  flex items-center p-6 cursor-pointer transition-all duration-500 group
                  rounded-[45px] border
                  ${i === 0 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 border-none shadow-[0_25px_50px_-12px_rgba(245,196,0,0.4)] scale-[1.05] z-30 relative' 
                    : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 hover:border-white/10'
                  }
                `}
              >
                <div className="w-12 flex flex-col items-center justify-center mr-4">
                  <span className={`text-lg font-[1000] italic ${i === 0 ? 'text-black' : i < 3 ? 'text-yellow-500' : 'text-zinc-700'}`}>
                    {String(i+1).padStart(2, '0')}
                  </span>
                </div>

                <div className="relative mr-5">
                    <img 
                      src={u.avatar_url || PATA_LOGO} 
                      alt={u.apelido || u.nome}
                      className={`w-16 h-16 rounded-[22px] object-cover transition-all duration-700
                        ${i === 0 ? 'border-4 border-black/20 shadow-xl' : 'bg-black border-2 border-white/5'}
                      `} 
                    />
                    {i === 0 && (
                      <div className="absolute -top-3 -right-3 bg-black text-yellow-500 p-1.5 rounded-xl shadow-xl rotate-12">
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
                      </div>
                    )}
                </div>

                <div className="flex-1">
                   <p className={`text-xl font-[1000] uppercase italic tracking-tighter ${i === 0 ? 'text-black' : 'text-white'}`}>
                     {u.apelido || u.nome}
                   </p>
                   <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${i === 0 ? 'text-black/60' : 'text-zinc-500'}`}>
                      {i === 0 ? 'Líder da Alcateia' : 'Competidor Elite'}
                   </span>
                </div>

                <div className="text-right">
                  <p className={`font-[1000] text-3xl leading-none tracking-tighter ${i === 0 ? 'text-black' : 'text-yellow-500'}`}>
                    {u.pontos_total || 0}
                  </p>
                  <p className={`text-[9px] font-black uppercase mt-1 ${i === 0 ? 'text-black/50' : 'text-zinc-600'}`}>PTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 💬 CHAT */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-8 px-6">
            <div>
               <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">Lounge</h2>
               <p className="text-2xl font-[1000] uppercase italic tracking-tighter text-white">Vestiário</p>
            </div>
            <div className="bg-green-500/10 px-3 py-1 rounded-full flex items-center gap-2 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">Chat On</span>
            </div>
          </div>
          <div className="h-[600px] rounded-[60px] border border-white/5 overflow-hidden shadow-inner bg-black/40 relative">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      {/* MODAL DE PERFIL */}
      {perfilAberto && (
        <TigreFCPerfilPublico 
          targetUsuarioId={perfilAberto} 
          viewerUsuarioId={meuId} 
          onClose={() => setPerfilAberto(null)} 
        />
      )}

      <style jsx global>{`
        ::-webkit-scrollbar { width: 0px; }
        body { background-color: #050505; }
        @keyframes pulse-gold {
          0% { box-shadow: 0 0 0 0 rgba(245, 196, 0, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(245, 196, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(245, 196, 0, 0); }
        }
      `}</style>
    </main>
  );
}
