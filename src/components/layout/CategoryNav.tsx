'use client';

export default function CategoryNav() {
  const mensagemWhatsapp = encodeURIComponent("Olá! Vim pelo Portal O Novorizontino e gostaria de informações sobre ingressos e produtos oficiais.");
  const linkWhatsapp = "https://wa.me/5517996091928?text=" + mensagemWhatsapp;

  const categories = [
    { name: 'Série B', href: '#noticias' },
    { name: 'Paulistão', href: '#noticias' },
    { name: 'Tigre TV', href: '#videos' },
    { name: 'Ingressos', href: linkWhatsapp, target: '_blank' },
    { name: 'Loja', href: linkWhatsapp, target: '_blank' },
    { name: 'Escalação', href: '/escalacao' },
    { name: 'Tabela', href: '#agenda' }
  ];

  return (
    <nav className="w-full bg-black border-b border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-6 md:gap-10 overflow-x-auto no-scrollbar">
          {categories.map((item) => (
            <a 
              key={item.name} 
              href={item.href} 
              target={item.target || '_self'}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-yellow-500 transition-all whitespace-nowrap"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
