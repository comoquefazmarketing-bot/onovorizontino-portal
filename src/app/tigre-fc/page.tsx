'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat          from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa         from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo        from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

interface Time {
  id: number;
  nome: string;
  escudo_url: string;
  cor_primaria: string;
  sigla: string | null;
}

interface Jogo {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string | null;
  transmissao: string | null;
  placar_mandante: number | null;
  placar_visitante: number | null;
  finalizado: boolean;
  ativo: boolean;
  mandante: Time;
  visitante: Time;
}

interface UsuarioRanking {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number;
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  use(params);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [mercadoFechado, setMercadoFechado] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    topRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!mounted) return;

    async function init() {
      setIsLoading(true);
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user?.id) {
          const { data: u } = await sb
            .from('tigre_fc_usuarios')
            .select('id')
            .eq('google_id', session.user.id)
            .maybeSingle();
          if (u) setMeuId(u.id);
        }

        const [resJogo, resRank] = await Promise.all([
          fetch('/api/proximo-jogo', { cache: 'no-store' }).then(r => r.json()).catch(() => null),
          sb
            .from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .not('pontos_total', 'is', null)
            .order('pontos_total', { ascending: false })
            .limit(10),
        ]);

        if (resJogo?.jogos?.[0]) setJogo(resJogo.jogos[0] as Jogo);
        if (resRank.data) setRanking(resRank.data as UsuarioRanking[]);
      } catch (e) {
        console.error('[TigreFCPage] Erro:', e);
      } finally {
        setIsLoading(false);
      }
    }

    init();
    const channel = sb.channel('tigre-fc-live').on('postgres_changes', { event: '*', schema: 'public', table: 'jogos' }, () => init()).subscribe();
    return () => { sb.removeChannel(channel); };
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-40 font-sans overflow-x-hidden">
      
      {/* ESPAÇAMENTO PARA O TOPO */}
      <div ref={topRef} tabIndex={-1} className="pt-10 outline-none" />

      <div className="max-w-md mx-auto px-4 relative z-20">

        {/* ── NOVO JUMBOTRON (REPLACE DO CARD ANTIGO) ── */}
        {jogo ? (
          <section className="mb-10">
            <JumbotronJogo 
              jogo={jogo} 
              mercadoFechado={mercadoFechado}
              stats={{
                ranking: ranking.map(u => ({ apelido: u.apelido || u.nome || 'Jogador', pontos: u.pontos_total })),
                participantes: ranking.length,
                posicao: 4, // Exemplo: Posição do Novorizontino na Série B
                mediaSofa: 7.2,
                golsSofridos: 5,
                mvp: { nome: 'Sander', media: 7.60 }
              }}
            />
          </section>
        ) : !isLoading && (
          <div className="mb-10 p-8 bg-zinc-900/30 rounded-3xl text-center border border-white/5">
            <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Aguardando Próxima Partida</p>
          </div>
        )}

        {/* ── DESTAQUES ── */}
        <DestaquesFifa />

        {/* ── RAIO-X TÁTICO (SOFASCORE) ── */}
        <section className="mt-20">
          <div className="flex flex-col items-center mb-6 text-center px-4">
            <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-cyan-400 mb-1">Tactical Radar</h2>
            <p className="text-xl font-black uppercase italic tracking-tighter text-white">Escalações em Tempo Real</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-[40px] overflow-hidden shadow-2xl border-4 border-zinc-900 relative h-[550px]">
            <iframe
              src={`https://widgets.sofascore.com/pt-BR/embed/lineups?id=${jogo?.id ?? 15526004}&widgetTheme=dark`}
              className="w-full h-full border-none"
              scrolling="no"
              loading="lazy"
              title="Tactical Lineups"
            />
          </div>
        </section>

        {/* ── RANKING ELITE ── */}
        <section className="mt-24">
          <div className="flex justify-between items-end mb-8 px-4">
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-purple-500 mb-1">Global Ranking</h2>
              <p className="text-2xl font-black uppercase italic tracking-tighter text-white">Top Performance</p>
            </div>
            <Link href="/tigre-fc/ranking" className="text-[10px] font-black text-gold uppercase border-b border-yellow-500/30 pb-1">
              Ver Todos
            </Link>
          </div>

          <div className="space-y-3">
            {ranking.slice(0, 5).map((u, i) => (
              <div
                key={u.id}
                onClick={() => setPerfilAberto(u.id)}
                className={`flex items-center p-4 cursor-pointer transition-all rounded-3xl border ${
                  i === 0 
                  ? 'bg-gradient-to-r from-[#F5C400] to-[#D4A200] border-none text-black scale-[1.02]' 
                  : 'bg-zinc-900/40 border-white/5 hover:border-white/10'
                }`}
              >
                <span className="w-8 text-center font-black italic opacity-50">{i + 1}</span>
                <img src={u.avatar_url || PATA_LOGO} className="w-10 h-10 rounded-xl object-cover mx-3 border border-black/10" alt="Avatar" />
                <div className="flex-1">
                  <p className="font-black uppercase italic text-sm truncate">{u.apelido || u.nome}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-xl leading-none">{u.pontos_total || 0}</p>
                  <p className="text-[8px] font-black opacity-50 uppercase">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CHAT VESTIÁRIO ── */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-6 px-4">
            <div>
              <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-red-500 mb-1">Locker Room</h2>
              <p className="text-xl font-black uppercase italic tracking-tighter text-white">Chat da Galera</p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[8px] font-black text-green-500 uppercase">Live</span>
            </div>
          </div>
          <div className="h-[500px] rounded-[40px] border border-white/5 overflow-hidden bg-black/40 shadow-inner">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>

      </div>

      {/* MODAL PERFIL */}
      {perfilAberto && (
        <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId} onClose={() => setPerfilAberto(null)} />
      )}

      <style jsx global>{`
        ::-webkit-scrollbar { width: 0px; }
        body { background-color: #050505; color: white; }
        :root { --gold: #F5C400; }
      `}</style>
    </main>
  );
}
