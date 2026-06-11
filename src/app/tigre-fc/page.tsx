import { getProximoJogoEscalavel, getJogoAtivo } from '@/lib/tigre-fc/jogo-estado';
import Link from 'next/link';

export const revalidate = 60;

export default async function TigreFCHub() {
  let jogoEscalavel = null;
  let jogoAtivo = null;

  try {
    jogoEscalavel = await getProximoJogoEscalavel();
    if (!jogoEscalavel) jogoAtivo = await getJogoAtivo();
  } catch {
    // degradação graciosa
  }

  const jogo = jogoEscalavel ?? jogoAtivo;

  return (
    <main className="min-h-screen bg-black text-white font-['Barlow_Condensed',sans-serif]">
      {/* HEADER */}
      <div className="border-b border-yellow-500/20 px-4 py-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-yellow-500 mb-1">Arena</p>
        <h1 className="text-5xl font-black italic uppercase tracking-tight">
          Tigre <span className="text-yellow-500">FC</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest">Fantasy · Série B 2026</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* JOGO DA RODADA */}
        {jogo ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-yellow-500 mb-3">
              {jogo.competicao} · Rodada {jogo.rodada}
            </p>
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-2xl font-black uppercase">{jogo.mandante_slug.replace(/-/g, ' ')}</span>
              {(jogo.estado === 'encerrado' || jogo.estado === 'ao_vivo' || jogo.estado === 'pontuado') ? (
                <span className="text-3xl font-black text-yellow-500">
                  {jogo.placar_mandante ?? '–'} × {jogo.placar_visitante ?? '–'}
                </span>
              ) : (
                <span className="text-xl font-black text-gray-500">×</span>
              )}
              <span className="text-2xl font-black uppercase text-right">{jogo.visitante_slug.replace(/-/g, ' ')}</span>
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest">
              {new Date(jogo.data_hora).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo',
                weekday: 'long', day: '2-digit', month: 'long',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
            {jogo.transmissao && (
              <p className="text-gray-600 text-xs mt-1">{jogo.transmissao}</p>
            )}
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-gray-500">
            Nenhum jogo agendado no momento
          </div>
        )}

        {/* AÇÕES */}
        <div className="grid grid-cols-1 gap-3">
          {jogoEscalavel ? (
            <Link
              href="/tigre-fc/escalar"
              className="block bg-yellow-500 text-black text-center font-black uppercase tracking-widest py-4 rounded-xl text-lg hover:bg-yellow-400 transition-colors"
            >
              ⚡ Escalar agora
            </Link>
          ) : jogoAtivo?.estado === 'encerrado' || jogoAtivo?.estado === 'pontuado' ? (
            <Link
              href="/tigre-fc/ranking"
              className="block bg-yellow-500/10 border border-yellow-500/40 text-yellow-500 text-center font-black uppercase tracking-widest py-4 rounded-xl text-lg hover:bg-yellow-500/20 transition-colors"
            >
              🏆 Ver pontuação
            </Link>
          ) : (
            <div className="bg-zinc-900 border border-zinc-800 text-gray-500 text-center font-black uppercase tracking-widest py-4 rounded-xl text-sm">
              Escalação encerrada
            </div>
          )}

          <Link
            href="/tigre-fc/ranking"
            className="block bg-zinc-900 border border-zinc-800 text-center font-black uppercase tracking-widest py-3 rounded-xl text-sm text-gray-300 hover:border-yellow-500/40 transition-colors"
          >
            Ranking geral
          </Link>
        </div>

        {/* STATUS DO JOGO */}
        {jogo && (
          <div className="text-center">
            <EstadoBadge estado={jogo.estado} />
          </div>
        )}
      </div>
    </main>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; cor: string }> = {
    escalacao_aberta:  { label: 'ESCALAÇÃO ABERTA',   cor: 'bg-green-500/20 text-green-400 border-green-500/40' },
    escalacao_fechada: { label: 'ESCALAÇÃO ENCERRADA', cor: 'bg-red-500/20 text-red-400 border-red-500/40' },
    ao_vivo:           { label: 'AO VIVO',             cor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40 animate-pulse' },
    encerrado:         { label: 'ENCERRADO',           cor: 'bg-zinc-700 text-gray-400 border-zinc-600' },
    pontuado:          { label: 'PONTUADO',            cor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40' },
    agendado:          { label: 'AGENDADO',            cor: 'bg-zinc-800 text-gray-500 border-zinc-700' },
  };
  const { label, cor } = map[estado] ?? { label: estado.toUpperCase(), cor: 'bg-zinc-800 text-gray-500 border-zinc-700' };
  return (
    <span className={`inline-block border px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${cor}`}>
      {label}
    </span>
  );
}
