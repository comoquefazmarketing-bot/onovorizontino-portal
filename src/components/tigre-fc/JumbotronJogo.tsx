'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ════════════════════════════════════════════════════════════════════════════
// JumbotronJogo — TELÃO DE LED DE ESTÁDIO (v4)
// O segredo: TODO o conteúdo vive dentro de .led-screen e é coberto por uma
// grade de pixels real (.led-grid) + emendas de módulo + scanlines + sweep de
// refresh + flicker. Assim logo, nome e placar parecem EMITIDOS pelos LEDs,
// não desenhados numa div. O botão de ação fica FORA do telão (UI do app).
// ════════════════════════════════════════════════════════════════════════════

export const C = {
  gold: '#F5C400', cyan: '#00F3FF', red: '#FF2244', green: '#00FF88',
  black: '#050505', white: '#FFFFFF',
} as const;

const FONT_FAMILY = "'Barlow Condensed', 'Barlow', system-ui, -apple-system, sans-serif";
const STORAGE_BASE = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal';
const ESCUDO_NOVORIZONTINO = `${STORAGE_BASE}/Escudo%20Novorizontino.png`;
const ESCUDO_AVAI_OFICIAL = 'https://logodownload.org/wp-content/uploads/2017/02/avai-fc-logo-escudo.png';

const LOGOS: Record<string, string> = {
  'novorizontino': ESCUDO_NOVORIZONTINO, 'gremio-novorizontino': ESCUDO_NOVORIZONTINO,
  'avai': ESCUDO_AVAI_OFICIAL,
  'criciuma': 'https://logodownload.org/wp-content/uploads/2018/06/criciuma-logo-escudo-1.png',
  'vila-nova': 'https://logodownload.org/wp-content/uploads/2017/02/vila-nova-logo-escudo.png',
  'ponte-preta': 'https://logodownload.org/wp-content/uploads/2017/02/ponte-preta-logo-escudo.png',
  'athletico-pr': 'https://logodownload.org/wp-content/uploads/2017/02/athletico-pr-logo-escudo.png',
  'goias': 'https://logodownload.org/wp-content/uploads/2017/02/goias-logo-escudo.png',
  'coritiba': 'https://logodownload.org/wp-content/uploads/2017/02/coritiba-logo-escudo.png',
  'cuiaba': 'https://logodownload.org/wp-content/uploads/2017/02/cuiaba-logo-escudo.png',
  'chapecoense': 'https://logodownload.org/wp-content/uploads/2017/02/chapecoense-logo-escudo.png',
  'paysandu': 'https://logodownload.org/wp-content/uploads/2017/02/paysandu-logo-escudo.png',
  'remo': 'https://logodownload.org/wp-content/uploads/2017/02/remo-logo-escudo.png',
  'amazonas': 'https://logodownload.org/wp-content/uploads/2017/02/amazonas-fc-logo-escudo.png',
  'operario-pr': 'https://logodownload.org/wp-content/uploads/2017/02/operario-pr-logo-escudo.png',
  'volta-redonda': 'https://logodownload.org/wp-content/uploads/2017/02/volta-redonda-logo-escudo.png',
  'crb': 'https://logodownload.org/wp-content/uploads/2017/02/crb-logo-escudo.png',
  'america-mg': 'https://logodownload.org/wp-content/uploads/2017/02/america-mg-logo-escudo.png',
  'athletic-mg': 'https://logodownload.org/wp-content/uploads/2017/02/athletic-club-mg-logo-escudo.png',
  'athletic': 'https://logodownload.org/wp-content/uploads/2017/02/athletic-club-mg-logo-escudo.png',
  'botafogo-sp': 'https://logodownload.org/wp-content/uploads/2017/02/botafogo-sp-logo-escudo.png',
  'sport': 'https://logodownload.org/wp-content/uploads/2017/02/sport-logo-escudo.png',
  'londrina': 'https://logodownload.org/wp-content/uploads/2017/02/londrina-logo-escudo.png',
  'juventude': 'https://logodownload.org/wp-content/uploads/2017/02/juventude-logo-escudo.png',
  'ceara': 'https://logodownload.org/wp-content/uploads/2017/02/ceara-logo-escudo.png',
  'sao-bernardo': 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20SAO%20BERNARDO.png',
  // adicionados p/ próximas rodadas:
  'nautico': 'https://logodownload.org/wp-content/uploads/2017/02/nautico-logo-escudo.png',
  'fortaleza': 'https://logodownload.org/wp-content/uploads/2017/02/fortaleza-logo-escudo.png',
  'atletico-go': 'https://logodownload.org/wp-content/uploads/2017/02/atletico-go-logo-escudo.png',
};

