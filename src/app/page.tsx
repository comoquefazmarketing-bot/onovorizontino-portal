import Header from '@/components/layout/Header';
import HomeHero from '@/components/home/HomeHero'; 
import PostagensGrid from '@/components/layout/NewsGrid';
import MainVideoSection from '@/components/sections/MainVideoSection';
import MainShortsSection from '@/components/videos/MainShortsSection';
import BannerMaster from '@/components/BannerMaster'; // Importado para usar no final
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      {/* 1. Topo do Site (Header + Banner do EstÃ¡dio) */}
      <Header />
      <HomeHero />

      {/* 2. ConteÃºdo Principal (Grid de MatÃ©rias com PrÃ©-Jogo em destaque) */}
      <PostagensGrid />

      {/* 3. SeÃ§Ã£o de VÃ­deos e Shorts */}
      <MainVideoSection />
      <MainShortsSection />

      {/* 4. Banner Master (O Tigre - Reordenado para o FINAL) */}
      <BannerMaster />

      {/* 5. RodapÃ© */}
      <Footer />
    </main>
  );
}
// Deploy Force: Layout Vertical v1.0.1

// Force redeploy with clean env vars - 03/22/2026 02:19:54
