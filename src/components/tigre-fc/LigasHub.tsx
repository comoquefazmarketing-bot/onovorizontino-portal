'use client';

/**
 * LigasHub v3 — Central de Ligas Particulares
 * Design: PS5 / EA Sports — Dark premium, neon dourado, glass morphism
 *
 * Funcionalidades:
 * - Gate de XP: apenas Fiel (100+ XP) cria ligas; Novato só entra via código
 * - Ranking interno por liga com pontos, jogos e acertos
 * - Copy/Share do código via WhatsApp / Web Share API
 * - Animações Framer Motion em transições de aba e cards
 * - Visualização cruzada: clique no membro abre TigreFCPerfilPublico
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  useLigas,
  type Liga,
  type LigaMembro,
  NIVEL_CORES,
  NIVEL_ICONES,
  XP_PARA_CRIAR_LIGA,
} from '@/hooks/useLigas';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';

// ─── Constantes ───────────────────────────────────────────────────────────────

const TIGRE_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

// ─── Animação padrão de entrada ───────────────────────────────────────────────

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.35, ease: 'easeOut' } 
  },
  exit: { 
    opacity: 0, 
    y: -8, 
    transition: { duration: 0.2 } 
  },
};

// ─── XP Progress Bar ──────────────────────────────────────────────────────────

function XPProgressBar({ xp }: { xp: number }) {
  const pct = Math.min(100, (xp / XP_PARA_CRIAR_LIGA) * 100);
  const cor = xp >= XP_PARA_CRIAR_LIGA ? '#F5C400' : '#3B82F6';

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: 1.5 }}>
          XP para criar liga
        </span>
        <span style={{ fontSize: 10, fontWeight: 900, color: cor }}>
          {xp} / {XP_PARA_CRIAR_LIGA}
        </span>
      </div>
      <div style={{ height: 4, background: '#1a1a1a', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          style={{
            height: '100%',
            background: xp >= XP_PARA_CRIAR_LIGA
              ? 'linear-gradient(90deg, #D4A200, #F5C400)'
              : 'linear-gradient(90deg, #1D4ED8, #3B82F6)',
            borderRadius: 999,
            boxShadow: `0 0 8px ${cor}60`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onEntrar }: { onEntrar: () => void }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" style={{ textAlign: 'center', padding: '48px 20px' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🐯</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8, textTransform: 'uppercase', letterSpacing: -0.5 }}>
        Nenhuma liga ainda
      </div>
      <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 28 }}>
        Cria um grupo e chama a galera do WhatsApp,<br />ou entra numa liga com o código de um amigo.
      </p>
      <button
        onClick={onEntrar}
        style={{
          padding: '14px 28px',
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
          borderRadius: 14,
          color: '#F5C400',
          fontSize: 12,
          fontWeight: 900,
          cursor: 'pointer',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        Entrar com código →
      </button>
    </motion.div>
  );
}

// ─── Liga Card ────────────────────────────────────────────────────────────────

function LigaCard({ liga, posicao, onClick }: { liga: Liga; posicao?: number; onClick: () => void }) {
  return (
    <motion.button
      variants={fadeUp}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, #111 0%, #131308 100%)',
        border: '1px solid rgba(245,196,0,0.1)',
        borderRadius: 18,
        padding: '16px 18px',
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        transition: 'border-color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,196,0,0.3)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,196,0,0.1)')}
    >
      {/* Ícone */}
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 14,
          background: 'linear-gradient(135deg, rgba(245,196,0,0.15), rgba(245,196,0,0.05))',
          border: '1px solid rgba(245,196,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
          flexShrink: 0,
        }}
      >
        {liga.dono_id ? '👑' : '⚽'}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.3, marginBottom: 3 }}>
          {liga.nome}
        </div>
        {liga.descricao && (
          <div style={{ fontSize: 11, color: '#444', lineHeight: 1.4, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {liga.descricao}
          </div>
        )}
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: 10, color: '#F5C400', fontWeight: 700 }}>
            {liga.total_membros ?? '?'} membros
          </span>
          {posicao && (
            <span style={{ fontSize: 10, color: '#555', fontWeight: 700 }}>
              #{posicao} no ranking
            </span>
          )}
        </div>
      </div>

      {/* Código */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#F5C400', letterSpacing: 2, fontFamily: 'monospace' }}>
          {liga.codigo_convite?.toUpperCase()}
        </div>
        <div style={{ fontSize: 8, color: '#333', textTransform: 'uppercase', letterSpacing: 1 }}>código</div>
      </div>
    </motion.button>
  );
}

