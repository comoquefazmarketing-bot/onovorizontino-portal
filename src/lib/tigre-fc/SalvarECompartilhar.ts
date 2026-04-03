import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SaveData {
  userId?: string;
  jogoId: string | number;
  formation: string;
  lineup: Record<string, any>;
  captainId: number | null;
  heroId: number | null;
  palpiteCasa: number;
  palpiteFora: number;
}

export async function handleSalvarECompartilhar(data: SaveData, fieldRef: React.RefObject<HTMLDivElement>) {
  try {
    // 1. Pegar o usuário logado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Você precisa estar logado para salvar sua escalação!");
      return { success: false };
    }

    // 2. Preparar os IDs dos jogadores para o banco (JSONB)
    const lineupIds: Record<string, number> = {};
    Object.keys(data.lineup).forEach(key => {
      if (data.lineup[key]) lineupIds[key] = data.lineup[key].id;
    });

    // 3. Salvar no Supabase
    const { error: dbError } = await supabase.from('escalacoes').insert({
      usuario_id: user.id,
      jogo_id: Number(data.jogoId),
      formacao: data.formation,
      lineup: lineupIds,
      capitao_id: data.captainId,
      heroi_id: data.heroId,
      palpite_casa: data.palpiteCasa,
      palpite_fora: data.palpiteFora
    });

    if (dbError) throw dbError;

    // 4. Gerar a imagem para compartilhar (CORS habilitado para fotos do Supabase)
    if (fieldRef.current) {
      const canvas = await html2canvas(fieldRef.current, {
        useCORS: true,
        backgroundColor: '#000',
        scale: 2, // Melhor qualidade para redes sociais
      });

      const imgData = canvas.toDataURL('image/png');
      const blob = await (await fetch(imgData)).blob();
      const file = new File([blob], `meu-tigre-fc-${data.jogoId}.png`, { type: 'image/png' });

      // 5. Tentar compartilhar (Mobile) ou baixar (Desktop)
      if (navigator.share) {
        try {
          await navigator.share({
            files: [file],
            title: 'Minha Escalação Tigre FC',
            text: `Confira meu palpite para o jogo do Tigre do Vale: ${data.palpiteCasa} x ${data.palpiteFora}!`,
          });
        } catch (shareError) {
          console.log("Compartilhamento cancelado ou não suportado");
          downloadFallback(imgData);
        }
      } else {
        downloadFallback(imgData);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erro geral:', error);
    alert('Erro ao processar: ' + error.message);
    return { success: false, error };
  }
}

// Função de backup caso o navegador não suporte compartilhamento de arquivos
function downloadFallback(imgData: string) {
  const link = document.createElement('a');
  link.href = imgData;
  link.download = 'minha-escalacao-tigre-fc.png';
  link.click();
  alert("Imagem baixada! Agora você pode compartilhar nas suas redes.");
}
