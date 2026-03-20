import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-black border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link href="/" className="text-2xl md:text-3xl font-black italic text-[#FFD700]">
          O NOVORIZONTINO
        </Link>

        <nav className="hidden md:flex gap-8 text-xs font-bold uppercase text-zinc-400">
          <Link href="/">Home</Link>
          <Link href="/noticias">Notícias</Link>
          <Link href="/tigre-tv">Tigre TV</Link>
        </nav>

      </div>
    </header>
  );
}
