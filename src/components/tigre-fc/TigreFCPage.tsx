'use client';
import { useState, useEffect, use } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    async function init() {
      // Auth
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      // Busca o próximo jogo (prioridade alta)
      try {
        const res = await fetch('/api/proximo-jogo');
        const data = await res.json();

        if (data?.jogos?.length > 0) {
          setJogo(data.jogos[0]);
        } else {
          // Fallback forte para São Bernardo
          setJogo({
            id: 16,
            rodada: '11',
            competicao: 'Série B 2026',
            mandante_slug: 'sao-bernardo',
            visitante_slug: 'novorizontino',
            data_hora: '2026-05-31 14:00:00+00',
            local: 'Estádio 1º de Maio — São Bernardo do Campo, SP',
            transmissao: 'ESPN · Disney+',
            finalizado: false,
          });
        }
      } catch (e) {
        console.error("Falha ao buscar jogo:", e);
      }

      // Ranking
      const { data: resRank } = await sb
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);

      if (resRank) setRanking(resRank);
    }

    init();
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20">
      {/* Header */}
      <div className="relative pt-20 pb-16 text-center">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={PATA_LOGO}
          className="w-20 mx-auto mb-4"
        />
        <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-[-2px]">
          TIGRE <span className="text-[#F5C400]">FC</span>
        </h1>
        <p className="text-xl text-white/60 mt-3">O jogo oficial da torcida do Novorizontino</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Jumbotron - Agora deve mostrar São Bernardo */}
        {jogo && <JumbotronJogo jogo={jogo} />}

        {/* Texto Educativo */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-8">
          <h3 className="text-2xl font-black text-yellow-400 mb-4">Como funciona o Tigre FC?</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>1️⃣ <strong>Escalar:</strong> Monte seu time, escolha Capitão (2× pontos) e Herói.</div>
            <div>2️⃣ <strong>Cravar placar:</strong> Acertar o resultado exato dá muitos pontos.</div>
            <div>3️⃣ <strong>Subir no ranking:</strong> Quanto melhor o Tigre jogar, mais você pontua.</div>
            <div>4️⃣ <strong>Converse no Vestiário:</strong> Debata com outros torcedores.</div>
          </div>
        </div>

        {/* Ranking */}
        <section>
          <h3 className="text-2xl font-black mb-6">🏆 Ranking Geral</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ranking.map((u, i) => (
              <div
                key={u.id}
                onClick={() => setPerfilAberto(u.id)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 cursor-pointer transition-all border border-white/5"
              >
                <span className="text-xl font-black text-yellow-400 w-8">{i + 1}</span>
                <img src={u.avatar_url || PATA_LOGO} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{u.apelido || u.nome}</p>
                </div>
                <p className="text-2xl font-black text-yellow-400">{u.pontos_total ?? 0}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
