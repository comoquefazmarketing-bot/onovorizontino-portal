'use client';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

// TimerBlock com destaque nos dias
function TimerBlock({ value, label, isDays = false }: { 
  value: string; 
  label: string; 
  isDays?: boolean 
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative w-[72px] h-[80px] flex items-center justify-center 
        bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] 
        border border-white/10 rounded-2xl shadow-2xl overflow-hidden
        ${isDays ? 'border-yellow-500/60 shadow-[0_0_20px_rgba(245,196,0,0.4)]' : ''}`}>
        
        <span className={`relative z-10 text-4xl font-black font-mono tracking-tighter
          ${isDays ? 'text-[#F5C400] drop-shadow-[0_0_12px_rgba(245,196,0,0.7)]' : 'text-white'}`}>
          {value}
        </span>
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest
        ${isDays ? 'text-yellow-500' : 'text-zinc-500'}`}>
        {label}
      </span>
    </div>
  );
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);

  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [mercadoAberto, setMercadoAberto] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  // Carregar dados (mantido igual)
  useEffect(() => {
    if (!mounted) return;
    async function init() {
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }
     
      const resJogo = await fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null);
      if (resJogo?.jogos?.length > 0) {
        setJogo(resJogo.jogos[0]);
      } else {
        setJogo({
          id: 4,
          data_hora: '2026-04-12T18:00:00',
          mandante: { nome: 'América-MG', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png' },
          visitante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png' },
        });
      }
      const { data: resRank } = await sb.from('tigre_fc_usuarios').select('id,nome,apelido,avatar_url,pontos_total').order('pontos_total',{ascending:false}).limit(10);
      if (resRank) setRanking(resRank);
    }
    init();
  }, [mounted]);

  // Cronômetro corrigido
  useEffect(() => {
    if (!jogo?.data_hora) return;

    const tick = () => {
      const dateStr = jogo.data_hora.includes('T') ? jogo.data_hora : jogo.data_hora.replace(' ', 'T');
      const gameTime = new Date(dateStr).getTime();
      const lockTime = gameTime - (90 * 60 * 1000);
      const diff = lockTime - Date.now();

      if (diff <= 0) {
        setMercadoAberto(false);
        setTimeLeft({ d: '00', h: '00', m: '00', s: '00' });
        return;
      }

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        d: String(d).padStart(2, '0'),
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0')
      });
    };

    const t = setInterval(tick, 1000);
    tick();
    return () => clearInterval(t);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 font-sans overflow-x-hidden">
      {/* HEADER PREMIUM */}
      <div className="relative pt-20 pb-28 text-center bg-gradient-to-b from-yellow-500/10 to-transparent">
        <img src={PATA_LOGO} className="w-16 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(245,196,0,0.5)]" />
        <h1 className="text-7xl font-black tracking-tighter italic">TIGRE <span className="text-[#F5C400]">FC</span></h1>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-16 relative z-10">
        
        {jogo && (
          <section className="mb-12">
            <div className="bg-[#0f0f0f]/90 backdrop-blur-2xl rounded-[40px] border border-white/5 p-8 shadow-2xl">
              
              {/* STATUS */}
              <div className="flex justify-center mb-8">
                <div className={`px-4 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase ${mercadoAberto ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                  {mercadoAberto ? '● Mercado Aberto' : '● Mercado Fechado'}
                </div>
              </div>

              {/* CRONÔMETRO COM 4 BLOCOS + RESPONSIVO */}
              <div className="flex justify-between items-center mb-12 gap-2 sm:gap-3 px-1">
                <TimerBlock value={timeLeft.d} label="DIAS" isDays={true} />
                <TimerBlock value={timeLeft.h} label="HORAS" />
                <TimerBlock value={timeLeft.m} label="MIN" />
                <TimerBlock value={timeLeft.s} label="SEG" />
              </div>

              {/* CONFRONTO */}
              <div className="flex items-center justify-between mb-10 px-2">
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <img src={jogo.mandante.escudo_url} className="w-16 h-16 object-contain" />
                  <span className="text-[10px] font-black uppercase text-center leading-tight">{jogo.mandante.nome}</span>
                </div>
                <div className="text-2xl font-black text-white/10 italic">VS</div>
                <div className="flex flex-col items-center gap-3 w-1/3">
                  <img src={jogo.visitante.escudo_url} className="w-16 h-16 object-contain" />
                  <span className="text-[10px] font-black uppercase text-center leading-tight">{jogo.visitante.nome}</span>
                </div>
              </div>

              {/* BOTÃO */}
              <Link
                href={`/tigre-fc/escalar/${jogo.id}`}
                className={`block w-full py-5 rounded-2xl text-center font-black text-sm tracking-[0.2em] transition-all ${
                  mercadoAberto
                    ? 'bg-[#F5C400] text-black shadow-[0_10px_30px_-10px_rgba(245,196,0,0.5)] active:scale-95'
                    : 'bg-zinc-800 text-zinc-500 pointer-events-none'
                }`}
              >
                {mercadoAberto ? '⚡ CONVOCAR TITULARES' : 'MERCADO FECHADO'}
              </Link>
            </div>
          </section>
        )}

        <DestaquesFifa />

        {/* Ranking */}
        <section className="mt-12">
          <h2 className="text-2xl font-black italic mb-6">LÍDERES DA ALCATEIA</h2>
          <div className="space-y-3">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer">
                <span className="font-black text-zinc-600 w-4">{i + 1}</span>
                <img src={u.avatar_url || PATA_LOGO} className="w-10 h-10 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-black uppercase text-sm leading-none">{u.apelido || u.nome}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-[#F5C400] leading-none">{u.pontos_total}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <TigreFCChat usuarioId={meuId} />
        </section>
      </div>

      <AnimatePresence>
        {perfilAberto && (
          <TigreFCPerfilPublico
            targetUsuarioId={perfilAberto}
            viewerUsuarioId={meuId}
            onClose={() => setPerfilAberto(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
