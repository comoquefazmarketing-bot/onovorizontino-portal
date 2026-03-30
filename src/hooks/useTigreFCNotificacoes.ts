'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useTigreFCNotificacoes(usuarioId: string | null) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!usuarioId) return;

    // Busca não lidas
    supabase.from('tigre_fc_notificacoes')
      .select('id', { count: 'exact', head: true })
      .eq('usuario_id', usuarioId).eq('lida', false)
      .then(({ count: c }) => setCount(c || 0));

    // Realtime
    const channel = supabase.channel(`notif-${usuarioId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'tigre_fc_notificacoes',
        filter: `usuario_id=eq.${usuarioId}`,
      }, () => setCount(prev => prev + 1))
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [usuarioId]);

  const marcarLidas = async () => {
    if (!usuarioId) return;
    await supabase.from('tigre_fc_notificacoes')
      .update({ lida: true }).eq('usuario_id', usuarioId).eq('lida', false);
    setCount(0);
  };

  return { count, marcarLidas };
}
