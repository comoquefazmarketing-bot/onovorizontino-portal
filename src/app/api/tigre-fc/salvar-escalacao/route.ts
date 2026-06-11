// Salva/atualiza escalação do usuário para um jogo
// REGRA DE OURO: resolve tigre_fc_usuarios.id a partir do google_id
// Deadline server-side: rejeita após kickoff

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { isEscalacaoAberta } from '@/lib/tigre-fc/jogo-estado';

export async function POST(req: NextRequest) {
  // 1. Autentica o usuário via sessão
  const supabase = await createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  // 2. REGRA DE OURO — resolve tigre_fc_usuarios.id a partir do google_id (auth.uid)
  const { data: tfcUser, error: userErr } = await supabaseAdmin
    .from('tigre_fc_usuarios')
    .select('id')
    .eq('google_id', user.id)
    .single();

  if (userErr || !tfcUser) {
    return NextResponse.json({ error: 'Usuário não cadastrado no Tigre FC' }, { status: 403 });
  }

  const usuario_id = tfcUser.id;

  // 3. Valida o body
  const body = await req.json().catch(() => null);
  if (!body?.jogo_id || !body?.lineup || !body?.capitao_id || !body?.heroi_id) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 });
  }

  const { jogo_id, formacao, lineup, capitao_id, heroi_id, palpite_tigre, palpite_adv } = body;

  // 4. Valida o jogo e o deadline (SERVER-SIDE — anti-cheat)
  const { data: jogo, error: jogoErr } = await supabaseAdmin
    .from('jogos')
    .select('id, data_hora, status, pontuado')
    .eq('id', jogo_id)
    .single();

  if (jogoErr || !jogo) {
    return NextResponse.json({ error: 'Jogo não encontrado' }, { status: 404 });
  }

  if (!isEscalacaoAberta(jogo.data_hora)) {
    return NextResponse.json(
      { error: 'Escalação encerrada — o jogo já começou' },
      { status: 409 }
    );
  }

  if (jogo.status === 'encerrado' || jogo.pontuado) {
    return NextResponse.json({ error: 'Jogo já encerrado' }, { status: 409 });
  }

  // 5. Upsert com service role (bypassa RLS para escrita segura)
  const { error: upsertErr } = await supabaseAdmin
    .from('tigre_fc_escalacoes')
    .upsert(
      {
        usuario_id,
        jogo_id,
        formacao:      formacao ?? '4-3-3',
        lineup:        lineup,
        capitao_id,
        heroi_id,
        palpite_tigre: palpite_tigre ?? 0,
        palpite_adv:   palpite_adv ?? 0,
        updated_at:    new Date().toISOString(),
      },
      { onConflict: 'usuario_id,jogo_id' }
    );

  if (upsertErr) {
    console.error('[salvar-escalacao]', upsertErr);
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
