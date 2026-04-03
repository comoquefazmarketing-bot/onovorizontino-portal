'use client';

/**
 * LigasHub — Central de Ligas Particulares
 * * Tela única que gerencia:
 * - Exibição das ligas do usuário
 * - Criação (gate: Fiel 100+ XP)
 * - Entrada via código de convite
 * - Ranking interno de cada liga
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  useLigas, 
  type Liga, 
  type LigaMembro, 
  NIVEL_CORES, 
  NIVEL_ICONES, 
  XP_PARA_CRIAR_LIGA 
} from '@/hooks/useLigas';

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

function LigaCard({ liga, usuarioId, onVer }: {
  liga: Liga;
  usuarioId: string | null;
  onVer: (ligaId: string) => void;
}) {
  const isDono = liga.dono_id === usuarioId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
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
              onClick={(e) => { 
                e.stopPropagation(); 
                navigator.clipboard.writeText(liga.codigo_convite);
                alert('Código copiado!');
              }}
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

  useEffect(() => {
    getRanking(ligaId).then(data => { 
      setRanking(data); 
      setLoading(false); 
    });
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
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-zinc-900">
          <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">🏆 Ranking</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white text-2xl font-light transition-colors">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : ranking.length === 0 ? (
            <p className="text-zinc-600 text-center py-12 text-sm uppercase font-bold tracking-widest">Nenhum membro ainda</p>
          ) : (
            ranking.map((membro, i) => {
              const perfil = membro.tigre_fc_usuarios;
              const nivelCor = NIVEL_CORES[perfil?.nivel ?? 'Novato'];
              return (
                <div key={membro.usuario_id}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    i === 0 ? 'border-yellow-500/30 bg-yellow-500/5 shadow-[0_0_20px_rgba(245,196,0,0.05)]' :
                    i === 1 ? 'border-zinc-400/20 bg-zinc-400/5' :
                    i === 2 ? 'border-amber-700/20 bg-amber-700/5' :
                              'border-zinc-900 bg-zinc-950/50'
                  }`}
                >
                  <span className="text-xl w-8 text-center shrink-0 font-black">
                    {MEDAL[i] ?? `${i + 1}`}
                  </span>

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
                      <span className="text-zinc-600 text-[9px] font-bold uppercase">{membro.jogos} Jogos</span>
                      <span className="text-zinc-600 text-[9px]">•</span>
                      <span className="text-green-500 text-[9px] font-bold uppercase">{membro.acertos} Acertos</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-yellow-500 font-[1000] text-xl italic leading-none">{membro.pontos}</div>
                    <div className="text-zinc-600 text-[8px] font-black uppercase tracking-tighter">PTS</div>
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

  const [activeTab, setActiveTab] = useState<'minhas' | 'criar' | 'entrar'>('minhas');
  const [rankingLigaId, setRankingLigaId] = useState<string | null>(null);
  const [novaLigaNome, setNovaLigaNome] = useState('');
  const [novaLigaDesc, setNovaLigaDesc] = useState('');
  const [codigoEntrada, setCodigoEntrada] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleCriarLiga = useCallback(async () => {
    if (!novaLigaNome.trim()) return;
    setIsSaving(true);
    try {
      const liga = await criarLiga(novaLigaNome, novaLigaDesc);
      if (liga) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#F5C400', '#FFFFFF', '#3B82F6'] });
        setSuccessMsg(`Liga "${liga.nome}" criada com sucesso!`);
        setNovaLigaNome('');
        setNovaLigaDesc('');
        setActiveTab('minhas');
        setTimeout(() => setSuccessMsg(null), 6000);
      }
    } finally {
      setIsSaving(false);
    }
  }, [criarLiga, novaLigaNome, novaLigaDesc]);

  const handleEntrarNaLiga = useCallback(async () => {
    if (!codigoEntrada.trim()) return;
    setIsSaving(true);
    try {
      const result = await entrarNaLiga(codigoEntrada);
      if (result.success) {
        confetti({ particleCount: 100, spread: 50, colors: ['#22C55E', '#FFFFFF'] });
        setSuccessMsg(`Bem-vindo à liga "${result.ligaNome}"! 🎉`);
        setCodigoEntrada('');
        setActiveTab('minhas');
        setTimeout(() => setSuccessMsg(null), 5000);
      }
    } finally {
      setIsSaving(false);
    }
  }, [entrarNaLiga, codigoEntrada]);

  if (!usuarioId) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 h-80 bg-zinc-950/50 rounded-[2.5rem] border border-zinc-900 border-dashed">
        <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl">🔒</motion.span>
        <div className="text-center">
          <p className="text-white font-black uppercase italic tracking-tighter text-xl">Acesso Restrito</p>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">Faça login para gerenciar suas ligas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-[2rem] border border-zinc-900 overflow-hidden shadow-2xl">

      {/* HEADER */}
      <div className="p-6 border-b border-zinc-900 bg-zinc-950/30">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-[1000] uppercase italic tracking-tighter text-white">Ligas</h2>
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Arena Particular Tigre FC</p>
          </div>
          {perfil && (
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-white/5">
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: NIVEL_CORES[perfil.nivel] }}>
                  {NIVEL_ICONES[perfil.nivel]} {perfil.nivel}
                </span>
              </div>
              <div className="text-zinc-600 text-[9px] font-black mt-2 uppercase">{perfil.xp} XP ACUMULADO</div>
            </div>
          )}
        </div>
        {perfil && !podeCriarLiga && <XPProgressBar xp={perfil.xp} />}
      </div>

      {/* TABS */}
      <div className="flex border-b border-zinc-900 bg-zinc-950/20">
        {(['minhas', 'criar', 'entrar'] as const).map(tab => (
          <button key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.15em] transition-all relative ${
              activeTab === tab ? 'text-yellow-500' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab === 'minhas' ? `Minhas (${minhasLigas.length})` :
             tab === 'criar'  ? '+ Criar Liga' : '🔑 Entrar'}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-500" />
            )}
          </button>
        ))}
      </div>

      {/* FEEDBACK MESSAGES */}
      <AnimatePresence>
        {(error || successMsg) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-center justify-between ${
              successMsg ? 'bg-green-500 text-black' : 'bg-red-600 text-white'
            }`}
          >
            <span>{successMsg || error}</span>
            <button onClick={() => setSuccessMsg(null)} className="opacity-50 hover:opacity-100">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTEÚDO DINÂMICO */}
      <div className="p-6 min-h-[400px]">
        {activeTab === 'minhas' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Sincronizando Ligas...</p>
              </div>
            ) : minhasLigas.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-6 py-20 bg-zinc-950/20 rounded-3xl border border-zinc-900 border-dashed">
                <span className="text-5xl opacity-20">🏟️</span>
                <div className="text-center">
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Sua estante de troféus está vazia</p>
                  <button
                    onClick={() => setActiveTab(podeCriarLiga ? 'criar' : 'entrar')}
                    className="mt-6 px-8 py-3 bg-white text-black text-[10px] font-[1000] uppercase rounded-full hover:bg-yellow-500 transition-all active:scale-95"
                  >
                    {podeCriarLiga ? 'Fundar minha primeira liga' : 'Entrar em uma liga existente'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {minhasLigas.map(liga => (
                  <LigaCard
                    key={liga.id}
                    liga={liga}
                    usuarioId={usuarioId}
                    onVer={id => setRankingLigaId(id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'criar' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-4 space-y-6">
            {!podeCriarLiga ? (
              <div className="flex flex-col items-center gap-6 py-10 text-center bg-zinc-950/50 rounded-3xl border border-zinc-900 p-8">
                <div className="w-20 h-20 rounded-full bg-yellow-500/10 border-2 border-yellow-500/20 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(245,196,0,0.1)]">
                  🎖️
                </div>
                <div>
                  <p className="text-white font-[1000] text-lg uppercase italic tracking-tighter">Nível Fiel Requerido</p>
                  <p className="text-zinc-500 text-[10px] font-bold mt-2 leading-relaxed uppercase tracking-wider">
                    Você precisa de mais {xpParaFiel} XP para ter o prestígio de fundar sua própria liga.
                  </p>
                </div>
                {perfil && <XPProgressBar xp={perfil.xp} />}
                <button
                  onClick={() => setActiveTab('entrar')}
                  className="w-full py-4 border-2 border-zinc-800 rounded-2xl text-zinc-400 text-[10px] font-black uppercase hover:border-zinc-600 hover:text-white transition-all"
                >
                  Entrar via código de amigo →
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2 px-1">Nome da Instituição</label>
                    <input
                      value={novaLigaNome}
                      onChange={e => setNovaLigaNome(e.target.value)}
                      placeholder="Ex: OS LENDÁRIOS DO TIGRE"
                      maxLength={40}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-5 py-4 text-white text-sm font-bold outline-none focus:border-yellow-500 transition-all placeholder:text-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 block mb-2 px-1">Descrição do Grupo</label>
                    <textarea
                      value={novaLigaDesc}
                      onChange={e => setNovaLigaDesc(e.target.value)}
                      placeholder="Regras, prêmios ou zoeira da liga..."
                      maxLength={100}
                      rows={3}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-5 py-4 text-white text-sm font-bold outline-none focus:border-yellow-500 transition-all resize-none placeholder:text-zinc-700"
                    />
                  </div>
                </div>
                <button
                  disabled={!novaLigaNome.trim() || isSaving}
                  onClick={handleCriarLiga}
                  className="w-full py-5 bg-yellow-500 text-black font-[1000] uppercase text-xs tracking-[0.2em] rounded-[1.5rem] hover:bg-yellow-400 active:scale-95 transition-all shadow-xl shadow-yellow-500/10 disabled:opacity-30 flex items-center justify-center gap-3"
                >
                  {isSaving ? <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : '🏆 FUNDAR LIGA AGORA'}
                </button>
              </>
            )}
          </motion.div>
        )}

        {activeTab === 'entrar' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md mx-auto py-10 space-y-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🔑</div>
              <h4 className="text-white font-black uppercase tracking-widest text-sm">Convite para Batalha</h4>
              <p className="text-zinc-600 text-[9px] font-bold uppercase mt-1">Insira o código secreto da liga</p>
            </div>

            <div className="space-y-4">
              <input
                value={codigoEntrada}
                onChange={e => setCodigoEntrada(e.target.value.toLowerCase())}
                placeholder="CÓDIGO DE 8 DÍGITOS"
                maxLength={8}
                className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl px-5 py-5 text-center text-white text-xl font-black outline-none focus:border-green-500 transition-all placeholder:text-zinc-800 font-mono tracking-[0.3em]"
              />
              <button
                disabled={codigoEntrada.length !== 8 || isSaving}
                onClick={handleEntrarNaLiga}
                className="w-full py-5 bg-green-600 text-white font-[1000] uppercase text-xs tracking-[0.2em] rounded-[1.5rem] hover:bg-green-500 active:scale-95 transition-all shadow-xl shadow-green-500/10 disabled:opacity-20 flex items-center justify-center gap-3"
              >
                {isSaving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'ALISTAR-SE NA LIGA'}
              </button>
            </div>
          </motion.div>
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
