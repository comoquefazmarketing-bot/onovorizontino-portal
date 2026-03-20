export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-8 w-80">

      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
        <h3 className="text-[#FFD700] font-bold mb-4">
          Calculadora de Churrasco
        </h3>

        <button className="w-full bg-[#FFD700] text-black py-3 rounded-xl font-bold">
          Calcular
        </button>
      </div>

      <div className="border border-dashed border-zinc-800 h-64 rounded-3xl flex items-center justify-center text-zinc-600 text-xs">
        Publicidade
      </div>

    </aside>
  );
}
