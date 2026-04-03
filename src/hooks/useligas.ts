'use client';

/**
 * useLigas — Hook de Gerenciamento de Ligas Particulares
 * * Regra XP:
 * Fiel (100+ xp)  → pode CRIAR ligas
 * Novato          → só pode ENTRAR via código de convite
 */

import { useState, useEffect, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

// ─── Tipos ───────────────────────────────────────────────────────────────────

export type UsuarioPerfil = {
  id: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  nivel: 'Novato' | 'Torcedor' | 'Fiel' | 'Fanático' | 'Lenda';
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

// ─── Constantes ──────────────────────────────────────────────────────────────

export const XP_PARA_CRIAR_LIGA = 100;

export const NIVEL_CORES: Record<string, string> = {
  Novato:   '#71717A',
  Torcedor: '#3B82F6',
  Fiel:      '#F5C400',
  Fanático: '#EF4444',
  Lenda:     '#9333EA',
};

export const NIVEL_ICONES: Record<string, string> = {
  Novato:   '🌱',
  Torcedor: '👟',
  Fiel:      '🏆',
  Fanático: '🔥',
  Lenda:     '👑',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLigas(usuarioId: string | null) {
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  const [perfil, setPerfil]               = useState<UsuarioPerfil | null>(null);
  const [minhasLigas, setMinhasLigas]   = useState<Liga[]>([]);
  const [isLoading, setIsLoading]        = useState(false);
  const [error, setError]                = useState<string | null>(null);

  // Derived
  const podeCriarLiga = (perfil?.xp ?? 0) >= XP_PARA_CRIAR_LIGA;
  const xpParaFiel    = Math.max(0, XP_PARA_CRIAR_LIGA - (perfil?.xp ?? 0));

  // ── Carrega perfil e ligas do usuário ─────────────────────────────────────
  const carregarDados = useCallback(async () => {
    if (!usuarioId) return;
    setIsLoading(true);
    setError(null);

    try {
      // Perfil do usuário
      const { data: perfilData } = await supabase
        .from('tigre_fc_usuarios')
        .select('id, display_name, avatar_url, xp, nivel')
        .eq('id', usuarioId)
        .single();

      if (perfilData) setPerfil(perfilData as UsuarioPerfil);

      // Ligas que o usuário participa (via membros)
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
      console.error('Erro ao carregar dados das ligas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [usuarioId, supabase]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // ── Criar Liga ────────────────────────────────────────────────────────────
  const criarLiga = useCallback(async (nome: string, descricao?: string, isPublica = false, maxMembros = 20) => {
    if (!usuarioId || !podeCriarLiga) {
      setError(`Você precisa de ${xpParaFiel} XP a mais para criar uma liga!`);
      return null;
    }

    setError(null);

    const { data: liga, error: err } = await supabase
      .from('tigre_fc_ligas')
      .insert({
        nome,
        descricao:    descricao ?? null,
        dono_id:      usuarioId,
        is_publica:   isPublica,
        max_membros:  maxMembros,
      })
      .select()
      .single();

    if (err) { setError('Erro ao criar liga. Tente novamente.'); return null; }

    // Dono entra automaticamente como membro
    await supabase
      .from('tigre_fc_ligas_membros')
      .insert({ liga_id: liga.id, usuario_id: usuarioId });

    await carregarDados();
    return liga as Liga;
  }, [usuarioId, podeCriarLiga, supabase, xpParaFiel, carregarDados]);

  // ── Entrar na Liga via código ─────────────────────────────────────────────
  const entrarNaLiga = useCallback(async (codigo: string) => {
    if (!usuarioId) return { success: false, error: 'Não autenticado' };

    const { data, error: err } = await supabase.rpc('entrar_na_liga', {
      p_codigo:      codigo.trim().toLowerCase(),
      p_usuario_id:  usuarioId,
    });

    if (err || data?.error) {
      const msg = data?.error ?? 'Código inválido ou liga não encontrada';
      setError(msg);
      return { success: false, error: msg };
    }

    await carregarDados();
    return { success: true, ligaNome: data?.liga_nome };
  }, [usuarioId, supabase, carregarDados]);

  // ── Buscar ranking de uma liga ────────────────────────────────────────────
  const getRankingLiga = useCallback(async (ligaId: string): Promise<LigaMembro[]> => {
    const { data } = await supabase
      .from('tigre_fc_ligas_membros')
      .select(`
        usuario_id, pontos, jogos, acertos, entrou_em,
        tigre_fc_usuarios ( id, display_name, avatar_url, xp, nivel )
      `)
      .eq('liga_id', ligaId)
      .order('pontos', { ascending: false })
      .limit(50);

    return (data ?? []) as unknown as LigaMembro[];
  }, [supabase]);

  // ── Buscar escalação pública de outro usuário ─────────────────────────────
  const getEscalacaoPublica = useCallback(async (targetUsuarioId: string) => {
    const { data } = await supabase
      .from('tigre_fc_escalacoes')
      .select('*, tigre_fc_usuarios(display_name, avatar_url, xp, nivel)')
      .eq('usuario_id', targetUsuarioId)
      .maybeSingle();

    if (!data) return null;

    const lineup = data.lineup_json ?? {};
    return {
      ...data,
      lineup_safe: Object.fromEntries(
        Object.entries(lineup as object).map(([k, v]) => [k, v ?? null])
      ),
    };
  }, [supabase]);

  return {
    perfil,
    minhasLigas,
    isLoading,
    error,
    podeCriarLiga,
    xpParaFiel,
    criarLiga,
    entrarNaLiga,
    getRankingLiga,
    getEscalacaoPublica,
    recarregar: carregarDados,
  };
}
