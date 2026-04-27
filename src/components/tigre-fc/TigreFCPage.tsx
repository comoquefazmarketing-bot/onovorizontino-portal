'use client';

import { useState, useEffect, use } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [mercadoFechado, setMercadoFechado] = useState(false);

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
        setJogo({
          id: 6,
          data_hora: '2026-04-25T20:30:00',
          competicao: 'Série B',
          rodada: '6ª Rodada',
          mandante:  { nome: 'Sport', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SPORT.png', sigla: 'SPT' },
          visitante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png', sigla: 'NOV' },
        });
      }

      const { data: resRank } = await sb.from('tigre_fc_usuarios').select('id, nome, apelido, avatar_url, pontos_total').order('pontos_total', { ascending: false }).limit(10);
      if (resRank) setRanking(resRank);
    }
    init();
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 overflow-x-hidden" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      <style jsx global>{` 
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap'); 
        .shadow-text { text-shadow: 0px 4px 12px rgba(0,0,0,1); }
        .bg-glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); }
      `}</style>

      <div className="relative pt-20 pb-28 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(245,196,0,0.08)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            src={PATA_LOGO} 
            className="w-16 mx-auto mb-4 drop-shadow-[0_0_25px_rgba(245,196,0,0.4)]" 
          />
          <h1 className="text-7xl md:text-8xl font-black italic uppercase leading-none shadow-text tracking-tighter">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-10">
        
        {jogo && (
          <JumbotronJogo 
            jogo={jogo} 
            mercadoFechado={mercadoFechado} 
            stats={{
              ranking: ranking.map(u => ({ nome: u.nome, apelido: u.apelido, pontos: u.pontos_total ?? 0 })),
              capitao: { nome: 'CÉSAR', pts: 6.9 }, 
              heroi: { nome: 'DANTAS', pts: 7.1 },
              posicao: 9, 
              golsSofridos: 6, 
              mediaSofaTime: 6.95, 
              mvp: { nome: 'Dantas', media: 7.1 }, 
              participantes: ranking.length
            } as any} // 🚀 O 'as any' força o TypeScript a aceitar os campos novos
          />
        )}

        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-black italic uppercase text-yellow-500 tracking-tight shadow-text">Quadro Tático (SofaScore)</h3>
          </div>
          <div className="rounded-[32px] overflow-hidden border border-white/10 bg-black shadow-2xl">
            <iframe 
              id="sofa-lineups-embed-15526043" 
              src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526043&widgetTheme=dark" 
              className="w-full h-[600px] md:h-[786px]"
              frameBorder="0" 
              scrolling="no"
            />
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-black italic uppercase mb-6 shadow-text">Classificação Geral</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ranking.map((u, i) => (
              <div 
                key={u.id} 
                onClick={() => setPerfilAberto(u.id)} 
                className="flex items-center gap-4 p-4 rounded-2xl bg-glass hover:bg-white/[0.06] transition-all cursor-pointer group border border-white/5"
              >
                <span className="w-6 text-center text-xs font-black italic text-zinc-600 group-hover:text-yellow-500">{String(i + 1).padStart(2, '0')}</span>
                <img src={u.avatar_url || PATA_LOGO} className="w-10 h-10 rounded-xl object-cover border border-white/10" alt="" />
                <div className="flex-1">
                  <p className="font-black uppercase text-sm tracking-tight shadow-text group-hover:text-yellow-500 transition-colors">
                    {u.apelido || u.nome}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#F5C400] italic leading-none">{u.pontos_total ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-3xl font-black italic uppercase text-white text-center mb-6 shadow-text">Vestiário</h3>
          <div className="rounded-[40px] border border-white/10 overflow-hidden bg-black/60 backdrop-blur-xl">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId || undefined} onClose={() => setPerfilAberto(null)} />
        )}
      </AnimatePresence>

      <footer className="mt-20 py-10 border-t border-white/5 text-center">
        <p className="text-[10px] text-zinc-600 font-bold tracking-[0.4em] uppercase">Arena Tigre FC • By Felipe Makarios</p>
      </footer>
    </main>
  );
}
