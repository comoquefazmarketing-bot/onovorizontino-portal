'use client';

import { useState, useEffect, useRef } from 'react';
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
    // Reset de scroll agressivo e imediato
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    setMounted(true);
    loadData();
  }, []);

  async function loadData() {
    sb.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle()
          .then(({ data: u }) => u && setMeuId(u.id));
      }
    });

    sb.from('jogos_tigre').select('*, mandante:times(*), visitante:times(*)').eq('ativo', true).maybeSingle()
      .then(({ data }) => setJogo(data));

    sb.from('tigre_fc_usuarios')
      .select('id, nome, apelido, pontos_total, avatar_url')
      .not('pontos_total', 'is', null)
      .order('pontos_total', { ascending: false })
      .limit(6)
      .then(({ data }) => data && setRanking(data));
  }

  if (!mounted) return <div className="bg-[#030303] min-h-screen" />;

  return (
    <main className="min-h-screen bg-[#030303] text-white font-sans flex flex-col relative overflow-x-hidden scroll-smooth">
      
      {/* BACKGROUND FIXO (Não conta para o layout, evita pulos) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#F5C40015_0%,transparent_40%)]" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] animate-slow-pan" />
      </div>

      <div className="relative z-20 flex flex-col flex-1">
        
        {/* HEADER - Espaçamento controlado para evitar a lacuna */}
        <header className="relative pt-12 pb-8 md:pt-20 md:pb-12 text-center px-4">
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 animate-glow">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
          <p className="mt-3 text-[10px] font-black text-yellow-500/30 uppercase tracking-[0.8em]">Neural Arena v2.6</p>
        </header>

        {/* GRID PRINCIPAL - Sem margens negativas para não "quebrar" o fluxo */}
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-6 flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 pb-32">
          
          {/* 1. JUMBOTRON (Placar) */}
          <div className="order-1 lg:order-2 lg:col-span-6">
            <JumbotronJogo jogo={jogo} />
          </div>

          {/* 2. DESTAQUES (O "Story" do Instagram) */}
          <aside className="order-2 lg:order-3 lg:col-span-3">
            <div className="sticky top-6">
              <DestaquesFifa />
            </div>
          </aside>

          {/* 3. RANKING */}
          <aside className="order-3 lg:order-1 lg:col-span-3">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-5 shadow-2xl">
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full" />
                Live Ranking
              </h2>
              <div className="space-y-4">
                {ranking.map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3">
                    <span className="text-sm font-black italic text-zinc-800">#0{i+1}</span>
                    <div className="flex-1 truncate">
                      <p className="text-[11px] font-black uppercase truncate">{u.apelido || u.nome}</p>
                      <div className="w-full bg-zinc-800 h-[2px] mt-1 rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: `${100 - (i*15)}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* 4. CHAT - Agora colado e sem lacunas */}
          <div className="order-4 lg:col-start-4 lg:col-span-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] h-[550px] md:h-[700px] overflow-hidden relative shadow-inner">
             <TigreFCChat usuarioId={meuId} />
          </div>

        </div>
      </div>

      <footer className="relative z-30 mt-auto">
        <TigreNewsFlash />
        <div className="bg-black/80 py-6 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-zinc-800 uppercase tracking-[1em]">TIGRE FC DIGITAL</p>
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
        
        /* Força a página a ficar no topo e evita saltos */
        html { scroll-padding-top: 100px; }
        
        body { 
          background-color: #030303; 
          font-family: 'Barlow Condensed', sans-serif !important;
          margin: 0;
          overflow-x: hidden;
        }

        @keyframes slow-pan { from { background-position: 0 0; } to { background-position: 500px 500px; } }
        .animate-slow-pan { animation: slow-pan 120s linear infinite; }
        
        .animate-glow {
          animation: text-glow 4s ease-in-out infinite;
        }
        @keyframes text-glow {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }

        /* Esconde scrollbars para look clean */
        ::-webkit-scrollbar { width: 0px; display: none; }
        
        /* Estilização para o botão salvar no DestaquesFifa */
        .save-btn-story {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          color: #F5C400;
          cursor: pointer;
        }
      `}</style>
    </main>
  );
}
