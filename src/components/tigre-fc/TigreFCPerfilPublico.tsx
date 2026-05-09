'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const GOLD   = '#F5C400';
const CYAN   = '#00F3FF';
const PATA   = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/GARRA%20LOGO.png';
const BASE_S = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/JOGADORES/';
const FONT   = "'Barlow Condensed', system-ui, sans-serif";

// ── Formações — mesmas chaves do EscalacaoFormacao ─────────
const FORMATIONS: Record<string, { id: string; x: number; y: number }[]> = {
  '4-3-3':   [
    { id:'gk', x:50,y:85 }, { id:'lb', x:15,y:62 }, { id:'cb1',x:38,y:70 }, { id:'cb2',x:62,y:70 }, { id:'rb', x:85,y:62 },
    { id:'m1', x:50,y:48 }, { id:'m2', x:30,y:42 }, { id:'m3', x:70,y:42 },
    { id:'st', x:50,y:15 }, { id:'lw', x:22,y:22 }, { id:'rw', x:78,y:22 },
  ],
  '4-4-2':   [
    { id:'gk', x:50,y:85 }, { id:'lb', x:15,y:62 }, { id:'cb1',x:38,y:70 }, { id:'cb2',x:62,y:70 }, { id:'rb', x:85,y:62 },
    { id:'m1', x:35,y:45 }, { id:'m2', x:65,y:45 }, { id:'m3', x:15,y:38 }, { id:'m4', x:85,y:38 },
    { id:'st1',x:40,y:18 }, { id:'st2',x:60,y:18 },
  ],
  '3-5-2':   [
    { id:'gk', x:50,y:85 }, { id:'cb1',x:30,y:70 }, { id:'cb2',x:50,y:73 }, { id:'cb3',x:70,y:70 },
    { id:'lm', x:15,y:45 }, { id:'rm', x:85,y:45 }, { id:'m1', x:35,y:50 }, { id:'m2', x:65,y:50 }, { id:'am', x:50,y:32 },
    { id:'st1',x:40,y:15 }, { id:'st2',x:60,y:15 },
  ],
  '4-5-1':   [
    { id:'gk', x:50,y:85 }, { id:'lb', x:15,y:62 }, { id:'cb1',x:38,y:70 }, { id:'cb2',x:62,y:70 }, { id:'rb', x:85,y:62 },
    { id:'m1', x:30,y:48 }, { id:'m2', x:50,y:48 }, { id:'m3', x:70,y:48 }, { id:'am1',x:35,y:30 }, { id:'am2',x:65,y:30 },
    { id:'st', x:50,y:15 },
  ],
  '4-2-3-1': [
    { id:'gk', x:50,y:85 }, { id:'lb', x:15,y:62 }, { id:'cb1',x:38,y:70 }, { id:'cb2',x:62,y:70 }, { id:'rb', x:85,y:62 },
    { id:'v1', x:40,y:52 }, { id:'v2', x:60,y:52 }, { id:'am', x:50,y:35 },
    { id:'lw', x:20,y:28 }, { id:'rw', x:80,y:28 }, { id:'st', x:50,y:12 },
  ],
  '5-3-2':   [
    { id:'gk', x:50,y:85 }, { id:'lb', x:12,y:52 }, { id:'cb1',x:30,y:70 }, { id:'cb2',x:50,y:73 }, { id:'cb3',x:70,y:70 }, { id:'rb', x:88,y:52 },
    { id:'m1', x:50,y:48 }, { id:'m2', x:30,y:40 }, { id:'m3', x:70,y:40 },
    { id:'st1',x:42,y:18 }, { id:'st2',x:58,y:18 },
  ],
};

