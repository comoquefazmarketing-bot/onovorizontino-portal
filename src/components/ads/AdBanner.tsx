import Image from 'next/image';
import adsData from '@/data/comercial.json';

interface AdBannerProps {
  posicao: 'horizontal' | 'square';
  index?: number;
}

export default function AdBanner({ posicao, index = 0 }: AdBannerProps) {
  // Filtra os banners pela posição e que estejam ativos
  const banner = adsData.banners.filter(b => b.posicao === posicao && b.ativo)[index];

  if (!adsData.configuracoes.exibirPublicidade || !banner) return null;

  return (
    <div className="w-full py-12 group">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-700 group-hover:text-yellow-500 transition-colors">
          Espaço Publicitário • {banner.cliente}
        </span>
      </div>

      <a href={banner.link} target="_blank" rel="noopener noreferrer" className="block relative overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 group-hover:border-yellow-500 transition-all duration-500">
        <div className={`relative w-full ${posicao === 'horizontal' ? 'aspect-[3/1]' : 'aspect-square'}`}>
          <Image 
            src={banner.imagemUrl} 
            alt={banner.cliente}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
          />
        </div>
        
        {/* Efeito de Brilho 'Tum Dum' */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </a>
    </div>
  );
}
