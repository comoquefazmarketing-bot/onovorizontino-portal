export default function Hero() {
  return (
    <section className="relative w-full h-[400px] overflow-hidden border-b-8 border-yellow-500">
      <img 
        src="https://www.gremionovorizontino.com.br/wp-content/uploads/2024/03/DSC08493-1024x683.jpg" 
        className="w-full h-full object-cover opacity-40 scale-110"
        alt="Estádio Jorjão"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
      <div className="absolute inset-0 flex flex-col justify-center px-4 max-w-7xl mx-auto">
        <span className="text-yellow-500 font-black italic uppercase tracking-[0.3em] text-sm mb-4">
          A Força do Interior
        </span>
        <h2 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter text-white max-w-2xl">
          UNIDOS PELO <span className="text-yellow-500">MESMO</span> OBJETIVO
        </h2>
      </div>
    </section>
  );
}