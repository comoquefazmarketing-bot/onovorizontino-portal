import Link from 'next/link';

export default function Navbar() {
  const menuItems = [
    { name: 'Início', href: '/' },
    { name: 'Notícias', href: '/noticias' },
    { name: 'Jogos', href: '/jogos' },
    { name: 'Tabela', href: '/tabela' },
    { name: 'Elenco', href: '/elenco' },
    { name: 'Vídeos', href: '/videos' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-yellow-500/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">

          <ul className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar py-2">
            {menuItems.map((item) => (
              <li key={item.name} className="flex-shrink-0">
                <Link
                  href={item.href}
                  className="text-xs md:text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-yellow-500 transition-all duration-300 hover:scale-110 block origin-center italic"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex text-zinc-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <Link
              href="/tigre-fc"
              className="flex items-center gap-2 bg-yellow-500 hover:bg-white text-black text-[10px] font-black px-3 py-2 rounded-full uppercase tracking-tighter transition-all hover:scale-105"
            >
              <img
                src="https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png"
                alt="Tigre FC"
                width={16}
                height={16}
                style={{ objectFit: 'contain' }}
              />
              <span>Tigre FC</span>
            </Link>
          </div>

        </div>
      </div>

      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
    </nav>
  );
}
