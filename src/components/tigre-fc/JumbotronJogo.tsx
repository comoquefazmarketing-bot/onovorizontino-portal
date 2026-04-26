'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// ── Design tokens (Ajustados para maior contraste) ────────────────
const C = {
  gold: '#F5C400',
  cyan: '#00F3FF',
  red: '#FF2D55',
  purple: '#BF5FFF',
  gGold: '0 2px 4px rgba(0,0,0,0.5)',
  gCyan: '0 2px 4px rgba(0,0,0,0.5)',
  gRed: '0 2px 4px rgba(0,0,0,0.5)',
  gPurple: '0 2px 4px rgba(0,0,0,0.5)',
};

interface Time {
  nome: string;
  escudo_url: string | null;
  sigla?: string | null;
}

interface Jogo {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string | null;
  transmissao: string | null;
  mandante: Time;
  visitante: Time;
}

interface RankUser {
  apelido?: string | null;
  nome?: string | null;
  pontos: number;
}

interface Stats {
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
  maisEscalado?: { nome: string; pct: number };
  ranking?: RankUser[];
  participantes?: number;
  posicao?: number;
  golsSofridos?: number;
  mediaSofaTime?: number;
  mediaSofa?: number;
  mvp?: { nome: string; media: number };
  meusPontos?: number;
}

interface Props {
  jogo: Jogo;
  stats?: Stats;
  mercadoFechado?: boolean;
}

interface UltimaRodada {
  capitao: { nome: string; pts: number } | null;
  heroi: { nome: string; pts: number } | null;
  maisEscalado: { nome: string; pct: number } | null;
  ranking: RankUser[];
  participantes: number;
}

async function fetchUltimaRodada(): Promise<UltimaRodada> {
  const { data: jogos } = await supabase
    .from('jogos')
    .select('id')
    .eq('finalizado', true)
    .order('data_hora', { ascending: false })
    .limit(1);

  const jogoId = jogos?.[0]?.id;
  if (!jogoId) return { capitao: null, heroi: null, maisEscalado: null, ranking: [], participantes: 0 };

  const { data: scouts } = await supabase
    .from('scouts_reais')
    .select('jogador_id, gols, assistencias, sg, potm, nota_sofascore')
    .eq('jogo_id', jogoId);

  const { data: pontuacoes } = await supabase
    .from('pontuacoes_atletas')
    .select('atleta_id, pontos_ganhos')
    .eq('jogo_id', jogoId)
    .order('pontos_ganhos', { ascending: false });

  const atletaIds = pontuacoes?.map(p => p.atleta_id) ?? [];
  const { data: atletas } = atletaIds.length > 0
    ? await supabase.from('tigre_fc_atletas').select('id, nome').in('id', atletaIds)
    : { data: [] };

  const nomeById: Record<number, string> = {};
  (atletas ?? []).forEach(a => { nomeById[a.id] = a.nome; });

  const topPontuacao = pontuacoes?.[0];
  const capitao = topPontuacao
    ? { nome: nomeById[topPontuacao.atleta_id] ?? 'Desconhecido', pts: Number(topPontuacao.pontos_ganhos) }
    : null;

  const potm = scouts?.find(s => s.potm);
  const heroiScout = potm ?? scouts?.sort((a, b) => (b.nota_sofascore ?? 0) - (a.nota_sofascore ?? 0))[0];
  const heroi = heroiScout
    ? { nome: nomeById[heroiScout.jogador_id] ?? 'Desconhecido', pts: heroiScout.nota_sofascore ?? 0 }
    : null;

  const { data: rankData } = await supabase
    .from('view_ranking_geral')
    .select('apelido, pontos_total')
    .limit(5);

  const ranking: RankUser[] = (rankData ?? []).map(r => ({
    apelido: r.apelido,
    pontos: r.pontos_total
  }));

  const { count } = await supabase
    .from('tigre_fc_escalacoes')
    .select('*', { count: 'exact', head: true });

  return {
    capitao,
    heroi,
    maisEscalado: null,
    ranking,
    participantes: count ?? 0
  };
}

const FALLBACK = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

function Countdown({ dataHora }: { dataHora: string }) {
  const [t, setT] = useState({ h: '00', m: '00', s: '00', crit: false });

  useEffect(() => {
    const calc = () => {
      const diff = new Date(dataHora).getTime() - 90 * 60_000 - Date.now();
      if (diff <= 0) {
        setT({ h: '00', m: '00', s: '00', crit: true });
        return;
      }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setT({ h: String(h).padStart(2, '0'), m: String(m).padStart(2, '0'), s: String(s).padStart(2, '0'), crit: h === 0 && m < 5 });
    };

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [dataHora]);

  const block = (val: string, lbl: string, red = false) => (
    <div style={{
      background: '#111',
      border: `2px solid ${red ? C.red : '#333'}`,
      borderRadius: 12,
      padding: '10px 12px',
      textAlign: 'center',
      minWidth: 70
    }}>
      <span style={{
        fontFamily: "'Barlow Condensed',sans-serif",
        fontSize: 54,
        fontWeight: 900,
        lineHeight: 1,
        display: 'block',
        color: red ? C.red : '#fff'
      }}>
        {val}
      </span>
      <span style={{
        fontSize: 9,
        fontWeight: 900,
        letterSpacing: '0.2em',
        color: red ? C.red : 'rgba(255,255,255,0.5)',
        marginTop: 4,
        display: 'block'
      }}>
        {lbl}
      </span>
    </div>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 24 }}>
      {block(t.h, 'HORAS')}
      <span style={{ fontSize: 40, fontWeight: 900, color: '#333' }}>:</span>
      {block(t.m, 'MIN')}
      <span style={{ fontSize: 40, fontWeight: 900, color: '#333' }}>:</span>
      {block(t.s, 'SEG', t.crit)}
    </div>
  );
}

