'use client';

/**
 * useEscalacao v4 — Hook de Persistência Null-Safe
 *
 * Regras de Ouro:
 * 1. NUNCA usar auth.uid() diretamente — sempre converter via tigre_fc_usuarios.google_id
 * 2. Upsert via RPC `upsert_escalacao` (SECURITY DEFINER no Supabase)
 * 3. Auto-save com debounce de 1.2s para não spammar o banco
 * 4. Carregamento imediato null-safe: lineup_json é parse defensivo
 * 5. Estado inicial vem do banco; localStorage é APENAS cache de fallback offline
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type Player = {
  id: number;
  name: string;
  short: string;
  num: number;
  pos: 'GOL' | 'LAT' | 'ZAG' | 'MEI' | 'ATA';
  foto: string;
};

export type LineupRecord = Record<string, Player | null>;

export type EscalacaoState = {
  formacao: string;
  lineup: LineupRecord;
  captainId: number | null;
  heroId: number | null;
  scoreTigre: number;
  scoreAdv: number;
  scoreLocked: boolean;
};

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// ─── Constante de estado inicial ─────────────────────────────────────────────

const DEFAULT_STATE: EscalacaoState = {
  formacao: '4-2-3-1',
  lineup: {},
  captainId: null,
  heroId: null,
  scoreTigre: 0,
  scoreAdv: 0,
  scoreLocked: false,
};

const CACHE_KEY = 'tigre_fc_lineup_cache';

// ─── Helpers de parse seguro ─────────────────────────────────────────────────

function parseLineupSafe(raw: unknown): LineupRecord {
  if (!raw || typeof raw !== 'object') return {};
  const result: LineupRecord = {};
  for (const [key, val] of Object.entries(raw as object)) {
    if (val === null || val === undefined) {
      result[key] = null;
    } else if (typeof val === 'object' && 'id' in val) {
      result[key] = val as Player;
    } else {
      result[key] = null; // descarta dado corrompido
    }
  }
  return result;
}

// ─── Hook Principal ───────────────────────────────────────────────────────────

export function useEscalacao(jogoIdOrRef?: number | string | null, jogoRefArg?: string) {
  // Retrocompatibilidade: aceita useEscalacao('slug') OU useEscalacao(42, 'slug')
  const jogoId  = typeof jogoIdOrRef === 'number' ? jogoIdOrRef : null;
  const jogoRef = typeof jogoIdOrRef === 'string'  ? jogoIdOrRef : jogoRefArg;
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  const [usuarioId, setUsuarioId]   = useState<string | null>(null);
  const [state, setState]           = useState<EscalacaoState>(DEFAULT_STATE);
  const [isLoading, setIsLoading]   = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad   = useRef(true);
  const lastSavedRef    = useRef<string>(''); // hash para evitar saves idênticos

  // ── 1. Resolve usuarioId via google_id (Regra de Ouro) ─────────────────────
  useEffect(() => {
    let alive = true;

    async function resolveUser() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        if (alive) setIsLoading(false);
        return;
      }

      const googleId = session.user.id;

      // Tenta encontrar usuário existente
      const { data: existing } = await supabase
        .from('tigre_fc_usuarios')
        .select('id')
        .eq('google_id', googleId)
        .maybeSingle();

      if (existing) {
        if (alive) setUsuarioId(existing.id);
        return;
      }

      // Primeiro acesso → cria perfil
      const { data: created } = await supabase
        .from('tigre_fc_usuarios')
        .insert({
          google_id:    googleId,
          display_name: session.user.user_metadata?.full_name ?? 'Torcedor',
          avatar_url:   session.user.user_metadata?.avatar_url ?? null,
        })
        .select('id')
        .single();

      if (alive && created) setUsuarioId(created.id);
    }

    resolveUser();
    return () => { alive = false; };
  }, [supabase]);

  // ── 2. Carrega escalação do banco quando usuarioId estiver pronto ──────────
  useEffect(() => {
    if (!usuarioId) return;
    let alive = true;

    async function loadEscalacao() {
      setIsLoading(true);

      // Monta query conforme contexto (com jogo ou rascunho geral)
      let query = supabase
        .from('tigre_fc_escalacoes')
        .select('*')
        .eq('usuario_id', usuarioId);

      if (jogoId != null) {
        query = query.eq('jogo_id', jogoId);
      } else {
        query = query.is('jogo_id', null);
      }

      const { data, error } = await query
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!alive) return;

      if (data && !error && isInitialLoad.current) {
        const safeLineup = parseLineupSafe(data.lineup_json);

        const loaded: EscalacaoState = {
          formacao:    data.formacao     ?? DEFAULT_STATE.formacao,
          lineup:      safeLineup,
          captainId:   data.capitan_id   ?? null,
          heroId:      data.heroi_id     ?? null,
          scoreTigre:  data.score_tigre  ?? 0,
          scoreAdv:    data.score_adv    ?? 0,
          scoreLocked: data.score_locked ?? false,
        };

        setState(loaded);
        // Atualiza cache local como fallback
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(loaded));
        } catch { /* storage bloqueado */ }
      } else if (!data && isInitialLoad.current) {
        // Sem save no banco → tenta cache local
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached) as EscalacaoState;
            parsed.lineup = parseLineupSafe(parsed.lineup); // re-sanitiza
            setState(parsed);
          }
        } catch { /* corrupted cache */ }
      }

      setIsLoading(false);
      isInitialLoad.current = false;
    }

    loadEscalacao();
    return () => { alive = false; };
  }, [usuarioId, jogoId, supabase]);

  // ── 3. saveNow — Upsert atômico via RPC SECURITY DEFINER ───────────────────
  const saveNow = useCallback(async (currentState: EscalacaoState) => {
    if (!usuarioId) return;

    // Evita saves idênticos (hash simples)
    const stateHash = JSON.stringify(currentState);
    if (stateHash === lastSavedRef.current) return;

    setSaveStatus('saving');

    try {
      const result = await supabase.rpc('upsert_escalacao', {
        p_usuario_id:   usuarioId,
        p_formacao:     currentState.formacao,
        p_lineup_json:  currentState.lineup as unknown as Record<string, unknown>,
        p_capitan_id:   currentState.captainId,
        p_heroi_id:     currentState.heroId,
        p_score_tigre:  currentState.scoreTigre,
        p_score_adv:    currentState.scoreAdv,
        p_score_locked: currentState.scoreLocked,
        p_jogo_id:      jogoId ?? null,
        p_jogo_ref:     jogoRef ?? null,
      });

      if (result.error || result.data?.ok === false) {
        setSaveStatus('error');
        console.error('[useEscalacao] Erro ao salvar:', result.error ?? result.data?.error);
      } else {
        setSaveStatus('saved');
        lastSavedRef.current = stateHash;
        // Atualiza cache local
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(currentState));
        } catch { /* storage bloqueado */ }
        setTimeout(() => setSaveStatus('idle'), 2500);
      }
    } catch (err) {
      setSaveStatus('error');
      console.error('[useEscalacao] Exceção:', err);
    }
  }, [usuarioId, jogoId, jogoRef, supabase]);

  // ── 4. Auto-save com debounce ───────────────────────────────────────────────
  useEffect(() => {
    if (isInitialLoad.current || !usuarioId) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveNow(state), 1200);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state, usuarioId, saveNow]);

  // ── 5. Mutadores de estado ─────────────────────────────────────────────────

  const setFormacao = useCallback((formacao: string) => {
    setState(prev => ({ ...prev, formacao, lineup: {} })); // reset lineup ao trocar formação
  }, []);

  const setPlayerInSlot = useCallback((slotId: string, player: Player | null) => {
    setState(prev => {
      const newLineup = { ...prev.lineup };

      // Remove o jogador de outros slots (evita duplicação)
      if (player) {
        for (const key of Object.keys(newLineup)) {
          if (newLineup[key]?.id === player.id) {
            newLineup[key] = null;
          }
        }
      }

      newLineup[slotId] = player;
      return { ...prev, lineup: newLineup };
    });
  }, []);

  const setCaptain = useCallback((captainId: number | null) => {
    setState(prev => ({ ...prev, captainId }));
  }, []);

  const setHero = useCallback((heroId: number | null) => {
    setState(prev => ({ ...prev, heroId }));
  }, []);

  const setScore = useCallback((tigre: number, adv: number) => {
    setState(prev => ({
      ...prev,
      scoreTigre: Math.max(0, tigre),
      scoreAdv:   Math.max(0, adv),
    }));
  }, []);

  const lockScore = useCallback(() => {
    setState(prev => ({ ...prev, scoreLocked: !prev.scoreLocked }));
  }, []);

  const resetLineup = useCallback(() => {
    setState(DEFAULT_STATE);
    lastSavedRef.current = '';
  }, []);

  const forceSave = useCallback(() => saveNow(state), [saveNow, state]);

  // ── 6. Estatísticas derivadas ──────────────────────────────────────────────

  const totalPlayers = Object.values(state.lineup).filter(Boolean).length;
  const isLineupComplete = totalPlayers === 11;

  return {
    // Estado
    usuarioId,
    state,
    isLoading,
    saveStatus,
    totalPlayers,
    isLineupComplete,

    // Mutadores
    setFormacao,
    setPlayerInSlot,
    setCaptain,
    setHero,
    setScore,
    lockScore,
    resetLineup,
    forceSave,

    // Acesso direto ao estado (conveniência)
    formacao:    state.formacao,
    lineup:      state.lineup,
    captainId:   state.captainId,
    heroId:      state.heroId,
    scoreTigre:  state.scoreTigre,
    scoreAdv:    state.scoreAdv,
    scoreLocked: state.scoreLocked,
  };
}
