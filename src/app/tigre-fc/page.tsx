'use client';

import { useState, useEffect, useRef, use } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat          from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa        from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo        from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

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

interface MVPData {
  nome: string;
  media: number;
}

interface Stats {
  ranking: { id: string; apelido: string; pontos: number }[];
  participantes: number;
  posicao?: number;
  mvp?: { nome: string; media: number };
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
  [key: string]: any; 
}

export default function TigreFCPage({ params }: { params: Promise<{ jogoId?: string }> }) {
  const resolvedParams = use(params);

  const [mounted, setMounted]               = useState(false);
  const [isLoading, setIsLoading]            = useState(true);
  
  // Estado inicial sincronizado com o Jumbotron elite (Avaí x Novorizontino)
  const [jogo, setJogo]                     = useState<Jogo | null>({
    id: 12,
    competicao: 'SÉRIE B 2026',
    rodada: '7',
    data_hora: '2026-05-03T21:00:00+00:00',
    local: 'ESTÁDIO DA RESSACADA — SC',
    transmissao: 'ESPN · DISNEY+',
    mandante: { 
      id: 1, 
      nome: 'AVAÍ', 
      escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png', 
      sigla: 'AVA' 
    },
    visitante: { 
      id: 2, 
      nome: 'NOVORIZONTINO', 
      escudo_url: 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png', 
      sigla: 'NOV' 
    }
  });

  const [ranking, setRanking]               = useState<UsuarioRanking[]>([]);
  const [meuId, setMeuId]                   = useState<string | null>(null);
  const [minhaPosicao, setMinhaPosicao]     = useState<number | null>(null);
  const [mvp, setMvp]                       = useState<MVPData | null>(null);
  const [perfilAberto, setPerfilAberto]     = useState<string | null>(null);
  const [mercadoFechado, setMercadoFechado] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    topRef.current?.focus();
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

        const [resJogo, resRank, resMVP] = await Promise.all([
          fetch('/api/proximo-jogo', { cache: 'no-store' })
            .then(r => r.json())
            .catch(() => null),

          sb.from('tigre_fc_usuarios')
            .select('id, nome, apelido, avatar_url, pontos_total')
            .not('pontos_total', 'is', null)
            .order('pontos_total', { ascending: false })
            .limit(10),

          sb.from('pontuacoes_atletas')
            .select('atleta_nome, media_sofascore')
            .order('media_sofascore', { ascending: false })
            .limit(1)
            .maybeSingle()
        ]);

        if (resJogo?.jogos?.[0]) {
          const gameData = resJogo.jogos[0];
          // Força o escudo novo do Avaí se o nome for compatível
          if (gameData.mandante.nome.toUpperCase() === 'AVAÍ') {
            gameData.mandante.escudo_url = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png';
          }
          setJogo(gameData as Jogo);
        }
        
        if (resRank.data) setRanking(resRank.data as UsuarioRanking[]);

        if (resMVP?.data) {
          setMvp({
            nome: resMVP.data.atleta_nome,
            media: resMVP.data.media_sofascore,
          });
        }

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
        console.error('[TigreFCPage] Erro ao inicializar dados:', e);
      } finally {
        setIsLoading(false);
      }
    }

    init();
    const channel = sb
      .channel('tigre-fc-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jogos' }, () => init())
      .subscribe();
      
    return () => { sb.removeChannel(channel); };
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  // Formata os stats para o Jumbotron (incluindo ID para clique no ranking)
  const statsFinal: Stats = {
    ranking: ranking.map(u => ({
      id: u.id,
      apelido: u.apelido || u.nome || 'Jogador',
      pontos:  u.pontos_total ?? 0,
    })),
    participantes: ranking.length,
    posicao: minhaPosicao ?? undefined,
    mvp: mvp ?? { nome: '—', media: 0 },
    capitao: { nome: '---', pts: 0 },
    heroi: { nome: '---', pts: 0 }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-40 font-sans overflow-x-hidden">
      <div ref={topRef} tabIndex={-1} className="pt-2 outline-none" />

      {/* Header Estilo Broadcast */}
      <header className="relative pt-12 pb-24 text-center overflow-hidden bg-black border-b border-white/5">
        <div className="absolute inset-0 opacity-10 led-scan-bar pointer-events-none z-0" style={{
          backgroundImage: 'linear-gradient(90deg, transparent, #BF5FFF, #00F3FF, transparent)',
          backgroundSize: '300% 100%'
        }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-cyan-400 blur-[50px] opacity-30 rounded-full scale-125 animate-pulse" />
            <img src={PATA_LOGO} className="w-16 h-auto mx-auto relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]" alt="Tigre FC Logo" />
          </div>
          <h1 className="text-6xl font-black text-white italic uppercase leading-[0.85] tracking-tighter mb-4 led-cyan">
            TIGRE <span className="text-[#F5C400]">FC</span>
          </h1>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-black/40 rounded-full shadow-lg border border-white/10">
            <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse" />
            <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">Broadcast Station</p>
            <div className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20 space-y-12">
        {/* Jumbotron Principal (NBA/NFL Style) */}
        {jogo ? (
          <section className="mb-10">
            <JumbotronJogo
              jogo={jogo}
              mercadoFechado={mercadoFechado}
              stats={statsFinal}
            />
          </section>
        ) : !isLoading && (
          <div className="mb-10 p-8 bg-zinc-900/30 rounded-3xl text-center border border-white/5">
            <p className="text-zinc-500 font-black uppercase text-[10px] tracking-widest">Aguardando Próxima Partida</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Coluna Esquerda: Chat em Tempo Real */}
          <section className="h-[600px] rounded-[40px] border border-white/5 overflow-hidden bg-black/40 relative">
            <TigreFCChat usuarioId={meuId} />
          </section>

          {/* Coluna Direita: Destaques e Ranking Lateral */}
          <div className="space-y-8">
            <DestaquesFifa />
            
            <section>
              <div className="flex justify-between items-end mb-6 px-4">
                <div>
                  <h2 className="text-[9px] font-black uppercase tracking-[0.4em] text-purple-500 mb-1">Global Ranking</h2>
                  <p className="text-xl font-black uppercase italic tracking-tighter text-white">Elite Top Performance</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {ranking.slice(0, 5).map((u, i) => (
                  <div key={u.id} onClick={() => setPerfilAberto(u.id)}
                    className={`flex items-center p-4 rounded-3xl border cursor-pointer transition-all hover:scale-[1.01] ${
                      i === 0 
                        ? 'bg-gradient-to-r from-[#F5C400] to-[#D4A200] border-none text-black' 
                        : 'bg-zinc-900/40 border-white/5 hover:border-white/15'
                    }`}>
                    <span className={`w-8 text-center font-black italic ${i === 0 ? 'text-black/40' : 'opacity-50'}`}>
                      {i + 1}º
                    </span>
                    <div className="flex-1">
                      <p className="font-black uppercase italic text-sm truncate">{u.apelido || u.nome}</p>
                    </div>
                    <p className="font-black text-xl leading-none">{u.pontos_total ?? 0}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Modal de Perfil Público */}
      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}

      <style jsx global>{`
        ::-webkit-scrollbar { width: 0px; }
        body { 
          background-color: #050505; 
          color: white; 
          font-family: 'Barlow Condensed', sans-serif !important; 
        }
        .led-cyan { 
          color: #00F3FF !important; 
          text-shadow: 0 0 10px rgba(0,243,255,0.7) !important; 
        }
        .led-scan-bar { 
          animation: led-scan-header 5s linear infinite; 
        }
        @keyframes led-scan-header {
          0%   { background-position: -300% 0; }
          100% { background-position:  300% 0; }
        }
      `}</style>
    </main>
  );
}
