// Retorna o próximo jogo escalável para o client
import { NextResponse } from 'next/server';
import { getProximoJogoEscalavel, getJogoAtivo } from '@/lib/tigre-fc/jogo-estado';

export const revalidate = 60; // cache de 60s no edge

export async function GET() {
  try {
    const escalavel = await getProximoJogoEscalavel();
    if (escalavel) return NextResponse.json(escalavel);

    const ativo = await getJogoAtivo();
    if (ativo) return NextResponse.json(ativo);

    return NextResponse.json(null);
  } catch (err) {
    console.error('[jogo-ativo]', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
