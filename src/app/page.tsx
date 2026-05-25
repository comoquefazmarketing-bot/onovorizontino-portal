// src/app/page.tsx
import { Suspense } from 'react';
import HomeHero from '@/components/home/HomeHero';
import PostagensGrid from '@/components/layout/NewsGrid';
import CategoryNav from '@/components/layout/CategoryNav';
import CTCarousel from '@/components/sections/CTCarousel';
import Footer from '@/components/layout/Footer';
import Manifesto from '@/components/sections/Manifesto';
import GlobalAdBanner from '@/components/ads/GlobalAdBanner';
import SelecaoBanner from '@/components/sections/SelecaoBanner';

/* ─── JSON-LD: Organization + WebSite ───────────────────────────
   Sinaliza ao Google que este é um veículo jornalístico legítimo.
────────────────────────────────────────────────────────────────── */
const jsonLdOrganization = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  '@id': 'https://www.onovorizontino.com.br/#organization',
  name: 'Portal O Novorizontino',
  alternateName: 'O Novorizontino',
  url: 'https://www.onovorizontino.com.br',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.onovorizontino.com.br/assets/logos/LOGO%20-%20O%20NOVORIZONTINO.png',
    width: 512,
    height: 512,
  },
  description:
    'Portal de jornalismo digital independente dedicado à cobertura do Grêmio Novorizontino — o Tigre do Vale.',
  foundingDate: '2021',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Novo Horizonte',
    addressRegion: 'SP',
    addressCountry: 'BR',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'comoquefazmarketing@gmail.com',
    contactType: 'editorial',
  },
  sameAs: ['https://www.onovorizontino.com.br'],
};

const jsonLdWebSite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.onovorizontino.com.br/#website',
  url: 'https://www.onovorizontino.com.br',
  name: 'Portal O Novorizontino',
  publisher: { '@id': 'https://www.onovorizontino.com.br/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.onovorizontino.com.br/noticias?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

/* ═══ CENTRAL DE JOGOS (inline, conteúdo próprio, sem iframe) ═══
   Editável: mexa só no array JOGOS abaixo a cada rodada.
   Escudos extras: adicione a URL em escudoMandante/escudoVisitante,
   ou deixe em branco que aparece um badge com as iniciais.
──────────────────────────────────────────────────────────────── */
type Jogo = {
  id: string;
  competicao: string;
  rodada?: string;
  data: string;
  mandante: string;
  visitante: string;
  escudoMandante?: string;
  escudoVisitante?: string;
  local?: string;
  status: 'agendado' | 'encerrado';
  placarMandante?: number;
  placarVisitante?: number;
};

const ESCUDO = {
  novorizontino:
    'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/Escudo%20Novorizontino.png',
  ceara:
    'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/ESCUDO%20CEARA.png',
};

const JOGOS: Jogo[] = [
  {
    id: 'chapecoense-novorizontino-2705',
    competicao: 'Copa Sul-Sudeste',
    rodada: 'Semifinal · Volta',
    data: 'Qua, 27/05',
    mandante: 'Chapecoense',
    visitante: 'Novorizontino',
    escudoVisitante: ESCUDO.novorizontino,
    local: 'Arena Condá',
    status: 'agendado',
  },
  {
    id: 'novorizontino-ceara-2305',
    competicao: 'Série B',
    rodada: '10ª Rodada',
    data: 'Sáb, 23/05 · 16h',
    mandante: 'Novorizontino',
    visitante: 'Ceará',
    escudoMandante: ESCUDO.novorizontino,
    escudoVisitante: ESCUDO.ceara,
    local: 'Jorjão',
    status: 'encerrado',
    placarMandante: 2,
    placarVisitante: 1,
  },
  {
    id: 'novorizontino-botafogosp-1105',
    competicao: 'Série B',
    rodada: '8ª Rodada',
    data: 'Seg, 11/05',
    mandante: 'Novorizontino',
    visitante: 'Botafogo-SP',
    escudoMandante: ESCUDO.novorizontino,
    local: 'Jorjão',
    status: 'encerrado',
    placarMandante: 1,
    placarVisitante: 0,
  },
];

function Escudo({ src, nome }: { src?: string; nome: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={nome} className="w-9 h-9 object-contain" />;
  }
  const ini = nome.replace(/[^A-Za-zÀ-ÿ]/g, '').slice(0, 3).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
      <span className="text-[9px] font-black text-white tracking-tight">{ini}</span>
    </div>
  );
}

