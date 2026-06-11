'use client';
export default function CategoryNav() {
  const categories = ['Todas', 'Destaque', 'Pré-Jogo', 'Análise Tática', 'Notícias', 'Tigre TV'];
  return (
    <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-y border-white/5 py-5 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 flex justify-center gap-6 md:gap-10">
        {categories.map((cat) => (
          <button key={cat} className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 hover:text-yellow-500 transition-all border-b-2 border-transparent hover:border-yellow-500 pb-1">
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
}