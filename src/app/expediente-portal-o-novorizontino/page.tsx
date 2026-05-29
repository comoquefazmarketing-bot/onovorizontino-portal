import { Metadata } from 'next';
import Link from 'next/link';

// Número de registro MTE ainda em processo — altere aqui quando sair o registro final
const REGISTRO_MTE = 'em processo — Solicitação SRP202241/2026';

export const metadata: Metadata = {
  title: 'Expediente | Portal O Novorizontino',
  description: 'Conheça a equipe, a missão e as informações institucionais do Portal O Novorizontino.',
  openGraph: {
    title: 'Expediente | Portal O Novorizontino',
    description: 'Informações institucionais, equipe editorial e política de transparência.',
    url: 'https://www.onovorizontino.com.br/expediente-portal-o-novorizontino',
    type: 'website',
  },
};

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
    nome:         'Felipe Makarios',
    nomeRegistro: 'Felipe Tadeu da Motta',
    cargo:        'Editor-Chefe, Jornalista & Desenvolvedor',
    registro:     REGISTRO_MTE,
    bio:          'Responsável pela linha editorial, produção de conteúdo e desenvolvimento técnico da plataforma. Cobre o Grêmio Novorizontino desde 2026 com foco em jornalismo digital independente.',
    emoji:        '✍️',
    areas:        ['Jornalismo Esportivo', 'Desenvolvimento Web', 'Gestão Editorial'],
  },
  {
    nome:         'Karen Makarios',
    nomeRegistro: 'Karen Dayane Espirito da Motta',
    cargo:        'Diretora Administrativa',
    bio:          'Responsável pela gestão administrativa, financeira e pelas parcerias institucionais do veículo. Garante a sustentabilidade e o cumprimento das obrigações legais do portal.',
    emoji:        '📋',
    areas:        ['Gestão Administrativa', 'Parcerias', 'Compliance'],
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

      {/* Botão Voltar */}
      <div className="fixed top-6 left-5 z-50">
        <Link href="/" className="flex items-center gap-2 bg-black/50 hover:bg-yellow-500 border border-white/15 hover:border-yellow-500 backdrop-blur-md px-4 py-2 rounded-full text-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all duration-300">
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
              { label: 'Veículo',                        valor: 'Portal O Novorizontino'                          },
              { label: 'CNPJ',                           valor: '43.945.464/0001-83'                              },
              { label: 'Empresa Mantenedora',            valor: 'Como Que Faz Marketing Digital LTDA'             },
              { label: 'Fundação da Empresa',            valor: '2021'                                            },
              { label: 'Início da Cobertura Jornalística', valor: '2026'                                          },
              { label: 'Sede',                           valor: 'Novo Horizonte – SP, Brasil'                     },
              { label: 'Abrangência',                    valor: 'Nacional (digital)'                              },
              { label: 'Periodicidade',                  valor: 'Diária'                                          },
              { label: 'Formato',                        valor: 'Portal de Jornalismo Digital'                    },
              { label: 'Situação',                       valor: 'Empresa ativa'                                   },
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
                    <h3 className="text-white text-2xl font-black italic uppercase tracking-tight leading-none mb-0.5">
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

        {/* POLÍTICA EDITORIAL */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Política Editorial
            </h2>
          </div>
          <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-6">
            <p>
              O <strong>Portal O Novorizontino</strong> é um veículo de jornalismo digital independente lançado em 2026, mantido pela <strong>Como Que Faz Marketing Digital LTDA</strong> (CNPJ 43.945.464/0001-83), empresa fundada em 2021.
            </p>
            <h3 className="text-yellow-500 text-xl font-bold mt-8">Princípios Fundamentais</h3>
            <ul className="list-disc pl-6 space-y-3">
              <li><strong>Independência:</strong> Não temos vínculo financeiro, político ou institucional com o Grêmio Novorizontino ou qualquer outra entidade. Nossa única lealdade é com o leitor e com a verdade.</li>
              <li><strong>Precisão e Rigor:</strong> Todo conteúdo é checado antes da publicação. Priorizamos a exatidão à velocidade.</li>
              <li><strong>Transparência:</strong> Erros são corrigidos de forma clara, com nota de correção e data da alteração.</li>
              <li><strong>Separação entre Jornalismo e Publicidade:</strong> Conteúdos patrocinados ou publi-editoriais são sempre identificados de forma explícita.</li>
              <li><strong>Respeito à Torcida:</strong> Criticamos quando necessário, mas sempre com base em fatos e de forma construtiva.</li>
            </ul>
            <h3 className="text-yellow-500 text-xl font-bold mt-8">Uso de Inteligência Artificial</h3>
            <p>
              Utilizamos ferramentas de IA como apoio na produção de conteúdo (rascunhos, ideias e otimização). No entanto, <strong>toda matéria publicada passa por revisão humana</strong> antes de ir ao ar. O Supervisor Editorial é o responsável final pela qualidade e veracidade das informações.
            </p>
            <h3 className="text-yellow-500 text-xl font-bold mt-8">Compromisso com o Leitor</h3>
            <p>
              Nosso objetivo é entregar jornalismo sério, ágil e apaixonado pelo Grêmio Novorizontino, sem abrir mão da independência e da ética profissional.
            </p>
          </div>
        </section>

        {/* CONTATO & TRANSPARÊNCIA */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-yellow-500 rounded-full" />
            <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">
              Contato & Transparência
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="mailto:redacao@onovorizontino.com.br"
              className="flex flex-col gap-3 p-6 bg-white/[0.025] border border-white/5 rounded-2xl hover:border-yellow-500/30 transition-all group cursor-pointer no-underline">
              <span className="text-3xl">✉️</span>
              <div>
                <p className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">E-MAIL EDITORIAL</p>
                <p className="text-white text-sm font-black group-hover:text-yellow-500 transition-colors">
                  redacao@onovorizontino.com.br
                </p>
              </div>
            </a>
            <a href="https://wa.me/5517988031679" target="_blank" rel="noopener noreferrer"
              className="flex flex-col gap-3 p-6 bg-white/[0.025] border border-white/5 rounded-2xl hover:border-green-500/30 transition-all group cursor-pointer no-underline">
              <span className="text-3xl">📱</span>
              <div>
                <p className="text-green-400 text-[9px] font-black uppercase tracking-[0.3em] mb-1">WHATSAPP</p>
                <p className="text-white text-sm font-black group-hover:text-green-400 transition-colors">
                  (17) 98803-1679
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* RODAPÉ */}
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
