import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-black flex justify-center py-6 border-b border-yellow-500/10">
      <Link href="/" className="transition-transform hover:scale-105 duration-300">
        <img 
          src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
          alt="Logo O Novorizontino" 
          className="h-24 md:h-36 w-auto object-contain" 
        />
      </Link>
    </header>
  );
}