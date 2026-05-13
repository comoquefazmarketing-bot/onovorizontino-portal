'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FONT = "'Barlow Condensed', sans-serif";
const STORAGE_KEY = 'escritorio_log_v2';

// ── Tipos ─────────────────────────────────────────────────────────────────────
type AgentStatus = 'idle' | 'working' | 'done' | 'error';

interface LogItem {
  id: string;
  agenteId: string;
  ts: number;
  status: 'working' | 'done' | 'error';
  tarefa: string;
  resultado?: string;
}

interface AgentState {
  status: AgentStatus;
  ultimaTarefa?: string;
  ts?: number;
}

interface Acao {
  id: string;
  label: string;
  method: 'GET' | 'POST';
  path: string;
  params?: Record<string, string | number>;
  body?: Record<string, unknown>;
}

interface Agente {
  id: string;
  nome: string;
  cargo: string;
  descricao: string;
  inicial: string;
  cor: string;
  sombra: string;
  corBg: string;
  acoes: Acao[];
}

// ── Definições dos agentes ───────────────────────────────────────────────────
const AGENTES: Agente[] = [
  {
    id: 'gabi',
    nome: 'Gabi',
    cargo: 'Repórter de Jogos',
    descricao: 'Cobertura dos resultados e publicação automática de notícias pós-jogo.',
    inicial: 'G',
    cor: '#F5C400',
    sombra: 'rgba(245,196,0,0.25)',
    corBg: 'rgba(245,196,0,0.06)',
    acoes: [
      { id: 'preview', label: '📰 Prévia do próximo jogo', method: 'GET', path: '/api/agents/gabi' },
    ],
  },
  {
    id: 'ana',
    nome: 'Ana',
    cargo: 'Analista de Escalações',
    descricao: 'Sugere formações otimizadas e analisa escalações do Tigre FC com IA.',
    inicial: 'A',
    cor: '#00F3FF',
    sombra: 'rgba(0,243,255,0.2)',
    corBg: 'rgba(0,243,255,0.04)',
    acoes: [
      { id: 'sug433', label: '⚽ Sugerir 4-3-3', method: 'GET', path: '/api/agents/ana', params: { formacao: '4-3-3' } },
      { id: 'sug442', label: '⚽ Sugerir 4-4-2', method: 'GET', path: '/api/agents/ana', params: { formacao: '4-4-2' } },
      { id: 'sug4231', label: '⚽ Sugerir 4-2-3-1', method: 'GET', path: '/api/agents/ana', params: { formacao: '4-2-3-1' } },
      { id: 'rankATA', label: '🏃 Top Atacantes', method: 'GET', path: '/api/agents/ana', params: { ranking: 'ATA' } },
      { id: 'rankZAG', label: '🛡 Top Zagueiros', method: 'GET', path: '/api/agents/ana', params: { ranking: 'ZAG' } },
      { id: 'rodada', label: '📅 Status da Rodada', method: 'GET', path: '/api/agents/ana/rodada' },
    ],
  },
  {
    id: 'leo',
    nome: 'Léo',
    cargo: 'Marketing & Social',
    descricao: 'Cria copies explosivos para redes sociais. Mestre em hype e engajamento digital.',
    inicial: 'L',
    cor: '#C084FC',
    sombra: 'rgba(192,132,252,0.25)',
    corBg: 'rgba(192,132,252,0.04)',
    acoes: [
      { id: 'hype_vit', label: '🏆 Copy de Vitória', method: 'GET', path: '/api/agents/hype', params: { evento: 'vitoria' } },
      { id: 'hype_gol', label: '⚽ Copy de Gol', method: 'GET', path: '/api/agents/hype', params: { evento: 'gol' } },
      { id: 'hype_pen', label: '😬 Copy de Pênalti', method: 'GET', path: '/api/agents/hype', params: { evento: 'penalti' } },
      { id: 'hype_batch', label: '🎯 3 variações (A/B)', method: 'GET', path: '/api/agents/hype', params: { evento: 'vitoria', batch: 3 } },
    ],
  },
  {
    id: 'carlos',
    nome: 'Carlos',
    cargo: 'Auditor de Dados',
    descricao: 'Monitora integridade do banco, valida escalações e sincroniza status dos jogadores.',
    inicial: 'C',
    cor: '#FF2244',
    sombra: 'rgba(255,34,68,0.25)',
    corBg: 'rgba(255,34,68,0.04)',
    acoes: [
      { id: 'audit_all', label: '🔍 Auditoria Completa', method: 'GET', path: '/api/agents/audit' },
      { id: 'audit_esc', label: '📋 Auditar Escalações', method: 'POST', path: '/api/agents/audit', body: { tabela: 'escalacoes' } },
      { id: 'sync_jog', label: '🔄 Sincronizar Jogadores', method: 'POST', path: '/api/agents/audit', body: { tabela: 'jogadores' } },
    ],
  },
  {
    id: 'bruno',
    nome: 'Bruno',
    cargo: 'Growth & Retenção',
    descricao: 'Detecta fãs inativos e dispara campanhas personalizadas de reengajamento por push.',
    inicial: 'B',
    cor: '#4ADE80',
    sombra: 'rgba(74,222,128,0.2)',
    corBg: 'rgba(74,222,128,0.04)',
    acoes: [
      { id: 'count_48', label: '📊 Contar inativos (48h)', method: 'POST', path: '/api/agents/campanha', body: { apenas_contar: true } },
      { id: 'count_24', label: '📊 Contar inativos (24h)', method: 'POST', path: '/api/agents/campanha', body: { horas: 24, apenas_contar: true } },
      { id: 'campanha', label: '🚀 Rodar campanha completa', method: 'GET', path: '/api/agents/campanha' },
    ],
  },
  {
    id: 'rafael',
    nome: 'Rafael',
    cargo: 'Analytics & Relatórios',
    descricao: 'Coleta métricas semanais e gera relatórios de performance com notas por categoria.',
    inicial: 'R',
    cor: '#60A5FA',
    sombra: 'rgba(96,165,250,0.2)',
    corBg: 'rgba(96,165,250,0.04)',
    acoes: [
      { id: 'rel_1', label: '📈 Relatório desta semana', method: 'GET', path: '/api/agents/rafael' },
      { id: 'rel_2', label: '📈 Comparativo 2 semanas', method: 'GET', path: '/api/agents/rafael', params: { semanas: 2 } },
    ],
  },
];

