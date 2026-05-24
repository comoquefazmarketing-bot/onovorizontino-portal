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

// Registro profissional de jornalista (MTE).
const REGISTRO_MTE = 'em processo — Solicitação SRP202241/2026';

type Membro = {
  nome: string;
  nomeRegistro?: string;
  cargo: string;
  registro?: string;
  bio: string;
  emoji: string;
  areas: string[];
};

const EQUIPE: Membro[] = [
  {
    nome: 'Felipe Makarios',
    nomeRegistro: 'Felipe Tadeu da Motta',
    cargo: 'Editor-Chefe, Jornalista & Desenvolvedor',
    registro: REGISTRO_MTE,
    bio: 'Responsável pela linha editorial, produção de conteúdo e desenvolvimento técnico da plataforma. Cobre o Grêmio Novorizontino desde 2026 com foco em jornalismo digital independente.',
    emoji: '✍️',
    areas: ['Jornalismo Esportivo', 'Desenvolvimento Web', 'Gestão Editorial'],
  },
  {
    nome: 'Karen Makarios',
    nomeRegistro: 'Karen Dayane Espirito da Motta',
    cargo: 'Diretora Administrativa',
    bio: 'Responsável pela gestão administrativa, financeira e pelas parcerias institucionais do veículo. Garante a sustentabilidade e o cumprimento das obrigações legais do portal.',
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

      {/* HERO */}
      <header className="relative overflow-hidden pt-28 pb-20 px-6 text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,196,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,196,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/8 blur-[80px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="fade-1 inline-flex items-center gap-3 mb-8 px-5 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">
              TRANSPARÊNCIA & CREDIBILIDADE
            </span>
          </div>
          <h1 className="fade-2 text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] mb-6">
            Expe<span className="text-yellow-500">diente</span>
          </h1>
          <p className="fade-3 text-zinc-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Somos um veículo de jornalismo digital independente dedicado à cobertura do <strong className="text-white">Grêmio Novorizontino</strong>.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 py-16 space-y-16">
        {/* IDENTIFICAÇÃO INSTITUCIONAL */}
        <section className="fade-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Identificação Institucional
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Veículo', valor: 'Portal O Novorizontino' },
              { label: 'CNPJ', valor: '43.945.464/0001-83' },
              { label: 'Empresa Mantenedora', valor: 'Como Que Faz Marketing Digital LTDA' },
              { label: 'Fundação da Empresa', valor: '2021' },
              { label: 'Início da Cobertura Jornalística', valor: '2026' },
              { label: 'Sede', valor: 'Novo Horizonte – SP, Brasil' },
              { label: 'Abrangência', valor: 'Nacional (digital)' },
              { label: 'Periodicidade', valor: 'Diária' },
              { label: 'Formato', valor: 'Portal de Jornalismo Digital' },
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

        {/* EQUIPE EDITORIAL */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Equipe Editorial
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EQUIPE.map(p => (
              <div key={p.nome} className="relative overflow-hidden p-7 rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.03] to-transparent group hover:border-yellow-500/30 transition-all duration-500">
                <div className="absolute top-4 right-5 text-5xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {p.emoji}
                </div>
                <div className="relative z-10">
                  <div className="mb-4">
                    <h3 className="text-white text-2xl font-black italic uppercase tracking-tight leading-none mb-1">
                      {p.nome}
                    </h3>
                    {p.nomeRegistro && (
                      <p className="text-zinc-500 text-[11px] font-semibold italic tracking-wide mb-1 normal-case">
                        nome de registro: {p.nomeRegistro}
                      </p>
                    )}
                    <p className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.25em]">{p.cargo}</p>
                    {p.registro && (
                      <p className="text-zinc-400 text-[9px] font-black uppercase tracking-[0.2em] mt-2">
                        Registro Profissional MTE: <span className="text-white">{p.registro}</span>
                      </p>
                    )}
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

        {/* MISSÃO */}
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
                "Cobrir o Grêmio Novorizontino com profundidade, independência e transparência."
              </blockquote>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { titulo: 'Independência', texto: 'Sem vínculo político ou financeiro com o clube que comprometa nossa linha editorial.' },
                  { titulo: 'Transparência', texto: 'Identificamos fontes, corrigimos erros publicamente e declaramos conflitos de interesse.' },
                  { titulo: 'Rigor', texto: 'Checamos informações antes de publicar. Priorizamos qualidade à velocidade.' },
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

        {/* POLÍTICA EDITORIAL */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Política Editorial
            </h2>
          </div>
          <div className="space-y-4 text-zinc-300 text-base leading-relaxed">
            <p>
              O <strong>Portal O Novorizontino</strong> é um projeto de jornalismo digital independente lançado em <strong>2026</strong>, mantido pela <strong>Como Que Faz Marketing Digital LTDA</strong>, empresa fundada em <strong>2021</strong> (CNPJ 43.945.464/0001-83) e com sede em Novo Horizonte – SP.
            </p>
            <p>
              Embora a empresa já atuasse em outras áreas desde 2021, o portal representa o início da nossa atuação específica no jornalismo esportivo, com foco exclusivo na cobertura do Grêmio Novorizontino e do futebol do interior paulista.
            </p>
            <p>
              Conteúdos patrocinados ou publi-editoriais são sempre identificados claramente. A redação mantém total independência editorial em relação à área comercial.
            </p>
          </div>
        </section>

        {/* CONTATO */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Contato & Transparência
            </h2>
          </div>
          {/* ... (mantenha o mesmo bloco de contato que você já tinha) */}
        </section>
      </div>
    </main>
  );
}
