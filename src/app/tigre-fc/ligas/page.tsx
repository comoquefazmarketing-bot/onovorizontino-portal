'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import LigasHub from '@/components/tigre-fc/LigasHub';
import TigreFCLogin from '@/components/tigre-fc/TigreFCLogin';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const LOGO =
  'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

function LigasContent() {
  const searchParams  = useSearchParams();
  const initialCode   = searchParams.get('entrar') ?? undefined;

  const [userId, setUserId]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) { setLoading(false); return; }
      const { data: u } = await supabase
        .from('tigre_fc_usuarios')
        .select('id')
        .eq('google_id', session.user.id)
        .single();
      setUserId(u?.id ?? null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-pulse" style={{ color: '#F5C400', fontSize: 13, fontWeight: 900 }}>
          CARREGANDO LIGAS...
        </div>
      </main>
    );
  }

  if (!userId) {
    return <TigreFCLogin jogoId={0} onSuccess={() => window.location.reload()} />;
  }

  return (
    <main style={{ minHeight: '100vh', background: '#080808', paddingBottom: 0 }}>
      {/* Header de navegação */}
      <div style={{
        background: '#F5C400', padding: '14px 20px', display: 'flex',
        alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
      }}>
        <Link href="/tigre-fc" style={{ color: '#111', textDecoration: 'none', fontWeight: 900, fontSize: 22 }}>✕</Link>
        <img src={LOGO} style={{ width: 24, objectFit: 'contain' }} />
        <div style={{ fontWeight: 900, fontSize: 14, color: '#111', textTransform: 'uppercase', letterSpacing: 1 }}>
          Ligas
        </div>
      </div>

      <LigasHub usuarioId={userId} initialCode={initialCode} />
    </main>
  );
}

export default function LigasPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#F5C400', fontSize: 13, fontWeight: 900 }}>CARREGANDO...</div>
      </main>
    }>
      <LigasContent />
    </Suspense>
  );
}
