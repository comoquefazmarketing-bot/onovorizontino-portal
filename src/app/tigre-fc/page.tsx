'use client';

import { useState, useEffect } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';
import TigreNewsFlash from '@/components/tigre-fc/TigreNewsFlash';

const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";

const JOGO_FALLBACK = {
  id: 12,
  competicao: 'COPA SUL-SUDESTE',
  rodada: '7',
  data_hora: '2026-05-03T21:00:00+00:00',
  mandante: { nome: 'AVAÍ', escudo_url: URL_AVAI },
  visitante: { nome: 'NOVORIZONTINO', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png' }
};

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [jogo, setJogo] = useState<any>(JOGO_FALLBACK);
  const [stats, setStats] = useState({
    capitao: { nome: '---', pts: 0 },
    heroi: { nome: '---', pts: 0 }
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      const { data: { session } } = await sb.auth.getSession();
      let userId = null;
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) { userId = u.id; setMeuId(u.id); }
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

      if (resJogo.data) {
        const g = resJogo.data;
        if (g.mandante?.nome?.toUpperCase() === 'AVAÍ') g.mandante.escudo_url = URL_AVAI;
        setJogo(g);

        if (userId) {
          const { data: esc } = await sb.from('tigre_fc_escalacoes')
            .select('capitao_nome, heroi_nome')
            .eq('usuario_id', userId)
            .eq('jogo_id', g.id)
            .maybeSingle();
          if (esc) {
            setStats({
              capitao: { nome: esc.capitao_nome || '---', pts: 0 },
              heroi: { nome: esc.heroi_nome || '---', pts: 0 }
            });
          }
        }
      }
    }
    init();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400/30 flex flex-col">
      
      {/* HEADER FIFA 26 */}
      <header className="relative pt-16 pb-24 text-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,196,0,0.1)_0%,transparent_60%)]" />
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none opacity-90 mix-blend-lighten">
          TIGRE <span className="text-[#F5C400]">FC</span>
        </h1>
        <div className="inline-block mt-4 px-6 py-1 bg-white/5 border border-white/10 rounded-full">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em]">Live Match Engine</p>
        </div>
      </header>

      {/* GRID LÍMPO */}
      <div className="max-w-7xl mx-auto w-full px-4 -mt-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20 flex-1">
        
        {/* RANKING À ESQUERDA */}
        <aside className="lg:col-span-3">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Global Leaderboard</h2>
            <div className="space-y-3">
              {ranking.map((u, i) => (
                <button 
                  key={u.id}
                  onClick={() => setPerfilAberto(u.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-yellow-400/20 transition-all group"
                >
                  <span className="text-sm font-black italic text-zinc-600 group-hover:text-yellow-400">#{i+1}</span>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-black uppercase truncate">{u.apelido || u.nome}</p>
                    <p className="text-[9px] font-bold text-zinc-500">{u.pontos_total || 0} SCORE</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* JUMBOTRON E CHAT NO CENTRO */}
        <div className="lg:col-span-6 space-y-6">
          <JumbotronJogo jogo={jogo} stats={stats} />
          
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[48px] h-[650px] overflow-hidden shadow-2xl">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </div>

        {/* DESTAQUES À DIREITA */}
        <aside className="lg:col-span-3">
          <DestaquesFifa />
        </aside>
      </div>

      {/* RODAPÉ COM NOTÍCIAS */}
      <footer className="mt-auto">
        <TigreNewsFlash />
        <div className="bg-black py-4 border-t border-white/5 text-center">
          <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">
            Tigre FC • Broadcast Interface v2.6
          </p>
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
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');
        body { font-family: 'Barlow Condensed', sans-serif !important; background-color: #050505; }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </main>
  );
}
