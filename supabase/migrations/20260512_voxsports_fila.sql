-- Fila de copies gerados pelo Léo (MarketAgent) a partir de eventos de jogo.
-- Usada pelo webhook /api/webhook/jogo e pela rota /api/agents/hype.

create table if not exists voxsports_fila (
  id         bigint generated always as identity primary key,
  jogo_id    int          references jogos(id) on delete set null,
  evento     text         not null,           -- 'gol', 'vitória', 'empate', etc.
  titulo     text         not null,
  copy       text         not null,
  publicado  boolean      not null default false,
  criado_em  timestamptz  not null default now()
);

-- Index para buscar copies pendentes por jogo
create index if not exists voxsports_fila_jogo_idx     on voxsports_fila(jogo_id);
create index if not exists voxsports_fila_publicado_idx on voxsports_fila(publicado, criado_em desc);

-- RLS: apenas service role escreve, anon pode ler copies publicados
alter table voxsports_fila enable row level security;

create policy "Leitura pública de copies publicados"
  on voxsports_fila for select
  using (publicado = true);

create policy "Service role pode tudo"
  on voxsports_fila for all
  using (auth.role() = 'service_role');
