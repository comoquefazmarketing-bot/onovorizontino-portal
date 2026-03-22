import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="bg-black border-b border-yellow-500 p-4 flex gap-6">
      <Link href="/">Home</Link>
      <Link href="/noticias">Notícias</Link>
      <Link href="/videos">Vídeos</Link>
    </nav>
  )
}
