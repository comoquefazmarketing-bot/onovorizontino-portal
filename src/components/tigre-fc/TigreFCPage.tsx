'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── UTILITÁRIO: parse de data sem ambiguidade de fuso ────────────────────────
// Garante que '2026-04-12 21:00:00+00' e '2026-04-12T21:00:00Z'
// e '2026-04-12T18:00:00' (sem tz) sejam todos tratados corretamente.
function parseGameTime(raw: string): number {
  if (!raw) return 0;
  // Se vier com espaço (Postgres format), converte para ISO
  const iso = raw.includes(' ') && !raw.includes('T')
    ? raw.replace(' ', 'T')
    : raw;
  // Se não tiver indicador de fuso, assume UTC-3 (horário de Brasília)
  // adicionando -03:00 para evitar interpretação como UTC
  const withTz = /[Z+\-]\d{2}:?\d{2}$/.test(iso) || iso.endsWith('Z')
    ? iso
    : iso + '-03:00';
  return new Date(withTz).getTime();
}

// ─── TIMER BLOCK ──────────────────────────────────────────────────────────────
function TimerBlock({ value, label, highlight = false }: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`
          relative w-[72px] h-[80px] flex items-center justify-center
          bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]
          rounded-2xl overflow-hidden
          transition-all duration-300
          ${highlight
            ? 'border border-[#F5C400]/60 shadow-[0_0_20px_rgba(245,196,0,0.35)]'
            : 'border border-white/8'}
        `}
      >
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.12)_2px,rgba(0,0,0,0.12)_4px)] pointer-events-none" />
        {/* Reflexo topo */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/10" />

        <span
          className={`
            relative z-10 text-4xl font-black font-mono tracking-tighter tabular-nums leading-none
            ${highlight
              ? 'text-[#F5C400] drop-shadow-[0_0_14px_rgba(245,196,0,0.7)]'
              : 'text-white'}
          `}
        >
          {value}
        </span>
      </div>
      <span
        className={`
          text-[9px] font-black uppercase tracking-[0.25em]
          ${highlight ? 'text-[#F5C400]' : 'text-zinc-600'}
        `}
      >
        {label}
      </span>
    </div>
  );
}

