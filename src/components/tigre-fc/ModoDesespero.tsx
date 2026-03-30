'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

function pad(n: number) { return String(n).padStart(2, '0'); }

export default function ModoDesespero() {
  const [jogo, setJogo] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [jaEscalou, setJaEscalou] = useState(false);
  const [apelido, setApelido] = useState('');
  const [nivel, setNivel] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Busca próximo jogo
    fetch('/api/proximo-jogo')
      .then(r => r.json())
      .then(({ jogos }) => {
        if (jogos?.[0]) setJogo(jogos[0]);
      });

    // Verifica se usuário está logado e já escalou
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const { data: u } = await supabase
        .from('tigre_fc_usuarios').select('id, apelido, nivel')
        .eq('google_id', session.user.id).single();
      if (!u) return;
      setApelido(u.apelido || '');
      setNivel(u.nivel || '');

      // Verifica escalação
      const { data: esc } = await supabase
        .from('tigre_fc_escalacoes').select('id')
        .eq('usuario_id', u.id).limit(1).single();
      setJaEscalou(!!esc);
    });
  }, []);

  useEffect(() => {
    if (!jogo) return;

    const jogoTime = new Date(jogo.data_hora).getTime();

    const tick = () => {
      const diff = jogoTime - Date.now();
      if (diff <= 0) { setTimeLeft(0); setVisible(false); return; }
      // Aparece só se faltar menos de 2h
      if (diff <= 2 * 3600 * 1000) {
        setTimeLeft(Math.floor(diff / 1000));
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [jogo]);

  if (!visible || timeLeft === null) return null;

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  const NIVEL_ICON: Record<string, string> = { Novato:'🌱', Fiel:'⚡', Garra:'🔥', Lenda:'🐯' };

  return (
    <>
      <style>{`
        @keyframes md-pulse { 0%,100%{opacity:1} 50%{opacity:.7} }
        @keyframes md-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-2px)} 75%{transform:translateX(2px)} }
        @keyframes md-glow { 0%,100%{box-shadow:0 0 20px rgba(245,196,0,.4)} 50%{box-shadow:0 0 40px rgba(245,196,0,.8)} }
        .md-wrap { animation: md-glow 2s ease-in-out infinite; }
        .md-timer { animation: md-pulse 1s ease-in-out infinite; }
        .md-dot { animation: md-pulse .8s ease-in-out infinite; }
        .md-btn { transition: transform .15s, background .15s; }
        .md-btn:hover { transform: scale(1.04); background: #fff !important; }
        .md-btn:active { transform: scale(.97); }
      `}</style>

      <div className="md-wrap" style={{
        position: 'fixed', top: 28, left: 0, right: 0, zIndex: 9990,
        background: '#F5C400', borderBottom: '3px solid #1a1a1a',
        padding: '10px 16px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      }}>
        {/* Esquerda */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="md-dot" style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
          <img src={LOGO} style={{ width: 24, height: 24, objectFit: 'contain', flexShrink: 0 }} />
          <div>
            {jaEscalou && apelido ? (
              <div style={{ fontSize: 12, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {NIVEL_ICON[nivel]} {apelido} — Time escalado! Boa sorte!
              </div>
            ) : (
              <div style={{ fontSize: 12, fontWeight: 900, color: '#111', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                ⚠️ O TIGRE VAI ENTRAR EM CAMPO!
              </div>
            )}
            <div style={{ fontSize: 10, color: '#5a4800', fontWeight: 700 }}>
              {jogo?.mandante?.nome} × {jogo?.visitante?.nome}
            </div>
          </div>
        </div>

        {/* Centro — cronômetro */}
        {!jaEscalou && (
          <div className="md-timer" style={{
            fontFamily: 'monospace', fontSize: 20, fontWeight: 900,
            color: '#111', letterSpacing: 3, background: 'rgba(0,0,0,0.12)',
            padding: '4px 14px', borderRadius: 8,
          }}>
            {pad(h)}:{pad(m)}:{pad(s)}
          </div>
        )}

        {/* Direita — CTA */}
        <Link
          href="/tigre-fc"
          className="md-btn"
          style={{
            background: '#111', color: '#F5C400', fontWeight: 900,
            fontSize: 11, textTransform: 'uppercase', letterSpacing: 1,
            padding: '8px 16px', borderRadius: 20, textDecoration: 'none',
            flexShrink: 0,
          }}>
          {jaEscalou ? 'Ver ranking →' : 'Escalar agora →'}
        </Link>

        {/* Fechar */}
        <button
          onClick={() => setVisible(false)}
          style={{ background: 'none', border: 'none', color: '#5a4800', fontSize: 18, cursor: 'pointer', padding: '0 4px', flexShrink: 0 }}>
          ×
        </button>
      </div>
    </>
  );
}
