import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function gerarCodigo(nome: string): string {
  const base = nome.toUpperCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6);
  const sufixo = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${base}${sufixo}`;
}

// POST /api/tigre-fc/ligas
// body: { acao: 'criar'|'entrar'|'sair', usuario_id, nome?, codigo? }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { acao, usuario_id, nome, codigo } = body;

  if (!usuario_id) return NextResponse.json({ error: 'Usuário não identificado' }, { status: 400 });

  if (acao === 'criar') {
    if (!nome?.trim()) return NextResponse.json({ error: 'Nome da liga é obrigatório' }, { status: 400 });

    // Gera código único
    let codigoFinal = gerarCodigo(nome);
    let tentativas = 0;
    while (tentativas < 5) {
      const { data: existe } = await supabase.from('tigre_fc_ligas').select('id').eq('codigo', codigoFinal).single();
      if (!existe) break;
      codigoFinal = gerarCodigo(nome);
      tentativas++;
    }

    // Verifica limite de ligas do usuário (max 3)
    const { count } = await supabase.from('tigre_fc_ligas')
      .select('id', { count: 'exact', head: true }).eq('dono_id', usuario_id);
    if ((count || 0) >= 3) return NextResponse.json({ error: 'Você já criou o máximo de 3 ligas' }, { status: 400 });

    // Cria a liga
    const { data: liga, error: errLiga } = await supabase.from('tigre_fc_ligas').insert({
      nome: nome.trim(), codigo: codigoFinal, dono_id: usuario_id, descricao: body.descricao || null
    }).select().single();

    if (errLiga || !liga) return NextResponse.json({ error: 'Erro ao criar liga' }, { status: 500 });

    // Entra automaticamente como membro
    await supabase.from('tigre_fc_ligas_membros').insert({ liga_id: liga.id, usuario_id });

    return NextResponse.json({ liga, codigo: codigoFinal });
  }

  if (acao === 'entrar') {
    if (!codigo?.trim()) return NextResponse.json({ error: 'Código inválido' }, { status: 400 });

    const { data: liga } = await supabase.from('tigre_fc_ligas')
      .select('id, nome, codigo, max_membros').eq('codigo', codigo.trim().toUpperCase()).single();

    if (!liga) return NextResponse.json({ error: 'Liga não encontrada. Verifique o código.' }, { status: 404 });

    // Verifica se já é membro
    const { data: jaMembro } = await supabase.from('tigre_fc_ligas_membros')
      .select('usuario_id').eq('liga_id', liga.id).eq('usuario_id', usuario_id).single();
    if (jaMembro) return NextResponse.json({ error: 'Você já é membro dessa liga', liga });

    // Verifica limite de membros
    const { count: totalMembros } = await supabase.from('tigre_fc_ligas_membros')
      .select('usuario_id', { count: 'exact', head: true }).eq('liga_id', liga.id);
    if ((totalMembros || 0) >= (liga.max_membros || 50)) {
      return NextResponse.json({ error: 'Liga está cheia (máximo 50 membros)' }, { status: 400 });
    }

    // Verifica limite de ligas do usuário (max 10)
    const { count: ligasDoUsuario } = await supabase.from('tigre_fc_ligas_membros')
      .select('liga_id', { count: 'exact', head: true }).eq('usuario_id', usuario_id);
    if ((ligasDoUsuario || 0) >= 10) {
      return NextResponse.json({ error: 'Você pode participar de no máximo 10 ligas' }, { status: 400 });
    }

    await supabase.from('tigre_fc_ligas_membros').insert({ liga_id: liga.id, usuario_id });
    return NextResponse.json({ liga });
  }

  if (acao === 'sair') {
    if (!body.liga_id) return NextResponse.json({ error: 'Liga não especificada' }, { status: 400 });

    // Dono não pode sair sem deletar a liga
    const { data: liga } = await supabase.from('tigre_fc_ligas').select('dono_id').eq('id', body.liga_id).single();
    if (liga?.dono_id === usuario_id) {
      return NextResponse.json({ error: 'Você é o dono. Delete a liga ou transfira para outro membro.' }, { status: 400 });
    }

    await supabase.from('tigre_fc_ligas_membros').delete()
      .eq('liga_id', body.liga_id).eq('usuario_id', usuario_id);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
}

// GET /api/tigre-fc/ligas?usuario_id=xxx
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const usuario_id = searchParams.get('usuario_id');
  const codigo = searchParams.get('codigo');

  if (codigo) {
    const { data: liga } = await supabase.from('tigre_fc_ligas')
      .select('id, nome, codigo, descricao').eq('codigo', codigo.toUpperCase()).single();
    if (!liga) return NextResponse.json({ error: 'Liga não encontrada' }, { status: 404 });
    const { data: ranking } = await supabase.rpc('ranking_liga_tigre_fc', { p_liga_id: liga.id });
    return NextResponse.json({ liga, ranking });
  }

  if (usuario_id) {
    const { data } = await supabase.rpc('minhas_ligas_tigre_fc', { p_usuario_id: usuario_id });
    return NextResponse.json(data || []);
  }

  return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
}
