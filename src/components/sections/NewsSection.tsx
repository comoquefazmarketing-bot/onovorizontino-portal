import Link from "next/link";
export default function NewsSection({ noticia }: { noticia: any }) {
  if (!noticia) return null;
  let tituloLimpo = noticia.titulo;
  try { if (noticia.titulo.startsWith("{")) { tituloLimpo = JSON.parse(noticia.titulo.replace(/""/g, "\"")).titulo; } } catch (e) {}

  return (
    <section className="py-12">
      <Link href={`/post/${noticia.id}`} className="group relative block overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800">
        <div className="aspect-video md:h-[550px] w-full relative">
          <img src={noticia.imagem_capa || "/jorjao.webp"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-10 w-full">
            <span className="bg-yellow-500 text-black font-black px-4 py-1 italic text-xs uppercase mb-4 inline-block tracking-widest">{noticia.categoria || "TIGRE"}</span>
            <h1 className="text-white text-4xl md:text-6xl font-black italic uppercase leading-[0.9] drop-shadow-2xl">{tituloLimpo}</h1>
          </div>
        </div>
      </Link>
    </section>
  );
}