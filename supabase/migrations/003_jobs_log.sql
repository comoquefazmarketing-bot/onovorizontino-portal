-- Log de execução dos jobs/crons
CREATE TABLE IF NOT EXISTS tigre_fc_jobs_log (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  job           TEXT        NOT NULL,
  iniciado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finalizado_em TIMESTAMPTZ,
  status        TEXT        CHECK (status IN ('ok','erro','parcial')),
  criados       INTEGER     DEFAULT 0,
  atualizados   INTEGER     DEFAULT 0,
  erros         INTEGER     DEFAULT 0,
  detalhes      JSONB
);

CREATE INDEX IF NOT EXISTS jobs_log_job_idx ON tigre_fc_jobs_log(job, iniciado_em DESC);

-- Sem RLS — apenas service role acessa
