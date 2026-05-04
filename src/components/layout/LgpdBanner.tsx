'use client';
import { useState, useEffect } from 'react';

export default function LgpdBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const ok = localStorage.getItem('tigre_lgpd_v3');
    if (!ok) setVisible(true);
  }, []);

  const aceitar = () => {
    localStorage.setItem('tigre_lgpd_v3', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-zinc-950 border-t-2 border-yellow-500 px-4 py-4 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          <p className="text-white text-xs leading-relaxed">
            🍪 Utilizamos cookies e coletamos dados para personalizar sua experiência e veicular anúncios relevantes. Ao continuar navegando você concorda com nossa{' '}
            <a href="/politica-de-privacidade" className="text-yellow-500 font-bold underline hover:text-yellow-400">Política de Privacidade</a> e com a{' '}
            <span className="text-yellow-500 font-bold">Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</span>. Seus dados são usados exclusivamente pelo{' '}
            <span className="text-yellow-500 font-bold">Portal O Novorizontino</span>.
          </p>
        </div>
        <button
          onClick={aceitar}
          className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-all active:scale-95 whitespace-nowrap"
        >
          Entendi e aceito
        </button>
      </div>
    </div>
  );
}
