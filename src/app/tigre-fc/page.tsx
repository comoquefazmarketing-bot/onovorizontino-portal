// src/app/tigre-fc/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const FONT_FAMILY = "'Barlow Condensed', 'Barlow', system-ui, -apple-system, sans-serif";

// ════════════════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════════════════
type Jogo = {
  id?: number | null;
  rodada?: number | null;
  competicao?: string | null;
  mandante_slug?: string | null;
  visitante_slug?: string | null;
  placar_mandante?: number | null;
  placar_visitante?: number | null;
  finalizado?: boolean | null;
  data_jogo?: string | null;
};

type UserShape = { id: string; email?: string };

type Escalacao = {
  formacao: string;
  capitao_id: number | null;
  heroi_id: number | null;
  palpite_mandante: number;
  palpite_visitante: number;
};

type UsuarioRanking = {
  id: string;
  nome: string | null;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number | null;
};

// ════════════════════════════════════════════════════════════════════════════
// FALLBACK CONTRA TELA PRETA
// ════════════════════════════════════════════════════════════════════════════
const FALLBACK_JOGO: Jogo = {
  id: 12,
  rodada: 7,
  competicao: 'COPA SUL-SUDESTE',
  mandante_slug: 'avai',
  visitante_slug: 'novorizontino',
  placar_mandante: null,
  placar_visitante: null,
  finalizado: false,
  data_jogo: '2026-05-03T21:00:00+00:00',
};

// ════════════════════════════════════════════════════════════════════════════
// PLAYER NAMES
// ════════════════════════════════════════════════════════════════════════════
const PLAYER_NAMES: Record<number, string> = {
  23: 'JORDI', 1: 'CÉSAR', 22: 'SCAPIN', 62: 'LUCAS',
  8: 'PATRICK', 38: 'R. PALM', 34: 'BROCK', 66: 'ALVARÍÑO', 6: 'CARLINHOS', 3: 'DANTAS',
  9: 'SANDER', 28: 'MAYKON', 27: 'NILSON', 75: 'LORA',
  41: 'OYAMA', 46: 'MARLON', 40: 'NALDI',
  47: 'BIANQUI', 10: 'RÔMULO', 12: 'JUNINHO', 17: 'TAVINHO', 86: 'TITI ORTÍZ', 13: 'D. GALO',
  15: 'ROBSON', 59: 'V. PAIVA', 57: 'RONALD', 55: 'CARECA', 50: 'CARLÃO', 52: 'HÉLIO', 53: 'JARDIEL', 91: 'HECTOR',
};

