'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';
const MINUTOS_FECHAMENTO = 90;

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function ModoDesespero() {
  const [jogo, setJogo] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch('/api/proximo-jogo').then(r => r.json()).then(({ jogos }) => {
      if (jogos?.[0]) setJogo(jogos[0]);
    });
  }, []);

  useEffect(() => {
    if (!jogo?.data_hora) return;

    const tick = () => {
      const agora = new Date().getTime();
      // Garantindo que a data seja lida corretamente convertendo hífens se necessário
      const dataISO = jogo.data_hora.replace(' ', 'T');
      const jogoTime = new Date(dataISO).getTime();
      
      const fechamentoTime = jogoTime - (MINUTOS_FECHAMENTO * 60 * 1000);
      const diff = fechamentoTime - agora;

      if (diff <= 0) {
        setVisible(false);
        return;
      }

      // Aparece se faltar menos de 24h para o fechamento
      if (diff <= 24 * 3600 * 1000) {
        setTimeLeft(Math.floor(diff / 1000));
        setVisible(true);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [jogo]);

  if (!visible || timeLeft === null) return null;

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div style={{
      position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
      background: 'rgba(0,0,0,0.9)', border: '1px solid #F5C400', borderRadius: '12px',
      padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 0 20px rgba(245,196,0,0.3)', backdropFilter: 'blur(10px)', width: 'min(90vw, 400px)'
    }}>
      <img src={LOGO} style={{ width: 24, height: 24, objectFit: 'contain' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 9, fontWeight: 900, color: '#F5C400', textTransform: 'uppercase', letterSpacing: 1 }}>Mercado Fecha em:</div>
        <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 900, color: '#fff' }}>
          {pad(h)}<span style={{ color: '#F5C400' }}>H</span> {pad(m)}<span style={{ color: '#F5C400' }}>M</span> {pad(s)}<span style={{ color: '#F5C400' }}>S</span>
        </div>
      </div>
      <Link href="/tigre-fc" style={{ background: '#F5C400', color: '#000', padding: '6px 12px', borderRadius: '6px', fontSize: 10, fontWeight: 900, textDecoration: 'none' }}>
        ESCALAR
      </Link>
    </div>
  );
}