// ─── SEPARADOR PULSANTE ───────────────────────────────────────────────────────
function TimerSep() {
  return (
    <div className="flex flex-col items-center gap-[10px] mb-5 shrink-0">
      <div className="w-1.5 h-1.5 rounded-full bg-[#F5C400]/40 animate-pulse" />
      <div className="w-1.5 h-1.5 rounded-full bg-[#F5C400]/40 animate-pulse [animation-delay:0.3s]" />
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  use(params);

  const [mounted,       setMounted]       = useState(false);
  const [jogo,          setJogo]          = useState<any>(null);
  const [ranking,       setRanking]       = useState<any[]>([]);
  const [meuId,         setMeuId]         = useState<string | null>(null);
  const [perfilAberto,  setPerfilAberto]  = useState<string | null>(null);
  const [timeLeft,      setTimeLeft]      = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  // ── Carrega dados ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    async function init() {
      // Sessão
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb
          .from('tigre_fc_usuarios')
          .select('id')
          .eq('google_id', session.user.id)
          .maybeSingle();
        if (u) setMeuId(u.id);
      }

      // Próximo jogo via API
      const resJogo = await fetch('/api/proximo-jogo')
        .then(r => r.json())
        .catch(() => null);

      if (resJogo?.jogos?.length > 0) {
        setJogo(resJogo.jogos[0]);
      } else {
        // Fallback hardcoded — Rodada 4 · América-MG
        setJogo({
          id: 4,
          data_hora: '2026-04-12T21:00:00Z',   // UTC — Arena da Independência 18h Brasília
          competicao: 'Série B',
          rodada: '4ª Rodada',
          local: 'Arena da Independência • BH',
          mandante:  {
            nome: 'América-MG',
            escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png',
          },
          visitante: {
            nome: 'Novorizontino',
            escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png',
          },
        });
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

  // ── Cronômetro ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!jogo?.data_hora) return;

    // Parse robusto: converte qualquer formato para timestamp Unix
    const gameTime = parseGameTime(jogo.data_hora);
    const lockTime = gameTime - (90 * 60 * 1000); // fecha 1h30 antes

    const tick = () => {
      const diff = lockTime - Date.now();

      if (isNaN(diff) || diff <= 0) {
        setMercadoAberto(false);
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setMercadoAberto(true);
      setTimeLeft({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };

    const timer = setInterval(tick, 1000);
    tick(); // roda imediatamente sem esperar 1s
    return () => clearInterval(timer);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 overflow-x-hidden"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div className="relative pt-20 pb-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,196,0,0.1)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.007)_3px,rgba(255,255,255,0.007)_4px)]" />
        <div className="relative z-10">
          <img src={PATA_LOGO} className="w-16 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(245,196,0,0.6)]" alt="" />
          <h1 className="text-7xl font-black tracking-[-4px] italic uppercase leading-none">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 mt-3">
            Fantasy League · Série B 2026
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-16 relative z-10 space-y-8">

        {/* ── MATCH CARD ─────────────────────────────────────────────────── */}
        {jogo && (
          <section>
            <div className="relative">
              {/* Borda gradiente */}
              <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-br from-[rgba(245,196,0,0.35)] via-transparent to-[rgba(245,196,0,0.1)]" />

              <div className="relative bg-gradient-to-b from-[#111108] to-[#0a0a0a] rounded-[34px] overflow-hidden border border-[rgba(245,196,0,0.08)]">
                {/* Linha topo dourada */}
                <div className="h-[3px] bg-gradient-to-r from-transparent via-[#F5C400] to-transparent" />

                <div className="p-7 pt-6">

                  {/* Competição + Rodada */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#F5C400] shadow-[0_0_6px_#F5C400]" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F5C400]">
                        {jogo.competicao ?? 'Série B'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">
                      {jogo.rodada ?? '4ª Rodada'}
                    </span>
                  </div>

                  {/* ── CRONÔMETRO 4 BLOCOS ── */}
                  <div className="flex items-end justify-center gap-2 mb-8">
                    <TimerBlock value={timeLeft.d} label="DIAS"    highlight />
                    <TimerSep />
                    <TimerBlock value={timeLeft.h} label="HORAS" />
                    <TimerSep />
                    <TimerBlock value={timeLeft.m} label="MIN" />
                    <TimerSep />
                    <TimerBlock value={timeLeft.s} label="SEG" />
                  </div>

                  {/* Localização */}
                  {jogo.local && (
                    <p className="text-center text-[9px] font-bold uppercase tracking-widest text-zinc-700 mb-6 -mt-2">
                      {jogo.local}
                    </p>
                  )}

                  {/* ── CONFRONTO ── */}
                  <div className="flex items-center justify-between mb-8">
                    {/* Mandante */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <div className="w-[72px] h-[72px] flex items-center justify-center bg-[radial-gradient(circle,rgba(245,196,0,0.1),transparent_70%)] rounded-full">
                        <img
                          src={jogo.mandante.escudo_url}
                          className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                          alt={jogo.mandante.nome}
                          onError={(e) => { (e.target as HTMLImageElement).src = PATA_LOGO; }}
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase text-center leading-tight text-white">
                        {jogo.mandante.nome}
                      </span>
                      <div className="px-2 py-[2px] bg-[rgba(245,196,0,0.1)] border border-[rgba(245,196,0,0.2)] rounded">
                        <span className="text-[7px] font-black uppercase tracking-wider text-[#F5C400]">MANDANTE</span>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="px-3">
                      <span className="text-2xl font-black italic text-white/10">VS</span>
                    </div>

                    {/* Visitante */}
                    <div className="flex flex-col items-center gap-3 flex-1">
                      <div className="w-[72px] h-[72px] flex items-center justify-center bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)] rounded-full">
                        <img
                          src={jogo.visitante.escudo_url}
                          className="w-14 h-14 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
                          alt={jogo.visitante.nome}
                          onError={(e) => { (e.target as HTMLImageElement).src = PATA_LOGO; }}
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase text-center leading-tight text-white">
                        {jogo.visitante.nome}
                      </span>
                      <div className="px-2 py-[2px] bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded">
                        <span className="text-[7px] font-black uppercase tracking-wider text-zinc-600">VISITANTE</span>
                      </div>
                    </div>
                  </div>

                  {/* ── BOTÃO CTA ── */}
                  <Link
                    href={mercadoAberto ? `/tigre-fc/escalar/${jogo.id}` : '#'}
                    className={`
                      flex items-center justify-center gap-2 w-full py-5 rounded-2xl
                      text-sm font-black uppercase tracking-[0.2em] transition-all
                      ${mercadoAberto
                        ? 'bg-gradient-to-r from-[#F5C400] to-[#D4A200] text-black shadow-[0_10px_30px_-8px_rgba(245,196,0,0.5)] active:scale-95 hover:scale-[1.02]'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 pointer-events-none'}
                    `}
                  >
                    {mercadoAberto ? (
                      <><span>⚡</span> CONVOCAR TITULARES</>
                    ) : (
                      <><span>🔒</span> MERCADO FECHADO</>
                    )}
                  </Link>

                  {/* Status do mercado */}
                  <div className="flex justify-center mt-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      mercadoAberto
                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                        : 'bg-red-500/10  border-red-500/20  text-red-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mercadoAberto ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                      {mercadoAberto ? 'Mercado Aberto' : 'Mercado Fechado'}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── DESTAQUES ──────────────────────────────────────────────────── */}
        <DestaquesFifa />

        {/* ── RANKING ────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(245,196,0,0.3)] to-transparent" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#F5C400]">Leaderboard</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[rgba(245,196,0,0.3)] to-transparent" />
          </div>
          <h3 className="text-3xl font-black italic uppercase tracking-tight text-white text-center mb-6">
            Líderes da Alcateia
          </h3>

          <div className="space-y-3">
            {ranking.length === 0 ? (
              <p className="text-center text-zinc-700 text-sm py-8 font-bold uppercase tracking-widest">
                Seja o primeiro a pontuar!
              </p>
            ) : ranking.map((u, i) => (
              <div
                key={u.id}
                onClick={() => setPerfilAberto(u.id)}
                className={`
                  flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all
                  ${i === 0
                    ? 'bg-gradient-to-r from-[#1a1400] to-[#2a1f00] border border-[rgba(245,196,0,0.3)] shadow-[0_0_24px_rgba(245,196,0,0.08)]'
                    : 'bg-white/[0.025] border border-white/5 hover:bg-white/5'}
                `}
              >
                {/* Posição */}
                <div className="w-8 text-center shrink-0">
                  {i === 0 && <span className="text-lg">🥇</span>}
                  {i === 1 && <span className="text-lg">🥈</span>}
                  {i === 2 && <span className="text-lg">🥉</span>}
                  {i > 2 && (
                    <span className="text-lg font-black italic text-zinc-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <div className={`relative w-10 h-10 rounded-xl overflow-hidden shrink-0 ${
                  i === 0 ? 'border-2 border-[rgba(245,196,0,0.4)]' : 'border border-white/5'
                }`}>
                  <img
                    src={u.avatar_url || PATA_LOGO}
                    className="w-full h-full object-cover"
                    alt={u.apelido || u.nome}
                  />
                </div>

                {/* Nome */}
                <div className="flex-1 min-w-0">
                  <p className={`font-black uppercase text-sm leading-none truncate ${
                    i === 0 ? 'text-[#F5C400]' : 'text-white'
                  }`}>
                    {u.apelido || u.nome}
                  </p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-700 mt-1">
                    {i === 0 ? 'Líder da Alcateia' : 'Competidor Elite'}
                  </p>
                </div>

                {/* Pontos */}
                <div className="text-right shrink-0">
                  <p className={`text-2xl font-black leading-none tracking-tight ${
                    i === 0 ? 'text-[#F5C400]' : 'text-white'
                  }`}>
                    {u.pontos_total ?? 0}
                  </p>
                  <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 mt-0.5">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CHAT ───────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(245,196,0,0.3)] to-transparent" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#F5C400]">Lounge</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[rgba(245,196,0,0.3)] to-transparent" />
          </div>
          <h3 className="text-3xl font-black italic uppercase tracking-tight text-white text-center mb-6">Vestiário</h3>
          <div className="rounded-3xl border border-white/5 overflow-hidden bg-black/40">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>

      </div>

      {/* ── MODAL PERFIL ─────────────────────────────────────────────────── */}
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
