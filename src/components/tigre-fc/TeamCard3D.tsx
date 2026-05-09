'use client';

/**
 * TeamCard3D — Card premium "Meu Time" com efeito 3D ultra-premium
 *
 * Efeitos visuais:
 * - Tilt 3D com spring physics (Card3DTilt)
 * - Chrome metallic shine seguindo cursor
 * - Holographic iridescent overlay
 * - Logo do clube em translateZ(30px) — flutua "na frente" do card
 * - Formação em gold com drop-shadow
 * - Borda dourada animada (shimmer)
 * - Animação de entrada (spring bounce)
 */

import { motion } from 'framer-motion';
import Card3DTilt from './Card3DTilt';

const GOLD  = '#F5C400';
const CYAN  = '#00F3FF';
const FONT  = "'Barlow Condensed', system-ui, sans-serif";
const PATA  = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';

interface Time {
  nome:       string;
  sigla:      string;
  escudo_url: string;
}

interface TeamCard3DProps {
  formacao:         string;
  capitaoNome:      string | null;
  heroiNome:        string | null;
  palpiteMandante:  number | null;
  palpiteVisitante: number | null;
  mandante:         Time;
  visitante:        Time;
  nomeUsuario:      string;
  avatarUrl?:       string | null;
  pontos?:          number | null;
  rodada?:          number | null;
  onClick?:         () => void;
}

