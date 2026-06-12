-- Scouts por jogador por jogo — alimentado pelo cron-processar via SofaScore
-- A RPC processar_jogo_completo lê daqui para calcular pontos individuais

CREATE TABLE IF NOT EXISTS tigre_fc_scouts_jogadores (
  id              BIGSERIAL   PRIMARY KEY,
  jogo_id         INTEGER     NOT NULL REFERENCES jogos(id) ON DELETE CASCADE,
  jogador_id      INTEGER     NOT NULL,
  gols            INTEGER     NOT NULL DEFAULT 0,
  assistencias    INTEGER     NOT NULL DEFAULT 0,
  minutos_jogados INTEGER     NOT NULL DEFAULT 0,
  sem_gol_sofrido BOOLEAN     NOT NULL DEFAULT FALSE,
  cartao_amarelo  INTEGER     NOT NULL DEFAULT 0,
  cartao_vermelho INTEGER     NOT NULL DEFAULT 0,
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (jogo_id, jogador_id)
);

CREATE INDEX IF NOT EXISTS scouts_jogo_idx    ON tigre_fc_scouts_jogadores(jogo_id);
CREATE INDEX IF NOT EXISTS scouts_jogador_idx ON tigre_fc_scouts_jogadores(jogador_id);

-- Leitura pública (para exibir stats); escrita apenas via service role (cron)
ALTER TABLE tigre_fc_scouts_jogadores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "scouts_select_public" ON tigre_fc_scouts_jogadores;
CREATE POLICY "scouts_select_public" ON tigre_fc_scouts_jogadores FOR SELECT USING (true);
