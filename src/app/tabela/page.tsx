import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Classificação Série B 2026 | Grêmio Novorizontino',
  description: 'Tabela de classificação atualizada da Série B 2026 do Campeonato Brasileiro. Acompanhe a posição do Grêmio Novorizontino, pontos, jogos e saldo de gols.',
};

export default function TabelaPage() {
  return (
    <main className="min-h-screen bg-black text-white pb-24">

      {/* Botão voltar */}
      <div className="fixed top-8 left-6 z-50">
        <a
          href="/"
          className="group flex items-center gap-2 bg-black/40 hover:bg-yellow-500 border border-white/20 hover:border-yellow-500 backdrop-blur-md px-4 py-2 rounded-full text-white hover:text-black text-[11px] font-black uppercase tracking-widest transition-all duration-300"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Início</span>
        </a>
      </div>

      {/* Header */}
      <div className="border-b border-zinc-900 py-12 px-4 pt-20">
        <div className="max-w-5xl mx-auto">
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3 block">
            Campeonato Brasileiro
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic leading-none tracking-tighter text-white">
            SÉRIE B <span className="text-yellow-500">2026</span>
          </h1>
          <p className="text-zinc-400 mt-3 text-sm">
            Classificação atualizada em tempo real — Tigre do Vale rumo à Série A
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">

        {/* Cards destaque */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
            <span className="text-yellow-500 font-black text-3xl block">🐯</span>
            <span className="text-white font-black text-sm uppercase italic mt-1 block">Tigre do Vale</span>
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest">Grêmio Novorizontino</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
            <span className="text-yellow-500 font-black text-3xl block">🎯</span>
            <span className="text-white font-black text-sm uppercase italic mt-1 block">Meta 2026</span>
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest">Acesso à Série A</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 p-4 text-center">
            <span className="text-yellow-500 font-black text-3xl block">📍</span>
            <span className="text-white font-black text-sm uppercase italic mt-1 block">Jorjão</span>
            <span className="text-zinc-500 text-[9px] uppercase tracking-widest">Novo Horizonte, SP</span>
          </div>
        </div>

        {/* Classificação Série B */}
        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden mb-6">
          <div className="bg-yellow-500 px-6 py-3 flex items-center justify-between">
            <span className="text-black font-black uppercase text-sm tracking-widest">
              Classificação — Série B 2026
            </span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
              <span className="text-black text-[9px] font-black uppercase tracking-widest">
                Tempo Real
              </span>
            </div>
          </div>
          <div className="w-full bg-white" style={{ height: '700px' }}>
            <iframe
              src="https://www.google.com/search?q=tabela+classificacao+serie+b+2026&igu=1&hl=pt-BR"
              className="w-full h-full border-none"
              title="Classificação Série B 2026"
              loading="lazy"
            />
          </div>
        </div>

        {/* Próximos jogos do Novorizontino */}
        <div className="bg-zinc-900 border border-zinc-800 overflow-hidden mb-6">
          <div className="bg-zinc-800 px-6 py-3 flex items-center justify-between">
            <span className="text-white font-black uppercase text-sm tracking-widest">
              Agenda do Tigre
            </span>
            <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest">
              Próximos e últimos jogos
            </span>
          </div>
          <div className="w-full bg-white" style={{ height: '600px' }}>
            <iframe
              src="https://www.google.com/search?q=novorizontino+proximos+jogos+serie+b+2026&igu=1&hl=pt-BR"
              className="w-full h-full border-none"
              title="Agenda Novorizontino 2026"
              loading="lazy"
            />
          </div>
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-between py-6 border-t border-zinc-900">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 animate-pulse rounded-full" />
            <span className="text-zinc-500 text-[9px] font-black uppercase tracking-widest">
              Dados atualizados automaticamente pelo Google
            </span>
          </div>
          <a
            href="/noticias"
            className="text-zinc-500 hover:text-yellow-500 text-[9px] font-black uppercase tracking-widest transition-colors"
          >
            Ver notícias →
          </a>
        </div>

      </div>
    </main>
  );
}
