'use client';

import { useState, useEffect, useRef, use } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";

// ── Interfaces de Dados ────────────────
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
}

interface UsuarioRanking {
  id: string;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  pontos_total: number;
}

interface Stats {
  ranking: { id: string; apelido: string; pontos: number }[];
  participantes: number;
  posicao?: number;
  mvp?: { nome: string; media: number };
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado inicial sincronizado com os dados enviados (Rodada 7 - Copa Sul-Sudeste)
  const [jogo, setJogo] = useState<Jogo | null>({
    id: 12,
    competicao: 'COPA SUL-SUDESTE',
    rodada: '7',
    data_hora: '2026-05-03T21:00:00+00:00',
    local: 'ESTÁDIO DA RESSACADA — FLORIANÓPOLIS, SC',
    transmissao: 'ESPN · DISNEY+',
    mandante: { 
      id: 6, 
      nome: 'AVAÍ', 
      escudo_url: URL_AVAI, 
      sigla: 'AVA' 
    },
    visitante: { 
      id: 1, 
      nome: 'NOVORIZONTINO', 
      escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png', 
      sigla: 'NOV' 
    }
  });

  const [ranking, setRanking] = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [minhaPosicao, setMinhaPosicao] = useState<number | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [mercadoFechado, setMercadoFechado] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

        // Busca o jogo ativo no banco, mas aplica a blindagem do Avaí
        const [resJogo, resRank] = await Promise.all([
          sb.from('jogos_tigre').select('*, mandante:times(*), visitante:times(*)').eq('ativo', true).maybeSingle(),
          sb.from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .not('pontos_total', 'is', null)
            .order('pontos_total', { ascending: false })
            .limit(10)
        ]);

        if (resJogo.data) {
          const gameData = resJogo.data;
          // Injeção de Segurança: Garante os dados da Sul-Sudeste e Escudo do Avaí
          if (gameData.mandante_slug === 'avai' || gameData.mandante?.nome?.toUpperCase() === 'AVAÍ') {
            gameData.mandante.escudo_url = URL_AVAI;
            gameData.competicao = "COPA SUL-SUDESTE";
          }
          setJogo(gameData as Jogo);
        }
        
        if (resRank.data) setRanking(resRank.data as UsuarioRanking[]);

        if (meuUsuarioId) {
          const { data: meuPerfil } = await sb
            .from('tigre_fc_usuarios')
            .select('pontos_total')
            .eq('id', meuUsuarioId)
            .maybeSingle();
          
          if (meuPerfil?.pontos_total !== null && meuPerfil?.pontos_total !== undefined) {
            const { count } = await sb
              .from('tigre_fc_usuarios')
              .select('id', { count: 'exact', head: true })
              .gt('pontos_total', meuPerfil.pontos_total);
            setMinhaPosicao((count ?? 0) + 1);
          }
        }
      } catch (e) {
        console.error('[TigreFCPage] Erro ao carregar dados:', e);
      } finally {
        setIsLoading(false);
      }
    }

    init();
    
    // Real-time para atualizações de mercado ou placar
    const channel = sb
      .channel('tigre-fc-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jogos_tigre' }, () => init())
      .subscribe();
      
    return () => { sb.removeChannel(channel); };
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  const statsFinal: Stats = {
    ranking: ranking.map(u => ({
      id: u.id,
      apelido: u.apelido || u.nome || 'Jogador',
      pontos:  u.pontos_total ?? 0,
    })),
    participantes: ranking.length,
    posicao: minhaPosicao ?? undefined,
    capitao: { nome: '---', pts: 0 },
    heroi: { nome: '---', pts: 0 }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-40 font-sans overflow-x-hidden">
      <div ref={topRef} className="pt-2" />

      {/* Header Estilo Broadcast Elite */}
      <header className="relative pt-16 pb-28 text-center overflow-hidden bg-black border-b border-white/5">
        <div className="absolute inset-0 opacity-20 led-scan-bar pointer-events-none z-0" style={{
          backgroundImage: 'linear-gradient(90deg, transparent, #BF5FFF, #00F3FF, transparent)',
          backgroundSize: '300% 100%'
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-cyan-400 blur-[60px] opacity-20 rounded-full scale-150 animate-pulse" />
            <img src={PATA_LOGO} className="w-20 h-auto mx-auto relative z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]" alt="Tigre FC Logo" />
          </div>
          <h1 className="text-7xl font-black text-white italic uppercase leading-[0.8] tracking-tighter mb-6">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
          <div className="inline-flex items-center gap-4 px-6 py-2 bg-white/5 rounded-full backdrop-blur-md border border-white/10">
            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00F3FF]" />
            <p className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.5em]">Broadcast Station</p>
            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#00F3FF]" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 space-y-16">
        {/* Jumbotron Principal */}
        {jogo && (
          <section>
            <JumbotronJogo
              jogo={jogo}
              mercadoFechado={mercadoFechado}
              stats={statsFinal}
            />
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Coluna Esquerda: Chat */}
          <section className="h-[650px] rounded-[48px] border border-white/10 overflow-hidden bg-black/60 backdrop-blur-xl relative shadow-2xl">
            <TigreFCChat usuarioId={meuId} />
          </section>

          {/* Coluna Direita: FIFA Style Highlights & Ranking */}
          <div className="space-y-10">
            <DestaquesFifa />
            
            <section className="bg-zinc-900/20 p-8 rounded-[40px] border border-white/5">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-2">Global Ranking</h2>
                  <p className="text-2xl font-black uppercase italic tracking-tighter text-white">Elite Performance</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {ranking.slice(0, 5).map((u, i) => (
                  <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                    className={`flex items-center p-5 rounded-3xl border cursor-pointer transition-all hover:scale-[1.02] ${
                      i === 0 
                        ? 'bg-gradient-to-r from-[#F5C400] to-[#FFD700] border-none text-black' 
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}>
                    <span className={`w-10 text-lg font-black italic ${i === 0 ? 'text-black/40' : 'text-zinc-500'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <p className="font-black uppercase italic text-sm truncate">{u.apelido || u.nome}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl leading-none">{u.pontos_total ?? 0}</p>
                      <p className={`text-[8px] font-bold ${i === 0 ? 'text-black/50' : 'text-zinc-500'}`}>PONTOS</p>
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
        .led-scan-bar { 
          animation: led-scan-header 6s linear infinite; 
        }
        @keyframes led-scan-header {
          0%   { background-position: -300% 0; }
          100% { background-position:  300% 0; }
        }
      `}</style>
    </main>
  );
}
