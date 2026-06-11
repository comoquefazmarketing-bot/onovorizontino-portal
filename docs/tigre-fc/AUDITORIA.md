# Auditoria — Tigre FC (Arena Tigre FC)
**Data:** 2026-06-11  
**Repositório:** `E:\O Novorizontino` (Next.js 16 App Router, Supabase, Tailwind, Framer Motion)  
**Banco:** `whoglnpvqjbaczgnebbn.supabase.co` (projeto `onovorizontino.com.br`)

---

## 1. Mapa de rotas e componentes do Tigre FC

**O Tigre FC não existe no código do repositório.** O código atual é um portal de notícias. Nenhuma rota de fantasy, escalação, ranking, cron ou API tigre-fc existe em `src/`.

Rotas existentes:
```
src/app/
  page.tsx, layout.tsx, globals.css
  mercado/, noticia/, noticias/, opiniao/, post/, sobre/, tabela/, videos/
  api/noticias/route.ts
  api/shorts/route.ts
```

Componentes que mencionam "tigre" são apenas visuais (shorts, widget iframe Google).  
**Não existem:** `api/tigre-fc/*`, `api/cron/*`, nenhuma tela de escalar/arena/ranking.

---

## 2. Como a tela de escalação escolhe o jogo hoje?

**Não existe tela de escalação.** Nenhum `jogo_id` é usado em nenhum arquivo `.ts`/`.tsx`.

---

## 3. Como `jogos` é lida e populada

A tabela **existe no banco** e é populada manualmente. Nenhum código TypeScript lê `jogos`. Nenhum sync, nenhuma migration local. 

**Dados reais encontrados** (5 jogos, todos da Série B 2026 + 1 Copa Sul-Sudeste):
- Rodada 13 — Novorizontino × Náutico — 2026-06-12T19:00 BRT (próximo jogo)
- `external_id` = NULL em todos os jogos (coluna existe mas nunca foi usada)

---

## 4. Schema real das tabelas (via introspecção REST)

### `jogos`
```
id, competicao, rodada, mandante_slug, visitante_slug, data_hora, local,
ativo (bool), mandante_id, visitante_id, placar_mandante, placar_visitante,
finalizado (bool), transmissao, external_id
```
**Divergências do prompt:**
- `gols_mandante`/`gols_visitante` → já existem como `placar_mandante`/`placar_visitante` ✅
- `status` (enum) → **NÃO existe** — usa `finalizado` + `ativo` (booleans manuais)
- `external_id` → **existe** mas sem UNIQUE constraint (todos NULL)
- `external_updated_at` → **não existe**
- `pontuado` (flag de processamento) → **não existe**

### `tigre_fc_usuarios`
```
id (uuid PK), google_id, nome, email, avatar_url, apelido,
nivel, pontos_total, streak, criado_em, xp, updated_at,
bio, is_public, nivel_numerico, is_admin
```
Conforme o prompt ✅. Colunas extras: `email`, `nivel`, `streak`, `xp`, `bio`, `is_public`, `nivel_numerico`, `is_admin`.

### `tigre_fc_escalacoes`
```
id (uuid), usuario_id, jogo_id, formacao, lineup (jsonb),
capitao_id, heroi_id, criado_em, updated_at, palpite_tigre, palpite_adv
```
Conforme o prompt ✅. **Sem coluna de pontos aqui** (certo — pontos ficam em tabela separada).

### `resultados_partidas`
```
id, jogo_id, placar_final_tigre, placar_final_adv, finalizada (bool),
atualizado_em, processado (bool)
```
⚠️ O prompt chamava de `tigre_fc_resultados` mas a tabela real é `resultados_partidas`.  
A flag `processado` é a idempotência para o cron de pontuação.

### `pontuacoes_atletas`
```
id, atleta_id, jogo_id, pontos_ganhos, criado_em
```
⚠️ Tabela de pontuação de atletas reais — diferente de `tigre_fc_pontuacoes` (usuários fantasy).  
**`tigre_fc_pontuacoes` não existe** — precisa ser criada.

### `tigre_fc_atletas`
```
(existe, vazia)
```

### `tigre_fc_badges`
```
(existe, vazia)
```

### `times_serie_b`
```
id, nome, slug, escudo_url, cor_primaria, sigla, cidade, estado
```
Tabela de times da Série B — os slugs aqui precisam ser mapeados para os do SofaScore.

### `historico_rodadas`
```
(existe, vazia)
```

