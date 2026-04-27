'use client';

import { useState, useEffect } from 'react';
import { supabase as sb } from '@/lib/supabase';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const URL_AVAI = "https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Avai_Futebol_Clube_logo.svg.png";

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [stats, setStats] = useState<any>({
    capitao: { nome: '---', pts: 0 },
    heroi: { nome: '---', pts: 0 }
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    async function init() {
      const { data: { session } } = await sb.auth.getSession();
      let userId = null;
      
      if (session?.user) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) { userId = u.id; setMeuId(u.id); }
      }

      const { data: game } = await sb.from('jogos_tigre').select('*, mandante:times(*), visitante:times(*)').eq('ativo', true).maybeSingle();
      
      if (game) {
        setJogo(game);
        if (userId) {
          const { data: esc } = await sb.from('tigre_fc_escalacoes').select('capitao_nome, heroi_nome').eq('usuario_id', userId).eq('jogo_id', game.id).maybeSingle();
          if (esc) {
            setStats({
              capitao: { nome: esc.capitao_nome || '---', pts: 0 },
              heroi: { nome: esc.heroi_nome || '---', pts: 0 }
            });
          }
        }
      }
    }
    init();
  }, [mounted]);

  if (!mounted || !jogo) return <div className="min-h-screen bg-black" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 font-sans">
      <header className="pt-16 pb-24 text-center border-b border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05)_0%,transparent_70%)]" />
        <h1 className="text-7xl font-black italic uppercase tracking-tighter relative z-10">
          TIGRE <span className="text-[#F5C400]">FC</span>
        </h1>
        <p className="text-cyan-400 font-black text-[10px] tracking-[0.5em] mt-4 relative z-10">BROADCAST STATION</p>
      </header>

      <div className="max-w-5xl mx-auto px-4 -mt-12 space-y-12 relative z-20">
        <JumbotronJogo jogo={jogo} stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-[650px] bg-black/60 rounded-[48px] border border-white/10 overflow-hidden backdrop-blur-xl">
            <TigreFCChat usuarioId={meuId} />
          </div>
          <div className="lg:col-span-5 space-y-8">
            <DestaquesFifa />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,900&display=swap');
        body { font-family: 'Barlow Condensed', sans-serif !important; background: #050505; }
      `}</style>
    </main>
  );
}
