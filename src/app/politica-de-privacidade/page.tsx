import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Portal O Novorizontino',
  description: 'Política de Privacidade do Portal O Novorizontino. Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.',
  openGraph: {
    title: 'Política de Privacidade | Portal O Novorizontino',
    description: 'Saiba como coletamos, usamos e protegemos seus dados pessoais.',
    url: 'https://www.onovorizontino.com.br/politica-de-privacidade',
    type: 'website',
  },
};

const SECOES = [
  {
    titulo: '1. Quem Somos',
    conteudo: `O Portal O Novorizontino é um veículo de jornalismo digital independente dedicado à cobertura do Grêmio Novorizontino, mantido pela Como Que Faz Marketing Digital LTDA (CNPJ 43.945.464/0001-83), com sede em Novo Horizonte – SP, Brasil. Para contato: comoquefazmarketing@gmail.com.`,
  },
  {
    titulo: '2. Dados que Coletamos',
    conteudo: `Coletamos dados apenas quando necessários para a prestação de nossos serviços:

• Dados de navegação: endereço IP (anonimizado), páginas visitadas, tempo de permanência, tipo de dispositivo e navegador — coletados automaticamente pelo Google Analytics 4 para fins de análise de audiência.
• Dados de cadastro (TigreFC): ao criar uma conta no jogo TigreFC, coletamos nome de usuário, endereço de e-mail e, opcionalmente, nome de display — fornecidos diretamente pelo usuário via autenticação Google (Supabase Auth).
• Cookies e tecnologias similares: utilizamos cookies de sessão, preferências e cookies de terceiros (Google Analytics, Google AdSense) para personalizar a experiência e veicular anúncios relevantes.`,
  },
  {
    titulo: '3. Como Usamos seus Dados',
    conteudo: `Seus dados são utilizados exclusivamente para:

• Operar e melhorar o portal, analisando métricas de audiência (Google Analytics 4, ID: G-J10P2E3X5X).
• Personalizar sua experiência no jogo TigreFC (rankings, perfil, histórico de escalações).
• Veicular anúncios relevantes por meio da rede Google AdSense (ID: ca-pub-8594673486819604), que pode usar cookies para exibir anúncios com base em visitas anteriores ao nosso site ou a outros sites.
• Enviar comunicações sobre novidades do portal, apenas quando você optar por recebê-las.`,
  },
  {
    titulo: '4. Google AdSense e Publicidade',
    conteudo: `Utilizamos o Google AdSense para exibir anúncios em nosso portal. O Google, como fornecedor terceirizado, usa cookies para veicular anúncios com base nas visitas anteriores dos usuários ao nosso site ou a outros sites na Internet.

Os usuários podem desativar o uso de cookies pelo Google para publicidade baseada em interesses, acessando as Configurações de anúncios do Google (https://www.google.com/settings/ads). Alternativamente, é possível optar por não usar cookies de terceiros para publicidade baseada em interesses acessando o site aboutads.info.

Nossas relações com parceiros de publicidade estão listadas em nosso arquivo ads.txt, acessível em https://www.onovorizontino.com.br/ads.txt.`,
  },
  {
    titulo: '5. Google Analytics',
    conteudo: `Utilizamos o Google Analytics 4 para entender como os visitantes interagem com o nosso portal. As informações geradas pelo cookie sobre o uso do site são transmitidas e armazenadas pelo Google. Utilizamos o recurso de anonimização de IP, de forma que seu endereço IP é truncado antes de ser armazenado.

Você pode desativar o uso do Google Analytics instalando o complemento do navegador para desativação do Google Analytics (https://tools.google.com/dlpage/gaoptout).`,
  },
  {
    titulo: '6. Compartilhamento de Dados',
    conteudo: `Não vendemos, alugamos nem compartilhamos seus dados pessoais com terceiros, exceto:

• Provedores de serviço essenciais: Supabase (banco de dados e autenticação), Vercel (hospedagem) — todos sob contratos que garantem a proteção dos dados.
• Google (Analytics e AdSense): conforme descrito nas seções anteriores, em conformidade com a Política de Privacidade do Google.
• Autoridades legais: quando exigido por lei ou ordem judicial válida.`,
  },
  {
    titulo: '7. Seus Direitos (LGPD)',
    conteudo: `Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem os seguintes direitos:

• Confirmação da existência de tratamento de seus dados pessoais.
• Acesso aos seus dados pessoais.
• Correção de dados incompletos, inexatos ou desatualizados.
• Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a LGPD.
• Portabilidade dos dados a outro fornecedor de serviço.
• Eliminação dos dados pessoais tratados com seu consentimento.
• Informação sobre as entidades públicas e privadas com as quais compartilhamos seus dados.
• Revogação do consentimento a qualquer momento.

Para exercer qualquer um desses direitos, entre em contato: comoquefazmarketing@gmail.com`,
  },
  {
    titulo: '8. Retenção de Dados',
    conteudo: `Mantemos seus dados pelo tempo necessário para cumprir as finalidades descritas nesta política ou conforme exigido por lei. Dados de conta do TigreFC são mantidos enquanto a conta estiver ativa. Você pode solicitar a exclusão de sua conta e dados associados a qualquer momento pelo e-mail acima.`,
  },
  {
    titulo: '9. Segurança',
    conteudo: `Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado, alteração, divulgação ou destruição. Nosso banco de dados é hospedado no Supabase com criptografia em repouso e em trânsito. Acesso administrativo é restrito a membros autorizados da equipe.`,
  },
  {
    titulo: '10. Cookies',
    conteudo: `Utilizamos os seguintes tipos de cookies:

• Cookies essenciais: necessários para o funcionamento básico do site (ex.: sessão de autenticação no TigreFC).
• Cookies analíticos: Google Analytics 4 para análise de audiência (podem ser desativados).
• Cookies de publicidade: Google AdSense para exibição de anúncios relevantes (podem ser desativados nas configurações do Google).
• Cookies de preferências: armazenam suas preferências de consentimento (LGPD).

Você pode controlar e/ou excluir cookies conforme desejar. Para detalhes, consulte aboutcookies.org. Você pode excluir todos os cookies já armazenados em seu computador e configurar a maioria dos navegadores para bloqueá-los. Nesse caso, você pode ter que ajustar manualmente algumas preferências sempre que visitar um site.`,
  },
  {
    titulo: '11. Links Externos',
    conteudo: `Nosso portal pode conter links para sites externos. Não nos responsabilizamos pelas práticas de privacidade desses sites. Recomendamos que você leia as políticas de privacidade de qualquer site que visitar.`,
  },
  {
    titulo: '12. Alterações nesta Política',
    conteudo: `Podemos atualizar esta Política de Privacidade periodicamente. A data da última atualização é indicada no início desta página. Recomendamos que você revise esta política regularmente. Alterações significativas serão comunicadas por meio de aviso em destaque no portal.`,
  },
  {
    titulo: '13. Contato',
    conteudo: `Para dúvidas, solicitações ou reclamações sobre esta política ou sobre o tratamento de seus dados, entre em contato:

• E-mail: comoquefazmarketing@gmail.com
• Portal: www.onovorizontino.com.br
• Responsável pelo tratamento de dados: Felipe Makarios — Editor-Chefe & DPO`,
  },
];

export default function PoliticaPrivacidadePage() {
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
              LGPD · Lei nº 13.709/2018
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-5">
            Política de <span className="text-yellow-500">Privacidade</span>
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
          Esta Política de Privacidade descreve como o <strong className="text-white">Portal O Novorizontino</strong> coleta, usa, armazena e protege suas informações pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018) e o Regulamento Geral sobre a Proteção de Dados (RGPD/GDPR). Ao utilizar nosso portal, você concorda com as práticas descritas neste documento.
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
            <Link href="/termos-de-uso" className="text-zinc-600 hover:text-yellow-500 text-[10px] font-black uppercase tracking-widest transition-colors no-underline">
              Termos de Uso
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
