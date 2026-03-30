import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/tigre-fc/minha-escalacao?usuario_id=X&jogo_id=Y
// Recupera escalação salva do usuário
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const usuario_id = searchParams.get('usuario_id');
  const jogo_id = searchParams.get('jogo_id');

  if (!usuario_id || !jogo_id) {
    return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
  }

  const [escalacao, palpite] = await Promise.all([
    supabase.from('tigre_fc_escalacoes').select('*')
      .eq('usuario_id', usuario_id).eq('jogo_id', jogo_id).single(),
    supabase.from('tigre_fc_palpites').select('*')
      .eq('usuario_id', usuario_id).eq('jogo_id', jogo_id).single(),
  ]);

  return NextResponse.json({
    escalacao: escalacao.data || null,
    palpite: palpite.data || null,
  });
}

// POST /api/tigre-fc/minha-escalacao
// Salva/atualiza escalação automaticamente (auto-save)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { usuario_id, jogo_id, formacao, lineup, capitao_id, heroi_id, palpite } = body;

  if (!usuario_id || !jogo_id) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  // Verifica se o jogo ainda não começou (mercado aberto)
  const { data: jogo } = await supabase.from('jogos').select('data_hora').eq('id', jogo_id).single();
  if (jogo && new Date(jogo.data_hora) <= new Date()) {
    return NextResponse.json({ error: 'Mercado fechado — jogo já iniciou' }, { status: 403 });
  }

  const resultados = await Promise.allSettled([
    // Salva escalação
    lineup && supabase.from('tigre_fc_escalacoes').upsert({
      usuario_id, jogo_id,
      formacao: formacao || '4-3-3',
      lineup: lineup || {},
      capitao_id: capitao_id || 0,
      heroi_id: heroi_id || 0,
    }, { onConflict: 'usuario_id,jogo_id' }),

    // Salva palpite
    palpite && supabase.from('tigre_fc_palpites').upsert({
      usuario_id, jogo_id,
      gols_mandante: palpite.mandante ?? 0,
      gols_visitante: palpite.visitante ?? 0,
    }, { onConflict: 'usuario_id,jogo_id' }),
  ]);

  const erros = resultados.filter(r => r.status === 'rejected').length;
  return NextResponse.json({ ok: erros === 0, erros });
}
