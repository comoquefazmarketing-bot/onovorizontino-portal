import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-black border-b border-yellow-500/20 sticky top-0 z-[100] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/assets/logos/logo.png" alt="Logo Tigre" className="h-14 w-auto" />
          <div className="flex flex-col">
            <span className="text-white font-black italic text-xl leading-none tracking-tighter">O NOVORIZONTINO</span>
            <span className="text-yellow-500 text-[10px] font-bold tracking-[0.3em]">PORTAL OFICIAL</span>
          </div>
        </Link>
        <div className="hidden md:flex gap-6 text-white font-bold text-xs uppercase italic">
          <Link href="/" className="hover:text-yellow-500 transition-colors">Notícias</Link>
          <Link href="/" className="hover:text-yellow-500 transition-colors">O Clube</Link>
          <Link href="/" className="hover:text-yellow-500 transition-colors">Sócio</Link>
        </div>
      </div>
    </header>
  );
}