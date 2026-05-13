'use client';

import { useState, useEffect, use } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

const FALLBACK_JOGO = {
  id: 14,
  data_hora: '2026-05-16T23:30:00+00:00',
  competicao: 'Série B 2026',
  rodada: '9',
  local: 'Arena Pantanal — Cuiabá, MT',
  transmissao: 'ESPN · Disney+',
  mandante_slug: 'cuiaba',
  visitante_slug: 'novorizontino',
  mandante:  { nome: 'Cuiabá',        escudo_url: 'https://logodownload.org/wp-content/uploads/2017/02/cuiaba-logo-escudo.png',        sigla: 'CUI' },
  visitante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png', sigla: 'NOV' },
  ativo: true,
  finalizado: false,
};

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);
  const [mounted, setMounted]           = useState(false);
  const [jogo, setJogo]                 = useState<any>(null);
  const [ranking, setRanking]           = useState<any[]>([]);
  const [meuId, setMeuId]               = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [mercadoFechado, setMercadoFechado] = useState(false);
  const [sofaEventId, setSofaEventId]   = useState<number | null>(null);

  // escalação do usuário logado para o jogo atual
  const [formacao, setFormacao]               = useState<string | null>(null);
  const [capitaoNome, setCapitaoNome]         = useState<string | null>(null);
  const [heroiNome, setHeroiNome]             = useState<string | null>(null);
  const [palpiteMandante, setPalpiteMandante] = useState<number | null>(null);
  const [palpiteVisitante, setPalpiteVisitante] = useState<number | null>(null);
  const [totalEscalacoes, setTotalEscalacoes] = useState(0);
  const [minhaPos, setMinhaPos]               = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      // ── sessão ──────────────────────────────────────────────────────────────
      const { data: { session } } = await sb.auth.getSession();
      let usuarioId: string | null = null;
      let googleId:  string | null = null;
      if (session?.user?.id) {
        googleId = session.user.id;
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', googleId).maybeSingle();
        if (u) { usuarioId = u.id; setMeuId(u.id); }
      }

      // ── próximo jogo ────────────────────────────────────────────────────────
      const resJogo = await fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null);
      const jogoAtual = resJogo?.jogos?.[0] ?? FALLBACK_JOGO;
      setJogo(jogoAtual);

      // ── total de escalações para este jogo ──────────────────────────────────
      if (jogoAtual?.id) {
        const { count } = await sb
          .from('tigre_fc_escalacoes')
          .select('id', { count: 'exact', head: true })
          .eq('jogo_id', jogoAtual.id);
        setTotalEscalacoes(count ?? 0);
      }

      // ── escalação do usuário logado ─────────────────────────────────────────
      if (usuarioId && jogoAtual?.id) {
        const { data: esc } = await sb
          .from('tigre_fc_escalacoes')
          .select('formacao, capitao_id, heroi_id, palpite_tigre, palpite_adv')
          .eq('usuario_id', usuarioId)
          .eq('jogo_id', jogoAtual.id)
          .maybeSingle();

        if (esc) {
          setFormacao(esc.formacao ?? null);

          // Resolve nomes de capitão e herói
          const ids = [esc.capitao_id, esc.heroi_id].filter(Boolean);
          if (ids.length > 0) {
            const { data: jogadores } = await sb
              .from('tigre_fc_jogadores')
              .select('id, apelido, nome')
              .in('id', ids);
            const byId = Object.fromEntries((jogadores ?? []).map((j: any) => [j.id, j.apelido || j.nome]));
            setCapitaoNome(byId[esc.capitao_id] ?? null);
            setHeroiNome(byId[esc.heroi_id]     ?? null);
          }

          // palpite_tigre = Novorizontino, palpite_adv = adversário
          const isNovMand = jogoAtual.mandante_slug === 'novorizontino';
          setPalpiteMandante(isNovMand ? esc.palpite_tigre : esc.palpite_adv);
          setPalpiteVisitante(isNovMand ? esc.palpite_adv  : esc.palpite_tigre);
        }
      }

      // ── SofaScore widget ────────────────────────────────────────────────────
      fetch('/api/tigre-fc/sofascore-proximo-jogo')
        .then(r => r.json())
        .then(d => { if (d?.eventId) setSofaEventId(d.eventId); })
        .catch(() => {});

      // ── ranking geral ───────────────────────────────────────────────────────
      const { data: resRank } = await sb
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);
      if (resRank) {
        setRanking(resRank);
        if (usuarioId) {
          const pos = resRank.findIndex((u: any) => u.id === usuarioId);
          setMinhaPos(pos >= 0 ? pos + 1 : null);
        }
      }
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
          <p className="text-[10px] font-black tracking-[4px] uppercase mt-2" style={{ color: '#00F3FF', opacity: 0.7 }}>
            BROADCAST STATION
          </p>
          {jogo && (
            <div className="flex items-center justify-center gap-6 mt-5 text-center">
              <div>
                <p className="text-2xl font-black text-[#F5C400] leading-none">{totalEscalacoes}</p>
                <p className="text-[9px] font-black tracking-[2px] text-zinc-500 uppercase mt-0.5">ESCALADOS</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-black text-white leading-none">R{jogo.rodada}</p>
                <p className="text-[9px] font-black tracking-[2px] text-zinc-500 uppercase mt-0.5">RODADA</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <p className="text-2xl font-black text-[#F5C400] leading-none">{minhaPos ? `#${minhaPos}` : '—'}</p>
                <p className="text-[9px] font-black tracking-[2px] text-zinc-500 uppercase mt-0.5">NO RANKING</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-10">

        {jogo && (
          <JumbotronJogo
            jogo={jogo}
            formacao={formacao}
            capitaoNome={capitaoNome}
            heroiNome={heroiNome}
            palpiteMandante={palpiteMandante}
            palpiteVisitante={palpiteVisitante}
            totalEscalacoes={totalEscalacoes}
            mercadoFechado={mercadoFechado}
          />
        )}

        {sofaEventId && (
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black italic uppercase text-yellow-500 tracking-tight shadow-text">Quadro Tático (SofaScore)</h3>
            </div>
            <div className="rounded-[32px] overflow-hidden border border-white/10 bg-black shadow-2xl">
              <iframe
                id={`sofa-lineups-embed-${sofaEventId}`}
                src={`https://widgets.sofascore.com/pt-BR/embed/lineups?id=${sofaEventId}&widgetTheme=dark`}
                className="w-full h-[600px] md:h-[786px]"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </section>
        )}

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
