import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-black border-b border-yellow-500/20 sticky top-0 z-[100] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/assets/logos/logo.png" alt="Logo Tigre" className="h-14 w-auto object-contain" />
          <div className="flex flex-col leading-none">
            <span className="text-white font-black italic text-xl tracking-tighter uppercase">O NOVORIZONTINO</span>
            <span className="text-yellow-500 text-[10px] font-bold tracking-[0.3em] uppercase">PORTAL OFICIAL</span>
          </div>
        </Link>
        <nav className="hidden md:flex gap-6 text-[10px] text-white/70 font-bold uppercase tracking-widest items-center">
          <Link href="/" className="hover:text-white transition-colors">SÉRIE B</Link>
          <Link href="/" className="hover:text-white transition-colors">PAULISTÃO</Link>
          <Link href="/" className="hover:text-white transition-colors">TIGRE TV</Link>
          <Link href="/" className="hover:text-white transition-colors">INGRESSOS</Link>
          <Link href="/" className="hover:text-white transition-colors">LOJA</Link>
          <Link href="/" className="hover:text-white transition-colors">SÓCIO</Link>
          <Link href="/" className="hover:text-white transition-colors border-l border-white/20 pl-6 uppercase">Tabela</Link>
        </nav>
      </div>
    </header>
  );
}