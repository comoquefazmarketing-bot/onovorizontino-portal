'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa'; // Certifique-se de ter criado este componente
import { useTigreFCNotificacoes } from '@/hooks/useTigreFCNotificacoes';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

type Jogo = {
  id: number; data_hora: string;
  mandante: { nome: string; escudo_url: string; sigla?: string };
  visitante: { nome: string; escudo_url: string; sigla?: string };
};

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [destaques, setDestaques] = useState<any>(null);

  const { count: notifCount, marcarLidas } = useTigreFCNotificacoes(meuId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Cronômetro
  useEffect(() => {
    if (!jogo || !mounted) return;
    const interval = setInterval(() => {
      const dataISO = jogo.data_hora.replace(' ', 'T');
      const diff = new Date(dataISO).getTime() - (90 * 60 * 1000) - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        clearInterval(interval);
        return;
      }
      setTimeLeft({
        h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [jogo, mounted]);

  // 2. Busca de Dados (Sessão, Ranking e Destaques)
  useEffect(() => {
    fetch('/api/proximo-jogo').then(r => r.json()).then(({ jogos }) => { if (jogos?.[0]) setJogo(jogos[0]); });

    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Usuário
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      }
    });

    // Ranking Top 10
    fetch(`${SUPABASE_URL}/rest/v1/tigre_fc_usuarios?select=id,nome,apelido,avatar_url,nivel,pontos_total&order=pontos_total.desc&limit=10`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(data => { if (Array.isArray(data)) setRanking(data); });

    // Destaques da Rodada para Cards FIFA
    async function loadDestaques() {
      const { data: lastRes } = await sb.from('tigre_fc_resultados').select('jogo_id').eq('processado', true).order('criado_em', { ascending: false }).limit(1).single();
      if (lastRes) {
        const { data: sc } = await sb.from('tigre_fc_scouts_jogadores')
          .select('pontos, jogador:jogador_id(nome, foto_url)')
          .eq('jogo_id', lastRes.jogo_id)
          .order('pontos', { ascending: false })
          .limit(2);
        
        if (sc && sc.length >= 2) {
          setDestaques({
            capitao: { nome: sc[0].jogador.nome, foto_url: sc[0].jogador.foto_url, pontos: sc[0].pontos },
            heroi: { nome: sc[1].jogador.nome, foto_url: sc[1].jogador.foto_url, pontos: sc[1].pontos }
          });
        }
      }
    }
    loadDestaques();
  }, []);

  if (!mounted) return <main style={{ minHeight: '100vh', background: '#050505' }} />;

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: 100, fontFamily: 'sans-serif' }}>
      
      {/* HEADER FIFA 26 */}
      <header style={{ background: '#F5C400', padding: '24px 16px', position: 'relative', overflow: 'hidden', borderBottom: '4px solid #000' }}>
        <div style={{ position: 'absolute', right: '-5%', top: 0, bottom: 0, width: '30%', background: 'rgba(0,0,0,0.07)', transform: 'skewX(-15deg)' }} />
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={LOGO} style={{ width: 42, height: 42, objectFit: 'contain' }} alt="Tigre FC" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#000', fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.8 }}>TIGRE FC</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#000', opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1 }}>Ultimate Team 26</span>
            </div>
          </div>
          {notifCount > 0 && (
            <div onClick={marcarLidas} style={{ background: '#000', color: '#F5C400', padding: '6px 12px', borderRadius: 4, fontSize: 10, fontWeight: 900, cursor: 'pointer', transform: 'skewX(-10deg)' }}>
              <div style={{ transform: 'skewX(10deg)' }}>{notifCount} ALERTAS</div>
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>
        
        {/* HERO CARD: PRÓXIMO JOGO */}
        {jogo && (
          <section style={{ marginTop: 24, position: 'relative' }}>
            <div style={{ background: 'linear-gradient(145deg, #111, #000)', borderRadius: 12, border: '1px solid #333', padding: '24px 16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, background: '#F5C400', color: '#000', padding: '4px 12px', fontSize: 10, fontWeight: 900, textTransform: 'uppercase', borderBottomRightRadius: 12, fontStyle: 'italic', zIndex: 2 }}>
                Mercado Aberto
              </div>
              <div style={{ textAlign: 'center', marginTop: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>Fecha em</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
                  {['h', 'm', 's'].map(unit => (
                    <div key={unit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 45 }}>
                      <span style={{ fontSize: 32, fontWeight: 900, color: '#fff', fontStyle: 'italic', fontFamily: 'monospace' }}>{timeLeft[unit as keyof typeof timeLeft]}</span>
                      <span style={{ fontSize: 8, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase' }}>{unit === 'h' ? 'Horas' : unit === 'm' ? 'Min' : 'Seg'}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30, marginBottom: 24 }}>
                  <div style={{ textAlign: 'center' }}><img src={jogo.mandante.escudo_url} style={{ width: 64 }} /><div style={{ fontSize: 12, fontWeight: 900, marginTop: 8 }}>{jogo.mandante.sigla}</div></div>
                  <span style={{ fontSize: 24, fontWeight: 900, color: '#222', fontStyle: 'italic' }}>VS</span>
                  <div style={{ textAlign: 'center' }}><img src={jogo.visitante.escudo_url} style={{ width: 64 }} /><div style={{ fontSize: 12, fontWeight: 900, marginTop: 8 }}>{jogo.visitante.sigla}</div></div>
                </div>
                <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ display: 'block', background: '#F5C400', color: '#000', padding: '16px', borderRadius: 8, fontWeight: 900, textDecoration: 'none', textTransform: 'uppercase', fontStyle: 'italic', boxShadow: '0 4px 15px rgba(245,196,0,0.3)' }}>
                  Escalar Squad Pro →
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* RANKING LEADERBOARD */}
        <section style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', margin: 0 }}>Top 10 Global</h2>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#F5C400' }}>SEASON 1</span>
          </div>
          <div style={{ background: '#111', borderRadius: 12, border: '1px solid #222', overflow: 'hidden' }}>
            {ranking.map((user, i) => (
              <div key={user.id} onClick={() => setPerfilAberto(user.id)} style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid #1a1a1a', cursor: 'pointer', background: user.id === meuId ? 'rgba(245,196,0,0.1)' : 'transparent' }}>
                <span style={{ width: 28, fontSize: 12, fontWeight: 900, color: i < 3 ? '#F5C400' : '#444', fontStyle: 'italic' }}>#{i + 1}</span>
                <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.nome}`} style={{ width: 36, height: 36, borderRadius: '50%', marginRight: 12, border: i === 0 ? '2px solid #F5C400' : '1px solid #333' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>{user.apelido || user.nome}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#555' }}>{user.nivel?.toUpperCase() || 'PLAYER'}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#F5C400', fontStyle: 'italic' }}>{user.pontos_total}</div>
                  <div style={{ fontSize: 8, fontWeight: 800, color: '#333' }}>PTS</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO CARDS FIFA - DESTAQUES DA ÚLTIMA RODADA */}
        {destaques && (
          <DestaquesFifa capitao={destaques.capitao} heroi={destaques.heroi} />
        )}

        {/* RAIO-X DO CAMPO (SOFASCORE) */}
        <section style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 4, height: 16, background: '#F5C400' }} />
            <h2 style={{ fontSize: 16, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', margin: 0 }}>Análise de Campo</h2>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <iframe 
              id="sofa-lineups-embed-15526004" 
              src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=light" 
              style={{ height: '500px', width: '100%', border: 'none' }}
              scrolling="no"
            />
          </div>
          <div style={{ fontSize: '10px', color: '#555', marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>
            <a href="https://www.sofascore.com/pt/football/match/gremio-novorizontino-juventude/FOsokeb#id:15526004" target="_blank" rel="noreferrer" style={{ color: '#555', textDecoration: 'none' }}>
              Fonte: SofaScore - Dados Oficiais
            </a>
          </div>
        </section>

        {/* VESTIÁRIO (CHAT) */}
        <section style={{ marginTop: 32, marginBottom: 40 }}>
          <div style={{ fontSize: 14, fontWeight: 900, fontStyle: 'italic', marginBottom: 12, textTransform: 'uppercase', color: '#fff' }}>Vestiário em Tempo Real</div>
          <div style={{ height: 450, borderRadius: 12, overflow: 'hidden', border: '1px solid #222', background: '#0a0a0a' }}>
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico targetUserId={perfilAberto} jogoId={jogo?.id || 0} meuId={meuId} onClose={() => setPerfilAberto(null)} />
      )}
    </main>
  );
}
