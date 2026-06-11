import HomeHero from '@/components/home/HomeHero'; 
import CategoryNav from '@/components/layout/CategoryNav';
import HomeNewsGrid from '@/components/layout/HomeNewsGrid';
// AQUI ESTAVA O ERRO: Mudamos de 'widgets' para 'videos'
import MainShortsSection from '@/components/videos/MainShortsSection'; 
import NovorizontinoWidget from '@/components/widgets/NovorizontinoWidget';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      {/* 1. O TOPO (HERO) */}
      <HomeHero />
      
      {/* 2. NAVEGAÇÃO */}
      <CategoryNav />

      {/* 3. GRID DE NOTÍCIAS (O que você já tem pronto) */}
      <section className="max-w-7xl mx-auto px-4">
        <HomeNewsGrid />
      </section>

      {/* 4. SHORTS DO TIGRE (O que você já tem pronto) */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <MainShortsSection />
      </div>

      {/* 5. RODAPÉ COMERCIAL */}
      <footer className="py-20 border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6">
          <img src="/assets/logos/LOGO - O NOVORIZONTINO.png" className="h-10 opacity-30" />
          <p className="text-gray-600 text-[9px] uppercase tracking-widest italic">
            © 2026 O Novorizontino - Felipe Makarios
          </p>
        </div>
      </footer>
    </main>
  );
}