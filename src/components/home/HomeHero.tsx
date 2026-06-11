import Image from 'next/image';

export default function HomeHero() {
  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: '33vh', minHeight: '220px' }}>
      {/* Estádio — ocupa só 1/3 da altura da tela */}
      <Image
        src="/jorjao.webp"
        alt="Estádio Jorjão — Grêmio Novorizontino"
        fill
        priority
        className="object-cover object-center opacity-60"
        sizes="100vw"
      />
      {/* Gradientes laterais e vertical */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {/* Logo — grande e impactante como um rugido */}
      <div className="relative z-10 flex flex-col items-center px-4">
        <Image
          src="/assets/logos/LOGO - O NOVORIZONTINO.png"
          alt="Portal O Novorizontino — A Força do Interior"
          width={700}
          height={280}
          priority
          className="w-full max-w-[520px] md:max-w-[700px] h-auto object-contain drop-shadow-[0_0_40px_rgba(245,196,0,0.4)]"
        />
      </div>
    </section>
  );
}
