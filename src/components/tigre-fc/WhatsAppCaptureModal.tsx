'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

interface Props {
  usuarioId: string;      // tigre_fc_usuarios.id
  onClose: () => void;
}

export default function WhatsAppCaptureModal({ usuarioId, onClose }: Props) {
  const [numero, setNumero]   = useState('');
  const [salvando, setSalvando] = useState(false);
  const [salvo,    setSalvo]    = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const formatarNumero = (v: string) => {
    // Mantém só dígitos, máx 11
    const digits = v.replace(/\D/g, '').slice(0, 11);
    // Formata: (XX) XXXXX-XXXX
    if (digits.length <= 2)  return digits;
    if (digits.length <= 7)  return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7)}`;
    return digits;
  };

  const digitsOnly = numero.replace(/\D/g, '');
  const valido = digitsOnly.length === 10 || digitsOnly.length === 11;

  async function salvar() {
    if (!valido) return;
    setSalvando(true);
    await supabase
      .from('tigre_fc_usuarios')
      .update({ whatsapp: `55${digitsOnly}`, whatsapp_solicitado: true })
      .eq('id', usuarioId);
    setSalvando(false);
    setSalvo(true);
    setTimeout(onClose, 1800);
  }

  async function recusar() {
    // Marca como solicitado para não mostrar de novo
    await supabase
      .from('tigre_fc_usuarios')
      .update({ whatsapp_solicitado: true })
      .eq('id', usuarioId);
    onClose();
  }

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-end justify-center p-4 pb-8"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={recusar}>

      <motion.div
        className="w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #141414 0%, #0d0d0d 100%)',
          border: '1px solid rgba(245,196,0,0.2)',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245,196,0,0.08)',
        }}
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}>

        {/* Header decorativo */}
        <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #F5C400, #fbbf24, #F5C400)' }} />

        <div className="p-6">
          <AnimatePresence mode="wait">
            {salvo ? (
              <motion.div key="salvo"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-4 gap-3">
                <div className="text-4xl">✅</div>
                <p className="text-white font-black text-lg">Salvo!</p>
                <p className="text-zinc-400 text-sm text-center">
                  Você vai receber o resultado direto no WhatsApp 🐯
                </p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 1 }}>
                {/* Ícone + título */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)' }}>
                    📲
                  </div>
                  <div>
                    <p className="text-white font-black text-base leading-tight">Receba o resultado no WhatsApp</p>
                    <p className="text-zinc-500 text-xs mt-0.5">Pontuação + placar assim que o jogo acabar</p>
                  </div>
                </div>

                {/* Input de telefone */}
                <div className="relative mb-3">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-bold select-none">
                    🇧🇷 +55
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={numero}
                    onChange={e => setNumero(formatarNumero(e.target.value))}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-16 pr-4 py-3.5 rounded-2xl text-white font-bold text-base outline-none transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: `1.5px solid ${valido ? 'rgba(37,211,102,0.6)' : 'rgba(255,255,255,0.1)'}`,
                    }}
                  />
                </div>

                {/* Disclaimer */}
                <p className="text-zinc-600 text-[10px] text-center mb-4 leading-relaxed">
                  Só enviaremos resultados dos jogos. Sem spam. Pode cancelar a qualquer hora.
                </p>

                {/* Botões */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={salvar}
                    disabled={!valido || salvando}
                    className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-40"
                    style={{
                      background: valido ? 'linear-gradient(90deg,#25D366,#128C7E)' : 'rgba(255,255,255,0.06)',
                      color: valido ? '#fff' : '#52525b',
                      boxShadow: valido ? '0 8px 24px rgba(37,211,102,0.3)' : 'none',
                    }}>
                    {salvando ? '⏳ Salvando...' : '✓ Quero receber'}
                  </button>
                  <button
                    onClick={recusar}
                    className="w-full py-2.5 text-zinc-600 text-xs font-bold tracking-wider hover:text-zinc-400 transition-colors">
                    Agora não
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
