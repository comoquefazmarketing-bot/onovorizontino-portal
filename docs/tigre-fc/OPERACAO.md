# Tigre FC — Guia de Operação

## 1. Env vars obrigatórias na Vercel

| Variável | Onde pegar |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role |
| `CRON_SECRET` | Qualquer string aleatória segura (ex.: gerar com `openssl rand -hex 32`) |
| `SOFASCORE_USER_AGENT` | User-agent de navegador real |
| `DEADLINE_MIN_ANTES` | `0` (fecha no kickoff) — opcional |

## 2. Ordem das migrações (rodar no SQL Editor do Supabase)

1. `supabase/migrations/001_jogos_sync.sql` — colunas `status`, `external_updated_at`, `pontuado` em `jogos`
2. `supabase/migrations/002_tigre_fc_pontuacoes.sql` — tabela de pontuação de usuários
3. `supabase/migrations/003_jobs_log.sql` — log de execução dos crons

## 3. Testar localmente

```bash
# Sobe o servidor de dev
npm run dev

# Testa o cron de sync (precisa do .env.local configurado)
curl "http://localhost:3000/api/cron/sync-jogos?secret=tigre-cron-2026"

# Testa o jogo ativo
curl "http://localhost:3000/api/tigre-fc/jogo-ativo"

# Testa o cron de pontuação
curl "http://localhost:3000/api/cron/processar-rodada?secret=tigre-cron-2026"
```

## 4. Testar em produção

```bash
# Após deploy na Vercel:
curl -H "Authorization: Bearer <CRON_SECRET>" https://onovorizontino.com.br/api/cron/sync-jogos
curl https://onovorizontino.com.br/api/tigre-fc/jogo-ativo
```

## 5. Crons automáticos (vercel.json)

| Rota | Schedule | Descrição |
|------|----------|-----------|
| `/api/cron/sync-jogos` | `0 6,14 * * *` | Sincroniza calendário 2×/dia (6h e 14h BRT) |
| `/api/cron/processar-rodada` | `*/15 * * * *` | Verifica jogos encerrados a cada 15min |

## 6. Modo manual (fallback se SofaScore falhar)

Se o SofaScore estiver bloqueado/indisponível:
- O cron `sync-jogos` retorna `{ ok: false, erro: "Fonte indisponível — modo manual ativo" }` mas **não quebra** — retorna HTTP 200 para não fazer retry
- Os jogos continuam sendo gerenciados manualmente via Supabase Table Editor
- O game funciona normalmente — escalações, pontuação e ranking não dependem do SofaScore (só o sync)

Para adicionar jogos manualmente:
1. Supabase → Table Editor → `jogos`
2. Inserir com `status = 'agendado'` e `pontuado = false`
3. Deixar `external_id` como NULL (o sync vai preencher quando o SofaScore voltar)

## 7. Processar resultado manualmente

1. Atualizar `jogos` → setar `placar_mandante`, `placar_visitante`, `status = 'encerrado'`
2. Acionar o cron: `curl .../api/cron/processar-rodada?secret=<CRON_SECRET>`
3. O cron detecta o jogo encerrado e calcula a pontuação de todos os usuários

## 8. Próximos passos (não implementados)

- **Cadastrar elenco** em `tigre_fc_atletas` para habilitar a tela de lineup completo
- **Mapear atletas → SofaScore player IDs** para buscar stats individuais automaticamente
- **Ligas privadas** (`tigre_fc_ligas`) — infraestrutura no banco já existe
- **Badges** — `tigre_fc_badges` existe mas a lógica de concessão ainda não foi implementada
