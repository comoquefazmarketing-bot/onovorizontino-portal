'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa'; 

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });
  const [destaques, setDestaques] = useState<any>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    async function loadData() {
      // 1. Próximo Jogo
      const res = await fetch('/api/proximo-jogo').then(r => r.json());
      if (res.jogos?.[0]) setJogo(res.jogos[0]);

      // 2. Meu Usuário
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).single();
        if (u) setMeuId(u.id);
      }

      // 3. Ranking
      const { data: rankData } = await sb.from('tigre_fc_usuarios').select('*').order('pontos_total', { ascending: false }).limit(10);
      if (rankData) setRanking(rankData);

      // 4. Destaques (Fall-back seguro para sempre mostrar algo)
      const { data: sc } = await sb.from('tigre_fc_scouts_jogadores').select('pontos, jogador:jogador_id(nome, foto_url)').order('pontos', { ascending: false }).limit(2);
      if (sc && sc.length >= 2) {
        const j1 = Array.isArray(sc[0].jogador) ? sc[0].jogador[0] : sc[0].jogador;
        const j2 = Array.isArray(sc[1].jogador) ? sc[1].jogador[0] : sc[1].jogador;
        setDestaques({
          capitao: { nome: j1.nome, foto_url: j1.foto_url, pontos: sc[0].pontos },
          heroi: { nome: j2.nome, foto_url: j2.foto_url, pontos: sc[1].pontos }
        });
      }
    }
    loadData();
  }, [mounted]);

  // Cronômetro funcional
  useEffect(() => {
    if (!jogo) return;
    const interval = setInterval(() => {
      const dataISO = jogo.data_hora.replace(' ', 'T');
      const diff = new Date(dataISO).getTime() - (90 * 60 * 1000) - Date.now();
      if (diff <= 0) {
        setTimeLeft({ h: '00', m: '00', s: '00' });
        return;
      }
      setTimeLeft({
        h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [jogo]);

  if (!mounted) return <main className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20">
      {/* HEADER AMARELO COM IDENTIDADE UT26 */}
      <header className="bg-[#F5C400] px-4 py-8 border-b-4 border-black relative overflow-hidden text-center">
        <div className="max-w-md mx-auto relative z-10">
          <img src={LOGO} className="w-14 h-14 mx-auto mb-2 drop-shadow-lg" alt="Logo" />
          <h1 className="text-3xl font-black text-black italic uppercase leading-none">TIGRE FC</h1>
          <p className="text-[11px] font-extrabold text-black/60 uppercase tracking-widest mt-1">Ultimate Team 26</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-4">
        
        {/* TIMER E PROXIMO JOGO */}
        {jogo && (
          <section className="mb-8">
            <div className="bg-[#111] rounded-3xl border border-white/10 p-6 shadow-2xl">
               <div className="flex justify-center gap-6 mb-6">
                {['h', 'm', 's'].map(u => (
                  <div key={u} className="text-center">
                    <span className="text-3xl font-black font-mono block">{timeLeft[u as keyof typeof timeLeft]}</span>
                    <span className="text-[8px] text-yellow-500 font-bold uppercase">{u === 'h' ? 'horas' : u === 'm' ? 'min' : 'seg'}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-8 mb-6">
                <img src={jogo.mandante.escudo_url} className="w-14 h-14 object-contain" />
                <span className="text-xs font-black text-zinc-700 italic">VS</span>
                <img src={jogo.visitante.escudo_url} className="w-14 h-14 object-contain" />
              </div>
              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="block bg-[#F5C400] text-black py-4 rounded-2xl font-black text-center uppercase italic hover:scale-[1.02] transition-transform">
                Escalar Agora →
              </Link>
            </div>
          </section>
        )}

        {/* CARDS FIFA NEON */}
        {destaques && <DestaquesFifa capitao={destaques.capitao} heroi={destaques.heroi} />}

        {/* RANKING */}
        <section className="mt-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Top 10 Global</h2>
          <div className="bg-[#0f0f0f] rounded-2xl border border-white/5 overflow-hidden">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} className="flex items-center p-4 border-b border-white/5 active:bg-white/5">
                <span className={`w-8 text-[10px] font-black ${i < 3 ? 'text-yellow-500' : 'text-zinc-600'}`}>#{i+1}</span>
                <img src={u.avatar_url || LOGO} className="w-8 h-8 rounded-lg mr-3 object-cover" />
                <span className="flex-1 text-sm font-bold truncate">{u.apelido || u.nome}</span>
                <span className="font-black text-yellow-500 text-sm">{u.pontos_total}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CHAT */}
        <section className="mt-10">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-zinc-500">Vestiário em Tempo Real</h2>
          <div className="h-[400px] rounded-2xl border border-white/5 overflow-hidden">
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
