export default function HomeHero() {
  return (
    <section className="relative h-[35vh] w-full overflow-hidden flex items-center justify-center">
      {/* Imagem do Campo */}
      <img 
        src="/jorjao.webp" 
        className="absolute inset-0 w-full h-full object-cover object-center opacity-90"
        alt="Estádio Jorjão"
      />
      {/* Vinheta topo + base + laterais */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* LOGO GRANDE — DESTAQUE DA MARCA */}
      <div className="relative z-10 flex flex-col items-center">
        <img 
          src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
          className="h-44 md:h-64 w-auto object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]"
          alt="Logo O Novorizontino"
        />
      </div>
    </section>
  );
}
