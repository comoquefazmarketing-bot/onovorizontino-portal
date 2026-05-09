'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase as sb } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';
import TeamCard3D from '@/components/tigre-fc/TeamCard3D';
import HeroParallax3D from '@/components/tigre-fc/HeroParallax3D';

const GOLD = '#F5C400';
const CYAN = '#00F3FF';
const FONT = "'Barlow Condensed', system-ui, sans-serif";
const PATA = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

type Jogo = {
  id?: number | null;
  rodada?: number | null;
  competicao?: string | null;
  mandante_slug?: string | null;
  visitante_slug?: string | null;
  mandante?: any;
  visitante?: any;
  placar_mandante?: number | null;
  placar_visitante?: number | null;
  finalizado?: boolean | null;
  data_jogo?: string | null;
  data_hora?: string | null;
  local?: string | null;
  transmissao?: string | null;
};

type UsuarioRanking = {
  id: string;
  nome: string | null;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number | null;
};

const PLAYER_NAMES: Record<number, string> = {
  23:'JORDI', 1:'CÉSAR', 22:'SCAPIN', 62:'LUCAS',
  8:'PATRICK', 38:'R.PALM', 34:'BROCK', 66:'ALVARÍÑO', 6:'CARLINHOS', 3:'DANTAS',
  9:'SANDER', 28:'MAYKON', 27:'NILSON', 75:'LORA',
  41:'OYAMA', 46:'MARLON', 40:'NALDI',
  47:'BIANQUI', 10:'RÔMULO', 12:'JUNINHO', 17:'TAVINHO', 86:'TITI ORTÍZ', 13:'D.GALO',
  15:'ROBSON', 59:'V.PAIVA', 57:'RONALD', 55:'CARECA', 50:'CARLÃO', 52:'HÉLIO', 53:'JARDIEL',
};

const FALLBACK_JOGO: Jogo = {
  id: 13, rodada: 8, competicao: 'Série B 2026',
  mandante_slug: 'novorizontino', visitante_slug: 'botafogo-sp',
  mandante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png', sigla: 'NOV' },
  visitante: { nome: 'Botafogo-SP', escudo_url: 'https://logodownload.org/wp-content/uploads/2017/02/botafogo-sp-logo-escudo.png', sigla: 'BOT-SP' },
  finalizado: false, data_hora: '2026-05-11T22:00:00+00:00',
};

