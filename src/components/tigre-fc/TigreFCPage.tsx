'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa'; 

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
    const sb = createClient(SB_URL, SB_KEY);

    async function init() {
      // 1. Dados Usuário
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      // 2. Próximo Jogo e Ranking
      const [resJogo, { data: rankData }] = await Promise.all([
        fetch('/api/proximo-jogo').then(r => r.json()),
        sb.from('tigre_fc_usuarios').select('*').order('pontos_total', { ascending: false }).limit(10)
      ]);
      if (resJogo.jogos?.[0]) setJogo(resJogo.jogos[0]);
      if (rankData) setRanking(rankData);

      // 3. Lógica Automática de Destaques
      try {
        const { data: scouts } = await sb
          .from('tigre_fc_scouts_jogadores')
          .select('pontos, jogador:jogador_id(nome, foto_url)')
          .order('pontos', { ascending: false })
          .limit(2);

        if (scouts && scouts.length >= 2) {
          const j1 = Array.isArray(scouts[0].jogador) ? scouts[0].jogador[0] : scouts[0].jogador;
          const j2 = Array.isArray(scouts[1].jogador) ? scouts[1].jogador[0] : scouts[1].jogador;
          
          setDestaques({
            capitao: { nome: j1.nome, foto_url: j1.foto_url, pontos: scouts[0].pontos * 2 }, // x2 da regra de capitão
            heroi: { nome: j2.nome, foto_url: j2.foto_url, pontos: scouts[1].pontos }
          });
        }
      } catch (e) { console.error("Falha no boot de destaques", e); }
    }
    init();
  }, [mounted]);

  useEffect(() => {
    if (!jogo) return;
    const timer = setInterval(() => {
      const diff = new Date(jogo.data_hora.replace(' ', 'T')).getTime() - (90 * 60 * 1000) - Date.now();
      if (diff <= 0) return setTimeLeft({ h: '00', m: '00', s: '00' });
      setTimeLeft({
        h: String(Math.floor(diff / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0')
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24 font-sans selection:bg-yellow-500">
      
      {/* Header UT26 Elite */}
      <header className="bg-[#F5C400] px-6 py-12 border-b-[6px] border-black text-center relative overflow-hidden shadow-[0_10px_40px_rgba(245,196,0,0.2)]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-md mx-auto relative z-10">
          <img src={LOGO} className="w-16 h-16 mx-auto mb-3 drop-shadow-2xl" />
          <h1 className="text-4xl font-[1000] text-black italic uppercase leading-none tracking-tighter">TIGRE FC</h1>
          <p className="text-[10px] font-black text-black/50 uppercase tracking-[0.4em] mt-2 font-mono">ULTIMATE TEAM 26</p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-10 relative z-20">
        
        {/* Card de Próximo Jogo (Glassmorphism) */}
        {jogo && (
          <section className="mb-12">
            <div className="bg-[#111] rounded-[40px] border border-white/10 p-8 shadow-2xl backdrop-blur-md">
              <div className="flex justify-center gap-6 mb-8">
                {['h', 'm', 's'].map(u => (
                  <div key={u} className="flex flex-col items-center">
                    <span className="text-4xl font-black font-mono leading-none tracking-tighter">{timeLeft[u as keyof typeof timeLeft]}</span>
                    <span className="text-[8px] text-yellow-500 font-black uppercase mt-1 tracking-widest">{u === 'h' ? 'HOURS' : u === 'm' ? 'MIN' : 'SEC'}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-4 mb-8">
                <img src={jogo.mandante.escudo_url} className="w-16 h-16 object-contain drop-shadow-2xl" />
                <span className="text-xs font-black text-zinc-800 italic">VS</span>
                <img src={jogo.visitante.escudo_url} className="w-16 h-16 object-contain drop-shadow-2xl" />
              </div>
              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="flex items-center justify-center bg-[#F5C400] text-black py-5 rounded-2xl font-[1000] uppercase italic text-sm shadow-xl active:scale-95 transition-transform">
                Escalar meu Time →
              </Link>
            </div>
          </section>
        )}

        {/* Destaques FIFA Neon */}
        {destaques && <DestaquesFifa capitao={destaques.capitao} heroi={destaques.heroi} />}

        {/* RAIO-X TIGRE FC (SofaScore Personalizado) */}
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-5 px-3">
            <div className="h-5 w-1.5 bg-[#F5C400] rounded-full animate-pulse" />
            <h2 className="text-[11px] font-[1000] uppercase tracking-[0.2em] text-zinc-400 italic">Raio-X Tigre FC</h2>
          </div>
          <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)] border-[8px] border-white" style={{ height: 560 }}>
            <iframe 
              src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=light" 
              className="w-full h-full border-none"
              scrolling="no"
            />
          </div>
        </section>

        {/* Ranking Pro */}
        <section className="mt-16">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-5 px-3 text-zinc-500">Global Leaderboard</h2>
          <div className="bg-[#0f0f0f] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} className="flex items-center p-6 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <span className={`w-8 text-xs font-black ${i < 3 ? 'text-[#F5C400]' : 'text-zinc-700'}`}>{String(i+1).padStart(2, '0')}</span>
                <img src={u.avatar_url || LOGO} className="w-11 h-11 rounded-2xl mr-4 object-cover bg-zinc-900 border border-white/10" />
                <div className="flex-1">
                   <p className="text-sm font-black uppercase italic tracking-tight">{u.apelido || u.nome}</p>
                   <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5">Mestre Nível {u.nivel || 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-[1000] text-[#F5C400] text-xl leading-none">{u.pontos_total}</p>
                  <p className="text-[7px] text-zinc-600 font-black uppercase mt-1">PTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Chat / Vestiário */}
        <section className="mt-16 mb-16">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-5 px-3 text-zinc-500 italic">Vestiário em Fogo</h2>
          <div className="h-[480px] rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
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
