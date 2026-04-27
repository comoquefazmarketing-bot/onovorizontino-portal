// src/app/tigre-fc/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import JumbotronJogo, { type Jogo } from '@/components/tigre-fc/JumbotronJogo';

// ────────────────────────────────────────────────────────────────────────────
// MAPEAMENTO ID → NOME CURTO (mesmo PLAYERS_DATA do EscalacaoFormacao)
// Mantém apenas os shorts pra não duplicar payload na home.
// ────────────────────────────────────────────────────────────────────────────
const PLAYER_NAMES: Record<number, string> = {
  // GOL
  23: 'JORDI',
  1:  'CÉSAR',
  22: 'SCAPIN',
  62: 'LUCAS',
  // ZAG
  8:  'PATRICK',
  38: 'R. PALM',
  34: 'BROCK',
  66: 'ALVARÍÑO',
  6:  'CARLINHOS',
  3:  'DANTAS',
  // LAT
  9:  'SANDER',
  28: 'MAYKON',
  27: 'NILSON',
  75: 'LORA',
  // VOL
  41: 'OYAMA',
  46: 'MARLON',
  40: 'NALDI',
  // MEI
  47: 'BIANQUI',
  10: 'RÔMULO',
  12: 'JUNINHO',
  17: 'TAVINHO',
  86: 'TITI ORTÍZ',
  13: 'D. GALO',
  // ATA
  15: 'ROBSON',
  59: 'V. PAIVA',
  57: 'RONALD',
  55: 'CARECA',
  50: 'CARLÃO',
  52: 'HÉLIO',
  53: 'JARDIEL',
  91: 'HECTOR',
};

// ────────────────────────────────────────────────────────────────────────────
// TIPOS
// ────────────────────────────────────────────────────────────────────────────
interface UserShape {
  id: string;
  email?: string;
}

interface Escalacao {
  formacao: string;
  capitao_id: number | null;
  heroi_id: number | null;
  palpite_mandante: number;
  palpite_visitante: number;
}

// ────────────────────────────────────────────────────────────────────────────
// PÁGINA
// ────────────────────────────────────────────────────────────────────────────
export default function TigreFCPage() {
  const router = useRouter();

  const [user, setUser]                       = useState<UserShape | null>(null);
  const [jogo, setJogo]                       = useState<Jogo | null>(null);
  const [escalacao, setEscalacao]             = useState<Escalacao | null>(null);
  const [totalEscalacoes, setTotalEscalacoes] = useState(0);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      try {
        // ─── 1. SESSÃO ─────────────────────────────────────────────
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!cancelled) {
          setUser(authUser ? { id: authUser.id, email: authUser.email ?? undefined } : null);
        }

        // ─── 2. PRÓXIMO JOGO ATIVO (não finalizado, menor rodada) ──
        const { data: jogosData, error: jogosError } = await supabase
          .from('jogos')
          .select('id, rodada, competicao, mandante_slug, visitante_slug, placar_mandante, placar_visitante, finalizado')
          .eq('finalizado', false)
          .order('rodada', { ascending: true })
          .limit(1);

        if (jogosError) {
          console.error('[TigreFCPage] erro ao buscar jogo ativo:', jogosError);
        }

        const jogoAtivo: Jogo | null = jogosData?.[0] ?? null;
        if (!cancelled) setJogo(jogoAtivo);

        if (jogoAtivo) {
          // ─── 3. CONTAGEM DE ESCALAÇÕES PRA ESSE JOGO ──────────────
          const { count: countEscs } = await supabase
            .from('tigre_fc_escalacoes')
            .select('id', { count: 'exact', head: true })
            .eq('jogo_id', jogoAtivo.id);

          if (!cancelled) setTotalEscalacoes(countEscs ?? 0);

          // ─── 4. ESCALAÇÃO DO USUÁRIO LOGADO ───────────────────────
          if (authUser) {
            const { data: escData, error: escError } = await supabase
              .from('tigre_fc_escalacoes')
              .select('formacao, capitao_id, heroi_id, palpite_mandante, palpite_visitante')
              .eq('user_id', authUser.id)
              .eq('jogo_id', jogoAtivo.id)
              .maybeSingle();

            if (escError) {
              console.error('[TigreFCPage] erro ao buscar escalação:', escError);
            }

            if (!cancelled) setEscalacao(escData ?? null);
          }
        }
      } catch (err) {
        console.error('[TigreFCPage] erro geral:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, []);

  // ─── DERIVADOS: ID → NOME ─────────────────────────────────────────────
  const capitaoNome: string | null = escalacao?.capitao_id != null
    ? (PLAYER_NAMES[escalacao.capitao_id] ?? '---')
    : null;

  const heroiNome: string | null = escalacao?.heroi_id != null
    ? (PLAYER_NAMES[escalacao.heroi_id] ?? '---')
    : null;

  // ─── HANDLERS ─────────────────────────────────────────────────────────
  const handleEscalar = () => {
    if (jogo) {
      router.push(`/tigre-fc/escalar/${jogo.id}`);
    }
  };

  // ─── RENDER ───────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* HERO HEADER */}
        <header className="text-center pt-2 sm:pt-4">
          <div className="text-yellow-400 text-[10px] sm:text-xs font-black tracking-[6px] mb-2">
            ⚡ TIGRE FC
          </div>
          <h1 className="text-3xl sm:text-5xl font-black italic tracking-tighter">
            ARENA DA TORCIDA
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-2 max-w-md mx-auto">
            Escala o Tigrão, palpita no placar e entra no ranking dos torcedores.
          </p>
        </header>

        {/* JUMBOTRON DA RODADA */}
        <JumbotronJogo
          jogo={jogo}
          formacao={escalacao?.formacao ?? null}
          capitaoNome={capitaoNome}
          heroiNome={heroiNome}
          palpiteMandante={escalacao?.palpite_mandante ?? null}
          palpiteVisitante={escalacao?.palpite_visitante ?? null}
          totalEscalacoes={totalEscalacoes}
          onEscalar={handleEscalar}
          loading={loading}
        />

        {/* AVISO LOGIN (só se não autenticado) */}
        {!loading && !user && (
          <div className="bg-zinc-950 border border-yellow-400/30 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🔐</div>
            <div className="text-sm font-black mb-1">Faça login pra escalar</div>
            <div className="text-zinc-400 text-xs">
              Entre com sua conta pra montar seu time, palpitar no placar e disputar o ranking.
            </div>
          </div>
        )}

        {/* AVISO SEM JOGO (estado raro) */}
        {!loading && !jogo && (
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-4 text-center">
            <div className="text-zinc-500 text-xs">
              A próxima rodada está sendo definida. Volte em breve!
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
