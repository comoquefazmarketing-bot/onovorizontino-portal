import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="group flex flex-col items-center gap-0">
      <div className="relative w-48 h-20 md:w-64 md:h-24">
        <Image 
          src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
          alt="O Novorizontino"
          fill
          className="object-contain"
          priority
          onError={(e) => console.log("Erro ao carregar imagem do logo")}
        />
      </div>
    </Link>
  );
}
