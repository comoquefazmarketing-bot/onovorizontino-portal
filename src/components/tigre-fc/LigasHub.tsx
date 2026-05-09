'use client';

/**
 * LigasHub v4 — Central de Ligas
 * Funcionalidades: minhas ligas · ligas públicas · entrar via código
 * · criar liga · ranking interno · compartilhar (código + QR + WhatsApp)
 * · chat dentro da liga · perfil cruzado de membros
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import confetti from 'canvas-confetti';
import {
  useLigas,
  type Liga,
  type LigaMembro,
  NIVEL_CORES,
  NIVEL_ICONES,
  PONTOS_PARA_CRIAR_LIGA,
} from '@/hooks/useLigas';
import TigreFCPerfilPublico from '@/components/tigre-fc/TigreFCPerfilPublico';

// ─── Constantes ───────────────────────────────────────────────────────────────

const TIGRE_LOGO =
  'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

const BASE_URL = 'https://onovorizontino.com.br';

// ─── Animações ────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─── XP Progress Bar ──────────────────────────────────────────────────────────

function XPProgressBar({ pts }: { pts: number }) {
  const pct = Math.min(100, (pts / PONTOS_PARA_CRIAR_LIGA) * 100);
  const cor  = pts >= PONTOS_PARA_CRIAR_LIGA ? '#F5C400' : '#3B82F6';
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#555', textTransform: 'uppercase', letterSpacing: 1.5 }}>
          Pontos para criar liga
        </span>
        <span style={{ fontSize: 10, fontWeight: 900, color: cor }}>
          {pts} / {PONTOS_PARA_CRIAR_LIGA}
        </span>
      </div>
      <div style={{ height: 4, background: '#1a1a1a', borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          style={{
            height: '100%',
            background: pts >= PONTOS_PARA_CRIAR_LIGA
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
    <motion.div variants={fadeUp} initial="hidden" animate="visible"
      style={{ textAlign: 'center', padding: '48px 20px' }}>
      <div style={{ fontSize: 52, marginBottom: 16 }}>🐯</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', marginBottom: 8, textTransform: 'uppercase' }}>
        Nenhuma liga ainda
      </div>
      <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 28 }}>
        Cria um grupo e chama a galera,<br />ou entra com o código de um amigo.
      </p>
      <button onClick={onEntrar}
        style={{ padding: '14px 28px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, color: '#F5C400', fontSize: 12, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
        Entrar com código →
      </button>
    </motion.div>
  );
}

// ─── Liga Card (com efeito holográfico ao hover) ──────────────────────────────

function LigaCard({
  liga, posicao, isDono, onClick,
}: {
  liga: Liga; posicao?: number; isDono?: boolean; onClick: () => void;
}) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const mouseX  = useMotionValue(50);
  const mouseY  = useMotionValue(50);
  const sxs     = useSpring(mouseX, { stiffness: 160, damping: 18 });
  const sys     = useSpring(mouseY, { stiffness: 160, damping: 18 });
  const shine   = useMotionTemplate`radial-gradient(circle at ${sxs}% ${sys}%, rgba(245,196,0,0.18) 0%, rgba(245,196,0,0.04) 40%, transparent 65%)`;
  const rotY    = useSpring(useTransform(useMotionValue(0), [-1,1],[-5,5]), { stiffness:200, damping:20 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width  * 100);
    mouseY.set((e.clientY - top)  / height * 100);
  };
  const onLeave = () => { mouseX.set(50); mouseY.set(50); };

  return (
    <motion.button
      ref={cardRef}
      variants={fadeUp}
      whileTap={{ scale: 0.97 }}
      whileHover={{ rotateY: 1.5 }}
      onMouseMove={onMove}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(245,196,0,0.32)';
        e.currentTarget.style.boxShadow   = '0 8px 32px rgba(245,196,0,0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(245,196,0,0.12)';
        e.currentTarget.style.boxShadow   = 'none';
        onLeave();
      }}
      onClick={onClick}
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, #111 0%, #131308 100%)',
        border: '1px solid rgba(245,196,0,0.12)',
        borderRadius: 18, padding: '16px 18px',
        cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14,
        position: 'relative', overflow: 'hidden',
        transition: 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {/* Holographic shine */}
      <motion.div aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit',
        background: shine, pointerEvents: 'none', zIndex: 10, mixBlendMode: 'screen',
      }} />
      {/* Scan lines */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
        zIndex: 9, mixBlendMode: 'overlay', opacity: 0.04,
        background: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 4px)',
      }} />
      <div style={{
        width: 46, height: 46, borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(245,196,0,0.15), rgba(245,196,0,0.05))',
        border: '1px solid rgba(245,196,0,0.2)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 22, flexShrink: 0,
      }}>
        {isDono ? '👑' : '⚽'}
      </div>
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
            <span style={{ fontSize: 10, color: '#555', fontWeight: 700 }}>#{posicao} ranking</span>
          )}
          {liga.is_publica && (
            <span style={{ fontSize: 9, background: '#1a3a1a', color: '#4ade80', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>PÚBLICA</span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#F5C400', letterSpacing: 2, fontFamily: 'monospace' }}>
          {liga.codigo_convite?.toUpperCase()}
        </div>
        <div style={{ fontSize: 8, color: '#333', textTransform: 'uppercase', letterSpacing: 1 }}>código</div>
      </div>
    </motion.button>
  );
}

// ─── Chat dentro da liga ──────────────────────────────────────────────────────

type Mensagem = {
  id: string;
  usuario_id: string;
  texto: string;
  criado_em: string;
  tigre_fc_usuarios?: { apelido: string | null; nome: string; avatar_url: string | null };
};

function LigaChat({
  ligaId, usuarioId, supabase,
}: {
  ligaId: string; usuarioId: string | null; supabase: ReturnType<typeof createBrowserClient>;
}) {
  const [msgs, setMsgs]       = useState<Mensagem[]>([]);
  const [texto, setTexto]     = useState('');
  const [sending, setSending] = useState(false);
  const [errChat, setErrChat] = useState<string | null>(null);
  const [noTable, setNoTable] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const containerRef          = useRef<HTMLDivElement>(null);

  const carregarMsgs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tigre_fc_ligas_mensagens')
        .select('id, usuario_id, texto, criado_em, tigre_fc_usuarios(apelido, nome, avatar_url)')
        .eq('liga_id', ligaId)
        .order('criado_em', { ascending: true })
        .limit(80);

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setNoTable(true);
        } else {
          setErrChat('Erro ao carregar mensagens.');
        }
        return;
      }
      setMsgs((data ?? []) as unknown as Mensagem[]);
    } catch {
      setErrChat('Erro ao carregar mensagens.');
    }
  }, [ligaId, supabase]);

  useEffect(() => {
    carregarMsgs();
  }, [carregarMsgs]);

  useEffect(() => {
    const c = containerRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [msgs]);

  const enviar = async () => {
    if (!texto.trim() || !usuarioId || sending) return;
    setSending(true);
    setErrChat(null);
    try {
      const { error } = await supabase
        .from('tigre_fc_ligas_mensagens')
        .insert({ liga_id: ligaId, usuario_id: usuarioId, texto: texto.trim() });
      if (error) throw error;
      setTexto('');
      await carregarMsgs();
    } catch {
      setErrChat('Não foi possível enviar. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  if (noTable) return (
    <div style={{ padding: '32px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>🔧</div>
      <div style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
        Chat ainda não configurado.<br />
        <span style={{ color: '#444' }}>Execute o SQL do módulo Ligas no Supabase.</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {msgs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#333', fontSize: 13 }}>
            Seja o primeiro a zoar a galera! 🐯
          </div>
        ) : (
          msgs.map(m => {
            const isMe = m.usuario_id === usuarioId;
            const u    = m.tigre_fc_usuarios;
            const nome = u?.apelido ?? u?.nome ?? 'Torcedor';
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: isMe ? '#F5C40030' : '#1a1a1a',
                  border: `1.5px solid ${isMe ? '#F5C40060' : '#222'}`, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: isMe ? '#F5C400' : '#555',
                }}>
                  {u?.avatar_url
                    ? <img src={u.avatar_url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    : nome.charAt(0).toUpperCase()}
                </div>
                <div style={{ maxWidth: '72%' }}>
                  {!isMe && (
                    <div style={{ fontSize: 9, color: '#444', fontWeight: 800, marginBottom: 2, paddingLeft: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {nome}
                    </div>
                  )}
                  <div style={{
                    background: isMe ? 'rgba(245,196,0,0.12)' : '#111',
                    border: `1px solid ${isMe ? 'rgba(245,196,0,0.25)' : '#1a1a1a'}`,
                    borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    padding: '8px 12px',
                    fontSize: 13, color: isMe ? '#fff' : '#ccc', lineHeight: 1.4,
                  }}>
                    {m.texto}
                  </div>
                  <div style={{ fontSize: 9, color: '#333', marginTop: 2, textAlign: isMe ? 'right' : 'left', paddingLeft: isMe ? 0 : 8, paddingRight: isMe ? 8 : 0 }}>
                    {new Date(m.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {errChat && (
        <div style={{ padding: '6px 16px', fontSize: 11, color: '#ef4444', fontWeight: 700, background: '#1a0808' }}>
          {errChat}
        </div>
      )}

      <div style={{ padding: '10px 12px', borderTop: '1px solid #111', display: 'flex', gap: 8 }}>
        <input
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(); } }}
          placeholder={usuarioId ? 'Manda a zoeira...' : 'Faça login para comentar'}
          disabled={!usuarioId}
          maxLength={300}
          style={{
            flex: 1, background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: 10,
            padding: '10px 14px', color: '#fff', fontSize: 13, outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={enviar}
          disabled={!texto.trim() || sending || !usuarioId}
          style={{
            width: 42, height: 42, borderRadius: 10, border: 'none',
            background: texto.trim() && usuarioId ? '#F5C400' : '#1a1a1a',
            color: texto.trim() && usuarioId ? '#000' : '#333',
            fontSize: 18, cursor: texto.trim() && usuarioId ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          {sending ? '…' : '↑'}
        </button>
      </div>
    </div>
  );
}

// ─── Ranking da Liga (Modal bottom-sheet) ─────────────────────────────────────

function RankingModal({
  liga, membros, viewerUserId, supabase, onClose, onVerPerfil, onSair,
}: {
  liga: Liga;
  membros: LigaMembro[];
  viewerUserId: string | null;
  supabase: ReturnType<typeof createBrowserClient>;
  onClose: () => void;
  onVerPerfil: (id: string) => void;
  onSair: () => void;
}) {
  const [tab, setTab]           = useState<'ranking' | 'chat' | 'compartilhar'>('ranking');
  const [copiado, setCopiado]   = useState(false);
  const [copiadoLink, setCopiadoLink] = useState(false);
  const [showQR, setShowQR]     = useState(false);

  const inviteLink = `${BASE_URL}/tigre-fc/ligas?entrar=${liga.codigo_convite}`;
  const qrUrl      = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&bgcolor=F5C400&data=${encodeURIComponent(inviteLink)}`;

  const copiarCodigo = async () => {
    await navigator.clipboard.writeText(liga.codigo_convite ?? '');
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const copiarLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopiadoLink(true);
    setTimeout(() => setCopiadoLink(false), 2000);
  };

  const compartilharWhatsApp = () => {
    const msg = encodeURIComponent(
      `🐯 Entra na minha liga no Tigre FC!\n*${liga.nome}*\nCódigo: *${liga.codigo_convite?.toUpperCase()}*\n${inviteLink}`,
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  const isDonoViewer = liga.dono_id === viewerUserId;
  const medals       = ['🥇', '🥈', '🥉'];

  const TABS = [
    { id: 'ranking' as const,      label: 'Ranking',    icon: '📊' },
    { id: 'chat' as const,         label: 'Chat',       icon: '💬' },
    { id: 'compartilhar' as const, label: 'Compartilhar', icon: '📤' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 600, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          style={{
            width: '100%', maxWidth: 480,
            background: 'linear-gradient(160deg, #090909 0%, #0f0f0a 100%)',
            borderRadius: '24px 24px 0 0', borderTop: '1px solid rgba(245,196,0,0.2)',
            maxHeight: '92vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Linha dourada */}
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(245,196,0,0.5), transparent)' }} />

          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
            <div style={{ width: 36, height: 4, background: '#222', borderRadius: 2 }} />
          </div>

          {/* Header */}
          <div style={{ padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 2 }}>
                {liga.is_publica ? 'Liga Pública' : 'Liga Particular'}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.5, lineHeight: 1 }}>
                {liga.nome}
              </div>
              {liga.descricao && (
                <div style={{ fontSize: 12, color: '#444', marginTop: 3 }}>{liga.descricao}</div>
              )}
            </div>
            <button onClick={onClose}
              style={{ background: '#1a1a1a', border: '1px solid #222', color: '#555', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              ×
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', padding: '0 20px', gap: 0, borderBottom: '1px solid #111' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '8px 4px', background: 'none', border: 'none',
                  borderBottom: tab === t.id ? '2px solid #F5C400' : '2px solid transparent',
                  color: tab === t.id ? '#F5C400' : '#333',
                  fontSize: 10, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase',
                  letterSpacing: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>

          {/* Conteúdo */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence mode="wait">

              {/* ── Ranking ── */}
              {tab === 'ranking' && (
                <motion.div key="ranking" variants={fadeUp} initial="hidden" animate="visible" exit="exit"
                  style={{ flex: 1, overflowY: 'auto', padding: '12px 20px 80px' }}>
                  {membros.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#333', fontSize: 13 }}>
                      Nenhum membro ainda.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {membros.map((membro, i) => {
                        const u        = membro.tigre_fc_usuarios;
                        const nivelCor = NIVEL_CORES[u?.nivel ?? 'Novato'];
                        const isMe     = membro.usuario_id === viewerUserId;
                        const nomePerfil = u?.apelido ?? u?.nome ?? 'Torcedor';

                        return (
                          <motion.button
                            key={membro.usuario_id}
                            initial={{ opacity: 0, x: -10, scale: 0.95 }}
                            animate={{
                              opacity: i === 0 ? 1 : Math.max(0.5, 1 - i * 0.1),
                              x: 0,
                              scale: i === 0 ? 1 : Math.max(0.94, 1 - i * 0.015),
                            }}
                            transition={{ delay: i * 0.045, type: 'spring', stiffness: 280, damping: 22 }}
                            whileHover={{ scale: 1.01, opacity: 1 }}
                            onClick={() => onVerPerfil(membro.usuario_id)}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                              background: isMe ? 'rgba(245,196,0,0.05)' : 'transparent',
                              border: isMe ? '1px solid rgba(245,196,0,0.15)' : '1px solid transparent',
                              borderRadius: 12, cursor: 'pointer', textAlign: 'left', width: '100%',
                            }}
                          >
                            {/* Posição */}
                            <div style={{ width: 24, textAlign: 'center', flexShrink: 0 }}>
                              {i < 3
                                ? <span style={{ fontSize: 16 }}>{medals[i]}</span>
                                : <span style={{ fontSize: 12, fontWeight: 900, color: '#333' }}>{i + 1}</span>}
                            </div>

                            {/* Avatar */}
                            <div style={{
                              width: 36, height: 36, borderRadius: '50%',
                              background: `${nivelCor}20`, border: `1.5px solid ${nivelCor}`,
                              overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {u?.avatar_url
                                ? <img src={u.avatar_url} alt={nomePerfil} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : <span style={{ fontSize: 14 }}>{NIVEL_ICONES[u?.nivel ?? 'Novato']}</span>}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: 12, fontWeight: 900, color: isMe ? '#F5C400' : '#fff', textTransform: 'uppercase', letterSpacing: -0.2, lineHeight: 1 }}>
                                {nomePerfil}
                                {isMe && <span style={{ color: '#555', fontSize: 9, fontWeight: 700, marginLeft: 6 }}>• você</span>}
                                {membro.usuario_id === liga.dono_id && <span style={{ fontSize: 10, marginLeft: 4 }}>👑</span>}
                              </div>
                              <div style={{ display: 'flex', gap: 8, marginTop: 3 }}>
                                <span style={{ fontSize: 9, color: '#444', fontWeight: 700 }}>{membro.jogos}J</span>
                                <span style={{ fontSize: 9, color: '#22C55E', fontWeight: 700 }}>{membro.acertos}✓</span>
                              </div>
                            </div>

                            {/* Pontos na liga */}
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <div style={{ fontSize: 20, fontWeight: 900, color: '#F5C400', fontStyle: 'italic', lineHeight: 1 }}>
                                {membro.pontos}
                              </div>
                              <div style={{ fontSize: 8, color: '#333', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>pts liga</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Sair da liga */}
                  {!isDonoViewer && viewerUserId && (
                    <button onClick={onSair}
                      style={{ marginTop: 24, width: '100%', padding: '12px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: 12, color: '#444', fontSize: 11, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Sair da liga
                    </button>
                  )}
                </motion.div>
              )}

              {/* ── Chat ── */}
              {tab === 'chat' && (
                <motion.div key="chat" variants={fadeUp} initial="hidden" animate="visible" exit="exit"
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <LigaChat ligaId={liga.id} usuarioId={viewerUserId} supabase={supabase} />
                </motion.div>
              )}

              {/* ── Compartilhar ── */}
              {tab === 'compartilhar' && (
                <motion.div key="compartilhar" variants={fadeUp} initial="hidden" animate="visible" exit="exit"
                  style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>

                  {/* Código */}
                  <div>
                    <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 800, marginBottom: 8 }}>Código</div>
                    <button onClick={copiarCodigo}
                      style={{
                        width: '100%', padding: '16px', background: '#111', border: '1px solid #222', borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
                      }}>
                      <span style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 900, color: '#F5C400', letterSpacing: 4 }}>
                        {liga.codigo_convite?.toUpperCase()}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: copiado ? '#22C55E' : '#555' }}>
                        {copiado ? '✓ Copiado' : '📋 Copiar'}
                      </span>
                    </button>
                  </div>

                  {/* Link */}
                  <div>
                    <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 800, marginBottom: 8 }}>Link de convite</div>
                    <button onClick={copiarLink}
                      style={{
                        width: '100%', padding: '12px 16px', background: '#111', border: '1px solid #222', borderRadius: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: 12,
                      }}>
                      <span style={{ fontSize: 11, color: '#555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, textAlign: 'left' }}>
                        {inviteLink}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: copiadoLink ? '#22C55E' : '#555', flexShrink: 0 }}>
                        {copiadoLink ? '✓' : '📋'}
                      </span>
                    </button>
                  </div>

                  {/* WhatsApp */}
                  <button onClick={compartilharWhatsApp}
                    style={{ width: '100%', padding: '14px', background: '#128C7E', border: 'none', borderRadius: 14, color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                    📲 Compartilhar no WhatsApp
                  </button>

                  {/* QR Code */}
                  <div>
                    <button onClick={() => setShowQR(v => !v)}
                      style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid #222', borderRadius: 12, color: '#555', fontSize: 11, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                      {showQR ? '▲ Esconder QR Code' : '▼ Mostrar QR Code'}
                    </button>
                    <AnimatePresence>
                      {showQR && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', marginTop: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <div style={{ background: '#F5C400', padding: 12, borderRadius: 16 }}>
                            <img src={qrUrl} alt="QR Code de convite" width={180} height={180} style={{ display: 'block' }} />
                          </div>
                          <div style={{ fontSize: 11, color: '#444', textAlign: 'center' }}>
                            Escaneie para entrar na liga
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface LigasHubProps {
  usuarioId: string | null;
  initialCode?: string;
}

type TabView = 'minhas' | 'publicas' | 'entrar' | 'criar';

export default function LigasHub({ usuarioId, initialCode }: LigasHubProps) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    ),
  );

  const {
    perfil, minhasLigas, isLoading, error, podeCriarLiga, xpParaFiel,
    criarLiga, entrarNaLiga, sairDaLiga, getRankingLiga,
  } = useLigas(usuarioId);

  const [activeTab, setActiveTab]       = useState<TabView>(initialCode ? 'entrar' : 'minhas');
  const [ligaDetalhes, setLigaDetalhes] = useState<{ liga: Liga; membros: LigaMembro[] } | null>(null);
  const [perfilTarget, setPerfilTarget] = useState<string | null>(null);

  const [nomeLiga, setNomeLiga]       = useState('');
  const [descLiga, setDescLiga]       = useState('');
  const [isPublica, setIsPublica]     = useState(false);
  const [codigoInput, setCodigoInput] = useState(initialCode ?? '');
  const [isSaving, setIsSaving]       = useState(false);
  const [successMsg, setSuccessMsg]   = useState<string | null>(null);

  // Ligas públicas
  const [ligasPublicas, setLigasPublicas] = useState<Liga[]>([]);
  const [loadingPublicas, setLoadingPublicas] = useState(false);
  const [buscaPublica, setBuscaPublica]       = useState('');

  const carregarPublicas = useCallback(async () => {
    setLoadingPublicas(true);
    const { data } = await supabase
      .from('tigre_fc_ligas')
      .select('id, nome, descricao, codigo_convite, dono_id, max_membros, is_publica, temporada, ativa, created_at')
      .eq('is_publica', true)
      .eq('ativa', true)
      .order('created_at', { ascending: false })
      .limit(30);
    setLigasPublicas((data ?? []) as Liga[]);
    setLoadingPublicas(false);
  }, [supabase]);

  useEffect(() => {
    if (activeTab === 'publicas') carregarPublicas();
  }, [activeTab, carregarPublicas]);

  const abrirLiga = useCallback(async (liga: Liga) => {
    const membros = await getRankingLiga(liga.id);
    setLigaDetalhes({ liga, membros });
  }, [getRankingLiga]);

  const handleCriarLiga = useCallback(async () => {
    if (!nomeLiga.trim()) return;
    setIsSaving(true);
    try {
      const liga = await criarLiga(nomeLiga.trim(), descLiga.trim() || undefined, isPublica);
      if (liga) {
        confetti({ particleCount: 160, spread: 80, origin: { y: 0.55 }, colors: ['#F5C400', '#fff', '#EF4444'] });
        setSuccessMsg(`🏆 Liga "${liga.nome}" criada!`);
        setNomeLiga(''); setDescLiga(''); setIsPublica(false);
        setActiveTab('minhas');
        setTimeout(() => setSuccessMsg(null), 6000);
      }
    } finally {
      setIsSaving(false);
    }
  }, [criarLiga, nomeLiga, descLiga, isPublica]);

  const handleEntrar = useCallback(async () => {
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

  const handleSair = useCallback(async () => {
    if (!ligaDetalhes) return;
    if (!window.confirm(`Sair de "${ligaDetalhes.liga.nome}"?`)) return;
    const result = await sairDaLiga(ligaDetalhes.liga.id);
    if (result.success) {
      setLigaDetalhes(null);
      setSuccessMsg('Você saiu da liga.');
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  }, [ligaDetalhes, sairDaLiga]);

  const ligasPublicasFiltradas = ligasPublicas.filter(l =>
    !buscaPublica.trim() || l.nome.toLowerCase().includes(buscaPublica.toLowerCase()),
  );

  const TABS: { id: TabView; label: string; icon: string }[] = [
    { id: 'minhas',   label: 'Minhas',   icon: '🏆' },
    { id: 'publicas', label: 'Públicas', icon: '🌐' },
    { id: 'entrar',   label: 'Entrar',   icon: '🔑' },
    { id: 'criar',    label: 'Criar',    icon: '➕' },
  ];

  return (
    <>
      {/* Toast de sucesso */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
              zIndex: 900, background: '#0a1f0a', border: '1px solid #22C55E', color: '#22C55E',
              padding: '12px 20px', borderRadius: 14, fontSize: 13, fontWeight: 800, whiteSpace: 'nowrap',
              boxShadow: '0 8px 24px rgba(34,197,94,0.2)',
            }}>
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ minHeight: '100%', background: '#080808', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

        {/* Header */}
        <div style={{
          padding: '20px 20px 0',
          background: 'linear-gradient(180deg, rgba(245,196,0,0.04) 0%, transparent 100%)',
          borderBottom: '1px solid rgba(245,196,0,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
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
                <div style={{ fontSize: 10, color: '#333' }}>{perfil.pontos_total} pts</div>
              </div>
            )}
          </div>

          {perfil && !podeCriarLiga && (
            <XPProgressBar pts={perfil.pontos_total} />
          )}

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, marginBottom: -1 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1, padding: '10px 2px', background: 'none', border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #F5C400' : '2px solid transparent',
                  color: activeTab === tab.id ? '#F5C400' : '#333',
                  fontSize: 9, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase',
                  letterSpacing: 0.5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                <span style={{ fontSize: 16 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo */}
        <div style={{ padding: '20px 20px 100px' }}>
          <AnimatePresence mode="wait">

            {/* ── MINHAS LIGAS ── */}
            {activeTab === 'minhas' && (
              <motion.div key="minhas" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                {isLoading ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#333', fontSize: 13, fontWeight: 700 }}>
                    Carregando ligas...
                  </div>
                ) : minhasLigas.length === 0 ? (
                  <EmptyState onEntrar={() => setActiveTab('entrar')} />
                ) : (
                  <motion.div initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {minhasLigas.map(liga => (
                      <LigaCard
                        key={liga.id} liga={liga}
                        isDono={liga.dono_id === usuarioId}
                        onClick={() => abrirLiga(liga)}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── LIGAS PÚBLICAS ── */}
            {activeTab === 'publicas' && (
              <motion.div key="publicas" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                <div style={{ marginBottom: 16 }}>
                  <input
                    value={buscaPublica}
                    onChange={e => setBuscaPublica(e.target.value)}
                    placeholder="🔍 Buscar liga..."
                    style={{
                      width: '100%', background: '#0f0f0f', border: '1.5px solid #1a1a1a', borderRadius: 12,
                      padding: '12px 16px', color: '#fff', fontSize: 14, outline: 'none',
                      boxSizing: 'border-box', transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#F5C400')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                  />
                </div>

                {loadingPublicas ? (
                  <div style={{ textAlign: 'center', padding: '48px 0', color: '#333', fontSize: 13, fontWeight: 700 }}>
                    Buscando ligas públicas...
                  </div>
                ) : ligasPublicasFiltradas.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🌐</div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', marginBottom: 8 }}>
                      {buscaPublica ? 'Nenhuma liga encontrada' : 'Nenhuma liga pública'}
                    </div>
                    <p style={{ fontSize: 13, color: '#555', lineHeight: 1.6 }}>
                      Crie uma liga pública para aparecer aqui!
                    </p>
                  </div>
                ) : (
                  <motion.div initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
                    style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {ligasPublicasFiltradas.map(liga => (
                      <motion.div key={liga.id} variants={fadeUp}
                        style={{
                          background: '#111', border: '1px solid rgba(245,196,0,0.1)',
                          borderRadius: 18, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14,
                        }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', textTransform: 'uppercase', marginBottom: 3 }}>
                            {liga.nome}
                          </div>
                          {liga.descricao && (
                            <div style={{ fontSize: 11, color: '#444', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {liga.descricao}
                            </div>
                          )}
                          <span style={{ fontSize: 9, background: '#1a3a1a', color: '#4ade80', padding: '2px 8px', borderRadius: 4, fontWeight: 800 }}>PÚBLICA</span>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            setCodigoInput(liga.codigo_convite);
                            setActiveTab('entrar');
                          }}
                          style={{
                            padding: '10px 16px', background: 'linear-gradient(135deg, #F5C400, #D4A200)',
                            border: 'none', borderRadius: 10, color: '#000', fontSize: 11,
                            fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0,
                          }}>
                          Entrar →
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* ── ENTRAR ── */}
            {activeTab === 'entrar' && (
              <motion.div key="entrar" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                <div style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: -0.5 }}>
                    Entra no grupo
                  </div>
                  <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                    Cole o código de convite ou o link que alguém te mandou.
                  </p>
                </div>

                <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>
                  Código da Liga
                </label>
                <input
                  value={codigoInput}
                  onChange={e => setCodigoInput(e.target.value.toUpperCase())}
                  placeholder="ABC12345"
                  maxLength={12}
                  style={{
                    width: '100%', background: '#0f0f0f', border: '1.5px solid #1a1a1a', borderRadius: 14,
                    padding: '16px 20px', color: '#F5C400', fontSize: 22, fontWeight: 900, letterSpacing: 4,
                    fontFamily: 'monospace', outline: 'none', textAlign: 'center', boxSizing: 'border-box',
                    marginBottom: 12, transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#F5C400')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                  onKeyDown={e => { if (e.key === 'Enter') handleEntrar(); }}
                />

                {error && (
                  <div style={{ padding: '12px 16px', background: '#1a0808', border: '1px solid #EF4444', borderRadius: 12, color: '#EF4444', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                    {error}
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={!codigoInput.trim() || isSaving}
                  onClick={handleEntrar}
                  style={{
                    width: '100%', padding: '18px',
                    background: codigoInput.trim() && !isSaving ? 'linear-gradient(135deg, #F5C400, #D4A200)' : '#1a1a1a',
                    border: 'none', borderRadius: 16,
                    color: codigoInput.trim() && !isSaving ? '#000' : '#333',
                    fontSize: 13, fontWeight: 900, cursor: codigoInput.trim() && !isSaving ? 'pointer' : 'not-allowed',
                    textTransform: 'uppercase', letterSpacing: 1, transition: 'all 0.3s',
                    boxShadow: codigoInput.trim() ? '0 8px 24px rgba(245,196,0,0.2)' : 'none',
                  }}>
                  {isSaving ? 'Entrando...' : '→ Entrar na Liga'}
                </motion.button>
              </motion.div>
            )}

            {/* ── CRIAR ── */}
            {activeTab === 'criar' && (
              <motion.div key="criar" variants={fadeUp} initial="hidden" animate="visible" exit="exit">
                {!podeCriarLiga ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: 52, marginBottom: 16 }}>🔒</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: -0.5, marginBottom: 8 }}>
                      Recurso bloqueado
                    </div>
                    <p style={{ fontSize: 13, color: '#444', lineHeight: 1.7, marginBottom: 24 }}>
                      Para criar uma liga, você precisa<br />ter pelo menos <strong style={{ color: '#F5C400' }}>{PONTOS_PARA_CRIAR_LIGA} pontos</strong>.
                    </p>
                    {perfil && <XPProgressBar pts={perfil.pontos_total} />}
                    <div style={{ fontSize: 12, color: '#333', fontWeight: 700 }}>
                      Faltam <span style={{ color: '#3B82F6' }}>{xpParaFiel} pontos</span> para desbloquear.
                    </div>
                    <div style={{ marginTop: 20, padding: '16px', background: '#0f0f0f', borderRadius: 14, border: '1px solid #1a1a1a' }}>
                      <div style={{ fontSize: 10, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, fontWeight: 800 }}>Como ganhar pontos</div>
                      {[['Montar escalação', '+10'], ['Acertar resultado', '+30'], ['Acertar placar exato', '+50']].map(([a, p]) => (
                        <div key={a} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #111', fontSize: 12, color: '#555' }}>
                          <span>{a}</span>
                          <span style={{ color: '#22C55E', fontWeight: 800 }}>{p} pts</span>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setActiveTab('entrar')}
                      style={{ marginTop: 20, padding: '14px 24px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 14, color: '#F5C400', fontSize: 12, fontWeight: 900, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: 1 }}>
                      Entrar via código →
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: 24 }}>
                      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 6, textTransform: 'uppercase', letterSpacing: -0.5 }}>
                        Nova Liga
                      </div>
                      <p style={{ fontSize: 13, color: '#444', lineHeight: 1.6 }}>
                        Cria o seu grupo e manda o código pra galera.
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
                            width: '100%', background: '#0f0f0f', border: '1.5px solid #1a1a1a', borderRadius: 14,
                            padding: '14px 18px', color: '#fff', fontSize: 14, fontWeight: 900, letterSpacing: 0.5,
                            outline: 'none', textTransform: 'uppercase', boxSizing: 'border-box', transition: 'border-color 0.2s',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#F5C400')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                        />
                        <div style={{ fontSize: 10, color: '#333', marginTop: 4, textAlign: 'right' }}>{nomeLiga.length}/40</div>
                      </div>

                      <div>
                        <label style={{ fontSize: 10, fontWeight: 800, color: '#444', textTransform: 'uppercase', letterSpacing: 1.5, display: 'block', marginBottom: 8 }}>
                          Descrição (opcional)
                        </label>
                        <textarea
                          value={descLiga}
                          onChange={e => setDescLiga(e.target.value)}
                          placeholder="Regras, prêmios ou zoeira..."
                          maxLength={120}
                          rows={3}
                          style={{
                            width: '100%', background: '#0f0f0f', border: '1.5px solid #1a1a1a', borderRadius: 14,
                            padding: '14px 18px', color: '#fff', fontSize: 13, fontWeight: 600, outline: 'none',
                            resize: 'none', boxSizing: 'border-box', lineHeight: 1.6, transition: 'border-color 0.2s', fontFamily: 'inherit',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = '#F5C400')}
                          onBlur={e => (e.currentTarget.style.borderColor = '#1a1a1a')}
                        />
                      </div>

                      {/* Toggle pública */}
                      <button
                        onClick={() => setIsPublica(v => !v)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                          background: isPublica ? 'rgba(74,222,128,0.08)' : '#0f0f0f',
                          border: `1.5px solid ${isPublica ? '#4ade80' : '#1a1a1a'}`,
                          borderRadius: 14, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        }}>
                        <div style={{
                          width: 20, height: 20, borderRadius: 4, border: `2px solid ${isPublica ? '#4ade80' : '#333'}`,
                          background: isPublica ? '#4ade80' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {isPublica && <span style={{ color: '#000', fontSize: 12, fontWeight: 900 }}>✓</span>}
                        </div>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 900, color: isPublica ? '#4ade80' : '#555', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            Liga Pública 🌐
                          </div>
                          <div style={{ fontSize: 10, color: '#444', marginTop: 2 }}>
                            Qualquer pessoa pode encontrar e entrar
                          </div>
                        </div>
                      </button>
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
                        marginTop: 20, width: '100%', padding: '18px',
                        background: nomeLiga.trim() && !isSaving ? 'linear-gradient(135deg, #F5C400, #D4A200)' : '#1a1a1a',
                        border: 'none', borderRadius: 16,
                        color: nomeLiga.trim() && !isSaving ? '#000' : '#333',
                        fontSize: 13, fontWeight: 900,
                        cursor: nomeLiga.trim() && !isSaving ? 'pointer' : 'not-allowed',
                        textTransform: 'uppercase', letterSpacing: 1, transition: 'all 0.3s',
                        boxShadow: nomeLiga.trim() ? '0 8px 24px rgba(245,196,0,0.2)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      }}>
                      {isSaving ? (
                        <>
                          <div style={{ width: 16, height: 16, border: '2px solid #00000040', borderTop: '2px solid #000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                          Criando...
                        </>
                      ) : '🏆 Criar minha Liga'}
                    </motion.button>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Modal de detalhes da liga */}
      {ligaDetalhes && (
        <RankingModal
          liga={ligaDetalhes.liga}
          membros={ligaDetalhes.membros}
          viewerUserId={usuarioId}
          supabase={supabase}
          onClose={() => setLigaDetalhes(null)}
          onVerPerfil={id => { setLigaDetalhes(null); setPerfilTarget(id); }}
          onSair={handleSair}
        />
      )}

      {/* Modal de perfil cruzado */}
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
