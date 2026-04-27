'use client';

import { useState, useEffect } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';
import TigreNewsFlash from '@/components/tigre-fc/TigreNewsFlash';

// ════════════════════════════════════════════════════════════════════════════
// ASSETS & CONFIG
// ════════════════════════════════════════════════════════════════════════════
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
      
      {/* ── HEADER FIFA 26 ── */}
      <header className="relative pt-16 pb-28 text-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(245,196,0,0.12)_0%,transparent_60%)]" />
        
        {/* Elemento Decorativo Cyber */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />

        <h1 className="text-[120px] font-black italic uppercase tracking-[-0.08em] leading-none opacity-90 mix-blend-lighten">
          TIGRE <span className="text-[#F5C400] drop-shadow-[0_0_30px_rgba(245,196,0,0.3)]">FC</span>
        </h1>
        
        <div className="inline-flex items-center gap-4 mt-2 px-8 py-2 bg-black/40 border border-white/10 rounded-full backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.6em]">Neural Engine Active</p>
          <span className="text-white/20">|</span>
          <p className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Broadcast v2.6</p>
        </div>
      </header>

      {/* ── GRID PRINCIPAL ── */}
      <div className="max-w-[1600px] mx-auto w-full px-6 -mt-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32 flex-1">
        
        {/* COLUNA ESQUERDA: RANKING & PREMIOS */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="bg-zinc-900/30 backdrop-blur-2xl border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[60px] group-hover:bg-yellow-400/10 transition-all" />
            
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Global Ranking</h2>
              <div className="px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 text-[9px] font-black text-yellow-400">LIVE</div>
            </div>

            <div className="space-y-4">
              {ranking.map((u, i) => (
                <button 
                  key={u.id}
                  onClick={() => setPerfilAberto(u.id)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-yellow-400/30 transition-all group/item"
                >
                  <span className={`text-sm font-black italic ${i < 3 ? 'text-yellow-400' : 'text-zinc-600'}`}>
                    {(i+1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1 text-left">
                    <p className="text-[11px] font-black uppercase tracking-tight truncate">{u.apelido || u.nome}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-zinc-700" />
                      <p className="text-[9px] font-bold text-zinc-500">{u.pontos_total || 0} SCORE</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CARD DE CTA PREMIOS */}
          <div className="bg-gradient-to-b from-[#F5C400] to-[#CCA300] rounded-[40px] p-8 text-black shadow-[0_20px_50px_rgba(245,196,0,0.15)] relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]">
            <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12 group-hover:scale-110 transition-transform">🏆</div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Season Rewards</p>
            <h3 className="text-2xl font-black italic uppercase leading-none mb-6">Mestre dos<br/>Palpites</h3>
            <div className="py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl text-center">
              Resgatar Prêmios
            </div>
          </div>
        </aside>

        {/* COLUNA CENTRAL: JUMBOTRON & CHAT */}
        <div className="lg:col-span-6 space-y-8">
          <JumbotronJogo jogo={jogo} stats={stats} />
          
          <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/5 rounded-[56px] h-[650px] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            <TigreFCChat usuarioId={meuId} />
          </div>
        </div>

        {/* COLUNA DIREITA: FIFA STATS & BROADCAST */}
        <aside className="lg:col-span-3 space-y-8">
          <DestaquesFifa />
          
          <div className="bg-zinc-900/30 border border-white/5 rounded-[40px] p-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">On-Air Information</p>
             </div>
             <div className="space-y-4">
                <div>
                   <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Local do Confronto</p>
                   <p className="text-xs font-bold uppercase text-white">{jogo.local || 'ESTÁDIO JORGE ISMAEL DE BIASI'}</p>
                </div>
                <div>
                   <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Transmissão</p>
                   <p className="text-xs font-black uppercase text-yellow-400 italic">{jogo.transmissao || 'PREMIERE · SPORTV'}</p>
                </div>
             </div>
          </div>
        </aside>
      </div>

      {/* ── FOOTER HYPER-TICKER (NEWS) ── */}
      <footer className="mt-auto relative">
        <div className="absolute bottom-full left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none" />
        
        <TigreNewsFlash />
        
        <div className="bg-black py-6 text-center border-t border-white/5">
          <div className="flex items-center justify-center gap-8 opacity-30 grayscale transition-all hover:opacity-100 hover:grayscale-0">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">Tigre FC Official Dashboard</span>
            <div className="w-1 h-1 rounded-full bg-zinc-800" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase">2026 Season</span>
          </div>
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

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');
        body { 
          font-family: 'Barlow Condensed', sans-serif !important; 
          background-color: #050505; 
          overflow-x: hidden;
        }
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </main>
  );
}
