-- ============================================================
-- ATUALIZAÇÃO RODADA 8 — SÉRIE B 2026
-- Execute no Supabase SQL Editor:
-- https://supabase.com/dashboard/project/whoglnpvqjbaczgnebbn/editor
-- ============================================================

-- PASSO 1: Finalizar o jogo anterior (Rodada 7)
-- Marca como finalizado para que o próximo jogo apareça
UPDATE jogos
  SET finalizado = true, ativo = false
WHERE finalizado = false
  AND data_hora < NOW();

-- ============================================================
-- PASSO 2: Inserir/atualizar o adversário na tabela times_serie_b
-- Substitua os valores abaixo com os dados reais do adversário
-- ============================================================
INSERT INTO times_serie_b (nome, sigla, slug, escudo_url, cor_primaria)
VALUES (
  'NOME DO ADVERSÁRIO',          -- ex: 'Avaí Futebol Clube'
  'XXX',                         -- ex: 'AVI'
  'adversario-slug',             -- ex: 'avai'
  'URL_DO_ESCUDO',               -- ex: 'https://upload.wikimedia.org/...'
  '#000000'                      -- cor principal do clube
)
ON CONFLICT (slug) DO UPDATE SET
  nome       = EXCLUDED.nome,
  sigla      = EXCLUDED.sigla,
  escudo_url = EXCLUDED.escudo_url,
  cor_primaria = EXCLUDED.cor_primaria;

-- ============================================================
-- PASSO 3: Inserir o jogo da Rodada 8
-- Substitua TODOS os valores entre << >> com os dados reais
-- ============================================================
INSERT INTO jogos (
  competicao,
  rodada,
  data_hora,
  local,
  mandante_slug,
  visitante_slug,
  ativo,
  finalizado,
  placar_mandante,
  placar_visitante
)
VALUES (
  'Série B',
  'Rodada 8',
  '2026-XX-XX XX:00:00+00',    -- data/hora UTC — ex: '2026-05-17 22:00:00+00' = sábado 17/05 às 19h de SP
  'NOME DO ESTÁDIO — CIDADE',  -- ex: 'Estádio Jorjão — Novo Horizonte/SP'
  'novorizontino',             -- mandante_slug: 'novorizontino' se jogar em casa
  'adversario-slug',           -- visitante_slug: slug do adversário
  true,                        -- ativo = true para aparecer no componente
  false,                       -- finalizado = false
  null,                        -- placar_mandante
  null                         -- placar_visitante
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- VERIFICAÇÃO: Confirme que o jogo foi inserido corretamente
-- ============================================================
SELECT
  j.id,
  j.competicao,
  j.rodada,
  j.data_hora AT TIME ZONE 'America/Sao_Paulo' AS data_hora_sp,
  j.local,
  m.nome AS mandante,
  v.nome AS visitante,
  j.ativo,
  j.finalizado
FROM jogos j
LEFT JOIN times_serie_b m ON m.slug = j.mandante_slug
LEFT JOIN times_serie_b v ON v.slug = j.visitante_slug
WHERE j.finalizado = false
ORDER BY j.data_hora ASC
LIMIT 5;
