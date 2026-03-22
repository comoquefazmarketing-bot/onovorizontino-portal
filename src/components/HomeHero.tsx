'use client'
import Image from "next/image"

export default function HomeHero() {
  return (
    <section className="relative w-full h-[60vh] overflow-hidden bg-black">
      <Image
        src="/jorjao.webp"
        alt="Jorjão"
        fill
        className="object-cover opacity-50"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"/>
    </section>
  )
}
