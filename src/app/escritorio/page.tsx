'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'comoquefazmarketing@gmail.com';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface LogEntry {
  agente: string;
  cor: string;
  ts: string;
  ok: boolean;
  dados: unknown;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function now() { return new Date().toLocaleTimeString('pt-BR'); }

// ─── Página ───────────────────────────────────────────────────────────────────

export default function EscritorioPage() {
  const [email,     setEmail]     = useState<string | null>(null);
  const [checking,  setChecking]  = useState(true);

  const [logs,      setLogs]      = useState<LogEntry[]>([]);
  const logRef                    = useRef<HTMLDivElement>(null);

  const [loadAna,    setLoadAna]    = useState(false);
  const [loadGabi,   setLoadGabi]   = useState(false);
  const [loadLeo,    setLoadLeo]    = useState(false);
  const [loadCarlos, setLoadCarlos] = useState(false);
  const [loadBruno,  setLoadBruno]  = useState(false);
  const [loadRafael, setLoadRafael] = useState(false);

  const [anaFormacao,  setAnaFormacao]  = useState('4-3-3');
  const [gabiJogoId,   setGabiJogoId]  = useState('');
  const [gabiStatus,   setGabiStatus]  = useState<'draft' | 'published'>('draft');
  const [leoEvento,    setLeoEvento]   = useState('vitória');
  const [leoJogador,   setLeoJogador]  = useState('');
  const [leoPlacarM,   setLeoPlacarM]  = useState('');
  const [leoPlacarV,   setLeoPlacarV]  = useState('');
  const [brunoHoras,   setBrunoHoras]  = useState('48');

  // ─── Auth ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setChecking(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function entrar() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Aponta para a rota de callback que troca o code por sessão,
        // passando o destino final como query param ?next=
        redirectTo: `${window.location.origin}/auth/callback?next=/escritorio`,
      },
    });
  }

  async function sair() {
    await supabase.auth.signOut();
    setEmail(null);
  }

  // ─── Acesso negado ────────────────────────────────────────────────────────

  if (checking) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <span className="text-zinc-600 text-sm" style={{ fontFamily: 'monospace' }}>verificando sessão…</span>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-6 px-6"
        style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&display=swap');`}</style>
        <h1 className="text-5xl font-black italic uppercase text-white tracking-tighter">
          Escri<span className="text-yellow-500">tório</span>
        </h1>
        <p className="text-zinc-500 text-sm">Acesso restrito — faça login com seu Google.</p>
        <button
          onClick={entrar}
          className="flex items-center gap-3 bg-white text-black font-black text-sm uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Entrar com Google
        </button>
      </div>
    );
  }

  if (email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center gap-4 px-6"
        style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&display=swap');`}</style>
        <p className="text-red-400 font-black text-lg uppercase tracking-widest">Acesso negado</p>
        <p className="text-zinc-500 text-sm">{email}</p>
        <button onClick={sair} className="text-zinc-600 hover:text-white text-xs uppercase tracking-widest transition-colors">
          Sair
        </button>
      </div>
    );
  }

  // ─── Log helper ───────────────────────────────────────────────────────────

  function appendLog(agente: string, cor: string, ok: boolean, dados: unknown) {
    setLogs(prev => [...prev.slice(-49), { agente, cor, ts: now(), ok, dados }]);
    setTimeout(() => logRef.current?.scrollTo({ top: 99999, behavior: 'smooth' }), 50);
  }

  // ─── Dispatcher central ──────────────────────────────────────────────────

  async function dispatch(agente: string, cor: string, payload: Record<string, unknown>, setter: (v: boolean) => void) {
    setter(true);
    try {
      const res  = await fetch('/api/escritorio', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ agente, ...payload }),
      });
      appendLog(agente.charAt(0).toUpperCase() + agente.slice(1), cor, res.ok, await res.json());
    } catch (e) { appendLog(agente, cor, false, String(e)); }
    setter(false);
  }

  const dispararAna    = ()              => dispatch('ana',    '#a78bfa', { formacao: anaFormacao }, setLoadAna);
  const rankingAna     = ()              => dispatch('ana',    '#a78bfa', { ranking: true },         setLoadAna);
  const dispararGabi   = ()              => gabiJogoId && dispatch('gabi',   '#f472b6', { jogo_id: Number(gabiJogoId), preview: true },              setLoadGabi);
  const publicarGabi   = ()              => gabiJogoId && dispatch('gabi',   '#f472b6', { jogo_id: Number(gabiJogoId), status: gabiStatus },          setLoadGabi);
  const ultimoJogoGabi = ()              => dispatch('gabi', '#f472b6', { ultimo_jogo: true, status: gabiStatus }, setLoadGabi);
  const dispararLeo    = ()              => dispatch('leo',    '#fb923c', { evento: leoEvento, jogador: leoJogador || undefined, placarMandante: leoPlacarM ? Number(leoPlacarM) : undefined, placarVisitante: leoPlacarV ? Number(leoPlacarV) : undefined }, setLoadLeo);
  const dispararCarlos = (tabela?: string) => dispatch('carlos', '#34d399', tabela ? { tabela } : {},                                                 setLoadCarlos);
  const dispararBruno  = (apenasContar = false) => dispatch('bruno', '#60a5fa', { horas: Number(brunoHoras) || 48, apenas_contar: apenasContar },     setLoadBruno);
  const dispararRafael = ()              => dispatch('rafael', '#facc15', {},                                                                          setLoadRafael);

  // ─── UI ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#080808] text-white"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700;1,900&display=swap');
        .card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:16px; padding:20px; }
        .card:hover { border-color:rgba(255,255,255,0.14); }
        .btn { cursor:pointer; font-family:inherit; font-weight:900; font-size:11px; letter-spacing:.12em; text-transform:uppercase; border-radius:8px; padding:8px 16px; border:none; transition:all .2s; }
        .btn:disabled { opacity:.4; cursor:not-allowed; }
        .btn-primary { background:#f5c400; color:#000; }
        .btn-primary:hover:not(:disabled) { background:#fff; }
        .btn-ghost { background:rgba(255,255,255,0.06); color:#aaa; border:1px solid rgba(255,255,255,0.1); }
        .btn-ghost:hover:not(:disabled) { background:rgba(255,255,255,0.1); color:#fff; }
        .input { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:8px 12px; color:#fff; font-family:inherit; font-size:13px; width:100%; outline:none; }
        .input:focus { border-color:rgba(245,196,0,0.5); }
        .select { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:8px 12px; color:#fff; font-family:inherit; font-size:13px; outline:none; }
        .select:focus { border-color:rgba(245,196,0,0.5); }
        .label { font-size:9px; font-weight:900; letter-spacing:.3em; text-transform:uppercase; color:#666; margin-bottom:4px; display:block; }
        .spin { animation:spin .8s linear infinite; display:inline-block; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>

      {/* ── Header ───────────────────────────────────────── */}
      <header className="pt-10 pb-8 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[.4em] text-yellow-500 mb-2">
              🐯 Portal O Novorizontino
            </p>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Escri<span className="text-yellow-500">tório</span>
            </h1>
            <p className="text-zinc-600 text-xs mt-2">Central de controle dos agentes de IA</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-xs">{email}</span>
            <button onClick={sair} className="btn btn-ghost text-[10px] px-3 py-1.5">Sair</button>
          </div>
        </div>
      </header>

      {/* ── Grid de agentes ──────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Ana */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🧠</span>
            <div>
              <h2 className="font-black italic uppercase text-xl leading-none">Ana</h2>
              <p style={{ color:'#a78bfa' }} className="text-[9px] font-black uppercase tracking-widest">Escalação Inteligente</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="label">Formação</span>
            <select value={anaFormacao} onChange={e => setAnaFormacao(e.target.value)} className="select">
              {['4-3-3','4-4-2','3-5-2','4-5-1','4-2-3-1','5-3-2'].map(f =>
                <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary flex-1" disabled={loadAna} onClick={dispararAna}>
              {loadAna ? <span className="spin">◌</span> : 'Sugerir XI'}
            </button>
            <button className="btn btn-ghost" disabled={loadAna} onClick={rankingAna}>Ranking</button>
          </div>
        </div>

        {/* Gabi */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📰</span>
            <div>
              <h2 className="font-black italic uppercase text-xl leading-none">Gabi</h2>
              <p style={{ color:'#f472b6' }} className="text-[9px] font-black uppercase tracking-widest">Notícias & Resultados</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="label">ID do Jogo</span>
            <input type="number" value={gabiJogoId} onChange={e => setGabiJogoId(e.target.value)}
              placeholder="ex: 13" className="input" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="label">Status</span>
            <select value={gabiStatus} onChange={e => setGabiStatus(e.target.value as 'draft' | 'published')} className="select">
              <option value="draft">Rascunho</option>
              <option value="published">Publicar</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary flex-1" disabled={loadGabi || !gabiJogoId} onClick={publicarGabi}>
              {loadGabi ? <span className="spin">◌</span> : gabiStatus === 'draft' ? 'Gerar Rascunho' : 'Publicar'}
            </button>
            <button className="btn btn-ghost" disabled={loadGabi || !gabiJogoId} onClick={dispararGabi}>Preview</button>
          </div>
          <button className="btn btn-ghost w-full" style={{borderColor:'rgba(244,114,182,0.3)',color:'#f472b6'}} disabled={loadGabi} onClick={ultimoJogoGabi}>
            {loadGabi ? <span className="spin">◌</span> : '⚡ Último Jogo'}
          </button>
        </div>

        {/* Léo */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📣</span>
            <div>
              <h2 className="font-black italic uppercase text-xl leading-none">Léo</h2>
              <p style={{ color:'#fb923c' }} className="text-[9px] font-black uppercase tracking-widest">Marketing & Social</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="label">Evento</span>
            <select value={leoEvento} onChange={e => setLeoEvento(e.target.value)} className="select">
              {['gol','vitória','derrota','goleada_sofrida','reacao_necessaria','empate','pênalti','intervalo','clima','default'].map(ev =>
                <option key={ev} value={ev}>{ev}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <span className="label">Placar M</span>
              <input type="number" value={leoPlacarM} onChange={e => setLeoPlacarM(e.target.value)} placeholder="0" className="input" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="label">Placar V</span>
              <input type="number" value={leoPlacarV} onChange={e => setLeoPlacarV(e.target.value)} placeholder="0" className="input" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="label">Jogador (opcional)</span>
            <input value={leoJogador} onChange={e => setLeoJogador(e.target.value)} placeholder="ex: Carlão" className="input" />
          </div>
          <button className="btn btn-primary mt-auto" disabled={loadLeo} onClick={dispararLeo}>
            {loadLeo ? <span className="spin">◌</span> : 'Gerar Copy'}
          </button>
        </div>

        {/* Carlos */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🔍</span>
            <div>
              <h2 className="font-black italic uppercase text-xl leading-none">Carlos</h2>
              <p style={{ color:'#34d399' }} className="text-[9px] font-black uppercase tracking-widest">Back-office & Auditoria</p>
            </div>
          </div>
          <p className="text-zinc-500 text-xs">Valida escalações duplicadas, slots vazios e sincroniza status dos jogadores.</p>
          <div className="flex flex-col gap-2 mt-auto">
            <button className="btn btn-primary" disabled={loadCarlos} onClick={() => dispararCarlos()}>
              {loadCarlos ? <span className="spin">◌</span> : 'Auditoria Completa'}
            </button>
            <div className="flex gap-2">
              <button className="btn btn-ghost flex-1" disabled={loadCarlos} onClick={() => dispararCarlos('escalacoes')}>Escalações</button>
              <button className="btn btn-ghost flex-1" disabled={loadCarlos} onClick={() => dispararCarlos('jogadores')}>Jogadores</button>
            </div>
          </div>
        </div>

        {/* Bruno */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📲</span>
            <div>
              <h2 className="font-black italic uppercase text-xl leading-none">Bruno</h2>
              <p style={{ color:'#60a5fa' }} className="text-[9px] font-black uppercase tracking-widest">Growth & Retenção</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="label">Janela (horas)</span>
            <input type="number" value={brunoHoras} onChange={e => setBrunoHoras(e.target.value)} placeholder="48" className="input" />
          </div>
          <div className="flex flex-col gap-2 mt-auto">
            <button className="btn btn-primary" disabled={loadBruno} onClick={() => dispararBruno(false)}>
              {loadBruno ? <span className="spin">◌</span> : 'Rodar Campanha'}
            </button>
            <button className="btn btn-ghost" disabled={loadBruno} onClick={() => dispararBruno(true)}>Só Contar Inativos</button>
          </div>
        </div>

        {/* Rafael */}
        <div className="card flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">📊</span>
            <div>
              <h2 className="font-black italic uppercase text-xl leading-none">Rafael</h2>
              <p style={{ color:'#facc15' }} className="text-[9px] font-black uppercase tracking-widest">Analytics & Relatórios</p>
            </div>
          </div>
          <p className="text-zinc-500 text-xs">Coleta métricas da semana atual vs semana anterior. Envia resumo no Telegram se configurado.</p>
          <button className="btn btn-primary mt-auto" disabled={loadRafael} onClick={dispararRafael}>
            {loadRafael ? <span className="spin">◌</span> : 'Relatório Semanal'}
          </button>
        </div>

      </div>

      {/* ── Terminal ─────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] font-black uppercase tracking-[.35em] text-zinc-600">Terminal</p>
          {logs.length > 0 && (
            <button className="btn btn-ghost text-[9px] px-3 py-1" onClick={() => setLogs([])}>Limpar</button>
          )}
        </div>
        <div
          ref={logRef}
          className="bg-[#0a0a0a] border border-white/7 rounded-2xl p-5 h-96 overflow-y-auto font-mono text-xs space-y-3"
        >
          {logs.length === 0 ? (
            <p className="text-zinc-700">Dispare um agente para ver a resposta aqui...</p>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold ${l.ok ? 'text-green-400' : 'text-red-400'}`}>{l.ok ? '✓' : '✗'}</span>
                  <span style={{ color: l.cor }} className="font-bold text-[10px] uppercase tracking-widest">{l.agente}</span>
                  <span className="text-zinc-700 text-[10px]">{l.ts}</span>
                </div>
                <pre className="text-zinc-300 whitespace-pre-wrap break-all text-[11px] pl-5 leading-relaxed">
                  {JSON.stringify(l.dados, null, 2)}
                </pre>
              </div>
            ))
          )}
        </div>
      </div>

    </main>
  );
}
