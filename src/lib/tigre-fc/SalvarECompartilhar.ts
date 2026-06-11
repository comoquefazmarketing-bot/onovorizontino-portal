// src/lib/tigre-fc/SalvarECompartilhar.ts
// Substituição completa — remove html2canvas, usa html-to-image

import React from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface SaveData {
  userId?: string;
  jogoId: string | number;
  formation: string;
  lineup: Record<string, any>;
  captainId: number | null;
  heroId: number | null;
  palpiteCasa: number;
  palpiteFora: number;
}

export async function handleSalvarECompartilhar(
  data: SaveData,
  fieldRef: React.RefObject<HTMLDivElement>
): Promise<{ success: boolean; error?: any }> {
  try {
    // 1. Usuário logado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Você precisa estar logado para salvar sua escalação!');
      return { success: false };
    }

    // 2. Converte lineup → IDs para o banco
    const lineupIds: Record<string, number> = {};
    Object.keys(data.lineup).forEach(key => {
      if (data.lineup[key]) lineupIds[key] = data.lineup[key].id;
    });

    // 3. Upsert no Supabase (tigre_fc_escalacoes)
    const { error: dbError } = await supabase
      .from('tigre_fc_escalacoes')
      .upsert(
        {
          usuario_id:    user.id,
          jogo_id:       Number(data.jogoId),
          formacao:      data.formation,
          lineup_json:   lineupIds,
          capitan_id:    data.captainId,
          heroi_id:      data.heroId,
          palpite_tigre: data.palpiteCasa,
          palpite_adv:   data.palpiteFora,
          updated_at:    new Date().toISOString(),
        },
        { onConflict: 'usuario_id' }
      );

    if (dbError) throw dbError;

    // 4. Gera imagem com html-to-image (sem SecurityError)
    if (fieldRef.current) {
      const { toPng } = await import('html-to-image');

      // crossOrigin="anonymous" em todas as imagens para evitar taint
      fieldRef.current.querySelectorAll('img').forEach((img) => {
        (img as HTMLImageElement).crossOrigin = 'anonymous';
      });
      await new Promise(r => setTimeout(r, 80));

      const dataUrl = await toPng(fieldRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        style: { imageRendering: 'auto' },
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File(
        [blob],
        `meu-tigre-fc-${data.jogoId}.png`,
        { type: 'image/png' }
      );

      // 5. Mobile → Web Share API | Desktop → download direto
      const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
      if (isMobile && navigator.share && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Minha Escalação Tigre FC 🐯',
            text: `Palpite: Novorizontino ${data.palpiteCasa} × ${data.palpiteFora}!\nonovorizontino.com.br/tigre-fc`,
          });
        } catch (shareError) {
          // Usuário cancelou — silencioso
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href     = url;
        a.download = `meu-tigre-fc-${data.jogoId}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 3000);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error('[SalvarECompartilhar]', error);
    return { success: false, error };
  }
}
