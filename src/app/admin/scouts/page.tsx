'use client';
// src/app/admin/scouts/page.tsx
// Painel admin de scouts — estilo LED Jumbotron, mobile-first
// Use durante o jogo: selecione o jogador → clique no evento

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// ── Design tokens (espelho do JumbotronJogo) ───────────────
const C = {
  gold:   '#F5C400', cyan:   '#00F3FF',
  red:    '#FF2D55', green:  '#22C55E',
  purple: '#BF5FFF', amber:  '#FFB300',
};
const POS_COR: Record<string, string> = {
  GOL:'#F5C400', ZAG:'#00F3FF', LAT:'#4FC3F7',
  VOL:'#BF5FFF', MEI:'#22C55E', ATA:'#FF2D55',
};
const POS_LABEL: Record<string, string> = {
  GOL:'GOLEIRO', ZAG:'ZAGUEIROS', LAT:'LATERAIS',
  VOL:'VOLANTES', MEI:'MEIAS', ATA:'ATACANTES',
};
const POS_ORDEM = ['GOL','ZAG','LAT','VOL','MEI','ATA'];

// ── Eventos disponíveis ────────────────────────────────────
const EVENTOS = [
  { campo:'gols',           label:'GOL',        cor:C.gold,   incrementa:true  },
  { campo:'assistencias',   label:'ASSIST',     cor:C.cyan,   incrementa:true  },
  { campo:'cartao_amarelo', label:'AMARELO',    cor:C.amber,  incrementa:true  },
  { campo:'cartao_vermelho',label:'VERMELHO',   cor:C.red,    incrementa:true  },
  { campo:'sg',             label:'CLEAN\nSHEET',cor:C.green,incrementa:false },
  { campo:'potm',           label:'MVP\nPOTM',  cor:C.purple, incrementa:false },
] as const;

// ── Tipos ──────────────────────────────────────────────────
interface Atleta { id:number; nome:string; posicao:string; numero_camisa:number|null }
interface Scout  {
  jogador_id:number; gols:number; assistencias:number;
  cartao_amarelo:number; cartao_vermelho:number;
  sg:boolean; potm:boolean; var_em_andamento:boolean;
}
interface Jogo   {
  id:number; rodada:string; competicao:string;
  placar_mandante:number|null; placar_visitante:number|null;
  mandante:  { nome:string; escudo_url:string|null };
  visitante: { nome:string; escudo_url:string|null };
}

// ── Helpers de estilo ──────────────────────────────────────
const led = (color: string, alpha = 0.12) =>
  `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},${alpha})`;

