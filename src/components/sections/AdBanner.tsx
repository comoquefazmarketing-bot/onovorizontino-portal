export default function AdBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12 text-center">
      <div className="w-full h-28 bg-zinc-800/30 border border-zinc-700 flex flex-col items-center justify-center text-zinc-500 italic group hover:border-yellow-500/50 transition-all cursor-pointer">
        <p className="text-[10px] uppercase font-bold tracking-widest mb-1">Espaço Publicitário</p>
        <p className="text-sm italic font-medium">Felipe Makarios: Departamento Comercial</p>
      </div>
    </section>
  );
}