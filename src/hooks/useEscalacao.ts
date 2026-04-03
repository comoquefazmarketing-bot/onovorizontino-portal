'use client';

/**
 * useEscalacao — Hook de Persistência da Escalação
 * 
 * REGRA DE OURO: Nunca usa auth.uid() direto nas queries.
 * Sempre converte via tigre_fc_usuarios filtrando por google_id.
 * 
 * Estratégia de Upsert:
 *   - Ao montar: tenta carregar lineup salvo do Supabase (null-safe)
 *   - Auto-save debounced a cada mudança de lineup (500ms)
 *   - saveNow() para salvar imediatamente antes de ações críticas
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

// ─── Default State ────────────────────────────────────────────────────────────

const DEFAULT_STATE: EscalacaoState = {
  formacao: '4-2-3-1',
  lineup: {},
  captainId: null,
  heroId: null,
  scoreTigre: 0,
  scoreAdv: 0,
  scoreLocked: false,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useEscalacao(jogoRef?: string) {
  const supabase = createClientComponentClient();
  const [usuarioId, setUsuarioId]     = useState<string | null>(null);
  const [state, setState]             = useState<EscalacaoState>(DEFAULT_STATE);
  const [isLoading, setIsLoading]     = useState(true);
  const [saveStatus, setSaveStatus]   = useState<SaveStatus>('idle');
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // ── 1. Resolve usuarioId a partir do google_id (auth.uid) ──────────────────
  useEffect(() => {
    let mounted = true;

    async function resolveUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !mounted) { setIsLoading(false); return; }

      const googleId = session.user.id; // auth.uid() === google_id

      // Tenta buscar usuário existente
      const { data: existing } = await supabase
        .from('tigre_fc_usuarios')
        .select('id')
        .eq('google_id', googleId)
        .single();

      if (existing) {
        if (mounted) setUsuarioId(existing.id);
        return;
      }

      // Cria novo perfil se for primeiro acesso
      const { data: created } = await supabase
        .from('tigre_fc_usuarios')
        .insert({
          google_id:    googleId,
          display_name: session.user.user_metadata?.full_name ?? 'Torcedor',
          avatar_url:   session.user.user_metadata?.avatar_url ?? null,
        })
        .select('id')
        .single();

      if (mounted && created) setUsuarioId(created.id);
    }

    resolveUser();
    return () => { mounted = false; };
  }, [supabase]);

  // ── 2. Carrega escalação salva quando usuarioId estiver pronto ──────────────
  useEffect(() => {
    if (!usuarioId) return;

    async function loadEscalacao() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('tigre_fc_escalacoes')
        .select('*')
        .eq('usuario_id', usuarioId)
        .maybeSingle(); // maybeSingle: retorna null se não existir, sem erro

      if (data && !error) {
        // null-safe parse do lineup_json
        const rawLineup = data.lineup_json ?? {};
        const safeLineup: LineupRecord = {};
        
        // Garante que cada valor do lineup é Player | null (nunca undefined)
        Object.entries(rawLineup).forEach(([slotId, player]) => {
          safeLineup[slotId] = player ? (player as Player) : null;
        });

        setState({
          formacao:    data.formacao     ?? DEFAULT_STATE.formacao,
          lineup:      safeLineup,
          captainId:   data.capitan_id  ?? null,
          heroId:      data.heroi_id    ?? null,
          scoreTigre:  data.score_tigre ?? 0,
          scoreAdv:    data.score_adv   ?? 0,
          scoreLocked: data.score_locked ?? false,
        });
      }

      setIsLoading(false);
      isInitialLoad.current = false;
    }

    loadEscalacao();
  }, [usuarioId, supabase]);

  // ── 3. Auto-save com debounce (500ms) após cada mudança ────────────────────
  useEffect(() => {
    // Não salva na carga inicial ou sem usuário autenticado
    if (isInitialLoad.current || !usuarioId) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      saveNow();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state, usuarioId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 4. saveNow — Upsert imediato via RPC (sem race condition) ──────────────
  const saveNow = useCallback(async () => {
    if (!usuarioId) return;

    setSaveStatus('saving');

    try {
      const { error } = await supabase.rpc('upsert_escalacao', {
        p_usuario_id:   usuarioId,
        p_formacao:     state.formacao,
        p_lineup_json:  state.lineup as any,
        p_capitan_id:   state.captainId,
        p_heroi_id:     state.heroId,
        p_score_tigre:  state.scoreTigre,
        p_score_adv:    state.scoreAdv,
        p_score_locked: state.scoreLocked,
        p_jogo_ref:     jogoRef ?? null,
      });

      setSaveStatus(error ? 'error' : 'saved');
      if (!error) setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [usuarioId, state, supabase, jogoRef]);

  // ── 5. Setters tipados (atualizam state → auto-save dispara) ───────────────

  const setFormacao = useCallback((formacao: string) => {
    setState(prev => ({ ...prev, formacao, lineup: {}, captainId: null, heroId: null }));
  }, []);

  const setPlayerInSlot = useCallback((slotId: string, player: Player | null) => {
    setState(prev => ({ ...prev, lineup: { ...prev.lineup, [slotId]: player } }));
  }, []);

  const setCaptainId = useCallback((id: number | null) => {
    setState(prev => ({ ...prev, captainId: id }));
  }, []);

  const setHeroId = useCallback((id: number | null) => {
    setState(prev => ({ ...prev, heroId: id }));
  }, []);

  const setScore = useCallback((tigre: number, adv: number) => {
    setState(prev => ({ ...prev, scoreTigre: tigre, scoreAdv: adv }));
  }, []);

  const lockScore = useCallback(async () => {
    setState(prev => ({ ...prev, scoreLocked: true }));
    // Força save imediato ao cravar palpite
    await saveNow();
  }, [saveNow]);

  const resetLineup = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    // Estado
    ...state,
    usuarioId,
    isLoading,
    saveStatus,
    isAuthenticated: !!usuarioId,
    // Setters
    setFormacao,
    setPlayerInSlot,
    setCaptainId,
    setHeroId,
    setScore,
    lockScore,
    resetLineup,
    saveNow,
  };
}
