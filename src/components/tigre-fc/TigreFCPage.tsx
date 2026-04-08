'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// ─── PARSE DE DATA (TRATAMENTO LOCAL PARA EVITAR ERRO DE FUSO) ────────────────
function parseGameTime(raw: string): number {
  if (!raw) return 0;
  // Removemos o 'Z' para forçar o JS a tratar como hora local e evitar saltos de fuso
  const cleanIso = raw.split('.')[0].replace('Z', '').replace(' ', 'T');
  return new Date(cleanIso).getTime();
}

// ─── TIMER BLOCK (HORAS TOTAIS) ─────────────────────────────────────────────
function TimerBlock({ value, label, highlight = false }: {
  value: string; label: string; highlight?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`
        relative min-w-[72px] h-[74px] px-2 flex items-center justify-center
        bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] rounded-2xl overflow-hidden
        ${highlight
          ? 'border border-[#F5C400]/60 shadow-[0_0_20px_rgba(245,196,0,0.35)]'
          : 'border border-white/[0.08]'}
      `}>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.12)_2px,rgba(0,0,0,0.12)_4px)] pointer-events-none" />
        <span className={`relative z-10 text-[32px] font-black font-mono tabular-nums leading-none ${
          highlight ? 'text-[#F5C400] drop-shadow-[0_0_12px_rgba(245,196,0,0.7)]' : 'text-white'
        }`}>
          {value}
        </span>
      </div>
      <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${
        highlight ? 'text-[#F5C400]' : 'text-zinc-600'
      }`}>
        {label}
      </span>
    </div>
  );
}

function TimerSep() {
  return (
    <div className="flex flex-col gap-[8px] pb-6 shrink-0 self-center">
      <div className="w-1 h-1 rounded-full bg-[#F5C400]/40 animate-pulse" />
      <div className="w-1 h-1 rounded-full bg-[#F5C400]/40 animate-pulse [animation-delay:300ms]" />
    </div>
  );
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  use(params);

  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      const resJogo = await fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null);
      if (resJogo?.jogos?.length > 0) {
        setJogo(resJogo.jogos[0]);
      } else {
        setJogo({
          id: 4,
          data_hora: '2026-04-12T18:00:00',
          competicao: 'Série B',
          rodada: '4ª Rodada',
          local: 'Arena da Independência • BH',
          mandante:  { nome: 'América-MG', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png' },
          visitante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png' },
        });
      }

      const { data: resRank } = await sb.from('tigre_fc_usuarios').select('id, nome, apelido, avatar_url, pontos_total').order('pontos_total', { ascending: false }).limit(10);
      if (resRank) setRanking(resRank);
    }
    init();
  }, [mounted]);

  // ── LÓGICA DE HORAS TOTAIS (CONVITE / FECHAMENTO) ───────────────────────────
  useEffect(() => {
    if (!jogo?.data_hora) return;
    
    const gameTime = parseGameTime(jogo.data_hora);
    const lockTime = gameTime - (90 * 60 * 1000); // 1h30m antes do jogo

    const tick = () => {
      const diff = lockTime - Date.now();

      if (diff <= 0) {
        setMercadoAberto(false);
        setTimeLeft({ h: '00', m: '00', s: '00' });
        return;
      }

      // Cálculo de horas totais acumuladas
      const totalHours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setMercadoAberto(true);
      setTimeLeft({
        h: String(totalHours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        s: String(seconds).padStart(2, '0'),
      });
    };

    const timer = setInterval(tick, 1000);
    tick();
    return () => clearInterval(timer);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 overflow-x-hidden"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&display=swap');
      `}</style>

      {/* HEADER */}
      <div className="relative pt-20 pb-28 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(245,196,0,0.1)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <img src={PATA_LOGO} className="w-16 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(245,196,0,0.6)]" alt="" />
          <h1 className="text-7xl font-black tracking-[-4px] italic uppercase leading-none">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-16 relative z-10 space-y-8">

        {/* MATCH CARD COM TIMER DE HORAS */}
        {jogo && (
          <section>
            <div className="relative">
              <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-br from-[rgba(245,196,0,0.35)] via-transparent to-[rgba(245,196,0,0.1)]" />
              <div className="relative bg-gradient-to-b from-[#111108] to-[#0a0a0a] rounded-[34px] overflow-hidden border border-[rgba(245,196,0,0.08)]">
                <div className="h-[3px] bg-gradient-to-r from-transparent via-[#F5C400] to-transparent" />
                <div className="p-6">

                  <div className="text-center mb-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">MERCADO FECHA EM</span>
                  </div>

                  {/* TIMER DE 3 BLOCOS (HORAS/MIN/SEG) */}
                  <div className="flex items-center justify-center gap-3 mb-8">
                    <TimerBlock value={timeLeft.h} label="HORAS" highlight />
                    <TimerSep />
                    <TimerBlock value={timeLeft.m} label="MINUTOS" />
                    <TimerSep />
                    <TimerBlock value={timeLeft.s} label="SEGUNDOS" />
                  </div>

                  {/* Confronto */}
                  <div className="flex items-center justify-between mb-8 px-2">
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <img src={jogo.mandante.escudo_url} className="w-12 h-12 object-contain" alt="" />
                      <span className="text-[10px] font-black uppercase text-center text-white">{jogo.mandante.nome}</span>
                    </div>
                    <div className="px-4">
                      <span className="text-xl font-black italic text-white/10">VS</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <img src={jogo.visitante.escudo_url} className="w-12 h-12 object-contain" alt="" />
                      <span className="text-[10px] font-black uppercase text-center text-white">{jogo.visitante.nome}</span>
                    </div>
                  </div>

                  <Link
                    href={mercadoAberto ? `/tigre-fc/escalar/${jogo.id}` : '#'}
                    className={`flex items-center justify-center gap-2 w-full py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all ${
                      mercadoAberto
                        ? 'bg-[#F5C400] text-black shadow-[0_10px_30px_-8px_rgba(245,196,0,0.5)] active:scale-95'
                        : 'bg-zinc-900 text-zinc-600 border border-zinc-800 pointer-events-none'
                    }`}
                  >
                    {mercadoAberto ? '⚡ CONVOCAR TITULARES' : '🔒 MERCADO FECHADO'}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <DestaquesFifa />

        {/* RANKING */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[rgba(245,196,0,0.3)] to-transparent" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#F5C400]">Leaderboard</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-[rgba(245,196,0,0.3)] to-transparent" />
          </div>
          <div className="space-y-3">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.025] border border-white/5 cursor-pointer hover:bg-white/5"
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

        {/* CHAT */}
        <section>
          <h3 className="text-3xl font-black italic uppercase text-white text-center mb-6">Vestiário</h3>
          <div className="rounded-3xl border border-white/5 overflow-hidden bg-black/40">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico targetUsuarioId={perfilAberto} viewerUsuarioId={meuId} onClose={() => setPerfilAberto(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