export default function AdminScoutsPanel() {
  const [jogo,       setJogo]       = useState<Jogo | null>(null);
  const [atletas,    setAtletas]    = useState<Atleta[]>([]);
  const [scouts,     setScouts]     = useState<Record<number, Scout>>({});
  const [sel,        setSel]        = useState<number | null>(null);
  const [varMode,    setVarMode]    = useState(false);
  const [loading,    setLoading]    = useState(true);
  const [feedback,   setFeedback]   = useState<{msg:string;cor:string}|null>(null);
  const [placarAdv,  setPlacarAdv]  = useState(0);
  const [placarNovo, setPlacarNovo] = useState(0);

  const toast = (msg: string, cor = C.gold) => {
    setFeedback({ msg, cor });
    setTimeout(() => setFeedback(null), 2200);
  };

  // ── Carrega dados iniciais ─────────────────────────────
  const loadScouts = useCallback(async (jogoId: number) => {
    const { data } = await supabase
      .from('scouts_reais').select('*').eq('jogo_id', jogoId);
    if (data) {
      const map: Record<number, Scout> = {};
      data.forEach(s => { map[s.jogador_id] = s; });
      setScouts(map);
    }
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      const { data: j } = await supabase
        .from('jogos')
        .select(`id,rodada,competicao,placar_mandante,placar_visitante,
          mandante:mandante_id(nome,escudo_url),
          visitante:visitante_id(nome,escudo_url)`)
        .eq('ativo', true).eq('finalizado', false)
        .order('data_hora',{ascending:true}).limit(1).maybeSingle();

      if (j) {
        setJogo(j as unknown as Jogo);
        setPlacarAdv(j.placar_mandante ?? 0);
        setPlacarNovo(j.placar_visitante ?? 0);
        await loadScouts(j.id);
      }

      const { data: a } = await supabase
        .from('tigre_fc_atletas')
        .select('id,nome,posicao,numero_camisa')
        .eq('ativo', true)
        .order('posicao').order('numero_camisa');
      if (a) setAtletas(a);
      setLoading(false);
    }
    init();
  }, [loadScouts]);

  // ── Registra evento ────────────────────────────────────
  const registrar = async (campo: string, incrementa: boolean) => {
    if (!sel || !jogo) return;
    const atleta = atletas.find(a => a.id === sel);

    if (incrementa) {
      const { error } = await supabase.rpc('fn_incrementar_scout', {
        p_jogador_id: sel, p_jogo_id: jogo.id, p_campo: campo,
      });
      if (error) { toast('Erro: ' + error.message, C.red); return; }
      if (campo === 'gols') {
        const novo = placarNovo + 1;
        setPlacarNovo(novo);
        await supabase.from('jogos')
          .update({ placar_visitante: novo }).eq('id', jogo.id);
      }
    } else {
      const val = scouts[sel]?.[campo as keyof Scout] as boolean ?? false;
      const { error } = await supabase.from('scouts_reais').upsert(
        { jogador_id: sel, jogo_id: jogo.id, [campo]: !val },
        { onConflict: 'jogador_id,jogo_id' }
      );
      if (error) { toast('Erro: ' + error.message, C.red); return; }
    }

    await loadScouts(jogo.id);
    toast(`${atleta?.nome ?? ''} · ${campo.replace('_',' ').toUpperCase()}`);
  };

  // ── VAR ────────────────────────────────────────────────
  const toggleVar = async () => {
    const next = !varMode;
    setVarMode(next);
    if (jogo) {
      await supabase.from('scouts_reais')
        .update({ var_em_andamento: next }).eq('jogo_id', jogo.id);
    }
    toast(next ? 'VAR INICIADO' : 'VAR ENCERRADO', next ? C.cyan : C.green);
  };

  // ── Desfaz gol ─────────────────────────────────────────
  const desfazerGol = async () => {
    if (!sel || !jogo) return;
    const s = scouts[sel];
    if (!s?.gols) return;
    await supabase.from('scouts_reais')
      .update({ gols: s.gols - 1 })
      .eq('jogador_id', sel).eq('jogo_id', jogo.id);
    const novo = Math.max(0, placarNovo - 1);
    setPlacarNovo(novo);
    await supabase.from('jogos').update({ placar_visitante: novo }).eq('id', jogo.id);
    await loadScouts(jogo.id);
    toast('Gol desfeito', C.red);
  };

  // ── Finaliza jogo ──────────────────────────────────────
  const finalizar = async () => {
    if (!jogo || !confirm(`Finalizar ${placarAdv}×${placarNovo}?`)) return;
    await supabase.rpc('fn_finalizar_jogo', {
      p_jogo_id: jogo.id,
      p_placar_mandante: placarAdv,
      p_placar_visitante: placarNovo,
    });
    toast('Jogo finalizado! Ranking recalculando...', C.green);
    setTimeout(() => window.location.reload(), 2500);
  };

  const porPos = atletas.reduce<Record<string, Atleta[]>>((acc, a) => {
    (acc[a.posicao] ??= []).push(a); return acc;
  }, {});

  const scoutSel = sel ? scouts[sel] : null;

  // ── Render ─────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:'100svh', background:'#050505', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color:C.gold, fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:900, letterSpacing:'0.2em' }}>
        CARREGANDO...
      </span>
    </div>
  );

  return (
    <div style={{ minHeight:'100svh', background:'#050505', fontFamily:"'Barlow Condensed',Impact,sans-serif",
      color:'#fff', paddingBottom:40, position:'relative' }}>

      <style>{`
        @keyframes led-scan{0%{background-position:-200% center}100%{background-position:200% center}}
        @keyframes blink-dot{0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes toast-in{from{opacity:0;transform:translateX(-50%) translateY(-8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}
        @keyframes pop{0%{transform:scale(0.92)}60%{transform:scale(1.04)}100%{transform:scale(1)}}
        @keyframes var-pulse{0%,100%{opacity:1}50%{opacity:0.3}}
        .ev-btn:active{transform:scale(0.95)!important}
        .p-btn:active{transform:scale(0.97)!important}
      `}</style>

      {/* LED textures */}
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:'radial-gradient(circle,rgba(245,196,0,0.04) 1px,transparent 1px)',
        backgroundSize:'4px 4px' }} />
      <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0,
        backgroundImage:`repeating-linear-gradient(45deg,transparent,transparent 12px,rgba(245,196,0,0.015) 12px,rgba(245,196,0,0.015) 14px),repeating-linear-gradient(-45deg,transparent,transparent 18px,rgba(245,196,0,0.011) 18px,rgba(245,196,0,0.011) 20px)` }} />

      {/* Toast */}
      {feedback && (
        <div style={{ position:'fixed', top:12, left:'50%', zIndex:999,
          background:feedback.cor, color:'#000',
          padding:'10px 20px', borderRadius:8,
          fontWeight:900, fontSize:13, letterSpacing:'0.12em',
          animation:'toast-in 0.2s ease',
          boxShadow:`0 0 20px ${feedback.cor}88`,
          whiteSpace:'nowrap',
        }}>
          {feedback.msg}
        </div>
      )}

      <div style={{ position:'relative', zIndex:1 }}>

        {/* Scan bar */}
        <div style={{ height:2,
          background:`linear-gradient(90deg,transparent,${C.gold},#fff,${C.cyan},transparent)`,
          backgroundSize:'200%', animation:'led-scan 2.5s linear infinite' }} />

        {/* Header */}
        <div style={{ padding:'12px 16px 10px', borderBottom:'1px solid rgba(245,196,0,0.12)',
          background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <div style={{ fontSize:9, fontWeight:900, letterSpacing:'0.4em', color:'rgba(245,196,0,0.45)' }}>PAINEL ADMIN</div>
            <div style={{ fontSize:22, fontWeight:900, fontStyle:'italic', color:C.gold,
              textShadow:`0 0 12px rgba(245,196,0,0.5)`, lineHeight:1 }}>TIGRE FC</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.green,
              boxShadow:`0 0 8px ${C.green}`, display:'inline-block',
              animation:'blink-dot 1s ease-in-out infinite' }} />
            <span style={{ fontSize:10, fontWeight:900, letterSpacing:'0.2em', color:C.green }}>AO VIVO</span>
          </div>
        </div>

        {/* Scoreboard */}
        {jogo && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)',
            background:'rgba(245,196,0,0.03)' }}>

            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#111',
                border:'1px solid rgba(255,255,255,0.08)', display:'flex', alignItems:'center',
                justifyContent:'center', overflow:'hidden', fontSize:20 }}>
                {jogo.mandante?.escudo_url
                  ? <img src={jogo.mandante.escudo_url} style={{ width:30, height:30, objectFit:'contain' }} alt="" />
                  : '★'}
              </div>
              <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.1em', color:'rgba(255,255,255,0.35)' }}>
                {(jogo.mandante?.nome ?? '').toUpperCase()}
              </span>
            </div>

            <div style={{ textAlign:'center', padding:'0 10px' }}>
              <div style={{ fontSize:38, fontWeight:900, fontStyle:'italic', lineHeight:1, letterSpacing:'-0.02em' }}>
                <span style={{ color:'rgba(255,255,255,0.5)' }}>{placarAdv}</span>
                <span style={{ color:'rgba(255,255,255,0.2)', margin:'0 6px' }}>×</span>
                <span style={{ color:C.gold, textShadow:`0 0 16px rgba(245,196,0,0.5)` }}>{placarNovo}</span>
              </div>
              <div style={{ fontSize:8, letterSpacing:'0.25em', color:'rgba(255,255,255,0.2)', marginTop:4 }}>
                {jogo.competicao} · RD {jogo.rodada}
              </div>
              {/* Ajuste placar adversário */}
              <div style={{ display:'flex', gap:6, justifyContent:'center', marginTop:8 }}>
                <button onClick={() => setPlacarAdv(p => Math.max(0, p-1))}
                  style={{ width:26, height:26, borderRadius:5, background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.35)',
                    fontWeight:900, fontSize:14, cursor:'pointer' }}>−</button>
                <span style={{ fontSize:9, color:'rgba(255,255,255,0.2)', lineHeight:'26px', letterSpacing:'0.1em' }}>GOL ADV</span>
                <button onClick={async () => {
                  const n = placarAdv + 1; setPlacarAdv(n);
                  if (jogo) await supabase.from('jogos').update({ placar_mandante: n }).eq('id', jogo.id);
                }} style={{ width:26, height:26, borderRadius:5, background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.35)',
                    fontWeight:900, fontSize:14, cursor:'pointer' }}>+</button>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, flex:1 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:'#111',
                border:`1px solid rgba(245,196,0,0.3)`, display:'flex', alignItems:'center',
                justifyContent:'center', overflow:'hidden', fontSize:20,
                boxShadow:'0 0 14px rgba(245,196,0,0.15)' }}>
                {jogo.visitante?.escudo_url
                  ? <img src={jogo.visitante.escudo_url} style={{ width:30, height:30, objectFit:'contain' }} alt="" />
                  : '🐯'}
              </div>
              <span style={{ fontSize:9, fontWeight:900, letterSpacing:'0.1em', color:C.gold,
                textShadow:`0 0 6px rgba(245,196,0,0.4)` }}>
                {(jogo.visitante?.nome ?? '').toUpperCase()}
              </span>
            </div>
          </div>
        )}

        {/* VAR toggle */}
        <button onClick={toggleVar} style={{
          width:'100%', padding:'10px 16px',
          background: varMode ? 'rgba(0,243,255,0.08)' : 'transparent',
          border:'none', borderBottom:`1px solid ${varMode ? 'rgba(0,243,255,0.2)' : 'rgba(255,255,255,0.05)'}`,
          display:'flex', alignItems:'center', justifyContent:'center', gap:8,
          cursor:'pointer', transition:'all 0.2s',
        }}>
          {varMode && <span style={{ width:8, height:8, borderRadius:'50%', background:C.cyan,
            boxShadow:`0 0 8px ${C.cyan}`, display:'inline-block',
            animation:'var-pulse 0.5s ease-in-out infinite' }} />}
          <span style={{ fontSize:11, fontWeight:900, letterSpacing:'0.25em',
            color: varMode ? C.cyan : 'rgba(0,243,255,0.3)',
            animation: varMode ? 'var-pulse 1.2s ease-in-out infinite' : 'none' }}>
            {varMode ? '⏸ VAR EM ANDAMENTO — toque para encerrar' : '▶ INICIAR VAR'}
          </span>
        </button>

        {/* Painel de eventos do jogador selecionado */}
        {sel !== null && (
          <div style={{
            position:'sticky', top:0, zIndex:50,
            background:'#080808',
            borderBottom:`2px solid ${C.gold}`,
            padding:'12px 14px 14px',
            boxShadow:`0 4px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245,196,0,0.15)`,
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div>
                <div style={{ fontSize:9, letterSpacing:'0.25em', color:'rgba(245,196,0,0.45)' }}>REGISTRAR EVENTO</div>
                <div style={{ fontSize:20, fontWeight:900, fontStyle:'italic', color:C.gold,
                  textShadow:`0 0 10px rgba(245,196,0,0.5)`, lineHeight:1 }}>
                  {atletas.find(a => a.id === sel)?.nome?.toUpperCase()}
                </div>
              </div>
              <button onClick={() => setSel(null)} style={{
                width:28, height:28, borderRadius:6,
                background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)',
                color:'rgba(255,255,255,0.35)', fontSize:14, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>✕</button>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6 }}>
              {EVENTOS.map(ev => {
                const val = scoutSel?.[ev.campo as keyof Scout];
                const isOn = !ev.incrementa && !!val;
                const count = ev.incrementa ? (typeof val === 'number' ? val : 0) : null;
                return (
                  <button key={ev.campo} className="ev-btn" onClick={() => registrar(ev.campo, ev.incrementa)}
                    style={{
                      background: isOn ? led(ev.cor, 0.18) : led(ev.cor, 0.07),
                      border: `2px solid ${isOn ? ev.cor : led(ev.cor, 0.25)}`,
                      borderRadius:10, padding:'12px 6px',
                      fontFamily:"'Barlow Condensed',sans-serif",
                      fontSize:11, fontWeight:900, letterSpacing:'0.12em',
                      color: ev.cor, cursor:'pointer', textAlign:'center',
                      boxShadow: isOn ? `0 0 14px ${led(ev.cor, 0.4)}` : 'none',
                      transition:'all 0.12s', whiteSpace:'pre-line',
                    }}>
                    {ev.label}
                    <span style={{ display:'block', fontSize: ev.incrementa ? 26 : 14,
                      fontWeight:900, lineHeight:1, marginTop:3,
                      textShadow: (count ?? 0) > 0 || isOn ? `0 0 8px ${ev.cor}` : 'none' }}>
                      {ev.incrementa ? (count ?? 0) : (isOn ? 'ON' : 'OFF')}
                    </span>
                  </button>
                );
              })}
            </div>

            <button onClick={desfazerGol} style={{
              width:'100%', marginTop:8, padding:'8px',
              background:'none', border:`1px solid rgba(255,45,85,0.18)`,
              borderRadius:6, color:'rgba(255,45,85,0.4)',
              fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:10, fontWeight:700, letterSpacing:'0.15em', cursor:'pointer',
            }}>DESFAZER ÚLTIMO GOL</button>
          </div>
        )}

        {/* Lista de jogadores */}
        {!jogo ? (
          <div style={{ padding:'48px 20px', textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:14 }}>
            Nenhum jogo ativo.<br/>
            <code style={{ color:C.cyan, fontSize:11 }}>SELECT fn_ativar_sync_jogo(jogo_id, 0);</code>
          </div>
        ) : (
          <>
            {POS_ORDEM.map(pos => {
              const lista = porPos[pos];
              if (!lista?.length) return null;
              return (
                <div key={pos}>
                  <div style={{ fontSize:9, fontWeight:900, letterSpacing:'0.4em',
                    color:`${POS_COR[pos]}80`, padding:'10px 16px 6px',
                    borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                    {POS_LABEL[pos]}
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6, padding:'0 12px 8px' }}>
                    {lista.map(atleta => {
                      const s = scouts[atleta.id];
                      const isSelected = sel === atleta.id;
                      const temEvento = s && (s.gols > 0 || s.assistencias > 0 || s.cartao_amarelo > 0 || s.cartao_vermelho > 0 || s.sg || s.potm);
                      return (
                        <button key={atleta.id} className="p-btn"
                          onClick={() => setSel(isSelected ? null : atleta.id)}
                          style={{
                            background: isSelected ? led(C.gold, 0.12) : temEvento ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
                            border: `1.5px solid ${isSelected ? C.gold : temEvento ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)'}`,
                            borderLeft: `4px solid ${POS_COR[atleta.posicao] ?? '#333'}`,
                            borderRadius:10, padding:'10px 10px',
                            cursor:'pointer', textAlign:'left',
                            boxShadow: isSelected ? `0 0 14px rgba(245,196,0,0.2)` : 'none',
                            transition:'all 0.12s',
                          }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                            {atleta.numero_camisa && (
                              <span style={{ fontSize:9, color:'rgba(255,255,255,0.25)', fontWeight:900, minWidth:16 }}>
                                {String(atleta.numero_camisa).padStart(2,'0')}
                              </span>
                            )}
                            <span style={{ fontSize:14, fontWeight:900, letterSpacing:'-0.01em',
                              color: isSelected ? C.gold : '#fff',
                              textShadow: isSelected ? `0 0 8px rgba(245,196,0,0.4)` : 'none',
                              flex:1, textAlign:'left' }}>
                              {atleta.nome}
                            </span>
                          </div>
                          {s && (
                            <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                              {s.gols > 0 && <span style={{ fontSize:9, fontWeight:900, padding:'1px 5px', borderRadius:3, background:led(C.gold,0.15), color:C.gold }}>⚽{s.gols}</span>}
                              {s.assistencias > 0 && <span style={{ fontSize:9, fontWeight:900, padding:'1px 5px', borderRadius:3, background:led(C.cyan,0.12), color:C.cyan }}>A{s.assistencias}</span>}
                              {s.cartao_amarelo > 0 && <span style={{ fontSize:9, fontWeight:900, padding:'1px 5px', borderRadius:3, background:'rgba(255,179,0,0.15)', color:C.amber }}>■</span>}
                              {s.cartao_vermelho > 0 && <span style={{ fontSize:9, fontWeight:900, padding:'1px 5px', borderRadius:3, background:led(C.red,0.15), color:C.red }}>■</span>}
                              {s.sg && <span style={{ fontSize:9, fontWeight:900, padding:'1px 5px', borderRadius:3, background:led(C.green,0.12), color:C.green }}>SG</span>}
                              {s.potm && <span style={{ fontSize:9, fontWeight:900, padding:'1px 5px', borderRadius:3, background:led(C.purple,0.12), color:C.purple }}>MVP</span>}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Finalizar */}
            <button onClick={finalizar} style={{
              display:'block', margin:'16px 12px 0', width:'calc(100% - 24px)',
              padding:'15px', background:'rgba(255,45,85,0.07)',
              border:`2px solid rgba(255,45,85,0.25)`, borderRadius:10,
              color:C.red, fontFamily:"'Barlow Condensed',sans-serif",
              fontSize:14, fontWeight:900, letterSpacing:'0.2em', cursor:'pointer',
            }}>
              FINALIZAR JOGO · {placarAdv}×{placarNovo}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
