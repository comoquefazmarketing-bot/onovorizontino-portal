import Link from 'next/link';

export default function Header() {
  return (
    <div className="w-full flex justify-center py-8 bg-black">
      <Link href="/">
        <img 
          src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
          alt="Logo O Novorizontino" 
          className="h-28 md:h-40 w-auto object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.2)]" 
        />
      </Link>
    </div>
  );
}