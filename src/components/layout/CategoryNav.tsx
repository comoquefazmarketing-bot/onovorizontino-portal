'use client';
import Link from 'next/link';

const TIGRE_FC_LOGO = 'https://whoglnpvqjbaczgnebbn.supabase.co/storage/v1/object/public/imagens-portal/tigre-fc-logo.png';

export default function CategoryNav() {
  const mensagemWhatsapp = encodeURIComponent("Olá! Vim pelo Portal O Novorizontino e gostaria de informações sobre ingressos e produtos oficiais.");
  const linkWhatsapp = "https://wa.me/5517996091928?text=" + mensagemWhatsapp;

  const categories = [
    { name: 'Série B',   href: '#noticias' },
    { name: 'Paulistão', href: '#noticias' },
    { name: 'Tigre TV',  href: '#videos' },
    { name: 'Ingressos', href: linkWhatsapp, target: '_blank' },
    { name: 'Loja',      href: linkWhatsapp, target: '_blank' },
    { name: 'Escalação', href: '/escalacao' },
    { name: 'Tabela',    href: '#agenda' },
    // Nova categoria para a AJOR
    { name: 'Expediente', href: '/expediente-portal-o-novorizontino' },
  ];

  return (
    <nav className="w-full bg-black border-b border-white/5 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
          {categories.map((item) => {
            // Se for link externo (WhatsApp), usa <a>, se for interno usa <Link>
            const isExternal = item.href.startsWith('http') || item.href.startsWith('#');
            
            if (isExternal) {
              return (
                <a 
                  key={item.name} 
                  href={item.href} 
                  target={item.target || '_self'}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-yellow-500 transition-all whitespace-nowrap"
                >
                  {item.name}
                </a>
              );
            }

            return (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-yellow-500 transition-all whitespace-nowrap"
              >
                {item.name}
              </Link>
            );
          })}

          {/* Tigre FC — destaque especial */}
          <Link 
            href="/tigre-fc/sobre"
            className="flex items-center gap-1.5 bg-yellow-500 hover:bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full transition-all whitespace-nowrap flex-shrink-0"
          >
            <img src={TIGRE_FC_LOGO} alt="Tigre FC" width={12} height={12} style={{ objectFit:'contain' }} />
            Tigre FC
          </Link>
        </div>
      </div>
    </nav>
  );
}
