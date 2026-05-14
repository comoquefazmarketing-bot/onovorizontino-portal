# CLAUDE.md

Este arquivo orienta o Claude Code (claude.ai/code) ao trabalhar com o código deste repositório.

## Comandos

```bash
npm run dev      # Inicia o servidor de desenvolvimento (localhost:3000)
npm run build    # Build de produção (executa type-check implicitamente)
npm run lint     # ESLint
npm run start    # Serve o build de produção
```

Não há testes automatizados. Verifique as alterações rodando `dev` e testando manualmente no browser.

## Visão Geral da Arquitetura

**Portal O Novorizontino** é um portal de notícias para torcedores do Grêmio Novorizontino (clube de futebol brasileiro), construído com Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4 e Supabase.

O projeto tem dois pilares principais:
1. **Portal de notícias** — artigos buscados do Supabase (tabela `postagens`), com conteúdo gerado por IA via sistema de agentes.
2. **Tigre FC** — jogo de fantasy football (`/tigre-fc`) onde torcedores montam escalações, apostam no placar e competem num ranking. Sem dinheiro envolvido; puramente recreativo.

### Clientes Supabase — dois clientes distintos

| Arquivo | Chave usada | Quando usar |
|---------|-------------|-------------|
| `src/lib/supabase.ts` | `ANON_KEY` | Client components (`'use client'`) |
| `src/utils/supabase/server.ts` | SSR cookie client | Server components e Route Handlers que precisam de sessão do usuário |
| Route handlers com bypass | `SERVICE_ROLE_KEY` | Operações admin, cálculo de pontos, webhook handlers |

### Tabelas principais do Supabase

- `postagens` — artigos de notícias (`status`, `titulo`, `slug`, `categoria`, `imagem_capa`, `conteudo`, `autor_ia`)
- `jogos` — calendário de partidas (`rodada`, `competicao`, `mandante_slug`, `visitante_slug`, `placar_*`, `finalizado`, `data_hora`)
- `tigre_fc_usuarios` — usuários do fantasy vinculados por `google_id` (Google OAuth)
- `tigre_fc_escalacoes` — escalação por usuário por partida (`formacao`, `capitao_id`, `heroi_id`, `palpite_*`)
- `tigre_fc_scouts_jogadores` — estatísticas por jogador por partida (gols, assistências, minutos, cartões)
- `tigre_fc_pontuacoes` — resultados de pontuação calculados; populado pela RPC do Supabase `processar_jogo_completo`

### Sistema de agentes de IA (`src/lib/agents/`)

Seis agentes nomeados exportados de `src/lib/agents/index.ts` como `Equipe`:

| Variável | Classe do agente | Função |
|----------|------------------|--------|
| `ana` | `AnaAgent` | Inteligência de escalação — sugere XI, analisa formações, ranking de jogadores |
| `gabi` | `GabiAgent` | Gera automaticamente posts de resultado de partida na tabela `postagens` |
| `leo` | `MarketAgent` | Copy para redes sociais / scripts de hype / conteúdo VoxSports |
| `carlos` | `AuditorAgent` | Integridade de dados — valida escalações, sincroniza status de jogadores |
| `bruno` | `DealerAgent` | Retenção — detecta usuários inativos, gera push notifications |
| `rafael` | `RafaelAgent` | Relatórios semanais de métricas |

Cada agente tem uma rota de API correspondente em `src/app/api/agents/[agent]/route.ts`. Rotas protegidas pelas variáveis de ambiente `AGENTS_SECRET` ou `WEBHOOK_SECRET` (se definidas; ausentes = abertas).

### Constantes de pontuação do Tigre FC (fonte canônica)

Definidas em `src/app/api/tigre-fc/calcular-pontos/route.ts`:

```
GOL: 8 | ASSIST: 5 | TITULAR_60MIN: 2 | SEM_GOL_SOFRIDO: 5
PLACAR_EXATO: 15 | RESULTADO_CERTO: 5 | HEROI: 10 | RESERVA_ENTROU: 3
CARTAO_AMARELO: -2 | CARTAO_VERMELHO: -5
```

O cálculo de pontos é disparado server-side via POST `/api/tigre-fc/calcular-pontos` (protegido por `TIGRE_FC_ADMIN_SECRET`), que chama a RPC do Supabase `processar_jogo_completo`.

### Convenções de diretório de componentes

```
src/components/
  layout/        # Chrome global: PortalHeader, Footer, Ticker, Navbar, LgpdBanner
  home/          # Específicos da home: HomeHero, EscalacaoPopup, HomeNewsGrid
  tigre-fc/      # Toda a UI do jogo fantasy: seletor de escalação, chat, ranking, perfil
  sections/      # Seções reutilizáveis: CTCarousel, Manifesto, ProximoDuelo
  ads/           # Banners de anúncio (Google AdSense)
  videos/        # TVNovorizontino, MainShortsSection
  widgets/       # NovorizontinoWidget (embed externo de calendário)
```

**Arquivos legados — não usar.** A raiz de `src/components/` contém arquivos soltos que são versões antigas dos componentes canônicos nos subdiretórios acima:
`BannerComercial.tsx`, `BannerMaster.tsx`, `Footer.tsx`, `Header.tsx`, `HomeHero.tsx`, `MatchCard.tsx`, `Navbar.tsx`, `NewsCard.tsx`, `NewsGrid.tsx`, `Sidebar.tsx`.
Todo código novo deve importar sempre dos subdiretórios (`layout/`, `home/`, etc.), nunca desses arquivos na raiz.

### Roteamento

- `src/app/page.tsx` — home (grade de notícias, artigo CT, seções de vídeo)
- `src/app/noticias/[slug]/page.tsx` — artigo individual
- `src/app/tigre-fc/*` — páginas do jogo fantasy (login, escalação, resultado, ranking, perfil, ligas)
- `src/app/admin/*` — ferramentas admin (limpeza de posts, entrada de scout, admin do tigre-fc)
- `src/app/api/*` — todas as rotas de API

### Dados estáticos de fallback

`src/lib/data.ts` contém artigos `DB_NOTICIAS` hardcoded usados quando o Supabase está indisponível. É conteúdo legado que não será alterado.

### Fluxo de autenticação

A autenticação usa Google OAuth via Supabase Auth. Após o login, uma linha em `tigre_fc_usuarios` é criada/buscada usando `google_id = user.id`. Client components usam `supabase.auth.getUser()` de `src/lib/supabase.ts`.

### Variáveis de ambiente necessárias

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AGENTS_SECRET          # Opcional: protege as rotas de API dos agentes
WEBHOOK_SECRET         # Opcional: alternativa ao AGENTS_SECRET
TIGRE_FC_ADMIN_SECRET  # Protege /api/tigre-fc/calcular-pontos (padrão: "tigre2026")
```

### Domínios de imagem do Next.js

Hosts de imagem remota permitidos em `next.config.ts`: `placehold.co`, `whoglnpvqjbaczgnebbn.supabase.co`, `www.gremionovorizontino.com.br`. Adicione novos hosts aqui antes de usar `<Image>` com URLs externas.
