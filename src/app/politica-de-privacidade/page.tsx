// src/app/politica-de-privacidade/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Portal O Novorizontino',
  description:
    'Política de Privacidade do Portal O Novorizontino: como tratamos cookies, dados e publicidade (Google AdSense), em conformidade com a LGPD.',
  alternates: { canonical: 'https://www.onovorizontino.com.br/politica-de-privacidade' },
  robots: { index: true, follow: true },
};

const ATUALIZADO_EM = '25 de maio de 2026';

export default function PoliticaPrivacidadePage() {
  return (
    <main
      className="min-h-screen bg-black text-white selection:bg-yellow-500 selection:text-black"
      style={{ fontFamily: "'Barlow Condensed', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&display=swap');`}</style>

      {/* Botão voltar */}
      <div className="fixed top-6 left-5 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 bg-black/50 hover:bg-yellow-500 border border-white/15 hover:border-yellow-500 backdrop-blur-md px-4 py-2 rounded-full text-white hover:text-black text-[10px] font-black uppercase tracking-widest transition-all duration-300 no-underline"
        >
          ← Início
        </Link>
      </div>

      {/* Hero */}
      <header className="relative overflow-hidden pt-28 pb-16 px-6 text-center border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-500/8 blur-[80px] rounded-full" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <span className="text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] block mb-5">
            Transparência & Privacidade
          </span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] mb-5">
            Política de <span className="text-yellow-500">Privacidade</span>
          </h1>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
            Última atualização: {ATUALIZADO_EM}
          </p>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-5 py-16 space-y-12 text-zinc-300 text-base md:text-lg leading-relaxed">
        {/* 1 */}
        <Secao titulo="1. Quem somos">
          <p>
            O <strong className="text-white">Portal O Novorizontino</strong> (acessível em www.onovorizontino.com.br) é um veículo de jornalismo digital independente mantido pela <strong className="text-white">Como Que Faz Marketing Digital LTDA</strong>, inscrita no CNPJ <strong className="text-white">43.945.464/0001-83</strong>, com sede em Novo Horizonte – SP, Brasil. Para os fins da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 – LGPD), somos o <strong className="text-white">controlador</strong> dos dados pessoais tratados neste site.
          </p>
          <p>
            Esta Política explica quais dados coletamos, como os utilizamos, com quem os compartilhamos e quais são os seus direitos. Ao continuar navegando, você reconhece estar ciente das práticas aqui descritas.
          </p>
        </Secao>

        {/* 2 */}
        <Secao titulo="2. Dados que coletamos">
          <p>Coletamos dados em duas situações:</p>
          <p>
            <strong className="text-white">Automaticamente</strong>, durante a navegação: endereço IP, tipo e versão do navegador, dispositivo, sistema operacional, páginas visitadas, tempo de permanência, site de origem e dados aproximados de localização, por meio de cookies e tecnologias semelhantes.
          </p>
          <p>
            <strong className="text-white">De forma voluntária</strong>, quando você nos envia uma mensagem ou entra em contato — por exemplo, seu nome e e-mail. Não exigimos cadastro para a leitura do conteúdo editorial.
          </p>
        </Secao>

        {/* 3 */}
        <Secao titulo="3. Cookies e tecnologias de rastreamento">
          <p>
            Cookies são pequenos arquivos armazenados no seu navegador. Utilizamos cookies <strong className="text-white">essenciais</strong> (necessários ao funcionamento do site), <strong className="text-white">de medição</strong> (para entender como o site é usado) e <strong className="text-white">de publicidade</strong> (para exibir anúncios). Você pode gerenciar ou bloquear cookies nas configurações do seu navegador, ciente de que isso pode afetar partes da experiência.
          </p>
        </Secao>

        {/* 4 — AdSense (cláusula obrigatória) */}
        <Secao titulo="4. Publicidade e Google AdSense">
          <p>
            Este site utiliza o <strong className="text-white">Google AdSense</strong>, serviço de publicidade fornecido pela Google, para exibir anúncios e sustentar o jornalismo independente.
          </p>
          <p>
            Fornecedores terceiros, <strong className="text-white">incluindo o Google, utilizam cookies para veicular anúncios</strong> com base em visitas anteriores do usuário a este site ou a outros sites na internet. O uso desses cookies de publicidade permite que o Google e seus parceiros exibam anúncios mais relevantes para você.
          </p>
          <p>
            Você pode <strong className="text-white">desativar a publicidade personalizada</strong> a qualquer momento, acessando as Configurações de anúncios do Google em{' '}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-yellow-500 underline">
              adssettings.google.com
            </a>
            . Para desativar cookies de publicidade de outros fornecedores terceiros, visite{' '}
            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-yellow-500 underline">
              aboutads.info
            </a>{' '}
            ou{' '}
            <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-yellow-500 underline">
              youronlinechoices.com
            </a>
            .
          </p>
          <p>
            Para saber como o Google trata os dados quando você utiliza sites e aplicativos de seus parceiros, consulte:{' '}
            <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-yellow-500 underline">
              Como o Google usa informações de sites ou apps que utilizam seus serviços
            </a>
            .
          </p>
        </Secao>

        {/* 5 */}
        <Secao titulo="5. Medição de audiência">
          <p>
            Podemos utilizar ferramentas de análise (como o Google Analytics) para medir audiência e melhorar o conteúdo. Esses serviços coletam dados de navegação de forma agregada e pseudonimizada, por meio de cookies próprios. As informações ajudam a entender quais conteúdos são mais relevantes para os leitores.
          </p>
        </Secao>

        {/* 6 */}
        <Secao titulo="6. Finalidades e base legal (LGPD)">
          <p>Tratamos seus dados para as seguintes finalidades:</p>
          <p>
            Operar e proteger o site; medir e melhorar a experiência e o conteúdo; exibir publicidade que sustenta o veículo; e responder a contatos. As bases legais aplicáveis são o <strong className="text-white">consentimento</strong> (para cookies não essenciais e publicidade personalizada), o <strong className="text-white">legítimo interesse</strong> (para segurança e medição) e o <strong className="text-white">cumprimento de obrigação legal</strong>, quando aplicável.
          </p>
        </Secao>

        {/* 7 */}
        <Secao titulo="7. Compartilhamento de dados">
          <p>
            Não vendemos seus dados pessoais. Podemos compartilhar dados de navegação com fornecedores que viabilizam o funcionamento do site, como Google (AdSense e Analytics) e provedores de hospedagem, sempre limitados às finalidades descritas nesta Política. Esses parceiros tratam os dados conforme suas próprias políticas de privacidade.
          </p>
        </Secao>

        {/* 8 */}
        <Secao titulo="8. Seus direitos">
          <p>
            Nos termos da LGPD, você pode, a qualquer momento, solicitar: confirmação da existência de tratamento; acesso aos seus dados; correção de dados incompletos ou desatualizados; anonimização, bloqueio ou eliminação de dados desnecessários; portabilidade; informação sobre compartilhamento; e revogação do consentimento. Para exercer esses direitos, entre em contato pelo e-mail informado ao final desta Política.
          </p>
        </Secao>

        {/* 9 */}
        <Secao titulo="9. Gerenciamento de cookies">
          <p>
            Você controla os cookies pelo seu navegador, podendo aceitá-los, recusá-los ou apagá-los. A recusa de cookies de publicidade não impede a exibição de anúncios, mas estes deixarão de ser personalizados. Instruções específicas estão disponíveis na central de ajuda do navegador que você utiliza.
          </p>
        </Secao>

        {/* 10 */}
        <Secao titulo="10. Segurança">
          <p>
            Adotamos medidas técnicas e organizacionais razoáveis para proteger os dados contra acesso não autorizado, perda ou uso indevido. Nenhum método de transmissão pela internet é 100% seguro, mas trabalhamos para preservar a integridade das informações.
          </p>
        </Secao>

        {/* 11 */}
        <Secao titulo="11. Menores de idade">
          <p>
            O conteúdo deste site não é direcionado a crianças menores de 13 anos e não coletamos intencionalmente dados pessoais desse público. Caso identifiquemos tal coleta, os dados serão eliminados.
          </p>
        </Secao>

        {/* 12 */}
        <Secao titulo="12. Links para sites de terceiros">
          <p>
            Nosso conteúdo pode conter links para sites externos. Não nos responsabilizamos pelas práticas de privacidade desses sites e recomendamos a leitura das respectivas políticas.
          </p>
        </Secao>

        {/* 13 */}
        <Secao titulo="13. Alterações nesta Política">
          <p>
            Esta Política pode ser atualizada periodicamente. A data da última revisão está indicada no topo desta página. Recomendamos a consulta regular para acompanhar eventuais mudanças.
          </p>
        </Secao>

        {/* 14 */}
        <Secao titulo="14. Contato">
          <p>
            Para dúvidas, solicitações relativas a dados pessoais ou exercício de direitos previstos na LGPD, fale conosco:
          </p>
          <p>
            <a href="mailto:redacao@onovorizontino.com.br" className="text-yellow-500 underline font-black">
              redacao@onovorizontino.com.br
            </a>
            <br />
            <span className="text-zinc-500">
              Como Que Faz Marketing Digital LTDA · CNPJ 43.945.464/0001-83 · Novo Horizonte – SP, Brasil
            </span>
          </p>
        </Secao>
      </article>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-5 pb-16 pt-6 border-t border-white/5">
        <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Portal O Novorizontino · CNPJ 43.945.464/0001-83
        </p>
        <Link
          href="/"
          className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors no-underline mt-2 inline-block"
        >
          ← Voltar ao Portal
        </Link>
      </footer>
    </main>
  );
}

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-white flex items-center gap-3">
        <span className="w-1 h-6 bg-yellow-500 rounded-full shrink-0" />
        {titulo}
      </h2>
      {children}
    </section>
  );
}
