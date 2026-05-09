import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ── GET ────────────────────────────────────────────────────────────────────────
// ?usuario_id=  → lista ligas do usuário (com posição e membro count)
// ?codigo=      → detalhes + ranking de uma liga pelo código
// ?publica=true → lista ligas públicas
// ?liga_id=&mensagens=true → últimas 80 mensagens do chat da liga

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const usuarioId  = searchParams.get('usuario_id');
  const codigo     = searchParams.get('codigo');
  const publica    = searchParams.get('publica');
  const ligaId     = searchParams.get('liga_id');
  const mensagens  = searchParams.get('mensagens');

  // ── Chat messages ────────────────────────────────────────────────────────
  if (ligaId && mensagens === 'true') {
    const { data, error } = await supabase
      .from('tigre_fc_ligas_mensagens')
      .select('id, usuario_id, texto, criado_em, tigre_fc_usuarios(apelido, nome, avatar_url)')
      .eq('liga_id', ligaId)
      .order('criado_em', { ascending: true })
      .limit(80);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  // ── Ligas públicas ────────────────────────────────────────────────────────
  if (publica === 'true') {
    const q = searchParams.get('q') ?? '';
    let query = supabase
      .from('tigre_fc_ligas')
      .select('id, nome, descricao, codigo_convite, dono_id, max_membros, is_publica, temporada, ativa, created_at')
      .eq('is_publica', true)
      .eq('ativa', true)
      .order('created_at', { ascending: false })
      .limit(30);

    if (q) query = query.ilike('nome', `%${q}%`);

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  }

  // ── Detalhe por código ─────────────────────────────────────────────────────
  if (codigo) {
    const { data: liga, error: errLiga } = await supabase
      .from('tigre_fc_ligas')
      .select('id, nome, descricao, codigo_convite, dono_id, max_membros, is_publica, temporada, ativa, created_at')
      .ilike('codigo_convite', codigo.trim())
      .eq('ativa', true)
      .single();

    if (errLiga || !liga) return NextResponse.json({ error: 'Liga não encontrada' }, { status: 404 });

    const { data: ranking } = await supabase
      .from('tigre_fc_ligas_membros')
      .select(`
        usuario_id, pontos, jogos, acertos, entrou_em,
        tigre_fc_usuarios ( id, nome, apelido, avatar_url, nivel, pontos_total, streak )
      `)
      .eq('liga_id', liga.id)
      .order('pontos_total', { ascending: false });

    const membros = (ranking ?? []).map((m: any, i: number) => {
      const u = m.tigre_fc_usuarios ?? {};
      return {
        posicao:     i + 1,
        usuario_id:  m.usuario_id,
        apelido:     u.apelido ?? u.nome ?? 'Torcedor',
        avatar_url:  u.avatar_url ?? null,
        nivel:       u.nivel ?? 'Novato',
        pontos_total: u.pontos_total ?? 0,
        streak:      u.streak ?? 0,
        total_badges: 0,
        eh_dono:     m.usuario_id === liga.dono_id,
      };
    });

    return NextResponse.json({ liga, ranking: membros });
  }

  // ── Ligas do usuário ──────────────────────────────────────────────────────
  if (usuarioId) {
    const { data: membrosData, error: errMembros } = await supabase
      .from('tigre_fc_ligas_membros')
      .select(`
        liga_id, pontos,
        tigre_fc_ligas (
          id, nome, descricao, codigo_convite, dono_id,
          max_membros, is_publica, temporada, ativa, created_at
        )
      `)
      .eq('usuario_id', usuarioId);

    if (errMembros) return NextResponse.json({ error: errMembros.message }, { status: 500 });

    const ligas = await Promise.all(
      (membrosData ?? []).map(async (m: any) => {
        const liga = m.tigre_fc_ligas;
        if (!liga) return null;

        const { count: totalMembros } = await supabase
          .from('tigre_fc_ligas_membros')
          .select('*', { count: 'exact', head: true })
          .eq('liga_id', liga.id);

        const { count: posicaoCount } = await supabase
          .from('tigre_fc_ligas_membros')
          .select('*', { count: 'exact', head: true })
          .eq('liga_id', liga.id)
          .gt('pontos', m.pontos ?? 0);

        return {
          liga_id:       liga.id,
          nome:          liga.nome,
          codigo:        liga.codigo_convite,
          descricao:     liga.descricao,
          total_membros: totalMembros ?? 0,
          eh_dono:       liga.dono_id === usuarioId,
          minha_posicao: (posicaoCount ?? 0) + 1,
          criado_em:     liga.created_at,
        };
      }),
    );

    return NextResponse.json(ligas.filter(Boolean));
  }

  return NextResponse.json({ error: 'Parâmetro inválido' }, { status: 400 });
}

