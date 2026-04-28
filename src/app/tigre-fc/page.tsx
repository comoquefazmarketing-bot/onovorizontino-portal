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

  // ════════════════════════════════════════════════════════════════════
  // SCROLL LOCK BRUTAL — força topo nos primeiros 800ms, sem exceção
  // ════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Limpa hash da URL (#alguma-coisa força scroll automático do browser)
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    // 2. Desativa scroll restoration nativo do browser (volta da nav)
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // 3. Trava overflow no html e body por 600ms (impede QUALQUER scroll programático)
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    // 4. Força topo agora E em loop nos próximos 800ms
    //    (cobre re-renders, useEffects de filhos, scrollIntoView do chat)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    let count = 0;
    const interval = setInterval(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      count++;
      if (count >= 16) clearInterval(interval); // 16 × 50ms = 800ms
    }, 50);

    // 5. Libera o scroll após 600ms — agora o user pode rolar normalmente
    const releaseTimer = setTimeout(() => {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    }, 600);

    return () => {
      clearInterval(interval);
      clearTimeout(releaseTimer);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
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
          } catch (err) { console.warn('[TigreFC]', err); }
        }
      } catch (err) { console.warn('[TigreFC]', err); }

      let jogoAtivo: Jogo | null = null;
      try {
        const { data } = await sb
          .from('jogos')
          .select('id, rodada, competicao, mandante_slug, visitante_slug, placar_mandante, placar_visitante, finalizado')
          .eq('finalizado', false).order('rodada', { ascending: true }).limit(1);
        jogoAtivo = data?.[0] ?? null;
      } catch (err) { console.warn('[TigreFC]', err); }

      if (!cancelled && jogoAtivo) setJogo(jogoAtivo);
      const jogoIdEfetivo = (jogoAtivo ?? FALLBACK_JOGO).id ?? 0;

      try {
        const { count } = await sb.from('tigre_fc_escalacoes')
          .select('id', { count: 'exact', head: true }).eq('jogo_id', jogoIdEfetivo);
        if (!cancelled) setTotalEscalacoes(count ?? 0);
      } catch (err) { console.warn('[TigreFC]', err); }

      if (authUser && jogoIdEfetivo) {
        try {
          const { data } = await sb
            .from('tigre_fc_escalacoes')
            .select('formacao, capitao_id, heroi_id, palpite_mandante, palpite_visitante')
            .eq('user_id', authUser.id).eq('jogo_id', jogoIdEfetivo).maybeSingle();
          if (!cancelled) setEscalacao(data ?? null);
        } catch (err) { console.warn('[TigreFC]', err); }
      }

      try {
        const { data } = await sb
          .from('tigre_fc_usuarios')
          .select('id, nome, apelido, avatar_url, pontos_total')
          .not('pontos_total', 'is', null)
          .order('pontos_total', { ascending: false }).limit(5);
        if (!cancelled && data) setRanking(data as UsuarioRanking[]);
      } catch (err) { console.warn('[TigreFC]', err); }

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
  // RENDER FIFA 26 ULTIMATE TEAM HOME STYLE
  // ════════════════════════════════════════════════════════════════════
  return (
    <main
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        fontFamily: FONT_FAMILY,
        background: 'radial-gradient(ellipse at top, #0a0a0a 0%, #030303 50%, #000 100%)',
      }}
    >
      {/* ════════════════════════════════════════════════════════════════
          HERO TOPO — gigante, com brilho FIFA. Sem -mt, padding constante
      ════════════════════════════════════════════════════════════════ */}
      <header className="relative pt-10 pb-6 sm:pt-14 sm:pb-8 px-4 text-center overflow-hidden">
        {/* Light beams animados */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-30"
            style={{
              background: 'radial-gradient(ellipse, #F5C40040 0%, transparent 60%)',
              filter: 'blur(40px)',
            }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full"
            style={{ background: 'linear-gradient(180deg, #F5C40080, transparent)' }} />
        </div>

        <div className="relative z-10">
          {/* Tag superior */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F5C400]/10 border border-[#F5C400]/30 mb-3">
            <span className="w-1.5 h-1.5 bg-[#F5C400] rounded-full animate-pulse" />
            <span className="text-[9px] font-black tracking-[4px] text-[#F5C400]">ULTIMATE EXPERIENCE</span>
          </div>

          {/* Title gigante */}
          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85]"
            style={{
              background: 'linear-gradient(180deg, #fff 0%, #888 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 4px 20px rgba(245,196,0,0.2))',
            }}
          >
            TIGRE <span style={{ color: '#F5C400', WebkitTextFillColor: '#F5C400' }}>FC</span>
          </h1>

          {/* Subtitle */}
          <div className="mt-3 text-[10px] sm:text-xs font-black tracking-[6px] sm:tracking-[8px] text-zinc-500 uppercase">
            Broadcast Station <span className="text-[#00F3FF]">·</span> Rádio Vox
          </div>

          {/* Stats inline tipo HUD FIFA */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mt-5 text-[10px] sm:text-xs">
            <div>
              <div className="text-[#F5C400] font-black tabular-nums text-base sm:text-lg leading-none">
                {totalEscalacoes.toLocaleString('pt-BR')}
              </div>
              <div className="text-zinc-600 tracking-[2px] font-bold mt-0.5">ESCALADOS</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-[#00F3FF] font-black tabular-nums text-base sm:text-lg leading-none">
                R{jogo.rodada ?? '?'}
              </div>
              <div className="text-zinc-600 tracking-[2px] font-bold mt-0.5">RODADA</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <div className="text-white font-black tabular-nums text-base sm:text-lg leading-none">
                {ranking.length}
              </div>
              <div className="text-zinc-600 tracking-[2px] font-bold mt-0.5">NO RANKING</div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
          DASHBOARD GRID — FIFA 26 Ultimate Team home style
      ═══════════════════════════════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto w-full px-3 sm:px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">

        {/* ═══ JUMBOTRON — protagonista absoluto ═══ */}
        <section className="lg:col-span-8 lg:row-start-1 relative">
          <div className="absolute -inset-px rounded-3xl pointer-events-none opacity-50"
            style={{ background: 'linear-gradient(135deg, #F5C40060, transparent 30%, transparent 70%, #00F3FF40)' }} />
          <div className="relative">
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
          </div>
        </section>

        {/* ═══ DESTAQUES STORY — coluna lateral toda ═══ */}
        <aside className="lg:col-span-4 lg:row-start-1 lg:row-span-2">
          <div className="relative">
            {/* Tab header tipo FIFA */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="h-2 w-2 rotate-45 bg-[#F5C400]" />
              <span className="text-[10px] font-black tracking-[4px] text-[#F5C400] uppercase italic">
                Spotlight
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-[#F5C400]/40 to-transparent" />
            </div>
            <DestaquesFifa />
          </div>
        </aside>

        {/* ═══ CHAT — base do placar ═══ */}
        <section className="lg:col-span-8 lg:row-start-2">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-2 w-2 rotate-45 bg-[#00F3FF]" />
            <span className="text-[10px] font-black tracking-[4px] text-[#00F3FF] uppercase italic">
              Live Chat · Vestiário
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[#00F3FF]/40 to-transparent" />
          </div>
          <div className="relative rounded-3xl overflow-hidden h-[480px] sm:h-[560px]"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(10,10,10,0.4) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.4)',
            }}>
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>

        {/* ═══ RANKING — barra horizontal FIFA leaderboard ═══ */}
        <section className="lg:col-span-12 lg:row-start-3">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="h-2 w-2 rotate-45 bg-white" />
            <span className="text-[10px] font-black tracking-[4px] text-white uppercase italic">
              Top Performers · Live Leaderboard
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-white/40 to-transparent" />
          </div>
          <div className="rounded-3xl p-4 sm:p-5"
            style={{
              background: 'linear-gradient(135deg, rgba(20,20,20,0.6) 0%, rgba(10,10,10,0.4) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
            {ranking.length === 0 ? (
              <p className="text-zinc-600 text-xs text-center py-6">Aguardando torcedores na disputa...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ranking.map((u, i) => {
                  const isFirst = i === 0;
                  const pts = u.pontos_total ?? 0;
                  return (
                    <button
                      key={u.id}
                      onClick={() => setPerfilAberto(u.id)}
                      className="relative text-left p-3 rounded-2xl transition-all hover:scale-[1.03] hover:-translate-y-0.5 group"
                      style={{
                        background: isFirst
                          ? 'linear-gradient(135deg, rgba(245,196,0,0.18) 0%, rgba(245,196,0,0.04) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                        border: isFirst ? '1px solid rgba(245,196,0,0.4)' : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      {isFirst && (
                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center"
                          style={{ background: '#F5C400', boxShadow: '0 0 15px rgba(245,196,0,0.6)' }}>
                          <span className="text-sm">👑</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black italic ${isFirst ? 'text-[#F5C400]' : 'text-zinc-700'}`}>
                          #0{i + 1}
                        </span>
                        {u.avatar_url && (
                          <img src={u.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover border border-white/10" />
                        )}
                      </div>
                      <p className="text-[11px] font-black uppercase truncate group-hover:text-[#F5C400] transition-colors">
                        {u.apelido || u.nome || 'Torcedor'}
                      </p>
                      <p className={`text-2xl font-black tabular-nums leading-none mt-1 italic ${isFirst ? 'text-[#F5C400]' : 'text-white'}`}>
                        {pts}
                      </p>
                      <p className="text-[7px] tracking-[2px] text-zinc-700 font-bold uppercase mt-0.5">PONTOS</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Aviso login */}
      {!hydrating && !user && (
        <div className="max-w-md mx-auto w-full px-4 pb-10">
          <div className="relative rounded-2xl p-4 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(245,196,0,0.08) 0%, rgba(0,0,0,0.6) 100%)',
              border: '1px solid rgba(245,196,0,0.25)',
            }}>
            <div className="text-2xl mb-2">🔐</div>
            <div className="text-sm font-black mb-1">Faça login pra escalar</div>
            <div className="text-zinc-400 text-xs">Entre pra disputar o ranking 🏆</div>
          </div>
        </div>
      )}

      <footer className="border-t border-white/5 py-6 text-center bg-black/40">
        <p className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.6em]">TIGRE FC DIGITAL · EA-STYLE</p>
      </footer>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');

        html, body {
          scroll-behavior: auto !important;
          margin: 0;
          padding: 0;
          background-color: #030303;
          color: white;
          font-family: 'Barlow Condensed', sans-serif !important;
          overflow-x: hidden;
        }

        /* Anchor jump kill — mata qualquer #id de scroll automático */
        :target { scroll-margin-top: 0 !important; }

        ::-webkit-scrollbar { width: 0; display: none; }

        /* Garante que nada use scrollIntoView({ behavior: 'smooth' }) */
        * { scroll-behavior: auto !important; }
      `}</style>
    </main>
  );
}
