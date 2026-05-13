// Verifica se o usuário autenticado é administrador.
// O email do admin é mantido em ADMIN_EMAIL (variável server-only, nunca exposta ao cliente).
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ admin: false }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user?.email) {
    return NextResponse.json({ admin: false }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? '';
  const isAdmin    = adminEmail.split(',').map(s => s.trim().toLowerCase()).includes(user.email.toLowerCase());

  return NextResponse.json({ admin: isAdmin });
}