function CardJogo({ jogo }: { jogo: Jogo }) {
  const encerrado = jogo.status === 'encerrado';
  return (
    <div className="flex flex-col gap-3 p-5 bg-white/[0.03] border border-white/8 rounded-2xl">
      <div className="flex items-center justify-between gap-2">
        <span className="text-yellow-500 text-[9px] font-black uppercase tracking-[0.25em]">
          {jogo.competicao}
          {jogo.rodada ? ` · ${jogo.rodada}` : ''}
        </span>
        <span
          className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full shrink-0 ${
            encerrado ? 'bg-white/10 text-zinc-400' : 'bg-yellow-500 text-black'
          }`}
        >
          {encerrado ? 'Encerrado' : jogo.data}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Escudo src={jogo.escudoMandante} nome={jogo.mandante} />
          <span className="text-white text-sm font-black uppercase tracking-tight truncate">
            {jogo.mandante}
          </span>
        </div>

        <div className="shrink-0 px-2">
          {encerrado ? (
            <span className="text-white text-xl font-black italic whitespace-nowrap">
              {jogo.placarMandante} <span className="text-yellow-500">×</span> {jogo.placarVisitante}
            </span>
          ) : (
            <span className="text-zinc-500 text-sm font-black italic">VS</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-white text-sm font-black uppercase tracking-tight truncate text-right">
            {jogo.visitante}
          </span>
          <Escudo src={jogo.escudoVisitante} nome={jogo.visitante} />
        </div>
      </div>

      {jogo.local && (
        <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
          <span>📍</span>
          <span>{jogo.local}</span>
          {!encerrado && <span>· {jogo.data}</span>}
        </div>
      )}
    </div>
  );
}

function CentralJogos() {
  const proximos = JOGOS.filter(j => j.status === 'agendado');
  const resultados = JOGOS.filter(j => j.status === 'encerrado');

  return (
    <section id="agenda" className="py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-8 bg-yellow-500 rounded-full" />
        <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
          Central de Jogos
        </h2>
      </div>

      {proximos.length > 0 && (
        <div className="mb-10">
          <h3 className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4">
            Próximos jogos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proximos.map(j => (
              <CardJogo key={j.id} jogo={j} />
            ))}
          </div>
        </div>
      )}

      {resultados.length > 0 && (
        <div>
          <h3 className="text-zinc-500 text-[11px] font-black uppercase tracking-[0.3em] mb-4">
            Últimos resultados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resultados.map(j => (
              <CardJogo key={j.id} jogo={j} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

// ── Skeleton do grid de notícias ─────────────────────────────
function GridSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-1 h-7 bg-yellow-500/20 rounded-full block" />
        <div className="h-5 w-36 bg-white/5 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        <div className="md:col-span-7 aspect-video rounded-2xl bg-white/5" />
        <div className="md:col-span-5 flex flex-col gap-3 pt-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="flex gap-3 p-3">
              <div className="w-20 h-16 rounded-lg bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-2 w-14 bg-yellow-500/15 rounded" />
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-4/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="space-y-2">
            <div className="aspect-video rounded-2xl bg-white/5" />
            <div className="h-3 bg-white/5 rounded w-full" />
            <div className="h-3 bg-white/5 rounded w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Skeleton da TV Novorizontino ──────────────────────────────
function TVSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-red-600/20 rounded" />
          <div className="h-8 w-52 bg-white/5 rounded-lg" />
        </div>
        <div className="h-10 w-32 bg-red-600/20 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 aspect-video rounded-2xl bg-white/5" />
        <div className="md:col-span-2 grid grid-cols-1 gap-4">
          {[0, 1].map(i => (
            <div key={i} className="rounded-2xl bg-white/5 overflow-hidden">
              <div className="aspect-video bg-white/[0.03]" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-white/5 rounded w-full" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="rounded-2xl bg-white/5 overflow-hidden">
            <div className="aspect-video bg-white/[0.03]" />
            <div className="p-4 space-y-2">
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col scroll-smooth">
      {/* ── JSON-LD: Organization + WebSite ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
      />

      <HomeHero />
      <CategoryNav />

      {/* ── GRID DE NOTÍCIAS ─────────────────────────────────── */}
      <section id="noticias">
        <Suspense fallback={<GridSkeleton />}>
          <PostagensGrid />
        </Suspense>
      </section>

      {/* ── 🇧🇷 BANNER VERDE E AMARELO — SELEÇÃO BRASILEIRA ─── */}
      <SelecaoBanner />

      {/* ── REPORTAGEM CT GINO DE BIASI ──────────────────────── */}
      <article className="max-w-7xl mx-auto px-4 w-full py-16 border-b border-white/5">
        <header className="max-w-4xl mb-12">
          <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">
            Grande Reportagem • CT Gino de Biasi
          </span>
          <h2 className="text-white text-5xl md:text-8xl font-black italic uppercase leading-[0.9] tracking-tighter">
            O TIGRE NA <span className="text-yellow-500">ERA DE OURO</span>
          </h2>
          <p className="text-gray-400 text-xl md:text-2xl mt-6 italic font-light leading-relaxed">
            Com a entrega do CT Gino de Biasi, o Grêmio Novorizontino consolida sua SAF e entra para o seletíssimo grupo de clubes com estrutura de padrão mundial no interior paulista.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-8 text-gray-300 text-lg leading-relaxed">
            <section>
              <h3 className="text-white text-2xl font-black uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-yellow-500" />
                O Panorama do Interior
              </h3>
              <p>
                No competitivo xadrez do futebol paulista, a estrutura física é o que separa os clubes "ioiô" dos projetos sustentáveis. Até ontem, estruturas de ponta como a do <strong>Red Bull Bragantino</strong> em Atibaia ou a do <strong>Mirassol</strong> eram os benchmarks. Hoje, o Novorizontino não apenas se junta a eles, mas eleva o sarrafo com seus <strong>22 mil metros quadrados</strong> de tecnologia e inovação.
              </p>
            </section>
            <section className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-inner">
              <h3 className="text-yellow-500 text-xl font-black uppercase mb-4 italic">
                Lutando com os Gigantes
              </h3>
              <p className="mb-4">
                Como um clube de uma cidade de 40 mil habitantes consegue peitar orçamentos de capitais? A resposta está na <strong>gestão da SAF</strong> e agora na infraestrutura. Para o técnico <strong>Enderson Moreira</strong>, o novo CT elimina as "desculpas" e oferece condições que antes só eram encontradas no <em>Big Six</em> do Brasil.
              </p>
              <p>
                A importância é estratégica: o clube para de gastar com locações externas e passa a atrair talentos da base. Agora, o caminho para a Europa ou para a Seleção passa por <strong>Novo Horizonte</strong>.
              </p>
            </section>
            <section>
              <h3 className="text-white text-2xl font-black uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-yellow-500" />
                Impacto em Novo Horizonte
              </h3>
              <p>
                O impacto transcende as quatro linhas. A inauguração movimenta a economia local, gera empregos especializados e coloca a cidade no mapa do turismo esportivo. A <strong>Família Biasi</strong>, ao entregar este complexo, reafirma seu compromisso com o legado da região.
              </p>
            </section>
            <blockquote className="text-2xl font-black italic border-l-8 border-yellow-500 pl-6 text-white py-4 bg-gradient-to-r from-yellow-500/10 to-transparent uppercase">
              "Não é apenas um CT, é o manifesto de um clube que decidiu nunca mais ser pequeno."
            </blockquote>
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-28">
              <CTCarousel />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-[#111] p-4 rounded-xl">
                  <span className="text-yellow-500 font-bold text-2xl block tracking-tighter">22.000m²</span>
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Área Total</span>
                </div>
                <div className="bg-[#111] p-4 rounded-xl">
                  <span className="text-white font-bold text-2xl block tracking-tighter">PADRÃO FIFA</span>
                  <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Gramados</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* MANIFESTO */}
      <Manifesto />

      {/* ── SEÇÃO DE VÍDEOS ──────────────────────────────────── */}
      <section id="videos">
        {/* 1. Vídeos principais do portal */}
        <MainVideoSection />

        {/* 2. TV Novorizontino — RSS do canal oficial do clube */}
        <Suspense fallback={<TVSkeleton />}>
          <TVNovorizontino />
        </Suspense>

        {/* 3. Shorts — vídeos neutros de futebol / bastidores */}
        <MainShortsSection />
      </section>

      {/* ── AGENDA / CENTRAL DE JOGOS (conteúdo próprio, sem iframes) ── */}
      <div className="max-w-7xl mx-auto px-4 w-full pb-10">
        <CentralJogos />
      </div>

      {/* ── BANNER PUBLICITÁRIO — movido para o final da página ── */}
      <GlobalAdBanner />

      <Footer />
    </main>
  );
}
