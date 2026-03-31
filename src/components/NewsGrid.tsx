'use client'
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from 'next/link'

export default function NewsGrid() {
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/noticias")
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error("Erro ao buscar noticias:", err))
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts.map((post: any) => (
        <Link 
          key={post.id} 
          href={`/noticias/${post.slug || post.id}`} 
          className="group cursor-pointer block"
        >
          <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            <Image
              src={post.imagem_capa || "/jorjao.webp"}
              alt={post.titulo || "Notícia Tigre"}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          <h2 className="text-white text-sm mt-2 font-medium group-hover:text-yellow-500 transition-colors line-clamp-2">
            {post.titulo}
          </h2>
        </Link>
      ))}
    </div>
  )
}
