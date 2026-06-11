'use client';

import { useState, useEffect } from 'react';
import TigreFCPerfilPublico from './TigreFCPerfilPublico'; // Import correto

// Seus tipos e componentes (JumbotronJogo, etc.) podem ficar aqui se este for o arquivo principal
// Mas o importante é o modal estar correto

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

// Componente principal da página (ajuste conforme seu conteúdo real)
export default function TigreFCRankingPage() {
  const [perfilAberto, setPerfilAberto] = useState<string | null>(null);
  const [jogoId, setJogoId] = useState<number | null>(null);
  const [meuId, setMeuId] = useState<string>('');

  // Carregar meuId (exemplo)
  useEffect(() => {
    // Sua lógica de autenticação aqui
    // const { data } = await supabase.auth.getSession();
    // if (data.session?.user) setMeuId(data.session.user.id);
  }, []);

  return (
    <div>
      {/* Todo o conteúdo da sua página vai aqui (ranking, jogos, etc.) */}

      {/* ==================== MODAL PERFIL ==================== */}
      {perfilAberto && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilAberto}        // ← Nome correto da prop
          viewerUsuarioId={meuId || undefined}  // ← Nome correto
          onClose={() => setPerfilAberto(null)}
        />
      )}
    </div>
  );
}
