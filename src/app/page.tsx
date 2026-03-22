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
      {/* 1. Topo do Site (Header + Banner do Estádio) */}
      <Header />
      <HomeHero />

      {/* 2. Conteúdo Principal (Grid de Matérias com Pré-Jogo em destaque) */}
      <PostagensGrid />

      {/* 3. Seção de Vídeos e Shorts */}
      <MainVideoSection />
      <MainShortsSection />

      {/* 4. Banner Master (O Tigre - Reordenado para o FINAL) */}
      <BannerMaster />

      {/* 5. Rodapé */}
      <Footer />
    </main>
  );
}