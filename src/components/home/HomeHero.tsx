import Image from 'next/image';

export default function HomeHero() {
  return (
    <section className="relative h-[80vh] w-full overflow-hidden flex items-center justify-center">
      <Image src="/jorjao.webp" alt="Estádio Jorjão — Grêmio Novorizontino" fill priority className="object-cover opacity-80" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      <div className="relative z-10 flex flex-col items-center">
        <Image src="/assets/logos/LOGO - O NOVORIZONTINO.png" alt="Portal O Novorizontino — A Força do Interior" width={400} height={200} priority className="h-32 md:h-52 w-auto object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]" />
      </div>
    </section>
  );
}