// ── POST ───────────────────────────────────────────────────────────────────────
// { acao: 'criar',    usuario_id, nome, descricao?, is_publica? }
// { acao: 'entrar',   usuario_id, codigo }
// { acao: 'sair',     usuario_id, liga_id }
// { acao: 'mensagem', usuario_id, liga_id, texto }

export async function POST(req: NextRequest) {
  let body: any;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Body inválido' }, { status: 400 }); }

  const { acao, usuario_id } = body;
  if (!acao || !usuario_id) return NextResponse.json({ error: 'Parâmetros obrigatórios ausentes' }, { status: 400 });

  // ── Criar Liga ────────────────────────────────────────────────────────────
  if (acao === 'criar') {
    const { nome, descricao, is_publica } = body;
    if (!nome?.trim()) return NextResponse.json({ error: 'Nome obrigatório' }, { status: 400 });

    const { data: liga, error } = await supabase
      .from('tigre_fc_ligas')
      .insert({
        nome: nome.trim(),
        descricao: descricao?.trim() || null,
        dono_id: usuario_id,
        is_publica: is_publica ?? false,
        max_membros: 30,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase
      .from('tigre_fc_ligas_membros')
      .insert({ liga_id: liga.id, usuario_id });

    return NextResponse.json({ success: true, liga, codigo: liga.codigo_convite });
  }

  // ── Entrar na Liga ────────────────────────────────────────────────────────
  if (acao === 'entrar') {
    const { codigo } = body;
    if (!codigo?.trim()) return NextResponse.json({ error: 'Código obrigatório' }, { status: 400 });

    const { data, error } = await supabase.rpc('entrar_na_liga', {
      p_codigo:     codigo.trim().toUpperCase(),
      p_usuario_id: usuario_id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (data?.error) return NextResponse.json({ error: data.error }, { status: 400 });

    const { data: liga } = await supabase
      .from('tigre_fc_ligas')
      .select('id, nome, codigo_convite')
      .ilike('codigo_convite', codigo.trim())
      .single();

    return NextResponse.json({ success: true, liga });
  }

  // ── Sair da Liga ──────────────────────────────────────────────────────────
  if (acao === 'sair') {
    const { liga_id } = body;
    if (!liga_id) return NextResponse.json({ error: 'liga_id obrigatório' }, { status: 400 });

    const { data: liga } = await supabase
      .from('tigre_fc_ligas')
      .select('dono_id')
      .eq('id', liga_id)
      .single();

    if (liga?.dono_id === usuario_id) {
      return NextResponse.json({ error: 'O dono não pode sair da própria liga' }, { status: 400 });
    }

    const { error } = await supabase
      .from('tigre_fc_ligas_membros')
      .delete()
      .eq('liga_id', liga_id)
      .eq('usuario_id', usuario_id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // ── Enviar mensagem no chat ───────────────────────────────────────────────
  if (acao === 'mensagem') {
    const { liga_id, texto } = body;
    if (!liga_id || !texto?.trim()) return NextResponse.json({ error: 'liga_id e texto obrigatórios' }, { status: 400 });
    if (texto.trim().length > 300) return NextResponse.json({ error: 'Mensagem muito longa (máx. 300 chars)' }, { status: 400 });

    const { data, error } = await supabase
      .from('tigre_fc_ligas_mensagens')
      .insert({ liga_id, usuario_id, texto: texto.trim() })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, mensagem: data });
  }

  return NextResponse.json({ error: `Ação desconhecida: ${acao}` }, { status: 400 });
}
