'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const FONT = "'Barlow Condensed', sans-serif";
const STORAGE_LOG  = 'escritorio_log_v3';
const STORAGE_AUTO = 'escritorio_auto_v1';

// ── Tipos ─────────────────────────────────────────────────────────────────────
type AgentStatus = 'idle' | 'working' | 'done' | 'error';

interface LogItem {
  id: string;
  agenteId: string;
  ts: number;
  status: 'working' | 'done' | 'error';
  tarefa: string;
  auto: boolean;
  resultado?: string;
}

interface AgentState {
  status: AgentStatus;
  ultimaTarefa?: string;
  auto?: boolean;
  ts?: number;
}

interface Acao {
  id: string;
  label: string;
  method: 'GET' | 'POST';
  path: string;
  params?: Record<string, string | number>;
  body?: Record<string, unknown>;
  primary?: boolean; // ação usada no modo autônomo
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
  scheduleMs?: number;  // intervalo de auto-execução em ms
  acoes: Acao[];
}

// ── Definições dos agentes ───────────────────────────────────────────────────
const AGENTES: Agente[] = [
  {
    id: 'gabi',
    nome: 'Gabi',
    cargo: 'Repórter de Jogos',
    descricao: 'Monitora jogos finalizados e gera notícias automáticas pós-jogo.',
    inicial: 'G',
    cor: '#F5C400',
    sombra: 'rgba(245,196,0,0.25)',
    corBg: 'rgba(245,196,0,0.06)',
    scheduleMs: 30 * 60 * 1000, // 30 min
    acoes: [
      { id: 'auto',    label: '📰 Verificar último resultado', method: 'GET', path: '/api/agents/gabi', params: { auto: 1 }, primary: true },
      { id: 'ratings', label: '⭐ Ratings SofaScore (último jogo)', method: 'GET', path: '/api/tigre-fc/sofascore-ultimo-jogo-ratings' },
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
    scheduleMs: 60 * 60 * 1000, // 1h
    acoes: [
      { id: 'rodada',   label: '📅 Status da Rodada', method: 'GET', path: '/api/agents/ana/rodada', primary: true },
      { id: 'ratings',  label: '⭐ Capitão & Herói (SofaScore)', method: 'GET', path: '/api/tigre-fc/sofascore-ultimo-jogo-ratings' },
      { id: 'sug433',   label: '⚽ Sugerir 4-3-3', method: 'GET', path: '/api/agents/ana', params: { formacao: '4-3-3' } },
      { id: 'sug442',   label: '⚽ Sugerir 4-4-2', method: 'GET', path: '/api/agents/ana', params: { formacao: '4-4-2' } },
      { id: 'sug4231',  label: '⚽ Sugerir 4-2-3-1', method: 'GET', path: '/api/agents/ana', params: { formacao: '4-2-3-1' } },
      { id: 'rankATA',  label: '🏃 Top Atacantes', method: 'GET', path: '/api/agents/ana', params: { ranking: 'ATA' } },
      { id: 'rankZAG',  label: '🛡 Top Zagueiros', method: 'GET', path: '/api/agents/ana', params: { ranking: 'ZAG' } },
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
    scheduleMs: 45 * 60 * 1000, // 45 min
    acoes: [
      { id: 'hype_vit', label: '🏆 Copy de Vitória', method: 'GET', path: '/api/agents/hype', params: { evento: 'vitoria' }, primary: true },
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
    scheduleMs: 3 * 60 * 60 * 1000, // 3h
    acoes: [
      { id: 'audit_all', label: '🔍 Auditoria Completa', method: 'GET', path: '/api/agents/audit', primary: true },
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
    scheduleMs: 6 * 60 * 60 * 1000, // 6h
    acoes: [
      { id: 'count_48', label: '📊 Contar inativos (48h)', method: 'POST', path: '/api/agents/campanha', body: { apenas_contar: true }, primary: true },
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
    scheduleMs: 12 * 60 * 60 * 1000, // 12h
    acoes: [
      { id: 'rel_1', label: '📈 Relatório desta semana', method: 'GET', path: '/api/agents/rafael', primary: true },
      { id: 'rel_2', label: '📈 Comparativo 2 semanas', method: 'GET', path: '/api/agents/rafael', params: { semanas: 2 } },
    ],
  },
];

// ── Utilitários ───────────────────────────────────────────────────────────────
function loadLog(): LogItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_LOG) ?? '[]'); } catch { return []; }
}
function saveLog(log: LogItem[]) {
  localStorage.setItem(STORAGE_LOG, JSON.stringify(log.slice(0, 80)));
}
function loadAuto(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(STORAGE_AUTO) ?? '{}'); } catch { return {}; }
}
function saveAuto(auto: Record<string, boolean>) {
  localStorage.setItem(STORAGE_AUTO, JSON.stringify(auto));
}
function formatTs(ts: number) {
  return new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
function formatCountdown(ms: number): string {
  if (ms <= 0) return 'agora';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}min`;
  if (m > 0) return `${m}min ${s % 60}s`;
  return `${s}s`;
}
function formatResult(raw: string): string {
  try { return JSON.stringify(JSON.parse(raw), null, 2); } catch { return raw; }
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ agente, size = 56, working, auto }: { agente: Agente; size?: number; working: boolean; auto: boolean }) {
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      {working && (
        <motion.div
          className="absolute rounded-full"
          style={{ inset: -3, border: `2px solid ${agente.cor}`, boxShadow: `0 0 14px ${agente.cor}` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}
      {auto && !working && (
        <motion.div
          className="absolute rounded-full"
          style={{ inset: -3, border: `1.5px dashed ${agente.cor}60` }}
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      )}
      <div
        className="w-full h-full rounded-full flex items-center justify-center font-black select-none"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${agente.cor}50, ${agente.cor}12)`,
          border: `2px solid ${agente.cor}35`,
          color: agente.cor,
          fontSize: size * 0.38,
          boxShadow: (working || auto) ? `0 0 22px ${agente.sombra}` : `inset 0 0 20px ${agente.cor}15`,
          letterSpacing: '-0.02em',
        }}
      >
        {agente.inicial}
      </div>
      <div
        className="absolute bottom-0 right-0 rounded-full border-2 border-[#0a0a0a]"
        style={{
          width: size * 0.26,
          height: size * 0.26,
          background: working ? '#F5C400' : auto ? agente.cor : '#3f3f46',
        }}
      />
    </div>
  );
}

