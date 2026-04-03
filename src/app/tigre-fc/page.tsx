'use client';

import React, { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import LigasHub from '@/components/tigre-fc/LigasHub';
// Importe aqui seus outros componentes (Chat, SofaScore, Ranking Geral)

export default function HubTigreFC() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* HEADER PREMIUM */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black italic uppercase tracking-tighter">Tigre FC Central</h1>
        <div className="bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-bold">
          {user?.email ? 'CONECTADO' : 'CONVIDADO'}
        </div>
      </header>

      {/* CARD DO PRÓXIMO JOGO (ONDE FICA O BOTÃO DE ESCALAR) */}
      <section className="mb-8 bg-zinc-900 border border-yellow-500/30 rounded-3xl p-6 shadow-[0_0_20px_rgba(245,196,0,0.1)]">
        <div className="flex flex-col items-center text-center">
          <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest mb-2">Próxima Partida</p>
          <h2 className="text-xl font-bold mb-4">Novorizontino vs Adversário</h2>
          
          <button 
            onClick={() => router.push('/tigre-fc/escalar/PROXIMO_JOGO_ID')}
            className="bg-yellow-500 text-black font-black uppercase px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-[0_8px_20px_rgba(245,196,0,0.3)]"
          >
            🔥 ESCALAR MEU TIME AGORA
          </button>
        </div>
      </section>

      {/* COMPONENTES QUE VOCÊ MENCIONOU */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RANKING E LIGAS */}
        <div className="space-y-6">
          <LigasHub usuarioId={user?.id} />
        </div>

        {/* CHAT E SOFASCORE */}
        <div className="space-y-6">
           {/* Adicione aqui: <ChatGeral /> */}
           {/* Adicione aqui: <SofaScoreWidget /> */}
           <div className="bg-zinc-900 rounded-3xl p-6 border border-white/5 h-64 flex items-center justify-center text-zinc-500 italic">
              Espaço para Chat e SofaScore
           </div>
        </div>
      </div>
    </div>
  );
}
