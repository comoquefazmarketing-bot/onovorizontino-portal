'use client'
import { useEffect, useState } from "react"
import Image from "next/image"

export default function NewsGrid() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("/api/noticias")
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {posts.map((post:any) => (
        <div key={post.id} className="group cursor-pointer">
          <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden">
            <Image
              src={post.imagem_capa || "/jorjao.webp"}
              alt={post.titulo}
              fill
              className="object-cover group-hover:scale-110 transition"
            />
          </div>

          <h2 className="text-white text-sm mt-2 group-hover:text-yellow-500">
            {post.titulo}
          </h2>
        </div>
      ))}
    </div>
  )
}
