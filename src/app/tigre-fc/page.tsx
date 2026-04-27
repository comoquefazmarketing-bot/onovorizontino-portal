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

  // 1. Montagem imediata da interface
  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
    loadData();
  }, []);

  // 2. Busca de dados assíncrona e independente para máxima velocidade
  async function loadData() {
    // Busca sessão sem travar o resto
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle()
          .then(({ data: u }) => u && setMeuId(u.id));
      }
    });

    // Jogo em destaque
    sb.from('jogos_tigre').select('*, mandante:times(*), visitante:times(*)').eq('ativo', true).maybeSingle()
      .then(({ data }) => setJogo(data));

    // Ranking (Limitado para ser leve)
    sb.from('tigre_fc_usuarios')
      .select('id, nome, apelido, pontos_total, avatar_url')
      .not('pontos_total', 'is', null)
      .order('pontos_total', { ascending: false })
      .limit(6)
      .then(({ data }) => data && setRanking(data));
  }

  if (!mounted) return <div className="bg-[#030303] min-h-screen" />;

  return (
    <main className="min-h-screen bg-[#030303] text-white font-sans overflow-x-hidden flex flex-col relative">
      
      {/* ── BACKGROUND FX ENGINE (Pointer Events None para não travar cliques) ── */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#F5C40022_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] z-10 bg-[length:100%_4px,3px_100%]" />
        <div className="absolute -inset-[100%] opacity-20 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-slow-pan" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* ── CONTEÚDO ── */}
      <div className="relative z-20 flex flex-col flex-1">
        
        {/* LOGO IMPACTO */}
        <header className="relative pt-12 pb-16 md:pt-24 md:pb-32 text-center px-4">
          <div className="inline-block relative">
             <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-700 animate-glow">
              TIGRE <span className="text-[#F5C400] drop-shadow-[0_0_30px_rgba(245,196,0,0.5)]">FC</span>
            </h1>
            <div className="absolute -top-2 -right-4 md:-top-4 md:-right-8 bg-red-600 text-[8px] md:text-[10px] font-black px-2 py-0.5 transform rotate-12 animate-bounce">
              LIVE
            </div>
          </div>
        </header>

        {/* HIERARQUIA DE LAYOUT */}
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 -mt-8 md:-mt-16 flex flex-col lg:grid lg:grid-cols-12 gap-8 pb-24">
          
          {/* 1. JUMBOTRON (Central no Desktop, Primeiro no Mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-6 space-y-8">
            <div className="transform transition-transform hover:scale-[1.01] duration-500">
              <JumbotronJogo jogo={jogo} />
            </div>
          </div>

          {/* 2. DESTAQUES FIFA (Direita no Desktop, Segundo no Mobile) */}
          <aside className="order-2 lg:order-3 lg:col-span-3">
            <DestaquesFifa />
          </aside>

          {/* 3. RANKING (Esquerda no Desktop, Terceiro no Mobile) */}
          <aside className="order-3 lg:order-1 lg:col-span-3">
            <div className="bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-yellow-500/30" />
              <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-ping" />
                Live Ranking
              </h2>
              <div className="space-y-3">
                {ranking.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-yellow-500/10 transition-all">
                    <span className="text-xl font-black italic text-zinc-800">0{i+1}</span>
                    <div className="flex-1 truncate">
                      <p className="text-xs font-black uppercase truncate">{u.apelido || u.nome}</p>
                      <div className="w-full bg-zinc-800 h-1 mt-1.5 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: `${100 - (i*15)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* 4. CHAT (Abaixo do Jumbotron no Desktop, ÚLTIMO no Mobile) */}
          <div className="order-4 lg:col-start-4 lg:col-span-6 bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] md:rounded-[3rem] h-[500px] md:h-[700px] overflow-hidden shadow-2xl relative">
            <TigreFCChat usuarioId={meuId} />
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-30 mt-auto">
        <TigreNewsFlash />
        <div className="bg-black/90 backdrop-blur-md py-6 border-t border-white/10 text-center">
          <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">© 2026 TIGRE FC DIGITAL ARENA</p>
        </div>
      </footer>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&display=swap');
        body { background-color: #030303; font-family: 'Barlow Condensed', sans-serif !important; }
        @keyframes slow-pan { from { background-position: 0 0; } to { background-position: 1000px 1000px; } }
        .animate-slow-pan { animation: slow-pan 80s linear infinite; }
        .animate-glow { animation: text-glow 3s ease-in-out infinite; }
        @keyframes text-glow { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; filter: brightness(1.3); } }
        /* Performance: esconde scrollbars para um look mais clean e rápido */
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </main>
  );
}