export default function TigreFCPage() {
  const router = useRouter();
  const [user,            setUser]            = useState<any>(null);
  const [meuPerfil,       setMeuPerfil]       = useState<any>(null); // perfil completo do usuário
  const [meuId,           setMeuId]           = useState<string | null>(null);
  const [jogo,            setJogo]            = useState<Jogo>(FALLBACK_JOGO);
  const [escalacao,       setEscalacao]       = useState<any>(null);
  const [ranking,         setRanking]         = useState<UsuarioRanking[]>([]);
  const [totalEscalacoes, setTotalEscalacoes] = useState(0);
  const [perfilAberto,    setPerfilAberto]    = useState<string | null>(null);
  const [hydrating,       setHydrating]       = useState(true);

  // Scroll lock
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      // Auth
      try {
        const { data: { user: u } } = await sb.auth.getUser();
        if (u) {
          if (!cancelled) setUser({ id: u.id, email: u.email });
          const { data: profile } = await sb.from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .eq('google_id', u.id).maybeSingle();
          if (!cancelled && profile?.id) {
            setMeuId(profile.id);
            setMeuPerfil(profile);
          }
        }
      } catch {}

      // Jogo ativo via API (resolve escudos do banco)
      try {
        const res  = await fetch('/api/proximo-jogo');
        const json = await res.json();
        if (!cancelled && json?.jogos?.[0]) setJogo(json.jogos[0]);
      } catch {}

      // Jogo ID efetivo após load
      const jogoId = (await (async () => {
        try {
          const r = await fetch('/api/proximo-jogo');
          const j = await r.json();
          return j?.jogos?.[0]?.id ?? FALLBACK_JOGO.id ?? 13;
        } catch { return FALLBACK_JOGO.id ?? 13; }
      })());

      // Total escalações
      try {
        const { count } = await sb.from('tigre_fc_escalacoes').select('id', { count:'exact', head:true }).eq('jogo_id', jogoId);
        if (!cancelled) setTotalEscalacoes(count ?? 0);
      } catch {}

      // Minha escalação
      try {
        const { data: { user: u2 } } = await sb.auth.getUser();
        if (u2 && jogoId) {
          const { data } = await sb.from('tigre_fc_escalacoes')
            .select('formacao, capitao_id, heroi_id, palpite_mandante, palpite_visitante')
            .eq('user_id', u2.id).eq('jogo_id', jogoId).maybeSingle();
          if (!cancelled) setEscalacao(data ?? null);
        }
      } catch {}

      // Ranking top 5
      try {
        const { data } = await sb.from('tigre_fc_usuarios')
          .select('id, nome, apelido, avatar_url, pontos_total')
          .not('pontos_total', 'is', null)
          .order('pontos_total', { ascending: false }).limit(5);
        if (!cancelled && data) setRanking(data as UsuarioRanking[]);
      } catch {}

      if (!cancelled) setHydrating(false);
    }
    loadAll();
    return () => { cancelled = true; };
  }, []);

  const capitaoNome = escalacao?.capitao_id != null ? (PLAYER_NAMES[escalacao.capitao_id] ?? null) : null;
  const heroiNome   = escalacao?.heroi_id   != null ? (PLAYER_NAMES[escalacao.heroi_id]   ?? null) : null;
  const handleEscalar = () => router.push(`/tigre-fc/escalar/${jogo.id ?? 13}`);

  return (
    <main className="min-h-screen pb-24 overflow-x-hidden"
      style={{ background: 'radial-gradient(ellipse at top, #0c0c0c 0%, #030303 60%)', fontFamily: FONT, color: '#fff' }}>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');
        html,body { background:#030303!important; overflow-x:hidden; }
        ::-webkit-scrollbar { width:0; display:none; }
      `}</style>

      {/* ══ HEADER ══ */}
      <header className="relative px-4 pt-8 pb-2 overflow-hidden">
        <div className="relative max-w-4xl mx-auto">
          {/* Logo + título + ranking */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <img src={PATA} alt="" className="w-8 h-8 drop-shadow-[0_0_12px_rgba(245,196,0,0.4)]" />
              <div>
                <h1 className="text-4xl sm:text-5xl font-black italic uppercase leading-none"
                  style={{ background:'linear-gradient(180deg, #fff 0%, #888 100%)',
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  TIGRE <span style={{ color: GOLD, WebkitTextFillColor: GOLD }}>FC</span>
                </h1>
                <div className="text-[8px] font-black tracking-[4px] text-zinc-600 uppercase mt-0.5">
                  Broadcast Station
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {escalacao && (
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl"
                  style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)' }}>
                  <span className="text-[9px]">✓</span>
                  <span className="text-[9px] font-black tracking-wider text-emerald-400">ESCALADO</span>
                </div>
              )}
              <a href="/tigre-fc/ranking"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:scale-105"
                style={{ background:'rgba(245,196,0,0.1)', border:`1px solid rgba(245,196,0,0.25)` }}>
                <span className="text-sm">🏆</span>
                <span className="text-[10px] font-black tracking-wider uppercase" style={{ color: GOLD }}>Ranking</span>
              </a>
            </div>
          </div>
          <div className="mt-1 h-px" style={{ background:`linear-gradient(90deg, ${GOLD}50, transparent)` }} />
        </div>
      </header>

      {/* ══ HERO PARALLAX 3D ══ */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 mt-2 mb-0">
        <HeroParallax3D
          rodada={jogo.rodada}
          totalEscalacoes={totalEscalacoes}
          ranking={ranking.length}
        />
      </div>

      {/* ══ GRID PRINCIPAL ══ */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 space-y-4">

        {/* ── Jumbotron (full width) ── */}
        <section>
          <div className="relative rounded-3xl overflow-hidden"
            style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
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

        {/* ── Card 3D "Meu Time" — aparece quando usuário escalou ── */}
        {escalacao && jogo.mandante && jogo.visitante && (
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: GOLD }} />
              <span className="text-[9px] font-black tracking-[4px] uppercase" style={{ color: GOLD }}>Meu Time</span>
              <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg, ${GOLD}40, transparent)` }} />
              <button onClick={handleEscalar}
                className="text-[8px] font-black tracking-wider uppercase hover:opacity-80 transition-opacity"
                style={{ color: GOLD, background: 'none', border: 'none', cursor: 'pointer' }}>
                EDITAR →
              </button>
            </div>
            <TeamCard3D
              formacao={escalacao.formacao ?? '4-4-2'}
              capitaoNome={capitaoNome}
              heroiNome={heroiNome}
              palpiteMandante={escalacao.palpite_mandante ?? null}
              palpiteVisitante={escalacao.palpite_visitante ?? null}
              mandante={jogo.mandante}
              visitante={jogo.visitante}
              nomeUsuario={meuPerfil?.apelido ?? meuPerfil?.nome ?? user?.email?.split('@')[0] ?? 'Torcedor'}
              avatarUrl={meuPerfil?.avatar_url ?? null}
              pontos={meuPerfil?.pontos_total ?? null}
              rodada={jogo.rodada}
              onClick={handleEscalar}
            />
          </section>
        )}

        {/* ── Grid md: Spotlight + mini ranking lado a lado ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Spotlight (stories) */}
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: GOLD }} />
              <span className="text-[9px] font-black tracking-[4px] uppercase" style={{ color: GOLD }}>Spotlight</span>
              <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg, ${GOLD}40, transparent)` }} />
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.05)' }}>
              <DestaquesFifa />
            </div>
          </section>

          {/* Mini ranking top 5 */}
          <section>
            <div className="flex items-center gap-2 mb-2 px-1">
              <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background:'#fff' }} />
              <span className="text-[9px] font-black tracking-[4px] uppercase text-white/70">Top Performers</span>
              <div className="flex-1 h-px bg-white/10" />
              <a href="/tigre-fc/ranking"
                className="text-[8px] font-black tracking-wider uppercase hover:opacity-80 transition-opacity"
                style={{ color: GOLD }}>
                VER TUDO →
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden space-y-1"
              style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', padding:'10px' }}>
              {ranking.length === 0 ? (
                <p className="text-zinc-600 text-xs text-center py-4 font-bold">Aguardando torcedores...</p>
              ) : (
                ranking.map((u, i) => {
                  const isFirst = i === 0;
                  const isMe    = u.id === meuId;
                  const pts     = u.pontos_total ?? 0;
                  // Depth-of-field: 1º lugar mais próximo/saturado, demais se afastam
                  const depthScale   = isFirst ? 1 : 1 - i * 0.018;
                  const depthOpacity = isFirst ? 1 : 0.95 - i * 0.08;
                  const depthBlur    = isFirst ? 0 : i * 0.3; // px de blur acumulado
                  return (
                    <motion.button key={u.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: depthOpacity, x: 0, scale: depthScale }}
                      transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
                      whileHover={{ scale: depthScale * 1.02, opacity: 1, filter: 'none' }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setPerfilAberto(u.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left origin-left"
                      style={{
                        background: isFirst
                          ? 'linear-gradient(90deg, rgba(245,196,0,0.1) 0%, rgba(245,196,0,0.04) 100%)'
                          : isMe ? 'rgba(245,196,0,0.06)' : 'rgba(255,255,255,0.025)',
                        border: isFirst
                          ? `1px solid rgba(245,196,0,0.35)`
                          : isMe ? `1px solid rgba(245,196,0,0.2)` : '1px solid rgba(255,255,255,0.04)',
                        filter: depthBlur > 0 ? `blur(${depthBlur}px)` : 'none',
                        boxShadow: isFirst ? `0 0 20px rgba(245,196,0,0.08)` : 'none',
                        transition: 'box-shadow 0.2s, border-color 0.2s',
                      }}>
                      {/* Rank com medalha */}
                      <span className="text-[10px] font-black italic w-6 text-center flex-shrink-0"
                        style={{ color: i === 0 ? GOLD : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'rgba(255,255,255,0.25)' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                      </span>
                      {/* Avatar */}
                      <div className="flex-shrink-0" style={{
                        width: isFirst ? 30 : 26, height: isFirst ? 30 : 26,
                        borderRadius: '50%', overflow: 'hidden',
                        border: `1.5px solid ${isFirst ? GOLD + '80' : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: isFirst ? `0 0 10px ${GOLD}30` : 'none',
                        transition: 'width 0.2s, height 0.2s',
                      }}>
                        <img src={u.avatar_url ?? PATA} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}
                          onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }} />
                      </div>
                      {/* Nome */}
                      <span className="flex-1 font-black uppercase truncate"
                        style={{
                          color: isMe ? GOLD : isFirst ? '#fff' : 'rgba(255,255,255,0.65)',
                          fontSize: isFirst ? 13 : 11,
                          letterSpacing: isFirst ? -0.3 : 0,
                        }}>
                        {u.apelido ?? u.nome ?? 'Torcedor'}
                      </span>
                      {/* Pts */}
                      <span className="font-black italic tabular-nums flex-shrink-0"
                        style={{
                          color: isFirst ? GOLD : 'rgba(255,255,255,0.7)',
                          fontSize: isFirst ? 18 : 14,
                          textShadow: isFirst ? `0 0 12px ${GOLD}50` : 'none',
                        }}>
                        {pts}
                      </span>
                    </motion.button>
                  );
                })
              )}
              <a href="/tigre-fc/ranking"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl w-full mt-1 transition-all hover:opacity-80"
                style={{ background:`rgba(245,196,0,0.08)`, border:`1px solid rgba(245,196,0,0.2)` }}>
                <span className="text-[10px] font-black tracking-[3px] uppercase" style={{ color: GOLD }}>
                  VER RANKING COMPLETO →
                </span>
              </a>
            </div>
          </section>
        </div>

        {/* ── Chat: compacto ── */}
        <section>
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-1.5 h-1.5 rotate-45 flex-shrink-0" style={{ background: CYAN }} />
            <span className="text-[9px] font-black tracking-[4px] uppercase" style={{ color: CYAN }}>Vestiário</span>
            <div className="flex-1 h-px" style={{ background:`linear-gradient(90deg, ${CYAN}40, transparent)` }} />
            <a href="/tigre-fc/chat"
              className="text-[8px] font-black tracking-wider uppercase hover:opacity-80 transition-opacity"
              style={{ color: CYAN }}>
              ABRIR →
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden h-[200px] sm:h-[240px]"
            style={{
              background:'rgba(0,0,0,0.6)', backdropFilter:'blur(20px)',
              border:'1px solid rgba(255,255,255,0.05)',
              boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}>
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>

      </div>

      {/* Aviso login */}
      <AnimatePresence>
        {!hydrating && !user && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
            <div className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background:'linear-gradient(135deg, rgba(245,196,0,0.12), rgba(0,0,0,0.9))',
                border:`1px solid rgba(245,196,0,0.3)`, backdropFilter:'blur(20px)' }}>
              <span className="text-2xl flex-shrink-0">🔐</span>
              <div className="flex-1">
                <div className="text-sm font-black text-white">Faça login pra escalar</div>
                <div className="text-[10px] text-zinc-400 font-bold mt-0.5">Entre e dispute o ranking 🏆</div>
              </div>
              <a href="/tigre-fc/perfil"
                className="px-3 py-2 rounded-xl text-[10px] font-black tracking-wider uppercase flex-shrink-0"
                style={{ background: GOLD, color:'#000' }}>
                ENTRAR
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal perfil */}
      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico
            targetUsuarioId={perfilAberto}
            viewerUsuarioId={meuId}
            onClose={() => setPerfilAberto(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