// ── Card do agente ────────────────────────────────────────────────────────────
function AgentCard({
  agente, state, selected, modoAuto, nextRun, onToggleAuto, onClick,
}: {
  agente: Agente; state: AgentState; selected: boolean;
  modoAuto: boolean; nextRun: number | null;
  onToggleAuto: () => void; onClick: () => void;
}) {
  const isWorking = state.status === 'working';
  const statusLabel =
    isWorking ? '● EXECUTANDO'
    : state.status === 'done' ? '✓ CONCLUÍDO'
    : state.status === 'error' ? '✗ ERRO'
    : modoAuto ? '⟳ AUTO'
    : '● AGUARDANDO';
  const statusColor =
    isWorking ? '#F5C400'
    : state.status === 'done' ? '#4ADE80'
    : state.status === 'error' ? '#FF2244'
    : modoAuto ? agente.cor
    : '#52525b';

  return (
    <motion.div
      layout
      className="relative rounded-2xl p-5 overflow-hidden group"
      style={{
        background: selected ? agente.corBg : 'rgba(255,255,255,0.018)',
        border: `1.5px solid ${selected ? agente.cor + '55' : modoAuto ? agente.cor + '25' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: selected ? `0 0 32px ${agente.sombra}` : modoAuto ? `0 0 16px ${agente.sombra}` : 'none',
      }}
      whileHover={{ scale: 1.012 }}
      whileTap={{ scale: 0.985 }}
    >
      {isWorking && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${agente.cor}07 50%, transparent 100%)` }}
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="flex items-start gap-4">
        <Avatar agente={agente} size={52} working={isWorking} auto={modoAuto} />
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
              {isWorking ? '⚡ ' : state.auto ? '🤖 ' : '↳ '}{state.ultimaTarefa}
            </p>
          )}
          {modoAuto && nextRun !== null && !isWorking && (
            <p className="text-[10px] mt-0.5" style={{ color: agente.cor + 'aa' }}>
              próx. execução: {formatCountdown(nextRun - Date.now())}
            </p>
          )}
          {!modoAuto && state.ts && (
            <p className="text-[10px] text-zinc-700 mt-0.5">{formatTs(state.ts)}</p>
          )}
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed mt-4 pt-3 border-t border-white/5">
        {agente.descricao}
      </p>

      <div className="mt-4 flex gap-2">
        {/* Toggle autônomo */}
        {agente.scheduleMs && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleAuto(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-[1.5px] uppercase transition-all"
            style={{
              background: modoAuto ? agente.cor + '20' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${modoAuto ? agente.cor + '60' : 'rgba(255,255,255,0.08)'}`,
              color: modoAuto ? agente.cor : '#52525b',
            }}
          >
            <span className="text-xs">{modoAuto ? '🤖' : '○'}</span>
            AUTO
          </button>
        )}
        {/* Abrir painel */}
        <button
          onClick={onClick}
          className="flex-1 py-1.5 rounded-xl text-[11px] font-black tracking-[2px] uppercase transition-all"
          style={{
            background: selected ? agente.cor : 'rgba(255,255,255,0.04)',
            color: selected ? '#050505' : agente.cor,
            border: `1px solid ${agente.cor}25`,
          }}
        >
          {selected ? '← FECHAR' : 'ABRIR PAINEL →'}
        </button>
      </div>
    </motion.div>
  );
}

// ── Painel lateral ────────────────────────────────────────────────────────────
function AgentPanel({
  agente, state, log, modoAuto, onClose, onExecutar, onToggleAuto,
}: {
  agente: Agente; state: AgentState; log: LogItem[];
  modoAuto: boolean;
  onClose: () => void;
  onExecutar: (acao: Acao) => void;
  onToggleAuto: () => void;
}) {
  const isWorking = state.status === 'working';
  const logDoAgente = log.filter(l => l.agenteId === agente.id).slice(0, 25);

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
      {/* Header */}
      <div className="flex items-center gap-4 p-5 border-b border-white/5 flex-shrink-0" style={{ background: agente.corBg }}>
        <Avatar agente={agente} size={48} working={isWorking} auto={modoAuto} />
        <div className="flex-1 min-w-0">
          <p className="font-black uppercase text-xl tracking-tight leading-none" style={{ color: agente.cor }}>{agente.nome}</p>
          <p className="text-[11px] text-zinc-500 font-bold tracking-widest uppercase mt-0.5">{agente.cargo}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors text-sm flex-shrink-0">
          ✕
        </button>
      </div>

      {/* Modo autônomo */}
      {agente.scheduleMs && (
        <div className="px-5 py-3 border-b border-white/5 flex-shrink-0 flex items-center justify-between"
          style={{ background: modoAuto ? agente.corBg : 'transparent' }}>
          <div>
            <p className="text-xs font-black tracking-[2px] uppercase" style={{ color: modoAuto ? agente.cor : '#52525b' }}>
              {modoAuto ? '🤖 MODO AUTÔNOMO ATIVO' : '○ MODO AUTÔNOMO'}
            </p>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              Execução automática a cada {formatCountdown(agente.scheduleMs)}
            </p>
          </div>
          <button
            onClick={onToggleAuto}
            className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
            style={{ background: modoAuto ? agente.cor : '#27272a' }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
              animate={{ left: modoAuto ? '22px' : '2px' }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
          </button>
        </div>
      )}

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
                  background: running ? `${agente.cor}18` : acao.primary ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${running ? agente.cor + '50' : acao.primary ? agente.cor + '25' : 'rgba(255,255,255,0.07)'}`,
                  color: running ? agente.cor : acao.primary ? '#e4e4e7' : '#a1a1aa',
                }}
              >
                <span>{acao.label}{acao.primary ? <span className="ml-2 text-[9px] tracking-widest opacity-50">PRIMÁRIA</span> : null}</span>
                {running ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="text-xs">⚙</motion.span>
                ) : (
                  <span className="text-zinc-600 text-xs">▶</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-[10px] font-black tracking-[3px] text-zinc-500 uppercase mb-3">
          LOG DE ATIVIDADE
          {logDoAgente.length > 0 && <span className="text-zinc-700 normal-case tracking-normal font-bold ml-1">({logDoAgente.length})</span>}
        </p>
        {logDoAgente.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">🤖</p>
            <p className="text-zinc-600 text-sm font-bold">Nenhuma atividade ainda.</p>
            <p className="text-zinc-700 text-xs mt-1">Execute uma tarefa ou ative o modo autônomo.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logDoAgente.map(item => (
              <div key={item.id} className="rounded-xl p-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm leading-none">
                    {item.status === 'working' ? '⚡' : item.status === 'done' ? '✅' : '❌'}
                  </span>
                  {item.auto && (
                    <span className="text-[9px] font-black tracking-[1.5px] px-1.5 py-0.5 rounded" style={{ background: agente.cor + '20', color: agente.cor }}>
                      AUTO
                    </span>
                  )}
                  <span className="text-[10px] font-black tracking-[1.5px]"
                    style={{ color: item.status === 'working' ? '#F5C400' : item.status === 'done' ? '#4ADE80' : '#FF2244' }}>
                    {item.status === 'working' ? 'EXECUTANDO' : item.status === 'done' ? 'CONCLUÍDO' : 'ERRO'}
                  </span>
                  <span className="text-[10px] text-zinc-600 ml-auto">{formatTs(item.ts)}</span>
                </div>
                <p className="text-xs font-bold text-zinc-300 mb-2">{item.tarefa}</p>
                {item.resultado && (
                  <pre className="text-[10px] text-zinc-500 font-mono bg-black/50 rounded-lg p-2.5 overflow-x-auto max-h-44 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/[0.04]">
                    {formatResult(item.resultado).length > 700
                      ? formatResult(item.resultado).slice(0, 700) + '\n…'
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

// ── Tela de acesso negado ─────────────────────────────────────────────────────
function AcessoNegado() {
  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center" style={{ fontFamily: FONT }}>
      <div className="text-center px-6">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
          ACESSO <span className="text-[#FF2244]">RESTRITO</span>
        </h1>
        <p className="text-zinc-600 text-sm font-bold tracking-widest uppercase">
          Área exclusiva do administrador
        </p>
      </div>
    </main>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function EscritorioVirtual() {
  const [mounted, setMounted]           = useState(false);
  const [acesso, setAcesso]             = useState<'verificando' | 'ok' | 'negado'>('verificando');
  const [agentStates, setAgentStates]   = useState<Record<string, AgentState>>({});
  const [log, setLog]                   = useState<LogItem[]>([]);
  const [modoAuto, setModoAuto]         = useState<Record<string, boolean>>({});
  const [selecionado, setSelecionado]   = useState<string | null>(null);
  const [tick, setTick]                 = useState(0);
  const nextRunRef = useRef<Record<string, number>>({});

  useEffect(() => {
    setMounted(true);

    async function verificarAcesso() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) { setAcesso('negado'); return; }

        const res = await fetch('/api/escritorio/is-admin', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const { admin } = await res.json();
        setAcesso(admin ? 'ok' : 'negado');
      } catch {
        setAcesso('negado');
      }
    }

    verificarAcesso();

    const savedLog  = loadLog();
    const savedAuto = loadAuto();
    setLog(savedLog);
    setModoAuto(savedAuto);

    // Restaura estado de cada agente a partir do log
    const states: Record<string, AgentState> = {};
    [...savedLog].reverse().forEach(item => {
      if (!states[item.agenteId] && item.status !== 'working') {
        states[item.agenteId] = {
          status: item.status === 'done' ? 'done' : 'error',
          ultimaTarefa: item.tarefa,
          auto: item.auto,
          ts: item.ts,
        };
      }
    });
    setAgentStates(states);

    const tickId = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(tickId);
  }, []);

  const executarAcao = useCallback(async (agente: Agente, acao: Acao, isAuto = false) => {
    const logId = `${agente.id}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const now   = Date.now();

    setAgentStates(prev => ({
      ...prev,
      [agente.id]: { status: 'working', ultimaTarefa: acao.label, auto: isAuto, ts: now },
    }));

    const entry: LogItem = { id: logId, agenteId: agente.id, ts: now, status: 'working', tarefa: acao.label, auto: isAuto };
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
        [agente.id]: { status: 'done', ultimaTarefa: acao.label, auto: isAuto, ts: Date.now() },
      }));
      setLog(prev => {
        const next = prev.map(i => i.id === logId ? { ...i, status: 'done' as const, resultado } : i);
        saveLog(next); return next;
      });
    } catch (err) {
      setAgentStates(prev => ({
        ...prev,
        [agente.id]: { status: 'error', ultimaTarefa: acao.label, auto: isAuto, ts: Date.now() },
      }));
      setLog(prev => {
        const next = prev.map(i => i.id === logId ? { ...i, status: 'error' as const, resultado: String(err) } : i);
        saveLog(next); return next;
      });
    }
  }, []);

  // ── Modo autônomo: agendamento de cada agente ──────────────────────────────
  useEffect(() => {
    if (!mounted) return;
    const intervals: ReturnType<typeof setInterval>[] = [];

    AGENTES.forEach(agente => {
      if (!agente.scheduleMs || !modoAuto[agente.id]) return;
      const primaryAcao = agente.acoes.find(a => a.primary) ?? agente.acoes[0];

      // Executa imediatamente na primeira ativação
      const now = Date.now();
      if (!nextRunRef.current[agente.id] || nextRunRef.current[agente.id] <= now) {
        executarAcao(agente, primaryAcao, true);
        nextRunRef.current[agente.id] = now + agente.scheduleMs;
      }

      const id = setInterval(() => {
        nextRunRef.current[agente.id] = Date.now() + agente.scheduleMs!;
        executarAcao(agente, primaryAcao, true);
      }, agente.scheduleMs);
      intervals.push(id);
    });

    return () => intervals.forEach(clearInterval);
  }, [mounted, modoAuto, executarAcao]);

  const toggleAuto = useCallback((agenteId: string) => {
    setModoAuto(prev => {
      const next = { ...prev, [agenteId]: !prev[agenteId] };
      if (!next[agenteId]) delete nextRunRef.current[agenteId];
      saveAuto(next);
      return next;
    });
  }, []);

  const agenteAtual = selecionado ? AGENTES.find(a => a.id === selecionado) ?? null : null;
  const totalWorking = Object.values(agentStates).filter(s => s.status === 'working').length;
  const totalAuto    = Object.values(modoAuto).filter(Boolean).length;

  if (!mounted || acesso === 'verificando') return <div className="min-h-screen bg-[#050505]" />;
  if (acesso === 'negado') return <AcessoNegado />;

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden" style={{ fontFamily: FONT }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&display=swap');
      `}</style>

      {/* Dot grid */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />

      {/* Header */}
      <div className="relative pt-16 pb-10 text-center border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(245,196,0,0.07)_0%,transparent_70%)]" />
        <div className="relative z-10">
          <p className="text-[10px] font-black tracking-[6px] text-[#F5C400] uppercase mb-2">EQUIPE MAKARIOS</p>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            ESCRITÓRIO <span className="text-[#F5C400]">VIRTUAL</span>
          </h1>
          <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
            <span className="text-[11px] text-zinc-500 font-bold tracking-widest uppercase">{AGENTES.length} AGENTES</span>
            <span className="w-px h-3 bg-white/10" />
            {totalWorking > 0 && (
              <>
                <span className="flex items-center gap-1.5 text-[11px] font-black tracking-widest uppercase text-[#F5C400]">
                  <motion.span className="w-2 h-2 rounded-full bg-[#F5C400]" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }} />
                  {totalWorking} EXECUTANDO
                </span>
                <span className="w-px h-3 bg-white/10" />
              </>
            )}
            {totalAuto > 0 ? (
              <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: '#4ADE80' }}>
                🤖 {totalAuto} EM MODO AUTO
              </span>
            ) : (
              <span className="text-[11px] text-zinc-600 font-bold tracking-widest uppercase">AGUARDANDO ORDENS</span>
            )}
          </div>
        </div>
      </div>

      <div className={`relative z-10 transition-all duration-300 ${agenteAtual ? 'lg:mr-[440px]' : ''}`}>
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {AGENTES.map(agente => (
              <AgentCard
                key={agente.id}
                agente={agente}
                state={agentStates[agente.id] ?? { status: 'idle' }}
                selected={selecionado === agente.id}
                modoAuto={!!modoAuto[agente.id]}
                nextRun={nextRunRef.current[agente.id] ?? null}
                onToggleAuto={() => toggleAuto(agente.id)}
                onClick={() => setSelecionado(selecionado === agente.id ? null : agente.id)}
              />
            ))}
          </div>
          <div className="mt-16 pt-8 border-t border-white/[0.05] text-center">
            <p className="text-[10px] text-zinc-700 font-bold tracking-[4px] uppercase">
              Escritório Virtual • Equipe Makarios • By Felipe Makarios
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {agenteAtual && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelecionado(null)}
            />
            <AgentPanel
              agente={agenteAtual}
              state={agentStates[agenteAtual.id] ?? { status: 'idle' }}
              log={log}
              modoAuto={!!modoAuto[agenteAtual.id]}
              onClose={() => setSelecionado(null)}
              onExecutar={(acao) => executarAcao(agenteAtual, acao, false)}
              onToggleAuto={() => toggleAuto(agenteAtual.id)}
            />
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