### `tigre_fc_notificacoes`
```
id, usuario_id, tipo, de_usuario_id, jogo_id, lida, mensagem, criado_em, titulo, corpo
```

### `tigre_fc_chat_geral`, `tigre_fc_ligas`, `tigre_fc_ligas_membros`, `tigre_fc_ligas_mensagens`
```
(existem, todas vazias)
```

### `tigre_fc_predicoes`, `tigre_fc_votos_predicao`, `tigre_fc_streaks_predicao`, `tigre_fc_cornetas`
```
(existem, todas vazias)
```

### `voxsports_fila`
```
id, jogo_id, evento, titulo, copy, publicado, criado_em
```
Fila de publicações automáticas nas redes sociais — funcionalidade editorial paralela.

### Views existentes
- `view_jogadores_tigre` (UNRESTRICTED)
- `view_ranking_geral` (UNRESTRICTED)
- `view_destaques_...` (UNRESTRICTED)
- `view_predicao_...` (UNRESTRICTED)

---

## 5. Como a pontuação é calculada hoje

**Não existe cálculo de pontuação no código TypeScript.** `tigre_fc_pontuacoes` não existe. `resultados_partidas` tem flag `processado` mas não há cron que a use. Tudo manual.

---

## 6. Crons e variáveis de ambiente

### `vercel.json` atual
```json
{
  "cleanUrls": true,
  "framework": "nextjs",
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
🔴 **CRÍTICO:** O rewrite `/(.*) → /` quebra TODAS as rotas de API. Precisa ser corrigido antes de qualquer implementação.

**Nenhum cron configurado no vercel.json.**

### Variáveis em `.env.local`
```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_SUPABASE_URL         ✅ configurado
NEXT_PUBLIC_SUPABASE_ANON_KEY    ✅ configurado
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
NEXTAUTH_SECRET
NEXTAUTH_URL
TIGRE_FC_ADMIN_SECRET            ✅ existe
secret                           (vaga — provavelmente legado)
```
**Faltam:** `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `SOFASCORE_USER_AGENT`, `DEADLINE_MIN_ANTES`.

---

## 7. Riscos e dívidas

| # | Risco | Severidade |
|---|-------|------------|
| 1 | `vercel.json` rewrite quebra todas as rotas de API/cron | 🔴 Crítico |
| 2 | `SUPABASE_SERVICE_ROLE_KEY` ausente — crons não funcionam | 🔴 Crítico |
| 3 | `jogos.external_id` sem UNIQUE constraint — risco de duplicatas | 🔴 Crítico |
| 4 | `jogos.status` não existe — lógica de estado usa booleans manuais frágeis | 🟡 Alto |
| 5 | `tigre_fc_pontuacoes` não existe — pontuação de usuários sem tabela | 🟡 Alto |
| 6 | Sem deadline server-side — escalação pode ser editada pós-kickoff | 🟡 Alto |
| 7 | `resultados_partidas.processado` existe mas nenhum cron o usa | 🟡 Alto |
| 8 | Regra de Ouro sem violação conhecida (feature não implementada) | 🟢 OK |
| 9 | `src/lib/supabase.ts` usa ANON_KEY — correto para client | 🟢 OK |

---

## Plano de implementação — Fases 1 a 7

### PRÉ-REQUISITO (imediato, antes de qualquer fase)
1. Corrigir `vercel.json` — remover o rewrite problemático
2. Adicionar `SUPABASE_SERVICE_ROLE_KEY` e `CRON_SECRET` no `.env.local` e Vercel

---

### FASE 1 — Schema + Sincronização de calendário

**Migrations necessárias (ALTER TABLE, não CREATE):**

```sql
-- 001_jogos_sync.sql
ALTER TABLE jogos
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'agendado'
    CHECK (status IN ('agendado','ao_vivo','encerrado','adiado')),
  ADD COLUMN IF NOT EXISTS external_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pontuado BOOLEAN DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS jogos_external_id_key ON jogos(external_id)
  WHERE external_id IS NOT NULL;

-- 002_tigre_fc_pontuacoes.sql
CREATE TABLE IF NOT EXISTS tigre_fc_pontuacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES tigre_fc_usuarios(id),
  jogo_id INTEGER NOT NULL REFERENCES jogos(id),
  pontos INTEGER NOT NULL DEFAULT 0,
  detalhes JSONB,
  criado_em TIMESTAMPTZ DEFAULT now(),
  UNIQUE (usuario_id, jogo_id)
);

-- 003_jobs_log.sql
CREATE TABLE IF NOT EXISTS tigre_fc_jobs_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job TEXT NOT NULL,
  iniciado_em TIMESTAMPTZ DEFAULT now(),
  finalizado_em TIMESTAMPTZ,
  status TEXT,
  criados INTEGER DEFAULT 0,
  atualizados INTEGER DEFAULT 0,
  erros INTEGER DEFAULT 0,
  detalhes JSONB
);
```

