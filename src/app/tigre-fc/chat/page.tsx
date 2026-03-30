'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

export default function TigreFCSocialPage() {
  const [usuarioId, setUsuarioId] = useState<string | null>(null);
  const [nivel, setNivel] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: u } = await supabase
        .from('tigre_fc_usuarios').select('id,nivel')
        .eq('google_id', session.user.id).single();
      if (u) { setUsuarioId(u.id); setNivel(u.nivel); }
    });
  }, []);

  return (
    <main style={{ minHeight:'100vh', background:'#080808', display:'flex', flexDirection:'column' }}>
      <div style={{ background:'#F5C400', padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
        <a href="/tigre-fc" style={{ color:'#1a1a1a', textDecoration:'none', fontWeight:900, fontSize:20 }}>←</a>
        <img src={LOGO} style={{ width:28, objectFit:'contain' }} />
        <div style={{ fontWeight:900, fontSize:16, color:'#1a1a1a' }}>RESENHA DO TIGRE</div>
      </div>
      <div style={{ flex:1, maxWidth:480, width:'100%', margin:'0 auto', display:'flex', flexDirection:'column' }}>
        <TigreFCChat usuarioId={usuarioId} usuarioNivel={nivel} />
      </div>
    </main>
  );
}