const NOMES: Record<string, string> = {
  'novorizontino': 'NOVORIZONTINO', 'gremio-novorizontino': 'NOVORIZONTINO', 'avai': 'AVAÍ',
  'criciuma': 'CRICIÚMA', 'vila-nova': 'VILA NOVA', 'ponte-preta': 'PONTE PRETA',
  'athletico-pr': 'ATHLETICO', 'goias': 'GOIÁS', 'coritiba': 'CORITIBA', 'cuiaba': 'CUIABÁ',
  'chapecoense': 'CHAPECOENSE', 'paysandu': 'PAYSANDU', 'remo': 'REMO', 'amazonas': 'AMAZONAS',
  'operario-pr': 'OPERÁRIO', 'volta-redonda': 'VOLTA REDONDA', 'crb': 'CRB', 'america-mg': 'AMÉRICA-MG',
  'athletic-mg': 'ATHLETIC', 'athletic': 'ATHLETIC', 'botafogo-sp': 'BOTAFOGO-SP', 'sport': 'SPORT',
  'londrina': 'LONDRINA', 'juventude': 'JUVENTUDE', 'ceara': 'CEARÁ', 'sao-bernardo': 'SÃO BERNARDO',
  'nautico': 'NÁUTICO', 'fortaleza': 'FORTALEZA', 'atletico-go': 'ATLÉTICO-GO',
};

const slugToNome = (slug?: string | null) => slug ? NOMES[slug] ?? slug.replace(/-/g, ' ').toUpperCase() : '---';
const slugToLogo = (slug?: string | null) => slug ? LOGOS[slug] ?? ESCUDO_NOVORIZONTINO : ESCUDO_NOVORIZONTINO;
const normalizarCompeticao = (raw?: string | null): string => {
  if (!raw) return 'BRASILEIRÃO SÉRIE B';
  const s = raw.toString().toUpperCase();
  if (s.includes('SÉRIE B') || s.includes('SERIE B')) return 'BRASILEIRÃO SÉRIE B';
  if (s.includes('SUL-SUDESTE')) return 'COPA SUL-SUDESTE';
  return s;
};

