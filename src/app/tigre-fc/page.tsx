'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const FALLBACK_JOGO = {
  id: 16,
  rodada: 11,
  competicao: 'Série B 2026',
  mandante_slug: 'sao-bernardo',
  visitante_slug: 'novorizontino',
  data_hora: '2026-05-31 14:00:00+00',
  local: 'Estádio 1º de Maio — São Bernardo do Campo, SP',
  transmissao: 'ESPN · Disney+',
  finalizado: false,
};

export default function TigreFCPage() {
  const router = useRouter();
  const [jogo, setJogo] = useState(FALLBACK_JOGO);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [totalEscalacoes, setTotalEscalacoes] = useState(0);

  useEffect(() => {
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

      // Busca jogo real
      try {
        const { data } = await sb
          .from('jogos')
          .select('*')
          .eq('finalizado', false)
          .order('data_hora', { ascending: true })
          .limit(1);

        if (data && data.length > 0) {
          setJogo(data[0]);
        }
      } catch (err) {
        console.error("Erro ao buscar jogo:", err);
      }

      // Ranking
      const { data: resRank } = await sb
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);

      if (resRank) setRanking(resRank);

      // Total de escalações
      if (jogo.id) {
        const { count } = await sb
          .from('tigre_fc_escalacoes')
          .select('*', { count: 'exact', head: true })
          .eq('jogo_id', jogo.id);
        setTotalEscalacoes(count || 0);
      }
    }

    loadData();
  }, []);

  const handleEscalar = () => {
    router.push(`/tigre-fc/escalar/${jogo.id || 16}`);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20">
      {/* Header */}
      <div className="relative pt-20 pb-16 text-center">
        <img src={PATA_LOGO} className="w-20 mx-auto mb-4" alt="Pata Tigre" />
        <h1 className="text-7xl md:text-8xl font-black italic uppercase tracking-tighter">
          TIGRE <span className="text-[#F5C400]">FC</span>
        </h1>
        <p className="text-xl text-white/60 mt-3">O jogo da torcida do Novorizontino</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* JUMBOTRON */}
        <JumbotronJogo
          jogo={jogo}
          onEscalar={handleEscalar}
          totalEscalacoes={totalEscalacoes}
        />

        {/* Texto Educativo */}
        <div className="bg-zinc-900/50 border border-yellow-500/20 rounded-3xl p-8">
          <h3 className="text-2xl font-black text-yellow-400 mb-4">Bem-vindo ao Tigre FC!</h3>
          <p className="text-white/80 mb-6">
            Monte sua escalação, escolha Capitão e Herói, crave o placar e dispute com a torcida.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>1. Clique em <strong>"ESCALAR AGORA"</strong></div>
            <div>2. Monte seu time e defina Capitão + Herói</div>
            <div>3. Crave o placar do jogo</div>
            <div>4. Suba no ranking ao vivo</div>
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
                className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 cursor-pointer transition-all"
              >
                <span className="text-2xl font-black text-yellow-400 w-8">#{i+1}</span>
                <img src={u.avatar_url || PATA_LOGO} className="w-12 h-12 rounded-xl" />
                <div className="flex-1">
                  <p className="font-bold">{u.apelido || u.nome}</p>
                </div>
                <p className="text-2xl font-black text-yellow-400">{u.pontos_total ?? 0}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </main>
  );
}
