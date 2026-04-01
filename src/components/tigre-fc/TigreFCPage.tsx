'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import DestaquesFifa from '@/components/tigre-fc/DestaquesFifa'; 
import Link from 'next/link';

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export default function TigreFCPage() {
  const [mounted, setMounted] = useState(false);
  const [destaques, setDestaques] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [jogo, setJogo] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

    async function loadData() {
      // 1. Carrega Próximo Jogo
      const resJogo = await fetch('/api/proximo-jogo').then(r => r.json());
      if (resJogo.jogos?.[0]) setJogo(resJogo.jogos[0]);

      // 2. Carrega Ranking
      const { data: rankData } = await sb.from('tigre_fc_usuarios').select('*').order('pontos_total', { ascending: false }).limit(10);
      if (rankData) setRanking(rankData);

      // 3. Carrega Destaques (Busca direta nos scouts se não houver resultado processado)
      try {
        const { data: scouts } = await sb
          .from('tigre_fc_scouts_jogadores')
          .select('pontos, jogador:jogador_id(nome, foto_url)')
          .order('pontos', { ascending: false })
          .limit(2);

        if (scouts && scouts.length >= 2) {
          const j1 = Array.isArray(scouts[0].jogador) ? scouts[0].jogador[0] : scouts[0].jogador;
          const j2 = Array.isArray(scouts[1].jogador) ? scouts[1].jogador[0] : scouts[1].jogador;
          
          setDestaques({
            capitao: { nome: j1.nome, foto_url: j1.foto_url, pontos: scouts[0].pontos },
            heroi: { nome: j2.nome, foto_url: j2.foto_url, pontos: scouts[1].pontos }
          });
        }
      } catch (err) {
        console.error("Erro ao carregar destaques:", err);
      }
    }

    loadData();
  }, []);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#050505] text-white pb-10">
      {/* HEADER SIMPLIFICADO */}
      <header className="bg-[#F5C400] p-6 text-center border-b-4 border-black">
        <img src={LOGO} className="w-12 h-12 mx-auto mb-2" />
        <h1 className="text-2xl font-black text-black italic uppercase leading-none">TIGRE FC</h1>
        <p className="text-[10px] font-bold text-black/50 uppercase">Ultimate Team 2026</p>
      </header>

      <div className="max-w-md mx-auto px-4">
        {/* CARDS FIFA (SÓ APARECE SE TIVER DADOS) */}
        {destaques ? (
          <DestaquesFifa capitao={destaques.capitao} heroi={destaques.heroi} />
        ) : (
          <div className="py-10 text-center opacity-20 text-[10px] font-bold uppercase tracking-widest">
            Aguardando scouts da rodada...
          </div>
        )}

        {/* RANKING */}
        <section className="mt-4">
          <h2 className="text-[10px] font-black uppercase mb-4 opacity-50">Top 10 Global</h2>
          <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
            {ranking.map((u, i) => (
              <div key={u.id} className="flex items-center p-4 border-b border-white/5">
                <span className="w-6 text-[10px] font-black text-zinc-600">#{i+1}</span>
                <span className="flex-1 font-bold text-sm ml-2">{u.apelido || u.nome}</span>
                <span className="text-[#F5C400] font-black">{u.pontos_total}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
