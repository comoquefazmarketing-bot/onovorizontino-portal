'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Import correto do componente de perfil
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';

// ── Tipos (ajuste se precisar adicionar mais campos) ──
interface Time {
  nome: string;
  escudo_url: string | null;
  sigla?: string | null;
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

interface RankUser {
  apelido?: string | null;
  nome?: string | null;
  pontos: number;
}

interface Stats {
  capitao?: { nome: string; pts: number };
  heroi?: { nome: string; pts: number };
  maisEscalado?: { nome: string; pct: number };
  ranking?: RankUser[];
  participantes?: number;
  posicao?: number;
  golsSofridos?: number;
  mediaSofaTime?: number;
  mediaSofa?: number;
  mvp?: { nome: string; media: number };
  meusPontos?: number;
}

// ========================
//  COMPONENTE JUMBOTRON (mantido igual)
// ========================
function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: {
  jogo: Jogo;
  stats?: Stats;
  mercadoFechado?: boolean;
}) {
  // Coloque aqui todo o código do JumbotronJogo que você já tinha (Countdown, Escudo, StatCard, fetchUltimaRodada, etc.)
  // Para não deixar o código gigante, assumi que você já tem ele funcionando.
  // Se precisar, cole o conteúdo completo do Jumbotron aqui dentro.

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      background: '#000',
      borderRadius: 24,
      overflow: 'hidden',
      position: 'relative',
      border: '1px solid #333',
      maxWidth: 460,
      width: '95%',
      margin: '0 auto',
      boxShadow: '0 20px 80px rgba(0,0,0,0.9)'
    }}>
      {/* Todo o JSX do seu JumbotronJogo vai aqui */}
      {/* ... (seu código anterior) ... */}
    </div>
  );
}

// ========================
//  PÁGINA PRINCIPAL
// ========================
export default function TigreFCPage() {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string>(''); // Preencha com o ID do usuário logado

  // Seus outros states (jogo atual, stats, etc.)
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [stats, setStats] = useState<Stats>({});
  const [mercadoFechado, setMercadoFechado] = useState(false);

  // Carregamento inicial (exemplo - ajuste conforme sua lógica)
  useEffect(() => {
    // Aqui você carrega o jogo, stats, etc.
    // Exemplo:
    // loadJogoAtual();

    // Carregar ID do usuário logado (ajuste com sua autenticação)
    // supabase.auth.getUser().then(({ data }) => {
    //   setMeuId(data.user?.id || '');
    // });
  }, []);

  if (!jogo) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Seu conteúdo principal da página */}
      <JumbotronJogo 
        jogo={jogo} 
        stats={stats} 
        mercadoFechado={mercadoFechado} 
      />

      {/* Outros componentes da sua página... */}

      {/* ==================== MODAL PERFIL ==================== */}
      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}
          viewerUsuarioId={meuId || undefined}
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </div>
  );
}
