'use client';

/**
 * useEscalacao — Hook de Persistência da Escalação
 * * Ajustado para Next.js 14/15/16 + Supabase SSR.
 * Corrigido erro de declaração duplicada e tipagem de state.
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
  // Inicialização única do Supabase Client
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [state, setState] = useState<EscalacaoState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoad = useRef(true);

  // ── 1. Resolve usuarioId a partir do google_id (auth.uid) ──────────────────
  useEffect(() => {
    let mounted = true;

    async function resolveUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !mounted) { 
        setIsLoading(false); 
        return; 
      }

      const googleId = session.user.id;

      const { data: existing } = await supabase
        .from('tigre_fc_usuarios')
        .select('id')
        .eq('google_id', googleId)
        .maybeSingle();

      if (existing) {
        if (mounted) setUsuarioId(existing.id);
      } else {
        // Cria novo perfil se for primeiro acesso
        const { data: created } = await supabase
          .from('tigre_fc_usuarios')
          .insert({
            google_id: googleId,
            display_name: session.user.user_metadata?.full_name ?? 'Torcedor',
            avatar_url: session.user.user_metadata?.avatar_url ?? null,
          })
          .select('id')
          .single();

        if (mounted && created) setUsuarioId(created.id);
      }
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
        .maybeSingle();

      if (data && !error && isInitialLoad.current) {
        const rawLineup = data.lineup_json ?? {};
        const safeLineup: LineupRecord = {};
        
        Object.entries(rawLineup as object).forEach(([slotId, player]) => {
          safeLineup[slotId] = player ? (player as Player) : null;
        });

        setState({
          formacao: data.formacao ?? DEFAULT_STATE.formacao,
          lineup: safeLineup,
          captainId: data.capitan_id ?? null,
          heroId: data.heroi_id ?? null,
          scoreTigre: data.score_tigre ?? 0,
          scoreAdv: data.score_adv ?? 0,
          scoreLocked: data.score_locked ?? false,
        });
      }

      setIsLoading(false);
      isInitialLoad.current = false;
    }

    loadEscalacao();
  }, [usuarioId, supabase]);

  // ── 3. saveNow — Upsert imediato via RPC ────────────────────────────────────
  const saveNow = useCallback(async (currentState: EscalacaoState) => {
    if (!usuarioId) return;

    setSaveStatus('saving');

    try {
      const { error } = await supabase.rpc('upsert_escalacao', {
        p_usuario_id:   usuarioId,
        p_formacao:     currentState.formacao,
        p_lineup_json:  currentState.lineup as any,
        p_capitan_id:   currentState.captainId,
        p_heroi_id:     currentState.heroId,
        p_score_tigre:  currentState.scoreTigre,
        p_score_adv:    currentState.scoreAdv,
        p_score_locked: currentState.scoreLocked,
        p_jogo_ref:     jogoRef ?? null,
      });

      setSaveStatus(error ? 'error' : 'saved');
      if (!error) setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  }, [usuarioId, supabase, jogoRef]);

  // ── 4. Auto-save com debounce ───────────────────────────────────────────────
  useEffect(() => {
    if (isInitialLoad.current || !usuarioId) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      saveNow(state);
    }, 1000); // Debounce de 1s para evitar spam no Supabase

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state, usuarioId, saveNow]);

  // ── 5. Setters ──────────────────────────────────────────────────────────────

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
    const newState = { ...state, scoreLocked: true };
    setState(newState);
    await saveNow(newState);
  }, [state, saveNow]);

  const resetLineup = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  return {
    ...state,
    usuarioId,
    isLoading,
    saveStatus,
    isAuthenticated: !!usuarioId,
    setFormacao,
    setPlayerInSlot,
    setCaptainId,
    setHeroId,
    setScore,
    lockScore,
    resetLineup,
    saveNow: () => saveNow(state),
  };
}