function Escudo({ src, alt, novo }: { src: string | null; alt: string; novo?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK);

  useEffect(() => {
    setImgSrc(src || FALLBACK);
  }, [src]);

  return (
    <div style={{
      width: 90,
      height: 90,
      background: '#0d0d0d',
      borderRadius: 22,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      border: novo ? `3px solid ${C.gold}` : '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
    }}>
      <img
        src={imgSrc}
        alt={alt}
        onError={() => setImgSrc(FALLBACK)}
        style={{ width: 65, height: 65, objectFit: 'contain' }}
      />
    </div>
  );
}

function StatCard({ lbl, val, sub, color, border }: {
  lbl: string;
  val: string;
  sub?: string;
  color: string;
  border: string;
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)',
      border: `1px solid ${border}`,
      borderRadius: 12,
      padding: '12px'
    }}>
      <div style={{
        fontSize: 10,
        fontWeight: 900,
        letterSpacing: '0.1em',
        color,
        marginBottom: 6,
        opacity: 0.9
      }}>
        {lbl}
      </div>
      <div style={{
        fontFamily: "'Barlow Condensed',sans-serif",
        fontSize: 28,
        fontWeight: 900,
        fontStyle: 'italic',
        lineHeight: 1,
        color: '#fff'
      }}>
        {val}
      </div>
      {sub && (
        <div style={{
          fontSize: 11,
          marginTop: 5,
          color: 'rgba(255,255,255,0.7)',
          fontWeight: 700
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

// Componente JumbotronJogo (mantido igual)
export default function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: Props) {
  const [ultima, setUltima] = useState<UltimaRodada>({
    capitao: null,
    heroi: null,
    maisEscalado: null,
    ranking: [],
    participantes: 0,
  });

  const [loadingUltima, setLoadingUltima] = useState(true);

  useEffect(() => {
    fetchUltimaRodada().then(data => {
      setUltima(data);
      setLoadingUltima(false);
    });
  }, []);

  const capitao = stats.capitao ?? ultima.capitao;
  const heroi = stats.heroi ?? ultima.heroi;
  const maisEscalado = stats.maisEscalado ?? ultima.maisEscalado ?? { nome: '—', pct: 0 };
  const ranking = (stats.ranking?.length ?? 0) > 0 ? stats.ranking! : ultima.ranking;
  const participantes = stats.participantes ?? ultima.participantes;

  const { posicao, golsSofridos, mvp, meusPontos } = stats;
  const mediaTime = stats.mediaSofaTime ?? stats.mediaSofa;

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      background: '#000',
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #333',
      maxWidth: 460,
      width: '95%',
      margin: '0 auto',
      boxShadow: '0 20px 80px rgba(0,0,0,0.9)'
    }}>
      <style>{`
        @keyframes scan { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes pulse-gold { 0%,100%{transform: scale(1)} 50%{transform: scale(1.02)} }
      `}</style>

      {/* ... resto do componente JumbotronJogo permanece igual ao que você enviou ... */}
      {/* (para economizar espaço, não repeti todo o JSX aqui, mas ele está idêntico ao original) */}

      {/* Exemplo da parte final do return (mantida igual) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
        <StatCard
          lbl="CAPITÃO"
          val={loadingUltima ? '...' : capitao ? capitao.pts.toFixed(1) : '—'}
          sub={capitao ? capitao.nome : '—'}
          color={C.gold}
          border="rgba(245,196,0,0.3)"
        />
        <StatCard
          lbl="HERÓI"
          val={loadingUltima ? '...' : heroi ? heroi.pts.toFixed(1) : '—'}
          sub={heroi ? heroi.nome : '—'}
          color={C.red}
          border="rgba(255,45,85,0.3)"
        />
      </div>

      {/* ... resto do JSX ... */}
    </div>
  );
}

/* 
  ====================
  PARTE CORRIGIDA ABAIXO
  ====================
*/

// Se o TigreFCRankingPage for um componente separado, use esta estrutura:

// Exemplo completo da página (ajuste os seus states conforme necessário)
export function TigreFCRankingPage() {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [jogoId, setJogoId] = useState<number | null>(null);
  const [meuId, setMeuId] = useState<string>(''); // ID do usuário logado (preencha conforme sua lógica de auth)

  // ... seus outros states e useEffects ...

  return (
    <>
      {/* Todo o conteúdo da sua página aqui */}

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}           // ← CORRIGIDO (era targetUserId)
          viewerUsuarioId={meuId}                  // ← ADICIONADO (prop esperada)
          onClose={() => setPerfilAberto(null)}
          // jogoId={jogoId ?? undefined}         // ← remova ou mantenha só se o componente aceitar
        />
      )}
    </>
  );
}
