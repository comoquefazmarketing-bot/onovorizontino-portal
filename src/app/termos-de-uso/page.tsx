import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso | Portal O Novorizontino',
  description: 'Termos de Uso do Portal O Novorizontino. Conheça as regras e condições para utilização do portal e do jogo TigreFC.',
  openGraph: {
    title: 'Termos de Uso | Portal O Novorizontino',
    description: 'Regras e condições para utilização do portal e do jogo TigreFC.',
    url: 'https://www.onovorizontino.com.br/termos-de-uso',
    type: 'website',
  },
};

const SECOES = [
  {
    titulo: '1. Aceitação dos Termos',
    conteudo: `Ao acessar ou utilizar o Portal O Novorizontino (www.onovorizontino.com.br), você declara ter lido, entendido e concordado com estes Termos de Uso. Caso não concorde com qualquer parte destes termos, você não deve utilizar nosso portal.

Estes Termos de Uso se aplicam a todos os visitantes, usuários e qualquer pessoa que acesse ou use os serviços oferecidos pelo portal.`,
  },
  {
    titulo: '2. Sobre o Portal',
    conteudo: `O Portal O Novorizontino é um veículo de jornalismo digital independente dedicado à cobertura do Grêmio Novorizontino, mantido pela Como Que Faz Marketing Digital LTDA (CNPJ 43.945.464/0001-83), com sede em Novo Horizonte – SP, Brasil. O portal foi fundado em 2021 e opera com periodicidade diária.

Nossos serviços incluem: cobertura jornalística esportiva, análises táticas, escalações, tabelas de classificação, vídeos, e o jogo de simulação esportiva TigreFC.`,
  },
  {
    titulo: '3. Uso Permitido',
    conteudo: `Você pode utilizar o portal para:

• Ler e compartilhar nossos conteúdos jornalísticos com devida atribuição à fonte.
• Participar do jogo TigreFC após criar uma conta.
• Interagir nos comentários de forma respeitosa e construtiva.
• Assistir vídeos e acessar materiais multimídia disponibilizados.

É vedado:

• Reproduzir, copiar ou redistribuir conteúdo do portal sem autorização e sem mencionar a fonte.
• Usar robôs, scrapers ou qualquer tecnologia automatizada para coletar dados do portal sem autorização prévia por escrito.
• Tentar comprometer a segurança, integridade ou disponibilidade do portal.
• Publicar conteúdo difamatório, ofensivo, discriminatório ou ilegal nos comentários ou no chat do TigreFC.
• Criar múltiplas contas no TigreFC para manipular rankings.`,
  },
  {
    titulo: '4. Propriedade Intelectual',
    conteudo: `Todo o conteúdo editorial publicado no Portal O Novorizontino — incluindo textos, análises, títulos, fotografias de produção própria, logotipos e elementos visuais criados pelo portal — é protegido por direitos autorais e de propriedade intelectual, nos termos da Lei nº 9.610/1998.

A reprodução parcial de conteúdos é permitida desde que: (i) haja clara atribuição ao Portal O Novorizontino como fonte; (ii) seja incluído link direto para o conteúdo original; (iii) a reprodução não seja de caráter comercial sem autorização prévia.

Marcas, nomes e emblemas do Grêmio Novorizontino são de propriedade do clube e utilizados apenas para fins jornalísticos e informativos.`,
  },
  {
    titulo: '5. TigreFC — Jogo de Simulação Esportiva',
    conteudo: `O TigreFC é um jogo de simulação esportiva (fantasy football) sem qualquer modalidade de apostas ou envolvimento de dinheiro real. Trata-se exclusivamente de entretenimento digital.

Ao participar do TigreFC, você concorda que:

• O jogo não envolve apostas, sorteios ou qualquer forma de jogo de azar regulado.
• Os pontos e rankings são de caráter simbólico e não possuem valor monetário.
• Sua conta pode ser suspensa caso sejam identificadas violações aos presentes termos (ex.: múltiplas contas, manipulação de resultados).
• O portal se reserva o direito de alterar regras, formatos e pontuações do jogo a qualquer momento, com comunicação prévia sempre que possível.
• Dados de escalação e desempenho no jogo podem ser exibidos publicamente no ranking e no perfil de usuário.`,
  },
  {
    titulo: '6. Contas de Usuário',
    conteudo: `Para utilizar o TigreFC, você deve criar uma conta usando autenticação Google. Você é responsável por:

• Manter a confidencialidade de sua conta.
• Todas as atividades realizadas sob sua conta.
• Notificar-nos imediatamente sobre qualquer uso não autorizado.

Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos, sem aviso prévio em casos de infração grave.`,
  },
  {
    titulo: '7. Comentários e Interações',
    conteudo: `O portal oferece sistema de comentários nas notícias e chat no TigreFC. Ao utilizar essas funcionalidades, você concorda em não publicar:

• Conteúdo ofensivo, discriminatório, racista, misógino ou homofóbico.
• Spam, publicidade não solicitada ou links maliciosos.
• Informações falsas ou difamatórias sobre pessoas ou entidades.
• Conteúdo que viole direitos de terceiros.

Moderamos os comentários e podemos remover conteúdo que viole estas diretrizes sem aviso prévio.`,
  },
  {
    titulo: '8. Publicidade',
    conteudo: `O portal é financiado em parte por publicidade, incluindo anúncios veiculados pelo Google AdSense. Os anúncios exibidos são fornecidos por terceiros e não representam endosso do portal aos produtos ou serviços anunciados.

Conteúdos patrocinados e publi-editoriais são sempre claramente identificados como tal, em separado do jornalismo editorial.`,
  },
  {
    titulo: '9. Isenção de Responsabilidade',
    conteudo: `O portal se esforça para garantir a precisão das informações publicadas, mas não garante a completude ou exatidão de todos os conteúdos, especialmente aqueles relacionados a escalações, estatísticas e informações de partidas em tempo real.

O portal não se responsabiliza por: decisões tomadas com base em informações publicadas; indisponibilidade temporária do serviço; conteúdo de sites externos vinculados; ou danos resultantes do uso ou impossibilidade de uso dos serviços.`,
  },
  {
    titulo: '10. Modificações nos Termos',
    conteudo: `Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações significativas serão comunicadas por meio de aviso em destaque no portal. O uso continuado do portal após as alterações constitui aceitação dos novos termos.`,
  },
  {
    titulo: '11. Lei Aplicável e Foro',
    conteudo: `Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da Comarca de Novo Horizonte – SP como competente para dirimir quaisquer controvérsias decorrentes destes termos, com renúncia expressa a qualquer outro, por mais privilegiado que seja.`,
  },
  {
    titulo: '12. Contato',
    conteudo: `Para dúvidas, sugestões ou notificações relacionadas a estes Termos de Uso:

• E-mail: comoquefazmarketing@gmail.com
• Portal: www.onovorizontino.com.br/expediente-portal-o-novorizontino`,
  },
];