// ── Jogadores (mapa id→dados) ───────────────────────────────
const PLAYERS_MAP: Record<number, { short: string; pos: string; foto: string }> = {
  23:  { short:'JORDI',      pos:'GOL', foto:'JORDI.jpg.webp' },
  1:   { short:'CÉSAR',      pos:'GOL', foto:'CESAR-AUGUSTO.jpg.webp' },
  22:  { short:'SCAPIN',     pos:'GOL', foto:'JOAO-SCAPIN.jpg.webp' },
  62:  { short:'LUCAS',      pos:'GOL', foto:'LUCAS-RIBEIRO.jpg.webp' },
  101: { short:'P.HENRIQUE', pos:'GOL', foto:'PAULO-HENRIQUE.jpg.webp' },
  8:   { short:'PATRICK',    pos:'ZAG', foto:'PATRICK.jpg.webp' },
  38:  { short:'R.PALM',     pos:'ZAG', foto:'RENATO-PALM.jpg.webp' },
  34:  { short:'BROCK',      pos:'ZAG', foto:'EDUARDO-BROCK.jpg.webp' },
  66:  { short:'ALVARÍÑO',   pos:'ZAG', foto:'IVAN-ALVARINO.jpg.webp' },
  6:   { short:'CARLINHOS',  pos:'ZAG', foto:'CARLINHOS.jpg.webp' },
  3:   { short:'DANTAS',     pos:'ZAG', foto:'DANTAS.jpg.webp' },
  102: { short:'ARTHUR',     pos:'ZAG', foto:'ARTHUR-BARBOSA.jpg.webp' },
  103: { short:'ANTONY',     pos:'ZAG', foto:'ANTONY.jpg.webp' },
  104: { short:'ALEMÃO',     pos:'ZAG', foto:'ALEMAO.jpg.webp' },
  9:   { short:'SANDER',     pos:'LAT', foto:'SANDER.jpg.webp' },
  28:  { short:'MAYKON',     pos:'LAT', foto:'MAYKON-JESUS.jpg.webp' },
  27:  { short:'CASTRILLÓN', pos:'LAT', foto:'NILSON-CASTRILLON.jpg.webp' },
  75:  { short:'LORA',       pos:'LAT', foto:'LORA.jpg.webp' },
  105: { short:'ESQUERDA',   pos:'LAT', foto:'CARLOS-ESQUERDA.jpg.webp' },
  41:  { short:'OYAMA',      pos:'VOL', foto:'LUIS-OYAMA.jpg.webp' },
  46:  { short:'MARLON',     pos:'VOL', foto:'MARLON.jpg.webp' },
  40:  { short:'NALDI',      pos:'VOL', foto:'LEO-NALDI.jpg.webp' },
  106: { short:'G.BAHIA',    pos:'VOL', foto:'GABRIEL-BAHIA.jpg.webp' },
  47:  { short:'BIANQUI',    pos:'MEI', foto:'MATHEUS-BIANQUI.jpg.webp' },
  10:  { short:'RÔMULO',     pos:'MEI', foto:'ROMULO.jpg.webp' },
  12:  { short:'JUNINHO',    pos:'MEI', foto:'JUNINHO.jpg.webp' },
  17:  { short:'TAVINHO',    pos:'MEI', foto:'TAVINHO.jpg.webp' },
  86:  { short:'TITI ORTÍZ', pos:'MEI', foto:'TITI-ORTIZ.jpg.webp' },
  13:  { short:'D.GALO',     pos:'MEI', foto:'DIEGO-GALO.jpg.webp' },
  107: { short:'G.CORREIA',  pos:'MEI', foto:'GABRIEL-CORREIA.jpg.webp' },
  108: { short:'L.GABRIEL',  pos:'MEI', foto:'LUIZ-GABRIEL.jpg.webp' },
  109: { short:'HECTOR',     pos:'MEI', foto:'HECTOR-BIANCHI.jpg.webp' },
  110: { short:'CONTIERO',   pos:'MEI', foto:'MIGUEL-CONTIERO.jpg.webp' },
  111: { short:'NOGUEIRA',   pos:'MEI', foto:'NOGUEIRA.jpg.webp' },
  15:  { short:'ROBSON',     pos:'ATA', foto:'ROBSON.jpg.webp' },
  59:  { short:'V.PAIVA',    pos:'ATA', foto:'VINICIUS-PAIVA.jpg.webp' },
  57:  { short:'RONALD',     pos:'ATA', foto:'RONALD-BARCELLOS.jpg.webp' },
  55:  { short:'CARECA',     pos:'ATA', foto:'NICOLAS-CARECA.jpg.webp' },
  50:  { short:'CARLÃO',     pos:'ATA', foto:'CARLAO.jpg.webp' },
  52:  { short:'HÉLIO',      pos:'ATA', foto:'HELIO-BORGES.jpg.webp' },
  53:  { short:'JARDIEL',    pos:'ATA', foto:'JARDIEL.jpg.webp' },
  112: { short:'D.MATHIAS',  pos:'ATA', foto:'DIEGO-MATHIAS.jpg.webp' },
  113: { short:'J.KAUÊ',     pos:'ATA', foto:'JHONES-KAUE.jpg.webp' },
};

