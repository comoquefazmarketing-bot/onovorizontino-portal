'use client';

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { LIGA_MIN_PONTOS_CRIAR } from '@/lib/tigre-fc-pontos';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type UsuarioPerfil = {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number;
  nivel: 'Novato' | 'Torcedor' | 'Fiel' | 'Fanático' | 'Lenda';
  is_admin: boolean;
};

export type LigaMembro = {
  usuario_id: string;
  pontos: number;
  jogos: number;
  acertos: number;
  entrou_em: string;
  tigre_fc_usuarios: UsuarioPerfil;
};

export type Liga = {
  id: string;
  nome: string;
  descricao: string | null;
  codigo_convite: string;
  dono_id: string;
  max_membros: number;
  is_publica: boolean;
  temporada: string;
  ativa: boolean;
  created_at: string;
  membros?: LigaMembro[];
  total_membros?: number;
};

// ─── Constantes ───────────────────────────────────────────────────────────────

export const PONTOS_PARA_CRIAR_LIGA = LIGA_MIN_PONTOS_CRIAR; // 600
/** @deprecated use PONTOS_PARA_CRIAR_LIGA */
export const XP_PARA_CRIAR_LIGA = PONTOS_PARA_CRIAR_LIGA;

export const NIVEL_CORES: Record<string, string> = {
  Novato:   '#71717A',
  Torcedor: '#3B82F6',
  Fiel:     '#F5C400',
  Fanático: '#EF4444',
  Lenda:    '#9333EA',
};

export const NIVEL_ICONES: Record<string, string> = {
  Novato:   '🌱',
  Torcedor: '👟',
  Fiel:     '🏆',
  Fanático: '🔥',
  Lenda:    '👑',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLigas(usuarioId: string | null) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const [perfil, setPerfil]           = useState<UsuarioPerfil | null>(null);
  const [minhasLigas, setMinhasLigas] = useState<Liga[]>([]);
  const [isLoading, setIsLoading]     = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // Admins sempre podem criar ligas (parceiros, patrocinadores, staff)
  const podeCriarLiga = perfil?.is_admin === true || (perfil?.pontos_total ?? 0) >= PONTOS_PARA_CRIAR_LIGA;
  const xpParaFiel    = Math.max(0, PONTOS_PARA_CRIAR_LIGA - (perfil?.pontos_total ?? 0));

  // ── Carrega perfil e ligas do usuário ─────────────────────────────────────
  const carregarDados = useCallback(async () => {
    if (!usuarioId) return;
    setIsLoading(true);
    setError(null);

    try {
      const { data: perfilData } = await supabase
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total, nivel, is_admin')
        .eq('id', usuarioId)
        .single();

      if (perfilData) setPerfil(perfilData as UsuarioPerfil);

      const { data: membrosData } = await supabase
        .from('tigre_fc_ligas_membros')
        .select(`
          liga_id,
          pontos,
          tigre_fc_ligas (
            id, nome, descricao, codigo_convite, dono_id,
            max_membros, is_publica, temporada, ativa, created_at
          )
        `)
        .eq('usuario_id', usuarioId);

      if (membrosData) {
        const ligas = membrosData
          .map((m: any) => m.tigre_fc_ligas)
          .filter(Boolean) as Liga[];
        setMinhasLigas(ligas);
      }
    } catch (err) {
      console.error('Erro ao carregar ligas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId, supabase]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // ── Criar Liga ────────────────────────────────────────────────────────────
  const criarLiga = useCallback(
    async (nome: string, descricao?: string, isPublica = false, maxMembros = 30) => {
      if (!usuarioId || !podeCriarLiga) {
        setError(`Você precisa de ${xpParaFiel} pontos a mais para criar uma liga!`);
        return null;
      }
      setError(null);

      const { data: liga, error: err } = await supabase
        .from('tigre_fc_ligas')
        .insert({ nome, descricao: descricao ?? null, dono_id: usuarioId, is_publica: isPublica, max_membros: maxMembros })
        .select()
        .single();

      if (err) { setError('Erro ao criar liga. Tente novamente.'); return null; }

      await supabase
        .from('tigre_fc_ligas_membros')
        .insert({ liga_id: liga.id, usuario_id: usuarioId });

      await carregarDados();
      return liga as Liga;
    },
    [usuarioId, podeCriarLiga, supabase, xpParaFiel, carregarDados],
  );

  // ── Entrar na Liga via código ─────────────────────────────────────────────
  const entrarNaLiga = useCallback(
    async (codigo: string) => {
      if (!usuarioId) return { success: false, error: 'Não autenticado' };
      setError(null);

      const { data, error: err } = await supabase.rpc('entrar_na_liga', {
        p_codigo:     codigo.trim().toUpperCase(),
        p_usuario_id: usuarioId,
      });

      if (err || data?.error) {
        const msg = data?.error ?? err?.message ?? 'Código inválido ou liga não encontrada';
        setError(msg);
        return { success: false, error: msg };
      }

      await carregarDados();
      return { success: true, ligaNome: data?.liga_nome };
    },
    [usuarioId, supabase, carregarDados],
  );

  // ── Sair da Liga ──────────────────────────────────────────────────────────
  const sairDaLiga = useCallback(
    async (ligaId: string) => {
      if (!usuarioId) return { success: false };
      const { error: err } = await supabase
        .from('tigre_fc_ligas_membros')
        .delete()
        .eq('liga_id', ligaId)
        .eq('usuario_id', usuarioId);
      if (err) return { success: false, error: err.message };
      await carregarDados();
      return { success: true };
    },
    [usuarioId, supabase, carregarDados],
  );

  // ── Buscar ranking de uma liga ────────────────────────────────────────────
  const getRankingLiga = useCallback(
    async (ligaId: string): Promise<LigaMembro[]> => {
      const { data } = await supabase
        .from('tigre_fc_ligas_membros')
        .select(`
          usuario_id, pontos, jogos, acertos, entrou_em,
          tigre_fc_usuarios ( id, nome, apelido, avatar_url, pontos_total, nivel, is_admin )
        `)
        .eq('liga_id', ligaId)
        .order('pontos', { ascending: false })
        .limit(50);

      return (data ?? []) as unknown as LigaMembro[];
    },
    [supabase],
  );

  // ── Buscar escalação pública de outro usuário ─────────────────────────────
  const getEscalacaoPublica = useCallback(
    async (targetUsuarioId: string) => {
      const { data } = await supabase
        .from('tigre_fc_escalacoes')
        .select('*, tigre_fc_usuarios(nome, apelido, avatar_url, pontos_total, nivel)')
        .eq('usuario_id', targetUsuarioId)
        .maybeSingle();

      if (!data) return null;
      const lineup = data.lineup_json ?? {};
      return {
        ...data,
        lineup_safe: Object.fromEntries(
          Object.entries(lineup as object).map(([k, v]) => [k, v ?? null]),
        ),
      };
    },
    [supabase],
  );

  return {
    perfil,
    minhasLigas,
    isLoading,
    error,
    podeCriarLiga,
    xpParaFiel,
    criarLiga,
    entrarNaLiga,
    sairDaLiga,
    getRankingLiga,
    getEscalacaoPublica,
    recarregar: carregarDados,
  };
}
