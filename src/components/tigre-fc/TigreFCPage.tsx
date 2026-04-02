'use client';

import { useState, useEffect, useRef, use } from 'react'; // Importado 'use'
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Interfaces refinadas
interface Time {
  nome: string;
  escudo_url: string;
}

interface Jogo {
  id: number;
  data_hora: string;
  mandante: Time;
  visitante: Time;
}

interface UsuarioRanking {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number;
}

// 1. Ajuste na assinatura da função para aceitar params do Next.js 15
export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  // 2. Desempacotando os params (caso você queira usar o jogoId da URL nesta página principal)
  const resolvedParams = use(params);
  
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const topRef = useRef<HTMLDivElement>(null);

  // Inicialização básica
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Busca de Dados (Supabase e API)
  useEffect(() => {
    if (!mounted) return;
    const sb = createClient(SB_URL, SB_KEY);

    async function init() {
      // 1. Busca Sessão do Usuário
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios')
          .select('id')
          .eq('google_id', session.user.id)
          .maybeSingle();
        if (u) setMeuId(u.id);
      }

      // 2. Busca Jogo e Ranking em paralelo
      try {
        const [resJogo, { data: rankData }] = await Promise.all([
          fetch('/api/proximo-jogo').then(r => r.json()),
          sb.from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .order('pontos_total', { ascending: false })
            .limit(10)
        ]);
        
        if (resJogo.jogos?.[0]) setJogo(resJogo.jogos[0]);
        if (rankData) setRanking(rankData as UsuarioRanking[]);
      } catch (e) {
        console.error("Erro ao carregar dados do portal:", e);
      }
    }
    init();
  }, [mounted]);

  // Timer de Bloqueio (90 min antes do jogo)
  useEffect(() => {
    if (!jogo) return;
    
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
      <header ref={topRef} className="bg-[#F5C400] pt-20 pb-32 px-6 border-b-[12px] border-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/20" />
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="relative inline-block mb-4 group">
             <div className="absolute inset-0 bg-black blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full scale-150" />
             <img 
                src={PATA_LOGO} 
                className="w-24 h-auto mx-auto relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500" 
                alt="Tigre FC Garra" 
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
        
        {/* ⚡ CARD DO PRÓXIMO JOGO */}
        {jogo && (
          <section className="mb-20">
            <div className="bg-zinc-900/90 backdrop-blur-3xl rounded-[60px] border border-white/10 p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
              
              {/* Cronômetro */}
              <div className="flex justify-center gap-6 mb-12 relative z-10">
                {(['h', 'm', 's'] as const).map(unit => (
                  <div key={unit} className="flex flex-col items-center">
                    <div className="bg-black/40 px-3 py-2 rounded-2xl border border-white/5 min-w-[70px] text-center">
                      <span className="text-5xl font-[1000] font-mono leading-none text-white tracking-tighter">
                        {timeLeft[unit]}
                      </span>
                    </div>
                    <span className="text-[8px] text-zinc-500 font-black uppercase mt-3 tracking-[0.4em]">
                        {unit === 'h' ? 'HORAS' : unit === 'm' ? 'MINUTOS' : 'SEGUNDOS'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Confronto */}
              <div className="flex justify-between items-center mb-12 relative z-10">
                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 bg-gradient-to-b from-zinc-800 to-black rounded-[35px] p-4 flex items-center justify-center mb-4 border border-white/10 shadow-2xl group-hover:rotate-3 transition-transform">
                    <img src={jogo.mandante.escudo_url} alt="Mandante" className="w-16 h-16 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 text-center leading-tight h-8 flex items-center">{jogo.mandante.nome}</p>
                </div>
                
                <div className="px-4 flex flex-col items-center">
                    <div className="text-2xl font-[1000] italic text-zinc-800 select-none">VS</div>
                    <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-yellow-500/50 to-transparent my-2" />
                </div>

                <div className="flex flex-col items-center flex-1">
                  <div className="w-24 h-24 bg-gradient-to-b from-zinc-800 to-black rounded-[35px] p-4 flex items-center justify-center mb-4 border border-white/10 shadow-2xl group-hover:-rotate-3 transition-transform">
                    <img src={jogo.visitante.escudo_url} alt="Visitante" className="w-16 h-16 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" />
                  </div>
                  <p className="text-[10px] font-black uppercase text-zinc-400 text-center leading-tight h-8 flex items-center">{jogo.visitante.nome}</p>
                </div>
              </div>

              {/* Link para Escalação */}
              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="relative flex items-center justify-center bg-[#F5C400] text-black py-7 rounded-[35px] font-[1000] uppercase italic text-sm shadow-[0_20px_40px_rgba(245,196,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all overflow-hidden group">
                <span className="relative z-10 tracking-[0.2em]">CONVOCAR TITULARES →</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
              </Link>
            </div>
          </section>
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
                      alt={u.apelido || 'Avatar'}
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
                    {u.pontos_total}
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
          targetUserId={perfilAberto} 
          jogoId={jogo?.id || 0} 
          meuId={meuId} 
          onClose={() => setPerfilAberto(null)} 
        />
      )}

      <style jsx global>{`
        ::-webkit-scrollbar { width: 0px; }
        body { background-color: #050505; }
        .font-1000 { font-weight: 1000; }
      `}</style>
    </main>
  );
}
