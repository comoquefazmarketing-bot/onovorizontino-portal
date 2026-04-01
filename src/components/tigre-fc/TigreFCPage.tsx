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
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

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
    <main className="min-h-screen bg-[#050505] text-white pb-32 font-sans selection:bg-yellow-500 overflow-x-hidden">
      
      {/* 🏆 HEADER PREMIUM */}
      <header ref={topRef} className="bg-[#F5C400] pt-16 pb-24 px-6 border-b-[10px] border-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        
        <div className="max-w-md mx-auto relative z-10">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-black blur-3xl opacity-30 rounded-full scale-150" />
            <img src={LOGO} className="w-28 h-28 mx-auto relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]" alt="Tigre FC" />
          </div>
          
          <h1 className="text-6xl font-[1000] text-black italic uppercase leading-none tracking-tighter mb-2">TIGRE FC</h1>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[2px] w-12 bg-black/40 rounded-full" />
             <p className="text-[12px] font-black text-black uppercase tracking-[0.6em]">ULTIMATE 26</p>
             <div className="h-[2px] w-12 bg-black/40 rounded-full" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-16 relative z-20">
        
        {/* ⚡ CARD PRÓXIMO JOGO */}
        {jogo && (
          <section className="mb-16">
            <div className="bg-[#111111]/80 backdrop-blur-3xl rounded-[55px] border border-white/10 p-10 shadow-[0_40px_100px_rgba(0,0,0,0.9)] relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 opacity-[0.05] text-[130px] font-[1000] italic select-none text-white">NEXT</div>
              
              <div className="flex justify-center gap-6 mb-12">
                {['h', 'm', 's'].map(unit => (
                  <div key={unit} className="flex flex-col items-center">
                    <span className="text-5xl font-[1000] font-mono leading-none text-white tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                      {timeLeft[unit as keyof typeof timeLeft]}
                    </span>
                    <span className="text-[9px] text-yellow-500 font-black uppercase mt-2 tracking-[0.3em]">{unit === 'h' ? 'HORAS' : unit === 'm' ? 'MIN' : 'SEG'}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center px-4 mb-12 relative z-10">
                <div className="text-center group-hover:scale-110 transition-transform duration-700">
                  <div className="w-24 h-24 bg-white/5 rounded-[30px] p-4 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                    <img src={jogo.mandante.escudo_url} className="w-16 h-16 object-contain" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-tighter text-zinc-400">{jogo.mandante.nome}</p>
                </div>
                
                <div className="flex flex-col items-center">
                    <div className="bg-yellow-500 text-black text-[10px] font-[1000] px-3 py-1 rounded-full italic mb-4 shadow-lg">LIVE</div>
                    <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-zinc-700 to-transparent" />
                </div>

                <div className="text-center group-hover:scale-110 transition-transform duration-700">
                  <div className="w-24 h-24 bg-white/5 rounded-[30px] p-4 flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                    <img src={jogo.visitante.escudo_url} className="w-16 h-16 object-contain" />
                  </div>
                  <p className="text-[11px] font-black uppercase tracking-tighter text-zinc-400">{jogo.visitante.nome}</p>
                </div>
              </div>

              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="relative flex items-center justify-center bg-[#F5C400] text-black py-7 rounded-[35px] font-[1000] uppercase italic text-sm shadow-[0_20px_50px_rgba(245,196,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all overflow-hidden group">
                <span className="relative z-10 tracking-widest">MONTAR MEU TIME →</span>
                <div className="absolute inset-0 bg-white/40 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 skew-x-[-30deg]" />
              </Link>
            </div>
          </section>
        )}

        {/* 🌟 DESTAQUES FIFA */}
        <DestaquesFifa />

        {/* 🔍 RAIO-X CAMPO */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-8 px-6">
            <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Live Analysis</h2>
            </div>
          </div>
          <div className="bg-[#111] rounded-[60px] overflow-hidden shadow-2xl border-[10px] border-[#0a0a0a] relative h-[650px]">
            <iframe 
              src={`https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=dark`} 
              className="w-full h-full border-none"
              scrolling="no"
              loading="lazy"
            />
          </div>
        </section>

        {/* 🐯 RANKING "CORNETADA" PREMIUM */}
        <section className="mt-28">
          <div className="flex justify-between items-end mb-10 px-6">
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-zinc-600">Leaderboard</h2>
              <p className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">Elite Ranking</p>
            </div>
            <Link href="/tigre-fc/ranking" className="text-[10px] font-black text-yellow-500 uppercase border-b-2 border-yellow-500/20 pb-1 hover:border-yellow-500 transition-all">Full Table</Link>
          </div>
          
          <div className="space-y-4">
            {ranking.map((u, i) => (
              <div 
                key={u.id} 
                onClick={() => setPerfilAberto(u.id)} 
                className={`
                  flex items-center p-6 cursor-pointer transition-all duration-500 group
                  rounded-[40px] border backdrop-blur-xl
                  ${i === 0 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-transparent border-yellow-500/40 shadow-[0_20px_60px_rgba(245,196,0,0.15)] scale-[1.02]' 
                    : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07] hover:border-white/20'
                  }
                `}
              >
                {/* ÍCONE TIGRE IMPIEDOSO (SÓ PRO LÍDER) */}
                <div className="w-14 flex flex-col items-center justify-center mr-4">
                  {i === 0 ? (
                    <div className="relative">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_12px_rgba(245,196,0,0.8)]">
                        <path d="M12 2L8 6H16L12 2Z" fill="#F5C400"/>
                        <path d="M2 9L7 8L5 13L2 9Z" fill="#F5C400"/>
                        <path d="M22 9L17 8L19 13L22 9Z" fill="#F5C400"/>
                        <path d="M7 9C7 9 8 11 12 11C16 11 17 9 17 9L15 17H9L7 9Z" fill="#F5C400" />
                        <circle cx="10" cy="12" r="1.2" fill="white" className="animate-pulse" />
                        <circle cx="14" cy="12" r="1.2" fill="white" className="animate-pulse" />
                        <path d="M11 14.5H13" stroke="black" strokeWidth="1.2" strokeLinecap="round"/>
                        <path d="M12 22L9 19H15L12 22Z" fill="#F5C400"/>
                      </svg>
                    </div>
                  ) : (
                    <span className={`text-base font-[1000] italic ${i < 3 ? 'text-yellow-500' : 'text-zinc-700'}`}>
                        {String(i+1).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* AVATAR COM SHINE */}
                <div className="relative mr-5">
                    <img 
                      src={u.avatar_url || LOGO} 
                      className={`w-16 h-16 rounded-[24px] object-cover bg-zinc-900 border-2 transition-all duration-700
                        ${i === 0 ? 'border-yellow-500 shadow-[0_0_30px_rgba(245,196,0,0.4)] rotate-2' : 'border-white/10 group-hover:border-white/40'}
                      `} 
                    />
                    {i === 0 && (
                      <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase italic border-2 border-black">MVP</div>
                    )}
                </div>

                <div className="flex-1">
                   <p className={`text-xl font-[1000] uppercase italic tracking-tighter transition-colors ${i === 0 ? 'text-yellow-500' : 'text-white'}`}>
                     {u.apelido || u.nome}
                   </p>
                   <div className="flex gap-2 mt-1.5">
                      <span className={`text-[8px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest ${i === 0 ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                        {i === 0 ? 'LÍDER DA ALCATEIA' : 'PRO TRAINER'}
                      </span>
                   </div>
                </div>

                <div className="text-right">
                  <p className={`font-[1000] text-3xl leading-none tracking-tighter ${i === 0 ? 'text-yellow-500' : 'text-white'}`}>
                    {u.pontos_total}
                  </p>
                  <p className="text-[9px] text-zinc-600 font-black uppercase mt-1 tracking-tighter">TOTAL PTS</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 💬 CHAT VESTIÁRIO */}
        <section className="mt-28 mb-20">
          <div className="flex items-center justify-between mb-8 px-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Vestiário Oficial</h2>
            <div className="flex -space-x-3">
                {[1,2,3].map(n => (
                    <div key={n} className="w-8 h-8 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[10px] font-black">?</div>
                ))}
            </div>
          </div>
          <div className="h-[600px] rounded-[60px] border border-white/10 overflow-hidden shadow-2xl bg-[#0a0a0a] relative ring-1 ring-white/5">
            <TigreFCChat usuarioId={meuId} />
          </div>
        </section>
      </div>

      {/* MODAL DE PERFIL */}
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
        @keyframes shine {
          from { transform: translateX(-150%) skewX(-30deg); }
          to { transform: translateX(150%) skewX(-30deg); }
        }
      `}</style>
    </main>
  );
}
