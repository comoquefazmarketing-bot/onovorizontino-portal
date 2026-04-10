import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Expediente | Portal O Novorizontino',
  description: 'Conheça a equipe, a missão e as informações institucionais do Portal O Novorizontino — veículo independente de jornalismo digital dedicado ao Grêmio Novorizontino.',
  openGraph: {
    title: 'Expediente | Portal O Novorizontino',
    description: 'Informações institucionais, equipe editorial e política de transparência do Portal O Novorizontino.',
    url: 'https://www.onovorizontino.com.br/expediente-portal-o-novorizontino',
    type: 'website',
  },
};

const EQUIPE = [
  {
    nome:  'Felipe Makarios',
    cargo: 'Editor-Chefe & Desenvolvedor',
    bio:   'Responsável pela linha editorial, produção de conteúdo e desenvolvimento técnico da plataforma. Cobre o Grêmio Novorizontino desde 2021 com foco em jornalismo digital independente.',
    emoji: '✍️',
    areas: ['Jornalismo Esportivo', 'Desenvolvimento Web', 'Gestão Editorial'],
  },
  {
    nome:  'Karen Makarios',
    cargo: 'Diretora Administrativa',
    bio:   'Responsável pela gestão administrativa, financeira e pelas parcerias institucionais do veículo. Garante a sustentabilidade e o cumprimento das obrigações legais do portal.',
    emoji: '📋',
    areas: ['Gestão Administrativa', 'Parcerias', 'Compliance'],
  },
];

