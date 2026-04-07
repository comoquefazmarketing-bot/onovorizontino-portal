'use client';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

interface Time {
  nome: string;
  escudo_url: string;
}

interface Jogo {
  id: number;
  data_hora: string;
  mandante: Time;
  visitante: Time;
}

interface UsuarioRanking {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number;
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: '00', h: '00', m: '00', s: '00' });
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Carregar dados
  useEffect(() => {
    if (!mounted) return;

    async function init() {
      setIsLoading(true);
      try {
        const { data: { session } } = await sb.auth.getSession();
        if (session?.user?.id) {
          const { data: u } = await sb
            .from('tigre_fc_usuarios')
            .select('id')
            .eq('google_id', session.user.id)
            .maybeSingle();
          if (u) setMeuId(u.id);
        }

        const [resJogo, resRank] = await Promise.all([
          fetch('/api/proximo-jogo').then(r => r.json()).catch(() => null),
          sb.from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .order('pontos_total', { ascending: false })
            .limit(10)
        ]);

        if (resJogo?.jogos?.[0]) {
          setJogo(resJogo.jogos[0]);
        } else {
          setJogo({
            id: 4,
            data_hora: '2026-04-12T18:00:00',
            mandante: { nome: 'América-MG', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20AMERICA%20MINEIRO.png' },
            visitante: { nome: 'Novorizontino', escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png' },
          });
        }

        if (resRank.data) setRanking(resRank.data as UsuarioRanking[]);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [mounted]);

  // ==================== CRONÔMETRO COM DIAS ====================
  useEffect(() => {
    if (!jogo?.data_hora) return;

    const calculateTime = () => {
      const gameTime = new Date(jogo.data_hora).getTime();
      const lockTime = gameTime - (60 * 60 * 1000); // 1 hora antes
      const now = Date.now();
      let diff = lockTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: '00', h: '00', m: '00', s: '00' });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff %= (1000 * 60 * 60 * 24);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff %= (1000 * 60 * 60);

      const minutes = Math.floor(diff / (1000 * 60));
      diff %= (1000 * 60);

      const seconds = Math.floor(diff / 1000);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        h: String(hours).padStart(2, '0'),
        m: String(minutes).padStart(2, '0'),
        s: String(seconds).padStart(2, '0'),
      });
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(timer);
  }, [jogo]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-40 font-sans selection:bg-yellow-500 overflow-x-hidden">
      
      {/* HEADER PREMIUM - mantenha o seu original aqui */}

      <div className="max-w-md mx-auto px-4 -mt-20 relative z-20">
        
        {jogo && (
          <section className="mb-20">
            <div className="bg-zinc-900/90 backdrop-blur-3xl rounded-[60px] border border-white/10 p-10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
              
              {/* TIMER COM DIAS */}
              <div className="flex justify-center gap-4 mb-12">
                <div className="flex flex-col items-center">
                  <div className="bg-black/60 px-5 py-3 rounded-3xl border border-white/10">
                    <span className="text-5xl font-mono font-black text-white">{timeLeft.days}</span>
                  </div>
                  <span className="text-xs font-black uppercase mt-2 text-zinc-500">DIAS</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-black/60 px-5 py-3 rounded-3xl border border-white/10">
                    <span className="text-5xl font-mono font-black text-white">{timeLeft.h}</span>
                  </div>
                  <span className="text-xs font-black uppercase mt-2 text-zinc-500">HORAS</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-black/60 px-5 py-3 rounded-3xl border border-white/10">
                    <span className="text-5xl font-mono font-black text-white">{timeLeft.m}</span>
                  </div>
                  <span className="text-xs font-black uppercase mt-2 text-zinc-500">MIN</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="bg-black/60 px-5 py-3 rounded-3xl border border-white/10">
                    <span className="text-5xl font-mono font-black text-white">{timeLeft.s}</span>
                  </div>
                  <span className="text-xs font-black uppercase mt-2 text-zinc-500">SEG</span>
                </div>
              </div>

              {/* Resto do card (times + botão) */}
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col items-center">
                  <img src={jogo.mandante.escudo_url} alt={jogo.mandante.nome} className="w-20 h-20 object-contain" />
                  <p className="text-sm font-bold mt-3">{jogo.mandante.nome}</p>
                </div>
                <div className="text-3xl font-black text-zinc-700">VS</div>
                <div className="flex flex-col items-center">
                  <img src={jogo.visitante.escudo_url} alt={jogo.visitante.nome} className="w-20 h-20 object-contain" />
                  <p className="text-sm font-bold mt-3">{jogo.visitante.nome}</p>
                </div>
              </div>

              <Link
                href={`/tigre-fc/escalar/${jogo.id}`}
                className="block w-full py-7 bg-[#F5C400] text-black font-black text-lg uppercase tracking-widest rounded-3xl text-center hover:bg-yellow-400 transition-all"
              >
                ⚡ CONVOCAR TITULARES
              </Link>
            </div>
          </section>
        )}

        <DestaquesFifa />

        {/* Mantenha aqui o resto do seu código (ranking, chat, etc.) */}

      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </main>
  );
}
