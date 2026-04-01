'use client';
import { useState, useEffect, useRef } from 'react';
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
  const topRef = useRef<HTMLDivElement>(null);

  // 1. BLOQUEIO DE AUTO-SCROLL E MONTAGEM
  useEffect(() => {
    setMounted(true);
    // Força o scroll para o topo imediatamente e após um pequeno delay para vencer os iframes
    window.scrollTo(0, 0);
    const t = setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const sb = createClient(SB_URL, SB_KEY);

    async function init() {
      // 2. DADOS DO USUÁRIO
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      // 3. BUSCA DE DESTAQUES (LÓGICA BLINDADA)
      // Buscamos os maiores pontuadores independente de rodada para garantir que o componente apareça
      try {
        const { data: scouts } = await sb
          .from('tigre_fc_scouts_jogadores')
          .select('pontos, jogador:jogador_id(nome, foto_url)')
          .order('pontos', { ascending: false })
          .limit(2);

        if (scouts && scouts.length >= 2) {
          const j1 = Array.isArray(scouts[0].jogador) ? scouts[0].jogador[0] : scouts[0].jogador;
          const j2 = Array.isArray(scouts[1].jogador) ? scouts[1].jogador[0] : scouts[1].jogador;
          
          if (j1 && j2) {
            setDestaques({
              capitao: { nome: j1.nome, foto_url: j1.foto_url, pontos: scouts[0].pontos * 2 },
              heroi: { nome: j2.nome, foto_url: j2.foto_url, pontos: scouts[1].pontos }
            });
          }
        }
      } catch (e) { console.error("Erro Destaques FIFA:", e); }

      // 4. RANKING E PRÓXIMO JOGO
      const [resJogo, { data: rankData }] = await Promise.all([
        fetch('/api/proximo-jogo').then(r => r.json()),
        sb.from('tigre_fc_usuarios').select('*').order('pontos_total', { ascending: false }).limit(10)
      ]);
      if (resJogo.jogos?.[0]) setJogo(resJogo.jogos[0]);
      if (rankData) setRanking(rankData);
    }
    init();
  }, [mounted]);

  // TIMER PRECISO
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
    <main className="min-h-screen bg-[#050505] text-white pb-24 font-sans selection:bg-yellow-500 overflow-x-hidden">
      
      {/* HEADER UT26 ELITE */}
      <header ref={topRef} className="bg-[#F5C400] px-6 py-12 border-b-[6px] border-black text-center relative overflow-hidden shadow-[0_10px_50px_rgba(245,196,0,0.3)]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        {/* Partículas de Brilho */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-50">
            <div className="absolute top-[-10%] left-[20%] w-32 h-32 bg-white/20 blur-[80px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[20%] w-32 h-32 bg-white/20 blur-[80px] rounded-full animate-pulse delay-700" />
        </div>
        
        <div className="max-w-md mx-auto relative z-10">
          <img src={LOGO} className="w-20 h-20 mx-auto mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]" />
          <h1 className="text-5xl font-[1000] text-black italic uppercase leading-none tracking-tighter">TIGRE FC</h1>
          <div className="flex items-center justify-center gap-3 mt-3">
             <span className="h-[1px] w-8 bg-black/20" />
             <p className="text-[11px] font-black text-black/60 uppercase tracking-[0.5em] font-mono">Ultimate Team 26</p>
             <span className="h-[1px] w-8 bg-black/20" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-10 relative z-20">
        
        {/* CARD PRÓXIMO JOGO (ULTRA GLASS) */}
        {jogo && (
          <section className="mb-14">
            <div className="bg-[#111]/80 backdrop-blur-xl rounded-[45px] border border-white/10 p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-[60px] font-black italic select-none">NEXT</div>
              
              <div className="flex justify-center gap-8 mb-10">
                {['h', 'm', 's'].map(u => (
                  <div key={u} className="flex flex-col items-center">
                    <span className="text-5xl font-black font-mono leading-none tracking-tighter text-white drop-shadow-glow">
                        {timeLeft[u as keyof typeof timeLeft]}
                    </span>
                    <span className="text-[9px] text-yellow-500 font-[1000] uppercase mt-2 tracking-[0.3em]">{u === 'h' ? 'HORAS' : u === 'm' ? 'MIN' : 'SEG'}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center px-2 mb-10">
                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                  <img src={jogo.mandante.escudo_url} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                  <p className="text-[10px] font-black mt-3 uppercase tracking-tighter max-w-[80px] leading-tight">{jogo.mandante.nome}</p>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-sm font-black text-zinc-800 italic mb-1 uppercase tracking-widest">VS</span>
                    <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-zinc-800 to-transparent" />
                </div>
                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                  <img src={jogo.visitante.escudo_url} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
                  <p className="text-[10px] font-black mt-3 uppercase tracking-tighter max-w-[80px] leading-tight">{jogo.visitante.nome}</p>
                </div>
              </div>

              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="relative flex items-center justify-center bg-[#F5C400] text-black py-6 rounded-[25px] font-[1000] uppercase italic text-sm shadow-[0_15px_30px_rgba(245,196,0,0.2)] hover:bg-white active:scale-95 transition-all overflow-hidden group">
                <span className="relative z-10">Escalar meu Time →</span>
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-[-20deg]" />
              </Link>
            </div>
          </section>
        )}

        {/* DESTAQUES FIFA NEON (Com Fallback de Carregamento) */}
        {destaques ? (
        <DestaquesFifa />

        {/* RAIO-X TIGRE FC (Com proteção de Scroll) */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-6 px-4">
            <div className="flex items-center gap-3">
                <div className="h-6 w-2 bg-[#F5C400] rounded-full animate-pulse" />
                <h2 className="text-[12px] font-[1000] uppercase tracking-[0.25em] text-zinc-300 italic">Raio-X Tigre FC</h2>
            </div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Live Sync</span>
          </div>
          <div className="bg-white rounded-[50px] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.08)] border-[10px] border-white group relative" style={{ height: 580 }}>
            <iframe 
              src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=light" 
              className="w-full h-full border-none"
              scrolling="no"
              loading="lazy"
              title="SofaScore Lineups"
            />
          </div>
        </section>

        {/* RANKING GLOBAL (DESIGN LIMPO E IMPACTANTE) */}
        <section className="mt-20">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 px-4 text-zinc-500">Global Leaderboard</h2>
          <div className="bg-[#0f0f0f] rounded-[45px] border border-white/5 overflow-hidden shadow-2xl">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} className="flex items-center p-7 border-b border-white/5 cursor-pointer hover:bg-white/[0.03] active:bg-white/[0.07] transition-all group">
                <span className={`w-10 text-xs font-[1000] ${i < 3 ? 'text-[#F5C400]' : 'text-zinc-700'}`}>
                    {String(i+1).padStart(2, '0')}
                </span>
                <div className="relative">
                    <img src={u.avatar_url || LOGO} className="w-12 h-12 rounded-2xl mr-5 object-cover bg-zinc-900 border border-white/10 group-hover:border-yellow-500/50 transition-colors" />
                    {i === 0 && <div className="absolute -top-2 -right-1 text-lg">👑</div>}
                </div>
                <div className="flex-1">
                   <p className="text-md font-[1000] uppercase italic tracking-tight group-hover:text-yellow-500 transition-colors">{u.apelido || u.nome}</p>
                   <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Nível de Treinador {u.nivel || 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-[1000] text-[#F5C400] text-2xl leading-none drop-shadow-glow-yellow">{u.pontos_total}</p>
                  <p className="text-[8px] text-zinc-700 font-black uppercase mt-1.5 tracking-tighter">Pontos</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CHAT / VESTIÁRIO (FULL HEIGHT) */}
        <section className="mt-20 mb-20">
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] mb-6 px-4 text-zinc-500 italic">Vestiário Premium</h2>
          <div className="h-[520px] rounded-[45px] border border-white/10 overflow-hidden shadow-2xl bg-[#080808]">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico targetUserId={perfilAberto} jogoId={jogo?.id || 0} onClose={() => setPerfilAberto(null)} />
      )}

      <style jsx global>{`
        .drop-shadow-glow {
            filter: drop-shadow(0 0 8px rgba(255,255,255,0.3));
        }
        .drop-shadow-glow-yellow {
            filter: drop-shadow(0 0 10px rgba(245,196,0,0.4));
        }
        ::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </main>
  );
}
