'use client';
export default function CentralJogos() {
  return (
    <div className="py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-6 bg-yellow-500 rounded-full" />
        <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Central de <span className="text-yellow-500">Jogos</span> <span className="text-gray-600 text-sm ml-2 tracking-widest">TEMPO REAL</span></h2>
      </div>
      <div className="w-full bg-white rounded-3xl overflow-hidden shadow-2xl min-h-[600px]">
        {/* Simulação do Iframe que você usa no print */}
        <iframe 
          src="https://www.google.com/search?q=novorizontino+agenda+de+jogos&igu=1" 
          className="w-full h-[800px] border-none"
        />
      </div>
      <div className="mt-4 text-center">
        <p className="text-[9px] text-gray-700 uppercase font-black tracking-[0.5em]">Felipe Makarios - Central de Dados 2026</p>
      </div>
    </div>
  );
}