// ── Utilitários de log ────────────────────────────────────────────────────────
function loadLog(): LogItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}
function saveLog(log: LogItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log.slice(0, 60)));
}
function formatTs(ts: number) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function formatResult(raw: string): string {
  try {
    const parsed = JSON.parse(raw);
    return JSON.stringify(parsed, null, 2);
  } catch { return raw; }
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ agente, size = 56, working }: { agente: Agente; size?: number; working: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {working && (
        <motion.div
          className="absolute rounded-full"
          style={{
            inset: -3,
            border: `2px solid ${agente.cor}`,
            boxShadow: `0 0 12px ${agente.cor}`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-black select-none"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${agente.cor}50, ${agente.cor}12)`,
          border: `2px solid ${agente.cor}35`,
          color: agente.cor,
          fontSize: size * 0.38,
          boxShadow: working ? `0 0 20px ${agente.sombra}` : `inset 0 0 20px ${agente.cor}15`,
          letterSpacing: '-0.02em',
        }}
      >
        {agente.inicial}
      </div>
      {/* Status dot */}
      <div
        className="absolute bottom-0 right-0 rounded-full border-2 border-[#0a0a0a]"
        style={{
          width: size * 0.26,
          height: size * 0.26,
          background: working ? '#F5C400'
            : 'var(--dot-color, #3f3f46)',
        }}
      />
    </div>
  );
}

// ── Card do agente ────────────────────────────────────────────────────────────
function AgentCard({
  agente,
  state,
  selected,
  onClick,
}: {
  agente: Agente;
  state: AgentState;
  selected: boolean;
  onClick: () => void;
}) {
  const isWorking = state.status === 'working';
  const statusLabel =
    isWorking ? '● EXECUTANDO'
    : state.status === 'done' ? '✓ CONCLUÍDO'
    : state.status === 'error' ? '✗ ERRO'
    : '● AGUARDANDO';
  const statusColor =
    isWorking ? '#F5C400'
    : state.status === 'done' ? '#4ADE80'
    : state.status === 'error' ? '#FF2244'
    : '#52525b';
  const dotColor =
    isWorking ? '#F5C400'
    : state.status === 'done' ? '#4ADE80'
    : state.status === 'error' ? '#FF2244'
    : '#3f3f46';

  return (
    <motion.div
      layout
      onClick={onClick}
      className="relative rounded-2xl p-5 cursor-pointer overflow-hidden group transition-colors"
      style={{
        background: selected ? agente.corBg : 'rgba(255,255,255,0.018)',
        border: `1.5px solid ${selected ? agente.cor + '55' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: selected ? `0 0 32px ${agente.sombra}` : 'none',
        '--dot-color': dotColor,
      } as React.CSSProperties}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Scan line when working */}
      {isWorking && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${agente.cor}08 50%, transparent 100%)` }}
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="flex items-start gap-4">
        <Avatar agente={agente} size={52} working={isWorking} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-black uppercase text-base tracking-tight leading-none" style={{ color: agente.cor }}>
              {agente.nome}
            </span>
            <span className="text-[9px] font-black tracking-[1.5px] flex-shrink-0" style={{ color: statusColor }}>
              {statusLabel}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">{agente.cargo}</p>
          {state.ultimaTarefa && (
            <p className="text-[11px] text-zinc-400 mt-2 truncate">
              {isWorking ? '⚡ ' : '↳ '}{state.ultimaTarefa}
            </p>
          )}
          {state.ts && (
            <p className="text-[10px] text-zinc-700 mt-0.5">{formatTs(state.ts)}</p>
          )}
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed mt-4 pt-3 border-t border-white/5">
        {agente.descricao}
      </p>

      <div
        className="mt-4 w-full py-2 rounded-xl text-[11px] font-black tracking-[2px] uppercase text-center transition-all"
        style={{
          background: selected ? agente.cor : 'rgba(255,255,255,0.04)',
          color: selected ? '#050505' : agente.cor,
          border: `1px solid ${agente.cor}25`,
        }}
      >
        {selected ? '← FECHAR PAINEL' : 'ABRIR PAINEL →'}
      </div>
    </motion.div>
  );
}

// ── Painel lateral ────────────────────────────────────────────────────────────
function AgentPanel({
  agente,
  state,
  log,
  onClose,
  onExecutar,
}: {
  agente: Agente;
  state: AgentState;
  log: LogItem[];
  onClose: () => void;
  onExecutar: (acao: Acao) => void;
}) {
  const isWorking = state.status === 'working';
  const logDoAgente = log.filter(l => l.agenteId === agente.id).slice(0, 20);

  return (
    <motion.div
      key="panel"
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed top-0 right-0 h-full w-full lg:w-[440px] z-50 flex flex-col overflow-hidden"
      style={{
        background: '#080808',
        borderLeft: `1.5px solid ${agente.cor}25`,
        boxShadow: `-24px 0 80px ${agente.sombra}`,
      }}
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-4 p-5 border-b border-white/5 flex-shrink-0"
        style={{ background: agente.corBg }}>
        <Avatar agente={agente} size={48} working={isWorking} />
        <div className="flex-1 min-w-0">
          <p className="font-black uppercase text-xl tracking-tight leading-none" style={{ color: agente.cor }}>
            {agente.nome}
          </p>
          <p className="text-[11px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">{agente.cargo}</p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-sm flex-shrink-0"
        >
          ✕
        </button>
      </div>

      {/* Ações rápidas */}
      <div className="p-5 border-b border-white/5 flex-shrink-0">
        <p className="text-[10px] font-black tracking-[3px] text-zinc-500 uppercase mb-3">SOLICITAR TAREFA</p>
        <div className="flex flex-col gap-2">
          {agente.acoes.map(acao => {
            const running = isWorking && state.ultimaTarefa === acao.label;
            return (
              <button
                key={acao.id}
                onClick={() => onExecutar(acao)}
                disabled={isWorking}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-left flex items-center justify-between transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: running ? `${agente.cor}18` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${running ? agente.cor + '50' : 'rgba(255,255,255,0.07)'}`,
                  color: running ? agente.cor : '#d4d4d8',
                }}
              >
                <span>{acao.label}</span>
                {running ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-xs">
                    ⚙
                  </motion.span>
                ) : (
                  <span className="text-zinc-600 text-xs">▶</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log de atividade */}
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-[10px] font-black tracking-[3px] text-zinc-500 uppercase mb-3">
          LOG DE ATIVIDADE {logDoAgente.length > 0 && <span className="text-zinc-700 normal-case tracking-normal font-bold">({logDoAgente.length})</span>}
        </p>
        {logDoAgente.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🤖</p>
            <p className="text-zinc-600 text-sm font-bold">Nenhuma atividade ainda.</p>
            <p className="text-zinc-700 text-xs mt-1">Execute uma tarefa para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logDoAgente.map(item => (
              <div key={item.id} className="rounded-xl p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm leading-none">
                    {item.status === 'working' ? '⚡' : item.status === 'done' ? '✅' : '❌'}
                  </span>
                  <span className="text-[10px] font-black tracking-[1.5px]"
                    style={{ color: item.status === 'working' ? '#F5C400' : item.status === 'done' ? '#4ADE80' : '#FF2244' }}>
                    {item.status === 'working' ? 'EXECUTANDO' : item.status === 'done' ? 'CONCLUÍDO' : 'ERRO'}
                  </span>
                  <span className="text-[10px] text-zinc-600 ml-auto">{formatTs(item.ts)}</span>
                </div>
                <p className="text-xs font-bold text-zinc-300 mb-2">{item.tarefa}</p>
                {item.resultado && (
                  <pre className="text-[10px] text-zinc-500 font-mono bg-black/50 rounded-lg p-2.5 overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/[0.04]">
                    {formatResult(item.resultado).length > 600
                      ? formatResult(item.resultado).slice(0, 600) + '\n…'
                      : formatResult(item.resultado)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function EscritorioVirtual() {
  const [mounted, setMounted] = useState(false);
  const [agentStates, setAgentStates] = useState<Record<string, AgentState>>({});
  const [log, setLog] = useState<LogItem[]>([]);
  const [selecionado, setSelecionado] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedLog = loadLog();
    setLog(savedLog);
    // Restaura último estado de cada agente a partir do log
    const states: Record<string, AgentState> = {};
    [...savedLog].reverse().forEach(item => {
      if (!states[item.agenteId] && item.status !== 'working') {
        states[item.agenteId] = {
          status: item.status === 'done' ? 'done' : 'error',
          ultimaTarefa: item.tarefa,
          ts: item.ts,
        };
      }
    });
    setAgentStates(states);
  }, []);

  const executarAcao = useCallback(async (agente: Agente, acao: Acao) => {
    const logId = `${agente.id}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();

    setAgentStates(prev => ({
      ...prev,
      [agente.id]: { status: 'working', ultimaTarefa: acao.label, ts: now },
    }));

    const entry: LogItem = { id: logId, agenteId: agente.id, ts: now, status: 'working', tarefa: acao.label };
    setLog(prev => { const next = [entry, ...prev]; saveLog(next); return next; });

    try {
      const res = await fetch('/api/escritorio/executar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: acao.path, method: acao.method, params: acao.params, body: acao.body }),
      });
      const data = await res.json();
      const resultado = JSON.stringify(data, null, 2);

      setAgentStates(prev => ({
        ...prev,
        [agente.id]: { status: 'done', ultimaTarefa: acao.label, ts: Date.now() },
      }));
      setLog(prev => {
        const next = prev.map(i => i.id === logId ? { ...i, status: 'done' as const, resultado } : i);
        saveLog(next); return next;
      });
    } catch (err) {
      const resultado = String(err);
      setAgentStates(prev => ({
        ...prev,
        [agente.id]: { status: 'error', ultimaTarefa: acao.label, ts: Date.now() },
      }));
      setLog(prev => {
        const next = prev.map(i => i.id === logId ? { ...i, status: 'error' as const, resultado } : i);
        saveLog(next); return next;
      });
    }
  }, []);

  const agenteAtual = selecionado ? AGENTES.find(a => a.id === selecionado) ?? null : null;

  if (!mounted) return <div className="min-h-screen bg-[#050505]" />;

  const totalWorking = Object.values(agentStates).filter(s => s.status === 'working').length;

  return (
    <main
      className="min-h-screen bg-[#050505] text-white overflow-x-hidden"
      style={{ fontFamily: FONT }}
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&display=swap');
      `}</style>

      {/* Dot grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Header */}
      <div className="relative pt-16 pb-10 text-center border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(245,196,0,0.07)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <p className="text-[10px] font-black tracking-[6px] text-[#F5C400] uppercase mb-2">EQUIPE MAKARIOS</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            ESCRITÓRIO <span className="text-[#F5C400]">VIRTUAL</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4">
            <span className="text-[11px] text-zinc-500 font-bold tracking-widest uppercase">
              {AGENTES.length} AGENTES
            </span>
            <span className="w-px h-3 bg-white/10" />
            {totalWorking > 0 ? (
              <span className="flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-[#F5C400]">
                <motion.span
                  className="w-2 h-2 rounded-full bg-[#F5C400]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                {totalWorking} EM EXECUÇÃO
              </span>
            ) : (
              <span className="text-[11px] text-zinc-600 font-bold tracking-widest uppercase">AGUARDANDO ORDENS</span>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className={`relative z-10 transition-all duration-300 ${agenteAtual ? 'lg:mr-[440px]' : ''}`}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {AGENTES.map(agente => (
              <AgentCard
                key={agente.id}
                agente={agente}
                state={agentStates[agente.id] ?? { status: 'idle' }}
                selected={selecionado === agente.id}
                onClick={() => setSelecionado(selecionado === agente.id ? null : agente.id)}
              />
            ))}
          </div>

          {/* Rodapé */}
          <div className="mt-16 pt-8 border-t border-white/[0.05] text-center">
            <p className="text-[10px] text-zinc-700 font-bold tracking-[4px] uppercase">
              Escritório Virtual • Equipe Makarios • By Felipe Makarios
            </p>
          </div>
        </div>
      </div>

      {/* Painel lateral */}
      <AnimatePresence>
        {agenteAtual && (
          <>
            {/* Overlay mobile */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelecionado(null)}
            />
            <AgentPanel
              agente={agenteAtual}
              state={agentStates[agenteAtual.id] ?? { status: 'idle' }}
              log={log}
              onClose={() => setSelecionado(null)}
              onExecutar={(acao) => executarAcao(agenteAtual, acao)}
            />
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
