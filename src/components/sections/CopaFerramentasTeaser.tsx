import Link from 'next/link';

const FERRAMENTAS = [
  {
    href: '/copa',
    emoji: '📊',
    titulo: 'Tabela de Grupos',
    desc: '12 grupos, 48 seleções. Acompanhe a classificação ao vivo e veja quem avança.',
    cor: '#F5C400',
    tag: 'GRUPOS A–L',
  },
  {
    href: '/copa',
    emoji: '⚽',
    titulo: 'Simulador de Resultados',
    desc: 'Insira os placares dos jogos e veja a tabela atualizar em tempo real.',
    cor: '#009c3b',
    tag: 'INTERATIVO',
  },
  {
    href: '/copa',
    emoji: '🧮',
    titulo: 'Calculadora',
    desc: 'Selecione um país e descubra quantos pontos ele precisa para se classificar.',
    cor: '#002776',
    tag: '48 PAÍSES',
  },
];

export default function CopaFerramentasTeaser() {
  return (
    <section
      className="ve-section py-14 px-4"
      id="ferramentas"
      aria-label="Ferramentas interativas da Copa do Mundo 2026"
      style={{ background: 'linear-gradient(180deg, #030a04 0%, #020810 100%)' }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="ve-subtitulo text-[#F5C400] text-xs font-bold tracking-[0.25em] uppercase block mb-3">
            🏆 Ferramentas Interativas
          </span>
          <h2 className="ve-titulo text-4xl md:text-6xl text-white mb-2">
            COPA <span style={{ color: '#F5C400' }}>2026</span>
          </h2>
          <p className="ve-subtitulo text-white/50 text-sm tracking-widest uppercase">
            Tabela · Simulador · Calculadora
          </p>
          <div className="w-20 h-1 mx-auto rounded-full mt-4"
            style={{ background: 'linear-gradient(90deg, #F5C400, #009c3b)' }} />
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {FERRAMENTAS.map((f) => (
            <Link
              key={f.titulo}
              href={f.href}
              className="card-jogador group rounded-2xl overflow-hidden border border-white/8 block no-underline"
              style={{ background: 'rgba(0,10,5,0.9)' }}
              aria-label={f.titulo}
            >
              {/* Topo colorido */}
              <div className="h-1" style={{ background: f.cor }} />

              <div className="p-6">
                {/* Tag */}
                <span
                  className="ve-subtitulo text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full mb-4 inline-block"
                  style={{
                    background: `${f.cor}18`,
                    color: f.cor,
                    border: `1px solid ${f.cor}35`,
                  }}
                >
                  {f.tag}
                </span>

                {/* Emoji + título */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-4xl">{f.emoji}</span>
                  <h3
                    className="ve-titulo text-2xl text-white leading-tight group-hover:opacity-80 transition-opacity"
                  >
                    {f.titulo}
                  </h3>
                </div>

                {/* Desc */}
                <p className="text-white/50 text-sm leading-relaxed mb-5">
                  {f.desc}
                </p>

                {/* CTA */}
                <div
                  className="ve-subtitulo text-xs font-black uppercase tracking-wider flex items-center gap-1.5 group-hover:gap-3 transition-all"
                  style={{ color: f.cor }}
                >
                  Acessar <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Link principal */}
        <div className="text-center">
          <Link
            href="/copa"
            className="ve-subtitulo inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wider border transition-all hover:bg-[#F5C400]/10"
            style={{ borderColor: 'rgba(245,196,0,0.4)', color: '#F5C400' }}
          >
            🏆 Abrir todas as ferramentas →
          </Link>
        </div>
      </div>
    </section>
  );
}
