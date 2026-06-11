-- Migration: cria tigre_fc_resultados se não existir
-- Tabela de controle de idempotência para processamento de resultados
-- Executar no Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS tigre_fc_resultados (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jogo_id         integer NOT NULL UNIQUE,
  gols_mandante   integer NOT NULL DEFAULT 0,
  gols_visitante  integer NOT NULL DEFAULT 0,
  processado      boolean NOT NULL DEFAULT false,
  processado_em   timestamptz,
  criado_em       timestamptz NOT NULL DEFAULT now()
);

-- Index para lookup rápido por jogo
CREATE INDEX IF NOT EXISTS idx_tigre_fc_resultados_jogo
  ON tigre_fc_resultados (jogo_id);

-- RLS: service_role lê/escreve; usuários autenticados só leem
ALTER TABLE tigre_fc_resultados ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "service_role_all"   ON tigre_fc_resultados;
DROP POLICY IF EXISTS "authenticated_read" ON tigre_fc_resultados;

CREATE POLICY "service_role_all" ON tigre_fc_resultados
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_read" ON tigre_fc_resultados
  FOR SELECT TO authenticated USING (true);

-- Backfill: marca como processados os jogos que já têm placar e estão finalizados
-- (para não reprocessar jogos antigos ao primeiro deploy)
INSERT INTO tigre_fc_resultados (jogo_id, gols_mandante, gols_visitante, processado, processado_em)
SELECT
  id,
  COALESCE(placar_mandante, 0),
  COALESCE(placar_visitante, 0),
  true,
  now()
FROM jogos
WHERE finalizado = true
  AND placar_mandante IS NOT NULL
  AND placar_visitante IS NOT NULL
ON CONFLICT (jogo_id) DO NOTHING;
