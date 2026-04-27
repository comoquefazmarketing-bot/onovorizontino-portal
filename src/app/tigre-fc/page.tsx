// src/app/tigre-fc/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const FONT_FAMILY = "'Barlow Condensed', 'Barlow', system-ui, -apple-system, sans-serif";

// ════════════════════════════════════════════════════════════════════════════
// TIPOS LOCAIS (inline pra evitar conflito de type import com Turbopack)
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

type UserShape = {
  id: string;
  email?: string;
};

type Escalacao = {
  formacao: string;
  capitao_id: number | null;
  heroi_id: number | null;
  palpite_mandante: number;
  palpite_visitante: number;
};

// ════════════════════════════════════════════════════════════════════════════
// FALLBACK — GARANTIA CONTRA TELA PRETA
// Sempre renderiza ALGO, mesmo se o Supabase estiver offline ou vazio.
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
  data_jogo: null,
};

// ════════════════════════════════════════════════════════════════════════════
// MAPEAMENTO ID → NOME CURTO (mesmo PLAYERS_DATA do EscalacaoFormacao)
// ════════════════════════════════════════════════════════════════════════════
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

// ════════════════════════════════════════════════════════════════════════════
// PÁGINA
// ════════════════════════════════════════════════════════════════════════════
export default function TigreFCPage() {
  const router = useRouter();

  // Inicializa COM o fallback — não esperamos nada pra renderizar
  const [user, setUser]                       = useState<UserShape | null>(null);
  const [jogo, setJogo]                       = useState<Jogo>(FALLBACK_JOGO);
  const [escalacao, setEscalacao]             = useState<Escalacao | null>(null);
  const [totalEscalacoes, setTotalEscalacoes] = useState(0);
  const [hydrating, setHydrating]             = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      // ─── 1. SESSÃO (try/catch isolado pra não bloquear o resto) ──
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!cancelled && authUser) {
          setUser({ id: authUser.id, email: authUser.email ?? undefined });
        }
      } catch (err) {
        console.warn('[TigreFCPage] sessão indisponível:', err);
      }

      // ─── 2. JOGO ATIVO ──────────────────────────────────────────
      let jogoAtivo: Jogo | null = null;
      try {
        const { data: jogosData, error: jogosError } = await supabase
          .from('jogos')
          .select('id, rodada, competicao, mandante_slug, visitante_slug, placar_mandante, placar_visitante, finalizado')
          .eq('finalizado', false)
          .order('rodada', { ascending: true })
          .limit(1);

        if (jogosError) {
          console.warn('[TigreFCPage] erro buscando jogo ativo:', jogosError.message);
        } else {
          jogoAtivo = jogosData?.[0] ?? null;
        }
      } catch (err) {
        console.warn('[TigreFCPage] exceção buscando jogo:', err);
      }

      // Se achou jogo real, substitui o fallback. Se não, mantém o fallback.
      if (!cancelled && jogoAtivo) {
        setJogo(jogoAtivo);
      }

      const jogoEfetivo = jogoAtivo ?? FALLBACK_JOGO;
      const jogoIdEfetivo = jogoEfetivo.id ?? FALLBACK_JOGO.id ?? 0;

      // ─── 3. CONTAGEM DE ESCALAÇÕES ──────────────────────────────
      try {
        const { count: countEscs } = await supabase
          .from('tigre_fc_escalacoes')
          .select('id', { count: 'exact', head: true })
          .eq('jogo_id', jogoIdEfetivo);

        if (!cancelled) setTotalEscalacoes(countEscs ?? 0);
      } catch (err) {
        console.warn('[TigreFCPage] contagem indisponível:', err);
      }

      // ─── 4. ESCALAÇÃO DO USUÁRIO ────────────────────────────────
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser && jogoIdEfetivo) {
          const { data: escData, error: escError } = await supabase
            .from('tigre_fc_escalacoes')
            .select('formacao, capitao_id, heroi_id, palpite_mandante, palpite_visitante')
            .eq('user_id', authUser.id)
            .eq('jogo_id', jogoIdEfetivo)
            .maybeSingle();

          if (escError) {
            console.warn('[TigreFCPage] erro buscando escalação:', escError.message);
          }
          if (!cancelled) setEscalacao(escData ?? null);
        }
      } catch (err) {
        console.warn('[TigreFCPage] exceção buscando escalação:', err);
      }

      if (!cancelled) setHydrating(false);
    };

    loadAll();
    return () => { cancelled = true; };
  }, []);

  // ─── DERIVADOS ──────────────────────────────────────────────────────
  const capitaoNome: string | null = escalacao?.capitao_id != null
    ? (PLAYER_NAMES[escalacao.capitao_id] ?? '---')
    : null;

  const heroiNome: string | null = escalacao?.heroi_id != null
    ? (PLAYER_NAMES[escalacao.heroi_id] ?? '---')
    : null;

  const handleEscalar = () => {
    const targetId = jogo.id ?? FALLBACK_JOGO.id ?? 12;
    router.push(`/tigre-fc/escalar/${targetId}`);
  };

  // ════════════════════════════════════════════════════════════════════
  // RENDER — sempre tem conteúdo, jamais retorna null nem tela preta
  // ════════════════════════════════════════════════════════════════════
  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: FONT_FAMILY }}>
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

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

        {!hydrating && !user && (
          <div className="bg-zinc-950 border border-yellow-400/30 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🔐</div>
            <div className="text-sm font-black mb-1">Faça login pra escalar</div>
            <div className="text-zinc-400 text-xs">
              Entre com sua conta pra montar seu time, palpitar no placar e disputar o ranking.
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
