export default function HomeHero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      {/* Imagem do Campo */}
      <img 
        E:\O Novorizontino\public\jorjao.webp
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        alt="Estádio Jorjão"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />

      {/* LOGO CENTRALIZADO DENTRO DO CAMPO */}
      <div className="relative z-10 flex flex-col items-center">
        <img 
          src="/assets/logos/LOGO - O NOVORIZONTINO.png" 
          className="h-32 md:h-52 w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          alt="Logo O Novorizontino"
        />
      </div>
    </section>
  );
}
