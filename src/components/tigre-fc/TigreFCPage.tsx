'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo'; // Importado conforme planejado

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  use(params);

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
      // 1. Sessão do Usuário
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      // 2. Busca do Próximo Jogo (Machine do SofaScore)
      const resJogo = await fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null);
      if (resJogo?.jogos?.length > 0) {
        setJogo(resJogo.jogos[0]);
      } else {
        // Fallback para o jogo contra o Sport ou América conforme nossos dados
        setJogo({
          id: 6,
          data_hora: '2026-04-25T20:30:00',
          competicao: 'Série B',
          rodada: '6ª Rodada',
          local: 'Ilha do Retiro • Recife',
          mandante:  { nome: 'Sport', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SPORT.png' },
          visitante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png' },
        });
      }

      // 3. Busca do Ranking (Sincronizado com Supabase)
      const { data: resRank } = await sb.from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);
      if (resRank) setRanking(resRank);
    }
    init();
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 overflow-x-hidden"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
      `}</style>

      {/* HEADER PRINCIPAL */}
      <div className="relative pt-20 pb-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,196,0,0.1)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <img src={PATA_LOGO} className="w-16 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(245,196,0,0.6)]" alt="" />
          <h1 className="text-7xl font-black tracking-[-4px] italic uppercase leading-none">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-12">

        {/* NOVA JUMBOTRON (Estilo NBA/NFL) 
            Substituindo o card antigo pela nossa Jumbotron Modular
        */}
        {jogo && (
          <JumbotronJogo 
            jogo={jogo} 
            mercadoFechado={mercadoFechado} 
            stats={{
              ranking: ranking.slice(0, 5), // Exibe o Top 5 no painel de LED
              participantes: 847, // Dados mockados para impacto visual
              posicao: 4, // Posição atual do Tigre na Série B
              golsSofridos: 5,
              mediaSofaTime: 6.88, // Média real extraída do SofaScore
              mvp: { nome: 'Sander', media: 7.60 }, // Destaque para o melhor avaliado
            }}
          />
        )}

        {/* DESTAQUES ESTILO FIFA/FC24 */}
        <DestaquesFifa />

        {/* LEADERBOARD DETALHADO */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(245,196,0,0.3)] to-transparent" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#F5C400]">Leaderboard Geral</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[rgba(245,196,0,0.3)] to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.025] border border-white/5 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="w-6 text-center text-xs font-black italic text-zinc-700">{String(i + 1).padStart(2, '0')}</span>
                <img src={u.avatar_url || PATA_LOGO} className="w-10 h-10 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <p className="font-black uppercase text-sm">{u.apelido || u.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-[#F5C400]">{u.pontos_total ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VESTIÁRIO (CHAT) */}
        <section>
          <h3 className="text-3xl font-black italic uppercase text-white text-center mb-6">Vestiário</h3>
          <div className="rounded-3xl border border-white/5 overflow-hidden bg-black/40 backdrop-blur-md">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      {/* OVERLAY DE PERFIL PÚBLICO */}
      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId} onClose={() => setPerfilAberto(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
