import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * Rota de callback OAuth do Supabase (fluxo PKCE — Next.js App Router).
 *
 * Fluxo:
 *  1. Usuário clica "Entrar com Google" → Supabase redireciona para Google
 *  2. Google volta para /auth/callback?code=xxx&next=/escritorio
 *  3. Esta rota troca o code por uma sessão e redireciona para `next`
 *
 * Sem esta rota o Supabase não consegue finalizar a sessão no servidor
 * e o usuário acaba caindo na home sem estar autenticado.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/escritorio';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redireciona para a página de destino após login bem-sucedido
      return NextResponse.redirect(`${origin}${next}`);
    }

    // Se der erro na troca, manda para o escritorio mesmo assim
    // (o componente vai detectar que não há sessão e mostrar o login)
    console.error('[auth/callback] Erro ao trocar code por sessão:', error.message);
  }

  return NextResponse.redirect(`${origin}/escritorio`);
}
