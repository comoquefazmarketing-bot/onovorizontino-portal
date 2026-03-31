'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import { useTigreFCNotificacoes } from '@/hooks/useTigreFCNotificacoes';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Jogo = {
  id: number; competicao: string; rodada: string; data_hora: string; local: string;
  mandante: { nome: string; escudo_url: string };
  visitante: { nome: string; escudo_url: string };
};

type Ranking = {
  id: string; nome: string; apelido: string | null;
  avatar_url: string | null; nivel: string; pontos_total: number; streak: number;
};

function formatDataHora(iso: string) {
  const d = new Date(iso);
  const dias = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  return {
    dia: `${dias[d.getDay()]}, ${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`,
    hora: `${String(d.getHours()).padStart(2,'0')}h${String(d.getMinutes()).padStart(2,'0') === '00' ? '' : String(d.getMinutes()).padStart(2,'0')}`,
  };
}

const NIVEL_ICON: Record<string,string> = { Novato:'🌱', Fiel:'⚡', Garra:'🔥', Lenda:'🐯' };

export default function TigreFCPage() {
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [loadingJogo, setLoadingJogo] = useState(true);
  const [loadingRank, setLoadingRank] = useState(true);
  const [tab, setTab] = useState<'rodada'|'temporada'>('temporada');
  const [meuId, setMeuId] = useState<string | null>(null);
  const [jogoIdAtivo, setJogoIdAtivo] = useState<number | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);

  const { count: notifCount, marcarLidas } = useTigreFCNotificacoes(meuId);

  useEffect(() => {
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => { if (jogos?.[0]) { setJogo(jogos[0]); setJogoIdAtivo(jogos[0].id); } })
      .finally(() => setLoadingJogo(false));

    import('@supabase/supabase-js').then(({ createClient }) => {
      const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
      sb.auth.getSession().then(async ({ data: { session } }) => {
        if (!session?.user) return;
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      });
    });
  }, []);

  useEffect(() => {
    fetch(`${SUPABASE_URL}/rest/v1/tigre_fc_usuarios?select=id,nome,apelido,avatar_url,nivel,pontos_total,streak&order=pontos_total.desc&limit=10`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setRanking(data); })
      .finally(() => setLoadingRank(false));
  }, []);

  const dt = jogo ? formatDataHora(jogo.data_hora) : null;

  return (
    <main style={{ minHeight:'100vh', background:'#080808', color:'#fff', paddingBottom:80 }}>
      <div style={{ background:'#F5C400', padding:'20px 16px' }}>
        <div style={{ maxWidth:480, margin:'0 auto', display:'flex', alignItems:'center', gap:14 }}>
          <img src={LOGO} style={{ width:64, height:64 }} />
          <div>
            <div style={{ fontSize:28, fontWeight:900, color:'#1a1a1a' }}>TIGRE FC</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:480, margin:'0 auto', padding:'0 16px' }}>
        {jogo && (
          <div style={{ marginTop:20, background:'#111', border:'1px solid #F5C40040', borderRadius:16, padding:20 }}>
             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <img src={jogo.mandante.escudo_url} style={{ width:52 }} />
                <div style={{ textAlign:'center' }}>
                   <div style={{ fontSize:24, fontWeight:900, color:'#F5C400' }}>{dt?.hora}</div>
                   <div style={{ fontSize:10, color:'#555' }}>{dt?.dia}</div>
                </div>
                <img src={jogo.visitante.escudo_url} style={{ width:52 }} />
             </div>
             <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ display:'block', marginTop:20, background:'#F5C400', color:'#111', textAlign:'center', padding:14, borderRadius:12, fontWeight:900, textDecoration:'none' }}>
                🐯 ESCALAR
             </Link>
          </div>
        )}

        <div style={{ marginTop:24, background:'#111', borderRadius:16, overflow:'hidden' }}>
          <div style={{ padding:16, borderBottom:'1px solid #222', display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontWeight:900, color:'#F5C400' }}>RANKING</span>
            {notifCount > 0 && <span onClick={() => marcarLidas()} style={{ background:'red', fontSize:10, padding:'2px 6px', borderRadius:10 }}>{notifCount}</span>}
          </div>
          {ranking.map((user, i) => (
            <div key={user.id} onClick={() => setPerfilAberto(user.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:12, borderBottom:'1px solid #222', cursor:'pointer' }}>
               <span style={{ width:20, color:'#444' }}>{i+1}º</span>
               <div style={{ flex:1 }}>{NIVEL_ICON[user.nivel]} {user.apelido || user.nome}</div>
               <div style={{ fontWeight:900, color:'#F5C400' }}>{user.pontos_total}</div>
            </div>
          ))}
        </div>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUserId={perfilAberto}
          jogoId={jogoIdAtivo || 0}
          meuId={meuId || ''}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </main>
  );
}