// ─── Ranking da Liga Modal ────────────────────────────────────────────────────

function RankingModal({
  liga,
  membros,
  viewerUserId,
  onClose,
  onVerPerfil,
}: {
  liga: Liga;
  membros: LigaMembro[];
  viewerUserId: string | null;
  onClose: () => void;
  onVerPerfil: (id: string) => void;
}) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = async () => {
    await navigator.clipboard.writeText(liga.codigo_convite ?? '');
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const compartilharWhatsApp = () => {
    const msg = encodeURIComponent(
      `🐯 Entra na minha liga no Tigre FC!\nCódigo: *${liga.codigo_convite?.toUpperCase()}*\nBaixa o app: https://onovorizontino.com.br/tigre-fc`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{
            width: '100%',
            maxWidth: 480,
            background: 'linear-gradient(160deg, #090909 0%, #0f0f0a 100%)',
            borderRadius: '24px 24px 0 0',
            borderTop: '1px solid rgba(245,196,0,0.2)',
            maxHeight: '88vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Linha dourada */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.5), transparent)' }} />

          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
            <div style={{ width: 36, height: 4, background: '#222', borderRadius: 2 }} />
          </div>

          {/* Header */}
          <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, color: '#444', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 4 }}>
                Liga Particular
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.5, lineHeight: 1 }}>
                {liga.nome}
              </div>
              {liga.descricao && (
                <div style={{ fontSize: 12, color: '#444', marginTop: 4 }}>{liga.descricao}</div>
              )}
            </div>
            <button
              onClick={onClose}
              style={{ background: '#1a1a1a', border: '1px solid #222', color: '#555', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ×
            </button>
          </div>

          {/* Código & Ações */}
          <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8 }}>
            <button
              onClick={copiarCodigo}
              style={{
                flex: 1, padding: '12px', background: '#111', border: '1px solid #222', borderRadius: 12,
                color: copiado ? '#22C55E' : '#fff', fontWeight: 900, fontSize: 11, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 14, color: '#F5C400' }}>
                {liga.codigo_convite?.toUpperCase()}
              </span>
              {copiado ? '✓' : '📋'}
            </button>
            <button
              onClick={compartilharWhatsApp}
              style={{
                padding: '12px 16px', background: '#128C7E', border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 900, fontSize: 11, cursor: 'pointer', textTransform: 'uppercase',
              }}
            >
              WhatsApp
            </button>
          </div>

          {/* Separador */}
          <div style={{ height: 1, background: '#111', margin: '0 20px' }} />

          {/* Ranking */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 32px' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#333', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>
              Ranking
            </div>

            {membros.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#333', fontSize: 13 }}>
                Nenhum membro ainda.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {membros.map((membro, i) => {
                  const perfil = membro.tigre_fc_usuarios;
                  const nivelCor = NIVEL_CORES[perfil?.nivel ?? 'Novato'];
                  const isViewer = membro.usuario_id === viewerUserId;
                  const medals = ['🥇', '🥈', '🥉'];

                  return (
                    <motion.button
                      key={membro.usuario_id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => onVerPerfil(membro.usuario_id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        background: isViewer ? 'rgba(245,196,0,0.05)' : 'transparent',
                        border: isViewer ? '1px solid rgba(245,196,0,0.15)' : '1px solid transparent',
                        borderRadius: 12,
                        cursor: 'pointer',
                        textAlign: 'left',
                        width: '100%',
                      }}
                    >
                      {/* Posição */}
                      <div style={{ width: 24, textAlign: 'center', flexShrink: 0 }}>
                        {i < 3 ? (
                          <span style={{ fontSize: 16 }}>{medals[i]}</span>
                        ) : (
                          <span style={{ fontSize: 12, fontWeight: 900, color: '#333' }}>{i + 1}</span>
                        )}
                      </div>

                      {/* Avatar */}
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: `${nivelCor}20`,
                          border: `1.5px solid ${nivelCor}`,
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        {perfil?.avatar_url ? (
                          <img src={perfil.avatar_url} alt={perfil.display_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                            {NIVEL_ICONES[perfil?.nivel ?? 'Novato']}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 900, color: isViewer ? '#F5C400' : '#fff', textTransform: 'uppercase', letterSpacing: -0.2, lineHeight: 1 }}>
                          {perfil?.display_name ?? 'Torcedor'}
                          {isViewer && <span style={{ color: '#555', fontSize: 9, fontWeight: 700, marginLeft: 6 }}>• você</span>}
                        </div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                          <span style={{ fontSize: 9, color: '#444', fontWeight: 700 }}>{membro.jogos}J</span>
                          <span style={{ fontSize: 9, color: '#22C55E', fontWeight: 700 }}>{membro.acertos}✓</span>
                        </div>
                      </div>

                      {/* Pontos */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#F5C400', fontStyle: 'italic', lineHeight: 1 }}>
                          {membro.pontos}
                        </div>
                        <div style={{ fontSize: 8, color: '#333', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>pts</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface LigasHubProps {
  usuarioId: string | null;
}

type TabView = 'minhas' | 'criar' | 'entrar';

export default function LigasHub({ usuarioId }: LigasHubProps) {
  const {
    perfil,
    minhasLigas,
    isLoading,
    error,
    podeCriarLiga,
    xpParaFiel,
    criarLiga,
    entrarNaLiga,
    getRankingLiga,
  } = useLigas(usuarioId);

  const [activeTab, setActiveTab]       = useState<TabView>('minhas');
  const [ligaDetalhes, setLigaDetalhes] = useState<{ liga: Liga; membros: LigaMembro[] } | null>(null);
  const [perfilTarget, setPerfilTarget] = useState<string | null>(null);

  const [nomeLiga, setNomeLiga]         = useState('');
  const [descLiga, setDescLiga]         = useState('');
  const [codigoInput, setCodigoInput]   = useState('');
  const [isSaving, setIsSaving]         = useState(false);
  const [successMsg, setSuccessMsg]     = useState<string | null>(null);

  const abrirLiga = useCallback(async (liga: Liga) => {
    const membros = await getRankingLiga(liga.id);
    setLigaDetalhes({ liga, membros });
  }, [getRankingLiga]);

  const handleCriarLiga = useCallback(async () => {
    if (!nomeLiga.trim()) return;
    setIsSaving(true);
    try {
      const liga = await criarLiga(nomeLiga.trim(), descLiga.trim() || undefined);
      if (liga) {
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.55 }, colors: ['#F5C400', '#fff', '#EF4444'] });
        setSuccessMsg(`🏆 Liga "${liga.nome}" criada!`);
        setNomeLiga('');
        setDescLiga('');
        setActiveTab('minhas');
        setTimeout(() => setSuccessMsg(null), 6000);
      }
    } finally {
      setIsSaving(false);
    }
  }, [criarLiga, nomeLiga, descLiga]);

  const handleEntrarNaLiga = useCallback(async () => {
    if (!codigoInput.trim()) return;
    setIsSaving(true);
    try {
      const result = await entrarNaLiga(codigoInput.trim());
      if (result.success) {
        confetti({ particleCount: 80, spread: 50, colors: ['#22C55E', '#fff'] });
        setSuccessMsg(`✅ Você entrou na liga "${result.ligaNome}"!`);
        setCodigoInput('');
        setActiveTab('minhas');
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } finally {
      setIsSaving(false);
    }
  }, [entrarNaLiga, codigoInput]);

  const TABS: { id: TabView; label: string; icon: string }[] = [
    { id: 'minhas', label: 'Minhas Ligas', icon: '🏆' },
    { id: 'entrar', label: 'Entrar',       icon: '🔑' },
    { id: 'criar',  label: 'Criar',        icon: '➕' },
  ];

  return (
    <>
      {/* Mensagem de sucesso */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 900,
              background: '#0a1f0a',
              border: '1px solid #22C55E',
              color: '#22C55E',
              padding: '12px 20px',
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 800,
              whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(34,197,94,0.2)',
            }}
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Container principal */}
      <div style={{
        minHeight: '100%',
        background: '#080808',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>

        {/* Header */}
        <div style={{
          padding: '20px 20px 0',
          background: 'linear-gradient(180deg, rgba(245,196,0,0.04) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(245,196,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img src={TIGRE_LOGO} alt="Tigre FC" style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(245,196,0,0.4))' }} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.5 }}>Ligas</div>
              <div style={{ fontSize: 10, color: '#333', textTransform: 'uppercase', letterSpacing: 2 }}>Tigre FC</div>
            </div>
            {perfil && (
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: NIVEL_CORES[perfil.nivel], fontWeight: 800 }}>
                  {NIVEL_ICONES[perfil.nivel]} {perfil.nivel}
                </div>
                <div style={{ fontSize: 10, color: '#333' }}>{perfil.xp} XP</div>
              </div>
            )}
          </div>

          {/* XP Progress */}
          {perfil && !podeCriarLiga && (
            <div style={{ paddingBottom: 16 }}>
              <XPProgressBar xp={perfil.xp} />
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #F5C400' : '2px solid transparent',
                  color: activeTab === tab.id ? '#F5C400' : '#333',
                  fontSize: 11,
                  fontWeight: 900,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div style={{ padding: '20px 20px 100px' }}>
          <AnimatePresence mode="wait">

            {/* ── MINHAS LIGAS ── */}
            {activeTab === 'minhas' && (
              <motion.div key="minhas" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ fontSize: 13, color: '#333', fontWeight: 700 }}>Carregando ligas...</div>
                  </div>
                ) : minhasLigas.length === 0 ? (
                  <EmptyState onEntrar={() => setActiveTab('entrar')} />
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                  >
                    {minhasLigas.map((liga) => (
                      <LigaCard
                        key={liga.id}
                        liga={liga}
                        onClick={() => abrirLiga(liga)}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── ENTRAR NA LIGA ── */}
            {activeTab === 'entrar' && (
              <motion.div key="entrar" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: -0.5 }}>
                    Entra no grupo
                  </div>
                  <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                    Peça o código de convite pra alguém da liga e cola aí.
                  </p>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>
                    Código da Liga
                  </label>
                  <input
                    value={codigoInput}
                    onChange={e => setCodigoInput(e.target.value.toUpperCase())}
                    placeholder="ABC12345"
                    maxLength={12}
                    style={{
                      width: '100%',
                      background: '#0f0f0f',
                      border: '1.5px solid #1a1a1a',
                      borderRadius: 14,
                      padding: '16px 20px',
                      color: '#F5C400',
                      fontSize: 22,
                      fontWeight: 900,
                      letterSpacing: 4,
                      fontFamily: 'monospace',
                      outline: 'none',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#F5C400')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                    onKeyDown={e => { if (e.key === 'Enter') handleEntrarNaLiga(); }}
                  />
                </div>

                {error && (
                  <div style={{ padding: '12px 16px', background: '#1a0808', border: '1px solid #EF4444', borderRadius: 12, color: '#EF4444', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                    {error}
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!codigoInput.trim() || isSaving}
                  onClick={handleEntrarNaLiga}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: codigoInput.trim() && !isSaving ? 'linear-gradient(135deg, #F5C400, #D4A200)' : '#1a1a1a',
                    border: 'none',
                    borderRadius: 16,
                    color: codigoInput.trim() && !isSaving ? '#000' : '#333',
                    fontSize: 13,
                    fontWeight: 900,
                    cursor: codigoInput.trim() && !isSaving ? 'pointer' : 'not-allowed',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    transition: 'all 0.3s',
                    boxShadow: codigoInput.trim() ? '0 8px 24px rgba(245,196,0,0.2)' : 'none',
                  }}
                >
                  {isSaving ? 'Entrando...' : '→ Entrar na Liga'}
                </motion.button>
              </motion.div>
            )}

            {/* ── CRIAR LIGA ── */}
            {activeTab === 'criar' && (
              <motion.div key="criar" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                {!podeCriarLiga ? (
                  /* Gate de XP */
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.5, marginBottom: 8 }}>
                      Recurso bloqueado
                    </div>
                    <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7, marginBottom: 24 }}>
                      Para criar uma liga, você precisa<br />atingir o nível <strong style={{ color: '#F5C400' }}>Fiel (100 XP)</strong>.
                    </p>
                    {perfil && <XPProgressBar xp={perfil.xp} />}
                    <div style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>
                      Faltam <span style={{ color: '#3B82F6' }}>{xpParaFiel} XP</span> para desbloquear.
                    </div>
                    <div style={{ marginTop: 20, padding: '16px', background: '#0f0f0f', borderRadius: 14, border: '1px solid #1a1a1a' }}>
                      <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: 800 }}>Como ganhar XP</div>
                      {[
                        ['Montar escalação', '+10 XP'],
                        ['Acertar placar', '+25 XP'],
                        ['Rodada completa', '+15 XP'],
                      ].map(([acao, xp]) => (
                        <div key={acao} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #111', fontSize: 12, color: '#555' }}>
                          <span>{acao}</span>
                          <span style={{ color: '#22C55E', fontWeight: 800 }}>{xp}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setActiveTab('entrar')}
                      style={{ marginTop: 20, padding: '14px 24px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, color: '#F5C400', fontSize: 12, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                      Entrar via código →
                    </button>
                  </div>
                ) : (
                  /* Formulário de criação */
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: -0.5 }}>
                        Nova Liga
                      </div>
                      <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                        Você já é <span style={{ color: '#F5C400', fontWeight: 800 }}>Fiel</span>. Cria o seu grupo e manda o código pra galera.
                      </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>
                          Nome da Liga *
                        </label>
                        <input
                          value={nomeLiga}
                          onChange={e => setNomeLiga(e.target.value)}
                          placeholder="OS LENDÁRIOS DO TIGRE"
                          maxLength={40}
                          style={{
                            width: '100%',
                            background: '#0f0f0f',
                            border: '1.5px solid #1a1a1a',
                            borderRadius: 14,
                            padding: '14px 18px',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 900,
                            letterSpacing: 0.5,
                            outline: 'none',
                            textTransform: 'uppercase',
                            boxSizing: 'border-box',
                            transition: 'border-color 0.2s',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#F5C400')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                        />
                        <div style={{ fontSize: 10, color: '#333', marginTop: 4, textAlign: 'right' }}>
                          {nomeLiga.length}/40
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>
                          Descrição (opcional)
                        </label>
                        <textarea
                          value={descLiga}
                          onChange={e => setDescLiga(e.target.value)}
                          placeholder="Regras, prêmios ou zoeira da liga..."
                          maxLength={120}
                          rows={3}
                          style={{
                            width: '100%',
                            background: '#0f0f0f',
                            border: '1.5px solid #1a1a1a',
                            borderRadius: 14,
                            padding: '14px 18px',
                            color: '#fff',
                            fontSize: 13,
                            fontWeight: 600,
                            outline: 'none',
                            resize: 'none',
                            boxSizing: 'border-box',
                            lineHeight: 1.6,
                            transition: 'border-color 0.2s',
                            fontFamily: 'inherit',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#F5C400')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                        />
                      </div>
                    </div>

                    {error && (
                      <div style={{ padding: '12px 16px', background: '#1a0808', border: '1px solid #EF4444', borderRadius: 12, color: '#EF4444', fontSize: 12, fontWeight: 700, margin: '12px 0' }}>
                        {error}
                      </div>
                    )}

                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      disabled={!nomeLiga.trim() || isSaving}
                      onClick={handleCriarLiga}
                      style={{
                        marginTop: 20,
                        width: '100%',
                        padding: '18px',
                        background: nomeLiga.trim() && !isSaving ? 'linear-gradient(135deg, #F5C400, #D4A200)' : '#1a1a1a',
                        border: 'none',
                        borderRadius: 16,
                        color: nomeLiga.trim() && !isSaving ? '#000' : '#333',
                        fontSize: 13,
                        fontWeight: 900,
                        cursor: nomeLiga.trim() && !isSaving ? 'pointer' : 'not-allowed',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                        transition: 'all 0.3s',
                        boxShadow: nomeLiga.trim() ? '0 8px 24px rgba(245,196,0,0.2)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                      }}
                    >
                      {isSaving ? (
                        <>
                          <div style={{ width: 16, height: 16, border: '2px solid #00000040', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          Criando...
                        </>
                      ) : (
                        '🏆 Criar minha Liga'
                      )}
                    </motion.button>

                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Ranking da Liga */}
      {ligaDetalhes && (
        <RankingModal
          liga={ligaDetalhes.liga}
          membros={ligaDetalhes.membros}
          viewerUserId={usuarioId}
          onClose={() => setLigaDetalhes(null)}
          onVerPerfil={(id) => {
            setLigaDetalhes(null);
            setPerfilTarget(id);
          }}
        />
      )}

      {/* Modal: Perfil cruzado */}
      {perfilTarget && (
        <TigreFCPerfilPublico
          targetUsuarioId={perfilTarget}
          viewerUsuarioId={usuarioId}
          onClose={() => setPerfilTarget(null)}
        />
      )}
    </>
  );
}