// ════════════════════════════════════════════════════════════════════════════
// PÁGINA
// ════════════════════════════════════════════════════════════════════════════
export default function TigreFCPage() {
  const router = useRouter();

  const [user, setUser]                       = useState<UserShape | null>(null);
  const [meuId, setMeuId]                     = useState<string | null>(null);
  const [jogo, setJogo]                       = useState<Jogo>(FALLBACK_JOGO);
  const [escalacao, setEscalacao]             = useState<Escalacao | null>(null);
  const [ranking, setRanking]                 = useState<UsuarioRanking[]>([]);
  const [totalEscalacoes, setTotalEscalacoes] = useState(0);
  const [perfilAberto, setPerfilAberto]       = useState<string | null>(null);
  const [hydrating, setHydrating]             = useState(true);

  // ─── INSTANT RESET ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      // Sessão
      let authUser: { id: string; email?: string } | null = null;
      try {
        const { data: { user: u } } = await sb.auth.getUser();
        if (u) {
          authUser = { id: u.id, email: u.email ?? undefined };
          if (!cancelled) setUser(authUser);
          try {
            const { data: profile } = await sb
              .from('tigre_fc_usuarios').select('id').eq('google_id', u.id).maybeSingle();
            if (!cancelled && profile?.id) setMeuId(profile.id);
          } catch (err) { console.warn('[TigreFC] meuId:', err); }
        }
      } catch (err) { console.warn('[TigreFC] sessão:', err); }

      // Jogo
      let jogoAtivo: Jogo | null = null;
      try {
        const { data } = await sb
          .from('jogos')
          .select('id, rodada, competicao, mandante_slug, visitante_slug, placar_mandante, placar_visitante, finalizado')
          .eq('finalizado', false).order('rodada', { ascending: true }).limit(1);
        jogoAtivo = data?.[0] ?? null;
      } catch (err) { console.warn('[TigreFC] jogo:', err); }

      if (!cancelled && jogoAtivo) setJogo(jogoAtivo);
      const jogoIdEfetivo = (jogoAtivo ?? FALLBACK_JOGO).id ?? 0;

      // Contagem
      try {
        const { count } = await sb.from('tigre_fc_escalacoes')
          .select('id', { count: 'exact', head: true }).eq('jogo_id', jogoIdEfetivo);
        if (!cancelled) setTotalEscalacoes(count ?? 0);
      } catch (err) { console.warn('[TigreFC] contagem:', err); }

      // Escalação
      if (authUser && jogoIdEfetivo) {
        try {
          const { data } = await sb
            .from('tigre_fc_escalacoes')
            .select('formacao, capitao_id, heroi_id, palpite_mandante, palpite_visitante')
            .eq('user_id', authUser.id).eq('jogo_id', jogoIdEfetivo).maybeSingle();
          if (!cancelled) setEscalacao(data ?? null);
        } catch (err) { console.warn('[TigreFC] escalação:', err); }
      }

      // Ranking
      try {
        const { data } = await sb
          .from('tigre_fc_usuarios')
          .select('id, nome, apelido, avatar_url, pontos_total')
          .not('pontos_total', 'is', null)
          .order('pontos_total', { ascending: false }).limit(5);
        if (!cancelled && data) setRanking(data as UsuarioRanking[]);
      } catch (err) { console.warn('[TigreFC] ranking:', err); }

      if (!cancelled) setHydrating(false);
    };

    loadAll();
    return () => { cancelled = true; };
  }, []);

  const capitaoNome = escalacao?.capitao_id != null
    ? (PLAYER_NAMES[escalacao.capitao_id] ?? '---') : null;
  const heroiNome = escalacao?.heroi_id != null
    ? (PLAYER_NAMES[escalacao.heroi_id] ?? '---') : null;

  const handleEscalar = () => {
    const targetId = jogo.id ?? FALLBACK_JOGO.id ?? 12;
    router.push(`/tigre-fc/escalar/${targetId}`);
  };

  // ════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════
  return (
    <main
      className="min-h-screen bg-[#030303] text-white overflow-x-hidden"
      style={{ fontFamily: FONT_FAMILY }}
    >
      {/* BG decorativo (fixed, fora do flow) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,#F5C40012_0%,transparent_45%)]" />
      </div>

      <div className="relative z-10 flex flex-col">

        {/* ═══════════════════════════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════════════════════════ */}
        <header className="px-4 pt-8 pb-6 sm:pt-12 sm:pb-8 text-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
          <div className="inline-flex items-center gap-3 mt-4 px-4 py-1.5 bg-white/5 rounded-full border border-white/5 backdrop-blur-md">
            <span className="w-1.5 h-1.5 bg-[#00F3FF] rounded-full animate-pulse" style={{ boxShadow: '0 0 8px #00F3FF' }} />
            <span className="text-[10px] font-black tracking-[0.5em] text-[#00F3FF]">BROADCAST STATION</span>
            <span className="w-1.5 h-1.5 bg-[#00F3FF] rounded-full animate-pulse" style={{ boxShadow: '0 0 8px #00F3FF' }} />
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════
            DASHBOARD GRID — gap-6 fixo, ZERO margem negativa
        ═══════════════════════════════════════════════════════════════ */}
        <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ─── 1. JUMBOTRON (centro/topo, prioridade 1) ─── */}
          <section className="lg:col-span-8 lg:row-start-1">
            <JumbotronJogo
              jogo={jogo}
              formacao={escalacao?.formacao ?? null}
              capitaoNome={capitaoNome}
              heroiNome={heroiNome}
              palpiteMandante={escalacao?.palpite_mandante ?? null}
              palpiteVisitante={escalacao?.palpite_visitante ?? null}
              totalEscalacoes={totalEscalacoes}
              onEscalar={handleEscalar}
              loading={false}
            />
          </section>

          {/* ─── 2. DESTAQUES (lateral superior, story) ─── */}
          <aside className="lg:col-span-4 lg:row-start-1 lg:row-span-2">
            <DestaquesFifa />
          </aside>

          {/* ─── 3. CHAT (logo abaixo do placar, prioridade 3) ─── */}
          <section className="lg:col-span-8 lg:row-start-2">
            <div className="bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl h-[480px] sm:h-[600px] overflow-hidden">
              <TigreFCChat usuarioId={meuId} />
            </div>
          </section>

          {/* ─── 4. RANKING (lateral inferior, suporte) ─── */}
          <aside className="lg:col-span-12 lg:row-start-3">
            <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-3xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#F5C400] rounded-full" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">LIVE RANKING</h2>
                </div>
                <span className="text-[9px] tracking-widest text-zinc-600 font-bold">TOP 5</span>
              </div>
              {ranking.length === 0 ? (
                <p className="text-zinc-600 text-xs text-center py-4">Aguardando torcedores na disputa...</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {ranking.map((u, i) => {
                    const isFirst = i === 0;
                    const pts = u.pontos_total ?? 0;
                    return (
                      <button
                        key={u.id}
                        onClick={() => setPerfilAberto(u.id)}
                        className={`text-left p-3 rounded-2xl border transition-all hover:scale-[1.02] ${
                          isFirst
                            ? 'bg-gradient-to-br from-[#F5C400]/15 to-transparent border-[#F5C400]/40'
                            : 'bg-black/40 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-black italic ${isFirst ? 'text-[#F5C400]' : 'text-zinc-700'}`}>
                            #0{i + 1}
                          </span>
                          {isFirst && <span className="text-[10px]">👑</span>}
                        </div>
                        <p className="text-[11px] font-black uppercase truncate">
                          {u.apelido || u.nome || 'Torcedor'}
                        </p>
                        <p className={`text-lg font-black tabular-nums leading-none mt-1 ${isFirst ? 'text-[#F5C400]' : 'text-white'}`}>
                          {pts}
                        </p>
                        <p className="text-[7px] tracking-[2px] text-zinc-600 font-bold uppercase mt-0.5">PONTOS</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

        </div>

        {/* Aviso login (não-bloqueante) */}
        {!hydrating && !user && (
          <div className="max-w-md mx-auto w-full px-4 pb-10">
            <div className="bg-zinc-950 border border-yellow-400/20 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-2">🔐</div>
              <div className="text-sm font-black mb-1">Faça login pra escalar</div>
              <div className="text-zinc-400 text-xs">
                Entre com sua conta pra montar seu time e disputar o ranking.
              </div>
            </div>
          </div>
        )}

        <footer className="border-t border-white/5 py-6 text-center bg-black/40">
          <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.6em]">TIGRE FC DIGITAL</p>
        </footer>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');

        html { scroll-behavior: auto; }
        body {
          background-color: #030303;
          color: white;
          font-family: 'Barlow Condensed', sans-serif !important;
          margin: 0;
          overflow-x: hidden;
        }
        ::-webkit-scrollbar { width: 0; display: none; }
      `}</style>
    </main>
  );
}
