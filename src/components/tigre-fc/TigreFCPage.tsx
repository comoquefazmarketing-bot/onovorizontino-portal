'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa'; 
import { useTigreFCNotificacoes } from '@/hooks/useTigreFCNotificacoes';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Interfaces para o TypeScript
interface Equipe {
  nome: string;
  escudo_url: string;
  sigla?: string;
}

interface Jogo {
  id: number;
  data_hora: string;
  mandante: Equipe;
  visitante: Equipe;
}

interface PlayerDestaque {
  nome: string;
  foto_url: string;
  pontos: number;
}

interface DestaqueData {
  capitao: PlayerDestaque;
  heroi: PlayerDestaque;
}

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [destaques, setDestaques] = useState<DestaqueData | null>(null);

  const { count: notifCount, marcarLidas } = useTigreFCNotificacoes(meuId);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Cronômetro
  useEffect(() => {
    if (!jogo || !mounted) return;
    const interval = setInterval(() => {
      try {
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
      } catch (e) {
        console.error("Erro no timer:", e);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [jogo, mounted]);

  // 2. Busca de Dados
  useEffect(() => {
    if (!mounted) return;
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Próximo Jogo
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => { if (jogos?.[0]) setJogo(jogos[0]); });

    // Sessão do Usuário
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      }
    });

    // Ranking
    fetch(`${SUPABASE_URL}/rest/v1/tigre_fc_usuarios?select=id,nome,apelido,avatar_url,nivel,pontos_total&order=pontos_total.desc&limit=10`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(data => { if (Array.isArray(data)) setRanking(data); });

    // Destaques Reais (Ajustado para evitar erro de tipo no jogador)
    async function loadDestaques() {
      const { data: lastRes } = await sb.from('tigre_fc_resultados').select('jogo_id').eq('processado', true).order('criado_em', { ascending: false }).limit(1).single();
      if (lastRes) {
        const { data: sc } = await sb.from('tigre_fc_scouts_jogadores')
          .select('pontos, jogador:jogador_id(nome, foto_url)')
          .eq('jogo_id', lastRes.jogo_id)
          .order('pontos', { ascending: false })
          .limit(2);
        
        if (sc && sc.length >= 2) {
          // Garantindo que acessamos o objeto jogador corretamente (mesmo se o Supabase entender como array)
          const j1 = Array.isArray(sc[0].jogador) ? sc[0].jogador[0] : sc[0].jogador;
          const j2 = Array.isArray(sc[1].jogador) ? sc[1].jogador[0] : sc[1].jogador;

          if (j1 && j2) {
            setDestaques({
              capitao: { nome: j1.nome, foto_url: j1.foto_url, pontos: sc[0].pontos },
              heroi: { nome: j2.nome, foto_url: j2.foto_url, pontos: sc[1].pontos }
            });
          }
        }
      }
    }
    loadDestaques();
  }, [mounted]);

  if (!mounted) return <main style={{ minHeight: '100vh', background: '#050505' }} />;

  return (
    <main style={{ minHeight: '100vh', background: '#050505', color: '#fff', paddingBottom: 100, fontFamily: 'sans-serif' }}>
      
      {/* HEADER */}
      <header style={{ background: '#F5C400', padding: '24px 16px', position: 'relative', overflow: 'hidden', borderBottom: '4px solid #000' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={LOGO} style={{ width: 42, height: 42, objectFit: 'contain' }} alt="Tigre FC" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#000', fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 0.8 }}>TIGRE FC</span>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#000', opacity: 0.6, textTransform: 'uppercase' }}>Ultimate Team 26</span>
            </div>
          </div>
          {notifCount > 0 && (
            <div onClick={marcarLidas} style={{ background: '#000', color: '#F5C400', padding: '6px 12px', borderRadius: 4, fontSize: 10, fontWeight: 900, cursor: 'pointer' }}>
              {notifCount} ALERTAS
            </div>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px' }}>
        
        {/* PROXIMO JOGO */}
        {jogo && (
          <section style={{ marginTop: 24 }}>
            <div style={{ background: 'linear-gradient(145deg, #111, #000)', borderRadius: 12, border: '1px solid #333', padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
                {['h', 'm', 's'].map(unit => (
                  <div key={unit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>{timeLeft[unit as keyof typeof timeLeft]}</span>
                    <span style={{ fontSize: 8, color: '#F5C400' }}>{unit.toUpperCase()}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                <img src={jogo.mandante.escudo_url} style={{ width: 50 }} alt="Mandante" />
                <span style={{ fontWeight: 900, color: '#333' }}>VS</span>
                <img src={jogo.visitante.escudo_url} style={{ width: 50 }} alt="Visitante" />
              </div>
              <Link href={`/tigre-fc/escalar/${jogo.id}`} style={{ display: 'block', background: '#F5C400', color: '#000', padding: '14px', borderRadius: 8, fontWeight: 900, textDecoration: 'none' }}>
                ESCALAR AGORA →
              </Link>
            </div>
          </section>
        )}

        {/* RANKING */}
        <section style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 900, textTransform: 'uppercase', marginBottom: 12 }}>Top 10 Global</h2>
          <div style={{ background: '#111', borderRadius: 12, border: '1px solid #222' }}>
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderBottom: '1px solid #1a1a1a', cursor: 'pointer' }}>
                <span style={{ width: 25, fontSize: 12, fontWeight: 900, color: i < 3 ? '#F5C400' : '#444' }}>#{i+1}</span>
                <img src={u.avatar_url || LOGO} style={{ width: 32, height: 32, borderRadius: '50%', marginRight: 10 }} alt="Avatar" />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 700 }}>{u.apelido || u.nome}</span>
                <span style={{ fontWeight: 900, color: '#F5C400' }}>{u.pontos_total}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CARDS FIFA */}
        {destaques && <DestaquesFifa capitao={destaques.capitao} heroi={destaques.heroi} />}

        {/* SOFASCORE IFRAME */}
        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 12, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', marginBottom: 12 }}>Raio-X SofaScore</h3>
          <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', height: 500 }}>
            <iframe 
              src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=light" 
              style={{ height: '100%', width: '100%', border: 'none' }}
              scrolling="no"
            />
          </div>
        </section>

        {/* CHAT */}
        <section style={{ marginTop: 32, marginBottom: 40 }}>
          <div style={{ height: 450, borderRadius: 12, overflow: 'hidden', border: '1px solid #222' }}>
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
