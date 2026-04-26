'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico'; // ← IMPORT CORRETO

// ── Seus tipos e interfaces (ajuste conforme seu arquivo) ──
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
  // adicione outros campos se necessário
}

// Componente JumbotronJogo (mantido igual ao que você tinha antes)
function JumbotronJogo({ jogo, stats = {}, mercadoFechado = false }: { 
  jogo: Jogo; 
  stats?: Stats; 
  mercadoFechado?: boolean; 
}) {
  // ... todo o código do JumbotronJogo que você enviou anteriormente ...
  // (incluindo Countdown, Escudo, StatCard, fetchUltimaRodada, etc.)
  
  return (
    <div style={{ /* seus estilos */ }}>
      {/* conteúdo do jumbotron */}
    </div>
  );
}

// ========================
//  PÁGINA PRINCIPAL
// ========================
export default function TigreFCPage() {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [meuId, setMeuId] = useState<string>(''); // preencha com o ID do usuário logado
  const [jogo, setJogo] = useState<Jogo | null>(null);
  const [stats, setStats] = useState<Stats>({});
  const [mercadoFechado, setMercadoFechado] = useState(false);

  // Exemplo de carregamento (ajuste conforme sua lógica real)
  useEffect(() => {
    // Carregar jogo atual, stats, etc.
    // setJogo(...);
    // setStats(...);
    
    // Exemplo simples de meuId (substitua pela sua autenticação)
    // const user = supabase.auth.getUser();
    // setMeuId(user?.data?.user?.id || '');
  }, []);

  if (!jogo) {
    return <div className="text-center py-20 text-white">Carregando jogo...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* Seu conteúdo principal da página */}
      <JumbotronJogo 
        jogo={jogo} 
        stats={stats} 
        mercadoFechado={mercadoFechado} 
      />

      {/* Outros componentes da página... */}

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
