'use client';
import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

const PATA = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const ESCUDO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png';
const FIELD_BG = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ARENA%20TIGRE%20FC%20FRONT.png';
const BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';

type Player = { id: number; nome: string; apelido?: string; foto?: string; pos: string };

interface Props {
  jogadores: Player[];
  capitaoId?: number | null;
  heroiId?: number | null;
  formacao?: string;
  adversario?: string;
  nomeUsuario?: string;
}

const POS_LABEL: Record<string, string> = { GOL:'GOL', LAT:'LAT', ZAG:'ZAG', MEI:'MEI', ATA:'ATA' };

export default function CompartilharEscalacao({ jogadores, capitaoId, heroiId, formacao = '4-3-3', adversario, nomeUsuario }: Props) {
  const [gerando, setGerando] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const gerar = async () => {
    if (!cardRef.current || gerando) return;
    setGerando(true);
    try {
      // Pre-fetch imagens para blob (evita CORS no canvas)
      const imgs = cardRef.current.querySelectorAll('img');
      await Promise.allSettled(Array.from(imgs).map(async img => {
        try {
          const r = await fetch(img.src, { mode: 'cors' });
          const blob = await r.blob();
          img.src = URL.createObjectURL(blob);
        } catch {}
      }));
      await new Promise(r => setTimeout(r, 300));

      const dataUrl = await htmlToImage.toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });

      // Tenta Web Share API (mobile)
      if (navigator.share && navigator.canShare) {
        const res  = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], 'minha-escalacao.png', { type: 'image/png' });
        const txt  = `🐯 Minha escalação pro jogo${adversario ? ` contra o ${adversario}` : ''}!\n\nVeja e escale a sua em onovorizontino.com.br/tigre-fc`;
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ title: 'Tigre FC — Minha Escalação', text: txt, files: [file] });
          setGerando(false);
          return;
        }
      }

      // Fallback: download
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'minha-escalacao-tigre-fc.png';
      a.click();
    } catch (e) {
      console.error(e);
    }
    setGerando(false);
  };

  const por_posicao: Record<string, Player[]> = {};
  for (const j of jogadores) {
    if (!por_posicao[j.pos]) por_posicao[j.pos] = [];
    por_posicao[j.pos].push(j);
  }

  return (
    <>
      {/* Card oculto que será capturado */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <div ref={cardRef} style={{
          width: 390, background: '#080808', fontFamily: 'system-ui, sans-serif',
          borderRadius: 24, overflow: 'hidden', border: '2px solid #F5C40040',
        }}>
          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #1a1200, #111)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={ESCUDO} style={{ width: 44, height: 44, objectFit: 'contain' }} crossOrigin="anonymous" />
            <div>
              <div style={{ color: '#F5C400', fontWeight: 900, fontSize: 18, letterSpacing: -0.5, textTransform: 'uppercase' }}>
                Tigre FC
              </div>
              <div style={{ color: '#555', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                {nomeUsuario ? `Escalação de ${nomeUsuario}` : 'Minha Escalação'}
              </div>
            </div>
            {adversario && (
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ color: '#444', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>vs</div>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 13, textTransform: 'uppercase' }}>{adversario}</div>
              </div>
            )}
          </div>

          {/* Formação */}
          <div style={{ textAlign: 'center', padding: '8px 0 4px', color: '#F5C40080', fontSize: 11, fontWeight: 900, letterSpacing: 3, textTransform: 'uppercase' }}>
            {formacao}
          </div>

          {/* Campo com jogadores por posição */}
          <div style={{
            margin: '0 16px 16px', borderRadius: 12, overflow: 'hidden',
            background: 'linear-gradient(180deg, #0d3020 0%, #0a2818 40%, #0d3020 100%)',
            padding: '16px 8px', position: 'relative',
          }}>
            {/* Linha do meio */}
            <div style={{ position: 'absolute', left: 16, right: 16, top: '50%', height: 1, background: '#ffffff15' }} />
            <div style={{ position: 'absolute', left: '50%', top: '30%', bottom: '10%', width: 1, background: '#ffffff10', transform: 'translateX(-50%)' }} />

            {['ATA','MEI','ZAG','LAT','GOL'].map(pos => {
              const group = por_posicao[pos] ?? [];
              if (!group.length) return null;
              return (
                <div key={pos} style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
                  {group.map(j => (
                    <div key={j.id} style={{ textAlign: 'center', width: 64 }}>
                      <div style={{ position: 'relative', width: 52, height: 64, margin: '0 auto 4px', borderRadius: 8, overflow: 'hidden', border: `2px solid ${j.id === capitaoId ? '#F5C400' : j.id === heroiId ? '#60a5fa' : '#ffffff20'}` }}>
                        <img src={j.foto || `${BASE}${j.nome.toUpperCase().replace(/ /g,'-')}.jpg.webp`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                          crossOrigin="anonymous" />
                        {j.id === capitaoId && (
                          <div style={{ position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: '50%', background: '#F5C400', color: '#000', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>C</div>
                        )}
                        {j.id === heroiId && (
                          <div style={{ position: 'absolute', top: 2, right: 2, fontSize: 10 }}>⭐</div>
                        )}
                      </div>
                      <div style={{ color: '#fff', fontSize: 9, fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.2, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        {j.apelido || j.nome.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #1a1a1a' }}>
            <div style={{ color: '#333', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              onovorizontino.com.br/tigre-fc
            </div>
            <img src={PATA} style={{ width: 24, height: 24, objectFit: 'contain', opacity: 0.4 }} crossOrigin="anonymous" />
          </div>
        </div>
      </div>

      {/* Botão visível */}
      <button onClick={gerar} disabled={gerando}
        className="w-full py-4 rounded-2xl border border-white/10 text-zinc-300 font-black text-sm uppercase tracking-widest hover:border-yellow-500/40 hover:text-yellow-400 transition-all disabled:opacity-40 flex items-center justify-center gap-2">
        {gerando ? (
          <><span className="animate-spin">⏳</span> Gerando card...</>
        ) : (
          <>📲 Compartilhar escalação</>
        )}
      </button>
    </>
  );
}
