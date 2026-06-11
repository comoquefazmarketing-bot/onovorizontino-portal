// src/hooks/useRealtimeScout.ts
// Hook Realtime que escuta scouts_reais e dispara eventos visuais
// no JumbotronJogo via estado React + CustomEvents

import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// ── Tipos de eventos ───────────────────────────────────────
export type ScoutEventType =
  | 'gol'
  | 'cartao_amarelo'
  | 'cartao_vermelho'
  | 'var_inicio'
  | 'var_confirmado'
  | 'var_cancelado'
  | 'idle';

export interface ScoutEvent {
  tipo:        ScoutEventType;
  jogador_id?: number;
  jogo_id:     number;
  minuto?:     number;
  payload?:    Record<string, unknown>;
  ts:          number; // timestamp para debounce
}

export interface ScoutState {
  evento:          ScoutEvent | null;
  varAndamento:    boolean;
  golsNovo:        number;
  golsAdv:         number;
  cartoes:         Array<{ jogador_id: number; tipo: 'amarelo' | 'vermelho'; ts: number }>;
  ultimaAtualizacao: number | null;
}

// ── Hook principal ─────────────────────────────────────────
export function useRealtimeScout(jogoId: number | null) {
  const [state, setState] = useState<ScoutState>({
    evento:            null,
    varAndamento:      false,
    golsNovo:          0,
    golsAdv:           0,
    cartoes:           [],
    ultimaAtualizacao: null,
  });

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const prevRef     = useRef<Record<number, any>>({});

  // Limpa o evento após a animação terminar (evita flash duplo)
  const clearEvento = useCallback((delay = 3500) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, evento: null }));
    }, delay);
  }, []);

  useEffect(() => {
    if (!jogoId) return;

    // Carrega estado inicial dos scouts (jogo já em andamento)
    async function loadInitial() {
      const { data } = await supabase
        .from('scouts_reais')
        .select('jogador_id, gols, cartao_amarelo, cartao_vermelho, sg, var_em_andamento, minutos_jogados')
        .eq('jogo_id', jogoId);

      if (!data) return;

      let golsNovo = 0;
      const cartoes: ScoutState['cartoes'] = [];

      data.forEach(s => {
        prevRef.current[s.jogador_id] = s;
        golsNovo += s.gols ?? 0;
        if (s.cartao_amarelo) cartoes.push({ jogador_id: s.jogador_id, tipo: 'amarelo', ts: Date.now() });
        if (s.cartao_vermelho) cartoes.push({ jogador_id: s.jogador_id, tipo: 'vermelho', ts: Date.now() });
      });

      const varAtivo = data.some(s => s.var_em_andamento);

      setState(prev => ({
        ...prev,
        golsNovo,
        cartoes,
        varAndamento:      varAtivo,
        ultimaAtualizacao: Date.now(),
      }));
    }

    loadInitial();

    // Subscrição Realtime
    const channel = supabase
      .channel(`scout-live-${jogoId}`)
      .on(
        'postgres_changes',
        {
          event:  '*',
          schema: 'public',
          table:  'scouts_reais',
          filter: `jogo_id=eq.${jogoId}`,
        },
        (payload) => {
          const novo  = payload.new as any;
          const prev  = prevRef.current[novo?.jogador_id] ?? {};
          const ts    = Date.now();

          // Debounce de 200ms para não tratar eventos em rajada
          if (debounceRef.current) clearTimeout(debounceRef.current);

          // ── DETECTA GOL ──────────────────────────────────
          if ((novo.gols ?? 0) > (prev.gols ?? 0)) {
            const evt: ScoutEvent = {
              tipo:        'gol',
              jogador_id:  novo.jogador_id,
              jogo_id:     jogoId,
              minuto:      Math.floor((novo.minutos_jogados ?? 0)),
              ts,
            };
            setState(prev => ({
              ...prev,
              evento:            evt,
              golsNovo:          prev.golsNovo + 1,
              ultimaAtualizacao: ts,
            }));

            // Dispara CustomEvent para outros componentes escutarem
            window.dispatchEvent(new CustomEvent('tigre-scout', { detail: evt }));
            clearEvento(4000);
          }

          // ── DETECTA CARTÃO AMARELO ────────────────────────
          else if ((novo.cartao_amarelo ?? 0) > (prev.cartao_amarelo ?? 0)) {
            const evt: ScoutEvent = {
              tipo:       'cartao_amarelo',
              jogador_id: novo.jogador_id,
              jogo_id:    jogoId,
              ts,
            };
            setState(p => ({
              ...p,
              evento:  evt,
              cartoes: [...p.cartoes, { jogador_id: novo.jogador_id, tipo: 'amarelo', ts }],
              ultimaAtualizacao: ts,
            }));
            window.dispatchEvent(new CustomEvent('tigre-scout', { detail: evt }));
            clearEvento(3000);
          }

          // ── DETECTA CARTÃO VERMELHO ───────────────────────
          else if ((novo.cartao_vermelho ?? 0) > (prev.cartao_vermelho ?? 0)) {
            const evt: ScoutEvent = {
              tipo:       'cartao_vermelho',
              jogador_id: novo.jogador_id,
              jogo_id:    jogoId,
              ts,
            };
            setState(p => ({
              ...p,
              evento:  evt,
              cartoes: [...p.cartoes, { jogador_id: novo.jogador_id, tipo: 'vermelho', ts }],
              ultimaAtualizacao: ts,
            }));
            window.dispatchEvent(new CustomEvent('tigre-scout', { detail: evt }));
            clearEvento(4000);
          }

          // ── DETECTA VAR INÍCIO ────────────────────────────
          else if (novo.var_em_andamento === true && !prev.var_em_andamento) {
            const evt: ScoutEvent = { tipo: 'var_inicio', jogo_id: jogoId, ts };
            setState(p => ({ ...p, evento: evt, varAndamento: true, ultimaAtualizacao: ts }));
            window.dispatchEvent(new CustomEvent('tigre-scout', { detail: evt }));
            // VAR não limpa sozinho — espera var_confirmado/var_cancelado
          }

          // ── DETECTA VAR RESOLVIDO ─────────────────────────
          else if (novo.var_em_andamento === false && prev.var_em_andamento === true) {
            // Se gols aumentou durante o VAR → gol confirmado
            const golConfirmado = (novo.gols ?? 0) > (prev.gols ?? 0);
            const evt: ScoutEvent = {
              tipo:    golConfirmado ? 'var_confirmado' : 'var_cancelado',
              jogo_id: jogoId, ts,
            };
            setState(p => ({
              ...p,
              evento:   evt,
              varAndamento: false,
              golsNovo: golConfirmado ? p.golsNovo + 1 : p.golsNovo,
              ultimaAtualizacao: ts,
            }));
            window.dispatchEvent(new CustomEvent('tigre-scout', { detail: evt }));
            clearEvento(4000);
          }

          // Atualiza cache local do scout
          prevRef.current[novo.jogador_id] = novo;
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [jogoId, clearEvento]);

  return state;
}
