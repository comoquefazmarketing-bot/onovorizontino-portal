import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-yellow-500">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Coluna 1: Branding e Manifesto */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">
              O <span className="text-yellow-500">Novorizontino</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-md font-medium">
              O maior portal independente de notícias do Grêmio Novorizontino. Informação com garra, 
              pragmatismo e a ferocidade de quem vive o dia a dia do Tigre do Vale. 
              Aqui, a notícia não espera, ela acontece.
            </p>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div>
            <h3 className="text-yellow-500 font-black uppercase text-xs tracking-[0.3em] mb-6">Mapa do Site</h3>
            <ul className="space-y-3">
              {['Notícias', 'Tabela', 'Elenco', 'Vídeos', 'História'].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm font-bold uppercase italic">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Contato e Autoridade */}
          <div>
            <h3 className="text-yellow-500 font-black uppercase text-xs tracking-[0.3em] mb-6">Redação</h3>
            <p className="text-zinc-400 text-sm font-bold uppercase mb-2">Felipe Makarios</p>
            <p className="text-zinc-500 text-xs mb-4">Editor-Chefe & Criador</p>
            <div className="flex flex-col gap-2">
               <a href="mailto:contato@onovorizontino.com.br" className="text-zinc-400 hover:text-yellow-500 text-xs transition-colors">
                 contato@onovorizontino.com.br
               </a>
               <div className="flex gap-4 mt-4">
                  {/* Ícones Simbolizados */}
                  <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors cursor-pointer group">
                     <span className="text-xs group-hover:text-black font-black">IG</span>
                  </div>
                  <div className="w-8 h-8 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors cursor-pointer group">
                     <span className="text-xs group-hover:text-black font-black">YT</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Barra Inferior Final */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
            © {currentYear} O NOVORIZONTINO • TODOS OS DIREITOS RESERVADOS
          </p>
          <div className="flex items-center gap-2">
             <span className="text-zinc-600 text-[10px] uppercase tracking-widest">Desenvolvido por</span>
             <span className="text-white text-[10px] font-black italic tracking-tighter uppercase border-b border-yellow-500">
               Felipe Makarios
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
