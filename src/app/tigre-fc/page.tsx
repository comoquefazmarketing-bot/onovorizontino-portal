'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [totalEscalacoes, setTotalEscalacoes] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    async function loadData() {
      // Auth
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: profile } = await sb
          .from('tigre_fc_usuarios')
          .select('id')
          .eq('google_id', session.user.id)
          .maybeSingle();
        if (profile) setMeuId(profile.id);
      }

      // Próximo Jogo
      try {
        const { data } = await sb
          .from('jogos')
          .select('*')
          .eq('finalizado', false)
          .order('data_hora', { ascending: true })
          .limit(1);

        if (data && data.length > 0) {
          setJogo(data[0]);
        } else {
          setJogo({
            id: 16,
            rodada: '11',
            competicao: 'Série B 2026',
            mandante_slug: 'sao-bernardo',
            visitante_slug: 'novorizontino',
            data_hora: '2026-05-31 14:00:00+00',
            local: 'Estádio 1º de Maio — São Bernardo do Campo, SP',
            finalizado: false,
          });
        }
      } catch (e) {
        console.error(e);
      }

      // Ranking
      const { data: resRank } = await sb
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);

      if (resRank) setRanking(resRank);

      // Total de escalações
      if (jogo?.id) {
        const { count } = await sb
          .from('tigre_fc_escalacoes')
          .select('*', { count: 'exact', head: true })
          .eq('jogo_id', jogo.id);
        setTotalEscalacoes(count || 0);
      }
    }

    loadData();
  }, [mounted, jogo?.id]);

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20">
      {/* HERO HEADER */}
      <div className="relative pt-20 pb-16 text-center">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={PATA_LOGO}
          className="w-20 mx-auto mb-4 drop-shadow-2xl"
        />
        <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-[-2px]">
          TIGRE <span className="text-[#F5C400]">FC</span>
        </h1>
        <p className="text-xl text-white/60 mt-3">O jogo oficial da torcida do Novorizontino</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* JUMBOTRON */}
        {jogo && <JumbotronJogo jogo={jogo} totalEscalacoes={totalEscalacoes} />}

        {/* SOFASCORE + DESTAQUES */}
        <DestaquesFifa />

        {/* RANKING */}
        <section>
          <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
            🏆 Ranking Geral
            <span className="text-sm font-normal text-zinc-500">({ranking.length} torcedores)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ranking.map((u, i) => (
              <div
                key={u.id}
                onClick={() => setPerfilAberto(u.id)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition-all border border-white/5"
              >
                <span className="text-3xl font-black text-yellow-400 w-10">#{i + 1}</span>
                <img src={u.avatar_url || PATA_LOGO} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-bold text-lg">{u.apelido || u.nome}</p>
                </div>
                <p className="text-3xl font-black text-yellow-400">{u.pontos_total ?? 0}</p>
              </div>
            ))}
          </div>
        </section>

        {/* VESTIÁRIO */}
        <section>
          <h3 className="text-2xl font-black mb-4">💬 Vestiário ao Vivo</h3>
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/80 h-[520px]">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico
            targetUsuarioId={perfilAberto}
            viewerUsuarioId={meuId || undefined}
            onClose={() => setPerfilAberto(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
