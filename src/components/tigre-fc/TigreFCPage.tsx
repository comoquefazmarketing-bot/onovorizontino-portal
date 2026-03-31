'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat'; // Reativado
import { useTigreFCNotificacoes } from '@/hooks/useTigreFCNotificacoes';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Jogo = {
  id: number; data_hora: string;
  mandante: { nome: string; escudo_url: string };
  visitante: { nome: string; escudo_url: string };
};

type Ranking = {
  id: string; nome: string; apelido: string | null;
  avatar_url: string | null; nivel: string; pontos_total: number;
};

const NIVEL_ICON: Record<string,string> = { Novato:'🌱', Fiel:'⚡', Garra:'🔥', Lenda:'🐯' };
const NIVEL_COLOR: Record<string,string> = { Novato:'#6b7280', Fiel:'#F5C400', Garra:'#F5C400', Lenda:'#FFD700' };

export default function TigreFCPage() {
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [loadingRank, setLoadingRank] = useState(true);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState("");

  const { count: notifCount, marcarLidas } = useTigreFCNotificacoes(meuId);

  // Efeito do Cronômetro
  useEffect(() => {
    if (!jogo) return;
    const interval = setInterval(() => {
      const diff = new Date(jogo.data_hora).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("EM CAMPO"); clearInterval(interval); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [jogo]);

  useEffect(() => {
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => { if (jogos?.[0]) setJogo(jogos[0]); });

    import('@supabase/supabase-js').then(({ createClient }) => {
      const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
      sb.auth.getSession().then(async ({ data: { session } }) => {
        if (!session?.user) return;
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      });
    });

    fetch(`${SUPABASE_URL}/rest/v1/tigre_fc_usuarios?select=id,nome,apelido,avatar_url,nivel,pontos_total&order=pontos_total.desc&limit=10`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRanking(data); })
      .finally(() => setLoadingRank(false));
  }, []);

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:'#F5C400', padding:'20px 16px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ maxWidth:480, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={LOGO} style={{ width:40, height:40 }} />
            <span style={{ fontSize:20, fontWeight:900, color:'#111' }}>TIGRE FC</span>
          </div>
          {notifCount > 0 && (
            <div onClick={marcarLidas} style={{ background:'#ef4444', color:'#fff', padding:'4px 8px', borderRadius:20, fontSize:10, fontWeight:900, cursor:'pointer' }}>
              {notifCount} ALERTAS
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'0 16px' }}>
        {/* Card de Jogo com Cronômetro */}
        {jogo && (
          <div style={{ marginTop:20, background:'#111', border:'1px solid #F5C40040', borderRadius:16, padding:20, textAlign:'center' }}>
            <div style={{ fontSize:10, color:'#F5C400', fontWeight:900, marginBottom:10, letterSpacing:1 }}>FECHAMENTO EM:</div>
            <div style={{ fontSize:32, fontWeight:900, color:'#fff', fontFamily:'monospace', marginBottom:20 }}>{timeLeft}</div>
            
            <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', marginBottom:20 }}>
              <img src={jogo.mandante.escudo_url} style={{ width:60 }} />
              <span style={{ fontSize:20, fontWeight:900, opacity:0.2 }}>VS</span>
              <img src={jogo.visitante.escudo_url} style={{ width:60 }} />
            </div>

            <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ display:'block', background:'#F5C400', color:'#111', padding:16, borderRadius:12, fontWeight:900, textDecoration:'none' }}>
              🐯 ESCALAR MEU TIME
            </Link>
          </div>
        )}

        {/* Ranking com Fotos */}
        <div style={{ marginTop:24, background:'#111', borderRadius:16, overflow:'hidden', border:'1px solid #1a1a1a' }}>
          <div style={{ padding:16, borderBottom:'1px solid #222', fontWeight:900, color:'#F5C400', fontSize:12 }}>RANKING GERAL</div>
          {ranking.map((user, i) => (
            <div key={user.id} onClick={() => setPerfilAberto(user.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', borderBottom:'1px solid #1a1a1a', cursor:'pointer' }}>
              <span style={{ width:24, fontSize:12, color:'#444', fontWeight:900 }}>{i+1}º</span>
              {user.avatar_url ? (
                <img src={user.avatar_url} style={{ width:32, height:32, borderRadius:'50%', border:`1px solid ${NIVEL_COLOR[user.nivel]}` }} />
              ) : (
                <div style={{ width:32, height:32, borderRadius:'50%', background:'#222', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:900 }}>
                  {user.apelido?.[0] || user.nome?.[0]}
                </div>
              )}
              <div style={{ flex:1, fontSize:14, fontWeight:700 }}>
                <span style={{ marginRight:6 }}>{NIVEL_ICON[user.nivel]}</span>
                {user.apelido || user.nome}
              </div>
              <div style={{ fontWeight:900, color:'#F5C400' }}>{user.pontos_total}</div>
            </div>
          ))}
        </div>

        {/* Chat Integrado na Home */}
        <div style={{ marginTop:24, height:400, borderRadius:16, overflow:'hidden', border:'1px solid #1a1a1a' }}>
          <TigreFCChat usuarioId={meuId} />
        </div>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUserId={perfilAberto}
          jogoId={jogo?.id || 0}
          meuId={meuId}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </main>
  );
}
