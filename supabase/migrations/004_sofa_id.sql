-- Coluna opcional para ID do SofaScore (diferente do ESPN external_id)
ALTER TABLE jogos ADD COLUMN IF NOT EXISTS sofa_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS jogos_sofa_id_key ON jogos(sofa_id) WHERE sofa_id IS NOT NULL;
