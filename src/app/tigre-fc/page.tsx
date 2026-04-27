'use client';

import { useState, useEffect } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';
import TigreNewsFlash from '@/components/tigre-fc/TigreNewsFlash';

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [jogo, setJogo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      const [resJogo, resRank] = await Promise.all([
        sb.from('jogos_tigre').select('*, mandante:times(*), visitante:times(*)').eq('ativo', true).maybeSingle(),
        sb.from('tigre_fc_usuarios')
          .select('id, nome, apelido, pontos_total, avatar_url')
          .not('pontos_total', 'is', null)
          .order('pontos_total', { ascending: false })
          .limit(6)
      ]);

      if (resRank.data) setRanking(resRank.data);
      if (resJogo.data) setJogo(resJogo.data);
    }
    init();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden flex flex-col relative">
      
      {/* ── CAMADA DE FX: BACKGROUND ELETRIZADO (Pointer Events None para não travar o Chat) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#F5C40033_0%,transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_4px,3px_100%]" />
        <div className="absolute inset-0 opacity-30 mix-blend-screen overflow-hidden">
          <div className="absolute -inset-[100%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-slow-pan" />
        </div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[150px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="relative z-20 flex flex-col flex-1">
        
        {/* 1. HEADER LOGO (Sempre no topo) */}
        <header className="relative pt-16 pb-20 md:pt-24 md:pb-32 text-center">
          <div className="inline-block relative">
             <h1 className="text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-700 animate-glow">
              TIGRE <span className="text-[#F5C400] drop-shadow-[0_0_30px_rgba(245,196,0,0.5)]">FC</span>
            </h1>
            <div className="absolute -top-2 -right-4 md:-top-4 md:-right-8 bg-red-600 text-[8px] md:text-[10px] font-black px-2 py-0.5 transform rotate-12 animate-bounce">
              LIVE
            </div>
          </div>
          
          <div className="mt-6 flex justify-center gap-4 px-4">
            <div className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-yellow-500 self-center" />
            <p className="text-[9px] md:text-[11px] font-black text-yellow-500 uppercase tracking-[0.4em] md:tracking-[0.8em] drop-shadow-neon text-center">
              Next Gen Experience
            </p>
            <div className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-yellow-500 self-center" />
          </div>
        </header>

        {/* GRID DE JOGO - HIERARQUIA CONTROLADA POR ORDER-X */}
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 -mt-12 md:-mt-16 flex flex-col lg:grid lg:grid-cols-12 gap-8 pb-24">
          
          {/* COLUNA CENTRAL: JUMBOTRON E CHAT */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col gap-8">
            
            {/* 2. JUMBOTRON (Primeiro item de conteúdo no mobile) */}
            <div className="transform transition-transform hover:scale-[1.01] duration-500">
              <JumbotronJogo jogo={jogo} />
            </div>

            {/* 5. CHAT (Último item no mobile) */}
            <div className="order-last lg:order-none bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] h-[550px] md:h-[700px] overflow-hidden shadow-2xl relative pointer-events-auto">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />
              <TigreFCChat usuarioId={meuId} />
            </div>
          </div>

          {/* 3. DESTAQUES FIFA (Segundo item no mobile, coluna direita no desktop) */}
          <aside className="order-2 lg:order-3 lg:col-span-3">
            <DestaquesFifa />
          </aside>

          {/* 4. RANKING (Terceiro item no mobile, coluna esquerda no desktop) */}
          <aside className="order-3 lg:order-1 lg:col-span-3">
            <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative group overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50 transition-opacity" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                Live Ranking
              </h2>
              <div className="space-y-3">
                {ranking.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-yellow-500/10 transition-all cursor-pointer group/item">
                    <span className="text-xl font-black italic text-zinc-800 group-hover/item:text-yellow-500/50">0{i+1}</span>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-tight">{u.apelido || u.nome}</p>
                      <div className="w-full bg-zinc-800 h-1 mt-1.5 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full shadow-[0_0_10px_#F5C400]" style={{ width: `${100 - (i*12)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>

      {/* FOOTER BROADCAST */}
      <footer className="relative z-30 mt-auto">
        <TigreNewsFlash />
        <div className="bg-black/90 backdrop-blur-md py-6 border-t border-white/10 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System Online</span>
          </div>
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">© 2026 TIGRE FC DIGITAL ARENA</p>
          <div className="text-[10px] font-black text-yellow-500/50 uppercase tracking-[0.3em]">V2.6.0-PRO</div>
        </div>
      </footer>

      {/* MODAL PERFIL */}
      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}

      {/* ESTILOS GAME-ENGINE */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        
        body { 
          background-color: #030303;
          font-family: 'Barlow Condensed', sans-serif !important;
          overflow-x: hidden;
        }

        @keyframes slow-pan {
          from { background-position: 0 0; }
          to { background-position: 1000px 1000px; }
        }

        .animate-slow-pan { animation: slow-pan 60s linear infinite; }
        .animate-pulse-slow { animation: pulse 8s ease-in-out infinite; }
        .drop-shadow-neon { filter: drop-shadow(0 0 5px rgba(245,196,0,0.4)); }
        
        .animate-glow {
          filter: drop-shadow(0 0 20px rgba(255,255,255,0.1));
          animation: text-glow 4s ease-in-out infinite;
        }

        @keyframes text-glow {
          0%, 100% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.1)); }
          50% { filter: drop-shadow(0 0 40px rgba(245,196,0,0.2)); }
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #F5C400; border-radius: 10px; }
        
        /* Garante que o input do chat receba foco */
        input, textarea, button { pointer-events: auto !important; }
      `}</style>
    </main>
  );
}
