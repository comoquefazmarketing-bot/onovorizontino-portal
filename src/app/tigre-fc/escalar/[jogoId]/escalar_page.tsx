// src/app/tigre-fc/escalar/[jogoId]/page.tsx
// MISSÃO 1 — busca dinâmica do próximo jogo ativo
// Nunca mais hardcodado. Lê do banco via REST público.

import { notFound } from 'next/navigation';
import EscalacaoFormacao from '@/components/EscalacaoFormacao';

const SUPA_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPA_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const HEADERS   = { apikey: SUPA_ANON, Authorization: `Bearer ${SUPA_ANON}` };

// ── Busca o jogo ativo pelo ID da URL ─────────────────────
// Se jogoId = 'proximo', redireciona para o jogo ativo mais próximo
async function getJogo(jogoId: string) {
  // Busca jogo específico pelo ID
  const url = jogoId === 'proximo'
    // Próximo jogo não finalizado, ordenado por data
    ? `${SUPA_URL}/rest/v1/jogos?ativo=eq.true&finalizado=eq.false&select=id,competicao,rodada,data_hora,local,transmissao,mandante_slug,visitante_slug,placar_mandante,placar_visitante,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&order=data_hora.asc&limit=1`
    : `${SUPA_URL}/rest/v1/jogos?id=eq.${jogoId}&select=id,competicao,rodada,data_hora,local,transmissao,mandante_slug,visitante_slug,placar_mandante,placar_visitante,mandante:mandante_id(nome,escudo_url,sigla),visitante:visitante_id(nome,escudo_url,sigla)&limit=1`;

  const res  = await fetch(url, { headers: HEADERS, cache: 'no-store' });
  const data = await res.json();
  return data?.[0] ?? null;
}

// ── Verifica se mercado está aberto ───────────────────────
function mercadoAberto(dataHora: string): boolean {
  return new Date(dataHora).getTime() - 90 * 60_000 > Date.now();
}

// ── Busca atletas do Novorizontino ────────────────────────
async function getAtletas() {
  const res  = await fetch(
    `${SUPA_URL}/rest/v1/tigre_fc_atletas?ativo=eq.true&select=id,nome,posicao,numero_camisa,foto_url,nacionalidade&order=posicao.asc,numero_camisa.asc`,
    { headers: HEADERS, next: { revalidate: 3600 } } // cache de 1h — elenco muda pouco
  );
  return res.json();
}

export default async function EscalarPage({
  params,
}: {
  params: Promise<{ jogoId: string }>;
}) {
  const { jogoId } = await params;

  const [jogo, atletas] = await Promise.all([
    getJogo(jogoId),
    getAtletas(),
  ]);

  if (!jogo) notFound();

  return (
    <EscalacaoFormacao
      jogo={jogo}
      atletas={atletas ?? []}
      mercadoFechado={!mercadoAberto(jogo.data_hora)}
    />
  );
}
