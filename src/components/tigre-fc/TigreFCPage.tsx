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
      // 1. Dados do Usuário Logado
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      // 2. Próximo Jogo e Ranking (Simultâneo)
      const [resJogo, { data: rankData }] = await Promise.all([
        fetch('/api/proximo-jogo').then(r => r.json()),
        sb.from('tigre_fc_usuarios').select('*').order('pontos_total', { ascending: false }).limit(10)
      ]);
      
      if (resJogo.jogos?.[0]) setJogo(resJogo.jogos[0]);
      if (rankData) setRanking(rankData);

      // 3. Lógica para Destaques FIFA (Busca do último jogo encerrado)
      try {
        const { data: lastGame } = await sb.from('tigre_fc_resultados')
          .select('jogo_id')
          .eq('processado', true)
          .order('criado_em', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (lastGame) {
          const { data: sc } = await sb.from('tigre_fc_scouts_jogadores')
            .select('pontos, jogador:jogador_id(nome, foto_url)')
            .eq('jogo_id', lastGame.jogo_id)
            .order('pontos', { ascending: false })
            .limit(2);

          if (sc && sc.length >= 2) {
            const j1 = Array.isArray(sc[0].jogador) ? sc[0].jogador[0] : sc[0].jogador;
            const j2 = Array.isArray(sc[1].jogador) ? sc[1].jogador[0] : sc[1].jogador;
            setDestaques({
              capitao: { nome: j1.nome, foto_url: j1.foto_url, pontos: sc[0].pontos },
              heroi: { nome: j2.nome, foto_url: j2.foto_url, pontos: sc[1].pontos }
            });
          }
        }
      } catch (e) { console.error("Destaques falhou", e); }
    }
    init();
  }, [mounted]);

  // Timer Preciso
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
    <main className="min-h-screen bg-[#050505] text-white pb-24 font-sans selection:bg-yellow-500 selection:text-black">
      
      {/* Header Premium */}
      <header className="bg-[#F5C400] px-6 py-10 border-b-[6px] border-black text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="max-w-md mx-auto relative z-10">
          <img src={LOGO} className="w-16 h-16 mx-auto mb-3 drop-shadow-[0_5px_15px_rgba(0,0,0,0.3)]" />
          <h1 className="text-4xl font-[1000] text-black italic uppercase leading-none tracking-tighter">TIGRE FC</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="h-[2px] w-4 bg-black/20" />
            <span className="text-[10px] font-black text-black/60 uppercase tracking-[0.3em]">Ultimate Team 26</span>
            <span className="h-[2px] w-4 bg-black/20" />
          </div>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 -mt-6">
        
        {/* Card de Próximo Jogo */}
        {jogo && (
          <section className="mb-10">
            <div className="bg-[#0f0f0f] rounded-[32px] border border-white/5 p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 text-[40px] font-black italic">NEXT</div>
              <div className="flex justify-center gap-6 mb-8">
                {['h', 'm', 's'].map(u => (
                  <div key={u} className="flex flex-col items-center">
                    <span className="text-4xl font-black font-mono leading-none">{timeLeft[u as keyof typeof timeLeft]}</span>
                    <span className="text-[9px] text-yellow-500 font-bold uppercase mt-1 tracking-widest">{u}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-4 mb-8">
                <div className="text-center w-20">
                  <img src={jogo.mandante.escudo_url} className="w-16 h-16 object-contain mx-auto drop-shadow-xl" />
                  <p className="text-[10px] font-black mt-2 uppercase truncate">{jogo.mandante.nome}</p>
                </div>
                <span className="text-xl font-black text-zinc-800 italic">VS</span>
                <div className="text-center w-20">
                  <img src={jogo.visitante.escudo_url} className="w-16 h-16 object-contain mx-auto drop-shadow-xl" />
                  <p className="text-[10px] font-black mt-2 uppercase truncate">{jogo.visitante.nome}</p>
                </div>
              </div>
              <Link href={`/tigre-fc/escalar/${jogo.id}`} className="flex items-center justify-center gap-3 bg-[#F5C400] text-black py-5 rounded-2xl font-black uppercase italic text-sm shadow-[0_10px_20px_rgba(245,196,0,0.2)] hover:bg-white transition-all">
                Escalar meu Time <span className="text-lg">→</span>
              </Link>
            </div>
          </section>
        )}

        {/* Destaques FIFA Neon */}
        {destaques && <DestaquesFifa capitao={destaques.capitao} heroi={destaques.heroi} />}

        {/* Raio-X SofaScore */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">Raio-X SofaScore</h2>
          </div>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border-4 border-white" style={{ height: 550 }}>
            <iframe 
              src="https://widgets.sofascore.com/pt-BR/embed/lineups?id=15526004&widgetTheme=light" 
              className="w-full h-full border-none"
              scrolling="no"
            />
          </div>
        </section>

        {/* Ranking Global */}
        <section className="mt-12">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 px-2 text-zinc-400">Top 10 Treinadores</h2>
          <div className="bg-[#0f0f0f] rounded-[32px] border border-white/5 overflow-hidden shadow-xl">
            {ranking.map((u, i) => (
              <div key={u.id} onClick={() => setPerfilAberto(u.id)} className="flex items-center p-5 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors">
                <span className={`w-8 text-xs font-black ${i < 3 ? 'text-yellow-500' : 'text-zinc-700'}`}>{String(i+1).padStart(2, '0')}</span>
                <img src={u.avatar_url || LOGO} className="w-10 h-10 rounded-xl mr-4 object-cover bg-zinc-900 border border-white/10" />
                <div className="flex-1">
                   <p className="text-sm font-black uppercase italic tracking-tight">{u.apelido || u.nome}</p>
                   <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Nível {u.nivel || 1}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-yellow-500 text-lg leading-none">{u.pontos_total}</p>
                  <p className="text-[7px] text-zinc-600 font-bold uppercase">Pontos</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vestiário / Chat */}
        <section className="mt-12 mb-10">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] mb-4 px-2 text-zinc-400">Resenha Proibida</h2>
          <div className="h-[450px] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
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