**Arquivos a criar:**
- `src/lib/tigre-fc/sofascore-client.ts` — HTTP client com cache, retry, backoff, 403/429 handling
- `src/lib/tigre-fc/calendario-provider.ts` — interface + implementação SofaScore + fallback manual
- `src/app/api/cron/sync-jogos/route.ts` — upsert por `external_id`, protegido por `CRON_SECRET`
- `src/lib/supabase-admin.ts` — cliente server-side com `SUPABASE_SERVICE_ROLE_KEY`

---

### FASE 2 — Máquina de estados

**Lógica derivada de `data_hora` + `status`:**
```
AGENDADO → (abertura automática quando publicado)
→ ESCALAÇÃO ABERTA (até data_hora - DEADLINE_MIN_ANTES)
→ ESCALAÇÃO FECHADA / AO VIVO (no kickoff)
→ ENCERRADO (status = 'encerrado' via cron)
→ PONTUADO (pontuado = true)
```

**Arquivos:**
- `src/lib/tigre-fc/jogo-estado.ts` — `getProximoJogoEscalavel()`, `getEstadoJogo()`, `isEscalacaoAberta()`

---

### FASE 3 — Rotas e telas

**Arquivos:**
- `src/app/tigre-fc/page.tsx` — hub/arena (entrada)
- `src/app/tigre-fc/escalar/page.tsx` — countdown + formulário de escalação
- `src/app/api/tigre-fc/salvar-escalacao/route.ts` — deadline server-side + Regra de Ouro
- `src/app/api/tigre-fc/jogo-ativo/route.ts` — expõe `getProximoJogoEscalavel()` para o client

---

### FASE 4 — Processamento de resultado e pontuação

**Regras de pontuação a confirmar/implementar:**
- Vitória do Novorizontino: +10 pts
- Empate: +5 pts
- Derrota: +0 pts
- Palpite exato (placar): +15 pts extra
- Capitão: pontos × 2
- Herói: pontos × 1.5
- (Outras regras precisam ser confirmadas — não há código atual)

**Arquivos:**
- `src/lib/tigre-fc/regras-pontuacao.ts` — módulo testável
- `src/app/api/cron/processar-rodada/route.ts` — idempotente via `pontuado` flag + UNIQUE em `tigre_fc_pontuacoes`

---

### FASE 5 — Ranking

- `view_ranking_geral` já existe no banco — verificar se já serve a necessidade
- `src/app/tigre-fc/ranking/page.tsx` — ranking geral + por rodada
- ISR com `revalidatePath` após processar rodada

---

### FASE 6 — Robustez

- Advisory lock (`pg_advisory_xact_lock`) nos crons
- Timezone BRT em toda fronteira
- `tigre_fc_jobs_log` para observabilidade
- Testes unit em `src/lib/tigre-fc/__tests__/`

---

### FASE 7 — Game design / engajamento

- Countdown, badge "ESCALAÇÃO ENCERRADA", tela de feedback pós-jogo
- Badges e conquistas
- Loop: escalar → torcer → ver pontuação → ranking → próxima rodada

---

## Env vars necessárias na Vercel

| Variável | Descrição | Status |
|----------|-----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto | ✅ Existe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon (RLS) | ✅ Existe |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server-only) | 🆕 Adicionar |
| `CRON_SECRET` | Token para autenticar rotas de cron | 🆕 Adicionar |
| `SOFASCORE_BASE_URL` | `https://api.sofascore.com/api/v1` | 🆕 Opcional |
| `SOFASCORE_USER_AGENT` | User-agent realista anti-bot | 🆕 Adicionar |
| `DEADLINE_MIN_ANTES` | Minutos antes do kickoff p/ fechar (default: `0`) | 🆕 Opcional |
| `TIGRE_FC_ADMIN_SECRET` | Admin routes | ✅ Existe |

---

## Aguardando aprovação para iniciar FASE 1
