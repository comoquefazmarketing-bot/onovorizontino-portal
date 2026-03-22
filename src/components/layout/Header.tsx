import Link from 'next/link';
export default function Header() {
  return (
    <header className="w-full bg-black border-b border-yellow-500/20 sticky top-0 z-[100] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/assets/logos/logo.png" alt="Logo Tigre" className="h-14 w-auto object-contain" />
          <div className="flex flex-col leading-tight">
            <span className="text-white font-black italic text-xl tracking-tighter uppercase">O Novorizontino</span>
            <span className="text-yellow-500 text-[9px] font-bold tracking-[0.3em] uppercase">Portal Oficial</span>
          </div>
        </Link>
        <nav className="hidden md:flex gap-6 text-[10px] text-white font-black uppercase italic">
          <Link href="/" className="hover:text-yellow-500 transition-colors">Série B</Link>
          <Link href="/" className="hover:text-yellow-500 transition-colors">Paulistão</Link>
          <Link href="/" className="hover:text-yellow-500 transition-colors">Tigre TV</Link>
          <Link href="/" className="hover:text-yellow-500 transition-colors">Sócio</Link>
        </nav>
      </div>
    </header>
  );
}