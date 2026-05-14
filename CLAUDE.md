# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (runs type-check implicitly)
npm run lint     # ESLint
npm run start    # Serve production build
```

There are no automated tests. Verify changes by running `dev` and manually testing in the browser.

## Architecture Overview

**Portal O Novorizontino** is a Next.js 16 App Router fan news portal for Grêmio Novorizontino (Brazilian football club), built with React 19, TypeScript 5, Tailwind CSS 4, and Supabase.

The project has two main pillars:
1. **News portal** — articles fetched from Supabase (`postagens` table), with AI-generated content via the agent system.
2. **Tigre FC** — a fantasy football game (`/tigre-fc`) where fans pick lineups, predict scores, and compete in a leaderboard. No money involved; purely recreational.

### Supabase clients — two distinct clients

| File | Key used | When to use |
|------|----------|-------------|
| `src/lib/supabase.ts` | `ANON_KEY` | Client components (`'use client'`) |
| `src/utils/supabase/server.ts` | SSR cookie client | Server components and Route Handlers that need user session |
| Route handlers needing bypass | `SERVICE_ROLE_KEY` | Admin operations, point calculation, webhook handlers |

### Key Supabase tables

- `postagens` — news articles (`status`, `titulo`, `slug`, `categoria`, `imagem_capa`, `conteudo`, `autor_ia`)
- `jogos` — match schedule (`rodada`, `competicao`, `mandante_slug`, `visitante_slug`, `placar_*`, `finalizado`, `data_hora`)
- `tigre_fc_usuarios` — fantasy users linked by `google_id` (Google OAuth)
- `tigre_fc_escalacoes` — per-user lineup per match (`formacao`, `capitao_id`, `heroi_id`, `palpite_*`)
- `tigre_fc_scouts_jogadores` — per-player per-match stats (goals, assists, minutes, cards)
- `tigre_fc_pontuacoes` — computed point results; populated by Supabase RPC `processar_jogo_completo`

### AI Agent system (`src/lib/agents/`)

Six named agents exported from `src/lib/agents/index.ts` as `Equipe`:

| Variable | Agent class | Role |
|----------|-------------|------|
| `ana` | `AnaAgent` | Lineup intelligence — suggests XI, analyzes formations, player rankings |
| `gabi` | `GabiAgent` | Auto-generates match-result news posts to `postagens` table |
| `leo` | `MarketAgent` | Social copy / hype scripts / VoxSports content |
| `carlos` | `AuditorAgent` | Data integrity — validates lineups, syncs player status |
| `bruno` | `DealerAgent` | Retention — detects inactive users, generates push notifications |
| `rafael` | `RafaelAgent` | Weekly metrics reporting |

Each agent has a corresponding API route at `src/app/api/agents/[agent]/route.ts`. Routes protected by `AGENTS_SECRET` or `WEBHOOK_SECRET` env vars (if set; absent = open).

### Tigre FC scoring constants (canonical source of truth)

Defined in `src/app/api/tigre-fc/calcular-pontos/route.ts`:

```
GOL: 8 | ASSIST: 5 | TITULAR_60MIN: 2 | SEM_GOL_SOFRIDO: 5
PLACAR_EXATO: 15 | RESULTADO_CERTO: 5 | HEROI: 10 | RESERVA_ENTROU: 3
CARTAO_AMARELO: -2 | CARTAO_VERMELHO: -5
```

Point calculation is triggered server-side via POST `/api/tigre-fc/calcular-pontos` (protected by `TIGRE_FC_ADMIN_SECRET`), which calls the Supabase RPC `processar_jogo_completo`.

### Component directory conventions

```
src/components/
  layout/        # Global chrome: PortalHeader, Footer, Ticker, Navbar, LgpdBanner
  home/          # Home-page-specific: HomeHero, EscalacaoPopup, HomeNewsGrid
  tigre-fc/      # All fantasy game UI: lineup picker, chat, leaderboard, profile
  sections/      # Reusable page sections: CTCarousel, Manifesto, ProximoDuelo
  ads/           # Ad banners (Google AdSense)
  videos/        # TVNovorizontino, MainShortsSection
  widgets/       # NovorizontinoWidget (external schedule embed)
```

### Routing

- `src/app/page.tsx` — home (news grid, CT article, video sections)
- `src/app/noticias/[slug]/page.tsx` — individual article
- `src/app/tigre-fc/*` — fantasy game pages (login, lineup, result, ranking, profile, leagues)
- `src/app/admin/*` — admin tools (post cleanup, scout entry, tigre-fc admin)
- `src/app/api/*` — all API routes

### Static fallback data

`src/lib/data.ts` contains hardcoded `DB_NOTICIAS` articles used when Supabase is unavailable. This is legacy content that won't change.

### Auth flow

Authentication uses Google OAuth via Supabase Auth. After login, a `tigre_fc_usuarios` row is created/fetched using `google_id = user.id`. Client components use `supabase.auth.getUser()` from `src/lib/supabase.ts`.

### Required environment variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AGENTS_SECRET          # Optional: locks agent API routes
WEBHOOK_SECRET         # Optional: alternative to AGENTS_SECRET
TIGRE_FC_ADMIN_SECRET  # Locks /api/tigre-fc/calcular-pontos (default: "tigre2026")
```

### Next.js image domains

Allowed remote image hosts in `next.config.ts`: `placehold.co`, `whoglnpvqjbaczgnebbn.supabase.co`, `www.gremionovorizontino.com.br`. Add new image hosts here before using `<Image>` with external URLs.
