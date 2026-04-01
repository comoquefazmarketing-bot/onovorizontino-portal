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

interface Jogo {
  id: number;
  data_hora: string;
  mandante: { nome: string; escudo_url: string };
  visitante: { nome: string; escudo_url: string };
}

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [destaques, setDestaques] = useState<any>(null);

  const { count: notifCount, marcarLidas } = useTigreFCNotificacoes(meuId);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Próximo Jogo
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => { if (jogos?.[0]) setJogo(jogos[0]); });

    // Sessão Usuário
    sb.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      }
    });

    // Ranking
    fetch(`${SUPABASE_URL}/rest/v1/tigre_fc_usuarios?select=id,nome,apelido,avatar_url,pontos_total&order=pontos_total.desc&limit=10`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(data => { if (Array.isArray(data)) setRanking(data); });

    // Destaques Reais do Último Jogo Processado
    async function loadDestaques() {
      const { data: lastRes } = await sb.from('tigre_fc_resultados')
        .select('jogo_id')
        .eq('processado', true)
        .order('criado_em', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (lastRes) {
        const { data: sc } = await sb.from('tigre_fc_scouts_jogadores')
          .select('pontos, jogador:jogador_id(nome, foto_url)')
          .eq('jogo_id', lastRes.jogo_id)
          .order('pontos', { ascending: false })
          .limit(2);
        
        if (sc && sc.length >= 2) {
          const j1 = Array.isArray(sc[0].jogador) ? sc[0].jogador[0] : sc[0].jogador;
          const j2 = Array.isArray(sc[1].jogador) ? sc[1].jogador[0] : sc[1].jogador;
          setDestaques({
            capitao: { nome: j1.nome, foto_url: j1.foto_url, pontos: sc[0].pontos },
            heroi: { nome: j2.nome, foto_url: j2.foto_url, pontos: sc[1].pontos }
          });
        }
      }
    }
    loadDestaques();
  }, [mounted]);

  // Cronômetro
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

  if (!mounted) return <main className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24 font-sans">
      
      {/* HEADER */}
      <header className="bg-[#F5C400] px-4 py-6 border-b-4 border-black">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={LOGO} className="w-10 h-10 object-contain" alt="Tigre FC" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-black italic leading-none uppercase">TIGRE FC</span>
              <span className="text-[10px] font-extrabold text-black/60 uppercase">Ultimate Team 26</span>
            </div>
          </div>
          {notifCount > 0 && (
            <div onClick={marcarLidas} className="bg-black text-[#F5C400] px-3 py-1.5 rounded text-[10px] font-black cursor-pointer animate-bounce">
              {notifCount} ALERTAS
            </div>
          )}
        </div>
      </header>

      <div className="max-w-md mx-auto px-4">
        
        {/* PROXIMO JOGO */}
        {jogo && (
          <section className="mt-6">
            <div className="bg-gradient-to-b from-[#111] to-black rounded-2xl border border-white/5 p-6 text-center">
              <div className="flex justify-center gap-4 mb-4">
                {['h', 'm', 's'].map(u => (
                  <div key={u} className="flex flex-col">
                    <span className="text-3xl font-black font-mono">{timeLeft[u as keyof typeof timeLeft]}</span>
                    <span className="text-[8px] text-[#F5C400] font-bold uppercase">{u}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-6 mb-6">
                <img src={jogo.mandante.escudo_url} className="w-12 h-12 object-contain" alt="Mandante" />
                <span className="text-xs font-black text-zinc-800 italic">VS</span>
                <img src={jogo.visitante.escudo_url} className="w-12 h-12 object-contain" alt="Visitante" />
              </div>
              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="block bg-[#F5C400] text-black py-4 rounded-xl font-black text-sm uppercase italic hover:scale-105 transition-transform">
                Montar Elenco →
              </Link>
            </div>
          </section>
        )}

        {/* CARDS FIFA - DESTAQUES DA RODADA */}
        {destaques && <DestaquesFifa capitao={destaques.capitao} heroi={destaques.heroi} />}

        {/* RANKING */}
        <section className="mt-8">
          <h2 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#F5C400] rounded-full" /> Top 10 Treinadores
          </h2>
          <div className="bg-[#0f0f0f] rounded-2xl border border-white/5 overflow-hidden">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} className="flex items-center p-4 border-b border-white/5 active:bg-white/5 cursor-pointer">
                <span className={`w-8 text-xs font-black ${i < 3 ? 'text-[#F5C400]' : 'text-zinc-600'}`}>#{i+1}</span>
                <img src={u.avatar_url || LOGO} className="w-8 h-8 rounded-lg mr-3 object-cover bg-zinc-900" alt="Avatar" />
                <span className="flex-1 text-sm font-bold truncate">{u.apelido || u.nome}</span>
                <span className="font-black text-[#F5C400] text-sm">{u.pontos_total} <small className="text-[8px] opacity-50">PTS</small></span>
              </div>
            ))}
          </div>
        </section>

        {/* CHAT/FEED */}
        <section className="mt-8 mb-12">
          <h2 className="text-xs font-black uppercase tracking-widest mb-4">Resenha da Galera</h2>
          <div className="h-[400px] rounded-2xl overflow-hidden border border-white/5">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico targetUserId={perfilAberto} jogoId={jogo?.id || 0} onClose={() => setPerfilAberto(null)} />
      )}
    </main>
  );
}