export default function TermosDeUsoPage() {
  const dataAtualizacao = '04 de maio de 2026';

  return (
    <main
      className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,900;1,700;1,900&display=swap');
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
      <header className="relative overflow-hidden pt-28 pb-16 px-6 text-center border-b border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(245,196,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,196,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-yellow-500/6 blur-[80px] rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/5">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em]">
              Regras & Condições
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-5">
            Termos de <span className="text-yellow-500">Uso</span>
          </h1>

          <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Última atualização: <strong className="text-white">{dataAtualizacao}</strong>
          </p>
          <p className="text-zinc-500 text-sm mt-2">
            Portal O Novorizontino · Como Que Faz Marketing Digital LTDA · CNPJ 43.945.464/0001-83
          </p>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-3xl mx-auto px-5 py-14 space-y-10">
        <p className="text-zinc-300 text-base leading-relaxed border-l-4 border-yellow-500 pl-5">
          Bem-vindo ao <strong className="text-white">Portal O Novorizontino</strong>. Estes Termos de Uso estabelecem as regras e condições para utilização do portal e de todos os seus serviços, incluindo o jogo TigreFC. Por favor, leia com atenção antes de utilizar nossos serviços.
        </p>

        {SECOES.map((secao) => (
          <section key={secao.titulo}>
            <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-yellow-500 mb-4 flex items-center gap-3">
              <span className="w-1 h-6 bg-yellow-500 rounded-full flex-shrink-0" />
              {secao.titulo}
            </h2>
            <div className="text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-line pl-4">
              {secao.conteudo}
            </div>
          </section>
        ))}

        {/* Footer da página */}
        <footer className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Portal O Novorizontino · CNPJ 43.945.464/0001-83
            </p>
            <p className="text-zinc-700 text-xs mt-1">
              Dúvidas? comoquefazmarketing@gmail.com
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/politica-de-privacidade" className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
              Privacidade
            </Link>
            <Link href="/expediente-portal-o-novorizontino" className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
              Expediente
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
