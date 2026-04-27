'use client';

import { useState, useEffect } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";

// ── Interfaces Alinhadas com o Jumbotron ────────────────
interface Time {
  id: number;
  nome: string;
  escudo_url: string;
  sigla: string | null;
}

interface Jogo {
  id: number;
  competicao: string;
  rodada: string;
  data_hora: string;
  local: string | null;
  transmissao: string | null;
  mandante: Time;
  visitante: Time;
  mandante_slug?: string;
}

interface UsuarioRanking {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number;
}

// Interface Stats exatamente como o Jumbotron espera
interface Stats {
  capitao: { nome: string; pts: number };
  heroi: { nome: string; pts: number };
  ranking: any[];
  participantes: number;
}

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [minhaPosicao, setMinhaPosicao] = useState<number | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  
  // Inicialização segura para evitar que o Jumbotron quebre por falta de dados
  const [statsState, setStatsState] = useState<Stats>({
    capitao: { nome: '---', pts: 0.0 },
    heroi: { nome: '---', pts: 0.0 },
    ranking: [],
    participantes: 0
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    async function init() {
      setIsLoading(true);
      try {
        const { data: { session } } = await sb.auth.getSession();
        let meuUsuarioId: string | null = null;
        
        if (session?.user?.id) {
          const { data: u } = await sb
            .from('tigre_fc_usuarios')
            .select('id')
            .eq('google_id', session.user.id)
            .maybeSingle();
          if (u) {
            meuUsuarioId = u.id;
            setMeuId(u.id);
          }
        }

        const [resJogo, resRank] = await Promise.all([
          sb.from('jogos_tigre')
            .select('*, mandante:times(*), visitante:times(*)')
            .eq('ativo', true)
            .maybeSingle(),
          sb.from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .not('pontos_total', 'is', null)
            .order('pontos_total', { ascending: false })
            .limit(10)
        ]);

        if (resJogo.data) {
          const gameData = resJogo.data;
          
          // Blindagem Avaí e Competição
          if (gameData.mandante_slug === 'avai' || gameData.mandante?.nome?.toUpperCase() === 'AVAÍ') {
            gameData.mandante.escudo_url = URL_AVAI;
            gameData.competicao = "COPA SUL-SUDESTE";
          }
          setJogo(gameData as Jogo);

          // Busca Escalação em Tempo Real para o Jumbotron
          if (meuUsuarioId) {
            const { data: esc } = await sb
              .from('tigre_fc_escalacoes')
              .select('capitao_nome, heroi_nome')
              .eq('usuario_id', meuUsuarioId)
              .eq('jogo_id', gameData.id)
              .maybeSingle();

            setStatsState({
              capitao: { nome: esc?.capitao_nome || '---', pts: 0.0 },
              heroi: { nome: esc?.heroi_nome || '---', pts: 0.0 },
              ranking: resRank.data || [],
              participantes: resRank.data?.length || 0
            });
          }
        }
        
        if (resRank.data) setRanking(resRank.data as UsuarioRanking[]);

        // Cálculo de posição no ranking
        if (meuUsuarioId) {
          const { data: meuPerfil } = await sb
            .from('tigre_fc_usuarios')
            .select('pontos_total')
            .eq('id', meuUsuarioId)
            .maybeSingle();
          
          if (meuPerfil?.pontos_total !== null) {
            const { count } = await sb
              .from('tigre_fc_usuarios')
              .select('id', { count: 'exact', head: true })
              .gt('pontos_total', meuPerfil.pontos_total);
            setMinhaPosicao((count ?? 0) + 1);
          }
        }
      } catch (e) {
        console.error('Erro na inicialização:', e);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [mounted]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-40 font-sans selection:bg-cyan-500/30">
      {/* Header com Efeito Broadcast */}
      <header className="relative pt-16 pb-28 text-center bg-black border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <img src={PATA_LOGO} className="w-20 h-auto mx-auto mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]" alt="Logo" />
          <h1 className="text-7xl font-black italic uppercase leading-[0.8] tracking-tighter mb-6">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.5em]">Broadcast Station</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20 space-y-16">
        {/* Renderização Condicional Protegida */}
        {jogo && (
          <JumbotronJogo
            jogo={jogo}
            stats={statsState}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Chat / Feed Central */}
          <section className="lg:col-span-7 h-[700px] rounded-[48px] border border-white/10 overflow-hidden bg-black/60 backdrop-blur-xl relative shadow-2xl">
            <TigreFCChat usuarioId={meuId} />
          </section>

          {/* Sidebar de Destaques e Ranking */}
          <div className="lg:col-span-5 space-y-10">
            <DestaquesFifa />
            
            <section className="bg-zinc-900/40 p-8 rounded-[48px] border border-white/5 backdrop-blur-md shadow-xl">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-2">Power Ranking</h2>
                  <p className="text-2xl font-black italic uppercase">Liderança</p>
                </div>
                {minhaPosicao && (
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase">Sua Posição</p>
                    <p className="text-xl font-black text-cyan-400">#{minhaPosicao}</p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {ranking.map((u, i) => (
                  <div 
                    key={u.id} 
                    onClick={() => setPerfilAberto(u.id)}
                    className={`flex items-center gap-4 p-4 rounded-3xl transition-all cursor-pointer group ${
                      u.id === meuId ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <span className={`w-8 font-black italic text-lg ${i < 3 ? 'text-[#F5C400]' : 'text-zinc-500'}`}>
                      {(i + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="font-black uppercase italic text-sm truncate">{u.apelido || u.nome}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl leading-none">{u.pontos_total ?? 0}</p>
                      <p className="text-[8px] font-bold text-zinc-500">PONTOS</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');
        ::-webkit-scrollbar { width: 0px; }
        body { 
          background-color: #050505; 
          color: white; 
          font-family: 'Barlow Condensed', sans-serif !important; 
        }
      `}</style>
    </main>
  );
}
