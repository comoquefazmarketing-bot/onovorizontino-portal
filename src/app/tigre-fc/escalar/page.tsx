'use client';

import { useEffect, useState, useCallback } from 'react';
import { type JogoAtivo } from '@/lib/tigre-fc/jogo-estado';

interface EscalacaoForm {
  lineup: string[];
  capitao_id: string;
  heroi_id: string;
  palpite_tigre: number;
  palpite_adv: number;
  formacao: string;
}

export default function EscalarPage() {
  const [jogo, setJogo] = useState<JogoAtivo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [segundos, setSegundos] = useState<number | null>(null);
  const [form, setForm] = useState<EscalacaoForm>({
    lineup: [],
    capitao_id: '',
    heroi_id: '',
    palpite_tigre: 0,
    palpite_adv: 0,
    formacao: '4-3-3',
  });

  // Busca o jogo ativo
  useEffect(() => {
    fetch('/api/tigre-fc/jogo-ativo')
      .then(r => r.json())
      .then(data => {
        setJogo(data);
        if (data?.segundos_para_fechar != null) setSegundos(data.segundos_para_fechar);
      })
      .finally(() => setCarregando(false));
  }, []);

  // Countdown
  useEffect(() => {
    if (segundos === null || segundos <= 0) return;
    const t = setInterval(() => setSegundos(s => (s != null && s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [segundos !== null]);

  const escalacaoFechada =
    !jogo ||
    jogo.estado !== 'escalacao_aberta' ||
    (segundos !== null && segundos <= 0);

  const salvar = useCallback(async () => {
    if (escalacaoFechada || salvando) return;
    setSalvando(true);
    setMensagem('');
    try {
      const res = await fetch('/api/tigre-fc/salvar-escalacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jogo_id: jogo!.id, ...form }),
      });
      const data = await res.json();
      if (res.ok) setMensagem('✅ Escalação salva!');
      else setMensagem(`❌ ${data.error}`);
    } catch {
      setMensagem('❌ Erro de conexão');
    } finally {
      setSalvando(false);
    }
  }, [escalacaoFechada, salvando, jogo, form]);

  if (carregando) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500 font-black uppercase tracking-widest animate-pulse">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-['Barlow_Condensed',sans-serif] pb-20">
      {/* HEADER */}
      <div className="border-b border-yellow-500/20 px-4 py-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-yellow-500 mb-1">Arena Tigre FC</p>
        <h1 className="text-4xl font-black italic uppercase tracking-tight">Escalação</h1>
        {jogo && (
          <p className="text-gray-400 text-sm mt-1 uppercase">
            {jogo.mandante_slug.replace(/-/g, ' ')} × {jogo.visitante_slug.replace(/-/g, ' ')}
            {' · '}Rodada {jogo.rodada}
          </p>
        )}
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* ESTADO / COUNTDOWN */}
        {escalacaoFechada ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-center">
            <p className="text-red-400 font-black uppercase tracking-widest text-lg">
              Escalação Encerrada
            </p>
            {jogo?.estado === 'ao_vivo' && (
              <p className="text-gray-500 text-xs mt-1 uppercase">Jogo em andamento</p>
            )}
            {(jogo?.estado === 'encerrado' || jogo?.estado === 'pontuado') && (
              <p className="text-gray-500 text-xs mt-1 uppercase">
                <a href="/tigre-fc/ranking" className="text-yellow-500 underline">Ver pontuação →</a>
              </p>
            )}
          </div>
        ) : (
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center">
            <p className="text-green-400 font-black uppercase tracking-widest mb-1">Escalação Aberta</p>
            {segundos !== null && segundos > 0 && (
              <p className="text-3xl font-black text-white font-mono">
                {formatCountdown(segundos)}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest">para o kickoff</p>
          </div>
        )}

        {/* JOGO */}
        {jogo && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Data e hora</p>
            <p className="font-black uppercase">
              {new Date(jogo.data_hora).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                weekday: 'long', day: '2-digit', month: 'long',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {jogo.transmissao && (
              <p className="text-gray-500 text-xs mt-1">{jogo.transmissao}</p>
            )}
          </div>
        )}

        {/* PALPITE */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-black uppercase text-yellow-500 tracking-widest text-sm">Palpite de placar</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500 uppercase mb-2">
                {jogo?.mandante_slug === 'novorizontino' ? 'Novorizontino' : jogo?.mandante_slug?.replace(/-/g, ' ')}
              </p>
              <input
                type="number" min="0" max="20"
                value={form.palpite_tigre}
                disabled={escalacaoFechada}
                onChange={e => setForm(f => ({ ...f, palpite_tigre: Number(e.target.value) }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl text-center text-3xl font-black p-3 text-yellow-500 disabled:opacity-50"
              />
            </div>
            <span className="text-2xl font-black text-gray-600">×</span>
            <div className="flex-1 text-center">
              <p className="text-xs text-gray-500 uppercase mb-2">
                {jogo?.visitante_slug !== 'novorizontino' ? jogo?.visitante_slug?.replace(/-/g, ' ') : jogo?.mandante_slug?.replace(/-/g, ' ')}
              </p>
              <input
                type="number" min="0" max="20"
                value={form.palpite_adv}
                disabled={escalacaoFechada}
                onChange={e => setForm(f => ({ ...f, palpite_adv: Number(e.target.value) }))}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl text-center text-3xl font-black p-3 disabled:opacity-50"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <p>🎯 Placar exato: <span className="text-yellow-500 font-black">+15 pts</span></p>
            <p>✅ Resultado certo: <span className="text-yellow-500 font-black">+5 pts</span></p>
          </div>
        </div>

        {/* NOTA: lineup completo virá quando tigre_fc_atletas for populada */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center text-gray-500 text-sm">
          <p className="font-black uppercase text-gray-400 mb-1">Lineup de jogadores</p>
          <p className="text-xs">Em breve — quando o elenco do Novorizontino for cadastrado</p>
          <p className="text-xs mt-1">Capitão ×2 pts · Herói +10 pts</p>
        </div>

        {/* SALVAR */}
        {!escalacaoFechada && (
          <button
            onClick={salvar}
            disabled={salvando}
            className="w-full bg-yellow-500 text-black font-black uppercase tracking-widest py-4 rounded-xl text-lg hover:bg-yellow-400 disabled:opacity-50 transition-colors"
          >
            {salvando ? 'Salvando...' : 'Confirmar Escalação'}
          </button>
        )}

        {mensagem && (
          <p className="text-center font-black uppercase tracking-wide">{mensagem}</p>
        )}
      </div>
    </main>
  );
}

function formatCountdown(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m`;
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}
