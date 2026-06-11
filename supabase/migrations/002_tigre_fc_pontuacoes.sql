-- Tabela de pontuação por usuário/jogo (fantasy)
-- UNIQUE (usuario_id, jogo_id) garante idempotência do cron

CREATE TABLE IF NOT EXISTS tigre_fc_pontuacoes (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID        NOT NULL REFERENCES tigre_fc_usuarios(id) ON DELETE CASCADE,
  jogo_id       INTEGER     NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
  pontos        INTEGER     NOT NULL DEFAULT 0,
  detalhes      JSONB,
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (usuario_id, jogo_id)
);

CREATE INDEX IF NOT EXISTS tigre_fc_pontuacoes_usuario_idx ON tigre_fc_pontuacoes(usuario_id);
CREATE INDEX IF NOT EXISTS tigre_fc_pontuacoes_jogo_idx    ON tigre_fc_pontuacoes(jogo_id);

-- RLS: usuário lê as próprias pontuações; leitura pública do ranking
ALTER TABLE tigre_fc_pontuacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "pontuacoes_select_own" ON tigre_fc_pontuacoes;
CREATE POLICY "pontuacoes_select_own"
  ON tigre_fc_pontuacoes FOR SELECT
  USING (auth.uid()::text = (SELECT google_id FROM tigre_fc_usuarios WHERE id = usuario_id));

DROP POLICY IF EXISTS "pontuacoes_select_public" ON tigre_fc_pontuacoes;
CREATE POLICY "pontuacoes_select_public"
  ON tigre_fc_pontuacoes FOR SELECT
  USING (true);
