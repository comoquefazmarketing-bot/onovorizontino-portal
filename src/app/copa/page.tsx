'use client';

import { useState, useMemo, useCallback } from 'react';
import CopaSubnav from '@/components/layout/CopaSubnav';

/* ══════════════════════════════════════════════════════
   TIPOS
══════════════════════════════════════════════════════ */
interface Time {
  nome: string;
  curto: string;
  abrev: string;
  bandeira: string;
}

interface GrupoConfig {
  id: string;
  times: [Time, Time, Time, Time];
}

interface Standing {
  time: Time;
  pos: number;
  P: number; J: number; V: number; E: number; D: number;
  GP: number; GC: number; SG: number;
  grupo?: string;
}

type ScoreVal = number | '';
type ResultadoMap = Record<string, { gm: ScoreVal; gv: ScoreVal }>;
type Aba = 'tabela' | 'simulador' | 'calculadora';

/* ══════════════════════════════════════════════════════
   DADOS — 12 GRUPOS DA COPA 2026
══════════════════════════════════════════════════════ */
const GRUPOS: GrupoConfig[] = [
  { id: 'A', times: [
    { nome: 'México',         curto: 'México',      abrev: 'MEX', bandeira: '🇲🇽' },
    { nome: 'África do Sul',  curto: 'África do Sul',abrev: 'RSA', bandeira: '🇿🇦' },
    { nome: 'Coreia do Sul',  curto: 'Coreia do Sul',abrev: 'KOR', bandeira: '🇰🇷' },
    { nome: 'Rep. Tcheca',    curto: 'Tcheca',       abrev: 'CZE', bandeira: '🇨🇿' },
  ]},
  { id: 'B', times: [
    { nome: 'Canadá',         curto: 'Canadá',       abrev: 'CAN', bandeira: '🇨🇦' },
    { nome: 'Suíça',          curto: 'Suíça',        abrev: 'SUI', bandeira: '🇨🇭' },
    { nome: 'Catar',          curto: 'Catar',        abrev: 'QAT', bandeira: '🇶🇦' },
    { nome: 'Bósnia e Herz.', curto: 'Bósnia',       abrev: 'BIH', bandeira: '🇧🇦' },
  ]},
  { id: 'C', times: [
    { nome: 'Brasil',         curto: 'Brasil',       abrev: 'BRA', bandeira: '🇧🇷' },
    { nome: 'Marrocos',       curto: 'Marrocos',     abrev: 'MAR', bandeira: '🇲🇦' },
    { nome: 'Haiti',          curto: 'Haiti',        abrev: 'HAI', bandeira: '🇭🇹' },
    { nome: 'Escócia',        curto: 'Escócia',      abrev: 'SCO', bandeira: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  ]},
  { id: 'D', times: [
    { nome: 'Estados Unidos', curto: 'EUA',          abrev: 'USA', bandeira: '🇺🇸' },
    { nome: 'Paraguai',       curto: 'Paraguai',     abrev: 'PAR', bandeira: '🇵🇾' },
    { nome: 'Turquia',        curto: 'Turquia',      abrev: 'TUR', bandeira: '🇹🇷' },
    { nome: 'Austrália',      curto: 'Austrália',    abrev: 'AUS', bandeira: '🇦🇺' },
  ]},
  { id: 'E', times: [
    { nome: 'Alemanha',       curto: 'Alemanha',     abrev: 'GER', bandeira: '🇩🇪' },
    { nome: 'Equador',        curto: 'Equador',      abrev: 'ECU', bandeira: '🇪🇨' },
    { nome: 'C. do Marfim',   curto: 'C. Marfim',    abrev: 'CIV', bandeira: '🇨🇮' },
    { nome: 'Curaçau',        curto: 'Curaçau',      abrev: 'CUW', bandeira: '🇨🇼' },
  ]},
  { id: 'F', times: [
    { nome: 'Holanda',        curto: 'Holanda',      abrev: 'NED', bandeira: '🇳🇱' },
    { nome: 'Japão',          curto: 'Japão',        abrev: 'JPN', bandeira: '🇯🇵' },
    { nome: 'Suécia',         curto: 'Suécia',       abrev: 'SWE', bandeira: '🇸🇪' },
    { nome: 'Tunísia',        curto: 'Tunísia',      abrev: 'TUN', bandeira: '🇹🇳' },
  ]},
  { id: 'G', times: [
    { nome: 'Bélgica',        curto: 'Bélgica',      abrev: 'BEL', bandeira: '🇧🇪' },
    { nome: 'Egito',          curto: 'Egito',        abrev: 'EGY', bandeira: '🇪🇬' },
    { nome: 'Irã',            curto: 'Irã',          abrev: 'IRN', bandeira: '🇮🇷' },
    { nome: 'Nova Zelândia',  curto: 'Nova Zelândia',abrev: 'NZL', bandeira: '🇳🇿' },
  ]},
  { id: 'H', times: [
    { nome: 'Espanha',        curto: 'Espanha',      abrev: 'ESP', bandeira: '🇪🇸' },
    { nome: 'Cabo Verde',     curto: 'Cabo Verde',   abrev: 'CPV', bandeira: '🇨🇻' },
    { nome: 'Arábia Saudita', curto: 'Arábia Saudita',abrev:'KSA', bandeira: '🇸🇦' },
    { nome: 'Uruguai',        curto: 'Uruguai',      abrev: 'URU', bandeira: '🇺🇾' },
  ]},
  { id: 'I', times: [
    { nome: 'França',         curto: 'França',       abrev: 'FRA', bandeira: '🇫🇷' },
    { nome: 'Senegal',        curto: 'Senegal',      abrev: 'SEN', bandeira: '🇸🇳' },
    { nome: 'Iraque',         curto: 'Iraque',       abrev: 'IRQ', bandeira: '🇮🇶' },
    { nome: 'Noruega',        curto: 'Noruega',      abrev: 'NOR', bandeira: '🇳🇴' },
  ]},
  { id: 'J', times: [
    { nome: 'Argentina',      curto: 'Argentina',    abrev: 'ARG', bandeira: '🇦🇷' },
    { nome: 'Áustria',        curto: 'Áustria',      abrev: 'AUT', bandeira: '🇦🇹' },
    { nome: 'Argélia',        curto: 'Argélia',      abrev: 'ALG', bandeira: '🇩🇿' },
    { nome: 'Jordânia',       curto: 'Jordânia',     abrev: 'JOR', bandeira: '🇯🇴' },
  ]},
  { id: 'K', times: [
    { nome: 'Portugal',       curto: 'Portugal',     abrev: 'POR', bandeira: '🇵🇹' },
    { nome: 'Colômbia',       curto: 'Colômbia',     abrev: 'COL', bandeira: '🇨🇴' },
    { nome: 'Uzbequistão',    curto: 'Uzbequistão',  abrev: 'UZB', bandeira: '🇺🇿' },
    { nome: 'R. D. Congo',    curto: 'R. D. Congo',  abrev: 'COD', bandeira: '🇨🇩' },
  ]},
  { id: 'L', times: [
    { nome: 'Inglaterra',     curto: 'Inglaterra',   abrev: 'ENG', bandeira: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    { nome: 'Croácia',        curto: 'Croácia',      abrev: 'CRO', bandeira: '🇭🇷' },
    { nome: 'Panamá',         curto: 'Panamá',       abrev: 'PAN', bandeira: '🇵🇦' },
    { nome: 'Gana',           curto: 'Gana',         abrev: 'GHA', bandeira: '🇬🇭' },
  ]},
];

/* Configuração de 6 partidas por grupo (cada time joga 3 vezes) */
const PARTIDAS_CFG = [
  { mi: 0, vi: 1, r: 1 }, { mi: 2, vi: 3, r: 1 },
  { mi: 0, vi: 2, r: 2 }, { mi: 1, vi: 3, r: 2 },
  { mi: 0, vi: 3, r: 3 }, { mi: 1, vi: 2, r: 3 },
];

function getPartidasGrupo(grupoId: string) {
  return PARTIDAS_CFG.map((p, i) => ({ id: `${grupoId}${i + 1}`, grupo: grupoId, ...p }));
}

/* ══════════════════════════════════════════════════════
   LÓGICA — CÁLCULO DE CLASSIFICAÇÃO (regras FIFA)
══════════════════════════════════════════════════════ */
function calcularClassificacao(grupo: GrupoConfig, res: ResultadoMap): Standing[] {
  const s: Record<string, Standing> = {};
  grupo.times.forEach(t => {
    s[t.abrev] = { time: t, pos: 0, P: 0, J: 0, V: 0, E: 0, D: 0, GP: 0, GC: 0, SG: 0, grupo: grupo.id };
  });

  getPartidasGrupo(grupo.id).forEach(p => {
    const r = res[p.id];
    if (r?.gm === '' || r?.gv === '' || r?.gm == null || r?.gv == null) return;
    const gm = Number(r.gm), gv = Number(r.gv);
    const m = s[grupo.times[p.mi].abrev];
    const v = s[grupo.times[p.vi].abrev];
    m.J++; v.J++;
    m.GP += gm; m.GC += gv;
    v.GP += gv; v.GC += gm;
    if (gm > gv)      { m.V++; m.P += 3; v.D++; }
    else if (gm < gv) { v.V++; v.P += 3; m.D++; }
    else              { m.E++; m.P++;     v.E++; v.P++; }
  });

  Object.values(s).forEach(x => { x.SG = x.GP - x.GC; });

  return Object.values(s)
    .sort((a, b) =>
      b.P  - a.P  || b.SG - a.SG || b.GP - a.GP ||
      a.time.nome.localeCompare(b.time.nome, 'pt-BR')
    )
    .map((x, i) => ({ ...x, pos: i + 1 }));
}

function getMelhoresTerceiros(todasClass: Record<string, Standing[]>): Set<string> {
  const terceiros = Object.values(todasClass)
    .map(cl => cl.find(s => s.pos === 3))
    .filter(Boolean) as Standing[];
  const sorted = [...terceiros].sort((a, b) =>
    b.P - a.P || b.SG - a.SG || b.GP - a.GP ||
    a.time.nome.localeCompare(b.time.nome, 'pt-BR')
  );
  return new Set(sorted.slice(0, 8).map(s => s.time.abrev));
}

/* ══════════════════════════════════════════════════════
   COMPONENTE: MINI-TABELA DE UM GRUPO
══════════════════════════════════════════════════════ */
function MiniTabela({
  grupo, standings, melhoresTerceiros, compact = false,
}: {
  grupo: GrupoConfig;
  standings: Standing[];
  melhoresTerceiros: Set<string>;
  compact?: boolean;
}) {
  const corFundo = (s: Standing) => {
    if (s.pos <= 2) return 'rgba(0,156,59,0.12)';
    if (s.pos === 3 && melhoresTerceiros.has(s.time.abrev)) return 'rgba(234,179,8,0.1)';
    return 'transparent';
  };
  const corBorda = (s: Standing) => {
    if (s.pos <= 2) return '1px solid rgba(0,156,59,0.3)';
    if (s.pos === 3 && melhoresTerceiros.has(s.time.abrev)) return '1px solid rgba(234,179,8,0.25)';
    return '1px solid transparent';
  };
  const corPos = (s: Standing) => {
    if (s.pos <= 2) return '#00c94a';
    if (s.pos === 3 && melhoresTerceiros.has(s.time.abrev)) return '#eab308';
    return '#71717a';
  };

  const cols = compact
    ? ['P', 'J', 'SG', 'GP']
    : ['P', 'J', 'V', 'E', 'D', 'GP', 'GC', 'SG'];

  return (
    <div>
      {/* Cabeçalho colunas */}
      <div
        className="grid text-[10px] font-black uppercase tracking-widest text-zinc-600 px-2 pb-1"
        style={{ gridTemplateColumns: `28px 1fr ${cols.map(() => '28px').join(' ')}` }}
      >
        <span>#</span>
        <span>Seleção</span>
        {cols.map(c => <span key={c} className="text-center">{c}</span>)}
      </div>

      {/* Linhas */}
      {standings.map(s => (
        <div
          key={s.time.abrev}
          className="grid items-center px-2 py-1.5 rounded-lg mb-0.5 transition-colors"
          style={{
            gridTemplateColumns: `28px 1fr ${cols.map(() => '28px').join(' ')}`,
            background: corFundo(s),
            border: corBorda(s),
          }}
        >
          <span className="text-[11px] font-black" style={{ color: corPos(s) }}>{s.pos}</span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm leading-none flex-shrink-0">{s.time.bandeira}</span>
            <span className="text-xs font-semibold text-white truncate">{compact ? s.time.abrev : s.time.curto}</span>
          </div>
          {cols.map(c => {
            const val = s[c as keyof Standing] as number;
            return (
              <span key={c} className="text-center text-xs font-bold"
                style={{ color: c === 'P' ? '#F5C400' : c === 'SG' && val > 0 ? '#00c94a' : c === 'SG' && val < 0 ? '#ef4444' : '#a1a1aa' }}>
                {c === 'SG' && val > 0 ? `+${val}` : val}
              </span>
            );
          })}
        </div>
      ))}

      {/* Legenda */}
      <div className="flex flex-wrap gap-3 mt-2 px-1">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#00c94a]" />
          <span className="text-[10px] text-zinc-600">Classificado</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-[10px] text-zinc-600">3º melhor</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ABA: TABELA
══════════════════════════════════════════════════════ */
function TabelaView({
  todasClass, melhoresTerceiros,
}: {
  todasClass: Record<string, Standing[]>;
  melhoresTerceiros: Set<string>;
}) {
  const [grupoAtivo, setGrupoAtivo] = useState<string | 'TODOS'>('TODOS');
  const grupos = grupoAtivo === 'TODOS' ? GRUPOS : GRUPOS.filter(g => g.id === grupoAtivo);

  return (
    <div>
      {/* Seletor de grupo */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['TODOS', ...GRUPOS.map(g => g.id)].map(id => (
          <button
            key={id}
            onClick={() => setGrupoAtivo(id)}
            className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all"
            style={{
              background: grupoAtivo === id ? '#F5C400' : 'rgba(255,255,255,0.04)',
              color: grupoAtivo === id ? '#000' : '#71717a',
              borderColor: grupoAtivo === id ? '#F5C400' : 'rgba(255,255,255,0.1)',
            }}
          >
            {id === 'TODOS' ? 'Todos' : `Grupo ${id}`}
          </button>
        ))}
      </div>

      {/* Grid de grupos */}
      <div className={`grid gap-4 ${grupoAtivo === 'TODOS' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 max-w-lg'}`}>
        {grupos.map(g => (
          <div
            key={g.id}
            className="rounded-xl overflow-hidden border border-white/8"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          >
            {/* Header do grupo */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8"
              style={{ background: 'rgba(245,196,0,0.06)' }}>
              <div className="flex items-center gap-2">
                <span className="text-[#F5C400] font-black text-lg leading-none">GRUPO {g.id}</span>
                <div className="flex gap-0.5">
                  {g.times.map(t => (
                    <span key={t.abrev} className="text-sm">{t.bandeira}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3">
              <MiniTabela
                grupo={g}
                standings={todasClass[g.id] ?? []}
                melhoresTerceiros={melhoresTerceiros}
                compact={grupoAtivo === 'TODOS'}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Ranking 3ºs lugares */}
      {melhoresTerceiros.size > 0 && (
        <div className="mt-6 rounded-xl border border-yellow-500/20 overflow-hidden"
          style={{ background: 'rgba(234,179,8,0.04)' }}>
          <div className="px-4 py-3 border-b border-yellow-500/20 flex items-center gap-2">
            <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">🏅 8 Melhores 3ºs Lugares</span>
            <span className="text-zinc-600 text-xs">— também avançam para o mata-mata</span>
          </div>
          <div className="p-4 flex flex-wrap gap-2">
            {GRUPOS.map(g => {
              const terceiro = todasClass[g.id]?.find(s => s.pos === 3);
              if (!terceiro) return null;
              const avanca = melhoresTerceiros.has(terceiro.time.abrev);
              return (
                <div key={g.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-bold"
                  style={{
                    background: avanca ? 'rgba(234,179,8,0.12)' : 'rgba(255,255,255,0.03)',
                    borderColor: avanca ? 'rgba(234,179,8,0.35)' : 'rgba(255,255,255,0.08)',
                    color: avanca ? '#eab308' : '#52525b',
                  }}>
                  <span>{terceiro.time.bandeira}</span>
                  <span>{terceiro.time.curto}</span>
                  <span className="font-black">{terceiro.P}pts</span>
                  {avanca && <span>✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ABA: SIMULADOR
══════════════════════════════════════════════════════ */
function SimuladorView({
  resultados, setResultado, todasClass, melhoresTerceiros,
}: {
  resultados: ResultadoMap;
  setResultado: (id: string, gm: ScoreVal, gv: ScoreVal) => void;
  todasClass: Record<string, Standing[]>;
  melhoresTerceiros: Set<string>;
}) {
  const [grupoAtivo, setGrupoAtivo] = useState('C');
  const grupo = GRUPOS.find(g => g.id === grupoAtivo)!;
  const partidas = getPartidasGrupo(grupoAtivo);

  function resetarGrupo() {
    partidas.forEach(p => setResultado(p.id, '', ''));
  }

  const rodadas = [1, 2, 3];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">

      {/* Esquerda: seletor + jogos */}
      <div>
        {/* Seletor de grupo */}
        <div className="flex flex-wrap gap-2 mb-5">
          {GRUPOS.map(g => (
            <button
              key={g.id}
              onClick={() => setGrupoAtivo(g.id)}
              className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all"
              style={{
                background: grupoAtivo === g.id ? '#F5C400' : 'rgba(255,255,255,0.04)',
                color: grupoAtivo === g.id ? '#000' : '#71717a',
                borderColor: grupoAtivo === g.id ? '#F5C400' : 'rgba(255,255,255,0.1)',
              }}
            >
              {g.id}
            </button>
          ))}
          <button
            onClick={resetarGrupo}
            className="text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all ml-auto"
            style={{ borderColor: 'rgba(239,68,68,0.3)', color: '#ef4444', background: 'rgba(239,68,68,0.06)' }}
          >
            ↺ Resetar
          </button>
        </div>

        {/* Header do grupo */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#F5C400] font-black text-2xl">GRUPO {grupoAtivo}</span>
          <div className="flex gap-1">
            {grupo.times.map(t => <span key={t.abrev} className="text-xl">{t.bandeira}</span>)}
          </div>
        </div>

        {/* Rodadas */}
        {rodadas.map(r => (
          <div key={r} className="mb-5">
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-zinc-800" />
              Rodada {r}
              <span className="flex-1 h-[1px] bg-zinc-800" />
            </div>

            {partidas
              .filter(p => p.r === r)
              .map(p => {
                const mandante = grupo.times[p.mi];
                const visitante = grupo.times[p.vi];
                const res = resultados[p.id] ?? { gm: '', gv: '' };
                const jogado = res.gm !== '' && res.gv !== '';

                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 mb-2 border transition-all"
                    style={{
                      background: jogado ? 'rgba(0,156,59,0.07)' : 'rgba(255,255,255,0.03)',
                      borderColor: jogado ? 'rgba(0,156,59,0.25)' : 'rgba(255,255,255,0.07)',
                    }}
                  >
                    {/* Mandante */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <span className="text-white text-sm font-bold hidden sm:block text-right">{mandante.curto}</span>
                      <span className="text-xl">{mandante.bandeira}</span>
                    </div>

                    {/* Placar */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <input
                        type="number" min="0" max="99"
                        value={res.gm}
                        onChange={e => setResultado(p.id, e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0), res.gv)}
                        placeholder="–"
                        className="w-10 h-10 text-center rounded-lg text-sm font-black bg-zinc-900 border border-zinc-700 text-white focus:border-[#F5C400] focus:outline-none transition-colors"
                        style={{ MozAppearance: 'textfield' } as React.CSSProperties}
                        aria-label={`Gols ${mandante.nome}`}
                      />
                      <span className="text-zinc-600 font-black text-sm">×</span>
                      <input
                        type="number" min="0" max="99"
                        value={res.gv}
                        onChange={e => setResultado(p.id, res.gm, e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value) || 0))}
                        placeholder="–"
                        className="w-10 h-10 text-center rounded-lg text-sm font-black bg-zinc-900 border border-zinc-700 text-white focus:border-[#F5C400] focus:outline-none transition-colors"
                        style={{ MozAppearance: 'textfield' } as React.CSSProperties}
                        aria-label={`Gols ${visitante.nome}`}
                      />
                    </div>

                    {/* Visitante */}
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xl">{visitante.bandeira}</span>
                      <span className="text-white text-sm font-bold hidden sm:block">{visitante.curto}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* Direita: tabela live */}
      <div className="lg:sticky lg:top-20 self-start">
        <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between"
            style={{ background: 'rgba(245,196,0,0.06)' }}>
            <span className="text-[#F5C400] font-black text-sm uppercase tracking-wider">Grupo {grupoAtivo} — Live</span>
            <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Classificação</span>
          </div>
          <div className="p-3">
            <MiniTabela
              grupo={grupo}
              standings={todasClass[grupoAtivo] ?? []}
              melhoresTerceiros={melhoresTerceiros}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ABA: CALCULADORA
══════════════════════════════════════════════════════ */
function CalculadoraView({
  todasClass, melhoresTerceiros, resultados,
}: {
  todasClass: Record<string, Standing[]>;
  melhoresTerceiros: Set<string>;
  resultados: ResultadoMap;
}) {
  const [abrevSel, setAbrevSel] = useState('BRA');

  const todosTimes = useMemo(
    () => GRUPOS.flatMap(g => g.times.map(t => ({ ...t, grupo: g.id }))),
    []
  );
  const timeSel = todosTimes.find(t => t.abrev === abrevSel)!;
  const grupoSel = GRUPOS.find(g => g.id === timeSel.grupo)!;
  const standings = todasClass[grupoSel.id] ?? [];
  const standing = standings.find(s => s.time.abrev === abrevSel);
  const partidas = getPartidasGrupo(grupoSel.id);
  const jogosRestantes = partidas.filter(p => {
    const r = resultados[p.id];
    const envolvido = grupoSel.times[p.mi].abrev === abrevSel || grupoSel.times[p.vi].abrev === abrevSel;
    const incompleto = r?.gm === '' || r?.gv === '' || r?.gm == null;
    return envolvido && incompleto;
  }).length;
  const maxPossivel = (standing?.P ?? 0) + jogosRestantes * 3;
  const pos = standing?.pos ?? 0;

  // Status de classificação
  function getStatus() {
    if (!standing) return null;
    if (pos <= 2 && jogosRestantes === 0) return { label: '✅ CLASSIFICADO', cor: '#00c94a', sub: '1º ou 2º no grupo — vaga garantida' };
    if (pos <= 2) return { label: '🟢 NA ZONA', cor: '#00c94a', sub: `${pos}º lugar — ${jogosRestantes} jogos restantes` };
    if (pos === 3 && melhoresTerceiros.has(abrevSel)) return { label: '🟡 3º MELHOR', cor: '#eab308', sub: 'Entre os 8 melhores terceiros — pode avançar' };
    if (pos === 3) return { label: '🟡 3º LUGAR', cor: '#eab308', sub: 'Precisa subir ou torcer pelos resultados' };
    return { label: '🔴 ELIMINADO', cor: '#ef4444', sub: `4º lugar — ${maxPossivel} pts máximos possíveis` };
  }
  const status = getStatus();

  const pontosParaGarantir = Math.max(0, 7 - (standing?.P ?? 0)); // 7 pts costuma garantir
  const pontosParaPossivel = Math.max(0, 4 - (standing?.P ?? 0)); // 4 pts para ter chance

  return (
    <div className="max-w-2xl mx-auto">
      {/* Seletor de seleção */}
      <div className="mb-6">
        <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">
          Selecionar país
        </label>
        <div className="relative">
          <select
            value={abrevSel}
            onChange={e => setAbrevSel(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 text-white rounded-xl px-4 py-3 pr-10 text-sm font-bold focus:border-[#F5C400] focus:outline-none appearance-none cursor-pointer"
          >
            {GRUPOS.map(g => (
              <optgroup key={g.id} label={`Grupo ${g.id}`}>
                {g.times.map(t => (
                  <option key={t.abrev} value={t.abrev}>{t.bandeira} {t.nome}</option>
                ))}
              </optgroup>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">▼</span>
        </div>
      </div>

      {/* Card do time */}
      <div className="rounded-2xl overflow-hidden border border-white/8 mb-5" style={{ background: 'rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-white/8"
          style={{ background: 'rgba(245,196,0,0.05)' }}>
          <span className="text-5xl">{timeSel.bandeira}</span>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Grupo {grupoSel.id}</p>
            <h3 className="text-white font-black text-xl">{timeSel.nome}</h3>
          </div>
          {status && (
            <div className="ml-auto text-right">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: status.cor }}>
                {status.label}
              </span>
              <p className="text-[11px] text-zinc-500 mt-0.5">{status.sub}</p>
            </div>
          )}
        </div>

        {/* Stats atuais */}
        {standing && (
          <div className="grid grid-cols-4 divide-x divide-white/8 border-b border-white/8">
            {[
              { label: 'Pontos', val: standing.P, cor: '#F5C400' },
              { label: 'Jogos', val: standing.J, cor: '#fff' },
              { label: 'Saldo', val: standing.SG > 0 ? `+${standing.SG}` : standing.SG, cor: standing.SG > 0 ? '#00c94a' : standing.SG < 0 ? '#ef4444' : '#fff' },
              { label: 'Posição', val: `${standing.pos}º`, cor: standing.pos <= 2 ? '#00c94a' : standing.pos === 3 ? '#eab308' : '#ef4444' },
            ].map(({ label, val, cor }) => (
              <div key={label} className="py-4 text-center">
                <div className="text-xl font-black" style={{ color: cor }}>{val}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-600 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Análise */}
        <div className="p-5 space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-3">Análise de Classificação</p>

          {[
            {
              label: 'Jogos restantes no grupo',
              val: `${jogosRestantes}`,
              sub: `${jogosRestantes * 3} pontos ainda disponíveis`,
              cor: '#a1a1aa',
            },
            {
              label: 'Pontos máximos possíveis',
              val: `${maxPossivel}`,
              sub: 'Se vencer todos os jogos restantes',
              cor: '#F5C400',
            },
            {
              label: 'Para ter chance de classificar',
              val: jogosRestantes === 0 ? '—' : `${Math.min(pontosParaPossivel, jogosRestantes * 3)} pts`,
              sub: jogosRestantes === 0 ? 'Todos os jogos finalizados' : 'Mínimo estimado para 3ª vaga',
              cor: '#eab308',
            },
            {
              label: 'Para praticamente garantir',
              val: jogosRestantes === 0 ? '—' : `${Math.min(pontosParaGarantir, jogosRestantes * 3)} pts`,
              sub: jogosRestantes === 0 ? '—' : '7+ pontos costumam garantir classificação',
              cor: '#00c94a',
            },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5">
              <div>
                <p className="text-sm text-white/70">{row.label}</p>
                <p className="text-[11px] text-zinc-600">{row.sub}</p>
              </div>
              <span className="text-base font-black" style={{ color: row.cor }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabela do grupo completo */}
      <div className="rounded-xl overflow-hidden border border-white/8" style={{ background: 'rgba(0,0,0,0.4)' }}>
        <div className="px-4 py-3 border-b border-white/8" style={{ background: 'rgba(245,196,0,0.05)' }}>
          <span className="text-[#F5C400] font-black text-sm uppercase tracking-wider">Grupo {grupoSel.id} completo</span>
        </div>
        <div className="p-3">
          <MiniTabela grupo={grupoSel} standings={standings} melhoresTerceiros={melhoresTerceiros} />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════════════ */
export default function CopaPage() {
  const [aba, setAba] = useState<Aba>('simulador');
  const [resultados, setResultados] = useState<ResultadoMap>({});

  const setResultado = useCallback((id: string, gm: ScoreVal, gv: ScoreVal) => {
    setResultados(prev => ({ ...prev, [id]: { gm, gv } }));
  }, []);

  // Calcula todas as classificações
  const todasClass = useMemo(() => {
    const map: Record<string, Standing[]> = {};
    GRUPOS.forEach(g => { map[g.id] = calcularClassificacao(g, resultados); });
    return map;
  }, [resultados]);

  // Calcula 8 melhores terceiros
  const melhoresTerceiros = useMemo(() => getMelhoresTerceiros(todasClass), [todasClass]);

  const ABAS: { id: Aba; label: string; emoji: string; desc: string }[] = [
    { id: 'tabela',      label: 'Tabela',      emoji: '📊', desc: 'Classificação dos 12 grupos' },
    { id: 'simulador',   label: 'Simulador',   emoji: '⚽', desc: 'Simule os resultados' },
    { id: 'calculadora', label: 'Calculadora', emoji: '🧮', desc: 'O que seu time precisa?' },
  ];

  return (
    <>
      <style>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        select option { background: #18181b; }
        select optgroup { color: #F5C400; font-weight: 900; }
      `}</style>

      {/* Sub-nav Copa 2026 — link para /selecao */}
      <CopaSubnav />

      <div className="min-h-screen bg-[#09090b] text-white">

        {/* ── HERO ── */}
        <div
          className="relative border-b border-white/8 py-10 px-4 overflow-hidden"
          style={{ background: 'linear-gradient(160deg, rgba(245,196,0,0.06) 0%, rgba(0,0,0,0) 60%)' }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 10% 50%, rgba(245,196,0,0.07) 0%, transparent 60%)' }} />
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-4xl">🏆</span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  EUA · Canadá · México · 11 Jun – 19 Jul 2026
                </p>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white">
                  Copa do Mundo <span style={{ color: '#F5C400' }}>2026</span>
                </h1>
              </div>
              <div className="ml-auto flex items-center gap-4 text-center">
                {[
                  { num: '48', label: 'Seleções' },
                  { num: '12', label: 'Grupos' },
                  { num: '104', label: 'Jogos' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-xl font-black text-[#F5C400]">{s.num}</div>
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="border-b border-white/8 sticky top-0 z-20 backdrop-blur-md"
          style={{ background: 'rgba(9,9,11,0.92)' }}>
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex gap-0">
              {ABAS.map(a => (
                <button
                  key={a.id}
                  onClick={() => setAba(a.id)}
                  className="flex items-center gap-2 px-5 py-4 text-sm font-bold border-b-2 transition-all"
                  style={{
                    borderColor: aba === a.id ? '#F5C400' : 'transparent',
                    color: aba === a.id ? '#F5C400' : '#71717a',
                  }}
                >
                  <span>{a.emoji}</span>
                  <span className="hidden sm:block">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTEÚDO ── */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          {aba === 'tabela'      && <TabelaView todasClass={todasClass} melhoresTerceiros={melhoresTerceiros} />}
          {aba === 'simulador'   && <SimuladorView resultados={resultados} setResultado={setResultado} todasClass={todasClass} melhoresTerceiros={melhoresTerceiros} />}
          {aba === 'calculadora' && <CalculadoraView todasClass={todasClass} melhoresTerceiros={melhoresTerceiros} resultados={resultados} />}
        </div>

      </div>
    </>
  );
}
