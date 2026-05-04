import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre o Portal | Portal O Novorizontino',
  description: 'O Portal O Novorizontino é o principal veículo de jornalismo digital independente dedicado à cobertura do Grêmio Novorizontino. Conheça nossa história, missão e equipe.',
  openGraph: {
    title: 'Sobre | Portal O Novorizontino',
    description: 'O principal veículo de cobertura independente do Grêmio Novorizontino.',
    url: 'https://www.onovorizontino.com.br/sobre',
    type: 'website',
  },
};

const NUMEROS = [
  { valor: '2021', label: 'Fundação' },
  { valor: 'Diária', label: 'Periodicidade' },
  { valor: 'Nacional', label: 'Abrangência' },
  { valor: '10+', label: 'Categorias editoriais' },
];

const PILARES = [
  {
    titulo: 'Cobertura Completa',
    texto:
      'Do pré-jogo ao pós-jogo, passando por análises táticas, mercado de transferências e bastidores — cobrimos o Novorizontino com a profundidade que o clube e o torcedor merecem.',
    icon: '⚽',
  },
  {
    titulo: 'Jornalismo Independente',
    texto:
      'Não somos porta-voz do clube nem de seus patrocinadores. Nossa única lealdade é com a informação precisa e a transparência editorial.',
    icon: '📰',
  },
  {
    titulo: 'Tecnologia a Serviço do Torcedor',
    texto:
      'Desenvolvemos ferramentas como o TigreFC — nosso jogo de simulação esportiva — para aprofundar o engajamento da torcida com o Tigre do Vale.',
    icon: '🛠️',
  },
  {
    titulo: 'Comunidade Tigre',
    texto:
      'Acreditamos que o futebol é mais rico quando vivido em comunidade. Por isso, investimos em canais de interação, comentários e debates que unem a torcida Novorizontina.',
    icon: '🤝',
  },
];

export default function SobrePage() {
  return (
    <main
      className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700;1,900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        .fade-1 { animation: fadeUp .6s .1s both }
        .fade-2 { animation: fadeUp .6s .25s both }
        .fade-3 { animation: fadeUp .6s .4s both }
      `}</style>

      {/* Botão voltar */}
      <div className="fixed top-6 left-5 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 bg-black/50 hover:bg-yellow-500 border border-white/15 hover:border-yellow-500 backdrop-blur-md px-4 py-2 rounded-full text-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all duration-300"
        >
          ← Início
        </Link>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden pt-28 pb-20 px-6 text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,196,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,196,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/8 blur-[80px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="fade-1 inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Jornalismo Digital Independente · Desde 2021
            </span>
          </div>

          <h1 className="fade-2 text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
            Sobre o <span className="text-yellow-500">Portal</span>
          </h1>

          <p className="fade-3 text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Somos o principal veículo de comunicação digital dedicado exclusivamente ao{' '}
            <strong className="text-white">Grêmio Novorizontino</strong> — o Tigre do Vale da Série B 2026.
          </p>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-16 space-y-20">

        {/* Números */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {NUMEROS.map(({ valor, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center p-6 bg-white/[0.025] border border-white/5 rounded-2xl text-center hover:border-yellow-500/20 transition-all"
              >
                <p className="text-yellow-500 text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none mb-2">
                  {valor}
                </p>
                <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.25em]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nossa história */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Nossa História
            </h2>
          </div>
          <div className="space-y-5 text-zinc-300 text-base leading-relaxed">
            <p>
              O <strong className="text-white">Portal O Novorizontino</strong> nasceu da percepção de que o Grêmio Novorizontino — um clube com história, identidade e torcida apaixonada — merecia uma cobertura jornalística à altura de seu crescimento. Fundado em 2021 pela{' '}
              <strong className="text-white">Como Que Faz Marketing Digital LTDA</strong> (CNPJ 43.945.464/0001-83), o portal surgiu como uma iniciativa independente, sem vínculos editoriais com o clube ou com patrocinadores que comprometam a linha jornalística.
            </p>
            <p>
              Ao longo dos anos, evoluímos de um blog esportivo para um portal completo de jornalismo digital, incorporando análises táticas aprofundadas, cobertura de mercado de transferências, escalações em tempo real e, mais recentemente, o <strong className="text-white">TigreFC</strong> — nosso inovador jogo de simulação esportiva que permite aos torcedores escalarem seu próprio time do Novorizontino e competirem entre si.
            </p>
            <p>
              Sediados em Novo Horizonte – SP, cobrimos o Novorizontino com a proximidade de quem vive a cidade e o clube, e a responsabilidade de quem acredita que o jornalismo esportivo independente é fundamental para a cultura futebolística brasileira.
            </p>
          </div>
        </section>

        {/* Pilares */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              O Que Nos Move
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PILARES.map((p) => (
              <div
                key={p.titulo}
                className="relative overflow-hidden p-7 rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-yellow-500/30 transition-all duration-500"
              >
                <div className="text-4xl mb-4 opacity-80">{p.icon}</div>
                <h3 className="text-white text-xl font-black italic uppercase tracking-tight mb-3">
                  {p.titulo}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{p.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* O TigreFC */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              TigreFC — O Jogo da Torcida
            </h2>
          </div>
          <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-yellow-500/40 via-zinc-800 to-yellow-500/10">
            <div className="bg-gradient-to-br from-[#0d0a00] to-[#050505] rounded-3xl p-8 md:p-12">
              <p className="text-zinc-300 text-base leading-relaxed mb-6">
                O <strong className="text-white">TigreFC</strong> é o nosso jogo de simulação esportiva (fantasy football) desenvolvido exclusivamente para a torcida Novorizontina. Escale sua equipe, pontue com base no desempenho real dos jogadores e dispute rankings com outros torcedores.
              </p>
              <ul className="space-y-3 text-zinc-400 text-sm mb-8">
                {[
                  'Totalmente gratuito — sem apostas, sem dinheiro real',
                  'Escalações semanais baseadas nos jogos do Novorizontino',
                  'Rankings públicos e perfis de usuário personalizáveis',
                  'Chat exclusivo para os participantes do jogo',
                  'Ligas para competir com amigos',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-yellow-500 font-black mt-0.5">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/tigre-fc"
                className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all active:scale-95"
              >
                Jogar Agora →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Expediente */}
        <section className="text-center py-6">
          <p className="text-zinc-500 text-sm mb-5">
            Quer saber mais sobre nossa equipe, política editorial e informações institucionais?
          </p>
          <Link
            href="/expediente-portal-o-novorizontino"
            className="inline-flex items-center gap-3 border border-yellow-500/40 hover:border-yellow-500 hover:bg-yellow-500/5 text-yellow-500 font-black text-sm uppercase tracking-widest px-8 py-4 rounded-xl transition-all"
          >
            Ver Expediente Completo →
          </Link>
        </section>

        {/* Footer links */}
        <footer className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} Portal O Novorizontino · CNPJ 43.945.464/0001-83
          </p>
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
              Privacidade
            </Link>
            <Link href="/termos-de-uso" className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
              Termos
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