function useCountdown(targetDate: string | null | undefined) {
  const [time, setTime] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  useEffect(() => {
    if (!targetDate) { setTime(null); return; }
    const target = new Date(targetDate).getTime();
    if (isNaN(target)) { setTime(null); return; }
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

// Texto emissivo — brilho + leve aberração cromática RGB (cara de LED real)
const emissive = (color: string, strong = false): React.CSSProperties => ({
  color,
  textShadow: strong
    ? `0.4px 0 0 ${C.red}44, -0.4px 0 0 ${C.cyan}44, 0 0 3px ${color}, 0 0 9px ${color}cc, 0 1px 2px rgba(0,0,0,.55)`
    : `0 0 3px ${color}, 0 0 7px ${color}aa, 0 1px 1px rgba(0,0,0,.45)`,
});

export default function JumbotronJogo({
  jogo,
  onEscalar,
  loading = false,
  mercadoFechado = false,
  totalEscalacoes,
}: {
  jogo?: any;
  onEscalar?: () => void;
  loading?: boolean;
  mercadoFechado?: boolean;
  totalEscalacoes?: number;
}) {
  const safeJogo = jogo ?? {};
  const router = useRouter();
  const id = safeJogo.id ?? 0;
  const rodada = safeJogo.rodada ?? '—';
  const competicaoDisplay = normalizarCompeticao(safeJogo.competicao);
  const mandanteSlug = safeJogo.mandante_slug ?? 'sao-bernardo';
  const visitanteSlug = safeJogo.visitante_slug ?? 'novorizontino';
  const dataJogo = safeJogo.data_hora ?? null;
  const local = safeJogo.local ?? '—';

  const mandanteNome = slugToNome(mandanteSlug);
  const visitanteNome = slugToNome(visitanteSlug);
  const novoIsMandante = mandanteSlug.includes('novorizontino');

  const isLive = safeJogo.finalizado === false && dataJogo && new Date(dataJogo).getTime() < Date.now();
  const finalizado = safeJogo.finalizado === true;
  const temPlacar = safeJogo.placar_mandante != null && safeJogo.placar_visitante != null;
  const countdown = useCountdown(isLive || finalizado ? null : dataJogo);
  const accent = isLive ? C.red : C.gold;

  const handleEscalar = () => {
    if (mercadoFechado) return;
    if (onEscalar) return onEscalar();
    router.push(id ? `/tigre-fc/escalar/${id}` : '/tigre-fc');
  };

  const tickerTxt = useMemo(
    () => `${competicaoDisplay}  ●  RODADA ${rodada}  ●  ${mandanteNome}  X  ${visitanteNome}  ●  ${local}  ●  `,
    [competicaoDisplay, rodada, mandanteNome, visitanteNome, local]
  );

  if (loading) {
    return (
      <div className="jmb-board" style={{ fontFamily: FONT_FAMILY }}>
        <div className="led-screen" style={{ height: 360 }}>
          <div className="led-bloom" />
          <div className="relative z-20 h-full flex items-center justify-center">
            <motion.div className="w-14 h-14 rounded-full border-4"
              style={{ borderColor: C.gold, borderTopColor: 'transparent' }}
              animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
          </div>
          <div className="led-grid" /><div className="led-modules" /><div className="led-scan" />
        </div>
        <style jsx>{styles}</style>
      </div>
    );
  }

  const Score = ({ v, color }: { v: number; color: string }) => (
    <span className="tabular-nums font-black italic" style={{ fontSize: 'clamp(56px,16vw,104px)', lineHeight: .8, ...emissive(color, true) }}>{v}</span>
  );

  return (
    <div className="jmb-board" style={{ fontFamily: FONT_FAMILY }}>
      {/* ═══════════ TELÃO ═══════════ */}
      <motion.div className="led-screen"
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>

        {/* brilho emissivo de fundo (vive ATRÁS do conteúdo) */}
        <div className="led-bloom" style={{ background:
          `radial-gradient(60% 70% at 28% 45%, ${(novoIsMandante ? C.gold : C.cyan)}22, transparent 60%),
           radial-gradient(60% 70% at 72% 45%, ${(novoIsMandante ? C.cyan : C.gold)}22, transparent 60%)` }} />

        {/* ───── CONTEÚDO (será "pixelado" pela grade que vem por cima) ───── */}
        <div className="relative z-20">

          {/* header */}
          <div className="flex items-center justify-between px-5 py-2.5 border-b" style={{ borderColor: '#ffffff14' }}>
            <AnimatePresence mode="wait">
              {isLive ? (
                <motion.div key="live" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <motion.span className="w-2.5 h-2.5 rounded-full" style={{ background: C.red, boxShadow: `0 0 8px ${C.red}` }}
                    animate={{ opacity: [1, .3, 1] }} transition={{ duration: .9, repeat: Infinity }} />
                  <span className="text-[11px] font-black tracking-[3px]" style={emissive(C.red)}>AO VIVO</span>
                </motion.div>
              ) : finalizado ? (
                <span key="fim" className="text-[11px] font-black tracking-[3px]" style={emissive(C.white)}>ENCERRADO</span>
              ) : (
                <motion.div key="next" className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
                  <span className="text-[11px] font-black tracking-[3px]" style={emissive(C.green)}>PRÓXIMO JOGO</span>
                </motion.div>
              )}
            </AnimatePresence>
            <span className="text-[11px] font-black tracking-[3px]" style={emissive(C.gold)}>R{rodada} · {competicaoDisplay}</span>
          </div>

          {/* confronto */}
          <div className="px-4 pt-6 pb-3 flex items-stretch justify-between gap-2">
            {[{ slug: mandanteSlug, nome: mandanteNome, lado: 'MANDANTE', sc: safeJogo.placar_mandante },
              { slug: visitanteSlug, nome: visitanteNome, lado: 'VISITANTE', sc: safeJogo.placar_visitante }].map((t, idx) => {
              const isNovo = t.slug.includes('novorizontino');
              const cor = isNovo ? C.gold : C.white;
              return (
                <React.Fragment key={t.slug + idx}>
                  <div className="flex-1 flex flex-col items-center justify-start gap-2 min-w-0">
                    <img src={slugToLogo(t.slug)} alt={t.nome}
                      className="w-20 h-20 md:w-24 md:h-24 object-contain"
                      style={{ filter: `brightness(1.18) contrast(1.12) saturate(1.25) drop-shadow(0 0 16px ${cor})` }}
                      onError={e => { (e.currentTarget as HTMLImageElement).src = ESCUDO_NOVORIZONTINO; }} />
                    <div className="text-center font-black uppercase tracking-tight leading-none"
                      style={{ fontSize: 'clamp(18px,5vw,30px)', ...emissive(cor, isNovo) }}>{t.nome}</div>
                    <div className="text-[9px] font-black tracking-[2px]" style={{ color: '#ffffff66' }}>{t.lado}</div>
                  </div>

                  {idx === 0 && (
                    <div className="flex flex-col items-center justify-center px-1 shrink-0">
                      {(temPlacar) ? (
                        <div className="flex items-center gap-2">
                          <Score v={safeJogo.placar_mandante} color={novoIsMandante ? C.gold : C.white} />
                          <span className="font-black italic" style={{ fontSize: 'clamp(28px,7vw,52px)', color: '#ffffff44' }}>:</span>
                          <Score v={safeJogo.placar_visitante} color={!novoIsMandante ? C.gold : C.white} />
                        </div>
                      ) : (
                        <motion.div className="font-black italic leading-none" style={{ fontSize: 'clamp(40px,11vw,72px)', ...emissive(C.gold, true) }}
                          animate={{ opacity: [1, .82, 1] }} transition={{ duration: 2.4, repeat: Infinity }}>VS</motion.div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* local */}
          <div className="text-center pb-3">
            <span className="text-[11px] tracking-wide" style={{ color: '#ffffffaa' }}>📍 {local}</span>
          </div>

          {/* countdown — placar eletrônico */}
          {!isLive && !finalizado && countdown && (
            <div className="px-4 pb-4">
              <div className="flex justify-center gap-3 md:gap-6">
                {[{ v: countdown.days, l: 'DIAS' }, { v: countdown.hours, l: 'HRS' },
                  { v: countdown.minutes, l: 'MIN' }, { v: countdown.seconds, l: 'SEG' }].map((u, i) => (
                  <div key={u.l} className="flex items-center gap-3 md:gap-6">
                    <div className="text-center">
                      <div className="tabular-nums font-black leading-none" style={{ fontSize: 'clamp(30px,8vw,46px)', ...emissive(i === 3 ? C.cyan : C.gold) }}>
                        {String(u.v).padStart(2, '0')}
                      </div>
                      <div className="text-[9px] font-black tracking-[3px] mt-1" style={{ color: '#ffffff66' }}>{u.l}</div>
                    </div>
                    {i < 3 && <span className="font-black pb-3" style={{ fontSize: 'clamp(20px,5vw,34px)', color: `${C.gold}55` }}>:</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ticker — placa rolante do estádio */}
          <div className="led-ticker-wrap" style={{ borderColor: '#ffffff14' }}>
            <div className="led-ticker" style={{ color: accent }}>
              <span>{tickerTxt}{tickerTxt}{tickerTxt}</span>
              <span>{tickerTxt}{tickerTxt}{tickerTxt}</span>
            </div>
          </div>
        </div>

        {/* ───── OVERLAYS DE LED (por cima de TUDO) ───── */}
        <div className="led-bloom-front" />
        <div className="led-grid" />
        <div className="led-modules" />
        <div className="led-scan" />
        <div className="led-flicker" />
        <div className="led-sweep" />
        <div className="led-vignette" />
        {/* moldura/bezel do painel */}
        <div className="led-bezel" style={{ boxShadow: `inset 0 0 0 2px ${accent}33, inset 0 0 40px ${accent}1a, 0 0 50px ${accent}26` }} />
      </motion.div>

      {/* ═══════════ UI DO APP (fora do telão, nítido) ═══════════ */}
      <div className="px-3 md:px-4 pt-4 pb-1">
        {totalEscalacoes !== undefined && (
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold"
              style={{ background: '#0a0a0a', border: '1px solid #ffffff14', color: '#ffffffcc' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
              <span className="font-black" style={{ color: C.gold }}>{totalEscalacoes}</span> escalações até agora
            </span>
          </div>
        )}
        <motion.button onClick={handleEscalar} disabled={mercadoFechado}
          className="relative w-full py-5 font-black tracking-[2px] rounded-2xl overflow-hidden group"
          style={{
            background: mercadoFechado ? '#222' : `linear-gradient(90deg, ${accent}, ${isLive ? '#ff5577' : '#ffe04d'})`,
            color: mercadoFechado ? '#777' : '#0a0a0a',
            fontSize: 'clamp(15px,4vw,19px)',
            boxShadow: mercadoFechado ? 'none' : `0 8px 30px ${accent}40`,
            cursor: mercadoFechado ? 'not-allowed' : 'pointer',
          }}
          whileHover={mercadoFechado ? {} : { scale: 1.02 }} whileTap={mercadoFechado ? {} : { scale: 0.98 }}>
          {!mercadoFechado && (
            <motion.span className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)' }}
              animate={{ x: ['-120%', '220%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
          )}
          <span className="relative z-10">
            {mercadoFechado ? '🔒 MERCADO FECHADO' : isLive ? '🔴 ASSISTIR AO VIVO' : '⚡ ESCALAR AGORA →'}
          </span>
        </motion.button>
        <div className="text-center mt-3 text-[11px] tracking-wide" style={{ color: '#ffffff55' }}>
          {isLive ? 'Transmissão oficial' : finalizado ? 'Veja como você pontuou no ranking' : 'Monte seu time antes do apito e dispute o ranking 🏆'}
        </div>
      </div>

      <style jsx>{styles}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CSS — toda a "física" do LED mora aqui (barato p/ GPU, nada de 120 nós JS)
// ════════════════════════════════════════════════════════════════════════════
const styles = `
  .jmb-board {
    position: relative; width: 100%; margin: 0 auto; border-radius: 26px;
    background: linear-gradient(145deg, #141414, #050505 60%);
    padding: 10px;                       /* a "carcaça" preta do painel */
    box-shadow: 0 24px 60px rgba(0,0,0,.7), inset 0 0 0 1px #ffffff0d;
  }
  .led-screen {
    position: relative; width: 100%; border-radius: 16px; overflow: hidden;
    background: #04060a;                 /* preto levemente azulado = LED apagado */
    isolation: isolate;
  }
  /* glows emissivos */
  .led-bloom       { position:absolute; inset:0; z-index:5;  pointer-events:none; filter: blur(28px); }
  .led-bloom-front { position:absolute; inset:0; z-index:24; pointer-events:none;
    background: radial-gradient(120% 60% at 50% 40%, transparent 55%, rgba(0,0,0,.35) 100%); }

  /* (1) GRADE DE PIXELS — o que faz tudo parecer LED. Escurece os "vãos". */
  .led-grid {
    position:absolute; inset:0; z-index:30; pointer-events:none;
    background-image: radial-gradient(circle at center, rgba(0,0,0,0) 2.1px, rgba(2,4,8,.24) 2.5px);
    background-size: 5px 5px;
    mix-blend-mode: multiply;
  }
  /* (2) EMENDAS DOS MÓDULOS — as placas parafusadas do telão */
  .led-modules {
    position:absolute; inset:0; z-index:31; pointer-events:none;
    background-image:
      repeating-linear-gradient(0deg,  transparent 0 47px, rgba(0,0,0,.12) 47px 48px),
      repeating-linear-gradient(90deg, transparent 0 47px, rgba(0,0,0,.12) 47px 48px);
  }
  /* scanlines finas */
  .led-scan {
    position:absolute; inset:0; z-index:31; pointer-events:none;
    background-image: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0,0,0,.03) 2px 3px);
  }
  /* (3) FLICKER — respiração de brilho global */
  .led-flicker {
    position:absolute; inset:0; z-index:32; pointer-events:none; background:#fff;
    mix-blend-mode: overlay; animation: ledFlicker 3.5s steps(2,end) infinite; opacity:.04;
  }
  /* SWEEP DE REFRESH — a faixa que a câmera pega varrendo a tela */
  .led-sweep {
    position:absolute; left:0; right:0; top:0; height:45%; z-index:33; pointer-events:none;
    background: linear-gradient(180deg, transparent, rgba(255,255,255,.05) 44%, rgba(255,255,255,.11) 50%, rgba(255,255,255,.05) 56%, transparent);
    mix-blend-mode: screen; animation: ledSweep 5.5s linear infinite;
  }
  .led-vignette {
    position:absolute; inset:0; z-index:34; pointer-events:none;
    background: radial-gradient(ellipse at center, transparent 72%, rgba(0,0,0,.24) 100%);
  }
  .led-bezel { position:absolute; inset:0; z-index:35; border-radius:16px; pointer-events:none; }

  /* TICKER */
  .led-ticker-wrap {
    position:relative; overflow:hidden; border-top:1px solid; border-bottom:1px solid;
    background: rgba(0,0,0,.45); padding: 5px 0;
  }
  .led-ticker {
    display:inline-flex; white-space:nowrap; font-weight:900; letter-spacing:.18em;
    font-size:12px; animation: ledTicker 26s linear infinite;
    text-shadow: 0 0 6px currentColor, 0 0 14px currentColor;
  }
  .led-ticker > span { padding-right: 0; }

  @keyframes ledSweep  { 0%{transform:translateY(-110%)} 100%{transform:translateY(230%)} }
  @keyframes ledTicker { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes ledFlicker {
    0%,100%{opacity:.03} 10%{opacity:.07} 11%{opacity:.02} 40%{opacity:.05}
    41%{opacity:.10} 42%{opacity:.03} 70%{opacity:.06} 71%{opacity:.02}
  }
  @media (prefers-reduced-motion: reduce) {
    .led-sweep, .led-flicker, .led-ticker { animation: none; }
  }
`;