const POS_COLOR: Record<string, string> = {
  GOL:'#F5C400', ZAG:'#3B82F6', LAT:'#06B6D4', VOL:'#8B5CF6', MEI:'#22C55E', ATA:'#EF4444',
};

function fotoUrl(foto: string) {
  return `${BASE_S}${encodeURIComponent(foto)}`;
}

// ── Campo visual ────────────────────────────────────────────
function CampoVisual({
  formacao, slots, capitaoId, heroiId,
}: {
  formacao: string;
  slots: Record<string, { id: number } | null>;
  capitaoId?: number | null;
  heroiId?: number | null;
}) {
  const positions = FORMATIONS[formacao] ?? FORMATIONS['4-3-3'];
  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio:'7/10', background:'#0a1a0a' }}>
      {/* Gramado */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 143" preserveAspectRatio="none">
        <rect width="100" height="143" fill="none" stroke="#4ade80" strokeWidth="0.5"/>
        <line x1="0" y1="71.5" x2="100" y2="71.5" stroke="#4ade80" strokeWidth="0.4"/>
        <circle cx="50" cy="71.5" r="12" fill="none" stroke="#4ade80" strokeWidth="0.4"/>
        <rect x="20" y="0" width="60" height="22" fill="none" stroke="#4ade80" strokeWidth="0.4"/>
        <rect x="20" y="121" width="60" height="22" fill="none" stroke="#4ade80" strokeWidth="0.4"/>
        <rect x="35" y="0" width="30" height="10" fill="none" stroke="#4ade80" strokeWidth="0.4"/>
        <rect x="35" y="133" width="30" height="10" fill="none" stroke="#4ade80" strokeWidth="0.4"/>
      </svg>

      {positions.map(pos => {
        const slotData = slots[pos.id];
        const player   = slotData ? PLAYERS_MAP[slotData.id] : null;
        const isCap    = slotData?.id === capitaoId;
        const isHero   = slotData?.id === heroiId;
        const posColor = player ? POS_COLOR[player.pos] ?? '#fff' : 'rgba(255,255,255,0.2)';

        return (
          <div key={pos.id} className="absolute flex flex-col items-center"
            style={{ left:`${pos.x}%`, top:`${pos.y}%`, transform:'translate(-50%,-50%)' }}>
            {player ? (
              <div className="flex flex-col items-center gap-0.5">
                <div className="relative">
                  {(isCap || isHero) && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black z-10"
                      style={{ background: isCap ? GOLD : CYAN, color:'#000' }}>
                      {isCap ? 'C' : 'H'}
                    </div>
                  )}
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden"
                    style={{ border:`2px solid ${posColor}`, boxShadow: isCap ? `0 0 8px ${GOLD}` : isHero ? `0 0 8px ${CYAN}` : 'none' }}>
                    <img src={fotoUrl(player.foto)} alt={player.short}
                      className="w-full h-full object-cover" style={{ objectPosition:'85% center' }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }} />
                  </div>
                </div>
                <div className="text-[7px] sm:text-[8px] font-black text-white text-center leading-none px-0.5 rounded"
                  style={{ background:'rgba(0,0,0,0.75)', maxWidth:36, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {player.short}
                </div>
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center"
                style={{ background:'rgba(255,255,255,0.04)' }}>
                <span className="text-[7px] text-white/25 font-bold">{pos.id.toUpperCase().slice(0,2)}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Cornetar modal ──────────────────────────────────────────
function CornetarModal({
  targetNome, viewerGoogleId, onClose,
}: { targetNome: string; viewerGoogleId: string; onClose: () => void }) {
  const [txt, setTxt]       = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]     = useState(false);
  const [erro, setErro]     = useState('');

  const enviar = async () => {
    const trimmed = txt.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setErro('');

    const mensagem = `🌽 @${targetNome} ${trimmed}`;
    const { data, error } = await supabase.rpc('fn_enviar_mensagem_chat', {
      p_google_id: viewerGoogleId,
      p_mensagem: mensagem,
      p_tipo: 'texto',
    });

    setSending(false);
    if (error || data?.error) {
      const code = data?.error ?? 'erro';
      setErro(
        code === 'nivel_insuficiente' ? 'Você precisa ter mais nível pra cornetar 😅' :
        code === 'rate_limit'         ? 'Devagar! Espera alguns segundos.' :
        code === 'usuario_banido'     ? 'Você está banido do vestiário.' :
        'Erro ao enviar corneta. Tente novamente.'
      );
      return;
    }
    setSent(true);
  };

  return (
    <motion.div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }}
      onClick={onClose} initial={{ opacity:0 }} animate={{ opacity:1 }}>
      <motion.div className="w-full max-w-sm rounded-2xl p-5"
        style={{ background:'#111', border:`1px solid rgba(245,196,0,0.3)`, fontFamily:FONT }}
        onClick={e => e.stopPropagation()}
        initial={{ y:40, opacity:0 }} animate={{ y:0, opacity:1 }}>

        {sent ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🌽</div>
            <div className="text-white text-xl font-black italic">CORNETA ENVIADA!</div>
            <div className="text-zinc-400 text-sm mt-1">vai no vestiário ver a reação 😂</div>
            <button onClick={onClose} className="mt-4 w-full py-3 rounded-xl font-black text-xs tracking-widest uppercase"
              style={{ background: GOLD, color:'#000' }}>
              FECHAR
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌽</span>
              <div>
                <div className="text-white font-black text-base uppercase italic">Cornetar</div>
                <div className="text-zinc-400 text-xs font-bold">@{targetNome}</div>
              </div>
            </div>

            <textarea
              value={txt} onChange={e => setTxt(e.target.value.slice(0,100))}
              placeholder={`Diz o que acha do time de @${targetNome}... 😂`}
              rows={3} autoFocus
              className="w-full resize-none rounded-xl px-3 py-2 text-sm text-white outline-none"
              style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                fontFamily:FONT, fontSize:13 }}
            />
            <div className="text-right text-[10px] text-zinc-600 mt-1 mb-3">{txt.length}/100</div>

            {erro && <div className="text-red-400 text-xs mb-3 font-bold">{erro}</div>}

            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 py-3 rounded-xl text-xs font-black tracking-wider uppercase text-zinc-400"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                Cancelar
              </button>
              <button onClick={enviar} disabled={!txt.trim() || sending}
                className="flex-[2] py-3 rounded-xl font-black text-sm tracking-wider uppercase transition-all disabled:opacity-40"
                style={{ background: GOLD, color:'#000' }}>
                {sending ? 'Enviando...' : '🌽 Mandar Corneta'}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Props ───────────────────────────────────────────────────
export interface TigreFCPerfilPublicoProps {
  targetUsuarioId: string;
  viewerUsuarioId?: string | null;
  onClose: () => void;
}

// ── Componente principal ────────────────────────────────────
export default function TigreFCPerfilPublico({
  targetUsuarioId, viewerUsuarioId, onClose,
}: TigreFCPerfilPublicoProps) {
  const [perfil,  setPerfil]  = useState<any>(null);
  const [esc,     setEsc]     = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewerGoogleId, setViewerGoogleId] = useState<string | null>(null);
  const [corneta, setCorneta] = useState(false);

  const isOwn = viewerUsuarioId === targetUsuarioId;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);

      // 1. Perfil do alvo
      const { data: u } = await supabase
        .from('tigre_fc_usuarios').select('*').eq('id', targetUsuarioId).maybeSingle();
      if (cancelled) return;
      if (u) setPerfil(u);

      // 2. Escalação — user_id = google_id do tigre_fc_usuarios
      if (u?.google_id) {
        const { data: e } = await supabase
          .from('tigre_fc_escalacoes')
          .select('formacao, slots, capitao_id, heroi_id, palpite_mandante, palpite_visitante, updated_at')
          .eq('user_id', u.google_id)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (!cancelled && e) setEsc(e);
      }

      // 3. google_id do viewer para a corneta
      if (viewerUsuarioId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!cancelled && user) setViewerGoogleId(user.id);
      }

      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [targetUsuarioId, viewerUsuarioId]);

  const nivel     = perfil?.nivel     ?? 'Recruta';
  const pontos    = perfil?.pontos_total ?? 0;
  const xp        = perfil?.xp        ?? 0;
  const displayNm = perfil?.apelido   ?? perfil?.nome ?? 'TORCEDOR';
  const slots     = esc?.slots        ?? {};
  const formacao  = esc?.formacao     ?? '4-3-3';
  const capId     = esc?.capitao_id   ?? null;
  const heroId    = esc?.heroi_id     ?? null;

  const capPlayer  = capId  ? PLAYERS_MAP[capId]  : null;
  const heroPlayer = heroId ? PLAYERS_MAP[heroId] : null;

  return (
    <>
      <motion.div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
        style={{ background:'rgba(0,0,0,0.92)', backdropFilter:'blur(16px)', fontFamily:FONT }}
        onClick={onClose} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>

        <motion.div className="w-full max-w-sm sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
          style={{ background:'linear-gradient(180deg, #111 0%, #0a0a0a 100%)', border:`1px solid rgba(255,255,255,0.08)`,
            maxHeight:'92vh', overflowY:'auto' }}
          onClick={e => e.stopPropagation()}
          initial={{ y:60, opacity:0 }} animate={{ y:0, opacity:1 }}
          transition={{ type:'spring', stiffness:260, damping:22 }}>

          {/* Topo dourado */}
          <div className="h-1 w-full" style={{ background:`linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

          <div className="p-5">
            {loading ? (
              <div className="flex flex-col items-center py-16 gap-3">
                <motion.div animate={{ rotate:360 }} transition={{ duration:1.5, repeat:Infinity, ease:'linear' }}
                  className="w-10 h-10 border-2 border-t-transparent rounded-full"
                  style={{ borderColor:`${GOLD}44`, borderTopColor:'transparent' }} />
                <span className="text-zinc-500 text-xs font-black tracking-widest">CARREGANDO VESTIÁRIO...</span>
              </div>
            ) : (
              <>
                {/* Header: avatar + nome */}
                <div className="flex items-center gap-4 mb-5">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden"
                      style={{ border:`2px solid ${GOLD}`, boxShadow:`0 0 20px rgba(245,196,0,0.3)` }}>
                      <img src={perfil?.avatar_url ?? PATA} alt={displayNm}
                        className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).src = PATA; }} />
                    </div>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[8px] font-black uppercase whitespace-nowrap"
                      style={{ background: nivel === 'Comandante' ? '#BF5FFF' : nivel === 'Fiel' ? GOLD : nivel === 'Fanático' ? CYAN : 'rgba(255,255,255,0.15)',
                        color: ['Comandante','Fiel','Fanático'].includes(nivel) ? '#000' : '#fff' }}>
                      {nivel}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-black italic uppercase text-white leading-none truncate">{displayNm}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-center">
                        <div className="text-lg font-black leading-none" style={{ color:GOLD }}>{pontos}</div>
                        <div className="text-[8px] text-zinc-500 font-bold tracking-wider">PONTOS</div>
                      </div>
                      <div className="w-px h-6 bg-white/10" />
                      <div className="text-center">
                        <div className="text-lg font-black leading-none text-white">{xp}</div>
                        <div className="text-[8px] text-zinc-500 font-bold tracking-wider">XP</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Escalação */}
                {esc ? (
                  <>
                    {/* Formação badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black tracking-[4px] text-zinc-500 uppercase">Escalação</span>
                      <span className="px-2.5 py-0.5 rounded font-black text-sm italic"
                        style={{ background:`rgba(245,196,0,0.12)`, border:`1px solid rgba(245,196,0,0.3)`, color:GOLD }}>
                        {formacao}
                      </span>
                    </div>

                    {/* Campo */}
                    <CampoVisual formacao={formacao} slots={slots} capitaoId={capId} heroiId={heroId} />

                    {/* Capitão + Herói */}
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                        style={{ background:'rgba(245,196,0,0.08)', border:`1px solid rgba(245,196,0,0.2)` }}>
                        <span className="text-sm">👑</span>
                        <div>
                          <div className="text-[8px] font-black tracking-wider" style={{ color:GOLD }}>CAPITÃO</div>
                          <div className="text-xs font-black text-white">{capPlayer?.short ?? '—'}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                        style={{ background:`rgba(0,243,255,0.08)`, border:`1px solid rgba(0,243,255,0.2)` }}>
                        <span className="text-sm">🔥</span>
                        <div>
                          <div className="text-[8px] font-black tracking-wider" style={{ color:CYAN }}>HERÓI</div>
                          <div className="text-xs font-black text-white">{heroPlayer?.short ?? '—'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Palpite */}
                    {(esc.palpite_mandante != null && esc.palpite_visitante != null) && (
                      <div className="mt-2 rounded-xl py-2 text-center"
                        style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                        <div className="text-[9px] text-zinc-500 font-black tracking-wider mb-0.5">PALPITE</div>
                        <div className="text-2xl font-black italic" style={{ color:GOLD }}>
                          {esc.palpite_mandante} <span className="text-zinc-600">×</span> {esc.palpite_visitante}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-8 text-center rounded-xl" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div className="text-3xl mb-2">⚽</div>
                    <div className="text-zinc-500 text-sm font-bold">Ainda não escalou nesta rodada</div>
                  </div>
                )}

                {/* Ações */}
                <div className="flex gap-2 mt-4">
                  {!isOwn && viewerGoogleId && (
                    <button onClick={() => setCorneta(true)}
                      className="flex-1 py-3 rounded-xl font-black text-xs tracking-wider uppercase transition-all hover:scale-105"
                      style={{ background:'rgba(245,196,0,0.1)', border:`1px solid rgba(245,196,0,0.3)`, color:GOLD }}>
                      🌽 Cornetar
                    </button>
                  )}
                  <button onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-black text-xs tracking-wider uppercase"
                    style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.7)' }}>
                    Fechar
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {corneta && viewerGoogleId && (
          <CornetarModal
            targetNome={displayNm}
            viewerGoogleId={viewerGoogleId}
            onClose={() => setCorneta(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
