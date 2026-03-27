import HomeHero from '@/components/home/HomeHero'; 
import PostagensGrid from '@/components/layout/NewsGrid';
import MainVideoSection from '@/components/sections/MainVideoSection';
import MainShortsSection from '@/components/videos/MainShortsSection';
import NovorizontinoWidget from '@/components/widgets/NovorizontinoWidget';
import CategoryNav from '@/components/layout/CategoryNav';
import CTCarousel from '@/components/sections/CTCarousel';
import Footer from '@/components/layout/Footer';
import Manifesto from '@/components/sections/Manifesto';

export default async function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col scroll-smooth">
      <HomeHero />
      <CategoryNav />

      {/* REPORTAGEM ESPECIAL DE CAPA */}
      <article className="max-w-7xl mx-auto px-4 w-full py-16 border-b border-white/5">
        <header className="max-w-4xl mb-12">
          <span className="text-yellow-500 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Grande Reportagem • Edição Histórica</span>
          <h1 className="text-white text-5xl md:text-8xl font-black italic uppercase italic leading-[0.9] tracking-tighter">
            O TIGRE NA <span className="text-yellow-500">ERA DE OURO</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl mt-6 italic font-light leading-relaxed">
            Com a entrega do CT Gino de Biasi, o Grêmio Novorizontino consolida sua SAF e entra para o seletíssimo grupo de clubes com estrutura de padrão mundial no interior paulista.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* COLUNA DE TEXTO (ANÁLISE PROFUNDA) */}
          <div className="lg:col-span-7 space-y-8 text-gray-300 text-lg leading-relaxed">
            
            <section>
              <h2 className="text-white text-2xl font-black uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-yellow-500"></span>
                O Panorama do Interior
              </h2>
              <p>
                No competitivo xadrez do futebol paulista, a estrutura física é o que separa os clubes "ioiô" dos projetos sustentáveis. Até ontem, estruturas de ponta como a do <strong>Red Bull Bragantino</strong> em Atibaia ou a do <strong>Mirassol</strong> eram os benchmarks. Hoje, o Novorizontino não apenas se junta a eles, mas eleva o sarrafo com seus <strong>22 mil metros quadrados</strong> de tecnologia e inovação.
              </p>
            </section>

            <section className="bg-[#111] p-8 rounded-3xl border border-white/5 shadow-inner">
              <h2 className="text-yellow-500 text-xl font-black uppercase mb-4 italic">Lutando com os Gigantes</h2>
              <p className="mb-4">
                Como um clube de uma cidade de 40 mil habitantes consegue peitar orçamentos de capitais? A resposta está na <strong>gestão da SAF</strong> e agora na infraestrutura. Para o técnico <strong>Enderson Moreira</strong>, o novo CT elimina as "desculpas" e oferece condições de recuperação e análise que antes só eram encontradas no <em>Big Six</em> do Brasil. 
              </p>
              <p>
                A importância é estratégica: o clube para de gastar com locações externas e passa a atrair talentos da base que antes escolheriam os grandes da capital pela estrutura. Agora, o caminho para a Europa ou para a Seleção passa por <strong>Novo Horizonte</strong>.
              </p>
            </section>

            <section>
              <h2 className="text-white text-2xl font-black uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-yellow-500"></span>
                Impacto em Novo Horizonte
              </h2>
              <p>
                O impacto transcende as quatro linhas. A inauguração deste domingo movimenta a economia local, gera empregos especializados e coloca a cidade no mapa do turismo esportivo e de eventos técnicos. A <strong>Família Biasi</strong>, ao entregar este complexo, reafirma seu compromisso com o legado da região, transformando o Tigre em um embaixador global do interior paulista.
              </p>
            </section>

            <blockquote className="text-2xl font-black italic border-l-8 border-yellow-500 pl-6 text-white py-4 bg-gradient-to-r from-yellow-500/10 to-transparent uppercase">
              "Não é apenas um CT, é o manifesto de um clube que decidiu nunca mais ser pequeno."
            </blockquote>
          </div>

          {/* COLUNA DA GALERIA (STICKY) */}
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

      <section id="noticias">
        <PostagensGrid />
      </section>
<Manifesto />
      <section id="videos">
        <MainVideoSection />
        <MainShortsSection />
      </section>
      
      <div id="agenda" className="px-4 pb-10">
        <NovorizontinoWidget />
      </div>

      <Footer />
    </main>
  );
}
