'use client';

/**
 * LigasHub — Central de Ligas Particulares
 * 
 * Tela única que gerencia:
 *   - Exibição das ligas do usuário
 *   - Criação (gate: Fiel 100+ XP)
 *   - Entrada via código de convite
 *   - Ranking interno de cada liga
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLigas, Liga, LigaMembro, NIVEL_CORES, NIVEL_ICONES, XP_PARA_CRIAR_LIGA } from '@/hooks/useLigas';

// ─── Subcomponentes ───────────────────────────────────────────────────────────

function XPProgressBar({ xp }: { xp: number }) {
  const progress = Math.min(100, (xp / XP_PARA_CRIAR_LIGA) * 100);
  const cor = xp >= XP_PARA_CRIAR_LIGA ? '#F5C400' : '#3B82F6';

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5">
        <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">XP para criar liga</span>
        <span className="text-[10px] font-black" style={{ color: cor }}>{xp}/{XP_PARA_CRIAR_LIGA}</span>
      </div>
      <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${cor}88, ${cor})` }}
        />
      </div>
    </div>
  );
}

function LigaCard({ liga, usuarioId, onEntrar, onVer }: {
  liga: Liga;
  usuarioId: string | null;
  onEntrar?: () => void;
  onVer: (ligaId: string) => void;
}) {
  const isDono = liga.dono_id === usuarioId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-950 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-700 transition-all cursor-pointer group"
      onClick={() => onVer(liga.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-white font-black text-sm uppercase tracking-tight truncate">{liga.nome}</h4>
            {isDono && (
              <span className="text-[8px] font-black bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-1.5 py-0.5 rounded-full uppercase shrink-0">
                👑 Dono
              </span>
            )}
          </div>
          {liga.descricao && (
            <p className="text-zinc-600 text-[10px] mt-0.5 truncate">{liga.descricao}</p>
          )}
        </div>
        <div className="text-[10px] font-bold text-zinc-600 shrink-0 ml-2">
          {liga.temporada}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-zinc-600 text-[9px]">👥</span>
            <span className="text-zinc-500 text-[9px] font-bold">{liga.max_membros} max</span>
          </div>
          {isDono && (
            <button
              onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(liga.codigo_convite); }}
              className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 hover:border-yellow-500 transition-all"
              title="Copiar código de convite"
            >
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{liga.codigo_convite}</span>
              <span className="text-[9px]">📋</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 text-zinc-600 group-hover:text-white transition-colors">
          <span className="text-[9px] font-black uppercase tracking-wider">Ver Ranking</span>
          <span className="text-[10px]">→</span>
        </div>
      </div>
    </motion.div>
  );
}

function RankingModal({ ligaId, onClose, getRanking }: {
  ligaId: string;
  onClose: () => void;
  getRanking: (id: string) => Promise<LigaMembro[]>;
}) {
  const [ranking, setRanking] = useState<LigaMembro[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    getRanking(ligaId).then(data => { setRanking(data); setLoading(false); });
  }, [ligaId, getRanking]);

  const MEDAL = ['🥇', '🥈', '🥉'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9 }}
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-zinc-900">
          <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">🏆 Ranking</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl font-light">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ranking.length === 0 ? (
            <p className="text-zinc-600 text-center py-8 text-sm">Nenhum membro ainda</p>
          ) : (
            ranking.map((membro, i) => {
              const perfil = membro.tigre_fc_usuarios;
              const nivelCor = NIVEL_CORES[perfil?.nivel ?? 'Novato'];
              return (
                <div key={membro.usuario_id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    i === 0 ? 'border-yellow-500/30 bg-yellow-500/5' :
                    i === 1 ? 'border-zinc-600/30 bg-zinc-600/5' :
                    i === 2 ? 'border-amber-700/30 bg-amber-700/5' :
                              'border-zinc-900 bg-zinc-950'
                  }`}
                >
                  <span className="text-xl w-8 text-center shrink-0">{MEDAL[i] ?? `${i + 1}`}</span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-black text-xs uppercase truncate">
                        {perfil?.display_name ?? 'Torcedor'}
                      </span>
                      <span className="text-[9px] shrink-0" style={{ color: nivelCor }}>
                        {NIVEL_ICONES[perfil?.nivel ?? 'Novato']}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-zinc-600 text-[9px]">{membro.jogos} jogos</span>
                      <span className="text-zinc-600 text-[9px]">•</span>
                      <span className="text-green-500 text-[9px]">{membro.acertos} acertos</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-yellow-500 font-black text-lg italic">{membro.pontos}</div>
                    <div className="text-zinc-600 text-[9px] font-bold uppercase">PTS</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

interface LigasHubProps {
  usuarioId: string | null;
}

export default function LigasHub({ usuarioId }: LigasHubProps) {
  const {
    perfil, minhasLigas, isLoading, error, podeCriarLiga, xpParaFiel,
    criarLiga, entrarNaLiga, getRankingLiga,
  } = useLigas(usuarioId);

  const [activeTab,       setActiveTab]       = useState<'minhas' | 'criar' | 'entrar'>('minhas');
  const [rankingLigaId,   setRankingLigaId]   = useState<string | null>(null);
  const [novaLigaNome,    setNovaLigaNome]     = useState('');
  const [novaLigaDesc,    setNovaLigaDesc]     = useState('');
  const [codigoEntrada,   setCodigoEntrada]    = useState('');
  const [successMsg,      setSuccessMsg]       = useState<string | null>(null);
  const [isSaving,        setIsSaving]         = useState(false);

  const handleCriarLiga = useCallback(async () => {
    if (!novaLigaNome.trim()) return;
    setIsSaving(true);
    const liga = await criarLiga(novaLigaNome, novaLigaDesc);
    setIsSaving(false);
    if (liga) {
      confetti({ particleCount: 100, spread: 60, colors: ['#F5C400', '#fff'] });
      setSuccessMsg(`Liga "${liga.nome}" criada! Código: ${liga.codigo_convite}`);
      setNovaLigaNome('');
      setNovaLigaDesc('');
      setActiveTab('minhas');
      setTimeout(() => setSuccessMsg(null), 6000);
    }
  }, [criarLiga, novaLigaNome, novaLigaDesc]);

  const handleEntrarNaLiga = useCallback(async () => {
    if (!codigoEntrada.trim()) return;
    setIsSaving(true);
    const result = await entrarNaLiga(codigoEntrada);
    setIsSaving(false);
    if (result.success) {
      confetti({ particleCount: 80, spread: 50, colors: ['#22C55E', '#fff'] });
      setSuccessMsg(`Você entrou na liga "${result.ligaNome}"! 🎉`);
      setCodigoEntrada('');
      setActiveTab('minhas');
      setTimeout(() => setSuccessMsg(null), 5000);
    }
  }, [entrarNaLiga, codigoEntrada]);

  if (!usuarioId) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 h-64 bg-zinc-950 rounded-3xl border border-zinc-900">
        <span className="text-5xl">🔒</span>
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">Faça login para acessar as Ligas</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-[2rem] border border-zinc-900 overflow-hidden">

      {/* HEADER */}
      <div className="p-6 border-b border-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Ligas</h2>
            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-0.5">Particulares & Ranking</p>
          </div>
          {perfil && (
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: NIVEL_CORES[perfil.nivel] }}>
                {NIVEL_ICONES[perfil.nivel]} {perfil.nivel}
              </div>
              <div className="text-zinc-600 text-[9px] mt-0.5">{perfil.xp} XP</div>
            </div>
          )}
        </div>
        {perfil && !podeCriarLiga && <XPProgressBar xp={perfil.xp} />}
      </div>

      {/* TABS */}
      <div className="flex border-b border-zinc-900">
        {(['minhas', 'criar', 'entrar'] as const).map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab === 'minhas' ? `Minhas (${minhasLigas.length})` :
             tab === 'criar'  ? '+ Criar' : '🔑 Entrar'}
          </button>
        ))}
      </div>

      {/* FEEDBACK */}
      <AnimatePresence>
        {(error || successMsg) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`px-6 py-3 text-xs font-bold ${
              successMsg ? 'bg-green-500/10 text-green-400 border-b border-green-500/20'
                         : 'bg-red-500/10 text-red-400 border-b border-red-500/20'
            }`}
          >
            {successMsg || error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTEÚDO */}
      <div className="p-4">
        {/* Tab: Minhas Ligas */}
        {activeTab === 'minhas' && (
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : minhasLigas.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10">
                <span className="text-4xl">⚽</span>
                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest text-center">
                  Você ainda não participa de nenhuma liga
                </p>
                <button
                  onClick={() => setActiveTab(podeCriarLiga ? 'criar' : 'entrar')}
                  className="mt-2 px-4 py-2 bg-yellow-500 text-black text-[10px] font-black uppercase rounded-xl hover:bg-yellow-400 transition"
                >
                  {podeCriarLiga ? '+ Criar minha liga' : 'Entrar via convite'}
                </button>
              </div>
            ) : (
              minhasLigas.map(liga => (
                <LigaCard
                  key={liga.id}
                  liga={liga}
                  usuarioId={usuarioId}
                  onVer={id => setRankingLigaId(id)}
                />
              ))
            )}
          </div>
        )}

        {/* Tab: Criar Liga */}
        {activeTab === 'criar' && (
          <div className="space-y-4 py-2">
            {!podeCriarLiga ? (
              /* Gate de XP */
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="w-16 h-16 rounded-full bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center justify-center text-3xl">
                  🏆
                </div>
                <div>
                  <p className="text-white font-black text-sm uppercase">Nível Fiel Necessário</p>
                  <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                    Acumule {xpParaFiel} XP a mais para desbloquear a criação de ligas particulares.
                    Continue participando para subir de nível!
                  </p>
                </div>
                {perfil && <XPProgressBar xp={perfil.xp} />}
                <button
                  onClick={() => setActiveTab('entrar')}
                  className="px-6 py-3 border border-zinc-800 rounded-xl text-zinc-400 text-xs font-black uppercase hover:border-zinc-600 transition"
                >
                  Entrar via convite →
                </button>
              </div>
            ) : (
              /* Formulário de Criação */
              <>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                    Nome da Liga *
                  </label>
                  <input
                    value={novaLigaNome}
                    onChange={e => setNovaLigaNome(e.target.value)}
                    placeholder="Ex: Galera do Bar do Zé"
                    maxLength={40}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-500 transition placeholder:text-zinc-700"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                    Descrição (opcional)
                  </label>
                  <textarea
                    value={novaLigaDesc}
                    onChange={e => setNovaLigaDesc(e.target.value)}
                    placeholder="Uma frase sobre sua liga..."
                    maxLength={100}
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-500 transition resize-none placeholder:text-zinc-700"
                  />
                </div>
                <button
                  disabled={!novaLigaNome.trim() || isSaving}
                  onClick={handleCriarLiga}
                  className="w-full py-4 bg-yellow-500 text-black font-black uppercase text-sm rounded-2xl hover:bg-yellow-400 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      CRIANDO...
                    </>
                  ) : (
                    '🏆 CRIAR LIGA'
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Tab: Entrar via código */}
        {activeTab === 'entrar' && (
          <div className="space-y-4 py-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                Código de Convite
              </label>
              <input
                value={codigoEntrada}
                onChange={e => setCodigoEntrada(e.target.value.toLowerCase())}
                placeholder="Ex: ab3d7f2e"
                maxLength={8}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-yellow-500 transition placeholder:text-zinc-700 font-mono tracking-widest"
              />
              <p className="text-zinc-700 text-[9px] mt-1.5">Peça o código de 8 dígitos para o dono da liga</p>
            </div>
            <button
              disabled={codigoEntrada.length !== 8 || isSaving}
              onClick={handleEntrarNaLiga}
              className="w-full py-4 bg-green-600 text-white font-black uppercase text-sm rounded-2xl hover:bg-green-500 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ENTRANDO...
                </>
              ) : (
                '🔑 ENTRAR NA LIGA'
              )}
            </button>
          </div>
        )}
      </div>

      {/* MODAL RANKING */}
      <AnimatePresence>
        {rankingLigaId && (
          <RankingModal
            ligaId={rankingLigaId}
            onClose={() => setRankingLigaId(null)}
            getRanking={getRankingLiga}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
