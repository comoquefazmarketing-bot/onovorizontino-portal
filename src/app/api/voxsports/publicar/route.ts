// src/app/api/voxsports/publicar/route.ts
// PATCH { id } → publica o copy (publicado = true)
// DELETE { id } → remove da fila
// Protegido por AGENTS_SECRET

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function autorizado(req: NextRequest): boolean {
  const secret = process.env.AGENTS_SECRET;
  if (!secret) return true;
  return req.headers.get('authorization')?.replace('Bearer ', '') === secret;
}

export async function PATCH(req: NextRequest) {
  if (!autorizado(req)) return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ erro: 'id obrigatório.' }, { status: 400 });

  const { data, error } = await supabase
    .from('voxsports_fila')
    .update({ publicado: true })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, copy: data });
}

export async function DELETE(req: NextRequest) {
  if (!autorizado(req)) return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ erro: 'id obrigatório.' }, { status: 400 });

  const { error } = await supabase.from('voxsports_fila').delete().eq('id', id);
  if (error) return NextResponse.json({ erro: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