export default function ExpedientePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        .fade-1 { animation: fadeUp .6s .1s both }
        .fade-2 { animation: fadeUp .6s .25s both }
        .fade-3 { animation: fadeUp .6s .4s both }
        .fade-4 { animation: fadeUp .6s .55s both }
      `}</style>

      {/* Botão voltar */}
      <div className="fixed top-6 left-5 z-50">
        <Link href="/"
          className="flex items-center gap-2 bg-black/50 hover:bg-yellow-500 border border-white/15 hover:border-yellow-500 backdrop-blur-md px-4 py-2 rounded-full text-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all duration-300">
          ← Início
        </Link>
      </div>

      {/* ═══ HERO ═══ */}
      <header className="relative overflow-hidden pt-28 pb-20 px-6 text-center border-b border-white/5">
        {/* Grade de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,196,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,196,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {/* Glow central */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/8 blur-[80px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="fade-1 inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Transparência & Credibilidade
            </span>
          </div>

          <h1 className="fade-2 text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
            Expe<span className="text-yellow-500">diente</span>
          </h1>

          <p className="fade-3 text-zinc-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Somos um veículo de jornalismo digital independente dedicado à cobertura do <strong className="text-white">Grêmio Novorizontino</strong> e ao ecossistema do futebol do interior paulista.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-16 space-y-16">

        {/* ═══ IDENTIFICAÇÃO INSTITUCIONAL ═══ */}
        <section className="fade-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Identificação Institucional
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Veículo',        valor: 'Portal O Novorizontino'              },
              { label: 'CNPJ',           valor: '43.945.464/0001-83'                  },
              { label: 'Fundação',       valor: '2021'                                },
              { label: 'Sede',           valor: 'Novo Horizonte – SP, Brasil'         },
              { label: 'Abrangência',    valor: 'Nacional (digital)'                  },
              { label: 'Periodicidade',  valor: 'Diária'                              },
              { label: 'Formato',        valor: 'Portal de Jornalismo Digital'        },
              { label: 'Situação',       valor: 'Empresa ativa'                       },
            ].map(({ label, valor }) => (
              <div key={label} className="flex items-start gap-4 p-5 bg-white/[0.025] border border-white/5 rounded-2xl">
                <div className="flex-1">
                  <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">{label}</p>
                  <p className="text-white font-black text-base uppercase tracking-tight">{valor}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ EQUIPE EDITORIAL ═══ */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Equipe Editorial
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EQUIPE.map(p => (
              <div key={p.nome}
                className="relative overflow-hidden p-7 rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent group hover:border-yellow-500/30 transition-all duration-500">
                <div className="absolute top-4 right-5 text-5xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {p.emoji}
                </div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <h3 className="text-white text-2xl font-black italic uppercase tracking-tight leading-none mb-1">
                      {p.nome}
                    </h3>
                    <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.25em]">{p.cargo}</p>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5">{p.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {p.areas.map(a => (
                      <span key={a} className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/8 text-zinc-500">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ MISSÃO ═══ */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Missão & Valores
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-3xl p-[1px] bg-gradient-to-br from-yellow-500/40 via-zinc-800 to-yellow-500/10">
            <div className="bg-gradient-to-br from-[#0d0a00] to-[#050505] rounded-3xl p-8 md:p-12">
              <blockquote className="text-2xl md:text-3xl font-black italic text-white leading-tight mb-8 border-l-4 border-yellow-500 pl-6">
                "Cobrir o Novorizontino com a profundidade que o clube merece e a transparência que o torcedor exige."
              </blockquote>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { titulo: 'Independência',  texto: 'Sem vínculo com o clube ou patrocinadores que comprometam a linha editorial. Nossa única lealdade é com a informação.' },
                  { titulo: 'Transparência',  texto: 'Identificamos nossas fontes, corrigimos erros publicamente e declaramos conflitos de interesse quando existem.' },
                  { titulo: 'Rigor',          texto: 'Checamos informações antes de publicar. Preferimos chegar depois com a notícia certa do que primeiro com a errada.' },
                ].map(({ titulo, texto }) => (
                  <div key={titulo}>
                    <p className="text-yellow-500 text-sm font-black uppercase tracking-widest mb-2">{titulo}</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">{texto}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ POLÍTICA EDITORIAL ═══ */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Política Editorial
            </h2>
          </div>

          <div className="space-y-4 text-zinc-300 text-base leading-relaxed">
            <p>
              O Portal O Novorizontino é um veículo de jornalismo digital independente fundado em 2021, registrado sob o CNPJ <strong className="text-white">43.945.464/0001-83</strong>. Toda a produção de conteúdo segue os princípios do jornalismo ético: verificação de informações, identificação de fontes e separação clara entre notícia e opinião.
            </p>
            <p>
              Conteúdos patrocinados, publi-editoriais e parcerias comerciais são sempre identificados como tal, em separado do jornalismo editorial. A equipe de redação tem autonomia editorial independente da área comercial.
            </p>
            <p>
              Erros e imprecisões são corrigidos com nota de correção visível no próprio conteúdo, identificando a alteração e a data em que foi realizada.
            </p>
            <p>
              O veículo adota as diretrizes éticas da <strong className="text-white">FENAJ</strong> (Federação Nacional dos Jornalistas) como referência para a conduta editorial e está em processo de associação à <strong className="text-white">AJOR</strong> (Associação de Jornalismo Digital).
            </p>
          </div>
        </section>

        {/* ═══ CONTATO ═══ */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Contato & Transparência
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="mailto:comoquefazmarketing@gmail.com"
              className="flex flex-col gap-3 p-6 bg-white/[0.025] border border-white/5 rounded-2xl hover:border-yellow-500/30 transition-all group cursor-pointer no-underline">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">E-mail Editorial</p>
                <p className="text-white text-sm font-black break-all group-hover:text-yellow-500 transition-colors">
                  comoquefazmarketing@gmail.com
                </p>
              </div>
            </a>

            <a href="https://whatsapp.com/channel/0029VbCHacz2P59ioS22VU09" target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-3 p-6 bg-white/[0.025] border border-white/5 rounded-2xl hover:border-green-500/30 transition-all group cursor-pointer no-underline">
              <span className="text-2xl">📱</span>
              <div>
                <p className="text-green-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Canal WhatsApp</p>
                <p className="text-white text-sm font-black group-hover:text-green-400 transition-colors">
                  A Alcateia — Canal Oficial
                </p>
              </div>
            </a>

            <div className="flex flex-col gap-3 p-6 bg-white/[0.025] border border-white/5 rounded-2xl">
              <span className="text-2xl">🌐</span>
              <div>
                <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Site</p>
                <p className="text-white text-sm font-black">www.onovorizontino.com.br</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ DIREITOS ═══ */}
        <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Portal O Novorizontino · CNPJ 43.945.464/0001-83
            </p>
            <p className="text-zinc-700 text-xs mt-1">
              Todo o conteúdo é protegido por direitos autorais. Reprodução permitida com atribuição.
            </p>
          </div>
          <Link href="/" className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
            ← Voltar ao Portal
          </Link>
        </footer>

      </div>
    </main>
  );
}
