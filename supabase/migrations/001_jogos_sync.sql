-- Adiciona colunas de sincronização e estado na tabela jogos
-- Idempotente: usa IF NOT EXISTS / ON CONFLICT

ALTER TABLE jogos
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'agendado'
    CHECK (status IN ('agendado','ao_vivo','encerrado','adiado')),
  ADD COLUMN IF NOT EXISTS external_updated_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS pontuado BOOLEAN NOT NULL DEFAULT FALSE;

-- Preenche status a partir dos booleans existentes (migração de dados)
UPDATE jogos SET status = 'encerrado' WHERE finalizado = TRUE AND status = 'agendado';
UPDATE jogos SET status = 'ao_vivo'   WHERE ativo = TRUE AND finalizado = FALSE AND status = 'agendado'
  AND data_hora < NOW() AND data_hora > NOW() - INTERVAL '3 hours';

-- Índice único no external_id (só para linhas não-nulas)
CREATE UNIQUE INDEX IF NOT EXISTS jogos_external_id_key
  ON jogos(external_id)
  WHERE external_id IS NOT NULL;

-- Índice para queries de "próximo jogo"
CREATE INDEX IF NOT EXISTS jogos_data_hora_status_idx ON jogos(data_hora, status);
