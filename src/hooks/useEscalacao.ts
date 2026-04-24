// src/hooks/useEscalacao.ts
// Hook com cache localStorage + sincronização Supabase Realtime
// Escalação carrega instantaneamente do cache local
// e sincroniza em background quando necessário

import { useEffect, useState, useCallback, useRef } from 'react';

const CACHE_KEY = (googleId: string) => `tigre_esc_${googleId}`;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

interface EscalacaoData {
  formacao:              string;
  lineup:                Record<string, any>;
  bench:                 Record<string, any>;
  capitao_id:            number | null;
  heroi_id:              number | null;
  placar_palpite_tigre:  number;
  placar_palpite_adv:    number;
  jogo_id:               number | null;
  atualizado_em:         string | null;
}

interface CacheEntry {
  data:      EscalacaoData;
  cachedAt:  number;
}

function lerCache(googleId: string): EscalacaoData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY(googleId));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    // Expira após TTL
    if (Date.now() - entry.cachedAt > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY(googleId));
      return null;
    }
    return entry.data;
  } catch { return null; }
}

function salvarCache(googleId: string, data: EscalacaoData) {
  try {
    const entry: CacheEntry = { data, cachedAt: Date.now() };
    localStorage.setItem(CACHE_KEY(googleId), JSON.stringify(entry));
  } catch { /* localStorage cheio — ignora silenciosamente */ }
}

function limparCache(googleId: string) {
  try { localStorage.removeItem(CACHE_KEY(googleId)); } catch { }
}

export function useEscalacao(googleId: string | null) {
  const [escalacao,  setEscalacao]  = useState<EscalacaoData | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [saving,     setSaving]     = useState(false);
  const [mercado,    setMercado]    = useState<'aberto' | 'fechado' | 'verificando'>('verificando');
  const [erro,       setErro]       = useState<string | null>(null);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // ── Carrega escalação (cache → API) ──────────────────────
  const carregar = useCallback(async () => {
    if (!googleId) { setLoading(false); return; }

    // 1. Carrega do cache instantaneamente
    const cached = lerCache(googleId);
    if (cached) {
      setEscalacao(cached);
      setLoading(false);
    }

    // 2. Sincroniza em background com a API
    try {
      const res  = await fetch(`/api/escalacao?google_id=${googleId}`, { cache: 'no-store' });
      const data = await res.json();

      if (data.escalacao) {
        setEscalacao(data.escalacao);
        salvarCache(googleId, data.escalacao);
      } else if (!cached) {
        setEscalacao(null);
      }
    } catch {
      // Mantém cache se API falhar
    } finally {
      setLoading(false);
    }
  }, [googleId]);

  useEffect(() => { carregar(); }, [carregar]);

  // ── Salva escalação com debounce de 800ms ─────────────────
  const salvar = useCallback(async (dados: Partial<EscalacaoData>) => {
    if (!googleId || !escalacao) return;
    if (mercado === 'fechado') {
      setErro('Mercado fechado — escalação não pode ser alterada');
      return;
    }

    // Debounce — evita salvar a cada clique
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      setSaving(true);
      setErro(null);

      const novo = { ...escalacao, ...dados };

      // Otimista: atualiza UI e cache antes da confirmação do servidor
      setEscalacao(novo);
      salvarCache(googleId, novo);

      try {
        const res = await fetch('/api/escalacao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            google_id:     googleId,
            formacao:      novo.formacao,
            lineup:        novo.lineup,
            capitao_id:    novo.capitao_id,
            heroi_id:      novo.heroi_id,
            palpite_tigre: novo.placar_palpite_tigre,
            palpite_adv:   novo.placar_palpite_adv,
            bench:         novo.bench,
          }),
        });

        const result = await res.json();

        if (result.error === 'mercado_fechado') {
          setMercado('fechado');
          setErro('Mercado fechado — escalação salva até o fechamento');
          // Reverte para a versão salva antes do fechamento
          carregar();
        } else if (result.error) {
          setErro(result.message ?? result.error);
          carregar(); // Reverte
        } else {
          setMercado('aberto');
        }
      } catch {
        setErro('Erro de conexão — tente novamente');
        carregar(); // Reverte em caso de erro de rede
      } finally {
        setSaving(false);
      }
    }, 800);
  }, [googleId, escalacao, mercado, carregar]);

  // ── Substitui um jogador na lineup ───────────────────────
  const substituir = useCallback((slot: string, jogador: any) => {
    if (!escalacao) return;
    const lineup = { ...escalacao.lineup, [slot]: jogador };
    salvar({ lineup });
  }, [escalacao, salvar]);

  // ── Define capitão / herói ────────────────────────────────
  const definirCapitao = useCallback((id: number) => salvar({ capitao_id: id }), [salvar]);
  const definirHeroi   = useCallback((id: number) => salvar({ heroi_id: id }),   [salvar]);
  const salvarPalpite  = useCallback((tigre: number, adv: number) =>
    salvar({ placar_palpite_tigre: tigre, placar_palpite_adv: adv }), [salvar]);

  // ── Limpa cache ao sair ───────────────────────────────────
  const resetar = useCallback(() => {
    if (googleId) limparCache(googleId);
    setEscalacao(null);
  }, [googleId]);

  return {
    escalacao,
    loading,
    saving,
    mercado,
    erro,
    salvar,
    substituir,
    definirCapitao,
    definirHeroi,
    salvarPalpite,
    resetar,
    recarregar: carregar,
  };
}
