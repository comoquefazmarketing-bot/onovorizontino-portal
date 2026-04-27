'use client';

import { useState, useEffect } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";

// Fallback para evitar tela preta se o banco falhar
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

      // Parallel Fetch: Jogo e Ranking (Estilo FIFA - Dados Dinâmicos)
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
    <main className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-400/30">
      {/* HUD SUPERIOR - DESIGN FIFA */}
      <header className="relative pt-12 pb-24 text-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,196,0,0.08)_0%,transparent_70%)]" />
        <h1 className="text-8xl font-black italic uppercase tracking-tighter leading-none opacity-90">
          TIGRE <span className="text-[#F5C400]">FC</span>
        </h1>
        <div className="inline-block mt-4 px-6 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
          <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em]">Live Match Engine</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
        
        {/* COLUNA ESQUERDA: RANKING & NEWS (CLUSTERS) */}
        <aside className="lg:col-span-3 space-y-6">
          {/* RANKING PUBLICO - DESIGN DOPAMINÉRGICO */}
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Global Leaderboard</h2>
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
            </div>
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

          {/* CLUSTER DE NOTÍCIAS (PORTAL) */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[32px] p-[1px]">
            <div className="bg-black rounded-[31px] p-6">
              <h2 className="text-xs font-black text-yellow-400 uppercase tracking-widest mb-4">News Flash</h2>
              <div className="space-y-4">
                {[
                  "Novorizontino inicia check-in para sócios.",
                  "Novo reforço disponível no mercado do Tigre FC.",
                  "Análise tática: Como vencer o Avaí fora de casa."
                ].map((txt, i) => (
                  <div key={i} className="group cursor-pointer">
                    <p className="text-[10px] font-black text-zinc-500 uppercase">Update 0{i+1}</p>
                    <p className="text-xs font-bold leading-tight group-hover:text-yellow-400 transition-colors">{txt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* COLUNA CENTRAL: JUMBOTRON & CHAT */}
        <div className="lg:col-span-6 space-y-6">
          <JumbotronJogo jogo={jogo} stats={stats} />
          
          <div className="bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-[48px] h-[650px] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            <TigreFCChat usuarioId={meuId} />
          </div>
        </div>

        {/* COLUNA DIREITA: FIFA STATS & ADS */}
        <aside className="lg:col-span-3 space-y-6">
          <DestaquesFifa />
          
          {/* CARD DE CTA DOPAMINA */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-[32px] p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto border border-yellow-400/20">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <p className="text-sm font-black uppercase italic">Conquiste o Topo</p>
              <p className="text-[10px] text-zinc-500 font-medium">Cada palpite certeiro te aproxima da liderança global.</p>
            </div>
            <button className="w-full py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-colors">
              Ver Prêmios
            </button>
          </div>
        </aside>

      </div>

      {/* MODAL PERFIL - LÓGICA REUTILIZADA */}
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
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
      `}</style>
    </main>
  );
}
