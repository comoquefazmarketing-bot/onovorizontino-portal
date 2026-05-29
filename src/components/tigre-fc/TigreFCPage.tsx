'use client';
import { useState, useEffect, use } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase as sb } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';
import TigreFCChat from '@/components/tigre-fc/TigreFCChat';
import JumbotronJogo from '@/components/tigre-fc/JumbotronJogo';

const PATA_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [jogo, setJogo] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [meuId, setMeuId] = useState<string | null>(null);
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [mercadoFechado, setMercadoFechado] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;

    async function init() {
      // Auth
      const { data: { session } } = await sb.auth.getSession();
      if (session?.user?.id) {
        const { data: u } = await sb.from('tigre_fc_usuarios').select('id').eq('google_id', session.user.id).maybeSingle();
        if (u) setMeuId(u.id);
      }

      // Busca o próximo jogo
      try {
        const res = await fetch('/api/proximo-jogo');
        const data = await res.json();
        if (data?.jogos?.length > 0) {
          setJogo(data.jogos[0]);
        } else {
          // Fallback: São Bernardo x Novorizontino
          setJogo({
            id: 16,
            rodada: '11',
            competicao: 'Série B 2026',
            mandante_slug: 'sao-bernardo',
            visitante_slug: 'novorizontino',
            data_hora: '2026-05-31 14:00:00+00',
            local: 'Estádio 1º de Maio — São Bernardo do Campo, SP',
            transmissao: 'ESPN · Disney+',
            finalizado: false,
          });
        }
      } catch (e) {
        console.error("Erro ao buscar jogo:", e);
      }

      // Ranking
      const { data: resRank } = await sb
        .from('tigre_fc_usuarios')
        .select('id, nome, apelido, avatar_url, pontos_total')
        .order('pontos_total', { ascending: false })
        .limit(10);

      if (resRank) setRanking(resRank);
    }

    init();
  }, [mounted]);

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-20 overflow-x-hidden">
      <div className="relative pt-20 pb-28 text-center">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={PATA_LOGO}
          className="w-16 mx-auto mb-4 drop-shadow-[0_0_25px_rgba(245,196,0,0.4)]"
        />
        <h1 className="text-7xl md:text-8xl font-black italic uppercase leading-none tracking-tighter">
          TIGRE <span className="text-[#F5C400]">FC</span>
        </h1>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-10">
        {jogo && (
          <JumbotronJogo
            jogo={jogo}
            mercadoFechado={mercadoFechado}
          />
        )}

        {/* Outras seções (SofaScore, Ranking, Chat) */}
        {/* ... mantenha o resto do seu código aqui ... */}
      </div>
    </main>
  );
}
