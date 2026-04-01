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

// Tipagem para evitar o "any" e garantir estabilidade
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
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const sb = createClient(SB_URL, SB_KEY);

    async function init() {
      // 1. DADOS DO USUÁRIO ATUAL
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      // 2. PRÓXIMO JOGO & RANKING
      try {
        const [resJogo, { data: rankData }] = await Promise.all([
          fetch('/api/proximo-jogo').then(r => r.json()),
          sb.from('tigre_fc_usuarios').select('*').order('pontos_total', { ascending: false }).limit(10)
        ]);
        if (resJogo.jogos?.[0]) setJogo(resJogo.jogos[0]);
        if (rankData) setRanking(rankData);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    }
    init();
  }, [mounted]);

  // TIMER PRECISO (90min antes do jogo)
  useEffect(() => {
    if (!jogo) return;
    const timer = setInterval(() => {
      const gameTime = new Date(jogo.data_hora.replace(' ', 'T')).getTime();
      const lockTime = gameTime - (90 * 60 * 1000); 
      const diff = lockTime - Date.now();
      
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
    return () => clearInterval(timer);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-24 font-sans selection:bg-yellow-500 overflow-x-hidden">
      
      {/* 🏆 HEADER PREMIUM "TRANS MISSÃO TV" */}
      <header ref={topRef} className="bg-[#F5C400] pt-16 pb-20 px-6 border-b-[8px] border-black text-center relative overflow-hidden">
        {/* Camada de Textura e Brilho */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-black blur-2xl opacity-20 rounded-full scale-150" />
            <img src={LOGO} className="w-24 h-24 mx-auto relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]" alt="Tigre FC" />
          </div>
          
          <h1 className="text-6xl font-[1000] text-black italic uppercase leading-none tracking-tighter mb-2">TIGRE FC</h1>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[2px] w-12 bg-black/30 rounded-full" />
             <p className="text-[12px] font-black text-black uppercase tracking-[0.6em] font-mono">ULTIMATE 26</p>
             <div className="h-[2px] w-12 bg-black/30 rounded-full" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-12 relative z-20">
        
        {/* ⚡ CARD PRÓXIMO JOGO (DESIGN GLASS) */}
        {jogo && (
          <section className="mb-14">
            <div className="bg-[#111]/90 backdrop-blur-2xl rounded-[50px] border border-white/10 p-10 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-[0.03] text-[120px] font-black italic select-none">NEXT</div>
              
              <div className="flex justify-center gap-6 mb-10">
                {['h', 'm', 's'].map(unit => (
                  <div key={unit} className="flex flex-col items-center">
                    <span className="text-5xl font-black font-mono leading-none text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      {timeLeft[unit as keyof typeof timeLeft]}
                    </span>
                    <span className="text-[10px] text-yellow-500 font-black uppercase mt-2 tracking-widest">{unit === 'h' ? 'HORAS' : unit === 'm' ? 'MIN' : 'SEG'}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center px-4 mb-10 relative z-10">
                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-20 h-20 bg-white/5 rounded-full p-2 flex items-center justify-center mb-3">
                    <img src={jogo.mandante.escudo_url} className="w-14 h-14 object-contain" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-80">{jogo.mandante.nome}</p>
                </div>
                
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-zinc-700 italic bg-zinc-800/50 px-3 py-1 rounded-full mb-2">VS</span>
                    <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
                </div>

                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                  <div className="w-20 h-20 bg-white/5 rounded-full p-2 flex items-center justify-center mb-3">
                    <img src={jogo.visitante.escudo_url} className="w-14 h-14 object-contain" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-80">{jogo.visitante.nome}</p>
                </div>
              </div>

              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="relative flex items-center justify-center bg-[#F5C400] text-black py-6 rounded-[30px] font-[1000] uppercase italic text-sm shadow-[0_20px_40px_rgba(245,196,0,0.2)] hover:bg-white transition-all overflow-hidden group">
                <span className="relative z-10">MONTAR MEU TIME →</span>
                <div className="absolute inset-0 bg-white/40 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 skew-x-[-30deg]" />
              </Link>
            </div>
          </section>
        )}

        {/* 🌟 CARDS DESTAQUE FIFA (AUTÔNOMO) */}
        <DestaquesFifa />

        {/* 🔍 RAIO-X SOFASCORE (REFINADO) */}
        <section className="mt-24">
          <div className="flex items-center gap-3 mb-6 px-6">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-400 italic">Live Field Analysis</h2>
          </div>
          <div className="bg-white rounded-[55px] overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)] border-[12px] border-[#111] relative h-[600px]">
            <iframe 
              src={`https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=light`} 
              className="w-full h-full border-none"
              scrolling="no"
              loading="lazy"
            />
          </div>
        </section>

        {/* 🐯 RANKING "CORNETADA" (TRANSPARÊNCIA TOTAL) */}
        <section className="mt-24">
          <div className="flex justify-between items-end mb-8 px-6">
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600">Leaderboard</h2>
              <p className="text-2xl font-[1000] uppercase italic tracking-tighter text-white">Elite Ranking</p>
            </div>
            <Link href="/tigre-fc/ranking" className="text-[10px] font-black text-yellow-500 uppercase border-b border-yellow-500/30 pb-1">Ver Tudo</Link>
          </div>
          
          <div className="bg-[#0f0f0f] rounded-[50px] border border-white/5 overflow-hidden shadow-2xl">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} className="flex items-center p-7 border-b border-white/5 cursor-pointer hover:bg-white/[0.02] transition-all group">
                <span className={`w-10 text-sm font-black ${i < 3 ? 'text-yellow-500' : 'text-zinc-700'}`}>
                    {String(i+1).padStart(2, '0')}
                </span>
                <div className="relative mr-5">
                    <img src={u.avatar_url || LOGO} className="w-14 h-14 rounded-[20px] object-cover bg-zinc-900 border border-white/10 group-hover:border-yellow-500 transition-colors" />
                    {i === 0 && <div className="absolute -top-3 -right-2 text-xl drop-shadow-lg">👑</div>}
                </div>
                <div className="flex-1">
                   <p className="text-lg font-[1000] uppercase italic tracking-tighter group-hover:text-yellow-500 transition-colors">{u.apelido}</p>
                   <div className="flex gap-2 mt-1">
                      <span className="text-[8px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold uppercase">PRO TRAINER</span>
                      <span className="text-[8px] bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-bold uppercase">NV {u.nivel || 1}</span>
                   </div>
                </div>
                <div className="text-right">
                  <p className="font-[1000] text-white text-2xl leading-none">{u.pontos_total}</p>
                  <p className="text-[9px] text-zinc-600 font-black uppercase mt-1 tracking-tighter">TOTAL PTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 💬 CHAT VESTIÁRIO */}
        <section className="mt-24 mb-20">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] mb-6 px-6 text-zinc-500 italic">Vestiário Oficial</h2>
          <div className="h-[550px] rounded-[50px] border border-white/10 overflow-hidden shadow-2xl bg-[#080808] relative">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      {/* MODAL DE PERFIL PÚBLICO (A CORNETADA) */}
      {perfilAberto && (
        <TigreFCPerfilPublico 
          targetUserId={perfilAberto} 
          jogoId={jogo?.id || 0} 
          meuId={meuId} 
          onClose={() => setPerfilAberto(null)} 
        />
      )}

      <style jsx global>{`
        ::-webkit-scrollbar { width: 0px; }
        body { background-color: #050505; }
        .font-1000 { font-weight: 1000; }
      `}</style>
    </main>
  );
}