export default function TeamCard3D({
  formacao, capitaoNome, heroiNome,
  palpiteMandante, palpiteVisitante,
  mandante, visitante,
  nomeUsuario, avatarUrl, pontos, rodada,
  onClick,
}: TeamCard3DProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 24, delay: 0.1 }}
    >
      <Card3DTilt
        maxTilt={13}
        glowColor={GOLD}
        chrome
        holographic
        elevation={4}
        onClick={onClick}
        style={{
          borderRadius:    22,
          overflow:        'hidden',
          background:      'linear-gradient(145deg, #0e0e00 0%, #1a1500 45%, #0b0b00 100%)',
          border:          '1px solid rgba(245,196,0,0.18)',
          fontFamily:      FONT,
          userSelect:      'none',
        }}
      >
        {/* ── Top shimmer bar ──────────────────────────────────────────────── */}
        <div style={{
          height:     2,
          background: `linear-gradient(90deg, transparent 0%, ${GOLD} 40%, ${CYAN}60 65%, ${GOLD} 80%, transparent 100%)`,
          animation:  'shimmerBar 3s linear infinite',
        }} />

        {/* ── Noise texture overlay (premium feel) ────────────────────────── */}
        <div style={{
          position:   'absolute',
          inset:      0,
          opacity:    0.03,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex:     50,
        }} />

        {/* ── Content ───────────────────────────────────────────────────────── */}
        <div style={{ padding: '14px 18px 18px', position: 'relative', zIndex: 60 }}>

          {/* Header: avatar + nome + escudo flutuante */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>

            {/* Avatar */}
            <div style={{
              width:        38,
              height:       38,
              borderRadius: '50%',
              border:       `2px solid ${GOLD}40`,
              overflow:     'hidden',
              flexShrink:   0,
              background:   '#111',
              boxShadow:    `0 0 12px ${GOLD}20`,
            }}>
              <img
                src={avatarUrl ?? PATA}
                alt={nomeUsuario}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }}
              />
            </div>

            {/* Nome + label */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize:      14,
                fontWeight:    900,
                color:         '#fff',
                textTransform: 'uppercase',
                letterSpacing: -0.3,
                lineHeight:    1,
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                whiteSpace:    'nowrap',
              }}>
                {nomeUsuario}
              </div>
              <div style={{
                fontSize:      9,
                color:         GOLD,
                fontWeight:    800,
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginTop:     2,
                opacity:       0.8,
              }}>
                Meu Time{rodada != null ? ` · R${rodada}` : ''}
              </div>
            </div>

            {/* Escudo do clube — translateZ cria profundidade real */}
            <div style={{
              transform:  'translateZ(30px)',
              flexShrink: 0,
              filter:     `drop-shadow(0 0 10px ${GOLD}50) drop-shadow(0 2px 8px rgba(0,0,0,0.6))`,
            }}>
              <img
                src={mandante.escudo_url}
                alt={mandante.nome}
                style={{ width: 44, height: 44, objectFit: 'contain' }}
                onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }}
              />
            </div>
          </div>

          {/* Divider dourado */}
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}25, transparent)`, marginBottom: 12 }} />

          {/* Formation + Palpite */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 }}>

            {/* Formação em 3D */}
            <div>
              <div style={{ fontSize: 8, color: '#444', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 2 }}>
                Formação
              </div>
              <div style={{
                fontSize:      38,
                fontWeight:    900,
                fontStyle:     'italic',
                color:         GOLD,
                lineHeight:    1,
                letterSpacing: -1,
                textShadow:    `0 0 20px ${GOLD}50, 0 2px 4px rgba(0,0,0,0.8)`,
                transform:     'translateZ(20px)',
              }}>
                {formacao}
              </div>
            </div>

            {/* Palpite */}
            {palpiteMandante !== null && palpiteVisitante !== null && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 8, color: '#444', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 2 }}>
                  Minha Aposta
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                  {/* Escudo visitante pequeno */}
                  <img src={mandante.escudo_url}  alt="" style={{ width: 16, height: 16, objectFit: 'contain', opacity: 0.7 }} />
                  <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                    {palpiteMandante}
                    <span style={{ color: '#2a2a2a', margin: '0 2px' }}>×</span>
                    {palpiteVisitante}
                  </div>
                  <img src={visitante.escudo_url} alt="" style={{ width: 16, height: 16, objectFit: 'contain', opacity: 0.7 }} />
                </div>
                <div style={{ fontSize: 8, color: '#2a2a2a', fontWeight: 700, marginTop: 2 }}>
                  {mandante.sigla} vs {visitante.sigla}
                </div>
              </div>
            )}
          </div>

          {/* Capitão + Herói */}
          {(capitaoNome || heroiNome) && (
            <div style={{ display: 'grid', gridTemplateColumns: capitaoNome && heroiNome ? '1fr 1fr' : '1fr', gap: 8 }}>
              {capitaoNome && (
                <div style={{
                  background:   `rgba(245,196,0,0.06)`,
                  border:       `1px solid rgba(245,196,0,0.18)`,
                  borderRadius: 12,
                  padding:      '9px 11px',
                }}>
                  <div style={{ fontSize: 8, color: GOLD, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
                    👑 Capitão
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.2, lineHeight: 1 }}>
                    {capitaoNome}
                  </div>
                </div>
              )}
              {heroiNome && (
                <div style={{
                  background:   `rgba(0,243,255,0.04)`,
                  border:       `1px solid rgba(0,243,255,0.18)`,
                  borderRadius: 12,
                  padding:      '9px 11px',
                }}>
                  <div style={{ fontSize: 8, color: CYAN, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
                    ⭐ Herói
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.2, lineHeight: 1 }}>
                    {heroiNome}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pontuação (se disponível) */}
          {pontos != null && pontos > 0 && (
            <div style={{
              marginTop:    12,
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              gap:          6,
              padding:      '8px',
              background:   `rgba(245,196,0,0.05)`,
              borderRadius: 10,
              border:       `1px solid rgba(245,196,0,0.1)`,
            }}>
              <span style={{ fontSize: 9, color: '#444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>
                Pontuação
              </span>
              <span style={{ fontSize: 20, fontWeight: 900, fontStyle: 'italic', color: GOLD, lineHeight: 1 }}>
                {pontos}
              </span>
              <span style={{ fontSize: 8, color: '#444', fontWeight: 700, textTransform: 'uppercase' }}>pts</span>
            </div>
          )}
        </div>

        {/* Bottom chrome bar */}
        <div style={{
          height:     2,
          background: `linear-gradient(90deg, transparent, ${GOLD}30, ${CYAN}20, ${GOLD}30, transparent)`,
        }} />

        <style>{`
          @keyframes shimmerBar {
            0%   { background-position: -200% center }
            100% { background-position:  200% center }
          }
        `}</style>
      </Card3DTilt>
    </motion.div>
  );
}
